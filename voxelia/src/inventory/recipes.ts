/**
 * CraftingSystem — recettes (avec forme / sans forme), cuisson au four, combustibles.
 * Les ingrédients peuvent être une clé d'objet ou une étiquette (#planches, #bûches…).
 */
import { BLOCKS } from '../world/blocks';
import { ITEMS, ITEM_BY_KEY, TOOL_MATERIALS, ARMOR_MATERIALS, type ItemStack } from '../items/items';

export interface Recipe {
  id: string;
  result: string;
  count: number;
  /** Recette avec forme : lignes et légende ; sans forme : liste d'ingrédients. */
  pattern?: string[];
  key?: Record<string, string>;
  ingredients?: string[];
  /** Nécessite un établi (grille 3x3). */
  needsTable: boolean;
  category: 'construction' | 'equipment' | 'items' | 'nature';
}

export interface SmeltRecipe {
  input: string;
  result: string;
  xp: number;
}

/** Étiquettes d'ingrédients. */
export const TAGS: Record<string, string[]> = {
  '#planks': BLOCKS.filter((b) => b && b.key.endsWith('_planks')).map((b) => b.key),
  '#logs': BLOCKS.filter((b) => b && (b.key.endsWith('_log') && b.category !== null)).map((b) => b.key),
  '#wool': BLOCKS.filter((b) => b && b.key.endsWith('_wool')).map((b) => b.key),
  '#stone_tool': ['cobblestone', 'cobbled_deepslate', 'basalt'],
  '#coal': ['coal', 'charcoal'],
  '#sand': ['sand', 'red_sand'],
};

export const RECIPES: Recipe[] = [];
export const SMELTING: SmeltRecipe[] = [];

function cat(result: string): Recipe['category'] {
  return (ITEM_BY_KEY.get(result)?.category ?? 'items') as Recipe['category'];
}

function shaped(result: string, count: number, pattern: string[], key: Record<string, string>): void {
  if (!ITEM_BY_KEY.has(result)) throw new Error('Recette : objet inconnu ' + result);
  const needsTable = pattern.length > 2 || pattern.some((r) => r.length > 2);
  RECIPES.push({ id: `${result}#${RECIPES.length}`, result, count, pattern, key, needsTable, category: cat(result) });
}

function shapeless(result: string, count: number, ingredients: string[]): void {
  if (!ITEM_BY_KEY.has(result)) throw new Error('Recette : objet inconnu ' + result);
  RECIPES.push({ id: `${result}#${RECIPES.length}`, result, count, ingredients, needsTable: ingredients.length > 4, category: cat(result) });
}

function smelt(input: string, result: string, xp = 0.1): void {
  SMELTING.push({ input, result, xp });
}

// ------------------------------------------------------------------ bois
for (const w of ['oak', 'birch', 'spruce', 'jungle', 'acacia', 'dark_oak', 'cherry', 'palm', 'golden']) {
  const planks = w === 'palm' || w === 'golden' ? 'oak_planks' : `${w}_planks`;
  shapeless(planks, 4, [`${w}_log`]);
}
shapeless('oak_planks', 4, ['stripped_oak_log']);
shaped('stick', 4, ['#', '#'], { '#': '#planks' });
shaped('crafting_table', 1, ['##', '##'], { '#': '#planks' });
shaped('chest', 1, ['###', '# #', '###'], { '#': '#planks' });
shaped('barrel', 1, ['#S#', '# #', '#S#'], { '#': '#planks', S: 'oak_slab' });
shaped('furnace', 1, ['###', '# #', '###'], { '#': '#stone_tool' });
shaped('torch', 4, ['C', 'S'], { C: '#coal', S: 'stick' });
shaped('ladder', 3, ['S S', 'SSS', 'S S'], { S: 'stick' });
shaped('oak_door', 3, ['##', '##', '##'], { '#': '#planks' });
shaped('oak_trapdoor', 2, ['###', '###'], { '#': '#planks' });
shaped('oak_fence', 3, ['#S#', '#S#'], { '#': '#planks', S: 'stick' });
shaped('oak_slab', 6, ['###'], { '#': '#planks' });
shaped('oak_stairs', 4, ['#  ', '## ', '###'], { '#': '#planks' });
shaped('oak_button', 1, ['#'], { '#': '#planks' });
shaped('oak_pressure_plate', 1, ['##'], { '#': '#planks' });
shaped('bookshelf', 1, ['###', 'BBB', '###'], { '#': '#planks', B: 'book' });
shaped('oak_boat', 1, ['# #', '###'], { '#': '#planks' });
shaped('bed', 1, ['WWW', '###'], { W: '#wool', '#': '#planks' });
shaped('campfire', 1, [' S ', 'SCS', 'LLL'], { S: 'stick', C: '#coal', L: '#logs' });

