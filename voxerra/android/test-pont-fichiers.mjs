// Pont « fichiers » de l'appli Android, vu du jeu : la page reçoit un voxerraHost qui imite celui de
// MainActivity (méthodes synchrones, réponse plus tard par window.__voxerraFichier / __voxerraEnregistre).
// Vérifie : importer un pack de mod, annuler le choix, exporter un monde, capture d'écran.
//   npm run build:html && node android/test-pont-fichiers.mjs
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const html = fs.readFileSync(path.join(root, 'Voxerra.html'));
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/`;

const check = (ok, what) => {
  console.log(ok ? '✔' : '✘', what);
  if (!ok) process.exitCode = 1;
};
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1000, height: 640 }, locale: 'fr-FR' });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

// le pack « choisi » dans le sélecteur du téléphone
const pack = JSON.parse(fs.readFileSync(path.join(root, 'public/mods/lucioles.json'), 'utf8'));
pack.id = 'lucioles_tel';
pack.name = 'Lucioles du téléphone';
await page.addInitScript((packText) => {
  const calls = (window.__pont = { open: [], save: [], next: 'pack' });
  // comme addJavascriptInterface : appels synchrones sans valeur de retour, réponse asynchrone
  window.voxerraHost = {
    openTextFile(id) {
      calls.open.push(id);
      const answer = calls.next;
      setTimeout(() => {
        if (answer === 'annule') window.__voxerraFichier(id, null, null);
        else window.__voxerraFichier(id, 'lucioles_tel.json', packText);
      }, 150);
    },
    saveFile(id, name, mime, base64) {
      calls.save.push({ id, name, mime, size: atob(base64).length, head: atob(base64).slice(0, 8) });
      setTimeout(() => window.__voxerraEnregistre(id, true), 150);
    },
    quit() {},
  };
}, JSON.stringify(pack));
await page.goto(url);
await page.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
await page.evaluate(() => {
  window.voxerra.setLanguage('fr');
  window.voxerra.showMainMenu();
});

// 1) importer un pack : le jeu demande le fichier à l'appli, pas à un <input type="file">
await page.locator('button:visible', { hasText: 'Mods et contenu' }).click();
await page.evaluate(() => (window.__pont.next = 'annule'));
await page.locator('button:visible', { hasText: 'Importer un pack JSON…' }).click();
await page.waitForTimeout(600);
check((await page.evaluate(() => window.__pont.open.length)) === 1, 'choix d’un fichier demandé à l’appli');
check(!(await page.locator('.world-item', { hasText: 'lucioles_tel' }).count()), 'choix annulé : rien n’est importé');
await page.evaluate(() => (window.__pont.next = 'pack'));
await page.locator('button:visible', { hasText: 'Importer un pack JSON…' }).click();
check(
  await page
    .locator('.world-item', { hasText: 'lucioles_tel' })
    .waitFor({ timeout: 5000 })
    .then(() => true, () => false),
  'pack importé et listé dans « Mods et contenu »',
);
const status = await page.locator('.hint', { hasText: 'importé' }).textContent().catch(() => '');
check(/Lucioles du téléphone/.test(status), `message : ${status}`);
check(await page.evaluate(() => JSON.parse(localStorage.getItem('voxerra.mods.v1') ?? '[]').some((p) => p.id === 'lucioles_tel')), 'pack gardé pour les prochains lancements');
check((await page.locator('input[type=file]').count()) === 0, 'aucun <input type="file"> laissé dans la page');
// « Relancer le jeu » : le pack est actif au redémarrage (pas de « recharger la page » dans l'appli)
await page.locator('button:visible', { hasText: 'Relancer le jeu' }).click();
await page.waitForFunction(() => window.voxerra && document.querySelector('.menu-buttons'), null, { timeout: 60000 });
check(await page.evaluate(() => window.voxerra.content.blocks.byId.has('verre_luciole') && window.voxerra.mods.some((m) => m.id === 'lucioles_tel')), 'après « Relancer le jeu », le pack est actif');
await page.evaluate(() => window.voxerra.setLanguage('fr'));

// 2) exporter un monde : « Enregistrer sous » de l'appli
await page.evaluate(() => window.voxerra.showMainMenu());
for (const l of ['Solo', 'Créer un nouveau monde', 'Créer le nouveau monde']) {
  await page.locator('button:visible', { hasText: l }).first().click();
  await page.waitForTimeout(400);
}
await page.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 120000 });
await page.waitForTimeout(1500);
// capture d'écran (F2)
await page.evaluate(() => window.voxerra.game.screenshot());
await page.waitForTimeout(800);
const shot = await page.evaluate(() => window.__pont.save.find((s) => s.name.endsWith('.png')));
check(!!shot && shot.mime === 'image/png' && shot.head.startsWith('\x89PNG') && shot.size > 1000, `capture d’écran envoyée à l’appli (${shot?.name}, ${shot?.size} octets)`);
check(await page.evaluate(() => document.querySelector('.chat')?.textContent.includes('Capture d’écran enregistrée.')), 'message « Capture d’écran enregistrée. »');
await page.evaluate(() => window.voxerra.quitToTitle());
await page.waitForTimeout(800);
await page.locator('button:visible', { hasText: 'Solo' }).first().click();
await page.locator('.world-item').first().click();
await page.locator('button:visible', { hasText: /^Modifier$/ }).click();
await page.locator('button:visible', { hasText: 'Exporter (JSON des paramètres)' }).click();
await page.waitForTimeout(800);
const exp = await page.evaluate(() => window.__pont.save.find((s) => s.name.endsWith('.json')));
check(!!exp && exp.mime === 'application/json' && exp.head.startsWith('{'), `monde exporté par l’appli (${exp?.name}, ${exp?.size} octets)`);
check(errors.length === 0, `aucune erreur (${errors.slice(0, 3).join(' | ')})`);

await browser.close();
server.close();
