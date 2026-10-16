/**
 * Section « Clavier et souris » : sensibilité, saut automatique et réaffectation des touches.
 * La capture passe par InputManager.onRawKey (clavier) et un écouteur pointerdown (souris) ;
 * Échap annule ; une touche déjà utilisée est échangée avec l'action concernée.
 */
import { button, clickSound, confirmDialog, h, toast } from '../../dom';
import { keyLabel } from '../../../input/InputManager';
import { DEFAULT_KEYS, type KeyBindings } from '../../../core/Settings';
import { intro, pct, sectionHead, setSetting, settingToggle, sliderRow, type SectionCtx } from './common';

type Action = keyof KeyBindings;

/** Libellés des actions, dans l'ordre d'affichage. */
const ACTIONS: Array<[Action, string]> = [
  ['forward', 'Avancer'],
  ['back', 'Reculer'],
  ['left', 'Aller à gauche'],
  ['right', 'Aller à droite'],
  ['jump', 'Sauter / monter en vol'],
  ['sneak', 'S’accroupir / descendre en vol'],
  ['sprint', 'Courir'],
  ['inventory', 'Inventaire'],
  ['drop', 'Lâcher l’objet tenu'],
  ['chat', 'Discussion'],
  ['command', 'Saisir une commande'],
  ['perspective', 'Changer de vue'],
  ['map', 'Carte'],
  ['hud', 'Masquer l’interface'],
  ['debug', 'Informations de débogage'],
  ['pickBlock', 'Choisir le bloc visé'],
];

/**
 * Le jeu lit « Choisir le bloc visé » uniquement sur un bouton de souris, et les autres actions
 * uniquement au clavier : la capture n'accepte que ce qui fonctionne réellement.
 */
const MOUSE_ONLY: ReadonlySet<Action> = new Set<Action>(['pickBlock']);