// ------------------------------------------------------------------ pierre
shaped('stone_bricks', 4, ['##', '##'], { '#': 'stone' });
shaped('chiseled_stone_bricks', 1, ['#', '#'], { '#': 'stone_slab' });
shaped('stone_slab', 6, ['###'], { '#': 'smooth_stone' });
shaped('cobblestone_slab', 6, ['###'], { '#': 'cobblestone' });
shaped('cobblestone_stairs', 4, ['#  ', '## ', '###'], { '#': 'cobblestone' });
shaped('stone_brick_stairs', 4, ['#  ', '## ', '###'], { '#': 'stone_bricks' });
shaped('brick_stairs', 4, ['#  ', '## ', '###'], { '#': 'bricks' });
shaped('bricks', 1, ['##', '##'], { '#': 'brick' });
shaped('polished_granite', 4, ['##', '##'], { '#': 'granite' });
shaped('sandstone', 1, ['##', '##'], { '#': 'sand' });
shaped('red_sandstone', 1, ['##', '##'], { '#': 'red_sand' });
shaped('smooth_sandstone', 4, ['##', '##'], { '#': 'sandstone' });
shapeless('mossy_cobblestone', 1, ['cobblestone', 'vine']);
shapeless('mossy_stone_bricks', 1, ['stone_bricks', 'vine']);
shaped('stone_button', 1, ['#'], { '#': 'stone' });
shaped('stone_pressure_plate', 1, ['##'], { '#': 'stone' });
shaped('lever', 1, ['S', '#'], { S: 'stick', '#': 'cobblestone' });
shaped('obsidian_bricks', 4, ['##', '##'], { '#': 'obsidian' });
shaped('white_concrete', 8, ['SGS', 'GBG', 'SGS'], { S: '#sand', G: 'gravel', B: 'bone_meal' });
shaped('quartz_block', 1, ['##', '##'], { '#': 'calcite' });

// ------------------------------------------------------------------ verre et lumière
shaped('glass_pane', 16, ['###', '###'], { '#': 'glass' });
shaped('iron_bars', 16, ['###', '###'], { '#': 'iron_ingot' });
shaped('glowstone', 1, ['##', '##'], { '#': 'glowstone_dust' });
shaped('lantern', 1, ['NNN', 'NTN', 'NNN'], { N: 'iron_nugget', T: 'torch' });
shaped('lamp', 1, [' E ', 'EGE', ' E '], { E: 'energy_dust', G: 'glowstone' });
shaped('sea_lantern', 1, ['CDC', 'DDD', 'CDC'], { C: 'crystal_shard', D: 'glowstone_dust' });
shaped('crystal_block', 1, ['##', '##'], { '#': 'crystal_shard' });
shaped('tinted_glass', 2, [' C ', 'CGC', ' C '], { C: 'coal', G: 'glass' });
shapeless('blue_stained_glass', 1, ['glass', 'cornflower']);

