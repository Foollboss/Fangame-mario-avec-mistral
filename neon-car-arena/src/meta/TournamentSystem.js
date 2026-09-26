import { ITEM_BY_ID } from '../config/ItemCatalog.js';

export const CUPS = {
  bronze: { id: 'bronze', label: 'Coupe Bronze', rounds: ['easy', 'medium', 'medium'], xp: 400 },
  silver: { id: 'silver', label: 'Coupe Argent', rounds: ['medium', 'hard', 'hard'], xp: 700 },
  gold: { id: 'gold', label: 'Coupe Or', rounds: ['hard', 'hard', 'expert'], xp: 1100 },
};
const ROUND_NAMES = ['Quart de finale', 'Demi-finale', 'Finale'];
const OPPONENTS = ['Les Comètes', 'Vortex FC', 'Titans du Néon', 'Orage Magnétique', 'Les Spectres', 'Nova Rush', 'Horizon 7', 'Les Fusées Rouges'];

// Tournoi : 3 matchs successifs à élimination directe, progression sauvegardée.
export class TournamentSystem {
  constructor(save) { this.save = save; }

  get state() { return this.save.data.tournament; }

  start(cupId, arenas) {
    const cup = CUPS[cupId];
    const pool = [...OPPONENTS].sort(() => Math.random() - 0.5);
    this.save.data.tournament = {
      cup: cupId, round: 0, results: [], eliminated: false, done: false,
      opponents: cup.rounds.map((_, i) => pool[i]),
      arenas: cup.rounds.map((_, i) => arenas[i % arenas.length]),
    };
    this.save.save();
    return this.state;
  }

  current() {
    const t = this.state;
    if (!t || t.done) return null;
    const cup = CUPS[t.cup];
    return { cup, round: t.round, roundName: ROUND_NAMES[t.round], opponent: t.opponents[t.round], difficulty: cup.rounds[t.round], arena: t.arenas[t.round] };
  }

  // Enregistre le résultat du match en cours. Retourne { won, finished, champion }.
  report(result) {
    const t = this.state;
    if (!t || t.done) return null;
    const won = result.playerWon;
    t.results.push({ score: result.score, won });
    if (!won) { t.eliminated = true; t.done = true; }
    else if (t.round >= 2) { t.done = true; }
    else t.round++;
    this.save.save();
    const champion = t.done && !t.eliminated;
    return { won, finished: t.done, champion, cup: CUPS[t.cup], title: champion ? ITEM_BY_ID.title_champion : null };
  }

  abandon() { this.save.data.tournament = null; this.save.save(); }
}
