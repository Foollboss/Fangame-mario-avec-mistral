/**
 * Session de jeu côté client : relie la simulation (solo) ou le serveur
 * (multijoueur) au streaming des colonnes, au rendu, à l'interface, à l'audio
 * et aux sauvegardes.
 */
import * as THREE from 'three';
import type { Content } from '../registry/content';
import type { World } from '../world/world';
import { WorkerPool, LocalWorker } from '../engine/workerPool';
import { createWorldHandler } from '../workers/worldHandler';
import { ChunkStreamer } from '../world/chunkStreamer';
import { ChunkRenderer } from '../render/chunkRenderer';
import type { BlockAtlas } from '../render/atlas';
import type { InputManager } from '../input/input';
import { SkyRenderer } from '../render/sky';
import { ParticleSystem } from '../render/particles';
import { WeatherRenderer } from '../render/weather';
import { EntityRenderer } from '../render/entities';
import { HeldItemRenderer } from '../render/heldItem';
import { BlockHighlight } from '../render/highlight';
import { ItemModels } from '../render/itemModels';
import type { IconFactory } from '../render/icons';
import { BIOMES } from '../worldgen/biomes';
import { Sim, TICK } from '../sim/sim';
import { Player } from '../entity/player';
import type { WorldMeta, WorldStorage } from '../save/storage';
import { createGenerator, DIMENSION_INFO, type DimensionId } from '../worldgen/generator';
import { PlayerController } from './controller';
import { ParticleFx } from './fx';
import type { SimEvent } from '../sim/events';
import type { UIManager, Screen } from '../ui/ui';
import { Hud } from '../ui/hud';
import { ChatLog, chatInput } from '../ui/chat';
import type { Settings } from '../app/settings';
import type { AudioEngine, Mood } from '../audio/audio';
import { PlayerInventoryScreen, WorkbenchScreen, ChestScreen, FurnaceScreen, CreativeScreen, type InvContext } from '../ui/inventoryUI';
import { blockContainer, type FurnaceData, type ChestData } from '../sim/furnace';
import { throwStack, lookFacing } from '../sim/interact';
import { runCommand, completeCommand } from '../sim/commands';
import { Grave } from '../entity/grave';
import { deathScreen, pauseScreen, statsScreen, lanInfoScreen, type LoadingHandle } from '../ui/screens/menus';
import { h } from '../ui/dom';
import type { LivingEntity } from '../entity/living';
import { installGameModules } from './modules';
import { advancementsScreen } from '../ui/advancementsUI';
import type { RemoteSession } from '../net/client';
import { t, getLang, WEATHER_LABEL } from '../i18n/i18n';

export function createWorkerPool(forceLocal = false): WorkerPool {
  const n = Math.max(2, Math.min(4, (navigator.hardwareConcurrency || 4) - 1));
  // Version « fichier unique » : le code du worker est fourni par la page (URL blob:)
  const inline = (globalThis as { __VOXERRA_WORKER__?: string }).__VOXERRA_WORKER__;
  if (!forceLocal) {
    try {
      // le worker intégré est un script classique (accepté aussi depuis un fichier local)
      return new WorkerPool(() => (inline ? new Worker(inline) : new Worker(new URL('../workers/worldWorker.ts', import.meta.url), { type: 'module' })), n);
    } catch (e) {
      console.warn('Workers indisponibles, génération sur le fil principal :', e);
    }
  }
  return new WorkerPool(() => new LocalWorker(createWorldHandler as never) as unknown as Worker, 1, true);
}

export interface GameHost {
  renderer: THREE.WebGLRenderer;
  input: InputManager;
  ui: UIManager;
  settings: Settings;
  audio: AudioEngine;
  content: Content;
  atlas: BlockAtlas;
  icons: IconFactory;
  pool: WorkerPool;
  storage: WorldStorage;
  quitToTitle(): void;
  version: string;
}

export class Game {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly sim: Sim;
  readonly player: Player;
  world!: World;
  streamer!: ChunkStreamer;
  readonly chunkRenderer: ChunkRenderer;
  readonly sky: SkyRenderer;
  readonly particles: ParticleSystem;
  readonly weather = new WeatherRenderer();
  readonly entities: EntityRenderer;
  readonly items: ItemModels;
  readonly held: HeldItemRenderer;
  readonly highlight = new BlockHighlight();
  readonly controller: PlayerController;
  readonly hud: Hud;
  readonly chat = new ChatLog();
  readonly fx: ParticleFx;
  private tickAcc = 0;
  private saveTimer = 60;
  private saving: Promise<void> | null = null;
  private travelling: { dim: string; x: number; y: number; z: number; mode: 'portal' | 'altar' | 'exact'; portal?: string; t: number } | null = null;
  private deathShown = false;
  showDebug = false;
  hideHud = false;
  boss: { id: number; name: string; hp: number; max: number; t: number } | null = null;
  private fpsFrames = 0;
  private fpsTime = 0;
  private fps = 0;
  private hurtFlash = 0;
  private lastHealth = 20;
  private thumbnailWanted = false;
  private disposed = false;
  private biomeFog = new THREE.Color();
  private biomeSky = new THREE.Color();
  private lastTick = 0;
  private generator: ReturnType<typeof createGenerator> | null = null;
  remote: RemoteSession | null = null;
  readonly isNew: boolean;

