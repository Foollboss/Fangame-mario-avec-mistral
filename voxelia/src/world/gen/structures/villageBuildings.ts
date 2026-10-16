/**
 * Bâtiments de village : maisons (3 tailles), forge, bibliothèque, chapelle, étal,
 * tour de guet, fermes et puits. Chaque bâtiment est décrit dans un repère local
 * (façade en lz = 0, porte vers la rue) puis tourné par le Frame.
 */
import { Rng } from '../../../util/random';
import { Frame, K, NORTH, SOUTH, EAST, WEST } from './common';

export type StyleKey = 'plains' | 'savanna' | 'desert' | 'taiga' | 'snowy';

/** Matériaux d'un village selon le biome. */
export interface VillageStyle {
  key: StyleKey;
  planks: number;
  log: number;
  /** Soubassement, murs de pierre (forge, chapelle, tour) et fondations. */
  base: number;
  floor: number;
  wall: number;
  corner: number;
  /** true : coins en bûches (axe vertical). */
  cornerIsLog: boolean;
  roof: 'gable' | 'flat' | 'stepped';
  roofStairs: number;
  roofSlab: number;
  roofBlock: number;
  road: number;
  roadAlt: number;
  /** Bloc de surface des terrasses et bloc de remblai. */
  ground: number;
  fill: number;
  /** Lampadaire : poteau de barrières + lanterne, ou poteau de pierre + torche. */
  stonePosts: boolean;
}

export const STYLES: Record<StyleKey, VillageStyle> = {
  plains: {
    key: 'plains',
    planks: K.oak_planks,
    log: K.oak_log,
    base: K.cobblestone,
    floor: K.oak_planks,
    wall: K.oak_planks,
    corner: K.oak_log,
    cornerIsLog: true,
    roof: 'gable',
    roofStairs: K.oak_stairs,
    roofSlab: K.oak_slab,
    roofBlock: K.oak_planks,
    road: K.dirt_path,
    roadAlt: K.gravel,
    ground: K.grass,
    fill: K.dirt,
    stonePosts: false,
  },
  taiga: {
    key: 'taiga',
    planks: K.spruce_planks,
    log: K.spruce_log,
    base: K.cobblestone,
    floor: K.spruce_planks,
    wall: K.spruce_planks,
    corner: K.spruce_log,
    cornerIsLog: true,
    roof: 'gable',
    roofStairs: K.cobblestone_stairs,
    roofSlab: K.cobblestone_slab,
    roofBlock: K.cobblestone,
    road: K.dirt_path,
    roadAlt: K.coarse_dirt,
    ground: K.grass,
    fill: K.dirt,
    stonePosts: false,
  },
  snowy: {
    key: 'snowy',
    planks: K.spruce_planks,
    log: K.spruce_log,
    base: K.stone_bricks,
    floor: K.spruce_planks,
    wall: K.spruce_planks,
    corner: K.stripped_oak_log,
    cornerIsLog: true,
    roof: 'gable',
    roofStairs: K.stone_brick_stairs,
    roofSlab: K.stone_slab,
    roofBlock: K.stone_bricks,
    road: K.dirt_path,
    roadAlt: K.gravel,
    ground: K.grass,
    fill: K.dirt,
    stonePosts: true,
  },
  savanna: {
    key: 'savanna',
    planks: K.acacia_planks,
    log: K.acacia_log,
    base: K.cobblestone,
    floor: K.acacia_planks,
    wall: K.acacia_planks,
    corner: K.acacia_log,
    cornerIsLog: true,
    roof: 'stepped',
    roofStairs: K.oak_stairs,
    roofSlab: K.oak_slab,
    roofBlock: K.hay_block,
    road: K.dirt_path,
    roadAlt: K.coarse_dirt,
    ground: K.grass,
    fill: K.dirt,
    stonePosts: false,
  },
  desert: {
    key: 'desert',
    planks: K.smooth_sandstone,
    log: K.sandstone,
    base: K.sandstone,
    floor: K.smooth_sandstone,
    wall: K.sandstone,
    corner: K.smooth_sandstone,
    cornerIsLog: false,
    roof: 'flat',
    roofStairs: K.oak_stairs,
    roofSlab: K.stone_slab,
    roofBlock: K.smooth_sandstone,
    road: K.smooth_sandstone,
    roadAlt: K.sandstone,
    ground: K.sand,
    fill: K.sandstone,
    stonePosts: true,
  },
};

