/**
 * EntitySystem — gère toutes les entités : mise à jour, rendu (interpolation, animation,
 * éclairage), apparition naturelle, disparition, persistance par tronçon.
 */
import * as THREE from 'three';
import { Entity } from '../entity/Entity';
import { Mob } from './Mob';
import { Villager } from './Villager';
import { BOSS_CLASSES } from './bosses';
import { MOB_DEFS } from './mobDefs';
import { ModelFactory, type ModelInstance } from './BoxModel';
import { MODELS } from './models';
import { Boat, FallingBlock, FlyingCarpet, ItemEntity, Lightning, Minecart, PrimedTnt, Projectile, Vehicle, XpOrb, type ProjectileKind } from './misc';
import { ItemMeshFactory, brightness } from '../render/ItemMesh';
import { deserializeStack, serializeStack, ITEM_BY_KEY, type ItemStack } from '../items/items';
import { biomeById } from '../world/biomes';
import { BLOCKS, OPAQUE, WATERLOGGED } from '../world/blocks';
import { blockId, blockMeta, SEA_LEVEL } from '../world/constants';
import type { EntityHost } from './host';
import type { EntitySave } from '../save/SaveManager';
import type { Chunk } from '../world/Chunk';
import type { GenMarker } from '../world/gen/writer';

interface View {
  obj: THREE.Object3D;
  model?: ModelInstance;
  mats?: THREE.MeshBasicMaterial[];
  modelKey?: string;
}

export class EntityManager {
  readonly list: Entity[] = [];
  readonly group = new THREE.Group();
  private views = new Map<number, View>();
  readonly models: ModelFactory;
  private xpTexture: THREE.Texture;
  /** Entités sauvegardées au déchargement de leur tronçon (clé « dim|cx,cz »). */
  pendingSaves = new Map<string, EntitySave[]>();
  spawning = true;
  mobsEnabled = true;
  private spawnTimer = 0;
  playerSkin = 'player_explorer';
  lightningFlash = 0;

  constructor(private items: ItemMeshFactory) {
    this.models = new ModelFactory(MODELS);
    const c = document.createElement('canvas');
    c.width = c.height = 8;
    const g = c.getContext('2d')!;
    g.fillStyle = '#c8ff40';
    g.fillRect(2, 1, 4, 6);
    g.fillRect(1, 2, 6, 4);
    g.fillStyle = '#f0ffa0';
    g.fillRect(3, 2, 2, 2);
    this.xpTexture = new THREE.CanvasTexture(c);
    this.xpTexture.magFilter = THREE.NearestFilter;
  }

  add(e: Entity, host: EntityHost): Entity {
    e.world = host.world;
    e.prevPos.copy(e.pos);
    this.list.push(e);
    return e;
  }

  clear(): void {
    for (const v of this.views.values()) this.disposeView(v);
    this.views.clear();
    this.list.length = 0;
  }

  near(pos: THREE.Vector3, r: number): Entity[] {
    const out: Entity[] = [];
    const r2 = r * r;
    for (const e of this.list) if (!e.removed && e.pos.distanceToSquared(pos) <= r2) out.push(e);
    return out;
  }

  // ------------------------------------------------------------------ création
  createMob(type: string): Mob | null {
    if (!MOB_DEFS[type]) return null;
    if (type === 'villager') return new Villager();
    const B = BOSS_CLASSES[type];
    if (B) return new B();
    return new Mob(type);
  }

  spawnMob(host: EntityHost, type: string, x: number, y: number, z: number, opts: Record<string, unknown> = {}): Mob | null {
    if (!this.mobsEnabled && !opts.force) return null;
    const m = this.createMob(type);
    if (!m) return null;
    m.pos.set(x, y, z);
    m.yaw = Math.random() * Math.PI * 2;
    if (opts.baby) m.setBaby(true);
    if (opts.persistent) m.persistent = true;
    if (opts.natural) m.natural = true;
    if (type === 'slime' || type === 'crystal_slime' || type === 'magma_cube') m.setSlimeSize(typeof opts.size === 'number' ? opts.size : [1, 2, 4][Math.floor(Math.random() * 3)]);
    if (m instanceof Villager) {
      const home = opts.home as number[] | undefined;
      const center = opts.center as number[] | undefined;
      m.setup(String(opts.profession ?? 'farmer'), home ? new THREE.Vector3(home[0], home[1], home[2]) : null, center ? new THREE.Vector3(center[0], center[1], center[2]) : null);
    }
    if (opts.dormant && 'dormant' in m) (m as unknown as { dormant: boolean }).dormant = true;
    if (opts.arena && 'arena' in m) {
      const a = opts.arena as number[];
      (m as unknown as { arena: THREE.Vector3 }).arena = new THREE.Vector3(a[0], a[1], a[2]);
    }
    if (opts.home && !(m instanceof Villager)) {
      const h = opts.home as number[];
      m.homePos = new THREE.Vector3(h[0], h[1], h[2]);
    }
    this.add(m, host);
    return m;
  }

