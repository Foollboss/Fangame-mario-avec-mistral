// On-screen controls for phones and tablets: a floating joystick on the left half and action buttons on the right.
export function isTouchDevice() {
  return (typeof window !== 'undefined') && (('ontouchstart' in window) || navigator.maxTouchPoints > 0)
    && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
}

const BUTTONS = [
  { id: 'jump', label: 'SAUT', cls: 'tb-jump' },
  { id: 'boost', label: 'BOOST', cls: 'tb-boost' },
  { id: 'handbrake', label: 'DÉRAPE', cls: 'tb-slide' },
  { id: 'ballCam', label: 'CAM', cls: 'tb-cam', tap: true },
  { id: 'pause', label: 'II', cls: 'tb-pause', tap: true },
  { id: 'resetBall', label: 'BALLE', cls: 'tb-reset', tap: true, freeplay: true },
  { id: 'shootBall', label: 'TIR', cls: 'tb-shoot', tap: true, freeplay: true },
];

export class TouchControls {
  constructor(input) {
    this.input = input;
    this.stick = { x: 0, y: 0, id: null, ox: 0, oy: 0 };
    this.held = { jump: false, boost: false, handbrake: false };
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

    const stop = (e) => { e.preventDefault(); e.stopPropagation(); };
    this.zone.addEventListener('pointerdown', (e) => {
      stop(e);
      if (this.stick.id !== null) return;
      this.stick.id = e.pointerId;
      this.stick.ox = e.clientX;
      this.stick.oy = e.clientY;
      try { this.zone.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }
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

    root.querySelectorAll('.tbtn').forEach((el) => {
      const def = BUTTONS.find((b) => b.id === el.dataset.id);
      el.addEventListener('pointerdown', (e) => {
        stop(e);
        try { el.setPointerCapture(e.pointerId); } catch (err) { /* synthetic pointer */ }
        el.classList.add('on');
        if (def.tap) this.input.virtualPress(def.id);
        else {
          if (def.id === 'jump') this.input.virtualPress('jump');
          this.held[def.id] = true;
        }
        if (navigator.vibrate && def.id === 'jump') navigator.vibrate(12);
      });
      const up = (e) => {
        stop(e);
        el.classList.remove('on');
        if (!def.tap) this.held[def.id] = false;
      };
      el.addEventListener('pointerup', up);
      el.addEventListener('pointercancel', up);
      el.addEventListener('contextmenu', stop);
    });
    root.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
    root.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
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
        for (const k of Object.keys(this.held)) this.held[k] = false;
        this.root.querySelectorAll('.tbtn.on').forEach((b) => b.classList.remove('on'));
      }
    }
    this.root.classList.toggle('freeplay', freeplay);
  }

  setBallCam(on) {
    const b = this.root.querySelector('.tb-cam');
    if (b) b.textContent = on ? 'CAM ●' : 'CAM ○';
  }

  // Joystick: x steers (and yaws in the air), y accelerates / reverses on the ground and pitches in the air.
  state() {
    const dz = 0.12;
    const f = (v) => (Math.abs(v) < dz ? 0 : Math.sign(v) * (Math.abs(v) - dz) / (1 - dz));
    return { x: f(this.stick.x), y: f(this.stick.y), ...this.held, active: this.visible };
  }
}
