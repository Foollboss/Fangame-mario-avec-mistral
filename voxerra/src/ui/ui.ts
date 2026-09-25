/** Gestionnaire d'écrans : pile d'écrans modaux au-dessus du HUD. */
import { h, clear } from './dom';
import { t } from '../i18n/i18n';

export interface Screen {
  el: HTMLElement;
  /** Le jeu solo est mis en pause tant que l'écran est ouvert. */
  pauses?: boolean;
  /** Échap ferme l'écran (sinon appelle onEscape). */
  onEscape?: () => void;
  onClose?: () => void;
  onKey?: (e: KeyboardEvent) => boolean | void;
  update?: (dt: number) => void;
  /** Écran « de jeu » (inventaire) : la touche d'inventaire le ferme aussi. */
  closeOnInventoryKey?: boolean;
}

export class UIManager {
  readonly root: HTMLElement;
  readonly hudLayer: HTMLElement;
  readonly screenLayer: HTMLElement;
  readonly overlayLayer: HTMLElement;
  /** Bouton ✕ des écrans tactiles (remplace Échap / E), visible seulement en mode tactile. */
  private closeBtn: HTMLElement;
  private stack: Screen[] = [];
  onStackChange: () => void = () => {};

  constructor(root: HTMLElement) {
    this.root = root;
    clear(root);
    this.hudLayer = h('div', { class: 'hud passthrough' });
    this.screenLayer = h('div', { class: 'screens', style: { position: 'absolute', inset: '0', pointerEvents: 'none' } });
    this.overlayLayer = h('div', { class: 'overlays passthrough', style: { position: 'absolute', inset: '0' } });
    this.closeBtn = h('button', { class: 'touch-close', 'aria-label': t('Fermer'), title: t('Fermer'), hidden: true }, '✕');
    this.closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const top = this.top;
      if (top && !top.onEscape) this.pop();
    });
    root.append(this.hudLayer, this.screenLayer, this.overlayLayer, this.closeBtn);
    window.addEventListener('keydown', (e) => this.handleKey(e), true);
  }

  get top(): Screen | undefined {
    return this.stack[this.stack.length - 1];
  }

  get open(): boolean {
    return this.stack.length > 0;
  }

  get pausing(): boolean {
    return this.stack.some((s) => s.pauses);
  }

  push(s: Screen): void {
    const prev = this.top;
    if (prev) prev.el.style.display = 'none';
    s.el.style.pointerEvents = 'auto';
    this.stack.push(s);
    this.screenLayer.appendChild(s.el);
    this.refreshClose();
    this.onStackChange();
  }

  pop(): void {
    const s = this.stack.pop();
    if (!s) return;
    s.el.remove();
    s.onClose?.();
    const prev = this.top;
    if (prev) prev.el.style.display = '';
    this.refreshClose();
    this.onStackChange();
  }

  replace(s: Screen): void {
    const old = this.stack.pop();
    if (old) {
      old.el.remove();
      old.onClose?.();
    }
    this.push(s);
  }

  /** Remplace toute la pile. */
  set(s: Screen | null): void {
    while (this.stack.length) {
      const o = this.stack.pop()!;
      o.el.remove();
      o.onClose?.();
    }
    if (s) this.push(s);
    else {
      this.refreshClose();
      this.onStackChange();
    }
  }

  private refreshClose(): void {
    const top = this.top;
    this.closeBtn.hidden = !top || !!top.onEscape;
  }

  closeAll(): void {
    this.set(null);
  }

  update(dt: number): void {
    this.top?.update?.(dt);
  }

  private handleKey(e: KeyboardEvent): void {
    const top = this.top;
    if (!top) return;
    if ((e.target as HTMLElement)?.tagName === 'INPUT' && e.code !== 'Escape' && e.code !== 'Enter') return;
    if (top.onKey && top.onKey(e) === true) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.code === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      if (top.onEscape) top.onEscape();
      else this.pop();
    }
  }
}
