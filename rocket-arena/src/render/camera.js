import * as THREE from 'three';
import { sdArena, arenaNormal } from '../sim/arena.js';

const WORLD_UP = new THREE.Vector3(0, 1, 0);
const F = new THREE.Vector3();
const T = new THREE.Vector3();
const D = new THREE.Vector3();
const N = new THREE.Vector3();
const desired = new THREE.Vector3();
const lookT = new THREE.Vector3();

export function horizontalToVerticalFov(hfovDeg, aspect) {
  const h = THREE.MathUtils.degToRad(hfovDeg);
  return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(h / 2) / aspect));
}

export function keepInsideArena(p, margin = 0.6) {
  for (let i = 0; i < 3; i++) {
    const sd = sdArena(p.x, p.y, p.z);
    if (sd <= -margin) return p;
    arenaNormal(p.x, p.y, p.z, N);
    p.addScaledVector(N, sd + margin);
  }
  return p;
}

// Rocket League style chase camera with car cam / ball cam.
export class CameraRig {
  constructor(camera) {
    this.camera = camera;
    this.pos = new THREE.Vector3();
    this.look = new THREE.Vector3();
    this.fwd = new THREE.Vector3(0, 0, 1);
    this.up = new THREE.Vector3(0, 1, 0);
    this.ready = false;
    this.ballCam = true;
    this.shake = 0;
  }

  reset() {
    this.ready = false;
  }

  addShake(amount) {
    this.shake = Math.max(this.shake, amount);
  }

  follow(dt, car, ballPos, settings) {
    const dist = settings.camDistance;
    const height = settings.camHeight;
    F.set(1, 0, 0).applyQuaternion(car.quat);
    const upT = car.onGround ? car.groundNormal : WORLD_UP;
    T.copy(F).addScaledVector(upT, -F.dot(upT));
    if (T.lengthSq() < 0.09) T.copy(this.fwd);
    T.normalize();
    if (!this.ready) {
      this.fwd.copy(T);
      this.up.copy(upT);
    }
    const kSwivel = 1 - Math.exp(-dt * (car.onGround ? 9 : 5));
    this.fwd.lerp(T, kSwivel).normalize();
    this.up.lerp(upT, 1 - Math.exp(-dt * 5)).normalize();

    let camUp = this.up;
    if (this.ballCam && ballPos) {
      D.copy(car.pos).sub(ballPos);
      D.y = 0;
      if (D.lengthSq() < 0.25) D.copy(this.fwd).negate().setY(0);
      D.normalize();
      desired.copy(car.pos).addScaledVector(D, dist);
      desired.y += height;
      camUp = WORLD_UP;
      // Look at the ball, but never so far that the car leaves the screen.
      const v = D.copy(ballPos).sub(desired).normalize();
      const c = lookT.copy(car.pos).sub(desired).normalize();
      const ang = Math.acos(THREE.MathUtils.clamp(v.dot(c), -1, 1));
      const maxA = THREE.MathUtils.degToRad(this.camera.fov) * 0.36;
      if (ang > maxA && ang > 1e-4) {
        const axis = F.crossVectors(c, v).normalize();
        v.copy(c).applyAxisAngle(axis, maxA);
      }
      lookT.copy(desired).addScaledVector(v, 12);
    } else {
      desired.copy(car.pos).addScaledVector(this.fwd, -dist).addScaledVector(this.up, height);
      lookT.copy(car.pos).addScaledVector(this.up, height * 0.7).addScaledVector(this.fwd, 2.2);
    }
    keepInsideArena(desired);

    if (!this.ready) {
      this.pos.copy(desired);
      this.look.copy(lookT);
      this.ready = true;
    } else {
      const k = 1 - Math.exp(-dt * settings.camStiffness);
      this.pos.lerp(desired, k);
      this.look.lerp(lookT, 1 - Math.exp(-dt * 14));
    }
    this.apply(dt, camUp);
  }

  // Free placement used by replays and menus.
  setView(dt, pos, look, stiffness = 4) {
    if (!this.ready) {
      this.pos.copy(pos);
      this.look.copy(look);
      this.ready = true;
    } else {
      this.pos.lerp(pos, 1 - Math.exp(-dt * stiffness));
      this.look.lerp(look, 1 - Math.exp(-dt * stiffness * 1.5));
    }
    this.apply(dt, WORLD_UP);
  }

  apply(dt, up) {
    const cam = this.camera;
    cam.position.copy(this.pos);
    if (this.shake > 0.001) {
      const s = this.shake;
      cam.position.x += (Math.random() - 0.5) * s;
      cam.position.y += (Math.random() - 0.5) * s;
      cam.position.z += (Math.random() - 0.5) * s;
      this.shake *= Math.exp(-dt * 5);
    }
    cam.up.copy(up);
    cam.lookAt(this.look);
  }
}
