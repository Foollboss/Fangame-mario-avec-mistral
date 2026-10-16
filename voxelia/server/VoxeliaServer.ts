/**
 * Serveur multijoueur Voxelia : connexions WebSocket, accueil (version, invitation, places),
 * autorité sur les blocs modifiés, les blocs à données, l'heure, le chat et les permissions.
 * Le terrain est généré par chaque client à partir de la graine ; seul le diff est stocké ici.
 */
import { createServer, type IncomingMessage, type Server as HttpServer } from 'node:http';
import { WebSocket, WebSocketServer, type RawData } from 'ws';
import type { ClientMsg, Permission, PlayerState, PROTOCOL_VERSION as PROTO, ServerMsg } from '../src/net/protocol.ts';
import type { ServerConfig } from './config.ts';
import { MAX_CHUNK, MAX_DIM, type PlayerRecord, type WorldStore } from './storage.ts';
import { cleanIp, cleanName, errorText, isInt, isNum, isObject, jsonSize, log, nameKey, numberedName, sameCode, sanitizeChat, sanitizeName, sanitizeSkin, TokenBucket, warn } from './util.ts';
import { DAY_TICKS, worldInfo } from './world.ts';

/** Version du protocole (doit rester égale à PROTOCOL_VERSION de src/net/protocol.ts : vérifié par tsc). */
export const PROTOCOL_VERSION: typeof PROTO = 1;

export const MAX_MESSAGE_BYTES = 64 * 1024;
export const MAX_BLOCK_ENTITY_BYTES = 16 * 1024;
export const MAX_PLAYER_SAVE_BYTES = 60 * 1024;
const COORD_MAX = 30_000_000;
const HELLO_TIMEOUT_MS = 10_000;
const KEEPALIVE_MS = 15_000;
const TIME_BROADCAST_MS = 5_000;
const FLUSH_MS = 10_000;
const MAX_PENDING = 64;
/** Au-delà de cette distance horizontale, un joueur ne reçoit pas les changements de blocs (il les recevra en chargeant le tronçon). */
const BROADCAST_RADIUS = 800;
const SLOW_CLIENT_BYTES = 512 * 1024;
const DEAD_CLIENT_BYTES = 16 * 1024 * 1024;
const MAX_DROPPED = 2000;
const INVITE_FAILS = 5;
const INVITE_LOCK_MS = 60_000;

/** Champs reçus d'un message client, non vérifiés (les noms sont ceux du protocole). */
type In<K extends ClientMsg['t']> = { [P in keyof Extract<ClientMsg, { t: K }>]?: unknown };

interface Session {
  ws: WebSocket;
  ip: string;
  /** 0 tant que le joueur n'a pas été accueilli. */
  id: number;
  name: string;
  key: string;
  requestedName: string;
  skin: string;
  permission: Permission;
  record: PlayerRecord | null;
  state: PlayerState | null;
  stateChanged: boolean;
  joinedAt: number;
  alive: boolean;
  closed: boolean;
  helloTimer: ReturnType<typeof setTimeout> | null;
  dropped: number;
  lastWarn: number;
  buckets: {
    all: TokenBucket;
    block: TokenBucket;
    be: TokenBucket;
    state: TokenBucket;
    chat: TokenBucket;
    chunk: TokenBucket;
    save: TokenBucket;
    time: TokenBucket;
    ping: TokenBucket;
    denied: TokenBucket;
  };
}

export interface ServerStats {
  connections: number;
  invalidJson: number;
  unknownType: number;
  invalidFields: number;
  beforeHello: number;
  oversize: number;
  rateLimited: number;
  denied: number;
  kicked: number;
  handlerErrors: number;
  blocks: number;
  chats: number;
}

function newBuckets(): Session['buckets'] {
  return {
    all: new TokenBucket(600, 4000),
    block: new TokenBucket(40, 400),
    be: new TokenBucket(10, 40),
    state: new TokenBucket(25, 50),
    chat: new TokenBucket(1, 6),
    chunk: new TokenBucket(400, 3000),
    save: new TokenBucket(0.5, 5),
    time: new TokenBucket(2, 6),
    ping: new TokenBucket(5, 10),
    denied: new TokenBucket(20, 60),
  };
}

const PERMISSION_FR: Record<Permission, string> = { visitor: 'visiteur', member: 'membre', operator: 'opérateur' };

