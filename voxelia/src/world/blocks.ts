/**
 * BlockRegistry — définition data-driven de tous les blocs du jeu.
 *
 * Les identifiants numériques sont stables (ils sont écrits dans les sauvegardes) :
 * on ajoute de nouveaux blocs à la fin, on ne renumérote jamais.
 * Ce module est partagé par le thread principal et les workers (génération, maillage).
 */

export type Shape =
  | 'none'
  | 'cube'
  | 'cross'
  | 'liquid'
  | 'slab'
  | 'stairs'
  | 'torch'
  | 'door'
  | 'trapdoor'
  | 'ladder'
  | 'fence'
  | 'pane'
  | 'crop'
  | 'cactus'
  | 'layer'
  | 'carpet'
  | 'lever'
  | 'button'
  | 'plate'
  | 'bed'
  | 'chest'
  | 'lantern'
  | 'vine'
  | 'farmland'
  | 'portal'
  | 'fire'
  | 'wire'
  | 'rail'
  | 'lily'
  | 'campfire';

export const enum Pass {
  Opaque = 0,
  Cutout = 1,
  Translucent = 2,
}

export const enum Tint {
  None = 0,
  Grass = 1,
  Foliage = 2,
  Water = 3,
  Fixed = 4,
}

export type Tool = 'none' | 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'sword' | 'shears';
export type Sound = 'stone' | 'wood' | 'grass' | 'gravel' | 'sand' | 'glass' | 'snow' | 'wool' | 'metal' | 'liquid' | 'plant';
export type Category = 'construction' | 'equipment' | 'items' | 'nature' | null;
export type Interaction =
  | 'door'
  | 'trapdoor'
  | 'chest'
  | 'crafting'
  | 'furnace'
  | 'lever'
  | 'button'
  | 'bed'
  | 'tnt'
  | 'elevator'
  | 'note'
  | 'barrel'
  | 'cake';

export interface FaceTex {
  top: string;
  bottom: string;
  north: string;
  south: string;
  east: string;
  west: string;
  /** Texture de superposition teintée (côtés du bloc d'herbe). */
  overlay?: string;
}

export interface BlockDef {
  id: number;
  key: string;
  name: string;
  shape: Shape;
  tex: FaceTex;
  /** Texture « avant » utilisée selon l'orientation (fours, coffres, citrouilles…). */
  front?: string;
  /** Texture alternative lorsque le bloc est actif (four allumé, lampe…). */
  activeTex?: string;
  solid: boolean;
  opaque: boolean;
  pass: Pass;
  light: number;
  /** Atténuation supplémentaire de la lumière en traversant le bloc (0..15). */
  filter: number;
  hardness: number;
  tool: Tool;
  level: number;
  drop?: string | null;
  dropCount?: [number, number];
  dropChance?: number;
  sound: Sound;
  tint: Tint;
  tintColor: number;
  replaceable: boolean;
  gravity: boolean;
  flammable: boolean;
  climbable: boolean;
  waterlogged: boolean;
  category: Category;
  interact?: Interaction;
  orient: 'none' | 'axis' | 'facing' | 'facing_any';
  xp?: [number, number];
  damage: number;
  slow: number;
  /** Comportement de mise à jour aléatoire (croissance, propagation…). */
  tick?: 'grass_spread' | 'crop' | 'sapling' | 'leaves_decay' | 'cactus' | 'cane' | 'ice_melt' | 'farmland' | 'fire' | 'mycelium';
  /** Taille de croissance max pour les cultures. */
  maxStage?: number;
  /** Puissance d'énergie émise (levier, bouton, plaque, bloc d'énergie). */
  powerSource?: boolean;
  /** Réagit à l'énergie (lampe, porte, TNT). */
  powerConsumer?: boolean;
  /** Bloc d'arbre / végétation pour la génération. */
  sapling?: string;
}

type Props = Partial<Omit<BlockDef, 'tex'>> & { tex?: string | Partial<FaceTex> & { all?: string; side?: string; end?: string } };

export const BLOCKS: BlockDef[] = [];
export const BLOCK_BY_KEY = new Map<string, BlockDef>();

function faceTex(key: string, t: Props['tex']): FaceTex {
  if (t === undefined) t = key;
  if (typeof t === 'string') return { top: t, bottom: t, north: t, south: t, east: t, west: t };
  const all = t.all ?? key;
  const side = t.side ?? all;
  const end = t.end;
  return {
    top: t.top ?? end ?? all,
    bottom: t.bottom ?? end ?? all,
    north: t.north ?? side,
    south: t.south ?? side,
    east: t.east ?? side,
    west: t.west ?? side,
    overlay: t.overlay,
  };
}

function def(id: number, key: string, name: string, p: Props = {}): BlockDef {
  const shape = p.shape ?? 'cube';
  const fullCube = shape === 'cube';
  const pass = p.pass ?? (fullCube ? Pass.Opaque : Pass.Cutout);
  const opaque = p.opaque ?? (fullCube && pass === Pass.Opaque);
  const b: BlockDef = {
    id,
    key,
    name,
    shape,
    tex: faceTex(key, p.tex),
    front: p.front,
    activeTex: p.activeTex,
    solid: p.solid ?? !['cross', 'liquid', 'torch', 'crop', 'carpet_none', 'lever', 'button', 'plate', 'vine', 'portal', 'fire', 'wire', 'rail', 'none'].includes(shape),
    opaque,
    pass,
    light: p.light ?? 0,
    filter: p.filter ?? (opaque ? 15 : 0),
    hardness: p.hardness ?? 1,
    tool: p.tool ?? 'none',
    level: p.level ?? 0,
    drop: p.drop,
    dropCount: p.dropCount,
    dropChance: p.dropChance,
    sound: p.sound ?? 'stone',
    tint: p.tint ?? Tint.None,
    tintColor: p.tintColor ?? 0xffffff,
    replaceable: p.replaceable ?? false,
    gravity: p.gravity ?? false,
    flammable: p.flammable ?? false,
    climbable: p.climbable ?? false,
    waterlogged: p.waterlogged ?? false,
    category: p.category === undefined ? 'construction' : p.category,
    interact: p.interact,
    orient: p.orient ?? 'none',
    xp: p.xp,
    damage: p.damage ?? 0,
    slow: p.slow ?? 0,
    tick: p.tick,
    maxStage: p.maxStage,
    powerSource: p.powerSource,
    powerConsumer: p.powerConsumer,
    sapling: p.sapling,
  };
  if (BLOCKS[id]) throw new Error('Identifiant de bloc dupliqué : ' + id);
  BLOCKS[id] = b;
  BLOCK_BY_KEY.set(key, b);
  return b;
}

