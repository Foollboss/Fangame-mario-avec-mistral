import * as THREE from 'three';
import { ARENA, createBoostPads } from '../sim/arena.js';

function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')];
}

function tex(c, repeat = false) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Pitch texture covering x in [-W, W] (u) and z in [-L, L] (v).
export function makeFloorTexture(theme) {
  const { W, L, RC, GW } = ARENA;
  const px = 20; // pixels per world unit
  const w = Math.round(W * 2 * px);
  const h = Math.round(L * 2 * px);
  const [c, ctx] = canvas(w, h);
  const X = (x) => (x + W) * px;
  const Z = (z) => (L - z) * px; // canvas row 0 = +z (orange side)

  ctx.fillStyle = theme.grassA;
  ctx.fillRect(0, 0, w, h);
  const stripes = 16;
  for (let i = 0; i < stripes; i++) {
    if (i % 2) continue;
    ctx.fillStyle = theme.grassB;
    ctx.fillRect(0, (h / stripes) * i, w, h / stripes);
  }
  // Subtle team tint on each half.
  let g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, 'rgba(255,120,20,0.20)');
  g.addColorStop(0.45, 'rgba(255,120,20,0.0)');
  g.addColorStop(0.55, 'rgba(40,110,255,0.0)');
  g.addColorStop(1, 'rgba(40,110,255,0.22)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  // Grass noise.
  for (let i = 0; i < 26000; i++) {
    const a = Math.random() * 0.06;
    ctx.fillStyle = Math.random() < 0.5 ? `rgba(0,0,0,${a})` : `rgba(255,255,255,${a})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 3, 2 + Math.random() * 3);
  }

  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 0.28 * px;
  const inset = 3.4;
  roundRectPath(ctx, X(-W + inset), Z(L - inset), (W - inset) * 2 * px, (L - inset) * 2 * px, (RC - 2) * px);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(X(-W + inset), Z(0));
  ctx.lineTo(X(W - inset), Z(0));
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(X(0), Z(0), 10 * px, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(X(0), Z(0), 0.9 * px, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.fill();
  for (const s of [1, -1]) {
    const zl = s * (L - inset);
    const box = GW + 6;
    const depth = 11 * s;
    ctx.beginPath();
    ctx.moveTo(X(-box), Z(zl));
    ctx.lineTo(X(-box + 2), Z(zl - depth));
    ctx.lineTo(X(box - 2), Z(zl - depth));
    ctx.lineTo(X(box), Z(zl));
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(X(0), Z(zl - depth), 5 * px, s > 0 ? 0 : Math.PI, s > 0 ? Math.PI : Math.PI * 2);
    ctx.stroke();
  }
  // Boost pad sockets.
  for (const p of createBoostPads()) {
    ctx.beginPath();
    ctx.arc(X(p.pos.x), Z(p.pos.z), (p.big ? 2.2 : 1.3) * px, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20,20,20,0.35)';
    ctx.fill();
    ctx.lineWidth = 0.12 * px;
    ctx.strokeStyle = 'rgba(255,200,80,0.6)';
    ctx.stroke();
  }
  // Centre logo.
  ctx.save();
  ctx.translate(X(0), Z(0));
  ctx.rotate(-Math.PI / 2);
  ctx.font = `italic 900 ${3.2 * px}px Arial Black, Arial, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillText('SUPERSONIC', 0, -1.7 * px);
  ctx.fillText('ARENA', 0, 1.9 * px);
  ctx.restore();

  const t = tex(c);
  t.generateMipmaps = true;
  return t;
}

// Tileable hexagon pattern for the glass walls.
export function makeHexTexture() {
  const s = 32;
  const w = s * 3;
  const hh = Math.round(Math.sqrt(3) * s);
  const [c, ctx] = canvas(w * 2, hh * 2);
  ctx.clearRect(0, 0, w * 2, hh * 2);
  ctx.strokeStyle = 'rgba(255,255,255,1)';
  ctx.lineWidth = 2.2;
  const hex = (cx, cy) => {
    ctx.beginPath();
    for (let i = 0; i <= 6; i++) {
      const a = (Math.PI / 3) * i;
      const x = cx + Math.cos(a) * (s - 1.5);
      const y = cy + Math.sin(a) * (hh / 2 - 1.5);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };
  for (let col = -1; col < 6; col++) {
    for (let row = -1; row < 4; row++) {
      hex(col * 1.5 * s, row * hh + (col % 2 ? hh / 2 : 0));
    }
  }
  return tex(c, true);
}

export function makeNetTexture() {
  const [c, ctx] = canvas(128, 128);
  ctx.clearRect(0, 0, 128, 128);
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 3;
  for (let i = 0; i <= 128; i += 32) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 128); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(128, i); ctx.stroke();
  }
  return tex(c, true);
}

// Panel texture for the solid lower walls.
export function makePanelTexture() {
  const [c, ctx] = canvas(256, 128);
  ctx.fillStyle = '#9aa3b5';
  ctx.fillRect(0, 0, 256, 128);
  ctx.strokeStyle = 'rgba(40,45,60,0.8)';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 252, 124);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  for (let i = 0; i < 6; i++) ctx.fillRect(12 + i * 40, 20, 24, 88);
  return tex(c, true);
}

