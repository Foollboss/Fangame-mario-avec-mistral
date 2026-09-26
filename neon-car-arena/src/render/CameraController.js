import * as THREE from 'three';
import { clamp, damp } from '../core/math.js';

const _dir = new THREE.Vector3(), _want = new THREE.Vector3(), _look = new THREE.Vector3(), _tmp = new THREE.Vector3();
const _fwd = new THREE.Vector3();

// Caméra 3e personne : suit la voiture, peut se verrouiller sur la balle, évite les murs,
// effet de vitesse au boost, plans cinématiques pour les buts et les replays.
export class CameraController {
  constructor(camera, arena) {
    this.camera = camera;
    this.arena = arena;
    this.settings = { distance: 9.5, height: 3.6, fov: 72, stiffness: 1, ballCam: true, assist: true };
    this.mode = 'follow';
    this.dir = new THREE.Vector3(0, 0, 1);
    this.pos = new THREE.Vector3(0, 10, -30);
    this.look = new THREE.Vector3();
    this.fovBoost = 0;
    this.shakeAmt = 0;
    this.orbitAngle = 0;
    this.focus = new THREE.Vector3();
    this.prevBall = new THREE.Vector3();
    this.initialized = false;
  }

  apply(settings) { Object.assign(this.settings, settings); }

  shake(amount) { this.shakeAmt = Math.min(1.2, this.shakeAmt + amount); }

  snap() { this.initialized = false; }

  follow(dt, car, ball) {
    const s = this.settings;
    const k = s.stiffness;
    _fwd.set(0, 0, 1).applyQuaternion(car.quat);
    // Direction voulue : vers la balle (caméra balle) ou selon le cap de la voiture
    if (s.ballCam) {
      _want.subVectors(ball, car.pos);
      _want.y = 0;
      if (_want.lengthSq() < 4) _want.set(_fwd.x, 0, _fwd.z);
    } else {
      _want.set(_fwd.x, 0, _fwd.z);
      if (car.onGround === false || _want.lengthSq() < 0.1) _want.copy(this.dir);
      if (s.assist) {
        _tmp.subVectors(ball, car.pos).setY(0);
        if (_tmp.lengthSq() > 1) _want.normalize().lerp(_tmp.normalize(), 0.18);
      }
    }
    _want.normalize();
    if (!this.initialized) this.dir.copy(_want);
    const t = 1 - Math.exp(-7 * k * dt);
    this.dir.lerp(_want, t).normalize();

    const target = _tmp.copy(car.pos);
    _dir.copy(this.dir);
    const want = new THREE.Vector3(target.x - _dir.x * s.distance, target.y + s.height, target.z - _dir.z * s.distance);
    if (want.y < 1.5) want.y = 1.5;

    if (s.ballCam) {
      // Regarde entre la voiture et la balle, sans perdre la voiture du cadre
      _look.subVectors(ball, car.pos);
      const d = _look.length();
      _look.multiplyScalar(Math.min(1, 12 / Math.max(d, 1)) * 0.55).add(car.pos);
      _look.y = Math.min(_look.y, car.pos.y + 5) + 1.3;
    } else {
      _look.copy(car.pos).addScaledVector(_dir, 6);
      _look.y += 1.4;
    }

    if (!this.initialized) { this.pos.copy(want); this.look.copy(_look); this.initialized = true; }
    const ph = 1 - Math.exp(-14 * k * dt);
    const pv = 1 - Math.exp(-(car.onGround ? 10 : 4) * k * dt); // moins de secousses verticales pendant les sauts
    this.pos.x += (want.x - this.pos.x) * ph;
    this.pos.z += (want.z - this.pos.z) * ph;
    this.pos.y += (want.y - this.pos.y) * pv;
    this.look.lerp(_look, 1 - Math.exp(-16 * k * dt));
  }

  // Plan cinématique autour d'un point (but, menu)
  orbit(dt, center, radius, height, speed) {
    this.orbitAngle += dt * speed;
    const want = _want.set(center.x + Math.sin(this.orbitAngle) * radius, center.y + height, center.z + Math.cos(this.orbitAngle) * radius);
    if (!this.initialized) { this.pos.copy(want); this.look.copy(center); this.initialized = true; }
    this.pos.lerp(want, 1 - Math.exp(-3 * dt));
    this.look.lerp(center, 1 - Math.exp(-5 * dt));
  }

  replayFollow(dt, ball) {
    _tmp.subVectors(ball, this.prevBall);
    this.prevBall.copy(ball);
    _tmp.y = 0;
    if (_tmp.lengthSq() > 1e-4) this.dir.lerp(_tmp.normalize(), 1 - Math.exp(-2 * dt)).normalize();
    const want = _want.set(ball.x - this.dir.x * 26, Math.max(ball.y + 9, 6), ball.z - this.dir.z * 26);
    if (!this.initialized) { this.pos.copy(want); this.look.copy(ball); this.initialized = true; }
    this.pos.lerp(want, 1 - Math.exp(-3 * dt));
    this.look.lerp(ball, 1 - Math.exp(-8 * dt));
  }

  finish(dt, speedFx = 0) {
    const s = this.settings;
    // Évite de traverser les murs : on rapproche la caméra de la cible
    const d = this.arena.distance(this.pos.x, this.pos.y, this.pos.z);
    if (d < 1.2) {
      _dir.subVectors(this.pos, this.look);
      const len = _dir.length();
      _dir.multiplyScalar(1 / len);
      let lo = 0, hi = len;
      for (let i = 0; i < 10; i++) {
        const mid = (lo + hi) / 2;
        _tmp.copy(this.look).addScaledVector(_dir, mid);
        if (this.arena.distance(_tmp.x, _tmp.y, _tmp.z) > 1.2) lo = mid; else hi = mid;
      }
      this.pos.copy(this.look).addScaledVector(_dir, lo);
    }
    this.fovBoost = damp(this.fovBoost, speedFx, 4, dt);
    const cam = this.camera;
    cam.position.copy(this.pos);
    if (this.shakeAmt > 0.001) {
      const a = this.shakeAmt * 0.6;
      cam.position.x += (Math.random() - 0.5) * a;
      cam.position.y += (Math.random() - 0.5) * a;
      this.shakeAmt = Math.max(0, this.shakeAmt - dt * 2.5);
    }
    cam.lookAt(this.look);
    const fov = clamp(s.fov + this.fovBoost * 9, 40, 100);
    if (Math.abs(cam.fov - fov) > 0.05) { cam.fov = fov; cam.updateProjectionMatrix(); }
  }
}
