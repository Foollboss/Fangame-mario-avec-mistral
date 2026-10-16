/**
 * Illustrations procédurales de l'écran « Paramètres du monde » (dessin canvas original) :
 * aperçu de paysage propre à chaque modèle de monde et petites icônes de permissions.
 * Les images sont rendues en basse résolution (style pixel) puis mises en cache en data URL.
 */
import type { WorldTemplate } from '../../world/gen/terrain';

const W = 96;
const H = 54;

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

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.imageSmoothingEnabled = false;
  return [c, g];
}

function rect(g: CanvasRenderingContext2D, color: string, x: number, y: number, w: number, h: number): void {
  g.fillStyle = color;
  g.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

// ---------------------------------------------------------------- éléments communs

/** Ciel en dégradé par bandes (plus chaud pour l'archipel). */
function sky(g: CanvasRenderingContext2D, warm: boolean): void {
  for (let y = 0; y < H; y++) {
    const t = Math.min(1, (y / H) * 1.6);
    const r = warm ? 110 + 110 * t : 92 + 100 * t;
    const gr = warm ? 170 + 60 * t : 146 + 76 * t;
    const b = warm ? 238 + 12 * t : 234 + 20 * t;
    rect(g, `rgb(${Math.round(r)},${Math.round(gr)},${Math.round(b)})`, 0, y, W, 1);
  }
}

function sun(g: CanvasRenderingContext2D, r: () => number): void {
  const x = 8 + Math.floor(r() * 30);
  rect(g, '#fff2a8', x, 4, 7, 7);
  rect(g, '#ffffff', x + 1, 5, 5, 5);
}

function clouds(g: CanvasRenderingContext2D, r: () => number, n: number, maxY: number): void {
  for (let i = 0; i < n; i++) {
    const x = Math.floor(r() * W) - 6;
    const y = 2 + Math.floor(r() * maxY);
    const w = 8 + Math.floor(r() * 14);
    rect(g, '#ffffff', x, y, w, 2);
    rect(g, '#ffffff', x + 3, y - 1, Math.max(3, w - 7), 1);
    rect(g, '#dfe9f6', x, y + 2, w, 1);
  }
}

/** Relief lointain voilé de brume. */
function farRange(g: CanvasRenderingContext2D, r: () => number, base: number, amp: number, step: number, color: string, sharp = false): void {
  const n = noise1D(r, W, step);
  for (let x = 0; x < W; x++) {
    const v = sharp ? 1 - Math.abs(n[x] * 2 - 1) : n[x];
    const top = Math.round(base - v * amp);
    rect(g, color, x, top, 1, H - top);
  }
}

type Mat = 'grass' | 'sand' | 'snow' | 'stone';

const MAT: Record<Mat, { top: string; edge: string; body: string; depth: number }> = {
  grass: { top: '#5fae3c', edge: '#4a9030', body: '#8d6440', depth: 6 },
  sand: { top: '#dccb86', edge: '#cdb974', body: '#c8b26e', depth: 5 },
  snow: { top: '#f2f6fa', edge: '#cfd8e2', body: '#8a8a8a', depth: 4 },
  stone: { top: '#a2a2a2', edge: '#8c8c8c', body: '#7f7f7f', depth: 4 },
};

/**
 * Terrain en colonnes de 2 px (aspect « blocs ») : eau au-dessus des colonnes immergées,
 * couche de surface, sous-sol, pierre profonde mouchetée.
 */
function columns(g: CanvasRenderingContext2D, r: () => number, tops: number[], water: number, matAt: (i: number, top: number) => Mat, waterColor = '#3f74de', surfColor = '#86b4ff'): void {
  for (let i = 0; i < tops.length; i++) {
    const x = i * 2;
    const top = tops[i];
    const m = MAT[matAt(i, top)];
    if (water >= 0 && top > water) {
      rect(g, waterColor, x, water, 2, top - water);
      rect(g, surfColor, x, water, 2, 1);
    }
    rect(g, m.top, x, top, 2, 2);
    rect(g, m.edge, x, top + 2, 2, 1);
    rect(g, m.body, x, top + 3, 2, m.depth);
    rect(g, '#767676', x, top + 3 + m.depth, 2, H);
    if (r() < 0.35) rect(g, '#5f5f5f', x + (r() < 0.5 ? 0 : 1), top + 4 + m.depth + Math.floor(r() * 8), 1, 1);
  }
}

function oak(g: CanvasRenderingContext2D, r: () => number, x: number, top: number): void {
  const th = 5 + Math.floor(r() * 3);
  rect(g, '#6a4a2a', x, top - th, 2, th);
  const ly = top - th - 4;
  rect(g, '#2f7a26', x - 3, ly, 8, 5);
  rect(g, '#2f7a26', x - 1, ly - 2, 4, 2);
  for (let k = 0; k < 6; k++) rect(g, '#3f962f', x - 3 + Math.floor(r() * 8), ly + Math.floor(r() * 4), 1, 1);
}

function spruce(g: CanvasRenderingContext2D, x: number, top: number): void {
  rect(g, '#5a3c20', x, top - 3, 2, 3);
  for (let k = 0; k < 4; k++) rect(g, k % 2 ? '#2a5a34' : '#1f4a2a', x - 3 + k, top - 4 - k * 2, 8 - k * 2, 2);
  rect(g, '#1f4a2a', x, top - 12, 2, 2);
}

function palm(g: CanvasRenderingContext2D, x: number, top: number, lean: number): void {
  for (let k = 0; k < 7; k++) rect(g, '#8a6a3a', x + Math.round((k / 7) * lean), top - 1 - k, 1, 1);
  const cx = x + lean;
  const cy = top - 8;
  rect(g, '#3caa3a', cx - 4, cy, 9, 1);
  rect(g, '#3caa3a', cx - 2, cy - 1, 5, 1);
  rect(g, '#2a8a2a', cx - 5, cy + 1, 2, 1);
  rect(g, '#2a8a2a', cx + 4, cy + 1, 2, 1);
  rect(g, '#6a4a20', cx, cy + 1, 1, 1);
}

// ---------------------------------------------------------------- un dessin par modèle

function drawDefault(g: CanvasRenderingContext2D, r: () => number): void {
  sky(g, false);
  sun(g, r);
  clouds(g, r, 4, 12);
  farRange(g, r, H * 0.5, 8, 12, '#7fa98a');
  const water = Math.round(H * 0.7);
  const rc = W * (0.25 + r() * 0.5);
  const rw = 6 + r() * 8;
  const near = noise1D(r, W, 14);
  const tops: number[] = [];
  for (let x = 0; x < W; x += 2) {
    const d = Math.abs(x - rc);
    let base = H * 0.6 + near[x] * 7;
    if (d < rw) base = water + 1 + (rw - d) * 0.35;
    tops.push(Math.round(base));
  }
  columns(g, r, tops, water, (i) => (Math.abs(i * 2 - rc) < rw + 4 ? 'sand' : 'grass'));
  const n = 3 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const x = 2 + Math.floor(r() * (W - 8));
    if (Math.abs(x - rc) < rw + 6) continue;
    oak(g, r, x, tops[Math.floor(x / 2)]);
  }
}

