/**
 * Générateurs des dimensions mystérieuses :
 *  - Terres de braise : mer de lave, plateaux de pierre de braise, deltas de basalte, dunes de cendre.
 *  - Royaume céleste : îles flottantes, nuages, arbres dorés, vide en dessous.
 */
import { COLUMN_VOLUME, colIndex, packBlock } from '../constants';
import { B, AIR } from '../blocks';
import { biomeKey, biomeById } from '../biomes';
import { Fbm } from '../../util/noise';
import { Rng, hash2, rand2 } from '../../util/random';
import { NoiseGrid } from './grid';
import { ChunkWriter } from './writer';
import { growTree } from './trees';
import type { GenOptions } from './terrain';
import type { GeneratedColumn } from './overworld';
import { generateEmberStructures, generateSkyStructures } from './dimStructures';

export const EMBER_LAVA_LEVEL = 40;

/**
 * Minerais rares, un voxel isolé dans la roche hôte : graine dérivée propre (distincte de
 * celles des autres minerais) et probabilité par voxel. Mesuré sur plusieurs graines :
 * ≈ 6 étherium par tronçon (≈ 11 000 voxels de pierre de braise) et ≈ 2 à 3,5 célestine
 * par tronçon contenant une île (≈ 3 000 voxels de pierre céleste).
 */
const ETHERIUM_SEED = 0x37e10000;
const ETHERIUM_CHANCE = 0.0005;
const CELESTINE_SEED = 0x2c5e0000;
const CELESTINE_CHANCE = 0.001;

export class EmberGenerator {
  private height: Fbm;
  private ridge: Fbm;
  private biomeN: Fbm;
  private cave: Fbm;
  readonly seed: number;
  constructor(readonly opts: GenOptions) {
    const s = opts.seed ^ 0xe3be;
    this.seed = s;
    this.height = new Fbm(s + 1, 4, 1 / 220);
    this.ridge = new Fbm(s + 2, 4, 1 / 140);
    this.biomeN = new Fbm(s + 3, 2, 1 / 600);
    this.cave = new Fbm(s + 4, 2, 1 / 40);
  }

  biomeAt(x: number, z: number): number {
    const v = this.biomeN.get2(x, z) * 2;
    return v < -0.3 ? biomeKey('basalt_deltas') : v > 0.35 ? biomeKey('ash_dunes') : biomeKey('ember_wastes');
  }

  heightAt(x: number, z: number): number {
    const b = this.biomeAt(x, z);
    let h = 44 + this.height.get2(x, z) * 30 + this.ridge.ridged2(x, z) * 38;
    if (b === biomeKey('ash_dunes')) h = 48 + this.height.get2(x, z) * 16;
    if (b === biomeKey('basalt_deltas')) h = 42 + this.ridge.ridged2(x * 2, z * 2) * 10;
    return Math.floor(Math.max(10, h));
  }

