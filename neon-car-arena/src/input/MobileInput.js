import { clamp } from '../core/math.js';

// Positions par défaut (en vmin depuis le bord droit et le bas) et tailles des boutons.
export const DEFAULT_LAYOUT = {
  accel: { r: 3, b: 4, s: 21 },
  brake: { r: 27, b: 3, s: 13 },
  jump: { r: 5, b: 29, s: 18 },
  boost: { r: 25, b: 18, s: 17 },
  dash: { r: 24, b: 38, s: 13 },
};

export const ONE_HAND_LAYOUT = {
  accel: { r: 3, b: 3, s: 17 },
  brake: { r: 22, b: 3, s: 12 },
  jump: { r: 3, b: 22, s: 15 },
  boost: { r: 19, b: 16, s: 15 },
  dash: { r: 35, b: 5, s: 12 },
};

const BUTTONS = [
  { id: 'accel', label: 'ACCÉL', icon: '▲' },
  { id: 'brake', label: 'FREIN', icon: '▼' },
  { id: 'jump', label: 'SAUT', icon: '⤒' },
  { id: 'boost', label: 'BOOST', icon: '»' },
  { id: 'dash', label: 'DASH', icon: '↻' },
];

// Commandes tactiles : joystick flottant à gauche, boutons à droite (glisser d'un bouton à l'autre).
export class MobileInput {
  constructor(root, settings) {
    this.root = root;
    this.settings = settings;
    this.state = { x: 0, y: 0, accel: false, brake: false, jump: false, boost: false, dash: false };
    this.stickPointer = null;
    this.stickOrigin = { x: 0, y: 0 };
    this.buttonPointers = new Map(); // pointerId -> id du bouton
    this.onVibrate = null;
    this.build();
  }

