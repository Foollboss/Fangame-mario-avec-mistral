/**
 * TerrainMesher — transforme une colonne de blocs en maillages par section (16x16x16).
 *
 * Format d'un sommet (3 entiers 32 bits, décodés dans le shader) :
 *   w0 = x(10) | y(10) | z(10)                  positions locales ×32, décalées de +1 bloc
 *   w1 = u(5) | v(5) | calque(11) | teinte(1) | superposition(1) | anim(5) | ondulation(1) | ombrage(3)
 *   w2 = couleur RGB565(16) | ciel(7) | blocs(7) | occlusion(2)
 * Chaque quad = 4 sommets ; un tampon d'indices commun (0,1,2,0,2,3) est utilisé au rendu.
 */
import { BLOCKS, LIGHT_EMIT, OPAQUE, Pass, Tint, WATERLOGGED, type BlockDef } from './blocks';
import { FOLIAGE_COLORS, GRASS_COLORS, WATER_COLORS } from './biomes';
import { LightVolume, RX, REGION_PLANE } from './light';
import { getModel, needsConnections, type Quad } from './models';

export interface TextureInfo {
  layer: number;
  frames: number;
}

export interface SectionMesh {
  sy: number;
  solid: Uint32Array | null;
  trans: Uint32Array | null;
  /** Connectivité entre faces (15 bits) pour l'élimination des sections cachées. */
  vis: number;
}

export interface MeshRequest {
  cols: Array<Uint16Array | null>;
  biomes: Array<Uint8Array | null>;
  sections: number;
  hasSky: boolean;
  fancyLeaves: boolean;
}

const PLANE = REGION_PLANE;

// Faces : 0 +X, 1 -X, 2 +Y, 3 -Y, 4 +Z, 5 -Z
const DIRS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
const U_AXES = [
  [0, 0, -1],
  [0, 0, 1],
  [1, 0, 0],
  [1, 0, 0],
  [1, 0, 0],
  [-1, 0, 0],
];
const V_AXES = [
  [0, 1, 0],
  [0, 1, 0],
  [0, 0, -1],
  [0, 0, 1],
  [0, 1, 0],
  [0, 1, 0],
];
/** Coin de départ de chaque face (en 0/1). */
const FACE_BASE = [
  [1, 0, 1],
  [0, 0, 0],
  [0, 1, 1],
  [0, 0, 0],
  [0, 0, 1],
  [1, 0, 0],
];

class QuadBuffer {
  data = new Uint32Array(12 * 4096);
  count = 0;
  reset(): void {
    this.count = 0;
  }
  ensure(): void {
    if ((this.count + 1) * 12 > this.data.length) {
      const n = new Uint32Array(this.data.length * 2);
      n.set(this.data);
      this.data = n;
    }
  }
  take(): Uint32Array | null {
    if (this.count === 0) return null;
    return this.data.slice(0, this.count * 12);
  }
}

function rgb565(c: number): number {
  return (((c >> 19) & 31) << 11) | (((c >> 10) & 63) << 5) | ((c >> 3) & 31);
}

export class TerrainMesher {
  private vol = new LightVolume();
  private solid = new QuadBuffer();
  private trans = new QuadBuffer();
  private textures = new Map<string, TextureInfo>();
  private faceTex: Int32Array = new Int32Array(0);
  private overlayTex = new Int32Array(1024).fill(-1);
  private grassTint = new Int32Array(18 * 18);
  private foliageTint = new Int32Array(18 * 18);
  private waterTint = new Int32Array(18 * 18);
  private visited = new Uint8Array(4096);
  private stack = new Int16Array(4096);
  private fancyLeaves = true;
  private missing: TextureInfo = { layer: 0, frames: 1 };

  setTextures(map: Record<string, TextureInfo>): void {
    this.textures = new Map(Object.entries(map));
    // Table rapide : (id * 6 + face) -> calque
    this.faceTex = new Int32Array(1024 * 6).fill(0);
    for (const b of BLOCKS) {
      if (!b) continue;
      const t = b.tex;
      const names = [t.east, t.west, t.top, t.bottom, t.south, t.north];
      for (let f = 0; f < 6; f++) this.faceTex[b.id * 6 + f] = this.packTex(names[f]);
      if (t.overlay) this.overlayTex[b.id] = this.packTex(t.overlay);
    }
  }

