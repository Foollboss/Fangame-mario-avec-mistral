/**
 * Entity — base commune du joueur, des créatures, projectiles et véhicules :
 * position, vitesse, boîte de collision, physique à 20 tics/s (valeurs proches du jeu de référence).
 */
import * as THREE from 'three';
import { aabb, blockUnder, fluidState, moveBox, onClimbable, slowFactor, type AABB, type FluidState } from './physics';
import type { World } from '../world/World';
import { BLOCKS } from '../world/blocks';

let nextEntityId = 1;

export interface DamageSource {
  type: 'attack' | 'fall' | 'lava' | 'fire' | 'drown' | 'starve' | 'void' | 'explosion' | 'contact' | 'projectile' | 'magic' | 'suffocate' | 'lightning' | 'generic';
  attacker?: Entity | null;
  /** Direction de recul. */
  knockback?: THREE.Vector3;
}

export abstract class Entity {
  readonly id = nextEntityId++;
  abstract readonly type: string;
  pos = new THREE.Vector3();
  prevPos = new THREE.Vector3();
  vel = new THREE.Vector3();
  yaw = 0;
  pitch = 0;
  prevYaw = 0;
  bodyYaw = 0;
  width = 0.6;
  height = 1.8;
  eyeHeight = 1.62;
  stepHeight = 0.6;
  onGround = false;
  hitHorizontal = false;
  fluid: FluidState = { water: false, lava: false, eyesInWater: false, eyesInLava: false, submerged: 0 };
  climbing = false;
  fallDistance = 0;
  noGravity = false;
  removed = false;
  age = 0;
  health = 20;
  maxHealth = 20;
  hurtTime = 0;
  invulnerable = 0;
  fireTicks = 0;
  dead = false;
  deathTime = 0;
  /** Véhicule / monture. */
  vehicle: Entity | null = null;
  passenger: Entity | null = null;
  /** L'entité est-elle sauvegardée avec le tronçon ? */
  persistent = false;
  /** Créature vivante (peut être attaquée, touchée par les projectiles). */
  living = false;
  world!: World;

  get box(): AABB {
    return aabb(this.pos.x, this.pos.y, this.pos.z, this.width, this.height);
  }

  eyePos(out = new THREE.Vector3()): THREE.Vector3 {
    return out.set(this.pos.x, this.pos.y + this.eyeHeight, this.pos.z);
  }

  lookDir(out = new THREE.Vector3()): THREE.Vector3 {
    const cp = Math.cos(this.pitch);
    return out.set(-Math.sin(this.yaw) * cp, Math.sin(this.pitch), -Math.cos(this.yaw) * cp);
  }

  /** Déplacement avec collisions (en blocs par tic). */
  move(dx: number, dy: number, dz: number): void {
    const b = this.box;
    const slow = slowFactor(this.world, b);
    if (slow < 1) {
      dx *= slow;
      dy *= slow;
      dz *= slow;
      if (dy < 0) this.fallDistance = 0;
    }
    const r = moveBox(this.world, b, dx, dy, dz, this.onGround ? this.stepHeight : 0, this.onGround);
    this.pos.set((b.x0 + b.x1) / 2, b.y0, (b.z0 + b.z1) / 2);
    this.hitHorizontal = r.hitX || r.hitZ;
    if (r.hitX) this.vel.x = 0;
    if (r.hitZ) this.vel.z = 0;
    if (r.hitY) {
      if (this.vel.y < 0 && r.onGround) this.landed();
      this.vel.y = 0;
    }
    this.onGround = r.onGround || (r.hitY && dy < 0);
    if (!this.onGround && r.dy < 0) this.fallDistance -= r.dy;
  }

  /** Atterrissage : dégâts de chute éventuels. */
  protected landed(): void {
    const fd = this.fallDistance;
    this.fallDistance = 0;
    if (fd > 3 && !this.fluid.water) {
      const under = BLOCKS[blockUnder(this.world, this.box)];
      let dmg = Math.ceil(fd - 3);
      if (under?.key === 'hay_block') dmg = Math.floor(dmg * 0.2);
      if (under?.key === 'cloud') dmg = 0;
      if (dmg > 0) this.onFall(dmg, under?.sound ?? 'stone');
    }
  }

  protected onFall(_damage: number, _sound: string): void {}

