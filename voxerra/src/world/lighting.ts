/**
 * Moteur d'éclairage voxel (lumière du ciel + lumière des blocs, 0..15),
 * propagation par parcours en largeur et suppression incrémentale
 * (algorithme classique à deux files : extinction puis re-propagation).
 */
import type { Chunk } from './chunk';
import { CS, WORLD_H } from './constants';

export interface LightWorld {
  getChunk(cx: number, cz: number): Chunk | undefined;
  markCellDirty(x: number, y: number, z: number): void;
  readonly opacity: Uint8Array;
  readonly emission: Uint8Array;
}

/** File d'entiers extensible (triplets ou quadruplets). */
class IntQueue {
  data = new Int32Array(1 << 14);
  head = 0;
  tail = 0;
  push4(a: number, b: number, c: number, d: number): void {
    if (this.tail + 4 > this.data.length) this.grow();
    const t = this.tail;
    this.data[t] = a;
    this.data[t + 1] = b;
    this.data[t + 2] = c;
    this.data[t + 3] = d;
    this.tail = t + 4;
  }
  private grow(): void {
    const used = this.tail - this.head;
    if (this.head > 0 && used < this.data.length / 2) {
      this.data.copyWithin(0, this.head, this.tail);
    } else {
      const n = new Int32Array(this.data.length * 2);
      n.set(this.data.subarray(this.head, this.tail));
      this.data = n;
    }
    this.head = 0;
    this.tail = used;
  }
  get empty(): boolean {
    return this.head >= this.tail;
  }
  clear(): void {
    this.head = this.tail = 0;
  }
}

const DX = [1, -1, 0, 0, 0, 0];
const DY = [0, 0, 1, -1, 0, 0];
const DZ = [0, 0, 0, 0, 1, -1];
const DOWN = 3;

export class LightEngine {
  private addQ = [new IntQueue(), new IntQueue()]; // 0 = ciel, 1 = bloc
  private remQ = [new IntQueue(), new IntQueue()];
  private cacheChunk: Chunk | undefined;
  private cacheCx = 1e9;
  private cacheCz = 1e9;

  constructor(private w: LightWorld) {}

  private chunk(cx: number, cz: number): Chunk | undefined {
    if (cx === this.cacheCx && cz === this.cacheCz) return this.cacheChunk;
    this.cacheCx = cx;
    this.cacheCz = cz;
    this.cacheChunk = this.w.getChunk(cx, cz);
    return this.cacheChunk;
  }

  invalidateCache(): void {
    this.cacheCx = 1e9;
    this.cacheChunk = undefined;
  }

  private get(ch: number, x: number, y: number, z: number): number {
    if (y >= WORLD_H) return ch === 0 ? 15 : 0;
    if (y < 0) return 0;
    const c = this.chunk(x >> 4, z >> 4);
    if (!c) return -1;
    const l = c.getLight(x & 15, y, z & 15);
    return ch === 0 ? l >> 4 : l & 15;
  }

  private set(ch: number, x: number, y: number, z: number, v: number): void {
    const c = this.chunk(x >> 4, z >> 4);
    if (!c) return;
    const lx = x & 15,
      lz = z & 15;
    const l = c.getLight(lx, y, lz);
    const nl = ch === 0 ? (v << 4) | (l & 15) : (l & 0xf0) | v;
    if (nl === l) return;
    c.setLight(lx, y, lz, nl);
    this.w.markCellDirty(x, y, z);
  }

  private opacityAt(x: number, y: number, z: number): number {
    if (y < 0) return 15;
    if (y >= WORLD_H) return 0;
    const c = this.chunk(x >> 4, z >> 4);
    if (!c) return 15;
    return this.w.opacity[c.get(x & 15, y, z & 15) & 0xfff];
  }

  private emissionAt(x: number, y: number, z: number): number {
    const c = this.chunk(x >> 4, z >> 4);
    if (!c) return 0;
    return this.w.emission[c.get(x & 15, y, z & 15) & 0xfff];
  }

