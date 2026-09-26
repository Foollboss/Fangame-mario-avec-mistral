import { Vector3, Quaternion } from 'three';
import { CAR, PHYS } from '../core/Config.js';
import { clamp } from '../core/MathUtil.js';

const UP = new Vector3(0, 1, 0);
const _q = new Quaternion();
const _q2 = new Quaternion();
const _v = new Vector3();
const _ax = new Vector3();
const _ay = new Vector3();
const _az = new Vector3();
const _c = new Vector3();

// Arcade rigid-body car. On the ground the body is kept upright and driven by a yaw heading with
// strong lateral grip; in the air it becomes a free body with direct angular-rate control.
// Suspension is a spring-damper on the chassis (pitch/roll/heave) used for feel and visuals.
export class VehiclePhysics {
  constructor(stats) {
    this.stats = stats;
    this.mass = CAR.baseMass * stats.mass;
    this.pos = new Vector3(0, CAR.rideHeight, 0);
    this.vel = new Vector3();
    this.quat = new Quaternion();
    this.angVel = new Vector3(); // local frame, air only
    this.yaw = 0;
    this.grounded = true;
    this.flip = null;
    this.landTilt = new Quaternion();
    this.susp = { y: 0, vy: 0, pitch: 0, vpitch: 0, roll: 0, vroll: 0 };
    this.forwardSpeed = 0;
    this.longAcc = 0;
    this.latAcc = 0;
    this.wallHit = 0;
    this.landImpact = 0;
    this.steerVisual = 0;
  }

  place(x, z, yaw) {
    this.pos.set(x, CAR.rideHeight, z);
    this.vel.set(0, 0, 0);
    this.angVel.set(0, 0, 0);
    this.yaw = yaw;
    this.quat.setFromAxisAngle(UP, yaw);
    this.grounded = true;
    this.flip = null;
    this.landTilt.identity();
    this.susp.y = this.susp.vy = this.susp.pitch = this.susp.vpitch = this.susp.roll = this.susp.vroll = 0;
  }

  forward(out = new Vector3()) { return out.set(0, 0, 1).applyQuaternion(this.quat); }
  up(out = new Vector3()) { return out.set(0, 1, 0).applyQuaternion(this.quat); }
  right(out = new Vector3()) { return out.set(-1, 0, 0).applyQuaternion(this.quat); }

  get speed() { return this.vel.length(); }

  // ctl: { throttle -1..1, steer -1..1, pitch -1..1, boosting, jumpHold }
  step(dt, ctl, arena) {
    this.wallHit = 0;
    this.landImpact = 0;
    this.steerVisual += (ctl.steer - this.steerVisual) * Math.min(1, dt * 12);
    if (this.grounded) this.stepGround(dt, ctl);
    else this.stepAir(dt, ctl);
    this.collideArena(arena);
    if (!this.grounded) this.handleFloorInAir(dt);
    this.stepSuspension(dt);
    // Visual landing tilt relaxes towards identity
    if (this.landTilt.w < 0.99999) this.landTilt.slerp(_q.identity(), Math.min(1, dt * 14));
  }

  stepGround(dt, ctl) {
    const st = this.stats;
    // If something launched us (ball, bump), leave the ground.
    if (this.vel.y > 3) {
      this.grounded = false;
      return this.stepAir(dt, ctl);
    }
    let fx = Math.sin(this.yaw), fz = Math.cos(this.yaw);
    let rx = -fz, rz = fx;
    let vf = this.vel.x * fx + this.vel.z * fz;
    let vl = this.vel.x * rx + this.vel.z * rz;
    const maxV = CAR.maxThrottleSpeed * st.speed;
    const cap = CAR.maxSpeed * (1 + (st.speed - 1) * 0.5);
    let throttle = ctl.boosting ? 1 : ctl.throttle;
    let a = 0;
    if (ctl.boosting) a += CAR.boostAccel * st.boost;
    if (throttle > 0.05) {
      if (vf < -0.5) a += CAR.brakeDecel * throttle;
      else if (vf < maxV) a += CAR.throttleAccel * st.accel * (1 - 0.88 * Math.max(0, vf) / maxV) * throttle;
    } else if (throttle < -0.05) {
      if (vf > 0.5) a -= CAR.brakeDecel * -throttle;
      else if (vf > -CAR.reverseMax) a -= CAR.reverseAccel * st.accel * -throttle;
    } else {
      const dec = CAR.coastDecel * dt;
      if (Math.abs(vf) <= dec) { vf = 0; } else a -= Math.sign(vf) * CAR.coastDecel;
    }
    const prevVf = vf;
    vf += a * dt;
    if (vf > cap) vf = cap;
    // Above throttle top speed without boost: slow bleed so supersonic is earned
    if (!ctl.boosting && vf > maxV) vf -= Math.min(vf - maxV, 3 * dt);
    vl *= Math.exp(-CAR.grip * st.handling * dt);

    const speedFactor = clamp(Math.abs(vf) / 7, 0, 1);
    const highSpeedDamp = 1 - 0.28 * clamp((Math.abs(vf) - maxV) / (cap - maxV), 0, 1);
    const yawRate = -ctl.steer * CAR.turnRate * st.handling * speedFactor * highSpeedDamp * (vf < 0 ? -1 : 1);
    this.yaw += yawRate * dt;
    fx = Math.sin(this.yaw); fz = Math.cos(this.yaw);
    rx = -fz; rz = fx;
    this.vel.set(fx * vf + rx * vl, 0, fz * vf + rz * vl);
    this.pos.x += this.vel.x * dt;
    this.pos.z += this.vel.z * dt;
    this.pos.y = CAR.rideHeight;
    this.quat.setFromAxisAngle(UP, this.yaw);
    this.forwardSpeed = vf;

    // Suspension excitation: nose lifts under acceleration, body rolls out of turns.
    this.longAcc = (vf - prevVf) / dt;
    this.latAcc = vf * yawRate;
  }