function drawFlat(g: CanvasRenderingContext2D, r: () => number): void {
  sky(g, false);
  sun(g, r);
  clouds(g, r, 5, 14);
  const top = Math.round(H * 0.68);
  rect(g, '#5fae3c', 0, top, W, 2);
  rect(g, '#4a9030', 0, top + 2, W, 1);
  rect(g, '#8d6440', 0, top + 3, W, 6);
  rect(g, '#767676', 0, top + 9, W, H);
  rect(g, '#3a3a3a', 0, H - 3, W, 3);
  for (let x = 0; x < W; x += 2) if (r() < 0.3) rect(g, '#5f5f5f', x, top + 10 + Math.floor(r() * 4), 1, 1);
  // Petite cabane en planches et quelques blocs posés : un monde prêt pour la construction.
  const hx = 18 + Math.floor(r() * 40);
  rect(g, '#b08a52', hx, top - 10, 16, 10);
  rect(g, '#8a6a3a', hx, top - 10, 16, 1);
  rect(g, '#7a4a2a', hx - 2, top - 13, 20, 3);
  rect(g, '#5a3a20', hx + 6, top - 6, 4, 6);
  rect(g, '#a8d8ff', hx + 2, top - 7, 3, 3);
  rect(g, '#a8d8ff', hx + 11, top - 7, 3, 3);
  const bx = (hx + 30) % (W - 10);
  rect(g, '#8c8c8c', bx, top - 4, 4, 4);
  rect(g, '#8c8c8c', bx + 4, top - 4, 4, 4);
  rect(g, '#9a9a9a', bx + 2, top - 8, 4, 4);
  oak(g, r, (hx + 60) % (W - 6) + 3, top);
}

