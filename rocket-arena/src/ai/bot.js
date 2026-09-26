import { Vector3, Quaternion, Matrix4 } from 'three';
import { PHYS, DIFFICULTIES } from '../config.js';
import { ARENA, ownGoalZ } from '../sim/arena.js';
import { predictedGoal } from '../sim/match.js';

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const R = PHYS.ballRadius;
const G = new Vector3(0, PHYS.gravity, 0);

const v1 = new Vector3();
const v2 = new Vector3();
const v3 = new Vector3();
const loc = new Vector3();
const qInv = new Quaternion();
const qT = new Quaternion();
const m4 = new Matrix4();

function throttleAccel(s) {
  if (s < 14) return 16 - 14.4 * (s / 14);
  if (s < 14.1) return 1.6 * (14.1 - s) / 0.1;
  return 0;
}

function resetControls(c) {
  c.throttle = 0; c.steer = 0; c.pitch = 0; c.yaw = 0; c.roll = 0;
  c.jump = false; c.boost = false; c.handbrake = false;
}

// Direction to a world point expressed in the car frame: {angle (+ = right), dist, local}.
function localTarget(car, target) {
  qInv.copy(car.quat).invert();
  loc.copy(target).sub(car.pos).applyQuaternion(qInv);
  return { angle: Math.atan2(loc.z, loc.x), dist: Math.hypot(loc.x, loc.z), lx: loc.x, ly: loc.y, lz: loc.z };
}

function forwardSpeed(car) {
  car.forward(v3);
  return car.vel.dot(v3);
}

// PD attitude controller: points the nose along `fwd` with the roof towards `upHint`.
export function orient(car, c, fwd, upHint) {
  const f = v1.copy(fwd).normalize();
  const r = v2.crossVectors(f, upHint);
  if (r.lengthSq() < 1e-4) car.right(r);
  r.normalize();
  const u = v3.crossVectors(r, f).normalize();
  m4.makeBasis(f, u, r);
  qT.setFromRotationMatrix(m4);
  qInv.copy(car.quat).invert();
  qT.multiply(qInv);
  if (qT.w < 0) { qT.x = -qT.x; qT.y = -qT.y; qT.z = -qT.z; qT.w = -qT.w; }
  const sinHalf = Math.hypot(qT.x, qT.y, qT.z);
  const angle = 2 * Math.atan2(sinHalf, qT.w);
  const e = v1.set(qT.x, qT.y, qT.z);
  if (sinHalf > 1e-6) e.multiplyScalar(angle / sinHalf);
  e.applyQuaternion(qInv);
  const w = v2.copy(car.angVel).applyQuaternion(qInv);
  const kp = 5.5;
  const kd = 9;
  const ax = (e.x * kp * 1.6 - w.x) * kd * 1.6;
  const ay = (e.y * kp - w.y) * kd;
  const az = (e.z * kp - w.z) * kd;
  c.roll = clamp(ax / PHYS.airRollAccel, -1, 1);
  c.yaw = clamp(-ay / PHYS.airYawAccel, -1, 1);
  c.pitch = clamp(-az / PHYS.airPitchAccel, -1, 1);
  return angle;
}

// ---------- Maneuvers ----------
class Flip {
  constructor(dx, dy, boost = false) {
    this.dx = dx; this.dy = dy; this.t = 0; this.boost = boost;
  }

  update(dt, c, car) {
    this.t += dt;
    c.throttle = 1;
    c.boost = this.boost && this.t < 0.5;
    if (this.t < 0.07) c.jump = true;
    else if (this.t < 0.1) c.jump = false;
    else if (this.t < 0.14) { c.jump = true; c.pitch = this.dx; c.yaw = this.dy; }
    else { c.pitch = this.dx * 0.3; }
    if (this.t > 0.35 && car.onGround) return true;
    return this.t > 1.3;
  }
}

class JumpShot {
  constructor(bot, target, arrival) {
    this.bot = bot; this.target = target.clone(); this.arrival = arrival; this.t = 0; this.dodged = false;
  }

