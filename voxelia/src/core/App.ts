/**
 * App — point central de l'application : services partagés (rendu, audio, entrées,
 * sauvegardes, packs), panorama 3D du menu, navigation entre écrans, lancement des parties
 * (locales ou multijoueur) et intégration Android (pause, retour, vibrations).
 */
import * as THREE from 'three';
import { SettingsManager } from './Settings';
import { SaveManager, newWorldMeta, defaultRules, type WorldMeta, type GameMode, type Difficulty } from '../save/SaveManager';
import { Renderer } from '../render/Renderer';
import { ItemIcons } from '../render/ItemIcons';
import { ItemMeshFactory } from '../render/ItemMesh';
import { ModelPreview } from '../render/ModelPreview';
import { ModelFactory } from '../entities/BoxModel';
import { MODELS } from '../entities/models';
import { AudioManager } from '../audio/AudioManager';
import { InputManager } from '../input/InputManager';
import { TouchControls } from '../input/TouchControls';
import { UIManager } from '../ui/UIManager';
import { setClickSound, modal, toast, h } from '../ui/dom';
import { WorkerPool } from '../world/WorkerPool';
import { ChunkManager } from '../world/ChunkManager';
import { World } from '../world/World';
import { OverworldShaper, type WorldTemplate } from '../world/gen/terrain';
import { biomeById } from '../world/biomes';
import { SEA_LEVEL } from '../world/constants';
import { ResourcePackManager } from '../packs/ResourcePacks';
import { Game, type GameApp, type GameScreens } from '../game/Game';
import { NetClient } from '../net/NetClient';
import { InventoryScreen } from '../ui/screens/InventoryScreen';
import { TitleScreen } from '../ui/screens/TitleScreen';
import { PlayScreen } from '../ui/screens/PlayScreen';
import { WorldSettingsScreen } from '../ui/screens/WorldSettingsScreen';
import { SettingsScreen } from '../ui/screens/SettingsScreen';
import { LoadingScreen, PauseScreen, ChatScreen, DeathScreen } from '../ui/screens/InGameScreens';
import { openSocialPanel, ProfileScreen, DressingRoomScreen, CreditsScreen } from '../ui/screens/SocialScreens';
import type { AppContext, PlayTab, SettingsSection } from './AppContext';
import type { Villager } from '../entities/Villager';

export const VERSION = '0.1.0';
const MENU_SEED = 20240611;

interface AndroidBridge {
  vibrate?(ms: number): void;
  exitApp?(): void;
  isAndroid?(): boolean;
}

/** Panorama du menu : un petit monde généré, vu par une caméra qui tourne lentement. */
class MenuPanorama {
  readonly chunks: ChunkManager;
  readonly world: World;
  private angle = 0;
  private center = new THREE.Vector3(0, 90, 0);
  private skyColor = new THREE.Color(0x78a7ff);
  private fogColor = new THREE.Color(0xc0d8ff);

  constructor(private app: App) {
    const r = app.renderer;
    app.pool.broadcast({ type: 'init', opts: { seed: MENU_SEED, template: 'default', caves: true, structures: true, fantasyBiomes: true, drop3: false, dimensions: true }, textures: r.atlas.info });
    this.chunks = new ChunkManager(app.pool, r.materials, { load: async () => null });
    this.chunks.renderDistance = Math.min(app.settings.data.renderDistance, app.touchMode ? 4 : 6);
    this.chunks.fancyLeaves = app.settings.data.fancyLeaves;
    this.world = new World(this.chunks);
    r.terrain.add(this.chunks.root);
    // Lieu de vue : terre ferme près de l'origine, au-dessus d'une forêt ou d'une rivière.
    const shaper = new OverworldShaper({ seed: MENU_SEED, template: 'default' as WorldTemplate, caves: true, structures: true, fantasyBiomes: true, drop3: false, dimensions: true });
    for (let r2 = 0; r2 < 1500; r2 += 32) {
      const s = shaper.sample(r2, r2 >> 1);
      const b = biomeById(s.biome);
      if (!b.isOcean && s.height > SEA_LEVEL + 2 && s.height < 110) {
        this.center.set(r2 + 0.5, s.height + 9, (r2 >> 1) + 0.5);
        this.skyColor.setHex(b.sky);
        this.fogColor.setHex(b.fog);
        break;
      }
    }
  }

