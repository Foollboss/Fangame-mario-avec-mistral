/**
 * Streaming des colonnes autour du joueur : chargement depuis la sauvegarde ou
 * génération asynchrone (workers), déchargement avec sauvegarde, et
 * planification du maillage des sections modifiées (priorité à la distance).
 */
import { Chunk } from './chunk';
import { CS, ckey, ckeyX, ckeyZ, skey, skeyC, skeyY } from './constants';
import type { World } from './world';
import type { WorkerPool } from '../engine/workerPool';
import { meshSection, P, PAD, type MeshInput, type MeshOutput } from '../render/mesher';
import { encodeChunk, decodeChunk, type ChunkRecord } from '../save/serializer';
import type { WorldStorage } from '../save/storage';
import type { GenEntity, GenBlockEntity } from '../worldgen/buffer';

export interface MeshSink {
  applyMesh(cx: number, sy: number, cz: number, out: MeshOutput): void;
  clearSection(cx: number, sy: number, cz: number): void;
  removeColumn(cx: number, cz: number): void;
}

export interface StreamerHooks {
  /** Colonne ajoutée au monde (entités générées ou sauvegardées à restaurer). */
  onLoaded?(c: Chunk, genEntities: GenEntity[], saved: unknown[]): void;
  /** Colonne sur le point d'être déchargée : renvoie les entités persistantes à sauvegarder. */
  onUnload?(c: Chunk): unknown[];
}

interface GenMsg {
  cx: number;
  cz: number;
  sections: (Uint16Array | null)[];
  biomes: Uint8Array;
  tints: Uint32Array;
  blockEntities: GenBlockEntity[];
  entities: GenEntity[];
}

export class ChunkStreamer {
  radius = 8;
  private loading = new Set<number>();
  private pendingSaves = new Map<number, ChunkRecord>();
  private meshInFlight = 0;
  private meshSeq = new Map<number, number>();
  private seqCounter = 1;
  private bedrockId: number;
  /** Statistiques. */
  generated = 0;
  loadedFromSave = 0;
  genTimeMs = 0;
  private center = { cx: 0, cz: 0 };
  private lastPos = { x: 0, y: 64, z: 0 };
  hooks: StreamerHooks = {};
  /** Colonnes fournies par un serveur distant (pas de génération locale). */
  remote = false;

  constructor(
    readonly world: World,
    readonly pool: WorkerPool | null,
    readonly sink: MeshSink | null,
    readonly storage: WorldStorage | null,
    readonly worldId: string | null,
  ) {
    this.bedrockId = world.content.blocks.tryNum('socle');
  }

  get dim(): string {
    return this.world.dim;
  }

  /** Colonnes souhaitées autour d'un point, triées par distance. */
  private desired(cx: number, cz: number, r: number): number[] {
    const out: [number, number][] = [];
    for (let dz = -r; dz <= r; dz++)
      for (let dx = -r; dx <= r; dx++) {
        const d = dx * dx + dz * dz;
        if (d <= r * r + r) out.push([ckey(cx + dx, cz + dz), d]);
      }
    out.sort((a, b) => a[1] - b[1]);
    return out.map((e) => e[0]);
  }

  /** Nombre de colonnes chargées dans le rayon (pour l'écran de chargement). */
  progress(cx: number, cz: number, r: number): { done: number; total: number } {
    const want = this.desired(cx, cz, r);
    let done = 0;
    for (const k of want) if (this.world.chunks.has(k)) done++;
    return { done, total: want.length };
  }

  update(px: number, pz: number, maxNewLoads = 8): void {
    this.lastPos.x = px;
    this.lastPos.z = pz;
    const cx = Math.floor(px / CS),
      cz = Math.floor(pz / CS);
    this.center.cx = cx;
    this.center.cz = cz;
    const r = this.radius;
    // Chargements
    if (this.pool && !this.remote) {
      const cap = this.pool.size * 3;
      let started = 0;
      for (const k of this.desired(cx, cz, r)) {
        if (this.loading.size >= cap || started >= maxNewLoads) break;
        if (this.world.chunks.has(k) || this.loading.has(k)) continue;
        this.startLoad(k);
        started++;
      }
    }
    // Déchargements
    const lim = (r + 2) * (r + 2);
    for (const [k, c] of this.world.chunks) {
      const dx = c.cx - cx,
        dz = c.cz - cz;
      if (dx * dx + dz * dz > lim) this.unload(k, c);
    }
  }

