/**
 * Colonne de chunk 16x256x16 découpée en 16 sections 16³ allouées paresseusement.
 * - blocs : Uint16 (id 12 bits + méta 4 bits), null = section vide (air)
 * - lumière : Uint8 (ciel << 4 | bloc), null = plein ciel (15, 0)
 */
import { CS, SECTIONS, SECTION_VOL, WORLD_H } from './constants';

export class Section {
  blocks: Uint16Array | null = null;
  light: Uint8Array | null = null;
  /** Nombre de cellules non vides (permet de libérer une section redevenue vide). */
  count = 0;

  ensureBlocks(): Uint16Array {
    if (!this.blocks) this.blocks = new Uint16Array(SECTION_VOL);
    return this.blocks;
  }
  ensureLight(): Uint8Array {
    if (!this.light) this.light = new Uint8Array(SECTION_VOL).fill(0xf0);
    return this.light;
  }
  recount(): void {
    let c = 0;
    const b = this.blocks;
    if (b) for (let i = 0; i < SECTION_VOL; i++) if (b[i] !== 0) c++;
    this.count = c;
    if (c === 0) this.blocks = null;
  }
}

export interface BlockEntityData {
  type: string;
  [k: string]: unknown;
}

export const enum ChunkState {
  Generating = 0,
  Loaded = 1,
}

export class Chunk {
  readonly sections: Section[] = [];
  /** Hauteur du bloc le plus haut qui atténue la lumière (−1 si aucun). */
  readonly heightmap = new Int16Array(CS * CS).fill(-1);
  readonly biomes = new Uint8Array(CS * CS);
  /** Teintes par colonne : herbe, feuillage, eau (RGB empaqueté). */
  readonly tints = new Uint32Array(CS * CS * 3);
  /** Entités de blocs (coffres, fourneaux…) indexées par cidx. */
  readonly blockEntities = new Map<number, BlockEntityData>();
  /** La sauvegarde de cette colonne contient des entités (à réécrire pour rester synchronisée). */
  recordHasEntities = false;
  /** Modifié depuis la génération/le chargement → doit être sauvegardé. */
  dirty = false;
  /** Déjà modifié au moins une fois (sinon régénérable depuis la graine). */
  modified = false;
  lit = false;
  lastSeen = 0;
  /** Positions de départ d'éclairage de blocs (sources) calculées par la génération. */
  pendingLightSources: number[] = [];

  constructor(
    readonly cx: number,
    readonly cz: number,
  ) {
    for (let i = 0; i < SECTIONS; i++) this.sections.push(new Section());
  }

  get(x: number, y: number, z: number): number {
    if (y < 0 || y >= WORLD_H) return 0;
    const b = this.sections[y >> 4].blocks;
    return b ? b[((y & 15) << 8) | (z << 4) | x] : 0;
  }

  /** Écrit une cellule (sans éclairage ni évènements : voir World.setBlock). */
  set(x: number, y: number, z: number, v: number): number {
    if (y < 0 || y >= WORLD_H) return 0;
    const s = this.sections[y >> 4];
    const i = ((y & 15) << 8) | (z << 4) | x;
    if (!s.blocks) {
      if (v === 0) return 0;
      s.blocks = new Uint16Array(SECTION_VOL);
    }
    const old = s.blocks[i];
    if (old === v) return old;
    s.blocks[i] = v;
    if (old === 0) s.count++;
    else if (v === 0) {
      s.count--;
      if (s.count <= 0) {
        s.count = 0;
        s.blocks = null;
      }
    }
    return old;
  }

  getLight(x: number, y: number, z: number): number {
    if (y >= WORLD_H) return 0xf0;
    if (y < 0) return 0;
    const l = this.sections[y >> 4].light;
    return l ? l[((y & 15) << 8) | (z << 4) | x] : 0xf0;
  }

  setLight(x: number, y: number, z: number, v: number): void {
    if (y < 0 || y >= WORLD_H) return;
    const s = this.sections[y >> 4];
    if (!s.light) {
      if (v === 0xf0) return;
      s.ensureLight();
    }
    s.light![((y & 15) << 8) | (z << 4) | x] = v;
  }

  /** Recalcule la carte des hauteurs d'une colonne. */
  updateHeight(x: number, z: number, opacity: Uint8Array): void {
    let y = WORLD_H - 1;
    for (; y >= 0; y--) {
      const v = this.get(x, y, z);
      if (v !== 0 && opacity[v & 0xfff] > 0) break;
    }
    this.heightmap[z * CS + x] = y;
  }

  /** Surface solide (pour l'apparition des créatures, la pluie, etc.). */
  topSolidY(x: number, z: number, solid: Uint8Array): number {
    for (let y = WORLD_H - 1; y >= 0; y--) {
      const v = this.get(x, y, z);
      if (v !== 0 && solid[v & 0xfff]) return y;
    }
    return -1;
  }

  /** Indice de la plus haute section non vide + 1. */
  topSection(): number {
    for (let s = SECTIONS - 1; s >= 0; s--) if (this.sections[s].blocks) return s + 1;
    return 0;
  }

  /** Charge des sections brutes (depuis la génération ou une sauvegarde). */
  loadSections(sections: (Uint16Array | null)[]): void {
    for (let i = 0; i < SECTIONS; i++) {
      const s = this.sections[i];
      s.blocks = sections[i] ?? null;
      s.light = null;
      s.recount();
    }
  }
}