export function permissionLabel(p: Permission): string {
  return PERMISSION_FR[p];
}

/** Clé d'un nom saisi dans --ops ou la console (null si aucun caractère valide). */
export function typedNameKey(raw: string): string | null {
  const clean = cleanName(raw);
  return clean ? nameKey(clean) : null;
}

export class VoxeliaServer {
  readonly cfg: ServerConfig;
  readonly store: WorldStore;
  readonly stats: ServerStats = { connections: 0, invalidJson: 0, unknownType: 0, invalidFields: 0, beforeHello: 0, oversize: 0, rateLimited: 0, denied: 0, kicked: 0, handlerErrors: 0, blocks: 0, chats: 0 };
  private http: HttpServer;
  private wss: WebSocketServer;
  private sessions = new Map<WebSocket, Session>();
  private nextId = 1;
  private cliOps: Set<string>;
  private inviteFails = new Map<string, { count: number; first: number; until: number }>();
  private timers: Array<ReturnType<typeof setInterval>> = [];
  private lastTimeUpdate = Date.now();
  private flushRunning = false;
  private stopping = false;

  constructor(cfg: ServerConfig, store: WorldStore) {
    this.cfg = cfg;
    this.store = store;
    this.cliOps = new Set(cfg.ops.map(typedNameKey).filter((k): k is string => k !== null));
    this.http = createServer((_req, res) => {
      res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' });
      res.end(`Serveur Voxelia « ${this.store.world.info.name} » — ${this.playerCount}/${this.cfg.max} joueur(s).\nPour jouer : dans Voxelia, Jouer › Serveurs › Ajouter un serveur, puis saisissez l’adresse de cette machine.\n`);
    });
    this.wss = new WebSocketServer({ server: this.http, maxPayload: MAX_MESSAGE_BYTES, perMessageDeflate: false, clientTracking: false });
    this.wss.on('connection', (ws, req) => this.onConnection(ws, req));
    this.wss.on('error', (e) => warn(`erreur WebSocket : ${errorText(e)}`));
  }

  /** Écoute sur le port configuré. */
  start(): Promise<void> {
    return new Promise((resolve, reject) => {
      const onError = (e: NodeJS.ErrnoException) => {
        this.http.off('listening', onListening);
        if (e.code === 'EADDRINUSE') reject(new Error(`le port ${this.cfg.port} est déjà utilisé (un autre serveur est-il lancé ?)`));
        else if (e.code === 'EACCES') reject(new Error(`accès refusé au port ${this.cfg.port}`));
        else reject(e);
      };
      const onListening = () => {
        this.http.off('error', onError);
        this.http.on('error', (e) => warn(`erreur HTTP : ${errorText(e)}`));
        this.startTimers();
        resolve();
      };
      this.http.once('error', onError);
      this.http.once('listening', onListening);
      this.http.listen(this.cfg.port, this.cfg.host);
    });
  }

  get playerCount(): number {
    let n = 0;
    for (const s of this.sessions.values()) if (s.id && !s.closed) n++;
    return n;
  }

  /** Joueurs accueillis (pour la console). */
  players(): Array<{ id: number; name: string; ip: string; permission: Permission; since: number }> {
    const out: Array<{ id: number; name: string; ip: string; permission: Permission; since: number }> = [];
    for (const s of this.sessions.values()) if (s.id && !s.closed) out.push({ id: s.id, name: s.name, ip: s.ip, permission: s.permission, since: s.joinedAt });
    return out.sort((a, b) => a.id - b.id);
  }

  // ------------------------------------------------------------------ minuteries

  private startTimers(): void {
    this.lastTimeUpdate = Date.now();
    this.timers.push(setInterval(() => this.advanceTime(), 250));
    this.timers.push(setInterval(() => this.broadcastTime(), TIME_BROADCAST_MS));
    this.timers.push(setInterval(() => void this.periodicFlush(), FLUSH_MS));
    this.timers.push(setInterval(() => this.keepAlive(), KEEPALIVE_MS));
  }

