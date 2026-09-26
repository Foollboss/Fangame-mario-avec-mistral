import { Vector3, Quaternion } from 'three';
import { CAR, BALL } from '../core/Config.js';

const _qi = new Quaternion();
const _local = new Vector3();
const _n = new Vector3();
const _rel = new Vector3();
const _dir = new Vector3();
const _f = new Vector3();
const _cp = new Vector3();
const _w = new Vector3();
const _a0 = new Vector3(), _a1 = new Vector3(), _b0 = new Vector3(), _b1 = new Vector3();
const _c1 = new Vector3(), _c2 = new Vector3();
const _d1 = new Vector3(), _d2 = new Vector3(), _r = new Vector3();

// Extra "arcade" impulse scale depending on relative speed: strong, readable hits at any speed.
function hitScale(s) {
  if (s < 13) return 0.65;
  if (s < 60) return 0.65 - ((s - 13) / 47) * 0.1;
  return Math.max(0.3, 0.55 - ((s - 60) / 60) * 0.25);
}

export function collideCarBall(car, ball, events) {
  if (car.demolished || ball.frozen) return false;
  const p = car.physics;
  const h = CAR.halfExtents;
  const R = ball.radius;
  _qi.copy(p.quat).invert();
  _local.copy(ball.pos).sub(p.pos).applyQuaternion(_qi);
  // quick reject
  if (Math.abs(_local.x) > h.x + R || Math.abs(_local.y) > h.y + R || Math.abs(_local.z) > h.z + R) return false;
  const cx = Math.max(-h.x, Math.min(h.x, _local.x));
  const cy = Math.max(-h.y, Math.min(h.y, _local.y));
  const cz = Math.max(-h.z, Math.min(h.z, _local.z));
  const dx = _local.x - cx, dy = _local.y - cy, dz = _local.z - cz;
  const d2 = dx * dx + dy * dy + dz * dz;
  if (d2 >= R * R) return false;
  let pen;
  if (d2 < 1e-8) {
    // Ball centre inside the box: push out through the nearest face
    const px = h.x - Math.abs(_local.x), py = h.y - Math.abs(_local.y), pz = h.z - Math.abs(_local.z);
    if (px < py && px < pz) { _n.set(Math.sign(_local.x) || 1, 0, 0); pen = R + px; }
    else if (py < pz) { _n.set(0, Math.sign(_local.y) || 1, 0); pen = R + py; }
    else { _n.set(0, 0, Math.sign(_local.z) || 1); pen = R + pz; }
  } else {
    const d = Math.sqrt(d2);
    _n.set(dx / d, dy / d, dz / d);
    pen = R - d;
  }
  _n.applyQuaternion(p.quat);
  _cp.set(cx, cy, cz).applyQuaternion(p.quat).add(p.pos);

  // Positional correction: the light ball moves most.
  ball.pos.addScaledVector(_n, pen * 0.9);
  p.pos.x -= _n.x * pen * 0.1;
  p.pos.z -= _n.z * pen * 0.1;
  if (!p.grounded) p.pos.y -= _n.y * pen * 0.1;

  _rel.copy(ball.vel).sub(p.vel);
  if (p.flip) {
    // Surface velocity of the spinning car during a dash adds punch.
    _w.copy(p.flip.axis).applyQuaternion(p.flip.base).multiplyScalar(p.flipAngularSpeed() * 0.45);
    _dir.copy(_cp).sub(p.pos);
    _rel.sub(_f.crossVectors(_w, _dir));
  }
  const vn = _rel.dot(_n);
  const relSpeed = _rel.length();
  let hit = false;
  if (vn < 0) {
    const invMb = 1 / BALL.mass;
    const invMc = 1 / p.mass;
    const j = (-(1 + 0.1) * vn) / (invMb + invMc);
    ball.vel.addScaledVector(_n, j * invMb);
    p.vel.x -= _n.x * j * invMc;
    p.vel.z -= _n.z * j * invMc;
    p.vel.y -= _n.y * j * invMc * (p.grounded ? 0 : 1);

    if (car.touchCooldown <= 0) {
      _dir.copy(ball.pos).sub(p.pos);
      _dir.y *= 0.42;
      p.forward(_f);
      _dir.addScaledVector(_f, -0.35 * _dir.dot(_f));
      _dir.normalize();
      // Ground hits get some lift so the ball leaves the floor and bounces.
      if (ball.pos.y < BALL.radius + 1.8) {
        _dir.y += BALL.hitLift;
        _dir.normalize();
      }
      const s = Math.min(relSpeed, 92);
      let extra = s * hitScale(s) * (0.9 + 0.1 * p.stats.mass);
      if (p.flip) extra *= 1.12;
      ball.vel.addScaledVector(_dir, extra);
      hit = true;
    }
    // Spin from the tangential part of the contact
    const tx = _rel.x - _n.x * vn, ty = _rel.y - _n.y * vn, tz = _rel.z - _n.z * vn;
    ball.angVel.x += (_n.y * tz - _n.z * ty) * -0.12;
    ball.angVel.y += (_n.z * tx - _n.x * tz) * -0.12;
    ball.angVel.z += (_n.x * ty - _n.y * tx) * -0.12;
  }
  if (car.touchCooldown <= 0) {
    car.touchCooldown = 0.1;
    events.emit('ballTouch', { car, strength: relSpeed, hit, point: _cp.clone(), normal: _n.clone() });
  }
  return true;
}

