/**
 * Générateur du monde de surface (« Terres d'Aube »).
 * Couches de bruit : continentalité, érosion, crêtes, température, humidité,
 * rivières, plateaux ocre ; relief 3D en montagne ; grottes « fromage » et
 * « spaghetti » ; biomes classés à partir du climat continu (transitions douces
 * + teintes mélangées).
 */
import { SimplexNoise } from '../engine/noise';
import { hash2, hash3, hashFloat } from '../engine/rng';
import { clamp, smoothstep } from '../engine/math';
import { ChunkBuffer } from './buffer';
import { BIOMES, biomeIdx, type BiomeDef } from './biomes';
import { placeTree, TREE_RADIUS } from './trees';
import { generateOres, SURFACE_ORES } from './ores';
import { SEA_LEVEL, CS, WORLD_H } from '../world/constants';
import type { Content } from '../registry/content';
import type { DimGenerator } from './generator';
import { computeTints, pickWeighted } from './common';
import { StructureManager } from './structures';

export interface Climate {
  c: number;
  e: number;
  pk: number;
  t: number;
  hu: number;
  riv: number;
  rf: number;
  mesa: number;
  mesaF: number;
  rare: number;
  m: number;
  land: number;
  d: number;
  h: number;
}

const newClimate = (): Climate => ({ c: 0, e: 0, pk: 0, t: 0, hu: 0, riv: 0, rf: 0, mesa: 0, mesaF: 0, rare: 0, m: 0, land: 0, d: 0, h: 0 });

// Courbe de hauteur selon la continentalité
const SPLINE: [number, number][] = [
  [-1, 24],
  [-0.55, 34],
  [-0.3, 48],
  [-0.16, 57],
  [-0.08, 62.5],
  [0.0, 66],
  [0.25, 71],
  [0.55, 79],
  [1, 92],
];
function spline(c: number): number {
  if (c <= SPLINE[0][0]) return SPLINE[0][1];
  for (let i = 1; i < SPLINE.length; i++) {
    const [x1, y1] = SPLINE[i];
    if (c <= x1) {
      const [x0, y0] = SPLINE[i - 1];
      return y0 + ((c - x0) / (x1 - x0)) * (y1 - y0);
    }
  }
  return SPLINE[SPLINE.length - 1][1];
}

export class OverworldGenerator implements DimGenerator {
  readonly dim = 'surface';
  private cont: SimplexNoise;
  private eros: SimplexNoise;
  private peaks: SimplexNoise;
  private temp: SimplexNoise;
  private humid: SimplexNoise;
  private river: SimplexNoise;
  private warp: SimplexNoise;
  private detail: SimplexNoise;
  private mesaN: SimplexNoise;
  private rareN: SimplexNoise;
  private jitter: SimplexNoise;
  private over3d: SimplexNoise;
  private caveA: SimplexNoise;
  private caveB: SimplexNoise;
  private caveC: SimplexNoise;
  private caveD: SimplexNoise;
  private caveE: SimplexNoise;
  private caveF: SimplexNoise;
  private patch: SimplexNoise;
  private tmp = newClimate();
  readonly structures: StructureManager;
  private ids: Record<string, number> = {};
  private topId: number[];
  private fillerId: number[];
  private stoneId: number[];
  private underId: number[];
  readonly num: (id: string) => number;

