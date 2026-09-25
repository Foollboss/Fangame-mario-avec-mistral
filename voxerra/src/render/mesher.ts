/**
 * Mailleur de sections 16³ (fonction pure, exécutée dans les workers).
 * - « greedy meshing » des faces cubiques (fusion des faces identiques)
 * - élimination des faces cachées
 * - occlusion ambiante par sommet + éclairage lissé (ciel et blocs)
 * - teintes de biome par sommet
 * - modèles (dalles, escaliers, portes, torches, vitres…), plantes en croix
 * - trois passes : opaque, découpe (alpha test), translucide
 * - graphe de connectivité des faces de la section (culling des grottes)
 *
 * Entrée : blocs et lumière d'un cube 18³ (section + 1 bloc de bordure).
 */
import {
  Shape,
  PASS_OPAQUE,
  PASS_CUTOUT,
  PASS_TRANSLUCENT,
  TINT_NONE,
  ANIM_SWAY,
  type BlockTables,
} from '../registry/blocks';
import { modelBoxes, type Box, CONN_PX, CONN_NX, CONN_PZ, CONN_NZ } from '../world/shapes';
import { hash3 } from '../engine/rng';

export const PAD = 18;
export const PAD2 = PAD * PAD;
export const P = (x: number, y: number, z: number): number => ((y + 1) * PAD + (z + 1)) * PAD + (x + 1);

export interface MeshInput {
  blocks: Uint16Array; // 18³
  light: Uint8Array; // 18³
  tints: Uint32Array; // 18*18*3
  ox: number; // origine monde de la section
  oy: number;
  oz: number;
}

export interface MeshPassData {
  pos: Uint16Array;
  uv: Uint16Array;
  light: Uint8Array;
  color: Uint8Array;
  index: Uint16Array | Uint32Array;
  vertices: number;
}

export interface MeshOutput {
  passes: (MeshPassData | null)[];
  connectivity: number;
}

// ---------------------------------------------------------------------------
class Geo {
  pos = new Uint16Array(2048 * 3);
  uv = new Uint16Array(2048 * 4);
  light = new Uint8Array(2048 * 4);
  color = new Uint8Array(2048 * 4);
  idx = new Uint32Array(3072);
  vc = 0;
  ic = 0;

  private growV(): void {
    const n = this.pos.length / 3 * 2;
    const pos = new Uint16Array(n * 3);
    pos.set(this.pos);
    this.pos = pos;
    const uv = new Uint16Array(n * 4);
    uv.set(this.uv);
    this.uv = uv;
    const l = new Uint8Array(n * 4);
    l.set(this.light);
    this.light = l;
    const c = new Uint8Array(n * 4);
    c.set(this.color);
    this.color = c;
  }

  vertex(px: number, py: number, pz: number, u: number, v: number, layer: number, flags: number, sky: number, blk: number, ao: number, tint: number): void {
    if ((this.vc + 1) * 3 > this.pos.length) this.growV();
    const i3 = this.vc * 3,
      i4 = this.vc * 4;
    this.pos[i3] = px;
    this.pos[i3 + 1] = py;
    this.pos[i3 + 2] = pz;
    this.uv[i4] = u;
    this.uv[i4 + 1] = v;
    this.uv[i4 + 2] = layer;
    this.uv[i4 + 3] = flags;
    this.light[i4] = sky;
    this.light[i4 + 1] = blk;
    this.light[i4 + 2] = ao;
    this.light[i4 + 3] = 255;
    this.color[i4] = (tint >> 16) & 255;
    this.color[i4 + 1] = (tint >> 8) & 255;
    this.color[i4 + 2] = tint & 255;
    this.color[i4 + 3] = 255;
    this.vc++;
  }

