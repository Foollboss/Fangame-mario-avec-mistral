/**
 * Temple céleste : une grande plateforme circulaire de quartz et de cristal posée sur une île
 * flottante (ou portée par son propre socle), arène à ciel ouvert où dort le Dragon des cieux.
 * Une colonnade de piliers dorés l'entoure ; quatre portiques coiffés de nuages abritent les
 * coffres et ouvrent sur de grands escaliers qui redescendent vers l'île.
 */
import { Rng, hash2 } from '../../../util/random';
import type { SkyGenerator } from '../otherDims';
import type { ChunkWriter } from '../writer';
import { I, SKY_OPEN, AxisFrame, addPiece, newPlan, squareBox, clear, column, setIfOpen, pruneTrees, chestAt, guardAt, bossAt, rnd, dirOf, clamp, type DimPlan } from './kit';

/** Une région de 20×20 tronçons par temple. */
export const TEMPLE_REGION = 320;
export const TEMPLE_REACH = 80;
const MARGIN = 72;
/** Rayon de la plateforme (parapet compris). */
const RP = 17.5;
/** Début et fin (t) des portiques. */
const G0 = 16;
const G1 = 22;
const MAX_STEPS = 44;
/** Hauteur dégagée au-dessus du dallage (sans trouer la couche de nuages d'altitude). */
const CARVE_TOP = (P: number): number => Math.min(P + 22, 127);

export interface TempleSite {
  x: number;
  z: number;
  /** Niveau du dallage de l'arène. */
  floor: number;
  seed: number;
}

interface Gate {
  f: AxisFrame;
  chest: boolean;
  steps: number;
  /** Vrai si aucune île n'est à portée d'escalier : le portique s'ouvre sur un balcon. */
  balcony: boolean;
}

const STENCIL: Array<[number, number]> = [[0, 0]];
for (const r of [9, 18, 28]) for (let i = 0; i < 8; i++) STENCIL.push([Math.round(Math.cos((i / 8) * Math.PI * 2) * r), Math.round(Math.sin((i / 8) * Math.PI * 2) * r)]);

/** Emplacement du temple d'une région : le candidat qui recouvre le plus d'île. */
export function templeSite(g: SkyGenerator, rx: number, rz: number): TempleSite {
  const rng = new Rng(hash2(g.seed ^ 0x7e3b, rx, rz));
  let bx = 0;
  let bz = 0;
  let best = -1;
  let bestTop = 0;
  for (let i = 0; i < 10; i++) {
    const x = rx * TEMPLE_REGION + rng.int(MARGIN, TEMPLE_REGION - MARGIN);
    const z = rz * TEMPLE_REGION + rng.int(MARGIN, TEMPLE_REGION - MARGIN);
    let score = 0;
    let sum = 0;
    let n = 0;
    STENCIL.forEach(([ox, oz], idx) => {
      const { top } = g.islandAt(x + ox, z + oz);
      if (top <= 0) return;
      score += idx === 0 ? 3 : 1;
      if (idx < 17) {
        sum += top;
        n++;
      }
    });
    if (score > best) {
      best = score;
      bx = x;
      bz = z;
      bestTop = n ? sum / n : 0;
    }
  }
  const floor = bestTop > 0 ? clamp(Math.round(bestTop) + 3, 100, 124) : 108;
  return { x: bx, z: bz, floor, seed: hash2(g.seed ^ 0x3c5d, rx, rz) };
}

export function templePlan(g: SkyGenerator, site: TempleSite): DimPlan {
  const P = site.floor;
  const cx = site.x;
  const cz = site.z;
  const rng = new Rng(site.seed);
  const plan = newPlan('sky_temple', cx, P + 1, cz);

  // 12 piliers dorés hors des axes (les axes sont réservés aux portiques).
  const pillars = new Set<number>();
  for (let i = 0; i < 12; i++) {
    const a = ((15 + i * 30) * Math.PI) / 180;
    pillars.add(key(Math.round(Math.cos(a) * 15), Math.round(Math.sin(a) * 15)));
  }
  // 2 à 4 portiques avec coffre
  const nChests = rng.int(2, 4);
  const order = [0, 1, 2, 3];
  for (let i = 3; i > 0; i--) {
    const j = rng.int(0, i);
    const t = order[i];
    order[i] = order[j];
    order[j] = t;
  }
  const gates: Gate[] = [];
  for (let d = 0; d < 4; d++) {
    const gate: Gate = { f: new AxisFrame(cx, cz, d), chest: order.indexOf(d) < nChests, steps: 0, balcony: false };
    stairsFor(g, gate, P);
    gates.push(gate);
  }

  addPiece(plan, squareBox(cx, cz, 21), (w, x, z) => platformColumn(w, x, z, cx, cz, P, site.seed, pillars));
  for (const gt of gates) {
    const f = gt.f;
    addPiece(plan, f.box(G0, G1, -4, 4), (w, x, z) => gateColumn(w, x, z, gt, P, site.seed));
    const n = gt.steps;
    if (gt.balcony) addPiece(plan, f.box(G1 + 1, G1 + 3, -3, 3), (w, x, z) => balconyColumn(w, x, z, gt, P, site.seed));
    else if (n > 0) addPiece(plan, f.box(G1 + 1, G1 + n, -2, 2), (w, x, z) => stairColumn(w, x, z, gt, P, site.seed));
    else addPiece(plan, f.box(G1 + 1, G1 + 3, -1, 1), (w, x, z) => notchColumn(w, x, z, P));
  }
  return plan;
}

