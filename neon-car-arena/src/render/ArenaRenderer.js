import * as THREE from 'three';
import { ARENA, TEAM } from '../config/GameConfig.js';
import { ARENAS } from '../config/ArenaCatalog.js';
import { canvas, canvasTexture, gridTexture, hexPattern, radialTexture } from './Textures.js';

// Construit une arène complète (terrain, murs, buts, tribunes, écrans, décor) à partir
// de la même géométrie que la physique, pour que le visuel corresponde exactement aux collisions.
export class ArenaRenderer {
  constructor(scene, geometry, arenaId, quality) {
    this.scene = scene;
    this.geo = geometry;
    this.theme = ARENAS[arenaId] || ARENAS.neon_dome;
    this.q = quality;
    this.root = new THREE.Group();
    this.root.name = 'arena';
    this.animated = [];
    this.padViews = [];
    this.time = 0;
    scene.add(this.root);
    this.build();
  }

  build() {
    const t = this.theme;
    this.scene.background = new THREE.Color(t.sky[0]);
    this.scene.fog = new THREE.FogExp2(t.fog, t.fogDensity);
    this.buildLights();
    this.buildSky();
    this.buildFloor();
    this.buildShell();
    this.buildGoals();
    this.buildStands();
    this.buildScreens();
    this.buildDecor();
  }

  buildLights() {
    const t = this.theme;
    const hemi = new THREE.HemisphereLight(t.hemi[0], t.hemi[1], t.hemi[2]);
    const sun = new THREE.DirectionalLight(t.sun[0], t.sun[1]);
    sun.position.set(...t.sun[2]);
    this.root.add(hemi, sun);
  }

