/**
 * Boss : Golem antique, Gardien des profondeurs, Souverain des braises, Dragon des cieux.
 * Chacun possède plusieurs phases, des attaques variées et une barre de vie.
 */
import * as THREE from 'three';
import { Mob } from './Mob';
import type { EntityHost } from './host';
import type { DamageSource } from '../entity/Entity';
import { BLOCKS } from '../world/blocks';

abstract class Boss extends Mob {
  phase = 1;
  dormant = false;
  timer = 0;
  timer2 = 0;
  arena: THREE.Vector3 | null = null;
  shake = 0;

  constructor(type: string) {
    super(type);
    this.isBoss = true;
    this.persistent = true;
    this.stepHeight = 1.1;
  }

  get hpRatio(): number {
    return this.health / this.maxHealth;
  }

  protected updatePhase(host: EntityHost): void {
    const r = this.hpRatio;
    const np = r < 0.3 ? 3 : r < 0.6 ? 2 : 1;
    if (np !== this.phase) {
      this.phase = np;
      host.audio('roar', this.pos, 1.5);
      host.message(`§ ${this.def.bossTitle} entre en phase ${np} !`);
      host.particles.magic(this.pos.x, this.pos.y + this.height / 2, this.pos.z, 0xff4040, 30);
    }
  }

  override hurt(amount: number, src: DamageSource): boolean {
    if (this.dormant) this.wake();
    if (src.type === 'fall' || src.type === 'drown') return false;
    // Les projectiles font moins de dégâts aux boss
    if (src.type === 'projectile') amount *= 0.6;
    return super.hurt(amount, src);
  }

  wake(): void {
    this.dormant = false;
  }

  override tick(host: EntityHost): void {
    super.tick(host);
    if (!this.dead && !this.dormant && host.player.pos.distanceTo(this.pos) < 64) host.bossBar(this, this.def.bossTitle, this.hpRatio);
    if (this.dead && this.deathTime === 1) host.bossBar(null);
  }

  protected override ai(host: EntityHost): void {
    if (this.dormant) {
      const p = host.player;
      if (!p.creative && p.pos.distanceTo(this.pos) < 10) {
        this.wake();
        host.audio('roar', this.pos, 1.5);
        host.message(`§ ${this.def.bossTitle} se réveille !`);
      }
      return;
    }
    this.updatePhase(host);
    this.bossAi(host);
  }

  protected abstract bossAi(host: EntityHost): void;

  /** Onde de choc au sol. */
  protected shockwave(host: EntityHost, radius: number, dmg: number): void {
    host.audio('explode', this.pos, 0.8, 0.6);
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) host.particles.puff(this.pos.x + Math.cos(a) * radius * 0.6, this.pos.y + 0.2, this.pos.z + Math.sin(a) * radius * 0.6, 0x8a7a60, 3, 2, 4, 0.2, 0.8);
    for (const e of host.entitiesNear(this.pos, radius)) {
      if (e === this || !e.living || e.dead) continue;
      if (!e.onGround && e.pos.y > this.pos.y + 1) continue;
      const kb = e.pos.clone().sub(this.pos).setY(0).normalize().multiplyScalar(1.1).setY(0.6);
      e.hurt(dmg, { type: 'attack', attacker: this, knockback: kb });
    }
    this.shake = 10;
  }

  override serializeData(): Record<string, unknown> {
    return { ...super.serializeData(), dormant: this.dormant, arena: this.arena ? [this.arena.x, this.arena.y, this.arena.z] : undefined };
  }

  override loadData(d: Record<string, unknown>): void {
    super.loadData(d);
    this.dormant = !!d.dormant;
    if (Array.isArray(d.arena)) this.arena = new THREE.Vector3(d.arena[0], d.arena[1], d.arena[2]);
  }
}

// ------------------------------------------------------------------ Golem antique
export class AncientGolem extends Boss {
  summoned = false;
  constructor() {
    super('ancient_golem');
  }