// Raccourcis de catégories / propriétés communes.
const STONE = { hardness: 1.5, tool: 'pickaxe' as Tool, sound: 'stone' as Sound };
const ORE = (level: number, drop?: string, xp?: [number, number], extra: Props = {}): Props => ({
  hardness: 3,
  tool: 'pickaxe',
  level,
  drop,
  xp,
  category: 'nature',
  ...extra,
});
const WOOD = { hardness: 2, tool: 'axe' as Tool, sound: 'wood' as Sound, flammable: true };
const LOG = (k: string): Props => ({ ...WOOD, tex: { side: k + '_log', end: k + '_log_top' }, orient: 'axis', category: 'nature' });
const LEAVES = (k: string, tint: Tint, color = 0xffffff, sapling?: string): Props => ({
  hardness: 0.2,
  tool: 'shears',
  sound: 'grass',
  pass: Pass.Cutout,
  opaque: false,
  filter: 1,
  tint,
  tintColor: color,
  flammable: true,
  category: 'nature',
  drop: sapling ?? null,
  dropChance: 0.06,
  tick: 'leaves_decay',
  tex: k + '_leaves',
});
const PLANT: Props = { shape: 'cross', hardness: 0, sound: 'plant', replaceable: false, category: 'nature', flammable: true };
const WOOL: Props = { hardness: 0.8, tool: 'shears', sound: 'wool', flammable: true };

// ---------------------------------------------------------------- Terrain de base
def(0, 'air', 'Air', { shape: 'none', solid: false, opaque: false, hardness: 0, category: null, filter: 0 });
def(1, 'stone', 'Pierre', { ...STONE, drop: 'cobblestone', category: 'nature' });
def(2, 'grass_block', "Bloc d'herbe", {
  hardness: 0.6,
  tool: 'shovel',
  sound: 'grass',
  tex: { top: 'grass_top', bottom: 'dirt', side: 'grass_side', overlay: 'grass_side_overlay' },
  tint: Tint.Grass,
  drop: 'dirt',
  category: 'nature',
  tick: 'grass_spread',
});
def(3, 'dirt', 'Terre', { hardness: 0.5, tool: 'shovel', sound: 'gravel', category: 'nature' });
def(4, 'cobblestone', 'Pavé', { ...STONE, hardness: 2 });
def(5, 'bedrock', 'Socle', { hardness: -1, category: 'nature' });
def(6, 'sand', 'Sable', { hardness: 0.5, tool: 'shovel', sound: 'sand', gravity: true, category: 'nature' });
def(7, 'gravel', 'Gravier', { hardness: 0.6, tool: 'shovel', sound: 'gravel', gravity: true, category: 'nature' });
def(8, 'clay', 'Argile', { hardness: 0.6, tool: 'shovel', sound: 'gravel', drop: 'clay_ball', dropCount: [4, 4], category: 'nature' });
def(9, 'water', 'Eau', {
  shape: 'liquid',
  pass: Pass.Translucent,
  solid: false,
  opaque: false,
  hardness: -1,
  filter: 2,
  tint: Tint.Water,
  sound: 'liquid',
  tex: { all: 'water_still', side: 'water_flow' },
  category: null,
  replaceable: true,
});
def(10, 'lava', 'Lave', {
  shape: 'liquid',
  pass: Pass.Opaque,
  solid: false,
  opaque: false,
  hardness: -1,
  light: 15,
  filter: 1,
  sound: 'liquid',
  tex: { all: 'lava_still', side: 'lava_flow' },
  category: null,
  damage: 4,
  replaceable: true,
});

