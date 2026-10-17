/**
 * Peaux de l'équipement porté (armures, citrouille, planeur), peintes en code d'après les
 * couleurs des icônes : une seule texture partagée de 256×256, découpée en tuiles de 64×64
 * (une par matériau) peintes à la première utilisation.
 */
import * as THREE from 'three';
import { Skin, shade } from './BoxModel';
import { materialPalette } from '../render/textures/itemTextures';
import { rand3 } from '../util/random';

export const ATLAS_SIZE = 256;
const TILE = 64;
const TILES_PER_ROW = ATLAS_SIZE / TILE;

export type FaceName = 'top' | 'bottom' | 'right' | 'front' | 'left' | 'back';
export type EquipPiece = 'helmet' | 'sleeve' | 'body' | 'leg' | 'belt' | 'boot' | 'pumpkin' | 'wingR' | 'wingL';

/** Peau « boîte » de chaque pièce dans sa tuile : coin (u, v) puis taille en texels (largeur, hauteur, profondeur). */
export const PIECE_UV: Record<EquipPiece, readonly [number, number, number, number, number]> = {
  helmet: [0, 0, 10, 10, 10],
  sleeve: [40, 0, 6, 7, 6],
  body: [0, 20, 10, 14, 6],
  leg: [32, 20, 5, 10, 5],
  belt: [0, 40, 9, 4, 5],
  boot: [28, 40, 6, 5, 6],
  pumpkin: [0, 0, 10, 10, 10],
  wingR: [0, 0, 10, 20, 1],
  wingL: [22, 0, 10, 20, 1],
};

interface Pal {
  H: number;
  L: number;
  D: number;
}
type Deco = 'stitch' | 'rivet' | 'band' | 'facet' | 'scale' | 'vein' | 'star';
interface Style {
  noise: number;
  /** Métal brillant : reflets clairs sur les arêtes hautes. */
  shine: boolean;
  /** Casque à nasal (visière en T) plutôt que bonnet ouvert. */
  guard: boolean;
  deco: Deco;
  /** Assombrit l'intérieur des faces (métaux très clairs : les reflets ressortent mieux). */
  tone?: number;
}
const STYLES: Record<string, Style> = {
  leather: { noise: 0.08, shine: false, guard: false, deco: 'stitch' },
  iron: { noise: 0.04, shine: true, guard: true, deco: 'rivet', tone: 0.14 },
  golden: { noise: 0.04, shine: true, guard: false, deco: 'band' },
  diamond: { noise: 0.03, shine: true, guard: true, deco: 'facet' },
  mythril: { noise: 0.04, shine: true, guard: true, deco: 'scale' },
  etherium: { noise: 0.05, shine: true, guard: true, deco: 'vein' },
  celestine: { noise: 0.03, shine: true, guard: true, deco: 'star' },
};
const DEFAULT_STYLE: Style = { noise: 0.05, shine: true, guard: true, deco: 'rivet' };

let atlas: { skin: Skin; texture: THREE.CanvasTexture; tiles: Map<string, number> } | null = null;

