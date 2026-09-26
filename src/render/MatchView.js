import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { TEAM, ARENA } from '../core/Config.js';
import { getItem } from '../meta/Catalog.js';
import { ArenaView } from './ArenaBuilder.js';
import { BallView } from './BallView.js';
import { CarView } from './CarView.js';
import { CameraController } from './CameraController.js';
import { Effects } from './Effects.js';
import { ParticleSystem } from './Particles.js';
import { Trail } from './Trails.js';
import { radialTexture } from './Textures.js';

const _v = new THREE.Vector3();
const _v2 = new THREE.Vector3();
const _r = new THREE.Vector3();
const _c = new THREE.Color();
const _c2 = new THREE.Color();
const WHITE = new THREE.Color(0xffffff);

// Everything visible during a match or training session, driven by the World state.
export class MatchView {
  constructor({ gameRenderer, world, themeId, localCar }) {
    this.gr = gameRenderer;
    this.world = world;
    this.localCar = localCar;
    const q = gameRenderer.quality;
    this.quality = q;
    const scene = (this.scene = new THREE.Scene());
    this.arena = new ArenaView(themeId, q);
    const th = this.arena.theme;
    scene.fog = new THREE.Fog(th.fog.color, th.fog.near, th.fog.far);
    scene.background = new THREE.Color(th.fog.color);
    if (q.envMap) scene.environment = gameRenderer.getEnvMap();
    scene.add(this.arena.group);

    this.camera = new THREE.PerspectiveCamera(78, gameRenderer.width / gameRenderer.height, 0.3, 3200);
    this.cam = new CameraController(this.camera, world.arena);

    this.glow = new ParticleSystem(1200, { additive: true });
    this.smoke = new ParticleSystem(400, { additive: false, texture: radialTexture(64, [[0, 'rgba(255,255,255,0.9)'], [1, 'rgba(255,255,255,0)']]) });
    this.glow.setBudget(q.particles);
    this.smoke.setBudget(Math.round(q.particles / 3));
    scene.add(this.glow.points, this.smoke.points);
    this.effects = new Effects(scene, this.glow, this.smoke);

    this.shadowTex = radialTexture(64, [[0, 'rgba(0,0,0,0.75)'], [0.6, 'rgba(0,0,0,0.35)'], [1, 'rgba(0,0,0,0)']]);
    this.shadowGeo = new THREE.PlaneGeometry(1, 1);
    this.shadowGeo.rotateX(-Math.PI / 2);

    this.ball = new BallView(q);
    scene.add(this.ball.group);
    this.ballShadow = this.makeShadow(7);

    this.cars = world.cars.map((car) => {
      const view = new CarView(car.cosmetics, car.team, { envMap: q.envMap });
      scene.add(view.group);
      const trail = new Trail(q.trailSegments, 0.75);
      trail.configure(getItem(view.cosmetics.trail), TEAM[car.team].color);
      scene.add(trail.mesh);
      return { car, view, trail, shadow: this.makeShadow(5.2), emitAcc: 0 };
    });
    this.buildPads();
    this.bindEvents();
    this.resize();
    this.time = 0;
    this.goalTime = 0;
  }

  makeShadow(size) {
    const m = new THREE.Mesh(this.shadowGeo, new THREE.MeshBasicMaterial({ map: this.shadowTex, transparent: true, depthWrite: false }));
    m.scale.setScalar(size);
    m.userData.base = size;
    m.renderOrder = 1;
    this.scene.add(m);
    return m;
  }

