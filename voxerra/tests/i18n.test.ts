import { describe, it, expect, afterEach } from 'vitest';
import en from '../src/i18n/en.json';
import es from '../src/i18n/es.json';
import namesEn from '../src/i18n/names.en.json';
import namesEs from '../src/i18n/names.es.json';
import { t, setLang } from '../src/i18n/i18n';
import { localizeContent } from '../src/i18n/content';
import { collectKeys } from '../scripts/i18n-keys.mjs';
import { content } from './helpers';
import { BIOMES } from '../src/worldgen/biomes';
import { DIMENSION_INFO } from '../src/worldgen/generator';

const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');

afterEach(() => {
  setLang('fr');
  localizeContent(content, 'fr');
});

describe('traductions', () => {
  it('chaque texte de l’interface est traduit en anglais et en espagnol', () => {
    const keys = collectKeys() as string[];
    expect(keys.length).toBeGreaterThan(300);
    for (const [name, dict] of [['en', en], ['es', es]] as const) {
      const d = dict as Record<string, string>;
      const missing = keys.filter((k) => !(k in d));
      expect(missing, `clés manquantes (${name})`).toEqual([]);
      for (const k of keys) expect(placeholders(d[k]), `${name} : ${k}`).toBe(placeholders(k));
    }
  });

  it('chaque nom de contenu a une traduction', () => {
    for (const names of [namesEn, namesEs]) {
      for (const b of content.blocks.list) {
        if (b.num === 0 || b.def.tags?.includes('variant')) continue;
        expect(names.blocks[b.id as keyof typeof names.blocks], b.id).toBeTruthy();
      }
      for (const c of content.creatures.values()) expect(names.creatures[c.id as keyof typeof names.creatures], c.id).toBeTruthy();
      for (const e of content.effects.values()) expect(names.effects[e.id as keyof typeof names.effects], e.id).toBeTruthy();
      for (const a of content.advancements) expect(names.advancements[a.id as keyof typeof names.advancements], a.id).toBeTruthy();
      for (const b of BIOMES) expect(names.biomes[b.id as keyof typeof names.biomes], b.id).toBeTruthy();
    }
  });

  it('change la langue de l’interface et du contenu, puis revient au français', () => {
    setLang('en');
    localizeContent(content, 'en');
    expect(t('Solo')).toBe('Singleplayer');
    expect(t('Supprimer « {name} » ?', { name: 'Monde 1' })).toBe('Delete “Monde 1”?');
    expect(content.blocks.get(content.b('pierre')).name).toBe('Stone');
    expect(content.blocks.get(content.b('planches_chene_dalle')).name).toBe('Oak Slab');
    expect(content.items.name('pioche_fer')).toBe('Iron Pickaxe');
    expect(content.creatures.get('rodeur')!.name).toBe('Prowler');
    expect(DIMENSION_INFO.abime.name).toBe('The Ashen Abyss');
    setLang('es');
    localizeContent(content, 'es');
    expect(t('Solo')).toBe('Un jugador');
    expect(content.blocks.get(content.b('planches_chene_dalle')).name).toBe('Losa de roble');
    expect(content.items.name('epee_fer')).toBe('Espada de hierro');
    setLang('fr');
    localizeContent(content, 'fr');
    expect(t('Solo')).toBe('Solo');
    expect(content.blocks.get(content.b('pierre')).name).toBe('Pierre');
    expect(content.items.name('pioche_fer')).toBe('Pioche en fer');
    expect(BIOMES[0].name).toBe('Océan');
  });
});
