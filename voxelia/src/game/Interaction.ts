/**
 * Interactions du joueur : viser, casser (temps selon outil), poser (orientation, dalles,
 * portes, lits, rails…), utiliser les objets (nourriture, seaux, arc, œufs, poudre d'os,
 * houe, briquet/portails, véhicules) et combattre.
 */
import * as THREE from 'three';
import { B, BLOCKS, REPLACEABLE, WATERLOGGED, IS_LIQUID, type BlockDef } from '../world/blocks';
import { blockId, blockMeta } from '../world/constants';
import { collisionBoxes, selectionBoxes, needsConnections } from '../world/models';
import { raycast, FACE_NORMALS, type RayHit } from '../world/Raycast';
import { connectionMask, intersects, aabb } from '../entity/physics';
import { blockDrops, breakTime, supportsPlant } from './drops';
import { ITEMS, ITEM_BY_KEY, itemId, type ItemStack } from '../items/items';
import { Mob } from '../entities/Mob';
import { Boat, FlyingCarpet, Minecart, Vehicle } from '../entities/misc';
import type { Entity } from '../entity/Entity';
import type { InputState } from '../input/InputManager';
import type { Game } from './Game';

const HORIZ = [
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 0],
];

/** Direction horizontale regardée (0 sud, 1 ouest, 2 nord, 3 est). */
export function lookDir(yaw: number): number {
  const fx = -Math.sin(yaw);
  const fz = -Math.cos(yaw);
  if (Math.abs(fz) >= Math.abs(fx)) return fz > 0 ? 0 : 2;
  return fx < 0 ? 1 : 3;
}

function dirOf(dx: number, dz: number): number {
  if (dz > 0) return 0;
  if (dx < 0) return 1;
  if (dz < 0) return 2;
  return 3;
}

export class Interaction {
  target: RayHit | null = null;
  targetEntity: Entity | null = null;
  breaking: { x: number; y: number; z: number; progress: number; sound: number } | null = null;
  private useCooldown = 0;
  private attackCooldown = 0;
  private creativeBreakCooldown = 0;
  eating = 0;
  bowCharge = 0;
  private fishing: { x: number; y: number; z: number; bite: number; timer: number } | null = null;

  constructor(private game: Game) {}

  get reach(): number {
    return this.game.player.creative ? 6 : 5;
  }

  frame(dt: number, input: InputState): void {
    const g = this.game;
    const p = g.player;
    if (this.useCooldown > 0) this.useCooldown -= dt;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;
    if (this.creativeBreakCooldown > 0) this.creativeBreakCooldown -= dt;
    if (p.dead || g.uiOpen) {
      this.reset();
      return;
    }
    // Visée
    const eye = g.cameraEye();
    const dir = p.lookDir();
    this.target = raycast(g.world, eye, dir, this.reach);
    const ent = g.entities.raycast(eye, dir, this.target ? Math.min(this.target.dist, this.reach - 1.5) : this.reach - 1.5, p);
    this.targetEntity = ent?.entity ?? null;
    if (this.target && !this.targetEntity && p.gameMode !== 'spectator') {
      const d = BLOCKS[this.target.id];
      const conn = needsConnections(d.shape) ? connectionMask(g.world, this.target.x, this.target.y, this.target.z, d.shape) : 0;
      g.selection.show(this.target.x, this.target.y, this.target.z, selectionBoxes(d, this.target.meta, conn));
    } else g.selection.hide();

    // Attaque / destruction
    if (input.attackPressed && this.targetEntity) {
      this.attack(this.targetEntity);
    } else if (input.attack && !this.targetEntity && this.target) {
      this.mine(dt);
    } else {
      this.breaking = null;
      g.breakOverlay.hide();
    }
    if (input.attackPressed && !this.target && !this.targetEntity) g.hand.swing = 1;

    // Utilisation
    const held = p.heldItem();
    const def = held ? ITEMS[held.id] : undefined;
    if (input.use && def?.use === 'food') {
      this.eat(dt, held!);
    } else this.eating = 0;
    if (def?.use === 'bow') {
      if (input.use) this.bowCharge = Math.min(1, this.bowCharge + dt);
      else if (this.bowCharge > 0) this.releaseBow();
    } else this.bowCharge = 0;
    g.hand.eating = this.eating > 0.2 ? this.eating : 0;
    g.hand.drawing = this.bowCharge;
    if (input.usePressed || (input.use && this.useCooldown <= 0 && def?.use !== 'food' && def?.use !== 'bow')) {
      if (this.useCooldown <= 0 || input.usePressed) {
        this.use();
        this.useCooldown = 0.25;
      }
    }
    if (this.fishing) this.updateFishing(dt);
  }

  reset(): void {
    this.breaking = null;
    this.eating = 0;
    this.bowCharge = 0;
    this.game.breakOverlay.hide();
  }

