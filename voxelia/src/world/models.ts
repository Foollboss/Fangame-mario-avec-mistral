/**
 * Modèles des blocs non cubiques (plantes, escaliers, portes, torches…) sous forme de quads.
 * Coordonnées en 1/16 de bloc. Partagé avec le worker de maillage.
 */
import { BLOCKS, Tint, type BlockDef } from './blocks';

export interface Quad {
  /** 4 sommets (x,y,z en 0..1), ordre anti-horaire vu de l'extérieur. */
  p: number[];
  /** 4 coordonnées de texture (u, v depuis le haut) en 1/16. */
  uv: number[];
  tex: string;
  /** Face pour l'ombrage directionnel (0..5) ou 6 = pas d'ombrage. */
  shade: number;
  /** Face voisine à tester pour l'élimination (-1 = jamais éliminée). */
  cull: number;
  tint: boolean;
  /** Ondule au vent (plantes). */
  wave?: boolean;
}

// Directions des axes u et v par face (cf. table des faces du mailleur).
const FACE_AXES: Array<{ n: number[]; u: number[]; v: number[] }> = [
  { n: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
  { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
  { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
  { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
  { n: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] },
];

type FaceTexFn = (face: number) => string | null;

interface BoxOpts {
  tint?: boolean;
  /** Rectangle UV forcé par face [u0,v0,u1,v1]. */
  uv?: (face: number) => number[] | null;
  noCull?: boolean;
  shade?: boolean;
}

/** Boîte de (x0,y0,z0) à (x1,y1,z1) en 1/16. */
export function box(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, tex: FaceTexFn, opts: BoxOpts = {}): Quad[] {
  const out: Quad[] = [];
  const lo = [x0 / 16, y0 / 16, z0 / 16];
  const hi = [x1 / 16, y1 / 16, z1 / 16];
  for (let f = 0; f < 6; f++) {
    const t = tex(f);
    if (!t) continue;
    const { n, u, v } = FACE_AXES[f];
    // Coin de départ : sur la face (n), au minimum le long de u et v.
    const base = [0, 0, 0];
    for (let a = 0; a < 3; a++) {
      if (n[a] !== 0) base[a] = n[a] > 0 ? hi[a] : lo[a];
      else if (u[a] !== 0) base[a] = u[a] > 0 ? lo[a] : hi[a];
      else base[a] = v[a] > 0 ? lo[a] : hi[a];
    }
    const du = [0, 0, 0];
    const dv = [0, 0, 0];
    for (let a = 0; a < 3; a++) {
      du[a] = u[a] * (hi[a] - lo[a]);
      dv[a] = v[a] * (hi[a] - lo[a]);
    }
    const p0 = base;
    const p1 = [p0[0] + du[0], p0[1] + du[1], p0[2] + du[2]];
    const p2 = [p1[0] + dv[0], p1[1] + dv[1], p1[2] + dv[2]];
    const p3 = [p0[0] + dv[0], p0[1] + dv[1], p0[2] + dv[2]];
    const pts = [p0, p1, p2, p3];
    // UV dérivés de la position (convention : u le long de l'axe u, v depuis le haut).
    let uvr = opts.uv?.(f) ?? null;
    if (!uvr) {
      const uvs: number[] = [];
      for (const p of [p0, p2]) {
        let uu = 0;
        let vv = 0;
        for (let a = 0; a < 3; a++) {
          if (u[a] !== 0) uu = u[a] > 0 ? p[a] * 16 : 16 - p[a] * 16;
          if (v[a] !== 0) vv = v[a] > 0 ? 16 - p[a] * 16 : p[a] * 16;
        }
        uvs.push(uu, vv);
      }
      uvr = [uvs[0], uvs[3], uvs[2], uvs[1]];
    }
    const [u0, vTop, u1, vBot] = uvr;
    const onBoundary = (n[0] > 0 && x1 === 16) || (n[0] < 0 && x0 === 0) || (n[1] > 0 && y1 === 16) || (n[1] < 0 && y0 === 0) || (n[2] > 0 && z1 === 16) || (n[2] < 0 && z0 === 0);
    out.push({
      p: pts.flat(),
      uv: [u0, vBot, u1, vBot, u1, vTop, u0, vTop],
      tex: t,
      shade: opts.shade === false ? 6 : f,
      cull: !opts.noCull && onBoundary ? f : -1,
      tint: !!opts.tint,
    });
  }
  return out;
}

/** Quad libre double face (plantes, échelles…). */
function plane(pts: number[][], tex: string, uv: number[], tint: boolean, wave = false): Quad[] {
  const front: Quad = { p: pts.flat(), uv, tex, shade: 6, cull: -1, tint, wave };
  const back: Quad = {
    p: [pts[1], pts[0], pts[3], pts[2]].flat(),
    uv: [uv[2], uv[3], uv[0], uv[1], uv[6], uv[7], uv[4], uv[5]],
    tex,
    shade: 6,
    cull: -1,
    tint,
    wave,
  };
  return [front, back];
}

const FULL_UV = [0, 16, 16, 16, 16, 0, 0, 0];

function crossQuads(tex: string, tint: boolean, scale = 1, wave = true): Quad[] {
  const a = 0.5 - 0.45 * scale;
  const b = 0.5 + 0.45 * scale;
  const h = scale;
  return [
    ...plane([[a, 0, a], [b, 0, b], [b, h, b], [a, h, a]], tex, FULL_UV, tint, wave),
    ...plane([[a, 0, b], [b, 0, a], [b, h, a], [a, h, b]], tex, FULL_UV, tint, wave),
  ];
}

function cropQuads(tex: string): Quad[] {
  const out: Quad[] = [];
  const y0 = -1 / 16;
  const y1 = 15 / 16;
  for (const x of [4 / 16, 12 / 16]) out.push(...plane([[x, y0, 0], [x, y0, 1], [x, y1, 1], [x, y1, 0]], tex, FULL_UV, false, true));
  for (const z of [4 / 16, 12 / 16]) out.push(...plane([[0, y0, z], [1, y0, z], [1, y1, z], [0, y1, z]], tex, FULL_UV, false, true));
  return out;
}

/** Rotation autour de l'axe Y (quarts de tour) par rapport au centre du bloc. */
export function rotateY(quads: Quad[], turns: number): Quad[] {
  turns = ((turns % 4) + 4) % 4;
  if (turns === 0) return quads;
  const faceMap = [
    [0, 1, 2, 3, 4, 5],
    [4, 5, 2, 3, 1, 0], // (x,z) -> (-z,x) : +X devient +Z, +Z devient -X
    [1, 0, 2, 3, 5, 4],
    [5, 4, 2, 3, 0, 1],
  ][turns];
  return quads.map((q) => {
    const p = q.p.slice();
    for (let i = 0; i < 4; i++) {
      let x = p[i * 3] - 0.5;
      let z = p[i * 3 + 2] - 0.5;
      for (let t = 0; t < turns; t++) {
        const nx = -z;
        const nz = x;
        x = nx;
        z = nz;
      }
      p[i * 3] = x + 0.5;
      p[i * 3 + 2] = z + 0.5;
    }
    return { ...q, p, shade: q.shade < 6 ? faceMap[q.shade] : 6, cull: q.cull >= 0 ? faceMap[q.cull] : -1 };
  });
}

/** Rotation générique autour d'un axe passant par un point (degrés). */
export function rotateAxis(quads: Quad[], axis: 'x' | 'z', deg: number, cx: number, cy: number, cz: number): Quad[] {
  const r = (deg * Math.PI) / 180;
  const c = Math.cos(r);
  const s = Math.sin(r);
  return quads.map((q) => {
    const p = q.p.slice();
    for (let i = 0; i < 4; i++) {
      const x = p[i * 3] - cx;
      const y = p[i * 3 + 1] - cy;
      const z = p[i * 3 + 2] - cz;
      if (axis === 'x') {
        p[i * 3 + 1] = y * c - z * s + cy;
        p[i * 3 + 2] = y * s + z * c + cz;
      } else {
        p[i * 3] = x * c - y * s + cx;
        p[i * 3 + 1] = x * s + y * c + cy;
      }
    }
    return { ...q, p, cull: -1, shade: q.shade === 2 || q.shade === 3 ? q.shade : 6 };
  });
}

/** Retourne le modèle (renversement vertical) — dalles et escaliers « du haut ». */
function flipY(quads: Quad[]): Quad[] {
  return quads.map((q) => {
    const p = q.p.slice();
    for (let i = 0; i < 4; i++) p[i * 3 + 1] = 1 - p[i * 3 + 1];
    // Inverse l'ordre pour garder l'orientation
    const pr = [p.slice(3, 6), p.slice(0, 3), p.slice(9, 12), p.slice(6, 9)].flat();
    const uv = [q.uv[2], q.uv[3], q.uv[0], q.uv[1], q.uv[6], q.uv[7], q.uv[4], q.uv[5]];
    const swap = (f: number) => (f === 2 ? 3 : f === 3 ? 2 : f);
    return { ...q, p: pr, uv, shade: q.shade < 6 ? swap(q.shade) : 6, cull: q.cull >= 0 ? swap(q.cull) : -1 };
  });
}

function texOf(b: BlockDef, face: number): string {
  const t = b.tex;
  return [t.east, t.west, t.top, t.bottom, t.south, t.north][face];
}

/** Masque de connexions (fences/vitres/fils) : bit0 sud(+Z), bit1 ouest(-X), bit2 nord(-Z), bit3 est(+X). */
export function buildModel(b: BlockDef, meta: number, connections: number): Quad[] {
  const tint = b.tint !== Tint.None;
  const all = (f: number) => texOf(b, f);
  switch (b.shape) {
    case 'cross':
      if (b.key === 'cobweb') return crossQuads(b.tex.top, false, 1, false);
      return crossQuads(b.tex.top, tint, 1, b.key !== 'crystal_cluster');
    case 'crop': {
      const stages = b.key === 'wheat' ? 7 : 3;
      const st = Math.min(stages, b.key === 'wheat' ? meta : Math.floor((meta * 3) / 7));
      return cropQuads(`${b.key}_stage${st}`);
    }
    case 'slab': {
      if (meta === 2) return box(0, 0, 0, 16, 16, 16, all, { tint });
      const q = box(0, 0, 0, 16, 8, 16, all, { tint });
      return meta === 1 ? flipY(q) : q;
    }
    case 'stairs': {
      let q = [...box(0, 0, 0, 16, 8, 16, all), ...box(0, 8, 8, 16, 16, 16, all)];
      if (meta & 4) q = flipY(q);
      return rotateY(q, meta & 3);
    }
    case 'cactus':
      return box(1, 0, 1, 15, 16, 15, all, { uv: (f) => (f < 2 || f > 3 ? [0, 0, 16, 16] : null) }).map((q) => ({ ...q, cull: q.shade === 2 || q.shade === 3 ? q.cull : -1 }));
    case 'layer': {
      const h = Math.min(16, ((meta & 7) + 1) * 2);
      return box(0, 0, 0, 16, h, 16, all);
    }
    case 'carpet':
      return box(0, 0, 0, 16, 1, 16, all, { tint });
    case 'farmland': {
      const top = b.key === 'farmland' && meta > 0 && b.activeTex ? b.activeTex : b.tex.top;
      return box(0, 0, 0, 16, 15, 16, (f) => (f === 2 ? top : all(f)));
    }
    case 'torch': {
      const tex = 'torch';
      const uv = (f: number) => (f === 2 ? [7, 6, 9, 8] : f === 3 ? [7, 14, 9, 16] : [7, 6, 9, 16]);
      let q = box(7, 0, 7, 9, 10, 9, () => tex, { uv, shade: false });
      if (meta >= 1 && meta <= 4) {
        // Torche murale : décalée contre le mur et inclinée.
        const dir = meta - 1; // 0 sud 1 ouest 2 nord 3 est (direction du mur)
        q = q.map((qq) => ({ ...qq, p: qq.p.map((v, i) => (i % 3 === 1 ? v + 3 / 16 : v)) }));
        q = rotateAxis(q, 'x', 22, 0.5, 3 / 16, 0.5);
        q = q.map((qq) => ({ ...qq, p: qq.p.map((v, i) => (i % 3 === 2 ? v + 0.3 : v)) }));
        q = rotateY(q, dir);
      }
      return q.map((qq) => ({ ...qq, cull: -1 }));
    }
    case 'door': {
      const facing = meta & 3;
      const open = (meta & 4) !== 0;
      const top = (meta & 8) !== 0;
      const hingeRight = (meta & 16) !== 0;
      const tex = top ? b.tex.top : b.tex.bottom;
      // Porte fermée : panneau le long du bord sud (z 13..16), puis tournée.
      let q = box(0, 0, 13, 16, 16, 16, (f) => (f === 4 || f === 5 ? tex : tex), {
        uv: (f) => (f === 4 ? [0, 0, 16, 16] : f === 5 ? [16, 0, 0, 16] : f === 2 || f === 3 ? [0, 13, 16, 16] : [13, 0, 16, 16]),
      });
      let turns = facing;
      if (open) turns += hingeRight ? 3 : 1;
      q = rotateY(q, turns);
      return q;
    }
    case 'trapdoor': {
      const facing = meta & 3;
      const open = (meta & 4) !== 0;
      const top = (meta & 8) !== 0;
      const t = 'oak_trapdoor';
      if (!open) return top ? box(0, 13, 0, 16, 16, 16, () => t) : box(0, 0, 0, 16, 3, 16, () => t);
      return rotateY(box(0, 0, 13, 16, 16, 16, () => t), facing);
    }
    case 'ladder': {
      const z = 15.2 / 16;
      return rotateY(plane([[1, 0, z], [0, 0, z], [0, 1, z], [1, 1, z]], b.tex.north, FULL_UV, false), meta & 3);
    }
    case 'vine': {
      const z = 15.2 / 16;
      return rotateY(plane([[1, 0, z], [0, 0, z], [0, 1, z], [1, 1, z]], b.tex.north, FULL_UV, tint, b.key === 'vine'), meta & 3);
    }
    case 'fence': {
      const t = (_f: number) => b.tex.top;
      const q = box(6, 0, 6, 10, 16, 10, t);
      const arms: Array<[number, number, number, number]> = [];
      if (connections & 1) arms.push([7, 10, 9, 16]);
      if (connections & 4) arms.push([7, 0, 9, 6]);
      if (connections & 2) arms.push([0, 7, 6, 9]);
      if (connections & 8) arms.push([10, 7, 16, 9]);
      for (const [ax0, az0, ax1, az1] of arms) {
        q.push(...box(ax0, 6, az0, ax1, 9, az1, t, { noCull: true }));
        q.push(...box(ax0, 12, az0, ax1, 15, az1, t, { noCull: true }));
      }
      return q;
    }
    case 'pane': {
      const t = (_f: number) => b.tex.top;
      const q = box(7, 0, 7, 9, 16, 9, t, { uv: (f) => (f === 2 || f === 3 ? [7, 7, 9, 9] : [7, 0, 9, 16]) });
      if (connections & 1) q.push(...box(7, 0, 9, 9, 16, 16, t, { uv: (f) => (f === 0 || f === 1 ? [0, 0, 7, 16] : f === 2 || f === 3 ? [7, 9, 9, 16] : null) }));
      if (connections & 4) q.push(...box(7, 0, 0, 9, 16, 7, t, { uv: (f) => (f === 0 || f === 1 ? [9, 0, 16, 16] : f === 2 || f === 3 ? [7, 0, 9, 7] : null) }));
      if (connections & 2) q.push(...box(0, 0, 7, 7, 16, 9, t, { uv: (f) => (f === 4 || f === 5 ? [0, 0, 7, 16] : f === 2 || f === 3 ? [0, 7, 7, 9] : null) }));
      if (connections & 8) q.push(...box(9, 0, 7, 16, 16, 9, t, { uv: (f) => (f === 4 || f === 5 ? [9, 0, 16, 16] : f === 2 || f === 3 ? [9, 7, 16, 9] : null) }));
      return q;
    }
    case 'lever': {
      const on = (meta & 8) !== 0;
      const face = meta & 7; // 0 sol, 1 plafond, 2..5 murs (sud, ouest, nord, est)
      let q = box(5, 0, 4, 11, 3, 12, () => 'cobblestone');
      let handle = box(7, 1, 7, 9, 11, 9, () => 'lever_handle', { uv: (f) => (f === 2 ? [7, 6, 9, 8] : [7, 6, 9, 16]), noCull: true });
      handle = rotateAxis(handle, 'x', on ? -35 : 35, 0.5, 1 / 16, 0.5);
      q = [...q, ...handle];
      if (face === 1) q = flipY(q);
      else if (face >= 2) {
        q = rotateAxis(q, 'x', -90, 0.5, 0.5, 0.5);
        q = rotateY(q, face - 2);
      }
      return q.map((qq) => ({ ...qq, cull: -1 }));
    }
    case 'button': {
      const pressed = (meta & 8) !== 0;
      const face = meta & 7;
      let q = box(5, 0, 6, 11, pressed ? 1 : 2, 10, all);
      if (face === 1) q = flipY(q);
      else if (face >= 2) {
        q = rotateAxis(q, 'x', -90, 0.5, 0.5, 0.5);
        q = rotateY(q, face - 2);
      }
      return q.map((qq) => ({ ...qq, cull: -1 }));
    }
    case 'plate':
      return box(1, 0, 1, 15, meta ? 0.5 : 1, 15, all);
    case 'bed': {
      const head = (meta & 8) !== 0;
      const topTex = head ? 'bed_head_top' : b.tex.top;
      const q = box(0, 3, 0, 16, 9, 16, (f) => (f === 2 ? topTex : f === 3 ? 'oak_planks' : b.tex.north), { uv: (f) => (f === 2 ? [0, 0, 16, 16] : null) });
      for (const [lx, lz] of [[0, 0], [13, 0], [0, 13], [13, 13]]) q.push(...box(lx, 0, lz, lx + 3, 3, lz + 3, () => 'oak_planks', { noCull: true }));
      return rotateY(q, meta & 3);
    }
    case 'chest': {
      const front = b.front ?? b.tex.north;
      const q = box(1, 0, 1, 15, 14, 15, (f) => (f === 4 ? front : all(f)), { uv: (f) => (f >= 4 || f <= 1 ? [1, 2, 15, 16] : [1, 1, 15, 15]) });
      return rotateY(q, meta & 3);
    }
    case 'lantern':
      return [
        ...box(5, 0, 5, 11, 7, 11, () => 'lantern', { uv: (f) => (f === 2 || f === 3 ? [0, 9, 6, 15] : [0, 2, 6, 9]), shade: false }),
        ...box(6, 7, 6, 10, 9, 10, () => 'lantern', { uv: (f) => (f === 2 ? [1, 10, 5, 14] : [1, 0, 5, 2]), shade: false }),
      ].map((q) => ({ ...q, cull: -1 }));
    case 'portal': {
      const t = b.tex.top;
      const q = box(0, 0, 6, 16, 16, 10, () => t, { shade: false });
      return meta & 1 ? rotateY(q, 1) : q;
    }
    case 'fire': {
      const t = b.tex.top;
      const out: Quad[] = [...crossQuads(t, false, 1, false)];
      out.push(...plane([[0, 0, 1 / 16], [1, 0, 1 / 16], [1, 1.3, 3 / 16], [0, 1.3, 3 / 16]], t, FULL_UV, false));
      out.push(...plane([[1, 0, 15 / 16], [0, 0, 15 / 16], [0, 1.3, 13 / 16], [1, 1.3, 13 / 16]], t, FULL_UV, false));
      return out;
    }
    case 'wire': {
      const y = 0.25 / 16;
      const t = b.tex.top;
      const out: Quad[] = [];
      const seg = (x0: number, z0: number, x1: number, z1: number) => {
        out.push({ p: [x0, y, z1, x1, y, z1, x1, y, z0, x0, y, z0], uv: [x0 * 16, z1 * 16, x1 * 16, z1 * 16, x1 * 16, z0 * 16, x0 * 16, z0 * 16], tex: t, shade: 6, cull: -1, tint: true });
      };
      seg(5 / 16, 5 / 16, 11 / 16, 11 / 16);
      const c = connections || 0;
      if (c & 1 || c === 0) seg(6 / 16, 11 / 16, 10 / 16, 1);
      if (c & 4 || c === 0) seg(6 / 16, 0, 10 / 16, 5 / 16);
      if (c & 2 || c === 0) seg(0, 6 / 16, 5 / 16, 10 / 16);
      if (c & 8 || c === 0) seg(11 / 16, 6 / 16, 1, 10 / 16);
      return out;
    }
    case 'rail': {
      const shape = meta & 15;
      const y = 1 / 16;
      const on = (meta & 16) !== 0;
      const straightTex = b.key === 'powered_rail' ? (on ? 'powered_rail_on' : 'powered_rail') : 'rail';
      const tex = shape >= 6 ? 'rail_corner' : straightTex;
      let q: Quad[] = [{ p: [0, y, 1, 1, y, 1, 1, y, 0, 0, y, 0], uv: [0, 16, 16, 16, 16, 0, 0, 0], tex, shade: 6, cull: -1, tint: false }];
      if (shape >= 2 && shape <= 5) {
        // Rails montants : quad incliné.
        q = [{ p: [0, y, 1, 1, y, 1, 1, 1 + y, 0, 0, 1 + y, 0], uv: [0, 16, 16, 16, 16, 0, 0, 0], tex, shade: 6, cull: -1, tint: false }];
        const turns = [3, 1, 2, 0][shape - 2]; // monte vers est, ouest, nord, sud
        q = rotateY(q, turns + 2);
      } else if (shape === 1) q = rotateY(q, 1);
      else if (shape >= 6) q = rotateY(q, shape - 6);
      // double face pour la visibilité par en dessous
      return q.flatMap((qq) => [qq, { ...qq, p: [qq.p.slice(3, 6), qq.p.slice(0, 3), qq.p.slice(9, 12), qq.p.slice(6, 9)].flat(), uv: [qq.uv[2], qq.uv[3], qq.uv[0], qq.uv[1], qq.uv[6], qq.uv[7], qq.uv[4], qq.uv[5]] }]);
    }
    case 'lily': {
      const y = 1 / 16;
      const q: Quad[] = [{ p: [0, y, 1, 1, y, 1, 1, y, 0, 0, y, 0], uv: [0, 16, 16, 16, 16, 0, 0, 0], tex: b.tex.top, shade: 2, cull: -1, tint: true }];
      return rotateY(q, meta & 3);
    }
    case 'campfire': {
      const log = b.tex.north;
      const out: Quad[] = [];
      out.push(...box(1, 0, 3, 15, 4, 7, () => log, { noCull: true }));
      out.push(...box(1, 0, 9, 15, 4, 13, () => log, { noCull: true }));
      out.push(...box(3, 3, 1, 7, 7, 15, () => log, { noCull: true }));
      out.push(...box(9, 3, 1, 13, 7, 15, () => log, { noCull: true }));
      out.push(...crossQuads('campfire_fire', false, 0.9, false).map((q) => ({ ...q, p: q.p.map((v, i) => (i % 3 === 1 ? v + 0.3 : v)) })));
      return out;
    }
    default:
      return box(0, 0, 0, 16, 16, 16, all, { tint });
  }
}

/** Boîtes de collision (en 1/16) selon la forme et l'état — utilisées par la physique. */
export function collisionBoxes(b: BlockDef, meta: number, connections = 0): number[][] {
  if (!b.solid) return [];
  switch (b.shape) {
    case 'slab':
      return meta === 2 ? [[0, 0, 0, 16, 16, 16]] : meta === 1 ? [[0, 8, 0, 16, 16, 16]] : [[0, 0, 0, 16, 8, 16]];
    case 'stairs': {
      const up = (meta & 4) !== 0;
      const base = up ? [0, 8, 0, 16, 16, 16] : [0, 0, 0, 16, 8, 16];
      const step = rotBox(up ? [0, 0, 8, 16, 8, 16] : [0, 8, 8, 16, 16, 16], meta & 3);
      return [base, step];
    }
    case 'layer': {
      const h = ((meta & 7) + 1) * 2 - 2;
      return h > 0 ? [[0, 0, 0, 16, h, 16]] : [];
    }
    case 'carpet':
      return [[0, 0, 0, 16, 1, 16]];
    case 'farmland':
      return [[0, 0, 0, 16, 15, 16]];
    case 'cactus':
      return [[1, 0, 1, 15, 15, 15]];
    case 'door': {
      const facing = meta & 3;
      const open = (meta & 4) !== 0;
      const hingeRight = (meta & 16) !== 0;
      const turns = facing + (open ? (hingeRight ? 3 : 1) : 0);
      return [rotBox([0, 0, 13, 16, 16, 16], turns)];
    }
    case 'trapdoor': {
      const open = (meta & 4) !== 0;
      const top = (meta & 8) !== 0;
      if (!open) return [top ? [0, 13, 0, 16, 16, 16] : [0, 0, 0, 16, 3, 16]];
      return [rotBox([0, 0, 13, 16, 16, 16], meta & 3)];
    }
    case 'fence': {
      const out = [[6, 0, 6, 10, 24, 10]];
      if (connections & 1) out.push([6, 0, 10, 10, 24, 16]);
      if (connections & 4) out.push([6, 0, 0, 10, 24, 6]);
      if (connections & 2) out.push([0, 0, 6, 6, 24, 10]);
      if (connections & 8) out.push([10, 0, 6, 16, 24, 10]);
      return out;
    }
    case 'pane': {
      const out = [[7, 0, 7, 9, 16, 9]];
      if (connections & 1) out.push([7, 0, 9, 9, 16, 16]);
      if (connections & 4) out.push([7, 0, 0, 9, 16, 7]);
      if (connections & 2) out.push([0, 0, 7, 7, 16, 9]);
      if (connections & 8) out.push([9, 0, 7, 16, 16, 9]);
      return out;
    }
    case 'bed':
      return [[0, 0, 0, 16, 9, 16]];
    case 'chest':
      return [[1, 0, 1, 15, 14, 15]];
    case 'lantern':
      return [[5, 0, 5, 11, 9, 11]];
    case 'lily':
      return [[0, 0, 0, 16, 1.5, 16]];
    case 'campfire':
      return [[0, 0, 0, 16, 7, 16]];
    case 'ladder':
      return [];
    default:
      return [[0, 0, 0, 16, 16, 16]];
  }
}

/** Boîtes de sélection (contour visé) : non vides même pour les blocs traversables. */
export function selectionBoxes(b: BlockDef, meta: number, connections = 0): number[][] {
  switch (b.shape) {
    case 'cross':
      return [[2, 0, 2, 14, 13, 14]];
    case 'crop':
      return [[0, 0, 0, 16, 3 + Math.min(meta, 7) * 1.7, 16]];
    case 'torch':
      if (meta >= 1 && meta <= 4) return [rotBox([5.5, 3, 11, 10.5, 13, 16], meta - 1)];
      return [[6, 0, 6, 10, 10, 10]];
    case 'ladder':
    case 'vine':
      return [rotBox([0, 0, 13, 16, 16, 16], meta & 3)];
    case 'lever':
    case 'button': {
      const face = meta & 7;
      if (face === 0) return [[4, 0, 4, 12, 6, 12]];
      if (face === 1) return [[4, 10, 4, 12, 16, 12]];
      return [rotBox([4, 4, 12, 12, 12, 16], face - 2)];
    }
    case 'plate':
      return [[1, 0, 1, 15, 1, 15]];
    case 'wire':
    case 'rail':
      return [[0, 0, 0, 16, 2, 16]];
    case 'portal':
      return meta & 1 ? [[6, 0, 0, 10, 16, 16]] : [[0, 0, 6, 16, 16, 10]];
    case 'fire':
      return [[0, 0, 0, 16, 1, 16]];
    case 'liquid':
      return [[0, 0, 0, 16, 14, 16]];
    case 'none':
      return [];
    default: {
      const c = collisionBoxes({ ...b, solid: true }, meta, connections);
      return c.length ? c : [[0, 0, 0, 16, 16, 16]];
    }
  }
}

/** Tourne une boîte autour de Y (quarts de tour, sens identique à rotateY). */
export function rotBox(bx: number[], turns: number): number[] {
  let [x0, y0, z0, x1, y1, z1] = bx;
  turns = ((turns % 4) + 4) % 4;
  for (let t = 0; t < turns; t++) {
    // (x,z) -> (-z, x) autour du centre 8,8
    const nx0 = 16 - z1;
    const nx1 = 16 - z0;
    const nz0 = x0;
    const nz1 = x1;
    x0 = nx0;
    x1 = nx1;
    z0 = nz0;
    z1 = nz1;
  }
  return [x0, y0, z0, x1, y1, z1];
}

/** Formes dont le modèle dépend des voisins (masque de connexions). */
export function needsConnections(shape: string): boolean {
  return shape === 'fence' || shape === 'pane' || shape === 'wire';
}

/** Cache de modèles : clé = id | meta << 10 | connexions << 16. */
const cache = new Map<number, Quad[]>();
export function getModel(id: number, meta: number, connections: number): Quad[] {
  const key = id | (meta << 10) | (connections << 16);
  let m = cache.get(key);
  if (!m) {
    m = buildModel(BLOCKS[id], meta, connections);
    cache.set(key, m);
  }
  return m;
}
