// Liste les textes à traduire (clés françaises) trouvés dans le code :
// appels t('…'), tr('…') et T('…'). Utilisé par le test de couverture et
// pour compléter src/i18n/en.json et es.json.
//   node scripts/i18n-keys.mjs            → affiche les clés manquantes
//   node scripts/i18n-keys.mjs --all      → affiche toutes les clés
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');

export function collectKeys() {
  const keys = new Set();
  const walk = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (p.endsWith('.ts')) {
        const src = fs.readFileSync(p, 'utf8');
        for (const m of src.matchAll(/\b(?:t|tr|T)\(\s*'((?:[^'\\]|\\.)*)'/g)) keys.add(m[1].replace(/\\'/g, "'"));
        for (const m of src.matchAll(/\b(?:t|tr|T)\(\s*"((?:[^"\\]|\\.)*)"/g)) keys.add(m[1].replace(/\\"/g, '"'));
      }
    }
  };
  walk(path.join(root, 'src'));
  walk(path.join(root, 'server'));
  return [...keys].sort();
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
  const keys = collectKeys();
  const all = process.argv.includes('--all');
  for (const lang of ['en', 'es']) {
    const dict = JSON.parse(fs.readFileSync(path.join(root, 'src/i18n', `${lang}.json`), 'utf8'));
    const missing = keys.filter((k) => !(k in dict));
    const unused = Object.keys(dict).filter((k) => !keys.includes(k));
    console.log(`${lang} : ${keys.length} clés, ${missing.length} manquantes, ${unused.length} inutilisées`);
    if (all || missing.length) console.log(JSON.stringify(all ? keys : missing, null, 1));
  }
}
