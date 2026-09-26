/**
 * Simulation autoritaire du monde (sans rendu) : dimensions, entités, temps,
 * météo, blocs vivants, survie des joueurs. Utilisée telle quelle en solo et
 * par le serveur multijoueur.
 */
import { World } from '../world/world';
import type { Content } from '../registry/content';
import { EntityManager } from './entityManager';
import { Environment } from './environment';
import type { SimEvent, SimListener } from './events';
import { Rng, hashString } from '../engine/rng';
import type { Player } from '../entity/player';
import { ItemEntity } from '../entity/itemEntity';
import type { ItemStack } from '../inventory/inventory';
import { BlockTicker } from './blockTicks';
import { tickSurvival } from './survival';
import { FurnaceSystem } from './furnace';
import type { WorldMeta } from '../save/storage';
import type { Entity } from '../entity/entity';
import { DEFAULT_RULES, type GameRules } from '../save/storage';
import { checkPortalContact, mapCoords, buildArrivalPortal, buildAstralArrival, portalKind, PORTAL_KINDS } from './portals';
import { tickPlates } from './mechanisms';
import type { Mob } from '../entity/mob';
import type { MobSystem } from './mobs';

export const TICK = 0.05;

/** Modules optionnels branchés sur la simulation (créatures, progrès, portails…). */
export interface SimModule {
  tick?(sim: Sim): void;
  onBlockChange?(sim: Sim, dim: string, x: number, y: number, z: number, old: number, cell: number): void;
  onEntityRemoved?(sim: Sim, e: Entity): void;
}

export interface TickableEntity extends Entity {
  tick(sim: Sim, dt: number): void;
  serialize?(): Record<string, unknown> | null;
}

export class Sim {
  readonly worldsByDim = new Map<string, World>();
  readonly entities = new EntityManager();
  readonly env = new Environment();
  readonly players: Player[] = [];
  readonly rng: Rng;
  readonly tickers = new Map<string, BlockTicker>();
  readonly furnaces: FurnaceSystem;
  readonly modules: SimModule[] = [];
  private listeners: SimListener[] = [];
  tickCount = 0;
  rules: GameRules;
  difficulty: number;

  constructor(
    readonly content: Content,
    readonly meta: WorldMeta,
  ) {
    this.rng = new Rng(meta.seed ^ hashString('sim') ^ Date.now());
    this.rules = { ...DEFAULT_RULES, ...(meta.rules ?? {}) };
    this.difficulty = meta.difficulty ?? 2;
    this.env.time = meta.time ?? 1000;
    if (meta.weather) {
      this.env.weather = (meta.weather.state as Environment['weather']) ?? 'clair';
      this.env.weatherTimer = meta.weather.timer ?? 9000;
    }
    this.furnaces = new FurnaceSystem(this);
  }

  get seed(): number {
    return this.meta.seed;
  }

  world(dim: string): World {
    let w = this.worldsByDim.get(dim);
    if (!w) {
      w = new World(this.content, dim, this.meta.seed);
      this.worldsByDim.set(dim, w);
      this.tickers.set(dim, new BlockTicker(this, w));
      const ww = w;
      w.blockListeners.push((c) => {
        this.tickers.get(dim)!.onBlockChange(c.x, c.y, c.z, c.old, c.cell);
        for (const m of this.modules) m.onBlockChange?.(this, ww.dim, c.x, c.y, c.z, c.old, c.cell);
      });
    }
    return w;
  }

  on(l: SimListener): () => void {
    this.listeners.push(l);
    return () => {
      const i = this.listeners.indexOf(l);
      if (i >= 0) this.listeners.splice(i, 1);
    };
  }

  emit(e: SimEvent): void {
    for (const l of this.listeners) l(e);
  }

  addPlayer(p: Player): void {
    if (!this.players.includes(p)) this.players.push(p);
    this.entities.add(p);
  }

  removePlayer(p: Player): void {
    const i = this.players.indexOf(p);
    if (i >= 0) this.players.splice(i, 1);
    this.entities.remove(p);
  }

