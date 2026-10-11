// Partie ouverte au réseau local, à deux : l'hôte joue dans la fenêtre du lanceur, une amie
// (autre navigateur, autre profil) trouve la partie sur le réseau et la rejoint par le relais.
//   node ../scripts/build-html.mjs game/index.html && go build -o dist/voxerra-test . && xvfb-run -a node test-lan.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = import.meta.dirname;
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'voxerra-lan-'));
const check = (ok, what) => {
  console.log(ok ? '✔' : '✘', what);
  if (!ok) process.exitCode = 1;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (f, ms = 30000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try {
      if (await f()) return true;
    } catch {}
    await wait(250);
  }
  return false;
};

const L = spawn(path.join(here, 'dist/voxerra-test'), [], {
  env: { ...process.env, VOXERRA_BROWSER: CHROME, VOXERRA_BROWSER_ARGS: `--remote-debugging-port=9339 --user-data-dir=${profile} --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --lang=fr-FR` },
  stdio: 'inherit',
});
let b, host;
await until(async () => {
  b ??= await chromium.connectOverCDP('http://127.0.0.1:9339');
  host = b.contexts().flatMap((c) => c.pages()).find((x) => x.url().startsWith('http://127.0.0.1:47183'));
  return !!host;
}, 60000);
const errs = [];
host.on('pageerror', (e) => errs.push('hôte : ' + e.message));
host.on('dialog', (d) => d.dismiss().catch(() => {}));
await host.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
await host.evaluate(() => {
  window.voxerra.setLanguage('fr');
  window.voxerra.settings.playerName = 'Alba';
  window.voxerra.showMainMenu();
});
for (const l of ['Solo', 'Créer un nouveau monde', 'Créer le nouveau monde']) {
  await host.locator('button:visible', { hasText: l }).first().click();
  await wait(400);
}
await host.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
await wait(1000);

// 1) l'hôte ouvre sa partie au réseau
await host.evaluate(() => window.voxerra.openToLan());
check(await until(() => host.evaluate(() => !!window.voxerra.lanHost?.network)), 'partie ouverte au réseau (relais prêt)');
const net = await host.evaluate(() => window.voxerra.lanHost.network);
check(net.port === 25590 && net.addresses.length > 0, `adresse à donner : ${net.addresses.join(' / ')} (port ${net.port})`);

// 2) une amie, sur un autre « appareil », trouve la partie et la rejoint
// connexion directe à l'adresse annoncée, comme sur un vrai réseau Wi-Fi (pas de proxy)
const friendBrowser = await chromium.launch({ executablePath: CHROME, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-proxy-server'] });
const friend = await friendBrowser.newPage({ viewport: { width: 1000, height: 640 }, locale: 'fr-FR' });
friend.on('pageerror', (e) => errs.push('amie : ' + e.message));
await friend.goto('http://127.0.0.1:47183/');
await friend.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
let games = [];
check(
  await until(async () => {
    games = await friend.evaluate(async () => (await fetch('/lan/parties')).json());
    return games.some((g) => g.name === 'Alba');
  }, 15000),
  `partie trouvée sur le réseau : ${JSON.stringify(games)}`,
);
await friend.evaluate(() => {
  window.voxerra.setLanguage('fr');
  window.voxerra.settings.playerName = 'Brune';
});
await friend.evaluate((addr) => window.voxerra.connect(addr, 'Brune'), `${games[0]?.host ?? '127.0.0.1'}:${games[0]?.port ?? 25590}`);
check(await until(() => friend.evaluate(() => !!window.voxerra.game?.remote && !window.voxerra.ui.open), 60000), 'l’amie a rejoint la partie');
check(await until(() => host.evaluate(() => window.voxerra.lanHost.players().includes('Brune'))), 'l’hôte voit Brune connectée');
const ids = await host.evaluate(() => ({ alba: window.voxerra.game.player.id }));

// 3) en temps réel : chacun voit l'autre bouger
const seen = (page, name) => page.evaluate((n) => [...window.voxerra.game.sim.entities.list].find((e) => e.kind === 'player' && e.displayName === n), name);
check(await until(async () => !!(await seen(friend, 'Alba'))), 'Brune voit Alba');
check(await until(async () => !!(await seen(host, 'Brune'))), 'Alba voit Brune');
const albaPos = await host.evaluate(() => {
  const p = window.voxerra.game.player;
  p.gameMode = 'creatif';
  p.flying = true;
  p.setPos(p.x + 3, p.y + 2, p.z);
  return { x: p.x, z: p.z };
});
const t0 = Date.now();
const moved = await until(async () => {
  const e = await friend.evaluate(() => [...window.voxerra.game.sim.entities.list].find((x) => x.kind === 'player' && x.displayName === 'Alba'));
  return e && Math.abs(e.body?.x ?? e.x) > 0 && Math.hypot((e.body?.x ?? 0) - albaPos.x, (e.body?.z ?? 0) - albaPos.z) < 0.6;
}, 5000);
check(moved, `Brune voit Alba se déplacer en temps réel (${Date.now() - t0} ms)`);

// 4) un bloc posé par Brune apparaît chez Alba
const placed = await friend.evaluate(async () => {
  const g = window.voxerra.game, p = g.player, w = g.sim.world(p.dim);
  p.inventory.set(0, { id: 'bloc_or', count: 3 });
  g.remote.syncInventory();
  await new Promise((r) => setTimeout(r, 300));
  const x = Math.floor(p.x) + 1, z = Math.floor(p.z);
  const y = w.findGround(x, z);
  g.remote.place({ x, y, z, face: 2, dist: 2, px: x + 0.5, py: y + 1, pz: z + 0.5 }, 0);
  return { x, y: y + 1, z };
});
check(
  await until(() => host.evaluate((q) => window.voxerra.content.blocks.get(window.voxerra.game.sim.world('surface').getId(q.x, q.y, q.z)).id === 'bloc_or', placed), 5000),
  'le bloc posé par Brune apparaît chez Alba',
);

// 5) discussion
await friend.evaluate(() => window.voxerra.game.sendChat('salut Alba !'));
check(await until(() => host.evaluate(() => document.querySelector('.chat')?.textContent.includes('salut Alba !')), 5000), 'Alba lit le message de Brune');

// 6) l'hôte quitte : l'amie est prévenue, le monde est sauvegardé
await host.evaluate(() => window.voxerra.quitToTitle());
check(await until(() => friend.evaluate(() => !window.voxerra.game && document.body.textContent.includes('L’hôte a quitté la partie.')), 15000), 'Brune est prévenue que l’hôte a quitté');
const saved = await host.evaluate(async () => {
  const worlds = await window.voxerra.storage.listWorlds();
  const m = worlds[0];
  return { guests: Object.keys(m.extra?.guests ?? {}), player: !!m.player };
});
check(saved.player && saved.guests.includes('Brune'), `monde sauvegardé avec Alba et Brune (${JSON.stringify(saved)})`);
check(errs.length === 0, `aucune erreur (${errs.slice(0, 3).join(' | ')})`);
void ids;

await friendBrowser.close();
await host.evaluate(() => window.voxerraHost?.quit?.()).catch(() => {});
await wait(1500);
L.kill();
await b.close().catch(() => {});
fs.rmSync(profile, { recursive: true, force: true });
