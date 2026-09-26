// Every sound is synthesised with WebAudio: no audio files needed.
export class Sound {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.listener = { x: 0, y: 0, z: 0, rx: 1, ry: 0, rz: 0 };
    this.engines = [];
    this.musicTimer = null;
  }

  init() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.comp = ctx.createDynamicsCompressor();
    this.comp.threshold.value = -14;
    this.comp.ratio.value = 4;
    this.master = ctx.createGain();
    this.sfx = ctx.createGain();
    this.music = ctx.createGain();
    this.sfx.connect(this.master);
    this.music.connect(this.master);
    this.master.connect(this.comp);
    this.comp.connect(ctx.destination);
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.applyVolumes();
    this.startCrowd();
  }

  applyVolumes() {
    if (!this.ctx) return;
    const s = this.settings;
    this.master.gain.value = s.volMaster;
    this.sfx.gain.value = s.volSfx;
    this.music.gain.value = s.volMusic * 0.5;
  }

  setListener(pos, right) {
    const l = this.listener;
    l.x = pos.x; l.y = pos.y; l.z = pos.z;
    l.rx = right.x; l.ry = right.y; l.rz = right.z;
  }

  spatial(pos, ref = 18) {
    if (!pos) return { gain: 1, pan: 0 };
    const l = this.listener;
    const dx = pos.x - l.x;
    const dy = pos.y - l.y;
    const dz = pos.z - l.z;
    const dist = Math.hypot(dx, dy, dz);
    const gain = ref / (ref + Math.max(0, dist - 3));
    const pan = dist > 0.01 ? Math.max(-1, Math.min(1, (dx * l.rx + dy * l.ry + dz * l.rz) / dist)) * 0.8 : 0;
    return { gain, pan };
  }

  out(pos, volume) {
    const ctx = this.ctx;
    const { gain, pan } = this.spatial(pos);
    const g = ctx.createGain();
    g.gain.value = volume * gain;
    if (ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = pan;
      g.connect(p);
      p.connect(this.sfx);
    } else g.connect(this.sfx);
    return g;
  }

  noiseSrc(dur) {
    const src = this.ctx.createBufferSource();
    src.buffer = this.noise;
    src.loop = dur > 1.9;
    src.start(this.ctx.currentTime, Math.random() * 1.5);
    src.stop(this.ctx.currentTime + dur);
    return src;
  }

  env(g, attack, decay, peak = 1) {
    const t = this.ctx.currentTime;
    g.gain.cancelScheduledValues(t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  }

  tone(type, f0, f1, dur, vol, dest) {
    const ctx = this.ctx;
    const o = ctx.createOscillator();
    o.type = type;
    const t = ctx.currentTime;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    const g = ctx.createGain();
    o.connect(g);
    g.connect(dest);
    this.env(g, 0.005, dur, vol);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  hit(pos, strength) {
    if (!this.ctx) return;
    const v = Math.min(1, 0.25 + strength / 25);
    const out = this.out(pos, v);
    this.tone('sine', 140 + strength * 3, 45, 0.25, 0.9, out);
    const n = this.noiseSrc(0.2);
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 900 + strength * 40;
    f.Q.value = 0.8;
    const g = this.ctx.createGain();
    n.connect(f); f.connect(g); g.connect(out);
    this.env(g, 0.002, 0.16, 0.8);
  }

  bounce(pos, strength) {
    if (!this.ctx) return;
    const out = this.out(pos, Math.min(0.6, strength / 30));
    this.tone('sine', 90, 40, 0.18, 0.8, out);
  }

  jump(pos) {
    if (!this.ctx) return;
    const out = this.out(pos, 0.25);
    const n = this.noiseSrc(0.3);
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.setValueAtTime(500, this.ctx.currentTime);
    f.frequency.exponentialRampToValueAtTime(2500, this.ctx.currentTime + 0.2);
    const g = this.ctx.createGain();
    n.connect(f); f.connect(g); g.connect(out);
    this.env(g, 0.01, 0.2, 0.8);
  }

  pad(pos, big) {
    if (!this.ctx) return;
    const out = this.out(pos, big ? 0.35 : 0.2);
    this.tone('triangle', big ? 520 : 880, big ? 1560 : 1320, big ? 0.35 : 0.12, 0.7, out);
  }

  bump(pos, strength) {
    if (!this.ctx) return;
    const out = this.out(pos, Math.min(0.8, strength / 15));
    this.tone('square', 120, 50, 0.15, 0.4, out);
    this.hit(pos, strength * 0.4);
  }

  explosion(pos, big) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const out = this.out(pos, big ? 1 : 0.8);
    const n = this.noiseSrc(big ? 2.5 : 1.4);
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(big ? 3000 : 2000, ctx.currentTime);
    f.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + (big ? 2.2 : 1.2));
    const g = ctx.createGain();
    n.connect(f); f.connect(g); g.connect(out);
    this.env(g, 0.005, big ? 2.2 : 1.2, 1);
    this.tone('sine', 110, 28, big ? 1.4 : 0.8, 1, out);
  }

  horn(win) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const g = ctx.createGain();
    g.connect(this.sfx);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.28, t + 0.05);
    g.gain.setValueAtTime(0.28, t + 1.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.4);
    const freqs = win ? [220, 277, 330, 440] : [196, 233, 294];
    for (const fq of freqs) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = fq;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 5;
      const lg = ctx.createGain();
      lg.gain.value = 3;
      lfo.connect(lg); lg.connect(o.frequency);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 1800;
      o.connect(f); f.connect(g);
      o.start(t); lfo.start(t);
      o.stop(t + 2.5); lfo.stop(t + 2.5);
    }
    this.cheer(3.5);
  }

  cheer(dur = 2.5) {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const n = this.noiseSrc(dur + 0.5);
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1200;
    f.Q.value = 0.5;
    const g = ctx.createGain();
    const t = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.5, t + 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(f); f.connect(g); g.connect(this.sfx);
  }

  beep(high) {
    if (!this.ctx) return;
    this.tone('square', high ? 880 : 440, high ? 880 : 440, high ? 0.5 : 0.18, 0.18, this.sfx);
  }

  click() {
    if (!this.ctx) return;
    this.tone('triangle', 1200, 900, 0.05, 0.12, this.sfx);
  }

  startCrowd() {
    const ctx = this.ctx;
    const n = ctx.createBufferSource();
    n.buffer = this.noise;
    n.loop = true;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 700;
    f.Q.value = 0.4;
    this.crowdGain = ctx.createGain();
    this.crowdGain.gain.value = 0;
    n.connect(f); f.connect(this.crowdGain); this.crowdGain.connect(this.sfx);
    n.start();
  }

  setCrowd(level) {
    if (!this.ctx || !this.crowdGain) return;
    this.crowdGain.gain.setTargetAtTime(level * 0.12, this.ctx.currentTime, 0.4);
  }

  // One engine voice per local player.
  engine(i) {
    if (!this.ctx) return null;
    if (this.engines[i]) return this.engines[i];
    const ctx = this.ctx;
    const o1 = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    o1.type = 'sawtooth';
    o2.type = 'square';
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = 600;
    const g = ctx.createGain();
    g.gain.value = 0;
    o1.connect(f); o2.connect(f); f.connect(g); g.connect(this.sfx);
    const bn = ctx.createBufferSource();
    bn.buffer = this.noise;
    bn.loop = true;
    const bf = ctx.createBiquadFilter();
    bf.type = 'bandpass';
    bf.frequency.value = 600;
    bf.Q.value = 0.7;
    const bg = ctx.createGain();
    bg.gain.value = 0;
    bn.connect(bf); bf.connect(bg); bg.connect(this.sfx);
    o1.start(); o2.start(); bn.start();
    const e = { o1, o2, f, g, bf, bg };
    this.engines[i] = e;
    return e;
  }

  updateEngine(i, speed, throttle, boosting, onGround, active, count) {
    const e = this.engine(i);
    if (!e) return;
    const t = this.ctx.currentTime;
    const k = Math.min(1, speed / 23);
    const base = 55 + k * 110 + (onGround ? 0 : 20);
    e.o1.frequency.setTargetAtTime(base, t, 0.05);
    e.o2.frequency.setTargetAtTime(base * 0.5, t, 0.05);
    e.f.frequency.setTargetAtTime(400 + k * 1400 + Math.abs(throttle) * 300, t, 0.05);
    const vol = active ? (0.05 + Math.abs(throttle) * 0.05 + k * 0.05) / Math.sqrt(count) : 0;
    e.g.gain.setTargetAtTime(vol, t, 0.08);
    e.bg.gain.setTargetAtTime(active && boosting ? 0.35 / Math.sqrt(count) : 0, t, 0.04);
    e.bf.frequency.setTargetAtTime(500 + k * 900, t, 0.1);
  }

  silenceEngines() {
    for (let i = 0; i < this.engines.length; i++) if (this.engines[i]) this.updateEngine(i, 0, 0, false, true, false, 1);
  }

  // Small synthwave loop for the menus.
  startMusic() {
    if (!this.ctx || this.musicTimer) return;
    const ctx = this.ctx;
    const bpm = 112;
    const step = 60 / bpm / 4;
    const chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
    const midi = (m) => 440 * Math.pow(2, (m - 69) / 12);
    let next = ctx.currentTime + 0.1;
    let s = 0;
    const schedule = () => {
      while (next < ctx.currentTime + 0.25) {
        const bar = Math.floor(s / 16) % 4;
        const ch = chords[bar];
        const i = s % 16;
        const t = next;
        // Kick
        if (i % 4 === 0) {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.frequency.setValueAtTime(120, t);
          o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
          g.gain.setValueAtTime(0.5, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          o.connect(g); g.connect(this.music);
          o.start(t); o.stop(t + 0.25);
        }
        // Hat
        if (i % 2 === 1) {
          const n = ctx.createBufferSource();
          n.buffer = this.noise;
          const f = ctx.createBiquadFilter();
          f.type = 'highpass';
          f.frequency.value = 7000;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.08, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          n.connect(f); f.connect(g); g.connect(this.music);
          n.start(t, Math.random()); n.stop(t + 0.06);
        }
        // Bass
        if (i % 2 === 0) {
          const o = ctx.createOscillator();
          o.type = 'sawtooth';
          o.frequency.value = midi(ch[0] - 24);
          const f = ctx.createBiquadFilter();
          f.type = 'lowpass';
          f.frequency.value = 500;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.12, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + step * 1.8);
          o.connect(f); f.connect(g); g.connect(this.music);
          o.start(t); o.stop(t + step * 2);
        }
        // Arpeggio
        {
          const o = ctx.createOscillator();
          o.type = 'square';
          o.frequency.value = midi(ch[i % 3] + (i % 8 < 4 ? 12 : 24));
          const f = ctx.createBiquadFilter();
          f.type = 'lowpass';
          f.frequency.value = 2200;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0.035, t);
          g.gain.exponentialRampToValueAtTime(0.001, t + step * 0.9);
          o.connect(f); f.connect(g); g.connect(this.music);
          o.start(t); o.stop(t + step);
        }
        next += step;
        s++;
      }
    };
    this.musicTimer = setInterval(schedule, 60);
    schedule();
  }

  stopMusic() {
    if (this.musicTimer) clearInterval(this.musicTimer);
    this.musicTimer = null;
  }
}
