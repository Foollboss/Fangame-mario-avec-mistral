import { Vector3, Quaternion } from 'three';
import { PHYS } from '../config.js';
import { sdArena, arenaNormal } from './arena.js';

const R = PHYS.ballRadius;
const n = new Vector3();
const r = new Vector3();
const vc = new Vector3();
const tmp = new Vector3();
const dq = new Quaternion();

export function integrateQuat(q, w, dt) {
  const speed = w.length();
  if (speed < 1e-7) return;
  tmp.copy(w).multiplyScalar(1 / speed);
  dq.setFromAxisAngle(tmp, speed * dt);
  q.premultiply(dq).normalize();
}

// Advances a ball state {pos, vel, angVel}. Returns the impact speed of an arena bounce, if any.
export function stepBallState(s, dt) {
  s.vel.y += PHYS.gravity * dt;
  s.vel.multiplyScalar(1 - PHYS.ballDrag * dt);
  const sp = s.vel.length();
  if (sp > PHYS.ballMaxSpeed) s.vel.multiplyScalar(PHYS.ballMaxSpeed / sp);
  s.pos.addScaledVector(s.vel, dt);

  let impact = 0;
  const sd = sdArena(s.pos.x, s.pos.y, s.pos.z);
  const pen = sd + R;
  if (pen > 0) {
    arenaNormal(s.pos.x, s.pos.y, s.pos.z, n);
    s.pos.addScaledVector(n, pen);
    const vn = s.vel.dot(n);
    if (vn < 0) {
      impact = -vn;
      const e = vn > -0.6 ? 0 : PHYS.ballRestitution;
      const jn = -(1 + e) * vn;
      s.vel.addScaledVector(n, jn);
      // Friction couples sliding and spin (solid sphere: effective mass factor 3.5).
      r.copy(n).multiplyScalar(-R);
      vc.crossVectors(s.angVel, r).add(s.vel);
      vc.addScaledVector(n, -vc.dot(n));
      const vt = vc.length();
      if (vt > 1e-6) {
        const jt = Math.min(PHYS.ballFriction * jn, vt / 3.5);
        vc.multiplyScalar(1 / vt);
        s.vel.addScaledVector(vc, -jt);
        tmp.crossVectors(r, vc).multiplyScalar(-jt * 2.5 / (R * R));
        s.angVel.add(tmp);
      }
    }
  }
  const w = s.angVel.length();
  if (w > PHYS.ballMaxAngVel) s.angVel.multiplyScalar(PHYS.ballMaxAngVel / w);
  return impact;
}

export class Ball {
  constructor() {
    this.pos = new Vector3(0, R, 0);
    this.vel = new Vector3();
    this.angVel = new Vector3();
    this.quat = new Quaternion();
    this.prevPos = this.pos.clone();
    this.prevQuat = this.quat.clone();
    this.radius = R;
    this.hidden = false;
    this.lastTouch = null;
    this.touches = []; // {car, time}
  }

  reset(x = 0, y = R, z = 0) {
    this.pos.set(x, y, z);
    this.vel.set(0, 0, 0);
    this.angVel.set(0, 0, 0);
    this.prevPos.copy(this.pos);
    this.prevQuat.copy(this.quat);
    this.hidden = false;
    this.lastTouch = null;
    this.touches.length = 0;
  }

  step(dt) {
    this.prevPos.copy(this.pos);
    this.prevQuat.copy(this.quat);
    if (this.hidden) return 0;
    const impact = stepBallState(this, dt);
    integrateQuat(this.quat, this.angVel, dt);
    return impact;
  }
}

// Predicts the ball path ignoring cars. Returns an array of {t, pos, vel}.
export function predictBall(ball, duration = 4, step = 1 / 60) {
  const s = { pos: ball.pos.clone(), vel: ball.vel.clone(), angVel: ball.angVel.clone() };
  const out = [];
  const sub = 2;
  const dt = step / sub;
  for (let t = step; t <= duration + 1e-6; t += step) {
    for (let i = 0; i < sub; i++) stepBallState(s, dt);
    out.push({ t, pos: s.pos.clone(), vel: s.vel.clone() });
  }
  return out;
}