  update(dt, c, car, match) {
    this.t += dt;
    c.throttle = 1;
    const ball = match.ball;
    if (this.t < 0.2) {
      c.jump = true;
      return false;
    }
    if (!this.dodged) {
      const lt = localTarget(car, ball.pos);
      const d = car.pos.distanceTo(ball.pos);
      if (d < 2.6 || this.t > 0.9) {
        if (car.canDodge() && d < 3.2) {
          c.jump = true;
          c.pitch = Math.cos(lt.angle);
          c.yaw = Math.sin(lt.angle);
        }
        this.dodged = true;
      } else {
        car.forward(v1);
        orient(car, c, v1.set(ball.pos.x - car.pos.x, 0, ball.pos.z - car.pos.z), new Vector3(0, 1, 0));
      }
      return false;
    }
    if (car.onGround && this.t > 0.4) return true;
    return this.t > 2;
  }
}

class Aerial {
  constructor(target, arrival) {
    this.target = target.clone(); this.arrival = arrival; this.t = 0;
  }

  update(dt, c, car, match) {
    this.t += dt;
    const T = this.arrival - match.time;
    if (T < -0.25 || this.t > 4.5) return true;
    if (car.onGround && this.t > 0.3) return true;
    if (match.ball.lastTouch && match.ball.lastTouch.time > match.time - 0.05 && this.t > 0.3) return true;
    const Tr = Math.max(T, 0.08);
    const aReq = v1.copy(this.target).sub(car.pos).addScaledVector(car.vel, -Tr).multiplyScalar(2 / (Tr * Tr)).sub(G);
    const need = aReq.length();
    const dir = aReq.clone().normalize();
    if (this.t < 0.2) {
      c.jump = true;
    } else if (this.t < 0.24) {
      c.jump = false;
    } else if (this.t < 0.28 && !car.hasDoubleJumped) {
      c.jump = true;
      c.boost = true;
      return false;
    }
    const upHint = new Vector3(0, 1, 0);
    const err = orient(car, c, dir, upHint);
    car.forward(v2);
    c.boost = need > 1.2 && v2.dot(dir) > 0.85 && car.boost > 0;
    if (this.t < 0.2 && err > 0.6) c.boost = false;
    return false;
  }
}

// ---------- Bot ----------
export class Bot {
  constructor(car, difficulty = 'pro') {
    this.car = car;
    this.d = DIFFICULTIES[difficulty] || DIFFICULTIES.pro;
    this.maneuver = null;
    this.plan = null;
    this.planTimer = 0;
    this.aimOffset = 0;
    this.stuckTime = 0;
    this.reach = new Float32Array(260);
  }

  update(dt, match) {
    const car = this.car;
    const c = car.controls;
    const keepJump = c.jump;
    resetControls(c);
    if (car.demolished) { this.maneuver = null; return; }
    if (match.state === 'countdown') { this.maneuver = null; this.plan = null; return; }
    if (match.state !== 'playing' && match.state !== 'goal') return;

    if (this.maneuver) {
      if (!this.maneuver.update(dt, c, car, match, this)) return;
      this.maneuver = null;
      resetControls(c);
    }

    this.planTimer -= dt;
    if (this.planTimer <= 0 || !this.plan) {
      this.plan = this.makePlan(match);
      this.planTimer = this.d.reaction + Math.random() * 0.05;
    }

    if (!car.onGround) {
      this.recover(c, car);
      if (keepJump && car.jumping) c.jump = true;
      return;
    }
    this.execute(dt, c, match);
    this.unstick(dt, c, car);
  }

  unstick(dt, c, car) {
    const moving = car.vel.length() > 1.5;
    if (!moving && Math.abs(c.throttle) > 0.5) this.stuckTime += dt; else this.stuckTime = 0;
    if (this.stuckTime > 1.2) {
      this.stuckTime = 0;
      this.maneuver = new Flip(-1, 0);
    }
    // Leave walls when the target is somewhere else.
    if (car.onGround && car.groundNormal.y < 0.35 && car.groundTime > 0.8 && this.plan && this.plan.target && this.plan.target.y < 3) {
      this.maneuver = new Flip(0, 0);
      this.maneuver.update = function update(dt2, cc, cr) {
        this.t += dt2;
        cc.jump = this.t < 0.12;
        cc.throttle = 1;
        return this.t > 0.25 && (cr.onGround || this.t > 1.5);
      };
    }
  }

