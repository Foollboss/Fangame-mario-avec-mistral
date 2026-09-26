/**
 * Écrans d'inventaire : grille, barre rapide, armure, fabrication 2x2/3x3,
 * forge, fourneau, coffre, inventaire créatif, livre de recettes.
 * Souris : clic gauche/droit, maj+clic, glisser pour répartir, double-clic,
 * touches 1-9 pour échanger avec la barre, Q pour lâcher.
 */
import { h, clear } from './dom';
import type { Screen } from './ui';
import { Container, type ItemStack, sameItem } from '../inventory/inventory';
import { leftClick, rightClick, dragDistribute, shiftClick, collectToCursor, swapWithHotbar } from '../inventory/clicks';
import type { IconFactory } from '../render/icons';
import { RARITY_COLORS } from '../render/icons';
import type { Content } from '../registry/content';
import type { Player } from '../entity/player';
import { fillSlot } from './hud';
import type { Station, Recipe } from '../crafting/recipes';
import type { FurnaceData } from '../sim/furnace';
import { t, tr } from '../i18n/i18n';
import { pixelIcon } from './pixelIcons';

export interface InvContext {
  content: Content;
  icons: IconFactory;
  player: Player;
  /** Lâche une pile dans le monde. */
  drop(s: ItemStack): void;
  /** Évènement : objet fabriqué. */
  crafted(item: string, count: number): void;
  sound(name: string): void;
  onClose?(): void;
}

interface SlotRef {
  c: Container;
  i: number;
  output?: boolean;
  accept?: (s: ItemStack) => boolean;
  ghost?: string;
  /** Destination du clic maj. */
  shiftTo?: () => { c: Container; order?: number[] }[];
}

const ARMOR_ACCEPT = (slot: string) => (s: ItemStack, content: Content) => content.items.get(s.id)?.armor?.slot === slot;

abstract class ContainerScreen {
  readonly el: HTMLElement;
  protected panel: HTMLElement;
  private cursorEl: HTMLElement;
  private tipEl: HTMLElement;
  protected refs = new Map<HTMLElement, SlotRef>();
  private hover: HTMLElement | null = null;
  private drag: { button: number; slots: SlotRef[]; start: HTMLElement } | null = null;
  private lastClick = { el: null as HTMLElement | null, t: 0 };
  protected inv: Player['inventory'];
  private mouse = { x: 0, y: 0 };

