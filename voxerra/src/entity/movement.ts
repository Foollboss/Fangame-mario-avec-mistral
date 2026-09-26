/** Déplacement du joueur (et des humanoïdes) : marche, course, saut, nage, vol, échelles. */
import type { World } from '../world/world';
import { moveBody, probeEnvironment, hasGroundBelow, type Body } from '../physics/collision';

export interface MoveIntent {
  forward: number; // −1..1
  strafe: number; // −1..1
  jump: boolean;
  sneak: boolean;
  sprint: boolean;
  flying: boolean;
}

export const newIntent = (): MoveIntent => ({ forward: 0, strafe: 0, jump: false, sneak: false, sprint: false, flying: false });

export interface MoveParams {
  walk: number;
  sprintMul: number;
  sneakMul: number;
  gravity: number;
  jumpVel: number;
  stepHeight: number;
  speedMul: number; // effets (vitesse, lenteur…)
  flySpeed: number;
  slowFall: boolean;
}

export const PLAYER_MOVE: MoveParams = {
  walk: 4.4,
  sprintMul: 1.33,
  sneakMul: 0.32,
  gravity: 30,
  jumpVel: 8.6,
  stepHeight: 0.6,
  speedMul: 1,
  flySpeed: 11,
  slowFall: false,
};

/**
 * Intègre un pas de déplacement. Renvoie la vitesse verticale d'impact
 * (négative) si le corps vient de toucher le sol, sinon 0.
 */
export function stepMovement(world: World, b: Body, yaw: number, intent: MoveIntent, p: MoveParams, dt: number, eyeHeight: number): number {
  probeEnvironment(world, b, eyeHeight);
  const sin = Math.sin(yaw),
    cos = Math.cos(yaw);
  // direction souhaitée (yaw = 0 regarde vers −Z)
  let mx = -sin * intent.forward + cos * intent.strafe;
  let mz = -cos * intent.forward - sin * intent.strafe;
  const ml = Math.hypot(mx, mz);
  if (ml > 1) {
    mx /= ml;
    mz /= ml;
  }
  let speed = p.walk * p.speedMul;
  if (intent.flying) speed = p.flySpeed * (intent.sprint ? 2 : 1);
  else if (intent.sneak) speed *= p.sneakMul;
  else if (intent.sprint && intent.forward > 0) speed *= p.sprintMul;
  if (b.inWater && !intent.flying) speed *= 0.55;
  if (b.inLava && !intent.flying) speed *= 0.35;
  if (b.slow > 0 && !intent.flying) speed *= 1 - b.slow;

  const tvx = mx * speed,
    tvz = mz * speed;
  const accel = intent.flying ? 8 : b.onGround ? 14 : b.inWater ? 5 : 3.2;
  const k = Math.min(1, accel * dt);
  b.vx += (tvx - b.vx) * k;
  b.vz += (tvz - b.vz) * k;

  const wasGround = b.onGround;
  const impactVy = b.vy;
  if (intent.flying) {
    const target = intent.jump ? p.flySpeed * 0.75 : intent.sneak ? -p.flySpeed * 0.75 : 0;
    b.vy += (target - b.vy) * Math.min(1, 10 * dt);
    b.fallDist = 0;
  } else if (b.onLadder && !b.onGround) {
    if (intent.jump || (b.hitH && intent.forward > 0)) b.vy = 3;
    else if (intent.sneak) b.vy = 0;
    else b.vy = Math.max(b.vy - p.gravity * dt, -2.6);
    b.fallDist = 0;
  } else if (b.inWater || b.inLava) {
    const g = b.inLava ? 5 : 7;
    b.vy -= g * dt;
    if (intent.jump) b.vy += 22 * dt;
    b.vy *= Math.pow(0.2, dt);
    b.vy = Math.max(-4, Math.min(4.5, b.vy));
    // sortie de l'eau : petit élan pour franchir un bord
    if (intent.jump && b.hitH) b.vy = 5.5;
    b.fallDist = 0;
  } else {
    if (intent.jump && b.onGround) {
      b.vy = p.jumpVel;
      b.onGround = false;
    }
    b.vy -= p.gravity * dt;
    const term = p.slowFall ? -3 : -60;
    if (b.vy < term) b.vy = term;
  }
  if (b.onLadder && b.onGround && intent.jump) b.vy = Math.max(b.vy, 3);

  let dx = b.vx * dt,
    dz = b.vz * dt;
  const dy = b.vy * dt;
  // Accroupi : ne pas tomber des rebords
  if (intent.sneak && b.onGround && !intent.flying) {
    if (!hasGroundBelow(world, b.x + dx, b.y, b.z, b.hw)) {
      if (!hasGroundBelow(world, b.x + dx, b.y, b.z, b.hw)) dx = 0;
      if (!hasGroundBelow(world, b.x, b.y, b.z + dz, b.hw)) dz = 0;
      if (!hasGroundBelow(world, b.x + dx, b.y, b.z + dz, b.hw)) {
        dx = 0;
        dz = 0;
      }
    }
  }
  const y0 = b.y;
  moveBody(world, b, dx, dy, dz, intent.sneak || b.onGround || wasGround ? p.stepHeight : 0);
  if (!intent.flying && !b.onGround && b.y < y0 && !b.inWater && !b.onLadder) b.fallDist += y0 - b.y;
  // nuage d'azur : on rebondit (sauf accroupi), sans dégâts de chute
  if (b.onGround && !intent.flying && !intent.sneak) {
    const bounce = world.content.blocks.bounce[world.getId(Math.floor(b.x), Math.floor(b.y - 0.05), Math.floor(b.z))];
    if (bounce > 0) {
      b.vy = Math.max(bounce, -impactVy * 0.8);
      b.onGround = false;
      b.fallDist = 0;
      return 0;
    }
  }
  if (b.onGround && !wasGround) return impactVy;
  return 0;
}