  // ------------------------------------------------------------------ casser
  private mine(dt: number): void {
    const g = this.game;
    const p = g.player;
    const t = this.target!;
    if (p.gameMode === 'adventure' || p.gameMode === 'spectator') return;
    const def = BLOCKS[t.id];
    if (p.creative) {
      if (this.creativeBreakCooldown > 0) return;
      const held = p.heldItem();
      if (held && ITEMS[held.id]?.tool?.type === 'sword') return;
      this.creativeBreakCooldown = 0.22;
      this.breakBlock(t.x, t.y, t.z);
      return;
    }
    if (!this.breaking || this.breaking.x !== t.x || this.breaking.y !== t.y || this.breaking.z !== t.z) this.breaking = { x: t.x, y: t.y, z: t.z, progress: 0, sound: 0 };
    const time = breakTime(def, p.heldItem(), p.onGround || p.flying, p.fluid.eyesInWater, p.hasEffect('haste') ? 1.2 : 1);
    if (!isFinite(time)) return;
    this.breaking.progress += dt / time;
    this.breaking.sound -= dt;
    g.hand.swing = Math.max(g.hand.swing, 0.6);
    if (this.breaking.sound <= 0) {
      this.breaking.sound = 0.25;
      g.app.audio.material(def.sound, 'hit', { x: t.x + 0.5, y: t.y + 0.5, z: t.z + 0.5 });
      g.particles.blockBreak(t.x, t.y, t.z, t.id, true, t.face);
    }
    const conn = needsConnections(def.shape) ? connectionMask(g.world, t.x, t.y, t.z, def.shape) : 0;
    const box = selectionBoxes(def, t.meta, conn)[0] ?? [0, 0, 0, 16, 16, 16];
    g.breakOverlay.show(t.x, t.y, t.z, this.breaking.progress, box);
    if (this.breaking.progress >= 1) {
      this.breakBlock(t.x, t.y, t.z);
      this.breaking = null;
      g.breakOverlay.hide();
      this.creativeBreakCooldown = 0.05;
    }
  }

  /** Casse un bloc : butin, expérience, usure de l'outil, sons, particules. */
  breakBlock(x: number, y: number, z: number, byPlayer = true): void {
    const g = this.game;
    const p = g.player;
    const raw = g.world.raw(x, y, z);
    const id = blockId(raw);
    const meta = blockMeta(raw);
    const def = BLOCKS[id];
    if (!def || id === 0 || (def.hardness < 0 && !p.creative)) return;
    if (def.hardness < 0 && p.creative && def.key === 'bedrock') {
      /* le créatif peut casser le socle */
    }
    if (g.net && !g.net.canEdit(x, y, z)) return;
    g.particles.blockBreak(x, y, z, id);
    g.app.audio.material(def.sound, 'break', { x: x + 0.5, y: y + 0.5, z: z + 0.5 });
    // Seconde moitié des portes / lits
    if (def.shape === 'door') {
      const oy = meta & 8 ? y - 1 : y + 1;
      if (g.world.id(x, oy, z) === id) g.world.set(x, oy, z, 0, 0, 'player');
    }
    if (def.shape === 'bed') {
      const [dx, dz] = HORIZ[meta & 3];
      const s = meta & 8 ? -1 : 1;
      if (g.world.id(x + dx * s, y, z + dz * s) === id) g.world.set(x + dx * s, y, z + dz * s, 0, 0, 'player');
    }
    // Contenu des coffres / fours (à lire avant de retirer le bloc, qui efface ses données)
    const be = g.world.blockEntity(x, y, z);
    // Les blocs contenant de l'eau laissent de l'eau
    const leaveWater = def.waterlogged && def.key !== 'water';
    g.world.set(x, y, z, leaveWater ? B.water : def.key === 'ice' && !p.creative && BLOCKS[g.world.id(x, y - 1, z)]?.solid ? B.water : 0, 0, 'player');
    if (be) {
      for (const s of (be.items as Array<ItemStack | null>) ?? []) if (s) g.dropItem(x + 0.5, y + 0.5, z + 0.5, s);
      g.world.setBlockEntity(x, y, z, null);
    }
    if (!byPlayer) return;
    p.stats.blocksMined = (p.stats.blocksMined ?? 0) + 1;
    if (!p.creative) {
      const held = p.heldItem();
      const { items, xp } = blockDrops(def, meta, held);
      for (const s of items) g.dropItem(x + 0.5, y + 0.3, z + 0.5, s);
      if (xp > 0) g.dropXp(x + 0.5, y + 0.5, z + 0.5, xp);
      p.exhaust(0.005);
      if (held && ITEMS[held.id]?.tool && def.hardness > 0) this.damageHeld(ITEMS[held.id]!.tool!.type === 'sword' ? 2 : 1);
    }
  }

  damageHeld(n: number): void {
    const p = this.game.player;
    const held = p.heldItem();
    if (!held || p.creative) return;
    const max = ITEMS[held.id]?.tool?.durability;
    if (!max) return;
    held.damage = (held.damage ?? 0) + n;
    if (held.damage >= max) {
      p.inventory.set(p.inventory.selected, null);
      this.game.app.audio.play('break_tool');
      this.game.app.audio.material('wood', 'break');
    } else p.inventory.changed();
  }

