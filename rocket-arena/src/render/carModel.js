import * as THREE from 'three';
import { BODIES, PHYS } from '../config.js';
import { makeNameSprite } from './textures.js';

const PROFILES = {
  octane: {
    body: [[-0.62, -0.12], [0.55, -0.12], [0.64, -0.06], [0.66, 0.04], [0.62, 0.1], [0.28, 0.16], [-0.5, 0.18], [-0.64, 0.14], [-0.66, 0]],
    cabin: [[0.3, 0.12], [0.3, 0.14], [0.06, 0.33], [-0.28, 0.34], [-0.52, 0.17], [-0.52, 0.12]],
    width: 0.72, cabinWidth: 0.54, wheelR: [0.17, 0.19], wheelX: [0.37, -0.36], wheelZ: 0.4, spoiler: [-0.6, 0.27],
  },
  dominus: {
    body: [[-0.68, -0.1], [0.62, -0.1], [0.7, -0.04], [0.71, 0.04], [0.6, 0.09], [0.15, 0.13], [-0.55, 0.15], [-0.7, 0.13], [-0.72, 0]],
    cabin: [[0.18, 0.1], [0.18, 0.12], [-0.02, 0.26], [-0.34, 0.27], [-0.6, 0.15], [-0.6, 0.1]],
    width: 0.74, cabinWidth: 0.56, wheelR: [0.16, 0.17], wheelX: [0.42, -0.43], wheelZ: 0.41, spoiler: [-0.66, 0.21],
  },
  breakout: {
    body: [[-0.7, -0.1], [0.66, -0.1], [0.74, -0.06], [0.72, 0], [0.3, 0.1], [-0.55, 0.16], [-0.72, 0.14], [-0.73, 0]],
    cabin: [[0.25, 0.08], [0.25, 0.09], [-0.05, 0.25], [-0.3, 0.26], [-0.55, 0.15], [-0.55, 0.1]],
    width: 0.7, cabinWidth: 0.5, wheelR: [0.15, 0.18], wheelX: [0.45, -0.44], wheelZ: 0.39, spoiler: [-0.68, 0.24],
  },
  merc: {
    body: [[-0.62, -0.15], [0.58, -0.15], [0.64, -0.08], [0.65, 0.12], [0.45, 0.18], [-0.58, 0.2], [-0.64, 0.16], [-0.65, -0.02]],
    cabin: [[0.4, 0.15], [0.4, 0.16], [0.25, 0.42], [-0.45, 0.43], [-0.58, 0.2], [-0.58, 0.15]],
    width: 0.76, cabinWidth: 0.62, wheelR: [0.19, 0.19], wheelX: [0.38, -0.38], wheelZ: 0.41, spoiler: null,
  },
};

function extrude(points, depth, bevel) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 4,
  });
  geo.translate(0, 0, -depth / 2);
  geo.computeVertexNormals();
  return geo;
}

