import { Vector3, Quaternion } from 'three';
import { PHYS } from '../config/GameConfig.js';
import { clamp, curve } from '../core/math.js';

const _rel = new Vector3(), _loc = new Vector3(), _cl = new Vector3(), _n = new Vector3(), _cp = new Vector3();
const _vb = new Vector3(), _vc = new Vector3(), _J = new Vector3(), _q = new Quaternion(), _dir = new Vector3();
const _vt = new Vector3();

// Impulsion « de frappe » supplémentaire rendant les tirs lisibles et puissants (s'ajoute au choc physique).
const HIT_SCALE = [[0, 0.65], [15, 0.65], [69, 0.55], [138, 0.3]];

export const Collisions = {
  // Retourne l'intensité du choc (0 si pas de contact).
  carBall(car, ball, time) {
    _q.copy(car.quat).invert();
    _rel.subVectors(ball.pos, car.pos);
    _loc.copy(_rel).applyQuaternion(_q);
    _cl.set(clamp(_loc.x, -car.half.x, car.half.x), clamp(_loc.y, -car.half.y, car.half.y), clamp(_loc.z, -car.half.z, car.half.z));
    _n.subVectors(_loc, _cl);
    let dist = _n.length();
    const R = ball.radius;
    if (dist > R) return 0;
    if (dist < 1e-6) {
      // Centre de la balle dans la boîte : sortie par l'axe le plus proche.
      const px = car.half.x - Math.abs(_loc.x), py = car.half.y - Math.abs(_loc.y), pz = car.half.z - Math.abs(_loc.z);
      _n.set(0, 0, 0);
      if (px < py && px < pz) _n.x = Math.sign(_loc.x) || 1;
      else if (py < pz) _n.y = Math.sign(_loc.y) || 1;
      else _n.z = Math.sign(_loc.z) || 1;
      dist = 0;
    } else _n.multiplyScalar(1 / dist);
    _n.applyQuaternion(car.quat);
    _cp.copy(_cl).applyQuaternion(car.quat).add(car.pos);

    const pen = R - dist;
    const totalInv = car.invMass + ball.invMass;
    ball.pos.addScaledVector(_n, pen * ball.invMass / totalInv);
    car.pos.addScaledVector(_n, -pen * car.invMass / totalInv);

    car.pointVelocity(_cp, _vc);
    _vb.copy(ball.vel);
    _rel.subVectors(_vb, _vc);
    const vn = _rel.dot(_n);
    let strength = 0;
    if (vn < 0) {
      const kCar = car.effectiveInvMass(_cp, _n) - car.invMass;
      const j = -(1 + PHYS.CAR_BALL_RESTITUTION) * vn / (ball.invMass + car.invMass + kCar);
      ball.vel.addScaledVector(_n, j * ball.invMass);
      _J.copy(_n).multiplyScalar(-j);
      car.applyImpulse(_J, _cp);
      // Effet (rotation) transmis à la balle
      _vt.copy(_rel).addScaledVector(_n, -vn);
      _dir.copy(_n).multiplyScalar(-R).cross(_vt).multiplyScalar(-0.4 / (R * R));
      ball.angVel.add(_dir);
      strength = -vn;

      if (time - car.lastHitT > 0.1 && -vn > 0.5) {
        car.lastHitT = time;
        const relSpeed = Math.min(_vb.sub(car.vel).length(), 138);
        _dir.subVectors(ball.pos, car.pos);
        _dir.y *= 0.35;
        _dir.normalize();
        _dir.addScaledVector(car.fwd, -0.35 * _dir.dot(car.fwd)).normalize();
        ball.vel.addScaledVector(_dir, relSpeed * curve(HIT_SCALE, relSpeed));
      }
    }
    return Math.max(strength, 0.001);
  },

  carCar(a, b) {
    _n.subVectors(b.pos, a.pos);
    const d = _n.length();
    const minD = a.radius + b.radius;
    if (d >= minD || d < 1e-6) return 0;
    _n.multiplyScalar(1 / d);
    const pen = minD - d;
    const totalInv = a.invMass + b.invMass;
    a.pos.addScaledVector(_n, -pen * a.invMass / totalInv);
    b.pos.addScaledVector(_n, pen * b.invMass / totalInv);
    const vn = _vb.subVectors(b.vel, a.vel).dot(_n);
    if (vn >= 0) return 0;
    const j = -(1 + PHYS.CAR_CAR_RESTITUTION) * vn / totalInv;
    a.vel.addScaledVector(_n, -j * a.invMass);
    b.vel.addScaledVector(_n, j * b.invMass);
    return -vn;
  },
};
