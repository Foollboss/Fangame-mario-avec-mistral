// Construit Voxerra en un seul fichier HTML autonome (npm run build:html).
// Le code, le style, les polices, le worker de génération et les mods de
// public/mods sont intégrés : il suffit d'ouvrir le fichier dans un navigateur.
//
//   node scripts/build-html.mjs [sortie.html] [--fragment fragment.html]
//
// --fragment écrit en plus une version sans <html>/<head>/<body> (page publiée
// dans un cadre qui fournit lui-même le squelette du document).
import { build } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const fragIdx = args.indexOf('--fragment');
const fragmentOut = fragIdx >= 0 ? path.resolve(args[fragIdx + 1]) : null;
const positional = args.filter((a, i) => !a.startsWith('--') && (fragIdx < 0 || i !== fragIdx + 1));
const out = path.resolve(positional[0] ?? path.join(root, 'Voxerra.html'));
const tmp = path.join(root, 'dist-single');

await build({
  root,
  configFile: path.join(root, 'vite.config.ts'),
  logLevel: 'warn',
  build: {
    outDir: tmp,
    emptyOutDir: true,
    assetsInlineLimit: 1e9, // polices en data: URI
    cssCodeSplit: false,
    modulePreload: false,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});

const assets = path.join(tmp, 'assets');
const files = fs.readdirSync(assets);
const pick = (re) => {
  const f = files.find((n) => re.test(n));
  if (!f) throw new Error(`Fichier introuvable dans dist-single/assets : ${re}`);
  return fs.readFileSync(path.join(assets, f), 'utf8');
};
const mainJs = pick(/^index-.*\.js$/);
const css = pick(/\.css$/);
const workerJs = pick(/^worldWorker-.*\.js$/);
// Le worker intégré est lancé comme script classique : aucune syntaxe de module permise
if (/(^|[;}\n])\s*(import|export)\s*[{*\w"'(]/.test(workerJs) || workerJs.includes('import.meta')) throw new Error('Le worker contient une syntaxe de module ES : impossible de l’intégrer comme script classique.');

// Mods déclarés dans public/mods/index.json
const modsDir = path.join(root, 'public', 'mods');
let mods = [];
try {
  const index = JSON.parse(fs.readFileSync(path.join(modsDir, 'index.json'), 'utf8'));
  mods = (index.packs ?? []).map((f) => JSON.parse(fs.readFileSync(path.join(modsDir, f), 'utf8')));
} catch (e) {
  console.warn('Aucun mod intégré :', e.message);
}

// Neutralise les séquences qui fermeraient une balise <script> prématurément
const safeScript = (code) => code.replace(/<\/script/gi, '<\\/script').replace(/<!--/g, '<\\!--');
const safeJson = (v) => JSON.stringify(v).replace(/</g, '\\u003c');

const body = [
  '<canvas id="game"></canvas>',
  '<div id="ui"></div>',
  `<script type="text/plain" id="voxerra-worker">${safeScript(workerJs)}</script>`,
  `<script>window.__VOXERRA_MODS__=${safeJson(mods)};(function(){try{var s=document.getElementById('voxerra-worker').textContent;window.__VOXERRA_WORKER__=URL.createObjectURL(new Blob([s],{type:'text/javascript'}));}catch(e){console.warn('Worker intégré indisponible',e);}})();</script>`,
  `<script type="module">${safeScript(mainJs)}</script>`,
].join('\n');

const head = [
  '<title>Voxerra</title>',
  '<meta name="description" content="Voxerra, bac à sable voxel original : exploration, survie, construction et trois dimensions." />',
  `<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%235d9b3a'/%3E%3Crect y='6' width='16' height='10' fill='%237a5335'/%3E%3C/svg%3E" />`,
  `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`,
].join('\n');

const full = `<!doctype html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
${head}
</head>
<body>
${body}
</body>
</html>
`;
fs.writeFileSync(out, full);
console.log(`✔ ${path.relative(process.cwd(), out)} (${(full.length / 1024 / 1024).toFixed(2)} Mo, ${mods.length} mod(s))`);
if (fragmentOut) {
  fs.writeFileSync(fragmentOut, `${head}\n${body}\n`);
  console.log(`✔ fragment ${fragmentOut}`);
}
fs.rmSync(tmp, { recursive: true, force: true });
