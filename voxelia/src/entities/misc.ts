/**
 * Entités non vivantes : objets au sol, orbes d'expérience, projectiles,
 * blocs qui tombent, TNT amorcée et véhicules (bateau, wagonnet, tapis volant).
 */
import * as THREE from 'three';
import { Entity, type DamageSource } from '../entity/Entity';
import { BLOCKS, IS_LIQUID, WATERLOGGED } from '../world/blocks';
import { blockId, blockMeta } from '../world/constants';
import { sameItem, maxStack, type ItemStack } from '../items/items';
import type { EntityHost } from './host';

// ------------------------------------------------------------------ objet au sol
export class ItemEntity extends Entity {
  readonly type = 'item';
  pickupDelay = 10;
  life = 0;
  spin = Math.random() * Math.PI * 2;
  constructor(public stack: ItemStack) {
    super();
    this.width = 0.25;
    this.height = 0.25;
    this.stepHeight = 0;
    this.persistent = true;
  }

  tick(host: EntityHost): void {
    this.baseTick();
    this.life++;
    if (this.pickupDelay > 0) this.pickupDelay--;
    this.updateEnvironment();
    if (this.fluid.water) {
      this.vel.y += 0.02;
      this.vel.multiplyScalar(0.92);
    } else this.vel.y -= 0.04;
    this.move(this.vel.x, this.vel.y, this.vel.z);
    const f = this.onGround ? 0.6 * 0.98 : 0.98;
    this.vel.x *= f;
    this.vel.z *= f;
    this.vel.y *= 0.98;
    if (this.fluid.lava && !this.stack.data?.fireproof) {
      host.particles.flame(this.pos.x, this.pos.y + 0.2, this.pos.z);
      this.remove();
    }
    if (this.life > 6000 || this.pos.y < -40) this.remove();
    // Fusion avec les objets identiques proches
    if (this.age % 20 === 0) {
      for (const o of host.entitiesNear(this.pos, 1.2)) {
        if (o === this || !(o instanceof ItemEntity) || o.removed || !sameItem(o.stack, this.stack)) continue;
        if (o.stack.count + this.stack.count > maxStack(this.stack)) continue;
        this.stack.count += o.stack.count;
        o.remove();
      }
    }
  }
}

// ------------------------------------------------------------------ orbe d'expérience
export class XpOrb extends Entity {
  readonly type = 'xp_orb';
  life = 0;
  constructor(public amount: number) {
    super();
    this.width = 0.3;
    this.height = 0.3;
    this.stepHeight = 0;
  }

  tick(host: EntityHost): void {
    this.baseTick();
    this.life++;
    const p = host.player;
    const d = p.pos.distanceTo(this.pos);
    if (d < 7 && !p.dead) {
      const dir = new THREE.Vector3(p.pos.x - this.pos.x, p.pos.y + 0.8 - this.pos.y, p.pos.z - this.pos.z).normalize();
      const pull = (1 - d / 7) ** 2 * 0.12;
      this.vel.addScaledVector(dir, pull);
    }
    this.vel.y -= 0.03;
    this.move(this.vel.x, this.vel.y, this.vel.z);
    this.vel.multiplyScalar(this.onGround ? 0.6 : 0.95);
    if (d < 1.2 && this.life > 10 && !p.dead) {
      p.addXp(this.amount);
      host.audio('xp', this.pos);
      this.remove();
    }
    if (this.life > 6000) this.remove();
  }
}

// ------------------------------------------------------------------ projectiles
export type ProjectileKind = 'arrow' | 'fireball' | 'small_fireball' | 'snowball' | 'egg' | 'poison' | 'boulder' | 'beam' | 'lightning_orb';

export class Projectile extends Entity {
  readonly type = 'projectile';
  stuck = false;
  life = 0;
  damage = 2;
  constructor(
    public kind: ProjectileKind,
    public owner: Entity | null,
  ) {
    super();
    this.width = kind === 'boulder' ? 0.9 : kind.includes('fireball') ? 0.5 : 0.25;
    this.height = this.width;
    this.stepHeight = 0;
    this.noGravity = kind.includes('fireball') || kind === 'beam' || kind === 'lightning_orb';
  }

