/**
 * L'Abîme cendré : immense réseau de cavernes entre un plancher et un plafond
 * de socle, mer de lave, forêts de champignons ardents, deltas de basalte.
 */
import { SimplexNoise } from '../engine/noise';
import { hash2, hash3, hashFloat } from '../engine/rng';
import { clamp, smoothstep } from '../engine/math';
import { ChunkBuffer } from './buffer';
import { BIOMES, biomeIdx } from './biomes';
import { placeTree } from './trees';
import { generateOres, ABYSS_ORES } from './ores';
import { computeTints, pickWeighted } from './common';
import type { Content } from '../registry/content';
import type { DimGenerator } from './generator';
import { StructureManager } from './structures';

export const ABYSS_H = 128;
export const LAVA_LEVEL = 31;

export class AbyssGenerator implements DimGenerator {
  readonly dim = 'abime';
  private dens: SimplexNoise;
  private dens2: SimplexNoise;
  private bT: SimplexNoise;
  private bH: SimplexNoise;
  private patch: SimplexNoise;
  readonly num: (id: string) => number;
  private ids: Record<string, number> = {};
  readonly structures: StructureManager;

  constructor(
    readonly seed: number,
    readonly content: Content,
  ) {
    const s = (k: number) => new SimplexNoise((seed ^ Math.imul(k + 100, 0x85ebca6b)) >>> 0);
    this.dens = s(1);
    this.dens2 = s(2);
    this.bT = s(3);
    this.bH = s(4);
    this.patch = s(5);
    this.num = (id) => content.blocks.num(id);
    for (const id of ['socle', 'cendrite', 'lave', 'basalte', 'croute_magma', 'cristal_braise', 'sable_cendre', 'mousse_braise', 'soufre', 'champignon_ardent', 'clochette_ardente'])
      this.ids[id] = this.num(id);
    this.structures = new StructureManager(seed, content, this);
  }

  biomeAt(x: number, z: number): number {
    const t = this.bT.fbm2(x / 260, z / 260, 3) * 1.6;
    const h = this.bH.fbm2(x / 230 + 50, z / 230, 3) * 1.6;
    if (t > 0.45) return h > 0.2 ? B.marais_soufre : B.delta_basalte;
    if (t < -0.35) return B.vallee_cristaux;
    if (h > 0.2) return B.foret_ardente;
    return B.plaines_cendre;
  }

  private density(x: number, y: number, z: number): number {
    const n = this.dens.fbm3(x / 70, y / 38, z / 70, 3) + this.dens2.noise3(x / 24, y / 18, z / 24) * 0.25;
    const falloff = smoothstep(44, 8, y) * 1.4 + smoothstep(86, 122, y) * 1.4 - 0.32;
    return n + falloff;
  }

  surfaceHeight(x: number, z: number): number {
    for (let y = 100; y > LAVA_LEVEL; y--) if (this.density(x, y, z) > 0 && this.density(x, y + 1, z) <= 0) return y;
    return LAVA_LEVEL;
  }

  /** Structure la plus proche (commande /localiser). */
  locateStructure(type: string, x: number, z: number): { x: number; z: number; name?: string } | null {
    return this.structures.locate(type, x, z);
  }

  findSpawn(): { x: number; y: number; z: number } {
    return { x: 0, y: 64, z: 0 };
  }