  // ------------------------------------------------------------------ combat
  attack(e: Entity): void {
    const g = this.game;
    const p = g.player;
    if (p.gameMode === 'spectator') return;
    g.hand.swing = 1;
    if (this.attackCooldown > 0) return;
    const held = p.heldItem();
    const tool = held ? ITEMS[held.id]?.tool : undefined;
    let dmg = tool ? tool.damage : held ? ITEMS[held.id]?.damage ?? 1 : 1;
    if (p.hasEffect('strength')) dmg += 3;
    const crit = !p.onGround && p.vel.y < 0 && !p.fluid.water && !p.climbing;
    if (crit) dmg *= 1.5;
    this.attackCooldown = tool?.type === 'sword' ? 0.45 : tool?.type === 'axe' ? 0.8 : 0.35;
    const dir = new THREE.Vector3(e.pos.x - p.pos.x, 0, e.pos.z - p.pos.z).normalize();
    const kb = dir.multiplyScalar(p.sprinting ? 0.8 : 0.45).setY(0.35);
    if (e instanceof Vehicle) {
      e.hurt(p.creative ? 99 : 1, { type: 'attack', attacker: p });
      g.app.audio.material('wood', 'hit', e.pos);
      return;
    }
    if (e.hurt(dmg, { type: 'attack', attacker: p, knockback: kb })) {
      g.app.audio.play(crit ? 'crit' : 'hit', { x: e.pos.x, y: e.pos.y, z: e.pos.z });
      if (crit) g.particles.crit(e.pos.x, e.pos.y + e.height * 0.7, e.pos.z);
      p.exhaust(0.1);
      if (p.sprinting) p.sprinting = false;
      if (tool) this.damageHeld(tool.type === 'sword' ? 1 : 2);
      if (held && ITEMS[held.id]?.key === 'golden_sword' && e instanceof Mob) e.fireTicks = 60;
    }
  }

  // ------------------------------------------------------------------ utiliser
  private use(): void {
    const g = this.game;
    const p = g.player;
    if (p.gameMode === 'spectator') return;
    const held = p.heldItem();
    const def = held ? ITEMS[held.id] : undefined;
    // Entités
    if (this.targetEntity) {
      const e = this.targetEntity;
      g.hand.swing = 1;
      if (e instanceof Mob && e.interact(g, p)) return;
      if (e instanceof Vehicle && !p.sneaking) {
        g.mount(p, e);
        return;
      }
      if (def?.use === 'spawn_egg' && def.data) {
        g.spawnMob(def.data, e.pos.x, e.pos.y, e.pos.z, { baby: true });
        return;
      }
    }
    const t = this.target;
    // Blocs interactifs
    if (t && !(p.sneaking && held)) {
      if (this.interactBlock(t)) return;
    }
    if ((def?.use || def?.armor) && this.useItem(held!, def.use ?? '', t)) return;
    if (!t) return;
    // Pose de bloc
    const blockToPlace = held ? def?.block : undefined;
    if (blockToPlace !== undefined && blockToPlace >= 0) this.place(held!, blockToPlace, t);
  }

  private interactBlock(t: RayHit): boolean {
    const g = this.game;
    const w = g.world;
    const def = BLOCKS[t.id];
    if (!def?.interact && def.key !== 'ancient_core') return false;
    if (g.net && !g.net.canEdit(t.x, t.y, t.z) && def.interact !== 'crafting') return false;
    const meta = t.meta;
    g.hand.swing = 1;
    switch (def.interact) {
      case 'door': {
        const by = meta & 8 ? t.y - 1 : t.y;
        const bm = w.meta(t.x, by, t.z);
        const open = !(bm & 4);
        w.set(t.x, by, t.z, def.id, open ? bm | 4 : bm & ~4);
        const tm = w.meta(t.x, by + 1, t.z);
        if (w.id(t.x, by + 1, t.z) === def.id) w.set(t.x, by + 1, t.z, def.id, open ? tm | 4 : tm & ~4);
        g.app.audio.play(open ? 'door_open' : 'door_close', { x: t.x, y: t.y, z: t.z });
        return true;
      }
      case 'trapdoor':
        w.set(t.x, t.y, t.z, def.id, meta ^ 4);
        g.app.audio.play(meta & 4 ? 'door_close' : 'door_open', { x: t.x, y: t.y, z: t.z });
        return true;
      case 'lever':
        w.set(t.x, t.y, t.z, def.id, meta ^ 8);
        g.app.audio.play('lever', { x: t.x, y: t.y, z: t.z });
        return true;
      case 'button':
        g.power.pressButton(t.x, t.y, t.z);
        g.app.audio.play('lever', { x: t.x, y: t.y, z: t.z });
        return true;
      case 'crafting':
        g.openCrafting();
        return true;
      case 'furnace':
        g.openFurnace(t.x, t.y, t.z);
        return true;
      case 'chest':
      case 'barrel':
        g.openChest(t.x, t.y, t.z);
        return true;
      case 'bed':
        g.sleep(t.x, t.y, t.z);
        return true;
      case 'tnt': {
        const held = g.player.heldItem();
        if (held && ITEMS[held.id]?.key === 'flint_and_steel') {
          w.set(t.x, t.y, t.z, 0, 0);
          g.igniteTnt(t.x, t.y, t.z);
          this.damageHeld(1);
          return true;
        }
        return false;
      }
    }
    if (def.key === 'ancient_core') {
      g.awakenNearbyBoss(t.x, t.y, t.z);
      return true;
    }
    return false;
  }

