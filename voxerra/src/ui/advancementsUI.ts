/** Écran des progrès : arbre déplaçable à la souris, reliant les étapes. */
import { h, button } from './dom';
import type { Screen } from './ui';
import type { AppApi } from '../app/api';
import type { Sim } from '../sim/sim';
import type { Player } from '../entity/player';
import type { AdvancementDef } from '../registry/types';

export function advancementsScreen(app: AppApi, sim: Sim, _p: Player): Screen {
  const tracker = (sim as unknown as { advancements?: { done: Set<string> } }).advancements;
  const done = tracker?.done ?? new Set(sim.meta.advancements ?? []);
  const defs = sim.content.advancements;
  // Disposition : profondeur = distance à la racine ; lignes réparties par sous-arbre
  const children = new Map<string, AdvancementDef[]>();
  const roots: AdvancementDef[] = [];
  for (const d of defs) {
    if (d.parent && defs.some((x) => x.id === d.parent)) {
      const l = children.get(d.parent) ?? [];
      l.push(d);
      children.set(d.parent, l);
    } else roots.push(d);
  }
  const pos = new Map<string, { x: number; y: number }>();
  let row = 0;
  const place = (d: AdvancementDef, depth: number) => {
    const kids = children.get(d.id) ?? [];
    if (kids.length === 0) {
      pos.set(d.id, { x: depth, y: row++ });
      return;
    }
    const start = row;
    for (const k of kids) place(k, depth + 1);
    pos.set(d.id, { x: depth, y: (start + row - 1) / 2 });
  };
  for (const r of roots) place(r, 0);
  const SX = 96,
    SY = 64,
    PAD = 40;
  const maxX = Math.max(...[...pos.values()].map((p) => p.x));
  const maxY = Math.max(...[...pos.values()].map((p) => p.y));
  const W = (maxX + 1) * SX + PAD * 2,
    H = (maxY + 1) * SY + PAD * 2;
  const canvas = h('canvas', { class: 'adv-canvas', width: W, height: H }) as HTMLCanvasElement;
  const layer = h('div', { style: { position: 'absolute', left: '0', top: '0', width: `${W}px`, height: `${H}px` } }, canvas);
  const g = canvas.getContext('2d')!;
  g.fillStyle = '#23232e';
  g.fillRect(0, 0, W, H);
  // motif de fond (blocs)
  for (let y = 0; y < H; y += 32) for (let x = 0; x < W; x += 32) {
    g.fillStyle = (x / 32 + y / 32) % 2 ? '#262633' : '#212129';
    g.fillRect(x, y, 32, 32);
  }
  g.lineWidth = 4;
  for (const d of defs) {
    if (!d.parent || !pos.has(d.parent)) continue;
    const a = pos.get(d.parent)!,
      b = pos.get(d.id)!;
    const ax = PAD + a.x * SX + 26,
      ay = PAD + a.y * SY + 26,
      bx = PAD + b.x * SX + 26,
      by = PAD + b.y * SY + 26;
    const mx = (ax + bx) / 2;
    g.strokeStyle = done.has(d.id) ? '#e0c050' : '#707070';
    g.beginPath();
    g.moveTo(ax, ay);
    g.lineTo(mx, ay);
    g.lineTo(mx, by);
    g.lineTo(bx, by);
    g.stroke();
  }
  const info = h('div', { class: 'subtitle', style: { minHeight: '44px', textAlign: 'center' } }, 'Survolez une étape pour voir sa description.');
  for (const d of defs) {
    const p = pos.get(d.id)!;
    const node = h('div', { class: 'adv-node' + (done.has(d.id) ? ' done' : '') + (d.goal ? ' goal' : ''), style: { left: `${PAD + p.x * SX}px`, top: `${PAD + p.y * SY}px` } }, h('img', { src: app.icons.icon(d.icon) }));
    node.addEventListener('mouseenter', () => {
      info.innerHTML = '';
      info.append(h('div', { style: { color: done.has(d.id) ? '#ffe070' : '#ffffff' } }, d.title + (done.has(d.id) ? ' ✔' : '')), h('div', { class: 'hint' }, d.desc));
    });
    layer.appendChild(node);
  }
  const view = h('div', { class: 'adv-view' }, layer);
  let ox = 0,
    oy = 0,
    drag: { x: number; y: number } | null = null;
  view.addEventListener('mousedown', (e) => (drag = { x: e.clientX - ox, y: e.clientY - oy }));
  window.addEventListener('mouseup', () => (drag = null));
  view.addEventListener('mousemove', (e) => {
    if (!drag) return;
    const r = view.getBoundingClientRect();
    ox = Math.min(0, Math.max(r.width - W, e.clientX - drag.x));
    oy = Math.min(0, Math.max(r.height - H, e.clientY - drag.y));
    layer.style.transform = `translate(${ox}px, ${oy}px)`;
  });
  const count = defs.filter((d) => done.has(d.id)).length;
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, `Progrès (${count}/${defs.length})`),
    view,
    info,
    button('Terminé', () => app.ui.pop()),
  );
  return { el, pauses: true, closeOnInventoryKey: false, onKey: (e) => {
    if (e.code === 'KeyL') {
      app.ui.pop();
      return true;
    }
  } };
}
