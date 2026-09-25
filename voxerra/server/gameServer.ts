/**
 * Serveur de jeu autoritaire : même simulation que le solo (Sim), génération
 * et chargement des colonnes autour des joueurs, réplication (colonnes, blocs,
 * entités, évènements, inventaires), actions validées, sauvegarde du monde et
 * des joueurs. Indépendant du transport (voir server.ts pour WebSocket).
 */
import { Sim, TICK } from '../src/sim/sim';
import type { Content } from '../src/registry/content';
import type { WorldMeta } from '../src/save/storage';
import { DEFAULT_RULES } from '../src/save/storage';
import { Player } from '../src/entity/player';
import { Chunk } from '../src/world/chunk';
import { ckey, ckeyX, ckeyZ, CS } from '../src/world/constants';
import { createGenerator, type DimGenerator } from '../src/worldgen/generator';
import { encodeChunk, decodeChunk, type ChunkRecord } from '../src/save/serializer';
import { AdvancementTracker } from '../src/sim/advancements';
import { installMobs } from '../src/sim/mobs';
import { digBlock, placeBlock, interactBlock, useItem, finishUse, useDuration, attackEntity, dropHeld, throwStack, dodge } from '../src/sim/interact';
import { applyFall } from '../src/sim/survival';
import { runCommand } from '../src/sim/commands';
import { Grave } from '../src/entity/grave';
import type { LivingEntity } from '../src/entity/living';
import type { Entity } from '../src/entity/entity';
import type { SimEvent } from '../src/sim/events';
import { raycastBlocks } from '../src/physics/raycast';
import { lookDir } from '../src/engine/math';
import { REACH, CREATIVE_REACH } from '../src/sim/interact';
import { PROTOCOL_VERSION, chunkToWire, eventTarget, type ClientMsg, type ServerMsg, type EntSnap, type SelfSnap } from '../src/net/protocol';
import type { FileStorage } from './fileStorage';

/** Transport minimal (WebSocket réel ou faux pour les tests). */
export interface Conn {
  send(data: string): void;
  close(): void;
}

interface Client {
  conn: Conn;
  player: Player | null;
  name: string;
  /** Colonnes envoyées, par dimension. */
  sent: Set<number>;
  sentDim: string;
  known: Set<number>;
  lastInv: string;
  lastPosT: number;
  deathHandled: boolean;
}

/** Stockage minimal utilisé par le serveur (FileStorage ou mémoire pour les tests). */
export type ServerStorage = Pick<FileStorage, 'loadChunkSync' | 'saveBatchSync' | 'loadPlayer' | 'savePlayer'>;

export interface ServerOptions {
  radius?: number;
  motd?: string;
  log?: (msg: string) => void;
  maxPlayers?: number;
}

const round = (v: number, k = 100): number => Math.round(v * k) / k;
const VIEW_ENTS = 72;

export class GameServer {
  readonly sim: Sim;
  readonly clients: Client[] = [];
  readonly radius: number;
  private gens = new Map<string, DimGenerator>();
  private pendingSaves = new Map<string, { dim: string; rec: ChunkRecord }>();
  private outbox = new Map<Client, ServerMsg[]>();
  private saveTimer = 0;
  private log: (m: string) => void;
  motd: string;
  maxPlayers: number;

  constructor(
    readonly content: Content,
    readonly meta: WorldMeta,
    readonly storage: ServerStorage,
    opts: ServerOptions = {},
  ) {
    this.radius = opts.radius ?? 6;
    this.motd = opts.motd ?? 'Un serveur Voxerra';
    this.maxPlayers = opts.maxPlayers ?? 16;
    this.log = opts.log ?? ((m) => console.log(m));
    const sim = (this.sim = new Sim(content, meta));
    sim.modules.push(new AdvancementTracker(sim));
    installMobs(sim);
    sim.on((e) => this.onEvent(e));
    this.hookWorlds();
    if (!meta.spawn) {
      const sp = this.gen('surface').findSpawn();
      meta.spawn = { x: sp.x + 0.5, y: sp.y + 1, z: sp.z + 0.5 };
    }
  }