  /** Propage les files d'ajout jusqu'à épuisement. */
  private propagate(ch: number): void {
    const q = this.addQ[ch];
    const data = () => q.data;
    while (!q.empty) {
      const h = q.head;
      const d = data();
      const x = d[h],
        y = d[h + 1],
        z = d[h + 2];
      q.head += 4;
      const L = this.get(ch, x, y, z);
      if (L <= 1) continue;
      for (let f = 0; f < 6; f++) {
        const ny = y + DY[f];
        if (ny < 0 || ny >= WORLD_H) continue;
        const nx = x + DX[f],
          nz = z + DZ[f];
        const op = this.opacityAt(nx, ny, nz);
        if (op >= 15) continue;
        const nl = ch === 0 && f === DOWN && L === 15 && op === 0 ? 15 : L - Math.max(1, op);
        if (nl <= 0) continue;
        const cur = this.get(ch, nx, ny, nz);
        if (cur < 0 || cur >= nl) continue;
        this.set(ch, nx, ny, nz, nl);
        q.push4(nx, ny, nz, 0);
      }
    }
    q.clear();
  }

  /** Éteint la lumière d'une cellule et de tout ce qui en dépend. */
  private remove(ch: number, x: number, y: number, z: number): void {
    const L = this.get(ch, x, y, z);
    if (L <= 0) return;
    this.set(ch, x, y, z, 0);
    const rq = this.remQ[ch];
    const aq = this.addQ[ch];
    rq.push4(x, y, z, L);
    while (!rq.empty) {
      const h = rq.head;
      const d = rq.data;
      const cx = d[h],
        cy = d[h + 1],
        cz = d[h + 2],
        cl = d[h + 3];
      rq.head += 4;
      for (let f = 0; f < 6; f++) {
        const ny = cy + DY[f];
        if (ny < 0 || ny >= WORLD_H) continue;
        const nx = cx + DX[f],
          nz = cz + DZ[f];
        const nl = this.get(ch, nx, ny, nz);
        if (nl <= 0) continue;
        if (nl < cl || (ch === 0 && f === DOWN && cl === 15 && nl === 15)) {
          this.set(ch, nx, ny, nz, 0);
          rq.push4(nx, ny, nz, nl);
          if (ch === 1) {
            const e = this.emissionAt(nx, ny, nz);
            if (e > 0) {
              this.set(1, nx, ny, nz, e);
              aq.push4(nx, ny, nz, 0);
            }
          }
        } else {
          aq.push4(nx, ny, nz, 0);
        }
      }
    }
    rq.clear();
  }

  /** Mise à jour incrémentale après la modification d'un bloc. */
  onBlockChanged(x: number, y: number, z: number): void {
    this.invalidateCache();
    // Lumière des blocs
    this.remove(1, x, y, z);
    const e = this.emissionAt(x, y, z);
    if (e > 0) {
      this.set(1, x, y, z, e);
      this.addQ[1].push4(x, y, z, 0);
    }
    // Lumière du ciel
    this.remove(0, x, y, z);
    const op = this.opacityAt(x, y, z);
    if (op < 15) {
      for (let f = 0; f < 6; f++) {
        const ny = y + DY[f];
        if (ny < 0 || ny >= WORLD_H) continue;
        this.addQ[0].push4(x + DX[f], ny, z + DZ[f], 0);
        this.addQ[1].push4(x + DX[f], ny, z + DZ[f], 0);
      }
      // Exposition directe au ciel
      if (y + 1 >= WORLD_H || this.get(0, x, y + 1, z) === 15) {
        if (op === 0) {
          this.set(0, x, y, z, 15);
          this.addQ[0].push4(x, y, z, 0);
        }
      }
    }
    this.propagate(1);
    this.propagate(0);
  }