// ---------------------------------------------------------------- Bois
def(11, 'oak_log', 'Bûche de chêne', LOG('oak'));
def(12, 'oak_leaves', 'Feuilles de chêne', LEAVES('oak', Tint.Foliage, 0xffffff, 'oak_sapling'));
def(13, 'oak_planks', 'Planches de chêne', { ...WOOD });
def(14, 'birch_log', 'Bûche de bouleau', LOG('birch'));
def(15, 'birch_leaves', 'Feuilles de bouleau', LEAVES('birch', Tint.Fixed, 0x80a755, 'birch_sapling'));
def(16, 'birch_planks', 'Planches de bouleau', { ...WOOD });
def(17, 'spruce_log', 'Bûche de sapin', LOG('spruce'));
def(18, 'spruce_leaves', 'Aiguilles de sapin', LEAVES('spruce', Tint.Fixed, 0x619961, 'spruce_sapling'));
def(19, 'spruce_planks', 'Planches de sapin', { ...WOOD });
def(20, 'jungle_log', 'Bûche de jungle', LOG('jungle'));
def(21, 'jungle_leaves', 'Feuilles de jungle', LEAVES('jungle', Tint.Foliage, 0xffffff, 'jungle_sapling'));
def(22, 'jungle_planks', 'Planches de jungle', { ...WOOD });
def(23, 'acacia_log', "Bûche d'acacia", LOG('acacia'));
def(24, 'acacia_leaves', "Feuilles d'acacia", LEAVES('acacia', Tint.Foliage, 0xffffff, 'acacia_sapling'));
def(25, 'acacia_planks', "Planches d'acacia", { ...WOOD });
def(26, 'dark_oak_log', 'Bûche de chêne noir', LOG('dark_oak'));
def(27, 'dark_oak_leaves', 'Feuilles de chêne noir', LEAVES('dark_oak', Tint.Foliage, 0xffffff, 'dark_oak_sapling'));
def(28, 'dark_oak_planks', 'Planches de chêne noir', { ...WOOD });
def(29, 'cherry_log', 'Bûche de cerisier', LOG('cherry'));
def(30, 'cherry_leaves', 'Feuilles de cerisier', LEAVES('cherry', Tint.None, 0xffffff, 'cherry_sapling'));
def(31, 'cherry_planks', 'Planches de cerisier', { ...WOOD });
def(32, 'palm_log', 'Bûche de palmier', LOG('palm'));
def(33, 'palm_leaves', 'Palmes', LEAVES('palm', Tint.Foliage, 0xffffff, 'palm_sapling'));
def(34, 'deepslate', 'Roche profonde', { ...STONE, hardness: 3, drop: 'cobbled_deepslate', orient: 'axis', tex: { side: 'deepslate', end: 'deepslate_top' }, category: 'nature' });
def(35, 'cobbled_deepslate', 'Roche profonde taillée', { ...STONE, hardness: 3.5 });
def(36, 'granite', 'Granite', { ...STONE, category: 'nature' });
def(37, 'diorite', 'Diorite', { ...STONE, category: 'nature' });
def(38, 'andesite', 'Andésite', { ...STONE, category: 'nature' });
def(39, 'sandstone', 'Grès', { hardness: 0.8, tool: 'pickaxe', tex: { side: 'sandstone', top: 'sandstone_top', bottom: 'sandstone_bottom' } });
def(40, 'red_sand', 'Sable rouge', { hardness: 0.5, tool: 'shovel', sound: 'sand', gravity: true, category: 'nature' });
def(41, 'red_sandstone', 'Grès rouge', { hardness: 0.8, tool: 'pickaxe', tex: { side: 'red_sandstone', top: 'red_sandstone_top', bottom: 'red_sandstone_top' } });
def(42, 'terracotta', 'Terre cuite', { hardness: 1.25, tool: 'pickaxe', category: 'nature' });
def(43, 'orange_terracotta', 'Terre cuite orange', { hardness: 1.25, tool: 'pickaxe' });
def(44, 'yellow_terracotta', 'Terre cuite jaune', { hardness: 1.25, tool: 'pickaxe' });
def(45, 'red_terracotta', 'Terre cuite rouge', { hardness: 1.25, tool: 'pickaxe' });
def(46, 'white_terracotta', 'Terre cuite blanche', { hardness: 1.25, tool: 'pickaxe' });
def(47, 'brown_terracotta', 'Terre cuite brune', { hardness: 1.25, tool: 'pickaxe' });
def(48, 'light_gray_terracotta', 'Terre cuite gris clair', { hardness: 1.25, tool: 'pickaxe' });

// ---------------------------------------------------------------- Neige et glace
def(49, 'snow_block', 'Bloc de neige', { hardness: 0.2, tool: 'shovel', sound: 'snow', drop: 'snowball', dropCount: [4, 4], tex: 'snow', category: 'nature' });
def(50, 'snow_layer', 'Couche de neige', { shape: 'layer', hardness: 0.1, tool: 'shovel', sound: 'snow', tex: 'snow', replaceable: true, drop: 'snowball', category: 'nature', pass: Pass.Opaque });
def(51, 'ice', 'Glace', { hardness: 0.5, tool: 'pickaxe', sound: 'glass', pass: Pass.Translucent, opaque: false, filter: 2, drop: null, category: 'nature', tick: 'ice_melt', slow: -1 });
def(52, 'packed_ice', 'Glace compacte', { hardness: 0.5, tool: 'pickaxe', sound: 'glass', drop: null, category: 'nature', slow: -1 });
def(53, 'blue_ice', 'Glace bleue', { hardness: 2.8, tool: 'pickaxe', sound: 'glass', drop: null, category: 'nature', slow: -2 });

// ---------------------------------------------------------------- Minerais
def(54, 'coal_ore', 'Minerai de charbon', ORE(0, 'coal', [0, 2]));
def(55, 'iron_ore', 'Minerai de fer', ORE(1, 'raw_iron'));
def(56, 'copper_ore', 'Minerai de cuivre', ORE(1, 'raw_copper', undefined, { dropCount: [2, 4] }));
def(57, 'gold_ore', "Minerai d'or", ORE(2, 'raw_gold'));
def(58, 'energy_ore', "Minerai d'énergie", ORE(2, 'energy_dust', [1, 5], { dropCount: [4, 5], light: 0 }));
def(59, 'sapphire_ore', 'Minerai de saphir', ORE(1, 'sapphire', [2, 5], { dropCount: [3, 6] }));
def(60, 'diamond_ore', 'Minerai de diamant', ORE(2, 'diamond', [3, 7]));
def(61, 'emerald_ore', "Minerai d'émeraude", ORE(2, 'emerald', [3, 7]));
def(62, 'mythril_ore', 'Minerai de mythril', ORE(3, 'raw_mythril', [5, 10], { hardness: 6, light: 3 }));
def(63, 'deepslate_iron_ore', 'Minerai de fer des profondeurs', ORE(1, 'raw_iron', undefined, { hardness: 4.5 }));
def(64, 'deepslate_gold_ore', "Minerai d'or des profondeurs", ORE(2, 'raw_gold', undefined, { hardness: 4.5 }));
def(65, 'deepslate_diamond_ore', 'Minerai de diamant des profondeurs', ORE(2, 'diamond', [3, 7], { hardness: 4.5 }));
def(66, 'deepslate_energy_ore', "Minerai d'énergie des profondeurs", ORE(2, 'energy_dust', [1, 5], { hardness: 4.5, dropCount: [4, 5] }));
def(67, 'coal_block', 'Bloc de charbon', { ...STONE, hardness: 5, flammable: true });
def(68, 'iron_block', 'Bloc de fer', { ...STONE, hardness: 5, level: 1, sound: 'metal' });
def(69, 'copper_block', 'Bloc de cuivre', { ...STONE, hardness: 3, level: 1, sound: 'metal' });
def(70, 'gold_block', "Bloc d'or", { ...STONE, hardness: 3, level: 2, sound: 'metal' });
def(71, 'diamond_block', 'Bloc de diamant', { ...STONE, hardness: 5, level: 2, sound: 'metal' });
def(72, 'emerald_block', "Bloc d'émeraude", { ...STONE, hardness: 5, level: 2, sound: 'metal' });
def(73, 'sapphire_block', 'Bloc de saphir', { ...STONE, hardness: 3, level: 1 });
def(74, 'energy_block', "Bloc d'énergie", { ...STONE, hardness: 5, level: 0, sound: 'metal', powerSource: true });
def(75, 'mythril_block', 'Bloc de mythril', { ...STONE, hardness: 8, level: 3, sound: 'metal', light: 6 });

