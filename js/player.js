/* Teyvat Pixel — contrôleur du joueur : déplacement, endurance, nage, attaques, interactions */
(function () {
  const G = window.G;
  const TS = G.TS;
  const E = G.E;
  const World = G.World;
  const P = (G.P = {});
  const Player = (G.Player = {});

  Player.reset = function (x, y) {
    Object.assign(P, {
      x, y, dir: 'd', ang: Math.PI / 2, kx: 0, ky: 0, lungeV: 0, lunge: 0,
      anim: 0, walkT: 0, moving: false, sprinting: false, sprintHold: 0, swim: false,
      atkT: 0, atkDur: 0, atkHit: true, comboIdx: 0, comboT: 0, queued: false, mult: 1, atkW: 'sword',
      castT: 0, dashT: 0, dashX: 0, dashY: 0, z: 0, vz: 0, hurtT: 0, inv: 0, swapCd: 0,
      shield: null, infuse: null, buff: null, stiletto: null, dead: false, deadT: 0, stDelay: 0, drown: 0,
      interact: null, region: '', regionT: 0, footT: 0,
    });
  };

  const W_SPEED = 56, S_SPEED = 92, SWIM_SPEED = 34;

  // ---------------------------------------------------------------
  // Interactions possibles autour du joueur
  // ---------------------------------------------------------------
  Player.findInteract = function () {
    const S = G.state;
    let best = null, bd = 1e9;
    const cand = (d, o) => { if (d < bd) { bd = d; best = o; } };
    for (const n of E.npcs) { const d = Math.hypot(n.x - P.x, n.y - P.y); if (d < 26) cand(d - 4, { kind: 'npc', ref: n, label: 'Parler', name: n.name }); }
    for (const c of World.chests) {
      if (S.opened[c.id]) continue;
      const d = Math.hypot(c.x - P.x, c.y - P.y);
      if (d < 20) cand(d, { kind: 'chest', ref: c, label: c.locked && !S.camps[c.locked + '_clear'] ? 'Verrouillé' : 'Ouvrir', name: ['Coffre commun', 'Coffre luxueux', 'Coffre précieux', 'Coffre somptueux'][c.tier], locked: c.locked && !S.camps[c.locked + '_clear'] });
    }
    for (const c of World.collectibles) {
      if (c.kind === 'anemo' || (S.taken[c.id] && S.taken[c.id] > S.t)) continue;
      const d = Math.hypot(c.x - P.x, c.y - P.y);
      if (d < 18) cand(d, { kind: 'collect', ref: c, label: 'Cueillir', name: G.ITEMS[c.item].name });
    }
    for (const st of World.statues) { const d = Math.hypot(st.x - P.x, st.y - P.y); if (d < 34) cand(d, { kind: 'statue', ref: st, label: 'Prier', name: 'Statue des Sept' }); }
    for (const w of World.waypoints) { const d = Math.hypot(w.x - P.x, w.y - P.y); if (d < 26 && w.unlocked) cand(d, { kind: 'waypoint', ref: w, label: 'Téléporteur', name: w.name }); }
    const dm = World.pois.domain;
    if (dm) { const d = Math.hypot(dm.x - P.x, dm.y - P.y); if (d < 44) cand(d, { kind: 'domain', ref: dm, label: 'Entrer', name: dm.name }); }
    if (G.Domain && G.Domain.active) { const ex = G.Domain.exit; const d = Math.hypot(ex.x - P.x, ex.y - P.y); if (d < 30) cand(d, { kind: 'exit', ref: ex, label: 'Quitter le domaine', name: 'Sortie' }); }
    return best;
  };

  Player.interactNow = function () {
    const it = P.interact;
    if (!it) return;
    const S = G.state;
    if (G.Audio) G.Audio.sfx('click');
    if (it.kind === 'npc') G.Story.talk(it.ref);
    else if (it.kind === 'chest') {
      if (it.locked) { G.toast('Éliminez les ennemis du campement pour déverrouiller.'); return; }
      G.Entities.openChest(it.ref);
    } else if (it.kind === 'collect') {
      const c = it.ref;
      S.taken[c.id] = S.t + 600;
      const n = c.item === 'flower' ? G.irand(1, 3) : G.irand(1, 2);
      G.gain(c.item, n);
      S.stats.flowers++;
      G.Combat.spark(c.x, c.y - 4, '#ffffff', 8, 40);
      if (G.Audio) G.Audio.sfx('pickup');
      if (G.Quest) G.Quest.event('collect', { id: c.item, n });
    } else if (it.kind === 'statue') G.Story.statue(it.ref);
    else if (it.kind === 'waypoint') G.Menus.open('map', { tp: true, from: it.ref });
    else if (it.kind === 'domain') G.Domain.enter();
    else if (it.kind === 'exit') G.Domain.leave();
  };

  // ---------------------------------------------------------------
  // Mise à jour
  // ---------------------------------------------------------------
  Player.update = function (dt) {
    const S = G.state, I = G.input;
    const cs = G.cs();
    const d = G.CHARS[cs.id];
    P.anim += dt;
    P.swapCd = Math.max(0, P.swapCd - dt);
    P.inv = Math.max(0, P.inv - dt);
    P.hurtT = Math.max(0, P.hurtT - dt);
    P.comboT = Math.max(0, P.comboT - dt);
    P.castT = Math.max(0, P.castT - dt);
    if (P.dead) { P.deadT += dt; return; }

    I.updateAxis();
    let mx = I.axis.x, my = I.axis.y;
    const moving = Math.hypot(mx, my) > 0.1;

    // --- eau ---
    const wasSwim = P.swim;
    const tt = World.tileAt(Math.floor(P.x / TS), Math.floor((P.y - 1) / TS));
    P.swim = (tt === G.S.T.WATER || tt === G.S.T.DEEP) && P.z < 2;
    if (P.swim && !wasSwim) { G.Combat.ring(P.x, P.y, 14, '#e2f6ff', 0.4, 3); if (G.Audio) G.Audio.sfx('splash'); }

    // --- actions ---
    const act = (name, ...codes) => I.take(name) || I.anyEdge(...codes);
    if (act('swap0', 'Digit1', 'Numpad1')) G.Combat.switchTo(0);
    if (act('swap1', 'Digit2', 'Numpad2')) G.Combat.switchTo(1);
    if (act('swap2', 'Digit3', 'Numpad3')) G.Combat.switchTo(2);
    if (act('swap3', 'Digit4', 'Numpad4')) G.Combat.switchTo(3);
    if (act('skill', 'KeyE')) G.Combat.useSkill();
    if (act('burst', 'KeyQ')) G.Combat.useBurst();
    if (act('jump', 'Space') && P.z === 0 && !P.swim && P.atkT <= 0) { P.vz = 130; P.z = 0.01; if (G.Audio) G.Audio.sfx('jump'); }
    if (act('sprint', 'ShiftLeft', 'ShiftRight')) {
      P.sprintHold = 0;
      if (P.dashT <= 0 && !P.swim && P.atkT <= 0.12 && S.stamina >= 18 && P.castT <= 0) {
        const dx = moving ? mx : Math.cos(P.ang), dy = moving ? my : Math.sin(P.ang);
        const l = Math.hypot(dx, dy) || 1;
        P.dashX = dx / l; P.dashY = dy / l; P.dashT = 0.2; P.inv = Math.max(P.inv, 0.28);
        S.stamina -= 18; P.stDelay = 0.8;
        G.Combat.spark(P.x, P.y - 4, '#ffffff', 5, 40);
        if (G.Audio) G.Audio.sfx('dash');
      }
    }
    if (I.isHeld('attack') || I.take('attack')) G.Combat.attack();
    if (P.queued && P.atkT <= 0) { P.queued = false; G.Combat.attack(); }
    if (act('interact', 'KeyF') && P.interact) Player.interactNow();
    if (I.take('gadget') || I.anyEdge('KeyT')) Player.quickHeal();

    // --- attaque en cours ---
    if (P.atkT > 0) {
      P.atkT -= dt;
      if (!P.atkHit && P.atkT <= P.atkDur * 0.55) { P.atkHit = true; G.Combat.strike(); }
    }

    // --- mouvement ---
    let speed = W_SPEED;
    P.sprinting = false;
    if (I.isHeld('sprint') && moving && S.stamina > 0 && !P.swim && P.atkT <= 0) {
      P.sprintHold += dt;
      if (P.sprintHold > 0.22) { speed = S_SPEED; P.sprinting = true; S.stamina = Math.max(0, S.stamina - 14 * dt); P.stDelay = 0.8; }
    } else P.sprintHold = 0;
    if (P.swim) { speed = SWIM_SPEED; S.stamina = Math.max(0, S.stamina - 9 * dt); P.stDelay = 1; }
    if (P.atkT > 0 || P.castT > 0) speed *= 0.3;
    if (P.hurtT > 0.2) speed *= 0.4;
    P.moving = moving;
    if (moving) {
      if (P.atkT <= 0) { P.ang = Math.atan2(my, mx); P.dir = G.dirOf(P.ang); }
      World.move(P, mx * speed * dt, my * speed * dt, 4, 4);
      P.walkT += dt * (P.sprinting ? 9 : 6.5);
    } else P.walkT = 0;
    if (P.dashT > 0) {
      P.dashT -= dt;
      World.move(P, P.dashX * 170 * dt, P.dashY * 170 * dt, 4, 4);
    }
    if (P.lungeV > 0) { P.lungeV -= 600 * dt; World.move(P, Math.cos(P.ang) * P.lungeV * dt, Math.sin(P.ang) * P.lungeV * dt, 4, 4); }
    if (P.kx || P.ky) {
      World.move(P, P.kx * dt, P.ky * dt, 4, 4);
      const f = Math.pow(0.02, dt);
      P.kx *= f; P.ky *= f; if (Math.abs(P.kx) < 2) P.kx = 0; if (Math.abs(P.ky) < 2) P.ky = 0;
    }
    // saut
    if (P.z > 0) { P.vz -= 520 * dt; P.z += P.vz * dt; if (P.z <= 0) { P.z = 0; P.vz = 0; } }

    // --- endurance ---
    if (P.stDelay > 0) P.stDelay -= dt;
    else if (!P.swim) S.stamina = Math.min(S.staminaMax, S.stamina + 30 * dt);
    // noyade
    if (P.swim && S.stamina <= 0) {
      P.drown += dt;
      if (P.drown > 0.5) { P.drown = 0; G.Combat.hurtPlayer(G.charStats(cs).hp * 0.1, 'hydro', P.x, P.y, { knock: 0 }); P.inv = 0; }
    } else P.drown = 0;

    // --- énergie naturelle et régénération passive hors combat (très lente) ---
    // --- région ---
    P.regionT -= dt;
    if (P.regionT <= 0) {
      P.regionT = 0.5;
      const r = World.region(P.x, P.y);
      if (r && r !== P.region) {
        const first = !P.region;
        P.region = r;
        if (!first) G.banner(r, '', 'zone');
        if (G.Quest) G.Quest.event('region', { name: r });
      }
      // débloquer les téléporteurs proches
      for (const w of World.waypoints) {
        if (!w.unlocked && Math.hypot(w.x - P.x, w.y - P.y) < 40) {
          w.unlocked = true; S.unlocked[w.id] = true;
          G.banner('Téléporteur débloqué', w.name, 'unlock');
          G.addArExp(40);
          if (G.Audio) G.Audio.sfx('unlock');
          if (G.Quest) G.Quest.event('waypoint', { id: w.id });
        }
      }
      // marque des statues visitées
      for (const st of World.statues) if (!S.statues[st.id] && Math.hypot(st.x - P.x, st.y - P.y) < 50) { S.statues[st.id] = { lvl: 1, off: 0 }; G.banner('Statue des Sept', 'Offrez des Anémoculi pour des récompenses', 'unlock'); }
    }
    P.interact = G.mode === 'play' ? Player.findInteract() : null;
    S.pos.x = P.x; S.pos.y = P.y;
  };

  // Nourriture rapide (gadget)
  Player.quickHeal = function () {
    const S = G.state;
    const cs = G.cs();
    const pick = ['apple', 'bread', 'meal'].find((id) => (S.inv[id] || 0) > 0);
    if (!pick) { G.toast('Aucun aliment dans le sac.'); return; }
    if (cs.hp >= G.charStats(cs).hp) { G.toast('PV déjà au maximum.'); return; }
    G.useFood(pick, cs);
  };
  G.useFood = function (id, cs) {
    const S = G.state;
    if ((S.inv[id] || 0) <= 0) return;
    const it = G.ITEMS[id];
    S.inv[id]--;
    const real = G.healChar(cs, G.charStats(cs).hp * it.heal);
    if (cs === G.cs()) G.Combat.text(P.x, P.y - 34, '+' + Math.round(real), '#8dff9a', false, 0.9);
    G.Combat.spark(P.x, P.y - 14, '#8dff9a', 8, 40);
    if (G.Audio) G.Audio.sfx('pickup');
  };

  // ---------------------------------------------------------------
  // Dessin
  // ---------------------------------------------------------------
  Player.draw = function (ctx, camX, camY, t) {
    const cs = G.cs();
    const id = cs.id;
    const wpn = P.atkT > 0 || (P.castT > 0.1) ? G.CHARS[id].weapon : null;
    const WK = P.infuse && P.infuse.melee && P.atkT > 0 ? 'sword' : wpn;
    let frame = 0;
    if (P.moving && P.atkT <= 0) { const k = Math.floor(P.walkT) % 4; frame = k === 0 ? 1 : k === 2 ? 2 : 0; }
    let spr = G.S.charFrame(id, P.dir, frame, WK ? { weapon: WK } : null);
    const x = Math.round(P.x - camX), y = Math.round(P.y - camY);
    // ombre
    if (!P.swim) { ctx.fillStyle = 'rgba(30,40,60,0.3)'; G.Combat.S_ell(ctx, x, y - 1, 6, 2); }
    let off = 0;
    if (P.atkT > 0) off = 0;
    if (P.z > 0) off = -Math.round(P.z);
    // images rémanentes du dash
    if (P.dashT > 0) {
      for (let i = 1; i <= 3; i++) {
        ctx.globalAlpha = 0.18 * (4 - i);
        ctx.drawImage(spr, Math.round(x - 13 - P.dashX * i * 8), Math.round(y - 29 - P.dashY * i * 6 + off));
      }
      ctx.globalAlpha = 1;
    }
    if (P.inv > 0 && !P.dashT && Math.floor(P.anim * 30) % 2 === 0 && P.hurtT <= 0) ctx.globalAlpha = 0.6;
    if (P.swim) {
      const h = 19;
      ctx.drawImage(spr, 0, 0, spr.width, h + 1, x - 13, y - 29 + 8, spr.width, h + 1);
      ctx.globalAlpha = 0.8;
      const r = 8 + Math.sin(P.anim * 6) * 1.2;
      G.Combat.pxRing(ctx, x, y - 2, r, r * 0.45, '#e2f6ff');
      G.Combat.pxRing(ctx, x, y - 2, r + 4, (r + 4) * 0.45, 'rgba(226,246,255,0.6)');
    } else {
      ctx.drawImage(spr, x - 13, y - 29 + off);
      if (P.hurtT > 0) { ctx.globalAlpha = 0.55; ctx.drawImage(G.tint(spr, '#ffffff'), x - 13, y - 29 + off); }
    }
    ctx.globalAlpha = 1;
    // aura d'infusion
    if (P.infuse && P.infuse.t > 0) {
      const col = G.EL[P.infuse.el];
      const a = P.anim * 4;
      for (let i = 0; i < 3; i++) ctx.fillStyle = col.color, ctx.fillRect(x + Math.round(Math.cos(a + i * 2.1) * 8) - 1, y - 14 + Math.round(Math.sin(a + i * 2.1) * 6), 2, 2);
    }
  };
})();
