import { Vector3, Quaternion, Matrix4 } from 'three';
import { CAR, PHYS } from '../core/Config.js';
import { clamp } from '../core/MathUtil.js';

const UP = new Vector3(0, 1, 0);
const _q = new Quaternion();
const _q2 = new Quaternion();
const _m = new Matrix4();
const _v = new Vector3();
const _v2 = new Vector3();
const _n = new Vector3();
const _x = new Vector3();
const _ax = new Vector3();
const _ay = new Vector3();
const _az = new Vector3();
const _c = new Vector3();

// Arcade rigid-body car.
// On a surface (floor, curved ramps, walls, ceiling) the car is kept aligned with the surface
// normal and driven along its own forward tangent with strong lateral grip; gravity only acts
// along the surface while the car sticks to it. In the air it is a free body with direct
// angular-rate control and boost thrust along the nose (enough to fly).
// Suspension is a spring-damper on the chassis (pitch/roll/heave) used for feel and visuals.
export class VehiclePhysics {
  constructor(stats) {
    this.stats = stats;
    this.mass = CAR.baseMass * stats.mass;
    this.pos = new Vector3(0, CAR.rideHeight, 0);
    this.vel = new Vector3();
    this.quat = new Quaternion();
    this.angVel = new Vector3(); // local frame, air only
    this.surfN = new Vector3(0, 1, 0); // inward normal of the surface we drive on
    this.fwd = new Vector3(0, 0, 1); // forward tangent while on a surface
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
    this.surfN.set(0, 1, 0);
    this.fwd.set(Math.sin(yaw), 0, Math.cos(yaw));
    this.setBasis();
    this.grounded = true;
    this.flip = null;
    this.landTilt.identity();
    this.susp.y = this.susp.vy = this.susp.pitch = this.susp.vpitch = this.susp.roll = this.susp.vroll = 0;
  }

  // Orientation from the surface frame: local +Y = normal, +Z = forward, +X = left.
  setBasis() {
    _x.crossVectors(this.surfN, this.fwd);
    _m.makeBasis(_x, this.surfN, this.fwd);
    this.quat.setFromRotationMatrix(_m);
  }

  forward(out = new Vector3()) { return out.set(0, 0, 1).applyQuaternion(this.quat); }
  up(out = new Vector3()) { return out.set(0, 1, 0).applyQuaternion(this.quat); }
  right(out = new Vector3()) { return out.set(-1, 0, 0).applyQuaternion(this.quat); }

  get speed() { return this.vel.length(); }

  // Heading on the horizontal plane (used by bots, camera and dodges).
  get yaw() {
    this.forward(_az);
    return Math.atan2(_az.x, _az.z);
  }

  // Driving on something that is not the floor (ramp, wall, ceiling).
  get onWall() {
    return this.grounded && this.surfN.y < 0.9;
  }

  // Moves the car; while on a surface, never pushes it through or off that surface.
  nudge(dx, dy, dz) {
    if (this.grounded) {
      const d = dx * this.surfN.x + dy * this.surfN.y + dz * this.surfN.z;
      dx -= this.surfN.x * d;
      dy -= this.surfN.y * d;
      dz -= this.surfN.z * d;
    }
    this.pos.x += dx;
    this.pos.y += dy;
    this.pos.z += dz;
  }

  // ctl: { throttle -1..1, steer -1..1, pitch -1..1, boosting, jumpHold }
  step(dt, ctl, arena) {
    this.wallHit = 0;
    this.landImpact = 0;
    this.steerVisual += (ctl.steer - this.steerVisual) * Math.min(1, dt * 12);
    if (this.grounded) this.stepSurface(dt, ctl, arena);
    else this.stepAir(dt, ctl);
    this.collideBody(arena);
    if (!this.grounded) this.contactsInAir(dt, arena);
    this.stepSuspension(dt);
    // Visual landing tilt relaxes towards identity
    if (this.landTilt.w < 0.99999) this.landTilt.slerp(_q.identity(), Math.min(1, dt * 14));
  }