// ---------------------------------------------------------------- Construction
def(76, 'glass', 'Verre', { hardness: 0.3, sound: 'glass', pass: Pass.Cutout, opaque: false, drop: null });
def(77, 'bricks', 'Briques', { ...STONE, hardness: 2 });
def(78, 'stone_bricks', 'Briques de pierre', { ...STONE });
def(79, 'mossy_stone_bricks', 'Briques de pierre moussues', { ...STONE });
def(80, 'cracked_stone_bricks', 'Briques de pierre fissurées', { ...STONE });
def(81, 'mossy_cobblestone', 'Pavé moussu', { ...STONE, hardness: 2 });
def(82, 'smooth_stone', 'Pierre lisse', { ...STONE, hardness: 2 });
def(83, 'polished_granite', 'Granite poli', { ...STONE });
def(84, 'bookshelf', 'Bibliothèque', { ...WOOD, hardness: 1.5, tex: { side: 'bookshelf', end: 'oak_planks' }, drop: 'book', dropCount: [3, 3] });
def(85, 'crafting_table', 'Établi', { ...WOOD, hardness: 2.5, tex: { top: 'crafting_table_top', bottom: 'oak_planks', side: 'crafting_table_side', north: 'crafting_table_front' }, interact: 'crafting', category: 'items' });
def(86, 'furnace', 'Four', { ...STONE, hardness: 3.5, tex: { top: 'furnace_top', bottom: 'furnace_top', side: 'furnace_side' }, front: 'furnace_front', activeTex: 'furnace_front_on', orient: 'facing', interact: 'furnace', category: 'items' });
def(87, 'chest', 'Coffre', { ...WOOD, hardness: 2.5, shape: 'chest', tex: { top: 'chest_top', bottom: 'chest_top', side: 'chest_side' }, front: 'chest_front', orient: 'facing', interact: 'chest', category: 'items', pass: Pass.Opaque });
def(88, 'torch', 'Torche', { shape: 'torch', hardness: 0, light: 14, sound: 'wood', category: 'items' });
def(89, 'glowstone', 'Pierre lumineuse', { hardness: 0.3, sound: 'glass', light: 15, drop: 'glowstone_dust', dropCount: [2, 4] });
def(90, 'lantern', 'Lanterne', { shape: 'lantern', hardness: 3.5, tool: 'pickaxe', light: 15, sound: 'metal', category: 'items' });
def(91, 'lamp', 'Lampe à énergie', { hardness: 0.3, sound: 'glass', activeTex: 'lamp_on', powerConsumer: true, category: 'items' });
def(92, 'sea_lantern', 'Lanterne marine', { hardness: 0.3, sound: 'glass', light: 15 });
def(93, 'obsidian', 'Obsidienne', { ...STONE, hardness: 50, level: 3 });

