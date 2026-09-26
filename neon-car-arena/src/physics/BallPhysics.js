import { Vector3, Quaternion } from 'three';
import { PHYS } from '../config/GameConfig.js';

const _n = new Vector3(), _vc = new Vector3(), _vt = new Vector3(), _r = new Vector3(), _dq = new Quaternion();

export class Ball {
  constructor() {
    this.radius = PHYS.BALL_RADIUS;
    this.mass = PHYS.BALL_MASS;
    this.invMass = 1 / this.mass;
    this.pos = new Vector3(0, this.radius, 0);
    this.vel = new Vector3();
    this.angVel = new Vector3();
    this.quat = new Quaternion();
    this.lastTouch = null;      // id de la dernière voiture ayant touché
    this.lastTouchTeam = -1;
    this.lastTouchTime = -10;
    this.prevTouch = null;      // avant-dernier toucheur (passes décisives)
    this.prevTouchTeam = -1;
    this.prevTouchTime = -10;
  }

  reset(x = 0, y = PHYS.BALL_RADIUS, z = 0) {
    this.pos.set(x, y, z);
    this.vel.set(0, 0, 0);
    this.angVel.set(0, 0, 0);
    this.lastTouch = null;
    this.lastTouchTeam = -1;
    this.prevTouch = null;
    this.prevTouchTeam = -1;
  }
}

// Intégration + rebonds contre l'arène. Réutilisé tel quel par la prédiction des bots.
export const BallPhysics = {
  step(ball, dt, arena, onBounce, updateRotation = true) {
    ball.vel.y -= PHYS.GRAVITY * dt;
    ball.vel.multiplyScalar(1 - PHYS.BALL_DRAG * dt);
    const sp = ball.vel.length();
    if (sp > PHYS.BALL_MAX_SPEED) ball.vel.multiplyScalar(PHYS.BALL_MAX_SPEED / sp);
    ball.pos.addScaledVector(ball.vel, dt);

    const R = ball.radius;
    const d = arena.distance(ball.pos.x, ball.pos.y, ball.pos.z);
    if (d < R) {
      arena.normal(ball.pos.x, ball.pos.y, ball.pos.z, _n);
      ball.pos.addScaledVector(_n, R - d);
      const vn = ball.vel.dot(_n);
      if (vn < 0) {
        const e = vn < -2 ? PHYS.BALL_RESTITUTION : 0;
        const jn = -(1 + e) * vn;
        // Vitesse du point de contact (rotation incluse)
        _r.copy(_n).multiplyScalar(-R);
        _vc.crossVectors(ball.angVel, _r).add(ball.vel);
        _vt.copy(_vc).addScaledVector(_n, -_vc.dot(_n));
        const vtLen = _vt.length();
        ball.vel.addScaledVector(_n, jn);
        if (vtLen > 1e-5) {
          // Sphère pleine : masse effective tangentielle = m / 3.5
          const jt = Math.min(PHYS.BALL_FRICTION * jn, vtLen / 3.5);
          _vt.multiplyScalar(-jt / vtLen);
          ball.vel.add(_vt);
          _r.cross(_vt).multiplyScalar(2.5 / (R * R));
          ball.angVel.add(_r);
        }
        if (onBounce && -vn > 4) onBounce(-vn, ball.pos);
      }
    }
    const w = ball.angVel.length();
    if (w > PHYS.BALL_MAX_SPIN) ball.angVel.multiplyScalar(PHYS.BALL_MAX_SPIN / w);
    if (updateRotation) {
      const a = ball.angVel;
      _dq.set(a.x * dt * 0.5, a.y * dt * 0.5, a.z * dt * 0.5, 0).multiply(ball.quat);
      ball.quat.set(ball.quat.x + _dq.x, ball.quat.y + _dq.y, ball.quat.z + _dq.z, ball.quat.w + _dq.w).normalize();
    }
  },
};
