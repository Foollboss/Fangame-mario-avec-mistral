import * as THREE from 'three';
import { BODIES, PHYS } from '../config.js';
import { makeNameSprite, makeCarShadowTexture } from './textures.js';

// Bodies are lofted from cross-sections: [x, bottom y, top y, half width] along the car (x forward).
const PROFILES = {
  octane: {
    body: [[-0.66, -0.07, 0.07, 0.33], [-0.62, -0.12, 0.14, 0.395], [-0.45, -0.12, 0.17, 0.41], [0, -0.12, 0.165, 0.41],
      [0.3, -0.12, 0.14, 0.405], [0.52, -0.11, 0.09, 0.39], [0.64, -0.08, 0.035, 0.35], [0.675, -0.04, 0, 0.3]],
    cabin: [[-0.54, 0.1, 0.13, 0.26], [-0.5, 0.1, 0.2, 0.29], [-0.32, 0.1, 0.33, 0.3], [-0.05, 0.1, 0.345, 0.3],
      [0.12, 0.1, 0.28, 0.305], [0.28, 0.1, 0.16, 0.31], [0.33, 0.1, 0.12, 0.3]],
    n: 3.2, wheelR: [0.17, 0.19], wheelX: [0.37, -0.36], wheelZ: 0.41, spoiler: [-0.6, 0.27],
  },
  dominus: {
    body: [[-0.72, -0.06, 0.06, 0.33], [-0.68, -0.1, 0.13, 0.4], [-0.4, -0.1, 0.15, 0.415], [0.1, -0.1, 0.13, 0.415],
      [0.45, -0.1, 0.09, 0.4], [0.66, -0.08, 0.04, 0.36], [0.73, -0.04, 0, 0.3]],
    cabin: [[-0.62, 0.08, 0.12, 0.25], [-0.56, 0.08, 0.18, 0.28], [-0.35, 0.08, 0.27, 0.29], [-0.1, 0.08, 0.275, 0.29],
      [0.05, 0.08, 0.22, 0.3], [0.2, 0.08, 0.13, 0.3], [0.24, 0.08, 0.1, 0.29]],
    n: 3.4, wheelR: [0.16, 0.17], wheelX: [0.42, -0.43], wheelZ: 0.42, spoiler: [-0.66, 0.2],
  },
  breakout: {
    body: [[-0.74, -0.05, 0.08, 0.32], [-0.7, -0.1, 0.15, 0.39], [-0.45, -0.1, 0.155, 0.4], [0, -0.1, 0.12, 0.4],
      [0.4, -0.1, 0.06, 0.39], [0.68, -0.08, 0.01, 0.34], [0.76, -0.05, -0.02, 0.28]],
    cabin: [[-0.58, 0.07, 0.12, 0.23], [-0.52, 0.07, 0.18, 0.26], [-0.32, 0.07, 0.26, 0.27], [-0.1, 0.07, 0.25, 0.27],
      [0.1, 0.07, 0.16, 0.28], [0.27, 0.07, 0.07, 0.27]],
    n: 3, wheelR: [0.15, 0.18], wheelX: [0.45, -0.44], wheelZ: 0.4, spoiler: [-0.68, 0.23],
  },
  merc: {
    body: [[-0.66, -0.1, 0.12, 0.36], [-0.62, -0.15, 0.2, 0.42], [-0.3, -0.15, 0.21, 0.43], [0.3, -0.15, 0.2, 0.43],
      [0.58, -0.14, 0.14, 0.42], [0.66, -0.1, 0.08, 0.38], [0.68, -0.06, 0.02, 0.33]],
    cabin: [[-0.6, 0.15, 0.2, 0.31], [-0.56, 0.15, 0.4, 0.33], [-0.2, 0.15, 0.43, 0.34], [0.2, 0.15, 0.42, 0.34],
      [0.34, 0.15, 0.3, 0.345], [0.42, 0.15, 0.18, 0.34]],
    n: 5, wheelR: [0.19, 0.19], wheelX: [0.38, -0.38], wheelZ: 0.43, spoiler: null,
  },
};

// Catmull-Rom interpolation of keyframes at parameter u in [0, 1].
function sample(keys, u) {
  const t = u * (keys.length - 1);
  const i = Math.min(keys.length - 2, Math.floor(t));
  const f = t - i;
  const p0 = keys[Math.max(0, i - 1)];
  const p1 = keys[i];
  const p2 = keys[i + 1];
  const p3 = keys[Math.min(keys.length - 1, i + 2)];
  const out = [];
  for (let k = 0; k < p1.length; k++) {
    const a = p0[k]; const b = p1[k]; const c = p2[k]; const d = p3[k];
    out.push(0.5 * ((2 * b) + (-a + c) * f + (2 * a - 5 * b + 4 * c - d) * f * f + (-a + 3 * b - 3 * c + d) * f * f * f));
  }
  return out;
}

