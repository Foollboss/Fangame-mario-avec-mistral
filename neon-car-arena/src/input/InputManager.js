import { InputFrame } from '../sim/InputFrame.js';
import { MobileInput } from './MobileInput.js';
import { clamp } from '../core/math.js';

const KEYMAP = {
  KeyW: 'up', ArrowUp: 'up', KeyZ: 'up',
  KeyS: 'down', ArrowDown: 'down',
  KeyA: 'left', ArrowLeft: 'left', KeyQ: 'left',
  KeyD: 'right', ArrowRight: 'right',
  Space: 'jump', ShiftLeft: 'boost', ShiftRight: 'boost', KeyE: 'dash', ControlLeft: 'dash',
  KeyJ: 'rollL', KeyL: 'rollR', KeyC: 'ballcam', Escape: 'pause', KeyP: 'pause', KeyR: 'reset',
};

// Fusionne tactile + clavier + manette en une InputFrame par tick.
export class InputManager {
  constructor(root, settings) {
    this.settings = settings;
    this.keys = new Set();
    this.frame = new InputFrame();
    this.mobile = new MobileInput(root, settings);
    this.onAction = null; // ballcam, pause, reset
    this.touchUsed = matchMedia('(pointer: coarse)').matches;
    this.mobile.setVisible(false);
    this._kd = (e) => {
      const k = KEYMAP[e.code];
      if (!k) return;
      if (['ballcam', 'pause', 'reset'].includes(k)) { if (!e.repeat) this.onAction?.(k); return; }
      this.keys.add(k);
      if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
    };
    this._ku = (e) => { const k = KEYMAP[e.code]; if (k) this.keys.delete(k); };
    window.addEventListener('keydown', this._kd);
    window.addEventListener('keyup', this._ku);
    window.addEventListener('blur', () => { this.keys.clear(); this.mobile.releaseAll(); });
    window.addEventListener('touchstart', () => { this.touchUsed = true; }, { passive: true });
    this.padPrev = {};
  }

  setTouchVisible(v) { this.mobile.setVisible(v && this.touchUsed); }

  poll() {
    const f = this.frame.clear();
    const s = this.settings;
    const k = this.keys;
    const m = this.mobile.state;
    let throttle = (m.accel ? 1 : 0) - (m.brake ? 1 : 0);
    let steer = m.x;
    let pitch = m.y;
    let roll = 0;
    // Clavier
    if (k.has('up')) { throttle = 1; pitch = 1; }
    if (k.has('down')) { throttle = -1; pitch = -1; }
    if (k.has('left')) steer = -1;
    if (k.has('right')) steer = 1;
    if (k.has('rollL')) roll = -1;
    if (k.has('rollR')) roll = 1;
    f.jump = m.jump || k.has('jump');
    f.boost = m.boost || k.has('boost');
    f.dash = m.dash || k.has('dash');
    // Manette (mapping standard)
    const pad = navigator.getGamepads?.()[0];
    if (pad && pad.connected) {
      const ax = pad.axes[0] || 0, ay = pad.axes[1] || 0;
      if (Math.abs(ax) > 0.12) steer = ax;
      if (Math.abs(ay) > 0.12) pitch = -ay;
      const rt = pad.buttons[7]?.value || 0, lt = pad.buttons[6]?.value || 0;
      if (rt > 0.05 || lt > 0.05) throttle = rt - lt;
      f.jump = f.jump || !!pad.buttons[0]?.pressed;
      f.boost = f.boost || !!pad.buttons[1]?.pressed;
      f.dash = f.dash || !!pad.buttons[2]?.pressed;
      if (pad.buttons[4]?.pressed) roll = -1;
      if (pad.buttons[5]?.pressed) roll = 1;
      const y = !!pad.buttons[3]?.pressed, st = !!pad.buttons[9]?.pressed;
      if (y && !this.padPrev.y) this.onAction?.('ballcam');
      if (st && !this.padPrev.st) this.onAction?.('pause');
      this.padPrev = { y, st };
    }
    if (s.autoAccelerate && throttle === 0) throttle = 1;
    f.throttle = clamp(throttle, -1, 1);
    f.steer = clamp(steer, -1, 1);
    f.pitch = clamp(pitch, -1, 1) * (s.invertPitch ? -1 : 1);
    f.roll = roll;
    if (s.invertSteer) f.steer = -f.steer;
    return f;
  }

  dispose() {
    window.removeEventListener('keydown', this._kd);
    window.removeEventListener('keyup', this._ku);
    this.mobile.dispose();
  }
}