  private async startLoad(k: number): Promise<void> {
    this.loading.add(k);
    const cx = ckeyX(k),
      cz = ckeyZ(k);
    try {
      let rec: ChunkRecord | null = this.pendingSaves.get(k) ?? null;
      if (!rec && this.storage && this.worldId) rec = await this.storage.loadChunk(this.worldId, this.dim, cx, cz);
      if (!this.loading.has(k)) return;
      if (rec) {
        let dec;
        try {
          dec = decodeChunk(rec, this.world.content.blocks);
        } catch (e) {
          console.warn('Colonne corrompue, régénération', cx, cz, e);
        }
        if (dec) {
          const c = new Chunk(cx, cz);
          c.loadSections(dec.sections);
          c.biomes.set(dec.biomes);
          c.tints.set(dec.tints);
          for (const [i, d] of dec.blockEntities) c.blockEntities.set(i, d);
          c.recordHasEntities = dec.entities.length > 0;
          c.modified = true;
          c.dirty = this.pendingSaves.has(k);
          this.pendingSaves.delete(k);
          this.loadedFromSave++;
          this.finishLoad(k, c, [], dec.entities);
          return;
        }
      }
      if (!this.pool) return;
      const m = await this.pool.request<GenMsg & { ms: number }>({ type: 'gen', dim: this.dim, cx, cz });
      this.genTimeMs += m.ms;
      if (!this.loading.has(k)) return;
      const c = this.chunkFromGen(m);
      this.generated++;
      this.finishLoad(k, c, m.entities, []);
    } catch (e) {
      console.error('Échec du chargement de colonne', cx, cz, e);
      this.loading.delete(k);
    }
  }

  chunkFromGen(m: GenMsg): Chunk {
    const c = new Chunk(m.cx, m.cz);
    c.loadSections(m.sections);
    c.biomes.set(m.biomes);
    c.tints.set(m.tints);
    for (const be of m.blockEntities ?? []) c.blockEntities.set(be.i, be.data);
    return c;
  }

  private finishLoad(k: number, c: Chunk, genEntities: GenEntity[], saved: unknown[]): void {
    this.loading.delete(k);
    if (this.world.chunks.has(k)) return;
    // Colonne devenue inutile entre-temps ?
    const dx = c.cx - this.center.cx,
      dz = c.cz - this.center.cz;
    if (dx * dx + dz * dz > (this.radius + 2) * (this.radius + 2)) {
      if (c.dirty) this.pendingSaves.set(k, encodeChunk(c, this.world.content.blocks, saved));
      return;
    }
    this.world.addChunk(c);
    this.hooks.onLoaded?.(c, genEntities, saved);
    // enchaîne immédiatement les chargements suivants (indépendant du nombre d'images/s)
    this.update(this.lastPos.x, this.lastPos.z, 2);
  }

  /** Colonne reçue du serveur (remplace la version locale éventuelle). */
  addRemote(c: Chunk): void {
    if (this.world.getChunk(c.cx, c.cz)) {
      this.world.removeChunk(c.cx, c.cz);
      this.sink?.removeColumn(c.cx, c.cz);
    }
    this.world.addChunk(c);
  }

  /** Ajoute directement une colonne (serveur / tests). */
  addGenerated(m: GenMsg): Chunk {
    const c = this.chunkFromGen(m);
    this.world.addChunk(c);
    this.hooks.onLoaded?.(c, m.entities, []);
    return c;
  }

