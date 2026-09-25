/**
 * Traitement des requêtes « monde » (génération, maillage), partagé entre le
 * worker et le mode de secours sur le fil principal (workers indisponibles).
 */
import { Content, BASE_PACK, mergePacks } from '../registry/content';
import { createGenerator, type DimGenerator } from '../worldgen/generator';
import { meshSection, type MeshInput } from '../render/mesher';
import { applyBiomeOverrides } from '../worldgen/biomes';
import type { ContentPack } from '../registry/types';
import type { BlockTables } from '../registry/blocks';

export type PostFn = (msg: unknown, transfer?: Transferable[]) => void;

export function createWorldHandler(post: PostFn): (m: Record<string, unknown> & { type: string; id: number }) => void {
  let content: Content | null = null;
  let tables: BlockTables | null = null;
  const gens = new Map<string, DimGenerator>();
  let seed = 0;
  let worldType = 'normal';
  let structures = true;

  const gen = (dim: string): DimGenerator => {
    let g = gens.get(dim);
    if (!g) {
      g = createGenerator(dim, seed, content!, worldType, structures);
      gens.set(dim, g);
    }
    return g;
  };

  return (m) => {
    try {
      switch (m.type) {
        case 'init': {
          const packs = (m.packs as ContentPack[]) ?? [];
          const pack = mergePacks([BASE_PACK, ...packs]);
          applyBiomeOverrides(pack.biomes);
          content = new Content(pack);
          tables = content.blocks.tables();
          seed = (m.seed as number) >>> 0;
          worldType = (m.worldType as string) ?? 'normal';
          structures = m.structures !== false;
          gens.clear();
          post({ type: 'ready', id: m.id });
          break;
        }
        case 'gen': {
          const t0 = performance.now();
          const buf = gen(m.dim as string).generate(m.cx as number, m.cz as number);
          const transfer: Transferable[] = [];
          for (const s of buf.sections) if (s) transfer.push(s.buffer);
          transfer.push(buf.biomes.buffer, buf.tints.buffer);
          post(
            {
              type: 'gen',
              id: m.id,
              cx: m.cx,
              cz: m.cz,
              dim: m.dim,
              sections: buf.sections,
              biomes: buf.biomes,
              tints: buf.tints,
              blockEntities: buf.blockEntities,
              entities: buf.entities,
              ms: performance.now() - t0,
            },
            transfer,
          );
          break;
        }
        case 'mesh': {
          const out = meshSection(m.input as MeshInput, tables!);
          const transfer: Transferable[] = [];
          for (const p of out.passes) if (p) transfer.push(p.pos.buffer, p.uv.buffer, p.light.buffer, p.color.buffer, p.index.buffer);
          post({ type: 'mesh', id: m.id, key: m.key, seq: m.seq, out }, transfer);
          break;
        }
      }
    } catch (err) {
      post({ type: 'error', id: m.id, error: String((err as Error)?.stack ?? err) });
    }
  };
}
