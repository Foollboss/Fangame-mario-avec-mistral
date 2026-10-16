/**
 * Commandes tactiles (style Bedrock) : joystick carré, boutons Saut / Accroupi /
 * Sprint / Attaquer / Utiliser, rotation de la caméra par glissement, appui court = utiliser,
 * appui long = casser. Disposition personnalisable (glisser-déposer) et enregistrée.
 */
import { icon } from '../ui/icons';
import type { InputManager } from './InputManager';
import type { SettingsManager } from '../core/Settings';

interface ButtonDef {
  id: string;
  icon: string;
  x: number;
  y: number;
  toggle?: boolean;
}

export const DEFAULT_TOUCH_LAYOUT: ButtonDef[] = [
  { id: 'jump', icon: 'jump', x: 92.5, y: 40 },
  { id: 'sneak', icon: 'sneak', x: 92.5, y: 60, toggle: true },
  { id: 'use', icon: 'use', x: 92.5, y: 80 },
  { id: 'sprint', icon: 'sprint', x: 82.5, y: 50, toggle: true },
  { id: 'attack', icon: 'sword', x: 82.5, y: 70 },
];
const JOYSTICK_DEFAULT: [number, number] = [15, 62];

export class TouchControls {
  readonly el: HTMLElement;
  private joy: HTMLElement;
  private knob: HTMLElement;
  private buttons = new Map<string, HTMLElement>();
  private joyTouch: number | null = null;
  private joyCenter = { x: 0, y: 0 };
  private lookTouches = new Map<number, { x: number; y: number; startX: number; startY: number; t: number; moved: boolean; holding: boolean }>();
  private btnTouches = new Map<number, string>();
  private toggles = new Set<string>();
  editing = false;
  private dragging: { id: string; el: HTMLElement } | null = null;
  private holdTimer: number | null = null;
  flying = false;

  constructor(
    private input: InputManager,
    private settings: SettingsManager,
  ) {
    this.el = document.createElement('div');
    this.el.className = 'touch-layer';
    this.joy = document.createElement('div');
    this.joy.className = 'joystick';
    this.knob = document.createElement('div');
    this.knob.className = 'knob';
    this.joy.appendChild(this.knob);
    this.el.appendChild(this.joy);
    for (const b of DEFAULT_TOUCH_LAYOUT) {
      const e = document.createElement('div');
      e.className = 'tbtn';
      e.dataset.id = b.id;
      const im = document.createElement('img');
      im.src = icon(b.icon);
      im.style.width = '62%';
      im.style.imageRendering = 'pixelated';
      e.appendChild(im);
      this.el.appendChild(e);
      this.buttons.set(b.id, e);
    }
    this.layout();
    this.el.addEventListener('touchstart', (e) => this.onStart(e), { passive: false });
    this.el.addEventListener('touchmove', (e) => this.onMove(e), { passive: false });
    this.el.addEventListener('touchend', (e) => this.onEnd(e), { passive: false });
    this.el.addEventListener('touchcancel', (e) => this.onEnd(e), { passive: false });
    settings.onChange(() => this.layout());
  }

  layout(): void {
    const s = this.settings.data;
    this.el.style.setProperty('--tbs', String(s.touchButtonSize));
    this.el.style.opacity = String(Math.max(0.15, s.touchOpacity + 0.35));
    const mirror = (x: number) => (s.leftHanded ? 100 - x : x);
    const jp = s.touchLayout.joystick ?? JOYSTICK_DEFAULT;
    this.joy.style.left = mirror(jp[0]) + '%';
    this.joy.style.top = jp[1] + '%';
    for (const b of DEFAULT_TOUCH_LAYOUT) {
      const e = this.buttons.get(b.id)!;
      const p = s.touchLayout[b.id] ?? [b.x, b.y];
      e.style.left = mirror(p[0]) + '%';
      e.style.top = p[1] + '%';
    }
  }

  setFlying(f: boolean): void {
    if (f === this.flying) return;
    this.flying = f;
    (this.buttons.get('jump')!.firstChild as HTMLImageElement).src = icon(f ? 'flyup' : 'jump');
    (this.buttons.get('sneak')!.firstChild as HTMLImageElement).src = icon(f ? 'flydown' : 'sneak');
  }

  private hit(x: number, y: number): string | null {
    for (const [id, e] of this.buttons) {
      const r = e.getBoundingClientRect();
      const pad = r.width * 0.15;
      if (x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad) return id;
    }
    const jr = this.joy.getBoundingClientRect();
    if (x >= jr.left - jr.width * 0.3 && x <= jr.right + jr.width * 0.3 && y >= jr.top - jr.height * 0.3 && y <= jr.bottom + jr.height * 0.3) return 'joystick';
    return null;
  }

  private onStart(e: TouchEvent): void {
    e.preventDefault();
    this.input.lastDevice = 'touch';
    for (const t of Array.from(e.changedTouches)) {
      const id = this.hit(t.clientX, t.clientY);
      if (this.editing) {
        if (id) this.dragging = { id, el: id === 'joystick' ? this.joy : this.buttons.get(id)! };
        continue;
      }
      if (id === 'joystick' && this.joyTouch === null) {
        this.joyTouch = t.identifier;
        const r = this.joy.getBoundingClientRect();
        this.joyCenter = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        this.updateJoy(t.clientX, t.clientY);
      } else if (id && id !== 'joystick') {
        this.btnTouches.set(t.identifier, id);
        this.press(id, true);
      } else {
        this.lookTouches.set(t.identifier, { x: t.clientX, y: t.clientY, startX: t.clientX, startY: t.clientY, t: performance.now(), moved: false, holding: false });
        // Appui long immobile : casser
        if (this.holdTimer) clearTimeout(this.holdTimer);
        const tid = t.identifier;
        this.holdTimer = window.setTimeout(() => {
          const lt = this.lookTouches.get(tid);
          if (lt && !lt.moved) {
            lt.holding = true;
            this.input.touch.attack = true;
            this.input.state.attackPressed = true;
          }
        }, 280);
      }
    }
  }

