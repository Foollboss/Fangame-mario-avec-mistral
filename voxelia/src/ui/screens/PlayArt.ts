/**
 * Illustrations procédurales de l'écran « Jouer » (dessin canvas original) :
 * miniature de monde par défaut, icône et bannière de serveur, panneau « héberger ».
 * Chaque image est rendue en basse résolution (style pixel) puis mise en cache en data URL.
 */

/** Hachage FNV-1a d'une chaîne (graine des illustrations). */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Générateur pseudo-aléatoire déterministe (mulberry32). */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Bruit 1D lissé (points de contrôle tous les `step` pixels), valeurs 0..1. */
function noise1D(r: () => number, width: number, step: number): number[] {
  const n = Math.ceil(width / step) + 2;
  const pts = Array.from({ length: n }, () => r());
  const out: number[] = [];
  for (let x = 0; x < width; x++) {
    const i = Math.floor(x / step);
    const f = (x % step) / step;
    const s = (1 - Math.cos(f * Math.PI)) / 2;
    out.push(pts[i] * (1 - s) + pts[i + 1] * s);
  }
  return out;
}

function hsl(h: number, s: number, l: number): string {
  return `hsl(${((h % 360) + 360) % 360},${Math.max(0, Math.min(100, s))}%,${Math.max(0, Math.min(100, l))}%)`;
}

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.imageSmoothingEnabled = false;
  return [c, g];
}

/** Bloc plein avec biseau : arête claire en haut, ombre en bas et à droite. */
function block(g: CanvasRenderingContext2D, x: number, y: number, s: number, hue: number, sat: number, light: number): void {
  g.fillStyle = hsl(hue, sat, light);
  g.fillRect(x, y, s, s);
  g.fillStyle = hsl(hue, sat, light + 12);
  g.fillRect(x, y, s, 1);
  g.fillStyle = hsl(hue, sat, light - 12);
  g.fillRect(x, y + s - 1, s, 1);
  g.fillRect(x + s - 1, y + 1, 1, s - 1);
}

/** Petit cube en perspective isométrique (face du dessus + deux côtés). */
function isoCube(g: CanvasRenderingContext2D, cx: number, cy: number, s: number, hue: number, sat: number, light: number): void {
  const hw = s;
  const hh = s / 2;
  g.fillStyle = hsl(hue, sat, light + 14);
  g.beginPath();
  g.moveTo(cx, cy - hh);
  g.lineTo(cx + hw, cy);
  g.lineTo(cx, cy + hh);
  g.lineTo(cx - hw, cy);
  g.closePath();
  g.fill();
  g.fillStyle = hsl(hue, sat, light);
  g.beginPath();
  g.moveTo(cx - hw, cy);
  g.lineTo(cx, cy + hh);
  g.lineTo(cx, cy + hh + s);
  g.lineTo(cx - hw, cy + s);
  g.closePath();
  g.fill();
  g.fillStyle = hsl(hue, sat, light - 14);
  g.beginPath();
  g.moveTo(cx + hw, cy);
  g.lineTo(cx, cy + hh);
  g.lineTo(cx, cy + hh + s);
  g.lineTo(cx + hw, cy + s);
  g.closePath();
  g.fill();
}

// ---------------------------------------------------------------- miniature de monde par défaut

const thumbCache = new Map<number, string>();

