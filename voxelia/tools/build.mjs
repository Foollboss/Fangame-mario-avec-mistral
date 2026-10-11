// Construit le jeu web dans dist/ (bundle esbuild + fichiers statiques).
// Options : --watch (reconstruit à chaque modification), --serve (serveur local http://localhost:8080)
import * as esbuild from 'esbuild';
import { cpSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const watch = process.argv.includes('--watch');
const serve = process.argv.includes('--serve');
const minify = !watch;

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
cpSync(join(root, 'public'), dist, { recursive: true });

const common = {
  bundle: true,
  minify,
  sourcemap: watch ? 'inline' : false,
  target: ['chrome80', 'safari15', 'firefox100'],
  logLevel: 'info',
  define: { __VERSION__: JSON.stringify(process.env.npm_package_version || '0.1.0') },
};

const configs = [
  { ...common, entryPoints: [join(root, 'src/main.ts')], outfile: join(dist, 'game.js'), format: 'iife' },
  { ...common, entryPoints: [join(root, 'src/workers/world.worker.ts')], outfile: join(dist, 'world.worker.js'), format: 'iife' },
];

if (watch) {
  for (const c of configs) {
    const ctx = await esbuild.context(c);
    await ctx.watch();
  }
} else {
  await Promise.all(configs.map((c) => esbuild.build(c)));
}

if (serve) {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.ttf': 'font/ttf', '.json': 'application/json', '.svg': 'image/svg+xml' };
  const port = Number(process.env.PORT || 8080);
  createServer(async (req, res) => {
    let p = decodeURIComponent((req.url || '/').split('?')[0]);
    if (p === '/') p = '/index.html';
    const file = join(dist, p);
    if (!file.startsWith(dist) || !existsSync(file)) { res.writeHead(404); res.end('404'); return; }
    res.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(await readFile(file));
  }).listen(port, () => console.log(`Voxelia : http://localhost:${port}`));
}
