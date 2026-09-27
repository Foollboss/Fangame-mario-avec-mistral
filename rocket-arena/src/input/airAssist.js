import { Vector3 } from 'three';
import { orient } from '../ai/bot.js';

const UP = new Vector3(0, 1, 0);
const F = new Vector3();
const want = new Vector3();
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

// Arcade "assisted flight": in the air the stick points the nose (up = climb, sides = turn)
// and the car holds that heading by itself, so flying with boost is easy on a phone or a keyboard.
export class AirAssist {
  constructor() {
    this.active = false;
    this.yaw = 0;
    this.pitch = 0;
  }

  apply(car, c, dt) {
    const busy = car.onGround || car.demolished || car.flipping || car.righting > 0 || car.jumping || car.airTime < 0.08;
    if (busy) {
      this.active = false;
      return false;
    }
    car.forward(F);
    if (!this.active) {
      this.active = true;
      this.yaw = Math.atan2(-F.z, F.x);
      this.pitch = Math.asin(clamp(F.y, -1, 1));
    }
    // Keep the raw stick for dodges (double jump + direction still flips the car).
    c.dodgeX = c.pitch;
    c.dodgeY = clamp(c.yaw + c.roll, -1, 1);
    const sx = c.steer;
    const sy = c.up || 0;
    this.yaw -= sx * 2.3 * dt;
    this.pitch = clamp(this.pitch + sy * 1.7 * dt, -1.45, 1.45);
    // Hands off the stick while falling near the floor: level the car to land on its wheels.
    if (Math.abs(sx) + Math.abs(sy) < 0.1 && car.vel.y < -1 && car.pos.y < 4 && !c.boost) {
      this.pitch += (0 - this.pitch) * Math.min(1, dt * 4);
    }
    const cp = Math.cos(this.pitch);
    want.set(cp * Math.cos(this.yaw), Math.sin(this.pitch), -cp * Math.sin(this.yaw));
    const manualRoll = c.roll;
    orient(car, c, want, UP);
    if (Math.abs(manualRoll) > 0.2) c.roll = manualRoll;
    return true;
  }
}
