/**
 * Piles d'objets et conteneurs (inventaire du joueur, coffres, fourneaux…).
 * Les piles sont de simples objets JSON (sérialisation directe).
 */
import type { ItemRegistry } from '../registry/items';

export interface ItemStack {
  id: string;
  count: number;
  /** Usure (outils, armures). */
  dmg?: number;
  data?: Record<string, unknown>;
}

export const stack = (id: string, count = 1, dmg?: number): ItemStack => (dmg ? { id, count, dmg } : { id, count });
export const cloneStack = (s: ItemStack | null): ItemStack | null => (s ? { ...s, data: s.data ? structuredClone(s.data) : undefined } : null);

export function sameItem(a: ItemStack | null, b: ItemStack | null): boolean {
  if (!a || !b) return false;
  return a.id === b.id && (a.dmg ?? 0) === (b.dmg ?? 0) && JSON.stringify(a.data ?? null) === JSON.stringify(b.data ?? null);
}

export class Container {
  readonly slots: (ItemStack | null)[];
  /** Appelé après toute modification. */
  onChange: (() => void) | null = null;

  constructor(
    readonly size: number,
    protected items: ItemRegistry,
    /** Tableau existant à adopter (entités de blocs : coffres, fourneaux). */
    slots?: (ItemStack | null)[],
  ) {
    if (slots) {
      while (slots.length < size) slots.push(null);
      this.slots = slots;
    } else this.slots = new Array(size).fill(null);
  }

  maxStack(id: string): number {
    return this.items.get(id)?.stackSize ?? 64;
  }

  get(i: number): ItemStack | null {
    return this.slots[i] ?? null;
  }

  set(i: number, s: ItemStack | null): void {
    this.slots[i] = s && s.count > 0 ? s : null;
    this.changed();
  }

  changed(): void {
    this.onChange?.();
  }

  /** Ajoute une pile ; renvoie le reste (null si tout est rentré). Ordre de remplissage optionnel. */
  add(s: ItemStack, order?: number[]): ItemStack | null {
    if (!s || s.count <= 0) return null;
    const rest = { ...s };
    const max = this.maxStack(s.id);
    const idx = order ?? [...Array(this.size).keys()];
    // 1) compléter les piles existantes
    if (max > 1)
      for (const i of idx) {
        const cur = this.slots[i];
        if (cur && sameItem(cur, rest) && cur.count < max) {
          const n = Math.min(max - cur.count, rest.count);
          cur.count += n;
          rest.count -= n;
          if (rest.count <= 0) {
            this.changed();
            return null;
          }
        }
      }
    // 2) cases vides
    for (const i of idx) {
      if (!this.slots[i]) {
        const n = Math.min(max, rest.count);
        this.slots[i] = { ...rest, count: n };
        rest.count -= n;
        if (rest.count <= 0) {
          this.changed();
          return null;
        }
      }
    }
    this.changed();
    return rest;
  }

  /** Peut-on ajouter entièrement cette pile ? */
  canFit(s: ItemStack): boolean {
    let need = s.count;
    const max = this.maxStack(s.id);
    for (const cur of this.slots) {
      if (!cur) need -= max;
      else if (sameItem(cur, s)) need -= max - cur.count;
      if (need <= 0) return true;
    }
    return need <= 0;
  }

  count(idOrTag: string): number {
    let n = 0;
    for (const s of this.slots) if (s && this.items.matches(idOrTag, s.id)) n += s.count;
    return n;
  }

  /** Retire `count` objets correspondant (id ou #tag). Renvoie le nombre retiré. */
  remove(idOrTag: string, count: number): number {
    let left = count;
    for (let i = this.size - 1; i >= 0 && left > 0; i--) {
      const s = this.slots[i];
      if (!s || !this.items.matches(idOrTag, s.id)) continue;
      const n = Math.min(left, s.count);
      s.count -= n;
      left -= n;
      if (s.count <= 0) this.slots[i] = null;
    }
    if (left !== count) this.changed();
    return count - left;
  }

  /** Retire n objets d'une case. */
  take(i: number, n: number): ItemStack | null {
    const s = this.slots[i];
    if (!s) return null;
    const k = Math.min(n, s.count);
    const out = { ...s, count: k };
    s.count -= k;
    if (s.count <= 0) this.slots[i] = null;
    this.changed();
    return out;
  }

