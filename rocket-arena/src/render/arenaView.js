import * as THREE from 'three';
import { ARENA, createBoostPads } from '../sim/arena.js';
import {
  makeFloorTexture, makeHexTexture, makeNetTexture, makePanelTexture, makeCrowdTexture, makeScreenTexture,
} from './textures.js';

const { W, L, H, RC, RV, GW, GH, GD } = ARENA;
const BLUE = new THREE.Color(0x2f7bff);
const ORANGE = new THREE.Color(0xff8a1f);
const WHITE = new THREE.Color(0xffffff);

// Collects triangles and fixes their winding so faces point along the given normals.
class Builder {
  constructor() {
    this.pos = [];
    this.nor = [];
    this.uv = [];
    this.col = [];
    this.idx = [];
    this.groups = [];
    this.cur = null;
  }

  vertex(p, n, u, v, c = WHITE) {
    this.pos.push(p.x, p.y, p.z);
    this.nor.push(n.x, n.y, n.z);
    this.uv.push(u, v);
    this.col.push(c.r, c.g, c.b);
    return this.pos.length / 3 - 1;
  }

  group(mat) {
    if (this.cur && this.cur.mat === mat) return;
    this.cur = { start: this.idx.length, count: 0, mat };
    this.groups.push(this.cur);
  }

  tri(a, b, c) {
    const P = this.pos;
    const ax = P[a * 3]; const ay = P[a * 3 + 1]; const az = P[a * 3 + 2];
    const e1x = P[b * 3] - ax; const e1y = P[b * 3 + 1] - ay; const e1z = P[b * 3 + 2] - az;
    const e2x = P[c * 3] - ax; const e2y = P[c * 3 + 1] - ay; const e2z = P[c * 3 + 2] - az;
    const nx = e1y * e2z - e1z * e2y;
    const ny = e1z * e2x - e1x * e2z;
    const nz = e1x * e2y - e1y * e2x;
    const N = this.nor;
    const d = nx * (N[a * 3] + N[b * 3] + N[c * 3]) + ny * (N[a * 3 + 1] + N[b * 3 + 1] + N[c * 3 + 1])
      + nz * (N[a * 3 + 2] + N[b * 3 + 2] + N[c * 3 + 2]);
    if (d >= 0) this.idx.push(a, b, c); else this.idx.push(a, c, b);
    this.cur.count += 3;
  }

  quad(a, b, c, d) {
    this.tri(a, b, c);
    this.tri(a, c, d);
  }

  build() {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3));
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3));
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2));
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3));
    g.setIndex(this.idx);
    return g;
  }
}

function teamTint(z, strength = 1) {
  const t = THREE.MathUtils.smoothstep(z, -12, 12);
  const c = BLUE.clone().lerp(ORANGE, t);
  return WHITE.clone().lerp(c, strength);
}

function perimeter() {
  const a = W - RV;
  const b = L - RV;
  const rc = RC - RV;
  const pts = [];
  const push = (x, z, nx, nz, back) => pts.push({ x, z, nx, nz, back });
  const straight = (x0, z0, x1, z1, nx, nz, back, breaks = []) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const n = Math.ceil(len / 2.5);
    const ts = new Set();
    for (let i = 0; i < n; i++) ts.add(i / n);
    for (const bx of breaks) ts.add((bx - x0) / (x1 - x0));
    [...ts].sort((p, q) => p - q).forEach((t) => push(x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, nx, nz, back));
  };
  const arc = (cx, cz, a0, a1) => {
    const n = 12;
    for (let i = 0; i < n; i++) {
      const ang = a0 + ((a1 - a0) * i) / n;
      push(cx + Math.cos(ang) * rc, cz + Math.sin(ang) * rc, Math.cos(ang), Math.sin(ang), 0);
    }
  };
  straight(a, -(b - rc), a, b - rc, 1, 0, 0);
  arc(a - rc, b - rc, 0, Math.PI / 2);
  straight(a - rc, b, -(a - rc), b, 0, 1, 1, [GW, -GW]);
  arc(-(a - rc), b - rc, Math.PI / 2, Math.PI);
  straight(-a, b - rc, -a, -(b - rc), -1, 0, 0);
  arc(-(a - rc), -(b - rc), Math.PI, Math.PI * 1.5);
  straight(-(a - rc), -b, a - rc, -b, 0, -1, -1, [-GW, GW]);
  arc(a - rc, -(b - rc), Math.PI * 1.5, Math.PI * 2);
  pts.push({ ...pts[0] });
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    if (i > 0) s += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
    pts[i].s = s;
  }
  return pts;
}

