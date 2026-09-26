import * as THREE from 'three';

// Toutes les textures sont générées procéduralement (aucun fichier image à charger).
const cache = new Map();

export function canvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

export function canvasTexture(c, { repeat = false, srgb = true } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

export function cached(key, make) {
  if (!cache.has(key)) cache.set(key, make());
  return cache.get(key);
}

export function radialTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)', size = 128) {
  return cached(`radial:${inner}:${outer}:${size}`, () => {
    const c = canvas(size, size);
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grd.addColorStop(0, inner);
    grd.addColorStop(1, outer);
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
    return canvasTexture(c);
  });
}

export function gridTexture(color = '#ffffff', size = 128, line = 3, alpha = 1) {
  return cached(`grid:${color}:${size}:${line}:${alpha}`, () => {
    const c = canvas(size, size);
    const g = c.getContext('2d');
    g.globalAlpha = alpha;
    g.strokeStyle = color;
    g.lineWidth = line;
    g.strokeRect(0, 0, size, size);
    g.globalAlpha = alpha * 0.35;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(size / 2, 0); g.lineTo(size / 2, size);
    g.moveTo(0, size / 2); g.lineTo(size, size / 2);
    g.stroke();
    return canvasTexture(c, { repeat: true });
  });
}

export function hexPattern(g, w, h, r, stroke, lw = 1) {
  g.strokeStyle = stroke;
  g.lineWidth = lw;
  const dx = r * Math.sqrt(3), dy = r * 1.5;
  for (let row = -1, y = 0; y < h + r * 2; row++, y = row * dy) {
    for (let x = (row % 2) * dx / 2 - dx; x < w + dx; x += dx) {
      g.beginPath();
      for (let k = 0; k < 6; k++) {
        const a = Math.PI / 3 * k + Math.PI / 6;
        const px = x + r * Math.cos(a), py = y + r * Math.sin(a);
        k ? g.lineTo(px, py) : g.moveTo(px, py);
      }
      g.closePath();
      g.stroke();
    }
  }
}

export function textTexture(text, { w = 256, h = 64, color = '#fff', font = 'bold 34px sans-serif', bg = null } = {}) {
  const c = canvas(w, h);
  const g = c.getContext('2d');
  if (bg) { g.fillStyle = bg; g.fillRect(0, 0, w, h); }
  g.font = font;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.lineWidth = 6;
  g.strokeStyle = 'rgba(0,0,0,0.7)';
  g.strokeText(text, w / 2, h / 2);
  g.fillStyle = color;
  g.fillText(text, w / 2, h / 2);
  return canvasTexture(c);
}