  /** L'heure avance de 20 tics par seconde (cycle jour/nuit), seulement quand des joueurs sont connectés. */
  private advanceTime(): void {
    const now = Date.now();
    const dt = now - this.lastTimeUpdate;
    this.lastTimeUpdate = now;
    const w = this.store.world;
    if (w.info.rules.daylightCycle === false || this.playerCount === 0) return;
    w.time += dt / 50;
    while (w.time >= DAY_TICKS) {
      w.time -= DAY_TICKS;
      w.day++;
    }
    this.store.worldDirty = true;
  }

  private broadcastTime(except?: Session): void {
    const w = this.store.world;
    this.broadcast({ t: 'time', time: Math.floor(w.time), day: w.day }, except);
  }

  /** Règle l'heure (console ou opérateur) et la diffuse. */
  setTime(time: number, day: number, except?: Session): void {
    const w = this.store.world;
    let t = time;
    let d = day;
    while (t >= DAY_TICKS) {
      t -= DAY_TICKS;
      d++;
    }
    while (t < 0) {
      t += DAY_TICKS;
      d = Math.max(0, d - 1);
    }
    w.time = t;
    w.day = d;
    this.store.worldDirty = true;
    this.broadcastTime(except);
  }

  private async periodicFlush(): Promise<void> {
    if (this.flushRunning || this.stopping) return;
    this.flushRunning = true;
    try {
      this.syncPlayerStates();
      await this.store.flush();
    } catch (e) {
      warn(`sauvegarde périodique impossible : ${errorText(e)}`);
    } finally {
      this.flushRunning = false;
    }
    this.cleanInviteFails();
  }

  /** Recopie la dernière position des joueurs connectés dans leur fiche. */
  private syncPlayerStates(): void {
    for (const s of this.sessions.values()) {
      if (!s.id || !s.record || !s.state || !s.stateChanged) continue;
      s.stateChanged = false;
      s.record.state = { p: [s.state.p[0], s.state.p[1], s.state.p[2]], dim: s.state.dim, yaw: s.state.yaw, pitch: s.state.pitch };
      s.record.lastSeen = Date.now();
      s.record.dirty = true;
    }
  }

  /** Ping WebSocket ; une connexion qui n'a pas répondu depuis le précédent est coupée. */
  private keepAlive(): void {
    for (const s of this.sessions.values()) {
      if (!s.alive) {
        log(`Connexion sans réponse coupée : ${s.id ? s.name : s.ip}`);
        s.ws.terminate();
        this.dropSession(s);
        continue;
      }
      s.alive = false;
      try {
        s.ws.ping();
      } catch {
        /* fermeture en cours */
      }
    }
  }

  private cleanInviteFails(): void {
    const now = Date.now();
    for (const [ip, f] of this.inviteFails) if (f.until < now && now - f.first > INVITE_LOCK_MS) this.inviteFails.delete(ip);
  }

  // ------------------------------------------------------------------ connexions

  private onConnection(ws: WebSocket, req: IncomingMessage): void {
    const ip = cleanIp(req.socket.remoteAddress);
    this.stats.connections++;
    if (this.stopping) {
      ws.close(1001);
      return;
    }
    let pending = 0;
    for (const s of this.sessions.values()) if (!s.id) pending++;
    if (pending >= MAX_PENDING) {
      ws.terminate();
      return;
    }
    const s: Session = {
      ws,
      ip,
      id: 0,
      name: '',
      key: '',
      requestedName: '',
      skin: '',
      permission: 'visitor',
      record: null,
      state: null,
      stateChanged: false,
      joinedAt: 0,
      alive: true,
      closed: false,
      helloTimer: null,
      dropped: 0,
      lastWarn: 0,
      buckets: newBuckets(),
    };
    this.sessions.set(ws, s);
    s.helloTimer = setTimeout(() => {
      if (!s.id && !s.closed) ws.close(1008);
    }, HELLO_TIMEOUT_MS);
    ws.on('message', (data, isBinary) => this.onMessage(s, data, isBinary));
    ws.on('pong', () => {
      s.alive = true;
    });
    ws.on('close', () => this.dropSession(s));
    ws.on('error', (e) => {
      // Message trop grand (maxPayload) ou trame invalide : ws ferme la connexion.
      if (/max payload/i.test(e.message)) this.stats.oversize++;
      log(`Erreur de connexion (${s.id ? s.name : ip}) : ${e.message}`);
    });
  }

  private send(s: Session, m: ServerMsg): void {
    this.sendRaw(s, JSON.stringify(m));
  }

