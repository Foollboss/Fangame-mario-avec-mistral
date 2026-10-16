/**
 * Villages : place centrale avec puits, rues qui épousent le relief, lots de bâtiments
 * orientés vers la rue, lampadaires, habitants (métiers liés aux bâtiments) et gardes.
 * Tout le plan est calculé à partir de fonctions pures (graine + hauteur du sol).
 */
import { SEA_LEVEL } from '../../constants';
import { biomeById } from '../../biomes';
import { Rng } from '../../../util/random';
import { OW_BIOMES } from '../terrain';
import type { OverworldGenerator } from '../overworld';
import type { ChunkWriter, GenMarker } from '../writer';
import { Frame, DIRS, K, box, expand, overlaps, union, addPiece, newPlan, foundation, clearVegetation, rnd3, type Box, type StructurePlan } from './common';
import { BUILDINGS, STYLES, WELL_SIZE, buildWell, type BuildingKey, type BuildingType, type StyleKey, type VillageStyle } from './villageBuildings';

/** Rayon maximal d'un village autour de son puits (blocs). */
export const VILLAGE_RADIUS = 64;
/** Décalage maximal du puits par rapport au point d'ancrage (recherche d'une place plane). */
export const VILLAGE_SHIFT = 16;
const PLAZA = 6;
const SHIFTS: Array<[number, number]> = [
  [0, 0],
  [16, 0],
  [-16, 0],
  [0, 16],
  [0, -16],
  [12, 12],
  [-12, 12],
  [12, -12],
  [-12, -12],
];

const STYLE_BY_BIOME = new Map<number, StyleKey>([
  [OW_BIOMES.plains, 'plains'],
  [OW_BIOMES.flower_meadow, 'plains'],
  [OW_BIOMES.meadow, 'plains'],
  [OW_BIOMES.savanna, 'savanna'],
  [OW_BIOMES.desert, 'desert'],
  [OW_BIOMES.taiga, 'taiga'],
  [OW_BIOMES.snowy_plains, 'snowy'],
  [OW_BIOMES.snowy_taiga, 'snowy'],
]);

const GENERIC_JOBS = ['farmer', 'farmer', 'fisherman', 'cartographer', 'butcher', 'librarian'];

interface Street {
  x: number;
  z: number;
  d: number;
  len: number;
  box: Box;
}

interface Lot {
  type: BuildingType;
  frame: Frame;
  /** Emprise + marge + allée (sert aux collisions). */
  area: Box;
}

/** Direction (0 sud, 1 ouest, 2 nord, 3 est) d'un vecteur unitaire. */
function dirOf(dx: number, dz: number): number {
  if (dz > 0) return 0;
  if (dx < 0) return 1;
  if (dz < 0) return 2;
  return 3;
}

/** Hauteur du sol si la colonne est constructible (terre ferme, ni rivière ni montagne), sinon -1. */
function landAt(gen: OverworldGenerator, x: number, z: number): number {
  const s = gen.shaper.sample(x, z);
  const b = biomeById(s.biome);
  if (b.isOcean || b.isRiver || s.river > 0.3 || s.mountain > 0.12) return -1;
  const g = Math.floor(s.height);
  return g <= SEA_LEVEL ? -1 : g;
}

function streetBox(x: number, z: number, d: number, len: number): Box {
  const [dx, dz] = DIRS[d];
  const ex = x + dx * (len - 1);
  const ez = z + dz * (len - 1);
  return dx !== 0 ? box(x, z - 1, ex, ez + 1) : box(x - 1, z, ex + 1, ez);
}

/** Itère les colonnes d'une boîte qui appartiennent au tronçon courant. */
function forColumns(w: ChunkWriter, b: Box, fn: (x: number, z: number) => void): void {
  const x0 = Math.max(b.x0, w.x0);
  const x1 = Math.min(b.x1, w.x0 + 15);
  const z0 = Math.max(b.z0, w.z0);
  const z1 = Math.min(b.z1, w.z0 + 15);
  for (let z = z0; z <= z1; z++) for (let x = x0; x <= x1; x++) fn(x, z);
}

