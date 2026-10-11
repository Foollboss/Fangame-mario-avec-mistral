// Capture d'écran du jeu dans Chromium headless (WebGL via SwiftShader).
// Usage : node tools/shot.mjs <url> <sortie.png> [attente_ms] [script_js]
import { chromium } from 'playwright-core';
const [url, out, wait = '6000', script = '', w = '1280', h = '720'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) } });
const logs = [];
page.on('console', (m) => logs.push(`[${m.type()}] ${m.text()}`));
page.on('pageerror', (e) => logs.push(`[pageerror] ${e.message}`));
await page.goto(url);
await page.waitForTimeout(Number(wait));
if (script) {
  const r = await page.evaluate(script);
  if (r !== undefined) console.log('résultat:', JSON.stringify(r));
  await page.waitForTimeout(1500);
}
await page.screenshot({ path: out });
console.log(logs.filter((l, i) => i < 8 || l.includes('error') || l.includes('ERROR')).slice(0, 40).join('\n'));
await browser.close();
