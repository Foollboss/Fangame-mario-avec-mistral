import { describe, expect, it } from 'vitest';
import { makeWorld } from './helpers';
import { B, BLOCK_BY_KEY } from '../src/world/blocks';
import { ITEM_BY_KEY, ITEM_COUNT, itemId, type ItemStack } from '../src/items/items';
import { RECIPES, findRecipe, ingredientItems, smeltResult, type Recipe } from '../src/inventory/recipes';
import { PlayerInventory } from '../src/inventory/Container';
import { tickFurnace, COOK_TIME, type FurnaceData } from '../src/game/BlockEntityTicker';
import { blockDrops, breakTime, canHarvest } from '../src/game/drops';
import { rollLoot } from '../src/game/Loot';
import { Player } from '../src/player/Player';
import { EmberGenerator, SkyGenerator } from '../src/world/gen/otherDims';
import { OverworldGenerator } from '../src/world/gen/overworld';

const st = (key: string, count = 1): ItemStack => ({ id: itemId(key), count });
const MATS = ['etherium', 'celestine'] as const;
const TOOLS = ['sword', 'pickaxe', 'axe', 'shovel', 'hoe'];
const PIECES = ['helmet', 'chestplate', 'leggings', 'boots'];

/** Remplit une grille 3×3 selon la recette (premier objet de chaque étiquette). */
function gridFor(r: Recipe): Array<ItemStack | null> {
  const g: Array<ItemStack | null> = new Array(9).fill(null);
  if (r.pattern)
    r.pattern.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (ch !== ' ') g[y * 3 + x] = st(ingredientItems(r.key![ch])[0]);
      }),
    );
  else r.ingredients!.forEach((ing, i) => (g[i] = st(ingredientItems(ing)[0])));
  return g;
}

function craftable(result: string): Recipe {
  const r = RECIPES.find((x) => x.result === result);
  expect(r, result).toBeDefined();
  expect(findRecipe(gridFor(r!), 3, 3)?.result, result).toBe(result);
  return r!;
}

function playerWith(armor: string[]): Player {
  const p = new Player();
  for (const k of armor) p.inventory.armor.set(PIECES.findIndex((s) => k.endsWith(s)), st(k));
  return p;
}
const fullSet = (m: string) => PIECES.map((p) => `${m}_${p}`);