/** Case de rue : revêtement à la hauteur du sol, remblai, dégagement ; ponton au-dessus de l'eau. */
function roadTile(w: ChunkWriter, gen: OverworldGenerator, st: VillageStyle, seed: number, x: number, z: number): void {
  const g = gen.groundAt(x, z);
  if (g < SEA_LEVEL) {
    w.set(x, SEA_LEVEL, z, st.planks);
    for (let y = SEA_LEVEL + 1; y <= SEA_LEVEL + 3; y++) w.set(x, y, z, 0);
    return;
  }
  w.set(x, g, z, rnd3(seed, x, 0, z) < 0.18 ? st.roadAlt : st.road);
  foundation(w, x, g - 1, z, st.fill, 5);
  for (let y = g + 1; y <= g + 3; y++) w.set(x, y, z, 0);
  clearVegetation(w, x, z, g + 4, g + 16);
}

/** Emplacement de la place : biome de village, terre ferme et relief presque plat. */
function plazaSite(gen: OverworldGenerator, cx: number, cz: number): { style: StyleKey; g0: number } | null {
  const s0 = gen.shaper.sample(cx, cz);
  const style = STYLE_BY_BIOME.get(s0.biome);
  if (!style || s0.river > 0.05) return null;
  const g0 = landAt(gen, cx, cz);
  if (g0 < 0) return null;
  let lo = g0;
  let hi = g0;
  for (const [dx, dz] of [
    [-PLAZA, -PLAZA],
    [PLAZA, -PLAZA],
    [-PLAZA, PLAZA],
    [PLAZA, PLAZA],
    [0, -PLAZA],
    [0, PLAZA],
    [-PLAZA, 0],
    [PLAZA, 0],
  ]) {
    const g = landAt(gen, cx + dx, cz + dz);
    if (g < 0) return null;
    lo = Math.min(lo, g);
    hi = Math.max(hi, g);
  }
  return hi - lo > 3 ? null : { style, g0 };
}

