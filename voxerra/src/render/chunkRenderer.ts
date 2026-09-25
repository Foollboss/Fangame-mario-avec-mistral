/**
 * Rendu des sections : un Mesh par passe et par section (16³), culling par
 * frustum + culling des grottes (parcours de visibilité à travers les sections
 * connectées, comme les moteurs voxel modernes).
 */
import * as THREE from 'three';
import type { MeshOutput, MeshPassData } from './mesher';
import { pairBit } from './mesher';
import type { MeshSink } from '../world/chunkStreamer';
import { CHUNK_VERT, CHUNK_FRAG } from './shaders';
import type { BlockAtlas } from './atlas';
import { skey, ckey } from '../world/constants';

interface SectionEntry {
  cx: number;
  sy: number;
  cz: number;
  meshes: (THREE.Mesh | null)[];
  conn: number;
}

const SPHERE = new THREE.Sphere(new THREE.Vector3(128, 128, 128), 222);
const BOX = new THREE.Box3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(256, 256, 256));
const DIRS: [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export class ChunkRenderer implements MeshSink {
  readonly group = new THREE.Group();
  readonly materials: THREE.ShaderMaterial[];
  readonly uniforms: Record<string, THREE.IUniform>;
  private sections = new Map<number, SectionEntry>();
  private visitStamp = new Map<number, number>();
  private stamp = 0;
  private frustum = new THREE.Frustum();
  private projView = new THREE.Matrix4();
  private tmpBox = new THREE.Box3();
  stats = { sections: 0, visible: 0, triangles: 0 };
  cullCaves = true;

  constructor(atlas: BlockAtlas) {
    this.group.name = 'terrain';
    this.uniforms = {
      uAtlas: { value: atlas.texture },
      uTime: { value: 0 },
      uDaylight: { value: 1 },
      uSkyLightColor: { value: new THREE.Color(1, 1, 1) },
      uBlockLightColor: { value: new THREE.Color(1.0, 0.86, 0.66) },
      uFogColor: { value: new THREE.Color(0.75, 0.85, 1) },
      uFogNear: { value: 60 },
      uFogFar: { value: 120 },
      uNightVision: { value: 0 },
      uSunDir: { value: new THREE.Vector3(0.3, 0.9, 0.2).normalize() },
      uCameraPos: { value: new THREE.Vector3() },
      uUnderwater: { value: 0 },
    };
    this.materials = [0, 1, 2].map((pass) => this.makeMaterial(pass));
  }

  /** Matériau de terrain partageant les uniformes globaux (options : éclairage forcé). */
  makeMaterial(pass: number, lightOverride?: THREE.Vector2): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      uniforms: { ...this.uniforms, uPass: { value: pass }, uLightOverride: { value: lightOverride ?? new THREE.Vector2(-1, -1) } },
      vertexShader: CHUNK_VERT,
      fragmentShader: CHUNK_FRAG,
      side: pass === 0 ? THREE.FrontSide : THREE.DoubleSide,
      transparent: pass === 2,
      depthWrite: pass !== 2,
    });
  }

  private entry(cx: number, sy: number, cz: number): SectionEntry {
    const k = skey(cx, sy, cz);
    let e = this.sections.get(k);
    if (!e) {
      e = { cx, sy, cz, meshes: [null, null, null], conn: 0x7fff };
      this.sections.set(k, e);
    }
    return e;
  }

  private buildGeometry(d: MeshPassData): THREE.BufferGeometry {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(d.pos, 3));
    g.setAttribute('aUV', new THREE.BufferAttribute(d.uv, 4));
    g.setAttribute('aLight', new THREE.BufferAttribute(d.light, 4, true));
    g.setAttribute('aColor', new THREE.BufferAttribute(d.color, 4, true));
    g.setIndex(new THREE.BufferAttribute(d.index, 1));
    g.boundingSphere = SPHERE;
    g.boundingBox = BOX;
    return g;
  }

  applyMesh(cx: number, sy: number, cz: number, out: MeshOutput): void {
    const e = this.entry(cx, sy, cz);
    e.conn = out.connectivity;
    for (let p = 0; p < 3; p++) {
      const data = out.passes[p];
      const old = e.meshes[p];
      if (!data) {
        if (old) {
          this.group.remove(old);
          old.geometry.dispose();
          e.meshes[p] = null;
        }
        continue;
      }
      const geo = this.buildGeometry(data);
      if (old) {
        old.geometry.dispose();
        old.geometry = geo;
      } else {
        const m = new THREE.Mesh(geo, this.materials[p]);
        m.position.set(cx * 16, sy * 16, cz * 16);
        m.scale.setScalar(1 / 16);
        m.matrixAutoUpdate = false;
        m.updateMatrix();
        m.updateMatrixWorld(true);
        m.renderOrder = p;
        m.frustumCulled = true;
        e.meshes[p] = m;
        this.group.add(m);
      }
    }
  }

  clearSection(cx: number, sy: number, cz: number): void {
    const k = skey(cx, sy, cz);
    const e = this.sections.get(k);
    if (!e) return;
    for (const m of e.meshes)
      if (m) {
        this.group.remove(m);
        m.geometry.dispose();
      }
    this.sections.delete(k);
  }

  removeColumn(cx: number, cz: number): void {
    for (let sy = 0; sy < 16; sy++) this.clearSection(cx, sy, cz);
  }

  clearAll(): void {
    for (const e of [...this.sections.values()]) this.clearSection(e.cx, e.sy, e.cz);
  }

  /**
   * Parcours de visibilité depuis la section de la caméra : on ne traverse une
   * section que par des paires de faces reliées par de l'air, sans revenir en arrière.
   */
  updateVisibility(camera: THREE.Camera, loaded: Map<number, unknown>, radius: number): void {
    this.projView.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.projView);
    const cam = camera.position;
    const ccx = Math.floor(cam.x / 16),
      ccz = Math.floor(cam.z / 16);
    const csy = Math.max(0, Math.min(15, Math.floor(cam.y / 16)));
    for (const e of this.sections.values()) for (const m of e.meshes) if (m) m.visible = false;
    let visible = 0;
    let tris = 0;
    const show = (e: SectionEntry | undefined) => {
      if (!e) return;
      visible++;
      for (const m of e.meshes)
        if (m) {
          m.visible = true;
          tris += (m.geometry.index?.count ?? 0) / 3;
        }
    };
    if (!this.cullCaves) {
      for (const e of this.sections.values()) show(e);
      this.stats = { sections: this.sections.size, visible, triangles: tris };
      return;
    }
    this.stamp++;
    const stamp = this.stamp;
    const qk: number[] = [];
    const qx: number[] = [];
    const qy: number[] = [];
    const qz: number[] = [];
    const qfrom: number[] = [];
    const qdirs: number[] = [];
    const startKey = skey(ccx, csy, ccz);
    qk.push(startKey);
    qx.push(ccx);
    qy.push(csy);
    qz.push(ccz);
    qfrom.push(-1);
    qdirs.push(0);
    this.visitStamp.set(startKey, stamp);
    let head = 0;
    const r2 = (radius + 1) * (radius + 1);
    while (head < qk.length) {
      const k = qk[head],
        x = qx[head],
        y = qy[head],
        z = qz[head],
        from = qfrom[head],
        dirs = qdirs[head];
      head++;
      const e = this.sections.get(k);
      show(e);
      const conn = e ? e.conn : 0x7fff;
      for (let g = 0; g < 6; g++) {
        if (dirs & (1 << (g ^ 1))) continue;
        if (from >= 0 && from !== g && !(conn & pairBit(from, g))) continue;
        const d = DIRS[g];
        const nx = x + d[0],
          ny = y + d[1],
          nz = z + d[2];
        if (ny < 0 || ny > 15) continue;
        if ((nx - ccx) ** 2 + (nz - ccz) ** 2 > r2) continue;
        if (!loaded.has(ckey(nx, nz))) continue;
        const nk = skey(nx, ny, nz);
        if (this.visitStamp.get(nk) === stamp) continue;
        this.tmpBox.min.set(nx * 16, ny * 16, nz * 16);
        this.tmpBox.max.set(nx * 16 + 16, ny * 16 + 16, nz * 16 + 16);
        if (!this.frustum.intersectsBox(this.tmpBox)) continue;
        this.visitStamp.set(nk, stamp);
        qk.push(nk);
        qx.push(nx);
        qy.push(ny);
        qz.push(nz);
        qfrom.push(g ^ 1);
        qdirs.push(dirs | (1 << g));
      }
    }
    if (this.visitStamp.size > 200000) this.visitStamp.clear();
    this.stats = { sections: this.sections.size, visible, triangles: Math.round(tris) };
  }

  dispose(): void {
    this.clearAll();
    for (const m of this.materials) m.dispose();
  }
}
