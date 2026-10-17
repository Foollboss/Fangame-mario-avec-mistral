// Test de l'apparence du personnage dans Chromium headless, en survie (commandes autorisées) :
// armure portée (7 matériaux) vue à la troisième personne, poupée de l'inventaire, nage,
// flottaison, vol plané avec le planeur (ailes déployées puis repliées), accroupi, rangée de
// bulles masquée hors de l'eau. Les états sont de vrais états de jeu (entrées simulées), jamais
// des poses forcées.
// Usage : node tools/build.mjs && node tools/appearance-test.mjs [dossier des captures]
import * as esbuild from 'esbuild';
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const out = resolve(process.argv[2] ?? join(root, 'test-results', 'appearance'));
await mkdir(out, { recursive: true });
if (!existsSync(join(dist, 'game.js'))) {
  console.error('dist/ absent : lancez d’abord « node tools/build.mjs »');
  process.exit(2);
}

// Identifiants des blocs et objets, lus dans les registres du jeu (mêmes sources que dist/).
const reg = await esbuild.build({
  stdin: { contents: "export { B } from './src/world/blocks'; export { ITEM_BY_KEY } from './src/items/items';", resolveDir: root, loader: 'ts' },
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'node',
  logLevel: 'silent',
});
const { B, ITEM_BY_KEY } = await import('data:text/javascript;base64,' + Buffer.from(reg.outputFiles[0].text).toString('base64'));
const MATS = ['leather', 'iron', 'golden', 'diamond', 'mythril', 'etherium', 'celestine'];
const PIECES = ['helmet', 'chestplate', 'leggings', 'boots'];
const items = {};
for (const k of [...MATS.flatMap((m) => PIECES.map((p) => `${m}_${p}`)), 'glider']) {
  const d = ITEM_BY_KEY.get(k);
  if (!d) throw new Error(`objet absent du registre : ${k}`);
  items[k] = d.id;
}
const blocks = {};
for (const k of ['stone', 'water', 'glass']) {
  if (B[k] === undefined) throw new Error(`bloc absent du registre : ${k}`);
  blocks[k] = B[k];
}

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ttf': 'font/ttf' };
const server = createServer(async (req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/') p = '/index.html';
  const file = join(dist, p);
  if (!file.startsWith(dist) || !existsSync(file)) {
    res.writeHead(404);
    res.end();
    return;
  }
  res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream' });
  res.end(await readFile(file));
});
await new Promise((r) => server.listen(0, r));
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

const results = [];
let failed = 0;
const check = (name, ok, info = '') => {
  results.push(`${ok ? '✔' : '✘'} ${name}${info ? ' — ' + info : ''}`);
  if (!ok) failed++;
  console.log(results[results.length - 1]);
};
const run = (fn, arg) => page.evaluate(fn, arg);
const wait = (ms) => page.waitForTimeout(ms);
const shots = [];
const shot = async (name) => {
  await page.screenshot({ path: join(out, name + '.png') });
  shots.push(name);
};
/** Masque l'interface (HUD, boutons) pour les captures du personnage. */
const hideUi = (on) =>
  run((on) => {
    let st = document.getElementById('appearance-hide-ui');
    if (on && !st) {
      st = document.createElement('style');
      st.id = 'appearance-hide-ui';
      st.textContent = 'body > *:not(#game) { display: none !important; }';
      document.head.appendChild(st);
    } else if (!on && st) st.remove();
  }, on);
/**
 * Caméra : 0 = première personne, 1 = dos, 2 = face (caméra du jeu) ; orbit = caméra de capture
 * autour du joueur { angle (0 = derrière, π/2 = à sa droite), elev, dist, ty (visée sous les yeux) }.
 */
const view = (mode, orbit = null) =>
  run(
    ([m, o]) => {
      window.voxelia.game.cameraRig.mode = m;
      window.__orbit = o;
    },
    [mode, orbit],
  );
const SIDE = { angle: Math.PI / 2, elev: 0.08, dist: 3.4, ty: 0 };
const THREE_QUARTER = { angle: 0.7, elev: 0.45, dist: 3.8, ty: 0 };
const touch = (state) => run((s) => Object.assign(window.voxelia.input.touch, s), state);