  spawnItem(dim: string, x: number, y: number, z: number, stack: ItemStack, spread = true): ItemEntity | null {
    if (!stack || stack.count <= 0 || !this.content.items.has(stack.id)) return null;
    const e = new ItemEntity({ ...stack });
    e.dim = dim;
    e.setPos(x, y, z);
    if (spread) {
      e.body.vx = (this.rng.next() - 0.5) * 3;
      e.body.vz = (this.rng.next() - 0.5) * 3;
      e.body.vy = 3 + this.rng.next() * 2;
    }
    this.entities.add(e);
    return e;
  }

  /** Hook : un joueur obtient un objet (progrès, statistiques). */
  onItemObtained(p: Player, id: string, count: number): void {
    p.stat('objets_ramasses', count);
    this.itemObtainedHooks.forEach((h) => h(p, id, count));
  }
  readonly itemObtainedHooks: ((p: Player, id: string, count: number) => void)[] = [];
  /** Hooks génériques de déclencheurs (progrès). */
  readonly triggerHooks: ((p: Player, type: string, data: Record<string, unknown>) => void)[] = [];
  trigger(p: Player, type: string, data: Record<string, unknown> = {}): void {
    for (const h of this.triggerHooks) h(p, type, data);
  }

  /** Une colonne est-elle chargée à cette position ? */
  loadedAt(dim: string, x: number, z: number): boolean {
    return this.worldsByDim.get(dim)?.isLoaded(Math.floor(x), Math.floor(z)) ?? false;
  }

  /** Un tick de simulation (1/20 s). */
  tick(): void {
    this.tickCount++;
    const lightning = this.env.tick(this.rules, this.rng);
    if (lightning && this.players.length > 0) {
      const p = this.rng.pick(this.players);
      if (p.dim === 'surface') {
        const x = Math.floor(p.x + (this.rng.next() - 0.5) * 120),
          z = Math.floor(p.z + (this.rng.next() - 0.5) * 120);
        const w = this.world('surface');
        const y = w.heightAt(x, z) + 1;
        this.emit({ t: 'lightning', x, y, z });
        for (const e of this.entities.near('surface', x, y, z, 3)) (e as unknown as { damage?: (n: number, s: object) => void }).damage?.(5, { type: 'shock', knockback: 0.5 });
      }
    }
    // Blocs vivants
    for (const [dim, ticker] of this.tickers) {
      if (!this.players.some((p) => p.dim === dim)) continue;
      ticker.tick();
    }
    this.furnaces.tick();
    // Entités
    for (const e of this.entities.list) {
      if (e.removed) continue;
      if (!this.loadedAt(e.dim, e.x, e.z) && e.kind !== 'player') continue;
      const te = e as TickableEntity;
      if (e.kind === 'player') {
        const p = e as unknown as Player;
        tickSurvival(this, p, TICK);
        checkPortalContact(this, p, TICK);
      } else if (te.tick) {
        e.savePrev();
        te.tick(this, TICK);
      }
    }
    tickPlates(this);
    for (const m of this.modules) m.tick?.(this);
    for (const e of this.entities.sweep()) for (const m of this.modules) m.onEntityRemoved?.(this, e);
  }

  /** Demande de voyage vers une autre dimension (traité par le client/serveur). */
  requestTravel(p: Player, dim: string, from: { x: number; y: number; z: number }, exact = false, portal?: string): void {
    if (exact) {
      this.emit({ t: 'dimension', to: p.id, dim, x: from.x, y: from.y, z: from.z, mode: 'exact' });
      return;
    }
    if (dim === 'astral') {
      p.lastSurface = { x: p.x, y: p.y, z: p.z };
      this.emit({ t: 'dimension', to: p.id, dim, x: 0, y: 100, z: 0, mode: 'altar' });
      return;
    }
    if (p.dim === 'astral') {
      const back = p.lastSurface ?? p.spawn ?? { x: 0, y: 100, z: 0 };
      this.emit({ t: 'dimension', to: p.id, dim: 'surface', x: back.x, y: back.y, z: back.z, mode: 'exact' });
      return;
    }
    // sans portail précisé (commande /dimension) : celui de la dimension visitée
    portal ??= PORTAL_KINDS.find((k) => k.dim === dim || k.dim === p.dim)?.id;
    const m = mapCoords(p.dim, dim, from.x, from.z);
    const y = dim === 'abime' ? Math.max(40, Math.min(100, from.y)) : dim === 'celeste' ? Math.max(90, Math.min(150, from.y + 30)) : Math.max(60, from.y);
    this.emit({ t: 'dimension', to: p.id, dim, x: m.x, y, z: m.z, mode: 'portal', portal });
  }

