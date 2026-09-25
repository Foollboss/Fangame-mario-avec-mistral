import { describe, it, expect } from 'vitest';
import { content } from './helpers';

const book = content.recipes;
const grid = (rows: string[][]) => rows.flat();

describe('fabrication', () => {
  it('bûche → 4 planches (sans motif, grille 2x2)', () => {
    const r = book.match(['buche_chene', null, null, null], 2, 2, 'hand');
    expect(r?.item).toBe('planches_chene');
    expect(r?.count).toBe(4);
  });

  it('reconnaît une recette à motif quelle que soit sa position et en miroir', () => {
    const g = grid([
      ['', '', ''],
      ['planches_bouleau', 'planches_bouleau', ''],
      ['planches_bouleau', 'planches_bouleau', ''],
    ]);
    expect(book.match(g, 3, 3, 'atelier')?.item).toBe('atelier');
    const axe = grid([
      ['', 'moellon', 'moellon'],
      ['', 'baton', 'moellon'],
      ['', 'baton', ''],
    ]);
    expect(book.match(axe, 3, 3, 'atelier')?.item).toBe('hache_pierre');
  });

  it('respecte les étiquettes (#planks) et les stations', () => {
    const pick = grid([
      ['celestine', 'celestine', 'celestine'],
      ['', 'baton', ''],
      ['', 'baton', ''],
    ]);
    expect(book.match(pick, 3, 3, 'atelier')).toBeNull();
    expect(book.match(pick, 3, 3, 'forge')?.item).toBe('pioche_celestine');
  });

  it('génère les recettes de variantes (dalles, escaliers)', () => {
    const slab = grid([['moellon', 'moellon', 'moellon'], ['', '', ''], ['', '', '']]);
    const r = book.match(slab, 3, 3, 'atelier');
    expect(r?.item).toBe('moellon_dalle');
    expect(r?.count).toBe(6);
  });

  it('cuisson : minerai de fer → lingot, bûches → charbon', () => {
    expect(book.smeltResult('minerai_fer')?.output).toBe('lingot_fer');
    expect(book.smeltResult('buche_epicea')?.output).toBe('charbon');
    expect(content.items.fuelTime('charbon')).toBe(80);
  });

  it('toutes les recettes référencent des objets existants', () => {
    for (const r of book.recipes) {
      expect(content.items.has(r.result.item), r.result.item).toBe(true);
      const specs = r.type === 'shaped' ? (r.grid ?? []).flat().filter(Boolean) : r.ingredients ?? [];
      for (const s of specs) if (!s.startsWith('#')) expect(content.items.has(s), `${r.id}: ${s}`).toBe(true);
    }
  });
});
