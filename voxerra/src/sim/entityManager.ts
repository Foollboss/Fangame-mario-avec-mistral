/** Registre des entités actives de toutes les dimensions. */
import type { Entity } from '../entity/entity';

export class EntityManager {
  readonly list: Entity[] = [];
  readonly byId = new Map<number, Entity>();

  add<T extends Entity>(e: T): T {
    if (this.byId.has(e.id)) return e;
    this.list.push(e);
    this.byId.set(e.id, e);
    return e;
  }

  remove(e: Entity): void {
    e.removed = true;
  }

  /** Retire effectivement les entités marquées. */
  sweep(): Entity[] {
    const gone: Entity[] = [];
    for (let i = this.list.length - 1; i >= 0; i--) {
      const e = this.list[i];
      if (e.removed) {
        this.list.splice(i, 1);
        this.byId.delete(e.id);
        gone.push(e);
      }
    }
    return gone;
  }

  get(id: number): Entity | undefined {
    return this.byId.get(id);
  }

  *inDim(dim: string): Iterable<Entity> {
    for (const e of this.list) if (e.dim === dim && !e.removed) yield e;
  }

  near(dim: string, x: number, y: number, z: number, r: number, filter?: (e: Entity) => boolean): Entity[] {
    const out: Entity[] = [];
    const r2 = r * r;
    for (const e of this.list) {
      if (e.removed || e.dim !== dim) continue;
      const dx = e.x - x,
        dy = e.y - y,
        dz = e.z - z;
      if (dx * dx + dy * dy + dz * dz <= r2 && (!filter || filter(e))) out.push(e);
    }
    return out;
  }

  count(dim: string, filter: (e: Entity) => boolean): number {
    let n = 0;
    for (const e of this.list) if (!e.removed && e.dim === dim && filter(e)) n++;
    return n;
  }

  /** Entités dans une colonne de chunks. */
  inChunk(dim: string, cx: number, cz: number): Entity[] {
    return this.list.filter((e) => !e.removed && e.dim === dim && Math.floor(e.x / 16) === cx && Math.floor(e.z / 16) === cz);
  }
}
