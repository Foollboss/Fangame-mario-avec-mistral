/** Construit la texture-tableau WebGL2 des blocs à partir des textures procédurales. */
import * as THREE from 'three';
import { TextureLibrary, TEX } from './texgen';
import type { Content } from '../registry/content';

export interface BlockAtlas {
  texture: THREE.DataArrayTexture;
  lib: TextureLibrary;
  layers: number;
}

export function buildAtlas(content: Content): BlockAtlas {
  const lib = new TextureLibrary(content.textures);
  const names = content.blocks.textureNames;
  const layers = Math.max(1, names.length);
  const data = new Uint8Array(TEX * TEX * 4 * layers);
  names.forEach((n, i) => data.set(lib.pixels(n), i * TEX * TEX * 4));
  const tex = new THREE.DataArrayTexture(data, TEX, TEX, layers);
  tex.format = THREE.RGBAFormat;
  tex.type = THREE.UnsignedByteType;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.NearestMipmapLinearFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.generateMipmaps = true;
  tex.colorSpace = THREE.NoColorSpace;
  tex.needsUpdate = true;
  return { texture: tex, lib, layers };
}
