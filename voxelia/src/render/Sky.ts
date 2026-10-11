/**
 * Ciel : dôme en dégradé, soleil et lune carrés (phases lunaires), étoiles,
 * lueurs de lever/coucher du soleil et nuages cubiques en mouvement.
 */
import * as THREE from 'three';
import { Simplex } from '../util/noise';

export interface SkyState {
  /** Temps du monde en ticks (0..24000) : 0 = lever, 6000 = midi, 12000 = coucher, 18000 = minuit. */
  time: number;
  /** Jour absolu (phase de la lune). */
  day: number;
  /** 0..1 : intensité de la pluie (assombrit le ciel). */
  rain: number;
  thunder: number;
  dimension: number;
  /** Couleurs de base du biome actuel. */
  biomeSky: THREE.Color;
  biomeFog: THREE.Color;
  underwater: boolean;
}

const domeVertex = /* glsl */ `
out vec3 vDir;
void main() {
  vDir = normalize(position);
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_Position.z = gl_Position.w; // toujours au fond
}`;

const domeFragment = /* glsl */ `
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uSunDir;
uniform vec3 uGlow;
uniform float uGlowStrength;
uniform vec3 uBottom;
in vec3 vDir;
out highp vec4 fragColor;
void main() {
  float h = vDir.y;
  vec3 col = mix(uHorizon, uTop, smoothstep(-0.02, 0.45, h));
  col = mix(col, uBottom, smoothstep(0.0, -0.25, h));
  float s = max(dot(normalize(vec3(vDir.x, 0.0, vDir.z)), normalize(vec3(uSunDir.x, 0.0, uSunDir.z))), 0.0);
  float band = smoothstep(0.45, -0.05, abs(h - 0.05));
  col = mix(col, uGlow, uGlowStrength * pow(s, 3.0) * band);
  fragColor = vec4(col, 1.0);
}`;

function sunTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grd = g.createRadialGradient(32, 32, 6, 32, 32, 32);
  grd.addColorStop(0, 'rgba(255,255,230,0.55)');
  grd.addColorStop(1, 'rgba(255,240,200,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  g.fillStyle = '#fffbe8';
  g.fillRect(20, 20, 24, 24);
  g.fillStyle = '#ffffff';
  g.fillRect(23, 23, 18, 18);
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  return t;
}

function moonTexture(phase: number): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d')!;
  // Disque pixelisé avec cratères ; la phase masque une partie.
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const dx = x - 7.5;
      const dy = y - 7.5;
      if (dx * dx + dy * dy > 49) continue;
      let lit = true;
      const p = phase % 8;
      if (p !== 0) {
        const k = p <= 4 ? p / 4 : (8 - p) / 4;
        const edge = (p <= 4 ? -1 : 1) * (7.5 - k * 15);
        lit = p <= 4 ? dx > edge : dx < -edge;
        if (p === 4) lit = false;
      }
      const crater = (x === 5 && y === 5) || (x === 10 && y === 9) || (x === 6 && y === 11) || (x === 9 && y === 4);
      g.fillStyle = lit ? (crater ? '#b8bcc8' : '#e8ecf4') : 'rgba(40,44,60,0.35)';
      g.fillRect(8 + x, 8 + y, 1, 1);
    }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  return t;
}

export class Sky {
  readonly group = new THREE.Group();
  readonly clouds = new THREE.Group();
  private dome: THREE.Mesh;
  private domeMat: THREE.ShaderMaterial;
  private sun: THREE.Mesh;
  private moon: THREE.Mesh;
  private moonTextures: THREE.Texture[] = [];
  private stars: THREE.Points;
  private cloudMesh: THREE.Mesh | null = null;
  private cloudMat: THREE.ShaderMaterial;
  private cloudNoise = new Simplex(424242);
  private cloudOrigin = { x: NaN, z: NaN };
  private cloudOffset = 0;
  cloudsEnabled = true;
  cloudHeight = 192;
  /** Résultats exposés au reste du rendu */
  readonly fogColor = new THREE.Color();
  readonly skyTint = new THREE.Color(1, 1, 1);
  daylight = 1;
  sunDir = new THREE.Vector3(0, 1, 0);

