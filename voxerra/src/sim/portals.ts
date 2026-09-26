/**
 * Voyages entre dimensions : cadres de pierres runiques allumés à l'étincelle
 * de braise (Surface ↔ Abîme, échelle 1:4), cadres de pierres d'aurore allumés
 * à la plume d'azur (Surface ↔ Îles célestes, 1:1), autels astraux
 * (Surface ↔ Cimes), construction des portails d'arrivée.
 */
import type { Sim } from './sim';
import type { World } from '../world/world';
import type { Player } from '../entity/player';
import { makeCell } from '../registry/blocks';
import { DIMENSION_INFO, type DimensionId } from '../worldgen/generator';

/** Portails à cadre : même forme (rectangle de 2×3 à 21×21 à l'intérieur), blocs propres à chaque dimension. */
export interface PortalKind {
  id: string;
  dim: DimensionId;
  frame: string;
  veil: string;
  /** Sol de la plate-forme d'arrivée, par dimension de destination. */
  floor: Partial<Record<DimensionId, string>>;
}

export const PORTAL_KINDS: PortalKind[] = [
  { id: 'abime', dim: 'abime', frame: 'pierre_runique', veil: 'voile_abime', floor: { abime: 'basalte_poli', surface: 'pierre_taillee' } },
  { id: 'celeste', dim: 'celeste', frame: 'pierre_aurore', veil: 'voile_celeste', floor: { celeste: 'pierre_celeste', surface: 'pierre_taillee' } },
];

export const portalKind = (id: string | undefined): PortalKind => PORTAL_KINDS.find((k) => k.id === id) ?? PORTAL_KINDS[0];

/** Tente d'allumer un portail dont (x,y,z) est une case intérieure. */
export function tryIgnitePortal(sim: Sim, w: World, x: number, y: number, z: number, kindId = 'abime'): boolean {
  const t = w.content.blocks;
  const kind = portalKind(kindId);
  const frame = t.tryNum(kind.frame);
  const portal = t.tryNum(kind.veil);
  const inside = (xx: number, yy: number, zz: number) => {
    const id = w.getId(xx, yy, zz);
    return id === 0 || (t.replaceable[id] === 1 && !t.solid[id] && !t.liquid[id]);
  };
  if (!inside(x, y, z)) return false;
  for (const axis of [0, 1]) {
    const ax = axis === 0 ? 1 : 0,
      az = axis === 0 ? 0 : 1;
    let y0 = y;
    while (y0 > y - 22 && inside(x, y0 - 1, z)) y0--;
    if (w.getId(x, y0 - 1, z) !== frame) continue;
    let a0 = 0;
    while (a0 > -22 && inside(x + (a0 - 1) * ax, y0, z + (a0 - 1) * az)) a0--;
    let a1 = 0;
    while (a1 < 22 && inside(x + (a1 + 1) * ax, y0, z + (a1 + 1) * az)) a1++;
    const width = a1 - a0 + 1;
    if (width < 2 || width > 21) continue;
    let y1 = y0;
    while (y1 < y0 + 22 && inside(x + a0 * ax, y1 + 1, z + a0 * az)) y1++;
    const height = y1 - y0 + 1;
    if (height < 3 || height > 21) continue;
    let ok = true;
    for (let a = a0; a <= a1 && ok; a++) {
      const cx = x + a * ax,
        cz = z + a * az;
      if (w.getId(cx, y0 - 1, cz) !== frame || w.getId(cx, y1 + 1, cz) !== frame) ok = false;
      for (let yy = y0; yy <= y1 && ok; yy++) if (!inside(cx, yy, cz)) ok = false;
    }
    for (let yy = y0; yy <= y1 && ok; yy++) {
      if (w.getId(x + (a0 - 1) * ax, yy, z + (a0 - 1) * az) !== frame) ok = false;
      if (w.getId(x + (a1 + 1) * ax, yy, z + (a1 + 1) * az) !== frame) ok = false;
    }
    if (!ok) continue;
    for (let a = a0; a <= a1; a++) for (let yy = y0; yy <= y1; yy++) w.setBlock(x + a * ax, yy, z + a * az, makeCell(portal, axis), { silent: true });
    sim.emit({ t: 'particles', kind: 'portail', x: x + 0.5, y: y0 + 1, z: z + 0.5, n: 30, spread: 2 });
    return true;
  }
  return false;
}

