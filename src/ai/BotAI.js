import { Vector3, Quaternion } from 'three';
import { ARENA, BALL, CAR, PHYS, attackSign } from '../core/Config.js';
import { clamp, wrapAngle } from '../core/MathUtil.js';
import { createControllerState } from '../game/VehicleController.js';

export const DIFFICULTIES = {
  easy: {
    label: 'FACILE', reaction: 0.45, speedCap: 0.75, boostUse: 0.15, jumpSkill: 0.35, dodgeSkill: 0.1,
    aerial: 0, aimError: 9, horizon: 1.4, rotation: 0.3, steerGain: 2.0, kickoffDodge: false, passes: 0, xp: 0.8,
  },
  medium: {
    label: 'MOYEN', reaction: 0.24, speedCap: 0.93, boostUse: 0.55, jumpSkill: 0.65, dodgeSkill: 0.45,
    aerial: 0, aimError: 4.5, horizon: 2.4, rotation: 0.6, steerGain: 2.6, kickoffDodge: true, passes: 0.3, xp: 1,
  },
  hard: {
    label: 'DIFFICILE', reaction: 0.13, speedCap: 0.97, boostUse: 0.85, jumpSkill: 0.9, dodgeSkill: 0.8,
    aerial: 0.45, aimError: 2.2, horizon: 3.2, rotation: 0.85, steerGain: 3.0, kickoffDodge: true, passes: 0.55, xp: 1.25,
  },
  expert: {
    label: 'EXPERT', reaction: 0.06, speedCap: 1, boostUse: 1, jumpSkill: 1, dodgeSkill: 1,
    aerial: 0.9, aimError: 1, horizon: 3.8, rotation: 1, steerGain: 3.4, kickoffDodge: true, passes: 0.75, xp: 1.5,
  },
};

const R = BALL.radius;
const HL = ARENA.halfLength;
const HW = ARENA.halfWidth;
const _v = new Vector3();
const _v2 = new Vector3();
const _qi = new Quaternion();

function timeToCover(dist, v0, vmax, acc) {
  if (dist <= 0) return 0;
  v0 = Math.max(0, Math.min(v0, vmax));
  const ta = (vmax - v0) / acc;
  const da = ((v0 + vmax) / 2) * ta;
  if (dist <= da) return (-v0 + Math.sqrt(v0 * v0 + 2 * acc * dist)) / acc;
  return ta + (dist - da) / vmax;
}

// Earliest predicted ball position this car can reach in time (ignores heights above maxHeight).
export function estimateIntercept(car, world, predictor, maxHeight, horizon) {
  const p = car.physics;
  const yaw = p.grounded ? p.yaw : p.headingYaw();
  const fx = Math.sin(yaw), fz = Math.cos(yaw);
  const speed = Math.hypot(p.vel.x, p.vel.z);
  const boostOk = car.boost > 12 || world.infiniteBoost;
  const vmax = boostOk ? 55 : CAR.maxThrottleSpeed * p.stats.speed;
  const d = predictor.data;
  const n = Math.min(predictor.count, Math.round(horizon / predictor.sampleDt));
  let last = null;
  for (let i = 0; i < n; i++) {
    const k = i * 6;
    const bx = d[k], by = d[k + 1], bz = d[k + 2];
    const t = (i + 1) * predictor.sampleDt;
    last = { t, x: bx, y: by, z: bz, reachable: false };
    if (by > maxHeight) continue;
    const dx = bx - p.pos.x, dz = bz - p.pos.z;
    const len = Math.hypot(dx, dz) || 1;
    const dist = Math.max(0, len - (R + 1.8));
    const cos = (dx * fx + dz * fz) / len;
    const ang = Math.acos(clamp(cos, -1, 1));
    const tReach = (ang / 2.4) * 0.8 + timeToCover(dist, speed * Math.max(0, cos), vmax, 32) + (by > 5 ? 0.25 : 0);
    if (tReach <= t) return { t, x: bx, y: by, z: bz, reachable: true };
  }
  return last || { t: 0, x: world.ball.pos.x, y: world.ball.pos.y, z: world.ball.pos.z, reachable: false };
}

