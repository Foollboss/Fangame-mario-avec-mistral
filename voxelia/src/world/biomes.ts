/**
 * Biomes : couleurs (herbe, feuillage, eau, ciel, brouillard), blocs de surface,
 * végétation et créatures. Données partagées avec les workers.
 */

export type TreeKind = 'oak' | 'big_oak' | 'birch' | 'spruce' | 'mega_spruce' | 'jungle' | 'mega_jungle' | 'acacia' | 'dark_oak' | 'cherry' | 'palm' | 'giant_mushroom' | 'golden' | 'dead' | 'crystal' | 'swamp_oak';

export type Precip = 'rain' | 'snow' | 'none' | 'sand' | 'ash';

export interface BiomeDef {
  id: number;
  key: string;
  name: string;
  grass: number;
  foliage: number;
  water: number;
  sky: number;
  fog: number;
  temperature: number;
  precip: Precip;
  top: string;
  filler: string;
  fillerDepth: number;
  underwater: string;
  /** Arbres : [type, poids]. */
  trees: Array<[TreeKind, number]>;
  /** Nombre moyen d'arbres par tronçon (16x16). */
  treeDensity: number;
  /** Probabilité d'herbe haute par colonne. */
  grassDensity: number;
  flowers: string[];
  flowerDensity: number;
  /** Végétation spéciale. */
  extras: Array<[string, number]>;
  passiveMobs: string[];
  hostileMobs: string[];
  isOcean?: boolean;
  isRiver?: boolean;
  frozen?: boolean;
  /** Ce biome n'apparaît qu'avec l'expérience « Biomes fantastiques ». */
  fantasy?: boolean;
}

export const BIOMES: BiomeDef[] = [];
export const BIOME_BY_KEY = new Map<string, BiomeDef>();

const DEFAULT_HOSTILE = ['zombie', 'skeleton', 'spider', 'boomshroom'];

function biome(id: number, key: string, name: string, p: Partial<BiomeDef>): BiomeDef {
  const b: BiomeDef = {
    id,
    key,
    name,
    grass: 0x91bd59,
    foliage: 0x77ab2f,
    water: 0x44aff5,
    sky: 0x78a7ff,
    fog: 0xc0d8ff,
    temperature: 0.8,
    precip: 'rain',
    top: 'grass_block',
    filler: 'dirt',
    fillerDepth: 3,
    underwater: 'gravel',
    trees: [],
    treeDensity: 0,
    grassDensity: 0.1,
    flowers: [],
    flowerDensity: 0,
    extras: [],
    passiveMobs: ['cow', 'sheep', 'pig', 'chicken'],
    hostileMobs: DEFAULT_HOSTILE,
    ...p,
  };
  BIOMES[id] = b;
  BIOME_BY_KEY.set(key, b);
  return b;
}