/** Touches fixes du jeu, impossibles à réaffecter. */
const RESERVED = new Set(['Escape', 'KeyF', 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9']);

export function bindingLabel(code: string): string {
  const m = /^Mouse(\d+)$/.exec(code);
  if (m && Number(m[1]) > 2) return 'Bouton souris ' + (Number(m[1]) + 1);
  return keyLabel(code);
}

const actionName = (a: Action): string => ACTIONS.find((x) => x[0] === a)?.[1] ?? a;

export function keyboardSection(ctx: SectionCtx): HTMLElement[] {
  const app = ctx.app;
  const s = app.settings.data;
  const buttons = new Map<Action, HTMLButtonElement>();
  let waiting: Action | null = null;
  let rawKeyFn: ((e: KeyboardEvent) => boolean) | null = null;
  let ignoreClicksUntil = 0;

  /** Met à jour les libellés et signale les doublons éventuels (anciens réglages). */
  const refresh = () => {
    const keys = app.settings.data.keys;
    const count = new Map<string, number>();
    for (const [a] of ACTIONS) count.set(keys[a], (count.get(keys[a]) ?? 0) + 1);
    for (const [a, b] of buttons) {
      if (a === waiting) continue;
      b.textContent = bindingLabel(keys[a]);
      b.classList.remove('waiting');
      b.classList.toggle('st-conflict', (count.get(keys[a]) ?? 0) > 1);
      b.title = (count.get(keys[a]) ?? 0) > 1 ? 'Touche utilisée par plusieurs actions' : '';
    }
  };

  /** Bloque le clic qui suit l'appui de souris capturé (il ne doit rien activer d'autre). */
  const swallowNextClick = () => {
    const block = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
    };
    const types = ['mousedown', 'click', 'auxclick'];
    for (const t of types) window.addEventListener(t, block, true);
    window.setTimeout(() => types.forEach((t) => window.removeEventListener(t, block, true)), 500);
  };

  const onPointer = (e: PointerEvent) => {
    if (!waiting) return;
    e.preventDefault();
    e.stopPropagation();
    swallowNextClick();
    if (e.pointerType !== 'mouse') {
      stop(false);
      return;
    }
    const code = 'Mouse' + e.button;
    if (!MOUSE_ONLY.has(waiting)) {
      // Clic ailleurs : annulation
      stop(false);
      return;
    }
    if (e.button === 0) {
      stop(false);
      return;
    }
    if (e.button === 2) {
      toast('Le clic droit sert déjà à utiliser et poser : choisissez un autre bouton.');
      return;
    }
    assign(waiting, code);
  };
  const onContext = (e: Event) => {
    if (waiting) e.preventDefault();
  };

  const stop = (refocus: boolean, keyCode?: string) => {
    const a = waiting;
    waiting = null;
    if (rawKeyFn && app.input.onRawKey === rawKeyFn) app.input.onRawKey = null;
    rawKeyFn = null;
    window.removeEventListener('pointerdown', onPointer, true);
    window.removeEventListener('contextmenu', onContext, true);
    refresh();
    if (!a || !refocus) return;
    // On rend le focus au bouton une fois la touche relâchée (Espace/Entrée l'activeraient sinon).
    const b = buttons.get(a);
    ignoreClicksUntil = performance.now() + 350;
    const focus = () => {
      window.removeEventListener('keyup', onUp, true);
      if (b?.isConnected) b.focus();
    };
    const onUp = (e: KeyboardEvent) => {
      if (!keyCode || e.code === keyCode) focus();
    };
    window.addEventListener('keyup', onUp, true);
    window.setTimeout(focus, 1200);
  };

  const assign = (action: Action, code: string) => {
    const keys = { ...app.settings.data.keys };
    const old = keys[action];
    const other = ACTIONS.map((x) => x[0]).find((a) => a !== action && keys[a] === code);
    keys[action] = code;
    if (other) keys[other] = old;
    app.settings.set('keys', keys);
    clickSound?.();
    stop(true, code.startsWith('Mouse') ? undefined : code);
    if (other && old !== code) toast(`« ${actionName(other)} » utilise maintenant ${bindingLabel(old)}`);
  };

  const start = (action: Action) => {
    if (waiting) stop(false);
    waiting = action;
    const b = buttons.get(action)!;
    b.classList.add('waiting');
    b.classList.remove('st-conflict');
    b.textContent = MOUSE_ONLY.has(action) ? 'Bouton de souris…' : 'Appuyez sur une touche…';
    // Aucun élément ne garde le focus : la touche capturée n'active rien.
    (document.activeElement as HTMLElement | null)?.blur?.();
    rawKeyFn = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.repeat || !waiting) return true;
      if (e.code === 'Escape') {
        stop(true, 'Escape');
        return true;
      }
      if (MOUSE_ONLY.has(waiting)) {
        toast('Cette action se règle avec un bouton de la souris (Échap pour annuler).');
        return true;
      }
      if (!e.code || e.code === 'Unidentified') return true;
      if (RESERVED.has(e.code)) {
        toast(`${keyLabel(e.code)} est réservée (pause, barre d’objets ou échange des mains).`);
        return true;
      }
      assign(waiting, e.code);
      return true;
    };
    app.input.onRawKey = rawKeyFn;
    window.addEventListener('pointerdown', onPointer, true);
    window.addEventListener('contextmenu', onContext, true);
  };

  ctx.onLeave(() => stop(false));
  ctx.onBack(() => {
    if (!waiting) return false;
    stop(true);
    return true;
  });

  const rows: HTMLElement[] = [];
  for (const [action, label] of ACTIONS) {
    const b = h('button', { class: 'btn keybind focus-ring', type: 'button' }, bindingLabel(s.keys[action])) as HTMLButtonElement;
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      if (performance.now() < ignoreClicksUntil) return;
      clickSound?.();
      start(action);
    });
    buttons.set(action, b);
    rows.push(h('div', { class: 'st-key-row' }, h('div', { class: 'grow' }, label, MOUSE_ONLY.has(action) ? h('div', { class: 'desc' }, 'Bouton de souris (molette ou boutons latéraux).') : null), b));
  }
  refresh();

  const reset = button(
    'Réinitialiser les touches',
    () =>
      confirmDialog('Réinitialiser les touches', 'Toutes les touches reprendront leur affectation d’origine.', 'Réinitialiser', () => {
        stop(false);
        app.settings.set('keys', { ...DEFAULT_KEYS });
        refresh();
        toast('Touches réinitialisées');
      }),
    'dark',
  );

  return [
    intro('Clavier et souris', 'Sensibilité et affectation des touches.'),
    sliderRow(app, {
      label: 'Sensibilité de la souris',
      desc: 'Également utilisée pour la caméra à la manette.',
      min: 0,
      max: 1,
      step: 0.01,
      value: s.mouseSensitivity,
      fmt: pct,
      apply: (v) => setSetting(app, 'mouseSensitivity', v),
    }),
    settingToggle(app, 'autoJump', 'Saut automatique', 'Monte automatiquement les marches d’un bloc en marchant.'),
    sectionHead('TOUCHES'),
    h('div', { class: 'section st-note' }, 'Choisissez une action puis appuyez sur la nouvelle touche. Échap annule. Si la touche est déjà prise, les deux actions échangent leurs touches.'),
    ...rows,
    h(
      'div',
      { class: 'section st-note' },
      'Commandes fixes : clic gauche = attaquer / casser, clic droit = utiliser / poser, molette = changer d’objet, 1 à 9 = barre d’objets, F = échanger main droite et main gauche, Ctrl + « Lâcher » = lâcher toute la pile, Échap = pause.',
    ),
    h('div', { class: 'section' }, h('div', { class: 'st-actions' }, reset)),
  ];
}
