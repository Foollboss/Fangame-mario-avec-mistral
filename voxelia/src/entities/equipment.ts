/**
 * Équipement porté dessiné sur les humanoïdes (joueur, autres joueurs, poupée de l'inventaire) :
 * couche d'armure un peu plus grande que le corps, citrouille sur la tête, ailes du planeur.
 * Les boîtes sont des enfants des parties du modèle : elles suivent toutes ses animations.
 */
import * as THREE from 'three';
import type { ModelInstance } from './BoxModel';
import { ATLAS_SIZE, PIECE_UV, equipmentKey, equipmentTexture, equipmentTile, type EquipPiece, type FaceName } from './equipmentSkins';

/** Aucun équipement (tête, torse, jambes, pieds). */
export const NO_ARMOR: readonly (string | null)[] = [null, null, null, null];

const PARTS = ['head', 'body', 'rightArm', 'leftArm', 'rightLeg', 'leftLeg'] as const;

// Faces de BoxGeometry : +X, -X, +Y, -Y, +Z, -Z ; l'entité regarde vers -Z (comme les peaux des modèles).
const FACE_ORDER: ReadonlyArray<readonly [FaceName, boolean]> = [
  ['right', false],
  ['left', false],
  ['top', true],
  ['bottom', false],
  ['back', false],
  ['front', false],
];

/** Géométries partagées par toute la partie (une par pièce, matériau et taille de boîte). */
const geometries = new Map<string, THREE.BufferGeometry>();

