/**
 * InventorySystem — conteneurs d'objets (inventaire du joueur, coffres, fours, grilles
 * de fabrication) et opérations de clic (prendre, poser, diviser, déplacement rapide).
 */
import { ITEMS, maxStack, sameItem, type ItemStack, type ArmorSlot } from '../items/items';

export type SlotFilter = (s: ItemStack) => boolean;

export class Container {
  slots: Array<ItemStack | null>;
  private listeners: Array<() => void> = [];
  /** Filtres d'acceptation par emplacement (armure, combustible…). */
  filters: Array<SlotFilter | undefined> = [];
  /** Emplacements de sortie (on ne peut que prendre). */
  outputs = new Set<number>();

  constructor(
    readonly size: number,
    readonly name = '',
  ) {
    this.slots = new Array(size).fill(null);
  }

  get(i: number): ItemStack | null {
    return this.slots[i] ?? null;
  }

  set(i: number, s: ItemStack | null): void {
    this.slots[i] = s && s.count > 0 ? s : null;
    this.changed();
  }

  onChange(fn: () => void): () => void {
    this.listeners.push(fn);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  changed(): void {
    for (const l of this.listeners) l();
  }

  accepts(i: number, s: ItemStack): boolean {
    if (this.outputs.has(i)) return false;
    const f = this.filters[i];
    return !f || f(s);
  }

  /** Ajoute une pile ; renvoie le nombre d'objets qui n'ont pas trouvé de place. */
  add(s: ItemStack, order?: number[]): number {
    let left = s.count;
    const idx = order ?? [...Array(this.size).keys()];
    // 1) compléter les piles existantes
    for (const i of idx) {
      const cur = this.slots[i];
      if (!cur || !sameItem(cur, s) || !this.accepts(i, s)) continue;
      const room = maxStack(cur) - cur.count;
      if (room <= 0) continue;
      const n = Math.min(room, left);
      cur.count += n;
      left -= n;
      if (!left) break;
    }
    // 2) emplacements vides
    if (left > 0)
      for (const i of idx) {
        if (this.slots[i] || !this.accepts(i, s)) continue;
        const n = Math.min(maxStack(s), left);
        this.slots[i] = { ...s, count: n, data: s.data ? { ...s.data } : undefined };
        left -= n;
        if (!left) break;
      }
    this.changed();
    return left;
  }

  count(id: number): number {
    let n = 0;
    for (const s of this.slots) if (s && s.id === id) n += s.count;
    return n;
  }

  /** Retire `n` objets du type donné ; renvoie false (sans rien retirer) si insuffisant. */
  remove(id: number, n: number): boolean {
    if (this.count(id) < n) return false;
    for (let i = this.size - 1; i >= 0 && n > 0; i--) {
      const s = this.slots[i];
      if (!s || s.id !== id) continue;
      const k = Math.min(n, s.count);
      s.count -= k;
      n -= k;
      if (s.count <= 0) this.slots[i] = null;
    }
    this.changed();
    return true;
  }

  clear(): void {
    this.slots.fill(null);
    this.changed();
  }

  isEmpty(): boolean {
    return this.slots.every((s) => !s);
  }
}

/** Inventaire du joueur : 0..8 barre d'accès rapide, 9..35 réserve. */
export class PlayerInventory extends Container {
  readonly armor: Container;
  readonly offhand: Container;
  selected = 0;

  constructor() {
    super(36, 'Inventaire');
    this.armor = new Container(4, 'Armure');
    const slots: ArmorSlot[] = ['head', 'chest', 'legs', 'feet'];
    this.armor.filters = slots.map((sl) => (s: ItemStack) => ITEMS[s.id]?.armor?.slot === sl || (sl === 'head' && ITEMS[s.id]?.key === 'pumpkin'));
    this.offhand = new Container(1, 'Seconde main');
  }

  held(): ItemStack | null {
    return this.get(this.selected);
  }

  /** Ajout en priorité dans la barre d'accès rapide. */
  give(s: ItemStack): number {
    const order = [...Array(36).keys()];
    return this.add(s, order);
  }

  consumeHeld(n = 1): void {
    const s = this.held();
    if (!s) return;
    s.count -= n;
    if (s.count <= 0) this.slots[this.selected] = null;
    this.changed();
  }

  armorPoints(): number {
    let p = 0;
    for (const s of this.armor.slots) if (s) p += ITEMS[s.id]?.armor?.points ?? 0;
    return p;
  }

  /** Les quatre pièces d'armure portées sont-elles de ce matériau (bonus d'ensemble) ? */
  fullSet(material: string): boolean {
    return this.armor.slots.every((s) => !!s && ITEMS[s.id]?.armor?.material === material);
  }
}

// ------------------------------------------------------------------ clics

export interface ClickContext {
  cursor: ItemStack | null;
}

/** Clic gauche : prendre / poser / fusionner / échanger. */
export function leftClick(c: Container, i: number, ctx: ClickContext): void {
  const slot = c.get(i);
  const cur = ctx.cursor;
  if (c.outputs.has(i)) {
    if (!slot) return;
    if (!cur) {
      ctx.cursor = slot;
      c.set(i, null);
    } else if (sameItem(cur, slot) && cur.count + slot.count <= maxStack(cur)) {
      cur.count += slot.count;
      c.set(i, null);
    }
    return;
  }
  if (!cur) {
    if (!slot) return;
    ctx.cursor = slot;
    c.set(i, null);
    return;
  }
  if (!c.accepts(i, cur)) return;
  if (!slot) {
    c.set(i, cur);
    ctx.cursor = null;
    return;
  }
  if (sameItem(cur, slot)) {
    const room = maxStack(slot) - slot.count;
    const n = Math.min(room, cur.count);
    slot.count += n;
    cur.count -= n;
    if (cur.count <= 0) ctx.cursor = null;
    c.changed();
    return;
  }
  // échange
  c.set(i, cur);
  ctx.cursor = slot;
}

/** Clic droit : prendre la moitié / poser un seul objet. */
export function rightClick(c: Container, i: number, ctx: ClickContext): void {
  const slot = c.get(i);
  const cur = ctx.cursor;
  if (c.outputs.has(i)) return leftClick(c, i, ctx);
  if (!cur) {
    if (!slot) return;
    const half = Math.ceil(slot.count / 2);
    ctx.cursor = { ...slot, count: half };
    slot.count -= half;
    c.set(i, slot.count > 0 ? slot : null);
    return;
  }
  if (!c.accepts(i, cur)) return;
  if (!slot) {
    c.set(i, { ...cur, count: 1 });
    cur.count--;
  } else if (sameItem(cur, slot) && slot.count < maxStack(slot)) {
    slot.count++;
    cur.count--;
    c.changed();
  } else return;
  if (cur.count <= 0) ctx.cursor = null;
}

/** Déplacement rapide (Maj+clic / double appui) vers les conteneurs cibles. */
export function quickMove(from: Container, i: number, targets: Array<{ c: Container; order?: number[] }>): void {
  const s = from.get(i);
  if (!s) return;
  let left = s.count;
  for (const t of targets) {
    if (!left) break;
    left = t.c.add({ ...s, count: left }, t.order);
  }
  if (left === s.count) return;
  if (left > 0) {
    s.count = left;
    from.changed();
  } else from.set(i, null);
}