function profile() {
  const rows = [];
  const NB = 10;
  for (let k = 0; k <= NB; k++) {
    const t = (k / NB) * Math.PI / 2;
    rows.push({ o: RV * Math.sin(t), y: RV * (1 - Math.cos(t)), no: -Math.sin(t), ny: Math.cos(t) });
  }
  for (const y of [4.1, 4.5, GH, 9, 12, 15, H - RV]) rows.push({ o: RV, y, no: -1, ny: 0 });
  const NT = 8;
  for (let k = 1; k <= NT; k++) {
    const t = (k / NT) * Math.PI / 2;
    rows.push({ o: RV * Math.cos(t), y: H - RV + RV * Math.sin(t), no: -Math.cos(t), ny: -Math.sin(t) });
  }
  let v = 0;
  for (let i = 0; i < rows.length; i++) {
    if (i > 0) v += Math.hypot(rows[i].o - rows[i - 1].o, rows[i].y - rows[i - 1].y);
    rows[i].v = v;
  }
  return rows;
}

function roundedRectShape(a, b, r) {
  const s = new THREE.Shape();
  s.moveTo(-a + r, -b);
  s.lineTo(a - r, -b);
  s.absarc(a - r, -b + r, r, -Math.PI / 2, 0, false);
  s.lineTo(a, b - r);
  s.absarc(a - r, b - r, r, 0, Math.PI / 2, false);
  s.lineTo(-a + r, b);
  s.absarc(-a + r, b - r, r, Math.PI / 2, Math.PI, false);
  s.lineTo(-a, -b + r);
  s.absarc(-a + r, -b + r, r, Math.PI, Math.PI * 1.5, false);
  return s;
}