  constructor(protected ctx: InvContext) {
    this.inv = ctx.player.inventory;
    this.panel = h('div', { class: 'panel' });
    this.cursorEl = h('div', { class: 'cursor-stack' });
    this.tipEl = h('div', { class: 'tip', style: { display: 'none' } });
    this.el = h('div', { class: 'screen dim' }, this.panel, this.cursorEl, this.tipEl);
    this.el.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.cursorEl.style.left = `${e.clientX - 20}px`;
      this.cursorEl.style.top = `${e.clientY - 20}px`;
      this.tipEl.style.left = `${e.clientX + 16}px`;
      this.tipEl.style.top = `${e.clientY - 10}px`;
    });
    this.el.addEventListener('contextmenu', (e) => e.preventDefault());
    // clic hors du panneau : lâcher la pile tenue
    this.el.addEventListener('mousedown', (e) => {
      if (e.target === this.el && this.inv.cursor) {
        const s = this.inv.cursor;
        if (e.button === 2 && s.count > 1) {
          this.ctx.drop({ ...s, count: 1 });
          s.count--;
        } else {
          this.ctx.drop(s);
          this.inv.cursor = null;
        }
        this.refresh();
      }
    });
    window.addEventListener('mouseup', this.onMouseUp);
  }

  protected slot(ref: SlotRef, big = false): HTMLElement {
    const el = h('div', { class: 'slot' + (big ? ' big' : '') });
    this.refs.set(el, ref);
    el.addEventListener('mousedown', (e) => this.onDown(e, el));
    el.addEventListener('mouseenter', () => {
      this.hover = el;
      if (this.drag && this.inv.cursor && !ref.output && !this.drag.slots.includes(ref)) this.drag.slots.push(ref);
      this.showTip(ref.c.get(ref.i));
    });
    el.addEventListener('mouseleave', () => {
      if (this.hover === el) this.hover = null;
      this.showTip(null);
    });
    return el;
  }

  private showTip(s: ItemStack | null): void {
    if (!s || this.inv.cursor) {
      this.tipEl.style.display = 'none';
      return;
    }
    clear(this.tipEl);
    this.tipEl.style.display = 'block';
    const it = this.ctx.content.items.get(s.id);
    this.tipEl.appendChild(h('div', { style: { color: RARITY_COLORS[it?.rarity ?? 'common'] } }, it?.name ?? s.id));
    if (it?.desc) this.tipEl.appendChild(h('div', { class: 'desc' }, it.desc));
    if (it?.weapon) this.tipEl.appendChild(h('div', { class: 'stat' }, t('{d} dégâts · recharge {c} s', { d: it.weapon.damage, c: it.weapon.cooldown }) + (it.weapon.element ? ' · ' + t(({ fire: tr('feu'), frost: tr('givre'), poison: tr('poison'), shock: tr('foudre') } as Record<string, string>)[it.weapon.element]) : '')));
    if (it?.ranged) this.tipEl.appendChild(h('div', { class: 'stat' }, t('Projectile : {d} dégâts', { d: it.ranged.damage })));
    if (it?.armor) this.tipEl.appendChild(h('div', { class: 'stat' }, t('+{d} armure', { d: it.armor.defense }) + (it.armor.warmth ? ' · ' + t('chaud') : '') + (it.armor.fireRes ? ' · ' + t('ignifuge') : '')));
    if (it?.tool && it.tool.type !== 'sword') this.tipEl.appendChild(h('div', { class: 'stat' }, t('Outil niveau {tier} · vitesse {speed}', { tier: it.tool.tier, speed: it.tool.speed })));
    if (it?.food && it.food.energy) this.tipEl.appendChild(h('div', { class: 'stat' }, t('Nourriture : +{e} énergie', { e: it.food.energy })));
    const dur = it?.tool?.durability ?? it?.armor?.durability ?? it?.shield?.durability;
    if (dur) this.tipEl.appendChild(h('div', { class: 'desc' }, t('Durabilité : {n} / {max}', { n: dur - (s.dmg ?? 0), max: dur })));
    if (it?.fuel || this.ctx.content.items.fuelTime(s.id)) this.tipEl.appendChild(h('div', { class: 'desc' }, t('Combustible ({s} s)', { s: this.ctx.content.items.fuelTime(s.id) })));
  }

  private onDown(e: MouseEvent, el: HTMLElement): void {
    e.preventDefault();
    e.stopPropagation();
    const ref = this.refs.get(el)!;
    const accept = ref.accept ?? (() => true);
    if (ref.output) {
      this.takeOutput(ref, e.shiftKey);
      this.refresh();
      return;
    }
    if (e.shiftKey && e.button === 0) {
      if (ref.shiftTo) shiftClick(ref.c, ref.i, ref.shiftTo());
      this.afterChange();
      return;
    }
    const now = performance.now();
    if (e.button === 0 && this.lastClick.el === el && now - this.lastClick.t < 280 && this.inv.cursor) {
      collectToCursor(this.allContainers(), this.inv);
      this.lastClick.el = null;
      this.afterChange();
      return;
    }
    this.lastClick = { el, t: now };
    if (this.inv.cursor && (e.button === 0 || e.button === 2)) {
      // début d'un glisser : l'action est décidée au relâchement
      this.drag = { button: e.button, slots: [ref], start: el };
      return;
    }
    if (e.button === 0) leftClick(ref.c, ref.i, this.inv, accept);
    else if (e.button === 2) rightClick(ref.c, ref.i, this.inv, accept);
    this.afterChange();
  }

  private onMouseUp = (e: MouseEvent): void => {
    if (!this.drag) return;
    const d = this.drag;
    this.drag = null;
    if (d.slots.length > 1) {
      dragDistribute(d.slots.map((r) => ({ c: r.c, i: r.i })), this.inv, d.button === 0 ? 'left' : 'right', (c, s) => {
        const r = d.slots.find((x) => x.c === c);
        return !r?.accept || r.accept(s);
      });
    } else {
      const ref = d.slots[0];
      const accept = ref.accept ?? (() => true);
      if (d.button === 0) leftClick(ref.c, ref.i, this.inv, accept);
      else rightClick(ref.c, ref.i, this.inv, accept);
    }
    void e;
    this.afterChange();
  };

  onKey(e: KeyboardEvent): boolean | void {
    if (!this.hover) return;
    const ref = this.refs.get(this.hover);
    if (!ref || ref.output) return;
    const m = /^Digit([1-9])$/.exec(e.code);
    if (m) {
      swapWithHotbar(ref.c, ref.i, this.inv, Number(m[1]) - 1);
      this.afterChange();
      return true;
    }
    if (e.code === 'KeyQ') {
      const taken = ref.c.take(ref.i, e.ctrlKey ? 64 : 1);
      if (taken) this.ctx.drop(taken);
      this.afterChange();
      return true;
    }
  }

  protected allContainers(): Container[] {
    return [...new Set([...this.refs.values()].filter((r) => !r.output).map((r) => r.c))];
  }

  protected afterChange(): void {
    this.onContentsChanged();
    this.refresh();
  }

  /** Recalcule les sorties (fabrication). */
  protected onContentsChanged(): void {}

  protected takeOutput(_ref: SlotRef, _shift: boolean): void {}

  refresh(): void {
    for (const [el, ref] of this.refs) {
      fillSlot(el, ref.c.get(ref.i), this.ctx.icons, this.ctx.content);
      if (!ref.c.get(ref.i) && ref.ghost) el.appendChild(h('img', { class: 'ghost', src: this.ctx.icons.icon(ref.ghost) }));
    }
    clear(this.cursorEl);
    const c = this.inv.cursor;
    if (c) {
      this.cursorEl.appendChild(h('img', { class: 'ico', src: this.ctx.icons.icon(c.id) }));
      if (c.count > 1) this.cursorEl.appendChild(h('div', { class: 'cnt' }, String(c.count)));
      this.tipEl.style.display = 'none';
    }
  }

  /** Grille du sac (27) + barre rapide (9). */
  protected playerGrid(shiftTarget: () => { c: Container; order?: number[] }[]): HTMLElement {
    const main = h('div', { class: 'slots', style: { gridTemplateColumns: 'repeat(9, 42px)' } });
    for (let i = 9; i < 36; i++) main.appendChild(this.slot({ c: this.inv, i, shiftTo: shiftTarget }));
    const bar = h('div', { class: 'slots', style: { gridTemplateColumns: 'repeat(9, 42px)', marginTop: '8px' } });
    for (let i = 0; i < 9; i++) bar.appendChild(this.slot({ c: this.inv, i, shiftTo: shiftTarget }));
    return h('div', {}, main, bar);
  }

  protected hotbarOrder = [...Array(9).keys()];
  protected mainOrder = [...Array(27).keys()].map((i) => i + 9);

  close(): void {
    window.removeEventListener('mouseup', this.onMouseUp);
    const c = this.inv.cursor;
    if (c) {
      const rest = this.inv.give(c);
      if (rest) this.ctx.drop(rest);
      this.inv.cursor = null;
    }
    this.ctx.onClose?.();
  }

  screen(): Screen {
    return {
      el: this.el,
      onKey: (e) => this.onKey(e),
      onClose: () => this.close(),
      closeOnInventoryKey: true,
    };
  }
}

