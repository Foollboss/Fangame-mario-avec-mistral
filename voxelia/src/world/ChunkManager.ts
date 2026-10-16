/**
 * ChunkManager — charge les tronçons autour du joueur (sauvegarde ou génération),
 * planifie leur maillage dans les workers, construit les maillages Three.js par section,
 * élimine les sections cachées (graphe de visibilité) et décharge les zones lointaines.
 */
import * as THREE from 'three';
import { chunkKey } from './constants';
import { Chunk, type BlockEntity } from './Chunk';
import type { WorkerPool } from './WorkerPool';
import type { GenMarker } from './gen/writer';
import type { SectionMesh } from './mesher';

export interface SavedChunk {
  blocks: Uint16Array;
  biomes: Uint8Array;
  blockEntities?: Array<[number, BlockEntity]>;
}

export interface ChunkSource {
  load(dim: number, cx: number, cz: number): Promise<SavedChunk | null>;
}

export interface ChunkManagerHooks {
  /** Appelé quand un tronçon devient disponible (fresh = vient d'être généré). */
  onLoaded?(chunk: Chunk, fresh: boolean, markers: GenMarker[]): void;
  /** Appelé avant le déchargement d'un tronçon (pour le sauvegarder). */
  onUnload?(chunk: Chunk): void;
}

// Bits de paires de faces pour le graphe de visibilité.
const PAIR_BIT: number[][] = [];
{
  let bit = 0;
  for (let a = 0; a < 6; a++) PAIR_BIT.push(new Array(6).fill(-1));
  for (let a = 0; a < 6; a++)
    for (let b = a + 1; b < 6; b++) {
      PAIR_BIT[a][b] = bit;
      PAIR_BIT[b][a] = bit;
      bit++;
    }
}
const FACE_STEP = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];
const OPP = [1, 0, 3, 2, 5, 4];

export class ChunkManager {
  readonly chunks = new Map<string, Chunk>();
  renderDistance = 6;
  dim = 0;
  hasSky = true;
  fancyLeaves = true;
  private loading = new Set<string>();
  private indexCache: THREE.BufferAttribute | null = null;
  private lastCenter = '';
  private desired: Array<[number, number, number]> = [];
  private frame = 0;
  readonly root = new THREE.Group();
  stats = { meshes: 0, visibleSections: 0, quads: 0 };
  private generationEpoch = 0;
  /** La visibilité n'est recalculée que si la caméra change de section ou si des maillages changent. */
  private visDirty = true;
  private lastCull = '';
  private allDesiredLoaded = false;
  private cullQueue = new Int32Array(0);
  private cullVisited = new Uint8Array(0);
  private cullGrid: Array<Chunk | undefined> = [];

  constructor(
    private pool: WorkerPool,
    private materials: { solid: THREE.Material; translucent: THREE.Material },
    private source: ChunkSource,
    private hooks: ChunkManagerHooks = {},
  ) {
    this.root.matrixAutoUpdate = false;
  }

  key(cx: number, cz: number): string {
    return chunkKey(cx, cz);
  }

  get(cx: number, cz: number): Chunk | undefined {
    return this.chunks.get(chunkKey(cx, cz));
  }

  /** Change de dimension : décharge tout. */
  reset(dim: number, hasSky: boolean): void {
    for (const c of this.chunks.values()) {
      this.hooks.onUnload?.(c);
      c.dispose();
    }
    this.chunks.clear();
    this.loading.clear();
    this.pool.cancel(() => true);
    this.dim = dim;
    this.hasSky = hasSky;
    this.lastCenter = '';
    this.generationEpoch++;
    this.visDirty = true;
    this.allDesiredLoaded = false;
  }

  /** Remaille tout (changement d'options graphiques ou de textures). */
  remeshAll(): void {
    for (const c of this.chunks.values()) if (c.ready) c.dirty = 0xffff;
  }

