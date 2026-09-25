/**
 * Outil de construction des structures : coordonnées locales tournées autour
 * d'une origine, écriture limitée à la colonne en cours de génération
 * (chaque colonne reconstruit sa part de la structure, de façon déterministe),
 * aides pour escaliers, portes, torches, échelles, coffres, foyers, entités.
 *
 * Directions (même convention que le jeu) : 0 sud (+Z), 1 ouest (−X),
 * 2 nord (−Z), 3 est (+X).
 */
import type { ChunkBuffer } from '../buffer';
import type { Content } from '../../registry/content';
import { makeCell, Shape } from '../../registry/blocks';
import { hash3, hashFloat } from '../../engine/rng';
import { CS } from '../../world/constants';

export const S = 0,
  W = 1,
  N = 2,
  E = 3;
export const DX = [0, -1, 0, 1];
export const DZ = [1, 0, -1, 0];

const TREE_MASKS = new WeakMap<Content, Uint8Array>();
/** Blocs d'arbres (troncs, feuillages, pousses) retirés autour des structures. */
function treeMask(content: Content): Uint8Array {
  let m = TREE_MASKS.get(content);
  if (!m) {
    const reg = content.blocks;
    m = new Uint8Array(4096);
    for (let i = 1; i < reg.count; i++) if (reg.hasTag(i, 'log') || reg.hasTag(i, 'leaves') || reg.hasTag(i, 'sapling') || reg.hasTag(i, 'mushroom')) m[i] = 1;
    for (const id of ['chapeau_rouge', 'chapeau_brun', 'pied_champignon', 'lianes', 'cactus']) {
      const n = reg.tryNum(id);
      if (n) m[n] = 1;
    }
    TREE_MASKS.set(content, m);
  }
  return m;
}

/** Noms de blocs inconnus rencontrés (contrôle des données, tests). */
export const MISSING_BLOCKS = new Set<string>();

export class Builder {
  private cache = new Map<string, number>();
  readonly t: ChunkBuffer['t'];

  constructor(
    readonly buf: ChunkBuffer,
    readonly content: Content,
    public ox: number,
    public oy: number,
    public oz: number,
    public rot: number,
    readonly seed: number,
  ) {
    this.t = buf.t;
  }

  /** Numéro de bloc (0 si inconnu, pour tolérer les packs modifiés). */
  id(name: string): number {
    let v = this.cache.get(name);
    if (v === undefined) {
      v = this.content.blocks.tryNum(name);
      if (v === 0) MISSING_BLOCKS.add(name);
      this.cache.set(name, v);
    }
    return v;
  }

  c(name: string, meta = 0): number {
    return makeCell(this.id(name), meta);
  }

  /** Change l'origine (pièces d'une structure composée). */
  at(ox: number, oy: number, oz: number, rot: number): this {
    this.ox = ox;
    this.oy = oy;
    this.oz = oz;
    this.rot = ((rot % 4) + 4) % 4;
    return this;
  }

  wx(x: number, z: number): number {
    switch (this.rot) {
      case 1:
        return this.ox - z;
      case 2:
        return this.ox - x;
      case 3:
        return this.ox + z;
      default:
        return this.ox + x;
    }
  }
  wz(x: number, z: number): number {
    switch (this.rot) {
      case 1:
        return this.oz + x;
      case 2:
        return this.oz - z;
      case 3:
        return this.oz - x;
      default:
        return this.oz + z;
    }
  }

  /** Direction locale → direction monde. */
  dir(d: number): number {
    return (d + this.rot) % 4;
  }

  /** La boîte locale touche-t-elle la colonne en cours ? (optimisation) */
  touches(x0: number, z0: number, x1: number, z1: number, pad = 1): boolean {
    const ax = this.wx(x0, z0),
      az = this.wz(x0, z0),
      bx = this.wx(x1, z1),
      bz = this.wz(x1, z1);
    const minX = Math.min(ax, bx) - pad,
      maxX = Math.max(ax, bx) + pad,
      minZ = Math.min(az, bz) - pad,
      maxZ = Math.max(az, bz) + pad;
    const b = this.buf;
    return maxX >= b.bx && minX < b.bx + CS && maxZ >= b.bz && minZ < b.bz + CS;
  }

  inside(x: number, z: number): boolean {
    return this.buf.inside(this.wx(x, z), this.wz(x, z));
  }

  get(x: number, y: number, z: number): number {
    return this.buf.getW(this.wx(x, z), this.oy + y, this.wz(x, z));
  }

  set(x: number, y: number, z: number, cell: number): void {
    this.buf.setW(this.wx(x, z), this.oy + y, this.wz(x, z), cell);
  }

  /** Écrit seulement sur de l'air, un liquide ou une plante. */
  place(x: number, y: number, z: number, cell: number): void {
    const cur = this.get(x, y, z);
    if (cur < 0) return;
    const id = cur & 0xfff;
    if (id === 0 || this.t.liquid[id] || this.t.shape[id] === Shape.CROSS || this.t.replaceable[id]) this.set(x, y, z, cell);
  }

  /** Écrit seulement dans un bloc solide (structures souterraines). */
  replaceSolid(x: number, y: number, z: number, cell: number): void {
    const cur = this.get(x, y, z);
    if (cur > 0 && this.t.solid[cur & 0xfff]) this.set(x, y, z, cell);
  }

  fill(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, cell: number): void {
    if (!this.touches(x0, z0, x1, z1, 0)) return;
    const ax = Math.min(x0, x1),
      bx = Math.max(x0, x1),
      ay = Math.min(y0, y1),
      by = Math.max(y0, y1),
      az = Math.min(z0, z1),
      bz = Math.max(z0, z1);
    for (let x = ax; x <= bx; x++) for (let z = az; z <= bz; z++) if (this.inside(x, z)) for (let y = ay; y <= by; y++) this.set(x, y, z, cell);
  }

