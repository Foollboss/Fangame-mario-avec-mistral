/** Structures procédurales (implémentation complète dans structures/*). */
import type { ChunkBuffer } from './buffer';
import type { Content } from '../registry/content';
import type { DimGenerator } from './generator';

export class StructureManager {
  constructor(
    readonly seed: number,
    readonly content: Content,
    readonly gen: DimGenerator,
  ) {}

  generate(buf: ChunkBuffer): void {
    void buf;
  }
}