  /** Ajoute les indices du dernier quadrilatère (4 sommets). */
  quad(reverse: boolean, flip: boolean): void {
    if (this.ic + 6 > this.idx.length) {
      const n = new Uint32Array(this.idx.length * 2);
      n.set(this.idx);
      this.idx = n;
    }
    const b = this.vc - 4;
    const id = this.idx;
    let i = this.ic;
    // flip : diagonale alternative (évite l'anisotropie de l'occlusion ambiante)
    const a0 = flip ? b + 1 : b,
      a1 = flip ? b + 2 : b + 1,
      a2 = flip ? b + 3 : b + 2,
      a3 = flip ? b : b + 3;
    if (!reverse) {
      id[i++] = a0;
      id[i++] = a1;
      id[i++] = a2;
      id[i++] = a0;
      id[i++] = a2;
      id[i++] = a3;
    } else {
      id[i++] = a0;
      id[i++] = a2;
      id[i++] = a1;
      id[i++] = a0;
      id[i++] = a3;
      id[i++] = a2;
    }
    this.ic = i;
  }

  finish(): MeshPassData | null {
    if (this.vc === 0) return null;
    const vc = this.vc;
    return {
      pos: this.pos.slice(0, vc * 3),
      uv: this.uv.slice(0, vc * 4),
      light: this.light.slice(0, vc * 4),
      color: this.color.slice(0, vc * 4),
      index: vc <= 65535 ? Uint16Array.from(this.idx.subarray(0, this.ic)) : this.idx.slice(0, this.ic),
      vertices: vc,
    };
  }
}

// Description des 6 directions : axe normal d, axes u/v, signe.
interface FaceDir {
  n: [number, number, number];
  d: number;
  u: number;
  v: number;
  pos: boolean;
}
const FACES: FaceDir[] = [
  { n: [1, 0, 0], d: 0, u: 2, v: 1, pos: true },
  { n: [-1, 0, 0], d: 0, u: 2, v: 1, pos: false },
  { n: [0, 1, 0], d: 1, u: 0, v: 2, pos: true },
  { n: [0, -1, 0], d: 1, u: 0, v: 2, pos: false },
  { n: [0, 0, 1], d: 2, u: 0, v: 1, pos: true },
  { n: [0, 0, -1], d: 2, u: 0, v: 1, pos: false },
];

// Faut-il inverser l'ordre des sommets pour que la face soit tournée vers l'extérieur ?
const REVERSE = FACES.map((f) => {
  const U = [0, 0, 0],
    V = [0, 0, 0];
  U[f.u] = 1;
  V[f.v] = 1;
  const cx = U[1] * V[2] - U[2] * V[1],
    cy = U[2] * V[0] - U[0] * V[2],
    cz = U[0] * V[1] - U[1] * V[0];
  return cx * f.n[0] + cy * f.n[1] + cz * f.n[2] < 0;
});

/** Coordonnées de texture (en 1/16) selon la face, à partir de la position locale ×16. */
function texU(face: number, x: number, z: number): number {
  switch (face) {
    case 0:
      return 256 - z;
    case 1:
      return z;
    case 4:
      return x;
    case 5:
      return 256 - x;
    default:
      return x; // haut / bas
  }
}
function texV(face: number, y: number, z: number): number {
  switch (face) {
    case 2:
      return z;
    case 3:
      return 256 - z;
    default:
      return 256 - y;
  }
}

// Rotation des faces horizontales pour les blocs orientables.
const HCYCLE = [4, 1, 5, 0]; // sud, ouest, nord, est
function orientFace(face: number, facing: number): number {
  const pos = HCYCLE.indexOf(face);
  if (pos < 0) return face;
  return HCYCLE[(pos - facing + 4) % 4];
}

const WHITE = 0xffffff;
const LIQUID_TOP = 14; // hauteur d'une surface d'eau (en 1/16)

