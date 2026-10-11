/**
 * Partie ouverte au réseau local : le monde de l'hôte tourne dans un serveur intégré à sa page
 * (le même que le serveur dédié, en mode asynchrone : sauvegarde IndexedDB, génération par les
 * workers). L'hôte le rejoint par une connexion en mémoire ; ses amis passent par le relais
 * réseau de Voxerra.exe ou de l'appli Android, qui ne fait que transmettre les messages.
 */
import { GameServer, type ServerStorage, type GenChunk } from '../../server/gameServer';
import type { WorldMeta, WorldStorage } from '../save/storage';
import type { ChunkRecord } from '../save/serializer';
import type { Content } from '../registry/content';
import type { WorkerPool } from '../engine/workerPool';
import { LoopbackSocket } from './loopback';
import type { SocketLike } from './client';
import { t } from '../i18n/i18n';

/** Partie annoncée sur le réseau local (vue par le relais). */
export interface LanGame {
  name: string;
  world: string;
  host: string;
  port: number;
}

/** Relais réseau de l'application hôte (Voxerra.exe, appli Android). */
export interface LanBridge {
  /** WebSocket de contrôle (réservé à la machine elle-même). */
  hostUrl: string;
  /** Parties annoncées sur le réseau local. */
  games(): Promise<LanGame[]>;
}

export function lanBridge(): LanBridge | null {
  const h = (globalThis as { voxerraHost?: Record<string, unknown> }).voxerraHost;
  if (!h) return null;
  // lanceur Windows : objet { hostUrl, gamesUrl } ; appli Android : méthodes du pont Java
  const lan = h.lan as { hostUrl?: string; gamesUrl?: string } | undefined;
  if (lan?.hostUrl)
    return {
      hostUrl: lan.hostUrl,
      games: async () => (lan.gamesUrl ? ((await (await fetch(lan.gamesUrl, { cache: 'no-store' })).json()) as LanGame[]) : []),
    };
  if (typeof h.lanHostUrl === 'function') {
    const call = (k: string) => (h[k] as () => string)();
    return { hostUrl: call('lanHostUrl'), games: async () => JSON.parse(call('lanGames')) as LanGame[] };
  }
  return null;
}

const chunkKey = (dim: string, cx: number, cz: number) => `${dim}|${cx}|${cz}`;

/**
 * Sauvegarde du serveur intégré dans le monde de l'hôte : colonnes dans IndexedDB (gardées en
 * mémoire tant que l'écriture n'est pas confirmée), joueur de l'hôte = joueur du monde solo,
 * invités rangés dans le monde.
 */
class HostStorage implements ServerStorage {
  private unsaved = new Map<string, ChunkRecord>();
  private writing: Promise<void> = Promise.resolve();

  constructor(
    private store: WorldStorage,
    private meta: WorldMeta,
    private hostName: string,
  ) {}

  private guests(): Record<string, Record<string, unknown>> {
    const extra = (this.meta.extra ??= {});
    return ((extra.guests as Record<string, Record<string, unknown>> | undefined) ??= {}) as Record<string, Record<string, unknown>>;
  }

  loadChunkAsync(id: string, dim: string, cx: number, cz: number): Promise<ChunkRecord | null> {
    const mem = this.unsaved.get(chunkKey(dim, cx, cz));
    return mem ? Promise.resolve(mem) : this.store.loadChunk(id, dim, cx, cz);
  }

  saveBatchSync(meta: WorldMeta | null, recs: { dim: string; rec: ChunkRecord }[]): void {
    for (const r of recs) this.unsaved.set(chunkKey(r.dim, r.rec.cx, r.rec.cz), r.rec);
    // écrit après les joueurs (le serveur les range juste après cet appel)
    this.writing = this.writing
      .then(() => this.store.saveBatch(meta, recs))
      .then(() => {
        for (const r of recs) {
          const k = chunkKey(r.dim, r.rec.cx, r.rec.cz);
          if (this.unsaved.get(k) === r.rec) this.unsaved.delete(k);
        }
      })
      .catch((e) => console.error('Sauvegarde de la partie ouverte', e));
  }

  loadPlayer(_id: string, name: string): Record<string, unknown> | null {
    if (name === this.hostName) return (this.meta.player as Record<string, unknown> | null) ?? null;
    return this.guests()[name] ?? null;
  }

  savePlayer(_id: string, name: string, d: Record<string, unknown>): void {
    if (name === this.hostName) this.meta.player = d;
    else this.guests()[name] = d;
  }

  /** Attend la fin des écritures en cours. */
  flush(): Promise<void> {
    return this.writing;
  }
}

/** Liaison avec le relais : un message de contrôle par invité qui arrive, parle ou s'en va. */
class RelayLink {
  private ws: WebSocket;
  private guests = new Map<number, ReturnType<GameServer['connect']>>();
  closed = false;