// Océans
biome(0, 'ocean', 'Océan', { water: 0x1787d4, top: 'gravel', filler: 'gravel', underwater: 'gravel', isOcean: true, grassDensity: 0, passiveMobs: ['cod', 'squid', 'dolphin'], fog: 0xc0d8ff });
biome(1, 'deep_ocean', 'Océan profond', { water: 0x1787d4, top: 'gravel', filler: 'gravel', underwater: 'gravel', isOcean: true, grassDensity: 0, passiveMobs: ['cod', 'squid', 'dolphin'] });
biome(2, 'warm_ocean', 'Océan chaud', { water: 0x02b0e5, top: 'sand', filler: 'sand', underwater: 'sand', isOcean: true, grassDensity: 0, passiveMobs: ['tropical_fish', 'dolphin', 'turtle'], temperature: 1.2 });
biome(3, 'frozen_ocean', 'Océan gelé', { water: 0x2570b5, top: 'gravel', filler: 'gravel', underwater: 'gravel', isOcean: true, frozen: true, temperature: -0.5, precip: 'snow', grassDensity: 0, passiveMobs: ['cod', 'squid'] });
biome(4, 'beach', 'Plage', { water: 0x157cab, top: 'sand', filler: 'sand', fillerDepth: 4, underwater: 'sand', grassDensity: 0, passiveMobs: ['turtle', 'chicken'], extras: [['sugar_cane', 0.01]] });
biome(5, 'plains', 'Plaines', { trees: [['oak', 1]], treeDensity: 0.06, grassDensity: 0.32, flowers: ['dandelion', 'poppy', 'oxeye_daisy', 'cornflower'], flowerDensity: 0.012, passiveMobs: ['cow', 'sheep', 'pig', 'chicken', 'horse', 'rabbit'] });
biome(6, 'flower_meadow', 'Prairie fleurie', { grass: 0x83bb6d, foliage: 0x63a948, trees: [['oak', 1], ['birch', 1]], treeDensity: 0.25, grassDensity: 0.25, flowers: ['dandelion', 'poppy', 'allium', 'oxeye_daisy', 'red_tulip', 'cornflower', 'lily_of_the_valley'], flowerDensity: 0.12, passiveMobs: ['sheep', 'rabbit', 'cow'] });
biome(7, 'forest', 'Forêt', { grass: 0x79c05a, foliage: 0x59ae30, water: 0x1e97f2, trees: [['oak', 8], ['birch', 2], ['big_oak', 1]], treeDensity: 7, grassDensity: 0.18, flowers: ['dandelion', 'poppy', 'lily_of_the_valley'], flowerDensity: 0.006, extras: [['brown_mushroom', 0.002]], passiveMobs: ['cow', 'sheep', 'pig', 'chicken', 'fox', 'deer'] });
biome(8, 'birch_forest', 'Forêt de bouleaux', { grass: 0x88bb67, foliage: 0x6ba941, water: 0x0677ce, trees: [['birch', 1]], treeDensity: 7, grassDensity: 0.2, flowers: ['allium', 'oxeye_daisy', 'lily_of_the_valley'], flowerDensity: 0.01, passiveMobs: ['cow', 'sheep', 'chicken', 'deer'] });
biome(9, 'dark_forest', 'Forêt sombre', { grass: 0x507a32, foliage: 0x59ae30, water: 0x3b6cd1, trees: [['dark_oak', 6], ['giant_mushroom', 1], ['oak', 1]], treeDensity: 10, grassDensity: 0.12, extras: [['red_mushroom', 0.004], ['brown_mushroom', 0.004]], passiveMobs: ['fox', 'deer'] });
biome(10, 'jungle', 'Jungle', { grass: 0x59c93c, foliage: 0x30bb0b, water: 0x14a2c5, temperature: 0.95, trees: [['jungle', 4], ['mega_jungle', 1], ['big_oak', 1]], treeDensity: 14, grassDensity: 0.4, extras: [['fern', 0.12], ['melon', 0.004]], flowers: ['poppy'], flowerDensity: 0.004, passiveMobs: ['chicken', 'parrot', 'pig'] });
biome(11, 'desert', 'Désert', { grass: 0xbfb755, foliage: 0xaea42a, water: 0x32a598, temperature: 2, precip: 'sand', top: 'sand', filler: 'sand', fillerDepth: 5, underwater: 'sand', grassDensity: 0, extras: [['cactus', 0.006], ['dead_bush', 0.006]], passiveMobs: ['rabbit'], hostileMobs: ['husk', 'skeleton', 'spider', 'boomshroom'], sky: 0x6eb1ff, fog: 0xe8d9b0 });
biome(12, 'savanna', 'Savane', { grass: 0xbfb755, foliage: 0xaea42a, water: 0x2c8b9c, temperature: 1.6, precip: 'none', trees: [['acacia', 5], ['oak', 1]], treeDensity: 0.7, grassDensity: 0.45, passiveMobs: ['horse', 'cow', 'sheep', 'chicken'] });
biome(13, 'taiga', 'Taïga', { grass: 0x86b783, foliage: 0x68a464, water: 0x287082, temperature: 0.25, trees: [['spruce', 8], ['mega_spruce', 1]], treeDensity: 8, grassDensity: 0.2, extras: [['fern', 0.12]], top: 'grass_block', passiveMobs: ['fox', 'rabbit', 'deer', 'sheep'] });
biome(14, 'snowy_plains', 'Plaines enneigées', { grass: 0x80b497, foliage: 0x60a17b, water: 0x1475ab, temperature: -0.3, precip: 'snow', frozen: true, trees: [['spruce', 1]], treeDensity: 0.1, grassDensity: 0.03, passiveMobs: ['rabbit', 'polar_bear_cub'], hostileMobs: ['stray', 'zombie', 'spider'] });
biome(15, 'snowy_taiga', 'Taïga enneigée', { grass: 0x80b497, foliage: 0x60a17b, water: 0x205e83, temperature: -0.5, precip: 'snow', frozen: true, trees: [['spruce', 6], ['mega_spruce', 1]], treeDensity: 7, grassDensity: 0.06, extras: [['fern', 0.05]], passiveMobs: ['fox', 'rabbit', 'deer'] });
biome(16, 'ice_spikes', 'Pics de glace', { grass: 0x80b497, foliage: 0x60a17b, water: 0x14559b, temperature: -0.8, precip: 'snow', frozen: true, top: 'snow_block', grassDensity: 0, passiveMobs: ['rabbit'] });
biome(17, 'mountains', 'Montagnes', { grass: 0x8ab689, foliage: 0x6da36b, water: 0x0e63ab, temperature: 0.2, trees: [['spruce', 3], ['oak', 1]], treeDensity: 0.6, grassDensity: 0.1, top: 'grass_block', passiveMobs: ['goat', 'sheep'] });
biome(18, 'snowy_peaks', 'Pics enneigés', { grass: 0x80b497, foliage: 0x60a17b, water: 0x0e63ab, temperature: -0.7, precip: 'snow', frozen: true, top: 'snow_block', filler: 'stone', grassDensity: 0, passiveMobs: ['goat'] });
biome(19, 'swamp', 'Marécage', { grass: 0x6a7039, foliage: 0x6a7039, water: 0x4c6559, temperature: 0.8, trees: [['swamp_oak', 1]], treeDensity: 2, grassDensity: 0.15, extras: [['lily_pad', 0.03], ['brown_mushroom', 0.006], ['sugar_cane', 0.01]], flowers: ['allium'], flowerDensity: 0.002, underwater: 'mud', passiveMobs: ['frog', 'chicken'], hostileMobs: ['slime', 'zombie', 'witch', 'spider'], fog: 0x8f9a7a });
biome(20, 'badlands', 'Canyons ocre', { grass: 0x90814d, foliage: 0x9e814d, water: 0x4e7f81, temperature: 2, precip: 'none', top: 'red_sand', filler: 'terracotta', fillerDepth: 6, grassDensity: 0, extras: [['dead_bush', 0.01], ['cactus', 0.002]], passiveMobs: ['rabbit'], sky: 0x6eb1ff, fog: 0xe0b890 });
biome(21, 'mushroom_fields', 'Champs de champignons', { grass: 0x55c93f, foliage: 0x2bbb0f, water: 0x8a8997, top: 'mycelium', trees: [['giant_mushroom', 1]], treeDensity: 0.8, grassDensity: 0, extras: [['red_mushroom', 0.02], ['brown_mushroom', 0.02]], passiveMobs: ['mooshroom'], hostileMobs: [] });
biome(22, 'cherry_grove', 'Bosquet de cerisiers', { grass: 0xb6db61, foliage: 0xb6db61, water: 0x5db7ef, temperature: 0.5, trees: [['cherry', 1]], treeDensity: 2.5, grassDensity: 0.3, flowers: ['allium', 'oxeye_daisy'], flowerDensity: 0.03, passiveMobs: ['rabbit', 'sheep', 'deer'] });
biome(23, 'river', 'Rivière', { water: 0x0084ff, top: 'grass_block', underwater: 'sand', isRiver: true, grassDensity: 0.1, extras: [['sugar_cane', 0.04]], passiveMobs: ['salmon', 'cod'] });
biome(24, 'frozen_river', 'Rivière gelée', { water: 0x185390, grass: 0x80b497, foliage: 0x60a17b, temperature: -0.5, precip: 'snow', frozen: true, underwater: 'gravel', isRiver: true, grassDensity: 0, passiveMobs: ['salmon'] });
biome(25, 'volcano', 'Volcan', { grass: 0x8a8a5a, foliage: 0x7a7a4a, water: 0x3d5c6e, temperature: 2, precip: 'ash', top: 'basalt', filler: 'basalt', fillerDepth: 6, grassDensity: 0, passiveMobs: [], hostileMobs: ['magma_cube', 'skeleton', 'boomshroom'], sky: 0x8a6e6e, fog: 0x6a4a40 });
biome(26, 'crystal_forest', 'Forêt de cristal', { grass: 0x6fd6c2, foliage: 0x7fe0e6, water: 0x56c8e8, temperature: 0.4, trees: [['crystal', 3], ['birch', 2]], treeDensity: 3, grassDensity: 0.2, extras: [['crystal_cluster', 0.01], ['glow_mushroom', 0.01]], flowers: ['cornflower', 'allium'], flowerDensity: 0.02, passiveMobs: ['deer', 'rabbit', 'golden_stag'], hostileMobs: ['crystal_slime', 'zombie', 'skeleton'], fantasy: true, sky: 0x8fb8ff, fog: 0xc8e6ff });
biome(27, 'enchanted_forest', 'Forêt enchantée', { grass: 0x4ec27a, foliage: 0x3caf6a, water: 0x3f76e4, temperature: 0.6, trees: [['big_oak', 3], ['dark_oak', 1], ['giant_mushroom', 1]], treeDensity: 8, grassDensity: 0.3, extras: [['glow_mushroom', 0.02], ['fern', 0.05]], flowers: ['allium', 'lily_of_the_valley', 'cornflower'], flowerDensity: 0.03, passiveMobs: ['deer', 'fox', 'golden_stag'], hostileMobs: ['zombie', 'skeleton', 'spider', 'night_wraith'], fantasy: true });
biome(28, 'stony_shore', 'Côte rocheuse', { grass: 0x8ab689, foliage: 0x6da36b, water: 0x0d67bb, top: 'stone', filler: 'stone', grassDensity: 0, passiveMobs: [] });
biome(29, 'tropical_islands', 'Îles tropicales', { grass: 0x59c93c, foliage: 0x30bb0b, water: 0x02b0e5, temperature: 1.2, top: 'sand', filler: 'sand', fillerDepth: 4, underwater: 'sand', trees: [['palm', 1]], treeDensity: 1.5, grassDensity: 0.05, passiveMobs: ['turtle', 'parrot', 'chicken'] });
biome(30, 'ash_plains', 'Plaines cendrées', { grass: 0xa2a07a, foliage: 0x9a9a72, water: 0x5a7a8a, temperature: 1.0, precip: 'ash', top: 'ash_grass', filler: 'dirt', trees: [['dead', 1], ['acacia', 1]], treeDensity: 0.3, grassDensity: 0, extras: [['dry_shrub', 0.03], ['dead_bush', 0.01]], passiveMobs: ['horse', 'rabbit'], fantasy: false, sky: 0xa0a8b8, fog: 0xb8b0a0 });
biome(31, 'meadow', 'Plateau alpin', { grass: 0x83bb6d, foliage: 0x63a948, water: 0x0e4ecf, temperature: 0.4, trees: [['birch', 1], ['oak', 1]], treeDensity: 0.1, grassDensity: 0.4, flowers: ['allium', 'cornflower', 'dandelion', 'oxeye_daisy'], flowerDensity: 0.05, passiveMobs: ['sheep', 'rabbit', 'goat'] });

