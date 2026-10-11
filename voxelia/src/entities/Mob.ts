/**
 * Mob — créature avec intelligence artificielle : errance, fuite, attirance par la nourriture,
 * reproduction, poursuite et attaque (corps à corps / distance), vol, nage, escalade,
 * explosion, combustion au soleil. Les PNJ et boss spécialisent cette classe.
 */
import * as THREE from 'three';
import { Entity, type DamageSource } from '../entity/Entity';
import { findPath, type PathNode } from '../entity/Pathfinder';
import { MOB_DEFS, type MobDef } from './mobDefs';
import { ITEMS, ITEM_BY_KEY } from '../items/items';
import { BLOCKS, WATERLOGGED, IS_LIQUID } from '../world/blocks';
import { raycast } from '../world/Raycast';
import type { EntityHost } from './host';
import type { Player } from '../player/Player';

const v1 = new THREE.Vector3();
const v2 = new THREE.Vector3();

export class Mob extends Entity {
  readonly type: string;
  readonly def: MobDef;
  target: Entity | null = null;
  protected path: PathNode[] | null = null;
  protected pathTimer = 0;
  protected wander: THREE.Vector3 | null = null;
  protected idle = 0;
  panic = 0;
  attackCooldown = 0;
  rangedCooldown = 0;
  baby = false;
  growth = 0;
  love = 0;
  breedCooldown = 0;
  fuse = -1;
  sheared = false;
  saddled = false;
  tamed = false;
  temper = 0;
  sizeScale = 1;
  /** Données libres (profession, échanges, état de boss…). */
  data: Record<string, unknown> = {};
  /** Paramètres d'animation lus par le rendu. */
  walkAnim = 0;
  walkSpeed = 0;
  swing = 0;
  headYaw = 0;
  forward = 0;
  strafe = 0;
  jumpWanted = false;
  provokedBy: Entity | null = null;
  homePos: THREE.Vector3 | null = null;
  eggTimer = 6000 + Math.random() * 6000;
  natural = false;
  lastHurtByPlayer = 0;
  isBoss = false;

  constructor(type: string) {
    super();
    const def = MOB_DEFS[type];
    if (!def) throw new Error('Créature inconnue : ' + type);
    this.type = type;
    this.def = def;
    this.width = def.width;
    this.height = def.height;
    this.eyeHeight = def.height * 0.85;
    this.maxHealth = this.health = def.health;
    this.living = true;
    this.noGravity = !!def.flies;
    this.stepHeight = def.flies ? 0 : 0.6;
    this.persistent = def.kind === 'npc' || def.kind === 'boss';
  }

  setBaby(b: boolean): void {
    this.baby = b;
    this.sizeScale = b ? 0.5 : 1;
    this.width = this.def.width * this.sizeScale;
    this.height = this.def.height * this.sizeScale;
    this.eyeHeight = this.height * 0.85;
    if (b) this.growth = 6000;
  }

  /** Taille des slimes (1, 2, 4). */
  setSlimeSize(n: number): void {
    this.sizeScale = n / 2;
    this.width = this.height = 0.52 * n;
    this.eyeHeight = this.height * 0.6;
    this.maxHealth = this.health = n * n;
    this.data.slimeSize = n;
  }

  get hostileNow(): boolean {
    const k = this.def.kind;
    if (k === 'hostile' || (k === 'flying' && this.def.damage)) {
      if (this.type === 'spider' && !this.provokedBy) return false;
      return true;
    }
    if (k === 'boss') return true;
    return !!this.provokedBy;
  }

  override hurt(amount: number, src: DamageSource): boolean {
    if (this.def.fireImmune && (src.type === 'fire' || src.type === 'lava')) return false;
    if (src.type === 'fall' && this.def.flies) return false;
    const ok = super.hurt(amount, src);
    if (!ok) return false;
    if (src.attacker && src.attacker !== this) {
      if (this.def.kind === 'passive' || this.def.kind === 'aquatic' || this.def.kind === 'npc') this.panic = 100;
      else {
        this.provokedBy = src.attacker;
        this.target = src.attacker;
      }
      if (src.attacker.type === 'player') this.lastHurtByPlayer = 100;
    }
    return true;
  }

