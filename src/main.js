import { PHYS, TEAM, ARENA } from './core/Config.js';
import { createRng } from './core/MathUtil.js';
import { World } from './game/World.js';
import { BallPredictor } from './game/BallPredictor.js';
import { MatchManager } from './game/MatchManager.js';
import { ReplaySystem } from './game/ReplaySystem.js';
import { TrainingManager, DRILLS } from './game/TrainingManager.js';
import { BotAI, TeamBrain } from './ai/BotAI.js';
import { AudioManager } from './audio/AudioManager.js';
import { MobileInput } from './input/MobileInput.js';
import { KeyboardInput, GamepadInput } from './input/KeyboardInput.js';
import { InputRouter } from './input/InputRouter.js';
import { SaveSystem } from './meta/SaveSystem.js';
import { ProgressionSystem, matchXp } from './meta/ProgressionSystem.js';
import { CustomizationSystem } from './meta/CustomizationSystem.js';
import { GarageSystem } from './meta/GarageSystem.js';
import { TournamentSystem } from './meta/TournamentSystem.js';
import { getItem, randomBotCosmetics } from './meta/Catalog.js';
import { GameRenderer } from './render/GameRenderer.js';
import { MatchView } from './render/MatchView.js';
import { Showroom } from './render/Showroom.js';
import { detectQuality, FpsMonitor, QUALITY } from './render/Quality.js';
import { THEME_LIST } from './render/Themes.js';
import { Platform } from './platform/Platform.js';
import { UIManager, MODES } from './ui/UIManager.js';
import { HUD } from './ui/HUD.js';

const BOT_NAMES = ['Axel', 'Lina', 'Kaï', 'Zoé', 'Rex', 'Milo', 'Iris', 'Sacha', 'Yuna', 'Hugo', 'Maya', 'Téo', 'Jade', 'Nils', 'Ava', 'Rio'];
const TIER_ORDER = ['low', 'medium', 'high'];

function probeGpu() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    if (!gl) return { tier: 'low', gpu: 'none' };
    const r = detectQuality(gl);
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return r;
  } catch (e) {
    return { tier: 'medium', gpu: '' };
  }
}

class Game {
  constructor() {
    this.save = new SaveSystem();
    this.save.load();
    this.progression = new ProgressionSystem(this.save);
    this.progression.reconcile();
    this.custom = new CustomizationSystem(this.save);
    this.garage = new GarageSystem(this.custom);
    this.tournament = new TournamentSystem(this.save);
    this.audio = new AudioManager();

    this.detected = probeGpu();
    this.qualityId = this.resolveQuality();
    this.canvas = document.getElementById('game');
    this.renderer = new GameRenderer(this.canvas, this.qualityId);
    this.fpsMonitor = new FpsMonitor((fps) => this.autoDowngrade(fps));

    this.ui = new UIManager(document.getElementById('ui'), this);
    this.hud = new HUD(document.getElementById('hud'), {
      pause: () => this.openPause(),
      cam: () => this.toggleBallCam(),
      skip: () => this.session?.mgr.skipReplay?.(),
      ball: () => this.session?.mgr.nextAttempt?.(),
      reset: () => this.session?.mgr.nextAttempt?.(),
    });
    this.hud.show(false);
    this.touch = new MobileInput(document.getElementById('touch'), this.settings);
    this.touch.setEnabled(false);
    this.keyboard = new KeyboardInput();
    this.gamepad = new GamepadInput();
    this.keyboard.onAction = this.gamepad.onAction = (code) => this.onKeyAction(code);
    this.router = new InputRouter(this.touch, this.keyboard, this.gamepad, this.settings);

    this.showroom = new Showroom(this.renderer, this.save.data.equipped);
    this.session = null;
    this.last = performance.now();
    this.applySettings();

    window.addEventListener('resize', () => this.onResize());
    window.__onInsetsChanged = () => this.touch.layout();
    Platform.onBack(() => this.onBack());
    Platform.onPause(() => {
      if (this.session && !this.session.paused && this.session.kind === 'match') this.openPause();
      this.audio.suspend();
      this.save.flush();
    });
    Platform.onResume(() => this.audio.resume());
    this.canvas.addEventListener('pointerdown', (e) => {
      this.dragX = e.clientX;
    });
    this.canvas.addEventListener('pointermove', (e) => {
      if (this.dragX == null || this.session || e.buttons === 0) return;
      this.showroom.drag(e.clientX - this.dragX);
      this.dragX = e.clientX;
    });
    window.addEventListener('pointerup', () => (this.dragX = null));

    this.ui.show('splash');
    requestAnimationFrame((t) => this.loop(t));
  }

