// Vérification visuelle des créatures : crée un monde, invoque des créatures
// autour du joueur et un boss, puis prend des captures.
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const outDir = process.argv[3] ?? 'screenshots/creatures';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}\n${e.stack}`));
const shot = async (name) => {
  await page.screenshot({ path: `${outDir}/${name}.png` });
  console.log('capture', name);
};
const clickText = async (t) => {
  await page.getByText(t, { exact: true }).first().click();
  await page.waitForTimeout(400);
};
await page.goto(url);
await page.waitForTimeout(5000);
await clickText('Solo');
await clickText('Créer un nouveau monde');
await clickText('Monde');
await page.locator('input.input:visible').first().fill('Bestiaire');
await clickText('Créer le nouveau monde');
await page.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 90000 }).catch(() => console.log('timeout chargement'));
await page.waitForTimeout(3000);
const list = ['pelucheon', 'picoreau', 'cerf_argent', 'ours_mousse', 'loup_givre', 'rodeur', 'epineux', 'tisseuse', 'vesse_explosive', 'pillard', 'pillard_archer', 'chauve_furie'];
await page.evaluate((list) => {
  const g = window.voxerra.game;
  const p = g.player;
  p.creative = true;
  g.sim.rules.mobSpawning = false;
  g.sim.env.time = 6000;
  for (const e of g.sim.entities.list) if (e.kind === 'mob') e.removed = true;
  list.forEach((c, i) => {
    const x = p.x + (i - (list.length - 1) / 2) * 1.7, z = p.z - 9 - (i % 2) * 2;
    const w = g.world;
    const y = w.heightAt(Math.floor(x), Math.floor(z)) + 1;
    const m = g.sim.spawnMob(c, p.dim, x, y, z);
    if (m) {
      m.speedMul = 0;
      m.yaw = m.bodyYaw = Math.PI;
      m.goals = m.goals.filter((gl) => !gl.always);
    }
  });
  p.yaw = 0;
  p.pitch = -0.2;
}, list);
await page.waitForTimeout(2500);
await shot('01-bestiaire');
const info = await page.evaluate(() => {
  const g = window.voxerra.game;
  return g.sim.entities.list.filter((e) => e.kind === 'mob').map((m) => `${m.type}:${m.x.toFixed(1)},${m.y.toFixed(1)},${m.z.toFixed(1)} hp${m.health} goal=${m.current ? 'y' : 'n'}`);
});
console.log(info.join('\n'));
await page.evaluate(() => {
  const g = window.voxerra.game;
  const p = g.player;
  for (const e of g.sim.entities.list) if (e.kind === 'mob') e.removed = true;
  p.creative = false;
  g.sim.summonBoss('gardien_sylvestre', p.dim, p.x, p.y + 1, p.z - 9, p);
  p.yaw = 0;
  p.pitch = 0.05;
});
await page.waitForTimeout(3000);
await shot('02-boss');
await page.evaluate(() => {
  const g = window.voxerra.game;
  const b = g.sim.entities.list.find((e) => e.kind === 'mob');
  b.health = b.maxHealth * 0.3;
});
await page.waitForTimeout(3000);
await shot('03-boss-phase');
const st = await page.evaluate(() => {
  const g = window.voxerra.game;
  const b = g.sim.entities.list.find((e) => e.kind === 'mob');
  return { boss: g.boss, php: g.player.health, phase: b?.phase, dist: b ? b.distTo(g.player.x, g.player.y, g.player.z) : -1 };
});
console.log(JSON.stringify(st));
console.log(logs.filter((l) => !l.includes('[vite]')).slice(-30).join('\n'));
await browser.close();
