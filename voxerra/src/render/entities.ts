/**
 * Rendu des entités : modèles en boîtes (créatures, joueurs) texturés en
 * pixel-art procédural, animations (marche, vol, attaque, blessure, mort),
 * objets au sol, projectiles, tombes. Interpolation entre ticks.
 */
import * as THREE from 'three';
import type { Entity } from '../entity/entity';
import type { ModelPart, CreatureDef } from '../registry/types';
import type { ItemModels, ItemModel } from './itemModels';
import { hexToRgb } from '../engine/math';
import { Rng, hashString } from '../engine/rng';

type LightFn = (x: number, y: number, z: number) => { sky: number; block: number };

interface PartNode {
  def: ModelPart;
  pivot: THREE.Group;
  mats: THREE.MeshBasicMaterial[];
  baseRot: THREE.Euler;
}

interface View {
  kind: string;
  root: THREE.Group;
  parts: PartNode[];
  item?: ItemModel;
  held?: { model: ItemModel; id: string; node: THREE.Object3D };
  walk: number;
  lastX: number;
  lastZ: number;
  dispose(): void;
  update(e: Entity, alpha: number, dt: number, light: { sky: number; block: number }, daylight: number): void;
}

const texCache = new Map<string, THREE.CanvasTexture>();

/** Petite texture de pixel-art (bruit de 2 couleurs, yeux éventuels). */
function partTexture(color: string, color2: string | undefined, eyes: string | undefined, seed: string, w: number, h: number): THREE.CanvasTexture {
  const key = `${color}|${color2}|${eyes}|${w}|${h}|${seed}`;
  const hit = texCache.get(key);
  if (hit) return hit;
  const tw = Math.max(2, Math.min(16, w)),
    th = Math.max(2, Math.min(16, h));
  const c = document.createElement('canvas');
  c.width = tw;
  c.height = th;
  const g = c.getContext('2d')!;
  const a = hexToRgb(color);
  const b = hexToRgb(color2 ?? color);
  const rng = new Rng(hashString(key));
  for (let y = 0; y < th; y++)
    for (let x = 0; x < tw; x++) {
      const useB = color2 ? rng.next() < 0.35 || (y + x * 3) % 7 === 0 : false;
      const base = useB ? b : a;
      const f = 0.88 + rng.next() * 0.2;
      g.fillStyle = `rgb(${Math.min(255, base[0] * f) | 0},${Math.min(255, base[1] * f) | 0},${Math.min(255, base[2] * f) | 0})`;
      g.fillRect(x, y, 1, 1);
    }
  if (eyes) {
    const e = hexToRgb(eyes);
    const ey = Math.max(1, Math.floor(th * 0.35));
    const ex1 = Math.max(0, Math.floor(tw * 0.2)),
      ex2 = Math.min(tw - 1, Math.ceil(tw * 0.8) - 1);
    g.fillStyle = `rgb(${e[0]},${e[1]},${e[2]})`;
    g.fillRect(ex1, ey, 1, 1);
    g.fillRect(ex2, ey, 1, 1);
    g.fillStyle = 'rgba(255,255,255,0.8)';
    if (tw >= 6) {
      g.fillRect(ex1 + 1, ey, 1, 1);
      g.fillRect(ex2 - 1, ey, 1, 1);
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  t.colorSpace = THREE.NoColorSpace;
  texCache.set(key, t);
  return t;
}

function shadedBox(w: number, h: number, d: number): THREE.BoxGeometry {
  const g = new THREE.BoxGeometry(w, h, d);
  const shade = [0.78, 0.78, 1, 0.55, 0.9, 0.7]; // +x −x +y −y +z −z
  const cols: number[] = [];
  for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) cols.push(shade[f], shade[f], shade[f]);
  g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3));
  return g;
}