// ---------------------------------------------------------------- Végétation
def(95, 'short_grass', 'Herbes hautes', { ...PLANT, tint: Tint.Grass, replaceable: true, drop: 'wheat_seeds', dropChance: 0.125 });
def(96, 'fern', 'Fougère', { ...PLANT, tint: Tint.Grass, replaceable: true, drop: 'wheat_seeds', dropChance: 0.125 });
def(97, 'dead_bush', 'Buisson mort', { ...PLANT, replaceable: true, drop: 'stick', dropCount: [0, 2] });
def(98, 'dandelion', 'Pissenlit', { ...PLANT });
def(99, 'poppy', 'Coquelicot', { ...PLANT });
def(100, 'cornflower', 'Bleuet', { ...PLANT });
def(101, 'allium', 'Ail ornemental', { ...PLANT });
def(102, 'oxeye_daisy', 'Marguerite', { ...PLANT });
def(103, 'red_tulip', 'Tulipe rouge', { ...PLANT });
def(104, 'lily_of_the_valley', 'Muguet', { ...PLANT });
def(105, 'cactus', 'Cactus', { shape: 'cactus', hardness: 0.4, sound: 'wool', damage: 1, tex: { side: 'cactus_side', top: 'cactus_top', bottom: 'cactus_bottom' }, category: 'nature', tick: 'cactus' });
def(106, 'sugar_cane', 'Canne à sucre', { ...PLANT, tint: Tint.Grass, tick: 'cane', category: 'nature' });
def(107, 'pumpkin', 'Citrouille', { hardness: 1, tool: 'axe', sound: 'wood', tex: { side: 'pumpkin_side', top: 'pumpkin_top', bottom: 'pumpkin_top' }, category: 'nature' });
def(108, 'melon', 'Pastèque', { hardness: 1, tool: 'axe', sound: 'wood', tex: { side: 'melon_side', top: 'melon_top', bottom: 'melon_top' }, drop: 'melon_slice', dropCount: [3, 7], category: 'nature' });
def(109, 'brown_mushroom', 'Champignon brun', { ...PLANT, light: 1 });
def(110, 'red_mushroom', 'Champignon rouge', { ...PLANT });
def(111, 'red_mushroom_block', 'Chapeau de champignon rouge', { hardness: 0.2, tool: 'axe', sound: 'wood', drop: 'red_mushroom', dropCount: [0, 2], category: 'nature' });
def(112, 'mushroom_stem', 'Pied de champignon', { hardness: 0.2, tool: 'axe', sound: 'wood', drop: null, category: 'nature' });
def(113, 'mycelium', 'Mycélium', { hardness: 0.6, tool: 'shovel', sound: 'grass', tex: { top: 'mycelium_top', bottom: 'dirt', side: 'mycelium_side' }, drop: 'dirt', category: 'nature', tick: 'mycelium' });
def(114, 'podzol', 'Podzol', { hardness: 0.5, tool: 'shovel', sound: 'gravel', tex: { top: 'podzol_top', bottom: 'dirt', side: 'podzol_side' }, drop: 'dirt', category: 'nature' });
def(115, 'moss_block', 'Bloc de mousse', { hardness: 0.1, tool: 'hoe', sound: 'grass', category: 'nature' });
def(116, 'vine', 'Lianes', { shape: 'vine', hardness: 0.2, tool: 'shears', sound: 'plant', tint: Tint.Foliage, climbable: true, replaceable: true, drop: null, category: 'nature', flammable: true });
def(117, 'lily_pad', 'Nénuphar', { shape: 'lily', hardness: 0, sound: 'plant', tint: Tint.Fixed, tintColor: 0x208030, category: 'nature' });
def(118, 'seagrass', 'Herbe marine', { ...PLANT, waterlogged: true, replaceable: true, drop: null, tint: Tint.None });
def(119, 'kelp', 'Varech', { ...PLANT, waterlogged: true, drop: 'kelp', category: null });
def(120, 'tube_coral_block', 'Bloc de corail bleu', { ...STONE, category: 'nature' });
def(121, 'brain_coral_block', 'Bloc de corail rose', { ...STONE, category: 'nature' });
def(122, 'farmland', 'Terre labourée', { shape: 'farmland', hardness: 0.6, tool: 'shovel', sound: 'gravel', tex: { top: 'farmland', bottom: 'dirt', side: 'dirt' }, activeTex: 'farmland_moist', drop: 'dirt', category: null, tick: 'farmland', pass: Pass.Opaque });
def(123, 'wheat', 'Blé', { shape: 'crop', hardness: 0, sound: 'plant', tex: 'wheat_stage7', maxStage: 7, tick: 'crop', category: null, drop: 'wheat' });
def(124, 'carrots', 'Carottes', { shape: 'crop', hardness: 0, sound: 'plant', tex: 'carrots_stage3', maxStage: 7, tick: 'crop', category: null, drop: 'carrot' });
def(125, 'potatoes', 'Pommes de terre', { shape: 'crop', hardness: 0, sound: 'plant', tex: 'potatoes_stage3', maxStage: 7, tick: 'crop', category: null, drop: 'potato' });
def(126, 'beetroots', 'Betteraves', { shape: 'crop', hardness: 0, sound: 'plant', tex: 'beetroots_stage3', maxStage: 7, tick: 'crop', category: null, drop: 'beetroot' });

// ---------------------------------------------------------------- Blocs fonctionnels
def(127, 'ladder', 'Échelle', { shape: 'ladder', hardness: 0.4, tool: 'axe', sound: 'wood', climbable: true, orient: 'facing', category: 'items' });
def(128, 'oak_door', 'Porte en chêne', { shape: 'door', hardness: 3, tool: 'axe', sound: 'wood', tex: { top: 'oak_door_top', bottom: 'oak_door_bottom', side: 'oak_door_bottom' }, interact: 'door', orient: 'facing', powerConsumer: true, category: null });
def(129, 'iron_door', 'Porte en fer', { shape: 'door', hardness: 5, tool: 'pickaxe', sound: 'metal', tex: { top: 'iron_door_top', bottom: 'iron_door_bottom', side: 'iron_door_bottom' }, orient: 'facing', powerConsumer: true, category: null });
def(130, 'oak_trapdoor', 'Trappe en chêne', { shape: 'trapdoor', hardness: 3, tool: 'axe', sound: 'wood', interact: 'trapdoor', orient: 'facing', powerConsumer: true, category: 'items' });
def(131, 'oak_fence', 'Barrière en chêne', { shape: 'fence', hardness: 2, tool: 'axe', sound: 'wood', tex: 'oak_planks', category: 'construction', flammable: true });
def(132, 'glass_pane', 'Vitre', { shape: 'pane', hardness: 0.3, sound: 'glass', tex: 'glass', drop: null });
def(133, 'oak_slab', 'Dalle en chêne', { shape: 'slab', ...WOOD, tex: 'oak_planks' });
def(134, 'stone_slab', 'Dalle en pierre', { shape: 'slab', ...STONE, tex: { side: 'smooth_stone_slab_side', top: 'smooth_stone', bottom: 'smooth_stone' } });
def(135, 'cobblestone_slab', 'Dalle en pavé', { shape: 'slab', ...STONE, tex: 'cobblestone' });
def(136, 'oak_stairs', 'Escalier en chêne', { shape: 'stairs', ...WOOD, tex: 'oak_planks', orient: 'facing' });
def(137, 'cobblestone_stairs', 'Escalier en pavé', { shape: 'stairs', ...STONE, tex: 'cobblestone', orient: 'facing' });
def(138, 'stone_brick_stairs', 'Escalier en briques de pierre', { shape: 'stairs', ...STONE, tex: 'stone_bricks', orient: 'facing' });
def(139, 'brick_stairs', 'Escalier en briques', { shape: 'stairs', ...STONE, tex: 'bricks', orient: 'facing' });