  constructor(
    readonly seed: number,
    readonly content: Content,
  ) {
    const s = (k: number) => new SimplexNoise((seed ^ Math.imul(k, 0x9e3779b1)) >>> 0);
    this.cont = s(1);
    this.eros = s(2);
    this.peaks = s(3);
    this.temp = s(4);
    this.humid = s(5);
    this.river = s(6);
    this.warp = s(7);
    this.detail = s(8);
    this.mesaN = s(9);
    this.rareN = s(10);
    this.jitter = s(11);
    this.over3d = s(12);
    this.caveA = s(13);
    this.caveB = s(14);
    this.caveC = s(15);
    this.caveD = s(16);
    this.caveE = s(17);
    this.caveF = s(18);
    this.patch = s(19);
    this.num = (id: string) => content.blocks.num(id);
    for (const id of [
      'socle', 'pierre', 'roche_profonde', 'terre', 'herbe', 'sable', 'gres', 'gravier', 'argile', 'eau', 'lave', 'glace', 'neige',
      'neige_poudreuse', 'glace_compacte', 'humus', 'mousse', 'boue', 'cactus', 'roseau', 'moellon_moussu', 'minerai_lumirite', 'calcaire',
      'argile_cuite_ocre', 'argile_cuite_rouge', 'argile_cuite_blanche', 'argile_cuite_brune', 'argile_cuite_jaune', 'sable_ocre', 'mycelium',
    ])
      this.ids[id] = this.num(id);
    this.topId = BIOMES.map((b) => this.num(b.top));
    this.fillerId = BIOMES.map((b) => this.num(b.filler));
    this.stoneId = BIOMES.map((b) => this.num(b.stone ?? 'pierre'));
    this.underId = BIOMES.map((b) => this.num(b.underwater ?? 'sable'));
    this.structures = new StructureManager(seed, content, this);
  }

  /** Échantillonne le climat et la hauteur (fonction pure). */
  sample(x: number, z: number, o: Climate = this.tmp): Climate {
    const wx = x + this.warp.noise2(x * 0.0035, z * 0.0035) * 38;
    const wz = z + this.warp.noise2(x * 0.0035 + 71.3, z * 0.0035 - 17.9) * 38;
    const c = clamp(this.cont.fbm2(wx / 1300, wz / 1300, 5) * 1.55 + 0.1, -1, 1);
    const e = clamp(this.eros.fbm2(wx / 650, wz / 650, 4) * 1.5, -1, 1);
    const pk = this.peaks.ridged2(wx / 380, wz / 380, 4);
    const t = clamp(this.temp.fbm2(x / 1150, z / 1150, 3) * 1.6, -1, 1);
    const hu = clamp(this.humid.fbm2(x / 950 + 100, z / 950, 3) * 1.6, -1, 1);
    const riv = Math.abs(this.river.fbm2(wx / 760, wz / 760, 4));
    const mesa = this.mesaN.noise2(x / 320, z / 320);
    const rare = this.rareN.noise2(x / 520, z / 520);
    const d = this.detail.fbm2(x / 95, z / 95, 4);
    const micro = this.detail.noise2(x / 23, z / 23);

    const land = smoothstep(-0.14, 0.02, c);
    const m = smoothstep(-0.05, 0.35, c) * smoothstep(0.15, -0.45, e);
    let h = spline(c) + d * (4 + 9 * smoothstep(0.35, -0.35, e)) * land + m * (18 + pk * pk * 100) + micro * 0.5 * land;
    // Plateaux et canyons ocre (terrasses)
    const mesaF = smoothstep(0.25, 0.45, mesa) * smoothstep(0.3, 0.5, t) * smoothstep(0.05, -0.15, hu) * land * (1 - m);
    if (mesaF > 0) {
      const step = Math.floor((12 + pk * 34) / 6) * 6;
      h += smoothstep(0.25, 0.75, mesaF) * step;
    }
    // Marécages : aplanis près du niveau de la mer
    const sw = smoothstep(0.32, 0.5, hu) * smoothstep(-0.15, 0.1, t) * land * (1 - m) * (1 - mesaF);
    if (sw > 0) h = h + (SEA_LEVEL + 0.2 + d * 3.2 - h) * sw * 0.85;
    // Rivières
    let rf = (1 - smoothstep(0.0, 0.05, riv)) * land * (1 - smoothstep(0.2, 0.6, m));
    const bed = SEA_LEVEL - 3.5;
    if (rf > 0 && h > bed) h -= (h - bed) * smoothstep(0, 1, rf);
    o.c = c;
    o.e = e;
    o.pk = pk;
    o.t = t;
    o.hu = hu;
    o.riv = riv;
    o.rf = rf;
    o.mesa = mesa;
    o.mesaF = mesaF;
    o.rare = rare;
    o.m = m;
    o.land = land;
    o.d = d;
    o.h = h;
    return o;
  }

