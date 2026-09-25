import { describe, it, expect } from 'vitest';
import { content } from './helpers';
import { Container, PlayerInventory } from '../src/inventory/inventory';
import { leftClick, rightClick, dragDistribute, shiftClick, collectToCursor, swapWithHotbar } from '../src/inventory/clicks';

const items = content.items;

describe('inventaire', () => {
  it('empile jusqu\'à la taille maximale et renvoie le reste', () => {
    const c = new Container(2, items);
    const rest = c.add({ id: 'pierre', count: 100 });
    expect(c.get(0)?.count).toBe(64);
    expect(c.get(1)?.count).toBe(36);
    expect(rest).toBeNull();
    const rest2 = c.add({ id: 'pierre', count: 40 });
    expect(rest2?.count).toBe(12);
  });

  it('ne cumule pas les outils (pile de 1)', () => {
    const c = new Container(3, items);
    c.add({ id: 'pioche_fer', count: 1 });
    c.add({ id: 'pioche_fer', count: 1 });
    expect(c.get(0)?.count).toBe(1);
    expect(c.get(1)?.count).toBe(1);
  });

  it('gère les clics gauche/droit (prise, moitié, dépôt unitaire, échange)', () => {
    const c = new Container(4, items);
    const h = { cursor: null as null | { id: string; count: number } };
    c.set(0, { id: 'terre', count: 10 });
    rightClick(c, 0, h); // prend la moitié
    expect(h.cursor?.count).toBe(5);
    expect(c.get(0)?.count).toBe(5);
    rightClick(c, 1, h); // dépose un
    expect(c.get(1)?.count).toBe(1);
    expect(h.cursor?.count).toBe(4);
    leftClick(c, 0, h); // fusionne
    expect(c.get(0)?.count).toBe(9);
    expect(h.cursor).toBeNull();
    c.set(2, { id: 'sable', count: 3 });
    leftClick(c, 0, h); // prend 9 terre
    leftClick(c, 2, h); // échange avec le sable
    expect(c.get(2)?.id).toBe('terre');
    expect(h.cursor?.id).toBe('sable');
  });

  it('répartit en glissant et transfère avec maj', () => {
    const c = new Container(4, items);
    const h = { cursor: { id: 'moellon', count: 9 } };
    dragDistribute([0, 1, 2].map((i) => ({ c, i })), h, 'left');
    expect(c.get(0)?.count).toBe(3);
    expect(c.get(2)?.count).toBe(3);
    expect(h.cursor).toBeNull();
    const target = new Container(2, items);
    shiftClick(c, 0, [{ c: target }]);
    expect(c.get(0)).toBeNull();
    expect(target.get(0)?.count).toBe(3);
    const h2 = { cursor: { id: 'moellon', count: 1 } };
    collectToCursor([c], h2);
    expect(h2.cursor.count).toBe(7);
    swapWithHotbar(target, 0, c, 3);
    expect(c.get(3)?.id).toBe('moellon');
  });

  it('sérialise et recharge l\'inventaire du joueur', () => {
    const inv = new PlayerInventory(items);
    inv.give({ id: 'pain', count: 5 });
    inv.armor.set(1, { id: 'plastron_fer', count: 1, dmg: 7 });
    inv.selected = 3;
    const data = JSON.parse(JSON.stringify(inv.serializeAll()));
    const inv2 = new PlayerInventory(items);
    inv2.loadAll(data);
    expect(inv2.count('pain')).toBe(5);
    expect(inv2.armor.get(1)?.dmg).toBe(7);
    expect(inv2.selected).toBe(3);
    expect(inv2.armorPoints()).toBe(6);
  });
});
