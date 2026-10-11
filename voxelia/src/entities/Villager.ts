/**
 * NPCSystem — villageois : métiers, échanges (émeraudes), emploi du temps
 * (travail le jour, retour à la maison le soir, sommeil la nuit), fuite des monstres,
 * dialogues simples et réaction aux agressions.
 */
import * as THREE from 'three';
import { Mob } from './Mob';
import type { EntityHost } from './host';
import type { Player } from '../player/Player';
import { BLOCKS } from '../world/blocks';

export interface Trade {
  /** Objet demandé (clé, quantité). */
  buy: [string, number];
  buy2?: [string, number];
  sell: [string, number];
  uses: number;
  maxUses: number;
  xp: number;
  level: number;
}

export const PROFESSIONS: Record<string, { name: string; hat: number; robe: number; trades: Array<Omit<Trade, 'uses'>> }> = {
  farmer: {
    name: 'Fermier',
    hat: 0xc8a050,
    robe: 0x7a6a3a,
    trades: [
      { buy: ['wheat', 20], sell: ['emerald', 1], maxUses: 16, xp: 2, level: 1 },
      { buy: ['potato', 26], sell: ['emerald', 1], maxUses: 16, xp: 2, level: 1 },
      { buy: ['emerald', 1], sell: ['bread', 6], maxUses: 16, xp: 1, level: 1 },
      { buy: ['pumpkin', 6], sell: ['emerald', 1], maxUses: 12, xp: 10, level: 2 },
      { buy: ['emerald', 1], sell: ['pumpkin_pie', 4], maxUses: 12, xp: 5, level: 2 },
      { buy: ['melon', 4], sell: ['emerald', 1], maxUses: 12, xp: 20, level: 3 },
      { buy: ['emerald', 3], sell: ['cookie', 18], maxUses: 12, xp: 10, level: 3 },
      { buy: ['emerald', 4], sell: ['golden_apple', 1], maxUses: 6, xp: 30, level: 4 },
    ],
  },
  librarian: {
    name: 'Bibliothécaire',
    hat: 0xe8e8e0,
    robe: 0x4a5a8a,
    trades: [
      { buy: ['paper', 24], sell: ['emerald', 1], maxUses: 16, xp: 2, level: 1 },
      { buy: ['emerald', 9], sell: ['bookshelf', 1], maxUses: 12, xp: 1, level: 1 },
      { buy: ['book', 4], sell: ['emerald', 1], maxUses: 12, xp: 10, level: 2 },
      { buy: ['emerald', 5], sell: ['compass', 1], maxUses: 12, xp: 10, level: 2 },
      { buy: ['emerald', 8], sell: ['map', 1], maxUses: 12, xp: 15, level: 3 },
      { buy: ['emerald', 6], sell: ['lantern', 3], maxUses: 12, xp: 15, level: 3 },
      { buy: ['emerald', 20], buy2: ['crystal_shard', 4], sell: ['sky_key', 1], maxUses: 3, xp: 30, level: 4 },
    ],
  },
  smith: {
    name: 'Forgeron',
    hat: 0x3a3a3a,
    robe: 0x5a4a4a,
    trades: [
      { buy: ['coal', 15], sell: ['emerald', 1], maxUses: 16, xp: 2, level: 1 },
      { buy: ['emerald', 3], sell: ['iron_pickaxe', 1], maxUses: 3, xp: 5, level: 1 },
      { buy: ['iron_ingot', 4], sell: ['emerald', 1], maxUses: 12, xp: 10, level: 2 },
      { buy: ['emerald', 7], sell: ['iron_chestplate', 1], maxUses: 3, xp: 10, level: 2 },
      { buy: ['emerald', 5], sell: ['iron_sword', 1], maxUses: 3, xp: 10, level: 2 },
      { buy: ['diamond', 1], sell: ['emerald', 2], maxUses: 12, xp: 20, level: 3 },
      { buy: ['emerald', 18], sell: ['diamond_sword', 1], maxUses: 3, xp: 30, level: 4 },
      { buy: ['emerald', 24], sell: ['diamond_chestplate', 1], maxUses: 3, xp: 30, level: 4 },
    ],
  },
  butcher: {
    name: 'Boucher',
    hat: 0xe8e8e8,
    robe: 0x8a3a3a,
    trades: [
      { buy: ['raw_chicken', 14], sell: ['emerald', 1], maxUses: 16, xp: 2, level: 1 },
      { buy: ['raw_porkchop', 7], sell: ['emerald', 1], maxUses: 16, xp: 2, level: 1 },
      { buy: ['emerald', 1], sell: ['cooked_porkchop', 5], maxUses: 16, xp: 5, level: 2 },
      { buy: ['raw_beef', 10], sell: ['emerald', 1], maxUses: 16, xp: 10, level: 2 },
      { buy: ['emerald', 1], sell: ['steak', 4], maxUses: 16, xp: 10, level: 3 },
      { buy: ['emerald', 2], sell: ['honey_cake', 1], maxUses: 8, xp: 20, level: 4 },
    ],
  },
  cartographer: {
    name: 'Cartographe',
    hat: 0x3a6a3a,
    robe: 0x3a5a6a,
    trades: [
      { buy: ['paper', 24], sell: ['emerald', 1], maxUses: 16, xp: 2, level: 1 },
      { buy: ['emerald', 7], sell: ['map', 1], maxUses: 12, xp: 1, level: 1 },
      { buy: ['glass_pane', 11], sell: ['emerald', 1], maxUses: 16, xp: 10, level: 2 },
      { buy: ['emerald', 4], sell: ['compass', 1], maxUses: 12, xp: 10, level: 2 },
      { buy: ['emerald', 12], buy2: ['feather', 4], sell: ['glider', 1], maxUses: 2, xp: 30, level: 4 },
    ],
  },
  cleric: {
    name: 'Alchimiste',
    hat: 0x6a2a8a,
    robe: 0x5a2a6a,
    trades: [
      { buy: ['rotten_flesh', 32], sell: ['emerald', 1], maxUses: 16, xp: 2, level: 1 },
      { buy: ['emerald', 1], sell: ['energy_dust', 2], maxUses: 12, xp: 1, level: 1 },
      { buy: ['gold_ingot', 3], sell: ['emerald', 1], maxUses: 12, xp: 10, level: 2 },
      { buy: ['emerald', 1], sell: ['glowstone_dust', 4], maxUses: 12, xp: 10, level: 2 },
      { buy: ['emerald', 5], sell: ['crystal_shard', 3], maxUses: 12, xp: 15, level: 3 },
      { buy: ['emerald', 10], sell: ['golden_apple', 1], maxUses: 5, xp: 30, level: 4 },
    ],
  },
  fisherman: {
    name: 'Pêcheur',
    hat: 0xd8c870,
    robe: 0x3a6a8a,
    trades: [
      { buy: ['string', 20], sell: ['emerald', 1], maxUses: 16, xp: 2, level: 1 },
      { buy: ['emerald', 1], buy2: ['raw_cod', 6], sell: ['cooked_cod', 6], maxUses: 16, xp: 1, level: 1 },
      { buy: ['raw_cod', 15], sell: ['emerald', 1], maxUses: 16, xp: 10, level: 2 },
      { buy: ['emerald', 3], sell: ['fishing_rod', 1], maxUses: 3, xp: 10, level: 2 },
      { buy: ['emerald', 2], sell: ['oak_boat', 1], maxUses: 12, xp: 30, level: 3 },
    ],
  },
};

