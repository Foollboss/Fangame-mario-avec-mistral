/**
 * Souterrains : donjons (salle à générateur de monstres, coffres, pièges, passage secret
 * derrière un mur fissuré) et crypte antique (escalier en colimaçon, grande salle à piliers,
 * Golem antique endormi, cœur antique sur l'autel).
 */
import { SEA_LEVEL } from '../../constants';
import { biomeById } from '../../biomes';
import { Rng } from '../../../util/random';
import type { OverworldGenerator } from '../overworld';
import type { ChunkWriter } from '../writer';
import { DIRS, K, NORTH, SOUTH, EAST, WEST, box, addPiece, newPlan, setIfSolid, chestAt, spawnerAt, rnd3, foundation, clearVegetation, type Box, type StructurePlan } from './common';

const MOBS = ['zombie', 'zombie', 'skeleton', 'spider'];

function forBox(w: ChunkWriter, b: Box, fn: (x: number, z: number) => void): void {
  const x0 = Math.max(b.x0, w.x0);
  const x1 = Math.min(b.x1, w.x0 + 15);
  const z0 = Math.max(b.z0, w.z0);
  const z1 = Math.min(b.z1, w.z0 + 15);
  for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) fn(x, z);
}

/** Direction vers laquelle regarde un coffre posé contre un mur (vers l'intérieur). */
function inward(d: number): number {
  return (d + 2) & 3;
}

// ------------------------------------------------------------------ donjon

