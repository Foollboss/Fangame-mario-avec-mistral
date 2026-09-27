import * as THREE from 'three';
import { ARENA } from '../core/Config.js';

// Geometry of the arena shell, matching ArenaCollision exactly: the cross-section profile
// (floor → curved ramp → wall → curved ramp → ceiling) swept along the rounded perimeter.
const { halfWidth: HW, halfLength: HL, height: H, cornerRadius: RC, rampRadius: RV, goalHalfWidth: GW, goalHeight: GH } = ARENA;

// Perimeter samples (counter-clockwise from +X), with outward normal and arc length s.
// Every sample on an end wall between the posts is flagged `mouth`.
export function perimeter(cornerSteps = 14, step = 6) {
  const pts = [];
  const push = (x, z, nx, nz, end = false) => {
    const last = pts[pts.length - 1];
    if (last && Math.abs(last.x - x) < 1e-6 && Math.abs(last.z - z) < 1e-6) return;
    pts.push({ x, z, nx, nz, mouth: end && Math.abs(x) <= GW + 1e-6 });
  };
  const line = (x0, z0, x1, z1, nx, nz, breaks = []) => {
    const L = Math.hypot(x1 - x0, z1 - z0);
    const ts = new Set();
    const n = Math.max(1, Math.ceil(L / step));
    for (let i = 0; i <= n; i++) ts.add(i / n);
    for (const bx of breaks) {
      const t = (bx - x0) / (x1 - x0);
      if (t > 0 && t < 1) ts.add(t);
    }
    for (const t of [...ts].sort((a, b) => a - b)) push(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, nx, nz, breaks.length > 0);
  };
  const arc = (cx, cz, a0) => {
    for (let i = 0; i <= cornerSteps; i++) {
      const a = a0 + (i / cornerSteps) * (Math.PI / 2);
      push(cx + Math.cos(a) * RC, cz + Math.sin(a) * RC, Math.cos(a), Math.sin(a));
    }
  };
  const ix = HW - RC, iz = HL - RC;
  const goalBreaks = [-GW, GW];
  line(HW, 0, HW, iz, 1, 0);
  arc(ix, iz, 0);
  line(ix, HL, -ix, HL, 0, 1, goalBreaks);
  arc(-ix, iz, Math.PI / 2);
  line(-HW, iz, -HW, -iz, -1, 0);
  arc(-ix, -iz, Math.PI);
  line(-ix, -HL, ix, -HL, 0, -1, goalBreaks);
  arc(ix, -iz, (3 * Math.PI) / 2);
  line(HW, -iz, HW, 0, 1, 0);
  let s = 0;
  pts.forEach((p, i) => {
    if (i > 0) s += Math.hypot(p.x - pts[i - 1].x, p.z - pts[i - 1].z);
    p.s = s;
  });
  return pts;
}

// Cross-section profiles (d = inset from the wall towards the centre).
export function rampProfile(steps = 10) {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * (Math.PI / 2);
    out.push({ d: RV - RV * Math.sin(t), y: RV - RV * Math.cos(t), t: RV * t });
  }
  return out;
}

export function wallProfile(steps = 10) {
  const out = [{ d: 0, y: RV, t: RV }, { d: 0, y: GH, t: GH }, { d: 0, y: H - RV, t: H - RV }];
  for (let i = 1; i <= steps; i++) {
    const a = (i / steps) * (Math.PI / 2);
    out.push({ d: RV - RV * Math.cos(a), y: H - RV + RV * Math.sin(a), t: H - RV + RV * a });
  }
  return out;
}

// Sweeps a profile along the perimeter. skip(segmentIndex, profileIndex) removes a quad.
export function sweep(pts, profile, { uvScale = 8, skip = null } = {}) {
  const pos = [], uv = [], idx = [];
  const P = profile.length;
  for (const p of pts) {
    for (const q of profile) {
      pos.push(p.x - p.nx * q.d, q.y, p.z - p.nz * q.d);
      uv.push(p.s / uvScale, q.t / uvScale);
    }
  }
  for (let i = 0; i < pts.length - 1; i++) {
    for (let j = 0; j < P - 1; j++) {
      if (skip && skip(i, j)) continue;
      const a = i * P + j, b = (i + 1) * P + j, c = (i + 1) * P + j + 1, d = i * P + j + 1;
      idx.push(a, d, b, b, d, c);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Flat band following the perimeter: horizontal (on the floor) or vertical (on the wall).
export function band(pts, { d0, d1, y0, y1, uvScale = 8, skip = null, colors = null }) {
  const pos = [], uv = [], col = [], idx = [];
  pts.forEach((p) => {
    pos.push(p.x - p.nx * d0, y0, p.z - p.nz * d0, p.x - p.nx * d1, y1, p.z - p.nz * d1);
    uv.push(p.s / uvScale, 0, p.s / uvScale, 1);
    if (colors) {
      const c = colors(p);
      col.push(c.r, c.g, c.b, c.r, c.g, c.b);
    }
  });
  for (let i = 0; i < pts.length - 1; i++) {
    if (skip && skip(i)) continue;
    const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
    idx.push(a, c, b, b, c, d);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  if (colors) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// Side faces closing the ramps next to each goal post (quarter-disc fans).
export function rampCaps(profile) {
  const pos = [], idx = [];
  for (const sz of [-1, 1]) {
    for (const sx of [-1, 1]) {
      const base = pos.length / 3;
      pos.push(sx * GW, 0, sz * HL);
      for (const q of profile) pos.push(sx * GW, q.y, sz * (HL - q.d));
      for (let j = 0; j < profile.length - 1; j++) idx.push(base, base + 1 + j, base + 2 + j);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

// The drivable ceiling (flat part inside the upper ramps).
export function ceilingGeometry(uvScale = 12) {
  const hw = HW - RV, hl = HL - RV, r = RC - RV;
  const s = new THREE.Shape();
  s.moveTo(-hw + r, -hl);
  s.lineTo(hw - r, -hl);
  s.absarc(hw - r, -hl + r, r, -Math.PI / 2, 0);
  s.lineTo(hw, hl - r);
  s.absarc(hw - r, hl - r, r, 0, Math.PI / 2);
  s.lineTo(-hw + r, hl);
  s.absarc(-hw + r, hl - r, r, Math.PI / 2, Math.PI);
  s.lineTo(-hw, -hl + r);
  s.absarc(-hw + r, -hl + r, r, Math.PI, Math.PI * 1.5);
  const g = new THREE.ShapeGeometry(s, 10);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / uvScale, uv.getY(i) / uvScale);
  g.rotateX(Math.PI / 2);
  g.translate(0, H, 0);
  return g;
}
