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
  /** Contrôles tactiles : actions virtuelles, joystick et regard au doigt. */
  touchEnabled = false;
  private virtualDown = new Set<Action>();
  private virtualPressed = new Set<Action>();
  private virtualReleased = new Set<Action>();
  private virtualReleaseNext = new Set<Action>();
  private padMoveX = 0;
  private padMoveY = 0;
  touchMoveX = 0;
  touchMoveY = 0;

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
    document.addEventListener('pointerlockerror', () => (this.freeLook = true));
    window.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement === this.canvas || (this.freeLook && this.gameFocus)) {
        this.mouseDX += e.movementX;
        this.mouseDY += e.movementY;
      }
    });
    window.addEventListener(
      'wheel',
      (e) => {
        // pas de zoom de la page (Ctrl+molette, pincement du pavé tactile) ni de défilement en jeu
        if (e.ctrlKey || this.gameFocus) e.preventDefault();
        if (this.gameFocus && !e.ctrlKey) this.wheel += Math.sign(e.deltaY);
      },
      { passive: false },
    );
    // Safari : geste de pincement
    window.addEventListener('gesturestart', (e) => e.preventDefault());
  }

  get locked(): boolean {
    return document.pointerLockElement === this.canvas;
  }

  /**
   * Regard à la souris sans verrouillage du pointeur (cadres isolés, tablettes) :
   * activé automatiquement quand le verrouillage est refusé.
   */
  freeLook = false;

  /** Action virtuelle maintenue (bouton tactile). */
  setVirtual(a: Action, down: boolean): void {
    if (down) {
      if (this.virtualDown.has(a)) return;
      this.virtualDown.add(a);
      this.virtualPressed.add(a);
      if (a === 'jump') {
        const now = performance.now();
        this.doubleTapJump = now - this.lastTapJump < 300;
        this.lastTapJump = now;
      }
    } else if (this.virtualDown.delete(a)) this.virtualReleased.add(a);
  }

  /** Appui bref (enfoncé une image puis relâché). */
  tapVirtual(a: Action): void {
    this.setVirtual(a, true);
    this.virtualReleaseNext.add(a);
  }

  /** Regard au doigt (en pixels d'écran). */
  touchLook(dx: number, dy: number): void {
    this.mouseDX += dx * 1.6;
    this.mouseDY += dy * 1.6;
  }

  releaseVirtual(): void {
    for (const a of this.virtualDown) this.virtualReleased.add(a);
    this.virtualDown.clear();
    this.touchMoveX = this.touchMoveY = 0;
  }

  lock(): void {
    if (this.locked || this.touchEnabled) return;
    const c = this.canvas as HTMLCanvasElement;
    if (typeof c.requestPointerLock !== 'function') {
      this.freeLook = true;
      return;
    }
    try {
      const p = c.requestPointerLock() as unknown as Promise<void> | undefined;
      if (p && typeof (p as Promise<void>).catch === 'function') p.catch(() => (this.freeLook = true));
    } catch {
      this.freeLook = true;
    }
  }

  unlock(): void {
    if (this.locked) document.exitPointerLock();
  }

  isDown(a: Action): boolean {
    for (const c of this.bindings[a]) if (this.down.has(c)) return true;
    return this.padDown.has(a) || this.virtualDown.has(a);
  }

  pressed(a: Action): boolean {
    for (const c of this.bindings[a]) if (this.pressedCodes.has(c)) return true;
    return this.padPressed.has(a) || this.virtualPressed.has(a);
  }

  released(a: Action): boolean {
    for (const c of this.bindings[a]) if (this.releasedCodes.has(c)) return true;
    return this.virtualReleased.has(a);
  }

  codePressed(code: string): boolean {
    return this.pressedCodes.has(code);
  }

  /** Lecture de la manette (à appeler une fois par image avant le jeu). */
  pollGamepad(): void {
    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    const gp = [...pads].find((p) => p && p.connected);
    this.padPressed.clear();
    const combine = () => {
      this.moveX = Math.max(-1, Math.min(1, this.padMoveX + this.touchMoveX));
      this.moveY = Math.max(-1, Math.min(1, this.padMoveY + this.touchMoveY));
    };
    if (!gp) {
      this.padMoveX = this.padMoveY = this.lookX = this.lookY = 0;
      this.padDown.clear();
      combine();
      return;
    }
    const dz = (v: number) => (Math.abs(v) < 0.15 ? 0 : v);
    this.padMoveX = dz(gp.axes[0] ?? 0);
    this.padMoveY = dz(gp.axes[1] ?? 0);
    combine();
    this.lookX = dz(gp.axes[2] ?? 0);
    this.lookY = dz(gp.axes[3] ?? 0);
    const now = new Set<Action>();
    for (const [a, btns] of Object.entries(PAD_BUTTONS) as [Action, number[]][]) for (const b of btns) if (gp.buttons[b]?.pressed) now.add(a);
    for (const a of now) if (!this.padPrev.has(a)) this.padPressed.add(a);
    this.padPrev = now;
    this.padDown = now;
    if (now.size > 0 || this.padMoveX || this.padMoveY || this.lookX || this.lookY) this.gamepadActive = true;
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
    this.virtualPressed.clear();
    this.virtualReleased.clear();
    for (const a of this.virtualReleaseNext) this.setVirtual(a, false);
    this.virtualReleaseNext.clear();
  }

  releaseAll(): void {
    this.down.clear();
  }
}
