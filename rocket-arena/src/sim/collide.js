import { Vector3, Quaternion } from 'three';
import { PHYS } from '../config.js';

const MB = PHYS.ballMass;
const MC = PHYS.carMass;
const R = PHYS.ballRadius;

const loc = new Vector3();
const n = new Vector3();
const cp = new Vector3();
const rc = new Vector3();
const rb = new Vector3();
const vc = new Vector3();
const vb = new Vector3();
const t1 = new Vector3();
const t2 = new Vector3();
const t3 = new Vector3();
const qInv = new Quaternion();

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

function extraImpulseScale(s) {
  if (s <= 5) return 0.65;
  if (s <= 23) return 0.65 - 0.1 * (s - 5) / 18;
  if (s <= 46) return 0.55 - 0.25 * (s - 23) / 23;
  return 0.3;
}

// Car hitbox vs ball. Returns the approach speed when a hit happened, else 0.
export function collideCarBall(car, ball, time) {
  if (car.demolished || ball.hidden) return 0;
  const { hx, hy, hz } = car.body;
  qInv.copy(car.quat).invert();
  loc.copy(ball.pos).sub(car.pos).applyQuaternion(qInv);
  if (Math.abs(loc.x) > hx + R || Math.abs(loc.y) > hy + R || Math.abs(loc.z) > hz + R) return 0;
  const cx = clamp(loc.x, -hx, hx);
  const cy = clamp(loc.y, -hy, hy);
  const cz = clamp(loc.z, -hz, hz);
  n.set(loc.x - cx, loc.y - cy, loc.z - cz);
  let dist = n.length();
  if (dist >= R) return 0;
  let pen;
  if (dist > 1e-6) {
    n.multiplyScalar(1 / dist);
    pen = R - dist;
  } else {
    // Ball centre inside the box: push out through the closest face.
    const dx = hx - Math.abs(loc.x);
    const dy = hy - Math.abs(loc.y);
    const dz = hz - Math.abs(loc.z);
    if (dx < dy && dx < dz) { n.set(Math.sign(loc.x) || 1, 0, 0); pen = dx + R; }
    else if (dy < dz) { n.set(0, Math.sign(loc.y) || 1, 0); pen = dy + R; }
    else { n.set(0, 0, Math.sign(loc.z) || 1); pen = dz + R; }
  }
  cp.set(cx, cy, cz).applyQuaternion(car.quat).add(car.pos);
  const underside = n.y < -0.85;
  n.applyQuaternion(car.quat);

  ball.pos.addScaledVector(n, pen * MC / (MB + MC));
  car.pos.addScaledVector(n, -pen * MB / (MB + MC));

  rc.copy(cp).sub(car.pos);
  rb.copy(n).multiplyScalar(-R);
  vc.crossVectors(car.angVel, rc).add(car.vel);
  vb.crossVectors(ball.angVel, rb).add(ball.vel);
  const vrel = t1.copy(vb).sub(vc);
  const vn = vrel.dot(n);
  if (underside && !car.onGround && (car.hasJumped || car.hasFlipped || car.hasDoubleJumped)) {
    // Touching the ball with the wheels gives the flip back (flip reset).
    car.hasJumped = false;
    car.hasDoubleJumped = false;
    car.hasFlipped = false;
    car.flipReset = true;
  }
  if (vn >= 0) return 0;
  const relSpeed = Math.min(Math.hypot(ball.vel.x - car.vel.x, ball.vel.y - car.vel.y, ball.vel.z - car.vel.z), 46);

  // Normal impulse (no restitution, like the real game).
  const ir = car.applyInvInertia(t2.crossVectors(rc, n), t2).multiplyScalar(1 / MC);
  const k = 1 / MB + 1 / MC + n.dot(t3.crossVectors(ir, rc));
  const j = -vn / k;
  ball.vel.addScaledVector(n, j / MB);
  car.vel.addScaledVector(n, -j / MC);
  car.angVel.addScaledVector(ir, -j);

  // Friction: lets the car carry and spin the ball.
  vc.crossVectors(car.angVel, rc).add(car.vel);
  vb.crossVectors(ball.angVel, rb).add(ball.vel);
  vrel.copy(vb).sub(vc);
  vrel.addScaledVector(n, -vrel.dot(n));
  const vt = vrel.length();
  if (vt > 1e-5) {
    const tdir = vrel.multiplyScalar(1 / vt);
    const jt = Math.min(vt / (3.5 / MB + 1 / MC), 2 * j);
    ball.vel.addScaledVector(tdir, -jt / MB);
    car.vel.addScaledVector(tdir, jt / MC);
    t2.crossVectors(rb, tdir).multiplyScalar(-jt / (0.4 * MB * R * R));
    ball.angVel.add(t2);
  }

  // Rocket League's extra "psyonix" impulse, the thing that makes hits pop.
  const approach = -vn;
  if (approach > 0.4 && time - car.lastExtraHit > 0.05) {
    car.lastExtraHit = time;
    t2.copy(ball.pos).sub(car.pos);
    t2.y *= 0.35;
    t2.normalize();
    car.forward(t3);
    t2.addScaledVector(t3, -t2.dot(t3) * 0.35).normalize();
    ball.vel.addScaledVector(t2, relSpeed * extraImpulseScale(relSpeed));
  }
  const sp = ball.vel.length();
  if (sp > PHYS.ballMaxSpeed) ball.vel.multiplyScalar(PHYS.ballMaxSpeed / sp);
  return approach;
}

