/**
 * Système des créatures : apparition naturelle (plafonds par catégorie,
 * règles data-driven : surface/grotte/eau/air/lave, lumière, heure, biome,
 * dimension, groupes), disparition des créatures lointaines, foyers maudits
 * (générateurs des donjons), invocations, boss (barre de vie, messages),
 * butin à la mort et restauration depuis les sauvegardes.
 */
import type { Sim, SimModule } from './sim';
import type { World } from '../world/world';
import type { Entity } from '../entity/entity';
import type { CreatureDef } from '../registry/types';
import type { Player } from '../entity/player';
import { Mob } from '../entity/mob';
import { Grave } from '../entity/grave';
import { BIOMES } from '../worldgen/biomes';
import { LIQ_WATER, LIQ_LAVA, Shape } from '../registry/blocks';
import type { ItemStack } from '../inventory/inventory';
import { tr } from '../i18n/i18n';

type SpawnRule = NonNullable<CreatureDef['spawn']>[number];
type Group = 'hostile' | 'passive' | 'water' | 'air';

/** Plafonds par joueur (créatures dans un rayon de 96 blocs). */
const CAPS: Record<Group, number> = { hostile: 28, passive: 12, water: 6, air: 6 };
const SPAWN_MIN = 22;
const SPAWN_MAX = 60;
const DESPAWN_FAR = 128;
const DESPAWN_SOFT = 44;

function groupOf(def: CreatureDef, rule: SpawnRule): Group {
  if (rule.where === 'water' || def.movement === 'swim') return 'water';
  if (def.category === 'hostile') return 'hostile';
  if (rule.where === 'air' && def.category !== 'passive') return 'air';
  return 'passive';
}

export class MobSystem implements SimModule {
  private bosses = new Set<Mob>();
  private spawnerTimer = 0;
  private lootDone = new WeakSet<Mob>();

  constructor(private sim: Sim) {}

  // ------------------------------------------------------------------ création
  create(type: string, dim: string, x: number, y: number, z: number): Mob | null {
    const def = this.sim.content.creatures.get(type);
    if (!def) return null;
    const m = new Mob(def);
    m.dim = dim;
    m.setPos(x, y, z);
    m.yaw = m.bodyYaw = this.sim.rng.float(0, Math.PI * 2);
    m.home = { x, y, z };
    this.sim.entities.add(m);
    if (def.category === 'boss' || def.bossBar) this.bosses.add(m);
    return m;
  }

  summonBoss(type: string, dim: string, x: number, y: number, z: number, by: Player): boolean {
    const sim = this.sim;
    const def = sim.content.creatures.get(type);
    if (!def) return false;
    for (const b of this.bosses) {
      if (!b.dead && !b.removed && b.dim === dim && b.distTo(x, y, z) < 96) {
        sim.emit({ t: 'msg', text: tr('{name} est déjà éveillé !'), args: { name: b.displayName }, color: '#ff9a5a', to: by.id });
        return false;
      }
    }
    if (sim.difficulty === 0) {
      sim.emit({ t: 'msg', text: tr('Les gardiens dorment en mode paisible.'), color: '#ffd080', to: by.id });
      return false;
    }
    const m = this.create(type, dim, x, y, z);
    if (!m) return false;
    m.persistent = true;
    m.target = by;
    m.invuln = 2;
    sim.emit({ t: 'msg', text: tr('{name} s’éveille !'), args: { name: def.name }, color: '#ff7a4a' });
    sim.emit({ t: 'sound', id: 'boss_apparait', x, y, z, vol: 1 });
    sim.emit({ t: 'shake', amount: 1 });
    sim.emit({ t: 'particles', kind: 'portail', x, y: y + 1, z, n: 60, spread: 2.5 });
    sim.emit({ t: 'lightning', x, y, z });
    this.bossBar(m);
    return true;
  }

  private bossBar(m: Mob, gone = false): void {
    const phases = m.def.phases?.length ?? 0;
    this.sim.emit({ t: 'boss', id: m.id, name: m.displayName, hp: m.health, max: m.maxHealth, phase: Math.min(m.phase, phases), gone });
  }

