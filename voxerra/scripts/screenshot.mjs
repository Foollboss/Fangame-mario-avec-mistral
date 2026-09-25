// Capture d'écran automatisée (Playwright + Chromium headless, WebGL logiciel).
// Usage : node scripts/screenshot.mjs <url> <sortie.png> [attente_ms] [script_js]
import { chromium } from 'playwright';
import fs from 'node:fs';

const [url = 'http://localhost:5173/', out = 'screenshots/shot.png', waitMs = '8000', script = ''] = process.argv.slice(2);
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => fs.existsSync(p));
const browser = await chromium.launch({
  executablePath: exe,
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}\n${e.stack}`));
await page.goto(url);
await page.waitForTimeout(Number(waitMs));
if (script) {
  const r = await page.evaluate(script);
  if (r !== undefined) console.log('eval:', JSON.stringify(r));
  await page.waitForTimeout(1500);
}
fs.mkdirSync(out.split('/').slice(0, -1).join('/') || '.', { recursive: true });
await page.screenshot({ path: out });
console.log(logs.slice(-40).join('\n'));
await browser.close();
