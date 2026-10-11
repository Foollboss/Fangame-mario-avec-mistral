// Diagnostic : planche de toutes les textures de blocs (agrandies x4) + liste des textures manquantes.
import { writeFileSync } from 'node:fs';
import { allBlockTextures } from '../src/world/blocks';
import { paintBlockTexture, hasPainter } from '../src/render/textures/blockTextures';
// @ts-ignore
import { encodePNG } from './png.mjs';

const names = allBlockTextures().concat(['bed_head_top']);
const missing = names.filter((n) => !hasPainter(n));
console.log('textures:', names.length, 'manquantes:', missing.join(', ') || 'aucune');
const S = 4, cols = 20, rows = Math.ceil(names.length / cols);
const W = cols * 17 * S, H = rows * 17 * S;
const rgb = Buffer.alloc(W * H * 3, 40);
names.forEach((n, i) => {
  const p = paintBlockTexture(n);
  if (!p) return;
  const ox = (i % cols) * 17 * S, oy = Math.floor(i / cols) * 17 * S;
  for (let y = 0; y < 16 * S; y++) for (let x = 0; x < 16 * S; x++) {
    const k = ((Math.floor(y / S) * 16) + Math.floor(x / S)) * 4;
    const a = p.data[k + 3] / 255;
    const bg = ((x >> 3) + (y >> 3)) % 2 ? 90 : 60;
    const o = ((oy + y) * W + ox + x) * 3;
    for (let c = 0; c < 3; c++) rgb[o + c] = p.data[k + c] * a + bg * (1 - a);
  }
});
writeFileSync(process.argv[2] ?? 'sheet.png', encodePNG(W, H, rgb));
console.log(names.map((n, i) => `${i}:${n}`).join(' '));
