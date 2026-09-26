// Minage au clic gauche maintenu, avec de vrais clics (xdotool) dans la fenêtre du lanceur :
// relâcher le bouton arrête le minage, même après l'avoir tenu plusieurs secondes.
//   go build -o dist/voxerra-test . && xvfb-run -a node test-minage.mjs   (xdotool requis)
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = import.meta.dirname;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'voxerra-minage-'));
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
    VOXERRA_BROWSER_ARGS: `--remote-debugging-port=9336 --user-data-dir=${profile} --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --lang=fr-FR`,
  },
  stdio: 'inherit',
});
let b, pg;
for (let i = 0; i < 120 && !pg; i++) {
  try {
    b ??= await chromium.connectOverCDP('http://127.0.0.1:9336');
    pg = b.contexts().flatMap((c) => c.pages()).find((x) => x.url().startsWith('http://127.0.0.1:47183'));
  } catch {}
  if (!pg) await wait(500);
}
if (!pg) throw new Error('fenêtre introuvable');
pg.on('dialog', (d) => d.dismiss().catch(() => {}));
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

const win = xdo('search', '--onlyvisible', '--name', 'Voxerra').split('\n').pop();
xdo('windowfocus', '--sync', win);
xdo('mousemove', '--window', win, '400', '300');
xdo('click', '3'); // clic droit : verrouille le pointeur sans rien casser
await wait(600);
const state = () =>
  pg.evaluate(() => {
    const g = window.voxerra.game;
    return { down: window.voxerra.input.isDown('attack'), breaking: !!g.controller.breaking, locked: window.voxerra.input.locked };
  });

// terrain : sol de pierre sous les pieds, regard vers le bas, mains vides, survie
const setup = () =>
  pg.evaluate(() => {
    const g = window.voxerra.game, p = g.player;
    p.gameMode = 'survie';
    p.inventory.set(p.inventory.selected, null);
    p.pitch = -Math.PI / 2 + 0.01;
    p.flying = false;
  });
await setup();
let locked = false;
for (let i = 0; i < 30 && !locked; i++) {
  await wait(100);
  locked = (await state()).locked;
}
check(locked, 'pointeur verrouillé');

for (const secs of [1, 4, 8]) {
  xdo('mousedown', '1');
  await wait(secs * 1000);
  const during = await state();
  xdo('mouseup', '1');
  await wait(700);
  const after = await state();
  let still = false;
  for (let i = 0; i < 5; i++) {
    const s = await state();
    still ||= s.down || s.breaking;
    await wait(200);
  }
  check(during.down && !after.down && !after.breaking && !still, `clic tenu ${secs} s : mine pendant (${during.down}), s'arrête au relâchement (touche tenue ${after.down}, minage ${after.breaking || still})`);
}

// relâchement perdu en route (défaut connu de Chromium) : le jeu reçoit l'appui mais jamais le
// relâchement ; il doit se fier à l'état réel des boutons dès que la souris bouge
await pg.evaluate(() => window.voxerra.input.canvas.dispatchEvent(new MouseEvent('mousedown', { button: 0, buttons: 1, bubbles: true })));
await wait(400);
const stuck = await state();
xdo('mousemove_relative', '--', '12', '0');
await wait(600);
const healed = await state();
check(stuck.down && !healed.down && !healed.breaking, `relâchement perdu : le minage s'arrête dès que la souris bouge (avant ${stuck.down}, après ${healed.down})`);
// idem si le verrouillage du pointeur saute pendant l'appui (Échap, changement de fenêtre…)
await pg.evaluate(() => window.voxerra.input.canvas.dispatchEvent(new MouseEvent('mousedown', { button: 0, buttons: 1, bubbles: true })));
xdo('key', 'Escape');
await wait(800);
check(!(await state()).down, 'verrouillage perdu pendant l’appui : bouton relâché');

await pg.evaluate(() => window.voxerra.quitToTitle()).catch(() => {});
await pg.waitForFunction(() => document.querySelector('.menu-buttons'), null, { timeout: 60000 }).catch(() => {});
await pg.evaluate(() => window.voxerraHost?.quit?.()).catch(() => {});
await wait(1500);
L.kill();
await b.close().catch(() => {});
fs.rmSync(profile, { recursive: true, force: true });
