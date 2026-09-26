import * as THREE from 'three';
import { PHYS, TEAM } from '../config/GameConfig.js';
import { ArenaRenderer } from './ArenaRenderer.js';
import { buildCarModel, randomLoadout } from './CarModelFactory.js';
import { ParticleSystem } from './ParticleSystem.js';
import { TrailRenderer } from './TrailRenderer.js';
import { CameraController } from './CameraController.js';
import { canvas, canvasTexture, radialTexture, textTexture, hexPattern } from './Textures.js';

const _v = new THREE.Vector3(), _q = new THREE.Quaternion(), _c = new THREE.Color(), _side = new THREE.Vector3();
const _fwd = new THREE.Vector3(), _up = new THREE.Vector3();

function ballTexture() {
  const c = canvas(512, 256);
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, 256);
  grd.addColorStop(0, '#e9eef5'); grd.addColorStop(1, '#c9d2de');
  g.fillStyle = grd; g.fillRect(0, 0, 512, 256);
  hexPattern(g, 512, 256, 26, '#1b2230', 5);
  g.fillStyle = '#2a3244';
  for (let i = 0; i < 12; i++) { g.beginPath(); g.arc((i * 131) % 512, 30 + (i * 67) % 200, 9, 0, 7); g.fill(); }
  return canvasTexture(c);
}

function seamTexture() {
  const c = canvas(512, 256);
  const g = c.getContext('2d');
  g.fillStyle = '#000'; g.fillRect(0, 0, 512, 256);
  hexPattern(g, 512, 256, 26, '#7af3ff', 2);
  return canvasTexture(c);
}

