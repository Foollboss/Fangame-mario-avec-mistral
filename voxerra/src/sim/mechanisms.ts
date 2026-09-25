/**
 * Mécanismes simples : leviers et plaques de pression alimentent les blocs
 * voisins (rayon 1) — lampes à lumirite allumées, portes ouvertes.
 */
import type { Sim } from './sim';
import type { World } from '../world/world';
import { Shape, makeCell } from '../registry/blocks';

const powerSource = (w: World, x: number, y: number, z: number): boolean => {
  const v = w.getBlock(x, y, z);
  const id = v & 0xfff;
  if (id === 0) return false;
  const sh = w.content.blocks.shape[id];
  if (sh === Shape.LEVER) return ((v >>> 12) & 8) !== 0;
  if (sh === Shape.PLATE) return ((v >>> 12) & 1) !== 0;
  return false;
};

/** Le bloc est-il alimenté par une source dans un cube 3x3x3 ? */
export function isPowered(w: World, x: number, y: number, z: number): boolean {
  for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) if ((dx || dy || dz) && powerSource(w, x + dx, y + dy, z + dz)) return true;
  return false;
}

/** Réévalue les composants (lampes, portes) autour d'une source. */
export function updatePowerAround(sim: Sim, w: World, x: number, y: number, z: number): void {
  const t = w.content.blocks;
  const on = t.tryNum('lampe_allumee'),
    off = t.tryNum('lampe_eteinte');
  for (let dx = -2; dx <= 2; dx++)
    for (let dy = -2; dy <= 2; dy++)
      for (let dz = -2; dz <= 2; dz++) {
        const bx = x + dx,
          by = y + dy,
          bz = z + dz;
        const v = w.getBlock(bx, by, bz);
        const id = v & 0xfff;
        if (id !== on && id !== off && t.shape[id] !== Shape.DOOR) continue;
        const powered = isPowered(w, bx, by, bz) || (t.shape[id] === Shape.DOOR && isPowered(w, bx, by + ((v >>> 12) & 8 ? -1 : 1), bz));
        if (id === off && powered) w.setBlock(bx, by, bz, on);
        else if (id === on && !powered) w.setBlock(bx, by, bz, off);
        else if (t.shape[id] === Shape.DOOR && (v >>> 12 & 8) === 0) {
          const meta = v >>> 12;
          const open = (meta & 4) !== 0;
          const isIron = !!(t.get(id).def.data as { powered?: boolean } | undefined)?.powered;
          if (!isIron && !powered) continue; // les portes en bois restent manuelles une fois refermées
          if (open !== powered) {
            const nm = powered ? meta | 4 : meta & ~4;
            w.setBlock(bx, by, bz, makeCell(id, nm));
            if ((w.getBlock(bx, by + 1, bz) & 0xfff) === id) w.setBlock(bx, by + 1, bz, makeCell(id, (nm & 7) | 8));
            sim.emit({ t: 'sound', id: powered ? 'porte_ouvre' : 'porte_ferme', x: bx, y: by, z: bz });
          }
        }
      }
}

export function toggleLever(sim: Sim, w: World, x: number, y: number, z: number): void {
  const v = w.getBlock(x, y, z);
  w.setBlock(x, y, z, makeCell(v & 0xfff, (v >>> 12) ^ 8));
  sim.emit({ t: 'sound', id: 'levier', x, y, z });
  updatePowerAround(sim, w, x, y, z);
}

/** Plaques de pression : enfoncées par les entités (appelé chaque tick). */
export function tickPlates(sim: Sim): void {
  const pressed = new Set<string>();
  for (const e of sim.entities.list) {
    if (e.removed || e.kind === 'projectile') continue;
    const w = sim.worldsByDim.get(e.dim);
    if (!w) continue;
    const x = Math.floor(e.x),
      y = Math.floor(e.y + 0.05),
      z = Math.floor(e.z);
    const v = w.getBlock(x, y, z);
    if (w.content.blocks.shape[v & 0xfff] !== Shape.PLATE) continue;
    pressed.add(`${e.dim}|${x}|${y}|${z}`);
    if (((v >>> 12) & 1) === 0) {
      w.setBlock(x, y, z, makeCell(v & 0xfff, 1));
      sim.emit({ t: 'sound', id: 'plaque', x, y, z });
      updatePowerAround(sim, w, x, y, z);
    }
  }
  // relâchement
  for (const k of [...activePlates]) {
    if (pressed.has(k)) continue;
    const [dim, xs, ys, zs] = k.split('|');
    const w = sim.worldsByDim.get(dim);
    activePlates.delete(k);
    if (!w) continue;
    const x = +xs,
      y = +ys,
      z = +zs;
    const v = w.getBlock(x, y, z);
    if (w.content.blocks.shape[v & 0xfff] === Shape.PLATE && (v >>> 12) & 1) {
      w.setBlock(x, y, z, makeCell(v & 0xfff, 0));
      updatePowerAround(sim, w, x, y, z);
    }
  }
  for (const k of pressed) activePlates.add(k);
}
const activePlates = new Set<string>();