// Terres de braise (dimension volcanique)
biome(40, 'ember_wastes', 'Terres de braise', { grass: 0xbfb755, foliage: 0xaea42a, water: 0x905957, temperature: 2, precip: 'ash', top: 'ember_stone', filler: 'ember_stone', fillerDepth: 4, grassDensity: 0, passiveMobs: [], hostileMobs: ['ember_salamander', 'fire_spirit', 'magma_cube'], sky: 0x5a1a10, fog: 0x7a2a18 });
biome(41, 'basalt_deltas', 'Deltas de basalte', { grass: 0xbfb755, foliage: 0xaea42a, water: 0x3f76e4, temperature: 2, precip: 'ash', top: 'basalt', filler: 'basalt', fillerDepth: 4, grassDensity: 0, passiveMobs: [], hostileMobs: ['magma_cube', 'fire_spirit'], sky: 0x4a3a3a, fog: 0x5a4a48 });
biome(42, 'ash_dunes', 'Dunes de cendre', { grass: 0xbfb755, foliage: 0xaea42a, water: 0x3f76e4, temperature: 2, precip: 'ash', top: 'ash', filler: 'ash', fillerDepth: 4, grassDensity: 0, passiveMobs: [], hostileMobs: ['ember_salamander', 'skeleton'], sky: 0x6a4030, fog: 0x8a6050 });