  get settings() {
    return this.save.data.settings;
  }

  resolveQuality() {
    const g = this.settings.graphics;
    if (g.quality !== 'auto') return g.quality;
    return g.autoResolved || this.detected.tier;
  }

  autoDowngrade(fps) {
    if (this.settings.graphics.quality !== 'auto' || !this.session) return;
    const i = TIER_ORDER.indexOf(this.qualityId);
    if (i <= 0) return;
    const next = TIER_ORDER[i - 1];
    this.settings.graphics.autoResolved = next;
    this.save.save();
    this.setQuality(next);
    this.ui.toast(`Qualité ajustée automatiquement : ${QUALITY[next].label} (${Math.round(fps)} FPS)`);
  }

  setQuality(id) {
    this.qualityId = id;
    this.renderer.setQuality(id);
    const v = this.session?.view;
    if (v) {
      v.quality = QUALITY[id];
      v.glow.setBudget(QUALITY[id].particles);
      v.smoke.setBudget(Math.round(QUALITY[id].particles / 3));
    }
  }

  applySettings(qualityChanged = false) {
    const s = this.settings;
    this.audio.setVolumes(s.audio);
    Platform.vibrationEnabled = s.controls.vibration;
    this.touch.layout();
    if (qualityChanged) {
      const id = this.resolveQuality();
      if (id !== this.qualityId) this.setQuality(id);
      this.fpsMonitor.reset();
    }
    if (this.session) this.session.view.cam.applySettings(s.camera);
    this.save.save();
  }

  onResize() {
    this.renderer.resize();
    this.session?.view.resize();
    this.touch.layout();
  }

  // ---------- flow ----------
  startFromSplash() {
    this.audio.unlock();
    this.audio.setVolumes(this.settings.audio);
    Platform.enterFullscreen();
    Platform.keepAwake();
    this.audio.startMusic();
    this.ui.show('menu');
  }

  onScreen(id) {
    this.showroomVisible = id === 'splash' || id === 'menu' || id === 'garage';
    this.showroom.setFraming(id === 'menu' ? 3.6 : id === 'garage' ? -0.6 : 0);
    if (id === 'menu' || id === 'garage') this.showroom.setCosmetics(this.save.data.equipped);
  }

  previewCosmetics(c) {
    this.showroom.setCosmetics(c);
  }

  toMenu() {
    this.endSession();
    this.ui.closeModal();
    this.ui.show('menu');
  }

  onSaveReplaced() {
    this.progression.reconcile();
    this.touch.settings = this.settings;
    this.router.settings = this.settings;
    this.applySettings(true);
    this.showroom.setCosmetics(this.save.data.equipped);
  }

  // ---------- sessions ----------
  createWorld(infiniteBoost) {
    const seed = (Math.random() * 1e9) | 0;
    const world = new World({ seed, infiniteBoost });
    const eq = this.save.data.equipped;
    const local = world.addCar({ team: 0, name: this.save.data.profile.name, isLocal: true, vehicleId: eq.car, cosmetics: { ...eq } });
    return { world, local, rng: createRng(seed ^ 0x9e3779b9) };
  }

