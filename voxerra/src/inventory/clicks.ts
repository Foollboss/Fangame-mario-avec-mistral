/**
 * Logique des clics d'inventaire, indépendante de l'interface (testable) :
 * clic gauche/droit, glisser-déposer réparti, clic maj (transfert rapide),
 * double-clic (regroupement), touches numériques (échange avec la barre).
 */
import { Container, sameItem, type ItemStack } from './inventory';

export interface CursorHolder {
  cursor: ItemStack | null;
}

export function leftClick(c: Container, i: number, h: CursorHolder, accept: (s: ItemStack) => boolean = () => true): void {
  const slot = c.get(i);
  const cur = h.cursor;
  if (!cur) {
    if (!slot) return;
    h.cursor = slot;
    c.set(i, null);
    return;
  }
  if (!accept(cur)) return;
  if (!slot) {
    const max = c.maxStack(cur.id);
    if (cur.count <= max) {
      c.set(i, cur);
      h.cursor = null;
    } else {
      c.set(i, { ...cur, count: max });
      cur.count -= max;
    }
    return;
  }
  if (sameItem(slot, cur)) {
    const max = c.maxStack(slot.id);
    const n = Math.min(max - slot.count, cur.count);
    slot.count += n;
    cur.count -= n;
    if (cur.count <= 0) h.cursor = null;
    c.changed();
    return;
  }
  // échange
  c.set(i, cur);
  h.cursor = slot;
}

export function rightClick(c: Container, i: number, h: CursorHolder, accept: (s: ItemStack) => boolean = () => true): void {
  const slot = c.get(i);
  const cur = h.cursor;
  if (!cur) {
    if (!slot) return;
    const half = Math.ceil(slot.count / 2);
    h.cursor = { ...slot, count: half };
    slot.count -= half;
    c.set(i, slot.count > 0 ? slot : null);
    return;
  }
  if (!accept(cur)) return;
  if (!slot) {
    c.set(i, { ...cur, count: 1 });
    cur.count--;
    if (cur.count <= 0) h.cursor = null;
    return;
  }
  if (sameItem(slot, cur) && slot.count < c.maxStack(slot.id)) {
    slot.count++;
    cur.count--;
    if (cur.count <= 0) h.cursor = null;
    c.changed();
    return;
  }
  c.set(i, cur);
  h.cursor = slot;
}

/** Répartition par glisser : mode gauche = parts égales, droite = un par case. */
export function dragDistribute(targets: { c: Container; i: number }[], h: CursorHolder, mode: 'left' | 'right', accept: (c: Container, s: ItemStack) => boolean = () => true): void {
  const cur = h.cursor;
  if (!cur || targets.length === 0) return;
  const valid = targets.filter(({ c, i }) => {
    const s = c.get(i);
    return accept(c, cur) && (!s || (sameItem(s, cur) && s.count < c.maxStack(s.id)));
  });
  if (valid.length === 0) return;
  const per = mode === 'left' ? Math.max(1, Math.floor(cur.count / valid.length)) : 1;
  for (const { c, i } of valid) {
    if (cur.count <= 0) break;
    const s = c.get(i);
    const max = c.maxStack(cur.id);
    const room = s ? max - s.count : max;
    const n = Math.min(per, room, cur.count);
    if (n <= 0) continue;
    if (s) {
      s.count += n;
      c.changed();
    } else c.set(i, { ...cur, count: n });
    cur.count -= n;
  }
  if (cur.count <= 0) h.cursor = null;
}

/** Clic maj : déplace la pile vers les conteneurs cibles (dans l'ordre). */
export function shiftClick(from: Container, i: number, targets: { c: Container; order?: number[] }[]): void {
  const s = from.get(i);
  if (!s) return;
  let rest: ItemStack | null = { ...s };
  for (const t of targets) {
    if (!rest) break;
    rest = t.c.add(rest, t.order);
  }
  from.set(i, rest);
}

/** Double-clic : regroupe les objets identiques dans le curseur. */
export function collectToCursor(containers: Container[], h: CursorHolder): void {
  const cur = h.cursor;
  if (!cur) return;
  const max = containers[0]?.maxStack(cur.id) ?? 64;
  for (const c of containers)
    for (let i = 0; i < c.size && cur.count < max; i++) {
      const s = c.get(i);
      if (!s || !sameItem(s, cur)) continue;
      const n = Math.min(max - cur.count, s.count);
      cur.count += n;
      s.count -= n;
      c.set(i, s.count > 0 ? s : null);
    }
}

/** Touche numérique : échange la case survolée avec la case n de la barre rapide. */
export function swapWithHotbar(c: Container, i: number, hotbar: Container, n: number): void {
  if (c === hotbar && i === n) return;
  const a = c.get(i);
  const b = hotbar.get(n);
  c.set(i, b);
  hotbar.set(n, a);
}
