/**
 * Traduction des noms du contenu (blocs, objets, créatures, biomes, effets,
 * progrès, dimensions, structures) par identifiant. Les packs de contenu
 * (mods) peuvent fournir `lang: { en: { id: "Nom" }, es: { … } }`.
 */
import type { Content } from '../registry/content';
import type { Lang } from './i18n';
import namesEn from './names.en.json';
import namesEs from './names.es.json';
import { BIOMES } from '../worldgen/biomes';
import { DIMENSION_INFO } from '../worldgen/generator';
import { ALL_STRUCTURES } from '../worldgen/structures';

interface NameTable {
  blocks: Record<string, string>;
  items: Record<string, string>;
  descs: Record<string, string>;
  creatures: Record<string, string>;
  phases: Record<string, string[]>;
  effects: Record<string, string>;
  biomes: Record<string, string>;
  dimensions: Record<string, string>;
  structures: Record<string, string>;
  advancements: Record<string, string[]>;
}

const NAMES: Record<Exclude<Lang, 'fr'>, NameTable> = { en: namesEn as NameTable, es: namesEs as NameTable };

/** Textes français d'origine (pour revenir au français sans recharger). */
const ORIGINAL = new WeakMap<object, Record<string, unknown>>();
function orig<T extends object>(o: T, keys: string[]): Record<string, unknown> {
  let r = ORIGINAL.get(o);
  if (!r) {
    r = {};
    for (const k of keys) r[k] = (o as Record<string, unknown>)[k];
    ORIGINAL.set(o, r);
  }
  return r;
}

const VARIANTS: [string, (base: string, lang: 'en' | 'es') => string][] = [
  ['_dalle', (b, l) => (l === 'en' ? `${enStem(b)} Slab` : `Losa de ${esStem(b)}`)],
  ['_escalier', (b, l) => (l === 'en' ? `${enStem(b)} Stairs` : `Escaleras de ${esStem(b)}`)],
  ['_muret', (b, l) => (l === 'en' ? `${enStem(b)} Wall` : `Muro de ${esStem(b)}`)],
  ['_barriere', (b, l) => (l === 'en' ? `${enStem(b)} Fence` : `Valla de ${esStem(b)}`)],
];
// « Oak Planks » → « Oak Slab », « Stone Bricks » → « Stone Brick Slab »
const enStem = (b: string) => b.replace(/ Planks$/, '').replace(/Bricks$/, 'Brick').replace(/Tiles$/, 'Tile');
// « Tablones de roble » → « Losa de roble »
const esStem = (b: string) => {
  const s = b.replace(/^Tablones de /, '');
  return s.charAt(0).toLowerCase() + s.slice(1);
};

export function localizeContent(content: Content, lang: Lang): void {
  const table = lang === 'fr' ? null : NAMES[lang];
  // traductions fournies par les mods
  const modNames: Record<string, string> = {};
  if (lang !== 'fr') {
    Object.assign(modNames, content.pack.lang?.[lang] ?? {});
  }
  const blockName = new Map<string, string>();
  for (const b of content.blocks.list) {
    const o = orig(b, ['name']);
    let name = o.name as string;
    if (table) {
      const direct = modNames[b.id] ?? table.blocks[b.id];
      if (direct) name = direct;
      else
        for (const [suffix, fmt] of VARIANTS) {
          if (!b.id.endsWith(suffix)) continue;
          const baseId = b.id.slice(0, -suffix.length);
          const base = modNames[baseId] ?? table.blocks[baseId];
          if (base) name = fmt(base, lang as 'en' | 'es');
          break;
        }
    }
    b.name = name;
    blockName.set(b.id, name);
  }
  for (const it of content.items.list) {
    const o = orig(it, ['name', 'desc']);
    let name = o.name as string;
    let desc = o.desc as string | undefined;
    if (table) {
      name = modNames[it.id] ?? table.items[it.id] ?? (it.block ? blockName.get(it.block) : undefined) ?? name;
      desc = table.descs[it.id] ?? modNames[it.id + '.desc'] ?? desc;
    } else if (it.block && !it.name) name = blockName.get(it.block) ?? name;
    it.name = name;
    if (desc !== undefined) it.desc = desc;
  }
  for (const c of content.creatures.values()) {
    const o = orig(c, ['name']);
    c.name = (table && (modNames[c.id] ?? table.creatures[c.id])) || (o.name as string);
    c.phases?.forEach((p, i) => {
      const po = orig(p, ['message']);
      p.message = (table && table.phases[c.id]?.[i]) || (po.message as string | undefined);
    });
  }
  for (const e of content.effects.values()) {
    const o = orig(e, ['name']);
    e.name = (table && table.effects[e.id]) || (o.name as string);
  }
  for (const a of content.advancements) {
    const o = orig(a, ['title', 'desc']);
    const tr = table?.advancements[a.id];
    a.title = tr?.[0] ?? modNames[a.id + '.title'] ?? (o.title as string);
    a.desc = tr?.[1] ?? modNames[a.id + '.desc'] ?? (o.desc as string);
  }
  for (const b of BIOMES) {
    const o = orig(b, ['name']);
    b.name = (table && table.biomes[b.id]) || (o.name as string);
  }
  for (const d of Object.values(DIMENSION_INFO)) {
    const o = orig(d, ['name']);
    d.name = (table && table.dimensions[d.id]) || (o.name as string);
  }
  for (const s of ALL_STRUCTURES) {
    const o = orig(s, ['name']);
    s.name = (table && table.structures[s.id]) || (o.name as string);
  }
}
