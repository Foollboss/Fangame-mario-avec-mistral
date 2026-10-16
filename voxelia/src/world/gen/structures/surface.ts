/**
 * Structures isolées de la Surface : ruines antiques (à l'air libre ou englouties),
 * temple du désert (pyramide à chambre cachée piégée), hutte de sorcière sur pilotis
 * et campements abandonnés (expérience « Drop 3 »).
 */
import { SEA_LEVEL } from '../../constants';
import { biomeById } from '../../biomes';
import { Rng } from '../../../util/random';
import { OW_BIOMES } from '../terrain';
import type { OverworldGenerator } from '../overworld';
import type { ChunkWriter } from '../writer';
import { DIRS, Frame, K, NORTH, SOUTH, EAST, WEST, box, addPiece, newPlan, foundation, clearVegetation, chestAt, rnd3, type Box, type StructurePlan } from './common';

function forBox(w: ChunkWriter, b: Box, fn: (x: number, z: number) => void): void {
  const x0 = Math.max(b.x0, w.x0);
  const x1 = Math.min(b.x1, w.x0 + 15);
  const z0 = Math.max(b.z0, w.z0);
  const z1 = Math.min(b.z1, w.z0 + 15);
  for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) fn(x, z);
}

function corners(b: Box): Array<[number, number]> {
  return [
    [b.x0, b.z0],
    [b.x1, b.z0],
    [b.x0, b.z1],
    [b.x1, b.z1],
    [(b.x0 + b.x1) >> 1, (b.z0 + b.z1) >> 1],
  ];
}

// ------------------------------------------------------------------ ruines

const RUIN_LAND = new Set([
  OW_BIOMES.plains,
  OW_BIOMES.flower_meadow,
  OW_BIOMES.forest,
  OW_BIOMES.birch_forest,
  OW_BIOMES.dark_forest,
  OW_BIOMES.jungle,
  OW_BIOMES.desert,
  OW_BIOMES.savanna,
  OW_BIOMES.taiga,
  OW_BIOMES.snowy_plains,
  OW_BIOMES.snowy_taiga,
  OW_BIOMES.meadow,
  OW_BIOMES.badlands,
  OW_BIOMES.cherry_grove,
  OW_BIOMES.swamp,
  OW_BIOMES.crystal_forest,
  OW_BIOMES.enchanted_forest,
]);
const RUIN_SEA = new Set([OW_BIOMES.ocean, OW_BIOMES.warm_ocean]);
const VINE_BIOMES = new Set([OW_BIOMES.jungle, OW_BIOMES.forest, OW_BIOMES.dark_forest, OW_BIOMES.swamp, OW_BIOMES.enchanted_forest]);

function ruinBlock(seed: number, x: number, y: number, z: number): number {
  const r = rnd3(seed, x, y, z);
  return r < 0.36 ? K.ancient_bricks : r < 0.6 ? K.stone_bricks : r < 0.8 ? K.mossy_stone_bricks : r < 0.95 ? K.cracked_stone_bricks : K.mossy_cobblestone;
}

