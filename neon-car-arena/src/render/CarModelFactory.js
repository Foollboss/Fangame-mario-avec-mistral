import * as THREE from 'three';
import { VEHICLES } from '../config/VehicleCatalog.js';
import { ITEM_BY_ID, DEFAULT_LOADOUT } from '../config/ItemCatalog.js';
import { canvas, canvasTexture, cached, radialTexture, hexPattern } from './Textures.js';

// Profils latéraux (z = longueur, y = hauteur), normalisés sur la demi-boîte de collision.
// « body » = carrosserie peinte, « cabin » = verrière. Formes originales créées pour ce jeu.
const SHAPES = {
  pulse: {
    body: [[-1, -0.55], [1, -0.55], [1.04, -0.05], [0.8, 0.2], [0.3, 0.32], [-0.8, 0.4], [-1.04, 0.3]],
    cabin: [[0.34, 0.3], [0.02, 1.0], [-0.5, 1.0], [-0.82, 0.38]], wheelR: 0.45, spoiler: true,
  },
  vortex: {
    body: [[-1, -0.6], [1.06, -0.6], [1.1, -0.3], [0.35, 0.2], [-0.95, 0.5], [-1.03, 0.5]],
    cabin: [[0.3, 0.22], [-0.05, 0.9], [-0.5, 0.88], [-0.78, 0.42]], wheelR: 0.42, spoiler: true, wing: true,
  },
  titan: {
    body: [[-1, -0.6], [1, -0.6], [1.03, 0.25], [0.62, 0.4], [-1, 0.42]],
    cabin: [[0.58, 0.38], [0.36, 1.05], [-0.42, 1.05], [-0.5, 0.4]], wheelR: 0.55, bed: true,
  },
  phantom: {
    body: [[-1, -0.55], [1.08, -0.55], [1.12, -0.25], [0.5, 0.12], [-0.9, 0.3], [-1.02, 0.2]],
    cabin: [[0.48, 0.1], [0.08, 0.82], [-0.45, 0.8], [-0.85, 0.28]], wheelR: 0.43, fins: true,
  },
  rift: {
    body: [[-1, -0.58], [1.06, -0.58], [1.02, -0.1], [0.45, 0.22], [-0.7, 0.45], [-1.06, 0.62], [-1.06, 0.3]],
    cabin: [[0.4, 0.2], [0.14, 0.92], [-0.35, 0.92], [-0.66, 0.44]], wheelR: 0.45, fins: true, wing: true,
  },
  nomad: {
    body: [[-1, -0.45], [1, -0.45], [1.06, 0.1], [0.72, 0.3], [-0.82, 0.35], [-1.02, 0.3]],
    cabin: [[0.3, 0.3], [0.05, 0.98], [-0.62, 0.98], [-0.8, 0.34]], wheelR: 0.55, cage: true,
  },
};

const item = (id, cat) => ITEM_BY_ID[id] || ITEM_BY_ID[DEFAULT_LOADOUT[cat]];

