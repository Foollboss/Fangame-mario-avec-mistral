// Vérifie les contrôles tactiles sur un téléphone émulé (joystick, regard,
// barre rapide, bouton de saut) et la molette sur ordinateur (la case
// sélectionnée garde sa taille).
import { chromium } from 'playwright';
import fs from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:5173/';
const outDir = process.argv[3] ?? 'screenshots/tactile';
fs.mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const check = (ok, what) => {
  console.log(ok ? '✔' : '✘', what);
  if (!ok) process.exitCode = 1;
};

async function newWorld(page) {
  await page.goto(url);
  await page.waitForTimeout(4000);
  for (const l of ['Solo', 'Créer un nouveau monde', 'Créer le nouveau monde']) {
    await page.locator('button:visible', { hasText: l }).first().click();
    await page.waitForTimeout(400);
  }
  await page.waitForFunction(() => window.voxerra?.game && !window.voxerra.ui.open, null, { timeout: 90000 });
  await page.waitForTimeout(2500);
}

// --- téléphone -------------------------------------------------------------
{
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1, locale: 'fr-FR' });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await newWorld(page);
  const cdp = await ctx.newCDPSession(page);
  const touch = (type, points) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points.map(([x, y, id]) => ({ x, y, id })) });

  check(await page.locator('.touch-ui').isVisible(), 'contrôles tactiles affichés (activés automatiquement sur écran tactile)');
  await page.screenshot({ path: `${outDir}/telephone-jeu.png` });

  // dégage les alentours (le monde est aléatoire : arbres, falaises…)
  await page.evaluate(() => {
    const g = window.voxerra.game,
      p = g.player,
      w = g.sim.world(p.dim);
    const x0 = Math.floor(p.x),
      y0 = Math.floor(p.y),
      z0 = Math.floor(p.z);
    const floor = w.getBlock(x0, y0 - 1, z0) || 1;
    for (let x = -12; x <= 12; x++)
      for (let z = -12; z <= 12; z++) {
        w.setBlock(x0 + x, y0 - 1, z0 + z, floor);
        for (let y = 0; y <= 5; y++) w.setBlock(x0 + x, y0 + y, z0 + z, 0);
      }
  });
  await page.waitForTimeout(500);

  // joystick poussé vers l'avant pendant 1,5 s
  const joy = await page.locator('.touch-joy').boundingBox();
  const cx = joy.x + joy.width / 2,
    cy = joy.y + joy.height / 2;
  const p0 = await page.evaluate(() => ({ x: window.voxerra.game.player.x, z: window.voxerra.game.player.z, yaw: window.voxerra.game.player.yaw }));
  await touch('touchStart', [[cx, cy, 1]]);
  await touch('touchMove', [[cx, cy - joy.height * 0.45, 1]]);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/telephone-joystick.png` });
  await page.waitForTimeout(1100);
  await touch('touchEnd', []);
  const p1 = await page.evaluate(() => ({ x: window.voxerra.game.player.x, z: window.voxerra.game.player.z }));
  const moved = Math.hypot(p1.x - p0.x, p1.z - p0.z);
  check(moved > 1, `le joystick fait avancer le joueur (${moved.toFixed(2)} blocs)`);

  // regard : glisser sur la moitié droite de l'écran
  await touch('touchStart', [[560, 150, 2]]);
  for (let i = 1; i <= 6; i++) {
    await touch('touchMove', [[560 - i * 20, 150, 2]]);
    await page.waitForTimeout(30);
  }
  await touch('touchEnd', []);
  await page.waitForTimeout(100);
  const yaw1 = await page.evaluate(() => window.voxerra.game.player.yaw);
  check(Math.abs(yaw1 - p0.yaw) > 0.1, `glisser le doigt tourne la vue (${(yaw1 - p0.yaw).toFixed(2)} rad)`);

  // barre rapide : toucher la 5e case
  const hb = await page.locator('.hotbar').boundingBox();
  await touch('touchStart', [[hb.x + (hb.width / 9) * 4.5, hb.y + hb.height / 2, 3]]);
  await touch('touchEnd', []);
  await page.waitForTimeout(150);
  check((await page.evaluate(() => window.voxerra.game.player.inventory.selected)) === 4, 'toucher la barre rapide sélectionne la case');

  // saut
  const jump = await page.locator('.touch-btn.jump').boundingBox();
  const y0 = await page.evaluate(() => window.voxerra.game.player.y);
  await touch('touchStart', [[jump.x + jump.width / 2, jump.y + jump.height / 2, 4]]);
  const jumped = await page.waitForFunction((y0) => window.voxerra.game.player.y > y0 + 0.3, y0, { timeout: 3000 }).then(() => true, () => false);
  await touch('touchEnd', []);
  check(jumped, 'le bouton de saut fait sauter');

  // inventaire (bouton 🎒) puis fermeture avec ✕
  const tapEl = async (sel, id) => {
    const b = await page.locator(sel).boundingBox();
    await touch('touchStart', [[b.x + b.width / 2, b.y + b.height / 2, id]]);
    await touch('touchEnd', []);
  };
  await page.evaluate(() => window.voxerra.game.player.inventory.give({ id: 'pain', count: 5 }));
  await tapEl('.touch-btn[aria-label="Inventaire"]', 6);
  const invOpen = await page.waitForFunction(() => window.voxerra.ui.open, null, { timeout: 5000 }).then(() => true, () => false);
  check(invOpen, 'le bouton sac ouvre l’inventaire');
  await page.waitForTimeout(400);
  check(await page.locator('.touch-close').isVisible(), 'bouton ✕ affiché');
  await page.screenshot({ path: `${outDir}/telephone-inventaire.png` });
  // toucher une case prend la pile, toucher une case vide la pose
  const withItem = page.locator('.screen .slot:has(img)').last();
  await withItem.tap();
  await page.waitForTimeout(300);
  const took = await page.evaluate(() => window.voxerra.game.player.inventory.cursor?.id ?? null);
  await withItem.tap();
  await page.waitForTimeout(300);
  const put = await page.evaluate(() => window.voxerra.game.player.inventory.cursor);
  check(took === 'pain' && !put, `toucher une case prend puis repose la pile (${took})`);
  await page.locator('.touch-close').tap();
  await page.waitForTimeout(400);
  const back = await page.waitForFunction(() => !window.voxerra.ui.open && window.voxerra.touch.visible, null, { timeout: 5000 }).then(() => true, () => false);
  check(back, '✕ ferme l’inventaire et les contrôles reviennent');

  // pause → options → commandes
  const pause = page.locator('.touch-btn[aria-label="Menu du jeu"]');
  const pb = await pause.boundingBox();
  await touch('touchStart', [[pb.x + pb.width / 2, pb.y + pb.height / 2, 5]]);
  await touch('touchEnd', []);
  const hid = await page.waitForFunction(() => window.voxerra.ui.open && !window.voxerra.touch.visible, null, { timeout: 5000 }).then(() => true, () => false);
  check(hid, 'les contrôles se masquent quand un menu est ouvert');
  await page.locator('button:visible', { hasText: 'Options' }).first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/telephone-options.png` });
  await page.locator('button:visible', { hasText: 'Commandes' }).first().click();
  await page.waitForTimeout(400);
  const first = await page.locator('.screen button:visible').first().textContent();
  check(first.startsWith('Contrôles tactiles'), `premier bouton des commandes : « ${first} »`);
  await page.screenshot({ path: `${outDir}/telephone-commandes.png` });
  // désactiver depuis Commandes puis revenir : Options est à jour
  await page.locator('button:visible', { hasText: 'Contrôles tactiles' }).first().click();
  await page.locator('button:visible', { hasText: 'Terminé' }).first().click();
  await page.waitForTimeout(300);
  const opt = await page.locator('button:visible', { hasText: 'Contrôles tactiles' }).first().textContent();
  check(opt.endsWith('NON'), `Options reflète le changement : « ${opt} »`);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('voxerra.settings.v1')).touchControls);
  check(saved === false, 'réglage sauvegardé');
  console.log('téléphone', errors.length ? errors.join(' | ') : 'sans erreur');
  await ctx.close();
}

// --- ordinateur : molette ---------------------------------------------------
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, locale: 'fr-FR' });
  await newWorld(page);
  check(await page.locator('.touch-ui').isHidden(), 'pas de contrôles tactiles sur ordinateur par défaut');
  const size = () => page.evaluate(() => [...document.querySelectorAll('.hotbar .hslot')].map((e) => e.getBoundingClientRect().width));
  const before = await size();
  await page.evaluate(() => window.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, bubbles: true })));
  await page.waitForTimeout(200);
  const after = await size();
  const sel = await page.evaluate(() => window.voxerra.game.player.inventory.selected);
  check(new Set(after).size === 1, `toutes les cases ont la même taille après la molette (${[...new Set(after)].join(', ')} px, avant ${[...new Set(before)].join(', ')})`);
  console.log('case sélectionnée après la molette :', sel);
  await page.mouse.move(640, 650);
  await page.screenshot({ path: `${outDir}/ordinateur-barre.png`, clip: { x: 390, y: 600, width: 500, height: 120 } });
  await page.close();
}
await browser.close();