  build() {
    const el = document.createElement('div');
    el.className = 'touch-layer';
    el.innerHTML = `
      <div class="stick-zone"></div>
      <div class="stick-base hidden"><div class="stick-knob"></div></div>
      ${BUTTONS.map((b) => `<div class="tbtn tbtn-${b.id}" data-btn="${b.id}"><span class="ico">${b.icon}</span><span class="lbl">${b.label}</span>${b.id === 'boost' ? '<div class="boost-fill"></div><span class="boost-num">33</span>' : ''}</div>`).join('')}`;
    this.root.appendChild(el);
    this.el = el;
    this.zone = el.querySelector('.stick-zone');
    this.base = el.querySelector('.stick-base');
    this.knob = el.querySelector('.stick-knob');
    this.buttons = Object.fromEntries(BUTTONS.map((b) => [b.id, el.querySelector(`[data-btn="${b.id}"]`)]));
    this.boostFill = el.querySelector('.boost-fill');
    this.boostNum = el.querySelector('.boost-num');
    this.applyLayout();

    this.zone.addEventListener('pointerdown', (e) => this.stickDown(e));
    for (const btn of Object.values(this.buttons)) btn.addEventListener('pointerdown', (e) => this.btnDown(e));
    this._move = (e) => this.move(e);
    this._up = (e) => this.up(e);
    window.addEventListener('pointermove', this._move, { passive: false });
    window.addEventListener('pointerup', this._up);
    window.addEventListener('pointercancel', this._up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  applyLayout() {
    const layout = { ...DEFAULT_LAYOUT, ...(this.settings.layout || {}) };
    const scale = this.settings.buttonScale || 1;
    for (const [id, btn] of Object.entries(this.buttons)) {
      const p = layout[id];
      const s = p.s * scale;
      Object.assign(btn.style, { right: `calc(${p.r}vmin + var(--safe-r))`, bottom: `calc(${p.b}vmin + var(--safe-b))`, width: `${s}vmin`, height: `${s}vmin` });
    }
  }

  setVisible(v) { this.el.classList.toggle('hidden', !v); if (!v) this.releaseAll(); }

  setBoost(v) {
    const pct = Math.round(v);
    if (pct === this._lastBoost) return;
    this._lastBoost = pct;
    this.boostFill.style.setProperty('--p', pct);
    this.boostNum.textContent = pct;
  }

  stickDown(e) {
    if (this.stickPointer !== null) return;
    e.preventDefault();
    this.stickPointer = e.pointerId;
    this.stickOrigin = { x: e.clientX, y: e.clientY };
    this.base.style.left = `${e.clientX}px`;
    this.base.style.top = `${e.clientY}px`;
    this.base.classList.remove('hidden');
    this.updateStick(e.clientX, e.clientY);
  }

  btnDown(e) {
    e.preventDefault();
    const id = e.currentTarget.dataset.btn;
    this.buttonPointers.set(e.pointerId, id);
    this.press(id, true);
  }

  press(id, down) {
    if (!id) return;
    // Un bouton reste enfoncé tant qu'au moins un doigt est dessus
    const still = [...this.buttonPointers.values()].includes(id);
    const v = down || still;
    if (this.state[id] === v) return;
    this.state[id] = v;
    this.buttons[id].classList.toggle('down', v);
    if (v && this.settings.vibration && navigator.vibrate) navigator.vibrate(8);
  }

  move(e) {
    if (e.pointerId === this.stickPointer) {
      e.preventDefault();
      this.updateStick(e.clientX, e.clientY);
      return;
    }
    if (!this.buttonPointers.has(e.pointerId)) return;
    // Glisser d'un bouton à un autre (ex. ACCÉL → BOOST sans lever le pouce)
    const under = document.elementFromPoint(e.clientX, e.clientY)?.closest?.('[data-btn]');
    const id = under?.dataset.btn;
    const prev = this.buttonPointers.get(e.pointerId);
    if (id && id !== prev) {
      this.buttonPointers.set(e.pointerId, id);
      this.press(prev, false);
      this.press(id, true);
    }
  }

  up(e) {
    if (e.pointerId === this.stickPointer) {
      this.stickPointer = null;
      this.state.x = this.state.y = 0;
      this.base.classList.add('hidden');
      return;
    }
    const id = this.buttonPointers.get(e.pointerId);
    if (id) {
      this.buttonPointers.delete(e.pointerId);
      this.press(id, false);
    }
  }

  updateStick(x, y) {
    const R = Math.min(window.innerWidth, window.innerHeight) * 0.12;
    let dx = x - this.stickOrigin.x, dy = y - this.stickOrigin.y;
    const len = Math.hypot(dx, dy);
    // Joystick flottant : la base suit le pouce s'il dépasse le rayon
    if (len > R * 1.4) {
      const k = (len - R * 1.4) / len;
      this.stickOrigin.x += dx * k; this.stickOrigin.y += dy * k;
      this.base.style.left = `${this.stickOrigin.x}px`;
      this.base.style.top = `${this.stickOrigin.y}px`;
      dx = x - this.stickOrigin.x; dy = y - this.stickOrigin.y;
    }
    const sens = this.settings.sensitivity || 1;
    let nx = dx / R * sens, ny = -dy / R * sens;
    const m = Math.hypot(nx, ny);
    if (m > 1) { nx /= m; ny /= m; }
    const dead = 0.08;
    this.state.x = Math.abs(nx) < dead ? 0 : nx;
    this.state.y = Math.abs(ny) < dead ? 0 : ny;
    const kx = clamp(dx, -R, R), ky = clamp(dy, -R, R);
    this.knob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
  }

  releaseAll() {
    this.buttonPointers.clear();
    for (const id of Object.keys(this.buttons)) this.press(id, false);
    this.stickPointer = null;
    this.state.x = this.state.y = 0;
    this.base?.classList.add('hidden');
  }

  dispose() {
    window.removeEventListener('pointermove', this._move);
    window.removeEventListener('pointerup', this._up);
    window.removeEventListener('pointercancel', this._up);
    this.el.remove();
  }
}
