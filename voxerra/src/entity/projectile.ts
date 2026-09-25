/** Projectiles : flèches, boules de feu, éclats de givre, épines, bombes, rayons… */
import { Entity } from './entity';
import type { Sim } from '../sim/sim';
import { raycastBlocks, rayBox } from '../physics/raycast';
import type { LivingEntity } from './living';

interface ProjSpec {
  gravity: number;
  drag: number;
  life: number;
  explode?: number; // rayon
  explodeDamage?: number;
  cloud?: string; // effet de zone
  pickup?: string; // objet récupérable à l'impact
  particle?: string;
  knockback?: number;
  homing?: number;
  pierce?: boolean;
  size: number;
  fireImmune?: boolean;
}

export const PROJECTILES: Record<string, ProjSpec> = {
  fleche: { gravity: 20, drag: 0.99, life: 30, pickup: 'fleche', size: 0.1 },
  boule_feu: { gravity: 0, drag: 1, life: 6, explode: 1.6, explodeDamage: 3, particle: 'flamme', size: 0.25 },
  eclat_givre: { gravity: 0, drag: 1, life: 5, particle: 'givre', size: 0.2 },
  epine: { gravity: 12, drag: 0.99, life: 8, size: 0.1 },
  boule_neige: { gravity: 22, drag: 0.99, life: 10, knockback: 0.6, size: 0.12 },
  bombe_spore: { gravity: 22, drag: 0.99, life: 10, explode: 3, explodeDamage: 4, cloud: 'poison', particle: 'spore', size: 0.15 },
  rayon_cristal: { gravity: 0, drag: 1, life: 3, particle: 'etincelle', size: 0.15 },
  boule_braise: { gravity: 0, drag: 1, life: 8, explode: 2.6, explodeDamage: 6, particle: 'flamme', size: 0.5 },
  orbe_vide: { gravity: 0, drag: 1, life: 10, homing: 3, particle: 'portail', size: 0.35 },
  crachat_magma: { gravity: 14, drag: 0.99, life: 8, explode: 1.2, explodeDamage: 2, particle: 'braise', size: 0.2 },
};

export class Projectile extends Entity {
  readonly kind = 'projectile';
  readonly spec: ProjSpec;
  life: number;
  crit = false;
  hitEntities = new Set<number>();
  ownerId: number;

  constructor(
    readonly type: string,
    public owner: Entity | null,
    public damageAmount: number,
    public element?: 'fire' | 'frost' | 'poison' | 'shock',
  ) {
    const spec = PROJECTILES[type] ?? PROJECTILES.fleche;
    super(spec.size, spec.size * 2, spec.size);
    this.spec = spec;
    this.life = spec.life;
    this.ownerId = owner?.id ?? 0;
    if (type === 'boule_feu' || type === 'boule_braise' || type === 'crachat_magma') this.element = this.element ?? 'fire';
    if (type === 'eclat_givre') this.element = 'frost';
    if (type === 'rayon_cristal') this.element = 'shock';
  }

