/**
 * PlayerController — applique les entrées au joueur à chaque tic :
 * marche, sprint, accroupissement (sans tomber des bords), saut, saut automatique,
 * nage, échelles, vol en mode créatif, planeur.
 */
import { collectBoxes, type AABB } from '../entity/physics';
import { ITEMS } from '../items/items';
import { BLOCKS } from '../world/blocks';
import type { InputState } from '../input/InputManager';
import type { Player } from './Player';

const tmp: AABB[] = [];

export class PlayerController {
  autoJump = false;
  private jumpCooldown = 0;
  private lastJumpPress = -100;
  private prevJump = false;
  private tickCount = 0;
  private sprintKeyPrev = false;
  onJump: (() => void) | null = null;
  onStep: ((blockId: number) => void) | null = null;
  onSplash: (() => void) | null = null;
  private wasInWater = false;

  constructor(readonly player: Player) {}

  tick(input: InputState): void {
    const p = this.player;
    this.tickCount++;
    p.baseTick();
    if (p.dead) return;
    p.updateEnvironment();
    if (p.fluid.water && !this.wasInWater && p.vel.y < -0.2) this.onSplash?.();
    this.wasInWater = p.fluid.water;

    const jumpPressed = input.jump && !this.prevJump;
    this.prevJump = input.jump;

    // Double appui sur saut : activer/désactiver le vol (créatif)
    if (jumpPressed) {
      if (p.creative && this.tickCount - this.lastJumpPress < 7) {
        p.flying = !p.flying;
        if (p.flying) p.vel.y = 0;
        this.lastJumpPress = -100;
      } else this.lastJumpPress = this.tickCount;
    }
    if (!p.creative) p.flying = false;

    let forward = input.moveZ;
    let strafe = input.moveX;

    // Accroupi
    p.sneaking = input.sneak && !p.flying && !p.gliding;
    const targetEye = p.sneaking ? 1.27 : p.swimming ? 0.4 : 1.62;
    p.eyeHeight += (targetEye - p.eyeHeight) * 0.5;
    p.height = p.sneaking ? 1.5 : p.swimming ? 0.6 : 1.8;

    // Sprint
    const canSprint = (p.hunger > 6 || p.creative) && forward > 0.6 && !p.sneaking;
    if (input.sprint && canSprint) p.sprinting = true;
    if (!canSprint || p.hitHorizontal && !p.fluid.water) p.sprinting = false;
    this.sprintKeyPrev = input.sprint;
    p.swimming = p.sprinting && p.fluid.eyesInWater;

    if (p.sneaking) {
      forward *= 0.3;
      strafe *= 0.3;
    }

    let speed = 0.1;
    if (p.sprinting) speed *= 1.3;
    if (p.hasEffect('speed')) speed *= 1.2;
    if (p.hasEffect('slowness')) speed *= 0.85;

    if (p.gameMode === 'spectator') {
      this.spectatorTick(forward, strafe, input);
      return;
    }

    if (p.flying) {
      this.flyTick(forward, strafe, input);
      return;
    }

    // Planeur : sauter en l'air avec un planeur équipé
    const chest = p.inventory.armor.get(1);
    const hasGlider = !!chest && ITEMS[chest.id]?.key === 'glider';
    if (hasGlider && jumpPressed && !p.onGround && !p.fluid.water && p.vel.y < 0 && !p.gliding) p.gliding = true;
    if (p.gliding && (p.onGround || p.fluid.water || !hasGlider || p.climbing)) p.gliding = false;
    if (p.gliding) {
      this.glideTick();
      return;
    }

    // Saut
    if (this.jumpCooldown > 0) this.jumpCooldown--;
    let wantJump = input.jump;
    if (this.autoJump && p.onGround && forward > 0.2 && !p.sneaking && this.obstacleAhead()) wantJump = true;
    if (wantJump && p.onGround && !p.fluid.water && !p.fluid.lava && this.jumpCooldown === 0) {
      p.vel.y = 0.42 + (p.hasEffect('jump_boost') ? 0.1 : 0);
      if (p.sprinting) {
        p.vel.x += -Math.sin(p.yaw) * 0.2;
        p.vel.z += -Math.cos(p.yaw) * 0.2;
        p.exhaust(0.2);
      } else p.exhaust(0.05);
      this.jumpCooldown = 10;
      p.onGround = false;
      this.onJump?.();
    }

    // Accroupi au bord : ne pas tomber
    if (p.sneaking && p.onGround) this.edgeGuard();

    const before = { x: p.pos.x, z: p.pos.z };
    if (p.fluid.water && p.sprinting) {
      // Nage : suit la direction du regard
      const dir = p.lookDir();
      p.vel.x += dir.x * 0.012 * forward;
      p.vel.z += dir.z * 0.012 * forward;
      p.vel.y += dir.y * 0.03 * forward;
    }
    p.travel(strafe, forward, speed, input.jump);
    if (p.hasEffect('slow_falling') && p.vel.y < -0.05) p.vel.y = -0.05;

    // Distance parcourue (pas, fatigue, balancement de la caméra)
    const dist = Math.hypot(p.pos.x - before.x, p.pos.z - before.z);
    p.prevWalkDist = p.walkDist;
    if (p.onGround) {
      p.walkDist += dist * 0.6;
      if (Math.floor(p.walkDist) !== Math.floor(p.prevWalkDist)) {
        const under = this.blockUnderFeet();
        if (under) this.onStep?.(under);
      }
    }
    if (p.sprinting) p.exhaust(dist * 0.1);
    else if (p.fluid.water) p.exhaust(dist * 0.01);
    p.bob += (Math.min(dist, 0.3) * (p.onGround ? 1 : 0) - p.bob) * 0.4;
  }

