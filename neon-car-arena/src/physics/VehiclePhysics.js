import { Vector3, Quaternion } from 'three';
import { PHYS } from '../config/GameConfig.js';
import { clamp, curve } from '../core/math.js';

// Courbure de braquage (1/rayon) en fonction de la vitesse : on tourne serré à basse vitesse.
const CURVATURE = [[0, 0.23], [15, 0.133], [30, 0.079], [45, 0.046], [52.5, 0.037], [75, 0.03]];

const _mount = new Vector3(), _dir = new Vector3(), _hit = new Vector3(), _n = new Vector3();
const _pv = new Vector3(), _J = new Vector3(), _nSum = new Vector3(), _tmp = new Vector3();
const _corner = new Vector3(), _wl = new Vector3(), _q = new Quaternion(), _dq = new Quaternion();
const _vt = new Vector3();

const CORNERS = [];
for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) CORNERS.push([x, y, z]);

export const VehiclePhysics = {
  step(car, dt, arena) {
    car.updateBasis();
    const s = car.stats;
    car.vel.y -= PHYS.GRAVITY * dt;

    this.suspension(car, dt, arena);

    if (car.onGround) this.drive(car, dt);
    else if (!car.dashing) this.airControl(car, dt);

    if (car.dashing) {
      car.dashT += dt;
      car.angVel.copy(car.dashAxis).multiplyScalar(Math.PI * 2 / PHYS.DASH_DURATION);
      if (car.dashT >= PHYS.DASH_DURATION || car.onGround) {
        car.dashing = false;
        car.angVel.multiplyScalar(0.15);
      }
    }

    if (car.boosting) car.vel.addScaledVector(car.fwd, PHYS.BOOST_ACCEL * s.boost * dt);
    else if (!car.onGround && car.throttle !== 0) car.vel.addScaledVector(car.fwd, PHYS.AIR_THROTTLE_ACCEL * car.throttle * dt);

    const maxSpeed = PHYS.CAR_MAX_SPEED * s.speed;
    const sp = car.vel.length();
    if (sp > maxSpeed) car.vel.multiplyScalar(maxSpeed / sp);
    car.supersonic = sp > maxSpeed * PHYS.SUPERSONIC_RATIO;

    // Intégration
    car.pos.addScaledVector(car.vel, dt);
    const w = car.angVel;
    _dq.set(w.x * dt * 0.5, w.y * dt * 0.5, w.z * dt * 0.5, 0).multiply(car.quat);
    car.quat.set(car.quat.x + _dq.x, car.quat.y + _dq.y, car.quat.z + _dq.z, car.quat.w + _dq.w).normalize();

    this.hullCollision(car, dt, arena);
  },

  suspension(car, dt, arena) {
    const k = car.mass * (2 * Math.PI * PHYS.SUSP_FREQ) ** 2 / 4;
    const c = 2 * PHYS.SUSP_DAMPING * Math.sqrt(k * car.mass / 4);
    _dir.copy(car.up).negate();
    _nSum.set(0, 0, 0);
    let count = 0;
    if (car.jumpGraceT > 0) car.jumpGraceT -= dt;
    for (let i = 0; i < 4; i++) {
      if (car.jumpGraceT > 0) { car.wheelContact[i] = false; car.wheelCompress[i] = 0; continue; }
      _mount.copy(car.wheelMounts[i]).applyQuaternion(car.quat).add(car.pos);
      const t = arena.raycast(_mount, _dir, PHYS.SUSP_REST);
      if (t < 0) {
        car.wheelContact[i] = false;
        car.wheelCompress[i] = 0;
        continue;
      }
      car.wheelContact[i] = true;
      count++;
      const compress = PHYS.SUSP_REST - t;
      car.wheelCompress[i] = compress;
      _hit.copy(_mount).addScaledVector(_dir, t);
      arena.normal(_hit.x, _hit.y, _hit.z, _n);
      _nSum.add(_n);
      car.pointVelocity(_mount, _pv);
      const vn = _pv.dot(car.up);
      const F = Math.max(0, k * compress - c * vn);
      _J.copy(car.up).multiplyScalar(F * dt);
      car.applyImpulse(_J, _mount);
    }
    const wasGround = car.onGround;
    car.wheelCount = count;
    car.onGround = count >= 2 && !car.dashing;
    if (count > 0) car.surfaceNormal.copy(_nSum.normalize());
    if (car.onGround) {
      if (!wasGround) car.landedImpact = Math.max(0, -car.vel.dot(car.surfaceNormal));
      car.airTime = 0;
      car.hasDodge = true;
      car.jumped = false;
      car.pendingDashT = -1;
    } else {
      car.airTime += dt;
      if (car.airTime > PHYS.DODGE_WINDOW) car.hasDodge = false;
    }
  },

  drive(car, dt) {
    const s = car.stats;
    const fwdSpeed = car.vel.dot(car.fwd);
    const absSpeed = Math.abs(fwdSpeed);
    const throttle = car.boosting ? 1 : car.throttle;
    const driveMax = PHYS.DRIVE_MAX_SPEED * s.speed;
    let accel = 0;
    const throttleAccel = PHYS.THROTTLE_ACCEL * s.accel * clamp(1 - absSpeed / driveMax, 0, 1) ** 0.8;
    if (throttle > 0.05) {
      accel = fwdSpeed < -1 ? PHYS.BRAKE_ACCEL : throttleAccel * throttle;
    } else if (throttle < -0.05) {
      accel = fwdSpeed > 1 ? -PHYS.BRAKE_ACCEL * -throttle : -throttleAccel * -throttle * 0.8;
    } else if (absSpeed > 0.01) {
      accel = -Math.sign(fwdSpeed) * Math.min(PHYS.COAST_DECEL, absSpeed / dt);
    }
    car.vel.addScaledVector(car.fwd, accel * dt);

    // Force collante : garde la voiture plaquée sur le sol, les murs et le plafond.
    const onWall = car.surfaceNormal.y < 0.7;
    const slow = absSpeed < 9 && Math.abs(throttle) < 0.1;
    if (!(onWall && slow)) car.vel.addScaledVector(car.surfaceNormal, -PHYS.STICKY_ACCEL * dt);

    // Direction : vitesse de lacet imposée autour de l'axe « haut » de la voiture.
    const yawTarget = -car.steer * absSpeed * curve(CURVATURE, absSpeed) * 1.1 * s.handling * Math.sign(fwdSpeed || 1);
    const current = car.angVel.dot(car.up);
    car.angVel.addScaledVector(car.up, (yawTarget - current) * Math.min(1, 18 * dt));
    // Amortissement du roulis/tangage résiduel au sol
    _tmp.copy(car.up).multiplyScalar(car.angVel.dot(car.up));
    car.angVel.sub(_tmp).multiplyScalar(1 - Math.min(1, 3 * dt)).add(_tmp);

    // Adhérence latérale
    const latSpeed = car.vel.dot(car.left);
    const grip = (onWall && slow ? 0.15 : 1) * PHYS.LATERAL_GRIP * s.handling;
    car.vel.addScaledVector(car.left, -latSpeed * Math.min(1, grip * dt));
  },

  airControl(car, dt) {
    _q.copy(car.quat).invert();
    _wl.copy(car.angVel).applyQuaternion(_q);
    const pitch = car.airPitch, yaw = -car.airYaw, roll = car.airRoll;
    _wl.x += (pitch * PHYS.AIR_PITCH - _wl.x * PHYS.AIR_DAMP_PITCH * (1 - Math.abs(pitch))) * dt;
    _wl.y += (yaw * PHYS.AIR_YAW - _wl.y * PHYS.AIR_DAMP_YAW * (1 - Math.abs(yaw))) * dt;
    _wl.z += (roll * PHYS.AIR_ROLL - _wl.z * PHYS.AIR_DAMP_ROLL) * dt;
    const len = _wl.length();
    if (len > PHYS.MAX_ANG_SPEED) _wl.multiplyScalar(PHYS.MAX_ANG_SPEED / len);
    car.angVel.copy(_wl).applyQuaternion(car.quat);
  },

  hullCollision(car, dt, arena) {
    car.updateBasis();
    let hits = 0;
    for (const [sx, sy, sz] of CORNERS) {
      _corner.set(sx * car.half.x, sy * car.half.y, sz * car.half.z).applyQuaternion(car.quat).add(car.pos);
      const d = arena.distance(_corner.x, _corner.y, _corner.z);
      if (d >= 0) continue;
      hits++;
      arena.normal(_corner.x, _corner.y, _corner.z, _n);
      car.pos.addScaledVector(_n, -d * 0.9);
      _corner.addScaledVector(_n, -d * 0.9);
      car.pointVelocity(_corner, _pv);
      const vn = _pv.dot(_n);
      if (vn >= 0) continue;
      const kInv = car.effectiveInvMass(_corner, _n);
      const jn = -(1 + PHYS.HULL_RESTITUTION) * vn / kInv;
      _J.copy(_n).multiplyScalar(jn);
      car.applyImpulse(_J, _corner);
      // Frottement
      car.pointVelocity(_corner, _pv);
      _vt.copy(_pv).addScaledVector(_n, -_pv.dot(_n));
      const vtLen = _vt.length();
      if (vtLen > 1e-4) {
        _vt.multiplyScalar(1 / vtLen);
        const kt = car.effectiveInvMass(_corner, _vt);
        const jt = Math.min(PHYS.HULL_FRICTION * jn, vtLen / kt);
        _J.copy(_vt).multiplyScalar(-jt);
        car.applyImpulse(_J, _corner);
      }
    }
    car.hullContact = hits > 0;

    // Redressement automatique quand la voiture est coincée sur le toit ou le flanc.
    if (car.hullContact && !car.onGround && car.vel.lengthSq() < 36) {
      car.stuckT += dt;
      if (car.stuckT > 0.45) {
        car.stuckT = 0;
        arena.normal(car.pos.x, car.pos.y, car.pos.z, _n);
        _tmp.crossVectors(car.up, _n);
        if (_tmp.lengthSq() < 0.01) _tmp.copy(car.fwd);
        car.angVel.copy(_tmp.normalize()).multiplyScalar(5.5);
        car.vel.addScaledVector(_n, 6);
      }
    } else car.stuckT = 0;
  },
};
