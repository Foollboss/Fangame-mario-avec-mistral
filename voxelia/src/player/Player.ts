/**
 * Player — état du joueur : santé, faim, saturation, expérience, oxygène, effets,
 * inventaire, mode de jeu. La survie (faim, régénération, noyade, feu…) est gérée ici.
 */
import * as THREE from 'three';
import { Entity, type DamageSource } from '../entity/Entity';
import type { HumanPose } from '../entities/humanoidPose';
import { PlayerInventory } from '../inventory/Container';
import { ITEMS, deserializeStack, serializeStack, type ItemStack } from '../items/items';
import type { Difficulty, GameMode, PlayerSave } from '../save/SaveManager';
import { BLOCKS } from '../world/blocks';

export interface Effect {
  id: string;
  time: number;
  level: number;
}

export const EFFECT_NAMES: Record<string, string> = {
  regeneration: 'Régénération',
  poison: 'Poison',
  hunger: 'Faim',
  speed: 'Rapidité',
  slowness: 'Lenteur',
  strength: 'Force',
  night_vision: 'Vision nocturne',
  fire_resistance: 'Résistance au feu',
  water_breathing: 'Respiration aquatique',
  jump_boost: 'Saut amélioré',
  slow_falling: 'Chute lente',
};

const ARMOR_SLOTS = ['head', 'chest', 'legs', 'feet'] as const;

export class Player extends Entity {
  readonly type = 'player';
  name = 'Joueur';
  gameMode: GameMode = 'survival';
  difficulty: Difficulty = 'normal';
  hunger = 20;
  saturation = 5;
  exhaustion = 0;
  air = 300;
  xpLevel = 0;
  xpProgress = 0;
  totalXp = 0;
  readonly inventory = new PlayerInventory();
  effects = new Map<string, Effect>();
  spawnPoint: [number, number, number] | null = null;
  flying = false;
  sprinting = false;
  sneaking = false;
  swimming = false;
  gliding = false;
  dimension = 0;
  recipes = new Set<string>();
  seenItems = new Set<string>();
  stats: Record<string, number> = {};
  /** Animations : balancement du bras, marche. */
  swingTime = 0;
  walkDist = 0;
  prevWalkDist = 0;
  bob = 0;
  /** Flottaison (pose « tread ») : tics passés dans l'eau sans appui / hors de l'eau ou au sol. */
  private floatTicks = 0;
  private settledTicks = 0;
  private treading = false;
  private readonly worn: (string | null)[] = [null, null, null, null];
  private hungerTimer = 0;
  private drownTimer = 0;
  private fireTimer = 0;
  private lavaTimer = 0;
  private contactTimer = 0;
  keepInventory = false;
  naturalRegeneration = true;
  fallDamageEnabled = true;
  drowningEnabled = true;
  fireDamageEnabled = true;
  onDamage: ((amount: number, src: DamageSource) => void) | null = null;
  onDeath: ((src: DamageSource) => void) | null = null;

  constructor() {
    super();
    this.persistent = true;
    this.living = true;
  }

  get creative(): boolean {
    return this.gameMode === 'creative' || this.gameMode === 'spectator';
  }

  get survivalLike(): boolean {
    return this.gameMode === 'survival' || this.gameMode === 'adventure';
  }

  heldItem(): ItemStack | null {
    return this.inventory.held();
  }

  /**
   * Pose du corps affichée (troisième personne, poupée, autres joueurs) : planeur, nage rapide,
   * vol créatif, flottaison, accroupi ou debout. Mort ou en véhicule : debout.
   */
  get pose(): HumanPose {
    if (this.dead || this.vehicle) return 'stand';
    if (this.gliding) return 'glide';
    if (this.swimming) return 'swim';
    if (this.flying) return 'fly';
    if (this.treading) return 'tread';
    if (this.sneaking) return 'sneak';
    return 'stand';
  }

  /**
   * Hystérésis de la flottaison (appelée à chaque tic par le contrôleur) : on flotte après 6 tics
   * dans l'eau sans toucher le fond, et on cesse après 4 tics au sol ou hors de l'eau. Un saut
   * dans une flaque ou un contact bref avec le fond ne fait donc pas clignoter la pose.
   */
  updatePose(): void {
    const afloat = this.fluid.water && !this.onGround && !this.climbing && !this.vehicle && !this.flying && !this.gliding && !this.dead;
    if (afloat) {
      this.floatTicks = Math.min(100, this.floatTicks + 1);
      this.settledTicks = 0;
    } else {
      this.settledTicks = Math.min(100, this.settledTicks + 1);
      this.floatTicks = 0;
    }
    if (!this.treading && this.floatTicks >= 6) this.treading = true;
    else if (this.treading && this.settledTicks >= 4) this.treading = false;
  }