/** Construit un modèle de boîtes ; chaque partie a un pivot animable. */
function buildParts(parts: ModelPart[], scale: number, seed: string): { root: THREE.Group; nodes: PartNode[] } {
  const root = new THREE.Group();
  const byId = new Map<string, THREE.Group>();
  const nodes: PartNode[] = [];
  const s = scale / 16;
  for (const p of parts) {
    const [w, h, d] = p.size;
    const [x, y, z] = p.pos; // coin min, en pixels, relatif aux pieds
    const pv = p.pivot ?? [x + w / 2, y + h, z + d / 2];
    const pivot = new THREE.Group();
    const parent = p.parent ? byId.get(p.parent) : undefined;
    const ppv = p.parent ? (parts.find((q) => q.id === p.parent)?.pivot ?? [0, 0, 0]) : [0, 0, 0];
    if (parent) {
      const pp = parts.find((q) => q.id === p.parent)!;
      const ppiv = pp.pivot ?? [pp.pos[0] + pp.size[0] / 2, pp.pos[1] + pp.size[1], pp.pos[2] + pp.size[2] / 2];
      pivot.position.set((pv[0] - ppiv[0]) * s, (pv[1] - ppiv[1]) * s, (pv[2] - ppiv[2]) * s);
      parent.add(pivot);
    } else {
      pivot.position.set(pv[0] * s, pv[1] * s, pv[2] * s);
      root.add(pivot);
    }
    void ppv;
    const mats: THREE.MeshBasicMaterial[] = [];
    const side = partTexture(p.color, p.color2, undefined, seed + p.id, Math.max(w, d), h);
    const top = partTexture(p.color, p.color2, undefined, seed + p.id + 't', w, d);
    const front = p.eyes ? partTexture(p.color, p.color2, p.eyes, seed + p.id + 'f', w, h) : side;
    for (let f = 0; f < 6; f++) {
      const map = f === 2 || f === 3 ? top : f === 5 ? front : side;
      mats.push(new THREE.MeshBasicMaterial({ map, vertexColors: true, transparent: false }));
    }
    const mesh = new THREE.Mesh(shadedBox(w * s, h * s, d * s), mats);
    // la face −Z (avant du modèle) porte les yeux
    mesh.position.set((x + w / 2 - pv[0]) * s, (y + h / 2 - pv[1]) * s, (z + d / 2 - pv[2]) * s);
    pivot.add(mesh);
    if (p.rot) pivot.rotation.set(p.rot[0], p.rot[1], p.rot[2]);
    byId.set(p.id, pivot);
    nodes.push({ def: p, pivot, mats, baseRot: pivot.rotation.clone() });
  }
  return { root, nodes };
}

/** Modèle du joueur (création originale : aventurier à écharpe). */
export const PLAYER_PARTS: ModelPart[] = [
  { id: 'body', size: [8, 12, 4], pos: [-4, 12, -2], pivot: [0, 24, 0], color: '#2a6a8a', color2: '#245a78', role: 'body' },
  { id: 'head', size: [8, 8, 8], pos: [-4, 24, -4], pivot: [0, 24, 0], color: '#e8b88a', eyes: '#1a1a2a', role: 'head' },
  { id: 'hair', size: [8, 3, 8], pos: [-4, 29, -4], pivot: [0, 24, 0], color: '#5a3a24', parent: 'head' },
  { id: 'scarf', size: [9, 2, 5], pos: [-4.5, 22, -2.5], pivot: [0, 24, 0], color: '#d04a2a', color2: '#b03a20', parent: 'body' },
  { id: 'arm_r', size: [4, 12, 4], pos: [4, 12, -2], pivot: [6, 22, 0], color: '#2a6a8a', color2: '#e8b88a', role: 'arm_r' },
  { id: 'arm_l', size: [4, 12, 4], pos: [-8, 12, -2], pivot: [-6, 22, 0], color: '#2a6a8a', color2: '#e8b88a', role: 'arm_l' },
  { id: 'leg_r', size: [4, 12, 4], pos: [0, 0, -2], pivot: [2, 12, 0], color: '#3a3a5a', color2: '#4a2a1a', role: 'leg_r' },
  { id: 'leg_l', size: [4, 12, 4], pos: [-4, 0, -2], pivot: [-2, 12, 0], color: '#3a3a5a', color2: '#4a2a1a', role: 'leg_l' },
];

