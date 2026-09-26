import { CAR } from '../core/Config.js';

// Input frame for one car. Held states only: edges are derived here, so a network layer can
// transmit this struct as-is every tick.
export function createControllerState() {
  return { steer: 0, pitch: 0, throttle: 0, jump: false, boost: false, dash: false, dodgeX: 0, dodgeY: 0 };
}

export const EMPTY_INPUT = Object.freeze(createControllerState());

// Turns an input frame into physics actions: jump / double jump / dash state machine, boost usage.
export class VehicleController {
  constructor(car, events) {
    this.car = car;
    this.events = events;
    this.prevJump = false;
    this.prevDash = false;
    this.holdTimer = 0;
    this.airTime = 0;
    this.hasSecond = true;
    this.boosting = false;
    this.ctl = { throttle: 0, steer: 0, pitch: 0, boosting: false, jumpHold: false };
  }

  reset() {
    this.prevJump = this.prevDash = false;
    this.holdTimer = 0;
    this.airTime = 0;
    this.hasSecond = true;
    this.boosting = false;
  }

  update(dt, input, infiniteBoost) {
    const car = this.car;
    const p = car.physics;
    const st = p.stats;
    const jumpPressed = input.jump && !this.prevJump;
    const dashPressed = input.dash && !this.prevDash;
    this.prevJump = input.jump;
    this.prevDash = input.dash;

    if (p.grounded) {
      this.hasSecond = true;
      this.airTime = 0;
    } else {
      this.airTime += dt;
    }

    if (jumpPressed) {
      if (p.grounded) {
        p.jump(CAR.jumpImpulse * st.jump);
        this.holdTimer = CAR.jumpHoldTime;
        this.airTime = 0;
        this.hasSecond = true;
        this.events.emit('jump', { car });
      } else if (this.hasSecond && this.airTime < CAR.secondJumpWindow && !p.flip) {
        p.jump(CAR.doubleJumpImpulse * st.jump);
        this.hasSecond = false;
        this.holdTimer = 0;
        this.events.emit('jump', { car, double: true });
      }
    }
    if (dashPressed && !p.flip) {
      if (p.grounded || (this.hasSecond && this.airTime < CAR.secondJumpWindow)) {
        p.dodge(input.dodgeX, input.dodgeY, CAR.dodgeImpulse);
        this.hasSecond = false;
        this.holdTimer = 0;
        this.airTime = Math.max(this.airTime, 0.01);
        this.events.emit('dodge', { car });
      }
    }

    let jumpHold = false;
    if (this.holdTimer > 0) {
      if (input.jump) jumpHold = true;
      else this.holdTimer = 0;
      this.holdTimer -= dt;
    }

    const wantsBoost = input.boost && (infiniteBoost || car.boost > 0);
    if (wantsBoost && !infiniteBoost) car.boost = Math.max(0, car.boost - CAR.boostPerSecond * dt);
    this.boosting = wantsBoost;

    const c = this.ctl;
    c.throttle = input.throttle;
    c.steer = input.steer;
    c.pitch = input.pitch;
    c.boosting = wantsBoost;
    c.jumpHold = jumpHold;
    return c;
  }
}
