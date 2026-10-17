/**
 * Transfert des mondes de l'ancienne version de Voxerra.exe. Celle-ci s'affichait dans une fenêtre
 * Microsoft Edge : les mondes (IndexedDB) et les réglages (localStorage) sont restés dans le profil
 * d'Edge. La nouvelle fenêtre a son propre profil ; au premier lancement, le lanceur ouvre une fois
 * l'ancienne fenêtre Edge sur cette même page (« ?transfert=export ») : elle lit les données et les
 * envoie au lanceur, qui les rend à la nouvelle fenêtre. Les données d'Edge ne sont pas effacées.
 */
import { h, button } from '../ui/dom';
import { t, setLang, detectLang } from '../i18n/i18n';

const DB = 'voxerra-saves';
const LS_PREFIX = 'voxerra.';

interface Host {
  nativeWindow?: boolean;
}

// ------------------------------------------------------------------ encodage (clonage structuré → JSON)

function toB64(u: Uint8Array): string {
  let s = '';
  for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode(...u.subarray(i, i + 0x8000));
  return btoa(s);
}

function fromB64(b: string): Uint8Array {
  const s = atob(b);
  const u = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
  return u;
}

const TYPED: Record<string, new (b: ArrayBuffer) => ArrayBufferView> = {
  Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array,
};

export function encodeValue(v: unknown): unknown {
  if (v === null || typeof v !== 'object') return v;
  if (ArrayBuffer.isView(v)) return { $t: v.constructor.name, b: toB64(new Uint8Array(v.buffer, v.byteOffset, v.byteLength)) };
  if (v instanceof ArrayBuffer) return { $t: 'ArrayBuffer', b: toB64(new Uint8Array(v)) };
  if (v instanceof Date) return { $t: 'Date', v: v.getTime() };
  if (Array.isArray(v)) return v.map(encodeValue);
  if (v instanceof Map) return { $t: 'Map', v: [...v].map(([k, x]) => [encodeValue(k), encodeValue(x)]) };
  if (v instanceof Set) return { $t: 'Set', v: [...v].map(encodeValue) };
  const o: Record<string, unknown> = {};
  for (const [k, x] of Object.entries(v)) o[k] = encodeValue(x);
  return '$t' in o ? { $t: 'Object', v: o } : o;
}

export function decodeValue(v: unknown): unknown {
  if (v === null || typeof v !== 'object') return v;
  if (Array.isArray(v)) return v.map(decodeValue);
  const o = v as Record<string, unknown>;
  if (typeof o.$t === 'string') {
    if (o.$t === 'Object') {
      const out: Record<string, unknown> = {};
      for (const [k, x] of Object.entries(o.v as Record<string, unknown>)) out[k] = decodeValue(x);
      return out;
    }
    if (o.$t === 'ArrayBuffer') return fromB64(o.b as string).buffer;
    if (o.$t === 'Date') return new Date(o.v as number);
    if (o.$t === 'Map') return new Map((o.v as [unknown, unknown][]).map(([k, x]) => [decodeValue(k), decodeValue(x)]));
    if (o.$t === 'Set') return new Set((o.v as unknown[]).map(decodeValue));
    const T = TYPED[o.$t];
    if (T) return new T(fromB64(o.b as string).buffer as ArrayBuffer);
  }
  const out: Record<string, unknown> = {};
  for (const [k, x] of Object.entries(o)) out[k] = decodeValue(x);
  return out;
}

// ------------------------------------------------------------------ lecture et écriture des données

interface StoreDump {
  name: string;
  keyPath: string | string[] | null;
  autoIncrement: boolean;
  records: [unknown, unknown][];
}
export interface Dump {
  voxerra: 1;
  db: { name: string; version: number; stores: StoreDump[] } | null;
  ls: Record<string, string>;
}

async function dbExists(name: string): Promise<boolean> {
  try {
    return (await indexedDB.databases()).some((d) => d.name === name);
  } catch {
    return true;
  }
}

function openDb(name: string, version?: number, upgrade?: (db: IDBDatabase) => void): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = version ? indexedDB.open(name, version) : indexedDB.open(name);
    r.onupgradeneeded = () => upgrade?.(r.result);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
    r.onblocked = () => rej(new Error('base bloquée'));
  });
}

