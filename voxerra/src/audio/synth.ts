/**
 * Synthèse sonore procédurale (aucun fichier audio) : bruits filtrés,
 * oscillateurs, enveloppes, résonateurs. Produit des Float32Array mono.
 */
import { Rng } from '../engine/rng';

export type Gen = (sr: number, rng: Rng) => Float32Array;

const env = (t: number, a: number, d: number): number => (t < a ? t / a : Math.exp(-(t - a) / d));

/** Filtre biquad (formules RBJ) appliqué sur place. */
function biquad(buf: Float32Array, sr: number, type: 'lp' | 'hp' | 'bp', f: number | ((i: number) => number), q = 0.707): Float32Array {
  let x1 = 0,
    x2 = 0,
    y1 = 0,
    y2 = 0;
  let b0 = 0,
    b1 = 0,
    b2 = 0,
    a1 = 0,
    a2 = 0;
  const coef = (freq: number) => {
    const w = (2 * Math.PI * Math.min(freq, sr * 0.45)) / sr;
    const cs = Math.cos(w),
      sn = Math.sin(w);
    const alpha = sn / (2 * q);
    const a0 = 1 + alpha;
    if (type === 'lp') {
      b0 = (1 - cs) / 2 / a0;
      b1 = (1 - cs) / a0;
      b2 = b0;
    } else if (type === 'hp') {
      b0 = (1 + cs) / 2 / a0;
      b1 = -(1 + cs) / a0;
      b2 = b0;
    } else {
      b0 = alpha / a0;
      b1 = 0;
      b2 = -alpha / a0;
    }
    a1 = (-2 * cs) / a0;
    a2 = (1 - alpha) / a0;
  };
  const dyn = typeof f === 'function';
  if (!dyn) coef(f as number);
  for (let i = 0; i < buf.length; i++) {
    if (dyn && (i & 31) === 0) coef((f as (i: number) => number)(i));
    const x = buf[i];
    const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1;
    x1 = x;
    y2 = y1;
    y1 = y;
    buf[i] = y;
  }
  return buf;
}

function noise(n: number, rng: Rng): Float32Array {
  const b = new Float32Array(n);
  for (let i = 0; i < n; i++) b[i] = rng.next() * 2 - 1;
  return b;
}

function normalize(b: Float32Array, peak = 0.9): Float32Array {
  let m = 0;
  for (let i = 0; i < b.length; i++) m = Math.max(m, Math.abs(b[i]));
  if (m > 0) for (let i = 0; i < b.length; i++) b[i] *= peak / m;
  return b;
}

/** Bruit filtré avec enveloppe (base de la plupart des bruitages). */
function burst(sr: number, rng: Rng, dur: number, type: 'lp' | 'hp' | 'bp', freq: number, q: number, attack: number, decay: number, peak = 0.8): Float32Array {
  const n = Math.floor(sr * dur);
  const b = biquad(noise(n, rng), sr, type, freq * (0.85 + rng.next() * 0.3), q);
  for (let i = 0; i < n; i++) b[i] *= env(i / sr, attack, decay);
  return normalize(b, peak);
}

/** Somme de partiels sinusoïdaux amortis (cloches, métal, bois). */
function partials(sr: number, dur: number, parts: [number, number, number][], attack = 0.002): Float32Array {
  const n = Math.floor(sr * dur);
  const b = new Float32Array(n);
  for (const [f, amp, decay] of parts)
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      b[i] += Math.sin(2 * Math.PI * f * t) * amp * env(t, attack, decay);
    }
  return normalize(b, 0.8);
}

function mix(...bufs: [Float32Array, number][]): Float32Array {
  const n = Math.max(...bufs.map((b) => b[0].length));
  const out = new Float32Array(n);
  for (const [b, g] of bufs) for (let i = 0; i < b.length; i++) out[i] += b[i] * g;
  return normalize(out, 0.85);
}