// Vue d'une voiture : modèle, roues, suspension visuelle, boost, traînée, ombre.
class CarView {
  constructor(scene, car, particles, quality, isPlayer) {
    const loadout = car.loadout || randomLoadout(mulberry(car.id * 101 + 7));
    this.model = buildCarModel(car.vehicleId, { car: 'car_' + car.vehicleId, ...loadout }, TEAM[car.team].color, quality.level);
    this.scene = scene;
    this.car = car;
    this.particles = particles;
    this.q = quality;
    scene.add(this.model.root);
    this.boostColors = this.model.boostItem.data.colors.map((c) => new THREE.Color(c));
    this.boostSize = this.model.boostItem.data.size;
    const trail = this.model.trailItem.data;
    this.trail = trail.color ? new TrailRenderer(scene, trail.color, trail.rainbow, quality.level === 'low' ? 14 : 24) : null;
    this.wheelAngle = 0;
    this.emitAcc = 0;
    this.shadow = new THREE.Mesh(new THREE.PlaneGeometry(car.half.x * 2.6, car.half.z * 2.6), new THREE.MeshBasicMaterial({
      map: radialTexture('rgba(0,0,0,0.7)', 'rgba(0,0,0,0)'), transparent: true, depthWrite: false,
    }));
    this.shadow.rotation.x = -Math.PI / 2;
    scene.add(this.shadow);
    if (!isPlayer) {
      const tex = textTexture(car.name, { color: TEAM[car.team].css, font: 'bold 30px sans-serif' });
      this.tag = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: false }));
      this.tag.scale.set(5, 1.25, 1);
      this.tag.renderOrder = 5;
      scene.add(this.tag);
    }
  }

  // s : { pos, quat, boosting, supersonic, steer, speed, onGround }
  update(dt, s, live) {
    const { root, body, wheels, exhausts, under } = this.model;
    root.position.copy(s.pos);
    root.quaternion.copy(s.quat);
    _fwd.set(0, 0, 1).applyQuaternion(s.quat);
    _up.set(0, 1, 0).applyQuaternion(s.quat);
    const car = this.car;
    const fwdSpeed = live ? car.vel.dot(_fwd) : s.speed;
    this.wheelAngle += fwdSpeed / 0.45 * dt;
    for (const w of wheels) {
      const compress = live ? car.wheelCompress[w.index] : 0.06;
      w.pivot.position.y = w.mount.y - (PHYS.SUSP_REST - compress - w.radius);
      w.pivot.rotation.y = w.front ? -s.steer * 0.42 : 0;
      w.spin.rotation.x = this.wheelAngle;
    }
    // Léger roulis/tangage de la caisse selon l'accélération (lisibilité des mouvements)
    body.rotation.z = live && car.onGround ? THREE.MathUtils.clamp(-car.steer * Math.abs(fwdSpeed) * 0.0022, -0.06, 0.06) : 0;
    under.visible = s.pos.y < 6;

    // Particules de boost
    if (s.boosting) {
      this.emitAcc += dt * this.q.boostRate;
      while (this.emitAcc > 1) {
        this.emitAcc -= 1;
        for (const e of exhausts) {
          _v.copy(e).applyQuaternion(s.quat).add(s.pos);
          const speed = 18 + Math.random() * 8;
          const col = this.boostColors[Math.floor(Math.random() * this.boostColors.length)];
          this.particles.emit(
            _v.x, _v.y, _v.z,
            -_fwd.x * speed + (Math.random() - 0.5) * 3, -_fwd.y * speed + (Math.random() - 0.5) * 3 + 1, -_fwd.z * speed + (Math.random() - 0.5) * 3,
            col, 0.9 * this.boostSize, 0.28 + Math.random() * 0.15, { grow: 1.8, drag: 3 },
          );
        }
      }
    }
    if (this.trail) {
      _v.copy(s.pos).addScaledVector(_fwd, -car.half.z).addScaledVector(_up, -0.1);
      _side.set(1, 0, 0).applyQuaternion(s.quat);
      this.trail.update(dt, _v, _side, s.supersonic ? 1 : s.boosting ? 0.45 : 0);
    }
    // Ombre au sol
    const h = s.pos.y;
    this.shadow.visible = h < 14;
    if (this.shadow.visible) {
      this.shadow.position.set(s.pos.x, 0.06, s.pos.z);
      this.shadow.material.opacity = Math.max(0, 1 - h / 14) * 0.8;
      this.shadow.rotation.z = Math.atan2(_fwd.x, _fwd.z);
    }
    if (this.tag) this.tag.position.set(s.pos.x, s.pos.y + 3.2, s.pos.z);
  }

  setVisible(v) {
    this.model.root.visible = v;
    this.shadow.visible = v;
    if (this.tag) this.tag.visible = v;
  }

  dispose() {
    this.scene.remove(this.model.root, this.shadow);
    if (this.tag) this.scene.remove(this.tag);
    this.trail?.dispose(this.scene);
  }
}

function mulberry(seed) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Scène complète d'un match (ou du menu) : arène, voitures, balle, effets, caméra.
export class SceneView {
  constructor(renderer, { arenaId, sim, quality, playerId = 0 }) {
    this.renderer = renderer;
    this.scene = new THREE.Scene();
    this.sim = sim;
    this.q = quality;
    this.camera = new THREE.PerspectiveCamera(72, 16 / 9, 0.3, 2600);
    this.arena = new ArenaRenderer(this.scene, sim.arena, arenaId, quality);
    this.arena.buildPads(sim.pads);
    this.particles = new ParticleSystem(this.scene, quality.particles);
    this.cam = new CameraController(this.camera, sim.arena);
    this.carViews = sim.cars.map((c) => new CarView(this.scene, c, this.particles, quality, c.id === playerId));
    this.playerId = playerId;
    this.buildBall();
    this.flash = new THREE.PointLight(0xffffff, 0, 120, 1.5);
    this.scene.add(this.flash);
    this.shockwaves = [];
    this._cs = sim.cars.map(() => ({ pos: new THREE.Vector3(), quat: new THREE.Quaternion(), boosting: false, supersonic: false, steer: 0, speed: 0, onGround: true }));
    this._ballPos = new THREE.Vector3();
    this._ballQuat = new THREE.Quaternion();
  }

