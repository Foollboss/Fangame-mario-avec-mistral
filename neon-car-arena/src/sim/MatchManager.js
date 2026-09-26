import { ARENA, MATCH, TICK_DT } from '../config/GameConfig.js';
import { Simulation } from './Simulation.js';
import { Car } from './Car.js';
import { ScoreManager } from './ScoreManager.js';
import { GoalManager } from './GoalManager.js';
import { BallPrediction } from './BallPrediction.js';
import { ReplaySystem } from './ReplaySystem.js';
import { BotAI, TeamBrain } from '../controllers/BotAI.js';
import { TrainingDrills } from './TrainingDrills.js';
import { Random } from '../core/Random.js';
import { EventBus } from '../core/EventBus.js';

export const MODES = {
  quick: { id: 'quick', label: 'Match rapide', teamSize: 3 },
  duel: { id: 'duel', label: 'Duel', teamSize: 1 },
  chaos: { id: 'chaos', label: 'Chaos', teamSize: 4 },
  tournament: { id: 'tournament', label: 'Tournoi', teamSize: 3 },
  training: { id: 'training', label: 'Entraînement', teamSize: 1 },
};

const BOT_NAMES = ['Zephyr', 'Kilo', 'Nyx', 'Bolt', 'Orion', 'Vega', 'Rook', 'Juno', 'Axel', 'Mira', 'Talon', 'Echo', 'Rune', 'Lynx', 'Sol', 'Indigo'];

// Positions de coup d'envoi (équipe 0, en -Z). L'équipe 1 utilise la symétrie centrale.
const KICKOFF_SPOTS = [
  [-0.42, -0.42], [0.42, -0.42], [-0.07, -0.72], [0.07, -0.72], [0, -0.88],
];

// Orchestration d'un match : phases, chrono, buts, replay, prolongation, résultats.
// Le rendu et l'interface s'abonnent à `events` ; aucune dépendance au DOM ici.
export class MatchManager {
  constructor(opts) {
    this.opts = {
      mode: 'quick', teamSize: 3, duration: MATCH.DEFAULT_DURATION, difficulty: 'medium',
      replays: true, seed: (Date.now() & 0xffff) + 1, player: { name: 'Joueur', vehicleId: 'pulse', loadout: null },
      spectator: false, drill: 'free', opponentDifficulty: null, ...opts,
    };
    const o = this.opts;
    this.training = o.mode === 'training';
    this.sim = new Simulation(o.seed);
    this.rng = new Random(o.seed * 7 + 3);
    this.events = new EventBus();
    this.sim.events.on('ballTouch', (e) => { this.score?.onTouch(e.car); this.kickoffActive = false; this.events.emit('ballTouch', e); });
    for (const t of ['ballBounce', 'boostPickup', 'carBump', 'carJump', 'carDash', 'carLand', 'statEvent']) {
      this.sim.events.on(t, (e) => this.events.emit(t, e));
    }

    this.controllers = [];
    const names = [...BOT_NAMES];
    for (let i = names.length - 1; i > 0; i--) { const j = Math.floor(this.rng.next() * (i + 1)); [names[i], names[j]] = [names[j], names[i]]; }
    let nid = 0;
    const size = this.training ? 1 : o.teamSize;
    for (let team = 0; team < 2; team++) {
      for (let k = 0; k < size; k++) {
        if (this.training && team === 1) continue;
        const isPlayer = team === 0 && k === 0 && !o.spectator;
        const car = new Car({
          id: nid++, team,
          name: isPlayer ? o.player.name : names.pop(),
          vehicleId: isPlayer ? o.player.vehicleId : this.rng.pick(['pulse', 'vortex', 'titan', 'phantom', 'rift', 'nomad']),
          isBot: !isPlayer,
          loadout: isPlayer ? o.player.loadout : null,
        });
        this.sim.addCar(car);
        const diff = team === 1 && o.opponentDifficulty ? o.opponentDifficulty : o.difficulty;
        this.controllers.push(isPlayer ? null : new BotAI(car, diff, o.seed + car.id * 13));
      }
    }
    for (const c of [...this.sim.cars, this.sim.ball]) { c.prevPos = c.pos.clone(); c.prevQuat = c.quat.clone(); }
    this.playerCar = o.spectator ? null : this.sim.cars[0];
    this.brains = [new TeamBrain(0), new TeamBrain(1)];
    this.teamCars = [0, 1].map((t) => this.sim.cars.filter((c) => c.team === t));
    this.score = new ScoreManager(this.sim);
    this.prediction = new BallPrediction(4);
    this.replay = new ReplaySystem(this.sim, 6);
    this.ctx = { sim: this.sim, prediction: this.prediction, brain: null, kickoff: false, kickoffFreeze: false };
    this.drills = this.training ? new TrainingDrills(this) : null;

    this.clock = o.duration;
    this.overtime = false;
    this.overtimeClock = 0;
    this.phase = 'init';
    this.phaseT = 0;
    this.timeScale = 1;
    this.acc = 0;
    this.paused = false;
    this.humanInput = null;      // InputFrame brute (tests)
    this.humanController = null; // HumanController du joueur local
    this.lastGoal = null;
    this.result = null;
    this.alpha = 0;
    this.startKickoff();
  }

