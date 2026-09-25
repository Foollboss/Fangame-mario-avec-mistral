/**
 * Particules : billboards instanciés (un seul appel de dessin), pool fixe,
 * textures issues de la texture-tableau des blocs (débris) ou des sprites d'effets.
 */
import * as THREE from 'three';
import type { World } from '../world/world';

const VERT = /* glsl */ `
attribute vec3 iPos;
attribute vec2 iSize;
attribute vec4 iColor;
attribute vec4 iUV;
attribute float iRot;
varying vec3 vUV;
varying vec4 vColor;
varying float vDist;
void main() {
  vec4 mv = viewMatrix * vec4(iPos, 1.0);
  float c = cos(iRot), s = sin(iRot);
  vec2 corner = position.xy;
  vec2 off = vec2(corner.x * c - corner.y * s, corner.x * s + corner.y * c) * iSize;
  mv.xy += off;
  gl_Position = projectionMatrix * mv;
  vUV = vec3(iUV.x + (corner.x + 0.5) * iUV.z, iUV.y + (0.5 - corner.y) * iUV.z, iUV.w);
  vColor = iColor;
  vDist = -mv.z;
}`;

const FRAG = /* glsl */ `
precision highp sampler2DArray;
uniform sampler2DArray uAtlas;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
varying vec3 vUV;
varying vec4 vColor;
varying float vDist;
void main() {
  vec4 t = texture(uAtlas, vUV);
  if (t.a * vColor.a < 0.08) discard;
  vec3 c = t.rgb * vColor.rgb;
  float fog = smoothstep(uFogNear, uFogFar, vDist);
  gl_FragColor = vec4(mix(c, uFogColor, fog), t.a * vColor.a);
}`;

export interface ParticleOpts {
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
  life?: number;
  size?: number;
  sizeEnd?: number;
  layer: number;
  u0?: number;
  v0?: number;
  us?: number;
  r?: number;
  g?: number;
  b?: number;
  a?: number;
  gravity?: number;
  drag?: number;
  collide?: boolean;
  fade?: boolean;
  emissive?: boolean;
  rotSpeed?: number;
}

export class ParticleSystem {
  readonly mesh: THREE.Mesh;
  private geo: THREE.InstancedBufferGeometry;
  private cap: number;
  private count = 0;
  // état
  private p: Float32Array; // x y z vx vy vz life max size sizeEnd grav drag rot rotSpd
  private c: Float32Array; // r g b a
  private uv: Float32Array; // u0 v0 us layer
  private flags: Uint8Array;
  private aPos: THREE.InstancedBufferAttribute;
  private aSize: THREE.InstancedBufferAttribute;
  private aColor: THREE.InstancedBufferAttribute;
  private aUV: THREE.InstancedBufferAttribute;
  private aRot: THREE.InstancedBufferAttribute;
  readonly material: THREE.ShaderMaterial;
  enabled = true;
  density = 1;

  constructor(atlas: THREE.DataArrayTexture, cap = 3000) {
    this.cap = cap;
    this.p = new Float32Array(cap * 14);
    this.c = new Float32Array(cap * 4);
    this.uv = new Float32Array(cap * 4);
    this.flags = new Uint8Array(cap);
    const base = new THREE.PlaneGeometry(1, 1);
    this.geo = new THREE.InstancedBufferGeometry();
    this.geo.index = base.index;
    this.geo.setAttribute('position', base.getAttribute('position'));
    this.aPos = new THREE.InstancedBufferAttribute(new Float32Array(cap * 3), 3);
    this.aSize = new THREE.InstancedBufferAttribute(new Float32Array(cap * 2), 2);
    this.aColor = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4);
    this.aUV = new THREE.InstancedBufferAttribute(new Float32Array(cap * 4), 4);
    this.aRot = new THREE.InstancedBufferAttribute(new Float32Array(cap), 1);
    for (const a of [this.aPos, this.aSize, this.aColor, this.aUV, this.aRot]) a.setUsage(THREE.DynamicDrawUsage);
    this.geo.setAttribute('iPos', this.aPos);
    this.geo.setAttribute('iSize', this.aSize);
    this.geo.setAttribute('iColor', this.aColor);
    this.geo.setAttribute('iUV', this.aUV);
    this.geo.setAttribute('iRot', this.aRot);
    this.geo.instanceCount = 0;
    this.material = new THREE.ShaderMaterial({
      uniforms: { uAtlas: { value: atlas }, uFogColor: { value: new THREE.Color() }, uFogNear: { value: 50 }, uFogFar: { value: 100 } },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
    });
    this.mesh = new THREE.Mesh(this.geo, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 4;
  }

  get live(): number {
    return this.count;
  }

  spawn(o: ParticleOpts): void {
    if (!this.enabled) return;
    if (this.density < 1 && Math.random() > this.density) return;
    if (this.count >= this.cap) return;
    const i = this.count++;
    const p = this.p,
      k = i * 14;
    p[k] = o.x;
    p[k + 1] = o.y;
    p[k + 2] = o.z;
    p[k + 3] = o.vx ?? 0;
    p[k + 4] = o.vy ?? 0;
    p[k + 5] = o.vz ?? 0;
    p[k + 6] = o.life ?? 1;
    p[k + 7] = o.life ?? 1;
    p[k + 8] = o.size ?? 0.15;
    p[k + 9] = o.sizeEnd ?? o.size ?? 0.15;
    p[k + 10] = o.gravity ?? 0;
    p[k + 11] = o.drag ?? 0.5;
    p[k + 12] = Math.random() * Math.PI * 2 * (o.rotSpeed ? 1 : 0);
    p[k + 13] = o.rotSpeed ?? 0;
    const c = this.c,
      j = i * 4;
    c[j] = o.r ?? 1;
    c[j + 1] = o.g ?? 1;
    c[j + 2] = o.b ?? 1;
    c[j + 3] = o.a ?? 1;
    const uv = this.uv;
    uv[j] = o.u0 ?? 0;
    uv[j + 1] = o.v0 ?? 0;
    uv[j + 2] = o.us ?? 1;
    uv[j + 3] = o.layer;
    this.flags[i] = (o.collide ? 1 : 0) | (o.fade !== false ? 2 : 0) | (o.emissive ? 4 : 0);
  }

