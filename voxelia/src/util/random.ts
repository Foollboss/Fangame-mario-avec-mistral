/** Générateurs pseudo-aléatoires déterministes (identiques sur toutes les plateformes). */

/** Hache une chaîne en entier 32 bits (FNV-1a). */
export function hashString(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Convertit une graine saisie par le joueur (texte ou nombre) en entier 32 bits. */
export function seedFromInput(input: string): number {
  const t = input.trim();
  if (t === '') return (Math.random() * 0xffffffff) >>> 0;
  if (/^-?\d+$/.test(t)) {
    // Les grands nombres sont repliés sur 32 bits de façon stable.
    let h = 0;
    for (let i = 0; i < t.length; i++) h = (Math.imul(h, 31) + t.charCodeAt(i)) | 0;
    const n = Number(t);
    return Number.isSafeInteger(n) && Math.abs(n) < 2 ** 31 ? n >>> 0 : h >>> 0;
  }
  return hashString(t);
}

/** Mélange d'entiers (coordonnées + graine) vers 32 bits bien distribués. */
export function hash3(seed: number, x: number, y: number, z: number): number {
  let h = seed ^ Math.imul(x, 0x27d4eb2d) ^ Math.imul(y, 0x165667b1) ^ Math.imul(z, 0x9e3779b1);
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b);
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35);
  return (h ^ (h >>> 16)) >>> 0;
}

export function hash2(seed: number, x: number, z: number): number {
  return hash3(seed, x, 0x5bd1e995, z);
}

/** Valeur dans [0,1) à partir des coordonnées. */
export function rand2(seed: number, x: number, z: number): number {
  return hash2(seed, x, z) / 4294967296;
}

export function rand3(seed: number, x: number, y: number, z: number): number {
  return hash3(seed, x, y, z) / 4294967296;
}

/** PRNG séquentiel (mulberry32). */
export class Rng {
  private s: number;
  constructor(seed: number) {
    this.s = seed >>> 0 || 0x9e3779b9;
  }
  next(): number {
    let t = (this.s = (this.s + 0x6d2b79f5) >>> 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  int(min: number, maxInclusive: number): number {
    return min + Math.floor(this.next() * (maxInclusive - min + 1));
  }
  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
  chance(p: number): boolean {
    return this.next() < p;
  }
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}