  /** Calque + nombre d'images d'animation empaquetés : layer | (frames-1) << 16. */
  packTex(name: string): number {
    const t = this.textures.get(name) ?? this.missing;
    return t.layer | ((t.frames - 1) << 16);
  }

  /** Lumière du tronçon central, empaquetée (ciel << 4 | blocs), indexée comme une colonne. */
  extractLight(): Uint8Array {
    const vol = this.vol;
    const out = new Uint8Array(65536);
    const H = vol.height;
    for (let y = 0; y < 256; y++)
      for (let z = 0; z < 16; z++)
        for (let x = 0; x < 16; x++) {
          if (y >= H) {
            out[(y << 8) | (z << 4) | x] = 0xf0;
            continue;
          }
          const i = y * PLANE + (z + 16) * RX + x + 16;
          out[(y << 8) | (z << 4) | x] = (vol.sky[i] << 4) | vol.blk[i];
        }
    return out;
  }

  mesh(req: MeshRequest): SectionMesh[] {
    this.fancyLeaves = req.fancyLeaves;
    const vol = this.vol;
    vol.load(req.cols);
    vol.compute(req.hasSky);
    this.computeTints(req.biomes);
    const out: SectionMesh[] = [];
    const H = vol.height;
    for (let sy = 0; sy < 16; sy++) {
      const y0 = sy * 16;
      if (y0 >= H) {
        out.push({ sy, solid: null, trans: null, vis: 0x7fff });
        continue;
      }
      const vis = this.visibility(sy);
      if (!(req.sections & (1 << sy))) {
        out.push({ sy, solid: null, trans: null, vis: vis | 0x10000 });
        continue;
      }
      this.solid.reset();
      this.trans.reset();
      this.meshSection(sy);
      out.push({ sy, solid: this.solid.take(), trans: this.trans.take(), vis });
    }
    return out;
  }

  private computeTints(biomes: Array<Uint8Array | null>): void {
    const R = 2;
    const center = biomes[4];
    const biomeAt = (x: number, z: number): number => {
      // x,z relatifs au tronçon central (peuvent déborder de -18..33)
      const cx = x < 0 ? 0 : x > 15 ? 2 : 1;
      const cz = z < 0 ? 0 : z > 15 ? 2 : 1;
      const arr = biomes[cz * 3 + cx] ?? center;
      if (!arr) return 5;
      return arr[(((z % 16) + 16) % 16) * 16 + (((x % 16) + 16) % 16)];
    };
    for (let z = -1; z <= 16; z++)
      for (let x = -1; x <= 16; x++) {
        let gr = 0,
          gg = 0,
          gb = 0,
          fr = 0,
          fg = 0,
          fb = 0,
          wr = 0,
          wg = 0,
          wb = 0,
          n = 0;
        for (let dz = -R; dz <= R; dz++)
          for (let dx = -R; dx <= R; dx++) {
            const b = biomeAt(x + dx, z + dz);
            const g = GRASS_COLORS[b];
            const f = FOLIAGE_COLORS[b];
            const w = WATER_COLORS[b];
            gr += (g >> 16) & 255;
            gg += (g >> 8) & 255;
            gb += g & 255;
            fr += (f >> 16) & 255;
            fg += (f >> 8) & 255;
            fb += f & 255;
            wr += (w >> 16) & 255;
            wg += (w >> 8) & 255;
            wb += w & 255;
            n++;
          }
        const i = (z + 1) * 18 + (x + 1);
        this.grassTint[i] = ((gr / n) << 16) | ((gg / n) << 8) | (gb / n);
        this.foliageTint[i] = ((fr / n) << 16) | ((fg / n) << 8) | (fb / n);
        this.waterTint[i] = ((wr / n) << 16) | ((wg / n) << 8) | (wb / n);
      }
  }

  private tintFor(b: BlockDef, lx: number, lz: number, meta: number): number {
    const i = (lz + 1) * 18 + (lx + 1);
    switch (b.tint) {
      case Tint.Grass:
        return this.grassTint[i];
      case Tint.Foliage:
        return this.foliageTint[i];
      case Tint.Water:
        return this.waterTint[i];
      case Tint.Fixed:
        if (b.key === 'energy_wire') {
          const p = meta & 15;
          const r = Math.floor(80 + (175 * p) / 15);
          return (r << 16) | ((p > 0 ? 20 : 0) << 8);
        }
        return b.tintColor;
      default:
        return 0xffffff;
    }
  }

