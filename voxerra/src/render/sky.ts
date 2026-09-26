/**
 * Ciel dynamique : dôme à dégradé (aube, jour, crépuscule, nuit), soleil,
 * lune à phases, étoiles, nuages volumétriques en blocs, ambiance par biome
 * et par dimension, pluie/orage. Calcule aussi la lumière du jour et le brouillard.
 */
import * as THREE from 'three';
import { SimplexNoise } from '../engine/noise';
import { clamp, smoothstep } from '../engine/math';
import { Rng } from '../engine/rng';

export interface SkyInput {
  time: number; // ticks dans la journée (0 = lever du soleil, 6000 = midi)
  day: number;
  dim: string;
  rain: number;
  storm: number;
  flash: number;
  biomeSky: THREE.Color;
  biomeFog: THREE.Color;
  underwater: boolean;
  inLava: boolean;
  renderDistance: number; // en blocs
  cloudsEnabled: boolean;
}

export interface SkyOutput {
  daylight: number;
  skyLight: THREE.Color;
  fog: THREE.Color;
  fogNear: number;
  fogFar: number;
  sunDir: THREE.Vector3;
  ambientMin: number;
}

const DOME_VERT = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = position;
  vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = p.xyww;
}`;

const DOME_FRAG = /* glsl */ `
uniform vec3 uZenith;
uniform vec3 uHorizon;
uniform vec3 uGround;
uniform vec3 uSunDir;
uniform vec3 uGlow;
uniform float uSunset;
uniform float uNebula;
uniform float uTime;
varying vec3 vDir;
float hash(vec3 p) { return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453); }
float noise(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float n = mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  return n;
}
void main() {
  vec3 d = normalize(vDir);
  float h = d.y;
  vec3 col;
  if (h >= 0.0) col = mix(uHorizon, uZenith, pow(h, 0.5));
  else col = mix(uHorizon, uGround, clamp(-h * 4.0, 0.0, 1.0));
  float s = max(dot(d, uSunDir), 0.0);
  float band = exp(-abs(h) * 6.0);
  col += uGlow * (pow(s, 6.0) * 0.55 * uSunset * band + pow(s, 64.0) * 0.25 * uSunset);
  if (uNebula > 0.0) {
    float n = noise(d * 3.0 + vec3(uTime * 0.01, 0.0, 0.0)) * 0.6 + noise(d * 7.0) * 0.4;
    vec3 neb = mix(vec3(0.35, 0.1, 0.55), vec3(0.1, 0.35, 0.7), noise(d * 2.0 + 5.0));
    col += neb * smoothstep(0.45, 0.9, n) * uNebula;
  }
  gl_FragColor = vec4(col, 1.0);
}`;

const CLOUD_VERT = /* glsl */ `
attribute vec3 color;
varying vec3 vColor;
varying float vDist;
void main() {
  vColor = color;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vDist = length(wp.xz - cameraPosition.xz);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`;

const CLOUD_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uFog;
uniform float uFar;
uniform float uOpacity;
varying vec3 vColor;
varying float vDist;
void main() {
  float fade = 1.0 - smoothstep(uFar * 0.55, uFar, vDist);
  if (fade <= 0.0) discard;
  vec3 c = mix(uColor * vColor, uFog, smoothstep(uFar * 0.3, uFar, vDist) * 0.6);
  gl_FragColor = vec4(c, uOpacity * fade);
}`;

function makeCanvasTexture(size: number, draw: (g: CanvasRenderingContext2D) => void): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  draw(g);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

const col = (hex: number) => new THREE.Color(hex);

export class SkyRenderer {
  readonly group = new THREE.Group();
  private dome: THREE.Mesh;
  private domeMat: THREE.ShaderMaterial;
  private sun: THREE.Mesh;
  private moon: THREE.Mesh;
  private moonTex: THREE.CanvasTexture;
  private stars: THREE.Points;
  private starMat: THREE.PointsMaterial;
  private planet: THREE.Mesh;
  private clouds: THREE.Mesh;
  private cloudMat: THREE.ShaderMaterial;
  private cloudCell = 12;
  private cloudSize = 64;
  private cloudOffset = 0;
  readonly out: SkyOutput = {
    daylight: 1,
    skyLight: new THREE.Color(1, 1, 1),
    fog: new THREE.Color(0.75, 0.85, 1),
    fogNear: 80,
    fogFar: 128,
    sunDir: new THREE.Vector3(0, 1, 0),
    ambientMin: 0,
  };
  private curFog = new THREE.Color(0.75, 0.85, 1);
  private curSky = new THREE.Color(0.55, 0.77, 1);
  private tmp = new THREE.Color();
  private tmp2 = new THREE.Color();

  constructor(seed: number) {
    this.domeMat = new THREE.ShaderMaterial({
      uniforms: {
        uZenith: { value: new THREE.Color() },
        uHorizon: { value: new THREE.Color() },
        uGround: { value: new THREE.Color() },
        uSunDir: { value: new THREE.Vector3(0, 1, 0) },
        uGlow: { value: new THREE.Color(1, 0.55, 0.3) },
        uSunset: { value: 0 },
        uNebula: { value: 0 },
        uTime: { value: 0 },
      },
      vertexShader: DOME_VERT,
      fragmentShader: DOME_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
    });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), this.domeMat);
    this.dome.renderOrder = -100;
    this.dome.frustumCulled = false;
    this.group.add(this.dome);

    // Soleil : carré pixelisé avec halo
    const sunTex = makeCanvasTexture(32, (g) => {
      g.fillStyle = 'rgba(255,200,90,0.25)';
      g.fillRect(2, 2, 28, 28);
      g.fillStyle = 'rgba(255,220,120,0.55)';
      g.fillRect(6, 6, 20, 20);
      g.fillStyle = '#fff6c8';
      g.fillRect(9, 9, 14, 14);
      g.fillStyle = '#ffffff';
      g.fillRect(11, 11, 10, 10);
    });
    this.sun = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.MeshBasicMaterial({ map: sunTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    this.sun.renderOrder = -90;
    this.group.add(this.sun);

    // Lune : 8 phases sur une bande
    this.moonTex = makeCanvasTexture(128, (g) => {
      for (let p = 0; p < 8; p++) {
        const ox = (p % 4) * 32,
          oy = Math.floor(p / 4) * 32;
        g.fillStyle = '#d8dcea';
        g.fillRect(ox + 8, oy + 8, 16, 16);
        g.fillStyle = '#b8bccc';
        g.fillRect(ox + 11, oy + 12, 3, 3);
        g.fillRect(ox + 17, oy + 17, 4, 3);
        g.fillRect(ox + 18, oy + 10, 2, 2);
        // ombre de phase
        const shade = Math.abs(4 - p) / 4; // 0 = pleine lune (p=4)
        const w = Math.round(16 * shade);
        g.fillStyle = 'rgba(10,12,30,0.92)';
        if (p < 4) g.fillRect(ox + 8, oy + 8, w, 16);
        else g.fillRect(ox + 24 - w, oy + 8, w, 16);
      }
    });
    this.moonTex.repeat.set(0.25, 0.25);
    this.moon = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), new THREE.MeshBasicMaterial({ map: this.moonTex, transparent: true, depthWrite: false, fog: false }));
    this.moon.renderOrder = -90;
    this.group.add(this.moon);

    // Étoiles
    const rng = new Rng(seed ^ 0x5747);
    const n = 1400;
    const pos = new Float32Array(n * 3);
    const cols = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = rng.next() * 2 - 1,
        th = rng.next() * Math.PI * 2;
      const r = Math.sqrt(1 - u * u);
      pos[i * 3] = r * Math.cos(th) * 450;
      pos[i * 3 + 1] = u * 450;
      pos[i * 3 + 2] = r * Math.sin(th) * 450;
      const b = 0.6 + rng.next() * 0.4;
      const tint = rng.next();
      cols[i * 3] = b * (tint > 0.8 ? 0.8 : 1);
      cols[i * 3 + 1] = b * 0.95;
      cols[i * 3 + 2] = b * (tint < 0.2 ? 0.8 : 1);
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    sg.setAttribute('color', new THREE.BufferAttribute(cols, 3));
    this.starMat = new THREE.PointsMaterial({ size: 2, sizeAttenuation: false, vertexColors: true, transparent: true, depthWrite: false, fog: false });
    this.stars = new THREE.Points(sg, this.starMat);
    this.stars.renderOrder = -95;
    this.stars.frustumCulled = false;
    this.group.add(this.stars);

    // Astre des Cimes astrales
    const planetTex = makeCanvasTexture(64, (g) => {
      for (let y = 0; y < 64; y++)
        for (let x = 0; x < 64; x++) {
          const d = Math.hypot(x - 31.5, y - 31.5);
          if (d > 28) continue;
          const band = Math.sin(y * 0.35 + Math.sin(x * 0.2) * 1.5);
          const r = 120 + band * 40,
            gg = 90 + band * 30,
            b = 200 + band * 40;
          const edge = d > 25 ? 0.7 : 1;
          g.fillStyle = `rgb(${r * edge | 0},${gg * edge | 0},${Math.min(255, b * edge) | 0})`;
          g.fillRect(x, y, 1, 1);
        }
    });
    this.planet = new THREE.Mesh(new THREE.PlaneGeometry(180, 180), new THREE.MeshBasicMaterial({ map: planetTex, transparent: true, depthWrite: false, fog: false }));
    this.planet.renderOrder = -92;
    this.group.add(this.planet);

    // Nuages
    this.cloudMat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(1, 1, 1) }, uFog: { value: new THREE.Color() }, uFar: { value: 400 }, uOpacity: { value: 0.82 } },
      vertexShader: CLOUD_VERT,
      fragmentShader: CLOUD_FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    this.clouds = new THREE.Mesh(this.buildClouds(seed), this.cloudMat);
    this.clouds.renderOrder = 5;
    this.clouds.frustumCulled = false;
  }

  /** Nuages en blocs : cellules issues d'un bruit tuilable. */
  private buildClouds(seed: number): THREE.BufferGeometry {
    const N = this.cloudSize,
      C = this.cloudCell,
      H = 4;
    const noise = new SimplexNoise(seed ^ 0xc10d);
    const map = new Uint8Array(N * N);
    for (let z = 0; z < N; z++)
      for (let x = 0; x < N; x++) {
        // bruit tuilable par projection sur un tore
        const a = (x / N) * Math.PI * 2,
          b = (z / N) * Math.PI * 2;
        const v = noise.noise3(Math.cos(a) * 2.2, Math.sin(a) * 2.2 + Math.cos(b) * 2.2, Math.sin(b) * 2.2) * 0.7 + noise.noise3(Math.cos(a) * 6, Math.sin(b) * 6, Math.sin(a) * 6 + Math.cos(b) * 6) * 0.3;
        map[z * N + x] = v > 0.18 ? 1 : 0;
      }
    const pos: number[] = [];
    const cols: number[] = [];
    const quad = (pts: number[][], shade: number) => {
      for (const i of [0, 1, 2, 0, 2, 3]) {
        pos.push(...pts[i]);
        cols.push(shade, shade, shade * 1.02);
      }
    };
    const at = (x: number, z: number) => map[((z + N) % N) * N + ((x + N) % N)];
    // deux copies pour un défilement sans couture
    for (let rep = 0; rep < 4; rep++) {
      const ox = (rep % 2) * N * C,
        oz = Math.floor(rep / 2) * N * C;
      for (let z = 0; z < N; z++)
        for (let x = 0; x < N; x++) {
          if (!at(x, z)) continue;
          const x0 = ox + x * C,
            z0 = oz + z * C,
            x1 = x0 + C,
            z1 = z0 + C;
          quad([[x0, H, z0], [x0, H, z1], [x1, H, z1], [x1, H, z0]], 1);
          quad([[x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1]], 0.72);
          if (!at(x + 1, z)) quad([[x1, 0, z0], [x1, H, z0], [x1, H, z1], [x1, 0, z1]], 0.86);
          if (!at(x - 1, z)) quad([[x0, 0, z0], [x0, 0, z1], [x0, H, z1], [x0, H, z0]], 0.86);
          if (!at(x, z + 1)) quad([[x0, 0, z1], [x1, 0, z1], [x1, H, z1], [x0, H, z1]], 0.8);
          if (!at(x, z - 1)) quad([[x0, 0, z0], [x0, H, z0], [x1, H, z0], [x1, 0, z0]], 0.8);
        }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    return g;
  }

  attach(scene: THREE.Scene): void {
    scene.add(this.group);
    scene.add(this.clouds);
  }

  detach(scene: THREE.Scene): void {
    scene.remove(this.group);
    scene.remove(this.clouds);
  }

  update(s: SkyInput, camera: THREE.Camera, dt: number): SkyOutput {
    const o = this.out;
    this.group.position.copy(camera.position);
    const u = this.domeMat.uniforms;
    u.uTime.value += dt;
    const isSurface = s.dim === 'surface';
    const isAstral = s.dim === 'astral';
    const isAbyss = s.dim === 'abime';
    // lissage des couleurs de biome
    const k = 1 - Math.exp(-dt * 1.5);
    this.curFog.lerp(s.biomeFog, k);
    this.curSky.lerp(s.biomeSky, k);

    if (isAbyss) {
      this.dome.visible = this.sun.visible = this.moon.visible = this.stars.visible = this.planet.visible = this.clouds.visible = false;
      o.daylight = 0;
      o.ambientMin = 0.13;
      o.fog.copy(this.curFog);
      o.skyLight.setRGB(0.9, 0.5, 0.4);
      o.fogNear = 8;
      o.fogFar = Math.min(s.renderDistance, 90);
      o.sunDir.set(0, 1, 0);
    } else if (isAstral) {
      this.dome.visible = this.stars.visible = this.planet.visible = true;
      this.sun.visible = this.moon.visible = false;
      this.clouds.visible = false;
      (u.uZenith.value as THREE.Color).setRGB(0.02, 0.01, 0.06);
      (u.uHorizon.value as THREE.Color).copy(this.curFog);
      (u.uGround.value as THREE.Color).setRGB(0.01, 0.0, 0.03);
      u.uSunset.value = 0;
      u.uNebula.value = 1;
      this.starMat.opacity = 1;
      this.stars.rotation.y += dt * 0.004;
      this.planet.position.set(-220, 170, -260);
      this.planet.lookAt(camera.position);
      o.daylight = 0.78;
      o.ambientMin = 0.08;
      o.skyLight.setRGB(0.78, 0.74, 1.0);
      o.fog.copy(this.curFog);
      o.fogNear = s.renderDistance * 0.55;
      o.fogFar = s.renderDistance * 0.98;
      o.sunDir.set(-0.5, 0.6, -0.6).normalize();
    } else {
      this.dome.visible = this.sun.visible = this.moon.visible = this.stars.visible = true;
      this.planet.visible = false;
      this.clouds.visible = s.cloudsEnabled;
      u.uNebula.value = 0;
      const ang = (s.time / 24000) * Math.PI * 2;
      const sunDir = o.sunDir.set(Math.cos(ang), Math.sin(ang), 0.18).normalize();
      const sunY = sunDir.y;
      const day = smoothstep(-0.2, 0.3, sunY);
      const sunset = Math.exp(-sunY * sunY * 18) * (1 - smoothstep(-0.35, -0.15, -sunY) * 0);
      // couleurs
      const nightZ = col(0x0a1030),
        nightH = col(0x1c2648);
      const zen = this.tmp.copy(nightZ).lerp(this.curSky, day);
      const hor = this.tmp2.copy(nightH).lerp(this.curFog, day);
      hor.lerp(col(0xff9a5a), sunset * 0.45 * smoothstep(-0.4, 0.1, sunY));
      // pluie : ciel gris
      const grey = col(0x6c737e).multiplyScalar(0.3 + 0.7 * day);
      zen.lerp(grey, s.rain * 0.75);
      hor.lerp(grey, s.rain * 0.7);
      if (s.flash > 0) {
        zen.lerp(col(0xdde6ff), s.flash);
        hor.lerp(col(0xdde6ff), s.flash);
      }
      (u.uZenith.value as THREE.Color).copy(zen);
      (u.uHorizon.value as THREE.Color).copy(hor);
      // Îles célestes : sous les îles, le vide reste un ciel clair
      (u.uGround.value as THREE.Color).copy(hor).multiplyScalar(s.dim === 'celeste' ? 1.04 : 0.75);
      (u.uSunDir.value as THREE.Vector3).copy(sunDir);
      u.uSunset.value = sunset * (1 - s.rain);
      // soleil / lune
      this.sun.position.copy(sunDir).multiplyScalar(400);
      this.sun.lookAt(camera.position);
      this.moon.position.copy(sunDir).multiplyScalar(-400);
      this.moon.lookAt(camera.position);
      const phase = ((s.day % 8) + 8) % 8;
      this.moonTex.offset.set((phase % 4) * 0.25, 0.75 - Math.floor(phase / 4) * 0.25);
      (this.sun.material as THREE.MeshBasicMaterial).opacity = 1 - s.rain * 0.9;
      (this.moon.material as THREE.MeshBasicMaterial).opacity = 1 - s.rain * 0.9;
      this.starMat.opacity = clamp((1 - day) * 1.2 - s.rain, 0, 1);
      this.stars.rotation.z = ang;
      // lumière
      o.daylight = clamp((0.3 + 0.7 * day) * (1 - s.rain * 0.22 - s.storm * 0.12) + s.flash * 0.6, 0.2, 1);
      o.ambientMin = 0;
      o.skyLight.setRGB(1, 1, 1).lerp(col(0xffc890), sunset * 0.6 * day).lerp(col(0x9aa8e8), 1 - day);
      o.fog.copy(hor);
      o.fogNear = s.renderDistance * (0.5 - s.rain * 0.25);
      o.fogFar = s.renderDistance * (0.97 - s.rain * 0.3);
      // nuages
      this.cloudOffset += dt * 1.2;
      const period = this.cloudSize * this.cloudCell;
      const cx = camera.position.x - period * 0.5,
        cz = camera.position.z - period * 0.5;
      const wrapX = Math.floor((cx + this.cloudOffset) / period) * period - this.cloudOffset;
      const wrapZ = Math.floor(cz / period) * period;
      this.clouds.position.set(wrapX, 192, wrapZ);
      const cu = this.cloudMat.uniforms;
      (cu.uColor.value as THREE.Color).setRGB(1, 1, 1).lerp(col(0xffd0a8), sunset * 0.5).multiplyScalar(0.25 + 0.75 * day).lerp(col(0x7a7e88), s.rain * 0.8);
      (cu.uFog.value as THREE.Color).copy(hor);
      cu.uFar.value = Math.max(260, s.renderDistance * 2.2);
      cu.uOpacity.value = 0.8 + s.rain * 0.15;
    }
    if (s.underwater) {
      o.fog.setRGB(0.1, 0.25, 0.5);
      o.fogNear = 1;
      o.fogFar = 28;
    } else if (s.inLava) {
      o.fog.setRGB(0.9, 0.3, 0.05);
      o.fogNear = 0;
      o.fogFar = 2;
    }
    return o;
  }

  dispose(): void {
    this.dome.geometry.dispose();
    this.domeMat.dispose();
    this.clouds.geometry.dispose();
    this.cloudMat.dispose();
  }
}
