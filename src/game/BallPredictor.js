import { Vector3 } from 'three';
import { ARENA, BALL } from '../core/Config.js';
import { stepBallState } from './BallController.js';

// Simulates the ball forward (ignoring cars). Used by bots (interception, danger) and by the
// score system (shots / saves). Samples every `sampleDt`, integrates at twice that rate.
export class BallPredictor {
  constructor(arena, seconds = 4, sampleDt = 1 / 30) {
    this.arena = arena;
    this.sampleDt = sampleDt;
    this.count = Math.round(seconds / sampleDt);
    this.data = new Float32Array(this.count * 6);
    this.goal = null; // { team: scoring team, t }
    this._s = { pos: new Vector3(), vel: new Vector3(), angVel: null, onFloor: false };
  }

  update(ball) {
    const s = this._s;
    s.pos.copy(ball.pos);
    s.vel.copy(ball.vel);
    this.goal = null;
    const d = this.data;
    const sub = this.sampleDt / 2;
    const lim = ARENA.halfLength + BALL.radius;
    for (let i = 0; i < this.count; i++) {
      stepBallState(s, sub, this.arena, null);
      stepBallState(s, sub, this.arena, null);
      const k = i * 6;
      d[k] = s.pos.x; d[k + 1] = s.pos.y; d[k + 2] = s.pos.z;
      d[k + 3] = s.vel.x; d[k + 4] = s.vel.y; d[k + 5] = s.vel.z;
      if (!this.goal && Math.abs(s.pos.z) > lim) {
        this.goal = { team: s.pos.z > 0 ? 0 : 1, t: (i + 1) * this.sampleDt };
      }
    }
    return this;
  }

  // Short standalone check without touching the shared buffer.
  willScore(ball, seconds = 2.5) {
    const s = { pos: ball.pos.clone(), vel: ball.vel.clone(), angVel: null, onFloor: false };
    const dt = 1 / 60;
    const lim = ARENA.halfLength + BALL.radius;
    for (let t = 0; t < seconds; t += dt) {
      stepBallState(s, dt, this.arena, null);
      if (Math.abs(s.pos.z) > lim) return { team: s.pos.z > 0 ? 0 : 1, t };
    }
    return null;
  }

  sampleAt(t, out) {
    const i = Math.max(0, Math.min(this.count - 1, Math.round(t / this.sampleDt) - 1));
    const k = i * 6;
    return out.set(this.data[k], this.data[k + 1], this.data[k + 2]);
  }
}
