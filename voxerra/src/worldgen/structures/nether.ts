/**
 * Structures de l'Abîme cendré (forteresse de basalte avec l'autel du Tyran
 * des braises, ruines cendrées) et des Cimes astrales (citadelle du Veilleur,
 * flèches de cristal).
 */
import { Builder, S, W, N, E, DX, DZ } from './builder';
import type { StructureType } from './types';
import { Rng } from '../../engine/rng';

const LAVA_LEVEL = 31;

// ------------------------------------------------------------------ Abîme
function keepRoom(b: Builder): void {
  const c = (n: string, m = 0) => b.c(n, m);
  const R = 7;
  if (!b.touches(-R - 1, -R - 1, R + 1, R + 1, 1)) return;
  const brick = c('briques_basalte');
  for (let x = -R; x <= R; x++)
    for (let z = -R; z <= R; z++) {
      b.foundation(x, 0, z, Math.abs(x) === R || Math.abs(z) === R || (x % 4 === 0 && z % 4 === 0) ? brick : c('basalte'), 60);
      for (let y = 0; y <= 10; y++) {
        const edge = Math.abs(x) === R || Math.abs(z) === R;
        if (y === 0) b.set(x, y, z, c('basalte_poli'));
        else if (y === 10) b.set(x, y, z, edge && (x + z) % 2 === 0 ? brick : 0);
        else if (y === 9) b.set(x, y, z, brick);
        else if (edge) b.set(x, y, z, (y === 3 || y === 4) && Math.abs(x + z) % 3 === 1 ? c('verre_volcanique') : brick);
        else b.set(x, y, z, 0);
      }
    }
  // portes sur les quatre faces
  for (let d = 0; d < 4; d++)
    for (let w = -1; w <= 1; w++)
      for (let y = 1; y <= 3; y++) {
        const px = DX[(d + 1) % 4] * w + DX[d] * R,
          pz = DZ[(d + 1) % 4] * w + DZ[d] * R;
        b.set(px, y, pz, 0);
      }
  // estrade et autel
  b.fill(-1, 1, -1, 1, 1, 1, c('basalte_poli'));
  for (const [x, z, back] of [
    [0, 2, N],
    [0, -2, S],
    [2, 0, W],
    [-2, 0, E],
  ])
    b.stairs(x, 1, z, 'basalte_poli_escalier', back);
  b.set(0, 2, 0, c('autel_braise'));
  for (const [x, z] of [
    [-5, -5],
    [5, -5],
    [-5, 5],
    [5, 5],
  ]) {
    b.set(x, 1, z, c('croute_magma'));
    b.set(x, 2, z, c('lanterne'));
  }
  b.chest(-5, 1, 0, E, 'forteresse');
  b.chest(5, 1, 0, W, 'forteresse');
  b.spawner(0, 1, -5, 'cendreux');
}