  startMatch(cfg) {
    this.endSession();
    const mode = MODES[cfg.mode] ? cfg.mode : 'quick';
    const size = cfg.mode === 'tournament' ? 3 : MODES[mode].size;
    const arena = cfg.arena === 'random' || !cfg.arena ? THEME_LIST[Math.floor(Math.random() * THEME_LIST.length)].id : cfg.arena;
    const { world, local, rng } = this.createWorld(false);
    const names = BOT_NAMES.slice().sort(() => rng() - 0.5);
    let n = 0;
    for (let i = 1; i < size; i++) world.addCar({ team: 0, name: names[n++], isBot: true, ...this.botLook(0, rng) });
    for (let i = 0; i < size; i++) world.addCar({ team: 1, name: names[n++], isBot: true, ...this.botLook(1, rng) });
    const predictor = new BallPredictor(world.arena);
    const replay = new ReplaySystem(world);
    const mgr = new MatchManager({ world, predictor, replay, duration: cfg.duration || 300, replaysEnabled: this.settings.gameplay.replays });
    const bots = world.cars.filter((c) => c.isBot).map((c) => new BotAI(c, world, cfg.difficulty, rng));
    const brains = [new TeamBrain(world, 0), new TeamBrain(world, 1)];
    this.beginSession({ kind: 'match', cfg: { ...cfg, arena }, world, local, mgr, predictor, bots, brains, arena });
    this.hud.setMode(false);
    this.hud.el.clockSub.textContent = cfg.opponent ? `NOVA · ${cfg.opponent.toUpperCase()}` : `${TEAM[0].name} · ${TEAM[1].name}`;
    mgr.start();
  }

  botLook(team, rng) {
    const cos = randomBotCosmetics(team, rng);
    return { vehicleId: cos.car, cosmetics: cos };
  }

  startTraining(cfg) {
    this.endSession();
    const { world, local } = this.createWorld(true);
    const predictor = new BallPredictor(world.arena);
    const mgr = new TrainingManager(world, cfg.drill);
    this.beginSession({ kind: 'training', cfg, world, local, mgr, predictor, bots: [], brains: [], arena: cfg.arena });
    this.hud.setMode(true);
    this.hud.root.querySelector('[data-h="ball"]').classList.toggle('hidden', cfg.drill !== 'free');
    mgr.start();
    this.hud.announce(DRILLS[cfg.drill].label.toUpperCase(), DRILLS[cfg.drill].desc, null, 2.6);
    this.session.view.cam.snap(local, world.ball);
  }

  beginSession(s) {
    this.audio.stopMusic();
    s.view = new MatchView({ gameRenderer: this.renderer, world: s.world, themeId: s.arena, localCar: s.local });
    s.view.cam.applySettings(this.settings.camera);
    s.view.cam.ballCam = this.settings.camera.ballCam;
    s.acc = 0;
    s.ticks = 0;
    s.paused = false;
    s.inputs = [];
    s.unsub = this.bindSessionEvents(s);
    this.session = s;
    this.hud.show(true);
    this.hud.initPlates(s.world.cars, s.local);
    this.hud.setBallCam(s.view.cam.ballCam);
    this.hud.setReplay(false);
    this.hud.setScore([0, 0]);
    this.touch.setEnabled(true);
    this.touch.layout();
    this.ui.show(null);
    this.showroomVisible = false;
    this.audio.startEngine(getItem(s.local.cosmetics.engine));
    this.audio.startCrowd();
    this.fpsMonitor.reset();
  }

  endSession() {
    const s = this.session;
    if (!s) return;
    s.unsub.forEach((u) => u());
    s.mgr.score?.dispose?.();
    s.mgr.dispose?.();
    s.view.dispose();
    this.session = null;
    this.touch.setEnabled(false);
    this.hud.show(false);
    this.hud.clearAnnounce();
    this.hud.setRespawn('');
    this.audio.stopEngine();
    this.audio.stopCrowd();
    this.audio.startMusic();
    this.save.flush();
  }

