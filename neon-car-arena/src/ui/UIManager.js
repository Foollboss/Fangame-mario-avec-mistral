import { el, esc, onTap, bindAll, segmented } from './dom.js';
import { ARENAS, ARENA_IDS } from '../config/ArenaCatalog.js';
import { DIFFICULTY } from '../controllers/BotAI.js';
import { DRILLS } from '../sim/TrainingDrills.js';
import { CUPS } from '../meta/TournamentSystem.js';
import { ITEM_BY_ID } from '../config/ItemCatalog.js';
import { xpToNext, MAX_LEVEL } from '../meta/ProgressionSystem.js';
import { GarageScreen } from './screens/GarageScreen.js';
import { SettingsScreen } from './screens/SettingsScreen.js';
import { ResultsScreen } from './screens/ResultsScreen.js';

const MODES = [
  { id: 'quick', name: 'Match rapide', desc: '3 contre 3 face aux bots', size: 3, big: '3v3' },
  { id: 'duel', name: 'Duel', desc: 'Un contre un', size: 1, big: '1v1' },
  { id: 'doubles', name: 'Doubles', desc: 'Deux contre deux', size: 2, big: '2v2' },
  { id: 'chaos', name: 'Chaos', desc: '4 contre 4, pure folie', size: 4, big: '4v4' },
];

// Gestion des écrans (DOM) : menus, garage, réglages, pause, résultats.
export class UIManager {
  constructor(root, game) {
    this.root = root;
    this.game = game;
    this.current = null;
    this.screenName = null;
  }

  clear() {
    this.current?.destroy?.();
    this.current = null;
    this.root.querySelectorAll(':scope > .screen, :scope > .modal').forEach((n) => n.remove());
  }

  mount(node, name, ctrl = null) {
    this.clear();
    this.root.appendChild(node);
    this.screenName = name;
    this.current = ctrl;
    this.game.onScreen?.(name);
    return node;
  }

  toast(text) {
    const t = el(`<div class="toast">${esc(text)}</div>`);
    this.root.appendChild(t);
    setTimeout(() => t.remove(), 2700);
  }

  sfx(kind = 'click') { this.game.audio[kind]?.(); }

  // ---------- Écran titre ----------
  boot(onStart) {
    const n = this.mount(el(`<div class="screen boot">
      <h1 class="logo"><span class="a">NEON</span> <span class="b">CAR</span><small>ARENA</small></h1>
      <div class="tap">TOUCHER POUR JOUER</div>
      <p class="muted small" style="margin-top:22px">Football automobile arcade · 100 % gratuit, aucun achat</p>
    </div>`), 'boot');
    onTap(n, () => onStart());
  }

  // ---------- Menu principal ----------
  menu() {
    const g = this.game;
    const d = g.save.data;
    const p = d.profile;
    const title = ITEM_BY_ID[d.loadout.title]?.name || '';
    const pct = p.level >= MAX_LEVEL ? 100 : Math.round(100 * p.xp / xpToNext(p.level));
    const newCount = g.custom.newCount();
    const t = g.tournament.current();
    const n = this.mount(el(`<div class="screen dim menu">
      <div class="menu-left">
        <h1 class="logo"><span class="a">NEON</span> <span class="b">CAR</span><small>ARENA</small></h1>
        <button class="mbtn primary" data-go="play">JOUER <span>▶</span></button>
        <button class="mbtn" data-go="garage">GARAGE ${newCount ? `<span class="tag">${newCount} NOUVEAU${newCount > 1 ? 'X' : ''}</span>` : '<span>🚗</span>'}</button>
        <button class="mbtn" data-go="training">ENTRAÎNEMENT <span>◎</span></button>
        <button class="mbtn" data-go="tournament">TOURNOIS ${t ? '<span class="tag">EN COURS</span>' : '<span>🏆</span>'}</button>
        <button class="mbtn" data-go="settings">PARAMÈTRES <span>⚙</span></button>
      </div>
      <div class="menu-right">
        <div class="panel profile-card" data-go="profile">
          <div class="lvl-badge">${p.level}</div>
          <div style="flex:1">
            <div style="font-weight:800">${esc(p.name)}</div>
            <div class="muted small">${esc(title)}</div>
            <div class="xpbar"><div style="width:${pct}%"></div></div>
            <div class="muted small" style="margin-top:3px">${p.level >= MAX_LEVEL ? 'Niveau max' : `${p.xp} / ${xpToNext(p.level)} XP`}</div>
          </div>
        </div>
        <div class="panel quick-stats">
          <div><b>${d.stats.matches}</b>Matchs</div>
          <div><b>${d.stats.wins}</b>Victoires</div>
          <div><b>${d.stats.goals}</b>Buts</div>
          <div><b>${d.stats.mvps}</b>MVP</div>
        </div>
      </div>
    </div>`), 'menu');
    bindAll(n, '[data-go]', (b) => { this.sfx(); this.go(b.dataset.go); });
  }

