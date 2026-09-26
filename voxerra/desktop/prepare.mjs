// Copie le jeu (fichier HTML autonome) et l'icône dans app/ avant l'empaquetage.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const here = import.meta.dirname;
const root = path.resolve(here, '..');
const app = path.join(here, 'app');
fs.mkdirSync(app, { recursive: true });
execFileSync(process.execPath, [path.join(root, 'scripts/build-html.mjs'), path.join(app, 'index.html')], { stdio: 'inherit', cwd: root });
fs.copyFileSync(path.join(here, 'build/icon.ico'), path.join(app, 'icon.ico'));
fs.copyFileSync(path.join(here, 'build/icon.png'), path.join(app, 'icon.png'));
console.log('✔ desktop/app prêt');
