/**
 * Icônes d'inventaire : blocs en perspective isométrique (dessus + deux côtés ombrés),
 * plantes et objets en image plate. Régénérées quand un pack de ressources change.
 */
import { BLOCKS, Tint, type BlockDef } from '../world/blocks';
import { ITEMS, type ItemDef } from '../items/items';
import { paintItemIcon } from './textures/itemTextures';
import type { TextureAtlas } from './TextureAtlas';

const ICON = 64;
const FLAT_SHAPES = new Set(['cross', 'torch', 'ladder', 'vine', 'rail', 'lily', 'wire', 'crop', 'door', 'lever', 'button', 'fire', 'portal', 'lantern', 'campfire']);

export class ItemIcons {
  private cache = new Map<string, string>();
  private texCanvas = new Map<string, HTMLCanvasElement>();
  version = 0;

  constructor(private atlas: TextureAtlas) {
    atlas.onChange(() => {
      this.cache.clear();
      this.texCanvas.clear();
      this.version++;
    });
  }

  /** Texture d'un bloc en canvas 16x16 (éventuellement teintée et ombrée). */
  private tex(name: string, tint = 0xffffff, shade = 1): HTMLCanvasElement {
    const key = `${name}|${tint}|${shade}`;
    let c = this.texCanvas.get(key);
    if (c) return c;
    c = document.createElement('canvas');
    c.width = c.height = 16;
    const g = c.getContext('2d')!;
    const img = g.createImageData(16, 16);
    const px = this.atlas.pixels(name);
    const tr = ((tint >> 16) & 255) / 255;
    const tg = ((tint >> 8) & 255) / 255;
    const tb = (tint & 255) / 255;
    for (let i = 0; i < 256 * 4; i += 4) {
      img.data[i] = px[i] * tr * shade;
      img.data[i + 1] = px[i + 1] * tg * shade;
      img.data[i + 2] = px[i + 2] * tb * shade;
      img.data[i + 3] = px[i + 3];
    }
    g.putImageData(img, 0, 0);
    this.texCanvas.set(key, c);
    return c;
  }

  /** Côté du bloc d'herbe : terre + bordure teintée. */
  private grassSide(shade: number): HTMLCanvasElement {
    const c = document.createElement('canvas');
    c.width = c.height = 16;
    const g = c.getContext('2d')!;
    g.drawImage(this.tex('grass_side', 0xffffff, shade), 0, 0);
    g.drawImage(this.tex('grass_side_overlay', 0x91bd59, shade), 0, 0);
    return c;
  }

  private tintOf(b: BlockDef): number {
    if (b.tint === Tint.Grass) return 0x91bd59;
    if (b.tint === Tint.Foliage) return 0x77ab2f;
    if (b.tint === Tint.Water) return 0x44aff5;
    if (b.tint === Tint.Fixed) return b.tintColor;
    return 0xffffff;
  }

  get(itemId: number, data?: Record<string, unknown>): string {
    const def = ITEMS[itemId];
    if (!def) return '';
    const key = def.key + (data?.color ?? '');
    let url = this.cache.get(key);
    if (!url) {
      url = this.render(def);
      this.cache.set(key, url);
    }
    return url;
  }

  private render(def: ItemDef): string {
    const c = document.createElement('canvas');
    c.width = c.height = ICON;
    const g = c.getContext('2d')!;
    g.imageSmoothingEnabled = false;
    const painted = paintItemIcon(def.icon ?? def.key, def.data);
    if (painted && !(def.block !== undefined && def.block === def.id)) {
      const tc = document.createElement('canvas');
      tc.width = tc.height = 16;
      const img = tc.getContext('2d')!.createImageData(16, 16);
      img.data.set(painted.data);
      tc.getContext('2d')!.putImageData(img, 0, 0);
      g.drawImage(tc, 0, 0, ICON, ICON);
      return c.toDataURL();
    }
    const b = def.block !== undefined ? BLOCKS[def.block] : undefined;
    if (!b) {
      g.fillStyle = '#f0f';
      g.fillRect(16, 16, 32, 32);
      return c.toDataURL();
    }
    if (FLAT_SHAPES.has(b.shape) || b.key === 'iron_bars' || b.key === 'glass_pane' || b.key === 'cobweb') {
      let name = b.tex.top;
      if (b.shape === 'torch') name = 'torch';
      if (b.shape === 'door') name = b.tex.bottom;
      if (b.shape === 'lever') name = 'lever_handle';
      if (b.shape === 'campfire') name = 'campfire_fire';
      if (b.shape === 'lantern') name = 'lantern';
      g.drawImage(this.tex(name, this.tintOf(b)), 4, 4, ICON - 8, ICON - 8);
      return c.toDataURL();
    }
    this.drawIso(g, b);
    return c.toDataURL();
  }