describe('étherium et célestine : registres', () => {
  it('blocs aux identifiants figés, objets-blocs au même identifiant', () => {
    expect([B.etherium_ore, B.etherium_block, B.celestine_ore, B.celestine_block]).toEqual([237, 238, 239, 240]);
    for (const k of ['etherium_ore', 'etherium_block', 'celestine_ore', 'celestine_block']) expect(itemId(k)).toBe(BLOCK_BY_KEY.get(k)!.id);
    expect(BLOCK_BY_KEY.get('etherium_ore')!.name).toBe("Minerai d'étherium");
    expect(BLOCK_BY_KEY.get('celestine_block')!.name).toBe('Bloc de célestine');
  });

  it('matériaux, outils et armures présents avec leurs caractéristiques', () => {
    expect(ITEM_BY_KEY.get('raw_etherium')?.name).toBe('Étherium brut');
    expect(ITEM_BY_KEY.get('etherium_ingot')?.rarity).toBe('rare');
    expect(ITEM_BY_KEY.get('celestine')?.rarity).toBe('epic');
    expect(ITEM_BY_KEY.get('etherium_pickaxe')?.tool).toMatchObject({ level: 4, speed: 9, durability: 2300 });
    expect(ITEM_BY_KEY.get('celestine_sword')?.tool).toMatchObject({ level: 4, speed: 12, durability: 3100, damage: 9 });
    expect(ITEM_BY_KEY.get('celestine_sword')?.name).toBe('Épée en célestine');
    expect(ITEM_BY_KEY.get('etherium_chestplate')?.armor).toMatchObject({ slot: 'chest', points: 8, durability: 16 * 37, material: 'etherium' });
    expect(ITEM_BY_KEY.get('celestine_boots')?.armor).toMatchObject({ slot: 'feet', points: 4, durability: 13 * 45, material: 'celestine' });
    for (const m of MATS) {
      for (const t of TOOLS) expect(ITEM_BY_KEY.get(`${m}_${t}`)?.rarity, `${m}_${t}`).toBe(m === 'etherium' ? 'rare' : 'epic');
      for (const p of PIECES) expect(ITEM_BY_KEY.get(`${m}_${p}`)?.desc, `${m}_${p}`).toMatch(/^Ensemble complet : /);
    }
    expect(ITEM_BY_KEY.get('etherium_helmet')?.desc).toContain('feu');
    expect(ITEM_BY_KEY.get('celestine_helmet')?.desc).toContain('chute');
  });

  it('les identifiants des objets existants ne bougent pas (compatibilité des sauvegardes)', () => {
    // Valeurs relevées avant l'ajout de l'étherium et de la célestine.
    const before: Record<string, number> = {
      mythril_ingot: 1040,
      diamond_sword: 1092,
      mythril_hoe: 1101,
      shears: 1102,
      flint_and_steel: 1103,
      bed: 1121,
      leather_helmet: 1122,
      mythril_boots: 1141,
      apple: 1142,
      honey_cake: 1169,
      spawn_cow: 1170,
      spawn_sky_dragon: 1198,
    };
    for (const [k, id] of Object.entries(before)) expect(itemId(k), k).toBe(id);
    // Les nouveaux objets (hors objets-blocs) viennent tous après le dernier objet existant.
    for (const m of MATS) for (const k of [...TOOLS, ...PIECES]) expect(itemId(`${m}_${k}`)).toBeGreaterThan(1198);
    for (const k of ['raw_etherium', 'etherium_ingot', 'celestine']) expect(itemId(k)).toBeGreaterThan(1198);
    expect(ITEM_COUNT).toBe(1199 + 21);
  });
});

describe('étherium et célestine : fabrication', () => {
  it('tous les outils et pièces d’armure se fabriquent avec le bon ingrédient', () => {
    for (const m of MATS) {
      const ing = m === 'etherium' ? 'etherium_ingot' : 'celestine';
      for (const k of [...TOOLS, ...PIECES]) {
        const r = craftable(`${m}_${k}`);
        expect(Object.values(r.key!), `${m}_${k}`).toContain(ing);
        expect(r.needsTable).toBe(true);
      }
    }
  });

  it('blocs de stockage : 9 lingots ou gemmes ↔ 1 bloc', () => {
    for (const [block, it] of [
      ['etherium_block', 'etherium_ingot'],
      ['celestine_block', 'celestine'],
    ]) {
      const nine = new Array(9).fill(null).map(() => st(it));
      expect(findRecipe(nine, 3, 3)?.result).toBe(block);
      const back = findRecipe([st(block), null, null, null], 2, 2);
      expect(back?.result).toBe(it);
      expect(back?.count).toBe(9);
    }
  });

  it('cuisson : étherium brut → lingot d’étherium (2 points d’expérience)', () => {
    expect(smeltResult(st('raw_etherium'))).toMatchObject({ result: 'etherium_ingot', xp: 2 });
    const f: FurnaceData = { type: 'furnace', items: [st('raw_etherium', 1), st('coal', 1), null], burn: 0, burnMax: 0, cook: 0, xp: 0 };
    for (let i = 0; i < COOK_TIME + 1; i++) tickFurnace(f);
    expect(f.items[2]?.id).toBe(itemId('etherium_ingot'));
    expect(f.xp).toBe(2);
  });
});