  recover(c, car) {
    car.vel.lengthSq();
    const fwd = v1.set(car.vel.x, 0, car.vel.z);
    if (fwd.lengthSq() < 1) car.forward(fwd).setY(0);
    if (fwd.lengthSq() < 1e-4) fwd.set(1, 0, 0);
    orient(car, c, fwd.clone(), new Vector3(0, 1, 0));
    c.throttle = 1;
  }

  // Distance the car can cover within t seconds (table at 60 Hz).
  computeReach() {
    const car = this.car;
    let v = Math.max(0, forwardSpeed(car));
    let boost = this.d.boostUse > 0.3 ? car.boost : 0;
    let dist = 0;
    const dt = 1 / 60;
    for (let i = 0; i < this.reach.length; i++) {
      let a = throttleAccel(v);
      if (boost > 0) { a += PHYS.boostAccel; boost -= PHYS.boostPerSecond * dt; }
      v = Math.min(PHYS.carMaxSpeed * this.d.speed, v + a * dt);
      dist += v * dt;
      this.reach[i] = dist;
    }
  }

  reachIn(t) {
    const i = Math.floor(t * 60);
    if (i < 0) return 0;
    return this.reach[Math.min(i, this.reach.length - 1)];
  }

  findIntercept(match, allowAerial) {
    const car = this.car;
    this.computeReach();
    const pred = match.prediction;
    const maxAerial = 5 + this.d.aerial * 10;
    for (let i = 0; i < pred.length; i += 2) {
      const s = pred[i];
      const h = s.pos.y;
      const lt = localTarget(car, s.pos);
      const turn = Math.abs(lt.angle) * 0.32;
      const dist = Math.max(0, lt.dist - 1.4);
      if (h < 1.9) {
        if (this.reachIn(s.t - turn) >= dist) return { slice: s, kind: 'ground' };
      } else if (h < 3.3 && this.d.flips > 0.5) {
        if (this.reachIn(s.t - turn - 0.15) >= dist) return { slice: s, kind: 'jump' };
      } else if (allowAerial && h < maxAerial && car.boost > 25 && s.t > 0.6) {
        const T = s.t;
        const aReq = v1.copy(s.pos).sub(car.pos).addScaledVector(car.vel, -T);
        aReq.y -= 3 * T;
        aReq.multiplyScalar(2 / (T * T)).sub(G);
        const fuel = car.boost / PHYS.boostPerSecond;
        if (aReq.length() < PHYS.boostAccel * 0.8 && fuel > T * 0.8 && Math.abs(lt.angle) < 0.5) {
          return { slice: s, kind: 'aerial' };
        }
      }
    }
    return null;
  }

