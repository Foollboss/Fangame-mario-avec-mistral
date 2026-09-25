/**
 * Application : démarrage, panorama animé du menu, cycle de vie des parties,
 * paramètres, mods, boucle principale.
 */
import * as THREE from 'three';
import '@fontsource/pixelify-sans/400.css';
import '../ui/style.css';
import { Content, BASE_PACK, mergePacks } from '../registry/content';
import { applyBiomeOverrides } from '../worldgen/biomes';
import { buildAtlas, type BlockAtlas } from '../render/atlas';
import { IconFactory } from '../render/icons';
import { InputManager } from '../input/input';
import { UIManager } from '../ui/ui';
import { loadSettings, saveSettings, type Settings } from './settings';
import { AudioEngine } from '../audio/audio';
import { IdbStorage } from '../save/idbStorage';
import type { WorldMeta, WorldStorage } from '../save/storage';
import { Game, createWorkerPool } from '../game/game';
import type { WorkerPool } from '../engine/workerPool';
import { mainMenu, loadingScreen } from '../ui/screens/menus';
import { installButtonTexture, setClickSound, h } from '../ui/dom';
import { loadMods, importModText, removeImportedMod, type ModInfo } from './mods';
import type { AppApi } from './api';
import type { ContentPack } from '../registry/types';
import { World } from '../world/world';
import { ChunkStreamer } from '../world/chunkStreamer';
import { ChunkRenderer } from '../render/chunkRenderer';
import { SkyRenderer } from '../render/sky';
import { createGenerator } from '../worldgen/generator';
import { BIOMES } from '../worldgen/biomes';
import { connectToServer } from '../net/connect';

export const VERSION = '1.0.0';
const PANORAMA_SEED = 20250917;

/** Monde de fond du menu principal (caméra en rotation lente). */
class Panorama {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.05, 1000);
  private world: World;
  private streamer: ChunkStreamer;
  private chunks: ChunkRenderer;
  private sky: SkyRenderer;
  private angle = 0.6;
  private center: { x: number; y: number; z: number };
  private fog = new THREE.Color();
  private skyCol = new THREE.Color();

  constructor(content: Content, atlas: BlockAtlas, pool: WorkerPool) {
    this.world = new World(content, 'surface', PANORAMA_SEED);
    this.chunks = new ChunkRenderer(atlas);
    this.scene.add(this.chunks.group);
    this.streamer = new ChunkStreamer(this.world, pool, this.chunks, null, null);
    this.streamer.radius = 6;
    this.sky = new SkyRenderer(PANORAMA_SEED);
    this.sky.attach(this.scene);
    const sp = createGenerator('surface', PANORAMA_SEED, content).findSpawn();
    this.center = { x: sp.x, y: sp.y + 6, z: sp.z };
    this.camera.rotation.order = 'YXZ';
  }

  frame(renderer: THREE.WebGLRenderer, dt: number): void {
    this.angle += dt * 0.025;
    const c = this.center;
    const ground = this.world.heightAt(Math.floor(c.x), Math.floor(c.z));
    if (ground > 0) c.y += (ground + 5 - c.y) * Math.min(1, dt);
    this.camera.position.set(c.x, c.y, c.z);
    this.camera.rotation.set(-0.12, this.angle, 0);
    this.camera.updateMatrixWorld();
    this.streamer.update(c.x, c.z);
    this.streamer.updateMeshes(c.x, c.y, c.z);
    const b = BIOMES[this.world.biomeAt(Math.floor(c.x), Math.floor(c.z))] ?? BIOMES[6];
    this.fog.set(b.fog);
    this.skyCol.set(b.sky);
    const so = this.sky.update({ time: 3500, day: 4, dim: 'surface', rain: 0, storm: 0, flash: 0, biomeSky: this.skyCol, biomeFog: this.fog, underwater: false, inLava: false, renderDistance: 96, cloudsEnabled: true }, this.camera, dt);
    const u = this.chunks.uniforms;
    u.uTime.value += dt;
    u.uDaylight.value = so.daylight;
    (u.uSkyLightColor.value as THREE.Color).copy(so.skyLight);
    (u.uFogColor.value as THREE.Color).copy(so.fog);
    u.uFogNear.value = so.fogNear;
    u.uFogFar.value = so.fogFar;
    (u.uSunDir.value as THREE.Vector3).copy(so.sunDir);
    (u.uCameraPos.value as THREE.Vector3).copy(this.camera.position);
    this.scene.background = so.fog;
    this.chunks.updateVisibility(this.camera, this.world.chunks, this.streamer.radius);
    renderer.render(this.scene, this.camera);
  }

  resize(): void {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
  }

  dispose(): void {
    this.streamer.unloadAll();
    this.chunks.dispose();
    this.sky.dispose();
  }
}

