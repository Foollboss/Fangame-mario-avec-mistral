import { ARENA, BALL, MATCH } from '../core/Config.js';
import { EventBus } from '../core/EventBus.js';
import { createRng } from '../core/MathUtil.js';
import { ArenaCollision } from '../physics/ArenaCollision.js';
import { collideCarBall, collideCars } from '../physics/CollisionSystem.js';
import { BallController } from './BallController.js';
import { BoostSystem } from './BoostSystem.js';
import { Car } from './Car.js';
import { EMPTY_INPUT } from './VehicleController.js';

// Kickoff spots for team 0 (defending -Z). Team 1 uses the point-mirrored spots.
const SPOTS = {
  diagL: [-26, -34], diagR: [26, -34],
  offL: [-6, -52], offR: [6, -52],
  back: [0, -64],
};
const LAYOUTS = {
  1: [['diagL'], ['diagR'], ['offL'], ['offR'], ['back']],
  2: [['diagL', 'back'], ['diagR', 'back'], ['diagL', 'offR'], ['diagR', 'offL']],
  3: [['diagL', 'diagR', 'back'], ['diagL', 'offR', 'back'], ['diagR', 'offL', 'back'], ['diagL', 'diagR', 'offL']],
  4: [['diagL', 'diagR', 'offL', 'back'], ['diagL', 'diagR', 'offR', 'back']],
};

// Pure simulation: no rendering, no DOM. Can run headless (tests, a future authoritative server).
export class World {
  constructor({ infiniteBoost = false, seed = Date.now() } = {}) {
    this.events = new EventBus();
    this.arena = new ArenaCollision(ARENA);
    this.ball = new BallController(this.arena);
    this.boost = new BoostSystem(this.events);
    this.cars = [];
    this.infiniteBoost = infiniteBoost;
    this.rng = createRng(seed);
    this.time = 0;
    this.tick = 0;
    this.carsFrozen = false;
    this.lastTouch = null;
    this.touchHistory = [];
    this.events.on('ballTouch', (e) => this.recordTouch(e.car));
    this.events.on('demolish', (e) => this.demolish(e.victim, e.attacker));
  }

  addCar(opts) {
    const car = new Car({ ...opts, id: this.cars.length, events: this.events });
    this.cars.push(car);
    return car;
  }

  teamCars(team) {
    return this.cars.filter((c) => c.team === team);
  }

  recordTouch(car) {
    this.lastTouch = { car, time: this.time };
    const h = this.touchHistory;
    if (h.length && h[h.length - 1].car === car) h[h.length - 1].time = this.time;
    else h.push({ car, time: this.time });
    if (h.length > 8) h.shift();
  }

  demolish(victim, attacker) {
    if (victim.demolished) return;
    victim.demolished = true;
    victim.respawnTimer = MATCH.respawnTime;
    victim.physics.vel.set(0, 0, 0);
    attacker.stats.demos++;
  }

  respawn(car) {
    const sgn = car.team === 0 ? -1 : 1;
    const x = (this.rng() - 0.5) * 30;
    car.physics.place(x, sgn * (ARENA.halfLength - 10), car.team === 0 ? 0 : Math.PI);
    car.controller.reset();
    car.boost = 33;
    car.demolished = false;
  }

  resetKickoff() {
    this.ball.reset(0, BALL.radius, 0);
    this.boost.reset();
    this.lastTouch = null;
    this.touchHistory.length = 0;
    for (const team of [0, 1]) {
      const cars = this.teamCars(team);
      if (!cars.length) continue;
      const opts = LAYOUTS[Math.min(4, cars.length)] || LAYOUTS[4];
      // Same layout for both teams (mirrored), chosen once per kickoff.
      if (team === 0) this._layout = opts[Math.floor(this.rng() * opts.length)];
      const layout = this._layout || opts[0];
      const order = cars.slice().sort(() => this.rng() - 0.5);
      order.forEach((car, i) => {
        let [x, z] = SPOTS[layout[i % layout.length]] || [(i - 2) * 10, -60];
        if (i >= layout.length) z -= 6;
        if (team === 1) { x = -x; z = -z; }
        car.physics.place(x, z, Math.atan2(-x, -z));
        car.controller.reset();
        car.boost = 33;
        car.demolished = false;
        car.touchCooldown = 0;
      });
    }
  }

  step(dt, inputs) {
    this.time += dt;
    this.tick++;
    const cars = this.cars;
    for (const car of cars) {
      if (car.demolished) {
        car.respawnTimer -= dt;
        if (car.respawnTimer <= 0) this.respawn(car);
        continue;
      }
      const input = this.carsFrozen ? EMPTY_INPUT : inputs[car.id] || EMPTY_INPUT;
      const ctl = car.controller.update(dt, input, this.infiniteBoost);
      car.physics.step(dt, ctl, this.arena);
      car.touchCooldown -= dt;
      if (car.physics.wallHit > 14) this.events.emit('carWall', { car, strength: car.physics.wallHit });
      if (car.physics.landImpact > 8) this.events.emit('carLand', { car, strength: car.physics.landImpact });
    }
    this.ball.step(dt);
    for (const car of cars) collideCarBall(car, this.ball, this.events);
    for (let i = 0; i < cars.length; i++) {
      for (let j = i + 1; j < cars.length; j++) collideCars(cars[i], cars[j], this.events);
    }
    this.boost.update(dt, cars);
    if (this.ball.lastImpact > 5) this.events.emit('ballBounce', { strength: this.ball.lastImpact, pos: this.ball.pos });
  }

  // Compact state snapshot (used by replays; the same format suits network sync).
  serialize(out) {
    const n = 11 + this.cars.length * 12;
    const a = out && out.length === n ? out : new Float32Array(n);
    const b = this.ball;
    a[0] = b.pos.x; a[1] = b.pos.y; a[2] = b.pos.z;
    a[3] = b.vel.x; a[4] = b.vel.y; a[5] = b.vel.z;
    a[6] = b.quat.x; a[7] = b.quat.y; a[8] = b.quat.z; a[9] = b.quat.w;
    a[10] = b.hidden ? 1 : 0;
    let k = 11;
    for (const car of this.cars) {
      const p = car.physics;
      a[k++] = p.pos.x; a[k++] = p.pos.y; a[k++] = p.pos.z;
      a[k++] = p.vel.x; a[k++] = p.vel.y; a[k++] = p.vel.z;
      a[k++] = p.quat.x; a[k++] = p.quat.y; a[k++] = p.quat.z; a[k++] = p.quat.w;
      a[k++] = car.boost;
      a[k++] = (p.grounded ? 1 : 0) | (car.demolished ? 2 : 0) | (car.boosting ? 4 : 0);
    }
    return a;
  }

  applySnapshot(a) {
    const b = this.ball;
    b.pos.set(a[0], a[1], a[2]);
    b.vel.set(a[3], a[4], a[5]);
    b.quat.set(a[6], a[7], a[8], a[9]);
    b.hidden = a[10] > 0;
    let k = 11;
    for (const car of this.cars) {
      const p = car.physics;
      p.pos.set(a[k], a[k + 1], a[k + 2]);
      p.vel.set(a[k + 3], a[k + 4], a[k + 5]);
      p.quat.set(a[k + 6], a[k + 7], a[k + 8], a[k + 9]);
      car.boost = a[k + 10];
      const f = a[k + 11];
      p.grounded = (f & 1) !== 0;
      car.demolished = (f & 2) !== 0;
      car.controller.boosting = (f & 4) !== 0;
      k += 12;
    }
  }
}