export class EntityRenderer {
  readonly group = new THREE.Group();
  private views = new Map<number, View>();
  private tmp = new THREE.Vector3();
  /** Joueur local (masqué en vue subjective). */
  localPlayerId = -1;
  showLocalPlayer = false;

  constructor(
    private creatures: Map<string, CreatureDef>,
    private models: ItemModels,
  ) {}

  private makeModelView(kind: string, parts: ModelPart[], scale: number, seed: string): View {
    const { root, nodes } = buildParts(parts, scale, seed);
    const group = new THREE.Group();
    group.add(root);
    const view: View = {
      kind,
      root: group,
      parts: nodes,
      walk: 0,
      lastX: 0,
      lastZ: 0,
      dispose: () => {
        for (const n of nodes) for (const m of n.mats) m.dispose();
        if (view.held) view.held.model.dispose();
      },
      update: (e, alpha, dt, light, daylight) => this.animateModel(view, e, alpha, dt, light, daylight),
    };
    return view;
  }

  private makeView(e: Entity): View | null {
    if (e.kind === 'player') return this.makeModelView('player', PLAYER_PARTS, 0.9375, 'joueur');
    if (e.kind === 'mob') {
      const type = (e as unknown as { type: string }).type;
      const def = this.creatures.get(type);
      if (!def) return null;
      return this.makeModelView('mob', def.model.parts, def.model.scale ?? 1, type);
    }
    if (e.kind === 'item') {
      const stack = (e as unknown as { stack: { id: string } }).stack;
      const model = this.models.create(stack.id);
      const root = new THREE.Group();
      model.obj.scale.multiplyScalar(model.isBlock ? 0.28 : 0.42);
      root.add(model.obj);
      const phase = Math.random() * 6;
      return {
        kind: 'item',
        root,
        parts: [],
        item: model,
        walk: phase,
        lastX: 0,
        lastZ: 0,
        dispose: () => model.dispose(),
        update: (ent, alpha, dt, light, day) => {
          const v = this.lerp(ent, alpha);
          const t = performance.now() / 1000 + phase;
          root.position.set(v.x, v.y + 0.18 + Math.sin(t * 2) * 0.06, v.z);
          model.obj.rotation.y = t * 1.2;
          model.setLight(light.sky, light.block, day);
          void dt;
        },
      };
    }
    if (e.kind === 'projectile') {
      const type = (e as unknown as { type: string }).type;
      const root = new THREE.Group();
      let mesh: THREE.Mesh;
      const glow = ['boule_feu', 'boule_braise', 'crachat_magma', 'eclat_givre', 'rayon_cristal', 'orbe_vide'].includes(type);
      if (type === 'fleche' || type === 'epine') {
        mesh = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.6), new THREE.MeshBasicMaterial({ color: type === 'fleche' ? 0x8a6238 : 0x4a7a2a }));
      } else {
        const color = { boule_feu: 0xff7a2a, boule_braise: 0xff5a1a, crachat_magma: 0xff8a2a, eclat_givre: 0xaee8ff, rayon_cristal: 0xd8b8ff, orbe_vide: 0x8a3ad8, bombe_spore: 0xb8c84a, boule_neige: 0xf4f8ff }[type] ?? 0xffffff;
        const size = type === 'boule_braise' ? 0.6 : type === 'orbe_vide' ? 0.45 : 0.25;
        mesh = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshBasicMaterial({ color }));
      }
      root.add(mesh);
      return {
        kind: 'projectile',
        root,
        parts: [],
        walk: 0,
        lastX: 0,
        lastZ: 0,
        dispose: () => {
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        },
        update: (ent, alpha, dt, light, day) => {
          const v = this.lerp(ent, alpha);
          root.position.set(v.x, v.y, v.z);
          root.rotation.set(0, ent.yaw, 0);
          mesh.rotation.x = -ent.pitch;
          if (glow) mesh.rotation.z += dt * 6;
          void light;
          void day;
        },
      };
    }
    if (e.kind === 'grave') {
      const root = new THREE.Group();
      const stone = new THREE.Mesh(shadedBox(0.7, 0.9, 0.2), new THREE.MeshBasicMaterial({ color: 0x9a9aa4, vertexColors: true }));
      stone.position.y = 0.45;
      const base = new THREE.Mesh(shadedBox(0.9, 0.15, 0.5), new THREE.MeshBasicMaterial({ color: 0x6a6a74, vertexColors: true }));
      base.position.y = 0.075;
      const cross = new THREE.Mesh(shadedBox(0.08, 0.4, 0.05), new THREE.MeshBasicMaterial({ color: 0xffe080 }));
      cross.position.set(0, 0.6, -0.11);
      root.add(stone, base, cross);
      return {
        kind: 'grave',
        root,
        parts: [],
        walk: 0,
        lastX: 0,
        lastZ: 0,
        dispose: () => {
          for (const m of [stone, base, cross]) {
            m.geometry.dispose();
            (m.material as THREE.Material).dispose();
          }
        },
        update: (ent, _a, _dt, light, day) => {
          root.position.set(ent.x, ent.y, ent.z);
          const l = Math.max(light.sky * day, light.block, 0.2);
          (stone.material as THREE.MeshBasicMaterial).color.setRGB(0.6 * l, 0.6 * l, 0.65 * l);
          (base.material as THREE.MeshBasicMaterial).color.setRGB(0.42 * l, 0.42 * l, 0.46 * l);
        },
      };
    }
    return null;
  }

  private lerp(e: Entity, alpha: number): THREE.Vector3 {
    return this.tmp.set(e.px + (e.x - e.px) * alpha, e.py + (e.y - e.py) * alpha, e.pz + (e.z - e.pz) * alpha);
  }

  private animateModel(v: View, e: Entity, alpha: number, dt: number, light: { sky: number; block: number }, daylight: number): void {
    const p = this.lerp(e, alpha);
    const le = e as unknown as { hurtTime?: number; dead?: boolean; deathTime?: number; swing?: number; anim?: string; pitch: number; bodyYaw?: number; heldItem?: string | null; flying?: boolean; glow?: boolean; sneaking?: boolean };
    v.root.position.set(p.x, p.y, p.z);
    const yaw = le.bodyYaw ?? e.yaw;
    v.root.rotation.set(0, yaw, 0);
    const dx = p.x - v.lastX,
      dz = p.z - v.lastZ;
    v.lastX = p.x;
    v.lastZ = p.z;
    const speed = Math.min(1, Math.hypot(dx, dz) / Math.max(dt, 1e-3) / 4);
    v.walk += dt * (4 + speed * 8) * (speed > 0.05 ? 1 : 0);
    const sw = Math.sin(v.walk) * 0.7 * speed;
    const t = performance.now() / 1000;
    const swing = le.swing ?? 0;
    // lumière + teinte de blessure
    const base = Math.max(light.sky * daylight, light.block, 0.12);
    const hurt = (le.hurtTime ?? 0) > 0 || le.dead;
    for (const n of v.parts) {
      const glow = n.def.glow;
      const l = glow ? 1 : base;
      for (const m of n.mats) {
        if (hurt) m.color.setRGB(l, l * 0.35, l * 0.35);
        else m.color.setRGB(l, l, l * (light.block > light.sky * daylight ? 0.9 : 1));
      }
      const r = n.def.role;
      n.pivot.rotation.copy(n.baseRot);
      if (!r) continue;
      if (r === 'head') {
        n.pivot.rotation.x = -e.pitch * 0.8;
        const headYaw = e.yaw - yaw;
        n.pivot.rotation.y = Math.atan2(Math.sin(headYaw), Math.cos(headYaw)) * 0.8;
      } else if (r === 'leg_fl' || r === 'leg_br' || r === 'leg_l') n.pivot.rotation.x = sw;
      else if (r === 'leg_fr' || r === 'leg_bl' || r === 'leg_r') n.pivot.rotation.x = -sw;
      else if (r === 'arm_l') n.pivot.rotation.x = -sw * 0.8;
      else if (r === 'arm_r') n.pivot.rotation.x = sw * 0.8 - Math.sin(swing * Math.PI) * 1.6;
      else if (r === 'arms') n.pivot.rotation.x = -Math.PI / 2.2 + Math.sin(t * 2) * 0.05 - Math.sin(swing * Math.PI) * 0.6;
      else if (r === 'wing_l') n.pivot.rotation.z = Math.sin(t * 14) * 0.7 + 0.2;
      else if (r === 'wing_r') n.pivot.rotation.z = -Math.sin(t * 14) * 0.7 - 0.2;
      else if (r === 'tail') n.pivot.rotation.y = Math.sin(t * 3 + v.walk) * 0.4;
      else if (r === 'jaw') n.pivot.rotation.x = Math.max(0, Math.sin(t * 6)) * 0.3 + swing * 0.6;
      else if (r === 'float') n.pivot.position.y += Math.sin(t * 2) * 0.002;
      else if (r === 'spin') n.pivot.rotation.y = t * 1.5;
      else if (r === 'pulse') n.pivot.scale.setScalar(1 + Math.sin(t * 4) * 0.06);
      else if (r === 'tentacle') n.pivot.rotation.x = Math.sin(t * 2 + n.def.pos[0]) * 0.35;
    }
    if (le.sneaking) v.root.position.y -= 0.12;
    // mort : bascule sur le côté
    if (le.dead) {
      const k = Math.min(1, (le.deathTime ?? 0) * 2.5);
      v.root.rotation.z = (k * Math.PI) / 2;
    } else v.root.rotation.z = 0;
    // objet tenu (joueurs, humanoïdes)
    const heldId = le.heldItem ?? null;
    if (v.held && v.held.id !== heldId) {
      v.held.node.remove(v.held.model.obj);
      v.held.model.dispose();
      v.held = undefined;
    }
    if (heldId && !v.held) {
      const arm = v.parts.find((n) => n.def.role === 'arm_r');
      if (arm) {
        const model = this.models.create(heldId);
        model.obj.scale.multiplyScalar(model.isBlock ? 0.3 : 0.55);
        model.obj.position.set(0, -0.62, -0.18);
        model.obj.rotation.set(-Math.PI / 2 + 0.3, 0, 0);
        arm.pivot.add(model.obj);
        v.held = { model, id: heldId, node: arm.pivot };
      }
    }
    v.held?.model.setLight(light.sky, light.block, daylight);
  }

  /** Synchronise les vues avec les entités de la dimension courante. */
  sync(entities: Iterable<Entity>, dim: string, alpha: number, dt: number, lightAt: LightFn, daylight: number): void {
    const seen = new Set<number>();
    for (const e of entities) {
      if (e.removed || e.dim !== dim) continue;
      if (e.id === this.localPlayerId && !this.showLocalPlayer) continue;
      seen.add(e.id);
      let v = this.views.get(e.id);
      if (!v) {
        const nv = this.makeView(e);
        if (!nv) continue;
        v = nv;
        this.views.set(e.id, v);
        this.group.add(v.root);
      }
      const l = lightAt(Math.floor(e.x), Math.floor(e.y + 0.5), Math.floor(e.z));
      v.update(e, alpha, dt, l, daylight);
    }
    for (const [id, v] of this.views) {
      if (seen.has(id)) continue;
      this.group.remove(v.root);
      v.dispose();
      this.views.delete(id);
    }
  }

  clear(): void {
    for (const [, v] of this.views) {
      this.group.remove(v.root);
      v.dispose();
    }
    this.views.clear();
  }
}