  frame(dt: number): void {
    const r = this.app.renderer;
    this.angle += dt * 0.025;
    const cam = r.camera;
    cam.position.copy(this.center);
    cam.rotation.set(-0.12 + Math.sin(this.angle * 0.7) * 0.05, this.angle, 0, 'YXZ');
    cam.updateMatrixWorld();
    this.chunks.update(this.center.x, this.center.z, cam.position);
    r.fovBoost = 0;
    r.update(dt, { time: 3500, day: 0, rain: 0, thunder: 0, dimension: 0, biomeSky: this.skyColor, biomeFog: this.fogColor, underwater: false });
    r.render();
  }

  dispose(): void {
    this.app.renderer.terrain.remove(this.chunks.root);
    this.chunks.dispose();
  }
}

export class App implements AppContext, GameApp {
  readonly version = VERSION;
  readonly settings = new SettingsManager();
  readonly saves = new SaveManager();
  readonly canvas: HTMLCanvasElement;
  readonly renderer: Renderer;
  readonly audio: AudioManager;
  readonly input: InputManager;
  readonly touch: TouchControls;
  readonly ui: UIManager;
  readonly icons: ItemIcons;
  readonly itemMeshes: ItemMeshFactory;
  readonly models = new ModelFactory(MODELS);
  readonly preview: ModelPreview;
  readonly pool: WorkerPool;
  readonly packs: ResourcePackManager;
  readonly screens: GameScreens;
  touchMode: boolean;
  game: Game | null = null;
  private menu: MenuPanorama | null = null;
  private loading: LoadingScreen | null = null;
  private last = performance.now();
  private busy = false;
  private fpsEl: HTMLElement;
  private fpsAcc = { n: 0, t: 0 };
  private bridge: AndroidBridge | undefined;

  constructor() {
    this.canvas = document.getElementById('game') as HTMLCanvasElement;
    this.bridge = (window as unknown as { AndroidBridge?: AndroidBridge }).AndroidBridge;
    this.renderer = new Renderer(this.canvas);
    this.touchMode = this.settings.mobile || (matchMedia?.('(pointer: coarse)').matches ?? false);
    this.audio = new AudioManager(this.settings);
    this.input = new InputManager(this.canvas, this.settings);
    this.touch = new TouchControls(this.input, this.settings);
    this.touch.el.style.zIndex = '5';
    this.touch.el.style.display = 'none';
    document.body.insertBefore(this.touch.el, document.getElementById('ui'));
    this.ui = new UIManager(() => this.settings.data.guiScale);
    this.icons = new ItemIcons(this.renderer.atlas);
    this.itemMeshes = new ItemMeshFactory(this.renderer.atlas);
    this.preview = new ModelPreview(this.models);
    this.pool = new WorkerPool('world.worker.js');
    this.packs = new ResourcePackManager(this.saves, this.renderer.atlas, () => this.onPacksApplied());
    this.fpsEl = h('div', { class: 'debug hidden', style: 'z-index:20;left:auto;right:calc(var(--u)*2);top:auto;bottom:calc(var(--u)*2);pointer-events:none' });
    document.body.appendChild(this.fpsEl);
    setClickSound(() => this.audio.play('click', { volume: 0.5 }));
    this.screens = this.makeScreens();
    this.input.menuNav = (dir) => this.ui.navigate(dir);
    this.input.onPointerLockChange = (locked) => {
      // Échap libère le pointeur sans événement clavier : on met en pause.
      if (!locked && this.game?.ready && !this.game.uiOpen && !this.game.player.dead && !this.touchMode) this.game.pause();
    };
    this.ui.onStackChange = () => this.onStackChange();
    this.applySettings();
    this.settings.onChange(() => this.applySettings());
    window.addEventListener('resize', () => this.renderer.resize());
    this.installPlatformHooks();
  }

