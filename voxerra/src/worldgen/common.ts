/** Outils communs aux générateurs de dimensions. */
import type { ChunkBuffer } from './buffer';
import { BIOMES, type WeightedStr } from './biomes';
import { hexToRgb, packRgb, clamp } from '../engine/math';
import type { SimplexNoise } from '../engine/noise';

const rgbCache = new Map<string, [number, number, number]>();
const rgb = (hex: string): [number, number, number] => {
  let c = rgbCache.get(hex);
  if (!c) {
    c = hexToRgb(hex);
    rgbCache.set(hex, c);
  }
  return c;
};

/**
 * Teintes (herbe, feuillage, eau) mélangées sur un rayon de ~10 blocs :
 * les couleurs glissent progressivement d'un biome à l'autre.
 */
export function computeTints(buf: ChunkBuffer, biomeAt: (x: number, z: number) => number, noise?: SimplexNoise): void {
  const N = 9;
  const lat = new Uint8Array(N * N);
  for (let k = 0; k < N; k++) for (let i = 0; i < N; i++) lat[k * N + i] = biomeAt(buf.bx - 8 + i * 4, buf.bz - 8 + k * 4);
  for (let z = 0; z < 16; z++)
    for (let x = 0; x < 16; x++) {
      let gr = 0,
        gg = 0,
        gb = 0,
        fr = 0,
        fg = 0,
        fb = 0,
        wr = 0,
        wg = 0,
        wb = 0,
        tw = 0;
      for (let k = 0; k < N; k++)
        for (let i = 0; i < N; i++) {
          const dx = -8 + i * 4 - x,
            dz = -8 + k * 4 - z;
          const d = Math.sqrt(dx * dx + dz * dz);
          if (d > 10) continue;
          const w = (1 - d / 10) ** 2;
          const b = BIOMES[lat[k * N + i]];
          const g = rgb(b.grass),
            f = rgb(b.foliage),
            wa = rgb(b.water);
          gr += g[0] * w;
          gg += g[1] * w;
          gb += g[2] * w;
          fr += f[0] * w;
          fg += f[1] * w;
          fb += f[2] * w;
          wr += wa[0] * w;
          wg += wa[1] * w;
          wb += wa[2] * w;
          tw += w;
        }
      if (tw === 0) tw = 1;
      const v = noise ? 1 + noise.noise2((buf.bx + x) / 38, (buf.bz + z) / 38) * 0.07 : 1;
      const i = (z * 16 + x) * 3;
      buf.tints[i] = packRgb(clamp((gr / tw) * v, 0, 255), clamp((gg / tw) * v, 0, 255), clamp((gb / tw) * v, 0, 255));
      buf.tints[i + 1] = packRgb(clamp((fr / tw) * v, 0, 255), clamp((fg / tw) * v, 0, 255), clamp((fb / tw) * v, 0, 255));
      buf.tints[i + 2] = packRgb(wr / tw, wg / tw, wb / tw);
    }
}

export function pickWeighted(list: WeightedStr[], r: number): string {
  let total = 0;
  for (const e of list) total += e.w;
  let acc = clamp(r, 0, 0.99999) * total;
  for (const e of list) {
    acc -= e.w;
    if (acc < 0) return e.id;
  }
  return list[list.length - 1].id;
}
