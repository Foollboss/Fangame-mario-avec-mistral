/**
 * Précipitations autour de la caméra : pluie, neige (selon le biome), cendres
 * de l'Abîme, poussière d'étoiles des Cimes. Les gouttes s'arrêtent sur les toits.
 */
import * as THREE from 'three';
import type { World } from '../world/world';
import { BIOMES } from '../worldgen/biomes';

const VERT = /* glsl */ `
attribute vec3 iPos;
attribute vec4 iData; // largeur, hauteur, type, alpha
varying vec2 vUV;
varying vec4 vData;
varying float vDist;
void main() {
  vec3 toCam = cameraPosition - iPos;
  vec3 right = normalize(vec3(toCam.z, 0.0, -toCam.x) + vec3(1e-4, 0.0, 0.0));
  vec3 up = vec3(0.0, 1.0, 0.0);
  if (iData.z > 0.5) {
    // flocons / cendres : billboard complet
    vec3 f = normalize(toCam);
    right = normalize(cross(vec3(0.0, 1.0, 0.0), f));
    up = cross(f, right);
  }
  vec3 wp = iPos + right * position.x * iData.x + up * position.y * iData.y;
  vec4 mv = viewMatrix * vec4(wp, 1.0);
  gl_Position = projectionMatrix * mv;
  vUV = position.xy + 0.5;
  vData = iData;
  vDist = -mv.z;
}`;

const FRAG = /* glsl */ `
uniform vec3 uRain;
uniform vec3 uSnow;
uniform vec3 uAsh;
uniform vec3 uStar;
uniform float uLight;
varying vec2 vUV;
varying vec4 vData;
varying float vDist;
void main() {
  float t = vData.z;
  vec3 c;
  float a = vData.w;
  if (t < 0.5) { c = uRain; a *= 0.55 * (1.0 - abs(vUV.x - 0.5) * 2.0); }
  else {
    float d = length(vUV - 0.5) * 2.0;
    if (d > 1.0) discard;
    a *= 1.0 - d * d;
    c = t < 1.5 ? uSnow : (t < 2.5 ? uAsh : uStar);
  }
  if (a < 0.02) discard;
  gl_FragColor = vec4(c * (t > 2.5 ? 1.0 : uLight), a * (1.0 - smoothstep(18.0, 30.0, vDist)));
}`;

const RAIN = 0,
  SNOW = 1,
  ASH = 2,
  STAR = 3;

export class WeatherRenderer {
  readonly mesh: THREE.Mesh;
  private geo: THREE.InstancedBufferGeometry;
  private n = 1600;
  private pos: Float32Array;
  private vel: Float32Array;
  private kind: Uint8Array;
  private aPos: THREE.InstancedBufferAttribute;
  private aData: THREE.InstancedBufferAttribute;
  private mat: THREE.ShaderMaterial;
  /** Impacts de gouttes (pour les éclaboussures). */
  splashes: [number, number, number][] = [];

