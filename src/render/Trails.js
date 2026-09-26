import * as THREE from 'three';

const _rc = new THREE.Color();

// Ribbon left behind a car while boosting. Ring buffer of cross-sections, rebuilt every frame.
export class Trail {
  constructor(segments = 20, width = 0.9) {
    this.n = segments;
    this.width = width;
    this.points = [];
    this.timer = 0;
    const verts = segments * 2;
    this.positions = new Float32Array(verts * 3);
    this.colors = new Float32Array(verts * 4);
    const idx = [];
    for (let i = 0; i < segments - 1; i++) {
      const a = i * 2, b = a + 1, c = a + 2, d = a + 3;
      idx.push(a, b, c, b, d, c);
    }
    const g = new THREE.BufferGeometry();
    this.aPos = new THREE.BufferAttribute(this.positions, 3).setUsage(THREE.DynamicDrawUsage);
    this.aCol = new THREE.BufferAttribute(this.colors, 4).setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', this.aPos);
    g.setAttribute('color', this.aCol);
    g.setIndex(idx);
    g.setDrawRange(0, 0);
    this.geometry = g;
    this.material = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      vertexShader: 'attribute vec4 color; varying vec4 vC; void main(){ vC = color; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'varying vec4 vC; void main(){ gl_FragColor = vec4(vC.rgb * vC.a, vC.a);\n#include <colorspace_fragment>\n}',
    });
    this.mesh = new THREE.Mesh(g, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 4;
    this.color = new THREE.Color();
    this.color2 = null;
    this.rainbow = false;
    this.flicker = false;
    this.time = 0;
  }

  configure(item, teamColor) {
    this.enabled = !!item && item.id !== 'trl_none';
    if (!this.enabled) return;
    this.rainbow = !!item.rainbow;
    this.flicker = !!item.flicker;
    this.color.set(item.team ? teamColor : item.color || 0xffffff);
    this.color2 = item.color2 ? new THREE.Color(item.color2) : null;
  }

  update(dt, anchor, right, active) {
    this.time += dt;
    for (const p of this.points) p.age += dt;
    this.timer -= dt;
    if (this.enabled && active && this.timer <= 0) {
      this.timer = 1 / 40;
      this.points.unshift({ x: anchor.x, y: anchor.y, z: anchor.z, rx: right.x, ry: right.y, rz: right.z, age: 0 });
      if (this.points.length > this.n) this.points.pop();
    }
    while (this.points.length && this.points[this.points.length - 1].age > 0.6) this.points.pop();
    const n = this.points.length;
    if (n < 2) {
      this.geometry.setDrawRange(0, 0);
      return;
    }
    const c = this.color;
    for (let i = 0; i < n; i++) {
      const p = this.points[i];
      const t = i / (this.n - 1);
      const w = this.width * (1 - t * 0.7);
      const k = i * 6;
      this.positions[k] = p.x - p.rx * w; this.positions[k + 1] = p.y - p.ry * w; this.positions[k + 2] = p.z - p.rz * w;
      this.positions[k + 3] = p.x + p.rx * w; this.positions[k + 4] = p.y + p.ry * w; this.positions[k + 5] = p.z + p.rz * w;
      let r = c.r, g = c.g, b = c.b;
      if (this.rainbow) {
        _rc.setHSL((this.time * 0.6 + t) % 1, 1, 0.55);
        r = _rc.r; g = _rc.g; b = _rc.b;
      } else if (this.color2) {
        r = c.r + (this.color2.r - c.r) * t; g = c.g + (this.color2.g - c.g) * t; b = c.b + (this.color2.b - c.b) * t;
      }
      let a = (1 - p.age / 0.6) * (1 - t) * 0.85;
      if (this.flicker) a *= 0.5 + Math.random() * 0.5;
      const q = i * 8;
      this.colors[q] = r; this.colors[q + 1] = g; this.colors[q + 2] = b; this.colors[q + 3] = a;
      this.colors[q + 4] = r; this.colors[q + 5] = g; this.colors[q + 6] = b; this.colors[q + 7] = a;
    }
    this.geometry.setDrawRange(0, (n - 1) * 6);
    this.aPos.needsUpdate = true;
    this.aCol.needsUpdate = true;
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
  }
}