const GREETINGS = [
  'Bonjour, voyageur !',
  'Hmm… tu as besoin de quelque chose ?',
  'Belle journée pour récolter.',
  "Méfie-toi des monstres la nuit, rentre avant le coucher du soleil.",
  "On raconte qu'un golem antique dort dans les ruines du désert…",
  "Mon grand-père parlait d'îles flottantes au-delà d'un portail de cristal.",
  'Les émeraudes sont la monnaie du village.',
  "Il paraît que les profondeurs cachent un gardien terrible.",
  "Un portail d'obsidienne mène aux Terres de braise, dit-on.",
];
const NIGHT_LINES = ['Il fait nuit… je vais me coucher.', 'Pas maintenant, il est tard !', 'Chut, tout le monde dort.'];
const SCARED = ['Au secours ! Des monstres !', 'Cachez-vous !', 'Aaah !'];

export class Villager extends Mob {
  profession = 'farmer';
  trades: Trade[] = [];
  level = 1;
  tradeXp = 0;
  /** Points d'agacement envers le joueur (prix plus élevés, refus). */
  anger = 0;
  sleeping = false;
  villageCenter: THREE.Vector3 | null = null;
  bedPos: THREE.Vector3 | null = null;
  workPos: THREE.Vector3 | null = null;
  private talkCooldown = 0;