  bindSessionEvents(s) {
    const ev = s.world.events;
    const hud = this.hud;
    const audio = this.audio;
    const local = s.local;
    const teamCss = (t) => TEAM[t].css;
    const labels = { save: 'ARRÊT !', shot: 'TIR CADRÉ', assist: 'PASSE DÉCISIVE !', demo: 'DÉMOLITION !', goalCredit: null };
    return [
      ev.on('countdown', ({ value }) => { hud.announce(String(value), s.mgr.overtime ? 'PROLONGATION · BUT EN OR' : '', null, 0.9); audio.countdown(value); }),
      ev.on('go', () => { hud.announce('GO !', '', '#3dffa8', 0.8); audio.countdown(0); }),
      ev.on('kickoff', () => { hud.setReplay(false); s.view.cam.snap(local, s.world.ball); }),
      ev.on('overtime', () => hud.announce('PROLONGATION', 'Le prochain but gagne', '#ffb547', 2)),
      ev.on('goal', (g) => {
        const who = g.scorer ? g.scorer.name : g.ownGoal ? 'Contre son camp' : 'But';
        const sub = g.assist ? `${who} · passe de ${g.assist.name}` : `${who} · ${Math.round(g.speed * 3.6)} km/h`;
        hud.announce('BUT !', sub, teamCss(g.team), 2.4);
        hud.flash(teamCss(g.team));
        hud.feed(g.scorer ? `${who} marque pour ${TEAM[g.team].name}` : `But pour ${TEAM[g.team].name}`, g.team);
        hud.setScore(g.score);
        audio.explosion(g.pos, true);
        audio.goalHorn();
        Platform.vibrate(g.team === local.team ? [60, 40, 90] : [120]);
      }),
      ev.on('replayStart', () => hud.setReplay(true)),
      ev.on('replayEnd', () => hud.setReplay(false)),
      ev.on('statEvent', (e) => {
        const text = labels[e.kind];
        if (!text) return;
        if (e.kind === 'demo') return;
        hud.feed(`${e.car.name} · ${text.replace(' !', '')}`, e.car.team);
        if (e.car === local) hud.popup(text);
      }),
      ev.on('demolish', (e) => {
        hud.feed(`${e.attacker.name} a démoli ${e.victim.name}`, e.attacker.team);
        if (e.attacker === local) hud.popup('DÉMOLITION !');
        audio.explosion(e.victim.physics.pos, false);
        if (e.victim === local || e.attacker === local) Platform.vibrate(e.victim === local ? 120 : 40);
      }),
      ev.on('ballTouch', (e) => {
        if (e.hit && e.strength > 4) audio.ballHit(e.point, e.strength);
        if (e.car === local && e.hit) Platform.vibrate(Math.round(Math.min(35, 8 + e.strength * 0.35)));
      }),
      ev.on('ballBounce', (e) => audio.bounce(e.pos, e.strength)),
      ev.on('carBump', (e) => {
        audio.clank(e.point, e.strength);
        if (e.a === local || e.b === local) Platform.vibrate(20);
      }),
      ev.on('carWall', (e) => { if (e.car === local) audio.thump(e.car.physics.pos, e.strength * 0.5, 55); }),
      ev.on('carLand', (e) => { if (e.car === local) { audio.thump(e.car.physics.pos, e.strength * 0.6, 50); Platform.vibrate(10); } }),
      ev.on('boostPickup', (e) => { if (e.car === local) audio.pickup(e.car.physics.pos, e.pad.big); }),
      ev.on('jump', (e) => { if (e.car === local) audio.whoosh(e.car.physics.pos, 0.25); }),
      ev.on('dodge', (e) => { if (e.car === local) audio.whoosh(e.car.physics.pos, 0.5); }),
      ev.on('trainingGoal', (g) => { hud.announce('BUT !', '', teamCss(0), 1.2); audio.explosion(g.pos, true); audio.crowdCheer(0.8); Platform.vibrate([50, 30, 60]); }),
      ev.on('trainingEvent', (e) => hud.popup(e.text)),
      ev.on('matchEnd', (r) => {
        hud.announce(r.forfeit ? 'ABANDON' : 'FIN DU MATCH', `${r.score[0]} - ${r.score[1]}`, '#ffffff', 2.2);
        audio.goalHorn();
        setTimeout(() => this.finishMatch(s, r), r.forfeit ? 300 : 2200);
      }),
    ];
  }

