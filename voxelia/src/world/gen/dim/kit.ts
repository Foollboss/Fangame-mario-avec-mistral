/**
 * Boîte à outils des structures de dimension (forteresse des braises, temple céleste, ruines…).
 *
 * Une structure est décrite par un plan mis en cache par région ; chaque pièce du plan est un
 * « programme de colonne » qui n'écrit et ne lit que la colonne (x, z) demandée. Une colonne
 * n'appartenant qu'à un seul tronçon, la structure est reconstruite à l'identique de part et
 * d'autre des frontières de tronçons et chaque marqueur (coffre, boss…) n'est émis qu'une fois.
 */
import { B, BLOCKS, BLOCK_ID_COUNT, SOLID } from '../../blocks';
import { HORIZONTAL_DIRS } from '../../constants';
import { hash3 } from '../../../util/random';
import type { ChunkWriter, GenMarker } from '../writer';

const k = (key: string): number => B[key];

/** Identifiants des blocs utilisés (résolus une seule fois). */
export const I = {
  air: 0,
  obsidian: k('obsidian'),
  bricks: k('obsidian_bricks'),
  emberStone: k('ember_stone'),
  basalt: k('basalt'),
  magma: k('magma'),
  ash: k('ash'),
  lava: k('lava'),
  fire: k('fire'),
  glowstone: k('glowstone'),
  lantern: k('lantern'),
  ironBars: k('iron_bars'),
  chest: k('chest'),
  spawner: k('spawner'),
  gold: k('gold_block'),
  brickStairs: k('brick_stairs'),
  crystal: k('crystal_block'),
  crystalCluster: k('crystal_cluster'),
  cloud: k('cloud'),
  skyStone: k('sky_stone'),
  skyGrass: k('sky_grass'),
  skyDirt: k('sky_dirt'),
  goldenLog: k('golden_log'),
  goldenLeaves: k('golden_leaves'),
  quartz: k('quartz_block'),
  calcite: k('calcite'),
  slab: k('stone_slab'),
  glassPane: k('glass_pane'),
  dandelion: k('dandelion'),
  cornflower: k('cornflower'),
  shortGrass: k('short_grass'),
  deadBush: k('dead_bush'),
};

/** Colonnes « ouvertes » des Terres de braise : air, lave, feu, plantes (traversées par les piliers). */
export const EMBER_OPEN = new Uint8Array(BLOCK_ID_COUNT);
/** Colonnes « ouvertes » du Royaume céleste : idem + nuages, feuillages et plantes. */
export const SKY_OPEN = new Uint8Array(BLOCK_ID_COUNT);
for (const b of BLOCKS) {
  if (!b) continue;
  const open = !SOLID[b.id];
  EMBER_OPEN[b.id] = open ? 1 : 0;
  SKY_OPEN[b.id] = open || b.key === 'cloud' || b.key.endsWith('_leaves') ? 1 : 0;
}
EMBER_OPEN[0] = 1;
SKY_OPEN[0] = 1;

/** Troncs et feuillages (élagués autour des structures pour éviter les morceaux d'arbres flottants). */
export const TREE_PARTS = new Uint8Array(BLOCK_ID_COUNT);
for (const b of BLOCKS) if (b && (b.key.endsWith('_log') || b.key.endsWith('_leaves'))) TREE_PARTS[b.id] = 1;

// ------------------------------------------------------------------ plans

/** Rectangle horizontal inclusif (coordonnées monde). */
export interface Box {
  x0: number;
  z0: number;
  x1: number;
  z1: number;
}

/** Pièce de structure : programme de colonne, ou bloc exécuté une fois par tronçon touché. */
export interface Piece extends Box {
  col?: (w: ChunkWriter, x: number, z: number) => void;
  once?: (w: ChunkWriter) => void;
  /** 0 = remodelage du terrain (posé avant toutes les constructions), 1 = construction. */
  phase: number;
}

export interface DimPlan {
  kind: string;
  /** Centre (référence pour la localisation). */
  x: number;
  y: number;
  z: number;
  box: Box;
  pieces: Piece[];
}

export function newPlan(kind: string, x: number, y: number, z: number): DimPlan {
  return { kind, x, y, z, box: { x0: x, z0: z, x1: x, z1: z }, pieces: [] };
}