export function planRuins(gen: OverworldGenerator, ax: number, az: number, seed: number): StructurePlan | null {
  const rng = new Rng(seed);
  const colonnade = rng.chance(0.3);
  const W = colonnade ? 15 : rng.int(9, 15);
  const D = colonnade ? 15 : rng.int(9, 15);
  const foot = box(ax - (W >> 1), az - (D >> 1), ax - (W >> 1) + W - 1, az - (D >> 1) + D - 1);
  const s0 = gen.shaper.sample(ax, az);
  const sunken = RUIN_SEA.has(s0.biome);
  if (!sunken && !RUIN_LAND.has(s0.biome)) return null;
  let mn = 999;
  let mx = -999;
  for (const [x, z] of corners(foot)) {
    const s = gen.shaper.sample(x, z);
    const g = Math.floor(s.height);
    if (s.mountain > 0.14) return null;
    if (sunken ? !RUIN_SEA.has(s.biome) || g < SEA_LEVEL - 14 || g > SEA_LEVEL - 3 : g <= SEA_LEVEL || s.river > 0.25 || biomeById(s.biome).isRiver) return null;
    mn = Math.min(mn, g);
    mx = Math.max(mx, g);
  }
  if (mx - mn > 5) return null;
  const F = mn - (sunken ? 1 : 2);
  const fill = sunken ? K.water : 0;
  const clearTop = sunken ? SEA_LEVEL - 1 : mx + 4;
  const rubble = sunken ? K.gravel : K.dirt;
  const vines = !sunken && VINE_BIOMES.has(s0.biome);
  const bs = seed ^ 0x2a1;
  const plan = newPlan('ruins', ax, F + 1, az);
  const cx = ax;
  const cz = az;

  // Hauteur de mur pseudo-aléatoire mais continue le long du périmètre.
  const phase = rng.range(0, 6.28);
  const freq = rng.range(0.35, 0.8);
  const breach = rng.int(0, 3);
  const wallH = (x: number, z: number, i: number): number => {
    const base = 2.5 + Math.sin(i * freq + phase) * 2 + rnd3(bs, x, 99, z) * 1.5;
    if (rnd3(bs ^ 3, x, 0, z) < 0.12) return 0;
    return Math.max(0, Math.round(base));
  };

  const area = box(foot.x0 - 6, foot.z0 - 6, foot.x1 + 6, foot.z1 + 6);
  // Piliers effondrés hors de l'emprise
  const fallen: Array<{ x: number; z: number; d: number; len: number }> = [];
  for (let i = rng.int(1, 2); i > 0; i--) {
    const d = rng.int(0, 3);
    const [dx, dz] = DIRS[d];
    const sx = dx > 0 ? foot.x1 + 2 : dx < 0 ? foot.x0 - 2 : rng.int(foot.x0, foot.x1);
    const sz = dz > 0 ? foot.z1 + 2 : dz < 0 ? foot.z0 - 2 : rng.int(foot.z0, foot.z1);
    fallen.push({ x: sx, z: sz, d, len: rng.int(3, 4) });
  }
  const chestCorner = rng.int(0, 3);

  addPiece(plan, area, (w) => {
    forBox(w, foot, (x, z) => {
      const lx = x - foot.x0;
      const lz = z - foot.z0;
      const r = colonnade ? Math.hypot(x - cx, z - cz) : 0;
      const inShape = colonnade ? r <= 7.2 : true;
      if (!inShape) return;
      const edge = colonnade ? false : lx === 0 || lz === 0 || lx === W - 1 || lz === D - 1;
      // Sol (avec trous comblés de terre ou de gravier)
      w.set(x, F, z, rnd3(bs, x, F, z) < 0.15 ? rubble : ruinBlock(bs, x, F, z));
      foundation(w, x, F - 1, z, K.stone_bricks, 3);
      for (let y = F + 1; y <= clearTop; y++) w.set(x, y, z, sunken && y <= SEA_LEVEL ? K.water : fill);
      if (!sunken) clearVegetation(w, x, z, clearTop + 1, clearTop + 14);
      if (!edge) {
        // Éboulis
        const rr = rnd3(bs ^ 9, x, 1, z);
        if (rr < 0.14) {
          w.set(x, F + 1, z, rubble);
          if (rr < 0.05) w.set(x, F + 2, z, rubble);
          if (!sunken && rr < 0.09) w.set(x, F + 1 + (rr < 0.05 ? 1 : 0), z, K.grass);
        } else if (!sunken && rr < 0.2) w.set(x, F, z, K.moss_block);
      }
    });
    if (!colonnade) {
      // Murs du périmètre
      let i = 0;
      const perim: Array<[number, number, number]> = [];
      for (let x = foot.x0; x <= foot.x1; x++) perim.push([x, foot.z0, NORTH]);
      for (let z = foot.z0 + 1; z <= foot.z1; z++) perim.push([foot.x1, z, EAST]);
      for (let x = foot.x1 - 1; x >= foot.x0; x--) perim.push([x, foot.z1, SOUTH]);
      for (let z = foot.z1 - 1; z > foot.z0; z--) perim.push([foot.x0, z, WEST]);
      const [bdx, bdz] = DIRS[breach];
      const bx = bdx > 0 ? foot.x1 : bdx < 0 ? foot.x0 : cx;
      const bz = bdz > 0 ? foot.z1 : bdz < 0 ? foot.z0 : cz;
      for (const [x, z, side] of perim) {
        i++;
        const isCorner = (x === foot.x0 || x === foot.x1) && (z === foot.z0 || z === foot.z1);
        const pillar = isCorner || i % 5 === 0;
        let h = pillar ? wallH(x, z, i) + 3 : wallH(x, z, i);
        // Brèche d'entrée au milieu d'un côté
        if (!isCorner && Math.abs(x - bx) + Math.abs(z - bz) <= 1) h = 0;
        for (let y = F + 1; y <= F + h; y++) w.set(x, y, z, pillar && y === F + h && h >= 5 ? K.chiseled_stone_bricks : ruinBlock(bs, x, y, z));
        if (vines && h >= 3) {
          const [dx, dz] = DIRS[side];
          const vx = x + dx;
          const vz = z + dz;
          if (w.inside(vx, F + h, vz) && rnd3(bs ^ 5, x, 7, z) < 0.5)
            for (let y = F + h; y > F + 1; y--) {
              if (w.get(vx, y, vz) !== 0) break;
              w.set(vx, y, vz, K.vine, (side + 2) & 3);
            }
        }
      }
      // Coffre dans un angle intérieur
      const ccx = chestCorner & 1 ? foot.x1 - 1 : foot.x0 + 1;
      const ccz = chestCorner & 2 ? foot.z1 - 1 : foot.z0 + 1;
      w.set(ccx, F + 1, ccz, 0);
      chestAt(w, ccx, F + 1, ccz, chestCorner & 2 ? NORTH : SOUTH, 'ruins');
      if (!sunken) w.set(ccx, F + 2, ccz, K.cobweb);
    } else {
      // Colonnade circulaire autour d'un autel
      const n = 10;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * Math.PI * 2 + phase;
        const x = Math.round(cx + Math.cos(a) * 6);
        const z = Math.round(cz + Math.sin(a) * 6);
        const h = Math.max(1, Math.round(2 + rnd3(bs, x, 3, z) * 6));
        for (let y = F + 1; y <= F + h; y++) w.set(x, y, z, y === F + 1 || (y === F + h && h >= 6) ? K.chiseled_stone_bricks : ruinBlock(bs, x, y, z));
      }
      for (let x = cx - 1; x <= cx + 1; x++) for (let z = cz - 1; z <= cz + 1; z++) w.set(x, F + 1, z, Math.abs(x - cx) + Math.abs(z - cz) === 0 ? K.chiseled_stone_bricks : K.ancient_bricks);
      w.set(cx, F + 2, cz, sunken ? K.sea_lantern : K.lantern);
      chestAt(w, cx, F + 1, cz + 2, SOUTH, 'ruins');
    }
    // Piliers tombés, couchés sur le sol
    for (const p of fallen) {
      const [dx, dz] = DIRS[p.d];
      for (let j = 0; j < p.len; j++) {
        const x = p.x + dx * j;
        const z = p.z + dz * j;
        if (!w.inside(x, 1, z)) continue;
        const g = gen.groundAt(x, z);
        w.set(x, g + 1, z, j === 0 ? K.chiseled_stone_bricks : ruinBlock(bs, x, g + 1, z));
      }
    }
  });
  return plan;
}