// ------------------------------------------------------------------ mécanismes et transports
shaped('tnt', 1, ['GSG', 'SGS', 'GSG'], { G: 'gunpowder', S: '#sand' });
shaped('rail', 16, ['I I', 'ISI', 'I I'], { I: 'iron_ingot', S: 'stick' });
shaped('powered_rail', 6, ['G G', 'GSG', 'GEG'], { G: 'gold_ingot', S: 'stick', E: 'energy_dust' });
shaped('minecart', 1, ['I I', 'III'], { I: 'iron_ingot' });
shaped('elevator', 1, ['III', 'IEI', 'III'], { I: 'iron_ingot', E: 'energy_dust' });
shaped('iron_door_item', 3, ['II', 'II', 'II'], { I: 'iron_ingot' });
shaped('saddle', 1, ['LLL', 'LIL'], { L: 'leather', I: 'iron_ingot' });
shaped('glider', 1, ['FFF', 'FKF', 'F F'], { F: 'feather', K: 'sky_feather' });
shaped('flying_carpet', 1, ['WWW', 'KCK'], { W: '#wool', K: 'sky_feather', C: 'crystal_shard' });
shaped('sky_key', 1, [' C ', 'CGC', ' C '], { C: 'crystal_shard', G: 'gold_ingot' });

// ------------------------------------------------------------------ outils, armes, armures
for (const m of TOOL_MATERIALS) {
  const X = m.key === 'wooden' ? '#planks' : m.key === 'stone' ? '#stone_tool' : m.ingredient;
  shaped(`${m.key}_pickaxe`, 1, ['XXX', ' S ', ' S '], { X, S: 'stick' });
  shaped(`${m.key}_axe`, 1, ['XX', 'XS', ' S'], { X, S: 'stick' });
  shaped(`${m.key}_shovel`, 1, ['X', 'S', 'S'], { X, S: 'stick' });
  shaped(`${m.key}_hoe`, 1, ['XX', ' S', ' S'], { X, S: 'stick' });
  shaped(`${m.key}_sword`, 1, ['X', 'X', 'S'], { X, S: 'stick' });
}
for (const m of ARMOR_MATERIALS) {
  const X = m.ingredient;
  shaped(`${m.key}_helmet`, 1, ['XXX', 'X X'], { X });
  shaped(`${m.key}_chestplate`, 1, ['X X', 'XXX', 'XXX'], { X });
  shaped(`${m.key}_leggings`, 1, ['XXX', 'X X', 'X X'], { X });
  shaped(`${m.key}_boots`, 1, ['X X', 'X X'], { X });
}
shaped('shears', 1, [' I', 'I '], { I: 'iron_ingot' });
shapeless('flint_and_steel', 1, ['iron_ingot', 'flint']);
shaped('bucket', 1, ['I I', ' I '], { I: 'iron_ingot' });
shaped('bow', 1, [' SW', 'S W', ' SW'], { S: 'stick', W: 'string' });
shaped('arrow', 4, ['F', 'S', 'P'], { F: 'flint', S: 'stick', P: 'feather' });
shaped('fishing_rod', 1, ['  S', ' SW', 'S W'], { S: 'stick', W: 'string' });
shaped('compass', 1, [' I ', 'IEI', ' I '], { I: 'iron_ingot', E: 'energy_dust' });
shaped('map', 1, ['PPP', 'PCP', 'PPP'], { P: 'paper', C: 'compass' });

