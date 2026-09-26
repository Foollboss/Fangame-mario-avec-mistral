// Essai de l'application de bureau (Linux, écran virtuel) : même main.cjs que sous Windows.
//   xvfb-run -a node test-electron.mjs
import { _electron as electron } from 'playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const here = import.meta.dirname;
const userData = fs.mkdtempSync(path.join(os.tmpdir(), 'voxerra-desktop-'));
const exe = path.join(here, 'node_modules/electron/dist/electron');
const shots = process.argv[2] ?? path.join(here, 'dist');
const check = (ok, what) => {
  console.log(ok ? '✔' : '✘', what);
  if (!ok) process.exitCode = 1;
};
const launch = () => electron.launch({ executablePath: exe, args: [here, `--user-data-dir=${userData}`, '--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'], env: { ...process.env, LANG: 'fr_FR.UTF-8' } });

// 1) premier lancement : créer un monde, poser un repère, fermer la fenêtre
let appE = await launch();
let win = await appE.firstWindow();
await win.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
check(await win.evaluate(() => typeof window.voxerraHost?.quit === 'function'), 'pont voxerraHost présent');
check((await win.title()) === 'Voxerra', 'titre de la fenêtre');
await win.screenshot({ path: path.join(shots, 'bureau-menu.png') });
for (const l of ['Solo', 'Créer un nouveau monde', 'Créer le nouveau monde']) {
  await win.locator('button:visible', { hasText: l }).first().click();
  await win.waitForTimeout(400);
}
await win.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
await win.waitForTimeout(1500);
await win.screenshot({ path: path.join(shots, 'bureau-jeu.png') });
const mark = await win.evaluate(() => {
  const p = window.voxerra.game.player;
  p.inventory.set(0, { id: 'bloc_or', count: 42 });
  return { x: p.x, z: p.z };
});
// fermeture de la fenêtre (croix) : le monde doit être sauvegardé
await appE.evaluate(({ BrowserWindow }) => BrowserWindow.getAllWindows()[0].close());
await appE.waitForEvent('close', { timeout: 15000 }).catch(() => {});
await appE.close().catch(() => {});

// 2) relance : le monde est là, avec l'inventaire
appE = await launch();
win = await appE.firstWindow();
await win.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
await win.locator('button:visible', { hasText: 'Solo' }).first().click();
await win.waitForTimeout(600);
const worlds = await win.locator('.world-item').count();
check(worlds === 1, `monde retrouvé après relance (${worlds})`);
await win.locator('.world-item').first().dblclick();
await win.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
const inv = await win.evaluate(() => window.voxerra.game.player.inventory.get(0));
check(inv?.id === 'bloc_or' && inv.count === 42, `inventaire sauvegardé à la fermeture (${JSON.stringify(inv)})`);
// Ctrl+R ne recharge plus la page (Ctrl = courir, R = courir)
await win.evaluate(() => (window.__marker = 1));
await win.keyboard.press('Control+R');
await win.waitForTimeout(800);
check(await win.evaluate(() => window.__marker === 1), 'Ctrl+R ne recharge pas le jeu');
// 3) retour au titre puis « Quitter le jeu » ferme l'application
await win.evaluate(() => window.voxerra.quitToTitle());
await win.waitForFunction(() => document.querySelector('.menu-buttons'), null, { timeout: 60000 });
const closed = appE.waitForEvent('close', { timeout: 15000 }).then(() => true, () => false);
await win.locator('button:visible', { hasText: 'Quitter le jeu' }).first().click();
check(await closed, '« Quitter le jeu » ferme l’application');
fs.rmSync(userData, { recursive: true, force: true });
