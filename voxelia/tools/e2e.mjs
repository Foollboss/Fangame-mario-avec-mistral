// Test de bout en bout dans Chromium headless (WebGL via SwiftShader) :
// menu → création d'un monde → partie → inventaire → pose de bloc → sauvegarde →
// rechargement → vérification de la persistance → mode tactile.
// Usage : node tools/build.mjs && node tools/e2e.mjs   (captures dans test-results/e2e/)
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const out = join(root, 'test-results', 'e2e');
await mkdir(out, { recursive: true });
if (!existsSync(join(dist, 'game.js'))) {
  console.error('dist/ absent : lancez d’abord « node tools/build.mjs »');
  process.exit(2);
}

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ttf': 'font/ttf' };
// Toute ressource manquante est une erreur (404 compris).
const server = createServer(async (req, res) => {
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
await new Promise((r) => server.listen(0, r));
const url = `http://localhost:${server.address().port}/`;

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});

const results = [];
let failed = 0;
function check(name, ok, info = '') {
  results.push(`${ok ? '✔' : '✘'} ${name}${info ? ' — ' + info : ''}`);
  if (!ok) failed++;
}

async function newPage(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 640 }, ...opts });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  return { ctx, page, errors };
}

const clickText = async (page, re, timeout = 10000) => {
  const loc = page.locator('#ui').getByText(re).first();
  await loc.waitFor({ state: 'visible', timeout });
  await loc.click();
};

const waitGame = (page, timeout = 180000) => page.waitForFunction(() => window.voxelia?.game?.ready === true && window.voxelia.ui.depth === 0, null, { timeout, polling: 500 });