  private sendRaw(s: Session, data: string, optional = false): void {
    const ws = s.ws;
    if (ws.readyState !== WebSocket.OPEN) return;
    if (ws.bufferedAmount > DEAD_CLIENT_BYTES) {
      log(`Connexion trop lente coupée : ${s.name || s.ip}`);
      ws.terminate();
      this.dropSession(s);
      return;
    }
    if (optional && ws.bufferedAmount > SLOW_CLIENT_BYTES) return;
    ws.send(data);
  }

  /** Envoie à tous les joueurs accueillis (sauf `except`) ; `filter` restreint les destinataires. */
  private broadcast(m: ServerMsg, except?: Session, filter?: (s: Session) => boolean, optional = false): void {
    const data = JSON.stringify(m);
    for (const s of [...this.sessions.values()]) {
      if (!s.id || s.closed || s === except) continue;
      if (filter && !filter(s)) continue;
      this.sendRaw(s, data, optional);
    }
  }

  /** Message système (chat) à un joueur ou à tous. */
  systemChat(text: string, to?: Session): void {
    const m: ServerMsg = { t: 'chat', from: '', text, system: true };
    if (to) this.send(to, m);
    else this.broadcast(m);
  }

  /** Refuse une connexion : message d'erreur puis fermeture. */
  private reject(s: Session, message: string): void {
    this.send(s, { t: 'error', message });
    s.ws.close(1008);
  }

  /** Expulse un joueur (message affiché par le jeu) et le retire immédiatement de la partie. */
  kick(s: Session, message: string): void {
    this.stats.kicked++;
    this.send(s, { t: 'error', message });
    s.ws.close(1008);
    this.dropSession(s);
  }

  /** Expulse un joueur par son nom ; faux s'il n'est pas connecté. */
  kickByName(name: string, message: string): boolean {
    const key = typedNameKey(name);
    const s = key ? this.findByKey(key) : null;
    if (!s) return false;
    log(`Expulsion de ${s.name} : ${message}`);
    this.kick(s, message);
    return true;
  }

  /** Retire une session (fermeture, expulsion, connexion morte) ; sans effet si déjà fait. */
  private dropSession(s: Session): void {
    if (s.closed) return;
    s.closed = true;
    if (s.helloTimer) clearTimeout(s.helloTimer);
    s.helloTimer = null;
    this.sessions.delete(s.ws);
    if (!s.id) return;
    const r = s.record;
    if (r) {
      if (s.state) r.state = { p: [s.state.p[0], s.state.p[1], s.state.p[2]], dim: s.state.dim, yaw: s.state.yaw, pitch: s.state.pitch };
      r.lastSeen = Date.now();
      r.online = this.findByKey(s.key) !== null;
      r.dirty = true;
    }
    this.broadcast({ t: 'leave', id: s.id, name: s.name });
    const mins = Math.round((Date.now() - s.joinedAt) / 60000);
    log(`Déconnexion : ${s.name} (${mins} min) · ${this.playerCount}/${this.cfg.max} joueur(s)`);
  }

  // ------------------------------------------------------------------ messages

  private onMessage(s: Session, data: RawData, isBinary: boolean): void {
    if (s.closed) return;
    s.alive = true;
    if (isBinary) {
      this.stats.invalidJson++;
      return;
    }
    if (!s.buckets.all.take()) {
      this.stats.rateLimited++;
      if (++s.dropped > MAX_DROPPED) {
        log(`Trop de messages : ${s.name || s.ip} expulsé`);
        this.kick(s, 'Trop de messages envoyés au serveur.');
      }
      return;
    }
    let m: unknown;
    try {
      m = JSON.parse(rawToString(data));
    } catch {
      this.stats.invalidJson++;
      return;
    }
    if (!isObject(m) || typeof m.t !== 'string') {
      this.stats.invalidJson++;
      return;
    }
    try {
      this.dispatch(s, m.t, m);
    } catch (e) {
      this.stats.handlerErrors++;
      warn(`erreur en traitant « ${m.t} » de ${s.name || s.ip} : ${errorText(e)}`);
    }
  }