/** Point local [lx, lz] (+ direction pour un lit : vers la tête). */
export type LocalSpot = [number, number];
export type LocalBed = [number, number, number];

export interface BuildingType {
  key: string;
  W: number;
  D: number;
  /** Colonne de la porte en façade (-1 : pas de porte ni d'allée). */
  doorX: number;
  /** Hauteur à dégager au-dessus du plancher (murs + toit). */
  height: number;
  /** Nombre de cases entre le bord de la rue et la façade. */
  gap: number;
  /** Écart d'altitude maximal accepté sur l'emprise. */
  maxSlope: number;
  beds: LocalBed[];
  /** Où se tiennent les habitants / le travailleur (une case libre distincte par lit). */
  spots: LocalSpot[];
  /** Hauteur du point d'apparition au-dessus du plancher. */
  spotY: number;
  work?: string;
  isHouse?: boolean;
  build(f: Frame, s: VillageStyle, rng: Rng): void;
}

// ------------------------------------------------------------------ éléments génériques

/** Plancher, murs (coins en bûches) et intérieur vide. */
function shell(f: Frame, s: VillageStyle, wallH: number, wall = s.wall, floor = s.floor, base = s.base): void {
  const { W, D } = f;
  for (let lz = 0; lz < D; lz++)
    for (let lx = 0; lx < W; lx++) {
      const edge = lx === 0 || lz === 0 || lx === W - 1 || lz === D - 1;
      f.set(lx, 0, lz, edge ? base : floor);
      if (!edge) continue;
      const corner = (lx === 0 || lx === W - 1) && (lz === 0 || lz === D - 1);
      for (let ly = 1; ly <= wallH; ly++) {
        if (corner) {
          if (s.cornerIsLog) f.log(lx, ly, lz, s.corner, 0);
          else f.set(lx, ly, lz, s.corner);
        } else f.set(lx, ly, lz, wall);
      }
    }
}

/** Toit au faîtage parallèle à X local (pignons en lx = 0 et lx = W-1). */
function roof(f: Frame, s: VillageStyle, top: number, mode = s.roof): void {
  const { W, D } = f;
  if (mode === 'flat') {
    f.fill(0, top + 1, 0, W - 1, top + 1, D - 1, s.roofBlock);
    // Parapet crénelé
    for (let lx = 0; lx < W; lx++)
      for (let lz = 0; lz < D; lz++) {
        const edge = lx === 0 || lz === 0 || lx === W - 1 || lz === D - 1;
        if (edge && (lx + lz) % 2 === 0) f.set(lx, top + 2, lz, s.wall);
      }
    return;
  }
  const mid = (D - 1) / 2;
  for (let lz = -1; lz <= D; lz++) {
    const h = Math.min(lz, D - 1 - lz);
    const y = top + 1 + h;
    for (let lx = -1; lx <= W; lx++) {
      if (mode === 'stepped') f.set(lx, y, lz, s.roofBlock);
      else if (lz === mid) f.set(lx, y, lz, s.roofSlab, 0);
      else f.stairs(lx, y, lz, s.roofStairs, lz < mid ? SOUTH : NORTH);
    }
    // Pignons
    if (lz >= 0 && lz < D) for (let yy = top + 1; yy < y; yy++) {
      f.set(0, yy, lz, s.wall);
      f.set(W - 1, yy, lz, s.wall);
    }
  }
}

