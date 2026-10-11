/**
 * InputManager — réunit clavier/souris (verrouillage du pointeur), commandes tactiles
 * et manette dans un état d'actions unique lu par le jeu à chaque image.
 */
import type { SettingsManager, KeyBindings } from '../core/Settings';

export type OneShot =
  | 'inventory'
  | 'drop'
  | 'dropStack'
  | 'chat'
  | 'command'
  | 'perspective'
  | 'debug'
  | 'pause'
  | 'hud'
  | 'map'
  | 'pickBlock'
  | 'hotbarNext'
  | 'hotbarPrev'
  | 'swapHands'
  | `hotbar${number}`;

export class InputState {
  moveX = 0;
  moveZ = 0;
  lookDX = 0;
  lookDY = 0;
  jump = false;
  sneak = false;
  sprint = false;
  attack = false;
  use = false;
  attackPressed = false;
  usePressed = false;
  pressed = new Set<OneShot>();

  clearFrame(): void {
    this.lookDX = 0;
    this.lookDY = 0;
    this.attackPressed = false;
    this.usePressed = false;
    this.pressed.clear();
  }
}

/** Libellés lisibles des touches (pour l'écran des commandes). */
export function keyLabel(code: string): string {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  const map: Record<string, string> = {
    Space: 'Espace',
    ShiftLeft: 'Maj gauche',
    ShiftRight: 'Maj droite',
    ControlLeft: 'Ctrl gauche',
    ControlRight: 'Ctrl droite',
    AltLeft: 'Alt',
    Tab: 'Tab',
    Escape: 'Échap',
    Enter: 'Entrée',
    Slash: '/',
    Mouse0: 'Clic gauche',
    Mouse1: 'Clic molette',
    Mouse2: 'Clic droit',
    ArrowUp: '↑',
    ArrowDown: '↓',
    ArrowLeft: '←',
    ArrowRight: '→',
    Backquote: '²',
  };
  return map[code] ?? code;
}

export class InputManager {
  readonly state = new InputState();
  private keys = new Set<string>();
  private mouseButtons = new Set<number>();
  /** Le jeu capte-t-il les entrées (aucun menu ouvert) ? */
  active = false;
  pointerLocked = false;
  /** Sources tactiles et manette (renseignées par leurs modules). */
  touch = { moveX: 0, moveZ: 0, jump: false, sneak: false, sprint: false, attack: false, use: false };
  pad = { moveX: 0, moveZ: 0, jump: false, sneak: false, sprint: false, attack: false, use: false };
  private sprintToggle = false;
  lastDevice: 'keyboard' | 'touch' | 'gamepad' = 'keyboard';
  onRawKey: ((e: KeyboardEvent) => boolean) | null = null;
  onPointerLockChange: ((locked: boolean) => void) | null = null;
  private prevPadButtons: boolean[] = [];
  /** Navigation au clavier/manette dans les menus. */
  menuNav: ((dir: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back') => void) | null = null;
  private navRepeat = 0;

  constructor(
    private canvas: HTMLCanvasElement,
    private settings: SettingsManager,
  ) {
    window.addEventListener('keydown', (e) => this.onKey(e, true));
    window.addEventListener('keyup', (e) => this.onKey(e, false));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.mouseButtons.clear();
    });
    canvas.addEventListener('mousedown', (e) => this.onMouse(e, true));
    window.addEventListener('mouseup', (e) => this.onMouse(e, false));
    window.addEventListener('mousemove', (e) => {
      if (!this.pointerLocked || !this.active) return;
      const s = 0.0006 + this.settings.data.mouseSensitivity * 0.004;
      this.state.lookDX += e.movementX * s;
      this.state.lookDY += e.movementY * s * (this.settings.data.invertY ? -1 : 1);
    });
    canvas.addEventListener(
      'wheel',
      (e) => {
        if (!this.active) return;
        this.state.pressed.add(e.deltaY > 0 ? 'hotbarNext' : 'hotbarPrev');
        e.preventDefault();
      },
      { passive: false },
    );
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('pointerlockchange', () => {
      this.pointerLocked = document.pointerLockElement === this.canvas;
      this.onPointerLockChange?.(this.pointerLocked);
    });
  }

  get bindings(): KeyBindings {
    return this.settings.data.keys;
  }

