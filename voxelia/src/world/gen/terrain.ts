/**
 * Façonnage du relief de la Surface : climat (température, humidité),
 * continentalité, érosion, crêtes, rivières, volcans, îles et choix du biome.
 * Toutes les fonctions sont pures (dépendent seulement de la graine et des coordonnées),
 * ce qui permet de placer arbres et structures de façon cohérente entre tronçons.
 */
import { Fbm, Simplex, clamp, lerp, smoothstep } from '../../util/noise';
import { hash2, rand2 } from '../../util/random';
import { SEA_LEVEL } from '../constants';
import { biomeKey } from '../biomes';

export type WorldTemplate = 'default' | 'flat' | 'archipelago' | 'amplified' | 'continents';

export interface GenOptions {
  seed: number;
  template: WorldTemplate;
  caves: boolean;
  structures: boolean;
  fantasyBiomes: boolean;
  drop3: boolean;
  dimensions: boolean;
}

export interface ColumnSample {
  /** Hauteur du sol (2D), avant grottes et surplombs. */
  height: number;
  biome: number;
  /** 0..1 : intensité montagneuse (active la densité 3D). */
  mountain: number;
  /** 0..1 : proximité du lit de rivière. */
  river: number;
  /** Lave de cratère : niveau (ou -1). */
  craterLava: number;
  temperature: number;
  humidity: number;
}

const B = {
  ocean: biomeKey('ocean'),
  deep_ocean: biomeKey('deep_ocean'),
  warm_ocean: biomeKey('warm_ocean'),
  frozen_ocean: biomeKey('frozen_ocean'),
  beach: biomeKey('beach'),
  plains: biomeKey('plains'),
  flower_meadow: biomeKey('flower_meadow'),
  forest: biomeKey('forest'),
  birch_forest: biomeKey('birch_forest'),
  dark_forest: biomeKey('dark_forest'),
  jungle: biomeKey('jungle'),
  desert: biomeKey('desert'),
  savanna: biomeKey('savanna'),
  taiga: biomeKey('taiga'),
  snowy_plains: biomeKey('snowy_plains'),
  snowy_taiga: biomeKey('snowy_taiga'),
  ice_spikes: biomeKey('ice_spikes'),
  mountains: biomeKey('mountains'),
  snowy_peaks: biomeKey('snowy_peaks'),
  swamp: biomeKey('swamp'),
  badlands: biomeKey('badlands'),
  mushroom_fields: biomeKey('mushroom_fields'),
  cherry_grove: biomeKey('cherry_grove'),
  river: biomeKey('river'),
  frozen_river: biomeKey('frozen_river'),
  volcano: biomeKey('volcano'),
  crystal_forest: biomeKey('crystal_forest'),
  enchanted_forest: biomeKey('enchanted_forest'),
  stony_shore: biomeKey('stony_shore'),
  tropical_islands: biomeKey('tropical_islands'),
  ash_plains: biomeKey('ash_plains'),
  meadow: biomeKey('meadow'),
};
export const OW_BIOMES = B;

const VOLCANO_CELL = 768;
const VOLCANO_RADIUS = 70;

export class OverworldShaper {
  private continental: Fbm;
  private erosion: Fbm;
  private ridges: Fbm;
  private detail: Fbm;
  private temp: Fbm;
  private humid: Fbm;
  private weird: Fbm;
  private riverN: Fbm;
  private warp: Fbm;
  private island: Fbm;
  private terrace: Fbm;
  private canyon: Simplex;
  readonly seed: number;
  private cache = new Map<number, ColumnSample>();

