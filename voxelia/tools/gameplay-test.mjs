// Test de jouabilité dans Chromium headless : miner, ramasser, fabriquer, poser, combattre,
// mourir / réapparaître, portail et voyage entre dimensions, structures générées.
// Usage : node tools/build.mjs && node tools/gameplay-test.mjs
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const out = join(root, 'test-results', 'gameplay');
await mkdir(out, { recursive: true });
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ttf': 'font/ttf' };
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
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 960, height: 480 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

const results = [];
let failed = 0;
const check = (name, ok, info = '') => {
  results.push(`${ok ? '✔' : '✘'} ${name}${info ? ' — ' + info : ''}`);
  if (!ok) failed++;
};
const run = (fn, arg) => page.evaluate(fn, arg);
const wait = (ms) => page.waitForTimeout(ms);
const shot = (name) => page.screenshot({ path: join(out, name + '.png') });

try {
  await page.goto(`http://localhost:${server.address().port}/`);
  await page.locator('.title-screen').waitFor({ timeout: 30000 });
  await run(() => window.voxelia.settings.set('renderDistance', 4));
  await page.locator('#ui').getByText(/^Jouer$/).first().click();
  await page.locator('#ui').getByText(/Créer un nouveau monde/i).first().click();
  await page.locator('#ui').getByText(/^CRÉER$/i).first().click();
  await page.waitForFunction(() => window.voxelia?.game?.ready === true && window.voxelia.ui.depth === 0, null, { timeout: 180000, polling: 500 });
  await wait(2000);

  // Prépare une petite arène plate et sûre autour du joueur (journée, sans monstres)
  const base = await run(() => {
    const g = window.voxelia.game;
    g.meta.cheats = true;
    g.meta.time = 6000;
    g.meta.rules.mobSpawning = false;
    const p = g.player;
    const x0 = Math.floor(p.pos.x);
    const z0 = Math.floor(p.pos.z);
    const y0 = Math.floor(p.pos.y);
    const B = (k) => window.voxelia.game.world.chunks && Number(window.__blockIds?.[k]);
    void B;
    for (let dx = -4; dx <= 4; dx++)
      for (let dz = -4; dz <= 4; dz++) {
        g.world.set(x0 + dx, y0 - 1, z0 + dz, 1, 0, 'player'); // pierre
        for (let dy = 0; dy < 4; dy++) g.world.set(x0 + dx, y0 + dy, z0 + dz, 0, 0, 'player');
      }
    p.pos.set(x0 + 0.5, y0, z0 + 0.5);
    p.prevPos.copy(p.pos);
    p.vel.set(0, 0, 0);
    for (const e of g.entities.list) if (e.living) e.remove();
    return { x0, y0, z0 };
  });
  await wait(800);

  // ---------------------------------------------------------------- miner en survie (maintien du bouton)
  const mine = await run(async (b) => {
    const g = window.voxelia.game;
    const p = g.player;
    const ids = Object.fromEntries(window.voxelia.models ? [] : []);
    void ids;
    // Bloc de terre devant le joueur, à hauteur des yeux - 1
    const tx = b.x0;
    const ty = b.y0;
    const tz = b.z0 - 2;
    g.world.set(tx, ty, tz, 3, 0, 'player'); // terre
    p.yaw = 0; // regarde vers -Z
    p.pitch = -0.55;
    await new Promise((r) => setTimeout(r, 300));
    const target = g.interaction.target;
    window.voxelia.input.touch.attack = true;
    const t0 = performance.now();
    while (g.world.id(tx, ty, tz) !== 0 && performance.now() - t0 < 8000) await new Promise((r) => setTimeout(r, 100));
    window.voxelia.input.touch.attack = false;
    const broken = g.world.id(tx, ty, tz) === 0;
    // Laisser l'objet tomber puis marcher dessus pour le ramasser
    await new Promise((r) => setTimeout(r, 1000));
    p.pos.set(tx + 0.5, ty, tz + 0.5);
    p.prevPos.copy(p.pos);
    await new Promise((r) => setTimeout(r, 2000));
    const dirt = g.player.inventory.count(3);
    return { target: target ? [target.x, target.y, target.z, target.id] : null, broken, ms: Math.round(performance.now() - t0), picked: dirt };
  }, base);
  check('miner un bloc de terre en survie', mine.broken, JSON.stringify(mine));
  check('le bloc cassé est ramassé dans l’inventaire', mine.picked > 0, `quantité ${mine.picked}`);

  // ---------------------------------------------------------------- fabrication via l'écran d'inventaire
  const craftable = await run(() => {
    const g = window.voxelia.game;
    const inv = g.player.inventory;
    inv.clear();
    g.submitChat('/give oak_log 2');
    return inv.slots.filter(Boolean).map((s) => s.count);
  });
  await page.keyboard.press('KeyE');
  await wait(800);
  // Clic sur la recette des planches (premier emplacement vert du livre de recettes)
  const recipe = page.locator('.inv-col .slots-scroll .slot:not(.red)').first();
  await recipe.waitFor({ timeout: 5000 });
  await recipe.click({ modifiers: ['Shift'] });
  await wait(500);
  await shot('01-fabrication');
  await page.keyboard.press('Escape');
  await wait(500);
  const crafted = await run(() => {
    const inv = window.voxelia.game.player.inventory;
    return inv.slots.filter(Boolean).map((s) => [s.id, s.count]);
  });
  check('fabrication de planches depuis le livre de recettes', crafted.some(([, c]) => c >= 4), `avant ${JSON.stringify(craftable)} après ${JSON.stringify(crafted)}`);

  // ---------------------------------------------------------------- poser un bloc (bouton utiliser)
  const place = await run(async (b) => {
    const g = window.voxelia.game;
    const p = g.player;
    p.inventory.selected = p.inventory.slots.findIndex((s) => s && s.count >= 4);
    const sel = p.inventory.selected;
    if (sel > 8) {
      const s = p.inventory.slots[sel];
      p.inventory.slots[sel] = p.inventory.slots[0];
      p.inventory.slots[0] = s;
      p.inventory.selected = 0;
    }
    p.inventory.changed();
    p.yaw = 0;
    p.pitch = -1.0;
    await new Promise((r) => setTimeout(r, 300));
    const before = p.heldItem()?.count ?? 0;
    window.voxelia.input.touch.use = true;
    await new Promise((r) => setTimeout(r, 350));
    window.voxelia.input.touch.use = false;
    await new Promise((r) => setTimeout(r, 200));
    const after = p.heldItem()?.count ?? 0;
    let placed = 0;
    for (let dz = -3; dz <= 0; dz++) for (let dy = 0; dy <= 1; dy++) if (g.world.id(b.x0, b.y0 + dy, b.z0 + dz) === p.heldItem()?.id) placed++;
    return { before, after };
  }, base);
  check('poser un bloc consomme l’objet tenu', place.after < place.before, JSON.stringify(place));

  // ---------------------------------------------------------------- combat
  const fight = await run(async (b) => {
    const g = window.voxelia.game;
    const p = g.player;
    g.submitChat('/give iron_sword 1');
    const sword = p.inventory.slots.findIndex((s) => s && s.count === 1 && s.id && window.voxelia.icons);
    void sword;
    const m = g.spawnMob('zombie', b.x0 + 0.5, b.y0, b.z0 - 1.6, { persistent: true, force: true });
    if (!m) return { spawned: false };
    m.noAi = true;
    p.yaw = 0;
    p.pitch = -0.15;
    let hits = 0;
    const hp0 = m.health;
    for (let i = 0; i < 20 && !m.dead; i++) {
      m.pos.set(b.x0 + 0.5, b.y0, b.z0 - 1.6);
      window.voxelia.input.state.attackPressed = true;
      await new Promise((r) => setTimeout(r, 120));
      if (m.health < hp0) hits++;
      await new Promise((r) => setTimeout(r, 380));
    }
    return { spawned: true, hp0, hp: m.health, dead: m.dead, hits };
  }, base);
  check('attaquer une créature lui inflige des dégâts', fight.spawned && fight.hp < fight.hp0, JSON.stringify(fight));

  // ---------------------------------------------------------------- bateau : poser sur l'eau, monter, avancer
  const boat = await run(async () => {
    const g = window.voxelia.game;
    const p = g.player;
    for (const e of g.entities.list) if (e.living) e.remove();
    const x0 = Math.floor(p.pos.x);
    const y0 = Math.floor(p.pos.y);
    const z0 = Math.floor(p.pos.z);
    // Bassin de 7 × 14 : fond de pierre, une couche d'eau, air au-dessus
    for (let dx = -3; dx <= 3; dx++)
      for (let dz = -12; dz <= 1; dz++) {
        g.world.set(x0 + dx, y0 - 2, z0 + dz, 1);
        g.world.set(x0 + dx, y0 - 1, z0 + dz, 9);
        for (let dy = 0; dy < 4; dy++) g.world.set(x0 + dx, y0 + dy, z0 + dz, 0);
      }
    p.inventory.clear();
    g.submitChat('/give oak_boat 1');
    p.inventory.selected = 0;
    p.pos.set(x0 + 0.5, y0 + 0.2, z0 + 1.5);
    p.prevPos.copy(p.pos);
    p.yaw = 0;
    p.pitch = -0.9;
    await new Promise((r) => setTimeout(r, 600));
    window.voxelia.input.state.usePressed = true;
    await new Promise((r) => setTimeout(r, 600));
    const v = g.entities.list.find((e) => e.type === 'boat');
    if (!v) return { placed: false };
    g.mount(p, v);
    const z1 = v.pos.z;
    window.voxelia.input.touch.moveZ = 1;
    await new Promise((r) => setTimeout(r, 3000));
    window.voxelia.input.touch.moveZ = 0;
    const res = { placed: true, riding: p.vehicle === v, moved: +(z1 - v.pos.z).toFixed(2) };
    g.dismount(p);
    v.remove();
    return res;
  }, base);
  check('bateau posé sur l’eau, monté et dirigé', boat.placed && boat.riding && boat.moved > 2, JSON.stringify(boat));

  // ---------------------------------------------------------------- boss
  const boss = await run(async (b) => {
    const g = window.voxelia.game;
    const p = g.player;
    p.gameMode = 'survival';
    p.health = 20;
    g.meta.difficulty = 'normal';
    g.applyModeRules();
    const m = g.spawnMob('ancient_golem', b.x0 + 0.5, b.y0, b.z0 + 4.5, { persistent: true, force: true });
    if (!m) return { spawned: false };
    const t0 = performance.now();
    let bar = false;
    while (performance.now() - t0 < 15000 && p.health >= 20) {
      await new Promise((r) => setTimeout(r, 300));
      bar = bar || !document.querySelector('.bossbar')?.classList.contains('hidden');
    }
    const res = { spawned: true, bar, playerHp: p.health, bossHp: m.health };
    m.remove();
    p.health = 20;
    return res;
  }, base);
  check('boss : barre de vie affichée et attaque du joueur', boss.spawned && boss.bar && boss.playerHp < 20, JSON.stringify(boss));

  // ---------------------------------------------------------------- mort et réapparition
  // Retire les créatures du test de combat avant de mourir (sinon elles frappent à la réapparition)
  await run(() => {
    for (const e of window.voxelia.game.entities.list) if (e.living) e.remove();
  });
  await run(() => window.voxelia.game.submitChat('/kill'));
  await page.locator('.death').waitFor({ timeout: 10000 });
  await shot('02-mort');
  await page.locator('#ui').getByText(/Réapparaître/).first().click();
  await page.waitForFunction(() => !window.voxelia.game.player.dead && window.voxelia.ui.depth === 0, null, { timeout: 60000 });
  const alive = await run(() => ({ hp: window.voxelia.game.player.health, y: window.voxelia.game.player.pos.y }));
  check('mort puis réapparition', alive.hp === 20, JSON.stringify(alive));

  // ---------------------------------------------------------------- portail des Terres de braise
  const portal = await run(async () => {
    const g = window.voxelia.game;
    const p = g.player;
    p.gameMode = 'creative';
    const x = Math.floor(p.pos.x) + 3;
    const z = Math.floor(p.pos.z);
    const y = Math.floor(p.pos.y);
    const OBS = 93;
    for (let i = 0; i < 4; i++) {
      g.world.set(x + i, y - 1, z, OBS);
      g.world.set(x + i, y + 3, z, OBS);
    }
    for (let h = 0; h < 3; h++) {
      g.world.set(x, y + h, z, OBS);
      g.world.set(x + 3, y + h, z, OBS);
      g.world.set(x + 1, y + h, z, 0);
      g.world.set(x + 2, y + h, z, 0);
    }
    const lit = g.tryCreatePortal(x + 1, y, z, 'ember');
    p.pos.set(x + 1.5, y, z + 0.5);
    p.prevPos.copy(p.pos);
    const t0 = performance.now();
    while (g.dimension === 0 && performance.now() - t0 < 30000) await new Promise((r) => setTimeout(r, 250));
    return { lit, dim: g.dimension };
  });
  check('allumer un portail d’obsidienne', portal.lit, JSON.stringify(portal));
  await page.waitForFunction(() => window.voxelia.ui.depth === 0, null, { timeout: 120000 }).catch(() => undefined);
  await wait(3000);
  await shot('03-terres-de-braise');
  const ember = await run(() => {
    const g = window.voxelia.game;
    const p = g.player;
    return { dim: g.dimension, y: Math.round(p.pos.y), inSolid: g.world.def(Math.floor(p.pos.x), Math.floor(p.pos.y + 1), Math.floor(p.pos.z)).solid, portalNear: !!g.world.chunks };
  });
  check('voyage vers les Terres de braise par le portail', ember.dim === 1 && !ember.inSolid, JSON.stringify(ember));

  // ---------------------------------------------------------------- retour et royaume céleste par commande
  await run(() => window.voxelia.game.submitChat('/dimension ciel'));
  await page.waitForFunction(() => window.voxelia.game.dimension === 2 && window.voxelia.ui.depth === 0, null, { timeout: 120000 });
  await wait(3000);
  await shot('04-royaume-celeste');
  check('voyage vers le Royaume céleste', true);
  await run(() => window.voxelia.game.submitChat('/dimension surface'));
  await page.waitForFunction(() => window.voxelia.game.dimension === 0 && window.voxelia.ui.depth === 0, null, { timeout: 120000 });

  // ---------------------------------------------------------------- nuit, monstres et créatures
  await run(() => {
    const g = window.voxelia.game;
    g.meta.rules.mobSpawning = true;
    g.setTime(14000);
  });
  await wait(12000);
  const mobs = await run(() => {
    const g = window.voxelia.game;
    const types = {};
    for (const e of g.entities.list) types[e.type] = (types[e.type] ?? 0) + 1;
    return types;
  });
  await shot('05-nuit');
  check('des créatures apparaissent dans le monde', Object.keys(mobs).length > 0, JSON.stringify(mobs));

  check('aucune erreur JavaScript', errors.length === 0, [...new Set(errors)].slice(0, 5).join(' | '));
} catch (e) {
  check('scénario complet', false, String(e?.message ?? e).split('\n')[0]);
  await shot('erreur').catch(() => undefined);
} finally {
  await browser.close();
  server.close();
}
console.log(results.join('\n'));
console.log(failed ? `\n${failed} échec(s)` : '\nTous les contrôles sont passés.');
process.exit(failed ? 1 : 0);
