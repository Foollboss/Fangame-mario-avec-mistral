/**
 * Structures des dimensions : forteresse des braises et ruines (Terres de braise), temple céleste,
 * autels et jardins flottants (Royaume céleste).
 *
 * Les plans sont des fonctions pures de la graine, calculés une fois par région puis gardés dans
 * un petit cache ; chaque tronçon ne construit que les colonnes qui lui appartiennent.
 */
import type { ChunkWriter } from './writer';
import type { EmberGenerator, SkyGenerator } from './otherDims';
import { Lru, buildPlan, planOverlaps, type Box, type DimPlan } from './dim/kit';
import { FORTRESS_REGION, FORTRESS_REACH, fortressSite, fortressPlan, type FortressSite } from './dim/fortress';
import { RUIN_CELL, RUIN_REACH, emberRuinPlan } from './dim/emberRuins';
import { TEMPLE_REGION, TEMPLE_REACH, templeSite, templePlan, type TempleSite } from './dim/skyTemple';
import { SHRINE_CELL, SHRINE_REACH, skyShrinePlan } from './dim/skyShrines';

interface EmberState {
  sites: Lru<FortressSite>;
  plans: Lru<DimPlan>;
  ruins: Lru<DimPlan | null>;
}

interface SkyState {
  sites: Lru<TempleSite>;
  plans: Lru<DimPlan>;
  shrines: Lru<DimPlan | null>;
}

const EMBER = new WeakMap<EmberGenerator, EmberState>();
const SKY = new WeakMap<SkyGenerator, SkyState>();

function emberState(g: EmberGenerator): EmberState {
  let s = EMBER.get(g);
  if (!s) {
    s = { sites: new Lru(256), plans: new Lru(24), ruins: new Lru(512) };
    EMBER.set(g, s);
  }
  return s;
}

function skyState(g: SkyGenerator): SkyState {
  let s = SKY.get(g);
  if (!s) {
    s = { sites: new Lru(256), plans: new Lru(24), shrines: new Lru(512) };
    SKY.set(g, s);
  }
  return s;
}

const rk = (rx: number, rz: number): string => rx + ',' + rz;

function fortSiteOf(g: EmberGenerator, rx: number, rz: number): FortressSite {
  return emberState(g).sites.get(rk(rx, rz), () => fortressSite(g, rx, rz));
}

function fortPlanOf(g: EmberGenerator, rx: number, rz: number): DimPlan {
  return emberState(g).plans.get(rk(rx, rz), () => fortressPlan(g, fortSiteOf(g, rx, rz)));
}

function templeSiteOf(g: SkyGenerator, rx: number, rz: number): TempleSite {
  return skyState(g).sites.get(rk(rx, rz), () => templeSite(g, rx, rz));
}

function templePlanOf(g: SkyGenerator, rx: number, rz: number): DimPlan {
  return skyState(g).plans.get(rk(rx, rz), () => templePlan(g, templeSiteOf(g, rx, rz)));
}

/** Appelle fn pour chaque région (ou cellule) dont la structure peut atteindre la boîte. */
function forRegions(b: Box, size: number, reach: number, fn: (rx: number, rz: number) => void): void {
  const rx0 = Math.floor((b.x0 - reach) / size);
  const rx1 = Math.floor((b.x1 + reach) / size);
  const rz0 = Math.floor((b.z0 - reach) / size);
  const rz1 = Math.floor((b.z1 + reach) / size);
  for (let rz = rz0; rz <= rz1; rz++) for (let rx = rx0; rx <= rx1; rx++) fn(rx, rz);
}

function chunkBox(w: ChunkWriter): Box {
  return { x0: w.x0, z0: w.z0, x1: w.x0 + 15, z1: w.z0 + 15 };
}

// ------------------------------------------------------------------ Terres de braise

