// Test des matériaux étherium et célestine dans Chromium headless, en survie : minage dans les
// Terres de braise et le Royaume céleste (niveau de pioche), cuisson au four, fabrication à
// l'établi, bonus d'ensemble (feu, magma, lave, chute), icônes et textures, captures.
// Usage : node tools/build.mjs && node tools/materials-test.mjs [dossier des captures]
import * as esbuild from 'esbuild';
import { chromium } from 'playwright-core';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const out = resolve(process.argv[2] ?? join(root, 'test-results', 'materials'));
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
const PIECES = ['helmet', 'chestplate', 'leggings', 'boots'];
const TOOLS = ['sword', 'pickaxe', 'axe', 'shovel', 'hoe'];
const NEW_ITEMS = ['etherium_ore', 'etherium_block', 'celestine_ore', 'celestine_block', 'raw_etherium', 'etherium_ingot', 'celestine'];
for (const m of ['etherium', 'celestine']) for (const k of [...TOOLS, ...PIECES]) NEW_ITEMS.push(`${m}_${k}`);
const items = {};
for (const k of [...NEW_ITEMS, 'iron_pickaxe', 'diamond_pickaxe', 'coal', 'stick', 'diamond_boots', 'diamond_helmet', 'furnace', 'crafting_table']) {
  const d = ITEM_BY_KEY.get(k);
  if (!d) throw new Error(`objet absent du registre : ${k}`);
  items[k] = d.id;
}
const blocks = {};
for (const k of ['etherium_ore', 'etherium_block', 'celestine_ore', 'celestine_block', 'ember_stone', 'sky_stone', 'stone', 'fire', 'magma', 'lava', 'furnace', 'crafting_table', 'mythril_block', 'diamond_block', 'grass_block']) blocks[k] = B[k];
const ids = { items, blocks };

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
const shot = (name) => page.screenshot({ path: join(out, name + '.png') });
/** Capture du jeu sans les lignes de chat (elles masqueraient le minerai). */
const gameShot = async (name) => {
  await run(() => document.querySelectorAll('.chat-line').forEach((l) => l.remove()));
  await shot(name);
};
/** Ferme les écrans ouverts (Échap ; le premier appui peut seulement quitter le champ de recherche). */
const closeUi = async () => {
  for (let i = 0; i < 4 && (await run(() => window.voxelia.ui.depth)) > 0; i++) {
    await page.keyboard.press('Escape');
    await wait(300);
  }
};
const toDimension = async (name, dim) => {
  await run((n) => window.voxelia.game.submitChat(`/dimension ${n}`), name);
  await page.waitForFunction((d) => window.voxelia.game.dimension === d && !window.voxelia.game.changingDim && window.voxelia.ui.depth === 0, dim, { timeout: 180000, polling: 500 });
  await wait(4000);
  await run(() => window.__mt.clearMobs());
};