// ---------------------------------------------------------------------------
/** Écran avec grille de fabrication (inventaire 2x2, atelier 3x3, forge 3x3). */
class CraftingScreen extends ContainerScreen {
  protected grid: Container;
  protected result: Container;
  protected gw: number;
  protected station: Station;
  private current: { recipe: Recipe; item: string; count: number } | null = null;
  private bookList: HTMLElement | null = null;
  private bookSearch: HTMLInputElement | null = null;

  constructor(ctx: InvContext, station: Station, grid: Container) {
    super(ctx);
    this.station = station;
    this.gw = station === 'hand' ? 2 : 3;
    this.grid = grid;
    this.result = new Container(1, ctx.content.items);
  }

  protected craftBlock(): HTMLElement {
    const gridEl = h('div', { class: 'slots', style: { gridTemplateColumns: `repeat(${this.gw}, 42px)` } });
    for (let i = 0; i < this.gw * this.gw; i++) gridEl.appendChild(this.slot({ c: this.grid, i, shiftTo: () => [{ c: this.inv, order: this.mainOrder }, { c: this.inv, order: this.hotbarOrder }] }));
    const out = this.slot({ c: this.result, i: 0, output: true }, true);
    return h('div', { style: { display: 'flex', alignItems: 'center' } }, gridEl, h('div', { class: 'arrow' }), out);
  }

