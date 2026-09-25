/**
 * Session multijoueur côté client : reçoit colonnes, blocs, entités,
 * évènements et état du joueur ; envoie position et actions au serveur
 * autoritaire. Les entités distantes sont des « mandataires » interpolés.
 */
import type { ChunkStreamer } from '../world/chunkStreamer';
import type { ItemStack } from '../inventory/inventory';
import type { Game } from '../game/game';
import type { RayHit } from '../physics/raycast';
import { Entity } from '../entity/entity';
import { Chunk } from '../world/chunk';
import { decodeChunk } from '../save/serializer';
import { makeCell } from '../registry/blocks';
import { wireToChunk, PROTOCOL_VERSION, type ClientMsg, type ServerMsg, type EntSnap, type WelcomeMsg } from './protocol';

/** Entité distante (créature, joueur, objet, projectile, tombe) rendue localement. */
export class RemoteEntity extends Entity {
  kind: string;
  type = '';
  stack: ItemStack | null = null;
  health = 20;
  maxHealth = 20;
  hurtTime = 0;
  dead = false;
  deathTime = 0;
  swing = 0;
  bodyYaw = 0;
  heldItem: string | null = null;
  sneaking = false;
  flying = false;
  private tx = 0;
  private ty = 0;
  private tz = 0;

  constructor(s: EntSnap) {
    super(s.w ?? 0.3, s.ht ?? 1.8);
    this.id = s.id;
    this.kind = s.k;
    this.setPos(s.x, s.y, s.z);
    this.apply(s, true);
  }

  apply(s: EntSnap, first = false): void {
    // position précédente = dernière cible (interpolation jusqu'au prochain instantané)
    if (!first) {
      this.px = this.body.x;
      this.py = this.body.y;
      this.pz = this.body.z;
      this.pyaw = this.yaw;
    }
    this.tx = s.x;
    this.ty = s.y;
    this.tz = s.z;
    this.body.x = s.x;
    this.body.y = s.y;
    this.body.z = s.z;
    this.yaw = s.yw;
    this.pitch = s.pt;
    if (s.ty) this.type = s.ty;
    if (s.n) this.displayName = s.n;
    if (typeof s.hp === 'number') this.health = s.hp;
    if (typeof s.mx === 'number') this.maxHealth = s.mx;
    this.hurtTime = s.h ?? 0;
    this.dead = s.d !== undefined;
    this.deathTime = s.d ?? 0;
    this.swing = Math.max(this.swing * 0.5, s.sw ?? 0);
    if (typeof s.by === 'number') this.bodyYaw = s.by;
    if (s.hi !== undefined) this.heldItem = s.hi;
    this.sneaking = !!s.sn;
    this.flying = !!s.fl;
    if (s.st) this.stack = s.st;
    if (s.w) this.body.hw = s.w;
    if (s.ht) this.body.h = s.ht;
  }

  /** Les créatures distantes subissent des dégâts via le serveur uniquement. */
  damage(): number {
    return 0;
  }
  addEffect(): void {}
}

export class RemoteSession {
  game: Game | null = null;
  streamer: ChunkStreamer | null = null;
  private queue: ServerMsg[] = [];
  private moveT = 0;
  private lastMove = '';
  /** Interpolation des entités (0..1 entre deux instantanés). */
  alpha = 1;
  players: { id: number; name: string }[] = [];
  closed = false;
  onClose: ((reason: string) => void) | null = null;
  private closeReason = 'Connexion perdue.';

  constructor(
    readonly ws: WebSocket,
    readonly welcome: WelcomeMsg,
  ) {
    ws.onmessage = (ev) => {
      let m: ServerMsg;
      try {
        m = JSON.parse(String(ev.data));
      } catch {
        return;
      }
      if (this.game) this.handle(m);
      else this.queue.push(m);
    };
    ws.onclose = () => {
      if (this.closed) return;
      this.closed = true;
      this.onClose?.(this.closeReason);
    };
  }

