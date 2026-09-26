import { describe, it, expect } from 'vitest';
import { content, newSim, flatWorld } from './helpers';
import { Player } from '../src/entity/player';
import { installMobs } from '../src/sim/mobs';

/**
 * Lac de test : eau de `bottom` à y=10 (surface à y=11) ; berge de 2 blocs de haut
 * (pierre jusqu'à y=12) pour x ≥ `shore`.
 */
function lake(bottom: number, shore = 99) {
  const sim = newSim(11, { time: 6000 });
  installMobs(sim);
  sim.rules.mobSpawning = false;
  const w = flatWorld(sim, 'surface', 2);
  const eau = content.b('eau'),
    pierre = content.b('pierre');
  for (let x = -32; x < 32; x++)
    for (let z = -32; z < 32; z++) {
      if (x >= shore) for (let y = bottom; y <= 12; y++) w.setBlock(x, y, z, pierre);
      else for (let y = bottom; y <= 10; y++) w.setBlock(x, y, z, eau);
    }
  const p = new Player(content.items);
  p.setPos(-20.5, 14, 20.5);
  sim.addPlayer(p);
  return { sim, p };
}

describe('animaux dans l’eau', () => {
  for (const [bottom, name] of [
    [8, 'peu profonde'],
    [2, 'profonde (9 blocs)'],
  ] as const)
    it(`nagent et se promènent en eau ${name}`, () => {
      const { sim } = lake(bottom);
      const m = sim.spawnMob!('pelucheon', 'surface', 0.5, 10, 0.5)!;
      const x0 = m.x,
        z0 = m.z;
      let maxD = 0,
        maxY = 0;
      for (let i = 0; i < 20 * 40; i++) {
        sim.tick();
        maxD = Math.max(maxD, Math.hypot(m.x - x0, m.z - z0));
        if (i > 60) maxY = Math.max(maxY, m.y);
      }
      expect(maxD).toBeGreaterThan(3);
      expect(maxY).toBeLessThan(12.6); // reste à flot, sans décoller
    });

  it('frappé près d’une berge trop haute : repoussé à l’horizontale, sans sauter sur place', () => {
    const { sim, p } = lake(2, 6);
    const m = sim.spawnMob!('pelucheon', 'surface', 3.5, 10.5, 0.5)!;
    for (let i = 0; i < 30; i++) sim.tick();
    // même point de départ à chaque fois : à 2 blocs de la berge, à flot
    m.setPos(3.5, 10.9, 0.5);
    m.body.vx = m.body.vy = m.body.vz = 0;
    m.stopMoving();
    p.setPos(m.x - 2, 11, m.z);
    const x0 = m.x,
      y0 = m.y;
    m.damage(1, { type: 'melee', attacker: p, knockback: 1 });
    let maxY = m.y,
      maxDx = 0,
      jumps = 0,
      prevVy = 0;
    for (let i = 0; i < 20 * 4; i++) {
      sim.tick();
      maxY = Math.max(maxY, m.y);
      maxDx = Math.max(maxDx, m.x - x0);
      // sauts répétés contre la berge : la vitesse verticale remonte brusquement
      if (i > 3 && m.body.vy > 3.5 && prevVy <= 3.5) jumps++;
      prevVy = m.body.vy;
    }
    expect(maxDx).toBeGreaterThan(0.8); // repoussé vers la berge
    expect(maxY - y0).toBeLessThan(1.5);
    expect(jumps).toBeLessThanOrEqual(1);
  });
});
