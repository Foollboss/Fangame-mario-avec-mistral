/**
 * Écran « Paramètres » : barre latérale par groupes (Accessibilité ; Monde, en partie ;
 * Commandes ; Général) et contenu de la section choisie. Les réglages de l'appareil sont
 * enregistrés aussitôt par SettingsManager ; ceux du monde, en quittant la section.
 */
import { clickSound, h, img } from '../dom';
import type { AppContext, SettingsSection } from '../../core/AppContext';
import type { Screen } from '../UIManager';
import { ensureStyle, type SectionBuilder, type SectionCtx } from './settings/common';
import { accessibilitySection, audioSection, profileSection, videoSection } from './settings/general';
import { keyboardSection } from './settings/keyboard';
import { controllerSection, touchSection } from './settings/controls';
import { gameSection, multiplayerSection } from './settings/world';
import { packsSection, storageSection } from './settings/data';

interface Entry {
  id: SettingsSection;
  label: string;
  icon: string;
  build: SectionBuilder;
}

interface Group {
  title: string | null;
  /** Groupe affiché seulement pendant une partie. */
  inGame?: boolean;
  entries: Entry[];
}

const GROUPS: Group[] = [
  { title: null, entries: [{ id: 'accessibility', label: 'Accessibilité', icon: 'access', build: accessibilitySection }] },
  {
    title: 'Monde',
    inGame: true,
    entries: [
      { id: 'game', label: 'Jeu', icon: 'world', build: gameSection },
      { id: 'multiplayer', label: 'Multijoueur', icon: 'person', build: multiplayerSection },
    ],
  },
  {
    title: 'Commandes',
    entries: [
      { id: 'keyboard', label: 'Clavier et souris', icon: 'keyboard', build: keyboardSection },
      { id: 'controller', label: 'Manette', icon: 'controller', build: controllerSection },
      { id: 'touch', label: 'Tactile', icon: 'touch', build: touchSection },
    ],
  },
  {
    title: 'Général',
    entries: [
      { id: 'profile', label: 'Profil', icon: 'face', build: profileSection },
      { id: 'video', label: 'Vidéo', icon: 'monitor', build: videoSection },
      { id: 'audio', label: 'Audio', icon: 'speaker', build: audioSection },
      { id: 'packs', label: 'Packs de ressources', icon: 'chest_icon', build: packsSection },
      { id: 'storage', label: 'Stockage', icon: 'disk', build: storageSection },
    ],
  },
];

/** Sections reconstruites quand l'écran réapparaît (retour du vestiaire…). */
const REFRESH_ON_SHOW: ReadonlySet<SettingsSection> = new Set<SettingsSection>(['profile']);

/** Dernière section consultée (rouverte par défaut hors partie). */
let lastSection: SettingsSection | null = null;

type NavDir = 'up' | 'down' | 'left' | 'right' | 'ok' | 'back';

export class SettingsScreen implements Screen {
  readonly el: HTMLElement;
  /** Lu par Game : la partie solo est en pause tant que les paramètres sont ouverts. */
  readonly pausesGame = true;
  private readonly content: HTMLElement;
  private readonly items = new Map<SettingsSection, HTMLElement>();
  private readonly entries = new Map<SettingsSection, Entry>();
  private current: SettingsSection = 'accessibility';
  private token = 0;
  private leaveFns: Array<() => void> = [];
  private frameFns: Array<(dt: number) => void> = [];
  private backFns: Array<() => boolean> = [];
  private readonly observer: MutationObserver;
  private hidden = false;
  private destroyed = false;
  private readonly prevNav: ((dir: NavDir) => void) | null;
  private readonly nav: (dir: NavDir) => void;

