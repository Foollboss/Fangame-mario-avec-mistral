// Headless sanity checks: runs bot matches and verifies the physics stays sane.
import { Match } from '../src/sim/match.js';
import { Bot } from '../src/ai/bot.js';
import { PHYS } from '../src/config.js';
import { sdArena } from '../src/sim/arena.js';
import { AirAssist } from '../src/input/airAssist.js';
import { emptyControls } from '../src/sim/car.js';

function runMatch(teamSize, difficulty, seconds) {
  const players = [];
  for (let t = 0; t < 2; t++) for (let i = 0; i < teamSize; i++) {
    players.push({ team: t, name: `B${t}${i}`, isBot: true, body: ['octane', 'dominus', 'merc', 'breakout'][i % 4] });
  }
  const match = new Match({ players, duration: seconds, replays: false });
  const bots = match.cars.map((c) => new Bot(c, difficulty));
  const dt = PHYS.dt;
  let ticks = 0;
  let maxBallSpeed = 0;
  let outside = 0;
  let touches = 0;
  let demos = 0;
  let aerialTicks = 0;
  const limit = (seconds + 120) / dt;
  while (match.state !== 'ended' && ticks < limit) {
    for (const b of bots) b.update(dt, match);
    match.tick(dt);
    for (const e of match.events) {
      if (e.type === 'hit') touches++;
      if (e.type === 'demo') demos++;
    }
    match.events.length = 0;
    ticks++;
    const bp = match.ball.pos;
    if (!Number.isFinite(bp.x + bp.y + bp.z)) throw new Error('ball NaN');
    maxBallSpeed = Math.max(maxBallSpeed, match.ball.vel.length());
    for (const c of match.cars) {
      if (!Number.isFinite(c.pos.x + c.pos.y + c.pos.z + c.quat.w)) throw new Error('car NaN');
      if (!c.demolished && sdArena(c.pos.x, c.pos.y, c.pos.z) > 0.3) outside++;
      if (!c.onGround && c.pos.y > 4) aerialTicks++;
    }
  }
  return { score: match.score.slice(), state: match.state, simSeconds: ticks * dt, maxBallSpeed, outside, touches, demos, aerialTicks,
    stats: match.cars.map((c) => `${c.name}:${c.stats.score}`).join(' ') };
}

let failed = false;
function check(label, value, min, max) {
  const ok = value >= min && value <= max;
  console.log(`${ok ? 'ok  ' : 'FAIL'} ${label}: ${value.toFixed(2)} (attendu ${min}..${max})`);
  if (!ok) failed = true;
}

function freeplay() {
  const m = new Match({ players: [{ team: 0, name: 'P' }], freeplay: true });
  m.cars[0].placeAt(10, -20, 0, 1);
  return m;
}

// Physics calibration against Rocket League reference values.
{
  const m = freeplay();
  const car = m.cars[0];
  for (let i = 0; i < 30; i++) m.tick(PHYS.dt);
  let maxY = 0;
  for (let i = 0; i < 240; i++) { car.controls.jump = i < 30; m.tick(PHYS.dt); maxY = Math.max(maxY, car.pos.y); }
  check('saut simple (hauteur max du centre)', maxY, 2.3, 2.9);
  car.placeAt(10, -20, 0, 1);
  for (let i = 0; i < 30; i++) m.tick(PHYS.dt);
  maxY = 0;
  for (let i = 0; i < 300; i++) { car.controls.jump = i < 24 || (i > 28 && i < 32); m.tick(PHYS.dt); maxY = Math.max(maxY, car.pos.y); }
  check('double saut', maxY, 4.5, 5.6);
}
{
  const m = freeplay();
  const car = m.cars[0];
  car.vel.set(0, 0, 14);
  const v0 = car.vel.length();
  for (let i = 0; i < 200; i++) {
    car.controls.throttle = 1;
    car.controls.jump = i < 8 || (i > 12 && i < 16);
    car.controls.pitch = i > 12 && i < 20 ? 1 : 0;
    m.tick(PHYS.dt);
  }
  check('gain de vitesse du flip avant', car.vel.length() - v0, 4, 6);
  check('atterrit sur les roues après un flip', car.onGround ? 1 : 0, 1, 1);
}
for (const [speed, min, max] of [[14, 17, 23], [23, 27, 36]]) {
  const m = freeplay();
  const car = m.cars[0];
  car.placeAt(0, -10, 0, 1);
  car.vel.set(0, 0, speed);
  m.ball.reset(0, PHYS.ballRadius, 0);
  let maxB = 0;
  for (let i = 0; i < 120; i++) { car.controls.throttle = 1; car.controls.boost = speed > 14; m.tick(PHYS.dt); maxB = Math.max(maxB, m.ball.vel.length()); }
  check(`vitesse de balle après une frappe à ${speed} u/s`, maxB, min, max);
}
{
  const m = freeplay();
  const car = m.cars[0];
  car.placeAt(20, 0, 1, 0.15);
  car.boost = 100;
  let maxY = 0;
  for (let i = 0; i < 480; i++) { car.controls.throttle = 1; car.controls.boost = i < 200; car.controls.steer = i > 150 ? -0.3 : 0; m.tick(PHYS.dt); maxY = Math.max(maxY, car.pos.y); }
  check('monte sur le mur latéral (hauteur atteinte)', maxY, 8, 21);
}

// Wall and ceiling driving: up the side wall, then along the ceiling.
for (const [grip, min, max] of [['arcade', 2, 10], ['real', 0, 1]]) {
  const m = new Match({ players: [{ team: 0, name: 'P' }], freeplay: true, wallGrip: grip });
  const car = m.cars[0];
  car.placeAt(10, 20, 1, 0);
  let ceiling = 0;
  for (let i = 0; i < 900; i++) {
    car.controls.throttle = 1;
    car.controls.boost = true;
    car.boost = 100;
    m.tick(PHYS.dt);
    if (car.onGround && car.groundNormal.y < -0.9) ceiling += PHYS.dt;
  }
  check(`temps passé à rouler au plafond (${grip})`, ceiling, min, max);
}

// Assisted flight: jump, hold boost and push the stick up.
{
  const m = freeplay();
  const car = m.cars[0];
  car.boost = 100;
  const assist = new AirAssist();
  let maxY = 0;
  for (let i = 0; i < 540; i++) {
    const c = car.controls;
    Object.assign(c, emptyControls());
    c.jump = i < 20;
    c.up = i > 25 ? 1 : 0;
    c.pitch = c.up;
    c.boost = i > 25;
    assist.apply(car, c, PHYS.dt);
    m.tick(PHYS.dt);
    maxY = Math.max(maxY, car.pos.y);
  }
  check('vol assisté au boost (altitude atteinte)', maxY, 12, 21);
}

for (const [size, diff, secs] of [[1, 'allstar', 120], [2, 'pro', 120], [3, 'allstar', 120], [1, 'rookie', 90]]) {
  const t0 = Date.now();
  const r = runMatch(size, diff, secs);
  const ms = Date.now() - t0;
  console.log(`${size}v${size} ${diff}:`, JSON.stringify(r), `${ms}ms`);
  if (r.outside > 0) { console.error('  cars escaped the arena'); failed = true; }
  if (r.touches < 10) { console.error('  bots barely touched the ball'); failed = true; }
}
process.exit(failed ? 1 : 0);
