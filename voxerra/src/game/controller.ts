/**
 * Contrôleur du joueur local : regard, déplacements, ciblage (blocs et
 * entités), minage progressif, pose, utilisation d'objets, combat, esquive,
 * caméra (1re/3e personne), balancement de la vue, sons de pas.
 */
import * as THREE from 'three';
import type { InputManager } from '../input/input';
import type { Player } from '../entity/player';
import type { Sim } from '../sim/sim';
import type { Settings } from '../app/settings';
import { stepMovement, newIntent, PLAYER_MOVE, type MoveParams } from '../entity/movement';
import { raycastBlocks, rayBox, type RayHit } from '../physics/raycast';
import { lookDir } from '../engine/math';
import { breakTime, digBlock, placeBlock, interactBlock, useItem, finishUse, useDuration, attackEntity, dropHeld, dodge, isInteractive, REACH, CREATIVE_REACH, type InteractResult } from '../sim/interact';
import { applyFall } from '../sim/survival';
import type { LivingEntity } from '../entity/living';
import { selectionBox } from '../world/shapes';
import { connectionsAt } from '../physics/collision';
import { Shape } from '../registry/blocks';
import { DIMENSION_INFO, type DimensionId } from '../worldgen/generator';

export interface ControllerHost {
  sim: Sim;
  player: Player;
  input: InputManager;
  settings: Settings;
  openBlockUI(r: NonNullable<InteractResult> & { ui: string }): void;
  playSound(name: string, x?: number, y?: number, z?: number, vol?: number): void;
  onBlockEdited(x: number, y: number, z: number): void;
  uiOpen(): boolean;
  /** Joueur piloté par un serveur distant : les actions passent par le réseau. */
  remote?: {
    dig(x: number, y: number, z: number): void;
    place(hit: RayHit, slot: number): void;
    interact(hit: RayHit): void;
    use(hit: RayHit | null, phase: 'start' | 'finish', held: number): void;
    attack(id: number): void;
    drop(all: boolean): void;
    fall(dist: number): void;
    dodge(fx: number, fz: number): void;
  };
}

export class PlayerController {
  private intent = newIntent();
  target: RayHit | null = null;
  targetEntity: LivingEntity | null = null;
  breaking: { x: number; y: number; z: number; progress: number; cell: number } | null = null;
  private breakSoundT = 0;
  private placeRepeat = 0;
  private attackRepeat = 0;
  /** 0 = 1re personne, 1 = 3e dos, 2 = 3e face */
  view = 0;
  bobPhase = 0;
  bobAmount = 0;
  swing = 0;
  private stepDist = 0;
  private sprintLock = false;
  readonly camPos = new THREE.Vector3();
  readonly camDir = new THREE.Vector3();
  private params: MoveParams = { ...PLAYER_MOVE };
  shake = 0;
  private lastGround = true;
  private useHeld = 0;
  fovMul = 1;

  constructor(private host: ControllerHost) {}

  private get p(): Player {
    return this.host.player;
  }