  protected override onContentsChanged(): void {
    const cells = this.grid.slots.map((s) => s?.id ?? null);
    const m = this.ctx.content.recipes.match(cells, this.gw, this.gw, this.station);
    this.current = m;
    this.result.slots[0] = m ? { id: m.item, count: m.count } : null;
    this.renderBook();
  }

  /** Consomme une fois les ingrédients de la grille. */
  private consume(): void {
    for (let i = 0; i < this.grid.size; i++) {
      const s = this.grid.slots[i];
      if (!s) continue;
      s.count--;
      if (s.count <= 0) {
        // les seaux reviennent vides
        this.grid.slots[i] = s.id.startsWith('seau_') ? { id: 'seau', count: 1 } : null;
      }
    }
    this.grid.changed();
  }

  protected override takeOutput(_ref: SlotRef, shift: boolean): void {
    if (!this.current) return;
    const res: ItemStack = { id: this.current.item, count: this.current.count };
    if (shift) {
      let n = 0;
      while (this.current && n < 64) {
        const r: ItemStack = { id: this.current.item, count: this.current.count };
        if (!this.inv.canFit(r)) break;
        this.inv.give(r);
        this.consume();
        this.ctx.crafted(r.id, r.count);
        this.onContentsChanged();
        n++;
      }
      if (n > 0) this.ctx.sound('clic');
      return;
    }
    const cur = this.inv.cursor;
    const max = this.ctx.content.items.get(res.id)?.stackSize ?? 64;
    if (cur && (!sameItem(cur, res) || cur.count + res.count > max)) return;
    if (cur) cur.count += res.count;
    else this.inv.cursor = res;
    this.consume();
    this.ctx.crafted(res.id, res.count);
    this.ctx.sound('clic');
    this.onContentsChanged();
  }

  /** Livre de recettes : liste filtrable, remplissage automatique. */
  protected recipeBook(): HTMLElement {
    this.bookSearch = h('input', { placeholder: t('Rechercher une recette…') }) as HTMLInputElement;
    this.bookSearch.addEventListener('input', () => this.renderBook());
    this.bookSearch.addEventListener('keydown', (e) => e.stopPropagation());
    this.bookList = h('div', { class: 'rb-list' });
    const el = h('div', { class: 'panel recipe-book' }, h('div', { class: 'ptitle' }, t('Livre de recettes')), this.bookSearch, this.bookList);
    this.renderBook();
    return el;
  }

  private haveIngredients(r: Recipe): boolean {
    const pool = [...this.inv.slots, ...this.grid.slots].filter(Boolean) as ItemStack[];
    const counts = new Map<string, number>();
    for (const s of pool) counts.set(s.id, (counts.get(s.id) ?? 0) + s.count);
    for (const [spec, need] of this.ctx.content.recipes.ingredientCounts(r)) {
      let left = need;
      for (const [id, c] of counts) {
        if (!this.ctx.content.items.matches(spec, id)) continue;
        const take = Math.min(c, left);
        counts.set(id, c - take);
        left -= take;
        if (left <= 0) break;
      }
      if (left > 0) return false;
    }
    return true;
  }