// ------------------------------------------------------------------ temple du désert

/** Décalage maximal du temple par rapport à son ancrage (recherche d'un terrain adapté). */
export const TEMPLE_SHIFT = 32;
/** Longueur maximale de la tranchée d'accès devant l'entrée. */
const TEMPLE_APPROACH = 10;
const TEMPLE_SHIFTS: Array<[number, number]> = [
  [0, 0],
  [32, 0],
  [-32, 0],
  [0, 32],
  [0, -32],
  [24, 24],
  [-24, 24],
  [24, -24],
  [-24, -24],
];

/** Altitude du socle si l'emprise 21×21 centrée en (x, z) convient (désert, ni eau ni falaise). */
function templeSite(gen: OverworldGenerator, x: number, z: number): number {
  if (gen.shaper.sample(x, z).biome !== OW_BIOMES.desert) return -1;
  let mn = 999;
  let mx = -999;
  let desert = 0;
  for (const [px, pz] of corners(box(x - 10, z - 10, x + 10, z + 10))) {
    const s = gen.shaper.sample(px, pz);
    const bd = biomeById(s.biome);
    if (bd.isOcean || bd.isRiver || s.mountain > 0.12 || s.river > 0.15) return -1;
    if (s.biome === OW_BIOMES.desert) desert++;
    const g = Math.floor(s.height);
    if (g <= SEA_LEVEL + 1) return -1;
    mn = Math.min(mn, g);
    mx = Math.max(mx, g);
  }
  // Pyramide à demi ensevelie : on tolère des dunes, pas une falaise.
  return desert < 4 || mx - mn > 10 ? -1 : mn;
}