  buildSky() {
    const t = this.theme;
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, fog: false,
      uniforms: { c0: { value: new THREE.Color(t.sky[0]) }, c1: { value: new THREE.Color(t.sky[1]) }, c2: { value: new THREE.Color(t.sky[2]) } },
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: `uniform vec3 c0; uniform vec3 c1; uniform vec3 c2; varying vec3 vP;
        void main(){ float h = vP.y; vec3 col = h > 0.0 ? mix(c1, c0, smoothstep(0.0, 0.7, h)) : mix(c1, c2, smoothstep(0.0, -0.35, h));
        col = mix(col, c2, smoothstep(0.12, 0.0, abs(h)) * 0.8); gl_FragColor = vec4(col, 1.0); }`,
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 24, 16), mat);
    sky.renderOrder = -10;
    this.root.add(sky);
  }

  fieldTexture() {
    const t = this.theme;
    const low = this.q.level === 'low';
    const W = ARENA.W, LZ = ARENA.L + ARENA.GOAL_D;
    const cw = low ? 512 : 1024, ch = Math.round(cw * LZ / W);
    const c = canvas(cw, ch);
    const g = c.getContext('2d');
    const sx = cw / (2 * W), sz = ch / (2 * LZ);
    const X = (x) => (x + W) * sx, Z = (z) => (z + LZ) * sz;
    g.fillStyle = t.floorA;
    g.fillRect(0, 0, cw, ch);
    // Bandes transversales
    g.fillStyle = t.floorB;
    for (let z = -LZ; z < LZ; z += 26) g.fillRect(0, Z(z), cw, 13 * sz);
    // Teinte des deux camps
    const grad = g.createLinearGradient(0, 0, 0, ch);
    grad.addColorStop(0, hexA(TEAM[0].css, 0.16));
    grad.addColorStop(0.5, 'rgba(0,0,0,0)');
    grad.addColorStop(1, hexA(TEAM[1].css, 0.16));
    g.fillStyle = grad;
    g.fillRect(0, 0, cw, ch);
    // Motif hexagonal discret
    g.globalAlpha = 0.18;
    hexPattern(g, cw, ch, 7 * sx, t.line, 1);
    g.globalAlpha = 1;
    // Lignes
    g.strokeStyle = t.line;
    g.shadowColor = t.line;
    g.shadowBlur = low ? 0 : 8;
    g.lineWidth = 0.45 * sx;
    g.beginPath(); g.moveTo(X(-W), Z(0)); g.lineTo(X(W), Z(0)); g.stroke();
    g.beginPath(); g.arc(X(0), Z(0), 16 * sx, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(X(0), Z(0), 1.2 * sx, 0, Math.PI * 2); g.fillStyle = t.line; g.fill();
    for (const s of [-1, 1]) {
      const gz = s * ARENA.L;
      g.strokeStyle = s < 0 ? TEAM[0].css : TEAM[1].css;
      g.shadowColor = g.strokeStyle;
      g.lineWidth = 0.7 * sx;
      g.beginPath(); g.moveTo(X(-ARENA.GOAL_W), Z(gz)); g.lineTo(X(ARENA.GOAL_W), Z(gz)); g.stroke();
      g.lineWidth = 0.4 * sx;
      g.strokeRect(X(-ARENA.GOAL_W - 10), Z(Math.min(gz, gz - s * 24)), (2 * ARENA.GOAL_W + 20) * sx, 24 * sz);
      // Chevrons (flèches vers le but adverse) – motif original de l'arène
      g.globalAlpha = 0.2;
      g.lineWidth = 2.2 * sx;
      for (let k = 0; k < 3; k++) {
        const z0 = s * (30 + k * 12);
        g.beginPath();
        g.moveTo(X(-26), Z(z0 - s * 8)); g.lineTo(X(0), Z(z0)); g.lineTo(X(26), Z(z0 - s * 8));
        g.stroke();
      }
      g.globalAlpha = 1;
    }
    g.shadowBlur = 0;
    const tex = canvasTexture(c);
    tex.anisotropy = low ? 1 : 8;
    return tex;
  }

  buildFloor() {
    const R = ARENA.FLOOR_R;
    const pts = this.geo.outline(4, 6);
    const shape = new THREE.Shape(pts.map((p) => new THREE.Vector2(p.x - p.nx * R, -(p.z - p.nz * R))));
    const geos = [new THREE.ShapeGeometry(shape)];
    // Sol à l'intérieur des buts
    for (const s of [-1, 1]) {
      const g = new THREE.PlaneGeometry(ARENA.GOAL_W * 2, ARENA.GOAL_D + R + 0.1);
      g.translate(0, -s * (ARENA.L + ARENA.GOAL_D / 2 - R / 2), 0);
      geos.push(g);
    }
    const W = ARENA.W, LZ = ARENA.L + ARENA.GOAL_D;
    const mat = new THREE.MeshStandardMaterial({ map: this.fieldTexture(), roughness: 0.55, metalness: 0.1 });
    for (const g of geos) {
      g.rotateX(-Math.PI / 2);
      const pos = g.attributes.position, uv = g.attributes.uv;
      for (let i = 0; i < pos.count; i++) uv.setXY(i, (pos.getX(i) + W) / (2 * W), 1 - (pos.getZ(i) + LZ) / (2 * LZ));
      const m = new THREE.Mesh(g, mat);
      this.root.add(m);
    }
  }

  // Coque (quart de lune du sol, murs, arrondi du plafond) balayée le long du contour.
  buildShell() {
    const t = this.theme;
    const { FLOOR_R: FR, CEIL_R: CR, H, GOAL_W, GOAL_H, L } = ARENA;
    const outline = this.geo.outline(3, 5);
    outline.push(outline[0]);
    const lower = [], upper = [];
    const n = 7;
    for (let k = 0; k <= n; k++) { const a = (k / n) * Math.PI / 2; lower.push([FR - FR * Math.sin(a), FR - FR * Math.cos(a)]); }
    const lowerTop = FR + 2.5;
    lower.push([0, lowerTop]);
    upper.push([0, lowerTop]);
    for (const y of [GOAL_H, 22, 30, H - CR]) upper.push([0, y]);
    for (let k = 1; k <= n; k++) { const a = (k / n) * Math.PI / 2; upper.push([CR - CR * Math.cos(a), H - CR + CR * Math.sin(a)]); }

    const sweep = (profile) => {
      const pos = [], uv = [], idx = [];
      let dist = 0;
      outline.forEach((p, i) => {
        if (i > 0) dist += Math.hypot(p.x - outline[i - 1].x, p.z - outline[i - 1].z);
        for (const [inset, y] of profile) {
          pos.push(p.x - p.nx * inset, y, p.z - p.nz * inset);
          uv.push(dist / 8, y / 8);
        }
      });
      const m = profile.length;
      for (let i = 0; i < outline.length - 1; i++) {
        for (let j = 0; j < m - 1; j++) {
          const a = i * m + j, b = (i + 1) * m + j;
          // Ouverture des buts
          const cx = (pos[a * 3] + pos[b * 3]) / 2, cy = (pos[a * 3 + 1] + pos[a * 3 + 4]) / 2, cz = (pos[a * 3 + 2] + pos[b * 3 + 2]) / 2;
          if (Math.abs(cx) < GOAL_W && cy < GOAL_H && Math.abs(cz) > L - FR - 0.5) continue;
          idx.push(a, b, a + 1, b, b + 1, a + 1);
        }
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
      g.setIndex(idx);
      g.computeVertexNormals();
      return g;
    };

    const lowerMat = new THREE.MeshStandardMaterial({ color: t.lowerWall, roughness: 0.45, metalness: 0.3, side: THREE.DoubleSide });
    this.root.add(new THREE.Mesh(sweep(lower), lowerMat));
    const glass = new THREE.MeshBasicMaterial({
      map: gridTexture('#ffffff', 128, 4, 0.9), color: t.wall, transparent: true, opacity: 0.28,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const up = new THREE.Mesh(sweep(upper), glass);
    up.renderOrder = 2;
    this.root.add(up);

    // Liserés néon (bas des murs et plafond)
    const ribbon = (y, inset, h, color) => {
      const pos = [], idx = [];
      outline.forEach((p) => {
        pos.push(p.x - p.nx * inset, y, p.z - p.nz * inset, p.x - p.nx * inset, y + h, p.z - p.nz * inset);
      });
      for (let i = 0; i < outline.length - 1; i++) {
        const a = i * 2, b = a + 2;
        const cx = pos[a * 3], cz = pos[a * 3 + 2];
        if (Math.abs(cx) < GOAL_W && y < GOAL_H && Math.abs(cz) > L - 1) continue;
        idx.push(a, b, a + 1, b, b + 1, a + 1);
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
      g.setIndex(idx);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide, fog: false }));
      this.root.add(m);
    };
    ribbon(lowerTop - 0.35, 0.02, 0.35, t.wallGlow);
    ribbon(H - CR - 0.2, 0.02, 0.25, t.wall);

    // Plafond : grille légère
    const ceilShape = new THREE.Shape(outline.map((p) => new THREE.Vector2(p.x - p.nx * CR, -(p.z - p.nz * CR))));
    const cg = new THREE.ShapeGeometry(ceilShape);
    cg.rotateX(-Math.PI / 2);
    cg.translate(0, H, 0);
    const cuv = cg.attributes.uv, cpos = cg.attributes.position;
    for (let i = 0; i < cpos.count; i++) cuv.setXY(i, cpos.getX(i) / 12, cpos.getZ(i) / 12);
    const ceil = new THREE.Mesh(cg, new THREE.MeshBasicMaterial({
      map: gridTexture('#ffffff', 128, 2, 0.8), color: t.wall, transparent: true, opacity: 0.12,
      side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
    }));
    ceil.renderOrder = 2;
    this.root.add(ceil);
  }

  buildGoals() {
    const { GOAL_W: GW, GOAL_H: GH, GOAL_D: GD, L } = ARENA;
    for (const s of [-1, 1]) {
      const team = s < 0 ? TEAM[0] : TEAM[1];
      const grp = new THREE.Group();
      const net = new THREE.MeshBasicMaterial({
        map: gridTexture('#ffffff', 64, 3, 1), color: team.color, transparent: true, opacity: 0.45,
        side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
      });
      net.map = net.map.clone();
      net.map.repeat.set(8, 4);
      net.map.needsUpdate = true;
      const back = new THREE.Mesh(new THREE.PlaneGeometry(GW * 2, GH), net);
      back.position.set(0, GH / 2, s * (L + GD));
      const roof = new THREE.Mesh(new THREE.PlaneGeometry(GW * 2, GD), net);
      roof.rotation.x = Math.PI / 2;
      roof.position.set(0, GH, s * (L + GD / 2));
      grp.add(back, roof);
      for (const sx of [-1, 1]) {
        const side = new THREE.Mesh(new THREE.PlaneGeometry(GD, GH), net);
        side.rotation.y = Math.PI / 2;
        side.position.set(sx * GW, GH / 2, s * (L + GD / 2));
        grp.add(side);
      }
      // Cadre lumineux (poteaux et barre transversale)
      const frame = new THREE.MeshBasicMaterial({ color: team.color, fog: false });
      const postG = new THREE.BoxGeometry(0.7, GH, 0.7);
      for (const sx of [-1, 1]) {
        const post = new THREE.Mesh(postG, frame);
        post.position.set(sx * (GW + 0.35), GH / 2, s * (L + 0.35));
        grp.add(post);
      }
      const bar = new THREE.Mesh(new THREE.BoxGeometry(GW * 2 + 1.4, 0.7, 0.7), frame);
      bar.position.set(0, GH + 0.35, s * (L + 0.35));
      grp.add(bar);
      // Halo de but
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(GW * 2 + 6, GH + 6), new THREE.MeshBasicMaterial({
        map: radialTexture(hexA(team.css, 0.5), hexA(team.css, 0)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
      }));
      glow.position.set(0, GH / 2, s * (L + GD - 0.3));
      grp.add(glow);
      this.root.add(grp);
    }
  }

  buildStands() {
    const t = this.theme;
    const q = this.q;
    const outline = this.geo.outline(6, 6);
    const tiers = q.level === 'low' ? 5 : 8;
    const standBoxes = [], people = [];
    for (let i = 0; i < outline.length; i++) {
      const p = outline[i], nxt = outline[(i + 1) % outline.length];
      const seg = Math.hypot(nxt.x - p.x, nxt.z - p.z);
      if (seg < 0.5) continue;
      const tx = (nxt.x - p.x) / seg, tz = (nxt.z - p.z) / seg;
      const behindGoal = Math.abs(p.nz) > 0.9 && Math.abs(p.x) < ARENA.GOAL_W + 8;
      const start = behindGoal ? ARENA.GOAL_D + 10 : 7;
      for (let k = 0; k < tiers; k++) {
        const off = start + k * 3.4;
        const y = 1.2 + k * 2.6;
        const cx = (p.x + nxt.x) / 2 + p.nx * off, cz = (p.z + nxt.z) / 2 + p.nz * off;
        standBoxes.push({ x: cx, y: y / 2, z: cz, h: y, len: seg + 0.2, ang: Math.atan2(-tz, tx) });
        const per = Math.max(1, Math.floor(seg / 1.5));
        for (let m = 0; m < per; m++) {
          if (Math.random() < (q.level === 'low' ? 0.55 : 0.2)) continue;
          const f = (m + 0.5) / per - 0.5;
          people.push({ x: cx + tx * f * seg, y: y + 0.7, z: cz + tz * f * seg });
        }
      }
    }
    const boxGeo = new THREE.BoxGeometry(1, 1, 3.4);
    const standMat = new THREE.MeshStandardMaterial({ color: t.lowerWall, roughness: 0.8 });
    const stands = new THREE.InstancedMesh(boxGeo, standMat, standBoxes.length);
    const m4 = new THREE.Matrix4(), qn = new THREE.Quaternion(), sc = new THREE.Vector3(), ps = new THREE.Vector3();
    const Y = new THREE.Vector3(0, 1, 0);
    standBoxes.forEach((b, i) => {
      qn.setFromAxisAngle(Y, b.ang);
      m4.compose(ps.set(b.x, b.y, b.z), qn, sc.set(b.len, b.h, 1));
      stands.setMatrixAt(i, m4);
    });
    this.root.add(stands);

    const maxPeople = { low: 700, medium: 1800, high: 3600 }[q.level] || 1800;
    const crowd = people.slice(0, maxPeople);
    const pGeo = new THREE.BoxGeometry(0.8, 1.3, 0.8);
    const pMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const time = { value: 0 };
    this.crowdTime = time;
    if (q.level !== 'low') {
      pMat.onBeforeCompile = (sh) => {
        sh.uniforms.uTime = time;
        sh.vertexShader = 'uniform float uTime;\n' + sh.vertexShader.replace('#include <begin_vertex>',
          '#include <begin_vertex>\nfloat ph = float(gl_InstanceID) * 1.37; transformed.y += max(0.0, sin(uTime * 6.0 + ph)) * 0.35 * step(0.4, fract(ph));');
      };
    }
    const crowdMesh = new THREE.InstancedMesh(pGeo, pMat, crowd.length);
    const col = new THREE.Color();
    crowd.forEach((p, i) => {
      m4.makeTranslation(p.x, p.y, p.z);
      crowdMesh.setMatrixAt(i, m4);
      crowdMesh.setColorAt(i, col.setHex(t.crowd[i % t.crowd.length]).multiplyScalar(0.6 + Math.random() * 0.5));
    });
    this.root.add(crowdMesh);
  }

  buildScreens() {
    this.screenCanvas = canvas(512, 160);
    this.screenTex = canvasTexture(this.screenCanvas);
    const mat = new THREE.MeshBasicMaterial({ map: this.screenTex, fog: false });
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x111118, metalness: 0.6, roughness: 0.4 });
    for (const s of [-1, 1]) {
      const g = new THREE.Group();
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(44, 13.75), mat);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(46, 15.5, 1), frameMat);
      frame.position.z = -0.6;
      g.add(frame, scr);
      g.position.set(0, ARENA.H + 4, s * (ARENA.L + ARENA.GOAL_D + 34));
      g.lookAt(0, ARENA.H * 0.4, 0);
      this.root.add(g);
    }
    // Cube d'affichage suspendu au-dessus du centre
    const cube = new THREE.Mesh(new THREE.BoxGeometry(22, 7, 22), [mat, mat, frameMat, frameMat, mat, mat]);
    cube.position.set(0, ARENA.H + 9, 0);
    this.root.add(cube);
    this.cube = cube;
    this.updateScreens([0, 0], '5:00');
  }

  updateScreens(score, time, flash = null) {
    const g = this.screenCanvas.getContext('2d');
    const w = 512, h = 160;
    g.fillStyle = '#05060d';
    g.fillRect(0, 0, w, h);
    if (flash) {
      g.fillStyle = flash.color;
      g.font = 'bold 96px sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(flash.text, w / 2, h / 2 + 4);
    } else {
      g.textBaseline = 'middle';
      g.font = 'bold 30px sans-serif';
      g.textAlign = 'left'; g.fillStyle = TEAM[0].css; g.fillText(TEAM[0].name, 24, 40);
      g.textAlign = 'right'; g.fillStyle = TEAM[1].css; g.fillText(TEAM[1].name, w - 24, 40);
      g.font = 'bold 88px sans-serif';
      g.textAlign = 'center';
      g.fillStyle = TEAM[0].css; g.fillText(String(score[0]), 90, 108);
      g.fillStyle = TEAM[1].css; g.fillText(String(score[1]), w - 90, 108);
      g.fillStyle = '#ffffff'; g.font = 'bold 64px sans-serif'; g.fillText(time, w / 2, 96);
    }
    this.screenTex.needsUpdate = true;
  }

  buildDecor() {
    const t = this.theme;
    if (t.decor === 'dome') {
      const dome = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(330, 3)),
        new THREE.LineBasicMaterial({ color: t.wallGlow, transparent: true, opacity: 0.18, fog: false }),
      );
      dome.position.y = -40;
      this.root.add(dome);
      this.addStars(t, 500);
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(150 + i * 40, 0.8, 6, 96), new THREE.MeshBasicMaterial({ color: i % 2 ? t.wall : t.wallGlow, fog: false }));
        ring.rotation.x = Math.PI / 2;
        ring.position.y = 70 + i * 22;
        this.root.add(ring);
        this.animated.push((dt) => { ring.rotation.z += dt * 0.05 * (i % 2 ? 1 : -1); });
      }
    } else if (t.decor === 'reactor') {
      const dunes = new THREE.PlaneGeometry(2000, 2000, 60, 60);
      dunes.rotateX(-Math.PI / 2);
      const p = dunes.attributes.position;
      for (let i = 0; i < p.count; i++) {
        const x = p.getX(i), z = p.getZ(i);
        const d = Math.hypot(x, z);
        const hgt = d < 260 ? -2 : Math.sin(x * 0.012) * 14 + Math.cos(z * 0.017 + x * 0.004) * 10 + (d - 260) * 0.05;
        p.setY(i, hgt - 3);
      }
      dunes.computeVertexNormals();
      this.root.add(new THREE.Mesh(dunes, new THREE.MeshStandardMaterial({ color: 0xc2773f, roughness: 1, flatShading: true })));
      // Réacteur géant
      const reactor = new THREE.Group();
      const core = new THREE.Mesh(new THREE.CylinderGeometry(18, 26, 150, 16), new THREE.MeshStandardMaterial({ color: 0x3a2418, metalness: 0.6, roughness: 0.5 }));
      core.position.y = 75;
      const glowMat = new THREE.MeshBasicMaterial({ color: 0xffd24a, fog: false });
      const orb = new THREE.Mesh(new THREE.SphereGeometry(16, 20, 14), new THREE.MeshBasicMaterial({ color: 0xfff0b0, fog: false }));
      orb.position.y = 165;
      reactor.add(core, orb);
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(34 + i * 8, 1.4, 8, 64), glowMat);
        ring.position.y = 165;
        reactor.add(ring);
        this.animated.push((dt) => { ring.rotation.x += dt * (0.4 + i * 0.25); ring.rotation.y += dt * 0.3; });
      }
      reactor.position.set(ARENA.W + 190, 0, 0);
      this.root.add(reactor);
      const sunDisc = new THREE.Mesh(new THREE.CircleGeometry(70, 32), new THREE.MeshBasicMaterial({ map: radialTexture('rgba(255,230,160,1)', 'rgba(255,120,40,0)'), transparent: true, fog: false, depthWrite: false }));
      sunDisc.position.set(-900, 120, -300);
      sunDisc.lookAt(0, 0, 0);
      this.root.add(sunDisc);
    } else if (t.decor === 'sky') {
      const rock = new THREE.Mesh(new THREE.ConeGeometry(190, 170, 10, 4), new THREE.MeshStandardMaterial({ color: 0x6b5a4a, roughness: 1, flatShading: true }));
      rock.rotation.x = Math.PI;
      rock.position.y = -88;
      this.root.add(rock);
      const grass = new THREE.Mesh(new THREE.CylinderGeometry(192, 190, 4, 10), new THREE.MeshStandardMaterial({ color: 0x4f9a50, roughness: 1, flatShading: true }));
      grass.position.y = -3.2;
      this.root.add(grass);
      const cloudTex = radialTexture('rgba(255,255,255,0.95)', 'rgba(255,255,255,0)');
      const n = this.q.level === 'low' ? 30 : 70;
      for (let i = 0; i < n; i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: cloudTex, transparent: true, depthWrite: false, fog: false, opacity: 0.85 }));
        const a = Math.random() * Math.PI * 2, r = 320 + Math.random() * 500;
        s.position.set(Math.cos(a) * r, -60 + Math.random() * 140, Math.sin(a) * r);
        s.scale.setScalar(80 + Math.random() * 120);
        this.root.add(s);
      }
      // Anneaux de guidage flottants
      for (let i = 0; i < 4; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(12, 0.6, 6, 40), new THREE.MeshBasicMaterial({ color: 0x4cf0c0, fog: false }));
        const a = i * Math.PI / 2 + Math.PI / 4;
        ring.position.set(Math.cos(a) * 230, 60, Math.sin(a) * 230);
        this.root.add(ring);
        this.animated.push((dt) => { ring.rotation.y += dt * 0.6; });
      }
    }
    // Pylônes lumineux aux quatre coins
    const pylonMat = new THREE.MeshStandardMaterial({ color: this.theme.lowerWall, metalness: 0.5, roughness: 0.5 });
    const lampMat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const px = sx * (ARENA.W + 30), pz = sz * (ARENA.L - 10);
      const pylon = new THREE.Mesh(new THREE.BoxGeometry(3, 70, 3), pylonMat);
      pylon.position.set(px, 35, pz);
      const lamp = new THREE.Mesh(new THREE.BoxGeometry(14, 4, 2), lampMat);
      lamp.position.set(px, 70, pz);
      lamp.lookAt(0, 0, 0);
      this.root.add(pylon, lamp);
    }
  }

  addStars(t, n) {
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, e = Math.random() * 0.9 + 0.1, r = 900;
      pos.set([Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r], i * 3);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.root.add(new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, fog: false })));
  }

  // Capsules de boost
  buildPads(pads) {
    const smallGeo = new THREE.CylinderGeometry(1.6, 1.9, 0.25, 16);
    const bigGeo = new THREE.CylinderGeometry(3.2, 3.6, 0.3, 20);
    const orbGeo = new THREE.OctahedronGeometry(1.4, 0);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x20222c, metalness: 0.5, roughness: 0.5 });
    const onMat = new THREE.MeshBasicMaterial({ color: 0xffc23a, fog: false });
    const offMat = new THREE.MeshBasicMaterial({ color: 0x3a3320 });
    const glowTex = radialTexture('rgba(255,200,60,0.9)', 'rgba(255,160,0,0)');
    for (const pad of pads) {
      const g = new THREE.Group();
      g.position.set(pad.x, 0.13, pad.z);
      const base = new THREE.Mesh(pad.big ? bigGeo : smallGeo, baseMat);
      const ring = new THREE.Mesh(new THREE.RingGeometry(pad.big ? 2.4 : 1.1, pad.big ? 3.0 : 1.5, 20), onMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.17;
      g.add(base, ring);
      let orb = null;
      if (pad.big) {
        orb = new THREE.Mesh(orbGeo, onMat);
        orb.position.y = 2.4;
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
        halo.scale.setScalar(8);
        orb.add(halo);
        g.add(orb);
      }
      this.root.add(g);
      this.padViews.push({ pad, ring, orb, onMat, offMat, active: true });
    }
  }

  update(dt, pads) {
    this.time += dt;
    if (this.crowdTime) this.crowdTime.value = this.time;
    for (const fn of this.animated) fn(dt);
    if (this.cube) this.cube.rotation.y += dt * 0.15;
    for (const v of this.padViews) {
      const active = v.pad.active;
      if (active !== v.active) {
        v.active = active;
        v.ring.material = active ? v.onMat : v.offMat;
        if (v.orb) v.orb.visible = active;
      }
      if (v.orb && active) {
        v.orb.rotation.y += dt * 2;
        v.orb.position.y = 2.4 + Math.sin(this.time * 2.5 + v.pad.x) * 0.3;
      }
    }
  }

  dispose() {
    this.scene.remove(this.root);
    this.root.traverse((o) => {
      o.geometry?.dispose();
      const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
      for (const m of mats) m.dispose();
    });
  }
}

export function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
