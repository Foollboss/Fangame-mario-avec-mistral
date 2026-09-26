// Essai du lanceur (Linux, écran virtuel) avec Chromium à la place d'Edge.
//   go build -o dist/voxerra-test . && xvfb-run -a node test-launcher.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = import.meta.dirname;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'voxerra-launcher-'));
const check = (ok, what) => {
  console.log(ok ? '✔' : '✘', what);
  if (!ok) process.exitCode = 1;
};
const start = () => {
  const p = spawn(path.join(here, 'dist/voxerra-test'), [], {
    env: {
      ...process.env,
      VOXERRA_BROWSER: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      VOXERRA_BROWSER_ARGS: `--remote-debugging-port=9333 --user-data-dir=${profile} --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --lang=fr-FR`,
    },
    stdio: 'inherit',
  });
  const exited = new Promise((r) => p.on('exit', (code) => r(code)));
  return { p, exited };
};
const fr = (pg) => pg.evaluate(() => {
  window.voxerra.setLanguage('fr');
  window.voxerra.showMainMenu();
});
const connect = async () => {
  for (let i = 0; i < 60; i++) {
    try {
      const b = await chromium.connectOverCDP('http://127.0.0.1:9333');
      for (let j = 0; j < 60; j++) {
        const pg = b.contexts().flatMap((c) => c.pages()).find((x) => x.url().startsWith('http://127.0.0.1:47183'));
        if (pg) return { b, pg };
        await new Promise((r) => setTimeout(r, 500));
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error('fenêtre introuvable');
};

// 1) premier lancement
let L = start();
let { b, pg } = await connect();
await pg.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
check(await pg.evaluate(() => window.voxerraHost?.platform === 'launcher'), 'jeu servi par le lanceur, pont présent');
await fr(pg);
for (const l of ['Solo', 'Créer un nouveau monde', 'Créer le nouveau monde']) {
  await pg.locator('button:visible', { hasText: l }).first().click();
  await pg.waitForTimeout(400);
}
await pg.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
await pg.waitForTimeout(1000);
await pg.screenshot({ path: path.join(process.argv[2] ?? here, 'lanceur-jeu.png') });
await pg.evaluate(() => window.voxerra.game.player.inventory.set(0, { id: 'bloc_or', count: 7 }));
await pg.evaluate(() => window.voxerra.quitToTitle());
await pg.waitForFunction(() => document.querySelector('.menu-buttons'), null, { timeout: 60000 });
const closed = new Promise((r) => pg.on('close', () => r(true)));
await pg.locator('button:visible', { hasText: 'Quitter le jeu' }).first().click();
const code = await Promise.race([L.exited, new Promise((r) => setTimeout(() => r('délai'), 8000))]);
check(code === 0, `« Quitter le jeu » arrête le lanceur (code ${code})`);
check(await Promise.race([closed, new Promise((r) => setTimeout(() => r(false), 5000))]), '… et ferme la fenêtre');
await b.close().catch(() => {});
await new Promise((r) => setTimeout(r, 1500));

// 2) relance : même adresse, même profil → le monde est là
L = start();
({ b, pg } = await connect());
await pg.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
await fr(pg);
await pg.locator('button:visible', { hasText: 'Solo' }).first().click();
await pg.waitForTimeout(600);
await pg.locator('.world-item').first().dblclick();
await pg.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
const inv = await pg.evaluate(() => window.voxerra.game.player.inventory.get(0));
check(inv?.id === 'bloc_or' && inv.count === 7, `monde retrouvé après relance (${JSON.stringify(inv)})`);
// fermer la fenêtre (Ctrl+W) en pleine partie demande confirmation
const dialog = new Promise((r) => pg.once('dialog', async (d) => {
  r(d.type());
  await d.dismiss();
}));
await pg.close({ runBeforeUnload: true });
check((await Promise.race([dialog, new Promise((r) => setTimeout(() => r('aucune'), 5000))])) === 'beforeunload', 'fermer pendant une partie demande confirmation');
check(!pg.isClosed(), '… et la partie reste ouverte si on refuse');
// deuxième lancement pendant que le premier tourne : ouvre une fenêtre et s'arrête aussitôt
const second = spawn(path.join(here, 'dist/voxerra-test'), [], { env: { ...process.env, VOXERRA_BROWSER: '/bin/true' } });
const code2 = await Promise.race([new Promise((r) => second.on('exit', r)), new Promise((r) => setTimeout(() => r('délai'), 5000))]);
check(code2 === 0, `deuxième lancement : rend la main (code ${code2})`);
L.p.kill();
await b.close().catch(() => {});
fs.rmSync(profile, { recursive: true, force: true });
