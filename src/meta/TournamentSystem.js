const TEAM_NAMES = [
  'Vipères Néon', 'Titans d’Acier', 'Orbit Kings', 'Comètes Rouges', 'Pulsars', 'Les Fusées Grises',
  'Zénith Racing', 'Nébuleuse FC', 'Turbo Lynx', 'Dunes Rapides', 'Axe Voltaïque', 'Écume Céleste',
];

const ROUNDS = ['Quart de finale', 'Demi-finale', 'Finale'];
const STEP = { easy: ['easy', 'easy', 'medium'], medium: ['medium', 'medium', 'hard'], hard: ['hard', 'hard', 'expert'], expert: ['expert', 'expert', 'expert'] };

// Three knock-out rounds of 3v3. One defeat ends the run; winning the final grants the Champion title.
export class TournamentSystem {
  constructor(save) {
    this.save = save;
  }

  get state() {
    return this.save.data.tournament;
  }

  start(difficulty, arenaCycle = ['neon', 'desert', 'sky']) {
    const pool = TEAM_NAMES.slice().sort(() => Math.random() - 0.5);
    this.save.data.tournament = {
      difficulty,
      round: 0,
      opponents: pool.slice(0, 3),
      arenas: arenaCycle.slice().sort(() => Math.random() - 0.5),
      results: [],
      status: 'running',
    };
    this.save.save();
    return this.state;
  }

  roundName(i = this.state?.round || 0) {
    return ROUNDS[i];
  }

  nextMatch() {
    const t = this.state;
    if (!t || t.status !== 'running') return null;
    return {
      round: t.round,
      roundName: ROUNDS[t.round],
      opponent: t.opponents[t.round],
      difficulty: STEP[t.difficulty][t.round],
      arena: t.arenas[t.round % t.arenas.length],
    };
  }

  // Returns 'next' | 'eliminated' | 'champion'
  report(score, won) {
    const t = this.state;
    if (!t) return null;
    t.results.push({ round: t.round, score, won });
    if (!won) {
      t.status = 'eliminated';
    } else if (t.round >= ROUNDS.length - 1) {
      t.status = 'champion';
      this.save.data.stats.tournamentsWon++;
    } else {
      t.round++;
    }
    this.save.save();
    return t.status === 'running' ? 'next' : t.status;
  }

  abandon() {
    this.save.data.tournament = null;
    this.save.save();
  }
}

export const TOURNAMENT_ROUNDS = ROUNDS;