function getAtlas(): NonNullable<typeof atlas> {
  if (atlas) return atlas;
  const skin = new Skin(ATLAS_SIZE, ATLAS_SIZE);
  const texture = new THREE.CanvasTexture(skin.canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.colorSpace = THREE.NoColorSpace;
  atlas = { skin, texture, tiles: new Map() };
  return atlas;
}

/** Texture partagée de tout l'équipement porté (jamais libérée : elle sert toute la partie). */
export function equipmentTexture(): THREE.Texture {
  return getAtlas().texture;
}

/** Clé de tuile d'un équipement : matériau connu, citrouille ou planeur (sinon fer). */
export function equipmentKey(key: string): string {
  return key === 'pumpkin' || key === 'glider' || materialPalette(key) ? key : 'iron';
}

/** Coin (en pixels de l'atlas) de la tuile d'un équipement, peinte à la première demande. */
export function equipmentTile(key: string): [number, number] {
  const a = getAtlas();
  const k = equipmentKey(key);
  let i = a.tiles.get(k);
  if (i === undefined) {
    if (a.tiles.size >= TILES_PER_ROW * TILES_PER_ROW) return equipmentTile('iron');
    i = a.tiles.size;
    a.tiles.set(k, i);
    const ox = (i % TILES_PER_ROW) * TILE;
    const oy = Math.floor(i / TILES_PER_ROW) * TILE;
    if (k === 'pumpkin') paintPumpkin(a.skin, ox, oy);
    else if (k === 'glider') paintGlider(a.skin, ox, oy);
    else paintArmor(a.skin, ox, oy, k);
    a.texture.needsUpdate = true;
  }
  return [(i % TILES_PER_ROW) * TILE, Math.floor(i / TILES_PER_ROW) * TILE];
}

// ------------------------------------------------------------------ peinture
type PixelFn = (f: FaceName, x: number, y: number, w: number, h: number) => number;

/** Peint chaque texel des six faces d'une pièce (une couleur négative laisse le texel transparent). */
function paintPiece(s: Skin, ox: number, oy: number, piece: EquipPiece, fn: PixelFn): void {
  const [u, v, w, h, d] = PIECE_UV[piece];
  const faces = s.faces(ox + u, oy + v, w, h, d);
  for (const f of Object.keys(faces) as FaceName[]) {
    const [fx, fy, fw, fh] = faces[f];
    for (let y = 0; y < fh; y++)
      for (let x = 0; x < fw; x++) {
        const c = fn(f, x, y, fw, fh);
        if (c >= 0) s.px(fx + x, fy + y, c);
      }
  }
}

function mix(a: number, b: number, t: number): number {
  const ch = (sh: number) => Math.round(((a >> sh) & 255) + (((b >> sh) & 255) - ((a >> sh) & 255)) * t);
  return (ch(16) << 16) | (ch(8) << 8) | ch(0);
}

const toInt = (c: readonly number[]) => (Math.round(c[0]) << 16) | (Math.round(c[1]) << 8) | Math.round(c[2]);

const SIDE = (f: FaceName) => f !== 'top' && f !== 'bottom';

function paintArmor(s: Skin, ox: number, oy: number, mat: string): void {
  const m = materialPalette(mat)!;
  const st = STYLES[mat] ?? DEFAULT_STYLE;
  const H = toInt(m.H);
  const D = toInt(m.D);
  const p: Pal = { H: st.tone ? mix(H, D, st.tone) : H, L: toInt(m.L), D };
  const seed = ox * 7 + oy * 13 + 1;
  let pieceSeed = seed;
  let piece: EquipPiece = 'helmet';
  /** Teinte de base d'un texel : arêtes hautes éclairées, bas et bords plus sombres, puis motif du matériau. */
  const base = (f: FaceName, x: number, y: number, w: number, h: number): number => {
    let c: number;
    const edgeX = x === 0 || x === w - 1;
    if (f === 'top') c = edgeX || y === 0 || y === h - 1 ? p.H : mix(p.H, p.L, st.shine ? 0.35 : 0.15);
    else if (f === 'bottom') c = p.D;
    else if (y === 0) c = st.shine ? mix(p.H, p.L, 0.6) : shade(p.H, 1.12);
    else if (y === h - 1) c = p.D;
    else if (edgeX) c = mix(p.H, p.D, 0.45);
    else c = deco(st.deco, p, piece, f, x, y, w, h, pieceSeed);
    return shade(c, 1 + (rand3(pieceSeed, x, y, f.length) - 0.5) * 2 * st.noise);
  };
  const ridge = (x: number, w: number) => st.shine && (x === (w >> 1) - 1 || x === w >> 1);

  // Casque : visage dégagé (bonnet de cuir) ou visière en T avec nasal (métaux)
  pieceSeed = seed + 1;
  piece = 'helmet';
  paintPiece(s, ox, oy, 'helmet', (f, x, y, w, h) => {
    if (f === 'bottom') return -1;
    if (f === 'front') {
      const top = st.guard ? 4 : 3;
      if (y >= top && x >= 2 && x <= w - 3) {
        const nose = st.guard && y <= 6 && (x === 4 || x === 5);
        if (!nose) return -1;
        return x === 4 ? mix(p.H, p.L, 0.4) : mix(p.H, p.D, 0.25);
      }
      if (y === top - 1 && x >= 1 && x <= w - 2) return mix(p.H, p.D, 0.55);
      if (y >= top && (x === 1 || x === w - 2)) return mix(p.H, p.D, 0.2);
    }
    if (f === 'top' && ridge(x, w)) return mix(p.H, p.L, 0.7);
    if (SIDE(f) && f !== 'front' && y === h - 1) return p.D;
    if ((f === 'left' || f === 'right') && st.deco === 'rivet' && y === 5 && (x === 4 || x === 5)) return p.D;
    return base(f, x, y, w, h);
  });

  // Plastron : arête centrale, taille marquée ; lacet et coutures pour le cuir
  pieceSeed = seed + 2;
  piece = 'body';
  paintPiece(s, ox, oy, 'body', (f, x, y, w, h) => {
    if (f === 'front' || f === 'back') {
      if (y === 0 && x >= 3 && x <= w - 4) return mix(p.H, p.D, 0.5);
      if (st.deco === 'stitch' && f === 'front' && y >= 1 && y <= 4 && (x === 4 || x === 5)) return (x + y) % 2 ? p.D : mix(p.H, p.L, 0.5);
      if (f === 'front' && y >= 1 && y <= 7 && ridge(x, w)) return x === (w >> 1) - 1 ? mix(p.H, p.L, 0.5) : mix(p.H, p.D, 0.15);
      if (y === 9 && x > 0 && x < w - 1) return mix(p.H, p.D, st.shine ? 0.55 : 0.4);
    }
    return base(f, x, y, w, h);
  });

  // Épaulières : bord éclairé, rivet, revers sombre
  pieceSeed = seed + 3;
  piece = 'sleeve';
  paintPiece(s, ox, oy, 'sleeve', (f, x, y, w, h) => {
    if (SIDE(f) && y === 1) return mix(p.H, p.L, st.shine ? 0.3 : 0.1);
    if (SIDE(f) && y === h - 2) return mix(p.H, p.D, 0.3);
    if (f === 'top') return x === 0 || y === 0 || x === w - 1 || y === h - 1 ? p.H : mix(p.H, p.L, st.shine ? 0.45 : 0.2);
    return base(f, x, y, w, h);
  });

  // Ceinture des jambières, avec boucle
  pieceSeed = seed + 4;
  piece = 'belt';
  const buckle = st.deco === 'band' ? { o: 0xd4d4d4, c: 0x8a8a8a } : { o: 0xf6d23c, c: 0xa07010 };
  paintPiece(s, ox, oy, 'belt', (f, x, y, w, h) => {
    if (f === 'front' && y >= 1 && y <= 2 && x >= 3 && x <= 5) return x === 4 && y === 2 ? buckle.c : buckle.o;
    if (SIDE(f) && y === 0) return mix(p.H, p.L, st.shine ? 0.4 : 0.15);
    return base(f, x, y, w, h);
  });

  // Jambes : genouillère
  pieceSeed = seed + 5;
  piece = 'leg';
  paintPiece(s, ox, oy, 'leg', (f, x, y, w, h) => {
    if (f === 'front' && x > 0 && x < w - 1) {
      if (y === 4) return mix(p.H, p.L, st.shine ? 0.55 : 0.25);
      if (y === 6) return mix(p.H, p.D, 0.45);
    }
    if ((f === 'left' || f === 'right') && st.deco === 'stitch' && x === w >> 1 && y > 0 && y < h - 1 && y % 2 === 0) return mix(p.H, p.L, 0.6);
    return base(f, x, y, w, h);
  });

  // Bottes : revers clair, coque de l'orteil, semelle sombre
  pieceSeed = seed + 6;
  piece = 'boot';
  paintPiece(s, ox, oy, 'boot', (f, x, y, w, h) => {
    if (f === 'bottom') return shade(p.D, 0.72);
    if (SIDE(f)) {
      if (y === h - 1) return shade(p.D, 0.72);
      if (y === 0) return st.shine ? mix(p.H, p.L, 0.6) : shade(p.H, 1.12);
      if (f === 'front' && y === 3 && x > 0 && x < w - 1) return mix(p.H, p.L, st.shine ? 0.45 : 0.2);
      if (y === 1) return mix(p.H, p.D, 0.3);
    }
    return base(f, x, y, w, h);
  });
}

/** Motif propre à chaque matériau, sur l'intérieur des faces latérales. */
function deco(d: Deco, p: Pal, piece: EquipPiece, f: FaceName, x: number, y: number, w: number, h: number, seed: number): number {
  const r = rand3(seed, x, y, f.length + 7);
  switch (d) {
    case 'stitch':
      return (y === 1 || y === h - 2) && x % 2 === 1 ? mix(p.H, p.L, 0.6) : p.H;
    case 'rivet':
      // Plaques rivetées (pas sur le casque : deux points y feraient des yeux)
      if (piece === 'body' && (f === 'front' || f === 'back') && y === 1 && (x === 1 || x === w - 2)) return p.D;
      if (piece === 'sleeve' && y === 3 && x === w >> 1) return p.D;
      if ((piece === 'body' && y === 5) || (piece === 'leg' && y === 2)) return mix(p.H, p.D, 0.3);
      return p.H;
    case 'band':
      return y === 2 ? mix(p.H, p.L, 0.6) : y === 3 ? mix(p.H, p.D, 0.35) : p.H;
    case 'facet':
      if ((x + y) % 4 === 0) return mix(p.H, p.L, 0.55);
      if ((x - y + 40) % 5 === 0) return mix(p.H, p.D, 0.3);
      return p.H;
    case 'scale':
      if (y % 3 === 2 && (x + Math.floor(y / 3)) % 2 === 0) return mix(p.H, p.D, 0.45);
      if (y % 3 === 0) return mix(p.H, p.L, 0.2);
      return p.H;
    case 'vein': {
      // Veines lumineuses en zigzag sur un fond plus sombre
      const zig = [0, 1, 2, 1][y % 4];
      const k = (x + zig + (seed % 7) + 70) % 7;
      if (k === 0) return mix(p.H, p.L, 0.8);
      if (k === 1 || k === 6) return p.H;
      return mix(p.H, p.D, 0.28);
    }
    case 'star':
      if (r > 0.94) return 0xffffff;
      if (r > 0.86) return mix(p.H, p.L, 0.6);
      return p.H;
  }
}

function paintPumpkin(s: Skin, ox: number, oy: number): void {
  const O = 0xe08a1e;
  const R = 0xb8660e;
  const C = 0x2e1404;
  // Visage taillé (10×10, vu de face)
  const face = [
    '..........',
    '..........',
    '..#....#..',
    '.###..###.',
    '..........',
    '....##....',
    '.##.##.##.',
    '..######..',
    '...#..#...',
    '..........',
  ];
  paintPiece(s, ox, oy, 'pumpkin', (f, x, y, w, h) => {
    const n = 1 + (rand3(91, x, y, f.length) - 0.5) * 0.1;
    if (f === 'top' || f === 'bottom') {
      const cx = Math.abs(x - (w - 1) / 2);
      const cy = Math.abs(y - (h - 1) / 2);
      if (f === 'top' && cx < 1 && cy < 1) return 0x5a7a2a;
      if (f === 'top' && cx < 2 && cy < 2) return shade(R, 0.85);
      return shade(f === 'bottom' ? R : x % 3 === 1 || y % 3 === 1 ? R : O, n);
    }
    if (f === 'front' && face[y][x] === '#') return y >= 6 ? 0x4a2006 : C;
    if (y === 0 || y === h - 1) return shade(R, n);
    return shade(x % 3 === 1 ? R : O, n);
  });
}

function paintGlider(s: Skin, ox: number, oy: number): void {
  const B = 0x3a6aa0;
  const L = 0x6a9ad0;
  const W = 0xe8f0f8;
  for (const piece of ['wingR', 'wingL'] as const) {
    paintPiece(s, ox, oy, piece, (f, x, y, w, h) => {
      // Distance au bord d'attaque (côté du pivot, à l'épaule) : il est à droite de la face
      // arrière de l'aile droite et à gauche de sa face avant, l'inverse pour l'aile gauche.
      const outerFace = piece === 'wingR' ? 'right' : 'left';
      if (f === 'top' || f === outerFace) return B;
      if (f !== 'front' && f !== 'back') return -1;
      const flip = (piece === 'wingR') === (f === 'back');
      const o = flip ? w - 1 - x : x;
      // Bord de fuite en plumes : chaque plume (3 rangées) est un peu plus courte que la précédente vers la pointe
      const limit = Math.min(w - 1 - (y % 3), w - 1 - Math.max(0, y - 13) * 1.5);
      if (o > limit) return -1;
      if (o === 0 || y === 0) return B;
      if (o === 1) return L;
      let c = o >= limit - 0.5 ? L : (y + o) % 4 === 0 ? mix(W, L, 0.45) : W;
      if (y === h - 1) c = L;
      return f === 'front' ? shade(c, 0.88) : c;
    });
  }
}