  private useItem(stack: ItemStack, use: string, t: RayHit | null): boolean {
    const g = this.game;
    const p = g.player;
    const w = g.world;
    const adj = t ? this.adjacent(t) : null;
    switch (use) {
      case 'bucket': {
        const eye = g.cameraEye();
        const hit = raycast(w, eye, p.lookDir(), this.reach, true);
        if (!hit) return false;
        const id = w.id(hit.x, hit.y, hit.z);
        if ((id === B.water || id === B.lava) && w.meta(hit.x, hit.y, hit.z) === 0) {
          w.set(hit.x, hit.y, hit.z, 0, 0);
          this.replaceHeld(id === B.water ? 'water_bucket' : 'lava_bucket');
          g.app.audio.play('bucket_fill', { x: hit.x, y: hit.y, z: hit.z });
          return true;
        }
        return false;
      }
      case 'water_bucket':
      case 'lava_bucket': {
        if (!t) return false;
        const target = REPLACEABLE[t.id] && !IS_LIQUID[t.id] ? { x: t.x, y: t.y, z: t.z } : adj!;
        const cur = w.id(target.x, target.y, target.z);
        if (cur !== 0 && !REPLACEABLE[cur]) return false;
        if (use === 'water_bucket' && g.dimension === 1) {
          g.particles.puff(target.x + 0.5, target.y + 0.5, target.z + 0.5, 0xffffff, 12, 1, -1, 0.15, 1);
          g.app.audio.play('fire');
        } else w.set(target.x, target.y, target.z, use === 'water_bucket' ? B.water : B.lava, 0);
        if (!p.creative) this.replaceHeld('bucket');
        g.app.audio.play('bucket_empty', target);
        return true;
      }
      case 'milk_bucket':
        p.effects.clear();
        if (!p.creative) this.replaceHeld('bucket');
        g.app.audio.play('eat');
        return true;
      case 'flint_and_steel': {
        if (!t || !adj) return false;
        g.hand.swing = 1;
        if (g.tryCreatePortal(adj.x, adj.y, adj.z, 'ember')) {
          this.damageHeld(1);
          return true;
        }
        if (w.id(adj.x, adj.y, adj.z) === 0) {
          w.set(adj.x, adj.y, adj.z, B.fire, 0);
          g.app.audio.play('ignite', adj);
          this.damageHeld(1);
          return true;
        }
        return false;
      }
      case 'sky_key': {
        if (!t || !adj) return false;
        g.hand.swing = 1;
        if (g.tryCreatePortal(adj.x, adj.y, adj.z, 'sky')) return true;
        g.message('Construisez un cadre de blocs de cristal (4×5) puis utilisez la clé à l’intérieur.');
        return true;
      }
      case 'snowball':
      case 'egg': {
        const dir = p.lookDir();
        g.spawnProjectile(use, p, g.cameraEye().addScaledVector(dir, 0.5), dir.multiplyScalar(1.4));
        if (!p.creative) p.inventory.consumeHeld();
        g.hand.swing = 1;
        g.app.audio.play('bow', { x: p.pos.x, y: p.pos.y, z: p.pos.z, pitch: 1.5 });
        return true;
      }
      case 'spawn_egg': {
        if (!adj) return false;
        const def = ITEMS[stack.id];
        if (def?.data) g.spawnMob(def.data, adj.x + 0.5, adj.y, adj.z + 0.5, { persistent: true, force: true });
        if (!p.creative) p.inventory.consumeHeld();
        return true;
      }
      case 'boat':
      case 'minecart':
      case 'carpet_ride': {
        if (!t) return false;
        let v: Vehicle;
        if (use === 'minecart') {
          if (BLOCKS[t.id]?.shape !== 'rail') return false;
          v = new Minecart();
          g.spawnEntity(v, t.x + 0.5, t.y + 0.1, t.z + 0.5);
        } else {
          v = use === 'boat' ? new Boat() : new FlyingCarpet();
          const pos = WATERLOGGED[t.id] ? { x: t.x, y: t.y + 0.9, z: t.z } : { x: adj!.x, y: adj!.y, z: adj!.z };
          g.spawnEntity(v, pos.x + 0.5, pos.y, pos.z + 0.5);
        }
        v.yaw = p.yaw;
        if (!p.creative) p.inventory.consumeHeld();
        return true;
      }
      case 'bone_meal': {
        if (!t) return false;
        if (this.boneMeal(t)) {
          if (!p.creative) p.inventory.consumeHeld();
          g.particles.magic(t.x + 0.5, t.y + 0.6, t.z + 0.5, 0x80ff60, 10);
          return true;
        }
        return false;
      }
      case 'hoe': {
        if (!t || t.face === 3) return false;
        if ((t.id === B.grass_block || t.id === B.dirt || t.id === B.dirt_path || t.id === B.coarse_dirt) && w.id(t.x, t.y + 1, t.z) === 0) {
          w.set(t.x, t.y, t.z, B.farmland, 0);
          g.app.audio.material('gravel', 'place', { x: t.x, y: t.y, z: t.z });
          this.damageHeld(1);
          g.hand.swing = 1;
          return true;
        }
        return false;
      }
      case 'glider': {
        const old = p.inventory.armor.get(1);
        p.inventory.armor.set(1, { ...stack });
        p.inventory.set(p.inventory.selected, old);
        g.app.audio.play('chest_close');
        return true;
      }
      case 'fishing_rod': {
        if (this.fishing) {
          if (this.fishing.bite > 0) {
            const loot = Math.random() < 0.6 ? 'raw_cod' : Math.random() < 0.7 ? 'raw_salmon' : ['string', 'bone', 'leather', 'emerald', 'saddle', 'book'][Math.floor(Math.random() * 6)];
            p.inventory.give({ id: itemId(loot), count: 1 });
            g.dropXp(p.pos.x, p.pos.y, p.pos.z, 1 + Math.floor(Math.random() * 6));
            g.app.audio.play('pop');
            this.damageHeld(1);
          }
          this.fishing = null;
          return true;
        }
        const hit = raycast(w, g.cameraEye(), p.lookDir(), 12, true);
        if (hit && WATERLOGGED[hit.id]) {
          this.fishing = { x: hit.x, y: hit.y, z: hit.z, bite: 0, timer: 3 + Math.random() * 10 };
          g.app.audio.play('swim', hit);
          return true;
        }
        return false;
      }
      case 'map':
        g.toggleMap();
        return true;
      case 'compass': {
        const s = g.spawnPoint();
        const d = Math.hypot(s[0] - p.pos.x, s[2] - p.pos.z);
        const ang = (Math.atan2(s[0] - p.pos.x, s[2] - p.pos.z) * 180) / Math.PI;
        const dirs = ['sud', 'sud-est', 'est', 'nord-est', 'nord', 'nord-ouest', 'ouest', 'sud-ouest'];
        g.message(`Point d'apparition : ${Math.round(d)} blocs vers le ${dirs[Math.round(((ang + 360) % 360) / 45) % 8]}.`);
        return true;
      }
      case 'saddle':
        return false;
    }
    // Armures : clic droit pour s'équiper
    const def = ITEMS[stack.id];
    if (def?.armor && def.use !== 'glider') {
      const slot = ['head', 'chest', 'legs', 'feet'].indexOf(def.armor.slot);
      const old = p.inventory.armor.get(slot);
      p.inventory.armor.set(slot, { ...stack });
      p.inventory.set(p.inventory.selected, old);
      g.app.audio.play('chest_close');
      return true;
    }
    return false;
  }

