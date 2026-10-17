/**
 * Registre des objets : objets-blocs (même identifiant que le bloc) et objets
 * (outils, armes, armures, nourriture, matériaux…). Les sauvegardes utilisent les clés.
 */
import { BLOCKS, BLOCK_BY_KEY, type Category, type Tool } from '../world/blocks';

export type ArmorSlot = 'head' | 'chest' | 'legs' | 'feet';
export type ItemUse =
  | 'food'
  | 'bucket'
  | 'water_bucket'
  | 'lava_bucket'
  | 'milk_bucket'
  | 'flint_and_steel'
  | 'sky_key'
  | 'bow'
  | 'boat'
  | 'minecart'
  | 'saddle'
  | 'spawn_egg'
  | 'bone_meal'
  | 'hoe'
  | 'shears'
  | 'fishing_rod'
  | 'glider'
  | 'carpet_ride'
  | 'map'
  | 'snowball'
  | 'egg'
  | 'compass';

export interface ToolInfo {
  type: Tool;
  level: number;
  speed: number;
  damage: number;
  durability: number;
}

export interface ItemDef {
  id: number;
  key: string;
  name: string;
  block?: number;
  maxStack: number;
  category: Category;
  tool?: ToolInfo;
  armor?: { slot: ArmorSlot; points: number; durability: number; material: string };
  food?: { hunger: number; saturation: number; effect?: string; always?: boolean };
  fuel?: number;
  use?: ItemUse;
  /** Données supplémentaires (type de créature pour les œufs…). */
  data?: string;
  /** Clé d'icône (sinon la clé de l'objet). */
  icon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  /** Dégâts d'attaque pour les objets non-outils (bâton = 1). */
  damage?: number;
  desc?: string;
}

export const ITEMS: ItemDef[] = [];
export const ITEM_BY_KEY = new Map<string, ItemDef>();
let nextId = 1024;

function add(d: Omit<ItemDef, 'id'> & { id?: number }): ItemDef {
  const item: ItemDef = { ...d, id: d.id ?? nextId++ };
  ITEMS[item.id] = item;
  ITEM_BY_KEY.set(item.key, item);
  return item;
}

// ------------------------------------------------------------------ objets-blocs
const FUEL_BLOCKS: Record<string, number> = { coal_block: 800, hay_block: 0 };
for (const b of BLOCKS) {
  if (!b || b.category === null || b.id === 0) continue;
  let fuel = FUEL_BLOCKS[b.key];
  if (fuel === undefined && b.flammable && (b.key.includes('planks') || b.key.includes('log') || b.key.includes('slab') || b.key.includes('stairs') || b.key.includes('fence') || b.key === 'bookshelf' || b.key === 'crafting_table' || b.key === 'chest' || b.key === 'ladder' || b.key === 'barrel')) fuel = b.key.includes('slab') ? 7.5 : 15;
  if (b.key.endsWith('_sapling')) fuel = 5;
  if (b.key.endsWith('_wool') || b.key.endsWith('_carpet')) fuel = 5;
  add({ id: b.id, key: b.key, name: b.name, block: b.id, maxStack: 64, category: b.category, fuel: fuel || undefined });
}
// Blocs utilisés par des objets spécifiques (portes, lits, cultures…) : pas d'objet-bloc direct.

