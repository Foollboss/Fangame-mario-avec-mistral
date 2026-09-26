import { Vector3 } from 'three';
import { ARENA, PHYS, teamAttackSign } from '../config/GameConfig.js';
import { clamp } from '../core/math.js';
import { InputFrame } from '../sim/InputFrame.js';
import { orientInAir, angleTo } from './Steering.js';

export const DIFFICULTY = {
  easy: {
    id: 'easy', label: 'FACILE', react: 0.4, horizon: 0.5, aimErr: 0.5, boostUse: 0.2, throttle: 0.8,
    jumps: true, dash: false, aerial: false, roles: false, smart: false, pass: false, kickoffDash: false, maxJumpH: 5,
  },
  medium: {
    id: 'medium', label: 'MOYEN', react: 0.2, horizon: 2, aimErr: 0.22, boostUse: 0.7, throttle: 1,
    jumps: true, dash: false, aerial: false, roles: true, smart: false, pass: false, kickoffDash: true, maxJumpH: 7,
  },
  hard: {
    id: 'hard', label: 'DIFFICILE', react: 0.09, horizon: 3, aimErr: 0.09, boostUse: 1, throttle: 1,
    jumps: true, dash: true, aerial: true, maxAerialH: 16, roles: true, smart: true, pass: true, kickoffDash: true, maxJumpH: 11,
  },
  expert: {
    id: 'expert', label: 'EXPERT', react: 0.03, horizon: 4, aimErr: 0.03, boostUse: 1, throttle: 1,
    jumps: true, dash: true, aerial: true, maxAerialH: 34, roles: true, smart: true, pass: true, kickoffDash: true, maxJumpH: 11,
  },
};

const UP = new Vector3(0, 1, 0);
const _p = { x: 0, y: 0, z: 0 };
const _v = new Vector3(), _f = new Vector3(), _a = new Vector3();

// Temps nécessaire pour que le centre de la voiture monte de h (saut maintenu, double saut au-delà).
function timeToHeight(h) {
  if (h <= 0) return 0;
  const a1 = PHYS.JUMP_HOLD_ACCEL - PHYS.GRAVITY, v0 = PHYS.JUMP_IMPULSE;
  const h1 = v0 * 0.2 + 0.5 * a1 * 0.04;
  if (h <= h1) return (-v0 + Math.sqrt(v0 * v0 + 2 * a1 * h)) / a1;
  const v1 = v0 + a1 * 0.2, g = PHYS.GRAVITY;
  const disc = v1 * v1 - 2 * g * (h - h1);
  if (disc >= 0) return 0.2 + (v1 - Math.sqrt(disc)) / g;
  return 0.25 + (h - 3) / 11; // double saut, approximation
}

// Estimation du temps pour atteindre (x, z) au sol.
function eta(car, x, z, canBoost) {
  const dist = Math.hypot(x - car.pos.x, z - car.pos.z);
  const ang = Math.abs(angleTo(car, x, z));
  const speed = Math.max(0, car.vel.dot(car.fwd));
  const vmax = canBoost && car.boost > 15 ? 58 : 40;
  const avg = Math.max(14, (speed + vmax) * 0.5 + (dist > 60 ? 8 : 0));
  return dist / avg + ang * 0.42;
}

// Répartition des rôles par équipe : ATTAQUANT (va au ballon), SOUTIEN, DÉFENSEUR.
export class TeamBrain {
  constructor(team) {
    this.team = team;
    this.roles = new Map();
    this.timer = 0;
    this.attacker = null;
  }

  update(dt, sim, cars) {
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = 0.25;
    const sign = teamAttackSign(this.team);
    const ball = sim.ball;
    const scored = cars.map((car) => {
      let e = eta(car, ball.pos.x, ball.pos.z, true);
      // Mauvais côté du ballon (entre le ballon et le but adverse) : pénalité
      if ((car.pos.z - ball.pos.z) * sign > 4) e += 1.2;
      if (car === this.attacker) e -= 0.35; // hystérésis
      if (!car.onGround && car.pos.y > 4) e += 0.3;
      return { car, e };
    }).sort((a, b) => a.e - b.e);
    this.roles.clear();
    if (!scored.length) return;
    this.attacker = scored[0].car;
    this.roles.set(scored[0].car.id, 'attack');
    const rest = scored.slice(1);
    const ownZ = -sign * ARENA.L;
    rest.sort((a, b) => Math.abs(a.car.pos.z - ownZ) - Math.abs(b.car.pos.z - ownZ));
    rest.forEach((r, i) => this.roles.set(r.car.id, i === 0 ? 'defend' : 'support'));
    if (rest.length === 1) this.roles.set(rest[0].car.id, 'defend');
  }
}