  /** Tic principal (20/s). */
  tick(host: EntityHost): void {
    this.baseTick();
    if (this.dead) {
      this.deathTime++;
      return;
    }
    if (this.attackCooldown > 0) this.attackCooldown--;
    if (this.rangedCooldown > 0) this.rangedCooldown--;
    if (this.panic > 0) this.panic--;
    if (this.love > 0) this.love--;
    if (this.breedCooldown > 0) this.breedCooldown--;
    if (this.lastHurtByPlayer > 0) this.lastHurtByPlayer--;
    if (this.swing > 0) this.swing--;
    if (this.baby && --this.growth <= 0) this.setBaby(false);

    this.environment(host);
    this.forward = 0;
    this.strafe = 0;
    this.jumpWanted = false;
    this.ai(host);
    this.physics(host);
    this.walkSpeed = Math.min(1, Math.hypot(this.pos.x - this.prevPos.x, this.pos.z - this.prevPos.z) * 4);
    this.walkAnim += this.walkSpeed * 0.6;
  }

  protected environment(host: EntityHost): void {
    // Feu, lave, noyade, soleil
    this.updateEnvironment();
    if (this.fluid.lava && !this.def.fireImmune) {
      this.fireTicks = 300;
      if (this.age % 10 === 0) this.hurt(4, { type: 'lava' });
    }
    if (this.fireTicks > 0) {
      this.fireTicks--;
      if (this.fluid.water) this.fireTicks = 0;
      if (this.age % 20 === 0 && !this.def.fireImmune) this.hurt(1, { type: 'fire' });
      if (this.age % 4 === 0) host.particles.flame(this.pos.x + (Math.random() - 0.5) * this.width, this.pos.y + Math.random() * this.height, this.pos.z + (Math.random() - 0.5) * this.width);
    }
    if (this.def.burnsInSun && host.dimension === 0 && host.daylight > 0.7 && !host.isRaining() && this.age % 20 === 0) {
      const sky = host.world.skyLight(Math.floor(this.pos.x), Math.floor(this.pos.y + this.eyeHeight), Math.floor(this.pos.z));
      if (sky >= 15 && !this.fluid.water) {
        this.fireTicks = Math.max(this.fireTicks, 160);
        if (this.type === 'night_wraith') this.hurt(4, { type: 'fire' });
      }
    }
    if (this.def.swims && !this.fluid.water && this.age % 20 === 0) this.hurt(1, { type: 'drown' });
    if (!this.def.swims && this.fluid.eyesInWater && !this.def.flies && this.type !== 'turtle' && this.type !== 'frog') {
      if (this.age % 40 === 0 && this.age > 300) this.hurt(1, { type: 'drown' });
    }
  }

  /** Physique : marche/nage/vol selon les intentions fixées par l'IA. */
  protected physics(_host: EntityHost): void {
    const speed = this.def.speed * (this.panic > 0 ? 1.6 : 1) * (this.baby ? 1.2 : 1);
    if (this.def.flies) {
      this.move(this.vel.x, this.vel.y, this.vel.z);
      this.vel.multiplyScalar(0.91);
      return;
    }
    if (this.def.swims && this.fluid.water) {
      this.move(this.vel.x, this.vel.y, this.vel.z);
      this.vel.multiplyScalar(0.9);
      return;
    }
    if (this.jumpWanted && this.onGround) this.vel.y = 0.42 * Math.max(0.8, this.sizeScale > 1 ? 1.1 : 1);
    if (this.def.climbs && this.hitHorizontal && this.forward > 0) {
      this.vel.y = 0.2;
      this.fallDistance = 0;
    }
    const wantSwimUp = this.fluid.water && !this.def.swims;
    this.travel(this.strafe, this.forward, speed * 0.55, wantSwimUp || this.jumpWanted);
  }

  // ------------------------------------------------------------------ IA
  protected ai(host: EntityHost): void {
    const k = this.def.kind;
    if (this.def.swims) return this.aiSwim(host);
    if (this.def.flies) return this.aiFly(host);
    if (this.panic > 0) return this.aiPanic(host);
    if (this.type === 'slime' || this.type === 'crystal_slime' || this.type === 'magma_cube') return this.aiSlime(host);
    if (k === 'hostile' || k === 'neutral' || k === 'boss') {
      if (this.findTarget(host)) {
        this.aiCombat(host);
        return;
      }
    }
    if (k === 'passive') {
      if (this.aiTempt(host)) return;
      if (this.aiBreed(host)) return;
      this.aiPassiveExtras(host);
    }
    this.aiWander(host);
  }

