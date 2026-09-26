import { el, esc, onTap, bindAll } from '../dom.js';
import { RARITY, ITEM_BY_ID } from '../../config/ItemCatalog.js';
import { VEHICLES, vehicleStatBars } from '../../config/VehicleCatalog.js';

function swatch(it) {
  const d = it.data || {};
  if (d.color) return d.color;
  if (d.colors) return `linear-gradient(90deg, ${d.colors.join(',')})`;
  if (d.rim) return `radial-gradient(circle, ${d.rim} 35%, #111 40%)`;
  if (it.cat === 'finish') return d.holo ? 'linear-gradient(90deg,#ff6ad5,#8a6bff,#5ae2ff,#7dffb0)' : d.metalness > 0.9 ? 'linear-gradient(135deg,#fff,#777,#eee)' : d.metalness > 0.5 ? 'linear-gradient(135deg,#b3122e,#ff6b7f,#7a0a1d)' : '#8a1022';
  if (it.cat === 'car') return 'linear-gradient(135deg,#19e3ff,#ff3dd8)';
  if (it.cat === 'engine') return 'repeating-linear-gradient(90deg,#19e3ff 0 3px,transparent 3px 7px)';
  return 'rgba(255,255,255,0.08)';
}

// Garage : choix du véhicule et de tous les cosmétiques, aperçu 3D en direct.
export class GarageScreen {
  constructor(ui) {
    this.ui = ui;
    this.game = ui.game;
    this.cat = 'car';
    this.node = el(`<div class="screen garage">
      <div class="side">
        ${ui.header('Garage')}
        <div class="tabs"></div>
        <div class="scroll"><div class="items"></div></div>
      </div>
      <div class="side" style="justify-content:flex-end;align-items:flex-end;width:auto">
        <div class="panel" data-info style="width:min(40vw,300px)"></div>
      </div>
    </div>`);
    ui.bindBack(this.node);
    this.game.setMenuView('garage');
    this.render();
  }

  render() {
    const c = this.game.custom;
    const tabs = this.node.querySelector('.tabs');
    tabs.innerHTML = c.categories().map((k) => {
      const hasNew = c.itemsOf(k.id).some((it) => c.isNew(it.id));
      return `<button data-cat="${k.id}" class="${k.id === this.cat ? 'sel' : ''}">${k.label}${hasNew ? '<i class="dot"></i>' : ''}</button>`;
    }).join('');
    bindAll(tabs, '[data-cat]', (b) => { this.cat = b.dataset.cat; this.ui.sfx(); this.render(); });

    const items = this.node.querySelector('.items');
    const eq = c.loadout[this.cat];
    items.innerHTML = c.itemsOf(this.cat).filter((it) => it.level < 99 || c.isUnlocked(it.id)).map((it) => {
      const un = c.isUnlocked(it.id);
      const r = RARITY[it.rarity];
      return `<div class="item ${it.id === eq ? 'sel' : ''} ${un ? '' : 'locked'}" data-id="${it.id}" style="border-bottom-color:${r.color}">
        <div class="sw" style="background:${swatch(it)}"></div>
        ${un ? (c.isNew(it.id) ? '<span class="new">NEW</span>' : '') : `<span class="lock">🔒 NV ${it.level}</span>`}
        <div class="nm">${esc(it.name)}</div>
        <div class="rar" style="color:${r.color}">${r.label}</div>
      </div>`;
    }).join('');
    bindAll(items, '[data-id]', (n) => {
      const it = ITEM_BY_ID[n.dataset.id];
      if (!c.isUnlocked(it.id)) {
        this.ui.toast(it.level >= 99 ? 'Remportez la Coupe Or pour le débloquer' : `Débloqué au niveau ${it.level}`);
        return;
      }
      c.equip(it.id);
      this.ui.sfx();
      if (it.cat === 'engine') this.game.audio.setEngine(it.data);
      this.game.refreshMenuCar();
      this.render();
    });
    this.info();
  }

  info() {
    const box = this.node.querySelector('[data-info]');
    const vid = this.game.garage.vehicleId;
    const v = VEHICLES[vid];
    box.innerHTML = `<div style="font-size:22px;font-weight:900;font-style:italic">${v.name}</div>
      <div class="muted small" style="margin-bottom:6px">${v.tagline}</div>
      <div class="stats-bars">${vehicleStatBars(vid).map(([k, val]) => `<div><span>${k}</span><i style="--w:${val}%"></i></div>`).join('')}</div>
      <p class="muted small" style="margin:8px 0 0">Les cosmétiques n'ont aucun effet sur les performances.</p>`;
  }

  destroy() { this.game.setMenuView('menu'); }
}
