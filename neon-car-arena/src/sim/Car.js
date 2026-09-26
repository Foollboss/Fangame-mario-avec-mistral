import { Vector3, Quaternion } from 'three';
import { PHYS } from '../config/GameConfig.js';
import { VEHICLES } from '../config/VehicleCatalog.js';

// État complet d'une voiture dans la simulation (aucune donnée de rendu).
export class Car {
  constructor({ id, team, name, vehicleId = 'pulse', isBot = false, loadout = null }) {
    this.id = id;
    this.team = team;
    this.name = name;
    this.isBot = isBot;
    this.loadout = loadout; // cosmétique, transmis au rendu uniquement
    this.setVehicle(vehicleId);

    this.pos = new Vector3();
    this.vel = new Vector3();
    this.quat = new Quaternion();
    this.angVel = new Vector3();

    this.fwd = new Vector3(0, 0, 1);
    this.up = new Vector3(0, 1, 0);
    this.left = new Vector3(1, 0, 0);

    this.wheelCompress = [0, 0, 0, 0];
    this.wheelContact = [false, false, false, false];
    this.surfaceNormal = new Vector3(0, 1, 0);
    this.reset();
  }

  setVehicle(vehicleId) {
    const v = VEHICLES[vehicleId] || VEHICLES.pulse;
    this.vehicleId = v.id;
    this.stats = v.stats;
    this.half = new Vector3(v.half.x, v.half.y, v.half.z);
    this.mass = v.stats.mass;
    this.invMass = 1 / this.mass;
    const w = v.half.x * 2, h = v.half.y * 2, l = v.half.z * 2, m = this.mass * 1.3;
    this.invInertia = new Vector3(12 / (m * (h * h + l * l)), 12 / (m * (w * w + l * l)), 12 / (m * (w * w + h * h)));
    this.wheelMounts = [
      [1, 1], [-1, 1], [1, -1], [-1, -1],
    ].map(([sx, sz]) => new Vector3(sx * (v.half.x - 0.15), -v.half.y + 0.25, sz * (v.half.z - 0.5)));
    this.radius = Math.hypot(v.half.x, v.half.z) * 0.72; // pour les contacts voiture/voiture
  }

  reset() {
    this.vel?.set(0, 0, 0);
    this.angVel?.set(0, 0, 0);
    this.boost = PHYS.BOOST_START;
    this.onGround = false;
    this.wheelCount = 0;
    this.jumped = false;
    this.jumpHoldT = 0;
    this.holdingJump = false;
    this.airTime = 0;
    this.hasDodge = true;
    this.dashing = false;
    this.dashT = 0;
    this.dashAxis = new Vector3();
    this.pendingDashT = -1;
    this.pendingDash = [0, 1];
    this.prevJump = false;
    this.prevDash = false;
    this.boosting = false;
    this.supersonic = false;
    this.hullContact = false;
    this.stuckT = 0;
    this.lastHitT = -10;
    this.throttle = 0;
    this.steer = 0;
    this.landedImpact = 0;
    this.infiniteBoost = false;
    this.jumpGraceT = 0;
    this.airPitch = 0;
    this.airYaw = 0;
    this.airRoll = 0;
  }

  updateBasis() {
    this.fwd.set(0, 0, 1).applyQuaternion(this.quat);
    this.up.set(0, 1, 0).applyQuaternion(this.quat);
    this.left.set(1, 0, 0).applyQuaternion(this.quat);
  }

  // Applique une impulsion J (monde) au point p (monde).
  applyImpulse(J, p) {
    this.vel.addScaledVector(J, this.invMass);
    _r.subVectors(p, this.pos).cross(J);
    this.angVel.add(this.invInertiaWorld(_r, _r));
  }

  invInertiaWorld(v, out) {
    _q.copy(this.quat).invert();
    out.copy(v).applyQuaternion(_q);
    out.x *= this.invInertia.x; out.y *= this.invInertia.y; out.z *= this.invInertia.z;
    return out.applyQuaternion(this.quat);
  }

  // Masse effective au point p selon la normale n (pour les impulsions de collision).
  effectiveInvMass(p, n) {
    _r.subVectors(p, this.pos);
    _t.crossVectors(_r, n);
    this.invInertiaWorld(_t, _t);
    _t.cross(_r);
    return this.invMass + _t.dot(n);
  }

  pointVelocity(p, out) {
    _r.subVectors(p, this.pos);
    return out.crossVectors(this.angVel, _r).add(this.vel);
  }
}

const _r = new Vector3(), _t = new Vector3(), _q = new Quaternion();
