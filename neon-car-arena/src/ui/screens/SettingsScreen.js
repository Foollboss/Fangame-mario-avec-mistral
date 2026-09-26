import { el, esc, onTap, bindAll, segmented } from '../dom.js';
import { LayoutEditor } from './LayoutEditor.js';
import { DEFAULT_LAYOUT, ONE_HAND_LAYOUT } from '../../input/MobileInput.js';

const TABS = [['controls', 'Contrôles'], ['camera', 'Caméra'], ['graphics', 'Graphismes'], ['audio', 'Audio'], ['profile', 'Profil & sauvegarde']];

// Paramètres : contrôles, caméra, graphismes, audio, profil / sauvegarde.
export class SettingsScreen {
  constructor(ui, from) {
    this.ui = ui;
    this.game = ui.game;
    this.from = from;
    this.tab = ui.lastSettingsTab || 'controls';
    this.node = el(`<div class="screen full">${ui.header('Paramètres')}<div class="tabs"></div><div class="scroll"><div class="panel" data-body></div></div></div>`);
    ui.bindBack(this.node, () => (from === 'pause' ? ui.pause() : ui.menu()));
    this.render();
  }

  get s() { return this.game.save.data.settings; }

  changed() {
    this.game.save.save();
    this.game.applySettings();
  }

  slider(group, key, label, min, max, step, fmt = (v) => v) {
    const v = this.s[group][key];
    return `<div class="set-row"><label>${label} <span class="muted" data-out="${group}.${key}">${fmt(v)}</span></label>
      <input type="range" min="${min}" max="${max}" step="${step}" value="${v}" data-range="${group}.${key}"></div>`;
  }

  toggle(group, key, label, hint = '') {
    return `<div class="set-row"><label>${label}${hint ? `<div class="muted small">${hint}</div>` : ''}</label>
      <button class="toggle ${this.s[group][key] ? 'on' : ''}" data-toggle="${group}.${key}"></button></div>`;
  }

  render() {
    this.ui.lastSettingsTab = this.tab;
    const tabs = this.node.querySelector('.tabs');
    tabs.innerHTML = TABS.map(([id, l]) => `<button data-tab="${id}" class="${id === this.tab ? 'sel' : ''}">${l}</button>`).join('');
    bindAll(tabs, '[data-tab]', (b) => { this.tab = b.dataset.tab; this.render(); });
    const body = this.node.querySelector('[data-body]');
    const pct = (v) => `${Math.round(v * 100)}%`;
    const s = this.s;
    let html = '';
    if (this.tab === 'controls') {
      html = this.slider('controls', 'sensitivity', 'Sensibilité de direction', 0.5, 2, 0.05, (v) => Number(v).toFixed(2))
        + this.slider('controls', 'buttonScale', 'Taille des boutons', 0.7, 1.4, 0.05, pct)
        + this.toggle('controls', 'invertPitch', 'Inverser l\'axe vertical (en l\'air)')
        + this.toggle('controls', 'invertSteer', 'Inverser la direction')
        + this.toggle('controls', 'vibration', 'Vibrations', 'Android uniquement (non pris en charge par iOS Safari)')
        + this.toggle('controls', 'autoAccelerate', 'Accélération automatique', 'Idéal pour jouer à une main : la voiture accélère seule, FREIN pour ralentir')
        + this.toggle('controls', 'landingAssist', 'Aide à l\'atterrissage', 'Remet les roues vers le sol en l\'air si le joystick est relâché')
        + `<div class="set-row"><label>Disposition des boutons</label><div class="row">
            <button class="btn secondary" data-layout="edit">Personnaliser</button>
            <button class="btn secondary" data-layout="onehand">Une main</button>
            <button class="btn secondary" data-layout="reset">Défaut</button></div></div>
          <p class="muted small">Clavier : ZQSD/WASD ou flèches, Espace = saut, Maj = boost, E = dash, J/L = roulis, C = caméra balle, Échap = pause. Manette standard prise en charge.</p>`;
    } else if (this.tab === 'camera') {
      html = this.toggle('camera', 'ballCam', 'Caméra verrouillée sur la balle', 'Sinon caméra libre derrière la voiture (bouton 🎯 en match)')
        + this.toggle('camera', 'assist', 'Aide caméra', 'En caméra libre, oriente légèrement la vue vers la balle')
        + this.slider('camera', 'distance', 'Distance', 6, 15, 0.1, (v) => Number(v).toFixed(1))
        + this.slider('camera', 'height', 'Hauteur', 1.5, 7, 0.1, (v) => Number(v).toFixed(1))
        + this.slider('camera', 'fov', 'Champ de vision', 55, 90, 1, (v) => `${v}°`)
        + this.slider('camera', 'stiffness', 'Réactivité', 0.4, 2, 0.05, (v) => Number(v).toFixed(2));
    } else if (this.tab === 'graphics') {
      const q = this.game.quality;
      html = `<div class="label" style="margin-top:0">Qualité graphique</div>
        <div class="seg" data-seg="quality"><button data-v="auto">AUTO</button><button data-v="low">BASSE</button><button data-v="medium">MOYENNE</button><button data-v="high">HAUTE</button></div>
        <p class="muted small">Profil actuel : <b>${q.preset().label}</b>${s.graphics.quality === 'auto' ? ' (détecté automatiquement, ajusté selon les FPS mesurés)' : ''}</p>
        <div class="label">Images par seconde</div>
        <div class="seg" data-seg="fps"><button data-v="30">30 FPS (économie batterie)</button><button data-v="60">60 FPS</button></div>`
        + this.toggle('graphics', 'showFps', 'Afficher les FPS')
        + this.toggle('game', 'replays', 'Replays des buts');
    } else if (this.tab === 'audio') {
      html = this.slider('audio', 'master', 'Volume général', 0, 1, 0.05, pct)
        + this.slider('audio', 'music', 'Musique', 0, 1, 0.05, pct)
        + this.slider('audio', 'sfx', 'Effets sonores', 0, 1, 0.05, pct);
    } else {
      html = `<div class="set-row"><label>Nom du pilote</label><input type="text" maxlength="16" value="${esc(this.game.save.data.profile.name)}" data-name></div>
        <div class="set-row"><label>Exporter la sauvegarde<div class="muted small">Fichier JSON à conserver ou transférer</div></label><button class="btn secondary" data-export>Exporter</button></div>
        <div class="set-row"><label>Importer une sauvegarde</label><button class="btn secondary" data-import>Importer</button><input type="file" accept=".json,application/json" data-file class="hidden"></div>
        <div class="set-row"><label>Réinitialiser toute la progression</label><button class="btn warn" data-reset>Réinitialiser</button></div>
        <p class="muted small">Sauvegarde locale sur cet appareil. Aucune donnée n'est envoyée sur Internet.</p>`;
    }
    body.innerHTML = html;
    this.bind(body);
  }