export function planVillage(gen: OverworldGenerator, ax: number, az: number, seed: number): StructurePlan | null {
  let site: { style: StyleKey; g0: number } | null = null;
  let cx = ax;
  let cz = az;
  for (const [dx, dz] of SHIFTS) {
    site = plazaSite(gen, ax + dx, az + dz);
    if (site) {
      cx = ax + dx;
      cz = az + dz;
      break;
    }
  }
  if (!site) return null;
  const styleKey = site.style;
  const g0 = site.g0;
  const st = STYLES[styleKey];
  const rng = new Rng(seed);
  const R = VILLAGE_RADIUS;
  const plan = newPlan('village', cx, g0, cz);
  const inVillage = (b: Box) => b.x0 >= cx - R + 1 && b.x1 <= cx + R - 1 && b.z0 >= cz - R + 1 && b.z1 <= cz + R - 1;

  // ---------------------------------------------------------------- rues
  const walk = (x: number, z: number, d: number, maxLen: number): number => {
    const [dx, dz] = DIRS[d];
    let prev = landAt(gen, x, z);
    if (prev < 0) return 0;
    let n = 1;
    for (; n < maxLen; n++) {
      const px = x + dx * n;
      const pz = z + dz * n;
      if (Math.abs(px - cx) > R - 6 || Math.abs(pz - cz) > R - 6) break;
      const g = landAt(gen, px, pz);
      if (g < 0 || Math.abs(g - prev) > 2) break;
      prev = g;
    }
    return n;
  };
  const streets: Street[] = [];
  const dirs = [0, 1, 2, 3];
  if (rng.chance(0.55)) dirs.splice(rng.int(0, 3), 1);
  for (const d of dirs) {
    const [dx, dz] = DIRS[d];
    const sx = cx + dx * (PLAZA + 1);
    const sz = cz + dz * (PLAZA + 1);
    const len = walk(sx, sz, d, rng.int(22, 40));
    if (len >= 8) streets.push({ x: sx, z: sz, d, len, box: streetBox(sx, sz, d, len) });
  }
  if (!streets.length) return null;
  const mains = streets.length;
  for (let i = 0; i < mains; i++) {
    const m = streets[i];
    if (m.len < 18 || !rng.chance(0.65)) continue;
    const at = Math.floor(m.len * rng.range(0.5, 0.85));
    const sides = rng.chance(0.35) ? [1, 3] : [rng.chance(0.5) ? 1 : 3];
    for (const turn of sides) {
      const d = (m.d + turn) & 3;
      const [mx, mz] = DIRS[m.d];
      const [dx, dz] = DIRS[d];
      const bx = m.x + mx * at + dx * 2;
      const bz = m.z + mz * at + dz * 2;
      const len = walk(bx, bz, d, rng.int(10, 22));
      if (len >= 6) streets.push({ x: bx, z: bz, d, len, box: streetBox(bx, bz, d, len) });
    }
  }

  // ---------------------------------------------------------------- programme des bâtiments
  const queue: BuildingKey[] = [];
  const extras: BuildingKey[] = ['smithy', 'farm', 'tower'];
  if (rng.chance(0.6)) extras.push('library');
  if (rng.chance(0.5)) extras.push('chapel');
  if (rng.chance(0.6)) extras.push('stall');
  extras.push(rng.chance(0.5) ? 'farm_large' : 'farm');
  if (rng.chance(0.4)) extras.push('farm');
  const nHouses = rng.int(5, 9);
  const house = (): BuildingKey => {
    const r = rng.next();
    return r < 0.42 ? 'house_small' : r < 0.77 ? 'house_medium' : 'house_large';
  };
  queue.push(house(), house());
  let h = 2;
  for (const e of extras) {
    queue.push(e);
    if (h < nHouses) {
      queue.push(house());
      h++;
    }
  }
  while (h++ < nHouses) queue.push(house());

  // ---------------------------------------------------------------- lots
  const plazaBox = box(cx - PLAZA, cz - PLAZA, cx + PLAZA, cz + PLAZA);
  const blocked: Box[] = [plazaBox, ...streets.map((s) => s.box)];
  const lots: Lot[] = [];

  const tryLot = (street: Street, s: number, side: number, type: BuildingType): Lot | null => {
    const [dx, dz] = DIRS[street.d];
    const nx = side > 0 ? -dz : dz;
    const nz = side > 0 ? dx : -dx;
    const px = street.x + dx * s;
    const pz = street.z + dz * s;
    const rot = (dirOf(-nx, -nz) + 2) & 3;
    const anchor = type.doorX >= 0 ? type.doorX : Math.floor(type.W / 2);
    const off = 2 + type.gap;
    const probe = new Frame(null as unknown as ChunkWriter, 0, 0, 0, type.W, type.D, rot);
    const ox = px + nx * off - probe.wx(anchor, 0);
    const oz = pz + nz * off - probe.wz(anchor, 0);
    const f0 = new Frame(null as unknown as ChunkWriter, ox, 0, oz, type.W, type.D, rot);
    const foot = f0.box();
    let area = expand(foot, 1);
    if (type.doorX >= 0) for (let i = 1; i <= type.gap; i++) area = union(area, box(f0.wx(anchor, -i), f0.wz(anchor, -i), f0.wx(anchor, -i), f0.wz(anchor, -i)));
    if (!inVillage(area)) return null;
    for (const b of blocked) if (overlaps(area, b)) return null;
    for (const l of lots) if (overlaps(area, l.area)) return null;
    // Relief : coins et centre de l'emprise
    let sum = 0;
    let mn = 999;
    let mx = -999;
    const pts: Array<[number, number]> = [
      [foot.x0, foot.z0],
      [foot.x1, foot.z0],
      [foot.x0, foot.z1],
      [foot.x1, foot.z1],
      [(foot.x0 + foot.x1) >> 1, (foot.z0 + foot.z1) >> 1],
    ];
    for (const [x, z] of pts) {
      const g = landAt(gen, x, z);
      if (g < 0) return null;
      sum += g;
      mn = Math.min(mn, g);
      mx = Math.max(mx, g);
    }
    if (mx - mn > type.maxSlope) return null;
    const floorY = Math.round(sum / pts.length);
    if (type.doorX >= 0) {
      const g = landAt(gen, f0.wx(anchor, -type.gap), f0.wz(anchor, -type.gap));
      if (g < 0 || Math.abs(g - floorY) > 2) return null;
    }
    return { type, frame: new Frame(null as unknown as ChunkWriter, ox, floorY, oz, type.W, type.D, rot), area };
  };

  for (const street of streets) {
    const cursor = [1, 1];
    let guard = 0;
    while (queue.length && guard++ < 60) {
      const side = cursor[0] <= cursor[1] ? 0 : 1;
      const c = cursor[side];
      if (c >= street.len - 2) {
        if (cursor[1 - side] >= street.len - 2) break;
        cursor[side] = 999;
        continue;
      }
      let placed: Lot | null = null;
      for (let qi = 0; qi < Math.min(3, queue.length) && !placed; qi++) {
        const type = BUILDINGS[queue[qi]];
        const along = (type.W >> 1) + 1;
        const lot = tryLot(street, c + along, side === 0 ? 1 : -1, type);
        if (lot) {
          placed = lot;
          queue.splice(qi, 1);
          cursor[side] = c + along + type.W - (type.W >> 1) + rng.int(1, 2);
        }
      }
      if (placed) lots.push(placed);
      else cursor[side] += 2;
    }
  }
  const houseCount = lots.filter((l) => l.type.isHouse).length;
  if (houseCount < 4) return null;

  // ---------------------------------------------------------------- pièces : place, rues, puits
  addPiece(plan, plazaBox, (w) => forColumns(w, plazaBox, (x, z) => roadTile(w, gen, st, seed, x, z)));
  for (const s of streets) addPiece(plan, s.box, (w) => forColumns(w, s.box, (x, z) => roadTile(w, gen, st, seed, x, z)));
  const half = WELL_SIZE >> 1;
  addPiece(plan, box(cx - half, cz - half, cx + half, cz + half), (w) => {
    buildWell(new Frame(w, cx - half, g0, cz - half, WELL_SIZE, WELL_SIZE, 0), st);
  });

  // ---------------------------------------------------------------- pièces : bâtiments
  lots.forEach((lot, i) => {
    const t = lot.type;
    const { ox, oy, oz, rot } = lot.frame;
    const lotSeed = (seed ^ Math.imul(i + 1, 0x9e3779b1)) >>> 0;
    addPiece(plan, lot.area, (w) => {
      const f = new Frame(w, ox, oy, oz, t.W, t.D, rot);
      // Terrasse : dégage l'emprise + une case de marge, remblaie dessous.
      for (let lz = -1; lz <= t.D; lz++)
        for (let lx = -1; lx <= t.W; lx++) {
          const x = f.wx(lx, lz);
          const z = f.wz(lx, lz);
          if (!w.inside(x, oy, z)) continue;
          clearVegetation(w, x, z, oy + 1, oy + t.height + 10);
          for (let y = oy + 1; y <= oy + t.height + 2; y++) w.set(x, y, z, 0);
          const margin = lx < 0 || lz < 0 || lx >= t.W || lz >= t.D;
          if (margin) {
            w.set(x, oy, z, st.ground);
            foundation(w, x, oy - 1, z, st.fill, 8);
          } else foundation(w, x, oy - 1, z, st.base, 14);
        }
      t.build(f, st, new Rng(lotSeed));
      // Perron et allée jusqu'à la rue
      if (t.doorX >= 0) {
        f.set(t.doorX, 0, -1, t.key === 'stall' ? st.planks : st.base);
        for (let i2 = 2; i2 <= t.gap; i2++) {
          const x = f.wx(t.doorX, -i2);
          const z = f.wz(t.doorX, -i2);
          if (!w.inside(x, oy, z)) continue;
          const g = Math.max(oy - 1, Math.min(oy + 1, gen.groundAt(x, z)));
          w.set(x, g, z, st.road);
          foundation(w, x, g - 1, z, st.fill, 6);
          for (let y = g + 1; y <= g + 3; y++) w.set(x, y, z, 0);
        }
      }
    });
  });

  // ---------------------------------------------------------------- lampadaires
  const lampAt = (x: number, z: number) => {
    const g = gen.groundAt(x, z);
    if (g < SEA_LEVEL) return;
    addPiece(plan, box(x, z, x, z), (w) => {
      if (!w.inside(x, g, z)) return;
      foundation(w, x, g - 1, z, st.fill, 5);
      if (st.stonePosts) {
        w.set(x, g + 1, z, st.base);
        w.set(x, g + 2, z, st.base);
        w.set(x, g + 3, z, K.torch, 0);
      } else {
        w.set(x, g + 1, z, K.oak_fence);
        w.set(x, g + 2, z, K.oak_fence);
        w.set(x, g + 3, z, K.lantern);
      }
    });
  };
  for (const [dx, dz] of [
    [-PLAZA, -PLAZA],
    [PLAZA, -PLAZA],
    [-PLAZA, PLAZA],
    [PLAZA, PLAZA],
  ])
    lampAt(cx + dx, cz + dz);
  for (const s of streets) {
    const [dx, dz] = DIRS[s.d];
    let side = 1;
    for (let i = 5; i < s.len; i += 11) {
      const x = s.x + dx * i + -dz * 2 * side;
      const z = s.z + dz * i + dx * 2 * side;
      side = -side;
      const b = box(x, z, x, z);
      if (blocked.some((bb) => overlaps(b, bb)) || lots.some((l) => overlaps(b, l.area))) continue;
      lampAt(x, z);
    }
  }

  // ---------------------------------------------------------------- habitants et gardes
  const center: [number, number, number] = [cx + 0.5, g0 + 1, cz + 0.5];
  const beds: Array<{ home: [number, number, number]; spot: [number, number, number] }> = [];
  const workers: Array<{ job: string; spot: [number, number, number] }> = [];
  let towerTop: [number, number, number] | null = null;
  for (const lot of lots) {
    const t = lot.type;
    const f = lot.frame;
    const at = (i: number) => {
      const [sx, sz] = t.spots[i % t.spots.length];
      return f.pos(sx, t.spotY, sz);
    };
    t.beds.forEach(([bx, bz], i) => beds.push({ home: f.pos(bx, 1, bz), spot: at(i) }));
    if (t.work) workers.push({ job: t.work, spot: at(0) });
    if (t.key === 'tower') towerTop = at(0);
  }
  const markers: GenMarker[] = plan.markers;
  // Une case distincte par habitant : le jeu ne crée qu'une entité par marqueur et par bloc.
  const used = new Set<string>();
  const villager = (job: string, at: [number, number, number], home: [number, number, number]) => {
    const key = Math.floor(at[0]) + ',' + Math.floor(at[1]) + ',' + Math.floor(at[2]);
    if (used.has(key)) return;
    used.add(key);
    markers.push({ kind: 'villager', id: 'villager', x: at[0], y: at[1], z: at[2], data: { profession: job, home, center } });
  };
  for (const wk of workers) {
    const bed = beds.shift();
    villager(wk.job, wk.spot, bed ? bed.home : wk.spot);
  }
  for (const bed of beds) {
    if (used.size >= 12) break;
    villager(rng.pick(GENERIC_JOBS), bed.spot, bed.home);
  }
  const guardAt = (x: number, z: number): [number, number, number] => [x + 0.5, gen.groundAt(x, z) + 1, z + 0.5];
  const g1 = guardAt(cx + 3, cz + 3);
  markers.push({ kind: 'mob', id: 'village_guard', x: g1[0], y: g1[1], z: g1[2], data: { persistent: true, home: center } });
  if (towerTop || streets.length >= 3) {
    const g2 = towerTop ?? guardAt(cx - 3, cz - 3);
    markers.push({ kind: 'mob', id: 'village_guard', x: g2[0], y: g2[1], z: g2[2], data: { persistent: true, home: center } });
  }
  return plan;
}
