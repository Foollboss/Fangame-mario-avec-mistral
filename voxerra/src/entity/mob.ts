/**
 * Créature : statistiques data-driven, cerveau à objectifs prioritaires,
 * déplacement (sol, vol, nage, escalade, flottement), navigation par chemin,
 * phases de boss, brûlure au soleil, butin.
 */
import { LivingEntity, type DamageSource } from './living';
import type { CreatureDef } from '../registry/types';
import type { Sim } from '../sim/sim';
import type { World } from '../world/world';
import { moveBody, probeEnvironment } from '../physics/collision';
import { findPath, type PathNode } from './ai/pathfind';
import { createGoal, type Goal } from './ai/goals';
import { angleDiff } from '../engine/math';
import { rollEntries } from '../sim/loot';
import { DIMENSION_INFO, type DimensionId } from '../worldgen/generator';

export class Mob extends LivingEntity {
  readonly kind = 'mob';
  readonly type: string;
  def: CreatureDef;
  goals: Goal[] = [];
  targeters: Goal[] = [];
  current: Goal | null = null;
  target: LivingEntity | null = null;
  targetMemory = 0;
  lastSeen: { x: number; y: number; z: number } | null = null;
  home: { x: number; y: number; z: number } | null = null;
  bodyYaw = 0;
  heldItem: string | null = null;
  persistent: boolean;
  hostile: boolean;
  phase = 0;
  data: Record<string, unknown> = {};
  group = 0;
  /** Navigation */
  private dest: { x: number; y: number; z: number; speed: number; direct: boolean } | null = null;
  private path: PathNode[] | null = null;
  private pathIdx = 0;
  private repath = 0;
  private stuck = 0;
  private lastPos = { x: 0, z: 0 };
  lookTarget: { x: number; y: number; z: number } | null = null;
  attackTimer = 0;
  speedMul = 1;
  idleSound = 5 + Math.random() * 10;
  noDespawn = 0;
  /** Invulnérabilité (bouclier du boss). */
  shielded = false;
  get movement(): string {
    return this.def.movement ?? 'ground';
  }

  constructor(def: CreatureDef) {
    super(def.size[0] / 2, def.size[1], def.size[1] * 0.85);
    this.type = def.id;
    this.def = def;
    this.displayName = def.name;
    this.maxHealth = this.health = def.health;
    this.baseArmor = def.armor ?? 0;
    this.knockbackResist = def.knockbackResist ?? 0;
    this.fireImmune = !!def.fireImmune;
    this.persistent = !!def.persistent;
    this.hostile = def.category === 'hostile' || def.category === 'boss';
    this.heldItem = def.heldItem ?? null;
    for (const i of def.immune ?? []) this.immune.add(i);
    this.buildBrain(def.ai);
  }

  buildBrain(list: { type: string; [k: string]: unknown }[]): void {
    this.goals = [];
    this.targeters = [];
    this.current?.stop?.(this);
    this.current = null;
    for (const g of list) {
      const goal = createGoal(g);
      if (!goal) continue;
      if (goal.targeting) this.targeters.push(goal);
      else this.goals.push(goal);
    }
  }

  get speed(): number {
    return this.def.speed * this.speedMul * this.speedMultiplier();
  }

  // ------------------------------------------------------------ navigation
  navigateTo(x: number, y: number, z: number, speed = 1): void {
    const d = this.dest;
    if (d && !d.direct && Math.abs(d.x - x) < 1.5 && Math.abs(d.y - y) < 1.5 && Math.abs(d.z - z) < 1.5) {
      d.speed = speed;
      return;
    }
    this.dest = { x, y, z, speed, direct: false };
    this.path = null;
    this.repath = 0;
  }

  moveDirect(x: number, y: number, z: number, speed = 1): void {
    this.dest = { x, y, z, speed, direct: true };
    this.path = null;
  }

  /** Dans l'eau (ou flottant à sa surface). */
  swimming(w: World): boolean {
    const t = w.content.blocks;
    return this.body.inWater || t.liquid[w.getId(Math.floor(this.x), Math.floor(this.y - 0.3), Math.floor(this.z))] === 1;
  }