  update(dt: number): void {
    const { input, sim, settings } = this.host;
    const p = this.p;
    const w = sim.world(p.dim);
    const active = !this.host.uiOpen() && !p.dead;
    // ---- regard
    if (active) {
      const sens = 0.0024 * settings.sensitivity;
      if (input.locked || input.freeLook || input.touchEnabled) {
        p.yaw -= input.mouseDX * sens;
        p.pitch -= input.mouseDY * sens * (settings.invertY ? -1 : 1);
      }
      p.yaw -= input.lookX * dt * 3.2 * settings.sensitivity;
      p.pitch -= input.lookY * dt * 2.4 * settings.sensitivity * (settings.invertY ? -1 : 1);
      p.pitch = Math.max(-Math.PI / 2 + 0.001, Math.min(Math.PI / 2 - 0.001, p.pitch));
    }
    // ---- intentions de déplacement
    const it = this.intent;
    if (active) {
      it.forward = (input.isDown('forward') ? 1 : 0) - (input.isDown('back') ? 1 : 0) - input.moveY;
      it.strafe = (input.isDown('right') ? 1 : 0) - (input.isDown('left') ? 1 : 0) + input.moveX;
      it.jump = input.isDown('jump');
      it.sneak = input.isDown('sneak');
      if (input.doubleTapForward) this.sprintLock = true;
      if (it.forward <= 0) this.sprintLock = false;
      it.sprint = (input.isDown('sprint') || this.sprintLock) && it.forward > 0 && !it.sneak && (p.energy > 6 || p.creative) && !p.using;
      if (input.doubleTapJump && p.creative && !p.spectator) p.flying = !p.flying;
      if (p.spectator) p.flying = true;
    } else {
      it.forward = it.strafe = 0;
      it.jump = it.sneak = it.sprint = false;
    }
    it.flying = p.flying;
    p.sneaking = it.sneak && !p.flying;
    p.sprinting = it.sprint;
    // paramètres selon effets / dimension
    const dimInfo = DIMENSION_INFO[p.dim as DimensionId];
    this.params.speedMul = p.speedMultiplier() * (p.using?.kind === 'eat' || p.using?.kind === 'bow' ? 0.35 : 1) * (p.blocking ? 0.4 : 1);
    this.params.gravity = PLAYER_MOVE.gravity * (dimInfo?.gravity ?? 1);
    this.params.jumpVel = PLAYER_MOVE.jumpVel * Math.sqrt(dimInfo?.gravity ?? 1);
    this.params.slowFall = p.hasEffect('chute_lente');
    this.params.flySpeed = p.spectator ? 14 : 11;
    // ---- physique (sous-pas de 1/60 s)
    if (!p.dead && w.isLoaded(Math.floor(p.x), Math.floor(p.z))) {
      p.savePrev();
      let rem = Math.min(dt, 0.1);
      while (rem > 1e-4) {
        const step = Math.min(rem, 1 / 60);
        rem -= step;
        const wasGround = p.body.onGround;
        const fall = p.body.fallDist;
        if (p.spectator) {
          // spectateur : traverse les blocs
          const d = lookDir(p.yaw, 0);
          const sp = it.sprint ? 22 : 11;
          p.body.x += (d.x * it.forward - Math.cos(p.yaw) * -it.strafe * 1) * sp * step;
          p.body.z += (d.z * it.forward + Math.sin(p.yaw) * -it.strafe * 1) * sp * step;
          p.body.y += ((it.jump ? 1 : 0) - (it.sneak ? 1 : 0)) * sp * step;
          continue;
        }
        const jumping = it.jump && p.body.onGround && !p.body.inWater;
        stepMovement(w, p.body, p.yaw, it, this.params, step, p.eye);
        if (jumping) {
          p.stat('sauts');
          p.exhaust(it.sprint ? 0.2 : 0.05);
        }
        if (p.body.onGround && !wasGround && fall > 0) {
          if (this.host.remote) {
            if (fall > 3 && !p.creative) this.host.remote.fall(fall);
          } else applyFall(sim, p, fall);
          if (fall > 1.5) this.stepSound(w, 0.6);
          p.body.fallDist = 0;
        }
        if (p.body.onGround || p.body.inWater || p.flying) p.body.fallDist = 0;
      }
      const moved = Math.hypot(p.x - p.px, p.z - p.pz);
      if (p.body.onGround && !p.flying) {
        this.stepDist += moved;
        if (this.stepDist > (it.sprint ? 2.1 : 1.7)) {
          this.stepDist = 0;
          if (!p.sneaking) this.stepSound(w, 0.35);
        }
      }
      p.stat('distance', moved);
      if (it.sprint && moved > 0) p.exhaust(moved * 0.1);
      const speed = moved / Math.max(dt, 1e-3);
      this.bobAmount += ((p.body.onGround && !p.flying ? Math.min(1, speed / 5) : 0) - this.bobAmount) * Math.min(1, dt * 10);
      this.bobPhase += dt * speed * 1.9;
      if (p.body.inWater && !this.lastGround && p.body.vy < -3) this.host.playSound('pose_water', p.x, p.y, p.z, 0.6);
      this.lastGround = p.body.inWater;
    }
    this.fovMul += ((it.sprint ? 1.12 : 1) * (p.using?.kind === 'bow' ? 1 - Math.min(0.15, this.useHeld * 0.15) : 1) - this.fovMul) * Math.min(1, dt * 8);
    // ---- ciblage
    const eye = { x: p.x, y: p.y + (p.sneaking ? p.eye - 0.25 : p.eye), z: p.z };
    const d = lookDir(p.yaw, p.pitch);
    const reach = p.creative ? CREATIVE_REACH : REACH;
    this.target = p.spectator ? null : raycastBlocks(w, eye.x, eye.y, eye.z, d.x, d.y, d.z, reach);
    this.targetEntity = null;
    if (!p.spectator) {
      let best = this.target ? this.target.dist : reach - 1.5;
      for (const e of sim.entities.near(p.dim, p.x, p.y, p.z, reach + 2)) {
        if (e === p || (e.kind !== 'mob' && e.kind !== 'player')) continue;
        const le = e as LivingEntity;
        if (le.dead) continue;
        const r = rayBox(eye.x, eye.y, eye.z, d.x, d.y, d.z, e.x - e.body.hw - 0.1, e.y - 0.05, e.z - e.body.hw - 0.1, e.x + e.body.hw + 0.1, e.y + e.body.h + 0.1, e.z + e.body.hw + 0.1);
        if (r && r[0] < best && r[0] <= reach - 1.5) {
          best = r[0];
          this.targetEntity = le;
        }
      }
      if (this.targetEntity) this.target = null;
    }
    this.swing = Math.max(0, this.swing - dt * 3.5);
    if (active) this.handleActions(dt);
    else {
      this.breaking = null;
      if (p.using && p.using.kind !== 'eat') this.releaseUse();
    }
    // ---- caméra
    const eyeY = p.py + (p.y - p.py) + (p.sneaking ? p.eye - 0.25 : p.eye);
    this.camPos.set(p.x, eyeY, p.z);
    this.camDir.set(d.x, d.y, d.z);
    if (this.view > 0) {
      const back = this.view === 1 ? -1 : 1;
      const dist = 4;
      const hit = raycastBlocks(w, p.x, eyeY, p.z, d.x * back, d.y * back, d.z * back, dist);
      const k = hit ? Math.max(0.3, hit.dist - 0.3) : dist;
      this.camPos.set(p.x + d.x * back * k, eyeY + d.y * back * k, p.z + d.z * back * k);
    }
    this.shake = Math.max(0, this.shake - dt * 2);
  }

