/**
 * Modèles 3D des objets : blocs (maillés avec le mailleur du terrain pour un
 * rendu identique) et objets plats extrudés pixel par pixel (épaisseur 1/16).
 */
import * as THREE from 'three';
import type { Content } from '../registry/content';
import type { IconFactory } from './icons';
import type { ChunkRenderer } from './chunkRenderer';
import { meshSection, P, PAD } from './mesher';
import { Shape } from '../registry/blocks';

const SPRITE_VERT = /* glsl */ `
attribute vec3 color;
varying vec3 vColor;
varying float vShade;
varying float vDist;
void main() {
  vColor = color;
  vec3 n = normalize(normalMatrix * normal);
  vShade = abs(normal.z) > 0.5 ? 1.0 : (abs(normal.x) > 0.5 ? 0.72 : (normal.y > 0.5 ? 0.9 : 0.6));
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vDist = -mv.z;
  gl_Position = projectionMatrix * mv;
}`;

const SPRITE_FRAG = /* glsl */ `
uniform vec3 uLight;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
varying vec3 vColor;
varying float vShade;
varying float vDist;
void main() {
  vec3 c = vColor * uLight * vShade;
  gl_FragColor = vec4(mix(c, uFogColor, smoothstep(uFogNear, uFogFar, vDist)), 1.0);
}`;

export interface ItemModel {
  obj: THREE.Object3D;
  /** Lumière (0..1 ciel, 0..1 blocs). */
  setLight(sky: number, block: number, daylight: number): void;
  dispose(): void;
  isBlock: boolean;
}

export class ItemModels {
  private blockGeos = new Map<string, (THREE.BufferGeometry | null)[]>();
  private spriteGeos = new Map<string, THREE.BufferGeometry>();
  readonly fog = { color: new THREE.Color(), near: { value: 100 }, far: { value: 200 } };

  constructor(
    private content: Content,
    private icons: IconFactory,
    private chunks: ChunkRenderer,
  ) {}

