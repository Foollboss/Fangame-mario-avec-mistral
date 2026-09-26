import { MusicGenerator } from './MusicGenerator.js';
import { clamp } from '../core/math.js';

// Effets sonores synthétisés (moteur, boost, chocs, rebonds, buts, foule, menus) + musique.
// Le contexte audio n'est créé qu'après un premier geste de l'utilisateur (contrainte mobile).
export class AudioManager {
  constructor(settings) {
    this.settings = settings;
    this.ctx = null;
    this.listener = { x: 0, y: 0, z: 0 };
    this.engineWave = { wave: 'sawtooth', base: 48, range: 140 };
  }

  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.sfx = ctx.createGain();
    this.musicBus = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    this.sfx.connect(this.master);
    this.musicBus.connect(this.master);
    this.master.connect(comp).connect(ctx.destination);
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.music = new MusicGenerator(ctx, this.musicBus, this.noise);
    this.applyVolumes();
    this.buildLoops();
    if (this.wantMusic) this.music.start();
  }

  applyVolumes() {
    if (!this.ctx) return;
    const s = this.settings;
    this.master.gain.value = s.master ?? 0.8;
    this.sfx.gain.value = s.sfx ?? 0.9;
    this.musicBus.gain.value = s.music ?? 0.6;
  }

  buildLoops() {
    const ctx = this.ctx;
    // Moteur
    this.engOsc = ctx.createOscillator();
    this.engSub = ctx.createOscillator();
    this.engSub.type = 'sine';
    this.engFilter = ctx.createBiquadFilter();
    this.engFilter.type = 'lowpass';
    this.engFilter.frequency.value = 700;
    this.engGain = ctx.createGain();
    this.engGain.gain.value = 0;
    this.engOsc.connect(this.engFilter);
    this.engSub.connect(this.engFilter);
    this.engFilter.connect(this.engGain).connect(this.sfx);
    this.engOsc.start(); this.engSub.start();
    this.setEngine(this.engineWave);
    // Boost
    this.boostSrc = this.loopNoise();
    this.boostFilter = ctx.createBiquadFilter();
    this.boostFilter.type = 'bandpass';
    this.boostFilter.frequency.value = 900;
    this.boostFilter.Q.value = 0.7;
    this.boostGain = ctx.createGain();
    this.boostGain.gain.value = 0;
    this.boostSrc.connect(this.boostFilter).connect(this.boostGain).connect(this.sfx);
    // Foule
    this.crowdSrc = this.loopNoise();
    this.crowdFilter = ctx.createBiquadFilter();
    this.crowdFilter.type = 'bandpass';
    this.crowdFilter.frequency.value = 600;
    this.crowdFilter.Q.value = 0.4;
    this.crowdGain = ctx.createGain();
    this.crowdGain.gain.value = 0;
    this.crowdSrc.connect(this.crowdFilter).connect(this.crowdGain).connect(this.sfx);
  }

  loopNoise() {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    s.loop = true;
    s.start(0, Math.random() * 1.5);
    return s;
  }

  setEngine(data) {
    this.engineWave = data;
    if (!this.engOsc) return;
    this.engOsc.type = data.wave;
  }

  setListener(p) { this.listener.x = p.x; this.listener.y = p.y; this.listener.z = p.z; }

  att(pos) {
    if (!pos) return 1;
    const d = Math.hypot(pos.x - this.listener.x, pos.y - this.listener.y, pos.z - this.listener.z);
    return clamp(1.2 - d / 140, 0.08, 1);
  }

  // Mise à jour continue : moteur / boost / foule
  update(state) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const e = this.engineWave;
    if (state) {
      const f = e.base + e.range * clamp(state.speedRatio, 0, 1.2) + (state.boosting ? 20 : 0);
      this.engOsc.frequency.setTargetAtTime(f, t, 0.06);
      this.engSub.frequency.setTargetAtTime(f / 2, t, 0.06);
      this.engFilter.frequency.setTargetAtTime(500 + 1800 * clamp(state.throttle, 0, 1) + 800 * state.speedRatio, t, 0.1);
      this.engGain.gain.setTargetAtTime(state.active ? 0.05 + 0.06 * Math.abs(state.throttle) : 0, t, 0.08);
      this.boostGain.gain.setTargetAtTime(state.active && state.boosting ? 0.22 : 0, t, 0.05);
      this.crowdGain.gain.setTargetAtTime(state.active ? 0.035 + state.excitement * 0.12 : 0, t, 0.4);
    } else {
      this.engGain.gain.setTargetAtTime(0, t, 0.1);
      this.boostGain.gain.setTargetAtTime(0, t, 0.05);
      this.crowdGain.gain.setTargetAtTime(0, t, 0.3);
    }
  }

  setMusic(on) {
    this.wantMusic = on;
    if (!this.music) return;
    on ? this.music.start() : this.music.stop();
  }

  // ---------- Sons ponctuels ----------
  tone(freq, dur, { type = 'sine', vol = 0.3, to = null, delay = 0 } = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(this.sfx);
    o.start(t); o.stop(t + dur + 0.02);
  }

  noiseHit(dur, freq, vol, type = 'lowpass', q = 0.7) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    const n = this.ctx.createBufferSource(); n.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(f).connect(g).connect(this.sfx);
    n.start(t, Math.random()); n.stop(t + dur + 0.02);
  }

  ballHit(strength, pos) {
    const v = clamp(strength / 60, 0.1, 1) * this.att(pos);
    this.tone(180 + strength * 2, 0.18, { vol: 0.5 * v, to: 60 });
    this.noiseHit(0.12, 2400, 0.35 * v, 'bandpass', 1.2);
  }

  bounce(speed, pos) {
    const v = clamp(speed / 50, 0.05, 0.6) * this.att(pos);
    this.tone(110, 0.16, { vol: 0.4 * v, to: 50 });
  }

  bump(strength, pos) {
    const v = clamp(strength / 40, 0.1, 1) * this.att(pos);
    this.noiseHit(0.25, 1200, 0.5 * v, 'bandpass', 3);
    this.tone(90, 0.2, { type: 'square', vol: 0.12 * v, to: 40 });
  }

  jump() { this.tone(220, 0.12, { type: 'triangle', vol: 0.12, to: 440 }); }
  dash() { this.noiseHit(0.25, 700, 0.25, 'bandpass', 1.5); }
  land(speed) { this.noiseHit(0.15, 300, clamp(speed / 30, 0.05, 0.3)); }
  pickup(big) { this.tone(big ? 660 : 880, 0.12, { type: 'triangle', vol: 0.15 }); if (big) this.tone(990, 0.15, { type: 'triangle', vol: 0.12, delay: 0.07 }); }
  countdown(n) { this.tone(n === 0 ? 880 : 440, n === 0 ? 0.5 : 0.18, { type: 'square', vol: 0.12 }); }
  click() { this.tone(1200, 0.05, { type: 'triangle', vol: 0.08 }); }
  back() { this.tone(600, 0.06, { type: 'triangle', vol: 0.08 }); }
  levelUp() { [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.25, { type: 'triangle', vol: 0.15, delay: i * 0.1 })); }

  goal(ours) {
    if (!this.ctx) return;
    this.noiseHit(1.4, 400, 0.9);
    this.tone(70, 0.8, { vol: 0.6, to: 30 });
    const chord = ours ? [523, 659, 784] : [392, 466, 587];
    chord.forEach((f, i) => this.tone(f, 1.2, { type: 'sawtooth', vol: 0.06, delay: 0.15 + i * 0.03 }));
    // Clameur de la foule
    const t = this.ctx.currentTime;
    this.crowdGain.gain.cancelScheduledValues(t);
    this.crowdGain.gain.setValueAtTime(0.4, t + 0.1);
    this.crowdGain.gain.setTargetAtTime(0.05, t + 1.2, 0.8);
  }

  whistle() { this.tone(2100, 0.35, { type: 'sine', vol: 0.12 }); this.tone(2300, 0.4, { type: 'sine', vol: 0.1, delay: 0.4 }); }
}