  /** Graphe de visibilité d'une section : quelles faces communiquent par des cellules non opaques. */
  private visibility(sy: number): number {
    const ids = this.vol.ids;
    const visited = this.visited;
    visited.fill(0);
    let result = 0;
    let anyOpaque = false;
    const y0 = sy * 16;
    for (let start = 0; start < 4096; start++) {
      if (visited[start]) continue;
      const sx = start & 15;
      const sz = (start >> 4) & 15;
      const syy = start >> 8;
      const id = ids[(y0 + syy) * PLANE + (sz + 16) * RX + sx + 16];
      if (OPAQUE[id]) {
        visited[start] = 1;
        anyOpaque = true;
        continue;
      }
      // Remplissage
      let faces = 0;
      let sp = 0;
      this.stack[sp++] = start;
      visited[start] = 1;
      while (sp > 0) {
        const c = this.stack[--sp];
        const x = c & 15;
        const z = (c >> 4) & 15;
        const y = c >> 8;
        if (x === 15) faces |= 1;
        if (x === 0) faces |= 2;
        if (y === 15) faces |= 4;
        if (y === 0) faces |= 8;
        if (z === 15) faces |= 16;
        if (z === 0) faces |= 32;
        for (let k = 0; k < 6; k++) {
          let n: number;
          if (k === 0) n = x < 15 ? c + 1 : -1;
          else if (k === 1) n = x > 0 ? c - 1 : -1;
          else if (k === 2) n = y < 15 ? c + 256 : -1;
          else if (k === 3) n = y > 0 ? c - 256 : -1;
          else if (k === 4) n = z < 15 ? c + 16 : -1;
          else n = z > 0 ? c - 16 : -1;
          if (n < 0 || visited[n]) continue;
          visited[n] = 1;
          const nx = n & 15;
          const nz = (n >> 4) & 15;
          const ny = n >> 8;
          if (OPAQUE[ids[(y0 + ny) * PLANE + (nz + 16) * RX + nx + 16]]) continue;
          this.stack[sp++] = n;
        }
      }
      // Paires de faces connectées
      let bit = 0;
      for (let a = 0; a < 6; a++)
        for (let b = a + 1; b < 6; b++) {
          if (faces & (1 << a) && faces & (1 << b)) result |= 1 << bit;
          bit++;
        }
    }
    if (!anyOpaque) return 0x7fff;
    return result;
  }

  private meshSection(sy: number): void {
    const vol = this.vol;
    const ids = vol.ids;
    const raw = vol.raw;
    const y0 = sy * 16;
    const yEnd = Math.min(y0 + 16, vol.height);
    for (let y = y0; y < yEnd; y++)
      for (let lz = 0; lz < 16; lz++)
        for (let lx = 0; lx < 16; lx++) {
          const i = y * PLANE + (lz + 16) * RX + lx + 16;
          const id = ids[i];
          if (id === 0) continue;
          const b = BLOCKS[id];
          if (!b) continue;
          const meta = raw[i] >> 10;
          if (b.shape === 'cube') this.cube(b, i, lx, y, lz, meta);
          else if (b.shape === 'liquid') this.liquid(b, i, lx, y, lz, meta);
          else {
            if (WATERLOGGED[id] && b.key !== 'water') this.liquid(BLOCKS[9], i, lx, y, lz, 0);
            this.model(b, i, lx, y, lz, meta);
          }
        }
  }

  // ------------------------------------------------------------------ cubes
  private cube(b: BlockDef, i: number, lx: number, y: number, lz: number, meta: number): void {
    const ids = this.vol.ids;
    const id = b.id;
    const isLeaves = b.key.endsWith('_leaves');
    const buf = b.pass === Pass.Translucent ? this.trans : this.solid;
    const tint = b.tint !== Tint.None ? this.tintFor(b, lx, lz, meta) : 0xffffff;
    const sy = y & ~15;
    for (let f = 0; f < 6; f++) {
      const d = DIRS[f];
      const ny = y + d[1];
      let nid = 0;
      if (ny >= 0 && ny < this.vol.height) nid = ids[i + d[0] + d[1] * PLANE + d[2] * RX];
      else if (ny < 0) continue;
      if (OPAQUE[nid]) continue;
      if (nid === id && b.pass !== Pass.Opaque && !(isLeaves && this.fancyLeaves)) continue;
      // Orientation (bûches, fours…)
      let tex = this.faceTex[id * 6 + this.orientFace(b, f, meta)];
      if (b.front && b.orient === 'facing' && f === FACING_FACE[meta & 3]) tex = this.packTex(meta & 4 && b.activeTex ? b.activeTex : b.front);
      if (b.activeTex && b.powerConsumer && meta & 1 && b.shape === 'cube') tex = this.packTex(b.activeTex);
      const overlay = this.overlayTex[id];
      const tinted = b.tint !== Tint.None && (b.key !== 'grass_block' || f === 2);
      this.emitCubeFace(buf, f, lx, y - sy, lz, i, tex, tinted ? tint : 0xffffff, tinted, overlay >= 0 && f !== 2 && f !== 3, isLeaves, b.tint !== Tint.None ? tint : 0xffffff, b.key === 'grass_block' ? 0 : -1);
    }
  }