  /** Débris d'un bloc cassé. */
  blockBreak(x: number, y: number, z: number, layer: number, tint: [number, number, number] = [1, 1, 1], light = 1, n = 18): void {
    for (let i = 0; i < n; i++) {
      this.spawn({
        x: x + 0.15 + Math.random() * 0.7,
        y: y + 0.15 + Math.random() * 0.7,
        z: z + 0.15 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 1,
        vz: (Math.random() - 0.5) * 4,
        life: 0.5 + Math.random() * 0.6,
        size: 0.1 + Math.random() * 0.08,
        layer,
        u0: Math.floor(Math.random() * 12) / 16,
        v0: Math.floor(Math.random() * 12) / 16,
        us: 0.25,
        r: tint[0] * light,
        g: tint[1] * light,
        b: tint[2] * light,
        gravity: 18,
        drag: 0.8,
        collide: true,
        fade: false,
      });
    }
  }

  update(dt: number, world: World | null, lightAt?: (x: number, y: number, z: number) => number): void {
    const p = this.p,
      c = this.c,
      uv = this.uv;
    const solid = world?.content.blocks.solid;
    let i = 0;
    while (i < this.count) {
      const k = i * 14;
      p[k + 6] -= dt;
      if (p[k + 6] <= 0) {
        // retire en échangeant avec le dernier
        const last = --this.count;
        if (i !== last) {
          p.copyWithin(k, last * 14, last * 14 + 14);
          c.copyWithin(i * 4, last * 4, last * 4 + 4);
          uv.copyWithin(i * 4, last * 4, last * 4 + 4);
          this.flags[i] = this.flags[last];
        }
        continue;
      }
      p[k + 4] -= p[k + 10] * dt;
      const drag = Math.pow(p[k + 11], dt);
      p[k + 3] *= drag;
      p[k + 5] *= drag;
      if (p[k + 10] === 0) p[k + 4] *= drag;
      let nx = p[k] + p[k + 3] * dt,
        ny = p[k + 1] + p[k + 4] * dt,
        nz = p[k + 2] + p[k + 5] * dt;
      if (this.flags[i] & 1 && world && solid) {
        if (solid[world.getId(Math.floor(nx), Math.floor(ny), Math.floor(nz))]) {
          if (solid[world.getId(Math.floor(p[k]), Math.floor(ny), Math.floor(p[k + 2]))]) {
            ny = p[k + 1];
            p[k + 4] = 0;
            p[k + 3] *= 0.5;
            p[k + 5] *= 0.5;
          }
          if (solid[world.getId(Math.floor(nx), Math.floor(ny), Math.floor(p[k + 2]))]) {
            nx = p[k];
            p[k + 3] = 0;
          }
          if (solid[world.getId(Math.floor(nx), Math.floor(ny), Math.floor(nz))]) {
            nz = p[k + 2];
            p[k + 5] = 0;
          }
        }
      }
      p[k] = nx;
      p[k + 1] = ny;
      p[k + 2] = nz;
      p[k + 12] += p[k + 13] * dt;
      i++;
    }
    // Remplissage des attributs
    const ap = this.aPos.array as Float32Array,
      as = this.aSize.array as Float32Array,
      ac = this.aColor.array as Float32Array,
      au = this.aUV.array as Float32Array,
      ar = this.aRot.array as Float32Array;
    for (let n = 0; n < this.count; n++) {
      const k = n * 14;
      ap[n * 3] = p[k];
      ap[n * 3 + 1] = p[k + 1];
      ap[n * 3 + 2] = p[k + 2];
      const t = 1 - p[k + 6] / p[k + 7];
      const s = p[k + 8] + (p[k + 9] - p[k + 8]) * t;
      as[n * 2] = s;
      as[n * 2 + 1] = s;
      const f = this.flags[n];
      const light = f & 4 || !lightAt ? 1 : lightAt(p[k], p[k + 1], p[k + 2]);
      ac[n * 4] = c[n * 4] * light;
      ac[n * 4 + 1] = c[n * 4 + 1] * light;
      ac[n * 4 + 2] = c[n * 4 + 2] * light;
      ac[n * 4 + 3] = c[n * 4 + 3] * (f & 2 ? Math.min(1, (1 - t) * 2) : 1);
      au[n * 4] = uv[n * 4];
      au[n * 4 + 1] = uv[n * 4 + 1];
      au[n * 4 + 2] = uv[n * 4 + 2];
      au[n * 4 + 3] = uv[n * 4 + 3];
      ar[n] = p[k + 12];
    }
    this.geo.instanceCount = this.count;
    for (const a of [this.aPos, this.aSize, this.aColor, this.aUV, this.aRot]) {
      a.needsUpdate = true;
      a.clearUpdateRanges();
      a.addUpdateRange(0, this.count * a.itemSize);
    }
  }

  clear(): void {
    this.count = 0;
    this.geo.instanceCount = 0;
  }
}