export function buildArena(theme, quality) {
  const group = new THREE.Group();
  const hexTex = makeHexTexture();

  const mats = {
    ramp: new THREE.MeshStandardMaterial({
      color: 0xffffff, vertexColors: true, roughness: 0.55, metalness: 0.35, map: makePanelTexture(),
    }),
    stripe: new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false }),
    glass: new THREE.MeshStandardMaterial({
      color: 0x8fb8ff, vertexColors: true, transparent: true, opacity: theme.glassOpacity, roughness: 0.1, metalness: 0.6,
      depthWrite: false, side: THREE.DoubleSide,
    }),
  };
  mats.ramp.map.repeat.set(1 / 4, 1 / 4);
  mats.ramp.map.wrapS = mats.ramp.map.wrapT = THREE.RepeatWrapping;

  const per = perimeter();
  const rows = profile();
  const b = new Builder();
  const grid = [];
  const P = new THREE.Vector3();
  const N = new THREE.Vector3();
  for (let i = 0; i < per.length; i++) {
    const p = per[i];
    const col = [];
    for (let j = 0; j < rows.length; j++) {
      const r = rows[j];
      P.set(p.x + p.nx * r.o, r.y, p.z + p.nz * r.o);
      N.set(p.nx * r.no, r.ny, p.nz * r.no);
      let c;
      if (r.y > 4.05 && r.y < 4.55) c = teamTint(P.z, 1).multiplyScalar(1.6);
      else if (r.y <= 4.1) c = teamTint(P.z, 0.35);
      else c = teamTint(P.z, 0.8);
      col.push(b.vertex(P, N, p.s / 4, r.v / 4, c));
    }
    grid.push(col);
  }
  const inMouth = (i) => per[i].back !== 0 && Math.abs(per[i].x) <= GW + 1e-6;
  const bands = [
    { mat: 0, test: (r0, r1) => r1.y <= 4.1 + 1e-6 },
    { mat: 1, test: (r0, r1) => r0.y >= 4.1 - 1e-6 && r1.y <= 4.5 + 1e-6 },
    { mat: 2, test: (r0) => r0.y >= 4.5 - 1e-6 },
  ];
  for (const band of bands) {
    b.group(band.mat);
    for (let i = 0; i < per.length - 1; i++) {
      const mouth = inMouth(i) && inMouth(i + 1) && per[i].back === per[i + 1].back;
      for (let j = 0; j < rows.length - 1; j++) {
        if (!band.test(rows[j], rows[j + 1])) continue;
        if (mouth && rows[j + 1].y <= GH + 1e-6) continue;
        b.quad(grid[i][j], grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]);
      }
    }
  }
  // Solid caps under the ramp beside each goal mouth.
  b.group(0);
  for (const zs of [1, -1]) {
    for (const xs of [1, -1]) {
      N.set(-xs, 0, 0);
      const corner = b.vertex(P.set(xs * GW, 0, zs * L), N, 0, 0, teamTint(zs * L, 0.35));
      const arcIdx = [];
      for (let k = 0; k <= 10; k++) {
        const t = (k / 10) * Math.PI / 2;
        arcIdx.push(b.vertex(P.set(xs * GW, RV * (1 - Math.cos(t)), zs * (L - RV + RV * Math.sin(t))), N, 0, 0, teamTint(zs * L, 0.35)));
      }
      for (let k = 0; k < 10; k++) b.tri(corner, arcIdx[k], arcIdx[k + 1]);
    }
  }
  const wallGeo = b.build();
  for (const g of b.groups) wallGeo.addGroup(g.start, g.count, g.mat);
  const walls = new THREE.Mesh(wallGeo, [mats.ramp, mats.stripe, mats.glass]);
  walls.receiveShadow = quality.shadows;
  group.add(walls);

  // Additive hex lines over the glass.
  const hexGeo = wallGeo.clone();
  hexGeo.clearGroups();
  const glassGroup = b.groups.filter((g) => g.mat === 2);
  for (const g of glassGroup) hexGeo.addGroup(g.start, g.count, 0);
  const uv = hexGeo.getAttribute('uv');
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.5, uv.getY(i) * 0.5);
  const hexMat = new THREE.MeshBasicMaterial({
    map: hexTex, vertexColors: true, transparent: true, opacity: theme.hexOpacity, blending: THREE.AdditiveBlending,
    depthWrite: false, side: THREE.DoubleSide, toneMapped: false,
  });
  group.add(new THREE.Mesh(hexGeo, [hexMat]));

  // Floor.
  const floorTex = makeFloorTexture(theme);
  const floorShape = roundedRectShape(W - RV, L - RV, RC - RV);
  const floorGeo = new THREE.ShapeGeometry(floorShape, 24);
  floorGeo.rotateX(-Math.PI / 2);
  const fp = floorGeo.getAttribute('position');
  const fuv = floorGeo.getAttribute('uv');
  for (let i = 0; i < fp.count; i++) fuv.setXY(i, (fp.getX(i) + W) / (2 * W), (fp.getZ(i) + L) / (2 * L));
  floorGeo.computeVertexNormals();
  const floorMat = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.85, metalness: 0.0 });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.receiveShadow = quality.shadows;
  group.add(floor);

  // Goals: floor, dark shell, net and glowing frame.
  const netTex = makeNetTexture();
  for (const team of [0, 1]) {
    const zs = team === 0 ? -1 : 1;
    const color = team === 0 ? BLUE : ORANGE;
    const g = new THREE.Group();
    const gf = new THREE.Mesh(new THREE.PlaneGeometry(GW * 2, RV + GD), new THREE.MeshStandardMaterial({ color: 0x1a1d24, roughness: 0.9 }));
    gf.rotation.x = -Math.PI / 2;
    gf.position.set(0, 0.002, zs * (L - RV + (RV + GD) / 2));
    gf.receiveShadow = quality.shadows;
    g.add(gf);
    const shellMat = new THREE.MeshStandardMaterial({ color: color.clone().multiplyScalar(0.12), roughness: 0.8, side: THREE.DoubleSide });
    const netMat = new THREE.MeshBasicMaterial({
      map: netTex, color, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false,
      side: THREE.DoubleSide, toneMapped: false,
    });
    const addPanel = (w, h, pos, rotY, rotX, repU, repV) => {
      const geo = new THREE.PlaneGeometry(w, h);
      const shell = new THREE.Mesh(geo, shellMat);
      shell.position.copy(pos);
      shell.rotation.set(rotX, rotY, 0);
      g.add(shell);
      const t = netTex.clone();
      t.repeat.set(repU, repV);
      t.needsUpdate = true;
      const net = new THREE.Mesh(geo, netMat.clone());
      net.material.map = t;
      net.position.copy(pos).multiplyScalar(1);
      net.rotation.copy(shell.rotation);
      net.translateZ(0.06);
      g.add(net);
    };
    addPanel(GW * 2, GH, new THREE.Vector3(0, GH / 2, zs * (L + GD)), zs > 0 ? Math.PI : 0, 0, GW * 2 / 1.6, GH / 1.6);
    addPanel(GD, GH, new THREE.Vector3(GW, GH / 2, zs * (L + GD / 2)), -Math.PI / 2, 0, GD / 1.6, GH / 1.6);
    addPanel(GD, GH, new THREE.Vector3(-GW, GH / 2, zs * (L + GD / 2)), Math.PI / 2, 0, GD / 1.6, GH / 1.6);
    const roof = new THREE.Mesh(new THREE.PlaneGeometry(GW * 2, GD), shellMat);
    roof.rotation.x = Math.PI / 2;
    roof.position.set(0, GH, zs * (L + GD / 2));
    g.add(roof);
    const frameMat = new THREE.MeshBasicMaterial({ color: color.clone().multiplyScalar(2.2), toneMapped: false });
    const t = 0.22;
    const post1 = new THREE.Mesh(new THREE.BoxGeometry(t, GH + t, t), frameMat);
    post1.position.set(GW + t / 2, GH / 2, zs * (L - 0.05));
    const post2 = post1.clone();
    post2.position.x = -GW - t / 2;
    const bar = new THREE.Mesh(new THREE.BoxGeometry(GW * 2 + t * 2, t, t), frameMat);
    bar.position.set(0, GH + t / 2, zs * (L - 0.05));
    g.add(post1, post2, bar);
    // Goal line glow.
    const line = new THREE.Mesh(new THREE.PlaneGeometry(GW * 2, 0.35), frameMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(0, 0.01, zs * (L + 0.9));
    g.add(line);
    group.add(g);
  }

  const stadium = buildStadium(theme);
  group.add(stadium);

  const pads = buildPads();
  group.add(pads.group);
  return { group, updatePads: pads.update };
}

