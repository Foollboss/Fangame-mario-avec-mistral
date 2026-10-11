/**
 * HUD en jeu : réticule, cœurs, faim, armure, oxygène, expérience, barre d'accès rapide
 * (9 cases + « … »), nom de l'objet tenu, chat, barre de boss, titres, superpositions,
 * informations de débogage, coordonnées et mini-carte.
 */
import { h } from './dom';
import { icon } from './icons';
import { ITEMS, itemName, type ItemStack } from '../items/items';
import { EFFECT_NAMES, type Player } from '../player/Player';
import type { ItemIcons } from '../render/ItemIcons';

export interface HudCallbacks {
  selectSlot(i: number): void;
  openInventory(): void;
  dropSlot(i: number): void;
  pause(): void;
  chat(): void;
  perspective(): void;
}

export class Hud {
  readonly el: HTMLElement;
  private hearts: HTMLElement[] = [];
  private food: HTMLElement[] = [];
  private armor: HTMLElement[] = [];
  private bubbles: HTMLElement[] = [];
  private heartsRow: HTMLElement;
  private foodRow: HTMLElement;
  private armorRow: HTMLElement;
  private bubbleRow: HTMLElement;
  private xpFill: HTMLElement;
  private xpLevel: HTMLElement;
  private slots: HTMLElement[] = [];
  private heldName: HTMLElement;
  private chatLog: HTMLElement;
  private debugEl: HTMLElement;
  private coordsEl: HTMLElement;
  private bossEl: HTMLElement;
  private bossName: HTMLElement;
  private bossFill: HTMLElement;
  private titleEl: HTMLElement;
  private damageEl: HTMLElement;
  private waterEl: HTMLElement;
  private portalEl: HTMLElement;
  private crosshair: HTMLElement;
  private effectsEl: HTMLElement;
  readonly mapCanvas: HTMLCanvasElement;
  readonly topButtons: HTMLElement;
  private last = { hp: -1, food: -1, armor: -1, air: -1, xp: -1, lvl: -1, sel: -1, inv: '', poison: false, hunger: false };
  private heldTimer = 0;
  private titleTimer = 0;
  hidden = false;