  stepAir(dt, ctl) {
    const st = this.stats;
    this.longAcc = 0;
    this.latAcc = 0;
    this.vel.y -= PHYS.gravity * dt;
    this.forward(_az);
    if (ctl.boosting) this.vel.addScaledVector(_az, CAR.airBoostAccel * st.boost * dt);
    if (ctl.jumpHold) {
      this.up(_ay);
      this.vel.addScaledVector(_ay, CAR.jumpHoldAccel * dt);
    }
    if (this.flip) {
      const f = this.flip;
      f.t += dt;
      const k = Math.min(1, f.t / f.dur);
      // ease so the car spends more time pointed into the ball
      const ang = Math.PI * 2 * (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
      _q.setFromAxisAngle(f.axis, ang);
      this.quat.copy(f.base).multiply(_q);
      if (this.vel.y < 0) this.vel.y *= 1 - Math.min(1, 3.5 * dt);
      if (k >= 1) {
        this.quat.copy(f.base);
        this.flip = null;
        this.angVel.set(0, 0, 0);
      }
    } else {
      const air = st.air;
      const tx = ctl.pitch * CAR.airPitchRate * air;
      const ty = -ctl.steer * CAR.airYawRate * air;
      const r = Math.min(1, CAR.airResponse * dt);
      this.angVel.x += (tx - this.angVel.x) * r;
      this.angVel.y += (ty - this.angVel.y) * r;
      this.angVel.z += (0 - this.angVel.z) * r;
      const w = this.angVel.length();
      if (w > 1e-5) {
        _v.copy(this.angVel).multiplyScalar(1 / w);
        _q.setFromAxisAngle(_v, w * dt);
        this.quat.multiply(_q).normalize();
      }
    }
    const cap = CAR.maxSpeed * (1 + (st.speed - 1) * 0.5);
    const sp = this.vel.length();
    if (sp > cap) this.vel.multiplyScalar(cap / sp);
    this.pos.addScaledVector(this.vel, dt);
    this.forwardSpeed = this.vel.dot(this.forward(_az));
  }

  lowestPointOffset() {
    const h = CAR.halfExtents;
    _ax.set(1, 0, 0).applyQuaternion(this.quat);
    _ay.set(0, 1, 0).applyQuaternion(this.quat);
    _az.set(0, 0, 1).applyQuaternion(this.quat);
    return Math.abs(_ax.y) * h.x + Math.abs(_ay.y) * h.y + Math.abs(_az.y) * h.z;
  }

  handleFloorInAir(dt) {
    const ext = this.lowestPointOffset(); // fills _ay
    const upY = _ay.y;
    const wheelsDown = upY > 0.55;
    const clearance = wheelsDown ? CAR.rideHeight - CAR.halfExtents.y : 0.02;
    const lowest = this.pos.y - ext;

    // Auto-recovery when tumbling close to the floor: roll back onto the wheels.
    if (!this.flip && !wheelsDown && lowest < 3 && this.vel.y < 8) {
      const yaw = this.headingYaw();
      _q2.setFromAxisAngle(UP, yaw);
      this.quat.slerp(_q2, Math.min(1, dt * 7));
      this.angVel.multiplyScalar(0.9);
    }
    if (lowest > clearance) return;
    if (this.vel.y > 0.5 && !this.flip) {
      this.pos.y += clearance - lowest;
      return;
    }
    if (this.flip) {
      const k = this.flip.t / this.flip.dur;
      if (k > 0.72 && wheelsDown) {
        this.quat.copy(this.flip.base);
        this.flip = null;
        this.land();
        return;
      }
      this.pos.y += clearance - lowest;
      if (this.vel.y < 0) this.vel.y = 0;
      return;
    }
    if (wheelsDown) {
      this.land();
    } else {
      this.pos.y += clearance - lowest;
      this.vel.y = Math.max(-this.vel.y * 0.3, 4.5);
      this.vel.x *= 0.9;
      this.vel.z *= 0.9;
    }
  }

  headingYaw() {
    this.forward(_az);
    const h = Math.hypot(_az.x, _az.z);
    if (h > 0.25) return Math.atan2(_az.x, _az.z);
    const vh = Math.hypot(this.vel.x, this.vel.z);
    if (vh > 2) return Math.atan2(this.vel.x, this.vel.z);
    this.up(_ay);
    return Math.atan2(-_ay.x * Math.sign(_az.y || 1), -_ay.z * Math.sign(_az.y || 1));
  }

  land() {
    const impact = Math.max(0, -this.vel.y);
    this.landImpact = impact;
    this.yaw = this.headingYaw();
    _q.setFromAxisAngle(UP, this.yaw);
    // Keep the visual continuity: store the air orientation relative to the flat one.
    this.landTilt.copy(_q).invert().multiply(this.quat);
    this.quat.copy(_q);
    this.pos.y = CAR.rideHeight;
    this.vel.y = 0;
    this.angVel.set(0, 0, 0);
    this.grounded = true;
    this.susp.vy -= impact * 0.09;
  }

  collideArena(arena) {
    this.forward(_az);
    const off = CAR.capsuleOffset;
    const r = CAR.capsuleRadius;
    for (let i = 0; i < 2; i++) {
      const s = i === 0 ? off : -off;
      _c.copy(this.pos).addScaledVector(_az, s);
      arena.resolveSphere(_c, r, (nx, ny, nz, pen) => {
        if (this.grounded && ny < -0.5) return; // ceiling unreachable when grounded
        const gy = this.grounded ? 0 : ny;
        this.pos.x += nx * pen;
        this.pos.y += gy * pen;
        this.pos.z += nz * pen;
        const vn = this.vel.x * nx + this.vel.y * gy + this.vel.z * nz;
        if (vn < 0) {
          const e = 0.12;
          this.vel.x -= nx * vn * (1 + e);
          this.vel.y -= gy * vn * (1 + e);
          this.vel.z -= nz * vn * (1 + e);
          if (-vn > this.wallHit) this.wallHit = -vn;
        }
      }, false);
    }
  }

  stepSuspension(dt) {
    const s = this.susp;
    const k = 190, c = 15;
    s.vy += (-k * s.y - c * s.vy) * dt;
    s.y += s.vy * dt;
    s.vpitch += (-k * s.pitch - c * s.vpitch - this.longAcc * 0.22) * dt;
    s.pitch += s.vpitch * dt;
    s.vroll += (-k * s.roll - c * s.vroll + this.latAcc * 0.13) * dt;
    s.roll += s.vroll * dt;
    s.y = clamp(s.y, -0.35, 0.25);
    s.pitch = clamp(s.pitch, -0.12, 0.12);
    s.roll = clamp(s.roll, -0.1, 0.1);
  }

  // --- Actions (called by VehicleController) ---
  jump(impulse) {
    this.up(_ay);
    this.vel.addScaledVector(_ay, impulse);
    this.grounded = false;
    this.pos.y += 0.02;
    this.susp.vy += 0.8;
  }

  // dx: right, dy: forward (stick space)
  dodge(dx, dy, impulse) {
    let len = Math.hypot(dx, dy);
    if (len < 0.3) { dx = 0; dy = 1; len = 1; }
    dx /= len; dy /= len;
    // Horizontal frame from the car heading
    const yaw = this.headingYaw();
    const fx = Math.sin(yaw), fz = Math.cos(yaw);
    const rx = -fz, rz = fx;
    const wx = fx * dy + rx * dx;
    const wz = fz * dy + rz * dx;
    this.vel.x += wx * impulse;
    this.vel.z += wz * impulse;
    if (this.vel.y < 0) this.vel.y = 0;
    this.vel.y += 1.5;
    if (this.grounded) {
      this.grounded = false;
      this.vel.y += 6.5;
      this.pos.y += 0.05;
    }
    // front flip rotates around local +X, side flip around local +Z
    const axis = new Vector3(dy, 0, dx).normalize();
    this.flip = { axis, t: 0, dur: CAR.dodgeDuration, base: this.quat.clone(), dirX: wx, dirZ: wz };
  }

  // Angular speed of a point on the car during a flip (adds punch to flip hits).
  flipAngularSpeed() {
    return this.flip ? (Math.PI * 2) / this.flip.dur : 0;
  }
}