export function planDesertTemple(gen: OverworldGenerator, x: number, z: number, seed: number): StructurePlan | null {
  let mn = -1;
  let ax = x;
  let az = z;
  for (const [dx, dz] of TEMPLE_SHIFTS) {
    mn = templeSite(gen, x + dx, z + dz);
    if (mn >= 0) {
      ax = x + dx;
      az = z + dz;
      break;
    }
  }
  if (mn < 0) return null;
  const foot = box(ax - 10, az - 10, ax + 10, az + 10);
  const rng = new Rng(seed);
  const B0 = mn;
  const rot = rng.int(0, 3);
  const sideChests = [rng.chance(0.55), rng.chance(0.55)];
  const plan = newPlan('desert_temple', ax, B0, az);
  // Approche de l'entrée : tranchée en marches d'un bloc jusqu'au niveau des dunes.
  const probe = new Frame(null as unknown as ChunkWriter, foot.x0, B0, foot.z0, 21, 21, rot);
  const steps: number[] = [0];
  for (let k = 2, h = 0; k <= TEMPLE_APPROACH; k++) {
    const nat = gen.groundAt(probe.wx(10, -k), probe.wz(10, -k)) - B0;
    if (nat === h && k > 4) break;
    h = k <= 4 ? 0 : Math.max(h - 1, Math.min(h + 1, nat));
    steps.push(h);
  }
  const m = 1 + TEMPLE_APPROACH;
  addPiece(plan, box(foot.x0 - m, foot.z0 - m, foot.x1 + m, foot.z1 + m), (w) => {
    const f = new Frame(w, foot.x0, B0, foot.z0, 21, 21, rot);
    // Socle et fondations
    for (let lz = 0; lz < 21; lz++)
      for (let lx = 0; lx < 21; lx++) {
        f.set(lx, 0, lz, K.sandstone);
        f.foundation(lx, -1, lz, K.sandstone, 10);
      }
    // Gradins de la pyramide
    for (let t = 0; t < 5; t++) {
      const a = t * 2;
      const b = 20 - t * 2;
      for (let ly = 1 + t * 3; ly <= 3 + t * 3; ly++)
        for (let lz = a; lz <= b; lz++)
          for (let lx = a; lx <= b; lx++) {
            const edge = lx === a || lz === a || lx === b || lz === b;
            let id = K.sandstone;
            if (edge && ly === 3 + t * 3) id = K.smooth_sandstone;
            else if (edge && ly === 2 + t * 3 && (lx + lz) % 3 === 0) id = K.orange_terracotta;
            f.set(lx, ly, lz, id);
          }
      // Dégage le sable au-dessus de chaque gradin (le reste peut rester enfoui)
      if (t === 4) for (let lz = a; lz <= b; lz++) for (let lx = a; lx <= b; lx++) for (let ly = 16; ly <= 20; ly++) f.set(lx, ly, lz, 0);
    }
    // Sanctuaire au sommet
    for (const [lx, lz] of [
      [8, 8],
      [12, 8],
      [8, 12],
      [12, 12],
    ])
      for (let ly = 16; ly <= 17; ly++) f.set(lx, ly, lz, K.smooth_sandstone);
    f.fill(8, 18, 8, 12, 18, 12, K.stone_slab, 0);
    f.set(10, 16, 10, K.lantern);
    // Grande salle
    f.fill(5, 1, 5, 15, 7, 15, 0);
    for (const [lx, lz] of [
      [7, 7],
      [13, 7],
      [7, 13],
      [13, 13],
    ])
      for (let ly = 1; ly <= 7; ly++) f.set(lx, ly, lz, K.smooth_sandstone);
    for (let lz = 5; lz <= 15; lz++)
      for (let lx = 5; lx <= 15; lx++) {
        const d = Math.max(Math.abs(lx - 10), Math.abs(lz - 10));
        let id = K.smooth_sandstone;
        if (d === 1) id = K.orange_terracotta;
        else if ((lx === 10 || lz === 10) && d >= 2 && d <= 4) id = K.red_terracotta;
        else if (d === 4 && Math.abs(lx - 10) === Math.abs(lz - 10)) id = K.white_terracotta;
        f.set(lx, 0, lz, id);
      }
    f.set(10, 0, 10, K.sandstone); // dalle qui cache le puits
    // Couloir d'entrée, porche et tranchée devant la façade
    f.fill(9, 1, 0, 11, 3, 4, 0);
    steps.forEach((h, i) => {
      const lz = -1 - i;
      for (let lx = 8; lx <= 12; lx++) {
        f.set(lx, h, lz, lx === 10 && i > 0 ? K.smooth_sandstone : K.sand);
        f.foundation(lx, h - 1, lz, K.sandstone, 8);
        for (let ly = h + 1; ly <= h + 5; ly++) f.set(lx, ly, lz, 0);
      }
    });
    for (let ly = 1; ly <= 4; ly++) {
      f.set(8, ly, 0, K.smooth_sandstone);
      f.set(12, ly, 0, K.smooth_sandstone);
    }
    for (let lx = 8; lx <= 12; lx++) f.set(lx, 4, 0, K.orange_terracotta);
    f.torch(7, 3, 6, SOUTH);
    f.torch(13, 3, 6, SOUTH);
    // Salles latérales
    for (const [x0, door, cx, face, i] of [
      [1, 4, 1, EAST, 0],
      [17, 16, 19, WEST, 1],
    ] as Array<[number, number, number, number, number]>) {
      f.fill(x0, 1, 8, x0 + 2, 3, 12, 0);
      f.set(door, 1, 10, 0);
      f.set(door, 2, 10, 0);
      f.set(x0 + 1, 3, 8, K.cobweb);
      f.set(x0 + 1, 1, 12, K.bone_block);
      if (sideChests[i]) f.chest(cx, 1, 10, face, 'desert_temple');
    }
    // Chambre cachée : puits à échelle, coffres, plaque de pression sur TNT.
    for (let lz = 9; lz <= 17; lz++)
      for (let lx = 6; lx <= 14; lx++)
        for (let ly = -13; ly <= -6; ly++) {
          const shell = lx === 6 || lx === 14 || lz === 9 || lz === 17 || ly <= -12 || ly === -6;
          f.set(lx, ly, lz, shell ? (ly === -12 && Math.max(Math.abs(lx - 10), Math.abs(lz - 13)) === 1 ? K.orange_terracotta : K.sandstone) : 0);
        }
    for (let ly = -5; ly <= -1; ly++)
      for (let lz = 9; lz <= 11; lz++) for (let lx = 9; lx <= 11; lx++) f.set(lx, ly, lz, lx === 10 && lz === 10 ? 0 : K.sandstone);
    for (let ly = -11; ly <= -1; ly++) f.ladder(10, ly, 10, NORTH);
    f.set(10, -11, 13, K.stone_pressure_plate);
    for (let lz = 12; lz <= 14; lz++) for (let lx = 9; lx <= 11; lx++) f.set(lx, -13, lz, K.tnt);
    f.chest(7, -11, 13, EAST, 'desert_temple');
    f.chest(13, -11, 13, WEST, 'desert_temple');
  });
  return plan;
}

