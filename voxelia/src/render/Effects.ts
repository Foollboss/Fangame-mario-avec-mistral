/**
 * Effets visuels : contour du bloc visé, fissures de destruction, système de particules
 * (débris de blocs, fumée, flammes, bulles, éclaboussures, critiques, magie, pluie, neige).
 */
import * as THREE from 'three';
import { BLOCKS } from '../world/blocks';
import type { TextureAtlas } from './TextureAtlas';
import type { World } from '../world/World';

// ------------------------------------------------------------------ contour de sélection
export class SelectionOutline {
  readonly object: THREE.LineSegments;
  constructor() {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(24 * 3 * 4), 3));
    const mat = new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55, depthWrite: false });
    this.object = new THREE.LineSegments(geo, mat);
    this.object.frustumCulled = false;
    this.object.renderOrder = 10;
    this.object.visible = false;
  }

  show(x: number, y: number, z: number, boxes: number[][]): void {
    const pos = this.object.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    let o = 0;
    const e = 0.002;
    for (const b of boxes.slice(0, 4)) {
      const x0 = b[0] / 16 - e;
      const y0 = b[1] / 16 - e;
      const z0 = b[2] / 16 - e;
      const x1 = b[3] / 16 + e;
      const y1 = b[4] / 16 + e;
      const z1 = b[5] / 16 + e;
      const c = [
        [x0, y0, z0],
        [x1, y0, z0],
        [x1, y0, z1],
        [x0, y0, z1],
        [x0, y1, z0],
        [x1, y1, z0],
        [x1, y1, z1],
        [x0, y1, z1],
      ];
      const edges = [0, 1, 1, 2, 2, 3, 3, 0, 4, 5, 5, 6, 6, 7, 7, 4, 0, 4, 1, 5, 2, 6, 3, 7];
      for (const i of edges) {
        arr[o++] = c[i][0];
        arr[o++] = c[i][1];
        arr[o++] = c[i][2];
      }
    }
    this.object.geometry.setDrawRange(0, o / 3);
    pos.needsUpdate = true;
    this.object.position.set(x, y, z);
    this.object.visible = true;
  }

  hide(): void {
    this.object.visible = false;
  }
}

// ------------------------------------------------------------------ fissures
export class BreakOverlay {
  readonly mesh: THREE.Mesh;
  private textures: THREE.DataTexture[] = [];
  constructor(private atlas: TextureAtlas) {
    this.rebuild();
    const mat = new THREE.MeshBasicMaterial({ map: this.textures[0], transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    this.mesh = new THREE.Mesh(new THREE.BoxGeometry(1.004, 1.004, 1.004), mat);
    this.mesh.visible = false;
    this.mesh.renderOrder = 9;
    atlas.onChange(() => {
      this.rebuild();
      (this.mesh.material as THREE.MeshBasicMaterial).map = this.textures[0];
    });
  }

  private rebuild(): void {
    this.textures = [];
    for (let i = 0; i < 10; i++) {
      const t = new THREE.DataTexture(new Uint8Array(this.atlas.pixels('destroy_' + i)), 16, 16);
      t.flipY = true;
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      t.needsUpdate = true;
      this.textures.push(t);
    }
  }

  show(x: number, y: number, z: number, progress: number, box: number[]): void {
    const stage = Math.min(9, Math.floor(progress * 10));
    const m = this.mesh.material as THREE.MeshBasicMaterial;
    if (m.map !== this.textures[stage]) {
      m.map = this.textures[stage];
      m.needsUpdate = true;
    }
    const sx = (box[3] - box[0]) / 16;
    const sy = (box[4] - box[1]) / 16;
    const sz = (box[5] - box[2]) / 16;
    this.mesh.scale.set(sx, sy, sz);
    this.mesh.position.set(x + (box[0] + box[3]) / 32, y + (box[1] + box[4]) / 32, z + (box[2] + box[5]) / 32);
    this.mesh.visible = true;
  }

  hide(): void {
    this.mesh.visible = false;
  }
}

// ------------------------------------------------------------------ particules
interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
  size: number;
  layer: number;
  u: number;
  v: number;
  r: number;
  g: number;
  b: number;
  gravity: number;
  collide: boolean;
  /** Texture pleine (0) ou point coloré (1). */
  solidColor: number;
  grow: number;
}

const MAX = 3000;

const pVertex = /* glsl */ `
in vec4 aInfo; // u, v, layer, size
in vec4 aColor; // r, g, b, solid
out vec4 vInfo;
out vec4 vColor;
uniform float uScale;
void main() {
  vInfo = aInfo;
  vColor = aColor;
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = aInfo.w * uScale / max(0.1, -mv.z);
}`;
const pFragment = /* glsl */ `
precision highp sampler2DArray;
uniform sampler2DArray uAtlas;
uniform float uLight;
in vec4 vInfo;
in vec4 vColor;
out highp vec4 fragColor;
void main() {
  vec4 c;
  if (vColor.a > 0.5) {
    vec2 d = gl_PointCoord - 0.5;
    if (dot(d, d) > 0.25) discard;
    c = vec4(vColor.rgb, 1.0);
  } else {
    vec2 uv = (vInfo.xy + gl_PointCoord * 4.0) / 16.0;
    c = texture(uAtlas, vec3(uv, vInfo.z));
    if (c.a < 0.5) discard;
    c.rgb *= vColor.rgb;
  }
  fragColor = vec4(c.rgb * uLight, 1.0);
}`;

export class ParticleSystem {
  readonly points: THREE.Points;
  private parts: Particle[] = [];
  private geo: THREE.BufferGeometry;
  private posArr = new Float32Array(MAX * 3);
  private infoArr = new Float32Array(MAX * 4);
  private colArr = new Float32Array(MAX * 4);
  private mat: THREE.ShaderMaterial;
  density = 1;