  dropItem(host: EntityHost, x: number, y: number, z: number, stack: ItemStack, vel?: THREE.Vector3): ItemEntity {
    const it = new ItemEntity({ ...stack });
    it.pos.set(x, y, z);
    if (vel) it.vel.copy(vel);
    else it.vel.set((Math.random() - 0.5) * 0.2, 0.2, (Math.random() - 0.5) * 0.2);
    this.add(it, host);
    return it;
  }

  dropXp(host: EntityHost, x: number, y: number, z: number, amount: number): void {
    while (amount > 0) {
      const n = amount >= 17 ? 17 : amount >= 7 ? 7 : amount >= 3 ? 3 : 1;
      amount -= n;
      const o = new XpOrb(n);
      o.pos.set(x + (Math.random() - 0.5) * 0.5, y, z + (Math.random() - 0.5) * 0.5);
      o.vel.set((Math.random() - 0.5) * 0.2, 0.2, (Math.random() - 0.5) * 0.2);
      this.add(o, host);
    }
  }

  spawnProjectile(host: EntityHost, kind: string, owner: Entity | null, pos: THREE.Vector3, vel: THREE.Vector3): Projectile {
    const p = new Projectile(kind as ProjectileKind, owner);
    p.pos.copy(pos);
    p.vel.copy(vel);
    p.yaw = Math.atan2(-vel.x, -vel.z);
    this.add(p, host);
    return p;
  }

  // ------------------------------------------------------------------ mise à jour
  tick(host: EntityHost): void {
    const player = host.player;
    for (const e of this.list) {
      if (e.removed) continue;
      // Les entités dans des tronçons non chargés sont figées.
      if (!host.world.isLoaded(Math.floor(e.pos.x), Math.floor(e.pos.z)) && !(e instanceof Lightning)) continue;
      (e as unknown as { tick(h: EntityHost): void }).tick(host);
      if (e instanceof Mob) this.mobExtras(host, e);
      if (e instanceof ItemEntity && !player.dead && e.pickupDelay <= 0 && e.pos.distanceTo(player.pos.clone().setY(player.pos.y + 0.5)) < 1.6) {
        const before = e.stack.count;
        const left = player.inventory.give(e.stack);
        if (left < before) {
          player.noteItem(e.stack);
          host.audio('pop', e.pos, 0.6, 1 + Math.random() * 0.4);
          if (left === 0) e.remove();
          else e.stack.count = left;
        }
      }
      if (e instanceof Vehicle && e.dead) {
        e.remove();
        if (!(player.creative && player.pos.distanceTo(e.pos) < 8)) this.dropItem(host, e.pos.x, e.pos.y + 0.5, e.pos.z, { id: ITEM_BY_KEY.get(e.dropKey)!.id, count: 1 });
        if (e.rider) host.dismount(e.rider);
      }
    }
    // Séparation des créatures qui se chevauchent
    this.separate(player);
    // Nettoyage
    for (let i = this.list.length - 1; i >= 0; i--) {
      const e = this.list[i];
      if (e.removed) {
        const v = this.views.get(e.id);
        if (v) this.disposeView(v);
        this.views.delete(e.id);
        this.list.splice(i, 1);
      }
    }
    if (this.spawning && this.mobsEnabled && ++this.spawnTimer >= 20) {
      this.spawnTimer = 0;
      this.naturalSpawn(host);
    }
  }