  tick(host: EntityHost): void {
    this.baseTick();
    this.life++;
    if (this.life > (this.stuck ? 1200 : 400)) {
      this.remove();
      return;
    }
    if (this.stuck) return;
    if (!this.noGravity) this.vel.y -= this.kind === 'arrow' ? 0.05 : 0.03;
    if (this.kind.includes('fireball') && this.age % 2 === 0) host.particles.flame(this.pos.x, this.pos.y + 0.25, this.pos.z);
    if (this.kind === 'lightning_orb') host.particles.magic(this.pos.x, this.pos.y + 0.2, this.pos.z, 0xc8e8ff, 2);
    // Collision avec les entités
    const next = this.pos.clone().add(this.vel);
    for (const e of host.entitiesNear(this.pos, 3)) {
      if (e === this || e === this.owner || e.removed || e.dead || !e.living) continue;
      if (this.owner && this.owner.type === e.type && e.type !== 'player') continue;
      const b = e.box;
      const mid = this.pos.clone().lerp(next, 0.5);
      if (mid.x > b.x0 - 0.2 && mid.x < b.x1 + 0.2 && mid.y > b.y0 - 0.2 && mid.y < b.y1 + 0.2 && mid.z > b.z0 - 0.2 && mid.z < b.z1 + 0.2) {
        this.hitEntity(host, e);
        return;
      }
    }
    const before = this.vel.clone();
    this.move(this.vel.x, this.vel.y, this.vel.z);
    if (this.hitHorizontal || this.onGround || (before.y > 0 && this.vel.y === 0)) this.hitBlock(host);
    if (!this.noGravity) this.vel.multiplyScalar(this.fluid.water ? 0.8 : 0.99);
    if (this.vel.lengthSq() > 1e-4) this.yaw = Math.atan2(-this.vel.x, -this.vel.z);
    this.pitch = Math.atan2(this.vel.y, Math.hypot(this.vel.x, this.vel.z));
  }

  private hitEntity(host: EntityHost, e: Entity): void {
    const kb = this.vel.clone().setY(0).normalize().multiplyScalar(0.4).setY(0.3);
    let dmg = this.damage;
    if (this.kind === 'arrow') dmg = Math.ceil(this.vel.length() * 2.2 * (this.damage / 2));
    if (this.kind === 'snowball') dmg = e.type === 'fire_spirit' || e.type === 'magma_cube' ? 3 : 0;
    if (this.kind === 'egg') dmg = 0;
    const src: DamageSource = { type: 'projectile', attacker: this.owner, knockback: kb };
    if (dmg > 0) e.hurt(dmg, src);
    if (this.kind.includes('fireball')) e.fireTicks = 100;
    if (this.kind === 'poison') (e as Entity & { addEffect?: (id: string, s: number, l?: number) => void }).addEffect?.('poison', 6);
    if (this.kind === 'fireball') host.explode(this.pos.x, this.pos.y, this.pos.z, 1.5, this.owner, false, true);
    if (this.kind === 'arrow') host.audio('arrow_hit', this.pos);
    this.remove();
  }