const fortress: StructureType = {
  id: 'forteresse',
  name: 'Forteresse de basalte',
  aliases: ['fortress'],
  dim: 'abime',
  region: 14,
  salt: 201,
  chance: 0.85,
  radius: 58,
  site(ctx, x, z, rng) {
    void ctx;
    return { x, y: 54 + rng.int(8), z, rot: 0, seed: rng.nextU32() };
  },
  build(b, p) {
    const rng = new Rng(p.seed);
    const c = (n: string) => b.c(n);
    const brick = c('briques_basalte'),
      rail = c('briques_basalte_muret');
    const arms: { d: number; len: number }[] = [];
    for (let d = 0; d < 4; d++) if (d < 2 || rng.chance(0.7)) arms.push({ d, len: 22 + rng.int(6) * 4 });
    const spawners = ['brasillon', 'cendreux'];
    b.at(p.x, p.y, p.z, 0);
    keepRoom(b);
    for (const a of arms) {
      const px = DX[(a.d + 1) % 4],
        pz = DZ[(a.d + 1) % 4];
      const x0 = DX[a.d] * 8,
        z0 = DZ[a.d] * 8;
      const x1 = DX[a.d] * (8 + a.len),
        z1 = DZ[a.d] * (8 + a.len);
      if (b.touches(Math.min(x0, x1) - 5, Math.min(z0, z1) - 5, Math.max(x0, x1) + 5, Math.max(z0, z1) + 5, 1)) {
        for (let k = 8; k <= 8 + a.len; k++) {
          const covered = Math.floor((k - 8) / 8) % 2 === 1;
          for (let w = -2; w <= 2; w++) {
            const x = DX[a.d] * k + px * w,
              z = DZ[a.d] * k + pz * w;
            if (!b.inside(x, z)) continue;
            b.set(x, 0, z, brick);
            for (let y = 1; y <= 4; y++) b.set(x, y, z, 0);
            if (Math.abs(w) === 2) {
              b.set(x, 1, z, covered ? brick : rail);
              if (covered) {
                b.set(x, 2, z, k % 3 === 0 ? c('verre_volcanique') : brick);
                b.set(x, 3, z, brick);
              }
            }
            if (covered) b.set(x, 4, z, brick);
            // piliers
            if (k % 8 === 4 && Math.abs(w) <= 1) b.foundation(x, 0, z, brick, 60);
          }
          if (k % 6 === 0 && !covered) b.set(DX[a.d] * k + px * 2, 2, DZ[a.d] * k + pz * 2, c('lanterne'));
        }
      }
      // tour d'extrémité
      const tx = DX[a.d] * (8 + a.len + 3),
        tz = DZ[a.d] * (8 + a.len + 3);
      if (b.touches(tx - 4, tz - 4, tx + 4, tz + 4, 1)) {
        for (let x = tx - 3; x <= tx + 3; x++)
          for (let z = tz - 3; z <= tz + 3; z++) {
            const edge = Math.abs(x - tx) === 3 || Math.abs(z - tz) === 3;
            b.foundation(x, 0, z, brick, 60);
            for (let y = 0; y <= 8; y++) {
              if (y === 0 || y === 7) b.set(x, y, z, c('basalte_poli'));
              else if (y === 8) b.set(x, y, z, edge && (x + z) % 2 === 0 ? brick : 0);
              else b.set(x, y, z, edge ? brick : 0);
            }
          }
        for (let w = -1; w <= 1; w++)
          for (let y = 1; y <= 3; y++) b.set(tx - DX[a.d] * 3 + px * w, y, tz - DZ[a.d] * 3 + pz * w, 0);
        b.spawner(tx, 1, tz, spawners[a.d % 2]);
        b.chest(tx + px * 2, 1, tz + pz * 2, a.d, 'forteresse');
        b.set(tx - px * 2, 1, tz - pz * 2, c('lanterne'));
      }
    }
  },
};