/** Paysage pixel (ciel, nuages, collines, rivière, arbres) varié selon la graine du monde. */
export function defaultWorldThumb(seed: number): string {
  const key = seed | 0;
  const hit = thumbCache.get(key);
  if (hit) return hit;
  const W = 64;
  const H = 36;
  const [c, g] = makeCanvas(W, H);
  const r = rng(key ^ 0x5bd1e995);

  // Ciel en dégradé par bandes.
  for (let y = 0; y < H; y++) {
    const t = Math.min(1, (y / H) * 1.5);
    g.fillStyle = `rgb(${Math.round(96 + 96 * t)},${Math.round(150 + 72 * t)},${Math.round(236 + 19 * t)})`;
    g.fillRect(0, y, W, 1);
  }
  // Soleil.
  const sx = 6 + Math.floor(r() * 16);
  g.fillStyle = '#fff2a8';
  g.fillRect(sx, 3, 5, 5);
  g.fillStyle = '#ffffff';
  g.fillRect(sx + 1, 4, 3, 3);
  // Nuages en blocs.
  for (let i = 0; i < 4; i++) {
    const cx = Math.floor(r() * W);
    const cy = 2 + Math.floor(r() * 9);
    const w = 6 + Math.floor(r() * 10);
    g.fillStyle = '#ffffff';
    g.fillRect(cx, cy, w, 2);
    g.fillRect(cx + 2, cy - 1, Math.max(2, w - 5), 1);
    g.fillStyle = '#dfe9f6';
    g.fillRect(cx, cy + 2, w, 1);
  }
  // Collines lointaines (brume).
  const far = noise1D(r, W, 10);
  for (let x = 0; x < W; x++) {
    const top = Math.round(H * 0.42 + far[x] * 7);
    g.fillStyle = '#7fa98a';
    g.fillRect(x, top, 1, H - top);
  }
  // Terrain en colonnes de 2 px (aspect « blocs »).
  const water = Math.round(H * 0.7);
  const rc = W * (0.25 + r() * 0.5);
  const rw = 5 + r() * 7;
  const near = noise1D(r, W, 12);
  const tops: number[] = [];
  for (let x = 0; x < W; x += 2) {
    const d = Math.abs(x - rc);
    let base = H * 0.6 + near[x] * 6;
    if (d < rw) base = water + 1 + (rw - d) * 0.35;
    const top = Math.round(base);
    tops.push(top);
    const sand = d < rw + 4;
    if (top > water) {
      g.fillStyle = '#3f74de';
      g.fillRect(x, water, 2, top - water);
      g.fillStyle = '#86b4ff';
      g.fillRect(x, water, 2, 1);
    }
    g.fillStyle = sand ? '#dccb86' : '#5fae3c';
    g.fillRect(x, top, 2, 2);
    if (!sand) {
      g.fillStyle = '#4a9030';
      g.fillRect(x, top + 2, 2, 1);
    }
    g.fillStyle = '#8d6440';
    g.fillRect(x, top + (sand ? 2 : 3), 2, 6);
    g.fillStyle = '#7a7a7a';
    g.fillRect(x, top + 9, 2, H);
    if (r() < 0.3) {
      g.fillStyle = '#5f5f5f';
      g.fillRect(x + (r() < 0.5 ? 0 : 1), top + 10 + Math.floor(r() * 6), 1, 1);
    }
  }
  // Arbres sur l'herbe.
  const trees = 3 + Math.floor(r() * 3);
  for (let i = 0; i < trees; i++) {
    const x = 2 + Math.floor(r() * (W - 6));
    if (Math.abs(x - rc) < rw + 5) continue;
    const top = tops[Math.floor(x / 2)];
    const th = 5 + Math.floor(r() * 4);
    g.fillStyle = '#6a4a2a';
    g.fillRect(x, top - th, 2, th);
    const lw = 7;
    const ly = top - th - 4;
    g.fillStyle = '#2f7a26';
    g.fillRect(x - 3, ly, lw + 1, 5);
    g.fillRect(x - 1, ly - 2, 4, 2);
    g.fillStyle = '#3f962f';
    for (let k = 0; k < 6; k++) g.fillRect(x - 3 + Math.floor(r() * lw), ly + Math.floor(r() * 4), 1, 1);
  }
  const url = c.toDataURL();
  thumbCache.set(key, url);
  return url;
}

// ---------------------------------------------------------------- icône de serveur

const iconCache = new Map<string, string>();