  updateEnvironment(): void {
    const b = this.box;
    this.fluid = fluidState(this.world, b, this.pos.y + this.eyeHeight);
    this.climbing = onClimbable(this.world, b);
    if (this.fluid.water) {
      this.fallDistance = 0;
      this.fireTicks = 0;
    }
  }

  /** Physique générique d'une créature (marche, nage, gravité) pour une entrée donnée. */
  travel(strafe: number, forward: number, speed: number, jump: boolean): void {
    this.updateEnvironment();
    const f = this.fluid;
    if (f.water && !this.noGravity) {
      this.accelerate(strafe, forward, 0.02 * (speed / 0.1));
      if (jump) this.vel.y += 0.04;
      this.move(this.vel.x, this.vel.y, this.vel.z);
      this.vel.x *= 0.8;
      this.vel.z *= 0.8;
      this.vel.y = this.vel.y * 0.8 - 0.02;
      if (this.hitHorizontal && jump) this.vel.y = 0.3;
      return;
    }
    if (f.lava && !this.noGravity) {
      this.accelerate(strafe, forward, 0.02);
      if (jump) this.vel.y += 0.04;
      this.move(this.vel.x, this.vel.y, this.vel.z);
      this.vel.multiplyScalar(0.5);
      this.vel.y -= 0.02;
      return;
    }
    const slip = this.onGround ? this.slipperiness() * 0.91 : 0.91;
    const accel = this.onGround ? speed * (0.16277136 / (slip * slip * slip)) : speed * 0.2;
    this.accelerate(strafe, forward, accel);
    if (this.climbing) {
      this.vel.x = THREE.MathUtils.clamp(this.vel.x, -0.15, 0.15);
      this.vel.z = THREE.MathUtils.clamp(this.vel.z, -0.15, 0.15);
      this.vel.y = Math.max(this.vel.y, -0.15);
      this.fallDistance = 0;
    }
    this.move(this.vel.x, this.vel.y, this.vel.z);
    if (this.climbing && this.hitHorizontal) this.vel.y = 0.2;
    if (!this.noGravity) this.vel.y = (this.vel.y - 0.08) * 0.98;
    else this.vel.y *= 0.6;
    this.vel.x *= slip;
    this.vel.z *= slip;
    if (this.pos.y < -64) this.onVoid();
  }

  protected onVoid(): void {
    this.remove();
  }

  slipperiness(): number {
    const id = blockUnder(this.world, this.box);
    const d = BLOCKS[id];
    if (!d) return 0.6;
    if (d.slow < 0) return d.slow === -2 ? 0.989 : 0.98;
    return 0.6;
  }

  protected accelerate(strafe: number, forward: number, accel: number): void {
    let len = strafe * strafe + forward * forward;
    if (len < 1e-4) return;
    len = Math.sqrt(len);
    if (len < 1) len = 1;
    const s = (strafe * accel) / len;
    const f = (forward * accel) / len;
    const sin = Math.sin(this.yaw);
    const cos = Math.cos(this.yaw);
    // avant = (-sin, -cos) ; droite = (cos, -sin)
    this.vel.x += -f * sin + s * cos;
    this.vel.z += -f * cos - s * sin;
  }

  remove(): void {
    this.removed = true;
  }

  /** Inflige des dégâts ; renvoie true si appliqués. */
  hurt(amount: number, src: DamageSource): boolean {
    if (this.dead || this.invulnerable > 0 || amount <= 0) return false;
    this.health -= amount;
    this.hurtTime = 10;
    this.invulnerable = 10;
    if (src.knockback) {
      this.vel.x += src.knockback.x;
      this.vel.z += src.knockback.z;
      this.vel.y = Math.max(this.vel.y, src.knockback.y);
    }
    if (this.health <= 0) {
      this.health = 0;
      this.die(src);
    }
    return true;
  }

  heal(n: number): void {
    if (this.dead) return;
    this.health = Math.min(this.maxHealth, this.health + n);
  }

  die(_src: DamageSource): void {
    this.dead = true;
  }

  /** Tic logique commun (20/s). */
  baseTick(): void {
    this.age++;
    if (this.hurtTime > 0) this.hurtTime--;
    if (this.invulnerable > 0) this.invulnerable--;
    this.prevPos.copy(this.pos);
    this.prevYaw = this.yaw;
  }

  distanceTo(o: Entity): number {
    return this.pos.distanceTo(o.pos);
  }
}