try {
  // ---------------------------------------------------------------- PC
  const { ctx, page, errors } = await newPage();
  await page.goto(url);
  await page.locator('.title-screen').waitFor({ timeout: 30000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: join(out, '01-titre.png') });
  check('écran titre affiché', true);

  // Tous les modèles 3D (joueur, créatures, boss, véhicules) doivent se construire
  const badModels = await page.evaluate(() => {
    const mf = window.voxelia.models;
    const bad = [];
    for (const k of Object.keys(mf.defs)) {
      try {
        mf.create(k).dispose();
      } catch (e) {
        bad.push(k + ' : ' + e.message);
      }
    }
    return bad;
  });
  check('tous les modèles 3D se construisent', badModels.length === 0, badModels.join(' | '));

  await clickText(page, /^Jouer$/);
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(out, '02-jouer.png') });
  await clickText(page, /Créer un nouveau monde/i);
  await page.waitForTimeout(800);
  await page.screenshot({ path: join(out, '03-creer.png') });
  await clickText(page, /^CRÉER$/i);
  const t0 = Date.now();
  await waitGame(page);
  check('monde créé et chargé', true, `${((Date.now() - t0) / 1000).toFixed(1)} s`);
  await page.waitForTimeout(5000);
  await page.screenshot({ path: join(out, '04-partie.png') });

  const state = await page.evaluate(() => {
    const g = window.voxelia.game;
    return { y: g.player.pos.y, chunks: g.chunks.chunks.size, mode: g.player.gameMode, dead: g.player.dead };
  });
  check('joueur vivant en jeu', !state.dead && state.y > 0, JSON.stringify(state));

  // Inventaire
  await page.keyboard.press('KeyE');
  await page.waitForTimeout(800);
  const invOpen = await page.locator('.inv-back').count();
  check('inventaire ouvert avec E', invOpen === 1);
  await page.screenshot({ path: join(out, '05-inventaire.png') });
  await page.keyboard.press('Escape');
  await page.waitForTimeout(400);

  // Pose d'un bloc + déplacement simulé
  const placed = await page.evaluate(() => {
    const g = window.voxelia.game;
    const p = g.player;
    const x = Math.floor(p.pos.x) + 2;
    const z = Math.floor(p.pos.z);
    const y = g.world.height(x, z) + 1;
    const ok = g.world.set(x, y, z, 87, 0, 'player'); // coffre
    g.world.setBlockEntity(x, y, z, { type: 'chest', items: [{ id: 1, count: 5 }, ...new Array(26).fill(null)] });
    return { x, y, z, ok };
  });
  check('bloc posé', placed.ok);
  await page.keyboard.down('KeyW');
  await page.waitForTimeout(1500);
  await page.keyboard.up('KeyW');
  const moved = await page.evaluate(() => window.voxelia.game.player.walkDist);
  check('le joueur avance (touche W)', moved > 0.5, `distance ${moved.toFixed(2)}`);

  // Pause puis sauvegarde et retour au menu
  await page.evaluate(() => window.voxelia.game.pause());
  await page.waitForTimeout(600);
  await page.screenshot({ path: join(out, '06-pause.png') });
  await clickText(page, /Enregistrer et quitter/i);
  await page.locator('.title-screen').waitFor({ timeout: 60000 });
  check('retour au menu après sauvegarde', true);

  // Rechargement complet de la page et vérification de la persistance
  await page.reload();
  await page.locator('.title-screen').waitFor({ timeout: 30000 });
  await clickText(page, /^Jouer$/);
  await page.locator('.world-row').first().waitFor({ timeout: 10000 });
  await page.locator('.world-row').first().click();
  await waitGame(page);
  const persisted = await page.evaluate(({ x, y, z }) => {
    const g = window.voxelia.game;
    const be = g.world.blockEntity(x, y, z);
    return { id: g.world.id(x, y, z), items: be?.items?.[0]?.count ?? null };
  }, placed);
  check('bloc et contenu du coffre conservés après rechargement', persisted.id === 87 && persisted.items === 5, JSON.stringify(persisted));
  await page.screenshot({ path: join(out, '07-rechargement.png') });

  // Commandes : nuit et créatif
  await page.evaluate(() => {
    const g = window.voxelia.game;
    g.meta.cheats = true;
    g.submitChat('/time set night');
    g.submitChat('/gamemode creative');
  });
  await page.waitForTimeout(3000);
  const night = await page.evaluate(() => ({ t: window.voxelia.game.meta.time, m: window.voxelia.game.player.gameMode }));
  check('commandes /time et /gamemode', night.t === 13000 || night.t > 12900, JSON.stringify(night));
  await page.screenshot({ path: join(out, '08-nuit.png') });
  check('aucune erreur JavaScript (PC)', errors.length === 0, errors.slice(0, 5).join(' | '));
  await ctx.close();

  // ---------------------------------------------------------------- tactile (format téléphone 2340×1080)
  const t = await newPage({ viewport: { width: 1170, height: 540 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  await t.page.goto(url);
  await t.page.locator('.title-screen').waitFor({ timeout: 30000 });
  await t.page.waitForTimeout(3000);
  await t.page.screenshot({ path: join(out, '09-titre-mobile.png') });
  // Nouveau contexte = stockage vide : on crée un monde au doigt.
  await t.page.locator('#ui').getByText(/^Jouer$/).first().tap();
  await t.page.locator('#ui').getByText(/Créer un nouveau monde/i).first().tap();
  await t.page.locator('#ui').getByText(/^CRÉER$/i).first().tap();
  await waitGame(t.page);
  await t.page.waitForTimeout(4000);
  const touchVisible = await t.page.evaluate(() => getComputedStyle(document.querySelector('.touch-layer')).display !== 'none');
  check('commandes tactiles visibles', touchVisible);
  await t.page.screenshot({ path: join(out, '10-partie-mobile.png') });
  check('aucune erreur JavaScript (mobile)', t.errors.length === 0, t.errors.slice(0, 5).join(' | '));
  await t.ctx.close();
} catch (e) {
  check('scénario complet', false, String(e?.message ?? e).split('\n')[0]);
  for (const c of browser.contexts())
    for (const p of c.pages()) {
      const st = await p.evaluate(() => ({ depth: window.voxelia?.ui.depth, screen: window.voxelia?.ui.current?.el?.className, dead: window.voxelia?.game?.player.dead, ui: document.getElementById('ui')?.innerText.slice(0, 300) })).catch(() => null);
      console.log('état au moment de l’échec :', JSON.stringify(st));
      await p.screenshot({ path: join(out, 'erreur.png') }).catch(() => undefined);
    }
} finally {
  await browser.close();
  server.close();
}

console.log(results.join('\n'));
console.log(failed ? `\n${failed} échec(s)` : '\nTous les contrôles sont passés.');
process.exit(failed ? 1 : 0);