// ------------------------------------------------------------------ hutte de sorcière

export function planWitchHut(gen: OverworldGenerator, ax: number, az: number, seed: number): StructurePlan | null {
  const s = gen.shaper.sample(ax, az);
  if (s.biome !== OW_BIOMES.swamp || s.mountain > 0.1) return null;
  const foot = box(ax - 4, az - 4, ax + 4, az + 4);
  for (const [x, z] of corners(foot)) {
    const ss = gen.shaper.sample(x, z);
    if (ss.biome !== OW_BIOMES.swamp && ss.biome !== OW_BIOMES.river) return null;
  }
  const rng = new Rng(seed);
  const rot = rng.int(0, 3);
  const G = Math.max(SEA_LEVEL, Math.floor(s.height));
  const P = G + 3;
  const plan = newPlan('witch_hut', ax, P + 1, az);
  // L'emprise tournée reste centrée sur le point d'ancrage.
  const [sx, sz] = Frame.size(7, 9, rot);
  const ox = ax - (sx >> 1);
  const oz = az - (sz >> 1);
  const fr = new Frame(null as unknown as ChunkWriter, ox, P, oz, 7, 9, rot);
  const area = box(ox - 2, oz - 2, ox + sx + 1, oz + sz + 1);
  addPiece(plan, area, (w) => {
    const f = new Frame(w, ox, P, oz, 7, 9, rot);
    // Dégagement (arbres du marais) autour et au-dessus
    for (let lz = -2; lz <= 10; lz++)
      for (let lx = -2; lx <= 8; lx++) {
        f.clearVegetation(lx, lz, -4, 12);
        if (lx >= -1 && lx <= 7 && lz >= -1 && lz <= 9) for (let ly = 1; ly <= 8; ly++) f.set(lx, ly, lz, 0);
      }
    // Pilotis
    for (const [lx, lz] of [
      [0, 0],
      [6, 0],
      [3, 0],
      [0, 3],
      [6, 3],
      [0, 8],
      [6, 8],
    ]) {
      const x = f.wx(lx, lz);
      const z = f.wz(lx, lz);
      if (!w.inside(x, P, z)) continue;
      for (let y = P - 1; y > P - 14 && y > 0; y--) {
        const cur = w.get(x, y, z);
        if (cur !== 0 && cur !== K.water && cur !== K.lily_pad && cur !== K.seagrass && cur !== K.vine) break;
        w.set(x, y, z, K.spruce_log, 0);
      }
      // Lianes sur la face extérieure des poteaux
      if (lx !== 3) {
        const d = lz === 0 ? NORTH : lz === 8 ? SOUTH : lx === 0 ? WEST : EAST;
        const [dx, dz] = DIRS[f.dir(d)];
        const vx = x + dx;
        const vz = z + dz;
        if (w.inside(vx, P, vz) && rnd3(seed, x, 1, z) < 0.7)
          for (let y = P - 1; y > P - 4; y--) {
            if (w.get(vx, y, vz) !== 0) break;
            w.set(vx, y, vz, K.vine, (f.dir(d) + 2) & 3);
          }
      }
    }
    // Plancher, murs, porte, fenêtres
    f.fill(0, 0, 0, 6, 0, 8, K.spruce_planks);
    for (let lz = 3; lz <= 8; lz++)
      for (let lx = 0; lx <= 6; lx++) {
        const edge = lx === 0 || lx === 6 || lz === 3 || lz === 8;
        if (!edge) continue;
        const corner = (lx === 0 || lx === 6) && (lz === 3 || lz === 8);
        for (let ly = 1; ly <= 3; ly++) {
          if (corner) f.log(lx, ly, lz, K.spruce_log, 0);
          else f.set(lx, ly, lz, K.spruce_planks);
        }
      }
    f.door(3, 1, 3, SOUTH);
    f.set(0, 2, 5, K.glass_pane);
    f.set(6, 2, 5, K.glass_pane);
    f.set(3, 2, 8, K.glass_pane);
    // Toit à deux pans
    for (let lz = 2; lz <= 9; lz++) {
      const y = 4 + Math.min(lz - 3, 8 - lz);
      for (let lx = -1; lx <= 7; lx++) f.stairs(lx, y, lz, K.oak_stairs, lz <= 5 ? SOUTH : NORTH);
      if (lz >= 3 && lz <= 8) for (let ly = 4; ly < y; ly++) {
        f.set(0, ly, lz, K.spruce_planks);
        f.set(6, ly, lz, K.spruce_planks);
      }
    }
    // Garde-corps du porche (passage libre au centre pour l'échelle)
    for (let lx = 0; lx <= 6; lx++) if (lx !== 3) f.set(lx, 1, 0, K.oak_fence);
    f.set(0, 1, 1, K.oak_fence);
    f.set(0, 1, 2, K.oak_fence);
    f.set(6, 1, 1, K.oak_fence);
    f.set(6, 1, 2, K.oak_fence);
    // Échelle depuis l'eau, accrochée au pilier central
    {
      const x = f.wx(3, -1);
      const z = f.wz(3, -1);
      if (w.inside(x, P, z)) {
        const bottom = Math.max(1, gen.groundAt(x, z) + 1);
        for (let y = P; y >= bottom; y--) w.set(x, y, z, K.ladder, f.dir(SOUTH));
      }
    }
    // Intérieur : établi, chaudron improvisé, tonneau, coffre, lanterne
    f.set(1, 1, 7, K.crafting_table);
    f.set(1, 2, 7, K.red_mushroom);
    f.set(5, 1, 7, K.mossy_cobblestone);
    f.set(5, 2, 7, K.glow_mushroom);
    f.set(4, 1, 7, K.brown_mushroom);
    f.barrel(5, 1, 4);
    f.chest(1, 1, 4, EAST, 'witch_hut');
    f.set(3, 3, 6, K.lantern);
    f.set(2, 1, 6, K.cobweb);
  });
  const [mx, my, mz] = fr.pos(3, 1, 6);
  plan.markers.push({ kind: 'mob', id: 'witch', x: mx, y: my, z: mz, data: { persistent: true, home: [mx, my, mz] } });
  return plan;
}