describe('étherium et célestine : minage', () => {
  it('la pioche en fer ne récolte rien, la pioche en diamant oui', () => {
    for (const ore of ['etherium_ore', 'celestine_ore', 'etherium_block', 'celestine_block']) {
      const def = BLOCK_BY_KEY.get(ore)!;
      expect(canHarvest(def, st('iron_pickaxe')), ore).toBe(false);
      expect(canHarvest(def, st('diamond_pickaxe')), ore).toBe(true);
      expect(canHarvest(def, st('etherium_pickaxe')), ore).toBe(true);
    }
    const ore = BLOCK_BY_KEY.get('etherium_ore')!;
    expect(blockDrops(ore, 0, st('iron_pickaxe')).items).toEqual([]);
    const d = blockDrops(ore, 0, st('diamond_pickaxe'), () => 0.5);
    expect(d.items).toEqual([st('raw_etherium')]);
    expect(d.xp).toBeGreaterThanOrEqual(4);
    const gem = blockDrops(BLOCK_BY_KEY.get('celestine_ore')!, 0, st('diamond_pickaxe'), () => 0.99);
    expect(gem.items).toEqual([st('celestine', 2)]);
  });

  it('les nouvelles pioches récoltent l’obsidienne et la célestine creuse plus vite', () => {
    const obsidian = BLOCK_BY_KEY.get('obsidian')!;
    expect(canHarvest(obsidian, st('celestine_pickaxe'))).toBe(true);
    const stone = BLOCK_BY_KEY.get('stone')!;
    expect(breakTime(stone, st('celestine_pickaxe'), true, false)).toBeLessThan(breakTime(stone, st('diamond_pickaxe'), true, false));
  });
});

describe('étherium et célestine : génération et butin', () => {
  const opts = { seed: 2024, template: 'default' as const, caves: true, structures: true, fantasyBiomes: true, drop3: true, dimensions: true };
  /** Compte les blocs demandés sur une zone de n×n tronçons. */
  function census(g: { generate(cx: number, cz: number): { blocks: Uint16Array } }, n: number, keys: string[]) {
    const ids = keys.map((k) => B[k]);
    const perChunk: number[][] = [];
    for (let cz = 0; cz < n; cz++)
      for (let cx = 0; cx < n; cx++) {
        const { blocks } = g.generate(cx - (n >> 1), cz - (n >> 1));
        const c = ids.map(() => 0);
        for (let i = 0; i < blocks.length; i++) {
          const k = ids.indexOf(blocks[i] & 0x3ff);
          if (k >= 0) c[k]++;
        }
        perChunk.push(c);
      }
    return perChunk;
  }
  const sum = (a: number[]) => a.reduce((s, v) => s + v, 0);

  it('l’étherium n’apparaît que dans les Terres de braise, en quantité raisonnable', () => {
    const chunks = census(new EmberGenerator(opts), 8, ['etherium_ore', 'celestine_ore', 'ember_stone']);
    const mean = sum(chunks.map((c) => c[0])) / chunks.length;
    expect(sum(chunks.map((c) => c[1]))).toBe(0);
    expect(mean).toBeGreaterThanOrEqual(2);
    expect(mean).toBeLessThanOrEqual(8);
  });

  it('la célestine n’apparaît que dans les îles du Royaume céleste, en quantité raisonnable', () => {
    const chunks = census(new SkyGenerator(opts), 8, ['celestine_ore', 'etherium_ore', 'sky_stone']);
    const islands = chunks.filter((c) => c[2] > 0);
    expect(islands.length).toBeGreaterThan(10);
    expect(sum(chunks.map((c) => c[1]))).toBe(0);
    expect(sum(chunks.filter((c) => c[2] === 0).map((c) => c[0]))).toBe(0);
    const mean = sum(islands.map((c) => c[0])) / islands.length;
    expect(mean).toBeGreaterThanOrEqual(1);
    expect(mean).toBeLessThanOrEqual(6);
  });

  it('aucun des deux minerais à la Surface', () => {
    const chunks = census(new OverworldGenerator(opts), 3, ['etherium_ore', 'celestine_ore']);
    expect(sum(chunks.map((c) => c[0] + c[1]))).toBe(0);
  });

  it('coffres : étherium dans les forteresses de braise, célestine dans les temples célestes', () => {
    let seed = 7;
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const found = (table: string, keys: string[]) => {
      const ids = keys.map(itemId);
      for (let i = 0; i < 200; i++) if (rollLoot(table, rnd).some((s) => s && ids.includes(s.id))) return true;
      return false;
    };
    expect(found('fortress', ['raw_etherium', 'etherium_ingot'])).toBe(true);
    expect(found('sky_temple', ['celestine'])).toBe(true);
    expect(found('fortress', ['celestine'])).toBe(false);
  });
});

