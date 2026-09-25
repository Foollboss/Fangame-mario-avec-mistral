/** Lancer de rayon voxel (DDA d'Amanatides & Woo) avec formes partielles. */
import type { World } from '../world/world';
import { Shape } from '../registry/blocks';
import { selectionBox } from '../world/shapes';
import { connectionsAt } from './collision';

export interface RayHit {
  x: number;
  y: number;
  z: number;
  face: number; // face touchée (0 +X, 1 −X, 2 +Y, 3 −Y, 4 +Z, 5 −Z)
  px: number;
  py: number;
  pz: number;
  dist: number;
  cell: number;
}

/** Intersection rayon / boîte ; renvoie [tEntrée, face] ou null. */
export function rayBox(ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): [number, number] | null {
  let tmin = -Infinity,
    tmax = Infinity,
    face = -1;
  const axes: [number, number, number, number, number, number][] = [
    [ox, dx, x0, x1, 1, 0],
    [oy, dy, y0, y1, 3, 2],
    [oz, dz, z0, z1, 5, 4],
  ];
  for (const [o, d, lo, hi, fNeg, fPos] of axes) {
    if (Math.abs(d) < 1e-12) {
      if (o < lo || o > hi) return null;
      continue;
    }
    let t1 = (lo - o) / d,
      t2 = (hi - o) / d;
    let f1 = fNeg,
      f2 = fPos;
    if (t1 > t2) {
      [t1, t2] = [t2, t1];
      [f1, f2] = [f2, f1];
    }
    if (t1 > tmin) {
      tmin = t1;
      face = f1;
    }
    if (t2 < tmax) tmax = t2;
    if (tmin > tmax) return null;
  }
  if (tmax < 0) return null;
  return [Math.max(0, tmin), face];
}

export function raycastBlocks(world: World, ox: number, oy: number, oz: number, dx: number, dy: number, dz: number, maxDist: number, opts: { liquids?: boolean } = {}): RayHit | null {
  const t = world.content.blocks;
  const len = Math.hypot(dx, dy, dz) || 1;
  dx /= len;
  dy /= len;
  dz /= len;
  let x = Math.floor(ox),
    y = Math.floor(oy),
    z = Math.floor(oz);
  const stepX = dx > 0 ? 1 : -1,
    stepY = dy > 0 ? 1 : -1,
    stepZ = dz > 0 ? 1 : -1;
  const tdx = Math.abs(1 / dx),
    tdy = Math.abs(1 / dy),
    tdz = Math.abs(1 / dz);
  let tmx = dx !== 0 ? (dx > 0 ? x + 1 - ox : ox - x) * tdx : Infinity;
  let tmy = dy !== 0 ? (dy > 0 ? y + 1 - oy : oy - y) * tdy : Infinity;
  let tmz = dz !== 0 ? (dz > 0 ? z + 1 - oz : oz - z) * tdz : Infinity;
  let face = -1;
  let dist = 0;
  for (let i = 0; i < 256 && dist <= maxDist; i++) {
    const cell = world.getBlock(x, y, z);
    const id = cell & 0xfff;
    if (id !== 0) {
      const sh = t.shape[id];
      const isLiquid = sh === Shape.LIQUID;
      if (!isLiquid || opts.liquids) {
        if (sh === Shape.CUBE || isLiquid) {
          if (face >= 0 || i > 0) return { x, y, z, face: face < 0 ? 2 : face, px: ox + dx * dist, py: oy + dy * dist, pz: oz + dz * dist, dist, cell };
        } else {
          const conn = sh === Shape.FENCE || sh === Shape.WALL || sh === Shape.PANE ? connectionsAt(world, x, y, z, sh) : 0;
          let best: [number, number] | null = null;
          for (const b of selectionBox(sh, cell >>> 12, conn)) {
            const r = rayBox(ox, oy, oz, dx, dy, dz, x + b[0] / 16, y + b[1] / 16, z + b[2] / 16, x + b[3] / 16, y + b[4] / 16, z + b[5] / 16);
            if (r && (!best || r[0] < best[0])) best = r;
          }
          if (best && best[0] <= maxDist) return { x, y, z, face: best[1] < 0 ? 2 : best[1], px: ox + dx * best[0], py: oy + dy * best[0], pz: oz + dz * best[0], dist: best[0], cell };
        }
      }
    }
    if (tmx < tmy && tmx < tmz) {
      x += stepX;
      dist = tmx;
      tmx += tdx;
      face = stepX > 0 ? 1 : 0;
    } else if (tmy < tmz) {
      y += stepY;
      dist = tmy;
      tmy += tdy;
      face = stepY > 0 ? 3 : 2;
    } else {
      z += stepZ;
      dist = tmz;
      tmz += tdz;
      face = stepZ > 0 ? 5 : 4;
    }
  }
  return null;
}
