/**
 * Outils communs aux structures de la Surface : identifiants de blocs, boîtes englobantes,
 * repère local tourné (bâtiments orientables), fondations, coffres et marqueurs.
 *
 * Règle d'or : une pièce de structure est reconstruite à l'identique pour chaque tronçon
 * qu'elle touche. Elle ne doit donc lire le monde (w.get) que dans la colonne qu'elle écrit,
 * et ne jamais consommer d'aléa en fonction de ce qu'elle lit.
 */
import { B, BLOCKS, BLOCK_ID_COUNT } from '../../blocks';
import { HORIZONTAL_DIRS } from '../../constants';
import { hash3 } from '../../../util/random';
import type { ChunkWriter, GenMarker } from '../writer';

const k = (key: string): number => B[key];

/** Identifiants des blocs utilisés par les structures (résolus une seule fois). */
export const K = {
  air: 0,
  stone: k('stone'),
  dirt: k('dirt'),
  grass: k('grass_block'),
  coarse_dirt: k('coarse_dirt'),
  podzol: k('podzol'),
  sand: k('sand'),
  gravel: k('gravel'),
  water: k('water'),
  cobblestone: k('cobblestone'),
  mossy_cobblestone: k('mossy_cobblestone'),
  stone_bricks: k('stone_bricks'),
  mossy_stone_bricks: k('mossy_stone_bricks'),
  cracked_stone_bricks: k('cracked_stone_bricks'),
  chiseled_stone_bricks: k('chiseled_stone_bricks'),
  smooth_stone: k('smooth_stone'),
  ancient_bricks: k('ancient_bricks'),
  ancient_core: k('ancient_core'),
  deepslate: k('deepslate'),
  cobbled_deepslate: k('cobbled_deepslate'),
  bricks: k('bricks'),
  sandstone: k('sandstone'),
  smooth_sandstone: k('smooth_sandstone'),
  terracotta: k('terracotta'),
  orange_terracotta: k('orange_terracotta'),
  red_terracotta: k('red_terracotta'),
  white_terracotta: k('white_terracotta'),
  yellow_terracotta: k('yellow_terracotta'),
  quartz_block: k('quartz_block'),
  abyss_stone: k('abyss_stone'),
  sea_lantern: k('sea_lantern'),
  glass: k('glass'),
  glass_pane: k('glass_pane'),
  blue_stained_glass: k('blue_stained_glass'),
  tube_coral_block: k('tube_coral_block'),
  brain_coral_block: k('brain_coral_block'),
  oak_planks: k('oak_planks'),
  oak_log: k('oak_log'),
  spruce_planks: k('spruce_planks'),
  spruce_log: k('spruce_log'),
  acacia_planks: k('acacia_planks'),
  acacia_log: k('acacia_log'),
  dark_oak_planks: k('dark_oak_planks'),
  stripped_oak_log: k('stripped_oak_log'),
  oak_stairs: k('oak_stairs'),
  cobblestone_stairs: k('cobblestone_stairs'),
  stone_brick_stairs: k('stone_brick_stairs'),
  brick_stairs: k('brick_stairs'),
  oak_slab: k('oak_slab'),
  stone_slab: k('stone_slab'),
  cobblestone_slab: k('cobblestone_slab'),
  oak_fence: k('oak_fence'),
  oak_door: k('oak_door'),
  oak_trapdoor: k('oak_trapdoor'),
  ladder: k('ladder'),
  torch: k('torch'),
  lantern: k('lantern'),
  glowstone: k('glowstone'),
  chest: k('chest'),
  barrel: k('barrel'),
  bookshelf: k('bookshelf'),
  crafting_table: k('crafting_table'),
  furnace: k('furnace'),
  red_bed: k('red_bed'),
  iron_block: k('iron_block'),
  iron_bars: k('iron_bars'),
  coal_block: k('coal_block'),
  gold_block: k('gold_block'),
  hay_block: k('hay_block'),
  farmland: k('farmland'),
  wheat: k('wheat'),
  carrots: k('carrots'),
  potatoes: k('potatoes'),
  beetroots: k('beetroots'),
  pumpkin: k('pumpkin'),
  melon: k('melon'),
  dirt_path: k('dirt_path'),
  campfire: k('campfire'),
  tnt: k('tnt'),
  stone_pressure_plate: k('stone_pressure_plate'),
  cobweb: k('cobweb'),
  bone_block: k('bone_block'),
  vine: k('vine'),
  moss_block: k('moss_block'),
  glow_lichen: k('glow_lichen'),
  glow_mushroom: k('glow_mushroom'),
  brown_mushroom: k('brown_mushroom'),
  red_mushroom: k('red_mushroom'),
  spawner: k('spawner'),
  white_carpet: k('white_carpet'),
  red_carpet: k('red_carpet'),
  blue_carpet: k('blue_carpet'),
  white_wool: k('white_wool'),
  orange_wool: k('orange_wool'),
  light_gray_wool: k('light_gray_wool'),
  green_wool: k('green_wool'),
  brown_wool: k('brown_wool'),
  red_wool: k('red_wool'),
  blue_wool: k('blue_wool'),
  yellow_wool: k('yellow_wool'),
  snow_block: k('snow_block'),
  packed_ice: k('packed_ice'),
  lily_pad: k('lily_pad'),
  sugar_cane: k('sugar_cane'),
  dead_bush: k('dead_bush'),
  cactus: k('cactus'),
  kelp: k('kelp'),
  seagrass: k('seagrass'),
};

