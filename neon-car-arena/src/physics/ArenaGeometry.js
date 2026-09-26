import { Vector3 } from 'three';

// Arène décrite par une fonction de distance signée (positive à l'intérieur du volume jouable).
// Octogone (coins coupés) + arêtes verticales arrondies + quarts de lune sol/mur et plafond/mur,
// plus deux volumes de but. La même fonction sert aux collisions, aux rayons de suspension
// (conduite sur les murs), à la caméra et au rendu, ce qui garantit leur cohérence.

function roundMin(a, b, r) {
  if (a < r && b < r) {
    const da = r - a, db = r - b;
    return r - Math.sqrt(da * da + db * db);
  }
  return a < b ? a : b;
}

function segDist(px, pz, ax, az, bx, bz) {
  const abx = bx - ax, abz = bz - az;
  let t = ((px - ax) * abx + (pz - az) * abz) / (abx * abx + abz * abz);
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const dx = px - (ax + abx * t), dz = pz - (az + abz * t);
  return Math.sqrt(dx * dx + dz * dz);
}

export class ArenaGeometry {
  constructor(dims) {
    this.d = dims;
    const { W, L, CHAMFER, CORNER_R } = dims;
    // Polygone rétréci de CORNER_R (dans le premier quadrant), arrondi ensuite par décalage.
    this.w = W - CORNER_R;
    this.l = L - CORNER_R;
    this.s = (W + L - CHAMFER) - CORNER_R * Math.SQRT2; // x + z <= s sur le chanfrein
    this.p1 = [this.w, this.s - this.w];
    this.p2 = [this.s - this.l, this.l];
    this._n = new Vector3();
  }

  // Distance signée 2D au contour arrondi (positive à l'intérieur).
  distXZ(x, z) {
    const ax = Math.abs(x), az = Math.abs(z);
    const { w, l, s, p1, p2 } = this;
    const inside = ax <= w && az <= l && ax + az <= s;
    let d = segDist(ax, az, w, 0, p1[0], p1[1]);
    d = Math.min(d, segDist(ax, az, 0, l, p2[0], p2[1]));
    d = Math.min(d, segDist(ax, az, p1[0], p1[1], p2[0], p2[1]));
    return inside ? this.d.CORNER_R + d : this.d.CORNER_R - d;
  }

  distance(x, y, z) {
    const D = this.d;
    let f = roundMin(this.distXZ(x, z), y, D.FLOOR_R);
    f = roundMin(f, D.H - y, D.CEIL_R);
    // Volumes des buts (union).
    const az = Math.abs(z);
    if (az > D.L - 40) {
      const g = Math.min(D.GOAL_W - Math.abs(x), y, D.GOAL_H - y, D.L + D.GOAL_D - az, az - (D.L - 40));
      if (g > f) f = g;
    }
    return f;
  }

  distanceV(p) { return this.distance(p.x, p.y, p.z); }

  normal(x, y, z, out = new Vector3()) {
    const e = 0.03;
    out.set(
      this.distance(x + e, y, z) - this.distance(x - e, y, z),
      this.distance(x, y + e, z) - this.distance(x, y - e, z),
      this.distance(x, y, z + e) - this.distance(x, y, z - e),
    );
    const len = out.length();
    if (len < 1e-9) return out.set(0, 1, 0);
    return out.multiplyScalar(1 / len);
  }

  // Lancer de rayon par « sphere tracing ». Retourne la distance de l'impact ou -1.
  raycast(o, dir, maxDist) {
    let t = 0;
    for (let i = 0; i < 32; i++) {
      const d = this.distance(o.x + dir.x * t, o.y + dir.y * t, o.z + dir.z * t);
      if (d < 0.004) return t;
      t += Math.max(d * 0.9, 0.005);
      if (t > maxDist) return -1;
    }
    return -1;
  }

  // +1 si la balle est entièrement entrée dans le but +Z, -1 pour le but -Z, 0 sinon.
  goalSide(ballPos, radius) {
    const D = this.d;
    if (Math.abs(ballPos.x) > D.GOAL_W || ballPos.y > D.GOAL_H) return 0;
    if (ballPos.z > D.L + radius) return 1;
    if (ballPos.z < -D.L - radius) return -1;
    return 0;
  }

  // Contour arrondi échantillonné (utilisé par le rendu). Points dans le sens trigonométrique vu du dessus,
  // avec la normale sortante ; on insère des points exacts à x = ±GOAL_W sur les murs du fond.
  outline(stepArc = 5, stepLine = 4) {
    const { W, L, CHAMFER, CORNER_R, GOAL_W } = this.d;
    const r = CORNER_R;
    const w = this.w, l = this.l;
    // Sommets du polygone rétréci complet (8 sommets), parcourus dans le sens trigonométrique (plan XZ)
    const c = W + L - CHAMFER - r * Math.SQRT2;
    const verts = [
      [w, -(c - w)], [w, c - w], [c - l, l], [-(c - l), l],
      [-w, c - w], [-w, -(c - w)], [-(c - l), -l], [c - l, -l],
    ];
    const pts = [];
    const n = verts.length;
    for (let i = 0; i < n; i++) {
      const a = verts[i], b = verts[(i + 1) % n], cN = verts[(i + 2) % n];
      // Segment a->b décalé de r selon la normale sortante
      const ex = b[0] - a[0], ez = b[1] - a[1];
      const len = Math.hypot(ex, ez);
      const nx = ez / len, nz = -ex / len; // normale sortante pour un parcours dans ce sens
      const sa = [a[0] + nx * r, a[1] + nz * r], sb = [b[0] + nx * r, b[1] + nz * r];
      const segs = Math.max(1, Math.ceil(len / stepLine));
      const cuts = [];
      for (let k = 0; k < segs; k++) cuts.push(k / segs);
      // points exacts aux poteaux sur les murs du fond (normale ±Z)
      if (Math.abs(nz) > 0.99) {
        for (const gx of [-GOAL_W, GOAL_W]) {
          const t = (gx - sa[0]) / (sb[0] - sa[0]);
          if (t > 0 && t < 1) cuts.push(t);
        }
        cuts.sort((p, q) => p - q);
      }
      for (const t of cuts) pts.push({ x: sa[0] + (sb[0] - sa[0]) * t, z: sa[1] + (sb[1] - sa[1]) * t, nx, nz });
      // Arc autour du sommet b
      const e2x = cN[0] - b[0], e2z = cN[1] - b[1];
      const l2 = Math.hypot(e2x, e2z);
      const n2x = e2z / l2, n2z = -e2x / l2;
      const a0 = Math.atan2(nz, nx);
      let a1 = Math.atan2(n2z, n2x);
      while (a1 < a0) a1 += Math.PI * 2;
      while (a1 > a0 + Math.PI) a1 -= Math.PI * 2;
      const arcSteps = Math.max(2, Math.ceil(Math.abs(a1 - a0) * r / stepArc) + 1);
      for (let k = 0; k < arcSteps; k++) {
        const ang = a0 + (a1 - a0) * (k / arcSteps);
        const cx = Math.cos(ang), cz = Math.sin(ang);
        pts.push({ x: b[0] + cx * r, z: b[1] + cz * r, nx: cx, nz: cz });
      }
    }
    return pts;
  }
}
