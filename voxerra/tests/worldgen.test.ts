import { describe, it, expect } from 'vitest';
import { baseContent } from '../src/registry/content';
import { createGenerator } from '../src/worldgen/generator';

const content = baseContent();

function hashBuf(sections: (Uint16Array | null)[]): number {
  let h = 2166136261;
  for (const s of sections) {
    if (!s) { h = Math.imul(h ^ 0xabcdef, 16777619); continue; }
    for (let i = 0; i < s.length; i += 7) h = Math.imul(h ^ s[i], 16777619);
  }
  return h >>> 0;
}

describe('génération du monde', () => {
  it('est déterministe pour une même graine', () => {
    const a = createGenerator('surface', 12345, content).generate(3, -7);
    const b = createGenerator('surface', 12345, content).generate(3, -7);
    expect(hashBuf(a.sections)).toBe(hashBuf(b.sections));
    expect(Array.from(a.biomes)).toEqual(Array.from(b.biomes));
  });

  it('diffère avec une autre graine', () => {
    const a = createGenerator('surface', 1, content).generate(0, 0);
    const b = createGenerator('surface', 2, content).generate(0, 0);
    expect(hashBuf(a.sections)).not.toBe(hashBuf(b.sections));
  });

  it('produit un socle et du terrain', () => {
    const g = createGenerator('surface', 42, content);
    const buf = g.generate(0, 0);
    const socle = content.b('socle');
    expect(buf.get(0, 0, 0) & 0xfff).toBe(socle);
    const top = buf.top(8, 8);
    expect(top).toBeGreaterThan(20);
  });

  it('génère les trois dimensions rapidement', () => {
    for (const dim of ['surface', 'abime', 'astral']) {
      const g = createGenerator(dim, 777, content);
      const t0 = performance.now();
      for (let i = 0; i < 16; i++) g.generate(i % 4, Math.floor(i / 4));
      const dt = (performance.now() - t0) / 16;
      console.log(dim, 'ms/chunk', dt.toFixed(2));
      expect(dt).toBeLessThan(80);
    }
  });
});
