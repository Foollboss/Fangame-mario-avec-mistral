/**
 * Générateur procédural de textures pixel-art 16x16 (aucun asset externe).
 * Fonctionne sans DOM : produit des tableaux RGBA, utilisables dans un worker,
 * dans Node (tests) ou envoyés à une DataArrayTexture WebGL.
 *
 * Convention : pour les textures « opaques », le canal alpha sert de masque
 * de teinte biome (alpha 0 = pixel teinté par la couleur du biome, 255 = couleur fixe).
 * Pour les textures « cutout/translucent », alpha = transparence.
 */
import { Rng, hashString } from '../engine/rng';
import { clamp, hexToRgb } from '../engine/math';

export const TEX = 16;
export type Pixels = Uint8ClampedArray;
export type RGB = [number, number, number];

export interface TextureDef {
  p: string; // motif
  c?: string[]; // palette
  [k: string]: unknown;
}

const newImg = (): Pixels => new Uint8ClampedArray(TEX * TEX * 4);

function set(img: Pixels, x: number, y: number, c: RGB, a = 255): void {
  x = ((x % TEX) + TEX) % TEX;
  y = ((y % TEX) + TEX) % TEX;
  const i = (y * TEX + x) * 4;
  img[i] = c[0];
  img[i + 1] = c[1];
  img[i + 2] = c[2];
  img[i + 3] = a;
}
function get(img: Pixels, x: number, y: number): RGB {
  x = ((x % TEX) + TEX) % TEX;
  y = ((y % TEX) + TEX) % TEX;
  const i = (y * TEX + x) * 4;
  return [img[i], img[i + 1], img[i + 2]];
}
function alphaAt(img: Pixels, x: number, y: number): number {
  return img[(y * TEX + x) * 4 + 3];
}
const mul = (c: RGB, f: number): RGB => [clamp(c[0] * f, 0, 255), clamp(c[1] * f, 0, 255), clamp(c[2] * f, 0, 255)];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const col = (s: string | undefined, fallback: string): RGB => hexToRgb(s ?? fallback);

/** Bruit de valeur tuilable (période en cellules). */
function tileNoise(rng: Rng, period: number): Float32Array {
  const lat = new Float32Array(period * period);
  for (let i = 0; i < lat.length; i++) lat[i] = rng.next();
  const out = new Float32Array(TEX * TEX);
  const cell = TEX / period;
  for (let y = 0; y < TEX; y++)
    for (let x = 0; x < TEX; x++) {
      const fx = x / cell,
        fy = y / cell;
      const x0 = Math.floor(fx) % period,
        y0 = Math.floor(fy) % period;
      const x1 = (x0 + 1) % period,
        y1 = (y0 + 1) % period;
      let tx = fx - Math.floor(fx),
        ty = fy - Math.floor(fy);
      tx = tx * tx * (3 - 2 * tx);
      ty = ty * ty * (3 - 2 * ty);
      const a = lat[y0 * period + x0] + (lat[y0 * period + x1] - lat[y0 * period + x0]) * tx;
      const b = lat[y1 * period + x0] + (lat[y1 * period + x1] - lat[y1 * period + x0]) * tx;
      out[y * TEX + x] = a + (b - a) * ty;
    }
  return out;
}

/** Combinaison multi-octaves tuilable dans [0,1]. */
function fbmTile(rng: Rng, white = 0.25): Float32Array {
  const a = tileNoise(rng, 2);
  const b = tileNoise(rng, 4);
  const c = tileNoise(rng, 8);
  const out = new Float32Array(TEX * TEX);
  for (let i = 0; i < out.length; i++) out[i] = clamp(a[i] * 0.3 + b[i] * 0.3 + c[i] * (0.4 - white) + rng.next() * white, 0, 1);
  return out;
}

/** Couleur dans une rampe [sombre, base, clair] selon t∈[0,1]. */
function ramp(p: RGB[], t: number): RGB {
  if (p.length === 1) return p[0];
  const f = clamp(t, 0, 0.9999) * (p.length - 1);
  const i = Math.floor(f);
  return mix(p[i], p[i + 1], f - i);
}

function palette(def: TextureDef, fb: string[]): RGB[] {
  const c = def.c && def.c.length ? def.c : fb;
  return c.map((s) => hexToRgb(s));
}

/** Remplit l'image avec du bruit coloré (rampe sombre->clair, quantifiée pour un rendu pixel-art). */
function fillNoise(img: Pixels, rng: Rng, pal: RGB[], white = 0.3, levels = 5, alpha = 255): Float32Array {
  const n = fbmTile(rng, white);
  for (let y = 0; y < TEX; y++)
    for (let x = 0; x < TEX; x++) {
      const t = Math.round(n[y * TEX + x] * levels) / levels;
      set(img, x, y, ramp(pal, t), alpha);
    }
  return n;
}

type Painter = (img: Pixels, def: TextureDef, rng: Rng, lib: TextureLibrary) => void;