  protected findTarget(host: EntityHost): boolean {
    const p = host.player;
    const range = this.def.follow ?? 16;
    if (this.target && (this.target.removed || this.target.dead || this.target.pos.distanceTo(this.pos) > range * 1.5)) {
      this.target = null;
      this.provokedBy = null;
    }
    if (this.target && this.target.type === 'player' && ((this.target as Player).creative || host.difficulty === 'peaceful')) this.target = null;
    if (this.target) return true;
    if (this.type === 'village_guard') {
      // Protège le village : attaque les monstres proches
      for (const e of host.entitiesNear(this.pos, 16)) {
        if (e instanceof Mob && (e.def.kind === 'hostile' || (e.def.kind === 'flying' && e.def.damage)) && !e.dead) {
          this.target = e;
          return true;
        }
      }
      return false;
    }
    if (!this.hostileNow) return false;
    if (p.dead || p.creative || host.difficulty === 'peaceful') return false;
    const d = p.pos.distanceTo(this.pos);
    if (d > range) return false;
    if (this.type === 'spider' && host.daylight > 0.7 && host.dimension === 0 && !this.provokedBy) return false;
    if (d > 4 && this.age % 10 !== 0) return false;
    if (d > 4 && !this.canSee(host, p)) return false;
    this.target = p;
    return true;
  }

  canSee(host: EntityHost, e: Entity): boolean {
    const from = this.eyePos(v1);
    const to = e.eyePos(v2);
    const dir = to.clone().sub(from);
    const len = dir.length();
    if (len < 0.01) return true;
    dir.divideScalar(len);
    const hit = raycast(host.world, from, dir, len);
    return !hit || !BLOCKS[hit.id]?.opaque;
  }

  /** Oriente progressivement la créature vers un point. */
  protected faceTowards(x: number, z: number, maxTurn = 0.35): void {
    const target = Math.atan2(-(x - this.pos.x), -(z - this.pos.z));
    let d = target - this.yaw;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    this.yaw += Math.max(-maxTurn, Math.min(maxTurn, d));
  }