const WOOL_COLORS: Array<[string, string]> = [
  ['white', 'blanche'],
  ['orange', 'orange'],
  ['magenta', 'magenta'],
  ['light_blue', 'bleu clair'],
  ['yellow', 'jaune'],
  ['lime', 'vert clair'],
  ['pink', 'rose'],
  ['gray', 'grise'],
  ['light_gray', 'gris clair'],
  ['cyan', 'cyan'],
  ['purple', 'violette'],
  ['blue', 'bleue'],
  ['brown', 'marron'],
  ['green', 'verte'],
  ['red', 'rouge'],
  ['black', 'noire'],
];
export const DYE_COLORS = WOOL_COLORS.map((c) => c[0]);
WOOL_COLORS.forEach(([c, fr], i) => def(140 + i, c + '_wool', 'Laine ' + fr, { ...WOOL }));

def(157, 'red_bed', 'Lit', { shape: 'bed', hardness: 0.2, sound: 'wood', tex: { top: 'bed_top', bottom: 'oak_planks', side: 'bed_side' }, interact: 'bed', orient: 'facing', category: null, pass: Pass.Opaque });
def(158, 'tnt', 'TNT', { hardness: 0, sound: 'grass', tex: { side: 'tnt_side', top: 'tnt_top', bottom: 'tnt_bottom' }, interact: 'tnt', powerConsumer: true, category: 'items' });
def(159, 'lever', 'Levier', { shape: 'lever', hardness: 0.5, sound: 'wood', tex: 'cobblestone', interact: 'lever', powerSource: true, orient: 'facing_any', category: 'items' });
def(160, 'stone_button', 'Bouton en pierre', { shape: 'button', hardness: 0.5, sound: 'stone', tex: 'stone', interact: 'button', powerSource: true, orient: 'facing_any', category: 'items' });
def(161, 'oak_button', 'Bouton en chêne', { shape: 'button', hardness: 0.5, sound: 'wood', tex: 'oak_planks', interact: 'button', powerSource: true, orient: 'facing_any', category: 'items' });
def(162, 'stone_pressure_plate', 'Plaque de pression en pierre', { shape: 'plate', hardness: 0.5, tex: 'stone', powerSource: true, category: 'items' });
def(163, 'oak_pressure_plate', 'Plaque de pression en chêne', { shape: 'plate', hardness: 0.5, sound: 'wood', tex: 'oak_planks', powerSource: true, category: 'items' });
def(164, 'energy_wire', "Fil d'énergie", { shape: 'wire', hardness: 0, sound: 'stone', tex: 'energy_wire', tint: Tint.Fixed, tintColor: 0xff2020, drop: 'energy_dust', category: null });
def(166, 'rail', 'Rail', { shape: 'rail', hardness: 0.7, tool: 'pickaxe', sound: 'metal', category: 'items' });
def(167, 'powered_rail', 'Rail propulseur', { shape: 'rail', hardness: 0.7, tool: 'pickaxe', sound: 'metal', activeTex: 'powered_rail_on', powerConsumer: true, category: 'items' });
def(168, 'elevator', 'Ascenseur', { hardness: 1.5, tool: 'pickaxe', sound: 'metal', interact: 'elevator', category: 'items' });

