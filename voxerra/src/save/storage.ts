/** Interface de stockage des mondes + implémentation mémoire (tests, panorama). */
import type { ChunkRecord } from './serializer';

export type GameMode = 'survie' | 'creatif' | 'hardcore' | 'spectateur';

export interface GameRules {
  keepInventory: boolean;
  daylightCycle: boolean;
  weatherCycle: boolean;
  mobSpawning: boolean;
  naturalRegen: boolean;
  fallDamage: boolean;
}

export const DEFAULT_RULES: GameRules = {
  keepInventory: false,
  daylightCycle: true,
  weatherCycle: true,
  mobSpawning: true,
  naturalRegen: true,
  fallDamage: true,
};

export interface WorldMeta {
  id: string;
  name: string;
  seed: number;
  seedText: string;
  version: number;
  created: number;
  lastPlayed: number;
  gameMode: GameMode;
  difficulty: number; // 0 paisible … 3 difficile
  allowCommands: boolean;
  worldType: 'normal' | 'plat';
  structures: boolean;
  bonusChest: boolean;
  rules: GameRules;
  time: number; // ticks absolus
  weather: { state: string; timer: number };
  spawn: { x: number; y: number; z: number } | null;
  player: unknown;
  dimension: string;
  thumbnail?: string;
  portals: { from: string; to: string; a: [number, number, number]; b: [number, number, number] }[];
  advancements: string[];
  stats: Record<string, number>;
  bosses: string[];
  playTime: number;
  extra?: Record<string, unknown>;
}

export interface WorldStorage {
  listWorlds(): Promise<WorldMeta[]>;
  loadMeta(id: string): Promise<WorldMeta | null>;
  loadChunk(worldId: string, dim: string, cx: number, cz: number): Promise<ChunkRecord | null>;
  /** Écriture atomique des métadonnées et des colonnes. */
  saveBatch(meta: WorldMeta | null, chunks: { dim: string; rec: ChunkRecord }[]): Promise<void>;
  deleteWorld(id: string): Promise<void>;
  /** Liste des clés de colonnes sauvegardées (tests, outils). */
  chunkCount(worldId: string): Promise<number>;
}

export const chunkKey = (worldId: string, dim: string, cx: number, cz: number): string => `${worldId}|${dim}|${cx}|${cz}`;

export function validateMeta(m: unknown): m is WorldMeta {
  if (!m || typeof m !== 'object') return false;
  const o = m as Record<string, unknown>;
  return typeof o.id === 'string' && typeof o.name === 'string' && typeof o.seed === 'number' && typeof o.time === 'number';
}

/** Stockage en mémoire (clone structuré pour simuler la persistance). */
export class MemoryStorage implements WorldStorage {
  private metas = new Map<string, WorldMeta>();
  private chunks = new Map<string, ChunkRecord>();

  async listWorlds(): Promise<WorldMeta[]> {
    return [...this.metas.values()].map((m) => structuredClone(m)).sort((a, b) => b.lastPlayed - a.lastPlayed);
  }
  async loadMeta(id: string): Promise<WorldMeta | null> {
    const m = this.metas.get(id);
    return m ? structuredClone(m) : null;
  }
  async loadChunk(worldId: string, dim: string, cx: number, cz: number): Promise<ChunkRecord | null> {
    const r = this.chunks.get(chunkKey(worldId, dim, cx, cz));
    return r ? structuredClone(r) : null;
  }
  async saveBatch(meta: WorldMeta | null, chunks: { dim: string; rec: ChunkRecord }[]): Promise<void> {
    if (meta) this.metas.set(meta.id, structuredClone(meta));
    const id = meta?.id;
    for (const c of chunks) {
      if (!id) throw new Error('saveBatch sans monde');
      this.chunks.set(chunkKey(id, c.dim, c.rec.cx, c.rec.cz), structuredClone(c.rec));
    }
  }
  async deleteWorld(id: string): Promise<void> {
    this.metas.delete(id);
    for (const k of [...this.chunks.keys()]) if (k.startsWith(id + '|')) this.chunks.delete(k);
  }
  async chunkCount(worldId: string): Promise<number> {
    let n = 0;
    for (const k of this.chunks.keys()) if (k.startsWith(worldId + '|')) n++;
    return n;
  }
}
