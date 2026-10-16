// Test multijoueur réel : démarre le serveur Voxelia, connecte deux navigateurs (Chromium headless),
// vérifie l'arrivée des joueurs, la synchronisation d'un bloc posé, d'un coffre et du chat.
// Usage : node tools/build.mjs && node tools/multiplayer-test.mjs
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
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
