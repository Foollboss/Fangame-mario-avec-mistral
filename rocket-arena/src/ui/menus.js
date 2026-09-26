import { DIFFICULTIES, BODIES } from '../config.js';
import { THEMES } from '../render/arenaView.js';
import { ACTIONS, DEFAULT_KEYS, keyLabel } from '../input/input.js';
import { DEFAULT_SETTINGS, QUALITY } from './settings.js';
import { scoreTableHtml } from './hud.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const ACCENTS = ['#1b1d22', '#e8e8e8', '#d62828', '#f7c948', '#2ec27e', '#8a4dff', '#ff4fa3', '#00c2d1', '#6b4a2b'];
const BOOSTS = ['team', '#ffd24d', '#ff3b3b', '#39ff88', '#b05cff', '#4de1ff', '#ffffff', '#ff66cc'];

function seg(key, options, current, cls = '') {
  return `<div class="seg" data-seg="${key}">${options.map(([v, label]) => `<button data-v="${v}" class="${String(v) === String(current) ? `on ${cls}` : ''}">${label}</button>`).join('')}</div>`;
}

export class Menus {
  constructor(root, app) {
    this.root = root;
    this.app = app;
    this.screen = null;
    this.stack = [];
    this.focus = 0;
    this.waitingKey = null;
  }

  get s() { return this.app.settings; }

  hide() {
    this.root.innerHTML = '';
    this.screen = null;
  }

  isOpen() {
    return !!this.screen;
  }

  show(name, push = true) {
    if (push && this.screen && this.screen !== name) this.stack.push(this.screen);
    this.screen = name;
    this.focus = 0;
    this.render();
    this.app.onMenuChange(name);
  }

  back() {
    const prev = this.stack.pop();
    if (prev) this.show(prev, false);
    else if (this.app.inMatch()) this.app.resume();
  }

  render() {
    const html = this[`html_${this.screen}`]();
    this.root.innerHTML = html;
    this.bind();
  }

  bind() {
    const r = this.root;
    r.querySelectorAll('[data-action]').forEach((b) => {
      b.addEventListener('click', () => {
        this.app.sound.click();
        this.action(b.dataset.action, b);
      });
    });
    r.querySelectorAll('[data-seg]').forEach((g) => {
      g.querySelectorAll('button').forEach((b) => b.addEventListener('click', () => {
        this.app.sound.click();
        this.setOption(g.dataset.seg, b.dataset.v);
      }));
    });
    r.querySelectorAll('input[type=range]').forEach((inp) => {
      inp.addEventListener('input', () => {
        const v = parseFloat(inp.value);
        this.s[inp.dataset.key] = v;
        const lab = inp.parentElement.querySelector('.val');
        if (lab) lab.textContent = inp.dataset.fmt === 'pct' ? `${Math.round(v * 100)}%` : v;
        this.app.applySettings();
      });
    });
    r.querySelectorAll('input[type=text]').forEach((inp) => {
      inp.addEventListener('input', () => {
        this.s[inp.dataset.key] = inp.value.slice(0, 16) || DEFAULT_SETTINGS[inp.dataset.key];
        this.app.saveSettings();
      });
    });
    r.querySelectorAll('.swatch').forEach((sw) => sw.addEventListener('click', () => {
      this.app.sound.click();
      this.s[sw.dataset.key] = sw.dataset.v;
      this.app.applySettings();
      this.render();
    }));
    r.querySelectorAll('.key[data-bind]').forEach((k) => {
      k.addEventListener('click', (ev) => {
        ev.stopPropagation();
        k.classList.add('wait');
        k.textContent = '…';
        const [action, idx] = k.dataset.bind.split(':');
        setTimeout(() => this.app.input.captureNext((code) => {
          const list = [...(this.s.keys[action] || [])];
          if (code !== 'Escape' || action === 'pause') list[+idx] = code;
          this.s.keys[action] = list.filter(Boolean);
          this.app.saveSettings();
          this.render();
        }), 50);
      });
    });
  }