  private gen(dim: string): DimGenerator {
    let g = this.gens.get(dim);
    if (!g) {
      g = createGenerator(dim, this.meta.seed, this.content, this.meta.worldType, this.meta.structures !== false);
      this.gens.set(dim, g);
    }
    return g;
  }

  // ------------------------------------------------------------------ connexions
  connect(conn: Conn): Client {
    const c: Client = { conn, player: null, name: '', sent: new Set(), sentDim: '', known: new Set(), lastInv: '', lastPosT: 0, deathHandled: false };
    this.clients.push(c);
    return c;
  }

  disconnect(c: Client): void {
    const i = this.clients.indexOf(c);
    if (i < 0) return;
    this.clients.splice(i, 1);
    this.outbox.delete(c);
    const p = c.player;
    if (p) {
      this.storage.savePlayer(this.meta.id, c.name, p.serialize());
      this.sim.removePlayer(p);
      this.broadcastMsg(`${c.name} a quitté la partie.`, '#ffe080');
      this.log(`[serveur] ${c.name} déconnecté`);
      this.sendPlayerList();
    }
  }

  private send(c: Client, m: ServerMsg): void {
    let q = this.outbox.get(c);
    if (!q) this.outbox.set(c, (q = []));
    q.push(m);
  }

  /** Envoie les messages en attente (un paquet JSON par message). */
  flush(): void {
    for (const [c, q] of this.outbox) {
      for (const m of q) {
        try {
          c.conn.send(JSON.stringify(m));
        } catch {
          /* connexion fermée */
        }
      }
      q.length = 0;
    }
  }

  private broadcastMsg(text: string, color?: string): void {
    for (const c of this.clients) if (c.player) this.send(c, { t: 'ev', e: { t: 'msg', text, color } });
  }

  private sendPlayerList(): void {
    const list = this.clients.filter((c) => c.player).map((c) => ({ id: c.player!.id, name: c.name }));
    for (const c of this.clients) if (c.player) this.send(c, { t: 'players', list });
  }

