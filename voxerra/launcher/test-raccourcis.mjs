// Raccourcis dans la fenêtre du lanceur, avec de vraies touches (xdotool) : Ctrl+W ne ferme
// pas le jeu, et la molette change de case même avec Ctrl (courir), Maj ou Z tenus.
//   go build -o dist/voxerra-test . && xvfb-run -a node test-raccourcis.mjs   (xdotool requis)
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = import.meta.dirname;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'voxerra-raccourcis-'));
const check = (ok, what) => {
  console.log(ok ? '✔' : '✘', what);
  if (!ok) process.exitCode = 1;
};
const xdo = (...args) => execFileSync('xdotool', args, { encoding: 'utf8' }).trim();
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const L = spawn(path.join(here, 'dist/voxerra-test'), [], {
  env: {
    ...process.env,
    VOXERRA_BROWSER: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    VOXERRA_BROWSER_ARGS: `--remote-debugging-port=9334 --user-data-dir=${profile} --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --lang=fr-FR`,
  },
  stdio: 'inherit',
});
let exited = false;
L.on('exit', () => (exited = true));

let b, pg;
for (let i = 0; i < 120 && !pg; i++) {
  try {
    b ??= await chromium.connectOverCDP('http://127.0.0.1:9334');
    pg = b.contexts().flatMap((c) => c.pages()).find((x) => x.url().startsWith('http://127.0.0.1:47183'));
  } catch {}
  if (!pg) await wait(500);
}
if (!pg) throw new Error('fenêtre introuvable');
const dialogs = [];
pg.on('dialog', (d) => {
  dialogs.push(d.type());
  d.dismiss().catch(() => {});
});
let closed = false;
pg.on('close', () => (closed = true));

await pg.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
await pg.evaluate(() => {
  window.voxerra.setLanguage('fr');
  window.voxerra.showMainMenu();
});
for (const l of ['Solo', 'Créer un nouveau monde', 'Créer le nouveau monde']) {
  await pg.locator('button:visible', { hasText: l }).first().click();
  await wait(400);
}
await pg.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
await wait(1500);

// fenêtre du jeu au premier plan, clic dans la vue (verrouillage de la souris)
const win = xdo('search', '--onlyvisible', '--name', 'Voxerra').split('\n').pop();
xdo('windowfocus', '--sync', win);
xdo('mousemove', '--window', win, '400', '300');
xdo('click', '1');
await wait(500);
const alive = () => !closed && !exited && dialogs.length === 0;
const slot = () => pg.evaluate(() => window.voxerra.game.player.inventory.selected);
const inGame = () => pg.evaluate(() => !!window.voxerra.game && !window.voxerra.ui.open);

// molette avec des touches tenues
for (const [keys, what] of [
  [[], 'molette seule'],
  [['w'], 'molette + Z'],
  [['shift'], 'molette + Maj (s’accroupir)'],
  [['ctrl'], 'molette + Ctrl (courir)'],
  [['ctrl', 'w'], 'molette + Ctrl + Z'],
]) {
  const before = await slot();
  for (const k of keys) xdo('keydown', k);
  await wait(150);
  xdo('click', '5');
  await wait(250);
  for (const k of [...keys].reverse()) xdo('keyup', k);
  await wait(150);
  const after = await slot();
  check(after === (before + 1) % 9, `${what} : case ${before} → ${after}`);
}

// Ctrl+W bref, puis maintenu (répétition de touche) en courant
const z0 = await pg.evaluate(() => window.voxerra.game.player.z);
xdo('key', 'ctrl+w');
await wait(1500);
check(alive() && (await inGame()), `Ctrl+W ne ferme pas le jeu (boîtes de dialogue : ${dialogs.length})`);
xdo('keydown', 'ctrl');
xdo('keydown', 'w');
await wait(2000);
const sprinting = await pg.evaluate(() => window.voxerra.game.player.sprinting);
xdo('keyup', 'w');
xdo('keyup', 'ctrl');
await wait(800);
const z1 = await pg.evaluate(() => window.voxerra.game.player.z);
check(alive() && (await inGame()), `Ctrl+W maintenu : le jeu reste ouvert`);
check(sprinting === true && Math.abs(z1 - z0) > 3, `… et le joueur court (${Math.abs(z1 - z0).toFixed(1)} blocs, course ${sprinting})`);
// Ctrl+R (R = courir aussi) ne recharge pas la page
const navs = [];
pg.on('framenavigated', (f) => f === pg.mainFrame() && navs.push(f.url()));
xdo('key', 'ctrl+r');
await wait(1500);
check(alive() && navs.length === 0 && (await inGame()), 'Ctrl+R ne recharge pas la page');

// menu pause ouvert : Ctrl+W ne ferme pas non plus
xdo('key', 'Escape');
await wait(600);
check(await pg.evaluate(() => window.voxerra.ui.open), 'menu pause ouvert');
xdo('key', 'ctrl+w');
await wait(1500);
check(alive(), `Ctrl+W dans le menu pause : le jeu reste ouvert (boîtes de dialogue : ${dialogs.length})`);

// sortie propre
if (!closed) {
  await pg.evaluate(() => window.voxerra.quitToTitle()).catch(() => {});
  await pg.waitForFunction(() => document.querySelector('.menu-buttons'), null, { timeout: 60000 }).catch(() => {});
  await pg.evaluate(() => window.voxerraHost?.quit?.()).catch(() => {});
}
for (let i = 0; i < 20 && !exited; i++) await wait(250);
if (!exited) L.kill();
await b.close().catch(() => {});
fs.rmSync(profile, { recursive: true, force: true });
