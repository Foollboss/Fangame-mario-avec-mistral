// Passage à la fenêtre native : les mondes de l'ancienne version (restés dans le profil du navigateur)
// sont récupérés au premier lancement. Linux, écran virtuel ; Chromium joue les deux rôles :
//   - « ancienne version » : le lanceur ouvre Chromium (profil A), comme Edge autrefois ;
//   - « nouvelle fenêtre » : un autre profil (B) avec le pont que pose la fenêtre WebView2.
//   node ../scripts/build-html.mjs game/index.html && go build -o dist/voxerra-test . && xvfb-run -a node test-transfert.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = import.meta.dirname;
const CHROME = process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'voxerra-transfert-'));
const profileA = path.join(tmp, 'ancien-profil');
const profileB = path.join(tmp, 'webview2');
const data = path.join(tmp, 'donnees');
const check = (ok, what) => {
  console.log(ok ? '✔' : '✘', what);
  if (!ok) process.exitCode = 1;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const env = (extra) => ({
  ...process.env,
  VOXERRA_BROWSER: CHROME,
  VOXERRA_BROWSER_ARGS: `--remote-debugging-port=9341 --user-data-dir=${profileA} --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --lang=fr-FR`,
  VOXERRA_DONNEES: data,
  ...extra,
});
const start = (extra = {}) => {
  const p = spawn(path.join(here, 'dist/voxerra-test'), [], { env: env(extra), stdio: 'inherit' });
  return { p, exited: new Promise((r) => p.on('exit', (code) => r(code))) };
};
const pageOf = async (port, match, ms = 60000) => {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try {
      const b = await chromium.connectOverCDP(`http://127.0.0.1:${port}`);
      for (let j = 0; j < 40; j++) {
        const pg = b.contexts().flatMap((c) => c.pages()).find((x) => match(x.url()));
        if (pg) return { b, pg };
        await wait(250);
      }
      await b.close().catch(() => {});
    } catch {}
    await wait(500);
  }
  throw new Error('fenêtre introuvable');
};

// 1) ancienne version : une partie dans la fenêtre du navigateur (profil A)
let L = start({ VOXERRA_NAVIGATEUR: '1' });
let { b, pg } = await pageOf(9341, (u) => u.startsWith('http://127.0.0.1:47183'));
await pg.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
const old = await pg.evaluate(async () => {
  const v = window.voxerra;
  v.setLanguage('fr');
  v.settings.playerName = 'Ancienne';
  v.saveSettings();
  return true;
});
await pg.evaluate(() => window.voxerra.showMainMenu());
for (const l of ['Solo', 'Créer un nouveau monde', 'Créer le nouveau monde']) {
  await pg.locator('button:visible', { hasText: l }).first().click();
  await wait(400);
}
await pg.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
await wait(1000);
// un bloc d'or posé à la main (absent du terrain généré) et 7 lingots dans l'inventaire
const mark = await pg.evaluate(async () => {
  const g = window.voxerra.game, p = g.player, w = g.sim.world(p.dim);
  const x = Math.floor(p.x) + 2, z = Math.floor(p.z);
  const y = w.findGround(x, z) + 1;
  w.setBlock(x, y, z, window.voxerra.content.blocks.num('bloc_or'));
  p.inventory.set(0, { id: 'bloc_or', count: 7 });
  await g.save();
  return { x, y, z, world: g.meta.id };
});
await pg.evaluate(() => window.voxerra.quitToTitle());
await pg.waitForFunction(() => document.querySelector('.menu-buttons'), null, { timeout: 60000 });
await pg.locator('button:visible', { hasText: 'Quitter le jeu' }).first().click();
check((await Promise.race([L.exited, wait(8000).then(() => 'délai')])) === 0, `ancienne version : monde créé (${mark.world}) et lanceur fermé`);
await b.close().catch(() => {});
void old;
await wait(1500);