  private renderBook(): void {
    if (!this.bookList) return;
    const q = (this.bookSearch?.value ?? '').trim().toLowerCase();
    clear(this.bookList);
    const book = this.ctx.content.recipes;
    const seen = new Set<string>();
    const entries: { r: Recipe; ok: boolean }[] = [];
    for (const r of book.recipes) {
      if (!book.fitsIn(r, this.gw, this.gw)) continue;
      if (r.station === 'forge' && this.station !== 'forge') continue;
      if (seen.has(r.result.item)) continue;
      const name = this.ctx.content.items.name(r.result.item).toLowerCase();
      if (q && !name.includes(q)) continue;
      seen.add(r.result.item);
      entries.push({ r, ok: this.haveIngredients(r) });
    }
    entries.sort((a, b) => Number(b.ok) - Number(a.ok));
    for (const { r, ok } of entries.slice(0, 200)) {
      const it = h('div', { class: 'rb-item ' + (ok ? 'ok' : 'no'), title: this.recipeText(r) }, h('img', { src: this.ctx.icons.icon(r.result.item) }));
      it.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        if (ok) this.autoFill(r);
      });
      this.bookList.appendChild(it);
    }
  }

  private recipeText(r: Recipe): string {
    const n = this.ctx.content.items;
    const tags: Record<string, string> = { planks: t('planches'), cobble: t('moellon'), string: t('fil'), log: t('bûche') };
    const parts = [...this.ctx.content.recipes.ingredientCounts(r)].map(([spec, c]) => `${c}× ${spec.startsWith('#') ? `(${tags[spec.slice(1)] ?? spec.slice(1)})` : n.name(spec)}`);
    return `${n.name(r.result.item)} ×${r.result.count ?? 1}${r.station === 'forge' ? ' (' + t('forge') + ')' : ''}\n` + parts.join(', ');
  }

  /** Remplit la grille à partir de l'inventaire. */
  private autoFill(r: Recipe): void {
    // vide la grille dans l'inventaire
    for (let i = 0; i < this.grid.size; i++) {
      const s = this.grid.slots[i];
      if (s) {
        const rest = this.inv.give(s);
        if (rest) this.ctx.drop(rest);
        this.grid.slots[i] = null;
      }
    }
    const takeOne = (spec: string): string | null => {
      for (let i = 0; i < 36; i++) {
        const s = this.inv.slots[i];
        if (s && this.ctx.content.items.matches(spec, s.id)) {
          s.count--;
          const id = s.id;
          if (s.count <= 0) this.inv.slots[i] = null;
          return id;
        }
      }
      return null;
    };
    if (r.type === 'shaped' && r.grid) {
      r.grid.forEach((row, y) =>
        row.forEach((spec, x) => {
          if (!spec) return;
          const id = takeOne(spec);
          if (id) this.grid.slots[y * this.gw + x] = { id, count: 1 };
        }),
      );
    } else {
      (r.ingredients ?? []).forEach((spec, k) => {
        const id = takeOne(spec);
        if (id) this.grid.slots[k] = { id, count: 1 };
      });
    }
    this.inv.changed();
    this.grid.changed();
    this.afterChange();
  }

  override close(): void {
    // rend le contenu de la grille temporaire
    if (this.station !== 'hand') {
      for (let i = 0; i < this.grid.size; i++) {
        const s = this.grid.slots[i];
        if (s) {
          const rest = this.inv.give(s);
          if (rest) this.ctx.drop(rest);
          this.grid.slots[i] = null;
        }
      }
    }
    super.close();
  }
}

/** Silhouette pixel-art du personnage (création originale). */
function playerFigure(): HTMLElement {
  const c = h('canvas', { width: 26, height: 36 }) as HTMLCanvasElement;
  c.style.width = '104px';
  c.style.height = '144px';
  const g = c.getContext('2d')!;
  const px = (x: number, y: number, w: number, hh: number, col: string) => {
    g.fillStyle = col;
    g.fillRect(x, y, w, hh);
  };
  px(9, 2, 8, 8, '#e8b88a'); // tête
  px(9, 2, 8, 3, '#5a3a24'); // cheveux
  px(11, 6, 1, 1, '#1a1a2a');
  px(14, 6, 1, 1, '#1a1a2a');
  px(8, 10, 10, 2, '#d04a2a'); // écharpe
  px(8, 12, 10, 10, '#2a6a8a'); // tunique
  px(8, 20, 10, 2, '#6a4a2a'); // ceinture
  px(5, 12, 3, 9, '#2a6a8a');
  px(18, 12, 3, 9, '#2a6a8a');
  px(5, 21, 3, 2, '#e8b88a');
  px(18, 21, 3, 2, '#e8b88a');
  px(9, 22, 4, 10, '#3a3a5a');
  px(13, 22, 4, 10, '#3a3a5a');
  px(9, 31, 4, 3, '#4a2a1a');
  px(13, 31, 4, 3, '#4a2a1a');
  return h('div', { class: 'player-figure' }, c);
}

