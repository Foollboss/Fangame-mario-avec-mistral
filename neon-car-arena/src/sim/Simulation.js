import { Vector3 } from 'three';
import { ARENA, PHYS } from '../config/GameConfig.js';
import { ArenaGeometry } from '../physics/ArenaGeometry.js';
import { Ball, BallPhysics } from '../physics/BallPhysics.js';
import { VehiclePhysics } from '../physics/VehiclePhysics.js';
import { Collisions } from '../physics/Collisions.js';
import { VehicleController } from '../controllers/VehicleController.js';
import { BoostSystem } from './BoostSystem.js';
import { InputFrame } from './InputFrame.js';
import { EventBus } from '../core/EventBus.js';
import { Random } from '../core/Random.js';

const UP = new Vector3(0, 1, 0);
const NO_INPUT = new InputFrame();

// Monde physique pur : voitures, balle, capsules. Pas de rendu, pas de DOM.
// Avancé à pas fixe par step(dt, inputs) → réutilisable par un serveur de jeu.
export class Simulation {
  constructor(seed = 1) {
    this.rng = new Random(seed);
    this.arena = new ArenaGeometry(ARENA);
    this.ball = new Ball();
    this.cars = [];
    this.pads = BoostSystem.createPads();
    this.events = new EventBus();
    this.time = 0;
    this.carsFrozen = false;
    this.ballFrozen = false;
    this.ballActive = true;
    this._onBounce = (speed, pos) => this.events.emit('ballBounce', { speed, pos });
  }

  addCar(car) { this.cars.push(car); return car; }

  restHeight(car) {
    const k = car.mass * (2 * Math.PI * PHYS.SUSP_FREQ) ** 2;
    return PHYS.SUSP_REST - PHYS.GRAVITY * car.mass / k + car.half.y - 0.25;
  }

  placeCar(car, x, z, lookX = 0, lookZ = 0, y = null) {
    car.reset();
    car.pos.set(x, y ?? this.restHeight(car), z);
    car.quat.setFromAxisAngle(UP, Math.atan2(lookX - x, lookZ - z));
    car.updateBasis();
    car.onGround = true;
  }

  step(dt, inputs) {
    const { cars, ball, arena, events } = this;
    for (let i = 0; i < cars.length; i++) {
      const car = cars[i];
      if (this.carsFrozen) continue;
      VehicleController.apply(car, inputs[i] || NO_INPUT, dt, events);
      VehiclePhysics.step(car, dt, arena);
      if (car.landedImpact > 8) events.emit('carLand', { car, speed: car.landedImpact });
      car.landedImpact = 0;
    }

    if (!this.ballFrozen) BallPhysics.step(ball, dt, arena, this._onBounce);

    if (this.ballActive) {
      for (const car of cars) {
        const s = Collisions.carBall(car, ball, this.time);
        if (s > 0) {
          if (this.ballFrozen) this.ballFrozen = false;
          if (ball.lastTouch !== car.id) {
            ball.prevTouch = ball.lastTouch;
            ball.prevTouchTeam = ball.lastTouchTeam;
            ball.prevTouchTime = ball.lastTouchTime;
          }
          ball.lastTouch = car.id;
          ball.lastTouchTeam = car.team;
          ball.lastTouchTime = this.time;
          events.emit('ballTouch', { car, strength: s });
        }
      }
    }

    for (let i = 0; i < cars.length; i++) {
      for (let j = i + 1; j < cars.length; j++) {
        const s = Collisions.carCar(cars[i], cars[j]);
        if (s > 6) events.emit('carBump', { a: cars[i], b: cars[j], strength: s });
      }
    }

    BoostSystem.update(this.pads, cars, dt, events);
    this.time += dt;
  }

  // Filet de sécurité : ne devrait jamais arriver, mais évite qu'un objet reste bloqué hors de l'arène.
  sanitize() {
    const fix = (o, h) => {
      if (!Number.isFinite(o.pos.x + o.pos.y + o.pos.z) || this.arena.distanceV(o.pos) < -4) {
        o.pos.set(0, h, 0); o.vel.set(0, 0, 0); o.angVel.set(0, 0, 0);
        return true;
      }
      return false;
    };
    let bad = fix(this.ball, 10);
    for (const c of this.cars) {
      if (fix(c, 3)) { c.quat.identity(); bad = true; }
    }
    return bad;
  }
}
