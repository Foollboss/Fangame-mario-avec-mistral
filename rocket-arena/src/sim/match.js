import { PHYS } from '../config.js';
import { Ball, predictBall } from './ball.js';
import { Car } from './car.js';
import { collideCarBall, collideCars } from './collide.js';
import {
  createBoostPads, scoringTeam, KICKOFF_SPOTS, KICKOFF_SETS, RESPAWN_SPOTS,
} from './arena.js';

const BASE_GRAVITY = PHYS.gravity;
const POINTS = { goal: 100, assist: 50, save: 50, epicSave: 75, shot: 20, demo: 25 };
const RECORD_EVERY = 2;
const RECORD_FRAMES = 60 * 12;

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Returns the team that the predicted path makes score, with the time, or null.
export function predictedGoal(prediction, maxT = 3.5) {
  for (const s of prediction) {
    if (s.t > maxT) break;
    const team = scoringTeam(s.pos.z, PHYS.ballRadius * 0.5);
    if (team >= 0) return { team, t: s.t };
  }
  return null;
}

export class Match {
  constructor(opts) {
    this.opts = {
      duration: 300,
      freeplay: false,
      unlimitedBoost: false,
      noBoost: false,
      gravityScale: 1,
      replays: true,
      ...opts,
    };
    this.ball = new Ball();
    this.cars = this.opts.players.map((p) => new Car(p));
    this.pads = createBoostPads();
    this.score = [0, 0];
    this.timeLeft = this.opts.duration;
    this.overtime = false;
    this.overtimeElapsed = 0;
    this.time = 0;
    this.tickCount = 0;
    this.state = 'countdown';
    this.stateTime = 0;
    this.clockRunning = false;
    this.events = [];
    this.frames = [];
    this.prediction = [];
    this.goalInfo = null;
    this.skipRequested = false;
    this.replay = null;
    this.winner = -1;
    this.lastCountdown = 4;
    if (this.opts.freeplay) this.startFreeplay();
    else this.resetKickoff();
  }

  emit(e) {
    this.events.push(e);
  }

  teamCars(team) {
    return this.cars.filter((c) => c.team === team);
  }

  startFreeplay() {
    this.ball.reset(0, PHYS.ballRadius, 0);
    const spots = RESPAWN_SPOTS;
    this.cars.forEach((car, i) => {
      const [x, z] = spots[i % spots.length];
      const s = car.team === 0 ? 1 : -1;
      car.placeAt(x * s, z * s, 0, s);
      car.boost = 100;
    });
    this.state = 'playing';
    this.stateTime = 0;
    this.refreshPrediction();
  }

  resetKickoff() {
    this.ball.reset(0, PHYS.ballRadius, 0);
    for (const p of this.pads) { p.active = true; p.timer = 0; }
    for (let team = 0; team < 2; team++) {
      const cars = this.teamCars(team);
      const size = Math.min(Math.max(cars.length, 1), 4);
      const sets = KICKOFF_SETS[size];
      const set = shuffle([...sets[Math.floor(Math.random() * sets.length)]]);
      cars.forEach((car, i) => {
        const s = team === 0 ? 1 : -1;
        let x;
        let z;
        if (i < set.length) [x, z] = KICKOFF_SPOTS[set[i]];
        else [x, z] = RESPAWN_SPOTS[i % RESPAWN_SPOTS.length];
        x *= s;
        z *= s;
        car.placeAt(x, z, -x, -z);
        car.boost = this.startBoost();
      });
    }
    // Kickoff spots are chosen per team; mirror orange onto blue so kickoffs are fair.
    const blue = this.teamCars(0);
    const orange = this.teamCars(1);
    for (let i = 0; i < Math.min(blue.length, orange.length); i++) {
      const b = blue[i];
      orange[i].placeAt(-b.pos.x, -b.pos.z, b.pos.x, b.pos.z);
      orange[i].boost = this.startBoost();
    }
    this.state = 'countdown';
    this.stateTime = 0;
    this.clockRunning = false;
    this.lastCountdown = 4;
    this.kickoff = true;
    this.refreshPrediction();
    this.emit({ type: 'kickoff' });
  }

