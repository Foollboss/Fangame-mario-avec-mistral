/**
 * Tables de butin des coffres générés (villages, donjons, ruines, temples, camps,
 * forteresses…). Chaque entrée : clé d'objet, quantité min/max, poids.
 */
import { ITEM_BY_KEY, type ItemStack } from '../items/items';

type Entry = [key: string, min: number, max: number, weight: number];

interface Table {
  rolls: [number, number];
  entries: Entry[];
}

const TABLES: Record<string, Table> = {
  village_house: {
    rolls: [3, 7],
    entries: [
      ['bread', 1, 4, 10],
      ['apple', 1, 5, 10],
      ['wheat', 2, 8, 8],
      ['potato', 1, 5, 6],
      ['carrot', 1, 5, 6],
      ['wheat_seeds', 2, 6, 6],
      ['emerald', 1, 2, 3],
      ['oak_sapling', 1, 2, 4],
      ['torch', 2, 8, 6],
      ['paper', 1, 3, 3],
      ['white_wool', 1, 3, 3],
      ['oak_planks', 4, 12, 5],
    ],
  },
  village_smith: {
    rolls: [3, 8],
    entries: [
      ['iron_ingot', 1, 5, 10],
      ['bread', 1, 3, 8],
      ['iron_pickaxe', 1, 1, 4],
      ['iron_sword', 1, 1, 4],
      ['iron_helmet', 1, 1, 3],
      ['iron_chestplate', 1, 1, 3],
      ['coal', 2, 8, 8],
      ['gold_ingot', 1, 3, 4],
      ['diamond', 1, 2, 2],
      ['saddle', 1, 1, 2],
      ['obsidian', 2, 6, 4],
    ],
  },
  dungeon: {
    rolls: [4, 9],
    entries: [
      ['bone', 2, 8, 10],
      ['rotten_flesh', 2, 8, 10],
      ['gunpowder', 1, 6, 8],
      ['string', 1, 6, 8],
      ['bread', 1, 2, 6],
      ['iron_ingot', 1, 4, 7],
      ['gold_ingot', 1, 4, 5],
      ['saddle', 1, 1, 4],
      ['golden_apple', 1, 1, 2],
      ['diamond', 1, 2, 2],
      ['bucket', 1, 1, 4],
      ['book', 1, 3, 4],
      ['energy_dust', 2, 8, 5],
      ['map', 1, 1, 2],
      ['iron_door_item', 1, 1, 2],
    ],
  },
  dungeon_boss: {
    rolls: [6, 10],
    entries: [
      ['diamond', 1, 4, 6],
      ['golden_apple', 1, 2, 4],
      ['mythril_ingot', 1, 2, 3],
      ['emerald', 2, 6, 6],
      ['iron_ingot', 3, 8, 8],
      ['gold_ingot', 2, 6, 6],
      ['diamond_sword', 1, 1, 2],
      ['glider', 1, 1, 2],
    ],
  },
  ruins: {
    rolls: [3, 6],
    entries: [
      ['ancient_bricks', 2, 8, 8],
      ['gold_nugget', 2, 9, 10],
      ['iron_nugget', 2, 9, 10],
      ['emerald', 1, 3, 5],
      ['ancient_gear', 1, 1, 3],
      ['bone', 1, 5, 6],
      ['map', 1, 1, 2],
      ['compass', 1, 1, 2],
      ['sapphire', 1, 2, 3],
    ],
  },
  desert_temple: {
    rolls: [3, 8],
    entries: [
      ['gold_ingot', 2, 7, 10],
      ['iron_ingot', 1, 5, 10],
      ['emerald', 1, 3, 8],
      ['diamond', 1, 3, 4],
      ['bone', 4, 6, 12],
      ['rotten_flesh', 3, 7, 12],
      ['saddle', 1, 1, 5],
      ['golden_apple', 1, 1, 3],
      ['sandstone', 4, 12, 6],
    ],
  },
  witch_hut: {
    rolls: [2, 5],
    entries: [
      ['spider_eye', 1, 3, 8],
      ['glowstone_dust', 1, 6, 8],
      ['sugar', 1, 4, 6],
      ['gunpowder', 1, 4, 6],
      ['slime_ball', 1, 3, 4],
      ['red_mushroom', 1, 3, 6],
      ['brown_mushroom', 1, 3, 6],
      ['glow_mushroom', 1, 2, 4],
    ],
  },
  camp: {
    rolls: [3, 6],
    entries: [
      ['bread', 1, 3, 10],
      ['cooked_porkchop', 1, 3, 8],
      ['torch', 2, 10, 8],
      ['arrow', 4, 12, 8],
      ['bow', 1, 1, 3],
      ['leather_boots', 1, 1, 3],
      ['leather_chestplate', 1, 1, 3],
      ['iron_ingot', 1, 3, 5],
      ['coal', 2, 6, 6],
      ['fishing_rod', 1, 1, 3],
      ['oak_boat', 1, 1, 2],
    ],
  },
  sanctuary: {
    rolls: [5, 9],
    entries: [
      ['abyss_pearl', 1, 2, 4],
      ['sapphire', 2, 6, 8],
      ['diamond', 1, 3, 6],
      ['golden_apple', 1, 2, 4],
      ['sea_lantern', 2, 6, 6],
      ['mythril_ingot', 1, 3, 4],
      ['diamond_chestplate', 1, 1, 2],
    ],
  },
  fortress: {
    rolls: [3, 7],
    entries: [
      ['gold_ingot', 2, 6, 10],
      ['ember_shard', 2, 8, 10],
      ['magma_cream', 1, 4, 8],
      ['obsidian', 2, 6, 6],
      ['diamond', 1, 3, 5],
      ['golden_chestplate', 1, 1, 3],
      ['saddle', 1, 1, 4],
      ['flint_and_steel', 1, 1, 3],
      ['mythril_ingot', 1, 2, 3],
    ],
  },
  sky_temple: {
    rolls: [4, 8],
    entries: [
      ['sky_feather', 2, 6, 10],
      ['crystal_shard', 2, 8, 10],
      ['golden_apple', 1, 2, 5],
      ['diamond', 1, 4, 6],
      ['mythril_ingot', 1, 3, 5],
      ['glider', 1, 1, 3],
      ['flying_carpet', 1, 1, 2],
      ['cloud', 4, 12, 6],
    ],
  },
  bonus_chest: {
    rolls: [6, 8],
    entries: [
      ['stick', 4, 12, 10],
      ['oak_planks', 4, 12, 10],
      ['oak_log', 2, 6, 8],
      ['apple', 1, 4, 10],
      ['bread', 1, 3, 8],
      ['wooden_axe', 1, 1, 4],
      ['wooden_pickaxe', 1, 1, 4],
      ['stone_pickaxe', 1, 1, 2],
      ['torch', 4, 12, 6],
    ],
  },
};

