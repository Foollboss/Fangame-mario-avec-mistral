import * as THREE from 'three';
import { CAR, TEAM } from '../core/Config.js';
import { getItem, DEFAULT_EQUIPPED } from '../meta/Catalog.js';
import { carbonTexture, decalTexture, radialTexture } from './Textures.js';

// Model space: origin = hitbox centre, +Z forward, +Y up. Ground is at y = -rideHeight.
const GROUND = -CAR.rideHeight;

// Side profiles in (forward, up) coordinates. Each design has its own silhouette and details.
const DESIGNS = {
  pulse: {
    width: 2.3, cabinWidth: 1.75, wheelR: 0.56, wheelbase: 2.9, track: 1.18,
    body: [[-2.15, -0.55], [2.1, -0.55], [2.2, -0.25], [1.95, 0.02], [0.7, 0.18], [-1.6, 0.26], [-2.15, 0.16]],
    cabin: [[0.85, 0.16], [0.15, 0.78], [-1.05, 0.78], [-1.65, 0.24]],
    spoiler: { z: -1.95, y: 0.52, w: 2.1, h: 0.1, d: 0.5, posts: true },
  },
  vortex: {
    width: 2.15, cabinWidth: 1.4, wheelR: 0.54, wheelbase: 3.0, track: 1.12,
    body: [[-2.15, -0.6], [2.25, -0.6], [2.3, -0.42], [0.9, 0.02], [-1.7, 0.16], [-2.15, 0.06]],
    cabin: [[0.55, 0.04], [-0.15, 0.56], [-1.1, 0.52], [-1.55, 0.14]],
    spoiler: { z: -2.0, y: 0.78, w: 2.3, h: 0.08, d: 0.55, posts: true },
    fins: false,
  },
  titan: {
    width: 2.55, cabinWidth: 2.2, wheelR: 0.62, wheelbase: 2.8, track: 1.26,
    body: [[-2.2, -0.52], [2.15, -0.52], [2.3, 0.1], [1.7, 0.36], [-2.2, 0.42]],
    cabin: [[1.2, 0.34], [0.78, 1.0], [-1.55, 1.0], [-1.85, 0.4]],
    bullbar: true,
    roofLights: true,
  },
  phantom: {
    width: 2.25, cabinWidth: 1.5, wheelR: 0.52, wheelbase: 3.0, track: 1.14,
    body: [[-2.05, -0.45], [2.25, -0.45], [2.35, -0.3], [2.0, -0.12], [0.4, 0.24], [-1.4, 0.3], [-2.05, 0.08]],
    cabin: [[0.65, 0.2], [-0.05, 0.72], [-0.95, 0.66], [-1.4, 0.26]],
    fins: true,
  },
  comet: {
    width: 2.3, cabinWidth: 1.6, wheelR: 0.55, wheelbase: 2.85, track: 1.16,
    body: [[-2.1, -0.5], [2.05, -0.5], [2.2, -0.1], [1.4, 0.2], [-1.2, 0.34], [-2.1, 0.22]],
    cabin: [[0.9, 0.2], [0.25, 0.84], [-0.9, 0.84], [-1.4, 0.3]],
    canards: true,
    spoiler: { z: -1.85, y: 0.62, w: 1.9, h: 0.14, d: 0.4, posts: false },
  },
  raptor: {
    width: 2.35, cabinWidth: 1.6, wheelR: 0.57, wheelbase: 2.95, track: 1.2,
    body: [[-2.2, -0.55], [2.15, -0.55], [2.4, -0.3], [2.0, -0.05], [1.1, 0.1], [0.2, 0.24], [-2.0, 0.3], [-2.25, 0.0]],
    cabin: [[0.6, 0.22], [0.05, 0.7], [-0.9, 0.72], [-1.6, 0.3]],
    claws: true,
    spoiler: { z: -2.05, y: 0.55, w: 2.4, h: 0.1, d: 0.45, posts: true, split: true },
  },
};

function extrudeProfile(points, width, bevel = 0.1) {
  const shape = new THREE.Shape();
  points.forEach(([z, y], i) => (i === 0 ? shape.moveTo(z, y) : shape.lineTo(z, y)));
  shape.closePath();
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: width - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel * 0.8, bevelSegments: 2, curveSegments: 4,
  });
  geo.translate(0, 0, -(width - bevel * 2) / 2);
  geo.rotateY(-Math.PI / 2);
  geo.computeVertexNormals();
  return geo;
}

