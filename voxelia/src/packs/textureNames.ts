/**
 * Table de correspondance des noms de fichiers des packs de ressources vers les noms
 * de textures Voxelia.
 *
 * Règle : pour chaque texture Voxelia, on essaie d'abord la liste d'alias ci-dessous
 * (dans l'ordre) ; sans alias, on essaie le nom identique. Les textures propres à
 * Voxelia (saphir, mythril, cristal, monde céleste…) n'ont volontairement pas d'alias :
 * elles restent procédurales. Les « recettes » (fissures, fil d'énergie, coffre, lit,
 * armure de cuir, œufs) construisent une texture à partir de plusieurs fichiers.
 */

/** Alias des textures de blocs — packs Java récents (1.13 et plus : textures/block). */
export const JAVA_BLOCKS: Record<string, string[]> = {
  grass_top: ['grass_block_top'],
  grass_side: ['grass_block_side'],
  grass_side_overlay: ['grass_block_side_overlay'],
  short_grass: ['short_grass', 'grass'],
  smooth_stone: ['smooth_stone', 'stone_slab_top'],
  smooth_stone_slab_side: ['smooth_stone_slab_side', 'stone_slab_side'],
  kelp: ['kelp_plant', 'kelp'],
  lever_handle: ['lever'],
  // Noms des versions 1.13 à 1.16.
  dirt_path_top: ['dirt_path_top', 'grass_path_top'],
  dirt_path_side: ['dirt_path_side', 'grass_path_side'],
  // Équivalents Voxelia de blocs du jeu de référence (même rôle, même aspect).
  palm_log: ['jungle_log'],
  palm_log_top: ['jungle_log_top'],
  palm_leaves: ['jungle_leaves'],
  palm_sapling: ['jungle_sapling'],
  energy_ore: ['redstone_ore'],
  deepslate_energy_ore: ['deepslate_redstone_ore'],
  energy_block: ['redstone_block'],
  lamp: ['redstone_lamp'],
  lamp_on: ['redstone_lamp_on'],
  sapphire_ore: ['lapis_ore'],
  sapphire_block: ['lapis_block'],
  ember_stone: ['netherrack'],
  ember_ore: ['nether_gold_ore'],
  fire: ['fire_0'],
  dry_shrub: ['short_dry_grass'],
};

/**
 * Alias « anciens noms » : packs Bedrock (textures/blocks) et packs Java d'avant 1.13
 * (textures/blocks). Les noms identiques restent essayés en dernier recours.
 */
