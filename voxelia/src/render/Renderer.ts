/**
 * TerrainRenderer / Renderer — scène Three.js : ciel, terrain, entités, particules,
 * caméra et réglages graphiques (distance, qualité, échelle de résolution).
 */
import * as THREE from 'three';
import { TextureAtlas } from './TextureAtlas';
import { createTerrainMaterials, createTerrainUniforms, type TerrainUniforms } from './terrainMaterial';
import { Sky, type SkyState } from './Sky';

THREE.ColorManagement.enabled = false;

export interface GraphicsOptions {
  renderDistance: number;
  fov: number;
  resolutionScale: number;
  clouds: boolean;
  fancyLeaves: boolean;
  wavingPlants: boolean;
  brightness: number;
  fog: boolean;
}

export class Renderer {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly atlas = new TextureAtlas();
  readonly uniforms: TerrainUniforms;
  readonly materials: { solid: THREE.ShaderMaterial; translucent: THREE.ShaderMaterial };
  readonly sky = new Sky();
  readonly terrain = new THREE.Group();
  readonly entities = new THREE.Group();
  readonly effects = new THREE.Group();
  private time = 0;
  options: GraphicsOptions = { renderDistance: 6, fov: 70, resolutionScale: 1, clouds: true, fancyLeaves: true, wavingPlants: true, brightness: 0.5, fog: true };
  /** FOV dynamique (sprint, zoom). */
  fovBoost = 0;

  constructor(readonly canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', alpha: false, preserveDrawingBuffer: false });
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.sortObjects = true;
    this.camera = new THREE.PerspectiveCamera(70, 1, 0.05, 1000);
    this.camera.rotation.order = 'YXZ';
    this.atlas.build();
    this.uniforms = createTerrainUniforms(this.atlas.texture);
    this.materials = createTerrainMaterials(this.uniforms);
    this.scene.add(this.sky.group, this.terrain, this.sky.clouds, this.entities, this.effects);
    this.scene.background = null;
    this.resize();
  }

  get gl(): WebGL2RenderingContext {
    return this.renderer.getContext() as WebGL2RenderingContext;
  }

  resize(): void {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2) * this.options.resolutionScale;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  applyOptions(o: Partial<GraphicsOptions>): void {
    Object.assign(this.options, o);
    this.sky.cloudsEnabled = this.options.clouds;
    this.uniforms.uWave.value = this.options.wavingPlants ? 1 : 0;
    this.uniforms.uBrightness.value = this.options.brightness;
    this.resize();
  }

  update(dt: number, sky: SkyState): void {
    this.time += dt;
    const cam = this.camera;
    const fov = this.options.fov + this.fovBoost;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov += (fov - cam.fov) * Math.min(1, dt * 10);
      cam.updateProjectionMatrix();
    }
    this.sky.update(sky, cam, dt);
    const u = this.uniforms;
    u.uTime.value = this.time;
    u.uDaylight.value = this.sky.daylight;
    u.uSkyTint.value.copy(this.sky.skyTint);
    u.uFogColor.value.copy(this.sky.fogColor);
    const far = this.options.renderDistance * 16;
    if (sky.underwater) {
      u.uFogNear.value = 2;
      u.uFogFar.value = 28 + this.sky.daylight * 18;
    } else if (!this.options.fog) {
      u.uFogNear.value = far * 0.9;
      u.uFogFar.value = far * 1.05;
    } else {
      const rain = sky.rain * 0.35;
      u.uFogNear.value = far * (0.55 - rain);
      u.uFogFar.value = far * (1.0 - rain * 0.6);
    }
    if (sky.dimension === 1) {
      u.uFogNear.value = Math.min(u.uFogNear.value, far * 0.35);
    }
    this.sky.setCloudFar(Math.max(240, far * 1.6));
    cam.far = Math.max(400, far * 2.2);
  }

  render(): void {
    this.renderer.render(this.scene, this.camera);
  }

  /** Capture une vignette JPEG (aperçu du monde). */
  thumbnail(w = 192, h = 108): string {
    this.render();
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const g = c.getContext('2d')!;
    const src = this.renderer.domElement;
    const ratio = Math.max(w / src.width, h / src.height);
    const sw = w / ratio;
    const sh = h / ratio;
    g.drawImage(src, (src.width - sw) / 2, (src.height - sh) / 2, sw, sh, 0, 0, w, h);
    return c.toDataURL('image/jpeg', 0.8);
  }
}