  setHumanInput(frame) { this.humanInput = frame; }

  startKickoff() {
    const { sim } = this;
    sim.ball.reset(0, sim.ball.radius, 0);
    sim.ballActive = true;
    sim.ballFrozen = true;
    this.replay.clear();
    this.kickoffActive = false;
    this.kickoffT = 0;
    if (this.training) {
      this.drills.reset();
      for (const c of [...sim.cars, sim.ball]) { c.prevPos?.copy(c.pos); c.prevQuat?.copy(c.quat); }
      this.setPhase('playing');
      return;
    }
    for (let team = 0; team < 2; team++) {
      const cars = this.teamCars[team];
      const spots = [...KICKOFF_SPOTS];
      for (let i = spots.length - 1; i > 0; i--) { const j = Math.floor(this.rng.next() * (i + 1)); [spots[i], spots[j]] = [spots[j], spots[i]]; }
      // Toujours au moins une position « diagonale » ou centrale occupée pour lancer le jeu
      const chosen = team === 0 ? (this._spots = spots.slice(0, cars.length)) : this._spots;
      cars.forEach((car, i) => {
        const [fx, fz] = chosen[i % chosen.length];
        const s = team === 0 ? 1 : -1;
        sim.placeCar(car, s * fx * ARENA.W, s * fz * ARENA.L, 0, 0);
      });
    }
    for (const c of [...sim.cars, sim.ball]) { c.prevPos.copy(c.pos); c.prevQuat.copy(c.quat); }
    sim.carsFrozen = true;
    this.kickoffActive = true;
    this.kickoffT = 0;
    this.setPhase('countdown');
    this.events.emit('kickoff', { overtime: this.overtime });
  }

  setPhase(p) {
    this.phase = p;
    this.phaseT = 0;
    this.events.emit('phase', p);
  }

  // Avance le match de `realDt` secondes réelles.
  update(realDt) {
    if (this.paused || this.phase === 'ended') return;
    realDt = Math.min(realDt, 0.1);
    this.phaseT += realDt;

    if (this.phase === 'countdown') {
      const prev = Math.ceil(MATCH.COUNTDOWN - (this.phaseT - realDt));
      const now = Math.ceil(MATCH.COUNTDOWN - this.phaseT);
      if (now !== prev && now > 0) this.events.emit('countdown', now);
      if (this.phaseT >= MATCH.COUNTDOWN) {
        this.sim.carsFrozen = false;
        this.sim.ballFrozen = false;
        this.events.emit('countdown', 0);
        this.setPhase('playing');
      }
    } else if (this.phase === 'goal') {
      this.timeScale = this.phaseT < MATCH.GOAL_SLOWMO ? 0.3 : Math.min(1, 0.3 + (this.phaseT - MATCH.GOAL_SLOWMO) * 1.5);
      const delay = this.training ? 1.4 : MATCH.GOAL_DELAY;
      if (this.phaseT >= delay) {
        this.timeScale = 1;
        if (!this.training && this.opts.replays && this.replay.start(MATCH.REPLAY_LENGTH)) this.setPhase('replay');
        else this.afterGoal();
      }
    } else if (this.phase === 'replay') {
      if (!this.replay.advance(realDt * 0.75)) this.afterGoal();
      return;
    }

    const simDt = realDt * this.timeScale;
    this.acc += simDt;
    let n = 0;
    while (this.acc >= TICK_DT && n < 10) {
      this.tick(TICK_DT);
      this.acc -= TICK_DT;
      n++;
    }
    if (n === 10) this.acc = 0;
    this.alpha = this.acc / TICK_DT;
  }

  skipReplay() {
    if (this.phase === 'replay') { this.replay.playing = false; this.afterGoal(); }
  }