  private dispatch(s: Session, t: string, m: Record<string, unknown>): void {
    if (!s.id) {
      if (t === 'status') this.onStatus(s);
      else if (t === 'hello') this.onHello(s, m as In<'hello'>);
      else this.stats.beforeHello++;
      return;
    }
    switch (t) {
      case 'chunk':
        return this.onChunk(s, m as In<'chunk'>);
      case 'block':
        return this.onBlock(s, m as In<'block'>);
      case 'be':
        return this.onBlockEntity(s, m as In<'be'>);
      case 'state':
        return this.onState(s, m as In<'state'>);
      case 'chat':
        return this.onChat(s, m as In<'chat'>);
      case 'time':
        return this.onTime(s, m as In<'time'>);
      case 'save':
        return this.onSave(s, m as In<'save'>);
      case 'ping':
        if (s.buckets.ping.take() && isNum(m.n, -1e15, 1e15)) this.send(s, { t: 'pong', n: m.n });
        return;
      case 'hello':
      case 'status':
        this.stats.invalidFields++;
        return;
      default:
        this.stats.unknownType++;
    }
  }

  private onStatus(s: Session): void {
    const w = this.store.world.info;
    this.send(s, { t: 'status', name: w.name, motd: w.motd, players: this.playerCount, max: this.cfg.max, version: PROTOCOL_VERSION, needsInvite: this.cfg.invite !== null });
    s.ws.close(1000);
  }

  private onHello(s: Session, m: In<'hello'>): void {
    const lock = this.inviteFails.get(s.ip);
    if (lock && lock.until > Date.now()) {
      this.reject(s, 'Trop de tentatives avec un mauvais code. Réessayez dans une minute.');
      return;
    }
    if (m.v !== PROTOCOL_VERSION) {
      const v = typeof m.v === 'number' ? String(m.v) : '?';
      log(`Refus (${s.ip}) : version ${v} incompatible`);
      this.reject(s, `Version incompatible (serveur : ${PROTOCOL_VERSION}, jeu : ${v}). Mettez à jour Voxelia ou le serveur.`);
      return;
    }
    if (this.cfg.invite !== null && (typeof m.invite !== 'string' || !sameCode(m.invite, this.cfg.invite))) {
      const now = Date.now();
      const f = this.inviteFails.get(s.ip) ?? { count: 0, first: now, until: 0 };
      if (now - f.first > INVITE_LOCK_MS) {
        f.count = 0;
        f.first = now;
      }
      if (++f.count >= INVITE_FAILS) f.until = now + INVITE_LOCK_MS;
      this.inviteFails.set(s.ip, f);
      log(`Refus (${s.ip}) : code d’invitation invalide`);
      this.reject(s, 'Code d’invitation invalide');
      return;
    }
    const requested = sanitizeName(m.name);
    let name = requested;
    let key = nameKey(name);
    const same = this.findByKey(key);
    if (same) {
      if (same.ip === s.ip) {
        // Même appareil (reconnexion après une coupure) : l'ancienne connexion est remplacée.
        log(`${same.name} se reconnecte : l'ancienne connexion est fermée`);
        this.kick(same, 'Connexion remplacée par une nouvelle connexion de ce joueur.');
      } else {
        for (let n = 2; n < 1000; n++) {
          const candidate = numberedName(requested, n);
          if (!this.findByKey(nameKey(candidate))) {
            name = candidate;
            key = nameKey(candidate);
            break;
          }
        }
        if (this.findByKey(key)) {
          this.reject(s, 'Ce nom est déjà utilisé sur le serveur.');
          return;
        }
      }
    }
    if (this.playerCount >= this.cfg.max) {
      log(`Refus de ${name} (${s.ip}) : serveur complet`);
      this.reject(s, `Serveur complet (${this.cfg.max}/${this.cfg.max} joueurs).`);
      return;
    }
    if (s.helloTimer) clearTimeout(s.helloTimer);
    s.helloTimer = null;
    s.id = this.nextId++;
    s.name = name;
    s.key = key;
    s.requestedName = typeof m.name === 'string' ? m.name.trim().slice(0, 32) : '';
    s.skin = sanitizeSkin(m.skin);
    s.permission = this.resolvePermission(key, name);
    s.joinedAt = Date.now();
    const record = this.store.player(key, name);
    record.name = name;
    record.online = true;
    record.lastSeen = Date.now();
    s.record = record;
    this.send(s, { t: 'welcome', id: s.id, world: worldInfo(this.store.world), player: record.save ?? null, permission: s.permission });
    if (name !== requested) this.systemChat(`Le nom « ${requested} » est déjà utilisé : vous apparaissez sous le nom « ${name} ».`, s);
    for (const o of this.sessions.values()) {
      if (!o.id || o.closed || o === s) continue;
      this.send(s, { t: 'join', id: o.id, name: o.name, skin: o.skin });
      if (o.state) this.send(s, { t: 'state', s: o.state });
    }
    this.broadcast({ t: 'join', id: s.id, name: s.name, skin: s.skin }, s);
    log(`Connexion : ${name} (${s.ip}) — ${permissionLabel(s.permission)} · ${this.playerCount}/${this.cfg.max} joueur(s)`);
  }

