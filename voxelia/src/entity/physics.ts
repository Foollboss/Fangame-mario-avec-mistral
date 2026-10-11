/**
 * Collisions boîte englobante / monde voxel (déplacement axe par axe, marche
 * automatique sur les petites marches), détection des liquides et des échelles.
 */
import { BLOCKS, IS_LIQUID, WATERLOGGED } from '../world/blocks';
import { blockMeta, ID_MASK } from '../world/constants';
import { collisionBoxes, needsConnections } from '../world/models';
import type { World } from '../world/World';

export interface AABB {
  x0: number;
  y0: number;
  z0: number;
  x1: number;
  y1: number;
  z1: number;
}

export function aabb(x: number, y: number, z: number, w: number, h: number): AABB {
  const r = w / 2;
  return { x0: x - r, y0: y, z0: z - r, x1: x + r, y1: y + h, z1: z + r };
}

export function intersects(a: AABB, b: AABB): boolean {
  return a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0 && a.z0 < b.z1 && a.z1 > b.z0;
}

const boxCache = new Map<number, number[][]>();

/** Masque de connexions horizontales (barrières, vitres). */
export function connectionMask(world: World, x: number, y: number, z: number, shape: string): number {
  let m = 0;
  const offs = [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0],
  ];
  for (let k = 0; k < 4; k++) {
    const nb = BLOCKS[world.id(x + offs[k][0], y, z + offs[k][1])];
    if (!nb) continue;
    if (nb.opaque || nb.shape === shape) m |= 1 << k;
  }
  return m;
}

export function blockCollision(world: World, x: number, y: number, z: number): number[][] {
  const raw = world.raw(x, y, z);
  const id = raw & ID_MASK;
  const def = BLOCKS[id];
  if (!def || !def.solid) return [];
  const meta = blockMeta(raw);
  const conn = needsConnections(def.shape) ? connectionMask(world, x, y, z, def.shape) : 0;
  const key = id | (meta << 10) | (conn << 16);
  let boxes = boxCache.get(key);
  if (!boxes) {
    boxes = collisionBoxes(def, meta, conn).map((b) => b.map((v) => v / 16));
    boxCache.set(key, boxes);
  }
  return boxes;
}

/** Boîtes solides touchant la zone (les tronçons non chargés sont pleins). */
export function collectBoxes(world: World, area: AABB, out: AABB[]): void {
  out.length = 0;
  const x0 = Math.floor(area.x0);
  const x1 = Math.floor(area.x1);
  const y0 = Math.floor(area.y0) - 1;
  const y1 = Math.floor(area.y1);
  const z0 = Math.floor(area.z0);
  const z1 = Math.floor(area.z1);
  for (let x = x0; x <= x1; x++)
    for (let z = z0; z <= z1; z++) {
      if (!world.isLoaded(x, z)) {
        out.push({ x0: x, y0: Math.max(0, y0), z0: z, x1: x + 1, y1: y1 + 1, z1: z + 1 });
        continue;
      }
      for (let y = y0; y <= y1; y++) {
        if (y < 0) {
          out.push({ x0: x, y0: y, z0: z, x1: x + 1, y1: y + 1, z1: z + 1 });
          continue;
        }
        const bs = blockCollision(world, x, y, z);
        for (const b of bs) out.push({ x0: x + b[0], y0: y + b[1], z0: z + b[2], x1: x + b[3], y1: y + b[4], z1: z + b[5] });
      }
    }
}

export interface MoveResult {
  dx: number;
  dy: number;
  dz: number;
  hitX: boolean;
  hitY: boolean;
  hitZ: boolean;
  onGround: boolean;
}

const tmpBoxes: AABB[] = [];

function clipY(boxes: AABB[], b: AABB, dy: number): number {
  for (const o of boxes) {
    if (o.x1 <= b.x0 || o.x0 >= b.x1 || o.z1 <= b.z0 || o.z0 >= b.z1) continue;
    if (dy > 0 && b.y1 <= o.y0 + 1e-7) dy = Math.min(dy, o.y0 - b.y1);
    else if (dy < 0 && b.y0 >= o.y1 - 1e-7) dy = Math.max(dy, o.y1 - b.y0);
  }
  return dy;
}

