/** Monde plat « construction » : socle, terre, herbe ; aucune grotte. */
import { ChunkBuffer } from './buffer';
import type { Content } from '../registry/content';
import type { DimGenerator } from './generator';
import { biomeIdx } from './biomes';
import { computeTints } from './common';

export class FlatGenerator implements DimGenerator {
  readonly dim = 'surface';
  private plains = biomeIdx('plaines');
  constructor(
    readonly seed: number,
    readonly content: Content,
  ) {}

  surfaceHeight(): number {
    return 4;
  }
  biomeAt(): number {
    return this.plains;
  }
  findSpawn(): { x: number; y: number; z: number } {
    return { x: 0, y: 5, z: 0 };
  }

  generate(cx: number, cz: number): ChunkBuffer {
    const b = new ChunkBuffer(cx, cz, this.content.blocks.tables());
    const n = (id: string) => this.content.blocks.num(id);
    const socle = n('socle'),
      terre = n('terre'),
      herbe = n('herbe');
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        b.set(x, 0, z, socle);
        b.set(x, 1, z, terre);
        b.set(x, 2, z, terre);
        b.set(x, 3, z, terre);
        b.set(x, 4, z, herbe);
      }
    b.biomes.fill(this.plains);
    computeTints(b, () => this.plains);
    return b;
  }
}