const key = (x: number, z: number): number => (x + 512) * 1024 + (z + 512);

/** Nombre de marches jusqu'à l'île (demi-hauteurs), ou balcon si aucune île n'est à portée. */
function stairsFor(g: SkyGenerator, gt: Gate, P: number): void {
  const f = gt.f;
  for (let i = 1; i <= MAX_STEPS; i++) {
    const t = G1 + i;
    const surface = P + 1 - i / 2;
    let top = 0;
    for (let s = -1; s <= 1; s++) top = Math.max(top, g.islandAt(f.x(t, s), f.z(t, s)).top);
    if (top > 0 && top + 1 >= surface) {
      gt.steps = i - 1;
      return;
    }
  }
  gt.steps = 0;
  gt.balcony = true;
}

// ------------------------------------------------------------------ arène

function platformColumn(w: ChunkWriter, x: number, z: number, cx: number, cz: number, P: number, seed: number, pillars: Set<number>): void {
  const ax = x - cx;
  const az = z - cz;
  const aax = Math.abs(ax);
  const aaz = Math.abs(az);
  const r = Math.sqrt(ax * ax + az * az);
  if (r > RP) {
    // Élagage des arbres coupés par l'arène, frange de nuages sous le rebord
    if (r <= RP + 4) pruneTrees(w, x, z, P - 2, CARVE_TOP(P));
    if (r <= RP + 2.5) for (let y = P - 3; y <= P - 2; y++) if (rnd(seed, x, y, z) < 0.45) setIfOpen(w, x, y, z, I.cloud, SKY_OPEN);
    return;
  }
  clear(w, x, z, P + 1, CARVE_TOP(P));
  // Socle en cône renversé (ne remplace que le vide : l'île d'origine est conservée).
  const depth = 3 + Math.floor((RP - r) * 0.75) + Math.floor(rnd(seed, x, 0, z) * 3);
  for (let y = P - 1; y >= P - depth; y--) setIfOpen(w, x, y, z, rnd(seed, x, y, z) < 0.04 ? I.crystal : I.skyStone, SKY_OPEN);
  if (r < 1.5) for (let y = P - depth - 1; y >= P - depth - 6; y--) setIfOpen(w, x, y, z, I.crystal, SKY_OPEN);

  // Dallage : cercle doré, anneaux de cristal, rayons de pierre céleste, rebord de calcite.
  let floor = I.quartz;
  if (r <= 2.5) floor = I.gold;
  else if ((r > 5.5 && r <= 6.5) || (r > 10.5 && r <= 11.5)) floor = I.crystal;
  else if (r > 14.5) floor = I.calcite;
  else if (ax === 0 || az === 0 || aax === aaz) floor = I.skyStone;
  if ((aax === 8 && az === 0) || (ax === 0 && aaz === 8) || (aax === 6 && aaz === 6)) floor = I.glowstone;
  w.set(x, P, z, floor);

  if (r <= 3.5) w.set(x, P + 1, z, r <= 1.5 ? I.gold : I.quartz);
  if (ax === 0 && az === 0) bossAt(w, x, P + 2, z, 'sky_dragon', [cx + 0.5, P + 1, cz + 0.5]);
  if ((ax === 9 && az === 9) || (ax === -9 && az === -9)) guardAt(w, x, P + 8, z, 'storm_bird');

  if (pillars.has(key(ax, az))) {
    column(w, x, z, P + 1, P + 8, I.goldenLog);
    w.set(x, P + 9, z, I.gold);
    w.set(x, P + 10, z, I.crystal);
    w.set(x, P + 11, z, I.lantern);
    return;
  }
  // Parapet (ouvert devant les portiques)
  if (r > RP - 1 && aax > 4 && aaz > 4) {
    w.set(x, P + 1, z, I.calcite);
    if (((ax * 7 + az * 13) & 7) === 0) w.set(x, P + 2, z, I.crystalCluster);
  }
}

