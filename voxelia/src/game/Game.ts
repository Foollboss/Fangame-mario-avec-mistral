/**
 * Game — une partie en cours : monde, joueur, entités, simulation à 20 tics/s,
 * cycle jour/nuit, météo, blocs actifs, dimensions et portails, mort et réapparition,
 * sommeil, montures, sauvegarde automatique, liaison multijoueur.
 * Implémente les services utilisés par les entités (EntityHost).
 */
import * as THREE from 'three';
import { World } from '../world/World';
import { ChunkManager, type SavedChunk } from '../world/ChunkManager';
import { BlockTicks } from '../world/BlockTicks';
import { PowerSystem } from '../world/Power';
import { B, BLOCKS, IS_LIQUID, WATERLOGGED } from '../world/blocks';
import { biomeById } from '../world/biomes';
import { blockId, DIMENSION_NAMES, SEA_LEVEL, WORLD_HEIGHT } from '../world/constants';
import { OverworldShaper } from '../world/gen/terrain';
import type { Chunk } from '../world/Chunk';
import type { GenMarker } from '../world/gen/writer';
import type { GenOptions } from '../world/gen/terrain';
import { Player } from '../player/Player';
import { PlayerController } from '../player/PlayerController';
import { EntityManager } from '../entities/EntityManager';
import { Mob } from '../entities/Mob';
import { Villager } from '../entities/Villager';
import { FallingBlock, Lightning, PrimedTnt, Vehicle } from '../entities/misc';
import type { EntityHost } from '../entities/host';
import type { Entity, DamageSource } from '../entity/Entity';
import { SelectionOutline, BreakOverlay, ParticleSystem } from '../render/Effects';
import { HandRenderer } from '../render/HandRenderer';
import { brightness } from '../render/ItemMesh';
import { Hud } from '../ui/Hud';
import { Interaction } from './Interaction';
import { WeatherSystem } from './Weather';
import { CameraRig } from './CameraRig';
import { MiniMap } from './MiniMap';
import { BlockEntityTicker } from './BlockEntityTicker';
import { explode } from './Explosion';
import { rollLoot } from './Loot';
import { runCommand } from './Commands';
import { blockDrops } from './drops';
import { buildPortal, convertCoords, findPortal, portalKindOf, portalTarget, tryLightPortal, type PortalKind } from './Portals';
import { ITEM_BY_KEY, ITEMS, type ItemStack } from '../items/items';
import type { GameMode, GameRules, Difficulty, WorldMeta, PlayerSave } from '../save/SaveManager';
import type { BlockEntity } from '../world/Chunk';
import type { Renderer } from '../render/Renderer';
import type { AudioManager } from '../audio/AudioManager';
import type { InputManager, InputState } from '../input/InputManager';
import type { TouchControls } from '../input/TouchControls';
import type { SettingsManager } from '../core/Settings';
import type { SaveManager } from '../save/SaveManager';
import type { UIManager } from '../ui/UIManager';
import type { ItemIcons } from '../render/ItemIcons';
import type { ItemMeshFactory } from '../render/ItemMesh';
import type { WorkerPool } from '../world/WorkerPool';
import type { NetClient } from '../net/NetClient';

/** Écrans ouverts par le jeu (fournis par l'application). */
export interface GameScreens {
  inventory(g: Game): void;
  crafting(g: Game): void;
  furnace(g: Game, x: number, y: number, z: number): void;
  chest(g: Game, x: number, y: number, z: number): void;
  trade(g: Game, v: Villager): void;
  pause(g: Game): void;
  chat(g: Game, initial: string): void;
  death(g: Game, message: string): void;
  loading(text: string, progress: number, tip?: boolean): void;
  closeLoading(): void;
}

/** Services de l'application nécessaires à une partie. */
export interface GameApp {
  renderer: Renderer;
  audio: AudioManager;
  input: InputManager;
  touch: TouchControls;
  settings: SettingsManager;
  saves: SaveManager;
  ui: UIManager;
  icons: ItemIcons;
  itemMeshes: ItemMeshFactory;
  pool: WorkerPool;
  screens: GameScreens;
  iconsVersion: number;
  touchMode: boolean;
  vibrate(ms: number): void;
  quitToMenu(): Promise<void>;
}

const DEATH_MESSAGES: Record<DamageSource['type'], string> = {
  attack: 'a été tué(e)',
  fall: 'a fait une chute mortelle',
  lava: 'a essayé de nager dans la lave',
  fire: 'est parti(e) en fumée',
  drown: 's’est noyé(e)',
  starve: 'est mort(e) de faim',
  void: 'est tombé(e) dans le vide',
  explosion: 'a explosé',
  contact: 's’est piqué(e) à mort',
  projectile: 'a été abattu(e)',
  magic: 'a été tué(e) par magie',
  suffocate: 'a suffoqué dans un mur',
  lightning: 'a été foudroyé(e)',
  generic: 'est mort(e)',
};

const TICK = 1 / 20;
const tmpA = new THREE.Vector3();

export class Game implements EntityHost {
  readonly world: World;
  readonly chunks: ChunkManager;
  readonly player = new Player();
  readonly controller: PlayerController;
  readonly entities: EntityManager;
  readonly interaction: Interaction;
  readonly weather = new WeatherSystem();
  readonly ticks = new BlockTicks();
  readonly power = new PowerSystem();
  readonly selection = new SelectionOutline();
  readonly breakOverlay: BreakOverlay;
  readonly particles: ParticleSystem;
  readonly hand: HandRenderer;
  readonly hud: Hud;
  readonly cameraRig = new CameraRig();
  readonly blockEntityTicker: BlockEntityTicker;
  private miniMap: MiniMap;
  readonly tmpVec = new THREE.Vector3();
  net: NetClient | null;
  dimension = 0;
  daylight = 1;
  shake = 0;
  showMap = false;
  debug = false;
  sleepTicks = 0;
  private tickAcc = 0;
  tickCount = 0;
  private portalTime = 0;
  private portalBlocked = false;
  private portalKind: PortalKind | null = null;
  private autosaveTimer = 60;
  private unloadedDirty = new Map<string, { dim: number; cx: number; cz: number; blocks: Uint16Array; biomes: Uint8Array; be: Map<number, BlockEntity> }>();
  private entityChunks = new Set<string>();
  private spawnedMarkers: Set<string>;
  private bossEntity: Entity | null = null;
  private bossSeen = 0;
  private saving: Promise<void> | null = null;
  private changingDim = false;
  private disposed = false;
  private prevSneak = false;
  private prevJump = false;
  private biomeSky = new THREE.Color(0x78a7ff);
  private biomeFog = new THREE.Color(0xc0d8ff);
  private fpsFrames = 0;
  private fpsTime = 0;
  private fps = 0;
  private lastFrameMs = 0;
  private playClock = 0;
  private thumbTimer = 0;
  private deathShown = false;
  private deathTimer = 0;
  private lastHurtSound = 0;
  ready = false;