  private drawIso(g: CanvasRenderingContext2D, b: BlockDef): void {
    const k = 1.75;
    const cx = ICON / 2;
    const cy = ICON / 2 + 2;
    const proj = (x: number, y: number, z: number): [number, number] => [cx + (x - z) * k * 0.866, cy + (x + z - 16) * k * 0.5 - (y - 8) * k];
    const boxes = this.iconBoxes(b);
    const tint = this.tintOf(b);
    const topTint = b.key === 'grass_block' ? 0x91bd59 : tint;
    const sideTint = b.key === 'grass_block' ? 0xffffff : tint;
    for (const [x0, y0, z0, x1, y1, z1] of boxes) {
      // Face +Z (gauche à l'écran)
      const south = b.key === 'grass_block' ? this.grassSide(0.8) : this.tex(b.tex.south, sideTint, 0.8);
      this.face(g, south, proj(x0, y1, z1), proj(x0 + 1, y1, z1), proj(x0, y1 - 1, z1), x0, 16 - y1, x1 - x0, y1 - y0);
      // Face +X (droite)
      const east = b.key === 'grass_block' ? this.grassSide(0.62) : this.tex(b.front && b.orient === 'facing' ? b.tex.east : b.tex.east, sideTint, 0.62);
      this.face(g, east, proj(x1, y1, z1), proj(x1, y1, z1 - 1), proj(x1, y1 - 1, z1), 16 - z1, 16 - y1, z1 - z0, y1 - y0);
      // Dessus
      const top = this.tex(b.tex.top, topTint, 1);
      this.face(g, top, proj(x0, y1, z0), proj(x0 + 1, y1, z0), proj(x0, y1, z0 + 1), x0, z0, x1 - x0, z1 - z0);
    }
  }

  /** Dessine une portion (sx,sy,sw,sh) de la texture sur le parallélogramme défini par o, o+u, o+v. */
  private face(g: CanvasRenderingContext2D, tex: HTMLCanvasElement, o: [number, number], pu: [number, number], pv: [number, number], sx: number, sy: number, sw: number, sh: number): void {
    const ux = pu[0] - o[0];
    const uy = pu[1] - o[1];
    const vx = pv[0] - o[0];
    const vy = pv[1] - o[1];
    g.save();
    g.setTransform(ux * 1.02, uy * 1.02, vx * 1.02, vy * 1.02, o[0], o[1]);
    g.drawImage(tex, sx, sy, sw, sh, 0, 0, sw, sh);
    g.restore();
  }

  private iconBoxes(b: BlockDef): number[][] {
    switch (b.shape) {
      case 'slab':
        return [[0, 0, 0, 16, 8, 16]];
      case 'stairs':
        return [
          [0, 0, 0, 16, 8, 16],
          [0, 8, 0, 16, 16, 8],
        ];
      case 'carpet':
        return [[0, 0, 0, 16, 1, 16]];
      case 'layer':
        return [[0, 0, 0, 16, 2, 16]];
      case 'plate':
        return [[1, 0, 1, 15, 1, 15]];
      case 'farmland':
        return [[0, 0, 0, 16, 15, 16]];
      case 'chest':
        return [[1, 0, 1, 15, 14, 15]];
      case 'cactus':
        return [[1, 0, 1, 15, 16, 15]];
      case 'bed':
        return [[0, 0, 0, 16, 9, 16]];
      case 'trapdoor':
        return [[0, 0, 0, 16, 3, 16]];
      case 'fence':
        return [
          [6, 0, 6, 10, 16, 10],
          [7, 6, 0, 9, 9, 16],
          [7, 12, 0, 9, 15, 16],
        ];
      default:
        return [[0, 0, 0, 16, 16, 16]];
    }
  }
}