function sweep(sr: number, dur: number, f0: number, f1: number, wave: 'sin' | 'saw' | 'sq' | 'tri', attack: number, decay: number): Float32Array {
  const n = Math.floor(sr * dur);
  const b = new Float32Array(n);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const t = i / sr;
    const f = f0 * Math.pow(f1 / f0, t / dur);
    ph += f / sr;
    const p = ph % 1;
    const v = wave === 'sin' ? Math.sin(2 * Math.PI * p) : wave === 'saw' ? 2 * p - 1 : wave === 'sq' ? (p < 0.5 ? 1 : -1) : 1 - 4 * Math.abs(p - 0.5);
    b[i] = v * env(t, attack, decay);
  }
  return b;
}

// ---------------------------------------------------------------------------
// Matériaux : casse / pose / pas
const MATERIAL: Record<string, (sr: number, rng: Rng, kind: 'casse' | 'pose' | 'pas') => Float32Array> = {
  stone: (sr, rng, k) => mix([burst(sr, rng, k === 'pas' ? 0.12 : 0.22, 'lp', k === 'casse' ? 1400 : 1100, 1.2, 0.001, k === 'pas' ? 0.03 : 0.06), 1], [partials(sr, 0.1, [[180 + rng.next() * 60, 1, 0.03]]), 0.35]),
  wood: (sr, rng, k) => mix([partials(sr, 0.25, [[320 + rng.next() * 80, 1, 0.05], [540 + rng.next() * 80, 0.6, 0.035], [900, 0.2, 0.02]]), 1], [burst(sr, rng, 0.12, 'bp', 900, 1.5, 0.001, k === 'pas' ? 0.02 : 0.04), 0.5]),
  dirt: (sr, rng, k) => burst(sr, rng, k === 'pas' ? 0.14 : 0.25, 'lp', 650, 0.9, 0.004, k === 'pas' ? 0.04 : 0.07),
  gravel: (sr, rng, k) => mix([burst(sr, rng, 0.25, 'lp', 900, 0.8, 0.002, k === 'pas' ? 0.05 : 0.08), 1], [burst(sr, rng, 0.2, 'hp', 2500, 0.8, 0.001, 0.03), 0.3]),
  grass: (sr, rng, k) => burst(sr, rng, k === 'pas' ? 0.16 : 0.28, 'hp', 1600, 0.6, 0.01, k === 'pas' ? 0.04 : 0.08),
  plant: (sr, rng) => burst(sr, rng, 0.18, 'hp', 2400, 0.6, 0.005, 0.05, 0.6),
  sand: (sr, rng, k) => burst(sr, rng, k === 'pas' ? 0.18 : 0.3, 'bp', 3200, 0.6, 0.02, k === 'pas' ? 0.05 : 0.09, 0.6),
  snow: (sr, rng, k) => burst(sr, rng, k === 'pas' ? 0.18 : 0.3, 'lp', 1400, 0.5, 0.02, 0.07, 0.55),
  cloth: (sr, rng) => burst(sr, rng, 0.2, 'lp', 800, 0.5, 0.01, 0.05, 0.6),
  glass: (sr, rng, k) =>
    k === 'casse'
      ? mix([partials(sr, 0.6, [[2400 + rng.next() * 400, 1, 0.12], [3900, 0.6, 0.08], [5200, 0.4, 0.05], [1700, 0.4, 0.2]]), 1], [burst(sr, rng, 0.35, 'hp', 3500, 1, 0.001, 0.08), 0.8])
      : mix([partials(sr, 0.2, [[1800, 1, 0.05], [2700, 0.5, 0.03]]), 1], [burst(sr, rng, 0.1, 'hp', 3000, 1, 0.001, 0.02), 0.4]),
  metal: (sr, rng) => mix([partials(sr, 0.7, [[520 + rng.next() * 60, 1, 0.25], [1320, 0.6, 0.18], [2150, 0.35, 0.12], [3400, 0.2, 0.06]]), 1], [burst(sr, rng, 0.08, 'hp', 2000, 1, 0.001, 0.02), 0.5]),
  crystal: (sr, rng) => partials(sr, 1.0, [[1318 * (1 + rng.next() * 0.05), 1, 0.4], [1976, 0.6, 0.3], [2637, 0.4, 0.25], [3951, 0.2, 0.15]]),
  water: (sr, rng) => {
    const n = Math.floor(sr * 0.35);
    const b = new Float32Array(n);
    for (let k = 0; k < 6; k++) {
      const start = Math.floor(rng.next() * n * 0.6);
      const f0 = 300 + rng.next() * 500;
      const s = sweep(sr, 0.08, f0, f0 * 2.2, 'sin', 0.002, 0.02);
      for (let i = 0; i < s.length && start + i < n; i++) b[start + i] += s[i] * 0.5;
    }
    return normalize(b, 0.6);
  },
  lava: (sr, rng) => burst(sr, rng, 0.4, 'lp', 400, 0.8, 0.02, 0.12, 0.7),
};

