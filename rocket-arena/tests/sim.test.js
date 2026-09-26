// Headless sanity checks: runs bot matches and verifies the physics stays sane.
import { Match } from '../src/sim/match.js';
import { Bot } from '../src/ai/bot.js';
import { PHYS } from '../src/config.js';
import { sdArena } from '../src/sim/arena.js';

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
for (const [size, diff, secs] of [[1, 'allstar', 120], [2, 'pro', 120], [3, 'allstar', 120], [1, 'rookie', 90]]) {
  const t0 = Date.now();
  const r = runMatch(size, diff, secs);
  const ms = Date.now() - t0;
  console.log(`${size}v${size} ${diff}:`, JSON.stringify(r), `${ms}ms`);
  if (r.outside > 0) { console.error('  cars escaped the arena'); failed = true; }
  if (r.touches < 10) { console.error('  bots barely touched the ball'); failed = true; }
}
process.exit(failed ? 1 : 0);
