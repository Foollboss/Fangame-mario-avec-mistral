/**
 * Forteresse des braises : une salle du trône carrée, arène du Souverain des braises endormi,
 * dressée sur un socle massif au milieu d'une cuvette de lave creusée dans le relief. De ses
 * portes partent 2 ou 3 ponts d'obsidienne à arches, à hauteur fixe au-dessus de la lave ; chaque
 * pont mène, par un tronçon couvert à fenêtres grillagées, à une salle (trésor, générateur ou
 * gardiens), puis à un escalier qui redescend jusqu'au bord de la cuvette — ou à une chaussée de
 * basalte posée sur la lave quand la terre ferme est plus loin.
 */
import { Rng, hash2 } from '../../../util/random';
import { EMBER_LAVA_LEVEL, type EmberGenerator } from '../otherDims';
import type { ChunkWriter } from '../writer';
import { I, EMBER_OPEN, AxisFrame, addPiece, newPlan, squareBox, clear, column, fillDown, setIfOpen, chestAt, spawnerAt, guardAt, bossAt, clamp, rnd, type Box, type DimPlan } from './kit';

/** Taille d'une région (blocs) : une forteresse par région de 20×20 tronçons. */
export const FORTRESS_REGION = 320;
/** Portée maximale d'une forteresse autour de son centre (blocs). */
export const FORTRESS_REACH = 170;
/** Demi-largeur de la salle du trône (murs compris). */
const H = 13;
const MARGIN = 64;
/** Rayon de la cuvette de lave creusée autour des bâtiments. */
const BASIN_R = 26;

export interface FortressSite {
  x: number;
  z: number;
  /** Niveau du tablier des ponts (sol de la salle). */
  deck: number;
  seed: number;
}

type RoomKind = 'treasure' | 'spawner' | 'guard';

interface Arm {
  f: AxisFrame;
  len: number;
  /** Tronçon couvert (bornes en t). */
  c0: number;
  c1: number;
  /** Début (t) de la salle d'extrémité. */
  r0: number;
  room: RoomKind;
  chests: number;
  mob: string;
  steps: number;
  causeway: number;
}

const STENCIL: ReadonlyArray<readonly [number, number]> = [
  [0, 0],
  [24, 0],
  [-24, 0],
  [0, 24],
  [0, -24],
  [17, 17],
  [-17, 17],
  [17, -17],
  [-17, -17],
  [44, 0],
  [-44, 0],
  [0, 44],
  [0, -44],
];

/**
 * Emplacement de la forteresse d'une région : parmi 10 candidats, celui qui domine le plus
 * de lave (relief le plus bas autour). Fonction pure de la graine.
 */
export function fortressSite(g: EmberGenerator, rx: number, rz: number): FortressSite {
  const lava = EMBER_LAVA_LEVEL;
  const rng = new Rng(hash2(g.seed ^ 0xf0e7, rx, rz));
  let bx = 0;
  let bz = 0;
  let bestScore = Infinity;
  let bestAvg = lava;
  for (let i = 0; i < 10; i++) {
    const x = rx * FORTRESS_REGION + rng.int(MARGIN, FORTRESS_REGION - MARGIN);
    const z = rz * FORTRESS_REGION + rng.int(MARGIN, FORTRESS_REGION - MARGIN);
    let score = 0;
    let sum = 0;
    for (const [ox, oz] of STENCIL) {
      const h = Math.max(g.heightAt(x + ox, z + oz), lava);
      score += h - lava;
      sum += h;
    }
    if (score < bestScore) {
      bestScore = score;
      bx = x;
      bz = z;
      bestAvg = sum / STENCIL.length;
    }
  }
  return { x: bx, z: bz, deck: clamp(Math.round(bestAvg) + 16, 58, 74), seed: hash2(g.seed ^ 0x51ab, rx, rz) };
}

