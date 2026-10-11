/**
 * AudioManager — sons entièrement synthétisés (Web Audio) : pas, blocs, créatures,
 * combats, ambiances (pluie, vent, grottes, oiseaux) et musique générative
 * (exploration, nuit, grottes, boss). Volumes séparés : général, musique, effets, ambiance.
 */
import type { SettingsManager } from '../core/Settings';

type Mat = 'stone' | 'wood' | 'grass' | 'gravel' | 'sand' | 'glass' | 'snow' | 'wool' | 'metal' | 'liquid' | 'plant';

export interface PlayOpts {
  x?: number;
  y?: number;
  z?: number;
  volume?: number;
  pitch?: number;
}

interface Listener {
  x: number;
  y: number;
  z: number;
  yaw: number;
}

const MAT_PARAMS: Record<Mat, { f: number; q: number; type: BiquadFilterType; dur: number; vol: number; tone?: number }> = {
  stone: { f: 900, q: 1.2, type: 'bandpass', dur: 0.09, vol: 0.55, tone: 140 },
  wood: { f: 600, q: 2, type: 'bandpass', dur: 0.1, vol: 0.55, tone: 210 },
  grass: { f: 2600, q: 0.7, type: 'highpass', dur: 0.12, vol: 0.4 },
  plant: { f: 3200, q: 0.7, type: 'highpass', dur: 0.1, vol: 0.3 },
  gravel: { f: 1500, q: 0.8, type: 'bandpass', dur: 0.14, vol: 0.5 },
  sand: { f: 1800, q: 0.5, type: 'lowpass', dur: 0.15, vol: 0.4 },
  glass: { f: 3000, q: 4, type: 'bandpass', dur: 0.12, vol: 0.45, tone: 1800 },
  snow: { f: 3500, q: 0.6, type: 'highpass', dur: 0.14, vol: 0.35 },
  wool: { f: 700, q: 0.5, type: 'lowpass', dur: 0.12, vol: 0.35 },
  metal: { f: 2400, q: 6, type: 'bandpass', dur: 0.12, vol: 0.45, tone: 620 },
  liquid: { f: 900, q: 1, type: 'lowpass', dur: 0.2, vol: 0.4 },
};

export class AudioManager {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private music!: GainNode;
  private sfx!: GainNode;
  private ambient!: GainNode;
  private reverb!: ConvolverNode;
  private reverbSend!: GainNode;
  private noise!: AudioBuffer;
  private brown!: AudioBuffer;
  listener: Listener = { x: 0, y: 0, z: 0, yaw: 0 };
  private rainNode: { src: AudioBufferSourceNode; gain: GainNode; filter: BiquadFilterNode } | null = null;
  private windNode: { src: AudioBufferSourceNode; gain: GainNode } | null = null;
  private musicTimer = 20;
  private musicMood: 'menu' | 'day' | 'night' | 'cave' | 'boss' | 'ember' | 'sky' = 'menu';
  private musicPlaying = false;
  private bossLoop: number | null = null;
  private ambientTimer = 0;
  private stopFns: Array<() => void> = [];

  constructor(private settings: SettingsManager) {
    const unlock = () => {
      this.ensure();
      if (this.ctx?.state === 'suspended') void this.ctx.resume();
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    settings.onChange(() => this.applyVolumes());
  }

  /** Crée le contexte audio au premier geste de l'utilisateur. */
  ensure(): boolean {
    if (this.ctx) return true;
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
    } catch {
      return false;
    }
    const c = this.ctx;
    this.master = c.createGain();
    this.music = c.createGain();
    this.sfx = c.createGain();
    this.ambient = c.createGain();
    this.reverb = c.createConvolver();
    this.reverbSend = c.createGain();
    this.reverbSend.gain.value = 0.25;
    this.reverb.buffer = this.impulse(2.4);
    this.music.connect(this.master);
    this.sfx.connect(this.master);
    this.ambient.connect(this.master);
    this.reverbSend.connect(this.reverb);
    this.reverb.connect(this.master);
    this.master.connect(c.destination);
    this.noise = this.makeNoise('white', 2);
    this.brown = this.makeNoise('brown', 4);
    this.applyVolumes();
    return true;
  }

