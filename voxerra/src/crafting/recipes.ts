/**
 * Système de fabrication data-driven : recettes avec motif (miroir autorisé),
 * recettes sans motif, étiquettes (#planks), stations (atelier, forge) et cuisson.
 */
import type { RecipeDef, SmeltDef } from '../registry/types';
import type { ItemRegistry } from '../registry/items';
import type { BlockRegistry } from '../registry/blocks';

export type Station = 'hand' | 'atelier' | 'forge';

export interface Recipe extends RecipeDef {
  id: string;
  /** Motif normalisé : lignes de spécifications ('' = vide). */
  grid?: string[][];
  w: number;
  h: number;
}

export interface CraftResult {
  recipe: Recipe;
  item: string;
  count: number;
}

const VARIANT_RECIPES: Record<string, { pattern: string[]; count: number; stick?: boolean }> = {
  slab: { pattern: ['XXX'], count: 6 },
  stairs: { pattern: ['X  ', 'XX ', 'XXX'], count: 4 },
  wall: { pattern: ['XXX', 'XXX'], count: 6 },
  fence: { pattern: ['XSX', 'XSX'], count: 3, stick: true },
};
const VARIANT_SUFFIX: Record<string, string> = { slab: '_dalle', stairs: '_escalier', wall: '_muret', fence: '_barriere' };

export class RecipeBook {
  readonly recipes: Recipe[] = [];
  readonly smelting: SmeltDef[];
  private byOutput = new Map<string, Recipe[]>();

  constructor(defs: RecipeDef[], smelting: SmeltDef[], private items: ItemRegistry, blocks?: BlockRegistry) {
    defs.forEach((d, i) => this.add(d, d.id ?? `r${i}_${d.result.item}`));
    // Recettes automatiques pour les variantes de blocs (dalles, escaliers…)
    if (blocks) {
      for (const b of blocks.list) {
        if (!b.tags.has('variant')) continue;
        for (const [v, suffix] of Object.entries(VARIANT_SUFFIX)) {
          if (!b.tags.has(v) || !b.id.endsWith(suffix)) continue;
          if (this.byOutput.has(b.id)) continue;
          const base = b.id.slice(0, -suffix.length);
          const vr = VARIANT_RECIPES[v];
          const key: Record<string, string> = { X: base };
          if (vr.stick) key.S = 'baton';
          this.add({ type: 'shaped', pattern: vr.pattern, key, result: { item: b.id, count: vr.count } }, `auto_${b.id}`);
        }
      }
    }
    this.smelting = smelting;
  }

  private add(d: RecipeDef, id: string): void {
    const r: Recipe = { ...d, id, w: 0, h: 0 };
    if (d.type === 'shaped' && d.pattern) {
      const rows = d.pattern.map((row) => [...row].map((ch) => (ch === ' ' ? '' : d.key?.[ch] ?? '')));
      const trimmed = trimGrid(rows);
      r.grid = trimmed.grid;
      r.w = trimmed.w;
      r.h = trimmed.h;
    } else {
      r.w = r.h = 0;
    }
    this.recipes.push(r);
    const list = this.byOutput.get(d.result.item) ?? [];
    list.push(r);
    this.byOutput.set(d.result.item, list);
  }

  recipesFor(item: string): Recipe[] {
    return this.byOutput.get(item) ?? [];
  }

  /**
   * Cherche la recette correspondant à une grille (tableau de w*h ids, '' ou null = vide).
   */
  match(cells: (string | null | undefined)[], gw: number, gh: number, station: Station): CraftResult | null {
    const rows: string[][] = [];
    for (let y = 0; y < gh; y++) {
      const row: string[] = [];
      for (let x = 0; x < gw; x++) row.push(cells[y * gw + x] ?? '');
      rows.push(row);
    }
    const t = trimGrid(rows);
    if (t.w === 0) return null;
    const flat = t.grid.flat().filter((c) => c !== '');
    for (const r of this.recipes) {
      if (!stationAllows(station, r.station)) continue;
      if (r.type === 'shaped') {
        if (r.w !== t.w || r.h !== t.h || !r.grid) continue;
        if (this.shapedMatch(r.grid, t.grid, false) || this.shapedMatch(r.grid, t.grid, true)) return { recipe: r, item: r.result.item, count: r.result.count ?? 1 };
      } else {
        const ing = r.ingredients ?? [];
        if (ing.length !== flat.length) continue;
        if (this.shapelessMatch(ing, flat)) return { recipe: r, item: r.result.item, count: r.result.count ?? 1 };
      }
    }
    return null;
  }

  private shapedMatch(pattern: string[][], grid: string[][], mirror: boolean): boolean {
    const h = pattern.length;
    const w = pattern[0].length;
    for (let y = 0; y < h; y++)
      for (let x = 0; x < w; x++) {
        const spec = pattern[y][mirror ? w - 1 - x : x];
        const cell = grid[y][x];
        if (spec === '' && cell === '') continue;
        if (spec === '' || cell === '') return false;
        if (!this.items.matches(spec, cell)) return false;
      }
    return true;
  }

  private shapelessMatch(specs: string[], cells: string[]): boolean {
    // Appariement glouton avec retour arrière (grilles ≤ 9 cases)
    const used = new Array(cells.length).fill(false);
    const rec = (i: number): boolean => {
      if (i === specs.length) return true;
      for (let j = 0; j < cells.length; j++) {
        if (used[j] || !this.items.matches(specs[i], cells[j])) continue;
        used[j] = true;
        if (rec(i + 1)) return true;
        used[j] = false;
      }
      return false;
    };
    return rec(0);
  }

  smeltResult(input: string): SmeltDef | null {
    for (const s of this.smelting) if (this.items.matches(s.input, input)) return s;
    return null;
  }

  /** Liste des ingrédients (specs) nécessaires à une recette, avec quantités. */
  ingredientCounts(r: Recipe): Map<string, number> {
    const m = new Map<string, number>();
    const specs = r.type === 'shaped' ? (r.grid ?? []).flat().filter((s) => s !== '') : r.ingredients ?? [];
    for (const s of specs) m.set(s, (m.get(s) ?? 0) + 1);
    return m;
  }

  /** Taille minimale de grille requise. */
  fitsIn(r: Recipe, gw: number, gh: number): boolean {
    if (r.type === 'shaped') return r.w <= gw && r.h <= gh;
    return (r.ingredients?.length ?? 0) <= gw * gh;
  }
}

export function stationAllows(station: Station, required?: string): boolean {
  if (!required) return true;
  if (required === 'forge') return station === 'forge';
  if (required === 'atelier') return station === 'atelier' || station === 'forge';
  return true;
}

function trimGrid(rows: string[][]): { grid: string[][]; w: number; h: number } {
  let minX = Infinity,
    minY = Infinity,
    maxX = -1,
    maxY = -1;
  rows.forEach((row, y) =>
    row.forEach((c, x) => {
      if (c !== '') {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }),
  );
  if (maxX < 0) return { grid: [], w: 0, h: 0 };
  const grid: string[][] = [];
  for (let y = minY; y <= maxY; y++) {
    const row: string[] = [];
    for (let x = minX; x <= maxX; x++) row.push(rows[y]?.[x] ?? '');
    grid.push(row);
  }
  return { grid, w: maxX - minX + 1, h: maxY - minY + 1 };
}
