import { Vector3, Quaternion } from 'three';
import { BALL, PHYS } from '../core/Config.js';

const _axis = new Vector3();
const _dq = new Quaternion();

export class BallController {
  constructor(arenaCollision) {
    this.arena = arenaCollision;
    this.radius = BALL.radius;
    this.mass = BALL.mass;
    this.pos = new Vector3(0, BALL.radius, 0);
    this.vel = new Vector3();
    this.angVel = new Vector3();
    this.quat = new Quaternion();
    this.lastImpact = 0; // strongest wall/floor impact speed during the last step
    this.onFloor = true;
    this.frozen = false;
    this.hidden = false;
  }

  reset(x = 0, y = BALL.radius, z = 0) {
    this.pos.set(x, y, z);
    this.vel.set(0, 0, 0);
    this.angVel.set(0, 0, 0);
    this.frozen = false;
    this.hidden = false;
  }

  step(dt) {
    this.lastImpact = 0;
    if (this.frozen) return;
    stepBallState(this, dt, this.arena, this);
    // Visual rotation (kept in the state so replays and snapshots stay faithful)
    const w = this.angVel.length();
    if (w > 1e-4) {
      _axis.copy(this.angVel).multiplyScalar(1 / w);
      _dq.setFromAxisAngle(_axis, w * dt);
      this.quat.premultiply(_dq).normalize();
    }
  }
}

// Shared by the real ball and the trajectory predictor. `s` has pos/vel/angVel/onFloor.
export function stepBallState(s, dt, arena, impactSink) {
  const R = BALL.radius;
  const v = s.vel;
  v.y -= PHYS.gravity * dt;
  const drag = 1 - BALL.airDrag * dt;
  v.x *= drag; v.y *= drag; v.z *= drag;
  const sp2 = v.x * v.x + v.y * v.y + v.z * v.z;
  if (sp2 > BALL.maxSpeed * BALL.maxSpeed) v.multiplyScalar(BALL.maxSpeed / Math.sqrt(sp2));

  s.pos.x += v.x * dt;
  s.pos.y += v.y * dt;
  s.pos.z += v.z * dt;

  let floor = false;
  arena.resolveSphere(s.pos, R, (nx, ny, nz) => {
    const vn = v.x * nx + v.y * ny + v.z * nz;
    if (ny > 0.7) floor = true;
    if (vn >= 0) return;
    if (impactSink && -vn > impactSink.lastImpact) impactSink.lastImpact = -vn;
    // Tangential velocity loses a share proportional to the normal impulse (Coulomb-ish)
    const tx = v.x - nx * vn;
    const ty = v.y - ny * vn;
    const tz = v.z - nz * vn;
    const tl = Math.sqrt(tx * tx + ty * ty + tz * tz);
    let tScale = 1;
    if (tl > 1e-5) tScale = Math.max(0, 1 - (BALL.friction * -vn * (1 + BALL.restitution)) / tl);
    // Low-speed bounces die out so the ball can settle and roll.
    const e = -vn < 2.5 ? 0 : BALL.restitution;
    v.x = tx * tScale - nx * vn * e;
    v.y = ty * tScale - ny * vn * e;
    v.z = tz * tScale - nz * vn * e;
    if (s.angVel) {
      // Spin picks up the rolling direction of the contact surface
      s.angVel.set(ny * v.z - nz * v.y, nz * v.x - nx * v.z, nx * v.y - ny * v.x).multiplyScalar(1 / R);
    }
  });

  if (floor && Math.abs(v.y) < 1.5) {
    v.y = 0;
    const rd = 1 - BALL.rollingDrag * dt;
    v.x *= rd;
    v.z *= rd;
    if (s.angVel) s.angVel.set(v.z / R, 0, -v.x / R);
  }
  s.onFloor = floor;
}