  constructor(
    private atlas: TextureAtlas,
    private world: () => World | null,
  ) {
    this.geo = new THREE.BufferGeometry();
    this.geo.setAttribute('position', new THREE.BufferAttribute(this.posArr, 3).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('aInfo', new THREE.BufferAttribute(this.infoArr, 4).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute('aColor', new THREE.BufferAttribute(this.colArr, 4).setUsage(THREE.DynamicDrawUsage));
    this.mat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: pVertex,
      fragmentShader: pFragment,
      uniforms: { uAtlas: { value: atlas.texture }, uScale: { value: 300 }, uLight: { value: 1 } },
    });
    this.points = new THREE.Points(this.geo, this.mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 4;
  }

  setViewport(height: number, fov: number): void {
    this.mat.uniforms.uScale.value = height / (2 * Math.tan((fov * Math.PI) / 360));
  }

  setLight(l: number): void {
    this.mat.uniforms.uLight.value = l;
  }

  private add(p: Partial<Particle> & { x: number; y: number; z: number }): void {
    if (this.parts.length >= MAX) this.parts.shift();
    this.parts.push({
      vx: 0,
      vy: 0,
      vz: 0,
      life: 1,
      maxLife: 1,
      size: 0.12,
      layer: 0,
      u: 0,
      v: 0,
      r: 1,
      g: 1,
      b: 1,
      gravity: 0,
      collide: false,
      solidColor: 0,
      grow: 0,
      ...p,
    });
  }

  /** Débris d'un bloc cassé (ou fragments pendant le minage si `few`). */
  blockBreak(x: number, y: number, z: number, blockId: number, few = false, face = -1): void {
    const def = BLOCKS[blockId];
    if (!def) return;
    const tex = def.tex.north || def.tex.top;
    const info = this.atlas.info[tex];
    const layer = info ? info.layer : 0;
    const tint = blockId === 2 ? 0xffffff : def.tint ? (def.tint === 4 ? def.tintColor : def.tint === 3 ? 0x44aff5 : 0x77ab2f) : 0xffffff;
    const n = Math.round((few ? 2 : 32) * this.density);
    for (let i = 0; i < n; i++) {
      let px = x + Math.random();
      let py = y + Math.random();
      let pz = z + Math.random();
      if (few && face >= 0) {
        const off = [
          [1.05, null, null],
          [-0.05, null, null],
          [null, 1.05, null],
          [null, -0.05, null],
          [null, null, 1.05],
          [null, null, -0.05],
        ][face];
        if (off[0] !== null) px = x + off[0];
        if (off[1] !== null) py = y + off[1];
        if (off[2] !== null) pz = z + off[2];
      }
      const life = 0.6 + Math.random() * 0.6;
      this.add({
        x: px,
        y: py,
        z: pz,
        vx: (px - x - 0.5) * (few ? 0.5 : 3),
        vy: Math.random() * (few ? 1 : 3) + 0.5,
        vz: (pz - z - 0.5) * (few ? 0.5 : 3),
        life,
        maxLife: life,
        size: 0.09 + Math.random() * 0.06,
        layer,
        u: Math.floor(Math.random() * 12),
        v: Math.floor(Math.random() * 12),
        r: ((tint >> 16) & 255) / 255,
        g: ((tint >> 8) & 255) / 255,
        b: (tint & 255) / 255,
        gravity: 14,
        collide: true,
      });
    }
  }

  puff(x: number, y: number, z: number, color: number, count = 8, speed = 1, gravity = -1, size = 0.12, life = 1): void {
    const n = Math.max(1, Math.round(count * this.density));
    for (let i = 0; i < n; i++) {
      const l = life * (0.6 + Math.random() * 0.8);
      this.add({
        x: x + (Math.random() - 0.5) * 0.4,
        y: y + (Math.random() - 0.5) * 0.4,
        z: z + (Math.random() - 0.5) * 0.4,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.2) * speed,
        vz: (Math.random() - 0.5) * speed,
        life: l,
        maxLife: l,
        size: size * (0.7 + Math.random() * 0.6),
        r: ((color >> 16) & 255) / 255,
        g: ((color >> 8) & 255) / 255,
        b: (color & 255) / 255,
        solidColor: 1,
        gravity,
        grow: 0.1,
      });
    }
  }

