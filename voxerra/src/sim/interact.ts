/**
 * Actions du joueur sur le monde : minage (outils, niveaux, butin), pose de
 * blocs (orientation, dalles, portes, torches murales…), interactions (coffres,
 * portes, leviers, couchettes, autels), utilisation d'objets, combat.
 */
import type { Sim } from './sim';
import type { Player } from '../entity/player';
import type { RayHit } from '../physics/raycast';
import { Shape, FACE_DIRS, makeCell, LIQ_WATER } from '../registry/blocks';
import { bodyIntersectsBlock } from '../physics/collision';
import { rollEntries } from './loot';
import { newChest, newFurnace } from './furnace';
import type { LivingEntity } from '../entity/living';
import { Projectile } from '../entity/projectile';
import { lookDir } from '../engine/math';
import { tryIgnitePortal } from './portals';
import type { ItemInfo } from '../registry/items';
import { toggleLever, updatePowerAround } from './mechanisms';

export const REACH = 5;
export const CREATIVE_REACH = 7;

/** Direction horizontale du regard : 0 sud (+Z), 1 ouest (−X), 2 nord (−Z), 3 est (+X). */
export function lookFacing(yaw: number): number {
  const k = (((Math.round(yaw / (Math.PI / 2)) % 4) + 4) % 4) as 0 | 1 | 2 | 3;
  return [2, 1, 0, 3][k];
}

function heldInfo(sim: Sim, p: Player): ItemInfo | undefined {
  const h = p.inventory.held;
  return h ? sim.content.items.get(h.id) : undefined;
}

/** L'outil tenu permet-il de récolter ce bloc ? */
export function canHarvest(sim: Sim, p: Player, cell: number): boolean {
  const info = sim.content.blocks.get(cell & 0xfff);
  const it = heldInfo(sim, p);
  const needsTool = info.tool === 'pickaxe' || info.level > 0;
  if (!needsTool) return true;
  return !!it?.tool && it.tool.type === info.tool && it.tool.tier >= info.level;
}

/** Durée de minage en secondes (Infinity si incassable). */
export function breakTime(sim: Sim, p: Player, cell: number): number {
  const info = sim.content.blocks.get(cell & 0xfff);
  if (info.hardness < 0) return p.creative ? 0 : Infinity;
  if (p.creative) return 0;
  if (info.hardness === 0) return 0.05;
  const it = heldInfo(sim, p);
  let speed = 1;
  if (it?.tool) {
    if (it.tool.type === info.tool) speed = it.tool.speed;
    else if (it.tool.type === 'sword' && (info.tags.has('leaves') || info.id === 'toile')) speed = 12;
    else if (it.tool.type === 'shears' && (info.tags.has('leaves') || info.tags.has('cloth') || info.tool === 'shears')) speed = 10;
  }
  let t = (info.hardness * (canHarvest(sim, p, cell) ? 1.5 : 5)) / speed;
  if (p.body.headInWater) t *= 4;
  if (!p.body.onGround && !p.flying && !p.body.onLadder) t *= 3;
  if (p.hasEffect('faiblesse')) t *= 1.5;
  if (p.bodyTemp < -0.6) t *= 1.3;
  return t;
}

function consumeDurability(sim: Sim, p: Player, n: number): void {
  if (p.creative) return;
  if (p.inventory.damageHeld(n)) sim.emit({ t: 'sound', id: 'outil_casse', x: p.x, y: p.y, z: p.z });
}