  constructor(
    private readonly app: AppContext,
    section?: SettingsSection,
  ) {
    ensureStyle();
    const inGame = !!app.game;

    // Barre du haut
    const back = h('div', { class: 'back', role: 'button', title: 'Retour', 'aria-label': 'Retour' }, img('chevron_left'));
    back.addEventListener('click', () => {
      clickSound?.();
      this.app.ui.back();
    });
    const topbar = h('div', { class: 'topbar' }, back, h('div', { class: 'title' }, 'PARAMÈTRES'), h('div', { class: 'spacer' }));

    // Barre latérale
    const sidebar = h('div', { class: 'sidebar', role: 'tablist' });
    for (const g of GROUPS) {
      if (g.inGame && !inGame) continue;
      if (g.title) sidebar.append(h('div', { class: 'side-group' }, g.title));
      for (const e of g.entries) {
        this.entries.set(e.id, e);
        const it = h('div', { class: 'side-item focus-ring', tabindex: '0', role: 'tab' }, img(e.icon), h('span', null, e.label));
        it.addEventListener('click', () => {
          if (this.current === e.id) return;
          clickSound?.();
          this.select(e.id);
        });
        this.items.set(e.id, it);
        sidebar.append(it);
      }
    }

    this.content = h('div', { class: 'content', role: 'tabpanel' });
    this.el = h('div', { class: 'screen st-root' }, topbar, h('div', { class: 'screen-body' }, h('div', { class: 'split' }, sidebar, this.content)));

    // Manette : gauche/droite sur un curseur modifie sa valeur au lieu de déplacer le focus.
    this.prevNav = app.input.menuNav;
    this.nav = (dir) => {
      if (this.adjustSlider(dir)) return;
      this.prevNav?.(dir);
    };
    app.input.menuNav = this.nav;

    // L'UIManager masque l'écran quand un autre est empilé : rafraîchir au retour.
    this.observer = new MutationObserver(() => this.onVisibility());
    this.observer.observe(this.el, { attributes: true, attributeFilter: ['style'] });

    const wanted = section ?? (inGame ? 'game' : lastSection ?? 'accessibility');
    this.select(this.entries.has(wanted) ? wanted : 'accessibility');
  }

  // ---------------------------------------------------------------- cycle de vie
  onBack(): boolean {
    for (let i = this.backFns.length - 1; i >= 0; i--) if (this.backFns[i]()) return true;
    return false;
  }

  update(dt: number): void {
    for (const f of this.frameFns) f(dt);
  }

  destroy(): void {
    this.destroyed = true;
    this.observer.disconnect();
    this.runLeave();
    if (this.app.input.menuNav === this.nav) this.app.input.menuNav = this.prevNav;
  }

  // ---------------------------------------------------------------- sections
  private select(id: SettingsSection): void {
    this.current = id;
    lastSection = id;
    for (const [k, el] of this.items) {
      el.classList.toggle('active', k === id);
      el.setAttribute('aria-selected', String(k === id));
    }
    this.build();
    this.content.scrollTop = 0;
  }

  /** Construit la section courante (après avoir libéré la précédente). */
  private build(): void {
    this.runLeave();
    const token = ++this.token;
    const entry = this.entries.get(this.current)!;
    const ctx: SectionCtx = {
      app: this.app,
      screenEl: this.el,
      rerender: () => {
        if (token === this.token && !this.destroyed) this.rerender();
      },
      goto: (s) => {
        if (!this.destroyed && this.entries.has(s)) this.select(s);
      },
      onLeave: (fn) => this.leaveFns.push(fn),
      onFrame: (fn) => this.frameFns.push(fn),
      onBack: (fn) => this.backFns.push(fn),
      alive: () => token === this.token && !this.destroyed,
    };
    let els: HTMLElement[];
    try {
      els = entry.build(ctx);
    } catch (e) {
      console.error('Section des paramètres', entry.id, e);
      els = [h('div', { class: 'section st-warn' }, 'Cette section n’a pas pu être affichée.')];
    }
    this.content.replaceChildren(...els);
  }

  /** Reconstruit la section en gardant le défilement et l'élément focalisé (clavier / manette). */
  private rerender(): void {
    const scroll = this.content.scrollTop;
    const focusables = () => [...this.content.querySelectorAll<HTMLElement>('.btn, .toggle, .field, .slider')];
    const active = document.activeElement as HTMLElement | null;
    const idx = active ? focusables().indexOf(active) : -1;
    this.build();
    this.content.scrollTop = scroll;
    if (idx >= 0) focusables()[idx]?.focus({ preventScroll: true });
  }

  private runLeave(): void {
    const fns = this.leaveFns;
    this.leaveFns = [];
    this.frameFns = [];
    this.backFns = [];
    for (const f of fns) {
      try {
        f();
      } catch (e) {
        console.error(e);
      }
    }
  }

  private onVisibility(): void {
    if (this.destroyed) return;
    const hidden = this.el.style.display === 'none';
    if (hidden === this.hidden) return;
    this.hidden = hidden;
    if (!hidden && REFRESH_ON_SHOW.has(this.current)) this.rerender();
  }

  /** Gauche/droite à la manette sur un curseur focalisé de cet écran : change sa valeur. */
  private adjustSlider(dir: NavDir): boolean {
    if (dir !== 'left' && dir !== 'right') return false;
    const a = document.activeElement;
    if (!(a instanceof HTMLInputElement) || a.type !== 'range' || a.disabled || !this.el.contains(a) || this.el.style.display === 'none') return false;
    if (dir === 'left') a.stepDown();
    else a.stepUp();
    a.dispatchEvent(new Event('input', { bubbles: true }));
    a.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }
}
