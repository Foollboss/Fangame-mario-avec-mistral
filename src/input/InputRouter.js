import { createControllerState } from '../game/VehicleController.js';

// Merges touch, keyboard and gamepad into one ControllerState for the local car.
export class InputRouter {
  constructor(touch, keyboard, gamepad, settings) {
    this.touch = touch;
    this.keyboard = keyboard;
    this.gamepad = gamepad;
    this.settings = settings;
    this.state = createControllerState();
    this.tmp = { stickX: 0, stickY: 0, accel: false, brake: false, jump: false, boost: false, dash: false };
    this.lastDevice = 'touch';
  }

  sample() {
    const c = this.settings.controls;
    const raw = { ...this.touch.state };
    const t = this.tmp;
    for (const src of [this.keyboard, this.gamepad]) {
      if (src && src.read(t)) {
        this.lastDevice = src === this.keyboard ? 'keyboard' : 'gamepad';
        if (Math.abs(t.stickX) > Math.abs(raw.stickX)) raw.stickX = t.stickX;
        if (Math.abs(t.stickY) > Math.abs(raw.stickY)) raw.stickY = t.stickY;
        raw.accel ||= t.accel;
        raw.brake ||= t.brake;
        raw.jump ||= t.jump;
        raw.boost ||= t.boost;
        raw.dash ||= t.dash;
      }
    }
    const s = this.state;
    const sens = c.sensitivity;
    const shape = (v) => Math.sign(v) * Math.min(1, Math.pow(Math.abs(v), 1.15) * sens);
    s.steer = shape(raw.stickX);
    s.pitch = shape(raw.stickY) * (c.invertY ? -1 : 1);
    const autoAccel = c.autoAccel && this.lastDevice === 'touch';
    s.throttle = raw.brake ? -1 : raw.accel || autoAccel ? 1 : 0;
    s.jump = raw.jump;
    s.boost = raw.boost;
    s.dash = raw.dash;
    s.dodgeX = raw.stickX;
    s.dodgeY = raw.stickY;
    return s;
  }
}