  constructor(
    readonly host: GameHost,
    readonly meta: WorldMeta,
    isNew: boolean,
  ) {
    this.isNew = isNew;
    this.camera = new THREE.PerspectiveCamera(host.settings.fov, innerWidth / innerHeight, 0.05, 1200);
    this.camera.rotation.order = 'YXZ';
    this.sim = new Sim(host.content, meta);
    this.player = new Player(host.content.items, host.settings.playerName);
    this.chunkRenderer = new ChunkRenderer(host.atlas);
    this.scene.add(this.chunkRenderer.group);
    this.sky = new SkyRenderer(meta.seed);
    this.sky.attach(this.scene);
    this.particles = new ParticleSystem(host.atlas.texture);
    this.scene.add(this.particles.mesh);
    this.scene.add(this.weather.mesh);
    this.scene.add(this.highlight.group);
    this.items = new ItemModels(host.content, host.icons, this.chunkRenderer);
    this.entities = new EntityRenderer(host.content.creatures, this.items);
    this.scene.add(this.entities.group);
    this.held = new HeldItemRenderer(this.items);
    this.fx = new ParticleFx(this.particles, host.content);
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const game = this;
    this.controller = new PlayerController({
      sim: this.sim,
      player: this.player,
      input: host.input,
      settings: host.settings,
      openBlockUI: (r) => this.openBlockUI(r as { ui: 'chest' | 'furnace' | 'craft' | 'forge'; x: number; y: number; z: number }),
      playSound: (n, x, y, z, vol) => host.audio.play(n, { x, y, z, vol }),
      onBlockEdited: (x, y, z) => this.streamer.flushAround(x, y, z),
      uiOpen: () => host.ui.open || !!this.travelling,
      get remote() {
        return game.remote ?? undefined;
      },
    });
    this.hud = new Hud(host.icons, host.content);
    this.sim.on((e) => this.onSimEvent(e));
    installGameModules(this.sim, this);
  }

  get content(): Content {
    return this.host.content;
  }

