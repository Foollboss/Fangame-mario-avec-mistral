// Construit launcher/dist/Voxerra.exe (Windows 64 bits, sans console) :
// jeu autonome intégré, icône et informations de version.
//   node launcher/build.mjs            (Go 1.24+ requis)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const here = import.meta.dirname;
const root = path.resolve(here, '..');
const run = (cmd, args, opts = {}) => execFileSync(cmd, args, { stdio: 'inherit', cwd: here, ...opts });

fs.mkdirSync(path.join(here, 'game'), { recursive: true });
run(process.execPath, [path.join(root, 'scripts/build-html.mjs'), path.join(here, 'game/index.html')], { cwd: root });

// ressources Windows (icône, manifeste, version) : go-winres
const gobin = path.join(here, 'dist/tools');
fs.mkdirSync(gobin, { recursive: true });
const winres = path.join(gobin, process.platform === 'win32' ? 'go-winres.exe' : 'go-winres');
if (!fs.existsSync(winres)) run('go', ['install', 'github.com/tc-hib/go-winres@v0.3.3'], { env: { ...process.env, GOBIN: gobin } });
const version = JSON.parse(fs.readFileSync(path.join(root, 'desktop/package.json'), 'utf8')).version;
run(winres, [
  'simply', '--arch', 'amd64', '--out', 'rsrc',
  '--icon', path.join(root, 'desktop/build/icon.png'),
  '--manifest', 'gui',
  '--product-name', 'Voxerra', '--file-description', 'Voxerra', '--original-filename', 'Voxerra.exe',
  '--copyright', '@Fullboss971', '--product-version', version, '--file-version', version,
]);

run('go', ['build', '-trimpath', '-ldflags', '-H windowsgui -s -w', '-o', path.join(here, 'dist/Voxerra.exe'), '.'], {
  env: { ...process.env, GOOS: 'windows', GOARCH: 'amd64', CGO_ENABLED: '0' },
});
const size = fs.statSync(path.join(here, 'dist/Voxerra.exe')).size;
console.log(`✔ launcher/dist/Voxerra.exe (${(size / 1048576).toFixed(1)} Mo)`);
