/**
 * Bras et objet tenu en vue à la première personne (scène séparée dessinée par-dessus,
 * avec balancement de marche, coup, changement d'objet et animation pour manger).
 */
import * as THREE from 'three';
import type { ItemMeshFactory } from './ItemMesh';
import type { ModelFactory, ModelInstance } from '../entities/BoxModel';

export class HandRenderer {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
  private pivot = new THREE.Group();
  private arm: ModelInstance | null = null;
  private armKey = '';
  private item: THREE.Object3D | null = null;
  private itemId = -1;
  private equip = 0;
  swing = 0;
  eating = 0;
  drawing = 0;
  visible = true;

  constructor(
    private items: ItemMeshFactory,
    private models: ModelFactory,
  ) {
    this.scene.add(this.pivot);
  }

  /** Placement du bras (réglable) : position et rotation dans le repère du pivot. */
  armPos = new THREE.Vector3(0.1, -0.16, 0.06);
  armRot = new THREE.Euler(2.25, 0.12, 0.12, 'YXZ');

  setSkin(key: string): void {
    if (key === this.armKey) return;
    this.arm?.dispose();
    this.pivot.children.filter((c) => c.userData.isArm).forEach((c) => this.pivot.remove(c));
    this.arm = this.models.create(key);
    this.armKey = key;
    // On reprend uniquement la géométrie et la peau du bras droit du modèle du joueur.
    const src = this.arm.parts.get('rightArm');
    const mesh = src?.children.find((c) => (c as THREE.Mesh).isMesh) as THREE.Mesh | undefined;
    if (!mesh) return;
    const holder = new THREE.Group();
    const m = new THREE.Mesh(mesh.geometry, this.arm.material);
    m.scale.setScalar(1 / 16);
    holder.add(m);
    holder.position.copy(this.armPos);
    holder.rotation.copy(this.armRot);
    holder.userData.isArm = true;
    this.pivot.add(holder);
  }

  setItem(id: number): void {
    if (id === this.itemId) return;
    this.itemId = id;
    this.equip = 1;
    if (this.item) this.pivot.remove(this.item);
    this.item = null;
    if (id < 0) return;
    const m = this.items.create(id);
    const g = new THREE.Group();
    g.add(m);
    if (m.userData.isBlock) {
      m.scale.setScalar(0.3);
      m.rotation.set(0, Math.PI / 4, 0);
      g.position.set(0.07, -0.1, -0.16);
    } else {
      m.scale.setScalar(0.5);
      m.rotation.set(0, -Math.PI / 2 + 0.3, 0.6);
      g.position.set(0.07, 0.02, -0.14);
    }
    this.item = g;
    this.pivot.add(g);
  }

  update(dt: number, aspect: number, fov: number, bob: number, walkPhase: number, light: number): void {
    this.camera.aspect = aspect;
    this.camera.fov = fov;
    this.camera.updateProjectionMatrix();
    if (this.swing > 0) this.swing = Math.max(0, this.swing - dt * 3.2);
    if (this.equip > 0) this.equip = Math.max(0, this.equip - dt * 5);
    const s = Math.sin((1 - this.swing) * Math.PI);
    const sq = Math.sin(Math.sqrt(1 - this.swing) * Math.PI);
    const bx = Math.sin(walkPhase * Math.PI) * bob * 0.6;
    const by = -Math.abs(Math.cos(walkPhase * Math.PI)) * bob * 0.6;
    const p = this.pivot;
    p.position.set(0.56 + bx - sq * 0.12, -0.52 + by - this.equip * 0.5 + s * 0.08, -0.72 - s * 0.15);
    p.rotation.set(-sq * 0.6, -0.35 - sq * 0.3, -s * 0.2);
    if (this.eating > 0) {
      p.position.set(0.32, -0.38 + Math.abs(Math.sin(this.eating * 18)) * 0.05, -0.55);
      p.rotation.set(0.2, -0.9, 0.3);
    }
    if (this.drawing > 0) {
      p.position.set(0.3 - this.drawing * 0.05, -0.4, -0.6 + this.drawing * 0.08);
      p.rotation.set(0, -1.2, 0.2);
    }
    if (this.arm) this.arm.setLight(light, false);
    for (const c of this.pivot.children)
      if (c.userData.isArm) {
        c.position.copy(this.armPos);
        c.rotation.copy(this.armRot);
      }
    this.item?.traverse((o) => {
      const m = (o as THREE.Mesh).material;
      if (!m) return;
      for (const mm of Array.isArray(m) ? m : [m]) (mm as THREE.MeshBasicMaterial).color?.setScalar(light);
    });
    // La main nue est visible ; un objet tenu la remplace (il serait sinon dessiné à travers le bras).
    p.children.forEach((c) => {
      if (c.userData.isArm) c.visible = !this.item;
    });
  }

  render(r: THREE.WebGLRenderer): void {
    if (!this.visible) return;
    // Dessin par-dessus le monde : on efface seulement la profondeur, pas l'image.
    const auto = r.autoClear;
    r.autoClear = false;
    r.clearDepth();
    r.render(this.scene, this.camera);
    r.autoClear = auto;
  }
}
