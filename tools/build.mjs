// Bundles the game into one self-contained HTML file (JS, CSS and fonts inlined).
//   dist/index.html      full document (web hosting, Android assets)
//   dist/artifact.html   body-only variant for hosts that provide the document skeleton
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const watch = process.argv.includes('--watch');
const out = path.join(root, 'dist');
fs.mkdirSync(out, { recursive: true });

const FONTS = [
  ['Chakra Petch', 700, 'normal', 'ChakraPetch-700.woff2'],
  ['Chakra Petch', 700, 'italic', 'ChakraPetch-700i.woff2'],
  ['Saira Semi Condensed', 500, 'normal', 'SairaSemiCondensed-500.woff2'],
  ['Saira Semi Condensed', 700, 'normal', 'SairaSemiCondensed-700.woff2'],
];

function fontFaces() {
  return FONTS.map(([family, weight, style, file]) => {
    const b64 = fs.readFileSync(path.join(root, 'assets/fonts', file)).toString('base64');
    return `@font-face{font-family:'${family}';font-style:${style};font-weight:${weight};font-display:swap;src:url(data:font/woff2;base64,${b64}) format('woff2');}`;
  }).join('\n');
}

async function build() {
  const t0 = Date.now();
  const result = await esbuild.build({
    entryPoints: [path.join(root, 'src/main.js')],
    bundle: true,
    minify: true,
    format: 'iife',
    target: ['chrome80', 'safari14', 'firefox90'],
    write: false,
    legalComments: 'none',
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const js = result.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
  const css = fontFaces() + '\n' + fs.readFileSync(path.join(root, 'src/ui/styles.css'), 'utf8');
  const tpl = fs.readFileSync(path.join(root, 'src/index.template.html'), 'utf8');
  const title = '<title>Neon Car Arena</title>';
  const style = `<style>${css}</style>`;
  const body = tpl.replace('<!--HEAD-->\n', '').replace('/*APP*/', () => js);
  const full = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">
<meta name="theme-color" content="#070a14">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="description" content="Football automobile arcade : arène néon, boost, sauts et bots.">
${title}
${style}
</head>
<body>
${body}
</body>
</html>
`;
  fs.writeFileSync(path.join(out, 'index.html'), full);
  fs.writeFileSync(path.join(out, 'artifact.html'), `${title}\n${style}\n${body}`);
  const kb = (Buffer.byteLength(full) / 1024).toFixed(0);
  console.log(`built dist/index.html (${kb} KB) in ${Date.now() - t0} ms`);
}

await build();
if (watch) {
  console.log('watching src/ …');
  let timer = null;
  fs.watch(path.join(root, 'src'), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => build().catch((e) => console.error(e.message)), 120);
  });
}
