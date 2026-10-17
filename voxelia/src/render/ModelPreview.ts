/**
 * Aperçu de modèle (personnage du menu, poupée de l'inventaire, vestiaire) :
 * un petit moteur de rendu hors écran partagé, recopié dans des canvas 2D.
 */
import * as THREE from 'three';
import type { ModelFactory, ModelInstance } from '../entities/BoxModel';
import { EquipmentLayer, NO_ARMOR } from '../entities/equipment';

export class ModelPreview {
  private renderer: THREE.WebGLRenderer | null = null;
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(30, 2 / 3, 0.1, 50);
  private model: ModelInstance | null = null;
  private equip: EquipmentLayer | null = null;
  private key = '';
  private w = 160;
  private h = 240;

  constructor(private models: ModelFactory) {
    this.camera.position.set(0, 1.0, -5.2);
    this.camera.lookAt(0, 0.95, 0);
  }

  private ensure(): THREE.WebGLRenderer | null {
    if (this.renderer) return this.renderer;
    try {
      const c = document.createElement('canvas');
      c.width = this.w;
      c.height = this.h;
      this.renderer = new THREE.WebGLRenderer({ canvas: c, alpha: true, antialias: false, preserveDrawingBuffer: true });
      this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
      this.renderer.setClearColor(0x000000, 0);
      this.renderer.setSize(this.w, this.h, false);
    } catch {
      this.renderer = null;
    }
    return this.renderer;
  }

  /**
   * Dessine le modèle dans un canvas 2D (lookX/lookY : orientation de la tête, -1..1 ;
   * armor : équipement porté, tête, torse, jambes, pieds, comme Player.wornArmor()).
   */
  draw(target: HTMLCanvasElement, key: string, yaw: number, time: number, lookX = 0, lookY = 0, walk = 0, armor: readonly (string | null)[] = NO_ARMOR): void {
    const r = this.ensure();
    if (!r || !this.models.has(key)) return;
    if (key !== this.key) {
      this.equip?.dispose();
      this.model?.dispose();
      if (this.model) this.scene.remove(this.model.root);
      this.model = this.models.create(key);
      this.equip = new EquipmentLayer(this.model);
      this.scene.add(this.model.root);
      this.key = key;
    }
    const m = this.model!;
    m.root.rotation.set(0, yaw, 0);
    m.setLight(1, false);
    this.equip!.update(armor, 0);
    this.equip!.setLight(1, false);
    const sw = Math.sin(time * 6) * 0.6 * walk;
    if (m.parts.has('rightLeg')) {
      m.pose('rightLeg', sw);
      m.pose('leftLeg', -sw);
      m.pose('rightArm', -sw + Math.sin(time * 1.3) * 0.04, 0, Math.sin(time) * 0.05 + 0.04);
      m.pose('leftArm', sw + Math.sin(time * 1.1) * 0.04, 0, -Math.sin(time) * 0.05 - 0.04);
      m.pose('head', lookY * 0.6, lookX * 0.8, 0);
    }
    r.render(this.scene, this.camera);
    const g = target.getContext('2d');
    if (!g) return;
    g.imageSmoothingEnabled = false;
    g.clearRect(0, 0, target.width, target.height);
    const scale = Math.min(target.width / this.w, target.height / this.h);
    const dw = this.w * scale;
    const dh = this.h * scale;
    g.drawImage(r.domElement, (target.width - dw) / 2, (target.height - dh) / 2, dw, dh);
  }
}
