/** Générateurs d'arbres (et grands végétaux) — écrivent via ChunkWriter, donc sûrs aux bords. */
import { B } from '../blocks';
import type { TreeKind } from '../biomes';
import { Rng } from '../../util/random';
import type { ChunkWriter } from './writer';

const AXIS_Y = 0;
const AXIS_X = 1;
const AXIS_Z = 2;

function leafBlob(w: ChunkWriter, cx: number, cy: number, cz: number, r: number, leaf: number, rng: Rng, squash = 1): void {
  const ri = Math.ceil(r);
  for (let dy = -ri; dy <= ri; dy++)
    for (let dz = -ri; dz <= ri; dz++)
      for (let dx = -ri; dx <= ri; dx++) {
        const d = (dx * dx + (dy * dy) / (squash * squash) + dz * dz) / (r * r);
        if (d <= 1 && (d < 0.7 || rng.next() > 0.25)) w.setSoft(cx + dx, cy + dy, cz + dz, leaf);
      }
}

function leafDisc(w: ChunkWriter, cx: number, y: number, cz: number, r: number, leaf: number, rng: Rng, cornerChance = 0.5): void {
  for (let dz = -r; dz <= r; dz++)
    for (let dx = -r; dx <= r; dx++) {
      const corner = Math.abs(dx) === r && Math.abs(dz) === r;
      if (corner && (r === 1 || rng.next() > cornerChance)) continue;
      if (dx * dx + dz * dz > r * r + 1) continue;
      w.setSoft(cx + dx, y, cz + dz, leaf);
    }
}

function trunk(w: ChunkWriter, x: number, y: number, z: number, h: number, log: number): void {
  for (let i = 0; i < h; i++) w.set(x, y + i, z, log, AXIS_Y);
}

function hangVines(w: ChunkWriter, x: number, y: number, z: number, r: number, rng: Rng, chance: number): void {
  // Lianes accrochées aux faces externes du feuillage.
  for (let dz = -r - 1; dz <= r + 1; dz++)
    for (let dx = -r - 1; dx <= r + 1; dx++) {
      if (rng.next() > chance) continue;
      const vx = x + dx;
      const vz = z + dz;
      // direction vers le support (0 sud, 1 ouest, 2 nord, 3 est)
      let dir = -1;
      if (w.get(vx + 1, y, vz) === B.jungle_leaves || w.get(vx + 1, y, vz) === B.oak_leaves) dir = 3;
      else if (w.get(vx - 1, y, vz) === B.jungle_leaves || w.get(vx - 1, y, vz) === B.oak_leaves) dir = 1;
      else if (w.get(vx, y, vz + 1) === B.jungle_leaves || w.get(vx, y, vz + 1) === B.oak_leaves) dir = 0;
      else if (w.get(vx, y, vz - 1) === B.jungle_leaves || w.get(vx, y, vz - 1) === B.oak_leaves) dir = 2;
      if (dir < 0 || w.get(vx, y, vz) !== 0) continue;
      const len = rng.int(1, 5);
      for (let i = 0; i < len; i++) {
        if (w.get(vx, y - i, vz) !== 0) break;
        w.set(vx, y - i, vz, B.vine, dir);
      }
    }
}

