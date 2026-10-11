/**
 * World — accès aux blocs en coordonnées monde, modifications (avec remaillage ciblé),
 * notifications pour la sauvegarde et le multijoueur.
 */
import { WORLD_HEIGHT, blockId, blockMeta, packBlock, ID_MASK } from './constants';
import { BLOCKS, LIGHT_EMIT, LIGHT_FILTER, OPAQUE, getBlock, type BlockDef } from './blocks';
import type { ChunkManager } from './ChunkManager';
import type { BlockEntity, Chunk } from './Chunk';
import { biomeById, type BiomeDef } from './biomes';

export interface BlockChange {
  x: number;
  y: number;
  z: number;
  prev: number;
  next: number;
  /** Origine : 'player' (action locale), 'remote' (serveur), 'tick' (simulation). */
  cause: 'player' | 'remote' | 'tick' | 'gen';
}

export class World {
  private listeners: Array<(c: BlockChange) => void> = [];

  constructor(public chunks: ChunkManager) {}

  get dim(): number {
    return this.chunks.dim;
  }

  chunkAt(x: number, z: number): Chunk | undefined {
    return this.chunks.get(Math.floor(x / 16), Math.floor(z / 16));
  }

  isLoaded(x: number, z: number): boolean {
    const c = this.chunkAt(x, z);
    return !!c && c.ready;
  }

  /** Valeur brute (identifiant + état), 0 si non chargé. */
  raw(x: number, y: number, z: number): number {
    if (y < 0 || y >= WORLD_HEIGHT) return 0;
    const c = this.chunkAt(x, z);
    if (!c || !c.ready) return 0;
    return c.get(x & 15, y, z & 15);
  }

  id(x: number, y: number, z: number): number {
    return this.raw(x, y, z) & ID_MASK;
  }

  meta(x: number, y: number, z: number): number {
    return blockMeta(this.raw(x, y, z));
  }

  def(x: number, y: number, z: number): BlockDef {
    return getBlock(this.id(x, y, z));
  }

  /** Les zones non chargées sont traitées comme solides (le joueur ne tombe pas dans le vide). */
  isSolidForPhysics(x: number, y: number, z: number): boolean {
    if (y < 0) return true;
    if (y >= WORLD_HEIGHT) return false;
    const c = this.chunkAt(x, z);
    if (!c || !c.ready) return true;
    return BLOCKS[c.idAt(x & 15, y, z & 15)]?.solid ?? false;
  }

  biome(x: number, z: number): BiomeDef {
    const c = this.chunkAt(x, z);
    if (!c || !c.ready) return biomeById(5);
    return biomeById(c.biomes[(z & 15) * 16 + (x & 15)]);
  }

  skyLight(x: number, y: number, z: number): number {
    const c = this.chunkAt(x, z);
    if (!c) return 15;
    return c.skyLight(x & 15, y, z & 15);
  }

  blockLight(x: number, y: number, z: number): number {
    const c = this.chunkAt(x, z);
    if (!c) return 0;
    return c.blockLight(x & 15, y, z & 15);
  }

  /** Plus haut bloc non-air de la colonne. */
  height(x: number, z: number): number {
    const c = this.chunkAt(x, z);
    if (!c || !c.ready) return 0;
    return c.heightmap[(z & 15) * 16 + (x & 15)];
  }

  /** Premier bloc solide sous (x, yStart, z), ou -1. */
  groundBelow(x: number, yStart: number, z: number): number {
    for (let y = Math.min(yStart, WORLD_HEIGHT - 1); y >= 0; y--) if (this.def(x, y, z).solid) return y;
    return -1;
  }

  onChange(fn: (c: BlockChange) => void): void {
    this.listeners.push(fn);
  }

  /** Modifie un bloc. Renvoie false si le tronçon n'est pas chargé. */
  set(x: number, y: number, z: number, id: number, meta = 0, cause: BlockChange['cause'] = 'player'): boolean {
    if (y < 0 || y >= WORLD_HEIGHT) return false;
    const c = this.chunkAt(x, z);
    if (!c || !c.ready) return false;
    const lx = x & 15;
    const lz = z & 15;
    const prev = c.get(lx, y, lz);
    const next = packBlock(id, meta);
    if (prev === next) return true;
    c.set(lx, y, lz, next);
    const pid = blockId(prev);
    if (pid !== id) {
      const key = (y << 8) | (lz << 4) | lx;
      if (c.blockEntities.has(key) && BLOCKS[pid]?.interact !== BLOCKS[id]?.interact) c.blockEntities.delete(key);
    }
    this.markDirty(x, y, z, pid, id);
    for (const l of this.listeners) l({ x, y, z, prev, next, cause });
    return true;
  }

  setRaw(x: number, y: number, z: number, raw: number, cause: BlockChange['cause'] = 'player'): boolean {
    return this.set(x, y, z, raw & ID_MASK, blockMeta(raw), cause);
  }

  private markDirty(x: number, y: number, z: number, prevId: number, nextId: number): void {
    const cx = Math.floor(x / 16);
    const cz = Math.floor(z / 16);
    const lx = x & 15;
    const lz = z & 15;
    const sy = y >> 4;
    const lightChange = OPAQUE[prevId] !== OPAQUE[nextId] || LIGHT_EMIT[prevId] !== LIGHT_EMIT[nextId] || LIGHT_FILTER[prevId] !== LIGHT_FILTER[nextId] || prevId === 86 || nextId === 86 || prevId === 91 || nextId === 91;
    let own = (1 << sy) | (y % 16 === 15 && sy < 15 ? 1 << (sy + 1) : 0) | (y % 16 === 0 && sy > 0 ? 1 << (sy - 1) : 0);
    if (lightChange) {
      // La lumière du ciel peut descendre loin sous le bloc ; la lumière des blocs porte à 15.
      own |= (1 << Math.min(15, sy + 2)) - 1;
      for (let k = Math.max(0, sy - 1); k <= Math.min(15, sy + 1); k++) own |= 1 << k;
    }
    this.chunks.markDirty(cx, cz, own);
    const near = lightChange ? 16 : 1;
    const ring = lightChange ? ((1 << Math.min(15, sy + 2)) - 1) | own : own;
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dz) continue;
        const touchX = dx === 0 || (dx < 0 ? lx < near : lx >= 16 - near);
        const touchZ = dz === 0 || (dz < 0 ? lz < near : lz >= 16 - near);
        if (touchX && touchZ) this.chunks.markDirty(cx + dx, cz + dz, ring);
      }
  }

  blockEntity(x: number, y: number, z: number): BlockEntity | undefined {
    const c = this.chunkAt(x, z);
    if (!c) return undefined;
    return c.blockEntities.get((y << 8) | ((z & 15) << 4) | (x & 15));
  }

  setBlockEntity(x: number, y: number, z: number, e: BlockEntity | null): void {
    const c = this.chunkAt(x, z);
    if (!c) return;
    const k = (y << 8) | ((z & 15) << 4) | (x & 15);
    if (e) c.blockEntities.set(k, e);
    else c.blockEntities.delete(k);
    c.modified = true;
  }
}