const tireGeo = new THREE.CylinderGeometry(1, 1, 0.13, 22);
tireGeo.rotateX(Math.PI / 2);
const rimGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.14, 16);
rimGeo.rotateX(Math.PI / 2);
const spokeGeo = new THREE.BoxGeometry(0.14, 1.1, 0.145);
const flameGeo = new THREE.ConeGeometry(0.1, 0.7, 12, 1, true);
flameGeo.rotateZ(Math.PI / 2);
flameGeo.translate(-0.35, 0, 0);
const coreGeo = new THREE.ConeGeometry(0.05, 0.35, 10, 1, true);
coreGeo.rotateZ(Math.PI / 2);
coreGeo.translate(-0.175, 0, 0);

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
      color: teamColor, metalness: 0.3, roughness: 0.45, clearcoat: 0.35, clearcoatRoughness: 0.35,
    });
    const accentMat = new THREE.MeshStandardMaterial({ color: accent, metalness: 0.5, roughness: 0.5 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x0a0e18, metalness: 0.5, roughness: 0.22 });
    const tire = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.92 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xc8ccd4, metalness: 0.9, roughness: 0.25 });
    const head = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xeaf4ff).multiplyScalar(1.6), toneMapped: false });
    const tail = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xff2020).multiplyScalar(1.5), toneMapped: false });
    const trim = new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.7, metalness: 0.2 });

    const bodyMesh = new THREE.Mesh(extrude(pf.body, pf.width, 0.04), paint);
    const cabin = new THREE.Mesh(extrude(pf.cabin, pf.cabinWidth, 0.035), glass);
    bodyMesh.castShadow = true;
    cabin.castShadow = true;
    this.root.add(bodyMesh, cabin);

    // Roof panel and hood stripe in the accent colour.
    const roofPts = pf.cabin.slice(2, 4);
    const roofLen = Math.abs(roofPts[0][0] - roofPts[1][0]) * 0.8;
    const roof = new THREE.Mesh(new THREE.BoxGeometry(roofLen, 0.025, pf.cabinWidth * 0.9), accentMat);
    roof.position.set((roofPts[0][0] + roofPts[1][0]) / 2, Math.max(roofPts[0][1], roofPts[1][1]) + 0.03, 0);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.02, 0.12), accentMat);
    const hood = pf.body[5];
    stripe.position.set(hood[0] + 0.12, hood[1] + 0.035, 0);
    stripe.rotation.z = -0.12;
    this.root.add(roof, stripe);

    const front = Math.max(...pf.body.map((p) => p[0]));
    const back = Math.min(...pf.body.map((p) => p[0]));
    for (const s of [1, -1]) {
      const hl = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.14), head);
      hl.position.set(front + 0.02, 0.04, s * pf.width * 0.36);
      const tl = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.16), tail);
      tl.position.set(back - 0.02, 0.08, s * pf.width * 0.36);
      this.root.add(hl, tl);
    }

    if (pf.spoiler) {
      const [sx, sy] = pf.spoiler;
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.03, pf.width + 0.06), accentMat);
      wing.position.set(sx, sy, 0);
      wing.rotation.z = 0.12;
      wing.castShadow = true;
      this.root.add(wing);
      for (const s of [1, -1]) {
        const strut = new THREE.Mesh(new THREE.BoxGeometry(0.05, sy - 0.12, 0.03), accentMat);
        strut.position.set(sx + 0.02, (sy + 0.12) / 2, s * pf.width * 0.3);
        this.root.add(strut);
      }
    }

    // Wheels: pivot (steering) > spinner > meshes.
    const wheelBaseY = -(body.hy + PHYS.rideHeight);
    this.wheels = [];
    for (let i = 0; i < 4; i++) {
      const frontWheel = i < 2;
      const r = pf.wheelR[frontWheel ? 0 : 1];
      const pivot = new THREE.Group();
      pivot.position.set(pf.wheelX[frontWheel ? 0 : 1], wheelBaseY + r, (i % 2 ? -1 : 1) * pf.wheelZ);
      const spinner = new THREE.Group();
      const t = new THREE.Mesh(tireGeo, tire);
      t.scale.set(r, r, 1);
      t.castShadow = true;
      const rim = new THREE.Mesh(rimGeo, rimMat);
      rim.scale.set(r, r, 1);
      spinner.add(t, rim);
      for (let k = 0; k < 3; k++) {
        const sp = new THREE.Mesh(spokeGeo, accentMat);
        sp.scale.set(r, r, 1);
        sp.rotation.z = (k * Math.PI) / 3;
        spinner.add(sp);
      }
      pivot.add(spinner);
      this.root.add(pivot);
      this.wheels.push({ pivot, spinner, front: frontWheel });
      // Fender arch over the wheel.
      const arch = new THREE.Mesh(new THREE.TorusGeometry(r + 0.035, 0.03, 6, 14, Math.PI), trim);
      arch.position.set(pivot.position.x, pivot.position.y, (i % 2 ? -1 : 1) * (pf.width / 2 + 0.045));
      this.root.add(arch);
    }
    // Side skirts between the wheels.
    const skirtLen = pf.wheelX[0] - pf.wheelX[1] - pf.wheelR[0] - pf.wheelR[1] - 0.06;
    for (const sd of [1, -1]) {
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(skirtLen, 0.05, 0.03), trim);
      skirt.position.set((pf.wheelX[0] + pf.wheelX[1]) / 2 + (pf.wheelR[1] - pf.wheelR[0]) / 2, wheelBaseY + 0.13, sd * (pf.width / 2 + 0.04));
      this.root.add(skirt);
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
    this.flames = [];
    this.exhausts = [];
    for (const s of [1, -1]) {
      const f = new THREE.Group();
      f.position.set(back - 0.01, 0.0, s * pf.width * 0.2);
      f.add(new THREE.Mesh(flameGeo, this.flameMat), new THREE.Mesh(coreGeo, this.coreMat));
      f.visible = false;
      this.root.add(f);
      this.flames.push(f);
      this.exhausts.push(new THREE.Vector3(back - 0.05, 0.0, s * pf.width * 0.2));
    }
    this.boostColor = bc;
    this.backX = back;
    this.halfWidth = pf.width / 2;
    this.wheelBaseY = wheelBaseY;

    if (showName) {
      this.nameTag = makeNameSprite(car.name, teamColor === undefined ? '#fff' : `#${new THREE.Color(teamColor).getHexString()}`);
      this.nameTag.position.set(0, 1.0, 0);
      this.group.add(this.nameTag);
    }
  }

  // state: {pos, quat, boosting, demolished, steer, spin}
  update(state, time) {
    this.group.visible = !state.demolished;
    if (state.demolished) return;
    this.group.position.copy(state.pos);
    this.root.quaternion.copy(state.quat);
    for (const w of this.wheels) {
      if (w.front) w.pivot.rotation.y = -state.steer * 0.45;
      w.spinner.rotation.z = -state.spin;
    }
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
      if (o.isMesh && o.geometry && ![tireGeo, rimGeo, spokeGeo, flameGeo, coreGeo].includes(o.geometry)) o.geometry.dispose();
      if (o.material && o.material.map && o.isSprite) o.material.map.dispose();
    });
  }
}
