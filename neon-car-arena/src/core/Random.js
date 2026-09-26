// PRNG déterministe (mulberry32) : la simulation n'utilise jamais Math.random,
// condition nécessaire pour un futur multijoueur avec prédiction/rollback.
export class Random {
  constructor(seed = 1) { this.state = seed >>> 0; }

  next() {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  range(a, b) { return a + (b - a) * this.next(); }
  pick(arr) { return arr[Math.floor(this.next() * arr.length)]; }
}
