import { ARENA } from '../config/GameConfig.js';

export const DRILLS = {
  free: { id: 'free', label: 'Terrain libre', desc: 'Balle au centre, boost illimité. Entraînez-vous librement.' },
  shots: { id: 'shots', label: 'Tirs', desc: 'La balle arrive vers vous : marquez dans le but orange.' },
  aerials: { id: 'aerials', label: 'Aériens', desc: 'La balle tombe du ciel : sautez, boostez et frappez-la en l\'air.' },
  dribble: { id: 'dribble', label: 'Dribbles', desc: 'La balle est posée sur votre toit : gardez-la et amenez-la au but.' },
  saves: { id: 'saves', label: 'Arrêts', desc: 'Des tirs arrivent sur votre but : empêchez la balle d\'entrer.' },
};

// Exercices d'entraînement : placement, chronométrage et comptage des réussites.
export class TrainingDrills {
  constructor(match) {
    this.match = match;
    this.id = match.opts.drill || 'free';
    this.attempts = 0;
    this.success = 0;
    this.timer = 0;
  }

  get label() { return DRILLS[this.id].label; }

  reset() {
    const { sim } = this.match;
    const car = sim.cars[0];
    const ball = sim.ball;
    const r = sim.rng;
    ball.reset();
    sim.ballFrozen = false;
    sim.ballActive = true;
    this.timer = 0;
    this.resolved = false;
    switch (this.id) {
      case 'shots': {
        sim.placeCar(car, r.range(-20, 20), -25, 0, 30);
        const bx = r.range(-35, 35), bz = r.range(15, 45);
        ball.pos.set(bx, ball.radius + r.range(0, 6), bz);
        ball.vel.set((car.pos.x - bx) * r.range(0.2, 0.5), r.range(0, 8), r.range(-18, -8));
        break;
      }
      case 'aerials': {
        sim.placeCar(car, r.range(-15, 15), -10, 0, 60);
        ball.pos.set(r.range(-25, 25), r.range(22, 30), r.range(35, 60));
        ball.vel.set(r.range(-4, 4), r.range(0, 4), r.range(-6, 2));
        break;
      }
      case 'dribble': {
        sim.placeCar(car, 0, -60, 0, 0);
        ball.pos.set(car.pos.x, car.pos.y + car.half.y + ball.radius + 0.2, car.pos.z);
        break;
      }
      case 'saves': {
        sim.placeCar(car, 0, -ARENA.L + 8, 0, 0);
        const bx = r.range(-40, 40), bz = r.range(-10, 10);
        ball.pos.set(bx, ball.radius + r.range(0, 8), bz);
        const tx = r.range(-ARENA.GOAL_W + 4, ARENA.GOAL_W - 4), ty = r.range(2, ARENA.GOAL_H - 4);
        const t = r.range(1.6, 2.4);
        ball.vel.set((tx - bx) / t, (ty - ball.pos.y) / t + 9.75 * t, (-ARENA.L - 3 - bz) / t);
        break;
      }
      default:
        sim.placeCar(car, 0, -40, 0, 0);
        ball.pos.set(0, ball.radius, 0);
    }
    car.infiniteBoost = true;
    car.boost = 100;
    if (this.id !== 'free') this.attempts++;
    this.match.events.emit('drill', this.state());
  }

  tick(dt) {
    this.timer += dt;
    const limit = { shots: 8, aerials: 7, dribble: 25, saves: 4.2 }[this.id];
    if (!limit || this.resolved) return;
    if (this.id === 'saves' && this.timer > limit) {
      this.success++;
      this.resolved = true;
      this.match.events.emit('drillResult', { ok: true, text: 'ARRÊT !' });
      this.match.startKickoff();
    } else if (this.timer > limit) {
      this.resolved = true;
      this.match.events.emit('drillResult', { ok: false, text: 'Raté – nouvel essai' });
      this.match.startKickoff();
    }
  }

  onGoal(team) {
    this.resolved = true;
    const scored = team === 0; // but adverse (en +Z)
    if (this.id === 'saves') this.match.events.emit('drillResult', { ok: false, text: 'But encaissé' });
    else if (scored) { if (this.id !== 'free') this.success++; this.match.events.emit('drillResult', { ok: true, text: 'BUT !' }); }
    else this.match.events.emit('drillResult', { ok: false, text: 'Contre son camp' });
  }

  state() { return { id: this.id, label: this.label, attempts: this.attempts, success: this.success }; }
}
