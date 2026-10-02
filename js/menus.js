/* Teyvat Pixel — menus : Paimon, carte, personnages, sac, vœux, quêtes, commissions, passe, manuel, boutique, réglages */
(function () {
  const G = window.G;
  const UI = G.UI;
  const px = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const M = (G.Menus = { cur: null, p: {}, defs: {}, scroll: {} });
  const C = () => UI.C;

  G.logMsgs = [];
  const _toast = G.toast;
  G.toast = function (text, item, n) { G.logMsgs.push((n ? text + ' ×' + n : text)); if (G.logMsgs.length > 30) G.logMsgs.shift(); _toast(text, item, n); };

  M.open = function (name, params) {
    G.mode = 'menu';
    M.cur = name; M.p = params || {};
    const d = M.defs[name];
    if (d && d.open) d.open(M.p);
    if (name === 'bag') G.bagDot = false;
    if (name === 'paimon') G.menuDot = false;
    if (name === 'chars') G.charDot = false;
    if (name === 'quests') G.questDot = false;
    if (name === 'commissions') { G.commDot = false; G.Quest.ensureCommissions(); }
    if (name === 'handbook') G.handDot = false;
    if (G.Audio) G.Audio.sfx('click');
    G.input.clearEdges();
  };
  M.close = function () {
    if (M.cur && M.defs[M.cur] && M.defs[M.cur].close) M.defs[M.cur].close();
    M.cur = null; G.mode = 'play';
    G.input.clearEdges();
  };
  M.back = function () { if (M.p && M.p.prev) M.open(M.p.prev); else M.close(); };

  M.update = function (dt) {
    const I = G.input;
    const d = M.defs[M.cur];
    if (!d) return;
    if (I.anyEdge('Escape', 'Tab') || (M.cur !== 'paimon' && I.edge('Backspace'))) { if (M.cur === 'paimon' || !M.p.prev) M.close(); else M.back(); return; }
    // raccourcis
    const sc = { KeyM: 'map', KeyC: 'chars', KeyB: 'bag', KeyL: 'quests', KeyG: 'wish' };
    for (const k in sc) if (I.edge(k) && M.cur !== sc[k]) { M.open(sc[k]); return; }
    if (d.update) d.update(dt);
  };

  M.draw = function (ctx, w, h, t) {
    const d = M.defs[M.cur];
    if (d) d.draw(ctx, w, h, t);
  };

  // Cadre commun
  M.frame = function (ctx, w, h, title, opts) {
    opts = opts || {};
    UI.region(0, 0, w, h, {}); // capte les clics hors boutons (doit venir en premier)
    ctx.globalAlpha = 0.82; px(ctx, 0, 0, w, h, '#0a0e1e'); ctx.globalAlpha = 1;
    const x = 8, y = 8, pw = w - 16, ph = h - 16;
    UI.panel(ctx, x, y, pw, ph, { fill: opts.fill });
    G.text(ctx, title, x + 10, y + 7, opts.dark ? '#f4efe0' : C().ink);
    px(ctx, x + 6, y + 18, pw - 12, 1, C().gold);
    const back = M.p && M.p.prev;
    UI.button(ctx, x + pw - 36, y + 4, 30, 12, '✕', () => M.close());
    if (back) UI.button(ctx, x + pw - 70, y + 4, 30, 12, '◀', () => M.back());
    return { x: x + 6, y: y + 22, w: pw - 12, h: ph - 28 };
  };
  const rarityStars = (ctx, n, x, y, col) => { G.text(ctx, '★'.repeat(n), x, y, col || '#e8a838'); };

  // =====================================================================
  //  Menu Paimon
  // =====================================================================
  M.defs.paimon = {
    draw(ctx, w, h, t) {
      ctx.globalAlpha = 0.78; px(ctx, 0, 0, w, h, '#0a0e1e'); ctx.globalAlpha = 1;
      UI.region(0, 0, w, h, { onClick: () => M.close() });
      const items = [
        { id: 'quests', ic: G.I.quest(), n: 'Quêtes' }, { id: 'commissions', ic: G.I.compass(), n: 'Commissions' }, { id: 'wish', ic: G.I.wish(), n: 'Vœux' },
        { id: 'pass', ic: G.I.pass(), n: 'Passe' }, { id: 'chars', ic: G.I.face(), n: 'Personnages' }, { id: 'bag', ic: G.I.bag(), n: 'Sac à dos' },
        { id: 'map', ic: G.I.eye(), n: 'Carte' }, { id: 'handbook', ic: G.I.book(), n: 'Manuel' }, { id: 'settings', ic: G.I.maple(), n: 'Réglages' },
      ];
      const cols = 5, cw = Math.min(78, Math.floor((w - 30) / cols)), chh = 48;
      const rows = Math.ceil(items.length / cols);
      const x0 = Math.round(w / 2 - (cols * cw) / 2), y0 = Math.round(h / 2 - (rows * chh) / 2) - 8;
      G.text(ctx, 'Menu de Paimon', w / 2, y0 - 22, '#f4efe0', { align: 'c', outline: '#10182a', scale: 2 });
      items.forEach((it, i) => {
        const cx = x0 + (i % cols) * cw + cw / 2, cy = y0 + Math.floor(i / cols) * chh + 16;
        ctx.drawImage(UI.circ(17, 'rgba(236,229,216,0.15)', '#d3bc8e'), Math.round(cx - 17), Math.round(cy - 17));
        ctx.drawImage(it.ic, Math.round(cx - it.ic.width / 2), Math.round(cy - it.ic.height / 2));
        G.text(ctx, it.n, cx, cy + 22, '#f4efe0', { align: 'c', outline: '#10182a' });
        UI.region(cx - cw / 2, cy - 18, cw, 42, { onClick: () => M.open(it.id, { prev: 'paimon' }) });
      });
      const ty = y0 + rows * chh + 6;
      UI.button(ctx, w / 2 - 70, ty, 66, 14, 'Sauvegarder', () => { G.Save.save(); G.toast('Partie sauvegardée.'); });
      UI.button(ctx, w / 2 + 4, ty, 66, 14, 'Titre', () => { G.Save.save(); G.toTitle(); });
      G.text(ctx, 'Heure : ' + G.todLabel() + '   Jour ' + G.state.day, w / 2, ty + 22, '#c8d0e0', { align: 'c', outline: '#10182a' });
    },
  };

  // =====================================================================
  //  Carte
  // =====================================================================
  const Map_ = { zoom: 2, cx: 96, cy: 72, sel: null, drag: null };
  M.defs.map = {
    open(p) {
      Map_.cx = G.P.x / G.TS; Map_.cy = G.P.y / G.TS; Map_.sel = p && p.from ? { kind: 'wp', ref: p.from } : null;
      Map_.zoom = G.view.h > 250 ? 3 : 2;
    },
    update(dt) {
      const I = G.input;
      if (I.wheel) Map_.zoom = G.clamp(Map_.zoom - Math.sign(I.wheel), 1, 5);
      const sp = 60 * dt / Map_.zoom;
      if (I.any('KeyA', 'ArrowLeft')) Map_.cx -= sp; if (I.any('KeyD', 'ArrowRight')) Map_.cx += sp;
      if (I.any('KeyW', 'ArrowUp')) Map_.cy -= sp; if (I.any('KeyS', 'ArrowDown')) Map_.cy += sp;
    },
    draw(ctx, w, h, t) {
      const r = M.frame(ctx, w, h, 'Carte — ' + (G.World.region(G.P.x, G.P.y) || 'Teyvat'), { fill: '#1d2a44', dark: true });
      const side = 88;
      const mx = r.x, my = r.y, mw = r.w - side - 4, mh = r.h;
      const W = G.World, z = Map_.zoom;
      Map_.cx = G.clamp(Map_.cx, 0, W.W); Map_.cy = G.clamp(Map_.cy, 0, W.H);
      ctx.save();
      ctx.beginPath(); ctx.rect(mx, my, mw, mh); ctx.clip();
      px(ctx, mx, my, mw, mh, '#16315a');
      const ox = Math.round(mx + mw / 2 - Map_.cx * z), oy = Math.round(my + mh / 2 - Map_.cy * z);
      ctx.drawImage(W.mini, ox, oy, W.W * z, W.H * z);
      const toS = (wx, wy) => [Math.round(ox + (wx / G.TS) * z), Math.round(oy + (wy / G.TS) * z)];
      const markers = [];
      for (const wp of W.waypoints) markers.push({ kind: 'wp', ref: wp, p: toS(wp.x, wp.y), name: wp.name });
      for (const s of W.statues) markers.push({ kind: 'st', ref: s, p: toS(s.x, s.y), name: s.name });
      { const dm = W.pois.domain; markers.push({ kind: 'dm', ref: dm, p: toS(dm.x, dm.y), name: dm.name }); }
      // grille
      markers.forEach((m) => {
        const [x, y] = m.p;
        const sel = Map_.sel && Map_.sel.ref === m.ref;
        const s = sel ? 7 : 5;
        const dia = (rim, fill) => { for (let yy = -s; yy <= s; yy++) { const hw = s - Math.abs(yy); px(ctx, x - hw, y + yy, hw * 2 + 1, 1, rim); } for (let yy = -s + 2; yy <= s - 2; yy++) { const hw = s - 2 - Math.abs(yy); if (hw >= 0) px(ctx, x - hw, y + yy, hw * 2 + 1, 1, fill); } };
        if (m.kind === 'wp') dia('#e8f4ff', m.ref.unlocked ? '#3fa9ff' : '#5a6a88');
        else if (m.kind === 'st') { px(ctx, x - s + 1, y - s + 1, s * 2 - 1, s * 2 - 1, '#fff6c8'); px(ctx, x - s + 2, y - s + 2, s * 2 - 3, s * 2 - 3, '#e8a838'); }
        else { dia('#e8d9ff', '#8a5ae0'); }
      });
      // séelies, quête
      for (const s of W.seelies) if (!s.done) { const [x, y] = toS(s.x, s.y); px(ctx, x - 1, y - 1, 3, 3, '#d2c8ff'); }
      const tg = G.Quest.target();
      if (tg) { const [x, y] = toS(tg.x, tg.y); px(ctx, x - 4, y - 1, 9, 3, '#3a2a10'); px(ctx, x - 1, y - 4, 3, 9, '#3a2a10'); px(ctx, x - 3, y, 7, 1, '#ffd45a'); px(ctx, x, y - 3, 1, 7, '#ffd45a'); px(ctx, x - 1, y - 1, 3, 3, '#ffd45a'); }
      // joueur
      { const [x, y] = toS(G.P.x, G.P.y); const a = G.P.ang; const pts = [[Math.cos(a) * 6, Math.sin(a) * 6], [Math.cos(a + 2.5) * 5, Math.sin(a + 2.5) * 5], [Math.cos(a - 2.5) * 5, Math.sin(a - 2.5) * 5]]; ctx.fillStyle = '#10303a'; for (const q of pts) ctx.fillRect(Math.round(x + q[0]) - 1, Math.round(y + q[1]) - 1, 3, 3); ctx.fillStyle = '#4fe8ff'; ctx.fillRect(x - 1, y - 1, 3, 3); for (const q of pts) ctx.fillRect(Math.round(x + q[0]), Math.round(y + q[1]), 1, 1); }
      ctx.restore();
      px(ctx, mx - 1, my - 1, mw + 2, 1, '#d3bc8e'); px(ctx, mx - 1, my + mh, mw + 2, 1, '#d3bc8e'); px(ctx, mx - 1, my, 1, mh, '#d3bc8e'); px(ctx, mx + mw, my, 1, mh, '#d3bc8e');
      // interaction : glisser + toucher
      UI.region(mx, my, mw, mh, {
        drag: (x, y, ph) => {
          if (ph === 'start') Map_.drag = { x, y, cx: Map_.cx, cy: Map_.cy, moved: false };
          else if (ph === 'move' && Map_.drag) { const dx = x - Map_.drag.x, dy = y - Map_.drag.y; if (Math.abs(dx) + Math.abs(dy) > 3) Map_.drag.moved = true; Map_.cx = Map_.drag.cx - dx / z; Map_.cy = Map_.drag.cy - dy / z; }
          else if (ph === 'end' && Map_.drag) {
            if (!Map_.drag.moved) {
              let best = null, bd = 12;
              markers.forEach((m) => { const d = Math.hypot(m.p[0] - x, m.p[1] - y); if (d < bd) { bd = d; best = m; } });
              Map_.sel = best;
            }
            Map_.drag = null;
          }
        },
      });
      // panneau latéral
      const sx = mx + mw + 4;
      px(ctx, sx, my, side, mh, C().panelD);
      px(ctx, sx, my, side, 1, C().gold);
      UI.button(ctx, sx + 4, my + 4, 38, 12, 'Zoom +', () => { Map_.zoom = Math.min(5, Map_.zoom + 1); });
      UI.button(ctx, sx + 46, my + 4, 38, 12, 'Zoom -', () => { Map_.zoom = Math.max(1, Map_.zoom - 1); });
      UI.button(ctx, sx + 4, my + 19, side - 8, 12, 'Ma position', () => { Map_.cx = G.P.x / G.TS; Map_.cy = G.P.y / G.TS; });
      const sel = Map_.sel;
      let y = my + 38;
      if (sel) {
        const nm = sel.kind === 'dm' ? sel.ref.name : sel.ref.name;
        G.wrap(nm, side - 8, 1).forEach((ln, i) => G.text(ctx, ln, sx + 4, y + i * 9, C().ink));
        y += G.wrap(nm, side - 8, 1).length * 9 + 4;
        const kind = sel.kind === 'wp' ? 'Téléporteur' : sel.kind === 'st' ? 'Statue des Sept' : 'Domaine';
        G.text(ctx, kind, sx + 4, y, C().inkL); y += 12;
        const canTp = (sel.kind === 'wp' && sel.ref.unlocked) || sel.kind === 'st' || sel.kind === 'dm';
        const blocked = G.Domain.active || (G.bossFight && !G.bossFight.dead && G.Domain.active);
        const state = sel.kind === 'st' && !G.state.statues[sel.ref.id] ? false : sel.kind === 'wp' ? sel.ref.unlocked : true;
        if (sel.kind === 'wp' && !sel.ref.unlocked) G.wrap('Non débloqué. Approchez-vous pour l’activer.', side - 8, 1).forEach((ln, i) => G.text(ctx, ln, sx + 4, y + i * 9, '#a04a3a'));
        else UI.button(ctx, sx + 4, y, side - 8, 14, 'Téléporter', () => {
          if (blocked) { G.toast('Impossible dans un domaine.'); return; }
          const dst = sel.kind === 'dm' ? { x: sel.ref.x, y: sel.ref.y - 24 } : { x: sel.ref.x, y: sel.ref.y + 16 };
          G.teleport(dst.x, dst.y);
          M.close();
        }, { disabled: !state });
      } else G.wrap('Touchez un marqueur pour le sélectionner. Glissez pour déplacer la carte.', side - 8, 1).forEach((ln, i) => G.text(ctx, ln, sx + 4, y + i * 9, C().inkL));
      // légende
      const ly = my + mh - 40;
      px(ctx, sx + 4, ly, 5, 5, '#3fa9ff'); G.text(ctx, 'Téléporteur', sx + 12, ly - 1, C().ink);
      px(ctx, sx + 4, ly + 10, 5, 5, '#e8a838'); G.text(ctx, 'Statue', sx + 12, ly + 9, C().ink);
      px(ctx, sx + 4, ly + 20, 5, 5, '#8a5ae0'); G.text(ctx, 'Domaine', sx + 12, ly + 19, C().ink);
      px(ctx, sx + 4, ly + 30, 5, 5, '#ffd45a'); G.text(ctx, 'Objectif', sx + 12, ly + 29, C().ink);
    },
  };
  G.teleport = function (x, y) {
    G.fade = { t: 0, dir: 1, cb: () => { G.P.x = x; G.P.y = y; G.cam.x = x; G.cam.y = y; G.P.interact = null; G.Combat.spark(x, y - 10, '#bfe8ff', 16, 80); if (G.Audio) G.Audio.sfx('unlock'); } };
  };

  // =====================================================================
  //  Personnages
  // =====================================================================
  const CH = { sel: 'keqing', slot: 0, scroll: 0 };
  M.defs.chars = {
    open() { CH.sel = G.cs().id; CH.slot = G.state.active; CH.scroll = 0; },
    update() { const I = G.input; if (I.wheel) CH.scroll = Math.max(0, CH.scroll + I.wheel * 2); },
    draw(ctx, w, h, t) {
      const S = G.state;
      const r = M.frame(ctx, w, h, 'Personnages');
      // emplacements d'équipe
      const slotW = Math.min(56, Math.floor((r.w - 130) / 4)), sy = r.y;
      G.text(ctx, 'Équipe', r.x, sy + 3, C().inkL);
      for (let i = 0; i < 4; i++) {
        const x = r.x + 38 + i * (slotW + 3);
        const id = S.party[i];
        const sel = CH.slot === i;
        px(ctx, x, sy - 2, slotW, 18, sel ? C().ink : '#d9d0bd');
        px(ctx, x, sy - 2, slotW, 1, C().gold); px(ctx, x, sy + 15, slotW, 1, C().gold);
        if (id) { ctx.drawImage(UI.portrait(id), x + 2, sy - 1); G.text(ctx, G.CHARS[id].name.slice(0, Math.max(4, Math.floor((slotW - 30) / 6))), x + 29, sy + 3, sel ? '#f6f1e6' : C().ink); }
        else G.text(ctx, '—', x + slotW / 2, sy + 3, C().inkL, { align: 'c' });
        UI.region(x, sy - 2, slotW, 18, { onClick: () => { CH.slot = i; if (id) CH.sel = id; } });
      }
      if (S.party.length > 1 && S.party[CH.slot]) UI.button(ctx, r.x + 38 + 4 * (slotW + 3) + 4, sy - 2, 44, 18, 'Retirer', () => { S.party.splice(CH.slot, 1); S.active = Math.min(S.active, S.party.length - 1); CH.slot = Math.min(CH.slot, S.party.length); });
      // liste
      const lw = 86, ly = sy + 22, lh = r.h - 24;
      px(ctx, r.x, ly, lw, lh, '#ded6c4'); px(ctx, r.x, ly, lw, 1, C().gold);
      const ids = G.CHAR_ORDER.filter((id) => S.chars[id]);
      const rowH = 20, vis = Math.floor((lh - 2) / rowH);
      CH.scroll = G.clamp(CH.scroll, 0, Math.max(0, ids.length - vis));
      ids.slice(CH.scroll, CH.scroll + vis).forEach((id, i) => {
        const y = ly + 1 + i * rowH;
        const cs = S.chars[id], d = G.CHARS[id];
        const sel = CH.sel === id, inP = S.party.includes(id);
        px(ctx, r.x + 1, y, lw - 2, rowH - 1, sel ? C().ink : (i % 2 ? '#e8e0d0' : '#f0e9db'));
        ctx.drawImage(UI.portrait(id), 0, 0, 26, 26, r.x + 2, y + 1, 17, 17);
        G.text(ctx, d.name, r.x + 22, y + 3, sel ? '#f6f1e6' : C().ink);
        G.text(ctx, 'Nv.' + cs.level, r.x + 22, y + 12, sel ? '#d3bc8e' : C().inkL);
        if (inP) G.text(ctx, '◆', r.x + lw - 12, y + 6, sel ? '#d3bc8e' : '#b8903a');
        px(ctx, r.x + lw - 4, y + 2, 2, rowH - 5, G.EL[d.el].color);
        UI.region(r.x, y, lw, rowH, { onClick: () => { CH.sel = id; } });
      });
      if (ids.length > vis) { UI.button(ctx, r.x + lw - 14, ly + lh - 11, 12, 10, '▼', () => { CH.scroll++; }); UI.button(ctx, r.x + lw - 28, ly + lh - 11, 12, 10, '▲', () => { CH.scroll--; }); }
      // détails
      const dx = r.x + lw + 6, dw = r.w - lw - 6;
      const cs = S.chars[CH.sel], d = G.CHARS[CH.sel], st = G.charStats(cs);
      px(ctx, dx, ly, dw, lh, '#f3eee2'); px(ctx, dx, ly, dw, 1, C().gold);
      const el = G.EL[d.el];
      const by = ly + lh - 17;
      const sc = (by - ly - 8) >= 128 ? 4 : 3;
      const spr = G.S.charFrame(CH.sel, 'd', 0);
      const spw = spr.width * sc;
      for (let i = 0; i < spw; i += 2) px(ctx, dx + 6 + i, ly + 6 + 29 * sc, 2, 3, G.mix(el.light, '#f3eee2', 0.5));
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(spr, dx + 6, ly + 6, spw, spr.height * sc);
      const ix = dx + 6 + spw + 8, iw = dx + dw - ix - 6;
      G.text(ctx, d.name, ix, ly + 5, C().ink, { scale: 2 });
      ctx.drawImage(G.I.elSym(d.el), ix + G.textW(d.name, 2) + 6, ly + 6);
      rarityStars(ctx, d.rarity, ix, ly + 22);
      G.text(ctx, d.title, ix, ly + 31, C().inkL);
      G.text(ctx, 'Nv. ' + cs.level + '/90' + (cs.c ? '   Constellation ' + cs.c : ''), ix, ly + 42, C().ink);
      const need = G.charExpToNext(cs.level), bw = Math.min(iw, 140);
      px(ctx, ix, ly + 52, bw, 4, '#cfc7b4'); px(ctx, ix, ly + 52, cs.level >= 90 ? bw : Math.round(bw * cs.exp / need), 4, '#d3a64a');
      const stats = [['PV max', G.fmt(st.hp)], ['ATQ', G.fmt(st.atk)], ['DÉF', G.fmt(st.def)], ['Taux crit.', (st.cr * 100).toFixed(1) + '%'], ['Dég. crit.', (st.cd * 100).toFixed(1) + '%'], [el.fr, '+' + (st.elb * 100).toFixed(1) + '%']];
      const two = iw >= 190, colW = two ? Math.floor(iw / 2) : iw;
      const sy2 = ly + 62;
      const maxRows = Math.max(2, Math.floor((by - sy2 - 6) / 10));
      stats.slice(0, two ? 6 : Math.min(6, maxRows)).forEach((s2, i) => { const x = ix + (two ? (i % 2) * colW : 0), y = sy2 + (two ? Math.floor(i / 2) : i) * 10; G.text(ctx, s2[0], x, y, C().inkL); G.text(ctx, s2[1], x + colW - 8, y, C().ink, { align: 'r' }); });
      let ky = sy2 + (two ? 34 : Math.min(6, maxRows) * 10 + 4);
      if (ky + 28 <= by) {
        G.text(ctx, 'E · ' + d.skill.n, ix, ky, '#7a4ab0'); ky += 10;
        G.text(ctx, 'Q · ' + d.burst.n, ix, ky, '#b8602a'); ky += 10;
        G.text(ctx, d.wname + ' (' + G.WEAPONS[d.weapon].fr + ')', ix, ky, C().inkL);
      }
      // améliorer
      let bxx = dx + dw - 6;
      ['book3', 'book2', 'book1'].forEach((id) => {
        const n = S.inv[id] || 0;
        bxx -= 42;
        UI.button(ctx, bxx, by, 40, 14, '', () => {
          if (cs.level >= 90) { G.toast('Niveau maximal.'); return; }
          if (!G.spend(id, 1)) return;
          const g = G.addCharExp(cs, G.ITEMS[id].exp);
          if (g && G.Audio) G.Audio.sfx('levelup');
          G.toast(d.name + ' : niveau ' + cs.level);
        }, { disabled: n < 1 || cs.level >= 90 });
        ctx.drawImage(G.I.item(id), bxx + 1, by - 1, 15, 15);
        G.text(ctx, '×' + n, bxx + 18, by + 4, n ? C().ink : '#8a8a8a');
      });
      G.text(ctx, 'EXP :', bxx - 4, by + 4, C().inkL, { align: 'r' });
      // équipe
      const inP = S.party.indexOf(CH.sel);
      if (inP < 0) UI.button(ctx, dx + 6, by, 78, 14, 'Dans l’équipe', () => { if (CH.slot < S.party.length) S.party[CH.slot] = CH.sel; else if (S.party.length < 4) S.party.push(CH.sel); S.active = G.clamp(S.active, 0, S.party.length - 1); });
      else UI.button(ctx, dx + 6, by, 78, 14, 'Échanger place', () => { if (CH.slot !== inP && S.party[CH.slot]) { const a = S.party[CH.slot]; S.party[CH.slot] = S.party[inP]; S.party[inP] = a; } });
    },
  };

  // =====================================================================
  //  Sac à dos
  // =====================================================================
  const BG = { tab: 0, sel: null, scroll: 0 };
  M.defs.bag = {
    open() { BG.scroll = 0; },
    draw(ctx, w, h, t) {
      const S = G.state;
      const r = M.frame(ctx, w, h, 'Sac à dos');
      const tabs = ['Tout', 'Nourriture', 'Matériaux', 'Précieux'];
      let tx0 = r.x; tabs.forEach((n, i) => { const tw2 = G.textW(n) + 12; UI.button(ctx, tx0, r.y - 2, tw2, 12, n, () => { BG.tab = i; BG.scroll = 0; }, { selected: BG.tab === i }); tx0 += tw2 + 3; });
      const all = Object.keys(S.inv).filter((id) => S.inv[id] > 0 && G.ITEMS[id]);
      const inTab = (id) => { const it = G.ITEMS[id]; if (BG.tab === 0) return true; if (BG.tab === 1) return !!it.heal; if (BG.tab === 3) return ['mora', 'primo', 'fate', 'stardust', 'starglitter'].includes(id); return !it.heal && !['mora', 'primo', 'fate', 'stardust', 'starglitter'].includes(id); };
      const ids = all.filter(inTab).sort((a, b) => G.ITEMS[b].rarity - G.ITEMS[a].rarity);
      const gx = r.x, gy = r.y + 14, gw = Math.floor(r.w * 0.62), gh = r.h - 16;
      px(ctx, gx, gy, gw, gh, '#ded6c4'); px(ctx, gx, gy, gw, 1, C().gold);
      const cell = 26, cellH = 28, cols = Math.max(3, Math.floor((gw - 4) / cell));
      const vr = Math.floor((gh - 2) / cellH);
      BG.scroll = G.clamp(BG.scroll, 0, Math.max(0, Math.ceil(ids.length / cols) - vr));
      const sl = ids.slice(BG.scroll * cols, (BG.scroll + vr) * cols);
      sl.forEach((id, i) => {
        const x = gx + 2 + (i % cols) * cell, y = gy + 2 + Math.floor(i / cols) * cellH;
        const it = G.ITEMS[id];
        px(ctx, x, y, cell - 2, cellH - 2, G.mix(C().rar[it.rarity], '#ffffff', 0.62));
        px(ctx, x, y + cellH - 4, cell - 2, 2, C().rar[it.rarity]);
        ctx.drawImage(G.I.item(id), x + 4, y + 1);
        G.text(ctx, G.fmt(S.inv[id]), x + (cell - 2) / 2, y + 17, '#2a2a3a', { align: 'c' });
        if (BG.sel === id) { px(ctx, x - 1, y - 1, cell, 1, C().ink); px(ctx, x - 1, y + cellH - 2, cell, 1, C().ink); px(ctx, x - 1, y - 1, 1, cellH, C().ink); px(ctx, x + cell - 3, y - 1, 1, cellH, C().ink); }
        UI.region(x, y, cell - 2, cellH - 2, { onClick: () => { BG.sel = id; } });
      });
      if (ids.length > cols * vr) { UI.button(ctx, gx + gw - 14, gy + gh - 12, 12, 10, '▼', () => { BG.scroll++; }); UI.button(ctx, gx + gw - 28, gy + gh - 12, 12, 10, '▲', () => { BG.scroll--; }); }
      if (!ids.length) G.text(ctx, 'Rien ici.', gx + gw / 2, gy + 20, C().inkL, { align: 'c' });
      // détails
      const dx = gx + gw + 4, dw = r.w - gw - 4;
      px(ctx, dx, gy, dw, gh, '#f3eee2'); px(ctx, dx, gy, dw, 1, C().gold);
      const id = BG.sel && S.inv[BG.sel] > 0 ? BG.sel : null;
      if (id) {
        const it = G.ITEMS[id];
        ctx.drawImage(G.I.item(id), dx + 4, gy + 4, 24, 24);
        G.wrap(it.name, dw - 34, 1).forEach((ln, i) => G.text(ctx, ln, dx + 32, gy + 5 + i * 9, C().ink));
        rarityStars(ctx, Math.max(1, it.rarity), dx + 32, gy + 22, C().rar[it.rarity]);
        G.wrap(it.desc, dw - 10, 1).forEach((ln, i) => G.text(ctx, ln, dx + 5, gy + 36 + i * 9, C().inkL));
        G.text(ctx, 'Quantité : ' + G.fmt(S.inv[id]), dx + 5, gy + gh - 32, C().ink);
        if (it.heal) UI.button(ctx, dx + 5, gy + gh - 18, dw - 10, 13, 'Utiliser (équipe active)', () => { const cs = G.cs(); if (cs.hp >= G.charStats(cs).hp) { G.toast('PV déjà au maximum.'); return; } G.useFood(id, cs); });
        else if (it.exp) G.text(ctx, 'À utiliser dans Personnages.', dx + 5, gy + gh - 16, C().inkL);
      } else G.text(ctx, 'Sélectionnez un objet.', dx + 5, gy + 6, C().inkL);
    },
  };

  // =====================================================================
  //  Vœux
  // =====================================================================
  const WS = { banner: 0, mode: 'idle', t: 0, results: [], idx: 0, hist: [] };
  function pullOne(b) {
    const S = G.state, P = S.pity;
    const k = b.id === 'event' ? 'e' : 's';
    P[k + '5']++; P[k + '4']++;
    S.stats.wishes++;
    let r5 = 0.006 + (P[k + '5'] >= 74 ? (P[k + '5'] - 73) * 0.06 : 0);
    if (P[k + '5'] >= 90) r5 = 1;
    const roll = Math.random();
    if (roll < r5) {
      P[k + '5'] = 0;
      let id;
      if (b.id === 'event') {
        if (P.guaranteed || Math.random() < 0.5) { id = b.featured5; P.guaranteed = false; }
        else { id = G.pick(G.POOL5); P.guaranteed = true; }
      } else id = G.pick(G.POOL5.concat(['venti']));
      return { rarity: 5, id };
    }
    if (P[k + '4'] >= 10 || roll < r5 + 0.051) {
      P[k + '4'] = 0;
      const id = b.id === 'event' && Math.random() < 0.5 ? G.pick(b.featured4) : G.pick(G.POOL4);
      return { rarity: 4, id };
    }
    return { rarity: 3, item: G.pick(['book1', 'stardust', 'apple', 'slimeC']) };
  }
  function applyResult(rs) {
    const S = G.state;
    if (rs.id) {
      const cs = S.chars[rs.id];
      if (cs) { rs.dup = true; cs.c = Math.min(6, (cs.c || 0) + 1); G.gain('starglitter', rs.rarity === 5 ? 25 : 5, true); }
      else { S.chars[rs.id] = { id: rs.id, level: 1, exp: 0, hp: 0, energy: 0, cdE: 0, cdQ: 0, c: 0 }; S.chars[rs.id].hp = G.charStats(S.chars[rs.id]).hp; rs.isNew = true; }
    } else G.gain(rs.item, rs.item === 'stardust' ? 15 : rs.item === 'book1' ? 2 : 1, true);
  }
  function doWish(n) {
    const S = G.state;
    if ((S.inv.fate || 0) < n) { G.toast('Pas assez de Destins entrelacés.'); return; }
    S.inv.fate -= n;
    const b = G.BANNERS[WS.banner];
    const res = [];
    for (let i = 0; i < n; i++) res.push(pullOne(b));
    res.forEach(applyResult);
    S.bp.xp += n * 4;
    WS.results = res; WS.idx = 0; WS.mode = 'anim'; WS.t = 0;
    WS.best = Math.max.apply(null, res.map((x) => x.rarity));
    if (G.Audio) G.Audio.sfx('wish');
  }
  M.defs.wish = {
    open() { WS.mode = 'idle'; },
    update(dt) {
      WS.t += dt;
      if (WS.mode === 'anim' && WS.t > 2.6) { WS.mode = 'reveal'; WS.t = 0; WS.idx = 0; revealSfx(); }
      else if (WS.mode === 'reveal' && G.input.anyEdge('Space', 'Enter', 'KeyF')) WS.next();
    },
    draw(ctx, w, h, t) {
      const S = G.state;
      // fond étoilé
      for (let y = 0; y < h; y += 4) px(ctx, 0, y, w, 4, G.mix('#120c2e', '#3a2a6a', y / h));
      const rs = G.rng(77);
      for (let i = 0; i < 70; i++) { const x = rs() * w, y = rs() * h, tw = Math.sin(t * 2 + i) > 0.2 ? 2 : 1; px(ctx, x, y, tw, tw, i % 5 ? '#c8c0ff' : '#ffffff'); }
      UI.region(0, 0, w, h, {});
      if (WS.mode === 'anim') return drawAnim(ctx, w, h, t);
      if (WS.mode === 'reveal') return drawReveal(ctx, w, h, t);
      if (WS.mode === 'summary') return drawSummary(ctx, w, h, t);
      const b = G.BANNERS[WS.banner];
      UI.button(ctx, w - 40, 6, 32, 13, '✕', () => M.close());
      G.text(ctx, 'Vœux', 12, 8, '#f4efe0', { outline: '#10182a', scale: 2 });
      // bannières
      G.BANNERS.forEach((bn, i) => UI.button(ctx, 12, 28 + i * 18, 86, 16, bn.name, () => { WS.banner = i; }, { selected: WS.banner === i }));
      // visuel
      const cx = Math.round(w / 2), cy = Math.round(h * 0.5);
      const feat = b.featured5 || 'keqing';
      const spr = G.S.charFrame(feat, 'd', 0);
      const sc = Math.max(3, Math.round(h / 60));
      for (let i = 0; i < 30; i++) { const a = (i / 30) * 6.28 + t * 0.3; px(ctx, cx + Math.cos(a) * (sc * 14 + Math.sin(t * 2 + i) * 4), cy + Math.sin(a) * (sc * 8 + Math.cos(t * 2 + i) * 3), 2, 2, '#ffe9a0'); }
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(spr, cx - spr.width * sc / 2, cy - spr.height * sc / 2 + Math.round(Math.sin(t * 2) * 2), spr.width * sc, spr.height * sc);
      G.text(ctx, b.name, cx, Math.round(h * 0.1), '#ffe9a0', { align: 'c', outline: '#3a2a10', scale: 2 });
      G.text(ctx, b.sub, cx, Math.round(h * 0.1) + 18, '#f4efe0', { align: 'c', outline: '#10182a' });
      // compteurs
      const k = b.id === 'event' ? 'e' : 's';
      G.text(ctx, 'Pitié 5★ : ' + S.pity[k + '5'] + '/90   4★ : ' + S.pity[k + '4'] + '/10', cx, h - 52, '#c8d0e0', { align: 'c', outline: '#10182a' });
      if (b.id === 'event') G.text(ctx, S.pity.guaranteed ? '5★ garanti : ' + G.CHARS[b.featured5].name : 'Taux 50/50 sur le personnage vedette', cx, h - 42, S.pity.guaranteed ? '#ffe27a' : '#9aa6c0', { align: 'c', outline: '#10182a' });
      // boutons
      const by = h - 30;
      UI.button(ctx, cx - 112, by, 106, 18, 'Vœu ×1 (1 Destin)', () => doWish(1));
      UI.button(ctx, cx + 6, by, 106, 18, 'Vœu ×10 (10 Destins)', () => doWish(10));
      ctx.drawImage(G.I.item('fate'), 12, h - 32); G.text(ctx, '×' + (S.inv.fate || 0), 30, h - 28, '#ffffff', { outline: '#10182a' });
      ctx.drawImage(G.I.item('primo'), 12, h - 16); G.text(ctx, '×' + G.fmt(S.inv.primo || 0), 30, h - 12, '#ffffff', { outline: '#10182a' });
      UI.button(ctx, w - 132, h - 30, 124, 13, '160 Gemmes → 1 Destin', () => { if (G.spend('primo', 160)) { G.gain('fate', 1, true); G.toast('+1 Destin entrelacé'); } else G.toast('Pas assez de Gemmes primordiales.'); });
      UI.button(ctx, w - 132, h - 15, 124, 13, '5 Éclats → 1 Destin', () => { if (G.spend('starglitter', 5)) { G.gain('fate', 1, true); G.toast('+1 Destin entrelacé'); } else G.toast('Pas assez d’Éclats d’étoile.'); });
    },
  };
  function revealSfx() { const r = WS.results[WS.idx]; if (G.Audio && r) G.Audio.sfx('star' + r.rarity); }
  WS.next = function () {
    if (WS.idx + 1 < WS.results.length) { WS.idx++; WS.t = 0; revealSfx(); }
    else { WS.mode = 'summary'; WS.t = 0; }
  };
  function drawAnim(ctx, w, h, t) {
    const k = WS.t / 2.6;
    const col = WS.best === 5 ? '#ffd45a' : WS.best === 4 ? '#c07dff' : '#6ab8ff';
    // météore
    const x = w * (0.1 + 0.8 * Math.min(1, k * 1.2)), y = h * (0.05 + 0.6 * Math.min(1, k * 1.2));
    for (let i = 0; i < 60; i++) { const a = i / 60; px(ctx, x - a * 60, y - a * 40, 3 - Math.floor(a * 2.5), 3 - Math.floor(a * 2.5), a < 0.2 ? '#ffffff' : col); }
    ctx.globalAlpha = Math.max(0, (k - 0.7) / 0.3);
    px(ctx, 0, 0, w, h, col);
    ctx.globalAlpha = 1;
    UI.region(0, 0, w, h, { onClick: () => { WS.t = 2.6; } });
    G.text(ctx, 'Toucher pour passer', w / 2, h - 12, '#c8d0e0', { align: 'c' });
  }
  function drawReveal(ctx, w, h, t) {
    const r = WS.results[WS.idx];
    const col = r.rarity === 5 ? '#ffd45a' : r.rarity === 4 ? '#c07dff' : '#6ab8ff';
    const k = Math.min(1, WS.t / 0.6);
    // rayons
    for (let i = 0; i < 16; i++) { const a = (i / 16) * 6.28 + t * 0.4; for (let l = 10; l < 120 * k; l += 3) px(ctx, w / 2 + Math.cos(a) * l, h * 0.45 + Math.sin(a) * l * 0.6, 2, 2, G.mix(col, '#120c2e', l / 130)); }
    if (r.id) {
      const d = G.CHARS[r.id];
      const spr = G.S.charFrame(r.id, 'd', 0);
      const sc = Math.max(4, Math.round(h / 40));
      ctx.imageSmoothingEnabled = false;
      ctx.globalAlpha = k;
      ctx.drawImage(spr, w / 2 - spr.width * sc / 2, h * 0.45 - spr.height * sc / 2 - (1 - k) * 20, spr.width * sc, spr.height * sc);
      ctx.globalAlpha = 1;
      G.text(ctx, d.name, w / 2, h * 0.7, '#ffffff', { align: 'c', outline: '#10182a', scale: 2 });
      ctx.drawImage(G.I.elSym(d.el), w / 2 - 20 - G.textW(d.name, 2) / 2, h * 0.7 + 2);
      G.text(ctx, '★'.repeat(r.rarity), w / 2, h * 0.7 + 18, col, { align: 'c', outline: '#10182a' });
      if (r.isNew) G.text(ctx, 'NOUVEAU !', w / 2, h * 0.2, '#ffe27a', { align: 'c', outline: '#3a2a10', scale: 2 });
      else G.text(ctx, 'Constellation +1   (+' + (r.rarity === 5 ? 25 : 5) + ' Éclats d’étoile)', w / 2, h * 0.2, '#c8d0e0', { align: 'c', outline: '#10182a' });
    } else {
      const it = G.ITEMS[r.item];
      ctx.drawImage(G.I.item(r.item), w / 2 - 24, h * 0.4 - 24, 48, 48);
      G.text(ctx, it.name, w / 2, h * 0.7, '#ffffff', { align: 'c', outline: '#10182a' });
      G.text(ctx, '★★★', w / 2, h * 0.7 + 12, col, { align: 'c', outline: '#10182a' });
    }
    G.text(ctx, (WS.idx + 1) + ' / ' + WS.results.length, w - 10, 8, '#c8d0e0', { align: 'r' });
    UI.region(0, 0, w, h, { onClick: () => WS.next() });
    UI.button(ctx, w - 50, h - 20, 42, 13, 'Passer', () => { WS.mode = 'summary'; WS.t = 0; });
  }
  function drawSummary(ctx, w, h, t) {
    G.text(ctx, 'Résultats', w / 2, 10, '#f4efe0', { align: 'c', outline: '#10182a', scale: 2 });
    const n = WS.results.length, cols = Math.min(5, n), cw = 54;
    const x0 = w / 2 - (cols * cw) / 2, y0 = Math.round(h * 0.2);
    WS.results.forEach((r, i) => {
      const x = x0 + (i % cols) * cw, y = y0 + Math.floor(i / cols) * 56;
      const col = r.rarity === 5 ? '#ffd45a' : r.rarity === 4 ? '#c07dff' : '#6ab8ff';
      px(ctx, x + 2, y, cw - 4, 50, G.mix(col, '#10182a', 0.7)); px(ctx, x + 2, y + 47, cw - 4, 3, col);
      if (r.id) { ctx.drawImage(G.S.portrait(r.id, 24), x + 8, y + 4); G.text(ctx, G.fit(G.CHARS[r.id].name, cw - 4), x + cw / 2, y + 32, '#fff', { align: 'c' }); if (r.isNew) G.text(ctx, 'NEW', x + cw / 2, y + 5, '#ffe27a', { align: 'c', outline: '#3a2a10' }); }
      else { ctx.drawImage(G.I.item(r.item), x + 12, y + 8); G.text(ctx, G.fit(G.ITEMS[r.item].name, cw - 4), x + cw / 2, y + 32, '#fff', { align: 'c' }); }
      G.text(ctx, '★'.repeat(r.rarity), x + cw / 2, y + 40, col, { align: 'c' });
    });
    UI.button(ctx, w / 2 - 30, h - 22, 60, 14, 'Terminer', () => { WS.mode = 'idle'; });
  }

  // =====================================================================
  //  Quêtes
  // =====================================================================
  M.defs.quests = {
    draw(ctx, w, h, t) {
      const S = G.state, Q = G.Quest;
      const r = M.frame(ctx, w, h, 'Journal de quêtes');
      const lw = Math.floor(r.w * 0.4);
      px(ctx, r.x, r.y, lw, r.h, '#ded6c4');
      const cur = Q.cur();
      G.text(ctx, 'Prologue : Le vent de la liberté', r.x + 4, r.y + 5, C().ink);
      G.text(ctx, S.quest.step + '/' + Q.STEPS.length + ' objectifs', r.x + 4, r.y + 15, C().inkL);
      px(ctx, r.x + 4, r.y + 26, lw - 8, 3, '#cfc7b4'); px(ctx, r.x + 4, r.y + 26, Math.round((lw - 8) * S.quest.step / Q.STEPS.length), 3, '#d3a64a');
      G.text(ctx, 'Commissions : ' + (S.commissions ? S.commissions.filter((c) => c.claimed).length : 0) + '/4', r.x + 4, r.y + 36, C().inkL);
      const dx = r.x + lw + 4, dw = r.w - lw - 4;
      px(ctx, dx, r.y, dw, r.h, '#f3eee2');
      let y = r.y + 5;
      Q.STEPS.forEach((s, i) => {
        if (i > S.quest.step) return;
        const done = i < S.quest.step;
        const txt = (done ? '✓ ' : '◆ ') + s.text + (!done && s.t === 'kill' ? ' (' + Math.min(s.n, S.quest.prog || 0) + '/' + s.n + ')' : '');
        const lines = G.wrap(txt, dw - 10, 1);
        lines.forEach((ln, k) => G.text(ctx, ln, dx + 5, y + k * 9, done ? '#8a8a8a' : C().ink));
        y += lines.length * 9 + 3;
      });
      if (!cur) G.text(ctx, 'Prologue terminé. Explorez, vœux et commissions vous attendent !', dx + 5, y + 4, '#5a8a3a');
      if (cur) {
        const tg = Q.target();
        if (tg) UI.button(ctx, dx + 5, r.y + r.h - 18, 90, 13, 'Voir sur la carte', () => M.open('map', { prev: 'quests' }));
      }
    },
  };

  // =====================================================================
  //  Commissions
  // =====================================================================
  M.defs.commissions = {
    draw(ctx, w, h, t) {
      const S = G.state, Q = G.Quest;
      Q.ensureCommissions();
      const r = M.frame(ctx, w, h, 'Commissions de la Guilde — Jour ' + S.day);
      const rh = Math.min(30, Math.floor((r.h - 30) / 4));
      S.commissions.forEach((c, i) => {
        const y = r.y + i * (rh + 3);
        px(ctx, r.x, y, r.w, rh, i % 2 ? '#e8e0d0' : '#f0e9db');
        G.text(ctx, (c.claimed ? '✓ ' : '◆ ') + c.text, r.x + 6, y + 4, c.claimed ? '#8a8a8a' : C().ink);
        px(ctx, r.x + 6, y + 15, r.w - 90, 4, '#cfc7b4'); px(ctx, r.x + 6, y + 15, Math.round((r.w - 90) * Math.min(1, c.prog / c.n)), 4, c.prog >= c.n ? '#8bd648' : '#d3a64a');
        G.text(ctx, Math.min(c.prog, c.n) + '/' + c.n, r.x + r.w - 80, y + 14, C().inkL);
        ctx.drawImage(G.I.item('primo'), r.x + r.w - 62, y + 2, 14, 14); G.text(ctx, '10', r.x + r.w - 46, y + 6, C().ink);
        ctx.drawImage(G.I.item('mora'), r.x + r.w - 36, y + 2, 14, 14); G.text(ctx, '800', r.x + r.w - 20, y + 6, C().ink);
      });
      const by = r.y + 4 * (rh + 3) + 2;
      const n = Q.commissionsClaimable();
      UI.button(ctx, r.x, by, 120, 14, n ? 'Récupérer (' + n + ')' : 'Rien à récupérer', () => { const k = Q.claimCommissions(); if (k) { if (G.Audio) G.Audio.sfx('levelup'); } }, { disabled: !n });
      G.text(ctx, 'Terminez les 4 commissions : +60 Gemmes, 1 Destin, 2 000 Méra.', r.x + 126, by + 3, C().inkL);
      G.text(ctx, S.commBonus ? 'Bonus quotidien obtenu ✓' : '', r.x + 126, by + 13, '#5a8a3a');
    },
  };

  // =====================================================================
  //  Passe de combat
  // =====================================================================
  const BP_LEVELS = 30;
  const bpReward = (lv) => (lv % 10 === 0 ? { id: 'fate', n: 2 } : lv % 5 === 0 ? { id: 'fate', n: 1 } : lv % 3 === 0 ? { id: 'book2', n: 2 } : lv % 2 === 0 ? { id: 'mora', n: 5000 } : { id: 'book1', n: 3 });
  const BPs = { scroll: 0 };
  M.defs.pass = {
    draw(ctx, w, h, t) {
      const S = G.state;
      const r = M.frame(ctx, w, h, 'Passe de combat');
      const lvl = Math.min(BP_LEVELS, 1 + Math.floor(S.bp.xp / 100));
      G.text(ctx, 'Niveau ' + lvl + '/' + BP_LEVELS + '   ·   EXP : ' + (S.bp.xp % 100) + '/100', r.x, r.y + 2, C().ink);
      px(ctx, r.x, r.y + 12, r.w, 4, '#cfc7b4'); px(ctx, r.x, r.y + 12, Math.round(r.w * (lvl >= BP_LEVELS ? 1 : (S.bp.xp % 100) / 100)), 4, '#d3a64a');
      G.text(ctx, 'L’EXP vient des ennemis, coffres, vœux et commissions.', r.x, r.y + 20, C().inkL);
      const cw = 36, cols = Math.max(3, Math.floor(r.w / cw)), rows = Math.floor((r.h - 50) / 40);
      const total = BP_LEVELS;
      BPs.scroll = G.clamp(BPs.scroll, 0, Math.max(0, Math.ceil(total / cols) - rows));
      for (let i = 0; i < cols * rows; i++) {
        const lv = BPs.scroll * cols + i + 1;
        if (lv > total) break;
        const x = r.x + (i % cols) * cw, y = r.y + 32 + Math.floor(i / cols) * 40;
        const rw = bpReward(lv), got = !!S.bp.claimed[lv], can = lv <= lvl && !got;
        px(ctx, x + 1, y, cw - 2, 38, got ? '#d4d0c4' : can ? '#fff2c0' : '#ece5d8'); px(ctx, x + 1, y, cw - 2, 1, can ? '#e8a838' : C().gold);
        G.text(ctx, 'Nv.' + lv, x + cw / 2, y + 3, C().ink, { align: 'c' });
        ctx.drawImage(G.I.item(rw.id), x + cw / 2 - 8, y + 11);
        G.text(ctx, '×' + G.fmt(rw.n), x + cw / 2, y + 28, C().ink, { align: 'c' });
        if (can) UI.region(x, y, cw, 38, { onClick: () => { S.bp.claimed[lv] = true; G.gain(rw.id, rw.n); if (G.Audio) G.Audio.sfx('pickup'); } });
        if (got) G.text(ctx, '✓', x + cw - 8, y + 3, '#5a8a3a');
      }
      UI.button(ctx, r.x, r.y + r.h - 14, 90, 13, 'Tout récupérer', () => { for (let lv = 1; lv <= lvl; lv++) if (!S.bp.claimed[lv]) { const rw = bpReward(lv); S.bp.claimed[lv] = true; G.gain(rw.id, rw.n, true); } G.toast('Récompenses du passe récupérées.'); if (G.Audio) G.Audio.sfx('chest'); });
      UI.button(ctx, r.x + r.w - 28, r.y + r.h - 14, 12, 12, '▲', () => { BPs.scroll--; });
      UI.button(ctx, r.x + r.w - 14, r.y + r.h - 14, 12, 12, '▼', () => { BPs.scroll++; });
    },
  };

  // =====================================================================
  //  Manuel (codex & stats)
  // =====================================================================
  const HB = { tab: 0 };
  M.defs.handbook = {
    draw(ctx, w, h, t) {
      const S = G.state;
      const r = M.frame(ctx, w, h, 'Manuel d’aventure');
      ['Ennemis', 'Statistiques'].forEach((n, i) => UI.button(ctx, r.x + i * 76, r.y - 2, 74, 12, n, () => { HB.tab = i; }, { selected: HB.tab === i }));
      if (HB.tab === 0) {
        const keys = Object.keys(G.ENEMIES);
        const cols = 3, cw = Math.floor(r.w / cols), rh = 22;
        keys.forEach((k, i) => {
          const d = G.ENEMIES[k], n = S.codex[k] || 0;
          const x = r.x + (i % cols) * cw, y = r.y + 16 + Math.floor(i / cols) * rh;
          px(ctx, x + 1, y, cw - 3, rh - 2, n ? '#f3eee2' : '#d4cfc2');
          G.text(ctx, n ? d.name : '???', x + 4, y + 3, n ? C().ink : '#8a8a8a');
          G.text(ctx, n ? 'Vaincus : ' + n : 'Inconnu', x + 4, y + 12, C().inkL);
          if (d.el && n) ctx.drawImage(G.I.elSym(d.el), x + cw - 16, y + 4);
        });
      } else {
        const rows = [
          ['Temps de jeu', G.fmtT(S.stats.play)], ['Ennemis vaincus', G.fmt(S.stats.kills)], ['Coffres ouverts', G.fmt(S.stats.chests)],
          ['Réactions élémentaires', G.fmt(S.stats.reactions)], ['Objets cueillis', G.fmt(S.stats.flowers)], ['Anémoculi', G.fmt(S.stats.anemo)],
          ['Vœux effectués', G.fmt(S.stats.wishes)], ['Personnages obtenus', Object.keys(S.chars).length + '/' + G.CHAR_ORDER.length],
        ];
        rows.forEach((rw, i) => { const y = r.y + 18 + i * 14; px(ctx, r.x, y, r.w, 13, i % 2 ? '#e8e0d0' : '#f0e9db'); G.text(ctx, rw[0], r.x + 6, y + 3, C().ink); G.text(ctx, rw[1], r.x + r.w - 6, y + 3, C().ink, { align: 'r' }); });
      }
    },
  };

  // =====================================================================
  //  Boutique
  // =====================================================================
  const SH = { tab: 0, sc: 0 };
  M.defs.shop = {
    draw(ctx, w, h, t) {
      const S = G.state;
      const r = M.frame(ctx, w, h, 'Boutique de Sara');
      ['Acheter', 'Vendre'].forEach((n, i) => UI.button(ctx, r.x + i * 60, r.y - 2, 58, 12, n, () => { SH.tab = i; }, { selected: SH.tab === i }));
      ctx.drawImage(G.I.item('mora'), r.x + r.w - 70, r.y - 3, 14, 14); G.text(ctx, G.fmt(S.inv.mora || 0), r.x + r.w - 54, r.y + 1, C().ink);
      const rh = 18;
      const list = SH.tab === 0 ? G.SHOP.map((s) => ({ id: s.id, price: s.price })) : Object.keys(G.SELL).filter((id) => (S.inv[id] || 0) > 0).map((id) => ({ id, price: G.SELL[id] }));
      list.slice(0, Math.floor((r.h - 22) / rh)).forEach((it, i) => {
        const y = r.y + 14 + i * rh;
        const d = G.ITEMS[it.id];
        px(ctx, r.x, y, r.w, rh - 1, i % 2 ? '#e8e0d0' : '#f0e9db');
        ctx.drawImage(G.I.item(it.id), r.x + 2, y + 1);
        G.text(ctx, d.name, r.x + 22, y + 2, C().ink);
        G.text(ctx, SH.tab === 0 ? d.desc.slice(0, 44) : '×' + (S.inv[it.id] || 0), r.x + 22, y + 10, C().inkL);
        const lab = SH.tab === 0 ? it.price + ' Méra' : '+' + it.price + ' (1)';
        UI.button(ctx, r.x + r.w - 62, y + 2, 58, 13, lab, () => {
          if (SH.tab === 0) { if (G.spend('mora', it.price)) { G.gain(it.id, 1); if (G.Audio) G.Audio.sfx('mora'); } else G.toast('Pas assez de Méra.'); }
          else if (G.spend(it.id, 1)) { G.gain('mora', it.price, true); G.toast('Vendu : ' + d.name, 'mora', it.price); if (G.Audio) G.Audio.sfx('mora'); }
        }, { disabled: SH.tab === 0 && (S.inv.mora || 0) < it.price });
      });
      if (SH.tab === 1) { if (!list.length) G.text(ctx, 'Rien à vendre.', r.x + 6, r.y + 18, C().inkL); else UI.button(ctx, r.x, r.y + r.h - 14, 100, 13, 'Tout vendre', () => { let tot = 0; for (const it of list) { const n = S.inv[it.id]; tot += n * it.price; S.inv[it.id] = 0; } G.gain('mora', tot); }); }
    },
  };

  // =====================================================================
  //  Journal des messages (chat)
  // =====================================================================
  M.defs.log = {
    draw(ctx, w, h) {
      const r = M.frame(ctx, w, h, 'Messages récents');
      G.logMsgs.slice(-Math.floor((r.h - 4) / 10)).forEach((m, i) => G.text(ctx, '· ' + m, r.x + 4, r.y + 3 + i * 10, C().ink));
      if (!G.logMsgs.length) G.text(ctx, 'Aucun message.', r.x + 4, r.y + 4, C().inkL);
    },
  };

  // =====================================================================
  //  Réglages
  // =====================================================================
  M.defs.settings = {
    draw(ctx, w, h, t) {
      const S = G.state;
      const r = M.frame(ctx, w, h, 'Réglages');
      const slider = (label, key, y, cb) => {
        G.text(ctx, label, r.x + 6, y + 2, C().ink);
        const sx = r.x + 90, sw = Math.min(140, r.w - 160);
        px(ctx, sx, y + 2, sw, 5, '#cfc7b4'); px(ctx, sx, y + 2, Math.round(sw * S.settings[key]), 5, '#d3a64a');
        px(ctx, sx + Math.round(sw * S.settings[key]) - 1, y, 3, 9, C().ink);
        UI.region(sx - 3, y - 3, sw + 6, 14, { drag: (x, yy, ph) => { S.settings[key] = G.clamp((x - sx) / sw, 0, 1); cb(); } });
        G.text(ctx, Math.round(S.settings[key] * 100) + '%', sx + sw + 8, y + 2, C().inkL);
      };
      slider('Musique', 'music', r.y + 6, () => G.Audio.setVolumes(S.settings.music, S.settings.sfx));
      slider('Effets sonores', 'sfx', r.y + 22, () => G.Audio.setVolumes(S.settings.music, S.settings.sfx));
      UI.button(ctx, r.x + 6, r.y + 38, 150, 13, 'Suivi de quête : ' + (S.settings.hints !== false ? 'oui' : 'non'), () => { S.settings.hints = !(S.settings.hints !== false); });
      UI.button(ctx, r.x + 6, r.y + 55, 150, 13, 'Sauvegarder maintenant', () => { G.Save.save(); G.toast('Partie sauvegardée.'); });
      UI.button(ctx, r.x + 6, r.y + 72, 150, 13, 'Retour au titre', () => { G.Save.save(); G.toTitle(); });
      const lines = ['Commandes (clavier) :', 'ZQSD / WASD / flèches : se déplacer   Maj : sprint / esquive', 'Clic ou J : attaque   E : compétence   Q : déchaînement', '1-4 : changer de personnage   F : interagir   Espace : saut', 'T : manger   M : carte   C : personnages   B : sac   Échap : menu', 'Tactile : joystick à gauche, boutons à droite.'];
      lines.forEach((ln, i) => G.text(ctx, ln, r.x + 6, r.y + 94 + i * 10, i ? C().inkL : C().ink));
    },
  };

  // =====================================================================
  //  Défaite
  // =====================================================================
  M.defs.dead = {
    draw(ctx, w, h, t) {
      UI.region(0, 0, w, h, {});
      ctx.globalAlpha = 0.7; px(ctx, 0, 0, w, h, '#10060a'); ctx.globalAlpha = 1;
      G.text(ctx, 'Votre équipe a été vaincue', w / 2, h * 0.34, '#ff9a8a', { align: 'c', outline: '#2a0a0a', scale: 2 });
      G.text(ctx, 'Réapparaissez au dernier téléporteur avec la moitié des PV.', w / 2, h * 0.34 + 22, '#e8e0cc', { align: 'c', outline: '#10182a' });
      UI.button(ctx, w / 2 - 50, h * 0.55, 100, 16, 'Réapparaître', () => G.respawn());
    },
  };
})();