/** Plan complet de la forteresse (pièces par colonnes). */
export function fortressPlan(g: EmberGenerator, site: FortressSite): DimPlan {
  const lava = EMBER_LAVA_LEVEL;
  const D = site.deck;
  const cx = site.x;
  const cz = site.z;
  const rng = new Rng(site.seed);
  const plan = newPlan('fortress', cx, D + 1, cz);
  const throneDir = rng.int(0, 3);
  const tf = new AxisFrame(cx, cz, throneDir);

  // Ponts : l'entrée principale fait face au trône, les côtés sont facultatifs (au moins un).
  const dirs = [(throneDir + 2) & 3];
  const sideA = (throneDir + 1) & 3;
  const sideB = (throneDir + 3) & 3;
  const hasA = rng.chance(0.75);
  const hasB = rng.chance(0.75);
  if (hasA || !hasB) dirs.push(sideA);
  if (hasB) dirs.push(sideB);
  const rooms: RoomKind[] = ['treasure', 'spawner', rng.pick(['treasure', 'spawner', 'guard'] as const)];
  // Mélange stable de l'ordre des salles
  for (let i = rooms.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    const t = rooms[i];
    rooms[i] = rooms[j];
    rooms[j] = t;
  }
  // Il faut au moins une salle au trésor et une salle à générateur parmi les ponts retenus.
  const used = rooms.slice(0, dirs.length);
  if (!used.includes('treasure')) used[0] = 'treasure';
  if (!used.includes('spawner')) used[used[0] === 'treasure' ? 1 : 0] = 'spawner';
  // 1 coffre derrière le trône + 1 par salle au trésor (+1 parfois) : 2 à 4 coffres.
  const extraChest = rng.chance(0.5);
  let firstTreasure = true;

  const arms: Arm[] = [];
  const armDirs = [false, false, false, false];
  dirs.forEach((d, idx) => {
    const f = new AxisFrame(cx, cz, d);
    const len = rng.int(16, 34);
    let c0 = H + 1 + rng.int(3, 8);
    let c1 = H + len;
    const mode = rng.next();
    if (idx > 0 && mode < 0.2) c0 = c1 + 1; // pont entièrement à ciel ouvert
    else if (mode > 0.7) c1 = Math.min(H + len, c0 + rng.int(6, 12));
    if (c0 > c1) c1 = c0 - 1;
    const room = used[idx];
    let chests = 0;
    if (room === 'treasure') {
      chests = firstTreasure && extraChest ? 2 : 1;
      firstTreasure = false;
    }
    const arm: Arm = {
      f,
      len,
      c0,
      c1,
      r0: H + len + 1,
      room,
      chests,
      mob: rng.chance(0.5) ? 'fire_spirit' : 'ember_salamander',
      steps: 0,
      causeway: 0,
    };
    arms.push(arm);
    armDirs[d] = true;
  });

  // Cuvette de lave autour de la salle et des ponts, puis escaliers de sortie jusqu'à son bord.
  const basin = new Basin(g, [squareBox(cx, cz, H), ...arms.map((a) => a.f.box(H + 1, a.r0 + 10, -5, 5))], site.seed);
  for (const a of arms) rampFor(basin, a, D, lava);
  addPiece(plan, basin.box, (w, x, z) => basinColumn(w, x, z, basin, lava), 0);
  // Salle du trône (avant les ponts : les ponts n'empiètent jamais dessus).
  addPiece(plan, squareBox(cx, cz, H), (w, x, z) => hallColumn(w, x, z, cx, cz, D, tf, armDirs));
  for (const a of arms) {
    const f = a.f;
    addPiece(plan, f.box(H + 1, H + a.len, -2, 2), (w, x, z) => armColumn(w, x, z, a, D));
    addPiece(plan, f.box(a.r0, a.r0 + 10, -5, 5), (w, x, z) => roomColumn(w, x, z, a, D));
    if (a.steps > 0) addPiece(plan, f.box(a.r0 + 11, a.r0 + 10 + a.steps, -2, 2), (w, x, z) => rampColumn(w, x, z, a, D));
    if (a.causeway > 0) addPiece(plan, f.box(a.r0 + 11 + a.steps, a.r0 + 10 + a.steps + a.causeway, -2, 2), (w, x, z) => causewayColumn(w, x, z, a, lava));
  }
  return plan;
}

/**
 * Cuvette de lave : autour des bâtiments, le relief s'abaisse sous la surface de la lave puis
 * remonte en pente douce jusqu'au terrain d'origine (fonction pure, partagée par les escaliers).
 */
class Basin {
  readonly box: Box;
  constructor(
    readonly g: EmberGenerator,
    readonly rects: Box[],
    readonly seed: number,
  ) {
    const b = { ...rects[0] };
    for (const r of rects) {
      b.x0 = Math.min(b.x0, r.x0 - BASIN_R);
      b.z0 = Math.min(b.z0, r.z0 - BASIN_R);
      b.x1 = Math.max(b.x1, r.x1 + BASIN_R);
      b.z1 = Math.max(b.z1, r.z1 + BASIN_R);
    }
    this.box = b;
  }