  generate(cx: number, cz: number): GeneratedColumn {
    const blocks = new Uint16Array(COLUMN_VOLUME);
    const biomes = new Uint8Array(256);
    const w = new ChunkWriter(blocks, cx, cz);
    const x0 = cx * 16;
    const z0 = cz * 16;
    const grid = new NoiseGrid(x0, z0, 4, 4, 0, 128, (x, y, z) => this.cave.get3(x, y * 1.5, z));
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) {
        const x = x0 + lx;
        const z = z0 + lz;
        const b = this.biomeAt(x, z);
        biomes[lz * 16 + lx] = b;
        const h = this.heightAt(x, z);
        const def = biomeById(b);
        const top = B[def.top];
        const filler = B[def.filler];
        blocks[colIndex(lx, 0, lz)] = packBlock(B.bedrock);
        for (let y = 1; y <= h; y++) {
          let id = y > h - 3 ? (y === h ? top : filler) : B.ember_stone;
          if (y < h - 3 && y > 8 && grid.get(lx, y, lz) > 0.42) id = y < 20 ? B.lava : AIR;
          if (id === B.ember_stone && rand2(this.seed + y, x, z) < 0.012) id = B.ember_ore;
          if (id === B.ember_stone && rand2((this.seed ^ ETHERIUM_SEED) + y, x, z) < ETHERIUM_CHANCE) id = B.etherium_ore;
          if (id === B.ember_stone && y < 30 && rand2(this.seed ^ y, z, x) < 0.004) id = B.obsidian;
          blocks[colIndex(lx, y, lz)] = packBlock(id);
        }
        for (let y = h + 1; y <= EMBER_LAVA_LEVEL; y++) blocks[colIndex(lx, y, lz)] = packBlock(B.lava);
        if (h > EMBER_LAVA_LEVEL) {
          const r = rand2(this.seed ^ 0x77, x, z);
          if (r < 0.015) blocks[colIndex(lx, h + 1, lz)] = packBlock(B.fire);
          else if (r < 0.03) blocks[colIndex(lx, h, lz)] = packBlock(B.magma);
          else if (r < 0.034 && b === biomeKey('ember_wastes')) blocks[colIndex(lx, h + 1, lz)] = packBlock(B.dead_bush);
        }
      }
    // Colonnes de basalte et flèches d'obsidienne
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const ccx = cx + dx;
        const ccz = cz + dz;
        const rng = new Rng(hash2(this.seed ^ 0x5b1, ccx, ccz));
        const n = rng.int(0, 2);
        for (let i = 0; i < n; i++) {
          const x = ccx * 16 + rng.int(0, 15);
          const z = ccz * 16 + rng.int(0, 15);
          const h = this.heightAt(x, z);
          const height = rng.int(6, 22);
          const kind = this.biomeAt(x, z) === biomeKey('basalt_deltas') ? B.basalt : B.obsidian;
          const rad = rng.int(1, 2);
          for (let y = 0; y < height; y++) {
            const r = Math.max(0, rad - Math.floor((y / height) * (rad + 1)));
            for (let ox = -r; ox <= r; ox++) for (let oz = -r; oz <= r; oz++) w.set(x + ox, Math.max(h, EMBER_LAVA_LEVEL) + y, z + oz, kind);
          }
          if (kind === B.obsidian && rng.chance(0.5)) w.set(x, Math.max(h, EMBER_LAVA_LEVEL) + height, z, B.glowstone);
        }
      }
    if (this.opts.structures) generateEmberStructures(w, this);
    // Créatures
    const h = hash2(this.seed ^ 0x4e, cx, cz);
    if (h % 6 === 0) {
      const lx = (h >>> 4) & 15;
      const lz = (h >>> 8) & 15;
      const y = this.heightAt(x0 + lx, z0 + lz);
      if (y > EMBER_LAVA_LEVEL) w.mark({ kind: 'mob', id: (h >>> 12) % 2 ? 'ember_salamander' : 'magma_cube', x: x0 + lx + 0.5, y: y + 1, z: z0 + lz + 0.5 });
    }
    return { blocks, biomes, markers: w.markers };
  }
}

export class SkyGenerator {
  private island: Fbm;
  private shape: Fbm;
  private biomeN: Fbm;
  private cloud: Fbm;
  readonly seed: number;
  constructor(readonly opts: GenOptions) {
    const s = opts.seed ^ 0x5c1e;
    this.seed = s;
    this.island = new Fbm(s + 1, 3, 1 / 160);
    this.shape = new Fbm(s + 2, 3, 1 / 50);
    this.biomeN = new Fbm(s + 3, 2, 1 / 500);
    this.cloud = new Fbm(s + 4, 3, 1 / 90);
  }

  biomeAt(x: number, z: number): number {
    return this.biomeN.get2(x, z) > 0.2 ? biomeKey('golden_grove') : biomeKey('sky_islands');
  }