// Assigns attacker / support / defender roles inside a team (humans included, so bots adapt to
// a human teammate instead of all chasing the ball).
export class TeamBrain {
  constructor(world, team) {
    this.world = world;
    this.team = team;
    this.roles = new Map();
    this.timer = 0;
    this.attacker = null;
    this.kickoffTaker = null;
    this.intercepts = new Map();
  }

  update(dt, predictor, kickoff) {
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = 0.2;
    const members = this.world.cars.filter((c) => c.team === this.team);
    const sgn = attackSign(this.team);
    const ball = this.world.ball.pos;
    if (kickoff) {
      let best = null, bd = Infinity;
      for (const c of members) {
        const d = Math.hypot(c.pos.x - ball.x, c.pos.z - ball.z) + (c.pos.x < 0 ? 0.01 : 0);
        if (d < bd) { bd = d; best = c; }
      }
      this.kickoffTaker = best;
    } else {
      this.kickoffTaker = null;
    }
    const scored = members.map((c) => {
      if (c.demolished) return { c, s: 99 };
      const est = estimateIntercept(c, this.world, predictor, c.isBot ? 9 : 10, 4);
      this.intercepts.set(c.id, est);
      const goalSide = (ball.z - c.pos.z) * sgn > -3;
      const s = est.t + (est.reachable ? 0 : 2.5) + (goalSide ? 0 : 1.3);
      return { c, s };
    }).sort((a, b) => a.s - b.s);
    let attacker = scored[0]?.c || null;
    const prev = this.attacker && scored.find((x) => x.c === this.attacker);
    if (prev && prev.s < scored[0].s + 0.35 && !prev.c.demolished) attacker = prev.c;
    this.attacker = attacker;
    const ownZ = -sgn * HL;
    const rest = members.filter((c) => c !== attacker && !c.demolished);
    rest.sort((a, b) => Math.abs(a.pos.z - ownZ) - Math.abs(b.pos.z - ownZ));
    this.roles.clear();
    if (attacker) this.roles.set(attacker.id, 'attacker');
    // Closest to our goal stays back, everyone else supports the attack.
    rest.forEach((c, i) => this.roles.set(c.id, i === 0 ? 'defender' : 'support'));
  }

  roleOf(car) {
    return this.roles.get(car.id) || 'attacker';
  }
}

export class BotAI {
  constructor(car, world, difficulty = 'medium', rng = Math.random) {
    this.car = car;
    this.world = world;
    this.skill = DIFFICULTIES[difficulty] || DIFFICULTIES.medium;
    this.rng = rng;
    this.input = createControllerState();
    this.decision = 0;
    this.plan = { tx: 0, tz: 0, speed: 0, boost: false, ball: null, mode: 'idle' };
    this.aimOffset = 0;
    this.willJump = false;
    this.willDodge = false;
    this.jumpSeq = null;
    this.aerial = null;
    this.stuck = 0;
    this.reverse = 0;
    this.cooldown = 0;
  }

  update(dt, ctx) {
    const inp = this.input;
    const car = this.car;
    inp.jump = false;
    inp.dash = false;
    inp.boost = false;
    if (car.demolished) {
      inp.throttle = 0; inp.steer = 0;
      return inp;
    }
    this.cooldown -= dt;
    this.decision -= dt;
    if (this.decision <= 0) {
      this.decide(ctx);
      this.decision = this.skill.reaction * (0.75 + this.rng() * 0.5);
    }
    this.execute(dt, ctx);
    return inp;
  }

  // ---------- decisions ----------
  decide(ctx) {
    const sk = this.skill;
    const car = this.car;
    const brain = ctx.brain;
    const role = brain.roleOf(car);
    this.aimOffset = (this.rng() - 0.5) * 2 * sk.aimError;
    this.willJump = this.rng() < sk.jumpSkill;
    this.willDodge = this.rng() < sk.dodgeSkill;
    this.useBoost = this.rng() < sk.boostUse;
    if (this.aerial) return;

    if (ctx.kickoff) {
      if (brain.kickoffTaker === car) return this.planKickoff();
      return role === 'defender' || this.world.teamCars(car.team).length <= 2 ? this.planDefend(ctx, false) : this.planSupport(ctx);
    }
    let r = role;
    // Weaker bots lose discipline and chase the ball instead of holding their role.
    if (r !== 'attacker' && this.rng() > sk.rotation + 0.25) r = 'attacker';
    const danger = this.inDanger(ctx);
    const solo = this.world.teamCars(car.team).length === 1;
    if (r === 'attacker') {
      if (danger && sk.rotation >= 0.5 && !this.goalSideOfBall()) return this.planSave(ctx);
      if (this.shouldShadow(ctx)) return this.planDefend(ctx, false);
      return this.planAttack(ctx, danger);
    }
    if (danger && (r === 'defender' || solo)) return sk.rotation >= 0.5 ? this.planSave(ctx) : this.planAttack(ctx, true);
    if (r === 'defender') return this.planDefend(ctx, false);
    return this.planSupport(ctx);
  }