function starShape(outer, inner, n = 5) {
  const s = new THREE.Shape();
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? inner : outer;
    const a = (i / (n * 2)) * Math.PI * 2 + Math.PI / 2;
    if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
    else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  s.closePath();
  return s;
}

const shared = {};
function sharedTex(key, make) {
  if (!shared[key]) shared[key] = make();
  return shared[key];
}

export function resolveCosmetics(c) {
  return { ...DEFAULT_EQUIPPED, ...(c || {}) };
}

// Builds a complete car model. Returns handles used by CarView for animation.
export function buildCarModel(cosmetics, team, opts = {}) {
  const cos = resolveCosmetics(cosmetics);
  const d = DESIGNS[cos.car] || DESIGNS.pulse;
  const teamColor = new THREE.Color(TEAM[team]?.color ?? 0xffffff);
  const disposables = [];
  const T = (o) => (disposables.push(o), o);

  const colorItem = getItem(cos.color) || getItem('col_cobalt');
  const paint = getItem(cos.paint) || getItem('pnt_gloss');
  const baseColor = new THREE.Color(colorItem.hex);
  const envOk = opts.envMap !== false;
  const bodyMat = T(new THREE.MeshStandardMaterial({
    color: baseColor,
    roughness: paint.rough,
    metalness: envOk ? paint.metal : paint.metal * 0.35,
    emissive: paint.glow ? baseColor.clone() : new THREE.Color(0x000000),
    emissiveIntensity: paint.glow || 0,
  }));
  if (paint.pattern === 'carbon') {
    bodyMat.map = sharedTex('carbon', carbonTexture);
  }
  const darkMat = T(new THREE.MeshStandardMaterial({ color: 0x15181f, roughness: 0.6, metalness: 0.3 }));
  const glassMat = T(new THREE.MeshStandardMaterial(envOk
    ? { color: 0x0c1830, roughness: 0.08, metalness: 0.9, envMapIntensity: 1.4 }
    : { color: 0x2a4a78, roughness: 0.2, metalness: 0.2 }));
  const teamMat = T(new THREE.MeshBasicMaterial({ color: teamColor }));
  const headMat = T(new THREE.MeshBasicMaterial({ color: 0xf4fbff }));
  const tailMat = T(new THREE.MeshBasicMaterial({ color: 0xff2440 }));

  const root = new THREE.Group();
  const body = new THREE.Group(); // tilted by suspension
  root.add(body);

  const bodyGeo = T(extrudeProfile(d.body, d.width, 0.12));
  const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
  body.add(bodyMesh);
  const cabin = new THREE.Mesh(T(extrudeProfile(d.cabin, d.cabinWidth, 0.1)), glassMat);
  body.add(cabin);
  // Cabin roof trim in body colour for Titan (boxier look)
  if (cos.car === 'titan') {
    const roof = new THREE.Mesh(T(new THREE.BoxGeometry(d.cabinWidth + 0.05, 0.12, 2.1)), bodyMat);
    roof.position.set(0, 1.02, -0.38);
    body.add(roof);
  }
  // Skirt with team light strip on both sides
  for (const sx of [-1, 1]) {
    const strip = new THREE.Mesh(T(new THREE.BoxGeometry(0.06, 0.08, 3.4)), teamMat);
    strip.position.set(sx * (d.width / 2 + 0.03), -0.38, 0);
    body.add(strip);
  }
  // Lights
  for (const sx of [-1, 1]) {
    const hl = new THREE.Mesh(T(new THREE.BoxGeometry(0.5, 0.12, 0.06)), headMat);
    const front = d.body.reduce((m, p) => Math.max(m, p[0]), 0);
    hl.position.set(sx * (d.width / 2 - 0.4), -0.22, front + 0.02);
    body.add(hl);
    const tl = new THREE.Mesh(T(new THREE.BoxGeometry(0.55, 0.12, 0.06)), tailMat);
    const back = d.body.reduce((m, p) => Math.min(m, p[0]), 0);
    tl.position.set(sx * (d.width / 2 - 0.4), 0.02, back - 0.1);
    body.add(tl);
  }
  // Exhaust nozzles
  const back = d.body.reduce((m, p) => Math.min(m, p[0]), 0);
  const nozzleGeo = T(new THREE.CylinderGeometry(0.2, 0.26, 0.35, 10, 1, true));
  nozzleGeo.rotateX(Math.PI / 2);
  const exhausts = [];
  for (const sx of [-0.45, 0.45]) {
    const n = new THREE.Mesh(nozzleGeo, darkMat);
    n.position.set(sx, -0.25, back - 0.12);
    body.add(n);
    exhausts.push(new THREE.Vector3(sx, -0.25, back - 0.35));
  }

  // Design details
  if (d.spoiler) {
    const sp = d.spoiler;
    const wing = new THREE.Mesh(T(new THREE.BoxGeometry(sp.w, sp.h, sp.d)), sp.split ? darkMat : bodyMat);
    wing.position.set(0, sp.y, sp.z);
    wing.rotation.x = -0.12;
    body.add(wing);
    if (sp.posts) {
      for (const sx of [-0.55, 0.55]) {
        const post = new THREE.Mesh(T(new THREE.BoxGeometry(0.1, sp.y - 0.15, 0.25)), darkMat);
        post.position.set(sx, (sp.y + 0.15) / 2, sp.z + 0.05);
        body.add(post);
      }
    }
    const lip = new THREE.Mesh(T(new THREE.BoxGeometry(sp.w + 0.02, 0.05, 0.08)), teamMat);
    lip.position.set(0, sp.y + sp.h / 2, sp.z - sp.d / 2);
    body.add(lip);
  }
  if (d.fins) {
    for (const sx of [-0.7, 0.7]) {
      const fin = new THREE.Mesh(T(new THREE.BoxGeometry(0.08, 0.6, 0.9)), bodyMat);
      fin.position.set(sx, 0.55, -1.7);
      fin.rotation.x = 0.35;
      body.add(fin);
    }
  }
  if (d.canards) {
    for (const sx of [-1, 1]) {
      const c = new THREE.Mesh(T(new THREE.BoxGeometry(0.55, 0.06, 1.1)), bodyMat);
      c.position.set(sx * (d.width / 2 + 0.2), -0.05, -0.9);
      c.rotation.z = sx * 0.15;
      body.add(c);
    }
  }
  if (d.bullbar) {
    const bar = new THREE.Mesh(T(new THREE.BoxGeometry(d.width - 0.2, 0.18, 0.18)), darkMat);
    bar.position.set(0, -0.3, 2.35);
    body.add(bar);
  }
  if (d.roofLights) {
    for (let i = -1; i <= 1; i++) {
      const l = new THREE.Mesh(T(new THREE.BoxGeometry(0.35, 0.14, 0.14)), headMat);
      l.position.set(i * 0.55, 1.12, 0.55);
      body.add(l);
    }
  }
  if (d.claws) {
    for (const sx of [-1, 1]) {
      const claw = new THREE.Mesh(T(new THREE.ConeGeometry(0.16, 0.7, 4)), darkMat);
      claw.rotation.x = Math.PI / 2;
      claw.position.set(sx * (d.width / 2 - 0.25), -0.42, 2.35);
      body.add(claw);
    }
  }

  // Decals (both sides)
  if (cos.decal && cos.decal !== 'dec_none') {
    const light = baseColor.getHSL({ h: 0, s: 0, l: 0 }).l > 0.55;
    const key = `${cos.decal}:${light}`;
    const tex = sharedTex(key, () => decalTexture(cos.decal === 'dec_stripes' ? 'dec_stripes' : cos.decal, light ? '#12151c' : '#ffffff', light ? '#ffffff' : '#12151c'));
    if (cos.decal === 'dec_stripes') {
      // Racing stripes over the whole top
      for (const sx of [-0.28, 0.28]) {
        const st = new THREE.Mesh(T(new THREE.BoxGeometry(0.22, 0.02, 4.1)), T(new THREE.MeshBasicMaterial({ color: light ? 0x12151c : 0xffffff })));
        st.position.set(sx, 0.32, 0);
        body.add(st);
        const stc = new THREE.Mesh(T(new THREE.BoxGeometry(0.22, 0.02, 1.6)), st.material);
        const top = d.cabin.reduce((m, p) => Math.max(m, p[1]), 0);
        stc.position.set(sx, top + 0.1, (d.cabin[1][0] + d.cabin[2][0]) / 2);
        body.add(stc);
      }
    } else {
      const dm = T(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 }));
      for (const sx of [-1, 1]) {
        const plane = new THREE.Mesh(T(new THREE.PlaneGeometry(2.9, 1.08)), dm);
        plane.position.set(sx * (d.width / 2 + 0.005), -0.12, -0.1);
        plane.rotation.y = sx * Math.PI / 2;
        body.add(plane);
      }
    }
  }

  // Wheels
  const wheels = [];
  const wr = d.wheelR;
  const tireGeo = T(new THREE.CylinderGeometry(wr, wr, 0.5, 18));
  tireGeo.rotateZ(Math.PI / 2);
  const tireMat = T(new THREE.MeshStandardMaterial({ color: 0x14161b, roughness: 0.9, metalness: 0 }));
  const rim = buildRim(cos.wheels, wr, teamColor, baseColor, T);
  for (const [sx, sz] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) {
    const steer = new THREE.Group();
    steer.position.set(sx * d.track, GROUND + wr, (sz * d.wheelbase) / 2);
    const spin = new THREE.Group();
    steer.add(spin);
    spin.add(new THREE.Mesh(tireGeo, tireMat));
    const r = rim.clone();
    r.position.x = sx * 0.26;
    r.rotation.y = sx > 0 ? 0 : Math.PI;
    spin.add(r);
    root.add(steer);
    wheels.push({ steer, spin, front: sz > 0 });
  }

  // Antenna
  let topper = null;
  if (cos.antenna && cos.antenna !== 'ant_none') {
    const top = d.cabin.reduce((m, p) => Math.max(m, p[1]), 0);
    const pole = new THREE.Mesh(T(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 5)), darkMat);
    const az = d.cabin[2][0] + 0.1;
    pole.position.set(0.45, top + 0.65, az);
    body.add(pole);
    topper = buildTopper(cos.antenna, teamColor, T);
    topper.position.set(0.45, top + 1.35, az);
    body.add(topper);
  }

  // Team underglow (readability) and blob shadow are separate: underglow follows the car.
  const glowTex = sharedTex('glow', () => radialTexture(64));
  const under = new THREE.Mesh(T(new THREE.PlaneGeometry(4.2, 6)), T(new THREE.MeshBasicMaterial({
    map: glowTex, color: teamColor, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false,
  })));
  under.rotation.x = -Math.PI / 2;
  under.position.y = GROUND + 0.06;
  root.add(under);

  return {
    root, body, wheels, topper, exhausts, bodyMat, under,
    animatedColor: colorItem.animated === 'rainbow',
    wheelRadius: wr,
    wheelGlow: rim.userData.glow || null,
    dispose() {
      for (const x of disposables) x.dispose && x.dispose();
    },
  };
}

