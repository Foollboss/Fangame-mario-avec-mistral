/**
 * Apparence du joueur (« skin ») : teint, yeux, coiffure, vêtements et accessoire, choisis dans
 * l'écran de personnalisation. Elle voyage sous forme de code court (« 1.e8b88a.1a1a2a… »), le
 * même que l'on peut copier pour partager un skin ; le modèle en boîtes en est déduit.
 */
import type { ModelPart } from '../registry/types';
import { tr } from '../i18n/i18n';

export const COIFFURES = ['courte', 'longue', 'herissee', 'queue', 'chauve'] as const;
export const MOTIFS = ['uni', 'rayures', 'veste', 'embleme'] as const;
export const MANCHES = ['longues', 'courtes'] as const;
export const ACCESSOIRES = ['echarpe', 'cape', 'casquette', 'lunettes', 'aucun'] as const;

export type Coiffure = (typeof COIFFURES)[number];
export type Motif = (typeof MOTIFS)[number];
export type Manches = (typeof MANCHES)[number];
export type Accessoire = (typeof ACCESSOIRES)[number];

export interface Skin {
  peau: string;
  yeux: string;
  cheveux: string;
  coiffure: Coiffure;
  haut: string;
  motif: Motif;
  manches: Manches;
  bas: string;
  chaussures: string;
  accessoire: Accessoire;
  accessoireCouleur: string;
}

/** L'aventurier à écharpe d'origine. */
export const DEFAULT_SKIN: Skin = {
  peau: '#e8b88a',
  yeux: '#1a1a2a',
  cheveux: '#5a3a24',
  coiffure: 'courte',
  haut: '#2a6a8a',
  motif: 'uni',
  manches: 'longues',
  bas: '#3a3a5a',
  chaussures: '#4a2a1a',
  accessoire: 'echarpe',
  accessoireCouleur: '#d04a2a',
};

export const LABELS = {
  coiffure: { courte: tr('Courte'), longue: tr('Longue'), herissee: tr('Hérissée'), queue: tr('Queue de cheval'), chauve: tr('Rasée') },
  motif: { uni: tr('Uni'), rayures: tr('Rayures'), veste: tr('Veste ouverte'), embleme: tr('Emblème') },
  manches: { longues: tr('Longues'), courtes: tr('Courtes') },
  accessoire: { echarpe: tr('Écharpe'), cape: tr('Cape'), casquette: tr('Casquette'), lunettes: tr('Lunettes'), aucun: tr('Aucun') },
} as const;

/** Nuanciers proposés dans l'écran de personnalisation. */
export const PALETTES = {
  peau: ['#f6d5b8', '#f0c8a0', '#e8b88a', '#e0a878', '#d09060', '#c68a5a', '#a86c40', '#8a5430', '#6a3c20', '#4a2a18'],
  yeux: ['#1a1a2a', '#3a6ac8', '#3a9a4a', '#7a4a2a', '#8a8a9a', '#8a3ac8', '#c83a3a', '#e8b020'],
  cheveux: ['#1a1a1a', '#3a2418', '#5a3a24', '#8a5a30', '#c88a40', '#e8c050', '#d05a2a', '#e8e8f0', '#4a6ad8', '#d84aa8', '#3a9a4a'],
  vetements: ['#2a6a8a', '#3aa0c8', '#3a8a4a', '#8ac83a', '#c03a3a', '#d04a2a', '#d08a2a', '#e8c040', '#6a3ab8', '#d84aa8', '#2a2a30', '#3a3a5a', '#4a2a1a', '#5a4a3a', '#8a8a9a', '#f0f0f0'],
};

