/** Monde de test en mémoire (sans workers ni rendu). */
import { ChunkManager } from '../src/world/ChunkManager';
import { Chunk } from '../src/world/Chunk';
import { World } from '../src/world/World';
import { COLUMN_VOLUME, packBlock } from '../src/world/constants';
import type { WorkerPool } from '../src/world/WorkerPool';

export function makeWorld(radius = 1, fill?: (x: number, y: number, z: number) => number): World {
  const pool = { submit: () => Promise.reject(new Error('no workers')), cancel: () => undefined, reprioritize: () => undefined, broadcast: () => undefined } as unknown as WorkerPool;
  const cm = new ChunkManager(pool, { solid: null as never, translucent: null as never }, { load: async () => null });
  for (let cz = -radius; cz <= radius; cz++)
    for (let cx = -radius; cx <= radius; cx++) {
      const c = new Chunk(cx, cz, 0);
      const blocks = new Uint16Array(COLUMN_VOLUME);
      if (fill)
        for (let y = 0; y < 256; y++)
          for (let z = 0; z < 16; z++)
            for (let x = 0; x < 16; x++) {
              const id = fill(cx * 16 + x, y, cz * 16 + z);
              if (id) blocks[(y << 8) | (z << 4) | x] = packBlock(id);
            }
      c.setData(blocks, new Uint8Array(256));
      cm.chunks.set(cm.key(cx, cz), c);
    }
  return new World(cm);
}