  private hitBlock(host: EntityHost): void {
    if (this.kind === 'arrow') {
      this.stuck = true;
      this.vel.set(0, 0, 0);
      host.audio('arrow_hit', this.pos);
      return;
    }
    if (this.kind === 'fireball') host.explode(this.pos.x, this.pos.y, this.pos.z, 1.5, this.owner, true, true);
    if (this.kind === 'small_fireball') {
      const x = Math.floor(this.pos.x);
      const y = Math.floor(this.pos.y);
      const z = Math.floor(this.pos.z);
      if (host.world.id(x, y, z) === 0 && host.rules.fireSpread) host.world.set(x, y, z, BLOCKS.find((b) => b?.key === 'fire')!.id, 0, 'tick');
    }
    if (this.kind === 'boulder') {
      host.explode(this.pos.x, this.pos.y, this.pos.z, 1.2, this.owner, false, false);
      host.particles.blockBreak(Math.floor(this.pos.x), Math.floor(this.pos.y), Math.floor(this.pos.z), 4);
    }
    if (this.kind === 'snowball' || this.kind === 'egg') host.particles.puff(this.pos.x, this.pos.y, this.pos.z, 0xffffff, 6, 1, 6, 0.06, 0.5);
    if (this.kind === 'egg' && Math.random() < 0.125) host.spawnMob('chicken', this.pos.x, this.pos.y, this.pos.z, { baby: true });
    this.remove();
  }
}

// ------------------------------------------------------------------ bloc qui tombe (sable, gravier)
export class FallingBlock extends Entity {
  readonly type = 'falling_block';
  constructor(public raw: number) {
    super();
    this.width = 0.98;
    this.height = 0.98;
    this.stepHeight = 0;
  }

  tick(host: EntityHost): void {
    this.baseTick();
    this.vel.y = Math.max(-2, this.vel.y - 0.04);
    this.move(0, this.vel.y, 0);
    if (this.onGround || this.age > 600) {
      const x = Math.floor(this.pos.x);
      const y = Math.round(this.pos.y);
      const z = Math.floor(this.pos.z);
      const cur = host.world.def(x, y, z);
      if (cur.replaceable || cur.id === 0) host.world.set(x, y, z, blockId(this.raw), blockMeta(this.raw), 'tick');
      else host.dropItem(x + 0.5, y + 0.5, z + 0.5, { id: blockId(this.raw), count: 1 });
      this.remove();
    }
  }
}

// ------------------------------------------------------------------ TNT
export class PrimedTnt extends Entity {
  readonly type = 'tnt';
  fuse = 80;
  constructor(public igniter: Entity | null = null) {
    super();
    this.width = 0.98;
    this.height = 0.98;
    this.stepHeight = 0;
  }

  tick(host: EntityHost): void {
    this.baseTick();
    this.vel.y -= 0.04;
    this.move(this.vel.x, this.vel.y, this.vel.z);
    this.vel.multiplyScalar(0.98);
    if (this.onGround) {
      this.vel.x *= 0.7;
      this.vel.z *= 0.7;
    }
    if (this.fuse % 5 === 0) host.particles.smoke(this.pos.x, this.pos.y + 1, this.pos.z);
    if (--this.fuse <= 0) {
      this.remove();
      if (this.fluid.water) host.explode(this.pos.x, this.pos.y + 0.5, this.pos.z, 4, this.igniter, false, false);
      else host.explode(this.pos.x, this.pos.y + 0.5, this.pos.z, 4, this.igniter, host.rules.tntExplodes, false);
    }
  }
}

// ------------------------------------------------------------------ véhicules
export abstract class Vehicle extends Entity {
  rider: Entity | null = null;
  /** Hauteur d'assise relative au véhicule. */
  seatY = 0.2;
  hits = 0;
  abstract readonly dropKey: string;
  steer(_forward: number, _strafe: number, _jump: boolean, _sneak: boolean, _yaw: number): void {}

  override hurt(amount: number, src: DamageSource): boolean {
    if (src.type !== 'attack' && src.type !== 'explosion') return false;
    this.hits += amount;
    this.hurtTime = 6;
    if (this.hits >= 4) this.dead = true;
    return true;
  }
}

export class Boat extends Vehicle {
  readonly type = 'boat';
  readonly dropKey = 'oak_boat';
  private input = { f: 0, s: 0 };
  constructor() {
    super();
    this.width = 1.375;
    this.height = 0.5625;
    this.stepHeight = 0;
    this.persistent = true;
    this.seatY = 0.15;
  }

  override steer(forward: number, strafe: number): void {
    this.input.f = forward;
    this.input.s = strafe;
  }

