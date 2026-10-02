/* Teyvat Pixel — icônes pixel du HUD, éléments et objets */
(function () {
  const G = window.G;
  const I = (G.I = {});
  const S = G.S;
  const cache = {};
  const pxr = S.pxr, disc = S.disc, ell = S.ell;

  function line(ctx, x0, y0, x1, y1, c, w) {
    w = w || 1;
    ctx.fillStyle = c;
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;
    for (;;) {
      ctx.fillRect(x0, y0, w, w);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  }
  I.line = line;

  // ---------- Symboles élémentaires (ASCII) ----------
  const ELSYM = {
    pyro: ['....X....', '...XX....', '...XXX...', '..XXXX.X.', '.XXXXXXX.', '.XXXXXXX.', 'XXXX.XXXX', 'XXX...XXX', 'XXX...XXX', '.XXX.XXX.', '..XXXXX..'],
    hydro: ['....X....', '....X....', '...XXX...', '...XXX...', '..XXXXX..', '.XXXXXXX.', '.XXXXXXX.', 'XXXXXXXXX', 'XXXXXXXXX', '.XXXXXXX.', '..XXXXX..'],
    electro: ['......XX.', '.....XX..', '....XX...', '...XX....', '..XXXXXX.', '.....XX..', '....XX...', '...XX....', '..XX.....', '..X......'],
    cryo: ['....X....', '.X..X..X.', '..X.X.X..', '...XXX...', 'XXXXXXXXX', '...XXX...', '..X.X.X..', '.X..X..X.', '....X....'],
    anemo: ['...XXXX..', '..X....X.', '.X..XX..X', '.X.X..X.X', '.X.X..X.X', '.X..XXX.X', '..X.....X', '...XXXXX.'],
    phys: ['......XX.', '.....XXX.', '....XXX..', '.X.XXX...', '..XXX....', '..XX.....', '.XX.X....', 'XX.......'],
  };
  // symbole coloré avec ombre ; size = 1 (natif)
  I.elSym = function (el, col) {
    const key = 'sym' + el + (col || '');
    if (cache[key]) return cache[key];
    const rows = ELSYM[el] || ELSYM.phys;
    const E = G.EL[el] || G.EL.phys;
    const c = S.ascii(rows, { X: col || E.color });
    const out = G.canvas(c.width + 2, c.height + 2);
    out.ctx.drawImage(G.tint(c, '#00000099'), 1, 1);
    out.ctx.drawImage(c, 0, 0);
    return (cache[key] = out);
  };

  // ---------- Icônes 16x16 générées ----------
  function mk(key, w, h, fn, outlineCol) {
    if (cache[key]) return cache[key];
    const c = G.canvas(w, h);
    fn(c.ctx);
    return (cache[key] = outlineCol ? G.outline(c, outlineCol) : c);
  }

  I.compass = () => mk('compass', 16, 16, (x) => {
    disc(x, 8, 8, 7, '#e8f0ff'); disc(x, 8, 8, 5, '#5a74a8');
    line(x, 11, 5, 5, 11, '#ffffff'); line(x, 5, 5, 11, 11, '#f0b840');
    pxr(x, 7, 7, 2, 2, '#fff');
  });
  I.wish = () => mk('wish', 18, 16, (x) => {
    // ailes + étoile
    for (let i = 0; i < 5; i++) { pxr(x, 8 - i * 1 - 1, 3 + i * 2, 1, 5 - (i > 2 ? 1 : 0), '#fff'); pxr(x, 9 + i * 1, 3 + i * 2, 1, 5 - (i > 2 ? 1 : 0), '#fff'); }
    for (let i = 0; i < 4; i++) { line(x, 8 - i * 2, 7 - i, 8 - i * 2 - 2, 4 - i, '#e8f4ff'); line(x, 9 + i * 2, 7 - i, 9 + i * 2 + 2, 4 - i, '#e8f4ff'); }
    pxr(x, 8, 5, 2, 8, '#ffe27a'); pxr(x, 6, 8, 6, 2, '#ffe27a');
  });
  I.pass = () => mk('pass', 16, 16, (x) => {
    pxr(x, 7, 0, 2, 16, '#fff'); pxr(x, 0, 7, 16, 2, '#fff');
    pxr(x, 6, 3, 4, 10, '#fff'); pxr(x, 3, 6, 10, 4, '#fff'); pxr(x, 5, 5, 6, 6, '#fff');
    pxr(x, 12, 1, 3, 1, '#ffe27a'); pxr(x, 13, 0, 1, 3, '#ffe27a');
  });
  I.book = () => mk('book', 16, 16, (x) => {
    pxr(x, 1, 3, 14, 11, '#f4efe0'); pxr(x, 7, 3, 2, 11, '#c9bfa0');
    pxr(x, 1, 2, 6, 1, '#fff'); pxr(x, 9, 2, 6, 1, '#fff');
    for (let i = 0; i < 4; i++) { pxr(x, 2, 5 + i * 2, 4, 1, '#9a8f70'); pxr(x, 10, 5 + i * 2, 4, 1, '#9a8f70'); }
    pxr(x, 1, 13, 14, 2, '#7a6a48');
  });
  I.bag = () => mk('bag', 16, 16, (x) => {
    pxr(x, 3, 1, 10, 3, '#cfd6e8'); pxr(x, 5, 0, 6, 2, '#aab4cc');
    pxr(x, 2, 3, 12, 11, '#e6ebf6'); pxr(x, 2, 3, 12, 2, '#fff');
    pxr(x, 4, 8, 8, 5, '#b8c2dc'); pxr(x, 7, 9, 2, 2, '#5a6a98');
    pxr(x, 0, 6, 2, 6, '#cfd6e8'); pxr(x, 14, 6, 2, 6, '#cfd6e8');
  });
  I.face = () => mk('face', 16, 16, (x) => {
    ell(x, 8, 9, 5, 6, '#fbe6d0');
    pxr(x, 2, 2, 12, 5, '#f4f4ff'); pxr(x, 2, 5, 3, 8, '#f4f4ff'); pxr(x, 11, 5, 3, 8, '#f4f4ff');
    pxr(x, 6, 9, 1, 2, '#3a4a8a'); pxr(x, 10, 9, 1, 2, '#3a4a8a');
    pxr(x, 1, 0, 3, 3, '#ffe27a');
  });
  I.eye = () => mk('eye', 16, 12, (x) => {
    ell(x, 8, 6, 7, 4, '#fff'); ell(x, 8, 6, 5, 3, '#8fb8e8'); disc(x, 8, 6, 2, '#2a3a6a'); pxr(x, 7, 5, 1, 1, '#fff');
  });
  I.radar = () => mk('radar', 16, 16, (x) => {
    disc(x, 8, 9, 2, '#fff'); pxr(x, 6, 12, 5, 3, '#fff');
    for (let r = 4; r <= 7; r += 3) {
      for (let a = -0.9; a <= 0.9; a += 0.1) { const px = Math.round(8 + Math.cos(a - Math.PI / 2) * r), py = Math.round(9 + Math.sin(a - Math.PI / 2) * r); pxr(x, px, py, 1, 1, '#cfe3ff'); }
    }
  });
  I.quest = () => mk('quest', 14, 18, (x) => {
    pxr(x, 1, 0, 12, 18, '#e9eefb'); pxr(x, 1, 14, 6, 4, 'rgba(0,0,0,0)'); x.clearRect(5, 14, 4, 4);
    pxr(x, 6, 3, 3, 7, '#3a4a7a'); pxr(x, 6, 12, 3, 3, '#3a4a7a');
  });
  I.chat = () => mk('chat', 16, 14, (x) => {
    ell(x, 8, 6, 7, 5, '#fff'); pxr(x, 3, 10, 4, 3, '#fff'); pxr(x, 2, 12, 2, 1, '#fff');
    pxr(x, 4, 6, 2, 2, '#9aa3bb'); pxr(x, 7, 6, 2, 2, '#9aa3bb'); pxr(x, 10, 6, 2, 2, '#9aa3bb');
  });
  I.paimonHead = () => mk('paimonHead', 22, 22, (x) => {
    ell(x, 11, 12, 8, 8, '#f6f7ff'); pxr(x, 4, 8, 14, 4, '#f1e9d6');
    pxr(x, 7, 12, 3, 3, '#4a62d0'); pxr(x, 13, 12, 3, 3, '#4a62d0'); pxr(x, 7, 12, 1, 1, '#fff'); pxr(x, 13, 12, 1, 1, '#fff');
    pxr(x, 10, 16, 3, 1, '#c85a5a');
    pxr(x, 8, 2, 7, 3, '#f6d65a'); pxr(x, 10, 0, 3, 2, '#f6d65a'); pxr(x, 17, 3, 3, 2, '#f6d65a');
    pxr(x, 3, 14, 2, 4, '#8fd0f4'); pxr(x, 18, 14, 2, 4, '#8fd0f4');
  }, '#2a3262');
  I.maple = () => mk('maple', 18, 18, (x) => {
    const c1 = '#e8532a', c2 = '#ff8a3a', c3 = '#a8301a';
    disc(x, 9, 8, 6, c1); disc(x, 9, 8, 4, c2);
    for (let a = 0; a < 5; a++) { const an = -Math.PI / 2 + (a * 2 * Math.PI) / 5; line(x, 9, 8, Math.round(9 + Math.cos(an) * 8), Math.round(8 + Math.sin(an) * 8), c1, 2); }
    line(x, 9, 8, 9, 17, c3, 1); line(x, 9, 8, 9, 14, '#ffd0a0', 1);
  }, '#5a1a0a');

  // Épée d'attaque (taille variable, 24 par défaut)
  I.sword = (col, size) => {
    size = size || 24; col = col || '#ffffff';
    return mk('sword' + col + size, size, size, (x) => {
      const f = size / 24, q = (v) => Math.round(v * f);
      line(x, q(4), q(20), q(19), q(5), col, Math.max(3, q(3)));
      line(x, q(6), q(18), q(17), q(7), G.shade(col, -0.18), Math.max(1, q(1)));
      line(x, q(3), q(14), q(10), q(21), '#d9d3c0', Math.max(2, q(2)));
      line(x, q(3), q(21), q(5), q(19), '#8a6a3a', Math.max(3, q(3)));
      pxr(x, q(17), q(3), q(4), q(3), '#fff');
    });
  };
  I.bowIcon = (size) => { size = size || 24; return mk('bowIcon' + size, size, size, (x) => {
    const f = size / 24, q = (v) => Math.round(v * f);
    for (let y = 0; y < q(20); y++) { const dx = Math.round(q(7) * Math.sin((y / (q(20) - 1)) * Math.PI)); pxr(x, q(5) + dx, q(2) + y, Math.max(2, q(2)), 1, '#fff'); }
    pxr(x, q(5), q(2), 1, q(20), '#cfd6e8');
    line(x, q(5), q(12), q(20), q(12), '#fff', Math.max(1, q(1))); pxr(x, q(18), q(10), q(3), Math.max(1, q(1)), '#fff'); pxr(x, q(18), q(14), q(3), Math.max(1, q(1)), '#fff'); pxr(x, q(20), q(11), q(2), q(3), '#fff');
  }); };
  I.jump = () => mk('jump', 20, 22, (x) => {
    // silhouette qui saute + flèche vers le haut
    disc(x, 10, 6, 3, '#fff');
    pxr(x, 8, 9, 5, 7, '#fff'); line(x, 8, 11, 3, 8, '#fff', 2); line(x, 12, 11, 17, 7, '#fff', 2);
    line(x, 9, 16, 5, 21, '#fff', 2); line(x, 11, 16, 15, 20, '#fff', 2);
    pxr(x, 15, 0, 2, 5, '#cfe8ff'); pxr(x, 13, 2, 6, 1, '#cfe8ff'); pxr(x, 14, 1, 4, 1, '#cfe8ff');
  });
  I.sprint = () => mk('sprint', 20, 20, (x) => {
    line(x, 3, 3, 10, 10, '#fff', 3); line(x, 10, 10, 3, 17, '#fff', 3);
    line(x, 10, 3, 17, 10, '#fff', 3); line(x, 17, 10, 10, 17, '#fff', 3);
  });
  I.glide = () => mk('glide', 20, 16, (x) => {
    line(x, 1, 5, 10, 11, '#fff', 2); line(x, 19, 5, 10, 11, '#fff', 2); line(x, 1, 5, 10, 3, '#fff', 2); line(x, 19, 5, 10, 3, '#fff', 2);
  });
  I.orbIcon = (size) => { size = size || 24; return mk('orbIcon' + size, size, size, (x) => {
    const f = size / 24, q = (v) => Math.round(v * f);
    disc(x, q(12), q(12), q(8), '#e8e0ff'); disc(x, q(12), q(12), q(6), '#8a6ae8'); disc(x, q(10), q(10), q(2), '#f0e8ff');
    line(x, q(4), q(20), q(9), q(15), '#ffffff', Math.max(2, q(2)));
  }); };
  // Compétence élémentaire (E) et déchaînement (Q)
  I.skillIcon = (el) => mk('skill' + el, 20, 20, (x) => {
    const E = G.EL[el];
    disc(x, 10, 10, 8, E.dark); disc(x, 10, 10, 6, E.color); disc(x, 9, 8, 3, E.light);
    const s = I.elSym(el, '#ffffff'); x.drawImage(s, 10 - Math.floor(s.width / 2), 10 - Math.floor(s.height / 2));
    line(x, 15, 15, 18, 18, '#fff', 2);
  });
  I.burstIcon = (el, ready) => mk('burst' + el + ready, 22, 22, (x) => {
    const E = G.EL[el];
    const col = ready ? E.color : '#8d94a8', col2 = ready ? E.light : '#b8bece', colD = ready ? E.dark : '#5a6074';
    for (let k = 0; k < 8; k++) {
      const a = (k * Math.PI) / 4;
      line(x, 11, 11, Math.round(11 + Math.cos(a) * 9), Math.round(11 + Math.sin(a) * 9), colD, 3);
    }
    disc(x, 11, 11, 6, colD); disc(x, 11, 11, 5, col); disc(x, 11, 11, 3, col2); disc(x, 11, 11, 1, '#fff');
  });

  // Anneau d'énergie (liste d'équipe)
  I.ringIcon = (el, fill) => {
    const key = 'ring' + el + Math.round(fill * 12);
    if (cache[key]) return cache[key];
    const E = G.EL[el];
    const R = 11;
    const c = G.canvas(R * 2 + 1, R * 2 + 1);
    const ctx = c.ctx;
    for (let y = -R; y <= R; y++) for (let x = -R; x <= R; x++) {
      const d = Math.sqrt(x * x + y * y);
      if (d > R + 0.4) continue;
      if (d > R - 2) {
        let ang = Math.atan2(x, -y); if (ang < 0) ang += Math.PI * 2;
        ctx.fillStyle = ang / (Math.PI * 2) <= fill ? E.color : 'rgba(20,28,44,0.65)';
      } else ctx.fillStyle = 'rgba(14,22,40,0.55)';
      ctx.fillRect(x + R, y + R, 1, 1);
    }
    const s = I.elSym(el, fill >= 1 ? '#ffffff' : E.light);
    ctx.drawImage(s, R - Math.floor(s.width / 2), R - Math.floor(s.height / 2));
    return (cache[key] = c);
  };

  // ---------- Objets ----------
  I.item = function (id) {
    if (G.ITEMS[id] && G.ITEMS[id].icon) id = G.ITEMS[id].icon;
    const key = 'item' + id;
    if (cache[key]) return cache[key];
    const c = G.canvas(16, 16);
    const x = c.ctx;
    const f = {
      mora: () => { disc(x, 8, 8, 6, '#c9942a'); disc(x, 8, 8, 5, '#f2cf5a'); disc(x, 8, 8, 3, '#d9a83a'); pxr(x, 7, 6, 2, 4, '#fff0a0'); pxr(x, 6, 7, 4, 2, '#fff0a0'); },
      primo: () => { x.fillStyle = '#7fb8ff'; for (let y = 0; y < 12; y++) { const hw = y < 6 ? y + 1 : 12 - y; x.fillRect(8 - hw, 2 + y, hw * 2, 1); } pxr(x, 7, 2, 2, 12, '#ffd1ee'); pxr(x, 3, 7, 10, 2, '#e2f2ff'); pxr(x, 7, 6, 2, 4, '#fff'); },
      fate: () => { disc(x, 8, 8, 6, '#6a8ae8'); disc(x, 8, 8, 5, '#a8c0ff'); disc(x, 8, 8, 3, '#ffd1ee'); pxr(x, 7, 5, 2, 6, '#fff'); pxr(x, 5, 7, 6, 2, '#fff'); },
      stardust: () => { pxr(x, 7, 2, 2, 12, '#e8c7ff'); pxr(x, 2, 7, 12, 2, '#e8c7ff'); pxr(x, 6, 6, 4, 4, '#fff'); pxr(x, 3, 3, 1, 1, '#c8f0ff'); pxr(x, 12, 12, 1, 1, '#c8f0ff'); },
      starglitter: () => { pxr(x, 7, 1, 2, 14, '#ffe27a'); pxr(x, 1, 7, 14, 2, '#ffe27a'); pxr(x, 6, 6, 4, 4, '#fff6c8'); pxr(x, 3, 3, 2, 2, '#ffd1ee'); pxr(x, 11, 11, 2, 2, '#ffd1ee'); },
      book1: () => book('#6fbf6a'), book2: () => book('#5aa0e8'), book3: () => book('#b070f0'),
      apple: () => { disc(x, 8, 9, 5, '#d93a3a'); disc(x, 7, 8, 3, '#f06a5a'); pxr(x, 8, 2, 1, 3, '#6a4226'); pxr(x, 9, 3, 3, 2, '#55ab45'); },
      bread: () => { ell(x, 8, 9, 7, 4, '#c8883a'); ell(x, 8, 8, 6, 3, '#e8a853'); pxr(x, 5, 7, 1, 3, '#a8682a'); pxr(x, 8, 7, 1, 3, '#a8682a'); pxr(x, 11, 7, 1, 3, '#a8682a'); },
      meal: () => { ell(x, 8, 10, 7, 4, '#e6e0d0'); ell(x, 8, 9, 6, 3, '#c8683a'); pxr(x, 5, 8, 2, 2, '#e8c24a'); pxr(x, 9, 7, 2, 2, '#55ab45'); pxr(x, 7, 9, 2, 1, '#8a3a1a'); },
      flower: () => { pxr(x, 7, 7, 2, 8, '#4a9a38'); for (const d of [[7, 2], [7, 6], [4, 4], [10, 4]]) disc(x, d[0] + 1, d[1] + 1, 2, '#ffffff'); disc(x, 8, 5, 1, '#f4e46a'); },
      dandelion: () => { pxr(x, 7, 8, 1, 7, '#6aa84a'); for (let a = 0; a < 8; a++) { const an = (a * Math.PI) / 4; line(x, 7, 6, Math.round(7 + Math.cos(an) * 5), Math.round(6 + Math.sin(an) * 5), '#fff', 1); } disc(x, 7, 6, 1, '#e0e8f0'); },
      mushroom: () => { ell(x, 8, 6, 6, 4, '#c8685a'); pxr(x, 3, 5, 2, 2, '#fff'); pxr(x, 8, 3, 2, 2, '#fff'); pxr(x, 11, 6, 2, 1, '#fff'); pxr(x, 6, 9, 4, 5, '#f0e6d0'); },
      anemoculus: () => { disc(x, 8, 8, 6, '#2fbf92'); disc(x, 8, 8, 5, '#7af0c4'); disc(x, 8, 8, 3, '#d6fff0'); pxr(x, 7, 7, 2, 2, '#fff'); },
      slime: () => { ell(x, 8, 10, 6, 4, '#4aa0e8'); ell(x, 8, 9, 5, 3, '#7fc4ff'); pxr(x, 5, 8, 2, 1, '#fff'); },
      mask: () => { pxr(x, 3, 3, 10, 10, '#e8dcc0'); pxr(x, 3, 3, 10, 2, '#7a2a2a'); pxr(x, 5, 7, 2, 2, '#1e1e24'); pxr(x, 9, 7, 2, 2, '#1e1e24'); pxr(x, 7, 11, 2, 2, '#7a2a2a'); },
      arrowhead: () => { line(x, 3, 13, 12, 4, '#8a5a36', 1); x.fillStyle = '#cfd6e8'; x.fillRect(11, 1, 4, 4); x.fillRect(12, 0, 2, 6); x.fillRect(10, 2, 6, 2); },
      crystal: () => { x.fillStyle = '#6a3ab8'; for (let y = 0; y < 13; y++) { const hw = y < 6 ? y + 1 : 13 - y; x.fillRect(8 - Math.ceil(hw / 1.5), 2 + y, Math.ceil(hw / 1.5) * 2, 1); } pxr(x, 7, 4, 2, 6, '#c9a0ff'); },
      core: () => { disc(x, 8, 8, 6, '#2fbf92'); disc(x, 8, 8, 4, '#bdf7e2'); pxr(x, 7, 2, 2, 12, '#fff'); pxr(x, 2, 7, 12, 2, '#fff'); },
    };
    function book(col) { pxr(x, 2, 2, 12, 13, G.shade(col, -0.35)); pxr(x, 3, 2, 10, 12, col); pxr(x, 3, 2, 10, 2, G.shade(col, 0.3)); pxr(x, 5, 6, 6, 1, '#fff6c8'); pxr(x, 5, 9, 6, 1, '#fff6c8'); pxr(x, 2, 14, 12, 1, '#2a2a3a'); }
    (f[id] || f.mora)();
    return (cache[key] = G.outline(c, 'rgba(20,24,40,1)', 0));
  };

  // Étoiles de rareté
  I.stars = function (n, ctx, x, y, col) {
    for (let i = 0; i < n; i++) G.text(ctx, '★', x + i * 6, y, col || '#ffd45a');
  };

  // Icône de barre de signal (ping)
  I.signal = (col) => mk('signal' + col, 8, 7, (x) => {
    pxr(x, 0, 5, 2, 2, col); pxr(x, 3, 3, 2, 4, col); pxr(x, 6, 0, 2, 7, col);
  });
})();
