/**
 * Stockage du monde servi : world.json, chunks/<dim>_<cx>_<cz>.json (blocs modifiés et
 * blocs à données) et players/<nom>.json. Le terrain n'est jamais stocké : chaque client
 * le génère à partir de la graine. Écritures atomiques (fichier temporaire + fsync + rename).
 */
import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, readdirSync, renameSync, unlinkSync } from 'node:fs';
import { open, rename } from 'node:fs/promises';
import { join } from 'node:path';
import type { ServerConfig } from './config.ts';
import { errorText, isInt, isNum, isObject, log, warn } from './util.ts';
import { applyConfig, newWorldFile, normalizeWorldFile, type WorldFile } from './world.ts';

export const MAX_DIM = 7;
export const MAX_CHUNK = 2_000_000;

/** Modifications d'un tronçon : index local → bloc brut, index local → données de bloc. */
export interface ChunkDiff {
  blocks: Map<number, number>;
  be: Map<number, unknown>;
  dirty: boolean;
  touched: number;
}

export interface PlayerRecord {
  name: string;
  /** Sauvegarde du joueur envoyée par le client (PlayerSave), rendue à la reconnexion. */
  save: unknown;
  /** Dernière position connue. */
  state: { p: [number, number, number]; dim: number; yaw: number; pitch: number } | null;
  lastSeen: number;
  online: boolean;
  dirty: boolean;
}

const CHUNK_CACHE_MAX = 4096;
const CHUNK_IDLE_MS = 120_000;

let tmpSeq = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/** Écrit `data` dans `file` sans jamais laisser de fichier à moitié écrit. */
export async function atomicWrite(file: string, data: string): Promise<void> {
  const tmp = `${file}.tmp-${process.pid}-${++tmpSeq}`;
  const fh = await open(tmp, 'w');
  try {
    await fh.writeFile(data, 'utf8');
    await fh.sync();
  } finally {
    await fh.close();
  }
  // Windows : un antivirus peut bloquer brièvement le remplacement.
  for (let attempt = 0; ; attempt++) {
    try {
      await rename(tmp, file);
      return;
    } catch (e) {
      const code = (e as NodeJS.ErrnoException).code;
      if (attempt < 4 && (code === 'EPERM' || code === 'EBUSY' || code === 'EACCES')) {
        await sleep(40 * (attempt + 1));
        continue;
      }
      try {
        unlinkSync(tmp);
      } catch {
        /* déjà supprimé */
      }
      throw e;
    }
  }
}

