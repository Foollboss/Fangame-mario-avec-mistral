/**
 * Monde d'une dimension : colonnes chargées, accès aux blocs/lumière,
 * modifications avec éclairage incrémental et notification des sections à remailler.
 * Aucune dépendance au rendu (utilisable par le serveur).
 */
import { Chunk, type BlockEntityData } from './chunk';
import { CS, WORLD_H, ckey, skey } from './constants';
import { LightEngine } from './lighting';
import type { Content } from '../registry/content';

export interface BlockChange {
  x: number;
  y: number;
  z: number;
  old: number;
  cell: number;
}

export class World {
  readonly chunks = new Map<number, Chunk>();
  readonly light: LightEngine;
  /** Sections à remailler (clés skey). */
  readonly dirtySections = new Set<number>();
  readonly opacity: Uint8Array;
  readonly emission: Uint8Array;
  /** Observateurs de modifications de blocs (sons, réseau, mécanismes…). */
  readonly blockListeners: ((c: BlockChange) => void)[] = [];
  /** Appelé pour tout changement de bloc, même silencieux (réplication réseau). */
  readonly changeHooks: ((x: number, y: number, z: number, cell: number) => void)[] = [];
  /** Vrai côté client : les sections modifiées sont remaillées. */
  trackDirty = true;

  constructor(
    readonly content: Content,
    readonly dim: string,
    readonly seed: number,
  ) {
    this.opacity = content.blocks.lightOpacity;
    this.emission = content.blocks.lightEmit;
    this.light = new LightEngine(this);
  }

  getChunk(cx: number, cz: number): Chunk | undefined {
    return this.chunks.get(ckey(cx, cz));
  }

  chunkAtBlock(x: number, z: number): Chunk | undefined {
    return this.chunks.get(ckey(x >> 4, z >> 4));
  }

  isLoaded(x: number, z: number): boolean {
    return this.chunks.has(ckey(x >> 4, z >> 4));
  }

  getBlock(x: number, y: number, z: number): number {
    if (y < 0 || y >= WORLD_H) return 0;
    const c = this.chunks.get(ckey(x >> 4, z >> 4));
    return c ? c.get(x & 15, y, z & 15) : 0;
  }

  getId(x: number, y: number, z: number): number {
    return this.getBlock(x, y, z) & 0xfff;
  }

  getLight(x: number, y: number, z: number): number {
    if (y >= WORLD_H) return 0xf0;
    if (y < 0) return 0;
    const c = this.chunks.get(ckey(x >> 4, z >> 4));
    return c ? c.getLight(x & 15, y, z & 15) : 0xf0;
  }

  skyLight(x: number, y: number, z: number): number {
    return this.getLight(x, y, z) >> 4;
  }
  blockLight(x: number, y: number, z: number): number {
    return this.getLight(x, y, z) & 15;
  }

  /** Hauteur de la carte (plus haut bloc atténuant la lumière). */
  heightAt(x: number, z: number): number {
    const c = this.chunkAtBlock(x, z);
    return c ? c.heightmap[(z & 15) * CS + (x & 15)] : -1;
  }

  biomeAt(x: number, z: number): number {
    const c = this.chunkAtBlock(x, z);
    return c ? c.biomes[(z & 15) * CS + (x & 15)] : 0;
  }

