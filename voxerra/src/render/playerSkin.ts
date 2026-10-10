/**
 * Textures en pixel art du joueur, dessinées face par face à partir de son skin : visage et
 * cheveux selon la coiffure, haut (motif, manches, ceinture), pantalon et chaussures, accessoires.
 * Faces dans l'ordre de THREE.BoxGeometry : +X, −X, +Y (dessus), −Y (dessous), +Z (dos), −Z (avant).
 */
import type { Skin } from '../entity/skin';
import { hexToRgb } from '../engine/math';
import { hashString } from '../engine/rng';

type RGB = [number, number, number];

const shade = (c: RGB, f: number): RGB => [c[0] * f, c[1] * f, c[2] * f];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const luminance = (c: RGB): number => (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) / 255;
const WHITE: RGB = [255, 255, 255];
/** Variante qui ressort sur une couleur : plus claire sur un fond sombre, plus sombre sur un fond clair. */
const accent = (c: RGB): RGB => (luminance(c) > 0.55 ? shade(c, 0.68) : mix(c, WHITE, 0.35));

/** Largeur et hauteur (en pixels du modèle) d'une face d'une boîte w×h×d. */
export function faceSize(face: number, w: number, h: number, d: number): [number, number] {
  return face <= 1 ? [d, h] : face <= 3 ? [w, d] : [w, h];
}

