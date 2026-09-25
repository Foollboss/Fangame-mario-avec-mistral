/** Branche les modules de gameplay sur la simulation (progrès, créatures…). */
import type { Sim } from '../sim/sim';
import type { Game } from './game';
import { AdvancementTracker } from '../sim/advancements';
import { installMobs } from '../sim/mobs';

export function installGameModules(sim: Sim, game: Game | null): void {
  const adv = new AdvancementTracker(sim);
  sim.modules.push(adv);
  installMobs(sim);
  void game;
}