function voice(kind: string, pitch: number): Gen {
  return (sr, rng) => {
    const p = pitch * (0.9 + rng.next() * 0.2);
    switch (kind) {
      case 'bleat': {
        const b = sweep(sr, 0.45, 300 * p, 260 * p, 'saw', 0.03, 0.25);
        for (let i = 0; i < b.length; i++) b[i] *= 0.6 + 0.4 * Math.sin((i / sr) * 2 * Math.PI * 18);
        return normalize(biquad(b, sr, 'lp', 1400), 0.6);
      }
      case 'chirp':
        return normalize(mix([sweep(sr, 0.12, 1800 * p, 3200 * p, 'sin', 0.005, 0.05), 1], [sweep(sr, 0.1, 2200 * p, 1600 * p, 'sin', 0.005, 0.04), 0.6]), 0.5);
      case 'growl': {
        const b = sweep(sr, 0.7, 90 * p, 70 * p, 'saw', 0.05, 0.35);
        const nz = burst(sr, rng, 0.7, 'lp', 500, 1, 0.05, 0.3);
        return normalize(biquad(mix([b, 1], [nz, 0.5]), sr, 'lp', 700), 0.75);
      }
      case 'moan': {
        const b = sweep(sr, 0.9, 140 * p, 110 * p, 'saw', 0.15, 0.5);
        for (let i = 0; i < b.length; i++) b[i] *= 0.7 + 0.3 * Math.sin((i / sr) * 2 * Math.PI * 5);
        return normalize(biquad(b, sr, 'bp', 600, 2), 0.6);
      }
      case 'hiss':
        return burst(sr, rng, 0.5, 'hp', 3000 * p, 0.8, 0.05, 0.2, 0.6);
      case 'squeak':
        return normalize(sweep(sr, 0.15, 2600 * p, 3600 * p, 'sq', 0.005, 0.05), 0.35);
      case 'roar': {
        const b = sweep(sr, 1.4, 70 * p, 45 * p, 'saw', 0.1, 0.8);
        const nz = burst(sr, rng, 1.4, 'lp', 400, 1, 0.1, 0.7);
        return normalize(biquad(mix([b, 1], [nz, 0.8]), sr, 'lp', 900), 0.9);
      }
      case 'screech':
        return normalize(biquad(sweep(sr, 0.5, 900 * p, 1500 * p, 'saw', 0.01, 0.2), sr, 'bp', 1800, 3), 0.6);
      case 'hum':
        return normalize(mix([sweep(sr, 0.8, 220 * p, 230 * p, 'sin', 0.2, 0.5), 1], [sweep(sr, 0.8, 330 * p, 345 * p, 'sin', 0.2, 0.5), 0.5]), 0.5);
      case 'crackle':
        return mix([burst(sr, rng, 0.4, 'hp', 1500, 0.7, 0.01, 0.1), 1], [burst(sr, rng, 0.3, 'lp', 300, 1, 0.01, 0.1), 0.5]);
      case 'chime':
        return partials(sr, 0.9, [[880 * p, 1, 0.3], [1320 * p, 0.6, 0.25], [1760 * p, 0.3, 0.2]]);
      case 'grunt':
      default: {
        const b = sweep(sr, 0.3, 180 * p, 120 * p, 'saw', 0.01, 0.12);
        return normalize(biquad(b, sr, 'lp', 900), 0.6);
      }
    }
  };
}

