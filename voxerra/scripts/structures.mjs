// Vérification visuelle des structures : crée un monde, localise chaque
// structure demandée, s'y téléporte en vol et prend une capture.
// Usage : node scripts/structures.mjs [url] [dossier] [ids séparés par des virgules]
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const outDir = process.argv[3] ?? 'screenshots/structures';
const ids = (process.argv[4] ?? 'village,ruines,tour,temple,portail,sanctuaire,observatoire,crypte').split(',');
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
for (const id of ids) {
  const where = await page.evaluate((id) => {
    const g = window.voxerra.game;
    const p = g.player;
    const s = g.generatorFor(p.dim).structures;
    const loc = s.locate(id, p.x, p.z);
    if (!loc) return null;
    p.gameMode = 'creatif';
    p.flying = true;
    g.sim.rules.mobSpawning = false;
    g.sim.env.time = 5000;
    const d = id === 'village' ? 34 : id === 'mine' || id === 'donjon' ? 0 : 20;
    const up = id === 'village' ? 26 : id === 'observatoire' ? 22 : 14;
    p.setPos(loc.x + 0.5, loc.y + up, loc.z + d + 0.5);
    p.body.vx = p.body.vy = p.body.vz = 0;
    p.yaw = 0;
    p.pitch = -Math.atan2(up - 2, Math.max(1, d));
    return loc;
  }, id);
  console.log(id, JSON.stringify(where));
  if (!where) continue;
  await page.waitForTimeout(7000);
  await page.screenshot({ path: `${outDir}/${id}.png` });
}
console.log(logs.filter((l) => !l.includes('[vite]')).slice(-20).join('\n'));
await browser.close();