/** Synchronise un dossier après des renommages (ignoré là où ce n'est pas possible). */
function syncDir(dir: string): void {
  try {
    const fd = openSync(dir, 'r');
    try {
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
  } catch {
    /* Windows : non pris en charge */
  }
}

/** Met de côté un fichier illisible pour ne pas l'écraser (on pourra le réparer à la main). */
function quarantine(file: string, reason: string): void {
  const dest = `${file}.corrupt-${Date.now()}`;
  try {
    renameSync(file, dest);
    warn(`fichier illisible (${reason}) mis de côté : ${dest}`);
  } catch (e) {
    warn(`fichier illisible (${reason}) : ${file} — ${errorText(e)}`);
  }
}

export function chunkKey(dim: number, cx: number, cz: number): string {
  return `${dim}_${cx}_${cz}`;
}

export class WorldStore {
  readonly dir: string;
  private readonly chunkDir: string;
  private readonly playerDir: string;
  world!: WorldFile;
  worldDirty = false;
  private chunks = new Map<string, ChunkDiff>();
  private onDisk = new Set<string>();
  private players = new Map<string, PlayerRecord>();
  private flushing: Promise<void> | null = null;
  readonly stats = { chunkWrites: 0, playerWrites: 0, worldWrites: 0, corrupt: 0, writeErrors: 0 };

  constructor(dir: string) {
    this.dir = dir;
    this.chunkDir = join(dir, 'chunks');
    this.playerDir = join(dir, 'players');
  }

  /** Ouvre (ou crée) le monde. Renvoie les remarques à afficher. */
  open(cfg: ServerConfig): { created: boolean; notes: string[] } {
    mkdirSync(this.chunkDir, { recursive: true });
    mkdirSync(this.playerDir, { recursive: true });
    for (const d of [this.dir, this.chunkDir, this.playerDir]) this.cleanTemp(d);
    const file = join(this.dir, 'world.json');
    let world: WorldFile | null = null;
    let created = false;
    const notes: string[] = [];
    if (existsSync(file)) {
      try {
        world = normalizeWorldFile(JSON.parse(readFileSync(file, 'utf8')));
        if (!world) throw new Error('contenu inattendu');
      } catch (e) {
        this.stats.corrupt++;
        quarantine(file, errorText(e));
        notes.push('world.json était illisible : un nouveau monde a été créé avec les options données (les tronçons existants sont conservés).');
        world = null;
      }
    }
    if (world) notes.push(...applyConfig(world, cfg));
    else {
      world = newWorldFile(cfg);
      created = true;
    }
    this.world = world;
    this.worldDirty = true;
    for (const f of readdirSync(this.chunkDir)) {
      const m = /^(-?\d+)_(-?\d+)_(-?\d+)\.json$/.exec(f);
      if (m) this.onDisk.add(`${m[1]}_${m[2]}_${m[3]}`);
    }
    return { created, notes };
  }

  get chunkFileCount(): number {
    return this.onDisk.size;
  }

  private cleanTemp(dir: string): void {
    try {
      for (const f of readdirSync(dir)) if (/\.tmp-\d+-\d+$/.test(f)) unlinkSync(join(dir, f));
    } catch {
      /* rien à nettoyer */
    }
  }

  // ------------------------------------------------------------------ tronçons

  /** Modifications d'un tronçon (chargées depuis le disque au premier accès). */
  chunk(dim: number, cx: number, cz: number): ChunkDiff {
    const key = chunkKey(dim, cx, cz);
    let c = this.chunks.get(key);
    if (!c) {
      c = { blocks: new Map(), be: new Map(), dirty: false, touched: Date.now() };
      if (this.onDisk.has(key)) this.readChunk(key, c);
      this.chunks.set(key, c);
    }
    c.touched = Date.now();
    return c;
  }

  private readChunk(key: string, c: ChunkDiff): void {
    const file = join(this.chunkDir, key + '.json');
    try {
      const data: unknown = JSON.parse(readFileSync(file, 'utf8'));
      if (!isObject(data) || !Array.isArray(data.blocks)) throw new Error('contenu inattendu');
      for (const e of data.blocks) if (Array.isArray(e) && isInt(e[0], 0, 65535) && isInt(e[1], 0, 0xffff)) c.blocks.set(e[0], e[1]);
      if (Array.isArray(data.be)) for (const e of data.be) if (Array.isArray(e) && isInt(e[0], 0, 65535) && e[1] != null) c.be.set(e[0], e[1]);
    } catch (e) {
      this.stats.corrupt++;
      this.onDisk.delete(key);
      quarantine(file, errorText(e));
      c.blocks.clear();
      c.be.clear();
    }
  }

  /** Bloc brut enregistré à cette position, ou -1 s'il n'a jamais été modifié. */
  getBlock(dim: number, x: number, y: number, z: number): number {
    const c = this.chunk(dim, x >> 4, z >> 4);
    return c.blocks.get(localIndex(x, y, z)) ?? -1;
  }

  setBlock(dim: number, x: number, y: number, z: number, raw: number): void {
    const c = this.chunk(dim, x >> 4, z >> 4);
    const i = localIndex(x, y, z);
    c.blocks.set(i, raw);
    // Un bloc d'air n'a plus de données (coffre cassé, etc.).
    if ((raw & 0x3ff) === 0) c.be.delete(i);
    c.dirty = true;
  }

  getBlockEntity(dim: number, x: number, y: number, z: number): unknown {
    return this.chunk(dim, x >> 4, z >> 4).be.get(localIndex(x, y, z));
  }

  setBlockEntity(dim: number, x: number, y: number, z: number, data: unknown): void {
    const c = this.chunk(dim, x >> 4, z >> 4);
    const i = localIndex(x, y, z);
    if (data === null || data === undefined) c.be.delete(i);
    else c.be.set(i, data);
    c.dirty = true;
  }

  // ------------------------------------------------------------------ joueurs

  /** Fiche d'un joueur (clé en minuscules), chargée depuis le disque si besoin. */
  player(key: string, displayName: string): PlayerRecord {
    let p = this.players.get(key);
    if (p) return p;
    p = { name: displayName, save: null, state: null, lastSeen: 0, online: false, dirty: false };
    const file = join(this.playerDir, key + '.json');
    if (existsSync(file)) {
      try {
        const data: unknown = JSON.parse(readFileSync(file, 'utf8'));
        if (!isObject(data)) throw new Error('contenu inattendu');
        p.save = isObject(data.save) ? data.save : null;
        const s = data.state;
        if (isObject(s) && Array.isArray(s.p) && s.p.length === 3 && s.p.every((n) => isNum(n, -3e7, 3e7)) && isInt(s.dim, 0, MAX_DIM))
          p.state = { p: [s.p[0], s.p[1], s.p[2]] as [number, number, number], dim: s.dim, yaw: isNum(s.yaw, -1e4, 1e4) ? s.yaw : 0, pitch: isNum(s.pitch, -10, 10) ? s.pitch : 0 };
        p.lastSeen = isNum(data.lastSeen, 0, 1e15) ? data.lastSeen : 0;
      } catch (e) {
        this.stats.corrupt++;
        quarantine(file, errorText(e));
      }
    }
    this.players.set(key, p);
    return p;
  }

  // ------------------------------------------------------------------ écriture

  /** Écrit tout ce qui a changé. Les appels simultanés attendent l'écriture en cours puis relancent. */
  async flush(): Promise<void> {
    while (this.flushing) await this.flushing;
    this.flushing = this.doFlush().finally(() => {
      this.flushing = null;
    });
    return this.flushing;
  }

  private async doFlush(): Promise<void> {
    let chunkWrites = 0;
    let playerWrites = 0;
    for (const [key, c] of this.chunks) {
      if (!c.dirty) continue;
      c.dirty = false;
      const [dim, cx, cz] = key.split('_').map(Number) as [number, number, number];
      const body = JSON.stringify({ format: 1, dim, cx, cz, blocks: [...c.blocks], be: [...c.be] });
      try {
        await atomicWrite(join(this.chunkDir, key + '.json'), body);
        this.onDisk.add(key);
        chunkWrites++;
      } catch (e) {
        c.dirty = true;
        this.stats.writeErrors++;
        warn(`écriture du tronçon ${key} impossible : ${errorText(e)}`);
      }
    }
    for (const [key, p] of this.players) {
      if (!p.dirty) continue;
      p.dirty = false;
      const body = JSON.stringify({ name: p.name, save: p.save, state: p.state, lastSeen: p.lastSeen });
      try {
        await atomicWrite(join(this.playerDir, key + '.json'), body);
        playerWrites++;
      } catch (e) {
        p.dirty = true;
        this.stats.writeErrors++;
        warn(`écriture du joueur ${p.name} impossible : ${errorText(e)}`);
      }
    }
    if (chunkWrites) syncDir(this.chunkDir);
    if (playerWrites) syncDir(this.playerDir);
    if (this.worldDirty) {
      this.worldDirty = false;
      this.world.saved = Date.now();
      try {
        await atomicWrite(join(this.dir, 'world.json'), JSON.stringify(this.world, null, 2));
        syncDir(this.dir);
        this.stats.worldWrites++;
      } catch (e) {
        this.worldDirty = true;
        this.stats.writeErrors++;
        warn(`écriture de world.json impossible : ${errorText(e)}`);
      }
    }
    this.stats.chunkWrites += chunkWrites;
    this.stats.playerWrites += playerWrites;
    this.evict();
  }

  /** Libère la mémoire des tronçons inactifs déjà écrits et des joueurs hors ligne. */
  private evict(): void {
    if (this.chunks.size > CHUNK_CACHE_MAX) {
      const limit = Date.now() - CHUNK_IDLE_MS;
      for (const [k, c] of this.chunks) if (!c.dirty && c.touched < limit) this.chunks.delete(k);
    }
    for (const [k, p] of this.players) if (!p.online && !p.dirty) this.players.delete(k);
  }

  /** Nombre de tronçons modifiés en mémoire et non encore écrits. */
  get pendingChunks(): number {
    let n = 0;
    for (const c of this.chunks.values()) if (c.dirty) n++;
    return n;
  }
}

/** Index d'un bloc dans sa colonne (même formule que localIndex du protocole). */
export function localIndex(x: number, y: number, z: number): number {
  return (y << 8) | ((z & 15) << 4) | (x & 15);
}

export function logStoreSummary(store: WorldStore): void {
  const s = store.stats;
  log(`Écritures : ${s.chunkWrites} tronçon(s), ${s.playerWrites} joueur(s), ${s.worldWrites} world.json · fichiers illisibles : ${s.corrupt} · erreurs d'écriture : ${s.writeErrors}`);
}