  // ------------------------------------------------------------------ cycle
  tick(sim: Sim): void {
    // Morts : butin, statistiques, boss
    for (const e of sim.entities.list) {
      if (e.kind !== 'mob') continue;
      const m = e as Mob;
      if (m.dead && !this.lootDone.has(m)) {
        this.lootDone.add(m);
        this.onMobDeath(m);
      }
    }
    if (sim.tickCount % 10 === 0) {
      for (const b of [...this.bosses]) {
        if (b.removed || b.dead) {
          this.bosses.delete(b);
          if (!b.dead) this.bossBar(b, true);
          continue;
        }
        if (sim.players.some((p) => p.dim === b.dim && p.distTo(b.x, b.y, b.z) < 80)) this.bossBar(b);
      }
    }
    if (sim.tickCount % 20 === 0) {
      this.despawn();
      if (sim.rules.mobSpawning) for (const p of sim.players) if (!p.dead && !p.spectator) this.naturalSpawn(p);
    }
    if (++this.spawnerTimer >= 10) {
      this.spawnerTimer = 0;
      this.tickSpawners();
    }
  }

  private onMobDeath(m: Mob): void {
    const sim = this.sim;
    m.dropLoot(sim);
    sim.emit({ t: 'particles', kind: 'fumee', x: m.x, y: m.y + m.body.h * 0.5, z: m.z, n: 12, spread: m.body.hw * 2 + 0.3 });
    const killer = m.lastAttacker && m.lastAttackerTime < 5 && m.lastAttacker.kind === 'player' ? (m.lastAttacker as unknown as Player) : null;
    if (m.def.category === 'boss') {
      this.bossBar(m, true);
      this.bosses.delete(m);
      sim.emit({ t: 'msg', text: tr('{name} a été vaincu !'), args: { name: m.displayName }, color: '#ffd24a' });
      sim.emit({ t: 'sound', id: 'boss_vaincu', x: m.x, y: m.y, z: m.z, vol: 1 });
      sim.emit({ t: 'particles', kind: 'etoile', x: m.x, y: m.y + 1.5, z: m.z, n: 50, spread: 3 });
      for (const p of sim.players) {
        if (p.dim !== m.dim || p.distTo(m.x, m.y, m.z) > 96) continue;
        p.stat('boss_vaincus');
        if (p !== killer) sim.trigger(p, 'kill', { creature: m.type });
      }
    }
    // Mort sans coup direct (lave, chute provoquée…) : le dernier assaillant est crédité
    if (killer && m.lastDamage && m.lastDamage.type !== 'melee' && m.lastDamage.type !== 'projectile') {
      killer.stat('creatures_tuees');
      sim.trigger(killer, 'kill', { creature: m.type });
    }
  }

  // ------------------------------------------------------------------ disparition
  private despawn(): void {
    const sim = this.sim;
    for (const e of sim.entities.list) {
      if (e.kind !== 'mob' || e.removed) continue;
      const m = e as Mob;
      if (m.dead) continue;
      if (sim.difficulty === 0 && m.hostile && m.def.category !== 'boss') {
        m.removed = true;
        continue;
      }
      if (m.persistent) continue;
      let near = Infinity;
      for (const p of sim.players) if (p.dim === m.dim) near = Math.min(near, p.distTo(m.x, m.y, m.z));
      if (near > DESPAWN_FAR) m.removed = true;
      else if (near > DESPAWN_SOFT && m.target === null && sim.rng.chance(1 / 30)) m.removed = true;
    }
  }

  // ------------------------------------------------------------------ apparitions
  private counts(p: Player): Record<Group, number> {
    const c: Record<Group, number> = { hostile: 0, passive: 0, water: 0, air: 0 };
    for (const e of this.sim.entities.list) {
      if (e.kind !== 'mob' || e.removed || e.dim !== p.dim) continue;
      const m = e as Mob;
      if (Math.abs(m.x - p.x) > 96 || Math.abs(m.z - p.z) > 96) continue;
      const rule = m.def.spawn?.[0];
      if (!rule) {
        if (m.hostile) c.hostile++;
        continue;
      }
      c[groupOf(m.def, rule)]++;
    }
    return c;
  }