  afterGoal() {
    if (this.training) { this.startKickoff(); return; }
    if (this.overtime || (this.clock <= 0 && this.score.teamScore[0] !== this.score.teamScore[1])) this.endMatch();
    else this.startKickoff();
  }

  tick(dt) {
    const { sim } = this;
    this.ctx.kickoff = this.kickoffActive && this.phase === 'playing';
    this.ctx.kickoffFreeze = this.phase === 'countdown';
    const inputs = this._inputs || (this._inputs = []);
    for (let i = 0; i < sim.cars.length; i++) {
      const c = this.controllers[i];
      if (c) {
        this.ctx.brain = this.brains[sim.cars[i].team];
        inputs[i] = c.update(dt, this.ctx);
      } else inputs[i] = this.humanController ? this.humanController.update(dt, this.ctx, sim.cars[i]) : this.humanInput;
    }
    for (const c of sim.cars) { c.prevPos.copy(c.pos); c.prevQuat.copy(c.quat); }
    sim.ball.prevPos.copy(sim.ball.pos); sim.ball.prevQuat.copy(sim.ball.quat);

    sim.step(dt, inputs);
    if (sim.sanitize()) this.events.emit('warning', 'reset');

    this.prediction.age += dt;
    if (this.prediction.age > 0.1) this.prediction.update(sim.ball, sim.arena);
    this.brains[0].update(dt, sim, this.teamCars[0]);
    this.brains[1].update(dt, sim, this.teamCars[1]);

    if (this.phase === 'playing') {
      this.kickoffT += dt;
      if (this.kickoffT > 5) this.kickoffActive = false;
      this.score.tick(dt);
      this.replay.record(dt);
      if (this.training) {
        this.clock += dt;
        this.drills.tick(dt);
      } else if (this.overtime) this.overtimeClock += dt;
      else if (!this.kickoffActive) {
        this.clock = Math.max(0, this.clock - dt);
        if (this.clock <= 0) this.timeUp();
      }
      if (this.phase === 'playing') {
        const team = GoalManager.detect(sim);
        if (team >= 0) this.onGoal(team);
      }
    }
  }

  timeUp() {
    const [a, b] = this.score.teamScore;
    if (a !== b) this.endMatch();
    else {
      this.overtime = true;
      this.events.emit('overtime');
      this.startKickoff();
    }
  }

  onGoal(team) {
    const { sim } = this;
    if (this.training) {
      this.drills.onGoal(team);
      GoalManager.explode(sim, 30, 20);
      sim.ballActive = false;
      sim.ballFrozen = true;
      this.events.emit('goal', { team, training: true, pos: sim.ball.pos.clone() });
      this.setPhase('goal');
      return;
    }
    const info = this.score.onGoal(team);
    info.pos = sim.ball.pos.clone();
    info.speed = sim.ball.vel.length();
    info.score = [...this.score.teamScore];
    this.lastGoal = info;
    GoalManager.explode(sim);
    sim.ballActive = false;
    sim.ballFrozen = true;
    this.events.emit('goal', info);
    this.setPhase('goal');
  }

  endMatch() {
    const [a, b] = this.score.teamScore;
    const winner = a === b ? -1 : a > b ? 0 : 1;
    const player = this.playerCar;
    this.result = {
      mode: this.opts.mode,
      arenaId: this.opts.arenaId,
      difficulty: this.opts.difficulty,
      score: [a, b],
      winner,
      overtime: this.overtime,
      playerTeam: player ? player.team : 0,
      playerWon: player ? winner === player.team : false,
      mvp: this.score.mvp(),
      players: this.sim.cars.map((c) => ({ id: c.id, name: c.name, team: c.team, isBot: c.isBot, ...this.score.s(c) })),
      playerStats: player ? { ...this.score.s(player) } : null,
    };
    this.setPhase('ended');
    this.events.emit('matchEnd', this.result);
  }

  // Positions interpolées pour le rendu (fluide quel que soit le nombre d'images par seconde).
  interp(obj, outPos, outQuat) {
    const a = this.phase === 'countdown' ? 1 : this.alpha;
    outPos.lerpVectors(obj.prevPos || obj.pos, obj.pos, a);
    if (outQuat) outQuat.slerpQuaternions(obj.prevQuat || obj.quat, obj.quat, a);
  }

  timeLabel() {
    if (this.training) return fmt(this.clock);
    if (this.overtime) return '+' + fmt(this.overtimeClock);
    return fmt(Math.ceil(this.clock));
  }
}

function fmt(s) {
  s = Math.max(0, Math.floor(s));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

