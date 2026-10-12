import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { makeWorld } from './helpers';
import { B } from '../src/world/blocks';
import { raycast } from '../src/world/Raycast';
import { aabb, moveBox } from '../src/entity/physics';
import { tryLightPortal, buildPortal, findPortal, convertCoords, portalTarget } from '../src/game/Portals';
import { rollLoot } from '../src/game/Loot';
import { Simplex } from '../src/util/noise';
import { OverworldShaper } from '../src/world/gen/terrain';

const flat = (x: number, y: number) => (y < 64 ? B.stone : 0);

describe('monde et collisions', () => {
  it('set / id / meta et hauteur', () => {
    const w = makeWorld(1, flat);
    expect(w.id(3, 63, 3)).toBe(B.stone);
    expect(w.height(3, 3)).toBe(63);
    w.set(3, 70, 3, B.oak_planks, 0);
    expect(w.id(3, 70, 3)).toBe(B.oak_planks);
  });

  it('le rayon touche le sol avec la bonne face', () => {
    const w = makeWorld(1, flat);
    const hit = raycast(w, new THREE.Vector3(2.5, 66, 2.5), new THREE.Vector3(0, -1, 0), 10);
    expect(hit).not.toBeNull();
    expect(hit!.y).toBe(63);
    expect(hit!.face).toBe(2);
  });

  it('une boîte qui tombe s’arrête sur le sol', () => {
    const w = makeWorld(1, flat);
    const r = moveBox(w, aabb(5.5, 64.5, 5.5, 0.6, 1.8), 0, -2, 0);
    expect(r.onGround).toBe(true);
    expect(64.5 + r.dy).toBeCloseTo(64, 5);
  });

  it('monte une marche de 0,5 bloc', () => {
    const w = makeWorld(1, flat);
    w.set(6, 64, 5, B.stone_slab, 0);
    const r = moveBox(w, aabb(5.5, 64, 5.5, 0.6, 1.8), 0.8, 0, 0, 0.6, true);
    expect(r.dx).toBeGreaterThan(0.5);
  });
});

describe('portails', () => {
  it('allume un cadre d’obsidienne 4×5 et le remplit', () => {
    const w = makeWorld(1, flat);
    for (let i = 0; i < 4; i++) {
      w.set(i, 64, 0, B.obsidian);
      w.set(i, 68, 0, B.obsidian);
    }
    for (let y = 65; y < 68; y++) {
      w.set(0, y, 0, B.obsidian);
      w.set(3, y, 0, B.obsidian);
    }
    expect(tryLightPortal(w, 1, 65, 0, 'ember')).toBe(true);
    for (let y = 65; y < 68; y++) {
      expect(w.id(1, y, 0)).toBe(B.ember_portal);
      expect(w.id(2, y, 0)).toBe(B.ember_portal);
    }
    expect(findPortal(w, 'ember', 1, 0, 4)).not.toBeNull();
  });

  it('refuse un cadre incomplet', () => {
    const w = makeWorld(1, flat);
    for (let i = 0; i < 4; i++) w.set(i, 64, 0, B.obsidian);
    expect(tryLightPortal(w, 1, 65, 0, 'ember')).toBe(false);
  });

  it('construit un portail d’arrivée utilisable', () => {
    const w = makeWorld(1, flat);
    const pos = buildPortal(w, 'sky', 2, 4, 4);
    expect(findPortal(w, 'sky', 4, 4, 3)).not.toBeNull();
    expect(pos[1]).toBeGreaterThan(0);
  });

  it('coordonnées 1:8 pour les Terres de braise', () => {
    expect(convertCoords('ember', 0, 1, 800, -160)).toEqual([100, -20]);
    expect(convertCoords('ember', 1, 0, 100, -20)).toEqual([800, -160]);
    expect(portalTarget('ember', 0)).toBe(1);
    expect(portalTarget('sky', 2)).toBe(0);
  });
});

describe('génération', () => {
  it('le bruit est déterministe', () => {
    const a = new Simplex(42);
    const b = new Simplex(42);
    expect(a.noise2(12.3, -4.5)).toBe(b.noise2(12.3, -4.5));
  });

  it('le relief dépend de la graine et reste stable', () => {
    const opts = { seed: 99, template: 'default' as const, caves: true, structures: true, fantasyBiomes: true, drop3: false, dimensions: true };
    const s1 = new OverworldShaper(opts).sample(1000, -2000);
    const s2 = new OverworldShaper(opts).sample(1000, -2000);
    expect(s1).toEqual(s2);
    expect(s1.height).toBeGreaterThan(0);
    expect(s1.height).toBeLessThan(256);
  });

  it('les coffres générés contiennent 27 cases et des objets valides', () => {
    let seed = 1;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const loot = rollLoot('dungeon', rnd);
    expect(loot.length).toBe(27);
    expect(loot.filter(Boolean).length).toBeGreaterThan(0);
  });
});
