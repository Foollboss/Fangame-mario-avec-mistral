/**
 * Structure des Îles célestes : le temple des nuées, sanctuaire à colonnes posé
 * sur une île, avec son coffre et quelques zéphyrins qui le gardent.
 */
import { S } from './builder';
import type { StructureType } from './types';

const skyTemple: StructureType = {
  id: 'temple_nuees',
  name: 'Temple des nuées',
  aliases: ['sky_temple', 'templo_nubes', 'temple_celeste'],
  dim: 'celeste',
  region: 9,
  salt: 401,
  chance: 0.6,
  radius: 9,
  site(ctx, x, z, rng) {
    if (Math.hypot(x, z) < 60) return null;
    const g = ctx.gen;
    const h = g.surfaceHeight(x, z);
    if (h <= 0) return null;
    for (const [dx, dz] of [
      [-6, -6],
      [6, -6],
      [-6, 6],
      [6, 6],
      [0, 7],
      [7, 0],
      [-7, 0],
      [0, -7],
    ]) {
      const hh = g.surfaceHeight(x + dx, z + dz);
      if (hh <= 0 || Math.abs(hh - h) > 4) return null;
    }
    return { x, y: h, z, rot: rng.int(4), seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const c = (n: string) => b.c(n);
    const brick = c('briques_celestes'),
      stone = c('pierre_celeste'),
      slab = c('briques_celestes_dalle');
    b.clearTrees(-11, -11, 11, 11, -2, 36);
    // parvis en briques et pierres d'aurore, colonnes
    for (let x = -6; x <= 6; x++)
      for (let z = -6; z <= 6; z++) {
        b.clearAbove(x, 1, z, 12);
        b.foundation(x, 0, z, stone, 12);
        const ring = Math.max(Math.abs(x), Math.abs(z));
        b.set(x, 0, z, ring === 6 ? stone : (x + z) % 4 === 0 ? c('pierre_aurore') : brick);
        if (ring <= 5) b.set(x, 1, z, ring === 5 ? slab : 0);
      }
    for (const x of [-4, 4])
      for (const z of [-4, 4]) for (let y = 1; y <= 6; y++) b.set(x, y, z, y === 1 || y === 6 ? brick : stone);
    // toit en gradins : briques, puis dalles, lanterne suspendue au centre
    for (let x = -5; x <= 5; x++)
      for (let z = -5; z <= 5; z++) {
        const ring = Math.max(Math.abs(x), Math.abs(z));
        b.set(x, 7, z, ring === 5 ? slab : brick);
        if (ring <= 3) b.set(x, 8, z, ring === 3 ? slab : brick);
        if (ring <= 1) b.set(x, 9, z, slab);
      }
    b.set(0, 6, 0, c('lanterne_lumirite'));
    // autel central : piédestal d'aurore, coffre, fleurs
    b.set(0, 1, 0, c('pierre_aurore'));
    b.chest(0, 2, 0, S, 'temple_nuees');
    for (const [x, z] of [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2],
    ])
      b.place(x, 1, z, c('fleur_aurore'));
    // nuages accrochés aux bords
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const x = Math.round(Math.cos(a) * 7.5),
        z = Math.round(Math.sin(a) * 7.5);
      if (b.rnd(x, 0, z, 3) < 0.6) b.place(x, -1 - (i % 2), z, c('nuage'));
    }
    b.entity('zephyrin', 0, 10, 0);
    if ((p.seed & 1) === 0) b.entity('zephyrin', 5, 9, -5);
  },
};

export const CELESTE_STRUCTURES: StructureType[] = [skyTemple];
