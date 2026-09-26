import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

import { PHYS, TEAM_COLORS, BOT_NAMES, BODIES } from './config.js';
import { Match } from './sim/match.js';
import { ARENA } from './sim/arena.js';
import { Bot } from './ai/bot.js';
import { buildArena, buildSky, buildEnvScene, THEMES } from './render/arenaView.js';
import { makeBallTextures, makeShadowTexture } from './render/textures.js';
import { CarView } from './render/carModel.js';
import { Effects } from './render/particles.js';
import { CameraRig, horizontalToVerticalFov, keepInsideArena } from './render/camera.js';
import { Input, keyLabel } from './input/input.js';
import { TouchControls, isTouchDevice } from './input/touch.js';
import { Sound } from './audio/audio.js';
import { Hud } from './ui/hud.js';
import { Menus } from './ui/menus.js';
import { loadSettings, saveSettings, hasSavedSettings, QUALITY } from './ui/settings.js';

const DT = PHYS.dt;
// Light colour grading and vignette applied after tone mapping.
const GRADE_SHADER = {
  uniforms: { tDiffuse: { value: null }, vignette: { value: 0.5 }, saturation: { value: 1.1 } },
  vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: `uniform sampler2D tDiffuse; uniform float vignette; uniform float saturation; varying vec2 vUv;
    void main() {
      vec4 c = texture2D(tDiffuse, vUv);
      float l = dot(c.rgb, vec3(0.2126, 0.7152, 0.0722));
      c.rgb = mix(vec3(l), c.rgb, saturation);
      c.rgb = mix(c.rgb, c.rgb * c.rgb * (3.0 - 2.0 * c.rgb), 0.18);
      vec2 d = vUv - 0.5;
      c.rgb *= 1.0 - dot(d, d) * vignette;
      gl_FragColor = c;
    }`,
};
const QUICK_CHAT = ['Je l\'ai !', 'Joli tir !', 'Quel arrêt !', 'Merci !', 'Calculé.', 'Oups…', 'Défends !', 'Bien joué !'];
const BALL_TRAIL = new THREE.Color(0.75, 0.9, 1.3);
const ACCENT_POOL = [0x1b1d22, 0xe8e8e8, 0xd62828, 0xf7c948, 0x2ec27e, 0x8a4dff, 0x00c2d1, 0x444a57];
const tmpV = new THREE.Vector3();
const tmpV2 = new THREE.Vector3();

