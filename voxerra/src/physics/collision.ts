/**
 * Physique voxel : collisions AABB balayées axe par axe contre les boîtes des
 * blocs (cubes et formes partielles), marche automatique sur les petites
 * marches (dalles, escaliers), détection des liquides/échelles/toiles.
 */
import type { World } from '../world/world';
import { Shape, LIQ_WATER, LIQ_LAVA } from '../registry/blocks';
import { collisionBoxes, CONN_PX, CONN_NX, CONN_PZ, CONN_NZ } from '../world/shapes';

export interface Body {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  hw: number; // demi-largeur
  h: number; // hauteur
  onGround: boolean;
  hitH: boolean;
  hitCeil: boolean;
  inWater: boolean;
  headInWater: boolean;
  inLava: boolean;
  onLadder: boolean;
  slow: number;
  fallDist: number;
}

export function newBody(hw: number, h: number): Body {
  return { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, hw, h, onGround: false, hitH: false, hitCeil: false, inWater: false, headInWater: false, inLava: false, onLadder: false, slow: 0, fallDist: 0 };
}

const EPS = 1e-6;
let boxes = new Float64Array(6 * 256);
let nBoxes = 0;

function pushBox(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): void {
  if ((nBoxes + 1) * 6 > boxes.length) {
    const n = new Float64Array(boxes.length * 2);
    n.set(boxes);
    boxes = n;
  }
  const i = nBoxes * 6;
  boxes[i] = x0;
  boxes[i + 1] = y0;
  boxes[i + 2] = z0;
  boxes[i + 3] = x1;
  boxes[i + 4] = y1;
  boxes[i + 5] = z1;
  nBoxes++;
}

export function connectionsAt(world: World, x: number, y: number, z: number, shape: number): number {
  const t = world.content.blocks;
  const c = (dx: number, dz: number) => {
    const nid = world.getId(x + dx, y, z + dz);
    if (nid === 0) return false;
    if (t.opaque[nid]) return true;
    if (!t.connectable[nid]) return false;
    const ns = t.shape[nid];
    return shape === Shape.PANE ? ns === Shape.PANE : ns !== Shape.PANE;
  };
  let conn = 0;
  if (c(1, 0)) conn |= CONN_PX;
  if (c(-1, 0)) conn |= CONN_NX;
  if (c(0, 1)) conn |= CONN_PZ;
  if (c(0, -1)) conn |= CONN_NZ;
  return conn;
}

/** Collecte les boîtes solides intersectant une zone. */
function collect(world: World, minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number): void {
  nBoxes = 0;
  const t = world.content.blocks;
  const x0 = Math.floor(minX),
    x1 = Math.floor(maxX);
  const y0 = Math.floor(minY) - 1,
    y1 = Math.floor(maxY);
  const z0 = Math.floor(minZ),
    z1 = Math.floor(maxZ);
  for (let x = x0; x <= x1; x++)
    for (let z = z0; z <= z1; z++) {
      if (!world.isLoaded(x, z)) {
        // Zone non chargée : mur invisible pour ne pas tomber dans le vide
        pushBox(x, -64, z, x + 1, 512, z + 1);
        continue;
      }
      for (let y = y0; y <= y1; y++) {
        const v = world.getBlock(x, y, z);
        const id = v & 0xfff;
        if (id === 0 || !t.solid[id]) continue;
        const sh = t.shape[id];
        if (sh === Shape.CUBE) {
          pushBox(x, y, z, x + 1, y + 1, z + 1);
          continue;
        }
        const conn = sh === Shape.FENCE || sh === Shape.WALL || sh === Shape.PANE ? connectionsAt(world, x, y, z, sh) : 0;
        const bs = collisionBoxes(sh, v >>> 12, conn, true);
        if (!bs) continue;
        for (const b of bs) pushBox(x + b[0] / 16, y + b[1] / 16, z + b[2] / 16, x + b[3] / 16, y + b[4] / 16, z + b[5] / 16);
      }
    }
}

function clipAxis(b: Body, axis: number, d: number): number {
  const minX = b.x - b.hw,
    maxX = b.x + b.hw;
  const minY = b.y,
    maxY = b.y + b.h;
  const minZ = b.z - b.hw,
    maxZ = b.z + b.hw;
  for (let i = 0; i < nBoxes; i++) {
    const o = i * 6;
    const bx0 = boxes[o],
      by0 = boxes[o + 1],
      bz0 = boxes[o + 2],
      bx1 = boxes[o + 3],
      by1 = boxes[o + 4],
      bz1 = boxes[o + 5];
    if (axis === 1) {
      if (maxX <= bx0 + EPS || minX >= bx1 - EPS || maxZ <= bz0 + EPS || minZ >= bz1 - EPS) continue;
      if (d < 0 && by1 <= minY + EPS) d = Math.max(d, by1 - minY);
      else if (d > 0 && by0 >= maxY - EPS) d = Math.min(d, by0 - maxY);
    } else if (axis === 0) {
      if (maxY <= by0 + EPS || minY >= by1 - EPS || maxZ <= bz0 + EPS || minZ >= bz1 - EPS) continue;
      if (d < 0 && bx1 <= minX + EPS) d = Math.max(d, bx1 - minX);
      else if (d > 0 && bx0 >= maxX - EPS) d = Math.min(d, bx0 - maxX);
    } else {
      if (maxY <= by0 + EPS || minY >= by1 - EPS || maxX <= bx0 + EPS || minX >= bx1 - EPS) continue;
      if (d < 0 && bz1 <= minZ + EPS) d = Math.max(d, bz1 - minZ);
      else if (d > 0 && bz0 >= maxZ - EPS) d = Math.min(d, bz0 - maxZ);
    }
  }
  return d;
}