  go(name) {
    if (name === 'play') this.play();
    else if (name === 'garage') this.garage();
    else if (name === 'training') this.training();
    else if (name === 'tournament') this.tournamentScreen();
    else if (name === 'settings') this.settings();
    else if (name === 'profile') this.profile();
    else this.menu();
  }

  header(title) {
    return `<div class="title-row"><button class="back" data-back>‹</button><h2>${title}</h2></div>`;
  }

  bindBack(n, fn = () => this.menu()) {
    bindAll(n, '[data-back]', () => { this.sfx('back'); fn(); });
  }

  // ---------- Jouer ----------
  play() {
    const g = this.game;
    const gs = g.save.data.settings.game;
    let mode = this.lastMode || 'quick';
    const n = this.mount(el(`<div class="screen full">
      ${this.header('Jouer')}
      <div class="scroll play-grid">
        <div class="cards two" data-modes>
          ${MODES.map((m) => `<div class="card" data-mode="${m.id}"><div class="big">${m.big}</div><h3>${m.name}</h3><p>${m.desc}</p></div>`).join('')}
        </div>
        <div>
          <div class="label" style="margin-top:0">Difficulté des bots</div>
          <div class="seg" data-seg="diff">${Object.values(DIFFICULTY).map((dd) => `<button data-v="${dd.id}">${dd.label}</button>`).join('')}</div>
          <div class="label">Arène</div>
          <div class="seg" data-seg="arena">${ARENA_IDS.map((id) => `<button data-v="${id}">${ARENAS[id].name}</button>`).join('')}<button data-v="random">Aléatoire</button></div>
          <div class="label">Durée</div>
          <div class="seg" data-seg="dur"><button data-v="120">2 min</button><button data-v="180">3 min</button><button data-v="300">5 min</button></div>
        </div>
      </div>
      <div class="bottom-bar"><button class="btn" data-start style="min-width:200px">LANCER LE MATCH ▶</button></div>
    </div>`), 'play');
    const sel = () => n.querySelectorAll('[data-mode]').forEach((c) => c.classList.toggle('sel', c.dataset.mode === mode));
    sel();
    bindAll(n, '[data-mode]', (c) => { mode = c.dataset.mode; this.lastMode = mode; sel(); this.sfx(); });
    segmented(n, 'diff', gs.difficulty, (v) => { gs.difficulty = v; g.save.save(); });
    segmented(n, 'arena', gs.arena, (v) => { gs.arena = v; g.save.save(); });
    segmented(n, 'dur', gs.duration, (v) => { gs.duration = Number(v); g.save.save(); });
    this.bindBack(n);
    onTap(n.querySelector('[data-start]'), () => {
      const m = MODES.find((x) => x.id === mode);
      const arenaId = gs.arena === 'random' ? ARENA_IDS[Math.floor(Math.random() * ARENA_IDS.length)] : gs.arena;
      g.startMatch({ mode: m.id === 'doubles' ? 'quick' : m.id, label: m.name, teamSize: m.size, difficulty: gs.difficulty, duration: gs.duration, arenaId });
    });
  }

