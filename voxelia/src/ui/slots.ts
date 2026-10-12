/** Affichage commun d'une pile d'objets dans une case (icône, quantité, usure) et infobulle. */
import { h } from './dom';
import { ITEMS, itemName, type ItemStack } from '../items/items';
import type { ItemIcons } from '../render/ItemIcons';

export function drawStack(el: HTMLElement, s: ItemStack | null, icons: ItemIcons): void {
  el.querySelectorAll('.item-img, .item-count, .item-dur').forEach((x) => x.remove());
  if (!s) return;
  el.appendChild(h('div', { class: 'item-img', style: `background-image:url(${icons.get(s.id, s.data)})` }));
  if (s.count > 1) el.appendChild(h('div', { class: 'item-count' }, String(s.count)));
  const dur = ITEMS[s.id]?.tool?.durability ?? ITEMS[s.id]?.armor?.durability;
  if (dur && s.damage) {
    const f = Math.max(0, 1 - s.damage / dur);
    el.appendChild(h('div', { class: 'item-dur' }, h('div', { style: `width:${f * 100}%;background:hsl(${f * 120},90%,50%)` })));
  }
}

export function stackSignature(s: ItemStack | null): string {
  return s ? `${s.id}:${s.count}:${s.damage ?? 0}` : '-';
}

let tip: HTMLElement | null = null;

/** Infobulle (souris) : nom, rareté, usure, description. */
export function showTooltip(s: ItemStack | null, x: number, y: number, extra?: string): void {
  hideTooltip();
  if (!s && !extra) return;
  const def = s ? ITEMS[s.id] : undefined;
  const lines: HTMLElement[] = [];
  if (s) lines.push(h('div', { class: 'tt-name' }, itemName(s)));
  const dur = def?.tool?.durability ?? def?.armor?.durability;
  if (s && dur) lines.push(h('div', { class: 'sub' }, `Durabilité : ${dur - (s.damage ?? 0)} / ${dur}`));
  if (def?.tool) lines.push(h('div', { class: 'sub' }, `Dégâts d’attaque : ${def.tool.damage}`));
  if (def?.armor) lines.push(h('div', { class: 'sub' }, `Armure : +${def.armor.points}`));
  if (def?.food) lines.push(h('div', { class: 'sub' }, `Nourriture : +${def.food.hunger}`));
  if (def?.desc) lines.push(h('div', { class: 'sub' }, def.desc));
  if (extra) lines.push(h('div', { class: 'sub' }, extra));
  tip = h('div', { class: 'tooltip ' + (def?.rarity ?? '') }, ...lines);
  document.body.appendChild(tip);
  const r = tip.getBoundingClientRect();
  tip.style.left = Math.min(window.innerWidth - r.width - 4, x + 14) + 'px';
  tip.style.top = Math.max(4, y - r.height - 6) + 'px';
}

export function hideTooltip(): void {
  tip?.remove();
  tip = null;
}
