// Desktop keyboard and standard-mapping gamepads, merged with touch input by InputRouter.
const KEYMAP = {
  left: ['KeyA', 'KeyQ', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  up: ['KeyW', 'KeyZ', 'ArrowUp'],
  down: ['KeyS', 'ArrowDown'],
  jump: ['Space', 'KeyK'],
  boost: ['ShiftLeft', 'ShiftRight', 'KeyL'],
  dash: ['KeyE', 'KeyJ'],
};

export class KeyboardInput {
  constructor() {
    this.keys = new Set();
    this.onAction = null;
    window.addEventListener('keydown', (e) => {
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
      if (!this.keys.has(e.code) && this.onAction) this.onAction(e.code);
      this.keys.add(e.code);
      if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());
  }

  held(action) {
    return KEYMAP[action].some((k) => this.keys.has(k));
  }

  read(out) {
    const l = this.held('left'), r = this.held('right'), u = this.held('up'), d = this.held('down');
    const any = l || r || u || d || this.held('jump') || this.held('boost') || this.held('dash');
    out.stickX = (r ? 1 : 0) - (l ? 1 : 0);
    out.stickY = (u ? 1 : 0) - (d ? 1 : 0);
    out.accel = u;
    out.brake = d;
    out.jump = this.held('jump');
    out.boost = this.held('boost');
    out.dash = this.held('dash');
    return any;
  }
}

export class GamepadInput {
  constructor() {
    this.prevButtons = [];
    this.onAction = null;
  }

  read(out) {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = Array.from(pads || []).find((p) => p && p.connected);
    if (!gp) return false;
    const dz = (v) => (Math.abs(v) < 0.15 ? 0 : v);
    const b = (i) => !!(gp.buttons[i] && gp.buttons[i].pressed);
    const val = (i) => (gp.buttons[i] ? gp.buttons[i].value : 0);
    out.stickX = dz(gp.axes[0] || 0);
    out.stickY = -dz(gp.axes[1] || 0);
    out.accel = val(7) > 0.2;
    out.brake = val(6) > 0.2;
    out.jump = b(0);
    out.boost = b(1) || b(5);
    out.dash = b(2);
    for (const [i, action] of [[3, 'KeyC'], [9, 'Escape']]) {
      if (b(i) && !this.prevButtons[i] && this.onAction) this.onAction(action);
      this.prevButtons[i] = b(i);
    }
    return out.stickX !== 0 || out.stickY !== 0 || out.accel || out.brake || out.jump || out.boost || out.dash;
  }
}
