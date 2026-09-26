import * as THREE from 'three';

// Ruban lumineux derrière la voiture (cosmétique « Traînée »).
export class TrailRenderer {
  constructor(scene, color, rainbow = false, points = 26) {
    this.n = points;
    this.rainbow = rainbow;
    this.pts = Array.from({ length: points }, () => new THREE.Vector3());
    this.sides = Array.from({ length: points }, () => new THREE.Vector3());
    this.strength = new Float32Array(points);
    const pos = new Float32Array(points * 2 * 3);
    const col = new Float32Array(points * 2 * 4);
    const idx = [];
    for (let i = 0; i < points - 1; i++) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 2, a + 3, a + 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
    g.setAttribute('color', new THREE.BufferAttribute(col, 4).setUsage(THREE.DynamicDrawUsage));
    g.setIndex(idx);
    this.geo = g;
    this.color = new THREE.Color(color || '#ffffff');
    this.mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({
      vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
    }));
    this.mesh.frustumCulled = false;
    this.acc = 0;
    this.initialized = false;
    this.time = 0;
    scene.add(this.mesh);
  }

  update(dt, pos, side, intensity) {
    this.time += dt;
    if (!this.initialized) {
      for (const p of this.pts) p.copy(pos);
      for (const s of this.sides) s.copy(side);
      this.initialized = true;
    }
    this.acc += dt;
    if (this.acc > 1 / 40) {
      this.acc = 0;
      for (let i = this.n - 1; i > 0; i--) {
        this.pts[i].copy(this.pts[i - 1]); this.sides[i].copy(this.sides[i - 1]); this.strength[i] = this.strength[i - 1];
      }
    }
    this.pts[0].copy(pos); this.sides[0].copy(side); this.strength[0] = intensity;
    const p = this.geo.attributes.position.array, c = this.geo.attributes.color.array;
    const tmp = new THREE.Color();
    for (let i = 0; i < this.n; i++) {
      const f = 1 - i / (this.n - 1);
      const w = 0.35 * f;
      const P = this.pts[i], S = this.sides[i];
      p.set([P.x + S.x * w, P.y + S.y * w, P.z + S.z * w, P.x - S.x * w, P.y - S.y * w, P.z - S.z * w], i * 6);
      const col = this.rainbow ? tmp.setHSL((this.time * 0.5 + i * 0.03) % 1, 1, 0.6) : this.color;
      const a = f * this.strength[i] * 0.9;
      c.set([col.r, col.g, col.b, a, col.r, col.g, col.b, a], i * 8);
    }
    this.geo.attributes.position.needsUpdate = true;
    this.geo.attributes.color.needsUpdate = true;
  }

  dispose(scene) { scene.remove(this.mesh); this.geo.dispose(); this.mesh.material.dispose(); }
}
