/**
 * SettingsManager — préférences de l'appareil (graphismes, audio, commandes, profil).
 * Stockées localement ; chaque lecture/écriture est protégée (stockage indisponible = valeurs par défaut).
 */

export type Quality = 'low' | 'medium' | 'high' | 'ultra';

export interface KeyBindings {
  forward: string;
  back: string;
  left: string;
  right: string;
  jump: string;
  sneak: string;
  sprint: string;
  inventory: string;
  drop: string;
  chat: string;
  command: string;
  perspective: string;
  debug: string;
  hud: string;
  map: string;
  pickBlock: string;
}

export interface Settings {
  profileName: string;
  skin: string;
  quality: Quality;
  renderDistance: number;
  fov: number;
  brightness: number;
  resolutionScale: number;
  clouds: boolean;
  fancyLeaves: boolean;
  wavingPlants: boolean;
  particles: 'all' | 'reduced' | 'minimal';
  viewBobbing: boolean;
  fog: boolean;
  guiScale: number;
  showFps: boolean;
  masterVolume: number;
  musicVolume: number;
  soundVolume: number;
  ambientVolume: number;
  mouseSensitivity: number;
  touchSensitivity: number;
  invertY: boolean;
  autoJump: boolean;
  touchButtonSize: number;
  touchOpacity: number;
  leftHanded: boolean;
  /** Positions personnalisées des boutons tactiles (identifiant -> [x%, y%]). */
  touchLayout: Record<string, [number, number]>;
  vibration: boolean;
  gamepadDeadzone: number;
  keys: KeyBindings;
  lastServer: string;
  servers: Array<{ name: string; address: string; invite?: string }>;
  splashSeen: number;
}

export const DEFAULT_KEYS: KeyBindings = {
  forward: 'KeyW',
  back: 'KeyS',
  left: 'KeyA',
  right: 'KeyD',
  jump: 'Space',
  sneak: 'ShiftLeft',
  sprint: 'ControlLeft',
  inventory: 'KeyE',
  drop: 'KeyQ',
  chat: 'KeyT',
  command: 'Slash',
  perspective: 'F5',
  debug: 'F3',
  hud: 'F1',
  map: 'KeyM',
  pickBlock: 'Mouse1',
};

const isMobile = typeof navigator !== 'undefined' && (/Android|iPhone|iPad|Mobile/i.test(navigator.userAgent) || 'ontouchstart' in globalThis);

export function defaultSettings(): Settings {
  return {
    profileName: 'Joueur' + Math.floor(1000 + Math.random() * 9000),
    skin: 'explorer',
    quality: isMobile ? 'medium' : 'high',
    renderDistance: isMobile ? 6 : 8,
    fov: 70,
    brightness: 0.5,
    resolutionScale: isMobile ? 0.75 : 1,
    clouds: true,
    fancyLeaves: true,
    wavingPlants: true,
    particles: 'all',
    viewBobbing: true,
    fog: true,
    guiScale: 0,
    showFps: false,
    masterVolume: 0.8,
    musicVolume: 0.5,
    soundVolume: 0.9,
    ambientVolume: 0.7,
    mouseSensitivity: 0.5,
    touchSensitivity: 0.5,
    invertY: false,
    autoJump: isMobile,
    touchButtonSize: 1,
    touchOpacity: 0.6,
    leftHanded: false,
    touchLayout: {},
    vibration: true,
    gamepadDeadzone: 0.15,
    keys: { ...DEFAULT_KEYS },
    lastServer: '',
    servers: [],
    splashSeen: 0,
  };
}

/** Préréglages de qualité graphique. */
export const QUALITY_PRESETS: Record<Quality, Partial<Settings>> = {
  low: { renderDistance: 4, clouds: false, fancyLeaves: false, wavingPlants: false, particles: 'minimal', resolutionScale: 0.6 },
  medium: { renderDistance: 6, clouds: true, fancyLeaves: true, wavingPlants: true, particles: 'reduced', resolutionScale: 0.8 },
  high: { renderDistance: 8, clouds: true, fancyLeaves: true, wavingPlants: true, particles: 'all', resolutionScale: 1 },
  ultra: { renderDistance: 12, clouds: true, fancyLeaves: true, wavingPlants: true, particles: 'all', resolutionScale: 1 },
};

const KEY = 'voxelia.settings.v1';

export class SettingsManager {
  data: Settings;
  private listeners: Array<(s: Settings) => void> = [];
  readonly mobile = isMobile;

  constructor() {
    this.data = defaultSettings();
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed, keys: { ...DEFAULT_KEYS, ...(parsed.keys ?? {}) } };
      }
    } catch {
      /* stockage indisponible : valeurs par défaut */
    }
  }

  get<K extends keyof Settings>(k: K): Settings[K] {
    return this.data[k];
  }

  set<K extends keyof Settings>(k: K, v: Settings[K]): void {
    this.data[k] = v;
    this.save();
  }

  update(patch: Partial<Settings>): void {
    Object.assign(this.data, patch);
    this.save();
  }

  applyQuality(q: Quality): void {
    this.update({ quality: q, ...QUALITY_PRESETS[q] });
  }

  onChange(fn: (s: Settings) => void): void {
    this.listeners.push(fn);
  }

  save(): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch {
      /* ignore */
    }
    for (const l of this.listeners) l(this.data);
  }

  resetControls(): void {
    this.update({ keys: { ...DEFAULT_KEYS }, touchLayout: {} });
  }
}