  /** Hauteur du sol (bloc solide le plus haut) hors relief 3D. */
  surfaceHeight(x: number, z: number): number {
    return Math.floor(this.sample(x, z).h);
  }

  /** Classement du biome à partir du climat. */
  classify(cl: Climate, x: number, z: number): number {
    const j1 = this.jitter.noise2(x / 11, z / 11) * 0.05;
    const j2 = this.jitter.noise2(x / 11 + 40, z / 11 - 40) * 0.05;
    const h = cl.h;
    const t = cl.t + j1 - Math.max(0, h - 95) / 55;
    const hu = cl.hu + j2;
    if (h < SEA_LEVEL - 0.5 && cl.rf < 0.35) {
      if (t < -0.45) return I.ocean_gele;
      return h < SEA_LEVEL - 16 ? I.ocean_profond : I.ocean;
    }
    if (cl.rf > 0.45 && h < SEA_LEVEL + 0.5) return t < -0.45 ? I.riviere_gelee : I.riviere;
    if (h < SEA_LEVEL + 2.6 && cl.c < 0.06 && cl.m < 0.3 && cl.rf < 0.3) {
      if (cl.m > 0.12 || cl.e < -0.35) return I.rivage_rocheux;
      return t < -0.45 ? I.toundra : I.plage;
    }
    if (cl.m > 0.45 && h > 122) return t < 0.3 ? I.pics_geles : I.montagnes;
    if (cl.m > 0.28 && h > 92) return I.montagnes;
    if (cl.mesaF > 0.45) return I.canyons_ocre;
    const r = cl.rare + j1;
    if (r > 0.8 && t > -0.35 && t < 0.45) return I.bosquet_cristal;
    if (r < -0.83 && hu > -0.1) return I.foret_fongique;
    if (t < -0.45) return hu < -0.05 ? I.toundra : I.taiga_enneigee;
    if (t < -0.12) return I.taiga;
    if (hu > 0.35 && h < SEA_LEVEL + 5) return I.marecage;
    if (t < 0.32) {
      if (hu < -0.3) return I.plaines;
      if (hu < -0.08) return this.patch.noise2(x / 200, z / 200) > 0.35 ? I.prairie_fleurie : I.plaines;
      if (hu < 0.3) return this.patch.noise2(x / 260 + 90, z / 260) > 0.3 ? I.foret_bouleaux : I.foret;
      return I.foret_ancienne;
    }
    if (hu < -0.32) return I.desert;
    if (hu < 0.08) return I.savane;
    return I.jungle;
  }

  biomeAt(x: number, z: number): number {
    const cl = this.sample(x, z);
    return this.classify(cl, x, z);
  }

  /** Structure la plus proche (commande /localiser). */
  locateStructure(type: string, x: number, z: number): { x: number; z: number } | null {
    return this.structures.locate(type, x, z);
  }

  /** Point d'apparition : terre ferme près de l'origine. */
  findSpawn(): { x: number; y: number; z: number } {
    for (let r = 0; r < 4000; r += 16) {
      for (let a = 0; a < 8; a++) {
        const x = Math.round(Math.cos(a * 0.785) * r),
          z = Math.round(Math.sin(a * 0.785) * r);
        const cl = this.sample(x, z);
        const b = this.classify(cl, x, z);
        const def = BIOMES[b];
        if (cl.h > SEA_LEVEL + 1 && cl.m < 0.2 && def.top === 'herbe' && !def.rare) return { x, y: Math.floor(cl.h) + 1, z };
      }
    }
    return { x: 0, y: 90, z: 0 };
  }