  // ------------------------------------------------------------------ messages
  handle(c: Client, raw: string): void {
    let m: ClientMsg;
    try {
      m = JSON.parse(raw);
    } catch {
      return;
    }
    if (!m || typeof m !== 'object' || typeof (m as { t?: unknown }).t !== 'string') return;
    if (m.t === 'hello') return this.onHello(c, m);
    const p = c.player;
    if (!p) return;
    const sim = this.sim;
    try {
      switch (m.t) {
        case 'move': {
          if (p.dead) return;
          const d = Math.hypot(m.x - p.x, m.y - p.y, m.z - p.z);
          if (!Number.isFinite(d)) return;
          if (d > 30 && !p.creative) {
            this.send(c, { t: 'pos', dim: p.dim, x: p.x, y: p.y, z: p.z });
            return;
          }
          p.savePrev();
          p.setPos(m.x, m.y, m.z);
          p.yaw = m.yw;
          p.pitch = m.pt;
          p.sneaking = !!m.sn;
          p.sprinting = !!m.sp;
          p.flying = !!m.fl && p.creative;
          p.body.onGround = !!m.og;
          if (typeof m.sl === 'number') p.inventory.selected = Math.max(0, Math.min(8, m.sl | 0));
          break;
        }
        case 'fall':
          if (m.dist > 0 && m.dist < 400) applyFall(sim, p, m.dist);
          break;
        case 'dig':
          if (this.inReach(p, m.x + 0.5, m.y + 0.5, m.z + 0.5)) digBlock(sim, p, m.x, m.y, m.z);
          else this.resendBlock(c, m.x, m.y, m.z);
          break;
        case 'place':
          p.inventory.selected = Math.max(0, Math.min(8, m.slot | 0));
          if (this.inReach(p, m.hit.x + 0.5, m.hit.y + 0.5, m.hit.z + 0.5)) placeBlock(sim, p, m.hit);
          break;
        case 'interact':
          if (this.inReach(p, m.hit.x + 0.5, m.hit.y + 0.5, m.hit.z + 0.5)) interactBlock(sim, p, m.hit);
          break;
        case 'use':
          if (m.phase === 'start') {
            const w = sim.world(p.dim);
            const d = lookDir(p.yaw, p.pitch);
            const liquid = raycastBlocks(w, p.x, p.y + p.eye, p.z, d.x, d.y, d.z, REACH, { liquids: true });
            const r = useItem(sim, p, m.hit, liquid);
            if (r === 'hold') {
              const it = p.inventory.held ? sim.content.items.get(p.inventory.held.id) : undefined;
              p.using = { kind: it?.food ? 'eat' : it?.ranged ? 'bow' : it?.shield ? 'block' : 'recall', time: 0, total: useDuration(sim, p), slot: p.inventory.selected };
              p.blocking = p.using.kind === 'block';
            }
          } else {
            finishUse(sim, p, Math.max(0, Math.min(3600, m.held)));
            p.using = null;
            p.blocking = false;
          }
          break;
        case 'attack': {
          const e = sim.entities.get(m.id) as LivingEntity | undefined;
          if (e && e !== (p as unknown as LivingEntity) && e.dim === p.dim && !e.removed && (e.kind === 'mob' || e.kind === 'player') && this.inReach(p, e.x, e.y + e.body.h / 2, e.z, 2)) {
            p.attackCooldown = 0;
            attackEntity(sim, p, e);
          }
          break;
        }
        case 'drop':
          dropHeld(sim, p, !!m.all);
          break;
        case 'dropStack':
          if (m.stack && sim.content.items.has(m.stack.id) && m.stack.count > 0) throwStack(sim, p, { id: m.stack.id, count: Math.min(m.stack.count, 999) });
          break;
        case 'dodge':
          dodge(sim, p, m.fx, m.fz);
          break;
        case 'inv':
          p.inventory.loadAll(m.data);
          c.lastInv = JSON.stringify(p.inventory.serializeAll());
          break;
        case 'be':
          this.onBlockEntity(p, m.x, m.y, m.z, m.data);
          break;
        case 'chat':
          this.onChat(c, p, String(m.text ?? '').slice(0, 256));
          break;
        case 'respawn':
          this.respawn(c, p);
          break;
      }
    } catch (e) {
      this.log(`[serveur] erreur sur le message ${m.t} de ${c.name} : ${(e as Error).message}`);
    }
  }

  private inReach(p: Player, x: number, y: number, z: number, extra = 1): boolean {
    const r = (p.creative ? CREATIVE_REACH : REACH) + extra + 1;
    return Math.hypot(x - p.x, y - (p.y + p.eye), z - p.z) <= r;
  }

  private resendBlock(c: Client, x: number, y: number, z: number): void {
    const p = c.player!;
    const cell = this.sim.world(p.dim).getBlock(x, y, z);
    this.send(c, this.blockMsg(p.dim, x, y, z, cell));
  }

  private blockMsg(dim: string, x: number, y: number, z: number, cell: number): ServerMsg {
    // le nom (et non le numéro) rend le protocole indépendant de l'ordre des blocs
    return { t: 'block', dim, x, y, z, n: this.content.blocks.get(cell & 0xfff).id, m: cell >>> 12 };
  }

