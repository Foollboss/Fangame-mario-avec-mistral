/**
 * Caméra : vue à la première personne (balancement de marche, secousses),
 * troisième personne arrière / avant (recul limité par les blocs), monture et sommeil.
 */
import * as THREE from 'three';
import { raycast } from '../world/Raycast';
import type { Player } from '../player/Player';
import type { World } from '../world/World';

export class CameraRig {
  /** 0 = première personne, 1 = troisième (dos), 2 = troisième (face). */
  mode = 0;
  readonly eye = new THREE.Vector3();
  private dist = 4;
  private t = 0;

  cycle(): void {
    this.mode = (this.mode + 1) % 3;
  }

  get firstPerson(): boolean {
    return this.mode === 0;
  }

  update(cam: THREE.PerspectiveCamera, p: Player, world: World, alpha: number, dt: number, opts: { bobbing: boolean; shake: number; sleeping: boolean }): void {
    this.t += dt;
    const ex = p.prevPos.x + (p.pos.x - p.prevPos.x) * alpha;
    const ey = p.prevPos.y + (p.pos.y - p.prevPos.y) * alpha + p.eyeHeight;
    const ez = p.prevPos.z + (p.pos.z - p.prevPos.z) * alpha;
    this.eye.set(ex, ey, ez);
    let yaw = p.yaw;
    let pitch = p.pitch;
    if (opts.sleeping) {
      this.eye.y = p.pos.y + 0.3;
      pitch = 0.2;
    }
    if (p.dead) this.eye.y = p.pos.y + 0.3;
    let x = this.eye.x;
    let y = this.eye.y;
    let z = this.eye.z;
    let roll = 0;
    if (this.mode === 0) {
      if (opts.bobbing && p.onGround && !p.flying) {
        const walk = p.prevWalkDist + (p.walkDist - p.prevWalkDist) * alpha;
        const b = p.bob;
        x += Math.cos(yaw) * Math.sin(walk * Math.PI) * b * 0.5;
        z += -Math.sin(yaw) * Math.sin(walk * Math.PI) * b * 0.5;
        y += -Math.abs(Math.cos(walk * Math.PI)) * b * 0.6;
        roll = Math.sin(walk * Math.PI) * b * 0.05;
      }
      // Inclinaison lors d'une blessure
      if (p.hurtTime > 0) roll += Math.sin(((10 - p.hurtTime + alpha) / 10) * Math.PI) * 0.08;
    } else {
      const back = this.mode === 1 ? 1 : -1;
      const dir = new THREE.Vector3(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)).multiplyScalar(-back);
      const hit = raycast(world, this.eye, dir, 4.2);
      const want = hit ? Math.max(0.3, hit.dist - 0.3) : 4;
      this.dist += (want - this.dist) * Math.min(1, dt * (want < this.dist ? 30 : 4));
      x += dir.x * this.dist;
      y += dir.y * this.dist;
      z += dir.z * this.dist;
      if (this.mode === 2) {
        yaw += Math.PI;
        pitch = -pitch;
      }
    }
    if (opts.shake > 0) {
      const s = opts.shake * 0.15;
      x += (Math.random() - 0.5) * s;
      y += (Math.random() - 0.5) * s;
      z += (Math.random() - 0.5) * s;
    }
    cam.position.set(x, y, z);
    cam.rotation.set(pitch, yaw, roll, 'YXZ');
    cam.updateMatrixWorld();
  }
}