function buildRim(style, r, teamColor, baseColor, T) {
  const g = new THREE.Group();
  const metal = T(new THREE.MeshStandardMaterial({ color: 0xc9d2de, roughness: 0.25, metalness: 0.9 }));
  const dark = T(new THREE.MeshStandardMaterial({ color: 0x2a2f38, roughness: 0.5, metalness: 0.6 }));
  const disc = (rad, mat) => {
    const geo = T(new THREE.CylinderGeometry(rad, rad, 0.04, 20));
    geo.rotateZ(Math.PI / 2);
    return new THREE.Mesh(geo, mat);
  };
  switch (style) {
    case 'whl_spoke': {
      g.add(disc(r * 0.35, metal));
      for (let i = 0; i < 8; i++) {
        const s = new THREE.Mesh(T(new THREE.BoxGeometry(0.04, r * 1.3, 0.06)), metal);
        s.rotation.x = (i / 8) * Math.PI;
        g.add(s);
      }
      break;
    }
    case 'whl_star': {
      const geo = T(new THREE.ExtrudeGeometry(starShape(r * 0.72, r * 0.3), { depth: 0.05, bevelEnabled: false }));
      geo.rotateY(Math.PI / 2);
      g.add(new THREE.Mesh(geo, metal));
      break;
    }
    case 'whl_turbine': {
      g.add(disc(r * 0.72, dark));
      for (let i = 0; i < 7; i++) {
        const b = new THREE.Mesh(T(new THREE.BoxGeometry(0.06, r * 0.62, 0.16)), metal);
        const a = (i / 7) * Math.PI * 2;
        b.position.set(0.02, Math.cos(a) * r * 0.36, Math.sin(a) * r * 0.36);
        b.rotation.x = -a;
        b.rotation.y = 0.5;
        g.add(b);
      }
      break;
    }
    case 'whl_neon': {
      g.add(disc(r * 0.72, dark));
      const ring = new THREE.Mesh(T(new THREE.TorusGeometry(r * 0.6, 0.05, 6, 24)), T(new THREE.MeshBasicMaterial({ color: teamColor })));
      ring.rotation.y = Math.PI / 2;
      g.add(ring);
      break;
    }
    case 'whl_plasma': {
      g.add(disc(r * 0.72, dark));
      const glowMat = T(new THREE.MeshBasicMaterial({ color: baseColor.clone().lerp(new THREE.Color(0xffffff), 0.3) }));
      const ring = new THREE.Mesh(T(new THREE.TorusGeometry(r * 0.62, 0.08, 8, 28)), glowMat);
      ring.rotation.y = Math.PI / 2;
      g.add(ring);
      const core = disc(r * 0.22, glowMat);
      g.add(core);
      g.userData.glow = glowMat;
      break;
    }
    default:
      g.add(disc(r * 0.68, metal));
      g.add(disc(r * 0.25, dark));
  }
  return g;
}

