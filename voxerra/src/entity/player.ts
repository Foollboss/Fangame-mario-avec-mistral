/** Joueur : inventaire, énergie (faim), air, température corporelle, mode de jeu. */
import { LivingEntity, type DamageSource } from './living';
import { PlayerInventory } from '../inventory/inventory';
import type { ItemRegistry } from '../registry/items';
import type { GameMode } from '../save/storage';
import { t } from '../i18n/i18n';

export interface SpawnPoint {
  dim: string;
  x: number;
  y: number;
  z: number;
}

export class Player extends LivingEntity {
  readonly kind = 'player';
  readonly inventory: PlayerInventory;
  name: string;
  gameMode: GameMode = 'survie';
  flying = false;
  sneaking = false;
  sprinting = false;
  /** Énergie (0..20) et réserve (saturation). */
  energy = 20;
  saturation = 5;
  exhaustion = 0;
  /** Air (0..10 bulles). */
  air = 10;
  airAcc = 0;
  /** Température corporelle (−1 glacial … 0 confortable … 1 torride). */
  bodyTemp = 0;
  ambientTemp = 0;
  regenAcc = 0;
  starveAcc = 0;
  envAcc = 0;
  spawn: SpawnPoint | null = null;
  vitality = 0;
  /** Temps de recharge de l'attaque (0 = prête). */
  attackCooldown = 0;
  attackCooldownMax = 0.6;
  dodgeCooldown = 0;
  /** Action en cours (manger, charger l'arc, rappel…). */
  using: { kind: string; time: number; total: number; slot: number } | null = null;
  blocking = false;
  portalTime = 0;
  portalCooldown = 0;
  stats: Record<string, number> = {};
  deathMessage = '';
  /** Contrôlé par le client (le mouvement n'est pas simulé par Sim). */
  clientControlled = true;
  remote = false;
  lastDeath: { dim: string; x: number; y: number; z: number } | null = null;
  /** Dernière position à la surface (retour des Cimes astrales). */
  lastSurface: { x: number; y: number; z: number } | null = null;

  constructor(items: ItemRegistry, name = 'Joueur') {
    super(0.3, 1.8, 1.62);
    this.inventory = new PlayerInventory(items);
    this.name = name;
    this.displayName = name;
  }

  get creative(): boolean {
    return this.gameMode === 'creatif' || this.gameMode === 'spectateur';
  }

  get spectator(): boolean {
    return this.gameMode === 'spectateur';
  }

  override armorPoints(): number {
    return this.inventory.armorPoints();
  }

  updateMaxHealth(): void {
    this.maxHealth = 20 + this.vitality * 4;
    if (this.health > this.maxHealth) this.health = this.maxHealth;
  }

  stat(key: string, n = 1): void {
    this.stats[key] = (this.stats[key] ?? 0) + n;
  }

  exhaust(n: number): void {
    if (this.creative) return;
    this.exhaustion += n;
  }

  override damage(amount: number, src: DamageSource): number {
    if (this.creative && src.type !== 'void' && src.type !== 'kill') return 0;
    const fr = this.inventory.fireResistance();
    if (fr > 0 && (src.type === 'lava' || src.type === 'fire' || src.type === 'heat')) amount *= 1 - fr;
    const d = super.damage(amount, src);
    if (d > 0) {
      this.exhaust(0.1);
      this.stat('degats_subis', d);
      this.inventory.damageArmor(d);
    }
    return d;
  }

  protected override modifyDamage(dmg: number, src: DamageSource): number {
    // Bouclier : réduit les attaques frontales
    if (this.blocking && src.attacker && (src.type === 'melee' || src.type === 'projectile')) {
      const off = this.inventory.offhand.get(0);
      const main = this.inventory.held;
      const shield = [off, main].find((s) => s && s.id === 'bouclier');
      if (shield) {
        const ax = src.attacker.x - this.x,
          az = src.attacker.z - this.z;
        const fx = -Math.sin(this.yaw),
          fz = -Math.cos(this.yaw);
        if ((ax * fx + az * fz) / (Math.hypot(ax, az) || 1) > 0.3) {
          shield.dmg = (shield.dmg ?? 0) + 1;
          this.stat('coups_bloques');
          return dmg * 0.15;
        }
      }
    }
    return dmg;
  }

  protected override onDeath(src: DamageSource): void {
    this.deathMessage = deathText(this.name, src);
    this.stat('morts');
  }