function buildPads() {
  const group = new THREE.Group();
  const list = createBoostPads();
  const views = [];
  const smallGeo = new THREE.CylinderGeometry(0.62, 0.72, 0.08, 24);
  const bigBaseGeo = new THREE.CylinderGeometry(1.25, 1.45, 0.12, 32);
  const orbGeo = new THREE.IcosahedronGeometry(0.5, 2);
  const ringGeo = new THREE.TorusGeometry(1.1, 0.06, 8, 40);
  for (const p of list) {
    const on = new THREE.MeshBasicMaterial({ color: new THREE.Color(0xffb52e).multiplyScalar(p.big ? 2.2 : 1.6), toneMapped: false });
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x33302a, roughness: 0.5, metalness: 0.6, emissive: 0xffa11a, emissiveIntensity: 0.5 });
    const v = { pad: null, base: null, orb: null, ring: null, on, baseMat, phase: Math.random() * 6 };
    if (p.big) {
      v.base = new THREE.Mesh(bigBaseGeo, baseMat);
      v.base.position.set(p.pos.x, 0.06, p.pos.z);
      v.orb = new THREE.Mesh(orbGeo, on);
      v.orb.position.set(p.pos.x, 1.0, p.pos.z);
      v.ring = new THREE.Mesh(ringGeo, on);
      v.ring.rotation.x = Math.PI / 2;
      v.ring.position.set(p.pos.x, 0.18, p.pos.z);
      group.add(v.base, v.orb, v.ring);
    } else {
      v.base = new THREE.Mesh(smallGeo, on);
      v.base.position.set(p.pos.x, 0.04, p.pos.z);
      group.add(v.base);
    }
    views.push(v);
  }
  const off = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.7 });
  let t = 0;
  function update(dt, pads) {
    t += dt;
    pads.forEach((p, i) => {
      const v = views[i];
      if (p.big) {
        v.orb.visible = p.active;
        v.ring.visible = p.active;
        v.orb.position.y = 1.0 + Math.sin(t * 2 + v.phase) * 0.15;
        v.orb.rotation.y += dt * 1.5;
        v.baseMat.emissiveIntensity = p.active ? 0.6 : 0.05;
      } else {
        v.base.material = p.active ? v.on : off;
      }
    });
  }
  return { group, update };
}

