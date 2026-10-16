/**
 * UIManager — pile d'écrans DOM (menus, inventaires…), mise à l'échelle de l'interface,
 * navigation clavier/manette et bouton « retour » d'Android.
 */
export interface Screen {
  el: HTMLElement;
  /** Renvoie true si l'écran a géré le retour lui-même. */
  onBack?(): boolean;
  destroy?(): void;
  update?(dt: number): void;
  /** L'écran laisse-t-il le jeu tourner en dessous (inventaire en multijoueur…) ? */
  modalGame?: boolean;
}

export class UIManager {
  readonly root: HTMLElement;
  private stack: Screen[] = [];
  scale = 2;
  onStackChange: (() => void) | null = null;

  constructor(private guiScale: () => number) {
    this.root = document.getElementById('ui')!;
    window.addEventListener('resize', () => this.rescale());
    this.rescale();
  }

  rescale(): void {
    const w = window.innerWidth;
    const hgt = window.innerHeight;
    let u = Math.min(hgt / 200, w / 400);
    const g = this.guiScale();
    if (g > 0) u *= 0.6 + g * 0.2;
    u = Math.max(1.25, Math.min(6, u));
    this.scale = u;
    document.documentElement.style.setProperty('--u', u.toFixed(3) + 'px');
  }

  get current(): Screen | undefined {
    return this.stack[this.stack.length - 1];
  }

  /** Vrai si au moins un écran de la pile vérifie la condition. */
  some(pred: (s: Screen) => boolean): boolean {
    return this.stack.some(pred);
  }

  get depth(): number {
    return this.stack.length;
  }

  /** Remplace toute la pile par cet écran. */
  set(screen: Screen): void {
    while (this.stack.length) this.popInternal();
    this.push(screen);
  }

  push(screen: Screen): void {
    if (this.current) this.current.el.style.display = 'none';
    this.stack.push(screen);
    this.root.appendChild(screen.el);
    this.onStackChange?.();
    requestAnimationFrame(() => this.focusFirst());
  }

  pop(): void {
    this.popInternal();
    if (this.current) this.current.el.style.display = '';
    this.onStackChange?.();
  }

  private popInternal(): void {
    const s = this.stack.pop();
    if (!s) return;
    s.destroy?.();
    s.el.remove();
  }

  clear(): void {
    while (this.stack.length) this.popInternal();
    this.onStackChange?.();
  }

  /** Bouton retour (Échap, B manette, retour Android). Renvoie true si géré. */
  back(): boolean {
    const modal = this.root.querySelector('.modal-back');
    if (modal) {
      modal.remove();
      return true;
    }
    const s = this.current;
    if (!s) return false;
    if (s.onBack && s.onBack()) return true;
    if (this.stack.length > 0) {
      this.pop();
      return true;
    }
    return false;
  }

  update(dt: number): void {
    this.current?.update?.(dt);
  }

  // ---------------------------------------------------------------- navigation spatiale (manette / flèches)
  focusables(): HTMLElement[] {
    const scope = (this.root.querySelector('.modal-back') as HTMLElement) ?? this.current?.el;
    if (!scope) return [];
    return [...scope.querySelectorAll<HTMLElement>('.btn, .toggle, .side-item, .tab, .world-row, .slot, .field, .server-item, .slider, .trade, .inv-tab')].filter((e) => e.offsetParent !== null && !(e as HTMLButtonElement).disabled);
  }

  focusFirst(): void {
    if (document.activeElement && document.activeElement !== document.body && this.root.contains(document.activeElement)) return;
  }

  navigate(dir: 'up' | 'down' | 'left' | 'right' | 'ok' | 'back'): void {
    if (dir === 'back') {
      this.back();
      return;
    }
    const items = this.focusables();
    if (!items.length) return;
    const active = document.activeElement as HTMLElement | null;
    const cur = active && items.includes(active) ? active : null;
    if (dir === 'ok') {
      if (cur) cur.click();
      else items[0].focus();
      return;
    }
    if (!cur) {
      items[0].focus();
      return;
    }
    const r = cur.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let best: HTMLElement | null = null;
    let bestScore = Infinity;
    for (const e of items) {
      if (e === cur) continue;
      const q = e.getBoundingClientRect();
      const ex = q.left + q.width / 2;
      const ey = q.top + q.height / 2;
      const dx = ex - cx;
      const dy = ey - cy;
      const ok = dir === 'up' ? dy < -4 : dir === 'down' ? dy > 4 : dir === 'left' ? dx < -4 : dx > 4;
      if (!ok) continue;
      const main = dir === 'up' || dir === 'down' ? Math.abs(dy) : Math.abs(dx);
      const cross = dir === 'up' || dir === 'down' ? Math.abs(dx) : Math.abs(dy);
      const score = main + cross * 2.5;
      if (score < bestScore) {
        bestScore = score;
        best = e;
      }
    }
    if (best) {
      best.focus();
      best.scrollIntoView({ block: 'nearest' });
    }
  }
}
