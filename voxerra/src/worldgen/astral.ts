/**
 * Les Cimes astrales : archipel d'îles flottantes en lentille au-dessus du vide,
 * forêts cristallines, déserts d'étoiles. Gravité réduite.
 */
import { SimplexNoise } from '../engine/noise';
import { hash2, hash3, hashFloat } from '../engine/rng';
import { smoothstep } from '../engine/math';
import { ChunkBuffer } from './buffer';
import { BIOMES, biomeIdx } from './biomes';
import { placeTree, TREE_RADIUS } from './trees';
import { generateOres, ASTRAL_ORES } from './ores';
import { computeTints, pickWeighted } from './common';
import type { Content } from '../registry/content';
import type { DimGenerator } from './generator';
import { StructureManager } from './structures';

interface Island {
  top: number;
  bottom: number;
  n: number;
}

export class AstralGenerator implements DimGenerator {
  readonly dim = 'astral';
  private isl: SimplexNoise;
  private hN: SimplexNoise;
  private det: SimplexNoise;
  private bio: SimplexNoise;
  private small: SimplexNoise;
  readonly num: (id: string) => number;
  private ids: Record<string, number> = {};
  readonly structures: StructureManager;
  private tmp: Island = { top: 0, bottom: 0, n: 0 };

  constructor(
    readonly seed: number,
    readonly content: Content,
  ) {
    const s = (k: number) => new SimplexNoise((seed ^ Math.imul(k + 200, 0xc2b2ae35)) >>> 0);
    this.isl = s(1);
    this.hN = s(2);
    this.det = s(3);
    this.bio = s(4);
    this.small = s(5);
    this.num = (id) => content.blocks.num(id);
    for (const id of ['pierre_astrale', 'herbe_stellaire', 'poussiere_etoile', 'cristal_astral', 'briques_astrales']) this.ids[id] = this.num(id);
    this.structures = new StructureManager(seed, content, this);
  }

  /** Forme de l'île sous une colonne (fonction pure). */
  island(x: number, z: number, o: Island = this.tmp): Island {
    const dist = Math.sqrt(x * x + z * z);
    let n = this.isl.fbm2(x / 150, z / 150, 3) + Math.max(0, 1 - dist / 90) * 0.75 - 0.1;
    // Îlots secondaires
    n = Math.max(n, this.small.noise2(x / 45, z / 45) * 0.7 - 0.42);
    const d = this.det.fbm2(x / 30, z / 30, 3);
    const yc = 96 + this.hN.noise2(x / 400, z / 400) * 26;
    if (n <= 0.02) {
      o.top = -1;
      o.bottom = 0;
      o.n = n;
      return o;
    }
    const k = smoothstep(0.02, 0.4, n);
    o.top = Math.floor(yc + k * 14 + d * 3.5);
    o.bottom = Math.floor(yc - k * 60 - d * 8 - (n > 0.3 ? (n - 0.3) * 40 : 0));
    o.n = n;
    return o;
  }

  biomeAt(x: number, z: number): number {
    const b = this.bio.fbm2(x / 220, z / 220, 3) * 1.6;
    const isl = this.island(x, z);
    if (isl.top < 0) return B.vide_astral;
    if (b > 0.35) return B.desert_etoiles;
    if (b < -0.2) return B.foret_cristalline;
    return B.prairies_stellaires;
  }

  surfaceHeight(x: number, z: number): number {
    return this.island(x, z).top;
  }

  findSpawn(): { x: number; y: number; z: number } {
    const t = this.island(0, 0).top;
    return { x: 0, y: Math.max(t, 90) + 1, z: 0 };
  }

  generate(cx: number, cz: number): ChunkBuffer {
    const buf = new ChunkBuffer(cx, cz, this.content.blocks.tables());
    const bx = cx * 16,
      bz = cz * 16;
    const ids = this.ids;
    const o: Island = { top: 0, bottom: 0, n: 0 };
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const bi = this.biomeAt(bx + x, bz + z);
        buf.biomes[z * 16 + x] = bi;
        this.island(bx + x, bz + z, o);
        if (o.top < 0 || o.bottom >= o.top) continue;
        const def = BIOMES[bi];
        const top = this.num(def.top),
          fill = this.num(def.filler);
        const fd = def.fillerDepth ?? 3;
        for (let y = Math.max(1, o.bottom); y <= o.top && y < 255; y++) {
          const depth = o.top - y;
          buf.set(x, y, z, depth === 0 ? top : depth <= fd ? fill : ids.pierre_astrale);
        }
      }
    generateOres(buf, ASTRAL_ORES, this.seed, this.num);
    this.decorate(buf);
    this.structures.generate(buf);
    computeTints(buf, (x, z) => this.biomeAt(x, z));
    return buf;
  }

  private decorate(buf: ChunkBuffer): void {
    const tb = { num: this.num };
    const R = TREE_RADIUS;
    const o: Island = { top: 0, bottom: 0, n: 0 };
    for (let gz = Math.floor((buf.bz - R) / 4); gz <= Math.floor((buf.bz + 15 + R) / 4); gz++)
      for (let gx = Math.floor((buf.bx - R) / 4); gx <= Math.floor((buf.bx + 15 + R) / 4); gx++) {
        const h = hash2(this.seed ^ 0x57e, gx, gz);
        const r = hashFloat(h);
        const x = gx * 4 + (h >>> 8) % 4,
          z = gz * 4 + ((h >>> 12) % 4);
        this.island(x, z, o);
        if (o.top < 0 || o.n < 0.08) continue;
        const def = BIOMES[this.biomeAt(x, z)];
        if (!def.trees || !def.treeChance || r >= def.treeChance * 16) continue;
        placeTree(pickWeighted(def.trees, hashFloat(hash2(this.seed, x, z))), buf, tb, h, x, o.top + 1, z);
      }
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const top = buf.top(x, z);
        if (top < 1 || buf.get(x, top + 1, z) !== 0) continue;
        const def = BIOMES[buf.biomes[z * 16 + x]];
        const r = hashFloat(hash3(this.seed ^ 0xf1, buf.bx + x, top, buf.bz + z));
        if (def.plants && def.plantChance && r < def.plantChance) buf.set(x, top + 1, z, this.num(pickWeighted(def.plants, r / def.plantChance)));
      }
  }
}

const B = {
  prairies_stellaires: biomeIdx('prairies_stellaires'),
  foret_cristalline: biomeIdx('foret_cristalline'),
  desert_etoiles: biomeIdx('desert_etoiles'),
  vide_astral: biomeIdx('vide_astral'),
};