  protected bossAi(host: EntityHost): void {
    const p = host.player;
    if (p.dead || p.creative || host.difficulty === 'peaceful') return this.aiWander(host);
    this.target = p;
    const d = p.pos.distanceTo(this.pos);
    this.timer++;
    this.timer2++;
    const speedMul = this.phase === 3 ? 1.4 : 1;
    if (d > 3.2) this.goTo(host, p.pos.x, p.pos.y, p.pos.z, speedMul);
    else {
      this.faceTowards(p.pos.x, p.pos.z, 0.5);
      if (this.attackCooldown <= 0) {
        this.attackCooldown = this.phase === 3 ? 18 : 28;
        this.swing = 12;
        const kb = p.pos.clone().sub(this.pos).setY(0).normalize().multiplyScalar(1.4).setY(0.7);
        p.hurt(this.def.damage!, { type: 'attack', attacker: this, knockback: kb });
        host.audio('boss_hit', this.pos);
      }
    }
    if (this.timer > (this.phase === 1 ? 160 : 110) && d < 8 && this.onGround) {
      this.timer = 0;
      this.vel.y = 0.5;
      setTimeout(() => !this.dead && this.shockwave(host, 6, 8), 450);
    }
    if (this.phase >= 2 && this.timer2 > 100 && d > 5 && this.canSee(host, p)) {
      this.timer2 = 0;
      const from = this.pos.clone().add(new THREE.Vector3(0, this.height, 0));
      const to = p.pos.clone();
      const flight = 1.4;
      const vel = to.sub(from).divideScalar(flight * 20);
      vel.y += 0.03 * flight * 20 * 0.5;
      host.spawnProjectile('boulder', this, from, vel);
      this.swing = 12;
    }
    if (this.phase === 3 && !this.summoned) {
      this.summoned = true;
      for (let i = 0; i < 2; i++) host.spawnMob('cave_crawler', this.pos.x + (i ? 2 : -2), this.pos.y, this.pos.z + 1);
    }
  }
}

// ------------------------------------------------------------------ Gardien des profondeurs
export class DeepGuardian extends Boss {
  charging = 0;
  constructor() {
    super('deep_guardian');
  }

  protected bossAi(host: EntityHost): void {
    const p = host.player;
    const center = this.arena ?? this.pos;
    if (p.dead || p.creative || host.difficulty === 'peaceful') {
      this.vel.y += (center.y + 3 - this.pos.y) * 0.002;
      return;
    }
    this.target = p;
    const d = p.pos.distanceTo(this.pos);
    // Tourne autour du joueur à distance
    const a = this.age * (this.phase === 3 ? 0.03 : 0.015);
    const want = new THREE.Vector3(p.pos.x + Math.cos(a) * 8, p.pos.y + 3, p.pos.z + Math.sin(a) * 8);
    const dir = want.sub(this.pos);
    if (dir.length() > 0.5) this.vel.addScaledVector(dir.normalize(), 0.02);
    this.faceTowards(p.pos.x, p.pos.z, 0.3);
    this.timer++;
    const laserEvery = this.phase === 3 ? 60 : 110;
    if (this.charging > 0) {
      this.charging--;
      // Rayon d'avertissement
      const from = this.eyePos(new THREE.Vector3());
      const to = p.eyePos(new THREE.Vector3());
      for (let i = 0; i < 4; i++) {
        const t = Math.random();
        host.particles.puff(from.x + (to.x - from.x) * t, from.y + (to.y - from.y) * t, from.z + (to.z - from.z) * t, this.charging < 10 ? 0xffffff : 0x3a9ad8, 1, 0.05, 0, 0.08, 0.2);
      }
      if (this.charging === 0 && this.canSee(host, p) && d < 24) {
        p.hurt(this.phase === 3 ? 9 : 6, { type: 'magic', attacker: this });
        host.audio('shoot', p.pos);
      }
    } else if (this.timer > laserEvery) {
      this.timer = 0;
      this.charging = 30;
      host.audio('deep_guardian', this.pos);
    }
    if (this.phase >= 2 && this.age % 300 === 0) {
      host.spawnMob(Math.random() < 0.5 ? 'crystal_slime' : 'cave_crawler', this.pos.x, this.pos.y - 1, this.pos.z);
      host.particles.magic(this.pos.x, this.pos.y, this.pos.z, 0x3a9ad8, 20);
    }
    if (d < 3.5 && this.attackCooldown <= 0) this.meleeAttack(host, p);
  }
}

// ------------------------------------------------------------------ Souverain des braises
export class EmberSovereign extends Boss {
  spirits = 0;
  constructor() {
    super('ember_sovereign');
  }