/** Icône symétrique 8×8 (motif et couleurs dérivés du nom). */
export function serverIcon(name: string): string {
  const hit = iconCache.get(name);
  if (hit) return hit;
  const hsh = hashString(name);
  const r = rng(hsh);
  const hue = hsh % 360;
  const [c, g] = makeCanvas(8, 8);
  const bg = hsl(hue, 45, 26);
  const fg = hsl(hue, 70, 55);
  const fg2 = hsl(hue + 40, 80, 72);
  for (let y = 0; y < 8; y++)
    for (let x = 0; x < 4; x++) {
      const v = r();
      g.fillStyle = v < 0.42 ? fg : v < 0.58 ? fg2 : bg;
      g.fillRect(x, y, 1, 1);
      g.fillRect(7 - x, y, 1, 1);
    }
  const url = c.toDataURL();
  iconCache.set(name, url);
  return url;
}

// ---------------------------------------------------------------- bannière de serveur

const bannerCache = new Map<string, string>();

/** Bannière : ciel teinté, montagnes, terrain en blocs, tours et île flottante. */
export function serverBanner(name: string): string {
  const hit = bannerCache.get(name);
  if (hit) return hit;
  const hsh = hashString(name);
  const r = rng(hsh ^ 0x27d4eb2f);
  const hue = hsh % 360;
  const W = 224;
  const H = 64;
  const S = 4;
  const [c, g] = makeCanvas(W, H);

  const sky = g.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, hsl(hue, 55, 58));
  sky.addColorStop(1, hsl(hue + 25, 60, 84));
  g.fillStyle = sky;
  g.fillRect(0, 0, W, H);
  // Astre carré.
  const ax = 10 + Math.floor(r() * 50);
  g.fillStyle = hsl(hue + 50, 90, 88);
  g.fillRect(ax - 1, 5, 10, 10);
  g.fillStyle = '#ffffff';
  g.fillRect(ax, 6, 8, 8);
  // Montagnes lointaines en paliers.
  const far = noise1D(r, W, 24);
  for (let x = 0; x < W; x += S) {
    const top = Math.round((H * 0.3 + far[x] * 18) / S) * S;
    g.fillStyle = hsl(hue + 10, 22, 52);
    g.fillRect(x, top, S, H - top);
    g.fillStyle = hsl(hue + 10, 15, 72);
    if (far[x] < 0.25) g.fillRect(x, top, S, 2);
  }
  // Terrain proche en blocs.
  const near = noise1D(r, W, 20);
  const tops: number[] = [];
  for (let x = 0; x < W; x += S) {
    const top = Math.round((H * 0.62 + near[x] * 10) / S) * S;
    tops.push(top);
    block(g, x, top, S, 105, 45, 42);
    for (let y = top + S; y < H; y += S) block(g, x, y, S, 28, 35, y > top + 8 ? 30 : 36);
  }
  // Tours de pierre avec toit coloré.
  const towers = 3 + Math.floor(r() * 2);
  for (let i = 0; i < towers; i++) {
    const col = 4 + Math.floor(r() * (W / S - 8));
    const x = col * S;
    const base = tops[col];
    const hgt = 4 + Math.floor(r() * 5);
    for (let k = 1; k <= hgt; k++) {
      block(g, x, base - k * S, S, hue, 8, 58);
      block(g, x + S, base - k * S, S, hue, 8, 54);
    }
    const roofY = base - (hgt + 1) * S;
    block(g, x - S / 2, roofY, S, hue + 180, 65, 48);
    block(g, x + S / 2, roofY, S, hue + 180, 65, 48);
    block(g, x + S + S / 2, roofY, S, hue + 180, 65, 44);
    block(g, x + S / 2, roofY - S, S, hue + 180, 65, 52);
    g.fillStyle = '#ffe070';
    g.fillRect(x + 1, base - Math.ceil(hgt / 2) * S + 1, 2, 2);
  }
  // Île flottante.
  const ix = Math.floor(W * 0.55 + r() * W * 0.3);
  const iy = 10 + Math.floor(r() * 10);
  const iw = 4 + Math.floor(r() * 3);
  for (let k = 0; k < iw; k++) {
    block(g, ix + k * S, iy, S, 105, 45, 46);
    const depth = Math.min(k + 1, iw - k, 3);
    for (let d = 1; d <= depth; d++) block(g, ix + k * S, iy + d * S, S, 28, 35, 34);
  }
  g.fillStyle = '#5a3a1a';
  g.fillRect(ix + S + 1, iy - 6, 2, 6);
  g.fillStyle = hsl(120, 50, 34);
  g.fillRect(ix + S - 2, iy - 10, 8, 5);
  const url = c.toDataURL();
  bannerCache.set(name, url);
  return url;
}

