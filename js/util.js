/* Teyvat Pixel — utilitaires communs (maths, RNG, bruit, couleurs, canvas) */
(function () {
  const G = (window.G = window.G || {});
  G.TS = 16;

  G.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  G.lerp = (a, b, t) => a + (b - a) * t;
  G.dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);
  G.rand = (a, b) => a + Math.random() * (b - a);
  G.irand = (a, b) => Math.floor(a + Math.random() * (b - a + 1));
  G.pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  G.angDiff = (a, b) => {
    let d = (b - a) % (Math.PI * 2);
    if (d > Math.PI) d -= Math.PI * 2;
    if (d < -Math.PI) d += Math.PI * 2;
    return d;
  };

  // Générateur pseudo-aléatoire déterministe (mulberry32)
  G.rng = function (seed) {
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };

  // Hash 2D -> [0,1)
  G.hash2 = function (x, y, s) {
    let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(s | 0, 2147483647)) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };

  // Bruit de valeur lissé + fBm
  function smooth(t) { return t * t * (3 - 2 * t); }
  G.vnoise = function (x, y, s) {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = smooth(x - xi), yf = smooth(y - yi);
    const a = G.hash2(xi, yi, s), b = G.hash2(xi + 1, yi, s);
    const c = G.hash2(xi, yi + 1, s), d = G.hash2(xi + 1, yi + 1, s);
    return G.lerp(G.lerp(a, b, xf), G.lerp(c, d, xf), yf);
  };
  G.fbm = function (x, y, s, oct) {
    let v = 0, amp = 0.5, f = 1, tot = 0;
    for (let i = 0; i < (oct || 4); i++) {
      v += G.vnoise(x * f, y * f, s + i * 17) * amp;
      tot += amp; amp *= 0.5; f *= 2;
    }
    return v / tot;
  };

  // Couleurs
  G.hexToRgb = (h) => {
    h = h.replace('#', '');
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  G.rgb = (r, g, b) => '#' + [r, g, b].map((v) => G.clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')).join('');
  // amt > 0 éclaircit vers blanc, < 0 assombrit vers noir
  G.shade = (hex, amt) => {
    const c = G.hexToRgb(hex);
    return G.rgb(...c.map((v) => (amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))));
  };
  G.mix = (a, b, t) => {
    const A = G.hexToRgb(a), B = G.hexToRgb(b);
    return G.rgb(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
  };

  // Canvas hors-écran avec contexte pixel
  G.canvas = (w, h) => {
    const c = document.createElement('canvas');
    c.width = Math.max(1, Math.ceil(w));
    c.height = Math.max(1, Math.ceil(h));
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    c.ctx = ctx;
    return c;
  };

  // Sprite depuis une fonction de dessin
  G.makeSprite = (w, h, fn) => {
    const c = G.canvas(w, h);
    fn(c.ctx, c);
    return c;
  };

  // Retourne un canvas retourné horizontalement
  G.flipX = (src) => {
    const c = G.canvas(src.width, src.height);
    c.ctx.translate(src.width, 0);
    c.ctx.scale(-1, 1);
    c.ctx.drawImage(src, 0, 0);
    return c;
  };

  // Ajoute un contour 1px autour des pixels opaques (style pixel-art)
  G.outline = (src, color, pad) => {
    pad = pad == null ? 1 : pad;
    const w = src.width + pad * 2, h = src.height + pad * 2;
    const out = G.canvas(w, h);
    const sctx = src.getContext('2d');
    const sd = sctx.getImageData(0, 0, src.width, src.height).data;
    const od = out.ctx.createImageData(w, h);
    const o = od.data;
    const rgb = G.hexToRgb(color);
    const alphaAt = (x, y) => (x < 0 || y < 0 || x >= src.width || y >= src.height ? 0 : sd[(y * src.width + x) * 4 + 3]);
    for (let y = -pad; y < src.height + pad; y++) {
      for (let x = -pad; x < src.width + pad; x++) {
        const a = alphaAt(x, y);
        const oi = ((y + pad) * w + (x + pad)) * 4;
        if (a > 40) {
          const si = (y * src.width + x) * 4;
          o[oi] = sd[si]; o[oi + 1] = sd[si + 1]; o[oi + 2] = sd[si + 2]; o[oi + 3] = 255;
        } else if (alphaAt(x - 1, y) > 40 || alphaAt(x + 1, y) > 40 || alphaAt(x, y - 1) > 40 || alphaAt(x, y + 1) > 40) {
          o[oi] = rgb[0]; o[oi + 1] = rgb[1]; o[oi + 2] = rgb[2]; o[oi + 3] = 255;
        }
      }
    }
    out.ctx.putImageData(od, 0, 0);
    return out;
  };

  // Teinte tous les pixels opaques d'une couleur (flash de dégâts)
  G.tint = (src, color) => {
    const c = G.canvas(src.width, src.height);
    c.ctx.drawImage(src, 0, 0);
    c.ctx.globalCompositeOperation = 'source-atop';
    c.ctx.fillStyle = color;
    c.ctx.fillRect(0, 0, c.width, c.height);
    return c;
  };

  // Sprite de cercle pixel parfait (plein et/ou anneau)
  G.circleSprite = (r, fill, stroke, strokeW) => {
    const d = r * 2 + 1;
    const c = G.canvas(d, d);
    const ctx = c.ctx;
    const sw = strokeW || 1;
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        const dd = Math.sqrt(x * x + y * y);
        if (dd <= r + 0.35) {
          if (stroke && dd > r - sw + 0.35) ctx.fillStyle = stroke;
          else if (fill) ctx.fillStyle = fill;
          else continue;
          ctx.fillRect(x + r, y + r, 1, 1);
        }
      }
    }
    return c;
  };

  G.fmt = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  G.fmtT = (s) => {
    const m = Math.floor(s / 60), sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  };
})();