function decalTexture(pattern, paint, accent, key) {
  return cached(`decal:${key}`, () => {
    const c = canvas(256, 128);
    const g = c.getContext('2d');
    g.fillStyle = paint;
    g.fillRect(0, 0, 256, 128);
    g.fillStyle = accent;
    g.strokeStyle = accent;
    switch (pattern) {
      case 'stripes': g.fillRect(0, 58, 256, 10); g.fillRect(0, 74, 256, 4); break;
      case 'split': g.fillRect(0, 70, 256, 58); break;
      case 'hex': g.globalAlpha = 0.8; hexPattern(g, 256, 128, 10, accent, 2.5); break;
      case 'flames':
        for (let i = 0; i < 6; i++) {
          g.beginPath(); g.moveTo(256, 60 + i * 5); g.quadraticCurveTo(170 - i * 12, 40 + i * 10, 110 - i * 8, 62 + (i % 2) * 14);
          g.quadraticCurveTo(160, 80, 256, 90); g.fill();
        }
        break;
      case 'circuit':
        g.lineWidth = 3;
        for (let i = 0; i < 9; i++) {
          const y = 20 + i * 11, x = 20 + (i * 53) % 180;
          g.beginPath(); g.moveTo(0, y); g.lineTo(x, y); g.lineTo(x + 20, y + 10); g.lineTo(256, y + 10); g.stroke();
          g.beginPath(); g.arc(x + 20, y + 10, 4, 0, 7); g.fill();
        }
        break;
      case 'number':
        g.font = 'bold 70px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
        g.fillText('07', 128, 76);
        break;
      case 'claws':
        g.lineWidth = 9; g.lineCap = 'round';
        for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(150 + i * 22, 40); g.lineTo(110 + i * 22, 110); g.stroke(); }
        break;
      case 'carbon':
        g.globalAlpha = 0.35;
        for (let y = 0; y < 128; y += 6) for (let x = (y / 6) % 2 * 6; x < 256; x += 12) g.fillRect(x, y, 6, 6);
        break;
      case 'galaxy': {
        const grd = g.createLinearGradient(0, 0, 256, 128);
        grd.addColorStop(0, '#1b0038'); grd.addColorStop(0.5, '#5a1a9a'); grd.addColorStop(1, '#0a2a6a');
        g.fillStyle = grd; g.fillRect(0, 0, 256, 128);
        g.fillStyle = '#fff';
        for (let i = 0; i < 90; i++) g.fillRect((i * 97) % 256, (i * 57) % 128, 1.5, 1.5);
        break;
      }
      default: break;
    }
    return canvasTexture(c);
  });
}

function paintMaterial(finish, color, map = null) {
  const d = finish.data;
  const opts = { color: map ? 0xffffff : color, map, metalness: d.metalness, roughness: d.roughness };
  if (d.clearcoat || d.holo) {
    return new THREE.MeshPhysicalMaterial({ ...opts, clearcoat: 1, clearcoatRoughness: 0.1, iridescence: d.holo ? 1 : 0, iridescenceIOR: 1.6 });
  }
  return new THREE.MeshStandardMaterial(opts);
}

function extrude(points, hz, hy, width) {
  const shape = new THREE.Shape(points.map(([z, y]) => new THREE.Vector2(z * hz, y * hy)));
  const g = new THREE.ExtrudeGeometry(shape, { depth: width, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.07, bevelSegments: 2, steps: 1 });
  g.rotateY(-Math.PI / 2);
  g.translate(width / 2, 0, 0);
  return g;
}

function buildWheel(r, w, style, rimColor) {
  const grp = new THREE.Group();
  const tire = new THREE.Mesh(cached(`tire:${r}:${w}`, () => new THREE.CylinderGeometry(r, r, w, 18).rotateZ(Math.PI / 2)),
    cached('tireMat', () => new THREE.MeshStandardMaterial({ color: 0x121216, roughness: 0.9 })));
  grp.add(tire);
  const rimMat = new THREE.MeshStandardMaterial({ color: rimColor, metalness: 0.8, roughness: 0.3 });
  const outer = w / 2 + 0.01;
  if (style === 'neon') {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r * 0.66, 0.06, 6, 20), new THREE.MeshBasicMaterial({ color: rimColor }));
    ring.rotation.y = Math.PI / 2;
    for (const sx of [-1, 1]) { const rr = ring.clone(); rr.position.x = sx * outer; grp.add(rr); }
  } else if (style === 'disc') {
    for (const sx of [-1, 1]) {
      const d = new THREE.Mesh(new THREE.CircleGeometry(r * 0.72, 16), rimMat);
      d.rotation.y = sx * Math.PI / 2; d.position.x = sx * outer; grp.add(d);
    }
  } else {
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.6, r * 0.6, w + 0.02, 12).rotateZ(Math.PI / 2), rimMat);
    grp.add(hub);
    if (style === 'spoke' || style === 'turbine') {
      const n = style === 'spoke' ? 5 : 8;
      for (let i = 0; i < n; i++) {
        for (const sx of [-1, 1]) {
          const s = new THREE.Mesh(new THREE.BoxGeometry(0.05, r * 1.15, 0.09), rimMat);
          s.position.x = sx * (outer + 0.02);
          s.rotation.x = (i / n) * Math.PI;
          if (style === 'turbine') s.rotation.y = 0.5;
          grp.add(s);
        }
      }
    }
  }
  return grp;
}

