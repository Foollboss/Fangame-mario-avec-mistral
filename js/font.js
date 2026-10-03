/* Teyvat Pixel — police bitmap 5x7 (accents français inclus) + rendu de texte pixel-perfect */
(function () {
  const G = window.G;

  // Données colonne par colonne (bit0 = ligne du haut), caractères 0x20..0x7E
  const RAW =
    '00 00 00 00 00|00 00 5F 00 00|00 07 00 07 00|14 7F 14 7F 14|24 2A 7F 2A 12|23 13 08 64 62|36 49 56 20 50|00 08 07 03 00|' +
    '00 1C 22 41 00|00 41 22 1C 00|2A 1C 7F 1C 2A|08 08 3E 08 08|00 80 70 30 00|08 08 08 08 08|00 00 60 60 00|20 10 08 04 02|' +
    '3E 51 49 45 3E|00 42 7F 40 00|72 49 49 49 46|21 41 49 4D 33|18 14 12 7F 10|27 45 45 45 39|3C 4A 49 49 31|41 21 11 09 07|' +
    '36 49 49 49 36|46 49 49 29 1E|00 00 14 00 00|00 40 34 00 00|00 08 14 22 41|14 14 14 14 14|00 41 22 14 08|02 01 59 09 06|' +
    '3E 41 5D 59 4E|7C 12 11 12 7C|7F 49 49 49 36|3E 41 41 41 22|7F 41 41 41 3E|7F 49 49 49 41|7F 09 09 09 01|3E 41 41 51 73|' +
    '7F 08 08 08 7F|00 41 7F 41 00|20 40 41 3F 01|7F 08 14 22 41|7F 40 40 40 40|7F 02 1C 02 7F|7F 04 08 10 7F|3E 41 41 41 3E|' +
    '7F 09 09 09 06|3E 41 51 21 5E|7F 09 19 29 46|26 49 49 49 32|03 01 7F 01 03|3F 40 40 40 3F|1F 20 40 20 1F|3F 40 38 40 3F|' +
    '63 14 08 14 63|03 04 78 04 03|61 59 49 4D 43|00 7F 41 41 00|02 04 08 10 20|00 41 41 7F 00|04 02 01 02 04|40 40 40 40 40|' +
    '00 03 07 08 00|20 54 54 78 40|7F 28 44 44 38|38 44 44 44 28|38 44 44 28 7F|38 54 54 54 18|00 08 7E 09 02|18 A4 A4 9C 78|' +
    '7F 08 04 04 78|00 44 7D 40 00|20 40 40 3D 00|7F 10 28 44 00|00 41 7F 40 00|7C 04 78 04 78|7C 08 04 04 78|38 44 44 44 38|' +
    'FC 18 24 24 18|18 24 24 18 FC|7C 08 04 04 08|48 54 54 54 24|04 04 3F 44 24|3C 40 40 20 7C|1C 20 40 20 1C|3C 40 30 40 3C|' +
    '44 28 10 28 44|4C 90 90 90 7C|44 64 54 4C 44|00 08 36 41 00|00 00 77 00 00|00 41 36 08 00|02 01 02 04 02';
  const COLS = RAW.split('|').map((s) => s.split(' ').map((h) => parseInt(h, 16)));

  const ROWS = 11; // lignes -2..8 (accents au-dessus, cédille et jambages dessous)
  const CELL_W = 6;
  const glyphs = {}; // ch -> { rows: [11][5] bool, x0, x1 }

  function fromCols(cols) {
    const rows = [];
    for (let r = 0; r < ROWS; r++) rows.push([0, 0, 0, 0, 0]);
    for (let x = 0; x < 5; x++) for (let y = 0; y < 8; y++) if (cols[x] & (1 << y)) rows[y + 2][x] = 1;
    return rows;
  }
  function fromArt(art) {
    const rows = [];
    for (let r = 0; r < ROWS; r++) rows.push([0, 0, 0, 0, 0]);
    art.forEach((line, y) => { for (let x = 0; x < 5; x++) if (line[x] === 'X') rows[y + 2][x] = 1; });
    return rows;
  }
  function bounds(rows) {
    let x0 = 5, x1 = -1;
    for (let x = 0; x < 5; x++) for (let r = 0; r < ROWS; r++) if (rows[r][x]) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
    return x1 < 0 ? { x0: 0, x1: 1 } : { x0, x1 };
  }
  function add(ch, rows) { const b = bounds(rows); glyphs[ch] = { rows, x0: b.x0, x1: b.x1 }; }

  for (let i = 0; i < COLS.length; i++) add(String.fromCharCode(32 + i), fromCols(COLS[i]));
  glyphs[' '] = { rows: fromCols([0, 0, 0, 0, 0]), x0: 0, x1: 1 };

  // Accents : [ligne haute (col), ligne basse (col...)] ; pour les minuscules on utilise les lignes 0-1 (index 2-3)
  const ACC = {
    acute: { hi: [3], lo: [2] },
    grave: { hi: [1], lo: [2] },
    circ: { hi: [2], lo: [1, 3] },
    diaer: { hi: [], lo: [1, 3] },
  };
  function accented(ch, base, acc, upper) {
    const b = glyphs[base].rows.map((r) => r.slice());
    if (base === 'i') b[2][2] = 0; // retire le point du i
    const a = ACC[acc];
    const hiRow = upper ? 0 : 1, loRow = upper ? 1 : 2; // index dans rows (0 = ligne -2)
    a.hi.forEach((x) => (b[hiRow][x] = 1));
    a.lo.forEach((x) => (b[loRow][x] = 1));
    add(ch, b);
  }
  [['é', 'e', 'acute'], ['è', 'e', 'grave'], ['ê', 'e', 'circ'], ['ë', 'e', 'diaer'], ['à', 'a', 'grave'], ['â', 'a', 'circ'],
    ['ä', 'a', 'diaer'], ['î', 'i', 'circ'], ['ï', 'i', 'diaer'], ['ô', 'o', 'circ'], ['ö', 'o', 'diaer'], ['ù', 'u', 'grave'],
    ['û', 'u', 'circ'], ['ü', 'u', 'diaer']].forEach((a) => accented(a[0], a[1], a[2], false));
  [['É', 'E', 'acute'], ['È', 'E', 'grave'], ['Ê', 'E', 'circ'], ['À', 'A', 'grave'], ['Â', 'A', 'circ'], ['Ô', 'O', 'circ'],
    ['Î', 'I', 'circ'], ['Ù', 'U', 'grave']].forEach((a) => accented(a[0], a[1], a[2], true));
  (function () {
    const c = glyphs['c'].rows.map((r) => r.slice());
    c[9][2] = 1; c[10][1] = 1; add('ç', c);
    const C = glyphs['C'].rows.map((r) => r.slice());
    C[9][2] = 1; C[10][1] = 1; add('Ç', C);
  })();

  // Glyphes spéciaux
  add('œ', fromArt(['.....', '.....', '.XX.X', 'X..XX', 'X.XX.', 'X..XX', '.XX.X']));
  add('Œ', fromArt(['.XXXX', 'X.X..', 'X.XXX', 'X.X..', 'X.X..', 'X.X..', '.XXXX']));
  add('—', fromArt(['.....', '.....', '.....', 'XXXXX', '.....', '.....', '.....']));
  add('–', fromArt(['.....', '.....', '.....', '.XXX.', '.....', '.....', '.....']));
  add('’', fromCols([0x00, 0x00, 0x06, 0x03, 0x00]));
  add('«', fromArt(['.....', '.....', '..X.X', '.X.X.', 'X.X..', '.X.X.', '..X.X']));
  add('»', fromArt(['.....', '.....', 'X.X..', '.X.X.', '..X.X', '.X.X.', 'X.X..']));
  add('…', fromArt(['.....', '.....', '.....', '.....', '.....', '.....', 'X.X.X']));
  add('·', fromArt(['.....', '.....', '.....', '..X..', '.....', '.....', '.....']));
  add('×', fromArt(['.....', '.....', 'X...X', '.X.X.', '..X..', '.X.X.', 'X...X']));
  add('°', fromArt(['.XX..', 'X..X.', 'X..X.', '.XX..', '.....', '.....', '.....']));
  add('★', fromArt(['..X..', '..X..', 'XXXXX', '.XXX.', '.XXX.', 'XX.XX', 'X...X']));
  add('♥', fromArt(['.....', '.X.X.', 'XXXXX', 'XXXXX', '.XXX.', '..X..', '.....']));
  add('▶', fromArt(['X....', 'XX...', 'XXX..', 'XXXX.', 'XXX..', 'XX...', 'X....']));
  add('◀', fromArt(['....X', '...XX', '..XXX', '.XXXX', '..XXX', '...XX', '....X']));
  add('▲', fromArt(['.....', '..X..', '.XXX.', 'XXXXX', '.....', '.....', '.....']));
  add('▼', fromArt(['.....', '.....', '.....', 'XXXXX', '.XXX.', '..X..', '.....']));
  add('✓', fromArt(['.....', '....X', '....X', 'X..X.', '.XX..', '..X..', '.....']));
  add('✕', fromArt(['.....', 'X...X', '.X.X.', '..X..', '.X.X.', 'X...X', '.....']));
  add('←', fromArt(['.....', '..X..', '.X...', 'XXXXX', '.X...', '..X..', '.....']));
  add('→', fromArt(['.....', '..X..', '...X.', 'XXXXX', '...X.', '..X..', '.....']));
  add('−', fromArt(['.....', '.....', '.....', 'XXXXX', '.....', '.....', '.....']));
  add('◆', fromArt(['..X..', '.XXX.', 'XXXXX', '.XXX.', '..X..', '.....', '.....']));

  // Atlas par couleur
  const atlases = {};
  const ORDER = Object.keys(glyphs);
  const idx = {};
  ORDER.forEach((ch, i) => (idx[ch] = i));
  function atlas(color) {
    if (atlases[color]) return atlases[color];
    const c = G.canvas(ORDER.length * CELL_W, ROWS);
    c.ctx.fillStyle = color;
    ORDER.forEach((ch, i) => {
      const rows = glyphs[ch].rows;
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < 5; x++) if (rows[y][x]) c.ctx.fillRect(i * CELL_W + x, y, 1, 1);
    });
    return (atlases[color] = c);
  }

  function adv(ch) {
    const g = glyphs[ch] || glyphs['?'];
    if (ch === ' ') return 3;
    return g.x1 - g.x0 + 2;
  }

  const tr = (s) => (G.tr ? G.tr(String(s)) : String(s));
  G.textW = function (str, scale) {
    scale = scale || 1;
    let w = 0;
    for (const ch of tr(str)) w += adv(ch);
    return Math.max(0, w - 1) * scale;
  };

  function drawRaw(ctx, str, x, y, color, scale) {
    const a = atlas(color);
    let cx = x;
    for (const ch of String(str)) {
      const g = glyphs[ch] || glyphs['?'];
      if (ch !== ' ') {
        const i = idx[glyphs[ch] ? ch : '?'];
        const w = g.x1 - g.x0 + 1;
        ctx.drawImage(a, i * CELL_W + g.x0, 0, w, ROWS, cx, y - 2 * scale, w * scale, ROWS * scale);
      }
      cx += adv(ch) * scale;
    }
  }

  // opts: align ('l'|'c'|'r'), shadow (couleur), outline (couleur), scale
  G.text = function (ctx, str, x, y, color, opts) {
    opts = opts || {};
    const s = opts.scale || 1;
    str = tr(str);
    const w = G.textW(str, s);
    let px = x;
    if (opts.align === 'c') px = x - Math.floor(w / 2);
    else if (opts.align === 'r') px = x - w;
    px = Math.round(px); y = Math.round(y);
    if (opts.outline) {
      for (const d of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, 1], [-1, 1], [1, -1]]) drawRaw(ctx, str, px + d[0] * s, y + d[1] * s, opts.outline, s);
    } else if (opts.shadow) {
      drawRaw(ctx, str, px, y + s, opts.shadow, s);
    }
    drawRaw(ctx, str, px, y, color, s);
    return w;
  };

  // Découpe un texte en lignes selon une largeur max
  G.wrap = function (str, maxW, scale) {
    const out = [];
    tr(str).split('\n').forEach((para) => {
      let line = '';
      para.split(' ').forEach((word) => {
        const t = line ? line + ' ' + word : word;
        if (G.textW(t, scale) > maxW && line) { out.push(line); line = word; } else line = t;
      });
      out.push(line);
    });
    return out;
  };

  G.hasGlyph = (ch) => !!glyphs[ch];
})();