/** Outils exécutés dans la page (window.__mt). */
function installHelpers(ids) {
  const g = () => window.voxelia.game;
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const T = {
    ids,
    sleep,
    damage: [],
    count: (key) => g().player.inventory.count(ids.items[key]),
    give: (key, n = 1) => g().submitChat(`/give ${key} ${n}`),
    clearMobs: () => {
      for (const e of g().entities.list) if (e.living) e.remove();
    },
    /** Met l'objet dans la main (barre d'action). */
    hold(key) {
      const inv = g().player.inventory;
      const i = inv.slots.findIndex((s) => s && s.id === ids.items[key]);
      if (i < 0) return false;
      if (i > 8) {
        const t = inv.slots[0];
        inv.slots[0] = inv.slots[i];
        inv.slots[i] = t;
        inv.selected = 0;
      } else inv.selected = i;
      inv.changed();
      return true;
    },
    /** Oriente le regard vers un point. */
    aim(tx, ty, tz) {
      const p = g().player;
      const e = g().cameraEye();
      const dx = tx - e.x;
      const dy = ty - e.y;
      const dz = tz - e.z;
      p.yaw = Math.atan2(-dx, -dz);
      p.pitch = Math.atan2(dy, Math.hypot(dx, dz));
    },
    /** Clic droit d'une image (bouton utiliser). */
    async use() {
      window.voxelia.input.state.usePressed = true;
      await sleep(400);
    },
    /** S'équipe d'une pièce d'armure par le clic droit, regard vers le ciel. */
    async equip(key) {
      if (!T.hold(key)) return false;
      g().player.pitch = 1.4;
      await sleep(150);
      await T.use();
      return g().player.inventory.armor.slots.some((s) => s && s.id === ids.items[key]);
    },
    /** Minerais chargés : meilleur site (le plus proche de la surface, sans liquide autour). */
    findSite(oreId, avoid = []) {
      const w = g().world;
      const found = [];
      for (const c of g().chunks.chunks.values()) {
        if (!c.ready || !c.blocks) continue;
        const b = c.blocks;
        for (let i = 0; i < b.length; i++) if ((b[i] & 1023) === oreId) found.push([c.cx * 16 + (i & 15), i >> 8, c.cz * 16 + ((i >> 4) & 15)]);
      }
      let best = null;
      for (const [ox, oy, oz] of found) {
        if (avoid.some(([ax, , az]) => Math.abs(ax - ox) < 8 && Math.abs(az - oz) < 8)) continue;
        let top = oy;
        let ok = true;
        for (let x = ox - 2; x <= ox + 2 && ok; x++)
          for (let z = oz; z <= oz + 4 && ok; z++) {
            if (!w.isLoaded(x, z)) ok = false;
            else top = Math.max(top, w.height(x, z));
          }
        if (!ok) continue;
        for (let x = ox - 2; x <= ox + 2 && ok; x++)
          for (let z = oz; z <= oz + 4 && ok; z++)
            for (let y = oy - 1; y <= top + 1 && ok; y++) if (w.def(x, y, z).shape === 'liquid') ok = false;
        if (!ok) continue;
        const score = top - oy;
        if (!best || score < best.score) best = { x: ox, y: oy, z: oz, top, score };
      }
      return { total: found.length, site: best };
    },
    /** Puits de 3×3 ouvert vers le ciel devant la face +Z du minerai ; joueur à 1,5 bloc. */
    async openSite(s, host) {
      const w = g().world;
      // Sol sous le minerai : l'objet obtenu ne doit pas tomber dans une grotte.
      if (!w.def(s.x, s.y - 1, s.z).solid) w.set(s.x, s.y - 1, s.z, host, 0, 'player');
      for (let x = s.x - 1; x <= s.x + 1; x++)
        for (let z = s.z + 1; z <= s.z + 3; z++) {
          for (let y = s.y; y <= s.top + 3; y++) w.set(x, y, z, 0, 0, 'player');
          if (!w.def(x, s.y - 1, z).solid) w.set(x, s.y - 1, z, host, 0, 'player');
        }
      g().teleport(s.x + 0.5, s.y, s.z + 2);
      T.clearMobs();
      await sleep(1500);
      T.aim(s.x + 0.5, s.y + 0.5, s.z + 0.5);
      await sleep(300);
      const t = g().interaction.target;
      return { target: t ? [t.x, t.y, t.z, t.id] : null, ore: w.id(s.x, s.y, s.z) };
    },
    /** Casse le bloc visé en maintenant le bouton d'attaque (vrai chemin de minage). */
    async mine(x, y, z, timeout = 15000) {
      const w = g().world;
      const before = w.id(x, y, z);
      T.aim(x + 0.5, y + 0.5, z + 0.5);
      await sleep(200);
      window.voxelia.input.touch.attack = true;
      const t0 = performance.now();
      while (w.id(x, y, z) === before && performance.now() - t0 < timeout) await sleep(100);
      window.voxelia.input.touch.attack = false;
      return { broken: w.id(x, y, z) !== before, ms: Math.round(performance.now() - t0) };
    },
    /** Ramasse ce qui est tombé : le joueur avance d'un bloc vers le trou laissé par le minerai. */
    async collect(x, y, z) {
      await sleep(800);
      g().teleport(x + 0.5, y, z + 1.5);
      await sleep(2000);
    },
  };
  window.__mt = T;
  // Les créatures des marqueurs de génération apparaissent même sans apparitions naturelles :
  // on les retire en continu (une salamandre de braise tuait le joueur pendant la cuisson).
  setInterval(T.clearMobs, 250);
  // Journal des dégâts subis (même rappel que l'interface : clignotement, sons…)
  const p = g().player;
  const prev = p.onDamage;
  p.onDamage = (amount, src) => {
    T.damage.push([src.type, +amount.toFixed(3), g().dimension, Math.round(p.pos.x), Math.round(p.pos.y), Math.round(p.pos.z), src.attacker?.type ?? '']);
    prev?.(amount, src);
  };
}

