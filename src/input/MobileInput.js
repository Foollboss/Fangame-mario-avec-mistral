import { Platform } from '../platform/Platform.js';

// Default layout, in reference pixels (screen 360px tall) measured from the bottom-right corner
// (mirrored to the bottom-left in left-handed mode).
export const BUTTONS = [
  { id: 'jump', label: 'SAUT', size: 90, dx: 72, dy: 72 },
  { id: 'boost', label: 'BOOST', size: 80, dx: 176, dy: 60 },
  { id: 'dash', label: 'DASH', size: 64, dx: 66, dy: 178 },
  { id: 'accel', label: 'GAZ', size: 72, dx: 270, dy: 56 },
  { id: 'brake', label: 'FREIN', size: 56, dx: 266, dy: 142 },
];

const ICONS = {
  jump: '<svg viewBox="0 0 24 24"><path d="M12 4l7 8h-4v7H9v-7H5z"/></svg>',
  boost: '<svg viewBox="0 0 24 24"><path d="M13 2L5 14h6l-1 8 8-12h-6z"/></svg>',
  dash: '<svg viewBox="0 0 24 24"><path d="M4 6l8 6-8 6zm8 0l8 6-8 6z"/></svg>',
  accel: '<svg viewBox="0 0 24 24"><path d="M12 3l8 10h-5v8H9v-8H4z" transform="rotate(0 12 12)"/></svg>',
  brake: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
};

export class MobileInput {
  constructor(root, settings) {
    this.root = root;
    this.settings = settings;
    this.state = { stickX: 0, stickY: 0, accel: false, brake: false, jump: false, boost: false, dash: false };
    this.pointers = new Map();
    this.buttons = {};
    this.enabled = false;
    this.editing = null;
    this.build();
    this.bind();
  }

  build() {
    this.root.innerHTML = '';
    const stick = document.createElement('div');
    stick.className = 'stick';
    stick.innerHTML = '<div class="stick-base"></div><div class="stick-knob"></div>';
    this.root.appendChild(stick);
    this.stick = { el: stick, base: stick.firstChild, knob: stick.lastChild, active: false, cx: 0, cy: 0, id: null };
    for (const b of BUTTONS) {
      const el = document.createElement('div');
      el.className = `tbtn tbtn-${b.id}`;
      el.innerHTML = `${b.id === 'boost' ? '<div class="ring"></div>' : ''}<div class="ico">${ICONS[b.id]}</div><span>${b.label}</span>`;
      this.root.appendChild(el);
      this.buttons[b.id] = { ...b, el, x: 0, y: 0, r: 0, pressed: false };
    }
    this.layout();
  }

  unit() {
    const h = window.innerHeight;
    return Math.max(0.8, Math.min(1.7, h / 360));
  }

  // Positions every control from the saved layout, scale and handedness.
  layout() {
    const c = this.settings.controls;
    const u = this.unit();
    const scale = c.buttonScale * u;
    const ins = Platform.insets();
    const W = window.innerWidth, H = window.innerHeight;
    const custom = this.currentLayout || {};
    const left = c.leftHanded;
    for (const b of Object.values(this.buttons)) {
      const pos = custom[b.id] || { dx: b.dx, dy: b.dy };
      const size = b.size * scale;
      const dx = pos.dx * u + (left ? ins.left : ins.right);
      const dy = pos.dy * u + ins.bottom;
      b.x = left ? dx : W - dx;
      b.y = H - dy;
      b.r = size / 2;
      Object.assign(b.el.style, { width: `${size}px`, height: `${size}px`, left: `${b.x - size / 2}px`, top: `${b.y - size / 2}px` });
      b.el.style.display = b.id === 'accel' && c.autoAccel && !this.editing ? 'none' : '';
    }
    const js = 62 * c.joystickSize * u;
    this.stickRadius = js;
    const rest = { x: left ? W - ins.right - 118 * u : ins.left + 118 * u, y: H - ins.bottom - 104 * u };
    this.stickRest = rest;
    if (!this.stick.active) this.placeStick(rest.x, rest.y);
    Object.assign(this.stick.base.style, { width: `${js * 2}px`, height: `${js * 2}px` });
    Object.assign(this.stick.knob.style, { width: `${js * 0.9}px`, height: `${js * 0.9}px` });
  }

  placeStick(x, y) {
    this.stick.cx = x;
    this.stick.cy = y;
    this.stick.el.style.transform = `translate(${x}px, ${y}px)`;
    this.stick.knob.style.transform = 'translate(-50%, -50%)';
  }

  hitButton(x, y) {
    let best = null, bd = Infinity;
    for (const b of Object.values(this.buttons)) {
      if (b.el.style.display === 'none') continue;
      const d = Math.hypot(x - b.x, y - b.y);
      if (d < b.r * 1.18 && d < bd) { bd = d; best = b; }
    }
    return best;
  }

  inStickZone(x) {
    const W = window.innerWidth;
    return this.settings.controls.leftHanded ? x > W * 0.55 : x < W * 0.45;
  }