const ashRuins: StructureType = {
  id: 'ruines_cendrees',
  name: 'Ruines cendrées',
  aliases: ['avant_poste'],
  dim: 'abime',
  region: 8,
  salt: 202,
  chance: 0.35,
  radius: 7,
  site(ctx, x, z, rng) {
    const y = ctx.gen.surfaceHeight(x, z);
    if (y <= LAVA_LEVEL + 2 || y > 100) return null;
    return { x, y, z, rot: rng.int(4), seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const c = (n: string) => b.c(n);
    for (let x = -4; x <= 4; x++)
      for (let z = -4; z <= 4; z++) {
        const edge = Math.abs(x) === 4 || Math.abs(z) === 4;
        b.foundation(x, 0, z, c('basalte'), 12);
        b.set(x, 0, z, c(b.rnd(x, 0, z) < 0.3 ? 'sable_cendre' : 'briques_basalte'));
        for (let y = 1; y <= 4; y++) {
          if (!edge) b.set(x, y, z, 0);
          else if (y <= 1 + Math.floor(b.rnd(x, 7, z) * 4) && b.keep(x, y, z, 0.85)) b.set(x, y, z, c('briques_basalte'));
          else b.set(x, y, z, 0);
        }
      }
    b.chest(2, 1, -2, S, 'ruines_cendrees');
    b.set(-2, 1, 2, c('soufre'));
    b.set(-2, 1, -2, c('croute_magma'));
    b.entity('cendreux', 0, 1, 0);
  },
};

// ------------------------------------------------------------------ Cimes astrales
const citadel: StructureType = {
  id: 'citadelle',
  name: 'Citadelle astrale',
  aliases: ['citadel'],
  dim: 'astral',
  region: 14,
  salt: 301,
  chance: 0.8,
  radius: 14,
  site(ctx, x, z, rng) {
    if (Math.hypot(x, z) < 160) return null;
    const g = ctx.gen;
    const h = g.surfaceHeight(x, z);
    if (h <= 0) return null;
    for (const [dx, dz] of [
      [-9, -9],
      [9, -9],
      [-9, 9],
      [9, 9],
      [0, 10],
      [10, 0],
      [-10, 0],
      [0, -10],
    ]) {
      const hh = g.surfaceHeight(x + dx, z + dz);
      if (hh <= 0 || Math.abs(hh - h) > 10) return null;
    }
    return { x, y: h, z, rot: rng.int(4), seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const c = (n: string) => b.c(n);
    const brick = c('briques_astrales'),
      stone = c('pierre_astrale');
    for (let x = -11; x <= 11; x++)
      for (let z = -11; z <= 11; z++) {
        const d = Math.hypot(x, z);
        if (d > 11.3) continue;
        b.clearAbove(x, 1, z, 24);
        b.foundation(x, 0, z, stone, 10);
        b.set(x, 0, z, d < 10.5 ? ((x + z) % 3 === 0 ? c('poussiere_etoile') : brick) : stone);
        // rempart circulaire
        if (d >= 9.5 && d < 10.5) {
          const gate = Math.abs(x) <= 1 || Math.abs(z) <= 1;
          for (let y = 1; y <= 4; y++) if (!gate || y === 4) b.set(x, y, z, brick);
          if ((x + z) % 2 === 0) b.set(x, 5, z, brick);
        }
      }
    // donjon central
    for (let y = 1; y <= 10; y++)
      for (let x = -3; x <= 3; x++)
        for (let z = -3; z <= 3; z++) {
          const edge = Math.abs(x) === 3 || Math.abs(z) === 3;
          const corner = Math.abs(x) === 3 && Math.abs(z) === 3;
          if (y === 10) b.set(x, y, z, brick);
          else if (edge) b.set(x, y, z, corner ? stone : y === 5 && (x === 0 || z === 0) ? c('verre') : brick);
          else b.set(x, y, z, 0);
        }
    b.door(0, 1, 3, 'porte_fer', S);
    b.set(0, 1, 4, c('plaque_pression'));
    b.set(0, 1, 2, c('plaque_pression'));
    b.chest(-2, 1, -2, S, 'citadelle');
    b.chest(2, 1, -2, S, 'citadelle');
    b.set(0, 1, -2, c('lanterne_lumirite'));
    for (let y = 1; y <= 9; y++) b.ladder(2, y, 0, E);
    b.set(2, 10, 0, 0);
    // flèche
    for (let k = 0; k < 8; k++) {
      const r = Math.max(0, 2 - Math.floor(k / 3));
      for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) if (Math.abs(x) === r || Math.abs(z) === r || r === 0) b.set(x, 11 + k, z, k % 3 === 2 ? brick : stone);
    }
    b.set(0, 19, 0, c('cristal_astral'));
    b.spawner(-2, 11, 2, 'sentinelle_cristal');
    // autel du Veilleur dans la cour
    b.fill(-1, 1, -8, 1, 1, -6, brick);
    b.set(0, 2, -7, c('autel_veilleur'));
    for (const [x, z] of [
      [-2, -8],
      [2, -8],
    ]) {
      b.set(x, 1, z, stone);
      b.set(x, 2, z, c('lanterne_lumirite'));
    }
    b.entity('sentinelle_cristal', 6, 2, 0);
  },
};

const spire: StructureType = {
  id: 'fleche',
  name: 'Flèche de cristal',
  aliases: ['fleche_cristal'],
  dim: 'astral',
  region: 7,
  salt: 302,
  chance: 0.35,
  radius: 5,
  site(ctx, x, z, rng) {
    const h = ctx.gen.surfaceHeight(x, z);
    if (h <= 0 || Math.hypot(x, z) < 40) return null;
    for (const [dx, dz] of [
      [-3, 0],
      [3, 0],
      [0, 3],
      [0, -3],
    ])
      if (ctx.gen.surfaceHeight(x + dx, z + dz) <= 0) return null;
    return { x, y: h, z, rot: 0, seed: rng.nextU32(), v: 12 + rng.int(10) };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, 0);
    const H = p.v ?? 16;
    const c = (n: string) => b.c(n);
    for (let y = 0; y <= H; y++) {
      const r = 3.2 * (1 - y / (H + 1));
      const ri = Math.ceil(r);
      for (let x = -ri; x <= ri; x++)
        for (let z = -ri; z <= ri; z++) {
          const d = Math.hypot(x, z);
          if (d > r) continue;
          let cell = y % 4 === 3 ? c('briques_astrales') : c('pierre_astrale');
          if (d < r - 1 && b.rnd(x, y, z) < 0.12) cell = c('minerai_etherium');
          b.set(x, y, z, cell);
          if (y === 0) b.foundation(x, 0, z, c('pierre_astrale'), 6);
        }
    }
    b.set(0, H + 1, 0, c('cristal_astral'));
    for (const [x, z] of [
      [-3, 1],
      [2, -3],
      [3, 2],
    ])
      b.place(x, 1, z, c('cristal_astral'));
    if ((p.seed & 1) === 0) b.entity('sentinelle_cristal', 4, 2, 0);
  },
};

export const ABYSS_STRUCTURES: StructureType[] = [fortress, ashRuins];
export const ASTRAL_STRUCTURES: StructureType[] = [citadel, spire];
void W;