  applyVolumes(): void {
    if (!this.ctx) return;
    const s = this.settings.data;
    this.master.gain.value = s.masterVolume;
    this.music.gain.value = s.musicVolume * 0.6;
    this.sfx.gain.value = s.soundVolume;
    this.ambient.gain.value = s.ambientVolume;
  }

  private makeNoise(kind: 'white' | 'brown', seconds: number): AudioBuffer {
    const c = this.ctx!;
    const n = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < n; i++) {
      const w = Math.random() * 2 - 1;
      if (kind === 'white') d[i] = w;
      else {
        last = (last + 0.02 * w) / 1.02;
        d[i] = last * 3.5;
      }
    }
    return buf;
  }

  private impulse(seconds: number): AudioBuffer {
    const c = this.ctx!;
    const n = Math.floor(c.sampleRate * seconds);
    const buf = c.createBuffer(2, n, c.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.6);
    }
    return buf;
  }

  /** Gain + panoramique selon la position de la source par rapport à l'auditeur. */
  private spatial(o: PlayOpts): { gain: number; pan: number } {
    if (o.x === undefined) return { gain: o.volume ?? 1, pan: 0 };
    const L = this.listener;
    const dx = o.x - L.x;
    const dy = (o.y ?? L.y) - L.y;
    const dz = (o.z ?? L.z) - L.z;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (d > 40) return { gain: 0, pan: 0 };
    const rightX = Math.cos(L.yaw);
    const rightZ = -Math.sin(L.yaw);
    const pan = d > 0.5 ? Math.max(-1, Math.min(1, (dx * rightX + dz * rightZ) / d)) : 0;
    return { gain: (o.volume ?? 1) / (1 + d * d * 0.012) * Math.max(0, 1 - d / 40), pan: pan * 0.8 };
  }

  private out(o: PlayOpts, bus?: GainNode, reverb = 0.15): { node: AudioNode; t: number; gain: number } | null {
    if (!this.ensure()) return null;
    const c = this.ctx!;
    if (c.state !== 'running') return null;
    const { gain, pan } = this.spatial(o);
    if (gain < 0.01) return null;
    const g = c.createGain();
    g.gain.value = gain;
    let node: AudioNode = g;
    if (pan !== 0 && c.createStereoPanner) {
      const p = c.createStereoPanner();
      p.pan.value = pan;
      g.connect(p);
      p.connect(bus ?? this.sfx);
      if (reverb > 0) {
        const r = c.createGain();
        r.gain.value = reverb;
        p.connect(r);
        r.connect(this.reverbSend);
      }
    } else {
      g.connect(bus ?? this.sfx);
      if (reverb > 0) {
        const r = c.createGain();
        r.gain.value = reverb;
        g.connect(r);
        r.connect(this.reverbSend);
      }
    }
    node = g;
    return { node, t: c.currentTime, gain };
  }

  private noiseBurst(dest: AudioNode, t: number, dur: number, type: BiquadFilterType, freq: number, q: number, vol: number, buffer?: AudioBuffer): void {
    const c = this.ctx!;
    const src = c.createBufferSource();
    src.buffer = buffer ?? this.noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.value = freq;
    f.Q.value = q;
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f);
    f.connect(g);
    g.connect(dest);
    src.start(t, Math.random() * 1.5);
    src.stop(t + dur + 0.05);
  }

  private tone(dest: AudioNode, t: number, type: OscillatorType, f0: number, f1: number, dur: number, vol: number, attack = 0.005): OscillatorNode {
    const c = this.ctx!;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(dest);
    o.start(t);
    o.stop(t + dur + 0.05);
    return o;
  }

  /** Son de matériau (pas, coup, destruction, pose). */
  material(mat: string, kind: 'step' | 'hit' | 'break' | 'place', o: PlayOpts = {}): void {
    const p = MAT_PARAMS[(mat as Mat) in MAT_PARAMS ? (mat as Mat) : 'stone'];
    const vol = kind === 'step' ? 0.35 : kind === 'hit' ? 0.4 : kind === 'break' ? 0.9 : 0.75;
    const r = this.out({ ...o, volume: (o.volume ?? 1) * vol * p.vol }, undefined, kind === 'break' ? 0.2 : 0.1);
    if (!r) return;
    const dur = p.dur * (kind === 'break' ? 2.2 : kind === 'place' ? 1.4 : 1);
    const reps = kind === 'break' ? 3 : 1;
    for (let i = 0; i < reps; i++) {
      const t = r.t + i * 0.03;
      this.noiseBurst(r.node, t, dur, p.type, p.f * (o.pitch ?? 1) * (0.9 + Math.random() * 0.2), p.q, 1);
      if (p.tone && kind !== 'step') this.tone(r.node, t, mat === 'glass' ? 'sine' : 'triangle', p.tone * (0.9 + Math.random() * 0.2), p.tone * 0.7, dur * 1.3, 0.5);
    }
    if (mat === 'glass' && kind === 'break') for (let i = 0; i < 5; i++) this.tone(r.node, r.t + Math.random() * 0.15, 'sine', 2500 + Math.random() * 2000, 2000, 0.25, 0.15);
  }

  /** Sons nommés (interface, combat, créatures, environnement). */
  play(name: string, o: PlayOpts = {}): void {
    const pitch = o.pitch ?? 1;
    const r = this.out(o, undefined, ['explode', 'thunder', 'roar', 'portal', 'boss_hit'].includes(name) ? 0.4 : 0.12);
    if (!r) return;
    const d = r.node;
    const t = r.t;
    const P = (f: number) => f * pitch * (0.95 + Math.random() * 0.1);
    switch (name) {
      case 'click':
        this.tone(d, t, 'square', 1400, 900, 0.04, 0.12);
        break;
      case 'pop':
        this.tone(d, t, 'sine', P(600), P(1300), 0.08, 0.35);
        break;
      case 'xp':
        this.tone(d, t, 'sine', P(1300), P(1700), 0.25, 0.2);
        this.tone(d, t + 0.05, 'sine', P(1950), P(2100), 0.2, 0.1);
        break;
      case 'levelup':
        [523, 659, 784, 1047].forEach((f, i) => this.tone(d, t + i * 0.09, 'triangle', f, f, 0.5, 0.25));
        break;
      case 'hurt':
        this.tone(d, t, 'square', P(330), P(140), 0.18, 0.25);
        this.noiseBurst(d, t, 0.1, 'lowpass', 1200, 1, 0.5);
        break;
      case 'hit':
        this.noiseBurst(d, t, 0.12, 'lowpass', 900, 1, 0.9);
        this.tone(d, t, 'sine', P(160), 60, 0.12, 0.6);
        break;
      case 'crit':
        this.noiseBurst(d, t, 0.15, 'highpass', 3000, 1, 0.5);
        this.tone(d, t, 'sine', 140, 50, 0.15, 0.7);
        break;
      case 'swing':
        this.noiseBurst(d, t, 0.12, 'bandpass', 2400, 0.8, 0.25);
        break;
      case 'eat':
        for (let i = 0; i < 3; i++) this.noiseBurst(d, t + i * 0.13, 0.08, 'bandpass', P(1800), 2, 0.5);
        break;
      case 'burp':
        this.tone(d, t, 'sawtooth', 110, 80, 0.3, 0.2);
        break;
      case 'splash':
        this.noiseBurst(d, t, 0.6, 'lowpass', 1600, 0.7, 0.9);
        this.noiseBurst(d, t + 0.05, 0.35, 'bandpass', 3000, 1, 0.4);
        break;
      case 'swim':
        this.noiseBurst(d, t, 0.25, 'lowpass', 900, 1, 0.3);
        break;
      case 'explode':
        this.noiseBurst(d, t, 2.2, 'lowpass', 700, 0.5, 1.6, this.brown);
        this.noiseBurst(d, t, 0.6, 'lowpass', 2500, 0.5, 1.2);
        this.tone(d, t, 'sine', 70, 30, 1.2, 0.9);
        break;
      case 'fuse':
        this.noiseBurst(d, t, 1.5, 'highpass', 4000, 0.5, 0.35);
        break;
      case 'door_open':
      case 'door_close':
        this.tone(d, t, 'sawtooth', P(name === 'door_open' ? 180 : 140), P(name === 'door_open' ? 260 : 100), 0.25, 0.08);
        this.noiseBurst(d, t + (name === 'door_close' ? 0.15 : 0), 0.08, 'bandpass', 500, 2, 0.6);
        break;
      case 'chest_open':
        this.tone(d, t, 'sawtooth', 120, 200, 0.35, 0.07);
        this.noiseBurst(d, t, 0.2, 'bandpass', 700, 1, 0.3);
        break;
      case 'chest_close':
        this.noiseBurst(d, t, 0.12, 'bandpass', 400, 2, 0.7);
        break;
      case 'lever':
        this.tone(d, t, 'square', 900, 700, 0.04, 0.2);
        break;
      case 'bow':
        this.tone(d, t, 'triangle', P(320), P(160), 0.22, 0.4);
        this.noiseBurst(d, t, 0.1, 'bandpass', 2000, 1, 0.2);
        break;
      case 'arrow_hit':
        this.noiseBurst(d, t, 0.08, 'bandpass', 1200, 2, 0.6);
        this.tone(d, t, 'triangle', 300, 200, 0.12, 0.3);
        break;
      case 'fire':
        for (let i = 0; i < 6; i++) this.noiseBurst(d, t + Math.random() * 0.6, 0.03, 'highpass', 2500, 1, 0.3);
        break;
      case 'ignite':
        this.noiseBurst(d, t, 0.3, 'highpass', 2000, 0.6, 0.5);
        this.tone(d, t, 'square', 1800, 1200, 0.05, 0.1);
        break;
      case 'portal':
        this.noiseBurst(d, t, 2.5, 'bandpass', 600, 3, 0.5);
        this.tone(d, t, 'sine', 200, 420, 2.4, 0.25, 0.6);
        break;
      case 'portal_travel':
        this.tone(d, t, 'sine', 300, 900, 1.6, 0.3, 0.3);
        this.noiseBurst(d, t, 1.6, 'bandpass', 1200, 2, 0.4);
        break;
      case 'thunder':
        this.noiseBurst(d, t, 0.25, 'highpass', 1500, 0.5, 1.2);
        this.noiseBurst(d, t + 0.05, 3.5, 'lowpass', 400, 0.5, 2, this.brown);
        this.noiseBurst(d, t + 0.6, 2.5, 'lowpass', 250, 0.5, 1.4, this.brown);
        break;
      case 'anvil':
      case 'craft':
        this.tone(d, t, 'triangle', 700, 700, 0.15, 0.25);
        this.tone(d, t + 0.07, 'triangle', 1050, 1050, 0.2, 0.18);
        break;
      case 'trade':
        this.tone(d, t, 'sine', 880, 880, 0.12, 0.2);
        this.tone(d, t + 0.1, 'sine', 1320, 1320, 0.2, 0.2);
        break;
      case 'death':
        this.tone(d, t, 'sawtooth', P(220), 60, 0.8, 0.25);
        break;
      case 'boss_hit':
        this.tone(d, t, 'sawtooth', 90, 50, 0.4, 0.4);
        this.noiseBurst(d, t, 0.3, 'lowpass', 600, 1, 1);
        break;
      case 'roar':
        this.tone(d, t, 'sawtooth', P(80), P(55), 1.6, 0.5, 0.2);
        this.noiseBurst(d, t, 1.6, 'lowpass', 500, 1, 0.9, this.brown);
        break;
      case 'shoot':
        this.noiseBurst(d, t, 0.4, 'bandpass', 900, 1, 0.6);
        this.tone(d, t, 'sine', 500, 150, 0.4, 0.3);
        break;
      case 'teleport':
        this.tone(d, t, 'sine', 400, 1600, 0.4, 0.25);
        break;
      case 'shear':
        this.noiseBurst(d, t, 0.06, 'highpass', 4000, 1, 0.5);
        this.noiseBurst(d, t + 0.08, 0.06, 'highpass', 4000, 1, 0.5);
        break;
      case 'bucket_fill':
      case 'bucket_empty':
        this.noiseBurst(d, t, 0.35, 'lowpass', 1200, 1, 0.6);
        this.tone(d, t, 'sine', name === 'bucket_fill' ? 300 : 500, name === 'bucket_fill' ? 600 : 250, 0.3, 0.2);
        break;
      case 'sleep':
        [392, 330, 262].forEach((f, i) => this.tone(d, t + i * 0.25, 'sine', f, f, 0.8, 0.15));
        break;
      case 'elevator':
        this.tone(d, t, 'sine', 500, 900, 0.18, 0.25);
        break;
      case 'achievement':
        [659, 784, 988, 1319].forEach((f, i) => this.tone(d, t + i * 0.1, 'triangle', f, f, 0.6, 0.2));
        break;
      default:
        this.mob(name, d, t, pitch);
    }
  }

  /** Cris des créatures (synthèse de formants). */
  private mob(name: string, d: AudioNode, t: number, pitch: number): void {
    const c = this.ctx!;
    const kind = name.replace(/_(hurt|death|say)$/, '');
    const hurt = name.endsWith('_hurt');
    const death = name.endsWith('_death');
    const k = (hurt ? 1.25 : death ? 0.8 : 1) * pitch * (0.92 + Math.random() * 0.16);
    const dur = hurt ? 0.3 : death ? 1 : 1;
    const voice = (type: OscillatorType, f0: number, f1: number, formant: number, length: number, vol: number, vib = 0) => {
      const o = c.createOscillator();
      o.type = type;
      o.frequency.setValueAtTime(f0 * k, t);
      o.frequency.linearRampToValueAtTime(f1 * k, t + length);
      if (vib) {
        const lfo = c.createOscillator();
        lfo.frequency.value = vib;
        const lg = c.createGain();
        lg.gain.value = f0 * 0.04 * k;
        lfo.connect(lg);
        lg.connect(o.frequency);
        lfo.start(t);
        lfo.stop(t + length + 0.1);
      }
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = formant;
      f.Q.value = 2;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.05);
      g.gain.setValueAtTime(vol, t + length * 0.7);
      g.gain.exponentialRampToValueAtTime(0.0001, t + length);
      o.connect(f);
      f.connect(g);
      g.connect(d);
      o.start(t);
      o.stop(t + length + 0.05);
    };
    switch (kind) {
      case 'cow':
      case 'mooshroom':
        voice('sawtooth', 115, 92, 420, 0.9 * dur, 0.9);
        break;
      case 'sheep':
      case 'sky_sheep':
        voice('sawtooth', 320, 290, 1300, 0.6 * dur, 0.6, 9);
        break;
      case 'pig':
        voice('square', 190, 160, 800, 0.18, 0.5);
        if (!hurt) setTimeout(() => this.ctx && voice('square', 200, 170, 800, 0.15, 0.4), 0);
        break;
      case 'chicken':
      case 'parrot':
        for (let i = 0; i < (hurt ? 1 : 3); i++) this.tone(d, t + i * 0.09, 'sine', 950 * k, 700 * k, 0.06, 0.3);
        break;
      case 'horse':
        voice('sawtooth', 620, 300, 1500, 0.8 * dur, 0.5, 12);
        break;
      case 'deer':
      case 'golden_stag':
      case 'goat':
        voice('sawtooth', 420, 380, 1600, 0.5 * dur, 0.45, 7);
        break;
      case 'rabbit':
      case 'fox':
        this.tone(d, t, 'sine', 1200 * k, 800 * k, 0.12, 0.3);
        break;
      case 'dolphin':
        this.tone(d, t, 'sine', 2600 * k, 3600 * k, 0.25, 0.2);
        this.tone(d, t + 0.25, 'sine', 3200 * k, 2400 * k, 0.2, 0.15);
        break;
      case 'turtle':
      case 'cod':
      case 'frog':
        this.tone(d, t, 'sine', 300 * k, 200 * k, 0.12, 0.2);
        break;
      case 'villager':
        voice('square', 210, 250, 900, 0.35, 0.3);
        break;
      case 'village_guard':
      case 'ancient_golem':
        this.tone(d, t, 'sawtooth', 70 * k, 50 * k, 0.6, 0.4);
        this.noiseBurst(d, t, 0.3, 'bandpass', 1800, 4, 0.4);
        break;
      case 'zombie':
      case 'husk':
        voice('sawtooth', 95, 80, 500, 1.1 * dur, 0.6, 4);
        this.noiseBurst(d, t, dur, 'lowpass', 600, 1, 0.3);
        break;
      case 'skeleton':
      case 'stray':
        for (let i = 0; i < 4; i++) this.noiseBurst(d, t + i * 0.07, 0.04, 'bandpass', 2200 * k, 5, 0.6);
        break;
      case 'spider':
      case 'cave_crawler':
        this.noiseBurst(d, t, 0.6 * dur, 'highpass', 3000, 0.7, 0.4);
        voice('sawtooth', 60, 55, 300, 0.5, 0.3);
        break;
      case 'boomshroom':
        this.noiseBurst(d, t, 0.4, 'lowpass', 500, 1, 0.5);
        break;
      case 'night_wraith':
        voice('sine', 420, 360, 800, 1.2, 0.35, 5);
        break;
      case 'slime':
      case 'crystal_slime':
      case 'magma_cube':
        this.noiseBurst(d, t, 0.2, 'lowpass', 400 * k, 1, 0.6);
        this.tone(d, t, 'sine', 250 * k, 120 * k, 0.2, 0.3);
        break;
      case 'ember_salamander':
      case 'fire_spirit':
        this.noiseBurst(d, t, 0.5, 'bandpass', 900 * k, 1, 0.5);
        break;
      case 'storm_bird':
        this.tone(d, t, 'sawtooth', 1800 * k, 900 * k, 0.4, 0.2);
        break;
      case 'witch':
        voice('square', 600, 900, 1500, 0.4, 0.3, 10);
        break;
      case 'deep_guardian':
      case 'ember_sovereign':
      case 'sky_dragon':
        voice('sawtooth', 75, 55, 400, 1.5, 0.8, 3);
        this.noiseBurst(d, t, 1.5, 'lowpass', 500, 1, 0.7, this.brown);
        break;
      default:
        this.tone(d, t, 'sine', 400 * k, 300 * k, 0.2, 0.2);
    }
  }

  // ---------------------------------------------------------------- ambiances
  setListener(x: number, y: number, z: number, yaw: number): void {
    this.listener.x = x;
    this.listener.y = y;
    this.listener.z = z;
    this.listener.yaw = yaw;
  }

  /** Pluie (0..1, étouffée quand le joueur est à l'abri) et vent. */
  setWeather(rain: number, sheltered: boolean, wind: number): void {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const c = this.ctx;
    if (rain > 0.01 && !this.rainNode) {
      const src = c.createBufferSource();
      src.buffer = this.noise;
      src.loop = true;
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 2400;
      f.Q.value = 0.4;
      const g = c.createGain();
      g.gain.value = 0;
      src.connect(f);
      f.connect(g);
      g.connect(this.ambient);
      src.start();
      this.rainNode = { src, gain: g, filter: f };
    }
    if (this.rainNode) {
      const target = rain * (sheltered ? 0.25 : 0.55);
      this.rainNode.gain.gain.setTargetAtTime(target, c.currentTime, 0.5);
      this.rainNode.filter.frequency.setTargetAtTime(sheltered ? 800 : 2400, c.currentTime, 0.5);
      if (rain <= 0.01 && target < 0.01) {
        const n = this.rainNode;
        this.rainNode = null;
        setTimeout(() => n.src.stop(), 2000);
      }
    }
    if (!this.windNode) {
      const src = c.createBufferSource();
      src.buffer = this.brown;
      src.loop = true;
      const g = c.createGain();
      g.gain.value = 0;
      src.connect(g);
      g.connect(this.ambient);
      src.start();
      this.windNode = { src, gain: g };
    }
    this.windNode.gain.gain.setTargetAtTime(wind * 0.25, c.currentTime, 1);
  }

  /** Bruits d'ambiance aléatoires (oiseaux, grottes, lave…). */
  ambience(dt: number, env: { underground: boolean; dark: boolean; day: boolean; forest: boolean; nearLava: boolean; dimension: number }): void {
    this.ambientTimer -= dt;
    if (this.ambientTimer > 0 || !this.ctx || this.ctx.state !== 'running') return;
    this.ambientTimer = 4 + Math.random() * 10;
    const c = this.ctx;
    const t = c.currentTime;
    const g = c.createGain();
    g.connect(this.ambient);
    const send = c.createGain();
    send.gain.value = 0.6;
    g.connect(send);
    send.connect(this.reverbSend);
    if (env.underground && env.dark && Math.random() < 0.45) {
      // Son de grotte inquiétant
      g.gain.value = 0.18;
      const base = [110, 123, 147, 165][Math.floor(Math.random() * 4)];
      this.tone(g, t, 'sine', base, base * 0.94, 4, 0.5, 1.2);
      this.tone(g, t + 0.3, 'triangle', base * 1.5, base * 1.4, 3, 0.2, 1);
      this.noiseBurst(g, t, 3, 'lowpass', 300, 1, 0.4, this.brown);
    } else if (env.forest && env.day && !env.underground && Math.random() < 0.7) {
      g.gain.value = 0.12;
      const n = 2 + Math.floor(Math.random() * 4);
      const f = 2500 + Math.random() * 2000;
      for (let i = 0; i < n; i++) this.tone(g, t + i * 0.12, 'sine', f, f * (1.2 + Math.random() * 0.3), 0.08, 0.6);
    } else if (env.nearLava || env.dimension === 1) {
      g.gain.value = 0.2;
      for (let i = 0; i < 4; i++) this.noiseBurst(g, t + Math.random() * 1.5, 0.08, 'lowpass', 500, 1, 0.8);
    }
  }

  // ---------------------------------------------------------------- musique générative
  setMood(m: AudioManager['musicMood']): void {
    if (m === this.musicMood) return;
    const wasBoss = this.musicMood === 'boss';
    this.musicMood = m;
    if (m === 'boss') this.startBossMusic();
    else if (wasBoss) this.stopBossMusic();
    if (m === 'menu') this.musicTimer = Math.min(this.musicTimer, 2);
  }

  updateMusic(dt: number): void {
    if (!this.ctx || this.ctx.state !== 'running' || this.musicMood === 'boss') return;
    if (this.musicPlaying) return;
    this.musicTimer -= dt;
    if (this.musicTimer > 0) return;
    this.musicPlaying = true;
    const len = this.playPiece(this.musicMood);
    setTimeout(() => {
      this.musicPlaying = false;
      this.musicTimer = this.musicMood === 'menu' ? 6 : 60 + Math.random() * 120;
    }, len * 1000);
  }

  /** Compose et joue un morceau calme (accords + notes de piano). Renvoie sa durée. */
  private playPiece(mood: string): number {
    const c = this.ctx!;
    const t0 = c.currentTime + 0.2;
    const keys: Record<string, number> = { menu: 57, day: 60, night: 55, cave: 50, ember: 52, sky: 64 };
    const root = keys[mood] ?? 60;
    const minor = mood === 'night' || mood === 'cave' || mood === 'ember';
    const scale = minor ? [0, 2, 3, 5, 7, 8, 10] : [0, 2, 4, 7, 9];
    const progression = minor ? [[0, 3, 7], [-4, 0, 3], [-2, 2, 5], [-5, -1, 2]] : [[0, 4, 7], [-3, 0, 4], [5, 9, 12], [-5, -1, 2]];
    const beat = mood === 'menu' ? 0.75 : 0.9;
    const bars = 8 + Math.floor(Math.random() * 6);
    const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
    const out = c.createGain();
    out.gain.value = 0.22;
    out.connect(this.music);
    const rs = c.createGain();
    rs.gain.value = 0.9;
    out.connect(rs);
    rs.connect(this.reverbSend);
    let t = t0;
    for (let b = 0; b < bars; b++) {
      const chord = progression[b % progression.length];
      // Nappe
      for (const n of chord) {
        const f = midi(root - 12 + n);
        const o = c.createOscillator();
        o.type = 'triangle';
        o.frequency.value = f;
        const o2 = c.createOscillator();
        o2.type = 'sine';
        o2.frequency.value = f * 1.003;
        const lp = c.createBiquadFilter();
        lp.type = 'lowpass';
        lp.frequency.value = 900;
        const g = c.createGain();
        const len = beat * 4;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.12, t + len * 0.4);
        g.gain.linearRampToValueAtTime(0.0001, t + len * 1.05);
        o.connect(lp);
        o2.connect(lp);
        lp.connect(g);
        g.connect(out);
        o.start(t);
        o2.start(t);
        o.stop(t + len * 1.1);
        o2.stop(t + len * 1.1);
      }
      // Mélodie clairsemée
      for (let s = 0; s < 4; s++) {
        if (Math.random() < 0.45) continue;
        const deg = scale[Math.floor(Math.random() * scale.length)];
        const oct = Math.random() < 0.3 ? 12 : 0;
        this.piano(out, t + s * beat + (Math.random() < 0.2 ? beat / 2 : 0), midi(root + deg + oct), beat * 3);
      }
      t += beat * 4;
    }
    return t - c.currentTime + 2;
  }

  private piano(dest: AudioNode, t: number, f: number, len: number): void {
    const c = this.ctx!;
    for (const [mult, vol, type] of [
      [1, 0.25, 'triangle'],
      [2, 0.06, 'sine'],
      [3, 0.03, 'sine'],
    ] as Array<[number, number, OscillatorType]>) {
      const o = c.createOscillator();
      o.type = type;
      o.frequency.value = f * mult;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, t + len);
      o.connect(g);
      g.connect(dest);
      o.start(t);
      o.stop(t + len + 0.05);
    }
  }

  private startBossMusic(): void {
    if (!this.ensure() || this.bossLoop !== null) return;
    const c = this.ctx!;
    const out = c.createGain();
    out.gain.value = 0.3;
    out.connect(this.music);
    const bar = 1.6;
    const root = 45;
    const midi = (n: number) => 440 * Math.pow(2, (n - 69) / 12);
    let next = c.currentTime + 0.1;
    let step = 0;
    const pattern = [0, 0, 3, 0, 7, 6, 3, 2];
    const schedule = () => {
      while (next < c.currentTime + 1) {
        for (let i = 0; i < 8; i++) {
          const t = next + (i * bar) / 8;
          const n = root + pattern[i] + (step % 4 === 3 ? 5 : 0);
          this.tone(out, t, 'sawtooth', midi(n), midi(n), bar / 9, 0.3);
          if (i % 2 === 0) this.noiseBurst(out, t, 0.08, 'lowpass', 180, 1, 1.2, this.brown);
          if (i % 4 === 2) this.noiseBurst(out, t, 0.06, 'highpass', 3000, 1, 0.4);
          if (i % 2 === 1 && Math.random() < 0.6) this.tone(out, t, 'square', midi(n + 24), midi(n + 24), bar / 10, 0.05);
        }
        next += bar;
        step++;
      }
    };
    schedule();
    this.bossLoop = window.setInterval(schedule, 400);
    this.stopFns.push(() => out.disconnect());
  }

  private stopBossMusic(): void {
    if (this.bossLoop !== null) clearInterval(this.bossLoop);
    this.bossLoop = null;
    for (const f of this.stopFns) f();
    this.stopFns = [];
    this.musicTimer = 10;
  }

  stopAll(): void {
    this.stopBossMusic();
    this.setWeather(0, false, 0);
  }
}