  buildBall() {
    const R = this.sim.ball.radius;
    const detail = this.q.level === 'low' ? 2 : 3;
    const mat = new THREE.MeshStandardMaterial({
      map: ballTexture(), emissiveMap: seamTexture(), emissive: 0xffffff, emissiveIntensity: 0.9, metalness: 0.2, roughness: 0.4,
    });
    this.ballMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(R, detail), mat);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: radialTexture('rgba(160,240,255,0.55)', 'rgba(160,240,255,0)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    glow.scale.setScalar(R * 4.2);
    this.ballGlow = glow;
    this.scene.add(this.ballMesh, glow);
    this.ballShadow = new THREE.Mesh(new THREE.CircleGeometry(R * 1.1, 24), new THREE.MeshBasicMaterial({
      map: radialTexture('rgba(0,0,0,0.85)', 'rgba(0,0,0,0)'), transparent: true, depthWrite: false,
    }));
    this.ballShadow.rotation.x = -Math.PI / 2;
    this.scene.add(this.ballShadow);
    // Anneau indicateur sous la balle (lisibilité de sa position en l'air)
    this.ballRing = new THREE.Mesh(new THREE.RingGeometry(R * 0.9, R * 1.05, 32), new THREE.MeshBasicMaterial({ color: 0x7af3ff, transparent: true, opacity: 0.6, depthWrite: false }));
    this.ballRing.rotation.x = -Math.PI / 2;
    this.scene.add(this.ballRing);
  }

  resize(w, h) {
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.particles.setViewport(h * this.renderer.getPixelRatio(), this.camera.fov);
  }

