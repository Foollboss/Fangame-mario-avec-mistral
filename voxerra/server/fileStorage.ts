/**
 * Stockage sur disque du serveur : un dossier par monde, métadonnées JSON
 * (avec copie de secours), une colonne par fichier binaire (sérialisation v8,
 * écriture atomique par renommage), un fichier par joueur.
 */
import fs from 'node:fs';
import path from 'node:path';
import v8 from 'node:v8';
import type { WorldMeta, WorldStorage } from '../src/save/storage';
import { validateMeta } from '../src/save/storage';
import type { ChunkRecord } from '../src/save/serializer';

const safe = (s: string): string => s.replace(/[^a-zA-Z0-9_\-.]/g, '_');

function writeAtomic(file: string, data: Buffer | string): void {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, data);
  fs.renameSync(tmp, file);
}

export class FileStorage implements WorldStorage {
  constructor(readonly root: string) {
    fs.mkdirSync(root, { recursive: true });
  }

  private dir(id: string): string {
    return path.join(this.root, safe(id));
  }

  private chunkFile(id: string, dim: string, cx: number, cz: number): string {
    return path.join(this.dir(id), 'dim', safe(dim), `c.${cx}.${cz}.bin`);
  }

  async listWorlds(): Promise<WorldMeta[]> {
    const out: WorldMeta[] = [];
    for (const d of fs.readdirSync(this.root, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const m = this.loadMetaSync(d.name);
      if (m) out.push(m);
    }
    return out.sort((a, b) => b.lastPlayed - a.lastPlayed);
  }

  loadMetaSync(id: string): WorldMeta | null {
    for (const name of ['meta.json', 'meta.bak.json']) {
      const f = path.join(this.dir(id), name);
      try {
        const m = JSON.parse(fs.readFileSync(f, 'utf8'));
        if (validateMeta(m)) return m;
      } catch {
        /* fichier absent ou corrompu : on tente la copie de secours */
      }
    }
    return null;
  }

  async loadMeta(id: string): Promise<WorldMeta | null> {
    return this.loadMetaSync(id);
  }

  loadChunkSync(worldId: string, dim: string, cx: number, cz: number): ChunkRecord | null {
    const f = this.chunkFile(worldId, dim, cx, cz);
    if (!fs.existsSync(f)) return null;
    try {
      return v8.deserialize(fs.readFileSync(f)) as ChunkRecord;
    } catch (e) {
      console.warn(`[stockage] colonne illisible ${dim} ${cx},${cz} — régénération`, e);
      return null;
    }
  }

  async loadChunk(worldId: string, dim: string, cx: number, cz: number): Promise<ChunkRecord | null> {
    return this.loadChunkSync(worldId, dim, cx, cz);
  }

  saveBatchSync(meta: WorldMeta | null, chunks: { dim: string; rec: ChunkRecord }[], worldId?: string): void {
    const id = meta?.id ?? worldId;
    if (!id) throw new Error('saveBatch sans monde');
    for (const c of chunks) writeAtomic(this.chunkFile(id, c.dim, c.rec.cx, c.rec.cz), v8.serialize(c.rec));
    if (meta) {
      const f = path.join(this.dir(id), 'meta.json');
      if (fs.existsSync(f)) fs.copyFileSync(f, path.join(this.dir(id), 'meta.bak.json'));
      writeAtomic(f, JSON.stringify(meta, null, 1));
    }
  }

  async saveBatch(meta: WorldMeta | null, chunks: { dim: string; rec: ChunkRecord }[]): Promise<void> {
    this.saveBatchSync(meta, chunks);
  }

  async deleteWorld(id: string): Promise<void> {
    fs.rmSync(this.dir(id), { recursive: true, force: true });
  }

  async chunkCount(worldId: string): Promise<number> {
    const base = path.join(this.dir(worldId), 'dim');
    if (!fs.existsSync(base)) return 0;
    let n = 0;
    for (const d of fs.readdirSync(base)) n += fs.readdirSync(path.join(base, d)).filter((f) => f.endsWith('.bin')).length;
    return n;
  }

  loadPlayer(worldId: string, name: string): Record<string, unknown> | null {
    try {
      return JSON.parse(fs.readFileSync(path.join(this.dir(worldId), 'players', safe(name) + '.json'), 'utf8'));
    } catch {
      return null;
    }
  }

  savePlayer(worldId: string, name: string, data: Record<string, unknown>): void {
    writeAtomic(path.join(this.dir(worldId), 'players', safe(name) + '.json'), JSON.stringify(data));
  }
}
