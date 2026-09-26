import { itemsForLevel, ITEM_BY_ID } from '../config/ItemCatalog.js';

export const MAX_LEVEL = 50;
export const xpToNext = (level) => 500 + 55 * (level - 1);

export const XP = { match: 150, win: 120, draw: 40, goal: 45, assist: 30, save: 30, shot: 10, mvp: 60, trainingDrill: 15, tournamentWin: 600 };

// Expérience, niveaux (1 → 50) et récompenses cosmétiques associées.
export class ProgressionSystem {
  constructor(save) { this.save = save; }

  get level() { return this.save.data.profile.level; }
  get xp() { return this.save.data.profile.xp; }
  progress() { return this.level >= MAX_LEVEL ? 1 : this.xp / xpToNext(this.level); }

  matchXp(result) {
    const st = result.playerStats || {};
    const lines = [['Participation', XP.match]];
    if (result.playerWon) lines.push(['Victoire', XP.win]);
    else if (result.winner === -1) lines.push(['Égalité', XP.draw]);
    if (st.goals) lines.push([`Buts ×${st.goals}`, st.goals * XP.goal]);
    if (st.assists) lines.push([`Passes ×${st.assists}`, st.assists * XP.assist]);
    if (st.saves) lines.push([`Arrêts ×${st.saves}`, st.saves * XP.save]);
    if (st.shots) lines.push([`Tirs ×${st.shots}`, st.shots * XP.shot]);
    if (result.mvp && result.mvp.id === 0 && !result.spectator) lines.push(['MVP', XP.mvp]);
    return lines;
  }

  // Ajoute de l'XP ; retourne les niveaux gagnés et les objets débloqués.
  addXp(amount) {
    const p = this.save.data.profile;
    const before = p.level;
    const unlocked = [];
    p.xp += amount;
    while (p.level < MAX_LEVEL && p.xp >= xpToNext(p.level)) {
      p.xp -= xpToNext(p.level);
      p.level++;
      for (const it of itemsForLevel(p.level)) unlocked.push(this.unlock(it.id));
    }
    if (p.level >= MAX_LEVEL) p.xp = 0;
    this.save.save();
    return { levelsGained: p.level - before, unlocked: unlocked.filter(Boolean) };
  }

  unlock(id) {
    const d = this.save.data;
    if (d.unlocked.includes(id)) return null;
    d.unlocked.push(id);
    d.newItems.push(id);
    return ITEM_BY_ID[id];
  }

  // Rattrapage : garantit que tout objet d'un niveau atteint est débloqué.
  sync() {
    for (let l = 1; l <= this.level; l++) for (const it of itemsForLevel(l)) this.unlock(it.id);
    this.save.data.newItems = this.save.data.newItems.filter((id) => ITEM_BY_ID[id]);
  }

  recordMatch(result, seconds) {
    const s = this.save.data.stats;
    const st = result.playerStats || {};
    s.matches++;
    if (result.playerWon) s.wins++;
    else if (result.winner === -1) s.draws++;
    else s.losses++;
    s.goals += st.goals || 0;
    s.assists += st.assists || 0;
    s.saves += st.saves || 0;
    s.shots += st.shots || 0;
    if (result.mvp && result.mvp.id === 0) s.mvps++;
    s.playTime += seconds;
  }
}