  private onHello(c: Client, m: Extract<ClientMsg, { t: 'hello' }>): void {
    if (c.player) return;
    const name = String(m.name ?? '').replace(/[^\p{L}\p{N}_\- ]/gu, '').trim().slice(0, 16) || 'Joueur';
    if (m.version !== PROTOCOL_VERSION) {
      c.conn.send(JSON.stringify({ t: 'kick', reason: `Version incompatible (serveur ${PROTOCOL_VERSION}, client ${m.version})` }));
      c.conn.close();
      return;
    }
    if (this.clients.some((o) => o !== c && o.name.toLowerCase() === name.toLowerCase())) {
      c.conn.send(JSON.stringify({ t: 'kick', reason: `Le nom « ${name} » est déjà utilisé sur ce serveur.` }));
      c.conn.close();
      return;
    }
    if (this.clients.filter((o) => o.player).length >= this.maxPlayers) {
      c.conn.send(JSON.stringify({ t: 'kick', reason: 'Serveur complet.' }));
      c.conn.close();
      return;
    }
    c.name = name;
    const p = new Player(this.content.items, name);
    const saved = this.storage.loadPlayer(this.meta.id, name);
    if (saved) p.load(saved);
    else {
      const sp = this.meta.spawn!;
      p.dim = 'surface';
      p.setPos(sp.x, sp.y, sp.z);
      p.gameMode = this.meta.gameMode === 'hardcore' ? 'survie' : this.meta.gameMode;
    }
    p.name = name;
    p.displayName = name;
    c.player = p;
    // colonnes autour du point d'arrivée, puis sol sûr
    this.loadAround(p.dim, p.x, p.z, 2);
    if (!saved) {
      const w = this.sim.world(p.dim);
      const gy = w.findGround(Math.floor(p.x), Math.floor(p.z));
      if (gy > 0) p.setPos(p.x, gy + 1, p.z);
    }
    this.sim.addPlayer(p);
    c.lastInv = JSON.stringify(p.inventory.serializeAll());
    const meta = this.meta;
    this.send(c, {
      t: 'welcome',
      id: p.id,
      world: { name: meta.name, seed: meta.seed, seedText: meta.seedText, worldType: meta.worldType, difficulty: this.sim.difficulty, gameMode: meta.gameMode, time: this.sim.env.time, rules: { ...this.sim.rules } as unknown as Record<string, boolean>, structures: meta.structures !== false },
      player: p.serialize(),
      radius: this.radius,
      motd: this.motd,
    });
    this.sendEnv(c);
    this.broadcastMsg(`${name} a rejoint la partie.`, '#ffe080');
    this.log(`[serveur] ${name} connecté (${this.clients.filter((o) => o.player).length} joueur(s))`);
    this.sendPlayerList();
  }

  private onBlockEntity(p: Player, x: number, y: number, z: number, data: Record<string, unknown> | null): void {
    if (!this.inReach(p, x + 0.5, y + 0.5, z + 0.5, 3) || !data) return;
    const w = this.sim.world(p.dim);
    const cur = w.getBlockEntity(x, y, z);
    if (!cur || cur.type !== data.type || !Array.isArray(data.slots)) return;
    // seuls les emplacements viennent du client ; la cuisson reste au serveur
    const slots = (data.slots as unknown[]).map((s) => {
      const st = s as { id?: string; count?: number } | null;
      return st && typeof st.id === 'string' && this.content.items.has(st.id) && typeof st.count === 'number' && st.count > 0 ? { ...st, id: st.id, count: Math.min(st.count, 999) } : null;
    });
    const curSlots = cur.slots as unknown[];
    for (let i = 0; i < curSlots.length; i++) curSlots[i] = slots[i] ?? null;
    delete cur.loot;
    const ch = w.chunkAtBlock(x, z);
    if (ch) ch.dirty = ch.modified = true;
    this.broadcastBlockEntity(p.dim, x, y, z, p);
  }

  private broadcastBlockEntity(dim: string, x: number, y: number, z: number, except?: Player): void {
    const data = this.sim.world(dim).getBlockEntity(x, y, z) ?? null;
    const k = ckey(x >> 4, z >> 4);
    for (const o of this.clients) if (o.player && o.player !== except && o.player.dim === dim && o.sent.has(k)) this.send(o, { t: 'be', dim, x, y, z, data });
  }

