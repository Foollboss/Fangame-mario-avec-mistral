/**
 * Générateur de la Surface : relief, surface des biomes, eau, grottes, minerais,
 * géodes, oasis, arbres et végétation.
 */
import { COLUMN_VOLUME, SEA_LEVEL, WORLD_HEIGHT, colIndex, packBlock } from '../constants';
import { B, AIR } from '../blocks';
import { BIOMES, biomeById, type BiomeDef } from '../biomes';
import { Fbm, Simplex } from '../../util/noise';
import { Rng, hash2, hash3, rand2 } from '../../util/random';
import { NoiseGrid } from './grid';
import { ChunkWriter, idSet } from './writer';
import { OverworldShaper, OW_BIOMES, type GenOptions } from './terrain';
import { growTree } from './trees';
import { generateStructures } from './structures';

export interface GeneratedColumn {
  blocks: Uint16Array;
  biomes: Uint8Array;
  markers: ChunkWriter['markers'];
}

const STONE_LIKE = idSet([B.stone, B.deepslate, B.granite, B.diorite, B.andesite, B.tuff]);

interface OreSpec {
  block: number;
  deep?: number;
  veins: number;
  size: [number, number];
  y: [number, number];
  biome?: number[];
}

const ORES: OreSpec[] = [
  { block: B.dirt, veins: 5, size: [12, 24], y: [10, 110] },
  { block: B.gravel, veins: 4, size: [12, 24], y: [5, 90] },
  { block: B.granite, veins: 4, size: [18, 32], y: [5, 90] },
  { block: B.diorite, veins: 4, size: [18, 32], y: [5, 90] },
  { block: B.andesite, veins: 4, size: [18, 32], y: [5, 90] },
  { block: B.tuff, veins: 2, size: [18, 30], y: [3, 18] },
  { block: B.coal_ore, veins: 18, size: [6, 14], y: [8, 140] },
  { block: B.iron_ore, deep: B.deepslate_iron_ore, veins: 12, size: [4, 9], y: [3, 80] },
  { block: B.copper_ore, veins: 7, size: [5, 10], y: [30, 100] },
  { block: B.gold_ore, deep: B.deepslate_gold_ore, veins: 3, size: [4, 8], y: [3, 34] },
  { block: B.energy_ore, deep: B.deepslate_energy_ore, veins: 6, size: [4, 8], y: [3, 18] },
  { block: B.sapphire_ore, veins: 2, size: [3, 7], y: [5, 34] },
  { block: B.diamond_ore, deep: B.deepslate_diamond_ore, veins: 2, size: [2, 6], y: [3, 16] },
  { block: B.mythril_ore, veins: 1, size: [1, 3], y: [3, 11] },
  { block: B.emerald_ore, veins: 5, size: [1, 1], y: [40, 160], biome: [OW_BIOMES.mountains, OW_BIOMES.snowy_peaks, OW_BIOMES.meadow] },
  { block: B.gold_ore, veins: 8, size: [4, 8], y: [32, 90], biome: [OW_BIOMES.badlands] },
];

const BADLANDS_STRATA = [B.terracotta, B.orange_terracotta, B.terracotta, B.yellow_terracotta, B.brown_terracotta, B.terracotta, B.red_terracotta, B.white_terracotta, B.orange_terracotta, B.light_gray_terracotta, B.terracotta, B.red_terracotta];

export class OverworldGenerator {
  readonly shaper: OverworldShaper;
  private cheese: Fbm;
  private spagA: Simplex;
  private spagB: Simplex;
  private aquifer: Fbm;
  private overhang: Fbm;
  private flowerPatch: Simplex;
  private snowLine: Fbm;

  constructor(readonly opts: GenOptions) {
    this.shaper = new OverworldShaper(opts);
    const s = opts.seed;
    this.cheese = new Fbm(s + 201, 2, 1 / 70);
    this.spagA = new Simplex(s + 211);
    this.spagB = new Simplex(s + 223);
    this.aquifer = new Fbm(s + 227, 2, 1 / 120);
    this.overhang = new Fbm(s + 233, 3, 1 / 60);
    this.flowerPatch = new Simplex(s + 239);
    this.snowLine = new Fbm(s + 241, 2, 1 / 90);
  }