/** Casse un bloc (appelé quand la progression de minage est terminée). */
export function digBlock(sim: Sim, p: Player, x: number, y: number, z: number): boolean {
  const w = sim.world(p.dim);
  const t = sim.content.blocks;
  const cell = w.getBlock(x, y, z);
  const id = cell & 0xfff;
  if (id === 0 || t.liquid[id]) return false;
  const info = t.get(id);
  if (info.hardness < 0 && !p.creative) return false;
  if (p.distTo(x + 0.5, y + 0.5 - p.eye, z + 0.5) > (p.creative ? CREATIVE_REACH : REACH) + 1.5) return false;
  const meta = cell >>> 12;
  // Portes : les deux moitiés
  if (info.shape === Shape.DOOR) {
    const oy = meta & 8 ? y - 1 : y + 1;
    if ((w.getBlock(x, oy, z) & 0xfff) === id) w.setBlock(x, oy, z, 0, { silent: true });
  }
  // Glace : devient de l'eau si le dessous n'est pas vide
  const becomes = id === t.tryNum('glace') && !p.creative && t.solid[w.getId(x, y - 1, z)] ? t.tryNum('eau') : 0;
  w.setBlock(x, y, z, becomes);
  sim.emit({ t: 'blockBreakFx', x, y, z, cell });
  // Contenu des coffres / fourneaux
  const be = w.getBlockEntity(x, y, z);
  if (be && Array.isArray((be as { slots?: unknown }).slots))
    for (const s of (be as unknown as { slots: ({ id: string; count: number } | null)[] }).slots) if (s) sim.spawnItem(p.dim, x + 0.5, y + 0.5, z + 0.5, s);
  if (!p.creative) {
    const it = heldInfo(sim, p);
    if (canHarvest(sim, p, cell)) {
      let drops = info.drops.filter((d) => (d.minStage === undefined || meta >= d.minStage) && (d.maxStage === undefined || meta <= d.maxStage));
      drops = drops.filter((d) => !d.tool || it?.tool?.type === d.tool);
      // Cisailles : le bloc lui-même (feuilles, lianes)
      if (it?.tool?.type === 'shears' && info.tool === 'shears' && info.def.item !== false) drops = [{ item: info.id }];
      for (const s of rollEntries(drops, sim.rng)) sim.spawnItem(p.dim, x + 0.5, y + 0.3, z + 0.5, s);
    }
    if (it?.tool) consumeDurability(sim, p, it.tool.type === 'sword' ? 2 : 1);
    p.exhaust(0.005);
  }
  p.stat('blocs_casses');
  sim.trigger(p, 'break', { block: info.id });
  if (info.shape === Shape.LEVER) updatePowerAround(sim, w, x, y, z);
  return true;
}

