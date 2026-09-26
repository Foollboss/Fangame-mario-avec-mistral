import { describe, it, expect } from 'vitest';
import { content, newSim, flatWorld, loadArea } from './helpers';
import { Player } from '../src/entity/player';
import { createGenerator } from '../src/worldgen/generator';
import { CelesteGenerator } from '../src/worldgen/celeste';
import { tryIgnitePortal, checkPortalContact } from '../src/sim/portals';
import { applyFall } from '../src/sim/survival';
import type { SimEvent } from '../src/sim/events';
import { stepMovement, newIntent, PLAYER_MOVE } from '../src/entity/movement';

const B = (id: string) => content.b(id);

describe('Îles célestes', () => {
  it('génère des îles flottantes, une mer de nuages et des cascades, de façon déterministe', () => {
    const gen = createGenerator('celeste', 4242, content) as CelesteGenerator;
    const spawn = gen.findSpawn();
    expect(spawn.y).toBeGreaterThan(90);
    const c = gen.generate(0, 0);
    // île d'arrivée : herbe céleste au sommet, vide en dessous de l'île
    const top = gen.surfaceHeight(0, 0);
    expect(c.get(0, top, 0)).toBe(B('herbe_celeste'));
    expect(gen.island(0, 0).bottom).toBeGreaterThan(40);
    // déterminisme
    const again = createGenerator('celeste', 4242, content).generate(0, 0);
    expect(Array.from(again.sections[6] ?? [])).toEqual(Array.from(c.sections[6] ?? []));
    // sur une zone plus large : nuages, nuages d'azur, eau des cascades, ambre, arbres dorés
    const seen = new Set<number>();
    const t0 = performance.now();
    for (let cz = -6; cz <= 6; cz++)
      for (let cx = -6; cx <= 6; cx++) {
        const b = gen.generate(cx, cz);
        for (const s of b.sections) if (s) for (let i = 0; i < s.length; i++) seen.add(s[i] & 0xfff);
      }
    const perChunk = (performance.now() - t0) / 169;
    for (const id of ['nuage', 'nuage_azur', 'eau', 'minerai_ambre', 'feuilles_dorees', 'feuilles_celestes', 'pierre_celeste', 'terre_celeste']) expect(seen.has(B(id)), id).toBe(true);
    expect(perChunk).toBeLessThan(60);
  });

  it('le cadre de pierres d’aurore s’allume à la plume d’azur (pas à l’étincelle de braise)', () => {
    const sim = newSim(5);
    const w = flatWorld(sim, 'surface', 1);
    const frame = B('pierre_aurore');
    // cadre 4×5 le long de X, intérieur 2×3 (x = 1..2, y = 11..13)
    for (let x = 0; x <= 3; x++)
      for (let y = 10; y <= 14; y++) if (x === 0 || x === 3 || y === 10 || y === 14) w.setBlock(x, y, 0, frame);
    expect(tryIgnitePortal(sim, w, 1, 11, 0, 'abime')).toBe(false);
    expect(w.getId(1, 11, 0)).toBe(0);
    expect(tryIgnitePortal(sim, w, 1, 11, 0, 'celeste')).toBe(true);
    for (const [x, y] of [[1, 11], [2, 11], [1, 13], [2, 13]]) expect(w.getId(x, y, 0)).toBe(B('voile_celeste'));
  });

  it('traverser le voile mène aux îles, avec un portail de retour sur une île', () => {
    const sim = newSim(6);
    const w = flatWorld(sim, 'surface', 1);
    const frame = B('pierre_aurore');
    for (let x = 0; x <= 3; x++) for (let y = 10; y <= 14; y++) if (x === 0 || x === 3 || y === 10 || y === 14) w.setBlock(x, y, 0, frame);
    tryIgnitePortal(sim, w, 1, 11, 0, 'celeste');
    const p = new Player(content.items);
    p.setPos(1.5, 11, 0.5);
    sim.addPlayer(p);
    const events: SimEvent[] = [];
    sim.on((e) => events.push(e));
    for (let i = 0; i < 70; i++) checkPortalContact(sim, p, 0.05);
    const ev = events.find((e): e is Extract<SimEvent, { t: 'dimension' }> => e.t === 'dimension');
    expect(ev).toMatchObject({ dim: 'celeste', mode: 'portal', portal: 'celeste' });
    // arrivée : colonnes chargées autour du point d'arrivée
    const cw = sim.world('celeste');
    loadArea(cw, Math.floor(ev!.x / 16), Math.floor(ev!.z / 16), 3);
    const pos = sim.completeTravel(p, ev!.dim, ev!.x, ev!.y, ev!.z, ev!.mode, ev!.portal);
    expect(p.dim).toBe('celeste');
    // un portail céleste (pas un portail de l'Abîme) a été construit à l'arrivée, sur un sol solide
    let veils = 0;
    for (let dx = -3; dx <= 3; dx++) for (let dy = -2; dy <= 4; dy++) if (cw.getId(Math.floor(pos.x) + dx, Math.floor(pos.y) + dy, Math.floor(pos.z) - 1) === B('voile_celeste')) veils++;
    expect(veils).toBeGreaterThanOrEqual(6);
    expect(content.blocks.solid[cw.getId(Math.floor(pos.x), Math.floor(pos.y) - 1, Math.floor(pos.z))]).toBe(1);
  });

  it('la commande /dimension celeste construit un portail céleste à l’arrivée', () => {
    const sim = newSim(8);
    flatWorld(sim, 'surface', 1);
    const p = new Player(content.items);
    p.setPos(0.5, 11, 0.5);
    sim.addPlayer(p);
    const events: SimEvent[] = [];
    sim.on((e) => events.push(e));
    sim.requestTravel(p, 'celeste', { x: 0, y: 11, z: 0 });
    expect(events.find((e) => e.t === 'dimension')).toMatchObject({ dim: 'celeste', portal: 'celeste' });
  });

  it('les nuages amortissent les chutes ; tomber des îles ramène à la surface', () => {
    const sim = newSim(7);
    const w = flatWorld(sim, 'surface', 1);
    const p = new Player(content.items);
    p.setPos(0.5, 11, 0.5);
    sim.addPlayer(p);
    w.setBlock(0, 10, 0, B('nuage'));
    applyFall(sim, p, 40);
    expect(p.health).toBe(20);
    w.setBlock(0, 10, 0, B('pierre'));
    applyFall(sim, p, 10);
    expect(p.health).toBeLessThan(20);
    // nuage d'azur : rebond (sauf accroupi)
    w.setBlock(0, 10, 0, B('nuage_azur'));
    p.setPos(0.5, 13, 0.5);
    p.body.vy = 0;
    let maxVy = 0;
    for (let i = 0; i < 60; i++) {
      stepMovement(w, p.body, 0, newIntent(), PLAYER_MOVE, 0.05, p.eye);
      maxVy = Math.max(maxVy, p.body.vy);
    }
    expect(maxVy).toBeGreaterThan(12);
    const sneak = newIntent();
    sneak.sneak = true;
    p.setPos(0.5, 11, 0.5);
    p.body.vy = 0;
    maxVy = 0;
    for (let i = 0; i < 20; i++) {
      stepMovement(w, p.body, 0, sneak, PLAYER_MOVE, 0.05, p.eye);
      maxVy = Math.max(maxVy, p.body.vy);
    }
    expect(maxVy).toBeLessThan(1);
    // chute dans le vide des îles
    const events: SimEvent[] = [];
    sim.on((e) => events.push(e));
    p.dim = 'celeste';
    p.setPos(10.5, -20, 10.5);
    for (let i = 0; i < 12; i++) sim.tick();
    expect(events.some((e) => e.t === 'dimension' && e.dim === 'surface' && e.mode === 'exact')).toBe(true);
  });
});
