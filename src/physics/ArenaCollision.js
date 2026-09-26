import { ARENA } from '../core/Config.js';

// The arena is described as a set of finite, one-sided rectangles facing the playable volume.
// Sphere-vs-rectangle uses the closest point on the rectangle, so rectangle edges behave like
// rounded edges (goal posts, crossbar) for free. Rectangles meeting at a concave junction are
// extended past it (MARGIN) so balls never catch on their edges; convex edges stay exact.
// Floor (y=0) and ceiling (y=height) are infinite planes handled analytically.

const MARGIN = 6;
const S2 = Math.SQRT1_2;

function rect(cx, cy, cz, nx, ny, nz, ux, uy, uz, hu, hv) {
  // v = n x u
  const vx = ny * uz - nz * uy;
  const vy = nz * ux - nx * uz;
  const vz = nx * uy - ny * ux;
  return { cx, cy, cz, nx, ny, nz, ux, uy, uz, vx, vy, vz, hu, hv };
}

export function buildArenaRects(a = ARENA) {
  const { halfWidth: HW, halfLength: HL, height: H, corner: C, goalHalfWidth: GW, goalHeight: GH, goalDepth: GD } = a;
  const M = MARGIN;
  const rects = [];
  const hy = H / 2;
  const hv = H / 2 + M;

  // Side walls
  for (const sx of [-1, 1]) {
    rects.push(rect(sx * HW, hy, 0, -sx, 0, 0, 0, 0, 1, HL - C + M, hv));
  }
  // Corner chamfers
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      rects.push(rect(sx * (HW - C / 2), hy, sz * (HL - C / 2), -sx * S2, 0, -sz * S2, -sx * S2, 0, sz * S2, (C * Math.SQRT2) / 2 + M, hv));
    }
  }
  for (const sz of [-1, 1]) {
    const z = sz * HL;
    // End wall, both sides of the goal (inner edge = goal post, exact)
    const a1 = GW;
    const a2 = HW - C + M;
    for (const sx of [-1, 1]) {
      rects.push(rect(sx * (a1 + a2) / 2, hy, z, 0, 0, -sz, 1, 0, 0, (a2 - a1) / 2, hv));
    }
    // End wall above the goal (bottom edge = crossbar)
    const topH = (H + M - GH) / 2;
    rects.push(rect(0, GH + topH, z, 0, 0, -sz, 1, 0, 0, GW, topH));

    // Goal box interior
    const zBack = sz * (HL + GD);
    rects.push(rect(0, GH / 2, zBack, 0, 0, -sz, 1, 0, 0, GW + M, GH / 2 + M));
    const zMid = sz * (HL + (GD + M) / 2);
    for (const sx of [-1, 1]) {
      rects.push(rect(sx * GW, (GH - M) / 2, zMid, -sx, 0, 0, 0, 0, 1, (GD + M) / 2, (GH + M) / 2));
    }
    rects.push(rect(0, GH, zMid, 0, -1, 0, 1, 0, 0, GW, (GD + M) / 2));
  }
  return rects;
}

export class ArenaCollision {
  constructor(arena = ARENA) {
    this.arena = arena;
    this.rects = buildArenaRects(arena);
    this._n = { x: 0, y: 0, z: 0 };
  }

  // Resolves a sphere against the arena. `p` ({x,y,z}) is moved out of every contact in sequence;
  // `onContact(nx, ny, nz, pen)` lets the caller react (velocity response, events).
  resolveSphere(p, r, onContact, withFloor = true) {
    const H = this.arena.height;
    if (withFloor && p.y < r) {
      const pen = r - p.y;
      p.y = r;
      onContact && onContact(0, 1, 0, pen);
    }
    if (p.y > H - r) {
      const pen = p.y - (H - r);
      p.y = H - r;
      onContact && onContact(0, -1, 0, pen);
    }
    const rects = this.rects;
    for (let i = 0; i < rects.length; i++) {
      const R = rects[i];
      const dx = p.x - R.cx;
      const dy = p.y - R.cy;
      const dz = p.z - R.cz;
      const dn = dx * R.nx + dy * R.ny + dz * R.nz;
      if (dn > r || dn < -r * 2.5) continue;
      const du = dx * R.ux + dy * R.uy + dz * R.uz;
      const dv = dx * R.vx + dy * R.vy + dz * R.vz;
      const inU = du >= -R.hu && du <= R.hu;
      const inV = dv >= -R.hv && dv <= R.hv;
      let nx, ny, nz, pen;
      if (dn < 0) {
        if (!inU || !inV) continue; // behind the plane but outside the rectangle
        nx = R.nx; ny = R.ny; nz = R.nz;
        pen = r - dn;
      } else if (inU && inV) {
        if (dn >= r) continue;
        nx = R.nx; ny = R.ny; nz = R.nz;
        pen = r - dn;
      } else {
        const cu = du < -R.hu ? -R.hu : du > R.hu ? R.hu : du;
        const cv = dv < -R.hv ? -R.hv : dv > R.hv ? R.hv : dv;
        const qx = R.cx + R.ux * cu + R.vx * cv;
        const qy = R.cy + R.uy * cu + R.vy * cv;
        const qz = R.cz + R.uz * cu + R.vz * cv;
        const ex = p.x - qx;
        const ey = p.y - qy;
        const ez = p.z - qz;
        const d2 = ex * ex + ey * ey + ez * ez;
        if (d2 >= r * r) continue;
        const d = Math.sqrt(d2);
        if (d < 1e-6) {
          nx = R.nx; ny = R.ny; nz = R.nz;
        } else {
          nx = ex / d; ny = ey / d; nz = ez / d;
        }
        pen = r - d;
      }
      p.x += nx * pen;
      p.y += ny * pen;
      p.z += nz * pen;
      onContact && onContact(nx, ny, nz, pen);
    }
  }

  // Keeps a point (e.g. camera) inside the arena with a small radius.
  clampPoint(p, r = 0.6) {
    this.resolveSphere(p, r, null, true);
    // Safety net far outside (should not happen)
    const a = this.arena;
    const lim = a.halfLength + a.goalDepth - r;
    if (p.z > lim) p.z = lim;
    if (p.z < -lim) p.z = -lim;
    if (p.x > a.halfWidth - r) p.x = a.halfWidth - r;
    if (p.x < -a.halfWidth + r) p.x = -a.halfWidth + r;
  }
}
