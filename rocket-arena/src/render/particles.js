import * as THREE from 'three';

const VERT = `
attribute float size;
attribute float alpha;
attribute vec3 pcolor;
varying float vAlpha;
varying vec3 vColor;
uniform float scale;
void main() {
  vAlpha = alpha;
  vColor = pcolor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = size * scale / max(-mv.z, 0.1);
  gl_Position = projectionMatrix * mv;
}`;
const FRAG = `
varying float vAlpha;
varying vec3 vColor;
void main() {
  vec2 d = gl_PointCoord - 0.5;
  float r = length(d) * 2.0;
  float a = smoothstep(1.0, 0.0, r);
  a *= a;
  gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);
}`;

// CPU-simulated point sprites; one system per blending mode.
export class Particles {
  constructor(capacity, additive = true) {
    this.cap = capacity;
    this.n = 0;
    this.pos = new Float32Array(capacity * 3);
    this.col = new Float32Array(capacity * 3);
    this.size = new Float32Array(capacity);
    this.alpha = new Float32Array(capacity);
    this.vel = new Float32Array(capacity * 3);
    this.life = new Float32Array(capacity);
    this.maxLife = new Float32Array(capacity);
    this.s0 = new Float32Array(capacity);
    this.s1 = new Float32Array(capacity);
    this.a0 = new Float32Array(capacity);
    this.drag = new Float32Array(capacity);
    this.grav = new Float32Array(capacity);
    this.c0 = new Float32Array(capacity * 3);
    this.c1 = new Float32Array(capacity * 3);
    const g = new THREE.BufferGeometry();
    this.aPos = new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage);
    this.aCol = new THREE.BufferAttribute(this.col, 3).setUsage(THREE.DynamicDrawUsage);
    this.aSize = new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage);
    this.aAlpha = new THREE.BufferAttribute(this.alpha, 1).setUsage(THREE.DynamicDrawUsage);
    g.setAttribute('position', this.aPos);
    g.setAttribute('pcolor', this.aCol);
    g.setAttribute('size', this.aSize);
    g.setAttribute('alpha', this.aAlpha);
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e5);
    this.material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { scale: { value: 600 } },
      transparent: true,
      depthWrite: false,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    if (!additive) {
      this.material.fragmentShader = FRAG.replace('gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);', 'gl_FragColor = vec4(vColor, a * vAlpha);');
    }
    this.points = new THREE.Points(g, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
    this.geometry = g;
  }

  setViewportHeight(h) {
    this.material.uniforms.scale.value = h * 0.9;
  }

  // o: {x,y,z, vx,vy,vz, life, size, size1, color (THREE.Color), color1, alpha, drag, gravity}
  emit(o) {
    if (this.n >= this.cap) return;
    const i = this.n++;
    const i3 = i * 3;
    this.pos[i3] = o.x; this.pos[i3 + 1] = o.y; this.pos[i3 + 2] = o.z;
    this.vel[i3] = o.vx || 0; this.vel[i3 + 1] = o.vy || 0; this.vel[i3 + 2] = o.vz || 0;
    this.life[i] = 0;
    this.maxLife[i] = o.life || 0.5;
    this.s0[i] = o.size || 0.5;
    this.s1[i] = o.size1 ?? this.s0[i] * 0.2;
    this.a0[i] = o.alpha ?? 1;
    this.drag[i] = o.drag || 0;
    this.grav[i] = o.gravity || 0;
    const c0 = o.color;
    const c1 = o.color1 || o.color;
    this.c0[i3] = c0.r; this.c0[i3 + 1] = c0.g; this.c0[i3 + 2] = c0.b;
    this.c1[i3] = c1.r; this.c1[i3 + 1] = c1.g; this.c1[i3 + 2] = c1.b;
  }

  update(dt) {
    let i = 0;
    while (i < this.n) {
      this.life[i] += dt;
      if (this.life[i] >= this.maxLife[i]) {
        this.copy(this.n - 1, i);
        this.n--;
        continue;
      }
      const t = this.life[i] / this.maxLife[i];
      const i3 = i * 3;
      const d = Math.exp(-this.drag[i] * dt);
      this.vel[i3] *= d; this.vel[i3 + 1] = this.vel[i3 + 1] * d + this.grav[i] * dt; this.vel[i3 + 2] *= d;
      this.pos[i3] += this.vel[i3] * dt;
      this.pos[i3 + 1] += this.vel[i3 + 1] * dt;
      this.pos[i3 + 2] += this.vel[i3 + 2] * dt;
      this.size[i] = this.s0[i] + (this.s1[i] - this.s0[i]) * t;
      this.alpha[i] = this.a0[i] * (1 - t) * Math.min(1, t * 12 + 0.2);
      this.col[i3] = this.c0[i3] + (this.c1[i3] - this.c0[i3]) * t;
      this.col[i3 + 1] = this.c0[i3 + 1] + (this.c1[i3 + 1] - this.c0[i3 + 1]) * t;
      this.col[i3 + 2] = this.c0[i3 + 2] + (this.c1[i3 + 2] - this.c0[i3 + 2]) * t;
      i++;
    }
    this.geometry.setDrawRange(0, this.n);
    this.aPos.needsUpdate = true;
    this.aCol.needsUpdate = true;
    this.aSize.needsUpdate = true;
    this.aAlpha.needsUpdate = true;
  }

  copy(from, to) {
    if (from === to) return;
    const f3 = from * 3;
    const t3 = to * 3;
    for (let k = 0; k < 3; k++) {
      this.pos[t3 + k] = this.pos[f3 + k];
      this.vel[t3 + k] = this.vel[f3 + k];
      this.col[t3 + k] = this.col[f3 + k];
      this.c0[t3 + k] = this.c0[f3 + k];
      this.c1[t3 + k] = this.c1[f3 + k];
    }
    this.life[to] = this.life[from];
    this.maxLife[to] = this.maxLife[from];
    this.s0[to] = this.s0[from];
    this.s1[to] = this.s1[from];
    this.a0[to] = this.a0[from];
    this.drag[to] = this.drag[from];
    this.grav[to] = this.grav[from];
    this.size[to] = this.size[from];
    this.alpha[to] = this.alpha[from];
  }

  clear() {
    this.n = 0;
  }
}