  constructor(
    readonly app: GameApp,
    readonly meta: WorldMeta,
    net: NetClient | null = null,
  ) {
    this.net = net;
    const r = app.renderer;
    this.spawnedMarkers = new Set(meta.spawnedMarkers ?? []);
    this.chunks = new ChunkManager(app.pool, r.materials, { load: (d, cx, cz) => this.loadChunkData(d, cx, cz) }, { onLoaded: (c, fresh, markers) => this.onChunkLoaded(c, fresh, markers), onUnload: (c) => this.onChunkUnload(c) });
    this.world = new World(this.chunks);
    this.player.world = this.world;
    this.player.name = app.settings.data.profileName;
    this.controller = new PlayerController(this.player);
    this.entities = new EntityManager(app.itemMeshes);
    this.entities.playerSkin = 'player_' + app.settings.data.skin;
    (this.player as unknown as { skinKey: string }).skinKey = this.entities.playerSkin;
    this.particles = new ParticleSystem(r.atlas, () => this.world);
    this.breakOverlay = new BreakOverlay(r.atlas);
    this.hand = new HandRenderer(app.itemMeshes, this.entities.models);
    this.hand.setSkin(this.entities.playerSkin);
    this.interaction = new Interaction(this);
    this.blockEntityTicker = new BlockEntityTicker(this);
    this.hud = new Hud(
      app.icons,
      {
        selectSlot: (i) => this.selectSlot(i),
        openInventory: () => this.openInventory(),
        dropSlot: (i) => this.dropFromSlot(i, false),
        pause: () => this.pause(),
        chat: () => this.openChat(''),
        perspective: () => this.cameraRig.cycle(),
      },
      app.touchMode,
    );
    this.miniMap = new MiniMap(this.hud.mapCanvas, r.atlas);
    r.terrain.add(this.chunks.root);
    r.entities.add(this.entities.group);
    r.effects.add(this.particles.points, this.selection.object, this.breakOverlay.mesh, this.weather.group);
    const game = this;
    this.ticks.bind({
      world: this.world,
      get dimension() {
        return game.dimension;
      },
      rules: meta.rules,
      center: this.player.pos,
      spawnFalling: (x, y, z, raw) => {
        const e = new FallingBlock(raw);
        this.spawnEntity(e, x + 0.5, y, z + 0.5);
      },
      dropBlock: (x, y, z, raw) => {
        const def = BLOCKS[blockId(raw)];
        if (!def) return;
        for (const s of blockDrops(def, raw >> 10, null).items) this.dropItem(x + 0.5, y + 0.3, z + 0.5, s);
      },
      particlesAt: (x, y, z, id) => this.particles.blockBreak(x, y, z, id, true),
      sound: (name, x, y, z) => this.audio(name, { x, y, z }),
      isRaining: () => this.isRaining(),
      power: this.power,
    });
    this.power.bind({
      world: this.world,
      igniteTnt: (x, y, z) => this.igniteTnt(x, y, z),
      sound: (name, x, y, z) => this.audio(name, { x, y, z }),
      schedule: (x, y, z, d) => this.ticks.schedulePower(x, y, z, d),
      entitiesOn: (x, y, z) => this.entitiesOn(x, y, z),
    });
    this.world.onChange((c) => {
      this.ticks.onChange(c.x, c.y, c.z, c.prev, c.next);
      this.power.onBlockChanged(c.x, c.y, c.z);
      if (this.net && c.cause !== 'remote' && c.cause !== 'gen') this.net.sendBlock(this.dimension, c.x, c.y, c.z, c.next);
    });
    this.weather.onLightning = (x, _y, z) => this.strikeLightning(x, z);
    this.player.onDamage = (amount, src) => this.onPlayerDamage(amount, src);
    this.player.onDeath = (src) => this.onPlayerDeath(src);
    this.controller.onStep = (id) => {
      const d = BLOCKS[id];
      if (d && !this.player.sneaking) this.app.audio.material(d.sound, 'step', { x: this.player.pos.x, y: this.player.pos.y, z: this.player.pos.z, volume: 0.35 });
    };
    this.controller.onJump = () => {
      /* rien : le son de pas suffit */
    };
    this.controller.onSplash = () => this.audio('splash', this.player.pos);
    this.applySettings();
    app.settings.onChange(() => this.applySettings());
  }

  // ------------------------------------------------------------------ accès pratiques
  get time(): number {
    return this.meta.time;
  }

  get rules(): GameRules {
    return this.meta.rules;
  }

  get difficulty(): Difficulty {
    return this.meta.difficulty;
  }

  get uiOpen(): boolean {
    return this.app.ui.depth > 0;
  }

  cameraEye(): THREE.Vector3 {
    const p = this.player;
    return tmpA.set(p.pos.x, p.pos.y + p.eyeHeight, p.pos.z);
  }

  spawnPoint(): [number, number, number] {
    return this.player.spawnPoint ?? this.meta.spawn ?? [0.5, 80, 0.5];
  }

  genOptions(): GenOptions {
    const m = this.meta;
    return { seed: m.seed, template: m.template, caves: m.caves, structures: m.structures, fantasyBiomes: m.experiments.fantasyBiomes, drop3: m.experiments.drop3, dimensions: m.experiments.dimensions };
  }

  applySettings(): void {
    const s = this.app.settings.data;
    this.chunks.renderDistance = s.renderDistance;
    this.chunks.fancyLeaves = s.fancyLeaves;
    this.controller.autoJump = s.autoJump;
    this.particles.density = s.particles === 'all' ? 1 : s.particles === 'reduced' ? 0.5 : 0.2;
    this.hud.setTouch(this.app.touchMode);
  }

  // ------------------------------------------------------------------ chargement
  /** Charge la partie (joueur, tronçons autour du point d'apparition). */
  async load(): Promise<void> {
    const app = this.app;
    const meta = this.meta;
    app.screens.loading('Préparation du monde…', 0, true);
    if (!this.net) await app.saves.openWorld(meta.id);
    app.pool.broadcast({ type: 'init', opts: this.genOptions(), textures: app.renderer.atlas.info });
    this.weather.load(meta.weather.state, meta.weather.timer);
    let save: PlayerSave | undefined;
    if (this.net) save = this.net.playerSave ?? undefined;
    else save = await app.saves.loadPlayer(meta.id);
    const p = this.player;
    let fresh = false;
    if (save) {
      p.deserialize(save);
      this.dimension = save.dim ?? 0;
      if (!meta.experiments.dimensions) this.dimension = 0;
    } else {
      fresh = true;
      p.gameMode = meta.gameMode;
      this.dimension = 0;
      if (!meta.spawn) meta.spawn = this.findSpawn();
      p.pos.set(meta.spawn[0], meta.spawn[1], meta.spawn[2]);
      p.prevPos.copy(p.pos);
      p.yaw = Math.PI * 0.75;
    }
    this.applyModeRules();
    this.chunks.reset(this.dimension, true);
    await this.waitForChunks('Génération du terrain');
    if (this.disposed) return;
    if (fresh) {
      this.placeOnGround(true);
      meta.spawn = [p.pos.x, p.pos.y, p.pos.z];
      if (meta.bonusChest) this.placeBonusChest();
      if (meta.startingMap) p.inventory.give({ id: ITEM_BY_KEY.get('map')!.id, count: 1 });
    } else if (this.insideSolid()) this.placeOnGround(false);
    p.prevPos.copy(p.pos);
    this.ready = true;
    app.screens.closeLoading();
    this.app.audio.setMood(this.dimension === 1 ? 'ember' : this.dimension === 2 ? 'sky' : 'day');
    this.message(`Bienvenue dans « ${meta.name} » !`);
    if (this.net) this.net.attach(this);
  }

  /** Attend que les tronçons autour du joueur soient générés et maillés. */
  private async waitForChunks(label: string): Promise<void> {
    this.waitingChunks = true;
    try {
      await this.waitForChunksInner(label);
    } finally {
      this.waitingChunks = false;
    }
  }

  private waitingChunks = false;

  private async waitForChunksInner(label: string): Promise<void> {
    const p = this.player;
    const radius = Math.min(3, this.chunks.renderDistance);
    const start = performance.now();
    for (;;) {
      if (this.disposed) return;
      this.chunks.update(p.pos.x, p.pos.z, p.pos);
      const pr = this.chunks.progress(p.pos.x, p.pos.z, radius);
      this.app.screens.loading(`${label}…`, pr.total ? pr.done / pr.total : 0, true);
      const col = this.world.chunkAt(Math.floor(p.pos.x), Math.floor(p.pos.z));
      if (pr.done >= pr.total && col?.ready) break;
      if (performance.now() - start > 60000) break;
      await new Promise((r) => setTimeout(r, 30));
    }
  }

