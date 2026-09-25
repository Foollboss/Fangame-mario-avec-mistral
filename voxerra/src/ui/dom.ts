/** Petites aides DOM sans framework. */
type Child = Node | string | null | undefined | false;

export function h<K extends keyof HTMLElementTagNameMap>(tag: K, props: Record<string, unknown> = {}, ...children: (Child | Child[])[]): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = String(v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v as EventListener);
    else if (k === 'text') el.textContent = String(v);
    else if (k === 'html') el.innerHTML = String(v);
    else if (k in el && typeof v !== 'string') (el as unknown as Record<string, unknown>)[k] = v;
    else el.setAttribute(k, String(v));
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue;
    el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return el;
}

export function clear(el: HTMLElement): void {
  while (el.firstChild) el.removeChild(el.firstChild);
}

export function button(label: string, onClick: () => void, cls = ''): HTMLButtonElement {
  return h('button', { class: `btn ${cls}`, onclick: (e: Event) => {
    e.stopPropagation();
    playClick();
    onClick();
  } }, label);
}

/** Son de clic (branché par l'application). */
let clickSound: () => void = () => {};
export function setClickSound(f: () => void): void {
  clickSound = f;
}
export function playClick(): void {
  clickSound();
}

export function slider(opts: { label: (v: number) => string; min: number; max: number; step: number; value: number; onChange: (v: number) => void; cls?: string }): HTMLDivElement {
  const knob = h('div', { class: 'knob' });
  const txt = h('div', { class: 'txt' });
  const el = h('div', { class: `slider ${opts.cls ?? ''}` }, knob, txt);
  let v = opts.value;
  const render = () => {
    const f = (v - opts.min) / (opts.max - opts.min);
    knob.style.left = `calc(${f * 100}% - ${f * 16}px)`;
    txt.textContent = opts.label(v);
  };
  const setFromEvent = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const f = Math.max(0, Math.min(1, (e.clientX - r.left - 8) / (r.width - 16)));
    const nv = Math.round((opts.min + f * (opts.max - opts.min)) / opts.step) * opts.step;
    const clamped = Math.max(opts.min, Math.min(opts.max, +nv.toFixed(4)));
    if (clamped !== v) {
      v = clamped;
      opts.onChange(v);
      render();
    }
  };
  el.addEventListener('pointerdown', (e) => {
    el.setPointerCapture(e.pointerId);
    setFromEvent(e);
    const move = (ev: PointerEvent) => setFromEvent(ev);
    const up = () => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
  });
  render();
  return el;
}

/** Bouton cyclique (valeurs successives au clic). */
export function cycle<T>(label: string, values: { v: T; t: string }[], current: T, onChange: (v: T) => void, cls = ''): HTMLButtonElement {
  let i = Math.max(0, values.findIndex((x) => x.v === current));
  const b = h('button', { class: `btn ${cls}` }) as HTMLButtonElement;
  const render = () => (b.textContent = `${label} : ${values[i].t}`);
  b.addEventListener('click', (e) => {
    e.stopPropagation();
    playClick();
    i = (i + 1) % values.length;
    render();
    onChange(values[i].v);
  });
  b.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    playClick();
    i = (i - 1 + values.length) % values.length;
    render();
    onChange(values[i].v);
  });
  render();
  return b;
}

/** Texture de bouton « pierre » générée une fois. */
export function installButtonTexture(): void {
  const c = document.createElement('canvas');
  c.width = c.height = 32;
  const g = c.getContext('2d')!;
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 32; x++) {
      const v = 100 + Math.floor(Math.random() * 26) + (((x >> 2) + (y >> 2)) % 3 === 0 ? 6 : 0);
      g.fillStyle = `rgba(${v},${v},${v},0.22)`;
      g.fillRect(x, y, 1, 1);
    }
  document.documentElement.style.setProperty('--btn-noise', `url(${c.toDataURL()})`);
}