const rnd = (a) => (Math.random() * 2 - 1) * a;
const WHITE = new THREE.Color(1, 1, 1);
const SMOKE = new THREE.Color(0.18, 0.18, 0.2);
const FIRE = new THREE.Color(1.6, 0.7, 0.2);

// High level effects built on two particle systems.
export class Effects {
  constructor(scene) {
    this.add = new Particles(6000, true);
    this.smoke = new Particles(1500, false);
    scene.add(this.add.points, this.smoke.points);
    this.rings = [];
    this.scene = scene;
    this.ringGeo = new THREE.RingGeometry(0.8, 1, 48);
  }

  setViewportHeight(h) {
    this.add.setViewportHeight(h);
    this.smoke.setViewportHeight(h);
  }

  boost(p, dir, carVel, color, supersonic) {
    const hot = this.tmpHot || (this.tmpHot = new THREE.Color());
    const cool = this.tmpCool || (this.tmpCool = new THREE.Color());
    hot.copy(color).multiplyScalar(1.6).lerp(WHITE, 0.25);
    cool.copy(color).multiplyScalar(0.45);
    for (let k = 0; k < 3; k++) {
      const sp = 9 + Math.random() * 6;
      const back = Math.random() * 0.15;
      this.add.emit({
        x: p.x - dir.x * back + rnd(0.04), y: p.y - dir.y * back + rnd(0.04), z: p.z - dir.z * back + rnd(0.04),
        vx: -dir.x * sp + carVel.x * 0.7 + rnd(0.8), vy: -dir.y * sp + carVel.y * 0.7 + rnd(0.8), vz: -dir.z * sp + carVel.z * 0.7 + rnd(0.8),
        life: 0.16 + Math.random() * 0.16, size: supersonic ? 0.42 : 0.34, size1: 0.04, color: hot, color1: cool, drag: 4, alpha: 0.8,
      });
    }
  }

  trail(p, color, size = 0.28) {
    this.add.emit({ x: p.x, y: p.y, z: p.z, life: 0.45, size, size1: size * 0.18, color, color1: color, alpha: 0.7 });
  }

