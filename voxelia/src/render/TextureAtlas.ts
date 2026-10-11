/**
 * TextureAtlas — rassemble toutes les textures de blocs dans une texture tableau WebGL2
 * (un calque 16x16 par texture, plusieurs calques consécutifs pour les animations).
 * Les packs de ressources importés remplacent les pixels calque par calque.
 */
import * as THREE from 'three';
import { allBlockTextures } from '../world/blocks';
import { ANIMATED, missingTexture, paintBlockTexture } from './textures/blockTextures';
import type { Pixmap } from './textures/pixmap';
import type { TextureInfo } from '../world/mesher';

export const TEX_SIZE = 16;

export class TextureAtlas {
  readonly info: Record<string, TextureInfo> = {};
  readonly names: string[] = [];
  readonly averages = new Map<string, [number, number, number]>();
  layerCount = 0;
  private data!: Uint8Array;
  texture!: THREE.DataArrayTexture;
  /** Pixels d'origine (procéduraux) pour pouvoir annuler un pack. */
  private original!: Uint8Array;
  private listeners: Array<() => void> = [];

  build(): void {
    const names = allBlockTextures().filter((n) => n !== 'air');
    if (!names.includes('bed_head_top')) names.push('bed_head_top');
    // Calque 0 : texture manquante
    let layer = 1;
    for (const n of names) {
      const frames = ANIMATED[n] ?? 1;
      this.info[n] = { layer, frames };
      this.names.push(n);
      layer += frames;
    }
    this.layerCount = layer;
    const px = TEX_SIZE * TEX_SIZE * 4;
    this.data = new Uint8Array(px * layer);
    this.writeLayer(0, missingTexture());
    for (const n of names) {
      const { layer: l, frames } = this.info[n];
      for (let f = 0; f < frames; f++) {
        const p = paintBlockTexture(n, f) ?? missingTexture();
        this.writeLayer(l + f, p);
        if (f === 0) this.averages.set(n, p.average());
      }
    }
    this.original = this.data.slice();
    const tex = new THREE.DataArrayTexture(this.data, TEX_SIZE, TEX_SIZE, layer);
    tex.format = THREE.RGBAFormat;
    tex.type = THREE.UnsignedByteType;
    tex.magFilter = THREE.NearestFilter;
    tex.minFilter = THREE.NearestMipmapLinearFilter;
    tex.generateMipmaps = true;
    tex.colorSpace = THREE.NoColorSpace;
    tex.needsUpdate = true;
    this.texture = tex;
  }

  private writeLayer(layer: number, p: Pixmap): void {
    const px = TEX_SIZE * TEX_SIZE * 4;
    this.data.set(p.data.subarray(0, px), layer * px);
  }

  /** Remplace une texture par des pixels RGBA 16x16 (pack de ressources). */
  override(name: string, rgba: Uint8Array | Uint8ClampedArray, frame = 0): boolean {
    const i = this.info[name];
    if (!i) return false;
    const px = TEX_SIZE * TEX_SIZE * 4;
    const frames = i.frames;
    // Une image fixe remplace toutes les images d'une animation.
    for (let f = frame; f < (frame === 0 && frames > 1 ? frames : frame + 1); f++) this.data.set(rgba.subarray(0, px), (i.layer + f) * px);
    let r = 0,
      g = 0,
      b = 0,
      n = 0;
    for (let k = 0; k < px; k += 4)
      if (rgba[k + 3] > 127) {
        r += rgba[k];
        g += rgba[k + 1];
        b += rgba[k + 2];
        n++;
      }
    if (n) this.averages.set(name, [r / n, g / n, b / n]);
    return true;
  }

  /** Lecture des pixels actuels d'une texture (icônes, particules). */
  pixels(name: string, frame = 0): Uint8Array {
    const i = this.info[name];
    const px = TEX_SIZE * TEX_SIZE * 4;
    const l = i ? i.layer + Math.min(frame, i.frames - 1) : 0;
    return this.data.subarray(l * px, (l + 1) * px);
  }

  commit(): void {
    this.texture.needsUpdate = true;
    for (const l of this.listeners) l();
  }

  resetToOriginal(): void {
    this.data.set(this.original);
    for (const n of this.names) {
      const px = this.pixels(n);
      let r = 0,
        g = 0,
        b = 0,
        k = 0;
      for (let j = 0; j < px.length; j += 4)
        if (px[j + 3] > 127) {
          r += px[j];
          g += px[j + 1];
          b += px[j + 2];
          k++;
        }
      if (k) this.averages.set(n, [r / k, g / k, b / k]);
    }
    this.commit();
  }

  onChange(fn: () => void): void {
    this.listeners.push(fn);
  }

  average(name: string): [number, number, number] {
    return this.averages.get(name) ?? [128, 128, 128];
  }
}