  respawn(x: number, y: number, z: number): void {
    this.dead = false;
    this.deathTime = 0;
    this.updateMaxHealth();
    this.health = this.maxHealth;
    this.energy = 20;
    this.saturation = 5;
    this.exhaustion = 0;
    this.air = 10;
    this.bodyTemp = 0;
    this.effects.clear();
    this.setPos(x, y, z);
    this.body.vx = this.body.vy = this.body.vz = 0;
    this.body.fallDist = 0;
    this.invuln = 2;
    if (this.vitality > 0) this.addEffect('vitalite', -1, this.vitality - 1);
  }

  serialize(): Record<string, unknown> {
    return {
      name: this.name,
      dim: this.dim,
      x: this.x,
      y: this.y,
      z: this.z,
      yaw: this.yaw,
      pitch: this.pitch,
      health: this.health,
      energy: this.energy,
      saturation: this.saturation,
      air: this.air,
      bodyTemp: this.bodyTemp,
      gameMode: this.gameMode,
      flying: this.flying,
      spawn: this.spawn,
      vitality: this.vitality,
      inventory: this.inventory.serializeAll(),
      effects: [...this.effects.entries()].map(([id, e]) => ({ id, level: e.level, time: e.time })),
      stats: this.stats,
      dead: this.dead,
      lastDeath: this.lastDeath,
      lastSurface: this.lastSurface,
    };
  }

  load(d: Record<string, unknown> | null | undefined): void {
    if (!d) return;
    const num = (v: unknown, def: number) => (typeof v === 'number' && Number.isFinite(v) ? v : def);
    this.name = typeof d.name === 'string' ? d.name : this.name;
    this.dim = typeof d.dim === 'string' ? d.dim : 'surface';
    this.setPos(num(d.x, 0), num(d.y, 100), num(d.z, 0));
    this.yaw = num(d.yaw, 0);
    this.pitch = num(d.pitch, 0);
    this.vitality = num(d.vitality, 0);
    this.updateMaxHealth();
    this.health = num(d.health, this.maxHealth);
    this.energy = num(d.energy, 20);
    this.saturation = num(d.saturation, 5);
    this.air = num(d.air, 10);
    this.bodyTemp = num(d.bodyTemp, 0);
    if (typeof d.gameMode === 'string') this.gameMode = d.gameMode as GameMode;
    this.flying = !!d.flying && this.creative;
    this.spawn = (d.spawn as SpawnPoint) ?? null;
    this.inventory.loadAll(d.inventory as Record<string, unknown>);
    this.effects.clear();
    for (const e of (d.effects as { id: string; level: number; time: number }[]) ?? []) this.effects.set(e.id, { level: e.level, time: e.time, acc: 0 });
    this.stats = (d.stats as Record<string, number>) ?? {};
    this.lastDeath = (d.lastDeath as Player['lastDeath']) ?? null;
    this.lastSurface = (d.lastSurface as Player['lastSurface']) ?? null;
    if (d.dead) {
      this.health = 0;
      this.dead = true;
    }
  }
}

export function deathText(name: string, src: DamageSource): string {
  const by = (src.attacker as unknown as { displayName?: string })?.displayName;
  const T = (k: string) => t(k, { name, by: by ?? '' });
  switch (src.type) {
    case 'melee':
      return by ? T('{name} a été terrassé par {by}') : T('{name} a été tué');
    case 'projectile':
      return by ? T('{name} a été abattu par {by}') : T('{name} a été transpercé');
    case 'fall':
      return T('{name} est tombé de trop haut');
    case 'lava':
      return T('{name} a voulu nager dans la lave');
    case 'fire':
      return T('{name} s\'est consumé');
    case 'drown':
      return T('{name} s\'est noyé');
    case 'starve':
      return T('{name} est mort d\'épuisement');
    case 'void':
      return T('{name} est tombé dans le vide');
    case 'contact':
      return T('{name} s\'est piqué à mort');
    case 'poison':
      return T('{name} a succombé au poison');
    case 'explosion':
      return by ? T('{name} a été soufflé par {by}') : T('{name} a explosé');
    case 'suffocate':
      return T('{name} a suffoqué dans un mur');
    case 'freeze':
      return T('{name} est mort de froid');
    case 'heat':
      return T('{name} a succombé à la chaleur');
    case 'shock':
      return T('{name} a été foudroyé');
    default:
      return T('{name} est mort');
  }
}

export type { DamageSource };