  generate(cx: number, cz: number): ChunkBuffer {
    const buf = new ChunkBuffer(cx, cz, this.content.blocks.tables());
    const bx = cx * CS,
      bz = cz * CS;
    const ids = this.ids;
    // --- 1. Hauteurs (18x18 pour les pentes) et climat des colonnes
    const H = new Float32Array(18 * 18);
    const M = new Float32Array(CS * CS);
    const cls: Climate[] = [];
    for (let z = -1; z <= 16; z++)
      for (let x = -1; x <= 16; x++) {
        const inner = x >= 0 && x < 16 && z >= 0 && z < 16;
        const cl = this.sample(bx + x, bz + z, inner ? newClimate() : this.tmp);
        H[(z + 1) * 18 + (x + 1)] = cl.h;
        if (inner) {
          cls[z * 16 + x] = cl;
          M[z * 16 + x] = cl.m;
        }
      }
    const biome = buf.biomes;
    for (let i = 0; i < 256; i++) biome[i] = this.classify(cls[i], bx + (i & 15), bz + (i >> 4));

    // --- 2. Relief 3D (surplombs) dans les zones montagneuses
    let maxAmp = 0;
    for (let i = 0; i < 256; i++) maxAmp = Math.max(maxAmp, smoothstep(0.25, 0.7, M[i]));
    let over: Float32Array | null = null;
    if (maxAmp > 0) {
      over = new Float32Array(5 * 33 * 5);
      for (let k = 0; k < 5; k++) for (let j = 0; j < 33; j++) for (let i = 0; i < 5; i++) over[(k * 33 + j) * 5 + i] = this.over3d.fbm3((bx + i * 4) / 42, (j * 8) / 30, (bz + k * 4) / 42, 2);
    }
    const overAt = (x: number, y: number, z: number): number => {
      const fx = x / 4,
        fy = y / 8,
        fz = z / 4;
      const i = Math.min(3, Math.floor(fx)),
        j = Math.min(31, Math.floor(fy)),
        k = Math.min(3, Math.floor(fz));
      const tx = fx - i,
        ty = fy - j,
        tz = fz - k;
      const g = (a: number, b: number, c: number) => over![((k + c) * 33 + (j + b)) * 5 + (i + a)];
      const c00 = g(0, 0, 0) + (g(1, 0, 0) - g(0, 0, 0)) * tx;
      const c10 = g(0, 1, 0) + (g(1, 1, 0) - g(0, 1, 0)) * tx;
      const c01 = g(0, 0, 1) + (g(1, 0, 1) - g(0, 0, 1)) * tx;
      const c11 = g(0, 1, 1) + (g(1, 1, 1) - g(0, 1, 1)) * tx;
      const c0 = c00 + (c10 - c00) * ty;
      const c1 = c01 + (c11 - c01) * ty;
      return c0 + (c1 - c0) * tz;
    };

    // --- 3. Remplissage roche / eau et surface
    const topY = new Int16Array(256);
    let chunkMaxTop = 0;
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const i = z * 16 + x;
        const cl = cls[i];
        const b = biome[i];
        const def = BIOMES[b];
        const h = cl.h;
        const amp = over ? 18 * smoothstep(0.25, 0.7, cl.m) : 0;
        const maxY = Math.min(WORLD_H - 2, Math.floor(h + amp + 1));
        const deepY = 12 + Math.floor(this.detail.noise2((bx + x) / 13, (bz + z) / 13) * 3);
        const stone = this.stoneId[b] === ids.gres ? ids.pierre : this.stoneId[b];
        let top = -1;
        for (let y = maxY; y >= 0; y--) {
          let solid: boolean;
          if (amp > 0.01) solid = h - y + overAt(x, y, z) * amp >= 0;
          else solid = y <= h;
          if (!solid) continue;
          if (top < 0) top = y;
          let v = y < deepY ? ids.roche_profonde : stone;
          if (y === 0 || (y < 4 && hashFloat(hash3(this.seed, bx + x, y, bz + z)) < 0.55 - y * 0.15)) v = ids.socle;
          buf.set(x, y, z, v);
        }
        topY[i] = top;
        if (top > chunkMaxTop) chunkMaxTop = top;
        if (top < 0) continue;
        // Pente locale
        const hx = H[(z + 1) * 18 + (x + 2)] - H[(z + 1) * 18 + x];
        const hz = H[(z + 2) * 18 + (x + 1)] - H[z * 18 + (x + 1)];
        const slope = Math.sqrt(hx * hx + hz * hz) / 2;
        // Couche de surface (première série solide depuis le haut)
        const underwater = top < SEA_LEVEL - 1;
        let topBlock = underwater ? this.underId[b] : this.topId[b];
        let filler = underwater ? (def.underwater === 'gravier' ? ids.gravier : ids.sable) : this.fillerId[b];
        let depth = def.fillerDepth ?? 3;
        const n = this.patch.noise2((bx + x) / 17, (bz + z) / 17);
        if (underwater) {
          if (b === I.ocean && top > SEA_LEVEL - 6) topBlock = ids.sable;
          if (n > 0.55 && b !== I.ocean_profond) topBlock = ids.argile;
          if (b === I.marecage) topBlock = ids.boue;
        } else {
          const feats = def.features ?? [];
          if (feats.includes('stony') && (slope > 1.35 || top > 150 + n * 10)) {
            topBlock = ids.pierre;
            filler = ids.pierre;
          }
          if (feats.includes('snowcap') && top > 138 + n * 12) {
            topBlock = ids.neige;
            filler = slope > 1.6 ? ids.pierre : ids.neige;
          }
          if (feats.includes('humus') && n > 0.42) topBlock = ids.humus;
          if (feats.includes('moss') && n > 0.45) topBlock = ids.mousse;
          if (feats.includes('mud') && n > 0.35) topBlock = ids.boue;
          if (feats.includes('gravel') && n > 0.2) topBlock = filler = ids.gravier;
          if (b === I.plage && top < SEA_LEVEL + 1 && n < -0.5) topBlock = ids.gravier;
          if (feats.includes('ice') && n > 0.3) topBlock = ids.glace_compacte;
        }
        const canyon = BIOMES[b].features?.includes('terracotta');
        for (let d = 0, y = top; y > 0 && d <= depth + (canyon ? 40 : 0); y--) {
          const cur = buf.get(x, y, z) & 0xfff;
          if (cur === 0) break;
          if (cur === ids.socle) break;
          if (d === 0) buf.set(x, y, z, topBlock);
          else if (d <= depth) buf.set(x, y, z, filler === ids.herbe ? ids.terre : filler);
          else if (canyon) buf.set(x, y, z, this.terracotta(y));
          else if (def.stone === 'gres' && d <= depth + 3) buf.set(x, y, z, ids.gres);
          d++;
        }
        // Eau / glace
        if (top < SEA_LEVEL - 1) {
          const frozen = def.temp < -0.45;
          for (let y = SEA_LEVEL - 1; y > top; y--) buf.set(x, y, z, frozen && y === SEA_LEVEL - 1 ? ids.glace : ids.eau);
        }
      }