  /** Se dirige vers un point (avec chemin si nécessaire). */
  protected goTo(host: EntityHost, tx: number, ty: number, tz: number, run = 1): boolean {
    const dx = tx - this.pos.x;
    const dz = tz - this.pos.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.6 && Math.abs(ty - this.pos.y) < 1.5) return true;
    if (--this.pathTimer <= 0 || !this.path) {
      this.pathTimer = 20 + Math.floor(Math.random() * 20);
      this.path = dist > 2.5 ? findPath(host.world, this.pos.x, this.pos.y, this.pos.z, tx, ty, tz, Math.ceil(this.height), 260) : null;
    }
    let nx = tx;
    let nz = tz;
    if (this.path && this.path.length) {
      const n = this.path[0];
      if (Math.hypot(n.x + 0.5 - this.pos.x, n.z + 0.5 - this.pos.z) < 0.55) this.path.shift();
      if (this.path.length) {
        nx = this.path[0].x + 0.5;
        nz = this.path[0].z + 0.5;
        if (this.path[0].y > Math.floor(this.pos.y + 0.1)) this.jumpWanted = true;
      }
    }
    this.faceTowards(nx, nz);
    this.forward = run;
    if (this.hitHorizontal && this.onGround) this.jumpWanted = true;
    // évite les falaises et la lave en errance
    return false;
  }

  protected aiWander(host: EntityHost): void {
    if (this.idle > 0) {
      this.idle--;
      // Regarde le joueur proche
      const p = host.player;
      if (p.pos.distanceTo(this.pos) < 8) this.headYaw = Math.atan2(-(p.pos.x - this.pos.x), -(p.pos.z - this.pos.z)) - this.yaw;
      return;
    }
    if (!this.wander) {
      if (Math.random() < 0.02) {
        const a = Math.random() * Math.PI * 2;
        const r = 3 + Math.random() * 8;
        const home = this.homePos;
        const cx = home && home.distanceTo(this.pos) > 24 ? home.x : this.pos.x;
        const cz = home && home.distanceTo(this.pos) > 24 ? home.z : this.pos.z;
        const x = cx + Math.cos(a) * r;
        const z = cz + Math.sin(a) * r;
        const ground = host.world.groundBelow(Math.floor(x), Math.floor(this.pos.y + 4), Math.floor(z));
        if (ground < 0 || Math.abs(ground + 1 - this.pos.y) > 4) return;
        const below = host.world.id(Math.floor(x), ground, Math.floor(z));
        if (IS_LIQUID[below] && !WATERLOGGED[below]) return;
        if (WATERLOGGED[below] && this.def.kind !== 'aquatic' && this.type !== 'turtle') return;
        this.wander = new THREE.Vector3(x, ground + 1, z);
      }
      return;
    }
    const done = this.goTo(host, this.wander.x, this.wander.y, this.wander.z, 0.6);
    if (done || this.age % 200 === 0) {
      this.wander = null;
      this.path = null;
      this.idle = 40 + Math.floor(Math.random() * 120);
    }
  }

  protected aiPanic(host: EntityHost): void {
    if (!this.wander || this.age % 30 === 0) {
      const a = Math.random() * Math.PI * 2;
      this.wander = new THREE.Vector3(this.pos.x + Math.cos(a) * 8, this.pos.y, this.pos.z + Math.sin(a) * 8);
      this.path = null;
    }
    this.faceTowards(this.wander.x, this.wander.z, 0.5);
    this.forward = 1;
    if (this.hitHorizontal) this.jumpWanted = true;
    void host;
  }

  protected aiTempt(host: EntityHost): boolean {
    const p = host.player;
    if (!this.def.tempt || p.dead) return false;
    const held = p.heldItem();
    if (!held || !this.def.tempt.includes(ITEMS[held.id]?.key ?? '')) return false;
    const d = p.pos.distanceTo(this.pos);
    if (d > 10) return false;
    if (d > 2) this.goTo(host, p.pos.x, p.pos.y, p.pos.z, 0.9);
    else this.faceTowards(p.pos.x, p.pos.z);
    return true;
  }

  protected aiBreed(host: EntityHost): boolean {
    if (this.love <= 0 || this.baby) return false;
    for (const e of host.entitiesNear(this.pos, 8)) {
      if (e === this || !(e instanceof Mob) || e.type !== this.type || e.love <= 0 || e.baby) continue;
      this.goTo(host, e.pos.x, e.pos.y, e.pos.z, 0.8);
      if (e.pos.distanceTo(this.pos) < 1.5) {
        this.love = 0;
        e.love = 0;
        this.breedCooldown = e.breedCooldown = 6000;
        const baby = host.spawnMob(this.type, this.pos.x, this.pos.y, this.pos.z, { baby: true, persistent: true });
        if (baby) host.particles.magic(this.pos.x, this.pos.y + 1, this.pos.z, 0xff6aa0, 10);
        host.dropXp(this.pos.x, this.pos.y + 0.5, this.pos.z, 1 + Math.floor(Math.random() * 7));
      }
      return true;
    }
    return false;
  }

  protected aiPassiveExtras(host: EntityHost): void {
    // Les poules pondent ; les moutons tondus mangent l'herbe pour repousser leur laine.
    if (this.type === 'chicken' && !this.baby && --this.eggTimer <= 0) {
      this.eggTimer = 6000 + Math.random() * 6000;
      host.dropItem(this.pos.x, this.pos.y + 0.3, this.pos.z, { id: ITEM_BY_KEY.get('egg')!.id, count: 1 });
      host.audio('pop', this.pos, 0.5);
    }
    if ((this.type === 'sheep' || this.type === 'sky_sheep') && this.sheared && Math.random() < 0.002) {
      const x = Math.floor(this.pos.x);
      const y = Math.floor(this.pos.y - 0.5);
      const z = Math.floor(this.pos.z);
      if (host.world.id(x, y, z) === BLOCKS.find((b) => b?.key === 'grass_block')!.id) {
        host.world.set(x, y, z, BLOCKS.find((b) => b?.key === 'dirt')!.id, 0, 'tick');
        this.sheared = false;
      }
    }
  }

  protected aiCombat(host: EntityHost): void {
    const t = this.target!;
    const d = t.pos.distanceTo(this.pos);
    this.headYaw = 0;
    // Champignon explosif : amorçage à proximité
    if (this.def.explode) {
      if (d < 3 && this.canSee(host, t)) {
        if (this.fuse < 0) {
          this.fuse = 0;
          host.audio('fuse', this.pos);
        }
      } else if (d > 7) this.fuse = -1;
      if (this.fuse >= 0) {
        this.fuse++;
        if (this.fuse >= this.def.explode.fuse) {
          this.remove();
          host.explode(this.pos.x, this.pos.y + 0.5, this.pos.z, this.def.explode.power, this, host.rules.mobGriefing, false);
        }
        this.faceTowards(t.pos.x, t.pos.z);
        return;
      }
    }
    // Attaque à distance
    const r = this.def.ranged;
    if (r && d < r.range && this.canSee(host, t)) {
      this.faceTowards(t.pos.x, t.pos.z, 0.6);
      if (d < 5) this.forward = -0.6;
      else if (d > r.range * 0.7) this.goTo(host, t.pos.x, t.pos.y, t.pos.z, 0.8);
      if (this.rangedCooldown <= 0) {
        this.rangedCooldown = r.cooldown + Math.floor(Math.random() * 20);
        this.shoot(host, t, r.projectile);
      }
      return;
    }
    // Corps à corps
    const reach = this.width / 2 + t.width / 2 + 0.9;
    const dy = Math.abs(t.pos.y - this.pos.y);
    if (d < reach + 0.4 && dy < 1.8) {
      this.faceTowards(t.pos.x, t.pos.z, 0.8);
      if (this.attackCooldown <= 0) this.meleeAttack(host, t);
      if (d > reach * 0.6) this.forward = 0.5;
    } else this.goTo(host, t.pos.x, t.pos.y, t.pos.z, 1);
  }

  meleeAttack(host: EntityHost, t: Entity): void {
    this.attackCooldown = 20;
    this.swing = 8;
    const kb = new THREE.Vector3(t.pos.x - this.pos.x, 0, t.pos.z - this.pos.z).normalize().multiplyScalar(0.4).setY(0.35);
    const dmg = this.def.damage ?? 2;
    if (t.hurt(dmg, { type: 'attack', attacker: this, knockback: kb })) {
      if (this.type === 'ember_salamander' || this.type === 'magma_cube') t.fireTicks = Math.max(t.fireTicks, 80);
      if (this.type === 'cave_crawler' && Math.random() < 0.3) (t as Player).addEffect?.('slowness', 4);
    }
  }

  shoot(host: EntityHost, t: Entity, kind: string): void {
    const from = this.eyePos(new THREE.Vector3());
    const to = t.eyePos(new THREE.Vector3()).add(new THREE.Vector3(0, -0.3, 0));
    const dir = to.clone().sub(from);
    const dist = dir.length();
    const speed = kind === 'arrow' ? 1.6 : kind === 'fireball' ? 0.9 : 1.0;
    dir.normalize();
    if (kind === 'arrow' || kind === 'poison' || kind === 'snowball') dir.y += dist * 0.012;
    const inaccuracy = host.difficulty === 'hard' ? 0.02 : 0.06;
    dir.x += (Math.random() - 0.5) * inaccuracy;
    dir.z += (Math.random() - 0.5) * inaccuracy;
    dir.normalize().multiplyScalar(speed);
    const p = host.spawnProjectile(kind, this, from.addScaledVector(dir, 0.6), dir);
    if (p && this.isBoss) (p as unknown as { damage: number }).damage = 6;
    host.audio(kind === 'arrow' ? 'bow' : 'shoot', this.pos);
    this.swing = 8;
  }

  protected aiSlime(host: EntityHost): void {
    const found = this.findTarget(host);
    if (this.onGround && this.age % (found ? 20 : 50) === 0) {
      let a = Math.random() * Math.PI * 2;
      if (found) a = Math.atan2(this.target!.pos.z - this.pos.z, this.target!.pos.x - this.pos.x);
      const sp = 0.15 + this.sizeScale * 0.05;
      this.vel.x = Math.cos(a) * sp;
      this.vel.z = Math.sin(a) * sp;
      this.vel.y = 0.42;
      this.yaw = Math.atan2(-Math.cos(a), -Math.sin(a));
      host.audio(this.type, this.pos, 0.3);
    }
    if (found) {
      const t = this.target!;
      const reach = this.width / 2 + t.width / 2 + 0.3;
      if (t.pos.distanceTo(this.pos) < reach + 0.3 && this.attackCooldown <= 0 && (this.data.slimeSize as number) > 1) this.meleeAttack(host, t);
    }
  }

  protected aiSwim(host: EntityHost): void {
    if (!this.fluid.water) {
      // Sur la terre : sautille
      if (this.onGround && Math.random() < 0.1) this.vel.set((Math.random() - 0.5) * 0.2, 0.3, (Math.random() - 0.5) * 0.2);
      this.vel.y -= 0.08;
      return;
    }
    const p = host.player;
    if (this.type === 'dolphin' && p.fluid.water && p.pos.distanceTo(this.pos) < 12) {
      const dir = p.pos.clone().sub(this.pos).normalize();
      this.vel.addScaledVector(dir, 0.012);
    } else if (!this.wander || this.age % 80 === 0 || Math.random() < 0.01) {
      const a = Math.random() * Math.PI * 2;
      this.wander = new THREE.Vector3(Math.cos(a), (Math.random() - 0.5) * 0.6, Math.sin(a));
    }
    if (this.panic > 0 || (this.type !== 'dolphin' && p.pos.distanceTo(this.pos) < 4 && !p.sneaking)) {
      const away = this.pos.clone().sub(p.pos).normalize();
      this.vel.addScaledVector(away, 0.02);
    } else if (this.wander) this.vel.addScaledVector(this.wander, this.def.speed * 0.15);
    // Reste sous la surface
    const above = host.world.id(Math.floor(this.pos.x), Math.floor(this.pos.y + this.height + 0.3), Math.floor(this.pos.z));
    if (!WATERLOGGED[above]) this.vel.y -= 0.01;
    if (this.vel.lengthSq() > 1e-4) this.yaw = Math.atan2(-this.vel.x, -this.vel.z);
  }

  protected aiFly(host: EntityHost): void {
    const found = this.def.damage ? this.findTarget(host) : false;
    let tx: number;
    let ty: number;
    let tz: number;
    if (found) {
      const t = this.target!;
      const d = t.pos.distanceTo(this.pos);
      const r = this.def.ranged;
      if (r && d < r.range && this.canSee(host, t)) {
        // Garde ses distances et tire
        tx = t.pos.x + Math.cos(this.age * 0.02) * 8;
        tz = t.pos.z + Math.sin(this.age * 0.02) * 8;
        ty = t.pos.y + 4;
        if (this.rangedCooldown <= 0) {
          this.rangedCooldown = r.cooldown;
          this.shoot(host, t, r.projectile);
        }
      } else {
        tx = t.pos.x;
        ty = t.pos.y + 1;
        tz = t.pos.z;
        const reach = this.width / 2 + t.width / 2 + 0.8;
        if (d < reach + 0.5 && this.attackCooldown <= 0) this.meleeAttack(host, t);
      }
    } else {
      if (!this.wander || this.age % 120 === 0 || this.wander.distanceTo(this.pos) < 1.5) {
        const a = Math.random() * Math.PI * 2;
        const ground = host.world.height(Math.floor(this.pos.x), Math.floor(this.pos.z));
        this.wander = new THREE.Vector3(this.pos.x + Math.cos(a) * 10, Math.max(ground + 4, this.pos.y + (Math.random() - 0.5) * 6), this.pos.z + Math.sin(a) * 10);
      }
      tx = this.wander.x;
      ty = this.wander.y;
      tz = this.wander.z;
    }
    const dir = new THREE.Vector3(tx - this.pos.x, ty - this.pos.y, tz - this.pos.z);
    const len = dir.length();
    if (len > 0.1) {
      dir.divideScalar(len);
      this.vel.addScaledVector(dir, this.def.speed * 0.12);
      this.faceTowards(tx, tz, 0.2);
    }
  }

  /** Interaction du joueur (clic droit) : nourrir, tondre, traire, monter… Renvoie true si consommée. */
  interact(host: EntityHost, player: Player): boolean {
    const held = player.heldItem();
    const key = held ? ITEMS[held.id]?.key : undefined;
    if (key && this.def.tempt?.includes(key) && !this.baby && this.breedCooldown <= 0 && this.def.kind === 'passive') {
      if (!player.creative) player.inventory.consumeHeld();
      this.love = 600;
      host.particles.magic(this.pos.x, this.pos.y + this.height, this.pos.z, 0xff6aa0, 8);
      host.audio('eat', this.pos);
      return true;
    }
    if (key && this.def.tempt?.includes(key) && this.baby) {
      if (!player.creative) player.inventory.consumeHeld();
      this.growth = Math.max(0, this.growth - 1200);
      host.particles.magic(this.pos.x, this.pos.y + this.height, this.pos.z, 0x80ff80, 6);
      return true;
    }
    if (key === 'shears' && (this.type === 'sheep' || this.type === 'sky_sheep') && !this.sheared && !this.baby) {
      this.sheared = true;
      const wool = this.type === 'sky_sheep' ? 'light_blue_wool' : 'white_wool';
      host.dropItem(this.pos.x, this.pos.y + 1, this.pos.z, { id: ITEM_BY_KEY.get(wool)!.id, count: 1 + Math.floor(Math.random() * 3) });
      host.audio('shear', this.pos);
      return true;
    }
    if (key === 'bucket' && (this.type === 'cow' || this.type === 'mooshroom') && !this.baby) {
      player.inventory.consumeHeld();
      player.inventory.give({ id: ITEM_BY_KEY.get('milk_bucket')!.id, count: 1 });
      host.audio('bucket_fill', this.pos);
      return true;
    }
    if (this.def.rideable && !this.baby) {
      if (key === 'saddle' && this.tamed && !this.saddled) {
        this.saddled = true;
        player.inventory.consumeHeld();
        host.audio('chest_close', this.pos);
        return true;
      }
      if (!player.sneaking) {
        host.mount(player, this);
        return true;
      }
    }
    return false;
  }

  /** Déplacement quand un joueur est en selle (cheval apprivoisé et sellé). */
  ride(forward: number, strafe: number, jump: boolean, yaw: number, host: EntityHost): void {
    if (!this.tamed) {
      // Cheval sauvage : tente de désarçonner le cavalier
      this.temper += 1;
      if (this.age % 40 === 0) {
        if (Math.random() * 100 < this.temper * 0.5) {
          this.tamed = true;
          host.particles.magic(this.pos.x, this.pos.y + 1.6, this.pos.z, 0xff6aa0, 12);
          host.message('Le cheval est apprivoisé ! Équipez-le d’une selle pour le diriger.');
        } else {
          host.dismount(this.passenger!);
          this.vel.y = 0.4;
          host.audio('horse', this.pos);
        }
      }
      return;
    }
    if (!this.saddled) return;
    this.yaw = yaw;
    this.forward = forward;
    this.strafe = strafe * 0.5;
    const sp = 0.32;
    if (jump && this.onGround) this.vel.y = 0.75;
    this.travel(this.strafe, this.forward, sp, false);
  }

  /** Objets lâchés à la mort. */
  rollDrops(): Array<{ key: string; count: number }> {
    const out: Array<{ key: string; count: number }> = [];
    if (this.baby) return out;
    for (const [key, a, b, chance] of this.def.drops ?? []) {
      if (chance !== undefined && Math.random() > chance) continue;
      let n = a + Math.floor(Math.random() * (b - a + 1));
      if (this.fireTicks > 0) {
        const cooked: Record<string, string> = { raw_beef: 'steak', raw_porkchop: 'cooked_porkchop', raw_chicken: 'cooked_chicken', raw_mutton: 'cooked_mutton', raw_venison: 'cooked_venison' };
        if (cooked[key]) {
          out.push({ key: cooked[key], count: n });
          continue;
        }
      }
      if ((this.type === 'sheep' || this.type === 'sky_sheep') && key.endsWith('_wool') && this.sheared) n = 0;
      if (n > 0) out.push({ key, count: n });
    }
    if (this.saddled) out.push({ key: 'saddle', count: 1 });
    return out;
  }

  serializeData(): Record<string, unknown> {
    return { ...this.data, baby: this.baby || undefined, growth: this.growth || undefined, sheared: this.sheared || undefined, saddled: this.saddled || undefined, tamed: this.tamed || undefined, home: this.homePos ? [this.homePos.x, this.homePos.y, this.homePos.z] : undefined };
  }

  loadData(d: Record<string, unknown>): void {
    this.data = { ...d };
    if (d.baby) this.setBaby(true);
    if (typeof d.growth === 'number') this.growth = d.growth;
    this.sheared = !!d.sheared;
    this.saddled = !!d.saddled;
    this.tamed = !!d.tamed;
    if (Array.isArray(d.home)) this.homePos = new THREE.Vector3(d.home[0], d.home[1], d.home[2]);
    if (typeof d.slimeSize === 'number') this.setSlimeSize(d.slimeSize);
  }
}

export function isMobType(t: string): boolean {
  return t in MOB_DEFS;
}