  setOption(key, v) {
    const numeric = ['teamSize', 'duration', 'team', 'p2Team', 'gravityScale'];
    let val = v;
    if (numeric.includes(key)) val = Number(v);
    if (v === 'true' || v === 'false') val = v === 'true';
    if (key === 'freeUnlimited') this.freeUnlimited = val;
    else this.s[key] = val;
    this.app.applySettings();
    this.render();
  }

  action(a) {
    const app = this.app;
    switch (a) {
      case 'play': this.show('play'); break;
      case 'free': this.show('free'); break;
      case 'garage': this.show('garage'); break;
      case 'settings': this.show('settings'); break;
      case 'controls': this.show('controls'); break;
      case 'back': this.back(); break;
      case 'start': app.startMatch(this.matchConfig()); break;
      case 'startFree': app.startMatch({ freeplay: true, unlimitedBoost: this.freeUnlimited !== false }); break;
      case 'resume': app.resume(); break;
      case 'restart': app.restart(); break;
      case 'quit': app.quitToMenu(); break;
      case 'resetSettings': {
        const keep = { keys: this.s.keys, playerName: this.s.playerName };
        Object.assign(this.s, DEFAULT_SETTINGS, keep);
        app.applySettings();
        this.render();
        break;
      }
      case 'resetKeys':
        this.s.keys = { ...DEFAULT_KEYS };
        app.saveSettings();
        this.render();
        break;
      case 'fullscreen':
        if (document.fullscreenElement) document.exitFullscreen();
        else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
        break;
      default: break;
    }
  }

  matchConfig() {
    const s = this.s;
    return {
      teamSize: s.teamSize, difficulty: s.difficulty, duration: s.duration, theme: s.theme, team: s.team,
      splitscreen: s.splitscreen, p2Team: s.p2Team, replays: s.replays, boostMode: s.boostMode, gravityScale: s.gravityScale,
      gameMode: s.gameMode,
    };
  }

  // ---------- Screens ----------
  html_main() {
    return `<div class="menu"><div class="col">
      <div class="title">Supersonic<br>Arena</div>
      <div class="subtitle">Football · voitures · fusées</div>
      <button class="btn primary" data-action="play">Jouer<small>Match contre l'IA, de 1c1 à 4c4, seul ou en écran partagé</small></button>
      <button class="btn" data-action="free">Entraînement libre<small>Toi, la balle et du boost illimité</small></button>
      <button class="btn" data-action="garage">Garage<small>Carrosserie, couleurs et traînée de boost</small></button>
      <button class="btn" data-action="settings">Paramètres<small>Graphismes, caméra, audio, manette</small></button>
      <button class="btn" data-action="controls">Commandes<small>Clavier/souris et manette — touches personnalisables</small></button>
      <button class="btn" data-action="fullscreen">Plein écran</button>
      <div class="footer">Jeu de fan non officiel inspiré de Rocket League®. Manette Xbox/PlayStation supportée.<br>F11 ou « Plein écran » pour une immersion totale.</div>
    </div></div>`;
  }