function roofHeight(D: number, mode: VillageStyle['roof']): number {
  return mode === 'flat' ? 2 : Math.floor((D - 1) / 2) + 1;
}

function windows(f: Frame, list: Array<[number, number, number]>, id = K.glass_pane): void {
  for (const [lx, ly, lz] of list) f.set(lx, ly, lz, id);
}

// ------------------------------------------------------------------ maisons

const houseSmall: BuildingType = {
  key: 'house_small',
  W: 5,
  D: 5,
  doorX: 2,
  height: 3 + 4,
  gap: 2,
  maxSlope: 3,
  beds: [[1, 2, SOUTH]],
  spots: [[2, 2]],
  spotY: 1,
  isHouse: true,
  build(f, s, rng) {
    shell(f, s, 3);
    roof(f, s, 3);
    f.door(2, 1, 0, SOUTH);
    windows(f, [
      [0, 2, 2],
      [4, 2, 2],
      [2, 2, 4],
    ]);
    f.bed(1, 1, 2, SOUTH);
    f.set(3, 1, 3, K.crafting_table);
    if (rng.chance(0.5)) f.barrel(3, 1, 2, 'village_house');
    f.torch(3, 2, 1, EAST);
  },
};

const houseMedium: BuildingType = {
  key: 'house_medium',
  W: 7,
  D: 6,
  doorX: 3,
  height: 3 + 4,
  gap: 2,
  maxSlope: 3,
  beds: [
    [1, 3, SOUTH],
    [2, 3, SOUTH],
  ],
  spots: [
    [3, 3],
    [4, 2],
  ],
  spotY: 1,
  isHouse: true,
  build(f, s, rng) {
    shell(f, s, 3);
    roof(f, s, 3);
    f.door(3, 1, 0, SOUTH);
    windows(f, [
      [0, 2, 2],
      [0, 2, 3],
      [6, 2, 2],
      [6, 2, 3],
      [2, 2, 5],
      [4, 2, 5],
      [1, 2, 0],
      [5, 2, 0],
    ]);
    f.bed(1, 1, 3, SOUTH);
    f.bed(2, 1, 3, SOUTH);
    f.chest(5, 1, 4, NORTH, 'village_house');
    f.facingBlock(5, 1, 3, K.furnace, WEST);
    f.set(5, 1, 1, K.crafting_table);
    const carpet = rng.pick([K.red_carpet, K.blue_carpet, K.white_carpet]);
    f.set(3, 1, 2, carpet);
    f.set(3, 1, 3, carpet);
    f.torch(1, 2, 1, WEST);
    f.torch(5, 2, 1, EAST);
  },
};

const houseLarge: BuildingType = {
  key: 'house_large',
  W: 9,
  D: 7,
  doorX: 4,
  height: 4 + 5,
  gap: 2,
  maxSlope: 3,
  beds: [
    [1, 4, SOUTH],
    [2, 4, SOUTH],
  ],
  spots: [
    [4, 2],
    [3, 4],
  ],
  spotY: 1,
  isHouse: true,
  build(f, s, rng) {
    shell(f, s, 4);
    // Soubassement en pierre sur la première rangée
    if (s.key !== 'desert') for (let lx = 1; lx < 8; lx++) {
      f.set(lx, 1, 0, s.base);
      f.set(lx, 1, 6, s.base);
    }
    roof(f, s, 4);
    f.door(4, 1, 0, SOUTH);
    windows(f, [
      [0, 2, 2],
      [0, 2, 4],
      [8, 2, 2],
      [8, 2, 4],
      [3, 2, 6],
      [5, 2, 6],
      [2, 2, 0],
      [6, 2, 0],
      [0, 3, 3],
    ]);
    f.bed(1, 1, 4, SOUTH);
    f.bed(2, 1, 4, SOUTH);
    f.chest(6, 1, 5, NORTH, 'village_house');
    f.set(7, 1, 5, K.bookshelf);
    f.set(7, 2, 5, K.bookshelf);
    f.set(7, 1, 1, K.crafting_table);
    f.facingBlock(7, 1, 2, K.furnace, WEST);
    f.set(4, 1, 3, K.oak_fence);
    f.set(4, 2, 3, rng.chance(0.5) ? K.white_carpet : K.red_carpet);
    f.set(4, 4, 3, K.lantern);
    f.torch(1, 2, 1, NORTH);
    f.torch(7, 3, 3, EAST);
  },
};

