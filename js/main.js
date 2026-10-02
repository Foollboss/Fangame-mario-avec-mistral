/* Teyvat Pixel — démarrage, boucle principale, écran titre, rendu */
(function () {
  const G = window.G;
  const TS = G.TS;
  const px = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  G.mode = 'loading';
  G.view = { w: 456, h: 220, k: 3 };
  G.cam = { x: 0, y: 0 };
  G.shake = 0; G.hitstop = 0; G.freeze = 0; G.sight = 0; G.sightCd = 0;
  let ctx, cv, loadProg = 0, ready = false;
  const title = { sel: 0, t: 0 };

  // ------------------------------------------------------------------
  //  Mise à l'échelle entière
  // ------------------------------------------------------------------
  function resize() {
    const iw = window.innerWidth, ih = window.innerHeight;
    let k = ih < 520 ? Math.max(1, Math.round(ih / 200)) : Math.max(1, Math.round(ih / 290));
    while (k > 1 && iw / k < 320) k--;
    const w = Math.max(200, Math.floor(iw / k)), h = Math.max(120, Math.floor(ih / k));
    G.view.k = k; G.view.w = w; G.view.h = h;
    cv.width = w; cv.height = h;
    cv.style.width = w * k + 'px'; cv.style.height = h * k + 'px';
    ctx = cv.getContext('2d');
    ctx.imageSmoothingEnabled = false;
  }

  // ------------------------------------------------------------------
  //  Démarrage
  // ------------------------------------------------------------------
  async function boot() {
    cv = document.getElementById('game');
    G.canvasEl = cv;
    resize();
    window.addEventListener('resize', resize);
    G.input.attach(cv);
    requestAnimationFrame(frame);
    await new Promise((r) => setTimeout(r, 30));
    loadProg = 0.02;
    await new Promise((r) => setTimeout(r, 30));
    G.World.generate();
    loadProg = 0.15;
    await new Promise((r) => setTimeout(r, 10));
    G.World.populate();
    loadProg = 0.2;
    await G.World.buildChunks((p) => { loadProg = 0.2 + p * 0.8; });
    G.Player.reset(G.World.pois.spawn.x, G.World.pois.spawn.y);
    ready = true;
    G.mode = 'title';
    window.G_READY = true;
  }

  G.startGame = function (mode, load) {
    let S;
    if (load) S = G.Save.load();
    if (!S) { S = G.newGame(mode === 'veteran' ? 'veteran' : 'new'); load = false; }
    G.state = S;
    S.settings = S.settings || { music: 0.5, sfx: 0.7, hints: true };
    G.Audio.setVolumes(S.settings.music, S.settings.sfx);
    for (const w of G.World.waypoints) w.unlocked = !!S.unlocked[w.id];
    G.Player.reset(S.pos.x, S.pos.y);
    if (!load) { G.P.dir = 'u'; G.P.ang = -Math.PI / 2; }
    G.feed.length = 0; G.banners.length = 0; G.logMsgs.length = 0;
    G.dialog = null; G.Dialog.active = false; G.fade = null; G.cutin = null; G.pendingBurst = null; G.freeze = 0;
    G.Entities.initWorld();
    G.cam.x = G.P.x; G.cam.y = G.P.y;
    G.paimon.x = G.P.x - 14; G.paimon.y = G.P.y; G.paimon.say = null;
    G.P.region = '';
    G.mode = 'play';
    G.Menus.cur = null;
    if (S.commissions == null) G.Quest.ensureCommissions();
    G.menuDot = true; G.questDot = !load;
    const vetStart = S.mode === 'veteran' && !load;
    G.charDot = vetStart; G.bagDot = vetStart; G.handDot = vetStart; G.commDot = vetStart;
    G.lastAuto = 0;
    if (!load) { G.Story.intro(); G.Save.save(); }
    else G.banner('Bon retour !', 'Rang d’aventure ' + S.ar, 'zone');
  };

  G.toTitle = function () { G.mode = 'title'; G.Menus.cur = null; G.dialog = null; G.Dialog.active = false; title.sel = 0; };

  G.respawn = function () {
    const S = G.state, P = G.P;
    S.party.forEach((id) => { const cs = S.chars[id]; cs.hp = Math.max(1, Math.round(G.charStats(cs).hp * 0.5)); });
    S.active = 0;
    const wps = G.World.waypoints.filter((w) => w.unlocked);
    let best = wps[0], bd = 1e9;
    for (const w of wps) { const d = Math.hypot(w.x - P.x, w.y - P.y); if (d < bd) { bd = d; best = w; } }
    G.Domain.active = false; G.bossFight = null;
    for (const e of G.E.enemies) { e.alert = false; if (e.boss) { e.hp = e.maxhp; e.st = 'idle'; e.x = e.hx; e.y = e.hy; } }
    G.E.proj.length = 0; G.E.zones.length = 0;
    P.dead = false; P.inv = 2; P.hurtT = 0; P.swim = false;
    G.fade = { t: 0, dir: 1, cb: () => { P.x = best.x; P.y = best.y + 16; G.cam.x = P.x; G.cam.y = P.y; } };
    G.mode = 'play'; G.Menus.cur = null;
  };

  // ------------------------------------------------------------------
  //  Mise à jour
  // ------------------------------------------------------------------
  let last = 0, acc = 0, musicT = 0, combatT = 0;
  function frame(ts) {
    requestAnimationFrame(frame);
    if (!last) last = ts;
    let dt = Math.min(0.1, (ts - last) / 1000);
    last = ts;
    if (G.mode === 'loading') { drawLoading(); return; }
    acc += dt;
    let steps = 0;
    while (acc >= 1 / 60 && steps < 5) { update(1 / 60); acc -= 1 / 60; steps++; }
    if (steps === 5) acc = 0;
    draw(ts / 1000);
  }

  function update(dt) {
    const I = G.input;
    G.T = (G.T || 0) + dt;
    if (G.mode === 'title') { title.t += dt; updateTitle(dt); I.endFrame(); return; }
    const S = G.state;
    if (!S) { I.endFrame(); return; }

    // fondu / téléportation
    if (G.fade) {
      const f = G.fade;
      f.t += dt;
      if (!f.fired && f.t >= 0.35) { f.fired = true; if (f.cb) f.cb(); }
      if (f.t >= 0.7) G.fade = null;
    }

    // timers d'interface
    for (let i = G.feed.length - 1; i >= 0; i--) { G.feed[i].t += dt; if (G.feed[i].t >= G.feed[i].life) G.feed.splice(i, 1); }
    if (G.banners[0]) { G.banners[0].t += dt; if (G.banners[0].t >= G.banners[0].life) G.banners.shift(); }
    for (const k in G.UI.shakes) if (G.UI.shakes[k] > 0) G.UI.shakes[k] -= dt;
    if (G.sight > 0) G.sight -= dt; if (G.sightCd > 0) G.sightCd -= dt;
    if (G.shake > 0) G.shake = Math.max(0, G.shake - dt * 18);

    if (G.mode === 'menu') {
      G.Menus.update(dt);
      I.endFrame();
      return;
    }
    if (G.mode === 'dead') { G.P.deadT += dt; I.endFrame(); return; }

    // ouverture des menus depuis le jeu
    if (!G.dialog) {
      if (I.anyEdge('Escape', 'Tab')) G.Menus.open('paimon');
      else if (I.edge('KeyM')) G.Menus.open('map');
      else if (I.edge('KeyC')) G.Menus.open('chars');
      else if (I.edge('KeyB')) G.Menus.open('bag');
      else if (I.edge('KeyL')) G.Menus.open('quests');
      else if (I.edge('KeyG')) G.Menus.open('wish');
      else if (I.edge('KeyV') && !(G.sightCd > 0)) { G.sight = 10; G.sightCd = 14; G.toast('Vue élémentaire activée'); }
      if (G.mode === 'menu') { I.endFrame(); return; }
    }

    // plan rapproché du déchaînement
    if (G.freeze > 0) {
      G.freeze -= dt;
      if (G.cutin) G.cutin.t += dt;
      if (G.freeze <= 0) { G.cutin = null; G.Combat.runBurst(); }
      I.endFrame();
      return;
    }
    if (G.hitstop > 0) { G.hitstop -= dt; I.endFrame(); return; }

    if (G.dialog) { G.Dialog.update(dt); G.updatePaimon(dt); G.updatePaimonSay(dt); I.endFrame(); return; }

    // monde
    S.t += dt; S.stats.play += dt;
    S.tod += dt * 1.2;
    if (S.tod >= 1440) { S.tod -= 1440; S.day++; G.toast('Un nouveau jour se lève sur Mondstadt'); G.Quest.ensureCommissions(); }
    G.Player.update(dt);
    G.Combat.update(dt);
    G.Entities.update(dt, G.cam, G.view.w, G.view.h);
    G.updatePaimon(dt);
    G.updatePaimonSay(dt);
    G.hintTimer -= dt;
    if (G.hintTimer <= 0) { G.hintTimer = 0.7; G.checkHints(); }
    // caméra
    const tx = G.P.x, ty = G.P.y - 6;
    const lerp = 1 - Math.pow(0.0005, dt);
    G.cam.x += (tx - G.cam.x) * lerp; G.cam.y += (ty - G.cam.y) * lerp;
    if (Math.abs(G.cam.x - tx) < 0.2) G.cam.x = tx; if (Math.abs(G.cam.y - ty) < 0.2) G.cam.y = ty;

    // musique
    musicT -= dt;
    if (musicT <= 0) {
      musicT = 0.5;
      let anyCombat = false;
      for (const e of G.E.enemies) if (!e.dead && e.alert && Math.hypot(e.x - G.P.x, e.y - G.P.y) < 240) { anyCombat = true; break; }
      if (anyCombat) combatT = 5;
      combatT -= 0.5;
      const reg = G.P.region;
      G.Audio.setMusic(G.Domain.active && G.Domain.boss && !G.Domain.boss.dead && G.bossFight ? 'boss' : combatT > 0 ? 'combat' : reg === 'Mondstadt' ? 'city' : 'field');
    }
    // sauvegarde auto
    G.lastAuto = (G.lastAuto || 0) + dt;
    if (G.lastAuto > 45) { G.lastAuto = 0; G.Save.save(); }
    // indices de Paimon
    I.endFrame();
  }

  // ------------------------------------------------------------------
  //  Titre
  // ------------------------------------------------------------------
  function titleItems() {
    const items = [];
    const info = G.Save.info();
    items.push({ n: 'Nouvelle aventure', sub: 'Rang 1 — le prologue de Mondstadt', fn: () => G.startGame('new', false) });
    if (info) items.push({ n: 'Continuer', sub: 'Rang d’aventure ' + info.ar + (info.play ? ' · ' + G.fmtT(info.play) : ''), fn: () => G.startGame('new', true) });
    items.push({ n: 'Voyageur confirmé', sub: 'Rang 60 · équipe niveau 90 (comme la capture)', fn: () => G.startGame('veteran', false) });
    return items;
  }
  function updateTitle(dt) {
    const I = G.input;
    const items = titleItems();
    if (I.anyEdge('ArrowDown', 'KeyS')) title.sel = (title.sel + 1) % items.length;
    if (I.anyEdge('ArrowUp', 'KeyW')) title.sel = (title.sel + items.length - 1) % items.length;
    if (I.anyEdge('Enter', 'Space', 'NumpadEnter')) { G.Audio.sfx('click'); items[title.sel].fn(); }
    G.Audio.setMusic('title');
  }

  function drawTitle(t) {
    const { w, h } = G.view;
    // ciel
    for (let y = 0; y < h; y += 2) px(ctx, 0, y, w, 2, G.mix('#4f9de6', '#cfe9ff', Math.pow(y / h, 0.8)));
    // nuages
    for (let i = 0; i < 6; i++) {
      const cx = ((i * 97 + t * 6 * (0.5 + (i % 3) * 0.3)) % (w + 120)) - 60, cy = 18 + (i * 37) % (h * 0.4);
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      for (const [dx, dy, rx, ry] of [[0, 0, 26, 6], [-14, -4, 14, 6], [12, -6, 16, 7], [26, 1, 14, 4]]) G.S.ell(ctx, Math.round(cx + dx), Math.round(cy + dy), rx, ry, 'rgba(255,255,255,0.92)');
    }
    // collines lointaines et Mondstadt
    const hz = Math.round(h * 0.58);
    for (let x = 0; x < w; x++) {
      const y1 = hz - 20 - Math.sin(x / 40) * 10 - Math.sin(x / 13 + 2) * 3;
      px(ctx, x, y1, 1, h - y1, '#7aa7c0');
    }
    // silhouette de la ville
    const cx0 = Math.round(w * 0.62);
    for (let i = 0; i < 14; i++) {
      const bx = cx0 - 50 + i * 7, bh = 8 + ((i * 7) % 11);
      px(ctx, bx, hz - 14 - bh, 6, bh + 6, '#8a9cc8'); px(ctx, bx - 1, hz - 16 - bh, 8, 3, '#c85a58');
    }
    px(ctx, cx0 - 4, hz - 52, 10, 40, '#b8c4e4'); px(ctx, cx0 - 5, hz - 56, 12, 5, '#4a68c0');
    // moulin
    px(ctx, cx0 - 60, hz - 36, 8, 22, '#d8d4c8'); px(ctx, cx0 - 61, hz - 40, 10, 5, '#c85a58');
    const a = t * 1.2; for (let k = 0; k < 4; k++) { const an = a + k * Math.PI / 2; for (let l = 3; l < 14; l++) px(ctx, cx0 - 56 + Math.cos(an) * l, hz - 32 + Math.sin(an) * l, 1, 1, '#f4ecd8'); }
    // plaines
    for (let x = 0; x < w; x++) {
      const y2 = hz - 4 - Math.sin(x / 30 + 1) * 8 - Math.sin(x / 9) * 2;
      px(ctx, x, y2, 1, h - y2, '#6fbf50');
    }
    for (let x = 0; x < w; x++) {
      const y3 = hz + 14 - Math.sin(x / 50 + 3) * 9;
      px(ctx, x, y3, 1, h - y3, '#5aae44');
      if ((x * 7) % 19 === 0) { px(ctx, x, y3 - 8, 3, 8, '#2f7a30'); px(ctx, x - 2, y3 - 12, 7, 6, '#3f9a3c'); }
    }
    // plateau de pierre
    const py = Math.round(h * 0.72);
    px(ctx, 0, py, w, h - py, '#c8c0a0');
    for (let x = 0; x < w; x += 22) for (let y = py + (x % 2) * 3; y < h; y += 13) { px(ctx, x + ((y / 13) % 2) * 9, y, 20, 1, '#9a9272'); px(ctx, x + ((y / 13) % 2) * 9, y, 1, 13, '#9a9272'); }
    px(ctx, 0, py, w, 2, '#e0d8bc');
    // statue (x2)
    const st = G.S.statue(true);
    ctx.drawImage(st, Math.round(w * 0.1), py - st.height * 2 + 38, st.width * 2, st.height * 2);
    // personnage de dos (x3)
    const kq = G.S.charFrame('keqing', 'u', 0);
    ctx.drawImage(kq, Math.round(w * 0.74), h - kq.height * 3 - 4, kq.width * 3, kq.height * 3);
    // séelie
    const sl = G.S.seelie(Math.floor(t * 3));
    ctx.drawImage(sl, Math.round(w * 0.2), Math.round(py - 190 + Math.sin(t * 2) * 5), sl.width * 2, sl.height * 2);
    // titre
    G.text(ctx, 'TEYVAT PIXEL', w / 2, 14, '#ffffff', { align: 'c', outline: '#1f3a6a', scale: 4 });
    G.text(ctx, 'Un fan-game en pixel-art inspiré de Genshin Impact', w / 2, 50, '#fff6c8', { align: 'c', outline: '#1f3a6a' });
    // menu
    const items = titleItems();
    const bw = 236, bh = 22;
    const y0 = Math.round(h * 0.5 - 4);
    const x0 = Math.round(w / 2 - bw / 2);
    items.forEach((it, i) => {
      const y = y0 + i * (bh + 4);
      const sel = title.sel === i;
      px(ctx, x0, y, bw, bh, sel ? 'rgba(244,239,224,0.96)' : 'rgba(18,24,44,0.82)');
      px(ctx, x0, y, bw, 1, '#d3bc8e'); px(ctx, x0, y + bh - 1, bw, 1, '#d3bc8e');
      G.text(ctx, it.n, w / 2, y + 4, sel ? '#3b4255' : '#ffffff', { align: 'c' });
      G.text(ctx, it.sub, w / 2, y + 13, sel ? '#7a6a48' : '#b8c0d8', { align: 'c' });
      G.UI.region(x0, y, bw, bh, { onClick: () => { title.sel = i; G.Audio.sfx('click'); it.fn(); } });
    });
    G.text(ctx, 'ZQSD / WASD · clic · E · Q · F · 1-4 — ou tactile', w / 2, h - 22, '#ffffff', { align: 'c', outline: '#1f3a6a' });
    G.text(ctx, 'Projet de fan non officiel — sans lien avec HoYoverse. Tous les graphismes sont générés par code.', w / 2, h - 11, '#e8f0ff', { align: 'c', outline: '#1f3a6a' });
  }

  function drawLoading() {
    const { w, h } = G.view;
    px(ctx, 0, 0, w, h, '#10182c');
    G.text(ctx, 'TEYVAT PIXEL', w / 2, h / 2 - 28, '#f4efe0', { align: 'c', scale: 3, outline: '#2a3a6a' });
    G.text(ctx, 'Génération du monde…', w / 2, h / 2 + 4, '#c8d0e0', { align: 'c' });
    px(ctx, w / 2 - 60, h / 2 + 18, 120, 5, '#2a3350'); px(ctx, w / 2 - 60, h / 2 + 18, Math.round(120 * loadProg), 5, '#c8f04a');
  }

  // ------------------------------------------------------------------
  //  Rendu
  // ------------------------------------------------------------------
  function drawWorld(t) {
    const { w, h } = G.view;
    const P = G.P, S = G.state;
    let sx = 0, sy = 0;
    if (G.shake > 0.3) { sx = Math.round((Math.random() - 0.5) * G.shake); sy = Math.round((Math.random() - 0.5) * G.shake); }
    const WW = G.World.W * TS, WH = G.World.H * TS;
    let camX = Math.round(G.cam.x - w / 2), camY = Math.round(G.cam.y - h / 2 - 6);
    camX = WW > w ? G.clamp(camX, 0, WW - w) : Math.round((WW - w) / 2);
    camY = WH > h ? G.clamp(camY, 0, WH - h) : Math.round((WH - h) / 2);
    camX += sx; camY += sy;
    G.World.drawGround(ctx, camX, camY, w, h, t);
    // ombres de nuages qui glissent sur le terrain
    if (G.nightness() < 0.7) {
      for (let i = 0; i < 7; i++) {
        const cx = ((i * 811 + t * 7) % (WW + 700)) - 350, cy = (i * 577) % WH + Math.sin(t * 0.05 + i) * 40;
        if (cx + 200 < camX || cx - 200 > camX + w || cy + 110 < camY || cy - 110 > camY + h) continue;
        ctx.fillStyle = 'rgba(24,48,72,0.10)';
        G.S.ell(ctx, Math.round(cx - camX), Math.round(cy - camY), 150, 64, 'rgba(24,48,72,0.10)');
        G.S.ell(ctx, Math.round(cx - camX + 70), Math.round(cy - camY - 28), 90, 40, 'rgba(24,48,72,0.08)');
      }
    }
    G.Combat.drawGround(ctx, camX, camY, t);
    G.Entities.drawGroundFx(ctx, camX, camY, t);
    const list = G.Entities.buildDrawList(camX, camY, w, h, t);
    // objets plats (cours des séelies) d'abord
    G.Entities.drawList(ctx, list, camX, camY, t);
    G.Combat.drawTop(ctx, camX, camY, t);
    // énergie
    for (const p of G.E.pickups) if (p.kind === 'energy') {
      const el = G.EL[p.el] || G.EL.phys;
      const x = Math.round(p.x - camX), y = Math.round(p.y - camY - p.z * 0.3);
      px(ctx, x - 2, y - 2, 5, 5, el.dark); px(ctx, x - 1, y - 1, 3, 3, el.color); px(ctx, x - 1, y - 1, 1, 1, '#ffffff');
    }
    G.UI.drawStamina(ctx, camX, camY);
    G.Combat.drawTexts(ctx, camX, camY);
    // jour / nuit
    const n = G.nightness();
    if (n > 0.02) {
      ctx.globalCompositeOperation = 'multiply';
      const dusk = n < 0.9 && n > 0.02 ? 1 - Math.abs(n - 0.4) * 1.6 : 0;
      ctx.fillStyle = G.mix(G.mix('#ffffff', '#ffd2a8', Math.max(0, dusk) * 0.6), '#5b6ca8', Math.min(1, n * 1.05));
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      if (n > 0.3) {
        for (const o of G.World.objsIn(camX - 40, camY - 40, camX + w + 40, camY + h + 40)) {
          if (!o.light) continue;
          ctx.globalAlpha = 0.28 * n;
          ctx.fillStyle = '#ff9a3a'; G.S.ell(ctx, Math.round(o.x - camX), Math.round(o.y - camY - 10), o.light * 0.6, o.light * 0.45, '#ff9a3a');
          ctx.globalAlpha = 0.22 * n;
          G.S.ell(ctx, Math.round(o.x - camX), Math.round(o.y - camY - 10), o.light * 0.3, o.light * 0.22, '#ffd89a');
        }
        ctx.globalAlpha = 1;
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // vue élémentaire : voile
    if (G.sight > 0) { ctx.globalAlpha = 0.12 + 0.05 * Math.sin(t * 6); px(ctx, 0, 0, w, h, '#7af0c4'); ctx.globalAlpha = 1; }
    // dégâts reçus : vignette
    if (P.hurtT > 0) { ctx.globalAlpha = P.hurtT * 0.9; px(ctx, 0, 0, w, 3, '#ff3a3a'); px(ctx, 0, h - 3, w, 3, '#ff3a3a'); px(ctx, 0, 0, 3, h, '#ff3a3a'); px(ctx, w - 3, 0, 3, h, '#ff3a3a'); ctx.globalAlpha = 1; }
  }

  function draw(t) {
    const { w, h } = G.view;
    ctx.imageSmoothingEnabled = false;
    G.UI.begin();
    if (G.mode === 'title') { drawTitle(t); }
    else if (G.state) {
      drawWorld(t);
      if (G.mode === 'play' || G.mode === 'dead' || G.dialog) G.UI.drawHUD(ctx, w, h, t);
      if (G.cutin) G.UI.drawCutin(ctx, w, h, t);
      if (G.mode === 'menu') G.Menus.draw(ctx, w, h, t);
      else if (G.mode === 'dead') G.Menus.defs.dead.draw(ctx, w, h, t);
      if (G.dialog) G.UI.drawDialog(ctx, w, h, t);
      // astuce portrait
      G.UI.drawFade(ctx, w, h);
    }
    // invite de rotation
    if (w < h * 1.2) {
      px(ctx, 0, 0, w, h, '#10182c');
      G.text(ctx, 'Tournez votre appareil', w / 2, h / 2 - 6, '#ffffff', { align: 'c', scale: 2 });
      G.text(ctx, 'en mode paysage', w / 2, h / 2 + 14, '#c8d0e0', { align: 'c' });
    }
  }

  document.addEventListener('visibilitychange', () => { if (document.hidden && G.state && G.mode !== 'title' && G.mode !== 'loading') G.Save.save(); });
  window.addEventListener('DOMContentLoaded', boot);
})();
