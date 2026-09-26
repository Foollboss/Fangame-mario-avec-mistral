// Captures des Îles célestes : portail d'aurore allumé à la plume d'azur,
// voyage, paysage, créatures et temple des nuées.
//   node scripts/celeste.mjs [url] [dossier]   (le serveur de dév. doit tourner)
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const out = process.argv[3] ?? 'screenshots/celeste';
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, locale: 'fr-FR' });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
const click = async (t) => {
  await page.locator('button:visible', { hasText: t }).first().click();
  await page.waitForTimeout(400);
};
const shot = async (name) => {
  await page.screenshot({ path: `${out}/${name}.png` });
  console.log('✔', name);
};
await page.goto(url);
await page.waitForTimeout(4000);
await click('Solo');
await click('Créer un nouveau monde');
await click('Monde');
await page.locator('input.input:visible').first().fill('20250917');
await click('Créer le nouveau monde');
await page.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
await page.waitForTimeout(2000);

// 1) cadre de pierres d'aurore allumé avec la plume d'azur (vrai usage de l'objet)
const portal = await page.evaluate(async () => {
  const { useItem } = await import('/src/sim/interact.ts');
  const g = window.voxerra.game,
    p = g.player,
    w = g.sim.world('surface'),
    t = g.sim.content.blocks;
  g.sim.rules.mobSpawning = false;
  g.sim.env.time = 5200;
  g.hideHud = true;
  const x0 = Math.floor(p.x) - 1,
    z0 = Math.floor(p.z) - 6;
  const y0 = w.heightAt(x0 + 1, z0);
  for (let dx = -3; dx <= 6; dx++)
    for (let dz = -2; dz <= 8; dz++) {
      w.setBlock(x0 + dx, y0, z0 + dz, t.num('herbe'));
      for (let dy = 1; dy <= 8; dy++) w.setBlock(x0 + dx, y0 + dy, z0 + dz, 0);
    }
  for (let a = 0; a <= 3; a++) for (let k = 0; k <= 4; k++) if (a === 0 || a === 3 || k === 0 || k === 4) w.setBlock(x0 + a, y0 + 1 + k, z0, t.num('pierre_aurore'));
  p.inventory.set(p.inventory.selected, { id: 'plume_azur', count: 1 });
  const r = useItem(g.sim, p, { x: x0 + 1, y: y0 + 1, z: z0, face: 2, dist: 3, px: x0 + 1.5, py: y0 + 2, pz: z0 + 0.5 }, null);
  p.setPos(x0 + 2, y0 + 1, z0 + 7.5);
  p.body.vx = p.body.vy = p.body.vz = 0;
  p.yaw = 0;
  p.pitch = 0.12;
  return { r, x0, y0, z0, veil: w.getId(x0 + 1, y0 + 2, z0) === t.num('voile_celeste') };
});
console.log('allumage', JSON.stringify(portal));
await page.waitForTimeout(4000);
await shot('1-portail-aurore');

// 2) on traverse le voile
await page.evaluate(({ x0, y0, z0 }) => {
  const p = window.voxerra.game.player;
  p.gameMode = 'creatif';
  p.setPos(x0 + 1.5, y0 + 2, z0 + 0.5);
}, portal);
await page.waitForFunction(() => window.voxerra.game.player.dim === 'celeste', null, { timeout: 60000 });
await page.waitForTimeout(12000);
const arrival = await page.evaluate(() => {
  const g = window.voxerra.game,
    p = g.player;
  g.sim.rules.mobSpawning = false;
  g.sim.env.time = 5200;
  p.yaw = Math.PI; // dos au portail : le paysage
  p.pitch = -0.05;
  return { x: p.x, y: p.y, z: p.z };
});
console.log('arrivée', JSON.stringify(arrival));
await page.waitForTimeout(3000);
await shot('2-arrivee');
await page.evaluate(() => {
  const p = window.voxerra.game.player;
  p.flying = true;
  p.yaw = 0;
  p.pitch = -0.02;
  p.setPos(p.x, p.y + 1.4, p.z + 4);
  p.body.vx = p.body.vy = p.body.vz = 0;
});
await page.waitForTimeout(2500);
await shot('3-portail-retour');

// 3) vue d'ensemble de l'île d'arrivée des îles (en vol)
await page.evaluate(() => {
  const g = window.voxerra.game,
    p = g.player;
  p.flying = true;
  p.setPos(34, 128, 58);
  p.body.vx = p.body.vy = p.body.vz = 0;
  const dx = 0 - 34,
    dz = 0 - 58,
    dy = 96 - 129.6;
  p.yaw = Math.atan2(-dx, -dz);
  p.pitch = Math.atan2(dy, Math.hypot(dx, dz));
});
await page.waitForTimeout(14000);
await shot('4-paysage');

// 4) créatures, posées devant le joueur sur l'île d'arrivée
await page.evaluate(() => {
  const g = window.voxerra.game,
    p = g.player,
    w = g.sim.world('celeste'),
    t = g.sim.content.blocks;
  for (const e of g.sim.entities.list) if (e.kind === 'mob') e.removed = true;
  const ground = (x, z) => {
    let y = w.heightAt(x, z);
    while (y > 0 && (t.hasTag(w.getId(x, y, z), 'leaves') || !t.solid[w.getId(x, y, z)])) y--;
    return y + 1;
  };
  p.flying = false;
  const px = 0,
    pz = 14;
  p.setPos(px + 0.5, ground(px, pz), pz + 0.5);
  p.body.vx = p.body.vy = p.body.vz = 0;
  p.yaw = 0;
  p.pitch = -0.08;
  g.sim.spawnMob('grand_duvet', 'celeste', -1.5, ground(-2, 9), 9.5);
  g.sim.spawnMob('lapinuage', 'celeste', 2.5, ground(2, 10), 10.5);
  g.sim.spawnMob('lapinuage', 'celeste', 1.5, ground(1, 8), 8.5);
  g.sim.spawnMob('zephyrin', 'celeste', 0.5, ground(0, 6) + 4, 6.5);
});
await page.waitForTimeout(5000);
await shot('5-creatures');

// 5) temple des nuées
const temple = await page.evaluate(() => {
  const g = window.voxerra.game,
    p = g.player;
  const l = g.generatorFor('celeste').structures.locate('temple_nuees', 0, 0);
  if (!l) return null;
  for (const e of g.sim.entities.list) if (e.kind === 'mob') e.removed = true;
  p.flying = true;
  p.setPos(l.x + 0.5, l.y + 15, l.z + 19.5);
  p.body.vx = p.body.vy = p.body.vz = 0;
  p.yaw = 0;
  p.pitch = -Math.atan2(12, 19);
  return l;
});
console.log('temple', JSON.stringify(temple));
await page.waitForTimeout(14000);
await page.evaluate(() => {
  for (const e of window.voxerra.game.sim.entities.list) if (e.kind === 'mob' && e.type === 'zephyrin') e.target = null;
});
await shot('6-temple-nuees');
console.log(errors.length ? 'erreurs : ' + errors.join(' | ') : 'sans erreur');
await browser.close();