function buildAntenna(style, color) {
  if (!style || style === 'none') return null;
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.3, 5), new THREE.MeshStandardMaterial({ color: 0x222222 }));
  pole.position.y = 0.65;
  g.add(pole);
  const mat = new THREE.MeshBasicMaterial({ color });
  let top;
  if (style === 'orb') top = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 8), mat);
  else if (style === 'flag') { top = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.32), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })); top.position.z = -0.25; }
  else if (style === 'bolt') top = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), mat);
  else if (style === 'star') top = new THREE.Mesh(new THREE.IcosahedronGeometry(0.2, 0), mat);
  else if (style === 'crown') top = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.14, 0.18, 6, 1, true), new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide }));
  top.position.y += 1.35;
  g.add(top);
  return g;
}

export function randomLoadout(rng = Math.random) {
  const pick = (cat) => {
    const list = Object.values(ITEM_BY_ID).filter((i) => i.cat === cat && i.level < 99);
    return list[Math.floor(rng() * list.length)].id;
  };
  return {
    paint: pick('paint'), finish: pick('finish'), decal: pick('decal'), wheels: pick('wheels'), antenna: pick('antenna'),
    boost: pick('boost'), trail: pick('trail'), goalfx: pick('goalfx'), engine: pick('engine'), title: 'title_rookie',
  };
}

