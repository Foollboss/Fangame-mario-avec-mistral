/** Tirage de butin (créatures, coffres de structures, blocs). */
import type { Rng } from '../engine/rng';
import type { LootEntry, LootTable, DropDef } from '../registry/types';
import type { ItemStack } from '../inventory/inventory';

function countOf(c: number | [number, number] | undefined, rng: Rng): number {
  if (c === undefined) return 1;
  if (typeof c === 'number') return c;
  return rng.range(c[0], c[1]);
}

/** Butin « liste » : chaque entrée a sa propre chance. */
export function rollEntries(entries: LootEntry[] | DropDef[], rng: Rng, bonus = 0): ItemStack[] {
  const out: ItemStack[] = [];
  for (const e of entries) {
    const ch = (e as LootEntry).chance ?? 1;
    if (!rng.chance(Math.min(1, ch * (1 + bonus)))) continue;
    const n = countOf(e.count, rng);
    if (n > 0) out.push({ id: e.item, count: n });
  }
  return out;
}

/** Table de coffre : N tirages pondérés. */
export function rollTable(t: LootTable, rng: Rng): ItemStack[] {
  const rolls = countOf(t.rolls ?? 4, rng);
  const out: ItemStack[] = [];
  for (let i = 0; i < rolls; i++) {
    const e = rng.weighted(t.entries);
    const n = countOf(e.count, rng);
    if (n > 0) out.push({ id: e.item, count: n });
  }
  return out;
}