  /**
   * Modifie un bloc : met à jour la carte des hauteurs, l'éclairage,
   * les sections à remailler et prévient les observateurs.
   */
  setBlock(x: number, y: number, z: number, cell: number, opts: { silent?: boolean } = {}): boolean {
    if (y < 0 || y >= WORLD_H) return false;
    const c = this.chunkAtBlock(x, z);
    if (!c) return false;
    const lx = x & 15,
      lz = z & 15;
    const old = c.set(lx, y, lz, cell);
    if (old === cell) return false;
    c.dirty = true;
    c.modified = true;
    // Carte des hauteurs
    const hi = lz * CS + lx;
    const op = this.opacity[cell & 0xfff];
    if (op > 0 && y > c.heightmap[hi]) c.heightmap[hi] = y;
    else if (op === 0 && y === c.heightmap[hi]) c.updateHeight(lx, lz, this.opacity);
    // Entité de bloc orpheline
    if ((old & 0xfff) !== (cell & 0xfff)) c.blockEntities.delete((y << 8) | (lz << 4) | lx);
    if (c.lit) this.light.onBlockChanged(x, y, z);
    this.markCellDirty(x, y, z);
    for (const h of this.changeHooks) h(x, y, z, cell);
    if (!opts.silent) for (const l of this.blockListeners) l({ x, y, z, old, cell });
    return true;
  }

  getBlockEntity(x: number, y: number, z: number): BlockEntityData | undefined {
    const c = this.chunkAtBlock(x, z);
    return c?.blockEntities.get((y << 8) | ((z & 15) << 4) | (x & 15));
  }

  setBlockEntity(x: number, y: number, z: number, data: BlockEntityData | null): void {
    const c = this.chunkAtBlock(x, z);
    if (!c) return;
    const k = (y << 8) | ((z & 15) << 4) | (x & 15);
    if (data) c.blockEntities.set(k, data);
    else c.blockEntities.delete(k);
    c.dirty = true;
    c.modified = true;
  }

  markSectionDirty(cx: number, sy: number, cz: number): void {
    if (!this.trackDirty || sy < 0 || sy >= 16) return;
    this.dirtySections.add(skey(cx, sy, cz));
  }

  /** Marque la section de la cellule et les sections voisines qui l'échantillonnent. */
  markCellDirty(x: number, y: number, z: number): void {
    if (!this.trackDirty) return;
    const x0 = (x - 1) >> 4,
      x1 = (x + 1) >> 4;
    const y0 = Math.max(0, (y - 1) >> 4),
      y1 = Math.min(15, (y + 1) >> 4);
    const z0 = (z - 1) >> 4,
      z1 = (z + 1) >> 4;
    for (let sx = x0; sx <= x1; sx++)
      for (let sy = y0; sy <= y1; sy++)
        for (let sz = z0; sz <= z1; sz++) if (this.chunks.has(ckey(sx, sz))) this.dirtySections.add(skey(sx, sy, sz));
  }

  /** Ajoute une colonne générée/chargée et l'éclaire. */
  addChunk(c: Chunk): void {
    this.chunks.set(ckey(c.cx, c.cz), c);
    this.light.invalidateCache();
    for (let x = 0; x < CS; x++) for (let z = 0; z < CS; z++) c.updateHeight(x, z, this.opacity);
    this.light.lightChunk(c);
    if (this.trackDirty) {
      const top = c.topSection();
      for (let sy = 0; sy < top; sy++) this.dirtySections.add(skey(c.cx, sy, c.cz));
      // Les voisines doivent recalculer leurs faces de bord
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const n = this.getChunk(c.cx + dx, c.cz + dz);
        if (!n) continue;
        const nt = n.topSection();
        for (let sy = 0; sy < nt; sy++) this.dirtySections.add(skey(n.cx, sy, n.cz));
      }
    }
  }

  removeChunk(cx: number, cz: number): Chunk | undefined {
    const k = ckey(cx, cz);
    const c = this.chunks.get(k);
    if (c) {
      this.chunks.delete(k);
      this.light.invalidateCache();
      for (let sy = 0; sy < 16; sy++) this.dirtySections.delete(skey(cx, sy, cz));
    }
    return c;
  }

  /** Premier bloc solide en descendant depuis y (ou −1). */
  findGround(x: number, z: number, fromY = WORLD_H - 1): number {
    const solid = this.content.blocks.solid;
    for (let y = fromY; y >= 0; y--) if (solid[this.getId(x, y, z)]) return y;
    return -1;
  }
}