  bind(body) {
    body.querySelectorAll('[data-range]').forEach((r) => {
      r.addEventListener('input', () => {
        const [g, k] = r.dataset.range.split('.');
        this.s[g][k] = Number(r.value);
        const out = body.querySelector(`[data-out="${g}.${k}"]`);
        if (out) out.textContent = k === 'fov' ? `${r.value}°` : ['buttonScale', 'master', 'music', 'sfx'].includes(k) ? `${Math.round(r.value * 100)}%` : Number(r.value).toFixed(k === 'sensitivity' || k === 'stiffness' ? 2 : 1);
        this.changed();
      });
    });
    bindAll(body, '[data-toggle]', (b) => {
      const [g, k] = b.dataset.toggle.split('.');
      this.s[g][k] = !this.s[g][k];
      b.classList.toggle('on', this.s[g][k]);
      this.changed();
    });
    segmented(body, 'quality', this.s.graphics.quality, (v) => { this.s.graphics.quality = v; this.changed(); this.render(); });
    segmented(body, 'fps', this.s.graphics.fpsCap, (v) => { this.s.graphics.fpsCap = Number(v); this.changed(); });
    bindAll(body, '[data-layout]', (b) => {
      const a = b.dataset.layout;
      if (a === 'edit') new LayoutEditor(this.ui, () => this.changed());
      if (a === 'onehand') { this.s.controls.layout = JSON.parse(JSON.stringify(ONE_HAND_LAYOUT)); this.s.controls.autoAccelerate = true; this.changed(); this.ui.toast('Disposition « une main » + accélération auto'); this.render(); }
      if (a === 'reset') { this.s.controls.layout = JSON.parse(JSON.stringify(DEFAULT_LAYOUT)); this.s.controls.buttonScale = 1; this.changed(); this.ui.toast('Disposition par défaut'); this.render(); }
    });
    const name = body.querySelector('[data-name]');
    if (name) {
      name.addEventListener('change', () => {
        this.game.save.data.profile.name = name.value.trim().slice(0, 16) || 'Pilote';
        this.game.save.save();
      });
    }
    const exp = body.querySelector('[data-export]');
    if (exp) {
      onTap(exp, () => {
        const blob = new Blob([this.game.save.exportJSON()], { type: 'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'neon-car-arena-sauvegarde.json';
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      });
      const file = body.querySelector('[data-file]');
      onTap(body.querySelector('[data-import]'), () => file.click());
      file.addEventListener('change', async () => {
        try {
          this.game.save.importJSON(await file.files[0].text());
          this.game.progress.sync();
          this.game.applySettings();
          this.game.refreshMenuCar();
          this.ui.toast('Sauvegarde importée');
          this.render();
        } catch (e) { this.ui.toast(e.message); }
      });
      onTap(body.querySelector('[data-reset]'), () => this.ui.confirm('Effacer toute la progression ? Action irréversible.', () => {
        this.game.save.reset();
        this.game.applySettings();
        this.game.refreshMenuCar();
        this.ui.toast('Progression réinitialisée');
        this.render();
      }));
    }
  }
}