// ---------------------------------------------------------------- Dimensions et blocs magiques
def(171, 'ember_portal', 'Portail de braise', { shape: 'portal', pass: Pass.Translucent, solid: false, hardness: -1, light: 11, sound: 'glass', category: null });
def(172, 'sky_portal', 'Portail céleste', { shape: 'portal', pass: Pass.Translucent, solid: false, hardness: -1, light: 11, sound: 'glass', category: null });
def(173, 'crystal_block', 'Bloc de cristal', { hardness: 1.5, tool: 'pickaxe', sound: 'glass', light: 4, category: 'nature' });
def(174, 'crystal_cluster', 'Amas de cristal', { ...PLANT, hardness: 1.5, tool: 'pickaxe', sound: 'glass', light: 8, drop: 'crystal_shard', dropCount: [2, 4], flammable: false });
def(176, 'basalt', 'Basalte', { ...STONE, hardness: 1.25, orient: 'axis', tex: { side: 'basalt_side', end: 'basalt_top' }, category: 'nature' });
def(177, 'magma', 'Bloc de magma', { ...STONE, hardness: 0.5, light: 3, damage: 1, category: 'nature' });
def(178, 'ash', 'Cendre', { hardness: 0.5, tool: 'shovel', sound: 'sand', gravity: true, category: 'nature' });
def(179, 'ember_stone', 'Pierre de braise', { ...STONE, hardness: 0.6, category: 'nature' });
def(180, 'ember_ore', 'Minerai de braise', ORE(2, 'ember_shard', [3, 6], { hardness: 3, light: 7 }));
def(181, 'obsidian_bricks', "Briques d'obsidienne", { ...STONE, hardness: 30, level: 3 });
def(182, 'cloud', 'Bloc de nuage', { hardness: 0.3, sound: 'wool', pass: Pass.Translucent, opaque: false, filter: 1, slow: 2, category: 'nature' });
def(183, 'sky_stone', 'Pierre céleste', { ...STONE, category: 'nature' });
def(184, 'sky_grass', 'Herbe céleste', { hardness: 0.6, tool: 'shovel', sound: 'grass', tex: { top: 'sky_grass_top', bottom: 'sky_dirt', side: 'sky_grass_side' }, drop: 'sky_dirt', category: 'nature' });
def(185, 'golden_log', 'Bûche dorée', LOG('golden'));
def(186, 'golden_leaves', 'Feuilles dorées', { ...LEAVES('golden', Tint.None, 0xffffff, 'golden_sapling'), light: 5 });
def(187, 'bone_block', "Bloc d'os", { ...STONE, hardness: 2, orient: 'axis', tex: { side: 'bone_block_side', end: 'bone_block_top' }, category: 'nature' });
def(188, 'spawner', 'Générateur de monstres', { ...STONE, hardness: 5, pass: Pass.Cutout, opaque: false, drop: null, xp: [15, 43], sound: 'metal', category: null });
def(189, 'cobweb', "Toile d'araignée", { shape: 'cross', hardness: 4, tool: 'sword', sound: 'wool', slow: 4, drop: 'string', category: 'nature', solid: false });
def(190, 'sky_dirt', 'Terre céleste', { hardness: 0.5, tool: 'shovel', sound: 'gravel', category: 'nature' });
def(194, 'fire', 'Feu', { shape: 'fire', hardness: 0, light: 15, damage: 1, sound: 'wool', tex: 'fire', drop: null, replaceable: true, tick: 'fire', category: null });
def(195, 'hay_block', 'Botte de foin', { hardness: 0.5, tool: 'hoe', sound: 'grass', orient: 'axis', tex: { side: 'hay_block_side', end: 'hay_block_top' }, flammable: true });
def(196, 'dirt_path', 'Chemin de terre', { shape: 'farmland', hardness: 0.65, tool: 'shovel', sound: 'gravel', tex: { top: 'dirt_path_top', bottom: 'dirt', side: 'dirt_path_side' }, drop: 'dirt', category: 'nature', pass: Pass.Opaque });
def(197, 'coarse_dirt', 'Terre stérile', { hardness: 0.5, tool: 'shovel', sound: 'gravel', category: 'nature' });
def(198, 'mud', 'Boue', { hardness: 0.5, tool: 'shovel', sound: 'gravel', slow: 1, category: 'nature' });
def(199, 'iron_bars', 'Barreaux de fer', { shape: 'pane', hardness: 5, tool: 'pickaxe', sound: 'metal', tex: 'iron_bars' });
def(200, 'campfire', 'Feu de camp', { shape: 'campfire', hardness: 2, tool: 'axe', sound: 'wood', light: 15, damage: 1, tex: { side: 'campfire_log', top: 'campfire_log', bottom: 'campfire_log' }, drop: 'charcoal', dropCount: [2, 2], category: 'items' });
def(201, 'barrel', 'Tonneau', { ...WOOD, hardness: 2.5, tex: { side: 'barrel_side', top: 'barrel_top', bottom: 'barrel_bottom' }, interact: 'barrel', orient: 'facing_any', category: 'items' });
def(202, 'smooth_sandstone', 'Grès lisse', { hardness: 2, tool: 'pickaxe', tex: 'sandstone_top' });
def(203, 'chiseled_stone_bricks', 'Briques de pierre sculptées', { ...STONE });
def(204, 'quartz_block', 'Bloc de quartz', { hardness: 0.8, tool: 'pickaxe', tex: { side: 'quartz_block_side', end: 'quartz_block_top' } });
def(205, 'white_concrete', 'Béton blanc', { ...STONE, hardness: 1.8 });
def(206, 'gray_concrete', 'Béton gris', { ...STONE, hardness: 1.8 });
def(207, 'black_concrete', 'Béton noir', { ...STONE, hardness: 1.8 });
def(208, 'blue_concrete', 'Béton bleu', { ...STONE, hardness: 1.8 });
def(209, 'red_concrete', 'Béton rouge', { ...STONE, hardness: 1.8 });
def(210, 'yellow_concrete', 'Béton jaune', { ...STONE, hardness: 1.8 });
def(211, 'green_concrete', 'Béton vert', { ...STONE, hardness: 1.8 });
def(212, 'metal_panel', 'Panneau métallique', { ...STONE, hardness: 4, sound: 'metal' });
def(213, 'tinted_glass', 'Verre teinté', { hardness: 0.3, sound: 'glass', pass: Pass.Translucent, opaque: false, filter: 15 });
def(214, 'blue_stained_glass', 'Verre bleu', { hardness: 0.3, sound: 'glass', pass: Pass.Translucent, opaque: false, drop: null });
def(215, 'glow_lichen', 'Lichen lumineux', { shape: 'vine', hardness: 0.2, tool: 'shears', sound: 'plant', light: 7, replaceable: true, drop: null, category: 'nature' });
def(216, 'glow_mushroom', 'Champignon luminescent', { ...PLANT, light: 10 });
def(217, 'oak_sapling', 'Pousse de chêne', { ...PLANT, tick: 'sapling', sapling: 'oak' });
def(218, 'birch_sapling', 'Pousse de bouleau', { ...PLANT, tick: 'sapling', sapling: 'birch' });
def(219, 'spruce_sapling', 'Pousse de sapin', { ...PLANT, tick: 'sapling', sapling: 'spruce' });
def(220, 'jungle_sapling', 'Pousse de jungle', { ...PLANT, tick: 'sapling', sapling: 'jungle' });
def(221, 'acacia_sapling', "Pousse d'acacia", { ...PLANT, tick: 'sapling', sapling: 'acacia' });
def(222, 'dark_oak_sapling', 'Pousse de chêne noir', { ...PLANT, tick: 'sapling', sapling: 'dark_oak' });
def(223, 'cherry_sapling', 'Pousse de cerisier', { ...PLANT, tick: 'sapling', sapling: 'cherry' });
def(224, 'palm_sapling', 'Pousse de palmier', { ...PLANT, tick: 'sapling', sapling: 'palm' });
def(225, 'golden_sapling', 'Pousse dorée', { ...PLANT, tick: 'sapling', sapling: 'golden' });
def(226, 'white_carpet', 'Tapis blanc', { shape: 'carpet', hardness: 0.1, sound: 'wool', tex: 'white_wool' });
def(227, 'red_carpet', 'Tapis rouge', { shape: 'carpet', hardness: 0.1, sound: 'wool', tex: 'red_wool' });
def(228, 'blue_carpet', 'Tapis bleu', { shape: 'carpet', hardness: 0.1, sound: 'wool', tex: 'blue_wool' });
def(229, 'ancient_bricks', 'Briques antiques', { ...STONE, hardness: 4, level: 1 });
def(230, 'ancient_core', 'Cœur antique', { ...STONE, hardness: -1, light: 12, category: null });
def(231, 'calcite', 'Calcite', { ...STONE, hardness: 0.75, category: 'nature' });
def(232, 'tuff', 'Tuf', { ...STONE, category: 'nature' });
def(233, 'ash_grass', 'Herbe cendrée', { hardness: 0.6, tool: 'shovel', sound: 'grass', tex: { top: 'ash_grass_top', bottom: 'dirt', side: 'ash_grass_side' }, drop: 'dirt', category: 'nature' });
def(234, 'dry_shrub', 'Arbuste sec', { ...PLANT, replaceable: true, drop: 'stick', dropCount: [0, 1] });
def(235, 'stripped_oak_log', 'Bûche de chêne écorcée', { ...WOOD, orient: 'axis', tex: { side: 'stripped_oak_log', end: 'stripped_oak_log_top' } });
def(236, 'abyss_stone', 'Pierre des abysses', { ...STONE, hardness: 4, category: 'nature' });
// Minerais rares des dimensions : étherium (Terres de braise) et célestine (Royaume céleste).
def(237, 'etherium_ore', "Minerai d'étherium", ORE(3, 'raw_etherium', [4, 8], { hardness: 5, light: 5 }));
def(238, 'etherium_block', "Bloc d'étherium", { ...STONE, hardness: 7, level: 3, sound: 'metal', light: 4 });
def(239, 'celestine_ore', 'Minerai de célestine', ORE(3, 'celestine', [5, 10], { hardness: 5, light: 6, dropCount: [1, 2] }));
def(240, 'celestine_block', 'Bloc de célestine', { ...STONE, hardness: 7, level: 3, sound: 'glass', light: 8 });