  /** L'obstacle devant (direction dx, dz) fait-il un seul bloc de haut ? */
  private canStepOver(w: World, dx: number, dz: number): boolean {
    const t = w.content.blocks;
    const l = Math.hypot(dx, dz) || 1;
    const ax = Math.floor(this.x + (dx / l) * (this.body.hw + 0.45)),
      az = Math.floor(this.z + (dz / l) * (this.body.hw + 0.45));
    const y = Math.floor(this.y + 0.05);
    // rien à enjamber dans cette direction (bloqué par un reste d'élan contre un mur de côté) : pas de saut
    if (!t.solid[w.getId(ax, y, az)]) return false;
    const h = Math.max(1, Math.ceil(this.body.h));
    for (let k = 1; k <= h; k++) if (t.solid[w.getId(ax, y + k, az)]) return false;
    return true;
  }

  /** Longe un mur : nouvelle destination sur le côté (au hasard à gauche ou à droite). */
  private slideAlongWall(dx: number, dz: number, speed: number): void {
    const l = Math.hypot(dx, dz) || 1;
    const side = Math.random() < 0.5 ? 1 : -1;
    const px = (-dz / l) * side,
      pz = (dx / l) * side;
    this.moveDirect(this.x + px * 5 - (dx / l) * 1.5, this.y, this.z + pz * 5 - (dz / l) * 1.5, speed);
  }

  stopMoving(): void {
    this.dest = null;
    this.path = null;
  }

  get moving(): boolean {
    return this.dest !== null;
  }

  lookAt(x: number, y: number, z: number): void {
    this.lookTarget = { x, y, z };
  }

  canSee(sim: Sim, e: { x: number; y: number; z: number; eye?: number }): boolean {
    const w = sim.world(this.dim);
    const ox = this.x,
      oy = this.y + this.eye,
      oz = this.z;
    const tx = e.x,
      ty = e.y + (e.eye ?? 1.5),
      tz = e.z;
    const d = Math.hypot(tx - ox, ty - oy, tz - oz);
    const steps = Math.ceil(d * 2);
    const t = w.content.blocks;
    for (let i = 1; i < steps; i++) {
      const f = i / steps;
      const id = w.getId(Math.floor(ox + (tx - ox) * f), Math.floor(oy + (ty - oy) * f), Math.floor(oz + (tz - oz) * f));
      if (t.opaque[id]) return false;
    }
    return true;
  }

  // ------------------------------------------------------------ cycle
  tick(sim: Sim, dt: number): void {
    this.age += dt;
    this.tickLiving(dt);
    const w = sim.world(this.dim);
    const b = this.body;
    if (this.dead) {
      b.vx *= 0.8;
      b.vz *= 0.8;
      if (this.movement !== 'fly' && this.movement !== 'hover') {
        b.vy -= 25 * dt;
        moveBody(w, b, b.vx * dt, b.vy * dt, b.vz * dt);
      }
      if (this.deathTime > 1) this.removed = true;
      return;
    }
    probeEnvironment(w, b, this.eye);
    // Phases de boss
    if (this.def.phases) {
      let ph = 0;
      this.def.phases.forEach((p, i) => {
        if (this.health <= this.maxHealth * p.below) ph = i + 1;
      });
      if (ph !== this.phase) {
        this.phase = ph;
        const p = this.def.phases[ph - 1];
        if (p) {
          this.buildBrain(p.ai);
          if (p.speed) this.speedMul = p.speed / this.def.speed;
          if (p.message) sim.emit({ t: 'msg', text: p.message, color: '#ff9a5a' });
          sim.emit({ t: 'sound', id: 'boss_apparait', x: this.x, y: this.y, z: this.z, vol: 1 });
          sim.emit({ t: 'shake', amount: 0.6 });
        }
      }
    }
    // Ciblage (toutes les 0,25 s)
    if (Math.floor(this.age * 4) !== Math.floor((this.age - dt) * 4)) for (const g of this.targeters) g.tick(this, sim, dt);
    if (this.target && (this.target.dead || this.target.removed || this.target.dim !== this.dim || (this.target as { creative?: boolean }).creative)) this.target = null;
    // Sélection de l'objectif d'action
    const cur = this.current;
    let next: Goal | null = cur && (cur.canContinue ? cur.canContinue(this, sim) : cur.canStart(this, sim)) ? cur : null;
    for (const g of this.goals) {
      if (g === next) break;
      if (g.canStart(this, sim)) {
        next = g;
        break;
      }
    }
    if (next !== cur) {
      cur?.stop?.(this);
      next?.start?.(this, sim);
      this.current = next;
    }
    this.current?.tick(this, sim, dt);
    for (const g of this.goals) if (g.always && g !== this.current) g.tick(this, sim, dt);
    this.attackTimer = Math.max(0, this.attackTimer - dt);
    // Soleil
    if (this.def.burnsInDaylight && this.dim === 'surface' && !sim.env.isNight && !b.inWater) {
      const sky = w.skyLight(Math.floor(this.x), Math.floor(this.y + this.eye), Math.floor(this.z));
      if (sky >= 15 && sim.env.weather === 'clair' && !this.hasEffect('brulure')) this.addEffect('brulure', 4);
    }
    this.physics(sim, dt);
    // Sons d'ambiance
    this.idleSound -= dt;
    if (this.idleSound <= 0) {
      this.idleSound = 6 + Math.random() * 14;
      sim.emit({ t: 'sound', id: `mob_${this.type}_idle`, x: this.x, y: this.y + 1, z: this.z, vol: this.def.category === 'boss' ? 1 : 0.5 });
    }
  }

