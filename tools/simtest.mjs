// Headless checks: arena containment, physics sanity and full bot-vs-bot matches.
// Usage: node tools/simtest.mjs [--quick]
import { World } from '../src/game/World.js';
import { BallPredictor } from '../src/game/BallPredictor.js';
import { MatchManager } from '../src/game/MatchManager.js';
import { ReplaySystem } from '../src/game/ReplaySystem.js';
import { BotAI, TeamBrain } from '../src/ai/BotAI.js';
import { createRng } from '../src/core/MathUtil.js';
import { ARENA, BALL } from '../src/core/Config.js';
import { VEHICLES } from '../src/game/Vehicles.js';
import { ITEMS, rewardsForLevel } from '../src/meta/Catalog.js';
import { levelFromXp, xpForNext } from '../src/meta/ProgressionSystem.js';

const quick = process.argv.includes('--quick');
let failures = 0;
const check = (cond, msg) => {
  if (!cond) {
    failures++;
    console.error('  FAIL:', msg);
  }
};

function inside(p, margin = 0.5) {
  const a = ARENA;
  const lim = a.halfLength + a.goalDepth + margin;
  return Math.abs(p.x) <= a.halfWidth + margin && Math.abs(p.z) <= lim && p.y >= -margin && p.y <= a.height + margin
    && Number.isFinite(p.x + p.y + p.z);
}

// 1. Ball containment: fire the ball in many directions at max speed.
function testContainment() {
  console.log('• Ball containment');
  const rng = createRng(7);
  const w = new World({ seed: 1 });
  let escapes = 0;
  for (let n = 0; n < 400; n++) {
    w.ball.reset((rng() - 0.5) * 80, 3 + rng() * 30, (rng() - 0.5) * 130);
    const th = rng() * Math.PI * 2, ph = (rng() - 0.3) * Math.PI;
    w.ball.vel.set(Math.cos(th) * Math.cos(ph), Math.sin(ph), Math.sin(th) * Math.cos(ph)).multiplyScalar(110);
    for (let i = 0; i < 600; i++) {
      w.ball.step(1 / 120);
      if (!inside(w.ball.pos, 0.05)) { escapes++; break; }
    }
  }
  check(escapes === 0, `ball escaped the arena ${escapes} times`);
}

// 2. Ball resting on the floor settles and a ball dropped into the goal counts.
function testBallSettles() {
  console.log('• Ball settling / goal line');
  const w = new World({ seed: 2 });
  w.ball.reset(0, 20, 0);
  for (let i = 0; i < 120 * 8; i++) w.ball.step(1 / 120);
  check(Math.abs(w.ball.pos.y - BALL.radius) < 0.05, `ball did not settle (y=${w.ball.pos.y.toFixed(2)})`);
  check(w.ball.vel.length() < 0.5, `ball still moving ${w.ball.vel.length().toFixed(2)}`);
  w.ball.reset(0, 5, 60);
  w.ball.vel.set(0, 0, 40);
  let crossed = false;
  for (let i = 0; i < 240; i++) {
    w.ball.step(1 / 120);
    if (w.ball.pos.z > ARENA.halfLength + BALL.radius) crossed = true;
  }
  check(crossed, 'ball shot straight at the goal never crossed the line');
  check(w.ball.pos.z < ARENA.halfLength + ARENA.goalDepth, 'ball went through the back of the goal');
}

// 3. Car drives, turns, jumps, lands, boosts and stays in the arena.
function testCar() {
  console.log('• Car handling');
  const w = new World({ seed: 3 });
  const car = w.addCar({ team: 0, name: 'T', vehicleId: 'pulse' });
  car.physics.place(0, -40, 0);
  const inp = { steer: 0, pitch: 0, throttle: 1, jump: false, boost: false, dash: false, dodgeX: 0, dodgeY: 0 };
  for (let i = 0; i < 360; i++) w.step(1 / 120, [inp]);
  const v = car.physics.forwardSpeed;
  check(v > 30 && v <= 37, `throttle top speed unexpected: ${v.toFixed(1)}`);
  inp.boost = true;
  car.boost = 100;
  car.physics.place(0, -60, 0);
  for (let i = 0; i < 300; i++) w.step(1 / 120, [inp]);
  check(car.physics.forwardSpeed > 52, `boost did not reach supersonic: ${car.physics.forwardSpeed.toFixed(1)}`);
  check(car.boost < 100, 'boost not consumed');
  // jump
  inp.boost = false; inp.throttle = 0;
  car.physics.place(0, 0, 0);
  inp.jump = true;
  let maxY = 0;
  for (let i = 0; i < 240; i++) {
    w.step(1 / 120, [inp]);
    maxY = Math.max(maxY, car.physics.pos.y);
    if (i === 30) inp.jump = false;
    if (i === 45) inp.jump = true; // double jump
    if (i === 50) inp.jump = false;
  }
  check(maxY > 6 && maxY < 14, `double jump apex unexpected: ${maxY.toFixed(2)}`);
  check(car.physics.grounded, 'car did not land after jump');
  // dodge
  car.physics.place(0, 0, 0);
  inp.dash = true; inp.dodgeY = 1;
  w.step(1 / 120, [inp]);
  inp.dash = false;
  let landed = false;
  for (let i = 0; i < 240; i++) {
    w.step(1 / 120, [inp]);
    if (car.physics.grounded) { landed = true; break; }
  }
  check(landed, 'car did not land after a ground dash');
  check(car.physics.pos.z > 5, 'dash did not move the car forward');
  // wall
  car.physics.place(0, 0, Math.PI / 2);
  inp.throttle = 1; inp.boost = true; car.boost = 100;
  for (let i = 0; i < 600; i++) w.step(1 / 120, [inp]);
  check(inside(car.physics.pos), 'car left the arena through a wall');
}