// ------------------------------------------------------------------ matériaux
const mat = (key: string, name: string, extra: Partial<ItemDef> = {}) => add({ key, name, maxStack: 64, category: 'items', ...extra });
mat('stick', 'Bâton', { fuel: 5, damage: 1 });
mat('coal', 'Charbon', { fuel: 80 });
mat('charcoal', 'Charbon de bois', { fuel: 80 });
mat('raw_iron', 'Fer brut');
mat('iron_ingot', 'Lingot de fer');
mat('iron_nugget', 'Pépite de fer');
mat('raw_copper', 'Cuivre brut');
mat('copper_ingot', 'Lingot de cuivre');
mat('raw_gold', 'Or brut');
mat('gold_ingot', "Lingot d'or");
mat('gold_nugget', "Pépite d'or");
mat('diamond', 'Diamant');
mat('emerald', 'Émeraude', { desc: 'Monnaie des villageois' });
mat('sapphire', 'Saphir');
mat('energy_dust', "Poudre d'énergie", { block: BLOCK_BY_KEY.get('energy_wire')!.id });
mat('raw_mythril', 'Mythril brut', { rarity: 'rare' });
mat('mythril_ingot', 'Lingot de mythril', { rarity: 'rare' });
mat('crystal_shard', 'Éclat de cristal');
mat('ember_shard', 'Éclat de braise', { fuel: 120 });
mat('flint', 'Silex');
mat('clay_ball', "Boule d'argile");
mat('brick', 'Brique');
mat('string', 'Ficelle');
mat('feather', 'Plume');
mat('leather', 'Cuir');
mat('bone', 'Os');
mat('bone_meal', "Poudre d'os", { use: 'bone_meal' });
mat('gunpowder', 'Poudre à canon');
mat('glowstone_dust', 'Poudre lumineuse');
mat('paper', 'Papier');
mat('book', 'Livre');
mat('snowball', 'Boule de neige', { maxStack: 16, use: 'snowball' });
mat('wheat', 'Blé');
mat('wheat_seeds', 'Graines de blé', { block: BLOCK_BY_KEY.get('wheat')!.id });
mat('beetroot_seeds', 'Graines de betterave', { block: BLOCK_BY_KEY.get('beetroots')!.id });
mat('sugar', 'Sucre');
mat('egg', 'Œuf', { maxStack: 16, use: 'egg' });
mat('slime_ball', 'Boule de slime');
mat('kelp', 'Varech', { block: BLOCK_BY_KEY.get('kelp')!.id, category: 'nature' });
mat('sky_feather', 'Plume céleste', { rarity: 'rare' });
mat('golden_antler', "Bois de cerf doré", { rarity: 'legendary', desc: "Trophée d'une créature légendaire" });
mat('ancient_gear', 'Engrenage antique', { rarity: 'epic', desc: 'Récompense du Golem antique' });
mat('abyss_pearl', 'Perle des abysses', { rarity: 'epic', desc: 'Récompense du Gardien des profondeurs' });
mat('ember_crown', 'Couronne de braise', { rarity: 'legendary', desc: 'Récompense du Souverain des braises' });
mat('dragon_scale', 'Écaille de dragon', { rarity: 'legendary', desc: 'Récompense du Dragon des cieux' });
mat('rotten_flesh', 'Chair putréfiée', { food: { hunger: 4, saturation: 0.8, effect: 'hunger' } });
mat('spider_eye', "Œil d'araignée", { food: { hunger: 2, saturation: 3.2, effect: 'poison' } });
mat('magma_cream', 'Crème de magma');

