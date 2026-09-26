import { Vector3 } from 'three';
import { PHYS } from '../config/GameConfig.js';

const UP = new Vector3(0, 1, 0);
const _fh = new Vector3(), _rh = new Vector3(), _d = new Vector3();

// Traduit une InputFrame en actions : accélération, saut, double saut, dash, boost.
export const VehicleController = {
  apply(car, input, dt, events) {
    car.throttle = input.throttle;
    car.steer = input.steer;
    car.airYaw = input.steer;
    car.airPitch = input.pitch;
    car.airRoll = input.roll;

    const jumpPressed = input.jump && !car.prevJump;
    const dashPressed = input.dash && !car.prevDash;
    car.prevJump = input.jump;
    car.prevDash = input.dash;
    const jumpMul = car.stats.jump;

    if (jumpPressed) {
      if (car.onGround) this.jump(car, events);
      else if (car.hasDodge && !car.dashing) {
        car.vel.addScaledVector(car.up, PHYS.DOUBLE_JUMP_IMPULSE * jumpMul);
        car.hasDodge = false;
        events?.emit('carJump', { car, double: true });
      }
    }
    // Maintien du saut : saut plus haut
    if (car.holdingJump) {
      if (input.jump && car.jumpHoldT < PHYS.JUMP_HOLD_TIME) {
        car.jumpHoldT += dt;
        car.vel.addScaledVector(car.up, PHYS.JUMP_HOLD_ACCEL * jumpMul * dt);
      } else car.holdingJump = false;
    }

    if (dashPressed) {
      if (car.onGround) {
        // Dash depuis le sol : petit saut puis dash automatique.
        this.jump(car, events);
        car.holdingJump = false;
        car.pendingDashT = PHYS.GROUND_DASH_DELAY;
        car.pendingDash = [input.steer, input.pitch];
      } else if (car.hasDodge && !car.dashing) {
        this.dash(car, input.steer, input.pitch, events);
      }
    }
    if (car.pendingDashT >= 0) {
      car.pendingDashT -= dt;
      if (car.pendingDashT < 0 && !car.onGround && car.hasDodge) this.dash(car, car.pendingDash[0], car.pendingDash[1], events);
    }

    const wantBoost = input.boost && (car.boost > 0 || car.infiniteBoost);
    car.boosting = wantBoost;
    if (wantBoost && !car.infiniteBoost) car.boost = Math.max(0, car.boost - PHYS.BOOST_CONSUMPTION * dt);
  },

  jump(car, events) {
    car.vel.addScaledVector(car.up, PHYS.JUMP_IMPULSE * car.stats.jump);
    car.onGround = false;
    car.jumped = true;
    car.holdingJump = true;
    car.jumpHoldT = 0;
    car.jumpGraceT = 0.1;
    car.airTime = 0;
    car.hasDodge = true;
    events?.emit('carJump', { car, double: false });
  },

  dash(car, sx, sy, events) {
    _fh.set(car.fwd.x, 0, car.fwd.z);
    if (_fh.lengthSq() < 0.04) _fh.set(car.vel.x, 0, car.vel.z);
    if (_fh.lengthSq() < 0.01) _fh.set(0, 0, 1);
    _fh.normalize();
    _rh.crossVectors(_fh, UP);
    if (Math.hypot(sx, sy) < 0.3) { sx = 0; sy = 1; }
    _d.copy(_fh).multiplyScalar(sy).addScaledVector(_rh, sx).normalize();
    const back = sy < -0.5 ? 1.07 : 1;
    car.vel.addScaledVector(_d, PHYS.DASH_IMPULSE * back);
    car.vel.y = car.vel.y > 0 ? car.vel.y * 0.35 : 0;
    car.dashAxis.crossVectors(UP, _d).normalize();
    car.dashing = true;
    car.dashT = 0;
    car.hasDodge = false;
    car.holdingJump = false;
    events?.emit('carDash', { car });
  },
};
