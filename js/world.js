/* Teyvat Pixel — génération du monde ouvert, rendu du terrain par chunks, collisions, minimap */
(function () {
  const G = window.G;
  const T = G.S.T;
  const TS = 16;
  const World = (G.World = {});
  const W = (World.W = 192), H = (World.H = 144);
  const SEED = 7741;
  World.SEED = SEED;

  const tile = (World.tile = new Uint8Array(W * H));
  const occ = new Uint8Array(W * H); // occupation décor
  const noDeco = new Uint8Array(W * H);
  World.objs = [];
  World.buckets = new Map();
  World.barriers = [];
  World.pois = {};
  World.waypoints = [];
  World.statues = [];
  World.regions = [];
  World.camps = [];
  World.chests = [];
  World.collectibles = [];
  World.npcSpots = [];
  World.seelies = [];

  const idx = (x, y) => y * W + x;
  const inb = (x, y) => x >= 0 && y >= 0 && x < W && y < H;
  const tileAt = (World.tileAt = (x, y) => (inb(x, y) ? tile[idx(x, y)] : T.CLIFF));
  const setT = (x, y, t) => { if (inb(x, y)) tile[idx(x, y)] = t; };
  const isSolidT = (t) => t === T.CLIFF || t === T.WALL;

  // ------------------------------------------------------------------
  // Génération
  // ------------------------------------------------------------------
  function rectFill(x0, y0, x1, y1, t) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) setT(x, y, t); }
  function mark(x0, y0, x1, y1) { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inb(x, y)) noDeco[idx(x, y)] = 1; }

  class Heap {
    constructor() { this.a = []; }
    push(n, p) { const a = this.a; a.push([n, p]); let i = a.length - 1; while (i > 0) { const q = (i - 1) >> 1; if (a[q][1] <= a[i][1]) break; [a[q], a[i]] = [a[i], a[q]]; i = q; } }
    pop() { const a = this.a; const top = a[0]; const last = a.pop(); if (a.length) { a[0] = last; let i = 0; for (;;) { let l = i * 2 + 1, r = l + 1, m = i; if (l < a.length && a[l][1] < a[m][1]) m = l; if (r < a.length && a[r][1] < a[m][1]) m = r; if (m === i) break; [a[m], a[i]] = [a[i], a[m]]; i = m; } } return top; }
    get size() { return this.a.length; }
  }

  function astar(sx, sy, ex, ey) {
    const cost = (x, y) => {
      const t = tileAt(x, y);
      if (t === T.CLIFF || t === T.WALL) return 1e9;
      if (t === T.WATER || t === T.DEEP) return 7;
      if (t === T.DIRT) return 0.45;
      if (t === T.FOREST) return 1.6;
      if (t === T.SAND) return 1.1;
      if (t === T.STONE || t === T.COBBLE) return 0.9;
      return 1;
    };
    const g = new Float32Array(W * H).fill(1e9);
    const from = new Int32Array(W * H).fill(-1);
    const heap = new Heap();
    g[idx(sx, sy)] = 0; heap.push(idx(sx, sy), 0);
    while (heap.size) {
      const [n] = heap.pop();
      const x = n % W, y = (n / W) | 0;
      if (x === ex && y === ey) break;
      for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + d[0], ny = y + d[1];
        if (!inb(nx, ny)) continue;
        const c = cost(nx, ny);
        if (c >= 1e9) continue;
        const ng = g[n] + c;
        const ni = idx(nx, ny);
        if (ng < g[ni]) { g[ni] = ng; from[ni] = n; heap.push(ni, ng + (Math.abs(nx - ex) + Math.abs(ny - ey)) * 0.6); }
      }
    }
    const path = [];
    let cur = idx(ex, ey);
    if (from[cur] === -1 && !(sx === ex && sy === ey)) return path;
    while (cur !== -1) { path.push([cur % W, (cur / W) | 0]); cur = from[cur]; }
    return path.reverse();
  }

  function carveRoad(path, width) {
    path.forEach(([x, y]) => {
      for (let dy = 0; dy < width; dy++) for (let dx = 0; dx < width; dx++) {
        const nx = x + dx, ny = y + dy;
        const t = tileAt(nx, ny);
        if (t === T.WATER || t === T.DEEP) setT(nx, ny, T.BRIDGE);
        else if (t === T.GRASS || t === T.FOREST || t === T.SAND || t === T.DIRT) setT(nx, ny, T.DIRT);
        if (inb(nx, ny)) noDeco[idx(nx, ny)] = 1;
      }
    });
  }

  function addObj(o) {
    World.objs.push(o);
    const bx = Math.floor(o.x / 128), by = Math.floor(o.y / 128);
    const key = bx + ',' + by;
    if (!World.buckets.has(key)) World.buckets.set(key, []);
    World.buckets.get(key).push(o);
    if (o.col) {
      const x0 = Math.floor((o.x + o.col[0]) / TS), x1 = Math.floor((o.x + o.col[0] + o.col[2]) / TS);
      const y0 = Math.floor((o.y + o.col[1]) / TS), y1 = Math.floor((o.y + o.col[1] + o.col[3]) / TS);
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inb(x, y)) occ[idx(x, y)] = 1;
    }
    return o;
  }
  World.addObj = addObj;
  World.removeObj = (o) => {
    const i = World.objs.indexOf(o); if (i >= 0) World.objs.splice(i, 1);
    const key = Math.floor(o.x / 128) + ',' + Math.floor(o.y / 128);
    const b = World.buckets.get(key); if (b) { const j = b.indexOf(o); if (j >= 0) b.splice(j, 1); }
  };

  const TREE_SPR = [], PINE_SPR = [], BUSH_SPR = [], ROCK_SPR = [];
  function makeSprites() {
    for (let i = 0; i < 3; i++) TREE_SPR.push(G.S.tree(i));
    for (let i = 0; i < 2; i++) PINE_SPR.push(G.S.pine(i));
    BUSH_SPR.push(G.S.bush(0), G.S.bush(1));
    ROCK_SPR.push(G.S.rock(0), G.S.rock(1));
  }

  const tcx = (tx) => tx * TS + TS / 2;

  function placeTree(x, y, pine, rnd) {
    const spr = pine ? PINE_SPR[Math.floor(rnd() * PINE_SPR.length)] : TREE_SPR[Math.floor(rnd() * TREE_SPR.length)];
    return addObj({ k: 'tree', x, y, spr, ox: spr.width / 2, oy: spr.height - 3, col: [-4, -5, 8, 5], shadow: [10, 4], sway: rnd() * 6 });
  }

  World.generate = function () {
    makeSprites();
    const rnd = G.rng(SEED);
    // --- terrain de base ---
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let t = T.GRASS;
      const edge = Math.min(x, y, W - 1 - x, H - 1 - y);
      const m = G.fbm(x / 17 + 40, y / 17 + 40, SEED + 3, 4);
      const lk = Math.hypot((x - 104) / 27, (y - 112) / 19) + 0.45 * (G.fbm(x / 9, y / 9, SEED + 5, 3) - 0.5);
      const fn = G.fbm(x / 13, y / 13, SEED + 9, 3);
      if (edge < 3 + 5 * G.fbm(x / 7, y / 7, SEED + 1, 2) || (y < 9 + 6 * G.fbm(x / 8, 0, SEED + 2, 2) && x > 12)) t = T.CLIFF;
      else if (m > 0.69) t = T.CLIFF;
      else if (lk < 1) t = lk < 0.62 ? T.DEEP : T.WATER;
      else if (fn > 0.57 && x < 62) t = T.FOREST;
      tile[idx(x, y)] = t;
    }
    // rivière depuis le lac vers l'ouest + petit étang près de la statue
    for (let x = 10; x < 84; x++) {
      const cy = Math.round(106 + 6 * Math.sin(x / 8.5) + (x < 40 ? (40 - x) * 0.2 : 0));
      for (let dy = -1; dy <= 1; dy++) setT(x, cy + dy, dy === 0 ? T.DEEP : T.WATER);
    }
    for (let y = 70; y <= 82; y++) for (let x = 36; x <= 50; x++) {
      const d = Math.hypot((x - 43) / 7, (y - 76) / 6) + 0.2 * (G.hash2(x, y, 4) - 0.5);
      if (d < 1) setT(x, y, d < 0.6 ? T.DEEP : T.WATER);
    }

    // --- zones dégagées & préfabs ---
    const clear = (x0, y0, x1, y1, t) => { rectFill(x0, y0, x1, y1, t === undefined ? T.GRASS : t); mark(x0, y0, x1, y1); };
    // plateau de la statue
    clear(44, 50, 78, 76);
    // petit étang à nouveau (au sud-ouest du plateau, comme sur la capture)
    for (let y = 70; y <= 82; y++) for (let x = 36; x <= 50; x++) {
      const d = Math.hypot((x - 43) / 7, (y - 77) / 6) + 0.2 * (G.hash2(x, y, 4) - 0.5);
      if (d < 1 && !(x > 51)) setT(x, y, d < 0.6 ? T.DEEP : T.WATER);
    }
    // falaise : anneau autour du plateau
    rectFill(52, 55, 72, 70, T.CLIFF);
    rectFill(54, 58, 70, 68, T.STONE);
    rectFill(71, 62, 73, 64, T.STONE); // rampe est
    rectFill(74, 62, 76, 64, T.DIRT);
    rectFill(53, 65, 53, 66, T.STONE); // petite rampe ouest (décor)
    // cité de Mondstadt
    const CX0 = 112, CX1 = 166, CY0 = 14, CY1 = 56;
    clear(CX0 - 4, CY0 - 3, CX1 + 4, CY1 + 6);
    rectFill(CX0, CY0, CX1, CY1, T.COBBLE);
    for (let x = CX0; x <= CX1; x++) { setT(x, CY0, T.WALL); setT(x, CY1, T.WALL); }
    for (let y = CY0; y <= CY1; y++) { setT(CX0, y, T.WALL); setT(CX1, y, T.WALL); }
    rectFill(137, CY1, 140, CY1, T.COBBLE); // porte sud
    rectFill(CX0, 34, CX0, 37, T.COBBLE); // porte ouest
    rectFill(CX1, 34, CX1, 37, T.COBBLE); // porte est
    // jardin central
    for (let y = 33; y <= 41; y++) for (let x = 133; x <= 145; x++) { const d = Math.hypot((x - 139) / 6.4, (y - 37) / 4.6); if (d < 1) setT(x, y, d < 0.82 ? T.GRASS : T.STONE); }
    mark(CX0 - 4, CY0 - 3, CX1 + 4, CY1 + 6);
    // camp hilichurl (forêt de l'ouest)
    clear(20, 62, 38, 80);
    for (let y = 63; y <= 79; y++) for (let x = 21; x <= 37; x++) { const d = Math.hypot((x - 29) / 8, (y - 71) / 8); if (d < 1) setT(x, y, T.DIRT); }
    // ruines de l'est + domaine
    clear(146, 76, 190, 136);
    rectFill(150, 86, 164, 100, T.STONE);
    for (let i = 0; i < 40; i++) { const x = 148 + Math.floor(rnd() * 20), y = 84 + Math.floor(rnd() * 20); if (tileAt(x, y) === T.GRASS) setT(x, y, T.STONE); }
    // arène du domaine
    rectFill(168, 90, 190, 122, T.CLIFF);
    rectFill(171, 94, 187, 119, T.STONE);
    mark(166, 88, 190, 136);
    // camp mitachurl (sud-est du lac)
    clear(122, 82, 134, 94);
    // débarcadère / embarcadère du lac
    clear(96, 80, 104, 86);

    // forêts de bord : ajouter pins
    // sable autour de l'eau
    for (let pass = 0; pass < 2; pass++) {
      const copy = tile.slice();
      for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
        const t = copy[idx(x, y)];
        if (t !== T.GRASS && t !== T.FOREST) continue;
        let near = false;
        for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) { const n = copy[idx(x + dx, y + dy)]; if (n === T.WATER || n === T.DEEP || (pass === 1 && n === T.SAND)) { near = true; break; } }
        if (near && !(pass === 1 && G.hash2(x, y, 33) > 0.55)) tile[idx(x, y)] = T.SAND;
      }
    }
    // l'étang du plateau doit rester au sud-ouest (marque spawn clair)
    // points d'intérêt (px)
    const P = World.pois;
    P.spawn = { x: 63 * TS, y: 66 * TS };
    P.junction = { x: 86, y: 64 };

    // --- routes ---
    const roads = [
      [[76, 63], [86, 63]],
      [[86, 63], [139, CY1 + 3]],
      [[86, 63], [100, 82]],
      [[86, 63], [30, 72]],
      [[139, CY1 + 3], [150, 92]],
      [[150, 92], [176, 129]],
      [[100, 86], [128, 88]],
      [[128, 88], [150, 92]],
    ];
    roads.forEach(([a, b]) => { const p = astar(a[0], a[1], b[0], b[1]); carveRoad(p, 2); });
    // chemin de la porte sud
    rectFill(137, CY1 + 1, 140, CY1 + 6, T.DIRT);

    // reconnecter les POI par couloirs si nécessaire
    ensureConnectivity();
  };

  function ensureConnectivity() {
    const start = [63, 66];
    const reach = new Uint8Array(W * H);
    const q = [start];
    reach[idx(start[0], start[1])] = 1;
    while (q.length) {
      const [x, y] = q.pop();
      for (const d of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + d[0], ny = y + d[1];
        if (!inb(nx, ny) || reach[idx(nx, ny)]) continue;
        if (isSolidT(tileAt(nx, ny))) continue;
        reach[idx(nx, ny)] = 1; q.push([nx, ny]);
      }
    }
    const targets = [[139, 60], [30, 72], [150, 92], [176, 129], [128, 88], [100, 84]];
    targets.forEach(([tx, ty]) => {
      if (reach[idx(tx, ty)]) return;
      const p = astar(63, 66, tx, ty);
      if (p.length) carveRoad(p, 2);
      else for (let x = 63; x !== tx; x += Math.sign(tx - x)) for (let y = 66; y !== ty; y += Math.sign(ty - y)) { setT(x, 66, T.DIRT); setT(tx, y, T.DIRT); }
    });
  }

  // ------------------------------------------------------------------
  // Décor, bâtiments, objets de jeu
  // ------------------------------------------------------------------
  World.populate = function () {
    const rnd = G.rng(SEED + 100);
    const spr = G.S;
    const bpx = (tx) => tx * TS + TS / 2;

    // ---- Plateau de la statue ----
    const statue = addObj({ k: 'statue', x: bpx(62), y: 62 * TS + 10, spr: spr.statue(true), ox: 25, oy: 72, col: [-8, -6, 16, 8], shadow: [14, 5], anim: () => spr.statue(true) });
    World.statues.push({ id: 'plateau', name: 'Statue des Sept — Plateau', x: statue.x, y: statue.y + 8, obj: statue, offered: 0 });
    World.waypoints.push({ id: 'plateau', name: 'Plateau de la Statue', x: bpx(67), y: 63 * TS, unlocked: true });
    [[68, 66, 1], [69, 59, 0], [56, 66, 1], [58, 59, 1], [55, 61, 1]].forEach(([tx, ty, br]) => {
      addObj({ k: 'pillar', x: bpx(tx), y: ty * TS + 14, spr: spr.pillar(!!br), ox: 9, oy: spr.pillar(!!br).height - 4, col: [-6, -5, 12, 6], shadow: [8, 3] });
    });
    // rangée de ruines au sud-est du plateau (comme sur la capture)
    for (let i = 0; i < 7; i++) {
      const tx = 74 + i * 2, ty = 68 + (i % 3);
      addObj({ k: 'pillar', x: bpx(tx), y: ty * TS + 14, spr: spr.pillar(i % 2 === 0), ox: 9, oy: spr.pillar(i % 2 === 0).height - 4, col: [-6, -5, 12, 6], shadow: [8, 3] });
    }

    // ---- Mondstadt ----
    buildCity(rnd);
    // ---- Camp hilichurl ----
    [[24, 66], [34, 67], [26, 76], [33, 77]].forEach(([tx, ty], i) => addObj({ k: 'tent', x: bpx(tx), y: ty * TS + 14, spr: spr.tent(), ox: 20, oy: 30, col: [-14, -10, 28, 10], shadow: [18, 4] }));
    addObj({ k: 'fire', x: bpx(29), y: 71 * TS + 8, spr: spr.campfire(0), ox: 8, oy: 17, col: [-5, -4, 10, 4], shadow: [6, 2], anim: (t) => spr.campfire(Math.floor(t * 8)), light: 40 });
    [[27, 69], [31, 73], [28, 74]].forEach(([tx, ty]) => addObj({ k: 'crate', x: bpx(tx), y: ty * TS + 12, spr: spr.crate(), ox: 7, oy: 12, col: [-6, -5, 12, 5], shadow: [6, 2] }));
    World.camps.push({ id: 'camp', name: 'Campement hilichurl', x: bpx(29), y: 71 * TS, r: 90, spawns: [['hilichurl', 3], ['hili_archer', 2], ['hili_fighter', 1], ['mitachurl', 1]], respawn: 240 });
    // ---- Ruines & domaine ----
    for (let i = 0; i < 12; i++) {
      const tx = 150 + Math.floor(rnd() * 14), ty = 86 + Math.floor(rnd() * 14);
      if (tileAt(tx, ty) === T.STONE && !occ[idx(tx, ty)]) addObj({ k: 'pillar', x: bpx(tx), y: ty * TS + 14, spr: spr.pillar(rnd() < 0.55), ox: 9, oy: 36, col: [-6, -5, 12, 6], shadow: [8, 3] });
    }
    const gate = addObj({ k: 'domainGate', x: bpx(179), y: 128 * TS + 8, spr: spr.domainGate(), ox: 28, oy: 56, col: [-26, -8, 52, 10], shadow: [26, 5], anim: () => spr.domainGate() });
    World.pois.domain = { x: bpx(179), y: 130 * TS, name: 'Domaine : Tempête de pierre' };
    World.pois.arena = { x0: 171 * TS, y0: 94 * TS, x1: 188 * TS, y1: 120 * TS };
    World.camps.push({ id: 'ruins', name: 'Ruines du vent', x: bpx(157), y: 93 * TS, r: 110, spawns: [['mage_pyro', 1], ['mage_cryo', 1], ['mage_hydro', 1], ['hilichurl', 2]], respawn: 300 });
    World.camps.push({ id: 'mita', name: 'Camp du Mitachurl', x: bpx(128), y: 88 * TS, r: 80, spawns: [['mitachurl', 1], ['hilichurl', 3], ['hili_archer', 1]], respawn: 300 });
    [[124, 84], [132, 84], [126, 92], [132, 92]].forEach(([tx, ty]) => addObj({ k: 'tent', x: bpx(tx), y: ty * TS + 14, spr: spr.tent(), ox: 20, oy: 30, col: [-14, -10, 28, 10], shadow: [18, 4] }));
    addObj({ k: 'fire', x: bpx(128), y: 88 * TS + 8, spr: spr.campfire(0), ox: 8, oy: 17, col: [-5, -4, 10, 4], shadow: [6, 2], anim: (t) => spr.campfire(Math.floor(t * 8)) });
    // ---- Gelées dans la plaine ----
    World.camps.push({ id: 'plain1', name: 'Plaine', x: bpx(90), y: 72 * TS, r: 120, spawns: [['slime_pyro', 1], ['slime_hydro', 1], ['slime_cryo', 1], ['slime_electro', 1]], respawn: 120 });
    World.camps.push({ id: 'plain2', name: 'Plaine', x: bpx(112), y: 68 * TS, r: 110, spawns: [['slime_anemo', 2], ['slime_pyro', 1], ['slime_big', 1]], respawn: 150 });
    World.camps.push({ id: 'lakeside', name: 'Lac du Cidre', x: bpx(80), y: 90 * TS, r: 100, spawns: [['slime_hydro', 2], ['slime_cryo', 1], ['slime_electro', 1]], respawn: 150 });
    World.camps.push({ id: 'north', name: 'Plaine nord', x: bpx(96), y: 40 * TS, r: 120, spawns: [['slime_anemo', 2], ['slime_electro', 1], ['hilichurl', 2]], respawn: 150 });
    World.camps.push({ id: 'east', name: 'Plaine est', x: bpx(172), y: 66 * TS, r: 100, spawns: [['hili_fighter', 2], ['hili_archer', 1], ['slime_pyro', 2]], respawn: 180 });

    // ---- Arbres & décor ----
    for (let ty = 2; ty < H - 2; ty++) for (let tx = 2; tx < W - 2; tx++) {
      const i = idx(tx, ty);
      if (noDeco[i] || occ[i]) continue;
      const t = tile[i];
      if (t === T.GRASS || t === T.FOREST) {
        const cluster = G.fbm(tx / 8 + 20, ty / 8 + 20, SEED + 17, 3);
        let dens = t === T.FOREST ? 0.2 : cluster > 0.6 ? 0.07 : 0.008;
        if (nearT(tx, ty, T.CLIFF, 2)) dens += 0.1;
        const r = rnd();
        if (r < dens) {
          const px = tx * TS + 4 + Math.floor(rnd() * 8), py = ty * TS + 12 + Math.floor(rnd() * 4);
          placeTree(px, py, t === T.FOREST ? rnd() < 0.55 : tx > 110 && rnd() < 0.2, rnd);
          markOcc(tx, ty);
        } else if (r < dens + 0.012) {
          const s = BUSH_SPR[Math.floor(rnd() * 2)];
          addObj({ k: 'bush', x: tx * TS + 8, y: ty * TS + 13, spr: s, ox: 9, oy: 8, col: [-6, -3, 12, 4], shadow: [8, 3] });
          markOcc(tx, ty);
        } else if (r < dens + 0.019) {
          const big = rnd() < 0.4;
          const s = ROCK_SPR[big ? 1 : 0];
          addObj({ k: 'rock', x: tx * TS + 8, y: ty * TS + 13, spr: s, ox: s.width / 2, oy: s.height - 5, col: [-s.width / 2 + 3, -5, s.width - 6, 6], shadow: [s.width / 2 - 1, 3] });
          markOcc(tx, ty);
        }
      }
    }

    // ---- Coffres ----
    const chestSpots = [
      [67, 59, 1], [59, 66, 0], [96, 62, 0], [110, 70, 0], [120, 76, 1], [88, 88, 0], [94, 74, 0], [76, 80, 0],
      [30, 66, 1], [26, 78, 0], [36, 58, 0], [20, 90, 0], [58, 92, 0], [118, 90, 1], [130, 96, 0],
      [158, 92, 2], [166, 84, 1], [152, 104, 0], [100, 50, 0], [80, 34, 1], [104, 30, 0], [150, 62, 0], [175, 64, 0],
      [139, 22, 2], [118, 52, 1], [160, 52, 1],
    ];
    chestSpots.forEach(([tx, ty, tier], n) => {
      const x = tx * TS + 8, y = ty * TS + 12;
      if (isSolidT(tileAt(tx, ty)) || tileAt(tx, ty) === T.WATER || tileAt(tx, ty) === T.DEEP) return;
      World.chests.push({ id: 'c' + n, x, y, tier, opened: false });
    });
    // chests de campements
    World.chests.push({ id: 'cc1', x: 29 * TS + 8, y: 74 * TS, tier: 1, opened: false, locked: 'camp' });
    World.chests.push({ id: 'cc2', x: 129 * TS + 8, y: 90 * TS, tier: 1, opened: false, locked: 'mita' });

    // ---- Anémoculi, fleurs, champignons ----
    const free = (tx, ty) => { const t = tileAt(tx, ty); return (t === T.GRASS || t === T.FOREST || t === T.SAND || t === T.DIRT) && !occ[idx(tx, ty)]; };
    const scatter = (kind, id, count, region) => {
      let n = 0, tries = 0;
      while (n < count && tries++ < 4000) {
        const tx = region ? G.irand(region[0], region[2]) : G.irand(6, W - 7);
        const ty = region ? G.irand(region[1], region[3]) : G.irand(12, H - 8);
        if (!free(tx, ty)) continue;
        World.collectibles.push({ id: kind + n + '_' + tx, kind, item: id, x: tx * TS + 8, y: ty * TS + 8, taken: false, respawn: 0 });
        n++;
      }
    };
    const old = Math.random; Math.random = G.rng(SEED + 7);
    scatter('anemo', 'anemoculus', 18, null);
    scatter('flower', 'flower', 40, [40, 40, 130, 100]);
    scatter('mush', 'mushroom', 16, [8, 40, 55, 100]);
    scatter('dand', 'dandelion', 22, [60, 50, 140, 110]);
    Math.random = old;
    // anémoculi garantis près du plateau
    World.collectibles.push({ id: 'a_start1', kind: 'anemo', item: 'anemoculus', x: 74 * TS, y: 60 * TS, taken: false, respawn: 0 });
    World.collectibles.push({ id: 'a_start2', kind: 'anemo', item: 'anemoculus', x: 82 * TS, y: 70 * TS, taken: false, respawn: 0 });

    // ---- Waypoints & statues supplémentaires ----
    World.waypoints.push({ id: 'city', name: 'Mondstadt — Porte sud', x: bpx(139), y: 59 * TS, unlocked: false });
    World.waypoints.push({ id: 'cityc', name: 'Mondstadt — Place centrale', x: bpx(139), y: 44 * TS, unlocked: false });
    World.waypoints.push({ id: 'lake', name: 'Lac du Cidre', x: bpx(100), y: 83 * TS, unlocked: false });
    World.waypoints.push({ id: 'forest', name: 'Forêt bruissante', x: bpx(40), y: 62 * TS, unlocked: false });
    World.waypoints.push({ id: 'ruins', name: 'Ruines du vent', x: bpx(155), y: 91 * TS, unlocked: false });
    World.waypoints.push({ id: 'domain', name: 'Domaine : Tempête de pierre', x: bpx(173), y: 131 * TS, unlocked: false });
    World.waypoints.push({ id: 'north', name: 'Plaine nord', x: bpx(98), y: 38 * TS, unlocked: false });
    World.waypoints.forEach((w) => {
      addObj({ k: 'waypoint', x: w.x, y: w.y, spr: spr.waypoint(false), ox: 12, oy: 40, col: [-6, -5, 12, 6], shadow: [8, 3], wp: w, anim: (t) => spr.waypoint(w.unlocked) });
    });
    const s2 = addObj({ k: 'statue', x: bpx(139), y: 37 * TS + 8, spr: spr.statue(true), ox: 25, oy: 72, col: [-8, -6, 16, 8], shadow: [14, 5], anim: () => spr.statue(true) });
    World.statues.push({ id: 'city', name: 'Statue des Sept — Mondstadt', x: s2.x, y: s2.y + 8, obj: s2, offered: 0 });
    const s3 = addObj({ k: 'statue', x: bpx(100), y: 78 * TS + 10, spr: spr.statue(true), ox: 25, oy: 72, col: [-8, -6, 16, 8], shadow: [14, 5], anim: () => spr.statue(true) });
    World.statues.push({ id: 'lake', name: 'Statue des Sept — Lac du Cidre', x: s3.x, y: s3.y + 8, obj: s3, offered: 0 });

    // ---- Cours des Séelies ----
    const courts = [
      { x: 92, y: 52, path: [[66, 60], [78, 56], [86, 54], [92, 52]] },
      { x: 48, y: 90, path: [[64, 66], [58, 76], [52, 86], [48, 90]] },
      { x: 120, y: 66, path: [[86, 66], [100, 68], [112, 66], [120, 66]] },
    ];
    courts.forEach((c, i) => {
      World.seelies.push({ id: 's' + i, start: { x: c.path[0][0] * TS, y: c.path[0][1] * TS }, path: c.path.map((p) => ({ x: p[0] * TS + 8, y: p[1] * TS + 8 })), court: { x: c.x * TS + 8, y: c.y * TS + 8 }, done: false });
      addObj({ k: 'court', x: c.x * TS + 8, y: c.y * TS + 12, spr: spr.seelieCourt(), ox: 17, oy: 12, col: null, shadow: null, flat: true, court: i });
    });

    // ---- Lampadaires à Mondstadt ----
    for (let y = 22; y <= 52; y += 10) { addObj({ k: 'lamp', x: 135 * TS + 4, y: y * TS + 14, spr: spr.lamp(), ox: 5, oy: 28, col: [-2, -3, 4, 3], shadow: [4, 2], light: 36 }); addObj({ k: 'lamp', x: 143 * TS + 12, y: y * TS + 14, spr: spr.lamp(), ox: 5, oy: 28, col: [-2, -3, 4, 3], shadow: [4, 2], light: 36 }); }
    // panneaux
    [[78, 62], [100, 60], [32, 62]].forEach(([tx, ty]) => addObj({ k: 'sign', x: tx * TS + 8, y: ty * TS + 14, spr: spr.signpost(), ox: 9, oy: 22, col: [-4, -4, 8, 4], shadow: [6, 2] }));

    // zones nommées
    World.regions = [
      { name: 'Mondstadt', x0: CITY.x0 * TS, y0: CITY.y0 * TS, x1: (CITY.x1 + 1) * TS, y1: (CITY.y1 + 1) * TS },
      { name: 'Plateau de la Statue', x0: 52 * TS, y0: 55 * TS, x1: 74 * TS, y1: 70 * TS },
      { name: 'Forêt bruissante', x0: 6 * TS, y0: 40 * TS, x1: 60 * TS, y1: 100 * TS },
      { name: 'Lac du Cidre', x0: 76 * TS, y0: 80 * TS, x1: 134 * TS, y1: 138 * TS },
      { name: 'Ruines du vent', x0: 146 * TS, y0: 76 * TS, x1: 168 * TS, y1: 118 * TS },
      { name: 'Domaine : Tempête de pierre', x0: 168 * TS, y0: 90 * TS, x1: 190 * TS, y1: 126 * TS },
      { name: 'Plaine de Mondstadt', x0: 0, y0: 0, x1: W * TS, y1: H * TS },
    ];
    // sécurité : retirer coffres/collectibles sur zones non praticables
    World.chests = World.chests.filter((c) => !isSolidT(tileAt(Math.floor(c.x / TS), Math.floor(c.y / TS))));
  };

  function markOcc(tx, ty) { for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (inb(tx + dx, ty + dy)) occ[idx(tx + dx, ty + dy)] = 1; }
  function nearT(tx, ty, t, r) { for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (tileAt(tx + dx, ty + dy) === t) return true; return false; }

  const CITY = { x0: 112, x1: 166, y0: 14, y1: 56 };
  function buildCity(rnd) {
    const spr = G.S;
    const bpx = (tx) => tx * TS + TS / 2;
    World.pois.city = { x: bpx(139), y: 52 * TS };
    // maisons : [tx, ty (haut-gauche), w, h, couleur toit, nom]
    const houses = [
      [116, 20, 5, 4, null, null], [116, 28, 6, 4, '#3f7fd0', 'Maison'], [116, 38, 5, 4, null, 'Taverne'], [117, 47, 5, 4, '#2f9a6a', 'Atelier'],
      [125, 20, 5, 4, '#3f7fd0', null], [124, 28, 6, 4, null, null], [125, 44, 5, 4, null, null],
      [148, 20, 5, 4, null, null], [155, 22, 5, 4, '#3f7fd0', 'Maison'], [148, 28, 6, 4, '#d9a22a', 'Guilde'], [156, 30, 5, 4, null, null],
      [148, 44, 5, 4, null, 'Boutique'], [156, 46, 5, 4, '#3f7fd0', null], [155, 38, 5, 4, null, null],
    ];
    houses.forEach(([tx, ty, w, h, col, name], i) => {
      const s = spr.house(w, h, col, 10 + i);
      const x = bpx(tx + w / 2 - 0.5), y = (ty + h) * TS;
      addObj({ k: 'house', x, y, spr: s, ox: s.width / 2, oy: s.height - 2, col: [-w * 8 + 2, -h * 8 - 2, w * 16 - 4, h * 8 + 2], shadow: null, name, door: { x, y: y + 4 } });
    });
    // cathédrale
    const cat = spr.cathedral();
    addObj({ k: 'cathedral', x: bpx(139) - 8, y: 25 * TS, spr: cat, ox: 56, oy: 118, col: [-44, -26, 88, 26], shadow: null });
    // moulin
    const mill = spr.windmill(0);
    const millObj = addObj({ k: 'windmill', x: bpx(121), y: 20 * TS, spr: mill, ox: 60, oy: 118, col: [-20, -6, 40, 8], shadow: null, anim: (t) => G.S.windmillAnim(Math.floor(t * 6) % 36) });
    // remparts : blocs de mur visuel (par-dessus tuiles WALL)
    for (let x = CITY.x0; x <= CITY.x1; x++) {
      for (const y of [CITY.y0, CITY.y1]) {
        if (tileAt(x, y) !== T.WALL) continue;
        addObj({ k: 'wall', x: x * TS + 8, y: y * TS + 16, spr: spr.wallBlock(), ox: 8, oy: 26, col: null, shadow: null, flat: false });
      }
    }
    for (let y = CITY.y0 + 1; y < CITY.y1; y++) for (const x of [CITY.x0, CITY.x1]) {
      if (tileAt(x, y) !== T.WALL) continue;
      addObj({ k: 'wall', x: x * TS + 8, y: y * TS + 16, spr: spr.wallBlock(), ox: 8, oy: 26, col: null, shadow: null });
    }
    // tonneaux & caisses & clôtures
    [[134, 50], [144, 50], [128, 36], [150, 36], [136, 26]].forEach(([tx, ty], i) => addObj({ k: i % 2 ? 'crate' : 'barrel', x: tx * TS + 8, y: ty * TS + 14, spr: i % 2 ? spr.crate() : spr.barrel(), ox: 7, oy: 12, col: [-5, -4, 10, 4], shadow: [6, 2] }));
    // massifs de fleurs autour du jardin
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      const x = 139 * TS + 8 + Math.cos(a) * 82, y = 37 * TS + 8 + Math.sin(a) * 56;
      addObj({ k: 'bush', x, y, spr: BUSH_SPR[1], ox: 9, oy: 8, col: [-6, -3, 12, 4], shadow: [8, 3] });
    }
  }
  G.S.windmillAnim = (function () {
    const cache = [];
    return (f) => cache[f] || (cache[f] = G.S.windmill(f));
  })();

  // ------------------------------------------------------------------
  // Rendu du terrain
  // ------------------------------------------------------------------
  const PRI = []; PRI[T.WATER] = 0; PRI[T.DEEP] = 0; PRI[T.SAND] = 2; PRI[T.GRASS] = 3; PRI[T.FOREST] = 4; PRI[T.DIRT] = 5; PRI[T.BRIDGE] = 6; PRI[T.FLOOR] = 6; PRI[T.COBBLE] = 7; PRI[T.STONE] = 8; PRI[T.WALL] = 9; PRI[T.CLIFF] = 10;
  const BLEED = []; BLEED[T.SAND] = 3; BLEED[T.GRASS] = 2; BLEED[T.FOREST] = 4; BLEED[T.DIRT] = 3; BLEED[T.COBBLE] = 2;

  const rgbPal = (arr) => arr.map((h) => G.hexToRgb(h));
  const C = G.P;
  const PAL = {
    grass: rgbPal(C.grass), grassD: G.hexToRgb(C.grassD), grassL: G.hexToRgb(C.grassL),
    forest: rgbPal(['#4f9d3f', '#468f38', '#3d8232', '#58a846']), forestD: G.hexToRgb('#2f6f2c'), forestL: G.hexToRgb('#6cbb54'),
    dirt: rgbPal(C.dirt), dirtD: G.hexToRgb(C.dirtD), dirtL: G.hexToRgb(C.dirtL),
    slab: rgbPal(C.slab), slabD: G.hexToRgb(C.slabD), slabL: G.hexToRgb(C.slabL), moss: G.hexToRgb(C.moss),
    cliff: rgbPal(C.cliff), cliffD: G.hexToRgb(C.cliffD), cliffL: G.hexToRgb(C.cliffL),
    water: rgbPal(C.water), waterD: G.hexToRgb(C.waterD), waterL: G.hexToRgb(C.waterL), foam: G.hexToRgb(C.foam), shallow: G.hexToRgb(C.shallow),
    sand: rgbPal(C.sand), sandD: G.hexToRgb(C.sandD),
    cobble: rgbPal(C.cobble), cobbleD: G.hexToRgb(C.cobbleD), cobbleL: G.hexToRgb(C.cobbleL),
    wood: rgbPal(['#a9764a', '#9a6a42', '#b4814f']), woodD: G.hexToRgb('#6a4226'),
    wall: rgbPal(['#c9c3b3', '#bdb7a7']), wallD: G.hexToRgb('#8a8474'), wallL: G.hexToRgb('#e2dccc'),
  };
  const hash2 = G.hash2, vnoise = G.vnoise;

  // Voronoï : retourne d1, d2 et id de cellule
  const vr = { d1: 0, d2: 0, id: 0, cx: 0, cy: 0 };
  function voro(wx, wy, cell, seed) {
    const gx = Math.floor(wx / cell), gy = Math.floor(wy / cell);
    let d1 = 1e9, d2 = 1e9, id = 0, bx = 0, by = 0;
    for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) {
      const cx = gx + i, cy = gy + j;
      const px = (cx + 0.15 + 0.7 * hash2(cx, cy, seed)) * cell, py = (cy + 0.15 + 0.7 * hash2(cx, cy, seed + 1)) * cell;
      const d = Math.hypot(wx - px, wy - py);
      if (d < d1) { d2 = d1; d1 = d; id = hash2(cx, cy, seed + 2); bx = px; by = py; } else if (d < d2) d2 = d;
    }
    vr.d1 = d1; vr.d2 = d2; vr.id = id; vr.cx = bx; vr.cy = by;
    return vr;
  }

  function pixType(wx, wy) {
    const tx = wx >> 4, ty = wy >> 4, lx = wx & 15, ly = wy & 15;
    const t = tileAt(tx, ty);
    let best = t, bp = PRI[t];
    let n, p;
    const chk = (nx, ny, d) => {
      n = tileAt(nx, ny); p = PRI[n];
      if (p > bp && BLEED[n] > 0) {
        const j = BLEED[n] * (0.3 + 1.0 * vnoise(wx / 2.5, wy / 2.5, 5));
        if (d < j) { best = n; bp = p; }
      }
    };
    chk(tx, ty - 1, ly); chk(tx, ty + 1, 15 - ly); chk(tx - 1, ty, lx); chk(tx + 1, ty, 15 - lx);
    return best;
  }

  const CHUNK = 256;
  const M = 4; // marge pour les passes d'ombre / bord
  const BUF = CHUNK + M * 2;
  const tbuf = new Uint8Array(BUF * BUF);
  World.chunks = [];

  function colorPixel(t, wx, wy, i, j, out) {
    let c;
    switch (t) {
      case T.GRASS: case T.FOREST: {
        const forest = t === T.FOREST;
        const P = forest ? PAL.forest : PAL.grass;
        const nn = vnoise(wx / 9, wy / 9, 11);
        c = P[nn < 0.38 ? 0 : nn < 0.68 ? 1 : 2];
        if (hash2(wx, wy, 21) < 0.012) c = P[3];
        const hb = hash2(wx, wy >> 1, 2);
        if (hb < 0.045) c = forest ? PAL.forestD : PAL.grassD;
        else if (hb < 0.065) c = forest ? PAL.forestL : PAL.grassL;
        if (!forest) {
          const fx = wx & 3, fy = wy & 3;
          if (hash2(wx >> 2, wy >> 2, 77) < 0.022) {
            const dx = fx - 1, dy = fy - 1;
            if (dx === 0 && dy === 0) c = [248, 226, 96];
            else if (Math.abs(dx) + Math.abs(dy) === 1) {
              const k = hash2(wx >> 2, wy >> 2, 78);
              c = k < 0.4 ? [255, 255, 255] : k < 0.7 ? [247, 166, 196] : [167, 200, 255];
            }
          }
        }
        break;
      }
      case T.DIRT: {
        const nn = vnoise(wx / 5, wy / 5, 31);
        c = PAL.dirt[nn < 0.4 ? 0 : nn < 0.72 ? 1 : 2];
        const h = hash2(wx, wy, 32);
        if (h < 0.03) c = PAL.dirtL; else if (h < 0.06) c = PAL.dirtD;
        break;
      }
      case T.SAND: {
        const nn = vnoise(wx / 6, wy / 6, 41);
        c = PAL.sand[nn < 0.4 ? 0 : nn < 0.7 ? 1 : 2];
        if (hash2(wx, wy, 42) < 0.04) c = PAL.sandD;
        break;
      }
      case T.STONE: {
        voro(wx, wy, 21, 51);
        const edge = vr.d2 - vr.d1;
        if (edge < 1.6) { c = PAL.slabD; if (edge > 0.9 && vr.id > 0.8 && hash2(wx, wy, 53) < 0.6) c = PAL.moss; }
        else {
          c = PAL.slab[Math.floor(vr.id * 3.99)];
          if (edge < 3.0 && wx - vr.cx + (wy - vr.cy) < 0) c = PAL.slabL;
          else if (hash2(wx, wy, 52) < 0.018) c = PAL.slabD;
        }
        break;
      }
      case T.COBBLE: {
        voro(wx, wy, 7, 61);
        const edge = vr.d2 - vr.d1;
        if (edge < 1.1) c = PAL.cobbleD;
        else { c = PAL.cobble[Math.floor(vr.id * 2.99)]; if (wx - vr.cx < -1 && wy - vr.cy < -1) c = PAL.cobbleL; }
        break;
      }
      case T.CLIFF: {
        const tx = wx >> 4, ty = wy >> 4, ly = wy & 15;
        const aboveCliff = tileAt(tx, ty - 1) === T.CLIFF, belowCliff = tileAt(tx, ty + 1) === T.CLIFF;
        const col = hash2(wx >> 1, 0, 71);
        c = PAL.cliff[col < 0.33 ? 0 : col < 0.66 ? 1 : 2];
        const crack = hash2(wx >> 2, (wy + (wx >> 2) * 5) >> 3, 72);
        if (crack < 0.16) c = PAL.cliff[1];
        if (hash2(wx >> 1, wy >> 3, 73) < 0.1 && (wy & 7) === 0) c = PAL.cliffD;
        if (!aboveCliff && ly < 2) c = ly === 0 ? PAL.cliffL : PAL.cliff[2];
        if (!aboveCliff && ly >= 2 && ly < 4 && hash2(wx, ty, 74) < 0.5) c = PAL.moss;
        if (!belowCliff) { if (ly >= 14) c = PAL.cliffD; else if (ly >= 11) c = PAL.cliff[1]; }
        break;
      }
      case T.WALL: {
        const ty = wy >> 4, ly = wy & 15;
        const row = (wy >> 3), off = (row & 1) * 4;
        c = PAL.wall[(row + (wx >> 3)) & 1];
        if ((wy & 7) === 7 || ((wx + off) & 7) === 7) c = PAL.wallD;
        if (tileAt(wx >> 4, ty - 1) !== T.WALL && ly < 3) c = PAL.wallL;
        break;
      }
      case T.BRIDGE: {
        const k = (wy >> 2) & 1;
        c = PAL.wood[k ? 0 : 2];
        if ((wy & 3) === 3) c = PAL.woodD;
        if ((wx & 15) < 2 || (wx & 15) > 13) c = PAL.woodD;
        break;
      }
      case T.WATER: case T.DEEP: {
        const deep = t === T.DEEP;
        const nn = vnoise(wx / 7, wy / 3, 81);
        c = PAL.water[nn < 0.4 ? 0 : nn < 0.7 ? 1 : 2];
        if (deep) c = PAL.water[nn < 0.5 ? 1 : 0];
        break;
      }
      default: c = [255, 0, 255];
    }
    out[0] = c[0]; out[1] = c[1]; out[2] = c[2];
  }

  function renderChunk(cx, cy) {
    const ox = cx * CHUNK, oy = cy * CHUNK;
    for (let j = 0; j < BUF; j++) for (let i = 0; i < BUF; i++) tbuf[j * BUF + i] = pixType(ox + i - M, oy + j - M);
    const cv = G.canvas(CHUNK, CHUNK);
    const img = cv.ctx.createImageData(CHUNK, CHUNK);
    const d = img.data;
    const rgb = [0, 0, 0];
    const tb = (i, j) => tbuf[(j + M) * BUF + (i + M)];
    for (let j = 0; j < CHUNK; j++) for (let i = 0; i < CHUNK; i++) {
      const wx = ox + i, wy = oy + j;
      const t = tb(i, j);
      colorPixel(t, wx, wy, i, j, rgb);
      let r = rgb[0], g = rgb[1], b = rgb[2];
      // passes de bord et d'ombre
      if (t === T.WATER || t === T.DEEP) {
        const n1 = tb(i, j - 1), s1 = tb(i, j + 1), w1 = tb(i - 1, j), e1 = tb(i + 1, j);
        const land = (q) => q !== T.WATER && q !== T.DEEP;
        if (land(n1) || land(s1) || land(w1) || land(e1)) { r = PAL.foam[0]; g = PAL.foam[1]; b = PAL.foam[2]; }
        else if (land(tb(i, j - 2)) || land(tb(i, j + 2)) || land(tb(i - 2, j)) || land(tb(i + 2, j)) || land(tb(i - 1, j - 1)) || land(tb(i + 1, j + 1)) || land(tb(i - 1, j + 1)) || land(tb(i + 1, j - 1))) { r = PAL.shallow[0]; g = PAL.shallow[1]; b = PAL.shallow[2]; }
        else if (t === T.WATER && (land(tb(i, j - 3)) || land(tb(i, j + 3)) || land(tb(i - 3, j)) || land(tb(i + 3, j)))) { r = (r + PAL.shallow[0]) >> 1; g = (g + PAL.shallow[1]) >> 1; b = (b + PAL.shallow[2]) >> 1; }
      } else if (t === T.DIRT) {
        const dn = tb(i, j + 1), up = tb(i, j - 1);
        if (dn !== T.DIRT && dn !== T.BRIDGE && PRI[dn] < PRI[T.DIRT]) { r = PAL.dirtD[0]; g = PAL.dirtD[1]; b = PAL.dirtD[2]; }
        else if (up !== T.DIRT && PRI[up] < PRI[T.DIRT] && up !== T.BRIDGE) { r = Math.min(255, r + 16); g = Math.min(255, g + 16); b = Math.min(255, b + 12); }
      } else if (t === T.SAND) {
        const q = [tb(i, j - 1), tb(i, j + 1), tb(i - 1, j), tb(i + 1, j)];
        if (q.some((v) => v === T.WATER || v === T.DEEP)) { r = PAL.sandD[0]; g = PAL.sandD[1]; b = PAL.sandD[2]; }
      } else if (t === T.STONE) {
        const dn = tb(i, j + 1), up = tb(i, j - 1), lf = tb(i - 1, j), rt = tb(i + 1, j);
        if (dn !== T.STONE && dn !== T.COBBLE) { r = PAL.slabD[0] - 14; g = PAL.slabD[1] - 14; b = PAL.slabD[2] - 12; }
        else if (up === T.CLIFF) { r *= 0.8; g *= 0.8; b *= 0.8; }
        else if (lf === T.CLIFF || rt === T.CLIFF) { r *= 0.88; g *= 0.88; b *= 0.88; }
      }
      // ombres portées des falaises / murs sur le sol (vers le sud)
      if (t !== T.CLIFF && t !== T.WALL && t !== T.WATER && t !== T.DEEP) {
        let sh = 0;
        if (tb(i, j - 1) === T.CLIFF || tb(i, j - 1) === T.WALL) sh = 0.3;
        else if (tb(i, j - 2) === T.CLIFF || tb(i, j - 2) === T.WALL) sh = 0.2;
        else if (tb(i, j - 3) === T.CLIFF || tb(i, j - 3) === T.WALL) sh = 0.1;
        if (sh) { r *= 1 - sh; g *= 1 - sh * 0.9; b *= 1 - sh * 0.6; }
      }
      const o = (j * CHUNK + i) * 4;
      d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255;
    }
    cv.ctx.putImageData(img, 0, 0);
    return cv;
  }

  World.buildChunks = async function (progress) {
    const nx = Math.ceil((W * TS) / CHUNK), ny = Math.ceil((H * TS) / CHUNK);
    let n = 0;
    for (let cy = 0; cy < ny; cy++) for (let cx = 0; cx < nx; cx++) {
      World.chunks[cy * nx + cx] = renderChunk(cx, cy);
      n++;
      if (n % 3 === 0) { if (progress) progress(n / (nx * ny)); await new Promise((r) => setTimeout(r, 0)); }
    }
    World.nx = nx; World.ny = ny;
    buildMinimap();
  };

  World.drawGround = function (ctx, camX, camY, vw, vh, t) {
    const nx = World.nx;
    const cx0 = Math.max(0, Math.floor(camX / CHUNK)), cx1 = Math.min(nx - 1, Math.floor((camX + vw) / CHUNK));
    const cy0 = Math.max(0, Math.floor(camY / CHUNK)), cy1 = Math.min(World.ny - 1, Math.floor((camY + vh) / CHUNK));
    for (let cy = cy0; cy <= cy1; cy++) for (let cx = cx0; cx <= cx1; cx++) {
      const c = World.chunks[cy * nx + cx];
      if (c) ctx.drawImage(c, cx * CHUNK - camX, cy * CHUNK - camY);
    }
    // éclats d'eau animés
    const tx0 = Math.max(0, Math.floor(camX / TS)), tx1 = Math.min(W - 1, Math.floor((camX + vw) / TS));
    const ty0 = Math.max(0, Math.floor(camY / TS)), ty1 = Math.min(H - 1, Math.floor((camY + vh) / TS));
    ctx.fillStyle = 'rgba(235,250,255,0.85)';
    for (let ty = ty0; ty <= ty1; ty++) for (let tx = tx0; tx <= tx1; tx++) {
      const tt = tile[idx(tx, ty)];
      if (tt !== T.WATER && tt !== T.DEEP) continue;
      const h = hash2(tx, ty, 91);
      if (h > 0.4) continue;
      const ph = (t * 0.9 + h * 20) % 3;
      if (ph > 1.6) continue;
      const gx = tx * TS + 3 + Math.floor(h * 20) % 9, gy = ty * TS + 4 + Math.floor(h * 50) % 8;
      const w = ph < 0.8 ? 3 : 5;
      ctx.fillRect(Math.round(gx - camX), Math.round(gy - camY), w, 1);
    }
  };

  // Objets dans une zone écran
  World.objsIn = function (x0, y0, x1, y1) {
    const out = [];
    for (let by = Math.floor(y0 / 128); by <= Math.floor(y1 / 128); by++) for (let bx = Math.floor(x0 / 128); bx <= Math.floor(x1 / 128); bx++) {
      const b = World.buckets.get(bx + ',' + by);
      if (b) for (const o of b) out.push(o);
    }
    return out;
  };

  // ------------------------------------------------------------------
  // Collisions
  // ------------------------------------------------------------------
  World.isWater = (x, y) => { const t = tileAt(Math.floor(x / TS), Math.floor(y / TS)); return t === T.WATER || t === T.DEEP; };
  World.isSolidAt = (x, y) => isSolidT(tileAt(Math.floor(x / TS), Math.floor(y / TS)));
  World.blockedBox = function (x, y, hw, hh) {
    // boîte aux pieds : [x-hw, x+hw] × [y-hh, y]
    const x0 = x - hw, x1 = x + hw, y0 = y - hh, y1 = y;
    if (isSolidT(tileAt(Math.floor(x0 / TS), Math.floor(y0 / TS))) || isSolidT(tileAt(Math.floor(x1 / TS), Math.floor(y0 / TS))) || isSolidT(tileAt(Math.floor(x0 / TS), Math.floor(y1 / TS))) || isSolidT(tileAt(Math.floor(x1 / TS), Math.floor(y1 / TS)))) return true;
    for (const o of World.objsIn(x0 - 40, y0 - 40, x1 + 40, y1 + 40)) {
      if (!o.col || o.gone) continue;
      const cx0 = o.x + o.col[0], cy0 = o.y + o.col[1], cx1 = cx0 + o.col[2], cy1 = cy0 + o.col[3];
      if (x1 > cx0 && x0 < cx1 && y1 > cy0 && y0 < cy1) return true;
    }
    for (const b of World.barriers) if (b.active && x1 > b.x && x0 < b.x + b.w && y1 > b.y && y0 < b.y + b.h) return true;
    return false;
  };
  // Déplace avec résolution par axe ; renvoie true si bloqué
  World.move = function (e, dx, dy, hw, hh) {
    let hit = false;
    if (dx) { if (!World.blockedBox(e.x + dx, e.y, hw, hh)) e.x += dx; else hit = true; }
    if (dy) { if (!World.blockedBox(e.x, e.y + dy, hw, hh)) e.y += dy; else hit = true; }
    return hit;
  };
  World.region = function (x, y) {
    for (const r of World.regions) if (x >= r.x0 && x < r.x1 && y >= r.y0 && y < r.y1) return r.name;
    return '';
  };

  // ------------------------------------------------------------------
  // Minimap (1 pixel par tuile)
  // ------------------------------------------------------------------
  function buildMinimap() {
    const c = G.canvas(W, H);
    const col = {};
    col[T.GRASS] = '#78c455'; col[T.FOREST] = '#4e9a43'; col[T.DIRT] = '#d9b87a'; col[T.STONE] = '#c9c3a6'; col[T.CLIFF] = '#8d8977';
    col[T.WATER] = '#4db3ea'; col[T.DEEP] = '#2f8ed2'; col[T.SAND] = '#efdca8'; col[T.COBBLE] = '#bdb7a8'; col[T.BRIDGE] = '#9a6a42'; col[T.WALL] = '#7b7566'; col[T.FLOOR] = '#a9764a';
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { c.ctx.fillStyle = col[tile[idx(x, y)]]; c.ctx.fillRect(x, y, 1, 1); }
    World.mini = c;
  }
})();
