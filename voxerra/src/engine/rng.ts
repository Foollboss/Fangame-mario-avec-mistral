/** Générateurs pseudo-aléatoires déterministes (graine => même monde). */

/** Mélange 32 bits (murmur3 fmix). */
export function fmix32(h: number): number {
  h ^= h >>> 16;
  h = Math.imul(h, 0x85ebca6b);
  h ^= h >>> 13;
  h = Math.imul(h, 0xc2b2ae35);
  h ^= h >>> 16;
  return h >>> 0;
}

/** Hachage d'une graine et de coordonnées entières -> uint32. */
export function hash3(seed: number, x: number, y: number, z: number): number {
  let h = fmix32(seed ^ 0x9e3779b9);
  h = fmix32(h ^ Math.imul(x | 0, 0x27d4eb2d));
  h = fmix32(h ^ Math.imul(y | 0, 0x165667b1));
  h = fmix32(h ^ Math.imul(z | 0, 0x2f78d0a5));
  return h;
}

export function hash2(seed: number, x: number, z: number): number {
  return hash3(seed, x, 0x5bd1e995, z);
}

/** Valeur flottante [0,1) à partir d'un hachage. */
export const hashFloat = (h: number): number => (h >>> 0) / 4294967296;

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return fmix32(h);
}

/** Convertit une graine saisie par le joueur en entier 32 bits. */
export function seedFromString(input: string): number {
  const t = input.trim();
  if (t === '') return (Math.random() * 0xffffffff) >>> 0;
  if (/^-?\d+$/.test(t)) {
    const n = Number(t);
    if (Number.isSafeInteger(n)) return n >>> 0;
  }
  return hashString(t);
}

/** PRNG sfc32 : rapide et de bonne qualité. */
export class Rng {
  private a: number;
  private b: number;
  private c: number;
  private d: number;

  constructor(seed: number) {
    this.a = fmix32(seed ^ 0xdeadbeef);
    this.b = fmix32(seed + 0x41c64e6d);
    this.c = fmix32(seed ^ 0x12345678);
    this.d = 1;
    for (let i = 0; i < 12; i++) this.nextU32();
  }

  nextU32(): number {
    const t = (((this.a + this.b) | 0) + this.d) | 0;
    this.d = (this.d + 1) | 0;
    this.a = this.b ^ (this.b >>> 9);
    this.b = (this.c + (this.c << 3)) | 0;
    this.c = (this.c << 21) | (this.c >>> 11);
    this.c = (this.c + t) | 0;
    return t >>> 0;
  }

  /** [0,1) */
  next(): number {
    return this.nextU32() / 4294967296;
  }
  /** Entier dans [0, n) */
  int(n: number): number {
    return Math.floor(this.next() * n);
  }
  /** Entier dans [a, b] */
  range(a: number, b: number): number {
    return a + Math.floor(this.next() * (b - a + 1));
  }
  float(a: number, b: number): number {
    return a + this.next() * (b - a);
  }
  chance(p: number): boolean {
    return this.next() < p;
  }
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
  /** Choix pondéré : objets avec un champ weight. */
  weighted<T extends { weight?: number }>(arr: readonly T[]): T {
    let total = 0;
    for (const e of arr) total += e.weight ?? 1;
    let r = this.next() * total;
    for (const e of arr) {
      r -= e.weight ?? 1;
      if (r <= 0) return e;
    }
    return arr[arr.length - 1];
  }
  shuffle<T>(arr: T[]): T[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      const t = arr[i];
      arr[i] = arr[j];
      arr[j] = t;
    }
    return arr;
  }
}
