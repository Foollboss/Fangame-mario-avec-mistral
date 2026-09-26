// Musique de menu synthwave originale, générée en temps réel (aucun fichier audio).
const PROGRESSION = [
  [57, 60, 64], // la mineur
  [53, 57, 60], // fa majeur
  [48, 52, 55], // do majeur
  [55, 59, 62], // sol majeur
];
const BASS_PATTERN = [0, 0, 12, 0, 0, 12, 0, 7];
const ARP = [0, 1, 2, 1, 2, 0, 2, 1, 0, 2, 1, 2, 0, 1, 2, 3];
const LEAD = [
  [12, -1, -1, 14, 15, -1, 14, 12, -1, -1, 10, -1, 12, -1, -1, -1],
  [8, -1, -1, 10, 12, -1, 10, 8, -1, -1, 7, -1, 8, -1, 5, -1],
  [7, -1, -1, 12, 10, -1, 8, 7, -1, -1, 5, -1, 7, -1, -1, -1],
  [7, -1, 10, -1, 11, -1, 14, -1, 12, -1, 11, -1, 7, -1, -1, -1],
];

const midi = (n) => 440 * 2 ** ((n - 69) / 12);

export class MusicGenerator {
  constructor(ctx, out, noise) {
    this.ctx = ctx;
    this.noise = noise;
    this.out = ctx.createGain();
    this.out.gain.value = 0;
    this.out.connect(out);
    this.delay = ctx.createDelay(1);
    this.delay.delayTime.value = 60 / 108 * 0.75;
    const fb = ctx.createGain(); fb.gain.value = 0.32;
    const wet = ctx.createGain(); wet.gain.value = 0.35;
    this.delay.connect(fb).connect(this.delay);
    this.delay.connect(wet).connect(this.out);
    this.bpm = 108;
    this.step = 0;
    this.nextTime = 0;
    this.timer = null;
    this.playing = false;
  }

  start() {
    if (this.playing) return;
    this.playing = true;
    const t = this.ctx.currentTime;
    this.out.gain.cancelScheduledValues(t);
    this.out.gain.setValueAtTime(this.out.gain.value, t);
    this.out.gain.linearRampToValueAtTime(0.55, t + 1.5);
    this.nextTime = t + 0.1;
    this.timer = setInterval(() => this.schedule(), 30);
  }

  stop() {
    if (!this.playing) return;
    this.playing = false;
    const t = this.ctx.currentTime;
    this.out.gain.cancelScheduledValues(t);
    this.out.gain.setValueAtTime(this.out.gain.value, t);
    this.out.gain.linearRampToValueAtTime(0, t + 0.8);
    setTimeout(() => { if (!this.playing) clearInterval(this.timer); }, 900);
  }

  schedule() {
    const sixteenth = 60 / this.bpm / 4;
    while (this.nextTime < this.ctx.currentTime + 0.15) {
      this.play(this.step, this.nextTime, sixteenth);
      this.nextTime += sixteenth;
      this.step = (this.step + 1) % (16 * 16);
    }
  }

  play(step, t, dur) {
    const bar = Math.floor(step / 16) % 4;
    const section = Math.floor(step / 64) % 4; // intro / couplet / refrain / pont
    const s = step % 16;
    const chord = PROGRESSION[bar];
    if (s % 4 === 0 && section > 0) this.kick(t);
    if (s % 8 === 4 && section > 0) this.snare(t);
    if (s % 2 === 1) this.hat(t, s % 4 === 3 ? 0.05 : 0.03);
    if (s % 2 === 0) this.bass(midi(chord[0] - 24 + BASS_PATTERN[(s / 2) % 8]), t, dur * 1.8);
    if (s === 0) this.pad(chord, t, dur * 16);
    if (section !== 0) {
      const ai = ARP[s];
      const note = ai < 3 ? chord[ai] + 12 : chord[0] + 24;
      this.arp(midi(note), t, dur * 0.9);
    }
    if (section === 2) {
      const l = LEAD[bar][s];
      if (l >= 0) this.lead(midi(57 + l), t, dur * 2.5);
    }
  }

  env(g, t, a, peak, d, sus = 0.0001) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(Math.max(sus, 0.0001), t + a + d);
  }

  kick(t) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    this.env(g, t, 0.003, 0.9, 0.25);
    o.connect(g).connect(this.out);
    o.start(t); o.stop(t + 0.3);
  }

  snare(t) {
    const n = this.ctx.createBufferSource(); n.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.8;
    const g = this.ctx.createGain();
    this.env(g, t, 0.002, 0.35, 0.18);
    n.connect(f).connect(g).connect(this.out);
    n.start(t, Math.random()); n.stop(t + 0.22);
  }

  hat(t, v) {
    const n = this.ctx.createBufferSource(); n.buffer = this.noise;
    const f = this.ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7500;
    const g = this.ctx.createGain();
    this.env(g, t, 0.001, v, 0.05);
    n.connect(f).connect(g).connect(this.out);
    n.start(t, Math.random()); n.stop(t + 0.07);
  }

  bass(freq, t, d) {
    const o = this.ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = freq;
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(220, t + d);
    const g = this.ctx.createGain();
    this.env(g, t, 0.005, 0.22, d);
    o.connect(f).connect(g).connect(this.out);
    o.start(t); o.stop(t + d + 0.05);
  }

  pad(chord, t, d) {
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 1400;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.6);
    g.gain.linearRampToValueAtTime(0.0001, t + d);
    f.connect(g).connect(this.out);
    for (const n of chord) {
      for (const det of [-7, 7]) {
        const o = this.ctx.createOscillator(); o.type = 'sawtooth';
        o.frequency.value = midi(n); o.detune.value = det;
        o.connect(f);
        o.start(t); o.stop(t + d + 0.05);
      }
    }
  }

  arp(freq, t, d) {
    const o = this.ctx.createOscillator(); o.type = 'square'; o.frequency.value = freq;
    const f = this.ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2600;
    const g = this.ctx.createGain();
    this.env(g, t, 0.003, 0.045, d);
    o.connect(f).connect(g);
    g.connect(this.out); g.connect(this.delay);
    o.start(t); o.stop(t + d + 0.05);
  }

  lead(freq, t, d) {
    const o = this.ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = freq;
    const vib = this.ctx.createOscillator(); vib.frequency.value = 5.5;
    const vg = this.ctx.createGain(); vg.gain.value = 4;
    vib.connect(vg).connect(o.frequency);
    const g = this.ctx.createGain();
    this.env(g, t, 0.02, 0.12, d);
    o.connect(g); g.connect(this.out); g.connect(this.delay);
    o.start(t); vib.start(t); o.stop(t + d + 0.1); vib.stop(t + d + 0.1);
  }
}
