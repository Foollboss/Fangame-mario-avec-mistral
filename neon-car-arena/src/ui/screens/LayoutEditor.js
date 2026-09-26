import { el, onTap } from '../dom.js';
import { DEFAULT_LAYOUT } from '../../input/MobileInput.js';

const LABELS = { accel: 'ACCÉL', brake: 'FREIN', jump: 'SAUT', boost: 'BOOST', dash: 'DASH' };

// Éditeur de disposition : glisser les boutons, régler leur taille individuellement.
export class LayoutEditor {
  constructor(ui, onSave) {
    const settings = ui.game.save.data.settings.controls;
    const layout = JSON.parse(JSON.stringify({ ...DEFAULT_LAYOUT, ...settings.layout }));
    let selected = 'accel';
    const node = el(`<div class="layout-editor">
      <div class="fakestick">JOYSTICK<br>(zone gauche)</div>
      <div class="bar panel">
        <span class="small">Glissez les boutons · taille de <b data-selname>ACCÉL</b></span>
        <input type="range" min="8" max="30" step="0.5" data-size style="width:140px">
        <button class="btn secondary" data-cancel>Annuler</button>
        <button class="btn" data-save>Enregistrer</button>
      </div>
      ${Object.keys(LABELS).map((id) => `<div class="tbtn tbtn-${id}" data-b="${id}"><span class="lbl" style="font-size:2.4vmin">${LABELS[id]}</span></div>`).join('')}
    </div>`);
    ui.root.appendChild(node);
    const vmin = () => Math.min(window.innerWidth, window.innerHeight) / 100;
    const scale = settings.buttonScale || 1;
    const size = node.querySelector('[data-size]');
    const place = () => {
      node.querySelectorAll('[data-b]').forEach((b) => {
        const p = layout[b.dataset.b];
        Object.assign(b.style, { right: `${p.r}vmin`, bottom: `${p.b}vmin`, width: `${p.s * scale}vmin`, height: `${p.s * scale}vmin` });
        b.classList.toggle('down', b.dataset.b === selected);
      });
      node.querySelector('[data-selname]').textContent = LABELS[selected];
      size.value = layout[selected].s;
    };
    place();
    size.addEventListener('input', () => { layout[selected].s = Number(size.value); place(); });
    node.querySelectorAll('[data-b]').forEach((b) => {
      b.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        selected = b.dataset.b;
        b.setPointerCapture(e.pointerId);
        const start = { x: e.clientX, y: e.clientY, r: layout[selected].r, b: layout[selected].b };
        const move = (ev) => {
          const u = vmin();
          const max = { r: window.innerWidth / u - layout[selected].s * scale, b: window.innerHeight / u - layout[selected].s * scale };
          layout[selected].r = Math.max(0, Math.min(max.r, start.r - (ev.clientX - start.x) / u));
          layout[selected].b = Math.max(0, Math.min(max.b, start.b - (ev.clientY - start.y) / u));
          place();
        };
        const up = () => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerup', up); };
        b.addEventListener('pointermove', move);
        b.addEventListener('pointerup', up);
        place();
      });
    });
    onTap(node.querySelector('[data-cancel]'), () => node.remove());
    onTap(node.querySelector('[data-save]'), () => {
      settings.layout = layout;
      onSave();
      node.remove();
      ui.toast('Disposition enregistrée');
    });
  }
}