  goalSideOfBall() {
    const sgn = attackSign(this.car.team);
    return (this.world.ball.pos.z - this.car.pos.z) * sgn > 1;
  }

  inDanger(ctx) {
    const g = ctx.predictor.goal;
    if (g && g.team !== this.car.team && g.t < 2.6) return true;
    const sgn = attackSign(this.car.team);
    const b = this.world.ball;
    const distOwn = Math.hypot(b.pos.x, b.pos.z + sgn * HL);
    return distOwn < 30 && b.vel.z * sgn < -5;
  }

  // 1v1 / last man: don't dive in when the opponent clearly gets there first.
  shouldShadow(ctx) {
    if (this.skill.rotation < 0.5) return false;
    const mates = this.world.teamCars(this.car.team).filter((c) => c !== this.car && !c.demolished);
    if (mates.length) return false;
    const mine = ctx.brain.intercepts.get(this.car.id);
    const opp = ctx.oppBrain && ctx.oppBrain.attacker && ctx.oppBrain.intercepts.get(ctx.oppBrain.attacker.id);
    if (!mine || !opp) return false;
    const sgn = attackSign(this.car.team);
    const b = this.world.ball.pos;
    const goalSide = (b.z - this.car.pos.z) * sgn > 2;
    return goalSide && opp.t + 0.5 < mine.t && Math.abs(b.z + sgn * HL) < HL * 1.2;
  }

  planKickoff() {
    this.plan.mode = 'kickoff';
    this.plan.tx = 0;
    this.plan.tz = 0;
    this.plan.speed = 60;
    this.plan.boost = this.skill.boostUse > 0.3;
    this.plan.ball = null;
  }

  canAerial() {
    return this.skill.aerial > 0 && (this.car.boost > 30 || this.world.infiniteBoost);
  }

  planAttack(ctx, clearing) {
    const sk = this.skill;
    const car = this.car;
    const p = car.physics;
    const sgn = attackSign(car.team);
    const reach = this.canAerial() ? 24 : sk.jumpSkill > 0.5 ? 9.5 : 6.5;
    const est = estimateIntercept(car, this.world, ctx.predictor, reach, sk.horizon);
    const P = est;
    const ownZ = -sgn * HL;
    let ax = clamp(P.x * 0.25 + this.aimOffset, -ARENA.goalHalfWidth + 3, ARENA.goalHalfWidth - 3);
    let az = sgn * (HL + 4);
    const depth = (P.z - ownZ) * sgn; // distance from own goal line along the field
    if (clearing || depth < 38) {
      // Clear towards the side and up-field, never across our own goal.
      const side = Math.sign(P.x) || (this.rng() < 0.5 ? -1 : 1);
      ax = P.x + side * 28;
      az = P.z + sgn * 45;
    } else if (sk.passes > 0 && Math.abs(P.x) > 24 && P.z * sgn > 28 && this.rng() < sk.passes) {
      const mate = this.world.teamCars(car.team).find((c) => c !== car && !c.demolished && c.pos.z * sgn > 22 && Math.abs(c.pos.x) < 20);
      if (mate) {
        ax = mate.pos.x;
        az = mate.pos.z + sgn * 6;
        this.plan.pass = true;
      }
    }
    let sx = ax - P.x, sz = az - P.z;
    const sl = Math.hypot(sx, sz) || 1;
    sx /= sl; sz /= sl;
    const dx = P.x - p.pos.x, dz = P.z - p.pos.z;
    const dist = Math.hypot(dx, dz) || 1;
    // Shot-line frame: `along` < 0 means the car is behind the ball relative to the shot.
    const along = -(dx * sx + dz * sz);
    const lateral = -(dx * -sz + dz * sx);
    const contact = R + CAR.halfExtents.z * 0.8;
    let tx, tz;
    if (along < -contact * 0.6) {
      // Converge onto the shot line: the aim point slides towards the ball as we line up.
      const back = contact + Math.min(22, Math.abs(lateral) * 1.1);
      tx = P.x - sx * back;
      tz = P.z - sz * back;
    } else {
      // Beside or in front of the ball: loop around on our side to get behind it.
      const side = Math.sign(lateral) || 1;
      tx = P.x - sx * (contact + 9) + -sz * side * (R + 7);
      tz = P.z - sz * (contact + 9) + sx * side * (R + 7);
    }
    // Imprecise bots misjudge the approach line.
    const wobble = this.skill.aimError * 0.35;
    tx += (this.rng() - 0.5) * wobble;
    tz += (this.rng() - 0.5) * wobble;
    const towardsOwn = (-dz * sgn) / dist;
    if (towardsOwn > 0.55 && depth < 60 && Math.abs(P.x) < 30 && along > -contact) {
      const side = Math.sign(p.pos.x - P.x) || 1;
      tx = P.x + side * 11;
      tz = P.z - sgn * 9;
    }
    this.plan.mode = 'attack';
    this.plan.tx = tx;
    this.plan.tz = tz;
    // Full power only when lined up; otherwise keep enough control to adjust.
    const lined = along < -contact * 0.6 && Math.abs(lateral) < 2.5;
    this.plan.lined = lined;
    let speed = lined ? 60 : 40;
    if (est.reachable && est.t > 0.4 && P.y > 5) speed = clamp(dist / est.t, 12, 60);
    this.plan.speed = speed;
    this.plan.boost = this.useBoost;
    this.plan.ball = est;
    this.plan.shotX = sx;
    this.plan.shotZ = sz;

    if (this.aerialCandidate(est, dist)) this.startAerial(est);
  }

