/** Objet au sol : gravité, fusion avec les objets identiques, ramassage. */
import { Entity } from './entity';
import { moveBody, probeEnvironment } from '../physics/collision';
import { sameItem, type ItemStack } from '../inventory/inventory';
import type { Sim } from '../sim/sim';
import type { Player } from './player';

export class ItemEntity extends Entity {
  readonly kind = 'item';
  pickupDelay = 0.6;
  life = 300;
  bob = Math.random() * Math.PI * 2;
  /** Joueur qui l'a lâché (délai plus long pour lui). */
  thrower = 0;

  constructor(public stack: ItemStack) {
    super(0.125, 0.25, 0.125);
  }

  tick(sim: Sim, dt: number): void {
    const b = this.body;
    const w = sim.world(this.dim);
    this.age += dt;
    this.life -= dt;
    this.pickupDelay -= dt;
    if (this.life <= 0) {
      this.removed = true;
      return;
    }
    probeEnvironment(w, b, 0.1);
    if (b.inLava) {
      this.removed = true;
      sim.emit({ t: 'sound', id: 'grésillement', x: this.x, y: this.y, z: this.z, vol: 0.5 });
      return;
    }
    if (b.inWater) {
      b.vy += (1.2 - b.vy) * Math.min(1, dt * 2);
    } else b.vy -= 22 * dt;
    b.vy = Math.max(b.vy, -30);
    const fr = b.onGround ? Math.pow(0.02, dt) : Math.pow(0.6, dt);
    b.vx *= fr;
    b.vz *= fr;
    moveBody(w, b, b.vx * dt, b.vy * dt, b.vz * dt);
    // Poussé hors d'un bloc solide
    const t = w.content.blocks;
    if (t.solid[w.getId(Math.floor(b.x), Math.floor(b.y + 0.1), Math.floor(b.z))] && t.opaque[w.getId(Math.floor(b.x), Math.floor(b.y + 0.1), Math.floor(b.z))]) b.y += 3 * dt;
    // Fusion
    if (Math.floor(this.age * 4) !== Math.floor((this.age - dt) * 4)) {
      for (const o of sim.entities.near(this.dim, this.x, this.y, this.z, 1.2, (e) => e !== this && e.kind === 'item')) {
        const it = o as ItemEntity;
        const max = sim.content.items.get(this.stack.id)?.stackSize ?? 64;
        if (!it.removed && sameItem(it.stack, this.stack) && this.stack.count + it.stack.count <= max && it.id > this.id) {
          this.stack.count += it.stack.count;
          it.removed = true;
          this.life = Math.max(this.life, it.life);
        }
      }
    }
    // Ramassage
    if (this.pickupDelay <= 0) {
      for (const p of sim.players) {
        if (p.dead || p.dim !== this.dim || p.spectator) continue;
        const dx = p.x - this.x,
          dy = p.y + 0.8 - this.y,
          dz = p.z - this.z;
        if (dx * dx + dy * dy + dz * dz > 2.2) continue;
        if (this.thrower === p.id && this.pickupDelay > -1.2) continue;
        this.pickup(sim, p);
        if (this.removed) break;
      }
    }
  }

  private pickup(sim: Sim, p: Player): void {
    const before = this.stack.count;
    const rest = p.inventory.give(this.stack);
    const taken = before - (rest?.count ?? 0);
    if (taken <= 0) return;
    sim.onItemObtained(p, this.stack.id, taken);
    sim.emit({ t: 'itemPickup', id: this.id, item: this.stack.id, count: taken, to: p.id });
    sim.emit({ t: 'sound', id: 'ramassage', x: this.x, y: this.y, z: this.z, vol: 0.4, pitch: 1 + Math.random() * 0.4 });
    if (rest) this.stack = rest;
    else this.removed = true;
  }

  serialize(): Record<string, unknown> {
    return { type: 'item', x: this.x, y: this.y, z: this.z, stack: this.stack, life: this.life };
  }
}