export class PlayerInventoryScreen extends CraftingScreen {
  constructor(ctx: InvContext) {
    super(ctx, 'hand', ctx.player.inventory.craft);
    const inv = this.inv;
    const toInv = () => [{ c: inv, order: this.mainOrder }, { c: inv, order: this.hotbarOrder }];
    const armorEl = h('div', { class: 'slots', style: { gridTemplateColumns: '42px' } });
    const ghost = ['casque_fer', 'plastron_fer', 'jambieres_fer', 'bottes_fer'];
    ['head', 'chest', 'legs', 'feet'].forEach((slot, i) => {
      const acc = ARMOR_ACCEPT(slot);
      armorEl.appendChild(this.slot({ c: inv.armor, i, accept: (s) => acc(s, ctx.content), ghost: ghost[i], shiftTo: toInv }));
    });
    const off = this.slot({ c: inv.offhand, i: 0, ghost: 'bouclier', shiftTo: toInv });
    // maj+clic depuis le sac : armure d'abord si applicable
    const smart = (fromHotbar: boolean) => () => {
      const targets: { c: Container; order?: number[] }[] = [];
      targets.push({ c: inv, order: fromHotbar ? this.mainOrder : this.hotbarOrder });
      return targets;
    };
    const grid = this.playerGridSmart(smart);
    this.panel.appendChild(
      h(
        'div',
        { class: 'inv-layout' },
        h('div', { class: 'inv-top' }, armorEl, playerFigure(), h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, h('div', { class: 'ptitle' }, t('Fabrication')), this.craftBlock(), h('div', { style: { marginTop: '10px' } }, h('div', { class: 'ptitle' }, t('Main secondaire')), off))),
        grid,
      ),
    );
    this.el.insertBefore(h('div', { style: { display: 'flex', gap: '10px', alignItems: 'flex-start' } }, this.recipeBook(), this.panel), this.cursorAnchor());
    this.onContentsChanged();
    this.refresh();
  }

  private cursorAnchor(): Node {
    return this.el.children[1];
  }

  private playerGridSmart(smart: (fromHotbar: boolean) => () => { c: Container; order?: number[] }[]): HTMLElement {
    const inv = this.inv;
    const armorFirst = (i: number, base: () => { c: Container; order?: number[] }[]) => () => {
      const s = inv.get(i);
      const slot = s ? this.ctx.content.items.get(s.id)?.armor?.slot : undefined;
      if (slot) {
        const idx = ['head', 'chest', 'legs', 'feet'].indexOf(slot);
        if (!inv.armor.get(idx)) return [{ c: inv.armor, order: [idx] }, ...base()];
      }
      return base();
    };
    const main = h('div', { class: 'slots', style: { gridTemplateColumns: 'repeat(9, 42px)' } });
    for (let i = 9; i < 36; i++) main.appendChild(this.slot({ c: inv, i, shiftTo: armorFirst(i, smart(false)) }));
    const bar = h('div', { class: 'slots', style: { gridTemplateColumns: 'repeat(9, 42px)', marginTop: '8px' } });
    for (let i = 0; i < 9; i++) bar.appendChild(this.slot({ c: inv, i, shiftTo: armorFirst(i, smart(true)) }));
    return h('div', {}, main, bar);
  }
}

export class WorkbenchScreen extends CraftingScreen {
  constructor(ctx: InvContext, forge: boolean) {
    super(ctx, forge ? 'forge' : 'atelier', new Container(9, ctx.content.items));
    const toGrid = () => [{ c: this.grid }];
    this.panel.appendChild(
      h(
        'div',
        { class: 'inv-layout' },
        h('div', { class: 'ptitle' }, forge ? t('Forge runique') : t('Atelier')),
        h('div', { style: { display: 'flex', justifyContent: 'center', margin: '4px 0 10px' } }, this.craftBlock()),
        h('div', { class: 'ptitle' }, t('Inventaire')),
        this.playerGrid(toGrid),
      ),
    );
    this.el.insertBefore(h('div', { style: { display: 'flex', gap: '10px', alignItems: 'flex-start' } }, this.recipeBook(), this.panel), this.el.children[1]);
    this.onContentsChanged();
    this.refresh();
  }
}