  private physics(sim: Sim, dt: number): void {
    const w = sim.world(this.dim);
    const b = this.body;
    const mv = this.movement;
    const dimGrav = DIMENSION_INFO[this.dim as DimensionId]?.gravity ?? 1;
    const grav = (this.def.gravity ?? 1) * 28 * dimGrav;
    let tvx = 0,
      tvz = 0,
      tvy: number | null = null;
    const d = this.dest;
    if (d) {
      let wx = d.x,
        wy = d.y,
        wz = d.z;
      if (!d.direct && (mv === 'ground' || mv === 'climb')) {
        this.repath -= dt;
        if (!this.path || this.repath <= 0) {
          this.repath = 1 + Math.random() * 0.5;
          this.path = findPath(w, Math.floor(this.x), Math.floor(this.y + 0.1), Math.floor(this.z), Math.floor(d.x), Math.floor(d.y), Math.floor(d.z), { height: Math.ceil(b.h), canSwim: this.swimming(w), fireImmune: this.fireImmune, maxNodes: this.def.category === 'boss' ? 600 : 300 });
          this.pathIdx = 0;
        }
        const p = this.path;
        if (p && this.pathIdx < p.length) {
          const n = p[this.pathIdx];
          wx = n.x + 0.5;
          wy = n.y;
          wz = n.z + 0.5;
          if (Math.hypot(wx - this.x, wz - this.z) < 0.35 + b.hw * 0.5 && Math.abs(wy - this.y) < 1.2) this.pathIdx++;
        } else if (p && this.pathIdx >= p.length) {
          // chemin terminé : dernière approche directe
        }
      }
      const dx = wx - this.x,
        dz = wz - this.z;
      const dist = Math.hypot(dx, dz);
      const sp = this.speed * d.speed;
      if (dist > 0.15) {
        tvx = (dx / dist) * sp;
        tvz = (dz / dist) * sp;
        this.bodyYaw += angleDiff(this.bodyYaw, Math.atan2(-dx, -dz)) * Math.min(1, dt * 10);
      }
      if (mv === 'fly' || mv === 'hover' || (mv === 'swim' && b.inWater)) {
        const dy = wy - this.y;
        const dd = Math.hypot(dx, dy, dz) || 1;
        // ralentit en arrivant : pas d'allers-retours autour du point visé
        const fs = sp * Math.min(1, dd / 1.2);
        tvy = (dy / dd) * fs;
        if (dist > 0.15 || Math.abs(dy) > 0.2) {
          tvx = (dx / dd) * fs;
          tvz = (dz / dd) * fs;
        }
      }
      if (dist < 0.2 && (d.direct || !this.path || this.pathIdx >= (this.path?.length ?? 0)) && !(mv === 'fly' || mv === 'hover')) this.dest = null;
    }
    // Regard
    const lt = this.lookTarget;
    if (lt) {
      const ly = Math.atan2(-(lt.x - this.x), -(lt.z - this.z));
      this.yaw += angleDiff(this.yaw, ly) * Math.min(1, dt * 8);
      this.pitch = Math.atan2(lt.y - (this.y + this.eye), Math.hypot(lt.x - this.x, lt.z - this.z));
      if (!this.dest) this.bodyYaw += angleDiff(this.bodyYaw, this.yaw) * Math.min(1, dt * 3);
    } else {
      this.yaw += angleDiff(this.yaw, this.bodyYaw) * Math.min(1, dt * 5);
      this.pitch *= 0.9;
    }
    this.lookTarget = null;
    // Intégration (dans l'eau, l'élan — un recul par exemple — s'amortit plus lentement)
    const acc = b.onGround || mv === 'fly' || mv === 'hover' ? 10 : b.inWater ? 4 : 2.5;
    const k = Math.min(1, acc * dt);
    b.vx += (tvx - b.vx) * k;
    b.vz += (tvz - b.vz) * k;
    if (mv === 'fly' || mv === 'hover') {
      const target = tvy ?? (mv === 'hover' ? Math.sin(this.age * 1.5) * 0.3 : 0);
      b.vy += (target - b.vy) * Math.min(1, dt * 4);
    } else if (mv === 'swim' && b.inWater) {
      b.vy += ((tvy ?? 0) - b.vy) * Math.min(1, dt * 4);
    } else if (b.inWater || b.inLava) {
      b.vy -= grav * 0.25 * dt;
      b.vy *= Math.pow(0.3, dt);
    } else {
      b.vy -= grav * dt;
      if (b.vy < -50) b.vy = -50;
    }
    // Saut / escalade quand bloqué : seulement si l'obstacle fait un bloc de haut ;
    // devant un mur plus haut (berge, falaise), on le longe au lieu de sauter sur place.
    if (b.hitH && (tvx !== 0 || tvz !== 0)) {
      if (mv === 'climb') b.vy = 3.2;
      else if ((b.onGround || b.inWater) && mv === 'ground') {
        if (this.canStepOver(w, tvx, tvz)) b.vy = b.onGround ? 8.4 * Math.sqrt(dimGrav) : 7;
        else if (d) this.slideAlongWall(tvx, tvz, d.speed);
      } else if (b.inWater) b.vy = 4;
    }
    const y0 = b.y;
    const wasGround = b.onGround;
    const fall = b.fallDist;
    moveBody(w, b, b.vx * dt, b.vy * dt, b.vz * dt, mv === 'ground' || mv === 'climb' ? 0.6 : 0);
    if (!b.onGround && b.y < y0 && !b.inWater && mv !== 'fly' && mv !== 'hover') b.fallDist += y0 - b.y;
    if (b.onGround && !wasGround && fall > 3.5 && mv === 'ground' && !this.def.phases) this.damage(Math.floor(fall - 3), { type: 'fall', ignoreArmor: true });
    if (b.onGround || b.inWater) b.fallDist = 0;
    // Détection de blocage
    const moved = Math.hypot(this.x - this.lastPos.x, this.z - this.lastPos.z);
    this.lastPos.x = this.x;
    this.lastPos.z = this.z;
    if (this.dest && moved < 0.01 * dt * 60) {
      this.stuck += dt;
      if (this.stuck > 2.5) {
        this.stuck = 0;
        this.path = null;
        this.dest = null;
      }
    } else this.stuck = 0;
    // Nageurs hors de l'eau
    if (mv === 'swim' && !b.inWater && this.type !== 'carapin') {
      this.data.dry = ((this.data.dry as number) ?? 0) + dt;
      if ((this.data.dry as number) > 5) this.damage(1, { type: 'suffocate', ignoreArmor: true });
      if (b.onGround && Math.random() < dt * 2) b.vy = 4;
    } else this.data.dry = 0;
    // Vide
    if (this.y < -20) this.damage(100, { type: 'void' });
  }

  override damage(amount: number, src: DamageSource): number {
    if (this.shielded && src.type !== 'void' && src.type !== 'kill') {
      amount *= 0.15;
    }
    return super.damage(amount, src);
  }

  protected onDeath(src: DamageSource): void {
    void src;
  }

  /** Butin à la mort. */
  dropLoot(sim: Sim): void {
    const bonus = 0;
    for (const s of rollEntries(this.def.loot ?? [], sim.rng, bonus)) sim.spawnItem(this.dim, this.x, this.y + 0.5, this.z, s);
  }

  serialize(): Record<string, unknown> | null {
    if (!this.persistent || this.dead) return null;
    return { type: 'mob', creature: this.type, x: this.x, y: this.y, z: this.z, yaw: this.yaw, health: this.health, home: this.home, data: this.data };
  }
}
