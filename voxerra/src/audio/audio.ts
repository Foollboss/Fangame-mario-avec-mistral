/**
 * Moteur audio (Web Audio) : bruitages procéduraux positionnés en 3D,
 * boucles d'ambiance (pluie, vent, grottes, lave, portails) et musique
 * générative selon le contexte (jour, nuit, grotte, Abîme, Cimes, boss, menu).
 */
import { Rng } from '../engine/rng';
import { generator, LOOPS } from './synth';

export type Mood = 'menu' | 'jour' | 'nuit' | 'grotte' | 'abime' | 'astral' | 'boss' | 'silence';

interface LoopState {
  src: AudioBufferSourceNode;
  gain: GainNode;
  target: number;
}

const SCALES: Record<Mood, { root: number; scale: number[]; tempo: number; voice: 'piano' | 'pad' | 'bell' | 'pluck'; pad: boolean }> = {
  menu: { root: 57, scale: [0, 2, 4, 7, 9], tempo: 0.62, voice: 'piano', pad: true },
  jour: { root: 60, scale: [0, 2, 4, 7, 9], tempo: 0.55, voice: 'piano', pad: true },
  nuit: { root: 57, scale: [0, 3, 5, 7, 10], tempo: 0.75, voice: 'bell', pad: true },
  grotte: { root: 50, scale: [0, 1, 5, 7, 8], tempo: 1.1, voice: 'pluck', pad: true },
  abime: { root: 45, scale: [0, 1, 4, 6, 7, 10], tempo: 0.9, voice: 'pad', pad: true },
  astral: { root: 62, scale: [0, 2, 6, 7, 11], tempo: 0.7, voice: 'bell', pad: true },
  boss: { root: 48, scale: [0, 1, 3, 6, 7], tempo: 0.28, voice: 'pluck', pad: false },
  silence: { root: 60, scale: [0], tempo: 1, voice: 'piano', pad: false },
};

const midi = (n: number): number => 440 * Math.pow(2, (n - 69) / 12);

export class AudioEngine {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private sfx!: GainNode;
  private music!: GainNode;
  private reverb!: ConvolverNode;
  private reverbSend!: GainNode;
  private buffers = new Map<string, AudioBuffer[]>();
  private loops = new Map<string, LoopState>();
  private rng = new Rng(Date.now());
  volumes = { master: 0.8, music: 0.5, sfx: 0.8 };
  private mood: Mood = 'menu';
  private nextPhrase = 0;
  private phraseEnd = 0;
  private listener = { x: 0, y: 0, z: 0 };
  private recent = new Map<string, number>();