  /** Fond de la cuvette en (x, z), ou Infinity hors de sa portée. */
  floor(x: number, z: number): number {
    let d2 = Infinity;
    for (const r of this.rects) {
      const dx = Math.max(r.x0 - x, 0, x - r.x1);
      const dz = Math.max(r.z0 - z, 0, z - r.z1);
      d2 = Math.min(d2, dx * dx + dz * dz);
    }
    if (d2 >= BASIN_R * BASIN_R) return Infinity;
    const k = Math.max(0, Math.sqrt(d2) - 7) / (BASIN_R - 7);
    return EMBER_LAVA_LEVEL - 3 + Math.floor(k * k * 60 + rnd(this.seed, x, 11, z) * 2);
  }

  /** Sol après creusement (au moins la surface de la lave). */
  ground(x: number, z: number): number {
    return Math.max(EMBER_LAVA_LEVEL, Math.min(this.g.heightAt(x, z), this.floor(x, z)));
  }
}

function basinColumn(w: ChunkWriter, x: number, z: number, b: Basin, lava: number): void {
  const f = b.floor(x, z);
  if (f === Infinity) return;
  const h = b.g.heightAt(x, z);
  if (f >= h) return;
  clear(w, x, z, f + 1, h + 23);
  // Scelle les cavités proches du fond pour que la lave ne s'y déverse pas.
  for (let y = f; y >= f - 5; y--) setIfOpen(w, x, y, z, I.emberStone, EMBER_OPEN);
  if (f < lava) column(w, x, z, f + 1, lava, I.lava);
  else w.set(x, f, z, rnd(b.seed, x, 12, z) < 0.25 ? I.magma : I.emberStone);
}

/** Longueur de l'escalier de sortie (jusqu'au sol) puis de la chaussée sur la lave. */
function rampFor(b: Basin, a: Arm, D: number, lava: number): void {
  const f = a.f;
  const maxSteps = D - (lava + 2) + 1;
  let landed = false;
  for (let i = 1; i <= maxSteps; i++) {
    const t = a.r0 + 10 + i;
    const y = D + 1 - i;
    let ground = lava;
    for (let s = -1; s <= 1; s++) ground = Math.max(ground, b.ground(f.x(t, s), f.z(t, s)));
    a.steps = i;
    if (ground >= y - 1) {
      landed = true;
      break;
    }
  }
  if (landed) return;
  a.causeway = 64;
  for (let k = 1; k <= 64; k++) {
    const t = a.r0 + 10 + a.steps + k;
    if (b.ground(f.x(t, 0), f.z(t, 0)) > lava) {
      a.causeway = k - 1;
      break;
    }
  }
}

const mod = (v: number, m: number): number => ((v % m) + m) % m;

// ------------------------------------------------------------------ salle du trône

