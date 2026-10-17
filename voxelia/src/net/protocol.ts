/**
 * Protocole réseau Voxelia (JSON sur WebSocket), partagé par le client et le serveur.
 * Le serveur fait autorité sur les blocs modifiés, l'heure, le chat et les permissions ;
 * la génération du terrain est déterministe (graine) et faite par chaque client.
 */

export const PROTOCOL_VERSION = 1;

export type Permission = 'visitor' | 'member' | 'operator';

export interface WorldInfo {
  name: string;
  seed: number;
  seedText: string;
  template: string;
  gameMode: string;
  difficulty: string;
  cheats: boolean;
  rules: Record<string, boolean | number>;
  experiments: Record<string, boolean>;
  time: number;
  day: number;
  spawn: [number, number, number] | null;
  motd: string;
}

/** Poses du corps transmises (mêmes valeurs que HumanPose de src/entities/humanoidPose.ts). */
export const HUMAN_POSES = ['stand', 'sneak', 'swim', 'tread', 'glide', 'fly'] as const;
export type HumanPose = (typeof HUMAN_POSES)[number];
/** Clé d'apparence d'une pièce d'armure (matériau, « glider », « pumpkin »). */
export const ARMOR_KEY_RE = /^[a-z_]{1,24}$/;

export interface PlayerState {
  id: number;
  name: string;
  skin: string;
  p: [number, number, number];
  yaw: number;
  pitch: number;
  dim: number;
  held: number;
  sneaking: boolean;
  swing: number;
  /** Pose du corps (absente chez les anciens clients : « sneak » s'il est accroupi, sinon « stand »). */
  pose?: HumanPose;
  /** Armure portée [tête, torse, jambes, pieds] : clé d'apparence ou null (absente chez les anciens clients). */
  armor?: (string | null)[];
}

export type ClientMsg =
  | { t: 'hello'; v: number; name: string; skin: string; invite?: string }
  | { t: 'chunk'; dim: number; cx: number; cz: number }
  | { t: 'block'; dim: number; x: number; y: number; z: number; raw: number }
  | { t: 'be'; dim: number; x: number; y: number; z: number; data: unknown }
  | { t: 'state'; s: Omit<PlayerState, 'id' | 'name' | 'skin'> }
  | { t: 'chat'; text: string; system?: boolean }
  | { t: 'time'; time: number; day: number }
  | { t: 'save'; data: unknown }
  | { t: 'ping'; n: number }
  /** Interrogation sans connexion (liste des serveurs) : le serveur répond « status » puis ferme. */
  | { t: 'status' };

export type ServerMsg =
  | { t: 'welcome'; id: number; world: WorldInfo; player: unknown; permission: Permission }
  | { t: 'chunk'; dim: number; cx: number; cz: number; blocks: Array<[number, number]>; be: Array<[number, unknown]> }
  | { t: 'block'; dim: number; x: number; y: number; z: number; raw: number; by: number }
  | { t: 'be'; dim: number; x: number; y: number; z: number; data: unknown; by: number }
  | { t: 'join'; id: number; name: string; skin: string }
  | { t: 'leave'; id: number; name: string }
  | { t: 'state'; s: PlayerState }
  | { t: 'chat'; from: string; text: string; system?: boolean }
  | { t: 'time'; time: number; day: number }
  | { t: 'denied'; x: number; y: number; z: number; dim: number; raw: number }
  | { t: 'error'; message: string }
  | { t: 'pong'; n: number }
  | { t: 'status'; name: string; motd: string; players: number; max: number; version: number; needsInvite: boolean };

/** Pose reçue validée : valeur inconnue → « stand » ; absente (ancien client) → déduite de « sneaking ». */
export function cleanPose(v: unknown, sneaking = false): HumanPose {
  if (v === undefined) return sneaking ? 'sneak' : 'stand';
  return typeof v === 'string' && (HUMAN_POSES as readonly string[]).includes(v) ? (v as HumanPose) : 'stand';
}

/** Armure reçue validée : exactement 4 cases, chacune null ou une clé valide ; sinon 4 cases vides. */
export function cleanArmor(v: unknown): (string | null)[] {
  if (Array.isArray(v) && v.length === 4 && v.every((a) => a === null || (typeof a === 'string' && ARMOR_KEY_RE.test(a)))) return v.slice() as (string | null)[];
  return [null, null, null, null];
}

/** Index d'un bloc dans une colonne (identique à colIndex). */
export function localIndex(x: number, y: number, z: number): number {
  return (y << 8) | ((z & 15) << 4) | (x & 15);
}