/** Déplace un corps en résolvant les collisions (Y, puis X, puis Z). */
export function moveBody(world: World, b: Body, dx: number, dy: number, dz: number, stepHeight = 0): void {
  const pad = 1;
  collect(world, b.x - b.hw + Math.min(dx, 0) - pad, b.y + Math.min(dy, 0) - pad, b.z - b.hw + Math.min(dz, 0) - pad, b.x + b.hw + Math.max(dx, 0) + pad, b.y + b.h + Math.max(dy, 0) + pad + stepHeight, b.z + b.hw + Math.max(dz, 0) + pad);
  const wasGround = b.onGround;
  const sx = b.x,
    sy = b.y,
    sz = b.z;
  const ry = clipAxis(b, 1, dy);
  b.y += ry;
  const rx = clipAxis(b, 0, dx);
  b.x += rx;
  const rz = clipAxis(b, 2, dz);
  b.z += rz;
  let hitH = Math.abs(rx - dx) > EPS || Math.abs(rz - dz) > EPS;
  b.onGround = dy < 0 && ry > dy + EPS;
  b.hitCeil = dy > 0 && ry < dy - EPS;
  // Montée de marche
  if (stepHeight > 0 && hitH && (wasGround || b.onGround) && dy <= 0) {
    const fx = b.x,
      fy = b.y,
      fz = b.z,
      fg = b.onGround;
    b.x = sx;
    b.y = sy;
    b.z = sz;
    const up = clipAxis(b, 1, stepHeight);
    b.y += up;
    const sx2 = clipAxis(b, 0, dx);
    b.x += sx2;
    const sz2 = clipAxis(b, 2, dz);
    b.z += sz2;
    const down = clipAxis(b, 1, -up - Math.max(0, -dy));
    b.y += down;
    const moved2 = sx2 * sx2 + sz2 * sz2;
    const moved1 = (fx - sx) ** 2 + (fz - sz) ** 2;
    if (moved2 > moved1 + 1e-5 && down < 0) {
      b.onGround = true;
      hitH = Math.abs(sx2 - dx) > EPS || Math.abs(sz2 - dz) > EPS;
    } else {
      b.x = fx;
      b.y = fy;
      b.z = fz;
      b.onGround = fg;
    }
  }
  b.hitH = hitH;
  if (Math.abs(b.x - sx - dx) > EPS) b.vx = 0;
  if (Math.abs(b.z - sz - dz) > EPS) b.vz = 0;
  if (b.onGround || b.hitCeil) b.vy = 0;
}

/** Met à jour les indicateurs d'environnement (eau, lave, échelle, ralentissement). */
export function probeEnvironment(world: World, b: Body, eyeHeight: number): void {
  const t = world.content.blocks;
  b.inWater = false;
  b.inLava = false;
  b.onLadder = false;
  b.slow = 0;
  const x0 = Math.floor(b.x - b.hw + 0.001),
    x1 = Math.floor(b.x + b.hw - 0.001);
  const z0 = Math.floor(b.z - b.hw + 0.001),
    z1 = Math.floor(b.z + b.hw - 0.001);
  const y0 = Math.floor(b.y + 0.001),
    y1 = Math.floor(b.y + b.h - 0.001);
  for (let x = x0; x <= x1; x++)
    for (let z = z0; z <= z1; z++)
      for (let y = y0; y <= y1; y++) {
        const id = world.getId(x, y, z);
        if (id === 0) continue;
        const lq = t.liquid[id];
        if (lq === LIQ_WATER) b.inWater = true;
        else if (lq === LIQ_LAVA) b.inLava = true;
        if (t.climbable[id]) b.onLadder = true;
        if (t.slow[id] > b.slow) b.slow = t.slow[id];
      }
  // Blocs ralentissants sous les pieds (sable cendré, boue)
  const under = world.getId(Math.floor(b.x), Math.floor(b.y - 0.05), Math.floor(b.z));
  if (t.slow[under] > b.slow && t.solid[under]) b.slow = t.slow[under];
  const eyeId = world.getId(Math.floor(b.x), Math.floor(b.y + eyeHeight), Math.floor(b.z));
  b.headInWater = t.liquid[eyeId] === LIQ_WATER;
}

/** Le corps chevauche-t-il un bloc solide ? (placement de blocs) */
export function bodyIntersectsBlock(b: Body, x: number, y: number, z: number): boolean {
  return b.x + b.hw > x && b.x - b.hw < x + 1 && b.y + b.h > y && b.y < y + 1 && b.z + b.hw > z && b.z - b.hw < z + 1;
}

/** Existe-t-il du sol sous une position (pour ne pas tomber en marchant accroupi) ? */
export function hasGroundBelow(world: World, x: number, y: number, z: number, hw: number): boolean {
  const t = world.content.blocks;
  const yy = Math.floor(y - 0.6);
  for (const [ox, oz] of [
    [-hw, -hw],
    [hw, -hw],
    [-hw, hw],
    [hw, hw],
  ]) {
    for (let k = 0; k <= 1; k++) {
      const id = world.getId(Math.floor(x + ox * 0.98), yy + k, Math.floor(z + oz * 0.98));
      if (t.solid[id]) return true;
    }
  }
  return false;
}