function shuffled(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

class App {
  constructor() {
    this.settings = loadSettings();
    const params = new URLSearchParams(window.location.search);
    this.isApp = params.get('app') === 'android';
    this.isTouch = this.isApp || params.has('touch') || isTouchDevice();
    document.body.classList.toggle('touch', this.isTouch);
    // Phones get lighter graphics until the player picks something else.
    if (this.isTouch && !hasSavedSettings()) this.settings.quality = 'medium';
    this.canvas = document.getElementById('game');
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.scene = new THREE.Scene();

    this.pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environmentIntensity = 0.8;

    this.cameras = [new THREE.PerspectiveCamera(80, 1, 0.1, 3000), new THREE.PerspectiveCamera(80, 1, 0.1, 3000)];
    this.cameras[0].layers.enable(3);
    this.cameras[1].layers.enable(2);
    this.rigs = this.cameras.map((c) => new CameraRig(c));

    this.effects = new Effects(this.scene);
    this.input = new Input(this.settings);
    if (this.isTouch) {
      this.touch = new TouchControls(this.input);
      this.input.touch = this.touch;
    }
    this.sound = new Sound(this.settings);
    this.hud = new Hud(document.getElementById('hud'));
    this.menus = new Menus(document.getElementById('ui'), this);

    const bt = makeBallTextures();
    this.ballMesh = new THREE.Mesh(
      new THREE.SphereGeometry(PHYS.ballRadius, 48, 32),
      new THREE.MeshStandardMaterial({
        map: bt.map, emissiveMap: bt.emissiveMap, emissive: 0xffffff, emissiveIntensity: 1.3, roughness: 0.38, metalness: 0.35,
      }),
    );
    this.ballMesh.castShadow = true;
    this.scene.add(this.ballMesh);
    this.ballShadow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.6, 2.6),
      new THREE.MeshBasicMaterial({ map: makeShadowTexture(), transparent: true, depthWrite: false }),
    );
    this.ballShadow.rotation.x = -Math.PI / 2;
    this.ballShadow.renderOrder = 2;
    this.scene.add(this.ballShadow);

    this.world = null;
    this.themeKey = null;
    this.qualityKey = null;
    this.match = null;
    this.mode = 'menu';
    this.paused = false;
    this.carViews = [];
    this.locals = [];
    this.bots = [];
    this.acc = 0;
    this.last = performance.now();
    this.fpsFrames = 0;
    this.fpsTime = 0;
    this.fps = 0;
    this.attractTime = 0;
    this.endTimer = -1;
    this.garage = null;
    this.frameEvents = [];

    this.applySettings(false);
    this.buildWorld(this.settings.theme);
    window.addEventListener('resize', () => this.resize());
    this.resize();

    const unlock = () => {
      this.sound.init();
      if (this.mode === 'menu') this.sound.startMusic();
    };
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);

    this.startAttract();
    this.menus.show('main', false);
    document.getElementById('loading').remove();
    requestAnimationFrame((t) => this.frame(t));
  }

  // ---------- Settings ----------
  get quality() {
    return QUALITY[this.settings.quality] || QUALITY.high;
  }

  saveSettings() {
    saveSettings(this.settings);
  }

  applySettings(save = true) {
    const s = this.settings;
    this.sound.applyVolumes();
    if (this.qualityKey && this.qualityKey !== s.quality) this.buildWorld(this.themeKey, true);
    this.qualityKey = s.quality;
    this.resize();
    if (this.garage) this.refreshGarage();
    if (this.mode === 'menu' && this.menus.screen === 'play' && s.theme !== this.themeKey) this.buildWorld(s.theme);
    if (this.mode === 'menu' && this.menus.screen === 'free' && s.theme !== this.themeKey) this.buildWorld(s.theme);
    if (save) this.saveSettings();
  }

  resize() {
    const q = this.quality;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.pixelRatio));
    this.renderer.setSize(w, h, false);
    if (this.composer) {
      this.composer.setPixelRatio(this.renderer.getPixelRatio());
      this.composer.setSize(w, h);
    }
  }

  // ---------- World ----------
  buildWorld(themeKey, force = false) {
    if (themeKey === this.themeKey && !force) return;
    const theme = THEMES[themeKey] || THEMES.day;
    this.themeKey = THEMES[themeKey] ? themeKey : 'day';
    const q = this.quality;
    if (this.world) {
      this.scene.remove(this.world.group);
      this.world.group.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
      });
    }
    const group = new THREE.Group();
    const arena = buildArena(theme, q);
    group.add(arena.group);
    group.add(buildSky(theme));
    const hemi = new THREE.HemisphereLight(theme.hemiSky, theme.hemiGround, theme.hemiIntensity);
    group.add(hemi);
    const sun = new THREE.DirectionalLight(theme.sun, theme.sunIntensity);
    sun.position.set(...theme.sunDir).normalize().multiplyScalar(120);
    sun.target.position.set(0, 0, 0);
    sun.castShadow = q.shadows;
    sun.shadow.mapSize.set(q.shadowSize, q.shadowSize);
    const sc = sun.shadow.camera;
    sc.left = -62; sc.right = 62; sc.top = 72; sc.bottom = -72; sc.near = 10; sc.far = 300;
    sun.shadow.bias = -0.0004;
    sun.shadow.normalBias = 0.03;
    group.add(sun, sun.target);
    this.scene.add(group);
    this.scene.fog = new THREE.Fog(theme.fog, 220, 1100);
    // Reflections come from a miniature version of this arena's sky, lights and stands.
    if (this.envTarget) this.envTarget.dispose();
    this.envTarget = this.pmrem.fromScene(buildEnvScene(theme), 0.02, 0.1, 1500);
    this.scene.environment = this.envTarget.texture;
    this.renderer.shadowMap.enabled = q.shadows;
    this.renderer.toneMappingExposure = theme.exposure;
    this.world = { group, updatePads: arena.updatePads };

    this.composer = null;
    if (q.bloom) {
      // Multisampled target: the composer path keeps its anti-aliasing.
      const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: q.msaa || 4 });
      const composer = new EffectComposer(this.renderer, rt);
      this.renderPass = new RenderPass(this.scene, this.cameras[0]);
      composer.addPass(this.renderPass);
      this.bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.48, 0.4, 1.05);
      composer.addPass(this.bloom);
      composer.addPass(new OutputPass());
      composer.addPass(new ShaderPass(GRADE_SHADER));
      this.composer = composer;
    }
    this.scene.traverse((o) => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.needsUpdate = true; }); });
    this.resize();
  }

  // ---------- Matches ----------
  makePlayers(cfg) {
    const s = this.settings;
    const names = shuffled(BOT_NAMES);
    const bodies = Object.keys(BODIES);
    const players = [];
    const human = (name, team, body, idx) => ({ team, name, body, isBot: false, local: idx });
    if (cfg.freeplay) return [human(s.playerName, 0, s.body, 0)];
    const size = cfg.teamSize;
    const humans = [human(s.playerName, cfg.team, s.body, 0)];
    if (cfg.splitscreen) humans.push(human(s.player2Name, cfg.p2Team, bodies[(bodies.indexOf(s.body) + 1) % bodies.length], 1));
    for (let team = 0; team < 2; team++) {
      const mine = humans.filter((h) => h.team === team);
      players.push(...mine);
      for (let i = mine.length; i < size; i++) {
        players.push({ team, name: names.pop(), body: bodies[Math.floor(Math.random() * bodies.length)], isBot: true });
      }
    }
    return players;
  }

  startMatch(cfg) {
    this.clearMatch();
    this.lastConfig = cfg;
    const s = this.settings;
    if (cfg.theme) this.buildWorld(cfg.theme);
    else this.buildWorld(s.theme);
    const players = this.makePlayers(cfg);
    this.match = new Match({
      players,
      duration: cfg.freeplay ? 0 : cfg.duration,
      freeplay: !!cfg.freeplay,
      unlimitedBoost: !!cfg.unlimitedBoost || cfg.boostMode === 'unlimited',
      noBoost: cfg.boostMode === 'none',
      gravityScale: cfg.gravityScale || 1,
      mode: cfg.gameMode || 'classic',
      replays: cfg.freeplay ? false : cfg.replays,
    });
    this.splitscreen = !!cfg.splitscreen && !cfg.freeplay;
    this.locals = [];
    this.match.cars.forEach((car, i) => {
      if (players[i].local !== undefined) this.locals[players[i].local] = { car, index: players[i].local };
    });
    this.locals = this.locals.filter(Boolean);
    this.bots = this.match.cars.filter((c) => c.isBot).map((c) => new Bot(c, cfg.difficulty || 'pro'));
    this.createCarViews(this.match);
    this.rigs.forEach((r) => { r.reset(); r.ballCam = s.ballCamDefault; });
    this.mode = 'match';
    this.paused = false;
    this.endTimer = -1;
    this.acc = 0;
    this.effects.clear();
    this.menus.hide();
    this.menus.stack = [];
    this.hud.root.classList.remove('hidden');
    this.hud.setup(this.match, this.locals, this.viewports());
    if (this.isTouch) {
      if (!s.tutorialSeen || cfg.freeplay) {
        this.hud.showHint('Joystick à gauche : rouler et diriger (en l\'air : pivoter) · <b>SAUT</b> deux fois = flip · <b>BOOST</b> · <b>DÉRAPE</b> = dérapage / air roll', 9);
        s.tutorialSeen = true;
        this.saveSettings();
      }
      this.enterFullscreen();
    } else if (!s.tutorialSeen || cfg.freeplay) {
      const k = (a) => `<span class="key">${keyLabel(s.keys[a][0])}</span>`;
      this.hud.showHint(`${k('throttle')}${k('reverse')} rouler · ${k('left')}${k('right')} tourner · ${k('jump')} sauter (2× = flip) · ${k('boost')} boost · ${k('ballCam')} caméra · ${k('pause')} pause${cfg.freeplay ? ` · ${k('resetBall')} balle · ${k('shootBall')} tir` : ''}`, 12);
      s.tutorialSeen = true;
      this.saveSettings();
    }
    this.sound.init();
    this.sound.stopMusic();
    document.body.style.cursor = 'none';
  }

  // Mobile browsers: go full screen and lock landscape (the Android app already is).
  enterFullscreen() {
    if (this.isApp) return;
    try {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) {
        el.requestFullscreen().then(() => {
          if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(() => {});
        }).catch(() => {});
      }
    } catch (e) {
      // Not allowed here: the player can still rotate the phone.
    }
  }

  createCarViews(match) {
    this.carViews.forEach((v) => { this.scene.remove(v.group); v.dispose(); });
    const s = this.settings;
    const localCars = new Set(this.locals.map((l) => l.car));
    this.carViews = match.cars.map((car, i) => {
      const local = localCars.has(car);
      const accent = local ? new THREE.Color(s.accent).getHex() : ACCENT_POOL[(i * 3 + 1) % ACCENT_POOL.length];
      const boost = local && s.boostColor !== 'team' ? new THREE.Color(s.boostColor).getHex() : null;
      const view = new CarView(car, {
        teamColor: TEAM_COLORS[car.team].main, accent, boostColor: boost, showName: !local || this.splitscreen, lite: !this.quality.bloom,
      });
      // In split screen a player never sees their own name tag.
      const li = this.locals.findIndex((l) => l.car === car);
      if (view.nameTag && li >= 0) view.nameTag.layers.set(2 + li);
      this.scene.add(view.group);
      return view;
    });
  }

  clearMatch() {
    this.match = null;
    if (this.touch) this.touch.show(false);
    this.carViews.forEach((v) => { this.scene.remove(v.group); v.dispose(); });
    this.carViews = [];
    this.bots = [];
    this.locals = [];
    this.hud.clear();
    this.hud.root.classList.add('hidden');
  }

  startAttract() {
    this.clearMatch();
    this.mode = 'menu';
    this.splitscreen = false;
    const names = shuffled(BOT_NAMES);
    const bodies = Object.keys(BODIES);
    const players = [];
    for (let team = 0; team < 2; team++) {
      for (let i = 0; i < 2; i++) players.push({ team, name: names.pop(), body: bodies[(team * 2 + i) % 4], isBot: true });
    }
    this.match = new Match({ players, duration: 0, replays: false });
    this.bots = this.match.cars.map((c) => new Bot(c, 'allstar'));
    this.createCarViews(this.match);
    this.rigs[0].reset();
    this.attractTime = 0;
    document.body.style.cursor = '';
  }

  restart() {
    if (this.lastConfig) this.startMatch(this.lastConfig);
  }

  resume() {
    this.paused = false;
    this.menus.hide();
    this.menus.stack = [];
    document.body.style.cursor = 'none';
  }

  pause() {
    if (this.mode !== 'match' || this.match.state === 'ended') return;
    this.paused = true;
    if (this.touch) this.touch.show(false);
    this.menus.stack = [];
    this.menus.show('pause', false);
    this.sound.silenceEngines();
    document.body.style.cursor = '';
  }

  quitToMenu() {
    this.paused = false;
    this.menus.stack = [];
    this.startAttract();
    this.menus.show('main', false);
    this.sound.startMusic();
  }

  inMatch() {
    return this.mode === 'match';
  }

  localTeam() {
    return this.locals.length ? this.locals[0].car.team : 0;
  }

  localTeams() {
    return new Set(this.locals.map((l) => l.car.team));
  }

  onMenuChange(name) {
    if (name === 'garage') this.enterGarage();
    else if (this.garage) this.exitGarage();
    if ((name === 'play' || name === 'free') && this.mode === 'menu') this.buildWorld(this.settings.theme);
  }

  // ---------- Garage preview ----------
  enterGarage() {
    if (this.garage) return;
    this.garage = { t: 0, view: null };
    this.rigs[0].reset();
    this.refreshGarage();
  }

  refreshGarage() {
    if (!this.garage) return;
    const s = this.settings;
    if (this.garage.view) { this.scene.remove(this.garage.view.group); this.garage.view.dispose(); }
    const fake = { bodyKey: s.body, name: s.playerName, team: 0 };
    const view = new CarView(fake, {
      teamColor: TEAM_COLORS[0].main, accent: new THREE.Color(s.accent).getHex(),
      boostColor: s.boostColor !== 'team' ? new THREE.Color(s.boostColor).getHex() : null, showName: false, lite: !this.quality.bloom,
    });
    this.scene.add(view.group);
    this.garage.view = view;
  }

  exitGarage() {
    if (!this.garage) return;
    if (this.garage.view) { this.scene.remove(this.garage.view.group); this.garage.view.dispose(); }
    this.garage = null;
    this.rigs[0].reset();
  }

  // ---------- Loop ----------
  viewports() {
    if (this.mode === 'match' && this.splitscreen && this.locals.length > 1) {
      return [{ x: 0, y: 0, w: 1, h: 0.5 }, { x: 0, y: 0.5, w: 1, h: 0.5 }];
    }
    return [{ x: 0, y: 0, w: 1, h: 1 }];
  }

  frame(now) {
    requestAnimationFrame((t) => this.frame(t));
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    this.fpsFrames++;
    this.fpsTime += dt;
    if (this.fpsTime > 0.5) {
      this.fps = Math.round(this.fpsFrames / this.fpsTime);
      this.fpsFrames = 0;
      this.fpsTime = 0;
    }
    this.input.poll();
    this.handleUiInput();

    const running = this.match && !this.paused && !this.garage;
    if (running) {
      this.acc += dt;
      let steps = 0;
      while (this.acc >= DT && steps < 12) {
        this.step();
        this.acc -= DT;
        steps++;
      }
      if (steps === 12) this.acc = 0;
    }
    this.processEvents();
    this.render(dt, running);
  }

  handleUiInput() {
    const inp = this.input;
    const split = this.splitscreen;
    if (this.menus.isOpen()) {
      for (let p = 0; p < 2; p++) {
        for (const pad of inp.padFor(p, false)) {
          const pr = inp.padPressed.get(pad.index) || [];
          if (pr[12]) this.menus.navigate(-1);
          if (pr[13]) this.menus.navigate(1);
          if (pr[0]) this.menus.activate();
          if (pr[1]) this.menus.back();
        }
      }
      if (this.mode === 'match' && inp.pressed('pause', 0, false) && this.menus.screen === 'pause') this.resume();
      else if (inp.frameKeys && inp.frameKeys.has('Escape') && this.menus.screen !== 'main' && this.menus.screen !== 'pause' && this.menus.screen !== 'end') this.menus.back();
      return;
    }
    if (this.mode !== 'match') return;
    for (let p = 0; p < this.locals.length; p++) {
      if (inp.pressed('pause', p, split)) { this.pause(); return; }
      if (inp.pressed('ballCam', p, split)) this.rigs[p].ballCam = !this.rigs[p].ballCam;
      if (this.match.state === 'replay' && inp.pressed('jump', p, split)) this.match.requestSkip();
    }
    if (this.match.opts.freeplay && this.locals[0]) {
      if (inp.pressed('resetBall', 0, split)) this.freeplayBall(false);
      if (inp.pressed('shootBall', 0, split)) this.freeplayBall(true);
    } else {
      for (let p = 0; p < this.locals.length; p++) {
        const msg = inp.quickChat(p, split);
        if (msg >= 0) this.say(this.locals[p].car, QUICK_CHAT[msg]);
      }
    }
  }

  say(car, text) {
    if (this.mode !== 'match' || !this.match || !this.match.cars.includes(car)) return;
    const now = performance.now();
    car.chatLog = (car.chatLog || []).filter((t) => now - t < 4000);
    if (car.chatLog.length >= 3) return;
    car.chatLog.push(now);
    this.hud.chat(car, text);
  }

  botChatter(e) {
    if (this.mode !== 'match' || this.match.opts.freeplay) return;
    const bots = this.match.cars.filter((c) => c.isBot);
    const pick = (list) => list[Math.floor(Math.random() * list.length)];
    const later = (car, text) => setTimeout(() => this.say(car, text), 700 + Math.random() * 1500);
    if (e.type === 'goal') {
      const winners = bots.filter((c) => c.team === e.team);
      const losers = bots.filter((c) => c.team !== e.team);
      if (winners.length && Math.random() < 0.5) later(pick(winners), e.scorer && e.scorer.isBot && winners.includes(e.scorer) ? pick(['Calculé.', 'Et c\'est dedans !']) : pick(['Joli tir !', 'Quel but !', 'Merci !']));
      if (losers.length && Math.random() < 0.35) later(pick(losers), pick(['Oups…', 'Ça arrive…', 'Pas mal.']));
    } else if (e.type === 'stat' && e.label.startsWith('ARRÊT') && Math.random() < 0.35) {
      const others = bots.filter((c) => c !== e.car);
      if (others.length) later(pick(others), 'Quel arrêt !');
    } else if (e.type === 'end') {
      bots.forEach((b) => { if (Math.random() < 0.6) later(b, pick(['GG', 'Bien joué !', 'Belle partie !'])); });
    }
  }

  rumble(car, strong, weak, ms) {
    const i = this.locals.findIndex((l) => l.car === car);
    if (i < 0) return;
    for (const pad of this.input.padFor(i, this.splitscreen)) {
      try {
        if (pad.vibrationActuator && pad.vibrationActuator.playEffect) {
          pad.vibrationActuator.playEffect('dual-rumble', { duration: ms, strongMagnitude: strong, weakMagnitude: weak });
        }
      } catch (err) {
        // Rumble is optional.
      }
    }
  }

  freeplayBall(shoot) {
    const m = this.match;
    const car = this.locals[0].car;
    const ball = m.ball;
    car.forward(tmpV);
    tmpV.y = 0;
    tmpV.normalize();
    if (!shoot) {
      const p = car.pos.clone().addScaledVector(tmpV, 7);
      p.x = THREE.MathUtils.clamp(p.x, -ARENA.W + 3, ARENA.W - 3);
      p.z = THREE.MathUtils.clamp(p.z, -ARENA.L + 3, ARENA.L - 3);
      ball.reset(p.x, 1.5, p.z);
    } else {
      const ang = Math.random() * Math.PI * 2;
      const from = new THREE.Vector3(car.pos.x + Math.cos(ang) * 22, 2, car.pos.z + Math.sin(ang) * 22);
      from.x = THREE.MathUtils.clamp(from.x, -ARENA.W + 4, ARENA.W - 4);
      from.z = THREE.MathUtils.clamp(from.z, -ARENA.L + 4, ARENA.L - 4);
      const target = car.pos.clone().addScaledVector(tmpV, 8);
      target.y = 5 + Math.random() * 5;
      const T = 2.2;
      ball.reset(from.x, from.y, from.z);
      ball.vel.copy(target).sub(from).multiplyScalar(1 / T);
      ball.vel.y -= 0.5 * PHYS.gravity * T;
    }
    m.state = 'playing';
    m.refreshPrediction();
  }

  step() {
    const m = this.match;
    for (const lp of this.locals) this.input.controls(lp.index, this.splitscreen, lp.car.controls);
    for (const b of this.bots) b.update(DT, m);
    m.tick(DT);
    if (m.events.length) {
      this.frameEvents.push(...m.events);
      m.events.length = 0;
    }
    if (this.mode === 'menu' && m.state === 'playing' && m.time > 240 && m.kickoff === false && Math.random() < 0.0005) {
      m.resetKickoff();
    }
  }

  processEvents() {
    const m = this.match;
    const live = this.mode === 'match';
    const localCars = new Set(this.locals.map((l) => l.car));
    for (const e of this.frameEvents) {
      if (live) {
        this.hud.onEvent(e, m);
        this.botChatter(e);
      }
      switch (e.type) {
        case 'hit':
          this.effects.sparks(e.pos, e.strength);
          if (live) this.sound.hit(e.pos, e.strength);
          this.rumble(e.car, Math.min(1, e.strength / 20), Math.min(1, e.strength / 12), 90);
          if (localCars.has(e.car)) this.rigs[this.locals.findIndex((l) => l.car === e.car)].addShake(Math.min(0.25, e.strength * 0.01));
          break;
        case 'bounce': if (live) this.sound.bounce(e.pos, e.strength); break;
        case 'jump':
        case 'dodge': if (localCars.has(e.car)) this.sound.jump(e.car.pos); break;
        case 'pad':
          this.effects.padPickup(e.pos, e.big);
          if (localCars.has(e.car)) this.sound.pad(e.pos, e.big);
          break;
        case 'bump':
          if (live) this.sound.bump(e.pos, e.strength);
          this.rumble(e.victim, 0.7, 0.5, 150);
          this.rumble(e.attacker, 0.4, 0.4, 100);
          break;
        case 'demo':
          this.effects.demolition(e.pos, TEAM_COLORS[e.victim.team].main);
          if (live) this.sound.explosion(e.pos, false);
          this.locals.forEach((l, i) => { if (l.car === e.victim || l.car === e.attacker) this.rigs[i].addShake(0.4); });
          this.rumble(e.victim, 1, 1, 400);
          this.rumble(e.attacker, 0.6, 0.8, 200);
          break;
        case 'goal':
          this.effects.explosion(e.pos, TEAM_COLORS[e.team].main, true);
          if (live) this.sound.explosion(e.pos, true);
          if (live) this.sound.horn(this.localTeams().has(e.team));
          this.rigs.forEach((r) => r.addShake(0.7));
          this.locals.forEach((l) => this.rumble(l.car, 0.8, 0.8, 600));
          break;
        case 'replayGoal':
          this.effects.explosion(e.pos, TEAM_COLORS[e.team].main, true);
          if (live) this.sound.explosion(e.pos, true);
          break;
        case 'kickoff':
        case 'replayStart':
          this.effects.clear();
          this.rigs.forEach((r) => r.reset());
          break;
        case 'countdown': if (live) this.sound.beep(false); break;
        case 'go': if (live) this.sound.beep(true); break;
        case 'overtime': if (live) this.sound.beep(true); break;
        case 'end':
          if (live) { this.endTimer = 2.5; this.sound.cheer(4); }
          break;
        default: break;
      }
    }
    this.frameEvents.length = 0;
  }

  // Interpolated or replayed visual state of every car and the ball.
  visualStates(alpha) {
    const m = this.match;
    const states = [];
    if (m.state === 'replay' && m.replay) {
      const snap = m.replaySnapshot(m.replay.time);
      const { a, b, k } = snap;
      const dtab = Math.max(1e-3, b.t - a.t);
      m.cars.forEach((car, i) => {
        const ca = a.cars[i];
        const cb = b.cars[i];
        const pos = new THREE.Vector3(ca[0] + (cb[0] - ca[0]) * k, ca[1] + (cb[1] - ca[1]) * k, ca[2] + (cb[2] - ca[2]) * k);
        const qa = new THREE.Quaternion(ca[3], ca[4], ca[5], ca[6]);
        const qb = new THREE.Quaternion(cb[3], cb[4], cb[5], cb[6]);
        const vel = new THREE.Vector3(cb[0] - ca[0], cb[1] - ca[1], cb[2] - ca[2]).multiplyScalar(1 / dtab);
        if (vel.lengthSq() > 3000) vel.set(0, 0, 0);
        states.push({
          pos, quat: qa.slerp(qb, k), boosting: !!ca[7], demolished: !!ca[8], steer: ca[9], spin: ca[10] + (cb[10] - ca[10]) * k,
          supersonic: !!ca[11], vel, onGround: true, groundNormal: new THREE.Vector3(0, 1, 0),
        });
      });
      const ba = a.ball;
      const bb = b.ball;
      return {
        cars: states,
        ball: {
          pos: new THREE.Vector3(ba[0] + (bb[0] - ba[0]) * k, ba[1] + (bb[1] - ba[1]) * k, ba[2] + (bb[2] - ba[2]) * k),
          quat: new THREE.Quaternion(ba[3], ba[4], ba[5], ba[6]).slerp(new THREE.Quaternion(bb[3], bb[4], bb[5], bb[6]), k),
          hidden: !!ba[7],
        },
      };
    }
    for (const car of m.cars) {
      states.push({
        pos: new THREE.Vector3().lerpVectors(car.prevPos, car.pos, alpha),
        quat: new THREE.Quaternion().slerpQuaternions(car.prevQuat, car.quat, alpha),
        boosting: car.boosting, demolished: car.demolished, steer: car.steerVis, spin: car.wheelSpin, supersonic: car.supersonic,
        vel: car.vel, onGround: car.onGround, groundNormal: car.groundNormal,
        braking: car.onGround && (car.controls.handbrake || car.controls.throttle * car.vel.dot(car.forward(tmpV)) < -0.5),
      });
    }
    const b = m.ball;
    return {
      cars: states,
      ball: {
        pos: new THREE.Vector3().lerpVectors(b.prevPos, b.pos, alpha),
        quat: new THREE.Quaternion().slerpQuaternions(b.prevQuat, b.quat, alpha),
        hidden: b.hidden,
      },
    };
  }

  render(dt, running) {
    const m = this.match;
    const time = performance.now() / 1000;
    const alpha = running ? this.acc / DT : 1;
    const vis = this.visualStates(alpha);

    // Cars & particles.
    vis.cars.forEach((st, i) => {
      const view = this.carViews[i];
      if (!view) return;
      view.update(st, time);
      if (this.garage) view.group.visible = false;
      if (st.demolished || this.garage || !running) return;
      if (st.boosting) {
        tmpV2.set(1, 0, 0).applyQuaternion(st.quat);
        for (let k = 0; k < 2; k++) {
          view.exhaustWorld(k, tmpV);
          this.effects.boost(tmpV, tmpV2, st.vel, view.boostColor, st.supersonic);
        }
      }
      if (st.supersonic) {
        for (const s of [1, -1]) {
          tmpV.set(view.backX, view.wheelBaseY + 0.05, s * view.halfWidth).applyQuaternion(st.quat).add(st.pos);
          this.effects.trail(tmpV, new THREE.Color(0.8, 0.9, 1.2));
        }
      }
    });

    // Ball.
    const bs = vis.ball;
    this.ballMesh.visible = !bs.hidden && !this.garage;
    this.ballMesh.position.copy(bs.pos);
    this.ballMesh.quaternion.copy(bs.quat);
    // Fast balls leave a short streak.
    const ballSpeed = m.state === 'replay' ? 0 : m.ball.vel.length();
    if (running && this.ballMesh.visible && ballSpeed > 19 && !this.garage) {
      const k = Math.min(1, (ballSpeed - 19) / 15);
      this.effects.trail(bs.pos, BALL_TRAIL.clone().multiplyScalar(0.35 + k * 0.5), 1.1);
    }
    const h = bs.pos.y - PHYS.ballRadius;
    this.ballShadow.visible = this.ballMesh.visible && Math.abs(bs.pos.x) < ARENA.W - 2 && Math.abs(bs.pos.z) < ARENA.L + ARENA.GD;
    this.ballShadow.position.set(bs.pos.x, 0.03, bs.pos.z);
    const sh = 1 + h * 0.05;
    this.ballShadow.scale.set(sh, sh, sh);
    this.ballShadow.material.opacity = Math.max(0.15, 0.85 - h * 0.035);

    if (this.world) this.world.updatePads(dt, m.pads);
    this.effects.update(running ? dt : 0);

    // Cameras.
    const vps = this.viewports();
    const W = window.innerWidth;
    const H = window.innerHeight;
    vps.forEach((vp, i) => {
      const cam = this.cameras[i];
      const aspect = (vp.w * W) / (vp.h * H);
      cam.aspect = aspect;
      cam.fov = horizontalToVerticalFov(this.mode === 'match' ? this.settings.fov : 90, aspect);
      cam.updateProjectionMatrix();
    });
    this.updateCameras(dt, vis);

    // Audio.
    const cam0 = this.cameras[0];
    this.sound.setListener(cam0.position, tmpV.set(1, 0, 0).applyQuaternion(cam0.quaternion));
    if (this.mode === 'match' && !this.paused && m.state !== 'replay') {
      this.locals.forEach((l, i) => {
        const c = l.car;
        this.sound.updateEngine(i, c.vel.length(), c.controls.throttle, c.boosting, c.onGround, !c.demolished, this.locals.length);
      });
      const bz = Math.abs(m.ball.pos.z);
      this.sound.setCrowd(0.35 + Math.max(0, 1 - (ARENA.L - bz) / 30) * 0.6);
    } else {
      this.sound.silenceEngines();
      this.sound.setCrowd(this.mode === 'menu' ? 0.15 : 0.3);
    }

    // Draw.
    const r = this.renderer;
    const pr = r.getPixelRatio();
    if (vps.length === 1 && this.composer) {
      this.effects.setViewportHeight(H * pr / (2 * Math.tan(THREE.MathUtils.degToRad(this.cameras[0].fov) / 2)));
      this.renderPass.camera = this.cameras[0];
      this.composer.render(dt);
    } else {
      r.setScissorTest(true);
      vps.forEach((vp, i) => {
        const x = vp.x * W;
        const y = (1 - vp.y - vp.h) * H;
        r.setViewport(x, y, vp.w * W, vp.h * H);
        r.setScissor(x, y, vp.w * W, vp.h * H);
        this.effects.setViewportHeight(vp.h * H * pr / (2 * Math.tan(THREE.MathUtils.degToRad(this.cameras[i].fov) / 2)));
        r.render(this.scene, this.cameras[i]);
      });
      r.setScissorTest(false);
      r.setViewport(0, 0, W, H);
    }

    // HUD.
    if (this.mode === 'match' && m) {
      const scoreboard = this.locals.some((l, i) => this.input.held('scoreboard', i, this.splitscreen));
      if (this.touch) {
        this.touch.show(!this.paused && !this.menus.isOpen() && m.state !== 'ended', m.opts.freeplay);
        this.touch.setBallCam(this.rigs[0].ballCam);
      }
      this.hud.update(dt, m, this.locals, {
        ballCam: this.rigs.map((rg) => rg.ballCam), showFps: this.settings.showFps, fps: this.fps, scoreboard: scoreboard && !this.paused,
      });
      if (this.endTimer > 0) {
        this.endTimer -= dt;
        if (this.endTimer <= 0) {
          this.menus.stack = [];
          this.menus.show('end', false);
          document.body.style.cursor = '';
        }
      }
    }
  }

  // Two shots: chase cam behind the scorer, then a goal-side cam for the finish.
  replayCamera(dt, vis) {
    const m = this.match;
    const ball = vis.ball.pos;
    const info = m.goalInfo;
    const team = info ? info.team : 0;
    const goalZ = team === 0 ? ARENA.L : -ARENA.L;
    const into = Math.sign(goalZ);
    const finish = m.replay.time > m.replay.goalTime - 1.3;
    const pos = new THREE.Vector3();
    const look = new THREE.Vector3().copy(ball);
    const scorerIdx = info && info.scorer ? m.cars.indexOf(info.scorer) : -1;
    const st = scorerIdx >= 0 ? vis.cars[scorerIdx] : null;
    let stiff = 6;
    if (finish) {
      const side = ball.x >= 0 ? 1 : -1;
      pos.set(side * (ARENA.GW + 3.5), 4.2, goalZ - into * 12);
      stiff = this.replayShot === 'finish' ? 3 : 1000;
      this.replayShot = 'finish';
    } else if (st && !st.demolished) {
      const d = tmpV.copy(st.pos).sub(ball);
      d.y = 0;
      if (d.lengthSq() < 0.5) d.set(0, 0, -into);
      d.normalize();
      pos.copy(st.pos).addScaledVector(d, 4.5);
      pos.y += 1.8;
      look.lerp(st.pos, 0.25);
      this.replayShot = 'chase';
    } else {
      const d = tmpV.set(ball.x * 0.3, 0, ball.z - goalZ);
      if (d.lengthSq() < 1) d.set(0, 0, -into);
      d.normalize();
      pos.copy(ball).addScaledVector(d, 11);
      pos.y = Math.max(ball.y + 3.5, 4);
      this.replayShot = 'ball';
    }
    keepInsideArena(pos, 1);
    this.rigs.forEach((r, i) => {
      if (i >= this.viewports().length) return;
      if (stiff > 100) r.reset();
      r.setView(dt, pos, look, Math.min(stiff, 8));
    });
  }

  updateCameras(dt, vis) {
    const m = this.match;
    const s = this.settings;
    const camSettings = { camDistance: s.camDistance, camHeight: s.camHeight, camStiffness: s.camStiffness };
    if (this.garage) {
      this.garage.t += dt;
      const g = this.garage;
      g.view.update({
        pos: new THREE.Vector3(0, BODIES[s.body].hy + PHYS.rideHeight, 0),
        quat: new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), g.t * 0.5),
        boosting: Math.sin(g.t * 0.8) > 0.6, demolished: false, steer: Math.sin(g.t * 0.7) * 0.6, spin: g.t * 3, supersonic: false,
      }, performance.now() / 1000);
      const a = 0.75 + Math.sin(g.t * 0.2) * 0.25;
      const d = 2.9;
      tmpV.set(Math.cos(a) * d, 1.0, Math.sin(a) * d);
      // Aim left of the car so it sits on the right, next to the menu.
      tmpV2.set(-Math.sin(a), 0, Math.cos(a)).multiplyScalar(1.05);
      tmpV2.y = 0.3;
      this.rigs[0].setView(dt, tmpV, tmpV2, 3);
      return;
    }
    if (m.state === 'replay') {
      this.replayCamera(dt, vis);
      return;
    }
    if (this.mode === 'menu') {
      this.attractTime += dt;
      const phase = Math.floor(this.attractTime / 11) % 3;
      if (phase === 1 && vis.cars[0]) {
        const st = vis.cars[(Math.floor(this.attractTime / 33) % vis.cars.length)];
        if (!st.demolished) {
          this.rigs[0].ballCam = true;
          this.rigs[0].follow(dt, st, vis.ball.pos, { camDistance: 3.2, camHeight: 1.3, camStiffness: 6 });
          return;
        }
      }
      const a = this.attractTime * 0.06;
      const ball = vis.ball.pos;
      const pos = tmpV.set(Math.sin(a) * 34, 13 + Math.sin(a * 0.7) * 4, Math.cos(a) * 44);
      keepInsideArena(pos, 1);
      this.rigs[0].setView(dt, pos, tmpV2.copy(ball).multiplyScalar(0.7), 2);
      return;
    }
    this.locals.forEach((l, i) => {
      const st = vis.cars[this.match.cars.indexOf(l.car)];
      if (!st) return;
      const [sx] = this.input.lookStick(i, this.splitscreen);
      this.rigs[i].swivel += (sx * Math.PI - this.rigs[i].swivel) * Math.min(1, dt * 10);
      if (st.demolished) {
        this.rigs[i].setView(dt, this.rigs[i].pos, vis.ball.pos, 2);
        return;
      }
      this.rigs[i].follow(dt, st, vis.ball.hidden ? null : vis.ball.pos, camSettings);
    });
  }
}

function boot() {
  try {
    const test = document.createElement('canvas');
    if (!(test.getContext('webgl2') || test.getContext('webgl'))) throw new Error('WebGL indisponible');
  } catch (e) {
    const d = document.createElement('div');
    d.id = 'webgl-error';
    d.innerHTML = '<div><h2>WebGL est désactivé</h2><p>Active l\'accélération matérielle de ton navigateur (Chrome, Edge ou Firefox) puis recharge la page.</p></div>';
    document.body.appendChild(d);
    return;
  }
  window.app = new App();
  // Hooks used by the Android app (back button, app sent to background).
  window.androidBack = () => {
    const a = window.app;
    if (a.menus.isOpen()) {
      if (a.menus.screen === 'main') return 'exit';
      if (a.menus.screen === 'pause') a.resume();
      else if (a.menus.screen === 'end') a.quitToMenu();
      else a.menus.back();
      return 'ok';
    }
    if (a.mode === 'match') {
      a.pause();
      return 'ok';
    }
    return 'exit';
  };
  window.androidPause = () => {
    const a = window.app;
    if (a.mode === 'match' && !a.paused && a.match && a.match.state !== 'ended') a.pause();
    if (a.sound.ctx) a.sound.ctx.suspend();
  };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
else boot();