  aerialCandidate(est, dist) {
    const p = this.car.physics;
    if (!this.canAerial() || !p.grounded || this.cooldown > 0) return false;
    if (!est.reachable || est.y < 9.5 || est.t < 0.8 || est.t > 2.8) return false;
    const yaw = p.yaw;
    const ang = Math.abs(wrapAngle(Math.atan2(est.x - p.pos.x, est.z - p.pos.z) - yaw));
    if (ang > 0.4) return false;
    // needs enough height budget: rough upward reach in the available time
    const reachable = 3 + est.t * 14;
    return est.y < reachable && dist < est.t * 55 && this.rng() < this.skill.aerial;
  }

  startAerial(est) {
    this.aerial = { t: 0, tHit: est.t, x: est.x, y: est.y, z: est.z };
    this.cooldown = 1.5;
  }

  // Ball heading into our goal: clear it if we can get there goal-side, otherwise race to the line.
  planSave(ctx) {
    const car = this.car;
    const sgn = attackSign(car.team);
    const ownZ = -sgn * HL;
    const g = ctx.predictor.goal;
    const horizon = g && g.team !== car.team ? g.t : 2.5;
    const est = estimateIntercept(car, this.world, ctx.predictor, 9.5, Math.min(this.skill.horizon, horizon));
    if (est.reachable && (est.z - car.pos.z) * sgn > 0.5) return this.planAttack(ctx, true);
    let cx = this.world.ball.pos.x;
    if (g && g.team !== car.team) {
      ctx.predictor.sampleAt(g.t, _v);
      cx = _v.x;
    }
    this.plan.mode = 'save';
    this.plan.tx = clamp(cx, -ARENA.goalHalfWidth + 3, ARENA.goalHalfWidth - 3);
    this.plan.tz = ownZ - sgn * 1.5;
    this.plan.speed = 60;
    this.plan.boost = true;
    this.plan.ball = null;
  }

