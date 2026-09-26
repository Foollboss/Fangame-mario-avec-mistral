import { el, esc, onTap } from '../dom.js';
import { TEAM } from '../../config/GameConfig.js';
import { RARITY } from '../../config/ItemCatalog.js';
import { xpToNext, MAX_LEVEL } from '../../meta/ProgressionSystem.js';

// Écran de fin de match : score, tableau des joueurs, MVP, XP gagnée, déblocages.
export class ResultsScreen {
  constructor(ui, r, extra) {
    this.ui = ui;
    const g = ui.game;
    const me = r.playerTeam;
    const title = r.winner === -1 ? 'ÉGALITÉ' : r.playerWon ? 'VICTOIRE' : 'DÉFAITE';
    const color = r.winner === -1 ? 'var(--text)' : r.playerWon ? 'var(--ok)' : 'var(--bad)';
    const rows = [...r.players].sort((a, b) => a.team - b.team || b.points - a.points);
    const p = g.save.data.profile;
    const pct = p.level >= MAX_LEVEL ? 100 : Math.round(100 * p.xp / xpToNext(p.level));
    const t = extra.tournament;
    this.node = el(`<div class="screen full results">
      <div class="results-grid">
        <div>
          <div style="text-align:center">
            <div style="font-size:clamp(26px,7vmin,50px);font-weight:900;font-style:italic;color:${color}">${title}</div>
            ${t ? `<div class="muted small">${esc(t.cup.label)} · ${t.champion ? '🏆 CHAMPION !' : t.finished ? 'Éliminé' : 'Qualifié pour le tour suivant'}</div>` : ''}
            <div class="big-score" style="justify-content:center">
              <span style="color:${TEAM[0].css}">${r.score[0]}</span><span class="muted" style="font-size:.5em">—</span><span style="color:${TEAM[1].css}">${r.score[1]}</span>
            </div>
            ${r.overtime ? '<div class="muted small">Après prolongation</div>' : ''}
          </div>
          <div class="panel xp-lines" style="margin-top:8px">
            ${extra.xpLines.map(([k, v]) => `<div><span>${esc(k)}</span><b>+${v}</b></div>`).join('')}
            <div style="border-top:1px solid var(--line);margin-top:4px;padding-top:4px"><span>Total</span><b style="color:var(--cyan)">+${extra.xpTotal} XP</b></div>
            <div class="xpbar"><div style="width:${pct}%"></div></div>
            <div class="muted small" style="margin-top:4px">Niveau ${p.level}${extra.levelsGained ? ` <b style="color:var(--gold)">▲ +${extra.levelsGained}</b>` : ''}</div>
          </div>
          ${extra.unlocked.length ? `<div class="panel" style="margin-top:8px">
            <div class="label" style="margin-top:0">Nouveaux objets débloqués</div>
            <div class="unlock-list">${extra.unlocked.map((it) => `<span style="border-color:${RARITY[it.rarity].color};color:${RARITY[it.rarity].color}">${esc(it.name)}</span>`).join('')}</div>
          </div>` : ''}
        </div>
        <div class="panel">
          <table>
            <tr><th>Joueur</th><th>Pts</th><th>Buts</th><th>Passes</th><th>Arrêts</th><th>Tirs</th></tr>
            ${rows.map((pl) => `<tr class="${pl.id === 0 && !r.spectator ? 'me' : ''}">
              <td><span style="color:${TEAM[pl.team].css}">■</span> ${esc(pl.name)}${r.mvp && r.mvp.id === pl.id ? ' <b style="color:var(--gold)">MVP</b>' : ''}</td>
              <td>${pl.points}</td><td>${pl.goals}</td><td>${pl.assists}</td><td>${pl.saves}</td><td>${pl.shots}</td></tr>`).join('')}
          </table>
        </div>
      </div>
      <div class="bottom-bar" style="justify-content:center">
        <button class="btn secondary" data-menu>Menu</button>
        ${t && !t.finished ? '<button class="btn" data-next>Match suivant ▶</button>' : t ? '' : '<button class="btn" data-again>Rejouer ▶</button>'}
      </div>
    </div>`);
    onTap(this.node.querySelector('[data-menu]'), () => { ui.sfx(); g.toMenu(); });
    const again = this.node.querySelector('[data-again]');
    if (again) onTap(again, () => g.rematch());
    const next = this.node.querySelector('[data-next]');
    if (next) onTap(next, () => g.startTournamentMatch());
    if (extra.levelsGained) g.audio.levelUp();
  }
}
