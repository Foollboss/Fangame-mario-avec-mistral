/** Aides DOM légères pour construire l'interface (sans framework). */
import { icon } from './icons';

type Child = Node | string | number | null | undefined | false | Child[];
type Attrs = Record<string, unknown> & { class?: string; style?: string | Partial<CSSStyleDeclaration> };

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, attrs: Attrs | null = null, ...children: Child[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (v === undefined || v === null || v === false) continue;
      if (k === 'class') el.className = String(v);
      else if (k === 'style') {
        if (typeof v === 'string') el.setAttribute('style', v);
        else Object.assign(el.style, v);
      } else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
      else if (k === 'html') el.innerHTML = String(v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, String(v));
    }
  }
  append(el, children);
  return el;
}

export function append(el: HTMLElement, children: Child[]): void {
  for (const c of children) {
    if (c === null || c === undefined || c === false) continue;
    if (Array.isArray(c)) append(el, c);
    else if (c instanceof Node) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  }
}

export function img(name: string, cls = 'ico'): HTMLImageElement {
  return h('img', { class: cls, src: icon(name), draggable: 'false', alt: '' });
}

/** Bouton style bloc. */
export function button(label: Child, onClick: () => void, cls = '', ico?: string): HTMLButtonElement {
  const b = h('button', { class: 'btn focus-ring ' + cls, type: 'button' }, ico ? img(ico) : null, label);
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    clickSound?.();
    onClick();
  });
  return b;
}

/** Son de clic (branché par l'AudioManager). */
export let clickSound: (() => void) | null = null;
export function setClickSound(fn: () => void): void {
  clickSound = fn;
}

/** Interrupteur O/I. */
export function toggle(value: boolean, onChange: (v: boolean) => void, disabled = false): HTMLElement {
  const t = h('div', { class: 'toggle focus-ring' + (value ? ' on' : '') + (disabled ? ' disabled' : ''), tabindex: '0', role: 'switch' }, h('div', { class: 'half i' }, 'I'), h('div', { class: 'half o' }, 'O'), h('div', { class: 'knob' }));
  const flip = () => {
    value = !value;
    t.classList.toggle('on', value);
    clickSound?.();
    onChange(value);
  };
  t.addEventListener('click', flip);
  t.addEventListener('keydown', (e) => {
    const k = e as KeyboardEvent;
    if (k.code === 'Enter' || k.code === 'Space') {
      // Empêche la navigation clavier globale de « cliquer » une seconde fois.
      k.preventDefault();
      k.stopPropagation();
      flip();
    }
  });
  return t;
}

/** Boutons segmentés. */
export function segmented<T extends string>(options: Array<[T, string]>, value: T, onChange: (v: T) => void, disabledValues: T[] = []): HTMLElement {
  const wrap = h('div', { class: 'seg' });
  const btns: HTMLButtonElement[] = [];
  for (const [v, label] of options) {
    const b = button(label, () => {
      value = v;
      btns.forEach((x, i) => x.classList.toggle('sel', options[i][0] === v));
      onChange(v);
    });
    if (v === value) b.classList.add('sel');
    if (disabledValues.includes(v)) b.disabled = true;
    btns.push(b);
    wrap.appendChild(b);
  }
  return wrap;
}

export function slider(min: number, max: number, step: number, value: number, onInput: (v: number) => void, fmt?: (v: number) => string): HTMLElement {
  const label = h('span', { class: 'dim' }, fmt ? fmt(value) : String(value));
  const s = h('input', { class: 'slider', type: 'range', min: String(min), max: String(max), step: String(step), value: String(value) }) as HTMLInputElement;
  s.addEventListener('input', () => {
    const v = Number(s.value);
    label.textContent = fmt ? fmt(v) : String(v);
    onInput(v);
  });
  return h('div', { class: 'row' }, h('div', { class: 'grow' }, s), label);
}

/** Section de réglage : titre, contrôle, description. */
export function section(label: string, control: HTMLElement | null, desc?: string, inline = false): HTMLElement {
  if (inline)
    return h(
      'div',
      { class: 'section' },
      h('div', { class: 'row' }, h('div', { class: 'grow' }, h('div', null, label), desc ? h('div', { class: 'desc' }, desc) : null), control),
    );
  return h('div', { class: 'section' }, h('div', { class: 'label' }, label), control, desc ? h('div', { class: 'desc' }, desc) : null);
}

export function sectionHead(label: string): HTMLElement {
  return h('div', { class: 'section head' }, label);
}

export function textField(value: string, placeholder: string, onInput: (v: string) => void, maxLength = 64): HTMLInputElement {
  const f = h('input', { class: 'field', value, placeholder, maxlength: String(maxLength), spellcheck: 'false', autocomplete: 'off' }) as HTMLInputElement;
  f.addEventListener('input', () => onInput(f.value));
  f.addEventListener('keydown', (e) => e.stopPropagation());
  return f;
}

/** Fenêtre de dialogue modale ; renvoie une fonction de fermeture. */
export function modal(title: string, body: Child, actions: Array<[string, () => void | boolean, string?]>): () => void {
  const root = document.getElementById('ui')!;
  const close = () => back.remove();
  const acts = h('div', { class: 'modal-actions' });
  for (const [label, fn, cls] of actions)
    acts.appendChild(
      button(label, () => {
        if (fn() !== false) close();
      }, cls ?? ''),
    );
  const back = h('div', { class: 'modal-back' }, h('div', { class: 'modal' }, h('div', { class: 'modal-title' }, title), h('div', { class: 'modal-body' }, body), acts));
  back.addEventListener('pointerdown', (e) => {
    if (e.target === back) close();
  });
  root.appendChild(back);
  const first = back.querySelector('input, .btn') as HTMLElement | null;
  first?.focus();
  return close;
}

export function confirmDialog(title: string, text: string, yes: string, onYes: () => void, danger = true): void {
  modal(title, h('div', null, text), [
    ['Annuler', () => undefined],
    [yes, onYes, danger ? 'red' : 'green'],
  ]);
}

let toastTimer = 0;
export function toast(text: string, ms = 2500): void {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const t = h('div', { class: 'toast' }, text);
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.remove(), ms);
}

/** Choix d'un fichier local (packs, mondes). */
export function pickFile(accept: string): Promise<File | null> {
  return new Promise((resolve) => {
    const input = h('input', { type: 'file', accept, style: 'display:none' }) as HTMLInputElement;
    document.body.appendChild(input);
    input.addEventListener('change', () => {
      resolve(input.files?.[0] ?? null);
      input.remove();
    });
    input.click();
    setTimeout(() => {
      if (!input.files?.length) {
        /* annulation silencieuse */
      }
    }, 60000);
  });
}

/** Enregistre un fichier (navigateur : téléchargement ; Android : dossier Téléchargements). */
export async function saveFile(name: string, blob: Blob): Promise<string> {
  const bridge = (window as unknown as { AndroidBridge?: { saveFile(n: string, b64: string): string } }).AndroidBridge;
  if (bridge) {
    const buf = new Uint8Array(await blob.arrayBuffer());
    let s = '';
    for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    const path = bridge.saveFile(name, btoa(s));
    return path || '';
  }
  const url = URL.createObjectURL(blob);
  const a = h('a', { href: url, download: name, style: 'display:none' });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 5000);
  return name;
}

export function formatBytes(n: number): string {
  if (n < 1024) return n + 'o';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + 'Ko';
  return (n / 1024 / 1024).toFixed(1) + 'Mo';
}

export function formatDate(t: number): string {
  const d = new Date(t);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${String(d.getFullYear()).slice(2)}`;
}