/** Toutes les données du jeu de ce profil (mondes et réglages). */
export async function exportData(): Promise<Dump> {
  const ls: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(LS_PREFIX)) ls[k] = localStorage.getItem(k) ?? '';
  }
  if (!(await dbExists(DB))) return { voxerra: 1, db: null, ls };
  const db = await openDb(DB);
  try {
    const stores: StoreDump[] = [];
    for (const name of Array.from(db.objectStoreNames)) {
      const st = db.transaction(name, 'readonly').objectStore(name);
      const records: [unknown, unknown][] = [];
      await new Promise<void>((res, rej) => {
        const c = st.openCursor();
        c.onsuccess = () => {
          const cur = c.result;
          if (!cur) return res();
          records.push([encodeValue(cur.primaryKey), encodeValue(cur.value)]);
          cur.continue();
        };
        c.onerror = () => rej(c.error);
      });
      stores.push({ name, keyPath: st.keyPath as string | string[] | null, autoIncrement: st.autoIncrement, records });
    }
    return { voxerra: 1, db: { name: DB, version: db.version, stores }, ls };
  } finally {
    db.close();
  }
}

/** Identifiant du monde auquel appartient un enregistrement (mondes et copies : champ id ; colonnes : clé « monde|… »). */
function worldOf(store: string, key: unknown, value: unknown): string | null {
  if (store === 'chunks') return typeof key === 'string' ? key.split('|')[0] : null;
  const id = (value as { id?: unknown } | null)?.id;
  return typeof id === 'string' ? id : null;
}

/**
 * Ajoute les données transférées à ce profil, sans rien écraser : réglages déjà présents gardés, et un monde
 * qui existe déjà ici (récupération relancée après avoir joué) n'est pas remplacé par son ancienne copie.
 * Rend le nombre de mondes ajoutés.
 */
