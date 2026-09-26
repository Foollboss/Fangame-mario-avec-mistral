/**
 * Les Îles célestes : archipel d'îles flottantes baignées de soleil, en cônes
 * renversés, au-dessus d'une mer de nuages. Cascades qui tombent dans le vide,
 * nuages en suspension (les nuages d'azur font rebondir), bosquets dorés.
 * Tomber des îles ramène à la surface (voir sim/survival.ts).
 *
 * Tout est fonction pure de (x, z) : chaque colonne se génère seule.
 */
import { SimplexNoise } from '../engine/noise';
import { hash2, hash3, hashFloat } from '../engine/rng';
import { ChunkBuffer } from './buffer';
import { BIOMES, biomeIdx } from './biomes';
import { placeTree, TREE_RADIUS } from './trees';
import { generateOres, CELESTE_ORES } from './ores';
import { computeTints, pickWeighted } from './common';
import type { Content } from '../registry/content';
import type { DimGenerator } from './generator';
import { StructureManager } from './structures';

/** Forme d'une colonne : dessus, dessous (top < 0 : pas d'île), intériorité 0..1. */
export interface Isle {
  top: number;
  bottom: number;
  k: number;
}

interface IslandSeed {
  x: number;
  z: number;
  r: number;
  h: number;
  depth: number;
  salt: number;
}

/** Grandes îles (une au plus par cellule) et îlots rocheux. */
const BIG = { cell: 72, chance: 0.72, rMin: 11, rMax: 31, hMin: 72, hMax: 166 };
const SMALL = { cell: 28, chance: 0.3, rMin: 3, rMax: 7, hMin: 58, hMax: 190 };
/** Mer de nuages et nuages en suspension. */
const SEA_Y = 38;
const PUFF_CELL = 36;

export class CelesteGenerator implements DimGenerator {
  readonly dim = 'celeste';
  private edge: SimplexNoise;
  private det: SimplexNoise;
  private bio: SimplexNoise;
  private sea: SimplexNoise;
  readonly num: (id: string) => number;
  private ids: Record<string, number> = {};
  readonly structures: StructureManager;
  private tmp: Isle = { top: -1, bottom: 0, k: 0 };

  constructor(
    readonly seed: number,
    readonly content: Content,
  ) {
    const s = (k: number) => new SimplexNoise((seed ^ Math.imul(k + 400, 0x27d4eb2f)) >>> 0);
    this.edge = s(1);
    this.det = s(2);
    this.bio = s(3);
    this.sea = s(4);
    this.num = (id) => content.blocks.num(id);
    for (const id of ['pierre_celeste', 'terre_celeste', 'nuage', 'nuage_azur', 'eau']) this.ids[id] = this.num(id);
    this.structures = new StructureManager(seed, content, this);
  }

  // ---------------------------------------------------------------- îles
  private seedIn(spec: typeof BIG, salt: number, cx: number, cz: number): IslandSeed | null {
    if (spec === BIG && cx === 0 && cz === 0) return { x: 0, z: 0, r: 30, h: 100, depth: 0.95, salt: 1 }; // île d'arrivée
    const h = hash2(this.seed ^ salt, cx, cz);
    if (hashFloat(h) >= spec.chance) return null;
    const h2 = hash2(this.seed ^ (salt + 0x51), cx, cz),
      h3 = hash2(this.seed ^ (salt + 0xa7), cx, cz);
    const pad = Math.ceil(spec.rMax * 0.4);
    const span = spec.cell - 2 * pad;
    return {
      x: cx * spec.cell + pad + (h2 % span),
      z: cz * spec.cell + pad + ((h2 >>> 13) % span),
      r: spec.rMin + hashFloat(h3) * (spec.rMax - spec.rMin),
      h: spec.hMin + ((h3 >>> 9) % (spec.hMax - spec.hMin)),
      depth: 0.65 + hashFloat(hash2(h, 7, 11)) * 0.5,
      salt: h3,
    };
  }

