/** Fenêtre de discussion et saisie des commandes. */
import { h, clear } from './dom';
import { t } from '../i18n/i18n';
import type { Screen } from './ui';

export class ChatLog {
  readonly el: HTMLElement;
  private lines: { el: HTMLElement; t: number }[] = [];
  history: string[] = [];

  constructor() {
    this.el = h('div', { class: 'chat passthrough' });
  }

  add(text: string, color = '#ffffff'): void {
    if (!text) return;
    const el = h('div', { class: 'line', style: { color } }, text);
    this.el.appendChild(el);
    this.lines.push({ el, t: performance.now() });
    while (this.lines.length > 60) this.lines.shift()!.el.remove();
  }

  update(open: boolean): void {
    const now = performance.now();
    for (const l of this.lines) l.el.classList.toggle('fade', !open && now - l.t > 10000);
    this.el.style.maxHeight = open ? '60vh' : '220px';
    this.el.style.overflow = 'hidden';
  }
}

export interface ChatScreen extends Screen {
  /** Donne le focus à la saisie (à appeler pendant le geste de l'utilisateur pour ouvrir le clavier du téléphone). */
  focus(): void;
}

/**
 * Saisie de la discussion et des commandes : formulaire (la touche Entrée /
 * « Envoyer » des claviers de téléphone le valide), bouton d'envoi et
 * suggestions à toucher pour les commandes (Tab prend la première).
 */
export function chatInput(log: ChatLog, initial: string, onSend: (text: string) => void, close: () => void, complete?: (line: string) => string[]): ChatScreen {
  const input = h('input', { class: 'chat-input', maxlength: 256, enterkeyhint: 'send', autocapitalize: 'off', autocomplete: 'off', spellcheck: false }) as HTMLInputElement;
  input.value = initial;
  let hi = log.history.length;
  let sent = false;
  const sugg = h('div', { class: 'chat-sugg' });
  const send = () => {
    if (sent) return;
    sent = true;
    const v = input.value.trim();
    if (v) {
      log.history.push(v);
      onSend(v);
    }
    input.value = '';
    close();
  };
  const sendBtn = h('button', { class: 'chat-send', type: 'submit', title: t('Envoyer'), 'aria-label': t('Envoyer') }, '➤');
  const form = h('form', { class: 'chat-form' }, input, sendBtn);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    send();
  });
  const refresh = () => {
    clear(sugg);
    const list = complete?.(input.value) ?? [];
    for (const line of list) {
      const word = line.trimEnd().split(' ').pop()!;
      const chip = h('button', { class: 'chat-chip', type: 'button' }, line.split(' ').length === 2 ? line.trimEnd() : word);
      // pointerdown : le clavier du téléphone reste ouvert
      chip.addEventListener('pointerdown', (e) => e.preventDefault());
      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        input.value = line;
        focus();
        refresh();
      });
      sugg.appendChild(chip);
    }
    sugg.hidden = !list.length;
  };
  input.addEventListener('input', refresh);
  const focus = () => {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  };
  const el = h('div', { class: 'screen chat-screen', style: { justifyContent: 'flex-end' } }, sugg, form);
  setTimeout(focus, 20);
  refresh();
  return {
    el,
    focus,
    onKey: (e) => {
      if (e.type !== 'keydown') return;
      if (e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter') {
        send();
        return true;
      }
      if (e.code === 'Tab') {
        const first = complete?.(input.value)[0];
        if (first) {
          input.value = first;
          refresh();
        }
        return true;
      }
      if (e.code === 'ArrowUp' && log.history.length) {
        hi = Math.max(0, hi - 1);
        input.value = log.history[hi] ?? '';
        refresh();
        return true;
      }
      if (e.code === 'ArrowDown') {
        hi = Math.min(log.history.length, hi + 1);
        input.value = log.history[hi] ?? '';
        refresh();
        return true;
      }
    },
  };
}
