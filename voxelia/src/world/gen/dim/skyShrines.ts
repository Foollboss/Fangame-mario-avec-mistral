/**
 * Petits sanctuaires du Royaume céleste : autels à piliers dorés coiffés de nuages, posés sur
 * les îles, et jardins flottants (disque d'herbe céleste, arbre doré, coffre) dans le vide.
 */
import { Rng, hash2 } from '../../../util/random';
import type { SkyGenerator } from '../otherDims';
import type { ChunkWriter } from '../writer';
import { growTree } from '../trees';
import { I, SKY_OPEN, addPiece, addOnce, newPlan, squareBox, clear, column, setIfOpen, chestAt, rnd, dirOf, type Box, type DimPlan } from './kit';

/** Un sanctuaire possible par cellule de 64×64 blocs. */
export const SHRINE_CELL = 64;
export const SHRINE_REACH = 9;

export function skyShrinePlan(g: SkyGenerator, ix: number, iz: number, blocked: (b: Box) => boolean): DimPlan | null {
  const rng = new Rng(hash2(g.seed ^ 0x51e7, ix, iz));
  if (!rng.chance(0.45)) return null;
  const cx = ix * SHRINE_CELL + rng.int(SHRINE_REACH, SHRINE_CELL - SHRINE_REACH - 1);
  const cz = iz * SHRINE_CELL + rng.int(SHRINE_REACH, SHRINE_CELL - SHRINE_REACH - 1);
  if (blocked(squareBox(cx, cz, SHRINE_REACH))) return null;
  const seed = Math.floor(rng.next() * 0x7fffffff);
  const { top } = g.islandAt(cx, cz);
  if (top > 0) {
    // Autel posé au plus haut de son emprise (fondation dessous) ; on évite les pentes raides.
    let hi = top;
    let lo = top;
    for (const [ox, oz] of [
      [3, 3],
      [-3, 3],
      [3, -3],
      [-3, -3],
      [3, 0],
      [-3, 0],
      [0, 3],
      [0, -3],
    ]) {
      const t = g.islandAt(cx + ox, cz + oz).top;
      if (t <= 0) continue;
      hi = Math.max(hi, t);
      lo = Math.min(lo, t);
    }
    if (hi - lo > 6) return null;
    return shrine(g, cx, cz, hi, rng, seed);
  }
  // Jardin flottant : seulement loin des îles, pour ne pas s'y encastrer.
  for (const [ox, oz] of [
    [7, 0],
    [-7, 0],
    [0, 7],
    [0, -7],
  ])
    if (g.islandAt(cx + ox, cz + oz).top > 0) return null;
  return garden(cx, cz, rng, seed);
}

// ------------------------------------------------------------------ autel sur une île

function shrine(g: SkyGenerator, cx: number, cz: number, y0: number, rng: Rng, seed: number): DimPlan {
  const facing = rng.int(0, 3);
  const plan = newPlan('sky_shrine', cx, y0 + 1, cz);
  addPiece(plan, squareBox(cx, cz, 5), (w, x, z) => {
    const u = x - cx;
    const v = z - cz;
    const au = Math.abs(u);
    const av = Math.abs(v);
    const r = Math.max(au, av);
    if (r > 3) {
      // Couronne de fleurs autour de l'autel
      if (rnd(seed, x, 0, z) < 0.3) {
        const { top } = g.islandAt(x, z);
        if (top > 0 && w.get(x, top + 1, z) === 0) w.set(x, top + 1, z, rnd(seed, x, 1, z) < 0.5 ? I.dandelion : I.cornflower);
      }
      return;
    }
    clear(w, x, z, y0 + 1, y0 + 9);
    for (let y = y0 - 1; y >= y0 - 8; y--) setIfOpen(w, x, y, z, I.skyStone, SKY_OPEN);
    w.set(x, y0, z, u === 0 && v === 0 ? I.gold : r <= 1 ? I.calcite : I.quartz);
    if (au === 3 && av === 3) {
      column(w, x, z, y0 + 1, y0 + 4, I.goldenLog);
      w.set(x, y0 + 5, z, I.crystal);
      return;
    }
    if (u === 0 && v === 0) {
      w.set(x, y0 + 5, z, I.crystal);
      w.set(x, y0 + 6, z, I.gold);
      chestAt(w, x, y0 + 1, z, facing, 'sky_temple');
      return;
    }
    w.set(x, y0 + 5, z, r === 3 ? I.quartz : I.cloud);
    if (au === 2 && av === 2 && u === v) w.set(x, y0 + 1, z, I.lantern);
  });
  return plan;
}

// ------------------------------------------------------------------ jardin flottant

function garden(cx: number, cz: number, rng: Rng, seed: number): DimPlan {
  const R = rng.int(4, 6);
  const Y = rng.int(84, 116);
  const treeSeed = rng.int(1, 0x7fffffff);
  const a = rng.next() * Math.PI * 2;
  const chx = cx + Math.round(Math.cos(a) * (R - 2));
  const chz = cz + Math.round(Math.sin(a) * (R - 2));
  const ddx = cx - chx;
  const ddz = cz - chz;
  const facing = Math.abs(ddx) > Math.abs(ddz) ? dirOf(Math.sign(ddx), 0) : dirOf(0, Math.sign(ddz) || 1);
  const plan = newPlan('sky_garden', cx, Y + 1, cz);
  addPiece(plan, squareBox(cx, cz, R + 3), (w: ChunkWriter, x: number, z: number) => {
    const dx = x - cx;
    const dz = z - cz;
    const r = Math.sqrt(dx * dx + dz * dz);
    if (r > R + 0.4) {
      if (r <= R + 2.5 && rnd(seed, x, 2, z) < 0.3) setIfOpen(w, x, Y - 2, z, I.cloud, SKY_OPEN);
      return;
    }
    const depth = Math.floor((R - r) * 1.3) + 1 + Math.floor(rnd(seed, x, 3, z) * 2);
    w.set(x, Y, z, I.skyGrass);
    column(w, x, z, Y - 2, Y - 1, I.skyDirt);
    column(w, x, z, Y - 2 - depth, Y - 3, I.skyStone);
    if (r < 1) w.set(x, Y - 3 - depth, z, I.crystal);
    if (x === chx && z === chz) chestAt(w, x, Y + 1, z, facing, 'sky_temple');
    else if (r > 1.5) {
      const v = rnd(seed, x, 4, z);
      if (v < 0.12) w.set(x, Y + 1, z, I.dandelion);
      else if (v < 0.2) w.set(x, Y + 1, z, I.cornflower);
      else if (v < 0.45) w.set(x, Y + 1, z, I.shortGrass);
    }
  });
  // L'arbre doré est posé après le disque (même ordre dans chaque tronçon).
  addOnce(plan, squareBox(cx, cz, 3), (w) => growTree(w, 'golden', cx, Y + 1, cz, treeSeed));
  return plan;
}
