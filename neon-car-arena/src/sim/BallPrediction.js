import { Ball, BallPhysics } from '../physics/BallPhysics.js';
import { ARENA } from '../config/GameConfig.js';

// Trajectoire future de la balle (sans voitures), partagée par tous les bots.
export class BallPrediction {
  constructor(horizon = 4, step = 1 / 60) {
    this.horizon = horizon;
    this.dt = step;
    this.count = Math.ceil(horizon / step);
    this.pos = new Float32Array(this.count * 3);
    this.vel = new Float32Array(this.count * 3);
    this.ghost = new Ball();
    this.goalTime = -1;   // instant prévu d'entrée dans un but
    this.goalSide = 0;    // +1 but en +Z, -1 but en -Z
    this.age = 0;
  }

  update(ball, arena) {
    const g = this.ghost;
    g.pos.copy(ball.pos); g.vel.copy(ball.vel); g.angVel.copy(ball.angVel);
    this.goalTime = -1; this.goalSide = 0;
    for (let i = 0; i < this.count; i++) {
      BallPhysics.step(g, this.dt, arena, null, false);
      this.pos[i * 3] = g.pos.x; this.pos[i * 3 + 1] = g.pos.y; this.pos[i * 3 + 2] = g.pos.z;
      this.vel[i * 3] = g.vel.x; this.vel[i * 3 + 1] = g.vel.y; this.vel[i * 3 + 2] = g.vel.z;
      if (this.goalSide === 0) {
        const side = arena.goalSide(g.pos, g.radius);
        if (side !== 0) { this.goalSide = side; this.goalTime = (i + 1) * this.dt; }
      }
    }
    this.age = 0;
  }

  // Position prévue à l'instant t (secondes) → out {x,y,z}
  at(t, out) {
    let i = Math.round(t / this.dt) - 1;
    i = i < 0 ? 0 : i >= this.count ? this.count - 1 : i;
    out.x = this.pos[i * 3]; out.y = this.pos[i * 3 + 1]; out.z = this.pos[i * 3 + 2];
    return out;
  }
}

// Prédiction rapide (utilisée pour tirs / arrêts) : renvoie le côté du but atteint dans l'horizon, ou 0.
const quick = new Ball();
export function predictGoalSide(ball, arena, horizon = 2.5) {
  quick.pos.copy(ball.pos); quick.vel.copy(ball.vel); quick.angVel.copy(ball.angVel);
  const dt = 1 / 40;
  for (let t = 0; t < horizon; t += dt) {
    BallPhysics.step(quick, dt, arena, null, false);
    const s = arena.goalSide(quick.pos, quick.radius);
    if (s) return s;
    if (Math.abs(quick.pos.z) < ARENA.L - 45 && Math.abs(quick.vel.z) < 5) return 0;
  }
  return 0;
}