  constructor(
    private icons: ItemIcons,
    private cb: HudCallbacks,
    touch: boolean,
  ) {
    this.crosshair = h('div', { class: 'crosshair' });
    this.heartsRow = h('div', { class: 'stat-row' });
    this.foodRow = h('div', { class: 'stat-row right' });
    this.armorRow = h('div', { class: 'stat-row' });
    this.bubbleRow = h('div', { class: 'stat-row right' });
    for (let i = 0; i < 10; i++) {
      const a = h('div', { class: 'stat-icon' });
      const b = h('div', { class: 'stat-icon' });
      const c = h('div', { class: 'stat-icon' });
      const d = h('div', { class: 'stat-icon' });
      this.hearts.push(a);
      this.food.push(b);
      this.armor.push(c);
      this.bubbles.push(d);
      this.heartsRow.appendChild(a);
      this.foodRow.appendChild(b);
      this.armorRow.appendChild(c);
      this.bubbleRow.appendChild(d);
    }
    this.xpFill = h('div', { class: 'fill' });
    this.xpLevel = h('div', { class: 'xplevel' });
    const xpbar = h('div', { class: 'xpbar' }, this.xpFill, this.xpLevel);
    for (let i = 1; i < 18; i++) xpbar.appendChild(h('div', { class: 'seg', style: `left:${(i / 18) * 100}%` }));
    const hotbar = h('div', { class: 'hotbar' });
    for (let i = 0; i < 9; i++) {
      const s = h('div', { class: 'hslot' });
      let holdT = 0;
      s.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        this.cb.selectSlot(i);
        holdT = window.setTimeout(() => this.cb.dropSlot(i), 650);
      });
      s.addEventListener('pointerup', () => clearTimeout(holdT));
      s.addEventListener('pointerleave', () => clearTimeout(holdT));
      this.slots.push(s);
      hotbar.appendChild(s);
    }
    const more = h('div', { class: 'hslot more' }, h('img', { src: icon('dots'), style: 'width:60%;image-rendering:pixelated' }));
    more.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      this.cb.openInventory();
    });
    hotbar.appendChild(more);
    const stats = h('div', { class: 'stat-rows' }, h('div', null, this.armorRow, this.heartsRow), h('div', null, this.bubbleRow, this.foodRow));
    const wrap = h('div', { class: 'hotbar-wrap' }, stats, xpbar, hotbar);
    this.heldName = h('div', { class: 'held-name' });
    this.chatLog = h('div', { class: 'chat-log' });
    this.debugEl = h('div', { class: 'debug hidden' });
    this.coordsEl = h('div', { class: 'coords hidden' });
    this.bossName = h('div');
    this.bossFill = h('div');
    this.bossEl = h('div', { class: 'bossbar hidden' }, this.bossName, h('div', { class: 'bar' }, this.bossFill));
    this.titleEl = h('div', { class: 'title-msg', style: 'opacity:0' });
    this.damageEl = h('div', { class: 'damage-flash' });
    this.waterEl = h('div', { class: 'underwater-tint' });
    this.portalEl = h('div', { class: 'portal-tint' });
    this.effectsEl = h('div', { class: 'effects-list' });
    this.mapCanvas = h('canvas', { class: 'minimap hidden', width: '128', height: '128' }) as HTMLCanvasElement;
    const btn = (ic: string, fn: () => void) => {
      const b = h('div', { class: 'hud-btn' }, h('img', { src: icon(ic), style: 'image-rendering:pixelated' }));
      b.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        fn();
      });
      return b;
    };
    this.topButtons = h('div', { class: 'top-buttons' + (touch ? '' : ' hidden') }, btn('camera', () => cb.perspective()), btn('chat', () => cb.chat()), btn('pause', () => cb.pause()));
    this.el = h(
      'div',
      { class: 'hud-root' },
      this.waterEl,
      this.portalEl,
      this.damageEl,
      h('div', { class: 'vignette' }),
      this.crosshair,
      this.titleEl,
      this.bossEl,
      this.chatLog,
      this.heldName,
      wrap,
      this.topButtons,
      this.debugEl,
      this.coordsEl,
      this.mapCanvas,
      this.effectsEl,
    );
    // Les cases et boutons restent cliquables
    for (const s of this.slots) s.style.pointerEvents = 'auto';
    more.style.pointerEvents = 'auto';
    this.topButtons.querySelectorAll('.hud-btn').forEach((b) => ((b as HTMLElement).style.pointerEvents = 'auto'));
  }

  setTouch(touch: boolean): void {
    this.topButtons.classList.toggle('hidden', !touch);
  }

  private setIcon(el: HTMLElement, name: string): void {
    const url = icon(name);
    const v = `url(${url})`;
    if (el.style.backgroundImage !== v) el.style.backgroundImage = v;
  }

  private renderSlot(el: HTMLElement, s: ItemStack | null): void {
    el.querySelectorAll('.item-img, .item-count, .item-dur').forEach((x) => x.remove());
    if (!s) return;
    el.appendChild(h('div', { class: 'item-img', style: `background-image:url(${this.icons.get(s.id, s.data)})` }));
    if (s.count > 1) el.appendChild(h('div', { class: 'item-count' }, String(s.count)));
    const dur = ITEMS[s.id]?.tool?.durability ?? ITEMS[s.id]?.armor?.durability;
    if (dur && s.damage) {
      const f = Math.max(0, 1 - s.damage / dur);
      el.appendChild(h('div', { class: 'item-dur' }, h('div', { style: `width:${f * 100}%;background:hsl(${f * 120},90%,50%)` })));
    }
  }

  update(p: Player, dt: number, opts: { survival: boolean; showCoords: boolean; debug: string | null; underwater: boolean; portal: number; portalColor: string; iconsVersion: number }): void {
    this.el.style.display = this.hidden ? 'none' : '';
    const survival = opts.survival;
    for (const r of [this.heartsRow, this.foodRow, this.armorRow, this.bubbleRow, this.xpFill.parentElement!]) r.style.visibility = survival ? 'visible' : 'hidden';
    const hp = Math.ceil(p.health);
    const poison = p.hasEffect('poison');
    const hunger = p.hasEffect('hunger');
    if (hp !== this.last.hp || poison !== this.last.poison) {
      this.last.hp = hp;
      this.last.poison = poison;
      for (let i = 0; i < 10; i++) this.setIcon(this.hearts[i], hp >= (i + 1) * 2 ? (poison ? 'heart_poison' : 'heart') : hp === i * 2 + 1 ? 'heart_half' : 'heart_empty');
    }
    if (p.hunger !== this.last.food || hunger !== this.last.hunger) {
      this.last.food = p.hunger;
      this.last.hunger = hunger;
      for (let i = 0; i < 10; i++) this.setIcon(this.food[i], p.hunger >= (i + 1) * 2 ? 'hunger' : p.hunger === i * 2 + 1 ? 'hunger_half' : 'hunger_empty');
    }
    const ar = p.inventory.armorPoints();
    if (ar !== this.last.armor) {
      this.last.armor = ar;
      this.armorRow.style.display = ar > 0 ? 'flex' : 'none';
      for (let i = 0; i < 10; i++) this.setIcon(this.armor[i], ar >= (i + 1) * 2 ? 'armor' : ar === i * 2 + 1 ? 'armor_half' : 'armor_empty');
    }
    const air = Math.ceil(Math.max(0, p.air) / 30);
    if (air !== this.last.air) {
      this.last.air = air;
      this.bubbleRow.style.display = p.air < 300 ? 'flex' : 'none';
      for (let i = 0; i < 10; i++) this.bubbles[i].style.visibility = 9 - i < air ? 'visible' : 'hidden';
      for (let i = 0; i < 10; i++) this.setIcon(this.bubbles[i], 'bubble');
    }
    if (p.xpProgress !== this.last.xp || p.xpLevel !== this.last.lvl) {
      this.last.xp = p.xpProgress;
      this.last.lvl = p.xpLevel;
      this.xpFill.style.width = p.xpProgress * 100 + '%';
      this.xpLevel.textContent = p.xpLevel > 0 ? String(p.xpLevel) : '';
    }
    // Barre d'accès rapide
    const sig = p.inventory.slots.slice(0, 9).map((s) => (s ? `${s.id}:${s.count}:${s.damage ?? 0}` : '-')).join('|') + '#' + opts.iconsVersion;
    if (sig !== this.last.inv) {
      this.last.inv = sig;
      for (let i = 0; i < 9; i++) this.renderSlot(this.slots[i], p.inventory.get(i));
    }
    if (p.inventory.selected !== this.last.sel) {
      this.slots[this.last.sel]?.classList.remove('sel');
      this.last.sel = p.inventory.selected;
      this.slots[this.last.sel].classList.add('sel');
      const held = p.heldItem();
      this.heldName.textContent = held ? itemName(held) : '';
      this.heldTimer = held ? 2.5 : 0;
    }
    this.heldTimer -= dt;
    this.heldName.style.opacity = this.heldTimer > 0 ? String(Math.min(1, this.heldTimer)) : '0';
    // Superpositions
    this.waterEl.style.opacity = opts.underwater ? '1' : '0';
    this.portalEl.style.opacity = String(opts.portal);
    this.portalEl.style.background = opts.portalColor;
    if (this.titleTimer > 0) {
      this.titleTimer -= dt;
      this.titleEl.style.opacity = String(Math.min(1, this.titleTimer));
    }
    // Débogage et coordonnées
    this.debugEl.classList.toggle('hidden', !opts.debug);
    if (opts.debug) this.debugEl.textContent = opts.debug;
    this.coordsEl.classList.toggle('hidden', !opts.showCoords || !!opts.debug);
    if (opts.showCoords) this.coordsEl.textContent = `Position : ${Math.floor(p.pos.x)}, ${Math.floor(p.pos.y)}, ${Math.floor(p.pos.z)}`;
    // Effets
    const eff = [...p.effects.values()].map((e) => `${EFFECT_NAMES[e.id] ?? e.id} ${Math.ceil(e.time / 20)}s`).join('\n');
    if (this.effectsEl.textContent !== eff) {
      this.effectsEl.textContent = '';
      for (const line of eff.split('\n').filter(Boolean)) this.effectsEl.appendChild(h('div', null, line));
    }
    // Lignes de chat qui s'estompent
    const now = performance.now();
    for (const line of Array.from(this.chatLog.children) as HTMLElement[]) {
      const age = (now - Number(line.dataset.t)) / 1000;
      if (age > 10) line.style.opacity = '0';
      if (age > 12) line.remove();
    }
  }

  flashDamage(): void {
    this.damageEl.style.transition = 'none';
    this.damageEl.style.opacity = '1';
    requestAnimationFrame(() => {
      this.damageEl.style.transition = 'opacity 0.6s';
      this.damageEl.style.opacity = '0';
    });
  }

  message(text: string): void {
    const line = h('div', { class: 'chat-line' }, text);
    line.dataset.t = String(performance.now());
    this.chatLog.appendChild(line);
    while (this.chatLog.children.length > 8) this.chatLog.firstChild?.remove();
  }

  /** Affiche toutes les lignes récentes (chat ouvert). */
  showChatHistory(on: boolean): void {
    for (const line of Array.from(this.chatLog.children) as HTMLElement[]) {
      if (on) {
        line.style.opacity = '1';
        line.dataset.t = String(performance.now());
      }
    }
  }

  title(text: string, sub = '', seconds = 3): void {
    this.titleEl.textContent = '';
    this.titleEl.appendChild(h('div', null, text));
    if (sub) this.titleEl.appendChild(h('div', { class: 'subtitle-msg' }, sub));
    this.titleTimer = seconds;
    this.titleEl.style.opacity = '1';
  }

  boss(name: string | null, progress = 1): void {
    this.bossEl.classList.toggle('hidden', !name);
    if (!name) return;
    this.bossName.textContent = name;
    this.bossFill.style.width = Math.max(0, progress) * 100 + '%';
  }

  showMap(show: boolean): void {
    this.mapCanvas.classList.toggle('hidden', !show);
  }

  setCrosshair(visible: boolean): void {
    this.crosshair.style.display = visible ? '' : 'none';
  }
}