  tick(host: EntityHost): void {
    this.baseTick();
    this.updateEnvironment();
    // Flottaison
    const below = host.world.id(Math.floor(this.pos.x), Math.floor(this.pos.y + 0.1), Math.floor(this.pos.z));
    const inWater = WATERLOGGED[below] === 1 || this.fluid.water;
    if (inWater) {
      const surface = Math.floor(this.pos.y + 0.1) + 0.9;
      this.vel.y += (surface - this.pos.y) * 0.08;
      this.vel.y *= 0.7;
    } else this.vel.y -= 0.04;
    if (this.rider) {
      this.yaw -= this.input.s * 0.06;
      const sp = this.input.f * (inWater ? 0.04 : 0.006);
      this.vel.x += -Math.sin(this.yaw) * sp;
      this.vel.z += -Math.cos(this.yaw) * sp;
    }
    const drag = inWater ? 0.9 : this.onGround ? 0.5 : 0.95;
    this.vel.x *= drag;
    this.vel.z *= drag;
    // Glisse sur la glace
    const ground = BLOCKS[host.world.id(Math.floor(this.pos.x), Math.floor(this.pos.y - 0.1), Math.floor(this.pos.z))];
    if (ground && ground.slow < 0) {
      this.vel.x /= drag;
      this.vel.z /= drag;
      this.vel.x *= 0.98;
      this.vel.z *= 0.98;
    }
    this.move(this.vel.x, this.vel.y, this.vel.z);
  }
}

/** Formes de rails : 0 NS, 1 EO, 2..5 montants (E, O, N, S), 6..9 virages. */
export class Minecart extends Vehicle {
  readonly type = 'minecart';
  readonly dropKey = 'minecart';
  private push = 0;
  constructor() {
    super();
    this.width = 0.98;
    this.height = 0.7;
    this.stepHeight = 0;
    this.persistent = true;
    this.seatY = 0.35;
  }

  override steer(forward: number, _s: number, _j: boolean, _sn: boolean, yaw: number): void {
    // Le passager pousse dans la direction regardée
    this.push = forward;
    if (forward > 0) {
      this.vel.x += -Math.sin(yaw) * 0.008 * forward;
      this.vel.z += -Math.cos(yaw) * 0.008 * forward;
    }
  }

  tick(host: EntityHost): void {
    this.baseTick();
    const x = Math.floor(this.pos.x);
    let y = Math.floor(this.pos.y + 0.05);
    const z = Math.floor(this.pos.z);
    let raw = host.world.raw(x, y, z);
    let def = BLOCKS[blockId(raw)];
    if (def?.shape !== 'rail') {
      const r2 = host.world.raw(x, y - 1, z);
      if (BLOCKS[blockId(r2)]?.shape === 'rail') {
        y -= 1;
        raw = r2;
        def = BLOCKS[blockId(r2)];
      }
    }
    if (def?.shape === 'rail') {
      const meta = blockMeta(raw);
      const shape = meta & 15;
      const powered = def.key === 'powered_rail' && (meta & 16) !== 0;
      const dirs: Record<number, [number, number, number, number]> = {
        0: [0, -1, 0, 1],
        1: [-1, 0, 1, 0],
        2: [-1, 0, 1, 0],
        3: [-1, 0, 1, 0],
        4: [0, -1, 0, 1],
        5: [0, -1, 0, 1],
        6: [1, 0, 0, 1],
        7: [-1, 0, 0, 1],
        8: [-1, 0, 0, -1],
        9: [1, 0, 0, -1],
      };
      const [ax, az, bx, bz] = dirs[shape] ?? dirs[0];
      // Projection de la vitesse sur l'axe du rail
      const dx = bx - ax;
      const dz = bz - az;
      const len = Math.hypot(dx, dz);
      const ux = dx / len;
      const uz = dz / len;
      let sp = this.vel.x * ux + this.vel.z * uz;
      if (shape >= 2 && shape <= 5) {
        const upX = [1, -1, 0, 0][shape - 2];
        const upZ = [0, 0, -1, 1][shape - 2];
        sp -= (upX * ux + upZ * uz) * 0.0078125 * 8;
      }
      if (powered) sp += Math.sign(sp || 1) * 0.06;
      else if (def.key === 'powered_rail') sp *= 0.5;
      sp *= 0.997;
      sp = Math.max(-0.6, Math.min(0.6, sp));
      this.vel.set(ux * sp, 0, uz * sp);
      // Centrage sur le rail
      const cx = x + 0.5;
      const cz = z + 0.5;
      if (Math.abs(ux) > Math.abs(uz)) this.pos.z += (cz - this.pos.z) * 0.5;
      else this.pos.x += (cx - this.pos.x) * 0.5;
      const slopeY = shape >= 2 && shape <= 5 ? (shape === 2 ? this.pos.x - x : shape === 3 ? 1 - (this.pos.x - x) : shape === 4 ? 1 - (this.pos.z - z) : this.pos.z - z) : 0;
      this.pos.y = y + Math.max(0, Math.min(1, slopeY)) + 0.0625;
      this.pos.x += this.vel.x;
      this.pos.z += this.vel.z;
      if (Math.abs(sp) > 0.01) this.yaw = Math.atan2(-this.vel.x, -this.vel.z);
      this.onGround = true;
    } else {
      this.vel.y -= 0.04;
      this.move(this.vel.x, this.vel.y, this.vel.z);
      this.vel.x *= 0.5;
      this.vel.z *= 0.5;
    }
    void this.push;
    void IS_LIQUID;
  }
}

