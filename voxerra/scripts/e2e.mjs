// Parcours automatisé : menu → création de monde → jeu → inventaire (captures à chaque étape).
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const outDir = process.argv[3] ?? 'screenshots/e2e';
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
await page.waitForTimeout(6000);
await clickText('Solo');
await shot('01-mondes');
await clickText('Créer un nouveau monde');
await shot('02-creation');
await clickText('Monde');
await page.locator('input.input:visible').first().fill('VoxelDemo');
await shot('03-creation-monde');
await clickText('Créer le nouveau monde');
await page.waitForTimeout(1500);
await shot('04-chargement');
await page.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 90000 }).catch(() => console.log('timeout chargement'));
await page.waitForTimeout(4000);
await shot('05-jeu');
const info = await page.evaluate(() => {
  const g = window.voxerra.game;
  const p = g.player;
  return { x: p.x, y: p.y, z: p.z, chunks: g.world.chunks.size, stats: g.chunkRenderer.stats, hp: p.health };
});
console.log(JSON.stringify(info));
await page.evaluate(() => {
  const g = window.voxerra.game;
  g.player.inventory.give({ id: 'pioche_fer', count: 1 });
  g.player.inventory.give({ id: 'torche', count: 32 });
  g.player.inventory.give({ id: 'planches_chene', count: 64 });
  g.player.inventory.give({ id: 'pain', count: 10 });
  g.openInventory();
});
await page.waitForTimeout(800);
await shot('06-inventaire');
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
await page.evaluate(() => { const g = window.voxerra.game; g.showDebug = true; g.player.pitch = -0.2; });
await page.waitForTimeout(1500);
await shot('07-debug');
await page.evaluate(() => window.voxerra.game.openPause());
await page.waitForTimeout(600);
await shot('08-pause');
console.log(logs.filter((l) => !l.includes('[vite]')).slice(-30).join('\n'));
await browser.close();