// ------------------------------------------------------------------ campement abandonné

const CAMP_BIOMES = new Set([
  OW_BIOMES.forest,
  OW_BIOMES.birch_forest,
  OW_BIOMES.dark_forest,
  OW_BIOMES.taiga,
  OW_BIOMES.snowy_taiga,
  OW_BIOMES.plains,
  OW_BIOMES.flower_meadow,
  OW_BIOMES.meadow,
  OW_BIOMES.cherry_grove,
]);
const TENT_COLORS = [K.white_wool, K.light_gray_wool, K.green_wool, K.brown_wool, K.red_wool, K.blue_wool, K.orange_wool];

export function planCamp(gen: OverworldGenerator, ax: number, az: number, seed: number): StructurePlan | null {
  const s = gen.shaper.sample(ax, az);
  if (!CAMP_BIOMES.has(s.biome) || s.mountain > 0.1 || s.river > 0.15) return null;
  const R = 9;
  let mn = 999;
  let mx = -999;
  for (const [x, z] of corners(box(ax - 7, az - 7, ax + 7, az + 7))) {
    const ss = gen.shaper.sample(x, z);
    const g = Math.floor(ss.height);
    if (g <= SEA_LEVEL || biomeById(ss.biome).isRiver || biomeById(ss.biome).isOcean) return null;
    mn = Math.min(mn, g);
    mx = Math.max(mx, g);
  }
  if (mx - mn > 3) return null;
  const rng = new Rng(seed);
  const g0 = gen.groundAt(ax, az);
  const plan = newPlan('camp', ax, g0 + 1, az);
  const area = box(ax - R, az - R, ax + R, az + R);
  const lit = rng.chance(0.5);
  const log = s.biome === OW_BIOMES.taiga || s.biome === OW_BIOMES.snowy_taiga ? K.spruce_log : K.oak_log;
  const nTents = rng.int(2, 3);
  const base = rng.range(0, Math.PI * 2);
  interface Tent { ox: number; oz: number; oy: number; rot: number; color: number; kind: number }
  const tents: Tent[] = [];
  for (let i = 0; i < nTents; i++) {
    const a = base + (i / nTents) * Math.PI * 2;
    const tx = Math.round(ax + Math.cos(a) * 5.5);
    const tz = Math.round(az + Math.sin(a) * 5.5);
    // La façade (lz = 0) regarde le feu
    const ddx = ax - tx;
    const ddz = az - tz;
    const front = Math.abs(ddx) > Math.abs(ddz) ? (ddx > 0 ? EAST : WEST) : ddz > 0 ? SOUTH : NORTH;
    const rot = (front + 2) & 3;
    const [sx, sz] = Frame.size(5, 4, rot);
    tents.push({ ox: tx - (sx >> 1), oz: tz - (sz >> 1), oy: gen.groundAt(tx, tz), rot, color: rng.pick(TENT_COLORS), kind: i });
  }
  const benches: Array<{ x: number; z: number; axis: number }> = [];
  for (let i = 0; i < nTents; i++) {
    const a = base + ((i + 0.5) / nTents) * Math.PI * 2;
    const bx = Math.round(ax + Math.cos(a) * 3);
    const bz = Math.round(az + Math.sin(a) * 3);
    const along = Math.abs(Math.cos(a)) > Math.abs(Math.sin(a)) ? 2 : 1;
    for (let j = -1; j <= 1; j++) benches.push({ x: bx + (along === 1 ? j : 0), z: bz + (along === 2 ? j : 0), axis: along });
  }
  const props: Array<{ x: number; z: number; kind: 'barrel' | 'table' | 'hay' | 'post' | 'logs' }> = [];
  const used = new Set<string>();
  for (const t of tents) {
    const [sx, sz] = Frame.size(5, 4, t.rot);
    for (let x = t.ox - 1; x <= t.ox + sx; x++) for (let z = t.oz - 1; z <= t.oz + sz; z++) used.add(x + ',' + z);
  }
  for (const b of benches) used.add(b.x + ',' + b.z);
  for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) used.add(ax + dx + ',' + (az + dz));
  for (const kind of ['barrel', 'barrel', 'table', 'hay', 'post', 'post', 'logs'] as const) {
    for (let tries = 0; tries < 6; tries++) {
      const a = rng.range(0, Math.PI * 2);
      const r = rng.range(3, 8);
      const x = Math.round(ax + Math.cos(a) * r);
      const z = Math.round(az + Math.sin(a) * r);
      if (used.has(x + ',' + z) || used.has(x + 1 + ',' + z)) continue;
      used.add(x + ',' + z);
      if (kind === 'logs') used.add(x + 1 + ',' + z);
      props.push({ x, z, kind });
      break;
    }
  }
  const cs = seed ^ 0xca3;
  addPiece(plan, area, (w) => {
    // Clairière
    forBox(w, area, (x, z) => {
      const d2 = (x - ax) * (x - ax) + (z - az) * (z - az);
      if (d2 > R * R) return;
      const g = gen.groundAt(x, z);
      clearVegetation(w, x, z, g + 1, g + 26);
      if (d2 <= 10 && rnd3(cs, x, 0, z) < 0.5) w.set(x, g, z, K.coarse_dirt);
    });
    // Feu de camp (allumé ou éteint)
    if (lit) w.set(ax, g0 + 1, az, K.campfire);
    else {
      w.set(ax, g0, az, K.coal_block);
      for (const [dx, dz] of DIRS) w.set(ax + dx, g0, az + dz, K.cobblestone);
    }
    // Bancs de rondins
    for (const b of benches) {
      if (!w.inside(b.x, 1, b.z)) continue;
      const g = gen.groundAt(b.x, b.z);
      w.set(b.x, g + 1, b.z, log, b.axis);
    }
    // Tentes en laine
    for (const t of tents) {
      const f = new Frame(w, t.ox, t.oy, t.oz, 5, 4, t.rot);
      for (let lz = 0; lz < 4; lz++)
        for (let lx = 0; lx < 5; lx++) {
          f.foundation(lx, 0, lz, K.dirt, 4);
          for (let ly = 1; ly <= 4; ly++) f.set(lx, ly, lz, 0);
        }
      for (let lz = 0; lz < 4; lz++) {
        f.set(0, 1, lz, t.color);
        f.set(4, 1, lz, t.color);
        f.set(1, 2, lz, t.color);
        f.set(3, 2, lz, t.color);
        f.set(2, 3, lz, t.color);
      }
      f.set(1, 1, 3, t.color);
      f.set(2, 1, 3, t.color);
      f.set(3, 1, 3, t.color);
      f.set(2, 2, 3, t.color);
      if (t.kind === 0) {
        f.bed(2, 1, 1, SOUTH);
        f.chest(1, 1, 2, EAST, 'camp');
      } else {
        f.barrel(3, 1, 2, 'camp');
        f.set(1, 1, 1, K.white_carpet);
        if (rnd3(cs, t.ox, 1, t.oz) < 0.6) f.set(2, 2, 2, K.cobweb);
      }
    }
    // Objets éparpillés
    for (const p of props) {
      if (!w.inside(p.x, 1, p.z) && !(p.kind === 'logs' && w.inside(p.x + 1, 1, p.z))) continue;
      const g = gen.groundAt(p.x, p.z);
      switch (p.kind) {
        case 'barrel':
          w.set(p.x, g + 1, p.z, K.barrel, 0);
          w.mark({ kind: 'chest', x: p.x, y: g + 1, z: p.z, id: 'camp' });
          break;
        case 'table':
          w.set(p.x, g + 1, p.z, K.crafting_table);
          break;
        case 'hay':
          w.set(p.x, g + 1, p.z, K.hay_block, 0);
          break;
        case 'post':
          w.set(p.x, g + 1, p.z, K.oak_fence);
          w.set(p.x, g + 2, p.z, lit ? K.lantern : K.oak_fence);
          break;
        case 'logs': {
          w.set(p.x, g + 1, p.z, K.stripped_oak_log, 1);
          const g2 = gen.groundAt(p.x + 1, p.z);
          w.set(p.x + 1, g2 + 1, p.z, K.stripped_oak_log, 1);
          break;
        }
      }
    }
  });
  return plan;
}
