import { describe, it, expect } from 'vitest';
import { content, newSim, loadArea, makeMeta } from './helpers';
import { MemoryStorage, validateMeta } from '../src/save/storage';
import { encodeChunk, decodeChunk } from '../src/save/serializer';
import { Chunk } from '../src/world/chunk';
import { Player } from '../src/entity/player';
import { installMobs } from '../src/sim/mobs';
import { makeCell } from '../src/registry/blocks';
import type { Mob } from '../src/entity/mob';

describe('sauvegarde complète', () => {
  it('monde modifié, coffre, créature et joueur : aller-retour', async () => {
    const storage = new MemoryStorage();
    const meta = makeMeta(4242, { name: 'Aller-retour' });
    // --- Partie 1 : on joue et on sauvegarde
    const sim = newSim(4242);
    installMobs(sim);
    const w = sim.world('surface');
    loadArea(w, 0, 0, 1);
    const y = w.heightAt(5, 5) + 1;
    w.setBlock(5, y, 5, makeCell(content.b('coffre'), 2));
    w.setBlockEntity(5, y, 5, { type: 'chest', slots: [{ id: 'lingot_or', count: 7 }, ...new Array(26).fill(null)] });
    w.setBlock(6, y, 5, content.b('briques_pierre_escalier') | (3 << 12));
    const bear = sim.spawnMob!('ours_mousse', 'surface', 8.5, y, 8.5)!;
    bear.persistent = true;
    bear.health = 17;
    const p = new Player(content.items, 'Alex');
    p.setPos(4.5, y, 4.5);
    p.inventory.give({ id: 'pioche_fer', count: 1 });
    p.inventory.give({ id: 'pain', count: 12 });
    p.health = 13;
    p.addEffect('vitesse', 30, 1);
    p.stat('blocs_casses', 42);
    sim.addPlayer(p);
    meta.player = p.serialize();
    meta.time = sim.env.time = 15000;
    const chunks = [...w.chunks.values()].filter((c) => c.dirty || sim.persistentEntitiesIn('surface', c.cx, c.cz).length);
    await storage.saveBatch(
      meta,
      chunks.map((c) => ({ dim: 'surface', rec: encodeChunk(c, content.blocks, sim.persistentEntitiesIn('surface', c.cx, c.cz)) })),
    );

    // --- Partie 2 : nouvelle session, chargement
    const meta2 = await storage.loadMeta(meta.id);
    expect(validateMeta(meta2)).toBe(true);
    expect(meta2!.time).toBe(15000);
    const sim2 = newSim(4242);
    installMobs(sim2);
    const w2 = sim2.world('surface');
    for (let cz = -1; cz <= 1; cz++)
      for (let cx = -1; cx <= 1; cx++) {
        const rec = await storage.loadChunk(meta.id, 'surface', cx, cz);
        if (!rec) continue;
        const dec = decodeChunk(rec, content.blocks);
        const c = new Chunk(cx, cz);
        c.loadSections(dec.sections);
        c.biomes.set(dec.biomes);
        c.tints.set(dec.tints);
        for (const [i, d] of dec.blockEntities) c.blockEntities.set(i, d);
        w2.addChunk(c);
        sim2.restoreEntities('surface', dec.entities);
      }
    expect(w2.getBlock(5, y, 5)).toBe(makeCell(content.b('coffre'), 2));
    expect(w2.getBlock(6, y, 5)).toBe(content.b('briques_pierre_escalier') | (3 << 12));
    const chest = w2.getBlockEntity(5, y, 5) as { slots: ({ id: string; count: number } | null)[] };
    expect(chest.slots[0]).toEqual({ id: 'lingot_or', count: 7 });
    const mob = sim2.entities.list.find((e) => e.kind === 'mob') as Mob;
    expect(mob.type).toBe('ours_mousse');
    expect(mob.health).toBe(17);
    const p2 = new Player(content.items);
    p2.load(meta2!.player as Record<string, unknown>);
    expect(p2.name).toBe('Alex');
    expect(p2.health).toBe(13);
    expect(p2.inventory.count('pain')).toBe(12);
    expect(p2.inventory.count('pioche_fer')).toBe(1);
    expect(p2.hasEffect('vitesse')).toBe(true);
    expect(p2.stats.blocs_casses).toBe(42);
    expect(p2.x).toBeCloseTo(4.5);
  });

  it('une colonne corrompue est rejetée proprement', () => {
    expect(() => decodeChunk({} as never, content.blocks)).toThrow();
  });

  it('un bloc inconnu (mod retiré) devient de l’air sans planter', () => {
    const c = new Chunk(0, 0);
    c.set(1, 1, 1, content.b('pierre'));
    const rec = encodeChunk(c, content.blocks);
    rec.palette = rec.palette.map((n) => (n === 'pierre' ? 'bloc_de_mod_disparu' : n));
    const dec = decodeChunk(rec, content.blocks);
    expect(dec.sections[0]![(1 << 8) | (1 << 4) | 1]).toBe(0);
  });

  it('la suppression d’un monde efface ses colonnes', async () => {
    const s = new MemoryStorage();
    const m = makeMeta(1);
    const c = new Chunk(0, 0);
    c.set(0, 0, 0, content.b('socle'));
    await s.saveBatch(m, [{ dim: 'surface', rec: encodeChunk(c, content.blocks) }]);
    expect(await s.chunkCount(m.id)).toBe(1);
    await s.deleteWorld(m.id);
    expect(await s.chunkCount(m.id)).toBe(0);
    expect(await s.loadMeta(m.id)).toBeNull();
  });
});