  planDefend(ctx, danger) {
    if (danger) return this.planAttack(ctx, true);
    const car = this.car;
    const sgn = attackSign(car.team);
    const b = this.world.ball.pos;
    const ownZ = -sgn * HL;
    const distOwn = Math.hypot(b.x, b.z - ownZ);
    this.plan.ball = null;
    this.plan.speed = 60;
    if (this.skill.rotation >= 0.6 && distOwn < 58) {
      // Goalkeeper: stand in the mouth of the goal, shifted towards the ball.
      this.plan.mode = 'keeper';
      this.plan.tx = clamp(b.x * 0.3, -9, 9);
      this.plan.tz = ownZ + sgn * 3.5;
      this.plan.boost = this.useBoost && Math.abs(car.pos.z - ownZ) > 45;
      return;
    }
    const inOwnHalf = b.z * sgn < 0;
    const k = inOwnHalf ? 0.28 : 0.42;
    let tz = ownZ + (b.z - ownZ) * k;
    tz = sgn > 0 ? Math.max(tz, ownZ + 7) : Math.min(tz, ownZ - 7);
    this.plan.mode = 'defend';
    this.plan.tx = b.x * k * 0.8;
    this.plan.tz = tz;
    this.plan.boost = this.useBoost && Math.hypot(this.plan.tx - car.pos.x, tz - car.pos.z) > 40;
  }

  planSupport(ctx) {
    const car = this.car;
    const sgn = attackSign(car.team);
    const b = this.world.ball.pos;
    // Second man: trail the play close enough to pounce on rebounds.
    let tz = clamp(b.z - sgn * 16, -HL + 10, HL - 10);
    let tx = b.x * 0.5 + (b.x > 0 ? -10 : 10);
    this.plan.mode = 'support';
    if (car.boost < 25 && this.skill.rotation > 0.4 && !this.world.infiniteBoost) {
      let best = null, bd = 34;
      for (const pad of this.world.boost.pads) {
        if (!pad.active) continue;
        const d = Math.hypot(pad.x - car.pos.x, pad.z - car.pos.z);
        const val = pad.big ? d * 0.6 : d;
        if (val < bd && (pad.z - b.z) * sgn < 10) { bd = val; best = pad; }
      }
      if (best) {
        tx = best.x;
        tz = best.z;
        this.plan.mode = 'boost';
      }
    }
    this.plan.tx = tx;
    this.plan.tz = tz;
    this.plan.speed = 60;
    this.plan.boost = false;
    this.plan.ball = null;
  }

  // ---------- execution ----------
  execute(dt, ctx) {
    const car = this.car;
    const p = car.physics;
    const inp = this.input;
    if (this.aerial) return this.runAerial(dt, ctx);

    if (!p.grounded && !this.jumpSeq) {
      this.airRecovery();
      return;
    }
    let { tx, tz } = this.plan;
    if (this.plan.mode !== 'attack' && this.plan.mode !== 'kickoff') [tx, tz] = this.avoidBall(tx, tz);
    const mode = this.plan.mode;
    [tx, tz] = this.clampTarget(tx, tz, mode === 'save' || mode === 'keeper');
    const arrive = mode === 'defend' || mode === 'support' || mode === 'keeper' || mode === 'save';
    const distT = Math.hypot(tx - p.pos.x, tz - p.pos.z);
    let speed = Math.min(this.plan.speed, 60 * this.skill.speedCap);
    if (arrive) speed = Math.min(speed, 8 + distT * 1.6);
    if (arrive && distT < 4) {
      // Parked: face the ball
      const b = this.world.ball.pos;
      this.driveTo(b.x, b.z, 4, false);
    } else {
      this.driveTo(tx, tz, speed, this.plan.boost);
    }
    this.handleStuck(dt);
    this.handleJumps(dt, ctx);
    if (this.plan.mode === 'kickoff') {
      const d = Math.hypot(p.pos.x, p.pos.z);
      if (this.skill.kickoffDodge && d < 13 + p.forwardSpeed * 0.1 && p.grounded && Math.abs(p.pos.x) < 20) {
        inp.dash = true;
        inp.dodgeX = 0; inp.dodgeY = 1;
      }
    }
  }

  clampTarget(tx, tz, allowGoal = false) {
    const lim = HW - 4;
    tx = clamp(tx, -lim, lim);
    const zl = allowGoal && Math.abs(tx) < ARENA.goalHalfWidth - 2 ? HL + 3 : HL - 3;
    tz = clamp(tz, -zl, zl);
    const cc = HW + HL - ARENA.corner - 5;
    const s = Math.abs(tx) + Math.abs(tz);
    if (s > cc) {
      const k = cc / s;
      tx *= k; tz *= k;
    }
    return [tx, tz];
  }