export class FlyingCarpet extends Vehicle {
  readonly type = 'flying_carpet';
  readonly dropKey = 'flying_carpet';
  private ctl = { f: 0, s: 0, up: false, down: false, yaw: 0 };
  constructor() {
    super();
    this.width = 1.3;
    this.height = 0.2;
    this.stepHeight = 0;
    this.persistent = true;
    this.noGravity = true;
    this.seatY = 0.1;
  }

  override steer(forward: number, strafe: number, jump: boolean, sneak: boolean, yaw: number): void {
    Object.assign(this.ctl, { f: forward, s: strafe, up: jump, down: sneak, yaw });
  }

  tick(host: EntityHost): void {
    this.baseTick();
    if (this.rider) {
      this.yaw = this.ctl.yaw;
      const sin = Math.sin(this.yaw);
      const cos = Math.cos(this.yaw);
      const sp = 0.06;
      this.vel.x += (-this.ctl.f * sin + this.ctl.s * cos) * sp;
      this.vel.z += (-this.ctl.f * cos - this.ctl.s * sin) * sp;
      this.vel.y += (this.ctl.up ? 0.05 : 0) - (this.ctl.down ? 0.05 : 0);
      if (this.age % 4 === 0) host.particles.magic(this.pos.x, this.pos.y, this.pos.z, 0xf6d23c, 1);
    } else this.vel.y -= 0.01;
    this.move(this.vel.x, this.vel.y, this.vel.z);
    this.vel.multiplyScalar(0.88);
  }
}

/** Éclair (effet + dégâts + feu). */
export class Lightning extends Entity {
  readonly type = 'lightning';
  life = 8;
  constructor() {
    super();
    this.width = 0.1;
    this.height = 0.1;
  }

  tick(host: EntityHost): void {
    this.baseTick();
    if (this.life === 8) {
      for (const e of host.entitiesNear(this.pos, 3)) if (e.living) e.hurt(5, { type: 'lightning' });
      const x = Math.floor(this.pos.x);
      const z = Math.floor(this.pos.z);
      const y = Math.floor(this.pos.y);
      if (host.world.id(x, y, z) === 0 && host.rules.fireSpread && host.difficulty !== 'peaceful') host.world.set(x, y, z, BLOCKS.find((b) => b?.key === 'fire')!.id, 0, 'tick');
    }
    if (--this.life <= 0) this.remove();
  }
}
