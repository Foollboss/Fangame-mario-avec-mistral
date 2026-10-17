// Test multijoueur réel : démarre le serveur Voxelia, connecte deux navigateurs (Chromium headless),
// vérifie l'arrivée des joueurs, la synchronisation d'un bloc posé, d'un coffre et du chat, puis
// l'apparence d'un autre joueur (armure, planeur, nage) vue par le second.
// Usage : node tools/build.mjs && node tools/multiplayer-test.mjs [dossier des captures]
import * as esbuild from 'esbuild';
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, mkdtemp, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const out = resolve(process.argv[2] ?? join(root, 'test-results', 'multiplayer'));
await mkdir(out, { recursive: true });

// Identifiants des blocs et objets, lus dans les registres du jeu (mêmes sources que dist/).
const reg = await esbuild.build({
  stdin: { contents: "export { B } from './src/world/blocks'; export { ITEM_BY_KEY } from './src/items/items';", resolveDir: root, loader: 'ts' },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  logLevel: 'silent',
});
const { B, ITEM_BY_KEY } = await import('data:text/javascript;base64,' + Buffer.from(reg.outputFiles[0].text).toString('base64'));
const ids = { water: B.water, glass: B.glass, stone: B.stone };
for (const k of ['diamond_helmet', 'diamond_chestplate', 'diamond_leggings', 'diamond_boots', 'glider']) ids[k] = ITEM_BY_KEY.get(k).id;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ttf': 'font/ttf' };
const web = createServer(async (req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = join(dist, p);
  if (!file.startsWith(dist) || !existsSync(file)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
  res.end(await readFile(file));
});
await new Promise((r) => web.listen(0, r));
const url = `http://localhost:${web.address().port}/`;

// Serveur de jeu sur un port libre, monde temporaire
const port = 20000 + Math.floor(Math.random() * 20000);
const worldDir = await mkdtemp(join(tmpdir(), 'voxelia-mp-'));
const srv = spawn(process.execPath, ['--experimental-strip-types', join(root, 'server/index.ts'), '--port', String(port), '--world-dir', worldDir, '--seed', '4242', '--invite', 'TEST', '--name', 'Serveur de test', '--cheats'], { stdio: ['pipe', 'pipe', 'pipe'] });
let srvLog = '';
srv.stdout.on('data', (d) => (srvLog += d));
srv.stderr.on('data', (d) => (srvLog += d));
await new Promise((r) => setTimeout(r, 2500));

const results = [];
let failed = 0;
const check = (name, ok, info = '') => {
  results.push(`${ok ? '✔' : '✘'} ${name}${info ? ' — ' + info : ''}`);
  if (!ok) failed++;
};

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

async function client(name) {
  const ctx = await browser.newContext({ viewport: { width: 640, height: 320 } });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url);
  await page.locator('.title-screen').waitFor({ timeout: 30000 });
  await page.evaluate((n) => {
    window.voxelia.settings.set('profileName', n);
    window.voxelia.settings.set('renderDistance', 3);
  }, name);
  await page.evaluate((p) => void window.voxelia.joinServer(`localhost:${p}`, 'TEST'), port);
  await page.waitForFunction(() => window.voxelia?.game?.ready === true && window.voxelia.ui.depth === 0, null, { timeout: 120000, polling: 500 });
  return { ctx, page, errors };
}

