import * as THREE from 'three';
import { getItem } from '../meta/Catalog.js';
import { buildCarModel, resolveCosmetics } from './CarModelFactory.js';

const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();

export class CarView {
  constructor(cosmetics, team, opts = {}) {
    this.team = team;
    this.opts = opts;
    this.group = new THREE.Group();
    this.time = Math.random() * 10;
    this.boostLevel = 0;
    this.setCosmetics(cosmetics);
  }

  setCosmetics(cosmetics) {
    if (this.model) {
      this.group.remove(this.model.root);
      this.model.dispose();
      this.flameMat?.dispose();
      this.flameGeo?.dispose();
    }
    this.cosmetics = resolveCosmetics(cosmetics);
    this.model = buildCarModel(this.cosmetics, this.team, this.opts);
    this.group.add(this.model.root);
    if (this.opts.shadows) {
      this.model.root.traverse((o) => {
        if (o.isMesh && o !== this.model.under && !o.material.transparent) o.castShadow = true;
      });
    }
    const boost = getItem(this.cosmetics.boost) || getItem('bst_flame');
    this.boostItem = boost;
    // Flame cones at each nozzle: always visible when boosting, even with few particles.
    this.flameGeo = new THREE.ConeGeometry(0.22, 1.4, 10, 1, true);
    this.flameGeo.rotateX(-Math.PI / 2);
    this.flameGeo.translate(0, 0, -0.7);
    this.flameMat = new THREE.MeshBasicMaterial({
      color: boost.smoke ? 0xffa040 : boost.core, transparent: true, opacity: 0.9,
      blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
    });
    this.flames = this.model.exhausts.map((e) => {
      const f = new THREE.Mesh(this.flameGeo, this.flameMat);
      f.position.copy(e);
      f.scale.setScalar(0.001);
      this.model.body.add(f);
      return f;
    });
  }

  // Exhaust points in world space (particles, trails).
  exhaustWorld(i, out) {
    return this.model.body.localToWorld(out.copy(this.model.exhausts[i]));
  }

  update(dt, car, boosting) {
    const p = car.physics;
    const m = this.model;
    this.time += dt;
    this.group.visible = !car.demolished;
    if (car.demolished) return;
    this.group.position.copy(p.pos);
    _q.copy(p.quat).multiply(p.landTilt);
    this.group.quaternion.copy(_q);
    m.body.position.y = p.susp.y;
    m.body.rotation.x = p.susp.pitch;
    m.body.rotation.z = p.susp.roll;
    const spin = (p.forwardSpeed / m.wheelRadius) * dt;
    const drop = p.grounded ? 0 : -0.12;
    for (const w of m.wheels) {
      w.spin.rotation.x += spin;
      if (w.front) w.steer.rotation.y = -p.steerVisual * 0.45;
      w.spin.position.y = drop;
    }
    // Underglow fades with height
    m.under.material.opacity = 0.55;
    m.under.visible = p.grounded;
    if (m.topper) {
      m.topper.rotation.y += dt * 1.5;
    }
    if (m.animatedColor) m.bodyMat.color.setHSL((this.time * 0.08) % 1, 0.85, 0.55);
    if (m.wheelGlow) m.wheelGlow.color.setHSL((this.time * 0.3) % 1, 0.9, 0.65);
    // Boost flames
    this.boostLevel += ((boosting ? 1 : 0) - this.boostLevel) * Math.min(1, dt * 18);
    const b = this.boostLevel;
    const flick = 0.85 + Math.random() * 0.3;
    for (const f of this.flames) {
      f.visible = b > 0.02;
      f.scale.set(b, b, b * flick * (1 + Math.min(1, p.speed / 60)));
    }
    if (this.boostItem.rainbow) this.flameMat.color.setHSL((this.time * 0.9) % 1, 1, 0.6);
  }

  labelPosition(out) {
    return out.copy(this.group.position).add(_v.set(0, 3.2, 0));
  }

  dispose() {
    this.model.dispose();
    this.flameMat.dispose();
    this.flameGeo.dispose();
  }
}