// Cars are approximated by capsules along their forward axis.
const CAP_R = 0.36;
const a0 = new Vector3();
const a1 = new Vector3();
const b0 = new Vector3();
const b1 = new Vector3();
const pa = new Vector3();
const pb = new Vector3();
const fa = new Vector3();
const fb = new Vector3();

function closestSegments(p1, q1, p2, q2, c1, c2) {
  const d1 = t1.copy(q1).sub(p1);
  const d2 = t2.copy(q2).sub(p2);
  const r = t3.copy(p1).sub(p2);
  const a = d1.dot(d1);
  const e = d2.dot(d2);
  const f = d2.dot(r);
  const c = d1.dot(r);
  const b = d1.dot(d2);
  const denom = a * e - b * b;
  let s = denom > 1e-8 ? clamp((b * f - c * e) / denom, 0, 1) : 0;
  let t = (b * s + f) / e;
  if (t < 0) { t = 0; s = clamp(-c / a, 0, 1); }
  else if (t > 1) { t = 1; s = clamp((b - c) / a, 0, 1); }
  c1.copy(p1).addScaledVector(d1, s);
  c2.copy(p2).addScaledVector(d2, t);
}

// Returns {type: 'demo'|'bump', attacker, victim} or null.
export function collideCars(a, b) {
  if (a.demolished || b.demolished) return null;
  if (a.pos.distanceToSquared(b.pos) > 4) return null;
  a.forward(fa);
  b.forward(fb);
  const la = a.body.hx - 0.28;
  const lb = b.body.hx - 0.28;
  a0.copy(a.pos).addScaledVector(fa, -la);
  a1.copy(a.pos).addScaledVector(fa, la);
  b0.copy(b.pos).addScaledVector(fb, -lb);
  b1.copy(b.pos).addScaledVector(fb, lb);
  closestSegments(a0, a1, b0, b1, pa, pb);
  n.copy(pb).sub(pa);
  const d = n.length();
  if (d >= CAP_R * 2 || d < 1e-6) return null;
  n.multiplyScalar(1 / d);
  const pen = CAP_R * 2 - d;
  a.pos.addScaledVector(n, -pen / 2);
  b.pos.addScaledVector(n, pen / 2);

  const vn = t1.copy(b.vel).sub(a.vel).dot(n);
  if (vn >= 0) return null;

  // Demolition: a supersonic car hitting an opponent with its nose.
  if (a.team !== b.team) {
    if (a.supersonic && fa.dot(n) > 0.55 && a.vel.dot(n) > 12) {
      b.demolish();
      return { type: 'demo', attacker: a, victim: b };
    }
    if (b.supersonic && -fb.dot(n) > 0.55 && -b.vel.dot(n) > 12) {
      a.demolish();
      return { type: 'demo', attacker: b, victim: a };
    }
  }

  const j = -(1 + 0.25) * vn / 2;
  a.vel.addScaledVector(n, -j);
  b.vel.addScaledVector(n, j);
  // Bumps: the car hitting with its front launches the other one.
  let attacker = null;
  let victim = null;
  if (fa.dot(n) > 0.5 && a.vel.dot(n) > 4) { attacker = a; victim = b; }
  else if (-fb.dot(n) > 0.5 && -b.vel.dot(n) > 4) { attacker = b; victim = a; n.negate(); }
  if (attacker) {
    const s = -vn;
    victim.vel.addScaledVector(n, s * 0.45);
    victim.vel.y += s * (victim.onGround ? 0.3 : 0.12);
    victim.jumpLock = 0.1;
    victim.angVel.add(t1.set((Math.random() - 0.5) * 3, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 3));
    return { type: 'bump', attacker, victim, strength: s };
  }
  return { type: 'touch', attacker: a, victim: b, strength: -vn };
}
