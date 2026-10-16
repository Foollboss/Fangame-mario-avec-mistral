/**
 * Petites ruines des Terres de braise, fréquentes et peu coûteuses : cercles de piliers de
 * basalte autour d'un autel, tours de guet effondrées et îlots de basalte sur la lave.
 * Chacune abrite un coffre (butin de forteresse).
 */
import { HORIZONTAL_DIRS } from '../../constants';
import { Rng, hash2 } from '../../../util/random';
import { EMBER_LAVA_LEVEL, type EmberGenerator } from '../otherDims';
import type { ChunkWriter } from '../writer';
import { I, EMBER_OPEN, addPiece, newPlan, squareBox, clear, column, fillDown, chestAt, rnd, type Box, type DimPlan } from './kit';

/** Une ruine possible par cellule de 48×48 blocs. */
export const RUIN_CELL = 48;
/** Portée maximale d'une ruine autour de son centre. */
export const RUIN_REACH = 8;

/** Plan de la ruine d'une cellule, ou null si la cellule est vide (ou trop près d'une forteresse). */
export function emberRuinPlan(g: EmberGenerator, ix: number, iz: number, blocked: (b: Box) => boolean): DimPlan | null {
  const rng = new Rng(hash2(g.seed ^ 0x2a11, ix, iz));
  if (!rng.chance(0.4)) return null;
  const cx = ix * RUIN_CELL + rng.int(RUIN_REACH, RUIN_CELL - RUIN_REACH - 1);
  const cz = iz * RUIN_CELL + rng.int(RUIN_REACH, RUIN_CELL - RUIN_REACH - 1);
  if (blocked(squareBox(cx, cz, RUIN_REACH))) return null;
  const lava = EMBER_LAVA_LEVEL;
  const h = g.heightAt(cx, cz);
  const seed = Math.floor(rng.next() * 0x7fffffff);
  if (h <= lava - 2) return islet(cx, cz, rng, seed);
  return rng.chance(0.55) ? pillarRing(g, cx, cz, rng, seed) : watchtower(g, cx, cz, rng, seed);
}

/** Sol pur (surface du relief ou de la lave) d'une colonne. */
function groundAt(g: EmberGenerator, x: number, z: number): number {
  return Math.max(g.heightAt(x, z), EMBER_LAVA_LEVEL);
}

// ------------------------------------------------------------------ cercle de basalte

interface Pillar {
  x: number;
  z: number;
  h: number;
  top: number;
}

function pillarRing(g: EmberGenerator, cx: number, cz: number, rng: Rng, seed: number): DimPlan {
  const R = rng.int(4, 6);
  const n = rng.int(5, 7);
  const pillars: Pillar[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rng.range(-0.25, 0.25);
    const h = rng.int(2, 8);
    const r = rng.next();
    pillars.push({ x: cx + Math.round(Math.cos(a) * R), z: cz + Math.round(Math.sin(a) * R), h, top: r < 0.45 ? I.fire : r < 0.7 ? I.glowstone : 0 });
  }
  const facing = rng.int(0, 3);
  const plan = newPlan('ember_ruin', cx, groundAt(g, cx, cz) + 1, cz);
  addPiece(plan, squareBox(cx, cz, R + 1), (w, x, z) => {
    const ground = groundAt(g, x, z);
    for (const p of pillars)
      if (p.x === x && p.z === z) {
        column(w, x, z, ground, ground + p.h, I.basalt);
        if (p.top) w.set(x, ground + p.h + 1, z, p.top);
        return;
      }
    const dx = x - cx;
    const dz = z - cz;
    const r = Math.sqrt(dx * dx + dz * dz);
    if (r > R - 0.5) return;
    clear(w, x, z, ground + 1, ground + 3);
    const v = rnd(seed, x, 0, z);
    w.set(x, ground, z, r <= 1.5 ? I.obsidian : v < 0.2 ? I.magma : v < 0.55 ? I.basalt : I.bricks);
    if (dx === 0 && dz === 0) {
      w.set(x, ground + 1, z, I.bricks);
      chestAt(w, x, ground + 2, z, facing, 'fortress');
    } else if (r > R - 1.5 && v > 0.93) w.set(x, ground + 1, z, I.fire);
  });
  return plan;
}