/** Pose le bloc de l'objet tenu contre la face visée. */
export function placeBlock(sim: Sim, p: Player, hit: RayHit): boolean {
  const held = p.inventory.held;
  if (!held) return false;
  const it = sim.content.items.get(held.id);
  if (!it || !it.blockNum) return false;
  const w = sim.world(p.dim);
  const t = sim.content.blocks;
  let id = it.blockNum;
  const info = t.get(id);
  const hitCell = w.getBlock(hit.x, hit.y, hit.z);
  const hitId = hitCell & 0xfff;
  // Dalle sur dalle identique → bloc plein
  if (info.shape === Shape.SLAB && hitId === id) {
    const m = hitCell >>> 12;
    if ((m === 0 && hit.face === 2) || (m === 1 && hit.face === 3)) {
      const base = t.tryNum(info.id.replace(/_dalle$/, ''));
      if (base) {
        w.setBlock(hit.x, hit.y, hit.z, base);
        afterPlace(sim, p, hit.x, hit.y, hit.z, id);
        return true;
      }
    }
  }
  let x = hit.x,
    y = hit.y,
    z = hit.z;
  if (!(t.replaceable[hitId] && !t.liquid[hitId] && hitId !== id)) {
    const [dx, dy, dz] = FACE_DIRS[hit.face];
    x += dx;
    y += dy;
    z += dz;
  }
  const maxY = p.dim === 'abime' ? 127 : 255;
  if (y < 0 || y > maxY) return false;
  const cur = w.getBlock(x, y, z);
  const curId = cur & 0xfff;
  if (curId !== 0 && !t.replaceable[curId]) {
    // Compléter une dalle adjacente
    if (info.shape === Shape.SLAB && curId === id) {
      const base = t.tryNum(info.id.replace(/_dalle$/, ''));
      if (base) {
        w.setBlock(x, y, z, base);
        afterPlace(sim, p, x, y, z, id);
        return true;
      }
    }
    return false;
  }
  const facing = lookFacing(p.yaw);
  let meta = 0;
  const hy = hit.py - hit.y; // hauteur relative du point touché
  switch (info.shape) {
    case Shape.STAIRS:
      meta = facing | (hit.face === 3 || (hit.face !== 2 && hy > 0.5) ? 4 : 0);
      break;
    case Shape.SLAB:
      meta = hit.face === 3 || (hit.face !== 2 && hy > 0.5) ? 1 : 0;
      break;
    case Shape.TORCH:
      if (hit.face === 3) return false;
      meta = [2, 1, 0, 0, 4, 3][hit.face];
      if (hit.face === 2) meta = 0;
      if (meta !== 0 && !t.solid[hitId]) return false;
      if (meta === 0 && !t.solid[w.getId(x, y - 1, z)]) return false;
      break;
    case Shape.LADDER:
      if (hit.face === 2 || hit.face === 3) return false;
      meta = [1, 0, 0, 0, 3, 2][hit.face];
      if (!t.solid[hitId]) return false;
      break;
    case Shape.DOOR: {
      if (w.getId(x, y + 1, z) !== 0 && !t.replaceable[w.getId(x, y + 1, z)]) return false;
      if (!t.solid[w.getId(x, y - 1, z)]) return false;
      meta = facing;
      break;
    }
    case Shape.CHEST:
      meta = (facing + 2) % 4;
      break;
    default:
      if (t.orient[id]) meta = (facing + 2) % 4;
  }
  // Supports
  if (info.shape === Shape.CROSS || info.shape === Shape.CARPET || info.shape === Shape.PLATE || info.shape === Shape.LEVER || info.shape === Shape.CACTUS) {
    const below = w.getId(x, y - 1, z);
    if (info.def.placeOn && !info.def.placeOn.some((tag) => t.hasTag(below, tag)) && below !== id) return false;
    if (!t.solid[below] && below !== id) return false;
  }
  // Collision avec les entités
  if (t.solid[id]) {
    for (const e of sim.entities.near(p.dim, x + 0.5, y + 0.5, z + 0.5, 3)) {
      if (e.kind === 'item' || e.kind === 'projectile') continue;
      if (bodyIntersectsBlock(e.body, x, y, z)) return false;
    }
  }
  w.setBlock(x, y, z, makeCell(id, meta));
  if (info.shape === Shape.DOOR) w.setBlock(x, y + 1, z, makeCell(id, meta | 8));
  // Entités de bloc
  if (info.interact === 'chest') w.setBlockEntity(x, y, z, newChest());
  else if (info.interact === 'furnace') w.setBlockEntity(x, y, z, newFurnace());
  if (t.hasTag(id, 'lamp')) updatePowerAround(sim, w, x, y, z);
  afterPlace(sim, p, x, y, z, id);
  return true;
}

function afterPlace(sim: Sim, p: Player, x: number, y: number, z: number, id: number): void {
  const info = sim.content.blocks.get(id);
  sim.emit({ t: 'sound', id: 'pose_' + info.sound, x: x + 0.5, y: y + 0.5, z: z + 0.5 });
  if (!p.creative) p.inventory.consumeHeld(1);
  p.stat('blocs_poses');
  sim.trigger(p, 'place', { block: info.id });
}

export type InteractResult = { ui: 'chest' | 'furnace' | 'craft' | 'forge'; x: number; y: number; z: number } | { done: true } | null;