  buildPads() {
    const pads = this.world.boost.pads;
    const baseGeos = [];
    const baseMat = new THREE.MeshLambertMaterial({ color: 0x2a2f3a });
    this.padBaseMat = baseMat;
    const smallGeo = new THREE.CylinderGeometry(1.1, 1.1, 0.12, 16);
    this.padCoreMat = new THREE.MeshBasicMaterial({ color: 0xffb02e });
    const small = pads.filter((p) => !p.big);
    this.smallCores = new THREE.InstancedMesh(smallGeo, this.padCoreMat, small.length);
    this.smallGeo = smallGeo;
    this.padSprites = [];
    const orbTex = radialTexture(64, [[0, 'rgba(255,255,255,1)'], [0.3, 'rgba(255,220,140,0.9)'], [1, 'rgba(255,160,40,0)']]);
    this.orbTex = orbTex;
    this.orbMat = new THREE.SpriteMaterial({ map: orbTex, color: 0xffc04a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
    let si = 0;
    for (const p of pads) {
      const g = new THREE.CylinderGeometry(p.big ? 3 : 1.6, p.big ? 3.3 : 1.8, 0.14, 20);
      g.translate(p.x, 0.07, p.z);
      baseGeos.push(g);
      if (p.big) {
        const s = new THREE.Sprite(this.orbMat);
        s.position.set(p.x, 1.8, p.z);
        s.scale.setScalar(4.2);
        this.scene.add(s);
        this.padSprites.push({ pad: p, s });
      } else {
        p.viewIndex = si++;
      }
    }
    const merged = mergeGeometries(baseGeos);
    baseGeos.forEach((g) => g.dispose());
    this.padBase = new THREE.Mesh(merged, baseMat);
    this.scene.add(this.padBase, this.smallCores);
    this.padState = [];
    this.updatePads(true);
  }

  updatePads(force = false) {
    const m = new THREE.Matrix4();
    let dirty = false;
    for (const p of this.world.boost.pads) {
      if (!force && this.padState[p.id] === p.active) continue;
      this.padState[p.id] = p.active;
      if (!p.big) {
        m.makeScale(p.active ? 1 : 0.0001, 1, p.active ? 1 : 0.0001);
        m.setPosition(p.x, 0.18, p.z);
        this.smallCores.setMatrixAt(p.viewIndex, m);
        dirty = true;
      }
    }
    if (dirty) this.smallCores.instanceMatrix.needsUpdate = true;
    const t = this.time;
    for (const { pad, s } of this.padSprites) {
      s.visible = pad.active;
      s.position.y = 1.8 + Math.sin(t * 2 + pad.x) * 0.35;
    }
  }

  bindEvents() {
    const ev = this.world.events;
    this.unsub = [
      ev.on('ballTouch', (e) => {
        if (!e.hit || e.strength < 6) return;
        _c.setHex(TEAM[e.car.team].color).lerp(WHITE, 0.5);
        this.effects.hit(e.point, e.normal, Math.min(80, e.strength), _c.clone());
        if (e.car === this.localCar) this.cam.shake(Math.min(0.5, e.strength / 120));
      }),
      ev.on('demolish', (e) => {
        this.effects.demolition(e.victim.physics.pos.clone(), e.victim.team);
        if (e.victim === this.localCar || e.attacker === this.localCar) this.cam.shake(0.8);
      }),
      ev.on('boostPickup', (e) => this.effects.pickup(e.pad.x, e.pad.z, e.pad.big)),
      ev.on('carBump', (e) => {
        _c.setHex(0xffe6a0);
        this.effects.hit(e.point, _v.set(0, 1, 0), Math.min(40, e.strength), _c.clone());
        if (e.a === this.localCar || e.b === this.localCar) this.cam.shake(Math.min(0.6, e.strength / 50));
      }),
      ev.on('goal', (g) => {
        const style = g.scorer ? g.scorer.cosmetics?.goalfx || 'gfx_classic' : 'gfx_classic';
        this.effects.goal(style, g.pos, g.team);
        this.arena.flash(g.team);
        this.goalTime = 0;
        this.goalPos = g.pos.clone();
        this.cam.shake(1);
      }),
      ev.on('trainingGoal', (g) => {
        this.effects.goal('gfx_classic', g.pos, 0);
        this.arena.flash(0);
      }),
    ];
  }

  resize() {
    this.camera.aspect = this.gr.width / this.gr.height;
    this.camera.updateProjectionMatrix();
  }

  emitBoost(entry, dt) {
    const { car, view } = entry;
    const item = view.boostItem;
    const p = car.physics;
    const rate = this.quality.id === 'low' ? 35 : this.quality.id === 'medium' ? 70 : 120;
    entry.emitAcc += dt * rate;
    p.forward(_v2);
    while (entry.emitAcc >= 1) {
      entry.emitAcc -= 1;
      for (let i = 0; i < view.model.exhausts.length; i++) {
        view.exhaustWorld(i, _v);
        const jitter = 3;
        const vx = -_v2.x * 18 + p.vel.x * 0.6 + (Math.random() - 0.5) * jitter;
        const vy = -_v2.y * 18 + p.vel.y * 0.6 + (Math.random() - 0.5) * jitter;
        const vz = -_v2.z * 18 + p.vel.z * 0.6 + (Math.random() - 0.5) * jitter;
        if (item.rainbow) _c.setHSL((this.time * 0.8 + Math.random() * 0.2) % 1, 1, 0.6);
        else _c.setHex(item.edge);
        if (item.smoke) {
          this.smoke.emit(_v.x, _v.y, _v.z, vx * 0.5, vy * 0.5 + 1, vz * 0.5, _c, 1.6, 0.9, 1.5, -1.5, 3.5, 0.75);
          _c2.setHex(item.core);
          this.glow.emit(_v.x, _v.y, _v.z, vx, vy, vz, _c2, 0.8, 0.12, 0, 0, 0);
        } else if (item.sparks) {
          this.glow.emit(_v.x, _v.y, _v.z, vx * 1.3 + (Math.random() - 0.5) * 10, vy + Math.random() * 6, vz * 1.3 + (Math.random() - 0.5) * 10, _c, 0.45, 0.45, 1, 25, 0);
        } else {
          this.glow.emit(_v.x, _v.y, _v.z, vx, vy, vz, _c, 1.1, 0.32, 3, 0, 1.6, 0.9);
          _c2.setHex(item.core);
          if (Math.random() < 0.5) this.glow.emit(_v.x, _v.y, _v.z, vx * 0.7, vy * 0.7, vz * 0.7, _c2, 0.7, 0.14, 0, 0, 0.5);
        }
      }
    }
  }

  update(dt, mode, info = {}) {
    this.time += dt;
    const w = this.world;
    this.ball.update(dt, w.ball);
    this.placeShadow(this.ballShadow, w.ball.pos, w.ball.hidden, w.ball.radius);
    for (const entry of this.cars) {
      const { car, view, trail, shadow } = entry;
      const boosting = car.boosting && !car.demolished;
      view.update(dt, car, boosting);
      this.placeShadow(shadow, car.physics.pos, car.demolished, 1.05);
      if (boosting) this.emitBoost(entry, dt);
      else entry.emitAcc = 0;
      // Trail from between the exhausts
      if (trail.enabled || trail.points.length) {
        view.exhaustWorld(0, _v);
        view.exhaustWorld(1, _v2);
        _v.add(_v2).multiplyScalar(0.5);
        car.physics.up(_r);
        trail.update(dt, _v, _r, boosting);
      }
      // Supersonic streaks
      if (!car.demolished && car.physics.speed > 52 && Math.random() < 0.5 && this.quality.id !== 'low') {
        const p = car.physics.pos;
        _c.setRGB(0.8, 0.95, 1);
        this.glow.emit(p.x + (Math.random() - 0.5) * 3, p.y + Math.random() * 1.5, p.z + (Math.random() - 0.5) * 3, -car.physics.vel.x * 0.2, 0, -car.physics.vel.z * 0.2, _c, 0.5, 0.25, 0, 0, 0, 0.6);
      }
    }
    this.updatePads();
    this.glow.update(dt);
    this.smoke.update(dt);
    this.effects.update(dt);
    this.arena.update(dt, w.ball.pos);
    // Crowd gets louder when the ball nears a goal
    const nearGoal = Math.max(0, 1 - (ARENA.halfLength - Math.abs(w.ball.pos.z)) / 30);
    this.arena.setExcitement(nearGoal * 0.35);

    const local = this.localCar;
    if (mode === 'goal' && this.goalPos) {
      this.goalTime += dt;
      this.cam.goalCam(dt, this.goalPos, this.goalTime);
    } else if (mode === 'replay') {
      this.cam.replayCam(dt, w.ball, info.goalSign || 1, info.focusCar);
    } else if (local) {
      this.cam.follow(dt, local, w.ball);
    }
    this.glow.setScale(this.gr.pixelHeight, this.camera.fov);
    this.smoke.setScale(this.gr.pixelHeight, this.camera.fov);
  }

  placeShadow(m, pos, hidden, restHeight) {
    m.visible = !hidden;
    if (hidden) return;
    const h = Math.max(0, pos.y - restHeight);
    m.position.set(pos.x, 0.03, pos.z);
    const s = m.userData.base * (1 + h * 0.03);
    m.scale.set(s, 1, s);
    m.material.opacity = Math.max(0.15, 1 - h / 30);
  }

  // Screen position (CSS px) of a world point, or null when behind the camera.
  project(pos, out) {
    _v.copy(pos).project(this.camera);
    if (_v.z > 1) return null;
    out.x = (_v.x * 0.5 + 0.5) * this.gr.width;
    out.y = (-_v.y * 0.5 + 0.5) * this.gr.height;
    out.inside = _v.x > -1 && _v.x < 1 && _v.y > -1 && _v.y < 1;
    return out;
  }

  render() {
    this.gr.render(this.scene, this.camera);
  }

  dispose() {
    this.unsub.forEach((u) => u());
    this.effects.dispose();
    this.arena.dispose();
    this.ball.dispose();
    for (const e of this.cars) {
      e.view.dispose();
      e.trail.dispose();
      e.shadow.material.dispose();
    }
    this.ballShadow.material.dispose();
    this.shadowGeo.dispose();
    this.shadowTex.dispose();
    this.glow.dispose();
    this.smoke.dispose();
    this.padBase.geometry.dispose();
    this.padBaseMat.dispose();
    this.smallGeo.dispose();
    this.padCoreMat.dispose();
    this.orbMat.dispose();
    this.orbTex.dispose();
    this.smallCores.dispose();
  }
}