// ---------------------------------------------------------------------------
// Motifs
// ---------------------------------------------------------------------------
const PATTERNS: Record<string, Painter> = {
  noise(img, def, rng) {
    fillNoise(img, rng, palette(def, ['#5a5a5a', '#7a7a7a', '#9a9a9a']), (def.white as number) ?? 0.35, (def.levels as number) ?? 5);
  },

  stone(img, def, rng) {
    const pal = palette(def, ['#5f636b', '#7b7f88', '#8f949c']);
    fillNoise(img, rng, pal, 0.25, 6);
    // fines veines
    const veins = (def.veins as number) ?? 3;
    for (let v = 0; v < veins; v++) {
      let x = rng.int(TEX),
        y = rng.int(TEX);
      const len = rng.range(3, 7);
      for (let i = 0; i < len; i++) {
        set(img, x, y, mul(pal[0], 0.85));
        x += rng.int(3) - 1;
        y += 1;
      }
    }
    if (def.spots) {
      const sc = hexToRgb(def.spots as string);
      for (let i = 0; i < ((def.spotCount as number) ?? 10); i++) set(img, rng.int(TEX), rng.int(TEX), mix(sc, get(img, 0, 0), rng.next() * 0.3));
    }
  },

  cobble(img, def, rng) {
    const pal = palette(def, ['#4d5057', '#6d7179', '#8b9099']);
    const mortar = mul(pal[0], 0.7);
    // Voronoi tuilable
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 9; i++) pts.push([rng.next() * TEX, rng.next() * TEX, rng.next()]);
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) {
        let d1 = 1e9,
          d2 = 1e9,
          best = 0;
        for (const [px, py, v] of pts)
          for (let ox = -1; ox <= 1; ox++)
            for (let oy = -1; oy <= 1; oy++) {
              const dx = x + 0.5 - (px + ox * TEX),
                dy = y + 0.5 - (py + oy * TEX);
              const d = dx * dx + dy * dy;
              if (d < d1) {
                d2 = d1;
                d1 = d;
                best = v;
              } else if (d < d2) d2 = d;
            }
        const edge = Math.sqrt(d2) - Math.sqrt(d1);
        if (edge < 1.1) set(img, x, y, mortar);
        else {
          const shade = clamp(0.35 + best * 0.5 + (rng.next() - 0.5) * 0.15, 0, 1);
          let c = ramp(pal, shade);
          if (edge < 2.0) c = mul(c, 0.88);
          set(img, x, y, c);
        }
      }
    if (def.moss) {
      const m = hexToRgb(def.moss as string);
      const n = tileNoise(rng, 4);
      for (let i = 0; i < 256; i++) if (n[i] > 0.6) set(img, i % 16, (i / 16) | 0, mix(m, get(img, i % 16, (i / 16) | 0), 0.25));
    }
  },

  bricks(img, def, rng) {
    const pal = palette(def, ['#8a3d2c', '#a54c36', '#bf6149', '#b9b0a2']);
    const mortar = pal[3] ?? hexToRgb('#b9b0a2');
    const bh = (def.h as number) ?? 4;
    const bw = (def.w as number) ?? 8;
    for (let y = 0; y < TEX; y++) {
      const row = Math.floor(y / bh);
      const off = row % 2 ? bw / 2 : 0;
      for (let x = 0; x < TEX; x++) {
        const lx = (x + off) % bw;
        const ly = y % bh;
        if (ly === bh - 1 || lx === bw - 1) set(img, x, y, mul(mortar, 0.9 + rng.next() * 0.1));
        else {
          const brickId = Math.floor((x + off) / bw) + row * 7;
          const base = ramp(pal.slice(0, 3), ((brickId * 37) % 10) / 10);
          let c = mul(base, 0.92 + rng.next() * 0.14);
          if (ly === 0) c = mul(c, 1.08);
          set(img, x, y, c);
        }
      }
    }
  },

  stonebricks(img, def, rng) {
    const pal = palette(def, ['#5c6069', '#767a83', '#8e939c']);
    const n = fbmTile(rng, 0.3);
    for (let y = 0; y < TEX; y++) {
      const half = y < 8 ? 0 : 1;
      const off = half ? 4 : 0;
      for (let x = 0; x < TEX; x++) {
        const lx = (x + off) % 8,
          ly = y % 8;
        let c = ramp(pal, 0.35 + n[y * TEX + x] * 0.5);
        if (ly === 7 || lx === 7) c = mul(pal[0], 0.7);
        else if (ly === 0 || lx === 0) c = mul(c, 1.1);
        else if (ly === 6 || lx === 6) c = mul(c, 0.85);
        set(img, x, y, c);
      }
    }
    if (def.moss) {
      const m = hexToRgb(def.moss as string);
      const mn = tileNoise(rng, 4);
      for (let i = 0; i < 256; i++) if (mn[i] > 0.62) set(img, i % 16, (i / 16) | 0, mix(m, get(img, i % 16, (i / 16) | 0), 0.3));
    }
    if (def.crack) {
      let x = rng.int(16),
        y = 0;
      while (y < 16) {
        set(img, x, y, mul(pal[0], 0.55));
        y++;
        x += rng.int(3) - 1;
      }
    }
  },

  planks(img, def, rng) {
    const pal = palette(def, ['#7a5230', '#9c6b3f', '#b8834f']);
    for (let y = 0; y < TEX; y++) {
      const board = Math.floor(y / 4);
      const seamX = (board * 5 + 3) % 16;
      for (let x = 0; x < TEX; x++) {
        const grain = Math.sin((x + board * 3) * 0.9 + Math.sin(y * 1.7 + board) * 1.2) * 0.5 + 0.5;
        let c = ramp(pal, 0.3 + grain * 0.45 + (rng.next() - 0.5) * 0.12);
        if (y % 4 === 3) c = mul(pal[0], 0.75);
        else if (y % 4 === 0) c = mul(c, 1.07);
        if (x === seamX && y % 4 !== 3) c = mul(pal[0], 0.8);
        set(img, x, y, c);
      }
    }
  },

  log(img, def, rng) {
    const pal = palette(def, ['#3f2b1a', '#5a3d24', '#6f4d2e']);
    const cols = new Float32Array(TEX);
    for (let x = 0; x < TEX; x++) cols[x] = rng.next();
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) {
        const groove = Math.sin(x * 1.9 + cols[x] * 2) > 0.55;
        let c = ramp(pal, 0.25 + cols[x] * 0.5 + (rng.next() - 0.5) * 0.18);
        if (groove) c = mul(pal[0], 0.9);
        set(img, x, y, c);
      }
    if (def.marks) {
      const m = hexToRgb(def.marks as string);
      for (let i = 0; i < 5; i++) {
        const x = rng.int(14),
          y = rng.int(16);
        set(img, x, y, m);
        set(img, x + 1, y, m);
      }
    }
  },

  logtop(img, def, rng) {
    const pal = palette(def, ['#8a6a44', '#a88457', '#c29d6b']);
    const bark = col(def.bark as string, '#4e3520');
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) {
        const dx = x - 7.5,
          dy = y - 7.5;
        const r = Math.sqrt(dx * dx + dy * dy);
        if (x === 0 || y === 0 || x === 15 || y === 15) {
          set(img, x, y, mul(bark, 0.9 + rng.next() * 0.2));
          continue;
        }
        const ring = Math.sin(r * 1.6) * 0.5 + 0.5;
        set(img, x, y, ramp(pal, 0.2 + ring * 0.6 + (rng.next() - 0.5) * 0.1));
      }
  },

  leaves(img, def, rng) {
    const pal = palette(def, ['#4a4a4a', '#707070', '#9a9a9a']);
    const n = fbmTile(rng, 0.45);
    const holes = (def.holes as number) ?? 0.18;
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) {
        const v = n[y * TEX + x];
        if (rng.next() < holes && v < 0.55) {
          set(img, x, y, pal[0], 0);
          continue;
        }
        set(img, x, y, ramp(pal, Math.round(v * 4) / 4), 255);
      }
    if (def.fruit && (def.stage === undefined || (def.stage as number) >= 1)) {
      const f = hexToRgb(def.fruit as string);
      for (let i = 0; i < ((def.fruitCount as number) ?? 3); i++) {
        const x = rng.int(15),
          y = rng.int(15);
        set(img, x, y, f);
        set(img, x + 1, y, mul(f, 0.8));
        set(img, x, y + 1, mul(f, 0.8));
      }
    }
  },

  ore(img, def, rng, lib) {
    const base = lib.pixels(def.base as string ?? 'pierre');
    img.set(base);
    const pal = palette(def, ['#222222', '#444444', '#666666']);
    const count = (def.count as number) ?? 5;
    for (let i = 0; i < count; i++) {
      const cx = rng.int(TEX),
        cy = rng.int(TEX);
      const size = rng.range(2, 4);
      for (let k = 0; k < size; k++) {
        const x = cx + rng.int(3) - 1,
          y = cy + rng.int(3) - 1;
        set(img, x, y, pal[1]);
        set(img, x + 1, y, pal[0]);
        if (rng.chance(0.5)) set(img, x, y - 1, pal[2]);
      }
    }
  },

  grass_top(img, def, rng) {
    // Teintée : alpha 0 partout (masque de teinte), niveaux de gris clairs.
    const pal = palette(def, ['#8c8c8c', '#b0b0b0', '#d6d6d6']);
    const n = fbmTile(rng, 0.5);
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) set(img, x, y, ramp(pal, Math.round(n[y * TEX + x] * 4) / 4), 0);
  },

  grass_side(img, def, rng, lib) {
    const dirt = lib.pixels((def.base as string) ?? 'terre');
    img.set(dirt);
    const pal = palette(def, ['#8c8c8c', '#b0b0b0', '#d6d6d6']);
    const tinted = def.untinted !== true;
    for (let x = 0; x < TEX; x++) {
      const depth = 2 + rng.int(3) + (x % 5 === 0 ? 1 : 0);
      for (let y = 0; y < depth; y++) set(img, x, y, ramp(pal, rng.next()), tinted ? 0 : 255);
    }
  },

  sand(img, def, rng) {
    const pal = palette(def, ['#c9b27a', '#dcc68e', '#ecd9a4']);
    fillNoise(img, rng, pal, 0.55, 4);
    if (def.ripples) {
      for (let y = 2; y < TEX; y += 5)
        for (let x = 0; x < TEX; x++) if ((x + y) % 7 < 4) set(img, x, y + ((x >> 2) % 2), mul(pal[0], 0.95));
    }
  },

  gravel(img, def, rng) {
    const pal = palette(def, ['#5d5a57', '#7e7a75', '#9b968f', '#6b635c']);
    fillNoise(img, rng, pal.slice(0, 3), 0.4, 4);
    for (let i = 0; i < 14; i++) {
      const x = rng.int(15),
        y = rng.int(15);
      const c = ramp(pal, rng.next());
      set(img, x, y, c);
      set(img, x + 1, y, mul(c, 0.85));
      set(img, x, y + 1, mul(c, 0.75));
    }
  },

  glass(img, def, rng) {
    const frame = col(def.c?.[0], '#cfe8ee');
    const glint = col(def.c?.[1], '#ffffff');
    const tint = col(def.c?.[2], '#bfe3ec');
    const a = (def.alpha as number) ?? 40;
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) {
        if (x === 0 || y === 0 || x === 15 || y === 15) set(img, x, y, frame, 230);
        else set(img, x, y, tint, a);
      }
    for (let i = 0; i < 4; i++) set(img, 3 + i, 9 - i, glint, 180);
    for (let i = 0; i < 2; i++) set(img, 9 + i, 5 - i, glint, 150);
    void rng;
  },

  liquid(img, def, rng) {
    const pal = palette(def, ['#1d5f8f', '#2a78ad', '#4a9bcc']);
    const a = (def.alpha as number) ?? 190;
    const n = fbmTile(rng, 0.2);
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) {
        const w = Math.sin((x + y * 0.5) * 0.8 + n[y * TEX + x] * 4) * 0.5 + 0.5;
        set(img, x, y, ramp(pal, clamp(n[y * TEX + x] * 0.6 + w * 0.4, 0, 1)), a);
      }
  },

  flower(img, def, rng) {
    const petal = col(def.c?.[0], '#d63a3a');
    const center = col(def.c?.[1], '#f0d040');
    const stem = col(def.c?.[2], '#3f8a35');
    const shape = (def.shape as string) ?? 'round';
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    for (let y = 8; y < 16; y++) set(img, 7 + (y > 12 ? 1 : 0), y, stem);
    set(img, 6, 11, stem);
    set(img, 5, 10, stem);
    set(img, 9, 13, stem);
    set(img, 10, 12, stem);
    if (shape === 'tall') {
      for (let y = 1; y < 8; y++) {
        set(img, 7, y, petal);
        set(img, 8, y, mul(petal, 0.85));
        if (y % 2) {
          set(img, 6, y, mul(petal, 0.9));
          set(img, 9, y, mul(petal, 0.75));
        }
      }
      set(img, 7, 0, center);
    } else if (shape === 'bell') {
      for (let y = 3; y < 8; y++) for (let x = 5; x < 11; x++) if (!(y === 3 && (x === 5 || x === 10))) set(img, x, y, mul(petal, 0.8 + (x - 5) * 0.04));
      set(img, 5, 8, petal);
      set(img, 7, 8, petal);
      set(img, 10, 8, petal);
      set(img, 7, 2, center);
      set(img, 8, 2, center);
    } else {
      const cx = 7.5,
        cy = 4.5;
      for (let y = 1; y < 9; y++)
        for (let x = 3; x < 13; x++) {
          const d = Math.hypot(x - cx, (y - cy) * 1.2);
          if (d < 3.6) set(img, x, y, mul(petal, 0.85 + rng.next() * 0.25));
        }
      set(img, 7, 4, center);
      set(img, 8, 4, center);
      set(img, 7, 5, mul(center, 0.85));
      set(img, 8, 5, mul(center, 0.85));
    }
  },

  tallgrass(img, def, rng) {
    const pal = palette(def, ['#7a7a7a', '#a4a4a4', '#cfcfcf']);
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    const blades = (def.blades as number) ?? 7;
    const tint = def.untinted ? 255 : 254; // 254 : pixel teinté en cutout (voir shader)
    for (let b = 0; b < blades; b++) {
      let x = 1 + rng.int(14);
      const h = rng.range(6, 14);
      for (let k = 0; k < h; k++) {
        const y = 15 - k;
        set(img, x, y, ramp(pal, k / h), tint);
        if (k > h * 0.5 && rng.chance(0.35)) x += rng.chance(0.5) ? 1 : -1;
        x = clamp(x, 0, 15);
      }
    }
  },

  fern(img, def, rng) {
    const pal = palette(def, ['#6a6a6a', '#959595', '#c4c4c4']);
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    for (let s = 0; s < 3; s++) {
      const bx = 3 + s * 5;
      for (let y = 3 + s; y < 16; y++) {
        set(img, bx, y, pal[1], 254);
        if (y % 2 === 0) {
          set(img, bx - 1, y, ramp(pal, rng.next()), 254);
          set(img, bx + 1, y - 1, ramp(pal, rng.next()), 254);
        }
      }
    }
  },

  mushroom(img, def, rng) {
    const cap = col(def.c?.[0], '#b33a2e');
    const stem = col(def.c?.[1], '#e8dcc6');
    const dot = col(def.c?.[2], '#f6efe0');
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    for (let y = 10; y < 16; y++) {
      set(img, 7, y, stem);
      set(img, 8, y, mul(stem, 0.85));
    }
    for (let y = 5; y < 10; y++)
      for (let x = 3; x < 13; x++) {
        const w = y === 5 ? 3 : y === 6 ? 4 : 5;
        if (Math.abs(x - 7.5) <= w) set(img, x, y, mul(cap, y === 9 ? 0.75 : 0.95 + rng.next() * 0.1));
      }
    if (def.dots !== false) {
      set(img, 6, 6, dot);
      set(img, 9, 7, dot);
      set(img, 5, 8, dot);
      set(img, 10, 8, dot);
    }
  },

  sapling(img, def, rng) {
    const trunk = col(def.c?.[1], '#6a4a2a');
    const leaf = col(def.c?.[0], '#4c8a3a');
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    for (let y = 8; y < 16; y++) set(img, 7, y, trunk);
    set(img, 8, 11, trunk);
    for (let y = 2; y < 10; y++)
      for (let x = 3; x < 13; x++) {
        const d = Math.hypot(x - 7.5, y - 5.5);
        if (d < 4 && rng.chance(0.8)) set(img, x, y, mul(leaf, 0.75 + rng.next() * 0.4));
      }
  },

  crop(img, def, rng) {
    const stage = (def.stage as number) ?? 7;
    const max = ((def.stages as number) ?? 8) - 1;
    const green = col(def.c?.[0], '#5e9e3a');
    const ripe = col(def.c?.[1], '#d6b44a');
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    const t = stage / max;
    const h = 3 + Math.round(t * 12);
    const c = mix(green, ripe, t > 0.8 ? 1 : t * 0.3);
    for (const x of [2, 5, 8, 11, 14]) {
      for (let k = 0; k < h; k++) set(img, x + (k > h / 2 && x % 2 ? 1 : 0), 15 - k, mul(c, 0.8 + rng.next() * 0.3));
      if (t > 0.7) {
        set(img, x, 15 - h, mul(ripe, 1.1));
        set(img, x - 1, 16 - h, ripe);
        set(img, x + 1, 17 - h, ripe);
      }
    }
  },

  crystal(img, def, rng) {
    const pal = palette(def, ['#2c6f8c', '#3fb6d8', '#b8f3ff']);
    const cut = def.cutout === true;
    if (cut) for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    if (!cut) fillNoise(img, rng, [mul(pal[0], 0.7), pal[0], pal[1]], 0.3, 4);
    // prismes
    const spikes = cut ? 4 : 6;
    for (let s = 0; s < spikes; s++) {
      const bx = cut ? 2 + s * 3 + rng.int(2) : rng.int(16);
      const by = cut ? 15 : rng.int(16);
      const h = cut ? rng.range(6, 13) : rng.range(3, 6);
      for (let k = 0; k < h; k++) {
        const w = Math.max(0, Math.round((1 - k / h) * 1.5));
        for (let dx = -w; dx <= w; dx++) set(img, bx + dx, by - k, dx < 0 ? pal[1] : dx > 0 ? mul(pal[1], 0.8) : pal[2]);
      }
    }
  },

  cloth(img, def, rng) {
    const base = col(def.c?.[0], '#dddddd');
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) {
        const weave = (x + y) % 4 < 2 ? 1.04 : 0.94;
        const row = y % 2 ? 0.97 : 1.02;
        set(img, x, y, mul(base, weave * row * (0.95 + rng.next() * 0.08)));
      }
  },

  metal(img, def, rng) {
    const pal = palette(def, ['#8d8f93', '#b9bcc1', '#e2e5ea']);
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) {
        let t = 0.45 + (rng.next() - 0.5) * 0.08 + (y < 8 ? 0.08 : -0.04);
        if (x === 0 || y === 0) t = 0.9;
        if (x === 15 || y === 15) t = 0.1;
        set(img, x, y, ramp(pal, t));
      }
    for (const [x, y] of [
      [2, 2],
      [13, 2],
      [2, 13],
      [13, 13],
    ]) {
      set(img, x, y, pal[2]);
      set(img, x + 1, y + 1, pal[0]);
    }
  },

  gemblock(img, def, rng) {
    const pal = palette(def, ['#3a2a6c', '#6a4fc0', '#b7a4ff']);
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) {
        const d = Math.abs(x - 7.5) + Math.abs(y - 7.5);
        let t = 0.5 + Math.sin(d * 0.9) * 0.25 + (rng.next() - 0.5) * 0.1;
        if (x === 0 || y === 0) t = 1;
        if (x === 15 || y === 15) t = 0;
        set(img, x, y, ramp(pal, t));
      }
  },

  workbench_top(img, def, rng, lib) {
    img.set(lib.pixels('planches_chene'));
    const dark: RGB = hexToRgb('#4a3018');
    for (let i = 0; i < 16; i++) {
      set(img, i, 0, dark);
      set(img, i, 15, dark);
      set(img, 0, i, dark);
      set(img, 15, i, dark);
    }
    for (let i = 3; i < 13; i++) {
      set(img, i, 5, dark);
      set(img, i, 10, dark);
      set(img, 5, i, dark);
      set(img, 10, i, dark);
    }
    void def;
    void rng;
  },

  workbench_side(img, def, rng, lib) {
    img.set(lib.pixels('planches_chene'));
    const metal: RGB = [170, 172, 178];
    const handle: RGB = [110, 72, 40];
    // scie et marteau stylisés
    for (let y = 4; y < 12; y++) set(img, 4, y, handle);
    for (let x = 2; x < 7; x++) set(img, x, 4, metal);
    for (let y = 5; y < 13; y++) set(img, 11, y, handle);
    for (let y = 3; y < 7; y++) {
      set(img, 10, y, metal);
      set(img, 12, y, metal);
    }
    for (let i = 0; i < 16; i++) set(img, i, 0, [74, 48, 24]);
    void def;
    void rng;
  },

  furnace(img, def, rng, lib) {
    img.set(lib.pixels('moellon'));
    const lit = def.lit === true;
    const dark: RGB = [38, 38, 42];
    for (let y = 7; y < 14; y++) for (let x = 4; x < 12; x++) set(img, x, y, dark);
    for (let x = 3; x < 13; x++) {
      set(img, x, 6, [150, 150, 158]);
      set(img, x, 14, [90, 90, 96]);
    }
    if (lit) {
      for (let y = 9; y < 14; y++)
        for (let x = 5; x < 11; x++) if (rng.chance(0.75)) set(img, x, y, y > 11 ? [255, 210, 80] : [240, 120, 30]);
    }
    for (let x = 4; x < 12; x += 2) set(img, x, 2, dark);
  },

  chest(img, def, rng, lib) {
    img.set(lib.pixels('planches_chene'));
    const band: RGB = [70, 45, 22];
    const face = (def.face as string) ?? 'side';
    for (let i = 0; i < 16; i++) {
      set(img, i, 0, band);
      set(img, i, 15, band);
      set(img, 0, i, band);
      set(img, 15, i, band);
    }
    if (face !== 'top') for (let i = 0; i < 16; i++) set(img, i, 6, band);
    if (face === 'front') {
      const gold: RGB = [230, 190, 70];
      for (let y = 5; y < 9; y++) for (let x = 7; x < 9; x++) set(img, x, y, gold);
      set(img, 7, 8, [120, 90, 20]);
    }
    void rng;
  },

  runestone(img, def, rng) {
    const pal = palette(def, ['#1d1826', '#2c2539', '#3b3350']);
    const glow = col(def.glow as string, '#e0662c');
    fillNoise(img, rng, pal, 0.25, 4);
    const glyphs = [
      [4, 3, 4, 8],
      [4, 3, 7, 3],
      [10, 4, 12, 7],
      [12, 7, 10, 11],
      [5, 11, 9, 11],
      [7, 9, 7, 13],
    ];
    for (const [x0, y0, x1, y1] of glyphs) {
      const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
      for (let s = 0; s <= steps; s++) set(img, Math.round(x0 + ((x1 - x0) * s) / steps), Math.round(y0 + ((y1 - y0) * s) / steps), glow);
    }
  },

  portal(img, def, rng) {
    const pal = palette(def, ['#3b0e4a', '#8a2bb0', '#e3a8ff']);
    for (let y = 0; y < TEX; y++)
      for (let x = 0; x < TEX; x++) {
        const a = Math.atan2(y - 7.5, x - 7.5);
        const r = Math.hypot(x - 7.5, y - 7.5);
        const s = Math.sin(a * 3 + r * 0.9) * 0.5 + 0.5;
        set(img, x, y, ramp(pal, clamp(s * 0.8 + rng.next() * 0.25, 0, 1)), (def.alpha as number) ?? 200);
      }
  },

  door(img, def, rng, lib) {
    const base = lib.pixels((def.base as string) ?? 'planches_chene');
    img.set(base);
    const frame = col(def.c?.[0], '#4f3419');
    const part = (def.part as string) ?? 'bottom';
    for (let i = 0; i < 16; i++) {
      set(img, 0, i, frame);
      set(img, 15, i, frame);
    }
    if (part === 'top') {
      for (let i = 0; i < 16; i++) set(img, i, 0, frame);
      const win = col(def.c?.[1], '#a8d4e0');
      for (let y = 3; y < 12; y++) for (let x = 3; x < 13; x++) set(img, x, y, x === 7 || x === 8 || y === 7 ? frame : win, x === 7 || x === 8 || y === 7 ? 255 : 150);
    } else {
      for (let i = 0; i < 16; i++) set(img, i, 15, frame);
      for (let y = 3; y < 13; y++) {
        set(img, 3, y, frame);
        set(img, 12, y, frame);
      }
      set(img, 12, 1, [200, 180, 90]);
      set(img, 13, 1, [200, 180, 90]);
    }
    void rng;
  },

  ladder(img, def, rng) {
    const c = col(def.c?.[0], '#8a6238');
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    for (let y = 0; y < 16; y++) {
      set(img, 2, y, mul(c, 0.85));
      set(img, 3, y, c);
      set(img, 12, y, c);
      set(img, 13, y, mul(c, 0.85));
    }
    for (const y of [2, 6, 10, 14]) for (let x = 2; x < 14; x++) set(img, x, y, mul(c, 0.95 + rng.next() * 0.1));
  },

  torch(img, def) {
    // Utilisée sur un modèle-boîte fin (2x10 pixels au centre).
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    const stick = col(def.c?.[0], '#7a5230');
    const flame = col(def.c?.[1], '#ffcf4a');
    for (let y = 6; y < 16; y++) {
      set(img, 7, y, stick);
      set(img, 8, y, mul(stick, 0.8));
    }
    set(img, 7, 6, flame);
    set(img, 8, 6, mul(flame, 0.9));
    set(img, 7, 5, [255, 245, 200]);
    set(img, 8, 5, flame);
  },

  lantern(img, def, rng) {
    const metal = col(def.c?.[0], '#3a3a40');
    const glow = col(def.c?.[1], '#ffd27a');
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const edge = x < 2 || x > 13 || y < 2 || y > 13;
        set(img, x, y, edge ? mul(metal, 0.9 + rng.next() * 0.2) : mul(glow, 0.9 + rng.next() * 0.15));
      }
    for (let x = 0; x < 16; x++) set(img, x, 8, metal);
  },

  lamp(img, def, rng) {
    const on = def.on === true;
    const frame = col(def.c?.[0], '#5b4630');
    const glass = on ? col(def.c?.[1], '#9ff3ff') : col(def.c?.[2], '#3b5157');
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const edge = x < 2 || x > 13 || y < 2 || y > 13 || x === 7 || x === 8 || y === 7 || y === 8;
        set(img, x, y, edge ? mul(frame, 0.9 + rng.next() * 0.15) : mul(glass, 0.85 + rng.next() * 0.25));
      }
  },

  lever(img, def) {
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    const stick = col(def.c?.[0], '#7a5230');
    const base = col(def.c?.[1], '#6d7179');
    for (let y = 2; y < 12; y++) set(img, 7, y, stick);
    for (let y = 11; y < 16; y++) for (let x = 4; x < 12; x++) set(img, x, y, base);
  },

  terracotta(img, def, rng) {
    const pal = palette(def, ['#a4583a', '#b86b45', '#c98256']);
    fillNoise(img, rng, pal, 0.5, 3);
    if (def.band) {
      const b = hexToRgb(def.band as string);
      for (let x = 0; x < 16; x++) {
        set(img, x, 5, b);
        set(img, x, 6, mul(b, 0.9));
      }
    }
  },

  tiles(img, def, rng) {
    const pal = palette(def, ['#6e2a22', '#8e3a2c', '#ad5040']);
    for (let y = 0; y < 16; y++) {
      const row = Math.floor(y / 4);
      for (let x = 0; x < 16; x++) {
        const lx = (x + (row % 2) * 2) % 4;
        const ly = y % 4;
        let t = 0.55 - ly * 0.1 + (rng.next() - 0.5) * 0.1;
        if (lx === 0) t -= 0.25;
        if (ly === 3) t = 0.05;
        set(img, x, y, ramp(pal, clamp(t, 0, 1)));
      }
    }
  },

  basalt(img, def, rng) {
    const pal = palette(def, ['#2b2a2e', '#3d3c42', '#525158']);
    const top = def.top === true;
    const n = fbmTile(rng, 0.35);
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        let t = n[y * 16 + x];
        if (top) {
          const d = Math.max(Math.abs(x - 7.5), Math.abs(y - 7.5));
          if (d > 6.5) t *= 0.6;
          else if (Math.round(d) % 3 === 0) t = t * 0.7 + 0.3;
        } else if (x % 5 === 0) t *= 0.55;
        set(img, x, y, ramp(pal, t));
      }
  },

  cactus(img, def, rng) {
    const pal = palette(def, ['#2c6a2a', '#3e8a38', '#58a84c']);
    const top = def.top === true;
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        let t = 0.5 + (rng.next() - 0.5) * 0.15;
        if (top) {
          const d = Math.hypot(x - 7.5, y - 7.5);
          t = d < 3 ? 0.8 : d < 6 ? 0.55 : 0.35;
          if (x === 0 || y === 0 || x === 15 || y === 15) t = 0.1;
        } else {
          if (x % 4 === 1) t = 0.25;
          if (x % 4 === 2) t = 0.75;
          if (x === 0 || x === 15) t = 0.05;
        }
        set(img, x, y, ramp(pal, t));
      }
    if (!top) for (let i = 0; i < 8; i++) set(img, rng.int(16), rng.int(16), [230, 225, 180]);
  },

  web(img, def) {
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    const c = col(def.c?.[0], '#e8e8ec');
    for (let i = 0; i < 16; i++) {
      set(img, i, i, c, 200);
      set(img, 15 - i, i, c, 200);
      set(img, 7, i, c, 170);
      set(img, i, 7, c, 170);
    }
    for (const r of [3, 6]) for (let a = 0; a < 24; a++) set(img, Math.round(7.5 + Math.cos(a / 3.8) * r), Math.round(7.5 + Math.sin(a / 3.8) * r), c, 180);
  },

  vines(img, def, rng) {
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    const pal = palette(def, ['#6a6a6a', '#8f8f8f', '#b5b5b5']);
    for (let s = 0; s < 5; s++) {
      let x = 1 + s * 3 + rng.int(2);
      for (let y = 0; y < 16; y++) {
        if (rng.chance(0.85)) set(img, x, y, ramp(pal, rng.next()), 254);
        if (rng.chance(0.3)) set(img, x + 1, y, ramp(pal, rng.next()), 254);
        if (rng.chance(0.2)) x = clamp(x + (rng.chance(0.5) ? 1 : -1), 0, 15);
      }
    }
  },

  farmland(img, def, rng, lib) {
    img.set(lib.pixels('terre'));
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (y % 4 === 0) set(img, x, y, mul(get(img, x, y), 0.7));
    void def;
    void rng;
  },

  spawner(img, def, rng) {
    const bar = col(def.c?.[0], '#2a2d36');
    const glow = col(def.c?.[1], '#5c2a7a');
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        const isBar = x % 5 === 0 || y % 5 === 0 || x === 15 || y === 15;
        set(img, x, y, isBar ? mul(bar, 0.9 + rng.next() * 0.2) : glow, isBar ? 255 : 90);
      }
  },

  bookshelf(img, def, rng, lib) {
    img.set(lib.pixels('planches_chene'));
    const colors: RGB[] = [
      [140, 40, 40],
      [40, 70, 130],
      [60, 110, 50],
      [150, 120, 50],
      [90, 50, 110],
    ];
    for (const shelfY of [1, 9]) {
      let x = 1;
      while (x < 15) {
        const w = rng.range(1, 2);
        const h = rng.range(5, 6);
        const c = rng.pick(colors);
        for (let dx = 0; dx < w && x + dx < 15; dx++) for (let dy = 0; dy < h; dy++) set(img, x + dx, shelfY + 6 - dy, mul(c, dx === 0 ? 1 : 0.85));
        x += w;
      }
      for (let i = 0; i < 16; i++) set(img, i, shelfY + 7 - 7 + 7, [74, 48, 24]);
    }
    void def;
  },

  altar(img, def, rng) {
    const pal = palette(def, ['#2f3b52', '#46587a', '#8fb0e0']);
    const glow = col(def.glow as string, '#9ff3ff');
    const top = def.top === true;
    fillNoise(img, rng, pal, 0.25, 4);
    if (top) {
      for (let a = 0; a < 32; a++) set(img, Math.round(7.5 + Math.cos(a / 5.1) * 5), Math.round(7.5 + Math.sin(a / 5.1) * 5), glow);
      set(img, 7, 7, glow);
      set(img, 8, 8, glow);
      set(img, 7, 8, glow);
      set(img, 8, 7, glow);
    } else {
      for (let x = 0; x < 16; x++) {
        set(img, x, 1, glow);
        set(img, x, 14, mul(pal[0], 0.7));
      }
      for (let y = 4; y < 12; y++) set(img, 7, y, glow);
    }
  },

  stars(img, def, rng) {
    const pal = palette(def, ['#1b1830', '#29254a', '#3a3466']);
    fillNoise(img, rng, pal, 0.3, 4);
    const star = col(def.star as string, '#fff6c8');
    for (let i = 0; i < ((def.count as number) ?? 6); i++) set(img, rng.int(16), rng.int(16), star);
  },

  fx(img, def, rng) {
    for (let i = 0; i < 256 * 4; i += 4) img[i + 3] = 0;
    const kind = def.kind as string;
    const c0 = col(def.c?.[0], '#ffffff');
    const c1 = col(def.c?.[1], '#cccccc');
    const disc = (cx: number, cy: number, r: number, c: RGB, a = 255) => {
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (Math.hypot(x - cx, y - cy) <= r) set(img, x, y, c, a);
    };
    if (kind === 'smoke') {
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        const d = Math.hypot(x - 7.5, y - 7.5);
        if (d < 6.5 && rng.chance(0.85)) set(img, x, y, mix(c0, c1, rng.next()), Math.round(200 * (1 - d / 7)));
      }
    } else if (kind === 'flame') {
      for (let y = 3; y < 16; y++) for (let x = 3; x < 13; x++) {
        const w = (y - 3) / 13 * 4.5;
        if (Math.abs(x - 7.5) <= w) set(img, x, y, y > 11 ? c1 : c0);
      }
    } else if (kind === 'spark') {
      disc(7.5, 7.5, 2, c0);
      for (let i = 0; i < 16; i++) {
        set(img, i, 7, c1, 160);
        set(img, 7, i, c1, 160);
      }
    } else if (kind === 'bubble') {
      for (let a = 0; a < 40; a++) set(img, Math.round(7.5 + Math.cos(a / 6.4) * 5), Math.round(7.5 + Math.sin(a / 6.4) * 5), c0);
      set(img, 5, 5, [255, 255, 255]);
    } else if (kind === 'heart') {
      const rows = ['..XX...XX..', '.XXXX.XXXX.', 'XXXXXXXXXXX', 'XXXXXXXXXXX', '.XXXXXXXXX.', '..XXXXXXX..', '...XXXXX...', '....XXX....', '.....X.....'];
      rows.forEach((r, y) => [...r].forEach((ch, x) => ch === 'X' && set(img, x + 2, y + 3, c0)));
    } else if (kind === 'star') {
      for (let i = -5; i <= 5; i++) {
        set(img, 7 + i, 7, c0);
        set(img, 7, 7 + i, c0);
        if (Math.abs(i) < 3) {
          set(img, 7 + i, 7 + i, c1);
          set(img, 7 + i, 7 - i, c1);
        }
      }
    } else if (kind === 'drop') {
      for (let y = 0; y < 16; y++) set(img, 7, y, c0, 150 + y * 6);
      for (let y = 4; y < 16; y++) set(img, 8, y, c1, 120);
    } else if (kind === 'flake') {
      disc(7.5, 7.5, 2.2, c0);
      set(img, 7, 3, c0);
      set(img, 7, 12, c0);
      set(img, 3, 7, c0);
      set(img, 12, 7, c0);
    } else {
      // disque doux (défaut : poussière, spores, cendre, portail)
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
        const d = Math.hypot(x - 7.5, y - 7.5);
        if (d < 6) set(img, x, y, mix(c0, c1, d / 6), Math.round(255 * (1 - d / 6.5)));
      }
    }
  },

  fungus_cap(img, def, rng) {
    const pal = palette(def, ['#7a1a1a', '#b5302a', '#ff7a3a']);
    fillNoise(img, rng, pal, 0.4, 4);
    for (let i = 0; i < 7; i++) {
      const x = rng.int(15),
        y = rng.int(15);
      set(img, x, y, [255, 200, 110]);
      set(img, x + 1, y, [255, 170, 80]);
    }
  },
};

