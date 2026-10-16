/**
 * Structures de la Surface : villages, donjons, crypte antique, ruines, temple du désert,
 * hutte de sorcière, campements abandonnés (Drop 3) et sanctuaire englouti.
 *
 * Placement par grille de régions (comme l'espacement/séparation des jeux du genre) :
 * chaque région de `spacing` tronçons a au plus un point d'ancrage, tiré dans ses
 * `spacing - separation` premiers tronçons. Le plan complet d'une structure est calculé
 * une seule fois (fonctions pures de la graine et du relief), mis en cache, puis chaque
 * tronçon touché reconstruit seulement les morceaux qui le recouvrent.
 */
import { Rng, hash2 } from '../../util/random';
import type { ChunkWriter } from './writer';
import type { OverworldGenerator } from './overworld';
import type { GenOptions } from './terrain';
import { expand, overlaps, touches, type Box, type StructurePlan } from './structures/common';
import { planVillage, VILLAGE_RADIUS, VILLAGE_SHIFT } from './structures/village';
import { planDungeon, planCrypt, cryptSurface } from './structures/dungeon';
import { planRuins, planDesertTemple, planWitchHut, planCamp, TEMPLE_SHIFT } from './structures/surface';
import { planSanctuary } from './structures/sanctuary';

export type { StructurePlan } from './structures/common';

interface KindDef {
  key: string;
  /** Nom affiché (français). */
  name: string;
  aliases: string[];
  /** Taille d'une région, en tronçons. */
  spacing: number;
  /** Écart minimal entre deux ancrages de régions voisines, en tronçons. */
  separation: number;
  salt: number;
  /** Probabilité qu'une région tente de placer la structure. */
  chance: number;
  /** Rayon maximal (blocs) de la structure autour de son ancrage. */
  radius: number;
  /** Priorité d'exclusion des structures de surface (plus petit = prioritaire, -1 = aucune). */
  priority: number;
  enabled(o: GenOptions): boolean;
  plan(gen: OverworldGenerator, x: number, z: number, seed: number): StructurePlan | null;
  /** Emprise au sol utilisée pour l'exclusion (par défaut la boîte complète du plan). */
  surface?(plan: StructurePlan): Box;
}

const always = () => true;

const KINDS: KindDef[] = [
  { key: 'village', name: 'Village', aliases: ['village', 'villages'], spacing: 24, separation: 8, salt: 0x7111a6e, chance: 1, radius: VILLAGE_RADIUS + VILLAGE_SHIFT, priority: 0, enabled: always, plan: planVillage },
  { key: 'sanctuary', name: 'Sanctuaire englouti', aliases: ['sanctuaire', 'sanctuary', 'temple_englouti'], spacing: 28, separation: 8, salt: 0x5a9c7, chance: 1, radius: 16, priority: 1, enabled: always, plan: planSanctuary },
  { key: 'desert_temple', name: 'Temple du désert', aliases: ['temple', 'temple_desert', 'pyramide', 'desert_temple'], spacing: 20, separation: 6, salt: 0xde5e47, chance: 0.9, radius: 22 + TEMPLE_SHIFT, priority: 2, enabled: always, plan: planDesertTemple },
  { key: 'witch_hut', name: 'Hutte de sorcière', aliases: ['hutte', 'sorciere', 'sorcière', 'witch_hut'], spacing: 12, separation: 4, salt: 0x3a7c4, chance: 0.9, radius: 9, priority: 3, enabled: always, plan: planWitchHut },
  {
    key: 'crypt',
    name: 'Crypte antique',
    aliases: ['crypte', 'crypt', 'golem'],
    spacing: 44,
    separation: 12,
    salt: 0xc4e9,
    chance: 0.6,
    radius: 32,
    priority: 4,
    enabled: always,
    plan: planCrypt,
    surface: (p) => cryptSurface(p.x, p.z - 18),
  },
  { key: 'ruins', name: 'Ruines antiques', aliases: ['ruines', 'ruins', 'ruine'], spacing: 10, separation: 3, salt: 0x2b1e5, chance: 0.6, radius: 16, priority: 5, enabled: always, plan: planRuins },
  { key: 'camp', name: 'Campement abandonné', aliases: ['camp', 'campement'], spacing: 9, separation: 3, salt: 0xca4b, chance: 0.6, radius: 10, priority: 6, enabled: (o) => o.drop3, plan: planCamp },
  { key: 'dungeon', name: 'Donjon', aliases: ['donjon', 'dungeon', 'donjons'], spacing: 4, separation: 1, salt: 0xd0e6e0, chance: 0.75, radius: 24, priority: -1, enabled: always, plan: planDungeon },
];