  // ---------- Entraînement ----------
  training() {
    const g = this.game;
    let drill = this.lastDrill || 'free';
    let arena = g.save.data.settings.game.arena === 'random' ? 'neon_dome' : g.save.data.settings.game.arena;
    const n = this.mount(el(`<div class="screen full">
      ${this.header('Entraînement')}
      <div class="scroll">
        <div class="cards">${Object.values(DRILLS).map((d) => `<div class="card" data-drill="${d.id}"><h3>${d.label}</h3><p>${d.desc}</p></div>`).join('')}</div>
        <div class="label">Arène</div>
        <div class="seg" data-seg="arena">${ARENA_IDS.map((id) => `<button data-v="${id}">${ARENAS[id].name}</button>`).join('')}</div>
        <p class="muted small">Boost illimité. Bouton ⟲ (ou touche R) : replacer la balle. Aucun chronomètre, aucune pression.</p>
      </div>
      <div class="bottom-bar"><button class="btn" data-start style="min-width:200px">COMMENCER ▶</button></div>
    </div>`), 'training');
    const sel = () => n.querySelectorAll('[data-drill]').forEach((c) => c.classList.toggle('sel', c.dataset.drill === drill));
    sel();
    bindAll(n, '[data-drill]', (c) => { drill = c.dataset.drill; this.lastDrill = drill; sel(); this.sfx(); });
    segmented(n, 'arena', arena, (v) => { arena = v; });
    this.bindBack(n);
    onTap(n.querySelector('[data-start]'), () => g.startMatch({ mode: 'training', label: 'Entraînement', drill, arenaId: arena }));
  }

  // ---------- Tournois ----------
  tournamentScreen() {
    const g = this.game;
    const cur = g.tournament.current();
    const t = g.tournament.state;
    const lvl = g.save.data.profile.level;
    const req = { bronze: 1, silver: 5, gold: 12 };
    const bracket = cur ? `
      <div class="panel">
        <div class="label" style="margin-top:0">${cur.cup.label}</div>
        ${['Quart de finale', 'Demi-finale', 'Finale'].map((r, i) => {
          const res = t.results[i];
          const state = res ? (res.won ? `✔ ${res.score.join(' - ')}` : `✖ ${res.score.join(' - ')}`) : i === cur.round ? '▶ À jouer' : '—';
          return `<div class="set-row"><label>${r} · ${esc(t.opponents[i])} <span class="muted small">(${DIFFICULTY[cur.cup.rounds[i]].label} · ${ARENAS[t.arenas[i]].name})</span></label><b>${state}</b></div>`;
        }).join('')}
        <div class="row" style="margin-top:12px;justify-content:flex-end">
          <button class="btn secondary" data-abandon>Abandonner</button>
          <button class="btn" data-next>JOUER : ${cur.roundName.toUpperCase()} ▶</button>
        </div>
      </div>` : `
      <div class="cards">${Object.values(CUPS).map((c) => `
        <div class="card ${lvl < req[c.id] ? 'locked' : ''}" data-cup="${c.id}" style="${lvl < req[c.id] ? 'opacity:.45' : ''}">
          <div class="big" style="color:${c.id === 'gold' ? 'var(--gold)' : c.id === 'silver' ? '#cfd8e8' : '#e0925a'}">🏆</div>
          <h3>${c.label}</h3><p>3 matchs 3v3 à élimination directe · ${c.rounds.map((r) => DIFFICULTY[r].label).join(' → ')}</p>
          <p style="margin-top:6px"><b>+${c.xp} XP</b> ${lvl < req[c.id] ? `· Niveau ${req[c.id]} requis` : ''}</p>
        </div>`).join('')}</div>
      <p class="muted small">Gagnez la Coupe Or pour obtenir le titre « Champion de tournoi ». Victoires : ${g.save.data.stats.tournamentsWon}</p>`;
    const n = this.mount(el(`<div class="screen full">${this.header('Tournois')}<div class="scroll">${bracket}</div></div>`), 'tournament');
    this.bindBack(n);
    bindAll(n, '[data-cup]', (c) => {
      if (lvl < req[c.dataset.cup]) { this.toast(`Niveau ${req[c.dataset.cup]} requis`); return; }
      g.tournament.start(c.dataset.cup, [...ARENA_IDS].sort(() => Math.random() - 0.5));
      this.sfx();
      this.tournamentScreen();
    });
    const next = n.querySelector('[data-next]');
    if (next) onTap(next, () => g.startTournamentMatch());
    const ab = n.querySelector('[data-abandon]');
    if (ab) onTap(ab, () => { g.tournament.abandon(); this.tournamentScreen(); });
  }