try {
  const a = await client('Alice');
  const b = await client('Bruno');
  check('deux joueurs connectés au serveur', true);
  await a.page.waitForTimeout(3000);
  const seen = await a.page.evaluate(() => window.voxelia.game.net.remotePlayers().map((p) => p.name));
  check('Alice voit Bruno', seen.includes('Bruno'), JSON.stringify(seen));

  // Bloc posé par Alice près de Bruno (même zone chargée chez les deux)
  const pos = await b.page.evaluate(() => {
    const p = window.voxelia.game.player;
    return [Math.floor(p.pos.x) + 2, Math.floor(p.pos.y) + 2, Math.floor(p.pos.z) + 2];
  });
  await a.page.evaluate(([x, y, z]) => {
    const g = window.voxelia.game;
    g.teleport(x + 1, y + 1, z + 1);
  }, pos);
  await a.page.waitForTimeout(2500);
  await a.page.evaluate(([x, y, z]) => {
    const g = window.voxelia.game;
    g.world.set(x, y, z, 87, 0, 'player'); // coffre
    g.world.setBlockEntity(x, y, z, { type: 'chest', items: [{ id: 1, count: 7 }, ...new Array(26).fill(null)] });
    g.net.sendBlockEntity(g.dimension, x, y, z, g.world.blockEntity(x, y, z));
    g.submitChat('Bonjour Bruno !');
  }, pos);
  await b.page.waitForTimeout(3000);
  const onB = await b.page.evaluate(([x, y, z]) => {
    const g = window.voxelia.game;
    const be = g.world.blockEntity(x, y, z);
    const chat = document.querySelector('.chat-log')?.textContent ?? '';
    return { id: g.world.id(x, y, z), items: be?.items?.[0]?.count ?? null, chat };
  }, pos);
  check('le bloc posé par Alice apparaît chez Bruno', onB.id === 87, JSON.stringify({ id: onB.id }));
  check('le contenu du coffre est synchronisé', onB.items === 7, String(onB.items));
  check('le message de chat arrive', /Bonjour Bruno/.test(onB.chat), onB.chat.slice(-80));

  // Bruno se reconnecte : le bloc doit toujours être là (persistance serveur)
  await b.page.evaluate(() => window.voxelia.quitToMenu());
  await b.page.locator('.title-screen').waitFor({ timeout: 60000 });
  await b.page.evaluate((p) => void window.voxelia.joinServer(`localhost:${p}`, 'TEST'), port);
  await b.page.waitForFunction(() => window.voxelia?.game?.ready === true && window.voxelia.ui.depth === 0, null, { timeout: 120000, polling: 500 });
  await b.page.waitForTimeout(2000);
  const again = await b.page.evaluate(([x, y, z]) => window.voxelia.game.world.id(x, y, z), pos);
  check('le bloc est conservé après reconnexion', again === 87, String(again));

  // ---------------------------------------------------------------- apparence d'Alice vue par Bruno
  /** Alice vue par Bruno : armure reçue, pose, couche d'équipement et posture de son modèle. */
  const aliceSeenByBruno = () =>
    b.page.evaluate(() => {
      const g = window.voxelia.game;
      const r = g.net.remotePlayers().find((p) => p.name === 'Alice');
      if (!r) return null;
      const v = g.entities.views.get(r.id);
      const pieces = [];
      v?.obj.traverse((o) => {
        if (!o.isMesh || !o.name.startsWith('equip:')) return;
        let vis = true;
        for (let q = o; q; q = q.parent) vis = vis && q.visible;
        if (vis) pieces.push(o.name.slice(6));
      });
      return { armor: r.wornArmor().slice(), pose: r.pose, pieces: pieces.sort(), tilt: v ? +v.model.root.rotation.x.toFixed(2) : null, wing: v?.wing ?? null };
    });
  /** Bruno se place au point donné et regarde vers le point visé (capture de ce qu'il voit). */
  const brunoLooksAt = (from, at) =>
    b.page.evaluate(
      ([f, t]) => {
        const g = window.voxelia.game;
        g.teleport(f[0], f[1], f[2]);
        const p = g.player;
        const dx = t[0] - f[0];
        const dy = t[1] - (f[1] + p.eyeHeight);
        const dz = t[2] - f[2];
        p.yaw = p.prevYaw = Math.atan2(-dx, -dz);
        p.pitch = Math.atan2(dy, Math.hypot(dx, dz));
        document.querySelectorAll('.chat-line').forEach((l) => l.remove());
      },
      [from, at],
    );
  const waitFor = async (fn, ok, ms = 6000) => {
    let v = await fn();
    for (let t = 0; t < ms && !ok(v); t += 250) {
      await b.page.waitForTimeout(250);
      v = await fn();
    }
    return v;
  };
  // Estrade de pierre au-dessus du terrain et bassin vitré (7 × 15, 5 de profondeur), construits
  // localement chez les deux joueurs (cause « remote » : rien n'est envoyé au serveur, dont la
  // limite de blocs par seconde refuserait un tel chantier).
  const spot = await b.page.evaluate(() => {
    const p = window.voxelia.game.player.pos;
    return [Math.floor(p.x), Math.floor(p.y) + 10, Math.floor(p.z)];
  });
  const build = ([s, ids]) => {
    const w = window.voxelia.game.world;
    const [x0, y0, z0] = s;
    for (let dx = -4; dx <= 4; dx++)
      for (let dz = -4; dz <= 4; dz++) {
        w.set(x0 + dx, y0 - 1, z0 + dz, ids.stone, 0, 'remote');
        for (let dy = 0; dy < 4; dy++) w.set(x0 + dx, y0 + dy, z0 + dz, 0, 0, 'remote');
      }
    for (let dx = -4; dx <= 4; dx++)
      for (let dz = -8; dz <= 8; dz++) {
        const wall = Math.abs(dx) === 4 || Math.abs(dz) === 8;
        w.set(x0 + 10 + dx, y0 - 7, z0 + dz, ids.stone, 0, 'remote');
        for (let dy = -6; dy <= -2; dy++) w.set(x0 + 10 + dx, y0 + dy, z0 + dz, wall ? ids.glass : ids.water, 0, 'remote');
        for (let dy = -1; dy < 4; dy++) w.set(x0 + 10 + dx, y0 + dy, z0 + dz, 0, 0, 'remote');
      }
  };
  await a.page.evaluate(build, [spot, ids]);
  await b.page.evaluate(build, [spot, ids]);
  await a.page.evaluate(
    ([s, ids]) => {
      const g = window.voxelia.game;
      g.teleport(s[0] + 0.5, s[1], s[2] + 0.5);
      const p = g.player;
      p.yaw = p.prevYaw = 0;
      p.pitch = 0;
      // Armure complète en diamant
      p.inventory.armor.slots = ['diamond_helmet', 'diamond_chestplate', 'diamond_leggings', 'diamond_boots'].map((k) => ({ id: ids[k], count: 1 }));
      p.inventory.changed();
    },
    [spot, ids],
  );
  await brunoLooksAt([spot[0] + 0.5, spot[1], spot[2] - 3.5], [spot[0] + 0.5, spot[1] + 1, spot[2] + 0.5]);
  const dressed = await waitFor(aliceSeenByBruno, (v) => v && v.armor.join() === 'diamond,diamond,diamond,diamond' && v.pieces.length >= 9);
  check('Bruno reçoit l’armure d’Alice', dressed?.armor.join() === 'diamond,diamond,diamond,diamond', JSON.stringify(dressed?.armor));
  check('l’armure d’Alice est dessinée chez Bruno', ['body', 'boot', 'helmet', 'leg', 'sleeve', 'belt'].every((k) => dressed?.pieces.includes(k)), JSON.stringify(dressed?.pieces));
  await b.page.waitForTimeout(800);
  await b.page.screenshot({ path: join(out, 'bruno-voit-alice-armure.png') });
  // Le planeur remplace le plastron
  await a.page.evaluate((ids) => {
    const p = window.voxelia.game.player;
    p.inventory.armor.set(1, { id: ids.glider, count: 1 });
    p.yaw = p.prevYaw = Math.PI;
  }, ids);
  const winged = await waitFor(aliceSeenByBruno, (v) => v && v.armor[1] === 'glider');
  check('Bruno voit le planeur d’Alice (ailes repliées)', winged?.armor.join() === 'diamond,glider,diamond,diamond' && winged.pieces.includes('wingR') && winged.pieces.includes('wingL') && !winged.pieces.includes('body') && winged.wing === 0, JSON.stringify(winged));
  await b.page.waitForTimeout(800);
  await b.page.screenshot({ path: join(out, 'bruno-voit-alice-planeur.png') });
  // Alice nage (sprint sous l'eau) : Bruno reçoit la pose et voit le corps à l'horizontale
  await a.page.evaluate((s) => {
    const g = window.voxelia.game;
    g.teleport(s[0] + 8.5, s[1] - 5, s[2] + 6.5);
    g.player.yaw = g.player.prevYaw = 0;
    g.player.pitch = 0.05;
    Object.assign(window.voxelia.input.touch, { moveZ: 1, sprint: true });
  }, spot);
  // Bruno, debout au fond du bassin contre la paroi est, regarde passer Alice
  await brunoLooksAt([spot[0] + 13.5, spot[1] - 6, spot[2] + 2.5], [spot[0] + 8.5, spot[1] - 5.4, spot[2] + 3]);
  let swimA = '';
  for (let t = 0; t < 4000 && swimA !== 'swim'; t += 200) {
    await a.page.waitForTimeout(200);
    swimA = await a.page.evaluate(() => window.voxelia.game.player.pose);
  }
  const swimB = await waitFor(aliceSeenByBruno, (v) => v && v.pose === 'swim' && v.tilt < -1.2, 4000);
  check('Alice nage', swimA === 'swim', swimA);
  check('Bruno reçoit la pose « swim » d’Alice et la voit à l’horizontale', swimB?.pose === 'swim' && swimB.tilt < -1.2, JSON.stringify(swimB));
  await b.page.screenshot({ path: join(out, 'bruno-voit-alice-nager.png') });
  await a.page.evaluate(() => Object.assign(window.voxelia.input.touch, { moveZ: 0, sprint: false }));
  check('aucune erreur JavaScript', a.errors.length + b.errors.length === 0, [...a.errors, ...b.errors].slice(0, 3).join(' | '));
} catch (e) {
  check('scénario complet', false, String(e?.message ?? e).split('\n')[0]);
  console.log(srvLog.split('\n').slice(-15).join('\n'));
} finally {
  await browser.close();
  web.close();
  srv.kill('SIGTERM');
  await new Promise((r) => setTimeout(r, 1500));
  await rm(worldDir, { recursive: true, force: true });
}
console.log(results.join('\n'));
console.log(failed ? `\n${failed} échec(s)` : '\nTous les contrôles sont passés.');
process.exit(failed ? 1 : 0);