// 2) nouvelle version : la fenêtre native (profil B) trouve les anciens mondes et les récupère
L = start({ VOXERRA_SANS_FENETRE: '1', VOXERRA_ANCIEN_PROFIL: profileA });
await wait(800);
check((await (await fetch('http://127.0.0.1:47183/transfert/etat')).json()).etat === 'a-faire', 'ancien profil détecté : transfert à faire');
const ctx = await chromium.launchPersistentContext(profileB, {
  executablePath: CHROME,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
  viewport: { width: 1000, height: 640 },
  locale: 'fr-FR',
});
// ce que pose la fenêtre WebView2 avant la page (native_windows.go)
await ctx.addInitScript(() => {
  window.voxerraHost = { nativeWindow: true, quit() {} };
});
const errs = [];
const page = ctx.pages()[0] ?? (await ctx.newPage());
page.on('pageerror', (e) => errs.push(e.message));
await page.goto('http://127.0.0.1:47183/');
check(await page.locator('.title', { hasText: 'Récupération de vos mondes' }).waitFor({ timeout: 15000 }).then(() => true, () => false), 'écran « Récupération de vos mondes »');
// l'ancienne fenêtre s'ouvre sur ?transfert=export, envoie les données et se ferme
let exp;
try {
  exp = await pageOf(9341, (u) => u.includes('transfert=export'), 30000);
} catch {}
check(!!exp, 'l’ancienne fenêtre (profil A) s’ouvre pour le transfert');
check(await page.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 90000 }).then(() => true, () => false), 'le jeu démarre ensuite dans la nouvelle fenêtre');
if (exp) {
  let gone = false;
  for (let i = 0; i < 20 && !gone; i++) {
    gone = !exp.b.contexts().flatMap((c) => c.pages()).some((x) => x.url().includes('transfert=export'));
    await wait(250);
  }
  check(gone, 'l’ancienne fenêtre se ferme toute seule');
  await exp.b.close().catch(() => {});
}
const after = await page.evaluate(async () => {
  const worlds = await window.voxerra.storage.listWorlds();
  return { worlds: worlds.map((w) => w.id), name: window.voxerra.settings.playerName };
});
check(after.worlds.includes(mark.world), `monde récupéré (${after.worlds.join(', ')})`);
check(after.name === 'Ancienne', `réglages récupérés (pseudo « ${after.name} »)`);
await page.evaluate(() => window.voxerra.setLanguage('fr'));
await page.evaluate(() => window.voxerra.showMainMenu());
await page.locator('button:visible', { hasText: 'Solo' }).first().click();
await wait(600);
await page.locator('.world-item').first().dblclick();
await page.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
const got = await page.evaluate((q) => {
  const g = window.voxerra.game;
  return { block: window.voxerra.content.blocks.get(g.sim.world('surface').getId(q.x, q.y, q.z)).id, inv: g.player.inventory.get(0) };
}, mark);
check(got.block === 'bloc_or', `le bloc posé dans l’ancienne version est là (${got.block})`);
check(got.inv?.id === 'bloc_or' && got.inv.count === 7, `inventaire récupéré (${JSON.stringify(got.inv)})`);
check(fs.readFileSync(path.join(data, 'transfert.txt'), 'utf8').trim() === 'fait' && fs.existsSync(path.join(data, 'ancienne-version.json')), 'transfert noté « fait », copie des données gardée');

// on joue dans la nouvelle fenêtre : 9 lingots désormais
await page.evaluate(async () => {
  window.voxerra.game.player.inventory.set(0, { id: 'bloc_or', count: 9 });
  await window.voxerra.game.save();
});

// 3) lancement suivant : plus de transfert
await page.evaluate(() => window.voxerra.quitToTitle());
await page.reload();
await page.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
check((await page.locator('.title', { hasText: 'Récupération de vos mondes' }).count()) === 0, 'lancement suivant : pas de nouveau transfert');
// Options : la récupération peut être relancée à la main
await page.evaluate(() => window.voxerra.setLanguage('fr'));
await page.locator('button:visible', { hasText: 'Options' }).first().click();
check(await page.locator('button:visible', { hasText: 'Récupérer les mondes de l’ancienne version' }).isVisible(), 'Options : « Récupérer les mondes de l’ancienne version »');
// récupération relancée à la main : le monde déjà là garde sa progression (pas d'ancienne copie par-dessus)
await page.locator('button:visible', { hasText: 'Récupérer les mondes de l’ancienne version' }).click();
check(await page.locator('.subtitle', { hasText: 'Aucun monde à récupérer.' }).waitFor({ timeout: 60000 }).then(() => true, () => false), 'relancée : « Aucun monde à récupérer. »');
await page.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
await page.evaluate(() => window.voxerra.setLanguage('fr'));
await page.evaluate(() => window.voxerra.showMainMenu());
await page.locator('button:visible', { hasText: 'Solo' }).first().click();
await wait(600);
await page.locator('.world-item').first().dblclick();
await page.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
const kept = await page.evaluate(() => window.voxerra.game.player.inventory.get(0));
check(kept?.count === 9, `la progression faite dans la nouvelle fenêtre est gardée (${JSON.stringify(kept)})`);
check(errs.length === 0, `aucune erreur (${errs.slice(0, 3).join(' | ')})`);

await ctx.close();
L.p.kill();
await wait(500);
fs.rmSync(tmp, { recursive: true, force: true });
