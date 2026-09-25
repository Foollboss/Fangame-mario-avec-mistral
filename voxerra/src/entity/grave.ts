/**
 * Tombe : à la mort, les objets du joueur y sont conservés (ils ne disparaissent
 * pas). Le joueur les récupère en s'approchant.
 */
import { Entity } from './entity';
import type { ItemStack } from '../inventory/inventory';
import type { Sim } from '../sim/sim';

export class Grave extends Entity {
  readonly kind = 'grave';
  owner: string;
  items: ItemStack[];

  constructor(owner: string, items: ItemStack[]) {
    super(0.45, 1, 0.5);
    this.owner = owner;
    this.items = items;
    this.displayName = `Tombe de ${owner}`;
  }

  tick(sim: Sim, dt: number): void {
    this.age += dt;
    if (this.items.length === 0) {
      this.removed = true;
      return;
    }
    if (Math.floor(this.age * 2) === Math.floor((this.age - dt) * 2)) return;
    for (const p of sim.players) {
      if (p.dead || p.dim !== this.dim || p.spectator) continue;
      if (p.distTo(this.x, this.y, this.z) > 1.6) continue;
      const kept: ItemStack[] = [];
      let got = 0;
      for (const s of this.items) {
        const rest = p.inventory.give(s);
        got += s.count - (rest?.count ?? 0);
        if (rest) kept.push(rest);
      }
      this.items = kept;
      if (got > 0) {
        sim.emit({ t: 'sound', id: 'ramassage', x: this.x, y: this.y, z: this.z });
        sim.emit({ t: 'msg', text: kept.length ? 'Vous récupérez une partie de vos objets (inventaire plein).' : 'Vous avez récupéré vos objets.', color: '#a8ffa8', to: p.id });
      }
      if (this.items.length === 0) this.removed = true;
    }
  }

  serialize(): Record<string, unknown> {
    return { type: 'grave', x: this.x, y: this.y, z: this.z, owner: this.owner, items: this.items };
  }
}
