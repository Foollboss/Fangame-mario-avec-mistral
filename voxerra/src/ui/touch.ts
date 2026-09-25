/**
 * Contrôles tactiles : joystick de déplacement (à gauche, sprint en bout de
 * course), regard en glissant le doigt sur l'écran, appui bref = utiliser /
 * poser, appui long = casser / attaquer, boutons (saut, accroupi, attaque,
 * utilisation, inventaire, discussion, lâcher, vue, pause) et sélection de
 * l'emplacement en touchant la barre rapide.
 */
import { h } from './dom';
import type { InputManager, Action } from '../input/input';
import { t } from '../i18n/i18n';

export interface TouchHost {
  /** Le joueur est en jeu, sans écran ouvert. */
  playing(): boolean;
  selectSlot(i: number): void;
}

interface LookTouch {
  id: number;
  x: number;
  y: number;
  t0: number;
  moved: number;
  holding: boolean;
}

const LONG_PRESS = 320; // ms avant de casser
const TAP_MOVE = 12; // px maximum pour un appui bref

export class TouchControls {
  readonly el: HTMLElement;
  private enabled = false;
  private visible = false;
  private joyBase: HTMLElement;
  private joyKnob: HTMLElement;
  private joy: { id: number; cx: number; cy: number; r: number } | null = null;
  private look: LookTouch | null = null;
  private sneakBtn: HTMLElement;
  private sneakOn = false;
  private buttonTouches = new Map<number, Action>();