export function meshSection(input: MeshInput, t: BlockTables): MeshOutput {
  const { blocks, light, tints } = input;
  const geos = [new Geo(), new Geo(), new Geo()];
  const opaque = t.opaque;
  const shape = t.shape;
  const pass = t.pass;
  const faceTex = t.faceTex;

  const tintOf = (id: number, x: number, z: number): number => {
    const tt = t.tint[id];
    if (tt === TINT_NONE) return WHITE;
    const cx = Math.max(-1, Math.min(16, x)),
      cz = Math.max(-1, Math.min(16, z));
    return tints[((cz + 1) * PAD + (cx + 1)) * 3 + (tt - 1)];
  };

  const liquidHeight = (v: number): number => {
    const meta = v >>> 12;
    if (meta & 8) return 16;
    const lvl = meta & 7;
    return lvl === 0 ? LIQUID_TOP : Math.max(2, Math.round((LIQUID_TOP * (8 - lvl)) / 8));
  };

  // ------------------------------------------------------------------ cubes
  const maskLayer = new Int32Array(256); // 0 = vide ; sinon layer+1 | pass<<13 | anim<<15 | inset<<18
  const maskAO = new Int32Array(256);
  const maskSky = new Int32Array(256);
  const maskBlk = new Int32Array(256);
  const maskTint = new Int32Array(256); // id du bloc pour la teinte
  const aoTmp = [0, 0, 0, 0];
  const skyTmp = [0, 0, 0, 0];
  const blkTmp = [0, 0, 0, 0];
  const cell = [0, 0, 0];
  const tcell = [0, 0, 0];

  for (let f = 0; f < 6; f++) {
    const F = FACES[f];
    const [nx, ny, nz] = F.n;
    const du = F.u,
      dv = F.v,
      dd = F.d;
    // vecteurs tangents
    const U = [0, 0, 0],
      V = [0, 0, 0];
    U[du] = 1;
    V[dv] = 1;
    for (let s = 0; s < 16; s++) {
      let any = false;
      for (let j = 0; j < 16; j++)
        for (let i = 0; i < 16; i++) {
          cell[dd] = s;
          cell[du] = i;
          cell[dv] = j;
          const x = cell[0],
            y = cell[1],
            z = cell[2];
          const k = j * 16 + i;
          maskLayer[k] = 0;
          const v = blocks[P(x, y, z)];
          const id = v & 0xfff;
          if (id === 0) continue;
          const sh = shape[id];
          if (sh !== Shape.CUBE && sh !== Shape.LIQUID) continue;
          const nv = blocks[P(x + nx, y + ny, z + nz)];
          const nid = nv & 0xfff;
          if (opaque[nid]) continue;
          if (nid === id && t.cullSelf[id]) continue;
          // liquide : surface plus basse si rien du même liquide au-dessus
          let inset = 0;
          if (sh === Shape.LIQUID) {
            if (shape[nid] === Shape.LIQUID && t.liquid[nid] === t.liquid[id]) continue;
            const above = blocks[P(x, y + 1, z)] & 0xfff;
            if (above !== id) inset = 16 - liquidHeight(v);
            if (f === 3 && nid !== 0 && t.solid[nid]) continue;
          }
          let face = f;
          if (t.orient[id]) face = orientFace(f, (v >>> 12) & 3);
          let layer = faceTex[id * 6 + face];
          if (t.stages[id]) layer += Math.min(t.stages[id] - 1, v >>> 12);
          const p = pass[id];
          // AO + lumière lissée aux 4 coins
          const bx = x + nx,
            by = y + ny,
            bz = z + nz;
          let uniformAO = true;
          for (let c = 0; c < 4; c++) {
            const su = c === 1 || c === 2 ? 1 : -1;
            const sv = c >= 2 ? 1 : -1;
            const s1 = P(bx + U[0] * su, by + U[1] * su, bz + U[2] * su);
            const s2 = P(bx + V[0] * sv, by + V[1] * sv, bz + V[2] * sv);
            const cc = P(bx + U[0] * su + V[0] * sv, by + U[1] * su + V[1] * sv, bz + U[2] * su + V[2] * sv);
            const o1 = opaque[blocks[s1] & 0xfff],
              o2 = opaque[blocks[s2] & 0xfff],
              oc = opaque[blocks[cc] & 0xfff];
            const ao = sh === Shape.LIQUID ? 3 : o1 && o2 ? 0 : 3 - (o1 + o2 + oc);
            aoTmp[c] = ao;
            if (ao !== 3) uniformAO = false;
            const l0 = light[P(bx, by, bz)];
            let sk = l0 >> 4,
              bl = l0 & 15,
              cnt = 1;
            if (!o1) {
              sk += light[s1] >> 4;
              bl += light[s1] & 15;
              cnt++;
            }
            if (!o2) {
              sk += light[s2] >> 4;
              bl += light[s2] & 15;
              cnt++;
            }
            if (!oc && !(o1 && o2)) {
              sk += light[cc] >> 4;
              bl += light[cc] & 15;
              cnt++;
            }
            skyTmp[c] = Math.round((sk * 17) / cnt);
            blkTmp[c] = Math.round((bl * 17) / cnt);
          }
          maskLayer[k] = (layer + 1) | (p << 13) | (t.anim[id] << 15) | (inset << 18);
          maskAO[k] = aoTmp[0] | (aoTmp[1] << 2) | (aoTmp[2] << 4) | (aoTmp[3] << 6) | (uniformAO ? 0 : 1 << 8);
          maskSky[k] = skyTmp[0] | (skyTmp[1] << 8) | (skyTmp[2] << 16) | (skyTmp[3] << 24);
          maskBlk[k] = blkTmp[0] | (blkTmp[1] << 8) | (blkTmp[2] << 16) | (blkTmp[3] << 24);
          maskTint[k] = id;
          any = true;
        }
      if (!any) continue;
      // Fusion gloutonne
      for (let j = 0; j < 16; j++)
        for (let i = 0; i < 16; ) {
          const k = j * 16 + i;
          const L = maskLayer[k];
          if (L === 0) {
            i++;
            continue;
          }
          const A = maskAO[k],
            S = maskSky[k],
            Bl = maskBlk[k];
          const tinted = t.tint[maskTint[k]] !== TINT_NONE;
          const mergeable = (A & 0x100) === 0 && (S & 0xff) === ((S >>> 8) & 0xff) && (S & 0xff) === ((S >>> 16) & 0xff) && (S & 0xff) === ((S >>> 24) & 0xff) && (Bl & 0xff) === ((Bl >>> 8) & 0xff) && (Bl & 0xff) === ((Bl >>> 16) & 0xff) && (Bl & 0xff) === ((Bl >>> 24) & 0xff);
          let w = 1,
            h = 1;
          if (mergeable) {
            while (i + w < 16) {
              const kk = k + w;
              if (maskLayer[kk] !== L || maskAO[kk] !== A || maskSky[kk] !== S || maskBlk[kk] !== Bl || (tinted && t.tint[maskTint[kk]] !== t.tint[maskTint[k]])) break;
              w++;
            }
            outer: while (j + h < 16) {
              for (let q = 0; q < w; q++) {
                const kk = (j + h) * 16 + i + q;
                if (maskLayer[kk] !== L || maskAO[kk] !== A || maskSky[kk] !== S || maskBlk[kk] !== Bl) break outer;
              }
              h++;
            }
          }
          // Émission du quadrilatère
          const layer = (L & 0x1fff) - 1;
          const p = (L >> 13) & 3;
          const anim = (L >> 15) & 7;
          const inset = (L >> 18) & 31;
          const geo = geos[p];
          const flags = f | (anim << 3);
          const blockId = maskTint[k];
          for (let c = 0; c < 4; c++) {
            const cu = c === 1 || c === 2 ? i + w : i;
            const cv = c >= 2 ? j + h : j;
            cell[dd] = F.pos ? s + 1 : s;
            cell[du] = cu;
            cell[dv] = cv;
            let px = cell[0] * 16,
              py = cell[1] * 16,
              pz = cell[2] * 16;
            if (inset) {
              // sommet haut de la face : abaissé
              if (f === 2) py -= inset;
              else if (f !== 3 && cv === j + h && dv === 1) py -= inset;
            }
            // teinte : colonne de la cellule située à ce coin du rectangle fusionné
            let tint = WHITE;
            if (tinted) {
              tcell[dd] = s;
              tcell[du] = c === 1 || c === 2 ? i + w - 1 : i;
              tcell[dv] = c >= 2 ? j + h - 1 : j;
              tint = tintOf(blockId, tcell[0], tcell[2]);
            }
            geo.vertex(px, py, pz, texU(f, px, pz), texV(f, py, pz), layer, flags, (S >>> (c * 8)) & 0xff, (Bl >>> (c * 8)) & 0xff, (A >> (c * 2)) & 3, tint);
          }
          const a0 = A & 3,
            a1 = (A >> 2) & 3,
            a2 = (A >> 4) & 3,
            a3 = (A >> 6) & 3;
          geo.quad(REVERSE[f], a0 + a2 < a1 + a3);
          // efface la zone fusionnée
          for (let hh = 0; hh < h; hh++) for (let ww = 0; ww < w; ww++) maskLayer[(j + hh) * 16 + i + ww] = 0;
          i += w;
        }
    }
  }

  // ------------------------------------------------------------ modèles & plantes
  for (let y = 0; y < 16; y++)
    for (let z = 0; z < 16; z++)
      for (let x = 0; x < 16; x++) {
        const v = blocks[P(x, y, z)];
        const id = v & 0xfff;
        if (id === 0) continue;
        const sh = shape[id];
        if (sh === Shape.CUBE || sh === Shape.LIQUID || sh === Shape.NONE) continue;
        const meta = v >>> 12;
        const own = light[P(x, y, z)];
        const p = pass[id];
        const geo = geos[p];
        if (sh === Shape.CROSS || sh === Shape.CROP) {
          let layer = faceTex[id * 6];
          if (t.stages[id]) layer += Math.min(t.stages[id] - 1, meta);
          const tint = tintOf(id, x, z);
          const flags = 6 | (t.anim[id] << 3);
          if (sh === Shape.CROSS) emitCross(geo, x, y, z, layer, flags, own, tint, hash3(0x51ed, input.ox + x, input.oy + y, input.oz + z));
          else emitCrop(geo, x, y, z, layer, flags, own, tint);
          continue;
        }
        // Connexions (vitres, barrières, murets)
        let conn = 0;
        if (sh === Shape.PANE || sh === Shape.FENCE || sh === Shape.WALL) {
          const c = (dx: number, dz: number) => {
            const nid = blocks[P(x + dx, y, z + dz)] & 0xfff;
            return nid !== 0 && (opaque[nid] || (t.connectable[nid] && (shape[nid] === sh || (sh !== Shape.PANE && shape[nid] !== Shape.PANE))) || (sh === Shape.PANE && shape[nid] === Shape.PANE));
          };
          if (c(1, 0)) conn |= CONN_PX;
          if (c(-1, 0)) conn |= CONN_NX;
          if (c(0, 1)) conn |= CONN_PZ;
          if (c(0, -1)) conn |= CONN_NZ;
        }
        const boxes = modelBoxes(sh, meta, conn);
        const tint = tintOf(id, x, z);
        for (const box of boxes) emitBox(geo, blocks, light, t, x, y, z, box, id, v, sh, own, tint);
      }

  return {
    passes: geos.map((g) => g.finish()),
    connectivity: computeConnectivity(blocks, opaque),
  };
}