  stepSurface(dt, ctl, arena) {
    const st = this.stats;
    const n = this.surfN;
    // Launched away from the surface (jump, ball, bump): take off.
    const vn = this.vel.dot(n);
    if (vn > 4) {
      this.grounded = false;
      return this.stepAir(dt, ctl);
    }
    // Gravity: along the surface it always acts; its pull away from the surface (walls
    // leaning over, ceiling) is cancelled while the car sticks: moving, throttling or boosting.
    const gN = -PHYS.gravity * n.y;
    const tangentSpeed = Math.sqrt(Math.max(0, this.vel.lengthSq() - vn * vn));
    const sticks = n.y > 0.35 || tangentSpeed > CAR.stickSpeed || Math.abs(ctl.throttle) > 0.1 || ctl.boosting;
    if (gN > 0 && !sticks) {
      this.grounded = false;
      return this.stepAir(dt, ctl);
    }
    const f = this.fwd;
    const r = _v.crossVectors(f, n); // right
    // Tangent gravity components
    const gx = -n.x * gN, gy = -PHYS.gravity - n.y * gN, gz = -n.z * gN;
    let vf = this.vel.dot(f) + (gx * f.x + gy * f.y + gz * f.z) * dt;
    let vl = this.vel.dot(r) + (gx * r.x + gy * r.y + gz * r.z) * dt;

    const maxV = CAR.maxThrottleSpeed * st.speed;
    const cap = CAR.maxSpeed * (1 + (st.speed - 1) * 0.5);
    const throttle = ctl.boosting ? 1 : ctl.throttle;
    let a = 0;
    if (ctl.boosting) a += CAR.boostAccel * st.boost;
    if (throttle > 0.05) {
      if (vf < -0.5) a += CAR.brakeDecel * throttle;
      else if (vf < maxV) a += CAR.throttleAccel * st.accel * (1 - 0.88 * Math.max(0, vf) / maxV) * throttle;
    } else if (throttle < -0.05) {
      if (vf > 0.5) a -= CAR.brakeDecel * -throttle;
      else if (vf > -CAR.reverseMax) a -= CAR.reverseAccel * st.accel * -throttle;
    } else if (n.y > 0.7) {
      // Coasting on the floor slows down; on walls gravity already does the job.
      const dec = CAR.coastDecel * dt;
      if (Math.abs(vf) <= dec) vf = 0;
      else a -= Math.sign(vf) * CAR.coastDecel;
    }
    const prevVf = vf;
    vf += a * dt;
    if (vf > cap) vf = cap;
    if (!ctl.boosting && vf > maxV) vf -= Math.min(vf - maxV, 3 * dt);
    vl *= Math.exp(-CAR.grip * st.handling * dt);

    const speedFactor = clamp(Math.abs(vf) / 7, 0, 1);
    const highSpeedDamp = 1 - 0.28 * clamp((Math.abs(vf) - maxV) / (cap - maxV), 0, 1);
    const yawRate = -ctl.steer * CAR.turnRate * st.handling * speedFactor * highSpeedDamp * (vf < 0 ? -1 : 1);
    // Rotate the heading around the surface normal (left = n × f)
    const ang = yawRate * dt;
    _x.crossVectors(n, f);
    f.multiplyScalar(Math.cos(ang)).addScaledVector(_x, Math.sin(ang)).normalize();
    r.crossVectors(f, n);
    this.vel.copy(f).multiplyScalar(vf).addScaledVector(r, vl);
    this.pos.addScaledVector(this.vel, dt);

    // Follow the surface (curved ramps, walls, ceiling), sampled right under the wheels so the
    // nearest-wall confusion of sharp corners (inside the goals) cannot flip the frame.
    _c.copy(this.pos).addScaledVector(n, -CAR.rideHeight);
    const s = arena.sd(_c.x, _c.y, _c.z);
    const g = arena.gradient(_c.x, _c.y, _c.z);
    _n.set(-g.x, -g.y, -g.z);
    if (s < -0.9 || _n.dot(n) < 0.5 || !arena.drivable(this.pos, _n)) {
      // Drove off an edge (goal post, crossbar, ramp end): now airborne.
      this.grounded = false;
      this.forwardSpeed = vf;
      return;
    }
    this.pos.addScaledVector(_n, s);
    const speed = this.vel.length();
    this.vel.addScaledVector(_n, -this.vel.dot(_n));
    const sp2 = this.vel.length();
    if (sp2 > 1e-4) this.vel.multiplyScalar(speed / sp2);
    f.addScaledVector(_n, -f.dot(_n));
    if (f.lengthSq() < 0.01) f.crossVectors(_n, _x.crossVectors(r, _n)).normalize();
    f.normalize();
    n.copy(_n);
    this.setBasis();
    this.forwardSpeed = vf;
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

  // Half-size of the car's box along a direction (distance from centre to its lowest point).
  extentAlong(n) {
    const h = CAR.halfExtents;
    _ax.set(1, 0, 0).applyQuaternion(this.quat);
    _ay.set(0, 1, 0).applyQuaternion(this.quat);
    _az.set(0, 0, 1).applyQuaternion(this.quat);
    return Math.abs(_ax.dot(n)) * h.x + Math.abs(_ay.dot(n)) * h.y + Math.abs(_az.dot(n)) * h.z;
  }

  // Landing on (or bouncing off) the floor, ramps, walls and ceiling.
  contactsInAir(dt, arena) {
    const depth = arena.surface(this.pos, _n);
    if (depth > 5) return;
    const ext = this.extentAlong(_n); // fills _ay with the car up vector
    const wheelsFacing = _ay.dot(_n) > 0.55;
    const clearance = wheelsFacing ? CAR.rideHeight - CAR.halfExtents.y : 0.02;
    const gap = depth - ext;

    // Auto-recovery when tumbling close to the floor: roll back onto the wheels.
    if (!this.flip && !wheelsFacing && _n.y > 0.7 && gap < 3 && this.vel.y < 8) {
      _q2.setFromAxisAngle(UP, this.headingYaw());
      this.quat.slerp(_q2, Math.min(1, dt * 7));
      this.angVel.multiplyScalar(0.9);
    }
    if (gap > clearance) return;
    const vn = this.vel.dot(_n);
    if (vn > 0.5 && !this.flip) {
      this.pos.addScaledVector(_n, clearance - gap);
      return;
    }
    if (this.flip) {
      const k = this.flip.t / this.flip.dur;
      if (k > 0.72 && wheelsFacing && arena.drivable(this.pos, _n)) {
        this.quat.copy(this.flip.base);
        this.flip = null;
        this.land(_n, depth);
        return;
      }
      this.pos.addScaledVector(_n, clearance - gap);
      if (vn < 0) this.vel.addScaledVector(_n, -vn);
      return;
    }
    if (wheelsFacing && arena.drivable(this.pos, _n)) {
      this.land(_n, depth);
    } else {
      // Roof or side first: bounce off.
      this.pos.addScaledVector(_n, clearance - gap);
      this.vel.addScaledVector(_n, -vn * 1.3);
      if (_n.y > 0.7) {
        this.vel.y = Math.max(this.vel.y, 4.5);
        this.vel.x *= 0.9;
        this.vel.z *= 0.9;
      }
      if (-vn > this.wallHit) this.wallHit = -vn;
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

  land(n, depth) {
    const impact = Math.max(0, -this.vel.dot(n));
    this.landImpact = impact;
    // Keep the heading the car had, projected on the surface.
    this.forward(_v2);
    _v2.addScaledVector(n, -_v2.dot(n));
    if (_v2.lengthSq() < 0.04) {
      _v2.copy(this.vel).addScaledVector(n, -this.vel.dot(n));
      if (_v2.lengthSq() < 1) {
        this.up(_v2);
        _v2.addScaledVector(n, -_v2.dot(n));
        if (_v2.lengthSq() < 1e-4) _v2.set(n.y, -n.x, 0);
      }
    }
    this.fwd.copy(_v2).normalize();
    this.surfN.copy(n);
    _q.copy(this.quat);
    this.setBasis();
    // Visual continuity: keep the air orientation as an offset that relaxes.
    this.landTilt.copy(this.quat).invert().multiply(_q);
    this.pos.addScaledVector(n, CAR.rideHeight - depth);
    this.vel.addScaledVector(n, -this.vel.dot(n));
    this.angVel.set(0, 0, 0);
    this.grounded = true;
    this.susp.vy -= impact * 0.09;
  }

  // Body spheres against the arena: goal posts, goal nets, sharp corners.
  collideBody(arena) {
    this.forward(_az);
    const off = CAR.capsuleOffset;
    const r = CAR.bodyRadius;
    for (let i = 0; i < 2; i++) {
      _c.copy(this.pos).addScaledVector(_az, i === 0 ? off : -off);
      arena.resolveSphere(_c, r, (nx, ny, nz, pen) => {
        if (this.grounded && nx * this.surfN.x + ny * this.surfN.y + nz * this.surfN.z > 0.8) return;
        this.nudge(nx * pen, ny * pen, nz * pen);
        const vn = this.vel.x * nx + this.vel.y * ny + this.vel.z * nz;
        if (vn < 0) {
          const e = 0.12;
          this.vel.x -= nx * vn * (1 + e);
          this.vel.y -= ny * vn * (1 + e);
          this.vel.z -= nz * vn * (1 + e);
          if (-vn > this.wallHit) this.wallHit = -vn;
        }
      });
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
  // Jumps along the car's up axis: straight off a wall or the ceiling too.
  jump(impulse) {
    this.up(_ay);
    this.vel.addScaledVector(_ay, impulse);
    this.pos.addScaledVector(_ay, 0.02);
    this.grounded = false;
    this.susp.vy += 0.8;
  }

  // dx: right, dy: forward (stick space)
  dodge(dx, dy, impulse) {
    let len = Math.hypot(dx, dy);
    if (len < 0.3) { dx = 0; dy = 1; len = 1; }
    dx /= len; dy /= len;
    if (this.grounded) {
      // From a surface: dash along it, hopping off it
      const n = this.surfN;
      _v.crossVectors(this.fwd, n);
      _v2.copy(this.fwd).multiplyScalar(dy).addScaledVector(_v, dx);
      this.vel.addScaledVector(_v2, impulse).addScaledVector(n, 8);
      this.pos.addScaledVector(n, 0.05);
      this.grounded = false;
    } else {
      // In the air: horizontal frame from the car heading
      const yaw = this.headingYaw();
      const fx = Math.sin(yaw), fz = Math.cos(yaw);
      const rx = -fz, rz = fx;
      this.vel.x += (fx * dy + rx * dx) * impulse;
      this.vel.z += (fz * dy + rz * dx) * impulse;
      if (this.vel.y < 0) this.vel.y = 0;
      this.vel.y += 1.5;
    }
    // front flip rotates around local +X, side flip around local +Z
    const axis = new Vector3(dy, 0, dx).normalize();
    this.flip = { axis, t: 0, dur: CAR.dodgeDuration, base: this.quat.clone() };
  }

  // Angular speed of a point on the car during a flip (adds punch to flip hits).
  flipAngularSpeed() {
    return this.flip ? (Math.PI * 2) / this.flip.dur : 0;
  }
}