/** Pièces de la couche d'équipement de la vue du joueur local : « partie/pièce » → nombre de maillages visibles. */
const layer = () =>
  run(() => {
    const g = window.voxelia.game;
    const p = g.player;
    const v = g.entities.views.get(p.id);
    if (!v?.equip || !v.model) return null;
    const partOf = new Map([...v.model.parts].map(([k, o]) => [o, k]));
    const pieces = {};
    v.obj.traverse((o) => {
      if (!o.isMesh || !o.name.startsWith('equip:')) return;
      let vis = true;
      let part = null;
      for (let q = o; q; q = q.parent) {
        vis = vis && q.visible;
        part = part ?? partOf.get(q) ?? null;
      }
      const n = (o.geometry.index ? o.geometry.index.count : o.geometry.getAttribute('position').count) > 0;
      if (vis && n) {
        const k = `${part}/${o.name.slice(6)}`;
        pieces[k] = (pieces[k] ?? 0) + 1;
      }
    });
    const c = v.equip.material.color;
    return { pieces, wing: v.wing, armor: p.wornArmor().slice(), pose: p.pose, light: +c.r.toFixed(2), visible: v.obj.visible };
  });
/** Emprise verticale et horizontale du modèle (blocs, relative aux pieds de l'entité). */
const bounds = () =>
  run(() => {
    const g = window.voxelia.game;
    const p = g.player;
    const v = g.entities.views.get(p.id);
    const V = p.pos.constructor;
    v.obj.updateMatrixWorld(true);
    let y0 = Infinity;
    let y1 = -Infinity;
    let f0 = Infinity;
    let f1 = -Infinity;
    // Axe avant du joueur (lacet) : longueur du corps couché
    const fx = -Math.sin(p.yaw);
    const fz = -Math.cos(p.yaw);
    v.obj.traverse((o) => {
      if (!o.isMesh) return;
      if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
      const b = o.geometry.boundingBox;
      for (const x of [b.min.x, b.max.x])
        for (const y of [b.min.y, b.max.y])
          for (const z of [b.min.z, b.max.z]) {
            const w = o.localToWorld(new V(x, y, z));
            y0 = Math.min(y0, w.y);
            y1 = Math.max(y1, w.y);
            const f = (w.x - v.obj.position.x) * fx + (w.z - v.obj.position.z) * fz;
            f0 = Math.min(f0, f);
            f1 = Math.max(f1, f);
          }
    });
    const feet = v.obj.position.y;
    return { bottom: +(y0 - feet).toFixed(3), top: +(y1 - feet).toFixed(3), height: +(y1 - y0).toFixed(3), length: +(f1 - f0).toFixed(3) };
  });
/** Composante verticale de l'axe du torse (1 = debout, 0 = couché). */
const axis = () =>
  run(() => {
    const g = window.voxelia.game;
    const p = g.player;
    const body = g.entities.views.get(p.id).model.parts.get('body');
    const V = p.pos.constructor;
    body.updateMatrixWorld(true);
    const a = body.localToWorld(new V(0, 12, 0)).sub(body.localToWorld(new V(0, 0, 0))).normalize();
    return +a.y.toFixed(3);
  });
const state = () =>
  run(() => {
    const g = window.voxelia.game;
    const p = g.player;
    return { pose: p.pose, swimming: p.swimming, gliding: p.gliding, sneaking: p.sneaking, water: p.fluid.water, eyesInWater: p.fluid.eyesInWater, onGround: p.onGround, eye: +p.eyeHeight.toFixed(2), air: p.air, y: +p.pos.y.toFixed(2), z: +p.pos.z.toFixed(2) };
  });
/** Équipe un objet par un vrai clic droit (objet tenu en main, « utiliser » dans le vide). */
const rightClickEquip = (id) =>
  run(async (id) => {
    const g = window.voxelia.game;
    const p = g.player;
    p.inventory.set(0, { id, count: 1 });
    p.inventory.selected = 0;
    p.inventory.changed();
    await new Promise((r) => setTimeout(r, 120));
    window.voxelia.input.state.usePressed = true;
    await new Promise((r) => setTimeout(r, 350));
  }, id);