// ------------------------------------------------------------------ bâtiments de métier

const smithy: BuildingType = {
  key: 'smithy',
  W: 9,
  D: 7,
  doorX: 2,
  height: 4 + 7,
  gap: 2,
  maxSlope: 3,
  beds: [],
  spots: [[4, 3]],
  spotY: 1,
  work: 'smith',
  build(f, s) {
    shell(f, s, 4, s.wall, K.cobblestone, s.base);
    for (let lx = 1; lx < 8; lx++) {
      f.set(lx, 1, 0, s.base);
      f.set(lx, 1, 6, s.base);
    }
    for (let lz = 1; lz < 6; lz++) {
      f.set(0, 1, lz, s.base);
      f.set(8, 1, lz, s.base);
    }
    roof(f, s, 4);
    f.door(2, 1, 0, SOUTH);
    // Comptoir ouvert sur la rue
    for (const lx of [6, 7]) {
      f.set(lx, 1, 0, K.oak_fence);
      f.set(lx, 2, 0, 0);
    }
    windows(f, [
      [0, 2, 2],
      [0, 2, 4],
      [8, 2, 2],
      [8, 2, 4],
      [3, 2, 6],
    ]);
    // Forge : deux fours sous une hotte de briques, cheminée qui traverse le toit
    f.facingBlock(6, 1, 5, K.furnace, NORTH);
    f.facingBlock(7, 1, 5, K.furnace, NORTH);
    for (let ly = 2; ly <= 4; ly++) {
      f.set(6, ly, 5, K.bricks);
      f.set(7, ly, 5, K.bricks);
    }
    for (let ly = 5; ly <= 10; ly++) f.set(7, ly, 6, K.bricks);
    f.set(6, 1, 2, K.iron_block);
    f.chest(1, 1, 5, NORTH, 'village_smith');
    f.set(2, 1, 5, K.crafting_table);
    f.barrel(3, 1, 5);
    f.torch(1, 2, 1, NORTH);
    f.torch(7, 3, 1, NORTH);
  },
};

const library: BuildingType = {
  key: 'library',
  W: 9,
  D: 7,
  doorX: 4,
  height: 4 + 5,
  gap: 2,
  maxSlope: 3,
  beds: [],
  spots: [[4, 2]],
  spotY: 1,
  work: 'librarian',
  build(f, s) {
    shell(f, s, 4);
    roof(f, s, 4);
    f.door(4, 1, 0, SOUTH);
    windows(f, [
      [2, 2, 0],
      [6, 2, 0],
      [0, 2, 4],
      [8, 2, 4],
      [0, 3, 2],
      [8, 3, 2],
    ]);
    for (const lx of [1, 2, 3, 5, 6, 7]) for (let ly = 1; ly <= 2; ly++) f.set(lx, ly, 5, K.bookshelf);
    for (const lz of [2, 3])
      for (let ly = 1; ly <= 2; ly++) {
        f.set(1, ly, lz, K.bookshelf);
        f.set(7, ly, lz, K.bookshelf);
      }
    f.set(4, 1, 5, K.crafting_table);
    for (const lx of [3, 5]) {
      f.set(lx, 1, 3, K.oak_fence);
      f.set(lx, 2, 3, K.white_carpet);
    }
    f.set(4, 4, 3, K.lantern);
    f.chest(7, 1, 1, WEST, 'village_house');
    f.torch(1, 3, 1, NORTH);
    f.torch(7, 3, 1, NORTH);
  },
};

