/** Affichage tête haute : barre rapide, santé, énergie, armure, air, température, effets, boss, débogage. */
import { h, clear } from './dom';
import type { IconFactory } from '../render/icons';
import type { Player } from '../entity/player';
import type { Content } from '../registry/content';
import { RARITY_COLORS } from '../render/icons';
import { t } from '../i18n/i18n';

const ICONS: Record<string, string[]> = {
  heart: ['.oo.oo...', 'orrorro..', 'orwrrrro.', 'orrrrrro.', '.orrrrro.', '..orrro..', '...oro...', '....o....', '.........'],
  heartHalf: ['.oo.oo...', 'orrokko..', 'orwrkkko.', 'orrrkkko.', '.orrkkko.', '..orkko..', '...oko...', '....o....', '.........'],
  heartEmpty: ['.oo.oo...', 'okkokko..', 'okkkkkko.', 'okkkkkko.', '.okkkkko.', '..okkko..', '...oko...', '....o....', '.........'],
  energy: ['....ooo..', '...oyyo..', '..oyyo...', '.oyyyyoo.', '.ooyyyyo.', '...oyyo..', '..oyyo...', '..oyo....', '..oo.....'],
  energyHalf: ['....ooo..', '...okko..', '..okko...', '.oyykkoo.', '.ooyykko.', '...oyko..', '..oyyo...', '..oyo....', '..oo.....'],
  energyEmpty: ['....ooo..', '...okko..', '..okko...', '.okkkkoo.', '.ookkkko.', '...okko..', '..okko...', '..oko....', '..oo.....'],
  armor: ['ooooooo..', 'oggwggo..', 'ogggggo..', 'ogggggo..', '.ogggo...', '.ogggo...', '..ogo....', '...o.....', '.........'],
  armorHalf: ['ooooooo..', 'oggwkko..', 'ogggkko..', 'ogggkko..', '.oggko...', '.oggko...', '..ogo....', '...o.....', '.........'],
  armorEmpty: ['ooooooo..', 'okkkkko..', 'okkkkko..', 'okkkkko..', '.okkko...', '.okkko...', '..oko....', '...o.....', '.........'],
  bubble: ['..ooo....', '.obbbo...', 'obwbbbo..', 'obbbbbo..', 'obbbbbo..', '.obbbo...', '..ooo....', '.........', '.........'],
  bubblePop: ['.........', '..o.o....', '.o...o...', '.........', '.o...o...', '..o.o....', '.........', '.........', '.........'],
};

function iconURL(rows: string[], pal: Record<string, string>): string {
  const c = document.createElement('canvas');
  c.width = c.height = 9;
  const g = c.getContext('2d')!;
  rows.forEach((r, y) => [...r].forEach((ch, x) => {
    if (ch === '.') return;
    g.fillStyle = pal[ch] ?? '#f0f';
    g.fillRect(x, y, 1, 1);
  }));
  return c.toDataURL();
}

export interface HudState {
  player: Player;
  hardcore: boolean;
  attackCharge: number; // 0..1 (1 = prêt)
  useProgress: number; // 0..1 ou −1
  boss: { name: string; hp: number; max: number } | null;
  debug: string | null;
  fps: number | null;
  vignette: 'hurt' | 'water' | 'cold' | 'hot' | 'portal' | null;
  vignetteAmount: number;
}

export class Hud {
  readonly el: HTMLElement;
  private hotbar: HTMLElement;
  private slots: HTMLElement[] = [];
  private hearts: HTMLElement;
  private energy: HTMLElement;
  private armor: HTMLElement;
  private air: HTMLElement;
  private temp: HTMLElement;
  private tempMarker: HTMLElement;
  private itemName: HTMLElement;
  private effects: HTMLElement;
  private bossbar: HTMLElement;
  private bossName: HTMLElement;
  private bossFill: HTMLElement;
  private debug: HTMLElement;
  private toasts: HTMLElement;
  private attack: HTMLElement;
  private attackFill: HTMLElement;
  private use: HTMLElement;
  private useFill: HTMLElement;
  private vignette: HTMLElement;
  private saving: HTMLElement;
  private fpsEl: HTMLElement;
  private urls: Record<string, string> = {};
  private last = { hotbar: '', hearts: '', energy: '', armor: '', air: '', effects: '', sel: -1 };
  private nameTimer = 0;
  hidden = false;