function drawArchipelago(g: CanvasRenderingContext2D, r: () => number): void {
  sky(g, true);
  sun(g, r);
  clouds(g, r, 3, 10);
  const water = Math.round(H * 0.6);
  // Océan : bandes de plus en plus profondes.
  for (let y = water; y < H; y++) {
    const t = (y - water) / (H - water);
    rect(g, `rgb(${Math.round(40 - 20 * t)},${Math.round(182 - 70 * t)},${Math.round(216 - 40 * t)})`, 0, y, W, 1);
  }
  rect(g, '#8fe4f5', 0, water, W, 1);
  // Îles : bosses de sable coiffées d'herbe, palmiers.
  const islands = 3 + Math.floor(r() * 2);
  for (let k = 0; k < islands; k++) {
    const cx = 8 + Math.floor(((k + r() * 0.6) / islands) * (W - 16));
    const rw = 5 + Math.floor(r() * 7);
    let peak = water;
    for (let x = cx - rw; x <= cx + rw; x += 2) {
      if (x < 0 || x >= W) continue;
      const d = Math.abs(x - cx) / rw;
      const top = Math.round(water - (1 - d * d) * (3 + rw * 0.5));
      peak = Math.min(peak, top);
      const grass = d < 0.55 && top < water - 2;
      rect(g, grass ? '#59c93c' : '#e4d494', x, top, 2, 2);
      rect(g, grass ? '#3faa30' : '#d2bf78', x, top + 2, 2, Math.max(1, water - top - 1));
      rect(g, '#c8b26e', x, water + 1, 2, 2);
    }
    if (rw > 6) palm(g, cx - 1, peak, r() < 0.5 ? -3 : 3);
  }
  // Reflets.
  for (let i = 0; i < 10; i++) rect(g, '#bdf2fa', Math.floor(r() * W), water + 3 + Math.floor(r() * (H - water - 4)), 3, 1);
}

function drawAmplified(g: CanvasRenderingContext2D, r: () => number): void {
  sky(g, false);
  clouds(g, r, 3, 8);
  farRange(g, r, H * 0.5, 30, 9, '#a9bccf', true);
  farRange(g, r, H * 0.62, 22, 7, '#8aa596', true);
  const water = Math.round(H * 0.86);
  const n = noise1D(r, W, 8);
  const v = noise1D(r, W, 5);
  const tops: number[] = [];
  for (let x = 0; x < W; x += 2) {
    const peak = 1 - Math.abs(n[x] * 2 - 1);
    tops.push(Math.round(H * 0.95 - peak * H * 0.72 - v[x] * 5));
  }
  columns(g, r, tops, water, (_i, top) => (top < H * 0.36 ? 'snow' : top < H * 0.62 ? 'stone' : 'grass'));
  for (let i = 0; i < 6; i++) {
    const x = 2 + Math.floor(r() * (W - 6));
    const top = tops[Math.floor(x / 2)];
    if (top >= H * 0.62 && top < water) spruce(g, x, top);
  }
}