export function planDungeon(gen: OverworldGenerator, ax: number, az: number, seed: number): StructurePlan | null {
  const rng = new Rng(seed);
  const hx = rng.pick([2, 3, 4]);
  const hz = rng.pick([2, 3, 4]);
  const y0 = rng.int(12, 46);
  const top = y0 + 5;
  for (const [dx, dz] of [
    [0, 0],
    [-hx - 1, -hz - 1],
    [hx + 1, -hz - 1],
    [-hx - 1, hz + 1],
    [hx + 1, hz + 1],
  ])
    if (gen.groundAt(ax + dx, az + dz) - 6 < top) return null;

  const x0 = ax - hx;
  const x1 = ax + hx;
  const z0 = az - hz;
  const z1 = az + hz;
  const plan = newPlan('dungeon', ax, y0, az);
  const mob = rng.pick(MOBS);
  const mossSeed = seed ^ 0x51ed;

  // Coffres contre les murs (1 ou 2), jamais au même endroit.
  const chests: Array<[number, number, number]> = [];
  const nChests = rng.chance(0.55) ? 2 : 1;
  for (let i = 0; i < nChests; i++) {
    const d = rng.int(0, 3);
    const [dx, dz] = DIRS[d];
    const x = dx > 0 ? x1 : dx < 0 ? x0 : rng.int(x0 + 1, x1 - 1);
    const z = dz > 0 ? z1 : dz < 0 ? z0 : rng.int(z0 + 1, z1 - 1);
    if (chests.some((c) => c[0] === x && c[1] === z) || (x === ax && z === az)) continue;
    chests.push([x, z, inward(d)]);
  }
  // Piège : plaque de pression devant un coffre avec TNT sous le sol, ou fosse à toiles.
  const trapRoll = rng.next();
  let plate: [number, number] | null = null;
  let pit: [number, number] | null = null;
  if (trapRoll < 0.3 && chests.length) {
    const [cx, cz, f] = chests[0];
    const [fx, fz] = DIRS[f];
    const px = cx + fx;
    const pz = cz + fz;
    if (!(px === ax && pz === az)) plate = [px, pz];
  } else if (trapRoll < 0.5) {
    const px = rng.chance(0.5) ? x0 : x1 - 1;
    const pz = rng.chance(0.5) ? z0 + 1 : z1 - 1;
    if (!chests.some((c) => c[0] >= px && c[0] <= px + 1 && c[1] >= pz - 1 && c[1] <= pz)) pit = [px, pz];
  }
  const cobwebs = rng.int(0, 3);
  const webSpots: Array<[number, number]> = [];
  for (let i = 0; i < cobwebs; i++) webSpots.push([rng.chance(0.5) ? x0 : x1, rng.chance(0.5) ? z0 : z1]);

  const room = box(x0 - 1, z0 - 1, x1 + 1, z1 + 1);
  addPiece(plan, room, (w) => {
    forBox(w, room, (x, z) => {
      const wall = x < x0 || x > x1 || z < z0 || z > z1;
      const mix = rnd3(mossSeed, x, 0, z) < 0.45 ? K.mossy_cobblestone : K.cobblestone;
      w.set(x, y0, z, mix);
      for (let y = y0 + 1; y <= y0 + 4; y++) {
        if (wall) setIfSolid(w, x, y, z, rnd3(mossSeed, x, y, z) < 0.35 ? K.mossy_cobblestone : K.cobblestone);
        else w.set(x, y, z, 0);
      }
      setIfSolid(w, x, y0 + 5, z, rnd3(mossSeed, x, 5, z) < 0.3 ? K.mossy_cobblestone : K.cobblestone);
    });
    spawnerAt(w, ax, y0 + 1, az, mob);
    for (const [x, z, f] of chests) chestAt(w, x, y0 + 1, z, f, 'dungeon');
    for (const [x, z] of webSpots) w.set(x, y0 + 4, z, K.cobweb);
    if (plate) {
      const [px, pz] = plate;
      w.set(px, y0 + 1, pz, K.stone_pressure_plate);
      w.set(px, y0, pz, K.cobblestone);
      w.set(px, y0 - 1, pz, K.tnt);
      w.set(px + 1, y0 - 1, pz, K.tnt);
      w.set(px - 1, y0 - 1, pz, K.tnt);
    }
    if (pit) {
      const [px, pz] = pit;
      for (let x = px - 1; x <= px + 2; x++)
        for (let z = pz - 2; z <= pz + 1; z++) {
          const inner = x >= px && x <= px + 1 && z >= pz - 1 && z <= pz;
          for (let y = y0 - 4; y <= y0 - 1; y++) w.set(x, y, z, inner && y > y0 - 4 ? 0 : K.mossy_cobblestone);
          if (inner) {
            w.set(x, y0, z, 0);
            w.set(x, y0 - 3, z, K.cobweb);
            w.set(x, y0 - 4, z, K.bone_block);
          }
        }
    }
  });

  // Passage secret derrière un mur de briques fissurées, menant à une salle au trésor.
  if (rng.chance(0.35)) {
    const d = rng.int(0, 3);
    const [dx, dz] = DIRS[d];
    const [px, pz] = [-dz, dx];
    const wx = dx > 0 ? x1 + 1 : dx < 0 ? x0 - 1 : ax;
    const wz = dz > 0 ? z1 + 1 : dz < 0 ? z0 - 1 : az;
    const L = rng.int(3, 6);
    const at = (i: number, j: number): [number, number] => [wx + dx * i + px * j, wz + dz * i + pz * j];
    const [rcx, rcz] = at(L + 3, 0);
    if (gen.groundAt(rcx, rcz) - 6 >= y0 + 4) {
      const [ax0, az0] = at(0, -3);
      const [ax1, az1] = at(L + 7, 3);
      const area = box(ax0, az0, ax1, az1);
      const lootFacing = (d + 2) & 3;
      addPiece(plan, area, (w) => {
        // Mur fissuré (côté salle)
        const [cx0, cz0] = at(0, 0);
        w.set(cx0, y0 + 1, cz0, K.cracked_stone_bricks);
        w.set(cx0, y0 + 2, cz0, K.cracked_stone_bricks);
        // Couloir
        for (let i = 1; i <= L; i++)
          for (let j = -1; j <= 1; j++) {
            const [x, z] = at(i, j);
            for (let y = y0; y <= y0 + 3; y++) {
              const inner = j === 0 && y > y0 && y < y0 + 3;
              w.set(x, y, z, inner ? 0 : rnd3(seed, x, y, z) < 0.3 ? K.mossy_stone_bricks : K.stone_bricks);
            }
          }
        // Salle secrète 5×5
        for (let i = L + 1; i <= L + 7; i++)
          for (let j = -3; j <= 3; j++) {
            const [x, z] = at(i, j);
            const wall = i === L + 1 || i === L + 7 || j === -3 || j === 3;
            for (let y = y0; y <= y0 + 4; y++) {
              const shell = wall || y === y0 || y === y0 + 4;
              w.set(x, y, z, shell ? (rnd3(seed, x, y, z) < 0.3 ? K.mossy_stone_bricks : rnd3(seed ^ 7, x, y, z) < 0.15 ? K.cracked_stone_bricks : K.stone_bricks) : 0);
            }
          }
        const [ex, ez] = at(L + 1, 0);
        w.set(ex, y0 + 1, ez, 0);
        w.set(ex, y0 + 2, ez, 0);
        const [tx, tz] = at(L + 6, 0);
        chestAt(w, tx, y0 + 1, tz, lootFacing, 'dungeon_boss');
        const [lx, lz] = at(L + 2, 2);
        w.set(lx, y0 + 1, lz, K.lantern);
        const [bx, bz] = at(L + 5, -2);
        w.set(bx, y0 + 1, bz, K.bone_block);
        const [wx2, wz2] = at(L + 6, 2);
        w.set(wx2, y0 + 3, wz2, K.cobweb);
        const [gx, gz] = at(L + 6, -1);
        w.set(gx, y0 + 1, gz, K.gold_block);
      });
    }
  }
  return plan;
}