export function addPiece(plan: DimPlan, b: Box, col: (w: ChunkWriter, x: number, z: number) => void, phase = 1): void {
  plan.pieces.push({ x0: b.x0, z0: b.z0, x1: b.x1, z1: b.z1, col, phase });
  grow(plan, b);
}

export function addOnce(plan: DimPlan, b: Box, once: (w: ChunkWriter) => void): void {
  plan.pieces.push({ x0: b.x0, z0: b.z0, x1: b.x1, z1: b.z1, once, phase: 1 });
  grow(plan, b);
}

function grow(plan: DimPlan, b: Box): void {
  const p = plan.box;
  p.x0 = Math.min(p.x0, b.x0);
  p.z0 = Math.min(p.z0, b.z0);
  p.x1 = Math.max(p.x1, b.x1);
  p.z1 = Math.max(p.z1, b.z1);
}

export function squareBox(cx: number, cz: number, r: number): Box {
  return { x0: cx - r, z0: cz - r, x1: cx + r, z1: cz + r };
}

/** Vrai si une pièce du plan chevauche la boîte (agrandie de `margin`). */
export function planOverlaps(plan: DimPlan, b: Box, margin: number): boolean {
  const p = plan.box;
  if (b.x1 < p.x0 - margin || b.x0 > p.x1 + margin || b.z1 < p.z0 - margin || b.z0 > p.z1 + margin) return false;
  for (const q of plan.pieces)
    if (b.x1 >= q.x0 - margin && b.x0 <= q.x1 + margin && b.z1 >= q.z0 - margin && b.z0 <= q.z1 + margin) return true;
  return false;
}

/**
 * Construit la partie du plan qui tombe dans le tronçon du writer.
 * `phase` restreint aux pièces d'une phase (toutes si omis) : le terrain de toutes les grandes
 * structures voisines est remodelé avant qu'aucune ne soit bâtie, quel que soit l'ordre des régions.
 */
export function buildPlan(w: ChunkWriter, plan: DimPlan, phase = -1): void {
  const b = plan.box;
  if (!w.touches(b.x0, b.z0, b.x1, b.z1)) return;
  const cx1 = w.x0 + 15;
  const cz1 = w.z0 + 15;
  for (const p of plan.pieces) {
    if (phase >= 0 && p.phase !== phase) continue;
    if (!w.touches(p.x0, p.z0, p.x1, p.z1)) continue;
    if (p.once) {
      p.once(w);
      continue;
    }
    const col = p.col;
    if (!col) continue;
    const x0 = Math.max(p.x0, w.x0);
    const x1 = Math.min(p.x1, cx1);
    const z0 = Math.max(p.z0, w.z0);
    const z1 = Math.min(p.z1, cz1);
    for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) col(w, x, z);
  }
}

// ------------------------------------------------------------------ cache

/** Petit cache LRU (plans et sites par région). */
export class Lru<T> {
  private map = new Map<string, T>();
  constructor(private readonly max: number) {}

  get(key: string, make: () => T): T {
    const m = this.map;
    const v = m.get(key);
    if (v !== undefined || m.has(key)) {
      m.delete(key);
      m.set(key, v as T);
      return v as T;
    }
    const n = make();
    m.set(key, n);
    if (m.size > this.max) {
      const first = m.keys().next();
      if (!first.done) m.delete(first.value);
    }
    return n;
  }
}

// ------------------------------------------------------------------ repère d'un axe

/** Direction (0 sud, 1 ouest, 2 nord, 3 est) d'un vecteur horizontal. */
export function dirOf(dx: number, dz: number): number {
  if (dz > 0) return 0;
  if (dx < 0) return 1;
  if (dz < 0) return 2;
  return 3;
}

/**
 * Repère attaché à un axe partant d'un centre : t = distance le long de la direction `d`,
 * s = décalage latéral. Sert aux ponts, escaliers et portiques.
 */
export class AxisFrame {
  readonly dx: number;
  readonly dz: number;
  readonly lx: number;
  readonly lz: number;
  constructor(
    readonly cx: number,
    readonly cz: number,
    readonly d: number,
  ) {
    const [dx, dz] = HORIZONTAL_DIRS[d & 3];
    this.dx = dx;
    this.dz = dz;
    this.lx = -dz;
    this.lz = dx;
  }

