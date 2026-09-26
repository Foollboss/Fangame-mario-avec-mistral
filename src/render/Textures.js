import * as THREE from 'three';
import { ARENA } from '../core/Config.js';

const HW = ARENA.halfWidth;
const HL = ARENA.halfLength;

export function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return c;
}

export function toTexture(c, { repeat = null, srgb = true, aniso = 1 } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(repeat[0], repeat[1]);
  }
  t.anisotropy = aniso;
  return t;
}

export function radialTexture(size = 128, stops = [[0, 'rgba(255,255,255,1)'], [1, 'rgba(255,255,255,0)']]) {
  const c = canvas(size, size);
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) grd.addColorStop(o, col);
  g.fillStyle = grd;
  g.fillRect(0, 0, size, size);
  return toTexture(c);
}

// Field markings drawn in world units (x ∈ [-HW,HW], z ∈ [-HL,HL]).
export function fieldTexture(theme, size, aniso) {
  const W = Math.round((size * HW) / HL);
  const H = size;
  const c = canvas(W, H);
  const g = c.getContext('2d');
  const sx = W / (HW * 2), sz = H / (HL * 2);
  const X = (x) => (x + HW) * sx;
  const Z = (z) => (z + HL) * sz;
  const f = theme.field;
  g.fillStyle = f.base1;
  g.fillRect(0, 0, W, H);

  g.save();
  if (f.pattern === 'chevron') {
    g.fillStyle = f.base2;
    const band = 10;
    for (let k = -30; k < 30; k += 2) {
      g.beginPath();
      const z0 = k * band;
      g.moveTo(X(-HW), Z(z0 - HW * 0.45));
      g.lineTo(X(0), Z(z0));
      g.lineTo(X(HW), Z(z0 - HW * 0.45));
      g.lineTo(X(HW), Z(z0 - HW * 0.45 + band));
      g.lineTo(X(0), Z(z0 + band));
      g.lineTo(X(-HW), Z(z0 - HW * 0.45 + band));
      g.closePath();
      g.fill();
    }
  } else if (f.pattern === 'bands') {
    g.fillStyle = f.base2;
    for (let z = -HL; z < HL; z += 16) g.fillRect(0, Z(z), W, 8 * sz);
    g.strokeStyle = f.accent;
    g.globalAlpha = 0.35;
    g.lineWidth = 1;
    const r = 3.2;
    for (let z = -HL; z < HL; z += r * 1.5) {
      for (let x = -HW; x < HW; x += r * 1.732) {
        const ox = (Math.round((z + HL) / (r * 1.5)) % 2) * r * 0.866;
        hexPath(g, X(x + ox), Z(z), r * sx * 0.95);
        g.stroke();
      }
    }
    g.globalAlpha = 1;
  } else {
    // grid
    g.strokeStyle = f.base2;
    g.lineWidth = Math.max(1, sx * 0.25);
    for (let x = -HW; x <= HW; x += 5) {
      g.beginPath(); g.moveTo(X(x), 0); g.lineTo(X(x), H); g.stroke();
    }
    for (let z = -HL; z <= HL; z += 5) {
      g.beginPath(); g.moveTo(0, Z(z)); g.lineTo(W, Z(z)); g.stroke();
    }
  }
  g.restore();

  // Team tint towards each goal
  for (const [team, col] of [[0, theme.teamTint[0]], [1, theme.teamTint[1]]]) {
    const z0 = team === 0 ? -HL : HL;
    const grd = g.createLinearGradient(0, Z(z0), 0, Z(z0 * 0.2));
    grd.addColorStop(0, col);
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = grd;
    g.fillRect(0, team === 0 ? 0 : Z(z0 * 0.2), W, Math.abs(Z(z0) - Z(z0 * 0.2)));
  }

  // Lines
  g.strokeStyle = f.lines;
  g.lineWidth = 0.45 * sx;
  g.lineJoin = 'round';
  g.shadowColor = f.glow;
  g.shadowBlur = f.glowBlur ? f.glowBlur * sx : 0;
  const C = ARENA.corner - 1.5;
  const m = 1.5;
  g.beginPath();
  g.moveTo(X(-HW + m), Z(-HL + C));
  g.lineTo(X(-HW + C), Z(-HL + m));
  g.lineTo(X(HW - C), Z(-HL + m));
  g.lineTo(X(HW - m), Z(-HL + C));
  g.lineTo(X(HW - m), Z(HL - C));
  g.lineTo(X(HW - C), Z(HL - m));
  g.lineTo(X(-HW + C), Z(HL - m));
  g.lineTo(X(-HW + m), Z(HL - C));
  g.closePath();
  g.stroke();
  g.beginPath(); g.moveTo(X(-HW + m), Z(0)); g.lineTo(X(HW - m), Z(0)); g.stroke();
  g.beginPath(); g.arc(X(0), Z(0), 13 * sx, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.arc(X(0), Z(0), 1.2 * sx, 0, Math.PI * 2); g.fillStyle = f.lines; g.fill();
  for (const s of [-1, 1]) {
    const zl = s * (HL - m);
    const zb = s * (HL - 18);
    g.beginPath();
    g.moveTo(X(-22), Z(zl)); g.lineTo(X(-22), Z(zb)); g.lineTo(X(22), Z(zb)); g.lineTo(X(22), Z(zl));
    g.stroke();
    g.beginPath();
    g.arc(X(0), Z(zb), 9 * sx, s > 0 ? Math.PI : 0, s > 0 ? Math.PI * 2 : Math.PI);
    g.stroke();
  }
  g.shadowBlur = 0;

  // Centre logo
  g.save();
  g.translate(X(0), Z(0));
  g.rotate(-Math.PI / 2);
  g.fillStyle = f.logo;
  g.font = `700 ${Math.round(5.5 * sx)}px "Chakra Petch", "Arial Narrow", sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('NEON CAR ARENA', 0, 0);
  g.restore();
  return toTexture(c, { aniso });
}

function hexPath(g, cx, cy, r) {
  g.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    if (i === 0) g.moveTo(x, y);
    else g.lineTo(x, y);
  }
  g.closePath();
}

export function hexPanelTexture(lineColor = 'rgba(255,255,255,0.9)', fill = 'rgba(255,255,255,0.08)') {
  const s = 256;
  const c = canvas(s, s);
  const g = c.getContext('2d');
  const r = s / 4 / 1.5;
  g.strokeStyle = lineColor;
  g.fillStyle = fill;
  g.lineWidth = 3;
  const w = r * Math.sqrt(3);
  for (let row = -1; row < 6; row++) {
    for (let col = -1; col < 5; col++) {
      const cx = col * w + (row % 2 ? w / 2 : 0);
      const cy = row * r * 1.5;
      hexPath(g, cx, cy, r);
      g.fill();
      g.stroke();
    }
  }
  return toTexture(c, { repeat: [1, 1] });
}

export function netTexture(color = 'rgba(255,255,255,0.8)') {
  const s = 128;
  const c = canvas(s, s);
  const g = c.getContext('2d');
  g.strokeStyle = color;
  g.lineWidth = 3;
  for (let i = 0; i <= s; i += 16) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i, s); g.stroke();
    g.beginPath(); g.moveTo(0, i); g.lineTo(s, i); g.stroke();
  }
  return toTexture(c, { repeat: [1, 1] });
}

export function ballTexture() {
  const W = 1024, H = 512;
  const c = canvas(W, H);
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 0, H);
  grd.addColorStop(0, '#dfe6f2');
  grd.addColorStop(0.5, '#f7f9fc');
  grd.addColorStop(1, '#cfd8e6');
  g.fillStyle = grd;
  g.fillRect(0, 0, W, H);
  // Panels: stretched hexagons on an equirectangular map read as a futuristic panelled ball.
  g.strokeStyle = '#1b2233';
  g.lineWidth = 6;
  const rows = 6;
  for (let r = 0; r <= rows; r++) {
    const y = (r / rows) * H;
    const n = r === 0 || r === rows ? 1 : 10;
    for (let k = 0; k < n; k++) {
      const x = ((k + (r % 2) * 0.5) / n) * W;
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(x + W / n / 2, y + H / rows);
      g.moveTo(x, y);
      g.lineTo(x - W / n / 2, y + H / rows);
      g.stroke();
    }
  }
  g.fillStyle = '#10151f';
  g.fillRect(0, H / 2 - 10, W, 20);
  g.fillStyle = '#19e6ff';
  g.fillRect(0, H / 2 - 4, W, 8);
  return toTexture(c);
}

export function ballEmissiveTexture() {
  const W = 512, H = 256;
  const c = canvas(W, H);
  const g = c.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#ffffff';
  g.fillRect(0, H / 2 - 2, W, 4);
  return toTexture(c);
}

export function carbonTexture() {
  const s = 64;
  const c = canvas(s, s);
  const g = c.getContext('2d');
  for (let y = 0; y < s; y += 8) {
    for (let x = 0; x < s; x += 8) {
      const v = ((x + y) / 8) % 2 ? 60 : 110;
      g.fillStyle = `rgb(${v},${v},${v + 8})`;
      g.fillRect(x, y, 8, 8);
      g.fillStyle = 'rgba(255,255,255,0.12)';
      g.fillRect(x, y, 8, 2);
    }
  }
  return toTexture(c, { repeat: [3, 3] });
}

// Transparent side decal (drawn once per decal style and colour).
export function decalTexture(style, color = '#ffffff', accent = '#111111') {
  const W = 512, H = 192;
  const c = canvas(W, H);
  const g = c.getContext('2d');
  g.clearRect(0, 0, W, H);
  g.fillStyle = color;
  g.strokeStyle = color;
  switch (style) {
    case 'dec_number':
      g.beginPath(); g.arc(W / 2, H / 2, 70, 0, Math.PI * 2); g.fill();
      g.fillStyle = accent;
      g.font = '700 110px "Chakra Petch", sans-serif';
      g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText('7', W / 2, H / 2 + 6);
      break;
    case 'dec_bolt':
      g.beginPath();
      g.moveTo(40, 110); g.lineTo(230, 60); g.lineTo(220, 95); g.lineTo(470, 40);
      g.lineTo(290, 130); g.lineTo(300, 100); g.lineTo(60, 150); g.closePath(); g.fill();
      break;
    case 'dec_flames':
      for (let i = 0; i < 5; i++) {
        const y = 40 + i * 26;
        g.beginPath();
        g.moveTo(20, y + 20);
        g.quadraticCurveTo(200 + i * 30, y - 30, 340 + i * 25, y + 8);
        g.quadraticCurveTo(220, y + 10, 20, y + 34);
        g.fill();
      }
      break;
    case 'dec_checker':
      for (let y = 0; y < 4; y++) for (let x = 0; x < 16; x++) if ((x + y) % 2) g.fillRect(x * 32, 64 + y * 16, 32, 16);
      break;
    case 'dec_hex':
      g.lineWidth = 6;
      for (let i = 0; i < 7; i++) { hexPath(g, 60 + i * 64, H / 2 + (i % 2 ? 26 : -26), 30); g.stroke(); }
      break;
    case 'dec_tiger':
      for (let i = 0; i < 9; i++) {
        const x = 30 + i * 52;
        g.beginPath();
        g.moveTo(x, 20); g.quadraticCurveTo(x + 40, H / 2, x + 6, H - 20); g.lineTo(x + 20, H - 20);
        g.quadraticCurveTo(x + 55, H / 2, x + 18, 20); g.closePath(); g.fill();
      }
      break;
    default:
      break;
  }
  return toTexture(c);
}

export function screenTexture() {
  const c = canvas(512, 160);
  const tex = toTexture(c);
  return { canvas: c, tex };
}

export function cloudTexture() {
  const s = 256;
  const c = canvas(s, s);
  const g = c.getContext('2d');
  for (let i = 0; i < 14; i++) {
    const x = s * (0.25 + Math.random() * 0.5), y = s * (0.35 + Math.random() * 0.3), r = s * (0.12 + Math.random() * 0.14);
    const grd = g.createRadialGradient(x, y, 0, x, y, r);
    grd.addColorStop(0, 'rgba(255,255,255,0.85)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, s, s);
  }
  return toTexture(c);
}

export function windowsTexture(color = '#7fe9ff') {
  const W = 64, H = 128;
  const c = canvas(W, H);
  const g = c.getContext('2d');
  g.fillStyle = '#05060d';
  g.fillRect(0, 0, W, H);
  for (let y = 4; y < H; y += 8) {
    for (let x = 4; x < W; x += 8) {
      if (Math.random() < 0.42) {
        g.fillStyle = Math.random() < 0.8 ? color : '#ff5aa8';
        g.globalAlpha = 0.4 + Math.random() * 0.6;
        g.fillRect(x, y, 4, 4);
      }
    }
  }
  g.globalAlpha = 1;
  return toTexture(c, { repeat: [1, 1] });
}