  constructor(
    private icons: IconFactory,
    private content: Content,
  ) {
    const p = { o: '#1a0a0a', r: '#e02a2a', w: '#ffb0b0', k: '#3a1a1a', y: '#ffd23a', g: '#c8ccd4', b: '#6ab0ff' };
    for (const [k, rows] of Object.entries(ICONS)) this.urls[k] = iconURL(rows, p);
    this.urls.heartPoison = iconURL(ICONS.heart, { ...p, r: '#6aa02a', w: '#c0f080' });
    this.urls.heartFrozen = iconURL(ICONS.heart, { ...p, r: '#6ac0ff', w: '#e0f8ff' });
    this.urls.heartHard = iconURL(ICONS.heart, { ...p, r: '#a01010', o: '#f0d060' });
    this.hotbar = h('div', { class: 'hotbar' });
    for (let i = 0; i < 9; i++) {
      const s = h('div', { class: 'hslot' });
      this.slots.push(s);
      this.hotbar.appendChild(s);
    }
    this.hearts = h('div', { class: 'bar-icons' });
    this.energy = h('div', { class: 'bar-icons right' });
    this.armor = h('div', { class: 'bar-icons' });
    this.air = h('div', { class: 'bar-icons right' });
    this.tempMarker = h('div');
    this.temp = h('div', { class: 'temp-gauge', title: t('Température corporelle') }, this.tempMarker);
    this.itemName = h('div', { class: 'item-name' });
    this.effects = h('div', { class: 'effects' });
    this.bossName = h('div');
    this.bossFill = h('div');
    this.bossbar = h('div', { class: 'bossbar' }, this.bossName, h('div', { class: 'bar' }, this.bossFill));
    this.debug = h('div', { class: 'debug' });
    this.toasts = h('div', { class: 'toasts' });
    this.attackFill = h('div');
    this.attack = h('div', { class: 'attack-meter' }, this.attackFill);
    this.useFill = h('div');
    this.use = h('div', { class: 'use-meter' }, this.useFill);
    this.vignette = h('div', { class: 'vignette' });
    this.saving = h('div', { class: 'saving' });
    this.fpsEl = h('div', { style: { position: 'absolute', top: '4px', right: '8px', fontSize: '14px', textShadow: '1px 1px 0 #000' } });
    this.el = h(
      'div',
      { class: 'hud' },
      this.vignette,
      h('div', { class: 'crosshair' }),
      this.attack,
      this.use,
      this.bossbar,
      this.effects,
      this.debug,
      this.toasts,
      this.saving,
      this.fpsEl,
      h(
        'div',
        { class: 'hotbar-wrap' },
        this.itemName,
        this.temp,
        h('div', { class: 'stats-row' }, this.armor, this.air),
        h('div', { class: 'stats-row' }, this.hearts, this.energy),
        this.hotbar,
      ),
    );
  }

  setHidden(v: boolean): void {
    this.hidden = v;
    this.el.style.display = v ? 'none' : '';
  }

  toast(title: string, text: string, icon?: string): void {
    const img = icon ? h('img', { src: this.icons.icon(icon) }) : null;
    const el = h('div', { class: 'toast' }, img, h('div', { class: 't1' }, title), h('div', { class: 't2' }, text));
    this.toasts.appendChild(el);
    setTimeout(() => el.remove(), 5000);
    while (this.toasts.children.length > 4) this.toasts.firstChild?.remove();
  }

  setSaving(on: boolean): void {
    this.saving.textContent = on ? t('Sauvegarde du monde…') : '';
  }

  showItemName(id: string | null): void {
    if (!id) {
      this.itemName.classList.remove('show');
      return;
    }
    const it = this.content.items.get(id);
    this.itemName.textContent = it?.name ?? id;
    this.itemName.style.color = RARITY_COLORS[it?.rarity ?? 'common'];
    this.itemName.classList.add('show');
    this.nameTimer = 2;
  }

  private renderRow(el: HTMLElement, key: 'hearts' | 'energy' | 'armor' | 'air', urls: string[]): void {
    const sig = urls.join('|');
    if (this.last[key] === sig) return;
    this.last[key] = sig;
    clear(el);
    for (const u of urls) el.appendChild(h('img', { src: u }));
  }