function closestSegSeg(p1, q1, p2, q2, c1, c2) {
  _d1.copy(q1).sub(p1);
  _d2.copy(q2).sub(p2);
  _r.copy(p1).sub(p2);
  const a = _d1.dot(_d1), e = _d2.dot(_d2), f = _d2.dot(_r);
  let s, t;
  const c = _d1.dot(_r);
  const b = _d1.dot(_d2);
  const denom = a * e - b * b;
  s = denom > 1e-8 ? Math.max(0, Math.min(1, (b * f - c * e) / denom)) : 0;
  t = (b * s + f) / e;
  if (t < 0) { t = 0; s = Math.max(0, Math.min(1, -c / a)); }
  else if (t > 1) { t = 1; s = Math.max(0, Math.min(1, (b - c) / a)); }
  c1.copy(p1).addScaledVector(_d1, s);
  c2.copy(p2).addScaledVector(_d2, t);
}

export function collideCars(A, B, events) {
  if (A.demolished || B.demolished) return;
  const pa = A.physics, pb = B.physics;
  const dxz = pa.pos.x - pb.pos.x, dzz = pa.pos.z - pb.pos.z, dyy = pa.pos.y - pb.pos.y;
  if (dxz * dxz + dzz * dzz + dyy * dyy > 64) return;
  const off = CAR.capsuleOffset;
  const r = CAR.capsuleRadius;
  pa.forward(_f);
  _a0.copy(pa.pos).addScaledVector(_f, off);
  _a1.copy(pa.pos).addScaledVector(_f, -off);
  pb.forward(_f);
  _b0.copy(pb.pos).addScaledVector(_f, off);
  _b1.copy(pb.pos).addScaledVector(_f, -off);
  closestSegSeg(_a0, _a1, _b0, _b1, _c1, _c2);
  _n.copy(_c2).sub(_c1);
  let dist = _n.length();
  if (dist >= r * 2) return;
  if (dist < 1e-5) {
    _n.copy(pb.pos).sub(pa.pos);
    if (_n.lengthSq() < 1e-6) _n.set(1, 0, 0);
    dist = 0;
  }
  _n.normalize();
  const pen = r * 2 - dist;
  const total = pa.mass + pb.mass;
  const ka = pb.mass / total, kb = pa.mass / total;
  pa.pos.x -= _n.x * pen * ka; pa.pos.z -= _n.z * pen * ka;
  pb.pos.x += _n.x * pen * kb; pb.pos.z += _n.z * pen * kb;
  if (!pa.grounded) pa.pos.y -= _n.y * pen * ka;
  if (!pb.grounded) pb.pos.y += _n.y * pen * kb;

  _rel.copy(pb.vel).sub(pa.vel);
  const vn = _rel.dot(_n);
  if (vn >= 0) return;

  if (A.team !== B.team) {
    // Demolition: a supersonic car hitting an opponent with its nose.
    for (const [att, vic, sgn] of [[A, B, 1], [B, A, -1]]) {
      const ap = att.physics;
      ap.forward(_f);
      const towards = _f.dot(_n) * sgn;
      const along = ap.vel.dot(_n) * sgn;
      if (ap.speed > CAR.supersonic * 0.96 && towards > 0.55 && along > 38) {
        events.emit('demolish', { attacker: att, victim: vic });
        return;
      }
    }
  }
  const j = (-(1 + 0.3) * vn) / (1 / pa.mass + 1 / pb.mass);
  pa.vel.addScaledVector(_n, -j / pa.mass);
  pb.vel.addScaledVector(_n, j / pb.mass);
  // A little extra lateral shove keeps bumps readable
  const bump = Math.min(8, -vn * 0.25);
  pa.vel.x -= _n.x * bump * ka; pa.vel.z -= _n.z * bump * ka;
  pb.vel.x += _n.x * bump * kb; pb.vel.z += _n.z * bump * kb;
  if (-vn > 6) events.emit('carBump', { a: A, b: B, strength: -vn, point: _c1.clone().add(_c2).multiplyScalar(0.5) });
}