  /** Termine un voyage une fois la destination chargée ; renvoie la position finale. */
  completeTravel(p: Player, dim: string, x: number, y: number, z: number, mode: 'portal' | 'altar' | 'exact', portal?: string): { x: number; y: number; z: number } {
    let pos: { x: number; y: number; z: number };
    if (mode === 'portal') pos = buildArrivalPortal(this, dim, Math.floor(x), Math.floor(z), Math.floor(y), portalKind(portal));
    else if (mode === 'altar' && dim === 'astral') pos = buildAstralArrival(this);
    else {
      const w = this.world(dim);
      const t = w.content.blocks;
      let yy = Math.floor(y);
      // remonte jusqu'à un espace libre
      for (let k = 0; k < 200; k++) {
        const a = w.getId(Math.floor(x), yy, Math.floor(z)),
          b = w.getId(Math.floor(x), yy + 1, Math.floor(z));
        if (!t.solid[a] && !t.solid[b]) break;
        yy++;
      }
      // descend jusqu'au sol
      while (yy > 1 && !t.solid[w.getId(Math.floor(x), yy - 1, Math.floor(z))] && !t.liquid[w.getId(Math.floor(x), yy - 1, Math.floor(z))]) yy--;
      pos = { x, y: yy, z };
    }
    p.dim = dim;
    p.setPos(pos.x, pos.y, pos.z);
    p.body.vx = p.body.vy = p.body.vz = 0;
    p.body.fallDist = 0;
    p.portalCooldown = 6;
    this.trigger(p, 'dimension', { dim });
    return pos;
  }

  /** Entités issues de la génération (créatures des structures, animaux). */
  spawnFromGen?: (dim: string, e: { type: string; x: number; y: number; z: number; data?: Record<string, unknown> }) => void;
  /** Invocation d'une créature (commande /invoquer). */
  summon?: (type: string, dim: string, x: number, y: number, z: number) => boolean;
  /** Crée une créature et la renvoie (capacités de boss, structures). */
  spawnMob?: (type: string, dim: string, x: number, y: number, z: number) => Mob | null;
  /** Module des créatures (s'il est installé). */
  mobs?: MobSystem;

  /** Invocation d'un boss (remplacé par le module des créatures). */
  summonBoss: (creature: string, dim: string, x: number, y: number, z: number, by: Player) => boolean = () => false;

  /** Entités persistantes d'une colonne (sauvegarde). */
  persistentEntitiesIn(dim: string, cx: number, cz: number): Record<string, unknown>[] {
    const out: Record<string, unknown>[] = [];
    for (const e of this.entities.inChunk(dim, cx, cz)) {
      if (e.kind === 'player') continue;
      const s = (e as TickableEntity).serialize?.();
      if (s) out.push(s);
    }
    return out;
  }

  /** Retire (sans sauvegarde) les entités d'une colonne déchargée. */
  unloadEntitiesIn(dim: string, cx: number, cz: number): void {
    for (const e of this.entities.inChunk(dim, cx, cz)) if (e.kind !== 'player') e.removed = true;
  }

  /** Entité recréée depuis une sauvegarde (voir entityFactory). */
  entityFactory: ((sim: Sim, dim: string, d: Record<string, unknown>) => Entity | null) | null = null;

  restoreEntities(dim: string, list: unknown[]): void {
    for (const d of list) {
      const rec = d as Record<string, unknown>;
      let e: Entity | null = null;
      if (rec.type === 'item') {
        e = new ItemEntity(rec.stack as ItemStack);
        (e as ItemEntity).life = (rec.life as number) ?? 300;
      } else if (this.entityFactory) e = this.entityFactory(this, dim, rec);
      if (!e) continue;
      e.dim = dim;
      if (rec.type === 'item') e.setPos(rec.x as number, rec.y as number, rec.z as number);
      this.entities.add(e);
    }
  }
}