  makePlan(match) {
    const car = this.car;
    const ball = match.ball;
    const team = car.team;
    const dirOpp = team === 0 ? 1 : -1;
    const ownZ = ownGoalZ(team);
    this.aimOffset = (Math.random() - 0.5) * (1 - this.d.aim) * 12;

    const mates = match.cars.filter((m) => m.team === team && !m.demolished);

    if (match.kickoff && ball.vel.lengthSq() < 0.01 && Math.abs(ball.pos.x) + Math.abs(ball.pos.z) < 0.1) {
      const sorted = mates.slice().sort((a, b) => {
        const d = a.pos.length() - b.pos.length();
        if (Math.abs(d) > 0.5) return d;
        return b.pos.x * dirOpp - a.pos.x * dirOpp;
      });
      const rank = sorted.indexOf(car);
      if (rank === 0) return { kind: 'kickoff' };
      if (rank === 1) return this.boostPlan(match, true) || { kind: 'defend' };
      return { kind: 'defend' };
    }

    const threat = predictedGoal(match.prediction, 3);
    const ownThreat = threat && threat.team !== team;

    // Role: the best placed team mate attacks, the others rotate.
    let best = null;
    let bestCost = Infinity;
    for (const m of mates) {
      const goalSide = (ball.pos.z - m.pos.z) * dirOpp > -1;
      let cost = m.pos.distanceTo(ball.pos) + (goalSide ? 0 : 18);
      if (!m.isBot) cost -= 4;
      if (m === car) cost -= 1;
      if (cost < bestCost) { bestCost = cost; best = m; }
    }

    if (best === car || (ownThreat && this.closestToGoal(mates, ownZ) === car)) {
      const hit = this.findIntercept(match, this.d.aerial > 0 && (!ownThreat || this.d.aerial > 0.7));
      if (!hit) return { kind: 'chase' };
      const B = hit.slice.pos;
      const goalSide = (B.z - car.pos.z) * dirOpp > 0.5;
      if (!goalSide && !ownThreat) {
        // Wrong side of the ball: rotate back towards our goal, passing beside the ball.
        const side = car.pos.x > B.x ? 1 : -1;
        const tz = B.z - dirOpp * 9;
        const target = new Vector3(clamp(B.x + side * 6, -ARENA.W + 4, ARENA.W - 4), 0, clamp(tz, -ARENA.L + 3, ARENA.L - 3));
        return { kind: 'rotate', target };
      }
      if (hit.kind === 'aerial') {
        return { kind: 'aerial', target: B.clone(), arrival: match.time + hit.slice.t };
      }
      return {
        kind: 'attack', ball: B.clone(), arrival: match.time + hit.slice.t, jump: hit.kind === 'jump', save: ownThreat,
        allowBoost: Math.random() < this.d.boostUse,
      };
    }

    if (car.boost < 40 && !ownThreat) {
      const bp = this.boostPlan(match, false);
      if (bp) return bp;
    }
    const sup = mates.filter((m) => m !== best).indexOf(car);
    if (sup === 0 && mates.length > 2) {
      const target = ball.pos.clone().lerp(new Vector3(0, 0, ownZ), 0.45);
      target.x = clamp(target.x - Math.sign(ball.pos.x || 1) * 6, -ARENA.W + 6, ARENA.W - 6);
      target.y = 0;
      return { kind: 'support', target };
    }
    return { kind: 'defend' };
  }

  closestToGoal(mates, ownZ) {
    let best = null;
    let bd = Infinity;
    for (const m of mates) {
      const d = Math.abs(m.pos.z - ownZ) + Math.abs(m.pos.x) * 0.5;
      if (d < bd) { bd = d; best = m; }
    }
    return best;
  }

  boostPlan(match, kickoff) {
    const car = this.car;
    const dirOpp = car.team === 0 ? 1 : -1;
    let best = null;
    let bc = Infinity;
    for (const p of match.pads) {
      if (!p.big || !p.active) continue;
      const own = p.pos.z * dirOpp <= 0.1;
      const cost = car.pos.distanceTo(p.pos) + (own ? 0 : 25) + (kickoff && Math.abs(p.pos.z) < 1 ? 50 : 0);
      if (cost < bc) { bc = cost; best = p; }
    }
    if (!best || (!kickoff && bc > 45)) return null;
    return { kind: 'boost', target: best.pos.clone() };
  }

