import * as THREE from 'three';
import { radialTexture } from './Textures.js';

// Pooled GPU points, simulated on the CPU. One draw call per system.
export class ParticleSystem {
  constructor(max, { additive = true, texture = null } = {}) {
    this.max = max;
    this.count = 0;
    this.pos = new Float32Array(max * 3);
    this.col = new Float32Array(max * 3);
    this.size = new Float32Array(max);
    this.alpha = new Float32Array(max);
    this.vel = new Float32Array(max * 3);
    this.life = new Float32Array(max);
    this.maxLife = new Float32Array(max);
    this.drag = new Float32Array(max);
    this.grav = new Float32Array(max);
    this.grow = new Float32Array(max);
    this.a0 = new Float32Array(max);
    const g = new THREE.BufferGeometry();
    this.aPos = new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage);
    this.aCol = new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage);
    this.aSize = new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage);
    this.aAlpha = new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', this.aPos);
    g.setAttribute('color', this.aCol);
    g.setAttribute('size', this.aSize);
    g.setAttribute('alpha', this.aAlpha);
    g.setDrawRange(0, 0);
    this.geometry = g;
    this.texture = texture || radialTexture(64, [[0, 'rgba(255,255,255,1)'], [0.35, 'rgba(255,255,255,0.7)'], [1, 'rgba(255,255,255,0)']]);
    this.material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: { map: { value: this.texture }, uScale: { value: 400 } },
      vertexShader: `attribute float size; attribute float alpha; attribute vec3 color;
        uniform float uScale; varying vec3 vColor; varying float vAlpha;
        void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = min(size * uScale / max(0.5, -mv.z), 110.0); vColor = color;
          vAlpha = alpha * smoothstep(3.5, 11.0, -mv.z); }`,
      fragmentShader: `uniform sampler2D map; varying vec3 vColor; varying float vAlpha;
        void main(){ vec4 t = texture2D(map, gl_PointCoord); gl_FragColor = vec4(vColor * t.rgb, t.a * vAlpha);
        #include <colorspace_fragment>
      }`,
    });
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
  }

  setScale(viewportHeight, fovDeg) {
    this.material.uniforms.uScale.value = viewportHeight / (2 * Math.tan((fovDeg * Math.PI) / 360));
  }

  setBudget(max) {
    this.budget = Math.min(max, this.max);
  }

  emit(x, y, z, vx, vy, vz, color, size, life, drag = 0, grav = 0, grow = 0, alpha = 1) {
    const cap = this.budget || this.max;
    if (this.count >= cap) return;
    const i = this.count++;
    const k = i * 3;
    this.pos[k] = x; this.pos[k + 1] = y; this.pos[k + 2] = z;
    this.vel[k] = vx; this.vel[k + 1] = vy; this.vel[k + 2] = vz;
    this.col[k] = color.r; this.col[k + 1] = color.g; this.col[k + 2] = color.b;
    this.size[i] = size;
    this.life[i] = life;
    this.maxLife[i] = life;
    this.drag[i] = drag;
    this.grav[i] = grav;
    this.grow[i] = grow;
    this.a0[i] = alpha;
    this.alpha[i] = alpha;
  }

  update(dt) {
    let i = 0;
    while (i < this.count) {
      this.life[i] -= dt;
      if (this.life[i] <= 0) {
        this.kill(i);
        continue;
      }
      const k = i * 3;
      const d = 1 - Math.min(1, this.drag[i] * dt);
      this.vel[k] *= d; this.vel[k + 1] = this.vel[k + 1] * d - this.grav[i] * dt; this.vel[k + 2] *= d;
      this.pos[k] += this.vel[k] * dt;
      this.pos[k + 1] += this.vel[k + 1] * dt;
      this.pos[k + 2] += this.vel[k + 2] * dt;
      if (this.pos[k + 1] < 0.1) { this.pos[k + 1] = 0.1; this.vel[k + 1] *= -0.3; }
      this.size[i] += this.grow[i] * dt;
      const t = this.life[i] / this.maxLife[i];
      this.alpha[i] = this.a0[i] * Math.min(1, t * 2.2);
      i++;
    }
    this.geometry.setDrawRange(0, this.count);
    if (this.count > 0) {
      this.aPos.needsUpdate = true;
      this.aCol.needsUpdate = true;
      this.aSize.needsUpdate = true;
      this.aAlpha.needsUpdate = true;
    }
  }

  kill(i) {
    const last = --this.count;
    if (i === last) return;
    const k = i * 3, l = last * 3;
    for (let j = 0; j < 3; j++) {
      this.pos[k + j] = this.pos[l + j];
      this.vel[k + j] = this.vel[l + j];
      this.col[k + j] = this.col[l + j];
    }
    this.size[i] = this.size[last];
    this.life[i] = this.life[last];
    this.maxLife[i] = this.maxLife[last];
    this.drag[i] = this.drag[last];
    this.grav[i] = this.grav[last];
    this.grow[i] = this.grow[last];
    this.a0[i] = this.a0[last];
    this.alpha[i] = this.alpha[last];
  }

  clear() {
    this.count = 0;
    this.geometry.setDrawRange(0, 0);
  }

  dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.texture.dispose();
  }
}
