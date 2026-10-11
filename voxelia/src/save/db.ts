/** Petite couche au-dessus d'IndexedDB (promesses, transactions groupées). */

export const STORES = ['worlds', 'chunks', 'players', 'entities', 'packs', 'backups'] as const;
export type StoreName = (typeof STORES)[number];

export class Database {
  private db: IDBDatabase | null = null;
  /** Repli en mémoire si IndexedDB est indisponible (navigation privée…). */
  private memory: Map<string, Map<string, unknown>> | null = null;

  async open(name = 'voxelia'): Promise<void> {
    try {
      this.db = await new Promise<IDBDatabase>((resolve, reject) => {
        const req = indexedDB.open(name, 1);
        req.onupgradeneeded = () => {
          const db = req.result;
          for (const s of STORES) if (!db.objectStoreNames.contains(s)) db.createObjectStore(s);
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
        req.onblocked = () => reject(new Error('IndexedDB bloquée'));
      });
    } catch (e) {
      console.warn('IndexedDB indisponible, sauvegarde en mémoire uniquement', e);
      this.memory = new Map(STORES.map((s) => [s, new Map()]));
    }
  }

  get persistent(): boolean {
    return this.db !== null;
  }

  async get<T>(store: StoreName, key: string): Promise<T | undefined> {
    if (this.memory) return this.memory.get(store)!.get(key) as T | undefined;
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => resolve(req.result as T | undefined);
      req.onerror = () => reject(req.error);
    });
  }

  async getAll<T>(store: StoreName, prefix?: string): Promise<Array<[string, T]>> {
    if (this.memory) {
      const out: Array<[string, T]> = [];
      for (const [k, v] of this.memory.get(store)!) if (!prefix || k.startsWith(prefix)) out.push([k, v as T]);
      return out;
    }
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readonly');
      const range = prefix ? IDBKeyRange.bound(prefix, prefix + '￿') : undefined;
      const out: Array<[string, T]> = [];
      const req = tx.objectStore(store).openCursor(range);
      req.onsuccess = () => {
        const c = req.result;
        if (!c) return resolve(out);
        out.push([String(c.key), c.value as T]);
        c.continue();
      };
      req.onerror = () => reject(req.error);
    });
  }

  async keys(store: StoreName, prefix?: string): Promise<string[]> {
    if (this.memory) return [...this.memory.get(store)!.keys()].filter((k) => !prefix || k.startsWith(prefix));
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(store, 'readonly');
      const range = prefix ? IDBKeyRange.bound(prefix, prefix + '￿') : undefined;
      const req = tx.objectStore(store).getAllKeys(range);
      req.onsuccess = () => resolve((req.result as IDBValidKey[]).map(String));
      req.onerror = () => reject(req.error);
    });
  }

  /** Écritures groupées dans UNE transaction : tout ou rien (protection contre la corruption). */
  async batch(ops: Array<{ store: StoreName; key: string; value?: unknown; delete?: boolean }>): Promise<void> {
    if (!ops.length) return;
    if (this.memory) {
      for (const o of ops) {
        if (o.delete) this.memory.get(o.store)!.delete(o.key);
        else this.memory.get(o.store)!.set(o.key, o.value);
      }
      return;
    }
    const stores = [...new Set(ops.map((o) => o.store))];
    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(stores, 'readwrite');
      for (const o of ops) {
        const s = tx.objectStore(o.store);
        if (o.delete) s.delete(o.key);
        else s.put(o.value, o.key);
      }
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error('transaction annulée'));
    });
  }

  async put(store: StoreName, key: string, value: unknown): Promise<void> {
    return this.batch([{ store, key, value }]);
  }

  async delete(store: StoreName, key: string): Promise<void> {
    return this.batch([{ store, key, delete: true }]);
  }

  async deletePrefix(store: StoreName, prefix: string): Promise<void> {
    const keys = await this.keys(store, prefix);
    await this.batch(keys.map((key) => ({ store, key, delete: true })));
  }
}

/** Compression RLE de blocs 16 bits : [valeur, longueur] répétés. */
export function rleEncode(data: Uint16Array): Uint16Array {
  const out: number[] = [];
  let i = 0;
  while (i < data.length) {
    const v = data[i];
    let n = 1;
    while (i + n < data.length && data[i + n] === v && n < 65535) n++;
    out.push(v, n);
    i += n;
  }
  return Uint16Array.from(out);
}

export function rleDecode(rle: Uint16Array, length: number): Uint16Array {
  const out = new Uint16Array(length);
  let o = 0;
  for (let i = 0; i + 1 < rle.length; i += 2) {
    const v = rle[i];
    const n = rle[i + 1];
    if (o + n > length) throw new Error('données RLE corrompues');
    out.fill(v, o, o + n);
    o += n;
  }
  if (o !== length) throw new Error('données RLE incomplètes');
  return out;
}

/** Compression deflate si le navigateur la propose (sinon données brutes). */
export async function deflate(data: Uint8Array): Promise<{ z: boolean; data: Uint8Array }> {
  if (typeof CompressionStream === 'undefined') return { z: false, data };
  const cs = new CompressionStream('deflate');
  const buf = await new Response(new Blob([data]).stream().pipeThrough(cs)).arrayBuffer();
  return { z: true, data: new Uint8Array(buf) };
}

export async function inflate(data: Uint8Array, compressed: boolean): Promise<Uint8Array> {
  if (!compressed) return data;
  const ds = new DecompressionStream('deflate');
  const buf = await new Response(new Blob([data]).stream().pipeThrough(ds)).arrayBuffer();
  return new Uint8Array(buf);
}

export function toBase64(u8: Uint8Array): string {
  let s = '';
  const chunk = 0x8000;
  for (let i = 0; i < u8.length; i += chunk) s += String.fromCharCode(...u8.subarray(i, i + chunk));
  return btoa(s);
}

export function fromBase64(b64: string): Uint8Array {
  const s = atob(b64);
  const u8 = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u8[i] = s.charCodeAt(i);
  return u8;
}
