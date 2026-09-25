/**
 * Recherche de chemin A* sur la grille voxel : marche, montée d'une marche,
 * descente (chute ≤ 3 blocs), diagonales, eau (coût), évitement des dangers
 * (lave, cactus, magma, vide).
 */
import type { World } from '../../world/world';
import { Shape, LIQ_WATER, LIQ_LAVA } from '../../registry/blocks';

export interface PathNode {
  x: number;
  y: number;
  z: number;
}

export interface PathOpts {
  maxNodes?: number;
  height?: number; // hauteur en blocs (arrondie)
  canSwim?: boolean;
  fireImmune?: boolean;
  maxDrop?: number;
}

class Heap {
  private a: number[] = [];
  private f: number[] = [];
  push(id: number, f: number): void {
    const a = this.a,
      fs = this.f;
    a.push(id);
    fs.push(f);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (fs[p] <= fs[i]) break;
      [a[p], a[i]] = [a[i], a[p]];
      [fs[p], fs[i]] = [fs[i], fs[p]];
      i = p;
    }
  }
  pop(): number {
    const a = this.a,
      fs = this.f;
    const top = a[0];
    const la = a.pop()!,
      lf = fs.pop()!;
    if (a.length) {
      a[0] = la;
      fs[0] = lf;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1,
          r = l + 1;
        let m = i;
        if (l < a.length && fs[l] < fs[m]) m = l;
        if (r < a.length && fs[r] < fs[m]) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        [fs[m], fs[i]] = [fs[i], fs[m]];
        i = m;
      }
    }
    return top;
  }
  get size(): number {
    return this.a.length;
  }
}

export function findPath(w: World, sx: number, sy: number, sz: number, tx: number, ty: number, tz: number, o: PathOpts = {}): PathNode[] | null {
  const t = w.content.blocks;
  const maxNodes = o.maxNodes ?? 400;
  const H = Math.max(1, o.height ?? 2);
  const maxDrop = o.maxDrop ?? 3;
  const passable = (x: number, y: number, z: number): boolean => {
    if (y < 0) return false;
    if (y > 255) return true;
    if (!w.isLoaded(x, z)) return false;
    const v = w.getBlock(x, y, z);
    const id = v & 0xfff;
    if (id === 0) return true;
    const lq = t.liquid[id];
    if (lq === LIQ_LAVA) return !!o.fireImmune;
    if (lq === LIQ_WATER) return true;
    if (t.damage[id] > 0 && !o.fireImmune) return false;
    if (t.shape[id] === Shape.DOOR) return ((v >>> 12) & 4) !== 0;
    return !t.solid[id] || t.shape[id] === Shape.CARPET || t.shape[id] === Shape.PLATE;
  };
  const standable = (x: number, y: number, z: number): number => {
    // 0 = impossible, 1 = sol, 2 = nage
    for (let k = 0; k < H; k++) if (!passable(x, y + k, z)) return 0;
    const here = w.getId(x, y, z);
    if (t.liquid[here] === LIQ_WATER) return 2;
    if (t.liquid[here] === LIQ_LAVA) return o.fireImmune ? 2 : 0;
    const below = w.getId(x, y - 1, z);
    if (t.liquid[below] === LIQ_WATER) return o.canSwim ? 2 : 0;
    if (t.liquid[below] === LIQ_LAVA) return o.fireImmune ? 2 : 0;
    if (!t.solid[below]) return 0;
    if (t.damage[below] > 0 && !o.fireImmune) return 0;
    const sh = t.shape[below];
    if (sh === Shape.FENCE || sh === Shape.WALL) return 0;
    return 1;
  };
  if (!standable(sx, sy, sz)) {
    // départ légèrement instable (en l'air, contre un mur) : accepté
  }
  const key = (x: number, y: number, z: number) => ((x - sx + 256) * 512 + y) * 512 + (z - sz + 256);
  const open = new Heap();
  const g = new Map<number, number>();
  const came = new Map<number, number>();
  const pos = new Map<number, [number, number, number]>();
  const startK = key(sx, sy, sz);
  g.set(startK, 0);
  pos.set(startK, [sx, sy, sz]);
  const hdist = (x: number, y: number, z: number) => Math.hypot(x - tx, (y - ty) * 1.2, z - tz);
  open.push(startK, hdist(sx, sy, sz));
  let best = startK,
    bestH = hdist(sx, sy, sz);
  let expanded = 0;
  const closed = new Set<number>();
  while (open.size > 0 && expanded < maxNodes) {
    const k = open.pop();
    if (closed.has(k)) continue;
    closed.add(k);
    expanded++;
    const [x, y, z] = pos.get(k)!;
    const h = hdist(x, y, z);
    if (h < bestH) {
      bestH = h;
      best = k;
    }
    if (Math.abs(x - tx) <= 0 && Math.abs(z - tz) <= 0 && Math.abs(y - ty) <= 1) {
      best = k;
      break;
    }
    const gk = g.get(k)!;
    for (let dx = -1; dx <= 1; dx++)
      for (let dz = -1; dz <= 1; dz++) {
        if (!dx && !dz) continue;
        const nx = x + dx,
          nz = z + dz;
        if (dx && dz && (!passable(x + dx, y, z) || !passable(x, y, z + dz) || !passable(x + dx, y + 1, z) || !passable(x, y + 1, z + dz))) continue;
        let ny = y;
        let kind = standable(nx, ny, nz);
        let cost = dx && dz ? 1.41 : 1;
        if (!kind) {
          // montée
          if (standable(nx, y + 1, nz) && passable(x, y + H, z)) {
            ny = y + 1;
            kind = standable(nx, ny, nz);
            cost += 0.6;
          } else {
            // descente
            for (let d = 1; d <= maxDrop; d++) {
              if (!passable(nx, y - d + 1, nz)) break;
              const s = standable(nx, y - d, nz);
              if (s) {
                ny = y - d;
                kind = s;
                cost += d * 0.3;
                break;
              }
            }
          }
        }
        if (!kind) continue;
        if (kind === 2) cost += o.canSwim ? 0 : 3;
        const nk = key(nx, ny, nz);
        if (closed.has(nk)) continue;
        const ng = gk + cost;
        if (ng >= (g.get(nk) ?? Infinity)) continue;
        g.set(nk, ng);
        came.set(nk, k);
        pos.set(nk, [nx, ny, nz]);
        open.push(nk, ng + hdist(nx, ny, nz));
      }
  }
  if (best === startK) return null;
  const out: PathNode[] = [];
  let c: number | undefined = best;
  while (c !== undefined && c !== startK) {
    const [x, y, z] = pos.get(c)!;
    out.push({ x, y, z });
    c = came.get(c);
  }
  out.reverse();
  return out;
}