  requestPointerLock(): void {
    if (this.lastDevice === 'touch') return;
    try {
      const r = this.canvas.requestPointerLock() as unknown as Promise<void> | undefined;
      if (r && typeof r.catch === 'function') r.catch(() => undefined);
    } catch {
      /* certains navigateurs refusent hors geste utilisateur */
    }
  }

  exitPointerLock(): void {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  private isBound(code: string, action: keyof KeyBindings): boolean {
    return this.bindings[action] === code;
  }

  private onKey(e: KeyboardEvent, down: boolean): void {
    if (this.onRawKey && down && this.onRawKey(e)) return;
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    this.lastDevice = 'keyboard';
    if (!this.active) {
      if (down && this.menuNav) {
        const map: Record<string, 'up' | 'down' | 'left' | 'right' | 'ok' | 'back'> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', Enter: 'ok', Escape: 'back' };
        if (map[e.code]) {
          this.menuNav(map[e.code]);
          e.preventDefault();
        }
      }
      if (down && e.code === this.bindings.inventory) this.state.pressed.add('inventory');
      return;
    }
    if (down) this.keys.add(e.code);
    else this.keys.delete(e.code);
    if (!down) return;
    if (e.repeat) return;
    const b = this.bindings;
    if (e.code === 'Escape') this.state.pressed.add('pause');
    if (e.code === b.inventory) this.state.pressed.add('inventory');
    if (e.code === b.drop) this.state.pressed.add(e.ctrlKey ? 'dropStack' : 'drop');
    if (e.code === b.chat) this.state.pressed.add('chat');
    if (e.code === b.command) this.state.pressed.add('command');
    if (e.code === b.perspective) this.state.pressed.add('perspective');
    if (e.code === b.debug) this.state.pressed.add('debug');
    if (e.code === b.hud) this.state.pressed.add('hud');
    if (e.code === b.map) this.state.pressed.add('map');
    if (e.code === 'KeyF') this.state.pressed.add('swapHands');
    if (e.code === b.sprint) this.sprintToggle = true;
    if (e.code.startsWith('Digit')) {
      const n = Number(e.code.slice(5));
      if (n >= 1 && n <= 9) this.state.pressed.add(`hotbar${n - 1}`);
    }
    if (['F1', 'F3', 'F5', 'Tab', 'Space', 'Slash'].includes(e.code)) e.preventDefault();
  }

  private onMouse(e: MouseEvent, down: boolean): void {
    if (e.target !== this.canvas && down) return;
    this.lastDevice = 'keyboard';
    if (down && this.active && !this.pointerLocked) {
      this.requestPointerLock();
      return;
    }
    if (!this.active) return;
    const code = 'Mouse' + e.button;
    if (down) {
      this.mouseButtons.add(e.button);
      if (e.button === 0) this.state.attackPressed = true;
      if (e.button === 2) this.state.usePressed = true;
      if (code === this.bindings.pickBlock) this.state.pressed.add('pickBlock');
    } else this.mouseButtons.delete(e.button);
  }

  /** Mise à jour de l'état (appelée une fois par image avant la logique du jeu). */
  poll(dt: number): void {
    this.pollGamepad(dt);
    const s = this.state;
    const k = this.keys;
    const b = this.bindings;
    const active = this.active;
    let mx = 0;
    let mz = 0;
    if (active) {
      if (k.has(b.forward)) mz += 1;
      if (k.has(b.back)) mz -= 1;
      if (k.has(b.right)) mx += 1;
      if (k.has(b.left)) mx -= 1;
    }
    mx += this.touch.moveX + this.pad.moveX;
    mz += this.touch.moveZ + this.pad.moveZ;
    const len = Math.hypot(mx, mz);
    if (len > 1) {
      mx /= len;
      mz /= len;
    }
    s.moveX = active ? mx : 0;
    s.moveZ = active ? mz : 0;
    s.jump = active && (k.has(b.jump) || this.touch.jump || this.pad.jump);
    s.sneak = active && (k.has(b.sneak) || this.touch.sneak || this.pad.sneak);
    if (!k.has(b.sprint) && mz <= 0) this.sprintToggle = false;
    s.sprint = active && (this.sprintToggle || k.has(b.sprint) || this.touch.sprint || this.pad.sprint);
    s.attack = active && (this.mouseButtons.has(0) || this.touch.attack || this.pad.attack);
    s.use = active && (this.mouseButtons.has(2) || this.touch.use || this.pad.use);
    if (!active) {
      this.keys.clear();
      this.mouseButtons.clear();
    }
  }

  private pollGamepad(dt: number): void {
    const pads = typeof navigator.getGamepads === 'function' ? navigator.getGamepads() : [];
    const gp = [...pads].find((p) => p && p.connected);
    const p = this.pad;
    if (!gp) {
      p.moveX = p.moveZ = 0;
      p.jump = p.sneak = p.sprint = p.attack = p.use = false;
      return;
    }
    const dz = this.settings.data.gamepadDeadzone;
    const ax = (i: number) => {
      const v = gp.axes[i] ?? 0;
      return Math.abs(v) < dz ? 0 : (v - Math.sign(v) * dz) / (1 - dz);
    };
    const btn = (i: number) => !!gp.buttons[i]?.pressed;
    const edge = (i: number) => btn(i) && !this.prevPadButtons[i];
    const any = gp.buttons.some((b) => b.pressed) || gp.axes.some((a) => Math.abs(a) > 0.5);
    if (any) this.lastDevice = 'gamepad';
    if (this.active) {
      p.moveX = ax(0);
      p.moveZ = -ax(1);
      const look = 2.6 * (0.4 + this.settings.data.mouseSensitivity);
      this.state.lookDX += ax(2) * look * dt;
      this.state.lookDY += ax(3) * look * dt * (this.settings.data.invertY ? -1 : 1);
      p.jump = btn(0);
      if (edge(1)) p.sneak = !p.sneak;
      if (edge(10)) p.sprint = !p.sprint;
      if (p.moveZ <= 0.1) p.sprint = false;
      p.attack = btn(7);
      p.use = btn(6);
      if (edge(7)) this.state.attackPressed = true;
      if (edge(6)) this.state.usePressed = true;
      if (edge(2)) this.state.pressed.add('drop');
      if (edge(3)) this.state.pressed.add('inventory');
      if (edge(4)) this.state.pressed.add('hotbarPrev');
      if (edge(5)) this.state.pressed.add('hotbarNext');
      if (edge(9)) this.state.pressed.add('pause');
      if (edge(8)) this.state.pressed.add('chat');
      if (edge(11) || edge(12)) this.state.pressed.add('perspective');
      if (edge(13)) this.state.pressed.add('drop');
    } else {
      p.moveX = p.moveZ = 0;
      p.jump = p.attack = p.use = false;
      // Navigation dans les menus
      this.navRepeat -= dt;
      const lx = ax(0);
      const ly = ax(1);
      let dir: 'up' | 'down' | 'left' | 'right' | null = null;
      if (btn(12) || ly < -0.6) dir = 'up';
      else if (btn(13) || ly > 0.6) dir = 'down';
      else if (btn(14) || lx < -0.6) dir = 'left';
      else if (btn(15) || lx > 0.6) dir = 'right';
      if (dir && this.navRepeat <= 0) {
        this.menuNav?.(dir);
        this.navRepeat = 0.22;
      }
      if (!dir) this.navRepeat = 0;
      if (edge(0)) this.menuNav?.('ok');
      if (edge(1)) this.menuNav?.('back');
      if (edge(3)) this.state.pressed.add('inventory');
      if (edge(9)) this.menuNav?.('back');
    }
    this.prevPadButtons = gp.buttons.map((b) => b.pressed);
  }

  /** Vibration (manette ou téléphone Android). */
  rumble(ms: number, strength = 0.5): void {
    if (!this.settings.data.vibration) return;
    const w = window as unknown as { AndroidBridge?: { vibrate(ms: number): void } };
    if (this.lastDevice === 'touch' && w.AndroidBridge) w.AndroidBridge.vibrate(ms);
    else if (this.lastDevice === 'touch' && navigator.vibrate) navigator.vibrate(ms);
    const pads = typeof navigator.getGamepads === 'function' ? navigator.getGamepads() : [];
    const gp = [...pads].find((p) => p && p.connected) as (Gamepad & { vibrationActuator?: { playEffect: (t: string, o: object) => Promise<unknown> } }) | undefined;
    gp?.vibrationActuator?.playEffect('dual-rumble', { duration: ms, strongMagnitude: strength, weakMagnitude: strength }).catch(() => undefined);
  }
}