/** Skins tout faits (créations originales). */
export const PRESETS: { id: string; name: string; skin: Skin }[] = [
  { id: 'aventurier', name: tr('Aventurier'), skin: DEFAULT_SKIN },
  {
    id: 'exploratrice',
    name: tr('Exploratrice'),
    skin: { peau: '#c68a5a', yeux: '#3a9a4a', cheveux: '#2a1a10', coiffure: 'longue', haut: '#3a8a4a', motif: 'veste', manches: 'courtes', bas: '#5a4a3a', chaussures: '#3a2418', accessoire: 'cape', accessoireCouleur: '#8a3a2a' },
  },
  {
    id: 'mineur',
    name: tr('Mineur'),
    skin: { peau: '#e0a878', yeux: '#7a4a2a', cheveux: '#8a5a30', coiffure: 'courte', haut: '#d08a2a', motif: 'rayures', manches: 'longues', bas: '#2a3a6a', chaussures: '#2a2a30', accessoire: 'casquette', accessoireCouleur: '#e8c040' },
  },
  {
    id: 'mage',
    name: tr('Mage astral'),
    skin: { peau: '#f0c8a0', yeux: '#8a3ac8', cheveux: '#e8e8f0', coiffure: 'longue', haut: '#3a2a6a', motif: 'embleme', manches: 'longues', bas: '#2a1a4a', chaussures: '#1a1a2a', accessoire: 'cape', accessoireCouleur: '#6a3ab8' },
  },
  {
    id: 'ninja',
    name: tr('Ninja'),
    skin: { peau: '#d8a878', yeux: '#1a1a2a', cheveux: '#1a1a1a', coiffure: 'herissee', haut: '#2a2a30', motif: 'uni', manches: 'longues', bas: '#2a2a30', chaussures: '#1a1a1a', accessoire: 'echarpe', accessoireCouleur: '#c03a3a' },
  },
  {
    id: 'vacancier',
    name: tr('Vacancier'),
    skin: { peau: '#f0c090', yeux: '#3a6ac8', cheveux: '#e8c050', coiffure: 'queue', haut: '#3aa0c8', motif: 'rayures', manches: 'courtes', bas: '#f0f0f0', chaussures: '#d04a2a', accessoire: 'lunettes', accessoireCouleur: '#2a2a30' },
  },
];

const HEX = /^#[0-9a-f]{6}$/;
const color = (v: unknown, def: string): string => (typeof v === 'string' && HEX.test(v.toLowerCase()) ? v.toLowerCase() : def);
const pick = <T extends string>(list: readonly T[], v: unknown, def: T): T => (list.includes(v as T) ? (v as T) : def);

/** Skin complet et valide à partir de n'importe quelle valeur (réglages, réseau…). */
export function sanitizeSkin(v: unknown): Skin {
  const o = (v && typeof v === 'object' ? v : {}) as Record<string, unknown>;
  const d = DEFAULT_SKIN;
  return {
    peau: color(o.peau, d.peau),
    yeux: color(o.yeux, d.yeux),
    cheveux: color(o.cheveux, d.cheveux),
    coiffure: pick(COIFFURES, o.coiffure, d.coiffure),
    haut: color(o.haut, d.haut),
    motif: pick(MOTIFS, o.motif, d.motif),
    manches: pick(MANCHES, o.manches, d.manches),
    bas: color(o.bas, d.bas),
    chaussures: color(o.chaussures, d.chaussures),
    accessoire: pick(ACCESSOIRES, o.accessoire, d.accessoire),
    accessoireCouleur: color(o.accessoireCouleur, d.accessoireCouleur),
  };
}

/** Code court : version, puis couleurs (sans « # ») et styles (numéros), séparés par des points. */
export function encodeSkin(s: Skin): string {
  const c = (x: string) => x.slice(1);
  return [
    '1',
    c(s.peau),
    c(s.yeux),
    c(s.cheveux),
    COIFFURES.indexOf(s.coiffure),
    c(s.haut),
    MOTIFS.indexOf(s.motif),
    MANCHES.indexOf(s.manches),
    c(s.bas),
    c(s.chaussures),
    ACCESSOIRES.indexOf(s.accessoire),
    c(s.accessoireCouleur),
  ].join('.');
}