  html_play() {
    const s = this.s;
    const diffs = Object.entries(DIFFICULTIES).map(([k, d]) => [k, d.label]);
    const themes = Object.entries(THEMES).map(([k, t]) => [k, t.label]);
    return `<div class="menu center dim"><div class="col">
      <h2>Partie rapide</h2>
      <div class="opt"><label>Mode</label>${seg('gameMode', [['classic', 'Classique'], ['heatseeker', 'Heatseeker']], s.gameMode)}</div>
      ${s.gameMode === 'heatseeker' ? '<div class="hint">Heatseeker : après chaque touche, la balle fonce toute seule vers le but adverse, de plus en plus vite !</div>' : ''}
      <div class="opt"><label>Format</label>${seg('teamSize', [[1, '1 c 1'], [2, '2 c 2'], [3, '3 c 3'], [4, '4 c 4']], s.teamSize)}</div>
      <div class="opt"><label>Difficulté IA</label>${seg('difficulty', diffs, s.difficulty)}</div>
      <div class="opt"><label>Durée</label>${seg('duration', [[120, '2 min'], [300, '5 min'], [600, '10 min'], [0, 'Illimitée']], s.duration)}</div>
      <div class="opt"><label>Arène</label>${seg('theme', themes, s.theme)}</div>
      <div class="opt"><label>Ton équipe</label>${seg('team', [[0, 'Bleue'], [1, 'Orange']], s.team, s.team === 1 ? 'orange' : '')}</div>
      <div class="opt"><label>Écran partagé</label>${seg('splitscreen', [[false, '1 joueur'], [true, '2 joueurs']], s.splitscreen)}</div>
      ${s.splitscreen ? `<div class="opt"><label>Joueur 2</label>${seg('p2Team', [[s.team, 'Avec moi'], [1 - s.team, 'Contre moi']], s.p2Team)}</div>
      <div class="hint">Joueur 1 : clavier/souris (ou 2e manette). Joueur 2 : première manette branchée.</div>` : ''}
      <div class="opt"><label>Replays des buts</label>${seg('replays', [[true, 'Oui'], [false, 'Non']], s.replays)}</div>
      <h3>Mutateurs</h3>
      <div class="opt"><label>Boost</label>${seg('boostMode', [['normal', 'Normal'], ['unlimited', 'Illimité'], ['none', 'Aucun']], s.boostMode)}</div>
      <div class="opt"><label>Gravité</label>${seg('gravityScale', [[1, 'Normale'], [0.35, 'Lunaire'], [1.6, 'Forte']], s.gravityScale)}</div>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button><button class="btn primary" data-action="start">Lancer le match</button></div>
    </div></div>`;
  }

