/**
 * Worker « monde » : génération procédurale et maillage des sections,
 * hors du fil principal. Plusieurs instances tournent en parallèle.
 */
import { Content, BASE_PACK, mergePacks } from '../registry/content';
import { createGenerator, type DimGenerator } from '../worldgen/generator';
import { meshSection, type MeshInput } from '../render/mesher';
import { applyBiomeOverrides } from '../worldgen/biomes';
import type { ContentPack } from '../registry/types';
import type { BlockTables } from '../registry/blocks';

interface Ctx {
  postMessage(msg: unknown, transfer?: Transferable[]): void;
  onmessage: ((e: MessageEvent) => void) | null;
}
const ctx = self as unknown as Ctx;

let content: Content | null = null;
let tables: BlockTables | null = null;
const gens = new Map<string, DimGenerator>();
let seed = 0;
let worldType = 'normal';

function gen(dim: string): DimGenerator {
  let g = gens.get(dim);
  if (!g) {
    g = createGenerator(dim, seed, content!, worldType);
    gens.set(dim, g);
  }
  return g;
}

ctx.onmessage = (e: MessageEvent) => {
  const m = e.data;
  try {
    switch (m.type) {
      case 'init': {
        const packs: ContentPack[] = m.packs ?? [];
        const pack = mergePacks([BASE_PACK, ...packs]);
        applyBiomeOverrides(pack.biomes);
        content = new Content(pack);
        tables = content.blocks.tables();
        seed = m.seed >>> 0;
        worldType = m.worldType ?? 'normal';
        gens.clear();
        ctx.postMessage({ type: 'ready', id: m.id });
        break;
      }
      case 'gen': {
        const t0 = performance.now();
        const buf = gen(m.dim).generate(m.cx, m.cz);
        const transfer: Transferable[] = [];
        const sections = buf.sections.map((s) => {
          if (s) transfer.push(s.buffer);
          return s;
        });
        transfer.push(buf.biomes.buffer, buf.tints.buffer);
        ctx.postMessage(
          {
            type: 'gen',
            id: m.id,
            cx: m.cx,
            cz: m.cz,
            dim: m.dim,
            sections,
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
        const input = m.input as MeshInput;
        const out = meshSection(input, tables!);
        const transfer: Transferable[] = [];
        for (const p of out.passes) if (p) transfer.push(p.pos.buffer, p.uv.buffer, p.light.buffer, p.color.buffer, p.index.buffer);
        ctx.postMessage({ type: 'mesh', id: m.id, key: m.key, seq: m.seq, out }, transfer);
        break;
      }
    }
  } catch (err) {
    ctx.postMessage({ type: 'error', id: m.id, error: String((err as Error)?.stack ?? err) });
  }
};