class Pixels {
  readonly data: RGB[];
  constructor(
    readonly w: number,
    readonly h: number,
    fill: RGB,
    private seed: number,
  ) {
    this.data = Array.from({ length: w * h }, () => fill);
  }
  set(x: number, y: number, c: RGB): void {
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.data[y * this.w + x] = c;
  }
  rows(y0: number, y1: number, c: RGB, cols?: (x: number) => boolean): void {
    for (let y = y0; y <= y1; y++) for (let x = 0; x < this.w; x++) if (!cols || cols(x)) this.set(x, y, c);
  }
  /** Léger grain, déterministe, pour donner une texture de tissu ou de peau. */
  toCanvas(grain = 0.07): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.width = this.w;
    c.height = this.h;
    const g = c.getContext('2d')!;
    const img = g.createImageData(this.w, this.h);
    for (let i = 0; i < this.data.length; i++) {
      const r = (Math.imul(this.seed ^ (i * 0x9e3779b1), 0x85ebca6b) >>> 0) / 4294967296;
      const f = 1 - grain + r * grain * 1.6;
      const [cr, cg, cb] = this.data[i];
      img.data[i * 4] = Math.max(0, Math.min(255, cr * f));
      img.data[i * 4 + 1] = Math.max(0, Math.min(255, cg * f));
      img.data[i * 4 + 2] = Math.max(0, Math.min(255, cb * f));
      img.data[i * 4 + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c;
  }
}

/** Face latérale : vrai si la colonne x est parmi les n colonnes du côté du dos. */
const backCols = (face: number, w: number, n: number) => (x: number) => (face === 0 ? x < n : x >= w - n);

function head(p: Pixels, s: Skin, face: number): void {
  const hair = hexToRgb(s.cheveux) as RGB;
  const st = s.coiffure;
  const bald = st === 'chauve';
  if (face === 2) {
    if (!bald) p.rows(0, p.h - 1, hair);
    return;
  }
  if (face === 3) return;
  if (face === 5) {
    // yeux (blanc à l'extérieur), bouche
    const eye = hexToRgb(s.yeux) as RGB;
    const white: RGB = [244, 244, 240];
    p.set(1, 4, white);
    p.set(2, 4, eye);
    p.set(5, 4, eye);
    p.set(6, 4, white);
    p.set(3, 6, shade(hexToRgb(s.peau) as RGB, 0.72));
    p.set(4, 6, shade(hexToRgb(s.peau) as RGB, 0.72));
    if (!bald) {
      p.rows(0, 1, hair);
      if (st === 'longue') for (let y = 2; y <= 6; y++) (p.set(0, y, hair), p.set(7, y, hair));
      if (st === 'herissee') for (const x of [0, 2, 5, 7]) p.set(x, 2, hair);
      if (st === 'courte' || st === 'queue') (p.set(0, 2, hair), p.set(7, 2, hair));
    }
    if (s.accessoire === 'lunettes') {
      const lens = hexToRgb(s.accessoireCouleur) as RGB;
      const frame: RGB = [26, 26, 30];
      for (const x of [1, 2, 5, 6]) p.set(x, 4, lens);
      for (const x of [0, 3, 4, 7]) p.set(x, 4, frame);
      p.set(2, 4, mix(lens, WHITE, 0.25));
      p.set(6, 4, mix(lens, WHITE, 0.25));
    }
    return;
  }
  if (bald) return;
  if (face === 4) {
    p.rows(0, st === 'longue' ? 7 : st === 'queue' ? 6 : 5, hair);
    return;
  }
  // côtés
  p.rows(0, 2, hair);
  if (st === 'longue') p.rows(3, 7, hair, backCols(face, p.w, 5));
  else p.rows(3, 5, hair, backCols(face, p.w, 3));
  if (s.accessoire === 'lunettes') p.set(face === 0 ? p.w - 1 : 0, 4, [26, 26, 30]);
}

function shirt(p: Pixels, s: Skin, face: number, y0: number, y1: number): void {
  const top = hexToRgb(s.haut) as RGB;
  p.rows(y0, y1, top);
  if (s.motif === 'rayures') for (let y = y0; y <= y1; y++) if (y % 4 >= 2) p.rows(y, y, accent(top));
  void face;
}

function body(p: Pixels, s: Skin, face: number): void {
  const top = hexToRgb(s.haut) as RGB;
  if (face === 2 || face === 3) return void p.rows(0, p.h - 1, top);
  shirt(p, s, face, 0, p.h - 1);
  if (face === 5) {
    const skinC = hexToRgb(s.peau) as RGB;
    if (s.motif === 'veste') {
      const inner: RGB = luminance(top) > 0.55 ? [58, 58, 64] : [232, 228, 220];
      p.rows(0, p.h - 2, inner, (x) => x === 3 || x === 4);
      p.rows(0, 1, shade(top, 0.8), (x) => x === 2 || x === 5);
    } else if (s.motif === 'embleme') {
      const em = hexToRgb(s.accessoireCouleur) as RGB;
      for (const [x, y] of [[3, 2], [4, 2], [2, 3], [3, 3], [4, 3], [5, 3], [2, 4], [3, 4], [4, 4], [5, 4], [3, 5], [4, 5]]) p.set(x, y, em);
      p.set(3, 3, mix(em, WHITE, 0.45));
    }
    if (s.motif !== 'veste') (p.set(3, 0, skinC), p.set(4, 0, skinC));
  }
  // ceinture
  const belt: RGB = [58, 42, 26];
  p.rows(p.h - 1, p.h - 1, belt);
  if (face === 5) (p.set(3, p.h - 1, [216, 176, 64]), p.set(4, p.h - 1, [216, 176, 64]));
}

function arm(p: Pixels, s: Skin, face: number): void {
  const skinC = hexToRgb(s.peau) as RGB;
  const top = hexToRgb(s.haut) as RGB;
  if (face === 2) return void p.rows(0, p.h - 1, top);
  if (face === 3) return void p.rows(0, p.h - 1, skinC);
  const sleeve = s.manches === 'longues' ? 9 : 3;
  p.rows(0, p.h - 1, skinC);
  shirt(p, s, face, 0, sleeve);
  p.rows(sleeve, sleeve, shade(top, 0.82));
}

function leg(p: Pixels, s: Skin, face: number): void {
  const pants = hexToRgb(s.bas) as RGB;
  const shoes = hexToRgb(s.chaussures) as RGB;
  if (face === 2) return void p.rows(0, p.h - 1, pants);
  if (face === 3) return void p.rows(0, p.h - 1, shade(shoes, 0.7));
  p.rows(0, 8, pants);
  p.rows(9, 11, shoes);
  p.rows(11, 11, shade(shoes, 0.72));
}

function accessory(p: Pixels, s: Skin, part: string, face: number): void {
  const c = hexToRgb(s.accessoireCouleur) as RGB;
  if (part === 'scarf') {
    p.rows(0, p.h - 1, c);
    for (let x = 0; x < p.w; x += 3) p.rows(0, p.h - 1, shade(c, 0.8), (xx) => xx === x);
  } else if (part === 'cape') {
    p.rows(0, p.h - 1, face === 5 ? shade(c, 0.62) : c);
    if (face === 4) {
      p.rows(p.h - 1, p.h - 1, shade(c, 0.75));
      p.rows(0, p.h - 1, shade(c, 0.85), (x) => x === 0 || x === p.w - 1);
    }
  } else if (part === 'cap') {
    p.rows(0, p.h - 1, c);
    if (face === 5) p.set(Math.floor(p.w / 2), Math.floor(p.h / 2), mix(c, WHITE, 0.6));
    if (face !== 2) p.rows(p.h - 1, p.h - 1, shade(c, 0.78));
  } else if (part === 'cap_brim') p.rows(0, p.h - 1, shade(c, face === 2 ? 0.92 : 0.7));
}

/** Toile d'une face d'une pièce du joueur. */
export function paintSkinFace(s: Skin, part: string, face: number, fw: number, fh: number): HTMLCanvasElement {
  const w = Math.max(1, Math.round(fw)),
    h = Math.max(1, Math.round(fh));
  const seed = hashString(part + face);
  if (part.startsWith('hair_')) {
    const hair = hexToRgb(s.cheveux) as RGB;
    const p = new Pixels(w, h, hair, seed);
    for (let x = 1; x < w; x += 2) p.rows(0, h - 1, shade(hair, 0.86), (xx) => xx === x);
    return p.toCanvas(0.06);
  }
  const base: RGB = part === 'head' ? (hexToRgb(s.peau) as RGB) : (hexToRgb(s.haut) as RGB);
  const p = new Pixels(w, h, base, seed);
  if (part === 'head') head(p, s, face);
  else if (part === 'body') body(p, s, face);
  else if (part === 'arm_r' || part === 'arm_l') arm(p, s, face);
  else if (part === 'leg_r' || part === 'leg_l') leg(p, s, face);
  else accessory(p, s, part, face);
  return p.toCanvas(part === 'head' ? 0.04 : 0.07);
}

/**
 * Le joueur vu de face, en pixels (18×36, marge pour les épis et la casquette) : faces avant de
 * chaque pièce, des plus éloignées aux plus proches. Pour l'inventaire et les vignettes.
 */
export function drawSkinFront(s: Skin, parts: { id: string; size: [number, number, number]; pos: [number, number, number] }[]): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 18;
  c.height = 36;
  const g = c.getContext('2d')!;
  g.imageSmoothingEnabled = false;
  const ox = 1,
    oy = 3;
  for (const p of [...parts].sort((a, b) => b.pos[2] - a.pos[2])) {
    const [w, h] = faceSize(5, ...p.size);
    // l'avant du modèle regarde vers −Z : son côté +X apparaît à gauche
    const x = Math.round(ox + 8 - (p.pos[0] + p.size[0]));
    const y = Math.round(oy + 32 - (p.pos[1] + p.size[1]));
    g.drawImage(paintSkinFace(s, p.id, 5, w, h), x, y);
  }
  return c;
}