/** Clic droit sur un bloc interactif. */
export function interactBlock(sim: Sim, p: Player, hit: RayHit): InteractResult {
  const w = sim.world(p.dim);
  const t = sim.content.blocks;
  const cell = w.getBlock(hit.x, hit.y, hit.z);
  const id = cell & 0xfff;
  const info = t.get(id);
  const meta = cell >>> 12;
  const { x, y, z } = hit;
  switch (info.interact) {
    case 'craft':
      return { ui: 'craft', x, y, z };
    case 'craft_forge':
      return { ui: 'forge', x, y, z };
    case 'chest':
      if (!w.getBlockEntity(x, y, z)) w.setBlockEntity(x, y, z, newChest());
      sim.emit({ t: 'sound', id: 'coffre_ouvre', x, y, z });
      return { ui: 'chest', x, y, z };
    case 'furnace':
      if (!w.getBlockEntity(x, y, z)) w.setBlockEntity(x, y, z, newFurnace());
      return { ui: 'furnace', x, y, z };
    case 'door': {
      const nm = meta ^ 4;
      w.setBlock(x, y, z, makeCell(id, nm));
      const oy = meta & 8 ? y - 1 : y + 1;
      if ((w.getBlock(x, oy, z) & 0xfff) === id) w.setBlock(x, oy, z, makeCell(id, (nm & 7) | (meta & 8 ? 0 : 8)));
      sim.emit({ t: 'sound', id: nm & 4 ? 'porte_ouvre' : 'porte_ferme', x, y, z });
      return { done: true };
    }
    case 'lever':
      toggleLever(sim, w, x, y, z);
      return { done: true };
    case 'harvest': {
      if (meta >= 1) {
        const d = info.def.data as { harvest: string; count: [number, number] };
        sim.spawnItem(p.dim, x + 0.5, y + 0.6, z + 0.5, { id: d.harvest, count: sim.rng.range(d.count[0], d.count[1]) });
        w.setBlock(x, y, z, makeCell(id, 0));
        sim.emit({ t: 'sound', id: 'cueillette', x, y, z });
        return { done: true };
      }
      return null;
    }
    case 'bed': {
      p.spawn = { dim: p.dim, x: x + 0.5, y: y + 1, z: z + 0.5 };
      if (sim.env.isNight && p.dim === 'surface') {
        const hostile = sim.entities.near(p.dim, x, y, z, 10, (e) => e.kind === 'mob' && (e as unknown as { hostile: boolean }).hostile);
        if (hostile.length > 0) {
          sim.emit({ t: 'msg', text: 'Impossible de dormir : des créatures rôdent à proximité.', color: '#ff8080', to: p.id });
          return { done: true };
        }
        sim.env.skipNight();
        p.stat('nuits_dormies');
        sim.emit({ t: 'msg', text: 'Vous avez dormi jusqu’au matin. Point de réapparition défini.', color: '#ffe080', to: p.id });
      } else sim.emit({ t: 'msg', text: 'Point de réapparition défini.', color: '#ffe080', to: p.id });
      return { done: true };
    }
    case 'altar_astral': {
      const held = p.inventory.held;
      if (held?.id === 'cle_astrale' || (meta & 1) === 1) {
        if ((meta & 1) === 0) {
          w.setBlock(x, y, z, makeCell(id, 1));
          sim.emit({ t: 'msg', text: 'L’autel astral s’éveille…', color: '#b08aff', to: p.id });
        }
        sim.requestTravel(p, p.dim === 'astral' ? 'surface' : 'astral', { x, y, z });
        return { done: true };
      }
      sim.emit({ t: 'msg', text: 'L’autel semble attendre une clé astrale.', color: '#b08aff', to: p.id });
      return { done: true };
    }
    case 'summon': {
      const d = info.def.data as { offering: string; creature: string };
      const held = p.inventory.held;
      if (held?.id === d.offering) {
        if (sim.summonBoss(d.creature, p.dim, x + 0.5, y + 2, z + 0.5, p)) {
          if (!p.creative) p.inventory.consumeHeld(1);
        }
      } else {
        const name = sim.content.items.name(d.offering);
        sim.emit({ t: 'msg', text: `L’autel réclame : ${name}.`, color: '#ffd080', to: p.id });
      }
      return { done: true };
    }
  }
  return null;
}

/** Bloc interactif (clic droit capturé) ? */
export function isInteractive(sim: Sim, cell: number): boolean {
  return !!sim.content.blocks.get(cell & 0xfff).interact;
}

/**
 * Utilisation instantanée de l'objet tenu. Renvoie :
 * 'done' si l'action a eu lieu, 'hold' si l'action nécessite de maintenir, null sinon.
 */
