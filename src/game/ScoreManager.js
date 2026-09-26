export const POINTS = { goal: 100, assist: 50, save: 50, shot: 20, demo: 15, touch: 2 };

// Score, per-player statistics and match events (shots, saves, assists).
export class ScoreManager {
  constructor(world, predictor) {
    this.world = world;
    this.predictor = predictor;
    this.score = [0, 0];
    this.feed = [];
    this.lastShot = new Map();
    this.lastTouchPoints = new Map();
    const ev = world.events;
    this.unsub = [
      ev.on('ballTouch', (e) => this.onTouch(e)),
      ev.on('demolish', (e) => this.addPoints(e.attacker, POINTS.demo, 'demo', e)),
    ];
  }

  dispose() {
    this.unsub.forEach((u) => u());
  }

  addPoints(car, pts, kind, extra = {}) {
    car.stats.points += pts;
    if (kind !== 'touch') this.world.events.emit('statEvent', { car, kind, ...extra });
  }

  onTouch({ car, hit }) {
    const now = this.world.time;
    const last = this.lastTouchPoints.get(car.id) || -9;
    if (now - last > 1) {
      car.stats.touches++;
      this.addPoints(car, POINTS.touch, 'touch');
      this.lastTouchPoints.set(car.id, now);
    }
    if (!hit) return;
    const pre = this.predictor.goal;
    const post = this.predictor.willScore(this.world.ball, 2.5);
    if (pre && pre.team !== car.team && pre.t < 2.5 && (!post || post.team === car.team)) {
      car.stats.saves++;
      this.addPoints(car, POINTS.save, 'save');
    }
    if (post && post.team === car.team && !(pre && pre.team === car.team)) {
      if (now - (this.lastShot.get(car.id) || -9) > 1) {
        car.stats.shots++;
        this.lastShot.set(car.id, now);
        this.addPoints(car, POINTS.shot, 'shot');
      }
    }
  }

  // Credits scorer / assist from the touch history. Returns a goal description.
  onGoal(team) {
    this.score[team]++;
    const hist = this.world.touchHistory;
    let scorer = null;
    let assist = null;
    let scorerIdx = -1;
    for (let i = hist.length - 1; i >= 0; i--) {
      if (hist[i].car.team === team) { scorer = hist[i].car; scorerIdx = i; break; }
    }
    const last = hist.length ? hist[hist.length - 1].car : null;
    const ownGoal = !!last && last.team !== team;
    if (scorer) {
      scorer.stats.goals++;
      this.addPoints(scorer, POINTS.goal, 'goalCredit');
      const prev = scorerIdx > 0 ? hist[scorerIdx - 1] : null;
      if (prev && prev.car.team === team && prev.car !== scorer && hist[scorerIdx].time - prev.time < 5) {
        assist = prev.car;
        assist.stats.assists++;
        this.addPoints(assist, POINTS.assist, 'assist');
      }
      // A shot that scored always counts as a shot
      if (scorer.stats.shots < scorer.stats.goals) scorer.stats.shots = scorer.stats.goals;
    }
    return { team, scorer, assist, ownGoal, speed: this.world.ball.vel.length() };
  }

  mvp(winningTeam) {
    let best = null;
    for (const c of this.world.cars) {
      if (winningTeam >= 0 && c.team !== winningTeam) continue;
      if (!best || c.stats.points > best.stats.points) best = c;
    }
    return best;
  }
}