function emitCross(geo: Geo, x: number, y: number, z: number, layer: number, flags: number, own: number, tint: number, h: number): void {
  const sky = (own >> 4) * 17,
    blk = (own & 15) * 17;
  const jx = (h % 5) - 2,
    jz = ((h >>> 4) % 5) - 2;
  const x0 = x * 16 + 2 + jx,
    x1 = x * 16 + 14 + jx;
  const z0 = z * 16 + 2 + jz,
    z1 = z * 16 + 14 + jz;
  const y0 = y * 16,
    y1 = y * 16 + 16;
  const quads: [number, number, number, number][] = [
    [x0, z0, x1, z1],
    [x0, z1, x1, z0],
  ];
  for (const [ax, az, bx, bz] of quads) {
    geo.vertex(ax, y0, az, 0, 16, layer, flags, sky, blk, 3, tint);
    geo.vertex(bx, y0, bz, 16, 16, layer, flags, sky, blk, 3, tint);
    geo.vertex(bx, y1, bz, 16, 0, layer, flags, sky, blk, 3, tint);
    geo.vertex(ax, y1, az, 0, 0, layer, flags, sky, blk, 3, tint);
    geo.quad(false, false);
  }
}

function emitCrop(geo: Geo, x: number, y: number, z: number, layer: number, flags: number, own: number, tint: number): void {
  const sky = (own >> 4) * 17,
    blk = (own & 15) * 17;
  const y0 = y * 16,
    y1 = y * 16 + 16;
  for (const o of [4, 12]) {
    // plans parallèles à Z
    const px = x * 16 + o;
    geo.vertex(px, y0, z * 16, 0, 16, layer, flags, sky, blk, 3, tint);
    geo.vertex(px, y0, z * 16 + 16, 16, 16, layer, flags, sky, blk, 3, tint);
    geo.vertex(px, y1, z * 16 + 16, 16, 0, layer, flags, sky, blk, 3, tint);
    geo.vertex(px, y1, z * 16, 0, 0, layer, flags, sky, blk, 3, tint);
    geo.quad(false, false);
    const pz = z * 16 + o;
    geo.vertex(x * 16, y0, pz, 0, 16, layer, flags, sky, blk, 3, tint);
    geo.vertex(x * 16 + 16, y0, pz, 16, 16, layer, flags, sky, blk, 3, tint);
    geo.vertex(x * 16 + 16, y1, pz, 16, 0, layer, flags, sky, blk, 3, tint);
    geo.vertex(x * 16, y1, pz, 0, 0, layer, flags, sky, blk, 3, tint);
    geo.quad(false, false);
  }
}

