/**
 * Modèles cubiques animables (joueur, créatures, boss) : parties articulées
 * (tête, corps, pattes…) avec une texture « peau » peinte procéduralement.
 */
import * as THREE from 'three';
import { Rng } from '../util/random';

export interface PartDef {
  name: string;
  parent?: string;
  /** Taille de la boîte en pixels (1/16 de bloc). */
  size: [number, number, number];
  /** Pivot relatif au parent (pixels). */
  pivot: [number, number, number];
  /** Coin minimal de la boîte relatif au pivot (pixels). */
  offset: [number, number, number];
  /** Emplacement de la disposition « boîte » dans la peau. */
  uv: [number, number];
  /** Rotation de repos (radians). */
  rot?: [number, number, number];
  /** Partie semi-transparente (spectres, slimes). */
  translucent?: boolean;
}

export interface ModelDef {
  texW: number;
  texH: number;
  parts: PartDef[];
  scale?: number;
  paint: (s: Skin) => void;
  translucent?: boolean;
  emissive?: boolean;
}

/** Outil de peinture de peau avec disposition de boîte (dessus, dessous, droite, avant, gauche, arrière). */
export class Skin {
  readonly ctx: CanvasRenderingContext2D;
  readonly canvas: HTMLCanvasElement;
  readonly rng: Rng;
  constructor(
    readonly w: number,
    readonly h: number,
    seed = 1,
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx = this.canvas.getContext('2d')!;
    this.rng = new Rng(seed);
  }

  px(x: number, y: number, c: number, a = 1): void {
    this.ctx.fillStyle = rgba(c, a);
    this.ctx.fillRect(x, y, 1, 1);
  }

  rect(x: number, y: number, w: number, h: number, c: number, noise = 0, a = 1): void {
    for (let j = 0; j < h; j++)
      for (let i = 0; i < w; i++) {
        const f = noise ? 1 + (this.rng.next() - 0.5) * 2 * noise : 1;
        this.px(x + i, y + j, shade(c, f), a);
      }
  }

  /** Régions des faces d'une boîte (u, v, largeur w, hauteur h, profondeur d). */
  faces(u: number, v: number, w: number, h: number, d: number) {
    return {
      top: [u + d, v, w, d],
      bottom: [u + d + w, v, w, d],
      right: [u, v + d, d, h],
      front: [u + d, v + d, w, h],
      left: [u + d + w, v + d, d, h],
      back: [u + 2 * d + w, v + d, w, h],
    } as Record<'top' | 'bottom' | 'right' | 'front' | 'left' | 'back', [number, number, number, number]>;
  }

  /** Peint toutes les faces d'une boîte (couleur de base, variantes par face). */
  box(u: number, v: number, w: number, h: number, d: number, color: number, noise = 0.06, per: Partial<Record<'top' | 'bottom' | 'right' | 'front' | 'left' | 'back', number>> = {}, alpha = 1): ReturnType<Skin['faces']> {
    const f = this.faces(u, v, w, h, d);
    for (const k of Object.keys(f) as Array<keyof typeof f>) {
      const [x, y, ww, hh] = f[k];
      this.rect(x, y, ww, hh, per[k] ?? color, noise, alpha);
    }
    return f;
  }

  /** Taches aléatoires dans une région. */
  spots(region: [number, number, number, number], c: number, count: number, r = 1.5): void {
    const [x, y, w, h] = region;
    for (let i = 0; i < count; i++) {
      const cx = x + this.rng.next() * w;
      const cy = y + this.rng.next() * h;
      for (let j = Math.floor(cy - r); j <= cy + r; j++)
        for (let k = Math.floor(cx - r); k <= cx + r; k++) {
          if (k < x || k >= x + w || j < y || j >= y + h) continue;
          if ((k - cx) ** 2 + (j - cy) ** 2 <= r * r) this.px(k, j, shade(c, 1 + (this.rng.next() - 0.5) * 0.1));
        }
    }
  }
}

export function rgba(c: number, a = 1): string {
  return `rgba(${(c >> 16) & 255},${(c >> 8) & 255},${c & 255},${a})`;
}

export function shade(c: number, f: number): number {
  const r = Math.max(0, Math.min(255, Math.round(((c >> 16) & 255) * f)));
  const g = Math.max(0, Math.min(255, Math.round(((c >> 8) & 255) * f)));
  const b = Math.max(0, Math.min(255, Math.round((c & 255) * f)));
  return (r << 16) | (g << 8) | b;
}

/** Instance d'un modèle : groupes articulés prêts à animer. */
export class ModelInstance {
  readonly root = new THREE.Group();
  readonly parts = new Map<string, THREE.Group>();
  readonly material: THREE.MeshBasicMaterial;

