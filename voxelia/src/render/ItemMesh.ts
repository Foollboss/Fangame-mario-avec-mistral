/**
 * Modèles 3D des objets tenus en main ou posés au sol :
 *  - blocs : petit cube texturé (faces ombrées) ;
 *  - objets : image 16x16 extrudée en volume (pixel par pixel), icône du pack de
 *    ressources actif en priorité.
 */
import * as THREE from 'three';
import { BLOCKS, Tint, type BlockDef } from '../world/blocks';
import { ITEMS } from '../items/items';
import { FOLIAGE_COLORS, GRASS_COLORS, ICON_BIOME } from '../world/biomes';
import { itemOverridePixels, onItemTexturesChange } from '../packs/itemOverrides';
import { paintItemIcon } from './textures/itemTextures';
import type { TextureAtlas } from './TextureAtlas';

const CUBE_SHAPES = new Set(['cube', 'slab', 'stairs', 'chest', 'farmland', 'cactus', 'layer', 'carpet', 'bed', 'trapdoor', 'plate', 'fence']);

export class ItemMeshFactory {
  private texCache = new Map<string, THREE.Texture>();
  private geoCache = new Map<string, { geo: THREE.BufferGeometry; tex: THREE.Texture | THREE.Texture[] }>();

  constructor(private atlas: TextureAtlas) {
    const flush = () => {
      this.texCache.clear();
      this.geoCache.clear();
    };
    atlas.onChange(flush);
    onItemTexturesChange(flush);
  }

  private pixels(name: string, tint = 0xffffff): Uint8ClampedArray {
    const src = this.atlas.pixels(name);
    const out = new Uint8ClampedArray(src.length);
    const tr = ((tint >> 16) & 255) / 255;
    const tg = ((tint >> 8) & 255) / 255;
    const tb = (tint & 255) / 255;
    for (let i = 0; i < src.length; i += 4) {
      out[i] = src[i] * tr;
      out[i + 1] = src[i + 1] * tg;
      out[i + 2] = src[i + 2] * tb;
      out[i + 3] = src[i + 3];
    }
    return out;
  }

  private texture(key: string, data: Uint8ClampedArray): THREE.Texture {
    let t = this.texCache.get(key);
    if (t) return t;
    const c = document.createElement('canvas');
    c.width = c.height = 16;
    const g = c.getContext('2d')!;
    const img = g.createImageData(16, 16);
    img.data.set(data);
    g.putImageData(img, 0, 0);
    t = new THREE.CanvasTexture(c);
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.colorSpace = THREE.NoColorSpace;
    this.texCache.set(key, t);
    return t;
  }

  private tintOf(b: BlockDef): number {
    if (b.tint === Tint.Grass) return GRASS_COLORS[ICON_BIOME];
    if (b.tint === Tint.Foliage) return FOLIAGE_COLORS[ICON_BIOME];
    if (b.tint === Tint.Fixed) return b.tintColor;
    return 0xffffff;
  }

  /** Crée un objet 3D (taille ~1 bloc pour un bloc, ~1 pour un objet plat). */
  create(itemId: number, light = 1): THREE.Mesh {
    const def = ITEMS[itemId];
    const b = def?.block !== undefined && def.block === def.id ? BLOCKS[def.block] : undefined;
    let entry = this.geoCache.get(String(itemId));
    if (!entry) {
      entry = b && CUBE_SHAPES.has(b.shape) ? this.blockGeometry(b) : this.spriteGeometry(itemId);
      this.geoCache.set(String(itemId), entry);
    }
    const mats = (Array.isArray(entry.tex) ? entry.tex : [entry.tex]).map(
      (t) => new THREE.MeshBasicMaterial({ map: t, vertexColors: true, alphaTest: 0.5, side: THREE.DoubleSide, color: new THREE.Color(light, light, light) }),
    );
    const mesh = new THREE.Mesh(entry.geo, mats.length === 1 ? mats[0] : mats);
    mesh.userData.isBlock = !!(b && CUBE_SHAPES.has(b.shape));
    return mesh;
  }