  // Rendu d'un état de jeu : soit la simulation en direct (interpolée), soit une image de replay.
  update(dt, match, viewOverride = null) {
    const sim = this.sim;
    const live = !viewOverride;
    sim.cars.forEach((car, i) => {
      const s = this._cs[i];
      if (live) {
        match ? match.interp(car, s.pos, s.quat) : (s.pos.copy(car.pos), s.quat.copy(car.quat));
        s.boosting = car.boosting; s.supersonic = car.supersonic; s.steer = car.steer; s.speed = car.vel.length(); s.onGround = car.onGround;
      } else {
        const r = viewOverride.cars[i];
        s.pos.copy(r.pos); s.quat.copy(r.quat); s.boosting = r.boosting; s.supersonic = r.supersonic; s.steer = r.steer; s.speed = r.speed; s.onGround = r.onGround;
      }
      this.carViews[i].update(dt, s, live);
    });
    if (live) {
      if (match) match.interp(sim.ball, this._ballPos, this._ballQuat);
      else { this._ballPos.copy(sim.ball.pos); this._ballQuat.copy(sim.ball.quat); }
    } else {
      this._ballPos.copy(viewOverride.ball.pos);
      this._ballQuat.copy(viewOverride.ball.quat);
    }
    const ballVisible = !live || sim.ballActive;
    this.ballMesh.visible = this.ballGlow.visible = ballVisible;
    this.ballMesh.position.copy(this._ballPos);
    this.ballMesh.quaternion.copy(this._ballQuat);
    this.ballGlow.position.copy(this._ballPos);
    const h = this._ballPos.y;
    this.ballShadow.visible = ballVisible && h < 40;
    this.ballShadow.position.set(this._ballPos.x, 0.07, this._ballPos.z);
    this.ballShadow.material.opacity = Math.max(0.15, 1 - h / 40) * 0.8;
    this.ballRing.visible = ballVisible && h > 6;
    this.ballRing.position.set(this._ballPos.x, 0.09, this._ballPos.z);

    // Traînée de la balle quand elle file
    if (live && ballVisible && sim.ball.vel.lengthSq() > 55 * 55 && Math.random() < this.q.boostRate / 120) {
      this.particles.emit(this._ballPos.x, this._ballPos.y, this._ballPos.z, 0, 0, 0, _c.set(0x9ff4ff), 2.2, 0.35, { grow: 0.5 });
    }

    this.arena.update(dt, sim.pads);
    this.particles.update(dt);
    if (this.flash.intensity > 0) this.flash.intensity = Math.max(0, this.flash.intensity - dt * 900);
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const s = this.shockwaves[i];
      s.t += dt;
      const k = s.t / s.life;
      s.mesh.scale.setScalar(1 + k * s.grow);
      s.mesh.material.opacity = (1 - k) * (s.alpha ?? 0.9);
      if (k >= 1) { this.scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh.material.dispose(); this.shockwaves.splice(i, 1); }
    }
  }

  playerState() { return this._cs[this.carViews.findIndex((v) => v.car.id === this.playerId)]; }
  ballPos() { return this._ballPos; }

  // ---------- Effets déclenchés par les événements ----------
  hitSpark(pos, strength, color = 0xffffff) {
    const n = Math.min(this.q.sparkMax, Math.floor(strength * 0.6));
    this.particles.burst(pos, n, [color, 0xfff3b0], strength * 0.35, 0.5, 0.35, { drag: 2, grav: 10 });
  }

  goalExplosion(pos, goalItem, teamColor) {
    const colors = goalItem?.data?.colors || ['#ffffff', '#ffd24a'];
    const shape = goalItem?.data?.shape || 'burst';
    const n = this.q.goalParticles;
    const all = [...colors, '#' + new THREE.Color(teamColor).getHexString()];
    if (shape === 'ring') this.particles.burst(pos, n, all, 60, 2.2, 1.4, { ring: true, drag: 1.2 });
    else if (shape === 'fountain') this.particles.burst(pos, n, all, 38, 2, 1.8, { up: true, grav: 25, drag: 0.6 });
    else this.particles.burst(pos, n, all, 55, 2.4, 1.3, { drag: 1.4, grow: 1 });
    this.particles.burst(pos, Math.floor(n / 4), ['#ffffff'], 18, 2.5, 0.5, { grow: 1.2, drag: 3 });
    this.flash.position.copy(pos);
    this.flash.color.set(teamColor);
    this.flash.intensity = this.q.level === 'low' ? 0 : 900;
    const ring = new THREE.Mesh(new THREE.RingGeometry(2, 3.2, 48), new THREE.MeshBasicMaterial({
      color: teamColor, transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    ring.position.copy(pos);
    ring.lookAt(pos.x, pos.y, 0);
    this.scene.add(ring);
    this.shockwaves.push({ mesh: ring, t: 0, life: 0.9, grow: 22 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 14), new THREE.MeshBasicMaterial({
      color: teamColor, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    sphere.position.copy(pos);
    this.scene.add(sphere);
    this.shockwaves.push({ mesh: sphere, t: 0, life: 0.45, grow: 3, alpha: 0.5 });
    this.cam.shake(1);
  }

  pickupFx(pad) {
    _v.set(pad.x, 1, pad.z);
    this.particles.burst(_v, pad.big ? 24 : 8, ['#ffd24a', '#ffffff'], pad.big ? 14 : 8, 0.8, 0.5, { up: true, grav: 8 });
  }

  landingDust(pos, speed) {
    _v.copy(pos); _v.y = 0.4;
    this.particles.burst(_v, Math.min(14, Math.floor(speed)), ['#8899aa'], 6, 1.4, 0.5, { ring: true, drag: 3, grow: 1.5 });
  }

  render() { this.renderer.render(this.scene, this.camera); }

  dispose() {
    for (const v of this.carViews) v.dispose();
    this.arena.dispose();
    this.scene.traverse((o) => {
      o.geometry?.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) m.dispose();
    });
  }
}