  avoidBall(tx, tz) {
    const p = this.car.physics.pos;
    const b = this.world.ball.pos;
    if (b.y > 8) return [tx, tz];
    const dx = tx - p.x, dz = tz - p.z;
    const len2 = dx * dx + dz * dz;
    if (len2 < 1) return [tx, tz];
    const t = clamp(((b.x - p.x) * dx + (b.z - p.z) * dz) / len2, 0, 1);
    const cx = p.x + dx * t, cz = p.z + dz * t;
    const d = Math.hypot(b.x - cx, b.z - cz);
    if (d > R + 4 || t <= 0.05 || t >= 0.95) return [tx, tz];
    const side = Math.sign(p.x - b.x) || 1;
    return [b.x + side * (R + 7), b.z + (tz - b.z) * 0.3];
  }

  driveTo(tx, tz, desiredSpeed, boostOk) {
    const p = this.car.physics;
    const inp = this.input;
    const dx = tx - p.pos.x, dz = tz - p.pos.z;
    const dist = Math.hypot(dx, dz);
    const yaw = p.grounded ? p.yaw : p.headingYaw();
    const ang = wrapAngle(Math.atan2(dx, dz) - yaw);
    let steer = clamp(-ang * this.skill.steerGain, -1, 1);
    const vf = p.forwardSpeed;
    // Don't arrive faster than the turn allows (turn radius = v / yawRate).
    const sinA = Math.abs(ang) > Math.PI / 2 ? 1 : Math.max(0.06, Math.sin(Math.abs(ang)));
    const vTurn = (CAR.turnRate * p.stats.handling * dist) / (2 * sinA);
    desiredSpeed = Math.min(desiredSpeed, Math.max(14, vTurn));
    let throttle = 1;
    const cruise = CAR.maxThrottleSpeed * this.skill.speedCap;
    if (vf > cruise && !this.plan.lined) throttle = 0;
    if (vf > desiredSpeed + 6) throttle = -0.7;
    else if (vf > desiredSpeed) throttle = 0;
    const sharp = Math.abs(ang);
    if ((sharp > 1.35 && vf > 22) || (sharp > 0.7 && vf > 40)) throttle = 0;
    if (this.reverse > 0) {
      throttle = -1;
      steer = -steer;
    } else if (Math.abs(ang) > 2.5 && dist < 16 && vf < 6) {
      throttle = -1;
      steer = Math.sign(ang);
    }
    inp.throttle = throttle;
    inp.steer = steer;
    inp.pitch = 0;
    inp.boost = !!boostOk && this.reverse <= 0 && vf < 60 * this.skill.speedCap && Math.abs(ang) < 0.3 && vf < desiredSpeed && desiredSpeed > 34 && dist > 8 && (this.car.boost > 1 || this.world.infiniteBoost);
  }

  handleStuck(dt) {
    const p = this.car.physics;
    if (this.reverse > 0) {
      this.reverse -= dt;
      return;
    }
    if (p.grounded && this.input.throttle > 0.5 && Math.abs(p.forwardSpeed) < 2.5) this.stuck += dt;
    else this.stuck = Math.max(0, this.stuck - dt * 2);
    if (this.stuck > 1.1) {
      this.stuck = 0;
      this.reverse = 0.7;
    }
  }