    // --- 4. Grottes
    this.carveCaves(buf, topY, chunkMaxTop);

    // --- 5. Minerais
    generateOres(buf, SURFACE_ORES, this.seed, this.num);

    // --- 6. Végétation et éléments de surface
    this.decorate(buf, topY);

    // --- 7. Structures
    this.structures.generate(buf);

    // --- 8. Neige de surface (après les arbres)
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const b = biome[z * 16 + x];
        const snowy = BIOMES[b].precip === 'snow';
        const top = buf.top(x, z);
        if (top < 0 || top >= WORLD_H - 1) continue;
        if (!snowy && !(BIOMES[b].features?.includes('snowcap') && top > 132)) continue;
        const cur = buf.get(x, top, z) & 0xfff;
        if (cur === ids.eau || cur === ids.glace || cur === ids.neige) continue;
        if (buf.get(x, top + 1, z) === 0) buf.set(x, top + 1, z, ids.neige_poudreuse);
      }

    // --- 9. Teintes mélangées
    computeTints(buf, (x, z) => this.classify(this.sample(x, z), x, z), this.patch);
    return buf;
  }

  private terracotta(y: number): number {
    const bands = [this.ids.argile_cuite_ocre, this.ids.argile_cuite_rouge, this.ids.argile_cuite_ocre, this.ids.argile_cuite_blanche, this.ids.argile_cuite_jaune, this.ids.argile_cuite_ocre, this.ids.argile_cuite_brune, this.ids.argile_cuite_ocre, this.ids.sable_ocre];
    const k = Math.floor(y / 2 + hashFloat(hash2(this.seed, Math.floor(y / 2), 7)) * 3);
    return bands[((k % bands.length) + bands.length) % bands.length];
  }

  private carveCaves(buf: ChunkBuffer, topY: Int16Array, maxTop: number): void {
    const bx = buf.bx,
      bz = buf.bz;
    const NY = Math.min(64, Math.ceil((maxTop + 4) / 4)) + 1;
    const SX = 5;
    const grid = (fn: (x: number, y: number, z: number) => number): Float32Array => {
      const g = new Float32Array(SX * NY * SX);
      for (let k = 0; k < SX; k++) for (let j = 0; j < NY; j++) for (let i = 0; i < SX; i++) g[(k * NY + j) * SX + i] = fn(bx + i * 4, j * 4, bz + k * 4);
      return g;
    };
    const cheese = grid((x, y, z) => this.caveA.noise3(x / 80, y / 42, z / 80) * 0.7 + this.caveB.noise3(x / 32, y / 22, z / 32) * 0.3);
    const spA = grid((x, y, z) => this.caveC.noise3(x / 62, y / 40, z / 62));
    const spB = grid((x, y, z) => this.caveD.noise3(x / 62, y / 40, z / 62));
    const noA = grid((x, y, z) => this.caveE.noise3(x / 30, y / 22, z / 30));
    const noB = grid((x, y, z) => this.caveF.noise3(x / 30, y / 22, z / 30));
    const air = 0,
      lava = this.ids.lave,
      water = this.ids.eau,
      socle = this.ids.socle,
      ice = this.ids.glace;
    const interp = (g: Float32Array, i: number, j: number, k: number, tx: number, ty: number, tz: number): number => {
      const a = (k * NY + j) * SX + i;
      const b = a + SX * NY;
      const c00 = g[a] + (g[a + 1] - g[a]) * tx;
      const c10 = g[a + SX] + (g[a + SX + 1] - g[a + SX]) * tx;
      const c01 = g[b] + (g[b + 1] - g[b]) * tx;
      const c11 = g[b + SX] + (g[b + SX + 1] - g[b + SX]) * tx;
      const c0 = c00 + (c10 - c00) * ty;
      const c1 = c01 + (c11 - c01) * ty;
      return c0 + (c1 - c0) * tz;
    };
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const top = topY[z * 16 + x];
        if (top < 6) continue;
        const underwater = top < SEA_LEVEL;
        const entrance = this.caveE.noise2((bx + x) / 90, (bz + z) / 90) > 0.45;
        const lim = underwater ? top - 9 : entrance ? top + 1 : top - 5;
        const i = x >> 2,
          k = z >> 2,
          tx = (x & 3) / 4,
          tz = (z & 3) / 4;
        for (let y = 5; y <= lim && y < (NY - 1) * 4; y++) {
          const j = y >> 2,
            ty = (y & 3) / 4;
          let carve = false;
          const ch = interp(cheese, i, j, k, tx, ty, tz);
          if (ch > 0.5 - (y < 40 ? 0.07 : 0) && y < top - 6) carve = true;
          if (!carve) {
            const a = interp(spA, i, j, k, tx, ty, tz),
              b = interp(spB, i, j, k, tx, ty, tz);
            if (a * a + b * b < 0.0095) carve = true;
          }
          if (!carve && y < top - 3) {
            const a = interp(noA, i, j, k, tx, ty, tz),
              b = interp(noB, i, j, k, tx, ty, tz);
            if (a * a + b * b < 0.0035) carve = true;
          }
          if (!carve) continue;
          const cur = buf.get(x, y, z) & 0xfff;
          if (cur === socle || cur === water || cur === ice) continue;
          // Ne pas percer sous l'eau
          if ((buf.get(x, y + 1, z) & 0xfff) === water) continue;
          buf.set(x, y, z, y <= 10 ? lava : air);
        }
      }
  }

  private decorate(buf: ChunkBuffer, topY: Int16Array): void {
    const bx = buf.bx,
      bz = buf.bz;
    const ids = this.ids;
    // Arbres : grille de cellules 3x3 étendue autour de la colonne
    const R = TREE_RADIUS;
    const c0x = Math.floor((bx - R) / 3),
      c1x = Math.floor((bx + 15 + R) / 3);
    const c0z = Math.floor((bz - R) / 3),
      c1z = Math.floor((bz + 15 + R) / 3);
    const cl = newClimate();
    const treeBlocks = { num: this.num };
    for (let gz = c0z; gz <= c1z; gz++)
      for (let gx = c0x; gx <= c1x; gx++) {
        const h = hash2(this.seed ^ 0x7ee5, gx, gz);
        const r = hashFloat(h);
        if (r > 0.95) continue; // au plus ~0.95 * 1/9 par colonne
        const x = gx * 3 + (h >>> 8) % 3,
          z = gz * 3 + ((h >>> 12) % 3);
        this.sample(x, z, cl);
        if (cl.h < SEA_LEVEL + 0.5 || cl.m > 0.25) continue;
        const b = this.classify(cl, x, z);
        const def = BIOMES[b];
        if (!def.trees || !def.treeChance) continue;
        if (r >= def.treeChance * 9) continue;
        if (def.top !== 'herbe' && def.top !== 'mycelium') continue;
        const y = Math.floor(cl.h) + 1;
        // Dans la colonne courante : vérifier le sol réel
        if (buf.inside(x, z)) {
          const g = buf.getW(x, y - 1, z) & 0xfff;
          if (g !== ids.herbe && g !== ids.humus && g !== ids.mousse && g !== ids.terre && g !== ids.mycelium) continue;
        }
        const type = pickWeighted(def.trees, hashFloat(hash2(this.seed ^ 0x51, x, z)));
        placeTree(type, buf, treeBlocks, hash2(this.seed ^ 0x3ee, x, z), x, y, z);
      }
    // Plantes et éléments de la colonne
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const i = z * 16 + x;
        const top = buf.top(x, z);
        if (top < 1 || top >= WORLD_H - 3) continue;
        if (buf.get(x, top + 1, z) !== 0) continue;
        const b = buf.biomes[i];
        const def = BIOMES[b];
        const g = buf.get(x, top, z) & 0xfff;
        const rng = hashFloat(hash3(this.seed ^ 0x91a, bx + x, top, bz + z));
        const feats = def.features ?? [];
        // Roseaux au bord de l'eau
        if (feats.includes('reeds') && (g === ids.herbe || g === ids.sable || g === ids.terre) && rng < 0.2 && this.nearWater(buf, x, top, z)) {
          const hgt = 1 + Math.floor(rng * 15) % 3;
          for (let k = 1; k <= hgt; k++) buf.set(x, top + k, z, ids.roseau);
          continue;
        }
        if (feats.includes('cactus') && (g === ids.sable || g === ids.sable_ocre) && rng < 0.006) {
          const hgt = 1 + Math.floor(rng * 1000) % 3;
          for (let k = 1; k <= hgt; k++) buf.set(x, top + k, z, ids.cactus);
          continue;
        }
        if (feats.includes('ice_spikes') && g === ids.herbe && rng < 0.0015) {
          const hgt = 6 + Math.floor(rng * 10000) % 14;
          for (let k = 1; k <= hgt; k++) {
            const rad = Math.max(0, Math.floor((1 - k / hgt) * 2.2));
            for (let dz = -rad; dz <= rad; dz++) for (let dx = -rad; dx <= rad; dx++) if (dx * dx + dz * dz <= rad * rad) buf.setW(bx + x + dx, top + k, bz + z + dz, ids.glace_compacte);
          }
          continue;
        }
        if (feats.includes('crystals') && g === ids.herbe && rng < 0.004) {
          for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) if (Math.abs(dx) + Math.abs(dz) + dy < 3) buf.setW(bx + x + dx, top + dy, bz + z + dz, (dx + dz + dy) % 2 ? ids.minerai_lumirite : ids.calcaire);
          continue;
        }
        if (def.top === 'herbe' && (b === I.taiga || b === I.foret || b === I.foret_ancienne) && rng > 0.9985 && (g === ids.herbe || g === ids.humus || g === ids.mousse || g === ids.terre)) {
          // rocher moussu
          for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) for (let dy = 0; dy <= 1; dy++) if (dx * dx + dz * dz + dy * dy < 3) buf.setW(bx + x + dx, top + dy + 1, bz + z + dz, ids.moellon_moussu);
          continue;
        }
        if (!def.plants || !def.plantChance) continue;
        if (g !== ids.herbe && g !== ids.humus && g !== ids.sable && g !== ids.mycelium && g !== ids.mousse && g !== ids.sable_ocre && g !== ids.terre) continue;
        if (rng >= def.plantChance) continue;
        const plant = pickWeighted(def.plants, rng / def.plantChance);
        const pn = this.num(plant);
        if ((g === ids.sable || g === ids.sable_ocre) && plant !== 'buisson_mort') continue;
        buf.set(x, top + 1, z, pn);
      }
  }

  private nearWater(buf: ChunkBuffer, x: number, y: number, z: number): boolean {
    const w = this.ids.eau;
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const v = buf.getW(buf.bx + x + dx, y, buf.bz + z + dz);
      if ((v & 0xfff) === w) return true;
    }
    return false;
  }
}

