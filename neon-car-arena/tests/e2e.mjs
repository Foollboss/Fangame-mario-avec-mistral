// Test de bout en bout dans Chromium (écran de smartphone en paysage, tactile) :
// MENU → MATCH → contrôle → but → fin → RÉSULTATS → MENU, avec captures d'écran.
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const URL = process.env.URL || 'http://localhost:4173/';
const OUT = new globalThis.URL('./output/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const exe = process.env.CHROME || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
const shot = (n) => page.screenshot({ path: `${OUT}${n}.png` });
const tap = async (sel) => { const b = await page.locator(sel).first().boundingBox(); await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); await page.waitForTimeout(250); };
const wait = (ms) => page.waitForTimeout(ms);

await page.goto(URL);
await wait(1500);
await shot('01-boot');
await tap('.boot');
await wait(800);
await shot('02-menu');
await tap('[data-go="garage"]');
await wait(800);
await shot('03-garage');
await tap('[data-cat="paint"]');
await tap('.item:not(.locked) >> nth=1');
await wait(600);
await shot('04-garage-paint');
await tap('[data-back]');
await tap('[data-go="settings"]');
await shot('05-settings');
await tap('[data-back]');
await tap('[data-go="play"]');
await shot('06-play');
await tap('[data-seg="dur"] button[data-v="120"]');
await tap('[data-start]');
await wait(1200);
await shot('07-countdown');
await wait(2500);
// Pilotage tactile : accélérer + boost en maintenant les boutons
const box = async (s) => page.locator(s).boundingBox();
const acc = await box('.tbtn-accel');
const bst = await box('.tbtn-boost');
const cdp = await ctx.newCDPSession(page);
const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts });
const P = (b, id) => ({ x: b.x + b.width / 2, y: b.y + b.height / 2, id });
await touch('touchStart', [P(acc, 1)]);
await wait(600);
await touch('touchStart', [P(acc, 1), P(bst, 2)]);
await wait(900);
await shot('08-driving');
const drive = await page.evaluate(() => { const c = window.__game.match.playerCar; return { speed: c.vel.length(), boost: c.boost, z: c.pos.z }; });
await touch('touchEnd', []);
console.log('Pilotage tactile :', drive);
if (drive.speed < 15) errors.push('La voiture n\'a pas accéléré avec les commandes tactiles');
const stats = await page.evaluate(() => ({ phase: window.__game.match.phase, cars: window.__game.match.sim.cars.length }));
console.log('Match :', stats);
await page.evaluate(() => { const m = window.__game.match; m.sim.ball.pos.set(0, 5, 100); m.sim.ball.vel.set(0, 0, 40); });
await wait(700);
await shot('09-goal');
await wait(2500);
await shot('10-replay');
await tap('.replay-skip');
await wait(500);
// Fin de match accélérée
await page.evaluate(() => { const m = window.__game.match; m.clock = 1; m.kickoffActive = false; });
await wait(5000);
const phase = await page.evaluate(() => window.__game.state);
await shot('11-results');
console.log('État après fin :', phase);
if (phase !== 'results') errors.push('Pas d\'écran de résultats');
await tap('[data-menu]');
await wait(800);
await shot('12-menu-after');
const save = await page.evaluate(() => window.__game.save.data.stats);
console.log('Stats sauvegardées :', save);
if (save.matches !== 1) errors.push('Statistiques non sauvegardées');
// Entraînement
await tap('[data-go="training"]');
await tap('[data-drill="aerials"]');
await tap('[data-start]');
await wait(1500);
await shot('13-training');
const fps = await page.evaluate(() => new Promise((r) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else r(n / 2); }; requestAnimationFrame(f); }));
console.log('FPS (SwiftShader, rendu logiciel) :', fps);
await browser.close();
if (errors.length) { console.error('ERREURS :', errors); process.exit(1); }
console.log('E2E OK');
