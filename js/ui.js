/* Teyvat Pixel — interface : HUD fidèle à la capture (mobile), dialogues, bannières, outils UI */
(function () {
  const G = window.G;
  const UI = (G.UI = { regions: [], shakes: {} });
  const px = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const cache = {};

  UI.begin = function () { UI.regions.length = 0; };
  UI.region = function (x, y, w, h, o) { const r = Object.assign({ x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(h) }, o); UI.regions.push(r); return r; };
  UI.hit = function (x, y) {
    for (let i = UI.regions.length - 1; i >= 0; i--) { const r = UI.regions[i]; if (x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) return r; }
    return null;
  };
  G.hudShake = (n) => { UI.shakes[n] = 0.3; };

  // ---------- Thème ----------
  UI.C = {
    panel: '#ece5d8', panelD: '#d9d0bd', ink: '#3b4255', inkL: '#6a7388', gold: '#d3bc8e', goldD: '#a8905a', night: '#1c2238', night2: '#2b3350',
    rar: ['#8d94a0', '#8d94a0', '#5fa874', '#5a9ad8', '#b070e0', '#e8a838'],
  };

  // ---------- Sprites utilitaires ----------
  const circ = (r, fill, stroke) => { const k = 'c' + r + fill + stroke; return cache[k] || (cache[k] = G.circleSprite(r, fill, stroke, 1)); };
  UI.circ = circ;
  const portrait = (id) => {
    const p = G.S.portrait(id, 24);
    if (p.__id === undefined) p.__id = id;
    const k = 'port' + id;
    if (cache[k]) return cache[k];
    const c = G.canvas(25, 25);
    c.ctx.drawImage(p, 0, 0);
    c.ctx.globalCompositeOperation = 'destination-in';
    c.ctx.drawImage(circ(11, '#fff', null), 0, 0);
    const out = G.canvas(26, 26);
    out.ctx.drawImage(circ(12, null, '#f4f1e8'), 0, 0);
    out.ctx.drawImage(c, 1, 1);
    return (cache[k] = out);
  };
  UI.portrait = portrait;

  const outCache = new Map();
  UI.outlined = function (ic) {
    let o = outCache.get(ic);
    if (!o) { o = G.outline(ic, 'rgba(18,26,48,0.95)'); outCache.set(ic, o); }
    return o;
  };

  // ---------- Mise en page (fidèle à la capture 2000×878) ----------
  UI.layout = function (w, h) {
    const u = h / 878;
    const mx = (v, min) => Math.max(min, v);
    const L = { u, w, h };
    L.paimon = { x: Math.round(mx(135 * u, 15)), y: Math.round(mx(48 * u, 15)), r: Math.round(mx(35 * u, 12)) };
    const mr = Math.round(mx(105 * u, 24));
    L.mini = { r: mr, x: Math.round(L.paimon.x + 20 * u + mr * 0.62 + 10), y: Math.round(mx(115 * u, mr + 3)) };
    L.mini.x = Math.max(L.mini.x, L.paimon.x + mr * 0.9 + 4);
    L.eye = { x: L.mini.x + mr + 10, y: L.paimon.y - 1 };
    L.radar = { x: L.eye.x + 25, y: L.eye.y };
    L.quest = { x: L.paimon.x, y: Math.round(L.mini.y + mr * 0.45) };
    L.chat = { x: L.paimon.x, y: h - Math.round(mx(75 * u, 18)) };
    L.ar = { x: Math.round(w / 2), y: Math.round(mx(52 * u, 20)) };
    const sp = Math.max(22, Math.round(92 * u));
    L.top = [];
    for (let i = 0; i < 6; i++) L.top.push({ x: w - Math.round(mx(147 * u, 18)) - i * sp, y: Math.round(mx(48 * u, 14)) });
    L.ping = { x: w - Math.round(mx(147 * u, 18)), y: L.top[0].y + Math.round(mx(45 * u, 16)) };
    // boutons d'action
    const R = (v, min) => Math.round(mx(v * u, min));
    L.attack = { x: w - Math.round(403 * u), y: h - Math.round(208 * u), r: R(75, 17) };
    L.jump = { x: w - Math.round(255 * u), y: h - Math.round(308 * u), r: R(50, 12) };
    L.sprint = { x: w - Math.round(255 * u), y: h - Math.round(123 * u), r: R(50, 12) };
    L.skill = { x: w - Math.round(687 * u), y: h - Math.round(93 * u), r: R(44, 11) };
    L.burst = { x: w - Math.round(557 * u), y: h - Math.round(121 * u), r: R(54, 13) };
    // les boutons ne doivent pas sortir de l'écran
    for (const k of ['attack', 'jump', 'sprint', 'skill', 'burst']) { const b = L[k]; b.y = Math.min(h - b.r - 2, b.y); }
    // barre de PV centrale
    L.hpbar = { right: Math.round(Math.min(w * 0.575, L.skill.x - L.skill.r - 24)), w: Math.round(Math.max(60, 305 * u)), y: h - Math.round(mx(70 * u, 11)) };
    L.hpbar.left = L.hpbar.right - L.hpbar.w;
    L.gadget = { x: L.hpbar.left - 56, y: L.hpbar.y - 3 };
    if (L.gadget.x - 11 < L.chat.x + 12) L.chat.y = L.gadget.y - 26; // écran étroit : le chat passe au-dessus
    // équipe
    L.party = [];
    const py0 = Math.max(mx(193 * u, 34), L.ping.y + 18);
    for (let i = 0; i < 3; i++) L.party.push({ y: Math.round(py0 + i * mx(88 * u, 22)) });
    L.pr = { x: w - Math.round(mx(55 * u, 17)) };
    return L;
  };

  // ---------- Bulles et boutons ronds ----------
  function roundBtn(ctx, b, alpha, ring) {
    ctx.globalAlpha = alpha == null ? 1 : alpha;
    const s = circ(b.r, 'rgba(20,28,48,0.55)', ring || 'rgba(235,240,255,0.55)');
    ctx.drawImage(s, Math.round(b.x - b.r), Math.round(b.y - b.r));
    ctx.globalAlpha = 1;
  }
  function dot(ctx, x, y) { ctx.drawImage(circ(3, '#e8453c', '#ffe9e0'), Math.round(x - 3), Math.round(y - 3)); }
  function pie(ctx, b, frac, color) { // secteur de recharge (frac = part restante)
    const r = b.r - 1;
    ctx.fillStyle = color;
    for (let y = -r; y <= r; y++) for (let x = -r; x <= r; x++) {
      if (x * x + y * y > r * r) continue;
      let a = Math.atan2(x, -y); if (a < 0) a += Math.PI * 2;
      if (a / (Math.PI * 2) >= 1 - frac) ctx.fillRect(Math.round(b.x + x), Math.round(b.y + y), 1, 1);
    }
  }
  function arc(ctx, cx, cy, r, frac, color, th) {
    ctx.fillStyle = color;
    const n = Math.floor(frac * r * 7);
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i / (r * 7)) * Math.PI * 2;
      for (let k = 0; k < (th || 1); k++) ctx.fillRect(Math.round(cx + Math.cos(a) * (r - k)), Math.round(cy + Math.sin(a) * (r - k)), 1, 1);
    }
  }
  UI.arc = arc;

  // ---------- Minimap ----------
  let miniTmp = null, miniMask = null, miniMaskR = 0;
  function drawMinimap(ctx, L, t) {
    const m = L.mini, r = m.r, P = G.P, W = G.World;
    const d = r * 2 + 1;
    if (!miniTmp || miniTmp.width !== d) { miniTmp = G.canvas(d, d); }
    if (miniMaskR !== r) { miniMask = G.circleSprite(r, '#fff', null); miniMaskR = r; }
    const tc = miniTmp.ctx;
    tc.globalCompositeOperation = 'source-over';
    tc.clearRect(0, 0, d, d);
    tc.fillStyle = '#2f6aa8'; tc.fillRect(0, 0, d, d);
    const ptx = P.x / G.TS, pty = P.y / G.TS;
    const sx = Math.floor(ptx) - r, sy = Math.floor(pty) - r;
    tc.drawImage(W.mini, sx, sy, d, d, 0, 0, d, d);
    const ox = (ptx - Math.floor(ptx)) * 1, oy = (pty - Math.floor(pty)) * 1;
    const cx = r, cy = r;
    const toM = (wx, wy) => [Math.round(cx + (wx - P.x) / G.TS), Math.round(cy + (wy - P.y) / G.TS)];
    // marqueurs
    for (const w of W.waypoints) {
      const [x, y] = toM(w.x, w.y);
      if (x < -2 || y < -2 || x > d + 2 || y > d + 2) continue;
      tc.fillStyle = w.unlocked ? '#e8f8ff' : '#7a8aa8'; tc.fillRect(x - 2, y - 2, 5, 5);
      tc.fillStyle = w.unlocked ? '#3fa9ff' : '#4a5a78'; tc.fillRect(x - 1, y - 1, 3, 3);
    }
    for (const s of W.statues) { const [x, y] = toM(s.x, s.y); tc.fillStyle = '#fff6c8'; tc.fillRect(x - 2, y - 2, 5, 5); tc.fillStyle = '#e8a838'; tc.fillRect(x - 1, y - 1, 3, 3); }
    { const dm = W.pois.domain; const [x, y] = toM(dm.x, dm.y); tc.fillStyle = '#e8d9ff'; tc.fillRect(x - 2, y - 2, 5, 5); tc.fillStyle = '#8a5ae0'; tc.fillRect(x - 1, y - 1, 3, 3); }
    // séelies
    for (const s of W.seelies) if (!s.done) { const [x, y] = toM(s.x, s.y); if (Math.hypot(s.x - P.x, s.y - P.y) < 340) { tc.fillStyle = '#b9a2ff'; tc.fillRect(x - 1, y - 1, 3, 3); } }
    // ennemis proches
    for (const e of G.E.enemies) if (!e.dead && e.alert && Math.hypot(e.x - P.x, e.y - P.y) < 280) { const [x, y] = toM(e.x, e.y); tc.fillStyle = '#ff5a5a'; tc.fillRect(x, y, 2, 2); }
    // objectif de quête
    const tg = G.Quest.target();
    let tgPos = null;
    if (tg && G.state.settings.hints !== false) {
      let [x, y] = toM(tg.x, tg.y);
      const dx = x - cx, dy = y - cy, dl = Math.hypot(dx, dy);
      if (dl > r - 4) { x = Math.round(cx + (dx / dl) * (r - 4)); y = Math.round(cy + (dy / dl) * (r - 4)); }
      tgPos = [x, y];
    }
    // cône de vue
    tc.fillStyle = 'rgba(120,240,255,0.28)';
    for (let k = 0; k < 14; k++) {
      const len = 4 + k;
      for (let a = -0.5; a <= 0.5; a += 0.12) tc.fillRect(Math.round(cx + Math.cos(P.ang + a) * len), Math.round(cy + Math.sin(P.ang + a) * len), 1, 1);
    }
    // masque circulaire
    tc.globalCompositeOperation = 'destination-in';
    tc.drawImage(miniMask, 0, 0);
    tc.globalCompositeOperation = 'source-over';
    const X = Math.round(m.x - r), Y = Math.round(m.y - r);
    ctx.drawImage(circ(r + 3, '#2a2f44', null), X - 3, Y - 3);
    ctx.drawImage(miniTmp, X, Y);
    ctx.drawImage(circ(r + 2, null, '#d8c9a0'), X - 2, Y - 2);
    ctx.drawImage(circ(r + 3, null, '#3a3a52'), X - 3, Y - 3);
    // objectif
    if (tgPos) { const x = X + tgPos[0], y = Y + tgPos[1]; px(ctx, x - 3, y - 1, 7, 3, '#3a2a10'); px(ctx, x - 1, y - 3, 3, 7, '#3a2a10'); px(ctx, x - 2, y, 5, 1, '#ffd45a'); px(ctx, x, y - 2, 1, 5, '#ffd45a'); px(ctx, x - 1, y - 1, 3, 3, '#ffd45a'); }
    // flèche du joueur (tournée selon l'angle)
    const a = P.ang;
    const tipx = m.x + Math.cos(a) * 4, tipy = m.y + Math.sin(a) * 4;
    ctx.fillStyle = '#1a3a4a';
    const pts = [[Math.cos(a) * 5, Math.sin(a) * 5], [Math.cos(a + 2.5) * 4, Math.sin(a + 2.5) * 4], [Math.cos(a - 2.5) * 4, Math.sin(a - 2.5) * 4]];
    triFill(ctx, m.x, m.y, pts, '#1a3a4a', 1);
    triFill(ctx, m.x, m.y, pts, '#4fe8ff', 0);
    // N
    G.text(ctx, 'N', m.x, Y - 3, '#ffffff', { align: 'c', outline: '#26324a' });
    // région cliquable → carte
    UI.region(X, Y, d, d, { onClick: () => G.Menus.open('map') });
  }
  function triFill(ctx, cx, cy, pts, color, grow) {
    ctx.fillStyle = color;
    const [a, b, c] = pts;
    const minx = Math.floor(Math.min(a[0], b[0], c[0])) - grow, maxx = Math.ceil(Math.max(a[0], b[0], c[0])) + grow;
    const miny = Math.floor(Math.min(a[1], b[1], c[1])) - grow, maxy = Math.ceil(Math.max(a[1], b[1], c[1])) + grow;
    const sgn = (p, q, r) => (p[0] - r[0]) * (q[1] - r[1]) - (q[0] - r[0]) * (p[1] - r[1]);
    for (let y = miny; y <= maxy; y++) for (let x = minx; x <= maxx; x++) {
      const p = [x, y];
      const d1 = sgn(p, a, b), d2 = sgn(p, b, c), d3 = sgn(p, c, a);
      const neg = d1 < -grow * 3 || d2 < -grow * 3 || d3 < -grow * 3, pos = d1 > grow * 3 || d2 > grow * 3 || d3 > grow * 3;
      if (!(neg && pos)) ctx.fillRect(Math.round(cx + x), Math.round(cy + y), 1, 1);
    }
  }

  // ---------- HUD principal ----------
  UI.drawHUD = function (ctx, w, h, t) {
    const S = G.state, P = G.P, I = G.input;
    const L = UI.L = UI.layout(w, h);
    const cs = G.cs();
    const def = G.CHARS[cs.id], st = G.charStats(cs);
    const touch = I.touch;

    // --- Paimon (menu) ---
    roundBtn(ctx, L.paimon, 0.9, '#e8e0cc');
    const ph = G.I.paimonHead();
    ctx.drawImage(ph, Math.round(L.paimon.x - ph.width / 2), Math.round(L.paimon.y - ph.height / 2));
    if (G.menuDot) dot(ctx, L.paimon.x + L.paimon.r * 0.7, L.paimon.y - L.paimon.r * 0.7);
    UI.region(L.paimon.x - L.paimon.r, L.paimon.y - L.paimon.r, L.paimon.r * 2, L.paimon.r * 2, { onClick: () => G.Menus.open('paimon') });

    drawMinimap(ctx, L, t);

    // --- vue élémentaire & suivi ---
    const eyeIc = G.I.eye();
    roundBtn(ctx, { x: L.eye.x, y: L.eye.y, r: 10 }, G.sight > 0 ? 1 : 0.7, G.sight > 0 ? '#7af0c4' : null);
    ctx.drawImage(eyeIc, Math.round(L.eye.x - 8), Math.round(L.eye.y - 6));
    UI.region(L.eye.x - 10, L.eye.y - 10, 20, 20, { onClick: () => { if (G.sightCd > 0) { G.toast('Vue élémentaire en recharge.'); } else { G.sight = 10; G.sightCd = 14; G.toast('Vue élémentaire activée'); } } });
    const rd = G.I.radar();
    const trackOn = S.settings.hints !== false;
    roundBtn(ctx, { x: L.radar.x, y: L.radar.y, r: 10 }, trackOn ? 1 : 0.55, trackOn ? '#ffd45a' : null);
    ctx.drawImage(rd, Math.round(L.radar.x - 8), Math.round(L.radar.y - 8));
    UI.region(L.radar.x - 10, L.radar.y - 10, 20, 20, { onClick: () => { S.settings.hints = !trackOn; G.toast(trackOn ? 'Suivi de quête désactivé' : 'Suivi de quête activé'); } });

    // --- signet de quête ---
    roundBtn(ctx, { x: L.quest.x, y: L.quest.y, r: 10 }, 0.85, '#e8e0cc');
    const qi = G.I.quest();
    ctx.drawImage(qi, Math.round(L.quest.x - 7), Math.round(L.quest.y - 9));
    if (G.questDot) dot(ctx, L.quest.x + 8, L.quest.y - 8);
    UI.region(L.quest.x - 10, L.quest.y - 10, 20, 20, { onClick: () => G.Menus.open('quests') });

    // objectif suivi
    const st0 = G.Quest.cur();
    if (st0 && w > 420) {
      const prog = st0.t === 'kill' ? ' (' + Math.min(st0.n, S.quest.prog || 0) + '/' + st0.n + ')' : '';
      const lines = G.wrap(st0.text + prog, 110, 1);
      G.text(ctx, '◆ Quête', 8, L.quest.y + 16, '#ffd45a', { outline: '#2a2410' });
      lines.slice(0, 4).forEach((ln, i) => G.text(ctx, ln, 8, L.quest.y + 26 + i * 9, '#ffffff', { outline: '#1a1a2a' }));
    }

    // --- rang d'aventure ---
    const a = L.ar;
    G.text(ctx, 'Adventure Rank', a.x, 3, '#c8f04a', { align: 'c', outline: '#2a3a10' });
    ctx.drawImage(circ(13, 'rgba(20,28,48,0.5)', 'rgba(200,240,74,0.35)'), a.x - 13, a.y - 12 + 6 - 4);
    const arY = a.y - 12 + 6 - 4 + 13;
    const need = G.arExpToNext(S.ar);
    arc(ctx, a.x, arY, 12, S.ar >= 60 ? 1 : S.arExp / need, '#c8f04a', 1);
    G.text(ctx, String(S.ar), a.x, arY - 6, '#f4ffd0', { align: 'c', outline: '#2a3a10', scale: 2 });

    // --- icônes en haut à droite ---
    const topIcons = [
      { ic: G.I.face(), id: 'chars', dot: G.charDot, fn: () => G.Menus.open('chars') },
      { ic: G.I.bag(), id: 'bag', dot: G.bagDot, fn: () => G.Menus.open('bag') },
      { ic: G.I.book(), id: 'handbook', dot: G.handDot, fn: () => G.Menus.open('handbook') },
      { ic: G.I.pass(), id: 'pass', dot: false, fn: () => G.Menus.open('pass') },
      { ic: G.I.wish(), id: 'wish', dot: (S.inv.fate || 0) > 0, fn: () => G.Menus.open('wish') },
      { ic: G.I.compass(), id: 'events', dot: G.Quest.commissionsClaimable() > 0 || G.commDot, fn: () => G.Menus.open('commissions') },
    ];
    topIcons.forEach((it, i) => {
      const b = L.top[i];
      const oi = UI.outlined(it.ic);
      ctx.drawImage(oi, Math.round(b.x - oi.width / 2), Math.round(b.y - oi.height / 2));
      if (it.dot) dot(ctx, b.x + 8, b.y - 8);
      UI.region(b.x - 11, b.y - 11, 22, 22, { onClick: it.fn });
    });
    // ping
    const ping = 105 + Math.round(Math.sin(t * 0.7) * 3);
    const pt = ping + ' ms';
    const pw = G.textW(pt);
    px(ctx, L.ping.x - pw / 2 - 9, L.ping.y - 4, pw + 18, 10, 'rgba(20,28,48,0.55)');
    ctx.drawImage(G.I.signal('#e8c85a'), Math.round(L.ping.x - pw / 2 - 7), Math.round(L.ping.y - 2));
    G.text(ctx, pt, L.ping.x + 5, L.ping.y - 2, '#f0f0f0', { align: 'c' });

    // --- liste d'équipe (les autres personnages) ---
    const order = [];
    for (let k = 1; k < S.party.length; k++) order.push((S.active + k) % S.party.length);
    order.slice(0, 3).forEach((pi, i) => {
      const row = L.party[i];
      const c2 = S.chars[S.party[pi]], d2 = G.CHARS[c2.id], st2 = G.charStats(c2);
      const dead = c2.hp <= 0;
      // bande
      for (let k = 0; k < 14; k++) px(ctx, w - 140 + k * 10, row.y - 11, 10, 22, 'rgba(16,22,40,' + (0.04 + (k / 14) * 0.38).toFixed(2) + ')');
      // anneau d'énergie
      const frac = c2.energy / d2.burst.cost;
      const ring = G.I.ringIcon(d2.el, Math.min(1, frac));
      const rx = L.pr.x - 24 - Math.max(G.textW(d2.name), 40) - 14;
      ctx.drawImage(ring, Math.round(rx - 12), Math.round(row.y - 12));
      if (frac >= 1 && Math.floor(t * 4) % 2) ctx.drawImage(circ(13, null, '#ffffff'), Math.round(rx - 13), Math.round(row.y - 13));
      // nom + PV
      G.text(ctx, d2.name, L.pr.x - 17, row.y - 8, dead ? '#9aa0b0' : '#ffffff', { align: 'r', outline: '#142030' });
      const bw = Math.max(G.textW(d2.name), 40);
      px(ctx, L.pr.x - 17 - bw, row.y + 4, bw, 3, '#1a2a2a');
      px(ctx, L.pr.x - 17 - bw, row.y + 4, Math.max(0, Math.round(bw * Math.max(0, c2.hp) / st2.hp)), 3, c2.hp / st2.hp < 0.3 ? '#e8553a' : '#9fe25c');
      px(ctx, L.pr.x - 17 - bw, row.y + 4, Math.max(0, Math.round(bw * Math.max(0, c2.hp) / st2.hp)), 1, 'rgba(255,255,255,0.4)');
      // portrait
      const pr = portrait(c2.id);
      ctx.globalAlpha = dead ? 0.4 : 1;
      ctx.drawImage(pr, Math.round(L.pr.x - 13), Math.round(row.y - 13));
      ctx.globalAlpha = 1;
      if (!touch) G.text(ctx, String(pi + 1), rx - 15, row.y + 5, '#f0e6b0', { outline: '#1a1a2a' });
      UI.region(rx - 14, row.y - 13, w - (rx - 14), 26, { onDown: () => G.input.fire('swap' + pi) });
    });

    // --- PV du personnage actif ---
    const hb = L.hpbar;
    const frac = Math.max(0, cs.hp) / st.hp;
    G.text(ctx, 'Lv. ' + cs.level, hb.left - 6, hb.y - 3, '#ffffff', { align: 'r', outline: '#142030' });
    px(ctx, hb.left - 1, hb.y - 3, hb.w + 2, 9, 'rgba(10,16,30,0.6)');
    px(ctx, hb.left, hb.y - 2, hb.w, 7, '#27402a');
    px(ctx, hb.left, hb.y - 2, Math.round(hb.w * frac), 7, frac < 0.3 ? '#e0583a' : '#8bd648');
    px(ctx, hb.left, hb.y - 2, Math.round(hb.w * frac), 2, frac < 0.3 ? '#ff8a6a' : '#b8f06c');
    if (P.shield && P.shield.t > 0) px(ctx, hb.left, hb.y - 4, Math.round(hb.w * Math.min(1, P.shield.hp / P.shield.max)), 2, G.EL[P.shield.el].light);
    G.text(ctx, Math.max(0, Math.round(cs.hp)) + ' / ' + st.hp, hb.left + hb.w / 2, hb.y - 3, '#ffffff', { align: 'c', outline: '#1a2a1a' });

    // gadget : feuille d'érable = en-cas rapide (touche T)
    const foodN = (S.inv.apple || 0) + (S.inv.bread || 0) + (S.inv.meal || 0);
    roundBtn(ctx, { x: L.gadget.x, y: L.gadget.y, r: 11 }, 0.85, '#e8e0cc');
    ctx.globalAlpha = foodN ? 1 : 0.55;
    ctx.drawImage(G.I.maple(), Math.round(L.gadget.x - 9), Math.round(L.gadget.y - 9));
    ctx.globalAlpha = 1;
    if (foodN) G.text(ctx, String(foodN), L.gadget.x + 7, L.gadget.y + 6, '#fff', { align: 'c', outline: '#1a1a2a' });
    UI.region(L.gadget.x - 11, L.gadget.y - 11, 22, 22, { onDown: () => G.input.fire('gadget') });

    // chat
    roundBtn(ctx, { x: L.chat.x, y: L.chat.y, r: 10 }, 0.8, null);
    const ci = G.I.chat();
    ctx.drawImage(ci, Math.round(L.chat.x - 8), Math.round(L.chat.y - 7));
    UI.region(L.chat.x - 10, L.chat.y - 10, 20, 20, { onClick: () => G.Menus.open('log') });

    // --- boutons d'action ---
    const sh = (n) => (UI.shakes[n] > 0 ? Math.round(Math.sin(t * 60) * 1.5) : 0);
    // attaque
    const at = L.attack;
    roundBtn(ctx, at, 0.9, '#e8e0cc');
    const asz = at.r >= 24 ? 32 : 24;
    const aic = def.weapon === 'bow' ? G.I.bowIcon(asz) : def.weapon === 'catalyst' ? G.I.orbIcon(asz) : G.I.sword('#ffffff', asz);
    ctx.drawImage(aic, Math.round(at.x - asz / 2), Math.round(at.y - asz / 2));
    UI.region(at.x - at.r, at.y - at.r, at.r * 2, at.r * 2, { hold: 'attack', onDown: () => G.input.fire('attack') });
    // saut
    const jp = L.jump;
    roundBtn(ctx, jp, 0.9, '#e8e0cc');
    ctx.drawImage(G.I.jump(), Math.round(jp.x - 10), Math.round(jp.y - 11));
    UI.region(jp.x - jp.r, jp.y - jp.r, jp.r * 2, jp.r * 2, { onDown: () => G.input.fire('jump') });
    // sprint
    const sp = L.sprint;
    roundBtn(ctx, sp, 0.9, '#e8e0cc');
    ctx.drawImage(G.I.sprint(), Math.round(sp.x - 10), Math.round(sp.y - 10));
    if (S.stamina < S.staminaMax) arc(ctx, sp.x, sp.y, sp.r + 1, S.stamina / S.staminaMax, S.stamina < 40 ? '#ff6a5a' : '#c8f04a', 1);
    UI.region(sp.x - sp.r, sp.y - sp.r, sp.r * 2, sp.r * 2, { hold: 'sprint', onDown: () => G.input.fire('sprint') });
    // compétence E
    const sk = L.skill;
    const ox = sh('E');
    const skReady = cs.cdE <= 0;
    roundBtn(ctx, { x: sk.x + ox, y: sk.y, r: sk.r }, 1, skReady ? G.EL[def.el].light : '#e8e0cc');
    const si = G.I.skillIcon(def.el);
    ctx.globalAlpha = skReady ? 1 : 0.5;
    ctx.drawImage(si, Math.round(sk.x + ox - 10), Math.round(sk.y - 10));
    ctx.globalAlpha = 1;
    if (!skReady) {
      pie(ctx, { x: sk.x + ox, y: sk.y, r: sk.r }, cs.cdE / def.skill.cd, 'rgba(10,14,30,0.55)');
      G.text(ctx, cs.cdE.toFixed(1), sk.x + ox, sk.y - 3, '#ffffff', { align: 'c', outline: '#10182a' });
    } else if (P.stiletto && def.skill.k === 'blink') G.text(ctx, '!', sk.x, sk.y - 3, '#ffffff', { align: 'c', outline: '#10182a' });
    if (!touch) G.text(ctx, 'E', sk.x + sk.r - 3, sk.y - sk.r - 4, '#f0e6b0', { outline: '#1a1a2a' });
    UI.region(sk.x - sk.r, sk.y - sk.r, sk.r * 2, sk.r * 2, { onDown: () => G.input.fire('skill') });
    // déchaînement Q
    const bu = L.burst;
    const ox2 = sh('Q');
    const bReady = cs.energy >= def.burst.cost && cs.cdQ <= 0;
    roundBtn(ctx, { x: bu.x + ox2, y: bu.y, r: bu.r }, 1, bReady ? G.EL[def.el].light : '#e8e0cc');
    const bi = G.I.burstIcon(def.el, bReady);
    ctx.drawImage(bi, Math.round(bu.x + ox2 - 11), Math.round(bu.y - 11));
    if (bReady && Math.floor(t * 5) % 2) ctx.drawImage(circ(bu.r + 1, null, G.EL[def.el].color), Math.round(bu.x + ox2 - bu.r - 1), Math.round(bu.y - bu.r - 1));
    if (!bReady) {
      arc(ctx, bu.x, bu.y, bu.r - 1, Math.min(1, cs.energy / def.burst.cost), G.EL[def.el].color, 2);
      if (cs.cdQ > 0) G.text(ctx, cs.cdQ.toFixed(0), bu.x, bu.y - 3, '#ffffff', { align: 'c', outline: '#10182a' });
    }
    if (!touch) G.text(ctx, 'Q', bu.x + bu.r - 3, bu.y - bu.r - 4, '#f0e6b0', { outline: '#1a1a2a' });
    UI.region(bu.x - bu.r, bu.y - bu.r, bu.r * 2, bu.r * 2, { onDown: () => G.input.fire('burst') });

    // UID
    G.text(ctx, 'UID: ' + S.uid, w - 6, h - 9, 'rgba(255,255,255,0.85)', { align: 'r', shadow: '#142030' });

    // --- invite d'interaction ---
    if (P.interact && !G.dialog) {
      const it = P.interact;
      const bx = Math.round(w - Math.max(190, w * 0.34)), by = Math.round(h * 0.5);
      const label = it.label + (it.name ? ' : ' + it.name : '');
      const bw = Math.min(w - bx - 4, G.textW(label) + 30);
      for (let k = 0; k < 8; k++) px(ctx, bx - bw + k * (bw / 8) + bw, by - 8, bw / 8 + 1, 17, 'rgba(16,22,40,' + (0.55 - k * 0.04).toFixed(2) + ')');
      px(ctx, bx, by - 8, bw, 17, 'rgba(16,22,40,0.6)');
      ctx.drawImage(circ(8, '#f4efe0', '#d3bc8e'), bx + 4, by - 8);
      G.text(ctx, touch ? '☝' : 'F', bx + 12, by - 4, '#3b4255', { align: 'c' });
      if (touch) { px(ctx, bx + 9, by - 3, 6, 5, '#3b4255'); }
      G.text(ctx, label, bx + 22, by - 4, it.locked ? '#ff9a8a' : '#ffffff', { shadow: '#10182a' });
      UI.region(bx, by - 8, bw, 17, { onDown: () => G.input.fire('interact') });
    }

    // --- stylet / drapeaux ---
    // joystick flottant
    if (I.joy) {
      const j = I.joy;
      ctx.globalAlpha = 0.5;
      ctx.drawImage(circ(26, 'rgba(255,255,255,0.12)', 'rgba(255,255,255,0.7)'), Math.round(j.ox - 26), Math.round(j.oy - 26));
      ctx.drawImage(circ(10, 'rgba(255,255,255,0.7)', null), Math.round(j.ox + j.dx * 20 - 10), Math.round(j.oy + j.dy * 20 - 10));
      ctx.globalAlpha = 1;
    }

    // --- barre du boss ---
    const b = G.bossFight;
    if (b && !b.dead && (G.Domain.active)) {
      const bw2 = Math.min(220, w * 0.4);
      const bx2 = Math.round(w / 2 - bw2 / 2), by2 = Math.max(46, L.ar.y + 24);
      G.text(ctx, 'Lv.' + b.lvl + ' ' + b.d.name, w / 2, by2 - 12, '#ffffff', { align: 'c', outline: '#1a1a2a' });
      px(ctx, bx2 - 2, by2 - 2, bw2 + 4, 8, '#1a1a2a');
      px(ctx, bx2, by2, bw2, 4, '#5a2a2a');
      px(ctx, bx2, by2, Math.round(bw2 * Math.max(0, b.hp) / b.maxhp), 4, b.bossState.phase === 2 ? '#ff7a3a' : '#e8453c');
      px(ctx, bx2, by2, Math.round(bw2 * Math.max(0, b.hp) / b.maxhp), 1, 'rgba(255,255,255,0.4)');
    }

    // --- fil des objets ---
    let fy = Math.round(h * 0.5);
    const feedR = L.jump.x - L.jump.r - 8;
    for (let i = G.feed.length - 1; i >= 0; i--) {
      const f = G.feed[i];
      const k = f.t < 0.25 ? f.t / 0.25 : f.t > f.life - 0.5 ? (f.life - f.t) / 0.5 : 1;
      ctx.globalAlpha = Math.max(0, Math.min(1, k));
      const txt = f.text + (f.n ? ' ×' + f.n : '');
      const tw = G.textW(txt) + (f.item ? 20 : 8);
      const fx = feedR - tw + Math.round((1 - Math.min(1, k * 2)) * 30);
      px(ctx, fx, fy - 2, tw, 16, 'rgba(16,22,40,0.65)');
      if (f.item) ctx.drawImage(G.I.item(f.item), fx + 2, fy - 2);
      G.text(ctx, txt, fx + (f.item ? 19 : 4), fy + 3, '#ffffff');
      ctx.globalAlpha = 1;
      fy += 18;
    }

    // --- bannières ---
    const bn = G.banners[0];
    if (bn) {
      const k = bn.t < 0.5 ? bn.t / 0.5 : bn.t > bn.life - 0.7 ? (bn.life - bn.t) / 0.7 : 1;
      ctx.globalAlpha = Math.max(0, Math.min(1, k));
      const cy = bn.kind === 'zone' ? Math.round(h * 0.2) : Math.round(h * 0.27);
      const col = { zone: '#f4efe0', unlock: '#d6f6ff', quest: '#ffe27a', ar: '#c8f04a', down: '#ff8a7a', boss: '#ff9a7a' }[bn.kind] || '#ffffff';
      const sc = bn.kind === 'zone' ? 2 : 2;
      const tw = Math.max(G.textW(bn.title, sc), bn.sub ? G.textW(bn.sub, 1) : 0) + 40;
      for (let i = 0; i < 12; i++) px(ctx, w / 2 - tw / 2 + (i / 12) * tw, cy - 12, tw / 12 + 1, 30, 'rgba(10,14,30,' + (0.45 * Math.sin((i / 11) * Math.PI)).toFixed(2) + ')');
      px(ctx, w / 2 - tw / 2 + 20, cy - 12, tw - 40, 1, 'rgba(211,188,142,0.8)');
      px(ctx, w / 2 - tw / 2 + 20, cy + 17, tw - 40, 1, 'rgba(211,188,142,0.8)');
      G.text(ctx, bn.title, w / 2, cy - 7, col, { align: 'c', outline: '#1a1a2a', scale: sc });
      if (bn.sub) G.text(ctx, bn.sub, w / 2, cy + 9, '#e8e0cc', { align: 'c', outline: '#1a1a2a' });
      ctx.globalAlpha = 1;
    }
  };

  // ---------- Dialogue ----------
  UI.drawDialog = function (ctx, w, h, t) {
    const d = G.dialog;
    if (!d) return;
    const line = d.script[d.i];
    if (!line) return;
    UI.region(0, 0, w, h, { onClick: () => { const l = G.dialog && G.dialog.script[G.dialog.i]; if (l && !l.choices) G.Dialog.advance(); } });
    const bw = Math.min(w - 24, 420), bh = 56;
    const bx = Math.round(w / 2 - bw / 2), by = h - bh - 12;
    px(ctx, 0, by - 14, w, bh + 28, 'rgba(8,12,24,0.35)');
    px(ctx, bx, by, bw, bh, 'rgba(18,24,44,0.94)');
    px(ctx, bx, by, bw, 1, '#d3bc8e'); px(ctx, bx, by + bh - 1, bw, 1, '#d3bc8e'); px(ctx, bx, by, 1, bh, '#d3bc8e'); px(ctx, bx + bw - 1, by, 1, bh, '#d3bc8e');
    px(ctx, bx + 2, by + 2, bw - 4, 1, 'rgba(211,188,142,0.4)'); px(ctx, bx + 2, by + bh - 3, bw - 4, 1, 'rgba(211,188,142,0.4)');
    // portrait
    let tx = bx + 8;
    if (line.face) {
      const fc = G.canvas(52, 52);
      if (line.face === 'paimon') { const p = G.I.paimonHead(); px(fc.ctx, 0, 0, 52, 52, '#2b3a6a'); fc.ctx.drawImage(p, 3, 3, 46, 46); }
      else if (G.CHARS[line.face]) fc.ctx.drawImage(G.S.portrait(line.face, 24), 0, 0, 52, 52);
      else { const def = G.Story.npcDefs().find((n) => n.id === line.face); if (def) { px(fc.ctx, 0, 0, 52, 52, '#3a4a78'); fc.ctx.drawImage(G.S.lookFrame(line.face, def.look, 'd', 0), 3, 1, 20, 18, 0, 4, 52, 47); } }
      ctx.drawImage(fc, bx + 6, by - 14);
      px(ctx, bx + 5, by - 15, 54, 1, '#d3bc8e'); px(ctx, bx + 5, by - 15, 1, 55, '#d3bc8e'); px(ctx, bx + 58, by - 15, 1, 55, '#d3bc8e'); px(ctx, bx + 5, by + 39, 54, 1, '#d3bc8e');
      tx = bx + 66;
    }
    G.text(ctx, line.who, tx, by + 6, '#d3bc8e', { shadow: '#0a0e1a' });
    const shown = line.text.slice(0, Math.floor(d.shown));
    const lines = G.wrap(shown, bx + bw - tx - 10, 1);
    lines.slice(0, 4).forEach((ln, i) => G.text(ctx, ln, tx, by + 19 + i * 10, '#ffffff', { shadow: '#0a0e1a' }));
    if (d.shown >= line.text.length && !line.choices && Math.floor(t * 3) % 2) G.text(ctx, '▼', bx + bw - 14, by + bh - 12, '#d3bc8e');
    // choix
    if (line.choices && d.shown >= line.text.length) {
      const cw = 140, ch = 15;
      const cx = Math.round(w - cw - 14), cy = Math.round(by - line.choices.length * (ch + 3) - 10);
      line.choices.forEach((c, i) => {
        const y = cy + i * (ch + 3);
        const sel = d.sel === i;
        px(ctx, cx, y, cw, ch, sel ? 'rgba(236,229,216,0.96)' : 'rgba(18,24,44,0.92)');
        px(ctx, cx, y, cw, 1, '#d3bc8e'); px(ctx, cx, y + ch - 1, cw, 1, '#d3bc8e');
        G.text(ctx, c.label, cx + 8, y + 4, sel ? '#3b4255' : '#ffffff');
        if (sel) G.text(ctx, '◆', cx + cw - 12, y + 4, '#b8903a');
        UI.region(cx, y, cw, ch, { onClick: () => G.Dialog.choose(i) });
      });
    }
  };

  // ---------- Plan rapproché (déchaînement) ----------
  UI.drawCutin = function (ctx, w, h, t) {
    const c = G.cutin; if (!c) return;
    const d = G.CHARS[c.id], el = G.EL[d.el];
    const k = c.t / c.life;
    ctx.globalAlpha = Math.min(0.75, k * 6) * (k > 0.85 ? (1 - k) / 0.15 : 1);
    px(ctx, 0, 0, w, h, '#0a0e1e');
    ctx.globalAlpha = 1;
    const a = Math.min(1, k * 5) * (k > 0.85 ? (1 - k) / 0.15 : 1);
    ctx.globalAlpha = a;
    const bandY = Math.round(h * 0.33), bandH = Math.round(h * 0.34);
    // bande diagonale
    for (let y = 0; y < bandH; y++) {
      const off = Math.round((y - bandH / 2) * 0.3);
      px(ctx, off - w * 0.1 + (1 - Math.min(1, k * 4)) * -w, bandY + y, w * 1.2, 1, y < 2 || y > bandH - 3 ? el.light : G.mix(el.dark, el.color, y / bandH));
    }
    const spr = G.S.charFrame(c.id, 'd', 0);
    const sc = Math.max(5, Math.round(h / 38));
    const sx = Math.round(w * 0.12 + (1 - Math.min(1, k * 4)) * -80 + k * 18), sy = bandY + bandH - 8 * sc - 1 - 20 * (sc / 6);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(spr, sx, Math.round(h / 2 - 16 * sc + 12 * sc / 2 - 14), spr.width * sc, spr.height * sc);
    G.text(ctx, d.burst.n, Math.round(w * 0.46), bandY + Math.round(bandH / 2) - 8, '#ffffff', { outline: el.dark, scale: 2 });
    G.text(ctx, d.name, Math.round(w * 0.46), bandY + Math.round(bandH / 2) + 10, el.light, { outline: '#10182a' });
    ctx.globalAlpha = 1;
  };

  // ---------- Barre d'endurance près du joueur ----------
  UI.drawStamina = function (ctx, camX, camY) {
    const S = G.state, P = G.P;
    if (S.stamina >= S.staminaMax - 1) return;
    const x = Math.round(P.x - camX), y = Math.round(P.y - camY - 36);
    const frac = S.stamina / S.staminaMax;
    px(ctx, x - 9, y - 1, 18, 4, 'rgba(10,16,30,0.7)');
    px(ctx, x - 8, y, Math.round(16 * frac), 2, frac < 0.25 ? '#ff6a5a' : frac < 0.55 ? '#ffd45a' : '#c8f04a');
  };

  // ---------- Fondu ----------
  UI.drawFade = function (ctx, w, h) {
    const f = G.fade; if (!f) return;
    const a = f.t < 0.35 ? f.t / 0.35 : 1 - (f.t - 0.35) / 0.35;
    ctx.globalAlpha = Math.max(0, Math.min(1, a));
    px(ctx, 0, 0, w, h, '#05070f');
    ctx.globalAlpha = 1;
  };

  // ---------- Boutons génériques (menus) ----------
  // style parchemin
  UI.button = function (ctx, x, y, w, h, label, onClick, o) {
    o = o || {};
    const dis = o.disabled;
    const sel = o.selected;
    const fill = dis ? '#c9c3b6' : sel ? '#3b4255' : '#f6f1e6';
    px(ctx, x, y, w, h, fill);
    px(ctx, x, y, w, 1, UI.C.gold); px(ctx, x, y + h - 1, w, 1, UI.C.gold); px(ctx, x, y, 1, h, UI.C.gold); px(ctx, x + w - 1, y, 1, h, UI.C.gold);
    G.text(ctx, label, x + w / 2, y + Math.round(h / 2) - 3, dis ? '#8a8a8a' : sel ? '#f6f1e6' : UI.C.ink, { align: 'c' });
    if (!dis) UI.region(x, y, w, h, { onClick: () => { if (G.Audio) G.Audio.sfx('click'); onClick(); } });
  };
  UI.panel = function (ctx, x, y, w, h, o) {
    o = o || {};
    px(ctx, x - 2, y - 2, w + 4, h + 4, '#10152a');
    px(ctx, x, y, w, h, o.fill || UI.C.panel);
    px(ctx, x, y, w, 1, UI.C.gold); px(ctx, x, y + h - 1, w, 1, UI.C.gold); px(ctx, x, y, 1, h, UI.C.gold); px(ctx, x + w - 1, y, 1, h, UI.C.gold);
    px(ctx, x + 2, y + 2, w - 4, 1, 'rgba(211,188,142,0.5)'); px(ctx, x + 2, y + h - 3, w - 4, 1, 'rgba(211,188,142,0.5)');
  };
})();
