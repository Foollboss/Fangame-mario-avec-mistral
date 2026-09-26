// Tests de simulation sans rendu : physique, boucle de match complète, IA, sérialisation.
import assert from 'node:assert/strict';
import { MatchManager } from '../src/sim/MatchManager.js';
import { Simulation } from '../src/sim/Simulation.js';
import { Car } from '../src/sim/Car.js';
import { InputFrame } from '../src/sim/InputFrame.js';
import { LoopbackTransport, encodeInput, decodeInput } from '../src/net/NetworkTransport.js';
import { Snapshot } from '../src/net/Snapshot.js';

const results = [];
function test(name, fn) {
  const t0 = Date.now();
  try { fn(); results.push([name, 'OK', Date.now() - t0]); }
  catch (e) { results.push([name, 'FAIL', Date.now() - t0]); console.error(name, e); process.exitCode = 1; }
}

function runMatch(opts, maxSeconds = 400) {
  const m = new MatchManager({ spectator: true, replays: true, seed: 7, ...opts });
  let goals = 0, touches = 0, maxBallSpeed = 0;
  m.events.on('goal', () => goals++);
  m.events.on('ballTouch', () => touches++);
  const dt = 1 / 30;
  let t = 0;
  while (m.phase !== 'ended' && t < maxSeconds) {
    m.update(dt);
    if (m.phase === 'replay') m.skipReplay();
    t += dt;
    for (const c of m.sim.cars) {
      assert.ok(Number.isFinite(c.pos.x + c.pos.y + c.pos.z), 'position voiture finie');
      assert.ok(m.sim.arena.distanceV(c.pos) > -3, `voiture hors arène ${c.pos.toArray()}`);
    }
    assert.ok(m.sim.arena.distanceV(m.sim.ball.pos) > -1, 'balle hors arène');
    maxBallSpeed = Math.max(maxBallSpeed, m.sim.ball.vel.length());
  }
  return { m, goals, touches, t, maxBallSpeed };
}

test('conduite, saut et montée au mur', () => {
  const sim = new Simulation();
  const car = sim.addCar(new Car({ id: 0, team: 0 }));
  sim.placeCar(car, 0, 0, 100, 0);
  const inp = new InputFrame();
  inp.throttle = 1; inp.boost = true;
  for (let i = 0; i < 300; i++) sim.step(1 / 120, [inp]);
  assert.ok(car.pos.y > 10 && car.onGround, 'la voiture roule sur le mur');
  sim.placeCar(car, 0, 0, 0, 10);
  const j = new InputFrame(); j.jump = true;
  let maxY = 0;
  for (let i = 0; i < 120; i++) { sim.step(1 / 120, [j]); maxY = Math.max(maxY, car.pos.y); }
  assert.ok(maxY > 6, 'saut maintenu');
});

test('dash aérien', () => {
  const sim = new Simulation();
  const car = sim.addCar(new Car({ id: 0, team: 0 }));
  sim.placeCar(car, 0, 0, 0, 10);
  const f = new InputFrame(); f.dash = true;
  sim.step(1 / 120, [f]);
  for (let i = 0; i < 30; i++) sim.step(1 / 120, [new InputFrame()]);
  assert.ok(car.vel.z > 12, 'le dash propulse vers l\'avant');
});

for (const difficulty of ['easy', 'medium', 'hard', 'expert']) {
  test(`match 3v3 bots (${difficulty})`, () => {
    const { m, goals, touches, t } = runMatch({ mode: 'quick', teamSize: 3, difficulty, duration: 120 });
    assert.equal(m.phase, 'ended', `match terminé (phase ${m.phase})`);
    assert.ok(touches > 20, `touches: ${touches}`);
    console.log(`  ${difficulty}: score ${m.result.score.join('-')} buts=${goals} touches=${touches} durée=${t.toFixed(0)}s ot=${m.result.overtime}`);
  });
}

test('duel 1v1 et chaos 4v4', () => {
  const a = runMatch({ mode: 'duel', teamSize: 1, difficulty: 'hard', duration: 90 });
  assert.equal(a.m.phase, 'ended');
  const b = runMatch({ mode: 'chaos', teamSize: 4, difficulty: 'medium', duration: 90 });
  assert.equal(b.m.phase, 'ended');
  console.log(`  duel ${a.m.result.score.join('-')} | chaos ${b.m.result.score.join('-')}`);
});

test('entraînement : exercices', () => {
  for (const drill of ['free', 'shots', 'aerials', 'dribble', 'saves']) {
    const m = new MatchManager({ mode: 'training', drill, seed: 3, player: { name: 'T', vehicleId: 'pulse' } });
    m.setHumanInput(new InputFrame());
    for (let i = 0; i < 30 * 20; i++) m.update(1 / 30);
    assert.equal(m.phase === 'playing' || m.phase === 'goal', true);
  }
});

test('InputFrame encode/decode', () => {
  const f = new InputFrame(); f.throttle = 1; f.steer = -0.5; f.jump = true; f.dash = true;
  const view = new DataView(new ArrayBuffer(8));
  f.encode(view, 0);
  const g = new InputFrame(); g.decode(view, 0);
  assert.equal(g.jump, true); assert.equal(g.boost, false); assert.ok(Math.abs(g.steer + 0.5) < 0.01);
});

test('déterminisme : même graine = même match (pré-requis réseau)', () => {
  const run = () => {
    const m = new MatchManager({ spectator: true, seed: 42, mode: 'quick', teamSize: 2, difficulty: 'hard', duration: 60, replays: false });
    for (let i = 0; i < 30 * 40; i++) m.update(1 / 30);
    return [m.sim.ball.pos.x, m.sim.ball.pos.z, ...m.sim.cars.map((c) => c.pos.x)].join(',');
  };
  assert.equal(run(), run());
});

test('réseau local : entrées transmises et simulation identique', () => {
  // Deux simulations (« serveur » et « client ») pilotées par les mêmes entrées transitant par le transport
  const make = () => { const s = new Simulation(5); const c = s.addCar(new Car({ id: 0, team: 0 })); s.placeCar(c, 0, -30, 0, 0); return s; };
  const server = make(), client = make();
  const net = new LoopbackTransport(3);
  const received = [];
  net.onMessage((buf) => { const f = new InputFrame(); const h = decodeInput(buf, f); received.push({ h, f }); });
  for (let t = 0; t < 400; t++) {
    const f = new InputFrame();
    f.throttle = 1; f.steer = Math.sin(t / 40); f.boost = t % 90 < 30; f.jump = t % 150 < 10;
    net.send(encodeInput(t, 0, f));
    client.step(1 / 120, [f]);
    net.pump();
    while (received.length) { const r = received.shift(); server.step(1 / 120, [r.f]); }
  }
  for (let i = 0; i < 3; i++) { net.pump(); while (received.length) server.step(1 / 120, [received.shift().f]); }
  const a = new Float32Array(Snapshot.size(1)), b = new Float32Array(Snapshot.size(1));
  Snapshot.write(server, a); Snapshot.write(client, b);
  // Quantification des entrées sur 8 bits : écart minime attendu
  assert.ok(Math.hypot(a[8] - b[8], a[10] - b[10]) < 2.5, `écart ${a[8] - b[8]}, ${a[10] - b[10]}`);
});

for (const [n, s, ms] of results) console.log(`${s.padEnd(4)} ${n} (${ms} ms)`);