/** Détecte le contact prolongé avec un voile de portail. */
export function checkPortalContact(sim: Sim, p: Player, dt: number): void {
  if (p.portalCooldown > 0 || p.dead) {
    p.portalTime = 0;
    return;
  }
  const w = sim.world(p.dim);
  const t = w.content.blocks;
  const id = w.getId(Math.floor(p.x), Math.floor(p.y + 0.5), Math.floor(p.z));
  const astral = t.tryNum('voile_astral');
  const kind = PORTAL_KINDS.find((k) => t.tryNum(k.veil) === id);
  if (!kind && id !== astral) {
    p.portalTime = Math.max(0, p.portalTime - dt * 2);
    return;
  }
  p.portalTime += dt;
  if (Math.random() < 0.3) sim.emit({ t: 'particles', kind: 'portail', x: p.x, y: p.y + 1, z: p.z, n: 2 });
  if (p.portalTime >= (p.creative ? 0.5 : 2.5)) {
    p.portalTime = 0;
    p.portalCooldown = 6;
    const from = { x: Math.floor(p.x), y: Math.floor(p.y), z: Math.floor(p.z) };
    if (!kind) sim.requestTravel(p, p.dim === 'astral' ? 'surface' : 'astral', from);
    else sim.requestTravel(p, p.dim === kind.dim ? 'surface' : kind.dim, from, false, kind.id);
  }
}

/** Point d'arrivée théorique dans une autre dimension. */
export function mapCoords(from: string, to: string, x: number, z: number): { x: number; z: number } {
  const sf = DIMENSION_INFO[from as DimensionId]?.scale ?? 1;
  const st = DIMENSION_INFO[to as DimensionId]?.scale ?? 1;
  return { x: Math.floor((x / st) * sf), z: Math.floor((z / st) * sf) };
}

/**
 * Construit (ou retrouve) un portail d'arrivée et renvoie la position du joueur.
 * Appelé une fois les colonnes de destination chargées.
 */
export function buildArrivalPortal(sim: Sim, dim: string, x: number, z: number, preferY: number, kind: PortalKind = PORTAL_KINDS[0]): { x: number; y: number; z: number } {
  const w = sim.world(dim);
  const t = w.content.blocks;
  const portal = t.tryNum(kind.veil);
  const frame = t.tryNum(kind.frame);
  const floor = t.tryNum(kind.floor[dim as DimensionId] ?? 'pierre_taillee');
  // Îles célestes : on cherche une île proche (les colonnes voisines sont chargées)
  if (dim === 'celeste') {
    const isle = findIsle(sim, x, z, preferY);
    if (isle) {
      x = isle.x;
      z = isle.z;
      preferY = isle.y;
    }
  }
  // 1) portail existant à proximité ?
  for (let r = 0; r <= 24; r += 2)
    for (let dx = -r; dx <= r; dx += 2)
      for (let dz = -r; dz <= r; dz += 2) {
        if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
        for (let y = 4; y < (dim === 'abime' ? 124 : 250); y++)
          if (w.getId(x + dx, y, z + dz) === portal) {
            let yy = y;
            while (w.getId(x + dx, yy - 1, z + dz) === portal) yy--;
            return { x: x + dx + 0.5, y: yy, z: z + dz + 0.5 };
          }
      }
  // 2) chercher un sol dégagé
  const maxY = dim === 'abime' ? 110 : 240;
  let best: number | null = null;
  let bestScore = Infinity;
  for (let y = 34; y < maxY; y++) {
    const ground = t.solid[w.getId(x, y - 1, z)] && !t.liquid[w.getId(x, y - 1, z)];
    if (!ground) continue;
    let free = true;
    for (let k = 0; k < 5 && free; k++) for (let a = -1; a <= 2 && free; a++) if (w.getId(x + a, y + k, z) !== 0) free = false;
    if (!free) continue;
    const score = Math.abs(y - preferY);
    if (score < bestScore) {
      bestScore = score;
      best = y;
    }
  }
  let y = best ?? Math.max(40, Math.min(maxY - 8, preferY));
  if (best === null) {
    // creuse une salle et pose une plateforme
    for (let a = -3; a <= 4; a++) for (let k = -1; k <= 5; k++) for (let b = -2; b <= 2; b++) w.setBlock(x + a, y + k, z + b, k === -1 ? floor : 0, { silent: true });
  }
  // cadre 4x5 (intérieur 2x3) le long de X
  for (let a = -1; a <= 2; a++)
    for (let k = -1; k <= 3; k++) {
      const edge = a === -1 || a === 2 || k === -1 || k === 3;
      w.setBlock(x + a, y + k, z, edge ? frame : makeCell(portal, 0), { silent: true });
    }
  // plateforme devant
  for (let a = -1; a <= 2; a++)
    for (const b of [-1, 1]) {
      if (!t.solid[w.getId(x + a, y - 1, z + b)]) w.setBlock(x + a, y - 1, z + b, floor, { silent: true });
      for (let k = 0; k < 3; k++) if (w.getId(x + a, y + k, z + b) !== 0 && !t.liquid[w.getId(x + a, y + k, z + b)]) w.setBlock(x + a, y + k, z + b, 0, { silent: true });
    }
  return { x: x + 0.5, y, z: z + 1.5 };
}

