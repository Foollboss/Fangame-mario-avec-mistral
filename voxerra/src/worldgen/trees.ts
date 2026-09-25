/**
 * Arbres et grandes plantes procéduraux. Chaque arbre est entièrement déterminé
 * par sa position (graine locale), ce qui permet de le dessiner morceau par morceau
 * dans chaque colonne qu'il traverse.
 */
import { Rng } from '../engine/rng';
import type { BlockWriter as ChunkBuffer } from './buffer';

export interface TreeBlocks {
  num(id: string): number;
}

type TreeFn = (w: ChunkBuffer, b: TreeBlocks, r: Rng, x: number, y: number, z: number) => void;

function trunk(w: ChunkBuffer, log: number, x: number, y0: number, y1: number, z: number): void {
  for (let y = y0; y <= y1; y++) w.place(x, y, z, log, true);
}

function blob(w: ChunkBuffer, leaf: number, cx: number, cy: number, cz: number, rx: number, ry: number, rz: number, r: Rng, holes = 0.12): void {
  const ix = Math.ceil(rx),
    iy = Math.ceil(ry),
    iz = Math.ceil(rz);
  for (let dy = -iy; dy <= iy; dy++)
    for (let dz = -iz; dz <= iz; dz++)
      for (let dx = -ix; dx <= ix; dx++) {
        const d = (dx * dx) / (rx * rx + 0.01) + (dy * dy) / (ry * ry + 0.01) + (dz * dz) / (rz * rz + 0.01);
        if (d > 1) continue;
        if (d > 0.6 && r.chance(holes)) continue;
        w.place(cx + dx, cy + dy, cz + dz, leaf);
      }
}

function disk(w: ChunkBuffer, leaf: number, cx: number, y: number, cz: number, rad: number, r: Rng, corners = true): void {
  const ir = Math.ceil(rad);
  for (let dz = -ir; dz <= ir; dz++)
    for (let dx = -ir; dx <= ir; dx++) {
      const d = dx * dx + dz * dz;
      if (d > rad * rad + 0.5) continue;
      if (corners && d > rad * rad - 1 && r.chance(0.35)) continue;
      w.place(cx + dx, y, cz + dz, leaf);
    }
}

function vines(w: ChunkBuffer, vine: number, x: number, y: number, z: number, len: number): void {
  for (let k = 0; k < len; k++) {
    const cur = w.getW(x, y - k, z);
    if (cur !== 0) break;
    w.setW(x, y - k, z, vine);
  }
}

function roundTree(log: string, leaf: string, hMin: number, hMax: number): TreeFn {
  return (w, b, r, x, y, z) => {
    const L = b.num(log),
      F = b.num(leaf);
    const h = r.range(hMin, hMax);
    const top = y + h - 1;
    for (let dy = -2; dy <= 1; dy++) {
      const rad = dy >= 0 ? 1 : 2;
      for (let dz = -rad; dz <= rad; dz++)
        for (let dx = -rad; dx <= rad; dx++) {
          if (Math.abs(dx) === rad && Math.abs(dz) === rad && (dy === 1 || r.chance(0.5))) continue;
          w.place(x + dx, top + dy, z + dz, F);
        }
    }
    w.place(x, top + 1, z, F);
    trunk(w, L, x, y, top, z);
  };
}

function bigTree(log: string, leaf: string, hMin: number, hMax: number): TreeFn {
  return (w, b, r, x, y, z) => {
    const L = b.num(log),
      F = b.num(leaf);
    const h = r.range(hMin, hMax);
    const top = y + h;
    const branches = r.range(2, 4);
    for (let i = 0; i < branches; i++) {
      const a = r.next() * Math.PI * 2;
      const by = y + Math.floor(h * r.float(0.45, 0.8));
      const len = r.range(2, 4);
      let bx = x,
        bz = z,
        byy = by;
      for (let k = 1; k <= len; k++) {
        bx = x + Math.round(Math.cos(a) * k);
        bz = z + Math.round(Math.sin(a) * k);
        byy = by + Math.floor(k / 2);
        w.place(bx, byy, bz, L, true);
      }
      blob(w, F, bx, byy + 1, bz, 2.5, 1.8, 2.5, r);
    }
    blob(w, F, x, top, z, 3.2, 2.4, 3.2, r);
    trunk(w, L, x, y, top - 1, z);
  };
}