  update(px: number, pz: number, camPos: THREE.Vector3): void {
    this.frame++;
    const pcx = Math.floor(px / 16);
    const pcz = Math.floor(pz / 16);
    const center = pcx + ',' + pcz + ',' + this.renderDistance;
    const R = this.renderDistance;
    if (center !== this.lastCenter) {
      this.lastCenter = center;
      this.desired = [];
      for (let dz = -R - 1; dz <= R + 1; dz++)
        for (let dx = -R - 1; dx <= R + 1; dx++) {
          const d = dx * dx + dz * dz;
          if (d <= (R + 1.5) * (R + 1.5)) this.desired.push([pcx + dx, pcz + dz, d]);
        }
      this.desired.sort((a, b) => a[2] - b[2]);
      // Déchargement
      const maxD = (R + 3) * (R + 3);
      for (const [k, c] of this.chunks) {
        const dx = c.cx - pcx;
        const dz = c.cz - pcz;
        if (dx * dx + dz * dz > maxD) {
          this.hooks.onUnload?.(c);
          c.dispose();
          this.chunks.delete(k);
          this.visDirty = true;
        }
      }
      this.allDesiredLoaded = false;
      this.pool.cancel((j) => {
        if (j.msg.type !== 'gen') return false;
        const dx = (j.msg.cx as number) - pcx;
        const dz = (j.msg.cz as number) - pcz;
        if (dx * dx + dz * dz > maxD) {
          this.loading.delete(this.key(j.msg.cx as number, j.msg.cz as number));
          return true;
        }
        return false;
      });
      this.pool.reprioritize((j) => {
        const dx = (j.msg.cx as number) - pcx;
        const dz = (j.msg.cz as number) - pcz;
        return (j.priority < -100 ? -1000 : 0) + dx * dx + dz * dz;
      });
    }

    // Chargements (on arrête de parcourir la liste quand tout est chargé)
    if (!this.allDesiredLoaded) {
      const maxLoads = this.pool.size * 3;
      let missing = 0;
      for (const [cx, cz, d] of this.desired) {
        const k = this.key(cx, cz);
        if (this.chunks.has(k)) continue;
        missing++;
        if (this.loading.has(k) || this.loading.size >= maxLoads) continue;
        this.requestLoad(cx, cz, d);
      }
      if (missing === 0) this.allDesiredLoaded = true;
    }

    // Maillages
    let meshing = 0;
    for (const c of this.chunks.values()) if (c.meshing) meshing++;
    if (meshing < this.pool.size * 2) {
      const candidates: Array<[Chunk, number]> = [];
      for (const c of this.chunks.values()) {
        if (!c.ready || c.meshing || !c.dirty) continue;
        const dx = c.cx - pcx;
        const dz = c.cz - pcz;
        const d = dx * dx + dz * dz;
        if (d > (R + 0.5) * (R + 0.5)) continue;
        if (!this.neighborsReady(c)) continue;
        candidates.push([c, c.meshedOnce ? d - 1000 : d]);
      }
      candidates.sort((a, b) => a[1] - b[1]);
      for (const [c, prio] of candidates) {
        if (meshing >= this.pool.size * 2) break;
        this.requestMesh(c, prio);
        meshing++;
      }
    }

    this.cull(camPos);
  }