// Construit le modèle 3D d'une voiture. Retourne les éléments animés par CarView.
export function buildCarModel(vehicleId, loadout, teamColor, quality = 'medium') {
  const v = VEHICLES[vehicleId] || VEHICLES.pulse;
  const shape = SHAPES[v.id];
  const L = { ...DEFAULT_LOADOUT, ...(loadout || {}) };
  const hx = v.half.x, hy = v.half.y, hz = v.half.z;
  const paint = item(L.paint, 'paint').data.color;
  const finish = item(L.finish, 'finish');
  const decal = item(L.decal, 'decal').data.pattern;
  const teamCss = '#' + new THREE.Color(teamColor).getHexString();

  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  // Carrosserie : décor sur les flancs, peinture unie ailleurs
  const tex = decal === 'none' ? null : decalTexture(decal, paint, decal === 'galaxy' ? paint : teamCss, `${decal}:${paint}:${teamCss}`);
  const sideMat = paintMaterial(finish, paint, tex ? tex.clone() : null);
  if (sideMat.map) {
    sideMat.map.repeat.set(1 / (2.3 * hz), 1 / (2.4 * hy));
    sideMat.map.offset.set(0.5, 0.5);
    sideMat.map.needsUpdate = true;
  }
  const plainMat = paintMaterial(finish, paint);
  const bodyMesh = new THREE.Mesh(extrude(shape.body, hz, hy, hx * 2 * 0.92), [sideMat, plainMat]);
  body.add(bodyMesh);
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x0b0f1a, metalness: 0.9, roughness: 0.12, emissive: teamColor, emissiveIntensity: 0.08 });
  const cabin = new THREE.Mesh(extrude(shape.cabin, hz, hy, hx * 2 * 0.74), glassMat);
  body.add(cabin);

  const accentMat = new THREE.MeshBasicMaterial({ color: teamColor });
  // Bandes lumineuses d'équipe (lisibilité)
  for (const sx of [-1, 1]) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.1, hz * 1.7), accentMat);
    strip.position.set(sx * (hx * 0.93 + 0.04), -hy * 0.32, 0);
    body.add(strip);
  }
  const lightBar = new THREE.Mesh(new THREE.BoxGeometry(hx * 1.2, 0.08, 0.06), accentMat);
  lightBar.position.set(0, hy * 0.05, hz * 1.07);
  body.add(lightBar);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(hx * 1.4, 0.12, 0.06), new THREE.MeshBasicMaterial({ color: 0xff2040 }));
  tail.position.set(0, hy * 0.15, -hz * 1.05);
  body.add(tail);

  // Éléments spécifiques
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x15161c, metalness: 0.6, roughness: 0.4 });
  if (shape.spoiler || shape.wing) {
    const wing = new THREE.Mesh(new THREE.BoxGeometry(hx * 1.9, 0.07, 0.5), shape.wing ? plainMat : darkMat);
    wing.position.set(0, hy * (shape.wing ? 1.05 : 0.62), -hz * 0.92);
    body.add(wing);
    for (const sx of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.07, hy * 0.5, 0.25), darkMat);
      post.position.set(sx * hx * 0.6, hy * (shape.wing ? 0.8 : 0.45), -hz * 0.92);
      body.add(post);
    }
  }
  if (shape.fins) {
    for (const sx of [-1, 1]) {
      const fin = new THREE.Mesh(new THREE.BoxGeometry(0.06, hy * 0.7, hz * 0.5), plainMat);
      fin.position.set(sx * hx * 0.7, hy * 0.55, -hz * 0.75);
      fin.rotation.x = -0.35;
      body.add(fin);
    }
  }
  if (shape.bed) {
    const bed = new THREE.Mesh(new THREE.BoxGeometry(hx * 1.7, 0.08, hz * 0.9), darkMat);
    bed.position.set(0, hy * 0.43, -hz * 0.55);
    body.add(bed);
  }
  if (shape.cage) {
    const cageMat = new THREE.MeshStandardMaterial({ color: 0x2a2c34, metalness: 0.8, roughness: 0.3 });
    for (const sz of [0.1, -0.55]) {
      const arc = new THREE.Mesh(new THREE.TorusGeometry(hx * 0.8, 0.06, 5, 12, Math.PI), cageMat);
      arc.position.set(0, hy * 0.3, sz * hz);
      body.add(arc);
    }
  }
  // Tuyères de boost
  const exhausts = [];
  const nozMat = new THREE.MeshStandardMaterial({ color: 0x333338, metalness: 0.9, roughness: 0.3 });
  for (const sx of [-1, 1]) {
    const n = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.2, 0.3, 10).rotateX(Math.PI / 2), nozMat);
    const p = new THREE.Vector3(sx * hx * 0.38, -hy * 0.18, -hz * 1.05);
    n.position.copy(p);
    body.add(n);
    exhausts.push(p.clone().add(new THREE.Vector3(0, 0, -0.2)));
  }

  // Roues
  const wItem = item(L.wheels, 'wheels').data;
  const r = shape.wheelR, w = 0.42;
  const wheels = [];
  const mounts = [[1, 1], [-1, 1], [1, -1], [-1, -1]];
  mounts.forEach(([sx, sz], i) => {
    const pivot = new THREE.Group();
    const mount = new THREE.Vector3(sx * (hx - 0.15), -hy + 0.25, sz * (hz - 0.5));
    pivot.position.copy(mount);
    const spin = buildWheel(r, w, wItem.style, wItem.rim);
    spin.position.x = sx * 0.12;
    pivot.add(spin);
    root.add(pivot);
    wheels.push({ pivot, spin, mount, front: sz > 0, radius: r, index: i });
  });

  // Antenne
  const aItem = item(L.antenna, 'antenna').data;
  const antenna = buildAntenna(aItem.style, aItem.color || '#ffffff');
  if (antenna) {
    antenna.position.set(hx * 0.45, hy * 0.6, -hz * 0.65);
    body.add(antenna);
  }

  // Lueur au sol (couleur d'équipe)
  const under = new THREE.Mesh(new THREE.PlaneGeometry(hx * 3.2, hz * 3), new THREE.MeshBasicMaterial({
    map: radialTexture('rgba(255,255,255,0.8)', 'rgba(255,255,255,0)'), color: teamColor, transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending, opacity: quality === 'low' ? 0.35 : 0.55,
  }));
  under.rotation.x = -Math.PI / 2;
  under.position.y = -hy - 0.2;
  root.add(under);

  return { root, body, wheels, exhausts, under, boostItem: item(L.boost, 'boost'), trailItem: item(L.trail, 'trail'), goalItem: item(L.goalfx, 'goalfx') };
}