  finishMatch(s, result) {
    if (this.session !== s) return;
    const local = s.local;
    const d = this.save.data;
    const st = d.stats;
    const won = result.winner === local.team;
    const draw = result.winner === -1;
    st.matches++;
    if (won) st.wins++;
    else if (draw) st.draws++;
    else st.losses++;
    for (const k of ['goals', 'assists', 'saves', 'shots', 'demos']) st[k] += local.stats[k];
    const mvp = result.mvp === local && !result.forfeit;
    if (mvp) st.mvps++;
    st.playTime += result.elapsed;
    let tStatus = null;
    if (s.cfg.mode === 'tournament') {
      tStatus = this.tournament.report(result.score, won);
      if (tStatus === 'champion') this.progression.unlock('tit_champion');
    }
    const xp = matchXp({ won, draw, stats: local.stats, mvp, difficulty: s.cfg.difficulty, forfeit: result.forfeit, tournamentWin: tStatus === 'champion' });
    const prog = this.progression.addXp(xp.total);
    this.save.flush();
    // Keep references for the results screen before disposing the session.
    const snapshot = { ...result, cars: result.cars.map((c) => ({ name: c.name, team: c.team, stats: { ...c.stats } })) };
    const localSnap = snapshot.cars[result.cars.indexOf(local)];
    snapshot.mvp = result.mvp ? snapshot.cars[result.cars.indexOf(result.mvp)] : null;
    this.endSession();
    this.ui.show('results', { result: snapshot, xp, prog, local: localSnap, tournament: tStatus });
    if (prog.levelsGained) this.ui.toast(`Niveau ${prog.after.level} atteint !`);
  }

  // ---------- pause ----------
  openPause() {
    const s = this.session;
    if (!s) return;
    s.paused = true;
    this.touch.releaseAll();
    this.audio.updateEngine(0, 0, false, false);
    const training = s.kind === 'training';
    this.ui.show(null);
    this.ui.modal(`<h2>Pause</h2>
      <button class="btn primary" data-act="resume"><span class="face"><span>Reprendre</span></span></button>
      <button class="btn" data-act="settings"><span class="face"><span>Paramètres</span></span></button>
      ${training ? '<button class="btn" data-act="drill"><span class="face"><span>Changer d’exercice</span></span></button>' : ''}
      <button class="btn ghost" data-act="quit"><span class="face"><span>${training ? 'Quitter l’entraînement' : 'Abandonner le match'}</span></span></button>
      ${training ? '' : '<p class="fair">Abandonner compte comme une défaite.</p>'}`, (act) => {
      if (act === 'resume') this.resume();
      else if (act === 'settings') {
        this.ui.closeModal();
        this.ui.show('settings');
      } else if (act === 'drill') {
        this.ui.closeModal();
        this.endSession();
        this.ui.show('training');
      } else if (act === 'quit') {
        this.ui.closeModal();
        if (training) {
          this.save.data.stats.trainingGoals += s.mgr.success || 0;
          this.toMenu();
        } else {
          s.paused = false;
          s.mgr.endMatch(true);
        }
      }
    });
  }

  resume() {
    this.ui.closeModal();
    this.ui.show(null);
    if (this.session) {
      this.session.paused = false;
      this.session.acc = 0;
    }
  }

