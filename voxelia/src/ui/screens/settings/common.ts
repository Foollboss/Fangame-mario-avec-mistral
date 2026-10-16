/**
 * Outils partagés par les sections de l'écran « Paramètres » : contexte de section,
 * lignes de réglage (interrupteur, curseur, choix), styles injectés (préfixe « st- »).
 */
import { h, section, sectionHead, segmented, slider, toggle } from '../../dom';
import type { AppContext, SettingsSection } from '../../../core/AppContext';
import type { Settings } from '../../../core/Settings';

/** Services offerts à une section pendant qu'elle est affichée. */
export interface SectionCtx {
  readonly app: AppContext;
  /** Élément racine de l'écran (masqué pendant l'édition de la disposition tactile). */
  readonly screenEl: HTMLElement;
  /** Reconstruit la section affichée en conservant le défilement. */
  rerender(): void;
  /** Ouvre une autre section de l'écran. */
  goto(section: SettingsSection): void;
  /** Appelée quand on quitte la section (changement de section ou fermeture de l'écran). */
  onLeave(fn: () => void): void;
  /** Appelée à chaque image tant que la section est affichée. */
  onFrame(fn: (dt: number) => void): void;
  /** Intercepte le bouton Retour (renvoie true si l'action a été gérée). */
  onBack(fn: () => boolean): void;
  /** La section est-elle toujours affichée ? (protège les traitements asynchrones) */
  alive(): boolean;
}

export type SectionBuilder = (ctx: SectionCtx) => HTMLElement[];

/** Enregistre un réglage puis applique les changements (rendu, interface, audio). */
export function setSetting<K extends keyof Settings>(app: AppContext, key: K, value: Settings[K]): void {
  app.settings.set(key, value);
  app.applySettings();
}

/** En-tête de section : titre en gras et courte description. */
export function intro(title: string, desc: string): HTMLElement {
  return h('div', { class: 'section st-intro' }, h('div', { class: 'bold' }, title), h('div', { class: 'desc' }, desc));
}

export { sectionHead };

/** Ligne avec interrupteur O/I. */
export function toggleRow(label: string, value: boolean, onChange: (v: boolean) => void, desc?: string, disabled = false): HTMLElement {
  return section(label, toggle(value, onChange, disabled), desc, true);
}

/** Interrupteur relié directement à un réglage booléen. */
export function settingToggle(app: AppContext, key: { [K in keyof Settings]: Settings[K] extends boolean ? K : never }[keyof Settings], label: string, desc?: string): HTMLElement {
  return toggleRow(label, app.settings.data[key] as boolean, (v) => setSetting(app, key, v as never), desc);
}

/** Choix exclusif (boutons segmentés) avec description qui peut suivre la valeur. */
export function choiceRow<T extends string>(label: string, options: Array<[T, string]>, value: T, onChange: (v: T) => void, desc?: string | ((v: T) => string), disabled = false): HTMLElement {
  const text = (v: T) => (typeof desc === 'function' ? desc(v) : desc ?? '');
  const d = h('div', { class: 'desc' }, text(value));
  if (!text(value)) d.classList.add('hidden');
  const seg = segmented(options, value, (v) => {
    const t = text(v);
    d.textContent = t;
    d.classList.toggle('hidden', !t);
    onChange(v);
  }, disabled ? options.map((o) => o[0]) : []);
  return h('div', { class: 'section' }, h('div', { class: 'label' }, label), seg, d);
}

export interface SliderOpts {
  label: string;
  desc?: string;
  min: number;
  max: number;
  step: number;
  value: number;
  fmt: (v: number) => string;
  /** Appliquer pendant le glissement (sinon seulement au relâchement). */
  live?: boolean;
  apply: (v: number) => void;
  /** Appelée au relâchement (aperçu sonore…). */
  release?: (v: number) => void;
}

/**
 * Curseur : application regroupée à une fois par image pendant le glissement,
 * valeur définitive au relâchement. Haut/Bas au clavier passent au réglage voisin.
 */
export function sliderRow(app: AppContext, o: SliderOpts): HTMLElement {
  let pending: number | null = null;
  let raf = 0;
  const flush = () => {
    raf = 0;
    if (pending === null) return;
    const v = pending;
    pending = null;
    o.apply(v);
  };
  const row = slider(o.min, o.max, o.step, o.value, (v) => {
    if (o.live === false) return;
    pending = v;
    if (!raf) raf = requestAnimationFrame(flush);
  }, o.fmt);
  const input = row.querySelector('input') as HTMLInputElement;
  input.classList.add('focus-ring');
  input.addEventListener('change', () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    pending = null;
    const v = Number(input.value);
    o.apply(v);
    o.release?.(v);
  });
  input.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowUp' || e.code === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      app.ui.navigate(e.code === 'ArrowUp' ? 'up' : 'down');
    }
  });
  return section(o.label, row, o.desc);
}

/** Ligne d'information « libellé : valeur ». */
export function infoRow(label: string, value: string | HTMLElement, desc?: string): HTMLElement {
  return h(
    'div',
    { class: 'section' },
    h('div', { class: 'row st-info' }, h('div', { class: 'grow' }, label), typeof value === 'string' ? h('div', { class: 'st-val' }, value) : value),
    desc ? h('div', { class: 'desc' }, desc) : null,
  );
}

/** Texte explicatif simple (paragraphe). */
export function note(...children: Array<string | HTMLElement>): HTMLElement {
  return h('div', { class: 'section st-note' }, ...children);
}

export const pct = (v: number): string => Math.round(v * 100) + ' %';