  t(x: number, z: number): number {
    return (x - this.cx) * this.dx + (z - this.cz) * this.dz;
  }

  s(x: number, z: number): number {
    return (x - this.cx) * this.lx + (z - this.cz) * this.lz;
  }

  x(t: number, s: number): number {
    return this.cx + this.dx * t + this.lx * s;
  }

  z(t: number, s: number): number {
    return this.cz + this.dz * t + this.lz * s;
  }

  box(t0: number, t1: number, s0: number, s1: number): Box {
    const xa = this.x(t0, s0);
    const xb = this.x(t1, s1);
    const za = this.z(t0, s0);
    const zb = this.z(t1, s1);
    return { x0: Math.min(xa, xb), z0: Math.min(za, zb), x1: Math.max(xa, xb), z1: Math.max(za, zb) };
  }

  /** Direction monde qui revient vers le centre. */
  get back(): number {
    return (this.d + 2) & 3;
  }

  /** Direction monde du côté s > 0. */
  get side(): number {
    return dirOf(this.lx, this.lz);
  }
}

// ------------------------------------------------------------------ écritures de colonne

/** Aléa stable [0,1) pour un bloc. */
export function rnd(seed: number, x: number, y: number, z: number): number {
  return hash3(seed, x, y, z) / 4294967296;
}

/** Vide la colonne entre y0 et y1 inclus. */
export function clear(w: ChunkWriter, x: number, z: number, y0: number, y1: number): void {
  w.fill(x, y0, z, x, y1, z, 0);
}

/** Remplit la colonne entre y0 et y1 inclus. */
export function column(w: ChunkWriter, x: number, z: number, y0: number, y1: number, id: number, meta = 0): void {
  w.fill(x, y0, z, x, y1, z, id, meta);
}

/** Retire troncs et feuillages d'une colonne entre y0 et y1 (lecture locale à la colonne). */
export function pruneTrees(w: ChunkWriter, x: number, z: number, y0: number, y1: number): void {
  if (!w.inside(x, y0, z)) return;
  for (let y = y0; y <= y1; y++) {
    const cur = w.get(x, y, z);
    if (cur > 0 && TREE_PARTS[cur]) w.set(x, y, z, 0);
  }
}

/** Pose seulement si l'emplacement est « ouvert » (air, lave, nuage… selon la table). */
export function setIfOpen(w: ChunkWriter, x: number, y: number, z: number, id: number, open: Uint8Array, meta = 0): void {
  const cur = w.get(x, y, z);
  if (cur >= 0 && open[cur]) w.set(x, y, z, id, meta);
}

/** Pilier qui descend depuis y tant que la colonne est ouverte (lecture locale à la colonne). */
export function fillDown(w: ChunkWriter, x: number, y: number, z: number, id: number, open: Uint8Array, maxDepth: number, meta = 0): void {
  if (!w.inside(x, y, z)) return;
  for (let n = 0; n < maxDepth && y > 0; n++, y--) {
    const cur = w.get(x, y, z);
    if (cur < 0 || !open[cur]) break;
    w.set(x, y, z, id, meta);
  }
}

export function chestAt(w: ChunkWriter, x: number, y: number, z: number, facing: number, loot: string): void {
  if (!w.inside(x, y, z)) return;
  w.set(x, y, z, I.chest, facing & 3);
  w.mark({ kind: 'chest', x, y, z, id: loot });
}

export function spawnerAt(w: ChunkWriter, x: number, y: number, z: number, mob: string): void {
  if (!w.inside(x, y, z)) return;
  w.set(x, y, z, I.spawner);
  w.mark({ kind: 'spawner', x, y, z, id: mob });
}

/** Créature persistante gardienne d'une structure. */
export function guardAt(w: ChunkWriter, x: number, y: number, z: number, mob: string): void {
  const m: GenMarker = { kind: 'mob', id: mob, x: x + 0.5, y, z: z + 0.5, data: { persistent: true } };
  w.mark(m);
}

/** Boss endormi au centre de son arène. */
export function bossAt(w: ChunkWriter, x: number, y: number, z: number, boss: string, arena: [number, number, number]): void {
  w.mark({ kind: 'boss', id: boss, x: x + 0.5, y, z: z + 0.5, data: { dormant: true, arena } });
}

export function clamp(v: number, a: number, b: number): number {
  return v < a ? a : v > b ? b : v;
}