  private mobExtras(host: EntityHost, m: Mob): void {
    if (m.dead && m.deathTime === 1) {
      host.audio(m.def.sound + '_death', m.pos);
      const killedByPlayer = m.lastHurtByPlayer > 0;
      for (const d of m.rollDrops()) {
        const it = ITEM_BY_KEY.get(d.key);
        if (it) this.dropItem(host, m.pos.x, m.pos.y + m.height / 2, m.pos.z, { id: it.id, count: d.count });
      }
      if (killedByPlayer && m.def.xp) {
        const [a, b] = m.def.xp;
        this.dropXp(host, m.pos.x, m.pos.y + 0.5, m.pos.z, a + Math.floor(Math.random() * (b - a + 1)));
      }
      if (m.def.splits && (m.data.slimeSize as number) > 1) {
        const n = (m.data.slimeSize as number) / 2;
        for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) this.spawnMob(host, m.type, m.pos.x + (Math.random() - 0.5), m.pos.y + 0.5, m.pos.z + (Math.random() - 0.5), { size: n });
      }
      if (m.isBoss) host.bossDefeated(m);
    }
    if (m.dead && m.deathTime > 20) {
      host.particles.puff(m.pos.x, m.pos.y + m.height / 2, m.pos.z, 0xe8e8e8, 12, 1, -0.5, 0.15, 1);
      m.remove();
    }
    if (!m.dead && m.hurtTime === 9) host.audio(m.def.sound + '_hurt', m.pos);
    if (!m.dead && Math.random() < 0.004 && m.def.kind !== 'boss') host.audio(m.def.sound, m.pos, 0.7);
    // Disparition des monstres lointains
    if (!m.persistent && !m.dead) {
      const d = m.pos.distanceTo(host.player.pos);
      if (d > 110 || (d > 40 && Math.random() < 1 / 600)) m.remove();
      if (m.def.kind === 'flying' && m.type === 'night_wraith' && host.daylight > 0.8 && Math.random() < 0.01) m.remove();
    }
  }

  private separate(player: Entity): void {
    const mobs = this.list.filter((e) => e.living && !e.dead && !e.removed && !e.noGravity);
    for (let i = 0; i < mobs.length; i++) {
      const a = mobs[i];
      for (let j = i + 1; j < mobs.length; j++) {
        const b = mobs[j];
        const dx = b.pos.x - a.pos.x;
        const dz = b.pos.z - a.pos.z;
        const min = (a.width + b.width) / 2;
        const d2 = dx * dx + dz * dz;
        if (d2 >= min * min || Math.abs(a.pos.y - b.pos.y) > Math.max(a.height, b.height)) continue;
        const d = Math.sqrt(d2) || 0.01;
        const push = (min - d) * 0.05;
        const nx = dx / d;
        const nz = dz / d;
        if (a !== player || !a.vehicle) {
          a.vel.x -= nx * push;
          a.vel.z -= nz * push;
        }
        if (b !== player || !b.vehicle) {
          b.vel.x += nx * push;
          b.vel.z += nz * push;
        }
      }
    }
  }

  // ------------------------------------------------------------------ apparition naturelle
  private naturalSpawn(host: EntityHost): void {
    const p = host.player;
    let hostile = 0;
    let passive = 0;
    let aquatic = 0;
    let flying = 0;
    for (const e of this.list) {
      if (!(e instanceof Mob) || e.dead) continue;
      const k = e.def.kind;
      if (k === 'hostile' || (k === 'flying' && e.def.damage)) e.def.flies ? flying++ : hostile++;
      else if (k === 'aquatic') aquatic++;
      else if (k === 'passive' && e.natural) passive++;
    }
    const hostileCap = host.difficulty === 'peaceful' ? 0 : host.difficulty === 'easy' ? 14 : host.difficulty === 'normal' ? 24 : 32;
    for (let attempt = 0; attempt < 3; attempt++) {
      const a = Math.random() * Math.PI * 2;
      const dist = 24 + Math.random() * 32;
      const x = Math.floor(p.pos.x + Math.cos(a) * dist);
      const z = Math.floor(p.pos.z + Math.sin(a) * dist);
      if (!host.world.isLoaded(x, z)) continue;
      const biome = host.world.biome(x, z);
      const top = host.world.height(x, z);
      // Créatures aquatiques
      const topId = host.world.id(x, top, z);
      if (WATERLOGGED[topId] && aquatic < 8 && host.dimension === 0) {
        const pool = biome.passiveMobs.filter((m) => MOB_DEFS[m]?.kind === 'aquatic');
        if (pool.length) {
          const y = top - 1 - Math.floor(Math.random() * 4);
          if (WATERLOGGED[host.world.id(x, y, z)]) {
            const t = pool[Math.floor(Math.random() * pool.length)];
            for (let i = 0; i < (t === 'dolphin' ? 2 : 3); i++) this.spawnMob(host, t, x + 0.5 + Math.random(), y, z + 0.5 + Math.random(), { natural: true });
          }
        }
        continue;
      }
      // Hostiles : dans l'obscurité, en surface la nuit ou dans les grottes
      if (hostile < hostileCap && host.rules.mobSpawning) {
        const underground = Math.random() < 0.5;
        let y = top + 1;
        if (underground) {
          y = 6 + Math.floor(Math.random() * Math.max(1, top - 10));
          let ok = false;
          for (let k = 0; k < 12; k++, y++) {
            if (this.spawnSpace(host, x, y, z, 2)) {
              ok = true;
              break;
            }
          }
          if (!ok) continue;
        } else if (!this.spawnSpace(host, x, y, z, 2)) continue;
        const sky = host.world.skyLight(x, y, z);
        const blk = host.world.blockLight(x, y, z);
        const effective = Math.max(Math.round(sky * (host.dimension === 0 ? host.daylight : 0.3)), blk);
        if (effective <= 4 && blk === 0) {
          let pool = biome.hostileMobs.filter((m) => MOB_DEFS[m]);
          if (host.dimension === 0 && y < 40 && underground) pool = pool.concat(['cave_crawler', 'cave_crawler']);
          if (host.dimension === 0 && biome.key === 'crystal_forest' || (underground && y < 30 && Math.random() < 0.1)) pool.push('crystal_slime');
          if (host.dimension === 1) pool = ['ember_salamander', 'magma_cube', 'fire_spirit', 'skeleton'];
          if (!pool.length) continue;
          let t = pool[Math.floor(Math.random() * pool.length)];
          if (t === 'fire_spirit' || t === 'night_wraith' || t === 'storm_bird') {
            if (flying >= 4) continue;
          }
          if (host.dimension === 0 && !underground && host.time > 13000 && host.time < 23000 && flying < 3 && Math.random() < 0.06) t = 'night_wraith';
          const pack = t === 'zombie' || t === 'skeleton' ? 1 + Math.floor(Math.random() * 3) : 1;
          for (let i = 0; i < pack; i++) {
            const m = this.spawnMob(host, t, x + 0.5 + (i ? Math.random() * 2 - 1 : 0), MOB_DEFS[t].flies ? y + 3 : y, z + 0.5 + (i ? Math.random() * 2 - 1 : 0), { natural: true });
            if (m && t === 'night_wraith') m.pos.y += 6;
          }
          continue;
        }
      }
      // Animaux : de jour sur l'herbe
      if (passive < 10 && host.daylight > 0.6 && host.dimension !== 1) {
        const ground = host.world.id(x, top, z);
        const gk = BLOCKS[ground]?.key;
        if (gk !== 'grass_block' && gk !== 'sky_grass' && gk !== 'sand' && gk !== 'snow_layer' && gk !== 'mycelium' && gk !== 'podzol') continue;
        if (!this.spawnSpace(host, x, top + 1, z, 2)) continue;
        if (top < SEA_LEVEL - 2 && host.dimension === 0) continue;
        let pool = biome.passiveMobs.filter((m) => MOB_DEFS[m] && MOB_DEFS[m].kind === 'passive');
        if (biome.fantasy && Math.random() < 0.02) pool = ['golden_stag'];
        if (!pool.length) continue;
        const t = pool[Math.floor(Math.random() * pool.length)];
        if (t === 'golden_stag' && this.list.some((e) => e.type === 'golden_stag')) continue;
        const n = t === 'golden_stag' ? 1 : 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < n; i++) this.spawnMob(host, t, x + 0.5 + Math.random() * 2 - 1, top + 1, z + 0.5 + Math.random() * 2 - 1, { natural: true });
      }
    }
  }

  private spawnSpace(host: EntityHost, x: number, y: number, z: number, h: number): boolean {
    if (!BLOCKS[host.world.id(x, y - 1, z)]?.solid) return false;
    const below = BLOCKS[host.world.id(x, y - 1, z)];
    if (below?.key === 'bedrock' || below?.key.includes('glass') || below?.shape !== 'cube') return false;
    for (let i = 0; i < h; i++) {
      const d = BLOCKS[host.world.id(x, y + i, z)];
      if (!d || d.solid || d.shape === 'liquid') return false;
    }
    return true;
  }

  // ------------------------------------------------------------------ persistance
  serialize(e: Entity): EntitySave | null {
    if (e.removed || e.dead) return null;
    const base = { type: e.type, pos: [e.pos.x, e.pos.y, e.pos.z] as [number, number, number], yaw: e.yaw, health: e.health };
    if (e instanceof Mob) {
      if (!e.persistent) return null;
      return { ...base, data: e.serializeData() };
    }
    if (e instanceof ItemEntity) return { ...base, data: { item: serializeStack(e.stack), life: e.life } };
    if (e instanceof Vehicle) return base;
    return null;
  }

  restore(host: EntityHost, s: EntitySave): Entity | null {
    let e: Entity | null = null;
    if (MOB_DEFS[s.type]) {
      const m = this.createMob(s.type);
      if (!m) return null;
      m.loadData(s.data ?? {});
      m.persistent = true;
      e = m;
    } else if (s.type === 'item') {
      const st = deserializeStack(s.data?.item);
      if (!st) return null;
      const it = new ItemEntity(st);
      it.life = Number(s.data?.life) || 0;
      it.pickupDelay = 0;
      e = it;
    } else if (s.type === 'boat') e = new Boat();
    else if (s.type === 'minecart') e = new Minecart();
    else if (s.type === 'flying_carpet') e = new FlyingCarpet();
    if (!e) return null;
    e.pos.set(s.pos[0], s.pos[1], s.pos[2]);
    e.yaw = s.yaw;
    if (s.health > 0) e.health = Math.min(e.maxHealth, s.health);
    return this.add(e, host);
  }

  /** Tronçon déchargé : les entités persistantes sont mises de côté pour la sauvegarde. */
  unloadChunk(chunk: Chunk, dim: number, playerRiding: Entity | null): boolean {
    const list: EntitySave[] = [];
    let any = false;
    for (const e of this.list) {
      if (e.removed || e === playerRiding) continue;
      if (Math.floor(e.pos.x / 16) !== chunk.cx || Math.floor(e.pos.z / 16) !== chunk.cz) continue;
      if (e.type === 'player') continue;
      const s = this.serialize(e);
      if (s) {
        list.push(s);
        any = true;
      }
      e.remove();
    }
    const key = `${dim}|${chunk.cx},${chunk.cz}`;
    if (any || this.pendingSaves.has(key)) this.pendingSaves.set(key, list);
    return any;
  }

  /** Toutes les entités persistantes des tronçons chargés, groupées par tronçon. */
  collectAll(dim: number): Map<string, EntitySave[]> {
    const out = new Map(this.pendingSaves);
    const touched = new Set<string>();
    for (const e of this.list) {
      const s = this.serialize(e);
      const key = `${dim}|${Math.floor(e.pos.x / 16)},${Math.floor(e.pos.z / 16)}`;
      if (!touched.has(key)) {
        touched.add(key);
        out.set(key, []);
      }
      if (s) out.get(key)!.push(s);
    }
    return out;
  }

  /** Marqueurs de génération (troupeaux, villageois, boss, coffres). */
  applyMarkers(host: EntityHost, chunk: Chunk, markers: GenMarker[], fillChest: (x: number, y: number, z: number, loot: string) => void, alreadySpawned: Set<string>): void {
    for (const mk of markers) {
      const id = `${mk.kind}:${Math.floor(mk.x)},${Math.floor(mk.y)},${Math.floor(mk.z)}`;
      if (alreadySpawned.has(id)) continue;
      alreadySpawned.add(id);
      if (mk.kind === 'chest' || mk.kind === 'spawner') {
        fillChest(Math.floor(mk.x), Math.floor(mk.y), Math.floor(mk.z), mk.id);
        chunk.modified = true;
        continue;
      }
      const opts: Record<string, unknown> = { persistent: true, ...(mk.data ?? {}) };
      const m = this.spawnMob(host, mk.id, mk.x, mk.y, mk.z, opts);
      if (m) chunk.modified = true;
    }
  }

  // ------------------------------------------------------------------ rendu
  frame(alpha: number, dt: number, host: EntityHost, cameraPos: THREE.Vector3, firstPersonPlayer: Entity | null): void {
    for (const e of this.list) {
      if (e.removed) continue;
      let v = this.views.get(e.id);
      if (!v) {
        v = this.createView(e);
        this.views.set(e.id, v);
        this.group.add(v.obj);
      }
      const x = e.prevPos.x + (e.pos.x - e.prevPos.x) * alpha;
      const y = e.prevPos.y + (e.pos.y - e.prevPos.y) * alpha;
      const z = e.prevPos.z + (e.pos.z - e.prevPos.z) * alpha;
      v.obj.position.set(x, y, z);
      const far = cameraPos.distanceToSquared(v.obj.position) > 140 * 140;
      v.obj.visible = !far && e !== firstPersonPlayer;
      if (!v.obj.visible) continue;
      const bx = Math.floor(x);
      const by = Math.floor(y + Math.min(1, e.height * 0.5));
      const bz = Math.floor(z);
      const glow = e instanceof Mob && e.def.glow;
      const light = glow ? 1 : brightness(host.world.skyLight(bx, by, bz), host.world.blockLight(bx, by, bz), host.daylight) + this.lightningFlash * 0.5;
      this.animate(e, v, alpha, dt, Math.min(1, light));
    }
    if (this.lightningFlash > 0) this.lightningFlash = Math.max(0, this.lightningFlash - dt * 3);
  }

  /** Rendu d'une entité tenue hors de la liste (joueur local vu à la troisième personne). */
  renderDetached(e: Entity, alpha: number, dt: number, host: EntityHost, visible: boolean): void {
    let v = this.views.get(e.id);
    if (!v) {
      v = this.createView(e);
      this.views.set(e.id, v);
      this.group.add(v.obj);
    }
    v.obj.visible = visible && !e.removed;
    if (!v.obj.visible) return;
    v.obj.position.set(e.prevPos.x + (e.pos.x - e.prevPos.x) * alpha, e.prevPos.y + (e.pos.y - e.prevPos.y) * alpha, e.prevPos.z + (e.pos.z - e.prevPos.z) * alpha);
    const p = v.obj.position;
    const light = brightness(host.world.skyLight(Math.floor(p.x), Math.floor(p.y + 1), Math.floor(p.z)), host.world.blockLight(Math.floor(p.x), Math.floor(p.y + 1), Math.floor(p.z)), host.daylight);
    this.animate(e, v, alpha, dt, Math.min(1, light));
  }

  /** Supprime la vue d'une entité détachée (changement d'apparence, départ d'un joueur). */
  dropView(e: Entity): void {
    const v = this.views.get(e.id);
    if (!v) return;
    this.disposeView(v);
    this.views.delete(e.id);
  }

  private modelKeyFor(e: Entity): string {
    if (e.type === 'player' || e.type === 'remote_player') return (e as unknown as { skinKey?: string }).skinKey ?? this.playerSkin;
    if (e instanceof Villager) return MODELS['villager_' + e.profession] ? 'villager_' + e.profession : 'villager';
    if (e instanceof Mob) {
      if ((e.type === 'sheep' || e.type === 'sky_sheep') && e.sheared) return 'sheep_sheared';
      return e.def.model;
    }
    return e.type;
  }

  private createView(e: Entity): View {
    if (e instanceof Mob || e.type === 'player' || e.type === 'remote_player' || e instanceof Vehicle) {
      const key = this.modelKeyFor(e);
      if (MODELS[key]) {
        const model = this.models.create(key);
        const obj = new THREE.Group();
        obj.add(model.root);
        if (e.type === 'remote_player') obj.add(this.nameTag((e as unknown as { name: string }).name));
        return { obj, model, modelKey: key };
      }
    }
    if (e instanceof ItemEntity) {
      const mesh = this.items.create(e.stack.id);
      const s = mesh.userData.isBlock ? 0.25 : 0.4;
      mesh.scale.setScalar(s);
      const obj = new THREE.Group();
      obj.add(mesh);
      if (e.stack.count > 1) {
        const m2 = mesh.clone();
        m2.position.set(0.06, 0.04, 0.05);
        obj.add(m2);
      }
      return { obj, mats: [mesh.material as THREE.MeshBasicMaterial] };
    }
    if (e instanceof XpOrb) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: this.xpTexture, transparent: true, depthWrite: false }));
      sp.scale.setScalar(0.25 + Math.min(0.2, e.amount * 0.02));
      return { obj: sp };
    }
    if (e instanceof Projectile) return { obj: this.projectileMesh(e.kind) };
    if (e instanceof FallingBlock) {
      const m = this.items.create(blockId(e.raw));
      const obj = new THREE.Group();
      m.position.y = 0.5;
      obj.add(m);
      return { obj, mats: [] };
    }
    if (e instanceof PrimedTnt) {
      const m = this.items.create(BLOCKS.find((b) => b?.key === 'tnt')!.id);
      m.position.y = 0.5;
      const obj = new THREE.Group();
      obj.add(m);
      return { obj, mats: (Array.isArray(m.material) ? m.material : [m.material]) as THREE.MeshBasicMaterial[] };
    }
    if (e instanceof Lightning) {
      const pts: number[] = [];
      let x = 0;
      let z = 0;
      for (let y = 120; y > 0; y -= 6) {
        const nx = x + (Math.random() - 0.5) * 3;
        const nz = z + (Math.random() - 0.5) * 3;
        pts.push(x, y, z, nx, y - 6, nz);
        x = nx;
        z = nz;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
      this.lightningFlash = 1;
      return { obj: new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xe8f0ff })) };
    }
    const m = new THREE.Mesh(new THREE.BoxGeometry(e.width, e.height, e.width), new THREE.MeshBasicMaterial({ color: 0xff00ff }));
    m.position.y = e.height / 2;
    return { obj: m };
  }

  private nameTag(name: string): THREE.Sprite {
    const c = document.createElement('canvas');
    const g = c.getContext('2d')!;
    g.font = '16px VoxPixel, monospace';
    const w = Math.ceil(g.measureText(name).width) + 10;
    c.width = w;
    c.height = 22;
    g.fillStyle = 'rgba(0,0,0,0.45)';
    g.fillRect(0, 0, w, 22);
    g.font = '16px VoxPixel, monospace';
    g.fillStyle = '#fff';
    g.fillText(name, 5, 16);
    const t = new THREE.CanvasTexture(c);
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true }));
    sp.scale.set(w / 50, 22 / 50, 1);
    sp.position.y = 2.15;
    sp.renderOrder = 20;
    return sp;
  }

  private projectileMesh(kind: string): THREE.Object3D {
    const g = new THREE.Group();
    if (kind === 'arrow') {
      const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.6), new THREE.MeshBasicMaterial({ color: 0x8a6a3a }));
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.1), new THREE.MeshBasicMaterial({ color: 0x9a9a9a }));
      head.position.z = -0.32;
      const fl = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.12), new THREE.MeshBasicMaterial({ color: 0xf0f0f0 }));
      fl.position.z = 0.26;
      g.add(shaft, head, fl);
      g.position.y = 0.1;
      return g;
    }
    const colors: Record<string, number> = { fireball: 0xff7a10, small_fireball: 0xffa020, snowball: 0xffffff, egg: 0xe8d8b8, poison: 0x7a2a9a, boulder: 0x8a8060, lightning_orb: 0x9ad8ff, beam: 0x3a9ad8 };
    const size = kind === 'fireball' ? 0.6 : kind === 'boulder' ? 0.9 : kind === 'small_fireball' ? 0.3 : 0.22;
    const m = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), new THREE.MeshBasicMaterial({ color: colors[kind] ?? 0xffffff }));
    m.position.y = size / 2;
    g.add(m);
    return g;
  }

  private animate(e: Entity, v: View, alpha: number, dt: number, light: number): void {
    const obj = v.obj;
    const yaw = e.prevYaw + angleDiff(e.prevYaw, e.yaw) * alpha;
    if (e instanceof ItemEntity) {
      const t = performance.now() / 1000;
      obj.children[0].rotation.y = t * 1.5 + e.spin;
      obj.children[0].position.y = 0.15 + Math.sin(t * 2 + e.spin) * 0.06;
      for (const m of v.mats ?? []) m.color.setScalar(light);
      return;
    }
    if (e instanceof PrimedTnt) {
      const flash = Math.floor(e.fuse / 5) % 2 === 0;
      for (const m of v.mats ?? []) m.color.setScalar(flash ? 1.8 : light);
      const s = 1 + Math.max(0, (10 - e.fuse) / 10) * 0.2;
      obj.scale.setScalar(s);
      return;
    }
    if (e instanceof Projectile) {
      obj.rotation.set(0, 0, 0);
      obj.rotation.order = 'YXZ';
      obj.rotation.y = yaw;
      obj.rotation.x = e.pitch;
      return;
    }
    if (!v.model) return;
    const model = v.model;
    // Changement de modèle (mouton tondu…)
    const key = this.modelKeyFor(e);
    if (key !== v.modelKey && MODELS[key]) {
      model.dispose();
      const nm = this.models.create(key);
      obj.add(nm.root);
      v.model = nm;
      v.modelKey = key;
      return;
    }
    const mob = e instanceof Mob ? e : null;
    model.root.rotation.set(0, yaw, 0);
    const s = mob ? mob.sizeScale : 1;
    model.root.scale.setScalar(s);
    model.setLight(light, e.hurtTime > 5 || (mob?.fuse ?? -1) > 0 && Math.floor((mob!.fuse) / 3) % 2 === 0);
    if (e.dead) {
      model.root.rotation.z = Math.min(Math.PI / 2, (e.deathTime + alpha) / 10);
      return;
    }
    const walk = mob ? mob.walkAnim : (e as unknown as { walkDist: number }).walkDist * 3 || 0;
    const amp = mob ? mob.walkSpeed : Math.min(1, Math.hypot(e.pos.x - e.prevPos.x, e.pos.z - e.prevPos.z) * 5);
    const sw = Math.sin(walk) * 0.8 * amp;
    const t = performance.now() / 1000;
    const parts = model.parts;
    if (parts.has('rightLeg')) {
      model.pose('rightLeg', sw);
      model.pose('leftLeg', -sw);
      const zombie = mob && (mob.type === 'zombie' || mob.type === 'husk');
      const swing = mob ? Math.sin((mob.swing / 8) * Math.PI) : Math.sin(((e as unknown as { swingTime: number }).swingTime ?? 0) * Math.PI);
      model.pose('rightArm', (zombie ? 0 : -sw) - swing * 1.2 + Math.sin(t * 1.2) * 0.03, 0, Math.sin(t) * 0.04);
      model.pose('leftArm', (zombie ? 0 : sw) + Math.sin(t * 1.1) * 0.03, 0, -Math.sin(t) * 0.04);
      if (mob instanceof Villager && mob.sleeping) model.root.rotation.z = Math.PI / 2;
      const hy = mob ? mob.headYaw : 0;
      model.pose('head', mob ? 0 : e.pitch, Math.max(-1, Math.min(1, hy)), 0);
    }
    if (parts.has('leg0') && parts.has('leg3')) {
      if (parts.has('wing0')) {
        model.pose('wing0', 0, 0, Math.sin(t * 6) * 0.5);
        model.pose('wing1', 0, 0, -Math.sin(t * 6) * 0.5);
      }
      model.pose('leg0', sw);
      model.pose('leg3', sw);
      model.pose('leg1', -sw);
      model.pose('leg2', -sw);
      if (parts.has('tail')) model.pose('tail', Math.sin(t * 2) * 0.1, Math.sin(t * 3) * 0.2);
    }
    if (parts.has('wing0') && !parts.has('leg0')) {
      const flap = mob?.def.flies ? Math.sin(t * 8) * 0.6 : Math.sin(walk) * 0.2;
      model.pose('wing0', 0, 0, flap);
      model.pose('wing1', 0, 0, -flap);
      if (parts.has('leg0')) {
        model.pose('leg0', sw);
        model.pose('leg1', -sw);
      }
    } else if (parts.has('leg0') && !parts.has('leg3')) {
      model.pose('leg0', sw);
      model.pose('leg1', -sw);
    }
    if (parts.has('leg7')) for (let i = 0; i < 8; i++) model.pose('leg' + i, Math.sin(walk + i) * 0.3 * amp, 0, 0);
    if (parts.has('arm0')) for (let i = 0; i < 6; i++) model.pose('arm' + i, Math.sin(t * 2 + i) * 0.3, 0, 0);
    if (parts.has('rod0')) for (let i = 0; i < 4; i++) {
      const g = parts.get('rod' + i)!;
      const a = t * 2 + (i * Math.PI) / 2;
      g.position.set(Math.cos(a) * 7, 6 + Math.sin(t * 3 + i) * 2, Math.sin(a) * 7);
    }
    if (parts.has('fluke') || parts.has('fin')) {
      if (parts.has('tail')) model.pose('tail', Math.sin(t * 4) * 0.25, Math.sin(t * 6) * 0.3, 0);
    }
    if (mob && (mob.type === 'slime' || mob.type === 'crystal_slime' || mob.type === 'magma_cube')) {
      const sq = mob.onGround ? 1 : 1.15;
      model.root.scale.set(s, s * sq, s);
    }
    if (mob?.def.flies && mob.type !== 'sky_dragon') model.root.position.y = Math.sin(t * 2 + mob.id) * 0.1;
    if (mob?.isBoss && mob.type === 'sky_dragon') {
      model.pose('neck', Math.sin(t) * 0.1);
      model.pose('tail', Math.sin(t * 1.5) * 0.15, Math.sin(t) * 0.2);
    }
    void dt;
  }

  private disposeView(v: View): void {
    v.model?.dispose();
    v.obj.removeFromParent();
    v.obj.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | THREE.Material[] | undefined;
      if (m && !(o.parent && v.model)) (Array.isArray(m) ? m : [m]).forEach((x) => x !== undefined && (x as THREE.Material).dispose?.());
    });
  }

  /** Premier être vivant touché par un rayon (attaque, interaction). */
  raycast(origin: THREE.Vector3, dir: THREE.Vector3, maxDist: number, exclude: Entity | null): { entity: Entity; dist: number } | null {
    let best: { entity: Entity; dist: number } | null = null;
    for (const e of this.list) {
      if (e === exclude || e.removed || e.dead || e === exclude?.vehicle) continue;
      if (!(e.living || e instanceof Vehicle)) continue;
      const b = e.box;
      const pad = 0.1;
      const r = rayAabb(origin, dir, b.x0 - pad, b.y0 - pad, b.z0 - pad, b.x1 + pad, b.y1 + pad, b.z1 + pad);
      if (r !== null && r <= maxDist && (!best || r < best.dist)) best = { entity: e, dist: r };
    }
    return best;
  }

  /** Remplit un coffre de structure. */
  static isOpaque(id: number): boolean {
    return OPAQUE[id] === 1;
  }
}

function rayAabb(o: THREE.Vector3, d: THREE.Vector3, x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): number | null {
  let tmin = 0;
  let tmax = Infinity;
  const lo = [x0, y0, z0];
  const hi = [x1, y1, z1];
  const oo = [o.x, o.y, o.z];
  const dd = [d.x, d.y, d.z];
  for (let a = 0; a < 3; a++) {
    if (Math.abs(dd[a]) < 1e-9) {
      if (oo[a] < lo[a] || oo[a] > hi[a]) return null;
      continue;
    }
    let t1 = (lo[a] - oo[a]) / dd[a];
    let t2 = (hi[a] - oo[a]) / dd[a];
    if (t1 > t2) [t1, t2] = [t2, t1];
    tmin = Math.max(tmin, t1);
    tmax = Math.min(tmax, t2);
    if (tmin > tmax) return null;
  }
  return tmin;
}

function angleDiff(a: number, b: number): number {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

export { blockMeta, biomeById };
