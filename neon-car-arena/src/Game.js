import * as THREE from 'three';
import { TEAM } from './config/GameConfig.js';
import { ITEM_BY_ID } from './config/ItemCatalog.js';
import { ARENA_IDS } from './config/ArenaCatalog.js';
import { MatchManager } from './sim/MatchManager.js';
import { Simulation } from './sim/Simulation.js';
import { Car } from './sim/Car.js';
import { SceneView } from './render/SceneView.js';
import { QualityManager } from './quality/QualityManager.js';
import { InputManager } from './input/InputManager.js';
import { HumanController } from './controllers/HumanController.js';
import { AudioManager } from './audio/AudioManager.js';
import { SaveSystem } from './meta/SaveSystem.js';
import { ProgressionSystem, XP } from './meta/ProgressionSystem.js';
import { CustomizationSystem } from './meta/CustomizationSystem.js';
import { GarageSystem } from './meta/GarageSystem.js';
import { TournamentSystem } from './meta/TournamentSystem.js';
import { UIManager } from './ui/UIManager.js';
import { HUD } from './ui/HUD.js';

// Chef d'orchestre : boucle principale, transitions MENU → MATCH → RÉSULTATS → MENU.
export class Game {
  constructor({ canvas, uiRoot, touchRoot }) {
    this.canvas = canvas;
    this.save = new SaveSystem();
    this.progress = new ProgressionSystem(this.save);
    this.progress.sync();
    this.custom = new CustomizationSystem(this.save);
    this.garage = new GarageSystem(this.save, this.custom);
    this.tournament = new TournamentSystem(this.save);
    const s = this.save.data.settings;
    this.quality = new QualityManager(s.graphics.quality, s.graphics.detected);
    this.quality.onChange = (what) => this.onQualityChange(what);
    this.audio = new AudioManager(s.audio);
    this.audio.setEngine(ITEM_BY_ID[this.save.data.loadout.engine]?.data || ITEM_BY_ID.eng_classic.data);
    this.input = new InputManager(touchRoot, s.controls);
    this.input.onAction = (a) => this.onAction(a);
    this.human = new HumanController(this.input, s.controls);
    this.ui = new UIManager(uiRoot, this);
    this.uiRoot = uiRoot;

    this.createRenderer();
    this.state = 'boot';
    this.match = null;
    this.view = null;
    this.menuView = null;
    this.menuMode = 'menu';
    this.last = performance.now();
    this.frameAcc = 0;
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'match' && this.match && !this.match.paused && this.match.phase !== 'ended') this.pause();
      if (document.hidden) this.save.save(true);
    });
    this.buildMenuScene();
    this.resize();
    this.ui.boot(() => this.start());
    requestAnimationFrame((t) => this.loop(t));
  }

  createRenderer() {
    const p = this.quality.preset();
    this.renderer?.dispose();
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: p.antialias, powerPreference: 'high-performance', stencil: false });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.applyPixelRatio();
  }

  applyPixelRatio() {
    const p = this.quality.preset();
    const dpr = Math.min(window.devicePixelRatio || 1, p.maxDpr) * p.pixelRatio * this.quality.scale;
    this.renderer.setPixelRatio(Math.max(0.5, dpr));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
    (this.view || this.menuView)?.resize(window.innerWidth, window.innerHeight);
  }

  resize() { this.applyPixelRatio(); }

  onQualityChange(what) {
    const s = this.save.data.settings.graphics;
    s.detected = this.quality.detected;
    this.save.save();
    if (what === 'level') {
      // Changement de profil : on reconstruit le rendu au prochain retour menu pour ne pas couper le match
      this.pendingRebuild = true;
    }
    this.applyPixelRatio();
  }

  // ---------- Démarrage ----------
  start() {
    this.audio.unlock();
    this.audio.setMusic(true);
    const el = document.documentElement;
    if (this.input.touchUsed && el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen({ navigationUI: 'hide' }).then(() => screen.orientation?.lock?.('landscape').catch(() => {})).catch(() => {});
    }
    this.state = 'menu';
    this.ui.menu();
  }

  buildMenuScene() {
    this.menuView?.dispose();
    const sim = new Simulation(3);
    const car = new Car({ id: 0, team: 0, name: this.save.data.profile.name, vehicleId: this.garage.vehicleId, loadout: this.save.data.loadout });
    sim.addCar(car);
    sim.placeCar(car, 0, 0, 10, 16);
    sim.ball.reset(-9, sim.ball.radius, 12);
    for (const p of sim.pads) p.active = true;
    const arenaId = this.save.data.settings.game.arena;
    this.menuSim = sim;
    this.menuView = new SceneView(this.renderer, { arenaId: ARENA_IDS.includes(arenaId) ? arenaId : 'neon_dome', sim, quality: this.quality.preset(), playerId: 0 });
    this.menuView.resize(window.innerWidth, window.innerHeight);
    this.menuView.cam.snap();
  }

  refreshMenuCar() {
    const car = this.menuSim.cars[0];
    car.setVehicle(this.garage.vehicleId);
    car.loadout = this.save.data.loadout;
    this.menuSim.placeCar(car, 0, 0, 10, 16);
    this.buildMenuScene();
    this.audio.setEngine(ITEM_BY_ID[this.save.data.loadout.engine].data);
  }

  setMenuView(mode) { this.menuMode = mode; }

  applySettings() {
    const s = this.save.data.settings;
    this.audio.settings = s.audio;
    this.audio.applyVolumes();
    this.input.settings = s.controls;
    this.human.settings = s.controls;
    this.input.mobile.settings = s.controls;
    this.input.mobile.applyLayout();
    if (this.view) this.view.cam.apply(s.camera);
    this.hud?.showFps(s.graphics.showFps);
    if (s.graphics.quality !== this.quality.setting) {
      this.quality.setting = s.graphics.quality;
      this.quality.scale = 1;
      this.pendingRebuild = true;
      if (this.state === 'menu') this.rebuildRenderer();
    }
  }

  rebuildRenderer() {
    this.pendingRebuild = false;
    this.createRenderer();
    this.buildMenuScene();
  }

  // ---------- Match ----------
  startMatch(opts) {
    this.lastMatchOpts = opts;
    this.ui.clear();
    this.audio.unlock();
    this.audio.setMusic(false);
    this.disposeMatch();
    const d = this.save.data;
    const match = new MatchManager({
      ...opts,
      replays: d.settings.game.replays,
      player: { name: d.profile.name, vehicleId: this.garage.vehicleId, loadout: d.loadout },
    });
    match.humanController = this.human;
    this.match = match;
    this.view = new SceneView(this.renderer, { arenaId: opts.arenaId, sim: match.sim, quality: this.quality.preset(), playerId: 0 });
    this.view.cam.apply(d.settings.camera);
    this.view.resize(window.innerWidth, window.innerHeight);
    this.hud = new HUD(this.uiRoot, this, match);
    this.hud.showFps(d.settings.graphics.showFps);
    this.hud.setTouch(this.input.touchUsed);
    this.input.setTouchVisible(true);
    this.trainingGoals = 0;
    this.matchTime = 0;
    this.bindMatchEvents(match);
    this.state = 'match';
    if (match.training) this.hud.drillState(match.drills.state());
    this.hud.feed(match.training ? `Entraînement · ${match.drills.label}` : `${opts.label || 'Match'} · ${opts.teamSize}v${opts.teamSize}`, 'var(--pink)');
  }

  startTournamentMatch() {
    const cur = this.tournament.current();
    if (!cur) { this.ui.tournamentScreen(); return; }
    this.startMatch({ mode: 'tournament', label: `${cur.roundName} · ${cur.opponent}`, teamSize: 3, difficulty: cur.difficulty, duration: 180, arenaId: cur.arena, tournament: true });
  }

  rematch() { if (this.lastMatchOpts) this.startMatch(this.lastMatchOpts); }

  bindMatchEvents(m) {
    const player = m.playerCar;
    const view = this.view;
    const vib = (ms) => { if (this.save.data.settings.controls.vibration && navigator.vibrate) navigator.vibrate(ms); };
    m.events.on('countdown', (n) => {
      this.hud.centerText(n === 0 ? 'GO !' : String(n), n === 0 ? '#4cf0a0' : '#fff');
      this.audio.countdown(n);
    });
    m.events.on('kickoff', ({ overtime }) => { view.cam.snap(); if (overtime) this.hud.feed('PROLONGATION · but en or', 'var(--gold)'); });
    m.events.on('overtime', () => this.audio.whistle());
    m.events.on('ballTouch', ({ car, strength }) => {
      if (strength > 8) {
        const p = m.sim.ball.pos;
        view.hitSpark(p, strength, TEAM[car.team].color);
        this.audio.ballHit(strength, p);
        if (car === player) { vib(strength > 30 ? 25 : 12); if (strength > 40) view.cam.shake(0.25); }
      }
    });
    m.events.on('ballBounce', ({ speed, pos }) => this.audio.bounce(speed, pos));
    m.events.on('carBump', ({ a, b, strength }) => {
      this.audio.bump(strength, a.pos);
      view.hitSpark(a.pos.clone().lerp(b.pos, 0.5), strength, 0xffffff);
      if (a === player || b === player) { vib(30); view.cam.shake(0.35); }
    });
    m.events.on('boostPickup', ({ car, pad }) => {
      if (car === player) this.audio.pickup(pad.big);
      view.pickupFx(pad);
    });
    m.events.on('carJump', ({ car }) => { if (car === player) this.audio.jump(); });
    m.events.on('carDash', ({ car }) => { if (car === player) this.audio.dash(); });
    m.events.on('carLand', ({ car, speed }) => { if (speed > 12) view.landingDust(car.pos, speed); if (car === player) this.audio.land(speed); });
    m.events.on('statEvent', ({ car, kind }) => {
      if (kind === 'save') this.hud.feed(`${car.name} · ARRÊT !`, TEAM[car.team].css);
      if (kind === 'shot' && car === player) this.hud.feed('Tir cadré +20', TEAM[car.team].css);
    });
    m.events.on('goal', (info) => {
      const scorerCar = info.scorer || (info.training ? player : null);
      const goalItem = scorerCar?.loadout ? ITEM_BY_ID[scorerCar.loadout.goalfx] : view.carViews[scorerCar?.id ?? 0]?.model.goalItem;
      view.goalExplosion(info.pos, goalItem, TEAM[info.team].color);
      this.audio.goal(player ? info.team === player.team : true);
      vib([60, 40, 90]);
      if (info.training) {
        this.trainingGoals++;
        this.save.data.stats.trainingGoals++;
        return;
      }
      this.hud.goal(info, player?.team);
      view.arena.updateScreens(info.score, m.timeLabel(), { text: 'BUT !', color: TEAM[info.team].css });
      setTimeout(() => this.view === view && view.arena.updateScreens(info.score, m.timeLabel()), 2500);
      if (info.scorer) this.hud.feed(`${info.scorer.name} marque !${info.assist ? ` (passe : ${info.assist.name})` : ''}`, TEAM[info.team].css);
      else if (info.ownGoal) this.hud.feed('Contre son camp !', TEAM[info.team].css);
    });
    m.events.on('phase', (p) => {
      this.hud.replay(p === 'replay');
      this.input.setTouchVisible(p !== 'replay' && p !== 'ended');
      if (p === 'replay') view.cam.snap();
      if (p === 'goal') view.cam.snap();
    });
    m.events.on('drill', (s) => this.hud.drillState(s));
    m.events.on('drillResult', (r) => { this.hud.drillState(m.drills.state(), r); if (r.ok) this.audio.pickup(true); });
    m.events.on('matchEnd', (r) => setTimeout(() => this.onMatchEnd(r), 1200));
  }

  onMatchEnd(result) {
    if (this.match?.result !== result) return;
    this.input.setTouchVisible(false);
    this.hud?.destroy();
    this.hud = null;
    const xpLines = this.progress.matchXp(result);
    let tournament = null;
    if (result.mode === 'tournament') {
      tournament = this.tournament.report(result);
      if (tournament?.champion) {
        xpLines.push([`${tournament.cup.label} remportée`, tournament.cup.xp]);
        this.save.data.stats.tournamentsWon++;
        if (tournament.cup.id === 'gold') this.progress.unlock('title_champion');
      }
    }
    this.progress.recordMatch(result, this.matchTime);
    const xpTotal = xpLines.reduce((a, [, v]) => a + v, 0);
    const { levelsGained, unlocked } = this.progress.addXp(xpTotal);
    if (tournament?.champion && tournament.cup.id === 'gold') unlocked.push(ITEM_BY_ID.title_champion);
    this.save.save(true);
    this.state = 'results';
    this.audio.setMusic(true);
    this.ui.results(result, { xpLines, xpTotal, levelsGained, unlocked, tournament });
  }

  quitMatch() {
    const training = this.match?.training;
    if (training && this.match) {
      const minutes = this.matchTime / 60;
      const xp = Math.min(200, Math.round(minutes * XP.trainingDrill * 2));
      if (xp > 0) { this.progress.addXp(xp); this.ui.toast(`Entraînement : +${xp} XP`); }
      this.save.data.stats.playTime += this.matchTime;
      this.save.save();
    }
    this.toMenu();
  }

  toMenu() {
    this.disposeMatch();
    this.input.setTouchVisible(false);
    this.state = 'menu';
    if (this.pendingRebuild) this.rebuildRenderer();
    this.menuView.cam.snap();
    this.audio.setMusic(true);
    this.ui.menu();
  }

  disposeMatch() {
    this.hud?.destroy();
    this.hud = null;
    this.view?.dispose();
    this.view = null;
    this.match = null;
  }

  pause() {
    if (!this.match || this.match.phase === 'ended') return;
    this.match.paused = true;
    this.input.setTouchVisible(false);
    this.input.mobile.releaseAll();
    this.ui.pause();
  }

  resume() {
    if (!this.match) return;
    this.ui.clear();
    this.match.paused = false;
    this.input.setTouchVisible(true);
    this.last = performance.now();
  }

  resetDrill() { if (this.match?.training) this.match.startKickoff(); }

  toggleBallCam() {
    const c = this.save.data.settings.camera;
    c.ballCam = !c.ballCam;
    this.save.save();
    this.view?.cam.apply(c);
    this.hud?.setBallCam(c.ballCam);
    this.hud?.feed(c.ballCam ? 'Caméra balle' : 'Caméra libre');
  }

  onAction(a) {
    if (a === 'ballcam' && this.state === 'match') this.toggleBallCam();
    if (a === 'pause' && this.state === 'match') this.match?.paused ? this.resume() : this.pause();
    if (a === 'reset') this.resetDrill();
  }

  // ---------- Boucle principale ----------
  loop(now) {
    requestAnimationFrame((t) => this.loop(t));
    let dt = (now - this.last) / 1000;
    const cap = this.save.data.settings.graphics.fpsCap;
    if (cap === 30) {
      this.frameAcc += dt;
      this.last = now;
      if (this.frameAcc < 1 / 30 - 0.002) return;
      dt = this.frameAcc;
      this.frameAcc = 0;
    } else this.last = now;
    dt = Math.min(dt, 0.1);
    if (this.state === 'match' && this.match) this.frameMatch(dt);
    else this.frameMenu(dt);
    this.quality.sample(dt, cap);
  }

  frameMenu(dt) {
    const v = this.menuView;
    const car = this.menuSim.cars[0];
    const garage = this.menuMode === 'garage';
    v.update(dt, null);
    const center = new THREE.Vector3(car.pos.x, car.pos.y + (garage ? 0.5 : 1.2), car.pos.z);
    v.cam.orbit(dt, center, garage ? 9 : 11, garage ? 2.2 : 3.2, garage ? 0.25 : 0.15);
    // Décale la scène vers la droite : la voiture reste visible à côté des menus
    const w = window.innerWidth, h = window.innerHeight;
    v.camera.setViewOffset(w, h, -w * (garage ? 0.17 : 0.2), -h * 0.04, w, h);
    v.cam.settings.fov = 60;
    v.cam.finish(dt, 0);
    this.audio.update(null);
    v.render();
  }

  frameMatch(dt) {
    const m = this.match;
    const view = this.view;
    if (view.camera.view) view.camera.clearViewOffset();
    this.human.sample();
    if (!m.paused) {
      m.update(dt);
      if (m.phase === 'playing') this.matchTime += dt;
    }
    const replay = m.phase === 'replay' ? m.replay.view : null;
    view.update(m.paused ? 0 : dt * (m.phase === 'goal' ? m.timeScale : 1), m, replay);
    const cam = view.cam;
    const player = m.playerCar;
    const ps = view.playerState();
    if (m.phase === 'replay') {
      cam.replayFollow(dt, replay.ball.pos);
      cam.finish(dt, 0);
    } else if (m.phase === 'goal' && !m.training) {
      cam.orbit(dt, m.lastGoal.pos, 30, 10, 0.35);
      cam.finish(dt, 0);
    } else if (ps) {
      cam.follow(dt, { pos: ps.pos, quat: ps.quat, onGround: player.onGround }, view.ballPos());
      cam.finish(dt, player.supersonic ? 1 : player.boosting ? 0.55 : 0);
    }
    this.audio.setListener(cam.camera.position);
    const ballNearGoal = Math.max(0, (Math.abs(m.sim.ball.pos.z) - 60) / 44);
    this.audio.update(player && !m.paused && m.phase !== 'replay' ? {
      active: true, speedRatio: player.vel.length() / 42, throttle: player.throttle, boosting: player.boosting, excitement: ballNearGoal,
    } : null);
    this.input.mobile.setBoost(player ? (player.infiniteBoost ? 100 : player.boost) : 0);
    this.hud?.update(dt, view.camera, player);
    if (this.hud && !m.training) {
      this.screenAcc = (this.screenAcc || 0) + dt;
      if (this.screenAcc > 1 && m.phase !== 'goal') { this.screenAcc = 0; view.arena.updateScreens(m.score.teamScore, m.timeLabel()); }
    }
    view.render();
  }
}

