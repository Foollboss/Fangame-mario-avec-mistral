/**
 * Client multijoueur : connexion WebSocket au serveur Voxelia, synchronisation des blocs,
 * des coffres/fours, des joueurs (position, apparence), du chat et de l'heure.
 * Les créatures restent simulées localement par chaque joueur (limite connue).
 */
import { Entity } from '../entity/Entity';
import { PROTOCOL_VERSION, type ClientMsg, type PlayerState, type Permission, type ServerMsg, type WorldInfo } from './protocol';
import type { SavedChunk } from '../world/ChunkManager';
import type { PlayerSave } from '../save/SaveManager';
import type { Game } from '../game/Game';

export class RemotePlayer extends Entity {
  readonly type = 'remote_player';
  name: string;
  skinKey: string;
  swingTime = 0;
  walkDist = 0;
  private target: [number, number, number] = [0, 0, 0];
  private targetYaw = 0;
  private targetPitch = 0;
  dim = 0;

  constructor(
    readonly netId: number,
    name: string,
    skin: string,
  ) {
    super();
    this.name = name;
    this.skinKey = 'player_' + skin;
    this.width = 0.6;
    this.height = 1.8;
  }

  apply(s: PlayerState): void {
    this.target = s.p;
    this.targetYaw = s.yaw;
    this.targetPitch = s.pitch;
    this.dim = s.dim;
    this.sneaking = s.sneaking;
    if (s.swing > 0) this.swingTime = 1;
    if (this.age === 0) {
      this.pos.set(s.p[0], s.p[1], s.p[2]);
      this.prevPos.copy(this.pos);
    }
  }

  sneaking = false;

  tick(): void {
    this.age++;
    this.prevPos.copy(this.pos);
    this.prevYaw = this.yaw;
    const k = 0.5;
    const dx = (this.target[0] - this.pos.x) * k;
    const dz = (this.target[2] - this.pos.z) * k;
    this.pos.x += dx;
    this.pos.y += (this.target[1] - this.pos.y) * k;
    this.pos.z += dz;
    this.walkDist += Math.hypot(dx, dz) * 0.6;
    let dy = this.targetYaw - this.yaw;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    this.yaw += dy * k;
    this.pitch += (this.targetPitch - this.pitch) * k;
    if (this.swingTime > 0) this.swingTime = Math.max(0, this.swingTime - 0.25);
  }
}

export class NetClient {
  private ws: WebSocket;
  id = 0;
  permission: Permission = 'member';
  world!: WorldInfo;
  playerSave: PlayerSave | null = null;
  private game: Game | null = null;
  private players = new Map<number, { state: PlayerState | null; name: string; skin: string; entity: RemotePlayer | null }>();
  private chunkWaiters = new Map<string, Array<() => void>>();
  private diffs = new Map<string, { blocks: Array<[number, number]>; be: Array<[number, unknown]> }>();
  private tickN = 0;
  private closedByUser = false;
  onDisconnect: ((reason: string) => void) | null = null;
  readonly address: string;

  private constructor(ws: WebSocket, address: string) {
    this.ws = ws;
    this.address = address;
  }