// ------------------------------------------------------------------ matériaux et compactage
const compact: Array<[string, string]> = [
  ['iron_block', 'iron_ingot'],
  ['gold_block', 'gold_ingot'],
  ['diamond_block', 'diamond'],
  ['emerald_block', 'emerald'],
  ['coal_block', 'coal'],
  ['copper_block', 'copper_ingot'],
  ['sapphire_block', 'sapphire'],
  ['energy_block', 'energy_dust'],
  ['mythril_block', 'mythril_ingot'],
  ['etherium_block', 'etherium_ingot'],
  ['celestine_block', 'celestine'],
  ['hay_block', 'wheat'],
  ['bone_block', 'bone_meal'],
];
for (const [block, it] of compact) {
  shaped(block, 1, ['###', '###', '###'], { '#': it });
  shapeless(it, 9, [block]);
}
shaped('iron_ingot', 1, ['###', '###', '###'], { '#': 'iron_nugget' });
shapeless('iron_nugget', 9, ['iron_ingot']);
shaped('gold_ingot', 1, ['###', '###', '###'], { '#': 'gold_nugget' });
shapeless('gold_nugget', 9, ['gold_ingot']);
shaped('white_wool', 1, ['##', '##'], { '#': 'string' });
shaped('snow_block', 1, ['##', '##'], { '#': 'snowball' });
shaped('clay', 1, ['##', '##'], { '#': 'clay_ball' });
shaped('paper', 3, ['###'], { '#': 'sugar_cane' });
shapeless('sugar', 1, ['sugar_cane']);
shapeless('book', 1, ['paper', 'paper', 'paper', 'leather']);
shapeless('bone_meal', 3, ['bone']);
shapeless('beetroot_seeds', 1, ['beetroot']);
shapeless('wheat_seeds', 1, ['wheat']);
shaped('white_carpet', 3, ['##'], { '#': 'white_wool' });
shaped('red_carpet', 3, ['##'], { '#': 'red_wool' });
shaped('blue_carpet', 3, ['##'], { '#': 'blue_wool' });
const dyes: Array<[string, string]> = [
  ['red_wool', 'poppy'],
  ['red_wool', 'red_tulip'],
  ['yellow_wool', 'dandelion'],
  ['blue_wool', 'cornflower'],
  ['magenta_wool', 'allium'],
  ['light_gray_wool', 'oxeye_daisy'],
  ['black_wool', 'coal'],
  ['green_wool', 'cactus'],
  ['brown_wool', 'dirt'],
  ['light_blue_wool', 'crystal_shard'],
  ['orange_wool', 'pumpkin'],
  ['pink_wool', 'cherry_leaves'],
];
for (const [w, d] of dyes) shapeless(w, 1, ['white_wool', d]);

// ------------------------------------------------------------------ nourriture
shaped('bread', 1, ['WWW'], { W: 'wheat' });
shapeless('cookie', 8, ['wheat', 'sugar', 'wheat']);
shapeless('pumpkin_pie', 1, ['pumpkin', 'sugar', 'egg']);
shapeless('mushroom_stew', 1, ['brown_mushroom', 'red_mushroom']);
shapeless('beetroot_soup', 1, ['beetroot', 'beetroot', 'beetroot', 'beetroot', 'beetroot', 'beetroot']);
shaped('golden_apple', 1, ['GGG', 'GAG', 'GGG'], { G: 'gold_ingot', A: 'apple' });
shaped('honey_cake', 1, ['WSW', 'ECE', 'WSW'], { W: 'wheat', S: 'sugar', E: 'egg', C: 'crystal_shard' });
shapeless('melon', 1, ['melon_slice', 'melon_slice', 'melon_slice', 'melon_slice', 'melon_slice', 'melon_slice', 'melon_slice', 'melon_slice', 'melon_slice']);