// ------------------------------------------------------------------ outils et armes
interface Material {
  key: string;
  fr: string;
  level: number;
  speed: number;
  durability: number;
  dmg: number;
  ingredient: string;
  rarity?: ItemDef['rarity'];
}
export const TOOL_MATERIALS: Material[] = [
  { key: 'wooden', fr: 'en bois', level: 0, speed: 2, durability: 59, dmg: 0, ingredient: 'planks' },
  { key: 'stone', fr: 'en pierre', level: 1, speed: 4, durability: 131, dmg: 1, ingredient: 'cobblestone' },
  { key: 'iron', fr: 'en fer', level: 2, speed: 6, durability: 250, dmg: 2, ingredient: 'iron_ingot' },
  { key: 'golden', fr: 'en or', level: 0, speed: 12, durability: 32, dmg: 0, ingredient: 'gold_ingot' },
  { key: 'diamond', fr: 'en diamant', level: 3, speed: 8, durability: 1561, dmg: 3, ingredient: 'diamond' },
  { key: 'mythril', fr: 'en mythril', level: 4, speed: 10, durability: 2600, dmg: 4, ingredient: 'mythril_ingot', rarity: 'rare' },
];
const TOOL_KINDS: Array<{ k: string; fr: string; type: Tool; dmg: number }> = [
  { k: 'sword', fr: 'Épée', type: 'sword', dmg: 4 },
  { k: 'pickaxe', fr: 'Pioche', type: 'pickaxe', dmg: 2 },
  { k: 'axe', fr: 'Hache', type: 'axe', dmg: 6 },
  { k: 'shovel', fr: 'Pelle', type: 'shovel', dmg: 2.5 },
  { k: 'hoe', fr: 'Houe', type: 'hoe', dmg: 1 },
];
function addTools(m: Material): void {
  for (const t of TOOL_KINDS)
    add({
      key: `${m.key}_${t.k}`,
      name: `${t.fr} ${m.fr}`,
      maxStack: 1,
      category: 'equipment',
      tool: { type: t.type, level: m.level, speed: m.speed, damage: t.dmg + m.dmg, durability: m.durability },
      use: t.k === 'hoe' ? 'hoe' : undefined,
      fuel: m.key === 'wooden' ? 10 : undefined,
      rarity: m.rarity,
    });
}
for (const m of TOOL_MATERIALS) addTools(m);
add({ key: 'shears', name: 'Cisailles', maxStack: 1, category: 'equipment', tool: { type: 'shears', level: 0, speed: 5, damage: 1, durability: 238 }, use: 'shears' });
add({ key: 'flint_and_steel', name: 'Briquet', maxStack: 1, category: 'equipment', use: 'flint_and_steel', tool: { type: 'none', level: 0, speed: 1, damage: 1, durability: 64 }, desc: 'Allume le feu et les portails de braise' });
add({ key: 'sky_key', name: 'Clé céleste', maxStack: 1, category: 'equipment', use: 'sky_key', rarity: 'rare', desc: 'Active un cadre de portail en blocs de cristal' });
add({ key: 'bow', name: 'Arc', maxStack: 1, category: 'equipment', use: 'bow', tool: { type: 'none', level: 0, speed: 1, damage: 1, durability: 384 } });
add({ key: 'arrow', name: 'Flèche', maxStack: 64, category: 'equipment' });
add({ key: 'fishing_rod', name: 'Canne à pêche', maxStack: 1, category: 'equipment', use: 'fishing_rod', tool: { type: 'none', level: 0, speed: 1, damage: 1, durability: 64 } });
add({ key: 'bucket', name: 'Seau', maxStack: 16, category: 'equipment', use: 'bucket' });
add({ key: 'water_bucket', name: "Seau d'eau", maxStack: 1, category: 'equipment', use: 'water_bucket' });
add({ key: 'lava_bucket', name: 'Seau de lave', maxStack: 1, category: 'equipment', use: 'lava_bucket', fuel: 1000 });
add({ key: 'milk_bucket', name: 'Seau de lait', maxStack: 1, category: 'equipment', use: 'milk_bucket' });
add({ key: 'compass', name: 'Boussole', maxStack: 1, category: 'equipment', use: 'compass' });
add({ key: 'map', name: 'Carte', maxStack: 1, category: 'equipment', use: 'map', desc: 'Affiche une carte de la région' });
add({ key: 'oak_boat', name: 'Bateau', maxStack: 1, category: 'items', use: 'boat' });
add({ key: 'minecart', name: 'Wagonnet', maxStack: 1, category: 'items', use: 'minecart' });
add({ key: 'saddle', name: 'Selle', maxStack: 1, category: 'equipment', use: 'saddle' });
add({ key: 'glider', name: 'Planeur', maxStack: 1, category: 'equipment', use: 'glider', armor: { slot: 'chest', points: 0, durability: 432, material: 'glider' }, rarity: 'rare', desc: 'Équipez-le, sautez dans le vide puis appuyez sur Saut' });
add({ key: 'flying_carpet', name: 'Tapis volant', maxStack: 1, category: 'items', use: 'carpet_ride', rarity: 'epic', desc: 'Véhicule fantastique volant' });
add({ key: 'oak_door', name: 'Porte en chêne', maxStack: 64, category: 'construction', block: BLOCK_BY_KEY.get('oak_door')!.id, fuel: 10 });
add({ key: 'iron_door_item', name: 'Porte en fer', maxStack: 64, category: 'construction', block: BLOCK_BY_KEY.get('iron_door')!.id, icon: 'iron_door' });
add({ key: 'bed', name: 'Lit', maxStack: 1, category: 'items', block: BLOCK_BY_KEY.get('red_bed')!.id });

