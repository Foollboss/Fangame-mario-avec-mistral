/**
 * Blocs actifs : fours (combustible, cuisson en 10 s, expérience stockée, façade allumée)
 * et générateurs de monstres des donjons (apparitions périodiques près du joueur).
 */
import { B } from '../world/blocks';
import { ITEMS, ITEM_BY_KEY, maxStack, type ItemStack } from '../items/items';
import { smeltResult } from '../inventory/recipes';
import { MOB_DEFS } from '../entities/mobDefs';
import type { BlockEntity } from '../world/Chunk';
import type { Game } from './Game';

export const COOK_TIME = 200;

export interface FurnaceData extends BlockEntity {
  type: 'furnace';
  items: Array<ItemStack | null>;
  burn: number;
  burnMax: number;
  cook: number;
  xp: number;
}

/** Une étape de cuisson. Renvoie true si l'état « allumé » a changé. */
export function tickFurnace(f: FurnaceData): boolean {
  const wasLit = f.burn > 0;
  const [inp, fuel, out] = f.items;
  const r = smeltResult(inp);
  const res = r ? ITEM_BY_KEY.get(r.result) : undefined;
  const canSmelt = !!res && (!out || (out.id === res.id && out.count < maxStack(out)));
  if (f.burn > 0) f.burn--;
  if (f.burn <= 0 && canSmelt && fuel) {
    const v = ITEMS[fuel.id]?.fuel ?? 0;
    if (v > 0) {
      f.burn = f.burnMax = v;
      if (ITEMS[fuel.id]?.key === 'lava_bucket') f.items[1] = { id: ITEM_BY_KEY.get('bucket')!.id, count: 1 };
      else {
        fuel.count--;
        if (fuel.count <= 0) f.items[1] = null;
      }
    }
  }
  if (f.burn > 0 && canSmelt && res) {
    f.cook++;
    if (f.cook >= COOK_TIME) {
      f.cook = 0;
      if (out) out.count++;
      else f.items[2] = { id: res.id, count: 1 };
      inp!.count--;
      if (inp!.count <= 0) f.items[0] = null;
      f.xp += r!.xp;
    }
  } else if (f.cook > 0) f.cook = Math.max(0, f.cook - 2);
  return wasLit !== f.burn > 0;
}

export class BlockEntityTicker {
  constructor(private g: Game) {}

  tick(): void {
    const g = this.g;
    const w = g.world;
    const p = g.player;
    for (const c of g.chunks.chunks.values()) {
      if (!c.ready || c.blockEntities.size === 0) continue;
      for (const [k, be] of c.blockEntities) {
        const x = c.cx * 16 + (k & 15);
        const z = c.cz * 16 + ((k >> 4) & 15);
        const y = k >> 8;
        if (be.type === 'furnace') {
          const f = be as FurnaceData;
          if (!f.items) continue;
          if (f.burn <= 0 && !f.items[0] && f.cook === 0) continue;
          if (tickFurnace(f)) {
            const raw = w.raw(x, y, z);
            if ((raw & 1023) === B.furnace) {
              const meta = (raw >> 10) & 63;
              w.set(x, y, z, B.furnace, f.burn > 0 ? meta | 4 : meta & ~4, 'tick');
            }
          }
          c.modified = true;
          if (f.burn > 0 && Math.random() < 0.05) g.particles.smoke(x + 0.5, y + 1.05, z + 0.5);
        } else if (be.type === 'spawner') {
          const mob = String(be.mob ?? 'zombie');
          if (!MOB_DEFS[mob]) continue;
          const dx = p.pos.x - (x + 0.5);
          const dy = p.pos.y - y;
          const dz = p.pos.z - (z + 0.5);
          if (dx * dx + dy * dy + dz * dz > 16 * 16) continue;
          if (Math.random() < 0.3) g.particles.flame(x + Math.random(), y + Math.random(), z + Math.random());
          let delay = Number(be.delay ?? 200);
          if (--delay > 0) {
            be.delay = delay;
            continue;
          }
          be.delay = 200 + Math.floor(Math.random() * 600);
          if (g.meta.difficulty === 'peaceful' && MOB_DEFS[mob].kind === 'hostile') continue;
          const near = g.entities.near(g.tmpVec.set(x + 0.5, y, z + 0.5), 9).filter((e) => e.type === mob).length;
          if (near >= 6) continue;
          const n = 1 + Math.floor(Math.random() * 4);
          for (let i = 0; i < n; i++) {
            const sx = x + 0.5 + (Math.random() - 0.5) * 8;
            const sz = z + 0.5 + (Math.random() - 0.5) * 8;
            const sy = y + Math.floor(Math.random() * 3) - 1;
            const fx = Math.floor(sx);
            const fz = Math.floor(sz);
            if (w.def(fx, sy, fz).solid || w.def(fx, sy + 1, fz).solid || !w.def(fx, sy - 1, fz).solid) continue;
            const m = g.spawnMob(mob, sx, sy, sz, {});
            if (m) g.particles.puff(sx, sy + 0.5, sz, 0x404040, 8);
          }
        }
      }
    }
  }
}