  /** Point d'apparition initial : terre ferme près de l'origine. */
  findSpawn(): [number, number, number] {
    const shaper = new OverworldShaper(this.genOptions());
    if (this.meta.template === 'flat') return [0.5, 66, 0.5];
    for (let r = 0; r < 3000; r += 24) {
      const steps = Math.max(1, Math.floor((Math.PI * 2 * r) / 24));
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const x = Math.round(Math.cos(a) * r);
        const z = Math.round(Math.sin(a) * r);
        const s = shaper.sample(x, z);
        const b = biomeById(s.biome);
        if (b.isOcean || b.isRiver || s.height <= SEA_LEVEL + 1 || s.height > 140 || s.craterLava >= 0) continue;
        if (b.key === 'volcano' || b.key === 'badlands') continue;
        return [x + 0.5, Math.floor(s.height) + 2, z + 0.5];
      }
    }
    return [0.5, 100, 0.5];
  }

  private insideSolid(): boolean {
    const p = this.player;
    return this.world.def(Math.floor(p.pos.x), Math.floor(p.pos.y), Math.floor(p.pos.z)).solid || this.world.def(Math.floor(p.pos.x), Math.floor(p.pos.y + 1), Math.floor(p.pos.z)).solid;
  }

  /** Pose le joueur sur la surface (ou dans une poche d'air sûre). */
  private placeOnGround(surface: boolean): void {
    const p = this.player;
    const x = Math.floor(p.pos.x);
    const z = Math.floor(p.pos.z);
    if (surface && this.dimension === 0) {
      // Colonne proche dont le sommet est un vrai sol (pas une cime d'arbre, ni de l'eau)
      const good = (cx: number, cz: number) => {
        const top = this.world.height(cx, cz);
        const d = BLOCKS[this.world.id(cx, top, cz)];
        return !!d && d.solid && !IS_LIQUID[d.id] && !d.key.endsWith('_leaves') && !d.key.endsWith('_log') && d.key !== 'cactus' && top > SEA_LEVEL - 2;
      };
      search: for (let r = 0; r <= 12; r++)
        for (let dz = -r; dz <= r; dz++)
          for (let dx = -r; dx <= r; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dz)) !== r) continue;
            if (good(x + dx, z + dz)) {
              p.pos.x = x + dx + 0.5;
              p.pos.z = z + dz + 0.5;
              break search;
            }
          }
      p.pos.y = this.world.height(Math.floor(p.pos.x), Math.floor(p.pos.z)) + 1;
      return;
    }
    for (let y = Math.max(2, Math.floor(p.pos.y)); y < WORLD_HEIGHT - 2; y++) {
      if (!this.world.def(x, y, z).solid && !this.world.def(x, y + 1, z).solid && this.world.def(x, y - 1, z).solid) {
        p.pos.y = y;
        return;
      }
    }
    p.pos.y = this.world.height(x, z) + 1;
  }

  private placeBonusChest(): void {
    const p = this.player;
    const x = Math.floor(p.pos.x) + 2;
    const z = Math.floor(p.pos.z) + 1;
    const y = this.world.height(x, z) + 1;
    this.world.set(x, y, z, B.chest, 0, 'player');
    this.world.setBlockEntity(x, y, z, { type: 'chest', items: rollLoot('bonus_chest') });
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ])
      if (this.world.id(x + dx, y, z + dz) === 0 && this.world.def(x + dx, y - 1, z + dz).solid) this.world.set(x + dx, y, z + dz, B.torch, 0, 'player');
  }

  private async loadChunkData(dim: number, cx: number, cz: number): Promise<SavedChunk | null> {
    const pending = this.unloadedDirty.get(`${dim}|${cx},${cz}`);
    if (pending) return { blocks: pending.blocks.slice(), biomes: pending.biomes.slice(), blockEntities: [...pending.be.entries()] };
    if (this.net) return this.net.loadChunk(dim, cx, cz);
    return this.app.saves.loadChunk(dim, cx, cz);
  }

  private onChunkLoaded(c: Chunk, fresh: boolean, markers: GenMarker[]): void {
    const key = `${c.dim}|${c.cx},${c.cz}`;
    if (markers.length && !this.net) {
      this.entities.applyMarkers(this, c, markers, (x, y, z, loot) => this.fillGenerated(x, y, z, loot), this.spawnedMarkers);
    }
    void fresh;
    if (this.net) {
      const d = this.net.takeDiffs(c.dim, c.cx, c.cz);
      if (d) {
        for (const [i, raw] of d.blocks) this.world.setRaw(c.cx * 16 + (i & 15), i >> 8, c.cz * 16 + ((i >> 4) & 15), raw, 'remote');
        for (const [i, be] of d.be) c.blockEntities.set(i, be as BlockEntity);
      }
      return;
    }
    const pend = this.entities.pendingSaves.get(key);
    const restore = (list: Array<{ type: string; pos: [number, number, number]; yaw: number; health: number; data?: Record<string, unknown> }>) => {
      if (!this.world.chunkAt(c.cx * 16, c.cz * 16) || this.dimension !== c.dim) return;
      if (list.length) this.entityChunks.add(key);
      for (const s of list) this.entities.restore(this, s);
    };
    if (pend) {
      this.entities.pendingSaves.delete(key);
      restore(pend);
    } else
      void this.app.saves.loadEntities(this.meta.id, c.dim, c.cx, c.cz).then((list) => {
        if (this.disposed) return;
        restore(list);
      });
  }

  private onChunkUnload(c: Chunk): void {
    if (this.disposed) return;
    const key = `${c.dim}|${c.cx},${c.cz}`;
    if (c.modified && c.ready && !this.net) this.unloadedDirty.set(key, { dim: c.dim, cx: c.cx, cz: c.cz, blocks: c.blocks, biomes: c.biomes, be: new Map(c.blockEntities) });
    if (!this.net) {
      const had = this.entities.unloadChunk(c, c.dim, this.player.vehicle);
      if (had || this.entityChunks.has(key)) {
        if (!this.entities.pendingSaves.has(key)) this.entities.pendingSaves.set(key, []);
      }
    }
  }

  /** Coffres et générateurs posés par la génération. */
  private fillGenerated(x: number, y: number, z: number, loot: string): void {
    const id = this.world.id(x, y, z);
    if (id === B.spawner) this.world.setBlockEntity(x, y, z, { type: 'spawner', mob: loot, delay: 40 });
    else if (id === B.chest || id === B.barrel) this.world.setBlockEntity(x, y, z, { type: 'chest', items: rollLoot(loot) });
  }

  // ------------------------------------------------------------------ boucle
  /** Une image : entrées, tics de simulation, caméra, rendu. */
  frame(dt: number): void {
    if (!this.ready || this.disposed) return;
    const app = this.app;
    const input = app.input;
    const t0 = performance.now();
    input.active = !this.uiOpen && !this.player.dead;
    input.poll(dt);
    const st = input.state;
    try {
      this.frameInner(dt, st, t0);
    } finally {
      // Toujours consommer les actions de l'image, même si une erreur survient,
      // sinon elles seraient rejouées à chaque image (menus qui s'ouvrent en boucle).
      st.clearFrame();
    }
  }

  private frameInner(dt: number, st: InputState, t0: number): void {
    this.handleActions();
    // Regard
    const p = this.player;
    if (!this.uiOpen && !p.dead && this.sleepTicks === 0) {
      p.yaw -= st.lookDX;
      p.pitch = Math.max(-Math.PI / 2 + 0.001, Math.min(Math.PI / 2 - 0.001, p.pitch - st.lookDY));
    }
    // Simulation à pas fixe
    const paused = this.waitingChunks || this.changingDim || (this.uiOpen && !this.net && this.pausesGame());
    if (!paused) {
      this.tickAcc += Math.min(dt, 0.25);
      let n = 0;
      while (this.tickAcc >= TICK && n < 5) {
        this.tick();
        this.tickAcc -= TICK;
        n++;
      }
      if (n === 5) this.tickAcc = 0;
    }
    const alpha = paused ? 1 : Math.min(1, this.tickAcc / TICK);
    if (!paused) this.interaction.frame(dt, st);
    this.render(dt, alpha);
    this.updateHud(dt);
    this.lastFrameMs = performance.now() - t0;
    this.fpsFrames++;
    this.fpsTime += dt;
    if (this.fpsTime >= 1) {
      this.fps = Math.round(this.fpsFrames / this.fpsTime);
      this.fpsFrames = 0;
      this.fpsTime = 0;
    }
    // Sauvegarde automatique
    this.playClock += dt;
    this.autosaveTimer -= dt;
    this.thumbTimer -= dt;
    if (this.autosaveTimer <= 0) {
      this.autosaveTimer = 60;
      void this.save(false);
    }
  }

  /** Les écrans d'inventaire ne mettent pas le jeu en pause ; le menu pause, si. */
  private pausesGame(): boolean {
    // Un menu pause ouvert sous d'autres écrans (paramètres…) garde la partie en pause.
    return this.app.ui.some((sc) => !!(sc as unknown as { pausesGame?: boolean }).pausesGame);
  }

  private handleActions(): void {
    const pr = this.app.input.state.pressed;
    if (!pr.size) return;
    const p = this.player;
    for (const a of pr) {
      if (a === 'pause') this.pause();
      else if (a === 'inventory') {
        if (this.uiOpen) this.app.ui.back();
        else this.openInventory();
      } else if (this.uiOpen || p.dead) continue;
      else if (a === 'drop') this.dropFromSlot(p.inventory.selected, false);
      else if (a === 'dropStack') this.dropFromSlot(p.inventory.selected, true);
      else if (a === 'chat') this.openChat('');
      else if (a === 'command') this.openChat('/');
      else if (a === 'perspective') this.cameraRig.cycle();
      else if (a === 'debug') this.debug = !this.debug;
      else if (a === 'hud') this.hud.hidden = !this.hud.hidden;
      else if (a === 'map') this.toggleMap();
      else if (a === 'pickBlock') this.interaction.pickBlock();
      else if (a === 'hotbarNext') this.selectSlot((p.inventory.selected + 1) % 9);
      else if (a === 'hotbarPrev') this.selectSlot((p.inventory.selected + 8) % 9);
      else if (a === 'swapHands') {
        const inv = p.inventory;
        const a1 = inv.get(inv.selected);
        inv.slots[inv.selected] = inv.offhand.get(0);
        inv.offhand.slots[0] = a1;
        inv.changed();
        inv.offhand.changed();
      } else if (a.startsWith('hotbar')) this.selectSlot(Number(a.slice(6)));
    }
  }

  /** Tic de simulation (20 par seconde). */
  tick(): void {
    this.tickCount++;
    const p = this.player;
    const input = this.app.input.state;
    const meta = this.meta;
    // Temps
    // En multijoueur, l'heure avance aussi localement (le serveur la recale toutes les 5 s)
    if (meta.rules.daylightCycle) {
      meta.time++;
      if (meta.time >= 24000) {
        meta.time -= 24000;
        meta.day++;
      }
    }
    this.daylight = this.computeDaylight();
    // Joueur
    p.prevYaw = p.yaw;
    const sneakEdge = input.sneak && !this.prevSneak;
    const jumpEdge = input.jump && !this.prevJump;
    this.prevSneak = input.sneak;
    this.prevJump = input.jump;
    if (this.sleepTicks > 0) this.tickSleep();
    else if (p.vehicle) this.tickRiding(sneakEdge);
    else {
      this.controller.tick(input);
      if (!p.dead) this.tickElevator(jumpEdge, sneakEdge);
    }
    if (!p.dead) p.survivalTick();
    else this.deathTimer++;
    if (p.swingTime > 0) p.swingTime = Math.max(0, p.swingTime - 0.25);
    this.checkPlates();
    this.checkPortal();
    // Monde
    this.weather.tick(this.world, p.pos, this.dimension, meta.rules.weatherCycle && !this.net);
    this.ticks.tick();
    this.blockEntityTicker.tick();
    this.entities.spawning = meta.rules.mobSpawning && !this.net;
    this.entities.tick(this);
    if (p.vehicle) this.syncRider();
    this.net?.tick(this);
    if (this.shake > 0) this.shake = Math.max(0, this.shake - 0.05);
    if (this.bossEntity && this.tickCount - this.bossSeen > 40) {
      this.bossEntity = null;
      this.hud.boss(null);
    }
    if (p.dead && !this.deathShown && (this.deathTimer > 20 || meta.rules.immediateRespawn)) {
      this.deathShown = true;
      if (meta.rules.immediateRespawn) this.respawn();
      else this.app.screens.death(this, this.lastDeathMessage);
    }
  }

  computeDaylight(): number {
    if (this.dimension === 1) return 0.55;
    if (this.dimension === 2) return 1;
    const angle = (this.meta.time / 24000) * Math.PI * 2;
    const day = Math.min(1, Math.max(0, Math.sin(angle) * 2.4 + 0.45));
    const rain = 1 - this.weather.rain * 0.35 - this.weather.thunder * 0.25;
    return Math.max(0.16, day * rain);
  }

  // ------------------------------------------------------------------ rendu
  private render(dt: number, alpha: number): void {
    const app = this.app;
    const r = app.renderer;
    const p = this.player;
    const s = app.settings.data;
    let shake = this.shake;
    if (this.bossEntity && (this.bossEntity as unknown as { shake?: number }).shake) {
      const b = this.bossEntity as unknown as { shake: number };
      if (b.shake > 0) {
        shake = Math.max(shake, b.shake / 10);
        b.shake = Math.max(0, b.shake - 1);
      }
    }
    this.cameraRig.update(r.camera, p, this.world, alpha, dt, { bobbing: s.viewBobbing, shake, sleeping: this.sleepTicks > 0 });
    const cam = r.camera.position;
    // Couleurs du biome (transition douce)
    const biome = this.world.biome(Math.floor(cam.x), Math.floor(cam.z));
    this.biomeSky.lerp(tmpColor.setHex(biome.sky), Math.min(1, dt * 0.8));
    this.biomeFog.lerp(tmpColor.setHex(biome.fog), Math.min(1, dt * 0.8));
    const camId = this.world.id(Math.floor(cam.x), Math.floor(cam.y), Math.floor(cam.z));
    const underwater = WATERLOGGED[camId] === 1 && (IS_LIQUID[camId] === 1 || camId === B.water || BLOCKS[camId]?.waterlogged);
    // Sprint : champ de vision élargi
    r.fovBoost = p.sprinting && !p.sneaking ? 8 : p.flying && p.sprinting ? 10 : 0;
    if (this.interaction.bowCharge > 0) r.fovBoost -= Math.min(1, this.interaction.bowCharge) * 12;
    this.chunks.update(p.pos.x, p.pos.z, cam);
    this.entities.frame(alpha, dt, this, cam, null);
    this.entities.renderDetached(p, alpha, dt, this, !this.cameraRig.firstPerson);
    this.weather.frame(dt, this.world, cam, this.dimension);
    this.particles.setViewport(r.renderer.domElement.height, r.camera.fov);
    this.particles.update(dt);
    r.update(dt, { time: this.meta.time, day: this.meta.day, rain: this.weather.rain, thunder: this.weather.thunder, dimension: this.dimension, biomeSky: this.biomeSky, biomeFog: this.biomeFog, underwater: !!underwater });
    if (this.entities.lightningFlash > 0) r.uniforms.uDaylight.value = Math.min(1, r.uniforms.uDaylight.value + this.entities.lightningFlash * 0.6);
    r.render();
    // Main et objet tenu
    const ex = Math.floor(p.pos.x);
    const ey = Math.floor(p.pos.y + p.eyeHeight);
    const ez = Math.floor(p.pos.z);
    const light = brightness(this.world.skyLight(ex, ey, ez), this.world.blockLight(ex, ey, ez), r.sky.daylight);
    this.particles.setLight(1);
    const held = p.heldItem();
    this.hand.setItem(held ? held.id : -1);
    this.hand.eating = this.interaction.eating;
    this.hand.drawing = this.interaction.bowCharge;
    this.hand.visible = this.cameraRig.firstPerson && !p.dead && p.gameMode !== 'spectator' && this.sleepTicks === 0;
    const walk = p.prevWalkDist + (p.walkDist - p.prevWalkDist) * alpha;
    this.hand.update(dt, r.camera.aspect, r.camera.fov, s.viewBobbing ? p.bob : 0, walk, Math.min(1, light));
    this.hand.render(r.renderer);
    // Audio : auditeur, ambiances, musique
    const au = app.audio;
    au.setListener(cam.x, cam.y, cam.z, p.yaw);
    const sheltered = this.weather.sheltered(this.world, p.pos);
    au.setWeather(this.dimension === 0 && biome.precip === 'rain' ? this.weather.rain : 0, sheltered, this.weather.thunder);
    const sky = this.world.skyLight(ex, ey, ez);
    const underground = this.dimension === 0 && sky < 6 && p.pos.y < this.world.height(ex, ez) - 4;
    const forest = biome.treeDensity > 4;
    let nearLava = false;
    if (this.tickCount % 20 === 0) {
      for (let i = 0; i < 6 && !nearLava; i++) {
        const id = this.world.id(ex + Math.floor(Math.random() * 16 - 8), ey + Math.floor(Math.random() * 8 - 4), ez + Math.floor(Math.random() * 16 - 8));
        if (id === B.lava) nearLava = true;
      }
    }
    au.ambience(dt, { underground, dark: this.daylight < 0.4, day: this.daylight > 0.6, forest, nearLava, dimension: this.dimension });
    au.setMood(this.bossEntity ? 'boss' : this.dimension === 1 ? 'ember' : this.dimension === 2 ? 'sky' : underground ? 'cave' : this.daylight < 0.4 ? 'night' : 'day');
    au.updateMusic(dt);
    if (this.showMap) this.miniMap.update(dt, this.world, p.pos.x, p.pos.z, p.yaw);
    if (this.thumbTimer <= 0 && !this.uiOpen) {
      this.thumbTimer = 300;
      try {
        this.meta.thumbnail = r.thumbnail();
      } catch {
        /* vignette facultative */
      }
    }
  }

  private updateHud(dt: number): void {
    const p = this.player;
    const camId = this.world.id(Math.floor(this.app.renderer.camera.position.x), Math.floor(this.app.renderer.camera.position.y), Math.floor(this.app.renderer.camera.position.z));
    const underwater = camId === B.water || (WATERLOGGED[camId] === 1 && BLOCKS[camId]?.waterlogged === true);
    const portal = Math.min(1, this.portalTime / 80);
    let debug: string | null = null;
    if (this.debug) {
      const b = this.world.biome(Math.floor(p.pos.x), Math.floor(p.pos.z));
      const r = this.app.renderer.renderer.info;
      const t = this.interaction.target;
      debug = [
        `Voxelia — ${this.fps} i/s (${this.lastFrameMs.toFixed(1)} ms)`,
        `XYZ : ${p.pos.x.toFixed(2)} / ${p.pos.y.toFixed(2)} / ${p.pos.z.toFixed(2)}`,
        `Tronçon : ${Math.floor(p.pos.x / 16)}, ${Math.floor(p.pos.z / 16)}  ·  Dimension : ${DIMENSION_NAMES[this.dimension]}`,
        `Direction : ${(((((-p.yaw * 180) / Math.PI) % 360) + 360) % 360).toFixed(0)}°  Inclinaison : ${((p.pitch * 180) / Math.PI).toFixed(0)}°`,
        `Biome : ${b.name}`,
        `Lumière : ciel ${this.world.skyLight(Math.floor(p.pos.x), Math.floor(p.pos.y + 1), Math.floor(p.pos.z))}, bloc ${this.world.blockLight(Math.floor(p.pos.x), Math.floor(p.pos.y + 1), Math.floor(p.pos.z))}`,
        `Heure : ${Math.floor(this.meta.time)} · Jour ${this.meta.day + 1} · Météo : ${this.weather.state}`,
        `Tronçons : ${this.chunks.chunks.size} · Sections visibles : ${this.chunks.stats.visibleSections} · Faces : ${this.chunks.stats.quads}`,
        `Entités : ${this.entities.list.length} · Appels de rendu : ${r.render.calls} · Triangles : ${r.render.triangles}`,
        `Travaux en file : ${this.app.pool.queued} · en cours : ${this.app.pool.inFlight}`,
        t ? `Bloc visé : ${BLOCKS[t.id]?.key} (${t.x}, ${t.y}, ${t.z}) meta ${t.meta}` : '',
      ]
        .filter(Boolean)
        .join('\n');
    }
    this.hud.update(p, dt, {
      survival: p.survivalLike,
      showCoords: this.meta.showCoordinates,
      debug,
      underwater,
      portal,
      portalColor: this.portalKind === 'sky' ? 'rgba(120,200,255,0.55)' : 'rgba(200,60,255,0.55)',
      iconsVersion: this.app.iconsVersion,
    });
    this.hud.setCrosshair(!this.app.touchMode || this.cameraRig.firstPerson);
    this.app.touch.setFlying(this.player.flying);
  }

  // ------------------------------------------------------------------ joueur : actions
  selectSlot(i: number): void {
    const inv = this.player.inventory;
    if (i < 0 || i > 8 || i === inv.selected) return;
    inv.selected = i;
    this.interaction.reset();
    this.app.audio.play('click', { volume: 0.3, pitch: 1.6 });
  }

  dropFromSlot(i: number, all: boolean): void {
    const p = this.player;
    if (p.dead || p.gameMode === 'spectator') return;
    const s = p.inventory.get(i);
    if (!s) return;
    const n = all ? s.count : 1;
    const drop: ItemStack = { ...s, count: n };
    s.count -= n;
    if (s.count <= 0) p.inventory.slots[i] = null;
    p.inventory.changed();
    this.throwItem(drop);
  }

  /** Lance un objet devant le joueur. */
  throwItem(s: ItemStack): void {
    const p = this.player;
    const dir = p.lookDir();
    const vel = new THREE.Vector3(dir.x * 0.3, dir.y * 0.3 + 0.1, dir.z * 0.3);
    const e = this.entities.dropItem(this, p.pos.x, p.pos.y + p.eyeHeight - 0.3, p.pos.z, s, vel);
    e.pickupDelay = 40;
    p.swingTime = 1;
  }

  openInventory(): void {
    if (this.player.dead || this.uiOpen) return;
    this.app.screens.inventory(this);
  }

  openCrafting(): void {
    this.app.screens.crafting(this);
  }

  openFurnace(x: number, y: number, z: number): void {
    if (!this.world.blockEntity(x, y, z)) this.world.setBlockEntity(x, y, z, { type: 'furnace', items: [null, null, null], burn: 0, burnMax: 0, cook: 0, xp: 0 });
    this.app.screens.furnace(this, x, y, z);
  }

  openChest(x: number, y: number, z: number): void {
    if (this.world.def(x, y + 1, z).opaque && this.world.id(x, y, z) === B.chest) {
      this.message('Le coffre est bloqué par un bloc au-dessus.');
      return;
    }
    if (!this.world.blockEntity(x, y, z)) this.world.setBlockEntity(x, y, z, { type: 'chest', items: new Array(27).fill(null) });
    this.audio('chest_open', { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
    this.app.screens.chest(this, x, y, z);
  }

  openTrade(v: Entity): void {
    if (v instanceof Villager) this.app.screens.trade(this, v);
  }

  openChat(initial: string): void {
    if (this.uiOpen) return;
    this.app.screens.chat(this, initial);
  }

  pause(): void {
    if (this.uiOpen) {
      this.app.ui.back();
      return;
    }
    if (this.player.dead) return;
    this.app.screens.pause(this);
    void this.save(false);
  }

  toggleMap(): void {
    this.showMap = !this.showMap;
    this.hud.showMap(this.showMap);
  }

  /** Message saisi dans le chat (ou commande). */
  submitChat(text: string): void {
    const t = text.trim();
    if (!t) return;
    if (t.startsWith('/')) {
      this.message('> ' + t);
      for (const line of runCommand(this, t)) this.message(line);
      return;
    }
    if (this.net) this.net.sendChat(t);
    else this.message(`<${this.player.name}> ${t}`);
  }

  // ------------------------------------------------------------------ joueur : état
  setTime(t: number): void {
    let v = t;
    while (v >= 24000) {
      v -= 24000;
      this.meta.day++;
    }
    while (v < 0) v += 24000;
    this.meta.time = v;
    this.daylight = this.computeDaylight();
    this.net?.sendTime(this.meta.time, this.meta.day);
  }

  setGameMode(m: GameMode): void {
    this.player.gameMode = m;
    if (m !== 'creative' && m !== 'spectator') this.player.flying = false;
    if (m === 'spectator') this.player.flying = true;
    this.applyModeRules();
  }

  setDifficulty(d: Difficulty): void {
    this.meta.difficulty = d;
    this.applyModeRules();
    if (d === 'peaceful') for (const e of this.entities.list) if (e instanceof Mob && e.def.kind === 'hostile' && !e.isBoss) e.remove();
  }

  setRule<K extends keyof GameRules>(k: K, v: GameRules[K]): void {
    this.meta.rules[k] = v;
    this.applyModeRules();
  }

  /** Répercute mode, difficulté et règles sur le joueur. */
  applyModeRules(): void {
    const p = this.player;
    const r = this.meta.rules;
    p.difficulty = this.meta.difficulty;
    p.keepInventory = r.keepInventory;
    p.naturalRegeneration = r.naturalRegeneration;
    p.fallDamageEnabled = r.fallDamage;
    p.drowningEnabled = r.drowningDamage;
    p.fireDamageEnabled = r.fireDamage;
  }

  teleport(x: number, y: number, z: number): void {
    const p = this.player;
    if (p.vehicle) this.dismount(p);
    p.pos.set(x, y, z);
    p.prevPos.copy(p.pos);
    p.vel.set(0, 0, 0);
    p.fallDistance = 0;
  }

  private onPlayerDamage(amount: number, src: DamageSource): void {
    if (amount <= 0) return;
    this.hud.flashDamage();
    const now = performance.now();
    if (now - this.lastHurtSound > 300) {
      this.audio('hurt', this.player.pos);
      this.lastHurtSound = now;
    }
    if (this.app.settings.data.vibration) {
      this.app.vibrate(Math.min(120, 30 + amount * 10));
      this.app.input.rumble(150, Math.min(1, 0.3 + amount / 10));
    }
    if (src.type === 'fall') this.app.audio.material('stone', 'hit', { x: this.player.pos.x, y: this.player.pos.y, z: this.player.pos.z });
    this.sleepTicks = 0;
  }

  private lastDeathMessage = '';
  /** Niveau d'expérience au moment de la mort (affiché sur l'écran de mort). */
  deathScore = 0;

  private onPlayerDeath(src: DamageSource): void {
    const p = this.player;
    const killer = src.attacker && src.attacker !== p ? ((src.attacker as Mob).def?.name ?? (src.attacker as unknown as { name?: string }).name ?? '') : '';
    let msg = `${p.name} ${DEATH_MESSAGES[src.type] ?? 'est mort(e)'}`;
    if (killer && (src.type === 'attack' || src.type === 'projectile' || src.type === 'explosion')) msg += ` par ${killer}`;
    this.lastDeathMessage = msg;
    if (this.meta.rules.showDeathMessages) this.message(msg);
    this.audio('death', p.pos);
    if (p.vehicle) this.dismount(p);
    this.deathShown = false;
    this.deathTimer = 0;
    this.interaction.reset();
    this.deathScore = p.xpLevel;
    if (!this.meta.rules.keepInventory && !p.creative) {
      for (const s of p.takeDrops()) {
        const v = new THREE.Vector3((Math.random() - 0.5) * 0.4, 0.2 + Math.random() * 0.2, (Math.random() - 0.5) * 0.4);
        this.entities.dropItem(this, p.pos.x, p.pos.y + 1, p.pos.z, s, v);
      }
      const xp = Math.min(100, p.xpLevel * 7);
      if (xp > 0) this.dropXp(p.pos.x, p.pos.y + 0.5, p.pos.z, xp);
      p.xpLevel = 0;
      p.xpProgress = 0;
      p.totalXp = 0;
      p.inventory.changed();
    }
    this.net?.sendChat(msg, true);
  }

  /** Réapparition après la mort (lit ou point d'apparition du monde). */
  async respawn(): Promise<void> {
    const p = this.player;
    p.respawnReset();
    this.deathShown = false;
    let spawn = this.meta.spawn ?? this.findSpawn();
    let bedOk = false;
    if (p.spawnPoint) {
      spawn = p.spawnPoint;
      bedOk = true;
    }
    if (this.dimension !== 0) await this.changeDimension(0, null, spawn);
    else this.teleport(spawn[0], spawn[1], spawn[2]);
    // Lit détruit ou point obstrué : retour au point du monde
    await this.waitForChunks('Réapparition');
    if (bedOk && p.spawnPoint) {
      const [bx, by, bz] = p.spawnPoint;
      const near = this.world.id(Math.floor(bx), Math.floor(by), Math.floor(bz));
      if (BLOCKS[near]?.solid && BLOCKS[near]?.interact !== 'bed') {
        this.message('Votre lit était manquant ou obstrué.');
        p.spawnPoint = null;
        const s = this.meta.spawn ?? this.findSpawn();
        this.teleport(s[0], s[1], s[2]);
      }
    }
    if (this.insideSolid()) this.placeOnGround(false);
    p.prevPos.copy(p.pos);
    this.app.screens.closeLoading();
    this.app.touch.reset();
  }

  // ------------------------------------------------------------------ sommeil
  sleep(x: number, y: number, z: number): void {
    const p = this.player;
    if (this.dimension !== 0) {
      this.message('Le lit est instable ici…');
      this.explode(x + 0.5, y + 0.5, z + 0.5, 5, null, true, true);
      return;
    }
    p.spawnPoint = [x + 0.5, y + 0.6, z + 0.5];
    this.message('Point d’apparition défini.');
    const t = this.meta.time;
    const night = t >= 12542 && t <= 23460;
    if (!night && this.weather.state !== 'thunder') {
      this.message('Vous ne pouvez dormir que la nuit ou pendant un orage.');
      return;
    }
    const monsters = this.entities.near(p.pos, 8).some((e) => e instanceof Mob && e.def.kind === 'hostile' && !e.dead);
    if (monsters && !p.creative) {
      this.message('Vous ne pouvez pas dormir, des monstres rôdent.');
      return;
    }
    if (this.net) {
      this.message('Le sommeil n’est pas disponible en multijoueur.');
      return;
    }
    this.sleepTicks = 1;
    this.sleepPos = [x + 0.5, y + 0.6, z + 0.5];
    this.audio('sleep');
  }

  private sleepPos: [number, number, number] = [0, 0, 0];

  private tickSleep(): void {
    const p = this.player;
    p.baseTick();
    p.pos.set(this.sleepPos[0], this.sleepPos[1], this.sleepPos[2]);
    p.prevPos.copy(p.pos);
    p.vel.set(0, 0, 0);
    this.sleepTicks++;
    if (this.sleepTicks === 100) {
      this.setTime(24000);
      this.meta.time = 0;
      if (this.weather.state !== 'clear') this.weather.set('clear', 12000 + Math.random() * 60000);
      this.message(`Jour ${this.meta.day + 1}`);
    }
    if (this.sleepTicks > 110 || this.app.input.state.jump || this.app.input.state.sneak) {
      this.sleepTicks = 0;
      p.pos.y += 0.6;
      p.prevPos.copy(p.pos);
    }
  }

  // ------------------------------------------------------------------ montures et véhicules
  mount(rider: Entity, vehicle: Entity): void {
    if (rider.vehicle) this.dismount(rider);
    if (vehicle.passenger) return;
    rider.vehicle = vehicle;
    vehicle.passenger = rider;
    if (vehicle instanceof Vehicle) vehicle.rider = rider;
    if (vehicle instanceof Mob) vehicle.riderCtl = { f: 0, s: 0, jump: false, yaw: vehicle.yaw };
    rider.vel.set(0, 0, 0);
    if (rider === this.player) this.interaction.reset();
  }

  dismount(rider: Entity): void {
    const v = rider.vehicle;
    if (!v) return;
    rider.vehicle = null;
    v.passenger = null;
    if (v instanceof Vehicle) v.rider = null;
    if (v instanceof Mob) v.riderCtl = null;
    // Descendre à côté si possible
    const w = this.world;
    const spots: Array<[number, number]> = [
      [1.2, 0],
      [-1.2, 0],
      [0, 1.2],
      [0, -1.2],
    ];
    let placed = false;
    for (const [dx, dz] of spots) {
      const x = Math.floor(v.pos.x + dx);
      const z = Math.floor(v.pos.z + dz);
      const y = Math.floor(v.pos.y + 0.5);
      if (!w.def(x, y, z).solid && !w.def(x, y + 1, z).solid) {
        rider.pos.set(v.pos.x + dx, v.pos.y + 0.5, v.pos.z + dz);
        placed = true;
        break;
      }
    }
    if (!placed) rider.pos.set(v.pos.x, v.pos.y + v.height + 0.1, v.pos.z);
    rider.prevPos.copy(rider.pos);
    rider.vel.set(0, 0, 0);
    rider.fallDistance = 0;
  }

  private tickRiding(sneakEdge: boolean): void {
    const p = this.player;
    const v = p.vehicle!;
    p.baseTick();
    if (v.removed || v.dead) {
      this.dismount(p);
      return;
    }
    if (sneakEdge) {
      this.dismount(p);
      return;
    }
    const st = this.app.input.state;
    if (v instanceof Vehicle) v.steer(st.moveZ, st.moveX, st.jump, st.sneak, p.yaw);
    else if (v instanceof Mob && v.riderCtl) Object.assign(v.riderCtl, { f: st.moveZ, s: st.moveX, jump: st.jump, yaw: p.yaw });
    p.updateEnvironment();
    p.fallDistance = 0;
  }

  private syncRider(): void {
    const p = this.player;
    const v = p.vehicle;
    if (!v) return;
    const seat = v instanceof Vehicle ? v.seatY : v.height * 0.75;
    p.prevPos.copy(p.pos);
    p.pos.set(v.pos.x, v.pos.y + seat - 0.6, v.pos.z);
    // Interpolation cohérente avec le véhicule
    p.prevPos.set(v.prevPos.x, v.prevPos.y + seat - 0.6, v.prevPos.z);
    p.onGround = true;
  }

  // ------------------------------------------------------------------ ascenseurs, plaques, portails
  private tickElevator(jumpEdge: boolean, sneakEdge: boolean): void {
    const p = this.player;
    if (!jumpEdge && !sneakEdge) return;
    const x = Math.floor(p.pos.x);
    const y = Math.floor(p.pos.y - 0.1);
    const z = Math.floor(p.pos.z);
    if (this.world.id(x, y, z) !== B.elevator) return;
    const dir = jumpEdge ? 1 : -1;
    for (let k = 2; k <= 32; k++) {
      const ty = y + k * dir;
      if (ty < 1 || ty > WORLD_HEIGHT - 3) break;
      if (this.world.id(x, ty, z) === B.elevator && !this.world.def(x, ty + 1, z).solid && !this.world.def(x, ty + 2, z).solid) {
        p.pos.y = ty + 1;
        p.prevPos.y = p.pos.y;
        p.vel.y = 0;
        p.fallDistance = 0;
        this.audio('elevator', p.pos);
        return;
      }
    }
  }

  private checkPlates(): void {
    if (this.tickCount % 2) return;
    const check = (e: Entity) => {
      const x = Math.floor(e.pos.x);
      const y = Math.floor(e.pos.y + 0.05);
      const z = Math.floor(e.pos.z);
      const id = this.world.id(x, y, z);
      if (id === B.stone_pressure_plate || id === B.oak_pressure_plate) this.power.stepOn(x, y, z);
    };
    if (!this.player.dead && this.player.gameMode !== 'spectator') check(this.player);
    for (const e of this.entities.list) if (e.living && !e.dead && !e.removed && e.onGround) check(e);
  }

  entitiesOn(x: number, y: number, z: number): boolean {
    const inside = (e: Entity) => Math.floor(e.pos.x) === x && Math.floor(e.pos.y + 0.05) === y && Math.floor(e.pos.z) === z;
    if (!this.player.dead && this.player.gameMode !== 'spectator' && inside(this.player)) return true;
    for (const e of this.entities.near(this.tmpVec.set(x + 0.5, y, z + 0.5), 2)) if ((e.living || e.type === 'item') && !e.removed && inside(e)) return true;
    return false;
  }

  private checkPortal(): void {
    const p = this.player;
    if (p.dead || this.changingDim) return;
    const w = this.world;
    const x = Math.floor(p.pos.x);
    const z = Math.floor(p.pos.z);
    const kind = portalKindOf(w.id(x, Math.floor(p.pos.y + 0.1), z)) ?? portalKindOf(w.id(x, Math.floor(p.pos.y + 1), z));
    if (!kind) {
      this.portalBlocked = false;
      this.portalTime = Math.max(0, this.portalTime - 4);
      return;
    }
    if (this.portalBlocked) return;
    this.portalKind = kind;
    if (this.portalTime === 0) this.audio('portal', p.pos, 0.6);
    this.portalTime++;
    const needed = p.creative ? 10 : 80;
    if (this.portalTime >= needed) {
      this.portalTime = 0;
      this.portalBlocked = true;
      if (!this.meta.experiments.dimensions) {
        this.message('Les dimensions sont désactivées dans ce monde.');
        return;
      }
      const target = portalTarget(kind, this.dimension);
      void this.changeDimension(target, kind);
    }
  }

  tryCreatePortal(x: number, y: number, z: number, kind: PortalKind): boolean {
    if (!this.meta.experiments.dimensions) {
      this.message('Activez l’expérience « Dimensions » pour utiliser les portails.');
      return false;
    }
    const ok = tryLightPortal(this.world, x, y, z, kind);
    if (ok) {
      this.audio('portal', { x: x + 0.5, y: y + 0.5, z: z + 0.5 }, 1);
      this.particles.magic(x + 0.5, y + 1, z + 0.5, kind === 'sky' ? 0x80d0ff : 0xb040ff, 24);
    }
    return ok;
  }

  /** Change de dimension (portail, commande ou réapparition). */
  async changeDimension(target: number, via: PortalKind | null, at?: [number, number, number]): Promise<void> {
    if (this.changingDim || target === this.dimension) {
      if (at) this.teleport(at[0], at[1], at[2]);
      return;
    }
    this.changingDim = true;
    const p = this.player;
    const from = this.dimension;
    if (p.vehicle) this.dismount(p);
    this.app.screens.loading(`Voyage vers : ${DIMENSION_NAMES[target]}`, 0, false);
    this.audio('portal_travel');
    await this.save(false);
    // Coordonnées d'arrivée
    let x = p.pos.x;
    let z = p.pos.z;
    if (via) [x, z] = convertCoords(via, from, target, Math.floor(p.pos.x), Math.floor(p.pos.z));
    if (at) {
      x = at[0];
      z = at[2];
    }
    this.entities.clear();
    this.entityChunks.clear();
    this.bossEntity = null;
    this.hud.boss(null);
    this.ticks.clear();
    this.dimension = target;
    p.dimension = target;
    this.chunks.reset(target, true);
    p.pos.set(x + 0.5, at ? at[1] : 100, z + 0.5);
    p.prevPos.copy(p.pos);
    p.vel.set(0, 0, 0);
    p.fallDistance = 0;
    await this.waitForChunks('Chargement de la dimension');
    if (this.disposed) return;
    if (via) {
      const fx = Math.floor(x);
      const fz = Math.floor(z);
      const found = findPortal(this.world, via, fx, fz, 16);
      if (found) p.pos.set(found[0] + 0.5, found[1], found[2] + 0.5);
      else {
        const s = buildPortal(this.world, via, target, fx, fz);
        p.pos.set(s[0], s[1], s[2]);
      }
      this.portalBlocked = true;
    } else if (!at) {
      if (target === 0) {
        const s = this.meta.spawn ?? this.findSpawn();
        p.pos.set(s[0], s[1], s[2]);
      } else this.placeOnGround(false);
      if (this.insideSolid() || target === 2) {
        const h = this.world.height(Math.floor(p.pos.x), Math.floor(p.pos.z));
        if (h < 5) {
          // Royaume céleste sans île ici : petite plateforme de nuages
          const bx = Math.floor(p.pos.x);
          const bz = Math.floor(p.pos.z);
          for (let i = -2; i <= 2; i++) for (let k = -2; k <= 2; k++) this.world.set(bx + i, 99, bz + k, B.cloud, 0, 'player');
          p.pos.y = 100;
        } else p.pos.y = h + 1;
      }
    } else if (this.insideSolid()) this.placeOnGround(false);
    p.prevPos.copy(p.pos);
    this.meta.dimension = target;
    this.changingDim = false;
    this.app.screens.closeLoading();
    this.app.audio.setMood(target === 1 ? 'ember' : target === 2 ? 'sky' : 'day');
    this.hud.title(DIMENSION_NAMES[target], '', 3);
    this.net?.sendDimension(target);
  }

  // ------------------------------------------------------------------ EntityHost
  entitiesNear(pos: THREE.Vector3, radius: number): Entity[] {
    const out = this.entities.near(pos, radius);
    if (!this.player.dead && this.player.gameMode !== 'spectator' && this.player.pos.distanceTo(pos) <= radius) out.push(this.player);
    if (this.net) for (const rp of this.net.remotePlayers()) if (rp.pos.distanceTo(pos) <= radius) out.push(rp);
    return out;
  }

  audio(name: string, pos?: THREE.Vector3 | { x: number; y: number; z: number }, volume?: number, pitch?: number): void {
    this.app.audio.play(name, { x: pos?.x, y: pos?.y, z: pos?.z, volume, pitch });
  }

  explode(x: number, y: number, z: number, power: number, source: Entity | null, breakBlocks: boolean, fire: boolean): void {
    explode(this, x, y, z, power, source, breakBlocks && this.meta.rules.mobGriefing !== false, fire);
  }

  spawnMob(type: string, x: number, y: number, z: number, opts?: Record<string, unknown>): Entity | null {
    if (!this.meta.experiments.bosses && ['ancient_golem', 'deep_guardian', 'ember_sovereign', 'sky_dragon'].includes(type) && !opts?.force) return null;
    return this.entities.spawnMob(this, type, x, y, z, opts);
  }

  spawnEntity(e: Entity, x: number, y: number, z: number): Entity {
    e.pos.set(x, y, z);
    e.prevPos.copy(e.pos);
    return this.entities.add(e, this);
  }

  dropItem(x: number, y: number, z: number, stack: ItemStack, vel?: THREE.Vector3): void {
    if (!stack || stack.count <= 0) return;
    this.entities.dropItem(this, x, y, z, { ...stack }, vel);
  }

  dropXp(x: number, y: number, z: number, amount: number): void {
    this.entities.dropXp(this, x, y, z, amount);
  }

  spawnProjectile(kind: string, owner: Entity | null, pos: THREE.Vector3, vel: THREE.Vector3): Entity | null {
    return this.entities.spawnProjectile(this, kind as never, owner, pos, vel);
  }

  strikeLightning(x: number, z: number): void {
    const y = this.world.height(Math.floor(x), Math.floor(z)) + 1;
    const l = new Lightning();
    this.spawnEntity(l, x, y, z);
    this.entities.lightningFlash = 1;
    const d = Math.hypot(this.player.pos.x - x, this.player.pos.z - z);
    window.setTimeout(() => this.audio('thunder', undefined, Math.max(0.2, 1 - d / 160)), Math.min(3000, d * 10));
  }

  bossDefeated(boss: Entity): void {
    if (!this.meta.bossesDefeated.includes(boss.type)) this.meta.bossesDefeated.push(boss.type);
    const name = (boss as Mob).def?.bossTitle ?? boss.type;
    this.hud.title('Victoire !', `${name} est vaincu(e)`, 5);
    this.audio('achievement');
    this.message(`§ ${name} a été vaincu(e) !`);
    this.bossEntity = null;
    this.hud.boss(null);
  }

  bossBar(entity: Entity | null, title?: string, progress?: number): void {
    if (!entity) {
      this.bossEntity = null;
      this.hud.boss(null);
      return;
    }
    this.bossEntity = entity;
    this.bossSeen = this.tickCount;
    this.hud.boss(title ?? entity.type, progress ?? 1);
  }

  awakenNearbyBoss(x: number, y: number, z: number): void {
    const near = this.entities.near(this.tmpVec.set(x + 0.5, y, z + 0.5), 32);
    let woke = false;
    for (const e of near) {
      const b = e as unknown as { dormant?: boolean; wake?: () => void; isBoss?: boolean };
      if (b.isBoss && b.dormant && b.wake) {
        b.wake();
        woke = true;
        this.audio('roar', e.pos, 1.5);
        this.message(`§ ${(e as Mob).def.bossTitle} se réveille !`);
      }
    }
    if (!woke) this.message('Le cœur antique pulse faiblement… rien ne répond.');
  }

  igniteTnt(x: number, y: number, z: number, fuse = 80): void {
    if (this.world.id(x, y, z) === B.tnt) this.world.set(x, y, z, 0, 0, 'tick');
    const t = new PrimedTnt(null);
    t.fuse = fuse;
    t.vel.set((Math.random() - 0.5) * 0.04, 0.2, (Math.random() - 0.5) * 0.04);
    this.spawnEntity(t, x + 0.5, y, z + 0.5);
    this.audio('fuse', { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
  }

  message(text: string): void {
    this.hud.message(text);
  }

  isRaining(): boolean {
    return this.weather.rain > 0.2 && this.dimension === 0;
  }

  // ------------------------------------------------------------------ sauvegarde
  /** Sauvegarde atomique de la partie (métadonnées, joueur, tronçons modifiés, entités). */
  async save(final: boolean): Promise<void> {
    if (this.net) return;
    if (this.saving) {
      await this.saving;
      if (!final) return;
    }
    const run = async () => {
      const meta = this.meta;
      meta.weather = { state: this.weather.state, timer: Math.floor(this.weather.timer) };
      meta.dimension = this.dimension;
      meta.playTime += this.playClock;
      this.playClock = 0;
      meta.spawnedMarkers = [...this.spawnedMarkers];
      const chunks: Array<{ dim: number; cx: number; cz: number; blocks: Uint16Array; biomes: Uint8Array; be: Map<number, BlockEntity> }> = [...this.unloadedDirty.values()];
      const saved = new Set(this.unloadedDirty.keys());
      for (const c of this.chunks.chunks.values()) {
        if (!c.ready || !c.modified) continue;
        chunks.push({ dim: c.dim, cx: c.cx, cz: c.cz, blocks: c.blocks.slice(), biomes: c.biomes, be: new Map(c.blockEntities) });
        c.modified = false;
      }
      const ents = this.entities.collectAll(this.dimension);
      for (const k of this.entityChunks) if (!ents.has(k) && this.chunks.chunks.has(k.split('|')[1])) ents.set(k, []);
      try {
        await this.app.saves.saveAll(meta, this.player.serialize(), chunks, ents);
        for (const k of saved) this.unloadedDirty.delete(k);
        for (const k of ents.keys()) {
          this.entities.pendingSaves.delete(k);
          if (ents.get(k)!.length) this.entityChunks.add(k);
        }
      } catch (e) {
        console.error('Échec de la sauvegarde', e);
        // Les tronçons restent marqués pour la prochaine tentative
        for (const c of chunks) {
          const live = this.chunks.get(c.cx, c.cz);
          if (live && c.dim === this.dimension) live.modified = true;
        }
        this.message('⚠ La sauvegarde a échoué (stockage plein ?).');
      }
    };
    this.saving = run();
    try {
      await this.saving;
    } finally {
      this.saving = null;
    }
  }

  /** Quitte la partie : sauvegarde puis libère les ressources. */
  async quit(): Promise<void> {
    if (this.player.dead && !this.meta.rules.keepInventory) {
      /* le joueur réapparaîtra au prochain chargement */
    }
    if (this.player.dead) this.player.respawnReset();
    await this.save(true);
    this.net?.disconnect();
    this.dispose();
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    const r = this.app.renderer;
    this.chunks.dispose();
    this.entities.clear();
    this.entities.dropView(this.player);
    r.terrain.remove(this.chunks.root);
    r.entities.remove(this.entities.group);
    r.effects.remove(this.particles.points, this.selection.object, this.breakOverlay.mesh, this.weather.group);
    this.particles.clear();
    this.hud.el.remove();
    this.app.audio.stopAll();
    r.fovBoost = 0;
  }

  /** Objets connus (recettes débloquées) — tous en créatif. */
  knownItems(): Set<string> {
    if (this.player.creative) return new Set(ITEMS.filter(Boolean).map((i) => i.key));
    // Tout objet présent dans l'inventaire compte comme découvert (coffres, commandes, échanges…)
    for (const s of this.player.inventory.slots) if (s) this.player.noteItem(s);
    return this.player.seenItems;
  }
}

const tmpColor = new THREE.Color();