/** Directions horizontales : 0 sud (+Z), 1 ouest (-X), 2 nord (-Z), 3 est (+X). */
export const SOUTH = 0;
export const WEST = 1;
export const NORTH = 2;
export const EAST = 3;
export const DIRS = HORIZONTAL_DIRS;

/** Colonne « non sol » : air, liquides, plantes, troncs et feuillages (remplacés par les fondations). */
export const NOT_GROUND = new Uint8Array(BLOCK_ID_COUNT);
/** Végétation à dégager autour des bâtiments (arbres, plantes, neige). */
export const VEGETATION = new Uint8Array(BLOCK_ID_COUNT);
for (const b of BLOCKS) {
  if (!b) continue;
  const tree = b.key.endsWith('_log') || b.key.endsWith('_leaves') || b.key === 'mushroom_stem' || b.key === 'red_mushroom_block' || b.key === 'cactus';
  const plant = b.shape === 'cross' || b.shape === 'vine' || b.shape === 'lily' || b.key === 'snow_layer' || b.key === 'pumpkin' || b.key === 'melon' || b.key === 'sugar_cane';
  if (!b.solid || tree || plant) NOT_GROUND[b.id] = 1;
  if ((tree || plant) && b.key !== 'stripped_oak_log') VEGETATION[b.id] = 1;
}
NOT_GROUND[k('stripped_oak_log')] = 0;

// ------------------------------------------------------------------ boîtes