const SFX: Record<string, Gen> = {
  ramassage: (sr) => normalize(sweep(sr, 0.12, 600, 1400, 'sin', 0.002, 0.05), 0.5),
  coup: (sr, rng) => mix([burst(sr, rng, 0.15, 'lp', 500, 1, 0.001, 0.04), 1], [sweep(sr, 0.1, 150, 60, 'sin', 0.001, 0.05), 0.8]),
  coup_critique: (sr, rng) => mix([burst(sr, rng, 0.2, 'lp', 900, 1, 0.001, 0.05), 1], [partials(sr, 0.3, [[1200, 1, 0.08], [1800, 0.5, 0.05]]), 0.5]),
  coup_rate: (sr, rng) => burst(sr, rng, 0.2, 'bp', 1200, 0.7, 0.03, 0.05, 0.4),
  esquive: (sr, rng) => {
    const n = Math.floor(sr * 0.3);
    return normalize(biquad(noise(n, rng), sr, 'bp', (i) => 400 + (i / n) * 2400, 1.2).map((v, i) => v * env(i / sr, 0.05, 0.08)), 0.5);
  },
  tir_fleche: (sr) => mix([partials(sr, 0.3, [[140, 1, 0.08], [280, 0.5, 0.05]]), 1], [sweep(sr, 0.2, 900, 400, 'tri', 0.001, 0.05), 0.3]),
  tir_boule_feu: (sr, rng) => mix([burst(sr, rng, 0.6, 'lp', 700, 0.7, 0.05, 0.25), 1], [sweep(sr, 0.5, 200, 90, 'saw', 0.02, 0.2), 0.4]),
  tir_eclat_givre: (sr) => partials(sr, 0.5, [[1600, 1, 0.15], [2400, 0.6, 0.12], [3200, 0.4, 0.1]]),
  tir_boule_neige: (sr, rng) => burst(sr, rng, 0.15, 'bp', 1200, 0.8, 0.01, 0.04, 0.5),
  tir_bombe_spore: (sr, rng) => burst(sr, rng, 0.25, 'bp', 700, 1, 0.01, 0.06, 0.5),
  explosion: (sr, rng) => mix([burst(sr, rng, 1.6, 'lp', 220, 0.7, 0.005, 0.45), 1], [burst(sr, rng, 0.5, 'lp', 1400, 0.7, 0.001, 0.1), 0.6], [sweep(sr, 0.8, 80, 30, 'sin', 0.001, 0.3), 0.8]),
  manger: (sr, rng) => {
    const n = Math.floor(sr * 0.5);
    const b = new Float32Array(n);
    for (let k = 0; k < 3; k++) {
      const s = burst(sr, rng, 0.1, 'bp', 1400, 0.9, 0.003, 0.025);
      const st = Math.floor(k * sr * 0.15);
      for (let i = 0; i < s.length && st + i < n; i++) b[st + i] += s[i];
    }
    return normalize(b, 0.6);
  },
  boire: (sr) => {
    const n = Math.floor(sr * 0.6);
    const b = new Float32Array(n);
    for (let k = 0; k < 3; k++) {
      const s = sweep(sr, 0.12, 250, 450, 'sin', 0.01, 0.05);
      const st = Math.floor(k * sr * 0.18);
      for (let i = 0; i < s.length && st + i < n; i++) b[st + i] += s[i];
    }
    return normalize(b, 0.5);
  },
  chute: (sr, rng) => burst(sr, rng, 0.25, 'lp', 400, 0.8, 0.002, 0.06, 0.7),
  chute_lourde: (sr, rng) => mix([burst(sr, rng, 0.4, 'lp', 300, 0.8, 0.002, 0.12), 1], [sweep(sr, 0.3, 90, 40, 'sin', 0.001, 0.1), 0.8]),
  degat: (sr) => normalize(biquad(sweep(sr, 0.25, 320, 180, 'saw', 0.005, 0.1), sr, 'lp', 1200), 0.6),
  mort: (sr) => normalize(biquad(sweep(sr, 0.9, 300, 80, 'saw', 0.01, 0.4), sr, 'lp', 900), 0.6),
  porte_ouvre: (sr, rng) => mix([partials(sr, 0.35, [[220, 1, 0.08], [410, 0.5, 0.05]]), 1], [burst(sr, rng, 0.3, 'bp', 700, 2, 0.05, 0.08), 0.4]),
  porte_ferme: (sr, rng) => mix([partials(sr, 0.3, [[180, 1, 0.06], [330, 0.5, 0.04]]), 1], [burst(sr, rng, 0.1, 'lp', 800, 1, 0.001, 0.03), 0.8]),
  coffre_ouvre: (sr, rng) => mix([partials(sr, 0.5, [[150, 1, 0.15], [300, 0.4, 0.1]]), 1], [burst(sr, rng, 0.4, 'bp', 500, 3, 0.1, 0.1), 0.5]),
  levier: (sr) => partials(sr, 0.12, [[1500, 1, 0.02], [800, 0.6, 0.03]]),
  plaque: (sr) => partials(sr, 0.12, [[600, 1, 0.03]]),
  outil_casse: (sr, rng) => mix([partials(sr, 0.5, [[1800, 1, 0.1], [2600, 0.8, 0.08]]), 1], [burst(sr, rng, 0.3, 'hp', 3000, 1, 0.001, 0.05), 1]),
  portail_allume: (sr, rng) => mix([burst(sr, rng, 1.2, 'lp', 600, 1, 0.1, 0.5), 1], [sweep(sr, 1.2, 60, 180, 'saw', 0.3, 0.6), 0.5]),
  rappel: (sr) => normalize(mix([sweep(sr, 1.0, 300, 1200, 'sin', 0.1, 0.5), 1], [sweep(sr, 1.0, 450, 1800, 'sin', 0.1, 0.5), 0.5]), 0.5),
  grésillement: (sr, rng) => burst(sr, rng, 0.5, 'hp', 2800, 0.7, 0.01, 0.15, 0.6),
  seau_remplit: (sr, rng) => MATERIAL.water(sr, rng, 'pose'),
  seau_vide: (sr, rng) => MATERIAL.water(sr, rng, 'casse'),
  cueillette: (sr, rng) => MATERIAL.plant(sr, rng, 'casse'),
  eclair: (sr, rng) => mix([burst(sr, rng, 3, 'lp', 160, 0.7, 0.01, 1.1), 1], [burst(sr, rng, 0.4, 'hp', 1500, 0.7, 0.001, 0.08), 0.7]),
  toast: (sr) => partials(sr, 0.8, [[784, 1, 0.3], [1175, 0.6, 0.25]]),
  niveau: (sr) => {
    const n = Math.floor(sr * 1.4);
    const b = new Float32Array(n);
    [523, 659, 784, 1047].forEach((f, k) => {
      const s = partials(sr, 0.9, [[f, 1, 0.3], [f * 2, 0.3, 0.2]]);
      const st = Math.floor(k * sr * 0.12);
      for (let i = 0; i < s.length && st + i < n; i++) b[st + i] += s[i] * 0.6;
    });
    return normalize(b, 0.6);
  },
  clic: (sr) => partials(sr, 0.06, [[1100, 1, 0.012], [2200, 0.4, 0.008]]),
  impact_fleche: (sr, rng) => burst(sr, rng, 0.12, 'bp', 1400, 1.5, 0.001, 0.03, 0.5),
  impact_boule_feu: (sr, rng) => burst(sr, rng, 0.35, 'lp', 800, 0.8, 0.005, 0.1),
  impact_eclat_givre: (sr) => partials(sr, 0.4, [[2200, 1, 0.1], [3300, 0.5, 0.06]]),
  impact_epine: (sr, rng) => burst(sr, rng, 0.1, 'bp', 1800, 1.2, 0.001, 0.03, 0.5),
  impact_boule_neige: (sr, rng) => burst(sr, rng, 0.15, 'lp', 1400, 0.6, 0.005, 0.04, 0.5),
  impact_rayon_cristal: (sr) => partials(sr, 0.3, [[1600, 1, 0.08], [2400, 0.6, 0.06]]),
  boss_apparait: (sr, rng) => mix([voice('roar', 0.7)(sr, rng), 1], [burst(sr, rng, 2, 'lp', 120, 0.7, 0.2, 0.8), 0.6]),
  cle_tourne: (sr) => partials(sr, 0.3, [[900, 1, 0.08], [1350, 0.6, 0.06]]),
};