  /** Ouvre la connexion et attend l'accueil du serveur. */
  static connect(address: string, name: string, skin: string, invite?: string): Promise<NetClient> {
    let url = address.trim();
    if (!/^wss?:\/\//.test(url)) url = 'ws://' + url;
    if (!/:\d+(\/|$)/.test(url.replace(/^wss?:\/\//, ''))) url = url.replace(/\/?$/, ':19140');
    return new Promise((resolve, reject) => {
      let ws: WebSocket;
      try {
        ws = new WebSocket(url);
      } catch (e) {
        reject(new Error('Adresse invalide : ' + url));
        return;
      }
      const client = new NetClient(ws, url);
      const timer = window.setTimeout(() => {
        ws.close();
        reject(new Error('Le serveur ne répond pas (délai dépassé).'));
      }, 8000);
      ws.onopen = () => client.send({ t: 'hello', v: PROTOCOL_VERSION, name, skin, invite });
      ws.onerror = () => {
        clearTimeout(timer);
        reject(new Error('Connexion impossible à ' + url));
      };
      ws.onmessage = (ev) => {
        let m: ServerMsg;
        try {
          m = JSON.parse(String(ev.data));
        } catch {
          return;
        }
        if (m.t === 'welcome') {
          clearTimeout(timer);
          client.id = m.id;
          client.world = m.world;
          client.permission = m.permission;
          client.playerSave = (m.player as PlayerSave) ?? null;
          ws.onmessage = (e2) => client.onMessage(String(e2.data));
          ws.onclose = () => client.onClose();
          resolve(client);
        } else if (m.t === 'error') {
          clearTimeout(timer);
          reject(new Error(m.message));
          ws.close();
        }
      };
    });
  }

  get isOperator(): boolean {
    return this.permission === 'operator';
  }

  canEdit(_x: number, _y: number, _z: number): boolean {
    return this.permission !== 'visitor';
  }

  private send(m: ClientMsg): void {
    if (this.ws.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(m));
  }

  attach(game: Game): void {
    this.game = game;
    game.message(`Connecté à ${this.world.name}${this.world.motd ? ' — ' + this.world.motd : ''}`);
    if (this.permission === 'visitor') game.message('Vous êtes visiteur : vous ne pouvez pas modifier le monde.');
  }

  /** Demande les modifications d'un tronçon au serveur (le terrain est généré localement). */
  loadChunk(dim: number, cx: number, cz: number): Promise<SavedChunk | null> {
    const key = `${dim}|${cx},${cz}`;
    return new Promise((resolve) => {
      const list = this.chunkWaiters.get(key) ?? [];
      list.push(() => resolve(null));
      this.chunkWaiters.set(key, list);
      if (list.length === 1) this.send({ t: 'chunk', dim, cx, cz });
      window.setTimeout(() => resolve(null), 6000);
    });
  }

  /** Modifications reçues pour un tronçon qui vient d'être généré. */
  takeDiffs(dim: number, cx: number, cz: number): { blocks: Array<[number, number]>; be: Array<[number, unknown]> } | null {
    const key = `${dim}|${cx},${cz}`;
    const d = this.diffs.get(key) ?? null;
    this.diffs.delete(key);
    return d;
  }

  sendBlock(dim: number, x: number, y: number, z: number, raw: number): void {
    this.send({ t: 'block', dim, x, y, z, raw });
  }

  sendBlockEntity(dim: number, x: number, y: number, z: number, data: unknown): void {
    this.send({ t: 'be', dim, x, y, z, data });
  }

  sendChat(text: string, system = false): void {
    this.send({ t: 'chat', text: text.slice(0, 256), system });
  }

  sendTime(time: number, day: number): void {
    if (this.isOperator) this.send({ t: 'time', time, day });
  }

  sendDimension(_dim: number): void {
    this.tickN = 0;
  }

  remotePlayers(): RemotePlayer[] {
    const out: RemotePlayer[] = [];
    for (const p of this.players.values()) if (p.entity && !p.entity.removed) out.push(p.entity);
    return out;
  }

  /** Tic réseau : envoie l'état du joueur, maintient les avatars des autres joueurs. */
  tick(game: Game): void {
    this.tickN++;
    const p = game.player;
    if (this.tickN % 2 === 0) {
      this.send({
        t: 'state',
        s: { p: [round(p.pos.x), round(p.pos.y), round(p.pos.z)], yaw: round(p.yaw), pitch: round(p.pitch), dim: game.dimension, held: p.heldItem()?.id ?? -1, sneaking: p.sneaking, swing: p.swingTime > 0 ? 1 : 0 },
      });
    }
    if (this.tickN % 200 === 0) this.send({ t: 'save', data: p.serialize() });
    for (const [id, rp] of this.players) {
      if (!rp.state) continue;
      const same = rp.state.dim === game.dimension;
      if (same && (!rp.entity || rp.entity.removed)) {
        rp.entity = new RemotePlayer(id, rp.name, rp.skin);
        rp.entity.apply(rp.state);
        game.spawnEntity(rp.entity, rp.state.p[0], rp.state.p[1], rp.state.p[2]);
      } else if (!same && rp.entity) {
        rp.entity.remove();
        rp.entity = null;
      }
    }
  }

  private onMessage(raw: string): void {
    let m: ServerMsg;
    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }
    const g = this.game;
    switch (m.t) {
      case 'chunk': {
        const key = `${m.dim}|${m.cx},${m.cz}`;
        if (m.blocks.length || m.be.length) {
          // Les modifications reçues entre-temps (plus récentes) gardent la priorité
          const prev = this.diffs.get(key);
          const blocks = new Map<number, number>(m.blocks);
          const be = new Map<number, unknown>(m.be);
          if (prev) {
            for (const [i, r] of prev.blocks) blocks.set(i, r);
            for (const [i, d] of prev.be) be.set(i, d);
          }
          this.diffs.set(key, { blocks: [...blocks], be: [...be] });
        }
        const w = this.chunkWaiters.get(key);
        this.chunkWaiters.delete(key);
        w?.forEach((f) => f());
        break;
      }
      case 'block':
        if (g && m.dim === g.dimension && g.world.isLoaded(m.x, m.z)) g.world.setRaw(m.x, m.y, m.z, m.raw, 'remote');
        else this.stash(m.dim, m.x, m.y, m.z, m.raw, undefined);
        break;
      case 'denied':
        if (g && m.dim === g.dimension) {
          // -1 : le serveur ne connaît pas ce bloc (terrain d'origine) — on garde l'état local.
          if (m.raw >= 0) g.world.setRaw(m.x, m.y, m.z, m.raw, 'remote');
          const now = performance.now();
          if (now - this.lastDenied > 3000) {
            this.lastDenied = now;
            g.message('Action refusée par le serveur.');
          }
        }
        break;
      case 'be':
        if (g && m.dim === g.dimension && g.world.isLoaded(m.x, m.z)) g.world.setBlockEntity(m.x, m.y, m.z, m.data as never);
        else this.stash(m.dim, m.x, m.y, m.z, undefined, m.data);
        break;
      case 'join':
        this.players.set(m.id, { state: null, name: m.name, skin: m.skin, entity: null });
        g?.message(`§ ${m.name} a rejoint la partie`);
        break;
      case 'leave': {
        const rp = this.players.get(m.id);
        rp?.entity?.remove();
        this.players.delete(m.id);
        g?.message(`§ ${m.name} a quitté la partie`);
        break;
      }
      case 'state': {
        let rp = this.players.get(m.s.id);
        if (!rp) {
          rp = { state: null, name: m.s.name, skin: m.s.skin, entity: null };
          this.players.set(m.s.id, rp);
        }
        rp.state = m.s;
        rp.entity?.apply(m.s);
        break;
      }
      case 'chat':
        g?.message(m.system ? `§ ${m.text}` : `<${m.from}> ${m.text}`);
        break;
      case 'time':
        if (g) {
          g.meta.time = m.time;
          g.meta.day = m.day;
        }
        break;
      case 'error':
        g?.message('Serveur : ' + m.message);
        break;
    }
  }

  private lastDenied = 0;

  /** Modification reçue pour un tronçon pas encore chargé : appliquée à sa génération. */
  private stash(dim: number, x: number, y: number, z: number, raw: number | undefined, be: unknown): void {
    const cx = Math.floor(x / 16);
    const cz = Math.floor(z / 16);
    const key = `${dim}|${cx},${cz}`;
    let d = this.diffs.get(key);
    if (!d) {
      d = { blocks: [], be: [] };
      this.diffs.set(key, d);
    }
    const idx = (y << 8) | ((z & 15) << 4) | (x & 15);
    if (raw !== undefined) {
      d.blocks = d.blocks.filter((b) => b[0] !== idx);
      d.blocks.push([idx, raw]);
    } else {
      d.be = d.be.filter((b) => b[0] !== idx);
      d.be.push([idx, be]);
    }
  }

  private onClose(): void {
    if (this.closedByUser) return;
    this.onDisconnect?.('La connexion au serveur a été perdue.');
  }

  disconnect(): void {
    this.closedByUser = true;
    if (this.game) this.send({ t: 'save', data: this.game.player.serialize() });
    try {
      this.ws.close();
    } catch {
      /* déjà fermé */
    }
  }
}

function round(v: number): number {
  return Math.round(v * 100) / 100;
}