// ------------------------------------------------------------------ armures
interface ArmorMaterial {
  key: string;
  fr: string;
  mult: number;
  pts: number[];
  ingredient: string;
  rarity?: ItemDef['rarity'];
  /** Bonus d'ensemble (les quatre pièces portées), affiché dans l'infobulle. */
  setBonus?: string;
}
const ARMOR_MATS: ArmorMaterial[] = [
  { key: 'leather', fr: 'en cuir', mult: 5, pts: [1, 3, 2, 1], ingredient: 'leather' },
  { key: 'iron', fr: 'en fer', mult: 15, pts: [2, 6, 5, 2], ingredient: 'iron_ingot' },
  { key: 'golden', fr: 'en or', mult: 7, pts: [2, 5, 3, 1], ingredient: 'gold_ingot' },
  { key: 'diamond', fr: 'en diamant', mult: 33, pts: [3, 8, 6, 3], ingredient: 'diamond' },
  { key: 'mythril', fr: 'en mythril', mult: 40, pts: [4, 9, 7, 4], ingredient: 'mythril_ingot', rarity: 'rare' },
];
export const ARMOR_MATERIALS = ARMOR_MATS;
const ARMOR_PIECES: Array<{ k: string; fr: string; slot: ArmorSlot; dur: number }> = [
  { k: 'helmet', fr: 'Casque', slot: 'head', dur: 11 },
  { k: 'chestplate', fr: 'Plastron', slot: 'chest', dur: 16 },
  { k: 'leggings', fr: 'Jambières', slot: 'legs', dur: 15 },
  { k: 'boots', fr: 'Bottes', slot: 'feet', dur: 13 },
];
function addArmor(m: ArmorMaterial): void {
  ARMOR_PIECES.forEach((p, i) =>
    add({
      key: `${m.key}_${p.k}`,
      name: `${p.fr} ${m.fr}`,
      maxStack: 1,
      category: 'equipment',
      armor: { slot: p.slot, points: m.pts[i], durability: p.dur * m.mult, material: m.key },
      rarity: m.rarity,
      desc: m.setBonus && `Ensemble complet : ${m.setBonus}`,
    }),
  );
}
for (const m of ARMOR_MATS) addArmor(m);

// ------------------------------------------------------------------ nourriture
const food = (key: string, name: string, hunger: number, saturation: number, extra: Partial<ItemDef> = {}) =>
  add({ key, name, maxStack: 64, category: 'items', food: { hunger, saturation }, use: 'food', ...extra });
