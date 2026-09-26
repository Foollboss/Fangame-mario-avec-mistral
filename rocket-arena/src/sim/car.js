import { Vector3, Quaternion } from 'three';
import { PHYS, BODIES } from '../config.js';
import { sdArena, arenaNormal } from './arena.js';
import { integrateQuat } from './ball.js';

// Car local frame: +X forward, +Y up, +Z right.
export function emptyControls() {
  return { throttle: 0, steer: 0, pitch: 0, yaw: 0, roll: 0, jump: false, boost: false, handbrake: false };
}

function throttleAccel(s) {
  if (s < 14) return 16 - 14.4 * (s / 14);
  if (s < 14.1) return 1.6 * (14.1 - s) / 0.1;
  return 0;
}

const CURVE = [[0, 0.69], [5, 0.398], [10, 0.235], [15, 0.1375], [17.5, 0.11], [23, 0.088]];
function curvature(s) {
  if (s <= 0) return CURVE[0][1];
  for (let i = 1; i < CURVE.length; i++) {
    if (s <= CURVE[i][0]) {
      const [s0, k0] = CURVE[i - 1];
      const [s1, k1] = CURVE[i];
      return k0 + (k1 - k0) * (s - s0) / (s1 - s0);
    }
  }
  return CURVE[CURVE.length - 1][1];
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// Hitbox sample points (corners, edge midpoints, face centres) in [-1, 1]^3.
const SAMPLES = [];
for (const x of [-1, 0, 1]) for (const y of [-1, 0, 1]) for (const z of [-1, 0, 1]) {
  if (x || y || z) SAMPLES.push([x, y, z]);
}

const F = new Vector3();
const U = new Vector3();
const Rt = new Vector3();
const N = new Vector3();
const Fp = new Vector3();
const Rp = new Vector3();
const t1 = new Vector3();
const t2 = new Vector3();
const t3 = new Vector3();
const t4 = new Vector3();
const P = new Vector3();
const CP = new Vector3();
const CN = new Vector3();
const qa = new Quaternion();
const qb = new Quaternion();
const qInv = new Quaternion();
const IDENT = new Quaternion();

let nextId = 0;

export class Car {
  constructor({ team = 0, name = 'Joueur', body = 'octane', isBot = false, colors = null } = {}) {
    this.id = nextId++;
    this.team = team;
    this.name = name;
    this.isBot = isBot;
    this.bodyKey = BODIES[body] ? body : 'octane';
    this.body = BODIES[this.bodyKey];
    this.colors = colors;
    const { hx, hy, hz } = this.body;
    const k = 1.4; // extra inertia keeps tumbling readable
    this.invI = new Vector3(
      12 / (k * (4 * hy * hy + 4 * hz * hz)),
      12 / (k * (4 * hx * hx + 4 * hz * hz)),
      12 / (k * (4 * hx * hx + 4 * hy * hy)),
    );
    this.clearance = hy + PHYS.rideHeight;

    this.pos = new Vector3();
    this.vel = new Vector3();
    this.quat = new Quaternion();
    this.angVel = new Vector3();
    this.prevPos = new Vector3();
    this.prevQuat = new Quaternion();
    this.groundNormal = new Vector3(0, 1, 0);
    this.contactNormal = new Vector3(0, 1, 0);
    this.rightingAxis = new Vector3();
    this.controls = emptyControls();
    this.stats = { score: 0, goals: 0, assists: 0, saves: 0, shots: 0, demos: 0 };
    this.resetState();
  }

  resetState() {
    this.boost = PHYS.startBoost;
    this.onGround = false;
    this.jumping = false;
    this.jumpTime = 0;
    this.jumpLock = 0;
    this.hasJumped = false;
    this.hasDoubleJumped = false;
    this.hasFlipped = false;
    this.airTimeSinceJump = 0;
    this.flipping = false;
    this.flipTime = 0;
    this.flipDir = { x: 0, y: 0 };
    this.prevJump = false;
    this.demolished = false;
    this.respawnTimer = 0;
    this.boosting = false;
    this.supersonic = false;
    this.contactTimer = 1;
    this.groundTime = 0;
    this.airTime = 0;
    this.lastExtraHit = -10;
    this.lastShotTime = -10;
    this.wheelSpin = 0;
    this.steerVis = 0;
    this.justJumped = false;
    this.justDodged = false;
    this.righting = 0;
  }

  placeAt(x, z, dirX, dirZ) {
    this.resetState();
    this.pos.set(x, this.clearance, z);
    this.vel.set(0, 0, 0);
    this.angVel.set(0, 0, 0);
    this.quat.setFromAxisAngle(t1.set(0, 1, 0), Math.atan2(-dirZ, dirX));
    this.prevPos.copy(this.pos);
    this.prevQuat.copy(this.quat);
    this.onGround = true;
    this.groundNormal.set(0, 1, 0);
  }

  forward(out) { return out.set(1, 0, 0).applyQuaternion(this.quat); }
  up(out) { return out.set(0, 1, 0).applyQuaternion(this.quat); }
  right(out) { return out.set(0, 0, 1).applyQuaternion(this.quat); }

  // World-space inverse inertia (per unit mass) applied to v.
  applyInvInertia(v, out) {
    qInv.copy(this.quat).invert();
    out.copy(v).applyQuaternion(qInv);
    out.x *= this.invI.x;
    out.y *= this.invI.y;
    out.z *= this.invI.z;
    return out.applyQuaternion(this.quat);
  }

  demolish() {
    this.demolished = true;
    this.respawnTimer = PHYS.demoRespawnTime;
    this.vel.set(0, 0, 0);
    this.angVel.set(0, 0, 0);
    this.boosting = false;
  }

  canDodge() {
    return !this.hasFlipped && !this.hasDoubleJumped && (!this.hasJumped || this.airTimeSinceJump < PHYS.doubleJumpWindow);
  }

  step(dt) {
    this.prevPos.copy(this.pos);
    this.prevQuat.copy(this.quat);
    this.justJumped = false;
    this.justDodged = false;
    if (this.demolished) return;

    const c = this.controls;
    const jumpPressed = c.jump && !this.prevJump;
    this.prevJump = c.jump;

    this.up(U);
    const dist = -sdArena(this.pos.x, this.pos.y, this.pos.z);
    arenaNormal(this.pos.x, this.pos.y, this.pos.z, N);
    this.jumpLock = Math.max(0, this.jumpLock - dt);
    const grounded = this.jumpLock <= 0 && dist < this.clearance + 0.12 && U.dot(N) > 0.55;

    this.contactTimer += dt;
    if (grounded) {
      if (!this.onGround) {
        this.hasJumped = false;
        this.hasDoubleJumped = false;
        this.hasFlipped = false;
        this.flipping = false;
        this.jumping = false;
        this.righting = 0;
        this.airTimeSinceJump = 0;
      }
      this.onGround = true;
      this.groundTime += dt;
      this.airTime = 0;
      this.groundNormal.copy(N);
      this.driveGround(dt, c, jumpPressed);
    } else {
      this.onGround = false;
      this.groundTime = 0;
      this.airTime += dt;
      this.airControl(dt, c, jumpPressed);
    }

    if (this.jumping) {
      this.jumpTime += dt;
      if (c.jump && this.jumpTime < PHYS.jumpHoldTime) {
        this.up(t1);
        this.vel.addScaledVector(t1, PHYS.jumpHoldAccel * dt);
      } else {
        this.jumping = false;
      }
    }

    this.boosting = false;
    if (c.boost && this.boost > 0) {
      this.boosting = true;
      this.forward(F);
      this.vel.addScaledVector(F, PHYS.boostAccel * dt);
      this.boost = Math.max(0, this.boost - PHYS.boostPerSecond * dt);
    } else if (!this.onGround && c.throttle) {
      this.forward(F);
      this.vel.addScaledVector(F, PHYS.airThrottleAccel * c.throttle * dt);
    }

    this.vel.y += PHYS.gravity * dt;
    const sp = this.vel.length();
    if (sp > PHYS.carMaxSpeed) this.vel.multiplyScalar(PHYS.carMaxSpeed / sp);

    this.pos.addScaledVector(this.vel, dt);
    if (!grounded) integrateQuat(this.quat, this.angVel, dt);

    if (grounded) {
      const d2 = -sdArena(this.pos.x, this.pos.y, this.pos.z);
      arenaNormal(this.pos.x, this.pos.y, this.pos.z, N);
      if (d2 < this.clearance) {
        this.pos.addScaledVector(N, this.clearance - d2);
        const vn = this.vel.dot(N);
        if (vn < 0) this.vel.addScaledVector(N, -vn);
      }
    }

    this.collideArena();

    const speed = this.vel.length();
    this.supersonic = speed >= (this.supersonic ? 21 : PHYS.supersonic);
    this.forward(F);
    this.wheelSpin += this.vel.dot(F) * dt / 0.17;
    this.steerVis += (c.steer - this.steerVis) * Math.min(1, dt * 12);
  }

  driveGround(dt, c, jumpPressed) {
    // Align the chassis with the surface.
    this.up(U);
    const dot = U.dot(N);
    if (dot < 0.99999) {
      qb.setFromUnitVectors(U, N);
      qa.copy(IDENT).slerp(qb, 1 - Math.exp(-dt * 28));
      this.quat.premultiply(qa).normalize();
    }

    this.forward(F);
    Fp.copy(F).addScaledVector(N, -F.dot(N)).normalize();
    Rp.crossVectors(Fp, N);

    let vF = this.vel.dot(Fp);
    const yawRate = -c.steer * curvature(Math.abs(vF)) * vF * (c.handbrake ? 1.3 : 1);
    const ang = yawRate * dt;
    if (ang !== 0) {
      qa.setFromAxisAngle(N, ang);
      this.quat.premultiply(qa).normalize();
      const vn = this.vel.dot(N);
      t1.copy(this.vel).addScaledVector(N, -vn);
      t1.applyAxisAngle(N, ang * (c.handbrake ? 0.25 : 1));
      this.vel.copy(t1).addScaledVector(N, vn);
      Fp.applyAxisAngle(N, ang);
      Rp.applyAxisAngle(N, ang);
    }

    vF = this.vel.dot(Fp);
    const vR = this.vel.dot(Rp);
    const throttle = c.boost && this.boost > 0 ? 1 : c.throttle;
    let a = 0;
    if (Math.abs(throttle) > 0.01) {
      if (vF * throttle >= -0.05) {
        a = throttle * throttleAccel(Math.abs(vF));
      } else {
        a = Math.sign(throttle) * Math.min(PHYS.brakeAccel, Math.abs(vF) / dt);
      }
    } else if (vF !== 0) {
      a = -Math.sign(vF) * Math.min(PHYS.coastAccel, Math.abs(vF) / dt);
    }
    this.vel.addScaledVector(Fp, a * dt);

    const lat = c.handbrake ? 2.2 : 26;
    this.vel.addScaledVector(Rp, vR * Math.exp(-lat * dt) - vR);
    this.vel.addScaledVector(N, -PHYS.stickyAccel * dt);
    this.angVel.copy(N).multiplyScalar(yawRate);

    if (jumpPressed) {
      this.vel.addScaledVector(N, PHYS.jumpImpulse);
      this.jumping = true;
      this.jumpTime = 0;
      this.hasJumped = true;
      this.hasDoubleJumped = false;
      this.hasFlipped = false;
      this.airTimeSinceJump = 0;
      this.jumpLock = 0.1;
      this.onGround = false;
      this.justJumped = true;
    }
  }

  airControl(dt, c, jumpPressed) {
    if (this.hasJumped && !this.jumping) this.airTimeSinceJump += dt;

    if (jumpPressed && !this.jumping) {
      this.up(U);
      if (this.contactTimer < 0.15 && U.dot(this.contactNormal) < 0.55 && this.vel.length() < 6) {
        // Upside down or on the side: self-righting hop.
        this.vel.addScaledVector(this.contactNormal, 3.2);
        t1.crossVectors(U, this.contactNormal);
        if (t1.lengthSq() < 1e-4) this.forward(t1);
        const angle = Math.acos(clamp(U.dot(this.contactNormal), -1, 1));
        this.rightingAxis.copy(t1.normalize()).multiplyScalar(PHYS.maxAngVel);
        this.righting = angle / PHYS.maxAngVel;
        this.angVel.copy(this.rightingAxis);
        this.hasJumped = true;
        this.hasFlipped = true;
        this.justJumped = true;
      } else if (this.canDodge()) {
        const dx = c.pitch;
        const dy = clamp(c.yaw + c.roll, -1, 1);
        if (Math.abs(dx) + Math.abs(dy) >= 0.5) this.dodge(dx, dy);
        else {
          this.vel.addScaledVector(U, PHYS.jumpImpulse);
          this.hasDoubleJumped = true;
          this.justJumped = true;
        }
      }
    }

    qInv.copy(this.quat).invert();
    const w = t2.copy(this.angVel).applyQuaternion(qInv);
    const p = c.pitch;
    const y = c.yaw;
    const r = c.roll;

    if (this.righting > 0) {
      // Self-righting roll keeps its spin until the wheels face the ground again.
      this.righting -= dt;
      this.angVel.copy(this.rightingAxis);
      return;
    }

    if (this.flipping) {
      this.flipTime += dt;
      if (this.flipTime >= PHYS.flipTime + 0.5) this.flipping = false;
    }
    if (this.flipping && this.flipTime < PHYS.flipTime) {
      const cancel = clamp(-p * Math.sign(this.flipDir.x), 0, 1);
      w.x = this.flipDir.y * PHYS.maxAngVel;
      w.z = -this.flipDir.x * PHYS.maxAngVel * (1 - cancel);
      w.y += (-y * PHYS.airYawAccel - PHYS.airYawDamp * w.y * (1 - Math.abs(y))) * dt;
      if (this.flipTime >= 0.15 && (this.vel.y < 0 || this.flipTime < 0.21)) {
        this.vel.y *= Math.pow(0.65, dt * 120);
      }
    } else {
      // Right after a flip the rotation carries on so the car lands on its wheels.
      const damp = this.flipping ? 0 : 1;
      w.x += (r * PHYS.airRollAccel - PHYS.airRollDamp * w.x * damp) * dt;
      w.z += (-p * PHYS.airPitchAccel - PHYS.airPitchDamp * w.z * (1 - Math.abs(p)) * damp) * dt;
      w.y += (-y * PHYS.airYawAccel - PHYS.airYawDamp * w.y * (1 - Math.abs(y))) * dt;
    }
    const wl = w.length();
    if (wl > PHYS.maxAngVel) w.multiplyScalar(PHYS.maxAngVel / wl);
    this.angVel.copy(w).applyQuaternion(this.quat);
  }

  dodge(dx, dy) {
    const len = Math.hypot(dx, dy);
    dx /= len;
    dy /= len;
    this.forward(F);
    t1.set(F.x, 0, F.z);
    if (t1.lengthSq() < 1e-4) this.up(t1).set(-t1.x, 0, -t1.z);
    t1.normalize();
    t3.set(-t1.z, 0, t1.x); // flat right
    const fs = this.vel.dot(t1);
    const ratio = Math.abs(fs) / PHYS.carMaxSpeed;
    const backwards = Math.abs(fs) < 1 ? dx < 0 : (dx >= 0) !== (fs > 0);
    let ix = dx * PHYS.dodgeImpulse;
    let iy = dy * PHYS.dodgeImpulse;
    if (backwards) ix *= (1.5 * ratio + 1) * (16 / 15);
    iy *= 0.9 * ratio + 1;
    this.vel.addScaledVector(t1, ix).addScaledVector(t3, iy);
    this.flipping = true;
    this.flipTime = 0;
    this.flipDir.x = dx;
    this.flipDir.y = dy;
    this.hasFlipped = true;
    this.justDodged = true;
  }

  // Resolves hitbox penetration with the arena walls.
  collideArena() {
    const { hx, hy, hz } = this.body;
    for (let iter = 0; iter < 3; iter++) {
      let maxPen = 0;
      let count = 0;
      for (const s of SAMPLES) {
        P.set(s[0] * hx, s[1] * hy, s[2] * hz).applyQuaternion(this.quat).add(this.pos);
        const pen = sdArena(P.x, P.y, P.z);
        if (pen > 0) {
          count++;
          if (pen > maxPen) {
            maxPen = pen;
            t4.copy(P);
          }
        }
      }
      if (count === 0) break;
      arenaNormal(t4.x, t4.y, t4.z, N);
      this.pos.addScaledVector(N, maxPen);
      this.contactNormal.copy(N);
      this.contactTimer = 0;
      // One impulse at the centroid of the touching points (a cheap contact manifold).
      t4.set(0, 0, 0);
      CN.set(0, 0, 0);
      let k = 0;
      for (const s of SAMPLES) {
        P.set(s[0] * hx, s[1] * hy, s[2] * hz).applyQuaternion(this.quat).add(this.pos);
        if (sdArena(P.x, P.y, P.z) > -0.03) {
          t4.add(P);
          CN.add(arenaNormal(P.x, P.y, P.z, N));
          k++;
        }
      }
      if (k === 0) continue;
      CP.copy(t4).multiplyScalar(1 / k);
      CN.normalize();
      this.contactImpulse(CP, CN, 0.15, 0.55);
    }
    // Let a car lying on its roof or side come to rest instead of wobbling.
    if (this.contactTimer === 0 && !this.onGround && this.vel.lengthSq() < 0.5 && this.angVel.lengthSq() < 0.8) {
      const flat = Math.max(-this.up(t1).dot(this.contactNormal), Math.abs(this.right(t1).dot(this.contactNormal)));
      if (flat > 0.9) {
        this.vel.multiplyScalar(0.85);
        this.angVel.multiplyScalar(0.8);
      }
    }
  }

  contactImpulse(point, n, e, mu) {
    const r = t1.copy(point).sub(this.pos);
    const vp = t2.crossVectors(this.angVel, r).add(this.vel);
    const vn = vp.dot(n);
    if (vn >= 0) return;
    const rn = t3.crossVectors(r, n);
    const ir = this.applyInvInertia(rn, t3);
    const k = 1 + n.dot(t4.crossVectors(ir, r));
    const j = -(1 + (vn < -1.5 ? e : 0)) * vn / k;
    this.vel.addScaledVector(n, j);
    this.angVel.addScaledVector(ir, j);

    vp.crossVectors(this.angVel, r).add(this.vel);
    vp.addScaledVector(n, -vp.dot(n));
    const vt = vp.length();
    if (vt < 1e-5) return;
    const t = vp.multiplyScalar(1 / vt);
    const rt = t3.crossVectors(r, t);
    const irt = this.applyInvInertia(rt, t3);
    const kt = 1 + t.dot(t4.crossVectors(irt, r));
    const jt = Math.min(vt / kt, mu * j);
    this.vel.addScaledVector(t, -jt);
    this.angVel.addScaledVector(irt, -jt);
  }
}