  // ---------- Profil / statistiques ----------
  profile() {
    const d = this.game.save.data;
    const s = d.stats;
    const ratio = s.matches ? Math.round(100 * s.wins / s.matches) : 0;
    const titles = Object.values(ITEM_BY_ID).filter((i) => i.cat === 'title' && d.unlocked.includes(i.id));
    const n = this.mount(el(`<div class="screen full">
      ${this.header('Profil')}
      <div class="scroll">
        <div class="panel" style="display:flex;gap:14px;align-items:center">
          <div class="lvl-badge" style="width:70px;height:70px;font-size:30px">${d.profile.level}</div>
          <div><div style="font-size:22px;font-weight:900">${esc(d.profile.name)}</div>
          <div class="muted">Niveau ${d.profile.level} / ${MAX_LEVEL} · ${titles.length} titres</div></div>
        </div>
        <div class="label">Statistiques</div>
        <div class="cards">
          ${[['Matchs', s.matches], ['Victoires', s.wins], ['Défaites', s.losses], ['Nuls', s.draws], ['% victoires', ratio + '%'], ['Buts', s.goals], ['Passes D.', s.assists], ['Arrêts', s.saves], ['Tirs', s.shots], ['MVP', s.mvps], ['Tournois gagnés', s.tournamentsWon], ['Temps de jeu', Math.round(s.playTime / 60) + ' min']]
            .map(([k, v]) => `<div class="card" style="min-height:0"><div class="big">${v}</div><p>${k}</p></div>`).join('')}
        </div>
        <div class="label">Titre affiché</div>
        <div class="seg" data-seg="title">${titles.map((t) => `<button data-v="${t.id}">${esc(t.name)}</button>`).join('')}</div>
      </div>
    </div>`), 'profile');
    this.bindBack(n);
    segmented(n, 'title', d.loadout.title, (v) => this.game.custom.equip(v));
  }

  garage() { const s = new GarageScreen(this); this.mount(s.node, 'garage', s); }
  settings(from = 'menu') { const s = new SettingsScreen(this, from); this.mount(s.node, 'settings', s); }
  results(result, extra) { const s = new ResultsScreen(this, result, extra); this.mount(s.node, 'results', s); }

  // ---------- Pause ----------
  pause() {
    const g = this.game;
    const training = g.match?.training;
    const n = this.mount(el(`<div class="screen full" style="align-items:center;justify-content:center">
      <h2 style="font-style:italic;font-size:34px;margin:0 0 16px">PAUSE</h2>
      <div class="grid" style="width:min(90vw,320px)">
        <button class="btn" data-a="resume">Reprendre</button>
        ${training ? '<button class="btn secondary" data-a="reset">Replacer la balle</button>' : ''}
        <button class="btn secondary" data-a="settings">Paramètres</button>
        <button class="btn warn" data-a="quit">${training ? 'Quitter l\'entraînement' : 'Abandonner le match'}</button>
      </div>
    </div>`), 'pause');
    bindAll(n, '[data-a]', (b) => {
      const a = b.dataset.a;
      if (a === 'resume') g.resume();
      if (a === 'reset') { g.resetDrill(); g.resume(); }
      if (a === 'settings') this.settings('pause');
      if (a === 'quit') g.quitMatch();
    });
  }

  confirm(text, ok) {
    const m = el(`<div class="modal"><div class="panel"><p style="font-weight:700">${esc(text)}</p><div class="row" style="justify-content:flex-end"><button class="btn secondary" data-n>Annuler</button><button class="btn warn" data-y>Confirmer</button></div></div></div>`);
    this.root.appendChild(m);
    onTap(m.querySelector('[data-n]'), () => m.remove());
    onTap(m.querySelector('[data-y]'), () => { m.remove(); ok(); });
  }
}