function clipX(boxes: AABB[], b: AABB, dx: number): number {
  for (const o of boxes) {
    if (o.y1 <= b.y0 || o.y0 >= b.y1 || o.z1 <= b.z0 || o.z0 >= b.z1) continue;
    if (dx > 0 && b.x1 <= o.x0 + 1e-7) dx = Math.min(dx, o.x0 - b.x1);
    else if (dx < 0 && b.x0 >= o.x1 - 1e-7) dx = Math.max(dx, o.x1 - b.x0);
  }
  return dx;
}

function clipZ(boxes: AABB[], b: AABB, dz: number): number {
  for (const o of boxes) {
    if (o.y1 <= b.y0 || o.y0 >= b.y1 || o.x1 <= b.x0 || o.x0 >= b.x1) continue;
    if (dz > 0 && b.z1 <= o.z0 + 1e-7) dz = Math.min(dz, o.z0 - b.z1);
    else if (dz < 0 && b.z0 >= o.z1 - 1e-7) dz = Math.max(dz, o.z1 - b.z0);
  }
  return dz;
}

function offset(b: AABB, dx: number, dy: number, dz: number): void {
  b.x0 += dx;
  b.x1 += dx;
  b.y0 += dy;
  b.y1 += dy;
  b.z0 += dz;
  b.z1 += dz;
}

/** Déplace la boîte en tenant compte des collisions ; modifie `box` en place. */
export function moveBox(world: World, box: AABB, dx: number, dy: number, dz: number, stepHeight = 0, wasOnGround = false): MoveResult {
  const area: AABB = {
    x0: Math.min(box.x0, box.x0 + dx) - 0.01,
    y0: Math.min(box.y0, box.y0 + dy) - 0.01,
    z0: Math.min(box.z0, box.z0 + dz) - 0.01,
    x1: Math.max(box.x1, box.x1 + dx) + 0.01,
    y1: Math.max(box.y1, box.y1 + dy) + stepHeight + 0.01,
    z1: Math.max(box.z1, box.z1 + dz) + 0.01,
  };
  collectBoxes(world, area, tmpBoxes);
  const boxes = tmpBoxes;
  const start = { ...box };
  const ody = dy;
  const odx = dx;
  const odz = dz;
  dy = clipY(boxes, box, dy);
  offset(box, 0, dy, 0);
  dx = clipX(boxes, box, dx);
  offset(box, dx, 0, 0);
  dz = clipZ(boxes, box, dz);
  offset(box, 0, 0, dz);
  const onGround = ody < 0 && dy !== ody;

  // Marche : monte automatiquement les dénivelés de stepHeight (dalles, chemins…).
  if (stepHeight > 0 && (onGround || wasOnGround) && (dx !== odx || dz !== odz)) {
    const b2: AABB = { ...start };
    let sy = clipY(boxes, b2, stepHeight);
    offset(b2, 0, sy, 0);
    const sx = clipX(boxes, b2, odx);
    offset(b2, sx, 0, 0);
    const sz = clipZ(boxes, b2, odz);
    offset(b2, 0, 0, sz);
    const down = clipY(boxes, b2, -sy + Math.min(0, ody));
    offset(b2, 0, down, 0);
    sy += down;
    if (sx * sx + sz * sz > dx * dx + dz * dz + 1e-6) {
      Object.assign(box, b2);
      return { dx: sx, dy: sy, dz: sz, hitX: sx !== odx, hitY: true, hitZ: sz !== odz, onGround: true };
    }
  }
  return { dx, dy, dz, hitX: dx !== odx, hitY: dy !== ody, hitZ: dz !== odz, onGround };
}

