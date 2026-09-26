import { DEFAULT_EQUIPPED, DEFAULT_UNLOCKED } from './Catalog.js';
import { DEFAULT_SETTINGS } from './Settings.js';

const KEY = 'neon-car-arena/save';
export const SAVE_VERSION = 1;

export function defaultSave() {
  return {
    version: SAVE_VERSION,
    profile: { name: 'Pilote', xp: 0 },
    stats: { matches: 0, wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, saves: 0, shots: 0, mvps: 0, demos: 0, tournamentsWon: 0, trainingGoals: 0, playTime: 0 },
    unlocked: DEFAULT_UNLOCKED.slice(),
    newItems: [],
    equipped: { ...DEFAULT_EQUIPPED },
    settings: JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
    lastPlay: { mode: 'quick', difficulty: 'medium', arena: 'neon', duration: 300 },
    tournament: null,
  };
}

// Storage backends share one tiny interface so a cloud backend can be added later
// (load(): string|null, save(string)). Only local storage is implemented.
export class LocalStorageBackend {
  load() {
    try { return window.localStorage.getItem(KEY); } catch (e) { return null; }
  }
  save(str) {
    try { window.localStorage.setItem(KEY, str); return true; } catch (e) { return false; }
  }
  clear() {
    try { window.localStorage.removeItem(KEY); } catch (e) { /* storage unavailable */ }
  }
}

export class MemoryBackend {
  constructor() { this.data = null; }
  load() { return this.data; }
  save(str) { this.data = str; return true; }
  clear() { this.data = null; }
}

function mergeDefaults(def, val) {
  if (def === null) return val === undefined ? null : val;
  if (Array.isArray(def)) return Array.isArray(val) ? val : def;
  if (def && typeof def === 'object') {
    const out = {};
    for (const k of Object.keys(def)) out[k] = mergeDefaults(def[k], val ? val[k] : undefined);
    if (val && typeof val === 'object') for (const k of Object.keys(val)) if (!(k in out)) out[k] = val[k];
    return out;
  }
  return val === undefined || val === null || typeof val !== typeof def ? def : val;
}

export class SaveSystem {
  constructor(backend = new LocalStorageBackend()) {
    this.backend = backend;
    this.data = defaultSave();
    this.timer = null;
    this.persistent = true;
  }

  load() {
    const raw = this.backend.load();
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        this.data = this.migrate(mergeDefaults(defaultSave(), parsed));
      } catch (e) {
        this.data = defaultSave();
      }
    }
    // Probe once so the UI can warn when progress cannot be kept (private mode, sandbox).
    this.persistent = this.backend.save(JSON.stringify(this.data));
    return this.data;
  }

  migrate(d) {
    // Future versions: transform older saves here.
    d.version = SAVE_VERSION;
    for (const id of DEFAULT_UNLOCKED) if (!d.unlocked.includes(id)) d.unlocked.push(id);
    return d;
  }

  save() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.flush(), 250);
  }

  flush() {
    clearTimeout(this.timer);
    this.backend.save(JSON.stringify(this.data));
  }

  export() {
    return btoa(unescape(encodeURIComponent(JSON.stringify(this.data))));
  }

  import(code) {
    const parsed = JSON.parse(decodeURIComponent(escape(atob(code.trim()))));
    this.data = this.migrate(mergeDefaults(defaultSave(), parsed));
    this.flush();
  }

  reset() {
    this.data = defaultSave();
    this.flush();
  }
}