  toggleBallCam() {
    const s = this.session;
    if (!s) return;
    s.view.cam.ballCam = !s.view.cam.ballCam;
    this.hud.setBallCam(s.view.cam.ballCam);
  }

  onKeyAction(code) {
    if (code === 'Escape' || code === 'KeyP') {
      if (this.editorBar) return this.closeLayoutEditor(true);
      if (this.session) return this.session.paused ? this.resume() : this.openPause();
      if (this.ui.current && this.ui.current !== 'menu' && this.ui.current !== 'splash') this.ui.show('menu');
    }
    if (code === 'KeyC' || code === 'KeyY') this.toggleBallCam();
    if (code === 'KeyR' && this.session?.kind === 'training') this.session.mgr.nextAttempt();
    if ((code === 'Enter' || code === 'Space') && this.ui.current === 'splash') this.startFromSplash();
  }

  onBack() {
    if (this.editorBar) {
      this.closeLayoutEditor(true);
      return true;
    }
    if (this.ui.modalEl) {
      if (this.session) this.resume();
      else this.ui.closeModal();
      return true;
    }
    if (this.session) {
      if (this.session.mgr.state === 'replay') this.session.mgr.skipReplay();
      else this.openPause();
      return true;
    }
    const cur = this.ui.current;
    if (cur && cur !== 'menu' && cur !== 'splash') {
      this.ui.show('menu');
      return true;
    }
    this.save.flush();
    return false;
  }

  // ---------- layout editor ----------
  openLayoutEditor() {
    const c = this.settings.controls;
    const bar = document.createElement('div');
    bar.className = 'editor-bar';
    bar.innerHTML = `<b style="font-family:var(--display)">Glissez les boutons</b>
      <label>Boutons <input type="range" min="0.7" max="1.4" step="0.05" value="${c.buttonScale}" data-k="buttonScale"></label>
      <label>Joystick <input type="range" min="0.7" max="1.4" step="0.05" value="${c.joystickSize}" data-k="joystickSize"></label>
      <button data-a="reset">Réinitialiser</button><button data-a="cancel">Annuler</button><button class="ok" data-a="ok">Terminer</button>`;
    const before = { buttonScale: c.buttonScale, joystickSize: c.joystickSize };
    bar.querySelectorAll('input').forEach((inp) => inp.addEventListener('input', () => {
      c[inp.dataset.k] = Number(inp.value);
      this.touch.layout();
    }));
    bar.addEventListener('click', (e) => {
      const a = e.target.dataset.a;
      if (a === 'reset') {
        this.touch.resetLayout();
        c.buttonScale = 1;
        c.joystickSize = 1;
        bar.querySelectorAll('input').forEach((i) => (i.value = 1));
        this.touch.layout();
      } else if (a === 'cancel') {
        Object.assign(c, before);
        this.closeLayoutEditor(false);
      } else if (a === 'ok') {
        this.closeLayoutEditor(true);
      }
    });
    document.body.appendChild(bar);
    this.editorBar = bar;
    this.touch.startEditing();
  }

  closeLayoutEditor(save) {
    this.touch.stopEditing(save);
    this.editorBar?.remove();
    this.editorBar = null;
    this.save.save();
    if (this.ui.current === 'settings') this.ui.refresh();
  }

  // ---------- frame loop ----------
  loop(now) {
    requestAnimationFrame((t) => this.loop(t));
    const cap = this.settings.graphics.fpsCap;
    const elapsed = now - this.last;
    if (cap <= 30 && elapsed < 1000 / 30 - 3) return;
    this.last = now;
    const dt = Math.min(0.1, Math.max(0, elapsed / 1000));
    if (this.session) {
      this.frameSession(dt);
      this.fpsMonitor.frame(dt, cap);
      this.hud.setFps(Math.round(this.fpsMonitor.fps), this.settings.graphics.showFps);
    } else if (this.showroomVisible) {
      this.showroom.update(dt);
      this.showroom.render();
    }
  }