  generate(cx: number, cz: number): ChunkBuffer {
    const buf = new ChunkBuffer(cx, cz, this.content.blocks.tables());
    const bx = cx * 16,
      bz = cz * 16;
    const ids = this.ids;
    for (let i = 0; i < 256; i++) buf.biomes[i] = this.biomeAt(bx + (i & 15), bz + (i >> 4));
    // Densité sur grille 4x8x4 puis interpolation
    const NY = ABYSS_H / 8 + 1;
    const g = new Float32Array(5 * NY * 5);
    for (let k = 0; k < 5; k++) for (let j = 0; j < NY; j++) for (let i = 0; i < 5; i++) g[(k * NY + j) * 5 + i] = this.density(bx + i * 4, j * 8, bz + k * 4);
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const i = x >> 2,
          k = z >> 2,
          tx = (x & 3) / 4,
          tz = (z & 3) / 4;
        const bi = buf.biomes[z * 16 + x];
        const basaltDelta = bi === B.delta_basalte;
        for (let y = 0; y < ABYSS_H; y++) {
          const j = Math.min(NY - 2, y >> 3),
            ty = (y & 7) / 8;
          const a = (k * NY + j) * 5 + i;
          const b2 = a + 5 * NY;
          const c00 = g[a] + (g[a + 1] - g[a]) * tx;
          const c10 = g[a + 5] + (g[a + 6] - g[a + 5]) * tx;
          const c01 = g[b2] + (g[b2 + 1] - g[b2]) * tx;
          const c11 = g[b2 + 5] + (g[b2 + 6] - g[b2 + 5]) * tx;
          const d = c00 + (c10 - c00) * ty + (c01 + (c11 - c01) * ty - (c00 + (c10 - c00) * ty)) * tz;
          const hb = hashFloat(hash3(this.seed, bx + x, y, bz + z));
          let v = 0;
          if (y === 0 || y === ABYSS_H - 1 || (y < 4 && hb < 0.6 - y * 0.15) || (y > ABYSS_H - 5 && hb < 0.6 - (ABYSS_H - 1 - y) * 0.15)) v = ids.socle;
          else if (d > 0) v = basaltDelta && d < 0.25 ? ids.basalte : ids.cendrite;
          else if (y <= LAVA_LEVEL) v = ids.lave;
          if (v) buf.set(x, y, z, v);
        }
        // Surfaces de sol : premier bloc solide sous de l'air
        const def = BIOMES[bi];
        const top = this.num(def.top),
          fill = this.num(def.filler);
        for (let y = ABYSS_H - 6; y > LAVA_LEVEL - 2; y--) {
          const cur = buf.get(x, y, z) & 0xfff;
          const above = buf.get(x, y + 1, z) & 0xfff;
          if (cur === ids.cendrite && above === 0) {
            buf.set(x, y, z, top);
            for (let dd = 1; dd <= 2; dd++) if ((buf.get(x, y - dd, z) & 0xfff) === ids.cendrite) buf.set(x, y - dd, z, fill);
          }
          // Croûte de magma près de la lave
          if (cur === ids.cendrite && y <= LAVA_LEVEL + 1 && (buf.get(x, y + 1, z) & 0xfff) === ids.lave) buf.set(x, y, z, ids.croute_magma);
        }
      }
    generateOres(buf, ABYSS_ORES, this.seed, this.num, ABYSS_H - 6);
    this.decorate(buf);
    this.structures.generate(buf);
    computeTints(buf, (x, z) => this.biomeAt(x, z));
    return buf;
  }

  private decorate(buf: ChunkBuffer): void {
    const ids = this.ids;
    const tb = { num: this.num };
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const bi = buf.biomes[z * 16 + x];
        const def = BIOMES[bi];
        const wx = buf.bx + x,
          wz = buf.bz + z;
        for (let y = LAVA_LEVEL + 1; y < ABYSS_H - 8; y++) {
          const cur = buf.get(x, y, z) & 0xfff;
          const above = buf.get(x, y + 1, z) & 0xfff;
          const r = hashFloat(hash3(this.seed ^ 0xab, wx, y, wz));
          // Cristaux suspendus au plafond
          if (cur === 0 && above !== 0 && above !== ids.lave && (bi === B.vallee_cristaux ? r < 0.05 : r < 0.004)) {
            buf.set(x, y, z, ids.cristal_braise);
            continue;
          }
          if (cur === 0 || above !== 0) continue;
          if (cur === ids.lave || cur === ids.socle) continue;
          // Colonnes de basalte
          if (bi === B.delta_basalte && r < 0.008) {
            const hgt = 4 + Math.floor(r * 3000) % 18;
            for (let k = 1; k <= hgt; k++) if ((buf.get(x, y + k, z) & 0xfff) === 0) buf.set(x, y + k, z, ids.basalte);
            continue;
          }
          // Champignons géants (restent dans la colonne pour la cohérence)
          if (def.trees && def.treeChance && x >= 5 && x <= 10 && z >= 5 && z <= 10 && r < def.treeChance * 0.35 && cur === ids.mousse_braise) {
            const type = pickWeighted(def.trees, hashFloat(hash2(this.seed ^ 0x77, wx, wz)));
            placeTree(type, buf, tb, hash3(this.seed, wx, y, wz), wx, y + 1, wz);
            continue;
          }
          if (def.plants && def.plantChance && r < def.plantChance && (buf.get(x, y + 1, z) & 0xfff) === 0) {
            buf.set(x, y + 1, z, this.num(pickWeighted(def.plants, r / def.plantChance)));
          }
        }
      }
    void clamp;
  }
}

const B = {
  plaines_cendre: biomeIdx('plaines_cendre'),
  foret_ardente: biomeIdx('foret_ardente'),
  delta_basalte: biomeIdx('delta_basalte'),
  vallee_cristaux: biomeIdx('vallee_cristaux'),
  marais_soufre: biomeIdx('marais_soufre'),
};