/** Pièces attendues pour chaque emplacement porté. */
const SLOT_PIECES = [
  ['head/helmet'],
  ['body/body', 'rightArm/sleeve', 'leftArm/sleeve'],
  ['body/belt', 'rightLeg/leg', 'leftLeg/leg'],
  ['rightLeg/boot', 'leftLeg/boot'],
];
const missing = (info, slots = [0, 1, 2, 3]) => slots.flatMap((s) => SLOT_PIECES[s].filter((k) => !info?.pieces[k]));

try {
  await page.goto(`http://localhost:${server.address().port}/`);
  await page.locator('.title-screen').waitFor({ timeout: 30000 });
  await run(() => {
    window.voxelia.settings.set('renderDistance', 4);
    window.voxelia.settings.set('fov', 55);
  });
  await page.locator('#ui').getByText(/^Jouer$/).first().click();
  await page.locator('#ui').getByText(/Créer un nouveau monde/i).first().click();
  await page.locator('#ui').getByText(/^CRÉER$/i).first().click();
  await page.waitForFunction(() => window.voxelia?.game?.ready === true && window.voxelia.ui.depth === 0, null, { timeout: 180000, polling: 500 });
  await wait(2000);

  // Survie avec commandes, plein jour, sans créatures ; estrade de pierre en hauteur (fond de ciel)
  // et, à côté, un bassin vitré de 7 × 30 blocs et 5 de profondeur pour la nage.
  const base = await run((ids) => {
    const g = window.voxelia.game;
    g.meta.cheats = true;
    g.meta.time = 6000;
    g.meta.rules.mobSpawning = false;
    g.meta.rules.daylightCycle = false;
    const p = g.player;
    p.gameMode = 'survival';
    g.applyModeRules();
    const x0 = Math.floor(p.pos.x);
    const y0 = Math.floor(p.pos.y) + 8;
    const z0 = Math.floor(p.pos.z);
    const w = g.world;
    for (let dx = -6; dx <= 6; dx++)
      for (let dz = -6; dz <= 6; dz++) {
        w.set(x0 + dx, y0 - 1, z0 + dz, ids.blocks.stone, 0, 'player');
        for (let dy = 0; dy < 6; dy++) w.set(x0 + dx, y0 + dy, z0 + dz, 0, 0, 'player');
      }
    const bx = x0 + 11;
    for (let dx = -4; dx <= 4; dx++)
      for (let dz = -27; dz <= 4; dz++) {
        const wall = Math.abs(dx) === 4 || dz === -27 || dz === 4;
        w.set(bx + dx, y0 - 7, z0 + dz, ids.blocks.stone, 0, 'player');
        for (let dy = -6; dy <= -2; dy++) w.set(bx + dx, y0 + dy, z0 + dz, wall ? ids.blocks.glass : ids.blocks.water, 0, 'player');
        for (let dy = -1; dy < 4; dy++) w.set(bx + dx, y0 + dy, z0 + dz, 0, 0, 'player');
      }
    g.teleport(x0 + 0.5, y0, z0 + 0.5);
    p.yaw = p.prevYaw = 0;
    p.pitch = -0.1;
    p.inventory.clear();
    for (const e of g.entities.list) if (e.living) e.remove();
    // Caméra de capture en orbite autour du joueur (vue de côté, de trois quarts), visant ses yeux
    const rig = g.cameraRig;
    const update = rig.update.bind(rig);
    rig.update = (cam, pl, world, alpha, dt, opts) => {
      update(cam, pl, world, alpha, dt, opts);
      const o = window.__orbit;
      if (!o) return;
      const tx = rig.eye.x;
      const ty = rig.eye.y - o.ty;
      const tz = rig.eye.z;
      const lx = Math.sin(o.angle) * Math.cos(o.elev) * o.dist;
      const ly = Math.sin(o.elev) * o.dist;
      const lz = Math.cos(o.angle) * Math.cos(o.elev) * o.dist;
      const c = Math.cos(pl.yaw);
      const s = Math.sin(pl.yaw);
      cam.position.set(tx + lx * c + lz * s, ty + ly, tz - lx * s + lz * c);
      const dx = tx - cam.position.x;
      const dy = ty - cam.position.y;
      const dz = tz - cam.position.z;
      cam.rotation.set(Math.atan2(dy, Math.hypot(dx, dz)), Math.atan2(-dx, -dz), 0, 'YXZ');
      cam.updateMatrixWorld();
    };
    return { x0, y0, z0, bx, mode: p.gameMode, cheats: g.meta.cheats };
  }, { items, blocks });
  check('survie avec commandes autorisées', base.mode === 'survival' && base.cheats, JSON.stringify(base));
  await hideUi(true);

  // ---------------------------------------------------------------- a) armures complètes
  const standBounds = [];
  for (const m of MATS) {
    // Vrai clic droit pour chaque pièce (l'ancienne pièce revient dans la main)
    for (const piece of PIECES) await rightClickEquip(items[`${m}_${piece}`]);
    await run(() => {
      const p = window.voxelia.game.player;
      p.inventory.clear();
      p.yaw = p.prevYaw = 0;
      p.pitch = -0.1;
    });
    await view(2);
    await wait(500);
    const info = await layer();
    const miss = missing(info);
    check(`armure ${m} : 4 emplacements équipés par clic droit et dessinés`, JSON.stringify(info?.armor) === JSON.stringify([m, m, m, m]) && miss.length === 0 && info.visible && info.light > 0.5, JSON.stringify({ armor: info?.armor, manque: miss, lumière: info?.light }));
    await shot(`armure-${m}-face`);
    if (m === 'iron' || m === 'diamond' || m === 'celestine') {
      await view(1);
      await wait(400);
      await shot(`armure-${m}-dos`);
      await view(1, { ...THREE_QUARTER, ty: 0.7 });
      await wait(300);
      await shot(`armure-${m}-trois-quarts`);
    }
    standBounds.push(await bounds());
  }
  const sb = standBounds[standBounds.length - 1];
  check('debout : pieds sur le sol, ni enfoncé ni décollé', standBounds.every((b) => b.bottom > -0.05 && b.bottom < 0.02 && b.top > 1.7 && b.top < 2.0), JSON.stringify(sb));

  // Marche (balancement des bras et des jambes, l'armure suit)
  await view(2);
  await touch({ moveZ: 1 });
  await wait(450);
  await shot('marche-face');
  await touch({ moveZ: 0 });
  await wait(300);

  // ---------------------------------------------------------------- b) poupée de l'inventaire
  await run((ids) => {
    const p = window.voxelia.game.player;
    p.inventory.armor.slots = ['diamond_helmet', 'diamond_chestplate', 'diamond_leggings', 'diamond_boots'].map((k) => ({ id: ids.items[k], count: 1 }));
    p.inventory.changed();
  }, { items });
  await hideUi(false);
  await page.keyboard.press('KeyE');
  await wait(1200);
  const doll = await run(() => {
    const eq = window.voxelia.preview?.equip;
    return { open: window.voxelia.ui.depth > 0, worn: eq ? [...eq.worn] : null, meshes: eq ? eq.meshes.length : 0 };
  });
  check('poupée de l’inventaire : armure portée dessinée', doll.open && JSON.stringify(doll.worn) === '["diamond","diamond","diamond","diamond"]' && doll.meshes >= 9, JSON.stringify(doll));
  await shot('poupee-inventaire');
  await page.keyboard.press('Escape');
  await wait(500);
  await hideUi(true);

  // ---------------------------------------------------------------- c) nage (sprint sous l'eau)
  const startSwim = (b, pitch) =>
    run(
      ([b, pitch]) => {
        const g = window.voxelia.game;
        g.teleport(b.bx + 0.5, b.y0 - 3.2, b.z0 + 2.5);
        g.player.yaw = g.player.prevYaw = 0;
        g.player.pitch = pitch;
      },
      [b, pitch],
    );
  await startSwim(base, -0.12);
  await view(1);
  await touch({ moveZ: 1, sprint: true });
  await wait(1200);
  const swim = await state();
  const swimBounds = await bounds();
  const swimAxis = await axis();
  check('nage : sprint sous l’eau → pose « swim »', swim.swimming && swim.pose === 'swim' && swim.eyesInWater, JSON.stringify(swim));
  check('nage : caméra à 0,4 bloc des pieds', Math.abs(swim.eye - 0.4) < 0.05, `hauteur des yeux ${swim.eye}`);
  check('nage : torse à l’horizontale, corps allongé', Math.abs(swimAxis) < 0.25 && swimBounds.length > 1.4 && swimBounds.height < 1.05, JSON.stringify({ ...swimBounds, axe: swimAxis }));
  await shot('nage-dos');
  await startSwim(base, -0.05);
  await wait(800);
  await view(1, { ...SIDE, ty: -0.05 });
  await wait(300);
  await shot('nage-cote');
  await view(1, { ...THREE_QUARTER, ty: -0.05 });
  await wait(300);
  await shot('nage-trois-quarts');
  await view(2);
  await wait(300);
  await shot('nage-face');
  const swim2 = await state();
  check('nage : toujours en nage pendant les captures', swim2.pose === 'swim', JSON.stringify(swim2));
  // Au fond de l'eau, les mains du crawl ne traversent pas le sol
  await run(() => (window.voxelia.game.player.pitch = -0.6));
  await wait(1500);
  await run(() => (window.voxelia.game.player.pitch = 0));
  await wait(400);
  let floorLow = Infinity;
  for (let i = 0; i < 10; i++) {
    floorLow = Math.min(floorLow, (await bounds()).bottom);
    await wait(90);
  }
  const floor = await state();
  check('nage au fond : mains au-dessus du sol pendant tout le crawl', floor.onGround && floor.pose === 'swim' && floorLow > -0.05, JSON.stringify({ point_bas: floorLow, ...floor }));
  await view(1, { ...SIDE, ty: -0.05 });
  await wait(300);
  await shot('nage-au-fond-cote');
  await touch({ moveZ: 0, sprint: false });
  await view(1);

  // ---------------------------------------------------------------- d) flottaison (dans l'eau, sans sprint)
  await run((b) => {
    const g = window.voxelia.game;
    g.teleport(b.bx + 0.5, b.y0 - 3.6, b.z0 - 4.5);
    g.player.yaw = g.player.prevYaw = 0;
    g.player.pitch = -0.1;
  }, base);
  await touch({ jump: true });
  await wait(1500);
  // Saut maintenu : le joueur remonte et se maintient à la surface (les pieds sortent par moments
  // du bloc d'eau) ; la pose doit rester « tread » sans clignoter.
  const treadPoses = new Set();
  let tread = null;
  for (let i = 0; i < 20; i++) {
    tread = await state();
    treadPoses.add(tread.pose);
    await wait(50);
  }
  check('flottaison : dans l’eau sans sprint → pose « tread », stable', treadPoses.size === 1 && tread.pose === 'tread' && !tread.swimming && tread.y < base.y0 - 0.5, JSON.stringify({ poses: [...treadPoses], ...tread }));
  await view(2);
  await wait(300);
  await shot('flottaison-face');
  await view(1, { ...SIDE, ty: 0.6 });
  await wait(300);
  await shot('flottaison-cote');
  const tread2 = await state();
  check('flottaison : stable pendant les captures', tread2.pose === 'tread', JSON.stringify(tread2));
  await touch({ jump: false });
  await view(1);

  // ---------------------------------------------------------------- g) bulles : masquées hors de l'eau
  await hideUi(false);
  await run((b) => {
    const g = window.voxelia.game;
    g.teleport(b.bx + 0.5, b.y0 - 5.2, b.z0 - 8.5);
  }, base);
  await wait(2500);
  const under = await run(() => ({ air: window.voxelia.game.player.air, display: window.voxelia.game.hud.bubbleRow.style.display }));
  await shot('bulles-sous-l-eau');
  await run((b) => window.voxelia.game.teleport(b.x0 + 0.5, b.y0, b.z0 + 0.5), base);
  await wait(3000);
  const dry = await run(() => ({ air: window.voxelia.game.player.air, display: window.voxelia.game.hud.bubbleRow.style.display }));
  check('bulles : rangée affichée sous l’eau', under.air < 300 && under.display === 'flex', JSON.stringify(under));
  check('bulles : rangée masquée 3 s après la sortie de l’eau', dry.air === 300 && dry.display === 'none', JSON.stringify(dry));
  await shot('bulles-hors-de-l-eau');
  await hideUi(true);

  // ---------------------------------------------------------------- e) planeur
  await run((ids) => {
    const p = window.voxelia.game.player;
    p.inventory.armor.slots = ['celestine_helmet', 'iron_chestplate', 'celestine_leggings', 'celestine_boots'].map((k) => ({ id: ids.items[k], count: 1 }));
    p.inventory.changed();
  }, { items });
  await rightClickEquip(items.glider);
  await run(() => {
    const p = window.voxelia.game.player;
    p.inventory.clear();
    p.yaw = p.prevYaw = 0;
    p.pitch = -0.1;
  });
  await view(1);
  await wait(500);
  const folded = await layer();
  check('planeur équipé par clic droit (emplacement du torse), ailes repliées', folded?.armor[1] === 'glider' && folded.pieces['body/wingR'] === 1 && folded.pieces['body/wingL'] === 1 && !folded.pieces['body/body'] && folded.wing === 0, JSON.stringify(folded));
  await shot('planeur-replie-dos');
  await view(1, { ...SIDE, ty: 0.6 });
  await wait(300);
  await shot('planeur-replie-cote');
  await view(1);
  await run((b) => {
    const g = window.voxelia.game;
    g.teleport(b.x0 + 0.5, b.y0 + 60, b.z0 + 0.5);
    g.player.health = 20;
  }, base);
  await wait(500);
  const falling = await state();
  await touch({ jump: true });
  await wait(150);
  await touch({ jump: false });
  await run(() => (window.voxelia.game.player.pitch = -0.25));
  await wait(900);
  const glide = await state();
  const wings = await layer();
  const glideBounds = await bounds();
  const glideAxis = await axis();
  check('planeur : saut en chute → vol plané (pose « glide »)', !falling.onGround && glide.gliding && glide.pose === 'glide', JSON.stringify({ avant: falling, après: glide }));
  check('planeur : ailes déployées en vol', wings?.wing > 0.95, `déploiement ${wings?.wing}`);
  check('planeur : corps allongé dans la direction du regard', Math.abs(glideAxis + 0.25) < 0.2 && glideBounds.length > 1.4, JSON.stringify({ ...glideBounds, axe: glideAxis }));
  await shot('planeur-vol-dos');
  await view(1, { ...SIDE, ty: 0.6 });
  await wait(250);
  await shot('planeur-vol-cote');
  await view(1, { ...THREE_QUARTER, ty: 0.6 });
  await wait(250);
  await shot('planeur-vol-trois-quarts');
  await view(2);
  await wait(250);
  await shot('planeur-vol-face');
  const still = await state();
  check('planeur : toujours en vol pendant les captures', still.gliding, JSON.stringify(still));
  // Atterrissage sur l'estrade : le vol cesse au contact du sol, les ailes se replient
  await run((b) => {
    const g = window.voxelia.game;
    g.player.pos.set(b.x0 + 0.5, b.y0 + 0.3, b.z0 + 0.5);
    g.player.prevPos.copy(g.player.pos);
    g.player.fallDistance = 0;
    g.player.pitch = -0.1;
  }, base);
  await view(1);
  await wait(1200);
  const landed = await state();
  const wings2 = await layer();
  check('planeur : au sol → vol terminé, ailes repliées', landed.onGround && !landed.gliding && landed.pose === 'stand' && wings2?.wing === 0, JSON.stringify({ ...landed, wing: wings2?.wing }));
  await shot('planeur-au-sol-dos');

  // ---------------------------------------------------------------- f) accroupi
  await touch({ sneak: true });
  await wait(600);
  const sneak = await state();
  const sneakBounds = await bounds();
  check('accroupi → pose « sneak »', sneak.sneaking && sneak.pose === 'sneak', JSON.stringify(sneak));
  check('accroupi : plus bas que debout, pieds au sol', sneakBounds.bottom > -0.05 && sneakBounds.top < sb.top - 0.15, JSON.stringify({ accroupi: sneakBounds, debout: sb }));
  await view(2);
  await wait(300);
  await shot('accroupi-face');
  await view(1, { ...SIDE, ty: 0.5 });
  await wait(300);
  await shot('accroupi-cote');
  await touch({ sneak: false });
  await view(1);

  check('aucune erreur JavaScript', errors.length === 0, [...new Set(errors)].slice(0, 5).join(' | '));
} catch (e) {
  check('scénario complet', false, String(e?.message ?? e).split('\n')[0]);
  await shot('erreur').catch(() => undefined);
} finally {
  await browser.close();
  server.close();
}
console.log(`\nCaptures (${shots.length}) dans ${out}`);
console.log(results.join('\n'));
console.log(failed ? `\n${failed} échec(s)` : '\nTous les contrôles sont passés.');
process.exit(failed ? 1 : 0);