  frameSession(dt) {
    const s = this.session;
    const { world, mgr, view, local } = s;
    if (s.paused) {
      view.render();
      return;
    }
    const input = this.router.sample();
    mgr.update(dt);
    if (this.session !== s) return;
    if (mgr.simRunning) {
      s.acc = Math.min(0.25, s.acc + dt * mgr.timeScale);
      const fixed = PHYS.fixedDt;
      while (s.acc >= fixed) {
        s.acc -= fixed;
        this.tick(s, fixed, input);
      }
    }
    const state = mgr.state;
    const mode = state === 'goal' ? 'goal' : state === 'replay' ? 'replay' : 'play';
    const focus = mode === 'replay' ? (mgr.lastGoal?.scorer || local) : null;
    this.touch.root.classList.toggle('dimmed', mode !== 'play');
    view.update(dt, mode, { goalSign: mgr.lastGoal ? (mgr.lastGoal.team === 0 ? 1 : -1) : 1, focusCar: focus });

    // HUD
    const hud = this.hud;
    if (s.kind === 'match') {
      hud.setScore(mgr.score.score);
      hud.setClock(mgr.overtime ? mgr.overtimeTime : mgr.timeLeft, mgr.overtime, !mgr.overtime && mgr.timeLeft <= 0);
    } else {
      hud.setTraining(mgr.hud());
    }
    this.touch.setBoost(world.infiniteBoost ? 100 : local.boost);
    hud.setRespawn(local.demolished && state === 'playing' ? `Réapparition dans ${Math.max(0, local.respawnTimer).toFixed(1)} s` : '');
    hud.setSpeedFx(local.physics.speed > 52 && !local.demolished);
    hud.updatePlates(view, this.settings.gameplay.nameplates && mode === 'play');
    hud.updateBallArrow(view, world.ball, mode === 'play');

    // Audio
    const cam = view.camera;
    this.audio.setListener(cam.position, { x: cam.matrixWorld.elements[0], z: cam.matrixWorld.elements[2] });
    const activeEngine = !local.demolished && mode === 'play';
    this.audio.updateEngine(local.physics.speed, input.throttle, local.boosting, activeEngine);
    const nearGoal = Math.max(0, 1 - (ARENA.halfLength - Math.abs(world.ball.pos.z)) / 30);
    this.audio.setCrowdExcitement(state === 'goal' ? 1 : nearGoal);
    view.render();
  }

  tick(s, dt, input) {
    const { world, mgr, predictor } = s;
    s.ticks++;
    if (s.ticks % 4 === 1) predictor.update(world.ball);
    const kickoff = mgr.state === 'countdown' || (mgr.state === 'playing' && world.touchHistory.length === 0);
    for (const b of s.brains) b.update(dt, predictor, kickoff);
    const inputs = s.inputs;
    inputs[s.local.id] = input;
    for (const bot of s.bots) {
      inputs[bot.car.id] = bot.update(dt, { predictor, brain: s.brains[bot.car.team], oppBrain: s.brains[1 - bot.car.team], kickoff });
    }
    world.step(dt, inputs);
    mgr.simStep(dt);
  }
}

function boot() {
  try {
    window.game = new Game();
  } catch (e) {
    console.error(e);
    const d = document.createElement('div');
    d.style.cssText = 'position:fixed;inset:0;display:grid;place-items:center;padding:24px;text-align:center;font:16px sans-serif;color:#eaf2ff;background:#070a14';
    d.textContent = `Impossible de démarrer le jeu (${e.message}). WebGL est requis : essayez un autre navigateur ou mettez à jour Android System WebView.`;
    document.body.appendChild(d);
  }
}

if (document.fonts && document.fonts.ready) document.fonts.ready.then(boot);
else window.addEventListener('load', boot);