  private blockGeometry(b: BlockDef): { geo: THREE.BufferGeometry; tex: THREE.Texture[] } {
    const geo = new THREE.BoxGeometry(1, b.shape === 'slab' ? 0.5 : b.shape === 'carpet' ? 0.07 : 1, 1);
    // ordre BoxGeometry : +X, -X, +Y, -Y, +Z, -Z
    const t = b.tex;
    const names = [t.east, t.west, t.top, t.bottom, t.south, t.north];
    const tint = this.tintOf(b);
    const texs = names.map((n, i) => {
      if (b.key === 'grass_block' && i !== 2 && i !== 3) {
        const base = this.pixels('grass_side');
        const ov = this.pixels('grass_side_overlay', tint);
        for (let k = 0; k < base.length; k += 4)
          if (ov[k + 3] > 127) {
            base[k] = ov[k];
            base[k + 1] = ov[k + 1];
            base[k + 2] = ov[k + 2];
            base[k + 3] = 255;
          }
        return this.texture('grass_side_mix', base);
      }
      const tt = b.key === 'grass_block' && i !== 2 ? 0xffffff : tint;
      return this.texture(n + '|' + tt, this.pixels(n, tt));
    });
    const shades = [0.62, 0.62, 1, 0.5, 0.8, 0.8];
    const colors: number[] = [];
    for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) colors.push(shades[f], shades[f], shades[f]);
    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    if (b.shape === 'slab') geo.translate(0, -0.25, 0);
    return { geo, tex: texs };
  }

  /** Image extrudée : faces avant/arrière texturées + bords colorés pixel par pixel. */
  private spriteGeometry(itemId: number): { geo: THREE.BufferGeometry; tex: THREE.Texture } {
    const def = ITEMS[itemId];
    let px: Uint8ClampedArray;
    let key = 'item:' + itemId;
    const painted = def ? (itemOverridePixels(def) ?? paintItemIcon(def.icon ?? def.key, def.data)?.data ?? null) : null;
    if (painted) px = painted;
    else {
      const b = def?.block !== undefined ? BLOCKS[def.block] : undefined;
      let name = b ? b.tex.top : 'stone';
      if (b?.shape === 'torch') name = 'torch';
      if (b?.shape === 'door') name = b.tex.bottom;
      px = this.pixels(name, b ? this.tintOf(b) : 0xffffff);
      key = 'blockitem:' + itemId;
    }
    const tex = this.texture(key, px);
    const pos: number[] = [];
    const uv: number[] = [];
    const col: number[] = [];
    const d = 1 / 32;
    const quad = (a: number[], b: number[], c: number[], e: number[], uvs: number[], shade: number) => {
      pos.push(...a, ...b, ...c, ...a, ...c, ...e);
      uv.push(uvs[0], uvs[1], uvs[2], uvs[3], uvs[4], uvs[5], uvs[0], uvs[1], uvs[4], uvs[5], uvs[6], uvs[7]);
      for (let i = 0; i < 6; i++) col.push(shade, shade, shade);
    };
    // avant / arrière (image entière)
    quad([-0.5, -0.5, d], [0.5, -0.5, d], [0.5, 0.5, d], [-0.5, 0.5, d], [0, 0, 1, 0, 1, 1, 0, 1], 1);
    quad([0.5, -0.5, -d], [-0.5, -0.5, -d], [-0.5, 0.5, -d], [0.5, 0.5, -d], [1, 0, 0, 0, 0, 1, 1, 1], 0.8);
    const opaque = (x: number, y: number) => x >= 0 && y >= 0 && x < 16 && y < 16 && px[(y * 16 + x) * 4 + 3] > 127;
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        if (!opaque(x, y)) continue;
        const x0 = x / 16 - 0.5;
        const x1 = (x + 1) / 16 - 0.5;
        const y1 = 0.5 - y / 16;
        const y0 = 0.5 - (y + 1) / 16;
        const u0 = (x + 0.25) / 16;
        const u1 = (x + 0.75) / 16;
        const v0 = 1 - (y + 0.75) / 16;
        const v1 = 1 - (y + 0.25) / 16;
        const uvs = [u0, v0, u1, v0, u1, v1, u0, v1];
        if (!opaque(x - 1, y)) quad([x0, y0, -d], [x0, y0, d], [x0, y1, d], [x0, y1, -d], uvs, 0.7);
        if (!opaque(x + 1, y)) quad([x1, y0, d], [x1, y0, -d], [x1, y1, -d], [x1, y1, d], uvs, 0.7);
        if (!opaque(x, y - 1)) quad([x0, y1, d], [x1, y1, d], [x1, y1, -d], [x0, y1, -d], uvs, 0.9);
        if (!opaque(x, y + 1)) quad([x0, y0, -d], [x1, y0, -d], [x1, y0, d], [x0, y0, d], uvs, 0.6);
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    return { geo, tex };
  }
}

/** Luminosité (0..1) d'un point du monde, cohérente avec le shader du terrain. */
export function brightness(sky: number, block: number, daylight: number): number {
  const curve = (l: number) => {
    const f = 1 - l / 15;
    return (1 - f) / (f * 3 + 1);
  };
  return Math.min(1, Math.max(curve(sky) * daylight, curve(block)) + 0.05);
}