  execute(dt, c, match) {
    const car = this.car;
    const plan = this.plan;
    const ball = match.ball;
    const team = car.team;
    const dirOpp = team === 0 ? 1 : -1;
    const ownZ = ownGoalZ(team);
    const speed = forwardSpeed(car);

    switch (plan.kind) {
      case 'kickoff': {
        const lt = localTarget(car, ball.pos);
        const aim = v1.copy(ball.pos);
        aim.z -= dirOpp * 0.9;
        this.driveTo(c, aim, 23, true);
        if (lt.dist < 1.7 + speed * 0.17 && speed > 10) {
          const a = lt.angle;
          this.maneuver = new Flip(Math.cos(a), clamp(Math.sin(a) * 1.5, -1, 1), true);
        }
        break;
      }
      case 'attack': {
        const B = plan.ball;
        const T = Math.max(plan.arrival - match.time, 0.02);
        if (plan.arrival < match.time - 0.3) { this.planTimer = 0; break; }
        const oppZ = -ownZ;
        let aimX = clamp(B.x * 0.25 + this.aimOffset, -ARENA.GW + 1.8, ARENA.GW - 1.8);
        if (plan.save && Math.abs(B.z - ownZ) < 25) aimX = B.x > 0 ? ARENA.W : -ARENA.W;
        const shot = v2.set(aimX - B.x, 0, oppZ + dirOpp * 3 - B.z).normalize();
        const lt = localTarget(car, B);
        const offset = clamp(lt.dist * 0.4, 1.3, 7);
        const target = new Vector3(B.x - shot.x * offset, 0, B.z - shot.z * offset);
        if (Math.abs(target.x) > ARENA.W - 1.5 || Math.abs(target.z) > ARENA.L - 1.5) target.set(B.x, 0, B.z);
        const lt2 = localTarget(car, target);
        let desired = lt2.dist / T + 2;
        if (lt.dist > 25) desired = 23;
        this.driveTo(c, target, desired * this.d.speed, plan.allowBoost);

        car.forward(v3);
        const align = v3.x * shot.x + v3.z * shot.z;
        if (plan.jump) {
          const horiz = Math.hypot(B.x - car.pos.x, B.z - car.pos.z);
          if (T < 0.55 && horiz < speed * T + 2.2 && Math.abs(lt.angle) < 0.5) {
            this.maneuver = new JumpShot(this, B, plan.arrival);
          }
        } else {
          const d = car.pos.distanceTo(ball.pos);
          if (d < 2.4 + speed * 0.13 && ball.pos.y < 2 && Math.abs(lt.angle) < 0.35 && align > 0.55 && speed > 7
            && Math.random() < this.d.flips * 0.25) {
            const a = localTarget(car, ball.pos).angle;
            this.maneuver = new Flip(Math.cos(a), clamp(Math.sin(a) * 1.6, -1, 1));
          }
        }
        break;
      }
      case 'aerial': {
        const lt = localTarget(car, plan.target);
        if (Math.abs(lt.angle) < 0.25 || plan.arrival - match.time < 1.2) {
          this.maneuver = new Aerial(plan.target, plan.arrival);
        } else {
          this.driveTo(c, v1.set(plan.target.x, 0, plan.target.z), 10, false);
        }
        break;
      }
      case 'rotate':
      case 'support':
      case 'boost': {
        const lt = localTarget(car, plan.target);
        const desired = plan.kind === 'support' ? clamp(lt.dist * 1.2, 4, 23) : 23;
        this.driveTo(c, plan.target, desired, plan.kind !== 'support' && this.d.boostUse > 0.5);
        if (lt.dist < 2) this.planTimer = 0;
        break;
      }
      case 'chase': {
        this.driveTo(c, v1.set(ball.pos.x, 0, ball.pos.z - dirOpp * 3), 16, false);
        break;
      }
      case 'defend':
      default: {
        const side = ball.pos.x > 0 ? -1 : 1;
        const spot = v1.set(side * 3.5, 0, ownZ + dirOpp * 3.5);
        const lt = localTarget(car, spot);
        if (lt.dist > 4) {
          this.driveTo(c, spot, clamp(lt.dist * 1.1, 5, 23), lt.dist > 25);
        } else {
          const lb = localTarget(car, ball.pos);
          c.steer = clamp(lb.angle * 2.5, -1, 1);
          c.throttle = Math.abs(lb.angle) > 0.3 ? 0.35 : (speed > 0.5 ? -0.3 : 0);
          if (Math.abs(lb.angle) > 2.2) c.throttle = -0.4;
          this.planTimer = Math.min(this.planTimer, 0.2);
        }
        break;
      }
    }
  }

  driveTo(c, target, desiredSpeed, allowBoost) {
    const car = this.car;
    const lt = localTarget(car, target);
    const speed = forwardSpeed(car);
    c.steer = clamp(lt.angle * 3.2, -1, 1);
    c.handbrake = Math.abs(lt.angle) > 1.6 && speed > 7 && lt.dist > 2.5;
    if (desiredSpeed > speed + 0.3) c.throttle = 1;
    else if (desiredSpeed < speed - 3) c.throttle = -1;
    else c.throttle = 0.1;
    if (Math.abs(lt.angle) > 2.4 && lt.dist < 6 && speed < 4) { c.throttle = -1; c.steer = -c.steer; }
    c.boost = allowBoost && car.boost > 0 && Math.abs(lt.angle) < 0.3 && desiredSpeed > speed + 1.5
      && speed < PHYS.carMaxSpeed - 0.3 && car.groundNormal.y > 0.7;
  }
}