export const LEGACY_BLOCKS: Record<string, string[]> = {
  stone: ['stone'],
  granite: ['stone_granite', 'granite'],
  polished_granite: ['stone_granite_smooth', 'polished_granite'],
  diorite: ['stone_diorite', 'diorite'],
  andesite: ['stone_andesite', 'andesite'],
  grass_top: ['grass_top'],
  grass_side: ['grass_side', 'grass_side_carried'],
  grass_side_overlay: ['grass_side_overlay'],
  water_still: ['water_still_grey', 'water_still'],
  water_flow: ['water_flow_grey', 'water_flow'],
  oak_log: ['log_oak', 'oak_log'],
  oak_log_top: ['log_oak_top', 'oak_log_top'],
  birch_log: ['log_birch', 'birch_log'],
  birch_log_top: ['log_birch_top', 'birch_log_top'],
  spruce_log: ['log_spruce', 'spruce_log'],
  spruce_log_top: ['log_spruce_top', 'spruce_log_top'],
  jungle_log: ['log_jungle', 'jungle_log'],
  jungle_log_top: ['log_jungle_top', 'jungle_log_top'],
  acacia_log: ['log_acacia', 'acacia_log'],
  acacia_log_top: ['log_acacia_top', 'acacia_log_top'],
  dark_oak_log: ['log_big_oak', 'dark_oak_log'],
  dark_oak_log_top: ['log_big_oak_top', 'dark_oak_log_top'],
  cherry_log: ['cherry_log_side', 'cherry_log'],
  cherry_log_top: ['cherry_log_top'],
  palm_log: ['log_jungle', 'jungle_log'],
  palm_log_top: ['log_jungle_top', 'jungle_log_top'],
  oak_leaves: ['leaves_oak', 'oak_leaves'],
  birch_leaves: ['leaves_birch', 'birch_leaves'],
  spruce_leaves: ['leaves_spruce', 'spruce_leaves'],
  jungle_leaves: ['leaves_jungle', 'jungle_leaves'],
  acacia_leaves: ['leaves_acacia', 'acacia_leaves'],
  dark_oak_leaves: ['leaves_big_oak', 'dark_oak_leaves'],
  palm_leaves: ['leaves_jungle', 'jungle_leaves'],
  oak_planks: ['planks_oak', 'oak_planks'],
  birch_planks: ['planks_birch', 'birch_planks'],
  spruce_planks: ['planks_spruce', 'spruce_planks'],
  jungle_planks: ['planks_jungle', 'jungle_planks'],
  acacia_planks: ['planks_acacia', 'acacia_planks'],
  dark_oak_planks: ['planks_big_oak', 'dark_oak_planks'],
  sandstone: ['sandstone_normal', 'sandstone'],
  red_sandstone: ['red_sandstone_normal', 'red_sandstone'],
  terracotta: ['hardened_clay', 'terracotta'],
  orange_terracotta: ['hardened_clay_stained_orange'],
  yellow_terracotta: ['hardened_clay_stained_yellow'],
  red_terracotta: ['hardened_clay_stained_red'],
  white_terracotta: ['hardened_clay_stained_white'],
  brown_terracotta: ['hardened_clay_stained_brown'],
  light_gray_terracotta: ['hardened_clay_stained_silver'],
  packed_ice: ['ice_packed', 'packed_ice'],
  energy_ore: ['redstone_ore'],
  deepslate_energy_ore: ['deepslate_redstone_ore'],
  energy_block: ['redstone_block'],
  sapphire_ore: ['lapis_ore'],
  sapphire_block: ['lapis_block'],
  bricks: ['brick', 'bricks'],
  stone_bricks: ['stonebrick', 'stone_bricks'],
  mossy_stone_bricks: ['stonebrick_mossy', 'mossy_stone_bricks'],
  cracked_stone_bricks: ['stonebrick_cracked', 'cracked_stone_bricks'],
  chiseled_stone_bricks: ['stonebrick_carved', 'chiseled_stone_bricks'],
  mossy_cobblestone: ['cobblestone_mossy', 'mossy_cobblestone'],
  smooth_stone: ['stone_slab_top', 'smooth_stone'],
  smooth_stone_slab_side: ['stone_slab_side'],
  furnace_front: ['furnace_front_off', 'furnace_front'],
  torch: ['torch_on', 'torch'],
  lamp: ['redstone_lamp_off', 'redstone_lamp'],
  lamp_on: ['redstone_lamp_on'],
  short_grass: ['tallgrass', 'short_grass'],
  dead_bush: ['deadbush', 'dead_bush'],
  dandelion: ['flower_dandelion', 'dandelion'],
  poppy: ['flower_rose', 'poppy'],
  cornflower: ['flower_cornflower', 'cornflower'],
  allium: ['flower_allium', 'allium'],
  oxeye_daisy: ['flower_oxeye_daisy', 'oxeye_daisy'],
  red_tulip: ['flower_tulip_red', 'red_tulip'],
  lily_of_the_valley: ['flower_lily_of_the_valley', 'lily_of_the_valley'],
  sugar_cane: ['reeds', 'sugar_cane'],
  brown_mushroom: ['mushroom_brown', 'brown_mushroom'],
  red_mushroom: ['mushroom_red', 'red_mushroom'],
  red_mushroom_block: ['mushroom_block_skin_red', 'red_mushroom_block'],
  mushroom_stem: ['mushroom_block_skin_stem', 'mushroom_stem'],
  podzol_top: ['dirt_podzol_top', 'podzol_top'],
  podzol_side: ['dirt_podzol_side', 'podzol_side'],
  lily_pad: ['waterlily', 'lily_pad'],
  kelp: ['kelp_a', 'kelp_top', 'kelp'],
  tube_coral_block: ['coral_blue', 'tube_coral_block'],
  brain_coral_block: ['coral_pink', 'brain_coral_block'],
  farmland: ['farmland_dry', 'farmland'],
  farmland_moist: ['farmland_wet', 'farmland_moist'],
  oak_door_top: ['door_wood_upper', 'oak_door_top'],
  oak_door_bottom: ['door_wood_lower', 'oak_door_bottom'],
  iron_door_top: ['door_iron_upper', 'iron_door_top'],
  iron_door_bottom: ['door_iron_lower', 'iron_door_bottom'],
  oak_trapdoor: ['trapdoor', 'oak_trapdoor'],
  rail: ['rail_normal', 'rail'],
  rail_corner: ['rail_normal_turned', 'rail_corner'],
  powered_rail: ['rail_golden', 'powered_rail'],
  powered_rail_on: ['rail_golden_powered', 'powered_rail_on'],
  ember_stone: ['netherrack'],
  ember_ore: ['nether_gold_ore'],
  spawner: ['mob_spawner', 'spawner'],
  cobweb: ['web', 'cobweb'],
  fire: ['fire_0', 'fire_layer_0'],
  campfire_fire: ['campfire', 'campfire_fire'],
  dirt_path_top: ['grass_path_top', 'dirt_path_top'],
  dirt_path_side: ['grass_path_side', 'dirt_path_side'],
  blue_stained_glass: ['glass_blue', 'blue_stained_glass'],
  oak_sapling: ['sapling_oak', 'oak_sapling'],
  birch_sapling: ['sapling_birch', 'birch_sapling'],
  spruce_sapling: ['sapling_spruce', 'spruce_sapling'],
  jungle_sapling: ['sapling_jungle', 'jungle_sapling'],
  acacia_sapling: ['sapling_acacia', 'acacia_sapling'],
  dark_oak_sapling: ['sapling_roofed_oak', 'dark_oak_sapling'],
  palm_sapling: ['sapling_jungle', 'jungle_sapling'],
  lever_handle: ['lever'],
};

