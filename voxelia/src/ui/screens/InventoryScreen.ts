/**
 * Écrans d'inventaire (style panneaux gris) : inventaire de survie (armure, poupée,
 * artisanat 2×2, livre de recettes), inventaire créatif (catalogue par catégories + recherche),
 * établi 3×3, four, coffre et échanges avec les villageois.
 * Souris : clic gauche prendre/poser, clic droit moitié/un seul, Maj+clic déplacement rapide.
 * Tactile : appui = prendre/poser, appui long = déplacement rapide.
 */
import { h } from '../dom';
import { icon } from '../icons';
import { drawStack, hideTooltip, showTooltip, stackSignature } from '../slots';
import { Container, PlayerInventory, leftClick, rightClick, quickMove, type ClickContext } from '../../inventory/Container';
import { RECIPES, findRecipe, matchesIngredient, recipeCost, type Recipe } from '../../inventory/recipes';
import { ITEMS, ITEM_BY_KEY, itemName, maxStack, sameItem, type ItemStack } from '../../items/items';
import { COOK_TIME, type FurnaceData } from '../../game/BlockEntityTicker';
import { PLAYER_SKINS } from '../../entities/models';
import type { Villager, Trade } from '../../entities/Villager';
import type { Screen } from '../UIManager';
import type { Game } from '../../game/Game';
import type { ModelPreview } from '../../render/ModelPreview';

export type InvMode = 'survival' | 'creative' | 'crafting' | 'furnace' | 'chest' | 'trade';

interface SlotRef {
  c: Container;
  i: number;
  el: HTMLElement;
  sig: string;
}

type Cat = 'all' | 'construction' | 'equipment' | 'items' | 'nature' | 'search';

const CATS: Array<[Cat, string, string]> = [
  ['construction', 'Construction', 'bricks'],
  ['equipment', 'Équipement', 'iron_sword'],
  ['items', 'Objets', 'bed'],
  ['nature', 'Nature', 'grass_block'],
];

const BUCKETS = new Set(['water_bucket', 'lava_bucket', 'milk_bucket']);

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

export class InventoryScreen implements Screen {
  readonly el: HTMLElement;
  readonly modalGame = true;
  private ctx: ClickContext = { cursor: null };
  private slots: SlotRef[] = [];
  private cursorEl: HTMLElement;
  private cursorSig = '';
  private craft: Container | null = null;
  private craftOut: Container | null = null;
  private craftW = 2;
  private furnace: FurnaceData | null = null;
  private furnaceC: Container | null = null;
  private chestC: Container | null = null;
  private pos: [number, number, number] | null = null;
  private villager: Villager | null = null;
  private tab: Cat;
  private search = '';
  private craftableOnly = false;
  private leftBody: HTMLElement | null = null;
  private leftTitle: HTMLElement | null = null;
  private doll: HTMLCanvasElement | null = null;
  private fireEl: HTMLElement | null = null;
  private arrowEl: HTMLElement | null = null;
  private time = 0;
  private mouse = { x: 0, y: 0 };
  private invSig = '';
  private unsub: Array<() => void> = [];
  private longTimer = 0;
  private longFired = false;