function hallColumn(w: ChunkWriter, x: number, z: number, cx: number, cz: number, D: number, tf: AxisFrame, arms: boolean[]): void {
  const ax = x - cx;
  const az = z - cz;
  const aax = Math.abs(ax);
  const aaz = Math.abs(az);
  const r = Math.max(aax, aaz);
  const tt = tf.t(x, z);
  const ss = tf.s(x, z);
  const ast = Math.abs(ss);
  const pillar = aax >= 6 && aax <= 8 && aaz >= 6 && aaz <= 8;

  // Socle : dalle épaisse, murs extérieurs, piliers et centre descendent jusqu'au sol.
  column(w, x, z, D - 2, D - 1, I.bricks);
  if (r >= H - 1 || pillar || (aax <= 1 && aaz <= 1)) fillDown(w, x, D - 3, z, I.bricks, EMBER_OPEN, 90);
  clear(w, x, z, D + 1, D + 18);

  // Sol : allées d'obsidienne, cercle central doré, rigoles de lave sur les côtés.
  let floor = I.bricks;
  if (r <= 1) floor = I.gold;
  else if (r === 4 || ((ax === 0 || az === 0) && r < H)) floor = I.obsidian;
  if (ast === 10 && Math.abs(tt) >= 2 && Math.abs(tt) <= 9) floor = I.lava;
  w.set(x, D, z, floor);

  // Tours d'angle
  if (aax >= H - 2 && aaz >= H - 2) {
    column(w, x, z, D + 1, D + 15, I.bricks);
    if (aax === H - 1 && aaz === H - 1) w.set(x, D + 16, z, I.glowstone);
    else if (((ax + az) & 1) === 0) w.set(x, D + 16, z, I.bricks);
    return;
  }

  // Murs : fenêtres grillagées, portes vers les ponts, emblème lumineux derrière le trône.
  if (r === H) {
    const side = aax === H ? (ax > 0 ? 3 : 1) : az > 0 ? 0 : 2;
    const along = aax === H ? az : ax;
    const aal = Math.abs(along);
    column(w, x, z, D + 1, D + 12, I.bricks);
    if ((along & 1) === 0) w.set(x, D + 13, z, I.bricks);
    if (arms[side] && aal <= 1) {
      clear(w, x, z, D + 1, D + 4);
      if (along === 0) w.set(x, D + 5, z, I.gold);
    } else if (side === tf.d && aal <= 2) {
      for (let y = D + 6; y <= D + 10; y++) if (aal + Math.abs(y - (D + 8)) <= 2) w.set(x, y, z, I.glowstone);
    } else if (aal <= 1) column(w, x, z, D + 2, D + 6, I.ironBars);
    else if (aal === 4 || aal === 8) column(w, x, z, D + 3, D + 6, I.ironBars);
    return;
  }

  // Toit percé de pierres lumineuses
  w.set(x, D + 12, z, mod(ax, 5) === 0 && mod(az, 5) === 0 ? I.glowstone : I.bricks);

  if (pillar) {
    column(w, x, z, D + 1, D + 11, I.bricks);
    w.set(x, D + 5, z, I.magma);
    w.set(x, D + 9, z, I.glowstone);
    return;
  }

  // Estrade et trône
  if (tt >= H - 5 && tt <= H - 1 && ast <= 5) {
    const hgt = Math.min(3, tt - (H - 6));
    column(w, x, z, D + 1, D + hgt, I.bricks);
    if (hgt < 3) w.set(x, D + hgt, z, I.obsidian);
    const top = D + 4;
    if (tt === H - 2 && ss === 0) w.set(x, top, z, I.gold);
    else if (tt === H - 2 && ast === 1) {
      w.set(x, top, z, I.bricks);
      w.set(x, top + 1, z, I.obsidian);
    } else if (tt === H - 1 && ast <= 1) {
      column(w, x, z, top, top + 3, I.bricks);
      w.set(x, top + 4, z, ss === 0 ? I.gold : I.magma);
    } else if (tt === H - 3 && ast === 4) {
      w.set(x, top, z, I.magma);
      w.set(x, top + 1, z, I.fire);
    } else if (tt === H - 1 && ast === 5) w.set(x, top, z, I.lantern);
    else if (tt === H - 1 && ss === 3) chestAt(w, x, top, z, tf.back, 'fortress');
    return;
  }

  if (aax === 5 && aaz === 5) w.set(x, D + 1, z, I.lantern);
  if (ax === 0 && az === 0) bossAt(w, x, D + 1, z, 'ember_sovereign', [cx + 0.5, D + 1, cz + 0.5]);
}

// ------------------------------------------------------------------ ponts

function armColumn(w: ChunkWriter, x: number, z: number, a: Arm, D: number): void {
  const t = a.f.t(x, z);
  const s = a.f.s(x, z);
  const as = Math.abs(s);
  const k = t - (H + 1);
  // Dessous : piles tous les 9 blocs, arches entre elles.
  w.set(x, D - 1, z, I.bricks);
  const m = k % 9;
  if (m === 4 || m === 5) fillDown(w, x, D - 2, z, I.bricks, EMBER_OPEN, 90);
  else {
    const dist = Math.min(Math.abs(m - 4), Math.abs(m - 5), m + 4, 13 - m);
    const depth = 4 - dist;
    if (depth > 0) column(w, x, z, D - 1 - depth, D - 2, I.bricks);
  }
  w.set(x, D, z, s === 0 ? I.obsidian : I.bricks);

  if (t >= a.c0 && t <= a.c1) {
    // Couloir couvert
    if (as <= 1) {
      clear(w, x, z, D + 1, D + 4);
      w.set(x, D + 5, z, s === 0 && k % 6 === 3 ? I.glowstone : I.bricks);
      clear(w, x, z, D + 6, D + 8);
    } else {
      column(w, x, z, D + 1, D + 4, I.bricks);
      if (k % 4 === 1 || k % 4 === 2) column(w, x, z, D + 2, D + 3, I.ironBars);
      w.set(x, D + 5, z, I.bricks);
      if ((k & 1) === 0) w.set(x, D + 6, z, I.bricks);
      else clear(w, x, z, D + 6, D + 6);
      clear(w, x, z, D + 7, D + 8);
    }
    return;
  }
  // Pont à ciel ouvert : parapet bas, garde-corps grillagé et lanternes.
  clear(w, x, z, as <= 1 ? D + 1 : D + 3, D + 6);
  if (as === 2) {
    w.set(x, D + 1, z, I.bricks);
    if (k % 6 === 2) {
      w.set(x, D + 2, z, I.bricks);
      w.set(x, D + 3, z, I.lantern);
    } else w.set(x, D + 2, z, I.ironBars);
  }
}