  generate(cx: number, cz: number): GeneratedColumn {
    if (this.opts.template === 'flat') return this.generateFlat(cx, cz);
    const blocks = new Uint16Array(COLUMN_VOLUME);
    const biomes = new Uint8Array(256);
    const w = new ChunkWriter(blocks, cx, cz);
    const x0 = cx * 16;
    const z0 = cz * 16;
    const samples = new Array(256);
    let any3D = false;
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) {
        const s = this.shaper.sample(x0 + lx, z0 + lz);
        samples[lz * 16 + lx] = s;
        biomes[lz * 16 + lx] = s.biome;
        if (s.mountain > 0.12) any3D = true;
      }

    // 1. Pierre (2D, ou densité 3D en montagne pour les falaises et surplombs).
    const grid = any3D ? new NoiseGrid(x0, z0, 4, 8, 0, WORLD_HEIGHT, (x, y, z) => this.overhang.get3(x, y * 1.3, z)) : null;
    const stone = packBlock(B.stone);
    const topY = new Int16Array(256);
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) {
        const s = samples[lz * 16 + lx];
        const h = Math.floor(s.height);
        let top = h;
        if (grid && s.mountain > 0.12) {
          const amp = s.mountain * 1.6;
          const lo = Math.max(1, h - 48);
          const hi = Math.min(WORLD_HEIGHT - 2, h + 40);
          for (let y = 1; y < lo; y++) blocks[colIndex(lx, y, lz)] = stone;
          top = 0;
          for (let y = lo; y <= hi; y++) {
            const d = (s.height - y) / 28 + grid.get(lx, y, lz) * amp;
            if (d > 0) {
              blocks[colIndex(lx, y, lz)] = stone;
              top = y;
            }
          }
        } else {
          for (let y = 1; y <= h; y++) blocks[colIndex(lx, y, lz)] = stone;
        }
        topY[lz * 16 + lx] = top;
      }

    // 2. Roche profonde
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) {
        const lim = 14 + Math.floor(rand2(this.opts.seed ^ 0xdee, x0 + lx, z0 + lz) * 4);
        for (let y = 1; y < lim; y++) {
          const i = colIndex(lx, y, lz);
          if (blocks[i] === stone) blocks[i] = packBlock(B.deepslate);
        }
      }

    // 3. Surface des biomes
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) this.applySurface(blocks, lx, lz, x0 + lx, z0 + lz, samples, topY);

    // 4. Eau, glace et lave des cratères
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) {
        const s = samples[lz * 16 + lx];
        const b = biomeById(s.biome);
        for (let y = SEA_LEVEL; y > 0; y--) {
          const i = colIndex(lx, y, lz);
          if (blocks[i] !== AIR) break;
          blocks[i] = packBlock(y === SEA_LEVEL && b.frozen ? B.ice : B.water);
        }
        if (s.craterLava > 0) {
          for (let y = s.craterLava; y > 0; y--) {
            const i = colIndex(lx, y, lz);
            if (blocks[i] !== AIR) break;
            blocks[i] = packBlock(B.lava);
          }
        }
      }

    // 5. Minerais
    this.placeOres(w, cx, cz, biomes);

    // 6. Grottes
    if (this.opts.caves) this.carveCaves(blocks, x0, z0, samples, topY);

    // 7. Socle
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) {
        blocks[colIndex(lx, 0, lz)] = packBlock(B.bedrock);
        for (let y = 1; y <= 4; y++) if (rand2(this.opts.seed ^ (y * 977), x0 + lx, z0 + lz) < (5 - y) / 5) blocks[colIndex(lx, y, lz)] = packBlock(B.bedrock);
      }

    // 8. Éléments décoratifs qui débordent entre tronçons : géodes, oasis, arbres.
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        this.placeGeodes(w, cx + dx, cz + dz);
        this.placeOases(w, cx + dx, cz + dz);
      }
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) this.placeTrees(w, cx + dx, cz + dz);

    // 9. Structures (villages, donjons, ruines…)
    if (this.opts.structures) generateStructures(w, this);

    // 10. Végétation et neige (à l'intérieur du tronçon uniquement).
    this.decorate(w, samples);
    this.spawnHerds(w, samples);

    return { blocks, biomes, markers: w.markers };
  }

  private generateFlat(cx: number, cz: number): GeneratedColumn {
    const blocks = new Uint16Array(COLUMN_VOLUME);
    const biomes = new Uint8Array(256).fill(OW_BIOMES.plains);
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) {
        blocks[colIndex(lx, 0, lz)] = packBlock(B.bedrock);
        blocks[colIndex(lx, 1, lz)] = packBlock(B.dirt);
        blocks[colIndex(lx, 2, lz)] = packBlock(B.dirt);
        blocks[colIndex(lx, 3, lz)] = packBlock(B.grass_block);
      }
    const w = new ChunkWriter(blocks, cx, cz);
    return { blocks, biomes, markers: w.markers };
  }

  /** Hauteur du sol utilisée pour poser arbres et structures (fonction pure). */
  groundAt(x: number, z: number): number {
    return Math.floor(this.shaper.sample(x, z).height);
  }

  private applySurface(blocks: Uint16Array, lx: number, lz: number, x: number, z: number, samples: Array<{ biome: number; height: number; mountain: number }>, topY: Int16Array): void {
    const s = samples[lz * 16 + lx];
    const b = biomeById(s.biome);
    const top = topY[lz * 16 + lx];
    // Pente : différence avec les voisins (falaises de pierre).
    const hN = topY[Math.max(0, lz - 1) * 16 + lx];
    const hS = topY[Math.min(15, lz + 1) * 16 + lx];
    const hW = topY[lz * 16 + Math.max(0, lx - 1)];
    const hE = topY[lz * 16 + Math.min(15, lx + 1)];
    const slope = Math.max(Math.abs(hN - hS), Math.abs(hW - hE));
    const snowLine = 150 + this.snowLine.get2(x, z) * 14;
    const underwater = top < SEA_LEVEL;

    let topBlock = B[b.top];
    let filler = B[b.filler];
    let depth = b.fillerDepth;
    if (underwater) {
      topBlock = B[b.underwater];
      filler = topBlock === B.mud ? B.dirt : topBlock;
      if (b.isRiver || b.isOcean) depth = 3;
      if (s.height < 40 && rand2(this.opts.seed, x, z) < 0.1) topBlock = B.clay;
    } else if (top <= SEA_LEVEL + 1 && !b.isOcean && b.top === 'grass_block' && s.biome !== OW_BIOMES.swamp) {
      // Berges sableuses près de l'eau
      topBlock = B.sand;
      filler = B.sand;
    }
    if (s.biome === OW_BIOMES.mountains || s.biome === OW_BIOMES.snowy_peaks || s.biome === OW_BIOMES.stony_shore || s.mountain > 0.3) {
      if (slope > 3) {
        topBlock = B.stone;
        filler = B.stone;
      }
    }
    if (s.biome === OW_BIOMES.volcano) {
      const r = rand2(this.opts.seed ^ 0x101, x, z);
      topBlock = r < 0.15 ? B.magma : r < 0.45 ? B.ash : B.basalt;
      filler = B.basalt;
    }
    if (s.biome === OW_BIOMES.dark_forest && rand2(this.opts.seed ^ 0x103, x, z) < 0.05) topBlock = B.podzol;
    if (s.biome === OW_BIOMES.taiga && rand2(this.opts.seed ^ 0x105, x, z) < 0.12) topBlock = B.podzol;
    if (s.biome === OW_BIOMES.savanna && rand2(this.opts.seed ^ 0x107, x, z) < 0.04) topBlock = B.coarse_dirt;
    if (s.biome === OW_BIOMES.swamp && rand2(this.opts.seed ^ 0x109, x, z) < 0.08 && top <= SEA_LEVEL + 1) topBlock = B.mud;
    if (top > snowLine && !underwater) {
      topBlock = slope > 4 ? B.stone : B.snow_block;
      filler = B.stone;
    }

    // Parcours vertical : le premier bloc solide sous l'air reçoit topBlock, les suivants filler.
    let run = -1;
    for (let y = Math.min(top + 1, WORLD_HEIGHT - 1); y > 0; y--) {
      const i = colIndex(lx, y, lz);
      const cur = blocks[i];
      if (cur === AIR) {
        run = -1;
        continue;
      }
      if (cur !== packBlock(B.stone)) {
        run = 99;
        continue;
      }
      if (run === -1) {
        run = 0;
        blocks[i] = packBlock(y < SEA_LEVEL - 1 && topBlock === B.grass_block ? B.dirt : topBlock);
        if (s.biome === OW_BIOMES.badlands) blocks[i] = packBlock(y > 90 ? B.terracotta : B.red_sand);
      } else if (run < depth) {
        run++;
        if (s.biome === OW_BIOMES.badlands) blocks[i] = packBlock(BADLANDS_STRATA[((y % BADLANDS_STRATA.length) + BADLANDS_STRATA.length) % BADLANDS_STRATA.length]);
        else if (filler === B.sand && run === depth) blocks[i] = packBlock(B.sandstone);
        else blocks[i] = packBlock(filler);
      } else if (s.biome === OW_BIOMES.badlands && y > 60) {
        blocks[i] = packBlock(BADLANDS_STRATA[y % BADLANDS_STRATA.length]);
      } else if (y < top - 40) {
        break;
      }
    }
  }

  private placeOres(w: ChunkWriter, cx: number, cz: number, biomes: Uint8Array): void {
    const rng = new Rng(hash2(this.opts.seed ^ 0x0e5, cx, cz));
    const centerBiome = biomes[8 * 16 + 8];
    for (const ore of ORES) {
      if (ore.biome && !ore.biome.includes(centerBiome)) continue;
      for (let v = 0; v < ore.veins; v++) {
        let x = w.x0 + rng.int(0, 15);
        let z = w.z0 + rng.int(0, 15);
        let y = rng.int(ore.y[0], ore.y[1]);
        const size = rng.int(ore.size[0], ore.size[1]);
        for (let i = 0; i < size; i++) {
          const cur = w.get(x, y, z);
          if (cur >= 0 && STONE_LIKE[cur]) w.set(x, y, z, cur === B.deepslate && ore.deep ? ore.deep : ore.block);
          const r = rng.int(0, 5);
          if (r === 0) x++;
          else if (r === 1) x--;
          else if (r === 2) z++;
          else if (r === 3) z--;
          else if (r === 4) y++;
          else y--;
          if (x < w.x0 || x > w.x0 + 15) x = Math.max(w.x0, Math.min(w.x0 + 15, x));
          if (z < w.z0 || z > w.z0 + 15) z = Math.max(w.z0, Math.min(w.z0 + 15, z));
        }
      }
    }
  }

  private carveCaves(blocks: Uint16Array, x0: number, z0: number, samples: Array<{ height: number; biome: number }>, topY: Int16Array): void {
    let maxTop = 0;
    for (let i = 0; i < 256; i++) maxTop = Math.max(maxTop, topY[i]);
    const yMax = Math.min(WORLD_HEIGHT - 1, maxTop + 4);
    const cheese = new NoiseGrid(x0, z0, 4, 4, 0, yMax + 4, (x, y, z) => this.cheese.get3(x, y * 1.7, z));
    const spagA = new NoiseGrid(x0, z0, 4, 4, 0, yMax + 4, (x, y, z) => this.spagA.noise3(x / 48, y / 28, z / 48));
    const spagB = new NoiseGrid(x0, z0, 4, 4, 0, yMax + 4, (x, y, z) => this.spagB.noise3(x / 48, y / 28, z / 48));
    const air = AIR;
    const water = packBlock(B.water);
    const lava = packBlock(B.lava);
    const bedrockish = packBlock(B.bedrock);
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) {
        const s = samples[lz * 16 + lx];
        const top = topY[lz * 16 + lx];
        const wet = top < SEA_LEVEL + 1;
        const b = BIOMES[s.biome];
        const aq = this.aquifer.get2(x0 + lx, z0 + lz);
        const aqLevel = aq > 0.25 ? 28 + Math.floor(aq * 20) : -1;
        const roof = wet ? top - 7 : top - 5;
        for (let y = 2; y <= Math.min(yMax, top); y++) {
          const i = colIndex(lx, y, lz);
          const cur = blocks[i];
          if (cur === air || cur === water || cur === bedrockish) continue;
          let carve = false;
          const ch = cheese.get(lx, y, lz);
          // Cavernes géantes en profondeur, plus étroites près de la surface.
          let thr = 0.36;
          if (y < 40) thr -= (40 - y) * 0.004;
          if (y > 60) thr += (y - 60) * 0.006;
          if (ch > thr && y < roof) carve = true;
          if (!carve) {
            const a = spagA.get(lx, y, lz);
            const c = spagB.get(lx, y, lz);
            const t = a * a + c * c;
            // Les tunnels « spaghetti » peuvent percer la surface (entrées de grottes) mais pas sous l'eau.
            if (t < 0.0055 && (y < roof || (!wet && !b.isOcean && !b.isRiver))) carve = true;
          }
          if (!carve) continue;
          if (y <= 10) blocks[i] = lava;
          else if (aqLevel > 0 && y <= aqLevel && y < roof - 2) blocks[i] = water;
          else blocks[i] = air;
        }
      }
  }

  private placeGeodes(w: ChunkWriter, cx: number, cz: number): void {
    const h = hash2(this.opts.seed ^ 0x6e0de, cx, cz);
    if (h % 24 !== 0) return;
    const rng = new Rng(h);
    const gx = cx * 16 + rng.int(4, 11);
    const gz = cz * 16 + rng.int(4, 11);
    const gy = rng.int(14, 50);
    const r = rng.range(4, 6.5);
    if (!w.touches(gx - 8, gz - 8, gx + 8, gz + 8)) return;
    const R = Math.ceil(r + 2);
    for (let dy = -R; dy <= R; dy++)
      for (let dz = -R; dz <= R; dz++)
        for (let dx = -R; dx <= R; dx++) {
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          const x = gx + dx;
          const y = gy + dy;
          const z = gz + dz;
          if (d > r + 1.6) continue;
          if (d > r + 0.6) w.set(x, y, z, B.calcite);
          else if (d > r - 0.6) w.set(x, y, z, B.crystal_block);
          else w.set(x, y, z, AIR);
        }
    // Amas de cristaux sur les parois internes.
    for (let i = 0; i < 40; i++) {
      const a = rng.next() * Math.PI * 2;
      const b = (rng.next() - 0.5) * Math.PI;
      const rr = r - 1.2;
      const x = Math.round(gx + Math.cos(a) * Math.cos(b) * rr);
      const y = Math.round(gy + Math.sin(b) * rr);
      const z = Math.round(gz + Math.sin(a) * Math.cos(b) * rr);
      if (w.get(x, y, z) === AIR) w.set(x, y, z, B.crystal_cluster);
    }
  }

  private placeOases(w: ChunkWriter, cx: number, cz: number): void {
    const h = hash2(this.opts.seed ^ 0x0a515, cx, cz);
    if (h % 18 !== 0) return;
    const rng = new Rng(h);
    const ox = cx * 16 + rng.int(3, 12);
    const oz = cz * 16 + rng.int(3, 12);
    const s = this.shaper.sample(ox, oz);
    if (s.biome !== OW_BIOMES.desert || s.mountain > 0.1) return;
    const r = rng.int(4, 7);
    if (!w.touches(ox - r - 4, oz - r - 4, ox + r + 4, oz + r + 4)) return;
    const ground = Math.floor(s.height);
    for (let dz = -r - 3; dz <= r + 3; dz++)
      for (let dx = -r - 3; dx <= r + 3; dx++) {
        const d = Math.sqrt(dx * dx + dz * dz);
        const x = ox + dx;
        const z = oz + dz;
        if (d <= r) {
          const depth = Math.max(1, Math.round((1 - d / r) * 3));
          for (let y = ground + 6; y > ground; y--) w.set(x, y, z, AIR);
          for (let y = ground; y > ground - depth; y--) w.set(x, y, z, B.water);
          w.set(x, ground - depth, z, B.sand);
        } else if (d <= r + 2.5) {
          for (let y = ground + 6; y > ground; y--) w.set(x, y, z, AIR);
          w.set(x, ground, z, B.grass_block);
          w.set(x, ground - 1, z, B.dirt);
          if (rng.next() < 0.15) w.set(x, ground + 1, z, B.short_grass);
          else if (rng.next() < 0.05) {
            w.set(x, ground + 1, z, B.sugar_cane);
            w.set(x, ground + 2, z, B.sugar_cane);
          }
        }
      }
    for (let i = 0; i < 3; i++) {
      const a = rng.next() * Math.PI * 2;
      const tx = Math.round(ox + Math.cos(a) * (r + 1.5));
      const tz = Math.round(oz + Math.sin(a) * (r + 1.5));
      growTree(w, 'palm', tx, ground + 1, tz, hash3(this.opts.seed, tx, i, tz));
    }
  }

  private placeTrees(w: ChunkWriter, cx: number, cz: number): void {
    const center = this.shaper.sample(cx * 16 + 8, cz * 16 + 8);
    const biome = biomeById(center.biome);
    if (!biome.trees.length || biome.treeDensity <= 0) return;
    const rng = new Rng(hash2(this.opts.seed ^ 0x7ee5, cx, cz));
    let count = Math.floor(biome.treeDensity);
    if (rng.next() < biome.treeDensity - count) count++;
    const total = biome.trees.reduce((a, t) => a + t[1], 0);
    for (let i = 0; i < count; i++) {
      const x = cx * 16 + rng.int(0, 15);
      const z = cz * 16 + rng.int(0, 15);
      const kindRoll = rng.next() * total;
      const treeSeed = Math.floor(rng.next() * 0xffffffff);
      if (!w.touches(x - 7, z - 7, x + 7, z + 7)) continue;
      const s = this.shaper.sample(x, z);
      if (s.mountain > 0.12 || s.river > 0.2 || s.biome !== center.biome) continue;
      const ground = Math.floor(s.height);
      if (ground < SEA_LEVEL) continue;
      let acc = 0;
      let kind = biome.trees[0][0];
      for (const [k, wgt] of biome.trees) {
        acc += wgt;
        if (kindRoll < acc) {
          kind = k;
          break;
        }
      }
      // Le sol doit être du type attendu (évite les arbres sur les berges de sable, sauf palmiers).
      const b = BIOMES[s.biome];
      if (ground <= SEA_LEVEL + 1 && b.top === 'grass_block' && kind !== 'palm' && kind !== 'swamp_oak') continue;
      w.set(x, ground, z, kind === 'palm' ? B.sand : b.top === 'mycelium' ? B.mycelium : b.top === 'sky_grass' ? B.sky_grass : B.dirt);
      growTree(w, kind, x, ground + 1, z, treeSeed);
    }
  }

  private decorate(w: ChunkWriter, samples: Array<{ biome: number; height: number }>): void {
    const rng = new Rng(hash2(this.opts.seed ^ 0xdec0, w.cx, w.cz));
    const blocks = w.blocks;
    for (let lz = 0; lz < 16; lz++)
      for (let lx = 0; lx < 16; lx++) {
        const s = samples[lz * 16 + lx];
        const b: BiomeDef = biomeById(s.biome);
        const x = w.x0 + lx;
        const z = w.z0 + lz;
        // Bloc le plus haut non-air
        let y = WORLD_HEIGHT - 1;
        while (y > 0 && blocks[colIndex(lx, y, lz)] === AIR) y--;
        const topId = blocks[colIndex(lx, y, lz)] & 0x3ff;
        const above = y + 1;
        if (above >= WORLD_HEIGHT) continue;

        if (topId === B.water) {
          // Végétation aquatique
          let floor = y;
          while (floor > 0 && (blocks[colIndex(lx, floor, lz)] & 0x3ff) === B.water) floor--;
          const depth = y - floor;
          if (b.isOcean || b.isRiver) {
            const r = rng.next();
            if (s.biome === OW_BIOMES.warm_ocean && r < 0.06 && depth > 3) {
              w.set(x, floor + 1, z, rng.next() < 0.5 ? B.tube_coral_block : B.brain_coral_block);
            } else if (r < 0.12 && depth > 6 && !b.frozen) {
              const len = rng.int(3, depth - 2);
              for (let k = 1; k <= len; k++) w.set(x, floor + k, z, B.kelp);
            } else if (r < 0.35 && depth > 1) w.set(x, floor + 1, z, B.seagrass);
          }
          if (s.biome === OW_BIOMES.swamp && depth <= 2 && rng.next() < 0.06) w.set(x, y + 1, z, B.lily_pad);
          continue;
        }

        // Neige
        if ((b.frozen || y > 152) && topId !== B.ice && topId !== B.snow_block && topId !== B.lava && blocks[colIndex(lx, above, lz)] === AIR) {
          if (topId === B.grass_block || topId === B.stone || topId === B.dirt || topId === B.podzol || topId === B.gravel || topId === B.sand) {
            w.set(x, above, z, B.snow_layer);
          } else if (topId === B.spruce_leaves || topId === B.oak_leaves || topId === B.birch_leaves) {
            w.set(x, above, z, B.snow_layer);
          }
          continue;
        }

        if (topId === B.grass_block || topId === B.sky_grass || topId === B.ash_grass) {
          const r = rng.next();
          const patch = this.flowerPatch.noise2(x / 24, z / 24);
          if (b.flowers.length && r < b.flowerDensity * (patch > 0.2 ? 6 : 0.4)) {
            const f = b.flowers[Math.floor(((patch + 1) * 0.5) * b.flowers.length * 3) % b.flowers.length];
            w.set(x, above, z, B[f]);
          } else if (r < b.grassDensity) {
            w.set(x, above, z, s.biome === OW_BIOMES.taiga || s.biome === OW_BIOMES.jungle ? (rng.next() < 0.4 ? B.fern : B.short_grass) : B.short_grass);
          } else {
            for (const [ex, p] of b.extras) {
              if (rng.next() >= p) continue;
              if (ex === 'sugar_cane') {
                if (this.nearWater(blocks, lx, y, lz)) {
                  const hgt = rng.int(1, 3);
                  for (let k = 0; k < hgt; k++) w.set(x, above + k, z, B.sugar_cane);
                }
              } else if (ex === 'melon') w.set(x, above, z, B.melon);
              else w.set(x, above, z, B[ex]);
              break;
            }
          }
          if (s.biome === OW_BIOMES.plains && rng.next() < 0.0008) w.set(x, above, z, B.pumpkin);
        } else if (topId === B.sand || topId === B.red_sand) {
          for (const [ex, p] of b.extras) {
            if (rng.next() >= p) continue;
            if (ex === 'cactus') {
              if (this.cactusFree(blocks, lx, above, lz)) {
                const hgt = rng.int(1, 3);
                for (let k = 0; k < hgt; k++) w.set(x, above + k, z, B.cactus);
              }
            } else if (ex === 'dead_bush') w.set(x, above, z, B.dead_bush);
            else if (ex === 'sugar_cane' && this.nearWater(blocks, lx, y, lz)) {
              const hgt = rng.int(1, 3);
              for (let k = 0; k < hgt; k++) w.set(x, above + k, z, B.sugar_cane);
            }
            break;
          }
        } else if (topId === B.mycelium) {
          if (rng.next() < 0.03) w.set(x, above, z, rng.next() < 0.5 ? B.red_mushroom : B.brown_mushroom);
        } else if (topId === B.snow_block && s.biome === OW_BIOMES.ice_spikes && rng.next() < 0.004) {
          const hgt = rng.int(6, 18);
          for (let k = 0; k < hgt; k++) {
            w.set(x, above + k, z, B.packed_ice);
            if (k < hgt / 2) {
              w.setSoft(x + 1, above + k, z, B.packed_ice);
              w.setSoft(x, above + k, z + 1, B.packed_ice);
            }
          }
        }
      }
    // Végétation des grottes : lichens lumineux et champignons.
    for (let i = 0; i < 24; i++) {
      const lx = rng.int(0, 15);
      const lz = rng.int(0, 15);
      const y = rng.int(12, 60);
      const idx = colIndex(lx, y, lz);
      if (blocks[idx] !== AIR) continue;
      const below = blocks[colIndex(lx, y - 1, lz)] & 0x3ff;
      if (below === B.stone || below === B.deepslate) {
        const r = rng.next();
        if (r < 0.25) w.set(w.x0 + lx, y, w.z0 + lz, B.glow_mushroom);
        else if (r < 0.4) w.set(w.x0 + lx, y, w.z0 + lz, B.brown_mushroom);
      }
      if (lx > 0 && (blocks[colIndex(lx - 1, y, lz)] & 0x3ff) === B.stone && rng.next() < 0.5) w.set(w.x0 + lx, y, w.z0 + lz, B.glow_lichen, 1);
    }
  }

  private nearWater(blocks: Uint16Array, lx: number, y: number, lz: number): boolean {
    const n = [
      [lx + 1, lz],
      [lx - 1, lz],
      [lx, lz + 1],
      [lx, lz - 1],
    ];
    for (const [x, z] of n) {
      if (x < 0 || x > 15 || z < 0 || z > 15) continue;
      if ((blocks[colIndex(x, y, z)] & 0x3ff) === B.water) return true;
    }
    return false;
  }

  private cactusFree(blocks: Uint16Array, lx: number, y: number, lz: number): boolean {
    if (lx < 1 || lx > 14 || lz < 1 || lz > 14) return false;
    return blocks[colIndex(lx + 1, y, lz)] === AIR && blocks[colIndex(lx - 1, y, lz)] === AIR && blocks[colIndex(lx, y, lz + 1)] === AIR && blocks[colIndex(lx, y, lz - 1)] === AIR;
  }

  /** Troupeaux d'animaux présents dès la génération (persistants). */
  private spawnHerds(w: ChunkWriter, samples: Array<{ biome: number }>): void {
    const h = hash2(this.opts.seed ^ 0x4e2d, w.cx, w.cz);
    if (h % 9 !== 0) return;
    const rng = new Rng(h);
    const lx = rng.int(2, 13);
    const lz = rng.int(2, 13);
    const b = biomeById(samples[lz * 16 + lx].biome);
    const land = b.passiveMobs.filter((m) => !['cod', 'salmon', 'squid', 'dolphin', 'tropical_fish'].includes(m));
    const pool = b.isOcean ? b.passiveMobs : land;
    if (!pool.length) return;
    const type = rng.pick(pool);
    const n = rng.int(2, 4);
    for (let i = 0; i < n; i++) {
      const x = w.x0 + Math.max(0, Math.min(15, lx + rng.int(-2, 2)));
      const z = w.z0 + Math.max(0, Math.min(15, lz + rng.int(-2, 2)));
      let y = WORLD_HEIGHT - 2;
      while (y > 1 && w.get(x, y, z) === AIR) y--;
      const ground = w.get(x, y, z);
      const aquatic = ['cod', 'salmon', 'squid', 'dolphin', 'tropical_fish'].includes(type);
      if (aquatic !== (ground === B.water)) continue;
      w.mark({ kind: 'mob', id: type, x: x + 0.5, y: aquatic ? y - 1 : y + 1, z: z + 0.5 });
    }
  }
}