  private naturalSpawn(p: Player): void {
    const sim = this.sim;
    const w = sim.world(p.dim);
    const counts = this.counts(p);
    const peaceful = sim.difficulty === 0;
    // Chaque seconde : quelques tentatives par groupe non saturé
    // Îles célestes : monde paisible, peu d'hostiles (zéphyrins)
    const calm = p.dim === 'celeste';
    for (const g of ['hostile', 'passive', 'water', 'air'] as Group[]) {
      if (counts[g] >= (calm && g === 'hostile' ? 4 : CAPS[g])) continue;
      if (g === 'hostile' && peaceful) continue;
      if (g === 'hostile' && calm && !sim.rng.chance(0.2)) continue;
      // les animaux apparaissent rarement (ils restent)
      if (g === 'passive' && !sim.rng.chance(0.12)) continue;
      const attempts = g === 'hostile' ? 3 : 1;
      for (let a = 0; a < attempts; a++) {
        const ang = sim.rng.float(0, Math.PI * 2);
        const d = sim.rng.float(SPAWN_MIN, SPAWN_MAX);
        const x = Math.floor(p.x + Math.cos(ang) * d),
          z = Math.floor(p.z + Math.sin(ang) * d);
        if (!w.isLoaded(x, z)) continue;
        const biome = BIOMES[w.biomeAt(x, z)]?.id ?? '';
        // Règles candidates
        const cands: { def: CreatureDef; rule: SpawnRule; weight: number }[] = [];
        for (const def of sim.content.creatures.values()) {
          for (const rule of def.spawn ?? []) {
            if (rule.dimension !== p.dim || groupOf(def, rule) !== g) continue;
            if (rule.biomes && !rule.biomes.includes(biome)) continue;
            if (rule.time === 'night' && !sim.env.isNight && p.dim === 'surface') continue;
            if (rule.time === 'day' && sim.env.isNight && p.dim === 'surface') continue;
            cands.push({ def, rule, weight: rule.weight ?? 1 });
          }
        }
        if (!cands.length) continue;
        const pick = sim.rng.weighted(cands);
        const n = sim.rng.range(pick.rule.group?.[0] ?? 1, pick.rule.group?.[1] ?? 1);
        let placed = 0;
        for (let i = 0; i < n * 3 && placed < n; i++) {
          const gx = x + (i === 0 ? 0 : sim.rng.range(-4, 4)),
            gz = z + (i === 0 ? 0 : sim.rng.range(-4, 4));
          const y = this.findSpot(w, pick.def, pick.rule, gx, gz, p);
          if (y === null) continue;
          // trop près d'un joueur ?
          if (sim.players.some((pl) => pl.dim === p.dim && pl.distTo(gx + 0.5, y, gz + 0.5) < SPAWN_MIN - 4)) continue;
          const m = this.create(pick.def.id, p.dim, gx + 0.5, y, gz + 0.5);
          if (m) {
            m.group = hashGroup(x, z);
            placed++;
          }
        }
        if (placed) counts[g] += placed;
      }
    }
  }

  /** Lumière effective (bloc + ciel assombri par l'heure) pour les apparitions. */
  private lightAt(w: World, x: number, y: number, z: number): number {
    const sky = w.skyLight(x, y, z);
    const darken = w.dim === 'surface' ? this.sim.env.skyDarken : 0;
    return Math.max(w.blockLight(x, y, z), sky - darken);
  }

