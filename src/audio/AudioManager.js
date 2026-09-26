// All sounds are synthesised with WebAudio: no audio files to load, tiny download.
const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.volumes = { master: 0.8, music: 0.55, sfx: 0.9 };
    this.music = null;
    this.engine = null;
    this.crowd = null;
    this.listener = { x: 0, y: 0, z: 0, rx: 1, rz: 0 };
  }

  // Must be called from a user gesture.
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ctx = (this.ctx = new Ctx());
    this.master = ctx.createGain();
    this.master.connect(ctx.destination);
    this.musicBus = ctx.createGain();
    this.sfxBus = ctx.createGain();
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -14;
    comp.ratio.value = 4;
    this.sfxBus.connect(comp);
    comp.connect(this.master);
    this.musicBus.connect(this.master);
    // Shared noise buffer
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this.enabled = true;
    this.setVolumes(this.volumes);
  }

  setVolumes(v) {
    Object.assign(this.volumes, v);
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(this.volumes.master, t, 0.05);
    this.musicBus.gain.setTargetAtTime(this.volumes.music * 0.5, t, 0.05);
    this.sfxBus.gain.setTargetAtTime(this.volumes.sfx, t, 0.05);
  }

  suspend() { this.ctx?.suspend(); }
  resume() { this.ctx?.resume(); }

  setListener(pos, right) {
    const l = this.listener;
    l.x = pos.x; l.y = pos.y; l.z = pos.z; l.rx = right.x; l.rz = right.z;
  }

  // Distance attenuation and stereo pan relative to the camera.
  spatial(pos) {
    if (!pos) return { gain: 1, pan: 0 };
    const l = this.listener;
    const dx = pos.x - l.x, dy = pos.y - l.y, dz = pos.z - l.z;
    const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
    const gain = 1 / (1 + d * 0.035);
    const pan = d > 0.01 ? Math.max(-1, Math.min(1, (dx * l.rx + dz * l.rz) / d)) : 0;
    return { gain, pan };
  }

  out(pos, level = 1) {
    const ctx = this.ctx;
    const g = ctx.createGain();
    const { gain, pan } = this.spatial(pos);
    g.gain.value = level * gain;
    if (ctx.createStereoPanner) {
      const p = ctx.createStereoPanner();
      p.pan.value = pan * 0.8;
      g.connect(p);
      p.connect(this.sfxBus);
    } else {
      g.connect(this.sfxBus);
    }
    return g;
  }

  noiseSrc() {
    const s = this.ctx.createBufferSource();
    s.buffer = this.noise;
    s.loop = true;
    return s;
  }

  // ---------- one-shots ----------
  thump(pos, strength, freq = 90) {
    if (!this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const level = Math.min(1, strength / 60);
    const out = this.out(pos, 0.25 + level * 0.9);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq * 1.8, t);
    o.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.18);
    const og = ctx.createGain();
    og.gain.setValueAtTime(1, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    o.connect(og); og.connect(out);
    o.start(t); o.stop(t + 0.3);
    const n = this.noiseSrc();
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 800 + level * 1600;
    f.Q.value = 0.8;
    const ng = ctx.createGain();
    ng.gain.setValueAtTime(0.7 * level + 0.2, t);
    ng.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    n.connect(f); f.connect(ng); ng.connect(out);
    n.start(t, Math.random()); n.stop(t + 0.15);
  }

  ballHit(pos, strength) { this.thump(pos, strength, 110); }
  bounce(pos, strength) { this.thump(pos, strength * 0.5, 70); }

  clank(pos, strength) {
    if (!this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const out = this.out(pos, Math.min(0.8, 0.2 + strength / 50));
    for (const fr of [310, 467, 733]) {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.value = fr * (0.95 + Math.random() * 0.1);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      o.connect(g); g.connect(out);
      o.start(t); o.stop(t + 0.2);
    }
    this.thump(pos, strength * 0.6, 60);
  }

  explosion(pos, big = false) {
    if (!this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const out = this.out(pos, big ? 1.2 : 0.8);
    const n = this.noiseSrc();
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.setValueAtTime(big ? 2400 : 1600, t);
    f.frequency.exponentialRampToValueAtTime(80, t + (big ? 1.6 : 0.9));
    const g = ctx.createGain();
    g.gain.setValueAtTime(1, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + (big ? 1.8 : 1));
    n.connect(f); f.connect(g); g.connect(out);
    n.start(t); n.stop(t + 2);
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(90, t);
    o.frequency.exponentialRampToValueAtTime(30, t + 0.8);
    const og = ctx.createGain();
    og.gain.setValueAtTime(0.9, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.9);
    o.connect(og); og.connect(out);
    o.start(t); o.stop(t + 1);
  }

  goalHorn() {
    if (!this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const out = this.out(null, 0.35);
    for (const n of [57, 64, 69]) {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = NOTE(n);
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = 1800;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.3, t + 0.05);
      g.gain.setValueAtTime(0.3, t + 1.1);
      g.gain.exponentialRampToValueAtTime(0.001, t + 1.6);
      o.connect(f); f.connect(g); g.connect(out);
      o.start(t); o.stop(t + 1.7);
    }
    this.crowdCheer(1);
  }

  crowdCheer(amount = 0.6) {
    if (!this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const out = this.out(null, 0.5 * amount);
    const n = this.noiseSrc();
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1100;
    f.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(1, t + 0.25);
    g.gain.exponentialRampToValueAtTime(0.001, t + 3.2);
    n.connect(f); f.connect(g); g.connect(out);
    n.start(t, Math.random()); n.stop(t + 3.3);
  }

  blip(freq = 880, dur = 0.12, type = 'sine', level = 0.3) {
    if (!this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    const g = ctx.createGain();
    g.gain.setValueAtTime(level, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g); g.connect(this.sfxBus);
    o.start(t); o.stop(t + dur + 0.02);
  }

  countdown(v) { this.blip(v > 0 ? 660 : 990, v > 0 ? 0.18 : 0.45, 'triangle', 0.35); }
  click() { this.blip(1400, 0.05, 'square', 0.08); }
  pickup(pos, big) {
    if (!this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const out = this.out(pos, big ? 0.5 : 0.25);
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(big ? 500 : 900, t);
    o.frequency.exponentialRampToValueAtTime(big ? 1500 : 1500, t + 0.15);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o.connect(g); g.connect(out);
    o.start(t); o.stop(t + 0.22);
  }

  whoosh(pos, level = 0.4) {
    if (!this.enabled) return;
    const ctx = this.ctx, t = ctx.currentTime;
    const out = this.out(pos, level);
    const n = this.noiseSrc();
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.value = 1.2;
    f.frequency.setValueAtTime(400, t);
    f.frequency.exponentialRampToValueAtTime(2000, t + 0.2);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.exponentialRampToValueAtTime(0.6, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    n.connect(f); f.connect(g); g.connect(out);
    n.start(t, Math.random()); n.stop(t + 0.32);
  }

  // ---------- loops ----------
  startEngine(engineItem) {
    if (!this.enabled) return;
    this.stopEngine();
    const ctx = this.ctx;
    const e = engineItem || { wave: 'sawtooth', base: 48, sub: 0.5 };
    const out = ctx.createGain();
    out.gain.value = 0;
    out.connect(this.sfxBus);
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 600;
    lp.connect(out);
    const o1 = ctx.createOscillator();
    o1.type = e.wave;
    o1.frequency.value = e.base;
    const g1 = ctx.createGain();
    g1.gain.value = 0.35;
    o1.connect(g1); g1.connect(lp);
    const o2 = ctx.createOscillator();
    o2.type = 'square';
    o2.frequency.value = e.base / 2;
    const g2 = ctx.createGain();
    g2.gain.value = 0.25 * e.sub;
    o2.connect(g2); g2.connect(lp);
    let whine = null;
    if (e.whine) {
      whine = ctx.createOscillator();
      whine.type = 'sine';
      const wg = ctx.createGain();
      wg.gain.value = 0.08;
      whine.connect(wg); wg.connect(out);
      whine.start();
    }
    // Boost roar
    const bn = this.noiseSrc();
    const bf = ctx.createBiquadFilter();
    bf.type = 'bandpass';
    bf.frequency.value = 700;
    bf.Q.value = 0.7;
    const bg = ctx.createGain();
    bg.gain.value = 0;
    bn.connect(bf); bf.connect(bg); bg.connect(this.sfxBus);
    let jet = null;
    if (e.noise) {
      jet = this.noiseSrc();
      const jf = ctx.createBiquadFilter();
      jf.type = 'highpass';
      jf.frequency.value = 2500;
      const jg = ctx.createGain();
      jg.gain.value = 0.05;
      jet.connect(jf); jf.connect(jg); jg.connect(out);
      jet.start();
    }
    o1.start(); o2.start(); bn.start();
    this.engine = { e, out, lp, o1, o2, whine, bg, bn, jet };
  }

  updateEngine(speed, throttle, boosting, active = true) {
    const en = this.engine;
    if (!en) return;
    const t = this.ctx.currentTime;
    const s = Math.min(1, speed / 60);
    const f = en.e.base * (1 + s * 2.6 + Math.abs(throttle) * 0.15);
    en.o1.frequency.setTargetAtTime(f, t, 0.06);
    en.o2.frequency.setTargetAtTime(f / 2, t, 0.06);
    if (en.whine) en.whine.frequency.setTargetAtTime(400 + s * 1600, t, 0.08);
    en.lp.frequency.setTargetAtTime(400 + s * 1400 + Math.abs(throttle) * 300, t, 0.08);
    en.out.gain.setTargetAtTime(active ? 0.1 + Math.abs(throttle) * 0.08 + s * 0.08 : 0, t, 0.1);
    en.bg.gain.setTargetAtTime(active && boosting ? 0.32 : 0, t, 0.05);
  }

  stopEngine() {
    const en = this.engine;
    if (!en) return;
    for (const n of [en.o1, en.o2, en.whine, en.bn, en.jet]) n && n.stop();
    en.out.disconnect();
    en.bg.disconnect();
    this.engine = null;
  }

  startCrowd() {
    if (!this.enabled || this.crowd) return;
    const ctx = this.ctx;
    const n = this.noiseSrc();
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 650;
    f.Q.value = 0.6;
    const g = ctx.createGain();
    g.gain.value = 0.05;
    n.connect(f); f.connect(g); g.connect(this.sfxBus);
    n.start();
    this.crowd = { n, g };
  }

  setCrowdExcitement(v) {
    if (!this.crowd) return;
    this.crowd.g.gain.setTargetAtTime(0.04 + v * 0.12, this.ctx.currentTime, 0.4);
  }

  stopCrowd() {
    if (!this.crowd) return;
    this.crowd.n.stop();
    this.crowd.g.disconnect();
    this.crowd = null;
  }

  // ---------- music ----------
  // Original synthwave loop in A minor (Am–F–C–G), sequenced live.
  startMusic() {
    if (!this.enabled || this.music) return;
    const ctx = this.ctx;
    const bus = ctx.createGain();
    bus.gain.value = 0;
    bus.gain.setTargetAtTime(1, ctx.currentTime, 0.8);
    bus.connect(this.musicBus);
    const delay = ctx.createDelay();
    delay.delayTime.value = (60 / 104) * 0.75;
    const fb = ctx.createGain();
    fb.gain.value = 0.32;
    const dl = ctx.createGain();
    dl.gain.value = 0.3;
    delay.connect(fb); fb.connect(delay); delay.connect(dl); dl.connect(bus);
    this.music = { bus, delay, step: 0, next: ctx.currentTime + 0.1, timer: null };
    const tick = () => {
      const m = this.music;
      if (!m) return;
      while (m.next < ctx.currentTime + 0.15) {
        this.scheduleStep(m.step, m.next);
        m.next += 60 / 104 / 4;
        m.step = (m.step + 1) % 256;
      }
    };
    this.music.timer = setInterval(tick, 30);
    tick();
  }

  stopMusic() {
    const m = this.music;
    if (!m) return;
    clearInterval(m.timer);
    const t = this.ctx.currentTime;
    m.bus.gain.setTargetAtTime(0, t, 0.3);
    setTimeout(() => m.bus.disconnect(), 1500);
    this.music = null;
  }

  scheduleStep(step, t) {
    const ctx = this.ctx;
    const bus = this.music.bus;
    const bar = Math.floor(step / 16) % 16;
    const s = step % 16;
    const chords = [[57, 60, 64], [53, 57, 60], [48, 52, 55], [55, 59, 62]];
    const chord = chords[bar % 4];
    const root = chord[0] - 12;
    const voice = (freq, type, dur, level, cutoff, dest = bus, attack = 0.005) => {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = freq;
      const f = ctx.createBiquadFilter();
      f.type = 'lowpass';
      f.frequency.value = cutoff;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(level, t + attack);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(f); f.connect(g); g.connect(dest);
      o.start(t); o.stop(t + dur + 0.05);
      return g;
    };
    // Kick on every beat, snare on 2 and 4, offbeat hats
    if (s % 4 === 0) {
      const o = ctx.createOscillator();
      o.frequency.setValueAtTime(130, t);
      o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.9, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g); g.connect(bus);
      o.start(t); o.stop(t + 0.32);
    }
    if (s === 4 || s === 12) {
      const n = this.noiseSrc();
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.7;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      n.connect(f); f.connect(g); g.connect(bus);
      n.start(t, Math.random()); n.stop(t + 0.2);
    }
    if (s % 4 === 2) {
      const n = this.noiseSrc();
      const f = ctx.createBiquadFilter();
      f.type = 'highpass'; f.frequency.value = 7000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.12, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      n.connect(f); f.connect(g); g.connect(bus);
      n.start(t, Math.random()); n.stop(t + 0.06);
    }
    // Bass: driving eighths with octave jumps
    if (s % 2 === 0) voice(NOTE(root + (s % 8 === 6 ? 12 : 0)), 'sawtooth', 0.22, 0.28, 520);
    // Arpeggio
    const arp = [chord[0], chord[1], chord[2], chord[1] + 12, chord[2], chord[0] + 12, chord[1], chord[2] + 12];
    if (bar >= 2) voice(NOTE(arp[s % 8] + 12), 'square', 0.12, 0.05, 2600, this.music.delay);
    // Pad on each bar
    if (s === 0) for (const n of chord) voice(NOTE(n), 'sawtooth', 1.9, 0.045, 1100, bus, 0.4);
    // Lead motif in the second half of the loop
    const lead = [69, 0, 72, 0, 74, 72, 69, 0, 67, 0, 64, 0, 67, 69, 0, 0];
    if (bar >= 8 && lead[s]) voice(NOTE(lead[s] + (bar % 4 === 3 ? -2 : 0)), 'triangle', 0.3, 0.12, 3000, bus, 0.01);
  }
}