function drawContinents(g: CanvasRenderingContext2D, r: () => number): void {
  sky(g, false);
  sun(g, r);
  clouds(g, r, 4, 12);
  const coast = Math.round(W * (0.55 + r() * 0.15));
  // Chaîne lointaine sur le continent seulement.
  const far = noise1D(r, W, 10);
  for (let x = 0; x < coast - 6; x++) {
    const top = Math.round(H * 0.42 - far[x] * 12);
    rect(g, '#8fb0a0', x, top, 1, H - top);
  }
  const water = Math.round(H * 0.68);
  const near = noise1D(r, W, 12);
  const tops: number[] = [];
  for (let x = 0; x < W; x += 2) {
    let top = H * 0.56 + near[x] * 6;
    if (x > coast) top += (x - coast) * 0.9;
    tops.push(Math.round(Math.min(H - 4, top)));
  }
  columns(g, r, tops, water, (_i, top) => (top >= water - 3 ? 'sand' : 'grass'));
  for (let i = 0; i < 5; i++) {
    const x = 2 + Math.floor(r() * (coast - 10));
    oak(g, r, x, tops[Math.floor(x / 2)]);
  }
}

const DRAW: Record<WorldTemplate, (g: CanvasRenderingContext2D, r: () => number) => void> = {
  default: drawDefault,
  flat: drawFlat,
  archipelago: drawArchipelago,
  amplified: drawAmplified,
  continents: drawContinents,
};

const artCache = new Map<string, string>();

/** Aperçu de paysage (96×54) pour un modèle de monde, varié selon la graine. */
export function templateArt(template: WorldTemplate, seed: number): string {
  const key = template + ':' + (seed >>> 0);
  const hit = artCache.get(key);
  if (hit) return hit;
  const [c, g] = makeCanvas(W, H);
  (DRAW[template] ?? drawDefault)(g, rng((seed >>> 0) ^ 0x2c1b3c6d));
  const url = c.toDataURL();
  // Cache borné : la graine change à chaque frappe dans le champ.
  if (artCache.size > 48) artCache.delete(artCache.keys().next().value as string);
  artCache.set(key, url);
  return url;
}

// ---------------------------------------------------------------- icônes de permissions

export type PermissionKind = 'visitor' | 'member' | 'operator';

/** Silhouette commune + symbole : œil (visiteur), bloc (membre), étoile (opérateur). */
const PERSON = ['.XXX.', '.XXX.', '..X..', 'XXXXX', '..X..', '..X..', '.X.X.', 'X...X'];
const SYMBOL: Record<PermissionKind, string[]> = {
  visitor: ['......', '.XXXX.', 'X.XX.X', '.XXXX.', '......'],
  member: ['XXXXX', 'X.X.X', 'XXXXX', 'X.X.X', 'XXXXX'],
  operator: ['..X..', '..X..', 'XXXXX', '.XXX.', '.X.X.'],
};

const permCache = new Map<PermissionKind, string>();

/** Icône 12×10 sombre (#313233) ; l'état sélectionné l'éclaircit en CSS. */
export function permissionIcon(kind: PermissionKind): string {
  const hit = permCache.get(kind);
  if (hit) return hit;
  const [c, g] = makeCanvas(12, 10);
  g.fillStyle = '#313233';
  PERSON.forEach((row, y) => [...row].forEach((ch, x) => ch === 'X' && g.fillRect(x, y + 1, 1, 1)));
  SYMBOL[kind].forEach((row, y) => [...row].forEach((ch, x) => ch === 'X' && g.fillRect(x + 6, y + 4, 1, 1)));
  const url = c.toDataURL();
  permCache.set(kind, url);
  return url;
}