  private findSpot(w: World, def: CreatureDef, rule: SpawnRule, x: number, z: number, p: Player): number | null {
    if (!w.isLoaded(x, z)) return null;
    const t = w.content.blocks;
    const h = Math.ceil(def.size[1]);
    const free = (y: number): boolean => {
      for (let k = 0; k < h; k++) {
        const id = w.getId(x, y + k, z);
        if (t.solid[id] || t.liquid[id]) return false;
      }
      return true;
    };
    const floorOk = (y: number): boolean => {
      const id = w.getId(x, y - 1, z);
      if (!t.solid[id] || t.damage[id] > 0) return false;
      const sh = t.shape[id];
      if (sh === Shape.FENCE || sh === Shape.WALL) return false;
      // pas sur le feuillage ni le verre
      return !!t.opaque[id] || sh === Shape.SLAB || sh === Shape.STAIRS;
    };
    const light = rule.light ?? [0, 15];
    const lightOk = (y: number): boolean => {
      const l = this.lightAt(w, x, y, z);
      return l >= light[0] && l <= light[1];
    };
    const inY = (y: number): boolean => (rule.minY === undefined || y >= rule.minY) && (rule.maxY === undefined || y <= rule.maxY);
    const where = rule.where ?? 'surface';
    const top = w.heightAt(x, z);
    const rng = this.sim.rng;
    switch (where) {
      case 'surface': {
        if (w.dim === 'abime') {
          // dimension couverte : un sol quelconque sous le plafond
          const start = Math.min(120, Math.floor(p.y) + rng.range(-12, 16));
          for (let y = start; y > 32; y--) if (free(y) && floorOk(y) && inY(y) && lightOk(y)) return y;
          return null;
        }
        for (let y = top + 1; y > Math.max(1, top - 6); y--) {
          if (!free(y) || !floorOk(y) || !inY(y)) continue;
          if (w.skyLight(x, y, z) < 12) return null; // pas à ciel ouvert
          return lightOk(y) ? y : null;
        }
        return null;
      }
      case 'cave': {
        const lim = Math.max(8, top - 6);
        const start = rng.range(4, lim);
        for (let y = start; y > 3; y--) {
          if (!free(y) || !floorOk(y) || !inY(y)) continue;
          if (w.skyLight(x, y, z) > 2) return null;
          return lightOk(y) ? y : null;
        }
        return null;
      }
      case 'water': {
        let y = top;
        for (let k = 0; k < 20 && y > 2; k++, y--) {
          const id = w.getId(x, y, z);
          if (t.liquid[id] === LIQ_WATER && t.liquid[w.getId(x, y - 1, z)] === LIQ_WATER) return inY(y - 1) ? y - 1 : null;
          if (t.solid[id]) break;
        }
        return null;
      }
      case 'lava': {
        for (let y = 20; y < 60; y++) {
          if (t.liquid[w.getId(x, y, z)] === LIQ_LAVA && w.getId(x, y + 1, z) === 0 && w.getId(x, y + 2, z) === 0) return y + 0.6;
        }
        return null;
      }
      case 'air': {
        if (w.dim === 'astral') {
          const y = rng.range(40, 150);
          for (let k = -3; k <= 3; k++) if (!free(y + k)) return null;
          return y;
        }
        if (w.dim === 'celeste') {
          const y = rng.range(60, 180);
          for (let k = -2; k <= 2; k++) if (!free(y + k)) return null;
          return y;
        }
        if (w.dim === 'abime') {
          const y = rng.range(40, 110);
          return free(y) && free(y + 2) && lightOk(y) ? y : null;
        }
        const y = top + rng.range(6, 18);
        return free(y) && lightOk(y) && inY(y) ? y : null;
      }
      default: {
        for (let y = top + 1; y > 2; y--) if (free(y) && floorOk(y) && lightOk(y)) return y;
        return null;
      }
    }
  }