  private blockGeometry(id: string, blockNum: number): (THREE.BufferGeometry | null)[] {
    const hit = this.blockGeos.get(id);
    if (hit) return hit;
    const blocks = new Uint16Array(PAD * PAD * PAD);
    const light = new Uint8Array(PAD * PAD * PAD).fill(0xf0);
    const tints = new Uint32Array(PAD * PAD * 3);
    for (let i = 0; i < tints.length; i += 3) {
      tints[i] = 0x7bbd4a;
      tints[i + 1] = 0x5fa33a;
      tints[i + 2] = 0x3f76e4;
    }
    const t = this.content.blocks;
    let meta = 0;
    if (t.stages[blockNum]) meta = t.stages[blockNum] - 1;
    blocks[P(0, 0, 0)] = blockNum | (meta << 12);
    const out = meshSection({ blocks, light, tints, ox: 0, oy: 0, oz: 0 }, t.tables());
    const geos = out.passes.map((d) => {
      if (!d) return null;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(d.pos, 3));
      g.setAttribute('aUV', new THREE.BufferAttribute(d.uv, 4));
      g.setAttribute('aLight', new THREE.BufferAttribute(d.light, 4, true));
      g.setAttribute('aColor', new THREE.BufferAttribute(d.color, 4, true));
      g.setIndex(new THREE.BufferAttribute(d.index, 1));
      g.computeBoundingSphere();
      return g;
    });
    this.blockGeos.set(id, geos);
    return geos;
  }

  private spriteGeometry(id: string): THREE.BufferGeometry {
    const hit = this.spriteGeos.get(id);
    if (hit) return hit;
    const px = this.icons.spritePixels(id) ?? new Uint8ClampedArray(16 * 16 * 4);
    const pos: number[] = [];
    const nor: number[] = [];
    const col: number[] = [];
    const solid = (x: number, y: number) => x >= 0 && y >= 0 && x < 16 && y < 16 && px[(y * 16 + x) * 4 + 3] > 16;
    const quad = (a: number[], b: number[], c: number[], d: number[], n: number[], r: number, g: number, bl: number) => {
      for (const v of [a, b, c, a, c, d]) {
        pos.push(v[0], v[1], v[2]);
        nor.push(...n);
        col.push(r, g, bl);
      }
    };
    const s = 1 / 16,
      th = 0.5 / 16;
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        if (!solid(x, y)) continue;
        const i = (y * 16 + x) * 4;
        const r = px[i] / 255,
          g = px[i + 1] / 255,
          b = px[i + 2] / 255;
        const x0 = x * s - 0.5,
          x1 = x0 + s;
        const y1 = 0.5 - y * s,
          y0 = y1 - s;
        quad([x0, y0, th], [x1, y0, th], [x1, y1, th], [x0, y1, th], [0, 0, 1], r, g, b);
        quad([x1, y0, -th], [x0, y0, -th], [x0, y1, -th], [x1, y1, -th], [0, 0, -1], r, g, b);
        if (!solid(x - 1, y)) quad([x0, y0, -th], [x0, y0, th], [x0, y1, th], [x0, y1, -th], [-1, 0, 0], r, g, b);
        if (!solid(x + 1, y)) quad([x1, y0, th], [x1, y0, -th], [x1, y1, -th], [x1, y1, th], [1, 0, 0], r, g, b);
        if (!solid(x, y - 1)) quad([x0, y1, th], [x1, y1, th], [x1, y1, -th], [x0, y1, -th], [0, 1, 0], r, g, b);
        if (!solid(x, y + 1)) quad([x0, y0, -th], [x1, y0, -th], [x1, y0, th], [x0, y0, th], [0, -1, 0], r, g, b);
      }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    geo.computeBoundingSphere();
    this.spriteGeos.set(id, geo);
    return geo;
  }

  create(id: string): ItemModel {
    const it = this.content.items.get(id);
    const group = new THREE.Group();
    if (it && it.blockNum && this.icons.isIsoBlock(id)) {
      const override = new THREE.Vector2(1, 0);
      const geos = this.blockGeometry(id, it.blockNum);
      const mats: THREE.ShaderMaterial[] = [];
      geos.forEach((g, pass) => {
        if (!g) return;
        const m = this.chunks.makeMaterial(pass, override);
        mats.push(m);
        const mesh = new THREE.Mesh(g, m);
        mesh.scale.setScalar(1 / 16);
        mesh.position.set(-0.5, -0.5, -0.5);
        mesh.renderOrder = pass;
        group.add(mesh);
      });
      return {
        obj: group,
        isBlock: true,
        setLight: (sky, blk) => override.set(sky, blk),
        dispose: () => mats.forEach((m) => m.dispose()),
      };
    }
    const uLight = { value: new THREE.Vector3(1, 1, 1) };
    const mat = new THREE.ShaderMaterial({
      uniforms: { uLight, uFogColor: { value: this.fog.color }, uFogNear: this.fog.near, uFogFar: this.fog.far },
      vertexShader: SPRITE_VERT,
      fragmentShader: SPRITE_FRAG,
    });
    const mesh = new THREE.Mesh(this.spriteGeometry(id), mat);
    group.add(mesh);
    return {
      obj: group,
      isBlock: false,
      setLight: (sky, blk, day) => {
        const l = Math.max(sky * day, blk, 0.08);
        uLight.value.set(l * (blk > sky * day ? 1 : 1), l * (blk > sky * day ? 0.9 : 1), l * (blk > sky * day ? 0.75 : 1));
      },
      dispose: () => mat.dispose(),
    };
  }

  isFlat(id: string): boolean {
    const it = this.content.items.get(id);
    return !(it && it.blockNum && this.icons.isIsoBlock(id));
  }

  /** Blocs rendus comme sprites (torches…) : modèle 3D d'un bloc réel. */
  static isModelShape(shape: number): boolean {
    return shape !== Shape.CROSS;
  }
}