// Royaume céleste
biome(50, 'sky_islands', 'Îles célestes', { grass: 0x7fdc8f, foliage: 0x7fd4a0, water: 0x5fc8ff, temperature: 0.5, top: 'sky_grass', filler: 'sky_dirt', fillerDepth: 3, trees: [['golden', 1], ['oak', 2], ['birch', 1]], treeDensity: 1.5, grassDensity: 0.2, flowers: ['cornflower', 'oxeye_daisy'], flowerDensity: 0.02, passiveMobs: ['sky_sheep', 'chicken'], hostileMobs: ['storm_bird'], sky: 0x9fd4ff, fog: 0xe0f2ff });
biome(51, 'golden_grove', 'Bosquet doré', { grass: 0xd8d070, foliage: 0xe8c840, water: 0x5fc8ff, temperature: 0.5, top: 'sky_grass', filler: 'sky_dirt', fillerDepth: 3, trees: [['golden', 1]], treeDensity: 3, grassDensity: 0.3, flowers: ['dandelion'], flowerDensity: 0.05, passiveMobs: ['sky_sheep', 'golden_stag'], hostileMobs: ['storm_bird'], sky: 0xb0dcff, fog: 0xfff0d0 });

export const BIOME_COUNT = 64;

export function biomeById(id: number): BiomeDef {
  return BIOMES[id] ?? BIOMES[5];
}

export function biomeKey(key: string): number {
  const b = BIOME_BY_KEY.get(key);
  if (!b) throw new Error('Biome inconnu : ' + key);
  return b.id;
}

/** Tables de couleurs (RGB empaqueté) pour le maillage. */
export const GRASS_COLORS = new Int32Array(BIOME_COUNT);
export const FOLIAGE_COLORS = new Int32Array(BIOME_COUNT);
export const WATER_COLORS = new Int32Array(BIOME_COUNT);
for (let i = 0; i < BIOME_COUNT; i++) {
  const b = BIOMES[i] ?? BIOMES[5];
  GRASS_COLORS[i] = b.grass;
  FOLIAGE_COLORS[i] = b.foliage;
  WATER_COLORS[i] = b.water;
}