  protected bossAi(host: EntityHost): void {
    const p = host.player;
    if (p.dead || p.creative || host.difficulty === 'peaceful') return this.aiWander(host);
    this.target = p;
    const d = p.pos.distanceTo(this.pos);
    this.timer++;
    this.timer2++;
    if (d > 6) this.goTo(host, p.pos.x, p.pos.y, p.pos.z, this.phase === 3 ? 1.3 : 1);
    else if (d < 3) {
      this.faceTowards(p.pos.x, p.pos.z, 0.6);
      if (this.attackCooldown <= 0) this.meleeAttack(host, p);
    } else this.faceTowards(p.pos.x, p.pos.z, 0.5);
    const fireEvery = this.phase === 1 ? 60 : this.phase === 2 ? 45 : 25;
    if (this.timer > fireEvery && this.canSee(host, p)) {
      this.timer = 0;
      this.shoot(host, p, this.phase === 3 ? 'small_fireball' : 'fireball');
    }
    if (this.phase >= 2 && this.timer2 > 200) {
      this.timer2 = 0;
      // Anneau de feu
      host.audio('ignite', this.pos);
      const fire = BLOCKS.find((b) => b?.key === 'fire')!.id;
      for (let a = 0; a < Math.PI * 2; a += Math.PI / 10) {
        const x = Math.floor(this.pos.x + Math.cos(a) * 5);
        const z = Math.floor(this.pos.z + Math.sin(a) * 5);
        const y = Math.floor(this.pos.y);
        if (host.world.id(x, y, z) === 0 && host.world.def(x, y - 1, z).solid && host.rules.fireSpread) host.world.set(x, y, z, fire, 0, 'tick');
      }
      for (const e of host.entitiesNear(this.pos, 6)) if (e !== this && e.living) e.fireTicks = Math.max(e.fireTicks, 100);
      if (this.spirits < 4) {
        this.spirits += 2;
        host.spawnMob('fire_spirit', this.pos.x + 2, this.pos.y + 3, this.pos.z);
        host.spawnMob('fire_spirit', this.pos.x - 2, this.pos.y + 3, this.pos.z);
      }
    }
  }
}

// ------------------------------------------------------------------ Dragon des cieux
export class SkyDragon extends Boss {
  swooping = 0;
  constructor() {
    super('sky_dragon');
    this.noGravity = true;
  }

  protected bossAi(host: EntityHost): void {
    const p = host.player;
    const center = this.arena ?? new THREE.Vector3(this.pos.x, this.pos.y, this.pos.z);
    this.timer++;
    this.timer2++;
    let target: THREE.Vector3;
    if (this.swooping > 0) {
      this.swooping--;
      target = p.pos.clone().add(new THREE.Vector3(0, 1, 0));
      const d = p.pos.distanceTo(this.pos);
      if (d < 4 && this.attackCooldown <= 0 && !p.creative) {
        this.attackCooldown = 30;
        const kb = this.vel.clone().setY(0).normalize().multiplyScalar(1.5).setY(0.8);
        p.hurt(this.def.damage!, { type: 'attack', attacker: this, knockback: kb });
        host.audio('boss_hit', this.pos);
        this.swooping = 0;
      }
    } else {
      const a = this.age * (this.phase === 3 ? 0.02 : 0.012);
      target = new THREE.Vector3(center.x + Math.cos(a) * 22, center.y + 14 + Math.sin(this.age * 0.03) * 3, center.z + Math.sin(a) * 22);
      if (!p.creative && !p.dead && host.difficulty !== 'peaceful' && p.pos.distanceTo(this.pos) < 60) {
        const swoopEvery = this.phase === 3 ? 140 : 240;
        if (this.timer > swoopEvery) {
          this.timer = 0;
          this.swooping = 70;
          host.audio('roar', this.pos, 1.5);
        }
        if (this.timer2 > (this.phase === 1 ? 90 : 60) && this.canSee(host, p)) {
          this.timer2 = 0;
          for (let i = 0; i < 3; i++) {
            const from = this.eyePos(new THREE.Vector3());
            const dir = p.eyePos(new THREE.Vector3()).sub(from).normalize();
            dir.x += (Math.random() - 0.5) * 0.15;
            dir.z += (Math.random() - 0.5) * 0.15;
            host.spawnProjectile('lightning_orb', this, from, dir.multiplyScalar(0.8));
          }
          host.audio('shoot', this.pos);
        }
        if (this.phase >= 2 && this.age % 160 === 0) {
          host.strikeLightning(p.pos.x + (Math.random() - 0.5) * 6, p.pos.z + (Math.random() - 0.5) * 6);
        }
      }
    }
    const dir = target.sub(this.pos);
    const len = dir.length();
    if (len > 0.5) this.vel.addScaledVector(dir.divideScalar(len), this.swooping > 0 ? 0.08 : 0.035);
    this.vel.clampLength(0, this.swooping > 0 ? 1.4 : 0.8);
    if (this.vel.lengthSq() > 1e-3) this.yaw = Math.atan2(-this.vel.x, -this.vel.z);
  }
}

export const BOSS_CLASSES: Record<string, new () => Mob> = {
  ancient_golem: AncientGolem,
  deep_guardian: DeepGuardian,
  ember_sovereign: EmberSovereign,
  sky_dragon: SkyDragon,
};