  /** Forme de l'île sous une colonne (fonction pure). */
  island(x: number, z: number, o: Isle = this.tmp): Isle {
    o.top = -1;
    o.bottom = 0;
    o.k = 0;
    for (const [spec, salt] of [
      [BIG, 0x15e1],
      [SMALL, 0x2b77],
    ] as const) {
      const ccx = Math.floor(x / spec.cell),
        ccz = Math.floor(z / spec.cell);
      for (let dz = -1; dz <= 1; dz++)
        for (let dx = -1; dx <= 1; dx++) {
          const is = this.seedIn(spec, salt, ccx + dx, ccz + dz);
          if (!is) continue;
          const ex = x - is.x,
            ez = z - is.z;
          const d0 = Math.hypot(ex, ez) / is.r;
          if (d0 > 1.35) continue;
          // bord irrégulier
          const wob = this.edge.noise2(x / 22, z / 22) * 0.2 + this.edge.noise2(x / 7 + 40, z / 7) * 0.07;
          const d = d0 * (1 - wob);
          if (d >= 1) continue;
          const k = 1 - d;
          const top = Math.floor(is.h + Math.sqrt(k) * Math.min(5, is.r * 0.2) + this.det.noise2(x / 14, z / 14) * 1.6);
          const bottom = Math.floor(is.h - Math.pow(k, 0.75) * is.r * is.depth - Math.abs(this.det.noise2(x / 6, z / 6)) * 3);
          if (top > o.top) {
            o.top = top;
            o.bottom = Math.max(2, Math.min(bottom, top));
            o.k = k;
          }
        }
    }
    return o;
  }

  private falls = new Map<string, { x: number; z: number; top: number } | null>();

  /** Point de chute de la cascade d'une grande île (mis en cache), ou null. */
  private fallOf(cx: number, cz: number): { x: number; z: number; top: number } | null {
    const key = cx + ',' + cz;
    const hit = this.falls.get(key);
    if (hit !== undefined) return hit;
    let res: { x: number; z: number; top: number } | null = null;
    const is = this.seedIn(BIG, 0x15e1, cx, cz);
    if (is && (is.salt & 3) !== 0) {
      // 3 îles sur 4 ont une cascade : on suit un rayon jusqu'au premier vide
      const a = hashFloat(hash2(is.salt, 3, 5)) * Math.PI * 2;
      const o: Isle = { top: -1, bottom: 0, k: 0 };
      let top = -1;
      for (let t = 0; t < is.r * 1.5; t++) {
        const px = Math.round(is.x + Math.cos(a) * t),
          pz = Math.round(is.z + Math.sin(a) * t);
        this.island(px, pz, o);
        if (o.top < 0) {
          if (top > 0) res = { x: px, z: pz, top };
          break;
        }
        top = o.top;
      }
    }
    if (this.falls.size > 4096) this.falls.clear();
    this.falls.set(key, res);
    return res;
  }