try {
  await page.goto(`http://localhost:${server.address().port}/`);
  await page.locator('.title-screen').waitFor({ timeout: 30000 });
  await run(() => window.voxelia.settings.set('renderDistance', 4));
  await page.locator('#ui').getByText(/^Jouer$/).first().click();
  await page.locator('#ui').getByText(/Créer un nouveau monde/i).first().click();
  await page.locator('#ui').getByText(/^CRÉER$/i).first().click();
  await page.waitForFunction(() => window.voxelia?.game?.ready === true && window.voxelia.ui.depth === 0, null, { timeout: 180000, polling: 500 });
  await wait(2000);
  await run(installHelpers, ids);
  const setup = await run(() => {
    const g = window.voxelia.game;
    g.meta.cheats = true;
    g.meta.rules.mobSpawning = false;
    g.setRule('naturalRegeneration', false);
    g.setDifficulty('normal');
    g.setGameMode('survival');
    g.setTime(6000);
    window.__mt.clearMobs();
    return { mode: g.player.gameMode, dims: g.meta.experiments.dimensions };
  });
  check('monde de survie créé, triches activées', setup.mode === 'survival' && setup.dims, JSON.stringify(setup));

  // ---------------------------------------------------------------- icônes et textures
  const art = await run(async (keys) => {
    const T = window.__mt;
    const app = window.voxelia;
    const bad = [];
    for (const k of keys) {
      const url = app.icons.get(T.ids.items[k]);
      const img = new Image();
      await new Promise((r, j) => {
        img.onload = r;
        img.onerror = j;
        img.src = url;
      });
      const c = document.createElement('canvas');
      c.width = img.width;
      c.height = img.height;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let opaque = 0;
      let pink = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i + 3] > 0) opaque++;
        if (d[i] === 255 && d[i + 1] === 0 && d[i + 2] === 255 && d[i + 3] === 255) pink++;
      }
      if (opaque < 40 || pink > 0) bad.push(`${k} (opaques ${opaque}, roses ${pink})`);
    }
    const info = app.renderer.atlas.info;
    const tex = ['etherium_ore', 'etherium_block', 'celestine_ore', 'celestine_block'].map((n) => [n, info[n]?.frames ?? 0]);
    return { bad, tex };
  }, NEW_ITEMS);
  check(`icône dessinée pour les ${NEW_ITEMS.length} nouveaux objets (aucune case rose)`, art.bad.length === 0, art.bad.join(', '));
  check('textures des 4 blocs dans l’atlas (blocs de stockage animés)', art.tex.every(([n, f]) => f >= (n.endsWith('_block') ? 8 : 1)), JSON.stringify(art.tex));

  // ---------------------------------------------------------------- (i) catalogue créatif
  await run(() => window.voxelia.game.setGameMode('creative'));
  await page.keyboard.press('KeyE');
  await wait(800);
  const search = page.locator('.inv-back .recipe-search input');
  for (const [q, expected, helmetKey, name] of [
    // minerai, bloc, matériaux (brut + lingot ou gemme), 5 outils, 4 pièces d'armure
    ['étherium', 13, 'etherium_helmet', '01-creatif-etherium'],
    ['célestine', 12, 'celestine_helmet', '02-creatif-celestine'],
  ]) {
    await search.fill(q);
    await page.mouse.move(950, 530);
    await wait(600);
    await shot(name);
    const title = await page.locator('.inv-back .panel-title.left').first().innerText();
    const n = Number(/\((\d+)\)/.exec(title)?.[1] ?? 0);
    // Infobulle de la pièce de casque (bonus d'ensemble)
    const helmet = await run((id) => {
      const want = window.voxelia.icons.get(id);
      const slots = [...document.querySelectorAll('.inv-back .slots-scroll .slot')];
      return slots.findIndex((el) => (el.querySelector('.item-img')?.style.backgroundImage ?? '').includes(want));
    }, ids.items[helmetKey]);
    if (helmet >= 0) await page.locator('.inv-back .slots-scroll .slot').nth(helmet).hover();
    await wait(400);
    const tip = await page.locator('.tooltip').first().innerText().catch(() => '');
    await shot(name + '-infobulle');
    check(`catalogue créatif : recherche « ${q} »`, n === expected && helmet >= 0, `${n} résultats (attendu ${expected})`);
    check(`infobulle du casque ${q === 'étherium' ? 'en étherium' : 'en célestine'} : bonus d’ensemble`, /Ensemble complet/.test(tip) && (q === 'étherium' ? /feu/.test(tip) : /chute/.test(tip)), tip.replace(/\n/g, ' / '));
  }
  await search.fill('');
  await closeUi();
  await run(() => window.voxelia.game.setGameMode('survival'));

  // ---------------------------------------------------------------- (a) Terres de braise : minage de l'étherium
  await toDimension('braise', 1);
  const ember = await run(async () => {
    const T = window.__mt;
    const { blocks } = T.ids;
    const g = window.voxelia.game;
    const inv = g.player.inventory;
    inv.clear();
    const first = T.findSite(blocks.etherium_ore);
    if (!first.site) return { total: first.total };
    const s1 = first.site;
    const open1 = await T.openSite(s1, blocks.ember_stone);
    T.give('iron_pickaxe');
    T.hold('iron_pickaxe');
    return { total: first.total, s1, open1, chunks: g.chunks.chunks.size };
  });
  check('minerai d’étherium trouvé dans les tronçons chargés des Terres de braise', !!ember.s1, JSON.stringify(ember));
  if (!ember.s1) throw new Error('aucun minerai d’étherium chargé');
  check('le minerai d’étherium est visé depuis le puits', ember.open1.target?.[3] === ids.blocks.etherium_ore, JSON.stringify(ember.open1));
  await wait(1500);
  await gameShot('03-etherium-minerai');
  const iron = await run(async (s) => {
    const T = window.__mt;
    const g = window.voxelia.game;
    const held = g.player.heldItem();
    const r = await T.mine(s.x, s.y, s.z);
    await T.collect(s.x, s.y, s.z);
    const drops = g.entities.list.filter((e) => e.stack && e.stack.id === T.ids.items.raw_etherium).length;
    return { ...r, raw: T.count('raw_etherium'), drops, tool: held && held.id === T.ids.items.iron_pickaxe, wear: g.player.heldItem()?.damage ?? 0 };
  }, ember.s1);
  check('pioche en fer : le minerai d’étherium se casse sans rien donner', iron.tool && iron.broken && iron.raw === 0 && iron.drops === 0, JSON.stringify(iron));

  const ember2 = await run(async (avoid) => {
    const T = window.__mt;
    const { blocks } = T.ids;
    const g = window.voxelia.game;
    const found = T.findSite(blocks.etherium_ore, avoid);
    if (!found.site) return { total: found.total };
    const s = found.site;
    const open = await T.openSite(s, blocks.ember_stone);
    T.give('diamond_pickaxe');
    T.hold('diamond_pickaxe');
    const xp0 = g.player.xpLevel + g.player.xpProgress;
    const r = await T.mine(s.x, s.y, s.z);
    await T.collect(s.x, s.y, s.z);
    await T.sleep(1500);
    return { s, open, ...r, raw: T.count('raw_etherium'), xp: +(g.player.xpLevel + g.player.xpProgress - xp0).toFixed(2) };
  }, [[ember.s1.x, ember.s1.y, ember.s1.z]]);
  check('pioche en diamant : le minerai d’étherium donne de l’étherium brut', ember2.broken && ember2.raw >= 1, JSON.stringify(ember2));
  check('le minerai d’étherium donne de l’expérience', ember2.xp > 0, `+${ember2.xp} niveau(x)`);

  // ---------------------------------------------------------------- (b) cuisson au four
  const furnace = await run(async () => {
    const T = window.__mt;
    const { blocks, items } = T.ids;
    const g = window.voxelia.game;
    const p = g.player;
    const w = g.world;
    const x = Math.floor(p.pos.x) + 1;
    const y = Math.floor(p.pos.y);
    const z = Math.floor(p.pos.z) + 1;
    w.set(x, y, z, blocks.furnace, 0, 'player');
    // Deux autres morceaux pour avoir les trois lingots de la pioche
    T.give('raw_etherium', 2);
    T.give('coal', 1);
    const raw = T.count('raw_etherium');
    p.inventory.remove(items.raw_etherium, raw);
    p.inventory.remove(items.coal, 1);
    w.setBlockEntity(x, y, z, { type: 'furnace', items: [{ id: items.raw_etherium, count: raw }, { id: items.coal, count: 1 }, null], burn: 0, burnMax: 0, cook: 0, xp: 0 });
    const t0 = performance.now();
    const ticks0 = g.tickCount;
    let be = w.blockEntity(x, y, z);
    while ((be?.items?.[2]?.count ?? 0) < raw && performance.now() - t0 < 150000) {
      await T.sleep(500);
      be = w.blockEntity(x, y, z);
    }
    return { x, y, z, raw, out: be?.items?.[2] ?? null, xp: be?.xp ?? 0, ticks: g.tickCount - ticks0, s: Math.round((performance.now() - t0) / 1000), lit: (w.meta(x, y, z) & 4) !== 0 || (be?.burn ?? 0) > 0 };
  });
  check('four : l’étherium brut cuit en lingots d’étherium', furnace.out?.id === ids.items.etherium_ingot && furnace.out.count === furnace.raw, JSON.stringify(furnace));
  // Récupération du résultat dans l'écran du four (Maj + clic sur la case de sortie)
  await run(async (f) => {
    const T = window.__mt;
    T.aim(f.x + 0.5, f.y + 0.5, f.z + 0.5);
    await T.sleep(300);
    await T.use();
  }, furnace);
  await page.locator('.inv-back .slot.big').first().waitFor({ timeout: 5000 });
  await page.locator('.inv-back .slot.big').first().click({ modifiers: ['Shift'] });
  await wait(400);
  await shot('04-four');
  await closeUi();
  const ingots = await run(() => ({ ingots: window.__mt.count('etherium_ingot'), xpLevel: window.voxelia.game.player.xpLevel, ui: window.voxelia.ui.depth }));
  check('lingots récupérés dans l’inventaire depuis l’écran du four', ingots.ingots === furnace.raw && ingots.ui === 0, JSON.stringify(ingots));

  // ---------------------------------------------------------------- (c) fabrication à l'établi
  await run(async (f) => {
    const T = window.__mt;
    const g = window.voxelia.game;
    const x = f.x - 2;
    g.world.set(x, f.y, f.z, T.ids.blocks.crafting_table, 0, 'player');
    T.give('stick', 2);
    T.aim(x + 0.5, f.y + 0.5, f.z + 0.5);
    await T.sleep(300);
    await T.use();
  }, furnace);
  await page.locator('.inv-back .recipe-search input').waitFor({ timeout: 5000 });
  await page.locator('.inv-back .recipe-search input').fill('pioche en étherium');
  await wait(500);
  const recipe = page.locator('.inv-col .slots-scroll .slot:not(.red)').first();
  await recipe.waitFor({ timeout: 5000 });
  await recipe.click({ modifiers: ['Shift'] });
  await wait(500);
  await shot('05-etabli');
  await closeUi();
  const crafted = await run(() => {
    const T = window.__mt;
    return { pickaxe: T.count('etherium_pickaxe'), ingots: T.count('etherium_ingot'), sticks: T.count('stick'), ui: window.voxelia.ui.depth };
  });
  check('établi : pioche en étherium fabriquée avec 3 lingots et 2 bâtons', crafted.pickaxe === 1 && crafted.ingots === furnace.raw - 3 && crafted.sticks === 0, JSON.stringify(crafted));

  // ---------------------------------------------------------------- (d) Royaume céleste : minage de la célestine
  await toDimension('ciel', 2);
  const sky = await run(async () => {
    const T = window.__mt;
    const { blocks } = T.ids;
    const g = window.voxelia.game;
    const found = T.findSite(blocks.celestine_ore);
    if (!found.site) return { total: found.total };
    const s = found.site;
    const open = await T.openSite(s, blocks.sky_stone);
    T.hold('diamond_pickaxe');
    return { total: found.total, s, open, chunks: g.chunks.chunks.size };
  });
  check('minerai de célestine trouvé dans les îles chargées du Royaume céleste', !!sky.s, JSON.stringify(sky));
  if (!sky.s) throw new Error('aucun minerai de célestine chargé');
  check('le minerai de célestine est visé depuis le puits', sky.open.target?.[3] === ids.blocks.celestine_ore, JSON.stringify(sky.open));
  await wait(1500);
  await gameShot('06-celestine-minerai');
  const gem = await run(async (s) => {
    const T = window.__mt;
    const r = await T.mine(s.x, s.y, s.z);
    await T.collect(s.x, s.y, s.z);
    return { ...r, celestine: T.count('celestine') };
  }, sky.s);
  check('pioche en diamant : le minerai de célestine donne de la célestine', gem.broken && gem.celestine >= 1 && gem.celestine <= 2, JSON.stringify(gem));

  // ---------------------------------------------------------------- (e) bonus d'ensemble, à la Surface
  const before = await run(() => ({ hp: window.voxelia.game.player.health, damage: window.__mt.damage.slice() }));
  check('aucun dégât subi pendant les étapes de minage, de cuisson et de fabrication', before.damage.length === 0, JSON.stringify(before));
  await toDimension('surface', 0);
  const arena = await run(() => {
    const g = window.voxelia.game;
    const T = window.__mt;
    const { blocks } = T.ids;
    const p = g.player;
    g.setTime(6000);
    const x0 = Math.floor(p.pos.x);
    const z0 = Math.floor(p.pos.z);
    const y0 = Math.floor(p.pos.y);
    for (let dx = -4; dx <= 4; dx++)
      for (let dz = -4; dz <= 4; dz++) {
        g.world.set(x0 + dx, y0 - 1, z0 + dz, blocks.stone, 0, 'player');
        for (let dy = 0; dy < (Math.abs(dx) <= 1 && Math.abs(dz) <= 1 ? 26 : 5); dy++) g.world.set(x0 + dx, y0 + dy, z0 + dz, 0, 0, 'player');
      }
    g.teleport(x0 + 0.5, y0, z0 + 0.5);
    T.clearMobs();
    p.inventory.clear();
    p.inventory.armor.clear();
    p.health = 20;
    p.hunger = 20;
    p.fireTicks = 0;
    return { x0, y0, z0 };
  });
  await wait(1000);
  const armor = await run(async () => {
    const T = window.__mt;
    const g = window.voxelia.game;
    const res = [];
    for (const k of ['helmet', 'chestplate', 'leggings', 'boots']) {
      T.give(`etherium_${k}`);
      res.push(await T.equip(`etherium_${k}`));
    }
    await T.sleep(300);
    return { equipped: res, points: g.player.inventory.armorPoints(), full: g.player.inventory.fullSet('etherium'), hud: g.hud.last.armor, bar: g.hud.armorRow.style.display };
  });
  check('ensemble d’étherium équipé par clic droit : 20 points d’armure, barre affichée', armor.equipped.every(Boolean) && armor.points === 20 && armor.full && armor.hud === 20 && armor.bar === 'flex', JSON.stringify(armor));

  /** Expose le joueur à un danger pendant ms millisecondes ; renvoie la vie et les dégâts subis. */
  const expose = (hazard, ms) =>
    run(
      async ({ a, hazard, ms }) => {
        const T = window.__mt;
        const { blocks } = T.ids;
        const g = window.voxelia.game;
        const w = g.world;
        const p = g.player;
        T.clearMobs();
        g.teleport(a.x0 + 0.5, a.y0, a.z0 + 0.5);
        p.health = 20;
        p.fireTicks = 0;
        T.damage.length = 0;
        let burning = 0;
        const walls = [];
        if (hazard === 'fire') w.set(a.x0, a.y0, a.z0, blocks.fire, 0, 'player');
        if (hazard === 'magma') w.set(a.x0, a.y0 - 1, a.z0, blocks.magma, 0, 'player');
        if (hazard === 'lava') {
          for (let dx = -1; dx <= 1; dx++)
            for (let dz = -1; dz <= 1; dz++)
              if (dx || dz)
                for (let dy = 0; dy < 2; dy++) {
                  walls.push([a.x0 + dx, a.y0 + dy, a.z0 + dz]);
                  w.set(a.x0 + dx, a.y0 + dy, a.z0 + dz, blocks.stone, 0, 'player');
                }
          w.set(a.x0, a.y0, a.z0, blocks.lava, 0, 'player');
        }
        const t0 = performance.now();
        const tick0 = g.tickCount;
        while (performance.now() - t0 < ms) {
          await T.sleep(100);
          burning = Math.max(burning, p.fireTicks);
        }
        const res = { hp: +p.health.toFixed(3), damage: T.damage.slice(), burning, ticks: g.tickCount - tick0 };
        w.set(a.x0, a.y0, a.z0, 0, 0, 'player');
        w.set(a.x0, a.y0 - 1, a.z0, blocks.stone, 0, 'player');
        for (const [x, y, z] of walls) w.set(x, y, z, 0, 0, 'player');
        p.fireTicks = 0;
        await T.sleep(300);
        p.health = 20;
        return res;
      },
      { a: arena, hazard, ms },
    );
  const hits = (r, type) => r.damage.filter(([t]) => t === type);
  const fire4 = await expose('fire', 5000);
  check('étherium complet : debout dans le feu, la vie ne bouge pas', fire4.hp === 20 && fire4.damage.length === 0 && fire4.burning > 0, JSON.stringify(fire4));
  const magma4 = await expose('magma', 4000);
  check('étherium complet : debout sur du magma, la vie ne bouge pas', magma4.hp === 20 && magma4.damage.length === 0, JSON.stringify(magma4));
  const lava4 = await expose('lava', 3000);
  check('étherium complet : dans la lave, pas de brûlure, seulement des dégâts de lave', lava4.hp < 20 && hits(lava4, 'lava').length > 0 && hits(lava4, 'fire').length === 0, JSON.stringify(lava4));

  // Trois pièces seulement : bottes en diamant (même total de 20 points d'armure)
  const three = await run(async () => {
    const T = window.__mt;
    const g = window.voxelia.game;
    T.give('diamond_boots');
    const ok = await T.equip('diamond_boots');
    return { ok, points: g.player.inventory.armorPoints(), full: g.player.inventory.fullSet('etherium') };
  });
  check('trois pièces d’étherium + bottes en diamant : 20 points, pas d’ensemble complet', three.ok && three.points === 20 && !three.full, JSON.stringify(three));
  const fire3 = await expose('fire', 5000);
  check('trois pièces : le feu blesse', fire3.hp < 20 && hits(fire3, 'fire').length > 0, JSON.stringify(fire3));
  const magma3 = await expose('magma', 4000);
  check('trois pièces : le magma blesse', magma3.hp < 20 && hits(magma3, 'fire').length > 0, JSON.stringify(magma3));
  const lava3 = await expose('lava', 3000);
  const mean = (a) => a.reduce((s, [, v]) => s + v, 0) / Math.max(1, a.length);
  const ratio = mean(hits(lava4, 'lava')) / mean(hits(lava3, 'lava'));
  check('la lave blesse deux fois moins avec l’ensemble d’étherium complet', Math.abs(ratio - 0.5) < 0.01, `par coup : ${mean(hits(lava4, 'lava')).toFixed(3)} contre ${mean(hits(lava3, 'lava')).toFixed(3)} (rapport ${ratio.toFixed(3)})`);

  // Célestine : chute de 20 blocs
  const cel = await run(async () => {
    const T = window.__mt;
    const g = window.voxelia.game;
    const res = [];
    for (const k of ['helmet', 'chestplate', 'leggings', 'boots']) {
      T.give(`celestine_${k}`);
      res.push(await T.equip(`celestine_${k}`));
    }
    await T.sleep(300);
    return { equipped: res, points: g.player.inventory.armorPoints(), full: g.player.inventory.fullSet('celestine'), hud: g.hud.last.armor };
  });
  check('ensemble de célestine équipé : 24 points d’armure (barre pleine)', cel.equipped.every(Boolean) && cel.points === 24 && cel.full && cel.hud === 24, JSON.stringify(cel));
  const fall = (h) =>
    run(
      async ({ a, h }) => {
        const T = window.__mt;
        const g = window.voxelia.game;
        const p = g.player;
        T.clearMobs();
        p.health = 20;
        T.damage.length = 0;
        g.teleport(a.x0 + 0.5, a.y0 + h, a.z0 + 0.5);
        const t0 = performance.now();
        await T.sleep(300);
        while (!(p.onGround && p.pos.y < a.y0 + 0.5) && performance.now() - t0 < 15000) await T.sleep(50);
        await T.sleep(500);
        const res = { landed: p.onGround && Math.abs(p.pos.y - a.y0) < 0.01, hp: p.health, damage: T.damage.slice(), dead: p.dead, s: +((performance.now() - t0) / 1000).toFixed(1) };
        p.health = 20;
        return res;
      },
      { a: arena, h },
    );
  const fall4 = await fall(20);
  check('célestine complète : chute de 20 blocs sans dégât', fall4.landed && fall4.hp === 20 && fall4.damage.length === 0, JSON.stringify(fall4));
  const swap = await run(async () => {
    const T = window.__mt;
    T.give('diamond_helmet');
    return { ok: await T.equip('diamond_helmet'), full: window.voxelia.game.player.inventory.fullSet('celestine') };
  });
  const fall3 = await fall(20);
  // Environ 20 − 3 dégâts (l'armure ne réduit pas la chute ; le premier tic après la téléportation ne compte pas toujours).
  const fallHits = hits(fall3, 'fall');
  check('trois pièces de célestine : la même chute blesse', swap.ok && !swap.full && fall3.landed && !fall3.dead && fallHits.length === 1 && fallHits[0][1] >= 15, JSON.stringify({ swap, fall3 }));

  // ---------------------------------------------------------------- (iv) inventaire avec l'armure de célestine
  await run(async () => {
    const T = window.__mt;
    const g = window.voxelia.game;
    const inv = g.player.inventory;
    T.give('celestine_helmet');
    await T.equip('celestine_helmet');
    inv.clear();
    for (const k of ['celestine_sword', 'celestine_pickaxe', 'etherium_pickaxe', 'etherium_axe']) T.give(k);
    for (const k of ['celestine', 'etherium_ingot', 'raw_etherium', 'etherium_block', 'celestine_block']) T.give(k, 5);
    inv.selected = 0;
    inv.changed();
    g.player.pitch = -0.2;
  });
  await wait(500);
  await page.keyboard.press('KeyE');
  await wait(1200);
  await shot('07-inventaire-celestine');
  const invState = await run(() => {
    const g = window.voxelia.game;
    return { ui: window.voxelia.ui.depth, doll: !!document.querySelector('.inv-back .player-doll'), points: g.player.inventory.armorPoints(), full: g.player.inventory.fullSet('celestine') };
  });
  check('inventaire de survie ouvert avec l’armure de célestine portée', invState.ui > 0 && invState.doll && invState.full, JSON.stringify(invState));
  await closeUi();

  // ---------------------------------------------------------------- (v) blocs de stockage au soleil
  // Terrasse d'herbe au-dessus du relief voisin (ciel dégagé), de gauche à droite : minerai
  // d'étherium, blocs de mythril, d'étherium, de célestine et de diamant, minerai de célestine.
  const display = await run(async (a) => {
    const T = window.__mt;
    const { blocks } = T.ids;
    const g = window.voxelia.game;
    const w = g.world;
    const p = g.player;
    g.setTime(6000);
    let top = a.y0;
    for (let dx = -6; dx <= 6; dx++) for (let dz = -10; dz <= 3; dz++) top = Math.max(top, w.height(a.x0 + dx, a.z0 + dz));
    const y = top + 1;
    for (let dx = -4; dx <= 4; dx++)
      for (let dz = -7; dz <= 2; dz++) {
        w.set(a.x0 + dx, y, a.z0 + dz, blocks.grass_block, 0, 'player');
        for (let dy = 1; dy < 4; dy++) w.set(a.x0 + dx, y + dy, a.z0 + dz, 0, 0, 'player');
      }
    const z = a.z0 - 4;
    const row = [blocks.etherium_ore, blocks.mythril_block, blocks.etherium_block, blocks.celestine_block, blocks.diamond_block, blocks.celestine_ore];
    row.forEach((id, i) => w.set(a.x0 - 3 + i, y + 1, z, id, 0, 'player'));
    g.teleport(a.x0, y + 1, a.z0 + 0.5);
    T.aim(a.x0, y + 1.3, z + 0.5);
    p.inventory.selected = 1;
    p.inventory.changed();
    T.clearMobs();
    await T.sleep(3000);
    return { daylight: g.daylight, time: g.meta.time, sky: w.skyLight(a.x0, y + 2, z), placed: row.map((id, i) => w.id(a.x0 - 3 + i, y + 1, z) === id) };
  }, arena);
  await gameShot('08-blocs-de-stockage');
  check('blocs de stockage posés en plein jour, sous le ciel', display.placed.every(Boolean) && display.daylight > 0.9 && display.sky === 15, JSON.stringify(display));

  check('aucune erreur JavaScript', errors.length === 0, [...new Set(errors)].slice(0, 5).join(' | '));
} catch (e) {
  check('scénario complet', false, String(e?.message ?? e).split('\n')[0]);
  const st = await run(() => {
    const g = window.voxelia?.game;
    const t = g?.interaction.target;
    return g && { ui: window.voxelia.ui.depth, dim: g.dimension, pos: [g.player.pos.x, g.player.pos.y, g.player.pos.z].map((v) => +v.toFixed(2)), target: t && [t.x, t.y, t.z, t.id], entity: g.interaction.targetEntity?.type ?? null, hp: g.player.health, damage: window.__mt?.damage };
  }).catch(() => null);
  console.log('état au moment de l’échec :', JSON.stringify(st));
  await shot('erreur').catch(() => undefined);
} finally {
  await browser.close();
  server.close();
}
console.log('\n' + results.join('\n'));
console.log(failed ? `\n${failed} échec(s)` : '\nTous les contrôles sont passés.');
process.exit(failed ? 1 : 0);