// Lofts superellipse cross-sections into a smooth closed mesh.
// classify(section, theta) returns a material group index for each quad.
function loft(keys, { n = 3.2, nBottom = 7, taper = 0.12, rows = 30, cols = 28, classify = () => 0, groups = 1 }) {
  const pos = [];
  const sections = [];
  for (let r = 0; r < rows; r++) {
    const u = 0.5 - 0.5 * Math.cos((r / (rows - 1)) * Math.PI);
    const [x, yb, yt, hw] = sample(keys, u);
    sections.push({ x, yb, yt, hw, u });
    const yc = (yb + yt) / 2;
    const h = Math.max(0.005, (yt - yb) / 2);
    for (let c = 0; c < cols; c++) {
      const th = (c / cols) * Math.PI * 2;
      const cs = Math.cos(th);
      const sn = Math.sin(th);
      const e = sn >= 0 ? n : nBottom;
      let z = hw * Math.sign(cs) * Math.pow(Math.abs(cs), 2 / e);
      const y = yc + h * Math.sign(sn) * Math.pow(Math.abs(sn), 2 / e);
      z *= 1 - taper * Math.max(0, (y - yc) / h);
      pos.push(x, y, z);
    }
  }
  const idx = Array.from({ length: groups }, () => []);
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < cols; c++) {
      const a = r * cols + c;
      const b = r * cols + ((c + 1) % cols);
      const d = (r + 1) * cols + c;
      const e = (r + 1) * cols + ((c + 1) % cols);
      const g = classify(sections[r], sections[r + 1], ((c + 0.5) / cols) * Math.PI * 2);
      idx[g].push(a, d, b, b, d, e);
    }
  }
  // End caps with their own vertices so they stay flat.
  for (const r of [0, rows - 1]) {
    const start = pos.length / 3;
    const s = sections[r];
    pos.push(s.x, (s.yb + s.yt) / 2, 0);
    for (let c = 0; c < cols; c++) pos.push(pos[(r * cols + c) * 3], pos[(r * cols + c) * 3 + 1], pos[(r * cols + c) * 3 + 2]);
    for (let c = 0; c < cols; c++) {
      const a = start + 1 + c;
      const b = start + 1 + ((c + 1) % cols);
      if (r === 0) idx[0].push(start, a, b); else idx[0].push(start, b, a);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const all = [];
  idx.forEach((list, g) => {
    geo.addGroup(all.length, list.length, g);
    all.push(...list);
  });
  geo.setIndex(all);
  geo.computeVertexNormals();
  return geo;
}

const tireGeo = new THREE.TorusGeometry(0.78, 0.24, 12, 28);
const rimGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.1, 24);
rimGeo.rotateX(Math.PI / 2);
const hubGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.14, 12);
hubGeo.rotateX(Math.PI / 2);
const spokeGeo = new THREE.BoxGeometry(0.12, 0.58, 0.12);
spokeGeo.translate(0, 0.3, 0);
const flameGeo = new THREE.ConeGeometry(0.1, 0.75, 14, 1, true);
flameGeo.rotateZ(Math.PI / 2);
flameGeo.translate(-0.375, 0, 0);
const coreGeo = new THREE.ConeGeometry(0.05, 0.38, 10, 1, true);
coreGeo.rotateZ(Math.PI / 2);
coreGeo.translate(-0.19, 0, 0);
const pipeGeo = new THREE.CylinderGeometry(0.038, 0.045, 0.12, 12, 1, true);
pipeGeo.rotateZ(Math.PI / 2);
const shadowGeo = new THREE.PlaneGeometry(1.9, 1.15);
shadowGeo.rotateX(-Math.PI / 2);
let shadowMat = null;
const SHARED = [tireGeo, rimGeo, hubGeo, spokeGeo, flameGeo, coreGeo, pipeGeo, shadowGeo];
const tmpF = new THREE.Vector3();