// ---------------------------------------------------------------- panneau « héberger un serveur »

let promoUrl = '';

type Scene = 'plaine' | 'desert' | 'nuit' | 'caverne' | 'neige' | 'jungle';
const SCENES: Scene[] = ['plaine', 'desert', 'nuit', 'caverne', 'neige', 'jungle'];

/** Petite vignette de paysage dans une tuile de la mosaïque. */
function miniScene(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, kind: Scene, r: () => number): void {
  const pal: Record<Scene, [string, string, string, string]> = {
    plaine: ['#78aef0', '#5fae3c', '#8d6440', '#2f7a26'],
    desert: ['#f0c070', '#e2cf8c', '#c8a860', '#3f8a3a'],
    nuit: ['#141a46', '#3a6a48', '#4a3a2a', '#e8e8ff'],
    caverne: ['#2a2a30', '#6a6a70', '#4a4a50', '#ff7a20'],
    neige: ['#a8c8f0', '#f4f8ff', '#8a8a96', '#2a5a3a'],
    jungle: ['#6ac0e0', '#2f9a30', '#5a3a1a', '#1f6a20'],
  };
  const [sky, ground, under, accent] = pal[kind];
  g.fillStyle = sky;
  g.fillRect(x, y, w, h);
  if (kind === 'nuit')
    for (let i = 0; i < 6; i++) {
      g.fillStyle = '#ffffff';
      g.fillRect(x + Math.floor(r() * w), y + Math.floor(r() * h * 0.5), 1, 1);
    }
  let gy = y + Math.floor(h * 0.6);
  for (let cx = 0; cx < w; cx += 3) {
    if (r() < 0.35) gy += r() < 0.5 ? -1 : 1;
    gy = Math.max(y + Math.floor(h * 0.4), Math.min(y + h - 3, gy));
    g.fillStyle = ground;
    g.fillRect(x + cx, gy, Math.min(3, w - cx), 2);
    g.fillStyle = under;
    g.fillRect(x + cx, gy + 2, Math.min(3, w - cx), y + h - gy - 2);
  }
  // Détail typique de la scène.
  const fx = x + 4 + Math.floor(r() * (w - 10));
  const fy = y + Math.floor(h * 0.6) - 1;
  g.fillStyle = accent;
  if (kind === 'desert') {
    g.fillRect(fx, fy - 6, 2, 7);
    g.fillRect(fx - 2, fy - 4, 2, 1);
  } else if (kind === 'nuit') {
    g.fillRect(x + w - 7, y + 2, 4, 4);
  } else if (kind === 'caverne') {
    g.fillRect(x, y + h - 3, w, 3);
    g.fillStyle = '#5ae0e0';
    g.fillRect(fx, y + 4, 2, 2);
  } else {
    g.fillStyle = '#6a4a2a';
    g.fillRect(fx, fy - 4, 2, 5);
    g.fillStyle = accent;
    g.fillRect(fx - 3, fy - 9, 8, 5);
  }
}