  /** Démarrage : base de données, packs actifs, écran titre. */
  async start(): Promise<void> {
    try {
      await (document as unknown as { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
    } catch {
      /* polices facultatives */
    }
    try {
      await this.saves.init();
    } catch (e) {
      console.error(e);
      modal('Stockage indisponible', h('div', null, 'Impossible d’ouvrir le stockage local (IndexedDB). Les mondes ne pourront pas être sauvegardés.'), [['OK', () => undefined]]);
    }
    try {
      await this.packs.apply([]);
    } catch (e) {
      console.warn('Packs de ressources non appliqués', e);
    }
    this.showTitle();
    requestAnimationFrame((t) => this.loop(t));
  }

  // ------------------------------------------------------------------ boucle principale
  private loop(now: number): void {
    const dt = Math.min(0.1, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    try {
      if (this.game) {
        this.game.frame(dt);
        if (!this.game.ready) this.input.poll(dt);
      } else {
        this.input.active = false;
        this.input.poll(dt);
        this.input.state.clearFrame();
        this.menu?.frame(dt);
        this.audio.setMood('menu');
        this.audio.updateMusic(dt);
      }
      this.ui.update(dt);
    } catch (e) {
      console.error(e);
    }
    this.updateTouchLayer();
    if (this.settings.data.showFps) {
      this.fpsAcc.n++;
      this.fpsAcc.t += dt;
      if (this.fpsAcc.t >= 0.5) {
        this.fpsEl.textContent = `${Math.round(this.fpsAcc.n / this.fpsAcc.t)} i/s`;
        this.fpsAcc.n = 0;
        this.fpsAcc.t = 0;
      }
    }
    this.fpsEl.classList.toggle('hidden', !this.settings.data.showFps);
    requestAnimationFrame((t) => this.loop(t));
  }

  /** Commandes tactiles visibles seulement en jeu, sans menu ouvert. */
  private updateTouchLayer(): void {
    if (this.touch.editing) return;
    if (this.input.lastDevice === 'touch' && !this.touchMode) {
      this.touchMode = true;
      this.game?.hud.setTouch(true);
    }
    const show = !!this.game?.ready && this.touchMode && !this.game.uiOpen && !this.game.player.dead;
    const v = show ? '' : 'none';
    if (this.touch.el.style.display !== v) {
      this.touch.el.style.display = v;
      if (!show) this.touch.reset();
    }
  }

  private onStackChange(): void {
    const g = this.game;
    if (g?.ready && g.uiOpen) {
      this.input.exitPointerLock();
      this.touch.reset();
    }
    this.canvas.classList.toggle('menu-bg', !g && this.ui.depth > 0 && !(this.ui.current instanceof LoadingScreen));
  }

  // ------------------------------------------------------------------ réglages et packs
  applySettings(): void {
    const s = this.settings.data;
    const r = this.renderer;
    const fancyChanged = r.options.fancyLeaves !== s.fancyLeaves;
    r.applyOptions({ renderDistance: s.renderDistance, fov: s.fov, resolutionScale: s.resolutionScale, clouds: s.clouds, fancyLeaves: s.fancyLeaves, wavingPlants: s.wavingPlants, brightness: s.brightness, fog: s.fog });
    this.ui.rescale();
    this.touch.layout();
    this.audio.applyVolumes();
    if (this.menu) this.menu.chunks.fancyLeaves = s.fancyLeaves;
    if (fancyChanged) {
      this.game?.chunks.remeshAll();
      this.menu?.chunks.remeshAll();
    }
    this.entitiesSkin();
  }

  private entitiesSkin(): void {
    const g = this.game;
    if (!g) return;
    const key = 'player_' + this.settings.data.skin;
    if (g.entities.playerSkin === key) return;
    g.entities.playerSkin = key;
    (g.player as unknown as { skinKey: string }).skinKey = key;
    g.entities.dropView(g.player);
    g.hand.setSkin(key);
  }

  get iconsVersion(): number {
    return this.icons.version;
  }

  private onPacksApplied(): void {
    this.game?.chunks.remeshAll();
    this.menu?.chunks.remeshAll();
    this.pool.broadcast({ type: 'textures', textures: this.renderer.atlas.info });
  }

  // ------------------------------------------------------------------ écrans de jeu
  private makeScreens(): GameScreens {
    return {
      inventory: (g) => this.ui.push(new InventoryScreen(g, g.player.creative ? 'creative' : 'survival', this.preview)),
      crafting: (g) => this.ui.push(new InventoryScreen(g, 'crafting', this.preview)),
      furnace: (g, x, y, z) => this.ui.push(new InventoryScreen(g, 'furnace', this.preview, { x, y, z })),
      chest: (g, x, y, z) => this.ui.push(new InventoryScreen(g, 'chest', this.preview, { x, y, z })),
      trade: (g, v: Villager) => this.ui.push(new InventoryScreen(g, 'trade', this.preview, { villager: v })),
      pause: (g) => this.ui.push(new PauseScreen(this, g)),
      chat: (g, initial) => this.ui.push(new ChatScreen(this, g, initial)),
      death: (g, message) => this.ui.push(new DeathScreen(this, g, message)),
      loading: (text, progress, tip) => this.showLoading(text, progress, tip ?? false),
      closeLoading: () => this.closeLoading(),
    };
  }

  private showLoading(text: string, progress: number, tip: boolean): void {
    if (!this.loading) {
      this.loading = new LoadingScreen();
      this.ui.push(this.loading);
    }
    this.loading.set(text, progress, tip);
  }

  private closeLoading(): void {
    if (!this.loading) return;
    const l = this.loading;
    this.loading = null;
    if (this.ui.current === l) this.ui.pop();
  }

  vibrate(ms: number): void {
    if (!this.settings.data.vibration) return;
    try {
      if (this.bridge?.vibrate) this.bridge.vibrate(ms);
      else navigator.vibrate?.(ms);
    } catch {
      /* vibration indisponible */
    }
  }

  // ------------------------------------------------------------------ parties
  async startWorld(meta: WorldMeta): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      if (this.game) await this.leaveGame();
      this.ui.clear();
      this.showLoading('Chargement', 0, true);
      this.menu?.dispose();
      this.menu = null;
      await this.packs.apply(meta.packs ?? []).catch((e) => console.warn(e));
      meta.lastPlayed = Date.now();
      await this.saves.updateMeta(meta).catch(() => undefined);
      const g = new Game(this, meta, null);
      this.game = g;
      this.mountHud(g);
      await g.load();
      this.closeLoading();
      this.ui.clear();
      this.onStackChange();
      if (!this.touchMode) this.input.requestPointerLock();
    } catch (e) {
      console.error(e);
      await this.failToMenu('Impossible de charger le monde', e);
    } finally {
      this.busy = false;
    }
  }

  async joinServer(address: string, invite?: string): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      if (this.game) await this.leaveGame();
      this.ui.clear();
      this.showLoading(`Connexion à ${address}…`, 0, false);
      const net = await NetClient.connect(address, this.settings.data.profileName, this.settings.data.skin, invite);
      const w = net.world;
      const meta = newWorldMeta({ name: w.name, seed: w.seed, seedText: w.seedText || String(w.seed) });
      meta.id = 'net:' + net.address;
      meta.template = (w.template as WorldTemplate) || 'default';
      meta.gameMode = (w.gameMode as GameMode) || 'survival';
      meta.difficulty = (w.difficulty as Difficulty) || 'normal';
      meta.cheats = w.cheats;
      meta.rules = { ...defaultRules(), ...(w.rules as object) };
      meta.experiments = { ...meta.experiments, ...(w.experiments as object) };
      meta.time = w.time;
      meta.day = w.day;
      meta.spawn = w.spawn;
      this.menu?.dispose();
      this.menu = null;
      const g = new Game(this, meta, net);
      this.game = g;
      net.onDisconnect = (reason) => {
        void this.failToMenu('Déconnecté', new Error(reason));
      };
      this.mountHud(g);
      await g.load();
      this.closeLoading();
      this.ui.clear();
      if (!this.touchMode) this.input.requestPointerLock();
      // Les écrans décident d'enregistrer le serveur ; on retient seulement le dernier utilisé.
      this.settings.set('lastServer', address);
    } catch (e) {
      console.error(e);
      await this.failToMenu('Connexion impossible', e);
    } finally {
      this.busy = false;
    }
  }

  private mountHud(g: Game): void {
    const root = document.getElementById('ui')!;
    root.insertBefore(g.hud.el, root.firstChild);
    this.canvas.classList.remove('menu-bg');
  }

  private async leaveGame(): Promise<void> {
    const g = this.game;
    if (!g) return;
    this.game = null;
    try {
      await g.quit();
    } catch (e) {
      console.error('Sauvegarde à la sortie impossible', e);
      g.dispose();
    }
    this.input.exitPointerLock();
    this.touch.reset();
  }

  async quitToMenu(): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    try {
      this.showLoading('Enregistrement du monde…', 1, false);
      await this.leaveGame();
      await this.packs.apply([]).catch(() => undefined);
    } finally {
      this.busy = false;
      this.loading = null;
      this.showTitle();
    }
  }

  private async failToMenu(title: string, e: unknown): Promise<void> {
    const msg = e instanceof Error ? e.message : String(e);
    const g = this.game;
    this.game = null;
    if (g) {
      try {
        await g.quit();
      } catch {
        g.dispose();
      }
    }
    this.loading = null;
    this.showTitle();
    modal(title, h('div', null, msg), [['OK', () => undefined]]);
  }

  // ------------------------------------------------------------------ navigation
  showTitle(): void {
    this.ui.clear();
    this.loading = null;
    if (!this.game && !this.menu) this.menu = new MenuPanorama(this);
    this.ui.push(new TitleScreen(this));
    this.onStackChange();
  }

  openPlay(tab: PlayTab = 'worlds'): void {
    this.ui.push(new PlayScreen(this, tab));
  }

  openCreateWorld(): void {
    this.ui.push(new WorldSettingsScreen(this, null));
  }

  openEditWorld(meta: WorldMeta): void {
    this.ui.push(new WorldSettingsScreen(this, meta));
  }

  openSettings(section?: SettingsSection): void {
    this.ui.push(new SettingsScreen(this, section));
  }

  openSocial(): void {
    openSocialPanel(this);
  }

  openProfile(): void {
    this.ui.push(new ProfileScreen(this));
  }

  openDressingRoom(): void {
    this.ui.push(new DressingRoomScreen(this));
  }

  openCredits(): void {
    this.ui.push(new CreditsScreen(this));
  }

  exitApp(): void {
    if (this.bridge?.exitApp) this.bridge.exitApp();
    else toast('Fermez l’onglet pour quitter Voxelia.');
  }

  // ------------------------------------------------------------------ plateforme
  private installPlatformHooks(): void {
    const w = window as unknown as Record<string, unknown>;
    const saveNow = () => {
      if (this.game?.ready) void this.game.save(false);
    };
    w.__voxeliaOnPause = () => {
      saveNow();
      this.audio.ctx?.suspend().catch(() => undefined);
      if (this.game?.ready && !this.game.uiOpen && !this.game.net) this.game.pause();
    };
    w.__voxeliaOnResume = () => {
      this.audio.ctx?.resume().catch(() => undefined);
    };
    w.__voxeliaBack = () => {
      if (this.touch.editing) return true;
      if (document.querySelector('.modal-back')) {
        this.ui.back();
        return true;
      }
      if (this.game?.ready) {
        if (this.game.uiOpen) this.ui.back();
        else this.game.pause();
        return true;
      }
      return this.ui.back();
    };
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') saveNow();
    });
    window.addEventListener('beforeunload', () => saveNow());
    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      saveNow();
      modal('Rendu interrompu', h('div', null, 'Le contexte graphique a été perdu (mémoire insuffisante ?). Le jeu va redémarrer.'), [['Redémarrer', () => location.reload()]]);
    });
  }
}