  private onMove(e: TouchEvent): void {
    e.preventDefault();
    const sens = 0.0025 + this.settings.data.touchSensitivity * 0.009;
    for (const t of Array.from(e.changedTouches)) {
      if (this.editing && this.dragging) {
        const x = (t.clientX / window.innerWidth) * 100;
        const y = (t.clientY / window.innerHeight) * 100;
        this.dragging.el.style.left = x + '%';
        this.dragging.el.style.top = y + '%';
        continue;
      }
      if (t.identifier === this.joyTouch) {
        this.updateJoy(t.clientX, t.clientY);
        continue;
      }
      const lt = this.lookTouches.get(t.identifier);
      if (lt) {
        const dx = t.clientX - lt.x;
        const dy = t.clientY - lt.y;
        lt.x = t.clientX;
        lt.y = t.clientY;
        if (Math.hypot(t.clientX - lt.startX, t.clientY - lt.startY) > 10) lt.moved = true;
        this.input.state.lookDX += dx * sens;
        this.input.state.lookDY += dy * sens * (this.settings.data.invertY ? -1 : 1);
      }
      const bid = this.btnTouches.get(t.identifier);
      if (bid === 'attack' || bid === 'use') {
        // Glisser depuis les boutons d'action oriente aussi la caméra
      }
    }
  }

  private onEnd(e: TouchEvent): void {
    e.preventDefault();
    for (const t of Array.from(e.changedTouches)) {
      if (this.editing) {
        if (this.dragging) {
          const x = (t.clientX / window.innerWidth) * 100;
          const y = (t.clientY / window.innerHeight) * 100;
          const lay = { ...this.settings.data.touchLayout };
          lay[this.dragging.id] = [this.settings.data.leftHanded ? 100 - x : x, y];
          this.settings.set('touchLayout', lay);
          this.dragging = null;
        }
        continue;
      }
      if (t.identifier === this.joyTouch) {
        this.joyTouch = null;
        this.input.touch.moveX = 0;
        this.input.touch.moveZ = 0;
        this.knob.style.left = '50%';
        this.knob.style.top = '50%';
        continue;
      }
      const bid = this.btnTouches.get(t.identifier);
      if (bid) {
        this.btnTouches.delete(t.identifier);
        this.press(bid, false);
        continue;
      }
      const lt = this.lookTouches.get(t.identifier);
      if (lt) {
        this.lookTouches.delete(t.identifier);
        if (lt.holding) this.input.touch.attack = false;
        else if (!lt.moved && performance.now() - lt.t < 280) this.input.state.usePressed = true;
        if (this.holdTimer) clearTimeout(this.holdTimer);
      }
    }
  }

  private updateJoy(x: number, y: number): void {
    const r = this.joy.getBoundingClientRect();
    const max = r.width / 2;
    let dx = x - this.joyCenter.x;
    let dy = y - this.joyCenter.y;
    // Le joystick est carré : on borne chaque axe
    dx = Math.max(-max, Math.min(max, dx));
    dy = Math.max(-max, Math.min(max, dy));
    this.knob.style.left = 50 + (dx / max) * 50 + '%';
    this.knob.style.top = 50 + (dy / max) * 50 + '%';
    const nx = dx / max;
    const ny = -dy / max;
    this.input.touch.moveX = Math.abs(nx) < 0.15 ? 0 : nx;
    this.input.touch.moveZ = Math.abs(ny) < 0.15 ? 0 : ny;
  }

  private press(id: string, down: boolean): void {
    const e = this.buttons.get(id)!;
    e.classList.toggle('pressed', down);
    const def = DEFAULT_TOUCH_LAYOUT.find((b) => b.id === id)!;
    if (def.toggle && !(id === 'sneak' && this.flying)) {
      if (!down) return;
      if (this.toggles.has(id)) this.toggles.delete(id);
      else this.toggles.add(id);
      const on = this.toggles.has(id);
      e.classList.toggle('on', on);
      if (id === 'sneak') this.input.touch.sneak = on;
      if (id === 'sprint') this.input.touch.sprint = on;
      return;
    }
    switch (id) {
      case 'jump':
        this.input.touch.jump = down;
        break;
      case 'sneak':
        this.input.touch.sneak = down;
        break;
      case 'attack':
        this.input.touch.attack = down;
        if (down) this.input.state.attackPressed = true;
        break;
      case 'use':
        this.input.touch.use = down;
        if (down) this.input.state.usePressed = true;
        break;
    }
  }

  reset(): void {
    this.toggles.clear();
    this.buttons.forEach((b) => b.classList.remove('on', 'pressed'));
    Object.assign(this.input.touch, { moveX: 0, moveZ: 0, jump: false, sneak: false, sprint: false, attack: false, use: false });
    this.lookTouches.clear();
    this.btnTouches.clear();
    this.joyTouch = null;
  }

  setEditing(on: boolean): void {
    this.editing = on;
    this.el.classList.toggle('touch-edit', on);
    this.reset();
  }
}
