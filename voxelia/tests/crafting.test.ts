import { describe, expect, it } from 'vitest';
import { findRecipe, smeltResult, RECIPES } from '../src/inventory/recipes';
import { Container, PlayerInventory, leftClick, rightClick, quickMove } from '../src/inventory/Container';
import { ITEM_BY_KEY, itemId } from '../src/items/items';
import { tickFurnace, COOK_TIME, type FurnaceData } from '../src/game/BlockEntityTicker';

const st = (key: string, count = 1) => ({ id: itemId(key), count });

describe('recettes', () => {
  it('toutes les recettes produisent des objets existants', () => {
    for (const r of RECIPES) expect(ITEM_BY_KEY.has(r.result), r.id).toBe(true);
  });

  it('planches depuis une bûche (sans forme, n’importe où dans la grille)', () => {
    const g = [null, null, null, st('oak_log')];
    const r = findRecipe(g, 2, 2);
    expect(r?.result).toBe('oak_planks');
  });

  it('établi avec 4 planches de bois quelconques', () => {
    const g = [st('oak_planks'), st('birch_planks'), st('spruce_planks'), st('oak_planks')];
    expect(findRecipe(g, 2, 2)?.result).toBe('crafting_table');
  });

  it('pioche en pierre (3×3, avec forme)', () => {
    const c = st('cobblestone');
    const s = st('stick');
    const g = [c, c, c, null, s, null, null, s, null];
    expect(findRecipe(g, 3, 3)?.result).toBe('stone_pickaxe');
  });

  it('pas de recette pour une grille incohérente', () => {
    expect(findRecipe([st('dirt'), st('stick'), null, null], 2, 2)).toBeNull();
  });

  it('cuisson : minerai de fer → lingot', () => {
    expect(smeltResult(st('raw_iron'))?.result).toBe('iron_ingot');
  });
});

describe('four', () => {
  it('cuit un objet avec du charbon et accumule l’expérience', () => {
    const f: FurnaceData = { type: 'furnace', items: [st('raw_iron', 2), st('coal', 1), null], burn: 0, burnMax: 0, cook: 0, xp: 0 };
    for (let i = 0; i < COOK_TIME + 1; i++) tickFurnace(f);
    expect(f.items[2]?.id).toBe(itemId('iron_ingot'));
    expect(f.items[2]?.count).toBe(1);
    expect(f.items[0]?.count).toBe(1);
    expect(f.items[1]).toBeNull();
    expect(f.xp).toBeGreaterThan(0);
  });

  it('ne fait rien sans combustible', () => {
    const f: FurnaceData = { type: 'furnace', items: [st('raw_iron', 1), null, null], burn: 0, burnMax: 0, cook: 0, xp: 0 };
    for (let i = 0; i < 300; i++) tickFurnace(f);
    expect(f.items[2]).toBeNull();
  });
});

describe('inventaire', () => {
  it('ajoute en complétant les piles puis les cases vides', () => {
    const inv = new PlayerInventory();
    inv.set(0, st('dirt', 60));
    const left = inv.give(st('dirt', 10));
    expect(left).toBe(0);
    expect(inv.get(0)?.count).toBe(64);
    expect(inv.get(1)?.count).toBe(6);
  });

  it('clic gauche / droit sur une case', () => {
    const c = new Container(2);
    c.set(0, st('stone', 10));
    const ctx = { cursor: null as null | { id: number; count: number } };
    rightClick(c, 0, ctx);
    expect(ctx.cursor?.count).toBe(5);
    expect(c.get(0)?.count).toBe(5);
    rightClick(c, 1, ctx);
    expect(c.get(1)?.count).toBe(1);
    leftClick(c, 1, ctx);
    expect(c.get(1)?.count).toBe(5);
    expect(ctx.cursor).toBeNull();
  });

  it('déplacement rapide vers un autre conteneur', () => {
    const a = new Container(3);
    const b = new Container(3);
    a.set(0, st('sand', 20));
    quickMove(a, 0, [{ c: b }]);
    expect(a.get(0)).toBeNull();
    expect(b.get(0)?.count).toBe(20);
  });

  it('respecte les filtres d’armure', () => {
    const inv = new PlayerInventory();
    expect(inv.armor.accepts(0, st('iron_helmet'))).toBe(true);
    expect(inv.armor.accepts(0, st('iron_boots'))).toBe(false);
  });
});
