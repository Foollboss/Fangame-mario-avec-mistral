import { Vector3 } from 'three';

// Arena geometry. x = width, y = up, z = length. Blue defends -z, orange defends +z.
export const ARENA = {
  W: 40.96, // half width
  L: 51.2, // half length (goal line)
  H: 20.44, // ceiling height
  RC: 12, // corner radius seen from above
  RV: 3, // radius of the floor/wall and wall/ceiling curves
  GW: 8.93, // goal half width
  GH: 6.43, // goal height
  GD: 8.8, // goal depth
  GEXT: 6.5, // how far the goal collision box pokes into the field
};

const { W, L, H, RC, RV, GW, GH, GD, GEXT } = ARENA;
const HH = H / 2;
const GOAL_HZ = (GD + GEXT) / 2;
const GOAL_CZ = L - GEXT + GOAL_HZ;

// Signed distance to the arena walls: negative inside the playable volume.
export function sdArena(x, y, z) {
  const r2 = RC - RV;
  const qx = Math.abs(x) - (W - RV) + r2;
  const qz = Math.abs(z) - (L - RV) + r2;
  const d2 = Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - r2;
  const qy = Math.abs(y - HH) - (HH - RV);
  const dA = Math.hypot(Math.max(d2, 0), Math.max(qy, 0)) + Math.min(Math.max(d2, qy), 0) - RV;

  const gx = Math.abs(x) - GW;
  const gy = Math.abs(y - GH / 2) - GH / 2;
  const gz = Math.abs(Math.abs(z) - GOAL_CZ) - GOAL_HZ;
  const dB = Math.hypot(Math.max(gx, 0), Math.max(gy, 0), Math.max(gz, 0)) + Math.min(Math.max(gx, gy, gz), 0);
  return dA < dB ? dA : dB;
}

// Unit normal pointing into the playable volume.
export function arenaNormal(x, y, z, out) {
  const e = 0.004;
  const nx = sdArena(x - e, y, z) - sdArena(x + e, y, z);
  const ny = sdArena(x, y - e, z) - sdArena(x, y + e, z);
  const nz = sdArena(x, y, z - e) - sdArena(x, y, z + e);
  const len = Math.hypot(nx, ny, nz) || 1;
  return out.set(nx / len, ny / len, nz / len);
}

// Returns the team that scores when the ball is at depth z, or -1.
export function scoringTeam(z, radius) {
  if (z > L + radius) return 0; // orange net -> blue scores
  if (z < -L - radius) return 1; // blue net -> orange scores
  return -1;
}

// z of the goal line a team defends.
export function ownGoalZ(team) {
  return team === 0 ? -L : L;
}

// Boost pads, converted from Rocket League coordinates.
const BIG = [
  [-3072, -4096], [3072, -4096], [-3584, 0], [3584, 0], [-3072, 4096], [3072, 4096],
];
const SMALL = [
  [0, -4240], [-1792, -4184], [1792, -4184], [-940, -3308], [940, -3308], [0, -2816],
  [-3584, -2484], [3584, -2484], [-1788, -2300], [1788, -2300], [-2048, -1036], [0, -1024],
  [2048, -1036], [-1024, 0], [1024, 0], [-2048, 1036], [0, 1024], [2048, 1036], [-1788, 2300],
  [1788, 2300], [-3584, 2484], [3584, 2484], [0, 2816], [-940, 3310], [940, 3308], [-1792, 4184],
  [1792, 4184], [0, 4240],
];

export function createBoostPads() {
  const pads = [];
  for (const [x, z] of BIG) pads.push({ pos: new Vector3(x / 100, 0, z / 100), big: true, active: true, timer: 0 });
  for (const [x, z] of SMALL) pads.push({ pos: new Vector3(x / 100, 0, z / 100), big: false, active: true, timer: 0 });
  return pads;
}

// Kickoff spots for the blue team; orange is the point mirror.
export const KICKOFF_SPOTS = [
  [-20.48, -25.6], [20.48, -25.6], [-2.56, -38.4], [2.56, -38.4], [0, -46.08],
];
export const KICKOFF_SETS = {
  1: [[0], [1], [2], [3], [4]],
  2: [[0, 1], [0, 3], [2, 1], [2, 4], [3, 4], [0, 4], [1, 4]],
  3: [[0, 1, 4], [0, 3, 4], [2, 1, 4], [0, 1, 2], [0, 1, 3]],
  4: [[0, 1, 2, 4], [0, 1, 3, 4]],
};

export const RESPAWN_SPOTS = [[-23.04, -46.08], [23.04, -46.08], [-26.88, -46.08], [26.88, -46.08]];