  constructor() {
    super('villager');
    this.persistent = true;
  }

  setup(profession: string, home: THREE.Vector3 | null, center: THREE.Vector3 | null): void {
    this.profession = PROFESSIONS[profession] ? profession : 'farmer';
    this.homePos = home;
    this.bedPos = home;
    this.villageCenter = center;
    this.refreshTrades();
  }

  refreshTrades(): void {
    const p = PROFESSIONS[this.profession];
    const known = new Map(this.trades.map((t) => [t.sell[0] + t.buy[0], t]));
    this.trades = p.trades.map((t) => ({ ...t, uses: known.get(t.sell[0] + t.buy[0])?.uses ?? 0 }));
  }

  /** Prix ajusté par la réputation. */
  price(t: Trade): number {
    return Math.max(1, Math.min(64, t.buy[1] + Math.floor(this.anger / 2)));
  }

  completeTrade(t: Trade): void {
    t.uses++;
    this.tradeXp += t.xp;
    const thresholds = [0, 10, 70, 150, 250];
    while (this.level < 5 && this.tradeXp >= thresholds[this.level]) this.level++;
    this.anger = Math.max(0, this.anger - 1);
  }

  protected override ai(host: EntityHost): void {
    if (this.talkCooldown > 0) this.talkCooldown--;
    this.alertGuards(host);
    const t = host.time;
    const night = host.dimension === 0 && (t > 12500 && t < 23200);
    const evening = host.dimension === 0 && t > 11000 && t <= 12500;
    // Danger : monstre proche → fuite vers la maison
    let threat: THREE.Vector3 | null = null;
    if (this.age % 10 === 0)
      for (const e of host.entitiesNear(this.pos, 10)) {
        if (e instanceof Mob && e.hostileNow && !e.dead && e.def.kind !== 'npc' && e.type !== 'village_guard') {
          threat = e.pos;
          break;
        }
      }
    if (threat) {
      this.panic = Math.max(this.panic, 60);
      if (this.talkCooldown <= 0 && host.player.pos.distanceTo(this.pos) < 12) {
        this.talkCooldown = 200;
        host.audio('villager_hurt', this.pos);
      }
    }
    if (this.panic > 0) {
      if (this.homePos) {
        this.goTo(host, this.homePos.x, this.homePos.y, this.homePos.z, 1.3);
        return;
      }
      return this.aiPanic(host);
    }
    if (night || evening) {
      if (this.bedPos && this.pos.distanceTo(this.bedPos) > 1.2) {
        this.sleeping = false;
        this.goTo(host, this.bedPos.x, this.bedPos.y, this.bedPos.z, 0.8);
        return;
      }
      this.sleeping = night;
      return;
    }
    this.sleeping = false;
    // Le fermier récolte et replante le blé mûr
    if (this.profession === 'farmer' && this.age % 40 === 0) this.farm(host);
    if (this.villageCenter && this.pos.distanceTo(this.villageCenter) > 28 && !this.wander) {
      this.wander = this.villageCenter.clone();
    }
    this.aiWander(host);
  }