  private unload(k: number, c: Chunk): void {
    const ents = this.hooks.onUnload?.(c) ?? [];
    if (c.dirty || ents.length > 0 || c.recordHasEntities) this.pendingSaves.set(k, encodeChunk(c, this.world.content.blocks, ents));
    this.world.removeChunk(c.cx, c.cz);
    this.sink?.removeColumn(c.cx, c.cz);
    this.meshSeq.forEach((_, sk) => {
      if (skeyC(sk) === k) this.meshSeq.delete(sk);
    });
  }

  unloadAll(): void {
    for (const [k, c] of [...this.world.chunks]) this.unload(k, c);
    this.loading.clear();
  }

  /**
   * Colonnes à sauvegarder : colonnes chargées modifiées + colonnes déchargées en attente.
   * `entitiesOf` fournit les entités persistantes d'une colonne chargée.
   */
  collectSaves(entitiesOf?: (c: Chunk) => unknown[], all = false): { recs: ChunkRecord[]; commit: () => void } {
    const recs: ChunkRecord[] = [...this.pendingSaves.values()];
    const saved: Chunk[] = [];
    const savedEnts: boolean[] = [];
    for (const c of this.world.chunks.values()) {
      const ents = entitiesOf ? entitiesOf(c) : [];
      if (c.dirty || (all && c.modified) || ents.length > 0 || c.recordHasEntities) {
        recs.push(encodeChunk(c, this.world.content.blocks, ents));
        saved.push(c);
        savedEnts.push(ents.length > 0);
      }
    }
    const pendingKeys = [...this.pendingSaves.keys()];
    return {
      recs,
      commit: () => {
        saved.forEach((c, i) => {
          c.dirty = false;
          c.modified = true;
          c.recordHasEntities = savedEnts[i];
        });
        for (const k of pendingKeys) this.pendingSaves.delete(k);
      },
    };
  }