  // ------------------------------------------------------------------ chargement
  async load(loading: LoadingHandle): Promise<void> {
    const p = this.player;
    const meta = this.meta;
    if (meta.player) p.load(meta.player as Record<string, unknown>);
    else {
      p.gameMode = meta.gameMode === 'hardcore' ? 'survie' : meta.gameMode;
      if (meta.gameMode === 'creatif') p.flying = false;
    }
    if (meta.gameMode === 'hardcore' && p.gameMode !== 'spectateur') p.gameMode = 'survie';
    p.name = this.host.settings.playerName;
    p.displayName = p.name;
    this.sim.addPlayer(p);
    this.entities.localPlayerId = p.id;
    this.enterDimension(p.dim);
    if (this.isNew || !meta.spawn) {
      loading.set(t('Recherche d’un point d’apparition…'), 0, 1);
      const gen = createGenerator('surface', meta.seed, this.content);
      const sp = gen.findSpawn();
      meta.spawn = { x: sp.x + 0.5, y: sp.y, z: sp.z + 0.5 };
      p.setPos(meta.spawn.x, sp.y + 1, meta.spawn.z);
      p.dim = 'surface';
    }
    // attente des colonnes autour du joueur
    const r = Math.min(4, this.streamer.radius);
    const t0 = performance.now();
    await new Promise<void>((resolve) => {
      const step = () => {
        if (this.disposed) return resolve();
        this.streamer.update(p.x, p.z, 16);
        this.streamer.updateMeshes(p.x, p.y, p.z);
        const pr = this.streamer.progress(Math.floor(p.x / 16), Math.floor(p.z / 16), r);
        const label = this.isNew ? t('Génération du terrain…') : t('Chargement du monde…');
        loading.set(label, pr.done, pr.total);
        loading.map((g, size) => this.drawChunkMap(g, size));
        const meshed = this.streamer.pendingMeshes < 40 || performance.now() - t0 > 25000;
        if (pr.done >= pr.total && meshed) resolve();
        else setTimeout(step, 50);
      };
      step();
    });
    // premier placement : au sol
    if (this.isNew) {
      const gy = this.world.findGround(Math.floor(p.x), Math.floor(p.z));
      if (gy > 0) {
        p.setPos(p.x, gy + 1, p.z);
        meta.spawn = { x: p.x, y: gy + 1, z: p.z };
      }
      if (meta.bonusChest) this.placeBonusChest();
      this.chat.add(t('Bienvenue dans « {name} » !', { name: meta.name }), '#ffe080');
      this.chat.add(t('Astuce : appuyez sur E pour l’inventaire et le livre de recettes. /aide pour les commandes.'), '#c0c0c0');
      await this.save();
    } else {
      // sécurité : ne pas réapparaître dans un bloc
      const w = this.world;
      const bt = w.content.blocks;
      let guard = 0;
      while (guard++ < 200 && (bt.solid[w.getId(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z))] || bt.solid[w.getId(Math.floor(p.x), Math.floor(p.y + 1), Math.floor(p.z))])) p.setPos(p.x, p.y + 1, p.z);
      this.chat.add(t('Bon retour dans « {name} ».', { name: meta.name }), '#ffe080');
    }
    this.lastHealth = p.health;
    if (p.dead) this.showDeath();
  }

  /** Chargement d'une partie multijoueur (état fourni par le serveur). */
  async loadRemote(loading: LoadingHandle, session: RemoteSession): Promise<void> {
    this.remote = session;
    const p = this.player;
    const w = session.welcome;
    p.load(w.player);
    p.id = w.id;
    p.name = this.host.settings.playerName;
    p.displayName = p.name;
    this.sim.difficulty = w.world.difficulty;
    this.sim.env.time = w.world.time;
    Object.assign(this.sim.rules, w.world.rules);
    this.sim.addPlayer(p);
    this.entities.localPlayerId = p.id;
    this.enterDimension(p.dim);
    session.attach(this);
    const t0 = performance.now();
    await new Promise<void>((resolve, reject) => {
      const step = () => {
        if (this.disposed) return resolve();
        if (session.closed) return reject(new Error(t('Connexion interrompue pendant le chargement.')));
        session.update(0.05);
        this.streamer.updateMeshes(p.x, p.y, p.z);
        const pr = this.streamer.progress(Math.floor(p.x / 16), Math.floor(p.z / 16), Math.min(3, this.streamer.radius));
        loading.set(t('Réception du terrain…'), pr.done, pr.total);
        loading.map((g, size) => this.drawChunkMap(g, size));
        if ((pr.done >= pr.total && this.streamer.pendingMeshes < 40) || performance.now() - t0 > 30000) resolve();
        else setTimeout(step, 50);
      };
      step();
    });
    this.chat.add(t(w.motd), '#ffe080');
    this.chat.add(t('Connecté à « {name} » — {n} joueur(s).', { name: w.world.name, n: session.players.length || 1 }), '#c0c0c0');
    this.lastHealth = p.health;
  }

  /** Changement de dimension décidé par le serveur. */
  remoteDimension(dim: string, x: number, y: number, z: number): void {
    const p = this.player;
    p.dim = dim;
    p.setPos(x, y, z);
    p.body.vx = p.body.vy = p.body.vz = 0;
    p.body.fallDist = 0;
    this.enterDimension(dim);
    const info = DIMENSION_INFO[dim as DimensionId];
    this.hud.toast(t('Nouvelle dimension'), info?.name ?? dim, dimIcon(dim));
  }

  private drawChunkMap(g: CanvasRenderingContext2D, size: number): void {
    const p = this.player;
    const pcx = Math.floor(p.x / 16),
      pcz = Math.floor(p.z / 16);
    const R = 10;
    const cell = size / (R * 2 + 1);
    g.fillStyle = '#8a8a8a';
    g.fillRect(0, 0, size, size);
    for (let dz = -R; dz <= R; dz++)
      for (let dx = -R; dx <= R; dx++) {
        const c = this.world.getChunk(pcx + dx, pcz + dz);
        if (!c) continue;
        const b = BIOMES[c.biomes[8 * 16 + 8]];
        g.fillStyle = b ? (b.top === 'sable' || b.top === 'sable_ocre' ? '#d8c890' : b.id.startsWith('ocean') || b.id.startsWith('riviere') ? '#4a78d0' : b.top === 'neige' || b.precip === 'snow' ? '#e8f0f8' : b.grass) : '#6ade4a';
        g.fillRect((dx + R) * cell, (dz + R) * cell, cell - 0.5, cell - 0.5);
      }
    g.fillStyle = '#fff';
    g.fillRect(R * cell + cell / 4, R * cell + cell / 4, cell / 2, cell / 2);
  }

  private placeBonusChest(): void {
    const p = this.player;
    const x = Math.floor(p.x) + 2,
      z = Math.floor(p.z) + 1;
    const y = this.world.findGround(x, z) + 1;
    if (y <= 0) return;
    const chest = this.content.blocks.tryNum('coffre');
    this.world.setBlock(x, y, z, chest);
    const slots: ({ id: string; count: number } | null)[] = new Array(27).fill(null);
    [
      { id: 'pain', count: 6 },
      { id: 'buche_chene', count: 8 },
      { id: 'pioche_pierre', count: 1 },
      { id: 'hache_pierre', count: 1 },
      { id: 'torche', count: 12 },
      { id: 'pomme', count: 4 },
    ].forEach((s, i) => (slots[i * 3] = s));
    this.world.setBlockEntity(x, y, z, { type: 'chest', slots });
    this.world.setBlock(x, y - 1 < 0 ? 0 : y + 1, z, 0);
    this.world.setBlock(x + 1, y, z, this.content.blocks.tryNum('torche'));
  }

  /** Active le streaming d'une dimension. */
  enterDimension(dim: string): void {
    if (this.streamer) {
      this.streamer.unloadAll();
      this.chunkRenderer.clearAll();
      this.entities.clear();
      this.particles.clear();
    }
    this.world = this.sim.world(dim);
    this.world.trackDirty = true;
    this.streamer = new ChunkStreamer(this.world, this.host.pool, this.chunkRenderer, this.remote ? null : this.host.storage, this.remote ? null : this.meta.id);
    this.streamer.radius = this.remote ? this.remote.welcome.radius : this.host.settings.renderDistance;
    this.streamer.remote = !!this.remote;
    if (this.remote) this.remote.attachStreamer(this.streamer);
    this.streamer.hooks = {
      onLoaded: (c, gen, saved) => {
        if (this.remote) return;
        this.sim.restoreEntities(dim, saved);
        for (const ge of gen) this.sim.spawnFromGen?.(dim, ge);
      },
      onUnload: (c) => {
        if (this.remote) return [];
        const ents = this.sim.persistentEntitiesIn(dim, c.cx, c.cz);
        this.sim.unloadEntitiesIn(dim, c.cx, c.cz);
        return ents;
      },
    };
    this.generator = null;
  }

  generatorFor(dim: string): ReturnType<typeof createGenerator> {
    if (!this.generator || this.generator.dim !== dim) this.generator = createGenerator(dim, this.meta.seed, this.content);
    return this.generator;
  }

  // ------------------------------------------------------------------ évènements
  private onSimEvent(e: SimEvent): void {
    const a = this.host.audio;
    const p = this.player;
    switch (e.t) {
      case 'sound':
        if (e.x === undefined || this.sameDimPos()) a.play(e.id, { x: e.x, y: e.y, z: e.z, vol: e.vol, pitch: e.pitch });
        break;
      case 'particles':
        this.fx.emit(e.kind, e.x, e.y, e.z, e.n ?? 6, e.spread ?? 0.4, e.color);
        break;
      case 'blockBreakFx': {
        const id = e.cell & 0xfff;
        const info = this.content.blocks.get(id);
        const layer = this.content.blocks.faceTex[id * 6 + 0];
        const tint = this.content.blocks.tint[id] ? ([0.5, 0.75, 0.35] as [number, number, number]) : undefined;
        const l = this.world.getLight(e.x, e.y, e.z);
        const light = Math.max(((l >> 4) / 15) * this.sky.out.daylight, (l & 15) / 15, 0.2);
        this.particles.blockBreak(e.x, e.y, e.z, layer, tint, light, this.host.settings.particles === 'minimal' ? 4 : 16);
        a.play('casse_' + info.sound, { x: e.x + 0.5, y: e.y + 0.5, z: e.z + 0.5 });
        break;
      }
      case 'msg':
        if (e.to === undefined || e.to === p.id) this.chat.add(t(e.text, e.args), e.color);
        break;
      case 'toast':
        if (e.to === undefined || e.to === p.id) {
          this.hud.toast(t(e.title, e.args), t(e.text, e.args), e.icon);
          a.play('niveau');
        }
        break;
      case 'hurt':
        if (e.id === p.id) {
          this.hurtFlash = 0.6;
          this.controller.shake = 0.35;
          a.play('degat');
        } else {
          const ent = this.sim.entities.get(e.id) as (LivingEntity & { type?: string }) | undefined;
          if (ent?.type) a.play(`mob_${ent.type}_${ent.dead ? 'death' : 'hurt'}`, { x: ent.x, y: ent.y + 1, z: ent.z });
        }
        break;
      case 'lightning':
        a.play('eclair', { vol: 0.9 });
        this.fx.emit('eclair', e.x, e.y, e.z, 30, 0.5);
        break;
      case 'dimension':
        if (e.to === p.id) this.beginTravel(e.dim, e.x, e.y, e.z, e.mode, e.portal);
        break;
      case 'boss':
        if (e.gone) this.boss = null;
        else this.boss = { id: e.id, name: e.name, hp: e.hp, max: e.max, t: 3 };
        break;
      case 'swing': {
        const ent = this.sim.entities.get(e.id) as LivingEntity | undefined;
        if (ent) ent.swing = 1;
        break;
      }
      case 'shake':
        if (e.to === undefined || e.to === p.id) this.controller.shake = Math.max(this.controller.shake, e.amount);
        break;
    }
  }

  private sameDimPos(): boolean {
    return true;
  }

  // ------------------------------------------------------------------ voyages
  private beginTravel(dim: string, x: number, y: number, z: number, mode: 'portal' | 'altar' | 'exact', portal?: string): void {
    if (this.travelling) return;
    this.travelling = { dim, x, y, z, mode, portal, t: 0 };
    this.host.audio.play('portail_allume');
    this.chat.add(t('Voyage vers {dim}…', { dim: DIMENSION_INFO[dim as DimensionId]?.name ?? dim }), '#d8a8ff');
    this.save().then(() => {
      if (this.disposed || !this.travelling) return;
      const p = this.player;
      p.dim = dim;
      p.setPos(x + 0.5, y, z + 0.5);
      p.body.vx = p.body.vy = p.body.vz = 0;
      this.enterDimension(dim);
    });
  }

  private updateTravel(dt: number): void {
    const tr = this.travelling;
    if (!tr) return;
    tr.t += dt;
    const p = this.player;
    if (p.dim !== tr.dim || !this.streamer) return;
    this.streamer.update(p.x, p.z, 16);
    const pr = this.streamer.progress(Math.floor(tr.x / 16), Math.floor(tr.z / 16), 2);
    if (pr.done < pr.total && tr.t < 30) return;
    if (this.remote) {
      this.travelling = null;
      return;
    }
    const pos = this.sim.completeTravel(p, tr.dim, tr.x, tr.y, tr.z, tr.mode, tr.portal);
    p.setPos(pos.x, pos.y, pos.z);
    this.travelling = null;
    this.meta.dimension = tr.dim;
    for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) this.streamer.flushAround(Math.floor(pos.x) + dx * 3, Math.floor(pos.y), Math.floor(pos.z) + dz * 3);
    const info = DIMENSION_INFO[tr.dim as DimensionId];
    this.hud.toast(t('Nouvelle dimension'), info?.name ?? tr.dim, dimIcon(tr.dim));
  }

  // ------------------------------------------------------------------ interface
  invContext(onClose?: () => void): InvContext {
    return {
      content: this.content,
      icons: this.host.icons,
      player: this.player,
      drop: (s) => {
        if (this.remote) this.remote.dropStack(s);
        else throwStack(this.sim, this.player, s);
      },
      crafted: (item, count) => {
        this.player.stat('objets_fabriques', count);
        this.sim.trigger(this.player, 'craft', { item });
        this.sim.onItemObtained(this.player, item, 0);
        this.remote?.syncInventory();
      },
      sound: (n) => this.host.audio.play(n),
      onClose: () => {
        this.remote?.syncInventory();
        onClose?.();
      },
    };
  }

  openInventory(): void {
    const scr = this.player.creative ? new CreativeScreen(this.invContext()) : new PlayerInventoryScreen(this.invContext());
    this.pushGameScreen(scr.screen());
  }

  openBlockUI(r: { ui: 'chest' | 'furnace' | 'craft' | 'forge'; x: number; y: number; z: number }): void {
    const w = this.world;
    if (r.ui === 'craft' || r.ui === 'forge') {
      this.pushGameScreen(new WorkbenchScreen(this.invContext(), r.ui === 'forge').screen());
      return;
    }
    const data = w.getBlockEntity(r.x, r.y, r.z) as FurnaceData | ChestData | undefined;
    if (!data) return;
    const markDirty = () => {
      const c = w.chunkAtBlock(r.x, r.z);
      if (c) {
        c.dirty = true;
        c.modified = true;
      }
      this.remote?.syncBlockEntity(r.x, r.y, r.z);
    };
    if (data.type === 'chest' && (data as ChestData).loot) this.sim.trigger(this.player, 'loot', { table: (data as ChestData).loot });
    const box = blockContainer(this.sim, data, markDirty);
    markDirty();
    if (data.type === 'chest') this.pushGameScreen(new ChestScreen(this.invContext(() => this.host.audio.play('porte_ferme', { x: r.x, y: r.y, z: r.z, vol: 0.5 })), box, t('Coffre')).screen());
    else this.pushGameScreen(new FurnaceScreen(this.invContext(), data as FurnaceData, box).screen());
  }

  private pushGameScreen(s: Screen): void {
    this.host.input.unlock();
    this.host.ui.push(s);
  }

  openPause(): void {
    this.host.input.unlock();
    this.host.ui.push(
      pauseScreen(this.hostApi(), {
        advancements: () => this.host.ui.push(advancementsScreen(this.hostApi(), this.sim, this.player)),
        stats: () => this.host.ui.push(statsScreen(this.hostApi(), this.player.stats, this.meta.playTime)),
        saveQuit: () => this.host.quitToTitle(),
        lan: () => this.host.ui.push(lanInfoScreen(this.hostApi())),
        multiplayer: !!this.remote,
      }),
    );
  }

  /** Accès à l'API de l'application (écrans). */
  hostApi(): import('../app/api').AppApi {
    return (this.host as unknown as { api: import('../app/api').AppApi }).api;
  }

  /** Ouvre la saisie ; appelé depuis un geste tactile, le clavier du téléphone s'ouvre aussitôt. */
  openChat(initial: string): void {
    this.host.input.unlock();
    const scr = chatInput(
      this.chat,
      initial,
      (text) => this.sendChat(text),
      () => this.host.ui.pop(),
      (line) => completeCommand(this.sim, line, getLang()),
    );
    this.host.ui.push(scr);
    scr.focus();
  }

  sendChat(text: string): void {
    if (this.remote) {
      this.remote.chat(text);
      return;
    }
    if (text.startsWith('/')) {
      this.chat.add(text, '#a0a0a0');
      const r = runCommand(
        {
          sim: this.sim,
          locate: (type, dim, x, z) => this.generatorFor(dim).locateStructure?.(type, x, z) ?? null,
          summon: (type, dim, x, y, z) => this.sim.summon?.(type, dim, x, y, z) ?? false,
          solo: true,
        },
        this.player,
        text,
      );
      for (const l of r.out) if (l) this.chat.add(l, r.ok ? '#e0e0e0' : '#ff8080');
    } else this.chat.add(t('<{name}> {msg}', { name: this.player.name, msg: text }));
  }

  private showDeath(): void {
    if (this.deathShown) return;
    this.deathShown = true;
    const p = this.player;
    this.host.input.unlock();
    this.host.audio.play('mort');
    // Tombe ou inventaire conservé
    if (!this.remote && !this.sim.rules.keepInventory && !p.creative) {
      const items = p.inventory.dropAll();
      if (items.length) {
        const g = new Grave(p.name, items);
        g.dim = p.dim;
        g.setPos(p.x, Math.max(1, p.y), p.z);
        this.sim.entities.add(g);
        this.chat.add(t('Vos objets reposent dans une tombe en {x} {y} {z}.', { x: Math.floor(p.x), y: Math.floor(p.y), z: Math.floor(p.z) }), '#ffb0b0');
      }
    }
    p.lastDeath = { dim: p.dim, x: p.x, y: p.y, z: p.z };
    this.chat.add(p.deathMessage, '#ff8080');
    const score = Math.round((p.stats.blocs_casses ?? 0) / 10 + (p.stats.creatures_tuees ?? 0) * 5 + (p.stats.distance ?? 0) / 100 + (p.stats.boss_vaincus ?? 0) * 100);
    const hardcore = this.meta.gameMode === 'hardcore';
    this.host.ui.set(
      deathScreen(
        this.hostApi(),
        p.deathMessage,
        score,
        hardcore,
        () => {
          this.host.ui.closeAll();
          this.respawn(hardcore);
        },
        () => this.host.quitToTitle(),
      ),
    );
  }

  respawn(spectator: boolean): void {
    const p = this.player;
    this.deathShown = false;
    if (this.remote) {
      this.remote.respawn();
      return;
    }
    if (spectator) {
      p.gameMode = 'spectateur';
      p.respawn(p.x, p.y + 1, p.z);
      return;
    }
    const sp = p.spawn ?? { dim: 'surface', ...(this.meta.spawn ?? { x: 0, y: 100, z: 0 }) };
    if (sp.dim !== p.dim) {
      p.respawn(p.x, p.y, p.z);
      this.sim.requestTravel(p, sp.dim, { x: sp.x, y: sp.y, z: sp.z }, true);
    } else {
      p.respawn(sp.x, sp.y, sp.z);
      const w = this.world;
      const t = w.content.blocks;
      let guard = 0;
      while (guard++ < 100 && (t.solid[w.getId(Math.floor(p.x), Math.floor(p.y), Math.floor(p.z))] || t.solid[w.getId(Math.floor(p.x), Math.floor(p.y + 1), Math.floor(p.z))])) p.setPos(p.x, p.y + 1, p.z);
    }
    this.lastHealth = p.health;
  }

  // ------------------------------------------------------------------ boucle
  update(dt: number): void {
    if (this.disposed) return;
    const { input, ui, audio, settings } = this.host;
    const p = this.player;
    const paused = ui.pausing && !this.remote;
    // Touches globales
    if (!ui.open && !p.dead) {
      if (input.pressed('pause')) this.openPause();
      else if (input.pressed('inventory')) this.openInventory();
      else if (input.pressed('chat')) this.openChat('');
      else if (input.pressed('command')) this.openChat('/');
      else if (input.pressed('advancements')) {
        input.unlock();
        ui.push(advancementsScreen(this.hostApi(), this.sim, p));
      }
      if (input.pressed('debug')) this.showDebug = !this.showDebug;
      if (input.pressed('players')) {
        const names = this.remote ? this.remote.players.map((q) => q.name) : [p.name];
        this.chat.add(t('Joueurs connectés ({n}) : {names}', { n: names.length || 1, names: names.join(', ') || p.name }), '#c0e0ff');
      }
      if (input.pressed('hideHud')) this.hideHud = !this.hideHud;
      if (input.pressed('screenshot')) this.screenshot();
      if (!input.locked && document.hasFocus() && (input.pressed('attack') || input.pressed('use'))) input.lock();
    } else if (ui.top?.closeOnInventoryKey && input.pressed('inventory')) ui.pop();
    input.gameFocus = !ui.open;
    // Simulation
    if (!paused) {
      this.controller.update(dt);
      if (!this.remote) {
        this.tickAcc += dt;
        let n = 0;
        while (this.tickAcc >= TICK && n < 5) {
          this.sim.tick();
          this.tickAcc -= TICK;
          n++;
        }
        if (this.tickAcc > TICK * 5) this.tickAcc = 0;
        this.meta.playTime = (this.meta.playTime ?? 0) + dt;
      } else this.remote.update(dt);
    }
    this.updateTravel(dt);
    // Streaming
    if (!this.travelling || p.dim === this.travelling.dim) {
      this.streamer.update(p.x, p.z);
      this.streamer.updateMeshes(p.x, p.y, p.z);
    }
    // Santé / mort
    if (p.health < this.lastHealth - 0.01 && !p.dead) this.hurtFlash = Math.max(this.hurtFlash, 0.5);
    this.lastHealth = p.health;
    this.hurtFlash = Math.max(0, this.hurtFlash - dt);
    if (p.dead && !this.deathShown) this.showDeath();
    // Autosauvegarde
    if (!this.remote) {
      this.saveTimer -= dt;
      if (this.saveTimer <= 0) {
        this.saveTimer = 60;
        this.save();
      }
    }
    // Boss (disparition de la barre)
    if (this.boss) {
      this.boss.t -= dt;
      const be = this.sim.entities.get(this.boss.id) as LivingEntity | undefined;
      if (be && !be.dead) {
        this.boss.hp = be.health;
        this.boss.t = 3;
      } else if (this.boss.t <= 0) this.boss = null;
    }
    // Ambiance sonore
    this.updateAudio(dt);
    audio.update(dt);
    ui.update(dt);
    this.chat.update(ui.top !== undefined && !ui.top.pauses && !ui.top.closeOnInventoryKey);
    void settings;
  }

  private updateAudio(dt: number): void {
    void dt;
    const a = this.host.audio;
    const p = this.player;
    const w = this.world;
    const exposed = w.heightAt(Math.floor(p.x), Math.floor(p.z)) <= p.y + 2;
    const env = this.sim.env;
    const biome = BIOMES[w.biomeAt(Math.floor(p.x), Math.floor(p.z))];
    const rainy = p.dim === 'surface' && biome?.precip !== 'none';
    a.loop('pluie', rainy ? env.rain * (exposed ? 0.8 : 0.25) : 0);
    a.loop('vent', p.dim === 'surface' && p.y > 110 && exposed ? 0.4 : p.dim === 'astral' ? 0.25 : p.dim === 'celeste' ? (exposed ? 0.35 : 0.15) : 0);
    a.loop('grotte', p.dim === 'surface' && !exposed && p.y < 55 ? 0.35 : p.dim === 'abime' ? 0.4 : 0);
    const nearLava = w.blockLight(Math.floor(p.x), Math.floor(p.y + 1), Math.floor(p.z)) > 9 && p.dim === 'abime';
    a.loop('lave', nearLava ? 0.35 : 0);
    const portal = this.content.blocks.tryNum('voile_abime'),
      portal2 = this.content.blocks.tryNum('voile_celeste');
    let nearPortal = false;
    for (let dx = -3; dx <= 3 && !nearPortal; dx++)
      for (let dy = -2; dy <= 3 && !nearPortal; dy++)
        for (let dz = -3; dz <= 3 && !nearPortal; dz++) {
          const id = w.getId(Math.floor(p.x) + dx, Math.floor(p.y) + dy, Math.floor(p.z) + dz);
          if (id === portal || id === portal2) nearPortal = true;
        }
    a.loop('portail', nearPortal ? 0.5 : 0);
    let mood: Mood = env.isNight ? 'nuit' : 'jour';
    if (p.dim === 'abime') mood = 'abime';
    else if (p.dim === 'astral') mood = 'astral';
    else if (p.dim === 'surface' && !exposed && p.y < 50) mood = 'grotte';
    if (this.boss) mood = 'boss';
    a.setMood(mood);
    const d = this.controller.camDir;
    a.setListener(this.camera.position.x, this.camera.position.y, this.camera.position.z, d.x, d.y, d.z);
  }

  render(dt: number): void {
    if (this.disposed) return;
    const { renderer, settings } = this.host;
    const p = this.player;
    const ctrl = this.controller;
    const cam = this.camera;
    // caméra
    const bob = settings.viewBobbing && ctrl.view === 0 ? ctrl.bobAmount : 0;
    cam.position.copy(ctrl.camPos);
    cam.position.y += Math.abs(Math.cos(ctrl.bobPhase)) * 0.06 * bob;
    if (ctrl.shake > 0) {
      cam.position.x += (Math.random() - 0.5) * ctrl.shake * 0.2;
      cam.position.y += (Math.random() - 0.5) * ctrl.shake * 0.2;
    }
    let yaw = p.yaw,
      pitch = p.pitch;
    if (ctrl.view === 2) {
      yaw += Math.PI;
      pitch = -pitch;
    }
    cam.rotation.set(pitch, yaw, Math.sin(ctrl.bobPhase) * 0.012 * bob + (ctrl.shake > 0 ? (Math.random() - 0.5) * ctrl.shake * 0.05 : 0));
    const fov = settings.fov * ctrl.fovMul;
    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    cam.updateMatrixWorld();
    // ambiance de biome
    const b = BIOMES[this.world.biomeAt(Math.floor(p.x), Math.floor(p.z))] ?? BIOMES[6];
    this.biomeFog.set(b.fog);
    this.biomeSky.set(b.sky);
    const env = this.sim.env;
    const underwater = this.world.getId(Math.floor(cam.position.x), Math.floor(cam.position.y), Math.floor(cam.position.z)) === this.content.blocks.tryNum('eau');
    const inLava = this.world.getId(Math.floor(cam.position.x), Math.floor(cam.position.y), Math.floor(cam.position.z)) === this.content.blocks.tryNum('lave');
    const so = this.sky.update(
      {
        time: env.dayTime,
        day: env.day,
        dim: p.dim,
        rain: p.dim === 'surface' && b.precip !== 'none' ? env.rain : 0,
        storm: env.storm,
        flash: env.flash,
        biomeSky: this.biomeSky,
        biomeFog: this.biomeFog,
        underwater,
        inLava,
        renderDistance: this.streamer.radius * 16,
        cloudsEnabled: settings.clouds,
      },
      cam,
      dt,
    );
    const u = this.chunkRenderer.uniforms;
    u.uTime.value += dt;
    u.uDaylight.value = so.daylight;
    (u.uSkyLightColor.value as THREE.Color).copy(so.skyLight);
    (u.uFogColor.value as THREE.Color).copy(so.fog);
    u.uFogNear.value = so.fogNear;
    u.uFogFar.value = so.fogFar;
    (u.uSunDir.value as THREE.Vector3).copy(so.sunDir);
    (u.uCameraPos.value as THREE.Vector3).copy(cam.position);
    u.uUnderwater.value = underwater ? 1 : 0;
    u.uNightVision.value = p.hasEffect('vision_nocturne') ? 1 : so.ambientMin;
    this.scene.background = so.fog;
    const pm = this.particles.material.uniforms;
    (pm.uFogColor.value as THREE.Color).copy(so.fog);
    pm.uFogNear.value = so.fogNear;
    pm.uFogFar.value = so.fogFar;
    this.items.fog.color.copy(so.fog);
    this.items.fog.near.value = so.fogNear;
    this.items.fog.far.value = so.fogFar;
    // météo & particules
    const lightAt = (x: number, y: number, z: number) => {
      const l = this.world.getLight(Math.floor(x), Math.floor(y), Math.floor(z));
      return Math.max(((l >> 4) / 15) * so.daylight, (l & 15) / 15) * 0.85 + 0.15;
    };
    this.particles.density = settings.particles === 'tout' ? 1 : settings.particles === 'reduit' ? 0.5 : 0.15;
    this.particles.update(dt, this.world, lightAt);
    this.weather.update(dt, this.world, cam.position.x, cam.position.y, cam.position.z, env.rain, p.dim, so.daylight);
    for (const [x, y, z] of this.weather.splashes) if (Math.random() < 0.5) this.fx.emit('eclaboussure', x, y, z, 2, 0.1);
    // entités
    this.entities.showLocalPlayer = ctrl.view > 0;
    const alpha = this.remote ? this.remote.alpha : Math.min(1, this.tickAcc / TICK);
    this.entities.sync(this.sim.entities.list, p.dim, alpha, dt, (x, y, z) => {
      const l = this.world.getLight(x, y, z);
      return { sky: (l >> 4) / 15, block: (l & 15) / 15 };
    }, so.daylight);
    // contour et fissures
    const t = ctrl.target;
    if (t && !this.hideHud) {
      const br = ctrl.breaking;
      this.highlight.set(t.x, t.y, t.z, ctrl.targetBoxes(), br && br.x === t.x && br.y === t.y && br.z === t.z ? br.progress : 0);
    } else this.highlight.set(0, 0, 0, null, 0);
    // visibilité et rendu
    this.chunkRenderer.cullCaves = settings.caveCulling;
    this.chunkRenderer.updateVisibility(cam, this.world.chunks, this.streamer.radius);
    renderer.render(this.scene, cam);
    // objet tenu
    if (ctrl.view === 0 && !this.hideHud && !p.spectator) {
      const el = this.world.getLight(Math.floor(p.x), Math.floor(p.y + p.eye), Math.floor(p.z));
      const use = p.using ? (p.using.kind as 'eat' | 'bow' | 'block' | 'recall') : null;
      this.held.update(dt, {
        id: p.inventory.held?.id ?? null,
        swing: ctrl.swing,
        use,
        useProgress: p.using ? p.using.time / Math.max(0.01, p.using.kind === 'bow' ? 1 : p.using.total) : 0,
        walk: ctrl.bobPhase,
        walkAmount: ctrl.bobAmount,
        sky: (el >> 4) / 15,
        block: (el & 15) / 15,
        daylight: so.daylight,
        bobbing: settings.viewBobbing,
      });
      this.held.render(renderer);
    }
    if (this.thumbnailWanted) {
      this.thumbnailWanted = false;
      this.captureThumbnail();
    }
    // interface
    this.fpsFrames++;
    this.fpsTime += dt;
    if (this.fpsTime >= 0.5) {
      this.fps = Math.round(this.fpsFrames / this.fpsTime);
      this.fpsFrames = 0;
      this.fpsTime = 0;
    }
    this.hud.setHidden(this.hideHud);
    let vignette: 'hurt' | 'water' | 'cold' | 'hot' | 'portal' | null = null;
    let va = 0;
    if (this.hurtFlash > 0) {
      vignette = 'hurt';
      va = this.hurtFlash * 1.6;
    } else if (this.travelling) {
      vignette = 'portal';
      va = Math.min(1, 0.4 + this.travelling.t);
    } else if (p.portalTime > 0) {
      vignette = 'portal';
      va = p.portalTime / 2.5;
    } else if (underwater) {
      vignette = 'water';
      va = 1;
    } else if (p.bodyTemp < -0.55 && !p.creative) {
      vignette = 'cold';
      va = Math.min(1, (-p.bodyTemp - 0.55) * 3);
    } else if (p.bodyTemp > 0.65 && !p.creative) {
      vignette = 'hot';
      va = Math.min(1, (p.bodyTemp - 0.65) * 3);
    }
    this.hud.update(
      {
        player: p,
        hardcore: this.meta.gameMode === 'hardcore',
        attackCharge: ctrl.attackCharge(),
        useProgress: p.using && p.using.kind !== 'block' ? Math.min(1, p.using.time / (p.using.kind === 'bow' ? 1 : p.using.total)) : -1,
        boss: this.boss,
        debug: this.showDebug ? this.debugText() : null,
        fps: settings.showFps ? this.fps : null,
        vignette,
        vignetteAmount: va,
      },
      dt,
    );
  }

  private debugText(): string {
    const p = this.player;
    const w = this.world;
    const bx = Math.floor(p.x),
      by = Math.floor(p.y),
      bz = Math.floor(p.z);
    const b = BIOMES[w.biomeAt(bx, bz)];
    const l = w.getLight(bx, by + 1, bz);
    const facing = [t('sud (+Z)'), t('ouest (−X)'), t('nord (−Z)'), t('est (+X)')][lookFacing(p.yaw)];
    const st = this.chunkRenderer.stats;
    const tg = this.controller.target;
    const tb = tg ? this.content.blocks.get(tg.cell & 0xfff) : null;
    const env = this.sim.env;
    const hh = Math.floor(((env.dayTime / 1000 + 6) % 24));
    const mm = Math.floor(((env.dayTime % 1000) / 1000) * 60);
    return [
      t('Voxerra {v} — {fps} IPS', { v: this.host.version, fps: this.fps }),
      `XYZ : ${p.x.toFixed(2)} / ${p.y.toFixed(2)} / ${p.z.toFixed(2)}`,
      t('Bloc : {x} {y} {z}  Colonne : {cx} {cz}  [{lx} {lz}]', { x: bx, y: by, z: bz, cx: bx >> 4, cz: bz >> 4, lx: bx & 15, lz: bz & 15 }),
      t('Orientation : {f}  (lacet {yaw}°, tangage {pitch}°)', { f: facing, yaw: ((p.yaw * 180) / Math.PI).toFixed(1), pitch: ((p.pitch * 180) / Math.PI).toFixed(1) }),
      t('Dimension : {dim}  Biome : {biome}', { dim: DIMENSION_INFO[p.dim as DimensionId]?.name ?? p.dim, biome: b?.name ?? '?' }),
      t('Lumière : ciel {sky}, bloc {block}  Température : {temp} (ambiante {amb})', { sky: l >> 4, block: l & 15, temp: p.bodyTemp.toFixed(2), amb: p.ambientTemp.toFixed(2) }),
      t('Jour {d}, {time}  Météo : {w}', { d: env.day + 1, time: `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`, w: t(WEATHER_LABEL[env.weather] ?? env.weather) }),
      t('Colonnes : {n} chargées, {l} en cours, {m} maillages en attente', { n: w.chunks.size, l: this.streamer.loadingCount, m: this.streamer.pendingMeshes }),
      t('Sections : {v}/{s} visibles, {k}k triangles, {c} appels', { v: st.visible, s: st.sections, k: (st.triangles / 1000).toFixed(0), c: this.renderer().info.render.calls }),
      t('Entités : {e}  Particules : {p}', { e: this.sim.entities.list.filter((e) => e.dim === p.dim).length, p: this.particles.live }),
      t('Graine : {seed}', { seed: this.meta.seedText }),
      tb ? t('Visé : {name} ({x} {y} {z}) méta {m}', { name: tb.name, x: tg!.x, y: tg!.y, z: tg!.z, m: tg!.cell >>> 12 }) : '',
    ].join('\n');
  }

  private renderer(): THREE.WebGLRenderer {
    return this.host.renderer;
  }

  private screenshot(): void {
    const url = this.host.renderer.domElement.toDataURL('image/png');
    const a = h('a', { href: url, download: `voxerra-${Date.now()}.png` });
    a.click();
    this.chat.add(t('Capture d’écran enregistrée.'), '#a0ffa0');
  }

  private captureThumbnail(): void {
    try {
      const src = this.host.renderer.domElement;
      const c = document.createElement('canvas');
      c.width = 128;
      c.height = 128;
      const g = c.getContext('2d')!;
      const s = Math.min(src.width, src.height);
      g.drawImage(src, (src.width - s) / 2, (src.height - s) / 2, s, s, 0, 0, 128, 128);
      this.meta.thumbnail = c.toDataURL('image/jpeg', 0.7);
    } catch {
      /* ignore */
    }
  }

  requestThumbnail(): void {
    this.thumbnailWanted = true;
  }

  // ------------------------------------------------------------------ sauvegarde
  save(): Promise<void> {
    if (this.remote) return Promise.resolve();
    if (this.saving) return this.saving.then(() => this.save());
    const run = async () => {
      this.hud.setSaving(true);
      const meta = this.meta;
      const sim = this.sim;
      meta.time = sim.env.time;
      meta.weather = sim.env.serialize();
      meta.player = this.player.serialize();
      meta.lastPlayed = Date.now();
      meta.dimension = this.player.dim;
      meta.rules = { ...sim.rules };
      meta.stats = this.player.stats;
      const dim = this.world.dim;
      const { recs, commit } = this.streamer.collectSaves((c) => sim.persistentEntitiesIn(dim, c.cx, c.cz));
      try {
        await this.host.storage.saveBatch(meta, recs.map((rec) => ({ dim, rec })));
        commit();
      } catch (e) {
        console.error('Échec de la sauvegarde', e);
        this.chat.add(t('Échec de la sauvegarde (espace de stockage ?)'), '#ff6060');
      }
      setTimeout(() => this.hud.setSaving(false), 600);
    };
    this.saving = run().finally(() => (this.saving = null));
    return this.saving;
  }

  async dispose(saveFirst = true): Promise<void> {
    if (saveFirst) {
      this.requestThumbnail();
      this.render(0);
      await this.save();
    }
    this.disposed = true;
    this.remote?.close();
    this.streamer.unloadAll();
    this.chunkRenderer.dispose();
    this.entities.clear();
    this.sky.dispose();
    this.host.audio.stopLoops();
  }

  resize(): void {
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.held.resize(innerWidth / innerHeight);
  }
}

/** Icône de la notification « Nouvelle dimension ». */
function dimIcon(dim: string): string {
  return dim === 'abime' ? 'braisite' : dim === 'astral' ? 'eclat_astral' : dim === 'celeste' ? 'nuage' : 'herbe';
}