export class App implements AppApi {
  readonly version = VERSION;
  readonly api: AppApi = this;
  renderer!: THREE.WebGLRenderer;
  ui!: UIManager;
  input!: InputManager;
  settings: Settings = loadSettings();
  audio = new AudioEngine();
  storage!: WorldStorage;
  content!: Content;
  atlas!: BlockAtlas;
  icons!: IconFactory;
  pool!: WorkerPool;
  game: Game | null = null;
  mods: ModInfo[] = [];
  private packs: ContentPack[] = [];
  private panorama: Panorama | null = null;
  private last = performance.now();
  private expectUnlock = false;
  private poolSeed: number | null = null;
  private busy = false;

  async boot(): Promise<void> {
    THREE.ColorManagement.enabled = false;
    const canvas = document.getElementById('game') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: false });
    this.renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    this.renderer.autoClear = true;
    this.ui = new UIManager(document.getElementById('ui')!);
    this.input = new InputManager(canvas);
    installButtonTexture();
    setClickSound(() => {
      this.audio.unlock();
      this.audio.play('clic', { vol: 0.5 });
    });
    const boot = h('div', { class: 'screen', style: { background: '#1b1b22' } }, h('div', { class: 'title' }, 'Voxerra'), h('div', { class: 'subtitle' }, 'Chargement du contenu…'));
    this.ui.push({ el: boot, onEscape: () => {} });
    // Contenu + mods
    const { packs, infos } = await loadMods();
    this.packs = packs;
    this.mods = infos;
    const merged = mergePacks([BASE_PACK, ...packs]);
    applyBiomeOverrides(merged.biomes);
    this.content = new Content(merged);
    this.atlas = buildAtlas(this.content);
    this.icons = new IconFactory(this.content, this.atlas.lib);
    this.storage = await IdbStorage.create();
    this.pool = createWorkerPool();
    this.applySettings();
    // Évènements globaux
    addEventListener('resize', () => this.onResize());
    document.addEventListener('pointerlockchange', () => this.onLockChange());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.game) this.game.save();
    });
    addEventListener('pagehide', () => this.game?.save());
    addEventListener('pointerdown', () => this.audio.unlock(), { capture: true });
    addEventListener('keydown', () => this.audio.unlock(), { capture: true });
    canvas.addEventListener('click', () => {
      if (this.game && !this.ui.open) this.input.lock();
    });
    this.ui.onStackChange = () => {
      this.input.gameFocus = !this.ui.open;
    };
    await this.startPanorama();
    this.showMainMenu();
    requestAnimationFrame(this.loop);
    // hook de test automatisé
    (window as unknown as { voxerra: App }).voxerra = this;
  }

  private async initPool(seed: number, worldType = 'normal', structures = true): Promise<void> {
    await this.pool.broadcast({ type: 'init', seed, packs: this.packs, worldType, structures });
    this.poolSeed = seed;
  }

  private async startPanorama(): Promise<void> {
    if (this.poolSeed !== PANORAMA_SEED) await this.initPool(PANORAMA_SEED);
    this.panorama = new Panorama(this.content, this.atlas, this.pool);
    this.audio.setMood('menu');
  }

  showMainMenu(): void {
    this.ui.set(mainMenu(this));
  }

  saveSettings(): void {
    saveSettings(this.settings);
  }

  applySettings(): void {
    const s = this.settings;
    this.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2) * s.pixelRatio);
    this.renderer.setSize(innerWidth, innerHeight);
    this.input.bindings = s.bindings;
    this.input.sensitivity = s.sensitivity;
    this.input.invertY = s.invertY;
    this.audio.volumes = { master: s.masterVolume, music: s.musicVolume, sfx: s.sfxVolume };
    this.audio.applyVolumes();
    document.documentElement.style.setProperty('--ui-scale', String(s.guiScale));
    (document.getElementById('ui') as HTMLElement).style.zoom = String(s.guiScale);
    if (this.game) {
      this.game.streamer.radius = s.renderDistance;
      this.game.camera.fov = s.fov;
      this.game.camera.updateProjectionMatrix();
      this.game.player.name = s.playerName;
    }
  }

  private onResize(): void {
    this.renderer.setSize(innerWidth, innerHeight);
    this.panorama?.resize();
    this.game?.resize();
  }

  private onLockChange(): void {
    if (document.pointerLockElement) return;
    // Échap pendant le verrouillage : le navigateur libère le pointeur → menu pause
    setTimeout(() => {
      if (this.game && !this.ui.open && !this.game.player.dead && !this.expectUnlock) this.game.openPause();
      this.expectUnlock = false;
    }, 30);
  }

  async startWorld(meta: WorldMeta, isNew: boolean): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    this.audio.unlock();
    const loading = loadingScreen();
    this.ui.set(loading.screen);
    loading.set('Préparation du monde…', 0, 1);
    try {
      this.panorama?.dispose();
      this.panorama = null;
      await this.initPool(meta.seed, meta.worldType, meta.structures !== false);
      if (!isNew) {
        const fresh = await this.storage.loadMeta(meta.id);
        if (fresh) meta = fresh;
      }
      const game = new Game(this, meta, isNew);
      this.game = game;
      this.ui.hudLayer.innerHTML = '';
      await game.load(loading);
      this.ui.hudLayer.append(game.hud.el, game.chat.el);
      this.ui.closeAll();
      this.input.lock();
      this.audio.setMood('jour');
    } catch (e) {
      console.error(e);
      this.game = null;
      this.ui.hudLayer.innerHTML = '';
      await this.startPanorama();
      this.showMainMenu();
      alert('Impossible de charger le monde : ' + (e as Error).message);
    } finally {
      this.busy = false;
    }
  }

  async quitToTitle(): Promise<void> {
    if (!this.game || this.busy) return;
    this.busy = true;
    const loading = loadingScreen();
    this.ui.set(loading.screen);
    loading.set('Sauvegarde du monde…', 1, 2);
    this.expectUnlock = true;
    this.input.unlock();
    try {
      await this.game.dispose(true);
    } catch (e) {
      console.error(e);
    }
    this.game = null;
    this.ui.hudLayer.innerHTML = '';
    await this.startPanorama();
    this.busy = false;
    this.showMainMenu();
  }

  async connect(address: string, name: string): Promise<void> {
    if (this.busy) return;
    this.busy = true;
    const loading = loadingScreen();
    this.ui.set(loading.screen);
    loading.set(`Connexion à ${address}…`, 0, 1);
    try {
      this.panorama?.dispose();
      this.panorama = null;
      const game = await connectToServer(this, address, name, loading);
      this.game = game;
      this.ui.hudLayer.innerHTML = '';
      this.ui.hudLayer.append(game.hud.el, game.chat.el);
      this.ui.closeAll();
      this.input.lock();
    } catch (e) {
      console.error(e);
      this.game = null;
      await this.startPanorama();
      this.showMainMenu();
      alert('Connexion impossible : ' + (e as Error).message);
    } finally {
      this.busy = false;
    }
  }

  async importMod(text: string): Promise<string> {
    const r = importModText(text);
    if (typeof r === 'string') return 'Erreur : ' + r;
    this.mods = this.mods.filter((m) => m.id !== r.info.id);
    this.mods.push(r.info);
    return `Mod « ${r.info.name} » importé (${r.info.summary}). Rechargez la page pour l’activer.`;
  }

  removeMod(id: string): void {
    removeImportedMod(id);
    this.mods = this.mods.filter((m) => m.id !== id || m.builtin);
  }

  private loop = (now: number): void => {
    const dt = Math.min(0.1, (now - this.last) / 1000);
    this.last = now;
    this.input.pollGamepad();
    try {
      if (this.game) {
        this.game.update(dt);
        this.game.render(dt);
      } else if (this.panorama) {
        this.panorama.frame(this.renderer, dt);
        this.ui.update(dt);
        this.audio.update(dt);
      }
    } catch (e) {
      console.error(e);
    }
    this.input.endFrame();
    requestAnimationFrame(this.loop);
  };
}
