/**
 * Description persistante du monde servi (world.json) : informations envoyées aux clients,
 * heure, point d'apparition, opérateurs et permissions. Valeurs par défaut alignées sur
 * defaultRules() et newWorldMeta() de src/save/SaveManager.ts.
 */
import type { Permission, WorldInfo } from '../src/net/protocol.ts';
import type { ServerConfig } from './config.ts';
import { isInt, isNum, isObject, seedFromInput } from './util.ts';

export const WORLD_FORMAT = 1;
export const DAY_TICKS = 24000;

/** Règles de jeu par défaut (mêmes clés et valeurs que defaultRules() côté client). */
export const DEFAULT_RULES: Readonly<Record<string, boolean | number>> = {
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

/** Expériences par défaut (mêmes valeurs que newWorldMeta() côté client). */
export const DEFAULT_EXPERIMENTS: Readonly<Record<string, boolean>> = {
  fantasyBiomes: true,
  dimensions: true,
  drop3: false,
  tradeRebalance: false,
  bosses: true,
};

export interface WorldFile {
  format: number;
  info: Omit<WorldInfo, 'time' | 'day' | 'spawn'>;
  time: number;
  day: number;
  spawn: [number, number, number] | null;
  /** Opérateurs permanents (noms en minuscules). Les opérateurs de --ops ne sont pas enregistrés. */
  ops: string[];
  /** Permissions explicites des autres joueurs (noms en minuscules). */
  permissions: Record<string, Permission>;
  created: number;
  saved: number;
}

/** Vérifie les règles données par --rule ; renvoie la liste des erreurs. */
export function checkRules(rules: Record<string, boolean | number>): string[] {
  const errors: string[] = [];
  for (const [k, v] of Object.entries(rules)) {
    if (!(k in DEFAULT_RULES)) errors.push(`règle inconnue « ${k} » (connues : ${Object.keys(DEFAULT_RULES).join(', ')})`);
    else if (typeof v !== typeof DEFAULT_RULES[k]) errors.push(`règle « ${k} » : valeur ${typeof DEFAULT_RULES[k] === 'number' ? 'numérique' : 'true/false'} attendue`);
    else if (k === 'randomTickSpeed' && (!isInt(v, 0, 100))) errors.push('règle « randomTickSpeed » : entier entre 0 et 100 attendu');
  }
  return errors;
}

/** Nouveau monde à partir des options. */
export function newWorldFile(cfg: ServerConfig): WorldFile {
  const seedText = cfg.seed?.trim() ?? '';
  const seed = seedFromInput(seedText);
  const now = Date.now();
  return {
    format: WORLD_FORMAT,
    info: {
      name: cfg.name,
      seed,
      seedText: seedText || String(seed),
      template: cfg.template,
      gameMode: cfg.gameMode,
      difficulty: cfg.difficulty,
      cheats: cfg.cheats,
      rules: { ...DEFAULT_RULES, ...cfg.rules },
      experiments: { ...DEFAULT_EXPERIMENTS },
      motd: cfg.motd,
    },
    time: 1000,
    day: 0,
    spawn: null,
    ops: [],
    permissions: {},
    created: now,
    saved: now,
  };
}

function str(v: unknown, fallback: string, max = 128): string {
  return typeof v === 'string' ? v.slice(0, max) : fallback;
}

function isPermission(v: unknown): v is Permission {
  return v === 'visitor' || v === 'member' || v === 'operator';
}

/**
 * Relit un world.json (déjà analysé) en complétant les champs manquants.
 * Renvoie null si le contenu n'est pas un monde exploitable (graine absente, etc.).
 */
export function normalizeWorldFile(raw: unknown): WorldFile | null {
  if (!isObject(raw) || !isObject(raw.info)) return null;
  const i = raw.info;
  if (!isInt(i.seed, 0, 0xffffffff)) return null;
  const rules: Record<string, boolean | number> = { ...DEFAULT_RULES };
  if (isObject(i.rules)) for (const [k, v] of Object.entries(i.rules)) if (k in DEFAULT_RULES && typeof v === typeof DEFAULT_RULES[k]) rules[k] = v as boolean | number;
  const experiments: Record<string, boolean> = { ...DEFAULT_EXPERIMENTS };
  if (isObject(i.experiments)) for (const [k, v] of Object.entries(i.experiments)) if (typeof v === 'boolean') experiments[k] = v;
  let spawn: [number, number, number] | null = null;
  if (Array.isArray(raw.spawn) && raw.spawn.length === 3 && raw.spawn.every((n) => isNum(n, -3e7, 3e7))) spawn = [raw.spawn[0], raw.spawn[1], raw.spawn[2]] as [number, number, number];
  const ops = Array.isArray(raw.ops) ? raw.ops.filter((s): s is string => typeof s === 'string').map((s) => s.toLowerCase()) : [];
  const permissions: Record<string, Permission> = {};
  if (isObject(raw.permissions)) for (const [k, v] of Object.entries(raw.permissions)) if (isPermission(v)) permissions[k.toLowerCase()] = v;
  const now = Date.now();
  return {
    format: WORLD_FORMAT,
    info: {
      name: str(i.name, 'Serveur Voxelia', 64),
      seed: i.seed,
      seedText: str(i.seedText, String(i.seed)),
      template: str(i.template, 'default', 32),
      gameMode: str(i.gameMode, 'survival', 32),
      difficulty: str(i.difficulty, 'normal', 32),
      cheats: i.cheats === true,
      rules,
      experiments,
      motd: str(i.motd, ''),
    },
    time: isNum(raw.time, 0, DAY_TICKS) ? raw.time % DAY_TICKS : 1000,
    day: isInt(raw.day, 0, 1e9) ? raw.day : 0,
    spawn,
    ops: [...new Set(ops)],
    permissions,
    created: isNum(raw.created, 0, 1e15) ? raw.created : now,
    saved: isNum(raw.saved, 0, 1e15) ? raw.saved : now,
  };
}

/** Applique les options données explicitement à un monde existant (la graine ne change jamais). */
export function applyConfig(w: WorldFile, cfg: ServerConfig): string[] {
  const notes: string[] = [];
  const ex = cfg.explicit;
  if (ex.has('name')) w.info.name = cfg.name;
  if (ex.has('motd')) w.info.motd = cfg.motd;
  if (ex.has('gameMode')) w.info.gameMode = cfg.gameMode;
  if (ex.has('difficulty')) w.info.difficulty = cfg.difficulty;
  if (ex.has('cheats')) w.info.cheats = cfg.cheats;
  if (ex.has('template') && w.info.template !== cfg.template) notes.push(`--template ignoré : le monde existant utilise « ${w.info.template} »`);
  if (ex.has('seed') && cfg.seed !== null && seedFromInput(cfg.seed) !== w.info.seed) notes.push(`--seed ignoré : le monde existant utilise la graine ${w.info.seedText}`);
  for (const [k, v] of Object.entries(cfg.rules)) w.info.rules[k] = v;
  return notes;
}

/** Informations envoyées au client dans « welcome ». */
export function worldInfo(w: WorldFile): WorldInfo {
  return {
    ...w.info,
    rules: { ...w.info.rules },
    experiments: { ...w.info.experiments },
    time: Math.floor(w.time),
    day: w.day,
    spawn: w.spawn ? [w.spawn[0], w.spawn[1], w.spawn[2]] : null,
  };
}
