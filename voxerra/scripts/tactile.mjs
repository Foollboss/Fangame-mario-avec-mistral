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
    window.__plat = { x: x0 + 0.5, y: y0, z: z0 + 0.5 };
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

  // bouton de course : un appui active la course même sans pousser le joystick à fond
  const toCenter = () => page.evaluate(() => {
    const p = window.voxerra.game.player,
      c = window.__plat;
    p.setPos(c.x, c.y, c.z);
    p.body.vx = p.body.vz = 0;
    p.energy = 20;
  });
  const sprintBox = await page.locator('.touch-btn[aria-label="Courir"]').boundingBox();
  const tapSprint = async (id) => {
    await touch('touchStart', [[sprintBox.x + sprintBox.width / 2, sprintBox.y + sprintBox.height / 2, id]]);
    await touch('touchEnd', []);
  };
  const halfForward = async (id, amount = 0.25) => {
    await touch('touchStart', [[cx, cy, id]]);
    await touch('touchMove', [[cx, cy - joy.height * amount, id]]);
    const sprinting = await page.waitForFunction(() => window.voxerra.game.player.sprinting, null, { timeout: 1500 }).then(() => true, () => false);
    await touch('touchEnd', []);
    return sprinting;
  };
  await toCenter();
  // joystick poussé à fond vers l'avant : on marche, on ne court pas tout seul
  const fullNoSprint = await halfForward(29, 0.6);
  check(!fullNoSprint, `joystick à fond sans bouton : pas de course automatique (${fullNoSprint})`);
  await toCenter();
  const walkOnly = await halfForward(30);
  await tapSprint(31);
  await toCenter();
  const withBtn = await halfForward(32);
  const lit = await page.locator('.touch-btn[aria-label="Courir"].on').count();
  await tapSprint(33);
  await toCenter();
  const off = await halfForward(34);
  check(!walkOnly && withBtn && lit === 1 && !off, `bouton 🏃 : course activée par un appui, coupée par un second (sans bouton ${walkOnly}, avec ${withBtn}, après ${off})`);
  await toCenter();

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
    // le rendu logiciel du navigateur de test est lent : on attend le retour des contrôles
    await page.waitForFunction(() => window.voxerra.touch.visible && !window.voxerra.ui.open, null, { timeout: 5000 }).catch(() => {});
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

  // Chauve-furie : appui bref en visant approximativement (aide à la visée) → coups
  await page.evaluate(() => {
    const g = window.voxerra.game,
      p = g.player;
    p.inventory.set(p.inventory.selected, { id: 'epee_fer', count: 1 });
    window.__bat = g.sim.spawnMob('chauve_furie', p.dim, p.x + 4, p.y + 2.5, p.z);
    p.health = p.maxHealth;
  });
  const bat0 = await page.evaluate(() => window.__bat.health);
  let taps = 0;
  for (let i = 0; i < 20; i++) {
    const alive = await page.evaluate(() => {
      const b = window.__bat,
        p = window.voxerra.game.player;
      if (b.dead || b.removed) return false;
      const dx = b.x - p.x,
        dy = b.y + b.body.h / 2 - (p.y + p.eye),
        dz = b.z - p.z;
      // visée volontairement décalée d'environ 5°
      p.yaw = Math.atan2(-dx, -dz) + 0.09;
      p.pitch = Math.atan2(dy, Math.hypot(dx, dz));
      p.health = p.maxHealth;
      return true;
    });
    if (!alive) break;
    await touch('touchStart', [[600, 120, 20 + i]]);
    await page.waitForTimeout(60);
    await touch('touchEnd', []);
    taps++;
    await page.waitForTimeout(450);
  }
  const bat1 = await page.evaluate(() => ({ h: window.__bat.health, dead: window.__bat.dead || window.__bat.removed }));
  check(bat1.dead || bat1.h < bat0, `appuis brefs sur la chauve-furie : ${bat1.dead ? 'vaincue' : `santé ${bat0} → ${bat1.h.toFixed(1)}`} en ${taps} appuis`);
  await page.evaluate(() => window.__bat && !window.__bat.removed && window.__bat.damage(999, { type: 'kill' }));

  // commandes : refus expliqué, puis bouton « / », suggestions et bouton d'envoi
  await tapEl('.touch-btn[aria-label="Commande"]', 40);
  await page.waitForFunction(() => document.activeElement?.classList.contains('chat-input'), null, { timeout: 5000 }).catch(() => {});
  check(await page.evaluate(() => document.activeElement?.classList.contains('chat-input') && document.activeElement.value === '/'), 'le bouton « / » ouvre la saisie avec le focus (clavier du téléphone)');
  await page.screenshot({ path: `${outDir}/telephone-commande.png` });
  await page.locator('.chat-chip', { hasText: /^\/temps$/ }).tap();
  await page.locator('.chat-chip', { hasText: /^nuit$/ }).tap();
  check((await page.locator('.chat-input').inputValue()) === '/temps nuit ', 'les suggestions complètent « /temps nuit »');
  await page.locator('.chat-send').tap();
  await page.waitForTimeout(400);
  const refus = await page.evaluate(() => document.querySelector('.chat').textContent);
  check(refus.includes('Autoriser les commandes'), 'sans autorisation : le message explique comment activer les commandes');
  await page.evaluate(() => (window.voxerra.game.sim.meta.allowCommands = true));
  await tapEl('.touch-btn[aria-label="Commande"]', 41);
  await page.waitForTimeout(300);
  await page.locator('.chat-chip', { hasText: /^\/temps$/ }).tap();
  await page.locator('.chat-chip', { hasText: /^nuit$/ }).tap();
  await page.screenshot({ path: `${outDir}/telephone-suggestions.png` });
  await page.locator('.chat-send').tap();
  await page.waitForTimeout(400);
  const tod = await page.evaluate(() => window.voxerra.game.sim.env.time % 24000);
  check(tod >= 13000 && tod < 14000 && !(await page.evaluate(() => window.voxerra.ui.open)), `« /temps nuit » exécutée avec le bouton d'envoi (heure ${tod})`);
  // touche Entrée du clavier
  await tapEl('.touch-btn[aria-label="Commande"]', 42);
  await page.waitForTimeout(300);
  await page.keyboard.type('meteo pluie');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(400);
  check(await page.evaluate(() => window.voxerra.game.sim.env.weather === 'pluie'), '« /meteo pluie » exécutée avec la touche Entrée');

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

// --- application Android : contrôles tactiles toujours actifs ----------------
{
  const ctx = await browser.newContext({
    viewport: { width: 900, height: 420 },
    hasTouch: false, // le navigateur signale une souris (pointeur précis) : seul le marqueur de l'appli compte
    locale: 'fr-FR',
    userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/140.0 Mobile Safari/537.36 VoxerraApp/Android',
  });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('pose')) {
      localStorage.setItem('voxerra.settings.v1', JSON.stringify({ touchControls: false, language: 'fr' }));
      sessionStorage.setItem('pose', '1');
    }
  });
  await newWorld(page);
  const on = await page.evaluate(() => ({ setting: window.voxerra.settings.touchControls, visible: window.voxerra.touch.visible, fine: matchMedia('(any-pointer: fine)').matches }));
  check(on.setting && on.visible, `appli Android : contrôles tactiles actifs malgré un ancien réglage à NON (pointeur précis signalé : ${on.fine})`);
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
