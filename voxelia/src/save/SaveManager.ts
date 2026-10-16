/**
 * SaveManager — mondes, tronçons modifiés, joueur, créatures persistantes.
 * Écritures groupées et atomiques (IndexedDB), copie de secours des métadonnées,
 * export / import de mondes en fichier.
 */
import { Database, deflate, fromBase64, inflate, rleDecode, rleEncode, toBase64 } from './db';
import { COLUMN_VOLUME } from '../world/constants';
import type { SavedChunk } from '../world/ChunkManager';
import type { BlockEntity } from '../world/Chunk';
import type { WorldTemplate } from '../world/gen/terrain';
import { deserializeStack, serializeStack } from '../items/items';

/** Les piles d'objets des blocs (coffres, fours) sont stockées par clé d'objet, pas par numéro. */
function encodeBlockEntity(e: BlockEntity): BlockEntity {
  if (!Array.isArray(e.items)) return e;
  return { ...e, items: (e.items as unknown[]).map((s) => serializeStack((s as never) ?? null)), keyed: 1 };
}

function decodeBlockEntity(e: BlockEntity): BlockEntity {
  if (!Array.isArray(e.items) || !e.keyed) return e;
  const { keyed: _k, ...rest } = e;
  void _k;
  return { ...rest, type: e.type, items: (e.items as unknown[]).map((s) => deserializeStack(s)) };
}

export type GameMode = 'survival' | 'creative' | 'adventure' | 'spectator';
export type Difficulty = 'peaceful' | 'easy' | 'normal' | 'hard';

export interface GameRules {
  daylightCycle: boolean;
  keepInventory: boolean;
  mobSpawning: boolean;
  mobGriefing: boolean;
  weatherCycle: boolean;
  fallDamage: boolean;
  fireDamage: boolean;
  drowningDamage: boolean;
  naturalRegeneration: boolean;
  fireSpread: boolean;
  tntExplodes: boolean;
  immediateRespawn: boolean;
  showDeathMessages: boolean;
  randomTickSpeed: number;
  pvp: boolean;
}

export interface Experiments {
  fantasyBiomes: boolean;
  dimensions: boolean;
  drop3: boolean;
  tradeRebalance: boolean;
  bosses: boolean;
}

export interface WorldMeta {
  id: string;
  name: string;
  seed: number;
  seedText: string;
  gameMode: GameMode;
  difficulty: Difficulty;
  template: WorldTemplate;
  startingMap: boolean;
  bonusChest: boolean;
  showCoordinates: boolean;
  caves: boolean;
  structures: boolean;
  cheats: boolean;
  rules: GameRules;
  experiments: Experiments;
  multiplayer: { enabled: boolean; access: 'invite' | 'friends' | 'friends_of_friends'; defaultPermission: 'visitor' | 'member' | 'operator' };
  packs: string[];
  sharedPacks: boolean;
  created: number;
  lastPlayed: number;
  time: number;
  day: number;
  weather: { state: 'clear' | 'rain' | 'thunder'; timer: number };
  spawn: [number, number, number] | null;
  dimension: number;
  thumbnail?: string;
  sizeBytes: number;
  playTime: number;
  version: number;
  spawnedMarkers: string[];
  bossesDefeated: string[];
}

export interface PlayerSave {
  pos: [number, number, number];
  yaw: number;
  pitch: number;
  dim: number;
  health: number;
  hunger: number;
  saturation: number;
  exhaustion: number;
  xp: number;
  level: number;
  air: number;
  gameMode: GameMode;
  inventory: unknown[];
  armor: unknown[];
  offhand: unknown;
  selected: number;
  spawnPoint: [number, number, number] | null;
  effects: Array<{ id: string; time: number; level: number }>;
  recipes: string[];
  stats: Record<string, number>;
  flying: boolean;
  riding?: unknown;
}

export interface EntitySave {
  type: string;
  pos: [number, number, number];
  yaw: number;
  health: number;
  data?: Record<string, unknown>;
}

export function defaultRules(): GameRules {
  return {
    daylightCycle: true,
    keepInventory: false,
    mobSpawning: true,
    mobGriefing: true,
    weatherCycle: true,
    fallDamage: true,
    fireDamage: true,
    drowningDamage: true,
    naturalRegeneration: true,
    fireSpread: true,
    tntExplodes: true,
    immediateRespawn: false,
    showDeathMessages: true,
    randomTickSpeed: 1,
    pvp: true,
  };
}

export function newWorldMeta(partial: Partial<WorldMeta> & { name: string; seed: number; seedText: string }): WorldMeta {
  const now = Date.now();
  return {
    id: 'w' + now.toString(36) + Math.floor(Math.random() * 1e6).toString(36),
    gameMode: 'survival',
    difficulty: 'normal',
    template: 'default',
    startingMap: false,
    bonusChest: false,
    showCoordinates: false,
    caves: true,
    structures: true,
    cheats: false,
    rules: defaultRules(),
    experiments: { fantasyBiomes: true, dimensions: true, drop3: false, tradeRebalance: false, bosses: true },
    multiplayer: { enabled: true, access: 'friends', defaultPermission: 'member' },
    packs: [],
    sharedPacks: false,
    created: now,
    lastPlayed: now,
    time: 1000,
    day: 0,
    weather: { state: 'clear', timer: 12000 },
    spawn: null,
    dimension: 0,
    sizeBytes: 0,
    playTime: 0,
    version: 1,
    spawnedMarkers: [],
    bossesDefeated: [],
    ...partial,
  };
}

