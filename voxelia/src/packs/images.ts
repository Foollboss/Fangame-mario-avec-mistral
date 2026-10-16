/**
 * Images des packs de ressources : décodage PNG (tous types de couleur, 1 à 16 bits,
 * entrelacement Adam7) et TGA (packs Bedrock), puis opérations simples sur des images
 * RGBA (découpe, réduction par filtre « boîte », découpage d'animations, saturation).
 * Code pur (sans DOM) : utilisable dans le navigateur comme dans les outils de test.
 */
import { unzlibSync } from 'fflate';

export interface RGBAImage {
  width: number;
  height: number;
  /** Pixels RGBA 8 bits, non prémultipliés, ligne par ligne. */
  data: Uint8Array;
}

export function blankImage(width: number, height: number): RGBAImage {
  return { width, height, data: new Uint8Array(width * height * 4) };
}

// ------------------------------------------------------------------ PNG

const PNG_SIG = [137, 80, 78, 71, 13, 10, 26, 10];
const ADAM7 = [
  [0, 0, 8, 8],
  [4, 0, 8, 8],
  [0, 4, 4, 8],
  [2, 0, 4, 4],
  [0, 2, 2, 4],
  [1, 0, 2, 2],
  [0, 1, 1, 2],
];

export function isPng(b: Uint8Array): boolean {
  if (b.length < 8) return false;
  for (let i = 0; i < 8; i++) if (b[i] !== PNG_SIG[i]) return false;
  return true;
}

/** Taille d'un PNG sans le décoder (en-tête IHDR). */
export function pngSize(b: Uint8Array): { width: number; height: number } | null {
  if (!isPng(b) || b.length < 24) return null;
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  return { width: v.getUint32(16), height: v.getUint32(20) };
}

/** Décode un PNG en RGBA 8 bits. Lève une erreur si le fichier est invalide. */
export function decodePng(bytes: Uint8Array): RGBAImage {
  if (!isPng(bytes)) throw new Error('PNG invalide');
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let pos = 8;
  let width = 0;
  let height = 0;
  let depth = 8;
  let ctype = 6;
  let interlace = 0;
  let palette: Uint8Array | null = null;
  let trns: Uint8Array | null = null;
  const idat: Uint8Array[] = [];
  let idatLen = 0;
  while (pos + 8 <= bytes.length) {
    const len = v.getUint32(pos);
    const type = String.fromCharCode(bytes[pos + 4], bytes[pos + 5], bytes[pos + 6], bytes[pos + 7]);
    const start = pos + 8;
    if (start + len > bytes.length) break;
    const body = bytes.subarray(start, start + len);
    if (type === 'IHDR') {
      width = v.getUint32(start);
      height = v.getUint32(start + 4);
      depth = bytes[start + 8];
      ctype = bytes[start + 9];
      interlace = bytes[start + 12];
    } else if (type === 'PLTE') palette = body;
    else if (type === 'tRNS') trns = body;
    else if (type === 'IDAT') {
      idat.push(body);
      idatLen += len;
    } else if (type === 'IEND') break;
    pos = start + len + 4;
  }
  if (!width || !height || width > 8192 || height > 8192) throw new Error('PNG : dimensions invalides');
  const zdata = new Uint8Array(idatLen);
  let o = 0;
  for (const c of idat) {
    zdata.set(c, o);
    o += c.length;
  }
  const raw = unzlibSync(zdata);
  const channels = ctype === 0 ? 1 : ctype === 2 ? 3 : ctype === 3 ? 1 : ctype === 4 ? 2 : 4;
  const bpp = Math.max(1, (channels * depth) >> 3);
  const out = blankImage(width, height);
  let rp = 0;
  const passes = interlace ? ADAM7 : [[0, 0, 1, 1]];
  for (const [x0, y0, dx, dy] of passes) {
    const pw = Math.ceil((width - x0) / dx);
    const ph = Math.ceil((height - y0) / dy);
    if (pw <= 0 || ph <= 0) continue;
    const stride = Math.ceil((pw * channels * depth) / 8);
    let prev = new Uint8Array(stride);
    for (let y = 0; y < ph; y++) {
      const filter = raw[rp++];
      const line = raw.slice(rp, rp + stride);
      rp += stride;
      unfilter(filter, line, prev, bpp);
      writeLine(out, line, x0, y0 + y * dy, dx, pw, ctype, depth, palette, trns);
      prev = line;
    }
  }
  return out;
}

