import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { ARENA, TEAM } from '../core/Config.js';
import { THEMES } from './Themes.js';
import { FieldPainter } from './FieldPainter.js';
import { perimeter, rampProfile, wallProfile, sweep, band, rampCaps, ceilingGeometry } from './ArenaShell.js';
import {
  hexPanelTexture, ledTexture, rampTexture, netTexture, radialTexture, screenTexture, cloudTexture, windowsTexture,
} from './Textures.js';

const { halfWidth: HW, halfLength: HL, height: H, cornerRadius: RC, rampRadius: RV, goalHalfWidth: GW, goalHeight: GH, goalDepth: GD } = ARENA;

function skyMaterial(sky) {
  return new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: {
      top: { value: new THREE.Color(sky.top) },
      horizon: { value: new THREE.Color(sky.horizon) },
      bottom: { value: new THREE.Color(sky.bottom) },
    },
    vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `uniform vec3 top; uniform vec3 horizon; uniform vec3 bottom; varying vec3 vP;
      void main(){ float h = vP.y; vec3 c = h > 0.0 ? mix(horizon, top, pow(h, 0.55)) : mix(horizon, bottom, pow(-h, 0.4));
      gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  });
}

// Plane whose UVs are scaled to world size so one tiled texture fits every wall.
function tiledPlane(w, h, tile = 12) {
  const g = new THREE.PlaneGeometry(w, h);
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) * w) / tile, (uv.getY(i) * h) / tile);
  return g;
}

function placed(geo, x, y, z, ry = 0, rx = 0) {
  const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx, ry, 0, 'YXZ'));
  m.setPosition(x, y, z);
  return geo.applyMatrix4(m);
}

export class ArenaView {
  constructor(themeId, quality) {
    this.theme = THEMES[themeId] || THEMES.neon;
    this.quality = quality;
    this.group = new THREE.Group();
    this.group.name = 'arena';
    this.disposables = [];
    this.animated = [];
    this.time = 0;
    this.excite = 0;
    this.flashColor = new THREE.Color();
    this.flashAmount = 0;
    this.build();
  }

  track(o) {
    this.disposables.push(o);
    return o;
  }

  mat(m) {
    return this.track(m);
  }

  build() {
    const t = this.theme;
    const q = this.quality;
    const g = this.group;

    // Sky and outer ground
    const sky = new THREE.Mesh(this.track(new THREE.SphereGeometry(1400, 32, 16)), this.mat(skyMaterial(t.sky)));
    sky.renderOrder = -10;
    g.add(sky);
    if (t.props !== 'sky') {
      const ground = new THREE.Mesh(this.track(new THREE.CircleGeometry(1300, 48)), this.mat(new THREE.MeshLambertMaterial({ color: t.outer })));
      ground.rotation.x = -Math.PI / 2;
      ground.position.y = -0.3;
      g.add(ground);
    }

    // Lights
    this.hemi = new THREE.HemisphereLight(t.hemi[0], t.hemi[1], t.hemi[2]);
    g.add(this.hemi);
    this.baseHemi = t.hemi[2];
    const sun = new THREE.DirectionalLight(t.sun.color, t.sun.intensity);
    sun.position.set(...t.sun.pos);
    g.add(sun);
    this.sun = sun;
    if (q.shadows) {
      sun.position.normalize().multiplyScalar(160);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      const sc = sun.shadow.camera;
      sc.left = -110; sc.right = 110; sc.top = 110; sc.bottom = -110; sc.near = 20; sc.far = 400;
      sun.shadow.bias = -0.0004;
      sun.shadow.normalBias = 0.04;
      g.add(sun.target);
    }
    this.flashLight = new THREE.PointLight(0xffffff, 0, 90, 1.6);
    this.flashLight.position.set(0, 10, 0);
    g.add(this.flashLight);

    this.buildField();
    this.buildWalls();
    this.buildBoards();
    this.buildGoals();
    this.buildStands();
    this.buildRoof();
    this.buildScreens();
    this.buildProps();
    if (q.ambient > 0) this.buildAmbient();
    if (q.beams && t.beams) this.buildBeams();
  }

  buildField() {
    const t = this.theme;
    const q = this.quality;
    const f = t.field;
    const low = q.id === 'low';
    const { map, glow } = new FieldPainter(t, q.fieldTex, !low).paint().textures(q.anisotropy);
    this.track(map);
    let mat;
    if (low) {
      mat = new THREE.MeshLambertMaterial({ map });
    } else {
      this.track(glow);
      mat = new THREE.MeshStandardMaterial({
        map, emissiveMap: glow, emissive: new THREE.Color(f.glowColor), emissiveIntensity: f.glowIntensity,
        roughness: f.rough, metalness: f.metal, envMapIntensity: f.env ?? 0.15,
      });
    }
    this.fieldMat = this.mat(mat);
    const field = new THREE.Mesh(this.track(new THREE.PlaneGeometry(HW * 2, HL * 2)), mat);
    field.rotation.x = -Math.PI / 2;
    field.receiveShadow = true;
    this.group.add(field);
    // Floor outside the chamfers / under the walls
    const skirt = new THREE.Mesh(this.track(new THREE.PlaneGeometry(HW * 2 + 40, HL * 2 + 60)), this.mat(new THREE.MeshLambertMaterial({ color: new THREE.Color(t.outer).multiplyScalar(0.7) })));
    skirt.rotation.x = -Math.PI / 2;
    skirt.position.y = -0.05;
    this.group.add(skirt);
  }

  // Glass walls and ceiling, opaque curved ramps (drivable), goal openings, neon trims.
  buildWalls() {
    const t = this.theme;
    const pts = perimeter();
    this.perimeterPts = pts;
    const mouth = (i) => pts[i].mouth && pts[i + 1].mouth;
    const hex = this.track(hexPanelTexture());
    const glass = this.mat(new THREE.MeshBasicMaterial({
      map: hex, color: t.wall.color, transparent: true, opacity: t.wall.opacity, depthWrite: false, side: THREE.DoubleSide,
      blending: t.wall.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    }));
    // Walls + upper ramps (the first profile segment, below the crossbar, is open at the goals)
    const walls = new THREE.Mesh(this.track(sweep(pts, wallProfile(), { uvScale: 12, skip: (i, j) => j === 0 && mouth(i) })), glass);
    walls.renderOrder = 2;
    // Ceiling: same glass, a touch fainter so the sky stays readable
    const ceilMat = this.mat(glass.clone());
    ceilMat.opacity = t.wall.opacity * 0.7;
    const ceiling = new THREE.Mesh(this.track(ceilingGeometry()), ceilMat);
    ceiling.renderOrder = 2;
    this.group.add(walls, ceiling);

    // Lower ramps: solid, drivable, tiled like the pitch border
    const rampTex = this.track(rampTexture(t));
    const rampMat = this.mat(new THREE.MeshStandardMaterial({
      map: rampTex, roughness: t.field.rough ?? 0.6, metalness: t.field.metal ?? 0.1, envMapIntensity: t.field.env ?? 0.3, side: THREE.DoubleSide,
    }));
    const prof = rampProfile();
    const ramps = new THREE.Mesh(this.track(sweep(pts, prof, { uvScale: 6, skip: (i) => mouth(i) })), rampMat);
    ramps.receiveShadow = true;
    const caps = new THREE.Mesh(this.track(rampCaps(prof)), rampMat);
    this.group.add(ramps, caps);

    // Neon trims: where the floor meets the ramp, and along the top of the walls.
    const cyan = new THREE.Color(TEAM[0].color), mag = new THREE.Color(TEAM[1].color);
    const teamCol = (p) => (p.z < 0 ? cyan : mag);
    const trimMat = this.mat(new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, toneMapped: false }));
    const foot = band(pts, { d0: RV - 0.25, d1: RV + 0.25, y0: 0.05, y1: 0.05, colors: teamCol, skip: mouth });
    const top = band(pts, { d0: 0.06, d1: 0.06, y0: H - RV - 0.25, y1: H - RV + 0.25, colors: teamCol });
    const rim = band(pts, { d0: 0.06, d1: 0.06, y0: RV - 0.12, y1: RV + 0.12, colors: teamCol, skip: mouth });
    this.group.add(new THREE.Mesh(this.track(mergeGeometries([foot, top, rim])), trimMat));
    this.trimMats = [{ m: trimMat, base: new THREE.Color(0xffffff) }];

    // Structural columns outside the glass
    const frame = [];
    const fm = this.mat(new THREE.MeshLambertMaterial({ color: t.frame }));
    for (const sx of [-1, 1]) {
      for (const z of [-HL + RC, -HL / 3, HL / 3, HL - RC]) frame.push(placed(new THREE.BoxGeometry(1.2, H, 1.2), sx * (HW + 0.7), H / 2, z));
      for (const sz of [-1, 1]) for (const x of [GW + 1.5, HW - RC]) frame.push(placed(new THREE.BoxGeometry(1.2, H, 1.2), sx * x, H / 2, sz * (HL + 0.7)));
    }
    this.group.add(new THREE.Mesh(this.track(mergeGeometries(frame)), fm));
  }

  // LED boards on the walls just above the ramps (continuous text around the pitch).
  buildBoards() {
    const tex = this.track(ledTexture());
    this.ledTex = tex;
    const h = 2.2, y0 = RV + 0.35;
    const tile = (2048 / 72) * h;
    const pts = this.perimeterPts;
    const geo = band(pts, { d0: 0.08, d1: 0.08, y0, y1: y0 + h, uvScale: tile, skip: (i) => pts[i].mouth && pts[i + 1].mouth });
    this.boardMat = this.mat(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false, side: THREE.DoubleSide }));
    this.group.add(new THREE.Mesh(this.track(geo), this.boardMat));
  }

  buildGoals() {
    const net = this.track(netTexture());
    for (const team of [0, 1]) {
      const s = team === 0 ? -1 : 1;
      const col = TEAM[team].color;
      const goal = new THREE.Group();
      // Posts and crossbar glow in the defending team's colour
      const postMat = this.mat(new THREE.MeshBasicMaterial({ color: col }));
      const pg = [];
      for (const sx of [-1, 1]) pg.push(placed(new THREE.CylinderGeometry(0.45, 0.45, GH, 10), sx * GW, GH / 2, s * HL));
      const bar = new THREE.CylinderGeometry(0.45, 0.45, GW * 2 + 0.9, 10);
      bar.rotateZ(Math.PI / 2);
      bar.translate(0, GH, s * HL);
      pg.push(bar);
      goal.add(new THREE.Mesh(this.track(mergeGeometries(pg)), postMat));
      // Net box
      const nm = this.mat(new THREE.MeshBasicMaterial({ map: net, color: col, transparent: true, opacity: 0.45, depthWrite: false, side: THREE.DoubleSide }));
      const ng = [
        placed(tiledPlane(GW * 2, GH, 4), 0, GH / 2, s * (HL + GD)),
        placed(tiledPlane(GD, GH, 4), -GW, GH / 2, s * (HL + GD / 2), Math.PI / 2),
        placed(tiledPlane(GD, GH, 4), GW, GH / 2, s * (HL + GD / 2), Math.PI / 2),
        placed(tiledPlane(GW * 2, GD, 4), 0, GH, s * (HL + GD / 2), 0, Math.PI / 2),
      ];
      const nets = new THREE.Mesh(this.track(mergeGeometries(ng)), nm);
      nets.renderOrder = 3;
      goal.add(nets);
      // Goal floor and glowing goal line
      const gf = new THREE.Mesh(this.track(new THREE.PlaneGeometry(GW * 2, GD)), this.mat(new THREE.MeshLambertMaterial({ color: new THREE.Color(TEAM[team].dark) })));
      gf.rotation.x = -Math.PI / 2;
      gf.receiveShadow = true;
      gf.position.set(0, 0.02, s * (HL + GD / 2));
      goal.add(gf);
      const line = new THREE.Mesh(this.track(new THREE.PlaneGeometry(GW * 2, 0.8)), this.mat(new THREE.MeshBasicMaterial({ color: col })));
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.04, s * (HL + 0.4));
      goal.add(line);
      // Inner glow
      const glow = new THREE.Mesh(this.track(new THREE.PlaneGeometry(GW * 2, GH)), this.mat(new THREE.MeshBasicMaterial({
        color: col, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false,
      })));
      glow.position.set(0, GH / 2, s * (HL + GD - 0.3));
      goal.add(glow);
      this.group.add(goal);
    }
  }

  buildStands() {
    const t = this.theme;
    const rows = 10;
    const depth = 3.2, rise = 2.5, base = 3;
    const standGeos = [];
    const seats = [];
    const addStand = (cx, cz, len, ry, offset) => {
      for (let r = 0; r < rows; r++) {
        const y = base + r * rise;
        const d = offset + r * depth;
        const geo = new THREE.BoxGeometry(len + r * 2 * depth * 0.6, y, depth);
        const m = new THREE.Matrix4().makeRotationY(ry);
        const dir = new THREE.Vector3(0, 0, -1).applyMatrix4(m);
        m.setPosition(cx + dir.x * d, y / 2, cz + dir.z * d);
        standGeos.push(geo.applyMatrix4(m));
        const L = len + r * 2 * depth * 0.6;
        for (let k = -L / 2 + 0.8; k < L / 2 - 0.8; k += 1.25) {
          const along = new THREE.Vector3(1, 0, 0).applyMatrix4(new THREE.Matrix4().makeRotationY(ry));
          seats.push([cx + dir.x * d + along.x * k, y + 0.65, cz + dir.z * d + along.z * k, ry]);
        }
      }
    };
    addStand(HW + 3, 0, (HL - RC) * 2 + 6, -Math.PI / 2, 0);
    addStand(-HW - 3, 0, (HL - RC) * 2 + 6, Math.PI / 2, 0);
    addStand(0, HL + GD + 3, (HW - 4) * 2, Math.PI, 0);
    addStand(0, -HL - GD - 3, (HW - 4) * 2, 0, 0);
    const stands = new THREE.Mesh(this.track(mergeGeometries(standGeos)), this.mat(new THREE.MeshLambertMaterial({ color: t.stands })));
    this.group.add(stands);

    const budget = this.quality.crowd;
    if (budget <= 0) return;
    const keep = Math.min(1, budget / seats.length);
    const chosen = seats.filter(() => Math.random() < keep);
    const geo = this.track(new THREE.BoxGeometry(0.8, 1.2, 0.6));
    const mat = this.mat(new THREE.MeshLambertMaterial({ color: 0xffffff }));
    this.crowdUniforms = { uTime: { value: 0 }, uExcite: { value: 0 } };
    const U = this.crowdUniforms;
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = U.uTime;
      shader.uniforms.uExcite = U.uExcite;
      shader.vertexShader = 'uniform float uTime; uniform float uExcite;\n' + shader.vertexShader.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
        float ph = instanceMatrix[3].x * 0.37 + instanceMatrix[3].z * 0.23;
        transformed.y += abs(sin(uTime * (3.0 + uExcite * 7.0) + ph)) * (0.06 + uExcite * 0.9);`,
      );
    };
    const crowd = new THREE.InstancedMesh(geo, mat, chosen.length);
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    chosen.forEach(([x, y, z, ry], i) => {
      m.makeRotationY(ry);
      m.setPosition(x, y, z);
      crowd.setMatrixAt(i, m);
      c.setHex(t.crowd[Math.random() < 0.7 ? 0 : Math.floor(Math.random() * t.crowd.length)]).multiplyScalar(0.55 + Math.random() * 0.3);
      // Fans lean towards the team whose goal is at their end
      if (Math.abs(z) > HL) c.lerp(new THREE.Color(TEAM[z > 0 ? 1 : 0].color), 0.35);
      crowd.setColorAt(i, c);
    });
    crowd.instanceMatrix.needsUpdate = true;
    this.group.add(crowd);
  }

  buildRoof() {
    const t = this.theme;
    // Canopy ring with rows of floodlights over the stands
    const outerX = HW + 42, outerZ = HL + GD + 42;
    const shape = new THREE.Shape();
    shape.moveTo(-outerX, -outerZ); shape.lineTo(outerX, -outerZ); shape.lineTo(outerX, outerZ); shape.lineTo(-outerX, outerZ); shape.closePath();
    const hole = new THREE.Path();
    const ix = HW + 8, iz = HL + GD + 6;
    hole.moveTo(-ix, -iz); hole.lineTo(-ix, iz); hole.lineTo(ix, iz); hole.lineTo(ix, -iz); hole.closePath();
    shape.holes.push(hole);
    const roofGeo = new THREE.ShapeGeometry(shape);
    roofGeo.rotateX(Math.PI / 2);
    roofGeo.translate(0, 52, 0);
    const roof = new THREE.Mesh(this.track(roofGeo), this.mat(new THREE.MeshLambertMaterial({ color: t.standsTop, side: THREE.DoubleSide })));
    this.group.add(roof);
    const lights = [];
    for (const s of [-1, 1]) {
      for (let z = -HL + 6; z <= HL - 6; z += 8) lights.push(placed(new THREE.BoxGeometry(2.6, 0.5, 5), s * (HW + 10), 51.6, z));
      for (let x = -HW + 8; x <= HW - 8; x += 8) lights.push(placed(new THREE.BoxGeometry(5, 0.5, 2.6), x, 51.6, s * (HL + GD + 8)));
    }
    this.group.add(new THREE.Mesh(this.track(mergeGeometries(lights)), this.mat(new THREE.MeshBasicMaterial({ color: t.lightPanel }))));
    // Soft glow sprites under the light rows
    const glowTex = this.track(radialTexture(64, [[0, 'rgba(255,255,255,0.55)'], [1, 'rgba(255,255,255,0)']]));
    const sm = this.mat(new THREE.SpriteMaterial({ map: glowTex, color: t.lightPanel, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.6 }));
    for (const [x, z] of [[HW + 10, -40], [HW + 10, 0], [HW + 10, 40], [-HW - 10, -40], [-HW - 10, 0], [-HW - 10, 40], [0, HL + GD + 8], [0, -HL - GD - 8]]) {
      const sp = new THREE.Sprite(sm);
      sp.position.set(x, 50.5, z);
      sp.scale.setScalar(26);
      this.group.add(sp);
    }
    // Corner towers
    const towers = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) towers.push(placed(new THREE.BoxGeometry(4, 54, 4), sx * (HW + 36), 27, sz * (HL + GD + 36)));
    this.group.add(new THREE.Mesh(this.track(mergeGeometries(towers)), this.mat(new THREE.MeshLambertMaterial({ color: t.frame }))));
  }

  buildScreens() {
    this.screens = [];
    for (const s of [-1, 1]) {
      const { canvas, tex } = screenTexture();
      this.track(tex);
      const mesh = new THREE.Mesh(this.track(new THREE.PlaneGeometry(36, 11.25)), this.mat(new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })));
      mesh.position.set(0, 42, s * (HL + GD + 20));
      mesh.rotation.y = s > 0 ? Math.PI : 0;
      const back = new THREE.Mesh(this.track(new THREE.BoxGeometry(38, 13, 1)), this.mat(new THREE.MeshLambertMaterial({ color: 0x0b0d14 })));
      back.position.copy(mesh.position).add(new THREE.Vector3(0, 0, s * 0.6));
      back.rotation.y = mesh.rotation.y;
      this.group.add(back, mesh);
      this.screens.push({ canvas, tex });
    }
    this.setScoreboard([0, 0], '5:00', false);
  }

  setScoreboard(score, timeText, overtime, message = null) {
    for (const { canvas, tex } of this.screens) {
      const g = canvas.getContext('2d');
      const W = canvas.width, Hh = canvas.height;
      g.fillStyle = '#05070d';
      g.fillRect(0, 0, W, Hh);
      g.fillStyle = TEAM[0].css;
      g.fillRect(0, 0, 150, Hh);
      g.fillStyle = TEAM[1].css;
      g.fillRect(W - 150, 0, 150, Hh);
      g.fillStyle = '#05070d';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.font = '700 96px "Chakra Petch", sans-serif';
      g.fillText(String(score[0]), 75, Hh / 2 + 4);
      g.fillText(String(score[1]), W - 75, Hh / 2 + 4);
      g.fillStyle = message ? '#ffd23f' : '#ffffff';
      g.font = message ? '700 64px "Chakra Petch", sans-serif' : '700 78px "Chakra Petch", sans-serif';
      g.fillText(message || (overtime ? `+${timeText}` : timeText), W / 2, Hh / 2 + 2);
      tex.needsUpdate = true;
    }
  }

  buildProps() {
    const t = this.theme;
    if (t.props === 'dome') this.buildDome();
    else if (t.props === 'reactor') this.buildReactor();
    else this.buildSkyProps();
  }

  buildDome() {
    const dome = new THREE.SphereGeometry(190, 28, 10, 0, Math.PI * 2, 0, Math.PI / 2);
    const wire = new THREE.LineSegments(this.track(new THREE.WireframeGeometry(dome)), this.mat(new THREE.LineBasicMaterial({ color: 0x7a5cff, transparent: true, opacity: 0.35 })));
    dome.dispose();
    wire.position.y = -20;
    this.group.add(wire);
    // Skyline
    const tex = this.track(windowsTexture());
    const geos = [];
    for (let i = 0; i < 70; i++) {
      const a = (i / 70) * Math.PI * 2 + Math.random() * 0.05;
      const r = 260 + Math.random() * 140;
      const w = 14 + Math.random() * 20, h = 40 + Math.random() * 140;
      const geo = new THREE.BoxGeometry(w, h, w);
      const uv = geo.attributes.uv;
      for (let k = 0; k < uv.count; k++) uv.setXY(k, uv.getX(k) * w / 16, uv.getY(k) * h / 32);
      geos.push(placed(geo, Math.cos(a) * r, h / 2, Math.sin(a) * r));
    }
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    this.group.add(new THREE.Mesh(this.track(mergeGeometries(geos)), this.mat(new THREE.MeshBasicMaterial({ map: tex }))));
    // Stars
    const n = 600;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * Math.PI * 2, v = Math.random() * 0.9 + 0.08;
      pos[i * 3] = Math.cos(u) * Math.cos(v) * 1200;
      pos[i * 3 + 1] = Math.sin(v) * 1200;
      pos[i * 3 + 2] = Math.sin(u) * Math.cos(v) * 1200;
    }
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.group.add(new THREE.Points(this.track(sg), this.mat(new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, fog: false }))));
  }

  buildReactor() {
    // Dunes
    const dunes = new THREE.PlaneGeometry(2600, 2600, 80, 80);
    const p = dunes.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i), y = p.getY(i);
      const d = Math.hypot(x, y);
      const k = Math.max(0, Math.min(1, (d - 180) / 200));
      p.setZ(i, k * (Math.sin(x * 0.012) * 18 + Math.cos(y * 0.009 + x * 0.004) * 24 + 20));
    }
    dunes.computeVertexNormals();
    const dm = new THREE.Mesh(this.track(dunes), this.mat(new THREE.MeshLambertMaterial({ color: 0xc27a45, flatShading: true })));
    dm.rotation.x = -Math.PI / 2;
    dm.position.y = -0.5;
    this.group.add(dm);
    // Reactor towers with pulsing rings
    const towerMat = this.mat(new THREE.MeshLambertMaterial({ color: 0x4a3a3a }));
    this.reactorRings = [];
    const ringMat = this.mat(new THREE.MeshBasicMaterial({ color: 0x5ff2ff }));
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 4 + (i * Math.PI) / 2;
      const r = 300;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const tw = new THREE.Mesh(this.track(new THREE.CylinderGeometry(18, 30, 140, 16, 1, true)), towerMat);
      tw.position.set(x, 70, z);
      this.group.add(tw);
      for (let k = 0; k < 3; k++) {
        const ring = new THREE.Mesh(this.track(new THREE.TorusGeometry(22 - k * 1.5, 1.4, 6, 32)), ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(x, 60 + k * 26, z);
        this.group.add(ring);
      }
      const core = new THREE.Sprite(this.mat(new THREE.SpriteMaterial({ map: this.track(radialTexture(64)), color: 0x6ff6ff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })));
      core.position.set(x, 145, z);
      core.scale.setScalar(70);
      this.group.add(core);
      this.reactorRings.push(core);
    }
    this.reactorMat = ringMat;
    // Low sun
    const sun = new THREE.Sprite(this.mat(new THREE.SpriteMaterial({ map: this.track(radialTexture(128, [[0, 'rgba(255,245,220,1)'], [0.25, 'rgba(255,200,120,0.9)'], [1, 'rgba(255,140,60,0)']])), blending: THREE.AdditiveBlending, depthWrite: false, fog: false })));
    sun.position.set(-500, 120, 900);
    sun.scale.setScalar(420);
    this.group.add(sun);
  }

  buildSkyProps() {
    // Floating island under the stadium
    const island = new THREE.Mesh(this.track(new THREE.ConeGeometry(190, 160, 12, 3)), this.mat(new THREE.MeshLambertMaterial({ color: 0x6f6259, flatShading: true })));
    island.rotation.x = Math.PI;
    island.position.y = -82;
    this.group.add(island);
    const top = new THREE.Mesh(this.track(new THREE.CylinderGeometry(190, 190, 4, 12)), this.mat(new THREE.MeshLambertMaterial({ color: 0x5b9a4a, flatShading: true })));
    top.position.y = -2.2;
    this.group.add(top);
    // Clouds
    const ct = this.track(cloudTexture());
    const cm = this.mat(new THREE.SpriteMaterial({ map: ct, transparent: true, depthWrite: false, opacity: 0.9 }));
    this.clouds = [];
    for (let i = 0; i < 40; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 280 + Math.random() * 500;
      const sp = new THREE.Sprite(cm);
      sp.position.set(Math.cos(a) * r, -120 + Math.random() * 160, Math.sin(a) * r);
      sp.scale.setScalar(120 + Math.random() * 160);
      this.group.add(sp);
      this.clouds.push({ sp, a, r, speed: 0.004 + Math.random() * 0.006 });
    }
    // Flags around the roof
    const colors = ['#19e6ff', '#ff2f7d', '#ffd23f', '#ffffff', '#2ee5a0', '#9b4dff'];
    const flagGeo = this.track(new THREE.PlaneGeometry(6, 3.6));
    const poleGeo = this.track(new THREE.CylinderGeometry(0.2, 0.2, 10, 6));
    const poleMat = this.mat(new THREE.MeshLambertMaterial({ color: 0xdfe6ee }));
    this.flags = [];
    for (let i = 0; i < 16; i++) {
      const side = i % 4;
      const k = Math.floor(i / 4) / 3 - 0.5;
      const x = side === 0 ? HW + 38 : side === 1 ? -HW - 38 : k * 2 * HW;
      const z = side === 2 ? HL + GD + 38 : side === 3 ? -HL - GD - 38 : k * 2 * HL;
      const pole = new THREE.Mesh(poleGeo, poleMat);
      pole.position.set(x, 57, z);
      const c = document.createElement('canvas');
      c.width = 64; c.height = 40;
      const g = c.getContext('2d');
      g.fillStyle = colors[i % colors.length];
      g.fillRect(0, 0, 64, 40);
      g.fillStyle = colors[(i + 2) % colors.length];
      g.fillRect(0, 14, 64, 12);
      const tex = this.track(new THREE.CanvasTexture(c));
      tex.colorSpace = THREE.SRGBColorSpace;
      const flag = new THREE.Mesh(flagGeo, this.mat(new THREE.MeshLambertMaterial({ map: tex, side: THREE.DoubleSide })));
      flag.position.set(x + 3, 60, z);
      this.group.add(pole, flag);
      this.flags.push({ flag, ph: Math.random() * 6 });
    }
  }

  // Soft volumetric-looking cones under the roof floodlights.
  buildBeams() {
    const geo = this.track(new THREE.ConeGeometry(16, 50, 28, 1, true));
    geo.translate(0, -25, 0);
    const mat = this.mat(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
      uniforms: { uColor: { value: new THREE.Color(this.theme.beams) }, uTime: { value: 0 } },
      vertexShader: `varying float vH; varying vec3 vN; varying vec3 vV;
        void main(){ vH = -position.y / 50.0; vec4 mv = modelViewMatrix * vec4(position,1.0);
          vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }`,
      fragmentShader: `uniform vec3 uColor; varying float vH; varying vec3 vN; varying vec3 vV;
        void main(){ float edge = pow(abs(dot(vN, vV)), 1.5); float a = (1.0 - vH) * 0.075 * edge;
          gl_FragColor = vec4(uColor, a);
        #include <colorspace_fragment>
      }`,
    }));
    this.beamMat = mat;
    for (const [x, z] of [[HW + 10, -40], [HW + 10, 0], [HW + 10, 40], [-HW - 10, -40], [-HW - 10, 0], [-HW - 10, 40]]) {
      const cone = new THREE.Mesh(geo, mat);
      cone.position.set(x, 51.5, z);
      cone.rotation.z = -Math.sign(x) * 0.62;
      cone.renderOrder = 6;
      this.group.add(cone);
    }
  }

  buildAmbient() {
    const t = this.theme;
    const n = this.quality.ambient;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 220;
      pos[i * 3 + 1] = Math.random() * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 260;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.ambientUniforms = { uTime: { value: 0 }, uDrift: { value: new THREE.Vector3(...t.ambient.drift) }, uColor: { value: new THREE.Color(t.ambient.color) }, uSize: { value: t.ambient.size * 40 } };
    const mat = this.mat(new THREE.ShaderMaterial({
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: this.ambientUniforms,
      vertexShader: `uniform float uTime; uniform vec3 uDrift; uniform float uSize; varying float vA;
        void main(){ vec3 box = vec3(220.0, 60.0, 260.0);
          vec3 p = mod(position + uDrift * uTime + box * 0.5, box) - box * 0.5; p.y += 30.0;
          p.x += sin(uTime * 0.5 + position.z) * 1.5;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize / -mv.z; vA = 0.35 + 0.35 * sin(uTime * 2.0 + position.x); }`,
      fragmentShader: `uniform vec3 uColor; varying float vA;
        void main(){ vec2 c = gl_PointCoord - 0.5; float d = dot(c, c); if (d > 0.25) discard; gl_FragColor = vec4(uColor, vA * (1.0 - d * 4.0));
        #include <colorspace_fragment>
      }`,
    }));
    this.group.add(new THREE.Points(this.track(geo), mat));
  }

  // Reflection map made from this arena's own sky and floodlights (instead of a generic studio),
  // so glossy cars and floors pick up the right colours.
  buildEnvironment(renderer) {
    const t = this.theme;
    const scene = new THREE.Scene();
    const skyGeo = new THREE.SphereGeometry(100, 32, 16);
    const skyMat = skyMaterial(t.sky);
    scene.add(new THREE.Mesh(skyGeo, skyMat));
    const groundGeo = new THREE.PlaneGeometry(400, 400);
    groundGeo.rotateX(-Math.PI / 2);
    const groundMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(t.outer).multiplyScalar(0.6) });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -8;
    scene.add(ground);
    const panelGeo = new THREE.BoxGeometry(40, 1, 6);
    const panelMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(t.lightPanel).multiplyScalar(2.5) });
    for (const s of [-1, 1]) for (const z of [-40, 0, 40]) {
      const p = new THREE.Mesh(panelGeo, panelMat);
      p.position.set(s * 60, 45, z);
      p.rotation.z = s * 0.5;
      scene.add(p);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const rt = pmrem.fromScene(scene, 0.03);
    pmrem.dispose();
    for (const d of [skyGeo, skyMat, groundGeo, groundMat, panelGeo, panelMat]) d.dispose();
    this.envRT = rt;
    return rt.texture;
  }

  flash(team) {
    this.flashColor.setHex(TEAM[team].color);
    this.flashAmount = 1;
    this.excite = 1;
  }

  update(dt, ballPos) {
    this.time += dt;
    this.excite = Math.max(0, this.excite - dt * 0.25);
    if (this.crowdUniforms) {
      this.crowdUniforms.uTime.value = this.time;
      this.crowdUniforms.uExcite.value = this.excite;
    }
    if (this.ambientUniforms) this.ambientUniforms.uTime.value = this.time;
    if (this.flashAmount > 0) {
      this.flashAmount = Math.max(0, this.flashAmount - dt * 0.6);
      const f = this.flashAmount;
      this.hemi.intensity = this.baseHemi * (1 + f * 0.8);
      this.flashLight.color.copy(this.flashColor);
      this.flashLight.intensity = f * 900;
      for (const tm of this.trimMats) tm.m.color.copy(tm.base).lerp(this.flashColor, f * 0.8).multiplyScalar(1 + f);
    }
    if (ballPos) this.flashLight.position.set(ballPos.x, 12, ballPos.z);
    if (this.ledTex) {
      this.ledTex.offset.x = (this.ledTex.offset.x + dt * 0.06) % 1;
      this.boardMat.color.setRGB(1, 1, 1).lerp(this.flashColor, this.flashAmount * 0.85);
    }
    if (this.reactorMat) {
      const pulse = 0.6 + 0.4 * Math.sin(this.time * 2.2);
      this.reactorMat.color.setRGB(0.37 * pulse + 0.2, 0.95 * pulse, 1.0 * pulse);
      for (const r of this.reactorRings) r.material.opacity = 0.5 + 0.4 * pulse;
    }
    if (this.clouds) {
      for (const c of this.clouds) {
        c.a += c.speed * dt;
        c.sp.position.x = Math.cos(c.a) * c.r;
        c.sp.position.z = Math.sin(c.a) * c.r;
      }
    }
    if (this.flags) for (const f of this.flags) f.flag.rotation.y = Math.sin(this.time * 2 + f.ph) * 0.35;
  }

  // Ball-proximity excitement (crowd reacts to chances)
  setExcitement(v) {
    this.excite = Math.max(this.excite, v);
  }

  dispose() {
    this.envRT?.dispose();
    for (const d of this.disposables) d.dispose && d.dispose();
    this.disposables.length = 0;
  }
}