  startBoost() {
    if (this.opts.unlimitedBoost) return 100;
    return this.opts.noBoost ? 0 : PHYS.startBoost;
  }

  refreshPrediction() {
    this.prediction = predictBall(this.ball, 4, 1 / 60);
  }

  requestSkip() {
    this.skipRequested = true;
  }

  tick(dt) {
    // Mutators: the whole simulation reads gravity from PHYS.
    PHYS.gravity = BASE_GRAVITY * this.opts.gravityScale;
    this.time += dt;
    this.stateTime += dt;
    this.tickCount++;
    switch (this.state) {
      case 'countdown': {
        const n = Math.ceil(3 - this.stateTime);
        if (n < this.lastCountdown && n > 0) {
          this.lastCountdown = n;
          this.emit({ type: 'countdown', n });
        }
        for (const car of this.cars) {
          car.prevPos.copy(car.pos);
          car.prevQuat.copy(car.quat);
          car.prevJump = car.controls.jump;
        }
        this.ball.prevPos.copy(this.ball.pos);
        if (this.stateTime >= 3) {
          this.state = 'playing';
          this.stateTime = 0;
          this.emit({ type: 'go' });
        }
        this.record();
        break;
      }
      case 'playing':
        this.simulate(dt, true);
        this.updateClock(dt);
        break;
      case 'goal':
        this.simulate(dt, false);
        if (this.stateTime > (this.opts.freeplay ? 2 : 3)) {
          if (this.opts.freeplay) {
            this.ball.reset(0, PHYS.ballRadius, 0);
            this.state = 'playing';
            this.stateTime = 0;
            this.refreshPrediction();
          } else if (this.opts.replays) this.startReplay();
          else this.afterGoal();
        }
        break;
      case 'replay':
        this.replay.time += dt;
        if (!this.replay.goalShown && this.replay.time >= this.replay.goalTime) {
          this.replay.goalShown = true;
          this.emit({ type: 'replayGoal', team: this.goalInfo.team, pos: this.goalInfo.pos.clone() });
        }
        if (this.replay.time >= this.replay.end || (this.skipRequested && this.stateTime > 0.3)) {
          this.replay = null;
          this.afterGoal();
        }
        break;
      case 'overtime':
        if (this.stateTime > 2.5) this.resetKickoff();
        break;
      default:
        break;
    }
    this.skipRequested = false;
  }

  updateClock(dt) {
    if (this.opts.freeplay || !this.clockRunning) return;
    if (this.overtime) {
      this.overtimeElapsed += dt;
      return;
    }
    if (this.opts.duration <= 0) return;
    this.timeLeft = Math.max(0, this.timeLeft - dt);
    if (this.timeLeft > 0) return;
    const ballDown = this.ball.pos.y - this.ball.radius < 0.08;
    if (!ballDown) return;
    if (this.score[0] !== this.score[1]) this.endMatch();
    else {
      this.overtime = true;
      this.state = 'overtime';
      this.stateTime = 0;
      this.emit({ type: 'overtime' });
    }
  }

  endMatch() {
    this.state = 'ended';
    this.stateTime = 0;
    this.winner = this.score[0] > this.score[1] ? 0 : 1;
    this.emit({ type: 'end', winner: this.winner });
  }

  afterGoal() {
    if (this.overtime) return this.endMatch();
    if (this.opts.duration > 0 && this.timeLeft <= 0) {
      if (this.score[0] !== this.score[1]) return this.endMatch();
      this.overtime = true;
      this.state = 'overtime';
      this.stateTime = 0;
      this.emit({ type: 'overtime' });
      return undefined;
    }
    this.resetKickoff();
    return undefined;
  }