/** Voix des créatures : type de voix et hauteur par espèce (données). */
export const CREATURE_VOICES: Record<string, [string, number]> = {
  pelucheon: ['bleat', 1],
  picoreau: ['chirp', 1],
  carapin: ['squeak', 0.7],
  cerf_argent: ['chime', 0.8],
  ours_mousse: ['growl', 0.9],
  loup_givre: ['growl', 1.4],
  rodeur: ['moan', 1],
  epineux: ['hiss', 1.1],
  tisseuse: ['hiss', 0.8],
  chauve_furie: ['squeak', 1.2],
  vesse_explosive: ['hiss', 0.6],
  anguillame: ['hum', 1.5],
  pillard: ['grunt', 1.1],
  brasillon: ['crackle', 1],
  carapace_lave: ['growl', 0.6],
  cendreux: ['moan', 0.7],
  sentinelle_cristal: ['chime', 1.2],
  rodeur_vide: ['screech', 0.8],
  meduse_astrale: ['hum', 1],
  gardien_sylvestre: ['roar', 1.1],
  tyran_braises: ['roar', 0.8],
  veilleur_astral: ['screech', 0.5],
};

export function generator(name: string): Gen | null {
  const s = SFX[name];
  if (s) return s;
  const m = /^(casse|pose|pas)_(\w+)$/.exec(name);
  if (m && MATERIAL[m[2]]) {
    const kind = m[1] as 'casse' | 'pose' | 'pas';
    return (sr, rng) => MATERIAL[m[2]](sr, rng, kind);
  }
  const c = /^mob_(\w+?)_(idle|hurt|death|attack)$/.exec(name);
  if (c) {
    const [kind, pitch] = CREATURE_VOICES[c[1]] ?? ['grunt', 1];
    const p = c[2] === 'hurt' ? pitch * 1.25 : c[2] === 'death' ? pitch * 0.8 : c[2] === 'attack' ? pitch * 1.1 : pitch;
    return voice(kind, p);
  }
  return null;
}

