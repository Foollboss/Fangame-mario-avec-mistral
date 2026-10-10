/** Objet tenu en vue subjective (bras, balancement, coups, manger, arc, bouclier). */
import * as THREE from 'three';
import type { ItemModels, ItemModel } from './itemModels';
import { DEFAULT_SKIN, type Skin } from '../entity/skin';
import { faceSize, paintSkinFace } from './playerSkin';

export interface HeldState {
  id: string | null;
  swing: number; // 0..1 (1 = début du coup)
  use: 'eat' | 'bow' | 'block' | 'recall' | null;
  useProgress: number;
  walk: number; // phase de marche
  walkAmount: number;
  sky: number;
  block: number;
  daylight: number;
  bobbing: boolean;
}

export class HeldItemRenderer {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  private holder = new THREE.Group();
  /** Bras droit du skin (manche et main), visible quand la main est vide. */
  private arm = new THREE.Group();
  private armMats: THREE.MeshBasicMaterial[] = [];
  private model: ItemModel | null = null;
  private currentId: string | null = null;
  private equip = 1;
  private pendingId: string | null = null;

  constructor(private models: ItemModels) {
    this.camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.01, 10);
    this.scene.add(this.holder);
    // boîte du bras debout (comme sur le modèle), couchée pour que la main pointe vers l'avant
    const armGeo = new THREE.BoxGeometry(0.22, 0.8, 0.22);
    const shade = [0.78, 0.78, 1, 0.55, 0.9, 0.7];
    const cols: number[] = [];
    for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) cols.push(shade[f], shade[f], shade[f]);
    armGeo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
    for (let f = 0; f < 6; f++) this.armMats.push(new THREE.MeshBasicMaterial({ vertexColors: true }));
    const mesh = new THREE.Mesh(armGeo, this.armMats);
    mesh.rotation.x = Math.PI / 2;
    this.arm.add(mesh);
    this.scene.add(this.arm);
    this.setSkin(DEFAULT_SKIN);
  }

  /** Repeint le bras avec le skin du joueur. */
  setSkin(skin: Skin): void {
    this.armMats.forEach((m, f) => {
      m.map?.dispose();
      const [fw, fh] = faceSize(f, 4, 12, 4);
      const t = new THREE.CanvasTexture(paintSkinFace(skin, 'arm_r', f, fw, fh));
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      t.colorSpace = THREE.NoColorSpace;
      m.map = t;
      m.needsUpdate = true;
    });
  }

  resize(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  private setItem(id: string | null): void {
    if (this.model) {
      this.holder.remove(this.model.obj);
      this.model.dispose();
      this.model = null;
    }
    this.currentId = id;
    if (!id) return;
    this.model = this.models.create(id);
    const o = this.model.obj;
    if (this.model.isBlock) {
      o.scale.setScalar(0.42);
      o.rotation.set(0, Math.PI / 4, 0);
    } else {
      o.scale.setScalar(0.72);
      o.rotation.set(0, -Math.PI / 2 + 0.3, 0.35);
    }
    this.holder.add(o);
  }

  update(dt: number, s: HeldState): void {
    // animation de changement d'objet
    if (s.id !== this.currentId && this.pendingId !== s.id) this.pendingId = s.id;
    if (this.pendingId !== null || (s.id === null && this.currentId !== null)) {
      this.equip = Math.max(0, this.equip - dt * 8);
      if (this.equip <= 0) {
        this.setItem(s.id);
        this.pendingId = null;
      }
    } else this.equip = Math.min(1, this.equip + dt * 6);
    const eq = 1 - this.equip;
    const bobA = s.bobbing ? s.walkAmount : 0;
    const bx = Math.sin(s.walk) * 0.03 * bobA;
    const by = -Math.abs(Math.cos(s.walk)) * 0.035 * bobA;
    const sw = s.swing > 0 ? Math.sin((1 - s.swing) * Math.PI) : 0;
    const swHalf = s.swing > 0 ? Math.sin(Math.sqrt(1 - s.swing) * Math.PI) : 0;
    const h = this.holder;
    h.position.set(0.52 + bx - swHalf * 0.28, -0.5 + by - eq * 0.6 + sw * 0.12, -0.78 - swHalf * 0.15);
    h.rotation.set(-sw * 1.1, swHalf * 0.5, sw * 0.4);
    if (s.use === 'eat' || s.use === 'recall') {
      const k = Math.min(1, s.useProgress * 4);
      h.position.x -= 0.32 * k;
      h.position.y += 0.18 * k + Math.sin(performance.now() / 70) * 0.025 * k;
      h.rotation.y -= 0.8 * k;
    } else if (s.use === 'bow') {
      const k = Math.min(1, s.useProgress);
      h.position.x -= 0.3;
      h.position.z += 0.1 * k;
      h.rotation.set(0, 0.1, -0.2 - k * 0.1);
    } else if (s.use === 'block') {
      h.position.set(0.18, -0.28, -0.65);
      h.rotation.set(0, 0.5, 0);
    }
    // bras : visible quand la main est vide
    const empty = this.currentId === null;
    this.arm.visible = empty;
    this.arm.position.set(0.6 + bx - swHalf * 0.3, -0.62 + by - eq * 0.6 + sw * 0.1, -0.6 - swHalf * 0.2);
    this.arm.rotation.set(0.3 - sw * 0.9, -0.2 + swHalf * 0.4, 0.1);
    const l = Math.max(s.sky * s.daylight, s.block, 0.1);
    for (const m of this.armMats) m.color.setRGB(l, l, l);
    this.model?.setLight(s.sky, s.block, s.daylight);
  }

  render(renderer: THREE.WebGLRenderer): void {
    const auto = renderer.autoClear;
    renderer.autoClear = false;
    renderer.clearDepth();
    renderer.render(this.scene, this.camera);
    renderer.autoClear = auto;
  }
}