  private stepSound(w: ReturnType<Sim['world']>, vol: number): void {
    const p = this.p;
    const id = w.getId(Math.floor(p.x), Math.floor(p.y - 0.1), Math.floor(p.z));
    if (!id) return;
    const snd = w.content.blocks.get(id).sound;
    this.host.playSound('pas_' + snd, p.x, p.y, p.z, vol);
  }

  private handleActions(dt: number): void {
    const { input, sim } = this.host;
    const p = this.p;
    const w = sim.world(p.dim);
    const remote = this.host.remote;
    // Barre rapide
    for (let i = 1; i <= 9; i++) if (input.pressed(('hotbar' + i) as 'hotbar1')) this.selectSlot(i - 1);
    if (input.wheel !== 0) this.selectSlot((p.inventory.selected + (input.wheel > 0 ? 1 : -1) + 9) % 9);
    if (input.pressed('hotbarNext')) this.selectSlot((p.inventory.selected + 1) % 9);
    if (input.pressed('hotbarPrev')) this.selectSlot((p.inventory.selected + 8) % 9);
    if (input.pressed('drop')) {
      const all = input.isDown('sprint');
      if (remote) remote.drop(all);
      else dropHeld(sim, p, all);
    }
    if (input.pressed('dodge') && !p.creative) {
      const d = lookDir(p.yaw, 0);
      const fx = d.x * this.intent.forward + Math.cos(p.yaw) * this.intent.strafe;
      const fz = d.z * this.intent.forward - Math.sin(p.yaw) * this.intent.strafe;
      if (dodge(sim, p, fx, fz)) {
        this.shake = 0.15;
        remote?.dodge(fx, fz);
      }
    }
    if (input.pressed('perspective')) this.view = (this.view + 1) % 3;
    // Choisir le bloc visé
    if (input.pressed('pick') && this.target) {
      const cell = w.getBlock(this.target.x, this.target.y, this.target.z);
      const info = w.content.blocks.get(cell & 0xfff);
      const id = info.def.item === false ? info.drops[0]?.item : info.id;
      if (id) {
        const slot = p.inventory.slots.findIndex((s, i) => i < 9 && s?.id === id);
        if (slot >= 0) this.selectSlot(slot);
        else if (p.creative) {
          p.inventory.set(p.inventory.selected, { id, count: sim.content.items.get(id)?.stackSize ?? 64 });
        } else {
          const inBag = p.inventory.slots.findIndex((s) => s?.id === id);
          if (inBag >= 9) {
            const a = p.inventory.get(inBag);
            p.inventory.set(inBag, p.inventory.held);
            p.inventory.set(p.inventory.selected, a);
          }
        }
      }
    }
    // ---- attaque / minage
    this.attackRepeat -= dt;
    if (input.isDown('attack') && !p.using) {
      if (this.targetEntity) {
        if (input.pressed('attack')) {
          if (remote) remote.attack(this.targetEntity.id);
          else attackEntity(sim, p, this.targetEntity);
          this.swing = 1;
        }
        this.breaking = null;
      } else if (this.target) {
        const t = this.target;
        const cell = w.getBlock(t.x, t.y, t.z);
        if (!this.breaking || this.breaking.x !== t.x || this.breaking.y !== t.y || this.breaking.z !== t.z || this.breaking.cell !== cell) this.breaking = { x: t.x, y: t.y, z: t.z, progress: 0, cell };
        const bt = breakTime(sim, p, cell);
        if (p.creative) {
          if (this.attackRepeat <= 0) {
            this.dig(t.x, t.y, t.z);
            this.attackRepeat = 0.2;
            this.swing = 1;
          }
          this.breaking = null;
        } else if (bt < Infinity) {
          this.breaking.progress += dt / Math.max(bt, 0.05);
          this.breakSoundT -= dt;
          if (this.breakSoundT <= 0) {
            this.breakSoundT = 0.24;
            this.host.playSound('pas_' + w.content.blocks.get(cell & 0xfff).sound, t.x + 0.5, t.y + 0.5, t.z + 0.5, 0.5);
            this.swing = 1;
          }
          if (this.breaking.progress >= 1) {
            this.dig(t.x, t.y, t.z);
            this.breaking = null;
            this.attackRepeat = 0.15;
          }
        }
      } else if (input.pressed('attack')) this.swing = 1;
    } else this.breaking = null;
    // ---- utilisation
    this.placeRepeat -= dt;
    const liquidHit = () => {
      const d = lookDir(p.yaw, p.pitch);
      return raycastBlocks(w, p.x, p.y + p.eye, p.z, d.x, d.y, d.z, REACH, { liquids: true });
    };
    if (input.pressed('use')) {
      this.placeRepeat = 0.25;
      this.doUse(liquidHit);
    } else if (input.isDown('use')) {
      if (p.using) {
        p.using.time += dt;
        this.useHeld = p.using.time;
        if ((p.using.kind === 'eat' || p.using.kind === 'recall') && p.using.time >= p.using.total) {
          if (remote) remote.use(null, 'finish', p.using.time);
          else finishUse(sim, p, p.using.time);
          this.useHeld = 0;
        }
      } else if (this.placeRepeat <= 0) {
        this.placeRepeat = 0.22;
        const held = p.inventory.held;
        const it = held ? sim.content.items.get(held.id) : undefined;
        if (it?.blockNum && this.target && !isInteractive(sim, w.getBlock(this.target.x, this.target.y, this.target.z))) this.doUse(liquidHit);
      }
    } else if (p.using) this.releaseUse();
  }

