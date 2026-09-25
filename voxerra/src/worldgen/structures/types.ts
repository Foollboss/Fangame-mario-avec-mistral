/** Types communs des structures procédurales. */
import type { Content } from '../../registry/content';
import type { DimGenerator } from '../generator';
import type { Builder } from './builder';
import type { Rng } from '../../engine/rng';
import { BIOMES } from '../biomes';

export interface StructCtx {
  seed: number;
  gen: DimGenerator;
  content: Content;
}

/** Emplacement retenu pour une structure (déterministe). */
export interface Placement {
  x: number;
  y: number;
  z: number;
  rot: number;
  seed: number;
  /** Variante / paramètres choisis lors de la sélection du site. */
  v?: number;
  style?: string;
}

export interface StructureType {
  id: string;
  /** Nom affiché (/localiser). */
  name: string;
  aliases?: string[];
  dim: string;
  /** Taille de région en chunks (une structure au plus par région). */
  region: number;
  /** Sel propre au type (indépendance des tirages). */
  salt: number;
  /** Probabilité qu'une région contienne la structure. */
  chance: number;
  /** Rayon maximal en blocs autour de l'origine. */
  radius: number;
  /** Choix/validation du site à partir d'une position tirée dans la région. */
  site(ctx: StructCtx, x: number, z: number, rng: Rng): Placement | null;
  /** Construction : appelée pour chaque colonne touchée (écritures bornées). */
  build(b: Builder, p: Placement, ctx: StructCtx): void;
}

export function biomeId(ctx: StructCtx, x: number, z: number): string {
  return BIOMES[ctx.gen.biomeAt(x, z)]?.id ?? '';
}

/** Hauteurs du sol sur un carré (centre + coins) : [min, max, centre]. */
export function flatness(ctx: StructCtx, x: number, z: number, r: number): [number, number, number] {
  const c = ctx.gen.surfaceHeight(x, z);
  let lo = c,
    hi = c;
  for (const [dx, dz] of [
    [-r, -r],
    [r, -r],
    [-r, r],
    [r, r],
    [0, r],
    [0, -r],
    [r, 0],
    [-r, 0],
  ]) {
    const h = ctx.gen.surfaceHeight(x + dx, z + dz);
    lo = Math.min(lo, h);
    hi = Math.max(hi, h);
  }
  return [lo, hi, c];
}