/** Message d'erreur lisible. */
export function errorText(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

// ---------------------------------------------------------------- styles (injectés une fois)
const STYLE = `
.st-root .topbar .back .ico { width: calc(var(--u) * 20); height: calc(var(--u) * 20); }
.st-root .sidebar { padding-bottom: calc(var(--u) * 10); }
.st-root .side-group { padding-top: calc(var(--u) * 12); border-bottom-width: calc(var(--u) * 2); }
.st-root .side-item { outline: none; }
.st-root .side-item .ico { width: calc(var(--u) * 15); height: calc(var(--u) * 15); }
.st-root .side-item:focus-visible { box-shadow: inset 0 0 0 calc(var(--u) * 1) #fff; }
.st-root .content { padding-bottom: calc(var(--u) * 16); }
.st-root .section .btn .ico { width: calc(var(--u) * 11); height: calc(var(--u) * 11); }
.st-intro .bold { font-size: calc(var(--u) * 9); }
.st-intro .desc { margin-top: calc(var(--u) * 2); }
.st-note { color: var(--text-dim); line-height: 1.45; }
.st-note b { color: #fff; font-weight: normal; }
.st-info .st-val { color: var(--text-dim); text-align: right; max-width: 60%; overflow-wrap: anywhere; }
.st-actions { display: flex; flex-wrap: wrap; gap: calc(var(--u) * 4); }
.st-actions .btn { flex: 1 1 auto; }
.st-key-row { display: flex; align-items: center; gap: calc(var(--u) * 6); padding: calc(var(--u) * 4) calc(var(--u) * 12); border-bottom: calc(var(--u) * 1) solid var(--bg-dark); }
.st-key-row .grow { flex: 1; min-width: 0; }
.st-key-row .btn.keybind { min-width: calc(var(--u) * 86); color: #313233; }
.st-key-row .btn.keybind.waiting { animation: st-blink 0.8s steps(2) infinite; }
.st-key-row .btn.keybind.st-conflict { background: #e59a9a; }
@keyframes st-blink { 50% { background: #fff4b0; } }
.st-table { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr); border: calc(var(--u) * 1) solid var(--line); background: var(--bg-dark); }
.st-table > div { padding: calc(var(--u) * 3) calc(var(--u) * 6); border-bottom: calc(var(--u) * 1) solid #262627; }
.st-table > .st-th { color: var(--yellow); }
.st-table > div:nth-child(odd) { color: var(--text-dim); }
.st-list { display: flex; flex-direction: column; }
.st-item { display: flex; align-items: center; gap: calc(var(--u) * 6); padding: calc(var(--u) * 5) calc(var(--u) * 12); border-bottom: calc(var(--u) * 1) solid var(--bg-dark); flex-wrap: wrap; }
.st-item .st-ico { width: calc(var(--u) * 26); height: calc(var(--u) * 26); flex: 0 0 auto; border: calc(var(--u) * 1) solid #000; background: #2a5a8a center/cover; image-rendering: pixelated; display: flex; align-items: center; justify-content: center; }
.st-item .st-ico .st-fill { width: 70%; height: 70%; image-rendering: pixelated; }
.st-root .section > .st-actions { margin-top: calc(var(--u) * 4); }
.st-root .section > .row + .st-actions { margin-top: calc(var(--u) * 5); }
.st-item .st-txt { flex: 1 1 calc(var(--u) * 90); min-width: 0; display: flex; flex-direction: column; gap: calc(var(--u) * 2); }
.st-item .st-name { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.st-item .st-sub { color: var(--text-dim); overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
.st-item .st-btns { display: flex; gap: calc(var(--u) * 3); flex: 0 0 auto; margin-left: auto; }
.st-item .st-btns .btn { padding-left: calc(var(--u) * 6); padding-right: calc(var(--u) * 6); }
.st-empty { color: var(--text-dim); padding: calc(var(--u) * 8) calc(var(--u) * 12); }
.st-code { font-family: monospace; font-size: calc(var(--u) * 6.5); background: #1e1e1f; border: calc(var(--u) * 1) solid #000; padding: calc(var(--u) * 4) calc(var(--u) * 6); color: #b8f0a0; overflow-wrap: anywhere; user-select: text; -webkit-user-select: text; margin-top: calc(var(--u) * 4); }
.st-face { width: calc(var(--u) * 28); height: calc(var(--u) * 28); border: calc(var(--u) * 1) solid #000; image-rendering: pixelated; flex: 0 0 auto; }
.st-person { display: flex; align-items: center; gap: calc(var(--u) * 6); padding: calc(var(--u) * 4) calc(var(--u) * 12); border-bottom: calc(var(--u) * 1) solid var(--bg-dark); }
.st-person .st-face { width: calc(var(--u) * 16); height: calc(var(--u) * 16); }
.st-person .badge { margin-left: auto; }
.st-warn { color: #ffb0a0; }
.st-ok { color: #9be07a; }
.st-edit-bar { position: fixed; left: 50%; top: calc(var(--u) * 6); transform: translateX(-50%); z-index: 46; display: flex; align-items: center; gap: calc(var(--u) * 6); background: rgba(30, 30, 31, 0.92); border: calc(var(--u) * 1) solid #000; padding: calc(var(--u) * 4) calc(var(--u) * 6); max-width: calc(100vw - var(--u) * 12); box-sizing: border-box; flex-wrap: wrap; justify-content: center; color: #fff; font-family: 'VoxPixel', monospace; font-size: var(--fs); }
.st-edit-bar .st-hint { color: var(--text-dim); }
.st-prog { display: flex; flex-direction: column; gap: calc(var(--u) * 6); }
.st-prog .progress { height: calc(var(--u) * 4); }
`;

export function ensureStyle(): void {
  if (document.getElementById('st-style')) return;
  const s = document.createElement('style');
  s.id = 'st-style';
  s.textContent = STYLE;
  document.head.appendChild(s);
}
