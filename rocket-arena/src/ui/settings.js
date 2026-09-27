import { DEFAULT_KEYS } from '../input/input.js';

const KEY = 'supersonic-arena-settings-v1';

export const DEFAULT_SETTINGS = {
  playerName: 'Joueur',
  player2Name: 'Joueur 2',
  body: 'octane',
  accent: '#1b1d22',
  boostColor: 'team',
  fov: 110,
  camDistance: 2.7,
  camHeight: 1.0,
  camStiffness: 11,
  ballCamDefault: true,
  volMaster: 0.8,
  volSfx: 0.9,
  volMusic: 0.5,
  quality: 'high',
  showFps: false,
  deadzone: 0.15,
  invertPitch: false,
  keys: null,
  teamSize: 2,
  difficulty: 'pro',
  duration: 300,
  theme: 'day',
  team: 0,
  splitscreen: false,
  p2Team: 1,
  replays: true,
  boostMode: 'normal',
  gameMode: 'classic',
  gravityScale: 1,
  wallGrip: 'arcade',
  airAssist: null,
};

export function hasSavedSettings() {
  try {
    return !!localStorage.getItem(KEY);
  } catch (e) {
    return false;
  }
}

export function loadSettings() {
  let s = {};
  try {
    s = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
  } catch (e) {
    s = {};
  }
  const out = { ...DEFAULT_SETTINGS, ...s };
  out.keys = { ...DEFAULT_KEYS, ...(s.keys || {}) };
  return out;
}

export function saveSettings(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch (e) {
    // Storage may be unavailable (private mode): settings just won't persist.
  }
}

export const QUALITY = {
  low: { label: 'Basse', pixelRatio: 0.75, shadows: false, bloom: false, shadowSize: 1024 },
  medium: { label: 'Moyenne', pixelRatio: 1, shadows: true, bloom: false, shadowSize: 1024 },
  high: { label: 'Haute', pixelRatio: 1.5, shadows: true, bloom: true, shadowSize: 2048 },
  ultra: { label: 'Ultra', pixelRatio: 2, shadows: true, bloom: true, shadowSize: 4096 },
};
