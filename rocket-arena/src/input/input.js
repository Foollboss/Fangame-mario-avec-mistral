export const ACTIONS = [
  ['throttle', 'Accélérer / piquer du nez'],
  ['reverse', 'Freiner / reculer / cabrer'],
  ['left', 'Tourner à gauche'],
  ['right', 'Tourner à droite'],
  ['jump', 'Sauter'],
  ['boost', 'Boost'],
  ['handbrake', 'Dérapage / air roll libre'],
  ['rollLeft', 'Air roll gauche'],
  ['rollRight', 'Air roll droite'],
  ['ballCam', 'Caméra balle'],
  ['scoreboard', 'Tableau des scores'],
  ['pause', 'Pause'],
  ['resetBall', 'Entraînement : replacer la balle'],
  ['shootBall', 'Entraînement : balle vers moi'],
];

export const DEFAULT_KEYS = {
  throttle: ['KeyW', 'ArrowUp'],
  reverse: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['Space', 'Mouse2'],
  boost: ['ShiftLeft', 'Mouse0'],
  handbrake: ['KeyC', 'ShiftRight'],
  rollLeft: ['KeyQ'],
  rollRight: ['KeyE'],
  ballCam: ['KeyV', 'Mouse1'],
  scoreboard: ['Tab'],
  pause: ['Escape', 'KeyP'],
  resetBall: ['KeyR'],
  shootBall: ['KeyT'],
};

// Standard gamepad buttons.
const PAD = { A: 0, B: 1, X: 2, Y: 3, LB: 4, RB: 5, LT: 6, RT: 7, BACK: 8, START: 9, LS: 10, UP: 12, DOWN: 13, LEFT: 14, RIGHT: 15 };

export function keyLabel(code) {
  if (!code) return '—';
  const map = {
    Mouse0: 'Clic gauche', Mouse1: 'Clic molette', Mouse2: 'Clic droit', Space: 'Espace', ShiftLeft: 'Maj gauche',
    ShiftRight: 'Maj droite', ControlLeft: 'Ctrl gauche', ControlRight: 'Ctrl droite', AltLeft: 'Alt', Tab: 'Tab',
    Escape: 'Échap', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', Enter: 'Entrée', Backspace: 'Retour',
  };
  if (map[code]) return map[code];
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  return code;
}

function deadzone(x, y, dz) {
  const m = Math.hypot(x, y);
  if (m < dz) return [0, 0];
  const k = Math.min(1, (m - dz) / (1 - dz)) / m;
  return [x * k, y * k];
}

