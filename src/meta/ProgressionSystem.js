import { rewardsForLevel, getItem } from './Catalog.js';

export const MAX_LEVEL = 50;

// XP needed to go from `level` to `level + 1`.
export const xpForNext = (level) => 150 + 30 * (level - 1);

export function levelFromXp(xp) {
  let level = 1;
  let rest = xp;
  while (level < MAX_LEVEL && rest >= xpForNext(level)) {
    rest -= xpForNext(level);
    level++;
  }
  return { level, into: rest, need: level < MAX_LEVEL ? xpForNext(level) : 0 };
}

export const DIFFICULTY_XP = { easy: 0.8, medium: 1, hard: 1.25, expert: 1.5 };

// XP breakdown for a finished match (the local player's car stats).
export function matchXp({ won, draw, stats, mvp, difficulty, forfeit, tournamentWin }) {
  if (forfeit) return { total: 25, lines: [['Participation', 25]] };
  const mult = DIFFICULTY_XP[difficulty] || 1;
  const lines = [['Participation', 100]];
  if (won) lines.push(['Victoire', 100]);
  else if (draw) lines.push(['Match nul', 40]);
  if (stats.goals) lines.push([`Buts ×${stats.goals}`, stats.goals * 40]);
  if (stats.assists) lines.push([`Passes ×${stats.assists}`, stats.assists * 25]);
  if (stats.saves) lines.push([`Arrêts ×${stats.saves}`, stats.saves * 30]);
  if (stats.shots) lines.push([`Tirs ×${stats.shots}`, stats.shots * 10]);
  if (mvp) lines.push(['MVP', 50]);
  let total = lines.reduce((s, l) => s + l[1], 0);
  if (mult !== 1) {
    const bonus = Math.round(total * (mult - 1));
    lines.push([`Difficulté ×${mult}`, bonus]);
    total += bonus;
  }
  if (tournamentWin) {
    lines.push(['Tournoi remporté', 500]);
    total += 500;
  }
  return { total, lines };
}

export class ProgressionSystem {
  constructor(save) {
    this.save = save;
  }

  get data() {
    return this.save.data;
  }

  get level() {
    return levelFromXp(this.data.profile.xp).level;
  }

  info() {
    return levelFromXp(this.data.profile.xp);
  }

  // Adds XP, unlocks every reward of the levels crossed. Returns what happened for the UI.
  addXp(amount) {
    const before = levelFromXp(this.data.profile.xp);
    this.data.profile.xp += amount;
    const after = levelFromXp(this.data.profile.xp);
    const rewards = [];
    for (let l = before.level + 1; l <= after.level; l++) {
      for (const item of rewardsForLevel(l)) {
        if (this.unlock(item.id)) rewards.push(item);
      }
    }
    this.save.save();
    return { before, after, rewards, levelsGained: after.level - before.level };
  }

  unlock(id) {
    const d = this.data;
    if (d.unlocked.includes(id) || !getItem(id)) return false;
    d.unlocked.push(id);
    d.newItems.push(id);
    return true;
  }

  // Re-grants anything the current level entitles the player to (safety after updates).
  reconcile() {
    const lvl = this.level;
    for (let l = 2; l <= lvl; l++) for (const item of rewardsForLevel(l)) this.unlock(item.id);
  }

  nextRewards(count = 3) {
    const out = [];
    for (let l = this.level + 1; l <= MAX_LEVEL && out.length < count; l++) {
      for (const item of rewardsForLevel(l)) out.push({ level: l, item });
    }
    return out.slice(0, count);
  }
}