// ------------------------------------------------------------------ salles d'extrémité

function roomColumn(w: ChunkWriter, x: number, z: number, a: Arm, D: number): void {
  const f = a.f;
  const u = f.t(x, z) - a.r0;
  const s = f.s(x, z);
  const as = Math.abs(s);
  const edge = u === 0 || u === 10 || as === 5;
  w.set(x, D - 1, z, I.bricks);
  if (edge) fillDown(w, x, D - 2, z, I.bricks, EMBER_OPEN, 90);
  else w.set(x, D - 2, z, I.bricks);
  w.set(x, D, z, !edge && ((u + s) & 1) !== 0 ? I.obsidian : I.bricks);
  clear(w, x, z, D + 1, D + 11);
  w.set(x, D + 7, z, s === 0 && (u === 2 || u === 5 || u === 8) ? I.glowstone : I.bricks);
  if (edge) {
    column(w, x, z, D + 1, D + 6, I.bricks);
    if (((u + s) & 1) === 0) w.set(x, D + 8, z, I.bricks);
    if (as <= 1 && (u === 0 || u === 10)) clear(w, x, z, D + 1, D + 4);
    else if (as === 5 && (u === 3 || u === 7)) column(w, x, z, D + 3, D + 4, I.ironBars);
    return;
  }
  if ((u === 1 || u === 9) && as === 4) {
    w.set(x, D + 1, z, I.lantern);
    return;
  }
  if (a.room === 'treasure') {
    if (u === 9 && (s === 3 || (s === -3 && a.chests > 1))) chestAt(w, x, D + 1, z, f.back, 'fortress');
    else if (u === 9 && as === 2) w.set(x, D + 1, z, I.gold);
  } else if (a.room === 'spawner') {
    if (u === 5 && s === 0) spawnerAt(w, x, D + 1, z, a.mob);
    else if (Math.abs(u - 5) + as === 2) w.set(x, D, z, I.magma);
  } else if (s === 0 && (u === 3 || u === 7)) guardAt(w, x, D + 1, z, 'ember_salamander');
}

// ------------------------------------------------------------------ sorties

/** Escalier de sortie : marches d'une demi-hauteur qui redescendent vers le sol. */
function rampColumn(w: ChunkWriter, x: number, z: number, a: Arm, D: number): void {
  const f = a.f;
  const i = f.t(x, z) - (a.r0 + 10);
  const as = Math.abs(f.s(x, z));
  const y = D + 1 - i;
  if (as <= 1) {
    w.set(x, y, z, I.brickStairs, f.back);
    clear(w, x, z, y + 1, y + 4);
  } else {
    column(w, x, z, y, y + 1, I.bricks);
    clear(w, x, z, y + 2, y + 4);
  }
  w.set(x, y - 1, z, I.bricks);
  if (i % 6 === 3) fillDown(w, x, y - 2, z, I.bricks, EMBER_OPEN, 90);
}

/** Chaussée de basalte posée sur la mer de lave, jusqu'à la terre ferme. */
function causewayColumn(w: ChunkWriter, x: number, z: number, a: Arm, lava: number): void {
  const f = a.f;
  const k = f.t(x, z) - (a.r0 + 10 + a.steps);
  const as = Math.abs(f.s(x, z));
  const y = lava + 1;
  w.set(x, y, z, as <= 1 ? I.bricks : I.basalt);
  w.set(x, y - 1, z, I.basalt);
  if (k % 7 === 0) fillDown(w, x, y - 2, z, I.basalt, EMBER_OPEN, 60);
  clear(w, x, z, y + 1, y + 4);
  if (as === 2 && k % 8 === 4) w.set(x, y + 1, z, I.lantern);
}
