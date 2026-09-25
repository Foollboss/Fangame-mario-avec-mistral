import { describe, it, expect } from 'vitest';
import { content, newSim, flatWorld } from './helpers';
import { Player } from '../src/entity/player';
import { installMobs } from '../src/sim/mobs';
import type { Mob } from '../src/entity/mob';

function setup(time = 1000) {
  const sim = newSim(7, { time });
  const sys = installMobs(sim);
  flatWorld(sim, 'surface', 3);
  const p = new Player(content.items);
  p.setPos(0.5, 11, 0.5);
  sim.addPlayer(p);
  return { sim, sys, p };
}

const run = (sim: ReturnType<typeof newSim>, n: number) => {
  for (let i = 0; i < n; i++) sim.tick();
};

describe('créatures', () => {
  it('un rôdeur repère, poursuit et blesse le joueur', () => {
    const { sim, p } = setup(18000);
    sim.rules.mobSpawning = false;
    const m = sim.spawnMob!('rodeur', 'surface', 10.5, 11, 0.5)!;
    expect(m).toBeTruthy();
    const d0 = m.distTo(p.x, p.y, p.z);
    run(sim, 200);
    expect(m.target).toBe(p);
    expect(m.distTo(p.x, p.y, p.z)).toBeLessThan(d0);
    run(sim, 200);
    expect(p.health).toBeLessThan(20);
  });

  it('un animal frappé prend la fuite puis lâche du butin à sa mort', () => {
    const { sim, p } = setup();
    sim.rules.mobSpawning = false;
    const m = sim.spawnMob!('pelucheon', 'surface', 3.5, 11, 0.5)!;
    run(sim, 5);
    m.damage(2, { type: 'melee', attacker: p, knockback: 0 });
    const d0 = m.distTo(p.x, p.y, p.z);
    run(sim, 60);
    expect(m.distTo(p.x, p.y, p.z)).toBeGreaterThan(d0 + 1);
    m.damage(100, { type: 'melee', attacker: p });
    run(sim, 40);
    expect(m.removed).toBe(true);
    const items = sim.entities.list.filter((e) => e.kind === 'item');
    expect(items.length).toBeGreaterThan(0);
  });

  it('les hostiles apparaissent la nuit, pas les jours en mode paisible', () => {
    const { sim } = setup(18000);
    run(sim, 20 * 30);
    const hostile = sim.entities.list.filter((e) => e.kind === 'mob' && (e as Mob).hostile).length;
    expect(hostile).toBeGreaterThan(0);
    sim.difficulty = 0;
    run(sim, 40);
    expect(sim.entities.list.filter((e) => e.kind === 'mob' && (e as Mob).hostile).length).toBe(0);
  });

  it('un boss change de phase et affiche sa barre de vie', () => {
    const { sim, p } = setup();
    sim.rules.mobSpawning = false;
    const events: string[] = [];
    sim.on((e) => events.push(e.t));
    expect(sim.summonBoss('gardien_sylvestre', 'surface', 6.5, 11, 0.5, p)).toBe(true);
    // un seul boss à la fois
    expect(sim.summonBoss('gardien_sylvestre', 'surface', 6.5, 11, 0.5, p)).toBe(false);
    run(sim, 20);
    expect(events).toContain('boss');
    const boss = sim.entities.list.find((e) => e.kind === 'mob' && (e as Mob).type === 'gardien_sylvestre') as Mob;
    boss.invuln = 0;
    boss.health = boss.maxHealth * 0.3;
    run(sim, 2);
    expect(boss.phase).toBeGreaterThan(0);
    boss.damage(9999, { type: 'kill', attacker: p });
    run(sim, 40);
    expect(p.stats.boss_vaincus).toBe(1);
  });

  it('les créatures persistantes sont sauvegardées puis restaurées', () => {
    const { sim } = setup();
    sim.rules.mobSpawning = false;
    const m = sim.spawnMob!('ours_mousse', 'surface', 20.5, 11, 20.5)!;
    m.persistent = true;
    m.health = 13;
    const saved = sim.persistentEntitiesIn('surface', 1, 1);
    expect(saved.length).toBe(1);
    sim.unloadEntitiesIn('surface', 1, 1);
    run(sim, 1);
    expect(sim.entities.list.some((e) => e.kind === 'mob')).toBe(false);
    sim.restoreEntities('surface', saved);
    const back = sim.entities.list.find((e) => e.kind === 'mob') as Mob;
    expect(back.type).toBe('ours_mousse');
    expect(back.health).toBe(13);
    expect(Math.round(back.x)).toBe(21);
  });
});