/** Le bloc sous les pieds (pour la glissance, les sons de pas…). */
export function blockUnder(world: World, box: AABB): number {
  const y = Math.floor(box.y0 - 0.05);
  const cx = (box.x0 + box.x1) / 2;
  const cz = (box.z0 + box.z1) / 2;
  let id = world.id(Math.floor(cx), y, Math.floor(cz));
  if (!BLOCKS[id]?.solid) {
    // Coins de la boîte (au bord d'un bloc)
    for (const [x, z] of [
      [box.x0 + 0.01, box.z0 + 0.01],
      [box.x1 - 0.01, box.z0 + 0.01],
      [box.x0 + 0.01, box.z1 - 0.01],
      [box.x1 - 0.01, box.z1 - 0.01],
    ]) {
      const i = world.id(Math.floor(x), y, Math.floor(z));
      if (BLOCKS[i]?.solid) {
        id = i;
        break;
      }
    }
  }
  return id;
}

export interface FluidState {
  water: boolean;
  lava: boolean;
  /** La tête est sous l'eau. */
  eyesInWater: boolean;
  eyesInLava: boolean;
  /** Proportion du corps immergée (0..1). */
  submerged: number;
}

export function fluidState(world: World, box: AABB, eyeY: number): FluidState {
  let water = false;
  let lava = false;
  let wetCells = 0;
  let cells = 0;
  const x0 = Math.floor(box.x0 + 0.001);
  const x1 = Math.floor(box.x1 - 0.001);
  const z0 = Math.floor(box.z0 + 0.001);
  const z1 = Math.floor(box.z1 - 0.001);
  const y0 = Math.floor(box.y0 + 0.001);
  const y1 = Math.floor(box.y1 - 0.001);
  for (let y = y0; y <= y1; y++) {
    let rowWet = false;
    for (let x = x0; x <= x1; x++)
      for (let z = z0; z <= z1; z++) {
        const id = world.id(x, y, z);
        if (WATERLOGGED[id]) {
          water = true;
          rowWet = true;
        } else if (IS_LIQUID[id]) {
          lava = true;
          rowWet = true;
        }
      }
    cells++;
    if (rowWet) wetCells++;
  }
  const cx = (box.x0 + box.x1) / 2;
  const cz = (box.z0 + box.z1) / 2;
  const eyeId = world.id(Math.floor(cx), Math.floor(eyeY), Math.floor(cz));
  const eyeMeta = world.meta(Math.floor(cx), Math.floor(eyeY), Math.floor(cz));
  // La surface d'un bloc d'eau est un peu plus basse que le haut du bloc.
  const surf = Math.floor(eyeY) + (eyeMeta === 0 ? 0.88 : Math.max(0.12, ((8 - (eyeMeta & 7)) / 8) * 0.88));
  const aboveSame = WATERLOGGED[world.id(Math.floor(cx), Math.floor(eyeY) + 1, Math.floor(cz))];
  const eyesInWater = WATERLOGGED[eyeId] === 1 && (aboveSame === 1 || eyeY < surf);
  const eyesInLava = IS_LIQUID[eyeId] === 1 && !WATERLOGGED[eyeId];
  return { water, lava, eyesInWater, eyesInLava, submerged: cells ? wetCells / cells : 0 };
}

export function onClimbable(world: World, box: AABB): boolean {
  const cx = (box.x0 + box.x1) / 2;
  const cz = (box.z0 + box.z1) / 2;
  for (const y of [box.y0 + 0.05, box.y0 + 1]) {
    const id = world.id(Math.floor(cx), Math.floor(y), Math.floor(cz));
    if (BLOCKS[id]?.climbable) return true;
  }
  return false;
}

/** Ralentissement dû au bloc traversé (toile d'araignée, boue…). */
export function slowFactor(world: World, box: AABB): number {
  let s = 1;
  const x0 = Math.floor(box.x0);
  const x1 = Math.floor(box.x1);
  const z0 = Math.floor(box.z0);
  const z1 = Math.floor(box.z1);
  const y0 = Math.floor(box.y0);
  const y1 = Math.floor(box.y1);
  for (let x = x0; x <= x1; x++)
    for (let y = y0; y <= y1; y++)
      for (let z = z0; z <= z1; z++) {
        const d = BLOCKS[world.id(x, y, z)];
        if (d && d.slow > 0 && !d.solid) s = Math.min(s, 1 / (1 + d.slow * 2));
      }
  return s;
}
