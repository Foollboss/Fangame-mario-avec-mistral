/**
 * Contenu du jeu : fusionne le pack de base et les packs de mods (JSON),
 * puis construit tous les registres. Aucune dépendance DOM : utilisable dans
 * les workers, le serveur Node et les tests.
 */
import baseBlocks from '../data/blocks.json';
import baseItems from '../data/items.json';
import baseTextures from '../data/textures.json';
import baseRecipes from '../data/recipes.json';
import baseSmelting from '../data/smelting.json';
import baseCreatures from '../data/creatures.json';
import baseLoot from '../data/loot.json';
import baseAdvancements from '../data/advancements.json';
import baseEffects from '../data/effects.json';
import type { ContentPack, BlockDef, ItemDef, RecipeDef, SmeltDef, CreatureDef, AdvancementDef, EffectDef, LootTable, StructureTemplateDef, BiomeDefLike } from './types';
import { BlockRegistry } from './blocks';
import { ItemRegistry } from './items';
import { RecipeBook } from '../crafting/recipes';
import { expandTextureDefs, type TextureDef } from '../render/texgen';

export const BASE_PACK: ContentPack = {
  id: 'voxerra',
  name: 'Voxerra (base)',
  blocks: baseBlocks as BlockDef[],
  items: baseItems as ItemDef[],
  textures: baseTextures as Record<string, TextureDef>,
  recipes: baseRecipes as RecipeDef[],
  smelting: baseSmelting as SmeltDef[],
  creatures: baseCreatures as unknown as CreatureDef[],
  loot: baseLoot as unknown as Record<string, LootTable>,
  advancements: baseAdvancements as AdvancementDef[],
  effects: baseEffects as EffectDef[],
};

/** Fusionne plusieurs packs : les listes sont concaténées, les entrées de même id sont remplacées. */
export function mergePacks(packs: ContentPack[]): ContentPack {
  const out: Required<Omit<ContentPack, 'id' | 'name' | 'lang'>> & { id: string; name: string; lang: Record<string, Record<string, string>> } = {
    id: packs.map((p) => p.id).join('+'),
    name: packs.map((p) => p.name ?? p.id).join(' + '),
    blocks: [],
    items: [],
    textures: {},
    recipes: [],
    smelting: [],
    creatures: [],
    loot: {},
    advancements: [],
    effects: [],
    biomes: [],
    structures: [],
    lang: {},
  };
  const upsert = <T extends { id: string }>(list: T[], add: T[] | undefined) => {
    for (const e of add ?? []) {
      const i = list.findIndex((x) => x.id === e.id);
      if (i >= 0) list[i] = { ...list[i], ...e };
      else list.push(e);
    }
  };
  for (const p of packs) {
    upsert(out.blocks, p.blocks);
    upsert(out.items, p.items);
    Object.assign(out.textures, p.textures ?? {});
    out.recipes.push(...(p.recipes ?? []));
    out.smelting.push(...(p.smelting ?? []));
    upsert(out.creatures, p.creatures);
    Object.assign(out.loot, p.loot ?? {});
    upsert(out.advancements, p.advancements);
    upsert(out.effects, p.effects);
    upsert(out.biomes as BiomeDefLike[], p.biomes);
    upsert(out.structures as StructureTemplateDef[], p.structures);
    for (const [l, names] of Object.entries(p.lang ?? {})) if (names && typeof names === 'object') out.lang[l] = { ...(out.lang[l] ?? {}), ...names };
  }
  return out;
}

export class Content {
  readonly pack: ContentPack;
  readonly blocks: BlockRegistry;
  readonly items: ItemRegistry;
  readonly textures: Record<string, TextureDef>;
  readonly recipes: RecipeBook;
  readonly creatures = new Map<string, CreatureDef>();
  readonly loot: Record<string, LootTable>;
  readonly advancements: AdvancementDef[];
  readonly effects = new Map<string, EffectDef>();

  constructor(pack: ContentPack) {
    this.pack = pack;
    this.textures = expandTextureDefs(pack.textures ?? {});
    // Textures supplémentaires (particules, interface…)
    const fxTextures = Object.keys(this.textures).filter((t) => t.startsWith('fx_'));
    this.blocks = new BlockRegistry(pack.blocks ?? [], ['vide_astral', ...fxTextures]);
    this.items = new ItemRegistry(pack.items ?? [], this.blocks);
    this.recipes = new RecipeBook(pack.recipes ?? [], pack.smelting ?? [], this.items, this.blocks);
    for (const c of pack.creatures ?? []) this.creatures.set(c.id, c);
    this.loot = pack.loot ?? {};
    this.advancements = pack.advancements ?? [];
    for (const e of pack.effects ?? []) this.effects.set(e.id, e);
  }

  /** Raccourci : numéro de bloc. */
  b(id: string): number {
    return this.blocks.num(id);
  }
}

let shared: Content | null = null;
/** Contenu par défaut (pack de base) – pratique pour les tests et le serveur. */
export function baseContent(): Content {
  if (!shared) shared = new Content(mergePacks([BASE_PACK]));
  return shared;
}
