import { TEAM } from '../core/Config.js';
import { DIFFICULTIES } from '../ai/BotAI.js';
import { THEME_LIST, THEMES } from '../render/Themes.js';
import { DRILLS } from '../game/TrainingManager.js';
import { getVehicle } from '../game/Vehicles.js';
import { getItem, RARITY } from '../meta/Catalog.js';
import { MAX_LEVEL } from '../meta/ProgressionSystem.js';
import { SETTING_LIMITS } from '../meta/Settings.js';
import { QUALITY } from '../render/Quality.js';

const BACK = '<svg viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8" stroke="#eaf2ff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const MODES = {
  quick: { name: 'Match rapide', size: 3, tag: '3 CONTRE 3', desc: 'Le format de référence, avec des coéquipiers bots.' },
  duel: { name: 'Duel', size: 1, tag: '1 CONTRE 1', desc: 'Seul contre un bot. Aucune excuse.' },
  chaos: { name: 'Chaos', size: 4, tag: '4 CONTRE 4', desc: 'Huit voitures, une balle, beaucoup de contacts.' },
};
export { MODES };

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const btn = (label, act, cls = '', sub = '') => `<button class="btn ${cls}" data-act="${act}"><span class="face"><span>${label}${sub ? `<br><span class="sub">${sub}</span>` : ''}</span></span></button>`;
const seg = (name, options, value, cls = '') => `<div class="seg ${cls}" data-seg="${name}">${options.map(([v, l]) => `<button data-v="${v}" class="${String(v) === String(value) ? 'sel' : ''}">${l}</button>`).join('')}</div>`;

export class UIManager {
  constructor(root, game) {
    this.root = root;
    this.game = game;
    this.current = null;
    this.stack = [];
    this.params = {};
    root.addEventListener('click', (e) => this.onClick(e));
  }

  get save() { return this.game.save.data; }

  // ---------- plumbing ----------
  show(id, params = {}) {
    this.current = id;
    this.params = params;
    this.root.innerHTML = '';
    if (!id) return;
    const html = this[`render_${id}`](params);
    this.root.innerHTML = html;
    this.after && this.after();
    this.after = null;
    this.game.onScreen(id);
  }

  refresh() {
    if (this.current) this.show(this.current, this.params);
  }

  onClick(e) {
    const segBtn = e.target.closest('[data-seg] button');
    if (segBtn) {
      const segEl = segBtn.parentElement;
      segEl.querySelectorAll('button').forEach((b) => b.classList.toggle('sel', b === segBtn));
      this.game.audio.click();
      this.onSeg && this.onSeg(segEl.dataset.seg, segBtn.dataset.v);
      return;
    }
    const el = e.target.closest('[data-act]');
    if (!el) return;
    this.game.audio.click();
    const act = el.dataset.act;
    const arg = el.dataset.arg;
    const h = this.actions[act];
    if (h) h.call(this, arg, el);
  }

