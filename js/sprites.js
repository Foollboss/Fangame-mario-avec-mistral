/* Teyvat Pixel — sprites pixel-art générés par code (aucun asset externe) */
(function () {
  const G = window.G;
  const S = (G.S = {});

  // Palette globale
  const P = (G.P = {
    grass: ['#6dbb4c', '#62b046', '#58a540', '#7cc656'],
    grassD: '#4a9a38', grassL: '#93d968', deep: '#3d8a34',
    dirt: ['#cfa96c', '#c49f62', '#b9945a'], dirtD: '#a47f4a', dirtL: '#dfc088',
    slab: ['#cbc3a2', '#c2ba98', '#d4cdae', '#bdb592'], slabD: '#8c8567', slabL: '#e3dcc0', moss: '#7fb257',
    cliff: ['#8d8977', '#807c6b', '#9a9684'], cliffD: '#56534a', cliffL: '#b0ab96', cliffTop: '#c3bea8',
    water: ['#3da9e3', '#339bd8', '#46b3ea'], waterD: '#2677bc', waterL: '#86d3f6', foam: '#e2f6ff', shallow: '#6fcaee',
    sand: ['#ecd89e', '#e3cd90', '#f1e1ac'], sandD: '#cdb676',
    cobble: ['#bdb7a8', '#b0aa9b', '#c8c2b3'], cobbleD: '#8b8576', cobbleL: '#dad5c6',
    wall: '#f1e8d3', wallD: '#d8c9a8', timber: '#8a5a36', timberD: '#6a4226', roof: '#d9473b', roofD: '#b03030', roofL: '#f26c56',
    trunk: '#7d5532', trunkD: '#5a3b22', leaf: ['#55ab45', '#469b3b', '#378a33'], leafL: '#7fcb5c', leafD: '#2b7230',
    ink: '#2a2a3c', white: '#ffffff', shadow: 'rgba(30,40,60,0.28)',
  });

  const pxr = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
  const disc = (ctx, cx, cy, r, c) => {
    ctx.fillStyle = c;
    for (let y = -r; y <= r; y++) {
      const hw = Math.floor(Math.sqrt(r * r - y * y) + 0.3);
      ctx.fillRect(cx - hw, cy + y, hw * 2 + 1, 1);
    }
  };
  const ell = (ctx, cx, cy, rx, ry, c) => {
    ctx.fillStyle = c;
    for (let y = -ry; y <= ry; y++) {
      const hw = Math.floor(rx * Math.sqrt(1 - (y * y) / (ry * ry + 0.01)) + 0.3);
      ctx.fillRect(cx - hw, cy + y, hw * 2 + 1, 1);
    }
  };
  S.disc = disc; S.ell = ell; S.pxr = pxr;

  // Dessine un sprite ASCII : rows = tableau de chaînes, pal = { char: couleur }
  S.ascii = function (rows, pal, scale) {
    scale = scale || 1;
    const h = rows.length, w = Math.max.apply(null, rows.map((r) => r.length));
    const c = G.canvas(w * scale, h * scale);
    rows.forEach((row, y) => {
      for (let x = 0; x < row.length; x++) {
        const ch = row[x];
        if (ch === '.' || ch === ' ' || !pal[ch]) continue;
        c.ctx.fillStyle = pal[ch];
        c.ctx.fillRect(x * scale, y * scale, scale, scale);
      }
    });
    return c;
  };

  // =====================================================================
  //   TERRAIN (rendu par pixel dans world.js ; ici : types et couleurs)
  // =====================================================================
  S.T = { GRASS: 0, DIRT: 1, STONE: 2, CLIFF: 3, WATER: 4, SAND: 5, COBBLE: 6, DEEP: 7, FOREST: 8, BRIDGE: 9, WALL: 10, FLOOR: 11 };

  // =====================================================================
  //   ARBRES, ROCHERS, DÉCORS
  // =====================================================================
  S.tree = function (variant) {
    const r = G.rng(100 + variant);
    const c = G.canvas(44, 54);
    const ctx = c.ctx;
    // tronc
    pxr(ctx, 19, 34, 7, 16, P.trunk);
    pxr(ctx, 19, 34, 2, 16, P.trunkD);
    pxr(ctx, 16, 47, 13, 3, P.trunk);
    pxr(ctx, 16, 49, 13, 1, P.trunkD);
    // canopée : plusieurs disques superposés
    const blobs = [[22, 22, 15], [12, 28, 10], [32, 28, 10], [22, 12, 11], [14, 18, 9], [30, 18, 9]];
    blobs.forEach((b, i) => disc(ctx, b[0], b[1] + 1, b[2], P.leaf[2]));
    blobs.forEach((b, i) => disc(ctx, b[0] - 1, b[1] - 1, b[2] - 2, P.leaf[1]));
    blobs.forEach((b, i) => disc(ctx, b[0] - 2, b[1] - 3, Math.max(3, b[2] - 5), P.leaf[0]));
    for (let i = 0; i < 26; i++) {
      const x = 6 + Math.floor(r() * 32), y = 4 + Math.floor(r() * 26);
      const px = ctx.getImageData(x, y, 1, 1).data;
      if (px[3] === 0) continue;
      pxr(ctx, x, y, 2, 1, r() < 0.5 ? P.leafL : P.leafD);
    }
    return G.outline(c, '#1d3b27');
  };
  S.pine = function (variant) {
    const c = G.canvas(30, 56);
    const ctx = c.ctx;
    pxr(ctx, 13, 46, 4, 8, P.trunk);
    const tiers = [[15, 8, 5], [15, 16, 8], [15, 25, 11], [15, 35, 13]];
    tiers.forEach((t, i) => {
      for (let y = 0; y < 12; y++) {
        const hw = Math.min(t[2], 1 + Math.floor((y / 12) * (t[2] + 1)));
        const yy = t[1] + y - 6;
        ctx.fillStyle = y > 8 ? '#276a2f' : '#2f7d36';
        ctx.fillRect(t[0] - hw, yy, hw * 2 + 1, 1);
        ctx.fillStyle = '#4aa24a';
        ctx.fillRect(t[0] - hw + 1, yy, Math.max(1, Math.floor(hw / 2)), 1);
      }
    });
    return G.outline(c, '#173222');
  };
  S.bush = function (v) {
    const c = G.canvas(18, 14);
    const ctx = c.ctx;
    ell(ctx, 9, 8, 7, 5, P.leaf[2]);
    ell(ctx, 8, 7, 6, 4, P.leaf[1]);
    ell(ctx, 7, 5, 4, 3, P.leaf[0]);
    pxr(ctx, 5, 4, 2, 1, P.leafL); pxr(ctx, 11, 7, 2, 1, P.leafL);
    if (v === 1) { pxr(ctx, 10, 5, 2, 2, '#f3e4f0'); pxr(ctx, 6, 8, 2, 2, '#f7b6c8'); }
    return G.outline(c, '#1d3b27');
  };
  S.rock = function (v) {
    const c = G.canvas(v ? 26 : 18, v ? 20 : 14);
    const ctx = c.ctx;
    const w = c.width, h = c.height;
    ell(ctx, w / 2, h - 6, w / 2 - 2, h / 2 - 2, P.cliff[1]);
    ell(ctx, w / 2 - 1, h - 8, w / 2 - 4, h / 2 - 4, P.cliff[2]);
    pxr(ctx, 4, h - 7, 3, 1, P.cliffL);
    pxr(ctx, w - 8, h - 5, 4, 1, P.cliffD);
    pxr(ctx, 6, h - 10, 4, 1, P.cliffL);
    return G.outline(c, '#33322c');
  };
  S.pillar = function (broken) {
    const h = broken ? 26 : 40;
    const c = G.canvas(18, h + 4);
    const ctx = c.ctx;
    pxr(ctx, 2, h - 2, 14, 4, P.cliff[1]);
    pxr(ctx, 2, h - 2, 14, 1, P.cliffL);
    pxr(ctx, 4, 4, 10, h - 6, P.cliff[2]);
    pxr(ctx, 4, 4, 3, h - 6, P.cliffL);
    pxr(ctx, 11, 4, 3, h - 6, P.cliff[0]);
    pxr(ctx, 7, 6, 1, h - 10, P.cliff[1]);
    if (!broken) {
      pxr(ctx, 2, 2, 14, 4, P.cliff[1]);
      pxr(ctx, 2, 2, 14, 1, P.cliffL);
    } else {
      pxr(ctx, 4, 4, 4, 2, 'rgba(0,0,0,0)');
      ctx.clearRect(4, 4, 3, 2); ctx.clearRect(10, 4, 4, 3);
      pxr(ctx, 7, 7, 3, 1, P.moss); pxr(ctx, 4, h - 6, 4, 2, P.moss);
    }
    return G.outline(c, '#33322c');
  };
  S.fence = function () {
    const c = G.canvas(16, 12);
    const ctx = c.ctx;
    pxr(ctx, 1, 2, 3, 9, P.timber); pxr(ctx, 12, 2, 3, 9, P.timber);
    pxr(ctx, 0, 4, 16, 2, '#a67245'); pxr(ctx, 0, 8, 16, 2, '#a67245');
    return G.outline(c, '#3a2515');
  };
  S.barrel = function () {
    const c = G.canvas(12, 14);
    const ctx = c.ctx;
    ell(ctx, 6, 7, 5, 6, '#9b6a3c');
    pxr(ctx, 1, 4, 10, 1, '#5a3b22'); pxr(ctx, 1, 9, 10, 1, '#5a3b22');
    pxr(ctx, 3, 3, 2, 8, '#b98550');
    return G.outline(c, '#3a2515');
  };
  S.crate = function () {
    const c = G.canvas(14, 14);
    const ctx = c.ctx;
    pxr(ctx, 1, 2, 12, 11, '#b98550'); pxr(ctx, 1, 2, 12, 2, '#d3a26a');
    pxr(ctx, 1, 2, 2, 11, '#8a5a36'); pxr(ctx, 11, 2, 2, 11, '#8a5a36');
    pxr(ctx, 6, 3, 2, 10, '#8a5a36');
    return G.outline(c, '#3a2515');
  };
  S.signpost = function () {
    const c = G.canvas(18, 24);
    const ctx = c.ctx;
    pxr(ctx, 8, 6, 3, 17, P.timber);
    pxr(ctx, 1, 3, 15, 6, '#c9985c'); pxr(ctx, 1, 3, 15, 1, '#e0b878');
    pxr(ctx, 3, 5, 9, 1, '#7a4e2a'); pxr(ctx, 3, 7, 6, 1, '#7a4e2a');
    return G.outline(c, '#3a2515');
  };
  S.lamp = function () {
    const c = G.canvas(10, 30);
    const ctx = c.ctx;
    pxr(ctx, 4, 8, 2, 20, '#4a4a58');
    pxr(ctx, 2, 3, 6, 6, '#f6e19a'); pxr(ctx, 3, 4, 4, 4, '#fff6c8');
    pxr(ctx, 1, 2, 8, 2, '#4a4a58');
    return G.outline(c, '#23232e');
  };
  S.flowerDecal = function (kind) {
    const cols = [['#ffffff', '#f4e46a'], ['#f7a6c4', '#fff2a0'], ['#a7c8ff', '#ffffff'], ['#ffe27a', '#ffb347']];
    const c = G.canvas(7, 7);
    const ctx = c.ctx;
    const [a, b] = cols[kind % cols.length];
    pxr(ctx, 3, 3, 1, 4, '#4a9a38');
    pxr(ctx, 2, 2, 1, 1, a); pxr(ctx, 4, 2, 1, 1, a); pxr(ctx, 3, 1, 1, 1, a); pxr(ctx, 3, 3, 1, 1, a);
    pxr(ctx, 3, 2, 1, 1, b);
    return c;
  };
  S.tuft = function () {
    const c = G.canvas(7, 6);
    const ctx = c.ctx;
    pxr(ctx, 1, 2, 1, 4, P.grassD); pxr(ctx, 3, 0, 1, 6, P.grassD); pxr(ctx, 5, 2, 1, 4, P.grassD);
    pxr(ctx, 2, 3, 1, 3, P.grassL); pxr(ctx, 4, 2, 1, 4, P.grassL);
    return c;
  };

  // =====================================================================
  //   BÂTIMENTS
  // =====================================================================
  // w,h en tuiles ; type : 'house' | 'tavern' | 'cathedral' | 'tower'
  S.house = function (tw, th, roofCol, seed) {
    const r = G.rng(seed || 7);
    const W = tw * 16, H = th * 16 + 14;
    const c = G.canvas(W, H);
    const ctx = c.ctx;
    const roofH = Math.floor(th * 16 * 0.6) + 8;
    const wallTop = roofH - 6;
    const rc = roofCol || P.roof;
    const rd = G.shade(rc, -0.25), rl = G.shade(rc, 0.25);
    // murs
    pxr(ctx, 2, wallTop, W - 4, H - wallTop - 2, P.wall);
    pxr(ctx, 2, wallTop, W - 4, 2, P.wallD);
    pxr(ctx, 2, H - 6, W - 4, 4, P.wallD);
    // colombages
    for (let x = 4; x < W - 4; x += 12) pxr(ctx, x, wallTop + 2, 2, H - wallTop - 8, P.timber);
    pxr(ctx, 2, wallTop + 2, W - 4, 2, P.timber);
    // fenêtres
    for (let x = 8; x < W - 14; x += 24) {
      pxr(ctx, x, wallTop + 8, 8, 8, P.timberD);
      pxr(ctx, x + 1, wallTop + 9, 6, 6, '#8fd0ee');
      pxr(ctx, x + 1, wallTop + 9, 6, 2, '#bfe8fa');
      pxr(ctx, x + 3, wallTop + 9, 1, 6, P.timberD);
    }
    // porte
    const dx = Math.floor(W / 2) - 4;
    pxr(ctx, dx, H - 16, 9, 14, P.timberD);
    pxr(ctx, dx + 1, H - 15, 7, 13, '#a26a3a');
    pxr(ctx, dx + 6, H - 9, 1, 2, '#f0d070');
    // toit en pente (tuiles)
    for (let y = 0; y < roofH; y++) {
      const inset = Math.floor((1 - y / roofH) * Math.min(W * 0.3, 16));
      const row = y % 6 < 3 ? rc : rd;
      pxr(ctx, inset, y, W - inset * 2, 1, row);
      for (let x = inset + (y % 6 < 3 ? 0 : 3); x < W - inset; x += 6) pxr(ctx, x, y, 1, 1, rl);
    }
    pxr(ctx, 0, roofH - 2, W, 4, rd);
    pxr(ctx, 0, roofH - 2, W, 1, rl);
    // cheminée
    pxr(ctx, W - 14, 0, 6, 9, '#a89c88'); pxr(ctx, W - 15, 0, 8, 2, '#8a7e6c');
    return G.outline(c, '#3a1d1a');
  };
  S.windmill = function (frame) {
    const c = G.canvas(80, 100);
    const ctx = c.ctx;
    // tour
    for (let y = 0; y < 62; y++) {
      const hw = 12 + Math.floor((y / 62) * 8);
      pxr(ctx, 40 - hw, 34 + y, hw * 2, 1, y % 8 < 1 ? '#c9b890' : P.wall);
      pxr(ctx, 40 - hw, 34 + y, 4, 1, P.wallD);
    }
    // toit
    for (let y = 0; y < 14; y++) { const hw = 14 - y; pxr(ctx, 40 - hw, 22 + y, hw * 2, 1, y % 4 < 2 ? P.roof : P.roofD); }
    // porte et fenêtre
    pxr(ctx, 35, 82, 10, 14, P.timberD); pxr(ctx, 36, 83, 8, 13, '#a26a3a');
    pxr(ctx, 37, 54, 6, 7, P.timberD); pxr(ctx, 38, 55, 4, 5, '#8fd0ee');
    pxr(ctx, 30, 94, 20, 5, P.cobbleD);
    const out = G.outline(c, '#3a1d1a');
    const full = G.canvas(out.width + 40, out.height + 40);
    full.ctx.drawImage(out, 20, 20);
    // pales
    const fx = full.ctx;
    const cx = 62, cy = 54;
    const a0 = frame * 0.18;
    for (let k = 0; k < 4; k++) {
      const a = a0 + (k * Math.PI) / 2;
      for (let t = 4; t < 36; t++) {
        const x = Math.round(cx + Math.cos(a) * t), y = Math.round(cy + Math.sin(a) * t);
        pxr(fx, x, y, 2, 2, '#5a3b22');
        if (t > 12) {
          const nx = -Math.sin(a), ny = Math.cos(a);
          for (let w = 1; w < 6; w++) {
            const px = Math.round(x + nx * w), py = Math.round(y + ny * w);
            pxr(fx, px, py, 1, 1, w === 5 ? '#e8dcc0' : '#f6ecd4');
          }
        }
      }
    }
    disc(fx, cx, cy, 3, '#8a5a36');
    return full;
  };
  S.cathedral = function () {
    const c = G.canvas(112, 120);
    const ctx = c.ctx;
    // nef
    pxr(ctx, 20, 52, 72, 64, '#f4f1ea');
    pxr(ctx, 20, 52, 72, 3, '#cfcab8');
    for (let x = 26; x < 88; x += 14) { pxr(ctx, x, 64, 6, 18, '#5a74c8'); pxr(ctx, x + 1, 62, 4, 2, '#5a74c8'); pxr(ctx, x + 1, 66, 4, 14, '#7a96e8'); }
    // toit bleu
    for (let y = 0; y < 22; y++) { const inset = Math.floor((1 - y / 22) * 22); pxr(ctx, 14 + inset, 32 + y, 84 - inset * 2, 1, y % 5 < 3 ? '#3f68c8' : '#2f4fa0'); }
    // tour centrale
    pxr(ctx, 44, 8, 24, 44, '#f4f1ea'); pxr(ctx, 44, 8, 4, 44, '#cfcab8');
    for (let y = 0; y < 18; y++) { const hw = Math.floor(14 * (1 - y / 18)); pxr(ctx, 56 - hw, y, hw * 2, 1, y % 5 < 3 ? '#3f68c8' : '#2f4fa0'); }
    pxr(ctx, 54, 18, 4, 14, '#5a74c8');
    pxr(ctx, 54, 0, 4, 6, '#f6d65a');
    // rosace + porte
    disc(ctx, 56, 36, 6, '#e8c24a'); disc(ctx, 56, 36, 4, '#8fd0ee');
    pxr(ctx, 48, 96, 16, 20, '#4a3a5a'); pxr(ctx, 50, 98, 12, 18, '#6a5080');
    // marches
    pxr(ctx, 40, 114, 32, 4, '#cfcab8'); pxr(ctx, 36, 117, 40, 3, '#b0aa98');
    return G.outline(c, '#2a2840');
  };
  S.wallBlock = function () {
    const c = G.canvas(16, 26);
    const ctx = c.ctx;
    pxr(ctx, 0, 6, 16, 20, '#c9c3b3');
    for (let y = 8; y < 26; y += 6) { pxr(ctx, 0, y, 16, 1, '#a39d8c'); }
    for (let y = 6, row = 0; y < 26; y += 6, row++) for (let x = (row % 2) * 4; x < 16; x += 8) pxr(ctx, x, y, 1, 6, '#a39d8c');
    pxr(ctx, 0, 6, 16, 2, '#dfd9c9');
    // créneaux
    pxr(ctx, 0, 0, 5, 7, '#c9c3b3'); pxr(ctx, 0, 0, 5, 2, '#dfd9c9');
    pxr(ctx, 8, 0, 5, 7, '#c9c3b3'); pxr(ctx, 8, 0, 5, 2, '#dfd9c9');
    return c;
  };
  S.tent = function () {
    const c = G.canvas(40, 34);
    const ctx = c.ctx;
    for (let y = 0; y < 28; y++) { const hw = Math.floor(2 + (y / 28) * 17); pxr(ctx, 20 - hw, 2 + y, hw * 2, 1, y % 6 < 3 ? '#a37a4a' : '#8e6840'); }
    pxr(ctx, 15, 16, 10, 14, '#2a1d14');
    pxr(ctx, 19, 0, 2, 5, '#6a4a2a'); pxr(ctx, 21, 0, 6, 3, '#d9483a');
    // fourrure
    for (let x = 4; x < 36; x += 4) pxr(ctx, x, 29, 3, 3, '#e8e0d0');
    return G.outline(c, '#2a1d14');
  };
  S.campfire = function (f) {
    const c = G.canvas(16, 20);
    const ctx = c.ctx;
    pxr(ctx, 2, 14, 12, 3, '#6a4a2a'); pxr(ctx, 4, 12, 8, 3, '#7a5a34');
    const h = 6 + (f % 3);
    for (let y = 0; y < h; y++) {
      const w = Math.max(1, 6 - Math.floor(y * 0.7));
      pxr(ctx, 8 - w + ((f + y) % 2), 12 - y, w * 2, 1, y < 2 ? '#ffe27a' : y < 4 ? '#ffa94a' : '#ff6a2a');
    }
    return G.outline(c, '#2a1d14');
  };

  // =====================================================================
  //   STATUE DES SEPT, WAYPOINT, COFFRES, COURS DES SEELIES
  // =====================================================================
  S.statue = function (lit) {
    const c = G.canvas(48, 80);
    const ctx = c.ctx;
    const body = '#3d4666', bodyL = '#5d6a98', bodyD = '#272d48', gold = '#e0b455';
    // socle circulaire à runes
    ell(ctx, 24, 72, 21, 7, '#8d8977'); ell(ctx, 24, 70, 19, 6, '#b3ae98'); ell(ctx, 24, 70, 15, 4, '#6d7396');
    if (lit) { ell(ctx, 24, 70, 13, 3, '#6ad0ff'); ell(ctx, 24, 70, 8, 2, '#c8f0ff'); }
    for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.2832; pxr(ctx, 24 + Math.round(Math.cos(a) * 16), 70 + Math.round(Math.sin(a) * 4.5), 2, 1, lit ? '#e8faff' : '#8a90ae'); }
    // base du pilier
    pxr(ctx, 17, 60, 14, 9, body); pxr(ctx, 17, 60, 4, 9, bodyL); pxr(ctx, 28, 60, 3, 9, bodyD);
    pxr(ctx, 15, 58, 18, 3, bodyL); pxr(ctx, 15, 60, 18, 1, bodyD);
    // fût élancé
    for (let y = 0; y < 34; y++) {
      const hw = 3 + Math.round(1.6 * Math.cos((y / 34) * Math.PI * 2));
      pxr(ctx, 24 - hw, 26 + y, hw * 2, 1, body);
      pxr(ctx, 24 - hw, 26 + y, 2, 1, bodyL);
      pxr(ctx, 24 + hw - 1, 26 + y, 1, 1, bodyD);
    }
    pxr(ctx, 21, 40, 6, 1, gold); pxr(ctx, 21, 50, 6, 1, gold);
    // coupe en tulipe
    for (let y = 0; y < 20; y++) {
      const t = y / 19;
      const hw = Math.round(14 - 9 * Math.pow(t, 0.8) + (y < 3 ? 0 : 0));
      pxr(ctx, 24 - hw, 8 + y, hw * 2, 1, y < 2 ? bodyL : body);
      pxr(ctx, 24 - hw, 8 + y, 3, 1, bodyL);
      pxr(ctx, 24 + hw - 2, 8 + y, 2, 1, bodyD);
    }
    // pétales (pointes)
    [[-13, 0], [-7, -3], [0, -5], [7, -3], [13, 0]].forEach((p, i) => {
      for (let k = 0; k < 6; k++) pxr(ctx, 24 + p[0] - Math.max(0, 2 - Math.floor(k / 2)) + (i === 2 ? 0 : 0), 8 + p[1] - k, Math.max(1, 4 - Math.floor(k / 2)), 1, i === 2 ? bodyL : body);
    });
    pxr(ctx, 10, 8, 28, 2, gold); pxr(ctx, 10, 8, 28, 1, '#fff0b0');
    pxr(ctx, 20, 27, 8, 2, gold);
    // flamme / orbe
    if (lit) {
      ell(ctx, 24, 5, 4, 7, '#ffd36a'); ell(ctx, 24, 6, 3, 5, '#fff2b8'); ell(ctx, 24, 7, 1, 3, '#ffffff');
    } else {
      ell(ctx, 24, 6, 3, 4, '#7a7f99');
    }
    return G.outline(c, '#1c1e2e');
  };
  S.waypoint = function (lit) {
    const c = G.canvas(24, 44);
    const ctx = c.ctx;
    ell(ctx, 12, 38, 10, 4, '#5a6080'); ell(ctx, 12, 37, 8, 3, '#7a82a8');
    for (let y = 0; y < 30; y++) {
      const hw = Math.max(1, 5 - Math.floor(Math.abs(y - 14) / 3));
      pxr(ctx, 12 - hw, 5 + y, hw * 2, 1, lit ? '#4aa8f0' : '#5d6486');
      pxr(ctx, 12 - hw, 5 + y, 2, 1, lit ? '#9ee0ff' : '#8a90ae');
    }
    pxr(ctx, 11, 0, 2, 6, lit ? '#d8f4ff' : '#9aa0bd');
    return G.outline(c, '#1c1e2e');
  };
  S.chest = function (tier, open) {
    const cols = [['#a26a3a', '#c8955a', '#6a4226', '#e0c060'], ['#4a68b8', '#7a9ae0', '#2c428a', '#dfe6f4'], ['#c89a2a', '#f2cf5a', '#8a6414', '#fff0a0'], ['#8a4ab0', '#bb7ae0', '#5a2e80', '#ffe27a']][tier];
    const c = G.canvas(18, 16);
    const ctx = c.ctx;
    pxr(ctx, 1, 7, 16, 8, cols[0]); pxr(ctx, 1, 7, 16, 2, cols[1]); pxr(ctx, 1, 13, 16, 2, cols[2]);
    if (!open) {
      pxr(ctx, 1, 2, 16, 6, cols[0]); pxr(ctx, 2, 1, 14, 2, cols[1]); pxr(ctx, 1, 2, 2, 6, cols[2]); pxr(ctx, 15, 2, 2, 6, cols[2]);
      pxr(ctx, 8, 6, 3, 4, cols[3]);
    } else {
      pxr(ctx, 2, 0, 14, 3, cols[1]); pxr(ctx, 1, 2, 16, 2, cols[2]);
      pxr(ctx, 3, 6, 12, 2, '#ffe9a0');
    }
    return G.outline(c, '#2a1d14');
  };
  S.seelieCourt = function () {
    const c = G.canvas(34, 20);
    const ctx = c.ctx;
    ell(ctx, 17, 11, 15, 7, '#7a6fb0'); ell(ctx, 17, 10, 13, 6, '#a898e0');
    ell(ctx, 17, 10, 8, 3, '#d2c8ff');
    for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; pxr(ctx, 17 + Math.round(Math.cos(a) * 11), 10 + Math.round(Math.sin(a) * 4.5), 2, 1, '#fff'); }
    return c;
  };
  S.domainGate = function () {
    const c = G.canvas(56, 60);
    const ctx = c.ctx;
    pxr(ctx, 2, 14, 12, 44, '#8d8977'); pxr(ctx, 42, 14, 12, 44, '#8d8977');
    pxr(ctx, 2, 14, 4, 44, '#b0ab96'); pxr(ctx, 42, 14, 4, 44, '#b0ab96');
    pxr(ctx, 0, 6, 56, 10, '#9a9684'); pxr(ctx, 0, 6, 56, 2, '#c3bea8');
    pxr(ctx, 6, 16, 44, 40, '#201a38');
    for (let y = 0; y < 40; y++) { pxr(ctx, 6, 16 + y, 44, 1, y % 6 < 3 ? '#2a2250' : '#201a38'); }
    ell(ctx, 28, 34, 10, 14, '#7a5ae0'); ell(ctx, 28, 34, 7, 10, '#b9a0ff'); ell(ctx, 28, 34, 3, 6, '#f0e8ff');
    pxr(ctx, 24, 0, 8, 8, '#e8c24a'); pxr(ctx, 26, 2, 4, 4, '#7a5ae0');
    return G.outline(c, '#1c1e2e');
  };
  S.anemoculus = function (f) {
    const c = G.canvas(14, 14);
    const ctx = c.ctx;
    disc(ctx, 7, 7, 5, '#3fcf9e'); disc(ctx, 7, 7, 4, '#7af0c4'); disc(ctx, 7, 7, 2, '#d6fff0');
    pxr(ctx, 7 + (f % 2), 1, 1, 2, '#d6fff0'); pxr(ctx, 7 - (f % 2), 11, 1, 2, '#d6fff0');
    return c;
  };

  // Seelie : esprit violet flottant (comme dans la capture)
  S.seelie = function (f) {
    const c = G.canvas(18, 20);
    const ctx = c.ctx;
    ell(ctx, 9, 11, 6, 6, '#6a4ccf'); ell(ctx, 9, 10, 5, 5, '#8a6ae8');
    ell(ctx, 7, 8, 2, 2, '#b9a2ff');
    // oreilles
    pxr(ctx, 3, 2 - (f % 2), 3, 6, '#6a4ccf'); pxr(ctx, 12, 2 - (f % 2), 3, 6, '#6a4ccf');
    pxr(ctx, 4, 3 - (f % 2), 1, 3, '#b9a2ff'); pxr(ctx, 13, 3 - (f % 2), 1, 3, '#b9a2ff');
    // symbole
    pxr(ctx, 7, 11, 4, 1, '#ffe9a0'); pxr(ctx, 8, 10, 2, 3, '#ffe9a0');
    pxr(ctx, 6, 7, 1, 1, '#fff'); pxr(ctx, 11, 7, 1, 1, '#fff');
    return G.outline(c, '#2a1f66');
  };

  // Paimon (compagne flottante)
  S.paimon = function (f) {
    const c = G.canvas(18, 22);
    const ctx = c.ctx;
    const y = f % 2;
    // cape étoilée
    pxr(ctx, 4, 12 + y, 10, 7, '#3b4a9a'); pxr(ctx, 5, 12 + y, 8, 3, '#e9f0ff');
    pxr(ctx, 6, 17 + y, 6, 2, '#f6d65a');
    // tête
    ell(ctx, 9, 8 + y, 6, 6, '#f6f7ff');
    pxr(ctx, 4, 6 + y, 10, 3, '#f1e9d6');
    pxr(ctx, 6, 9 + y, 2, 2, '#4a62d0'); pxr(ctx, 11, 9 + y, 2, 2, '#4a62d0');
    pxr(ctx, 8, 12 + y, 3, 1, '#c85a5a');
    // couronne
    pxr(ctx, 7, 1 + y, 5, 2, '#f6d65a'); pxr(ctx, 9, 0 + y, 1, 1, '#f6d65a');
    // bras/pieds
    pxr(ctx, 2, 13 + y, 2, 3, '#f6f7ff'); pxr(ctx, 14, 13 + y, 2, 3, '#f6f7ff');
    return G.outline(c, '#232a5a');
  };

  // =====================================================================
  //   PERSONNAGES (poupée procédurale)
  // =====================================================================
  const CW = 24, CH = 32;
  // dir : 'd','u','l' ; frame : 0 idle, 1/2 marche ; atk : 0..1 pose d'attaque
  function drawChar(ctx, look, dir, frame, opt) {
    const L = look, o = opt || {};
    const cx = 12;
    const bob = frame === 1 || frame === 2 ? -1 : 0;
    const step = frame === 1 ? 1 : frame === 2 ? -1 : 0;
    const skin = '#fbd9bd', skinD = '#e6b896';
    const hairBack = (L.style === 'long' || L.style === 'pony' || L.style === 'twin' || L.style === 'braid' || L.style === 'bun2');

    // ----- cape / arrière -----
    if (L.cape && (dir === 'u' || dir === 'l' || dir === 'd')) {
      const cc = L.cape, cd = G.shade(cc, -0.25);
      if (dir === 'u') { pxr(ctx, cx - 6, 13 + bob, 12, 13, cc); pxr(ctx, cx - 6, 24 + bob, 12, 2, cd); pxr(ctx, cx - 1, 14 + bob, 2, 11, cd); }
      else if (dir === 'd') { pxr(ctx, cx - 7, 14 + bob, 3, 10, cd); pxr(ctx, cx + 4, 14 + bob, 3, 10, cd); }
      else { pxr(ctx, cx + 1, 14 + bob, 5, 11, cd); }
    }
    if (hairBack) {
      const hb = L.hairD;
      if (dir === 'd') {
        if (L.style === 'long' || L.style === 'pony' || L.style === 'braid') pxr(ctx, cx - 6, 9 + bob, 12, 14, hb);
        if (L.style === 'twin') { pxr(ctx, cx - 8, 10 + bob, 3, 11, hb); pxr(ctx, cx + 5, 10 + bob, 3, 11, hb); pxr(ctx, cx - 8, 20 + bob, 3, 2, L.hair); pxr(ctx, cx + 5, 20 + bob, 3, 2, L.hair); }
      } else if (dir === 'l') {
        if (L.style === 'long') pxr(ctx, cx - 1, 9 + bob, 7, 14, hb);
        if (L.style === 'pony') { pxr(ctx, cx + 3, 8 + bob, 4, 5, hb); pxr(ctx, cx + 4, 12 + bob, 3, 9, L.hair); }
        if (L.style === 'twin') { pxr(ctx, cx + 3, 10 + bob, 4, 11, hb); }
        if (L.style === 'braid') { pxr(ctx, cx + 3, 10 + bob, 3, 14, L.hairTip ? L.hair : hb); pxr(ctx, cx + 3, 21 + bob, 3, 3, L.hairTip || hb); }
      }
    }

    // ----- jambes -----
    const legL = L.legs, shoes = L.shoes;
    if (dir === 'l') {
      const a = step * 2;
      pxr(ctx, cx - 2 + a, 22, 3, 6 - (a > 0 ? 1 : 0), legL); pxr(ctx, cx - 3 + a, 27 - (a > 0 ? 1 : 0), 5, 2, shoes);
      pxr(ctx, cx - 1 - a, 22, 3, 6 - (a < 0 ? 1 : 0), G.shade(legL, -0.12)); pxr(ctx, cx - 2 - a, 27 - (a < 0 ? 1 : 0), 5, 2, G.shade(shoes, -0.15));
    } else {
      const ly = (s) => (s > 0 ? -1 : 0);
      pxr(ctx, cx - 4, 22, 3, 6 + ly(step), legL); pxr(ctx, cx - 5, 27 + ly(step), 4, 2, shoes);
      pxr(ctx, cx + 1, 22, 3, 6 + ly(-step), legL); pxr(ctx, cx + 1, 27 + ly(-step), 4, 2, shoes);
    }

    // ----- torse -----
    const oc = L.outfit, od = L.outfitD;
    if (dir === 'l') {
      pxr(ctx, cx - 3, 14 + bob, 7, 9, oc); pxr(ctx, cx + 1, 14 + bob, 3, 9, od);
      pxr(ctx, cx - 3, 20 + bob, 7, 1, L.accent);
    } else {
      pxr(ctx, cx - 5, 14 + bob, 10, 9, oc);
      pxr(ctx, cx + 2, 14 + bob, 3, 9, od);
      pxr(ctx, cx - 5, 20 + bob, 10, 1, L.accent);
      if (dir === 'd') { pxr(ctx, cx - 1, 14 + bob, 2, 6, L.accent); pxr(ctx, cx - 3, 14 + bob, 6, 1, L.accent); }
      else { pxr(ctx, cx - 5, 14 + bob, 10, 1, od); }
    }
    // jupe/manteau long pour certains
    if (L.outfit && (L.cape === null || L.cape === undefined) && (L.style === 'long' || L.style === 'twin' || L.style === 'bob') && (L.legs === L.outfit || L.head === 'witch' || L.style === 'long')) {
      if (dir === 'd' || dir === 'u') pxr(ctx, cx - 6, 21 + bob, 12, 3, oc), pxr(ctx, cx - 6, 23 + bob, 12, 1, od);
    }
    // ----- bras -----
    const swing = frame === 1 ? 1 : frame === 2 ? -1 : 0;
    if (dir === 'd' || dir === 'u') {
      pxr(ctx, cx - 7, 15 + bob + (swing > 0 ? 1 : 0), 2, 6, oc); pxr(ctx, cx - 7, 20 + bob + (swing > 0 ? 1 : 0), 2, 2, skin);
      pxr(ctx, cx + 5, 15 + bob + (swing < 0 ? 1 : 0), 2, 6, od); pxr(ctx, cx + 5, 20 + bob + (swing < 0 ? 1 : 0), 2, 2, skinD);
    } else {
      pxr(ctx, cx - 2 + swing, 15 + bob, 3, 6, od); pxr(ctx, cx - 2 + swing, 20 + bob, 3, 2, skinD);
    }

    // ----- tête -----
    const hy = 5 + bob;
    if (dir === 'l') {
      pxr(ctx, cx - 5, hy + 1, 10, 9, skin); pxr(ctx, cx - 4, hy, 8, 1, skin); pxr(ctx, cx - 4, hy + 10, 7, 1, skin);
      pxr(ctx, cx - 5, hy + 8, 2, 1, '#f2a79a'); // joue
      pxr(ctx, cx - 3, hy + 5, 2, 3, '#2a2638'); pxr(ctx, cx - 3, hy + 5, 1, 1, '#fff'); pxr(ctx, cx - 2, hy + 6, 1, 2, L.eye);
    } else if (dir === 'd') {
      pxr(ctx, cx - 5, hy + 1, 10, 9, skin); pxr(ctx, cx - 4, hy, 8, 1, skin); pxr(ctx, cx - 4, hy + 10, 8, 1, skin);
      pxr(ctx, cx - 5, hy + 7, 10, 1, skin);
      pxr(ctx, cx - 4, hy + 5, 2, 3, '#2a2638'); pxr(ctx, cx + 2, hy + 5, 2, 3, '#2a2638');
      pxr(ctx, cx - 4, hy + 6, 2, 2, L.eye); pxr(ctx, cx + 2, hy + 6, 2, 2, L.eye);
      pxr(ctx, cx - 4, hy + 5, 1, 1, '#fff'); pxr(ctx, cx + 2, hy + 5, 1, 1, '#fff');
      pxr(ctx, cx - 5, hy + 8, 2, 1, '#f2a79a'); pxr(ctx, cx + 3, hy + 8, 2, 1, '#f2a79a');
    } else {
      pxr(ctx, cx - 5, hy + 1, 10, 9, skin);
    }

    // ----- cheveux (avant) -----
    const h = L.hair, hd = L.hairD;
    if (dir === 'd') {
      pxr(ctx, cx - 6, hy - 1, 12, 5, h); pxr(ctx, cx - 5, hy - 2, 10, 2, h);
      pxr(ctx, cx - 6, hy + 3, 2, 6, h); pxr(ctx, cx + 4, hy + 3, 2, 6, h);
      // frange
      pxr(ctx, cx - 5, hy + 3, 3, 2, h); pxr(ctx, cx + 2, hy + 3, 3, 2, h); pxr(ctx, cx - 1, hy + 3, 2, 1, h);
      pxr(ctx, cx - 4, hy - 1, 4, 1, G.shade(h, 0.25));
      pxr(ctx, cx + 3, hy + 1, 3, 3, hd);
      if (L.hairTip) { pxr(ctx, cx - 6, hy + 7, 2, 2, L.hairTip); pxr(ctx, cx + 4, hy + 7, 2, 2, L.hairTip); }
    } else if (dir === 'u') {
      pxr(ctx, cx - 6, hy - 1, 12, 12, h); pxr(ctx, cx - 5, hy - 2, 10, 2, h);
      pxr(ctx, cx + 2, hy + 1, 4, 9, hd); pxr(ctx, cx - 4, hy, 4, 1, G.shade(h, 0.25));
      if (L.style === 'long' || L.style === 'pony' || L.style === 'bob') { pxr(ctx, cx - 6, hy + 10, 12, L.style === 'bob' ? 2 : 10, h); pxr(ctx, cx + 2, hy + 10, 4, L.style === 'bob' ? 2 : 10, hd); }
      if (L.style === 'braid') { pxr(ctx, cx - 1, hy + 10, 3, 9, h); pxr(ctx, cx - 1, hy + 17, 3, 3, L.hairTip || hd); }
      if (L.style === 'twin') { pxr(ctx, cx - 9, hy + 3, 3, 11, hd); pxr(ctx, cx + 6, hy + 3, 3, 11, hd); }
    } else {
      pxr(ctx, cx - 4, hy - 2, 10, 5, h); pxr(ctx, cx - 5, hy, 3, 4, h); pxr(ctx, cx + 1, hy + 2, 5, 9, h);
      pxr(ctx, cx - 3, hy - 2, 4, 1, G.shade(h, 0.25)); pxr(ctx, cx + 4, hy + 4, 2, 6, hd);
      if (L.hairTip) pxr(ctx, cx + 1, hy + 9, 5, 2, L.hairTip);
    }
    // ----- styles / accessoires -----
    const front = dir !== 'u';
    if (L.style === 'spiky') { for (let i = -2; i <= 2; i++) pxr(ctx, cx + i * 2 - 1, hy - 4 + Math.abs(i), 2, 3, h); }
    if (L.style === 'bun2') { disc(ctx, cx - 6, hy - 1, 3, h); disc(ctx, cx + 6, hy - 1, 3, h); pxr(ctx, cx - 7, hy - 5, 2, 3, h); pxr(ctx, cx + 6, hy - 5, 2, 3, h); pxr(ctx, cx - 7, hy - 3, 1, 1, G.shade(h, 0.3)); }
    if (L.style === 'pony' && dir === 'd') { pxr(ctx, cx + 5, hy - 1, 3, 4, h); pxr(ctx, cx + 6, hy + 3, 2, 7, hd); }
    if (L.head === 'beret') { ell(ctx, cx + (dir === 'l' ? -1 : 0), hy - 2, 7, 3, L.accent); pxr(ctx, cx - 6, hy - 1, 12, 1, G.shade(L.accent, -0.3)); pxr(ctx, cx + 2, hy - 5, 3, 2, '#fff'); pxr(ctx, cx + 3, hy - 6, 1, 1, '#f7a6c4'); }
    if (L.head === 'witch') { pxr(ctx, cx - 8, hy - 2, 16, 2, L.accent === '#e6c4ff' ? '#6a3a8a' : L.outfitD); const hc = L.outfitD; pxr(ctx, cx - 5, hy - 7, 10, 6, hc); pxr(ctx, cx - 3, hy - 11, 6, 5, hc); pxr(ctx, cx - 1, hy - 14, 3, 4, hc); pxr(ctx, cx - 5, hy - 3, 10, 1, L.accent); }
    if (L.head === 'cathat') { pxr(ctx, cx - 7, hy - 2, 14, 2, L.cape); pxr(ctx, cx - 5, hy - 5, 10, 4, L.cape); pxr(ctx, cx - 5, hy - 3, 10, 1, '#5aa8e8'); pxr(ctx, cx - 7, hy - 5, 3, 3, L.hair); pxr(ctx, cx + 4, hy - 5, 3, 3, L.hair); pxr(ctx, cx - 7, hy - 6, 2, 1, L.hairD); pxr(ctx, cx + 5, hy - 6, 2, 1, L.hairD); }
    if (L.head === 'ribbon') { pxr(ctx, cx - 7, hy - 3, 4, 3, L.outfit); pxr(ctx, cx + 3, hy - 3, 4, 3, L.outfit); pxr(ctx, cx - 1, hy - 2, 2, 2, L.accent); }
    if (L.head === 'mask' && front) { pxr(ctx, cx + (dir === 'l' ? -5 : 1), hy - 1, 5, 6, '#f4f0e6'); pxr(ctx, cx + (dir === 'l' ? -4 : 2), hy, 3, 2, '#d03a3a'); pxr(ctx, cx + (dir === 'l' ? -4 : 3), hy + 3, 2, 1, '#2a2638'); }
    if (L.head === 'eyepatch' && dir === 'd') { pxr(ctx, cx - 5, hy + 4, 4, 5, '#1e1e28'); pxr(ctx, cx - 5, hy + 3, 10, 1, '#1e1e28'); }

    // ----- pose d'attaque : arme -----
    if (o.weapon) {
      const w = o.weapon;
      const wx = dir === 'l' ? cx - 8 : dir === 'u' ? cx + 8 : cx + 8;
      if (w === 'sword') { pxr(ctx, wx, 6 + bob, 2, 13, '#dfe6f2'); pxr(ctx, wx, 6 + bob, 1, 13, '#fff'); pxr(ctx, wx - 1, 19 + bob, 4, 2, '#d8a83a'); pxr(ctx, wx, 21 + bob, 2, 3, '#7a4a2a'); }
      if (w === 'claymore') { pxr(ctx, wx - 1, 3 + bob, 4, 16, '#c8d2e4'); pxr(ctx, wx, 3 + bob, 1, 16, '#fff'); pxr(ctx, wx - 2, 19 + bob, 6, 2, '#6a3030'); pxr(ctx, wx, 21 + bob, 2, 4, '#4a2a1a'); }
      if (w === 'polearm') { pxr(ctx, wx, 0 + bob, 2, 26, '#7a4a2a'); pxr(ctx, wx - 1, 0 + bob, 4, 5, '#dfe6f2'); }
      if (w === 'bow') { for (let y = 0; y < 14; y++) { const dx = Math.round(2.5 * Math.sin((y / 13) * Math.PI)); pxr(ctx, wx + dx, 8 + y + bob, 1, 1, '#8a5a36'); } pxr(ctx, wx, 8 + bob, 1, 14, 'rgba(255,255,255,0.7)'); }
      if (w === 'catalyst') { pxr(ctx, wx - 1, 14 + bob, 6, 7, '#e8e0ff'); pxr(ctx, wx, 15 + bob, 4, 5, '#7a5ad0'); pxr(ctx, wx + 1, 16 + bob, 2, 3, '#f0e8ff'); }
    }
  }

  S.drawChar = drawChar;
  S.looks = {};
  // cadre pour un aspect libre (PNJ) : key unique, look = objet d'apparence
  S.lookFrame = function (key, look, dir, frame, opt) {
    const k = key + '|' + dir + frame + (opt && opt.weapon ? 'w' + opt.weapon : '');
    if (S.looks[k]) return S.looks[k];
    const base = dir === 'r' ? 'l' : dir;
    const c = G.canvas(CW, CH);
    drawChar(c.ctx, look, base, frame, opt);
    let out = G.outline(c, '#26233a');
    if (dir === 'r') out = G.flipX(out);
    return (S.looks[k] = out);
  };
  S.charFrames = {};
  S.charFrame = function (id, dir, frame, opt) {
    const key = id + '|' + dir + frame + (opt && opt.weapon ? 'w' + opt.weapon : '');
    if (S.charFrames[key]) return S.charFrames[key];
    const ch = G.CHARS[id];
    const base = dir === 'r' ? 'l' : dir;
    const c = G.canvas(CW, CH);
    drawChar(c.ctx, ch.look, base, frame, opt);
    let out = G.outline(c, '#26233a');
    if (dir === 'r') out = G.flipX(out);
    return (S.charFrames[key] = out);
  };
  // Portrait carré pour le HUD (visage agrandi)
  S.portraits = {};
  S.portrait = function (id, size) {
    size = size || 24;
    const key = id + size;
    if (S.portraits[key]) return S.portraits[key];
    const ch = G.CHARS[id], L = ch.look;
    const c = G.canvas(size, size);
    const ctx = c.ctx;
    const el = G.EL[ch.el];
    // fond dégradé élémentaire
    for (let y = 0; y < size; y++) pxr(ctx, 0, y, size, 1, G.mix(G.shade(el.color, 0.25), G.shade(el.color, -0.35), y / size));
    const k = size / 24;
    const sx = (v) => Math.round(v * k);
    // cheveux arrière
    pxr(ctx, sx(3), sx(5), sx(18), sx(19), L.hairD);
    if (L.style === 'twin') { pxr(ctx, sx(0), sx(8), sx(4), sx(14), L.hairD); pxr(ctx, sx(20), sx(8), sx(4), sx(14), L.hairD); }
    // épaules
    pxr(ctx, sx(3), sx(19), sx(18), sx(5), L.outfit); pxr(ctx, sx(10), sx(19), sx(4), sx(2), L.accent);
    // visage
    pxr(ctx, sx(6), sx(7), sx(12), sx(12), '#fbd9bd'); pxr(ctx, sx(7), sx(6), sx(10), sx(1), '#fbd9bd'); pxr(ctx, sx(7), sx(19), sx(10), sx(1), '#fbd9bd');
    pxr(ctx, sx(8), sx(12), sx(3), sx(4), '#2a2638'); pxr(ctx, sx(13), sx(12), sx(3), sx(4), '#2a2638');
    pxr(ctx, sx(8), sx(13), sx(3), sx(3), L.eye); pxr(ctx, sx(13), sx(13), sx(3), sx(3), L.eye);
    pxr(ctx, sx(8), sx(12), Math.max(1, sx(1)), Math.max(1, sx(1)), '#fff'); pxr(ctx, sx(13), sx(12), Math.max(1, sx(1)), Math.max(1, sx(1)), '#fff');
    pxr(ctx, sx(7), sx(16), sx(2), Math.max(1, sx(1)), '#f2a79a'); pxr(ctx, sx(15), sx(16), sx(2), Math.max(1, sx(1)), '#f2a79a');
    // cheveux avant
    pxr(ctx, sx(4), sx(3), sx(16), sx(6), L.hair); pxr(ctx, sx(5), sx(2), sx(14), sx(2), L.hair);
    pxr(ctx, sx(4), sx(7), sx(3), sx(9), L.hair); pxr(ctx, sx(17), sx(7), sx(3), sx(9), L.hair);
    pxr(ctx, sx(6), sx(8), sx(4), sx(2), L.hair); pxr(ctx, sx(14), sx(8), sx(4), sx(2), L.hair); pxr(ctx, sx(10), sx(8), sx(4), sx(1), L.hair);
    pxr(ctx, sx(7), sx(3), sx(5), Math.max(1, sx(1)), G.shade(L.hair, 0.3));
    if (L.style === 'bun2') { disc(ctx, sx(4), sx(3), sx(3), L.hair); disc(ctx, sx(20), sx(3), sx(3), L.hair); }
    if (L.style === 'spiky') for (let i = 0; i < 5; i++) pxr(ctx, sx(4 + i * 4), sx(0), sx(3), sx(4), L.hair);
    if (L.head === 'beret') { pxr(ctx, sx(3), sx(1), sx(18), sx(4), L.accent); pxr(ctx, sx(15), sx(0), sx(4), sx(2), '#fff'); }
    if (L.head === 'witch') { pxr(ctx, sx(2), sx(3), sx(20), sx(2), L.outfitD); pxr(ctx, sx(6), sx(-3), sx(12), sx(7), L.outfitD); }
    if (L.head === 'cathat') { pxr(ctx, sx(3), sx(1), sx(18), sx(4), L.cape); pxr(ctx, sx(3), sx(3), sx(18), sx(1), '#5aa8e8'); pxr(ctx, sx(2), sx(0), sx(4), sx(4), L.hair); pxr(ctx, sx(18), sx(0), sx(4), sx(4), L.hair); }
    if (L.head === 'ribbon') { pxr(ctx, sx(2), sx(2), sx(5), sx(4), L.outfit); pxr(ctx, sx(17), sx(2), sx(5), sx(4), L.outfit); }
    if (L.head === 'mask') { pxr(ctx, sx(12), sx(4), sx(7), sx(8), '#f4f0e6'); pxr(ctx, sx(14), sx(6), sx(3), sx(3), '#d03a3a'); }
    if (L.head === 'eyepatch') { pxr(ctx, sx(7), sx(10), sx(5), sx(7), '#1e1e28'); }
    return (S.portraits[key] = c);
  };

  // =====================================================================
  //   ENNEMIS
  // =====================================================================
  S.slime = function (el, f, big) {
    const E = G.EL[el];
    const sq = [0, -1, 1, 0][f % 4];
    const w = big ? 26 : 16, h = big ? 22 : 14;
    const c = G.canvas(w + 4, h + 4);
    const ctx = c.ctx;
    const bw = Math.floor(w / 2) + sq, bh = Math.floor(h / 2) - sq;
    const cx = Math.floor((w + 4) / 2), cy = h + 1 - bh;
    ell(ctx, cx, cy, bw, bh, E.dark);
    ell(ctx, cx, cy - 1, bw - 1, bh - 1, E.color);
    ell(ctx, cx - Math.floor(bw / 3), cy - Math.floor(bh / 2), Math.max(1, Math.floor(bw / 3)), Math.max(1, Math.floor(bh / 3)), E.light);
    const ey = cy - 1;
    const es = big ? 2 : 1;
    pxr(ctx, cx - 4 * es, ey, 2 * es, 2 * es, '#fff'); pxr(ctx, cx + 2 * es, ey, 2 * es, 2 * es, '#fff');
    pxr(ctx, cx - 3 * es, ey + es, es, es, '#222'); pxr(ctx, cx + 3 * es, ey + es, es, es, '#222');
    pxr(ctx, cx - es, ey + 3 * es, 2 * es, es, E.dark);
    return G.outline(c, G.shade(E.dark, -0.55));
  };
  const HIL = { skin: '#d9a672', cloth: '#8a5a36', mask: '#e8dcc0', maskMark: '#7a2a2a' };
  S.hilichurl = function (kind, dir, f) {
    const c = G.canvas(24, 28);
    const ctx = c.ctx;
    const bob = f % 2 ? -1 : 0;
    const cloth = kind === 'fighter' ? '#9a3a30' : HIL.cloth;
    // jambes
    pxr(ctx, 8, 20, 3, 6 + (f % 2), '#5a3b22'); pxr(ctx, 13, 20, 3, 6 + (1 - (f % 2)), '#5a3b22');
    // corps
    pxr(ctx, 7, 12 + bob, 10, 9, HIL.skin); pxr(ctx, 7, 17 + bob, 10, 4, cloth); pxr(ctx, 7, 17 + bob, 10, 1, G.shade(cloth, 0.2));
    pxr(ctx, 4, 13 + bob, 3, 7, HIL.skin); pxr(ctx, 17, 13 + bob, 3, 7, HIL.skin);
    // tête + masque
    pxr(ctx, 7, 3 + bob, 10, 9, HIL.mask); pxr(ctx, 8, 2 + bob, 8, 1, HIL.mask);
    pxr(ctx, 6, 3 + bob, 1, 5, '#2a2a2a'); pxr(ctx, 17, 3 + bob, 1, 5, '#2a2a2a');
    pxr(ctx, 9, 6 + bob, 2, 2, '#1e1e24'); pxr(ctx, 13, 6 + bob, 2, 2, '#1e1e24');
    pxr(ctx, 9, 3 + bob, 6, 1, HIL.maskMark); pxr(ctx, 11, 9 + bob, 2, 2, HIL.maskMark);
    pxr(ctx, 7, 1 + bob, 10, 2, '#3a2a22');
    // arme
    if (kind === 'archer') { for (let y = 0; y < 14; y++) { const dx = Math.round(2.5 * Math.sin((y / 13) * Math.PI)); pxr(ctx, 20 + dx, 8 + y + bob, 1, 1, '#8a5a36'); } }
    else { pxr(ctx, 19, 8 + bob, 3, 12, '#7a5230'); pxr(ctx, 18, 5 + bob, 5, 5, '#8a6240'); }
    return G.outline(c, '#2a1a12');
  };
  S.mitachurl = function (f) {
    const c = G.canvas(36, 40);
    const ctx = c.ctx;
    const bob = f % 2 ? -1 : 0;
    pxr(ctx, 10, 28, 6, 9 + (f % 2), '#5a3b22'); pxr(ctx, 20, 28, 6, 9 + (1 - (f % 2)), '#5a3b22');
    pxr(ctx, 8, 14 + bob, 20, 16, HIL.skin); pxr(ctx, 8, 24 + bob, 20, 6, '#7a2a2a'); pxr(ctx, 8, 24 + bob, 20, 1, '#a04a40');
    pxr(ctx, 3, 15 + bob, 6, 12, HIL.skin); pxr(ctx, 27, 15 + bob, 6, 12, HIL.skin);
    pxr(ctx, 10, 3 + bob, 16, 13, HIL.mask); pxr(ctx, 12, 2 + bob, 12, 1, HIL.mask);
    pxr(ctx, 13, 8 + bob, 3, 3, '#1e1e24'); pxr(ctx, 20, 8 + bob, 3, 3, '#1e1e24');
    pxr(ctx, 12, 4 + bob, 12, 2, HIL.maskMark); pxr(ctx, 16, 12 + bob, 4, 3, HIL.maskMark);
    pxr(ctx, 10, 0 + bob, 16, 3, '#3a2a22');
    // bouclier en bois
    pxr(ctx, 0, 16 + bob, 9, 16, '#8a5a36'); pxr(ctx, 0, 16 + bob, 9, 2, '#b07a48'); pxr(ctx, 4, 18 + bob, 1, 12, '#5a3b22'); pxr(ctx, 1, 24 + bob, 7, 1, '#5a3b22');
    // massue
    pxr(ctx, 30, 6 + bob, 4, 22, '#7a5230'); pxr(ctx, 28, 2 + bob, 8, 9, '#8a6240');
    return G.outline(c, '#2a1a12');
  };
  S.mage = function (el, f) {
    const E = G.EL[el];
    const c = G.canvas(24, 30);
    const ctx = c.ctx;
    const bob = Math.round(Math.sin(f * 1.6));
    for (let y = 0; y < 18; y++) { const hw = 3 + Math.floor(y / 3); pxr(ctx, 12 - hw, 10 + y + bob, hw * 2, 1, y > 14 ? '#2a1d4a' : '#3a2866'); }
    pxr(ctx, 6, 24 + bob, 12, 2, E.dark);
    ell(ctx, 12, 8 + bob, 6, 6, '#2e2250'); ell(ctx, 12, 9 + bob, 4, 4, '#14102a');
    pxr(ctx, 9, 9 + bob, 2, 2, E.color); pxr(ctx, 13, 9 + bob, 2, 2, E.color);
    pxr(ctx, 4, 14 + bob, 2, 6, '#2e2250'); pxr(ctx, 18, 14 + bob, 2, 6, '#2e2250');
    pxr(ctx, 18, 8 + bob, 1, 14, '#6a5a9a'); disc(ctx, 18, 7 + bob, 2, E.color);
    return G.outline(c, '#120c24');
  };
  S.hypostasis = function (f) {
    const c = G.canvas(64, 70);
    const ctx = c.ctx;
    const E = G.EL.anemo;
    // cube central
    const bob = Math.round(Math.sin(f * 0.2) * 2);
    const x0 = 18, y0 = 18 + bob, s = 28;
    pxr(ctx, x0, y0, s, s, '#cfe9e0'); pxr(ctx, x0, y0, s, 4, '#ffffff'); pxr(ctx, x0, y0, 4, s, '#e8fbf4');
    pxr(ctx, x0 + s - 5, y0, 5, s, '#8ec7b8'); pxr(ctx, x0, y0 + s - 5, s, 5, '#8ec7b8');
    pxr(ctx, x0 + 6, y0 + 6, s - 12, s - 12, '#3a5a74');
    disc(ctx, x0 + s / 2, y0 + s / 2, 7, E.color); disc(ctx, x0 + s / 2, y0 + s / 2, 4, '#e8fff6'); disc(ctx, x0 + s / 2, y0 + s / 2, 2, '#ffffff');
    // éléments flottants
    for (let i = 0; i < 6; i++) {
      const a = f * 0.05 + (i * Math.PI) / 3;
      const rx = 32 + Math.cos(a) * 26, ry = 32 + bob + Math.sin(a) * 22;
      pxr(ctx, Math.round(rx) - 3, Math.round(ry) - 3, 7, 7, '#a7d8cc'); pxr(ctx, Math.round(rx) - 3, Math.round(ry) - 3, 7, 2, '#fff');
      pxr(ctx, Math.round(rx) - 1, Math.round(ry) - 1, 3, 3, E.color);
    }
    return G.outline(c, '#1a3a3a');
  };
  S.energyOrb = function (el) {
    const E = G.EL[el] || G.EL.phys;
    const c = G.canvas(7, 7);
    disc(c.ctx, 3, 3, 3, E.dark); disc(c.ctx, 3, 3, 2, E.color); pxr(c.ctx, 2, 2, 1, 1, E.light);
    return c;
  };
  S.bird = function (f) {
    const c = G.canvas(9, 6);
    const ctx = c.ctx;
    pxr(ctx, 3, 2, 3, 2, '#4a3a2a'); pxr(ctx, 6, 2, 1, 1, '#4a3a2a'); pxr(ctx, 2, 3, 1, 1, '#c89a5a');
    if (f % 2) { pxr(ctx, 2, 0, 2, 2, '#6a5a4a'); pxr(ctx, 5, 0, 2, 2, '#6a5a4a'); } else { pxr(ctx, 1, 3, 2, 1, '#6a5a4a'); pxr(ctx, 6, 3, 2, 1, '#6a5a4a'); pxr(ctx, 1, 4, 2, 1, '#6a5a4a'); pxr(ctx, 6, 4, 2, 1, '#6a5a4a'); }
    return c;
  };
  S.butterfly = function (f, col) {
    const c = G.canvas(7, 5);
    const ctx = c.ctx;
    if (f % 2) { pxr(ctx, 0, 0, 3, 3, col); pxr(ctx, 4, 0, 3, 3, col); pxr(ctx, 3, 1, 1, 3, '#2a2a2a'); }
    else { pxr(ctx, 1, 1, 2, 3, col); pxr(ctx, 4, 1, 2, 3, col); pxr(ctx, 3, 1, 1, 3, '#2a2a2a'); }
    return c;
  };
})();