/** Lit un code de skin ; null s'il est mal formé. */
export function decodeSkin(code: unknown): Skin | null {
  if (typeof code !== 'string') return null;
  const f = code.trim().toLowerCase().split('.');
  if (f.length !== 12 || f[0] !== '1') return null;
  const col = (x: string) => (/^[0-9a-f]{6}$/.test(x) ? '#' + x : null);
  const idx = <T>(list: readonly T[], x: string) => (/^\d$/.test(x) && Number(x) < list.length ? list[Number(x)] : null);
  const s = {
    peau: col(f[1]),
    yeux: col(f[2]),
    cheveux: col(f[3]),
    coiffure: idx(COIFFURES, f[4]),
    haut: col(f[5]),
    motif: idx(MOTIFS, f[6]),
    manches: idx(MANCHES, f[7]),
    bas: col(f[8]),
    chaussures: col(f[9]),
    accessoire: idx(ACCESSOIRES, f[10]),
    accessoireCouleur: col(f[11]),
  };
  return Object.values(s).every((v) => v !== null) ? (s as Skin) : null;
}

export const DEFAULT_SKIN_CODE = encodeSkin(DEFAULT_SKIN);

/** Skin au hasard (couleurs des nuanciers, styles au hasard). */
export function randomSkin(rand: () => number = Math.random): Skin {
  const any = <T>(list: readonly T[]): T => list[Math.floor(rand() * list.length)];
  return {
    peau: any(PALETTES.peau),
    yeux: any(PALETTES.yeux),
    cheveux: any(PALETTES.cheveux),
    coiffure: any(COIFFURES),
    haut: any(PALETTES.vetements),
    motif: any(MOTIFS),
    manches: any(MANCHES),
    bas: any(PALETTES.vetements),
    chaussures: any(PALETTES.vetements),
    accessoire: any(ACCESSOIRES),
    accessoireCouleur: any(PALETTES.vetements),
  };
}

/**
 * Modèle en boîtes du joueur (en pixels, pieds à l'origine, avant vers −Z). Les rôles servent à
 * l'animation ; cheveux, cape et casquette suivent la tête ou le corps.
 */
export function playerParts(s: Skin): ModelPart[] {
  const parts: ModelPart[] = [
    { id: 'body', size: [8, 12, 4], pos: [-4, 12, -2], pivot: [0, 24, 0], color: s.haut, role: 'body' },
    { id: 'head', size: [8, 8, 8], pos: [-4, 24, -4], pivot: [0, 24, 0], color: s.peau, role: 'head' },
    { id: 'arm_r', size: [4, 12, 4], pos: [4, 12, -2], pivot: [6, 22, 0], color: s.haut, role: 'arm_r' },
    { id: 'arm_l', size: [4, 12, 4], pos: [-8, 12, -2], pivot: [-6, 22, 0], color: s.haut, role: 'arm_l' },
    { id: 'leg_r', size: [4, 12, 4], pos: [0, 0, -2], pivot: [2, 12, 0], color: s.bas, role: 'leg_r' },
    { id: 'leg_l', size: [4, 12, 4], pos: [-4, 0, -2], pivot: [-2, 12, 0], color: s.bas, role: 'leg_l' },
  ];
  const hair = (id: string, size: [number, number, number], pos: [number, number, number]) => parts.push({ id, size, pos, color: s.cheveux, parent: 'head' });
  if (s.coiffure === 'longue') hair('hair_back', [8, 7, 1], [-4, 20, 4]);
  else if (s.coiffure === 'queue') hair('hair_tail', [2, 6, 2], [-1, 21, 4]);
  else if (s.coiffure === 'herissee') {
    hair('hair_spike1', [2, 2, 2], [-3.5, 32, -2.5]);
    hair('hair_spike2', [2, 3, 2], [-1, 32, -0.5]);
    hair('hair_spike3', [2, 2, 2], [1.5, 32, 1.5]);
  }
  const acc = s.accessoireCouleur;
  if (s.accessoire === 'echarpe') parts.push({ id: 'scarf', size: [9, 2, 5], pos: [-4.5, 22, -2.5], color: acc, parent: 'body' });
  else if (s.accessoire === 'cape') parts.push({ id: 'cape', size: [8, 14, 1], pos: [-4, 9, 2], color: acc, parent: 'body' });
  else if (s.accessoire === 'casquette') {
    parts.push({ id: 'cap', size: [8.6, 3, 8.6], pos: [-4.3, 29.5, -4.3], color: acc, parent: 'head' });
    parts.push({ id: 'cap_brim', size: [8, 1, 4], pos: [-4, 29.5, -8.2], color: acc, parent: 'head' });
  }
  return parts;
}
