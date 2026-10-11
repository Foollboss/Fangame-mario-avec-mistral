// Diagnostic : carte des biomes et du relief vue du dessus.
// Usage : npx esbuild tools/biome-map.ts --bundle --platform=node --outfile=/tmp/bm.cjs && node /tmp/bm.cjs <graine> <taille> <sortie.png>
import { writeFileSync } from 'node:fs';
import { OverworldShaper } from '../src/world/gen/terrain';
import { BIOMES } from '../src/world/biomes';
import { SEA_LEVEL } from '../src/world/constants';
// @ts-ignore
import { encodePNG } from './png.mjs';

const seed = Number(process.argv[2] ?? 12345);
const size = Number(process.argv[3] ?? 512);
const scale = Number(process.argv[5] ?? 8);
const out = process.argv[4] ?? 'biomes.png';
const sh = new OverworldShaper({ seed, template: 'default', caves: true, structures: true, fantasyBiomes: true, drop3: true, dimensions: true });
const rgb = new Uint8Array(size * size * 3);
const counts = new Map<string, number>();
let hmin = 999, hmax = 0;
for (let py = 0; py < size; py++)
  for (let px = 0; px < size; px++) {
    const x = (px - size / 2) * scale, z = (py - size / 2) * scale;
    const s = sh.sample(x, z);
    const b = BIOMES[s.biome];
    counts.set(b.key, (counts.get(b.key) ?? 0) + 1);
    hmin = Math.min(hmin, s.height); hmax = Math.max(hmax, s.height);
    let col = b.isOcean || s.height < SEA_LEVEL ? b.water : b.key === 'desert' || b.key === 'beach' ? 0xdccf98 : b.key === 'badlands' ? 0xc06030 : b.key.includes('snow') || b.frozen ? 0xf0f4ff : b.key === 'volcano' ? 0x403030 : b.key === 'mountains' ? 0x8a8a8a : b.grass;
    const shade = s.height < SEA_LEVEL ? 0.6 + (s.height / SEA_LEVEL) * 0.4 : 0.75 + Math.min(0.5, (s.height - SEA_LEVEL) / 160);
    const i = (py * size + px) * 3;
    rgb[i] = Math.min(255, ((col >> 16) & 255) * shade); rgb[i + 1] = Math.min(255, ((col >> 8) & 255) * shade); rgb[i + 2] = Math.min(255, (col & 255) * shade);
  }
writeFileSync(out, encodePNG(size, size, Buffer.from(rgb)));
console.log('hauteur', hmin.toFixed(1), hmax.toFixed(1));
console.log([...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k}:${((v / (size * size)) * 100).toFixed(1)}%`).join('  '));