food('apple', 'Pomme', 4, 2.4);
food('golden_apple', 'Pomme dorée', 4, 9.6, { food: { hunger: 4, saturation: 9.6, effect: 'regeneration', always: true }, rarity: 'rare' });
food('bread', 'Pain', 5, 6);
food('raw_beef', 'Bœuf cru', 3, 1.8);
food('steak', 'Steak', 8, 12.8);
food('raw_porkchop', 'Côtelette de porc crue', 3, 1.8);
food('cooked_porkchop', 'Côtelette de porc cuite', 8, 12.8);
food('raw_chicken', 'Poulet cru', 2, 1.2);
food('cooked_chicken', 'Poulet rôti', 6, 7.2);
food('raw_mutton', 'Mouton cru', 2, 1.2);
food('cooked_mutton', 'Mouton cuit', 6, 9.6);
food('raw_venison', 'Venaison crue', 3, 1.8);
food('cooked_venison', 'Venaison rôtie', 8, 12);
food('raw_cod', 'Morue crue', 2, 0.4);
food('cooked_cod', 'Morue cuite', 5, 6);
food('raw_salmon', 'Saumon cru', 2, 0.4);
food('cooked_salmon', 'Saumon cuit', 6, 9.6);
food('carrot', 'Carotte', 3, 3.6, { block: BLOCK_BY_KEY.get('carrots')!.id });
food('potato', 'Pomme de terre', 1, 0.6, { block: BLOCK_BY_KEY.get('potatoes')!.id });
food('baked_potato', 'Pomme de terre cuite', 5, 6);
food('beetroot', 'Betterave', 1, 1.2);
food('beetroot_soup', 'Soupe de betterave', 6, 7.2, { maxStack: 1 });
food('mushroom_stew', 'Ragoût de champignons', 6, 7.2, { maxStack: 1 });
food('melon_slice', 'Tranche de pastèque', 2, 1.2);
food('cookie', 'Cookie', 2, 0.4);
food('pumpkin_pie', 'Tarte à la citrouille', 8, 4.8);
food('dried_kelp', 'Varech séché', 1, 0.6);
food('honey_cake', 'Gâteau céleste', 10, 14, { rarity: 'rare' });

// ------------------------------------------------------------------ œufs d'apparition (mode créatif)
export const SPAWNABLE = [
  ['cow', 'Vache'],
  ['sheep', 'Mouton'],
  ['pig', 'Cochon'],
  ['chicken', 'Poule'],
  ['horse', 'Cheval'],
  ['rabbit', 'Lapin'],
  ['fox', 'Renard'],
  ['turtle', 'Tortue'],
  ['cod', 'Morue'],
  ['dolphin', 'Dauphin'],
  ['deer', 'Cerf'],
  ['villager', 'Villageois'],
  ['zombie', 'Zombie'],
  ['skeleton', 'Squelette'],
  ['spider', 'Araignée'],
  ['boomshroom', 'Champignon explosif'],
  ['cave_crawler', 'Rampant des cavernes'],
  ['night_wraith', 'Spectre nocturne'],
  ['crystal_slime', 'Slime de cristal'],
  ['ember_salamander', 'Salamandre de braise'],
  ['fire_spirit', 'Esprit de feu'],
  ['storm_bird', 'Oiseau-tempête'],
  ['sky_sheep', 'Mouton céleste'],
  ['golden_stag', 'Cerf doré'],
  ['village_guard', 'Garde du village'],
  ['ancient_golem', 'Golem antique'],
  ['deep_guardian', 'Gardien des profondeurs'],
  ['ember_sovereign', 'Souverain des braises'],
  ['sky_dragon', 'Dragon des cieux'],
] as const;
for (const [k, fr] of SPAWNABLE) add({ key: `spawn_${k}`, name: `Œuf : ${fr}`, maxStack: 64, category: 'items', use: 'spawn_egg', data: k, icon: 'spawn_egg' });