  simulate(dt, withBall) {
    const { cars, ball } = this;
    for (const car of cars) {
      if (car.demolished) {
        car.respawnTimer -= dt;
        if (car.respawnTimer <= 0) this.respawn(car);
        car.prevPos.copy(car.pos);
        continue;
      }
      car.step(dt);
      if (this.opts.unlimitedBoost) car.boost = 100;
      else if (this.opts.noBoost) car.boost = 0;
      if (car.justJumped) this.emit({ type: 'jump', car });
      if (car.justDodged) this.emit({ type: 'dodge', car });
    }

    let touched = null;
    if (withBall && !ball.hidden) {
      const impact = ball.step(dt);
      if (impact > 2) this.emit({ type: 'bounce', pos: ball.pos.clone(), strength: impact });
      for (const car of cars) {
        const hit = collideCarBall(car, ball, this.time);
        if (car.flipReset) {
          car.flipReset = false;
          this.emit({ type: 'flipReset', car });
        }
        if (hit > 0) {
          if (hit > 1.2 || !ball.lastTouch || ball.lastTouch.car !== car || this.time - ball.lastTouch.time > 0.4) {
            const touch = { car, time: this.time };
            ball.touches.push(touch);
            if (ball.touches.length > 20) ball.touches.shift();
            if (hit > 1.2) this.emit({ type: 'hit', car, pos: ball.pos.clone(), strength: hit });
            touched = touched || [];
            touched.push(car);
          }
          ball.lastTouch = { car, time: this.time };
          if (this.kickoff) this.kickoff = false;
          this.clockRunning = true;
        }
      }
    } else {
      ball.prevPos.copy(ball.pos);
      ball.prevQuat.copy(ball.quat);
    }

    for (let i = 0; i < cars.length; i++) {
      for (let k = i + 1; k < cars.length; k++) {
        const res = collideCars(cars[i], cars[k]);
        if (!res) continue;
        if (res.type === 'demo') {
          if (this.state === 'playing') {
            res.attacker.stats.demos++;
            this.addPoints(res.attacker, POINTS.demo, 'DÉMOLITION');
          }
          this.emit({ type: 'demo', attacker: res.attacker, victim: res.victim, pos: res.victim.pos.clone() });
        } else if (res.type === 'bump') {
          this.emit({ type: 'bump', attacker: res.attacker, victim: res.victim, strength: res.strength, pos: res.victim.pos.clone() });
        }
      }
    }

    this.updatePads(dt);

    const oldPrediction = this.prediction;
    if (touched || this.tickCount % 4 === 0) this.refreshPrediction();
    if (touched && this.state === 'playing') this.touchStats(touched, oldPrediction);

    if (withBall && !ball.hidden && this.state === 'playing') {
      const team = scoringTeam(ball.pos.z, ball.radius);
      if (team >= 0) this.onGoal(team);
    }
    this.record();
  }

  touchStats(cars, oldPrediction) {
    const before = predictedGoal(oldPrediction, 2.5);
    const after = predictedGoal(this.prediction, 3.5);
    for (const car of cars) {
      if (after && after.team === car.team && this.time - car.lastShotTime > 1.5) {
        car.lastShotTime = this.time;
        car.stats.shots++;
        this.addPoints(car, POINTS.shot, 'TIR CADRÉ');
      }
      if (before && before.team !== car.team && (!after || after.team === car.team)) {
        const epic = before.t < 0.35;
        car.stats.saves++;
        this.addPoints(car, epic ? POINTS.epicSave : POINTS.save, epic ? 'ARRÊT ÉPIQUE' : 'ARRÊT');
      }
    }
  }

  addPoints(car, pts, label) {
    car.stats.score += pts;
    this.emit({ type: 'stat', car, points: pts, label });
  }

  respawn(car) {
    const mates = this.teamCars(car.team);
    const idx = Math.max(0, mates.indexOf(car));
    const [x, z] = RESPAWN_SPOTS[idx % RESPAWN_SPOTS.length];
    const s = car.team === 0 ? 1 : -1;
    const stats = car.stats;
    car.placeAt(x * s, z * s, 0, s);
    car.boost = this.startBoost();
    car.stats = stats;
    this.emit({ type: 'respawn', car });
  }