interface ChunkRecord {
  r: Uint8Array;
  z: boolean;
  b: Uint8Array;
  be?: Array<[number, BlockEntity]>;
  v: number;
}

export class SaveManager {
  readonly db = new Database();
  private savedChunks = new Set<string>();
  private currentWorld = '';

  async init(): Promise<void> {
    await this.db.open();
  }

  get persistent(): boolean {
    return this.db.persistent;
  }

  async listWorlds(): Promise<WorldMeta[]> {
    const all = await this.db.getAll<WorldMeta>('worlds');
    return all.map(([, m]) => m).filter((m) => m && m.id).sort((a, b) => b.lastPlayed - a.lastPlayed);
  }

  async getWorld(id: string): Promise<WorldMeta | undefined> {
    let m = await this.db.get<WorldMeta>('worlds', id);
    if (!m || typeof m !== 'object' || !m.id) {
      // Récupération depuis la copie de secours.
      m = await this.db.get<WorldMeta>('backups', id);
      if (m) console.warn('Métadonnées restaurées depuis la sauvegarde de secours', id);
    }
    return m;
  }

  async createWorld(meta: WorldMeta): Promise<void> {
    await this.db.batch([
      { store: 'worlds', key: meta.id, value: meta },
      { store: 'backups', key: meta.id, value: meta },
    ]);
  }

  async updateMeta(meta: WorldMeta): Promise<void> {
    await this.db.batch([{ store: 'worlds', key: meta.id, value: meta }]);
  }

  /** Prépare l'accès aux tronçons d'un monde (index des tronçons sauvegardés). */
  async openWorld(id: string): Promise<void> {
    this.currentWorld = id;
    const keys = await this.db.keys('chunks', id + '|');
    this.savedChunks = new Set(keys);
  }

  chunkKey(world: string, dim: number, cx: number, cz: number): string {
    return `${world}|${dim}|${cx},${cz}`;
  }