  constructor() {
    const base = new THREE.PlaneGeometry(1, 1);
    this.geo = new THREE.InstancedBufferGeometry();
    this.geo.index = base.index;
    this.geo.setAttribute('position', base.getAttribute('position'));
    this.pos = new Float32Array(this.n * 3);
    this.vel = new Float32Array(this.n * 3);
    this.kind = new Uint8Array(this.n);
    this.aPos = new THREE.InstancedBufferAttribute(new Float32Array(this.n * 3), 3);
    this.aData = new THREE.InstancedBufferAttribute(new Float32Array(this.n * 4), 4);
    this.aPos.setUsage(THREE.DynamicDrawUsage);
    this.aData.setUsage(THREE.DynamicDrawUsage);
    this.geo.setAttribute('iPos', this.aPos);
    this.geo.setAttribute('iData', this.aData);
    this.geo.instanceCount = 0;
    this.mat = new THREE.ShaderMaterial({
      uniforms: {
        uRain: { value: new THREE.Color(0.65, 0.72, 0.9) },
        uSnow: { value: new THREE.Color(1, 1, 1) },
        uAsh: { value: new THREE.Color(0.55, 0.45, 0.42) },
        uStar: { value: new THREE.Color(0.8, 0.85, 1.0) },
        uLight: { value: 1 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.mesh = new THREE.Mesh(this.geo, this.mat);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 6;
    for (let i = 0; i < this.n; i++) this.pos[i * 3 + 1] = -1e6;
  }

  /**
   * @param intensity 0..1 pour la pluie/neige de surface
   */
  update(dt: number, world: World, cx: number, cy: number, cz: number, intensity: number, dim: string, light: number): void {
    this.mat.uniforms.uLight.value = 0.35 + light * 0.65;
    const ambient = dim === 'abime' ? 0.5 : dim === 'astral' ? 0.35 : 0;
    const level = dim === 'surface' ? intensity : ambient;
    const active = Math.floor(this.n * level);
    const R = 20;
    const p = this.pos,
      v = this.vel;
    const ap = this.aPos.array as Float32Array,
      ad = this.aData.array as Float32Array;
    this.splashes.length = 0;
    let out = 0;
    for (let i = 0; i < active; i++) {
      const k = i * 3;
      let x = p[k],
        y = p[k + 1],
        z = p[k + 2];
      const dx = x - cx,
        dz = z - cz;
      const surf = world.heightAt(Math.floor(x), Math.floor(z));
      if (y < surf + 1 || y < cy - 14 || dx * dx + dz * dz > R * R || y > cy + 30) {
        if (y < surf + 1 && y > cy - 14 && this.kind[i] === RAIN && this.splashes.length < 6) this.splashes.push([x, surf + 1, z]);
        // réapparition au-dessus de la caméra
        const a = Math.random() * Math.PI * 2,
          r = Math.sqrt(Math.random()) * R;
        x = cx + Math.cos(a) * r;
        z = cz + Math.sin(a) * r;
        y = cy + 8 + Math.random() * 20;
        let kind = RAIN;
        if (dim === 'abime') kind = ASH;
        else if (dim === 'astral') kind = STAR;
        else {
          const b = BIOMES[world.biomeAt(Math.floor(x), Math.floor(z))];
          if (!b || b.precip === 'none') {
            p[k + 1] = -1e6;
            continue;
          }
          kind = b.precip === 'snow' || y > 140 ? SNOW : RAIN;
        }
        this.kind[i] = kind;
        if (kind === RAIN) {
          v[k] = 0.6;
          v[k + 1] = -17 - Math.random() * 5;
          v[k + 2] = 0.3;
        } else if (kind === SNOW) {
          v[k] = (Math.random() - 0.5) * 1.2;
          v[k + 1] = -1.6 - Math.random();
          v[k + 2] = (Math.random() - 0.5) * 1.2;
        } else if (kind === ASH) {
          v[k] = (Math.random() - 0.5) * 0.8;
          v[k + 1] = -0.6 - Math.random() * 0.6;
          v[k + 2] = (Math.random() - 0.5) * 0.8;
        } else {
          v[k] = (Math.random() - 0.5) * 0.4;
          v[k + 1] = -0.25 - Math.random() * 0.3;
          v[k + 2] = (Math.random() - 0.5) * 0.4;
        }
      }
      if (this.kind[i] === SNOW || this.kind[i] === ASH) {
        x += Math.sin(y * 0.8 + i) * dt * 0.4;
      }
      x += v[k] * dt;
      y += v[k + 1] * dt;
      z += v[k + 2] * dt;
      p[k] = x;
      p[k + 1] = y;
      p[k + 2] = z;
      if (y < -1e5) continue;
      ap[out * 3] = x;
      ap[out * 3 + 1] = y;
      ap[out * 3 + 2] = z;
      const kd = this.kind[i];
      ad[out * 4] = kd === RAIN ? 0.035 : kd === SNOW ? 0.12 : 0.09;
      ad[out * 4 + 1] = kd === RAIN ? 0.9 : kd === SNOW ? 0.12 : 0.09;
      ad[out * 4 + 2] = kd;
      ad[out * 4 + 3] = kd === STAR ? 0.8 : 1;
      out++;
    }
    this.geo.instanceCount = out;
    this.aPos.needsUpdate = true;
    this.aData.needsUpdate = true;
  }
}