function randInt(rnd: () => number, a: number, b: number): number {
  return a + Math.floor(rnd() * (b - a + 1));
}

/** Tire le contenu d'un coffre de 27 cases. */
export function rollLoot(table: string, rnd: () => number = Math.random): Array<ItemStack | null> {
  const t = TABLES[table] ?? TABLES.dungeon;
  const slots: Array<ItemStack | null> = new Array(27).fill(null);
  const total = t.entries.reduce((s, e) => s + e[3], 0);
  const rolls = randInt(rnd, t.rolls[0], t.rolls[1]);
  for (let i = 0; i < rolls; i++) {
    let r = rnd() * total;
    let pick = t.entries[0];
    for (const e of t.entries) {
      r -= e[3];
      if (r <= 0) {
        pick = e;
        break;
      }
    }
    const def = ITEM_BY_KEY.get(pick[0]);
    if (!def) continue;
    const count = Math.min(def.maxStack, randInt(rnd, pick[1], pick[2]));
    // Case libre aléatoire
    for (let k = 0; k < 40; k++) {
      const s = Math.floor(rnd() * 27);
      if (!slots[s]) {
        slots[s] = { id: def.id, count };
        break;
      }
    }
  }
  return slots;
}

export function lootTableExists(name: string): boolean {
  return name in TABLES;
}