  /** À appeler lors d'un geste utilisateur (politique d'autoplay). */
  unlock(): void {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
      return;
    }
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
    } catch {
      return;
    }
    const ctx = this.ctx;
    this.master = ctx.createGain();
    this.master.connect(ctx.destination);
    this.sfx = ctx.createGain();
    this.sfx.connect(this.master);
    this.music = ctx.createGain();
    this.music.connect(this.master);
    this.reverb = ctx.createConvolver();
    this.reverb.buffer = this.impulse(2.8);
    this.reverbSend = ctx.createGain();
    this.reverbSend.gain.value = 0.35;
    this.reverbSend.connect(this.reverb);
    this.reverb.connect(this.master);
    this.applyVolumes();
    this.nextPhrase = ctx.currentTime + 1;
  }

  private impulse(sec: number): AudioBuffer {
    const ctx = this.ctx!;
    const n = Math.floor(ctx.sampleRate * sec);
    const b = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = b.getChannelData(c);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 3);
    }
    return b;
  }

  applyVolumes(): void {
    if (!this.ctx) return;
    this.master.gain.value = this.volumes.master;
    this.sfx.gain.value = this.volumes.sfx;
    this.music.gain.value = this.volumes.music * 0.55;
  }

  private buffer(name: string): AudioBuffer | null {
    if (!this.ctx) return null;
    let list = this.buffers.get(name);
    if (!list) {
      const gen = generator(name) ?? LOOPS[name];
      if (!gen) {
        this.buffers.set(name, []);
        return null;
      }
      list = [];
      const variants = LOOPS[name] ? 1 : 3;
      for (let v = 0; v < variants; v++) {
        const data = gen(this.ctx.sampleRate, new Rng(v * 7919 + name.length * 131));
        const b = this.ctx.createBuffer(1, data.length, this.ctx.sampleRate);
        b.copyToChannel(data as Float32Array<ArrayBuffer>, 0);
        list.push(b);
      }
      this.buffers.set(name, list);
    }
    return list.length ? list[Math.floor(Math.random() * list.length)] : null;
  }

  setListener(x: number, y: number, z: number, fx: number, fy: number, fz: number): void {
    this.listener = { x, y, z };
    if (!this.ctx) return;
    const l = this.ctx.listener;
    if (l.positionX) {
      l.positionX.value = x;
      l.positionY.value = y;
      l.positionZ.value = z;
      l.forwardX.value = fx;
      l.forwardY.value = fy;
      l.forwardZ.value = fz;
      l.upX.value = 0;
      l.upY.value = 1;
      l.upZ.value = 0;
    } else {
      (l as unknown as { setPosition: (a: number, b: number, c: number) => void }).setPosition(x, y, z);
    }
  }

  /** Joue un bruitage (positionné si x,y,z sont fournis). */
  play(name: string, opts: { x?: number; y?: number; z?: number; vol?: number; pitch?: number; reverb?: boolean } = {}): void {
    if (!this.ctx || this.ctx.state !== 'running') return;
    const now = this.ctx.currentTime;
    const last = this.recent.get(name) ?? -1;
    if (now - last < 0.03) return; // anti-saturation
    this.recent.set(name, now);
    if (opts.x !== undefined) {
      const d = Math.hypot(opts.x - this.listener.x, (opts.y ?? 0) - this.listener.y, (opts.z ?? 0) - this.listener.z);
      if (d > 40) return;
    }
    const buf = this.buffer(name);
    if (!buf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    src.playbackRate.value = (opts.pitch ?? 1) * (0.92 + Math.random() * 0.16);
    const g = this.ctx.createGain();
    g.gain.value = opts.vol ?? 1;
    let node: AudioNode = src;
    src.connect(g);
    node = g;
    if (opts.x !== undefined) {
      const p = this.ctx.createPanner();
      p.panningModel = 'equalpower';
      p.distanceModel = 'linear';
      p.refDistance = 2;
      p.maxDistance = 36;
      p.rolloffFactor = 1;
      if (p.positionX) {
        p.positionX.value = opts.x;
        p.positionY.value = opts.y ?? 0;
        p.positionZ.value = opts.z ?? 0;
      }
      g.connect(p);
      node = p;
    }
    node.connect(this.sfx);
    if (opts.reverb) node.connect(this.reverbSend);
    src.start();
  }

  /** Règle le volume cible d'une boucle d'ambiance (0 = arrêt progressif). */
  loop(name: string, volume: number): void {
    if (!this.ctx) return;
    let s = this.loops.get(name);
    if (!s) {
      if (volume <= 0.001) return;
      const buf = this.buffer(name);
      if (!buf) return;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      const gain = this.ctx.createGain();
      gain.gain.value = 0;
      src.connect(gain);
      gain.connect(this.sfx);
      src.start();
      s = { src, gain, target: volume };
      this.loops.set(name, s);
    }
    s.target = volume;
  }

  stopLoops(): void {
    for (const [, s] of this.loops) {
      try {
        s.src.stop();
      } catch {
        /* déjà arrêtée */
      }
    }
    this.loops.clear();
  }

  setMood(m: Mood): void {
    if (m === this.mood) return;
    this.mood = m;
    if (this.ctx && (m === 'boss' || this.phraseEnd < this.ctx.currentTime)) this.nextPhrase = Math.min(this.nextPhrase, this.ctx.currentTime + (m === 'boss' ? 0.5 : 6));
  }

  /** Mise à jour (fondus des boucles, musique générative). */
  update(dt: number): void {
    if (!this.ctx || this.ctx.state !== 'running') return;
    for (const [name, s] of this.loops) {
      const g = s.gain.gain.value;
      const ng = g + (s.target - g) * Math.min(1, dt * 1.5);
      s.gain.gain.value = ng;
      if (s.target <= 0.001 && ng < 0.002) {
        try {
          s.src.stop();
        } catch {
          /* ignore */
        }
        this.loops.delete(name);
      }
    }
    const now = this.ctx.currentTime;
    if (this.mood !== 'silence' && now >= this.nextPhrase && now >= this.phraseEnd) this.playPhrase();
  }

  /** Une phrase musicale générative (quelques mesures), puis un silence. */
  private playPhrase(): void {
    const ctx = this.ctx!;
    const cfg = SCALES[this.mood];
    const t0 = ctx.currentTime + 0.1;
    const r = this.rng;
    const bars = this.mood === 'boss' ? 16 : r.range(6, 11);
    const beat = cfg.tempo;
    const degrees = cfg.scale;
    let deg = r.int(degrees.length);
    const chordRoots = [0, 3, 4, 0, 5, 3, 4, 0].map((k) => k % degrees.length);
    for (let bar = 0; bar < bars; bar++) {
      const bt = t0 + bar * beat * 4;
      if (cfg.pad) {
        const cr = chordRoots[bar % chordRoots.length];
        for (const k of [0, 2, 4]) {
          const d = degrees[(cr + k) % degrees.length] + (cr + k >= degrees.length ? 12 : 0);
          this.note(midi(cfg.root - 12 + d), bt, beat * 4.2, 0.05, 'pad');
        }
      }
      if (this.mood === 'boss') {
        for (let s = 0; s < 8; s++) this.note(midi(cfg.root - 24 + (s % 4 === 0 ? 0 : 7)), bt + s * beat * 0.5, beat * 0.4, 0.12, 'pluck');
      }
      const notes = r.range(2, 5);
      for (let n = 0; n < notes; n++) {
        if (r.chance(0.25)) continue;
        deg = Math.max(0, Math.min(degrees.length * 2 - 1, deg + r.range(-2, 2)));
        const octave = Math.floor(deg / degrees.length) * 12;
        const f = midi(cfg.root + degrees[deg % degrees.length] + octave);
        this.note(f, bt + n * beat * (4 / notes) + r.float(0, 0.05), beat * 2.5, 0.12, cfg.voice);
      }
    }
    const len = bars * beat * 4;
    this.phraseEnd = t0 + len;
    this.nextPhrase = this.phraseEnd + (this.mood === 'boss' ? 0.2 : this.mood === 'menu' ? r.float(4, 10) : r.float(40, 120));
  }

  private note(freq: number, t: number, dur: number, vol: number, voice: 'piano' | 'pad' | 'bell' | 'pluck'): void {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.connect(this.music);
    g.connect(this.reverbSend);
    const oscs: OscillatorNode[] = [];
    const add = (type: OscillatorType, f: number, gain: number, detune = 0) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = detune;
      const og = ctx.createGain();
      og.gain.value = gain;
      o.connect(og);
      og.connect(g);
      oscs.push(o);
    };
    if (voice === 'piano') {
      add('sine', freq, 1);
      add('sine', freq * 2, 0.35);
      add('triangle', freq * 3, 0.08);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    } else if (voice === 'bell') {
      add('sine', freq, 1);
      add('sine', freq * 2.76, 0.3);
      add('sine', freq * 5.4, 0.1);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol * 0.9, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur * 1.2);
    } else if (voice === 'pluck') {
      add('triangle', freq, 1);
      add('square', freq, 0.08);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.004);
      g.gain.exponentialRampToValueAtTime(0.0008, t + Math.min(dur, 0.8));
    } else {
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 900;
      g.disconnect();
      g.connect(f);
      f.connect(this.music);
      f.connect(this.reverbSend);
      add('sawtooth', freq, 0.5, -7);
      add('sawtooth', freq, 0.5, 7);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + dur * 0.3);
      g.gain.linearRampToValueAtTime(0, t + dur);
    }
    for (const o of oscs) {
      o.start(t);
      o.stop(t + dur * 1.3 + 0.1);
    }
  }
}