/** Liste des structures (clé + nom français) pour /locate et l'interface. */
export const STRUCTURE_KINDS: ReadonlyArray<{ key: string; name: string }> = KINDS.map((k) => ({ key: k.key, name: k.name }));

/** Résout un nom saisi par le joueur (clé, nom ou alias) vers la clé de structure. */
export function structureKindKey(input: string): string | null {
  const s = input.trim().toLowerCase();
  for (const k of KINDS) if (k.key === s || k.name.toLowerCase() === s || k.aliases.includes(s)) return k.key;
  return null;
}

// ------------------------------------------------------------------ cache des plans

const CACHE_LIMIT = 384;
const caches = new WeakMap<OverworldGenerator, Map<string, StructurePlan | null>>();

function planFor(gen: OverworldGenerator, def: KindDef, rx: number, rz: number): StructurePlan | null {
  let cache = caches.get(gen);
  if (!cache) {
    cache = new Map();
    caches.set(gen, cache);
  }
  const key = def.key + ':' + rx + ',' + rz;
  const hit = cache.get(key);
  if (hit !== undefined) {
    // LRU : remet l'entrée en fin de file.
    cache.delete(key);
    cache.set(key, hit);
    return hit;
  }
  const plan = computePlan(gen, def, rx, rz);
  cache.set(key, plan);
  if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value as string);
  return plan;
}

function computePlan(gen: OverworldGenerator, def: KindDef, rx: number, rz: number): StructurePlan | null {
  const rng = new Rng(hash2(gen.opts.seed ^ def.salt, rx, rz));
  if (rng.next() >= def.chance) return null;
  const span = def.spacing - def.separation;
  const cx = rx * def.spacing + rng.int(0, span - 1);
  const cz = rz * def.spacing + rng.int(0, span - 1);
  const x = cx * 16 + rng.int(0, 15);
  const z = cz * 16 + rng.int(0, 15);
  const seed = Math.floor(rng.next() * 0xffffffff) >>> 0;
  const plan = def.plan(gen, x, z, seed);
  if (!plan) return null;
  // Garde-fou : un plan qui dépasse son rayon serait coupé net entre tronçons.
  const b = plan.box;
  if (b.x0 < x - def.radius || b.x1 > x + def.radius || b.z0 < z - def.radius || b.z1 > z + def.radius) return null;
  if (def.priority > 0 && blockedByHigher(gen, def, def.surface ? def.surface(plan) : plan.box)) return null;
  return plan;
}

/** Vrai si une structure de surface plus prioritaire occupe déjà la zone. */
function blockedByHigher(gen: OverworldGenerator, def: KindDef, area: Box): boolean {
  const a = expand(area, 6);
  for (const other of KINDS) {
    if (other.priority < 0 || other.priority >= def.priority || !other.enabled(gen.opts)) continue;
    const S = other.spacing * 16;
    const r = other.radius;
    for (let rz = Math.floor((a.z0 - r) / S); rz <= Math.floor((a.z1 + r) / S); rz++)
      for (let rx = Math.floor((a.x0 - r) / S); rx <= Math.floor((a.x1 + r) / S); rx++) {
        const p = planFor(gen, other, rx, rz);
        if (p && overlaps(a, other.surface ? other.surface(p) : p.box)) return true;
      }
  }
  return false;
}

// ------------------------------------------------------------------ génération