  tick(sim: Sim, dt: number): void {
    const b = this.body;
    this.life -= dt;
    this.age += dt;
    if (this.life <= 0) {
      this.removed = true;
      return;
    }
    const s = this.spec;
    // Tête chercheuse
    if (s.homing) {
      const target = sim.players.filter((p) => p.dim === this.dim && !p.dead && !p.creative).sort((a, b2) => a.distTo(this.x, this.y, this.z) - b2.distTo(this.x, this.y, this.z))[0];
      if (target) {
        const dx = target.x - this.x,
          dy = target.y + 1 - this.y,
          dz = target.z - this.z;
        const l = Math.hypot(dx, dy, dz) || 1;
        const sp = Math.hypot(b.vx, b.vy, b.vz);
        b.vx += (dx / l) * sp * s.homing * dt;
        b.vy += (dy / l) * sp * s.homing * dt;
        b.vz += (dz / l) * sp * s.homing * dt;
        const nl = Math.hypot(b.vx, b.vy, b.vz) || 1;
        b.vx = (b.vx / nl) * sp;
        b.vy = (b.vy / nl) * sp;
        b.vz = (b.vz / nl) * sp;
      }
    }
    b.vy -= s.gravity * dt;
    const drag = Math.pow(s.drag, dt * 20);
    b.vx *= drag;
    b.vy *= drag;
    b.vz *= drag;
    const dx = b.vx * dt,
      dy = b.vy * dt,
      dz = b.vz * dt;
    const len = Math.hypot(dx, dy, dz);
    if (len < 1e-6) return;
    this.yaw = Math.atan2(-b.vx, -b.vz);
    this.pitch = Math.atan2(b.vy, Math.hypot(b.vx, b.vz));
    const w = sim.world(this.dim);
    const hit = raycastBlocks(w, b.x, b.y, b.z, dx, dy, dz, len);
    // Entités touchées sur le segment
    let bestT = hit ? hit.dist : len;
    let bestE: LivingEntity | null = null;
    for (const e of sim.entities.near(this.dim, b.x, b.y, b.z, len + 3)) {
      if (e === this || e.id === this.ownerId || e.kind === 'item' || e.kind === 'projectile' || e.kind === 'grave') continue;
      const le = e as LivingEntity;
      if (le.dead || this.hitEntities.has(e.id)) continue;
      if ((e as { spectator?: boolean }).spectator) continue;
      // les créatures ne se tirent pas dessus entre elles
      if (this.owner?.kind === 'mob' && e.kind === 'mob') continue;
      const r = rayBox(b.x, b.y, b.z, dx / len, dy / len, dz / len, e.x - e.body.hw - s.size, e.y - s.size, e.z - e.body.hw - s.size, e.x + e.body.hw + s.size, e.y + e.body.h + s.size, e.z + e.body.hw + s.size);
      if (r && r[0] <= bestT) {
        bestT = r[0];
        bestE = le;
      }
    }
    if (s.particle && Math.random() < 0.7) sim.emit({ t: 'particles', kind: s.particle, x: b.x, y: b.y, z: b.z, n: 1 });
    if (bestE) {
      b.x += (dx / len) * bestT;
      b.y += (dy / len) * bestT;
      b.z += (dz / len) * bestT;
      this.hitEntity(sim, bestE);
      return;
    }
    if (hit) {
      b.x = hit.px - (dx / len) * 0.05;
      b.y = hit.py - (dy / len) * 0.05;
      b.z = hit.pz - (dz / len) * 0.05;
      this.impact(sim);
      if (s.pickup && sim.rng.chance(0.6) && this.owner?.kind === 'player' && !(this.owner as unknown as { creative: boolean }).creative) sim.spawnItem(this.dim, b.x, b.y, b.z, { id: s.pickup, count: 1 }, false);
      this.removed = true;
      return;
    }
    b.x += dx;
    b.y += dy;
    b.z += dz;
  }

  private hitEntity(sim: Sim, e: LivingEntity): void {
    const sp = Math.hypot(this.body.vx, this.body.vy, this.body.vz);
    let dmg = this.damageAmount;
    if (this.type === 'fleche') dmg = Math.max(1, dmg * Math.min(1.2, sp / 40)) * (this.crit ? 1.5 : 1);
    const done = e.damage(dmg, { type: 'projectile', attacker: this.owner, element: this.element, knockback: this.spec.knockback ?? 0.6, fromX: this.x - this.body.vx, fromZ: this.z - this.body.vz });
    if (done > 0) sim.emit({ t: 'hurt', id: e.id, amount: done });
    sim.emit({ t: 'sound', id: 'impact_' + this.type, x: this.x, y: this.y, z: this.z });
    if (e.dead && this.owner?.kind === 'player') {
      const p = this.owner as unknown as { stat: (k: string) => void };
      p.stat('creatures_tuees');
      sim.trigger(this.owner as never, 'kill', { creature: (e as unknown as { type: string }).type });
      sim.trigger(this.owner as never, 'kill_ranged', { creature: (e as unknown as { type: string }).type });
    }
    this.hitEntities.add(e.id);
    if (this.spec.explode) this.impact(sim);
    if (!this.spec.pierce) this.removed = true;
  }

  private impact(sim: Sim): void {
    const s = this.spec;
    if (!s.explode) {
      sim.emit({ t: 'sound', id: 'impact_' + this.type, x: this.x, y: this.y, z: this.z, vol: 0.6 });
      return;
    }
    sim.emit({ t: 'particles', kind: s.cloud === 'poison' ? 'nuage_poison' : 'explosion', x: this.x, y: this.y, z: this.z, n: 20, spread: s.explode });
    sim.emit({ t: 'sound', id: 'explosion', x: this.x, y: this.y, z: this.z, vol: Math.min(1, s.explode / 2) });
    for (const e of sim.entities.near(this.dim, this.x, this.y, this.z, s.explode + 1)) {
      if (e.kind === 'item' || e.kind === 'projectile' || e.kind === 'grave') continue;
      if (e.id === this.ownerId && this.owner?.kind === 'mob') continue;
      const le = e as LivingEntity;
      const d = Math.hypot(e.x - this.x, e.y + e.body.h / 2 - this.y, e.z - this.z);
      if (d > s.explode + 0.5) continue;
      const f = 1 - Math.min(1, d / (s.explode + 0.5));
      le.damage?.((s.explodeDamage ?? 2) * f + 0.5, { type: 'explosion', attacker: this.owner, fromX: this.x, fromZ: this.z, knockback: 1.2 * f, element: this.element });
      if (s.cloud === 'poison') le.addEffect?.('poison', 6);
    }
  }
}