  private farm(host: EntityHost): void {
    const wheat = BLOCKS.find((b) => b?.key === 'wheat')!.id;
    const x0 = Math.floor(this.pos.x);
    const y0 = Math.floor(this.pos.y);
    const z0 = Math.floor(this.pos.z);
    for (let dx = -2; dx <= 2; dx++)
      for (let dz = -2; dz <= 2; dz++)
        for (let dy = -1; dy <= 0; dy++) {
          const x = x0 + dx;
          const y = y0 + dy;
          const z = z0 + dz;
          if (host.world.id(x, y, z) === wheat && host.world.meta(x, y, z) >= 7) {
            host.world.set(x, y, z, wheat, 0, 'tick');
            host.particles.blockBreak(x, y, z, wheat, true);
            return;
          }
        }
  }

  override interact(host: EntityHost, player: Player): boolean {
    if (this.dead) return false;
    if (this.sleeping) {
      host.message(`<${PROFESSIONS[this.profession].name}> ${NIGHT_LINES[Math.floor(Math.random() * NIGHT_LINES.length)]}`);
      return true;
    }
    if (this.anger > 12) {
      host.message(`<${PROFESSIONS[this.profession].name}> Va-t'en ! Je ne commerce pas avec les brutes.`);
      host.audio('villager_hurt', this.pos);
      return true;
    }
    if (this.talkCooldown <= 0) {
      this.talkCooldown = 100;
      const lines = this.panic > 0 ? SCARED : GREETINGS;
      host.message(`<${PROFESSIONS[this.profession].name}> ${lines[Math.floor(Math.random() * lines.length)]}`);
    }
    host.audio('villager', this.pos);
    this.faceTowards(player.pos.x, player.pos.z, Math.PI);
    host.openTrade(this);
    return true;
  }

  private lastAttacker: import('../entity/Entity').Entity | null = null;

  override hurt(amount: number, src: Parameters<Mob['hurt']>[1]): boolean {
    const ok = super.hurt(amount, src);
    if (ok && src.attacker?.type === 'player') {
      this.anger += 6;
      this.lastAttacker = src.attacker;
    }
    return ok;
  }

  /** Les gardes défendent les villageois attaqués. */
  private alertGuards(host: EntityHost): void {
    if (!this.lastAttacker) return;
    for (const e of host.entitiesNear(this.pos, 24)) {
      if (e instanceof Mob && e.type === 'village_guard') {
        e.provokedBy = this.lastAttacker;
        e.target = this.lastAttacker;
      }
    }
    this.lastAttacker = null;
  }

  override serializeData(): Record<string, unknown> {
    return {
      ...super.serializeData(),
      profession: this.profession,
      trades: this.trades.map((t) => t.uses),
      level: this.level,
      tradeXp: this.tradeXp,
      anger: this.anger,
      bed: this.bedPos ? [this.bedPos.x, this.bedPos.y, this.bedPos.z] : undefined,
      center: this.villageCenter ? [this.villageCenter.x, this.villageCenter.y, this.villageCenter.z] : undefined,
    };
  }

  override loadData(d: Record<string, unknown>): void {
    super.loadData(d);
    this.profession = typeof d.profession === 'string' && PROFESSIONS[d.profession] ? d.profession : 'farmer';
    this.refreshTrades();
    if (Array.isArray(d.trades)) d.trades.forEach((u, i) => this.trades[i] && (this.trades[i].uses = Number(u) || 0));
    this.level = Number(d.level) || 1;
    this.tradeXp = Number(d.tradeXp) || 0;
    this.anger = Number(d.anger) || 0;
    if (Array.isArray(d.bed)) this.bedPos = new THREE.Vector3(d.bed[0], d.bed[1], d.bed[2]);
    if (Array.isArray(d.center)) this.villageCenter = new THREE.Vector3(d.center[0], d.center[1], d.center[2]);
  }
}