describe('bonus d’ensemble', () => {
  it('fullSet exige les quatre pièces du même matériau', () => {
    const inv = new PlayerInventory();
    expect(inv.fullSet('etherium')).toBe(false);
    fullSet('etherium').forEach((k, i) => inv.armor.set(i, st(k)));
    expect(inv.fullSet('etherium')).toBe(true);
    expect(inv.fullSet('celestine')).toBe(false);
    inv.armor.set(0, st('pumpkin'));
    expect(inv.fullSet('etherium')).toBe(false);
  });

  it('étherium complet : aucun dégât de feu ; avec trois pièces, le feu blesse', () => {
    const full = playerWith(fullSet('etherium'));
    expect(full.hurt(3, { type: 'fire' })).toBe(false);
    expect(full.health).toBe(20);
    const three = playerWith([...fullSet('etherium').slice(0, 3), 'diamond_boots']);
    expect(three.inventory.armorPoints()).toBe(full.inventory.armorPoints());
    expect(three.hurt(3, { type: 'fire' })).toBe(true);
    expect(three.health).toBeLessThan(20);
  });

  it('étherium complet : la lave inflige deux fois moins de dégâts (à armure égale)', () => {
    const full = playerWith(fullSet('etherium'));
    const three = playerWith([...fullSet('etherium').slice(0, 3), 'diamond_boots']);
    full.hurt(10, { type: 'lava' });
    three.hurt(10, { type: 'lava' });
    expect(20 - full.health).toBeGreaterThan(0);
    expect(20 - full.health).toBeCloseTo((20 - three.health) / 2, 5);
  });

  it('étherium complet : debout dans le feu ou sur du magma, aucune brûlure', () => {
    const run = (armor: string[], block: string) => {
      const world = makeWorld(1, (x, y, z) => (y < 64 ? (block === 'magma' && y === 63 && x === 0 && z === 0 ? B.magma : B.stone) : y === 64 && x === 0 && z === 0 && block === 'fire' ? B.fire : 0));
      const p = playerWith(armor);
      p.world = world;
      p.naturalRegeneration = false;
      p.pos.set(0.5, 64, 0.5);
      for (let i = 0; i < 100; i++) {
        p.baseTick();
        p.survivalTick();
      }
      return p.health;
    };
    for (const block of ['fire', 'magma']) {
      expect(run(fullSet('etherium'), block), block).toBe(20);
      expect(run(fullSet('etherium').slice(0, 3), block), block).toBeLessThan(20);
    }
  });

  it('célestine complète : aucun dégât de chute ; avec trois pièces, la chute blesse', () => {
    const full = playerWith(fullSet('celestine'));
    expect(full.hurt(12, { type: 'fall' })).toBe(false);
    expect(full.health).toBe(20);
    const three = playerWith(fullSet('celestine').slice(0, 3));
    expect(three.hurt(12, { type: 'fall' })).toBe(true);
    expect(three.health).toBe(8);
    // Les autres dégâts restent subis normalement.
    expect(playerWith(fullSet('celestine')).hurt(3, { type: 'fire' })).toBe(true);
  });
});