export function useItem(sim: Sim, p: Player, hit: RayHit | null, liquidHit: RayHit | null): 'done' | 'hold' | null {
  const held = p.inventory.held;
  if (!held) return null;
  const it = sim.content.items.get(held.id);
  if (!it) return null;
  const w = sim.world(p.dim);
  const t = sim.content.blocks;
  // Nourriture / élixirs
  if (it.food) {
    const isDrink = !!it.food.returns;
    if (p.energy >= 20 && !isDrink && !p.creative) return null;
    return 'hold';
  }
  if (it.ranged?.ammo) return 'hold';
  if (it.shield) return 'hold';
  if (it.use === 'recall') return 'hold';
  if (it.ranged && !it.ranged.ammo) {
    if (p.attackCooldown > 0) return null;
    fireProjectile(sim, p, it.ranged.projectile, it.ranged.damage, it.ranged.speed, it.weapon?.element);
    p.attackCooldown = it.ranged.cooldown;
    p.attackCooldownMax = it.ranged.cooldown;
    consumeDurability(sim, p, it.ranged.durabilityCost ?? 1);
    return 'done';
  }
  if (it.throwable) {
    fireProjectile(sim, p, it.throwable.projectile, 0, it.throwable.speed);
    if (!p.creative) p.inventory.consumeHeld(1);
    return 'done';
  }
  if (it.use === 'bucket' && liquidHit) {
    const cell = w.getBlock(liquidHit.x, liquidHit.y, liquidHit.z);
    const lid = cell & 0xfff;
    if (t.liquid[lid] && cell >>> 12 === 0) {
      w.setBlock(liquidHit.x, liquidHit.y, liquidHit.z, 0);
      const filled = t.liquid[lid] === LIQ_WATER ? 'seau_eau' : 'seau_lave';
      if (!p.creative) {
        p.inventory.consumeHeld(1);
        const rest = p.inventory.give({ id: filled, count: 1 });
        if (rest) sim.spawnItem(p.dim, p.x, p.y + 1, p.z, rest, false);
      }
      sim.emit({ t: 'sound', id: 'seau_remplit', x: p.x, y: p.y, z: p.z });
      return 'done';
    }
    return null;
  }
  if (!hit) return null;
  const [dx, dy, dz] = FACE_DIRS[hit.face];
  const tx = hit.x + dx,
    ty = hit.y + dy,
    tz = hit.z + dz;
  if (it.use === 'bucket_place') {
    const bid = t.tryNum(String(it.useData?.block));
    const cur = w.getId(tx, ty, tz);
    if (cur !== 0 && !t.replaceable[cur]) return null;
    if (p.dim === 'abime' && t.liquid[bid] === LIQ_WATER) {
      sim.emit({ t: 'particles', kind: 'fumee', x: tx + 0.5, y: ty + 0.5, z: tz + 0.5, n: 12 });
      sim.emit({ t: 'sound', id: 'grésillement', x: tx, y: ty, z: tz });
    } else w.setBlock(tx, ty, tz, bid);
    if (!p.creative) {
      p.inventory.consumeHeld(1);
      p.inventory.give({ id: 'seau', count: 1 });
    }
    sim.emit({ t: 'sound', id: 'seau_vide', x: tx, y: ty, z: tz });
    return 'done';
  }
  if (it.use === 'plant' && hit.face === 2) {
    const on = t.tryNum(String(it.useData?.on));
    if (w.getId(hit.x, hit.y, hit.z) !== on || w.getId(tx, ty, tz) !== 0) return null;
    w.setBlock(tx, ty, tz, t.tryNum(String(it.useData?.block)));
    if (!p.creative) p.inventory.consumeHeld(1);
    sim.emit({ t: 'sound', id: 'pose_plant', x: tx, y: ty, z: tz });
    return 'done';
  }
  if (it.tool?.type === 'hoe' && hit.face !== 3) {
    const id = w.getId(hit.x, hit.y, hit.z);
    const tilled = t.tryNum('terre_labouree');
    if ((id === t.tryNum('terre') || id === t.tryNum('herbe')) && w.getId(hit.x, hit.y + 1, hit.z) === 0) {
      w.setBlock(hit.x, hit.y, hit.z, tilled);
      consumeDurability(sim, p, 1);
      sim.emit({ t: 'sound', id: 'pose_dirt', x: hit.x, y: hit.y, z: hit.z });
      return 'done';
    }
    return null;
  }
  if (it.use === 'ignite') {
    if (tryIgnitePortal(sim, w, tx, ty, tz)) {
      consumeDurability(sim, p, 1);
      sim.emit({ t: 'sound', id: 'portail_allume', x: tx, y: ty, z: tz });
      sim.trigger(p, 'portal_lit', { dim: 'abime' });
      return 'done';
    }
    return null;
  }
  return null;
}