export class Input {
  constructor(settings) {
    this.settings = settings;
    this.down = new Set();
    this.pressedQueue = new Set();
    this.capture = null;
    this.padPrev = new Map();
    this.padPressed = new Map();
    this.lastDevice = 'keyboard';
    this.virtualQueue = new Set();
    this.frameVirtual = new Set();
    this.touch = null;
    this.lastTouchTime = -1e9;
    // Browsers fire fake mouse events after a tap: remember touches so they are ignored.
    window.addEventListener('touchstart', () => { this.lastTouchTime = performance.now(); this.lastDevice = 'touch'; }, { passive: true, capture: true });

    const prevent = new Set(['Space', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ShiftLeft', 'AltLeft']);
    window.addEventListener('keydown', (e) => {
      if (this.capture) {
        e.preventDefault();
        const cb = this.capture;
        this.capture = null;
        cb(e.code);
        return;
      }
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT')) return;
      if (prevent.has(e.code)) e.preventDefault();
      if (!this.down.has(e.code)) this.pressedQueue.add(e.code);
      this.down.add(e.code);
      this.lastDevice = 'keyboard';
    });
    window.addEventListener('keyup', (e) => this.down.delete(e.code));
    window.addEventListener('blur', () => this.down.clear());
    window.addEventListener('mousedown', (e) => {
      const code = `Mouse${e.button}`;
      if (this.capture) {
        e.preventDefault();
        const cb = this.capture;
        this.capture = null;
        cb(code);
        return;
      }
      if (e.target && e.target.closest && e.target.closest('.menu, .overlay-panel, button, input, select, #touch')) return;
      if (performance.now() - this.lastTouchTime < 1500) return;
      if (!this.down.has(code)) this.pressedQueue.add(code);
      this.down.add(code);
      this.lastDevice = 'keyboard';
    });
    window.addEventListener('mouseup', (e) => this.down.delete(`Mouse${e.button}`));
    window.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  captureNext(cb) {
    this.capture = cb;
  }

  keys(action) {
    return (this.settings.keys && this.settings.keys[action]) || DEFAULT_KEYS[action] || [];
  }

  kb(action) {
    return this.keys(action).some((k) => this.down.has(k)) ? 1 : 0;
  }

  // Must be called once per frame, before reading controls.
  // Edge press coming from an on-screen button.
  virtualPress(action) {
    this.virtualQueue.add(action);
  }

  poll() {
    this.frameKeys = this.pressedQueue;
    this.pressedQueue = new Set();
    this.frameVirtual = this.virtualQueue;
    this.virtualQueue = new Set();
    const pads = navigator.getGamepads ? [...navigator.getGamepads()].filter((p) => p && p.connected) : [];
    this.pads = pads;
    this.padPressed.clear();
    for (const p of pads) {
      const prev = this.padPrev.get(p.index) || [];
      const now = p.buttons.map((b) => b.pressed);
      const pressed = now.map((v, i) => v && !prev[i]);
      if (pressed.some((v) => v) || Math.abs(p.axes[0] || 0) > 0.5 || Math.abs(p.axes[1] || 0) > 0.5) this.lastDevice = 'gamepad';
      this.padPressed.set(p.index, pressed);
      this.padPrev.set(p.index, now);
    }
  }

  padFor(player, splitscreen) {
    const pads = this.pads || [];
    if (!splitscreen) return player === 0 ? pads : [];
    if (player === 1) return pads[0] ? [pads[0]] : [];
    return pads[1] ? [pads[1]] : [];
  }

  usesKeyboard(player) {
    return player === 0;
  }

  // Menu / UI edge presses for the player (keyboard for player 0, pads for everyone).
  pressed(action, player = 0, splitscreen = false) {
    if (this.usesKeyboard(player) && this.keys(action).some((k) => this.frameKeys && this.frameKeys.has(k))) return true;
    if (player === 0 && this.frameVirtual.has(action)) return true;
    const btn = { jump: PAD.A, ballCam: PAD.Y, pause: PAD.START, scoreboard: PAD.BACK, resetBall: PAD.UP, shootBall: PAD.DOWN }[action];
    if (btn === undefined) return false;
    for (const p of this.padFor(player, splitscreen)) {
      const pr = this.padPressed.get(p.index);
      if (pr && pr[btn]) return true;
    }
    return false;
  }

  // Returns the quick chat index pressed this frame, or -1.
  quickChat(player, splitscreen) {
    if (this.usesKeyboard(player) && this.frameKeys) {
      for (let i = 1; i <= 8; i++) if (this.frameKeys.has(`Digit${i}`) || this.frameKeys.has(`Numpad${i}`)) return i - 1;
    }
    for (const p of this.padFor(player, splitscreen)) {
      const pr = this.padPressed.get(p.index);
      if (!pr) continue;
      if (pr[PAD.LEFT]) return 1;
      if (pr[PAD.RIGHT]) return 2;
      if (pr[PAD.UP]) return 0;
      if (pr[PAD.DOWN]) return 3;
    }
    return -1;
  }

  // Right stick, used to look around the car.
  lookStick(player, splitscreen) {
    for (const p of this.padFor(player, splitscreen)) {
      const [x, y] = deadzone(p.axes[2] || 0, p.axes[3] || 0, 0.25);
      if (x || y) return [x, y];
    }
    return [0, 0];
  }

  held(action, player = 0, splitscreen = false) {
    if (this.usesKeyboard(player) && this.kb(action)) return true;
    const btn = { scoreboard: PAD.BACK }[action];
    if (btn === undefined) return false;
    return this.padFor(player, splitscreen).some((p) => p.buttons[btn] && p.buttons[btn].pressed);
  }

  controls(player, splitscreen, out) {
    const s = this.settings;
    let throttle = 0;
    let steer = 0;
    let pitch = 0;
    let up = 0; // stick pushed up / W, regardless of pitch inversion (used by assisted flight)
    let roll = 0;
    let jump = false;
    let boost = false;
    let handbrake = false;
    if (this.usesKeyboard(player)) {
      throttle = this.kb('throttle') - this.kb('reverse');
      steer = this.kb('right') - this.kb('left');
      pitch = throttle;
      up = throttle;
      roll = this.kb('rollRight') - this.kb('rollLeft');
      // A tap shorter than a frame still counts as a press.
      jump = !!this.kb('jump') || this.keys('jump').some((k) => this.frameKeys && this.frameKeys.has(k));
      boost = !!this.kb('boost');
      handbrake = !!this.kb('handbrake');
    }
    for (const p of this.padFor(player, splitscreen)) {
      const b = (i) => (p.buttons[i] ? p.buttons[i].value : 0);
      const [ax, ay] = deadzone(p.axes[0] || 0, p.axes[1] || 0, s.deadzone);
      const t = b(PAD.RT) - b(PAD.LT);
      if (Math.abs(t) > Math.abs(throttle)) throttle = t;
      if (Math.abs(ax) > Math.abs(steer)) steer = ax;
      const py = s.invertPitch ? ay : -ay;
      if (Math.abs(py) > Math.abs(pitch)) pitch = py;
      if (Math.abs(ay) > Math.abs(up)) up = -ay;
      if (b(PAD.LB) > 0.5) roll = -1;
      jump = jump || b(PAD.A) > 0.5;
      boost = boost || b(PAD.B) > 0.5 || b(PAD.RB) > 0.5;
      handbrake = handbrake || b(PAD.X) > 0.5;
    }
    if (player === 0 && this.touch && this.touch.visible) {
      const t = this.touch.state();
      if (Math.abs(t.y) > Math.abs(throttle)) throttle = t.y;
      if (Math.abs(t.x) > Math.abs(steer)) steer = t.x;
      if (Math.abs(t.y) > Math.abs(pitch)) pitch = t.y;
      if (Math.abs(t.y) > Math.abs(up)) up = t.y;
      jump = jump || t.jump || this.frameVirtual.has('jump');
      boost = boost || t.boost;
      handbrake = handbrake || t.handbrake;
    }
    out.throttle = Math.max(-1, Math.min(1, throttle));
    out.steer = Math.max(-1, Math.min(1, steer));
    out.pitch = Math.max(-1, Math.min(1, pitch));
    out.yaw = handbrake ? 0 : out.steer;
    out.roll = Math.max(-1, Math.min(1, roll + (handbrake ? out.steer : 0)));
    out.jump = jump;
    out.boost = boost;
    out.handbrake = handbrake;
    out.up = Math.max(-1, Math.min(1, up));
    out.dodgeX = undefined;
    out.dodgeY = undefined;
    return out;
  }
}