  /**
   * Apparence de l'armure portée [tête, torse, jambes, pieds] : matériau (« iron », « diamond »…),
   * « glider » pour le planeur, « pumpkin » pour une citrouille sur la tête, sinon null.
   * Lu à chaque image : le tableau renvoyé est réutilisé (le copier pour le conserver).
   */
  wornArmor(): (string | null)[] {
    const out = this.worn;
    for (let i = 0; i < 4; i++) {
      const s = this.inventory.armor.get(i);
      const def = s ? ITEMS[s.id] : undefined;
      if (def?.armor && def.armor.slot === ARMOR_SLOTS[i]) out[i] = def.armor.material;
      else out[i] = i === 0 && def?.key === 'pumpkin' ? 'pumpkin' : null;
    }
    return out;
  }

  /** Ajoute de la fatigue (sprint, sauts, combat, minage…). */
  exhaust(n: number): void {
    if (!this.survivalLike || this.difficulty === 'peaceful') return;
    this.exhaustion = Math.min(40, this.exhaustion + n);
  }

  addXp(n: number): void {
    this.totalXp += n;
    let need = this.xpToNext();
    this.xpProgress += n / need;
    while (this.xpProgress >= 1) {
      this.xpProgress -= 1;
      this.xpLevel++;
      need = this.xpToNext();
    }
  }

  xpToNext(): number {
    const l = this.xpLevel;
    return l < 16 ? 2 * l + 7 : l < 31 ? 5 * l - 38 : 9 * l - 158;
  }

  addEffect(id: string, seconds: number, level = 0): void {
    const cur = this.effects.get(id);
    if (!cur || cur.level <= level) this.effects.set(id, { id, time: Math.max(cur?.time ?? 0, seconds * 20), level });
  }

  hasEffect(id: string): boolean {
    return this.effects.has(id);
  }

  /** Nourrit le joueur ; renvoie false si impossible (déjà rassasié). */
  eat(stack: ItemStack): boolean {
    const f = ITEMS[stack.id]?.food;
    if (!f) return false;
    if (this.hunger >= 20 && !f.always && !this.creative) return false;
    this.hunger = Math.min(20, this.hunger + f.hunger);
    this.saturation = Math.min(this.hunger, this.saturation + f.saturation);
    if (f.effect === 'regeneration') {
      this.addEffect('regeneration', 5, 1);
      this.addEffect('fire_resistance', 30);
    } else if (f.effect === 'poison' && Math.random() < 0.8) this.addEffect('poison', 4);
    else if (f.effect === 'hunger' && Math.random() < 0.8) this.addEffect('hunger', 30);
    return true;
  }

  override hurt(amount: number, src: DamageSource): boolean {
    if (this.creative && src.type !== 'void') return false;
    if (this.dead) return false;
    if (src.type === 'fall' && !this.fallDamageEnabled) return false;
    if (src.type === 'drown' && !this.drowningEnabled) return false;
    if ((src.type === 'fire' || src.type === 'lava') && (!this.fireDamageEnabled || this.hasEffect('fire_resistance'))) return false;
    // Bonus d'ensemble : étherium (feu ignoré, lave réduite de moitié), célestine (pas de chute).
    if (src.type === 'fire' && this.inventory.fullSet('etherium')) return false;
    if (src.type === 'lava' && this.inventory.fullSet('etherium')) amount /= 2;
    if (src.type === 'fall' && this.inventory.fullSet('celestine')) return false;
    // Difficulté
    if (src.type === 'attack' || src.type === 'projectile' || src.type === 'explosion') {
      if (this.difficulty === 'peaceful') return false;
      if (this.difficulty === 'easy') amount = Math.min(amount / 2 + 1, amount);
      if (this.difficulty === 'hard') amount *= 1.5;
    }
    // Armure
    const armor = this.inventory.armorPoints();
    if (armor > 0 && src.type !== 'fall' && src.type !== 'drown' && src.type !== 'starve' && src.type !== 'void' && src.type !== 'magic') {
      amount *= 1 - Math.min(20, armor) * 0.04;
      this.damageArmor(amount);
    }
    const before = this.health;
    const ok = super.hurt(amount, src);
    if (ok) {
      this.exhaust(0.1);
      this.onDamage?.(before - this.health, src);
    }
    return ok;
  }

