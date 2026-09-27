// On-screen controls for phones and tablets: a floating joystick on the left half (steering, and flying in the air)
// and pedals / action buttons on the right.
export function isTouchDevice() {
  return (typeof window !== 'undefined') && (('ontouchstart' in window) || navigator.maxTouchPoints > 0)
    && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
}

const BUTTONS = [
  { id: 'gas', label: '▲<small>AVANCER</small>', cls: 'tb-gas' },
  { id: 'reverse', label: '▼<small>RECULER</small>', cls: 'tb-rev' },
  { id: 'jump', label: 'SAUT', cls: 'tb-jump' },
  { id: 'boost', label: 'BOOST', cls: 'tb-boost' },
  { id: 'handbrake', label: 'DÉRAPE', cls: 'tb-slide' },
  { id: 'ballCam', label: 'CAM', cls: 'tb-cam', tap: true },
  { id: 'pause', label: 'II', cls: 'tb-pause', tap: true },
  { id: 'resetBall', label: 'BALLE', cls: 'tb-reset', tap: true },
  { id: 'shootBall', label: 'TIR', cls: 'tb-shoot', tap: true },
];
const HELD = BUTTONS.filter((b) => !b.tap);

export class TouchControls {
  constructor(input) {
    this.input = input;
    this.stick = { x: 0, y: 0, id: null, ox: 0, oy: 0 };
    this.held = { gas: false, reverse: false, jump: false, boost: false, handbrake: false };
    this.fingers = new Map(); // pointerId -> {x, y} for fingers on the right-hand buttons
    this.visible = false;
    const root = document.createElement('div');
    root.id = 'touch';
    root.className = 'hidden';
    root.innerHTML = `<div class="t-zone"></div><div class="t-base hidden"><div class="t-knob"></div></div>
      ${BUTTONS.map((b) => `<div class="tbtn ${b.cls}" data-id="${b.id}">${b.label}</div>`).join('')}`;
    document.body.appendChild(root);
    this.root = root;
    this.zone = root.querySelector('.t-zone');
    this.base = root.querySelector('.t-base');
    this.knob = root.querySelector('.t-knob');
    this.els = {};
    root.querySelectorAll('.tbtn').forEach((el) => { this.els[el.dataset.id] = el; });

    const stop = (e) => { e.preventDefault(); e.stopPropagation(); };
    const capture = (el, e) => {
      try { el.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }
    };

    // Joystick.
    this.zone.addEventListener('pointerdown', (e) => {
      stop(e);
      if (this.stick.id !== null) return;
      this.stick.id = e.pointerId;
      this.stick.ox = e.clientX;
      this.stick.oy = e.clientY;
      capture(this.zone, e);
      this.base.style.left = `${e.clientX}px`;
      this.base.style.top = `${e.clientY}px`;
      this.base.classList.remove('hidden');
      this.moveStick(e);
    });
    this.zone.addEventListener('pointermove', (e) => {
      if (e.pointerId !== this.stick.id) return;
      stop(e);
      this.moveStick(e);
    });
    const release = (e) => {
      if (e.pointerId !== this.stick.id) return;
      this.stick.id = null;
      this.stick.x = 0;
      this.stick.y = 0;
      this.base.classList.add('hidden');
      this.knob.style.transform = 'translate(-50%, -50%)';
    };
    this.zone.addEventListener('pointerup', release);
    this.zone.addEventListener('pointercancel', release);

    // Buttons. A finger can slide from one pedal/button to another (e.g. AVANCER -> BOOST) without lifting.
    for (const def of BUTTONS) {
      const el = this.els[def.id];
      el.addEventListener('contextmenu', stop);
      el.addEventListener('pointerdown', (e) => {
        stop(e);
        capture(el, e);
        if (def.tap) {
          el.classList.add('on');
          this.input.virtualPress(def.id);
          if (navigator.vibrate) navigator.vibrate(10);
          return;
        }
        this.fingers.set(e.pointerId, { x: e.clientX, y: e.clientY });
        this.refreshHeld();
      });
      el.addEventListener('pointermove', (e) => {
        const f = this.fingers.get(e.pointerId);
        if (!f) return;
        stop(e);
        f.x = e.clientX;
        f.y = e.clientY;
        this.refreshHeld();
      });
      const up = (e) => {
        stop(e);
        if (def.tap) el.classList.remove('on');
        if (this.fingers.delete(e.pointerId)) this.refreshHeld();
      };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
    }
    root.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    root.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
  }

  // Which held buttons are under a finger right now.
  refreshHeld() {
    const next = {};
    for (const def of HELD) next[def.id] = false;
    const pad = 6;
    for (const f of this.fingers.values()) {
      for (const def of HELD) {
        const r = this.els[def.id].getBoundingClientRect();
        if (f.x >= r.left - pad && f.x <= r.right + pad && f.y >= r.top - pad && f.y <= r.bottom + pad) next[def.id] = true;
      }
    }
    if (next.jump && !this.held.jump) {
      this.input.virtualPress('jump');
      if (navigator.vibrate) navigator.vibrate(12);
    }
    for (const def of HELD) {
      this.held[def.id] = next[def.id];
      this.els[def.id].classList.toggle('on', next[def.id]);
    }
  }

  moveStick(e) {
    const r = Math.min(window.innerWidth, window.innerHeight) * 0.14;
    let dx = e.clientX - this.stick.ox;
    let dy = e.clientY - this.stick.oy;
    const len = Math.hypot(dx, dy);
    if (len > r) {
      // Let the base follow the finger so the stick never gets "stuck" at the edge.
      this.stick.ox += dx - (dx / len) * r;
      this.stick.oy += dy - (dy / len) * r;
      this.base.style.left = `${this.stick.ox}px`;
      this.base.style.top = `${this.stick.oy}px`;
      dx = (dx / len) * r;
      dy = (dy / len) * r;
    }
    this.stick.x = dx / r;
    this.stick.y = -dy / r;
    this.knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
  }

  show(on, freeplay = false) {
    if (on !== this.visible) {
      this.visible = on;
      this.root.classList.toggle('hidden', !on);
      if (!on) {
        this.stick.id = null;
        this.stick.x = 0;
        this.stick.y = 0;
        this.base.classList.add('hidden');
        this.fingers.clear();
        for (const k of Object.keys(this.held)) this.held[k] = false;
        this.root.querySelectorAll('.tbtn.on').forEach((b) => b.classList.remove('on'));
      }
    }
    this.root.classList.toggle('freeplay', freeplay);
  }

  setBallCam(on) {
    const b = this.els.ballCam;
    if (b) b.textContent = on ? 'CAM ●' : 'CAM ○';
  }

  // Joystick: x steers; y only acts in the air (pitch / flight). Driving uses the AVANCER / RECULER pedals.
  state() {
    const dz = 0.12;
    const f = (v) => (Math.abs(v) < dz ? 0 : Math.sign(v) * (Math.abs(v) - dz) / (1 - dz));
    return { x: f(this.stick.x), y: f(this.stick.y), ...this.held, active: this.visible };
  }
}