  constructor(
    def: ModelDef,
    texture: THREE.Texture,
    private shared: Map<string, THREE.BufferGeometry>,
    key: string,
  ) {
    this.material = new THREE.MeshBasicMaterial({ map: texture, transparent: !!def.translucent, alphaTest: def.translucent ? 0.05 : 0.5, opacity: def.translucent ? 0.75 : 1, side: THREE.FrontSide });
    const scale = (def.scale ?? 1) / 16;
    const inner = new THREE.Group();
    inner.scale.setScalar(scale);
    this.root.add(inner);
    for (const p of def.parts) {
      const g = new THREE.Group();
      g.position.set(p.pivot[0], p.pivot[1], p.pivot[2]);
      if (p.rot) g.rotation.set(p.rot[0], p.rot[1], p.rot[2]);
      const gkey = key + ':' + p.name;
      let geo = this.shared.get(gkey);
      if (!geo) {
        geo = partGeometry(p, def.texW, def.texH);
        this.shared.set(gkey, geo);
      }
      const mesh = new THREE.Mesh(geo, this.material);
      g.add(mesh);
      g.userData.rest = g.rotation.clone();
      this.parts.set(p.name, g);
      const parent = p.parent ? this.parts.get(p.parent) : undefined;
      (parent ?? inner).add(g);
    }
  }

  part(name: string): THREE.Group | undefined {
    return this.parts.get(name);
  }

  /** Remet une partie dans sa rotation de repos puis applique (x, y, z). */
  pose(name: string, x = 0, y = 0, z = 0): void {
    const g = this.parts.get(name);
    if (!g) return;
    const r = g.userData.rest as THREE.Euler;
    g.rotation.set(r.x + x, r.y + y, r.z + z);
  }

  setLight(l: number, hurt: boolean): void {
    if (hurt) this.material.color.setRGB(1, l * 0.4, l * 0.4);
    else this.material.color.setRGB(l, l, l);
  }

  dispose(): void {
    this.material.dispose();
    this.root.removeFromParent();
  }
}

function partGeometry(p: PartDef, tw: number, th: number): THREE.BufferGeometry {
  const [w, h, d] = p.size;
  const geo = new THREE.BoxGeometry(w, h, d);
  geo.translate(p.offset[0] + w / 2, p.offset[1] + h / 2, p.offset[2] + d / 2);
  const [u, v] = p.uv;
  const regions = {
    top: [u + d, v, w, d],
    bottom: [u + d + w, v, w, d],
    right: [u, v + d, d, h],
    front: [u + d, v + d, w, h],
    left: [u + d + w, v + d, d, h],
    back: [u + 2 * d + w, v + d, w, h],
  };
  // Faces de BoxGeometry : +X, -X, +Y, -Y, +Z, -Z ; l'entité regarde vers -Z.
  const order: Array<[keyof typeof regions, boolean]> = [
    ['right', false],
    ['left', false],
    ['top', true],
    ['bottom', false],
    ['back', false],
    ['front', false],
  ];
  const uv = geo.getAttribute('uv') as THREE.BufferAttribute;
  for (let f = 0; f < 6; f++) {
    const [name, rot180] = order[f];
    const [x, y, ww, hh] = regions[name];
    let U0 = x / tw;
    let U1 = (x + ww) / tw;
    let Vt = 1 - y / th;
    let Vb = 1 - (y + hh) / th;
    if (rot180) {
      [U0, U1] = [U1, U0];
      [Vt, Vb] = [Vb, Vt];
    }
    for (let k = 0; k < 4; k++) uv.setXY(f * 4 + k, k % 2 ? U1 : U0, k < 2 ? Vt : Vb);
  }
  uv.needsUpdate = true;
  return geo;
}

/** Fabrique de modèles : peint chaque peau une fois et partage géométries et textures. */
export class ModelFactory {
  private textures = new Map<string, THREE.Texture>();
  private geos = new Map<string, THREE.BufferGeometry>();
  readonly skins = new Map<string, HTMLCanvasElement>();

  constructor(private defs: Record<string, ModelDef>) {}

  texture(key: string, variant = ''): THREE.Texture {
    const k = key + variant;
    let t = this.textures.get(k);
    if (t) return t;
    const def = this.defs[key];
    const s = new Skin(def.texW, def.texH, hashKey(k));
    def.paint(s);
    this.skins.set(k, s.canvas);
    t = new THREE.CanvasTexture(s.canvas);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.colorSpace = THREE.NoColorSpace;
    this.textures.set(k, t);
    return t;
  }

  create(key: string): ModelInstance {
    const def = this.defs[key];
    if (!def) throw new Error('Modèle inconnu : ' + key);
    return new ModelInstance(def, this.texture(key), this.geos, key);
  }

  /** Remplace la peau d'un modèle (vestiaire du joueur). */
  setSkinCanvas(key: string, canvas: HTMLCanvasElement): THREE.Texture {
    const t = new THREE.CanvasTexture(canvas);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.colorSpace = THREE.NoColorSpace;
    this.textures.set(key, t);
    return t;
  }

  has(key: string): boolean {
    return key in this.defs;
  }
}

function hashKey(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}