function unfilter(f: number, line: Uint8Array, prev: Uint8Array, bpp: number): void {
  const n = line.length;
  switch (f) {
    case 1:
      for (let i = bpp; i < n; i++) line[i] = (line[i] + line[i - bpp]) & 255;
      break;
    case 2:
      for (let i = 0; i < n; i++) line[i] = (line[i] + prev[i]) & 255;
      break;
    case 3:
      for (let i = 0; i < n; i++) line[i] = (line[i] + (((i >= bpp ? line[i - bpp] : 0) + prev[i]) >> 1)) & 255;
      break;
    case 4:
      for (let i = 0; i < n; i++) {
        const a = i >= bpp ? line[i - bpp] : 0;
        const b = prev[i];
        const c = i >= bpp ? prev[i - bpp] : 0;
        const p = a + b - c;
        const pa = Math.abs(p - a);
        const pb = Math.abs(p - b);
        const pc = Math.abs(p - c);
        line[i] = (line[i] + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
      }
      break;
    default:
      break;
  }
}

function writeLine(img: RGBAImage, line: Uint8Array, x0: number, y: number, dx: number, pw: number, ctype: number, depth: number, pal: Uint8Array | null, trns: Uint8Array | null): void {
  const d = img.data;
  const sample = (idx: number): number => {
    // Échantillon numéro idx de la ligne, ramené sur 8 bits.
    if (depth === 8) return line[idx];
    if (depth === 16) return line[idx * 2];
    const perByte = 8 / depth;
    const byte = line[Math.floor(idx / perByte)];
    const shift = 8 - depth * ((idx % perByte) + 1);
    return (byte >> shift) & ((1 << depth) - 1);
  };
  const scale8 = depth < 8 ? 255 / ((1 << depth) - 1) : 1;
  const trGrey = trns && ctype === 0 ? (depth === 16 ? (trns[0] << 8) | trns[1] : trns[1]) : -1;
  for (let i = 0; i < pw; i++) {
    const o = (y * img.width + x0 + i * dx) * 4;
    switch (ctype) {
      case 0: {
        const raw = depth === 16 ? (line[i * 2] << 8) | line[i * 2 + 1] : sample(i);
        const g = Math.round(depth === 16 ? raw >> 8 : sample(i) * scale8);
        d[o] = d[o + 1] = d[o + 2] = g;
        d[o + 3] = raw === trGrey ? 0 : 255;
        break;
      }
      case 2: {
        d[o] = sample(i * 3);
        d[o + 1] = sample(i * 3 + 1);
        d[o + 2] = sample(i * 3 + 2);
        let a = 255;
        if (trns && trns.length >= 6) {
          const r = depth === 16 ? (line[i * 6] << 8) | line[i * 6 + 1] : line[i * 3];
          const g = depth === 16 ? (line[i * 6 + 2] << 8) | line[i * 6 + 3] : line[i * 3 + 1];
          const b = depth === 16 ? (line[i * 6 + 4] << 8) | line[i * 6 + 5] : line[i * 3 + 2];
          const tr = depth === 16 ? (trns[0] << 8) | trns[1] : trns[1];
          const tg = depth === 16 ? (trns[2] << 8) | trns[3] : trns[3];
          const tb = depth === 16 ? (trns[4] << 8) | trns[5] : trns[5];
          if (r === tr && g === tg && b === tb) a = 0;
        }
        d[o + 3] = a;
        break;
      }
      case 3: {
        const k = sample(i);
        if (pal && k * 3 + 2 < pal.length) {
          d[o] = pal[k * 3];
          d[o + 1] = pal[k * 3 + 1];
          d[o + 2] = pal[k * 3 + 2];
        }
        d[o + 3] = trns && k < trns.length ? trns[k] : 255;
        break;
      }
      case 4: {
        const g = sample(i * 2);
        d[o] = d[o + 1] = d[o + 2] = g;
        d[o + 3] = sample(i * 2 + 1);
        break;
      }
      default: {
        d[o] = sample(i * 4);
        d[o + 1] = sample(i * 4 + 1);
        d[o + 2] = sample(i * 4 + 2);
        d[o + 3] = sample(i * 4 + 3);
      }
    }
  }
}

// ------------------------------------------------------------------ TGA (Bedrock)

/** Décode un TGA (non compressé ou RLE ; couleurs vraies, niveaux de gris ou palette). */
export function decodeTga(b: Uint8Array): RGBAImage {
  if (b.length < 18) throw new Error('TGA invalide');
  const idLen = b[0];
  const cmType = b[1];
  const type = b[2];
  const cmFirst = b[3] | (b[4] << 8);
  const cmLen = b[5] | (b[6] << 8);
  const cmDepth = b[7];
  const width = b[12] | (b[13] << 8);
  const height = b[14] | (b[15] << 8);
  const depth = b[16];
  const desc = b[17];
  if (!width || !height || width > 8192 || height > 8192) throw new Error('TGA : dimensions invalides');
  if (![1, 2, 3, 9, 10, 11].includes(type)) throw new Error('TGA : type non pris en charge');
  let p = 18 + idLen;
  let cmap: Uint8Array | null = null;
  const cmBytes = Math.ceil(cmDepth / 8);
  if (cmType === 1) {
    cmap = b.subarray(p, p + cmLen * cmBytes);
    p += cmLen * cmBytes;
  }
  const bytesPP = Math.ceil(depth / 8);
  const n = width * height;
  const px = new Uint8Array(n * 4);
  const readPixel = (src: Uint8Array, at: number, depthBits: number, out: number): void => {
    if (type === 3 || type === 11) {
      px[out] = px[out + 1] = px[out + 2] = src[at];
      px[out + 3] = depthBits === 16 ? src[at + 1] : 255;
      return;
    }
    if (depthBits === 15 || depthBits === 16) {
      const v = src[at] | (src[at + 1] << 8);
      px[out] = ((v >> 10) & 31) * 8.226;
      px[out + 1] = ((v >> 5) & 31) * 8.226;
      px[out + 2] = (v & 31) * 8.226;
      px[out + 3] = depthBits === 16 && !(v & 0x8000) && desc & 15 ? 0 : 255;
      return;
    }
    px[out] = src[at + 2];
    px[out + 1] = src[at + 1];
    px[out + 2] = src[at];
    px[out + 3] = depthBits === 32 ? src[at + 3] : 255;
  };
  const putIndex = (idx: number, at: number): void => {
    if (type === 1 || type === 9) {
      const k = (bytesPP === 2 ? b[at] | (b[at + 1] << 8) : b[at]) - cmFirst;
      if (cmap && k >= 0 && k < cmLen) readPixel(cmap, k * cmBytes, cmDepth, idx * 4);
    } else readPixel(b, at, depth, idx * 4);
  };
  if (type < 9) {
    for (let i = 0; i < n; i++) putIndex(i, p + i * bytesPP);
  } else {
    let i = 0;
    while (i < n && p < b.length) {
      const h = b[p++];
      const count = (h & 127) + 1;
      if (h & 128) {
        for (let k = 0; k < count && i < n; k++) putIndex(i++, p);
        p += bytesPP;
      } else {
        for (let k = 0; k < count && i < n; k++) {
          putIndex(i++, p);
          p += bytesPP;
        }
      }
    }
  }
  // Origine : en bas à gauche par défaut (bit 5 du descripteur = en haut).
  const out = blankImage(width, height);
  const top = (desc & 0x20) !== 0;
  const right = (desc & 0x10) !== 0;
  for (let y = 0; y < height; y++) {
    const sy = top ? y : height - 1 - y;
    for (let x = 0; x < width; x++) {
      const sx = right ? width - 1 - x : x;
      out.data.set(px.subarray((sy * width + sx) * 4, (sy * width + sx) * 4 + 4), (y * width + x) * 4);
    }
  }
  return out;
}

/** Décode une image de pack selon son extension (.png ou .tga). */
export function decodeImage(bytes: Uint8Array, name: string): RGBAImage {
  if (/\.tga$/i.test(name)) return decodeTga(bytes);
  return decodePng(bytes);
}

// ------------------------------------------------------------------ opérations

export function crop(img: RGBAImage, x: number, y: number, w: number, h: number): RGBAImage {
  const out = blankImage(w, h);
  for (let j = 0; j < h; j++) {
    const sy = y + j;
    if (sy < 0 || sy >= img.height) continue;
    for (let i = 0; i < w; i++) {
      const sx = x + i;
      if (sx < 0 || sx >= img.width) continue;
      const s = (sy * img.width + sx) * 4;
      out.data.set(img.data.subarray(s, s + 4), (j * w + i) * 4);
    }
  }
  return out;
}

/**
 * Redimensionne par filtre « boîte » (moyenne des pixels couverts, pondérée par l'alpha
 * pour éviter les franges sombres). Fonctionne aussi pour les tailles non multiples.
 */
export function resizeBox(img: RGBAImage, w: number, h: number): RGBAImage {
  if (img.width === w && img.height === h) return img;
  const out = blankImage(w, h);
  const fx = img.width / w;
  const fy = img.height / h;
  for (let j = 0; j < h; j++) {
    const y0 = j * fy;
    const y1 = (j + 1) * fy;
    for (let i = 0; i < w; i++) {
      const x0 = i * fx;
      const x1 = (i + 1) * fx;
      let r = 0,
        g = 0,
        b = 0,
        a = 0,
        area = 0;
      for (let sy = Math.floor(y0); sy < Math.ceil(y1); sy++) {
        const wy = Math.min(y1, sy + 1) - Math.max(y0, sy);
        if (wy <= 0) continue;
        for (let sx = Math.floor(x0); sx < Math.ceil(x1); sx++) {
          const wx = Math.min(x1, sx + 1) - Math.max(x0, sx);
          if (wx <= 0) continue;
          const k = wx * wy;
          const s = (Math.min(sy, img.height - 1) * img.width + Math.min(sx, img.width - 1)) * 4;
          const al = img.data[s + 3] * k;
          r += img.data[s] * al;
          g += img.data[s + 1] * al;
          b += img.data[s + 2] * al;
          a += al;
          area += k;
        }
      }
      const o = (j * w + i) * 4;
      if (a > 0) {
        out.data[o] = Math.round(r / a);
        out.data[o + 1] = Math.round(g / a);
        out.data[o + 2] = Math.round(b / a);
      }
      out.data[o + 3] = Math.round(a / Math.max(area, 1e-6));
    }
  }
  return out;
}

/** Saturation moyenne (HSV, 0..1) des pixels visibles : ~0 pour une texture grise à teinter. */
export function meanSaturation(px: Uint8Array): number {
  let s = 0;
  let n = 0;
  for (let i = 0; i + 3 < px.length; i += 4) {
    if (px[i + 3] < 128) continue;
    const mx = Math.max(px[i], px[i + 1], px[i + 2]);
    const mn = Math.min(px[i], px[i + 1], px[i + 2]);
    s += mx > 0 ? (mx - mn) / mx : 0;
    n++;
  }
  return n ? s / n : 0;
}

/** Multiplie les couleurs par une teinte (0xRRGGBB). */
export function multiply(px: Uint8Array, tint: number): Uint8Array {
  const out = px.slice();
  const r = ((tint >> 16) & 255) / 255;
  const g = ((tint >> 8) & 255) / 255;
  const b = (tint & 255) / 255;
  for (let i = 0; i < out.length; i += 4) {
    out[i] = Math.round(out[i] * r);
    out[i + 1] = Math.round(out[i + 1] * g);
    out[i + 2] = Math.round(out[i + 2] * b);
  }
  return out;
}

/** Superpose `top` sur `base` (fusion alpha classique), même taille. */
export function compose(base: Uint8Array, top: Uint8Array): Uint8Array {
  const out = base.slice();
  for (let i = 0; i < out.length; i += 4) {
    const a = top[i + 3] / 255;
    if (a <= 0) continue;
    const ba = out[i + 3] / 255;
    const oa = a + ba * (1 - a);
    for (let c = 0; c < 3; c++) out[i + c] = Math.round((top[i + c] * a + out[i + c] * ba * (1 - a)) / oa);
    out[i + 3] = Math.round(oa * 255);
  }
  return out;
}

/** Mélange linéaire de deux images de même taille (animations interpolées). */
export function lerpPixels(a: Uint8Array, b: Uint8Array, t: number): Uint8Array {
  const out = new Uint8Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = Math.round(a[i] + (b[i] - a[i]) * t);
  return out;
}