  private blockUnderFeet(): number {
    const p = this.player;
    const id = p.world.id(Math.floor(p.pos.x), Math.floor(p.pos.y - 0.2), Math.floor(p.pos.z));
    return id;
  }

  private obstacleAhead(): boolean {
    const p = this.player;
    const fx = -Math.sin(p.yaw);
    const fz = -Math.cos(p.yaw);
    const x = Math.floor(p.pos.x + fx * 0.75);
    const z = Math.floor(p.pos.z + fz * 0.75);
    const y = Math.floor(p.pos.y + 0.05);
    const front = BLOCKS[p.world.id(x, y, z)];
    if (!front?.solid || front.shape === 'fence' || front.shape === 'pane' || front.shape === 'door') return false;
    if (front.shape === 'slab' || front.shape === 'carpet' || front.shape === 'farmland' || front.shape === 'layer') return false;
    const above = BLOCKS[p.world.id(x, y + 1, z)];
    const above2 = BLOCKS[p.world.id(x, y + 2, z)];
    const head = BLOCKS[p.world.id(Math.floor(p.pos.x), y + 2, Math.floor(p.pos.z))];
    return !above?.solid && !above2?.solid && !head?.solid;
  }

  private edgeGuard(): void {
    const p = this.player;
    const step = 0.05;
    let dx = p.vel.x;
    let dz = p.vel.z;
    const hasGround = (ox: number, oz: number) => {
      const b = p.box;
      const test: AABB = { x0: b.x0 + ox, y0: b.y0 - 0.6, z0: b.z0 + oz, x1: b.x1 + ox, y1: b.y0 - 0.01, z1: b.z1 + oz };
      collectBoxes(p.world, test, tmp);
      for (const o of tmp) if (o.x1 > test.x0 && o.x0 < test.x1 && o.y1 > test.y0 && o.y0 < test.y1 && o.z1 > test.z0 && o.z0 < test.z1) return true;
      return false;
    };
    while (dx !== 0 && !hasGround(dx, 0)) dx = Math.abs(dx) < step ? 0 : dx - Math.sign(dx) * step;
    while (dz !== 0 && !hasGround(0, dz)) dz = Math.abs(dz) < step ? 0 : dz - Math.sign(dz) * step;
    while (dx !== 0 && dz !== 0 && !hasGround(dx, dz)) {
      dx = Math.abs(dx) < step ? 0 : dx - Math.sign(dx) * step;
      dz = Math.abs(dz) < step ? 0 : dz - Math.sign(dz) * step;
    }
    p.vel.x = dx;
    p.vel.z = dz;
  }

  private flyTick(forward: number, strafe: number, input: InputState): void {
    const p = this.player;
    const speed = p.sprinting || input.sprint ? 0.1 : 0.05;
    const sin = Math.sin(p.yaw);
    const cos = Math.cos(p.yaw);
    let len = Math.hypot(forward, strafe);
    if (len < 1) len = 1;
    p.vel.x += ((-forward * sin + strafe * cos) * speed) / len;
    p.vel.z += ((-forward * cos - strafe * sin) * speed) / len;
    if (input.jump) p.vel.y += 0.15;
    if (input.sneak) p.vel.y -= 0.15;
    p.move(p.vel.x, p.vel.y, p.vel.z);
    p.vel.x *= 0.91;
    p.vel.z *= 0.91;
    p.vel.y *= 0.6;
    p.fallDistance = 0;
    if (p.onGround && !input.jump) p.flying = false;
  }

  private spectatorTick(forward: number, strafe: number, input: InputState): void {
    const p = this.player;
    const dir = p.lookDir();
    const sin = Math.sin(p.yaw);
    const cos = Math.cos(p.yaw);
    const speed = input.sprint ? 1 : 0.5;
    p.vel.x = (dir.x * forward + strafe * cos) * speed;
    p.vel.z = (dir.z * forward - strafe * sin) * speed;
    p.vel.y = dir.y * forward * speed + (input.jump ? 0.4 : 0) - (input.sneak ? 0.4 : 0);
    p.pos.add(p.vel);
    p.flying = true;
    p.fallDistance = 0;
  }

  private glideTick(): void {
    const p = this.player;
    const look = p.lookDir();
    const pitch = p.pitch;
    const lookH = Math.hypot(look.x, look.z);
    const hspeed = Math.hypot(p.vel.x, p.vel.z);
    const f2 = Math.cos(pitch) ** 2;
    p.vel.y += -0.08 + f2 * 0.06;
    if (p.vel.y < 0 && lookH > 0) {
      const k = p.vel.y * -0.1 * f2;
      p.vel.y += k;
      p.vel.x += (look.x * k) / lookH;
      p.vel.z += (look.z * k) / lookH;
    }
    if (pitch > 0 && lookH > 0) {
      const k = hspeed * Math.sin(pitch) * 0.04;
      p.vel.y += k * 3.2;
      p.vel.x -= (look.x * k) / lookH;
      p.vel.z -= (look.z * k) / lookH;
    }
    if (lookH > 0) {
      p.vel.x += ((look.x / lookH) * hspeed - p.vel.x) * 0.1;
      p.vel.z += ((look.z / lookH) * hspeed - p.vel.z) * 0.1;
    }
    p.vel.x *= 0.99;
    p.vel.y *= 0.98;
    p.vel.z *= 0.99;
    p.fallDistance = Math.max(0, -p.vel.y * 2);
    p.move(p.vel.x, p.vel.y, p.vel.z);
    if (p.hitHorizontal && hspeed > 0.6) p.hurt(Math.floor(hspeed * 6), { type: 'contact' });
  }
}