  private neighborsReady(c: Chunk): boolean {
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const n = this.get(c.cx + dx, c.cz + dz);
        if (!n || !n.ready) return false;
      }
    return true;
  }

  private requestLoad(cx: number, cz: number, prio: number): void {
    const k = this.key(cx, cz);
    this.loading.add(k);
    const dim = this.dim;
    const epoch = this.generationEpoch;
    this.source
      .load(dim, cx, cz)
      .then((saved) => {
        if (epoch !== this.generationEpoch || !this.loading.has(k)) return;
        if (saved) {
          this.loading.delete(k);
          const c = new Chunk(cx, cz, dim);
          c.setData(saved.blocks, saved.biomes);
          if (saved.blockEntities) for (const [i, e] of saved.blockEntities) c.blockEntities.set(i, e);
          this.addChunk(c, false, []);
          return;
        }
        return this.pool.submit<any>({ type: 'gen', dim, cx, cz }, prio).then((r) => {
          if (epoch !== this.generationEpoch || !this.loading.has(k)) return;
          this.loading.delete(k);
          const c = new Chunk(cx, cz, dim);
          c.setData(r.blocks, r.biomes);
          c.markers = r.markers;
          this.addChunk(c, true, r.markers);
        });
      })
      .catch((e: Error) => {
        this.loading.delete(k);
        this.allDesiredLoaded = false;
        if (e.message !== 'annulé' && e.message !== 'terminé') console.error('Chargement du tronçon', cx, cz, e);
      });
  }

  private addChunk(c: Chunk, fresh: boolean, markers: GenMarker[]): void {
    this.chunks.set(this.key(c.cx, c.cz), c);
    this.visDirty = true;
    this.root.add(c.group);
    this.hooks.onLoaded?.(c, fresh, markers);
    // Les voisins déjà maillés doivent être remaillés pour fermer les bords et la lumière.
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dz) continue;
        const n = this.get(c.cx + dx, c.cz + dz);
        if (n && n.meshedOnce) n.dirty = 0xffff;
      }
  }

  /** Remet un tronçon en file (modifié par le joueur) avec une priorité haute. */
  markDirty(cx: number, cz: number, sections: number): void {
    const c = this.get(cx, cz);
    if (c && c.ready) c.dirty |= sections;
  }

  private requestMesh(c: Chunk, prio: number): void {
    const cols: Array<Uint16Array | null> = [];
    const biomes: Array<Uint8Array | null> = [];
    for (let dz = -1; dz <= 1; dz++)
      for (let dx = -1; dx <= 1; dx++) {
        const n = this.get(c.cx + dx, c.cz + dz);
        cols.push(n ? n.blocks : null);
        biomes.push(n ? n.biomes : null);
      }
    const sections = c.meshedOnce ? c.dirty : 0xffff;
    c.dirty = 0;
    c.meshing = true;
    const version = c.version;
    const epoch = this.generationEpoch;
    this.pool
      .submit<any>({ type: 'mesh', cx: c.cx, cz: c.cz, dim: c.dim, cols, biomes, sections, hasSky: this.hasSky, fancyLeaves: this.fancyLeaves, version }, prio)
      .then((r) => {
        c.meshing = false;
        if (epoch !== this.generationEpoch || this.get(c.cx, c.cz) !== c) return;
        this.applyMesh(c, r.sections as SectionMesh[]);
        c.light = r.light;
        c.meshedOnce = true;
      })
      .catch(() => {
        c.meshing = false;
        c.dirty |= sections;
      });
  }

  private quadIndex(quads: number): THREE.BufferAttribute {
    if (!this.indexCache || this.indexCache.count < quads * 6) {
      let cap = 16384;
      while (cap < quads) cap *= 2;
      const idx = new Uint32Array(cap * 6);
      for (let q = 0; q < cap; q++) {
        const v = q * 4;
        const i = q * 6;
        idx[i] = v;
        idx[i + 1] = v + 1;
        idx[i + 2] = v + 2;
        idx[i + 3] = v;
        idx[i + 4] = v + 2;
        idx[i + 5] = v + 3;
      }
      this.indexCache = new THREE.BufferAttribute(idx, 1);
    }
    return this.indexCache;
  }

  private buildMesh(data: Uint32Array, material: THREE.Material, sy: number, order: number): THREE.Mesh {
    const g = new THREE.BufferGeometry();
    const attr = new THREE.BufferAttribute(data, 3);
    attr.onUpload(function (this: THREE.BufferAttribute) {
      // Libère la copie mémoire côté CPU une fois envoyée au GPU.
      (this as unknown as { array: ArrayLike<number> }).array = new Uint32Array(3);
    });
    g.setAttribute('aData', attr);
    const quads = data.length / 12;
    g.setIndex(this.quadIndex(quads));
    g.setDrawRange(0, quads * 6);
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(8, 8, 8), 14);
    const m = new THREE.Mesh(g, material);
    m.position.y = sy * 16;
    m.matrixAutoUpdate = false;
    m.updateMatrix();
    m.renderOrder = order;
    m.userData.quads = quads;
    return m;
  }

  private applyMesh(c: Chunk, sections: SectionMesh[]): void {
    this.visDirty = true;
    for (const s of sections) {
      const sec = c.sections[s.sy];
      if (s.vis & 0x10000) {
        sec.vis = s.vis & 0x7fff;
        continue;
      }
      sec.vis = s.vis;
      if (sec.solid) {
        sec.solid.geometry.dispose();
        sec.solid.removeFromParent();
        sec.solid = null;
      }
      if (sec.trans) {
        sec.trans.geometry.dispose();
        sec.trans.removeFromParent();
        sec.trans = null;
      }
      if (s.solid) {
        sec.solid = this.buildMesh(s.solid, this.materials.solid, s.sy, 0);
        c.group.add(sec.solid);
      }
      if (s.trans) {
        sec.trans = this.buildMesh(s.trans, this.materials.translucent, s.sy, 1);
        c.group.add(sec.trans);
      }
    }
  }

  /** Élimination des sections invisibles par parcours du graphe de visibilité. */
  private cull(cam: THREE.Vector3): void {
    const ccx = Math.floor(cam.x / 16);
    const ccz = Math.floor(cam.z / 16);
    let csy = Math.floor(cam.y / 16);
    const R = this.renderDistance + 1;
    const key = ccx + ',' + ccz + ',' + csy + ',' + R;
    if (!this.visDirty && key === this.lastCull) return;
    this.visDirty = false;
    this.lastCull = key;
    // Hors du monde verticalement : tout est visible.
    if (csy < 0 || csy > 15 || !this.get(ccx, ccz)?.meshedOnce) {
      let quads = 0;
      let vis = 0;
      for (const c of this.chunks.values())
        for (const s of c.sections) {
          if (s.solid) {
            s.solid.visible = true;
            quads += s.solid.userData.quads;
            vis++;
          }
          if (s.trans) s.trans.visible = true;
        }
      this.stats.visibleSections = vis;
      this.stats.quads = quads;
      // Le tronçon de la caméra n'est pas encore maillé : on réessaiera.
      this.visDirty = true;
      return;
    }
    csy = Math.max(0, Math.min(15, csy));
    // Grille locale (2R+1)² des tronçons, marquage des sections visitées et file sans allocation
    const W = 2 * R + 1;
    const cells = W * W * 16;
    if (this.cullVisited.length !== cells) {
      this.cullVisited = new Uint8Array(cells);
      this.cullQueue = new Int32Array(cells * 5);
    }
    const visited = this.cullVisited;
    visited.fill(0);
    const grid = this.cullGrid;
    grid.length = W * W;
    grid.fill(undefined);
    for (const c of this.chunks.values()) {
      const gx = c.cx - ccx + R;
      const gz = c.cz - ccz + R;
      if (gx >= 0 && gz >= 0 && gx < W && gz < W) grid[gz * W + gx] = c;
    }
    const queue = this.cullQueue;
    let tail = 0;
    visited[(R * W + R) * 16 + csy] = 1;
    queue[tail++] = R;
    queue[tail++] = csy;
    queue[tail++] = R;
    queue[tail++] = -1;
    queue[tail++] = 0;
    let head = 0;
    while (head < tail) {
      const gx = queue[head++];
      const sy = queue[head++];
      const gz = queue[head++];
      const from = queue[head++];
      const dirs = queue[head++];
      const c = grid[gz * W + gx];
      const vis = c && c.meshedOnce ? c.sections[sy].vis : 0x7fff;
      for (let f = 0; f < 6; f++) {
        // Ne jamais revenir en arrière
        if (dirs & (1 << OPP[f])) continue;
        if (from >= 0 && !(vis & (1 << PAIR_BIT[from][f]))) continue;
        const st = FACE_STEP[f];
        const nx = gx + st[0];
        const ny = sy + st[1];
        const nz = gz + st[2];
        if (nx < 0 || nz < 0 || nx >= W || nz >= W || ny < 0 || ny > 15) continue;
        const vi = (nz * W + nx) * 16 + ny;
        if (visited[vi]) continue;
        visited[vi] = 1;
        queue[tail++] = nx;
        queue[tail++] = ny;
        queue[tail++] = nz;
        queue[tail++] = OPP[f];
        queue[tail++] = dirs | (1 << f);
      }
    }
    let quads = 0;
    let vcount = 0;
    for (const c of this.chunks.values()) {
      const gx = c.cx - ccx + R;
      const gz = c.cz - ccz + R;
      const inGrid = gx >= 0 && gz >= 0 && gx < W && gz < W;
      for (let sy = 0; sy < 16; sy++) {
        const s = c.sections[sy];
        const v = inGrid && visited[(gz * W + gx) * 16 + sy] === 1;
        if (s.solid) {
          s.solid.visible = v;
          if (v) {
            quads += s.solid.userData.quads;
            vcount++;
          }
        }
        if (s.trans) s.trans.visible = v;
      }
    }
    this.stats.visibleSections = vcount;
    this.stats.quads = quads;
  }

  /** Nombre de tronçons prêts et maillés dans un rayon (écran de chargement). */
  progress(px: number, pz: number, radius: number): { done: number; total: number } {
    const pcx = Math.floor(px / 16);
    const pcz = Math.floor(pz / 16);
    let done = 0;
    let total = 0;
    // Même disque que celui où les tronçons sont maillés (les coins d'un carré ne le sont pas)
    const r2 = Math.min(radius + 0.5, this.renderDistance + 0.5) ** 2;
    for (let dz = -radius; dz <= radius; dz++)
      for (let dx = -radius; dx <= radius; dx++) {
        if (dx * dx + dz * dz > r2) continue;
        total++;
        const c = this.get(pcx + dx, pcz + dz);
        if (c && c.meshedOnce) done++;
      }
    return { done, total };
  }

  dispose(): void {
    this.reset(this.dim, this.hasSky);
  }
}
