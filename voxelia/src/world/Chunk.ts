import * as THREE from 'three';
import { colIndex, ID_MASK, WORLD_HEIGHT } from './constants';
import type { GenMarker } from './gen/writer';

export interface SectionRender {
  solid: THREE.Mesh | null;
  trans: THREE.Mesh | null;
  /** Connectivité des faces (graphe de visibilité). */
  vis: number;
}

/** Donnée attachée à un bloc (coffre, four, générateur…). */
export interface BlockEntity {
  type: string;
  [k: string]: unknown;
}

/** Colonne de 16x16x256 blocs. */
export class Chunk {
  blocks!: Uint16Array;
  biomes!: Uint8Array;
  light: Uint8Array | null = null;
  heightmap = new Uint8Array(256);
  ready = false;
  /** Sections à remailler (bitmask). */
  dirty = 0;
  meshing = false;
  meshedOnce = false;
  version = 0;
  modified = false;
  sections: SectionRender[] = [];
  group: THREE.Group;
  blockEntities = new Map<number, BlockEntity>();
  markers: GenMarker[] = [];
  lastSeen = 0;

  constructor(
    readonly cx: number,
    readonly cz: number,
    readonly dim: number,
  ) {
    this.group = new THREE.Group();
    this.group.position.set(cx * 16, 0, cz * 16);
    this.group.matrixAutoUpdate = false;
    this.group.updateMatrix();
    for (let i = 0; i < 16; i++) this.sections.push({ solid: null, trans: null, vis: 0x7fff });
  }

  setData(blocks: Uint16Array, biomes: Uint8Array): void {
    this.blocks = blocks;
    this.biomes = biomes;
    this.recomputeHeightmap();
    this.ready = true;
    this.dirty = 0xffff;
  }

  recomputeHeightmap(): void {
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        let y = WORLD_HEIGHT - 1;
        while (y > 0 && this.blocks[colIndex(x, y, z)] === 0) y--;
        this.heightmap[z * 16 + x] = y;
      }
  }

  get(lx: number, y: number, lz: number): number {
    if (y < 0 || y >= WORLD_HEIGHT) return 0;
    return this.blocks[colIndex(lx, y, lz)];
  }

  set(lx: number, y: number, lz: number, v: number): void {
    if (y < 0 || y >= WORLD_HEIGHT) return;
    this.blocks[colIndex(lx, y, lz)] = v;
    const h = z16(lx, lz);
    if (v !== 0 && y > this.heightmap[h]) this.heightmap[h] = y;
    else if (v === 0 && y === this.heightmap[h]) {
      let yy = y;
      while (yy > 0 && this.blocks[colIndex(lx, yy, lz)] === 0) yy--;
      this.heightmap[h] = yy;
    }
    this.modified = true;
    this.version++;
  }

  /** Lumière ciel/blocs (0..15) ; 15/0 par défaut avant le premier maillage. */
  skyLight(lx: number, y: number, lz: number): number {
    if (y >= WORLD_HEIGHT) return 15;
    if (!this.light || y < 0) return y > this.heightmap[z16(lx, lz)] ? 15 : 0;
    return this.light[colIndex(lx, y, lz)] >> 4;
  }

  blockLight(lx: number, y: number, lz: number): number {
    if (!this.light || y < 0 || y >= WORLD_HEIGHT) return 0;
    return this.light[colIndex(lx, y, lz)] & 15;
  }

  idAt(lx: number, y: number, lz: number): number {
    return this.get(lx, y, lz) & ID_MASK;
  }

  dispose(): void {
    for (const s of this.sections) {
      if (s.solid) s.solid.geometry.dispose();
      if (s.trans) s.trans.geometry.dispose();
      s.solid = s.trans = null;
    }
    this.group.removeFromParent();
  }
}

function z16(x: number, z: number): number {
  return z * 16 + x;
}
