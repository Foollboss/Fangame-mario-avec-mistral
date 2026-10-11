import { CHUNK_SIZE, WORLD_HEIGHT, colIndex, packBlock, blockId } from '../constants';
import { OPAQUE, REPLACEABLE, AIR } from '../blocks';

/** Marqueur d'entité ou d'objet à créer lors de la première génération d'un tronçon. */
export interface GenMarker {
  kind: 'mob' | 'chest' | 'spawner' | 'boss' | 'villager' | 'portal_hint' | 'trader';
  x: number;
  y: number;
  z: number;
  id: string;
  data?: Record<string, unknown>;
}

/**
 * Écrit des blocs dans une colonne (tronçon) en coordonnées monde,
 * en ignorant silencieusement ce qui dépasse du tronçon.
 * Permet aux arbres et structures qui chevauchent plusieurs tronçons de
 * se générer de façon identique de part et d'autre.
 */
export class ChunkWriter {
  readonly x0: number;
  readonly z0: number;
  markers: GenMarker[] = [];

  constructor(
    readonly blocks: Uint16Array,
    readonly cx: number,
    readonly cz: number,
  ) {
    this.x0 = cx * CHUNK_SIZE;
    this.z0 = cz * CHUNK_SIZE;
  }

  inside(x: number, y: number, z: number): boolean {
    const lx = x - this.x0;
    const lz = z - this.z0;
    return lx >= 0 && lx < CHUNK_SIZE && lz >= 0 && lz < CHUNK_SIZE && y >= 0 && y < WORLD_HEIGHT;
  }

  get(x: number, y: number, z: number): number {
    if (!this.inside(x, y, z)) return -1;
    return blockId(this.blocks[colIndex(x - this.x0, y, z - this.z0)]);
  }

  set(x: number, y: number, z: number, id: number, meta = 0): void {
    if (!this.inside(x, y, z)) return;
    this.blocks[colIndex(x - this.x0, y, z - this.z0)] = packBlock(id, meta);
  }

  /** Pose seulement si l'emplacement est vide ou remplaçable (herbes, air…). */
  setSoft(x: number, y: number, z: number, id: number, meta = 0): void {
    if (!this.inside(x, y, z)) return;
    const i = colIndex(x - this.x0, y, z - this.z0);
    const cur = blockId(this.blocks[i]);
    if (cur === AIR || REPLACEABLE[cur] || !OPAQUE[cur]) this.blocks[i] = packBlock(id, meta);
  }

  /** Pose seulement si le bloc actuel appartient à l'ensemble donné. */
  replace(x: number, y: number, z: number, id: number, allowed: Uint8Array): void {
    if (!this.inside(x, y, z)) return;
    const i = colIndex(x - this.x0, y, z - this.z0);
    if (allowed[blockId(this.blocks[i])]) this.blocks[i] = id;
  }

  fill(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, id: number, meta = 0): void {
    const ax = Math.max(Math.min(x0, x1), this.x0);
    const bx = Math.min(Math.max(x0, x1), this.x0 + CHUNK_SIZE - 1);
    const az = Math.max(Math.min(z0, z1), this.z0);
    const bz = Math.min(Math.max(z0, z1), this.z0 + CHUNK_SIZE - 1);
    const ay = Math.max(Math.min(y0, y1), 0);
    const by = Math.min(Math.max(y0, y1), WORLD_HEIGHT - 1);
    const v = packBlock(id, meta);
    for (let y = ay; y <= by; y++)
      for (let z = az; z <= bz; z++)
        for (let x = ax; x <= bx; x++) this.blocks[colIndex(x - this.x0, y, z - this.z0)] = v;
  }

  /** Vrai si la zone (x0..x1, z0..z1) touche ce tronçon. */
  touches(x0: number, z0: number, x1: number, z1: number): boolean {
    return x1 >= this.x0 && x0 < this.x0 + CHUNK_SIZE && z1 >= this.z0 && z0 < this.z0 + CHUNK_SIZE;
  }

  mark(m: GenMarker): void {
    if (this.inside(Math.floor(m.x), Math.floor(m.y), Math.floor(m.z))) this.markers.push(m);
  }
}

/** Crée un ensemble d'identifiants rapide à tester. */
export function idSet(ids: number[]): Uint8Array {
  const s = new Uint8Array(1024);
  for (const i of ids) s[i] = 1;
  return s;
}