const TREES: Record<string, TreeFn> = {
  chene: roundTree('buche_chene', 'feuilles_chene', 4, 6),
  bouleau: roundTree('buche_bouleau', 'feuilles_bouleau', 5, 7),
  grand_bouleau: roundTree('buche_bouleau', 'feuilles_bouleau', 8, 11),
  grand_chene: bigTree('buche_chene', 'feuilles_chene', 8, 12),
  teck: (w, b, r, x, y, z) => {
    const L = b.num('buche_teck'),
      F = b.num('feuilles_teck'),
      V = b.num('lianes');
    const h = r.range(7, 11);
    blob(w, F, x, y + h, z, 2.8, 1.6, 2.8, r);
    trunk(w, L, x, y, y + h - 1, z);
    for (let i = 0; i < 4; i++) {
      const vx = x + r.range(-3, 3),
        vz = z + r.range(-3, 3);
      vines(w, V, vx, y + h - 2, vz, r.range(2, 5));
    }
  },
  teck_geant: (w, b, r, x, y, z) => {
    const L = b.num('buche_teck'),
      F = b.num('feuilles_teck'),
      V = b.num('lianes');
    const h = r.range(16, 24);
    for (let dx = 0; dx < 2; dx++) for (let dz = 0; dz < 2; dz++) trunk(w, L, x + dx, y, y + h - 1, z + dz);
    for (let i = 0; i < 3; i++) {
      const by = y + r.range(Math.floor(h * 0.5), h - 4);
      const a = r.next() * Math.PI * 2;
      const ex = x + Math.round(Math.cos(a) * 4),
        ez = z + Math.round(Math.sin(a) * 4);
      w.place(x + Math.round(Math.cos(a) * 2), by, z + Math.round(Math.sin(a) * 2), L, true);
      w.place(ex, by + 1, ez, L, true);
      blob(w, F, ex, by + 2, ez, 2.5, 1.5, 2.5, r);
    }
    blob(w, F, x, y + h, z, 5, 2.5, 5, r, 0.15);
    for (let i = 0; i < 10; i++) {
      const a = r.next() * Math.PI * 2;
      const rad = r.float(3, 5.5);
      vines(w, V, x + Math.round(Math.cos(a) * rad), y + h - 2, z + Math.round(Math.sin(a) * rad), r.range(3, 9));
    }
  },
  buisson_jungle: (w, b, r, x, y, z) => {
    w.place(x, y, z, b.num('buche_teck'), true);
    blob(w, b.num('feuilles_teck'), x, y + 1, z, 2.2, 1.3, 2.2, r, 0.25);
  },
  buisson: (w, b, r, x, y, z) => {
    w.place(x, y, z, b.num('buche_chene'), true);
    blob(w, b.num('feuilles_chene'), x, y + 1, z, 1.6, 1, 1.6, r, 0.3);
  },
  epicea: (w, b, r, x, y, z) => {
    const L = b.num('buche_epicea'),
      F = b.num('feuilles_epicea');
    const h = r.range(7, 11);
    const top = y + h;
    let rad = 1;
    for (let yy = top; yy >= y + 2; yy--) {
      disk(w, F, x, yy, z, rad, r, false);
      rad = rad >= 2 + (h > 9 ? 1 : 0) ? 1 : rad + 1;
    }
    w.place(x, top + 1, z, F);
    trunk(w, L, x, y, top - 1, z);
  },
  grand_epicea: (w, b, r, x, y, z) => {
    const L = b.num('buche_epicea'),
      F = b.num('feuilles_epicea');
    const h = r.range(13, 19);
    const top = y + h;
    for (let yy = top; yy >= y + 4; yy--) {
      const t = (top - yy) / (h - 4);
      const rad = Math.max(0.6, t * 3.4) * ((top - yy) % 3 === 0 ? 0.7 : 1);
      disk(w, F, x, yy, z, rad, r, true);
    }
    w.place(x, top + 1, z, F);
    trunk(w, L, x, y, top - 1, z);
  },
  acacia: (w, b, r, x, y, z) => {
    const L = b.num('buche_acacia'),
      F = b.num('feuilles_acacia');
    const h = r.range(3, 5);
    trunk(w, L, x, y, y + h - 1, z);
    const dir = r.int(4);
    const ddx = [1, -1, 0, 0][dir],
      ddz = [0, 0, 1, -1][dir];
    let tx = x,
      tz = z,
      ty = y + h - 1;
    const bend = r.range(2, 3);
    for (let k = 0; k < bend; k++) {
      tx += ddx;
      tz += ddz;
      ty += 1;
      w.place(tx, ty, tz, L, true);
    }
    disk(w, F, tx, ty + 1, tz, 3.2, r);
    disk(w, F, tx, ty + 2, tz, 1.8, r);
    // seconde ramure
    if (r.chance(0.6)) {
      const ox = x - ddx * 2,
        oz = z - ddz * 2;
      w.place(x - ddx, y + h - 1, z - ddz, L, true);
      w.place(ox, y + h, oz, L, true);
      disk(w, F, ox, y + h + 1, oz, 2.2, r);
    }
  },
  saule: (w, b, r, x, y, z) => {
    const L = b.num('buche_saule'),
      F = b.num('feuilles_saule'),
      V = b.num('lianes');
    const h = r.range(5, 7);
    const top = y + h;
    blob(w, F, x, top, z, 3.3, 1.8, 3.3, r, 0.1);
    for (let dz = -3; dz <= 3; dz++)
      for (let dx = -3; dx <= 3; dx++) {
        const d = dx * dx + dz * dz;
        if (d < 5 || d > 11 || !r.chance(0.55)) continue;
        const len = r.range(1, 4);
        for (let k = 1; k <= len; k++) w.place(x + dx, top - 1 - k, z + dz, F);
        if (r.chance(0.3)) vines(w, V, x + dx, top - 2 - len, z + dz, r.range(1, 3));
      }
    trunk(w, L, x, y, top - 1, z);
  },
  prisme: (w, b, r, x, y, z) => {
    const L = b.num('buche_prisme'),
      F = b.num('feuilles_prisme');
    const h = r.range(5, 8);
    blob(w, F, x, y + h, z, 2.6, 2.6, 2.6, r, 0.2);
    blob(w, F, x, y + h + 2, z, 1.5, 1.5, 1.5, r, 0.1);
    trunk(w, L, x, y, y + h, z);
  },
  champignon_geant: (w, b, r, x, y, z) => {
    const S = b.num('pied_champignon');
    const red = r.chance(0.5);
    const C = b.num(red ? 'chapeau_rouge' : 'chapeau_brun');
    const h = r.range(5, 8);
    trunk(w, S, x, y, y + h - 1, z);
    if (red) {
      for (let dy = 0; dy < 3; dy++) {
        const rad = dy === 2 ? 1.5 : 2.7;
        for (let dz = -3; dz <= 3; dz++)
          for (let dx = -3; dx <= 3; dx++) {
            const d = dx * dx + dz * dz;
            if (d > rad * rad + 0.5) continue;
            if (dy < 2 && d < (rad - 1) * (rad - 1)) continue;
            w.place(x + dx, y + h - 2 + dy, z + dz, C);
          }
      }
    } else disk(w, C, x, y + h, z, 3.6, r, false);
  },
  ardent: (w, b, r, x, y, z) => {
    const S = b.num('tige_ardente'),
      C = b.num('chapeau_ardent');
    const h = r.range(4, 7);
    trunk(w, S, x, y, y + h - 1, z);
    blob(w, C, x, y + h, z, 2.4, 1.4, 2.4, r, 0.2);
  },
  ardent_geant: (w, b, r, x, y, z) => {
    const S = b.num('tige_ardente'),
      C = b.num('chapeau_ardent');
    const h = r.range(9, 15);
    trunk(w, S, x, y, y + h - 1, z);
    trunk(w, S, x + 1, y, y + r.range(2, 5), z);
    blob(w, C, x, y + h, z, 4.5, 2.2, 4.5, r, 0.15);
    for (let i = 0; i < 6; i++) {
      const a = r.next() * Math.PI * 2;
      for (let k = 1; k <= r.range(1, 3); k++) w.place(x + Math.round(Math.cos(a) * 3.5), y + h - 1 - k, z + Math.round(Math.sin(a) * 3.5), C);
    }
  },
  stellaire: (w, b, r, x, y, z) => {
    const L = b.num('bois_stellaire'),
      F = b.num('feuilles_stellaires');
    const h = r.range(5, 8);
    blob(w, F, x, y + h, z, 2.7, 2.2, 2.7, r, 0.2);
    trunk(w, L, x, y, y + h - 1, z);
  },
  grand_stellaire: (w, b, r, x, y, z) => {
    const L = b.num('bois_stellaire'),
      F = b.num('feuilles_stellaires');
    const h = r.range(10, 15);
    for (let k = 0; k < 3; k++) blob(w, F, x, y + h - k * 4, z, 3.4 - k * 0.4 + (k === 1 ? 0.8 : 0), 1.6, 3.4 - k * 0.4 + (k === 1 ? 0.8 : 0), r, 0.2);
    trunk(w, L, x, y, y + h - 1, z);
  },
};

export const TREE_RADIUS = 7;

export function placeTree(type: string, w: ChunkBuffer, b: TreeBlocks, seed: number, x: number, y: number, z: number): void {
  const fn = TREES[type];
  if (!fn) return;
  fn(w, b, new Rng(seed), x, y, z);
}

export const TREE_TYPES = Object.keys(TREES);
