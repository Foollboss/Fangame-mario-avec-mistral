// Vérification visuelle des dimensions : Abîme (forteresse) et Cimes astrales (citadelle).
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const outDir = process.argv[3] ?? 'screenshots/dimensions';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}\n${e.stack}`));
const clickText = async (t) => {
  await page.getByText(t, { exact: true }).first().click();
  await page.waitForTimeout(400);
};
await page.goto(url);
await page.waitForTimeout(5000);
await clickText('Solo');
await clickText('Créer un nouveau monde');
await clickText('Monde');
await page.locator('input.input:visible').first().fill('20250917');
await clickText('Créer le nouveau monde');
await page.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 90000 }).catch(() => console.log('timeout chargement'));
await page.waitForTimeout(2000);
for (const [dim, id, d, up] of [
  ['abime', 'forteresse', 26, 14],
  ['astral', 'citadelle', 30, 18],
]) {
  await page.evaluate((dim) => {
    const g = window.voxerra.game;
    g.player.gameMode = 'creatif';
    g.player.flying = true;
    g.sim.rules.mobSpawning = false;
    g.sendChat('/dimension ' + dim);
  }, dim);
  await page.waitForTimeout(8000);
  const where = await page.evaluate(([dim, id, d, up]) => {
    const g = window.voxerra.game;
    const p = g.player;
    const loc = g.generatorFor(dim).structures.locate(id, p.x, p.z);
    if (!loc) return { dim: p.dim, loc: null };
    p.setPos(loc.x + 0.5, loc.y + up, loc.z + d + 0.5);
    p.body.vx = p.body.vy = p.body.vz = 0;
    p.yaw = 0;
    p.pitch = -Math.atan2(up - 3, d);
    g.sim.env.time = 5000;
    return { dim: p.dim, loc };
  }, [dim, id, d, up]);
  console.log(dim, JSON.stringify(where));
  await page.waitForTimeout(9000);
  await page.screenshot({ path: `${outDir}/${dim}.png` });
}
console.log(logs.filter((l) => !l.includes('[vite]')).slice(-20).join('\n'));
await browser.close();
