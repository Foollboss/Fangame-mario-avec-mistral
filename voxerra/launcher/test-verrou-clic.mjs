// « Verrouillage du clic » de Windows, simulé sous Linux (VOXERRA_TEST_CLICKLOCK=1) : le jeu le
// signale, le coupe pendant la session si on accepte, s'en souvient, et le lanceur le rétablit en quittant.
//   go build -o dist/voxerra-test . && xvfb-run -a node test-verrou-clic.mjs
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = import.meta.dirname;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'voxerra-verrou-'));
const check = (ok, what) => {
  console.log(ok ? '✔' : '✘', what);
  if (!ok) process.exitCode = 1;
};
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const souris = () => fetch('http://127.0.0.1:47183/souris').then((r) => r.json());

const start = () => {
  let out = '';
  const p = spawn(path.join(here, 'dist/voxerra-test'), [], {
    env: {
      ...process.env,
      VOXERRA_TEST_CLICKLOCK: '1',
      VOXERRA_BROWSER: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
      VOXERRA_BROWSER_ARGS: `--remote-debugging-port=9337 --user-data-dir=${profile} --no-sandbox --use-angle=swiftshader --enable-unsafe-swiftshader --lang=fr-FR`,
    },
  });
  p.stdout.on('data', (d) => (out += d));
  const exited = new Promise((r) => p.on('exit', (code) => r(code)));
  return { p, exited, out: () => out };
};
const connect = async () => {
  for (let i = 0; i < 120; i++) {
    try {
      const b = await chromium.connectOverCDP('http://127.0.0.1:9337');
      const pg = b.contexts().flatMap((c) => c.pages()).find((x) => x.url().startsWith('http://127.0.0.1:47183'));
      if (pg) return { b, pg };
      await b.close().catch(() => {});
    } catch {}
    await wait(500);
  }
  throw new Error('fenêtre introuvable');
};
const quit = async (L, pg) => {
  await pg.locator('button:visible', { hasText: 'Quitter le jeu' }).first().click();
  return Promise.race([L.exited, wait(8000).then(() => 'délai')]);
};

// 1) premier lancement : le jeu signale le verrouillage et propose de le couper
let L = start();
let { b, pg } = await connect();
await pg.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
// le navigateur d'essai démarre en anglais : jeu en français, puis rechargement
await pg.evaluate(() => localStorage.setItem('voxerra.settings.v1', JSON.stringify({ ...window.voxerra.settings, language: 'fr' })));
await pg.reload();
await pg.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
const title = pg.locator('.title', { hasText: 'Verrouillage du clic de Windows' });
await title.waitFor({ timeout: 10000 }).catch(() => {});
check(await title.isVisible(), 'écran « Verrouillage du clic de Windows » affiché au lancement');
check(await pg.locator('.subtitle', { hasText: 'plus de 1,2 s' }).isVisible(), 'délai de Windows indiqué (1,2 s)');
await pg.locator('button:visible', { hasText: 'Le couper en jeu' }).click();
await wait(500);
let m = await souris();
check(!m.verrouClic && m.coupe, `coupé pour la session (${JSON.stringify(m)})`);
check(await pg.evaluate(() => window.voxerra.settings.clickLock === 'couper'), 'choix enregistré');
// Options : le réglage apparaît et permet de revenir en arrière
await pg.locator('button:visible', { hasText: 'Options...' }).click();
const opt = pg.locator('button:visible', { hasText: 'Verrouillage du clic (Windows)' });
await opt.waitFor({ timeout: 5000 }).catch(() => {});
check((await opt.textContent())?.includes('coupé en jeu'), `Options : « ${await opt.textContent()} »`);
await opt.click();
await wait(500);
m = await souris();
check(m.verrouClic && !m.coupe, `Options → laissé actif : rétabli (${JSON.stringify(m)})`);
await opt.click();
await wait(500);
m = await souris();
check(!m.verrouClic && m.coupe, 'Options → coupé en jeu : coupé à nouveau');
await pg.locator('button:visible', { hasText: 'Terminé' }).click();
await wait(300);
const code = await quit(L, pg);
check(code === 0 && /simulé\) : true\s*$/.test(L.out()), `en quittant, le lanceur rétablit le verrouillage (code ${code})`);
await b.close().catch(() => {});
await wait(1500);

// 2) relance : le choix est retenu, plus de question, coupé d'office
L = start();
({ b, pg } = await connect());
await pg.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
await wait(1500);
m = await souris();
check(!(await pg.locator('.title', { hasText: 'Verrouillage du clic de Windows' }).isVisible()) && !m.verrouClic && m.coupe, `relance : pas de question, coupé d'office (${JSON.stringify(m)})`);
check((await quit(L, pg)) === 0 && /simulé\) : true\s*$/.test(L.out()), 'rétabli en quittant');
await b.close().catch(() => {});
fs.rmSync(profile, { recursive: true, force: true });