  private neighborsLoaded(cx: number, cz: number): boolean {
    const ch = this.world.chunks;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) if (!ch.has(ckey(cx + dx, cz + dz))) return false;
    return true;
  }

  /** Construit l'entrée du mailleur pour une section (cube 18³). */
  buildMeshInput(cx: number, sy: number, cz: number): MeshInput {
    const blocks = new Uint16Array(PAD * PAD * PAD);
    const light = new Uint8Array(PAD * PAD * PAD);
    const tints = new Uint32Array(PAD * PAD * 3);
    const bx = cx * CS,
      by = sy * CS,
      bz = cz * CS;
    const bed = this.bedrockId;
    for (let dz = -1; dz <= 16; dz++)
      for (let dx = -1; dx <= 16; dx++) {
        const wx = bx + dx,
          wz = bz + dz;
        const c = this.world.getChunk(wx >> 4, wz >> 4);
        const lx = wx & 15,
          lz = wz & 15;
        const ti = ((dz + 1) * PAD + (dx + 1)) * 3;
        if (c) {
          const ci = (lz * 16 + lx) * 3;
          tints[ti] = c.tints[ci];
          tints[ti + 1] = c.tints[ci + 1];
          tints[ti + 2] = c.tints[ci + 2];
        }
        for (let dy = -1; dy <= 16; dy++) {
          const wy = by + dy;
          const pi = P(dx, dy, dz);
          if (wy < 0) {
            blocks[pi] = bed;
            light[pi] = 0;
            continue;
          }
          if (wy >= 256 || !c) {
            light[pi] = 0xf0;
            continue;
          }
          const sec = c.sections[wy >> 4];
          const li = ((wy & 15) << 8) | (lz << 4) | lx;
          blocks[pi] = sec.blocks ? sec.blocks[li] : 0;
          light[pi] = sec.light ? sec.light[li] : 0xf0;
        }
      }
    return { blocks, light, tints, ox: bx, oy: by, oz: bz };
  }

  /** Remaille immédiatement (fil principal) une section — utilisé après une action du joueur. */
  meshNow(cx: number, sy: number, cz: number): void {
    if (!this.sink) return;
    const k = skey(cx, sy, cz);
    this.world.dirtySections.delete(k);
    const c = this.world.getChunk(cx, cz);
    if (!c) return;
    this.meshSeq.set(k, this.seqCounter++);
    if (!c.sections[sy].blocks) {
      this.sink.clearSection(cx, sy, cz);
      return;
    }
    const out = meshSection(this.buildMeshInput(cx, sy, cz), this.world.content.blocks.tables());
    this.sink.applyMesh(cx, sy, cz, out);
  }

  /** Remaille tout de suite les sections sales autour d'une cellule. */
  flushAround(x: number, y: number, z: number): void {
    const keys = new Set<number>();
    for (let dx = -1; dx <= 1; dx++)
      for (let dy = -1; dy <= 1; dy++)
        for (let dz = -1; dz <= 1; dz++) {
          const sy = (y + dy) >> 4;
          if (sy < 0 || sy > 15) continue;
          keys.add(skey((x + dx) >> 4, sy, (z + dz) >> 4));
        }
    for (const k of keys) {
      if (!this.world.dirtySections.has(k)) continue;
      const cx = ckeyX(skeyC(k)),
        cz = ckeyZ(skeyC(k));
      if (!this.neighborsLoaded(cx, cz)) continue;
      this.meshNow(cx, skeyY(k), cz);
    }
  }

  /** Répartit le maillage des sections sales sur les workers. */
  updateMeshes(px: number, py: number, pz: number): void {
    if (!this.sink || !this.pool) return;
    this.lastPos.x = px;
    this.lastPos.y = py;
    this.lastPos.z = pz;
    const budget = this.pool.size * 3 - this.meshInFlight;
    if (budget <= 0 || this.world.dirtySections.size === 0) return;
    const pcx = Math.floor(px / CS),
      psy = Math.floor(py / CS),
      pcz = Math.floor(pz / CS);
    const cand: [number, number][] = [];
    const neighborCache = new Map<number, boolean>();
    for (const k of this.world.dirtySections) {
      const ck = skeyC(k);
      const cx = ckeyX(ck),
        cz = ckeyZ(ck);
      let ok = neighborCache.get(ck);
      if (ok === undefined) {
        ok = this.world.chunks.has(ck) && this.neighborsLoaded(cx, cz);
        neighborCache.set(ck, ok);
      }
      if (!ok) {
        if (!this.world.chunks.has(ck)) this.world.dirtySections.delete(k);
        continue;
      }
      const sy = skeyY(k);
      const d = (cx - pcx) ** 2 + (cz - pcz) ** 2 + ((sy - psy) ** 2) * 0.5;
      cand.push([k, d]);
    }
    cand.sort((a, b) => a[1] - b[1]);
    const n = Math.min(budget, cand.length);
    for (let i = 0; i < n; i++) this.dispatchMesh(cand[i][0]);
  }

  private dispatchMesh(k: number): void {
    this.world.dirtySections.delete(k);
    const ck = skeyC(k);
    const cx = ckeyX(ck),
      cz = ckeyZ(ck),
      sy = skeyY(k);
    const c = this.world.chunks.get(ck);
    if (!c) return;
    const seq = this.seqCounter++;
    this.meshSeq.set(k, seq);
    if (!c.sections[sy].blocks) {
      this.sink!.clearSection(cx, sy, cz);
      return;
    }
    const input = this.buildMeshInput(cx, sy, cz);
    this.meshInFlight++;
    this.pool!
      .request<{ out: MeshOutput; seq: number; key: number }>({ type: 'mesh', key: k, seq, input }, [input.blocks.buffer, input.light.buffer, input.tints.buffer])
      .then((m) => {
        this.meshInFlight--;
        if (this.meshSeq.get(k) !== m.seq) return; // résultat périmé
        if (this.world.chunks.has(ck)) this.sink!.applyMesh(cx, sy, cz, m.out);
        this.updateMeshes(this.lastPos.x, this.lastPos.y, this.lastPos.z);
      })
      .catch(() => {
        this.meshInFlight--;
      });
  }

  get pendingMeshes(): number {
    return this.world.dirtySections.size + this.meshInFlight;
  }

  get loadingCount(): number {
    return this.loading.size;
  }
}