  handleJumps(dt, ctx) {
    const car = this.car;
    const p = car.physics;
    const inp = this.input;
    const b = this.world.ball;
    if (this.jumpSeq) {
      const js = this.jumpSeq;
      js.t += dt;
      inp.jump = js.t < 0.2 || (js.double && js.t > 0.26 && js.t < 0.3);
      // Flip into the ball when close (harder bots)
      if (js.t > 0.2 && !js.dodged && this.skill.dodgeSkill > 0.6) {
        _v.copy(b.pos).sub(p.pos);
        if (_v.length() < R + 3.2) {
          this.dodgeTowards(b.pos);
          js.dodged = true;
        }
      }
      if (js.t > 1.4 || (js.t > 0.3 && p.grounded)) this.jumpSeq = null;
      if (!p.grounded) this.airRecovery(true);
      return;
    }
    if (!p.grounded || this.cooldown > 0) return;
    _v.copy(b.pos).sub(p.pos);
    const dh = Math.hypot(_v.x, _v.z);
    const ang = Math.abs(wrapAngle(Math.atan2(_v.x, _v.z) - p.yaw));
    if (ang > 0.4) return;
    const closing = -((b.vel.x - p.vel.x) * _v.x + (b.vel.z - p.vel.z) * _v.z) / (dh || 1);
    const gap = dh - (R + CAR.halfExtents.z);
    const tContact = gap / Math.max(closing, 1);
    const h = b.pos.y;
    if (h > 4.6 && h < 11 && this.willJump) {
      const lead = h < 6.8 ? 0.34 : 0.6;
      if (tContact < lead && tContact > 0) {
        this.jumpSeq = { t: 0, double: h > 6.8, dodged: false };
        this.cooldown = 0.8;
        inp.jump = true;
      }
    } else if (h <= 4.6 && this.willDodge && this.plan.lined && p.forwardSpeed > 14 && tContact < 0.2 && gap < 5 && this.plan.mode === 'attack') {
      // Ground dash into the ball for a powerful shot, aimed along the planned shot line
      this.dodgeTowards(b.pos);
      this.cooldown = 1.0;
    }
  }

  dodgeTowards(target) {
    const p = this.car.physics;
    const yaw = p.grounded ? p.yaw : p.headingYaw();
    const dx = target.x - p.pos.x, dz = target.z - p.pos.z;
    const fx = Math.sin(yaw), fz = Math.cos(yaw);
    const rx = -fz, rz = fx;
    const f = dx * fx + dz * fz;
    const r = dx * rx + dz * rz;
    const l = Math.hypot(f, r) || 1;
    this.input.dash = true;
    this.input.dodgeX = r / l;
    this.input.dodgeY = f / l;
  }

  // Keep wheels down while airborne.
  airRecovery(soft = false) {
    const p = this.car.physics;
    p.forward(_v);
    p.up(_v2);
    const inp = this.input;
    inp.pitch = clamp(_v.y * 3, -1, 1) * (soft ? 0.5 : 1);
    inp.steer = 0;
    inp.throttle = 1;
    if (_v2.y < 0.2 && !soft) inp.pitch = clamp(inp.pitch + 0.5, -1, 1);
  }

  runAerial(dt, ctx) {
    const a = this.aerial;
    const car = this.car;
    const p = car.physics;
    const inp = this.input;
    a.t += dt;
    if (a.t < 0.2) inp.jump = true;
    else if (a.t > 0.26 && a.t < 0.3) inp.jump = true;
    const T = a.tHit - a.t;
    if (T < -0.35 || (a.t > 0.5 && p.grounded)) {
      this.aerial = null;
      return;
    }
    // Refresh the target from the latest prediction
    if (ctx.predictor && T > 0.05) {
      ctx.predictor.sampleAt(T, _v);
      a.x = _v.x; a.y = _v.y; a.z = _v.z;
    }
    const tt = Math.max(0.15, T);
    const ax = (2 * (a.x - p.pos.x - p.vel.x * tt)) / (tt * tt);
    const ay = (2 * (a.y - p.pos.y - p.vel.y * tt)) / (tt * tt) + PHYS.gravity;
    const az = (2 * (a.z - p.pos.z - p.vel.z * tt)) / (tt * tt);
    _v.set(ax, ay, az);
    const need = _v.length();
    _v.multiplyScalar(1 / (need || 1));
    _qi.copy(p.quat).invert();
    _v2.copy(_v).applyQuaternion(_qi);
    const yawErr = Math.atan2(_v2.x, _v2.z);
    const pitchErr = Math.atan2(_v2.y, Math.hypot(_v2.x, _v2.z));
    inp.steer = clamp(-yawErr * 3 + p.angVel.y * 0.25, -1, 1);
    inp.pitch = clamp(-pitchErr * 3 - p.angVel.x * 0.25, -1, 1);
    inp.throttle = 1;
    p.forward(_v2);
    inp.boost = _v2.dot(_v) > 0.82 && need > 6 && (car.boost > 0 || this.world.infiniteBoost);
    const b = this.world.ball.pos;
    if (a.t > 0.35 && Math.hypot(b.x - p.pos.x, b.y - p.pos.y, b.z - p.pos.z) < R + 3 && this.skill.dodgeSkill > 0.8) {
      this.dodgeTowards(b);
      this.aerial = null;
    }
  }
}
