import { describe, it, expect } from 'vitest';
import { content } from './helpers';

describe('intégrité du contenu', () => {
  it('toutes les textures de blocs existent', () => {
    const missing = content.blocks.textureNames.filter((n) => !(n in content.textures));
    expect(missing).toEqual([]);
  });

  it('les butins référencent des objets existants', () => {
    const bad: string[] = [];
    for (const [id, t] of Object.entries(content.loot)) for (const e of t.entries) if (!content.items.has(e.item)) bad.push(`${id}:${e.item}`);
    for (const c of content.creatures.values()) for (const e of c.loot ?? []) if (!content.items.has(e.item)) bad.push(`${c.id}:${e.item}`);
    expect(bad).toEqual([]);
  });

  it('les créatures ont un modèle et des règles valides', () => {
    for (const c of content.creatures.values()) {
      expect(c.model.parts.length, c.id).toBeGreaterThan(0);
      expect(c.health, c.id).toBeGreaterThan(0);
      if (c.heldItem) expect(content.items.has(c.heldItem), c.id).toBe(true);
    }
  });

  it('les autels invoquent des créatures existantes', () => {
    for (const b of content.blocks.list) {
      const d = b.def.data as { creature?: string; offering?: string } | undefined;
      if (b.def.interact !== 'summon' || !d) continue;
      expect(content.creatures.has(d.creature!), b.id).toBe(true);
      expect(content.items.has(d.offering!), b.id).toBe(true);
    }
  });
});
