import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { QUALITY } from './Quality.js';

export class GameRenderer {
  constructor(canvas, qualityId) {
    this.canvas = canvas;
    this.quality = QUALITY[qualityId] || QUALITY.medium;
    this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: this.quality.antialias, powerPreference: 'high-performance', stencil: false, alpha: false,
    });
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.composer = null;
    this.width = 1;
    this.height = 1;
    this.envMap = null;
    this.resize();
  }

  setQuality(id) {
    this.quality = QUALITY[id] || this.quality;
    this.resize();
  }

  get gl() {
    return this.renderer.getContext();
  }

  getEnvMap() {
    if (!this.envMap) {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      const room = new RoomEnvironment();
      this.envMap = pmrem.fromScene(room, 0.04).texture;
      room.traverse((o) => o.geometry && o.geometry.dispose());
      pmrem.dispose();
    }
    return this.envMap;
  }

  resize() {
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    const q = this.quality;
    const dpr = Math.min(window.devicePixelRatio || 1, q.maxDpr) * q.pixelRatio;
    this.renderer.setPixelRatio(dpr);
    this.renderer.setSize(w, h, false);
    this.width = w;
    this.height = h;
    this.pixelHeight = h * dpr;
    if (this.composer) {
      this.composer.setPixelRatio(dpr);
      this.composer.setSize(w, h);
    }
  }

  // Bloom post-process (HIGH quality only). Created lazily, shared by all scenes.
  ensureComposer() {
    if (this.composer) return this.composer;
    const c = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(new THREE.Scene(), new THREE.PerspectiveCamera());
    this.bloom = new UnrealBloomPass(new THREE.Vector2(this.width / 2, this.height / 2), 0.5, 0.35, 1.0);
    c.addPass(this.renderPass);
    c.addPass(this.bloom);
    c.addPass(new OutputPass());
    this.composer = c;
    this.resize();
    return c;
  }

  renderBloom(scene, camera, strength) {
    const c = this.ensureComposer();
    this.renderPass.scene = scene;
    this.renderPass.camera = camera;
    this.bloom.strength = strength;
    c.render();
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }
}