  private damageArmor(amount: number): void {
    const wear = Math.max(1, Math.floor(amount / 4));
    const a = this.inventory.armor;
    for (let i = 0; i < 4; i++) {
      const s = a.get(i);
      if (!s) continue;
      const def = ITEMS[s.id]?.armor;
      if (!def) continue;
      s.damage = (s.damage ?? 0) + wear;
      if (s.damage >= def.durability) a.set(i, null);
    }
    a.changed();
  }

  override die(src: DamageSource): void {
    super.die(src);
    this.onDeath?.(src);
  }

  protected override onFall(damage: number): void {
    if (this.creative || this.flying || this.gliding) return;
    this.hurt(damage, { type: 'fall' });
  }

  protected override onVoid(): void {
    this.hurt(4, { type: 'void' });
  }

  /** Tic de survie (20/s). */
  survivalTick(): void {
    if (this.dead) return;
    // Effets
    for (const [id, e] of this.effects) {
      e.time--;
      if (id === 'regeneration' && this.age % Math.max(5, 50 >> e.level) === 0) this.heal(1);
      if (id === 'poison' && this.age % 25 === 0 && this.health > 1) this.hurt(1, { type: 'magic' });
      if (id === 'hunger') this.exhaust(0.025);
      if (e.time <= 0) this.effects.delete(id);
    }
    if (this.creative) {
      this.air = 300;
      this.fireTicks = 0;
      return;
    }
    // Faim
    if (this.difficulty === 'peaceful') {
      if (this.age % 20 === 0) this.heal(1);
      if (this.age % 10 === 0 && this.hunger < 20) this.hunger++;
    }
    while (this.exhaustion >= 4) {
      this.exhaustion -= 4;
      if (this.saturation > 0) this.saturation = Math.max(0, this.saturation - 1);
      else if (this.difficulty !== 'peaceful') this.hunger = Math.max(0, this.hunger - 1);
    }
    this.hungerTimer++;
    if (this.naturalRegeneration && this.hunger >= 20 && this.saturation > 0 && this.health < this.maxHealth) {
      if (this.hungerTimer >= 10) {
        const h = Math.min(this.saturation, 6) / 6;
        this.heal(h);
        this.exhaust(h * 6);
        this.hungerTimer = 0;
      }
    } else if (this.naturalRegeneration && this.hunger >= 18 && this.health < this.maxHealth) {
      if (this.hungerTimer >= 80) {
        this.heal(1);
        this.exhaust(6);
        this.hungerTimer = 0;
      }
    } else if (this.hunger <= 0) {
      if (this.hungerTimer >= 80) {
        const floor = this.difficulty === 'easy' ? 10 : this.difficulty === 'normal' ? 1 : 0;
        if (this.health > floor) this.hurt(1, { type: 'starve' });
        this.hungerTimer = 0;
      }
    } else this.hungerTimer = 0;

    // Oxygène / noyade
    if (this.fluid.eyesInWater && !this.hasEffect('water_breathing')) {
      this.air--;
      if (this.air <= -20) {
        this.air = 0;
        this.hurt(2, { type: 'drown' });
      }
    } else this.air = Math.min(300, this.air + 5);

    // Lave et feu
    if (this.fluid.lava) {
      this.fireTicks = 300;
      if (++this.lavaTimer >= 10) {
        this.lavaTimer = 0;
        this.hurt(4, { type: 'lava' });
      }
    }
    if (this.fireTicks > 0) {
      this.fireTicks--;
      if (++this.fireTimer >= 20) {
        this.fireTimer = 0;
        this.hurt(1, { type: 'fire' });
      }
    }
    // Contact : cactus, magma, feu, buisson…
    if (++this.contactTimer >= 10) {
      this.contactTimer = 0;
      const b = this.box;
      let dmg = 0;
      let burn = 0;
      for (let x = Math.floor(b.x0 - 0.05); x <= Math.floor(b.x1 + 0.05); x++)
        for (let z = Math.floor(b.z0 - 0.05); z <= Math.floor(b.z1 + 0.05); z++)
          for (let y = Math.floor(b.y0 - 0.1); y <= Math.floor(b.y1); y++) {
            const d = BLOCKS[this.world.id(x, y, z)];
            if (!d || !d.damage || d.shape === 'liquid') continue;
            if (d.key === 'magma' && (this.sneaking || y !== Math.floor(b.y0 - 0.1))) continue;
            if (d.key === 'fire' || d.key === 'campfire') {
              if (y === Math.floor(b.y0 - 0.1) && d.key === 'campfire') {
                /* se tenir sur un feu de camp brûle */
              }
              this.fireTicks = Math.max(this.fireTicks, 160);
            }
            if (d.key === 'fire' || d.key === 'campfire' || d.key === 'magma') burn = Math.max(burn, d.damage);
            else dmg = Math.max(dmg, d.damage);
          }
      // Les blocs brûlants infligent des dégâts de feu ; s'ils sont ignorés (résistance au feu,
      // ensemble d'étherium), un cactus voisin pique quand même.
      const burnt = burn > 0 && burn >= dmg && this.hurt(burn, { type: 'fire' });
      if (!burnt && dmg) this.hurt(dmg, { type: 'contact' });
    }
  }

