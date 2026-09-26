import * as THREE from 'three';
import { TEAM } from '../core/Config.js';
import { radialTexture } from './Textures.js';

const _c = new THREE.Color();
const _c2 = new THREE.Color();
const WHITE = new THREE.Color(0xffffff);

function rndDir(out) {
  const u = Math.random() * 2 - 1;
  const a = Math.random() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return out.set(Math.cos(a) * s, u, Math.sin(a) * s);
}

// Transient visual effects: goal explosions, shockwaves, hit sparks, demolitions, pickups.
export class Effects {
  constructor(scene, glow, smoke) {
    this.scene = scene;
    this.glow = glow;
    this.smoke = smoke;
    this.active = [];
    this.ringGeo = new THREE.RingGeometry(0.8, 1, 48);
    this.flashTex = radialTexture(128, [[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,255,255,0.6)'], [1, 'rgba(255,255,255,0)']]);
    this.cubeGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    this.sphereGeo = new THREE.SphereGeometry(1, 24, 16);
    this.d = new THREE.Vector3();
  }

  burst(pos, color, count, speed, size = 1.6, life = 1.2, grav = 6, drag = 1.2) {
    const d = this.d;
    for (let i = 0; i < count; i++) {
      rndDir(d);
      const s = speed * (0.35 + Math.random() * 0.65);
      _c.copy(color).lerp(WHITE, Math.random() * 0.5);
      this.glow.emit(pos.x, pos.y, pos.z, d.x * s, d.y * s + speed * 0.15, d.z * s, _c, size * (0.6 + Math.random() * 0.8), life * (0.6 + Math.random() * 0.6), drag, grav, -size * 0.4);
    }
  }

  ring(pos, color, maxScale = 30, dur = 0.9, vertical = false) {
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
    const m = new THREE.Mesh(this.ringGeo, mat);
    m.position.copy(pos);
    if (!vertical) m.rotation.x = -Math.PI / 2;
    this.scene.add(m);
    const entry = {
      t: 0, dur,
      update: (k) => { m.scale.setScalar(1 + k * maxScale); mat.opacity = 0.9 * (1 - k); },
      dispose: () => { this.scene.remove(m); mat.dispose(); },
      orient: (n) => m.lookAt(m.position.x + n.x, m.position.y + n.y, m.position.z + n.z),
    };
    this.active.push(entry);
    return entry;
  }

  flash(pos, color, scale = 40, dur = 0.6) {
    const mat = new THREE.SpriteMaterial({ map: this.flashTex, color, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
    const s = new THREE.Sprite(mat);
    s.position.copy(pos);
    this.scene.add(s);
    this.active.push({ t: 0, dur, update: (k) => { s.scale.setScalar(scale * (0.4 + k)); mat.opacity = 1 - k; }, dispose: () => { this.scene.remove(s); mat.dispose(); } });
  }

  delayed(delay, fn) {
    this.active.push({ t: 0, dur: delay, update: () => {}, dispose: () => {}, onEnd: fn });
  }

  goal(style, pos, team) {
    const col = new THREE.Color(TEAM[team].color);
    const p = pos.clone();
    switch (style) {
      case 'gfx_nova':
        this.flash(p, 0xffffff, 90, 0.9);
        this.flash(p, col, 60, 1.4);
        this.ring(p, 0xffffff, 45, 0.8, true);
        this.ring(p, col, 60, 1.2);
        this.burst(p, WHITE, 180, 70, 2, 1.4, 2, 0.8);
        this.burst(p, col, 160, 45, 2.2, 1.6, 4, 1);
        break;
      case 'gfx_fireworks':
        this.flash(p, col, 40, 0.6);
        for (let i = 0; i < 5; i++) {
          this.delayed(0.15 + i * 0.28, () => {
            const q = p.clone().add(new THREE.Vector3((Math.random() - 0.5) * 30, 10 + Math.random() * 14, (Math.random() - 0.5) * 16));
            _c2.setHSL(Math.random(), 1, 0.6);
            this.burst(q, _c2.clone(), 90, 38, 1.6, 1.6, 10, 1.4);
            this.flash(q, _c2.getHex(), 25, 0.5);
          });
        }
        break;
      case 'gfx_pixel': {
        this.flash(p, col, 50, 0.7);
        this.ring(p, col, 35, 0.9);
        const n = 70;
        const mat = new THREE.MeshBasicMaterial({ color: col });
        const mesh = new THREE.InstancedMesh(this.cubeGeo, mat, n);
        const parts = [];
        for (let i = 0; i < n; i++) {
          const v = rndDir(new THREE.Vector3()).multiplyScalar(20 + Math.random() * 40);
          v.y = Math.abs(v.y) + 10;
          parts.push({ p: p.clone(), v, r: new THREE.Euler(Math.random() * 3, Math.random() * 3, 0), c: new THREE.Color().setHSL(Math.random() < 0.5 ? 0.52 : 0.93, 1, 0.55 + Math.random() * 0.2) });
          mesh.setColorAt(i, parts[i].c);
        }
        this.scene.add(mesh);
        const m4 = new THREE.Matrix4();
        const qq = new THREE.Quaternion();
        const sc = new THREE.Vector3();
        let last = 0;
        this.active.push({
          t: 0, dur: 2.2,
          update: (k, t) => {
            const dt = t - last;
            last = t;
            parts.forEach((a, i) => {
              a.v.y -= 30 * dt;
              a.p.addScaledVector(a.v, dt);
              if (a.p.y < 0.4) { a.p.y = 0.4; a.v.y *= -0.4; a.v.x *= 0.7; a.v.z *= 0.7; }
              a.r.x += dt * 5; a.r.y += dt * 4;
              qq.setFromEuler(a.r);
              sc.setScalar(1.4 * (1 - k * 0.9));
              m4.compose(a.p, qq, sc);
              mesh.setMatrixAt(i, m4);
            });
            mesh.instanceMatrix.needsUpdate = true;
          },
          dispose: () => { this.scene.remove(mesh); mat.dispose(); mesh.dispose(); },
        });
        break;
      }
      case 'gfx_blackhole': {
        const mat = new THREE.MeshBasicMaterial({ color: 0x000000 });
        const hole = new THREE.Mesh(this.sphereGeo, mat);
        hole.position.copy(p);
        this.scene.add(hole);
        const d = new THREE.Vector3();
        for (let i = 0; i < 160; i++) {
          rndDir(d);
          const r = 16 + Math.random() * 6;
          _c.setHSL(0.75 + Math.random() * 0.1, 1, 0.6);
          this.glow.emit(p.x + d.x * r, p.y + d.y * r, p.z + d.z * r, -d.x * r * 1.6, -d.y * r * 1.6, -d.z * r * 1.6, _c, 1.4, 0.6, 0, 0, 0);
        }
        this.active.push({
          t: 0, dur: 0.9,
          update: (k) => hole.scale.setScalar(Math.sin(k * Math.PI) * 5 + 0.01),
          dispose: () => {
            this.scene.remove(hole);
            mat.dispose();
          },
          onEnd: () => {
            this.flash(p, 0xb56bff, 80, 0.8);
            this.ring(p, 0xb56bff, 50, 1);
            this.burst(p, new THREE.Color(0xc98bff), 220, 75, 2, 1.3, 3, 0.9);
          },
        });
        break;
      }
      default:
        this.flash(p, col, 55, 0.8);
        this.ring(p, col, 40, 1);
        this.burst(p, col, 220, 55, 2, 1.4, 5, 1);
        this.burst(p, WHITE, 60, 30, 1.4, 0.9, 2, 1.5);
    }
  }

  demolition(pos, team) {
    const col = new THREE.Color(TEAM[team].color);
    this.flash(pos, 0xffa040, 26, 0.5);
    this.burst(pos, new THREE.Color(0xffa040), 90, 30, 1.6, 0.9, 8, 1.6);
    this.burst(pos, col, 40, 20, 1.4, 0.8, 8, 1.6);
    for (let i = 0; i < 30; i++) {
      _c.setRGB(0.12, 0.12, 0.14);
      this.smoke.emit(pos.x, pos.y, pos.z, (Math.random() - 0.5) * 8, Math.random() * 6 + 2, (Math.random() - 0.5) * 8, _c, 3, 1.6, 1.2, -1, 3, 0.8);
    }
  }

  hit(point, normal, strength, color) {
    const n = Math.min(40, Math.round(strength * 0.5));
    for (let i = 0; i < n; i++) {
      const s = strength * (0.2 + Math.random() * 0.4);
      this.glow.emit(point.x, point.y, point.z,
        normal.x * s + (Math.random() - 0.5) * s, normal.y * s + Math.random() * s * 0.5, normal.z * s + (Math.random() - 0.5) * s,
        color, 0.7 + Math.random() * 0.5, 0.35 + Math.random() * 0.25, 2.5, 12, -0.5);
    }
    if (strength > 30) this.ring(point, color.getHex(), 5, 0.3, true);
  }

  pickup(x, z, big) {
    _c.setHex(0xffb02e);
    const n = big ? 30 : 10;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      this.glow.emit(x + Math.cos(a) * 1.5, 0.5, z + Math.sin(a) * 1.5, Math.cos(a) * 3, 6 + Math.random() * 8, Math.sin(a) * 3, _c, big ? 1.3 : 0.9, 0.6, 1.5, 4, -0.8);
    }
  }

  update(dt) {
    for (let i = this.active.length - 1; i >= 0; i--) {
      const e = this.active[i];
      e.t += dt;
      const k = Math.min(1, e.t / e.dur);
      e.update(k, e.t);
      if (k >= 1) {
        this.active.splice(i, 1);
        e.dispose();
        e.onEnd && e.onEnd();
      }
    }
  }

  clear() {
    for (const e of this.active) e.dispose();
    this.active.length = 0;
  }

  dispose() {
    this.clear();
    this.ringGeo.dispose();
    this.flashTex.dispose();
    this.cubeGeo.dispose();
    this.sphereGeo.dispose();
  }
}