export class CarView {
  constructor(car, { teamColor, accent = 0x222222, boostColor = null, showName = true }) {
    this.car = car;
    const key = PROFILES[car.bodyKey] ? car.bodyKey : 'octane';
    const pf = PROFILES[key];
    const body = BODIES[key];
    this.group = new THREE.Group();
    this.root = new THREE.Group();
    this.group.add(this.root);

    const paint = new THREE.MeshPhysicalMaterial({
      color: teamColor, metalness: 0.5, roughness: 0.34, clearcoat: 0.7, clearcoatRoughness: 0.14,
    });
    const accentMat = new THREE.MeshPhysicalMaterial({ color: accent, metalness: 0.6, roughness: 0.35, clearcoat: 0.6 });
    const glass = new THREE.MeshPhysicalMaterial({
      color: 0x060a14, metalness: 0.2, roughness: 0.04, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 1.6,
    });
    const trim = new THREE.MeshStandardMaterial({ color: 0x121419, roughness: 0.62, metalness: 0.3 });
    const tire = new THREE.MeshStandardMaterial({ color: 0x151517, roughness: 0.88 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xe2e6ee, metalness: 0.75, roughness: 0.3 });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xb8bec8, metalness: 0.8, roughness: 0.3 });
    const head = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xeaf4ff).multiplyScalar(2.2), toneMapped: false });
    this.tailMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff1a1a).multiplyScalar(1.4), toneMapped: false });

    // Body: paint on top, dark rocker panel at the very bottom.
    const bodyGeo = loft(pf.body, {
      n: pf.n, taper: 0.1, groups: 2,
      classify: (a, b, th) => (Math.sin(th) < -0.35 ? 1 : 0),
    });
    const bodyMesh = new THREE.Mesh(bodyGeo, [paint, trim]);
    // Cabin: body-coloured roof, dark glass everywhere else.
    const maxTop = Math.max(...pf.cabin.map((k) => k[2]));
    const cabinGeo = loft(pf.cabin, {
      n: pf.n + 0.6, taper: 0.28, groups: 2,
      classify: (a, b, th) => (Math.abs(th - Math.PI / 2) < 0.62 && Math.min(a.yt, b.yt) > maxTop * 0.9 ? 1 : 0),
    });
    const cabin = new THREE.Mesh(cabinGeo, [glass, paint]);
    bodyMesh.castShadow = true;
    cabin.castShadow = true;
    this.root.add(bodyMesh, cabin);

    const front = pf.body[pf.body.length - 1][0];
    const back = pf.body[0][0];
    const bodyAt = (x) => {
      const keys = pf.body;
      let u = 0;
      for (let i = 0; i < 200; i++) {
        const s = sample(keys, i / 199);
        if (s[0] >= x) { u = i / 199; break; }
      }
      return sample(keys, u);
    };

    // Hood stripe.
    const hoodX = front - 0.3;
    const hood = bodyAt(hoodX);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.012, 0.1), accentMat);
    stripe.position.set(hoodX, hood[2] + 0.004, 0);
    stripe.rotation.z = -0.22;
    this.root.add(stripe);

    // Lights, grille and exhausts.
    const nose = bodyAt(front - 0.05);
    for (const s of [1, -1]) {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.028, 0.12), head);
      hl.position.set(front - 0.035, (nose[1] + nose[2]) / 2 + 0.01, s * nose[3] * 0.62);
      hl.rotation.y = s * 0.35;
      this.root.add(hl);
    }
    const grille = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.04, nose[3] * 0.8), trim);
    grille.position.set(front - 0.03, nose[1] + 0.025, 0);
    this.root.add(grille);
    const tailSec = bodyAt(back + 0.03);
    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.03, tailSec[3] * 1.5), this.tailMat);
    tl.position.set(back + 0.005, tailSec[2] - 0.035, 0);
    this.root.add(tl);

    this.flames = [];
    this.exhausts = [];
    const exY = tailSec[1] + 0.05;
    for (const s of [1, -1]) {
      const pipe = new THREE.Mesh(pipeGeo, chrome);
      pipe.position.set(back - 0.02, exY, s * 0.14);
      this.root.add(pipe);
    }

    if (pf.spoiler) {
      const [sx, sy] = pf.spoiler;
      const span = bodyAt(sx)[3] * 2 + 0.04;
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.022, span), accentMat);
      wing.position.set(sx, sy, 0);
      wing.rotation.z = 0.14;
      wing.castShadow = true;
      this.root.add(wing);
      for (const s of [1, -1]) {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.07, 0.012), accentMat);
        plate.position.set(sx, sy - 0.015, s * span / 2);
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.04, sy - 0.1, 0.025), trim);
        strut.position.set(sx + 0.03, (sy + 0.1) / 2, s * span * 0.28);
        this.root.add(plate, strut);
      }
    }

    // Wheels: pivot (steering) > spinner > tyre, rim, spokes.
    const wheelBaseY = -(body.hy + PHYS.rideHeight);
    this.wheels = [];
    for (let i = 0; i < 4; i++) {
      const frontWheel = i < 2;
      const r = pf.wheelR[frontWheel ? 0 : 1];
      const side = i % 2 ? -1 : 1;
      const pivot = new THREE.Group();
      pivot.position.set(pf.wheelX[frontWheel ? 0 : 1], wheelBaseY + r, side * pf.wheelZ);
      const spinner = new THREE.Group();
      const t = new THREE.Mesh(tireGeo, tire);
      t.scale.set(r, r, r * 1.1);
      t.castShadow = true;
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.scale.set(r, r, 1);
      const hub = new THREE.Mesh(hubGeo, accentMat);
      hub.scale.set(r, r, 1);
      hub.position.z = side * 0.02;
      spinner.add(t, rim, hub);
      for (let k = 0; k < 5; k++) {
        const sp = new THREE.Mesh(spokeGeo, chrome);
        sp.scale.set(r, r, 1);
        sp.rotation.z = (k * Math.PI * 2) / 5;
        sp.position.z = side * 0.015;
        spinner.add(sp);
      }
      pivot.add(spinner);
      this.root.add(pivot);
      this.wheels.push({ pivot, spinner, front: frontWheel });
      const sec = bodyAt(pivot.position.x);
      const arch = new THREE.Mesh(new THREE.TorusGeometry(r + 0.04, 0.035, 8, 18, Math.PI), trim);
      arch.position.set(pivot.position.x, pivot.position.y, side * (sec[3] + 0.005));
      arch.scale.set(1, 1, 1.6);
      this.root.add(arch);
    }

    // Boost flames.
    const bc = new THREE.Color(boostColor ?? teamColor);
    this.flameMat = new THREE.MeshBasicMaterial({
      color: bc.clone().multiplyScalar(2.5), transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending,
      depthWrite: false, toneMapped: false, side: THREE.DoubleSide,
    });
    this.coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(0xfff2c0).multiplyScalar(3), transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending,
      depthWrite: false, toneMapped: false,
    });
    for (const s of [1, -1]) {
      const f = new THREE.Group();
      f.position.set(back - 0.06, exY, s * 0.14);
      f.add(new THREE.Mesh(flameGeo, this.flameMat), new THREE.Mesh(coreGeo, this.coreMat));
      f.visible = false;
      this.root.add(f);
      this.flames.push(f);
      this.exhausts.push(new THREE.Vector3(back - 0.08, exY, s * 0.14));
    }
    this.boostColor = bc;
    this.backX = back;
    this.halfWidth = pf.wheelZ;
    this.wheelBaseY = wheelBaseY;

    // Soft contact shadow on the pitch.
    if (!shadowMat) shadowMat = new THREE.MeshBasicMaterial({ map: makeCarShadowTexture(), transparent: true, depthWrite: false });
    this.shadow = new THREE.Mesh(shadowGeo, shadowMat.clone());
    this.shadow.renderOrder = 2;
    this.group.add(this.shadow);

    if (showName) {
      this.nameTag = makeNameSprite(car.name, teamColor === undefined ? '#fff' : `#${new THREE.Color(teamColor).getHexString()}`);
      this.nameTag.position.set(0, 1.0, 0);
      this.group.add(this.nameTag);
    }
  }

  // state: {pos, quat, boosting, demolished, steer, spin, braking}
  update(state, time) {
    this.group.visible = !state.demolished;
    if (state.demolished) return;
    this.group.position.copy(state.pos);
    this.root.quaternion.copy(state.quat);
    for (const w of this.wheels) {
      if (w.front) w.pivot.rotation.y = -state.steer * 0.45;
      w.spinner.rotation.z = -state.spin;
    }
    const h = state.pos.y - 0.35;
    this.shadow.visible = h < 4 && Math.abs(state.pos.x) < 38 && Math.abs(state.pos.z) < 60;
    if (this.shadow.visible) {
      tmpF.set(1, 0, 0).applyQuaternion(state.quat);
      this.shadow.position.set(0, 0.02 - state.pos.y, 0);
      this.shadow.rotation.y = Math.atan2(-tmpF.z, tmpF.x);
      this.shadow.material.opacity = Math.max(0, 0.75 * (1 - h / 4));
      const k = 1 + h * 0.15;
      this.shadow.scale.set(k, 1, k);
    }
    this.tailMat.color.setRGB(state.braking ? 3.2 : 1.4, state.braking ? 0.1 : 0.03, state.braking ? 0.1 : 0.03);
    for (const f of this.flames) {
      f.visible = state.boosting;
      if (state.boosting) {
        const k = 0.85 + Math.sin(time * 60 + f.position.z * 10) * 0.12 + Math.random() * 0.15;
        f.scale.set(k * (state.supersonic ? 1.4 : 1), 1, 1);
      }
    }
  }

  exhaustWorld(i, out) {
    return out.copy(this.exhausts[i]).applyQuaternion(this.root.quaternion).add(this.group.position);
  }

  dispose() {
    this.group.traverse((o) => {
      if (o.isMesh && o.geometry && !SHARED.includes(o.geometry)) o.geometry.dispose();
      if (o.material && o.material.map && o.isSprite) o.material.map.dispose();
      if (o === this.shadow) o.material.dispose();
    });
  }
}
