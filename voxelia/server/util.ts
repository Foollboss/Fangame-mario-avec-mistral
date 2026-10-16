/**
 * Outils du serveur Voxelia : journal, limiteurs de débit, nettoyage des noms et du chat,
 * conversion de graine (identique au client), adresses du réseau local.
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import { networkInterfaces } from 'node:os';

// ------------------------------------------------------------------ journal

function stamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

export function log(msg: string): void {
  process.stdout.write(`[${stamp()}] ${msg}\n`);
}

export function warn(msg: string): void {
  process.stdout.write(`[${stamp()}] ATTENTION : ${msg}\n`);
}

export function errorText(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}

// ------------------------------------------------------------------ limiteur de débit

/** Seau à jetons : `rate` jetons par seconde, réserve maximale `burst`. */
export class TokenBucket {
  private tokens: number;
  private last: number;
  private readonly rate: number;
  private readonly burst: number;

  constructor(rate: number, burst: number) {
    this.rate = rate;
    this.burst = burst;
    this.tokens = burst;
    this.last = Date.now();
  }

  /** Consomme un jeton ; faux si la réserve est vide. */
  take(n = 1): boolean {
    const now = Date.now();
    this.tokens = Math.min(this.burst, this.tokens + ((now - this.last) / 1000) * this.rate);
    this.last = now;
    if (this.tokens < n) return false;
    this.tokens -= n;
    return true;
  }
}

// ------------------------------------------------------------------ validation

export function isInt(v: unknown, min: number, max: number): v is number {
  return typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
}

export function isNum(v: unknown, min: number, max: number): v is number {
  return typeof v === 'number' && Number.isFinite(v) && v >= min && v <= max;
}

export function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Taille JSON d'une valeur, ou -1 si elle n'est pas sérialisable. */
export function jsonSize(v: unknown): number {
  try {
    const s = JSON.stringify(v);
    return s === undefined ? -1 : s.length;
  } catch {
    return -1;
  }
}

// ------------------------------------------------------------------ noms, apparences, chat

export const NAME_MAX = 16;

/**
 * Nom de joueur : lettres non accentuées, chiffres et « _ », 16 caractères au plus.
 * Les accents sont retirés (« Élodie » → « Elodie ») ; un nom vide devient « JoueurNNNN ».
 */
export function sanitizeName(raw: unknown): string {
  return cleanName(raw) || 'Joueur' + Math.floor(1000 + Math.random() * 9000);
}

/** Partie valide d'un nom (chaîne vide s'il ne reste rien). */
export function cleanName(raw: unknown): string {
  const s = typeof raw === 'string' ? raw : '';
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9_]/g, '')
    .slice(0, NAME_MAX);
}

/** Variante numérotée d'un nom déjà pris (« Bob » → « Bob2 », tronqué à 16 caractères). */
export function numberedName(base: string, n: number): string {
  const suffix = String(n);
  return base.slice(0, NAME_MAX - suffix.length) + suffix;
}

/** Clé de fichier / comparaison d'un nom (insensible à la casse). */
export function nameKey(name: string): string {
  return name.toLowerCase();
}

const SKIN_RE = /^[a-z0-9_]{1,32}$/;
export const DEFAULT_SKIN = 'explorer';

export function sanitizeSkin(raw: unknown): string {
  return typeof raw === 'string' && SKIN_RE.test(raw) ? raw : DEFAULT_SKIN;
}

export const CHAT_MAX = 256;

/** Retire les caractères de contrôle et les espaces superflus ; 256 caractères au plus. */
export function sanitizeChat(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e\u2066-\u2069]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, CHAT_MAX);
}

// ------------------------------------------------------------------ graine

/** FNV-1a 32 bits (même algorithme que src/util/random.ts). */
function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Graine saisie (texte ou nombre) → entier 32 bits, identique à seedFromInput du client. */
export function seedFromInput(input: string): number {
  const t = input.trim();
  if (t === '') return (Math.random() * 0xffffffff) >>> 0;
  if (/^-?\d+$/.test(t)) {
    let h = 0;
    for (let i = 0; i < t.length; i++) h = (Math.imul(h, 31) + t.charCodeAt(i)) | 0;
    const n = Number(t);
    return Number.isSafeInteger(n) && Math.abs(n) < 2 ** 31 ? n >>> 0 : h >>> 0;
  }
  return hashString(t);
}

// ------------------------------------------------------------------ divers

/** Comparaison à temps constant de deux codes (insensible à la casse et aux espaces). */
export function sameCode(a: string, b: string): boolean {
  const norm = (s: string) => createHash('sha256').update(s.trim().toUpperCase()).digest();
  return timingSafeEqual(norm(a), norm(b));
}

/** Adresses IPv4 du réseau local (hors boucle locale). */
export function lanAddresses(): string[] {
  const out: string[] = [];
  const ifs = networkInterfaces();
  for (const list of Object.values(ifs)) {
    for (const a of list ?? []) {
      if (a.family === 'IPv4' && !a.internal) out.push(a.address);
    }
  }
  return out;
}

/** Adresse IP lisible (sans le préfixe IPv4-mappé « ::ffff: »). */
export function cleanIp(ip: string | undefined): string {
  if (!ip) return '?';
  return ip.startsWith('::ffff:') ? ip.slice(7) : ip;
}