/** Mosaïque de mondes en perspective, cristal lumineux et blocs flottants. */
export function promoArt(): string {
  if (promoUrl) return promoUrl;
  const W = 240;
  const H = 140;
  const [c, g] = makeCanvas(W, H);
  const r = rng(0x766f78);
  const panel = '13,10,46';

  // Mosaïque inclinée.
  g.save();
  g.setTransform(1, -0.16, -0.42, 0.95, 70, 30);
  const tw = 38;
  const th = 26;
  for (let row = -1; row < 6; row++)
    for (let col = 0; col < 6; col++) {
      const x = col * (tw + 3);
      const y = row * (th + 3);
      miniScene(g, x, y, tw, th, SCENES[Math.floor(r() * SCENES.length)], r);
      g.fillStyle = 'rgba(0,0,0,0.25)';
      g.fillRect(x, y + th - 1, tw, 1);
    }
  g.restore();

  // Fondu vers la couleur du panneau (côté texte).
  const fade = g.createLinearGradient(0, 0, W * 0.62, 0);
  fade.addColorStop(0, `rgba(${panel},1)`);
  fade.addColorStop(0.55, `rgba(${panel},0.85)`);
  fade.addColorStop(1, `rgba(${panel},0)`);
  g.fillStyle = fade;
  g.fillRect(0, 0, W, H);
  const vfade = g.createLinearGradient(0, 0, 0, H);
  vfade.addColorStop(0, `rgba(${panel},0.35)`);
  vfade.addColorStop(0.3, `rgba(${panel},0)`);
  vfade.addColorStop(0.75, `rgba(${panel},0)`);
  vfade.addColorStop(1, `rgba(${panel},0.5)`);
  g.fillStyle = vfade;
  g.fillRect(0, 0, W, H);

  // Halo et cristal central.
  const cx = Math.round(W * 0.7);
  const cy = Math.round(H * 0.55);
  g.globalCompositeOperation = 'lighter';
  const glow = g.createRadialGradient(cx, cy, 2, cx, cy, 52);
  glow.addColorStop(0, 'rgba(255,80,220,0.75)');
  glow.addColorStop(0.5, 'rgba(160,40,200,0.28)');
  glow.addColorStop(1, 'rgba(80,0,120,0)');
  g.fillStyle = glow;
  g.fillRect(cx - 60, cy - 60, 120, 120);
  g.globalCompositeOperation = 'source-over';
  const rows = [2, 4, 6, 8, 10, 12, 12, 10, 10, 8, 6, 4, 2];
  rows.forEach((w, i) => {
    const y = cy - 14 + i * 2;
    g.fillStyle = '#c0209a';
    g.fillRect(cx - w / 2, y, w, 2);
    g.fillStyle = '#ff6ad8';
    g.fillRect(cx - w / 2, y, Math.ceil(w / 2), 2);
  });
  g.fillStyle = '#ffffff';
  g.fillRect(cx - 3, cy - 10, 2, 6);
  g.fillRect(cx - 1, cy - 12, 1, 2);
  // Étincelles.
  for (let i = 0; i < 34; i++) {
    const a = r() * Math.PI * 2;
    const d = 14 + r() * 40;
    g.fillStyle = r() < 0.4 ? '#ffffff' : '#ff7ae6';
    const s = r() < 0.25 ? 2 : 1;
    g.fillRect(Math.round(cx + Math.cos(a) * d), Math.round(cy + Math.sin(a) * d * 0.8), s, s);
  }
  // Blocs flottants autour du cristal.
  isoCube(g, cx - 34, cy - 30, 7, 105, 45, 42);
  isoCube(g, cx + 36, cy - 22, 6, 30, 10, 55);
  isoCube(g, cx + 28, cy + 26, 6, 48, 85, 52);
  isoCube(g, cx - 30, cy + 22, 5, 190, 70, 50);

  promoUrl = c.toDataURL();
  return promoUrl;
}