  private findByKey(key: string): Session | null {
    for (const o of this.sessions.values()) if (o.id && !o.closed && o.key === key) return o;
    return null;
  }

  /**
   * Permission d'un joueur : opérateur s'il figure dans --ops ou dans world.json, sinon sa permission
   * enregistrée, sinon la permission par défaut. S'il n'existe aucun opérateur (ni --ops, ni world.json),
   * aucune permission enregistrée (la console n'a rien réglé) et que l'auto-promotion est active,
   * le premier joueur accueilli devient opérateur (enregistré).
   */
  private resolvePermission(key: string, name: string): Permission {
    const w = this.store.world;
    if (this.cliOps.has(key) || w.ops.includes(key)) return 'operator';
    const p = w.permissions[key];
    if (p) return p;
    if (this.cfg.autoOp && this.cfg.defaultPermission !== 'operator' && this.cliOps.size === 0 && w.ops.length === 0 && Object.keys(w.permissions).length === 0) {
      w.ops.push(key);
      this.store.worldDirty = true;
      log(`${name} devient opérateur (premier joueur, aucun opérateur défini)`);
      return 'operator';
    }
    return this.cfg.defaultPermission;
  }

  /** Change la permission d'un joueur (console) ; elle s'applique tout de suite côté serveur. */
  setPermission(rawName: string, p: Permission): string | null {
    const key = typedNameKey(rawName);
    if (!key) return null;
    const w = this.store.world;
    w.ops = w.ops.filter((k) => k !== key);
    delete w.permissions[key];
    if (p === 'operator') w.ops.push(key);
    else w.permissions[key] = p;
    this.store.worldDirty = true;
    const effective = this.resolvePermission(key, rawName);
    const s = this.findByKey(key);
    if (s) {
      s.permission = effective;
      this.systemChat(`Vos droits sur ce serveur : ${permissionLabel(effective)}. Reconnectez-vous pour que l’interface du jeu en tienne compte.`, s);
    }
    return key;
  }

  /** Vrai si ce nom (clé) est opérateur grâce à --ops (donc non modifiable depuis la console). */
  isCliOp(rawName: string): boolean {
    const key = typedNameKey(rawName);
    return key !== null && this.cliOps.has(key);
  }

  private onChunk(s: Session, m: In<'chunk'>): void {
    const { dim, cx, cz } = m;
    if (!isInt(dim, 0, MAX_DIM) || !isInt(cx, -MAX_CHUNK, MAX_CHUNK) || !isInt(cz, -MAX_CHUNK, MAX_CHUNK)) {
      this.stats.invalidFields++;
      return;
    }
    if (!s.buckets.chunk.take()) this.stats.rateLimited++;
    // On répond toujours : sans réponse le client attendrait puis afficherait le terrain sans les modifications.
    const c = this.store.chunk(dim, cx, cz);
    this.send(s, { t: 'chunk', dim, cx, cz, blocks: [...c.blocks], be: [...c.be] });
  }

  /** Position plausible : à portée de main, ou dans la zone que le client simule (liquides, cultures, explosions). */
  private inRange(s: Session, dim: number, x: number, y: number, z: number): boolean {
    const st = s.state;
    // Position inconnue (pas encore d'état reçu, ou changement de dimension en cours) : pas de vérification.
    if (!st || st.dim !== dim) return true;
    const dx = x + 0.5 - st.p[0];
    const dy = y + 0.5 - (st.p[1] + 1.62);
    const dz = z + 0.5 - st.p[2];
    const reach = this.cfg.reach;
    if (dx * dx + dy * dy + dz * dz <= reach * reach) return true;
    return Math.max(Math.abs(dx), Math.abs(dz)) <= this.cfg.simRadius;
  }