  private updateFishing(dt: number): void {
    const f = this.fishing!;
    const g = this.game;
    if (g.player.pos.distanceTo(new THREE.Vector3(f.x, f.y, f.z)) > 20) {
      this.fishing = null;
      return;
    }
    if (f.bite > 0) {
      f.bite -= dt;
      if (f.bite <= 0) {
        f.timer = 3 + Math.random() * 10;
        g.message('Le poisson s’est échappé…');
      }
      return;
    }
    f.timer -= dt;
    if (Math.random() < dt * 2) g.particles.bubbles(f.x + 0.5, f.y + 0.9, f.z + 0.5, 1);
    if (f.timer <= 0) {
      f.bite = 1.2;
      g.particles.splash(f.x + 0.5, f.y + 1, f.z + 0.5);
      g.app.audio.play('splash', { x: f.x, y: f.y, z: f.z });
      g.message('Ça mord ! Utilisez la canne à pêche !');
    }
  }

  private boneMeal(t: RayHit): boolean {
    const g = this.game;
    const w = g.world;
    const def = BLOCKS[t.id];
    if (def.shape === 'crop' && t.meta < 7) {
      w.set(t.x, t.y, t.z, t.id, Math.min(7, t.meta + 2 + Math.floor(Math.random() * 3)));
      return true;
    }
    if (def.tick === 'sapling') {
      if (Math.random() < 0.45) g.ticks.growSapling(t.x, t.y, t.z, def);
      return true;
    }
    if (t.id === B.grass_block) {
      for (let i = 0; i < 16; i++) {
        const x = t.x + Math.floor(Math.random() * 7) - 3;
        const z = t.z + Math.floor(Math.random() * 7) - 3;
        if (w.id(x, t.y, z) === B.grass_block && w.id(x, t.y + 1, z) === 0) w.set(x, t.y + 1, z, Math.random() < 0.8 ? B.short_grass : [B.dandelion, B.poppy, B.cornflower][Math.floor(Math.random() * 3)], 0);
      }
      return true;
    }
    if ((def.key === 'sugar_cane' || def.key === 'cactus') && w.id(t.x, t.y + 1, t.z) === 0) {
      w.set(t.x, t.y + 1, t.z, t.id, 0);
      return true;
    }
    return false;
  }