// ------------------------------------------------------------------ portiques

function gateColumn(w: ChunkWriter, x: number, z: number, gt: Gate, P: number, seed: number): void {
  const f = gt.f;
  const t = f.t(x, z);
  const s = f.s(x, z);
  const as = Math.abs(s);
  clear(w, x, z, P + 1, CARVE_TOP(P));
  const depth = 4 + Math.floor(rnd(seed, x, 1, z) * 3);
  for (let y = P - 1; y >= P - depth; y--) setIfOpen(w, x, y, z, I.skyStone, SKY_OPEN);
  w.set(x, P, z, as === 0 ? I.crystal : I.quartz);

  // Piliers d'angle dorés qui dépassent du toit
  if (as === 4 && (t === G0 || t === G1)) {
    column(w, x, z, P + 1, P + 7, I.goldenLog);
    w.set(x, P + 8, z, I.gold);
    w.set(x, P + 9, z, I.crystal);
    w.set(x, P + 10, z, I.lantern);
    return;
  }
  // Toit de quartz, faîte de cristal, nuages par-dessus
  w.set(x, P + 6, z, as === 0 ? (t === 19 ? I.glowstone : I.crystal) : I.quartz);
  if (as <= 3 && t > G0 && t < G1 && rnd(seed, x, 2, z) < 0.45) w.set(x, P + 7, z, I.cloud);

  if (as === 4) {
    column(w, x, z, P + 1, P + 5, I.quartz);
    if (t === 19) column(w, x, z, P + 2, P + 3, I.glassPane);
    return;
  }
  if (t === G0 || t === G1) {
    if (as >= 2) column(w, x, z, P + 1, P + 5, I.quartz);
    else w.set(x, P + 5, z, s === 0 ? I.gold : I.quartz);
    if (s === 0) w.set(x, P + 7, z, I.gold);
    return;
  }
  if (as === 2 && (t === G0 + 1 || t === G1 - 1)) {
    column(w, x, z, P + 1, P + 5, I.goldenLog);
    return;
  }
  if (as === 3 && t === 19) {
    if (gt.chest && s === 3) chestAt(w, x, P + 1, z, dirOf(-f.lx, -f.lz), 'sky_temple');
    else w.set(x, P + 1, z, I.lantern);
  }
}

// ------------------------------------------------------------------ escaliers

/** Escalier en demi-marches : dalle, bloc, dalle, bloc… en descendant vers l'île. */
function stairColumn(w: ChunkWriter, x: number, z: number, gt: Gate, P: number, seed: number): void {
  const f = gt.f;
  const i = f.t(x, z) - G1;
  const as = Math.abs(f.s(x, z));
  const half = (i & 1) === 1;
  const y = half ? P - (i - 1) / 2 : P - i / 2;
  if (as <= 1) {
    if (half) w.set(x, y, z, I.slab, 0);
    else w.set(x, y, z, I.quartz);
    clear(w, x, z, y + 1, y + 4);
    if (!half && rnd(seed, x, 3, z) < 0.5) setIfOpen(w, x, y - 1, z, I.cloud, SKY_OPEN);
    return;
  }
  if (i % 6 === 3) {
    w.set(x, y, z, I.quartz);
    w.set(x, y + 1, z, I.goldenLog);
    w.set(x, y + 2, z, I.lantern);
    clear(w, x, z, y + 3, y + 4);
  } else clear(w, x, z, y + 1, y + 4);
}

/** Balcon de quartz à balustrade, ouvert sur le vide, quand aucune île n'est à portée. */
function balconyColumn(w: ChunkWriter, x: number, z: number, gt: Gate, P: number, seed: number): void {
  const f = gt.f;
  const u = f.t(x, z) - G1;
  const as = Math.abs(f.s(x, z));
  clear(w, x, z, P + 1, P + 6);
  w.set(x, P, z, as === 0 ? I.crystal : I.quartz);
  setIfOpen(w, x, P - 1, z, I.skyStone, SKY_OPEN);
  if (rnd(seed, x, 5, z) < 0.6) setIfOpen(w, x, P - 2, z, I.cloud, SKY_OPEN);
  if (u === 3 || as === 3) {
    w.set(x, P + 1, z, I.calcite);
    if (as === 3 && u === 3) w.set(x, P + 2, z, I.lantern);
  }
}

/** Sortie creusée quand l'île affleure au niveau du portique. */
function notchColumn(w: ChunkWriter, x: number, z: number, P: number): void {
  w.set(x, P, z, I.quartz);
  clear(w, x, z, P + 1, P + 4);
}