const chapel: BuildingType = {
  key: 'chapel',
  W: 7,
  D: 9,
  doorX: 3,
  height: 5 + 6,
  gap: 2,
  maxSlope: 3,
  beds: [],
  spots: [[3, 6]],
  spotY: 1,
  work: 'cleric',
  build(f, s) {
    const stone = s.key === 'desert' ? K.smooth_sandstone : s.key === 'snowy' ? K.stone_bricks : K.stone_bricks;
    shell(f, { ...s, cornerIsLog: false, corner: s.base }, 5, stone, s.floor, s.base);
    roof(f, s, 5);
    f.door(3, 1, 0, SOUTH);
    for (const lz of [2, 4, 6])
      for (const ly of [2, 3]) {
        f.set(0, ly, lz, K.glass_pane);
        f.set(6, ly, lz, K.glass_pane);
      }
    f.set(3, 3, 8, K.glass_pane);
    f.set(3, 4, 8, K.glass_pane);
    // Autel et bancs tournés vers lui
    for (const lx of [2, 3, 4]) f.set(lx, 1, 7, K.quartz_block);
    f.set(3, 2, 7, K.lantern);
    for (const lz of [3, 5]) for (const lx of [1, 2, 4, 5]) f.stairs(lx, 1, lz, K.oak_stairs, NORTH);
    for (let lz = 1; lz <= 6; lz++) f.set(3, 1, lz, K.red_carpet);
    f.torch(1, 3, 1, NORTH);
    f.torch(5, 3, 1, NORTH);
    f.torch(1, 3, 7, SOUTH);
    f.torch(5, 3, 7, SOUTH);
  },
};

const stall: BuildingType = {
  key: 'stall',
  W: 5,
  D: 4,
  doorX: 2,
  height: 5,
  gap: 2,
  maxSlope: 2,
  beds: [],
  spots: [[2, 2]],
  spotY: 1,
  work: 'butcher',
  build(f, s, rng) {
    f.fill(0, 0, 0, 4, 0, 3, s.planks);
    for (const [lx, lz] of [
      [0, 0],
      [4, 0],
      [0, 3],
      [4, 3],
    ])
      for (let ly = 1; ly <= 2; ly++) f.set(lx, ly, lz, K.oak_fence);
    const stripe = rng.pick([K.red_wool, K.blue_wool, K.green_wool, K.yellow_wool]);
    for (let lx = 0; lx < 5; lx++) for (let lz = 0; lz < 4; lz++) f.set(lx, 3, lz, lx % 2 === 0 ? stripe : K.white_wool);
    f.barrel(1, 1, 0, 'village_house');
    f.log(2, 1, 0, K.hay_block, 1);
    f.barrel(3, 1, 0);
    f.set(1, 1, 3, K.crafting_table);
    f.log(3, 1, 3, K.hay_block, 0);
  },
};

const tower: BuildingType = {
  key: 'tower',
  W: 5,
  D: 5,
  doorX: 2,
  height: 13,
  gap: 2,
  maxSlope: 3,
  beds: [],
  spots: [[1, 1]],
  spotY: 11,
  build(f, s) {
    shell(f, { ...s, cornerIsLog: false, corner: s.base }, 9, s.base, s.base, s.base);
    f.door(2, 1, 0, SOUTH);
    f.fill(0, 10, 0, 4, 10, 4, s.base);
    for (let ly = 1; ly <= 10; ly++) f.ladder(2, ly, 3, SOUTH);
    for (let lx = 0; lx < 5; lx++)
      for (let lz = 0; lz < 5; lz++) if (lx === 0 || lz === 0 || lx === 4 || lz === 4) f.set(lx, 11, lz, K.oak_fence);
    for (const [lx, lz] of [
      [0, 0],
      [4, 0],
      [0, 4],
      [4, 4],
    ])
      f.set(lx, 12, lz, K.lantern);
    windows(f, [
      [0, 5, 2],
      [4, 5, 2],
      [0, 8, 2],
      [4, 8, 2],
      [2, 7, 0],
    ], K.iron_bars);
    f.torch(1, 3, 2, WEST);
    f.torch(3, 6, 2, EAST);
  },
};

