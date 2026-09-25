/** Paramètres utilisateur (localStorage, lecture/écriture protégées). */
import { DEFAULT_BINDINGS, type Action } from '../input/input';
import { detectLang, type Lang } from '../i18n/i18n';

export interface Settings {
  /** Langue de l'interface (détectée au premier lancement). */
  language: Lang;
  /** Joystick et boutons à l'écran (téléphones, tablettes). */
  touchControls: boolean;
  playerName: string;
  renderDistance: number;
  fov: number;
  sensitivity: number;
  invertY: boolean;
  masterVolume: number;
  musicVolume: number;
  sfxVolume: number;
  clouds: boolean;
  particles: 'tout' | 'reduit' | 'minimal';
  viewBobbing: boolean;
  showFps: boolean;
  caveCulling: boolean;
  guiScale: number;
  pixelRatio: number;
  bindings: Record<Action, string[]>;
  servers: { name: string; address: string }[];
  mods: string[];
}

export const DEFAULT_SETTINGS: Settings = {
  language: 'fr',
  touchControls: false,
  playerName: 'Aventurier',
  renderDistance: 8,
  fov: 75,
  sensitivity: 1,
  invertY: false,
  masterVolume: 0.8,
  musicVolume: 0.5,
  sfxVolume: 0.8,
  clouds: true,
  particles: 'tout',
  viewBobbing: true,
  showFps: false,
  caveCulling: true,
  guiScale: 1,
  pixelRatio: 1,
  bindings: structuredClone(DEFAULT_BINDINGS),
  servers: [{ name: 'Serveur local', address: 'ws://localhost:25590' }],
  mods: [],
};

const KEY = 'voxerra.settings.v1';

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...structuredClone(DEFAULT_SETTINGS), language: detectLang(), touchControls: detectTouch() };
    const s = JSON.parse(raw) as Partial<Settings>;
    const merged = { ...structuredClone(DEFAULT_SETTINGS), language: detectLang(), touchControls: detectTouch(), ...s };
    if (!['fr', 'en', 'es'].includes(merged.language)) merged.language = 'fr';
    merged.bindings = { ...structuredClone(DEFAULT_BINDINGS), ...(s.bindings ?? {}) };
    return merged;
  } catch {
    return { ...structuredClone(DEFAULT_SETTINGS), language: detectLang(), touchControls: detectTouch() };
  }
}

/** Appareil tactile sans souris : contrôles tactiles activés par défaut. */
export function detectTouch(): boolean {
  try {
    return typeof matchMedia === 'function' && !matchMedia('(any-pointer: fine)').matches && (navigator.maxTouchPoints ?? 0) > 0;
  } catch {
    return false;
  }
}

export function saveSettings(s: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* stockage indisponible (navigation privée) : paramètres conservés en mémoire */
  }
}