  constructor(
    url: string,
    private server: GameServer,
    ready: (info: { port: number; addresses: string[] }) => void,
    failed: (msg: string) => void,
  ) {
    this.ws = new WebSocket(url);
    this.ws.onerror = () => failed(t('Le relais réseau ne répond pas.'));
    this.ws.onclose = () => {
      this.closed = true;
      for (const c of this.guests.values()) this.server.disconnect(c);
      this.guests.clear();
    };
    this.ws.onmessage = (ev) => {
      let m: { e: string; id?: number; d?: string; port?: number; addresses?: string[]; msg?: string };
      try {
        m = JSON.parse(String(ev.data));
      } catch {
        return;
      }
      const id = m.id ?? -1;
      if (m.e === 'ready') ready({ port: m.port ?? 25590, addresses: m.addresses ?? [] });
      else if (m.e === 'error') failed(m.msg ?? t('Le relais réseau ne répond pas.'));
      else if (m.e === 'open') {
        this.guests.set(
          id,
          this.server.connect({
            send: (d) => this.out({ e: 'msg', id, d }),
            close: () => this.out({ e: 'close', id }),
          }),
        );
      } else if (m.e === 'msg') {
        const c = this.guests.get(id);
        if (c && typeof m.d === 'string') this.server.handle(c, m.d);
      } else if (m.e === 'close') {
        const c = this.guests.get(id);
        if (c) this.server.disconnect(c);
        this.guests.delete(id);
      }
    };
  }

  private out(m: Record<string, unknown>): void {
    if (this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(m));
  }

  close(): void {
    this.ws.close();
  }
}

export interface LanHostApp {
  content: Content;
  storage: WorldStorage;
  pool: WorkerPool;
  settings: { playerName: string; renderDistance: number };
}

/** Battement à 20 Hz qui continue quand la fenêtre est en arrière-plan (minuterie d'un worker). */
function heartbeat(beat: () => void): () => void {
  try {
    const url = URL.createObjectURL(new Blob(['setInterval(function(){postMessage(0)},25)'], { type: 'text/javascript' }));
    const w = new Worker(url);
    w.onmessage = beat;
    return () => {
      w.terminate();
      URL.revokeObjectURL(url);
    };
  } catch {
    const id = setInterval(beat, 25);
    return () => clearInterval(id);
  }
}

export class LanHost {
  readonly server: GameServer;
  readonly meta: WorldMeta;
  private storage: HostStorage;
  private stopBeat: (() => void) | null = null;
  private relay: RelayLink | null = null;
  /** Adresses à donner aux amis (réseau ouvert). */
  network: { port: number; addresses: string[] } | null = null;

  constructor(app: LanHostApp, meta: WorldMeta) {
    this.meta = meta;
    this.storage = new HostStorage(app.storage, meta, app.settings.playerName);
    this.server = new GameServer(app.content, meta, this.storage, {
      radius: Math.max(4, Math.min(8, app.settings.renderDistance)),
      motd: t('Partie de {name}', { name: app.settings.playerName }),
      maxPlayers: 8,
      log: (m) => console.info(m),
      generate: (dim, cx, cz) => app.pool.request<GenChunk>({ type: 'gen', dim, cx, cz }),
    });
  }

  /** Lance la boucle du serveur (20 ticks par seconde, rattrapage limité). */
  start(): void {
    let last = performance.now(),
      acc = 0;
    this.stopBeat = heartbeat(() => {
      const now = performance.now();
      acc += now - last;
      last = now;
      let n = 0;
      while (acc >= 50 && n < 10) {
        acc -= 50;
        n++;
        try {
          this.server.tick();
        } catch (e) {
          console.error('Tick de la partie ouverte', e);
        }
      }
      if (n >= 10) acc = 0;
    });
  }

  /** Connexion du joueur qui héberge. */
  socket(): SocketLike {
    return new LoopbackSocket(this.server);
  }

  /** Ouvre la partie aux autres appareils du réseau local (relais de l'application). */
  openNetwork(bridge: LanBridge, worldName: string, hostName: string): Promise<{ port: number; addresses: string[] }> {
    return new Promise((resolve, reject) => {
      const url = `${bridge.hostUrl}?monde=${encodeURIComponent(worldName)}&joueur=${encodeURIComponent(hostName)}`;
      this.relay = new RelayLink(
        url,
        this.server,
        (info) => {
          this.network = info;
          resolve(info);
        },
        (msg) => reject(new Error(msg)),
      );
    });
  }

  /** Joueurs connectés (hôte compris). */
  players(): string[] {
    return this.server.clients.filter((c) => c.player).map((c) => c.name);
  }

  /** Ferme la partie : invités prévenus, monde sauvegardé. */
  async stop(): Promise<void> {
    this.stopBeat?.();
    this.stopBeat = null;
    this.relay?.close();
    this.relay = null;
    this.server.stop(t('L’hôte a quitté la partie.'));
    await this.storage.flush();
  }
}
