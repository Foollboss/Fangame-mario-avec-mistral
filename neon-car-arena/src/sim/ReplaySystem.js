import { Vector3, Quaternion } from 'three';
import { Snapshot } from '../net/Snapshot.js';

// Enregistre les dernières secondes du match (60 Hz) et les rejoue pour le ralenti des buts.
export class ReplaySystem {
  constructor(sim, seconds = 6, rate = 60) {
    this.sim = sim;
    this.rate = rate;
    this.frames = Math.ceil(seconds * rate);
    this.stride = Snapshot.size(sim.cars.length);
    this.buf = new Float32Array(this.frames * this.stride);
    this.count = 0;
    this.head = 0;
    this.acc = 0;
    this.view = {
      time: 0,
      ball: { pos: new Vector3(), quat: new Quaternion() },
      cars: sim.cars.map((c) => ({ id: c.id, pos: new Vector3(), quat: new Quaternion(), boosting: false, supersonic: false, onGround: true, steer: 0, boost: 0, speed: 0 })),
    };
    this.playing = false;
  }

  clear() { this.count = 0; this.head = 0; this.acc = 0; }

  record(dt) {
    this.acc += dt;
    if (this.acc < 1 / this.rate) return;
    this.acc -= 1 / this.rate;
    Snapshot.write(this.sim, this.buf, this.head * this.stride);
    this.head = (this.head + 1) % this.frames;
    this.count = Math.min(this.count + 1, this.frames);
  }

  // Démarre la lecture des `seconds` dernières secondes enregistrées.
  start(seconds) {
    const n = Math.min(this.count, Math.floor(seconds * this.rate));
    if (n < 10) return false;
    this.playFrames = n;
    this.cursor = 0;
    this.playing = true;
    return true;
  }

  // Avance de dt secondes (temps de replay). Retourne false quand c'est terminé.
  advance(dt) {
    if (!this.playing) return false;
    this.cursor += dt * this.rate;
    if (this.cursor >= this.playFrames - 1) { this.playing = false; return false; }
    const i0 = Math.floor(this.cursor);
    const t = this.cursor - i0;
    const idx = (k) => ((this.head - this.playFrames + k) % this.frames + this.frames) % this.frames;
    Snapshot.lerp(this.buf, idx(i0) * this.stride, this.buf, idx(i0 + 1) * this.stride, t, this.view);
    return true;
  }

  progress() { return this.playing ? this.cursor / (this.playFrames - 1) : 1; }
}
