// Records compact world snapshots in a ring buffer and plays the last seconds back after a goal.
export class ReplaySystem {
  constructor(world, seconds = 6, hz = 60) {
    this.world = world;
    this.hz = hz;
    this.capacity = Math.round(seconds * hz);
    this.frames = new Array(this.capacity);
    this.head = 0;
    this.size = 0;
    this.accum = 0;
    this.clip = null;
  }

  clear() {
    this.head = 0;
    this.size = 0;
    this.accum = 0;
  }

  record(simDt) {
    this.accum += simDt;
    const step = 1 / this.hz;
    if (this.accum < step) return;
    this.accum -= step;
    const slot = this.head;
    this.frames[slot] = this.world.serialize(this.frames[slot]);
    this.head = (this.head + 1) % this.capacity;
    this.size = Math.min(this.capacity, this.size + 1);
  }

  // Builds a clip of the recorded frames (oldest first).
  capture(seconds = 5.5) {
    const n = Math.min(this.size, Math.round(seconds * this.hz));
    if (n < 10) return null;
    const frames = [];
    for (let i = n; i > 0; i--) {
      const idx = (this.head - i + this.capacity * 2) % this.capacity;
      frames.push(this.frames[idx].slice());
    }
    this.clip = { frames, t: 0, duration: frames.length / this.hz };
    return this.clip;
  }

  // Advances playback; slows down at the end for drama. Returns false when finished.
  play(realDt) {
    const c = this.clip;
    if (!c) return false;
    const remaining = c.duration - c.t;
    const speed = remaining < 1.4 ? 0.45 : 1;
    c.t += realDt * speed;
    if (c.t >= c.duration) return false;
    const f = c.t * this.hz;
    const i = Math.min(c.frames.length - 1, Math.floor(f));
    this.world.applySnapshot(c.frames[i]);
    return true;
  }

  get progress() {
    return this.clip ? this.clip.t / this.clip.duration : 1;
  }
}