/** Fin d'une utilisation maintenue (manger, tirer à l'arc, rappel). */
export function finishUse(sim: Sim, p: Player, held: number): void {
  const use = p.using;
  if (!use) return;
  const s = p.inventory.slots[use.slot];
  p.using = null;
  if (!s) return;
  const it = sim.content.items.get(s.id);
  if (!it) return;
  if (it.food && held >= use.total) {
    eat(sim, p, it);
    if (!p.creative) {
      s.count--;
      if (s.count <= 0) p.inventory.slots[use.slot] = null;
      if (it.food.returns) {
        const r = p.inventory.give({ id: it.food.returns, count: 1 });
        if (r) sim.spawnItem(p.dim, p.x, p.y + 1, p.z, r, false);
      }
      p.inventory.changed();
    }
  } else if (it.ranged?.ammo) {
    const charge = Math.min(1, held / (it.ranged.charge ?? 1));
    if (charge < 0.15) return;
    if (!p.creative && p.inventory.count(it.ranged.ammo) <= 0) {
      sim.emit({ t: 'msg', text: 'Plus de flèches !', color: '#ff8080', to: p.id });
      return;
    }
    if (!p.creative) p.inventory.remove(it.ranged.ammo, 1);
    fireProjectile(sim, p, it.ranged.projectile, it.ranged.damage * charge, it.ranged.speed * (0.4 + 0.6 * charge), undefined, charge >= 1);
    consumeDurability(sim, p, 1);
  } else if (it.use === 'recall' && held >= use.total) {
    const sp = p.spawn ?? { dim: 'surface', ...(sim.meta.spawn ?? { x: 0, y: 100, z: 0 }) };
    sim.requestTravel(p, sp.dim, { x: sp.x, y: sp.y, z: sp.z }, true);
    sim.emit({ t: 'sound', id: 'rappel', x: p.x, y: p.y, z: p.z });
  }
}

export function useDuration(sim: Sim, p: Player): number {
  const s = p.inventory.held;
  const it = s ? sim.content.items.get(s.id) : undefined;
  if (!it) return 0;
  if (it.food) return it.food.returns ? 1.2 : 1.6;
  if (it.use === 'recall') return 3;
  if (it.ranged?.ammo) return 60;
  if (it.shield) return 3600;
  return 0;
}

export function eat(sim: Sim, p: Player, it: ItemInfo): void {
  const f = it.food!;
  p.energy = Math.min(20, p.energy + f.energy);
  p.saturation = Math.min(p.energy, p.saturation + (f.saturation ?? f.energy * 0.6));
  if (f.heal) p.heal(f.heal);
  for (const e of f.effects ?? []) {
    if (e.chance !== undefined && !sim.rng.chance(e.chance)) continue;
    if (e.id === 'vitalite') {
      if (p.vitality < 3) {
        p.vitality++;
        p.updateMaxHealth();
        p.heal(4);
        sim.emit({ t: 'msg', text: `Vitalité accrue ! (${p.vitality}/3)`, color: '#5ad84a', to: p.id });
      }
      continue;
    }
    p.addEffect(e.id, e.duration, e.level ?? 0);
  }
  sim.emit({ t: 'sound', id: it.food?.returns ? 'boire' : 'manger', x: p.x, y: p.y, z: p.z });
  p.stat('repas');
  sim.trigger(p, 'eat', { item: it.id });
}

export function fireProjectile(sim: Sim, p: Player, type: string, damage: number, speed: number, element?: 'fire' | 'frost' | 'poison' | 'shock', crit = false): Projectile {
  const d = lookDir(p.yaw, p.pitch);
  const pr = new Projectile(type, p, damage, element);
  pr.dim = p.dim;
  pr.setPos(p.x + d.x * 0.4, p.y + p.eye - 0.1 + d.y * 0.4, p.z + d.z * 0.4);
  pr.body.vx = d.x * speed + p.body.vx * 0.5;
  pr.body.vy = d.y * speed;
  pr.body.vz = d.z * speed + p.body.vz * 0.5;
  pr.crit = crit;
  sim.entities.add(pr);
  sim.emit({ t: 'sound', id: 'tir_' + type, x: p.x, y: p.y + 1.5, z: p.z });
  return pr;
}