  smoke(x: number, y: number, z: number): void {
    this.puff(x, y, z, 0x555555, 1, 0.15, -1.5, 0.16, 1.6);
  }

  flame(x: number, y: number, z: number): void {
    this.puff(x, y, z, 0xffa020, 1, 0.05, -0.6, 0.07, 0.6);
  }

  bubbles(x: number, y: number, z: number, n = 6): void {
    this.puff(x, y, z, 0xc8e8ff, n, 0.6, -3, 0.06, 0.8);
  }

  splash(x: number, y: number, z: number): void {
    this.puff(x, y, z, 0x9ad0ff, 24, 3, 12, 0.07, 0.8);
  }

  crit(x: number, y: number, z: number): void {
    this.puff(x, y, z, 0xfff0a0, 10, 3, 4, 0.06, 0.5);
  }

  magic(x: number, y: number, z: number, color = 0xb070ff, n = 12): void {
    this.puff(x, y, z, color, n, 1.5, -0.5, 0.08, 1);
  }

  explosion(x: number, y: number, z: number, power: number): void {
    this.puff(x, y, z, 0xffffff, 40 * power, 6 * power, -0.5, 0.35, 1.2);
    this.puff(x, y, z, 0x707070, 30 * power, 3 * power, -1, 0.4, 2);
  }

  update(dt: number): void {
    const w = this.world();
    let n = 0;
    const alive: Particle[] = [];
    for (const p of this.parts) {
      p.life -= dt;
      if (p.life <= 0) continue;
      p.vy -= p.gravity * dt;
      const nx = p.x + p.vx * dt;
      const ny = p.y + p.vy * dt;
      const nz = p.z + p.vz * dt;
      if (p.collide && w && BLOCKS[w.id(Math.floor(nx), Math.floor(ny), Math.floor(nz))]?.solid) {
        p.vx *= 0.3;
        p.vz *= 0.3;
        p.vy = 0;
      } else {
        p.x = nx;
        p.y = ny;
        p.z = nz;
      }
      p.vx *= 0.98;
      p.vz *= 0.98;
      p.size += p.grow * dt;
      alive.push(p);
      if (n >= MAX) continue;
      this.posArr[n * 3] = p.x;
      this.posArr[n * 3 + 1] = p.y;
      this.posArr[n * 3 + 2] = p.z;
      const fade = p.solidColor ? Math.min(1, p.life / p.maxLife + 0.3) : 1;
      this.infoArr[n * 4] = p.u;
      this.infoArr[n * 4 + 1] = p.v;
      this.infoArr[n * 4 + 2] = p.layer;
      this.infoArr[n * 4 + 3] = p.size * (p.solidColor ? fade : 1);
      this.colArr[n * 4] = p.r;
      this.colArr[n * 4 + 1] = p.g;
      this.colArr[n * 4 + 2] = p.b;
      this.colArr[n * 4 + 3] = p.solidColor;
      n++;
    }
    this.parts = alive;
    this.geo.setDrawRange(0, n);
    for (const k of ['position', 'aInfo', 'aColor']) (this.geo.getAttribute(k) as THREE.BufferAttribute).needsUpdate = true;
  }

  clear(): void {
    this.parts = [];
  }
}