export function generateEmberStructures(w: ChunkWriter, g: EmberGenerator): void {
  const cb = chunkBox(w);
  const st = emberState(g);
  // Cuvettes de lave de toutes les forteresses voisines, puis ruines, puis forteresses.
  const forts: DimPlan[] = [];
  forRegions(cb, FORTRESS_REGION, FORTRESS_REACH, (rx, rz) => {
    const p = fortPlanOf(g, rx, rz);
    if (w.touches(p.box.x0, p.box.z0, p.box.x1, p.box.z1)) forts.push(p);
  });
  for (const p of forts) buildPlan(w, p, 0);
  const blocked = (b: Box): boolean => {
    let hit = false;
    forRegions(b, FORTRESS_REGION, FORTRESS_REACH, (rx, rz) => {
      if (!hit && planOverlaps(fortPlanOf(g, rx, rz), b, 6)) hit = true;
    });
    return hit;
  };
  forRegions(cb, RUIN_CELL, RUIN_REACH, (ix, iz) => {
    const plan = st.ruins.get(rk(ix, iz), () => emberRuinPlan(g, ix, iz, blocked));
    if (plan) buildPlan(w, plan);
  });
  for (const p of forts) buildPlan(w, p, 1);
}

// ------------------------------------------------------------------ Royaume céleste

export function generateSkyStructures(w: ChunkWriter, g: SkyGenerator): void {
  const cb = chunkBox(w);
  const st = skyState(g);
  const blocked = (b: Box): boolean => {
    let hit = false;
    forRegions(b, TEMPLE_REGION, TEMPLE_REACH, (rx, rz) => {
      if (!hit && planOverlaps(templePlanOf(g, rx, rz), b, 10)) hit = true;
    });
    return hit;
  };
  forRegions(cb, SHRINE_CELL, SHRINE_REACH, (ix, iz) => {
    const plan = st.shrines.get(rk(ix, iz), () => skyShrinePlan(g, ix, iz, blocked));
    if (plan) buildPlan(w, plan);
  });
  forRegions(cb, TEMPLE_REGION, TEMPLE_REACH, (rx, rz) => buildPlan(w, templePlanOf(g, rx, rz)));
}

// ------------------------------------------------------------------ localisation

/**
 * Structure majeure la plus proche de (x, z) dans un rayon `maxDist` (blocs) :
 * 'fortress' pour les Terres de braise, 'sky_temple' pour le Royaume céleste.
 * Renvoie le centre de l'arène, ou null (rien dans le rayon, ou mauvaise dimension).
 */
export function locateDimStructure(g: EmberGenerator | SkyGenerator, kind: 'fortress' | 'sky_temple', x: number, z: number, maxDist: number): { x: number; z: number } | null {
  const sky = 'islandAt' in g;
  if ((kind === 'sky_temple') !== sky || !(maxDist >= 0)) return null;
  const size = sky ? TEMPLE_REGION : FORTRESS_REGION;
  const site = (rx: number, rz: number): { x: number; z: number } => (sky ? templeSiteOf(g as SkyGenerator, rx, rz) : fortSiteOf(g as EmberGenerator, rx, rz));
  const crx = Math.floor(x / size);
  const crz = Math.floor(z / size);
  const maxRing = Math.min(64, Math.ceil(Math.max(0, maxDist) / size) + 1);
  let best: { x: number; z: number } | null = null;
  let bestD2 = maxDist * maxDist;
  // Recherche par anneaux de régions : on s'arrête dès qu'aucune région plus lointaine ne peut faire mieux.
  for (let ring = 0; ring <= maxRing; ring++) {
    for (let dz = -ring; dz <= ring; dz++)
      for (let dx = -ring; dx <= ring; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== ring) continue;
        const s = site(crx + dx, crz + dz);
        const d2 = (s.x - x) * (s.x - x) + (s.z - z) * (s.z - z);
        if (d2 <= bestD2) {
          bestD2 = d2;
          best = { x: s.x, z: s.z };
        }
      }
    const minNext = ring * size;
    if (best && minNext * minNext > bestD2) break;
    if (minNext > maxDist) break;
  }
  return best;
}