function emitBox(geo: Geo, blocks: Uint16Array, light: Uint8Array, t: BlockTables, x: number, y: number, z: number, box: Box, id: number, v: number, sh: number, own: number, tint: number): void {
  const [x0, y0, z0, x1, y1, z1] = box;
  const meta = v >>> 12;
  for (let f = 0; f < 6; f++) {
    const F = FACES[f];
    // La face touche-t-elle le bord du bloc ?
    let boundary = false;
    if (f === 0) boundary = x1 >= 16;
    else if (f === 1) boundary = x0 <= 0;
    else if (f === 2) boundary = y1 >= 16;
    else if (f === 3) boundary = y0 <= 0;
    else if (f === 4) boundary = z1 >= 16;
    else boundary = z0 <= 0;
    let l = own;
    if (boundary) {
      const nb = P(x + F.n[0], y + F.n[1], z + F.n[2]);
      const nid = blocks[nb] & 0xfff;
      if (t.opaque[nid]) continue;
      if (nid === id && (sh === Shape.PANE || sh === Shape.FENCE || sh === Shape.WALL || sh === Shape.PORTAL) && f !== 2 && f !== 3) continue;
      if (nid === id && sh === Shape.PORTAL) continue;
      l = light[nb];
    }
    let face = f;
    if (t.orient[id]) face = orientFace(f, meta & 3);
    let layer = t.faceTex[id * 6 + face];
    if (sh === Shape.DOOR) {
      // grandes faces : texture haut/bas selon la moitié ; tranches : texture latérale
      const thinAxisX = x1 - x0 < 4;
      const big = thinAxisX ? f === 0 || f === 1 : f === 4 || f === 5;
      layer = big ? t.faceTex[id * 6 + ((meta & 8) !== 0 ? 2 : 3)] : t.faceTex[id * 6 + 0];
    }
    const sky = (l >> 4) * 17,
      blk = (l & 15) * 17;
    const flags = f | (t.anim[id] << 3);
    const ox = x * 16,
      oy = y * 16,
      oz = z * 16;
    // 4 coins de la face dans l'ordre (u,v) : (0,0) (1,0) (1,1) (0,1)
    const cs = faceCorners(f, x0, y0, z0, x1, y1, z1);
    for (let c = 0; c < 4; c++) {
      const px = ox + cs[c * 3],
        py = oy + cs[c * 3 + 1],
        pz = oz + cs[c * 3 + 2];
      let u = texU(f, px, pz),
        vv = texV(f, py, pz);
      if (sh === Shape.TORCH && f === 2) {
        // sommet de la torche : flamme
        u = 7 + (c === 1 || c === 2 ? 2 : 0);
        vv = 5 + (c >= 2 ? 2 : 0);
      }
      geo.vertex(px, py, pz, u, vv, layer, flags, sky, blk, 3, tint);
    }
    geo.quad(REVERSE[f], false);
  }
}

