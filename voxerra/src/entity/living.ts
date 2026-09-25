/** Entités vivantes : santé, dégâts, armure, effets de statut, recul, mort. */
import { Entity } from './entity';

export type DamageType =
  | 'melee'
  | 'projectile'
  | 'fall'
  | 'lava'
  | 'fire'
  | 'drown'
  | 'starve'
  | 'void'
  | 'contact'
  | 'poison'
  | 'magic'
  | 'explosion'
  | 'suffocate'
  | 'freeze'
  | 'heat'
  | 'shock'
  | 'kill';

export interface DamageSource {
  type: DamageType;
  attacker?: Entity | null;
  /** Position d'origine (projectiles, explosions) pour le recul. */
  fromX?: number;
  fromZ?: number;
  knockback?: number;
  element?: 'fire' | 'frost' | 'poison' | 'shock';
  ignoreArmor?: boolean;
  crit?: boolean;
}

export interface ActiveEffect {
  level: number;
  time: number; // secondes restantes (−1 = permanent)
  acc: number;
}

const FIRE_TYPES: DamageType[] = ['lava', 'fire', 'heat'];

export abstract class LivingEntity extends Entity {
  health = 20;
  maxHealth = 20;
  baseArmor = 0;
  invuln = 0;
  hurtTime = 0;
  deathTime = 0;
  dead = false;
  knockbackResist = 0;
  readonly effects = new Map<string, ActiveEffect>();
  lastAttacker: Entity | null = null;
  lastAttackerTime = 0;
  lastDamage: DamageSource | null = null;
  fireImmune = false;
  immune = new Set<string>();
  /** Animation d'attaque (0..1). */
  swing = 0;

  addEffect(id: string, duration: number, level = 0): void {
    const cur = this.effects.get(id);
    if (cur && cur.level > level && cur.time > duration) return;
    this.effects.set(id, { level, time: duration, acc: cur?.acc ?? 0 });
  }

  hasEffect(id: string): boolean {
    return this.effects.has(id);
  }

  effectLevel(id: string): number {
    return this.effects.get(id)?.level ?? -1;
  }

  removeEffect(id: string): void {
    this.effects.delete(id);
  }

  /** Points d'armure totaux. */
  armorPoints(): number {
    return this.baseArmor;
  }

  /** Multiplicateur de vitesse issu des effets. */
  speedMultiplier(): number {
    let m = 1;
    const v = this.effects.get('vitesse');
    if (v) m *= 1.2 + 0.15 * v.level;
    if (this.effects.has('lenteur')) m *= 0.6;
    if (this.effects.has('gel')) m *= 0.45;
    if (this.effects.has('frissons')) m *= 0.8;
    return m;
  }

  /**
   * Inflige des dégâts. Renvoie les dégâts réellement appliqués (0 si ignorés).
   */
  damage(amount: number, src: DamageSource): number {
    if (this.dead || amount <= 0) return 0;
    if (this.immune.has(src.type)) return 0;
    if (FIRE_TYPES.includes(src.type) && (this.fireImmune || this.hasEffect('resistance_feu'))) return 0;
    if (this.invuln > 0 && src.type !== 'kill' && src.type !== 'void') return 0;
    let dmg = amount;
    if (!src.ignoreArmor && ['melee', 'projectile', 'explosion', 'contact', 'shock'].includes(src.type)) {
      const a = Math.min(20, this.armorPoints());
      dmg *= 1 - a / 25;
    }
    dmg = this.modifyDamage(dmg, src);
    if (dmg <= 0) return 0;
    this.health -= dmg;
    this.hurtTime = 0.4;
    if (['melee', 'projectile', 'explosion', 'shock'].includes(src.type)) this.invuln = 0.45;
    else this.invuln = Math.max(this.invuln, 0.05);
    this.lastDamage = src;
    if (src.attacker && src.attacker !== this) {
      this.lastAttacker = src.attacker;
      this.lastAttackerTime = 0;
    }
    // recul
    const kb = (src.knockback ?? (src.attacker ? 1 : 0)) * (1 - this.knockbackResist);
    if (kb > 0) {
      const fx = src.fromX ?? src.attacker?.x ?? this.x;
      const fz = src.fromZ ?? src.attacker?.z ?? this.z;
      let dx = this.x - fx,
        dz = this.z - fz;
      const l = Math.hypot(dx, dz) || 1;
      dx /= l;
      dz /= l;
      this.body.vx += dx * 7 * kb;
      this.body.vz += dz * 7 * kb;
      this.body.vy = Math.max(this.body.vy, 5 * Math.min(1, kb));
    }
    // effets élémentaires
    if (src.element === 'fire' && !this.fireImmune) this.addEffect('brulure', 4);
    if (src.element === 'frost') this.addEffect('gel', 3);
    if (src.element === 'poison') this.addEffect('poison', 5);
    if (src.element === 'shock') this.addEffect('electrise', 2);
    if (this.health <= 0) {
      this.health = 0;
      this.dead = true;
      this.onDeath(src);
    }
    return dmg;
  }

  /** Point d'extension (bouclier, résistance…). */
  protected modifyDamage(dmg: number, _src: DamageSource): number {
    return dmg;
  }

  heal(n: number): void {
    if (this.dead) return;
    this.health = Math.min(this.maxHealth, this.health + n);
  }

  protected abstract onDeath(src: DamageSource): void;

  /** Fait évoluer les effets et minuteries (appelé à chaque tick de simulation). */
  tickLiving(dt: number): void {
    this.invuln = Math.max(0, this.invuln - dt);
    this.hurtTime = Math.max(0, this.hurtTime - dt);
    this.lastAttackerTime += dt;
    this.swing = Math.max(0, this.swing - dt * 3);
    if (this.dead) {
      this.deathTime += dt;
      return;
    }
    for (const [id, e] of this.effects) {
      e.acc += dt;
      switch (id) {
        case 'poison':
          if (e.acc >= 1.2) {
            e.acc = 0;
            if (this.health > 1) this.damage(1, { type: 'poison', ignoreArmor: true });
          }
          break;
        case 'brulure':
          if (e.acc >= 1) {
            e.acc = 0;
            this.damage(1, { type: 'fire', ignoreArmor: true });
          }
          break;
        case 'electrise':
          if (e.acc >= 0.8) {
            e.acc = 0;
            this.damage(1, { type: 'shock', ignoreArmor: true, knockback: 0 });
          }
          break;
        case 'regeneration':
          if (e.acc >= 1.2 / (1 + e.level)) {
            e.acc = 0;
            this.heal(1);
          }
          break;
      }
      if (e.time >= 0) {
        e.time -= dt;
        if (e.time <= 0) this.effects.delete(id);
      }
    }
    // la lave/l'eau éteignent/allument
    if (this.body.inWater) this.effects.delete('brulure');
  }
}