/** Rectangle horizontal inclusif (coordonnées monde). */
export interface Box {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

export function box(x0: number, z0: number, x1: number, z1: number): Box {
  return { x0: Math.min(x0, x1), z0: Math.min(z0, z1), x1: Math.max(x0, x1), z1: Math.max(z0, z1) };
}

export function expand(b: Box, m: number): Box {
  return { x0: b.x0 - m, z0: b.z0 - m, x1: b.x1 + m, z1: b.z1 + m };
}

export function overlaps(a: Box, b: Box): boolean {
  return a.x0 <= b.x1 && a.x1 >= b.x0 && a.z0 <= b.z1 && a.z1 >= b.z0;
}

export function union(a: Box, b: Box): Box {
  return { x0: Math.min(a.x0, b.x0), z0: Math.min(a.z0, b.z0), x1: Math.max(a.x1, b.x1), z1: Math.max(a.z1, b.z1) };
}

export function touches(w: ChunkWriter, b: Box): boolean {
  return w.touches(b.x0, b.z0, b.x1, b.z1);
}

// ------------------------------------------------------------------ plans

/** Morceau de structure : reconstruit pour chaque tronçon touché par sa boîte. */
export interface Piece {
  box: Box;
  build(w: ChunkWriter): void;
}

/** Plan complet d'une structure (calculé une fois par région, puis mis en cache). */
export interface StructurePlan {
  kind: string;
  /** Point de référence (centre) utilisé par /locate. */
  x: number;
  y: number;
  z: number;
  box: Box;
  pieces: Piece[];
  /** Marqueurs d'entités (villageois, gardes, boss) — filtrés par tronçon à l'écriture. */
  markers: GenMarker[];
}

export function newPlan(kind: string, x: number, y: number, z: number): StructurePlan {
  return { kind, x, y, z, box: { x0: x, z0: z, x1: x, z1: z }, pieces: [], markers: [] };
}

export function addPiece(plan: StructurePlan, b: Box, build: (w: ChunkWriter) => void): void {
  plan.pieces.push({ box: b, build });
  plan.box = union(plan.box, b);
}

// ------------------------------------------------------------------ aléa positionnel

/** Valeur [0,1) stable pour un bloc donné (indépendante de l'ordre d'écriture). */
export function rnd3(seed: number, x: number, y: number, z: number): number {
  return hash3(seed, x, y, z) / 4294967296;
}

// ------------------------------------------------------------------ écritures « colonne »

/** Remplit vers le bas depuis y tant que la colonne n'est pas du sol (lecture locale à la colonne). */
export function foundation(w: ChunkWriter, x: number, y: number, z: number, id: number, depth = 12): void {
  if (!w.inside(x, y, z)) return;
  for (let yy = y; yy > y - depth && yy > 0; yy--) {
    const cur = w.get(x, yy, z);
    if (!NOT_GROUND[cur]) break;
    w.set(x, yy, z, id);
  }
}

/** Retire la végétation (arbres, plantes) d'une colonne entre y0 et y1. */
export function clearVegetation(w: ChunkWriter, x: number, z: number, y0: number, y1: number): void {
  if (!w.inside(x, y0, z)) return;
  for (let y = y0; y <= y1; y++) {
    const cur = w.get(x, y, z);
    if (cur > 0 && VEGETATION[cur]) w.set(x, y, z, 0);
  }
}

/** Pose un bloc seulement si l'emplacement est actuellement solide (murs qui épousent les grottes). */
export function setIfSolid(w: ChunkWriter, x: number, y: number, z: number, id: number, meta = 0): void {
  const cur = w.get(x, y, z);
  if (cur > 0 && !NOT_GROUND[cur]) w.set(x, y, z, id, meta);
}

export function chestAt(w: ChunkWriter, x: number, y: number, z: number, facing: number, loot: string): void {
  w.set(x, y, z, K.chest, facing & 3);
  w.mark({ kind: 'chest', x, y, z, id: loot });
}

export function spawnerAt(w: ChunkWriter, x: number, y: number, z: number, mob: string): void {
  w.set(x, y, z, K.spawner);
  w.mark({ kind: 'spawner', x, y, z, id: mob });
}

// ------------------------------------------------------------------ repère local tourné

/**
 * Repère local d'un bâtiment de W×D colonnes : lx ∈ [0,W), lz ∈ [0,D), façade en lz = 0.
 * rot = nombre de quarts de tour (même convention que les modèles : sud → ouest → nord → est).
 */
export class Frame {
  readonly W: number;
  readonly D: number;
  constructor(
    public w: ChunkWriter,
    readonly ox: number,
    readonly oy: number,
    readonly oz: number,
    W: number,
    D: number,
    readonly rot: number,
  ) {
    this.W = W;
    this.D = D;
  }

  /** Repère tel que la façade (lz = 0) regarde dans la direction `front` (vers la rue). */
  static facing(w: ChunkWriter | null, b: Box, y: number, W: number, D: number, front: number): Frame {
    // façade locale = nord (2) ; rot tel que (2 + rot) % 4 = front
    const rot = (front + 2) & 3;
    return new Frame(w as ChunkWriter, b.x0, y, b.z0, W, D, rot);
  }

  /** Taille monde (x, z) d'un bâtiment W×D tourné. */
  static size(W: number, D: number, rot: number): [number, number] {
    return rot & 1 ? [D, W] : [W, D];
  }

  wx(lx: number, lz: number): number {
    switch (this.rot) {
      case 1:
        return this.ox + this.D - 1 - lz;
      case 2:
        return this.ox + this.W - 1 - lx;
      case 3:
        return this.ox + lz;
      default:
        return this.ox + lx;
    }
  }

  wz(lx: number, lz: number): number {
    switch (this.rot) {
      case 1:
        return this.oz + lx;
      case 2:
        return this.oz + this.D - 1 - lz;
      case 3:
        return this.oz + this.W - 1 - lx;
      default:
        return this.oz + lz;
    }
  }