/** Coins d'une face de boîte, ordonnés selon les axes (u,v) de la direction. */
function faceCorners(f: number, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): number[] {
  switch (f) {
    case 0: // +X : u=z, v=y
      return [x1, y0, z0, x1, y0, z1, x1, y1, z1, x1, y1, z0];
    case 1:
      return [x0, y0, z0, x0, y0, z1, x0, y1, z1, x0, y1, z0];
    case 2: // +Y : u=x, v=z
      return [x0, y1, z0, x1, y1, z0, x1, y1, z1, x0, y1, z1];
    case 3:
      return [x0, y0, z0, x1, y0, z0, x1, y0, z1, x0, y0, z1];
    case 4: // +Z : u=x, v=y
      return [x0, y0, z1, x1, y0, z1, x1, y1, z1, x0, y1, z1];
    default:
      return [x0, y0, z0, x1, y0, z0, x1, y1, z0, x0, y1, z0];
  }
}

/**
 * Connectivité : pour chaque paire de faces de la section, peut-on passer
 * de l'une à l'autre à travers des cellules non opaques ? (15 bits)
 */
export function pairBit(a: number, b: number): number {
  if (a > b) [a, b] = [b, a];
  // index de paire (a<b) parmi 15
  const base = [0, 5, 9, 12, 14][a];
  return 1 << (base + (b - a - 1));
}