// 4. Car hits the ball forward.
function testHit() {
  console.log('• Car → ball hit');
  const w = new World({ seed: 4 });
  const car = w.addCar({ team: 0, name: 'T', vehicleId: 'pulse' });
  car.physics.place(0, -30, 0);
  w.ball.reset(0, BALL.radius, 0);
  const inp = { steer: 0, pitch: 0, throttle: 1, jump: false, boost: true, dash: false, dodgeX: 0, dodgeY: 0 };
  car.boost = 100;
  let touched = false;
  w.events.on('ballTouch', () => (touched = true));
  for (let i = 0; i < 240; i++) w.step(1 / 120, [inp]);
  check(touched, 'car never touched the ball');
  check(w.ball.vel.z > 40 || w.ball.pos.z > 30, `weak hit: ball vz=${w.ball.vel.z.toFixed(1)}`);
}

function runMatch({ size, diffs, duration, seed, verbose }) {
  const rng = createRng(seed);
  const world = new World({ seed });
  for (const team of [0, 1]) {
    for (let i = 0; i < size; i++) {
      world.addCar({ team, name: `B${team}${i}`, isBot: true, vehicleId: VEHICLES[Math.floor(rng() * VEHICLES.length)].id });
    }
  }
  const predictor = new BallPredictor(world.arena);
  const replay = new ReplaySystem(world);
  const match = new MatchManager({ world, predictor, replay, duration, replaysEnabled: true });
  const brains = [new TeamBrain(world, 0), new TeamBrain(world, 1)];
  const bots = world.cars.map((c) => new BotAI(c, world, diffs[c.team], rng));
  let touches = 0, demos = 0, stuckTicks = 0, escapes = 0;
  world.events.on('ballTouch', () => touches++);
  world.events.on('demolish', () => demos++);
  match.start();
  const dt = 1 / 120;
  const inputs = [];
  const maxTicks = (duration + 240) * 120;
  let tick = 0;
  const t0 = performance.now();
  while (match.state !== 'ended' && tick < maxTicks) {
    tick++;
    match.update(dt);
    if (match.state === 'replay') {
      match.skipReplay();
      continue;
    }
    if (!match.simRunning) continue;
    const sdt = dt * match.timeScale;
    if (tick % 4 === 0) predictor.update(world.ball);
    const kickoff = match.state === 'countdown' || (match.state === 'playing' && world.touchHistory.length === 0);
    for (const b of brains) b.update(sdt, predictor, kickoff);
    for (let i = 0; i < bots.length; i++) {
      inputs[i] = bots[i].update(sdt, { predictor, brain: brains[bots[i].car.team], oppBrain: brains[1 - bots[i].car.team], kickoff });
    }
    world.step(sdt, inputs);
    match.simStep(sdt);
    for (const c of world.cars) {
      if (!c.demolished && !inside(c.physics.pos, 1)) escapes++;
      if (!c.demolished && c.physics.grounded && c.physics.vel.length() < 1 && match.state === 'playing') stuckTicks++;
    }
    if (!inside(world.ball.pos, 0.1)) escapes++;
  }
  const ms = performance.now() - t0;
  const r = match.result;
  const stuckPct = (stuckTicks / Math.max(1, tick * world.cars.length)) * 100;
  if (verbose) {
    console.log(`  ${size}v${size} ${diffs[0]} vs ${diffs[1]}: ${r ? r.score.join('-') : 'no result'}${r?.overtime ? ' (prol.)' : ''} | touches ${touches} demos ${demos} | idle ${stuckPct.toFixed(1)}% | ${(ms / 1000).toFixed(1)}s cpu`);
    if (r) {
      const line = world.cars.map((c) => `${c.name}:${c.stats.goals}g/${c.stats.saves}s/${c.stats.shots}sh`).join(' ');
      console.log('   ', line);
    }
  }
  check(!!r, 'match did not end');
  check(escapes === 0, `objects escaped the arena ${escapes} ticks`);
  check(touches > 20, `too few ball touches (${touches})`);
  return { r, touches, stuckPct };
}

function testProgression() {
  console.log('• Progression (50 niveaux)');
  for (let l = 2; l <= 50; l++) check(rewardsForLevel(l).length > 0, `level ${l} has no reward`);
  const ids = new Set();
  for (const it of ITEMS) {
    check(!ids.has(it.id), `duplicate item id ${it.id}`);
    ids.add(it.id);
  }
  let total = 0;
  for (let l = 1; l < 50; l++) total += xpForNext(l);
  check(levelFromXp(total).level === 50, 'max XP does not reach level 50');
  check(levelFromXp(total - 1).level === 49, 'level curve off by one');
}

testProgression();
testContainment();
testBallSettles();
testCar();
testHit();

console.log('• Bot matches');
const runs = quick
  ? [{ size: 3, diffs: ['medium', 'medium'], duration: 90, seed: 11 }]
  : [
      { size: 1, diffs: ['expert', 'easy'], duration: 180, seed: 21 },
      { size: 3, diffs: ['medium', 'medium'], duration: 300, seed: 22 },
      { size: 3, diffs: ['hard', 'easy'], duration: 180, seed: 23 },
      { size: 4, diffs: ['expert', 'hard'], duration: 180, seed: 24 },
    ];
const totals = [0, 0];
for (const run of runs) {
  const { r } = runMatch({ ...run, verbose: true });
  if (r && run.diffs[0] !== run.diffs[1]) totals[r.winner === 0 ? 0 : 1]++;
}
if (!quick) check(totals[0] >= 2, 'stronger bots should win most uneven matches');

if (failures) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll checks passed');