function buildStadium(theme) {
  const g = new THREE.Group();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ color: theme.outside, roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.05;
  g.add(ground);

  const crowd = makeCrowdTexture();
  const standMat = new THREE.MeshStandardMaterial({ map: crowd, roughness: 0.9, color: theme.crowdTint });
  const concrete = new THREE.MeshStandardMaterial({ color: theme.structure, roughness: 0.8, metalness: 0.2 });
  // Stands: sloped blocks around the pitch.
  const makeStand = (length, depth, height) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(depth, height);
    shape.lineTo(depth + 3, height);
    shape.lineTo(depth + 3, 0);
    shape.closePath();
    const geo = new THREE.ExtrudeGeometry(shape, { depth: length, bevelEnabled: false });
    geo.translate(0, 0, -length / 2);
    const uvs = geo.getAttribute('uv');
    const pos = geo.getAttribute('position');
    for (let i = 0; i < uvs.count; i++) uvs.setXY(i, pos.getZ(i) / 20, (pos.getX(i) + pos.getY(i)) / 14);
    const mesh = new THREE.Mesh(geo, [concrete, standMat]);
    return mesh;
  };
  const sideLen = L * 2 + 10;
  for (const s of [1, -1]) {
    const stand = makeStand(sideLen, 26, 24);
    stand.rotation.y = s > 0 ? 0 : Math.PI;
    stand.position.set(s * (W + 6), 2, 0);
    g.add(stand);
    const end = makeStand(W * 2 + 6, 22, 20);
    end.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2;
    end.position.set(0, 2, s * (L + GD + 8));
    g.add(end);
  }
  // Concrete apron between the arena walls and the stands.
  for (const s of [1, -1]) {
    const side = new THREE.Mesh(new THREE.BoxGeometry(8, 2.2, L * 2 + GD * 2 + 20), concrete);
    side.position.set(s * (W + 3.5), 1.1, 0);
    const end = new THREE.Mesh(new THREE.BoxGeometry(W * 2 + 15, 2.2, 10), concrete);
    end.position.set(0, 1.1, s * (L + GD + 4.5));
    g.add(side, end);
  }

  // Light towers.
  const lampMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(theme.lamp).multiplyScalar(2.5), toneMapped: false });
  for (const x of [-1, 1]) for (const z of [-1, 1]) {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 46, 8), concrete);
    pole.position.set(x * (W + 38), 23, z * (L + 30));
    const head = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 1.5), lampMat);
    head.position.set(x * (W + 36), 47, z * (L + 28));
    head.lookAt(0, 0, 0);
    g.add(pole, head);
  }
  // Giant screens behind the goals.
  for (const team of [0, 1]) {
    const zs = team === 0 ? -1 : 1;
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), new THREE.MeshBasicMaterial({ map: makeScreenTexture(team), toneMapped: false }));
    scr.position.set(0, 34, zs * (L + 36));
    scr.rotation.y = zs > 0 ? Math.PI : 0;
    g.add(scr);
    const frame = new THREE.Mesh(new THREE.BoxGeometry(31, 15, 1), concrete);
    frame.position.set(0, 34, zs * (L + 36.6));
    g.add(frame);
  }
  // Roof ring with light strips.
  const ringMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(theme.rim).multiplyScalar(1.5), toneMapped: false });
  for (const s of [1, -1]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, L * 2 + 20), ringMat);
    strip.position.set(s * (W + 33), 28, 0);
    g.add(strip);
    const strip2 = new THREE.Mesh(new THREE.BoxGeometry(W * 2 + 20, 0.6, 0.6), ringMat);
    strip2.position.set(0, 24, s * (L + GD + 32));
    g.add(strip2);
  }
  return g;
}

