/**
 * Calcul de la lumière (ciel + blocs) sur une région de 3x3 tronçons (48x48xH).
 * La propagation se fait par parcours en largeur ; une source ne porte qu'à 15 blocs,
 * donc la lumière du tronçon central est exacte.
 */
import { ID_MASK } from './constants';
import { LIGHT_FILTER, OPAQUE, emittedLight } from './blocks';

export const RX = 48;
export const RZ = 48;
const PLANE = RX * RZ;

export class LightVolume {
  /** Identifiants de blocs (sans méta) de la région. */
  ids: Uint16Array;
  /** Blocs bruts (avec méta). */
  raw: Uint16Array;
  sky: Uint8Array;
  blk: Uint8Array;
  height = 0;
  private queue: Int32Array;

  constructor() {
    const n = PLANE * 256;
    this.ids = new Uint16Array(n);
    this.raw = new Uint16Array(n);
    this.sky = new Uint8Array(n);
    this.blk = new Uint8Array(n);
    this.queue = new Int32Array(1 << 21);
  }

  /** Charge les 9 colonnes (null = hors monde : traité comme de l'air sans lumière). */
  load(cols: Array<Uint16Array | null>): void {
    // Hauteur utile : plus haut bloc non-air + 2.
    let top = 0;
    for (const c of cols) {
      if (!c) continue;
      for (let y = 255; y > top; y--) {
        const base = y << 8;
        let any = false;
        for (let i = 0; i < 256; i++)
          if (c[base + i] !== 0) {
            any = true;
            break;
          }
        if (any) {
          top = y;
          break;
        }
      }
    }
    const H = Math.min(256, top + 2);
    this.height = H;
    const ids = this.ids;
    const raw = this.raw;
    ids.fill(0, 0, PLANE * H);
    raw.fill(0, 0, PLANE * H);
    for (let cz = 0; cz < 3; cz++)
      for (let cx = 0; cx < 3; cx++) {
        const c = cols[cz * 3 + cx];
        if (!c) continue;
        const ox = cx * 16;
        const oz = cz * 16;
        for (let y = 0; y < H; y++) {
          const src = y << 8;
          const dst = y * PLANE + oz * RX + ox;
          for (let z = 0; z < 16; z++) {
            const s = src + (z << 4);
            const d = dst + z * RX;
            for (let x = 0; x < 16; x++) {
              const v = c[s + x];
              raw[d + x] = v;
              ids[d + x] = v & ID_MASK;
            }
          }
        }
      }
  }

  compute(hasSky: boolean): void {
    const H = this.height;
    const n = PLANE * H;
    const sky = this.sky;
    const blk = this.blk;
    const ids = this.ids;
    sky.fill(0, 0, n);
    blk.fill(0, 0, n);
    const q = this.queue;
    let qh = 0;
    let qt = 0;
    const push = (i: number) => {
      q[qt] = i;
      qt = (qt + 1) & (q.length - 1);
    };

    if (hasSky) {
      // Passe verticale : la lumière du ciel descend sans perte dans l'air.
      const darkTop = new Int16Array(PLANE);
      for (let c = 0; c < PLANE; c++) {
        let light = 15;
        let dt = -1;
        for (let y = H - 1; y >= 0; y--) {
          const i = y * PLANE + c;
          const id = ids[i];
          if (id !== 0) {
            const f = LIGHT_FILTER[id];
            if (f >= 15) {
              light = 0;
            } else light = light > f ? light - f : 0;
          }
          if (light < 15 && dt < 0) dt = y;
          if (light === 0) break;
          sky[i] = light;
        }
        darkTop[c] = dt;
      }
      // Germes : cellules éclairées à côté de colonnes plus sombres (propagation latérale).
      for (let z = 0; z < RZ; z++)
        for (let x = 0; x < RX; x++) {
          const c = z * RX + x;
          let m = darkTop[c];
          if (x > 0) m = Math.max(m, darkTop[c - 1]);
          if (x < RX - 1) m = Math.max(m, darkTop[c + 1]);
          if (z > 0) m = Math.max(m, darkTop[c - RX]);
          if (z < RZ - 1) m = Math.max(m, darkTop[c + RX]);
          for (let y = Math.min(m + 1, H - 1); y >= 0; y--) {
            const i = y * PLANE + c;
            if (sky[i] > 1) push(i);
            else if (y <= darkTop[c] && sky[i] === 0) break;
          }
        }
      this.propagate(sky, qh, qt);
      qh = qt = 0;
    }

    // Lumière des blocs.
    const raw = this.raw;
    for (let i = 0; i < n; i++) {
      if (ids[i] === 0) continue;
      const e = emittedLight(raw[i]);
      if (e > 0) {
        blk[i] = e;
        push(i);
      }
    }
    this.propagate(blk, qh, qt);
  }

  private propagate(light: Uint8Array, qh: number, qt: number): void {
    const q = this.queue;
    const mask = q.length - 1;
    const ids = this.ids;
    const H = this.height;
    while (qh !== qt) {
      const i = q[qh];
      qh = (qh + 1) & mask;
      const L = light[i];
      if (L <= 1) continue;
      const y = (i / PLANE) | 0;
      const r = i - y * PLANE;
      const z = (r / RX) | 0;
      const x = r - z * RX;
      // 6 voisins
      for (let d = 0; d < 6; d++) {
        let j: number;
        if (d === 0) {
          if (x === RX - 1) continue;
          j = i + 1;
        } else if (d === 1) {
          if (x === 0) continue;
          j = i - 1;
        } else if (d === 2) {
          if (y === H - 1) continue;
          j = i + PLANE;
        } else if (d === 3) {
          if (y === 0) continue;
          j = i - PLANE;
        } else if (d === 4) {
          if (z === RZ - 1) continue;
          j = i + RX;
        } else {
          if (z === 0) continue;
          j = i - RX;
        }
        const id = ids[j];
        if (OPAQUE[id]) continue;
        const nl = L - 1 - LIGHT_FILTER[id];
        if (nl > light[j]) {
          light[j] = nl;
          q[qt] = j;
          qt = (qt + 1) & mask;
        }
      }
    }
  }

  index(x: number, y: number, z: number): number {
    return y * PLANE + z * RX + x;
  }
}

export const REGION_PLANE = PLANE;