// ------------------------------------------------------------------ étherium et célestine
// Ajoutés après tous les autres objets : les identifiants sont attribués dans l'ordre,
// ceux des objets existants ne doivent pas bouger. Les recettes (recipes.ts) parcourent
// TOOL_MATERIALS et ARMOR_MATERIALS après ce module : les nouveaux matériaux y sont inclus.
mat('raw_etherium', 'Étherium brut', { rarity: 'rare' });
mat('etherium_ingot', "Lingot d'étherium", { rarity: 'rare' });
mat('celestine', 'Célestine', { rarity: 'epic' });
const LATE_TOOL_MATS: Material[] = [
  { key: 'etherium', fr: 'en étherium', level: 4, speed: 9, durability: 2300, dmg: 4, ingredient: 'etherium_ingot', rarity: 'rare' },
  { key: 'celestine', fr: 'en célestine', level: 4, speed: 12, durability: 3100, dmg: 5, ingredient: 'celestine', rarity: 'epic' },
];
for (const m of LATE_TOOL_MATS) {
  TOOL_MATERIALS.push(m);
  addTools(m);
}
// Bonus d'ensemble appliqués dans Player.hurt (PlayerInventory.fullSet).
const LATE_ARMOR_MATS: ArmorMaterial[] = [
  { key: 'etherium', fr: 'en étherium', mult: 37, pts: [3, 8, 6, 3], ingredient: 'etherium_ingot', rarity: 'rare', setBonus: 'insensible au feu, dégâts de la lave réduits de moitié' },
  { key: 'celestine', fr: 'en célestine', mult: 45, pts: [4, 9, 7, 4], ingredient: 'celestine', rarity: 'epic', setBonus: 'aucun dégât de chute' },
];
for (const m of LATE_ARMOR_MATS) {
  ARMOR_MATS.push(m);
  addArmor(m);
}

export const ITEM_COUNT = nextId;

export function itemByKey(key: string): ItemDef | undefined {
  return ITEM_BY_KEY.get(key);
}

export function item(id: number): ItemDef | undefined {
  return ITEMS[id];
}

export function itemId(key: string): number {
  const i = ITEM_BY_KEY.get(key);
  if (!i) throw new Error('Objet inconnu : ' + key);
  return i.id;
}

/** Une pile d'objets. damage = usure (outils), data = données libres (couleur, contenu). */
export interface ItemStack {
  id: number;
  count: number;
  damage?: number;
  data?: Record<string, unknown>;
}

export function stack(key: string, count = 1): ItemStack {
  return { id: itemId(key), count };
}

export function sameItem(a: ItemStack | null, b: ItemStack | null): boolean {
  if (!a || !b) return false;
  return a.id === b.id && (a.damage ?? 0) === (b.damage ?? 0) && JSON.stringify(a.data ?? null) === JSON.stringify(b.data ?? null);
}

export function maxStack(s: ItemStack): number {
  return ITEMS[s.id]?.maxStack ?? 64;
}

export function itemName(s: ItemStack | number): string {
  const id = typeof s === 'number' ? s : s.id;
  return ITEMS[id]?.name ?? '?';
}

/** Forme sérialisable (clés plutôt que numéros). */
export function serializeStack(s: ItemStack | null): unknown {
  if (!s) return null;
  const o: Record<string, unknown> = { k: ITEMS[s.id]?.key ?? 'air', c: s.count };
  if (s.damage) o.d = s.damage;
  if (s.data) o.x = s.data;
  return o;
}

export function deserializeStack(o: unknown): ItemStack | null {
  if (!o || typeof o !== 'object') return null;
  const r = o as { k?: string; c?: number; d?: number; x?: Record<string, unknown> };
  const def = r.k ? ITEM_BY_KEY.get(r.k) : undefined;
  if (!def || !r.c || r.c <= 0) return null;
  const s: ItemStack = { id: def.id, count: Math.min(r.c, def.maxStack) };
  if (r.d) s.damage = r.d;
  if (r.x) s.data = r.x;
  return s;
}

/** Le bloc que place cet objet (ou -1). */
export function placesBlock(s: ItemStack): number {
  const d = ITEMS[s.id];
  return d?.block ?? -1;
}

export function isFuel(s: ItemStack): number {
  return ITEMS[s.id]?.fuel ?? 0;
}