  private onChat(c: Client, p: Player, text: string): void {
    if (!text.trim()) return;
    if (text.startsWith('/')) {
      if (!this.meta.allowCommands && !c.player?.creative) {
        this.send(c, { t: 'ev', e: { t: 'msg', text: 'Les commandes sont désactivées sur ce serveur.', color: '#ff8080', to: p.id } });
        return;
      }
      this.log(`[serveur] ${c.name} : ${text}`);
      const before = { dim: p.dim, x: p.x, y: p.y, z: p.z };
      const r = runCommand(
        {
          sim: this.sim,
          locate: (type, dim, x, z) => this.gen(dim).locateStructure?.(type, x, z) ?? null,
          summon: (type, dim, x, y, z) => this.sim.summon?.(type, dim, x, y, z) ?? false,
        },
        p,
        text,
      );
      for (const l of r.out) if (l) this.send(c, { t: 'ev', e: { t: 'msg', text: l, color: r.ok ? '#e0e0e0' : '#ff8080', to: p.id } });
      // téléportation par commande
      if (p.dim === before.dim && Math.hypot(p.x - before.x, p.y - before.y, p.z - before.z) > 0.01) {
        this.loadAround(p.dim, p.x, p.z, 2);
        this.send(c, { t: 'pos', dim: p.dim, x: p.x, y: p.y, z: p.z });
      }
    } else {
      this.log(`<${c.name}> ${text}`);
      this.broadcastMsg(`<${c.name}> ${text}`);
    }
  }

