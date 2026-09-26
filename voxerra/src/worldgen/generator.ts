/** Point d'entrée de la génération : un générateur par dimension. */
import type { ChunkBuffer } from './buffer';
import type { Content } from '../registry/content';
import { OverworldGenerator } from './overworld';
import { AbyssGenerator } from './abyss';
import { AstralGenerator } from './astral';
import { CelesteGenerator } from './celeste';
import { FlatGenerator } from './flat';

export interface DimGenerator {
  readonly dim: string;
  generate(cx: number, cz: number): ChunkBuffer;
  /** Estimation pure de la hauteur du sol (structures, apparition). */
  surfaceHeight(x: number, z: number): number;
  biomeAt(x: number, z: number): number;
  findSpawn(): { x: number; y: number; z: number };
  /** Structure la plus proche (commande /localiser). */
  locateStructure?(type: string, x: number, z: number): { x: number; z: number; name?: string } | null;
}

export const DIMENSIONS = ['surface', 'abime', 'astral', 'celeste'] as const;
export type DimensionId = (typeof DIMENSIONS)[number];

export interface DimensionInfo {
  id: DimensionId;
  name: string;
  /** Hauteur utile du monde. */
  height: number;
  /** Échelle des coordonnées par rapport à la surface (portails). */
  scale: number;
  hasSky: boolean;
  gravity: number;
  ceiling: boolean;
}

export const DIMENSION_INFO: Record<DimensionId, DimensionInfo> = {
  surface: { id: 'surface', name: "Terres d'Aube", height: 256, scale: 1, hasSky: true, gravity: 1, ceiling: false },
  abime: { id: 'abime', name: "L'Abîme cendré", height: 128, scale: 4, hasSky: false, gravity: 1, ceiling: true },
  astral: { id: 'astral', name: 'Les Cimes astrales', height: 256, scale: 1, hasSky: true, gravity: 0.62, ceiling: false },
  celeste: { id: 'celeste', name: 'Les Îles célestes', height: 256, scale: 1, hasSky: true, gravity: 1, ceiling: false },
};

export function createGenerator(dim: string, seed: number, content: Content, worldType = 'normal', structures = true): DimGenerator {
  if (dim === 'surface' && worldType === 'plat') return new FlatGenerator(seed, content);
  let g: OverworldGenerator | AbyssGenerator | AstralGenerator | CelesteGenerator;
  switch (dim) {
    case 'abime':
      g = new AbyssGenerator(seed, content);
      break;
    case 'astral':
      g = new AstralGenerator(seed, content);
      break;
    case 'celeste':
      g = new CelesteGenerator(seed, content);
      break;
    default:
      g = new OverworldGenerator(seed, content);
  }
  g.structures.enabled = structures;
  return g;
}