  bind() {
    const el = this.root;
    const down = (e) => {
      if (!this.enabled && !this.editing) return;
      e.preventDefault();
      const x = e.clientX, y = e.clientY;
      if (this.editing) return this.editDown(e);
      const btn = this.hitButton(x, y);
      if (btn) {
        this.pointers.set(e.pointerId, { type: 'btn', btn });
        this.press(btn, true);
      } else if (this.inStickZone(x) && !this.stick.active) {
        this.stick.active = true;
        this.stick.id = e.pointerId;
        this.placeStick(x, y);
        this.stick.el.classList.add('active');
        this.pointers.set(e.pointerId, { type: 'stick' });
      } else {
        this.pointers.set(e.pointerId, { type: 'none' });
      }
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
    };
    const move = (e) => {
      if (this.editing) return this.editMove(e);
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      e.preventDefault();
      if (p.type === 'stick') {
        const dx = e.clientX - this.stick.cx, dy = e.clientY - this.stick.cy;
        const r = this.stickRadius;
        const len = Math.hypot(dx, dy);
        const k = len > r ? r / len : 1;
        const kx = dx * k, ky = dy * k;
        this.stick.knob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
        let sx = kx / r, sy = -ky / r;
        const m = Math.hypot(sx, sy);
        if (m < 0.12) { sx = 0; sy = 0; } else { const f = (m - 0.12) / 0.88 / m; sx *= f; sy *= f; }
        this.state.stickX = sx;
        this.state.stickY = sy;
      } else if (p.type === 'btn') {
        // Sliding a thumb between buttons switches button
        const b = this.hitButton(e.clientX, e.clientY);
        if (b && b !== p.btn) {
          const old = p.btn;
          p.btn = b;
          this.press(old, false);
          this.press(b, true);
        }
      }
    };
    const up = (e) => {
      if (this.editing) return this.editUp(e);
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      this.pointers.delete(e.pointerId);
      if (p.type === 'stick') {
        this.stick.active = false;
        this.stick.el.classList.remove('active');
        this.state.stickX = 0;
        this.state.stickY = 0;
        this.placeStick(this.stickRest.x, this.stickRest.y);
      } else if (p.type === 'btn') {
        this.press(p.btn, false);
      }
    };
    el.addEventListener('pointerdown', down, { passive: false });
    el.addEventListener('pointermove', move, { passive: false });
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('resize', () => this.layout());
  }

  press(btn, on) {
    // A button stays pressed while any pointer holds it
    if (!on) {
      for (const p of this.pointers.values()) if (p.type === 'btn' && p.btn === btn) return;
    }
    if (btn.pressed === on) return;
    btn.pressed = on;
    this.state[btn.id] = on;
    btn.el.classList.toggle('pressed', on);
    if (on && (btn.id === 'jump' || btn.id === 'dash')) Platform.vibrate(8);
  }

  releaseAll() {
    this.pointers.clear();
    for (const b of Object.values(this.buttons)) {
      b.pressed = false;
      b.el.classList.remove('pressed');
      this.state[b.id] = false;
    }
    this.state.stickX = this.state.stickY = 0;
    this.stick.active = false;
    this.stick.el.classList.remove('active');
    this.placeStick(this.stickRest.x, this.stickRest.y);
  }

  setEnabled(on) {
    this.enabled = on;
    this.root.classList.toggle('hidden', !on && !this.editing);
    if (!on) this.releaseAll();
  }

  setBoost(v) {
    const b = this.buttons.boost;
    b.el.style.setProperty('--boost', `${Math.round(v)}`);
    b.el.classList.toggle('empty', v < 1);
  }

  // ---------- layout editor ----------
  startEditing(onChange) {
    this.editing = { onChange, drag: null, layout: { ...(this.settings.controls.layout || {}) } };
    this.root.classList.remove('hidden');
    this.root.classList.add('editing');
    this.layout();
  }

  stopEditing(save) {
    const ed = this.editing;
    this.editing = null;
    this.root.classList.remove('editing');
    if (save) this.settings.controls.layout = Object.keys(ed.layout).length ? ed.layout : null;
    this.root.classList.toggle('hidden', !this.enabled);
    this.layout();
  }

  resetLayout() {
    if (!this.editing) return;
    this.editing.layout = {};
    this.layout();
  }

  editDown(e) {
    const b = this.hitButton(e.clientX, e.clientY);
    if (!b) return;
    this.editing.drag = { b, id: e.pointerId, ox: e.clientX - b.x, oy: e.clientY - b.y };
    b.el.classList.add('pressed');
    try { this.root.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
  }

  editMove(e) {
    const d = this.editing.drag;
    if (!d || d.id !== e.pointerId) return;
    const W = window.innerWidth, H = window.innerHeight;
    const x = Math.max(d.b.r, Math.min(W - d.b.r, e.clientX - d.ox));
    const y = Math.max(d.b.r, Math.min(H - d.b.r, e.clientY - d.oy));
    const u = this.unit();
    const ins = Platform.insets();
    const left = this.settings.controls.leftHanded;
    const dx = ((left ? x - ins.left : W - x - ins.right)) / u;
    const dy = (H - y - ins.bottom) / u;
    this.editing.layout[d.b.id] = { dx, dy };
    this.layout();
  }

  editUp() {
    const d = this.editing.drag;
    if (d) d.b.el.classList.remove('pressed');
    this.editing.drag = null;
    this.editing.onChange && this.editing.onChange();
  }

  // While editing, the working copy wins over the saved layout.
  get currentLayout() {
    return this.editing ? this.editing.layout : this.settings.controls.layout;
  }
}
