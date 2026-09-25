// Captures du menu, de la création de monde et de l'inventaire dans chaque langue.
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const outDir = process.argv[3] ?? 'screenshots/langues';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
for (const lang of ['en', 'es', 'fr']) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.addInitScript((lang) => localStorage.setItem('voxerra.settings.v1', JSON.stringify({ language: lang })), lang);
  await page.goto(url);
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `${outDir}/${lang}-menu.png` });
  const labels = { en: ['Singleplayer', 'Create New World', 'Create New World'], es: ['Un jugador', 'Crear un mundo nuevo', 'Crear el nuevo mundo'], fr: ['Solo', 'Créer un nouveau monde', 'Créer le nouveau monde'] }[lang];
  for (const l of labels) {
    await page.locator('button:visible', { hasText: l }).first().click();
    await page.waitForTimeout(500);
  }
  await page.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 90000 }).catch(() => console.log(lang, 'timeout'));
  await page.waitForTimeout(2500);
  await page.evaluate(() => {
    const g = window.voxerra.game;
    g.player.inventory.give({ id: 'pioche_fer', count: 1 });
    g.player.inventory.give({ id: 'planches_chene_dalle', count: 12 });
    g.player.inventory.give({ id: 'pain', count: 5 });
    g.openInventory();
  });
  await page.waitForTimeout(800);
  const slot = page.locator('.slot img').first();
  await slot.hover().catch(() => {});
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/${lang}-inventaire.png` });
  console.log(lang, errors.length ? errors.join(' | ') : 'ok');
  await page.close();
}
await browser.close();
