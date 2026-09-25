/** Tampon d'écriture d'une colonne en cours de génération (côté worker). */
import { CS, SECTIONS, SECTION_VOL, WORLD_H } from '../world/constants';
import type { BlockTables } from '../registry/blocks';

export interface GenEntity {
  type: string;
  x: number;
  y: number;
  z: number;
  data?: Record<string, unknown>;
}

export interface GenBlockEntity {
  i: number; // cidx local
  data: { type: string; [k: string]: unknown };
}

/** Interface minimale d'écriture de blocs (génération ou monde vivant). */
export interface BlockWriter {
  place(wx: number, wy: number, wz: number, v: number, overLeaves?: boolean): void;
  setW(wx: number, wy: number, wz: number, v: number): void;
  getW(wx: number, wy: number, wz: number): number;
}

export class ChunkBuffer implements BlockWriter {
  readonly sections: (Uint16Array | null)[] = new Array(SECTIONS).fill(null);
  readonly biomes = new Uint8Array(CS * CS);
  readonly tints = new Uint32Array(CS * CS * 3);
  readonly blockEntities: GenBlockEntity[] = [];
  readonly entities: GenEntity[] = [];
  readonly bx: number;
  readonly bz: number;

  constructor(
    readonly cx: number,
    readonly cz: number,
    readonly t: BlockTables,
  ) {
    this.bx = cx * CS;
    this.bz = cz * CS;
  }

  get(x: number, y: number, z: number): number {
    if (y < 0 || y >= WORLD_H) return 0;
    const s = this.sections[y >> 4];
    return s ? s[((y & 15) << 8) | (z << 4) | x] : 0;
  }

  set(x: number, y: number, z: number, v: number): void {
    if (y < 0 || y >= WORLD_H) return;
    let s = this.sections[y >> 4];
    if (!s) {
      if (v === 0) return;
      s = this.sections[y >> 4] = new Uint16Array(SECTION_VOL);
    }
    s[((y & 15) << 8) | (z << 4) | x] = v;
  }

  inside(wx: number, wz: number): boolean {
    return wx >= this.bx && wx < this.bx + CS && wz >= this.bz && wz < this.bz + CS;
  }

  /** Lecture en coordonnées monde (−1 hors de la colonne). */
  getW(wx: number, wy: number, wz: number): number {
    if (!this.inside(wx, wz)) return -1;
    return this.get(wx - this.bx, wy, wz - this.bz);
  }

  /** Écriture inconditionnelle en coordonnées monde (ignorée hors colonne). */
  setW(wx: number, wy: number, wz: number, v: number): void {
    if (!this.inside(wx, wz)) return;
    this.set(wx - this.bx, wy, wz - this.bz, v);
  }

  /** Écrit seulement sur de l'air ou un bloc remplaçable (plantes, feuilles si leaves=true). */
  place(wx: number, wy: number, wz: number, v: number, overLeaves = false): void {
    if (!this.inside(wx, wz) || wy < 0 || wy >= WORLD_H) return;
    const cur = this.get(wx - this.bx, wy, wz - this.bz) & 0xfff;
    if (cur === 0 || this.t.shape[cur] === 2 /* cross */ || (overLeaves && this.t.pass[cur] === 1 && this.t.shape[cur] === 1)) this.set(wx - this.bx, wy, wz - this.bz, v);
  }

  /** Premier bloc solide depuis le haut dans une colonne locale. */
  top(x: number, z: number): number {
    for (let s = SECTIONS - 1; s >= 0; s--) {
      const sec = this.sections[s];
      if (!sec) continue;
      for (let y = 15; y >= 0; y--) {
        const v = sec[(y << 8) | (z << 4) | x] & 0xfff;
        if (v !== 0 && this.t.solid[v]) return (s << 4) | y;
      }
    }
    return -1;
  }

  addBlockEntity(wx: number, wy: number, wz: number, data: { type: string; [k: string]: unknown }): void {
    if (!this.inside(wx, wz)) return;
    this.blockEntities.push({ i: (wy << 8) | ((wz - this.bz) << 4) | (wx - this.bx), data });
  }
}