  respawnReset(): void {
    this.dead = false;
    this.deathTime = 0;
    this.health = this.maxHealth;
    this.hunger = 20;
    this.saturation = 5;
    this.exhaustion = 0;
    this.air = 300;
    this.fireTicks = 0;
    this.fallDistance = 0;
    this.effects.clear();
    this.vel.set(0, 0, 0);
    this.swimming = false;
    this.gliding = false;
    this.treading = false;
    this.floatTicks = 0;
  }

  /** Objets perdus à la mort (vidés de l'inventaire). */
  takeDrops(): ItemStack[] {
    const out: ItemStack[] = [];
    for (const c of [this.inventory, this.inventory.armor, this.inventory.offhand]) {
      for (let i = 0; i < c.size; i++) {
        const s = c.get(i);
        if (s) out.push(s);
      }
      c.clear();
    }
    return out;
  }

  /** Recettes : un ingrédient vu débloque les recettes qui l'utilisent. */
  noteItem(s: ItemStack | null): boolean {
    if (!s) return false;
    const k = ITEMS[s.id]?.key;
    if (!k || this.seenItems.has(k)) return false;
    this.seenItems.add(k);
    return true;
  }

  serialize(): PlayerSave {
    return {
      pos: [this.pos.x, this.pos.y, this.pos.z],
      yaw: this.yaw,
      pitch: this.pitch,
      dim: this.dimension,
      health: this.health,
      hunger: this.hunger,
      saturation: this.saturation,
      exhaustion: this.exhaustion,
      xp: this.totalXp,
      level: this.xpLevel,
      air: this.air,
      gameMode: this.gameMode,
      inventory: this.inventory.slots.map(serializeStack),
      armor: this.inventory.armor.slots.map(serializeStack),
      offhand: serializeStack(this.inventory.offhand.get(0)),
      selected: this.inventory.selected,
      spawnPoint: this.spawnPoint,
      effects: [...this.effects.values()],
      recipes: [...this.seenItems],
      stats: this.stats,
      flying: this.flying,
    };
  }

  deserialize(d: PlayerSave): void {
    this.pos.set(d.pos[0], d.pos[1], d.pos[2]);
    this.prevPos.copy(this.pos);
    this.yaw = d.yaw;
    this.pitch = d.pitch;
    this.dimension = d.dim ?? 0;
    this.health = d.health > 0 ? d.health : this.maxHealth;
    this.hunger = d.hunger;
    this.saturation = d.saturation;
    this.exhaustion = d.exhaustion ?? 0;
    this.totalXp = 0;
    this.xpLevel = 0;
    this.xpProgress = 0;
    this.addXp(d.xp ?? 0);
    this.air = d.air ?? 300;
    this.gameMode = d.gameMode;
    d.inventory.forEach((s, i) => (this.inventory.slots[i] = deserializeStack(s)));
    (d.armor ?? []).forEach((s, i) => (this.inventory.armor.slots[i] = deserializeStack(s)));
    this.inventory.offhand.slots[0] = deserializeStack(d.offhand);
    this.inventory.selected = d.selected ?? 0;
    this.spawnPoint = d.spawnPoint;
    this.effects = new Map((d.effects ?? []).map((e) => [e.id, e]));
    this.seenItems = new Set(d.recipes ?? []);
    this.stats = d.stats ?? {};
    this.flying = !!d.flying && this.creative;
    this.inventory.changed();
  }
}

export const tmpVec = new THREE.Vector3();