// ------------------------------------------------------------------ tour de guet effondrée

function watchtower(g: EmberGenerator, cx: number, cz: number, rng: Rng, seed: number): DimPlan {
  const y0 = groundAt(g, cx, cz) + 1;
  const door = rng.int(0, 3);
  const [ddx, ddz] = HORIZONTAL_DIRS[door];
  const plan = newPlan('ember_ruin', cx, y0 + 1, cz);
  addPiece(plan, squareBox(cx, cz, 4), (w, x, z) => {
    const u = x - cx;
    const v = z - cz;
    const au = Math.abs(u);
    const av = Math.abs(v);
    const r = Math.max(au, av);
    if (r > 2) {
      // Éboulis autour de la tour
      if (rnd(seed, x, 1, z) < 0.14) {
        const gy = groundAt(g, x, z);
        w.set(x, gy + 1, z, rnd(seed, x, 2, z) < 0.3 ? I.magma : I.bricks);
      }
      return;
    }
    fillDown(w, x, y0 - 1, z, I.bricks, EMBER_OPEN, 40);
    w.set(x, y0, z, I.bricks);
    clear(w, x, z, y0 + 1, y0 + 11);
    if (r < 2) {
      if (u === -ddx && v === -ddz) chestAt(w, x, y0 + 1, z, door, 'fortress');
      else if (u === ddz && v === -ddx) w.set(x, y0 + 1, z, I.lantern);
      else if (u === 0 && v === 0) w.set(x, y0, z, I.magma);
      return;
    }
    const corner = au === 2 && av === 2;
    const top = y0 + (corner ? 6 + Math.floor(rnd(seed, x, 3, z) * 4) : 2 + Math.floor(rnd(seed, x, 3, z) * 6));
    column(w, x, z, y0 + 1, top, I.bricks);
    if (corner && rnd(seed, x, 4, z) < 0.5) w.set(x, top + 1, z, I.glowstone);
    if (u === 2 * ddx && v === 2 * ddz) clear(w, x, z, y0 + 1, y0 + 2);
    else if ((u === 0 || v === 0) && top >= y0 + 3) w.set(x, y0 + 3, z, I.ironBars);
  });
  return plan;
}

// ------------------------------------------------------------------ îlot sur la lave

function islet(cx: number, cz: number, rng: Rng, seed: number): DimPlan {
  const R = rng.int(3, 5);
  const y = EMBER_LAVA_LEVEL + 1;
  const facing = rng.int(0, 3);
  const spires: Pillar[] = [];
  const n = rng.int(2, 3);
  for (let i = 0; i < n; i++) {
    const a = rng.next() * Math.PI * 2;
    spires.push({ x: cx + Math.round(Math.cos(a) * (R - 0.6)), z: cz + Math.round(Math.sin(a) * (R - 0.6)), h: rng.int(2, 5), top: rng.chance(0.6) ? I.fire : I.glowstone });
  }
  const plan = newPlan('ember_ruin', cx, y + 1, cz);
  addPiece(plan, squareBox(cx, cz, R), (w, x, z) => {
    const dx = x - cx;
    const dz = z - cz;
    const r = Math.sqrt(dx * dx + dz * dz);
    if (r > R + 0.3) return;
    column(w, x, z, y - 2, y - 1, I.basalt);
    w.set(x, y, z, r <= R - 1.6 && r > 0.5 ? I.magma : I.basalt);
    clear(w, x, z, y + 1, y + 6);
    for (const p of spires)
      if (p.x === x && p.z === z) {
        column(w, x, z, y + 1, y + p.h, I.basalt);
        w.set(x, y + p.h + 1, z, p.top);
        return;
      }
    if (dx === 0 && dz === 0) chestAt(w, x, y + 1, z, facing, 'fortress');
    else if (rnd(seed, x, 5, z) < 0.06) w.set(x, y + 1, z, I.fire);
  });
  return plan;
}