  toast(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  modal(html, onAction) {
    this.closeModal();
    const m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = `<div class="box">${html}</div>`;
    m.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (b) {
        this.game.audio.click();
        onAction(b.dataset.act, b);
      }
    });
    document.body.appendChild(m);
    this.modalEl = m;
    return m;
  }

  closeModal() {
    this.modalEl?.remove();
    this.modalEl = null;
  }

  topbar(title, backAct = 'back') {
    return `<div class="topbar"><button class="back" data-act="${backAct}" aria-label="Retour">${BACK}</button><h2>${title}</h2><div class="spacer"></div></div>`;
  }

  // ---------- screens ----------
  render_splash() {
    return `<div class="screen" id="splash" data-act="start">
      <div class="logo"><span class="l1">NEON CAR</span><span class="l2">AR<b>E</b>NA</span></div>
      <div class="tap">TOUCHEZ POUR COMMENCER</div>
      <div class="foot">Football automobile arcade · Paysage recommandé</div>
    </div>`;
  }

  render_menu() {
    const g = this.game;
    const info = g.progression.info();
    const pct = info.need ? Math.round((info.into / info.need) * 100) : 100;
    const lp = this.save.lastPlay;
    const car = getVehicle(this.save.equipped.car);
    const newItems = this.save.newItems.length;
    return `<div class="screen dim" id="menu">
      <div class="menu-col">
        <div class="logo"><span class="l1">NEON CAR</span><span class="l2">AR<b>E</b>NA</span></div>
        <div class="profile-card" data-act="profile">
          <div class="lvl-badge">${info.level}</div>
          <div class="who"><div class="name">${esc(this.save.profile.name)}</div><div class="title">${esc(g.custom.titleText())}</div>
          <div class="xpbar"><i style="width:${pct}%"></i></div></div>
        </div>
        <div class="menu-list">
          ${btn('Jouer', 'play', 'primary', `${MODES[lp.mode]?.tag || '3 CONTRE 3'} · ${DIFFICULTIES[lp.difficulty]?.label || ''} · ${THEMES[lp.arena]?.name || 'Aléatoire'}`)}
          ${btn('Entraînement', 'training')}
          ${btn('Tournois', 'tournament', '', this.save.tournament?.status === 'running' ? 'Tournoi en cours' : '')}
          ${btn(`Garage ${newItems ? '<span class="dot"></span>' : ''}`, 'garage')}
          ${btn('Paramètres', 'settings')}
        </div>
        ${g.save.persistent ? '' : '<div class="warn">Sauvegarde locale indisponible ici : la progression sera perdue à la fermeture.</div>'}
      </div>
      <div class="menu-side">
        <span class="chip"><span class="dot" style="background:var(--cyan)"></span>${esc(car.name)} · ${esc(car.tagline)}</span>
      </div>
    </div>`;
  }

  render_play() {
    const lp = this.save.lastPlay;
    this.sel = { ...lp };
    this.onSeg = (k, v) => (this.sel[k] = k === 'duration' ? Number(v) : v);
    return `<div class="screen solid" id="play">
      ${this.topbar('Jouer')}
      <div class="scroll">
        <div class="label">Mode</div>
        <div class="grid cards">${Object.entries(MODES).map(([id, m]) => `<div class="card ${lp.mode === id ? 'sel' : ''}" data-act="pickMode" data-arg="${id}"><span class="tag">${m.tag}</span><h3>${m.name}</h3><p>${m.desc}</p></div>`).join('')}</div>
        <div class="three">
          <div><div class="label">Difficulté des bots</div>${seg('difficulty', Object.entries(DIFFICULTIES).map(([k, d]) => [k, d.label]), lp.difficulty, 'diff')}</div>
          <div><div class="label">Arène</div>${seg('arena', [...THEME_LIST.map((t) => [t.id, t.name]), ['random', 'Aléatoire']], lp.arena)}</div>
          <div><div class="label">Durée</div>${seg('duration', [[120, '2 min'], [180, '3 min'], [300, '5 min']], lp.duration)}</div>
        </div>
      </div>
      <div class="actions">${btn('Lancer le match', 'launch', 'primary')}</div>
    </div>`;
  }

  render_training() {
    this.sel = { drill: this.params.drill || 'free', arena: this.save.lastPlay.arena === 'random' ? 'neon' : this.save.lastPlay.arena };
    this.onSeg = (k, v) => (this.sel[k] = v);
    return `<div class="screen solid" id="training">
      ${this.topbar('Entraînement')}
      <div class="scroll">
        <div class="label">Exercice</div>
        <div class="grid cards">${Object.entries(DRILLS).map(([id, d]) => `<div class="card ${id === this.sel.drill ? 'sel' : ''}" data-act="pickDrill" data-arg="${id}"><h3>${d.label}</h3><p>${d.desc}</p></div>`).join('')}</div>
        <div class="label">Arène</div>${seg('arena', THEME_LIST.map((t) => [t.id, t.name]), this.sel.arena)}
        <p class="fair">Boost infini, pas de chrono, pas d’adversaire. Utilisez RÉINIT. pour recommencer un exercice.</p>
      </div>
      <div class="actions">${btn('Commencer', 'launchTraining', 'primary')}</div>
    </div>`;
  }

  render_tournament() {
    const t = this.save.tournament;
    const ts = this.game.tournament;
    if (!t || t.status !== 'running') {
      this.sel = { difficulty: t?.difficulty || 'medium' };
      this.onSeg = (k, v) => (this.sel[k] = v);
      const last = t ? `<div class="detail"><h3>${t.status === 'champion' ? 'Champion !' : 'Éliminé'}</h3><p class="fair">${t.results.map((r) => `${ts.roundName(r.round)} : ${r.score[0]}-${r.score[1]}`).join(' · ')}</p></div>` : '';
      return `<div class="screen solid" id="tournament">
        ${this.topbar('Tournois')}
        <div class="scroll">
          ${last}
          <p class="fair" style="font-size:14px">Trois matchs 3 contre 3 à élimination directe : quart, demi, finale. Chaque tour est un peu plus relevé. Le vainqueur remporte 500 XP bonus et le titre « Champion ».</p>
          <div class="label">Niveau du tournoi</div>${seg('difficulty', Object.entries(DIFFICULTIES).map(([k, d]) => [k, d.label]), this.sel.difficulty, 'diff')}
          <div class="label">Tournois remportés : ${this.save.stats.tournamentsWon}</div>
        </div>
        <div class="actions">${btn('Nouveau tournoi', 'startTournament', 'primary')}</div>
      </div>`;
    }
    const rounds = [0, 1, 2].map((i) => {
      const r = t.results.find((x) => x.round === i);
      const cls = r ? (r.won ? 'won' : 'lost') : i === t.round ? 'cur' : '';
      return `<div class="round ${cls}"><div class="rn">${ts.roundName(i)}</div><div class="vs">NOVA vs ${esc(t.opponents[i])}</div><div class="res">${r ? `${r.score[0]} - ${r.score[1]}` : i === t.round ? 'À JOUER' : '—'}</div><div class="fair">${THEMES[t.arenas[i % t.arenas.length]].name}</div></div>`;
    }).join('');
    return `<div class="screen solid" id="tournament">
      ${this.topbar('Tournoi · ' + DIFFICULTIES[t.difficulty].label)}
      <div class="scroll"><div class="bracket">${rounds}</div></div>
      <div class="actions">${btn('Abandonner', 'abandonTournament', 'ghost')}${btn(`Jouer : ${ts.roundName()}`, 'playTournament', 'primary')}</div>
    </div>`;
  }

  render_garage() {
    const g = this.game;
    const cats = g.custom.categories;
    const cat = this.params.cat || 'car';
    const eq = this.save.equipped;
    const items = g.custom.itemsFor(cat);
    const selId = this.params.sel || eq[cat];
    const sel = getItem(selId) || items[0];
    const r = RARITY[sel.rarity];
    const unlocked = g.custom.isUnlocked(sel.id);
    let extra = '';
    if (cat === 'car') {
      const v = getVehicle(sel.id);
      extra = `<p class="fair">${esc(v.desc)} Même budget de stats pour toutes.</p><div class="bars">${g.garage.statBars(sel.id).map((b) => `<div class="bar">${b.label}<div><i style="width:${b.value}%"></i></div></div>`).join('')}</div>`;
    } else {
      extra = '<p class="fair">Cosmétique uniquement : aucun effet sur la vitesse, la puissance ou le contrôle.</p>';
    }
    const action = unlocked
      ? (eq[cat] === sel.id ? '<div class="chip">Équipé</div>' : btn('Équiper', 'equip', 'primary'))
      : `<div class="chip">🔒 ${sel.tournament ? 'Gagnez un tournoi' : `Niveau ${sel.level}`}</div>`;
    return `<div class="screen" id="garage">
      <div class="g-left">
        ${this.topbar('Garage')}
        <div class="cats scroll">${cats.map((c) => `<button class="${c.id === cat ? 'sel' : ''}" data-act="garageCat" data-arg="${c.id}">${c.label}${g.custom.newCount(c.id) ? '<span class="dot"></span>' : ''}</button>`).join('')}</div>
      </div>
      <div class="g-mid"></div>
      <div class="g-right">
        <div class="detail">
          <div class="head"><div><div class="rar" style="color:${r.color}">${r.label}</div><h3>${esc(sel.name)}</h3></div><div class="actions">${action}</div></div>${extra}
        </div>
        <div class="items scroll">${items.map((it) => this.itemTile(it, it.id === sel.id, eq[cat] === it.id)).join('')}</div>
      </div>
    </div>`;
  }

  itemTile(it, selected, equipped) {
    const g = this.game;
    const un = g.custom.isUnlocked(it.id);
    const r = RARITY[it.rarity];
    let sw = '';
    if (it.cat === 'color') sw = `<div class="sw" style="background:${it.animated ? 'conic-gradient(#ff3b8d,#ffd23f,#3dffa8,#19e6ff,#9b4dff,#ff3b8d)' : '#' + it.hex.toString(16).padStart(6, '0')}"></div>`;
    else if (it.cat === 'boost') sw = `<div class="sw" style="background:radial-gradient(circle,#${(it.core).toString(16).padStart(6, '0')},#${(it.edge).toString(16).padStart(6, '0')})"></div>`;
    else sw = `<div class="sw" style="border-color:${r.color}">${it.cat === 'car' ? '🏎' : it.cat === 'title' ? 'Aa' : '◆'}</div>`;
    return `<div class="item ${selected ? 'sel' : ''} ${equipped ? 'eq' : ''} ${un ? '' : 'locked'}" style="--r:${r.color}" data-act="garageItem" data-arg="${it.id}">
      ${g.custom.isNew(it.id) ? '<span class="nw"></span>' : ''}${sw}<div class="nm">${esc(it.name)}</div>${un ? '' : `<div class="rq">${it.tournament ? 'Tournoi' : `Niv. ${it.level}`}</div>`}</div>`;
  }

  render_settings() {
    const s = this.save.settings;
    const tab = this.params.tab || 'controls';
    const range = (group, key, label, hint = '', fmt = (v) => v) => {
      const [min, max, step] = SETTING_LIMITS[key];
      const v = s[group][key];
      return `<div class="row"><div class="k"><b>${label}</b>${hint ? `<small>${hint}</small>` : ''}</div>
        <input type="range" id="set-${group}-${key}" min="${min}" max="${max}" step="${step}" value="${v}" data-group="${group}" data-key="${key}">
        <output>${fmt(v)}</output></div>`;
    };
    const toggle = (group, key, label, hint = '') => `<div class="row"><div class="k"><b>${label}</b>${hint ? `<small>${hint}</small>` : ''}</div>
      <div class="switch ${s[group][key] ? 'on' : ''}" role="switch" tabindex="0" data-act="toggle" data-arg="${group}.${key}"></div></div>`;
    const pct = (v) => `${Math.round(v * 100)}%`;
    const x = (v) => `×${Number(v).toFixed(2)}`;
    let body = '';
    if (tab === 'controls') {
      body = [
        range('controls', 'sensitivity', 'Sensibilité de direction', 'Réponse du joystick', x),
        toggle('controls', 'invertY', 'Inverser l’axe vertical', 'Tangage en l’air'),
        toggle('controls', 'leftHanded', 'Mode gaucher', 'Joystick à droite, boutons à gauche'),
        toggle('controls', 'autoAccel', 'Accélération automatique', 'Jouable avec un seul pouce à droite'),
        toggle('controls', 'vibration', 'Vibrations'),
        range('controls', 'buttonScale', 'Taille des boutons', '', pct),
        range('controls', 'joystickSize', 'Taille du joystick', '', pct),
        `<div class="row"><div class="k"><b>Disposition des boutons</b><small>Glissez chaque bouton où vous voulez</small></div>${btn('Personnaliser', 'editLayout')}</div>`,
        '<p class="fair">Clavier : ZQSD/WASD ou flèches, Espace saut, Maj boost, E dash, C caméra balle, Échap pause. Manette compatible.</p>',
      ].join('');
    } else if (tab === 'camera') {
      body = [
        toggle('camera', 'ballCam', 'Caméra balle par défaut', 'Sinon caméra libre derrière la voiture'),
        toggle('camera', 'assist', 'Aide à la caméra', 'La caméra libre s’oriente un peu vers la balle'),
        toggle('camera', 'shake', 'Secousses'),
        range('camera', 'distance', 'Distance', '', (v) => Number(v).toFixed(1)),
        range('camera', 'height', 'Hauteur', '', (v) => Number(v).toFixed(1)),
        range('camera', 'fov', 'Champ de vision', '', (v) => `${v}°`),
        range('camera', 'stiffness', 'Réactivité', 'Vitesse de suivi de la caméra', x),
      ].join('');
    } else if (tab === 'graphics') {
      const g = s.graphics;
      const resolved = g.quality === 'auto' ? g.autoResolved || this.game.qualityId : g.quality;
      body = `<div class="row"><div class="k"><b>Qualité graphique</b><small>Auto : détectée pour votre appareil (actuellement ${QUALITY[resolved]?.label || ''})</small></div></div>
        ${seg('quality', [['auto', 'AUTO'], ['low', 'BASSE'], ['medium', 'MOYENNE'], ['high', 'HAUTE']], g.quality)}
        <div class="row"><div class="k"><b>Limite d’images</b><small>30 FPS économise la batterie</small></div></div>
        ${seg('fpsCap', [[30, '30 FPS'], [60, '60 FPS']], g.fpsCap)}
        ${toggle('graphics', 'showFps', 'Afficher les FPS')}
        ${toggle('gameplay', 'replays', 'Replays des buts')}
        ${toggle('gameplay', 'nameplates', 'Noms au-dessus des voitures')}`;
      this.onSeg = (k, v) => {
        if (k === 'quality') s.graphics.quality = v;
        if (k === 'fpsCap') s.graphics.fpsCap = Number(v);
        this.game.applySettings(true);
      };
    } else if (tab === 'audio') {
      body = [range('audio', 'master', 'Volume général', '', pct), range('audio', 'music', 'Musique (menus)', '', pct), range('audio', 'sfx', 'Effets', '', pct)].join('');
    } else if (tab === 'data') {
      body = `<div class="row"><div class="k"><b>Nom du pilote</b></div><input type="text" id="set-name" maxlength="16" value="${esc(this.save.profile.name)}"></div>
        <div class="row"><div class="k"><b>Code de sauvegarde</b><small>Copiez-le pour transférer votre progression</small></div>${btn('Exporter', 'exportSave')}${btn('Importer', 'importSave')}</div>
        <div class="row ${this.params.confirmReset ? 'confirm' : ''}"><div class="k"><b>${this.params.confirmReset ? 'Confirmer : tout effacer ?' : 'Réinitialiser la progression'}</b><small>Niveau, objets, statistiques et paramètres</small></div>${btn(this.params.confirmReset ? 'Oui, effacer' : 'Réinitialiser', 'resetSave', this.params.confirmReset ? 'amber' : '')}</div>
        <p class="fair">Sauvegarde : stockage local de l’appareil${this.game.save.persistent ? '' : ' (indisponible dans ce contexte)'}.</p>`;
    }
    const tabs = [['controls', 'Contrôles'], ['camera', 'Caméra'], ['graphics', 'Graphismes'], ['audio', 'Audio'], ['data', 'Profil']];
    this.after = () => this.bindRanges();
    return `<div class="screen solid" id="settings">
      ${this.topbar('Paramètres')}
      <div class="tabs">${tabs.map(([id, l]) => `<button class="${id === tab ? 'sel' : ''}" data-act="settingsTab" data-arg="${id}">${l}</button>`).join('')}</div>
      <div class="scroll"><div class="rows">${body}</div></div>
    </div>`;
  }

  bindRanges() {
    const s = this.save.settings;
    this.root.querySelectorAll('input[type=range]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const v = Number(inp.value);
        s[inp.dataset.group][inp.dataset.key] = v;
        const out = inp.nextElementSibling;
        const k = inp.dataset.key;
        out.textContent = ['master', 'music', 'sfx', 'buttonScale', 'joystickSize'].includes(k) ? `${Math.round(v * 100)}%`
          : k === 'fov' ? `${v}°` : ['sensitivity', 'stiffness'].includes(k) ? `×${v.toFixed(2)}` : v.toFixed(1);
        this.game.applySettings();
      });
    });
    const name = this.root.querySelector('#set-name');
    if (name) {
      name.addEventListener('change', () => {
        const v = name.value.trim().slice(0, 16);
        this.save.profile.name = v || 'Pilote';
        this.game.save.save();
        this.toast('Nom enregistré');
      });
    }
  }

  render_profile() {
    const g = this.game;
    const st = this.save.stats;
    const info = g.progression.info();
    const pct = info.need ? Math.round((info.into / info.need) * 100) : 100;
    const wr = st.matches ? Math.round((st.wins / st.matches) * 100) : 0;
    const next = g.progression.nextRewards(4);
    const cell = (v, l) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`;
    const h = Math.floor(st.playTime / 3600), m = Math.floor((st.playTime % 3600) / 60);
    return `<div class="screen solid" id="profile">
      ${this.topbar('Profil')}
      <div class="scroll">
        <div class="profile-card" style="cursor:default"><div class="lvl-badge">${info.level}</div>
          <div class="who"><div class="name">${esc(this.save.profile.name)}</div><div class="title">${esc(g.custom.titleText())}</div>
          <div class="xpbar"><i style="width:${pct}%"></i></div><small class="fair">${info.level >= MAX_LEVEL ? 'Niveau maximum atteint' : `${info.into} / ${info.need} XP vers le niveau ${info.level + 1}`}</small></div></div>
        <div class="label">Statistiques</div>
        <div class="stats">${cell(st.matches, 'Matchs')}${cell(st.wins, 'Victoires')}${cell(`${wr}%`, 'Taux de victoire')}${cell(st.goals, 'Buts')}${cell(st.assists, 'Passes décisives')}${cell(st.saves, 'Arrêts')}${cell(st.shots, 'Tirs')}${cell(st.mvps, 'MVP')}${cell(st.demos, 'Démolitions')}${cell(st.tournamentsWon, 'Tournois gagnés')}${cell(`${h}h${String(m).padStart(2, '0')}`, 'Temps de jeu')}</div>
        ${next.length ? `<div class="label">Prochaines récompenses</div><div class="rewards">${next.map((n) => `<span class="reward" style="--r:${RARITY[n.item.rarity].color}">Niv. ${n.level} · ${esc(n.item.name)}</span>`).join('')}</div>` : ''}
      </div>
      <div class="actions">${btn('Modifier le nom', 'editName')}</div>
    </div>`;
  }

  render_results({ result, xp, prog, local, tournament }) {
    const won = result.winner === local.team;
    const draw = result.winner === -1;
    const title = result.forfeit ? 'ABANDON' : won ? 'VICTOIRE' : draw ? 'ÉGALITÉ' : 'DÉFAITE';
    const color = won ? TEAM[0].css : draw ? 'var(--amber)' : TEAM[1].css;
    const cars = result.cars.slice().sort((a, b) => a.team - b.team || b.stats.points - a.stats.points);
    const rows = cars.map((c) => `<tr class="${c === local ? 'me' : ''}"><td class="t${c.team}">${esc(c.name)}${c === result.mvp ? ' ★ MVP' : ''}</td><td>${c.stats.points}</td><td>${c.stats.goals}</td><td>${c.stats.assists}</td><td>${c.stats.saves}</td><td>${c.stats.shots}</td></tr>`).join('');
    const info = prog.after;
    const pct = info.need ? Math.round((info.into / info.need) * 100) : 100;
    const rewards = prog.rewards.length ? `<div class="label">Débloqué</div><div class="rewards">${prog.rewards.map((r) => `<span class="reward" style="--r:${RARITY[r.rarity].color}">${esc(r.name)}</span>`).join('')}</div>` : '';
    let tMsg = '';
    let actions = `${btn('Menu', 'toMenu')}${btn('Rejouer', 'replayMatch', 'primary')}`;
    if (tournament) {
      tMsg = tournament === 'champion' ? '<div class="label" style="color:var(--amber)">Tournoi remporté : vous êtes Champion !</div>'
        : tournament === 'eliminated' ? '<div class="label" style="color:var(--magenta)">Éliminé du tournoi</div>'
        : '<div class="label" style="color:var(--good)">Qualifié pour le tour suivant</div>';
      actions = tournament === 'next' ? `${btn('Menu', 'toMenu')}${btn('Tour suivant', 'tournament', 'primary')}` : `${btn('Menu', 'toMenu')}${btn('Tournois', 'tournament', 'primary')}`;
    }
    return `<div class="screen solid" id="results">
      <div class="res-head"><div class="big" style="color:${color}">${title}</div>
        <div class="score"><span style="color:var(--cyan)">${result.score[0]}</span> — <span style="color:var(--magenta)">${result.score[1]}</span>${result.overtime ? ' <small class="fair">(prol.)</small>' : ''}</div>${tMsg}</div>
      <div class="board-wrap"><table class="board"><thead><tr><th>JOUEUR</th><th>PTS</th><th>BUTS</th><th>PASSES</th><th>ARRÊTS</th><th>TIRS</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="xpbox">
        <div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-family:var(--display);font-size:18px">+${xp.total} XP</b><span class="fair">Niveau ${info.level}${prog.levelsGained ? ` <b style="color:var(--amber)">▲ ${prog.levelsGained}</b>` : ''}</span></div>
        <div class="xpbar"><i style="width:${pct}%"></i></div>
        <div class="xpl">${xp.lines.map(([l, v]) => `<span>${l} <b>${v < 0 ? '−' : '+'}${Math.abs(v)}</b></span>`).join('')}</div>
        ${rewards}
      </div>
      <div class="actions">${actions}</div>
    </div>`;
  }

  // ---------- actions ----------
  actions = {
    start() { this.game.startFromSplash(); },
    back() {
      if (this.current === 'settings' && this.game.session) return this.game.openPause();
      this.show('menu');
    },
    play() { this.show('play'); },
    training() { this.show('training'); },
    tournament() { this.show('tournament'); },
    garage() { this.show('garage', { cat: 'car' }); },
    settings() { this.show('settings'); },
    profile() { this.show('profile'); },
    toMenu() { this.game.toMenu(); },
    pickMode(id, el) {
      this.sel.mode = id;
      el.parentElement.querySelectorAll('.card').forEach((c) => c.classList.toggle('sel', c === el));
    },
    pickDrill(id, el) {
      this.sel.drill = id;
      el.parentElement.querySelectorAll('.card').forEach((c) => c.classList.toggle('sel', c === el));
    },
    launch() {
      this.save.lastPlay = { ...this.sel };
      this.game.save.save();
      this.game.startMatch({ ...this.sel });
    },
    replayMatch() { this.game.startMatch({ ...this.save.lastPlay }); },
    launchTraining() { this.game.startTraining({ ...this.sel }); },
    startTournament() {
      this.game.tournament.start(this.sel.difficulty);
      this.show('tournament');
    },
    playTournament() {
      const m = this.game.tournament.nextMatch();
      if (m) this.game.startMatch({ mode: 'tournament', difficulty: m.difficulty, arena: m.arena, duration: 180, opponent: m.opponent });
    },
    abandonTournament() {
      this.game.tournament.abandon();
      this.show('tournament');
    },
    garageCat(cat) { this.show('garage', { cat }); },
    garageItem(id) {
      const it = getItem(id);
      this.game.custom.markSeen(id);
      this.show('garage', { cat: it.cat, sel: id });
      this.game.previewCosmetics({ ...this.save.equipped, [it.cat]: id });
    },
    equip() {
      const id = this.params.sel;
      if (id && this.game.custom.equip(id)) {
        this.game.previewCosmetics(this.save.equipped);
        this.toast(`${getItem(id).name} équipé`);
        this.refresh();
      }
    },
    settingsTab(tab) { this.show('settings', { tab }); },
    toggle(path, el) {
      const [g, k] = path.split('.');
      const s = this.save.settings;
      s[g][k] = !s[g][k];
      el.classList.toggle('on', s[g][k]);
      this.game.applySettings();
    },
    editLayout() { this.game.openLayoutEditor(); },
    exportSave() {
      const code = this.game.save.export();
      const done = () => this.toast('Code copié dans le presse-papiers');
      try {
        navigator.clipboard.writeText(code).then(done, () => this.showCode(code));
      } catch (e) {
        this.showCode(code);
      }
    },
    importSave() {
      this.modal(`<h2>Importer</h2><textarea id="imp" rows="5" style="width:100%;background:var(--panel-2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:8px;user-select:text"></textarea>
        ${btn('Importer', 'ok', 'primary')}${btn('Annuler', 'cancel', 'ghost')}`, (a) => {
        if (a === 'ok') {
          try {
            this.game.save.import(document.getElementById('imp').value);
            this.game.onSaveReplaced();
            this.toast('Sauvegarde importée');
          } catch (e) {
            this.toast('Code invalide : vérifiez qu’il est complet');
            return;
          }
        }
        this.closeModal();
      });
    },
    resetSave() {
      if (!this.params.confirmReset) return this.show('settings', { tab: 'data', confirmReset: true });
      this.game.save.reset();
      this.game.onSaveReplaced();
      this.toast('Progression réinitialisée');
      this.show('settings', { tab: 'data' });
    },
    editName() { this.show('settings', { tab: 'data' }); },
  };

  showCode(code) {
    this.modal(`<h2>Code de sauvegarde</h2><textarea rows="5" readonly style="width:100%;background:var(--panel-2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:8px;user-select:text">${code}</textarea>${btn('Fermer', 'close', 'primary')}`, () => this.closeModal());
  }
}