  private replaceHeld(key: string): void {
    const p = this.game.player;
    const held = p.heldItem();
    if (!held) return;
    if (held.count > 1) {
      held.count--;
      p.inventory.changed();
      p.inventory.give({ id: itemId(key), count: 1 });
    } else p.inventory.set(p.inventory.selected, { id: itemId(key), count: 1 });
  }

  private eat(dt: number, held: ItemStack): void {
    const g = this.game;
    const p = g.player;
    const f = ITEMS[held.id]?.food;
    if (!f) return;
    if (p.hunger >= 20 && !f.always && !p.creative) {
      this.eating = 0;
      return;
    }
    this.eating += dt;
    if (Math.floor(this.eating * 5) !== Math.floor((this.eating - dt) * 5)) g.app.audio.play('eat', { x: p.pos.x, y: p.pos.y, z: p.pos.z });
    if (this.eating >= 1.6) {
      this.eating = 0;
      if (p.eat(held)) {
        if (!p.creative) {
          const key = ITEMS[held.id]?.key;
          p.inventory.consumeHeld();
          if (key === 'mushroom_stew' || key === 'beetroot_soup') {
            /* pas de bol dans ce jeu */
          }
        }
        g.app.audio.play('burp');
      }
    }
  }

  private releaseBow(): void {
    const g = this.game;
    const p = g.player;
    const charge = this.bowCharge;
    this.bowCharge = 0;
    if (charge < 0.2) return;
    const arrow = ITEM_BY_KEY.get('arrow')!.id;
    if (!p.creative && !p.inventory.remove(arrow, 1)) {
      g.message('Il vous faut des flèches.');
      return;
    }
    const dir = p.lookDir();
    const pr = g.spawnProjectile('arrow', p, g.cameraEye().addScaledVector(dir, 0.6), dir.multiplyScalar(0.6 + charge * 2.4));
    if (pr) (pr as unknown as { damage: number }).damage = 2 + charge * 2;
    g.app.audio.play('bow', { x: p.pos.x, y: p.pos.y, z: p.pos.z });
    this.damageHeld(1);
  }

  // ------------------------------------------------------------------ poser
  private adjacent(t: RayHit): { x: number; y: number; z: number } {
    const n = FACE_NORMALS[t.face];
    return { x: t.x + n[0], y: t.y + n[1], z: t.z + n[2] };
  }

