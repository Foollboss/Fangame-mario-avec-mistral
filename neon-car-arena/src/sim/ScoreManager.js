import { predictGoalSide } from './BallPrediction.js';
import { teamAttackSign } from '../config/GameConfig.js';

export const POINTS = { goal: 100, assist: 50, save: 50, shot: 20, touch: 2, epicSave: 75 };

// Score des équipes et statistiques individuelles (buts, passes, arrêts, tirs, points).
export class ScoreManager {
  constructor(sim) {
    this.sim = sim;
    this.teamScore = [0, 0];
    this.stats = new Map();
    for (const car of sim.cars) this.stats.set(car.id, { goals: 0, assists: 0, saves: 0, shots: 0, touches: 0, points: 0, ownGoals: 0 });
    this.pending = null;
    this.threat = 0;
    this.threatAge = 99;
    this.lastTouchPoints = new Map();
  }

  s(car) { return this.stats.get(car.id); }

  // Appelé à chaque tick pour tenir à jour la menace sur les buts (pour détecter les arrêts).
  tick(dt) {
    const { sim } = this;
    if (this.pending) {
      const { car, before } = this.pending;
      this.pending = null;
      const after = predictGoalSide(sim.ball, sim.arena);
      const ownSide = -teamAttackSign(car.team);
      const oppSide = teamAttackSign(car.team);
      if (before === ownSide && after !== ownSide) this.award(car, 'save');
      else if (after === oppSide && before !== oppSide) this.award(car, 'shot');
      this.threat = after;
      this.threatAge = 0;
      return;
    }
    this.threatAge += dt;
    if (this.threatAge > 0.12) {
      this.threat = predictGoalSide(sim.ball, sim.arena);
      this.threatAge = 0;
    }
  }

  onTouch(car) {
    const st = this.s(car);
    if (!st) return;
    if (!this.pending) this.pending = { car, before: this.threat };
    const last = this.lastTouchPoints.get(car.id) ?? -10;
    if (this.sim.time - last > 1) {
      st.touches++;
      st.points += POINTS.touch;
      this.lastTouchPoints.set(car.id, this.sim.time);
    }
  }

  award(car, kind) {
    const st = this.s(car);
    if (!st) return;
    if (kind === 'save') { st.saves++; st.points += POINTS.save; }
    if (kind === 'shot') { st.shots++; st.points += POINTS.shot; }
    this.sim.events.emit('statEvent', { car, kind });
  }

  // Retourne { team, scorer, assist, ownGoal }
  onGoal(scoringTeam) {
    const { ball, cars } = this.sim;
    this.teamScore[scoringTeam]++;
    const byId = (id) => cars.find((c) => c.id === id) || null;
    let scorer = null, assist = null, ownGoal = false;
    if (ball.lastTouchTeam === scoringTeam) {
      scorer = byId(ball.lastTouch);
      const st = this.s(scorer);
      st.goals++; st.points += POINTS.goal;
      // Un but compte aussi comme tir s'il n'avait pas déjà été compté
      if (!this.recentShot(scorer)) { st.shots++; st.points += POINTS.shot; }
      if (ball.prevTouchTeam === scoringTeam && ball.prevTouch !== ball.lastTouch && ball.lastTouchTime - ball.prevTouchTime < 5) {
        assist = byId(ball.prevTouch);
        if (assist) { const sa = this.s(assist); sa.assists++; sa.points += POINTS.assist; }
      }
    } else if (ball.lastTouch !== null) {
      ownGoal = true;
      const og = byId(ball.lastTouch);
      if (og) this.s(og).ownGoals++;
    }
    this.pending = null;
    return { team: scoringTeam, scorer, assist, ownGoal };
  }

  recentShot() { return this.threat === teamAttackSign(this.sim.ball.lastTouchTeam); }

  mvp() {
    const winner = this.teamScore[0] === this.teamScore[1] ? -1 : this.teamScore[0] > this.teamScore[1] ? 0 : 1;
    let best = null, bestPts = -1;
    for (const car of this.sim.cars) {
      if (winner >= 0 && car.team !== winner) continue;
      const p = this.s(car).points;
      if (p > bestPts) { bestPts = p; best = car; }
    }
    return best;
  }
}