  private doUse(liquidHit: () => RayHit | null): void {
    const { sim } = this.host;
    const p = this.p;
    const w = sim.world(p.dim);
    const remote = this.host.remote;
    const t = this.target;
    if (t && !this.host.input.isDown('sneak')) {
      const cell = w.getBlock(t.x, t.y, t.z);
      if (isInteractive(sim, cell)) {
        if (remote) {
          remote.interact(t);
          const r = interactBlock(sim, p, t);
          if (r && 'ui' in r) this.host.openBlockUI(r);
        } else {
          const r = interactBlock(sim, p, t);
          if (r && 'ui' in r) this.host.openBlockUI(r);
          if (r) {
            this.swing = 1;
            this.host.onBlockEdited(t.x, t.y, t.z);
            return;
          }
        }
        if (remote) return;
      }
    }
    const held = p.inventory.held;
    const it = held ? sim.content.items.get(held.id) : undefined;
    if (it?.blockNum && t) {
      if (remote) {
        remote.place(t, p.inventory.selected);
        this.swing = 1;
        return;
      }
      if (placeBlock(sim, p, t)) {
        this.swing = 1;
        const [dx, dy, dz] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]][t.face];
        this.host.onBlockEdited(t.x + dx, t.y + dy, t.z + dz);
        this.host.onBlockEdited(t.x, t.y, t.z);
      }
      return;
    }
    if (remote) {
      remote.use(t, 'start', 0);
      const d = useDuration(sim, p);
      if (d > 0) p.using = { kind: it?.food ? 'eat' : it?.ranged ? 'bow' : it?.shield ? 'block' : 'recall', time: 0, total: d, slot: p.inventory.selected };
      return;
    }
    const r = useItem(sim, p, t, liquidHit());
    if (r === 'hold') {
      const d = useDuration(sim, p);
      p.using = { kind: it?.food ? 'eat' : it?.ranged ? 'bow' : it?.shield ? 'block' : 'recall', time: 0, total: d, slot: p.inventory.selected };
      if (p.using.kind === 'block') p.blocking = true;
    } else if (r === 'done') {
      this.swing = 1;
      if (t) {
        this.host.onBlockEdited(t.x, t.y, t.z);
        const [dx, dy, dz] = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]][t.face];
        this.host.onBlockEdited(t.x + dx, t.y + dy, t.z + dz);
      }
    }
  }

  private releaseUse(): void {
    const p = this.p;
    if (!p.using) return;
    if (this.host.remote) this.host.remote.use(null, 'finish', p.using.time);
    else if (p.using.kind === 'bow') finishUse(this.host.sim, p, p.using.time);
    p.using = null;
    p.blocking = false;
    this.useHeld = 0;
  }

  private dig(x: number, y: number, z: number): void {
    if (this.host.remote) {
      this.host.remote.dig(x, y, z);
      return;
    }
    if (digBlock(this.host.sim, this.p, x, y, z)) this.host.onBlockEdited(x, y, z);
  }

  selectSlot(i: number): void {
    const p = this.p;
    if (p.using) {
      p.using = null;
      p.blocking = false;
    }
    p.inventory.selected = i;
  }

  /** Boîtes de sélection du bloc visé (contour). */
  targetBoxes(): ReturnType<typeof selectionBox> | null {
    const t = this.target;
    if (!t) return null;
    const w = this.host.sim.world(this.p.dim);
    const cell = w.getBlock(t.x, t.y, t.z);
    const sh = w.content.blocks.shape[cell & 0xfff];
    const conn = sh === Shape.FENCE || sh === Shape.WALL || sh === Shape.PANE ? connectionsAt(w, t.x, t.y, t.z, sh) : 0;
    return selectionBox(sh, cell >>> 12, conn);
  }

  /** Charge de l'attaque (0..1). */
  attackCharge(): number {
    const p = this.p;
    return Math.max(0, Math.min(1, 1 - p.attackCooldown / Math.max(0.01, p.attackCooldownMax)));
  }
}
