/**
 * Gestion des structures procédurales : une structure au plus par région
 * (position et site tirés de la graine), reconstruite colonne par colonne
 * de façon déterministe, recherche de la plus proche (/localiser).
 */
import type { ChunkBuffer } from './buffer';
import type { Content } from '../registry/content';
import type { DimGenerator } from './generator';
import { Builder } from './structures/builder';
import type { Placement, StructCtx, StructureType } from './structures/types';
import { SURFACE_STRUCTURES } from './structures/surface';
import { ABYSS_STRUCTURES, ASTRAL_STRUCTURES } from './structures/nether';
import { CELESTE_STRUCTURES } from './structures/celeste';
import { templateStructure } from './structures/template';
import { Rng, hash3, hashString } from '../engine/rng';
import { CS } from '../world/constants';

export const ALL_STRUCTURES: StructureType[] = [...SURFACE_STRUCTURES, ...ABYSS_STRUCTURES, ...ASTRAL_STRUCTURES, ...CELESTE_STRUCTURES];

export class StructureManager {
  readonly types: StructureType[];
  readonly ctx: StructCtx;
  enabled = true;
  private cache = new Map<string, Placement | null>();

  constructor(
    readonly seed: number,
    readonly content: Content,
    readonly gen: DimGenerator,
  ) {
    this.ctx = { seed, gen, content };
    const templates = (content.pack.structures ?? []).map((d) => templateStructure(d, hashString(d.id)));
    this.types = [...ALL_STRUCTURES, ...templates].filter((t) => t.dim === gen.dim);
  }

  /** Emplacement de la structure `t` dans la région (rx, rz), ou null. */
  placement(t: StructureType, rx: number, rz: number): Placement | null {
    const key = `${t.id}:${rx}:${rz}`;
    if (this.cache.has(key)) return this.cache.get(key)!;
    const rng = new Rng(hash3(this.seed ^ Math.imul(t.salt, 0x9e3779b1), rx, t.salt, rz));
    let p: Placement | null = null;
    if (rng.chance(t.chance)) {
      const margin = Math.min(Math.floor(t.region / 4), Math.ceil(t.radius / CS));
      const span = Math.max(1, t.region - 2 * margin);
      const cx = rx * t.region + margin + rng.int(span),
        cz = rz * t.region + margin + rng.int(span);
      p = t.site(this.ctx, cx * CS + rng.int(CS), cz * CS + rng.int(CS), rng);
    }
    if (this.cache.size > 4096) this.cache.clear();
    this.cache.set(key, p);
    return p;
  }

  generate(buf: ChunkBuffer): void {
    if (!this.enabled) return;
    const bx = buf.bx,
      bz = buf.bz;
    for (const t of this.types) {
      const size = t.region * CS;
      const rx0 = Math.floor((bx - t.radius) / size),
        rx1 = Math.floor((bx + CS - 1 + t.radius) / size);
      const rz0 = Math.floor((bz - t.radius) / size),
        rz1 = Math.floor((bz + CS - 1 + t.radius) / size);
      for (let rz = rz0; rz <= rz1; rz++)
        for (let rx = rx0; rx <= rx1; rx++) {
          const p = this.placement(t, rx, rz);
          if (!p) continue;
          if (p.x + t.radius < bx || p.x - t.radius >= bx + CS || p.z + t.radius < bz || p.z - t.radius >= bz + CS) continue;
          const sb = new Builder(buf, this.content, p.x, p.y, p.z, p.rot, p.seed);
          t.build(sb, p, this.ctx);
        }
    }
  }

  /** Type de structure par identifiant ou alias. */
  find(name: string): StructureType | undefined {
    const n = name.toLowerCase();
    return this.types.find((t) => t.id === n || t.aliases?.includes(n));
  }

  /** Structure la plus proche de (x, z), recherche en anneaux de régions. */
  locate(name: string, x: number, z: number, maxBlocks = 12000): { x: number; z: number; y: number; name: string } | null {
    const t = this.find(name);
    if (!t) return null;
    const size = t.region * CS;
    const crx = Math.floor(x / size),
      crz = Math.floor(z / size);
    const maxR = Math.ceil(maxBlocks / size);
    let best: Placement | null = null,
      bestD = Infinity;
    for (let r = 0; r <= maxR; r++) {
      if (best && (r - 1) * size > bestD) break;
      for (let rz = crz - r; rz <= crz + r; rz++)
        for (let rx = crx - r; rx <= crx + r; rx++) {
          if (Math.max(Math.abs(rx - crx), Math.abs(rz - crz)) !== r) continue;
          const p = this.placement(t, rx, rz);
          if (!p) continue;
          const d = Math.hypot(p.x - x, p.z - z);
          if (d < bestD) {
            bestD = d;
            best = p;
          }
        }
    }
    return best ? { x: best.x, y: best.y, z: best.z, name: t.name } : null;
  }

  /** Identifiants disponibles dans cette dimension. */
  ids(): string[] {
    return this.types.map((t) => t.id);
  }
}
