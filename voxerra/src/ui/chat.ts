/** Fenêtre de discussion et saisie des commandes. */
import { h } from './dom';
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

export function chatInput(log: ChatLog, initial: string, onSend: (text: string) => void, close: () => void): Screen {
  const input = h('input', { class: 'chat-input', maxlength: 256 }) as HTMLInputElement;
  input.value = initial;
  let hi = log.history.length;
  const el = h('div', { class: 'screen', style: { justifyContent: 'flex-end' } }, input);
  setTimeout(() => {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, 20);
  return {
    el,
    onKey: (e) => {
      if (e.code === 'Enter') {
        const v = input.value.trim();
        if (v) {
          log.history.push(v);
          onSend(v);
        }
        input.value = '';
        close();
        return true;
      }
      if (e.code === 'ArrowUp' && log.history.length) {
        hi = Math.max(0, hi - 1);
        input.value = log.history[hi] ?? '';
        return true;
      }
      if (e.code === 'ArrowDown') {
        hi = Math.min(log.history.length, hi + 1);
        input.value = log.history[hi] ?? '';
        return true;
      }
    },
  };
}