  html_free() {
    const s = this.s;
    const themes = Object.entries(THEMES).map(([k, t]) => [k, t.label]);
    return `<div class="menu center dim"><div class="col">
      <h2>Entraînement libre</h2>
      <div class="opt"><label>Arène</label>${seg('theme', themes, s.theme)}</div>
      <div class="opt"><label>Boost illimité</label>${seg('freeUnlimited', [[true, 'Oui'], [false, 'Non']], this.freeUnlimited !== false)}</div>
      ${this.app.isTouch ? '<p class="hint">Bouton <b>BALLE</b> : replacer la balle devant toi · <b>TIR</b> : la balle est lancée vers toi (parfait pour les aériennes).</p>'
    : `<p class="hint">Touche <span class="key">${keyLabel(s.keys.resetBall[0])}</span> : replacer la balle devant toi ·
      <span class="key">${keyLabel(s.keys.shootBall[0])}</span> : la balle est lancée vers toi (parfait pour s'entraîner aux aériennes).</p>`}
      <div class="btn-row"><button class="btn" data-action="back">Retour</button><button class="btn primary" data-action="startFree">C'est parti</button></div>
    </div></div>`;
  }

  html_garage() {
    const s = this.s;
    const bodies = Object.entries(BODIES).map(([k, b]) => [k, b.name]);
    const sw = (key, list) => `<div class="swatches">${list.map((c) => `<div class="swatch ${s[key] === c ? 'on' : ''}" data-key="${key}" data-v="${c}"
      style="background:${c === 'team' ? 'linear-gradient(135deg,#2f7bff 50%,#ff8a1f 50%)' : c}" title="${c === 'team' ? 'Couleur d\'équipe' : c}"></div>`).join('')}</div>`;
    const b = BODIES[s.body] || BODIES.octane;
    return `<div class="menu"><div class="col">
      <h2>Garage</h2>
      <div class="opt"><label>Pseudo</label><input type="text" data-key="playerName" maxlength="16" value="${esc(s.playerName)}"></div>
      <div class="opt"><label>Carrosserie</label>${seg('body', bodies, s.body)}</div>
      <div class="hint">Hitbox : ${(b.hx * 200).toFixed(0)} × ${(b.hz * 200).toFixed(0)} × ${(b.hy * 200).toFixed(0)} cm — ${
  { octane: 'polyvalente et haute, idéale pour les dribbles', dominus: 'longue et plate, parfaite pour les frappes puissantes', breakout: 'la plus longue, pour les tirs précis', merc: 'massive, un tank pour défendre' }[s.body] || ''}</div>
      <div class="opt"><label>Couleur secondaire</label>${sw('accent', ACCENTS)}</div>
      <div class="opt"><label>Traînée de boost</label>${sw('boostColor', BOOSTS)}</div>
      <div class="opt"><label>Pseudo joueur 2</label><input type="text" data-key="player2Name" maxlength="16" value="${esc(s.player2Name)}"></div>
      <div class="btn-row"><button class="btn" data-action="back">Retour</button></div>
    </div></div>`;
  }

  html_settings() {
    const s = this.s;
    const slider = (key, min, max, step, fmt) => `<div><input type="range" data-key="${key}" data-fmt="${fmt || ''}" min="${min}" max="${max}" step="${step}" value="${s[key]}">
      <span class="val">${fmt === 'pct' ? `${Math.round(s[key] * 100)}%` : s[key]}</span></div>`;
    return `<div class="menu center dim"><div class="col">
      <h2>Paramètres</h2>
      <h3>Graphismes</h3>
      <div class="opt"><label>Qualité</label>${seg('quality', Object.entries(QUALITY).map(([k, q]) => [k, q.label]), s.quality)}</div>
      <div class="opt"><label>Afficher les FPS</label>${seg('showFps', [[false, 'Non'], [true, 'Oui']], s.showFps)}</div>
      <h3>Caméra</h3>
      <div class="opt"><label>Champ de vision</label>${slider('fov', 70, 120, 1)}</div>
      <div class="opt"><label>Distance</label>${slider('camDistance', 1.8, 4.2, 0.1)}</div>
      <div class="opt"><label>Hauteur</label>${slider('camHeight', 0.5, 2, 0.05)}</div>
      <div class="opt"><label>Rigidité</label>${slider('camStiffness', 4, 25, 1)}</div>
      <div class="opt"><label>Caméra balle au départ</label>${seg('ballCamDefault', [[true, 'Oui'], [false, 'Non']], s.ballCamDefault)}</div>
      <h3>Audio</h3>
      <div class="opt"><label>Volume général</label>${slider('volMaster', 0, 1, 0.05, 'pct')}</div>
      <div class="opt"><label>Effets</label>${slider('volSfx', 0, 1, 0.05, 'pct')}</div>
      <div class="opt"><label>Musique (menus)</label>${slider('volMusic', 0, 1, 0.05, 'pct')}</div>
      <p class="hint">Messages rapides : touches <span class="key">1</span> à <span class="key">8</span>
      (Je l'ai ! · Joli tir ! · Quel arrêt ! · Merci ! · Calculé. · Oups… · Défends ! · Bien joué !)</p>
      <h3>Manette</h3>
      <div class="opt"><label>Zone morte</label>${slider('deadzone', 0.02, 0.4, 0.01)}</div>
      <div class="opt"><label>Inverser le tangage</label>${seg('invertPitch', [[false, 'Non'], [true, 'Oui']], s.invertPitch)}</div>
      <div class="btn-row"><button class="btn" data-action="resetSettings">Par défaut</button><button class="btn primary" data-action="back">Retour</button></div>
    </div></div>`;
  }

  html_controls() {
    const s = this.s;
    const rows = ACTIONS.map(([a, label]) => {
      const list = s.keys[a] || [];
      const chips = [0, 1].map((i) => `<span class="key" data-bind="${a}:${i}">${list[i] ? keyLabel(list[i]) : '+'}</span>`).join('');
      return `<tr><td>${label}</td><td>${chips}</td></tr>`;
    }).join('');
    const pad = [
      ['Accélérer / reculer', 'RT / LT'], ['Diriger · tangage · lacet', 'Stick gauche'], ['Sauter / double saut / flip', 'A (✕)'],
      ['Boost', 'B (○) ou RB (R1)'], ['Dérapage / air roll libre', 'X (□)'], ['Air roll gauche', 'LB (L1)'], ['Caméra balle', 'Y (△)'],
      ['Tableau des scores', 'Back / Share'], ['Pause', 'Start / Options'], ['Messages rapides', 'Croix directionnelle'],
    ].map(([l, k]) => `<tr><td>${l}</td><td><span class="key">${k}</span></td></tr>`).join('');
    return `<div class="menu center dim"><div class="col">
      <h2>Commandes</h2>
      ${this.app.isTouch ? `<h3>Écran tactile</h3>
      <p class="hint">• Pose le pouce n'importe où sur la <b>moitié gauche</b> : le joystick apparaît. Haut = accélérer, bas = freiner / reculer,
      gauche/droite = tourner. En l'air, il fait pivoter la voiture.<br>
      • <b>SAUT</b> (bleu) : appuie deux fois en tenant le joystick pour un flip. <b>BOOST</b> (orange) : maintiens pour foncer.<br>
      • <b>DÉRAPE</b> : dérapage au sol, air roll en l'air. <b>CAM</b> : caméra balle / voiture. <b>II</b> : pause.<br>
      • Une manette Bluetooth fonctionne aussi.</p>` : ''}
      <p class="hint">Clique sur une touche puis appuie sur la nouvelle touche (ou un bouton de souris) pour la réassigner.</p>
      <h3>Clavier / souris</h3>
      <table class="keys-table">${rows}</table>
      <p class="hint">Messages rapides : touches <span class="key">1</span> à <span class="key">8</span>
      (Je l'ai ! · Joli tir ! · Quel arrêt ! · Merci ! · Calculé. · Oups… · Défends ! · Bien joué !)</p>
      <h3>Manette</h3>
      <table class="keys-table">${pad}</table>
      <h3>Astuces de pilote</h3>
      <p class="hint">• <b>Flip</b> : saute puis appuie de nouveau sur saut en tenant une direction — gros gain de vitesse.<br>
      • <b>Aérienne</b> : saute, cabre le nez vers le haut puis boost pour voler vers la balle.<br>
      • <b>Démolition</b> : percute un adversaire en vitesse supersonique (traînée blanche).<br>
      • <b>Murs et plafond</b> : les rampes courbes permettent de rouler sur les murs.<br>
      • Sur le toit ? Appuie sur saut pour te remettre sur les roues.</p>
      <div class="btn-row"><button class="btn" data-action="resetKeys">Touches par défaut</button><button class="btn primary" data-action="back">Retour</button></div>
    </div></div>`;
  }

  html_pause() {
    return `<div class="menu center dim"><div class="col" style="width:min(420px,94vw)">
      <h2>Pause</h2>
      <button class="btn primary" data-action="resume">Reprendre</button>
      <button class="btn" data-action="restart">Recommencer</button>
      <button class="btn" data-action="settings">Paramètres</button>
      <button class="btn" data-action="controls">Commandes</button>
      <button class="btn" data-action="quit">Quitter le match</button>
    </div></div>`;
  }

  html_end() {
    const m = this.app.match;
    const myTeam = this.app.localTeam();
    let title;
    if (this.s.splitscreen && this.app.localTeams().size > 1) title = `L'équipe ${m.winner === 0 ? 'bleue' : 'orange'} gagne !`;
    else title = m.winner === myTeam ? 'VICTOIRE !' : 'DÉFAITE';
    const color = m.winner === 0 ? 'var(--blue)' : 'var(--orange)';
    return `<div class="menu center dim"><div class="col">
      <div class="end-title" style="color:${color}">${title}</div>
      <div class="end-score"><span class="b">${m.score[0]}</span> — <span class="o">${m.score[1]}</span></div>
      ${scoreTableHtml(m, true)}
      <div class="btn-row"><button class="btn" data-action="quit">Menu principal</button><button class="btn primary" data-action="restart">Rejouer</button></div>
    </div></div>`;
  }

  // Gamepad navigation for menus.
  navigate(dir) {
    const btns = [...this.root.querySelectorAll('button')];
    if (!btns.length) return;
    this.focus = (this.focus + dir + btns.length) % btns.length;
    btns.forEach((b, i) => b.classList.toggle('focus', i === this.focus));
    btns[this.focus].scrollIntoView({ block: 'nearest' });
  }

  activate() {
    const btns = [...this.root.querySelectorAll('button')];
    if (btns[this.focus]) btns[this.focus].click();
  }
}