/** Nombre maximal d'identifiants (taille des tables de recherche). */
export const BLOCK_ID_COUNT = 1024;

export const AIR = 0;

/** Tables rapides pour les boucles critiques (génération, maillage, lumière, collisions). */
export const OPAQUE = new Uint8Array(BLOCK_ID_COUNT);
export const SOLID = new Uint8Array(BLOCK_ID_COUNT);
export const LIGHT_EMIT = new Uint8Array(BLOCK_ID_COUNT);
export const LIGHT_FILTER = new Uint8Array(BLOCK_ID_COUNT);
export const IS_LIQUID = new Uint8Array(BLOCK_ID_COUNT);
export const WATERLOGGED = new Uint8Array(BLOCK_ID_COUNT);
export const REPLACEABLE = new Uint8Array(BLOCK_ID_COUNT);
export const SHAPE_CUBE = new Uint8Array(BLOCK_ID_COUNT);
/** Lumière dépendant de l'état : émise si (méta & masque) != 0 (four allumé, lampe alimentée). */
export const META_LIGHT_MASK = new Uint8Array(BLOCK_ID_COUNT);
export const META_LIGHT_VALUE = new Uint8Array(BLOCK_ID_COUNT);

for (const b of BLOCKS) {
  if (!b) continue;
  OPAQUE[b.id] = b.opaque ? 1 : 0;
  SOLID[b.id] = b.solid ? 1 : 0;
  LIGHT_EMIT[b.id] = b.light;
  LIGHT_FILTER[b.id] = b.opaque ? 15 : b.filter;
  IS_LIQUID[b.id] = b.shape === 'liquid' ? 1 : 0;
  WATERLOGGED[b.id] = b.waterlogged || b.key === 'water' ? 1 : 0;
  REPLACEABLE[b.id] = b.replaceable || b.id === AIR ? 1 : 0;
  SHAPE_CUBE[b.id] = b.shape === 'cube' ? 1 : 0;
}
META_LIGHT_MASK[86] = 4; // four allumé
META_LIGHT_VALUE[86] = 13;
META_LIGHT_MASK[91] = 1; // lampe alimentée
META_LIGHT_VALUE[91] = 15;
META_LIGHT_MASK[167] = 16; // rail propulseur actif
META_LIGHT_VALUE[167] = 6;

/** Lumière émise par un bloc brut (identifiant + état). */
export function emittedLight(raw: number): number {
  const id = raw & 0x3ff;
  const m = META_LIGHT_MASK[id];
  if (m && ((raw >> 10) & m)) return META_LIGHT_VALUE[id];
  return LIGHT_EMIT[id];
}

export function blockByKey(key: string): BlockDef {
  const b = BLOCK_BY_KEY.get(key);
  if (!b) throw new Error('Bloc inconnu : ' + key);
  return b;
}

/** Identifiant numérique d'un bloc par sa clé (utilisé partout dans la génération). */
export const B = new Proxy({} as Record<string, number>, {
  get(_t, key: string) {
    const b = BLOCK_BY_KEY.get(key);
    if (!b) throw new Error('Bloc inconnu : ' + key);
    return b.id;
  },
});

export function getBlock(id: number): BlockDef {
  return BLOCKS[id] ?? BLOCKS[0];
}

/** Liste de toutes les textures de blocs, dans un ordre stable. */
export function allBlockTextures(): string[] {
  const set = new Set<string>();
  for (const b of BLOCKS) {
    if (!b) continue;
    const t = b.tex;
    for (const n of [t.top, t.bottom, t.north, t.south, t.east, t.west, t.overlay, b.front, b.activeTex]) if (n) set.add(n);
  }
  // Textures d'étapes de croissance et textures annexes utilisées par les formes.
  for (let s = 0; s <= 7; s++) set.add('wheat_stage' + s);
  for (let s = 0; s <= 3; s++) {
    set.add('carrots_stage' + s);
    set.add('potatoes_stage' + s);
    set.add('beetroots_stage' + s);
  }
  for (const n of ['rail_corner', 'powered_rail', 'lever_handle', 'destroy_0', 'oak_door_top', 'chest_front', 'lantern', 'campfire_fire', 'torch', 'oak_trapdoor', 'energy_wire_on']) set.add(n);
  for (let i = 0; i < 10; i++) set.add('destroy_' + i);
  return [...set];
}
