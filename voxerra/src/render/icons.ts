/**
 * Icônes d'objets : blocs en vue isométrique (textures procédurales) et objets
 * en pixel-art (gabarits colorés). Renvoie des URL de données mises en cache.
 */
import type { Content } from '../registry/content';
import { TextureLibrary, TEX } from './texgen';
import { ITEM_ART } from './itemArt';
import { Shape, TINT_GRASS, TINT_FOLIAGE, TINT_WATER, PASS_OPAQUE } from '../registry/blocks';
import { modelBoxes, type Box } from '../world/shapes';
import { hexToRgb } from '../engine/math';

const S = 64;
const DEFAULT_TINT: Record<number, [number, number, number]> = {
  [TINT_GRASS]: [123, 189, 74],
  [TINT_FOLIAGE]: [95, 163, 58],
  [TINT_WATER]: [63, 118, 228],
};

export const RARITY_COLORS: Record<string, string> = {
  common: '#ffffff',
  uncommon: '#ffff66',
  rare: '#66ffff',
  epic: '#ff77ff',
  legendary: '#ffb030',
};

export class IconFactory {
  private urls = new Map<string, string>();
  private texCanvas = new Map<string, HTMLCanvasElement>();
  private spritePx = new Map<string, Uint8ClampedArray>();

  constructor(
    readonly content: Content,
    readonly lib: TextureLibrary,
  ) {}

  /** Texture de bloc (teintée, rendue opaque si besoin) sous forme de canvas 16x16. */
  private blockTexture(name: string, tint: number, opaquePass: boolean): HTMLCanvasElement {
    const key = `${name}|${tint}|${opaquePass}`;
    let c = this.texCanvas.get(key);
    if (c) return c;
    c = document.createElement('canvas');
    c.width = c.height = TEX;
    const g = c.getContext('2d')!;
    const src = this.lib.pixels(name);
    const img = g.createImageData(TEX, TEX);
    const tc = DEFAULT_TINT[tint];
    for (let i = 0; i < src.length; i += 4) {
      let r = src[i],
        gg = src[i + 1],
        b = src[i + 2],
        a = src[i + 3];
      if (opaquePass) {
        const m = tc ? 1 - a / 255 : 0;
        if (tc) {
          r = r * (1 - m + (m * tc[0]) / 255);
          gg = gg * (1 - m + (m * tc[1]) / 255);
          b = b * (1 - m + (m * tc[2]) / 255);
        }
        a = 255;
      } else if (tc && a > 0) {
        r = (r * tc[0]) / 255;
        gg = (gg * tc[1]) / 255;
        b = (b * tc[2]) / 255;
      }
      img.data[i] = r;
      img.data[i + 1] = gg;
      img.data[i + 2] = b;
      img.data[i + 3] = a;
    }
    g.putImageData(img, 0, 0);
    this.texCanvas.set(key, c);
    return c;
  }

  /** Pixels 16x16 d'un objet plat (gabarit ou texture de bloc « sprite »). */
  spritePixels(id: string): Uint8ClampedArray | null {
    const hit = this.spritePx.get(id);
    if (hit) return hit;
    const it = this.content.items.get(id);
    if (!it) return null;
    let px: Uint8ClampedArray | null = null;
    if (it.icon) px = renderArt(it.icon.t, it.icon.c ?? ['#888888']);
    else if (it.blockNum) {
      const b = this.content.blocks.get(it.blockNum);
      const name = b.faceTex[b.shape === Shape.DOOR ? 3 : 0];
      const stages = this.content.blocks.stages[b.num];
      const tex = stages ? `${name}_${stages - 1}` : name;
      px = new Uint8ClampedArray(this.lib.pixels(tex));
      const tc = DEFAULT_TINT[this.content.blocks.tint[b.num]];
      if (tc) for (let i = 0; i < px.length; i += 4) if (px[i + 3] > 0) {
        px[i] = (px[i] * tc[0]) / 255;
        px[i + 1] = (px[i + 1] * tc[1]) / 255;
        px[i + 2] = (px[i + 2] * tc[2]) / 255;
      }
    }
    if (px) this.spritePx.set(id, px);
    return px;
  }

  /** L'objet est-il affiché comme un cube isométrique ? */
  isIsoBlock(id: string): boolean {
    const it = this.content.items.get(id);
    if (!it || !it.blockNum || it.icon) return false;
    const sh = this.content.blocks.shape[it.blockNum];
    return ![Shape.CROSS, Shape.CROP, Shape.TORCH, Shape.LADDER, Shape.DOOR, Shape.LEVER, Shape.LIQUID, Shape.PORTAL, Shape.PANE].includes(sh);
  }

  icon(id: string): string {
    const hit = this.urls.get(id);
    if (hit) return hit;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const g = c.getContext('2d')!;
    g.imageSmoothingEnabled = false;
    if (this.isIsoBlock(id)) this.drawIso(g, id);
    else {
      const px = this.spritePixels(id);
      if (px) {
        const tmp = document.createElement('canvas');
        tmp.width = tmp.height = TEX;
        const tg = tmp.getContext('2d')!;
        const img = tg.createImageData(TEX, TEX);
        img.data.set(px);
        tg.putImageData(img, 0, 0);
        g.drawImage(tmp, 0, 0, S, S);
      } else {
        g.fillStyle = '#f0f';
        g.fillRect(16, 16, 32, 32);
      }
    }
    const url = c.toDataURL();
    this.urls.set(id, url);
    return url;
  }