  /** Épaisseur et sommet de l'île à cette colonne (0 = pas d'île). */
  islandAt(x: number, z: number): { top: number; bottom: number } {
    const m = this.island.get2(x, z) * 2.2;
    if (m < 0.15) return { top: 0, bottom: 0 };
    const k = Math.min(1, (m - 0.15) * 2.2);
    const top = Math.floor(96 + this.shape.get2(x, z) * 10 + k * 8);
    const bottom = Math.floor(top - 4 - k * 26 - this.shape.get2(z, x) * 6);
    return { top, bottom };
  }

  generate(cx: number, cz: number): GeneratedColumn {
    const blocks = new Uint16Array(COLUMN_VOLUME);
    const biomes = new Uint8Array(256);
    const w = new ChunkWriter(blocks, cx, cz);
    const x0 = cx * 16;
    const z0 = cz * 16;
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) {
        const x = x0 + lx;
        const z = z0 + lz;
        const b = this.biomeAt(x, z);
        biomes[lz * 16 + lx] = b;
        const { top, bottom } = this.islandAt(x, z);
        if (top > 0) {
          for (let y = bottom; y <= top; y++) {
            let id = B.sky_stone;
            if (y === top) id = B.sky_grass;
            else if (y > top - 4) id = B.sky_dirt;
            else if (rand2(this.seed + y, x, z) < 0.01) id = B.crystal_block;
            else if (rand2(this.seed ^ y, z, x) < 0.006) id = B.gold_ore;
            else if (rand2((this.seed ^ CELESTINE_SEED) + y, x, z) < CELESTINE_CHANCE) id = B.celestine_ore;
            blocks[colIndex(lx, y, lz)] = packBlock(id);
          }
          const r = rand2(this.seed ^ 0x99, x, z);
          if (r < 0.2) blocks[colIndex(lx, top + 1, lz)] = packBlock(B.short_grass);
          else if (r < 0.23) blocks[colIndex(lx, top + 1, lz)] = packBlock(b === biomeKey('golden_grove') ? B.dandelion : B.cornflower);
        }
        // Couches de nuages traversables
        const c = this.cloud.get2(x, z);
        if (c > 0.32) for (let y = 70; y < 72; y++) if (blocks[colIndex(lx, y, lz)] === AIR) blocks[colIndex(lx, y, lz)] = packBlock(B.cloud);
        if (c < -0.42) for (let y = 128; y < 130; y++) if (blocks[colIndex(lx, y, lz)] === AIR) blocks[colIndex(lx, y, lz)] = packBlock(B.cloud);
      }
    // Arbres
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const ccx = cx + dx;
        const ccz = cz + dz;
        const rng = new Rng(hash2(this.seed ^ 0x7ee, ccx, ccz));
        const n = rng.int(0, 3);
        for (let i = 0; i < n; i++) {
          const x = ccx * 16 + rng.int(0, 15);
          const z = ccz * 16 + rng.int(0, 15);
          const seed = Math.floor(rng.next() * 0xffffffff);
          const { top } = this.islandAt(x, z);
          if (top <= 0) continue;
          const golden = this.biomeAt(x, z) === biomeKey('golden_grove');
          growTree(w, golden || rng.chance(0.3) ? 'golden' : 'oak', x, top + 1, z, seed);
        }
      }
    if (this.opts.structures) generateSkyStructures(w, this);
    const h = hash2(this.seed ^ 0x4e, cx, cz);
    if (h % 5 === 0) {
      const lx = (h >>> 4) & 15;
      const lz = (h >>> 8) & 15;
      const { top } = this.islandAt(x0 + lx, z0 + lz);
      if (top > 0) w.mark({ kind: 'mob', id: 'sky_sheep', x: x0 + lx + 0.5, y: top + 1, z: z0 + lz + 0.5 });
    }
    return { blocks, biomes, markers: w.markers };
  }
}