  private respawn(c: Client, p: Player): void {
    if (!p.dead) return;
    c.deathHandled = false;
    const hardcore = this.meta.gameMode === 'hardcore';
    if (hardcore) {
      p.gameMode = 'spectateur';
      p.respawn(p.x, p.y + 1, p.z);
    } else {
      const sp = p.spawn ?? { dim: 'surface', ...this.meta.spawn! };
      p.respawn(sp.x, sp.y, sp.z);
      if (sp.dim !== p.dim) this.changeDimension(c, p, sp.dim, sp.x, sp.y, sp.z, 'exact');
      else {
        this.loadAround(p.dim, p.x, p.z, 1);
        const w = this.sim.world(p.dim);
        const t = w.content.blocks;
        let guard = 0;
        while (guard++ < 100 && (t.solid[w.getId(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z))] || t.solid[w.getId(Math.floor(p.x), Math.floor(p.y + 1), Math.floor(p.z))])) p.setPos(p.x, p.y + 1, p.z);
      }
    }
    this.send(c, { t: 'pos', dim: p.dim, x: p.x, y: p.y, z: p.z });
    this.send(c, { t: 'inv', data: p.inventory.serializeAll() });
  }

  private changeDimension(c: Client, p: Player, dim: string, x: number, y: number, z: number, mode: 'portal' | 'altar' | 'exact'): void {
    this.loadAround(dim, x, z, 2);
    const pos = this.sim.completeTravel(p, dim, x, y, z, mode);
    this.loadAround(dim, pos.x, pos.z, 1);
    this.send(c, { t: 'pos', dim, x: pos.x, y: pos.y, z: pos.z, mode: 'dim' });
  }

  // ------------------------------------------------------------------ évènements
  private onEvent(e: SimEvent): void {
    if (e.t === 'dimension') {
      const c = this.clients.find((o) => o.player?.id === e.to);
      if (c?.player) this.changeDimension(c, c.player, e.dim, e.x, e.y, e.z, e.mode);
      return;
    }
    const to = eventTarget(e);
    const pos = e as { x?: number; y?: number; z?: number };
    for (const c of this.clients) {
      const p = c.player;
      if (!p) continue;
      if (to !== undefined && p.id !== to) continue;
      if (to === undefined && typeof pos.x === 'number' && typeof pos.z === 'number') {
        if (Math.hypot(pos.x - p.x, pos.z - p.z) > 96) continue;
      }
      if (e.t === 'hurt' || e.t === 'swing') {
        const ent = this.sim.entities.get(e.id);
        if (ent && (ent.dim !== p.dim || Math.hypot(ent.x - p.x, ent.z - p.z) > VIEW_ENTS)) continue;
      }
      this.send(c, { t: 'ev', e });
    }
  }

  // ------------------------------------------------------------------ colonnes
  private chunkKeyStr(dim: string, cx: number, cz: number): string {
    return `${dim}|${cx}|${cz}`;
  }

  /** Charge (sauvegarde) ou génère une colonne, de façon synchrone. */
  ensureChunk(dim: string, cx: number, cz: number): Chunk {
    const w = this.sim.world(dim);
    const have = w.getChunk(cx, cz);
    if (have) return have;
    const key = this.chunkKeyStr(dim, cx, cz);
    const pending = this.pendingSaves.get(key);
    const rec = pending?.rec ?? this.storage.loadChunkSync(this.meta.id, dim, cx, cz);
    let c: Chunk;
    let saved: unknown[] = [];
    let genEnts: { type: string; x: number; y: number; z: number; data?: Record<string, unknown> }[] = [];
    if (rec) {
      const dec = decodeChunk(rec, this.content.blocks);
      c = new Chunk(cx, cz);
      c.loadSections(dec.sections);
      c.biomes.set(dec.biomes);
      c.tints.set(dec.tints);
      for (const [i, d] of dec.blockEntities) c.blockEntities.set(i, d);
      c.recordHasEntities = dec.entities.length > 0;
      c.modified = true;
      c.dirty = !!pending;
      this.pendingSaves.delete(key);
      saved = dec.entities;
    } else {
      const buf = this.gen(dim).generate(cx, cz);
      c = new Chunk(cx, cz);
      c.loadSections(buf.sections);
      c.biomes.set(buf.biomes);
      c.tints.set(buf.tints);
      for (const be of buf.blockEntities) c.blockEntities.set(be.i, be.data);
      genEnts = buf.entities;
    }
    w.addChunk(c);
    this.sim.restoreEntities(dim, saved);
    for (const ge of genEnts) this.sim.spawnFromGen?.(dim, ge);
    return c;
  }

  loadAround(dim: string, x: number, z: number, r: number): void {
    const cx = Math.floor(x / CS),
      cz = Math.floor(z / CS);
    for (let dz = -r; dz <= r; dz++) for (let dx = -r; dx <= r; dx++) this.ensureChunk(dim, cx + dx, cz + dz);
  }

  private unloadChunk(dim: string, c: Chunk): void {
    const ents = this.sim.persistentEntitiesIn(dim, c.cx, c.cz);
    if (c.dirty || ents.length > 0 || c.recordHasEntities) this.pendingSaves.set(this.chunkKeyStr(dim, c.cx, c.cz), { dim, rec: encodeChunk(c, this.content.blocks, ents) });
    this.sim.unloadEntitiesIn(dim, c.cx, c.cz);
    this.sim.world(dim).removeChunk(c.cx, c.cz);
  }

  /** Chargement progressif, envoi aux clients et déchargement. */
  private streamChunks(): void {
    let budget = 10;
    const R = this.radius;
    for (const c of this.clients) {
      const p = c.player;
      if (!p) continue;
      if (c.sentDim !== p.dim) {
        c.sent.clear();
        c.known.clear();
        c.sentDim = p.dim;
      }
      const pcx = Math.floor(p.x / CS),
        pcz = Math.floor(p.z / CS);
      // oubli des colonnes que le client a déchargées (même règle que le client)
      for (const k of [...c.sent]) {
        const dx = ckeyX(k) - pcx,
          dz = ckeyZ(k) - pcz;
        if (dx * dx + dz * dz > (R + 2) * (R + 2)) c.sent.delete(k);
      }
      const want: [number, number, number][] = [];
      for (let dz = -R; dz <= R; dz++)
        for (let dx = -R; dx <= R; dx++) {
          const d = dx * dx + dz * dz;
          if (d <= R * R + R) want.push([pcx + dx, pcz + dz, d]);
        }
      want.sort((a, b) => a[2] - b[2]);
      let sends = 12;
      for (const [cx, cz] of want) {
        const k = ckey(cx, cz);
        if (c.sent.has(k)) continue;
        const w = this.sim.world(p.dim);
        if (!w.getChunk(cx, cz)) {
          if (budget <= 0) continue;
          budget--;
        }
        const ch = this.ensureChunk(p.dim, cx, cz);
        this.send(c, { t: 'chunk', dim: p.dim, rec: chunkToWire(encodeChunk(ch, this.content.blocks)) });
        c.sent.add(k);
        if (--sends <= 0) break;
      }
    }
    // Déchargement : colonnes loin de tous les joueurs de la dimension
    for (const [dim, w] of this.sim.worldsByDim) {
      const ps = this.clients.map((c) => c.player).filter((p): p is Player => !!p && p.dim === dim);
      for (const ch of [...w.chunks.values()]) {
        const near = ps.some((p) => {
          const dx = ch.cx - Math.floor(p.x / CS),
            dz = ch.cz - Math.floor(p.z / CS);
          return dx * dx + dz * dz <= (R + 3) * (R + 3);
        });
        if (!near) this.unloadChunk(dim, ch);
      }
    }
  }

  // ------------------------------------------------------------------ instantanés
  private snap(e: Entity): EntSnap {
    const le = e as unknown as { health?: number; maxHealth?: number; hurtTime?: number; dead?: boolean; deathTime?: number; swing?: number; bodyYaw?: number; heldItem?: string | null; sneaking?: boolean; flying?: boolean; type?: string; stack?: { id: string; count: number }; inventory?: { held: { id: string } | null } };
    const s: EntSnap = { id: e.id, k: e.kind, x: round(e.x), y: round(e.y), z: round(e.z), yw: round(e.yaw), pt: round(e.pitch), w: e.body.hw, ht: e.body.h };
    if (le.type) s.ty = le.type;
    if (e.displayName) s.n = e.displayName;
    if (typeof le.health === 'number') {
      s.hp = round(le.health, 10);
      s.mx = le.maxHealth;
      if (le.hurtTime) s.h = round(le.hurtTime);
      if (le.dead) s.d = round(le.deathTime ?? 0);
      if (le.swing) s.sw = round(le.swing);
    }
    if (typeof le.bodyYaw === 'number') s.by = round(le.bodyYaw);
    if (e.kind === 'mob') s.hi = le.heldItem ?? null;
    if (e.kind === 'player') {
      s.hi = le.inventory?.held?.id ?? null;
      s.sn = !!le.sneaking;
      s.fl = !!le.flying;
    }
    if (le.stack) s.st = le.stack;
    return s;
  }

  private selfSnap(p: Player): SelfSnap {
    return {
      hp: round(p.health, 10),
      mx: p.maxHealth,
      en: round(p.energy, 10),
      sa: round(p.saturation, 10),
      air: round(p.air, 10),
      tmp: round(p.bodyTemp),
      fx: [...p.effects.entries()].map(([id, e]) => [id, e.level, round(e.time, 10)]),
      dead: p.dead,
      gm: p.gameMode,
      dm: p.dead ? p.deathMessage : undefined,
    };
  }

  private sendSnapshots(): void {
    for (const c of this.clients) {
      const p = c.player;
      if (!p) continue;
      const list: EntSnap[] = [];
      const seen = new Set<number>();
      for (const e of this.sim.entities.list) {
        if (e.removed || e === p || e.dim !== p.dim) continue;
        if (Math.abs(e.x - p.x) > VIEW_ENTS || Math.abs(e.z - p.z) > VIEW_ENTS) continue;
        seen.add(e.id);
        list.push(this.snap(e));
      }
      const gone: number[] = [];
      for (const id of c.known) if (!seen.has(id)) gone.push(id);
      c.known = seen;
      this.send(c, { t: 'ents', dim: p.dim, list, gone, me: this.selfSnap(p) });
      // inventaire modifié côté serveur (ramassage, consommation, commandes…)
      const inv = JSON.stringify(p.inventory.serializeAll());
      if (inv !== c.lastInv) {
        c.lastInv = inv;
        this.send(c, { t: 'inv', data: JSON.parse(inv) });
      }
      // mort : tombe
      if (p.dead && !c.deathHandled) {
        c.deathHandled = true;
        p.lastDeath = { dim: p.dim, x: p.x, y: p.y, z: p.z };
        if (!this.sim.rules.keepInventory && !p.creative) {
          const items = p.inventory.dropAll();
          if (items.length) {
            const g = new Grave(p.name, items);
            g.dim = p.dim;
            g.setPos(p.x, Math.max(1, p.y), p.z);
            this.sim.entities.add(g);
            this.send(c, { t: 'ev', e: { t: 'msg', text: `Vos objets reposent dans une tombe en ${Math.floor(p.x)} ${Math.floor(p.y)} ${Math.floor(p.z)}.`, color: '#ffb0b0', to: p.id } });
          }
        }
        this.broadcastMsg(p.deathMessage, '#ff8080');
      }
    }
  }

  private sendEnv(c: Client): void {
    const env = this.sim.env;
    this.send(c, { t: 'env', time: env.time, weather: env.weather, wt: env.weatherTimer, flash: env.flash });
  }

  // ------------------------------------------------------------------ boucle
  /** Un tick serveur (20 par seconde). */
  tick(): void {
    this.streamChunks();
    this.sim.tick();
    // blocs modifiés → clients qui ont la colonne
    this.sendSnapshots();
    if (this.sim.tickCount % 20 === 0) {
      for (const c of this.clients) if (c.player) this.sendEnv(c);
      for (const f of this.sim.furnaces.active) this.broadcastBlockEntity(f.dim, f.x, f.y, f.z);
    }
    this.saveTimer += TICK;
    if (this.saveTimer >= 60) {
      this.saveTimer = 0;
      this.save();
    }
    this.flush();
  }

  /** Installe la réplication des changements de blocs (à appeler une fois). */
  hookWorlds(): void {
    const hooked = new Set<string>();
    const hook = (dim: string) => {
      if (hooked.has(dim)) return;
      hooked.add(dim);
      const w = this.sim.world(dim);
      w.changeHooks.push((x, y, z, cell) => {
        const k = ckey(x >> 4, z >> 4);
        for (const c of this.clients) if (c.player && c.player.dim === dim && c.sent.has(k)) this.send(c, this.blockMsg(dim, x, y, z, cell));
      });
    };
    for (const d of ['surface', 'abime', 'astral']) hook(d);
  }

  /** Sauvegarde du monde (métadonnées, colonnes modifiées, joueurs). */
  save(): void {
    const meta = this.meta;
    const sim = this.sim;
    meta.time = sim.env.time;
    meta.weather = sim.env.serialize();
    meta.rules = { ...sim.rules };
    meta.lastPlayed = Date.now();
    const recs = [...this.pendingSaves.values()];
    for (const [dim, w] of sim.worldsByDim)
      for (const c of w.chunks.values()) {
        const ents = sim.persistentEntitiesIn(dim, c.cx, c.cz);
        if (c.dirty || ents.length > 0 || c.recordHasEntities) {
          recs.push({ dim, rec: encodeChunk(c, this.content.blocks, ents) });
          c.dirty = false;
          c.modified = true;
          c.recordHasEntities = ents.length > 0;
        }
      }
    try {
      this.storage.saveBatchSync(meta, recs);
      this.pendingSaves.clear();
      for (const c of this.clients) if (c.player) this.storage.savePlayer(meta.id, c.name, c.player.serialize());
      this.log(`[serveur] monde sauvegardé (${recs.length} colonne(s))`);
    } catch (e) {
      this.log(`[serveur] échec de la sauvegarde : ${(e as Error).message}`);
    }
  }

  stop(): void {
    for (const c of [...this.clients]) {
      try {
        c.conn.send(JSON.stringify({ t: 'kick', reason: 'Arrêt du serveur.' }));
        c.conn.close();
      } catch {
        /* déjà fermé */
      }
      this.disconnect(c);
    }
    this.save();
  }
}

/** Métadonnées d'un nouveau monde serveur. */
export function newServerMeta(id: string, name: string, seed: number, seedText: string, gameMode: WorldMeta['gameMode'] = 'survie', difficulty = 2): WorldMeta {
  return {
    id,
    name,
    seed,
    seedText,
    version: 1,
    created: Date.now(),
    lastPlayed: Date.now(),
    gameMode,
    difficulty,
    allowCommands: false,
    worldType: 'normal',
    structures: true,
    bonusChest: false,
    rules: { ...DEFAULT_RULES },
    time: 1000,
    weather: { state: 'clair', timer: 9000 },
    spawn: null,
    player: null,
    dimension: 'surface',
    portals: [],
    advancements: [],
    stats: {},
    bosses: [],
    playTime: 0,
  };
}