export class ChestScreen extends ContainerScreen {
  constructor(ctx: InvContext, chest: Container, title: string) {
    super(ctx);
    const grid = h('div', { class: 'slots', style: { gridTemplateColumns: 'repeat(9, 42px)' } });
    for (let i = 0; i < chest.size; i++) grid.appendChild(this.slot({ c: chest, i, shiftTo: () => [{ c: this.inv, order: this.hotbarOrder }, { c: this.inv, order: this.mainOrder }] }));
    this.panel.appendChild(h('div', { class: 'inv-layout' }, h('div', { class: 'ptitle' }, title), grid, h('div', { class: 'ptitle' }, t('Inventaire')), this.playerGrid(() => [{ c: chest }])));
    this.refresh();
  }
}

export class FurnaceScreen extends ContainerScreen {
  private flame: HTMLElement;
  private arrow: HTMLElement;
  private timer: number;
  constructor(
    ctx: InvContext,
    private data: FurnaceData,
    box: Container,
  ) {
    super(ctx);
    const items = ctx.content.items;
    const recipes = ctx.content.recipes;
    this.flame = h('div', { class: 'fill' });
    this.arrow = h('div', { class: 'fill' });
    const input = this.slot({ c: box, i: 0, shiftTo: () => [{ c: this.inv, order: this.mainOrder }, { c: this.inv, order: this.hotbarOrder }] });
    const fuel = this.slot({ c: box, i: 1, accept: (s) => items.fuelTime(s.id) > 0, shiftTo: () => [{ c: this.inv, order: this.mainOrder }, { c: this.inv, order: this.hotbarOrder }] });
    const output = this.slot({ c: box, i: 2, accept: () => false, shiftTo: () => [{ c: this.inv, order: this.mainOrder }, { c: this.inv, order: this.hotbarOrder }] }, true);
    const toFurnace = (fromInv: Container) => () => {
      void fromInv;
      return [{ c: box, order: [0] }];
    };
    const smartShift = (i: number) => () => {
      const s = this.inv.get(i);
      if (s && recipes.smeltResult(s.id)) return [{ c: box, order: [0] }];
      if (s && items.fuelTime(s.id) > 0) return [{ c: box, order: [1] }];
      return i < 9 ? [{ c: this.inv, order: this.mainOrder }] : [{ c: this.inv, order: this.hotbarOrder }];
    };
    void toFurnace;
    const main = h('div', { class: 'slots', style: { gridTemplateColumns: 'repeat(9, 42px)' } });
    for (let i = 9; i < 36; i++) main.appendChild(this.slot({ c: this.inv, i, shiftTo: smartShift(i) }));
    const bar = h('div', { class: 'slots', style: { gridTemplateColumns: 'repeat(9, 42px)', marginTop: '8px' } });
    for (let i = 0; i < 9; i++) bar.appendChild(this.slot({ c: this.inv, i, shiftTo: smartShift(i) }));
    this.panel.appendChild(
      h(
        'div',
        { class: 'inv-layout' },
        h('div', { class: 'ptitle' }, t('Fourneau')),
        h(
          'div',
          { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', margin: '6px 0 12px' } },
          h('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } }, input, h('div', { class: 'flame' }, this.flame), fuel),
          h('div', { class: 'arrow' }, this.arrow),
          output,
        ),
        h('div', { class: 'ptitle' }, t('Inventaire')),
        h('div', {}, main, bar),
      ),
    );
    this.refresh();
    this.timer = window.setInterval(() => this.tickVisual(), 100);
  }

  private tickVisual(): void {
    const d = this.data;
    this.flame.style.height = `${d.burnMax ? (d.burn / d.burnMax) * 100 : 0}%`;
    this.arrow.style.width = `${d.cookMax ? (d.cook / d.cookMax) * 28 : 0}px`;
    this.refresh();
  }

  override close(): void {
    clearInterval(this.timer);
    super.close();
  }
}

const CREATIVE_TABS: { id: string; name: string; test: (c: Content, id: string) => boolean }[] = [
  { id: 'construction', name: tr('Construction'), test: (c, id) => {
    const it = c.items.get(id)!;
    return it.isBlock && !it.tagSet.has('plant') && !it.tagSet.has('sapling') && !it.tagSet.has('ore') && !it.tagSet.has('leaves') && !it.tagSet.has('log');
  } },
  { id: 'nature', name: tr('Nature'), test: (c, id) => {
    const it = c.items.get(id)!;
    return it.isBlock && (it.tagSet.has('plant') || it.tagSet.has('sapling') || it.tagSet.has('ore') || it.tagSet.has('leaves') || it.tagSet.has('log') || it.tagSet.has('soil') || it.tagSet.has('sand') || it.tagSet.has('stone'));
  } },
  { id: 'outils', name: tr('Outils et combat'), test: (c, id) => {
    const it = c.items.get(id)!;
    return !!(it.tool || it.weapon || it.armor || it.ranged || it.shield) || id === 'fleche';
  } },
  { id: 'nourriture', name: tr('Nourriture'), test: (c, id) => !!c.items.get(id)!.food },
  { id: 'divers', name: tr('Matériaux et divers'), test: (c, id) => {
    const it = c.items.get(id)!;
    return !it.isBlock && !it.tool && !it.weapon && !it.armor && !it.food && !it.ranged && !it.shield;
  } },
];

export class CreativeScreen extends ContainerScreen {
  private gridEl: HTMLElement;
  private tab = 'construction';
  private search: HTMLInputElement;
  private palette: Container;
  private tabsEl: HTMLElement;

  constructor(ctx: InvContext) {
    super(ctx);
    this.palette = new Container(0, ctx.content.items);
    this.gridEl = h('div', { class: 'creative-grid' });
    this.search = h('input', { class: 'input', placeholder: t('Rechercher…'), style: { width: '100%', height: '30px', fontSize: '16px', marginBottom: '6px' } }) as HTMLInputElement;
    this.search.addEventListener('input', () => this.renderGrid());
    this.search.addEventListener('keydown', (e) => e.stopPropagation());
    this.tabsEl = h('div', { class: 'creative-tabs' });
    const bar = h('div', { class: 'slots', style: { gridTemplateColumns: 'repeat(9, 42px)', marginTop: '8px' } });
    for (let i = 0; i < 9; i++) bar.appendChild(this.slot({ c: this.inv, i, shiftTo: () => [] }));
    const trash = h('div', { class: 'slot', title: t('Détruire l’objet tenu') }, h('div', { style: { position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' } }, pixelIcon('croix', 'trash')));
    trash.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.inv.cursor = null;
      this.refresh();
    });
    this.panel.appendChild(h('div', { class: 'inv-layout' }, this.tabsEl, this.search, this.gridEl, h('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '8px' } }, bar, trash)));
    this.renderTabs();
    this.renderGrid();
    this.refresh();
  }

  private renderTabs(): void {
    clear(this.tabsEl);
    for (const tab of [...CREATIVE_TABS, { id: 'tout', name: tr('Tout'), test: () => true }]) {
      const b = h('div', { class: 'ctab' + (tab.id === this.tab ? ' on' : '') }, t(tab.name));
      b.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        this.tab = tab.id;
        this.renderTabs();
        this.renderGrid();
      });
      this.tabsEl.appendChild(b);
    }
  }

  private renderGrid(): void {
    clear(this.gridEl);
    const q = this.search.value.trim().toLowerCase();
    const tab = CREATIVE_TABS.find((t) => t.id === this.tab);
    const c = this.ctx.content;
    for (const it of c.items.list) {
      if (q ? !it.name.toLowerCase().includes(q) && !it.id.includes(q) : tab && !tab.test(c, it.id)) continue;
      const el = h('div', { class: 'slot' }, h('img', { class: 'ico', src: this.ctx.icons.icon(it.id) }));
      el.title = it.name;
      el.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        const full = { id: it.id, count: e.button === 2 ? 1 : it.stackSize };
        if (e.shiftKey) this.inv.give(full);
        else if (this.inv.cursor) this.inv.cursor = null;
        else this.inv.cursor = full;
        this.refresh();
      });
      this.gridEl.appendChild(el);
    }
  }
}
