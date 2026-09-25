/**
 * Entrées abstraites en « actions » : clavier/souris et manette partagent la
 * même table, les touches sont reconfigurables.
 */
export type Action =
  | 'forward'
  | 'back'
  | 'left'
  | 'right'
  | 'jump'
  | 'sneak'
  | 'sprint'
  | 'attack'
  | 'use'
  | 'pick'
  | 'inventory'
  | 'drop'
  | 'chat'
  | 'command'
  | 'pause'
  | 'debug'
  | 'perspective'
  | 'hideHud'
  | 'screenshot'
  | 'dodge'
  | 'advancements'
  | 'players'
  | 'hotbarNext'
  | 'hotbarPrev'
  | 'hotbar1'
  | 'hotbar2'
  | 'hotbar3'
  | 'hotbar4'
  | 'hotbar5'
  | 'hotbar6'
  | 'hotbar7'
  | 'hotbar8'
  | 'hotbar9';

export const DEFAULT_BINDINGS: Record<Action, string[]> = {
  forward: ['KeyW', 'ArrowUp'],
  back: ['KeyS', 'ArrowDown'],
  left: ['KeyA', 'ArrowLeft'],
  right: ['KeyD', 'ArrowRight'],
  jump: ['Space'],
  sneak: ['ShiftLeft', 'ShiftRight'],
  sprint: ['ControlLeft', 'KeyR'],
  attack: ['Mouse0'],
  use: ['Mouse2'],
  pick: ['Mouse1'],
  inventory: ['KeyE'],
  drop: ['KeyQ'],
  chat: ['KeyT', 'Enter'],
  command: ['Slash'],
  pause: ['Escape'],
  debug: ['F3'],
  perspective: ['F5', 'KeyV'],
  hideHud: ['F1'],
  screenshot: ['F2'],
  dodge: ['KeyC'],
  advancements: ['KeyL'],
  players: ['Tab'],
  hotbarNext: [],
  hotbarPrev: [],
  hotbar1: ['Digit1'],
  hotbar2: ['Digit2'],
  hotbar3: ['Digit3'],
  hotbar4: ['Digit4'],
  hotbar5: ['Digit5'],
  hotbar6: ['Digit6'],
  hotbar7: ['Digit7'],
  hotbar8: ['Digit8'],
  hotbar9: ['Digit9'],
};

/** Correspondance manette standard (API Gamepad). */
const PAD_BUTTONS: Partial<Record<Action, number[]>> = {
  jump: [0],
  sneak: [1, 11],
  inventory: [3],
  drop: [2],
  attack: [7],
  use: [6],
  hotbarPrev: [4],
  hotbarNext: [5],
  pause: [9],
  sprint: [10],
  perspective: [8],
  dodge: [13],
};

export class InputManager {
  bindings: Record<Action, string[]> = structuredClone(DEFAULT_BINDINGS);
  private down = new Set<string>();
  private pressedCodes = new Set<string>();
  private releasedCodes = new Set<string>();
  mouseDX = 0;
  mouseDY = 0;
  wheel = 0;
  sensitivity = 1;
  invertY = false;
  /** Axes analogiques (manette). */
  moveX = 0;
  moveY = 0;
  lookX = 0;
  lookY = 0;
  private padDown = new Set<Action>();
  private padPressed = new Set<Action>();
  private padPrev = new Set<Action>();
  gamepadActive = false;
  /** Quand faux, les actions de jeu sont ignorées (menus ouverts). */
  gameFocus = false;
  lastTapForward = 0;
  doubleTapForward = false;
  lastTapJump = 0;
  doubleTapJump = false;

  constructor(private canvas: HTMLElement) {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      this.down.add(e.code);
      this.pressedCodes.add(e.code);
      const now = performance.now();
      if (this.bindings.forward.includes(e.code)) {
        this.doubleTapForward = now - this.lastTapForward < 300;
        this.lastTapForward = now;
      }
      if (this.bindings.jump.includes(e.code)) {
        this.doubleTapJump = now - this.lastTapJump < 300;
        this.lastTapJump = now;
      }
      if (this.gameFocus && ['Tab', 'F1', 'F3', 'F5', 'Space', 'Slash', 'F2'].includes(e.code)) e.preventDefault();
    });
    window.addEventListener('keyup', (e) => {
      this.down.delete(e.code);
      this.releasedCodes.add(e.code);
    });
    window.addEventListener('blur', () => this.down.clear());
    canvas.addEventListener('mousedown', (e) => {
      this.down.add('Mouse' + e.button);
      this.pressedCodes.add('Mouse' + e.button);
    });
    window.addEventListener('mouseup', (e) => {
      this.down.delete('Mouse' + e.button);
      this.releasedCodes.add('Mouse' + e.button);
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === this.canvas) {
        this.mouseDX += e.movementX;
        this.mouseDY += e.movementY;
      }
    });
    window.addEventListener(
      'wheel',
      (e) => {
        if (this.gameFocus) this.wheel += Math.sign(e.deltaY);
      },
      { passive: true },
    );
  }

  get locked(): boolean {
    return document.pointerLockElement === this.canvas;
  }

  lock(): void {
    if (!this.locked) {
      const p = (this.canvas as HTMLCanvasElement).requestPointerLock?.() as unknown as Promise<void> | undefined;
      if (p && typeof (p as Promise<void>).catch === 'function') p.catch(() => {});
    }
  }

  unlock(): void {
    if (this.locked) document.exitPointerLock();
  }

  isDown(a: Action): boolean {
    for (const c of this.bindings[a]) if (this.down.has(c)) return true;
    return this.padDown.has(a);
  }

  pressed(a: Action): boolean {
    for (const c of this.bindings[a]) if (this.pressedCodes.has(c)) return true;
    return this.padPressed.has(a);
  }

  released(a: Action): boolean {
    for (const c of this.bindings[a]) if (this.releasedCodes.has(c)) return true;
    return false;
  }

  codePressed(code: string): boolean {
    return this.pressedCodes.has(code);
  }

  /** Lecture de la manette (à appeler une fois par image avant le jeu). */
  pollGamepad(): void {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = [...pads].find((p) => p && p.connected);
    this.padPressed.clear();
    if (!gp) {
      this.moveX = this.moveY = this.lookX = this.lookY = 0;
      this.padDown.clear();
      return;
    }
    const dz = (v: number) => (Math.abs(v) < 0.15 ? 0 : v);
    this.moveX = dz(gp.axes[0] ?? 0);
    this.moveY = dz(gp.axes[1] ?? 0);
    this.lookX = dz(gp.axes[2] ?? 0);
    this.lookY = dz(gp.axes[3] ?? 0);
    const now = new Set<Action>();
    for (const [a, btns] of Object.entries(PAD_BUTTONS) as [Action, number[]][]) for (const b of btns) if (gp.buttons[b]?.pressed) now.add(a);
    for (const a of now) if (!this.padPrev.has(a)) this.padPressed.add(a);
    this.padPrev = now;
    this.padDown = now;
    if (now.size > 0 || this.moveX || this.moveY || this.lookX || this.lookY) this.gamepadActive = true;
  }

  /** Fin d'image : réinitialise les évènements ponctuels. */
  endFrame(): void {
    this.pressedCodes.clear();
    this.releasedCodes.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.wheel = 0;
    this.doubleTapForward = false;
    this.doubleTapJump = false;
  }

  releaseAll(): void {
    this.down.clear();
  }
}
