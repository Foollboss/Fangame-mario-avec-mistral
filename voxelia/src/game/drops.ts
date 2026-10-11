/** Règles de minage : temps de destruction, outil requis, objets obtenus et expérience. */
import { BLOCKS, type BlockDef } from '../world/blocks';
import { ITEMS, ITEM_BY_KEY, type ItemStack } from '../items/items';

export function toolOf(s: ItemStack | null) {
  return s ? ITEMS[s.id]?.tool : undefined;
}

/** Le joueur obtient-il l'objet du bloc avec cet outil ? */
export function canHarvest(def: BlockDef, held: ItemStack | null): boolean {
  if (def.hardness < 0) return false;
  const t = toolOf(held);
  if (def.tool === 'pickaxe' && (def.level > 0 || def.hardness >= 1.5 || def.key.includes('ore') || def.key.includes('stone') || def.key.includes('bricks') || def.key === 'cobblestone')) {
    if (!t || t.type !== 'pickaxe') return false;
    return t.level >= def.level;
  }
  if (def.key === 'cobweb') return !!t && (t.type === 'sword' || t.type === 'shears');
  return true;
}

/** Durée de destruction en secondes (Infinity si incassable). */
export function breakTime(def: BlockDef, held: ItemStack | null, onGround: boolean, inWater: boolean, haste = 1): number {
  if (def.hardness < 0) return Infinity;
  if (def.hardness === 0) return 0.05;
  const t = toolOf(held);
  let speed = 1;
  if (t && t.type === def.tool && def.tool !== 'none') speed = t.speed;
  if (t && t.type === 'sword' && def.key === 'cobweb') speed = 15;
  if (t && t.type === 'shears' && (def.key.endsWith('_leaves') || def.key === 'cobweb' || def.key.endsWith('_wool') || def.key === 'vine')) speed = def.key.endsWith('_wool') ? 5 : 15;
  if (t && t.type === 'sword' && def.key.endsWith('_leaves')) speed = 1.5;
  speed *= haste;
  if (!onGround) speed /= 5;
  if (inWater) speed /= 5;
  const harvest = canHarvest(def, held);
  const perTick = speed / def.hardness / (harvest ? 30 : 100);
  if (perTick >= 1) return 0.05;
  return Math.ceil(1 / perTick) / 20;
}

export interface DropResult {
  items: ItemStack[];
  xp: number;
}

export function blockDrops(def: BlockDef, meta: number, held: ItemStack | null, rnd = Math.random): DropResult {
  const out: ItemStack[] = [];
  let xp = 0;
  if (!canHarvest(def, held)) return { items: out, xp };
  const t = toolOf(held);
  const give = (key: string, n = 1) => {
    const it = ITEM_BY_KEY.get(key);
    if (it && n > 0) out.push({ id: it.id, count: n });
  };
  // Cisailles : on récupère les feuilles, lianes, herbes…
  if (t?.type === 'shears' && (def.key.endsWith('_leaves') || def.key === 'vine' || def.key === 'short_grass' || def.key === 'fern' || def.key === 'cobweb' || def.key === 'seagrass' || def.key === 'glow_lichen')) {
    give(def.key);
    return { items: out, xp };
  }
  switch (def.key) {
    case 'wheat':
      if (meta >= 7) {
        give('wheat');
        give('wheat_seeds', Math.floor(rnd() * 4));
      } else give('wheat_seeds');
      return { items: out, xp };
    case 'carrots':
      give('carrot', meta >= 7 ? 1 + Math.floor(rnd() * 4) : 1);
      return { items: out, xp };
    case 'potatoes':
      give('potato', meta >= 7 ? 1 + Math.floor(rnd() * 4) : 1);
      return { items: out, xp };
    case 'beetroots':
      if (meta >= 7) give('beetroot');
      give('beetroot_seeds', meta >= 7 ? 1 + Math.floor(rnd() * 3) : 1);
      return { items: out, xp };
    case 'gravel':
      give(rnd() < 0.1 ? 'flint' : 'gravel');
      return { items: out, xp };
    case 'oak_leaves':
    case 'dark_oak_leaves':
      if (rnd() < 0.005) give('apple');
      break;
    case 'iron_door':
      give('iron_door_item');
      return { items: out, xp };
    case 'red_bed':
      if (!(meta & 8)) give('bed');
      return { items: out, xp };
    case 'oak_door':
      if (!(meta & 8)) give('oak_door');
      return { items: out, xp };
    case 'snow_layer':
      give('snowball', 1 + (meta & 7));
      return { items: out, xp };
    case 'glowstone':
      give('glowstone_dust', 2 + Math.floor(rnd() * 3));
      return { items: out, xp };
    case 'bookshelf':
      give('book', 3);
      return { items: out, xp };
  }
  if (def.drop === null) {
    if (def.dropChance === undefined) return { items: out, xp };
  }
  const key = def.drop === undefined ? def.key : def.drop;
  if (key && (def.dropChance === undefined || rnd() < def.dropChance)) {
    const [a, b] = def.dropCount ?? [1, 1];
    give(key, a + Math.floor(rnd() * (b - a + 1)));
  }
  if (def.key.endsWith('_slab') && meta === 2) give(def.key);
  if (def.xp) xp = def.xp[0] + Math.floor(rnd() * (def.xp[1] - def.xp[0] + 1));
  return { items: out, xp };
}

/** Le bloc peut-il recevoir une plante / culture au-dessus ? */
export function supportsPlant(groundId: number, plantKey: string): boolean {
  const g = BLOCKS[groundId]?.key ?? '';
  if (['wheat', 'carrots', 'potatoes', 'beetroots'].includes(plantKey)) return g === 'farmland';
  if (plantKey === 'cactus') return g === 'sand' || g === 'red_sand' || g === 'cactus';
  if (plantKey === 'sugar_cane') return ['grass_block', 'dirt', 'sand', 'red_sand', 'podzol', 'sugar_cane', 'mud'].includes(g);
  if (plantKey === 'dead_bush' || plantKey === 'dry_shrub') return ['sand', 'red_sand', 'terracotta', 'dirt', 'coarse_dirt', 'grass_block', 'ash_grass', 'ash'].includes(g);
  if (plantKey.endsWith('mushroom')) return BLOCKS[groundId]?.opaque ?? false;
  if (plantKey === 'crystal_cluster') return BLOCKS[groundId]?.solid ?? false;
  if (plantKey === 'seagrass' || plantKey === 'kelp') return (BLOCKS[groundId]?.solid ?? false) || g === 'kelp';
  return ['grass_block', 'dirt', 'podzol', 'coarse_dirt', 'farmland', 'mycelium', 'moss_block', 'sky_grass', 'sky_dirt', 'ash_grass', 'mud'].includes(g);
}
