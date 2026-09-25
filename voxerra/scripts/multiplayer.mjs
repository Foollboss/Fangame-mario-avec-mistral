// Test de bout en bout du multijoueur : deux navigateurs se connectent au
// serveur (npm run server), se voient, et une pose de bloc est répliquée.
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const server = process.argv[3] ?? 'localhost:25590';
const outDir = process.argv[4] ?? 'screenshots/multijoueur';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const logs = [];
async function join(name) {
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  page.on('console', (m) => logs.push(`[${name}] [${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => logs.push(`[${name}] [pageerror] ${e.message}\n${e.stack}`));
  await page.goto(url);
  await page.waitForTimeout(4000);
  await page.evaluate((name) => {
    const app = window.voxerra;
    app.settings.playerName = name;
    app.connect(window.__srv, name);
  }, name).catch(() => {});
  return page;
}
const pages = [];
for (const name of ['Alba', 'Brune']) {
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  page.on('console', (m) => logs.push(`[${name}] [${m.type()}] ${m.text()}`));
  page.on('pageerror', (e) => logs.push(`[${name}] [pageerror] ${e.message}\n${e.stack}`));
  await page.goto(url);
  await page.waitForTimeout(4000);
  await page.evaluate(([name, server]) => {
    const app = window.voxerra;
    app.settings.playerName = name;
    app.connect(server, name);
  }, [name, server]);
  await page.waitForFunction(() => window.voxerra?.game?.remote && !window.voxerra.ui.open, null, { timeout: 60000 }).catch(() => console.log(name, 'timeout connexion'));
  pages.push(page);
}
void join;
await pages[0].waitForTimeout(3000);
// Brune se place devant Alba
const posA = await pages[0].evaluate(() => {
  const p = window.voxerra.game.player;
  return { x: p.x, y: p.y, z: p.z, id: p.id, chunks: window.voxerra.game.world.chunks.size };
});
console.log('Alba', JSON.stringify(posA));
await pages[1].evaluate((a) => {
  const g = window.voxerra.game;
  g.player.setPos(a.x, a.y, a.z - 4);
  g.player.yaw = Math.PI;
}, posA);
await pages[0].evaluate(() => {
  const g = window.voxerra.game;
  g.player.yaw = 0;
  g.player.pitch = -0.1;
  g.sendChat('Bonjour Brune !');
});
await pages[0].waitForTimeout(2500);
const seen = await pages[0].evaluate(() => window.voxerra.game.sim.entities.list.filter((e) => e.kind === 'player').map((e) => `${e.displayName}@${e.x.toFixed(1)},${e.z.toFixed(1)}`));
console.log('Alba voit', JSON.stringify(seen));
// Alba pose un bloc via le serveur
const placed = await pages[0].evaluate(() => {
  const g = window.voxerra.game;
  const p = g.player;
  const w = g.world;
  const x = Math.floor(p.x) + 2, z = Math.floor(p.z);
  const y = w.heightAt(x, z);
  p.inventory.set(p.inventory.selected, { id: 'bloc_or', count: 5 });
  g.remote.syncInventory();
  g.remote.place({ x, y, z, face: 2, dist: 2, px: x + 0.5, py: y + 1, pz: z + 0.5 }, p.inventory.selected);
  return { x, y: y + 1, z };
});
await pages[0].waitForTimeout(1500);
const onB = await pages[1].evaluate((b) => {
  const g = window.voxerra.game;
  return g.content.blocks.get(g.world.getId(b.x, b.y, b.z)).id;
}, placed);
console.log('Bloc vu par Brune :', onB);
const chatB = await pages[1].evaluate(() => window.voxerra.game.chat.el.textContent);
console.log('Discussion chez Brune :', chatB.slice(-160));
await pages[0].screenshot({ path: `${outDir}/alba.png` });
await pages[1].screenshot({ path: `${outDir}/brune.png` });
console.log(logs.filter((l) => !l.includes('[vite]') && (l.includes('error') || l.includes('pageerror'))).slice(-20).join('\n'));
await browser.close();
