/**
 * Worker de monde : génération des tronçons et maillage (avec calcul de la lumière).
 * Plusieurs workers tournent en parallèle ; ils ne gardent aucun état du monde.
 */
import { OverworldGenerator, type GeneratedColumn } from '../world/gen/overworld';
import { EmberGenerator, SkyGenerator } from '../world/gen/otherDims';
import { TerrainMesher, type TextureInfo } from '../world/mesher';
import type { GenOptions } from '../world/gen/terrain';
import { setBiomeColorTables } from '../world/biomes';
import { BLOCKS } from '../world/blocks';

interface Gen {
  generate(cx: number, cz: number): GeneratedColumn;
}

let gens: Gen[] = [];
const mesher = new TerrainMesher();

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage(msg: unknown, transfer?: Transferable[]): void;
};

ctx.onmessage = (e: MessageEvent) => {
  const m = e.data;
  try {
    switch (m.type) {
      case 'init': {
        const opts = m.opts as GenOptions;
        gens = [new OverworldGenerator(opts), new EmberGenerator(opts), new SkyGenerator(opts)];
        mesher.setTextures(m.textures as Record<string, TextureInfo>);
        break;
      }
      case 'textures':
        mesher.setTextures(m.textures as Record<string, TextureInfo>);
        break;
      // Packs de ressources : couleurs d'herbe/feuillage par biome et teintes de blocs.
      case 'biomeColors':
        setBiomeColorTables(m.grass as Int32Array, m.foliage as Int32Array);
        break;
      case 'blockTints':
        for (const [id, tint, color] of m.tints as Array<[number, number, number]>) {
          const b = BLOCKS[id];
          if (!b) continue;
          b.tint = tint;
          b.tintColor = color;
        }
        break;
      case 'gen': {
        const g = gens[m.dim] ?? gens[0];
        const r = g.generate(m.cx, m.cz);
        ctx.postMessage({ type: 'gen', id: m.id, cx: m.cx, cz: m.cz, dim: m.dim, blocks: r.blocks, biomes: r.biomes, markers: r.markers }, [r.blocks.buffer, r.biomes.buffer]);
        break;
      }
      case 'mesh': {
        const sections = mesher.mesh({ cols: m.cols, biomes: m.biomes, sections: m.sections, hasSky: m.hasSky, fancyLeaves: m.fancyLeaves });
        const light = mesher.extractLight();
        const transfer: Transferable[] = [light.buffer];
        for (const s of sections) {
          if (s.solid) transfer.push(s.solid.buffer);
          if (s.trans) transfer.push(s.trans.buffer);
        }
        ctx.postMessage({ type: 'mesh', id: m.id, cx: m.cx, cz: m.cz, dim: m.dim, version: m.version, sections, light }, transfer);
        break;
      }
    }
  } catch (err) {
    ctx.postMessage({ type: 'error', id: m.id, message: String((err as Error)?.stack ?? err) });
  }
};
