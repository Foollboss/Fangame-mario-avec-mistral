import * as THREE from 'three';
import { clamp, smooth } from '../core/MathUtil.js';

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _look = new THREE.Vector3();
const _up = new THREE.Vector3();
const _w = new THREE.Vector3();

// Third-person chase camera with ball-cam, boost FOV, shake, arena collision and cinematic modes.
export class CameraController {
  constructor(camera, arena) {
    this.camera = camera;
    this.arena = arena;
    this.settings = { distance: 11, height: 4.2, fov: 78, stiffness: 1, ballCam: true, assist: true, shake: true };
    this.ballCam = true;
    this.dir = new THREE.Vector3(0, 0, 1);
    this.pos = new THREE.Vector3(0, 8, -20);
    this.look = new THREE.Vector3();
    this.fov = 78;
    this.shakeAmt = 0;
    this.mode = 'follow';
    this.cine = { t: 0 };
  }

  applySettings(s) {
    Object.assign(this.settings, s);
  }

  shake(amount) {
    if (this.settings.shake) this.shakeAmt = Math.min(1.2, this.shakeAmt + amount);
  }

  snap(car, ball) {
    this.follow(1, car, ball, true);
  }

  // Standard gameplay camera.
  follow(dt, car, ball, instant = false) {
    const s = this.settings;
    const p = car.physics;
    const cp = p.pos;
    const bp = ball.pos;
    const onWall = p.onWall;
    // "Up" for the camera offset: world up on the floor, leaning towards the surface normal on
    // walls and the ceiling so the camera stays inside the arena and on the car's side.
    const up = _up.set(0, 1, 0);
    if (onWall) up.copy(p.surfN).multiplyScalar(0.85).add(_w.set(0, 0.3, 0)).normalize();
    let target;
    if (this.ballCam && !ball.hidden) {
      target = _v.set(bp.x - cp.x, 0, bp.z - cp.z);
      if (target.lengthSq() < 4) target.copy(this.dir);
    } else {
      if (p.grounded || p.vel.lengthSq() < 64) p.forward(_v);
      else _v.copy(p.vel);
      _v.y = 0;
      // Driving straight up/down a wall: look at the car from the pitch side.
      if (onWall && _v.lengthSq() < 0.09) _v.set(-p.surfN.x, 0, -p.surfN.z);
      target = _v;
      if (s.assist && !ball.hidden && !onWall) {
        _v2.set(bp.x - cp.x, 0, bp.z - cp.z).normalize();
        target.normalize().lerp(_v2, 0.18);
      }
    }
    if (target.lengthSq() < 1e-4) target.copy(this.dir);
    target.normalize();
    const k = instant ? 1 : smooth(6 * s.stiffness, dt);
    this.dir.lerp(target, k).normalize();

    const dist = s.distance * (1 + clamp((p.speed - 36) / 60, 0, 0.2));
    const desired = _v2.copy(cp).addScaledVector(this.dir, -dist);
    if (onWall) {
      desired.y = cp.y;
      desired.addScaledVector(up, s.height + 2);
    } else {
      desired.y = cp.y * (p.grounded ? 1 : 0.85) + s.height;
    }
    if (this.ballCam && !ball.hidden) desired.y += clamp((bp.y - cp.y) * 0.12, 0, 4);
    const kp = instant ? 1 : smooth(14 * s.stiffness, dt);
    this.pos.lerp(desired, kp);
    this.arena.clampPoint(this.pos, 0.8);

    if (this.ballCam && !ball.hidden) {
      _look.copy(cp).lerp(bp, 0.42);
      if (!onWall) {
        _look.y = Math.min(_look.y, cp.y + 7);
        _look.y = Math.max(_look.y, cp.y + 0.5);
      }
    } else if (onWall) {
      p.forward(_w);
      _look.copy(cp).addScaledVector(_w, 6);
    } else {
      _look.copy(cp).addScaledVector(this.dir, 7);
      _look.y = cp.y + 1.6;
    }
    this.look.lerp(_look, instant ? 1 : smooth(16 * s.stiffness, dt));

    const boost = car.boosting ? 1 : 0;
    const fovTarget = s.fov + boost * 7 + clamp((p.speed - 40) / 20, 0, 1) * 5;
    this.fov += (fovTarget - this.fov) * smooth(5, dt);
    this.apply(dt);
  }

  // Goal celebration: slow orbit around the explosion.
  goalCam(dt, pos, t) {
    const a = t * 0.35 + (pos.z > 0 ? -Math.PI / 2 : Math.PI / 2);
    const r = 28 - Math.min(t * 3, 8);
    _v.set(pos.x + Math.cos(a) * r, 9 + t * 1.5, pos.z - Math.sign(pos.z || 1) * 18 + Math.sin(a) * 6);
    this.arena.clampPoint(_v, 1);
    this.pos.lerp(_v, smooth(3, dt));
    _look.set(pos.x, 5, pos.z);
    this.look.lerp(_look, smooth(6, dt));
    this.fov += (70 - this.fov) * smooth(3, dt);
    this.apply(dt);
  }

  // Broadcast-style replay: chase the ball from the side, rising as it nears the goal.
  replayCam(dt, ball, goalSign, focusCar) {
    const bp = ball.pos;
    if (focusCar && !focusCar.demolished) {
      const cp = focusCar.physics.pos;
      _v.set(bp.x - cp.x, 0, bp.z - cp.z);
      if (_v.lengthSq() < 1) _v.set(0, 0, goalSign);
      _v.normalize();
      _v2.copy(cp).addScaledVector(_v, -13);
      _v2.y = cp.y + 6;
    } else {
      _v2.set(bp.x * 0.6 + (bp.x > 0 ? -25 : 25), bp.y + 8, bp.z - goalSign * 20);
    }
    this.arena.clampPoint(_v2, 1);
    this.pos.lerp(_v2, smooth(4, dt));
    this.look.lerp(bp, smooth(8, dt));
    this.fov += (72 - this.fov) * smooth(3, dt);
    this.apply(dt);
  }

  // Menu / kickoff overview.
  orbit(dt, center, radius, height, speed = 0.12) {
    this.cine.t += dt;
    const a = this.cine.t * speed;
    this.pos.set(center.x + Math.cos(a) * radius, height, center.z + Math.sin(a) * radius);
    this.look.copy(center);
    this.fov = 60;
    this.apply(dt);
  }

  apply(dt) {
    const cam = this.camera;
    cam.position.copy(this.pos);
    if (this.shakeAmt > 0.001) {
      const s = this.shakeAmt * 0.6;
      cam.position.x += (Math.random() - 0.5) * s;
      cam.position.y += (Math.random() - 0.5) * s;
      cam.position.z += (Math.random() - 0.5) * s;
      this.shakeAmt = Math.max(0, this.shakeAmt - dt * 2.5);
    }
    cam.lookAt(this.look);
    if (Math.abs(cam.fov - this.fov) > 0.05) {
      cam.fov = this.fov;
      cam.updateProjectionMatrix();
    }
  }
}