  /** Cascade : la colonne (x, z) reçoit-elle une chute d'eau ? Renvoie son haut, sinon -1. */
  private waterfall(x: number, z: number): number {
    const ccx = Math.floor(x / BIG.cell),
      ccz = Math.floor(z / BIG.cell);
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const f = this.fallOf(ccx + dx, ccz + dz);
        if (f && f.x === x && f.z === z) return f.top;
      }
    return -1;
  }

  biomeAt(x: number, z: number): number {
    const isl = this.island(x, z);
    if (isl.top < 0) return B.mer_de_nuages;
    const b = this.bio.fbm2(x / 180, z / 180, 3) * 1.6;
    if (b > 0.32) return B.bosquet_dore;
    if (b < -0.38 && isl.top > 120) return B.hautes_iles;
    return B.prairies_celestes;
  }

  surfaceHeight(x: number, z: number): number {
    return this.island(x, z).top;
  }

  locateStructure(type: string, x: number, z: number): { x: number; z: number; name?: string } | null {
    return this.structures.locate(type, x, z);
  }

  findSpawn(): { x: number; y: number; z: number } {
    const t = this.island(0, 0).top;
    return { x: 0.5, y: Math.max(t, 90) + 1, z: 0.5 };
  }

  // ---------------------------------------------------------------- génération
  generate(cx: number, cz: number): ChunkBuffer {
    const buf = new ChunkBuffer(cx, cz, this.content.blocks.tables());
    const bx = cx * 16,
      bz = cz * 16;
    const ids = this.ids;
    const o: Isle = { top: -1, bottom: 0, k: 0 };
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const wx = bx + x,
          wz = bz + z;
        const bi = this.biomeAt(wx, wz);
        buf.biomes[z * 16 + x] = bi;
        this.island(wx, wz, o);
        if (o.top >= 0) {
          const def = BIOMES[bi];
          const top = this.num(def.top),
            fill = this.num(def.filler);
          const fd = def.fillerDepth ?? 3;
          for (let y = o.bottom; y <= o.top && y < 250; y++) {
            const depth = o.top - y;
            buf.set(x, y, z, depth === 0 ? top : depth <= fd ? fill : ids.pierre_celeste);
          }
        } else {
          // cascade tombant d'une île voisine
          const wf = this.waterfall(wx, wz);
          if (wf > 0) for (let y = Math.max(SEA_Y + 3, wf - 70); y <= wf; y++) buf.set(x, y, z, ids.eau);
        }
        this.clouds(buf, x, z, wx, wz, o.top >= 0 ? o.bottom : 999);
      }
    generateOres(buf, CELESTE_ORES, this.seed, this.num);
    this.decorate(buf);
    this.structures.generate(buf);
    computeTints(buf, (x, z) => this.biomeAt(x, z));
    return buf;
  }

  /** Mer de nuages basse et nuages en suspension (sous les îles seulement). */
  private clouds(buf: ChunkBuffer, x: number, z: number, wx: number, wz: number, below: number): void {
    const ids = this.ids;
    const n = this.sea.fbm2(wx / 70, wz / 70, 3);
    if (n > 0.08) {
      const th = 1 + Math.floor((n - 0.08) * 8);
      for (let y = SEA_Y; y < SEA_Y + Math.min(th, 4) && y < below; y++) buf.set(x, y, z, ids.nuage);
    }
    // nuages en suspension : ellipses aplaties, une chance par cellule
    const ccx = Math.floor(wx / PUFF_CELL),
      ccz = Math.floor(wz / PUFF_CELL);
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const h = hash2(this.seed ^ 0x9f11, ccx + dx, ccz + dz);
        if (hashFloat(h) > 0.45) continue;
        const h2 = hash2(this.seed ^ 0x9f37, ccx + dx, ccz + dz);
        const px = (ccx + dx) * PUFF_CELL + 6 + (h2 % (PUFF_CELL - 12)),
          pz = (ccz + dz) * PUFF_CELL + 6 + ((h2 >>> 11) % (PUFF_CELL - 12));
        const r = 3 + (h >>> 20) % 5;
        const py = 55 + ((h2 >>> 3) % 140);
        const d = Math.hypot(wx - px, (wz - pz) * 1.3) / r + this.edge.noise2(wx / 5, wz / 5) * 0.25;
        if (d >= 1) continue;
        const azur = (h & 0xff) < 36; // ≈ 1 nuage sur 7 fait rebondir
        const th = d < 0.5 ? 2 : 1;
        for (let y = py; y < py + th; y++) if (y < below - 1 && buf.get(x, y, z) === 0) buf.set(x, y, z, azur ? ids.nuage_azur : ids.nuage);
      }
  }

  private decorate(buf: ChunkBuffer): void {
    const tb = { num: this.num };
    const R = TREE_RADIUS;
    const o: Isle = { top: -1, bottom: 0, k: 0 };
    for (let gz = Math.floor((buf.bz - R) / 4); gz <= Math.floor((buf.bz + 15 + R) / 4); gz++)
      for (let gx = Math.floor((buf.bx - R) / 4); gx <= Math.floor((buf.bx + 15 + R) / 4); gx++) {
        const h = hash2(this.seed ^ 0xce1e, gx, gz);
        const r = hashFloat(h);
        const x = gx * 4 + ((h >>> 8) % 4),
          z = gz * 4 + ((h >>> 12) % 4);
        this.island(x, z, o);
        if (o.top < 0 || o.k < 0.22) continue;
        const def = BIOMES[this.biomeAt(x, z)];
        if (!def.trees || !def.treeChance || r >= def.treeChance * 16) continue;
        placeTree(pickWeighted(def.trees, hashFloat(hash2(this.seed, x, z))), buf, tb, h, x, o.top + 1, z);
      }
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const top = buf.top(x, z);
        if (top < 1 || buf.get(x, top + 1, z) !== 0) continue;
        const def = BIOMES[buf.biomes[z * 16 + x]];
        if (buf.get(x, top, z) !== this.num(def.top) || def.top === 'nuage') continue;
        const r = hashFloat(hash3(this.seed ^ 0xf3, buf.bx + x, top, buf.bz + z));
        if (def.plants && def.plantChance && r < def.plantChance) buf.set(x, top + 1, z, this.num(pickWeighted(def.plants, r / def.plantChance)));
      }
  }
}

const B = {
  prairies_celestes: biomeIdx('prairies_celestes'),
  bosquet_dore: biomeIdx('bosquet_dore'),
  hautes_iles: biomeIdx('hautes_iles'),
  mer_de_nuages: biomeIdx('mer_de_nuages'),
};