function buildTopper(style, teamColor, T) {
  const gold = T(new THREE.MeshStandardMaterial({ color: 0xffc23a, roughness: 0.25, metalness: 1, emissive: 0x3a2400 }));
  const team = T(new THREE.MeshBasicMaterial({ color: teamColor }));
  switch (style) {
    case 'ant_flag': {
      const f = new THREE.Mesh(T(new THREE.PlaneGeometry(0.6, 0.38)), T(new THREE.MeshBasicMaterial({ color: teamColor, side: THREE.DoubleSide })));
      f.position.set(0, -0.1, -0.3);
      f.rotation.y = Math.PI / 2;
      const g = new THREE.Group();
      g.add(f);
      return g;
    }
    case 'ant_star': {
      const geo = T(new THREE.ExtrudeGeometry(starShape(0.28, 0.12), { depth: 0.08, bevelEnabled: false }));
      geo.center();
      return new THREE.Mesh(geo, gold);
    }
    case 'ant_bolt': {
      const s = new THREE.Shape();
      s.moveTo(-0.08, 0.3); s.lineTo(0.14, 0.3); s.lineTo(0.02, 0.05); s.lineTo(0.16, 0.05); s.lineTo(-0.12, -0.32); s.lineTo(-0.02, -0.04); s.lineTo(-0.16, -0.04); s.closePath();
      const geo = T(new THREE.ExtrudeGeometry(s, { depth: 0.07, bevelEnabled: false }));
      geo.center();
      return new THREE.Mesh(geo, T(new THREE.MeshBasicMaterial({ color: 0xffe14d })));
    }
    case 'ant_cube':
      return new THREE.Mesh(T(new THREE.BoxGeometry(0.32, 0.32, 0.32)), team);
    case 'ant_crown': {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(T(new THREE.CylinderGeometry(0.2, 0.22, 0.14, 12)), gold));
      for (let i = 0; i < 5; i++) {
        const sp = new THREE.Mesh(T(new THREE.ConeGeometry(0.05, 0.2, 4)), gold);
        const a = (i / 5) * Math.PI * 2;
        sp.position.set(Math.cos(a) * 0.18, 0.15, Math.sin(a) * 0.18);
        g.add(sp);
      }
      return g;
    }
    default:
      return new THREE.Mesh(T(new THREE.SphereGeometry(0.16, 12, 8)), team);
  }
}