  constructor(
    private g: Game,
    private mode: InvMode,
    private preview: ModelPreview | null,
    opts: { x?: number; y?: number; z?: number; villager?: Villager } = {},
  ) {
    this.tab = mode === 'creative' ? 'construction' : 'all';
    if (opts.x !== undefined) this.pos = [opts.x, opts.y!, opts.z!];
    this.villager = opts.villager ?? null;
    this.cursorEl = h('div', { class: 'inv-cursor' });
    const wrap = h('div', { class: 'inv-wrap' });
    const left = this.buildLeft();
    if (left) wrap.appendChild(left);
    wrap.appendChild(this.buildRight());
    this.el = h('div', { class: 'inv-back' }, wrap, this.cursorEl);
    this.el.addEventListener('pointermove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.cursorEl.style.left = e.clientX + 'px';
      this.cursorEl.style.top = e.clientY + 'px';
    });
    this.el.addEventListener('pointerdown', (e) => {
      // Lâcher l'objet du curseur hors des panneaux
      if (e.target === this.el && this.ctx.cursor) {
        const s = this.ctx.cursor;
        if (e.button === 2) {
          this.g.throwItem({ ...s, count: 1 });
          s.count--;
          if (s.count <= 0) this.ctx.cursor = null;
        } else {
          this.g.throwItem(s);
          this.ctx.cursor = null;
        }
        this.refreshCursor();
      } else if (e.target === this.el && !this.ctx.cursor) this.g.app.ui.back();
    });
    this.el.addEventListener('contextmenu', (e) => e.preventDefault());
    const inv = g.player.inventory;
    this.unsub.push(inv.onChange(() => this.onInventoryChanged()));
    this.renderLeft();
    this.refreshAll();
    requestAnimationFrame(() => this.fit(wrap));
    this.onResize = () => this.fit(wrap);
    window.addEventListener('resize', this.onResize);
  }

  private onResize: (() => void) | null = null;

  /** Réduit l'échelle de l'interface si les panneaux dépassent de l'écran (petits écrans larges). */
  private fit(wrap: HTMLElement): void {
    this.el.style.removeProperty('--u');
    // Mesure la taille naturelle (sans la limite de hauteur de .inv-wrap)
    const prevMax = wrap.style.maxHeight;
    wrap.style.maxHeight = 'none';
    const r = wrap.getBoundingClientRect();
    wrap.style.maxHeight = prevMax;
    const k = Math.min(1, (window.innerHeight * 0.97) / Math.max(1, r.height), (window.innerWidth * 0.98) / Math.max(1, r.width));
    if (k < 1) {
      const u = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--u')) || 2;
      this.el.style.setProperty('--u', (u * k).toFixed(3) + 'px');
    }
  }

  // ------------------------------------------------------------------ construction
  private buildLeft(): HTMLElement | null {
    if (this.mode === 'furnace' || this.mode === 'chest') return null;
    const col = h('div', { class: 'inv-col' });
    const tabs = h('div', { class: 'inv-tabs' });
    if (this.mode === 'trade') {
      tabs.appendChild(h('div', { class: 'inv-tab wide active' }, 'Échanges'));
    } else {
      const mk = (cat: Cat, title: string, content: HTMLElement | string, wide = false) => {
        const t = h('div', { class: 'inv-tab' + (wide ? ' wide' : '') + (this.tab === cat ? ' active' : ''), title }, content);
        t.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          this.tab = cat;
          tabs.querySelectorAll('.inv-tab').forEach((x) => x.classList.remove('active'));
          t.classList.add('active');
          this.renderLeft();
          this.g.app.audio.play('click', { volume: 0.4 });
        });
        tabs.appendChild(t);
      };
      if (this.mode !== 'creative') mk('all', 'Toutes les recettes', h('img', { src: icon('book') }), false);
      for (const [cat, title, item] of CATS) mk(cat, title, h('img', { src: this.g.app.icons.get(ITEM_BY_KEY.get(item)!.id) }));
      if (this.mode === 'creative') mk('search', 'Rechercher', h('img', { src: icon('search_dark') }));
    }
    const panel = h('div', { class: 'panel', style: 'width:calc(var(--u)*182)' });
    this.leftTitle = h('div', { class: 'panel-title left' });
    panel.appendChild(this.leftTitle);
    if (this.mode !== 'trade') {
      const input = h('input', { placeholder: 'Rechercher…', spellcheck: 'false' }) as HTMLInputElement;
      input.addEventListener('input', () => {
        this.search = input.value;
        if (this.mode === 'creative' && this.tab !== 'search' && this.search) {
          this.tab = 'search';
          tabs.querySelectorAll('.inv-tab').forEach((x) => x.classList.remove('active'));
          tabs.lastElementChild?.classList.add('active');
        }
        this.renderLeft();
      });
      input.addEventListener('keydown', (e) => {
        e.stopPropagation();
        if (e.key === 'Escape') input.blur();
      });
      const row = h('div', { class: 'recipe-search' }, h('img', { src: icon('search_dark'), style: 'width:calc(var(--u)*9)' }), input);
      if (this.mode !== 'creative') {
        const cb = h('div', { class: 'mini-toggle', style: 'cursor:pointer', title: 'Uniquement les recettes réalisables' });
        const box = h('div', { class: 'slot', style: 'width:calc(var(--u)*10);height:calc(var(--u)*10)' });
        cb.append(box, h('span', null, 'Réalisables'));
        cb.addEventListener('pointerdown', (e) => {
          e.stopPropagation();
          this.craftableOnly = !this.craftableOnly;
          box.classList.toggle('green', this.craftableOnly);
          this.renderLeft();
        });
        row.appendChild(cb);
      }
      panel.appendChild(row);
    }
    this.leftBody = h('div', { class: 'slots-scroll', style: 'height:calc(var(--u)*148)' });
    panel.appendChild(this.leftBody);
    col.append(tabs, panel);
    return col;
  }

  private buildRight(): HTMLElement {
    const g = this.g;
    const inv = g.player.inventory;
    const col = h('div', { class: 'inv-col' });
    col.appendChild(h('div', { class: 'inv-tabs' }));
    const panel = h('div', { class: 'panel' });
    const close = h('div', { class: 'inv-close', title: 'Fermer' }, h('img', { src: icon('close'), style: 'width:80%' }));
    close.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      g.app.ui.back();
    });
    panel.appendChild(close);
    const top = h('div', { class: 'row', style: 'align-items:flex-start;gap:calc(var(--u)*6);margin-bottom:calc(var(--u)*6)' });
    if (this.mode === 'survival' || this.mode === 'creative') {
      // Armure + poupée + seconde main + artisanat 2x2
      const armor = h('div', { class: 'grid', style: 'grid-template-columns:repeat(1,auto)' });
      const ghosts = ['helmet', 'chestplate', 'leggings', 'boots'];
      for (let i = 0; i < 4; i++) armor.appendChild(this.slot(inv.armor, i, 'leather_' + ghosts[i]));
      this.doll = h('canvas', { class: 'player-doll', width: '104', height: '140' }) as HTMLCanvasElement;
      const off = h('div', { class: 'grid', style: 'align-self:flex-end' }, this.slot(inv.offhand, 0, 'shield'));
      top.append(armor, this.doll, off);
      if (this.mode === 'survival') {
        this.craftW = 2;
        top.appendChild(this.buildCraftGrid(2));
      }
    } else if (this.mode === 'crafting') {
      this.craftW = 3;
      top.appendChild(h('div', { class: 'panel-title left', style: 'width:100%' }, 'Artisanat'));
      top.style.flexDirection = 'column';
      top.appendChild(this.buildCraftGrid(3));
    } else if (this.mode === 'furnace') {
      top.style.flexDirection = 'column';
      top.appendChild(h('div', { class: 'panel-title left' }, 'Four'));
      top.appendChild(this.buildFurnace());
    } else if (this.mode === 'chest') {
      top.style.flexDirection = 'column';
      const be = this.pos ? g.world.blockEntity(this.pos[0], this.pos[1], this.pos[2]) : undefined;
      const c = new Container(27, 'Coffre');
      if (be && Array.isArray(be.items)) {
        if (be.items.length < 27) for (let i = be.items.length; i < 27; i++) (be.items as unknown[]).push(null);
        c.slots = be.items as Array<ItemStack | null>;
      }
      this.chestC = c;
      top.appendChild(h('div', { class: 'panel-title left' }, g.world.id(this.pos![0], this.pos![1], this.pos![2]) === ITEM_BY_KEY.get('barrel')?.block ? 'Tonneau' : 'Coffre'));
      const grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(9,auto)' });
      for (let i = 0; i < 27; i++) grid.appendChild(this.slot(c, i));
      top.appendChild(grid);
    } else if (this.mode === 'trade') {
      top.style.flexDirection = 'column';
      const v = this.villager!;
      top.appendChild(h('div', { class: 'panel-title left' }, `${v.professionName} — niveau ${v.level}`));
      top.appendChild(h('div', { class: 'dim', style: 'color:#555' }, 'Choisissez un échange dans la liste. Les émeraudes et objets demandés sont pris dans votre inventaire.'));
    }
    panel.appendChild(top);
    panel.appendChild(h('div', { class: 'panel-title left' }, 'Inventaire'));
    const main = h('div', { class: 'grid', style: 'grid-template-columns:repeat(9,auto)' });
    for (let i = 9; i < 36; i++) main.appendChild(this.slot(inv, i));
    const hot = h('div', { class: 'grid', style: 'grid-template-columns:repeat(9,auto);margin-top:calc(var(--u)*4)' });
    for (let i = 0; i < 9; i++) hot.appendChild(this.slot(inv, i));
    panel.append(main, hot);
    col.appendChild(panel);
    return col;
  }

  private buildCraftGrid(w: number): HTMLElement {
    this.craft = new Container(w * w, 'Artisanat');
    this.craftOut = new Container(1, 'Résultat');
    this.craftOut.outputs.add(0);
    const grid = h('div', { class: 'grid', style: `grid-template-columns:repeat(${w},auto)` });
    for (let i = 0; i < w * w; i++) grid.appendChild(this.slot(this.craft, i));
    const out = this.slot(this.craftOut, 0);
    out.classList.add('big');
    this.unsub.push(this.craft.onChange(() => this.updateCraftOutput()));
    return h('div', { class: 'row', style: 'gap:calc(var(--u)*4);align-items:center' }, grid, h('div', { class: 'arrow-right' }), out);
  }

  private buildFurnace(): HTMLElement {
    const g = this.g;
    const [x, y, z] = this.pos!;
    let be = g.world.blockEntity(x, y, z) as FurnaceData | undefined;
    if (!be || be.type !== 'furnace') {
      be = { type: 'furnace', items: [null, null, null], burn: 0, burnMax: 0, cook: 0, xp: 0 };
      g.world.setBlockEntity(x, y, z, be);
    }
    this.furnace = be;
    const c = new Container(3, 'Four');
    c.slots = be.items;
    c.filters[1] = (s) => (ITEMS[s.id]?.fuel ?? 0) > 0;
    c.outputs.add(2);
    this.furnaceC = c;
    this.fireEl = h('div');
    this.arrowEl = h('div');
    const out = this.slot(c, 2);
    out.classList.add('big');
    return h(
      'div',
      { class: 'row', style: 'gap:calc(var(--u)*10);align-items:center;justify-content:center;width:100%' },
      h('div', { class: 'inv-col', style: 'align-items:center;gap:calc(var(--u)*2)' }, this.slot(c, 0, 'raw_iron'), h('div', { class: 'furnace-fire' }, this.fireEl), this.slot(c, 1, 'coal')),
      h('div', { class: 'furnace-arrow' }, this.arrowEl),
      out,
    );
  }

  /** Crée une case liée à un conteneur. */
  private slot(c: Container, i: number, ghostKey?: string): HTMLElement {
    const el = h('div', { class: 'slot' });
    if (ghostKey && ITEM_BY_KEY.get(ghostKey)) el.appendChild(h('div', { class: 'ghost', style: `background-image:url(${this.g.app.icons.get(ITEM_BY_KEY.get(ghostKey)!.id)})` }));
    const ref: SlotRef = { c, i, el, sig: '' };
    this.slots.push(ref);
    el.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      e.preventDefault();
      hideTooltip();
      if (e.pointerType === 'touch') {
        this.longFired = false;
        clearTimeout(this.longTimer);
        this.longTimer = window.setTimeout(() => {
          this.longFired = true;
          this.quick(c, i);
        }, 420);
        return;
      }
      if (e.shiftKey) this.quick(c, i);
      else this.click(c, i, e.button === 2);
    });
    el.addEventListener('pointerup', (e) => {
      if (e.pointerType !== 'touch') return;
      clearTimeout(this.longTimer);
      if (!this.longFired) this.click(c, i, false);
    });
    el.addEventListener('pointerleave', () => {
      clearTimeout(this.longTimer);
      hideTooltip();
    });
    el.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'touch' && !this.ctx.cursor) showTooltip(c.get(i), e.clientX, e.clientY);
    });
    return el;
  }

  // ------------------------------------------------------------------ clics
  private click(c: Container, i: number, right: boolean): void {
    const g = this.g;
    if (c === this.craftOut) {
      this.takeCraft(false);
      return;
    }
    const before = c.get(i);
    const outputXp = c === this.furnaceC && i === 2 && before;
    if (right) rightClick(c, i, this.ctx);
    else leftClick(c, i, this.ctx);
    if (outputXp && this.furnace && this.furnace.xp > 0 && !c.get(2)) this.collectFurnaceXp();
    if (this.ctx.cursor) g.player.noteItem(this.ctx.cursor);
    g.app.audio.play('click', { volume: 0.25, pitch: 1.4 });
    this.afterChange(c);
  }

  private quick(c: Container, i: number): void {
    const g = this.g;
    const inv = g.player.inventory;
    if (c === this.craftOut) {
      this.takeCraft(true);
      return;
    }
    const s = c.get(i);
    if (!s) return;
    const isInv = c === inv;
    const hotbar = [...Array(9).keys()];
    const mainSlots = [...Array(27).keys()].map((k) => k + 9);
    let targets: Array<{ c: Container; order?: number[] }> = [];
    if (isInv) {
      const def = ITEMS[s.id];
      if (def?.armor) targets.push({ c: inv.armor });
      if (this.chestC) targets.push({ c: this.chestC });
      else if (this.furnaceC) {
        if ((def?.fuel ?? 0) > 0 && !this.furnaceC.get(0)?.id) targets.push({ c: this.furnaceC, order: [0] });
        targets.push({ c: this.furnaceC, order: (def?.fuel ?? 0) > 0 ? [1, 0] : [0] });
      }
      targets.push({ c: inv, order: i < 9 ? mainSlots : hotbar });
    } else targets = [{ c: inv, order: [...hotbar, ...mainSlots] }];
    const hadXp = c === this.furnaceC && i === 2;
    quickMove(c, i, targets);
    if (hadXp && !c.get(2)) this.collectFurnaceXp();
    g.player.noteItem(s);
    g.app.audio.play('click', { volume: 0.25, pitch: 1.6 });
    this.afterChange(c);
  }

  private afterChange(c: Container): void {
    if (c === this.chestC || c === this.furnaceC) this.markBlockEntity();
    this.refreshAll();
  }

  private markBlockEntity(): void {
    if (!this.pos) return;
    const ch = this.g.world.chunkAt(this.pos[0], this.pos[2]);
    if (ch) ch.modified = true;
  }

  private collectFurnaceXp(): void {
    const f = this.furnace!;
    const n = Math.floor(f.xp) + (Math.random() < f.xp % 1 ? 1 : 0);
    f.xp = 0;
    if (n > 0) {
      this.g.player.addXp(n);
      this.g.app.audio.play('xp', { volume: 0.5 });
    }
  }

  // ------------------------------------------------------------------ artisanat
  private updateCraftOutput(): void {
    if (!this.craft || !this.craftOut) return;
    const r = findRecipe(this.craft.slots, this.craftW, this.craftW);
    const def = r ? ITEM_BY_KEY.get(r.result) : undefined;
    this.craftOut.slots[0] = r && def ? { id: def.id, count: r.count } : null;
    this.refreshAll();
  }

  private consumeGrid(): void {
    const c = this.craft!;
    for (let i = 0; i < c.size; i++) {
      const s = c.slots[i];
      if (!s) continue;
      const key = ITEMS[s.id]?.key;
      if (key && BUCKETS.has(key)) {
        c.slots[i] = { id: ITEM_BY_KEY.get('bucket')!.id, count: 1 };
        continue;
      }
      s.count--;
      if (s.count <= 0) c.slots[i] = null;
    }
    c.changed();
  }

  private takeCraft(all: boolean): void {
    const g = this.g;
    const inv = g.player.inventory;
    let n = 0;
    for (let guard = 0; guard < (all ? 64 : 1); guard++) {
      const out = this.craftOut!.get(0);
      if (!out) break;
      if (all) {
        const left = inv.give({ ...out });
        if (left > 0) {
          // Pas de place : on annule l'ajout partiel
          if (left < out.count) inv.remove(out.id, out.count - left);
          break;
        }
      } else {
        const cur = this.ctx.cursor;
        if (cur && !(sameItem(cur, out) && cur.count + out.count <= maxStack(cur))) break;
        if (cur) cur.count += out.count;
        else this.ctx.cursor = { ...out };
      }
      g.player.noteItem(out);
      this.consumeGrid();
      n++;
    }
    if (n) {
      g.app.audio.play('craft', { volume: 0.6 });
      g.player.stats.crafted = (g.player.stats.crafted ?? 0) + n;
    }
    this.refreshAll();
    this.renderLeft();
  }

  /** Rend les ingrédients de la grille à l'inventaire. */
  private returnGrid(): void {
    if (!this.craft) return;
    const inv = this.g.player.inventory;
    for (let i = 0; i < this.craft.size; i++) {
      const s = this.craft.slots[i];
      if (!s) continue;
      const left = inv.give(s);
      if (left > 0) this.g.throwItem({ ...s, count: left });
      this.craft.slots[i] = null;
    }
    this.craft.changed();
  }

  /** Inventaire du joueur (+ grille) par clé d'objet. */
  private available(): Map<string, number> {
    const m = new Map<string, number>();
    const add = (s: ItemStack | null) => {
      if (!s) return;
      const k = ITEMS[s.id]?.key;
      if (k) m.set(k, (m.get(k) ?? 0) + s.count);
    };
    this.g.player.inventory.slots.forEach(add);
    this.craft?.slots.forEach(add);
    return m;
  }

  private canCraft(r: Recipe, avail: Map<string, number>): boolean {
    for (const [ing, n] of recipeCost(r)) {
      let have = 0;
      for (const [k, c] of avail) if (matchesIngredient(ing, { id: ITEM_BY_KEY.get(k)!.id, count: 1 })) have += c;
      if (have < n) return false;
    }
    return true;
  }

  /** Remplit la grille avec les ingrédients d'une recette (pris dans l'inventaire). */
  private fillRecipe(r: Recipe): boolean {
    this.returnGrid();
    const inv = this.g.player.inventory;
    const w = this.craftW;
    const cells: Array<[number, string]> = [];
    if (r.pattern) {
      if (r.pattern.length > w || r.pattern.some((row) => row.length > w)) return false;
      r.pattern.forEach((row, y) => [...row].forEach((ch, x) => ch !== ' ' && cells.push([y * w + x, r.key![ch]])));
    } else r.ingredients!.forEach((ing, i) => cells.push([i, ing]));
    for (const [cell, ing] of cells) {
      let found = -1;
      for (let i = 0; i < inv.size; i++) if (matchesIngredient(ing, inv.slots[i])) {
        found = i;
        break;
      }
      if (found < 0) {
        this.returnGrid();
        return false;
      }
      const s = inv.slots[found]!;
      this.craft!.slots[cell] = { ...s, count: 1 };
      s.count--;
      if (s.count <= 0) inv.slots[found] = null;
    }
    inv.changed();
    this.craft!.changed();
    return true;
  }

  // ------------------------------------------------------------------ panneau gauche
  private renderLeft(): void {
    const body = this.leftBody;
    if (!body) return;
    // Les cases remplacées ne reçoivent plus pointerleave : l'infobulle resterait affichée.
    hideTooltip();
    body.textContent = '';
    if (this.mode === 'trade') return this.renderTrades(body);
    if (this.mode === 'creative') return this.renderCatalog(body);
    this.renderRecipes(body);
  }

  private renderCatalog(body: HTMLElement): void {
    const q = norm(this.search.trim());
    const list = ITEMS.filter((d) => d && d.category && (this.tab === 'search' ? !q || norm(d.name).includes(q) || d.key.includes(q) : d.category === this.tab));
    this.leftTitle!.textContent = this.tab === 'search' ? `Recherche (${list.length})` : CATS.find((c) => c[0] === this.tab)?.[1] ?? '';
    const grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(9,auto)' });
    for (const d of list) {
      const el = h('div', { class: 'slot' });
      drawStack(el, { id: d.id, count: 1 }, this.g.app.icons);
      el.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        hideTooltip();
        if (this.ctx.cursor) {
          this.ctx.cursor = null; // le catalogue sert de corbeille
        } else if (e.shiftKey) this.g.player.inventory.give({ id: d.id, count: d.maxStack });
        else this.ctx.cursor = { id: d.id, count: e.button === 2 ? 1 : d.maxStack };
        this.g.app.audio.play('click', { volume: 0.25, pitch: 1.5 });
        this.refreshAll();
      });
      el.addEventListener('pointerenter', (e) => e.pointerType !== 'touch' && showTooltip({ id: d.id, count: 1 }, e.clientX, e.clientY));
      el.addEventListener('pointerleave', hideTooltip);
      grid.appendChild(el);
    }
    if (!list.length) body.appendChild(h('div', { style: 'padding:calc(var(--u)*10);text-align:center' }, 'Aucun objet trouvé'));
    body.appendChild(grid);
  }

  private renderRecipes(body: HTMLElement): void {
    const g = this.g;
    const known = g.knownItems();
    const avail = this.available();
    const q = norm(this.search.trim());
    const table = this.craftW === 3;
    const list = RECIPES.filter((r) => {
      if (!table && r.needsTable) return false;
      if (this.tab !== 'all' && r.category !== this.tab) return false;
      const res = ITEM_BY_KEY.get(r.result);
      if (!res) return false;
      if (q && !norm(res.name).includes(q)) return false;
      // Recette visible si un de ses ingrédients a déjà été obtenu
      if (!g.player.creative) {
        let seen = false;
        for (const ing of recipeCost(r).keys()) {
          if (ing.startsWith('#') ? [...known].some((k) => matchesIngredient(ing, { id: ITEM_BY_KEY.get(k)?.id ?? -1, count: 1 })) : known.has(ing)) {
            seen = true;
            break;
          }
        }
        if (!seen) return false;
      }
      return true;
    });
    const rows = list.map((r) => ({ r, ok: this.canCraft(r, avail) })).filter((x) => !this.craftableOnly || x.ok);
    rows.sort((a, b) => Number(b.ok) - Number(a.ok));
    this.leftTitle!.textContent = this.tab === 'all' ? 'Toutes les recettes' : CATS.find((c) => c[0] === this.tab)?.[1] ?? '';
    const grid = h('div', { class: 'grid', style: 'grid-template-columns:repeat(9,auto)' });
    for (const { r, ok } of rows) {
      const res = ITEM_BY_KEY.get(r.result)!;
      const el = h('div', { class: 'slot' + (ok ? '' : ' red') });
      drawStack(el, { id: res.id, count: r.count }, g.app.icons);
      el.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        e.preventDefault();
        hideTooltip();
        if (!ok) {
          g.message(`Ingrédients manquants pour : ${res.name}`);
          return;
        }
        if (this.fillRecipe(r) && (e.shiftKey || e.button === 2)) this.takeCraft(true);
        this.renderLeft();
        this.refreshAll();
      });
      el.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'touch') return;
        const need = [...recipeCost(r)].map(([ing, n]) => `${n}× ${ing.startsWith('#') ? ing.slice(1) : itemName(ITEM_BY_KEY.get(ing)?.id ?? 0)}`).join(', ');
        showTooltip({ id: res.id, count: r.count }, e.clientX, e.clientY, need + (r.needsTable && !table ? ' (établi)' : ''));
      });
      el.addEventListener('pointerleave', hideTooltip);
      grid.appendChild(el);
    }
    if (!rows.length) body.appendChild(h('div', { style: 'padding:calc(var(--u)*10);text-align:center' }, this.craftableOnly ? 'Aucune recette réalisable' : 'Ramassez des objets pour découvrir des recettes'));
    body.appendChild(grid);
  }

  private renderTrades(body: HTMLElement): void {
    const v = this.villager!;
    const inv = this.g.player.inventory;
    this.leftTitle!.textContent = v.professionName;
    const list = h('div', { class: 'trade-list' });
    const icons = this.g.app.icons;
    const stackEl = (key: string, n: number) => {
      const d = ITEM_BY_KEY.get(key);
      const el = h('div', { class: 'slot', style: 'cursor:default' });
      if (d) drawStack(el, { id: d.id, count: n }, icons);
      return el;
    };
    for (const t of v.trades) {
      const locked = t.level > v.level;
      const out = t.uses >= t.maxUses;
      const price = v.price(t);
      const row = h('div', { class: 'trade' + (locked || out ? ' locked' : '') }, stackEl(t.buy[0], price), t.buy2 ? stackEl(t.buy2[0], t.buy2[1]) : null, h('div', { class: 'arrow-right' }), stackEl(t.sell[0], t.sell[1]), h('div', { style: 'color:#333' }, locked ? `Niveau ${t.level}` : out ? 'Épuisé' : ''));
      row.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        if (locked || out) return;
        this.doTrade(t, price, inv);
        this.renderLeft();
      });
      list.appendChild(row);
    }
    body.appendChild(list);
  }

  private doTrade(t: Trade, price: number, inv: PlayerInventory): void {
    const g = this.g;
    const v = this.villager!;
    const b1 = ITEM_BY_KEY.get(t.buy[0]);
    const b2 = t.buy2 ? ITEM_BY_KEY.get(t.buy2[0]) : undefined;
    const sell = ITEM_BY_KEY.get(t.sell[0]);
    if (!b1 || !sell) return;
    if (inv.count(b1.id) < price || (b2 && inv.count(b2.id) < t.buy2![1])) {
      g.message('Vous n’avez pas ce qu’il faut pour cet échange.');
      g.audio('villager', v.pos, 0.8, 0.7);
      return;
    }
    inv.remove(b1.id, price);
    if (b2) inv.remove(b2.id, t.buy2![1]);
    const left = inv.give({ id: sell.id, count: t.sell[1] });
    if (left > 0) g.throwItem({ id: sell.id, count: left });
    g.player.noteItem({ id: sell.id, count: 1 });
    v.completeTrade(t);
    g.dropXp(v.pos.x, v.pos.y + 1, v.pos.z, 3 + Math.floor(Math.random() * 4));
    g.audio('trade', v.pos);
    this.refreshAll();
  }

  // ------------------------------------------------------------------ rafraîchissement
  private onInventoryChanged(): void {
    this.refreshAll();
  }

  private refreshAll(): void {
    for (const s of this.slots) {
      const sig = stackSignature(s.c.get(s.i));
      if (sig === s.sig) continue;
      s.sig = sig;
      drawStack(s.el, s.c.get(s.i), this.g.app.icons);
      const ghost = s.el.querySelector('.ghost') as HTMLElement | null;
      if (ghost) ghost.style.display = s.c.get(s.i) ? 'none' : '';
    }
    this.refreshCursor();
    // Le livre de recettes dépend du contenu de l'inventaire
    const sig = this.g.player.inventory.slots.map(stackSignature).join('|');
    if (sig !== this.invSig) {
      this.invSig = sig;
      if (this.mode === 'survival' || this.mode === 'crafting') this.renderLeft();
    }
  }

  private refreshCursor(): void {
    const sig = stackSignature(this.ctx.cursor);
    if (sig === this.cursorSig) return;
    this.cursorSig = sig;
    drawStack(this.cursorEl, this.ctx.cursor, this.g.app.icons);
    this.cursorEl.style.left = this.mouse.x + 'px';
    this.cursorEl.style.top = this.mouse.y + 'px';
  }

  update(dt: number): void {
    this.time += dt;
    if (this.furnace && this.fireEl && this.arrowEl) {
      const f = this.furnace;
      this.fireEl.style.height = (f.burnMax > 0 ? (f.burn / f.burnMax) * 100 : 0) + '%';
      this.arrowEl.style.width = (f.cook / COOK_TIME) * 100 + '%';
      this.refreshAll();
    }
    if (this.doll && this.preview) {
      const r = this.doll.getBoundingClientRect();
      const lx = Math.max(-1, Math.min(1, (this.mouse.x - (r.left + r.width / 2)) / 200));
      const ly = Math.max(-1, Math.min(1, (this.mouse.y - (r.top + r.height * 0.25)) / 200));
      this.preview.draw(this.doll, this.g.entities.playerSkin, lx * 0.5, this.time, lx * 0.6, -ly, 0);
    }
  }

  onBack(): boolean {
    return false;
  }

  destroy(): void {
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    hideTooltip();
    clearTimeout(this.longTimer);
    const g = this.g;
    this.returnGrid();
    if (this.ctx.cursor) {
      const left = g.player.inventory.give(this.ctx.cursor);
      if (left > 0) g.throwItem({ ...this.ctx.cursor, count: left });
      this.ctx.cursor = null;
    }
    this.unsub.forEach((f) => f());
    if (this.mode === 'chest' && this.pos) {
      g.audio('chest_close', { x: this.pos[0] + 0.5, y: this.pos[1] + 0.5, z: this.pos[2] + 0.5 });
      this.markBlockEntity();
      g.net?.sendBlockEntity(g.dimension, this.pos[0], this.pos[1], this.pos[2], g.world.blockEntity(this.pos[0], this.pos[1], this.pos[2]));
    }
    if (this.mode === 'furnace' && this.pos) {
      this.markBlockEntity();
      g.net?.sendBlockEntity(g.dimension, this.pos[0], this.pos[1], this.pos[2], g.world.blockEntity(this.pos[0], this.pos[1], this.pos[2]));
    }
    void PLAYER_SKINS;
  }
}