// Indices de biomes nommés
const I = {
  ocean: biomeIdx('ocean'),
  ocean_profond: biomeIdx('ocean_profond'),
  ocean_gele: biomeIdx('ocean_gele'),
  plage: biomeIdx('plage'),
  riviere: biomeIdx('riviere'),
  riviere_gelee: biomeIdx('riviere_gelee'),
  plaines: biomeIdx('plaines'),
  prairie_fleurie: biomeIdx('prairie_fleurie'),
  foret: biomeIdx('foret'),
  foret_bouleaux: biomeIdx('foret_bouleaux'),
  foret_ancienne: biomeIdx('foret_ancienne'),
  jungle: biomeIdx('jungle'),
  desert: biomeIdx('desert'),
  savane: biomeIdx('savane'),
  canyons_ocre: biomeIdx('canyons_ocre'),
  marecage: biomeIdx('marecage'),
  taiga: biomeIdx('taiga'),
  taiga_enneigee: biomeIdx('taiga_enneigee'),
  toundra: biomeIdx('toundra'),
  montagnes: biomeIdx('montagnes'),
  pics_geles: biomeIdx('pics_geles'),
  bosquet_cristal: biomeIdx('bosquet_cristal'),
  foret_fongique: biomeIdx('foret_fongique'),
  rivage_rocheux: biomeIdx('rivage_rocheux'),
};

export type { BiomeDef };
