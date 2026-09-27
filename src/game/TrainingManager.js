import { BALL, CAR } from '../core/Config.js';
import { GoalManager } from './GoalManager.js';

export const DRILLS = {
  free: { label: 'Terrain libre', desc: 'Boost infini : roulez sur les murs et le plafond, volez avec le boost. « Balle » replace la balle devant vous.' },
  shots: { label: 'Tirs', desc: 'Des balles apparaissent dans le camp adverse : marquez le plus possible.' },
  aerial: { label: 'Aériens', desc: 'La balle est lancée en l’air : touchez-la avant qu’elle ne retombe.' },
  dribble: { label: 'Dribble', desc: 'La balle démarre sur votre toit : gardez-la le plus longtemps possible.' },
  juggle: { label: 'Contrôle de balle', desc: 'Enchaînez les touches sans que la balle touche le sol.' },
};

// Practice drills on a real World (same physics as matches), without timer or opponents.
export class TrainingManager {
  constructor(world, drill = 'free') {
    this.world = world;
    this.drill = drill;
    this.events = world.events;
    this.goals = new GoalManager();
    this.state = 'playing';
    this.timeScale = 1;
    this.car = world.cars[0];
    this.attempts = 0;
    this.success = 0;
    this.streak = 0;
    this.best = 0;
    this.value = 0;
    this.attemptTime = 0;
    this.touchedThisAttempt = false;
    this.cooldown = 0;
    this.unsub = [
      this.events.on('ballTouch', (e) => this.onTouch(e)),
    ];
  }

  get simRunning() {
    return true;
  }

  dispose() {
    this.unsub.forEach((u) => u());
  }

  start() {
    this.world.resetKickoff();
    this.car.physics.place(0, -30, 0);
    this.world.carsFrozen = false;
    this.world.ball.frozen = false;
    this.nextAttempt(true);
  }

  update() {}

  onTouch(e) {
    if (e.car !== this.car) return;
    this.touchedThisAttempt = true;
    const b = this.world.ball;
    if (this.drill === 'aerial' && !this.car.physics.grounded && b.pos.y > 8 && this.cooldown <= 0) {
      this.success++;
      this.cooldown = 0.6;
      this.events.emit('trainingEvent', { text: 'AÉRIEN RÉUSSI !' });
    }
    if (this.drill === 'juggle' && e.hit) {
      this.streak++;
      this.best = Math.max(this.best, this.streak);
    }
  }

  // Places ball (and car when needed) for the next attempt.
  nextAttempt(first = false) {
    const w = this.world;
    const b = w.ball;
    const p = this.car.physics;
    const r = () => Math.random();
    if (!first) this.attempts++;
    this.attemptTime = 0;
    this.touchedThisAttempt = false;
    b.hidden = false;
    b.frozen = false;
    switch (this.drill) {
      case 'shots': {
        const x = (r() - 0.5) * 50;
        const z = 20 + r() * 25;
        b.reset(x, BALL.radius, z);
        b.vel.set((r() - 0.5) * 8, r() < 0.4 ? 10 + r() * 8 : 0, -(4 + r() * 8));
        p.place(x * 0.4 + (r() - 0.5) * 20, z - 38 - r() * 10, 0);
        break;
      }
      case 'aerial': {
        const x = (r() - 0.5) * 40;
        b.reset(x, BALL.radius, 10);
        b.vel.set((r() - 0.5) * 6, 27 + r() * 7, -(3 + r() * 5));
        p.place(x + (r() - 0.5) * 10, -22, 0);
        this.car.boost = 100;
        break;
      }
      case 'dribble': {
        p.place(0, -20, 0);
        b.reset(0, CAR.rideHeight + CAR.halfExtents.y + BALL.radius + 0.05, -20.3);
        this.value = 0;
        break;
      }
      case 'juggle': {
        p.place(0, -12, 0);
        b.reset(0, 14, 0);
        this.streak = 0;
        break;
      }
      default: {
        const f = p.forward();
        b.reset(p.pos.x + f.x * 18, BALL.radius + 6, p.pos.z + f.z * 18);
        b.pos.x = Math.max(-40, Math.min(40, b.pos.x));
        b.pos.z = Math.max(-60, Math.min(60, b.pos.z));
      }
    }
    if (first) this.attempts = 0;
    this.events.emit('trainingReset', { drill: this.drill });
  }

  simStep(dt) {
    const w = this.world;
    const b = w.ball;
    this.attemptTime += dt;
    this.cooldown -= dt;
    const scored = this.goals.check(b);
    if (scored >= 0) {
      if (scored === 0) {
        this.success++;
        this.events.emit('trainingGoal', { pos: b.pos.clone(), team: 0 });
      } else {
        this.events.emit('trainingEvent', { text: 'Contre votre camp !' });
      }
      this.nextAttempt();
      return;
    }
    switch (this.drill) {
      case 'shots':
        if (this.attemptTime > 9 || (this.touchedThisAttempt && this.attemptTime > 3 && b.vel.z < -2)) this.nextAttempt();
        break;
      case 'aerial':
        if (b.onFloor && this.attemptTime > 0.8) this.nextAttempt();
        break;
      case 'dribble': {
        const p = this.car.physics;
        const dx = b.pos.x - p.pos.x, dz = b.pos.z - p.pos.z;
        const onRoof = Math.hypot(dx, dz) < 4 && b.pos.y > p.pos.y + 1.5 && b.pos.y < p.pos.y + 7;
        if (onRoof) {
          this.value += dt;
          this.best = Math.max(this.best, this.value);
        } else if (b.onFloor) {
          if (this.value > 0.5) this.events.emit('trainingEvent', { text: `Dribble : ${this.value.toFixed(1)} s` });
          this.nextAttempt();
        }
        break;
      }
      case 'juggle':
        if (b.onFloor && this.attemptTime > 0.5) {
          if (this.streak > 0) this.events.emit('trainingEvent', { text: `Série : ${this.streak}` });
          this.nextAttempt();
        }
        break;
      default:
        break;
    }
  }

  hud() {
    switch (this.drill) {
      case 'shots': return `Buts ${this.success} / ${this.attempts + 1}`;
      case 'aerial': return `Aériens ${this.success} / ${this.attempts + 1}`;
      case 'dribble': return `Dribble ${this.value.toFixed(1)} s · record ${this.best.toFixed(1)} s`;
      case 'juggle': return `Série ${this.streak} · record ${this.best}`;
      default: return `Buts ${this.success}`;
    }
  }
}
