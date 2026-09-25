import { baseContent } from '../src/registry/content';
import { createGenerator } from '../src/worldgen/generator';
import { Chunk } from '../src/world/chunk';
import { World } from '../src/world/world';
import { Sim } from '../src/sim/sim';
import type { WorldMeta } from '../src/save/storage';
import { DEFAULT_RULES } from '../src/save/storage';

export const content = baseContent();

export function makeMeta(seed = 1234, over: Partial<WorldMeta> = {}): WorldMeta {
  return {
    id: 'test-' + seed,
    name: 'Test',
    seed,
    seedText: String(seed),
    version: 1,
    created: 0,
    lastPlayed: 0,
    gameMode: 'survie',
    difficulty: 2,
    allowCommands: true,
    worldType: 'normal',
    structures: true,
    bonusChest: false,
    rules: { ...DEFAULT_RULES },
    time: 1000,
    weather: { state: 'clair', timer: 99999 },
    spawn: null,
    player: null,
    dimension: 'surface',
    portals: [],
    advancements: [],
    stats: {},
    bosses: [],
    playTime: 0,
    ...over,
  };
}

/** Charge une zone de colonnes générées dans un monde (synchrone). */
export function loadArea(world: World, cx0: number, cz0: number, r: number): void {
  const gen = createGenerator(world.dim, world.seed, world.content);
  for (let cz = cz0 - r; cz <= cz0 + r; cz++)
    for (let cx = cx0 - r; cx <= cx0 + r; cx++) {
      const b = gen.generate(cx, cz);
      const c = new Chunk(cx, cz);
      c.loadSections(b.sections);
      c.biomes.set(b.biomes);
      c.tints.set(b.tints);
      world.addChunk(c);
    }
}

/** Monde plat de test : socle, pierre jusqu'à y=9, herbe à y=10. */
export function flatWorld(sim: Sim, dim = 'surface', r = 2): World {
  const w = sim.world(dim);
  w.trackDirty = false;
  const stone = content.b('pierre'), grass = content.b('herbe'), bed = content.b('socle');
  for (let cz = -r; cz <= r; cz++)
    for (let cx = -r; cx <= r; cx++) {
      const c = new Chunk(cx, cz);
      for (let x = 0; x < 16; x++)
        for (let z = 0; z < 16; z++) {
          c.set(x, 0, z, bed);
          for (let y = 1; y < 10; y++) c.set(x, y, z, stone);
          c.set(x, 10, z, grass);
        }
      w.addChunk(c);
    }
  return w;
}

export function newSim(seed = 99, over: Partial<WorldMeta> = {}): Sim {
  return new Sim(content, makeMeta(seed, over));
}