  clear(): void {
    this.slots.fill(null);
    this.changed();
  }

  isEmpty(): boolean {
    return this.slots.every((s) => !s);
  }

  serialize(): (ItemStack | null)[] {
    return this.slots.map((s) => cloneStack(s));
  }

  load(data: unknown): void {
    if (!Array.isArray(data)) return;
    for (let i = 0; i < this.size; i++) {
      const s = data[i] as ItemStack | null;
      this.slots[i] = s && typeof s.id === 'string' && this.items.has(s.id) && s.count > 0 ? { ...s } : null;
    }
    this.changed();
  }
}

export const ARMOR_SLOTS = ['head', 'chest', 'legs', 'feet'] as const;

/** Inventaire du joueur : 9 cases de barre rapide + 27 cases, armure, main secondaire. */
export class PlayerInventory extends Container {
  selected = 0;
  readonly armor: Container;
  readonly offhand: Container;
  /** Grille de fabrication 2x2 de l'inventaire. */
  readonly craft: Container;
  /** Pile tenue par le curseur dans l'interface. */
  cursor: ItemStack | null = null;

  constructor(items: ItemRegistry) {
    super(36, items);
    this.armor = new Container(4, items);
    this.offhand = new Container(1, items);
    this.craft = new Container(4, items);
  }

  get held(): ItemStack | null {
    return this.slots[this.selected];
  }

  /** Ajout prioritaire dans la barre rapide puis le sac. */
  give(s: ItemStack): ItemStack | null {
    const order = [...Array(36).keys()];
    return this.add(s, order);
  }

  /** Consomme un objet de la main. */
  consumeHeld(n = 1): void {
    const s = this.held;
    if (!s) return;
    s.count -= n;
    if (s.count <= 0) this.slots[this.selected] = null;
    this.changed();
  }

  /** Abîme l'objet tenu ; renvoie vrai s'il s'est cassé. */
  damageHeld(amount = 1): boolean {
    const s = this.held;
    if (!s) return false;
    const it = this.items.get(s.id);
    const dur = it?.tool?.durability ?? it?.shield?.durability;
    if (!dur) return false;
    s.dmg = (s.dmg ?? 0) + amount;
    if (s.dmg >= dur) {
      this.slots[this.selected] = null;
      this.changed();
      return true;
    }
    this.changed();
    return false;
  }

  armorPoints(): number {
    let a = 0;
    for (const s of this.armor.slots) if (s) a += this.items.get(s.id)?.armor?.defense ?? 0;
    return a;
  }

  warmth(): number {
    let w = 0;
    for (const s of this.armor.slots) if (s) w += this.items.get(s.id)?.armor?.warmth ?? 0;
    return w;
  }

  fireResistance(): number {
    let f = 0;
    for (const s of this.armor.slots) if (s) f += this.items.get(s.id)?.armor?.fireRes ?? 0;
    return Math.min(1, f);
  }

  /** Abîme les pièces d'armure portées. */
  damageArmor(amount: number): void {
    let changed = false;
    this.armor.slots.forEach((s, i) => {
      if (!s) return;
      const it = this.items.get(s.id);
      const dur = it?.armor?.durability;
      if (!dur) return;
      s.dmg = (s.dmg ?? 0) + Math.max(1, Math.floor(amount / 4));
      if (s.dmg >= dur) this.armor.slots[i] = null;
      changed = true;
    });
    if (changed) this.armor.changed();
  }

  /** Vide tout (mort) et renvoie les piles. */
  dropAll(): ItemStack[] {
    const out: ItemStack[] = [];
    for (const c of [this, this.armor, this.offhand, this.craft]) {
      for (let i = 0; i < c.size; i++) {
        const s = c.slots[i];
        if (s) out.push(s);
        c.slots[i] = null;
      }
      c.changed();
    }
    if (this.cursor) out.push(this.cursor);
    this.cursor = null;
    return out;
  }

  serializeAll(): Record<string, unknown> {
    return { main: this.serialize(), armor: this.armor.serialize(), offhand: this.offhand.serialize(), selected: this.selected };
  }

  loadAll(d: Record<string, unknown> | null | undefined): void {
    if (!d) return;
    this.load(d.main);
    this.armor.load(d.armor);
    this.offhand.load(d.offhand);
    this.selected = typeof d.selected === 'number' ? Math.max(0, Math.min(8, d.selected)) : 0;
  }
}
