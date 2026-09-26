import { describe, it, expect } from 'vitest';
import { newSim } from './helpers';
import { Player } from '../src/entity/player';
import { content } from './helpers';
import { completeCommand, runCommand } from '../src/sim/commands';

describe('commandes', () => {
  const sim = newSim(3);

  it('propose les commandes et leurs arguments, dans chaque langue', () => {
    expect(completeCommand(sim, '/te', 'fr')).toContain('/temps ');
    expect(completeCommand(sim, '/', 'fr').length).toBeGreaterThan(10);
    expect(completeCommand(sim, '/temps ', 'fr')).toEqual(['/temps jour ', '/temps midi ', '/temps nuit ', '/temps minuit ']);
    expect(completeCommand(sim, '/wea', 'en')).toEqual(['/weather ']);
    expect(completeCommand(sim, '/weather r', 'en')).toEqual(['/weather rain ']);
    expect(completeCommand(sim, '/clima ', 'es')).toContain('/clima lluvia ');
    expect(completeCommand(sim, '/mode c', 'fr')).toEqual(['/mode creatif ']);
    const items = completeCommand(sim, '/donner pioche', 'fr');
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((l) => l.startsWith('/donner ') && l.includes('pioche'))).toBe(true);
    expect(completeCommand(sim, '/invoquer chauve', 'fr')).toContain('/invoquer chauve_furie ');
    expect(completeCommand(sim, 'bonjour', 'fr')).toEqual([]);
  });

  it('chaque suggestion est une commande reconnue', () => {
    const p = new Player(content.items);
    for (const lang of ['fr', 'en', 'es'] as const) {
      for (const line of completeCommand(sim, '/', lang)) {
        const r = runCommand({ sim }, p, line.trim());
        expect(r.out.join(' ')).not.toMatch(/inconnue|unknown|desconocido/i);
      }
      for (const cmd of lang === 'fr' ? ['/temps ', '/meteo ', '/mode '] : lang === 'en' ? ['/time ', '/weather ', '/gamemode '] : ['/tiempo ', '/clima ', '/modo ']) {
        for (const line of completeCommand(sim, cmd, lang)) expect(runCommand({ sim }, p, line.trim()).ok).toBe(true);
      }
    }
  });

  it('explique comment autoriser les commandes en solo', () => {
    const closed = newSim(4);
    closed.meta.allowCommands = false;
    const p = new Player(content.items);
    const r = runCommand({ sim: closed, solo: true }, p, '/temps jour');
    expect(r.ok).toBe(false);
    expect(r.out.length).toBe(2);
    expect(runCommand({ sim: closed }, p, '/temps jour').out.length).toBe(1);
  });
});
