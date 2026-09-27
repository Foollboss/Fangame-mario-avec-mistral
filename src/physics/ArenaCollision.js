import { ARENA } from '../core/Config.js';

// The arena is one smooth signed distance field (negative inside the playable volume):
// a box with rounded vertical corners whose floor and ceiling curve into the walls (the
// quarter-pipes cars drive on), united with the two goal boxes. The smooth union rounds the
// goal posts and crossbar; the floor stays perfectly flat, goals included.
const smin = (a, b, k) => {
  const h = Math.max(k - Math.abs(a - b), 0) / k;
  return Math.min(a, b) - h * h * k * 0.25;
};

export class ArenaCollision {
  constructor(arena = ARENA) {
    this.arena = arena;
    this.HW = arena.halfWidth;
    this.HL = arena.halfLength;
    this.H = arena.height;
    this.Rc = arena.cornerRadius;
    this.Rv = arena.rampRadius;
    this.GW = arena.goalHalfWidth;
    this.GH = arena.goalHeight;
    const GD = arena.goalDepth;
    const M = this.Rv + 4; // the goal volume reaches into the pitch past the ramp
    this.gcz = this.HL + (GD - M) / 2;
    this.ghz = (GD + M) / 2;
    this.gcy = (this.GH - 2) / 2;
    this.ghy = (this.GH + 2) / 2;
    this.k = 2.2;
    this.g = { x: 0, y: 1, z: 0 };
  }

  sd(x, y, z) {
    const { HW, HL, H, Rc, Rv } = this;
    const qx = Math.abs(x) - HW + Rc;
    const qz = Math.abs(z) - HL + Rc;
    const d2 = Math.hypot(Math.max(qx, 0), Math.max(qz, 0)) + Math.min(Math.max(qx, qz), 0) - Rc;
    const wx = d2 + Rv;
    const wy = Math.abs(y - H / 2) - H / 2 + Rv;
    const shell = Math.hypot(Math.max(wx, 0), Math.max(wy, 0)) + Math.min(Math.max(wx, wy), 0) - Rv;
    const bx = Math.abs(x) - this.GW;
    const by = Math.abs(y - this.gcy) - this.ghy;
    const bz = Math.abs(Math.abs(z) - this.gcz) - this.ghz;
    const goal = Math.hypot(Math.max(bx, 0), Math.max(by, 0), Math.max(bz, 0)) + Math.min(Math.max(bx, by, bz), 0);
    return Math.max(smin(shell, goal, this.k), -y);
  }

  // Outward unit gradient of the field (tetrahedral finite differences) into this.g.
  gradient(x, y, z) {
    const h = 0.02;
    const a = this.sd(x + h, y - h, z - h);
    const b = this.sd(x - h, y - h, z + h);
    const c = this.sd(x - h, y + h, z - h);
    const d = this.sd(x + h, y + h, z + h);
    let nx = a - b - c + d, ny = -a - b + c + d, nz = -a + b - c + d;
    const l = Math.hypot(nx, ny, nz) || 1;
    const g = this.g;
    g.x = nx / l; g.y = ny / l; g.z = nz / l;
    return g;
  }

  // Distance to the nearest surface and its inward normal (towards the playable volume).
  surface(p, outN) {
    const depth = -this.sd(p.x, p.y, p.z);
    const g = this.gradient(p.x, p.y, p.z);
    outN.set(-g.x, -g.y, -g.z);
    return depth;
  }

  // Cars can drive on the floor, ramps, walls and ceiling, but not on the inside of the goals.
  drivable(p, n) {
    if (n.y > 0.7) return true;
    return !(Math.abs(p.z) > this.HL - 1 && Math.abs(p.x) < this.GW + 1.5 && p.y < this.GH + 2);
  }

  // Pushes a sphere out of the boundary. onContact(nx, ny, nz, pen) gets the inward normal.
  resolveSphere(p, r, onContact) {
    for (let it = 0; it < 3; it++) {
      const s = this.sd(p.x, p.y, p.z);
      if (s <= -r) return;
      const g = this.gradient(p.x, p.y, p.z);
      const pen = s + r;
      p.x -= g.x * pen;
      p.y -= g.y * pen;
      p.z -= g.z * pen;
      onContact && onContact(-g.x, -g.y, -g.z, pen);
    }
  }

  clampPoint(p, r = 0.6) {
    this.resolveSphere(p, r, null);
  }
}
