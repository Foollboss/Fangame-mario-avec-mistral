/** Recherche de chemin A* sur la grille de blocs (marche, saut d'un bloc, descente de 3). */
import { BLOCKS, IS_LIQUID, WATERLOGGED } from '../world/blocks';
import type { World } from '../world/World';

export interface PathNode {
  x: number;
  y: number;
  z: number;
}

function passable(world: World, x: number, y: number, z: number): boolean {
  const d = BLOCKS[world.id(x, y, z)];
  if (!d) return true;
  if (d.solid) return d.shape === 'door' && (world.meta(x, y, z) & 4) !== 0;
  if (IS_LIQUID[d.id] && !WATERLOGGED[d.id]) return false;
  return d.damage === 0 && d.key !== 'cobweb';
}

function standable(world: World, x: number, y: number, z: number, height: number, canSwim: boolean): boolean {
  for (let i = 0; i < height; i++) if (!passable(world, x, y + i, z)) return false;
  const below = BLOCKS[world.id(x, y - 1, z)];
  if (below?.solid) return below.key !== 'cactus' && below.key !== 'magma' && below.shape !== 'fence';
  if (canSwim && WATERLOGGED[world.id(x, y, z)]) return true;
  return false;
}

export function findPath(world: World, sx: number, sy: number, sz: number, tx: number, ty: number, tz: number, height = 2, maxNodes = 400, canSwim = true): PathNode[] | null {
  sx = Math.floor(sx);
  sy = Math.floor(sy);
  sz = Math.floor(sz);
  tx = Math.floor(tx);
  ty = Math.floor(ty);
  tz = Math.floor(tz);
  const key = (x: number, y: number, z: number) => `${x},${y},${z}`;
  const open: Array<{ x: number; y: number; z: number; g: number; f: number; parent: string | null }> = [];
  const came = new Map<string, { x: number; y: number; z: number; parent: string | null; g: number }>();
  const h = (x: number, y: number, z: number) => Math.abs(x - tx) + Math.abs(y - ty) * 1.5 + Math.abs(z - tz);
  open.push({ x: sx, y: sy, z: sz, g: 0, f: h(sx, sy, sz), parent: null });
  came.set(key(sx, sy, sz), { x: sx, y: sy, z: sz, parent: null, g: 0 });
  let best = open[0];
  let bestH = h(sx, sy, sz);
  let expanded = 0;
  while (open.length && expanded < maxNodes) {
    let bi = 0;
    for (let i = 1; i < open.length; i++) if (open[i].f < open[bi].f) bi = i;
    const cur = open[bi];
    open[bi] = open[open.length - 1];
    open.pop();
    expanded++;
    const hh = h(cur.x, cur.y, cur.z);
    if (hh < bestH) {
      bestH = hh;
      best = cur;
    }
    if (cur.x === tx && cur.z === tz && Math.abs(cur.y - ty) <= 1) {
      best = cur;
      break;
    }
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = cur.x + dx;
      const nz = cur.z + dz;
      let ny = -999;
      if (standable(world, nx, cur.y, nz, height, canSwim)) ny = cur.y;
      else if (standable(world, nx, cur.y + 1, nz, height, canSwim) && passable(world, cur.x, cur.y + height, cur.z)) ny = cur.y + 1;
      else
        for (let d = 1; d <= 3; d++) {
          if (!passable(world, nx, cur.y - d + height - 1, nz)) break;
          if (standable(world, nx, cur.y - d, nz, height, canSwim)) {
            ny = cur.y - d;
            break;
          }
        }
      if (ny === -999) continue;
      const k = key(nx, ny, nz);
      const g = cur.g + 1 + (ny !== cur.y ? 0.5 : 0);
      const prev = came.get(k);
      if (prev && prev.g <= g) continue;
      came.set(k, { x: nx, y: ny, z: nz, parent: key(cur.x, cur.y, cur.z), g });
      open.push({ x: nx, y: ny, z: nz, g, f: g + h(nx, ny, nz), parent: key(cur.x, cur.y, cur.z) });
    }
  }
  if (!best || (best.x === sx && best.z === sz && best.y === sy)) return null;
  const path: PathNode[] = [];
  let k: string | null = key(best.x, best.y, best.z);
  while (k) {
    const n = came.get(k);
    if (!n) break;
    path.push({ x: n.x, y: n.y, z: n.z });
    k = n.parent;
  }
  path.reverse();
  return path.slice(1);
}
