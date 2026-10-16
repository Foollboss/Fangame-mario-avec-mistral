/**
 * Sanctuaire englouti (océan profond) : temple à gradins en pierre des abysses,
 * salles inondées éclairées de lanternes marines, coffres « sanctuary » dans les
 * chambres d'angle et Gardien des profondeurs endormi au centre de la grande salle.
 */
import { SEA_LEVEL } from '../../constants';
import { Rng } from '../../../util/random';
import { OW_BIOMES } from '../terrain';
import type { OverworldGenerator } from '../overworld';
import type { ChunkWriter } from '../writer';
import { Frame, K, NORTH, EAST, WEST, box, addPiece, newPlan, rnd3, type StructurePlan } from './common';

const S = 29;

export function planSanctuary(gen: OverworldGenerator, ax: number, az: number, seed: number): StructurePlan | null {
  const s0 = gen.shaper.sample(ax, az);
  if (s0.biome !== OW_BIOMES.deep_ocean) return null;
  const half = S >> 1;
  let sum = 0;
  let n = 0;
  for (const [dx, dz] of [
    [0, 0],
    [-half, -half],
    [half, -half],
    [-half, half],
    [half, half],
  ]) {
    const s = gen.shaper.sample(ax + dx, az + dz);
    if (s.biome !== OW_BIOMES.deep_ocean && s.biome !== OW_BIOMES.ocean) return null;
    sum += s.height;
    n++;
  }
  const F = Math.round(sum / n);
  if (F + 19 > SEA_LEVEL - 3) return null;
  const rng = new Rng(seed);
  const rot = rng.int(0, 3);
  const ox = ax - half;
  const oz = az - half;
  const emptyRoom = rng.int(0, 3);
  const bs = seed ^ 0x5a7c;
  const plan = newPlan('sanctuary', ax, F + 1, az);
  const stone = (x: number, y: number, z: number) => (rnd3(bs, x, y, z) < 0.12 ? K.mossy_stone_bricks : K.abyss_stone);

  addPiece(plan, box(ox, oz, ox + S - 1, oz + S - 1), (w: ChunkWriter) => {
    const f = new Frame(w, ox, F, oz, S, S, rot);
    for (let lz = 0; lz < S; lz++)
      for (let lx = 0; lx < S; lx++) {
        const x = f.wx(lx, lz);
        const z = f.wz(lx, lz);
        if (!w.inside(x, F, z)) continue;
        // Socle posé sur le fond marin
        for (let y = F - 1; y > F - 10 && y > 0; y--) {
          const cur = w.get(x, y, z);
          if (cur !== 0 && cur !== K.water && cur !== K.kelp && cur !== K.seagrass) break;
          w.set(x, y, z, K.abyss_stone);
        }
        const d = Math.max(Math.abs(lx - 14), Math.abs(lz - 14));
        w.set(x, F, z, d === 0 ? K.sea_lantern : d === 4 ? K.tube_coral_block : d === 9 ? K.brain_coral_block : K.abyss_stone);
        // Tout l'intérieur est inondé ; l'eau au-dessus des toits reste celle de l'océan.
        for (let y = F + 1; y <= F + 20; y++) w.set(x, y, z, K.water);
        const edge1 = lx === 0 || lz === 0 || lx === S - 1 || lz === S - 1;
        const in2 = lx >= 6 && lx <= 22 && lz >= 6 && lz <= 22;
        const edge2 = in2 && (lx === 6 || lz === 6 || lx === 22 || lz === 22);
        const in3 = lx >= 10 && lx <= 18 && lz >= 10 && lz <= 18;
        const edge3 = in3 && (lx === 10 || lz === 10 || lx === 18 || lz === 18);
        const corner1 = (lx === 0 || lx === S - 1) && (lz === 0 || lz === S - 1);
        // Gradin 1 : murs extérieurs, vitraux et lanternes d'angle
        if (edge1)
          for (let ly = 1; ly <= 8; ly++) {
            const winRow = ly === 4 || ly === 5;
            const k = lx === 0 || lx === S - 1 ? lz : lx;
            let id = stone(x, F + ly, z);
            if (corner1 && (ly === 8 || ly === 1)) id = K.sea_lantern;
            else if (winRow && k % 4 === 2) id = K.blue_stained_glass;
            else if (ly === 8) id = K.stone_bricks;
            w.set(x, F + ly, z, id);
          }
        if (!in2 || edge2) w.set(x, F + 9, z, lx % 6 === 2 && lz % 6 === 2 && !edge1 && !in2 ? K.sea_lantern : stone(x, F + 9, z));
        // Mur de la grande salle (sous le gradin 2) et gradin 2
        if (edge2) {
          const k = lx === 6 || lx === 22 ? lz : lx;
          for (let ly = 1; ly <= 14; ly++) {
            const door = ly <= 4 && Math.abs(k - 14) <= 1;
            if (door) continue;
            const win = ly >= 11 && ly <= 12 && k % 4 === 2;
            w.set(x, F + ly, z, win ? K.glass : ly === 14 ? K.stone_bricks : stone(x, F + ly, z));
          }
        }
        if (in2 && (!in3 || edge3)) w.set(x, F + 15, z, stone(x, F + 15, z));
        // Coupole
        if (edge3)
          for (let ly = 16; ly <= 18; ly++) w.set(x, F + ly, z, ly === 17 && (lx + lz) % 2 === 0 ? K.sea_lantern : stone(x, F + ly, z));
        if (in3) w.set(x, F + 19, z, lx >= 13 && lx <= 15 && lz >= 13 && lz <= 15 ? K.glass : stone(x, F + 19, z));
      }
    // Entrée (façade lz = 0)
    f.fill(13, 1, 0, 15, 4, 0, K.water);
    f.set(12, 5, 0, K.sea_lantern);
    f.set(16, 5, 0, K.sea_lantern);
    // Chambres d'angle (5×5) séparées des galeries, coffres dans trois d'entre elles
    const rooms: Array<[number, number]> = [
      [1, 1],
      [23, 1],
      [1, 23],
      [23, 23],
    ];
    rooms.forEach(([rx, rz], i) => {
      const wallX = rx === 1 ? 6 : 22;
      const wallZ = rz === 1 ? 6 : 22;
      for (let k = 0; k < 5; k++)
        for (let ly = 1; ly <= 8; ly++) {
          const door = k === 2 && ly <= 2;
          f.set(wallX, ly, rz + k, door ? K.water : K.abyss_stone);
          f.set(rx + k, ly, wallZ, door ? K.water : K.abyss_stone);
        }
      f.set(rx + 2, 8, rz + 2, K.sea_lantern);
      if (i !== emptyRoom) {
        const cx = rx === 1 ? rx : rx + 4;
        f.chest(cx, 1, rz + 2, rx === 1 ? EAST : WEST, 'sanctuary');
      } else f.set(rx + 2, 1, rz + 2, K.gold_block);
    });
    // Piliers de la grande salle
    for (const [px, pz] of [
      [10, 10],
      [17, 10],
      [10, 17],
      [17, 17],
    ])
      for (let ly = 1; ly <= 14; ly++)
        for (let ox2 = 0; ox2 <= 1; ox2++)
          for (let oz2 = 0; oz2 <= 1; oz2++) f.set(px + ox2, ly, pz + oz2, ly === 7 || ly === 14 ? K.sea_lantern : K.abyss_stone);
    // Autel du cœur antique, au fond de la salle
    f.set(13, 1, 20, K.chiseled_stone_bricks);
    f.set(14, 1, 20, K.chiseled_stone_bricks);
    f.set(15, 1, 20, K.chiseled_stone_bricks);
    f.set(14, 2, 20, K.ancient_core);
    f.set(13, 2, 20, K.sea_lantern);
    f.set(15, 2, 20, K.sea_lantern);
    f.chest(14, 1, 21, NORTH, 'sanctuary');
  });
  const fr = new Frame(null as unknown as ChunkWriter, ox, F, oz, S, S, rot);
  const [bx, by, bz] = fr.pos(14, 6, 14);
  plan.markers.push({ kind: 'boss', id: 'deep_guardian', x: bx, y: by, z: bz, data: { dormant: true, arena: [bx, by, bz] } });
  return plan;
}