const connVisited = new Uint8Array(4096);
const connStack = new Int32Array(4096);

export function computeConnectivity(blocks: Uint16Array, opaque: Uint8Array): number {
  connVisited.fill(0);
  let mask = 0;
  let openCells = 0;
  for (let i = 0; i < 4096; i++) {
    const x = i & 15,
      z = (i >> 4) & 15,
      y = i >> 8;
    if (opaque[blocks[P(x, y, z)] & 0xfff]) connVisited[i] = 1;
    else openCells++;
  }
  if (openCells === 4096) return 0x7fff;
  if (openCells === 0) return 0;
  for (let start = 0; start < 4096; start++) {
    if (connVisited[start]) continue;
    let sp = 0;
    connStack[sp++] = start;
    connVisited[start] = 1;
    let faces = 0;
    while (sp > 0) {
      const i = connStack[--sp];
      const x = i & 15,
        z = (i >> 4) & 15,
        y = i >> 8;
      if (x === 15) faces |= 1;
      if (x === 0) faces |= 2;
      if (y === 15) faces |= 4;
      if (y === 0) faces |= 8;
      if (z === 15) faces |= 16;
      if (z === 0) faces |= 32;
      if (x < 15 && !connVisited[i + 1]) {
        connVisited[i + 1] = 1;
        connStack[sp++] = i + 1;
      }
      if (x > 0 && !connVisited[i - 1]) {
        connVisited[i - 1] = 1;
        connStack[sp++] = i - 1;
      }
      if (z < 15 && !connVisited[i + 16]) {
        connVisited[i + 16] = 1;
        connStack[sp++] = i + 16;
      }
      if (z > 0 && !connVisited[i - 16]) {
        connVisited[i - 16] = 1;
        connStack[sp++] = i - 16;
      }
      if (y < 15 && !connVisited[i + 256]) {
        connVisited[i + 256] = 1;
        connStack[sp++] = i + 256;
      }
      if (y > 0 && !connVisited[i - 256]) {
        connVisited[i - 256] = 1;
        connStack[sp++] = i - 256;
      }
    }
    for (let a = 0; a < 6; a++) if (faces & (1 << a)) for (let b = a + 1; b < 6; b++) if (faces & (1 << b)) mask |= pairBit(a, b);
  }
  return mask;
}

export { PASS_OPAQUE, PASS_CUTOUT, PASS_TRANSLUCENT, ANIM_SWAY };
