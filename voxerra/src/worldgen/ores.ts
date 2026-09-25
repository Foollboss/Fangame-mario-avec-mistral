/** Filons de minerais et poches de roches (déterministes par colonne). */
import { Rng, hash3 } from '../engine/rng';
import type { ChunkBuffer } from './buffer';
import { CS } from '../world/constants';

export interface OreSpec {
  block: string;
  replace: string[];
  minY: number;
  maxY: number;
  veins: number;
  size: number;
  /** Probabilité qu'un filon apparaisse (pour les minerais rares). */
  chance?: number;
}

export const SURFACE_ORES: OreSpec[] = [
  { block: 'granit_rose', replace: ['pierre'], minY: 10, maxY: 110, veins: 2, size: 34 },
  { block: 'calcaire', replace: ['pierre'], minY: 20, maxY: 120, veins: 2, size: 30 },
  { block: 'gravier', replace: ['pierre'], minY: 5, maxY: 100, veins: 3, size: 24 },
  { block: 'terre', replace: ['pierre'], minY: 30, maxY: 110, veins: 3, size: 24 },
  { block: 'minerai_houille', replace: ['pierre'], minY: 5, maxY: 140, veins: 18, size: 12 },
  { block: 'minerai_cuivre', replace: ['pierre'], minY: 0, maxY: 96, veins: 10, size: 9 },
  { block: 'minerai_fer', replace: ['pierre', 'roche_profonde'], minY: 0, maxY: 72, veins: 12, size: 8 },
  { block: 'minerai_or', replace: ['pierre', 'roche_profonde'], minY: 0, maxY: 34, veins: 3, size: 7 },
  { block: 'minerai_lumirite', replace: ['pierre', 'roche_profonde'], minY: 0, maxY: 42, veins: 5, size: 6 },
  { block: 'minerai_celestine', replace: ['roche_profonde', 'pierre'], minY: 1, maxY: 18, veins: 2, size: 4, chance: 0.8 },
];

export const ABYSS_ORES: OreSpec[] = [
  { block: 'minerai_braisite', replace: ['cendrite'], minY: 8, maxY: 118, veins: 10, size: 6 },
  { block: 'soufre', replace: ['cendrite'], minY: 8, maxY: 118, veins: 3, size: 10 },
  { block: 'minerai_or', replace: ['cendrite'], minY: 8, maxY: 118, veins: 6, size: 6 },
  { block: 'basalte', replace: ['cendrite'], minY: 8, maxY: 118, veins: 3, size: 30 },
  { block: 'verre_volcanique', replace: ['cendrite', 'basalte'], minY: 10, maxY: 40, veins: 2, size: 5, chance: 0.6 },
];

export const ASTRAL_ORES: OreSpec[] = [
  { block: 'minerai_etherium', replace: ['pierre_astrale'], minY: 0, maxY: 200, veins: 4, size: 5 },
  { block: 'minerai_lumirite', replace: ['pierre_astrale'], minY: 0, maxY: 200, veins: 3, size: 6 },
  { block: 'poussiere_etoile', replace: ['pierre_astrale'], minY: 0, maxY: 200, veins: 2, size: 20 },
];

export function generateOres(buf: ChunkBuffer, specs: OreSpec[], seed: number, num: (id: string) => number, maxY = 255): void {
  specs.forEach((spec, k) => {
    const rng = new Rng(hash3(seed ^ 0x0e5, buf.cx, k, buf.cz));
    const ore = num(spec.block);
    const replace = new Set(spec.replace.map(num));
    const top = Math.min(spec.maxY, maxY);
    if (top <= spec.minY) return;
    for (let v = 0; v < spec.veins; v++) {
      if (spec.chance !== undefined && !rng.chance(spec.chance)) continue;
      let x = rng.int(CS),
        y = rng.range(spec.minY, top),
        z = rng.int(CS);
      for (let i = 0; i < spec.size; i++) {
        if (x >= 0 && x < CS && z >= 0 && z < CS && y > 0) {
          const cur = buf.get(x, y, z) & 0xfff;
          if (replace.has(cur)) buf.set(x, y, z, ore);
        }
        // marche aléatoire compacte
        const d = rng.int(6);
        if (d === 0) x++;
        else if (d === 1) x--;
        else if (d === 2) y++;
        else if (d === 3) y--;
        else if (d === 4) z++;
        else z--;
        if (spec.size > 16 && rng.chance(0.3)) {
          // les grosses poches restent « rondes »
          x = Math.max(-1, Math.min(CS, x));
          z = Math.max(-1, Math.min(CS, z));
        }
      }
    }
  });
}