  /** Bûches : la texture dépend de l'axe ; les rotations « axis » permutent les faces. */
  private orientFace(b: BlockDef, f: number, meta: number): number {
    if (b.orient !== 'axis' || meta === 0) return f;
    if (meta === 1) {
      // axe X : les extrémités sont à l'est/ouest
      if (f === 0 || f === 1) return 2;
      if (f === 2 || f === 3) return 4;
      return f;
    }
    // axe Z
    if (f === 4 || f === 5) return 2;
    if (f === 2 || f === 3) return 0;
    return f;
  }

  private emitCubeFace(buf: QuadBuffer, f: number, lx: number, ly: number, lz: number, i: number, tex: number, tint: number, tinted: boolean, overlay: boolean, wave: boolean, overlayTint: number, _x: number): void {
    const vol = this.vol;
    const ids = vol.ids;
    const sky = vol.sky;
    const blk = vol.blk;
    const d = DIRS[f];
    const ua = U_AXES[f];
    const va = V_AXES[f];
    const base = FACE_BASE[f];
    const H = vol.height;
    const absY = (i / PLANE) | 0;
    // cellule devant la face
    const fy = absY + d[1];
    const front = i + d[0] + d[1] * PLANE + d[2] * RX;
    const frontInside = fy >= 0 && fy < H;
    const du = ua[0] + ua[1] * PLANE + ua[2] * RX;
    const dv = va[0] + va[1] * PLANE + va[2] * RX;
    const sl = [0, 0, 0, 0];
    const bl = [0, 0, 0, 0];
    const ao = [3, 3, 3, 3];
    const signs = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ];
    for (let k = 0; k < 4; k++) {
      const su = signs[k][0];
      const sv = signs[k][1];
      if (!frontInside) {
        sl[k] = fy >= H ? 15 * 8 : 0;
        bl[k] = 0;
        continue;
      }
      const s1 = front + su * du;
      const s2 = front + sv * dv;
      const c = front + su * du + sv * dv;
      const yS1 = fy + su * ua[1];
      const yS2 = fy + sv * va[1];
      const yC = fy + su * ua[1] + sv * va[1];
      const o1 = yS1 >= 0 && yS1 < H ? OPAQUE[ids[s1]] : 0;
      const o2 = yS2 >= 0 && yS2 < H ? OPAQUE[ids[s2]] : 0;
      const oc = yC >= 0 && yC < H ? OPAQUE[ids[c]] : 0;
      ao[k] = o1 && o2 ? 0 : 3 - (o1 + o2 + oc);
      let ss = sky[front];
      let bb = blk[front];
      let n = 1;
      if (!o1) {
        ss += yS1 >= H ? 15 : yS1 >= 0 ? sky[s1] : 0;
        bb += yS1 >= 0 && yS1 < H ? blk[s1] : 0;
        n++;
      }
      if (!o2) {
        ss += yS2 >= H ? 15 : yS2 >= 0 ? sky[s2] : 0;
        bb += yS2 >= 0 && yS2 < H ? blk[s2] : 0;
        n++;
      }
      if (!oc && !(o1 && o2)) {
        ss += yC >= H ? 15 : yC >= 0 ? sky[c] : 0;
        bb += yC >= 0 && yC < H ? blk[c] : 0;
        n++;
      }
      sl[k] = Math.round((ss * 8) / n);
      bl[k] = Math.round((bb * 8) / n);
    }
    // Choix de la diagonale pour éviter l'anisotropie de l'occlusion.
    const flip = ao[0] + ao[2] < ao[1] + ao[3];
    const order = flip ? [1, 2, 3, 0] : [0, 1, 2, 3];
    const cornerUV = [
      [0, 16],
      [16, 16],
      [16, 0],
      [0, 0],
    ];
    buf.ensure();
    const out = buf.data;
    let o = buf.count * 12;
    const flags = (tinted ? 1 << 21 : 0) | (overlay ? 1 << 22 : 0) | (((tex >> 16) & 31) << 23) | (wave ? 1 << 28 : 0) | (f << 29);
    const col = rgb565(overlay ? overlayTint : tint);
    for (const k of order) {
      const s = signs[k];
      const px = lx + base[0] + (s[0] > 0 ? ua[0] : 0) * 1 + (s[1] > 0 ? va[0] : 0);
      const py = ly + base[1] + (s[0] > 0 ? ua[1] : 0) + (s[1] > 0 ? va[1] : 0);
      const pz = lz + base[2] + (s[0] > 0 ? ua[2] : 0) + (s[1] > 0 ? va[2] : 0);
      out[o++] = ((px + 1) * 32) | (((py + 1) * 32) << 10) | (((pz + 1) * 32) << 20);
      out[o++] = cornerUV[k][0] | (cornerUV[k][1] << 5) | ((tex & 0x7ff) << 10) | flags;
      out[o++] = col | (Math.min(127, sl[k]) << 16) | (Math.min(127, bl[k]) << 23) | (ao[k] << 30);
    }
    buf.count++;
  }

  // ------------------------------------------------------------------ liquides
  private isSameLiquid(id: number, liquidId: number): boolean {
    if (id === liquidId) return true;
    return liquidId === 9 && WATERLOGGED[id] === 1;
  }

  private liquidHeight(i: number, y: number, liquidId: number): number {
    const vol = this.vol;
    const id = vol.ids[i];
    if (!this.isSameLiquid(id, liquidId)) return -1;
    if (y + 1 < vol.height && this.isSameLiquid(vol.ids[i + PLANE], liquidId)) return 1;
    if (id !== liquidId) return 14 / 16;
    const level = (vol.raw[i] >> 10) & 7;
    if (level === 0) return 14 / 16;
    return Math.max(2 / 16, ((8 - level) / 8) * (14 / 16));
  }

  private liquid(b: BlockDef, i: number, lx: number, y: number, lz: number, _meta: number): void {
    const vol = this.vol;
    const ids = vol.ids;
    const lid = b.id;
    const buf = b.pass === Pass.Translucent ? this.trans : this.solid;
    const tint = b.tint === Tint.Water ? this.waterTint[(lz + 1) * 18 + lx + 1] : 0xffffff;
    const H = vol.height;
    const ly = y & 15;
    const above = y + 1 < H ? ids[i + PLANE] : 0;
    const aboveSame = this.isSameLiquid(above, lid);
    // Hauteurs aux 4 coins (moyenne des liquides voisins).
    const ch = (dx: number, dz: number): number => {
      let sum = 0;
      let n = 0;
      for (const [ox, oz] of [
        [0, 0],
        [dx, 0],
        [0, dz],
        [dx, dz],
      ]) {
        const j = i + ox + oz * RX;
        if (y + 1 < H && this.isSameLiquid(ids[j + PLANE], lid)) return 1;
        const h = this.liquidHeight(j, y, lid);
        if (h >= 0) {
          sum += h;
          n++;
        }
      }
      return n ? sum / n : 14 / 16;
    };
    const h00 = aboveSame ? 1 : ch(-1, -1);
    const h10 = aboveSame ? 1 : ch(1, -1);
    const h11 = aboveSame ? 1 : ch(1, 1);
    const h01 = aboveSame ? 1 : ch(-1, 1);
    const still = this.packTex(b.tex.top);
    const flow = this.packTex(b.tex.north);
    const lightAt = (j: number, jy: number): [number, number] => {
      if (jy >= H) return [15 * 8, 0];
      if (jy < 0) return [0, 0];
      const s = Math.max(vol.sky[j], vol.sky[i]);
      const bl = Math.max(vol.blk[j], vol.blk[i], LIGHT_EMIT[lid]);
      return [s * 8, bl * 8];
    };
    const emit = (pts: number[][], uv: number[][], tex: number, shadeFace: number, light: [number, number]) => {
      buf.ensure();
      const out = buf.data;
      let o = buf.count * 12;
      const flags = (1 << 21) * (b.tint !== Tint.None ? 1 : 0) | (((tex >> 16) & 31) << 23) | (shadeFace << 29);
      const col = rgb565(tint);
      for (let k = 0; k < 4; k++) {
        const p = pts[k];
        out[o++] = Math.round((p[0] + 1) * 32) | (Math.round((p[1] + 1) * 32) << 10) | (Math.round((p[2] + 1) * 32) << 20);
        out[o++] = uv[k][0] | (uv[k][1] << 5) | ((tex & 0x7ff) << 10) | flags;
        out[o++] = col | (light[0] << 16) | (light[1] << 23) | (3 << 30);
      }
      buf.count++;
    };
    const x0 = lx;
    const x1 = lx + 1;
    const z0 = lz;
    const z1 = lz + 1;
    // Dessus
    if (!aboveSame && !(OPAQUE[above] && h00 >= 1)) {
      const l = lightAt(i + PLANE, y + 1);
      emit(
        [
          [x0, ly + h01, z1],
          [x1, ly + h11, z1],
          [x1, ly + h10, z0],
          [x0, ly + h00, z0],
        ],
        [
          [0, 16],
          [16, 16],
          [16, 0],
          [0, 0],
        ],
        still,
        2,
        l,
      );
      // Face inférieure de la surface (visible depuis sous l'eau)
      emit(
        [
          [x1, ly + h11, z1],
          [x0, ly + h01, z1],
          [x0, ly + h00, z0],
          [x1, ly + h10, z0],
        ],
        [
          [0, 16],
          [16, 16],
          [16, 0],
          [0, 0],
        ],
        still,
        3,
        l,
      );
    }
    // Dessous
    if (y > 0) {
      const below = ids[i - PLANE];
      if (!this.isSameLiquid(below, lid) && !OPAQUE[below]) {
        emit(
          [
            [x0, ly, z0],
            [x1, ly, z0],
            [x1, ly, z1],
            [x0, ly, z1],
          ],
          [
            [0, 16],
            [16, 16],
            [16, 0],
            [0, 0],
          ],
          still,
          3,
          lightAt(i - PLANE, y - 1),
        );
      }
    }
    // Côtés
    const sides: Array<[number, number[][], number[]]> = [
      [0, [[x1, 0, z1], [x1, 0, z0], [x1, 1, z0], [x1, 1, z1]], [h11, h10]],
      [1, [[x0, 0, z0], [x0, 0, z1], [x0, 1, z1], [x0, 1, z0]], [h00, h01]],
      [4, [[x0, 0, z1], [x1, 0, z1], [x1, 1, z1], [x0, 1, z1]], [h01, h11]],
      [5, [[x1, 0, z0], [x0, 0, z0], [x0, 1, z0], [x1, 1, z0]], [h10, h00]],
    ];
    for (const [f, pts, hs] of sides) {
      const d = DIRS[f];
      const j = i + d[0] + d[2] * RX;
      const nid = ids[j];
      if (this.isSameLiquid(nid, lid) || OPAQUE[nid]) continue;
      const p = pts.map((q) => [q[0], ly + (q[1] === 0 ? 0 : 0), q[2]]);
      p[2][1] = ly + hs[0];
      p[3][1] = ly + hs[1];
      const vTop0 = Math.round(16 - hs[0] * 16);
      const vTop1 = Math.round(16 - hs[1] * 16);
      emit(
        p,
        [
          [0, 16],
          [16, 16],
          [16, vTop0],
          [0, vTop1],
        ],
        flow,
        f,
        lightAt(j, y),
      );
    }
  }

  // ------------------------------------------------------------------ modèles
  private connections(b: BlockDef, i: number): number {
    const ids = this.vol.ids;
    let m = 0;
    const offs = [RX, -1, -RX, 1]; // sud, ouest, nord, est
    for (let k = 0; k < 4; k++) {
      const n = ids[i + offs[k]];
      const nb = BLOCKS[n];
      if (!nb) continue;
      if (b.shape === 'wire') {
        if (nb.shape === 'wire' || nb.powerSource || nb.powerConsumer) m |= 1 << k;
        // monte/descend d'un bloc
        else if (!OPAQUE[n] && BLOCKS[ids[i + offs[k] - PLANE]]?.shape === 'wire') m |= 1 << k;
        else if (BLOCKS[ids[i + offs[k] + PLANE]]?.shape === 'wire') m |= 1 << k;
      } else if (OPAQUE[n] || nb.shape === b.shape || (b.shape === 'fence' && nb.shape === 'fence') || (b.shape === 'pane' && nb.shape === 'pane')) m |= 1 << k;
    }
    return m;
  }

  private model(b: BlockDef, i: number, lx: number, y: number, lz: number, meta: number): void {
    const vol = this.vol;
    const ids = vol.ids;
    const conn = needsConnections(b.shape) ? this.connections(b, i) : 0;
    let metaKey = meta;
    if (b.shape === 'lily') metaKey = ((lx * 7 + lz * 13 + y) & 3) | (meta & ~3);
    const quads: Quad[] = getModel(b.id, metaKey, conn);
    const buf = b.pass === Pass.Translucent ? this.trans : this.solid;
    const tint = b.tint !== Tint.None ? this.tintFor(b, lx, lz, meta) : 0xffffff;
    const ly = y & 15;
    const H = vol.height;
    const ownSky = vol.sky[i];
    const ownBlk = Math.max(vol.blk[i], LIGHT_EMIT[b.id]);
    // Décalage aléatoire des plantes (aspect plus naturel)
    let ox = 0;
    let oz = 0;
    if (b.shape === 'cross' && b.key !== 'cobweb' && b.key !== 'sugar_cane' && !b.waterlogged) {
      const h = ((lx + 31) * 73856093) ^ ((lz + 17) * 19349663) ^ (y * 83492791);
      ox = (((h >> 4) & 7) - 3.5) / 32;
      oz = (((h >> 8) & 7) - 3.5) / 32;
    }
    for (const q of quads) {
      if (q.cull >= 0) {
        const d = DIRS[q.cull];
        const ny = y + d[1];
        if (ny >= 0 && ny < H) {
          const nid = ids[i + d[0] + d[1] * PLANE + d[2] * RX];
          if (OPAQUE[nid]) continue;
          if (nid === b.id && (b.shape === 'portal' || b.shape === 'slab' || b.shape === 'layer')) continue;
        }
      }
      let sl = ownSky;
      let bl = ownBlk;
      if (q.cull >= 0 || OPAQUE[b.id]) {
        const d = DIRS[q.cull >= 0 ? q.cull : 2];
        const ny = y + d[1];
        if (ny >= H) sl = 15;
        else if (ny >= 0) {
          const j = i + d[0] + d[1] * PLANE + d[2] * RX;
          sl = Math.max(sl, vol.sky[j]);
          bl = Math.max(bl, vol.blk[j]);
        }
      }
      if (OPAQUE[b.id] || b.shape === 'stairs' || b.shape === 'slab' || b.shape === 'chest' || b.shape === 'farmland') {
        // Les blocs pleins partiels prennent la lumière de leurs voisins (évite les faces noires).
        for (let f = 0; f < 6; f++) {
          const d = DIRS[f];
          const ny = y + d[1];
          if (ny >= H) sl = 15;
          else if (ny >= 0) {
            const j = i + d[0] + d[1] * PLANE + d[2] * RX;
            if (!OPAQUE[ids[j]]) {
              sl = Math.max(sl, vol.sky[j] - 1);
              bl = Math.max(bl, vol.blk[j] - 1);
            }
          }
        }
      }
      const tex = this.packTex(q.tex);
      buf.ensure();
      const out = buf.data;
      let o = buf.count * 12;
      const flags = (q.tint ? 1 << 21 : 0) | (((tex >> 16) & 31) << 23) | (q.wave ? 1 << 28 : 0) | (Math.min(q.shade, 6) << 29);
      const col = rgb565(q.tint ? tint : 0xffffff);
      for (let k = 0; k < 4; k++) {
        const px = lx + q.p[k * 3] + ox;
        const py = ly + q.p[k * 3 + 1];
        const pz = lz + q.p[k * 3 + 2] + oz;
        out[o++] = Math.round((px + 1) * 32) | (Math.round((py + 1) * 32) << 10) | (Math.round((pz + 1) * 32) << 20);
        out[o++] = Math.round(q.uv[k * 2]) | (Math.round(q.uv[k * 2 + 1]) << 5) | ((tex & 0x7ff) << 10) | flags;
        out[o++] = col | (Math.min(127, sl * 8) << 16) | (Math.min(127, bl * 8) << 23) | (3 << 30);
      }
      buf.count++;
    }
  }
}

/** Face portant la texture « avant » selon l'orientation (0 sud, 1 ouest, 2 nord, 3 est). */
const FACING_FACE = [4, 1, 5, 0];