/**
 * Différences propres aux packs Bedrock : le côté d'herbe « grass_side.tga » utilise son
 * canal alpha comme masque de teinte (spécifique au moteur Bedrock) ; on prend la version
 * « portée » déjà colorée, sans superposition.
 */
export const BEDROCK_BLOCKS: Record<string, string[]> = {
  grass_side: ['grass_side_carried'],
};

const COLORS = ['white', 'orange', 'magenta', 'light_blue', 'yellow', 'lime', 'pink', 'gray', 'light_gray', 'cyan', 'purple', 'blue', 'brown', 'green', 'red', 'black'];
for (const c of COLORS) {
  const legacy = c === 'light_gray' ? 'silver' : c;
  LEGACY_BLOCKS[c + '_wool'] = ['wool_colored_' + legacy, c + '_wool'];
  LEGACY_BLOCKS[c + '_concrete'] = ['concrete_' + legacy, c + '_concrete'];
}
for (let s = 0; s <= 7; s++) LEGACY_BLOCKS['wheat_stage' + s] = ['wheat_stage_' + s, 'wheat_stage' + s];
for (let s = 0; s <= 3; s++)
  for (const c of ['carrots', 'potatoes', 'beetroots']) LEGACY_BLOCKS[`${c}_stage${s}`] = [`${c}_stage_${s}`, `${c}_stage${s}`];

/** Textures Voxelia construites par une recette (plusieurs fichiers ou conversion). */
export type Recipe =
  | { kind: 'crack'; from: string[] }
  | { kind: 'union'; from: Array<{ names: string[]; rotate?: boolean }> }
  | { kind: 'chest'; part: 'top' | 'side' | 'front' }
  | { kind: 'bed'; part: 'top' | 'head_top' | 'side' };

/**
 * Fil d'énergie : Voxelia utilise une seule texture en croix. Le jeu de référence fournit
 * un point et une ligne verticale (tournée par le modèle pour les branches est-ouest).
 */
const WIRE = [{ names: ['redstone_dust_dot', 'redstone_dust_cross'] }, { names: ['redstone_dust_line0', 'redstone_dust_line'] }, { names: ['redstone_dust_line0', 'redstone_dust_line'], rotate: true }];

export const BLOCK_RECIPES: Record<string, Recipe> = {
  energy_wire: { kind: 'union', from: WIRE },
  energy_wire_on: { kind: 'union', from: WIRE },
  chest_top: { kind: 'chest', part: 'top' },
  chest_side: { kind: 'chest', part: 'side' },
  chest_front: { kind: 'chest', part: 'front' },
  bed_top: { kind: 'bed', part: 'top' },
  bed_head_top: { kind: 'bed', part: 'head_top' },
  bed_side: { kind: 'bed', part: 'side' },
};
for (let i = 0; i < 10; i++) BLOCK_RECIPES['destroy_' + i] = { kind: 'crack', from: ['destroy_stage_' + i] };

/** Textures « coulantes » : le jeu de référence n'affiche que le quart haut-gauche de l'image. */
export const FLOW_TEXTURES = new Set(['water_flow', 'lava_flow']);

// ------------------------------------------------------------------ objets

/** Alias des icônes d'objets — packs Java récents (textures/item). Clé = icône Voxelia. */
export const JAVA_ITEMS: Record<string, string[]> = {
  raw_beef: ['beef'],
  steak: ['cooked_beef'],
  raw_porkchop: ['porkchop'],
  raw_chicken: ['chicken'],
  raw_mutton: ['mutton'],
  raw_cod: ['cod'],
  raw_salmon: ['salmon'],
  energy_dust: ['redstone'],
  sapphire: ['lapis_lazuli'],
  compass: ['compass', 'compass_16', 'compass_00'],
  map: ['map', 'filled_map'],
  glider: ['elytra'],
  bed: ['red_bed', 'bed'],
  iron_door: ['iron_door'],
};