  constructor(readonly opts: GenOptions) {
    const s = opts.seed;
    this.seed = s;
    this.continental = new Fbm(s + 11, 5, 1 / 1400);
    this.erosion = new Fbm(s + 23, 4, 1 / 800);
    this.ridges = new Fbm(s + 37, 5, 1 / 420, 0.5, 2.1);
    this.detail = new Fbm(s + 41, 4, 1 / 140);
    this.temp = new Fbm(s + 53, 2, 1 / 2600, 0.4);
    this.humid = new Fbm(s + 67, 2, 1 / 2000, 0.4);
    this.weird = new Fbm(s + 71, 2, 1 / 1400, 0.4);
    this.riverN = new Fbm(s + 83, 4, 1 / 700);
    this.warp = new Fbm(s + 97, 2, 1 / 300);
    this.island = new Fbm(s + 101, 3, 1 / 140);
    this.terrace = new Fbm(s + 113, 3, 1 / 260);
    this.canyon = new Simplex(s + 127);
  }

  /** Échantillon mis en cache (les mêmes colonnes sont demandées plusieurs fois). */
  sample(x: number, z: number): ColumnSample {
    const key = ((x & 0xffff) << 16) | (z & 0xffff);
    let c = this.cache.get(key);
    if (c && this.cache.size < 200000) return c;
    if (this.cache.size >= 200000) this.cache.clear();
    c = this.compute(x, z);
    this.cache.set(key, c);
    return c;
  }