  /** Refus d'une modification : renvoie le bloc enregistré (-1 si inconnu : le client doit l'ignorer). */
  private deny(s: Session, dim: number, x: number, y: number, z: number): void {
    this.stats.denied++;
    if (!s.buckets.denied.take()) return;
    const known = isInt(dim, 0, MAX_DIM) && isInt(y, 0, 255) && Math.abs(x) <= COORD_MAX && Math.abs(z) <= COORD_MAX;
    this.send(s, { t: 'denied', x, y, z, dim, raw: known ? this.store.getBlock(dim, x, y, z) : -1 });
  }

  /** Destinataires d'un changement de bloc : même dimension et assez près (ou position inconnue). */
  private nearFilter(dim: number, x: number, z: number): (o: Session) => boolean {
    return (o) => {
      const st = o.state;
      if (!st) return true;
      return st.dim === dim && Math.abs(st.p[0] - x) <= BROADCAST_RADIUS && Math.abs(st.p[2] - z) <= BROADCAST_RADIUS;
    };
  }

  private onBlock(s: Session, m: In<'block'>): void {
    const { dim, x, y, z, raw } = m;
    if (!isInt(dim, -1e9, 1e9) || !isInt(x, -1e9, 1e9) || !isInt(y, -1e9, 1e9) || !isInt(z, -1e9, 1e9)) {
      this.stats.invalidFields++;
      return;
    }
    if (dim > MAX_DIM || dim < 0 || y < 0 || y > 255 || Math.abs(x) > COORD_MAX || Math.abs(z) > COORD_MAX || !isInt(raw, 0, 0xffff)) {
      this.stats.invalidFields++;
      this.deny(s, dim, x, y, z);
      return;
    }
    if (s.permission === 'visitor') return this.deny(s, dim, x, y, z);
    if (!s.buckets.block.take()) {
      this.stats.rateLimited++;
      return this.deny(s, dim, x, y, z);
    }
    if (!this.inRange(s, dim, x, y, z)) return this.deny(s, dim, x, y, z);
    this.store.setBlock(dim, x, y, z, raw);
    this.stats.blocks++;
    this.broadcast({ t: 'block', dim, x, y, z, raw, by: s.id }, s, this.nearFilter(dim, x, z));
  }

  private onBlockEntity(s: Session, m: In<'be'>): void {
    const { dim, x, y, z } = m;
    if (!isInt(dim, 0, MAX_DIM) || !isInt(x, -COORD_MAX, COORD_MAX) || !isInt(y, 0, 255) || !isInt(z, -COORD_MAX, COORD_MAX)) {
      this.stats.invalidFields++;
      return;
    }
    const data = m.data ?? null;
    if (data !== null && !isObject(data)) {
      this.stats.invalidFields++;
      return;
    }
    const size = jsonSize(data);
    if (size < 0 || size > MAX_BLOCK_ENTITY_BYTES) {
      this.stats.oversize++;
      return this.revertBlockEntity(s, dim, x, y, z);
    }
    if (s.permission === 'visitor' || !this.inRange(s, dim, x, y, z)) {
      this.stats.denied++;
      return this.revertBlockEntity(s, dim, x, y, z);
    }
    if (!s.buckets.be.take()) {
      this.stats.rateLimited++;
      return this.revertBlockEntity(s, dim, x, y, z);
    }
    this.store.setBlockEntity(dim, x, y, z, data);
    this.broadcast({ t: 'be', dim, x, y, z, data, by: s.id }, s, this.nearFilter(dim, x, z));
  }

  /** Renvoie au client les données enregistrées (si le serveur les connaît) pour annuler sa modification. */
  private revertBlockEntity(s: Session, dim: number, x: number, y: number, z: number): void {
    const known = this.store.getBlockEntity(dim, x, y, z);
    if (known !== undefined && s.buckets.denied.take()) this.send(s, { t: 'be', dim, x, y, z, data: known, by: 0 });
  }