  // ------------------------------------------------------------------ foyers maudits
  private tickSpawners(): void {
    const sim = this.sim;
    if (sim.difficulty === 0 || !sim.rules.mobSpawning) return;
    const seen = new Set<string>();
    for (const p of sim.players) {
      if (p.dead || p.spectator) continue;
      const w = sim.world(p.dim);
      const pcx = Math.floor(p.x) >> 4,
        pcz = Math.floor(p.z) >> 4;
      for (let dx = -1; dx <= 1; dx++)
        for (let dz = -1; dz <= 1; dz++) {
          const c = w.getChunk(pcx + dx, pcz + dz);
          if (!c || c.blockEntities.size === 0) continue;
          for (const [k, be] of c.blockEntities) {
            if (be.type !== 'spawner') continue;
            const lx = k & 15,
              lz = (k >> 4) & 15,
              y = k >> 8;
            const x = c.cx * 16 + lx,
              z = c.cz * 16 + lz;
            const id = `${p.dim}:${x},${y},${z}`;
            if (seen.has(id)) continue;
            seen.add(id);
            if (!sim.players.some((pl) => pl.dim === p.dim && !pl.creative && pl.distTo(x + 0.5, y, z + 0.5) < 16)) continue;
            be.delay = ((be.delay as number) ?? 10) - 0.5;
            if (Math.random() < 0.3) sim.emit({ t: 'particles', kind: 'flamme', x: x + 0.5, y: y + 0.9, z: z + 0.5, n: 2, spread: 0.6 });
            if ((be.delay as number) > 0) continue;
            be.delay = 10 + sim.rng.float(0, 20);
            const creature = String(be.creature ?? 'rodeur');
            const near = sim.entities.count(p.dim, (e) => e.kind === 'mob' && (e as Mob).type === creature && Math.abs(e.x - x) < 9 && Math.abs(e.z - z) < 9 && Math.abs(e.y - y) < 5);
            if (near >= 6) continue;
            const n = sim.rng.range(1, 3);
            for (let i = 0; i < n; i++) {
              const sx = x + sim.rng.range(-3, 3),
                sz = z + sim.rng.range(-3, 3);
              for (let sy = y + 1; sy >= y - 1; sy--) {
                const t = w.content.blocks;
                if (!t.solid[w.getId(sx, sy - 1, sz)] || t.solid[w.getId(sx, sy, sz)] || t.solid[w.getId(sx, sy + 1, sz)]) continue;
                const m = this.create(creature, p.dim, sx + 0.5, sy, sz + 0.5);
                if (m) {
                  m.home = { x: x + 0.5, y, z: z + 0.5 };
                  sim.emit({ t: 'particles', kind: 'fumee', x: sx + 0.5, y: sy + 1, z: sz + 0.5, n: 10, spread: 0.8 });
                }
                break;
              }
            }
          }
        }
    }
  }

  // ------------------------------------------------------------------ sauvegardes
  restore(dim: string, d: Record<string, unknown>): Entity | null {
    if (d.type === 'mob') {
      const def = this.sim.content.creatures.get(String(d.creature));
      if (!def) return null;
      const m = new Mob(def);
      m.dim = dim;
      m.setPos(d.x as number, d.y as number, d.z as number);
      m.yaw = m.bodyYaw = (d.yaw as number) ?? 0;
      if (typeof d.health === 'number') m.health = Math.max(1, Math.min(m.maxHealth, d.health));
      m.home = (d.home as Mob['home']) ?? null;
      m.data = (d.data as Record<string, unknown>) ?? {};
      m.persistent = true;
      if (def.category === 'boss' || def.bossBar) this.bosses.add(m);
      return m;
    }
    if (d.type === 'grave') {
      const g = new Grave(String(d.owner ?? '?'), (d.items as ItemStack[]) ?? []);
      g.dim = dim;
      g.setPos(d.x as number, d.y as number, d.z as number);
      return g;
    }
    return null;
  }
}

function hashGroup(x: number, z: number): number {
  return (((x * 73856093) ^ (z * 19349663)) >>> 0) % 100000;
}

export function installMobs(sim: Sim): MobSystem {
  const sys = new MobSystem(sim);
  sim.modules.push(sys);
  sim.mobs = sys;
  sim.entityFactory = (s, dim, d) => sys.restore(dim, d);
  sim.spawnMob = (type, dim, x, y, z) => sys.create(type, dim, x, y, z);
  sim.summon = (type, dim, x, y, z) => !!sys.create(type, dim, x, y, z);
  sim.summonBoss = (type, dim, x, y, z, by) => sys.summonBoss(type, dim, x, y, z, by);
  sim.spawnFromGen = (dim, e) => {
    const m = sys.create(e.type, dim, e.x, e.y, e.z);
    if (m) {
      m.persistent = true;
      if (e.data) Object.assign(m.data, e.data);
    }
  };
  return sys;
}