// ------------------------------------------------------------------ four
smelt('raw_iron', 'iron_ingot', 0.7);
smelt('raw_gold', 'gold_ingot', 1);
smelt('raw_copper', 'copper_ingot', 0.7);
smelt('raw_mythril', 'mythril_ingot', 2);
smelt('raw_etherium', 'etherium_ingot', 2);
smelt('iron_ore', 'iron_ingot', 0.7);
smelt('gold_ore', 'gold_ingot', 1);
smelt('copper_ore', 'copper_ingot', 0.7);
smelt('sand', 'glass', 0.1);
smelt('red_sand', 'glass', 0.1);
smelt('cobblestone', 'stone', 0.1);
smelt('cobbled_deepslate', 'deepslate', 0.1);
smelt('stone', 'smooth_stone', 0.1);
smelt('stone_bricks', 'cracked_stone_bricks', 0.1);
smelt('clay_ball', 'brick', 0.3);
smelt('clay', 'terracotta', 0.35);
smelt('cactus', 'green_wool', 0.2);
smelt('kelp', 'dried_kelp', 0.1);
smelt('raw_beef', 'steak', 0.35);
smelt('raw_porkchop', 'cooked_porkchop', 0.35);
smelt('raw_chicken', 'cooked_chicken', 0.35);
smelt('raw_mutton', 'cooked_mutton', 0.35);
smelt('raw_venison', 'cooked_venison', 0.35);
smelt('raw_cod', 'cooked_cod', 0.35);
smelt('raw_salmon', 'cooked_salmon', 0.35);
smelt('potato', 'baked_potato', 0.35);
smelt('ember_ore', 'ember_shard', 1);
smelt('crystal_cluster', 'crystal_shard', 0.5);
for (const l of TAGS['#logs']) smelt(l, 'charcoal', 0.15);

// ------------------------------------------------------------------ correspondance

export function matchesIngredient(ing: string, s: ItemStack | null): boolean {
  if (!s) return false;
  const key = ITEMS[s.id]?.key;
  if (!key) return false;
  if (ing.startsWith('#')) return TAGS[ing]?.includes(key) ?? false;
  return ing === key;
}

/** Cherche une recette correspondant à la grille (w x h). */
export function findRecipe(grid: Array<ItemStack | null>, w: number, h: number): Recipe | null {
  // Boîte englobante des cases occupées
  let minX = w,
    minY = h,
    maxX = -1,
    maxY = -1;
  let filled = 0;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (grid[y * w + x]) {
        filled++;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
  if (!filled) return null;
  const bw = maxX - minX + 1;
  const bh = maxY - minY + 1;
  for (const r of RECIPES) {
    if (r.pattern) {
      const ph = r.pattern.length;
      const pw = Math.max(...r.pattern.map((p) => p.length));
      if (ph !== bh || pw !== bw) continue;
      for (const mirror of [false, true]) {
        let ok = true;
        for (let y = 0; y < ph && ok; y++)
          for (let x = 0; x < pw && ok; x++) {
            const ch = (r.pattern[y][mirror ? pw - 1 - x : x] ?? ' ').trim();
            const s = grid[(minY + y) * w + minX + x];
            if (!ch) ok = !s;
            else ok = matchesIngredient(r.key![ch], s);
          }
        if (ok) return r;
      }
    } else if (r.ingredients && r.ingredients.length === filled) {
      const used = new Array(r.ingredients.length).fill(false);
      let ok = true;
      for (const s of grid) {
        if (!s) continue;
        const k = r.ingredients.findIndex((ing, i) => !used[i] && matchesIngredient(ing, s));
        if (k < 0) {
          ok = false;
          break;
        }
        used[k] = true;
      }
      if (ok) return r;
    }
  }
  return null;
}

/** Liste des ingrédients nécessaires (clé/étiquette -> quantité). */
export function recipeCost(r: Recipe): Map<string, number> {
  const m = new Map<string, number>();
  if (r.pattern) {
    for (const row of r.pattern)
      for (const ch of row) {
        if (ch === ' ') continue;
        const ing = r.key![ch];
        m.set(ing, (m.get(ing) ?? 0) + 1);
      }
  } else for (const ing of r.ingredients!) m.set(ing, (m.get(ing) ?? 0) + 1);
  return m;
}

export function smeltResult(s: ItemStack | null): SmeltRecipe | null {
  if (!s) return null;
  const key = ITEMS[s.id]?.key;
  return SMELTING.find((r) => r.input === key) ?? null;
}

/** Objets représentatifs d'un ingrédient (pour l'affichage). */
export function ingredientItems(ing: string): string[] {
  return ing.startsWith('#') ? (TAGS[ing] ?? []) : [ing];
}
