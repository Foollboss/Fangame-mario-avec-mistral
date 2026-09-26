// Icônes des versions installables (Windows .exe, Android .apk), dessinées à
// partir de l'icône isométrique du bloc d'herbe du jeu.
//   node scripts/build-icons.mjs [url du jeu]   (par défaut : Voxerra.html)
// Écrit desktop/build/icon.png + icon.ico et les mipmaps d'android/app/src/main/res.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = path.resolve(import.meta.dirname, '..');
const url = process.argv[2] ?? pathToFileURL(path.join(root, 'Voxerra.html')).href;
const SKY = ['#8cc4ff', '#4f86d6'];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage();
await page.goto(url);
await page.waitForFunction(() => window.voxerra?.icons, null, { timeout: 60000 });

const out = await page.evaluate(async (SKY) => {
  const src = new Image();
  src.src = window.voxerra.icons.icon('herbe');
  await src.decode();
  const draw = (size, { bg, scale, radius }) => {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    if (bg) {
      const grad = g.createLinearGradient(0, 0, 0, size);
      grad.addColorStop(0, SKY[0]);
      grad.addColorStop(1, SKY[1]);
      g.fillStyle = grad;
      const r = size * radius;
      g.beginPath();
      g.roundRect(0, 0, size, size, r);
      g.fill();
    }
    const s = Math.round(size * scale);
    g.drawImage(src, Math.round((size - s) / 2), Math.round((size - s) / 2 + size * 0.02), s, s);
    return c.toDataURL('image/png');
  };
  const res = {};
  // Windows : bloc seul sur fond transparent
  for (const s of [16, 24, 32, 48, 64, 128, 256]) res['win' + s] = draw(s, { scale: 1.0 });
  res.png512 = draw(512, { scale: 1.0 });
  // Android : icône classique (carré arrondi) et avant-plan de l'icône adaptative
  for (const [d, s] of Object.entries({ mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 })) {
    res['legacy_' + d] = draw(s, { bg: true, scale: 0.8, radius: 0.18 });
    res['fg_' + d] = draw(Math.round(s * 2.25), { scale: 0.62 });
  }
  return res;
}, SKY);
await browser.close();

const buf = (dataUrl) => Buffer.from(dataUrl.split(',')[1], 'base64');
const write = (file, data) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, data);
};

// .ico : entrées PNG (acceptées par Windows Vista et suivants)
const sizes = [16, 24, 32, 48, 64, 128, 256];
const pngs = sizes.map((s) => buf(out['win' + s]));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s >= 256 ? 0 : s, e);
  header.writeUInt8(s >= 256 ? 0 : s, e + 1);
  header.writeUInt16LE(1, e + 4); // plans
  header.writeUInt16LE(32, e + 6); // bits par pixel
  header.writeUInt32LE(pngs[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += pngs[i].length;
});
write(path.join(root, 'desktop/build/icon.ico'), Buffer.concat([header, ...pngs]));
write(path.join(root, 'desktop/build/icon.png'), buf(out.png512));

const res = path.join(root, 'android/app/src/main/res');
for (const d of ['mdpi', 'hdpi', 'xhdpi', 'xxhdpi', 'xxxhdpi']) {
  write(path.join(res, `mipmap-${d}/ic_launcher.png`), buf(out['legacy_' + d]));
  write(path.join(res, `mipmap-${d}/ic_launcher_foreground.png`), buf(out['fg_' + d]));
}
console.log('✔ icônes : desktop/build/icon.{ico,png}, android/app/src/main/res/mipmap-*');