  /** Éclairage initial d'une colonne nouvellement chargée + échanges avec ses voisines. */
  lightChunk(c: Chunk): void {
    this.invalidateCache();
    const op = this.w.opacity;
    const em = this.w.emission;
    let maxH = -1;
    for (let i = 0; i < 256; i++) if (c.heightmap[i] > maxH) maxH = c.heightmap[i];
    const topLit = maxH < 0 ? -1 : maxH >> 4;
    // Sections sous le sommet : allocation, ciel=0 par défaut
    for (let s = 0; s < c.sections.length; s++) {
      const sec = c.sections[s];
      if (s <= topLit) {
        if (!sec.light) sec.light = new Uint8Array(4096);
        else sec.light.fill(0);
      } else sec.light = null;
    }
    // Ciel : colonnes verticales
    if (topLit >= 0) {
      const top = topLit * 16 + 15;
      for (let z = 0; z < CS; z++)
        for (let x = 0; x < CS; x++) {
          let L = 15;
          for (let y = top; y >= 0 && L > 0; y--) {
            const o = op[c.get(x, y, z) & 0xfff];
            if (o > 0) L = o >= 15 ? 0 : Math.max(0, L - o);
            if (L > 0) {
              const sec = c.sections[y >> 4];
              const i = ((y & 15) << 8) | (z << 4) | x;
              sec.light![i] = (L << 4) | (sec.light![i] & 15);
            }
          }
        }
    }
    const bx = c.cx * CS,
      bz = c.cz * CS;
    const aq0 = this.addQ[0],
      aq1 = this.addQ[1];
    // Graines de propagation horizontale du ciel
    const hmAt = (wx: number, wz: number): number => {
      const ch = this.chunk(wx >> 4, wz >> 4);
      if (!ch) return c.heightmap[(wz & 15) * CS + (wx & 15)];
      return ch.heightmap[(wz & 15) * CS + (wx & 15)];
    };
    for (let z = 0; z < CS; z++)
      for (let x = 0; x < CS; x++) {
        const h = c.heightmap[z * CS + x];
        const wx = bx + x,
          wz = bz + z;
        const nmax = Math.max(hmAt(wx + 1, wz), hmAt(wx - 1, wz), hmAt(wx, wz + 1), hmAt(wx, wz - 1));
        for (let y = h + 1; y <= nmax && y < WORLD_H; y++) aq0.push4(wx, y, wz, 0);
      }
    // Sources de lumière de blocs
    for (let s = 0; s < c.sections.length; s++) {
      const b = c.sections[s].blocks;
      if (!b) continue;
      for (let i = 0; i < 4096; i++) {
        const v = b[i];
        if (v === 0) continue;
        const e = em[v & 0xfff];
        if (e > 0) {
          const x = i & 15,
            z = (i >> 4) & 15,
            y = (s << 4) | (i >> 8);
          c.setLight(x, y, z, (c.getLight(x, y, z) & 0xf0) | e);
          aq1.push4(bx + x, y, bz + z, 0);
        }
      }
    }
    // Échanges aux bords avec les colonnes voisines déjà chargées
    const neighbors: [number, number, number, number][] = [
      [1, 0, 16, -1],
      [-1, 0, -1, -1],
      [0, 1, -1, 16],
      [0, -1, -1, -1],
    ];
    for (const [dx, dz] of neighbors) {
      const n = this.chunk(c.cx + dx, c.cz + dz);
      if (!n) continue;
      const top = Math.max(n.topSection(), c.topSection()) * 16 + 16;
      for (let k = 0; k < CS; k++)
        for (let y = 0; y < Math.min(top, WORLD_H); y++) {
          // cellule de la voisine collée à notre bord
          const wx = dx === 1 ? bx + 16 : dx === -1 ? bx - 1 : bx + k;
          const wz = dz === 1 ? bz + 16 : dz === -1 ? bz - 1 : bz + k;
          const l = n.getLight(wx & 15, y, wz & 15);
          if (l >> 4 > 1) aq0.push4(wx, y, wz, 0);
          if ((l & 15) > 1) aq1.push4(wx, y, wz, 0);
          // et notre cellule de bord (pour pousser vers la voisine)
          const ox = dx === 1 ? bx + 15 : dx === -1 ? bx : bx + k;
          const oz = dz === 1 ? bz + 15 : dz === -1 ? bz : bz + k;
          const ol = c.getLight(ox & 15, y, oz & 15);
          if (ol >> 4 > 1) aq0.push4(ox, y, oz, 0);
          if ((ol & 15) > 1) aq1.push4(ox, y, oz, 0);
        }
    }
    this.propagate(0);
    this.propagate(1);
    c.lit = true;
  }
}
