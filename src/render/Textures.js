import * as THREE from 'three';

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

// Scrolling LED ribbon (dot-matrix look) for the boards around the pitch.
export function ledTexture() {
  const W = 2048, H = 72;
  const c = canvas(W, H);
  const g = c.getContext('2d');
  g.fillStyle = '#04060c';
  g.fillRect(0, 0, W, H);
  const items = [
    ['NEON CAR ARENA', '#ffffff'], ['◆', '#ffb547'], ['NOVA', '#19e6ff'], ['◆', '#ffb547'], ['EMBER', '#ff2f7d'],
    ['◆', '#ffb547'], ['BOOST', '#ffb547'], ['◆', '#ffb547'], ['3 · 2 · 1 · GO', '#3dffa8'], ['◆', '#ffb547'],
  ];
  g.font = '700 italic 50px "Chakra Petch", "Arial Narrow", sans-serif';
  g.textBaseline = 'middle';
  const widths = items.map(([t]) => g.measureText(t).width + 48);
  const total = widths.reduce((a, b) => a + b, 0);
  let x = 24;
  const scale = W / total;
  g.save();
  g.scale(scale, 1);
  items.forEach(([t, col], i) => {
    g.fillStyle = col;
    g.shadowColor = col;
    g.shadowBlur = 12;
    g.fillText(t, x / 1, H / 2 + 3);
    x += widths[i];
  });
  g.restore();
  // Dot-matrix mask
  g.fillStyle = 'rgba(0,0,0,0.55)';
  for (let y = 0; y < H; y += 4) g.fillRect(0, y, W, 1);
  for (let xx = 0; xx < W; xx += 4) g.fillRect(xx, 0, 1, H);
  const t = toTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  return t;
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
