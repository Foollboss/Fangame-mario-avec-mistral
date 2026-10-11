/** Lancer de rayon voxel (DDA) contre les boîtes de sélection des blocs. */
import * as THREE from 'three';
import { BLOCKS } from './blocks';
import { blockMeta, ID_MASK } from './constants';
import { needsConnections, selectionBoxes } from './models';
import { connectionMask } from '../entity/physics';
import type { World } from './World';

export interface RayHit {
  x: number;
  y: number;
  z: number;
  /** Face touchée (0 +X, 1 -X, 2 +Y, 3 -Y, 4 +Z, 5 -Z). */
  face: number;
  point: THREE.Vector3;
  dist: number;
  id: number;
  meta: number;
}

export const FACE_NORMALS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

/** Intersection rayon / boîte (méthode des dalles). Renvoie [t, face] ou null. */
export function rayBox(o: THREE.Vector3, d: THREE.Vector3, b: number[]): [number, number] | null {
  let tmin = -Infinity;
  let tmax = Infinity;
  let face = -1;
  for (let a = 0; a < 3; a++) {
    const oa = a === 0 ? o.x : a === 1 ? o.y : o.z;
    const da = a === 0 ? d.x : a === 1 ? d.y : d.z;
    const lo = b[a];
    const hi = b[a + 3];
    if (Math.abs(da) < 1e-9) {
      if (oa < lo || oa > hi) return null;
      continue;
    }
    let t1 = (lo - oa) / da;
    let t2 = (hi - oa) / da;
    let f1 = a * 2 + 1; // face « basse » (normale négative)
    let f2 = a * 2;
    if (t1 > t2) {
      [t1, t2] = [t2, t1];
      [f1, f2] = [f2, f1];
    }
    if (t1 > tmin) {
      tmin = t1;
      face = f1;
    }
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  if (tmax < 0) return null;
  return [Math.max(0, tmin), face];
}

export function raycast(world: World, origin: THREE.Vector3, dir: THREE.Vector3, maxDist: number, liquids = false): RayHit | null {
  let x = Math.floor(origin.x);
  let y = Math.floor(origin.y);
  let z = Math.floor(origin.z);
  const sx = Math.sign(dir.x);
  const sy = Math.sign(dir.y);
  const sz = Math.sign(dir.z);
  const tdx = sx !== 0 ? Math.abs(1 / dir.x) : Infinity;
  const tdy = sy !== 0 ? Math.abs(1 / dir.y) : Infinity;
  const tdz = sz !== 0 ? Math.abs(1 / dir.z) : Infinity;
  let tmx = sx > 0 ? (x + 1 - origin.x) * tdx : sx < 0 ? (origin.x - x) * tdx : Infinity;
  let tmy = sy > 0 ? (y + 1 - origin.y) * tdy : sy < 0 ? (origin.y - y) * tdy : Infinity;
  let tmz = sz > 0 ? (z + 1 - origin.z) * tdz : sz < 0 ? (origin.z - z) * tdz : Infinity;
  let t = 0;
  const local = new THREE.Vector3();
  for (let i = 0; i < 256 && t <= maxDist; i++) {
    const raw = world.raw(x, y, z);
    const id = raw & ID_MASK;
    if (id !== 0) {
      const def = BLOCKS[id];
      const isLiquid = def.shape === 'liquid';
      if (def && (!isLiquid || liquids) && def.key !== 'air') {
        const meta = isLiquid ? 0 : blockMeta(raw);
        if (isLiquid && liquids && meta !== 0) {
          /* seules les sources sont ramassables */
        } else {
          const conn = needsConnections(def.shape) ? connectionMask(world, x, y, z, def.shape) : 0;
          const boxes = selectionBoxes(def, meta, conn);
          local.set(origin.x - x, origin.y - y, origin.z - z);
          let best: [number, number] | null = null;
          for (const b of boxes) {
            const bb = b.map((v) => v / 16);
            const r = rayBox(local, dir, bb);
            if (r && (!best || r[0] < best[0])) best = r;
          }
          if (best && best[0] <= maxDist) {
            return { x, y, z, face: best[1], dist: best[0], point: origin.clone().addScaledVector(dir, best[0]), id, meta };
          }
        }
      }
    }
    if (tmx < tmy && tmx < tmz) {
      x += sx;
      t = tmx;
      tmx += tdx;
    } else if (tmy < tmz) {
      y += sy;
      t = tmy;
      tmy += tdy;
    } else {
      z += sz;
      t = tmz;
      tmz += tdz;
    }
  }
  return null;
}