// Truncated icosahedron (32 panels) painted on an equirectangular map.
export function makeBallTextures() {
  const w = 1024;
  const h = 512;
  const [c, ctx] = canvas(w, h);
  const [ce, ctxE] = canvas(w, h);
  const phi = (1 + Math.sqrt(5)) / 2;
  const centers = [];
  const norm = (v) => { const l = Math.hypot(...v); return v.map((x) => x / l); };
  const ico = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) {
    ico.push([0, a, b * phi], [a, b * phi, 0], [b * phi, 0, a]);
  }
  for (const v of ico) centers.push({ d: norm(v), pent: true });
  for (const a of [-1, 1]) for (const b of [-1, 1]) for (const cc of [-1, 1]) centers.push({ d: norm([a, b, cc]), pent: false });
  for (const a of [-1, 1]) for (const b of [-1, 1]) {
    centers.push({ d: norm([0, a / phi, b * phi]), pent: false });
    centers.push({ d: norm([a / phi, b * phi, 0]), pent: false });
    centers.push({ d: norm([b * phi, 0, a / phi]), pent: false });
  }
  const img = ctx.createImageData(w, h);
  const imgE = ctxE.createImageData(w, h);
  for (let py = 0; py < h; py++) {
    const theta = ((py + 0.5) / h) * Math.PI;
    const st = Math.sin(theta);
    const ct = Math.cos(theta);
    for (let px = 0; px < w; px++) {
      const u = ((px + 0.5) / w) * Math.PI * 2;
      const dx = -Math.cos(u) * st;
      const dy = ct;
      const dz = Math.sin(u) * st;
      let b1 = -2;
      let b2 = -2;
      let best = null;
      for (const cn of centers) {
        const d = dx * cn.d[0] + dy * cn.d[1] + dz * cn.d[2];
        if (d > b1) { b2 = b1; b1 = d; best = cn; } else if (d > b2) b2 = d;
      }
      const edge = b1 - b2;
      const i = (py * w + px) * 4;
      let r; let g; let b;
      if (best.pent) { r = 58; g = 62; b = 72; } else { r = 214; g = 219; b = 226; }
      const shade = Math.min(1, edge * 18);
      r *= 0.55 + 0.45 * shade; g *= 0.55 + 0.45 * shade; b *= 0.55 + 0.45 * shade;
      img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = b; img.data[i + 3] = 255;
      const seam = edge < 0.012 ? 1 : 0;
      imgE.data[i] = seam * 90; imgE.data[i + 1] = seam * 200; imgE.data[i + 2] = seam * 255; imgE.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  ctxE.putImageData(imgE, 0, 0);
  return { map: tex(c), emissiveMap: tex(ce) };
}

export function makeCrowdTexture() {
  const [c, ctx] = canvas(512, 256);
  ctx.fillStyle = '#15161c';
  ctx.fillRect(0, 0, 512, 256);
  const colors = ['#2f7bff', '#ff8a1f', '#e8e8e8', '#444a57', '#8fb4ff', '#ffc27a', '#b03030', '#2f2f36'];
  for (let y = 4; y < 256; y += 9) {
    for (let x = (y / 9) % 2 ? 3 : 7; x < 512; x += 8) {
      if (Math.random() < 0.15) continue;
      ctx.fillStyle = colors[(Math.random() * colors.length) | 0];
      ctx.fillRect(x, y, 5, 6);
      ctx.fillStyle = 'rgba(230,200,170,0.8)';
      ctx.fillRect(x + 1, y - 3, 3, 3);
    }
  }
  return tex(c, true);
}

export function makeGlowTexture() {
  const [c, ctx] = canvas(64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  return t;
}

export function makeShadowTexture() {
  const [c, ctx] = canvas(64, 64);
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(0,0,0,0.75)');
  g.addColorStop(0.6, 'rgba(0,0,0,0.45)');
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

export function makeNameSprite(text, color) {
  const [c, ctx] = canvas(256, 64);
  ctx.font = 'bold 34px Segoe UI, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 6;
  ctx.strokeStyle = 'rgba(0,0,0,0.7)';
  ctx.strokeText(text, 128, 32);
  ctx.fillStyle = color;
  ctx.fillText(text, 128, 32);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  const m = new THREE.SpriteMaterial({ map: t, depthTest: false, transparent: true, sizeAttenuation: false });
  const s = new THREE.Sprite(m);
  s.scale.set(0.16, 0.04, 1);
  s.renderOrder = 10;
  return s;
}

export function makeScreenTexture(team) {
  const [c, ctx] = canvas(512, 256);
  const col = team === 0 ? ['#0b2d7a', '#2f7bff'] : ['#7a2c05', '#ff8a1f'];
  const g = ctx.createLinearGradient(0, 0, 512, 256);
  g.addColorStop(0, col[0]);
  g.addColorStop(1, col[1]);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 256);
  ctx.font = 'italic 900 70px Arial Black, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  ctx.fillText(team === 0 ? 'BLEU' : 'ORANGE', 256, 128);
  return tex(c);
}
