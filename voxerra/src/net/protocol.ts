/**
 * Protocole multijoueur (JSON sur WebSocket).
 *
 * Le serveur est autoritaire pour le monde (blocs, entités, créatures, temps,
 * météo, survie, inventaires côté serveur). Le client envoie sa position
 * (mouvement prédit localement, vérifié par le serveur) et ses actions ;
 * le serveur diffuse colonnes, changements de blocs, instantanés d'entités
 * et évènements (sons, particules, messages).
 */
import type { ChunkRecord } from '../save/serializer';
import type { SimEvent } from '../sim/events';
import type { RayHit } from '../physics/raycast';
import type { ItemStack } from '../inventory/inventory';

export const PROTOCOL_VERSION = 1;
export const DEFAULT_PORT = 25590;

/** Instantané d'une entité distante. */
export interface EntSnap {
  id: number;
  k: string; // kind
  ty?: string; // type (créature, projectile)
  n?: string; // nom affiché
  x: number;
  y: number;
  z: number;
  yw: number;
  pt: number;
  by?: number; // orientation du corps
  hp?: number;
  mx?: number;
  h?: number; // hurtTime
  d?: number; // mort (deathTime)
  sw?: number; // swing
  hi?: string | null; // objet tenu
  sn?: boolean; // accroupi
  fl?: boolean; // vol
  st?: ItemStack; // objet au sol
  w?: number; // largeur (demi)
  ht?: number; // hauteur
}

/** État propre au joueur (survie). */
export interface SelfSnap {
  hp: number;
  mx: number;
  en: number;
  sa: number;
  air: number;
  tmp: number;
  fx: [string, number, number][];
  dead: boolean;
  gm: string;
  /** Message de mort. */
  dm?: string;
}

export type ClientMsg =
  | { t: 'hello'; name: string; version: number }
  | { t: 'move'; x: number; y: number; z: number; yw: number; pt: number; sn: boolean; sp: boolean; fl: boolean; og: boolean; sl: number }
  | { t: 'fall'; dist: number }
  | { t: 'dig'; x: number; y: number; z: number }
  | { t: 'place'; hit: RayHit; slot: number }
  | { t: 'interact'; hit: RayHit }
  | { t: 'use'; hit: RayHit | null; phase: 'start' | 'finish'; held: number }
  | { t: 'attack'; id: number }
  | { t: 'drop'; all: boolean }
  | { t: 'dropStack'; stack: ItemStack }
  | { t: 'inv'; data: Record<string, unknown> }
  | { t: 'be'; x: number; y: number; z: number; data: Record<string, unknown> | null }
  | { t: 'chat'; text: string }
  | { t: 'respawn' }
  | { t: 'dodge'; fx: number; fz: number };

export interface WelcomeMsg {
  t: 'welcome';
  id: number;
  world: { name: string; seed: number; seedText: string; worldType: string; difficulty: number; gameMode: string; time: number; rules: Record<string, boolean>; structures: boolean };
  player: Record<string, unknown>;
  radius: number;
  motd: string;
}

export type ServerMsg =
  | WelcomeMsg
  | { t: 'kick'; reason: string }
  | { t: 'chunk'; dim: string; rec: WireChunk }
  | { t: 'block'; dim: string; x: number; y: number; z: number; n: string; m: number }
  | { t: 'be'; dim: string; x: number; y: number; z: number; data: Record<string, unknown> | null }
  | { t: 'ents'; dim: string; list: EntSnap[]; gone: number[]; me: SelfSnap }
  | { t: 'inv'; data: Record<string, unknown> }
  | { t: 'env'; time: number; weather: string; wt: number; flash: number }
  | { t: 'ev'; e: SimEvent }
  | { t: 'pos'; dim: string; x: number; y: number; z: number; mode?: string }
  | { t: 'players'; list: { id: number; name: string }[] };

/** Colonne sérialisée pour le transport (tableaux typés → base64). */
export interface WireChunk {
  cx: number;
  cz: number;
  v: number;
  palette: string[];
  sections: (string | null)[];
  biomes: string;
  tints: string;
  blockEntities: [number, Record<string, unknown>][];
}

function bytesToB64(u8: Uint8Array): string {
  let s = '';
  const CH = 0x8000;
  for (let i = 0; i < u8.length; i += CH) s += String.fromCharCode.apply(null, Array.from(u8.subarray(i, i + CH)));
  return btoa(s);
}

function b64ToBytes(b64: string): Uint8Array {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

const view8 = (a: ArrayBufferView): Uint8Array => new Uint8Array(a.buffer, a.byteOffset, a.byteLength);

export function chunkToWire(r: ChunkRecord): WireChunk {
  return {
    cx: r.cx,
    cz: r.cz,
    v: r.v,
    palette: r.palette,
    sections: r.sections.map((s) => (s ? bytesToB64(view8(s)) : null)),
    biomes: bytesToB64(view8(r.biomes)),
    tints: bytesToB64(view8(r.tints)),
    blockEntities: (r.blockEntities ?? []) as [number, Record<string, unknown>][],
  };
}

export function wireToChunk(w: WireChunk): ChunkRecord {
  const u16 = (b: string) => {
    const bytes = b64ToBytes(b);
    return new Uint16Array(bytes.buffer, bytes.byteOffset, bytes.byteLength >> 1);
  };
  const tb = b64ToBytes(w.tints);
  return {
    v: w.v,
    cx: w.cx,
    cz: w.cz,
    palette: w.palette,
    sections: w.sections.map((s) => (s ? u16(s) : null)),
    biomes: b64ToBytes(w.biomes),
    tints: new Uint32Array(tb.buffer, tb.byteOffset, tb.byteLength >> 2),
    blockEntities: w.blockEntities as ChunkRecord['blockEntities'],
    entities: [],
  };
}

/** Évènements réservés à un joueur précis (`to`). */
export function eventTarget(e: SimEvent): number | undefined {
  return (e as { to?: number }).to;
}