  sparks(p, strength, color = FIRE) {
    const n = Math.min(36, 6 + strength * 1.2);
    for (let i = 0; i < n; i++) {
      const s = 3 + Math.random() * strength * 0.5;
      this.add.emit({
        x: p.x, y: p.y, z: p.z, vx: rnd(s), vy: rnd(s) + 2, vz: rnd(s), life: 0.25 + Math.random() * 0.25, size: 0.2, size1: 0.03,
        color: WHITE, color1: color, drag: 2, gravity: -10,
      });
    }
  }

  padPickup(p, big) {
    const c = new THREE.Color(1.8, 1.2, 0.3);
    for (let i = 0; i < (big ? 28 : 10); i++) {
      this.add.emit({
        x: p.x + rnd(1), y: 0.3, z: p.z + rnd(1), vx: rnd(1), vy: 3 + Math.random() * (big ? 6 : 3), vz: rnd(1), life: 0.55, size: big ? 0.32 : 0.22,
        size1: 0.05, color: c, drag: 1,
      });
    }
  }

  explosion(p, color, big = true) {
    const n = big ? 650 : 220;
    const base = new THREE.Color(color);
    const hot = base.clone().multiplyScalar(3);
    const deep = base.clone().multiplyScalar(1.2);
    const spark = new THREE.Color(2.2, 1.9, 1.2);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * 2 - 1;
      const r = Math.sqrt(1 - v * v);
      const kind = Math.random();
      const s = (big ? 12 : 7) + Math.random() * (big ? 32 : 12) * (kind < 0.25 ? 1.3 : 1);
      this.add.emit({
        x: p.x, y: p.y, z: p.z, vx: Math.cos(u) * r * s, vy: v * s + 3, vz: Math.sin(u) * r * s, life: 0.7 + Math.random() * (big ? 1.4 : 0.6),
        size: kind < 0.25 ? 0.45 : (big ? 1.3 : 0.9), size1: 0.08, color: kind < 0.25 ? spark : hot, color1: deep, drag: kind < 0.25 ? 0.8 : 1.8,
        gravity: kind < 0.25 ? -9 : -3,
      });
    }
    for (let i = 0; i < (big ? 90 : 40); i++) {
      this.smoke.emit({
        x: p.x + rnd(1), y: p.y + rnd(1), z: p.z + rnd(1), vx: rnd(6), vy: rnd(4) + 2, vz: rnd(6), life: 1.5 + Math.random() * 1.5,
        size: 2.5, size1: 6, color: SMOKE, alpha: 0.55, drag: 1.5, gravity: 0.5,
      });
    }
    const ring = new THREE.Mesh(this.ringGeo, new THREE.MeshBasicMaterial({
      color: hot, transparent: true, opacity: 1, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false,
    }));
    ring.position.copy(p);
    ring.lookAt(p.x, p.y + 1, p.z);
    this.scene.add(ring);
    this.rings.push({ mesh: ring, t: 0, max: big ? 1.1 : 0.6, size: big ? 30 : 10 });
  }

  demolition(p, color) {
    for (let i = 0; i < 160; i++) {
      const s = 4 + Math.random() * 12;
      this.add.emit({
        x: p.x, y: p.y, z: p.z, vx: rnd(s), vy: rnd(s) + 4, vz: rnd(s), life: 0.5 + Math.random() * 0.8, size: 1.1, size1: 0.1,
        color: new THREE.Color(2, 1.4, 0.5), color1: new THREE.Color(color).multiplyScalar(1.5), drag: 2, gravity: -6,
      });
    }
    for (let i = 0; i < 50; i++) {
      this.smoke.emit({
        x: p.x, y: p.y, z: p.z, vx: rnd(3), vy: 1 + Math.random() * 3, vz: rnd(3), life: 1.5 + Math.random(), size: 1.5, size1: 4,
        color: SMOKE, alpha: 0.7, drag: 1,
      });
    }
  }

  update(dt) {
    this.add.update(dt);
    this.smoke.update(dt);
    for (let i = this.rings.length - 1; i >= 0; i--) {
      const r = this.rings[i];
      r.t += dt;
      const k = r.t / r.max;
      if (k >= 1) {
        this.scene.remove(r.mesh);
        r.mesh.material.dispose();
        this.rings.splice(i, 1);
        continue;
      }
      const s = 1 + k * r.size;
      r.mesh.scale.set(s, s, s);
      r.mesh.material.opacity = 1 - k;
    }
  }

  clear() {
    this.add.clear();
    this.smoke.clear();
  }
}