/** Écrit dans le tronçon toutes les structures qui le recouvrent (appelé une fois par tronçon). */
export function generateStructures(w: ChunkWriter, gen: OverworldGenerator): void {
  for (const def of KINDS) {
    if (!def.enabled(gen.opts)) continue;
    const S = def.spacing * 16;
    const r = def.radius;
    const rx0 = Math.floor((w.x0 - r) / S);
    const rx1 = Math.floor((w.x0 + 15 + r) / S);
    const rz0 = Math.floor((w.z0 - r) / S);
    const rz1 = Math.floor((w.z0 + 15 + r) / S);
    for (let rz = rz0; rz <= rz1; rz++)
      for (let rx = rx0; rx <= rx1; rx++) {
        const plan = planFor(gen, def, rx, rz);
        if (!plan || !touches(w, plan.box)) continue;
        for (const piece of plan.pieces) if (touches(w, piece.box)) piece.build(w);
        for (const m of plan.markers) w.mark(m);
      }
  }
}

// ------------------------------------------------------------------ recherche

function structuresAllowed(gen: OverworldGenerator): boolean {
  return gen.opts.structures && gen.opts.template !== 'flat';
}

/**
 * Structure la plus proche de (x, z) dans un rayon maxDist (blocs), ou null.
 * Utilisable sur le fil principal : créer un OverworldGenerator avec les options du monde.
 */
export function locateStructure(gen: OverworldGenerator, kind: string, x: number, z: number, maxDist: number): { x: number; y: number; z: number } | null {
  const key = structureKindKey(kind) ?? kind;
  const def = KINDS.find((k) => k.key === key);
  if (!def || !structuresAllowed(gen) || !def.enabled(gen.opts)) return null;
  const S = def.spacing * 16;
  const rx0 = Math.floor(x / S);
  const rz0 = Math.floor(z / S);
  const maxRing = Math.ceil(maxDist / S) + 1;
  let best: StructurePlan | null = null;
  let bestD = Infinity;
  for (let ring = 0; ring <= maxRing; ring++) {
    // Les régions de cet anneau sont au moins à (ring - 1) * S blocs.
    if (best && (ring - 1) * S > bestD) break;
    for (let dz = -ring; dz <= ring; dz++)
      for (let dx = -ring; dx <= ring; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== ring) continue;
        const p = planFor(gen, def, rx0 + dx, rz0 + dz);
        if (!p) continue;
        const d = Math.hypot(p.x - x, p.z - z);
        if (d < bestD) {
          bestD = d;
          best = p;
        }
      }
  }
  return best && bestD <= maxDist ? { x: best.x, y: best.y, z: best.z } : null;
}

/** Plans complets (avec leurs pièces) dont l'ancrage est dans le rectangle — pour les outils de vérification. */
export function structurePlansIn(gen: OverworldGenerator, x0: number, z0: number, x1: number, z1: number, kinds?: string[]): StructurePlan[] {
  const out: StructurePlan[] = [];
  if (!structuresAllowed(gen)) return out;
  for (const def of KINDS) {
    if (!def.enabled(gen.opts) || (kinds && !kinds.includes(def.key))) continue;
    const S = def.spacing * 16;
    for (let rz = Math.floor(z0 / S); rz <= Math.floor(z1 / S); rz++)
      for (let rx = Math.floor(x0 / S); rx <= Math.floor(x1 / S); rx++) {
        const p = planFor(gen, def, rx, rz);
        if (p && p.x >= x0 && p.x <= x1 && p.z >= z0 && p.z <= z1) out.push(p);
      }
  }
  return out;
}

/** Structures dont l'ancrage est dans le rectangle donné (cartes, outils de vérification). */
export function listStructures(gen: OverworldGenerator, x0: number, z0: number, x1: number, z1: number, kinds?: string[]): Array<{ kind: string; name: string; x: number; y: number; z: number }> {
  const names = new Map(KINDS.map((k) => [k.key, k.name]));
  return structurePlansIn(gen, x0, z0, x1, z1, kinds).map((p) => ({ kind: p.kind, name: names.get(p.kind) ?? p.kind, x: p.x, y: p.y, z: p.z }));
}
