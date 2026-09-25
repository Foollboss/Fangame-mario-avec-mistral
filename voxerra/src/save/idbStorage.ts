/**
 * Sauvegardes dans IndexedDB. Chaque sauvegarde (métadonnées + colonnes) est
 * écrite dans UNE transaction : en cas d'interruption (onglet fermé, coupure),
 * soit tout est écrit, soit rien. L'ancienne version des métadonnées est
 * conservée comme copie de secours.
 */
import type { ChunkRecord } from './serializer';
import { chunkKey, validateMeta, MemoryStorage, type WorldMeta, type WorldStorage } from './storage';

const DB_NAME = 'voxerra-saves';
const DB_VERSION = 1;

function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((res, rej) => {
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export class IdbStorage implements WorldStorage {
  private dbp: Promise<IDBDatabase>;

  constructor() {
    this.dbp = new Promise((resolve, reject) => {
      const open = indexedDB.open(DB_NAME, DB_VERSION);
      open.onupgradeneeded = () => {
        const db = open.result;
        if (!db.objectStoreNames.contains('worlds')) db.createObjectStore('worlds', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('backups')) db.createObjectStore('backups', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('chunks')) db.createObjectStore('chunks');
      };
      open.onsuccess = () => resolve(open.result);
      open.onerror = () => reject(open.error);
      open.onblocked = () => reject(new Error('Base de données bloquée'));
    });
  }

  /** Crée un stockage IndexedDB, ou un stockage mémoire si indisponible. */
  static async create(): Promise<WorldStorage> {
    try {
      if (typeof indexedDB === 'undefined') throw new Error('IndexedDB indisponible');
      const s = new IdbStorage();
      // certains cadres isolés laissent l'ouverture en suspens : on n'attend pas indéfiniment
      await Promise.race([s.dbp, new Promise((_, rej) => setTimeout(() => rej(new Error('IndexedDB ne répond pas')), 4000))]);
      return s;
    } catch (e) {
      console.warn('Sauvegardes en mémoire uniquement :', e);
      return new MemoryStorage();
    }
  }

  async listWorlds(): Promise<WorldMeta[]> {
    const db = await this.dbp;
    const tx = db.transaction(['worlds', 'backups'], 'readonly');
    const worlds = (await req(tx.objectStore('worlds').getAll())) as unknown[];
    const out: WorldMeta[] = [];
    for (const w of worlds) {
      if (validateMeta(w)) out.push(w);
      else if (w && typeof (w as { id?: unknown }).id === 'string') {
        const b = await req(tx.objectStore('backups').get((w as { id: string }).id));
        if (validateMeta(b)) out.push(b);
      }
    }
    return out.sort((a, b) => b.lastPlayed - a.lastPlayed);
  }

  async loadMeta(id: string): Promise<WorldMeta | null> {
    const db = await this.dbp;
    const tx = db.transaction(['worlds', 'backups'], 'readonly');
    const m = await req(tx.objectStore('worlds').get(id));
    if (validateMeta(m)) return m;
    const b = await req(tx.objectStore('backups').get(id));
    return validateMeta(b) ? b : null;
  }

  async loadChunk(worldId: string, dim: string, cx: number, cz: number): Promise<ChunkRecord | null> {
    const db = await this.dbp;
    const r = await req(db.transaction('chunks', 'readonly').objectStore('chunks').get(chunkKey(worldId, dim, cx, cz)));
    return (r as ChunkRecord) ?? null;
  }

  async saveBatch(meta: WorldMeta | null, chunks: { dim: string; rec: ChunkRecord }[]): Promise<void> {
    const db = await this.dbp;
    const tx = db.transaction(['worlds', 'chunks', 'backups'], 'readwrite', { durability: 'strict' } as IDBTransactionOptions);
    const done = new Promise<void>((res, rej) => {
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
      tx.onabort = () => rej(tx.error ?? new Error('Transaction annulée'));
    });
    if (meta) {
      const worlds = tx.objectStore('worlds');
      const prev = await req(worlds.get(meta.id));
      if (validateMeta(prev)) tx.objectStore('backups').put(prev);
      worlds.put(meta);
    }
    const store = tx.objectStore('chunks');
    if (chunks.length > 0 && !meta) throw new Error('saveBatch sans monde');
    for (const c of chunks) store.put(c.rec, chunkKey(meta!.id, c.dim, c.rec.cx, c.rec.cz));
    await done;
  }

  async deleteWorld(id: string): Promise<void> {
    const db = await this.dbp;
    const tx = db.transaction(['worlds', 'chunks', 'backups'], 'readwrite');
    tx.objectStore('worlds').delete(id);
    tx.objectStore('backups').delete(id);
    tx.objectStore('chunks').delete(IDBKeyRange.bound(id + '|', id + '|￿'));
    await new Promise<void>((res, rej) => {
      tx.oncomplete = () => res();
      tx.onerror = () => rej(tx.error);
    });
  }

  async chunkCount(worldId: string): Promise<number> {
    const db = await this.dbp;
    return req(db.transaction('chunks', 'readonly').objectStore('chunks').count(IDBKeyRange.bound(worldId + '|', worldId + '|￿')));
  }
}