// ------------------------------------------------------------------ fermes

const CROPS = [K.wheat, K.wheat, K.carrots, K.potatoes, K.beetroots];

function farm(W: number): BuildingType {
  return {
    key: W > 8 ? 'farm_large' : 'farm',
    W,
    D: 9,
    doorX: -1,
    height: 3,
    gap: 1,
    maxSlope: 2,
    beds: [],
    spots: [[1, 0]],
    spotY: 1,
    work: 'farmer',
    build(f, s, rng) {
      const water = W > 8 ? [3, 9] : [3];
      const left = rng.pick(CROPS);
      const right = rng.pick(CROPS);
      const pumpkins = rng.chance(0.15);
      const log = s.key === 'desert' ? K.smooth_sandstone : s.log;
      for (let lz = 0; lz < 9; lz++)
        for (let lx = 0; lx < W; lx++) {
          const edgeX = lx === 0 || lx === W - 1 || (W > 8 && lx === 6);
          const edgeZ = lz === 0 || lz === 8;
          if (edgeX || edgeZ) {
            if (s.key === 'desert') f.set(lx, 0, lz, log);
            else f.log(lx, 0, lz, log, edgeX && edgeZ ? 0 : edgeX ? 2 : 1);
            continue;
          }
          if (water.includes(lx)) {
            f.set(lx, 0, lz, K.water);
            continue;
          }
          f.set(lx, 0, lz, K.farmland, 1);
          const crop = lx < W / 2 ? left : right;
          if (pumpkins && lz === 4 && lx === 1) f.set(lx, 1, lz, K.pumpkin);
          else f.set(lx, 1, lz, crop, rng.int(0, 7));
        }
      if (rng.chance(0.5)) f.log(W - 1, 1, 0, K.hay_block, 0);
    },
  };
}

// ------------------------------------------------------------------ puits

export const WELL_SIZE = 5;

/** Puits central (repère 5×5, plancher au niveau du sol). */
export function buildWell(f: Frame, s: VillageStyle): void {
  const stone = s.key === 'desert' ? K.sandstone : K.cobblestone;
  for (let lz = 0; lz < 5; lz++)
    for (let lx = 0; lx < 5; lx++) {
      const edge = lx === 0 || lz === 0 || lx === 4 || lz === 4;
      for (let ly = -4; ly <= 0; ly++) f.set(lx, ly, lz, edge || ly === -4 ? stone : K.water);
      if (edge) f.set(lx, 1, lz, stone);
      for (let ly = edge ? 2 : 1; ly <= 6; ly++) f.set(lx, ly, lz, 0);
    }
  for (const [lx, lz] of [
    [0, 0],
    [4, 0],
    [0, 4],
    [4, 4],
  ]) {
    f.set(lx, 2, lz, K.oak_fence);
    f.set(lx, 3, lz, K.oak_fence);
  }
  f.fill(0, 4, 0, 4, 4, 4, s.key === 'desert' ? K.stone_slab : K.cobblestone_slab, 0);
  f.set(2, 4, 2, stone);
  f.set(2, 3, 2, K.lantern);
}

// ------------------------------------------------------------------ catalogue

export const BUILDINGS = {
  house_small: houseSmall,
  house_medium: houseMedium,
  house_large: houseLarge,
  smithy,
  library,
  chapel,
  stall,
  tower,
  farm: farm(7),
  farm_large: farm(13),
};

export type BuildingKey = keyof typeof BUILDINGS;

export { roofHeight };
