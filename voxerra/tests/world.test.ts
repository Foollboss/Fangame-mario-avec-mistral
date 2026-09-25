import { describe, it, expect } from 'vitest';
import { content, newSim, flatWorld, loadArea } from './helpers';
import { Chunk } from '../src/world/chunk';
import { World } from '../src/world/world';
import { encodeChunk, decodeChunk, rleEncode, rleDecode } from '../src/save/serializer';
import { Player } from '../src/entity/player';
import { digBlock, placeBlock, breakTime, canHarvest } from '../src/sim/interact';
import { makeCell } from '../src/registry/blocks';

describe('chunks et monde', () => {
  it('stocke blocs et méta, libère les sections vides', () => {
    const c = new Chunk(0, 0);
    c.set(3, 70, 5, makeCell(7, 3));
    expect(c.get(3, 70, 5) & 0xfff).toBe(7);
    expect(c.get(3, 70, 5) >>> 12).toBe(3);
    expect(c.sections[4].blocks).not.toBeNull();
    c.set(3, 70, 5, 0);
    expect(c.sections[4].blocks).toBeNull();
  });

  it('éclaire le ciel et propage la lumière des torches', () => {
    const sim = newSim();
    const w = flatWorld(sim);
    expect(w.skyLight(0, 11, 0)).toBe(15);
    expect(w.skyLight(0, 9, 0)).toBe(0);
    // Toit au-dessus d'une zone : ombre, puis torche
    for (let x = -3; x <= 3; x++) for (let z = -3; z <= 3; z++) w.setBlock(x, 14, z, content.b('pierre'));
    for (let x = -3; x <= 3; x++) for (let z = -3; z <= 3; z++) for (let y = 11; y < 14; y++) if (Math.abs(x) === 3 || Math.abs(z) === 3) w.setBlock(x, y, z, content.b('pierre'));
    expect(w.skyLight(0, 11, 0)).toBe(0);
    w.setBlock(0, 11, 0, content.b('torche'));
    expect(w.blockLight(0, 11, 0)).toBe(14);
    expect(w.blockLight(1, 11, 0)).toBe(13);
    expect(w.blockLight(2, 12, 0)).toBe(11);
    w.setBlock(0, 11, 0, 0);
    expect(w.blockLight(1, 11, 0)).toBe(0);
    // Ouvrir le toit rend le ciel
    w.setBlock(0, 14, 0, 0);
    expect(w.skyLight(0, 11, 0)).toBe(15);
  });

  it('RLE et sérialisation aller-retour', () => {
    const data = new Uint16Array(4096);
    data.fill(5, 0, 1000);
    data.fill(9, 1000, 1001);
    const rle = rleEncode(data);
    expect(rle.length).toBeLessThan(20);
    expect(Array.from(rleDecode(rle))).toEqual(Array.from(data));
    const world = new World(content, 'surface', 5);
    world.trackDirty = false;
    loadArea(world, 0, 0, 0);
    const c = world.getChunk(0, 0)!;
    c.blockEntities.set(123, { type: 'chest', slots: [{ id: 'pain', count: 2 }] });
    const rec = JSON.parse(JSON.stringify(encodeChunk(c, content.blocks), (_k, v) => (v instanceof Uint16Array || v instanceof Uint8Array || v instanceof Uint32Array ? Array.from(v) : v)));
    const dec = decodeChunk(rec, content.blocks);
    for (let s = 0; s < 16; s++) {
      const a = c.sections[s].blocks, b = dec.sections[s];
      if (!a) expect(b).toBeNull();
      else expect(Array.from(b!)).toEqual(Array.from(a));
    }
    expect(dec.blockEntities[0][1]).toEqual({ type: 'chest', slots: [{ id: 'pain', count: 2 }] });
  });
});