  /** Boîte creuse : murs `wall`, intérieur vidé (air). */
  box(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, wall: number, inner = 0): void {
    if (!this.touches(x0, z0, x1, z1, 0)) return;
    for (let x = x0; x <= x1; x++)
      for (let z = z0; z <= z1; z++) {
        if (!this.inside(x, z)) continue;
        for (let y = y0; y <= y1; y++) {
          const edge = x === x0 || x === x1 || z === z0 || z === z1 || y === y0 || y === y1;
          this.set(x, y, z, edge ? wall : inner);
        }
      }
  }

  /** Remplit sous (x,y,z) jusqu'au sol (fondations, piliers). */
  foundation(x: number, y: number, z: number, cell: number, depth = 24): void {
    if (!this.inside(x, z)) return;
    for (let k = 1; k <= depth; k++) {
      const cur = this.get(x, y - k, z);
      if (cur < 0) return;
      const id = cur & 0xfff;
      if (id !== 0 && this.t.solid[id] && !this.t.liquid[id] && this.t.pass[id] === 0) return;
      this.set(x, y - k, z, cell);
    }
  }

  /** Vide l'espace au-dessus (arbres, plantes, relief). */
  clearAbove(x: number, y: number, z: number, h: number): void {
    if (!this.inside(x, z)) return;
    for (let k = 0; k < h; k++) {
      const cur = this.get(x, y + k, z);
      if (cur > 0 && !this.t.liquid[cur & 0xfff]) this.set(x, y + k, z, 0);
    }
  }

  /** Retire les arbres d'une zone locale (au-dessus de y0, sur h blocs). */
  clearTrees(x0: number, z0: number, x1: number, z1: number, y0 = -2, h = 34): void {
    if (!this.touches(x0, z0, x1, z1, 0)) return;
    for (let x = Math.min(x0, x1); x <= Math.max(x0, x1); x++)
      for (let z = Math.min(z0, z1); z <= Math.max(z0, z1); z++) this.clearTreesWorld(this.wx(x, z), this.wz(x, z), this.oy + y0, h);
  }

  /** Retire les arbres d'une colonne (coordonnées monde). */
  clearTreesWorld(wx: number, wz: number, y0: number, h: number): void {
    if (!this.buf.inside(wx, wz)) return;
    const m = treeMask(this.content);
    for (let y = y0; y < y0 + h; y++) {
      const v = this.buf.getW(wx, y, wz);
      if (v > 0 && m[v & 0xfff]) this.buf.setW(wx, y, wz, 0);
    }
  }

  /** Tirage déterministe par bloc (usure des ruines…). */
  keep(x: number, y: number, z: number, p: number): boolean {
    return hashFloat(hash3(this.seed, this.wx(x, z), this.oy + y, this.wz(x, z))) < p;
  }

  rnd(x: number, y: number, z: number, salt = 0): number {
    return hashFloat(hash3(this.seed ^ salt, this.wx(x, z), this.oy + y, this.wz(x, z)));
  }

  /** Escalier : `back` = direction locale de la partie haute. */
  stairs(x: number, y: number, z: number, name: string, back: number, top = false): void {
    this.set(x, y, z, this.c(name, this.dir(back) | (top ? 4 : 0)));
  }

  /** Porte (deux moitiés) ; `side` = face locale où se trouve le battant. */
  door(x: number, y: number, z: number, name: string, side: number): void {
    const f = (this.dir(side) + 2) % 4;
    this.set(x, y, z, this.c(name, f));
    this.set(x, y + 1, z, this.c(name, f | 8));
  }

  /** Torche : `wall` = direction locale du mur porteur, −1 = posée au sol. */
  torch(x: number, y: number, z: number, wall = -1, name = 'torche'): void {
    const meta = wall < 0 ? 0 : [3, 2, 4, 1][this.dir(wall)];
    this.set(x, y, z, this.c(name, meta));
  }

  ladder(x: number, y: number, z: number, wall: number): void {
    this.set(x, y, z, this.c('echelle', [2, 1, 3, 0][this.dir(wall)]));
  }

  /** Bloc orienté (coffre, fourneau…) dont la face avant regarde `face`. */
  oriented(x: number, y: number, z: number, name: string, face: number): void {
    this.set(x, y, z, this.c(name, this.dir(face)));
  }

  chest(x: number, y: number, z: number, face: number, loot: string): void {
    this.oriented(x, y, z, 'coffre', face);
    const wx = this.wx(x, z),
      wz = this.wz(x, z),
      wy = this.oy + y;
    if (!this.buf.inside(wx, wz)) return;
    this.buf.addBlockEntity(wx, wy, wz, { type: 'chest', slots: new Array(27).fill(null), loot, lootSeed: hash3(this.seed, wx, wy, wz) });
  }

  spawner(x: number, y: number, z: number, creature: string): void {
    this.set(x, y, z, this.c('foyer_maudit'));
    const wx = this.wx(x, z),
      wz = this.wz(x, z);
    if (this.buf.inside(wx, wz)) this.buf.addBlockEntity(wx, this.oy + y, wz, { type: 'spawner', creature, delay: 4 });
  }

  /** Créature placée par la génération (persistante). */
  entity(type: string, x: number, y: number, z: number, data?: Record<string, unknown>): void {
    const wx = this.wx(x, z),
      wz = this.wz(x, z);
    if (!this.buf.inside(Math.floor(wx), Math.floor(wz))) return;
    this.buf.entities.push({ type, x: wx + 0.5, y: this.oy + y, z: wz + 0.5, data });
  }
}