// ---------------------------------------------------------------------------
// Bibliothèque de textures (résolution des dépendances entre textures)
// ---------------------------------------------------------------------------
export class TextureLibrary {
  private cache = new Map<string, Pixels>();
  constructor(private defs: Record<string, TextureDef>) {}

  has(name: string): boolean {
    return name in this.defs;
  }

  pixels(name: string): Pixels {
    const hit = this.cache.get(name);
    if (hit) return hit;
    const img = newImg();
    const def = this.defs[name];
    if (!def) {
      // Damier magenta = texture manquante
      for (let y = 0; y < TEX; y++) for (let x = 0; x < TEX; x++) set(img, x, y, (x >> 2) % 2 === (y >> 2) % 2 ? [255, 0, 255] : [20, 20, 20]);
    } else {
      const painter = PATTERNS[def.p] ?? PATTERNS.noise;
      const rng = new Rng(hashString(name) ^ ((def.seed as number) ?? 0));
      painter(img, def, rng, this);
      if (def.tintOpaque === false) for (let i = 3; i < img.length; i += 4) img[i] = 255;
    }
    this.cache.set(name, img);
    return img;
  }
}

/** Développe les textures « à étapes » (ex: culture ble -> ble_0..ble_7). */
export function expandTextureDefs(defs: Record<string, TextureDef>): Record<string, TextureDef> {
  const out: Record<string, TextureDef> = {};
  for (const [name, def] of Object.entries(defs)) {
    const stages = def.stages as number | undefined;
    if (stages && stages > 1) {
      for (let s = 0; s < stages; s++) out[`${name}_${s}`] = { ...def, stage: s };
    } else out[name] = def;
  }
  return out;
}

export const PATTERN_NAMES = Object.keys(PATTERNS);
export { alphaAt };