describe('placement et destruction', () => {
  function setup() {
    const sim = newSim();
    const w = flatWorld(sim);
    const p = new Player(content.items);
    p.setPos(0.5, 11, 0.5);
    sim.addPlayer(p);
    return { sim, w, p };
  }

  it('casse un bloc avec le bon outil et lâche son butin', () => {
    const { sim, w, p } = setup();
    // à mains nues : la pierre ne donne rien
    expect(canHarvest(sim, p, w.getBlock(2, 10, 0) === 0 ? 0 : w.getBlock(2, 9, 0))).toBe(false);
    p.inventory.set(0, { id: 'pioche_bois', count: 1 });
    expect(canHarvest(sim, p, w.getBlock(2, 9, 0))).toBe(true);
    const tHand = breakTime(sim, new Player(content.items), w.getBlock(2, 9, 0));
    const tPick = breakTime(sim, p, w.getBlock(2, 9, 0));
    expect(tPick).toBeLessThan(tHand);
    w.setBlock(2, 10, 0, 0);
    expect(digBlock(sim, p, 2, 9, 0)).toBe(true);
    expect(w.getId(2, 9, 0)).toBe(0);
    const items = [...sim.entities.inDim('surface')].filter((e) => e.kind === 'item');
    expect(items.length).toBe(1);
    expect((items[0] as unknown as { stack: { id: string } }).stack.id).toBe('moellon');
    expect(p.inventory.get(0)?.dmg).toBe(1);
  });

  it('pose un bloc orienté, des escaliers et fusionne les dalles', () => {
    const { sim, w, p } = setup();
    p.inventory.set(0, { id: 'moellon_dalle', count: 10 });
    const hit = { x: 3, y: 10, z: 0, face: 2, px: 3.5, py: 11, pz: 0.5, dist: 3, cell: w.getBlock(3, 10, 0) };
    expect(placeBlock(sim, p, hit)).toBe(true);
    expect(w.getId(3, 11, 0)).toBe(content.b('moellon_dalle'));
    // Clic sur le dessus de la dalle basse → bloc plein
    const hit2 = { x: 3, y: 11, z: 0, face: 2, px: 3.5, py: 11.5, pz: 0.5, dist: 3, cell: w.getBlock(3, 11, 0) };
    expect(placeBlock(sim, p, hit2)).toBe(true);
    expect(w.getId(3, 11, 0)).toBe(content.b('moellon'));
    expect(p.inventory.get(0)?.count).toBe(8);
    // Porte : deux moitiés
    p.inventory.set(1, { id: 'porte_bois', count: 1 });
    p.inventory.selected = 1;
    const hit3 = { x: 5, y: 10, z: 0, face: 2, px: 5.5, py: 11, pz: 0.5, dist: 3, cell: w.getBlock(5, 10, 0) };
    expect(placeBlock(sim, p, hit3)).toBe(true);
    expect(w.getId(5, 11, 0)).toBe(content.b('porte_bois'));
    expect(w.getBlock(5, 12, 0) >>> 12 & 8).toBe(8);
    // Casser la moitié basse retire la haute
    p.gameMode = 'creatif';
    digBlock(sim, p, 5, 11, 0);
    expect(w.getId(5, 12, 0)).toBe(0);
  });

  it('refuse de poser un bloc dans le joueur', () => {
    const { sim, w, p } = setup();
    p.inventory.set(0, { id: 'pierre', count: 1 });
    const hit = { x: 0, y: 10, z: 0, face: 2, px: 0.5, py: 11, pz: 0.5, dist: 1, cell: w.getBlock(0, 10, 0) };
    expect(placeBlock(sim, p, hit)).toBe(false);
  });

  it('l\'eau s\'écoule puis s\'arrête', () => {
    const { sim, w } = setup();
    w.setBlock(0, 11, 5, content.b('eau'));
    for (let i = 0; i < 400; i++) sim.tick();
    const water = content.b('eau');
    expect(w.getId(1, 11, 5)).toBe(water);
    expect(w.getId(7, 11, 5)).toBe(water);
    expect(w.getId(9, 11, 5)).toBe(0);
  });
});