function equipmentGeometry(piece: EquipPiece, key: string, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, omit?: FaceName): THREE.BufferGeometry {
  const k = equipmentKey(key);
  const gkey = `${piece}|${k}|${x0},${y0},${z0},${x1},${y1},${z1}|${omit ?? ''}`;
  let geo = geometries.get(gkey);
  if (geo) return geo;
  const [tu, tv] = equipmentTile(k);
  const [pu, pv, w, h, d] = PIECE_UV[piece];
  const u = tu + pu;
  const v = tv + pv;
  geo = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
  geo.translate((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  const regions: Record<FaceName, [number, number, number, number]> = {
    top: [u + d, v, w, d],
    bottom: [u + d + w, v, w, d],
    right: [u, v + d, d, h],
    front: [u + d, v + d, w, h],
    left: [u + d + w, v + d, d, h],
    back: [u + 2 * d + w, v + d, w, h],
  };
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  for (let f = 0; f < 6; f++) {
    const [name, rot180] = FACE_ORDER[f];
    const [x, y, ww, hh] = regions[name];
    let U0 = x / ATLAS_SIZE;
    let U1 = (x + ww) / ATLAS_SIZE;
    let Vt = 1 - y / ATLAS_SIZE;
    let Vb = 1 - (y + hh) / ATLAS_SIZE;
    if (rot180) {
      [U0, U1] = [U1, U0];
      [Vt, Vb] = [Vb, Vt];
    }
    for (let q = 0; q < 4; q++) uv.setXY(f * 4 + q, q % 2 ? U1 : U0, q < 2 ? Vt : Vb);
  }
  if (omit) {
    // Face retirée (dessous du casque) : on garde les autres triangles.
    const src = geo.getIndex()!;
    const keep: number[] = [];
    for (let f = 0; f < 6; f++) if (FACE_ORDER[f][0] !== omit) for (let q = 0; q < 6; q++) keep.push(src.getX(f * 6 + q));
    geo.setIndex(keep);
  }
  geo.clearGroups();
  geometries.set(gkey, geo);
  return geo;
}

/** Couche d'équipement d'une instance de modèle humanoïde. */
export class EquipmentLayer {
  private readonly material: THREE.MeshBasicMaterial;
  /** Boîte de repos de chaque partie (pixels, repère de la partie). */
  private readonly boxes = new Map<string, THREE.Box3>();
  private readonly worn: (string | null)[] = [null, null, null, null];
  private readonly meshes: THREE.Object3D[] = [];
  private readonly wings: THREE.Group[] = [];
  private spread = -1;

  constructor(private readonly model: ModelInstance) {
    this.material = new THREE.MeshBasicMaterial({ map: equipmentTexture(), alphaTest: 0.5, side: THREE.FrontSide });
    for (const name of PARTS) {
      const mesh = model.parts.get(name)?.children.find((c) => (c as THREE.Mesh).isMesh) as THREE.Mesh | undefined;
      if (!mesh) continue;
      if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
      this.boxes.set(name, mesh.geometry.boundingBox!.clone());
    }
  }

  /**
   * Équipement porté (tête, torse, jambes, pieds : clé de matériau, « glider » ou « pumpkin »)
   * et déploiement des ailes du planeur (0 repliées dans le dos, 1 déployées).
   * Ne reconstruit rien tant que l'équipement ne change pas.
   */
  update(armor: readonly (string | null)[], wingSpread: number): void {
    let changed = false;
    for (let i = 0; i < 4; i++) {
      const k = armor[i] ?? null;
      if (k !== this.worn[i]) {
        this.worn[i] = k;
        changed = true;
      }
    }
    if (changed) this.rebuild();
    if (this.wings.length && wingSpread !== this.spread) {
      this.spread = wingSpread;
      poseWings(this.wings, Math.max(0, Math.min(1, wingSpread)));
    }
  }

  /** Même éclairage que le modèle (teinte rouge quand il est blessé). */
  setLight(l: number, hurt: boolean): void {
    if (hurt) this.material.color.setRGB(1, l * 0.4, l * 0.4);
    else this.material.color.setRGB(l, l, l);
  }

  dispose(): void {
    this.clear();
    this.material.dispose();
  }

  private clear(): void {
    for (const m of this.meshes) m.removeFromParent();
    this.meshes.length = 0;
    this.wings.length = 0;
    this.spread = -1;
  }

  private rebuild(): void {
    this.clear();
    const [head, chest, legs, feet] = this.worn;
    if (head) this.helmet(head);
    if (chest === 'glider') this.glider();
    else if (chest) this.chestplate(chest);
    if (legs) this.leggings(legs);
    if (feet) this.boots(feet);
  }

  /** Ajoute une boîte à une partie ; bornes en pixels dans le repère de la partie. */
  private add(part: string, piece: EquipPiece, key: string, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, omit?: FaceName): void {
    const g = this.model.parts.get(part);
    if (!g) return;
    const m = new THREE.Mesh(equipmentGeometry(piece, key, x0, y0, z0, x1, y1, z1, omit), this.material);
    m.name = 'equip:' + piece;
    g.add(m);
    this.meshes.push(m);
  }

  /** Boîte de la partie gonflée de i pixels (bornes arrondies au centième pour partager les géométries). */
  private inflated(part: string, piece: EquipPiece, key: string, i: number, omit?: FaceName): void {
    const b = this.boxes.get(part);
    if (b) this.add(part, piece, key, r(b.min.x - i), r(b.min.y - i), r(b.min.z - i), r(b.max.x + i), r(b.max.y + i), r(b.max.z + i), omit);
  }

  private helmet(key: string): void {
    // Gonflé un peu plus que le plastron : leurs côtés ne sont jamais dans le même plan.
    if (key === 'pumpkin') this.inflated('head', 'pumpkin', key, 1.1);
    else this.inflated('head', 'helmet', key, 1.1, 'bottom');
  }

  private chestplate(key: string): void {
    this.inflated('body', 'body', key, 1);
    for (const arm of ['rightArm', 'leftArm']) {
      const a = this.boxes.get(arm);
      // Épaulière : le haut du bras (6 px), gonflée un peu plus que le torse pour ne pas se confondre avec son dessus.
      if (a) this.add(arm, 'sleeve', key, r(a.min.x - 1.2), r(a.max.y - 6.2), r(a.min.z - 1.2), r(a.max.x + 1.2), r(a.max.y + 1.2), r(a.max.z + 1.2));
    }
  }

  private leggings(key: string): void {
    const b = this.boxes.get('body');
    if (b) this.add('body', 'belt', key, r(b.min.x - 0.6), r(b.min.y - 0.6), r(b.min.z - 0.6), r(b.max.x + 0.6), r(b.min.y + 4), r(b.max.z + 0.6));
    // Gonflages légèrement différents à droite et à gauche : les jambes se chevauchent sans scintiller.
    for (const [leg, i] of [['rightLeg', 0.5], ['leftLeg', 0.4]] as const) {
      const l = this.boxes.get(leg);
      if (l) this.add(leg, 'leg', key, r(l.min.x - i), r(l.min.y + 3 - i), r(l.min.z - i), r(l.max.x + i), r(l.max.y + i), r(l.max.z + i));
    }
  }

  private boots(key: string): void {
    for (const [leg, i] of [['rightLeg', 1], ['leftLeg', 0.9]] as const) {
      const l = this.boxes.get(leg);
      if (l) this.add(leg, 'boot', key, r(l.min.x - i), r(l.min.y - i / 2), r(l.min.z - i), r(l.max.x + i), r(l.min.y + 4 + i), r(l.max.z + i));
    }
  }

  /** Deux ailes accrochées aux épaules, dans le dos (pivot au coin haut extérieur de chaque aile). */
  private glider(): void {
    const body = this.model.parts.get('body');
    const b = this.boxes.get('body');
    if (!body || !b) return;
    for (const side of [1, -1]) {
      const g = new THREE.Group();
      g.position.set(side * (b.max.x + 1), b.max.y, b.max.z + (side > 0 ? 0.4 : 0.5));
      const right = side > 0;
      const wing = new THREE.Mesh(equipmentGeometry(right ? 'wingR' : 'wingL', 'glider', right ? -10 : 0, -20, 0, right ? 0 : 10, 0, 1), this.material);
      wing.name = right ? 'equip:wingR' : 'equip:wingL';
      g.add(wing);
      body.add(g);
      this.meshes.push(g);
      this.wings.push(g);
    }
  }
}

function r(v: number): number {
  return Math.round(v * 100) / 100;
}

/**
 * Ailes repliées (en Λ dans le dos) à 0, déployées en V de part et d'autre à 1 : un peu
 * rabattues vers l'arrière, bord de fuite relevé pour que la voilure se voie depuis la caméra
 * placée derrière le joueur (à plat, elle n'apparaîtrait que par la tranche).
 */
function poseWings(w: THREE.Group[], s: number): void {
  const x = -0.15 - 0.15 * s;
  const y = 0.35 * s;
  const z = 0.26 + (1.3 - 0.26) * s;
  w[0].rotation.set(x, -y, z);
  w[1].rotation.set(x, y, -z);
}