  constructor() {
    this.domeMat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: domeVertex,
      fragmentShader: domeFragment,
      uniforms: {
        uTop: { value: new THREE.Color() },
        uHorizon: { value: new THREE.Color() },
        uBottom: { value: new THREE.Color() },
        uSunDir: { value: new THREE.Vector3(0, 1, 0) },
        uGlow: { value: new THREE.Color(1, 0.55, 0.25) },
        uGlowStrength: { value: 0 },
      },
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
    });
    this.dome = new THREE.Mesh(new THREE.SphereGeometry(400, 24, 12), this.domeMat);
    this.dome.renderOrder = -1000;
    this.dome.frustumCulled = false;
    this.group.add(this.dome);

    const sunMat = new THREE.MeshBasicMaterial({ map: sunTexture(), transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, fog: false });
    this.sun = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), sunMat);
    this.sun.renderOrder = -998;
    this.sun.frustumCulled = false;
    this.group.add(this.sun);

    for (let p = 0; p < 8; p++) this.moonTextures.push(moonTexture(p));
    const moonMat = new THREE.MeshBasicMaterial({ map: this.moonTextures[0], transparent: true, depthWrite: false, depthTest: false, fog: false });
    this.moon = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), moonMat);
    this.moon.renderOrder = -998;
    this.moon.frustumCulled = false;
    this.group.add(this.moon);

    const starGeo = new THREE.BufferGeometry();
    const pos: number[] = [];
    const rng = new Simplex(7);
    for (let i = 0; i < 1400; i++) {
      const u = Math.abs(rng.noise2(i * 0.37, 1.3)) * 2 - 1;
      const t = (i * 2.399963) % (Math.PI * 2);
      const r = Math.sqrt(1 - u * u);
      pos.push(Math.cos(t) * r * 350, Math.abs(u) * 350 + 10, Math.sin(t) * r * 350);
    }
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    this.stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, depthWrite: false, depthTest: false, fog: false }));
    this.stars.renderOrder = -999;
    this.stars.frustumCulled = false;
    this.group.add(this.stars);

    this.cloudMat = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      vertexShader: /* glsl */ `
        in vec3 color;
        out vec3 vColor; out float vDist;
        void main() { vColor = color; vec4 w = modelMatrix * vec4(position, 1.0); vec4 mv = viewMatrix * w; vDist = length(mv.xz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor; uniform float uOpacity; uniform float uFar; uniform vec3 uFog;
        in vec3 vColor; in float vDist; out highp vec4 fragColor;
        void main() { float f = smoothstep(uFar * 0.55, uFar, vDist); fragColor = vec4(mix(vColor * uColor, uFog, f * 0.6), uOpacity * (1.0 - f)); }`,
      uniforms: { uColor: { value: new THREE.Color(1, 1, 1) }, uOpacity: { value: 0.8 }, uFar: { value: 300 }, uFog: { value: new THREE.Color() } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }

  /** Met à jour couleurs et positions ; renvoie la couleur de brouillard à utiliser. */
  update(state: SkyState, camera: THREE.Camera, dt: number): void {
    const camPos = camera.position;
    this.group.position.copy(camPos);
    const angle = (state.time / 24000) * Math.PI * 2;
    const elev = Math.sin(angle);
    this.sunDir.set(Math.cos(angle), elev, 0.18).normalize();
    const sd = this.sunDir;
    this.sun.position.copy(sd).multiplyScalar(320);
    this.moon.position.copy(sd).multiplyScalar(-320);
    this.group.updateMatrixWorld(true);
    this.sun.lookAt(camPos);
    this.moon.lookAt(camPos);
    const moonMat = this.moon.material as THREE.MeshBasicMaterial;
    const phase = ((state.day % 8) + 8) % 8;
    if (moonMat.map !== this.moonTextures[phase]) {
      moonMat.map = this.moonTextures[phase];
      moonMat.needsUpdate = true;
    }

    // Lumière du jour (0.18 la nuit, 1 le jour)
    let day = THREE.MathUtils.clamp(elev * 2.4 + 0.45, 0, 1);
    const dimDay = state.dimension === 1 ? 0.55 : state.dimension === 2 ? 1 : day;
    const rainDark = 1 - state.rain * 0.35 - state.thunder * 0.25;
    this.daylight = Math.max(state.dimension === 0 ? 0.16 : 0.5, dimDay * rainDark);
    day = state.dimension === 0 ? day : dimDay;

    const top = new THREE.Color();
    const horizon = new THREE.Color();
    if (state.dimension === 1) {
      top.setHex(0x3a0c06);
      horizon.setHex(0x8a2c14);
    } else {
      const nightTop = new THREE.Color(0x02050e);
      const nightHorizon = new THREE.Color(0x0b1224);
      top.copy(nightTop).lerp(state.biomeSky, day);
      horizon.copy(nightHorizon).lerp(state.biomeFog, day);
      const grey = new THREE.Color(0x5a6370).multiplyScalar(0.4 + day * 0.6);
      top.lerp(grey, state.rain * 0.75);
      horizon.lerp(grey, state.rain * 0.7);
    }
    // Lever / coucher : lueur orangée près de l'horizon
    const sunset = state.dimension === 0 ? Math.max(0, 1 - Math.abs(elev) * 4) * (1 - state.rain) : 0;
    this.domeMat.uniforms.uTop.value.copy(top);
    this.domeMat.uniforms.uHorizon.value.copy(horizon);
    this.domeMat.uniforms.uBottom.value.copy(horizon);
    this.domeMat.uniforms.uSunDir.value.copy(sd);
    this.domeMat.uniforms.uGlowStrength.value = sunset * 0.85;

    this.sun.visible = state.dimension !== 1 && state.rain < 0.95 && elev > -0.25;
    this.moon.visible = state.dimension === 0 && state.rain < 0.95 && elev < 0.25;
    (this.sun.material as THREE.MeshBasicMaterial).opacity = 1 - state.rain;
    (this.stars.material as THREE.PointsMaterial).opacity = state.dimension === 0 ? Math.max(0, 1 - day * 1.6) * (1 - state.rain) : 0;

    // Brouillard : couleur de l'horizon, légèrement orangée au coucher si on regarde le soleil.
    const look = new THREE.Vector3();
    camera.getWorldDirection(look);
    const towardSun = Math.max(0, look.x * sd.x + look.z * sd.z);
    this.fogColor.copy(horizon).lerp(new THREE.Color(1, 0.6, 0.35), sunset * towardSun * 0.6);
    if (state.underwater) this.fogColor.setRGB(0.05, 0.18, 0.4).multiplyScalar(0.3 + this.daylight * 0.7);
    this.skyTint.setRGB(0.7 + 0.3 * day, 0.75 + 0.25 * day, 1);

    // Nuages
    this.clouds.visible = this.cloudsEnabled && state.dimension !== 1;
    if (this.clouds.visible) {
      this.cloudOffset += dt * (1.2 + state.thunder * 4);
      this.updateClouds(camPos, state);
      const cu = this.cloudMat.uniforms;
      const brightness = 0.25 + 0.75 * day;
      cu.uColor.value.setRGB(brightness, brightness, brightness * (1 + 0.05 * (1 - day)));
      cu.uColor.value.lerp(new THREE.Color(0.55, 0.55, 0.6), state.rain * 0.8);
      if (sunset > 0) cu.uColor.value.lerp(new THREE.Color(1, 0.7, 0.55), sunset * 0.35);
      cu.uFog.value.copy(this.fogColor);
      cu.uOpacity.value = 0.78 + state.rain * 0.15;
    }
  }

  private updateClouds(cam: THREE.Vector3, state: SkyState): void {
    const CELL = 12;
    const N = 40; // 40x40 cellules = 480 blocs
    const ox = Math.floor((cam.x - this.cloudOffset) / CELL);
    const oz = Math.floor(cam.z / CELL);
    const y = state.dimension === 2 ? 40 : this.cloudHeight;
    if (ox !== this.cloudOrigin.x || oz !== this.cloudOrigin.z) {
      this.cloudOrigin.x = ox;
      this.cloudOrigin.z = oz;
      this.buildClouds(ox - N / 2, oz - N / 2, N, CELL, state.rain);
    }
    if (this.cloudMesh) this.cloudMesh.position.set(this.cloudOffset, y, 0);
  }

  private cloudAt(cx: number, cz: number, rain: number): boolean {
    const n = this.cloudNoise.noise2(cx * 0.11, cz * 0.11) * 0.7 + this.cloudNoise.noise2(cx * 0.37, cz * 0.37) * 0.3;
    return n > 0.18 - rain * 0.4;
  }

  private buildClouds(sx: number, sz: number, N: number, CELL: number, rain: number): void {
    const pos: number[] = [];
    const col: number[] = [];
    const H = 4;
    const quad = (a: number[], b: number[], c: number[], d: number[], shade: number) => {
      pos.push(...a, ...b, ...c, ...a, ...c, ...d);
      for (let i = 0; i < 6; i++) col.push(shade, shade, shade);
    };
    for (let z = 0; z < N; z++)
      for (let x = 0; x < N; x++) {
        const cx = sx + x;
        const cz = sz + z;
        if (!this.cloudAt(cx, cz, rain)) continue;
        const x0 = cx * CELL;
        const x1 = x0 + CELL;
        const z0 = cz * CELL;
        const z1 = z0 + CELL;
        quad([x0, H, z1], [x1, H, z1], [x1, H, z0], [x0, H, z0], 1);
        quad([x0, 0, z0], [x1, 0, z0], [x1, 0, z1], [x0, 0, z1], 0.72);
        if (!this.cloudAt(cx + 1, cz, rain)) quad([x1, 0, z1], [x1, 0, z0], [x1, H, z0], [x1, H, z1], 0.86);
        if (!this.cloudAt(cx - 1, cz, rain)) quad([x0, 0, z0], [x0, 0, z1], [x0, H, z1], [x0, H, z0], 0.86);
        if (!this.cloudAt(cx, cz + 1, rain)) quad([x0, 0, z1], [x1, 0, z1], [x1, H, z1], [x0, H, z1], 0.92);
        if (!this.cloudAt(cx, cz - 1, rain)) quad([x1, 0, z0], [x0, 0, z0], [x0, H, z0], [x1, H, z0], 0.8);
      }
    if (this.cloudMesh) {
      this.cloudMesh.geometry.dispose();
      this.clouds.remove(this.cloudMesh);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    this.cloudMesh = new THREE.Mesh(g, this.cloudMat);
    this.cloudMesh.frustumCulled = false;
    this.cloudMesh.renderOrder = 5;
    this.clouds.add(this.cloudMesh);
  }

  setCloudFar(far: number): void {
    this.cloudMat.uniforms.uFar.value = far;
  }
}
