import { BALL, MATCH } from '../core/Config.js';
import { GoalManager } from './GoalManager.js';
import { ScoreManager } from './ScoreManager.js';

// Match flow: countdown → playing → goal (slow motion) → replay → kickoff … → ended.
// Real-time transitions happen in update(); simulation-time rules in simStep().
export class MatchManager {
  constructor({ world, predictor, replay, duration = 300, replaysEnabled = true }) {
    this.world = world;
    this.events = world.events;
    this.predictor = predictor;
    this.replay = replay;
    this.duration = duration;
    this.replaysEnabled = replaysEnabled;
    this.goals = new GoalManager();
    this.score = new ScoreManager(world, predictor);
    this.state = 'idle';
    this.timeLeft = duration;
    this.overtime = false;
    this.overtimeTime = 0;
    this.stateTimer = 0;
    this.goalElapsed = 0;
    this.timeScale = 1;
    this.lastGoal = null;
    this.result = null;
    this.zeroGrace = 0;
    this.elapsed = 0;
  }

  get simRunning() {
    return this.state === 'countdown' || this.state === 'playing' || this.state === 'goal';
  }

  start() {
    this.beginKickoff();
  }

  beginKickoff() {
    const w = this.world;
    w.resetKickoff();
    w.carsFrozen = true;
    w.ball.frozen = true;
    this.replay.clear();
    this.state = 'countdown';
    this.stateTimer = MATCH.countdown;
    this.timeScale = 1;
    this.events.emit('kickoff', { overtime: this.overtime });
    this.events.emit('countdown', { value: MATCH.countdown });
  }

  update(realDt) {
    switch (this.state) {
      case 'countdown': {
        const before = Math.ceil(this.stateTimer);
        this.stateTimer -= realDt;
        const after = Math.ceil(this.stateTimer);
        if (after !== before && after > 0) this.events.emit('countdown', { value: after });
        if (this.stateTimer <= 0) {
          this.state = 'playing';
          this.world.carsFrozen = false;
          this.world.ball.frozen = false;
          this.events.emit('go', {});
        }
        break;
      }
      case 'goal': {
        this.goalElapsed += realDt;
        this.stateTimer -= realDt;
        this.timeScale = this.goalElapsed < MATCH.goalSlowmo ? MATCH.slowmoScale : 1;
        if (this.stateTimer <= 0) {
          this.timeScale = 1;
          const clip = this.replaysEnabled ? this.replay.capture(5.5) : null;
          if (clip) {
            this.state = 'replay';
            this.events.emit('replayStart', { goal: this.lastGoal });
          } else {
            this.afterGoal();
          }
        }
        break;
      }
      case 'replay':
        if (!this.replay.play(realDt)) this.skipReplay();
        break;
      default:
        break;
    }
  }

  skipReplay() {
    if (this.state !== 'replay') return;
    this.replay.clip = null;
    this.events.emit('replayEnd', {});
    this.afterGoal();
  }

  simStep(dt) {
    if (this.state === 'playing' || this.state === 'goal') this.replay.record(dt);
    if (this.state !== 'playing') return;
    this.elapsed += dt;
    if (this.overtime) this.overtimeTime += dt;
    else this.timeLeft = Math.max(0, this.timeLeft - dt);

    const scored = this.goals.check(this.world.ball);
    if (scored >= 0) {
      this.onGoal(scored);
      return;
    }
    if (!this.overtime && this.timeLeft <= 0) {
      // Like a buzzer: play continues until the ball touches the ground.
      this.zeroGrace += dt;
      const b = this.world.ball;
      if (b.pos.y < BALL.radius + 0.6 || this.zeroGrace > 6) this.timeUp();
    }
  }

  onGoal(team) {
    const w = this.world;
    const info = this.score.onGoal(team);
    const pos = w.ball.pos.clone();
    this.lastGoal = { ...info, pos, score: this.score.score.slice(), overtime: this.overtime };
    // The ball bursts; nearby cars get blown back.
    for (const car of w.cars) {
      if (car.demolished) continue;
      const d = car.physics.pos.clone().sub(pos);
      const dist = d.length();
      if (dist < 30) {
        d.normalize();
        d.y = Math.max(d.y, 0.35);
        car.physics.vel.addScaledVector(d, (1 - dist / 30) * 26);
        if (car.physics.grounded) car.physics.grounded = false;
      }
    }
    w.ball.hidden = true;
    w.ball.frozen = true;
    this.state = 'goal';
    this.goalElapsed = 0;
    this.stateTimer = MATCH.goalPause;
    this.timeScale = MATCH.slowmoScale;
    this.events.emit('goal', this.lastGoal);
  }

  afterGoal() {
    if (this.overtime) return this.endMatch();
    if (this.timeLeft <= 0) {
      const [a, b] = this.score.score;
      if (a === b) return this.startOvertime();
      return this.endMatch();
    }
    this.beginKickoff();
  }

  timeUp() {
    const [a, b] = this.score.score;
    if (a === b) this.startOvertime();
    else this.endMatch();
  }

  startOvertime() {
    this.overtime = true;
    this.overtimeTime = 0;
    this.events.emit('overtime', {});
    this.beginKickoff();
  }

  endMatch(forfeit = false) {
    if (this.state === 'ended') return;
    this.state = 'ended';
    this.timeScale = 1;
    this.world.carsFrozen = true;
    const [a, b] = this.score.score;
    const winner = forfeit ? 1 : a > b ? 0 : b > a ? 1 : -1;
    this.result = {
      score: [a, b],
      winner,
      forfeit,
      overtime: this.overtime,
      mvp: this.score.mvp(winner),
      cars: this.world.cars,
      elapsed: this.elapsed,
    };
    this.events.emit('matchEnd', this.result);
  }
}