  async loadChunk(dim: number, cx: number, cz: number): Promise<SavedChunk | null> {
    const key = this.chunkKey(this.currentWorld, dim, cx, cz);
    if (!this.savedChunks.has(key)) return null;
    try {
      const rec = await this.db.get<ChunkRecord>('chunks', key);
      if (!rec) return null;
      const bytes = await inflate(rec.r, rec.z);
      const rle = new Uint16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength >> 1);
      const blocks = rleDecode(rle.slice(), COLUMN_VOLUME);
      return { blocks, biomes: rec.b, blockEntities: rec.be?.map(([k, e]) => [k, decodeBlockEntity(e)] as [number, BlockEntity]) };
    } catch (e) {
      // Tronçon corrompu : on le régénère plutôt que de planter.
      console.error('Tronçon corrompu, régénération', key, e);
      this.savedChunks.delete(key);
      return null;
    }
  }

  async encodeChunk(blocks: Uint16Array, biomes: Uint8Array, be: Map<number, BlockEntity>): Promise<ChunkRecord> {
    const rle = rleEncode(blocks);
    const { z, data } = await deflate(new Uint8Array(rle.buffer));
    return { r: data, z, b: biomes.slice(), be: be.size ? [...be.entries()].map(([k, e]) => [k, encodeBlockEntity(e)] as [number, BlockEntity]) : undefined, v: 1 };
  }

  /** Sauvegarde atomique : métadonnées, joueur, tronçons et entités en une transaction. */
  async saveAll(meta: WorldMeta, player: PlayerSave | null, chunks: Array<{ dim: number; cx: number; cz: number; blocks: Uint16Array; biomes: Uint8Array; be: Map<number, BlockEntity> }>, entities: Map<string, EntitySave[]>, playerKey = 'local'): Promise<void> {
    const ops: Parameters<Database['batch']>[0] = [];
    let added = 0;
    for (const c of chunks) {
      const rec = await this.encodeChunk(c.blocks, c.biomes, c.be);
      const key = this.chunkKey(meta.id, c.dim, c.cx, c.cz);
      if (!this.savedChunks.has(key)) added += rec.r.byteLength + 300;
      this.savedChunks.add(key);
      ops.push({ store: 'chunks', key, value: rec });
    }
    for (const [k, list] of entities) {
      const key = meta.id + '|' + k;
      if (list.length) ops.push({ store: 'entities', key, value: list });
      else ops.push({ store: 'entities', key, delete: true });
    }
    meta.sizeBytes += added;
    meta.lastPlayed = Date.now();
    ops.push({ store: 'worlds', key: meta.id, value: meta });
    ops.push({ store: 'backups', key: meta.id, value: meta });
    if (player) ops.push({ store: 'players', key: meta.id + '|' + playerKey, value: player });
    await this.db.batch(ops);
  }

  async savePlayer(worldId: string, save: PlayerSave, playerKey = 'local'): Promise<void> {
    await this.db.batch([{ store: 'players', key: worldId + '|' + playerKey, value: save }]);
  }

  async loadPlayer(worldId: string, playerKey = 'local'): Promise<PlayerSave | undefined> {
    return this.db.get<PlayerSave>('players', worldId + '|' + playerKey);
  }

  async loadEntities(worldId: string, dim: number, cx: number, cz: number): Promise<EntitySave[]> {
    return (await this.db.get<EntitySave[]>('entities', `${worldId}|${dim}|${cx},${cz}`)) ?? [];
  }

  async deleteWorld(id: string): Promise<void> {
    await this.db.deletePrefix('chunks', id + '|');
    await this.db.deletePrefix('entities', id + '|');
    await this.db.deletePrefix('players', id + '|');
    await this.db.batch([
      { store: 'worlds', key: id, delete: true },
      { store: 'backups', key: id, delete: true },
    ]);
  }

  async copyWorld(id: string): Promise<WorldMeta | null> {
    const blob = await this.exportWorld(id);
    if (!blob) return null;
    return this.importWorld(blob, ' (copie)');
  }

  /** Exporte un monde complet dans un fichier compressé (.voxelia). */
  async exportWorld(id: string): Promise<Blob | null> {
    const meta = await this.getWorld(id);
    if (!meta) return null;
    const chunks = await this.db.getAll<ChunkRecord>('chunks', id + '|');
    const players = await this.db.getAll<PlayerSave>('players', id + '|');
    const entities = await this.db.getAll<EntitySave[]>('entities', id + '|');
    const json = JSON.stringify({
      format: 'voxelia-world',
      version: 1,
      meta,
      players: players.map(([k, v]) => [k.slice(id.length + 1), v]),
      entities: entities.map(([k, v]) => [k.slice(id.length + 1), v]),
      chunks: chunks.map(([k, c]) => [k.slice(id.length + 1), { r: toBase64(c.r), z: c.z, b: toBase64(c.b), be: c.be }]),
    });
    const bytes = new TextEncoder().encode(json);
    const { z, data } = await deflate(bytes);
    return new Blob([new Uint8Array([z ? 1 : 0]), data], { type: 'application/octet-stream' });
  }

  async importWorld(file: Blob, suffix = ''): Promise<WorldMeta> {
    const buf = new Uint8Array(await file.arrayBuffer());
    const json = new TextDecoder().decode(await inflate(buf.subarray(1), buf[0] === 1));
    const doc = JSON.parse(json);
    if (doc.format !== 'voxelia-world') throw new Error("Ce fichier n'est pas un monde Voxelia");
    const meta: WorldMeta = { ...newWorldMeta({ name: '', seed: 0, seedText: '' }), ...doc.meta };
    const oldId = meta.id;
    meta.id = 'w' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
    meta.name = (meta.name || 'Monde importé') + suffix;
    meta.lastPlayed = Date.now();
    const ops: Parameters<Database['batch']>[0] = [];
    let size = 0;
    for (const [k, c] of doc.chunks as Array<[string, { r: string; z: boolean; b: string; be?: Array<[number, BlockEntity]> }]>) {
      const r = fromBase64(c.r);
      size += r.byteLength + 300;
      ops.push({ store: 'chunks', key: meta.id + '|' + k, value: { r, z: c.z, b: fromBase64(c.b), be: c.be, v: 1 } });
    }
    for (const [k, p] of doc.players ?? []) ops.push({ store: 'players', key: meta.id + '|' + k, value: p });
    for (const [k, e] of doc.entities ?? []) ops.push({ store: 'entities', key: meta.id + '|' + k, value: e });
    meta.sizeBytes = size;
    ops.push({ store: 'worlds', key: meta.id, value: meta });
    ops.push({ store: 'backups', key: meta.id, value: meta });
    await this.db.batch(ops);
    void oldId;
    return meta;
  }

  // ---------------------------------------------------------------- packs de ressources
  async listPacks(): Promise<Array<{ id: string; name: string; description: string; icon?: string; count: number }>> {
    const all = await this.db.getAll<{ name: string; description: string; icon?: string; textures: Record<string, Uint8Array> }>('packs');
    return all.map(([id, p]) => ({ id, name: p.name, description: p.description, icon: p.icon, count: Object.keys(p.textures).length }));
  }

  async getPack(id: string): Promise<{ name: string; description: string; textures: Record<string, Uint8Array>; items?: Record<string, Uint8Array> } | undefined> {
    return this.db.get('packs', id);
  }

  async savePack(id: string, pack: { name: string; description: string; icon?: string; textures: Record<string, Uint8Array>; items?: Record<string, Uint8Array> }): Promise<void> {
    await this.db.put('packs', id, pack);
  }

  async deletePack(id: string): Promise<void> {
    await this.db.delete('packs', id);
  }
}
