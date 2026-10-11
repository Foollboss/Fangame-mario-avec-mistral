/** Petite toile RGBA 16x16 (ou autre) pour peindre les textures procédurales pixel par pixel. */
import { Rng, hashString } from '../../util/random';

export type RGB = [number, number, number];

export function hex(c: number): RGB {
  return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
}

export function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function scale(c: RGB, f: number): RGB {
  return [c[0] * f, c[1] * f, c[2] * f];
}

export class Pixmap {
  data: Uint8ClampedArray;
  rng: Rng;
  constructor(
    public w = 16,
    public h = 16,
    seedName = 'x',
  ) {
    this.data = new Uint8ClampedArray(w * h * 4);
    this.rng = new Rng(hashString(seedName));
  }

  set(x: number, y: number, c: RGB, a = 255): void {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    const i = (y * this.w + x) * 4;
    this.data[i] = c[0];
    this.data[i + 1] = c[1];
    this.data[i + 2] = c[2];
    this.data[i + 3] = a;
  }

  get(x: number, y: number): RGB {
    const i = (((y + this.h) % this.h) * this.w + ((x + this.w) % this.w)) * 4;
    return [this.data[i], this.data[i + 1], this.data[i + 2]];
  }

  alpha(x: number, y: number): number {
    return this.data[(y * this.w + x) * 4 + 3];
  }

  setAlpha(x: number, y: number, a: number): void {
    this.data[(y * this.w + x) * 4 + 3] = a;
  }

  fill(c: RGB, a = 255): this {
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) this.set(x, y, c, a);
    return this;
  }

  clear(): this {
    this.data.fill(0);
    return this;
  }

  /** Bruit de luminosité par pixel (±amount) autour d'une couleur de base. */
  noise(base: RGB, amount: number, a = 255): this {
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        const f = 1 + (this.rng.next() * 2 - 1) * amount;
        this.set(x, y, scale(base, f), a);
      }
    return this;
  }

  /** Palette : chaque pixel choisit une couleur pondérée. */
  palette(colors: RGB[], weights?: number[]): this {
    const w = weights ?? colors.map(() => 1);
    const total = w.reduce((a, b) => a + b, 0);
    for (let y = 0; y < this.h; y++)
      for (let x = 0; x < this.w; x++) {
        let r = this.rng.next() * total;
        let k = 0;
        while (r > w[k] && k < colors.length - 1) {
          r -= w[k];
          k++;
        }
        this.set(x, y, colors[k]);
      }
    return this;
  }

  /** Taches (blobs) de couleur, utiles pour la pierre, le gravier… */
  blobs(c: RGB, count: number, rMin: number, rMax: number, jitter = 0.08): this {
    for (let i = 0; i < count; i++) {
      const cx = this.rng.next() * this.w;
      const cy = this.rng.next() * this.h;
      const r = rMin + this.rng.next() * (rMax - rMin);
      for (let y = Math.floor(cy - r - 1); y <= cy + r + 1; y++)
        for (let x = Math.floor(cx - r - 1); x <= cx + r + 1; x++) {
          const dx = x - cx;
          const dy = y - cy;
          if (dx * dx + dy * dy <= r * r + this.rng.next() * r) {
            const f = 1 + (this.rng.next() * 2 - 1) * jitter;
            this.set(((x % this.w) + this.w) % this.w, ((y % this.h) + this.h) % this.h, scale(c, f));
          }
        }
    }
    return this;
  }

  speckle(c: RGB, prob: number, a = 255): this {
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) if (this.rng.next() < prob) this.set(x, y, c, a);
    return this;
  }

  rect(x0: number, y0: number, x1: number, y1: number, c: RGB, a = 255): this {
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) this.set(x, y, c, a);
    return this;
  }

  hline(x0: number, x1: number, y: number, c: RGB): this {
    return this.rect(x0, y, x1, y, c);
  }

  vline(x: number, y0: number, y1: number, c: RGB): this {
    return this.rect(x, y0, x, y1, c);
  }

  /** Dessine un motif texte : chaque caractère indexe la palette, '.' = transparent. */
  pattern(rows: string[], pal: Record<string, RGB | null>, ox = 0, oy = 0, jitter = 0): this {
    for (let y = 0; y < rows.length; y++)
      for (let x = 0; x < rows[y].length; x++) {
        const ch = rows[y][x];
        if (ch === '.' || ch === ' ') continue;
        const c = pal[ch];
        if (c === undefined) continue;
        if (c === null) {
          this.set(ox + x, oy + y, [0, 0, 0], 0);
          continue;
        }
        const f = jitter ? 1 + (this.rng.next() * 2 - 1) * jitter : 1;
        this.set(ox + x, oy + y, scale(c, f));
      }
    return this;
  }

  /** Multiplie les pixels opaques par une couleur. */
  tint(c: RGB): this {
    for (let i = 0; i < this.data.length; i += 4) {
      this.data[i] = (this.data[i] * c[0]) / 255;
      this.data[i + 1] = (this.data[i + 1] * c[1]) / 255;
      this.data[i + 2] = (this.data[i + 2] * c[2]) / 255;
    }
    return this;
  }

  /** Superpose une autre toile (alpha binaire). */
  over(o: Pixmap): this {
    for (let i = 0; i < this.data.length; i += 4) {
      if (o.data[i + 3] > 127) {
        this.data[i] = o.data[i];
        this.data[i + 1] = o.data[i + 1];
        this.data[i + 2] = o.data[i + 2];
        this.data[i + 3] = o.data[i + 3];
      }
    }
    return this;
  }

  copy(): Pixmap {
    const p = new Pixmap(this.w, this.h);
    p.data.set(this.data);
    return p;
  }

  /** Assombrit les bords (biseau) pour les blocs « taillés ». */
  bevel(light: number, dark: number): this {
    for (let i = 0; i < this.w; i++) {
      this.set(i, 0, scale(this.get(i, 0), light));
      this.set(0, i, scale(this.get(0, i), light));
      this.set(i, this.h - 1, scale(this.get(i, this.h - 1), dark));
      this.set(this.w - 1, i, scale(this.get(this.w - 1, i), dark));
    }
    return this;
  }

  /** Moyenne des pixels opaques. */
  average(): RGB {
    let r = 0,
      g = 0,
      b = 0,
      n = 0;
    for (let i = 0; i < this.data.length; i += 4) {
      if (this.data[i + 3] < 128) continue;
      r += this.data[i];
      g += this.data[i + 1];
      b += this.data[i + 2];
      n++;
    }
    return n ? [r / n, g / n, b / n] : [0, 0, 0];
  }
}
