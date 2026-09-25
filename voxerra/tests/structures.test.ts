import { describe, it, expect } from 'vitest';
import { content } from './helpers';
import { createGenerator } from '../src/worldgen/generator';
import { MISSING_BLOCKS } from '../src/worldgen/structures/builder';
import type { OverworldGenerator } from '../src/worldgen/overworld';

const SEED = 20250917;

describe('structures', () => {
  it('chaque type est localisable et se génère sans bloc inconnu', () => {
    for (const dim of ['surface', 'abime', 'astral']) {
      const gen = createGenerator(dim, SEED, content) as OverworldGenerator;
      for (const id of gen.structures.ids()) {
        const p = gen.structures.locate(id, 0, 0, 20000);
        expect(p, `${dim}:${id}`).not.toBeNull();
        // génère les colonnes autour de l'origine de la structure
        const cx = Math.floor(p!.x / 16),
          cz = Math.floor(p!.z / 16);
        let chests = 0;
        for (let dz = -1; dz <= 1; dz++)
          for (let dx = -1; dx <= 1; dx++) {
            const buf = gen.generate(cx + dx, cz + dz);
            chests += buf.blockEntities.filter((b) => b.data.type === 'chest').length;
          }
        if (!['village', 'mine', 'fleche', 'forteresse'].includes(id)) expect(chests, `${dim}:${id} coffres`).toBeGreaterThan(0);
      }
    }
    expect([...MISSING_BLOCKS]).toEqual([]);
  });

  it('la génération des structures est déterministe entre colonnes', () => {
    const g1 = createGenerator('surface', SEED, content) as OverworldGenerator;
    const g2 = createGenerator('surface', SEED, content) as OverworldGenerator;
    const v = g1.structures.locate('village', 0, 0)!;
    const cx = Math.floor(v.x / 16),
      cz = Math.floor(v.z / 16);
    // ordre de génération différent → mêmes blocs
    const a = g1.generate(cx + 1, cz);
    g2.generate(cx - 1, cz);
    g2.generate(cx + 2, cz + 1);
    const b = g2.generate(cx + 1, cz);
    for (let s = 0; s < 16; s++) expect(a.sections[s]?.join(',') ?? '').toBe(b.sections[s]?.join(',') ?? '');
  });

  it('les structures désactivées ne sont pas générées', () => {
    const g = createGenerator('surface', SEED, content, 'normal', false) as OverworldGenerator;
    const v = g.structures.locate('village', 0, 0)!;
    const buf = g.generate(Math.floor(v.x / 16), Math.floor(v.z / 16));
    expect(buf.blockEntities.length).toBe(0);
  });
});