// ------------------------------------------------------------------ crypte antique

/** Anneau de l'escalier en colimaçon autour du pilier central (sens horaire vu du dessus). */
const RING: Array<[number, number]> = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
];

function dirTo(dx: number, dz: number): number {
  if (dz > 0) return SOUTH;
  if (dx < 0) return WEST;
  if (dz < 0) return NORTH;
  return EAST;
}

function cryptBrick(seed: number, x: number, y: number, z: number): number {
  const r = rnd3(seed, x, y, z);
  return r < 0.4 ? K.ancient_bricks : r < 0.65 ? K.stone_bricks : r < 0.8 ? K.mossy_stone_bricks : r < 0.93 ? K.cracked_stone_bricks : K.cobbled_deepslate;
}

export function planCrypt(gen: OverworldGenerator, ax: number, az: number, seed: number): StructurePlan | null {
  const s = gen.shaper.sample(ax, az);
  const b = biomeById(s.biome);
  if (b.isOcean || b.isRiver || s.river > 0.2 || s.mountain > 0.1) return null;
  const g = Math.floor(s.height);
  if (g < SEA_LEVEL + 2) return null;
  const rng = new Rng(seed);
  const H = rng.int(12, 20);
  if (g - H < 30) return null;
  // Salle : x ∈ [ax-12, ax+12], z ∈ [az+6, az+30]
  const hall = box(ax - 12, az + 6, ax + 12, az + 30);
  for (const [x, z] of [
    [hall.x0, hall.z0],
    [hall.x1, hall.z0],
    [hall.x0, hall.z1],
    [hall.x1, hall.z1],
    [ax, az + 18],
  ])
    if (gen.groundAt(x, z) < H + 18) return null;

  const plan = newPlan('crypt', ax, H + 1, az + 18);
  const bs = seed ^ 0xc0de;
  const hcx = ax;
  const hcz = az + 18;

  // Kiosque d'entrée et puits en colimaçon (5×5 autour de ax, az).
  const shaft = box(ax - 2, az - 2, ax + 2, az + 2);
  addPiece(plan, shaft, (w) => {
    forBox(w, shaft, (x, z) => {
      const lx = x - ax;
      const lz = z - az;
      const edge = Math.abs(lx) === 2 || Math.abs(lz) === 2;
      w.set(x, H, z, K.stone_bricks);
      for (let y = H + 1; y <= g + 3; y++) {
        if (edge) w.set(x, y, z, y > g ? (rnd3(bs, x, y, z) < 0.12 && y === g + 3 ? 0 : K.ancient_bricks) : cryptBrick(bs, x, y, z));
        else if (lx === 0 && lz === 0) w.set(x, y, z, y === g + 3 ? K.chiseled_stone_bricks : K.stone_bricks);
        else w.set(x, y, z, 0);
      }
      w.set(x, g + 4, z, edge ? K.stone_slab : K.chiseled_stone_bricks);
      if (edge) foundation(w, x, g, z, K.stone_bricks, 4);
      clearVegetation(w, x, z, g + 4, g + 20);
    });
    w.set(ax, g + 5, az, K.torch, 0);
    // Porte du kiosque (face nord, à côté de la première marche)
    w.set(ax - 1, g + 1, az - 2, 0);
    w.set(ax - 1, g + 2, az - 2, 0);
    // Marches
    const steps = g - H;
    for (let i = 0; i < steps; i++) {
      const [px, pz] = RING[i % 8];
      const [qx, qz] = RING[(i + 7) % 8];
      w.set(ax + px, g - i, az + pz, K.stone_brick_stairs, dirTo(qx - px, qz - pz));
    }
    // Sortie vers le couloir (mur sud)
    for (let y = H + 1; y <= H + 3; y++) for (let x = ax - 1; x <= ax + 1; x++) w.set(x, y, az + 2, 0);
  });

  // Allée en pente douce devant la porte du kiosque (marches d'un bloc au plus).
  const ramp: Array<[number, number]> = [[az - 3, g]];
  for (let k = 4, h = g; k <= 9; k++) {
    const nat = gen.groundAt(ax - 1, az - k);
    if (nat === h) break;
    h = Math.max(h - 1, Math.min(h + 1, nat));
    ramp.push([az - k, h]);
  }
  const rx = ax - 1;
  addPiece(plan, box(rx, az - 2 - ramp.length, rx, az - 3), (w) => {
    for (const [z, h] of ramp) {
      if (!w.inside(rx, h, z)) continue;
      w.set(rx, h, z, rnd3(bs, rx, h, z) < 0.3 ? K.mossy_stone_bricks : K.stone_bricks);
      foundation(w, rx, h - 1, z, K.cobblestone, 6);
      for (let y = h + 1; y <= h + 3; y++) w.set(rx, y, z, 0);
      clearVegetation(w, rx, z, h + 4, h + 16);
    }
  });

  // Couloir vers la salle
  const corridor = box(ax - 2, az + 3, ax + 2, az + 6);
  addPiece(plan, corridor, (w) => {
    forBox(w, corridor, (x, z) => {
      const side = Math.abs(x - ax) === 2;
      for (let y = H; y <= H + 4; y++) w.set(x, y, z, side || y === H || y === H + 4 ? cryptBrick(bs, x, y, z) : 0);
    });
    w.set(ax - 1, H + 3, az + 4, K.torch, 1 + WEST);
  });

  // Grande salle
  const pillars: Array<[number, number]> = [];
  for (const px of [-6, 6]) for (const pz of [-6, 6]) for (const [ox, oz] of [[0, 0], [1, 0], [0, 1], [1, 1]]) pillars.push([hcx + px + ox - (px > 0 ? 1 : 0), hcz + pz + oz - (pz > 0 ? 1 : 0)]);
  const isPillar = (x: number, z: number) => pillars.some((p) => p[0] === x && p[1] === z);
  const altarZ = hall.z1 - 3;
  const spawnerMob = rng.pick(['skeleton', 'zombie']);
  addPiece(plan, box(hall.x0 - 3, hall.z0, hall.x1 + 3, hall.z1), (w) => {
    forBox(w, hall, (x, z) => {
      const edge = x === hall.x0 || x === hall.x1 || z === hall.z0 || z === hall.z1;
      const rx = x - hcx;
      const rz = z - hcz;
      // Sol : dallage de pierre lisse avec un motif en croix
      w.set(x, H, z, edge ? K.ancient_bricks : rx === 0 || rz === 0 ? K.chiseled_stone_bricks : (rx + rz) % 2 === 0 ? K.smooth_stone : K.stone_bricks);
      for (let y = H + 1; y <= H + 9; y++) {
        if (edge) w.set(x, y, z, cryptBrick(bs, x, y, z));
        else if (isPillar(x, z)) w.set(x, y, z, y === H + 1 || y === H + 9 ? K.chiseled_stone_bricks : K.stone_bricks);
        else w.set(x, y, z, 0);
      }
      const light = !edge && ((rx + 12) % 6 === 0) && ((rz + 12) % 6 === 0) && !isPillar(x, z);
      w.set(x, H + 10, z, light ? K.glowstone : cryptBrick(bs, x, H + 10, z));
    });
    // Ouverture côté couloir
    for (let y = H + 1; y <= H + 3; y++) for (let x = ax - 1; x <= ax + 1; x++) w.set(x, y, hall.z0, 0);
    // Toiles dans les angles
    for (const [x, z] of [
      [hall.x0 + 1, hall.z0 + 1],
      [hall.x1 - 1, hall.z0 + 1],
      [hall.x0 + 1, hall.z1 - 1],
      [hall.x1 - 1, hall.z1 - 1],
    ]) {
      w.set(x, H + 9, z, K.cobweb);
      w.set(x, H + 8, z, K.cobweb);
    }
    // Autel et cœur antique
    for (let x = hcx - 1; x <= hcx + 1; x++) for (let z = altarZ - 1; z <= altarZ; z++) w.set(x, H + 1, z, K.chiseled_stone_bricks);
    w.set(hcx, H + 2, altarZ, K.ancient_core);
    w.set(hcx - 1, H + 2, altarZ - 1, K.lantern);
    w.set(hcx + 1, H + 2, altarZ - 1, K.lantern);
    chestAt(w, hcx - 3, H + 1, hall.z1 - 1, NORTH, 'dungeon_boss');
    chestAt(w, hcx + 3, H + 1, hall.z1 - 1, NORTH, 'dungeon_boss');
    // Alcôves latérales : générateur à l'ouest, coffre à l'est
    for (const side of [-1, 1]) {
      const wx = side < 0 ? hall.x0 : hall.x1;
      for (let i = 0; i <= 3; i++) {
        const x = wx + side * i;
        for (let z = hcz - 2; z <= hcz + 2; z++)
          for (let y = H; y <= H + 4; y++) {
            const inner = i < 3 && Math.abs(z - hcz) < 2 && y > H && y < H + 4;
            w.set(x, y, z, inner ? 0 : cryptBrick(bs, x, y, z));
          }
      }
      if (side < 0) spawnerAt(w, wx - 2, H + 1, hcz, spawnerMob);
      else chestAt(w, wx + 2, H + 1, hcz, WEST, 'dungeon');
    }
  });
  plan.markers.push({ kind: 'boss', id: 'ancient_golem', x: hcx + 0.5, y: H + 1, z: hcz + 0.5, data: { dormant: true, arena: [hcx + 0.5, H + 1, hcz + 0.5] } });
  return plan;
}

/** Boîte « de surface » d'une crypte (son kiosque), utilisée pour éviter les autres structures. */
export function cryptSurface(ax: number, az: number): Box {
  return box(ax - 2, az - 2, ax + 2, az + 2);
}