/** Alias des icônes d'objets — packs Bedrock (textures/items) et Java d'avant 1.13 (textures/items). */
export const LEGACY_ITEMS: Record<string, string[]> = {
  slime_ball: ['slimeball', 'slime_ball'],
  bone_meal: ['bone_meal', 'dye_powder_white_new', 'dye_powder_white'],
  book: ['book_normal', 'book'],
  wheat_seeds: ['seeds_wheat', 'wheat_seeds'],
  beetroot_seeds: ['seeds_beetroot', 'beetroot_seeds'],
  bow: ['bow_standby', 'bow'],
  fishing_rod: ['fishing_rod_uncast', 'fishing_rod'],
  bucket: ['bucket_empty', 'bucket'],
  water_bucket: ['bucket_water', 'water_bucket'],
  lava_bucket: ['bucket_lava', 'lava_bucket'],
  milk_bucket: ['bucket_milk', 'milk_bucket'],
  compass: ['compass_item', 'compass'],
  map: ['map_empty', 'map'],
  oak_boat: ['boat_oak', 'boat', 'oak_boat'],
  minecart: ['minecart_normal', 'minecart'],
  glider: ['elytra'],
  oak_door: ['door_wood', 'wood_door', 'oak_door'],
  iron_door: ['door_iron', 'iron_door'],
  bed: ['bed_red', 'bed'],
  apple: ['apple'],
  golden_apple: ['apple_golden', 'golden_apple'],
  raw_beef: ['beef_raw', 'beef'],
  steak: ['beef_cooked', 'cooked_beef'],
  raw_porkchop: ['porkchop_raw', 'porkchop'],
  cooked_porkchop: ['porkchop_cooked', 'cooked_porkchop'],
  raw_chicken: ['chicken_raw', 'chicken'],
  cooked_chicken: ['chicken_cooked', 'cooked_chicken'],
  raw_mutton: ['mutton_raw', 'mutton'],
  cooked_mutton: ['mutton_cooked', 'cooked_mutton'],
  raw_cod: ['fish_raw', 'fish_cod_raw', 'cod'],
  cooked_cod: ['fish_cooked', 'fish_cod_cooked', 'cooked_cod'],
  raw_salmon: ['fish_salmon_raw', 'salmon'],
  cooked_salmon: ['fish_salmon_cooked', 'cooked_salmon'],
  carrot: ['carrot'],
  potato: ['potato'],
  baked_potato: ['potato_baked', 'baked_potato'],
  melon_slice: ['melon', 'melon_slice'],
  energy_dust: ['redstone_dust', 'redstone'],
  sapphire: ['dye_powder_blue', 'lapis_lazuli'],
};
for (const m of ['wooden', 'stone', 'iron', 'golden', 'diamond']) {
  const legacy = m === 'wooden' ? 'wood' : m === 'golden' ? 'gold' : m;
  for (const t of ['sword', 'pickaxe', 'axe', 'shovel', 'hoe']) LEGACY_ITEMS[`${m}_${t}`] = [`${legacy}_${t}`, `${m}_${t}`];
  if (m !== 'wooden' && m !== 'stone') for (const a of ['helmet', 'chestplate', 'leggings', 'boots']) LEGACY_ITEMS[`${m}_${a}`] = [`${legacy}_${a}`, `${m}_${a}`];
}

/** Pièces d'armure en cuir : gris teinté (couleur de cuir par défaut) + détails non teintés. */
export const LEATHER_PIECES = ['leather_helmet', 'leather_chestplate', 'leather_leggings', 'leather_boots'];
/** Couleur par défaut du cuir dans le jeu de référence. */
export const LEATHER_COLOR = 0xa06540;

/**
 * Créatures Voxelia partagées avec le jeu de référence : leur œuf peut utiliser une
 * texture dédiée (`<créature>_spawn_egg`, packs récents). Clé Voxelia → nom Java.
 */
export const SPAWN_EGG_NAMES: Record<string, string> = {
  cow: 'cow',
  sheep: 'sheep',
  pig: 'pig',
  chicken: 'chicken',
  horse: 'horse',
  rabbit: 'rabbit',
  fox: 'fox',
  turtle: 'turtle',
  cod: 'cod',
  dolphin: 'dolphin',
  villager: 'villager',
  zombie: 'zombie',
  skeleton: 'skeleton',
  spider: 'spider',
};