export function growTree(w: ChunkWriter, kind: TreeKind, x: number, y: number, z: number, seed: number): void {
  const rng = new Rng(seed);
  switch (kind) {
    case 'oak':
    case 'swamp_oak': {
      const h = rng.int(4, 6);
      const leaf = B.oak_leaves;
      trunk(w, x, y, z, h, B.oak_log);
      const top = y + h;
      const r = kind === 'swamp_oak' ? 3 : 2;
      leafDisc(w, x, top - 2, z, r, leaf, rng);
      leafDisc(w, x, top - 1, z, r, leaf, rng);
      leafDisc(w, x, top, z, 1, leaf, rng);
      leafDisc(w, x, top + 1, z, 1, leaf, rng, 1);
      w.setSoft(x, top + 1, z, leaf);
      if (kind === 'swamp_oak') hangVines(w, x, top - 2, z, r, rng, 0.3);
      break;
    }
    case 'birch':
    case 'golden': {
      const h = rng.int(5, 7);
      const log = kind === 'golden' ? B.golden_log : B.birch_log;
      const leaf = kind === 'golden' ? B.golden_leaves : B.birch_leaves;
      trunk(w, x, y, z, h, log);
      const top = y + h;
      leafDisc(w, x, top - 2, z, 2, leaf, rng);
      leafDisc(w, x, top - 1, z, 2, leaf, rng);
      leafDisc(w, x, top, z, 1, leaf, rng);
      leafDisc(w, x, top + 1, z, 1, leaf, rng, 1);
      w.setSoft(x, top + 1, z, leaf);
      break;
    }
    case 'big_oak': {
      const h = rng.int(8, 12);
      trunk(w, x, y, z, h, B.oak_log);
      leafBlob(w, x, y + h, z, 3, B.oak_leaves, rng, 0.8);
      const branches = rng.int(2, 4);
      for (let i = 0; i < branches; i++) {
        const a = rng.next() * Math.PI * 2;
        const by = y + rng.int(Math.floor(h / 2), h - 2);
        const len = rng.int(2, 4);
        const dx = Math.round(Math.cos(a));
        const dz = Math.round(Math.sin(a));
        for (let j = 1; j <= len; j++) w.set(x + dx * j, by + Math.floor(j / 2), z + dz * j, B.oak_log, Math.abs(dx) > 0 ? AXIS_X : AXIS_Z);
        leafBlob(w, x + dx * len, by + Math.floor(len / 2) + 1, z + dz * len, 2.4, B.oak_leaves, rng, 0.8);
      }
      break;
    }
    case 'spruce': {
      const h = rng.int(7, 11);
      trunk(w, x, y, z, h, B.spruce_log);
      const leaf = B.spruce_leaves;
      let r = 0;
      const start = y + rng.int(2, 3);
      let maxR = rng.int(2, 3);
      for (let ly = y + h; ly >= start; ly--) {
        leafDisc(w, x, ly, z, r, leaf, rng, 0);
        r++;
        if (r > maxR) {
          r = 1;
          maxR = Math.min(maxR + (rng.next() < 0.5 ? 1 : 0), 3);
        }
      }
      w.setSoft(x, y + h + 1, z, leaf);
      w.setSoft(x, y + h, z, leaf);
      for (let i = 0; i < h; i++) w.set(x, y + i, z, B.spruce_log, AXIS_Y);
      break;
    }
    case 'mega_spruce': {
      const h = rng.int(16, 24);
      for (let i = 0; i < h; i++) {
        w.set(x, y + i, z, B.spruce_log);
        w.set(x + 1, y + i, z, B.spruce_log);
        w.set(x, y + i, z + 1, B.spruce_log);
        w.set(x + 1, y + i, z + 1, B.spruce_log);
      }
      let r = 1;
      for (let ly = y + h + 1; ly > y + h - 12; ly--) {
        for (let dz = -r; dz <= r + 1; dz++)
          for (let dx = -r; dx <= r + 1; dx++) {
            const ddx = dx <= 0 ? dx : dx - 1;
            const ddz = dz <= 0 ? dz : dz - 1;
            if (ddx * ddx + ddz * ddz <= r * r + 1) w.setSoft(x + dx, ly, z + dz, B.spruce_leaves);
          }
        if ((y + h - ly) % 3 === 2) r = Math.min(r + 1, 4);
      }
      for (let dz = -3; dz <= 4; dz++)
        for (let dx = -3; dx <= 4; dx++) if (rng.next() < 0.6 && w.get(x + dx, y - 1, z + dz) === B.grass_block) w.set(x + dx, y - 1, z + dz, B.podzol);
      break;
    }
    case 'jungle': {
      const h = rng.int(6, 10);
      trunk(w, x, y, z, h, B.jungle_log);
      const top = y + h;
      leafDisc(w, x, top - 2, z, 3, B.jungle_leaves, rng);
      leafDisc(w, x, top - 1, z, 2, B.jungle_leaves, rng);
      leafDisc(w, x, top, z, 2, B.jungle_leaves, rng);
      leafDisc(w, x, top + 1, z, 1, B.jungle_leaves, rng);
      hangVines(w, x, top - 2, z, 3, rng, 0.35);
      for (let i = 1; i < h - 2; i++) if (rng.next() < 0.25) w.setSoft(x + 1, y + i, z, B.vine, 1);
      break;
    }
    case 'mega_jungle': {
      const h = rng.int(14, 22);
      for (let i = 0; i < h; i++) {
        w.set(x, y + i, z, B.jungle_log);
        w.set(x + 1, y + i, z, B.jungle_log);
        w.set(x, y + i, z + 1, B.jungle_log);
        w.set(x + 1, y + i, z + 1, B.jungle_log);
      }
      leafBlob(w, x, y + h, z, 4.5, B.jungle_leaves, rng, 0.5);
      for (let i = 0; i < 3; i++) {
        const a = rng.next() * Math.PI * 2;
        const by = y + rng.int(Math.floor(h * 0.5), h - 3);
        const dx = Math.round(Math.cos(a) * 3);
        const dz = Math.round(Math.sin(a) * 3);
        w.set(x + Math.sign(dx), by, z + Math.sign(dz), B.jungle_log, dx !== 0 ? AXIS_X : AXIS_Z);
        w.set(x + dx, by + 1, z + dz, B.jungle_log, dx !== 0 ? AXIS_X : AXIS_Z);
        leafBlob(w, x + dx, by + 2, z + dz, 2.5, B.jungle_leaves, rng, 0.6);
      }
      hangVines(w, x, y + h - 2, z, 4, rng, 0.3);
      break;
    }
    case 'acacia': {
      const h = rng.int(4, 6);
      const dir = rng.int(0, 3);
      const dx = [0, -1, 0, 1][dir];
      const dz = [1, 0, -1, 0][dir];
      let cx = x;
      let cz = z;
      let cy = y;
      for (let i = 0; i < h; i++) {
        if (i >= h - 2) {
          cx += dx;
          cz += dz;
        }
        w.set(cx, cy, cz, B.acacia_log);
        cy++;
      }
      leafDisc(w, cx, cy, cz, 3, B.acacia_leaves, rng, 1);
      leafDisc(w, cx, cy + 1, cz, 1, B.acacia_leaves, rng, 1);
      // Branche secondaire
      if (rng.next() < 0.6) {
        const bx = x - dx * 2;
        const bz = z - dz * 2;
        w.set(x - dx, y + h - 3, z - dz, B.acacia_log);
        w.set(bx, y + h - 2, bz, B.acacia_log);
        leafDisc(w, bx, y + h - 1, bz, 2, B.acacia_leaves, rng, 1);
      }
      break;
    }
    case 'dark_oak': {
      const h = rng.int(6, 8);
      for (let i = 0; i < h; i++) {
        w.set(x, y + i, z, B.dark_oak_log);
        w.set(x + 1, y + i, z, B.dark_oak_log);
        w.set(x, y + i, z + 1, B.dark_oak_log);
        w.set(x + 1, y + i, z + 1, B.dark_oak_log);
      }
      const top = y + h;
      for (let ly = top - 2; ly <= top + 1; ly++) {
        const r = ly >= top ? 3 : 4;
        for (let dz = -r; dz <= r + 1; dz++)
          for (let dx = -r; dx <= r + 1; dx++) {
            const ddx = dx <= 0 ? dx : dx - 1;
            const ddz = dz <= 0 ? dz : dz - 1;
            if (ddx * ddx + ddz * ddz <= r * r - (ly === top + 1 ? 4 : 0) && rng.next() > 0.08) w.setSoft(x + dx, ly, z + dz, B.dark_oak_leaves);
          }
      }
      break;
    }
    case 'cherry': {
      const h = rng.int(5, 7);
      trunk(w, x, y, z, h, B.cherry_log);
      const a = rng.next() * Math.PI * 2;
      const ends: Array<[number, number, number]> = [[x, y + h, z]];
      for (let b = 0; b < 2; b++) {
        const ang = a + b * Math.PI;
        const dx = Math.round(Math.cos(ang) * 3);
        const dz = Math.round(Math.sin(ang) * 3);
        const by = y + h - 2;
        w.set(x + Math.sign(dx), by, z + Math.sign(dz), B.cherry_log, dx !== 0 ? AXIS_X : AXIS_Z);
        w.set(x + Math.round(dx * 0.7), by + 1, z + Math.round(dz * 0.7), B.cherry_log);
        w.set(x + dx, by + 2, z + dz, B.cherry_log);
        ends.push([x + dx, by + 3, z + dz]);
      }
      for (const [ex, ey, ez] of ends) leafBlob(w, ex, ey, ez, 3, B.cherry_leaves, rng, 0.6);
      break;
    }
    case 'palm': {
      const h = rng.int(6, 9);
      const dir = rng.int(0, 3);
      const dx = [0, -1, 0, 1][dir];
      const dz = [1, 0, -1, 0][dir];
      let cx = x;
      let cz = z;
      for (let i = 0; i < h; i++) {
        if (i === Math.floor(h * 0.5) || i === h - 2) {
          cx += dx;
          cz += dz;
        }
        w.set(cx, y + i, cz, B.palm_log);
      }
      const ty = y + h;
      w.setSoft(cx, ty, cz, B.palm_leaves);
      const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
      for (const [ex, ez] of dirs) {
        const len = ex !== 0 && ez !== 0 ? 3 : 4;
        for (let j = 1; j <= len; j++) {
          const droop = j >= len - 1 ? -1 : 0;
          w.setSoft(cx + ex * j, ty + droop, cz + ez * j, B.palm_leaves);
        }
      }
      break;
    }
    case 'giant_mushroom': {
      const h = rng.int(5, 7);
      for (let i = 0; i < h; i++) w.set(x, y + i, z, B.mushroom_stem);
      const top = y + h;
      for (let dz = -3; dz <= 3; dz++)
        for (let dx = -3; dx <= 3; dx++) {
          const d = dx * dx + dz * dz;
          if (d > 10) continue;
          w.set(x + dx, top, z + dz, B.red_mushroom_block);
          if (d >= 7) w.set(x + dx, top - 1, z + dz, B.red_mushroom_block);
        }
      for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) w.set(x + dx, top + 1, z + dz, B.red_mushroom_block);
      break;
    }
    case 'dead': {
      const h = rng.int(3, 6);
      trunk(w, x, y, z, h, B.oak_log);
      if (rng.next() < 0.7) w.set(x + 1, y + h - 1, z, B.oak_log, AXIS_X);
      if (rng.next() < 0.5) w.set(x, y + h - 2, z - 1, B.oak_log, AXIS_Z);
      break;
    }
    case 'crystal': {
      const h = rng.int(4, 7);
      for (let i = 0; i < h; i++) w.set(x, y + i, z, B.crystal_block);
      for (let i = 0; i < 6; i++) {
        const dx = rng.int(-1, 1);
        const dz = rng.int(-1, 1);
        w.setSoft(x + dx, y + h - rng.int(0, 2), z + dz, B.crystal_block);
      }
      w.setSoft(x, y + h, z, B.crystal_cluster);
      break;
    }
  }
}

/** Hauteur approximative au-dessus du sol qu'occupe chaque arbre (pour éviter les plafonds). */
export const TREE_MAX_RADIUS = 6;