  private place(stack: ItemStack, blockIdToPlace: number, t: RayHit): void {
    const g = this.game;
    const p = g.player;
    const w = g.world;
    if (p.gameMode === 'adventure') return;
    const def = BLOCKS[blockIdToPlace];
    if (!def) return;
    const tdef = BLOCKS[t.id];
    let pos = this.adjacent(t);
    let meta = 0;
    // Remplacer les herbes hautes / neige
    if (tdef.replaceable && !IS_LIQUID[t.id] && t.id !== blockIdToPlace) pos = { x: t.x, y: t.y, z: t.z };
    // Couche de neige qui s'empile
    if (def.key === 'snow_layer' && t.id === def.id && t.meta < 7) {
      w.set(t.x, t.y, t.z, def.id, t.meta + 1);
      this.afterPlace(def, stack, t);
      return;
    }
    // Dalle double
    if (def.shape === 'slab' && t.id === def.id && t.meta !== 2 && ((t.face === 2 && t.meta === 0) || (t.face === 3 && t.meta === 1))) {
      w.set(t.x, t.y, t.z, def.id, 2);
      this.afterPlace(def, stack, t);
      return;
    }
    if (def.shape === 'slab' && w.id(pos.x, pos.y, pos.z) === def.id && w.meta(pos.x, pos.y, pos.z) !== 2) {
      w.set(pos.x, pos.y, pos.z, def.id, 2);
      this.afterPlace(def, stack, t);
      return;
    }
    const cur = w.id(pos.x, pos.y, pos.z);
    if (cur !== 0 && !REPLACEABLE[cur]) return;
    if (pos.y < 0 || pos.y >= 256) return;
    if (g.net && !g.net.canEdit(pos.x, pos.y, pos.z)) return;
    const d = lookDir(p.yaw);
    const fracY = t.point.y - t.y;
    const n = FACE_NORMALS[t.face];
    switch (def.orient) {
      case 'axis':
        meta = t.face <= 1 ? 1 : t.face >= 4 ? 2 : 0;
        break;
      case 'facing':
        if (def.shape === 'stairs') meta = d | (t.face === 3 || (t.face !== 2 && fracY > 0.5) ? 4 : 0);
        else if (def.shape === 'ladder') {
          if (t.face === 2 || t.face === 3) return;
          meta = dirOf(-n[0], -n[2]);
        } else if (def.shape === 'trapdoor') meta = ((d + 2) % 4) | (t.face === 3 || (t.face !== 2 && fracY > 0.5) ? 8 : 0);
        else if (def.shape === 'door' || def.shape === 'bed') meta = d;
        else meta = (d + 2) % 4;
        break;
      case 'facing_any':
        if (t.face === 2) meta = 0;
        else if (t.face === 3) meta = 1;
        else meta = 2 + dirOf(-n[0], -n[2]);
        if (def.key === 'barrel') meta = 0;
        break;
    }
    if (def.shape === 'torch') {
      if (t.face === 3) return;
      meta = t.face === 2 ? 0 : 1 + dirOf(-n[0], -n[2]);
    }
    if (def.shape === 'vine') {
      if (t.face === 2 || t.face === 3) return;
      meta = dirOf(-n[0], -n[2]);
    }
    if (def.shape === 'slab') meta = t.face === 3 || (t.face !== 2 && fracY > 0.5) ? 1 : 0;
    if (def.key.endsWith('_leaves')) meta = 1;
    // Supports nécessaires
    const below = w.id(pos.x, pos.y - 1, pos.z);
    if (def.shape === 'cross' || def.shape === 'crop') {
      if (!supportsPlant(below, def.key) && def.key !== 'cobweb' && def.key !== 'crystal_cluster') return;
      if (def.key === 'sugar_cane' && below !== def.id && !this.nearWater(pos.x, pos.y - 1, pos.z)) return;
    }
    if (def.shape === 'lily' && !WATERLOGGED[w.id(t.x, t.y, t.z)]) {
      const hit = raycast(w, g.cameraEye(), p.lookDir(), this.reach, true);
      if (!hit || !WATERLOGGED[hit.id]) return;
      pos = { x: hit.x, y: hit.y + 1, z: hit.z };
      if (w.id(pos.x, pos.y, pos.z) !== 0) return;
    }
    if (['rail', 'wire', 'plate', 'carpet', 'layer'].includes(def.shape) && !BLOCKS[below]?.solid) return;
    if (def.shape === 'cactus' && below !== B.sand && below !== B.red_sand && below !== B.cactus) return;
    // Portes : deux blocs de haut
    if (def.shape === 'door') {
      const above = w.id(pos.x, pos.y + 1, pos.z);
      if ((above !== 0 && !REPLACEABLE[above]) || !BLOCKS[below]?.solid) return;
      // Charnière à droite s'il y a une porte à gauche
      const [lx, lz] = HORIZ[(d + 1) % 4];
      if (w.id(pos.x + lx, pos.y, pos.z + lz) === def.id) meta |= 16;
    }
    if (def.shape === 'bed') {
      const [dx, dz] = HORIZ[d];
      const head = w.id(pos.x + dx, pos.y, pos.z + dz);
      if (head !== 0 && !REPLACEABLE[head]) return;
    }
    // Collision avec le joueur ou une créature
    if (def.solid) {
      const conn = needsConnections(def.shape) ? connectionMask(w, pos.x, pos.y, pos.z, def.shape) : 0;
      const boxes = collisionBoxes(def, meta, conn);
      for (const b of boxes) {
        const bb = { x0: pos.x + b[0] / 16, y0: pos.y + b[1] / 16, z0: pos.z + b[2] / 16, x1: pos.x + b[3] / 16, y1: pos.y + b[4] / 16, z1: pos.z + b[5] / 16 };
        for (const e of g.entities.near(new THREE.Vector3(pos.x + 0.5, pos.y + 0.5, pos.z + 0.5), 3)) if (e.living && !e.dead && intersects(e.box, bb)) return;
        if (p.gameMode !== 'spectator' && intersects(aabb(p.pos.x, p.pos.y, p.pos.z, p.width, p.height), bb)) return;
      }
    }
    w.set(pos.x, pos.y, pos.z, def.id, meta);
    if (def.shape === 'door') w.set(pos.x, pos.y + 1, pos.z, def.id, meta | 8);
    if (def.shape === 'bed') {
      const [dx, dz] = HORIZ[d];
      w.set(pos.x + dx, pos.y, pos.z + dz, def.id, meta | 8);
    }
    if (def.shape === 'rail') this.updateRails(pos.x, pos.y, pos.z);
    if (def.key === 'chest' || def.key === 'barrel') w.setBlockEntity(pos.x, pos.y, pos.z, { type: 'chest', items: new Array(27).fill(null) });
    if (def.key === 'furnace') w.setBlockEntity(pos.x, pos.y, pos.z, { type: 'furnace', items: [null, null, null], burn: 0, burnMax: 0, cook: 0, xp: 0 });
    this.afterPlace(def, stack, { ...t, x: pos.x, y: pos.y, z: pos.z });
  }