  constructor(
    private input: InputManager,
    private host: TouchHost,
  ) {
    const lookArea = h('div', { class: 'touch-look' });
    this.joyKnob = h('div', { class: 'touch-knob' });
    this.joyBase = h('div', { class: 'touch-joy' }, this.joyKnob);
    const btn = (cls: string, label: string, title: string, action: Action, mode: 'hold' | 'tap') => {
      const b = h('div', { class: 'touch-btn ' + cls, title, 'aria-label': title, role: 'button' }, label);
      b.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        for (const tt of Array.from(e.changedTouches)) this.buttonTouches.set(tt.identifier, action);
        b.classList.add('on');
        if (mode === 'tap') this.input.tapVirtual(action);
        else this.input.setVirtual(action, true);
      }, { passive: false });
      const end = (e: TouchEvent) => {
        e.preventDefault();
        for (const tt of Array.from(e.changedTouches)) this.buttonTouches.delete(tt.identifier);
        b.classList.remove('on');
        if (mode === 'hold') this.input.setVirtual(action, false);
      };
      b.addEventListener('touchend', end, { passive: false });
      b.addEventListener('touchcancel', end, { passive: false });
      return b;
    };
    this.sneakBtn = h('div', { class: 'touch-btn sneak', title: t('S’accroupir'), 'aria-label': t('S’accroupir'), role: 'button' }, '⇩');
    this.sneakBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.sneakOn = !this.sneakOn;
      this.sneakBtn.classList.toggle('on', this.sneakOn);
      this.input.setVirtual('sneak', this.sneakOn);
    }, { passive: false });
    const actions = h(
      'div',
      { class: 'touch-actions' },
      btn('attack', '⚔', t('Attaquer / casser'), 'attack', 'hold'),
      btn('use', '✋', t('Utiliser / poser'), 'use', 'hold'),
      this.sneakBtn,
      btn('jump', '⇧', t('Sauter / nager'), 'jump', 'hold'),
    );
    const top = h(
      'div',
      { class: 'touch-top' },
      btn('small', '🎒', t('Inventaire'), 'inventory', 'tap'),
      btn('small', '💬', t('Discussion'), 'chat', 'tap'),
      btn('small', '⤓', t('Lâcher l’objet'), 'drop', 'tap'),
      btn('small', '👁', t('Changer de vue'), 'perspective', 'tap'),
      btn('small', '⏸', t('Menu du jeu'), 'pause', 'tap'),
    );
    this.el = h('div', { class: 'touch-ui' }, lookArea, this.joyBase, actions, top);
    this.el.hidden = true;

    // Joystick
    this.joyBase.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.joy) return;
      const tt = e.changedTouches[0];
      const r = this.joyBase.getBoundingClientRect();
      this.joy = { id: tt.identifier, cx: r.left + r.width / 2, cy: r.top + r.height / 2, r: r.width / 2 };
      this.moveJoy(tt.clientX, tt.clientY);
    }, { passive: false });

    // Regard, appui bref / long, barre rapide
    lookArea.addEventListener('touchstart', (e) => {
      e.preventDefault();
      for (const tt of Array.from(e.changedTouches)) {
        const slot = this.hotbarSlotAt(tt.clientX, tt.clientY);
        if (slot >= 0) {
          this.host.selectSlot(slot);
          continue;
        }
        if (this.look) continue;
        this.look = { id: tt.identifier, x: tt.clientX, y: tt.clientY, t0: performance.now(), moved: 0, holding: false };
      }
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
      if (!this.visible) return;
      for (const tt of Array.from(e.changedTouches)) {
        if (this.joy && tt.identifier === this.joy.id) this.moveJoy(tt.clientX, tt.clientY);
        else if (this.look && tt.identifier === this.look.id) {
          const dx = tt.clientX - this.look.x,
            dy = tt.clientY - this.look.y;
          this.look.x = tt.clientX;
          this.look.y = tt.clientY;
          this.look.moved += Math.abs(dx) + Math.abs(dy);
          this.input.touchLook(dx, dy);
        }
      }
      if (this.joy || this.look) e.preventDefault();
    }, { passive: false });

    const endTouch = (e: TouchEvent) => {
      for (const tt of Array.from(e.changedTouches)) {
        if (this.joy && tt.identifier === this.joy.id) {
          this.joy = null;
          this.joyKnob.style.transform = '';
          this.joyKnob.classList.remove('sprint');
          this.input.touchMoveX = this.input.touchMoveY = 0;
          this.input.setVirtual('sprint', false);
        } else if (this.look && tt.identifier === this.look.id) {
          const l = this.look;
          this.look = null;
          if (l.holding) this.input.setVirtual('attack', false);
          else if (l.moved < TAP_MOVE && performance.now() - l.t0 < LONG_PRESS) this.input.tapVirtual('use');
        }
      }
    };
    window.addEventListener('touchend', endTouch);
    window.addEventListener('touchcancel', endTouch);
  }

  private moveJoy(x: number, y: number): void {
    const j = this.joy!;
    let dx = x - j.cx,
      dy = y - j.cy;
    const d = Math.hypot(dx, dy);
    const max = j.r;
    if (d > max) {
      dx = (dx / d) * max;
      dy = (dy / d) * max;
    }
    this.joyKnob.style.transform = `translate(${dx}px, ${dy}px)`;
    const nx = dx / max,
      ny = dy / max;
    // zone morte
    const mag = Math.hypot(nx, ny);
    this.input.touchMoveX = mag < 0.12 ? 0 : nx;
    this.input.touchMoveY = mag < 0.12 ? 0 : ny;
    // sprint en poussant le joystick au bout, vers l'avant
    const sprint = mag > 0.92 && ny < -0.6;
    this.joyKnob.classList.toggle('sprint', sprint);
    this.input.setVirtual('sprint', sprint);
  }

  private hotbarSlotAt(x: number, y: number): number {
    const hb = document.querySelector('.hotbar') as HTMLElement | null;
    if (!hb) return -1;
    const r = hb.getBoundingClientRect();
    if (x < r.left || x > r.right || y < r.top || y > r.bottom) return -1;
    return Math.max(0, Math.min(8, Math.floor(((x - r.left) / r.width) * 9)));
  }

  setEnabled(on: boolean): void {
    this.enabled = on;
    this.input.touchEnabled = on;
    document.body.classList.toggle('touch-mode', on);
    if (!on) this.hide();
  }

  private hide(): void {
    if (!this.visible) return;
    this.visible = false;
    this.el.hidden = true;
    this.joy = null;
    this.look = null;
    this.sneakOn = false;
    this.sneakBtn.classList.remove('on');
    this.joyKnob.style.transform = '';
    this.input.releaseVirtual();
  }

  /** À chaque image : affiché seulement en jeu, sans écran ouvert. */
  update(): void {
    const show = this.enabled && this.host.playing();
    if (show === this.visible) {
      // appui long sur la zone de regard → casser / attaquer
      const l = this.look;
      if (show && l && !l.holding && l.moved < TAP_MOVE * 2 && performance.now() - l.t0 >= LONG_PRESS) {
        l.holding = true;
        this.input.setVirtual('attack', true);
      }
      return;
    }
    if (show) {
      this.visible = true;
      this.el.hidden = false;
    } else this.hide();
  }
}