  /** Établit la connexion et attend l'accueil du serveur. */
  static connect(url: string, name: string, timeoutMs = 10000): Promise<RemoteSession> {
    return new Promise((resolve, reject) => {
      let ws: WebSocket;
      try {
        ws = new WebSocket(url);
      } catch (e) {
        reject(new Error(`Adresse invalide : ${url}`));
        void e;
        return;
      }
      const early: ServerMsg[] = [];
      const timer = setTimeout(() => {
        ws.close();
        reject(new Error('Le serveur ne répond pas.'));
      }, timeoutMs);
      ws.onopen = () => ws.send(JSON.stringify({ t: 'hello', name, version: PROTOCOL_VERSION } satisfies ClientMsg));
      ws.onerror = () => {
        clearTimeout(timer);
        reject(new Error(`Serveur injoignable (${url}).`));
      };
      ws.onclose = () => {
        clearTimeout(timer);
        reject(new Error('Connexion refusée par le serveur.'));
      };
      ws.onmessage = (ev) => {
        const m = JSON.parse(String(ev.data)) as ServerMsg;
        if (m.t === 'kick') {
          clearTimeout(timer);
          ws.onclose = null;
          reject(new Error(m.reason));
          return;
        }
        if (m.t === 'welcome') {
          clearTimeout(timer);
          const s = new RemoteSession(ws, m);
          s.queue.push(...early);
          resolve(s);
          return;
        }
        early.push(m);
      };
    });
  }

  send(m: ClientMsg): void {
    if (this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(m));
  }

  attach(game: Game): void {
    this.game = game;
    const q = this.queue;
    this.queue = [];
    for (const m of q) this.handle(m);
  }

  attachStreamer(s: ChunkStreamer): void {
    this.streamer = s;
  }

  // ------------------------------------------------------------------ réception
  private handle(m: ServerMsg): void {
    const g = this.game!;
    const p = g.player;
    switch (m.t) {
      case 'kick':
        this.closeReason = m.reason;
        this.ws.close();
        break;
      case 'chunk': {
        if (m.dim !== p.dim || !this.streamer) return;
        const dec = decodeChunk(wireToChunk(m.rec), g.content.blocks);
        const c = new Chunk(m.rec.cx, m.rec.cz);
        c.loadSections(dec.sections);
        c.biomes.set(dec.biomes);
        c.tints.set(dec.tints);
        for (const [i, d] of dec.blockEntities) c.blockEntities.set(i, d);
        this.streamer.addRemote(c);
        break;
      }
      case 'block': {
        if (m.dim !== p.dim) return;
        const w = g.sim.world(m.dim);
        const id = g.content.blocks.tryNum(m.n);
        w.setBlock(m.x, m.y, m.z, makeCell(id, m.m));
        this.streamer?.flushAround(m.x, m.y, m.z);
        break;
      }
      case 'be': {
        if (m.dim !== p.dim) return;
        const w = g.sim.world(m.dim);
        const cur = w.getBlockEntity(m.x, m.y, m.z);
        if (!m.data) {
          w.setBlockEntity(m.x, m.y, m.z, null);
          return;
        }
        if (cur && cur.type === m.data.type && Array.isArray(cur.slots) && Array.isArray(m.data.slots)) {
          // mise à jour en place : les écrans ouverts gardent leur référence
          const slots = cur.slots as unknown[];
          (m.data.slots as unknown[]).forEach((s, i) => (slots[i] = s));
          for (const [k, v] of Object.entries(m.data)) if (k !== 'slots') (cur as Record<string, unknown>)[k] = v;
        } else w.setBlockEntity(m.x, m.y, m.z, m.data as { type: string });
        break;
      }
      case 'ents': {
        if (m.dim !== p.dim) return;
        const ents = g.sim.entities;
        for (const s of m.list) {
          const e = ents.get(s.id);
          if (e && e instanceof RemoteEntity) e.apply(s);
          else if (!e) {
            const re = new RemoteEntity(s);
            re.dim = m.dim;
            ents.add(re);
          }
        }
        for (const id of m.gone) {
          const e = ents.get(id);
          if (e && e !== p) e.removed = true;
        }
        ents.sweep();
        this.alpha = 0;
        // état du joueur local
        const me = m.me;
        p.maxHealth = me.mx;
        p.health = me.hp;
        p.energy = me.en;
        p.saturation = me.sa;
        p.air = me.air;
        p.bodyTemp = me.tmp;
        p.effects.clear();
        for (const [id, level, time] of me.fx) p.effects.set(id, { level, time, acc: 0 });
        if (me.dead && !p.dead) {
          p.dead = true;
          p.health = 0;
          if (me.dm) p.deathMessage = me.dm;
        } else if (!me.dead && p.dead) {
          p.dead = false;
          p.deathTime = 0;
        }
        if (p.gameMode !== me.gm) p.gameMode = me.gm as typeof p.gameMode;
        break;
      }
      case 'inv': {
        const sel = p.inventory.selected;
        p.inventory.loadAll(m.data);
        p.inventory.selected = sel;
        break;
      }
      case 'env': {
        const env = g.sim.env;
        env.time = m.time;
        env.weather = m.weather as typeof env.weather;
        env.weatherTimer = m.wt;
        env.flash = Math.max(env.flash, m.flash);
        break;
      }
      case 'ev':
        g.sim.emit(m.e);
        break;
      case 'pos':
        if (m.dim !== p.dim) g.remoteDimension(m.dim, m.x, m.y, m.z);
        else {
          p.setPos(m.x, m.y, m.z);
          p.body.vx = p.body.vy = p.body.vz = 0;
          p.body.fallDist = 0;
        }
        break;
      case 'players':
        this.players = m.list;
        break;
    }
  }