export class BotAI {
  constructor(car, difficulty = 'medium', seed = 1) {
    this.car = car;
    this.cfg = DIFFICULTY[difficulty] || DIFFICULTY.medium;
    this.frame = new InputFrame();
    this.decisionT = 0;
    this.seed = seed * 9301 + 49297;
    this.mode = 'idle';
    this.target = new Vector3();
    this.hitDir = new Vector3(0, 0, 1);
    this.interceptTime = 0;   // instant absolu (temps de simulation)
    this.ballTarget = new Vector3();
    this.jumpT = -1;
    this.aerial = false;
    this.stuckT = 0;
    this.reverseT = 0;
    this.aimOffset = 0;
    this.rotating = false;
  }

  rand() {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  update(dt, ctx) {
    const { sim } = ctx;
    const car = this.car;
    const f = this.frame.clear();
    this.decisionT -= dt;
    if (this.decisionT <= 0) {
      this.decisionT = this.cfg.react * (0.75 + this.rand() * 0.5);
      this.plan(ctx);
    }
    if (ctx.kickoffFreeze) return f;

    if (!car.onGround || this.jumpT >= 0) this.air(dt, ctx, f);
    if (car.onGround && this.jumpT < 0) this.ground(dt, ctx, f);
    return f;
  }

  // ---------- Décision ----------
  plan(ctx) {
    const { sim, prediction, brain } = ctx;
    const car = this.car, cfg = this.cfg, ball = sim.ball;
    const sign = teamAttackSign(car.team);
    const ownGoalZ = -sign * ARENA.L;
    const role = cfg.roles ? brain.roles.get(car.id) || 'attack' : 'attack';
    const threat = prediction.goalSide === -sign && prediction.goalTime < 3.5;

    if (ctx.kickoff) {
      if (role === 'attack' || !cfg.roles) return this.setMode('kickoff', ball.pos.x, ball.pos.z, sim);
    }
    if (this.aerial) return;

    if (threat && (role !== 'support' || !cfg.roles)) return this.planHit(ctx, 'save');

    if (role === 'attack') {
      if (cfg.smart && this.shouldShadow(ctx)) {
        const bx = ball.pos.x * 0.7, bz = ball.pos.z - sign * 22;
        return this.setMode('shadow', bx, clamp(bz, -ARENA.L + 8, ARENA.L - 8), sim);
      }
      return this.planHit(ctx, 'attack');
    }

    if (role === 'defend') {
      const ballOwnHalf = (ball.pos.z - ownGoalZ) * sign < ARENA.L * 0.55;
      const gx = clamp(ball.pos.x * 0.35, -ARENA.GOAL_W + 4, ARENA.GOAL_W - 4);
      const gz = ownGoalZ + sign * (ballOwnHalf ? 10 : 30);
      return this.setMode('defend', gx, gz, sim);
    }

    // Soutien
    if (car.boost < 35 && cfg.boostUse > 0.5) {
      const pad = this.nearestPad(sim, sign);
      if (pad) return this.setMode('boost', pad.x, pad.z, sim);
    }
    const attackingThird = ball.pos.z * sign > ARENA.L * 0.35;
    if (cfg.pass && attackingThird && Math.abs(ball.pos.x) > ARENA.W * 0.35) {
      return this.setMode('support', -ball.pos.x * 0.15, sign * (ARENA.L - 30), sim);
    }
    const sx = clamp(-ball.pos.x * 0.4, -ARENA.W + 15, ARENA.W - 15);
    const sz = clamp(ball.pos.z - sign * 32, -ARENA.L + 12, ARENA.L - 12);
    return this.setMode('support', sx, sz, sim);
  }

  setMode(mode, x, z, sim, y = 0) {
    this.mode = mode;
    this.target.set(x, y, z);
    this.interceptTime = sim.time;
  }

  shouldShadow(ctx) {
    const { sim } = ctx;
    const car = this.car, ball = sim.ball;
    const sign = teamAttackSign(car.team);
    const mine = eta(car, ball.pos.x, ball.pos.z, true);
    let best = 99;
    for (const o of sim.cars) if (o.team !== car.team) best = Math.min(best, eta(o, ball.pos.x, ball.pos.z, true));
    const ballComing = ball.vel.z * sign < -10;
    const inOwnHalf = ball.pos.z * sign < 0;
    return best + 0.55 < mine && (ballComing || inOwnHalf) && car.pos.z * sign > ball.pos.z * sign - 30;
  }

  nearestPad(sim, sign) {
    let best = null, bd = 1e9;
    for (const p of sim.pads) {
      if (!p.active || !p.big) continue;
      if ((p.z - sim.ball.pos.z) * sign > 10) continue;
      const d = Math.hypot(p.x - this.car.pos.x, p.z - this.car.pos.z);
      if (d < bd && d < 80) { bd = d; best = p; }
    }
    return best;
  }

  planHit(ctx, mode) {
    const { sim, prediction } = ctx;
    const car = this.car, cfg = this.cfg;
    const sign = teamAttackSign(car.team);
    const R = sim.ball.radius;
    const canBoost = cfg.boostUse > 0.5;
    const maxH = cfg.aerial && car.boost > 30 ? cfg.maxAerialH : cfg.maxJumpH;
    if (this.rand() < 0.3) this.aimOffset = (this.rand() - 0.5) * 2 * cfg.aimErr;
    let found = false;
    const horizon = Math.min(cfg.horizon, prediction.horizon);
    for (let t = 0.05; t <= horizon; t += 1 / 20) {
      prediction.at(t, _p);
      if (_p.y > maxH) continue;
      this.computeHitDir(_p, sign, mode, sim);
      const back = R + car.half.z * 0.9;
      const ax = _p.x - this.hitDir.x * back, az = _p.z - this.hitDir.z * back;
      let e = eta(car, ax, az, canBoost);
      if (_p.y > 4) e += timeToHeight(_p.y - 2.5) * 0.6;
      if (e <= t) {
        this.ballTarget.set(_p.x, _p.y, _p.z);
        this.interceptTime = sim.time + t;
        found = true;
        break;
      }
    }
    if (!found) {
      prediction.at(Math.min(horizon, 1.2), _p);
      this.ballTarget.set(_p.x, Math.max(_p.y, R), _p.z);
      this.computeHitDir(_p, sign, mode, sim);
      this.interceptTime = sim.time + Math.min(horizon, 1.2);
    }
    this.mode = mode;
    // Du mauvais côté du ballon : on contourne avant de frapper.
    const ahead = (car.pos.z - this.ballTarget.z) * sign;
    this.rotating = this.rotating ? ahead > -4 : ahead > 3;
    if (this.rotating && mode === 'attack' && cfg.roles) {
      const side = Math.sign(car.pos.x - this.ballTarget.x) || 1;
      this.target.set(this.ballTarget.x + side * 9, 0, this.ballTarget.z - sign * 14);
      this.mode = 'rotate';
      return;
    }
    const back = R + car.half.z * 0.9;
    const dist = Math.hypot(this.ballTarget.x - car.pos.x, this.ballTarget.z - car.pos.z);
    // Point d'approche décalé : trajectoire courbe qui aligne la voiture avec la direction de tir.
    const extra = cfg.smart ? clamp(dist * 0.3, 0, 12) : 0;
    this.target.set(this.ballTarget.x - this.hitDir.x * (back + extra), 0, this.ballTarget.z - this.hitDir.z * (back + extra));
    this.target.x = clamp(this.target.x, -ARENA.W + 3, ARENA.W - 3);
    this.target.z = clamp(this.target.z, -ARENA.L - 6, ARENA.L + 6);

    // Déclenchement d'un aérien
    const t = this.interceptTime - sim.time;
    if (cfg.aerial && car.onGround && this.ballTarget.y > 11 && car.boost > 30 && t > 0.8 && t < 3.2
      && Math.abs(angleTo(car, this.ballTarget.x, this.ballTarget.z)) < 0.3
      && Math.hypot(this.ballTarget.x - car.pos.x, this.ballTarget.z - car.pos.z) / t < 42) {
      this.aerial = true;
      this.jumpT = 0;
      this.mode = 'aerial';
    }
  }

  computeHitDir(p, sign, mode, sim) {
    const goalZ = sign * (ARENA.L + 4);
    let ax = clamp(p.x * 0.5, -ARENA.GOAL_W + 5, ARENA.GOAL_W - 5) + this.aimOffset * ARENA.GOAL_W;
    let az = goalZ;
    if (mode === 'save') {
      // Dégagement vers le côté et vers l'avant
      ax = (Math.sign(p.x) || 1) * ARENA.W;
      az = p.z + sign * 40;
    } else if (this.cfg.pass && Math.abs(p.x) > ARENA.W * 0.45 && p.z * sign > ARENA.L * 0.5) {
      // Centre devant le but pour un coéquipier
      const mate = sim.cars.find((c) => c.team === this.car.team && c !== this.car && c.pos.z * sign > ARENA.L * 0.3);
      if (mate) { ax = 0; az = sign * (ARENA.L - 22); }
    }
    this.hitDir.set(ax - p.x, 0, az - p.z).normalize();
  }

  // ---------- Exécution au sol ----------
  ground(dt, ctx, f) {
    const { sim } = ctx;
    const car = this.car, cfg = this.cfg, ball = sim.ball;
    let tx = this.target.x, tz = this.target.z;
    let ang = angleTo(car, tx, tz);
    const dist = Math.hypot(tx - car.pos.x, tz - car.pos.z);
    const speed = car.vel.dot(car.fwd);
    const hitting = this.mode === 'attack' || this.mode === 'save' || this.mode === 'kickoff';

    // Vitesse souhaitée
    let desired = 60;
    if (hitting && this.mode !== 'kickoff') {
      const remaining = Math.max(0.05, this.interceptTime - sim.time);
      desired = dist / remaining + 6;
      if (dist < 12) desired = Math.max(desired, 30);
    } else if (this.mode === 'defend' || this.mode === 'support' || this.mode === 'shadow') {
      desired = dist < 4 ? 0 : clamp(dist * 1.6, 8, 60);
    }
    desired = Math.min(desired, cfg.throttle < 1 ? 34 : 70);

    // Poussée directe : balle proche, devant, et frappe dans la bonne direction
    const bdx0 = ball.pos.x - car.pos.x, bdz0 = ball.pos.z - car.pos.z;
    const bd0 = Math.hypot(bdx0, bdz0);
    if (hitting && bd0 < 14 && ball.pos.y < 5 && (bdx0 * this.hitDir.x + bdz0 * this.hitDir.z) / bd0 > 0.25) {
      tx = ball.pos.x - this.hitDir.x * 1.2; tz = ball.pos.z - this.hitDir.z * 1.2;
      ang = angleTo(car, tx, tz);
      desired = Math.max(desired, 36);
    }
    // Ralentir quand la cible est très en biais : rayon de braquage plus court, pas d'orbite
    if (Math.abs(ang) > 0.5 && dist < 35) desired = Math.min(desired, Math.max(12, 42 - 22 * (Math.abs(ang) - 0.5)));

    f.steer = clamp(ang * 3.2, -1, 1);
    if (desired < 1 && dist < 4) {
      // Arrivé : s'oriente vers le ballon
      const ab = angleTo(car, ball.pos.x, ball.pos.z);
      f.steer = clamp(ab * 3, -1, 1);
      f.throttle = Math.abs(ab) > 0.4 ? 0.5 : (speed > 2 ? -0.4 : 0);
    } else if (speed < desired - 2) f.throttle = cfg.throttle;
    else if (speed > desired + 6) f.throttle = -0.6;
    else f.throttle = 0.25;
    if (Math.abs(ang) > 1.9 && speed > 22) f.throttle = 0; // serrer le virage

    const wantsSpeed = desired > 44 || this.mode === 'kickoff';
    if (car.boost > 0 && Math.abs(ang) < 0.3 && speed < desired - 6 && wantsSpeed && this.rand() < cfg.boostUse) f.boost = true;

    // Anti-blocage
    if (this.reverseT > 0) {
      this.reverseT -= dt;
      f.throttle = -1; f.steer = -f.steer; f.boost = false;
      return;
    }
    if (f.throttle > 0.5 && Math.abs(speed) < 2) {
      this.stuckT += dt;
      if (this.stuckT > 0.9) { this.reverseT = 0.7; this.stuckT = 0; }
    } else this.stuckT = 0;

    // Dash / saut vers le ballon
    const bdx = ball.pos.x - car.pos.x, bdz = ball.pos.z - car.pos.z;
    const bdist = Math.hypot(bdx, bdz);
    const bang = Math.abs(angleTo(car, ball.pos.x, ball.pos.z));
    if (this.mode === 'kickoff' && cfg.kickoffDash && bdist < 11 && bang < 0.3) f.dash = true;
    if (hitting && cfg.dash && bdist < ball.radius + car.half.z + 3.5 && ball.pos.y < 4.5 && bang < 0.35 && speed > 15) f.dash = true;
    if (hitting && cfg.jumps && this.jumpT < 0) {
      const h = this.ballTarget.y - 2.2 - car.pos.y;
      const remaining = this.interceptTime - sim.time;
      if (this.ballTarget.y > 4.8 && this.ballTarget.y < cfg.maxJumpH + 2.5 && h > 0.5 && remaining > 0 && remaining <= timeToHeight(h) + 0.04 && bang < 0.6) {
        this.jumpT = 0;
        this.jumpDouble = h > 6.3;
      }
    }
    if (this.jumpT === 0 || this.aerial) this.air(dt, ctx, f);
  }

  // ---------- Exécution en l'air ----------
  air(dt, ctx, f) {
    const { sim, prediction } = ctx;
    const car = this.car;
    if (this.jumpT >= 0) {
      // Séquence de saut (maintien, double saut éventuel)
      this.jumpT += dt;
      f.jump = this.jumpT < 0.21 || (this.jumpDouble && this.jumpT > 0.27 && this.jumpT < 0.33);
      if (this.aerial && this.jumpT > 0.27 && this.jumpT < 0.33) f.jump = true;
      if (this.jumpT > 0.4 && !this.aerial) this.jumpT = -1;
      if (this.aerial && this.jumpT > 0.34) this.jumpT = -1;
      if (!this.aerial) { f.throttle = 1; return; }
    }

    if (this.aerial) {
      const T = this.interceptTime - sim.time;
      if (T < -0.25 || (car.onGround && this.jumpT < 0)) { this.aerial = false; this.mode = 'idle'; this.decisionT = 0; return; }
      const tt = Math.max(0.12, T);
      prediction.at(Math.max(0.02, T), _p);
      // Accélération nécessaire pour rejoindre la balle à temps (compense la gravité)
      _a.set(_p.x - car.pos.x, _p.y - car.pos.y, _p.z - car.pos.z)
        .addScaledVector(_v.copy(this.hitDir), -2.2)
        .addScaledVector(car.vel, -tt).multiplyScalar(2 / (tt * tt));
      _a.y += PHYS.GRAVITY;
      const need = _a.length();
      _f.copy(_a).normalize();
      orientInAir(car, _f, UP, f, 4, 0.7, 0.2);
      f.boost = car.fwd.dot(_f) > 0.8 && need > 6;
      f.jump = f.jump || false;
      return;
    }

    // Réception : roues vers le sol, avant dans le sens du déplacement
    _f.set(car.vel.x, 0, car.vel.z);
    if (_f.lengthSq() < 4) _f.set(car.fwd.x, 0, car.fwd.z);
    if (_f.lengthSq() < 0.01) _f.set(0, 0, 1);
    _f.normalize();
    orientInAir(car, _f, UP, f, 3, 0.65, 1);
    f.throttle = 1;
    // Balle proche en l'air : dash dedans (difficile+)
    const ball = sim.ball;
    if (this.cfg.dash && car.hasDodge && car.pos.distanceTo(ball.pos) < ball.radius + 3.2 && !car.dashing) {
      const a = angleTo(car, ball.pos.x, ball.pos.z);
      f.dash = true;
      f.pitch = Math.cos(a); f.steer = Math.sin(a);
    }
  }
}