export async function importData(d: Dump): Promise<number> {
  for (const [k, v] of Object.entries(d.ls ?? {})) if (k.startsWith(LS_PREFIX) && localStorage.getItem(k) === null) localStorage.setItem(k, v);
  if (!d.db) return 0;
  const fresh = !(await dbExists(d.db.name));
  const db = fresh
    ? await openDb(d.db.name, d.db.version, (x) => {
        for (const s of d.db!.stores) if (!x.objectStoreNames.contains(s.name)) x.createObjectStore(s.name, { keyPath: s.keyPath, autoIncrement: s.autoIncrement });
      })
    : await openDb(d.db.name);
  let added = 0;
  try {
    const names = d.db.stores.map((s) => s.name).filter((n) => db.objectStoreNames.contains(n));
    const existing = new Set<string>();
    if (names.includes('worlds')) {
      const keys = await new Promise<IDBValidKey[]>((res, rej) => {
        const r = db.transaction('worlds', 'readonly').objectStore('worlds').getAllKeys();
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
      for (const k of keys) if (typeof k === 'string') existing.add(k);
    }
    if (names.length) {
      const tx = db.transaction(names, 'readwrite');
      const end = new Promise<void>((res, rej) => {
        tx.oncomplete = () => res();
        tx.onerror = () => rej(tx.error);
        tx.onabort = () => rej(tx.error ?? new Error('transaction annulée'));
      });
      for (const s of d.db.stores) {
        if (!names.includes(s.name)) continue;
        const st = tx.objectStore(s.name);
        for (const [k, v] of s.records) {
          const key = decodeValue(k);
          const value = decodeValue(v);
          const world = worldOf(s.name, key, value);
          if (world !== null && existing.has(world)) continue;
          if (st.keyPath !== null) st.put(value);
          else st.put(value, key as IDBValidKey);
          if (s.name === 'worlds') added++;
        }
      }
      await end;
    }
  } finally {
    db.close();
  }
  return added;
}

// ------------------------------------------------------------------ déroulement

function overlay(): { el: HTMLElement; show: (title: string, text: string, ...buttons: HTMLElement[]) => void } {
  const el = h('div', { class: 'screen', style: { background: '#1b1b22', zIndex: '50' } });
  (document.getElementById('ui') ?? document.body).appendChild(el);
  return {
    el,
    show: (title, text, ...buttons) => {
      el.replaceChildren(
        h('div', { class: 'title' }, title),
        h('div', { class: 'subtitle', style: { maxWidth: '620px', textAlign: 'center', marginBottom: '18px' } }, text),
        ...buttons,
      );
    },
  };
}

/** Dans l'ancienne fenêtre Edge : envoie les données au lanceur, puis se ferme. */
async function runExport(): Promise<void> {
  const ui = overlay();
  ui.show(t('Transfert des mondes'), t('Envoi de vos mondes vers la nouvelle fenêtre de Voxerra… Ne fermez pas cette fenêtre.'));
  try {
    const body = JSON.stringify(await exportData());
    const r = await fetch('/transfert/donnees', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    ui.show(t('Transfert des mondes'), t('C’est fait : vos mondes sont dans la nouvelle fenêtre. Vous pouvez fermer celle-ci.'));
    setTimeout(() => window.close(), 600);
  } catch (e) {
    ui.show(t('Transfert des mondes'), t('Le transfert a échoué : {msg}', { msg: String((e as Error)?.message ?? e) }));
  }
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Dans la nouvelle fenêtre : demande l'ancienne fenêtre au lanceur et attend ses données. */
async function runImport(): Promise<void> {
  const ui = overlay();
  for (;;) {
    ui.show(t('Récupération de vos mondes'), t('Voxerra s’ouvre maintenant dans sa propre fenêtre. Vos mondes de l’ancienne version sont récupérés : une fenêtre Edge s’ouvre quelques secondes, ne la fermez pas.'));
    let error = '';
    try {
      const go = await fetch('/transfert/lancer', { method: 'POST' });
      if (!go.ok) throw new Error((await go.text()) || `HTTP ${go.status}`);
      let dump: Dump | null = null;
      for (let i = 0; i < 180 && !dump; i++) {
        await wait(500);
        const r = await fetch('/transfert/donnees', { cache: 'no-store' });
        if (r.status === 200) dump = (await r.json()) as Dump;
      }
      if (!dump) throw new Error(t('l’ancienne fenêtre n’a pas répondu'));
      const n = await importData(dump);
      await fetch('/transfert/fini', { method: 'POST' });
      ui.show(t('Récupération de vos mondes'), n ? t('{n} monde(s) récupéré(s) !', { n }) : t('Aucun monde à récupérer.'));
      await wait(1500);
      ui.el.remove();
      return;
    } catch (e) {
      error = String((e as Error)?.message ?? e);
    }
    const choice = await new Promise<'again' | 'later'>((res) =>
      ui.show(
        t('Récupération de vos mondes'),
        t('La récupération a échoué ({msg}). Vos mondes restent intacts dans l’ancienne version ; vous pourrez réessayer depuis les Options.', { msg: error }),
        h('div', { class: 'row' }, button(t('Réessayer'), () => res('again'), 'half'), button(t('Plus tard'), () => res('later'), 'half')),
      ),
    );
    if (choice === 'later') {
      await fetch('/transfert/plus-tard', { method: 'POST' }).catch(() => {});
      ui.el.remove();
      return;
    }
  }
}

/**
 * Au démarrage, avant le jeu : ancienne fenêtre Edge → exporter (et ne pas lancer le jeu) ;
 * nouvelle fenêtre avec un transfert en attente → importer. Rend false si le jeu ne doit pas démarrer.
 */
export async function handleTransfer(): Promise<boolean> {
  const host = (globalThis as { voxerraHost?: Host & { platform?: string } }).voxerraHost;
  if (host?.platform !== 'launcher') return true;
  setLang(detectLang());
  if (new URLSearchParams(location.search).get('transfert') === 'export') {
    await runExport();
    return false;
  }
  if (!host.nativeWindow) return true;
  try {
    const r = await fetch('/transfert/etat', { cache: 'no-store' });
    if (r.ok && ((await r.json()) as { etat: string }).etat === 'a-faire') await runImport();
  } catch {
    // lanceur sans transfert : rien à faire
  }
  return true;
}

/** Options : relancer la récupération (nouvelle fenêtre du lanceur seulement). */
export function canRetryTransfer(): boolean {
  return !!(globalThis as { voxerraHost?: Host }).voxerraHost?.nativeWindow;
}

export async function retryTransfer(): Promise<void> {
  await fetch('/transfert/relancer', { method: 'POST' });
  location.reload();
}
