/**
 * Sérialisation compacte et robuste des colonnes :
 * - palette locale par colonne (noms de blocs) → insensible au réordonnancement des registres/mods
 * - compression RLE des sections
 */
import type { Chunk, BlockEntityData } from '../world/chunk';
import type { BlockRegistry } from '../registry/blocks';
import { SECTIONS, SECTION_VOL } from '../world/constants';

export const CHUNK_FORMAT = 2;

export interface ChunkRecord {
  v: number;
  cx: number;
  cz: number;
  palette: string[];
  sections: (Uint16Array | null)[]; // RLE : paires (compte, valeur)
  biomes: Uint8Array;
  tints: Uint32Array;
  blockEntities: [number, BlockEntityData][];
  entities: unknown[];
}

export function rleEncode(data: Uint16Array): Uint16Array {
  const out: number[] = [];
  let i = 0;
  while (i < data.length) {
    const v = data[i];
    let n = 1;
    while (i + n < data.length && data[i + n] === v && n < 65535) n++;
    out.push(n, v);
    i += n;
  }
  return Uint16Array.from(out);
}

export function rleDecode(rle: Uint16Array, length = SECTION_VOL): Uint16Array {
  const out = new Uint16Array(length);
  let o = 0;
  for (let i = 0; i + 1 < rle.length; i += 2) {
    const n = rle[i],
      v = rle[i + 1];
    if (o + n > length) throw new Error('RLE corrompu');
    out.fill(v, o, o + n);
    o += n;
  }
  if (o !== length) throw new Error('RLE incomplet');
  return out;
}

export function encodeChunk(c: Chunk, reg: BlockRegistry, entities: unknown[] = []): ChunkRecord {
  const palette: string[] = [];
  const localOf = new Map<number, number>();
  const sections: (Uint16Array | null)[] = [];
  for (let s = 0; s < SECTIONS; s++) {
    const b = c.sections[s].blocks;
    if (!b) {
      sections.push(null);
      continue;
    }
    const local = new Uint16Array(SECTION_VOL);
    for (let i = 0; i < SECTION_VOL; i++) {
      const v = b[i];
      const id = v & 0xfff;
      let li = localOf.get(id);
      if (li === undefined) {
        li = palette.length;
        palette.push(reg.get(id).id);
        localOf.set(id, li);
      }
      local[i] = li | (v & 0xf000);
    }
    sections.push(rleEncode(local));
  }
  return {
    v: CHUNK_FORMAT,
    cx: c.cx,
    cz: c.cz,
    palette,
    sections,
    biomes: c.biomes.slice(),
    tints: c.tints.slice(),
    blockEntities: [...c.blockEntities.entries()],
    entities,
  };
}

export interface DecodedChunk {
  sections: (Uint16Array | null)[];
  biomes: Uint8Array;
  tints: Uint32Array;
  blockEntities: [number, BlockEntityData][];
  entities: unknown[];
}

export function decodeChunk(r: ChunkRecord, reg: BlockRegistry): DecodedChunk {
  if (!r || typeof r !== 'object' || !Array.isArray(r.palette) || !Array.isArray(r.sections)) throw new Error('Colonne illisible');
  const map = r.palette.map((name) => reg.tryNum(name));
  const sections = r.sections.map((rle) => {
    if (!rle) return null;
    const local = rleDecode(rle instanceof Uint16Array ? rle : Uint16Array.from(rle as ArrayLike<number>));
    for (let i = 0; i < local.length; i++) {
      const v = local[i];
      const id = map[v & 0xfff] ?? 0;
      local[i] = id === 0 ? 0 : id | (v & 0xf000);
    }
    return local;
  });
  while (sections.length < SECTIONS) sections.push(null);
  return {
    sections,
    biomes: r.biomes instanceof Uint8Array ? r.biomes : Uint8Array.from(r.biomes as ArrayLike<number>),
    tints: r.tints instanceof Uint32Array ? r.tints : Uint32Array.from(r.tints as ArrayLike<number>),
    blockEntities: r.blockEntities ?? [],
    entities: r.entities ?? [],
  };
}