/** Attaque au corps à corps. */
export function attackEntity(sim: Sim, p: Player, target: LivingEntity): void {
  if (target.dead || p.dead) return;
  const it = heldInfo(sim, p);
  const charge = Math.max(0, Math.min(1, 1 - p.attackCooldown / Math.max(0.01, p.attackCooldownMax)));
  let dmg = (it?.weapon?.damage ?? 1) * (0.2 + 0.8 * charge * charge);
  const crit = charge > 0.9 && !p.body.onGround && p.body.vy < 0 && !p.body.inWater && !p.body.onLadder;
  if (crit) dmg *= 1.5;
  if (p.hasEffect('faiblesse')) dmg *= 0.6;
  if (p.bodyTemp < -0.6) dmg *= 0.85;
  const kb = (it?.weapon?.knockback ?? 1) * (p.sprinting ? 1.6 : 1) * (0.3 + 0.7 * charge);
  const element = charge > 0.5 ? it?.weapon?.element : undefined;
  const done = target.damage(dmg, { type: 'melee', attacker: p, knockback: kb, element, crit });
  if (done > 0) {
    sim.emit({ t: 'hurt', id: target.id, amount: done });
    if (crit) sim.emit({ t: 'particles', kind: 'crit', x: target.x, y: target.y + target.body.h * 0.7, z: target.z, n: 10 });
    sim.emit({ t: 'sound', id: crit ? 'coup_critique' : 'coup', x: target.x, y: target.y + 1, z: target.z });
    // Balayage de l'épée
    if (it?.weapon?.sweep && charge > 0.9 && p.body.onGround && !p.sprinting) {
      for (const e of sim.entities.near(p.dim, target.x, target.y, target.z, 1.6, (e) => e !== target && e !== p && e.kind === 'mob')) {
        (e as LivingEntity).damage(1 + dmg * 0.25, { type: 'melee', attacker: p, knockback: 0.5 });
      }
      sim.emit({ t: 'particles', kind: 'balayage', x: target.x, y: target.y + 1, z: target.z, n: 1 });
    }
    if (it?.tool) consumeDurability(sim, p, it.tool.type === 'sword' ? 1 : 2);
    p.exhaust(0.1);
    p.stat('degats_infliges', done);
    if (target.dead) {
      p.stat('creatures_tuees');
      sim.trigger(p, 'kill', { creature: (target as unknown as { type: string }).type });
    }
  } else sim.emit({ t: 'sound', id: 'coup_rate', x: target.x, y: target.y + 1, z: target.z, vol: 0.4 });
  p.attackCooldownMax = it?.weapon?.cooldown ?? 0.4;
  p.attackCooldown = p.attackCooldownMax;
  p.swing = 1;
  sim.emit({ t: 'swing', id: p.id });
}

/** Lâche l'objet tenu (tout ou un seul). */
export function dropHeld(sim: Sim, p: Player, all: boolean): void {
  const s = p.inventory.held;
  if (!s) return;
  const taken = p.inventory.take(p.inventory.selected, all ? s.count : 1);
  if (!taken) return;
  throwStack(sim, p, taken);
}

export function throwStack(sim: Sim, p: Player, s: { id: string; count: number }): void {
  const d = lookDir(p.yaw, p.pitch);
  const e = sim.spawnItem(p.dim, p.x, p.y + p.eye - 0.3, p.z, s, false);
  if (e) {
    e.body.vx = d.x * 5;
    e.body.vy = d.y * 5 + 2;
    e.body.vz = d.z * 5;
    e.pickupDelay = 1.5;
    e.thrower = p.id;
  }
}

/** Esquive : bond rapide avec brève invulnérabilité. */
export function dodge(sim: Sim, p: Player, fx: number, fz: number): boolean {
  if (p.dodgeCooldown > 0 || p.dead || !p.body.onGround || p.energy < 3) return false;
  let dx = fx,
    dz = fz;
  if (Math.hypot(dx, dz) < 0.1) {
    dx = Math.sin(p.yaw);
    dz = Math.cos(p.yaw);
  }
  const l = Math.hypot(dx, dz);
  p.body.vx = (dx / l) * 13;
  p.body.vz = (dz / l) * 13;
  p.body.vy = 3.5;
  p.invuln = Math.max(p.invuln, 0.35);
  p.dodgeCooldown = 1.1;
  p.exhaust(1.5);
  sim.emit({ t: 'sound', id: 'esquive', x: p.x, y: p.y, z: p.z });
  sim.emit({ t: 'particles', kind: 'poussiere', x: p.x, y: p.y + 0.1, z: p.z, n: 6 });
  return true;
}