  private afterPlace(def: BlockDef, _stack: ItemStack, at: { x: number; y: number; z: number }): void {
    const g = this.game;
    const p = g.player;
    g.app.audio.material(def.sound, 'place', { x: at.x + 0.5, y: at.y + 0.5, z: at.z + 0.5 });
    g.hand.swing = 1;
    p.stats.blocksPlaced = (p.stats.blocksPlaced ?? 0) + 1;
    if (!p.creative) p.inventory.consumeHeld();
  }

  private nearWater(x: number, y: number, z: number): boolean {
    for (const [dx, dz] of HORIZ) if (WATERLOGGED[this.game.world.id(x + dx, y, z + dz)]) return true;
    return false;
  }

  /** Forme automatique des rails (droits, virages, pentes). */
  updateRails(x: number, y: number, z: number): void {
    const w = this.game.world;
    const isRail = (xx: number, yy: number, zz: number) => BLOCKS[w.id(xx, yy, zz)]?.shape === 'rail';
    const shapeAt = (xx: number, yy: number, zz: number) => {
      const n = isRail(xx, yy, zz + 1) || isRail(xx, yy + 1, zz + 1) || isRail(xx, yy - 1, zz + 1);
      const s = isRail(xx, yy, zz - 1) || isRail(xx, yy + 1, zz - 1) || isRail(xx, yy - 1, zz - 1);
      const e = isRail(xx + 1, yy, zz) || isRail(xx + 1, yy + 1, zz) || isRail(xx + 1, yy - 1, zz);
      const wv = isRail(xx - 1, yy, zz) || isRail(xx - 1, yy + 1, zz) || isRail(xx - 1, yy - 1, zz);
      // Pentes
      if (isRail(xx + 1, yy + 1, zz)) return 2;
      if (isRail(xx - 1, yy + 1, zz)) return 3;
      if (isRail(xx, yy + 1, zz - 1)) return 4;
      if (isRail(xx, yy + 1, zz + 1)) return 5;
      // Virages (+Z = sud) : 6 sud-est, 7 sud-ouest, 8 nord-ouest, 9 nord-est
      const isPowered = w.id(xx, yy, zz) === B.powered_rail;
      if (!isPowered) {
        if (n && e && !s && !wv) return 6;
        if (n && wv && !s && !e) return 7;
        if (s && wv && !n && !e) return 8;
        if (s && e && !n && !wv) return 9;
      }
      if ((e || wv) && !n && !s) return 1;
      return 0;
    };
    for (const [dx, dy, dz] of [
      [0, 0, 0],
      [1, 0, 0],
      [-1, 0, 0],
      [0, 0, 1],
      [0, 0, -1],
      [1, -1, 0],
      [-1, -1, 0],
      [0, -1, 1],
      [0, -1, -1],
    ]) {
      const xx = x + dx;
      const yy = y + dy;
      const zz = z + dz;
      if (!isRail(xx, yy, zz)) continue;
      const cur = w.meta(xx, yy, zz);
      const shape = shapeAt(xx, yy, zz);
      if ((cur & 15) !== shape) w.set(xx, yy, zz, w.id(xx, yy, zz), (cur & 16) | shape, 'tick');
    }
  }

  /** Pioche : sélectionne (ou crée en créatif) l'objet du bloc visé. */
  pickBlock(): void {
    const g = this.game;
    const p = g.player;
    const t = this.target;
    if (!t) return;
    const def = BLOCKS[t.id];
    const map: Record<string, string> = { wheat: 'wheat_seeds', carrots: 'carrot', potatoes: 'potato', beetroots: 'beetroot_seeds', energy_wire: 'energy_dust', oak_door: 'oak_door', iron_door: 'iron_door_item', red_bed: 'bed', farmland: 'dirt', kelp: 'kelp' };
    const key = map[def.key] ?? def.key;
    const it = ITEM_BY_KEY.get(key);
    if (!it) return;
    const inv = p.inventory;
    for (let i = 0; i < 9; i++)
      if (inv.get(i)?.id === it.id) {
        inv.selected = i;
        inv.changed();
        return;
      }
    if (p.creative) {
      let slot = inv.selected;
      for (let i = 0; i < 9; i++)
        if (!inv.get(i)) {
          slot = i;
          break;
        }
      inv.set(slot, { id: it.id, count: it.maxStack });
      inv.selected = slot;
      inv.changed();
      return;
    }
    for (let i = 9; i < 36; i++)
      if (inv.get(i)?.id === it.id) {
        const tmp = inv.get(inv.selected);
        inv.slots[inv.selected] = inv.get(i);
        inv.slots[i] = tmp;
        inv.changed();
        return;
      }
  }
}

export { HORIZ };