  private volcanoAt(x: number, z: number): { dist: number; vx: number; vz: number; size: number } | null {
    const gx = Math.floor(x / VOLCANO_CELL);
    const gz = Math.floor(z / VOLCANO_CELL);
    let best: { dist: number; vx: number; vz: number; size: number } | null = null;
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const cx = gx + dx;
        const cz = gz + dz;
        const h = hash2(this.seed ^ 0x51a1, cx, cz);
        if (h % 100 >= 18) continue;
        const vx = cx * VOLCANO_CELL + 120 + ((h >>> 8) % (VOLCANO_CELL - 240));
        const vz = cz * VOLCANO_CELL + 120 + ((h >>> 18) % (VOLCANO_CELL - 240));
        const size = 0.8 + ((h >>> 4) % 10) / 20;
        const d = Math.hypot(x - vx, z - vz);
        if (d < VOLCANO_RADIUS * size && (!best || d < best.dist)) best = { dist: d, vx, vz, size };
      }
    return best;
  }

  /** Position du volcan le plus proche du point (pour /locate et les cartes). */
  nearestVolcano(x: number, z: number): [number, number] | null {
    const gx = Math.floor(x / VOLCANO_CELL);
    const gz = Math.floor(z / VOLCANO_CELL);
    let best: [number, number] | null = null;
    let bd = Infinity;
    for (let dz = -3; dz <= 3; dz++)
      for (let dx = -3; dx <= 3; dx++) {
        const cx = gx + dx;
        const cz = gz + dz;
        const h = hash2(this.seed ^ 0x51a1, cx, cz);
        if (h % 100 >= 18) continue;
        const vx = cx * VOLCANO_CELL + 120 + ((h >>> 8) % (VOLCANO_CELL - 240));
        const vz = cz * VOLCANO_CELL + 120 + ((h >>> 18) % (VOLCANO_CELL - 240));
        if (this.compute(vx, vz).biome !== B.volcano) continue;
        const d = Math.hypot(x - vx, z - vz);
        if (d < bd) {
          bd = d;
          best = [vx, vz];
        }
      }
    return best;
  }

  private compute(x: number, z: number): ColumnSample {
    const tpl = this.opts.template;
    // Déformation du domaine pour des formes moins régulières.
    const wx = x + this.warp.get2(x, z) * 80;
    const wz = z + this.warp.get2(z + 1000, x - 1000) * 80;

    let c = this.continental.get2(wx, wz) * 1.9 + 0.22;
    if (tpl === 'archipelago') c = c * 0.7 - 0.38;
    if (tpl === 'continents') c = c * 0.8 + 0.25;
    const e = this.erosion.get2(wx, wz) * 1.8;
    const t = clamp(this.temp.get2(x, z) * 1.9, -1, 1);
    const h = clamp(this.humid.get2(x, z) * 1.9, -1, 1);
    const w = clamp(this.weird.get2(x, z) * 1.9, -1, 1);

    // Îles : relèvent ponctuellement le fond marin.
    let islandBoost = 0;
    if (c < -0.12 && c > -0.75) {
      const i = this.island.get2(x, z);
      const thr = tpl === 'archipelago' ? 0.18 : 0.33;
      if (i > thr) islandBoost = (i - thr) * (tpl === 'archipelago' ? 2.6 : 2.2);
    }
    c = clamp(c + islandBoost, -1, 1);

    // Hauteur de base selon la continentalité (spline par morceaux).
    let base: number;
    if (c < -0.55) base = lerp(26, 36, smoothstep(-1, -0.55, c));
    else if (c < -0.3) base = lerp(36, 50, smoothstep(-0.55, -0.3, c));
    else if (c < -0.15) base = lerp(50, 60, smoothstep(-0.3, -0.15, c));
    else if (c < -0.08) base = lerp(60, 64, smoothstep(-0.15, -0.08, c));
    else if (c < 0.3) base = lerp(64, 72, smoothstep(-0.08, 0.3, c));
    else base = lerp(72, 86, smoothstep(0.3, 1, c));

    const inland = smoothstep(-0.1, 0.05, c);
    const hillAmp = (5 + 9 * clamp(1 - e, 0, 2)) * inland + 2;
    let height = base + this.detail.get2(x, z) * hillAmp;

    // Montagnes : faible érosion + continentalité forte.
    let mountain = smoothstep(0.0, 0.5, c) * smoothstep(0.15, -0.45, e);
    if (tpl === 'amplified') mountain = Math.min(1, mountain * 1.6 + 0.15 * inland);
    const ridge = this.ridges.ridged2(x, z);
    const peakAmp = tpl === 'amplified' ? 190 : 115;
    height += mountain * (ridge * peakAmp - 10);

    // Plateaux alpins doux à l'érosion moyenne.
    const plateau = smoothstep(0.25, 0.6, c) * smoothstep(0.35, 0.05, Math.abs(e - 0.1)) * 0.5;
    height += plateau * 18;

    // Canyons ocre (badlands) : terrasses.
    let biome = -1;
    const hot = t > 0.45;
    const dry = h < -0.35;
    const badlandsZone = hot && dry && w > 0.0 && inland > 0.5 && mountain < 0.4;
    if (badlandsZone) {
      const k = smoothstep(0.0, 0.25, w) * smoothstep(-0.35, -0.55, h);
      const tr = (this.terrace.get2(x, z) + 1) * 0.5;
      const steps = Math.floor(tr * 6) / 6;
      const mesa = 76 + steps * 40;
      height = lerp(height, mesa, k);
      const cn = Math.abs(this.canyon.noise2(x / 180, z / 180));
      if (cn < 0.06) height = lerp(height, 66, smoothstep(0.06, 0.0, cn) * k);
      if (k > 0.3) biome = B.badlands;
    }

    // Rivières sinueuses.
    let river = 0;
    if (c > -0.18 && this.opts.template !== 'archipelago') {
      const rv = Math.abs(this.riverN.get2(wx * 1.0, wz * 1.0));
      const width = 0.035;
      if (rv < width * 2.4) {
        const fade = smoothstep(-0.18, -0.05, c) * (1 - mountain * 0.85);
        river = smoothstep(width * 2.4, width * 0.4, rv) * fade;
        const bed = SEA_LEVEL - 3 - smoothstep(width, 0, rv) * 3;
        if (rv < width) height = lerp(height, bed, fade);
        else height = lerp(height, Math.min(height, SEA_LEVEL + 2), smoothstep(width * 2.4, width, rv) * fade);
      }
    }

    // Volcans.
    let craterLava = -1;
    const v = inland > 0.5 && !this.opts.template.startsWith('flat') ? this.volcanoAt(x, z) : null;
    if (v) {
      const R = VOLCANO_RADIUS * v.size;
      const k = 1 - v.dist / R;
      const peak = 150 + v.size * 30;
      const cone = Math.pow(k, 1.6) * (peak - 70);
      const target = Math.max(height, 70 + cone + this.detail.get2(x * 3, z * 3) * 3);
      height = lerp(height, target, smoothstep(0, 0.25, k));
      const craterR = 9 * v.size;
      if (v.dist < craterR) {
        const rim = 70 + Math.pow(1 - craterR / R, 1.6) * (peak - 70);
        height = rim - (craterR - v.dist) * 1.6;
        craterLava = Math.floor(rim - 6);
      }
      if (k > 0.15) biome = B.volcano;
      mountain = Math.max(0, mountain * (1 - k));
    }

    height = clamp(height, 4, 250);

    // Choix du biome.
    if (biome < 0) biome = this.pickBiome(c, e, t, h, w, height, mountain, river);
    return { height, biome, mountain, river, craterLava, temperature: t, humidity: h };
  }

  private pickBiome(c: number, e: number, t: number, h: number, w: number, height: number, mountain: number, river: number): number {
    const fantasy = this.opts.fantasyBiomes;
    if (height < SEA_LEVEL - 1 && river > 0.35) return t < -0.6 ? B.frozen_river : B.river;
    if (height < SEA_LEVEL - 1) {
      if (c > -0.3 && t > 0.55 && this.opts.template === 'archipelago') return B.warm_ocean;
      if (t < -0.65) return B.frozen_ocean;
      if (t > 0.55) return B.warm_ocean;
      return c < -0.5 ? B.deep_ocean : B.ocean;
    }
    // Îles (terres émergées au milieu de l'océan).
    if (c < -0.2 && height < SEA_LEVEL + 12) {
      if (w > 0.6 && fantasy) return B.mushroom_fields;
      if (t > 0.25) return B.tropical_islands;
      return t < -0.6 ? B.snowy_plains : B.beach;
    }
    if (height < SEA_LEVEL + 3 && c < -0.05 && river < 0.2) {
      if (mountain > 0.3 || e < -0.4) return B.stony_shore;
      return t < -0.6 ? B.snowy_plains : B.beach;
    }
    if (mountain > 0.35 && height > 130) return height > 165 || t < -0.3 ? B.snowy_peaks : B.mountains;
    if (mountain > 0.25 && height > 105) return t < -0.4 ? B.snowy_taiga : h > 0.1 ? B.taiga : B.mountains;
    if (height > 95 && mountain < 0.25 && h > -0.2 && t > -0.3 && t < 0.4) return B.meadow;

    if (fantasy && w > 0.72 && t > -0.2 && t < 0.5) return h > 0.2 ? B.enchanted_forest : B.crystal_forest;
    if (this.opts.drop3 && w < -0.68 && t > 0.2 && h < 0.1) return B.ash_plains;

    if (t < -0.6) {
      if (w > 0.6) return B.ice_spikes;
      return h > 0.0 ? B.snowy_taiga : B.snowy_plains;
    }
    if (t < -0.3) return h > -0.15 ? B.taiga : B.plains;
    if (t < 0.25) {
      if (h < -0.35) return B.plains;
      if (h < -0.1) return w > 0.35 ? B.flower_meadow : B.plains;
      if (h < 0.25) return w < -0.4 ? B.cherry_grove : B.forest;
      if (h < 0.5) return B.birch_forest;
      return B.dark_forest;
    }
    if (t < 0.5) {
      if (h < -0.25) return B.savanna;
      if (h > 0.45 && height < SEA_LEVEL + 8) return B.swamp;
      if (h > 0.3) return B.dark_forest;
      if (w < -0.45) return B.cherry_grove;
      return B.forest;
    }
    if (h < -0.15) return B.desert;
    if (h < 0.2) return B.savanna;
    if (h > 0.45 && height < SEA_LEVEL + 8) return B.swamp;
    return B.jungle;
  }

  /** Bruit déterministe utile pour les variations de surface. */
  surfaceNoise(x: number, z: number): number {
    return rand2(this.seed ^ 0x77, x, z);
  }
}
