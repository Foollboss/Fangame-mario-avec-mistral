import { DEFAULT_LOADOUT, ITEMS } from '../config/ItemCatalog.js';
import { DEFAULT_LAYOUT } from '../input/MobileInput.js';

export const SAVE_VERSION = 1;
const KEY = 'neon-car-arena/save';

export function defaultSave() {
  return {
    version: SAVE_VERSION,
    profile: { name: 'Pilote', level: 1, xp: 0, createdAt: Date.now() },
    stats: { matches: 0, wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, saves: 0, shots: 0, mvps: 0, trainingGoals: 0, tournamentsWon: 0, playTime: 0 },
    unlocked: ITEMS.filter((i) => i.level <= 1).map((i) => i.id),
    newItems: [],
    loadout: { ...DEFAULT_LOADOUT },
    settings: {
      controls: { sensitivity: 1, invertPitch: false, invertSteer: false, vibration: true, buttonScale: 1, layout: { ...DEFAULT_LAYOUT }, autoAccelerate: false, landingAssist: true },
      camera: { distance: 9.5, height: 3.6, fov: 72, stiffness: 1, ballCam: true, assist: true },
      graphics: { quality: 'auto', detected: null, fpsCap: 60, showFps: false },
      audio: { master: 0.8, music: 0.6, sfx: 0.9 },
      game: { replays: true, difficulty: 'medium', duration: 300, arena: 'neon_dome' },
    },
    tournament: null,
  };
}

// Stockage local. Pour une sauvegarde cloud, il suffit de fournir un autre adaptateur
// implémentant load()/save() (ex. appel HTTP authentifié) : le reste du jeu ne change pas.
export class LocalStorageAdapter {
  load() {
    try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : null; } catch { return null; }
  }
  save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); return true; } catch { return false; }
  }
}

function merge(base, over) {
  if (!over || typeof over !== 'object' || Array.isArray(base)) return over ?? base;
  const out = { ...base };
  for (const k of Object.keys(over)) {
    out[k] = base && typeof base[k] === 'object' && base[k] !== null && !Array.isArray(base[k]) ? merge(base[k], over[k]) : over[k];
  }
  return out;
}

export class SaveSystem {
  constructor(adapter = new LocalStorageAdapter()) {
    this.adapter = adapter;
    this.data = this.migrate(adapter.load());
    this.timer = null;
  }

  migrate(raw) {
    const base = defaultSave();
    if (!raw || typeof raw !== 'object') return base;
    // Version future : ajouter ici les migrations successives (raw.version < SAVE_VERSION).
    const data = merge(base, raw);
    data.version = SAVE_VERSION;
    const known = new Set(ITEMS.map((i) => i.id));
    data.unlocked = [...new Set([...base.unlocked, ...(raw.unlocked || []).filter((id) => known.has(id))])];
    for (const [cat, id] of Object.entries(data.loadout)) if (!known.has(id)) data.loadout[cat] = DEFAULT_LOADOUT[cat];
    return data;
  }

  // Écriture différée pour éviter d'écrire à chaque petit changement.
  save(immediate = false) {
    clearTimeout(this.timer);
    if (immediate) return this.adapter.save(this.data);
    this.timer = setTimeout(() => this.adapter.save(this.data), 300);
    return true;
  }

  exportJSON() { return JSON.stringify(this.data, null, 2); }

  importJSON(text) {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || !parsed.profile) throw new Error('Fichier de sauvegarde invalide');
    this.data = this.migrate(parsed);
    this.save(true);
  }

  reset() { this.data = defaultSave(); this.save(true); }
}