  // ------------------------------------------------------------------ envoi
  update(dt: number): void {
    this.alpha = Math.min(1, this.alpha + dt / 0.05);
    const g = this.game;
    if (!g) return;
    const p = g.player;
    this.moveT -= dt;
    if (this.moveT > 0 || p.dead) return;
    this.moveT = 0.05;
    const m: ClientMsg = { t: 'move', x: +p.x.toFixed(3), y: +p.y.toFixed(3), z: +p.z.toFixed(3), yw: +p.yaw.toFixed(3), pt: +p.pitch.toFixed(3), sn: p.sneaking, sp: p.sprinting, fl: p.flying, og: p.body.onGround, sl: p.inventory.selected };
    const key = JSON.stringify(m);
    if (key === this.lastMove) return;
    this.lastMove = key;
    this.send(m);
  }

  dig(x: number, y: number, z: number): void {
    this.send({ t: 'dig', x, y, z });
  }
  place(hit: RayHit, slot: number): void {
    this.send({ t: 'place', hit, slot });
  }
  interact(hit: RayHit): void {
    this.send({ t: 'interact', hit });
  }
  use(hit: RayHit | null, phase: 'start' | 'finish', held: number): void {
    this.send({ t: 'use', hit, phase, held });
  }
  attack(id: number): void {
    this.send({ t: 'attack', id });
  }
  drop(all: boolean): void {
    this.send({ t: 'drop', all });
  }
  fall(dist: number): void {
    this.send({ t: 'fall', dist });
  }
  dodge(fx: number, fz: number): void {
    this.send({ t: 'dodge', fx, fz });
  }
  dropStack(s: ItemStack): void {
    this.send({ t: 'dropStack', stack: s });
  }
  syncInventory(): void {
    const g = this.game;
    if (g) this.send({ t: 'inv', data: g.player.inventory.serializeAll() });
  }
  syncBlockEntity(x: number, y: number, z: number): void {
    const g = this.game;
    if (!g) return;
    const data = g.sim.world(g.player.dim).getBlockEntity(x, y, z);
    this.send({ t: 'be', x, y, z, data: data ? JSON.parse(JSON.stringify(data)) : null });
  }
  chat(text: string): void {
    this.send({ t: 'chat', text });
  }
  respawn(): void {
    this.send({ t: 'respawn' });
  }
  close(): void {
    if (this.closed) return;
    this.closed = true;
    try {
      this.ws.close();
    } catch {
      /* déjà fermé */
    }
  }
}