  /** Direction locale → direction monde. */
  dir(d: number): number {
    return (d + this.rot) & 3;
  }

  /** Axe d'une bûche : 0 vertical, 1 selon X local, 2 selon Z local. */
  axis(a: number): number {
    if (a === 0 || !(this.rot & 1)) return a;
    return a === 1 ? 2 : 1;
  }

  box(): Box {
    return box(this.wx(0, 0), this.wz(0, 0), this.wx(this.W - 1, this.D - 1), this.wz(this.W - 1, this.D - 1));
  }

  get(lx: number, ly: number, lz: number): number {
    return this.w.get(this.wx(lx, lz), this.oy + ly, this.wz(lx, lz));
  }

  set(lx: number, ly: number, lz: number, id: number, meta = 0): void {
    this.w.set(this.wx(lx, lz), this.oy + ly, this.wz(lx, lz), id, meta);
  }

  fill(lx0: number, ly0: number, lz0: number, lx1: number, ly1: number, lz1: number, id: number, meta = 0): void {
    this.w.fill(this.wx(lx0, lz0), this.oy + ly0, this.wz(lx0, lz0), this.wx(lx1, lz1), this.oy + ly1, this.wz(lx1, lz1), id, meta);
  }

  stairs(lx: number, ly: number, lz: number, id: number, d: number, upside = false): void {
    this.set(lx, ly, lz, id, this.dir(d) | (upside ? 4 : 0));
  }

  log(lx: number, ly: number, lz: number, id: number, a: number): void {
    this.set(lx, ly, lz, id, this.axis(a));
  }

  /** Porte de deux blocs ; `d` = direction vers laquelle on la franchit en entrant. */
  door(lx: number, ly: number, lz: number, d: number, id = K.oak_door): void {
    const m = this.dir(d);
    this.set(lx, ly, lz, id, m);
    this.set(lx, ly + 1, lz, id, m | 8);
  }

  /** Lit : pied en (lx,lz), tête dans la direction `d`. */
  bed(lx: number, ly: number, lz: number, d: number): void {
    const m = this.dir(d);
    const [dx, dz] = DIRS[d];
    this.set(lx, ly, lz, K.red_bed, m);
    this.set(lx + dx, ly, lz + dz, K.red_bed, m | 8);
  }

  /** Torche : posée au sol (wall < 0) ou fixée au mur situé dans la direction `wall`. */
  torch(lx: number, ly: number, lz: number, wall = -1): void {
    this.set(lx, ly, lz, K.torch, wall < 0 ? 0 : 1 + this.dir(wall));
  }

  ladder(lx: number, ly: number, lz: number, wall: number): void {
    this.set(lx, ly, lz, K.ladder, this.dir(wall));
  }

  vine(lx: number, ly: number, lz: number, wall: number): void {
    this.set(lx, ly, lz, K.vine, this.dir(wall));
  }

  /** Bloc orienté (four, coffre) dont la face avant regarde `d`. */
  facingBlock(lx: number, ly: number, lz: number, id: number, d: number): void {
    this.set(lx, ly, lz, id, this.dir(d));
  }

  chest(lx: number, ly: number, lz: number, d: number, loot: string): void {
    chestAt(this.w, this.wx(lx, lz), this.oy + ly, this.wz(lx, lz), this.dir(d), loot);
  }

  barrel(lx: number, ly: number, lz: number, loot?: string): void {
    const x = this.wx(lx, lz);
    const z = this.wz(lx, lz);
    this.w.set(x, this.oy + ly, z, K.barrel, 0);
    if (loot) this.w.mark({ kind: 'chest', x, y: this.oy + ly, z, id: loot });
  }

  foundation(lx: number, ly: number, lz: number, id: number, depth = 12): void {
    foundation(this.w, this.wx(lx, lz), this.oy + ly, this.wz(lx, lz), id, depth);
  }

  clearVegetation(lx: number, lz: number, ly0: number, ly1: number): void {
    clearVegetation(this.w, this.wx(lx, lz), this.wz(lx, lz), this.oy + ly0, this.oy + ly1);
  }

  /** Position monde (centre du bloc) d'un point local, pour les marqueurs. */
  pos(lx: number, ly: number, lz: number): [number, number, number] {
    return [this.wx(lx, lz) + 0.5, this.oy + ly, this.wz(lx, lz) + 0.5];
  }
}