  updatePads(dt) {
    for (const pad of this.pads) {
      if (!pad.active) {
        pad.timer -= dt;
        if (pad.timer <= 0) pad.active = true;
        continue;
      }
      const r = pad.big ? 2.08 : 1.44;
      const h = pad.big ? 1.68 : 1.65;
      for (const car of this.cars) {
        if (car.demolished || car.boost >= 100 || this.opts.noBoost) continue;
        const dx = car.pos.x - pad.pos.x;
        const dz = car.pos.z - pad.pos.z;
        if (dx * dx + dz * dz < r * r && car.pos.y < h) {
          car.boost = Math.min(100, car.boost + (pad.big ? 100 : 12));
          pad.active = false;
          pad.timer = pad.big ? 10 : 4;
          this.emit({ type: 'pad', car, big: pad.big, pos: pad.pos });
          break;
        }
      }
    }
  }

  onGoal(team) {
    const { ball } = this;
    this.score[team]++;
    const touches = ball.touches;
    let scorer = null;
    let assist = null;
    let si = -1;
    for (let i = touches.length - 1; i >= 0; i--) {
      if (touches[i].car.team === team) { scorer = touches[i].car; si = i; break; }
    }
    if (scorer) {
      for (let i = si - 1; i >= 0; i--) {
        const t = touches[i];
        if (t.car.team !== team) break;
        if (t.car !== scorer) {
          if (touches[si].time - t.time < 5) assist = t.car;
          break;
        }
      }
      scorer.stats.goals++;
      this.addPoints(scorer, POINTS.goal, 'BUT');
      if (assist) {
        assist.stats.assists++;
        this.addPoints(assist, POINTS.assist, 'PASSE DÉCISIVE');
      }
    }
    const speedKmh = Math.round(ball.vel.length() * 3.6);
    const ownGoal = !scorer && ball.lastTouch && ball.lastTouch.car.team !== team ? ball.lastTouch.car : null;
    this.goalInfo = { team, scorer, assist, ownGoal, pos: ball.pos.clone(), speedKmh, time: this.time };
    this.emit({ type: 'goal', ...this.goalInfo });

    // The explosion shoves nearby cars.
    for (const car of this.cars) {
      if (car.demolished) continue;
      const d = car.pos.distanceTo(ball.pos);
      if (d < 14) {
        const dir = car.pos.clone().sub(ball.pos).normalize();
        car.vel.addScaledVector(dir, (14 - d) * 1.6);
        car.vel.y += (14 - d) * 0.5;
        car.jumpLock = 0.2;
      }
    }
    ball.hidden = true;
    this.state = 'goal';
    this.stateTime = 0;
  }

  // ---------- Replay recording ----------
  record() {
    if (this.tickCount % RECORD_EVERY !== 0) return;
    const b = this.ball;
    const frame = {
      t: this.time,
      ball: [b.pos.x, b.pos.y, b.pos.z, b.quat.x, b.quat.y, b.quat.z, b.quat.w, b.hidden ? 1 : 0],
      cars: this.cars.map((c) => [
        c.pos.x, c.pos.y, c.pos.z, c.quat.x, c.quat.y, c.quat.z, c.quat.w,
        c.boosting ? 1 : 0, c.demolished ? 1 : 0, c.steerVis, c.wheelSpin, c.supersonic ? 1 : 0,
      ]),
    };
    this.frames.push(frame);
    if (this.frames.length > RECORD_FRAMES) this.frames.shift();
  }

  startReplay() {
    const goalTime = this.goalInfo.time;
    const first = this.frames.length ? this.frames[0].t : goalTime;
    const start = Math.max(first, goalTime - 5.5);
    this.replay = { time: start, start, end: goalTime + 1.2, goalTime, goalShown: false, frames: this.frames.slice() };
    this.state = 'replay';
    this.stateTime = 0;
    this.emit({ type: 'replayStart' });
  }

  // Interpolated snapshot at replay time.
  replaySnapshot(t) {
    const frames = this.replay ? this.replay.frames : this.frames;
    if (!frames.length) return null;
    let lo = 0;
    let hi = frames.length - 1;
    if (t <= frames[0].t) hi = 0;
    else if (t >= frames[hi].t) lo = hi;
    else {
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (frames[mid].t <= t) lo = mid; else hi = mid;
      }
    }
    const a = frames[lo];
    const b = frames[hi];
    const k = hi === lo ? 0 : (t - a.t) / (b.t - a.t);
    return { a, b, k };
  }
}

export const MATCH_POINTS = POINTS;
