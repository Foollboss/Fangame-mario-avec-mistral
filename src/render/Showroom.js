import * as THREE from 'three';
import { CarView } from './CarView.js';
import { radialTexture } from './Textures.js';

// Menu / garage scene: the player's car on a lit turntable.
export class Showroom {
  constructor(gameRenderer, cosmetics) {
    this.gr = gameRenderer;
    const scene = (this.scene = new THREE.Scene());
    scene.background = new THREE.Color(0x070a14);
    scene.fog = new THREE.Fog(0x070a14, 30, 90);
    if (gameRenderer.quality.envMap) scene.environment = gameRenderer.getEnvMap();
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 300);
    scene.add(new THREE.HemisphereLight(0xb8d4ff, 0x1a1030, 1.4));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(6, 10, 8);
    scene.add(key);
    const rimL = new THREE.PointLight(0x19e6ff, 60, 30, 1.5);
    rimL.position.set(-6, 3, -4);
    const rimR = new THREE.PointLight(0xff2f7d, 60, 30, 1.5);
    rimR.position.set(6, 3, -5);
    scene.add(rimL, rimR);

    this.disposables = [];
    const T = (x) => (this.disposables.push(x), x);
    const floor = new THREE.Mesh(T(new THREE.CircleGeometry(40, 48)), T(new THREE.MeshStandardMaterial({ color: 0x0b1020, roughness: 0.35, metalness: 0.6 })));
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    const table = new THREE.Mesh(T(new THREE.CylinderGeometry(4.2, 4.4, 0.3, 48)), T(new THREE.MeshStandardMaterial({ color: 0x151b2e, roughness: 0.3, metalness: 0.8 })));
    table.position.y = 0.15;
    scene.add(table);
    const ring = new THREE.Mesh(T(new THREE.TorusGeometry(4.3, 0.06, 8, 96)), T(new THREE.MeshBasicMaterial({ color: 0x19e6ff })));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.31;
    scene.add(ring);
    this.ring = ring;
    const glow = new THREE.Mesh(T(new THREE.PlaneGeometry(14, 14)), T(new THREE.MeshBasicMaterial({
      map: T(radialTexture(128, [[0, 'rgba(25,230,255,0.35)'], [1, 'rgba(25,230,255,0)']])), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    })));
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.32;
    scene.add(glow);
    // Back grid for depth
    const grid = new THREE.GridHelper(80, 40, 0x2a3a78, 0x141c3a);
    grid.position.y = 0.01;
    scene.add(grid);
    this.grid = grid;

    this.turn = new THREE.Group();
    this.turn.position.y = 0.3 + 1.05;
    scene.add(this.turn);
    this.car = null;
    this.setCosmetics(cosmetics);
    this.angle = 0.6;
    this.autoSpin = true;
    this.offsetX = 0;
    this.time = 0;
    this.fakeCar = null;
  }

  setCosmetics(cosmetics) {
    if (this.car) {
      this.turn.remove(this.car.group);
      this.car.dispose();
    }
    this.car = new CarView(cosmetics, 0, { envMap: this.gr.quality.envMap });
    this.turn.add(this.car.group);
    this.car.model.under.visible = false;
  }

  // Horizontal framing: positive shifts the car to the right side of the screen.
  setFraming(offsetX) {
    this.offsetX = offsetX;
  }

  drag(dx) {
    this.angle += dx * 0.01;
    this.autoSpin = false;
    clearTimeout(this.spinTimer);
    this.spinTimer = setTimeout(() => (this.autoSpin = true), 2500);
  }

  update(dt) {
    this.time += dt;
    if (this.autoSpin) this.angle += dt * 0.35;
    this.turn.rotation.y = this.angle;
    const m = this.car.model;
    for (const w of m.wheels) w.spin.rotation.x += dt * 0.6;
    if (m.topper) m.topper.rotation.y += dt * 1.5;
    if (m.animatedColor) m.bodyMat.color.setHSL((this.time * 0.08) % 1, 0.85, 0.55);
    if (m.wheelGlow) m.wheelGlow.color.setHSL((this.time * 0.3) % 1, 0.9, 0.65);
    const aspect = this.gr.width / this.gr.height;
    this.camera.aspect = aspect;
    const dist = aspect < 1.4 ? 17 : 13.5;
    this.camera.position.set(-this.offsetX * 0.9, 3.4, dist);
    this.camera.lookAt(-this.offsetX, 1.2, 0);
    this.camera.updateProjectionMatrix();
    this.ring.material.color.setHSL(0.52 + Math.sin(this.time * 0.5) * 0.04, 1, 0.55);
  }

  render() {
    this.gr.render(this.scene, this.camera);
  }

  dispose() {
    this.car.dispose();
    for (const d of this.disposables) d.dispose && d.dispose();
    this.grid.geometry.dispose();
    this.grid.material.dispose();
  }
}