/** Boucles d'ambiance. */
export const LOOPS: Record<string, Gen> = {
  pluie: (sr, rng) => {
    const n = sr * 2;
    const b = biquad(noise(n, rng), sr, 'hp', 1200, 0.5);
    for (let k = 0; k < 120; k++) {
      const st = Math.floor(rng.next() * (n - 800));
      for (let i = 0; i < 400; i++) b[st + i] += (rng.next() * 2 - 1) * Math.exp(-i / 60) * 0.8;
    }
    return normalize(b, 0.35);
  },
  vent: (sr, rng) => {
    const n = sr * 4;
    const b = biquad(noise(n, rng), sr, 'bp', (i) => 300 + 200 * Math.sin((i / n) * Math.PI * 2 * 2), 1.5);
    return normalize(b, 0.3);
  },
  grotte: (sr, rng) => {
    const n = sr * 4;
    const b = biquad(noise(n, rng), sr, 'lp', 180, 0.8);
    return normalize(b, 0.3);
  },
  lave: (sr, rng) => {
    const n = sr * 3;
    const b = biquad(noise(n, rng), sr, 'lp', 300, 0.8);
    for (let k = 0; k < 20; k++) {
      const st = Math.floor(rng.next() * (n - 3000));
      const s = sweep(sr, 0.06, 120 + rng.next() * 80, 300, 'sin', 0.005, 0.02);
      for (let i = 0; i < s.length; i++) b[st + i] += s[i] * 0.6;
    }
    return normalize(b, 0.35);
  },
  portail: (sr) => {
    const n = sr * 3;
    const b = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const t = i / sr;
      b[i] = Math.sin(2 * Math.PI * 55 * t) * 0.5 + Math.sin(2 * Math.PI * 82.5 * t + Math.sin(t * 2.1)) * 0.3 + Math.sin(2 * Math.PI * 110 * t) * 0.2 * Math.sin(t * Math.PI * 2 / 3);
    }
    return normalize(b, 0.3);
  },
};

export { normalize, partials, sweep, biquad, noise };