export function buildSky(theme) {
  const geo = new THREE.SphereGeometry(1200, 32, 16);
  const mat = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    uniforms: {
      top: { value: new THREE.Color(theme.skyTop) },
      horizon: { value: new THREE.Color(theme.skyHorizon) },
      bottom: { value: new THREE.Color(theme.skyBottom) },
      sunDir: { value: new THREE.Vector3(...theme.sunDir).normalize() },
      sunColor: { value: new THREE.Color(theme.sunGlow) },
    },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; uniform vec3 sunDir; uniform vec3 sunColor; varying vec3 vDir;
      void main(){ float h = vDir.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.55)) : mix(horizon, bottom, pow(-h, 0.4));
      float s = max(dot(normalize(vDir), sunDir), 0.0); c += sunColor * (pow(s, 600.0) * 4.0 + pow(s, 12.0) * 0.35);
      gl_FragColor = vec4(c, 1.0); }`,
  });
  const sky = new THREE.Mesh(geo, mat);
  sky.renderOrder = -10;
  const g = new THREE.Group();
  g.add(sky);
  if (theme.stars) {
    const n = 1500;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * 0.9 + 0.08;
      const r = 1100;
      pos[i * 3] = Math.cos(u) * Math.sqrt(1 - v * v) * r;
      pos[i * 3 + 1] = v * r;
      pos[i * 3 + 2] = Math.sin(u) * Math.sqrt(1 - v * v) * r;
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false })));
  }
  return g;
}

export const THEMES = {
  day: {
    label: 'Stade (jour)', skyTop: 0x2f6fd0, skyHorizon: 0xbfe0ff, skyBottom: 0x4a5a6a, sunDir: [0.35, 0.8, 0.25], sunGlow: 0xfff3d0,
    sun: 0xfff4e0, sunIntensity: 1.9, hemiSky: 0xcfe6ff, hemiGround: 0x3a4a30, hemiIntensity: 0.6,
    grassA: '#2f7d32', grassB: '#3a8f3c', outside: 0x3b4a36, crowdTint: 0xffffff, structure: 0x9aa0aa, lamp: 0xffffff, rim: 0x9ecbff,
    glassOpacity: 0.07, hexOpacity: 0.35, fog: 0xbfd8f0, exposure: 1.0,
  },
  sunset: {
    label: 'Coucher de soleil', skyTop: 0x241a52, skyHorizon: 0xff8c4a, skyBottom: 0x2a1a2a, sunDir: [-0.6, 0.18, 0.5], sunGlow: 0xffb070,
    sun: 0xffc190, sunIntensity: 1.7, hemiSky: 0xffc9a0, hemiGround: 0x2a2440, hemiIntensity: 0.55,
    grassA: '#2c6e36', grassB: '#357d3d', outside: 0x2a2630, crowdTint: 0xffd8c0, structure: 0x5a5060, lamp: 0xffe0b0, rim: 0xff9d5c,
    glassOpacity: 0.08, hexOpacity: 0.45, fog: 0x7a4a50, exposure: 1.0,
  },
  night: {
    label: 'Nocturne', skyTop: 0x02040c, skyHorizon: 0x14224a, skyBottom: 0x05060a, sunDir: [0.2, 0.9, -0.3], sunGlow: 0x000000,
    sun: 0xdde8ff, sunIntensity: 1.6, hemiSky: 0x6a86c0, hemiGround: 0x101820, hemiIntensity: 0.45,
    grassA: '#1f5e2a', grassB: '#276b31', outside: 0x0d1016, crowdTint: 0xb0b8d0, structure: 0x30343f, lamp: 0xe8f0ff, rim: 0x6a9cff,
    glassOpacity: 0.1, hexOpacity: 0.6, fog: 0x0a1020, exposure: 1.05, stars: true,
  },
};
