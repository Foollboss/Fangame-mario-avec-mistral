/** Fourneaux (cuisson avec combustible) et coffres à butin paresseux. */
import type { Sim } from './sim';
import { Container, type ItemStack } from '../inventory/inventory';
import type { BlockEntityData } from '../world/chunk';
import { Rng } from '../engine/rng';
import { rollTable } from './loot';
import { makeCell } from '../registry/blocks';

export interface FurnaceData extends BlockEntityData {
  type: 'furnace';
  slots: (ItemStack | null)[]; // 0 entrée, 1 combustible, 2 sortie
  burn: number;
  burnMax: number;
  cook: number;
  cookMax: number;
}

export interface ChestData extends BlockEntityData {
  type: 'chest';
  slots: (ItemStack | null)[];
  loot?: string;
  lootSeed?: number;
}

export function newFurnace(): FurnaceData {
  return { type: 'furnace', slots: [null, null, null], burn: 0, burnMax: 0, cook: 0, cookMax: 0 };
}

export function newChest(): ChestData {
  return { type: 'chest', slots: new Array(27).fill(null) };
}

export class FurnaceSystem {
  private active: { dim: string; x: number; y: number; z: number }[] = [];
  constructor(private sim: Sim) {}

  /** Recense les fourneaux des colonnes chargées (1 fois par seconde). */
  private refresh(): void {
    this.active = [];
    for (const [dim, w] of this.sim.worldsByDim)
      for (const c of w.chunks.values())
        for (const [i, d] of c.blockEntities)
          if (d.type === 'furnace') {
            this.active.push({ dim, x: c.cx * 16 + (i & 15), y: i >> 8, z: c.cz * 16 + ((i >> 4) & 15) });
          }
  }

  tick(): void {
    if (this.sim.tickCount % 20 === 0) this.refresh();
    const items = this.sim.content.items;
    const recipes = this.sim.content.recipes;
    for (const f of this.active) {
      const w = this.sim.world(f.dim);
      const d = w.getBlockEntity(f.x, f.y, f.z) as FurnaceData | undefined;
      if (!d || d.type !== 'furnace') continue;
      const [input, fuel, output] = d.slots;
      const smelt = input ? recipes.smeltResult(input.id) : null;
      const outCount = smelt?.count ?? 1;
      const canOut = !!smelt && (!output || (output.id === smelt.output && output.count + outCount <= (items.get(output.id)?.stackSize ?? 64)));
      let changed = false;
      if (d.burn > 0) {
        d.burn--;
        changed = true;
      }
      if (d.burn <= 0 && canOut && fuel) {
        const ft = items.fuelTime(fuel.id);
        if (ft > 0) {
          d.burn = d.burnMax = Math.round(ft * 20);
          fuel.count--;
          if (fuel.count <= 0) d.slots[1] = fuel.id === 'seau_lave' ? { id: 'seau', count: 1 } : null;
          changed = true;
        }
      }
      if (d.burn > 0 && canOut && smelt) {
        d.cookMax = Math.round((smelt.time ?? 8) * 20);
        d.cook++;
        if (d.cook >= d.cookMax) {
          d.cook = 0;
          input!.count--;
          if (input!.count <= 0) d.slots[0] = null;
          if (output) output.count += outCount;
          else d.slots[2] = { id: smelt.output, count: outCount };
        }
        changed = true;
      } else if (d.cook > 0) {
        d.cook = Math.max(0, d.cook - 2);
        changed = true;
      }
      // État allumé
      const cell = w.getBlock(f.x, f.y, f.z);
      const id = cell & 0xfff;
      const lit = w.content.blocks.tryNum('fourneau_allume');
      const unlit = w.content.blocks.tryNum('fourneau');
      if (d.burn > 0 && id === unlit) {
        w.setBlock(f.x, f.y, f.z, makeCell(lit, cell >>> 12), { silent: true });
        const be = w.getBlockEntity(f.x, f.y, f.z);
        if (!be) w.setBlockEntity(f.x, f.y, f.z, d);
      } else if (d.burn <= 0 && id === lit) {
        w.setBlock(f.x, f.y, f.z, makeCell(unlit, cell >>> 12), { silent: true });
        if (!w.getBlockEntity(f.x, f.y, f.z)) w.setBlockEntity(f.x, f.y, f.z, d);
      }
      if (changed) {
        const c = w.chunkAtBlock(f.x, f.z);
        if (c) c.dirty = true;
      }
    }
  }
}

/** Vue « conteneur » d'une entité de bloc (coffre ou fourneau). */
export function blockContainer(sim: Sim, data: FurnaceData | ChestData, onChange: () => void): Container {
  if (data.type === 'chest' && data.loot) {
    const table = sim.content.loot[data.loot];
    if (table) {
      const rng = new Rng(data.lootSeed ?? 1);
      const stacks = rollTable(table, rng);
      for (const s of stacks) {
        for (let tries = 0; tries < 10; tries++) {
          const i = rng.int(27);
          if (!data.slots[i]) {
            data.slots[i] = s;
            break;
          }
        }
      }
    }
    delete data.loot;
    delete data.lootSeed;
  }
  const c = new Container(data.slots.length, sim.content.items, data.slots);
  c.onChange = onChange;
  return c;
}