  private onState(s: Session, m: In<'state'>): void {
    if (!s.buckets.state.take()) {
      this.stats.rateLimited++;
      return;
    }
    const st = m.s;
    if (!isObject(st)) {
      this.stats.invalidFields++;
      return;
    }
    const p = st.p;
    if (!Array.isArray(p) || p.length !== 3 || !isNum(p[0], -COORD_MAX, COORD_MAX) || !isNum(p[1], -4096, 4096) || !isNum(p[2], -COORD_MAX, COORD_MAX) || !isNum(st.yaw, -1e4, 1e4) || !isNum(st.pitch, -10, 10) || !isInt(st.dim, 0, MAX_DIM)) {
      this.stats.invalidFields++;
      return;
    }
    const state: PlayerState = {
      id: s.id,
      name: s.name,
      skin: s.skin,
      p: [p[0], p[1], p[2]],
      yaw: st.yaw,
      pitch: st.pitch,
      dim: st.dim,
      held: isInt(st.held, -1, 1e7) ? st.held : -1,
      sneaking: st.sneaking === true,
      swing: isNum(st.swing, 0, 1) ? st.swing : 0,
    };
    s.state = state;
    s.stateChanged = true;
    this.broadcast({ t: 'state', s: state }, s, undefined, true);
  }

  private onChat(s: Session, m: In<'chat'>): void {
    const text = sanitizeChat(m.text);
    if (!text) return;
    if (!s.buckets.chat.take()) {
      this.stats.rateLimited++;
      const now = Date.now();
      if (now - s.lastWarn > 3000) {
        s.lastWarn = now;
        this.systemChat('Vous envoyez des messages trop vite.', s);
      }
      return;
    }
    this.stats.chats++;
    if (m.system === true) {
      // Message de jeu (mort d'un joueur…) : il doit commencer par le nom de l'auteur, sinon il est traité comme du chat.
      if (this.store.world.info.rules.showDeathMessages === false) return;
      let t = text;
      if (s.requestedName && s.requestedName !== s.name && t.startsWith(s.requestedName + ' ')) t = s.name + t.slice(s.requestedName.length);
      if (t.startsWith(s.name + ' ')) {
        log(`* ${t}`);
        this.broadcast({ t: 'chat', from: s.name, text: t, system: true });
        return;
      }
    }
    log(`<${s.name}> ${text}`);
    this.broadcast({ t: 'chat', from: s.name, text });
  }

  private onTime(s: Session, m: In<'time'>): void {
    if (s.permission !== 'operator') {
      this.stats.denied++;
      return;
    }
    if (!s.buckets.time.take()) {
      this.stats.rateLimited++;
      return;
    }
    if (!isNum(m.time, -1e9, 1e9) || !isInt(m.day, 0, 1e9)) {
      this.stats.invalidFields++;
      return;
    }
    this.setTime(m.time, m.day, s);
  }

  private onSave(s: Session, m: In<'save'>): void {
    if (!s.record) return;
    if (!s.buckets.save.take()) {
      this.stats.rateLimited++;
      return;
    }
    if (!isObject(m.data)) {
      this.stats.invalidFields++;
      return;
    }
    const size = jsonSize(m.data);
    if (size < 0 || size > MAX_PLAYER_SAVE_BYTES) {
      this.stats.oversize++;
      return;
    }
    s.record.save = m.data;
    s.record.dirty = true;
  }

  // ------------------------------------------------------------------ arrêt

  /** Enregistre tout immédiatement (console). */
  async saveNow(): Promise<void> {
    this.syncPlayerStates();
    await this.store.flush();
  }

  /** Arrêt propre : prévient les joueurs, ferme les connexions, écrit tout ce qui reste. */
  async stop(message = 'Le serveur s’arrête.'): Promise<void> {
    if (this.stopping) return;
    this.stopping = true;
    for (const t of this.timers) clearInterval(t);
    this.timers = [];
    for (const s of [...this.sessions.values()]) {
      if (s.id) this.send(s, { t: 'error', message });
      s.ws.close(1001);
      this.dropSession(s);
    }
    await new Promise<void>((resolve) => {
      this.wss.close(() => resolve());
    });
    await new Promise<void>((resolve) => {
      this.http.close(() => resolve());
      this.http.closeAllConnections?.();
    });
    await this.store.flush();
  }
}

function rawToString(data: RawData): string {
  if (typeof data === 'string') return data;
  if (Buffer.isBuffer(data)) return data.toString('utf8');
  if (Array.isArray(data)) return Buffer.concat(data).toString('utf8');
  return Buffer.from(data).toString('utf8');
}