  update(s: HudState, dt: number): void {
    if (this.hidden) return;
    const p = s.player;
    const inv = p.inventory;
    // Barre rapide
    const sig = inv.slots.slice(0, 9).map((x) => (x ? `${x.id}:${x.count}:${x.dmg ?? 0}` : '-')).join(',');
    if (sig !== this.last.hotbar || inv.selected !== this.last.sel) {
      if (inv.selected !== this.last.sel && this.last.sel !== -1) this.showItemName(inv.held?.id ?? null);
      this.last.hotbar = sig;
      this.last.sel = inv.selected;
      for (let i = 0; i < 9; i++) fillSlot(this.slots[i], inv.slots[i], this.icons, this.content, i === inv.selected);
    }
    this.nameTimer -= dt;
    if (this.nameTimer <= 0) this.itemName.classList.remove('show');
    const survival = !p.creative;
    this.hearts.parentElement!.style.visibility = survival ? '' : 'hidden';
    this.armor.parentElement!.style.visibility = survival ? '' : 'hidden';
    this.temp.style.visibility = survival ? '' : 'hidden';
    if (survival) {
      // Cœurs
      const heartFull = s.hardcore ? this.urls.heartHard : p.hasEffect('poison') ? this.urls.heartPoison : p.hasEffect('gel') || p.bodyTemp < -0.85 ? this.urls.heartFrozen : this.urls.heart;
      const hearts: string[] = [];
      const hp = Math.ceil(p.health);
      for (let i = 0; i < p.maxHealth / 2; i++) hearts.push(hp >= i * 2 + 2 ? heartFull : hp === i * 2 + 1 ? this.urls.heartHalf : this.urls.heartEmpty);
      this.renderRow(this.hearts, 'hearts', hearts);
      this.hearts.classList.toggle('shake', p.health <= 4);
      const en: string[] = [];
      const e = Math.ceil(p.energy);
      for (let i = 0; i < 10; i++) en.push(e >= i * 2 + 2 ? this.urls.energy : e === i * 2 + 1 ? this.urls.energyHalf : this.urls.energyEmpty);
      this.renderRow(this.energy, 'energy', en);
      this.energy.classList.toggle('shake', p.energy <= 0);
      const a = p.armorPoints();
      const ar: string[] = [];
      if (a > 0) for (let i = 0; i < 10; i++) ar.push(a >= i * 2 + 2 ? this.urls.armor : a === i * 2 + 1 ? this.urls.armorHalf : this.urls.armorEmpty);
      this.renderRow(this.armor, 'armor', ar);
      const bubbles: string[] = [];
      if (p.body.headInWater || p.air < 10) for (let i = 0; i < 10; i++) bubbles.push(Math.ceil(p.air) > i ? this.urls.bubble : this.urls.bubblePop);
      this.renderRow(this.air, 'air', bubbles);
      this.tempMarker.style.left = `${((Math.max(-1, Math.min(1, p.bodyTemp)) + 1) / 2) * 86}px`;
    }
    // Effets
    const effSig = [...p.effects.entries()].map(([id, e]) => `${id}${e.level}${Math.ceil(e.time)}`).join(',');
    if (effSig !== this.last.effects) {
      this.last.effects = effSig;
      clear(this.effects);
      for (const [id, e] of p.effects) {
        const def = this.content.effects.get(id);
        const time = e.time < 0 ? '∞' : `${Math.floor(e.time / 60)}:${String(Math.floor(e.time % 60)).padStart(2, '0')}`;
        this.effects.appendChild(h('div', { class: 'effect' }, h('div', { class: 'dot', style: { background: def?.color ?? '#fff' } }), `${def?.name ?? id}${e.level > 0 ? ' ' + 'I'.repeat(e.level + 1) : ''} ${time}`));
      }
    }
    // Boss
    if (s.boss) {
      this.bossbar.style.display = 'block';
      this.bossName.textContent = s.boss.name;
      this.bossFill.style.width = `${Math.max(0, (s.boss.hp / s.boss.max) * 100)}%`;
    } else this.bossbar.style.display = 'none';
    // Recharge d'attaque / utilisation
    this.attack.style.display = s.attackCharge < 0.98 ? 'block' : 'none';
    this.attackFill.style.width = `${s.attackCharge * 100}%`;
    this.use.style.display = s.useProgress >= 0 ? 'block' : 'none';
    this.useFill.style.width = `${Math.max(0, s.useProgress) * 100}%`;
    // Débogage
    this.debug.style.display = s.debug ? 'block' : 'none';
    if (s.debug) this.debug.innerHTML = s.debug.split('\n').map((l) => `<span>${escapeHtml(l)}</span>`).join('\n');
    this.fpsEl.textContent = s.fps !== null && !s.debug ? t('{fps} IPS', { fps: s.fps }) : '';
    // Vignette
    this.vignette.className = 'vignette' + (s.vignette ? ' ' + s.vignette : '');
    this.vignette.style.opacity = String(s.vignette ? s.vignetteAmount : 0);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!);
}

/** Remplit une case (HUD ou inventaire) avec l'icône, la quantité et l'usure. */
export function fillSlot(el: HTMLElement, s: { id: string; count: number; dmg?: number } | null, icons: IconFactory, content: Content, sel = false): void {
  clear(el);
  if (el.classList.contains('hslot')) el.classList.toggle('sel', sel);
  if (!s) return;
  el.appendChild(h('img', { class: 'ico', src: icons.icon(s.id), draggable: false }));
  if (s.count > 1) el.appendChild(h('div', { class: 'cnt' }, String(s.count)));
  const it = content.items.get(s.id);
  const dur = it?.tool?.durability ?? it?.armor?.durability ?? it?.shield?.durability;
  if (dur && s.dmg) {
    const f = Math.max(0, 1 - s.dmg / dur);
    const col = `hsl(${Math.round(f * 120)}, 90%, 45%)`;
    el.appendChild(h('div', { class: 'dur' }, h('div', { style: { width: `${f * 100}%`, background: col } })));
  }
}