/** Sol d'île le plus proche (herbe ou pierre, pas nuage ni feuillage), avec la place pour un portail. */
function findIsle(sim: Sim, x: number, z: number, preferY: number): { x: number; y: number; z: number } | null {
  const w = sim.world('celeste');
  const t = w.content.blocks;
  let best: { x: number; y: number; z: number } | null = null;
  let bestScore = Infinity;
  for (let dz = -28; dz <= 28; dz += 2)
    for (let dx = -28; dx <= 28; dx += 2) {
      const cx = x + dx,
        cz = z + dz;
      const top = w.heightAt(cx, cz);
      if (top < 20) continue;
      const g = w.getId(cx, top, cz);
      if (!t.solid[g] || t.hasTag(g, 'leaves') || t.hasTag(g, 'cloud') || t.liquid[g]) continue;
      // île assez large : sol sur 3 blocs de chaque côté
      let wide = true;
      for (const [ox, oz] of [[-3, 0], [4, 0], [0, -3], [0, 3]]) if (Math.abs(w.heightAt(cx + ox, cz + oz) - top) > 2) wide = false;
      if (!wide) continue;
      const score = Math.hypot(dx, dz) + Math.abs(top - preferY) * 0.2;
      if (score < bestScore) {
        bestScore = score;
        best = { x: cx, y: top + 1, z: cz };
      }
    }
  return best;
}

/** Plateforme d'arrivée des Cimes astrales (île centrale) avec autel de retour. */
export function buildAstralArrival(sim: Sim): { x: number; y: number; z: number } {
  const w = sim.world('astral');
  const t = w.content.blocks;
  let y = 100;
  for (let yy = 200; yy > 20; yy--)
    if (t.solid[w.getId(0, yy, 0)]) {
      y = yy + 1;
      break;
    }
  const bricks = t.tryNum('briques_astrales');
  for (let dx = -3; dx <= 3; dx++)
    for (let dz = -3; dz <= 3; dz++) {
      if (dx * dx + dz * dz > 12) continue;
      w.setBlock(dx, y - 1, dz, bricks, { silent: true });
      for (let k = 0; k < 4; k++) if (w.getId(dx, y + k, dz) !== 0) w.setBlock(dx, y + k, dz, 0, { silent: true });
    }
  const altar = t.tryNum('autel_astral');
  if (w.getId(0, y, -2) !== altar) w.setBlock(0, y, -2, makeCell(altar, 1), { silent: true });
  return { x: 0.5, y, z: 1.5 };
}
