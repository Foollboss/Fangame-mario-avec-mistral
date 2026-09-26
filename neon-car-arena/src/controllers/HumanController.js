import { Vector3 } from 'three';
import { InputFrame } from '../sim/InputFrame.js';
import { orientInAir } from './Steering.js';

const UP = new Vector3(0, 1, 0);
const _f = new Vector3();

// Joueur local : reprend l'InputFrame du périphérique et ajoute l'aide à l'atterrissage (optionnelle).
export class HumanController {
  constructor(inputManager, settings) {
    this.input = inputManager;
    this.settings = settings;
    this.latest = new InputFrame();
    this.out = new InputFrame();
  }

  // Appelé une fois par image (hors tick) pour lire les périphériques.
  sample() { this.latest.copy(this.input.poll()); }

  update(dt, ctx, car) {
    const f = this.out.copy(this.latest);
    if (this.settings.landingAssist && !car.onGround && !car.dashing && car.airTime > 0.35 && !f.boost
      && Math.abs(f.pitch) < 0.15 && Math.abs(f.steer) < 0.15 && f.roll === 0 && car.vel.y < 2) {
      _f.set(car.vel.x, 0, car.vel.z);
      if (_f.lengthSq() < 4) _f.set(car.fwd.x, 0, car.fwd.z);
      if (_f.lengthSq() > 0.01) {
        orientInAir(car, _f.normalize(), UP, f, 1.6, 0.5, 1);
        f.throttle = this.latest.throttle;
      }
    }
    return f;
  }
}