  private drawIso(g: CanvasRenderingContext2D, id: string): void {
    const it = this.content.items.get(id)!;
    const t = this.content.blocks;
    const num = it.blockNum;
    const info = t.get(num);
    const sh = t.shape[num];
    const boxes: Box[] = sh === Shape.CUBE ? [[0, 0, 0, 16, 16, 16]] : sh === Shape.STAIRS ? modelBoxes(sh, 0, 0) : sh === Shape.FENCE || sh === Shape.WALL ? modelBoxes(sh, 0, 1 | 2) : modelBoxes(sh, t.orient[num] ? 0 : 0, 0);
    boxes.sort((a, b) => a[0] + a[2] + a[1] * 0.5 - (b[0] + b[2] + b[1] * 0.5));
    const tint = t.tint[num];
    const opaque = t.pass[num] === PASS_OPAQUE;
    // projection
    const a = 28 / 16,
      b = 14 / 16,
      c = 30 / 16,
      cx = 32,
      cy = 33;
    const P = (x: number, y: number, z: number): [number, number] => [cx + (x - z) * a, cy + (x + z) * b - y * c - 7];
    const faceTex = (f: number) => this.blockTexture(info.faceTex[f], tint, opaque);
    const drawFace = (tex: HTMLCanvasElement, o: [number, number], u: [number, number], v: [number, number], su: number, sv: number, sw: number, shh: number, shade: number) => {
      g.save();
      g.setTransform((u[0] - o[0]) / sw, (u[1] - o[1]) / sw, (v[0] - o[0]) / shh, (v[1] - o[1]) / shh, o[0], o[1]);
      g.drawImage(tex, su, sv, sw, shh, 0, 0, sw, shh);
      if (shade > 0) {
        g.globalCompositeOperation = 'source-atop';
        g.fillStyle = `rgba(0,0,0,${shade})`;
        g.fillRect(0, 0, sw, shh);
      }
      g.restore();
    };
    // Pour chaque boîte : face sud (gauche), est (droite), dessus
    for (const [x0, y0, z0, x1, y1, z1] of boxes) {
      // tiny layer canvas to keep shading local
      const layer = document.createElement('canvas');
      layer.width = layer.height = S;
      const lg = layer.getContext('2d')!;
      lg.imageSmoothingEnabled = false;
      const gg = g;
      g = lg;
      // sud (+Z)
      drawFace(faceTex(4), P(x0, y1, z1), P(x1, y1, z1), P(x0, y0, z1), x0, 16 - y1, x1 - x0, y1 - y0, 0.22);
      // est (+X)
      drawFace(faceTex(0), P(x1, y1, z1), P(x1, y1, z0), P(x1, y0, z1), 16 - z1, 16 - y1, z1 - z0, y1 - y0, 0.4);
      // dessus
      drawFace(faceTex(2), P(x0, y1, z0), P(x1, y1, z0), P(x0, y1, z1), x0, z0, x1 - x0, z1 - z0, 0);
      g = gg;
      g.drawImage(layer, 0, 0);
    }
  }
}

/** Rend un gabarit ASCII avec une palette. */
export function renderArt(template: string, colors: string[]): Uint8ClampedArray {
  const rows = ITEM_ART[template] ?? ITEM_ART.orb;
  const out = new Uint8ClampedArray(TEX * TEX * 4);
  const c0 = hexToRgb(colors[0] ?? '#888888');
  const c1 = hexToRgb(colors[1] ?? colors[0] ?? '#888888');
  const c2 = hexToRgb(colors[2] ?? colors[1] ?? colors[0] ?? '#888888');
  const mul = (c: number[], f: number) => c.map((v) => Math.max(0, Math.min(255, v * f)));
  const lighten = (c: number[], f: number) => c.map((v) => v + (255 - v) * f);
  const pal: Record<string, number[]> = {
    o: mul(c0, 0.3),
    a: c0,
    A: mul(c0, 0.68),
    l: lighten(c0, 0.4),
    b: c1,
    B: mul(c1, 0.68),
    c: c2,
    h: [138, 90, 48],
    H: [90, 58, 28],
    w: [255, 255, 255],
    k: [26, 26, 26],
    g: [154, 154, 154],
    G: [90, 90, 90],
  };
  for (let y = 0; y < TEX; y++) {
    const row = rows[y] ?? '';
    for (let x = 0; x < TEX; x++) {
      const ch = row[x] ?? '.';
      if (ch === '.') continue;
      const col = pal[ch] ?? c0;
      const i = (y * TEX + x) * 4;
      out[i] = col[0];
      out[i + 1] = col[1];
      out[i + 2] = col[2];
      out[i + 3] = 255;
    }
  }
  return out;
}
