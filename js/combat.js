/* Teyvat Pixel — combat : dégâts, éléments & réactions, compétences, projectiles, zones, familiers */
(function () {
  const G = window.G;
  const E = (G.E = { enemies: [], npcs: [], proj: [], zones: [], summons: [], fx: [], texts: [], pickups: [], ambient: [] });
  const C = (G.Combat = {});
  const TS = G.TS;
  const AUR = ['pyro', 'hydro', 'cryo', 'electro'];

  const levelBase = (L) => 1446 * G.sLevel(L) + 12;

  C.reset = function () {
    for (const k of Object.keys(E)) E[k].length = 0;
  };

  // ------------------------------------------------------------------
  //  Textes flottants & effets
  // ------------------------------------------------------------------
  C.text = function (x, y, text, color, big, life) {
    E.texts.push({ x: x + G.rand(-6, 6), y, vy: -26, text: String(text), color, big: !!big, t: 0, life: life || 0.9 });
  };
  C.fx = function (o) { o.t = 0; E.fx.push(o); return o; };
  C.ring = (x, y, r, color, dur, r0) => C.fx({ type: 'ring', x, y, r, r0: r0 || 2, color, life: dur || 0.35 });
  C.slash = (x, y, ang, r, arc, color, life) => C.fx({ type: 'slash', x, y, ang, r, arc, color, life: life || 0.18 });
  C.bolt = (x0, y0, x1, y1, color, life) => C.fx({ type: 'bolt', x0, y0, x1, y1, color, life: life || 0.18, seed: Math.random() * 99 });
  C.spark = function (x, y, color, n, spd) {
    for (let i = 0; i < (n || 6); i++) {
      const a = Math.random() * 6.283, s = G.rand(spd ? spd * 0.4 : 20, spd || 60);
      E.fx.push({ type: 'dot', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 10, color, life: G.rand(0.25, 0.5), t: 0, sz: Math.random() < 0.3 ? 2 : 1, g: 80 });
    }
  };
  C.energyOrbs = function (x, y, el, n) {
    for (let i = 0; i < n; i++) E.pickups.push({ kind: 'energy', el, x: x + G.rand(-6, 6), y: y + G.rand(-4, 4), z: 6, vx: G.rand(-30, 30), vy: G.rand(-30, 10), t: 0, life: 9, amount: 2 });
  };

  // ------------------------------------------------------------------
  //  Cibles
  // ------------------------------------------------------------------
  C.nearest = function (x, y, range, filter) {
    let best = null, bd = range;
    for (const e of E.enemies) {
      if (e.dead || (filter && !filter(e))) continue;
      const d = Math.hypot(e.x - x, e.y - y) - e.r;
      if (d < bd) { bd = d; best = e; }
    }
    return best;
  };
  C.inRadius = function (x, y, r) {
    return E.enemies.filter((e) => !e.dead && Math.hypot(e.x - x, e.y - y) <= r + e.r);
  };

  // ------------------------------------------------------------------
  //  Éléments & réactions
  // ------------------------------------------------------------------
  function consume(a, k, amt) { a[k] = Math.max(0, a[k] - amt); }

  function reactionText(e, key) {
    const r = G.REACT[key];
    C.text(e.x, e.y - e.r - 18, r.fr, r.color, true, 1.1);
    G.state.stats.reactions++;
    if (G.Quest) G.Quest.event('reaction', { key });
    if (G.Audio) G.Audio.sfx('react');
  }

  // Dégâts fixes (réactions) sur un ennemi
  C.flat = function (e, el, mult, cs, opts) {
    opts = opts || {};
    const L = cs ? cs.level : 60;
    const base = levelBase(L) * mult * (1 + (cs ? G.charStats(cs).em / 1000 : 0));
    const dmg = Math.max(1, Math.round(base * (0.95 + Math.random() * 0.1) * (e.vuln ? e.vuln.mult : 1)));
    e.takeHit(dmg, el, { noFlash: opts.noFlash, kx: opts.kx || 0, ky: opts.ky || 0, noStagger: true });
    C.text(e.x + 6, e.y - e.r - 6, dmg, G.EL[el].color, false, 0.8);
    return dmg;
  };

  C.applyEl = function (e, el, gu, src) {
    const a = e.aura;
    const res = { mult: 1, react: null };
    // temps de recharge d'application (ICD)
    const tag = src.tag || 'x';
    const icd = e.icd[tag] || (e.icd[tag] = { t: 0, n: 0 });
    if (icd.t > 0 && icd.n < 2) { icd.n++; return res; }
    icd.t = 2.5; icd.n = 0;
    const cs = src.cs;
    const flat = (k, m, o) => C.flat(e, k, m, cs, o);

    if (el === 'anemo') {
      const present = AUR.filter((k) => a[k] > 0.05);
      if (!present.length) return res;
      const k = present.reduce((m, q) => (a[q] > a[m] ? q : m), present[0]);
      consume(a, k, gu * 0.6 + 0.4);
      for (const o of E.enemies) {
        if (o === e || o.dead || Math.hypot(o.x - e.x, o.y - e.y) > 46) continue;
        C.flatAndApply(o, k, 0.6, cs, 0.8);
      }
      C.ring(e.x, e.y, 46, G.EL[k].color, 0.3);
      C.flatAndApply(e, k, 0.6, cs, 0.8);
      reactionText(e, 'swirl');
      res.react = 'swirl';
      e.react = 4;
      return res;
    }
    if (!AUR.includes(el)) return res;
    const has = (k) => a[k] > 0.05;
    const set = () => { a[el] = Math.max(a[el], gu * 0.8); };
    if (el === 'pyro') {
      if (has('hydro')) { res.mult = 1.5; consume(a, 'hydro', gu * 0.6 + 0.2); res.react = 'vaporize'; }
      else if (has('cryo')) { res.mult = 2; consume(a, 'cryo', gu * 0.8 + 0.2); res.react = 'melt'; }
      else if (has('electro')) { consume(a, 'electro', gu * 0.7 + 0.2); res.react = 'overload'; }
      else set();
    } else if (el === 'hydro') {
      if (has('pyro')) { res.mult = 2; consume(a, 'pyro', gu * 0.6 + 0.2); res.react = 'vaporize'; }
      else if (has('electro')) { consume(a, 'electro', gu * 0.3); a.hydro = Math.max(a.hydro, gu * 0.8); res.react = 'electrocharged'; }
      else if (has('cryo')) { consume(a, 'cryo', gu * 0.8 + 0.2); res.react = 'frozen'; }
      else set();
    } else if (el === 'cryo') {
      if (has('pyro')) { res.mult = 1.5; consume(a, 'pyro', gu * 0.6 + 0.2); res.react = 'melt'; }
      else if (has('hydro')) { consume(a, 'hydro', gu * 0.8 + 0.2); res.react = 'frozen'; }
      else if (has('electro')) { consume(a, 'electro', gu * 0.7 + 0.2); res.react = 'superconduct'; }
      else set();
    } else if (el === 'electro') {
      if (has('pyro')) { consume(a, 'pyro', gu * 0.7 + 0.2); res.react = 'overload'; }
      else if (has('hydro')) { consume(a, 'hydro', gu * 0.3); a.electro = Math.max(a.electro, gu * 0.8); res.react = 'electrocharged'; }
      else if (has('cryo')) { consume(a, 'cryo', gu * 0.7 + 0.2); res.react = 'superconduct'; }
      else set();
    }
    if (res.react) {
      e.react = 4;
      reactionText(e, res.react);
      if (res.react === 'overload') {
        C.ring(e.x, e.y, 34, '#ff6a8a', 0.3); C.spark(e.x, e.y, '#ff9a5a', 12, 90);
        for (const o of C.inRadius(e.x, e.y, 30)) {
          const d = Math.hypot(o.x - e.x, o.y - e.y) || 1;
          C.flat(o, 'pyro', 2.0, cs, { kx: ((o.x - e.x) / d) * 150, ky: ((o.y - e.y) / d) * 150 });
        }
        if (G.Audio) G.Audio.sfx('boom');
      } else if (res.react === 'electrocharged') {
        e.ec = { t: 4, tick: 0.3, cs };
      } else if (res.react === 'frozen') {
        if (!e.boss) { e.frozen = 2.2 + gu * 0.8; e.frozenBy = cs; }
        C.spark(e.x, e.y, '#cdf6ff', 10, 60);
      } else if (res.react === 'superconduct') {
        C.ring(e.x, e.y, 30, '#b8e8ff', 0.3);
        for (const o of C.inRadius(e.x, e.y, 30)) { C.flat(o, 'cryo', 0.5, cs); o.vuln = { mult: 1.15, t: 10 }; }
      }
    }
    return res;
  };
  // Dégâts fixes + application d'aura (tourbillon)
  C.flatAndApply = function (e, el, mult, cs, gu) {
    C.flat(e, el, mult, cs);
    if (AUR.includes(el)) e.aura[el] = Math.max(e.aura[el], (gu || 0.8) * 0.8);
  };

  // ------------------------------------------------------------------
  //  Résolution des dégâts du joueur
  // ------------------------------------------------------------------
  // src : { cs, mult, el, gu, tag, kind:'normal'|'skill'|'burst', kx, ky, heavy, noStagger }
  C.hit = function (e, src) {
    if (e.dead) return 0;
    const cs = src.cs, st = G.charStats(cs), P = G.P;
    let el = src.el || 'phys';
    if (src.kind === 'normal' && el === 'phys' && P.infuse && P.infuse.t > 0) el = P.infuse.el;
    let react = { mult: 1, react: null };
    const gu = src.gu == null ? (src.kind === 'normal' ? 1 : 2) : src.gu;
    if (AUR.includes(el) || el === 'anemo') react = C.applyEl(e, el, gu, Object.assign({}, src, { el }));
    let dmg = st.atk * src.mult;
    let bonus = 1 + (el !== 'phys' ? st.elb : 0) + (P.buff && P.buff.t > 0 ? P.buff.atk : 0);
    if (src.kind === 'normal' && cs.id === 'tartaglia' && P.infuse && P.infuse.t > 0) bonus += 0.15;
    const crit = Math.random() < st.cr;
    dmg *= bonus * (crit ? 1 + st.cd : 1) * react.mult * (e.vuln ? e.vuln.mult : 1) * (0.95 + Math.random() * 0.1);
    // gelé : brisure
    if (e.frozen > 0 && src.heavy && el === 'phys') {
      e.frozen = 0; dmg *= 1.4; reactionText(e, 'shatter'); C.spark(e.x, e.y, '#dff8ff', 14, 100);
    }
    // gardes (mitachurl) et boucliers (mages)
    const gm = e.guardMult ? e.guardMult(src, el) : 1;
    dmg *= gm;
    dmg *= el === 'phys' ? 1 : 0.9;
    dmg = Math.max(1, Math.round(dmg));
    const kb = src.noStagger ? 0 : (src.kind === 'burst' ? 70 : src.kind === 'skill' ? 50 : src.heavy ? 50 : 22);
    const dx = e.x - P.x, dy = e.y - P.y, dl = Math.hypot(dx, dy) || 1;
    e.takeHit(dmg, el, { kx: src.kx != null ? src.kx : (dx / dl) * kb, ky: src.ky != null ? src.ky : (dy / dl) * kb, crit });
    const col = gm < 0.5 ? '#aab0c0' : (G.EL[el] || G.EL.phys).color;
    C.text(e.x, e.y - e.r - 8, dmg, col, crit, crit ? 1.1 : 0.9);
    if (src.kind === 'normal') { cs.energy = Math.min(G.CHARS[cs.id].burst.cost, cs.energy + 0.6); if (G.Audio) G.Audio.sfx('hit'); }
    if (src.kind !== 'normal') G.hitstop = Math.max(G.hitstop || 0, 0.04);
    if (src.particles) C.energyOrbs(e.x, e.y - 4, G.CHARS[cs.id].el, src.particles);
    return dmg;
  };

  // Frappe de zone : applique `hit` à tous les ennemis dans un disque
  C.aoe = function (x, y, r, src, maxHits) {
    let n = 0;
    for (const e of C.inRadius(x, y, r)) { C.hit(e, src); if (++n >= (maxHits || 99)) break; }
    return n;
  };
  C.cone = function (x, y, ang, r, arc, src) {
    let n = 0;
    for (const e of E.enemies) {
      if (e.dead) continue;
      const d = Math.hypot(e.x - x, e.y - y);
      if (d > r + e.r) continue;
      const a = Math.atan2(e.y - y, e.x - x);
      if (Math.abs(G.angDiff(ang, a)) <= arc / 2 + e.r / Math.max(8, d) || d < 8) { C.hit(e, src); n++; }
    }
    return n;
  };

  // ------------------------------------------------------------------
  //  Dégâts subis par le joueur
  // ------------------------------------------------------------------
  C.hurtPlayer = function (dmg, el, ex, ey, o) {
    o = o || {};
    const S = G.state, P = G.P;
    if (P.dead || P.inv > 0 || G.freeze > 0) return false;
    if (P.z > 3 && o.ground) return false;
    const cs = G.cs();
    if (cs.hp <= 0) return false;
    dmg = Math.max(1, Math.round(dmg * (0.92 + Math.random() * 0.16)));
    if (P.shield && P.shield.t > 0 && P.shield.hp > 0) {
      const mult = P.shield.el === el ? 2.5 : 1;
      const abs = Math.min(P.shield.hp, dmg / mult * 1);
      const real = abs * mult;
      P.shield.hp -= abs; dmg -= Math.round(real);
      C.text(P.x, P.y - 30, 'Bouclier', '#cdf6ff', false, 0.6);
      C.spark(P.x, P.y - 12, '#8fe8ff', 6, 60);
      if (dmg <= 0) { P.inv = 0.25; return true; }
    }
    cs.hp = Math.max(0, cs.hp - dmg);
    P.hurtT = 0.3; P.inv = 0.55;
    G.shake = Math.max(G.shake || 0, 3);
    const dx = P.x - ex, dy = P.y - ey, dl = Math.hypot(dx, dy) || 1;
    P.kx = (dx / dl) * (o.knock || 70); P.ky = (dy / dl) * (o.knock || 70);
    C.text(P.x, P.y - 30, dmg, '#ff7a7a', false, 0.8);
    if (G.Audio) G.Audio.sfx('hurt');
    if (cs.hp <= 0) C.onDown();
    return true;
  };
  C.onDown = function () {
    const S = G.state, P = G.P;
    const cs = G.cs();
    G.banner(G.CHARS[cs.id].name + ' est hors de combat', '', 'down');
    // trouver un allié vivant
    for (let k = 1; k <= S.party.length; k++) {
      const i = (S.active + k) % S.party.length;
      if (S.chars[S.party[i]].hp > 0) { C.switchTo(i, true); return; }
    }
    P.dead = true; P.deadT = 0;
    G.mode = 'dead';
  };

  C.heal = function (amt, cs) {
    cs = cs || G.cs();
    const real = G.healChar(cs, amt);
    if (real > 0) C.text(G.P.x, G.P.y - 34, '+' + Math.round(real), '#8dff9a', false, 0.9);
    return real;
  };

  // ------------------------------------------------------------------
  //  Changement de personnage
  // ------------------------------------------------------------------
  C.switchTo = function (i, force) {
    const S = G.state, P = G.P;
    if (i === S.active || i < 0 || i >= S.party.length) return false;
    const cs = S.chars[S.party[i]];
    if (!cs || (cs.hp <= 0 && !force)) return false;
    if (P.swapCd > 0 && !force) return false;
    P.swapCd = 1;
    S.active = i;
    P.atkT = 0; P.comboIdx = 0; P.infuse = null; P.shield = null; P.stiletto = null; P.castT = 0;
    P.buff = null;
    C.fx({ type: 'ring', x: P.x, y: P.y, r: 22, r0: 4, color: G.EL[G.CHARS[cs.id].el].color, life: 0.35 });
    C.spark(P.x, P.y - 12, G.EL[G.CHARS[cs.id].el].light, 10, 70);
    if (G.Audio) G.Audio.sfx('swap');
    return true;
  };

  // ------------------------------------------------------------------
  //  Attaques normales
  // ------------------------------------------------------------------
  C.autoFace = function (range) {
    const P = G.P;
    const t = C.nearest(P.x, P.y, range || 70);
    if (t) { P.ang = Math.atan2(t.y - P.y, t.x - P.x); P.dir = G.dirOf(P.ang); }
    return t;
  };
  G.dirOf = (a) => { const c = Math.cos(a), s = Math.sin(a); return Math.abs(c) > Math.abs(s) ? (c < 0 ? 'l' : 'r') : (s < 0 ? 'u' : 'd'); };

  C.attack = function () {
    const S = G.state, P = G.P, cs = G.cs(), d = G.CHARS[cs.id];
    if (P.atkT > 0 || P.castT > 0 || P.dashT > 0 || P.swim || P.dead) { P.queued = true; return; }
    let w = G.WEAPONS[d.weapon];
    const infusedMelee = P.infuse && P.infuse.t > 0 && P.infuse.melee;
    if (infusedMelee) w = { kind: 'melee', chain: [0.55, 0.55, 0.7, 0.5, 0.9, 1.2], spd: 0.32, reach: 24, arc: 2.4, lunge: 3 };
    const t = C.autoFace(w.kind === 'shot' ? 140 : 52);
    P.comboT > 0 ? (P.comboIdx = (P.comboIdx + 1) % w.chain.length) : (P.comboIdx = 0);
    P.comboT = w.spd + 0.45;
    P.atkT = w.spd; P.atkDur = w.spd; P.atkHit = false;
    P.atkW = infusedMelee ? 'sword' : d.weapon;
    P.mult = w.chain[P.comboIdx] * (infusedMelee && P.infuse.mult ? 1 : 1);
    P.queued = false;
    if (w.lunge) { P.lunge = w.lunge * 14; }
    if (G.Audio) G.Audio.sfx(w.kind === 'shot' ? 'shot' : 'swing');
  };

  function strike() {
    const P = G.P, cs = G.cs(), d = G.CHARS[cs.id];
    let w = G.WEAPONS[d.weapon];
    const infusedMelee = P.infuse && P.infuse.t > 0 && P.infuse.melee;
    if (infusedMelee) w = { kind: 'melee', reach: 24, arc: 2.4 };
    const el = w.elemental ? d.el : 'phys';
    const heavy = P.comboIdx >= (w.chain ? w.chain.length - 1 : 3);
    const src = { cs, mult: P.mult, el, kind: 'normal', tag: 'n' + cs.id, gu: 1, heavy: d.weapon === 'claymore' || heavy };
    const fxCol = P.infuse && P.infuse.t > 0 ? G.EL[P.infuse.el].light : el !== 'phys' ? G.EL[el].light : '#ffffff';
    const ox = P.x + Math.cos(P.ang) * 6, oy = P.y - 10 + Math.sin(P.ang) * 6;
    if (w.kind === 'melee') {
      C.slash(ox, oy, P.ang, w.reach, w.arc, fxCol, 0.16);
      C.cone(P.x, P.y - 4, P.ang, w.reach + 4, w.arc, src);
    } else if (w.kind === 'thrust') {
      C.fx({ type: 'thrust', x: ox, y: oy, ang: P.ang, len: w.reach, color: fxCol, life: 0.14 });
      for (const e of E.enemies) {
        if (e.dead) continue;
        const dx = e.x - P.x, dy = e.y - 4 - P.y;
        const along = dx * Math.cos(P.ang) + dy * Math.sin(P.ang);
        const side = -dx * Math.sin(P.ang) + dy * Math.cos(P.ang);
        if (along > -4 && along < w.reach + e.r && Math.abs(side) < 8 + e.r) C.hit(e, src);
      }
    } else if (w.kind === 'shot') {
      const t = C.nearest(P.x, P.y, 150, (e) => Math.abs(G.angDiff(P.ang, Math.atan2(e.y - P.y, e.x - P.x))) < 1.1);
      let a = P.ang;
      if (t) a = Math.atan2(t.y - 4 - (P.y - 10), t.x - P.x);
      const sp = w.proj === 'arrow' ? 230 : 150;
      E.proj.push({ from: 'p', kind: w.proj, x: P.x, y: P.y - 10, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: 4, life: 0.7, src, color: el === 'phys' ? '#ffffff' : G.EL[el].light, ang: a, gy: P.y });
    }
    if (P.lunge) { P.lungeV = 90; }
  }

  // ------------------------------------------------------------------
  //  Compétence élémentaire (E) & déchaînement (Q)
  // ------------------------------------------------------------------
  C.useSkill = function () {
    const S = G.state, P = G.P, cs = G.cs(), d = G.CHARS[cs.id], k = d.skill;
    if (P.castT > 0 || P.dead || P.swim) return false;
    // recast Keqing
    if (k.k === 'blink' && P.stiletto && P.stiletto.t > 0) { SK.blink(cs, d, k, true); return true; }
    if (cs.cdE > 0) { if (G.hudShake) G.hudShake('E'); return false; }
    const aim = C.autoFace(120);
    SK[k.k](cs, d, k);
    cs.cdE = k.cdStart ? k.cd : k.cd;
    P.castT = 0.22;
    if (G.Audio) G.Audio.sfx('skill');
    if (G.Quest) G.Quest.event('skill', {});
    return true;
  };

  C.useBurst = function () {
    const S = G.state, P = G.P, cs = G.cs(), d = G.CHARS[cs.id], k = d.burst;
    if (P.castT > 0 || P.dead || P.swim) return false;
    if (cs.energy < k.cost || cs.cdQ > 0) { if (G.hudShake) G.hudShake('Q'); return false; }
    cs.energy = 0; cs.cdQ = k.cd;
    C.autoFace(120);
    // plan rapproché façon Genshin : pause + portrait
    G.cutin = { id: cs.id, t: 0, life: 0.85 };
    G.freeze = 0.85;
    G.pendingBurst = { cs, d, k };
    if (G.Audio) G.Audio.sfx('burst');
    return true;
  };
  C.runBurst = function () {
    const b = G.pendingBurst; if (!b) return;
    G.pendingBurst = null;
    BU[b.k.k](b.cs, b.d, b.k);
    G.P.castT = 0.35;
    if (G.Quest) G.Quest.event('burst', {});
  };

  C.strike = strike;
  const SK = {}, BU = {};
  const mkSrc = (cs, mult, el, kind, extra) => Object.assign({ cs, mult, el, kind, tag: kind + cs.id, gu: 2, particles: 0 }, extra || {});
  const ahead = (dist) => ({ x: G.P.x + Math.cos(G.P.ang) * dist, y: G.P.y + Math.sin(G.P.ang) * dist });

  SK.blink = function (cs, d, k, recast) {
    const P = G.P;
    if (recast) {
      const s = P.stiletto;
      C.bolt(P.x, P.y - 8, s.x, s.y - 8, G.EL.electro.light, 0.25);
      if (!G.World.blockedBox(s.x, s.y, 4, 4)) { P.x = s.x; P.y = s.y; }
      C.slash(P.x, P.y - 8, P.ang, 34, 6.28, '#e4c4ff', 0.25);
      C.ring(P.x, P.y, 34, G.EL.electro.color, 0.3);
      C.aoe(P.x, P.y, 34, mkSrc(cs, k.mult2, 'electro', 'skill', { particles: 2, noStagger: false }));
      P.infuse = { el: 'electro', t: k.dur };
      P.stiletto = null;
      P.castT = 0.25;
      cs.cdE = Math.max(cs.cdE, 0.5);
      if (G.Audio) G.Audio.sfx('skill');
      return;
    }
    const a = ahead(14);
    E.proj.push({ from: 'p', kind: 'stiletto', x: a.x, y: P.y - 8, vx: Math.cos(P.ang) * 240, vy: Math.sin(P.ang) * 240, r: 5, life: 0.45, src: mkSrc(cs, k.mult * 0.2, 'electro', 'skill', { particles: 2 }), color: '#c9a0ff', ang: P.ang, gy: P.y, stiletto: true, pierce: 0 });
  };
  SK.blast = function (cs, d, k) {
    const P = G.P;
    C.ring(P.x, P.y, k.r, G.EL[k.el].color, 0.4);
    C.spark(P.x, P.y - 6, G.EL[k.el].light, 14, 90);
    if (k.el === 'electro') for (let i = 0; i < 4; i++) { const a = Math.random() * 6.28; C.bolt(P.x, P.y - 8, P.x + Math.cos(a) * k.r, P.y - 8 + Math.sin(a) * k.r, G.EL.electro.light, 0.2); }
    C.aoe(P.x + Math.cos(P.ang) * 4, P.y, k.r, mkSrc(cs, k.mult, k.el, 'skill', { particles: k.energyBonus ? 3 : 2, kx: undefined }));
    if (k.knock) for (const e of C.inRadius(P.x, P.y, k.r)) { const dx = e.x - P.x, dy = e.y - P.y, dl = Math.hypot(dx, dy) || 1; e.vx += (dx / dl) * k.knock * 3; e.vy += (dy / dl) * k.knock * 3; }
    G.shake = Math.max(G.shake || 0, 2);
  };
  SK.cone = function (cs, d, k) {
    const P = G.P;
    const n = k.n2 || 1;
    for (let i = 0; i < n; i++) {
      E.fx.push({ type: 'delay', t: 0, life: i * 0.2 + 0.001, fn: () => {
        const a = P.ang + (n > 1 ? (i - (n - 1) / 2) * 0.35 : 0);
        C.slash(P.x + Math.cos(a) * 4, P.y - 8, a, k.r, k.arc, G.EL[k.el].light, 0.2);
        C.cone(P.x, P.y - 4, a, k.r, k.arc, mkSrc(cs, k.mult / (n > 1 ? 1.4 : 1), k.el, 'skill', { particles: i === 0 ? 2 : 0, tag: 'skill' + cs.id + i }));
        if (G.Audio) G.Audio.sfx('swing');
      } });
    }
  };
  SK.vortex = function (cs, d, k) {
    const P = G.P;
    const a = ahead(k.dist);
    let x = a.x, y = a.y;
    for (let tries = 0; tries < 5 && G.World.isSolidAt(x, y); tries++) { x = (x + P.x) / 2; y = (y + P.y) / 2; }
    E.zones.push({ kind: 'vortex', x, y, r: k.r, t: 0, dur: k.dur, tick: 0.4, tickT: 0, mult: k.mult * 0.45, el: k.el, cs, pull: k.pull, particles: 2, first: true, firstMult: k.mult });
    C.ring(x, y, k.r, G.EL[k.el].color, 0.4);
  };
  SK.summon = function (cs, d, k) {
    const P = G.P;
    const a = ahead(14);
    E.summons.push({ kind: 'turret', name: k.name, bird: !!k.bird, x: a.x, y: a.y, t: 0, dur: k.dur, every: k.every, tt: 0.3, mult: k.mult, range: k.range, el: k.el, cs, flyY: 0 });
    C.spark(a.x, a.y - 8, G.EL[k.el].light, 8, 50);
    C.ring(a.x, a.y, 14, G.EL[k.el].color, 0.3);
  };
  SK.decoy = function (cs, d, k) {
    const P = G.P;
    const a = ahead(22);
    E.summons.push({ kind: 'decoy', name: k.name, x: a.x, y: a.y, t: 0, dur: k.dur, mult: k.mult, r: k.r, el: k.el, cs, hp: 1 });
    C.spark(a.x, a.y - 6, G.EL[k.el].light, 8, 50);
  };
  SK.shield = function (cs, d, k) {
    const P = G.P, st = G.charStats(cs);
    P.shield = { hp: st.hp * k.absorb * 1.6, t: k.dur, el: k.el, max: st.hp * k.absorb * 1.6 };
    C.ring(P.x, P.y, k.r, G.EL[k.el].color, 0.4);
    C.aoe(P.x, P.y, k.r, mkSrc(cs, k.mult, k.el, 'skill', { particles: 2 }));
    G.shake = Math.max(G.shake || 0, 1.5);
  };
  SK.field = function (cs, d, k) {
    const P = G.P;
    E.zones.push({ kind: 'field', x: P.x, y: P.y, r: k.r, t: 0, dur: k.dur, tick: k.tick, tickT: 0, mult: k.mult, el: k.el, cs, heal: k.heal, follow: true, particles: 1 });
    C.ring(P.x, P.y, k.r, G.EL[k.el].color, 0.4);
  };
  SK.stance = function (cs, d, k) {
    const P = G.P;
    P.infuse = { el: k.el, t: k.dur, melee: !!k.melee, mult: k.mult };
    P.stance = cs.id;
    C.ring(P.x, P.y, 30, G.EL[k.el].color, 0.4);
    C.spark(P.x, P.y - 10, G.EL[k.el].light, 14, 80);
    if (k.melee) { C.aoe(P.x, P.y, 28, mkSrc(cs, 0.7, k.el, 'skill', { particles: 2 })); }
  };
  SK.heal = function (cs, d, k) {
    const P = G.P, st = G.charStats(cs);
    C.ring(P.x, P.y, k.r, G.EL[k.el].color, 0.45);
    C.aoe(P.x, P.y, k.r, mkSrc(cs, k.mult, k.el, 'skill', { particles: 2 }));
    C.heal(st.hp * k.healPct);
  };

  BU.nova = function (cs, d, k) {
    const P = G.P;
    const col = G.EL[k.el];
    if (k.hits > 1) {
      const a = ahead(k.r * 0.4);
      E.zones.push({ kind: 'rain', x: a.x, y: a.y, r: k.r, t: 0, dur: k.hits * 0.15, tick: 0.15, tickT: 0, mult: k.mult, el: k.el, cs, burst: true });
      return;
    }
    C.ring(P.x, P.y, k.r, col.color, 0.5, 4);
    C.ring(P.x, P.y, k.r * 0.6, col.light, 0.4, 2);
    C.spark(P.x, P.y - 8, col.light, 24, 130);
    G.shake = Math.max(G.shake || 0, 5);
    C.aoe(P.x, P.y, k.r, mkSrc(cs, k.mult, k.el, 'burst', { heavy: true, gu: 2.5 }));
    if (k.knock) for (const e of C.inRadius(P.x, P.y, k.r)) { const dx = e.x - P.x, dy = e.y - P.y, dl = Math.hypot(dx, dy) || 1; e.vx += (dx / dl) * k.knock * 3; e.vy += (dy / dl) * k.knock * 3; }
    if (k.healPct) C.heal(G.charStats(cs).hp * k.healPct);
    if (k.infuse) P.infuse = { el: k.el, t: 8 };
    if (G.Audio) G.Audio.sfx('boom');
  };
  BU.zone = function (cs, d, k) {
    const P = G.P;
    const z = { kind: k.healBurst ? 'healburst' : 'zone', x: P.x, y: P.y, r: k.r, t: 0, dur: k.dur, tick: k.tick, tickT: 0, mult: k.mult, el: k.el, cs, pull: k.pull, heal: k.heal, buff: k.buff, infuse: k.infuse, swirlInfuse: k.swirlInfuse, follow: !!(k.infuse || k.buff), cx: P.x, cy: P.y, label: d.name };
    if (k.healBurst) {
      const S = G.state;
      S.party.forEach((id) => { const c2 = S.chars[id]; if (c2.hp > 0) { const st = G.charStats(c2); G.healChar(c2, st.hp * 0.25 + G.charStats(cs).atk * 1.2); } });
      C.text(P.x, P.y - 34, 'Soin d’équipe', '#8dff9a', true, 1);
    }
    E.zones.push(z);
    C.ring(P.x, P.y, k.r, G.EL[k.el].color, 0.5, 6);
    G.shake = Math.max(G.shake || 0, 2);
  };
  BU.orbit = function (cs, d, k) {
    const P = G.P;
    E.summons.push({ kind: 'orbit', x: P.x, y: P.y, t: 0, dur: k.dur, r: k.r, mult: k.mult, tickRate: k.tickRate, tt: 0, el: k.el, cs, follow: true, ang: 0 });
    C.ring(P.x, P.y, k.r, G.EL[k.el].color, 0.4);
  };
  BU.stance = function (cs, d, k) {
    const P = G.P;
    P.infuse = { el: k.el, t: k.dur, mult: k.mult };
    P.buff = { atk: 0.4, t: k.dur };
    C.ring(P.x, P.y, 34, G.EL[k.el].color, 0.5);
    C.spark(P.x, P.y - 10, G.EL[k.el].light, 20, 100);
  };
  BU.flurry = function (cs, d, k) {
    const P = G.P;
    const t = C.nearest(P.x, P.y, 90);
    P.inv = Math.max(P.inv, 1.2);
    if (t) {
      const a = Math.atan2(t.y - P.y, t.x - P.x);
      const tx = t.x - Math.cos(a) * 12, ty = t.y - Math.sin(a) * 12;
      if (!G.World.blockedBox(tx, ty, 4, 4)) { C.bolt(P.x, P.y - 8, tx, ty - 8, G.EL.electro.light, 0.2); P.x = tx; P.y = ty; }
    }
    const cx = P.x, cy = P.y;
    for (let i = 0; i < k.hits; i++) {
      E.fx.push({ type: 'delay', t: 0, life: 0.12 + i * 0.1, fn: () => {
        const a = Math.random() * 6.28;
        C.slash(cx, cy - 8, a, 34, 2.4, i % 2 ? '#ffffff' : G.EL.electro.light, 0.12);
        C.bolt(cx + Math.cos(a) * 30, cy - 8 + Math.sin(a) * 30, cx - Math.cos(a) * 30, cy - 8 - Math.sin(a) * 30, G.EL.electro.light, 0.1);
        C.aoe(cx, cy, 34, mkSrc(cs, k.mult, 'electro', 'burst', { gu: 0.5, tag: 'burst' + cs.id + (i % 3), noStagger: true }));
        if (G.Audio) G.Audio.sfx('swing');
      } });
    }
    E.fx.push({ type: 'delay', t: 0, life: 0.12 + k.hits * 0.1 + 0.15, fn: () => {
      C.ring(cx, cy, 44, '#ffffff', 0.4, 4); C.ring(cx, cy, 36, G.EL.electro.color, 0.35, 2);
      C.spark(cx, cy - 8, G.EL.electro.light, 26, 140);
      for (let i = 0; i < 5; i++) { const a = (i / 5) * 6.28; C.bolt(cx, cy - 8, cx + Math.cos(a) * 44, cy - 8 + Math.sin(a) * 44, '#ffffff', 0.18); }
      C.aoe(cx, cy, 44, mkSrc(cs, k.endMult, 'electro', 'burst', { heavy: true, gu: 2, tag: 'burstend' + cs.id }));
      G.shake = Math.max(G.shake || 0, 6);
      if (G.Audio) G.Audio.sfx('boom');
    } });
  };

  // ------------------------------------------------------------------
  //  Mise à jour : projectiles, zones, familiers, effets
  // ------------------------------------------------------------------
  C.update = function (dt) {
    const S = G.state, P = G.P;
    // temps de recharge
    S.party.forEach((id) => { const c = S.chars[id]; if (c.cdE > 0) c.cdE = Math.max(0, c.cdE - dt); if (c.cdQ > 0) c.cdQ = Math.max(0, c.cdQ - dt); });

    // projectiles
    for (let i = E.proj.length - 1; i >= 0; i--) {
      const p = E.proj[i];
      p.t = (p.t || 0) + dt;
      p.life -= dt;
      const nx = p.x + p.vx * dt, ny = p.y + p.vy * dt;
      const gy = ny + (p.gy != null ? p.gy - p.y * 0 : 0) * 0;
      let remove = false;
      if (G.World.isSolidAt(nx, ny + 10)) remove = true;
      p.x = nx; p.y = ny;
      if (p.homing) {
        const t = C.nearest(p.x, p.y, 100);
        if (t) { const a = Math.atan2(t.y - 6 - p.y, t.x - p.x); const sp = Math.hypot(p.vx, p.vy); p.vx = G.lerp(p.vx, Math.cos(a) * sp, 0.15); p.vy = G.lerp(p.vy, Math.sin(a) * sp, 0.15); }
      }
      if (p.from === 'p') {
        for (const e of E.enemies) {
          if (e.dead) continue;
          const bodyY = e.y - 6;
          if (Math.hypot(e.x - p.x, bodyY - p.y) < p.r + e.r) {
            if (p.stiletto) {
              C.hit(e, p.src);
              P.stiletto = { x: p.x, y: p.y + 8, t: 5 };
              C.ring(p.x, p.y, 10, G.EL.electro.color, 0.25);
              remove = true; break;
            }
            C.hit(e, p.src);
            C.spark(p.x, p.y, p.color, 4, 40);
            if (!p.pierce) { remove = true; break; }
          }
        }
        if (p.life <= 0 && p.stiletto && !remove) { P.stiletto = { x: p.x, y: p.y + 8, t: 5 }; C.ring(p.x, p.y, 10, G.EL.electro.color, 0.25); remove = true; }
      } else {
        // projectile ennemi
        if (!P.dead && Math.hypot(P.x - p.x, P.y - 10 - p.y) < p.r + 5) {
          if (C.hurtPlayer(p.dmg, p.el, p.x, p.y, { knock: 40 })) { remove = true; C.spark(p.x, p.y, p.color, 5, 50); }
        }
      }
      if (remove || p.life <= 0) E.proj.splice(i, 1);
    }

    // zones
    for (let i = E.zones.length - 1; i >= 0; i--) {
      const z = E.zones[i];
      z.t += dt;
      if (z.follow) { z.x = P.x; z.y = P.y; }
      const col = G.EL[z.el] || G.EL.phys;
      if (z.first) {
        z.first = false;
        C.aoe(z.x, z.y, z.r, mkSrc(z.cs, z.firstMult, z.el, 'skill', { particles: z.particles || 0, tag: 'skill' + z.cs.id, noStagger: true }));
        for (const e of C.inRadius(z.x, z.y, z.r)) { e.stun = Math.max(e.stun, 0.35); e.vy -= 0; }
      }
      // attirance
      if (z.pull) for (const e of C.inRadius(z.x, z.y, z.r)) {
        if (e.boss) continue;
        const dx = z.x - e.x, dy = z.y - e.y, dl = Math.hypot(dx, dy);
        if (dl > 3) G.World.move(e, (dx / dl) * z.pull * dt * 0.6, (dy / dl) * z.pull * dt * 0.6, 3, 3);
      }
      z.tickT -= dt;
      if (z.tickT <= 0) {
        z.tickT += z.tick;
        if (z.mult > 0) {
          let el = z.el;
          for (const e of C.inRadius(z.x, z.y, z.r)) {
            if (z.swirlInfuse && !z.absorbed) { const k = AUR.find((q) => e.aura[q] > 0.05); if (k) z.absorbed = k; }
            C.hit(e, mkSrc(z.cs, z.mult, el, 'burst', { gu: 0.6, tag: 'zone' + z.cs.id, noStagger: true, kx: 0, ky: 0 }));
            if (z.absorbed) C.flatAndApply(e, z.absorbed, 0.25, z.cs, 0.6);
          }
          if (z.kind === 'rain') {
            const rx = z.x + G.rand(-z.r, z.r) * 0.8, ry = z.y + G.rand(-z.r, z.r) * 0.8;
            C.ring(rx, ry, 12, col.color, 0.25, 2); C.spark(rx, ry, col.light, 4, 40);
          }
        }
        if (z.heal && z.kind !== 'healburst') {
          const cs = G.cs();
          if (Math.hypot(P.x - z.x, P.y - z.y) < z.r) C.heal(G.charStats(cs).hp * z.heal);
        }
      }
      if (z.buff && Math.hypot(P.x - z.x, P.y - z.y) < z.r) P.buff = { atk: z.buff, t: 1.5 };
      if (z.infuse && Math.hypot(P.x - z.x, P.y - z.y) < z.r) P.infuse = { el: z.infuse, t: 1.5 };
      if (z.t >= z.dur) E.zones.splice(i, 1);
    }

    // familiers
    for (let i = E.summons.length - 1; i >= 0; i--) {
      const s = E.summons[i];
      s.t += dt;
      if (s.follow) { s.x = P.x; s.y = P.y; }
      const col = G.EL[s.el];
      if (s.kind === 'turret') {
        s.tt -= dt;
        s.flyY = Math.sin(s.t * 5) * 2;
        if (s.tt <= 0) {
          const tg = C.nearest(s.x, s.y, s.range);
          if (tg) {
            s.tt = s.every;
            const a = Math.atan2(tg.y - 6 - (s.y - 12), tg.x - s.x);
            if (s.name === 'Guoba') E.proj.push({ from: 'p', kind: 'flame', x: s.x, y: s.y - 10, vx: Math.cos(a) * 140, vy: Math.sin(a) * 140, r: 6, life: 0.5, src: mkSrc(s.cs, s.mult, s.el, 'skill', { particles: 1, tag: 'guoba', gu: 1 }), color: '#ffb36a', ang: a, pierce: 1 });
            else E.proj.push({ from: 'p', kind: s.bird ? 'bolt' : 'orb', x: s.x, y: s.y - 12, vx: Math.cos(a) * 200, vy: Math.sin(a) * 200, r: 5, life: 0.6, src: mkSrc(s.cs, s.mult, s.el, 'skill', { particles: 1, tag: 'summon' + s.cs.id, gu: 1 }), color: col.light, ang: a });
          } else s.tt = 0.1;
        }
      } else if (s.kind === 'decoy') {
        if (s.t >= s.dur) {
          C.ring(s.x, s.y, s.r, col.color, 0.4); C.spark(s.x, s.y - 8, col.light, 16, 110);
          C.aoe(s.x, s.y, s.r, mkSrc(s.cs, s.mult, s.el, 'skill', { particles: 2, heavy: true, tag: 'decoy' }));
          G.shake = Math.max(G.shake || 0, 3);
          if (G.Audio) G.Audio.sfx('boom');
        }
      } else if (s.kind === 'orbit') {
        s.ang += dt * 4.2;
        s.tt -= dt;
        if (s.tt <= 0) {
          s.tt = s.tickRate;
          for (let k = 0; k < 3; k++) {
            const a = s.ang + (k * Math.PI * 2) / 3;
            const ox = s.x + Math.cos(a) * s.r, oy = s.y + Math.sin(a) * s.r * 0.8;
            for (const e of C.inRadius(ox, oy, 8)) C.hit(e, mkSrc(s.cs, s.mult, s.el, 'burst', { gu: 0.6, tag: 'orbit' + k, noStagger: false, particles: 0 }));
          }
        }
      }
      if (s.t >= s.dur) E.summons.splice(i, 1);
    }

    // statuts joueur
    if (P.infuse && P.infuse.t > 0) { P.infuse.t -= dt; if (P.infuse.t <= 0) P.infuse = null; }
    if (P.buff && P.buff.t > 0) { P.buff.t -= dt; if (P.buff.t <= 0) P.buff = null; }
    if (P.shield) { P.shield.t -= dt; if (P.shield.t <= 0 || P.shield.hp <= 0) P.shield = null; }
    if (P.stiletto) { P.stiletto.t -= dt; if (P.stiletto.t <= 0) P.stiletto = null; }

    // effets
    for (let i = E.fx.length - 1; i >= 0; i--) {
      const f = E.fx[i];
      f.t += dt;
      if (f.type === 'dot') { f.x += f.vx * dt; f.y += f.vy * dt; f.vy += (f.g || 0) * dt; }
      if (f.t >= f.life) { if (f.type === 'delay' && f.fn) f.fn(); E.fx.splice(i, 1); }
    }
    for (let i = E.texts.length - 1; i >= 0; i--) {
      const t = E.texts[i];
      t.t += dt; t.y += t.vy * dt; t.vy *= 0.94;
      if (t.t >= t.life) E.texts.splice(i, 1);
    }
  };

  // ------------------------------------------------------------------
  //  Rendu : sol (zones, anneaux) et dessus (projectiles, éclairs, textes)
  // ------------------------------------------------------------------
  const px = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  function pxRing(ctx, cx, cy, r, ry, color, step) {
    ctx.fillStyle = color;
    const n = Math.max(12, Math.floor(r * 2.2));
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 6.2832;
      ctx.fillRect(Math.round(cx + Math.cos(a) * r), Math.round(cy + Math.sin(a) * ry), 1, 1);
    }
  }
  C.pxRing = pxRing;

  C.drawGround = function (ctx, camX, camY, t) {
    // zones
    for (const z of E.zones) {
      const col = G.EL[z.el] || G.EL.phys;
      const x = z.x - camX, y = z.y - camY;
      const fade = z.dur - z.t < 0.5 ? (z.dur - z.t) / 0.5 : 1;
      if (z.kind === 'healburst') continue;
      ctx.globalAlpha = 0.22 * fade;
      ctx.fillStyle = col.color;
      S_ell(ctx, x, y, z.r, z.r * 0.72);
      ctx.globalAlpha = 0.9 * fade;
      pxRing(ctx, x, y, z.r, z.r * 0.72, col.light);
      pxRing(ctx, x, y, z.r - 2, (z.r - 2) * 0.72, col.color);
      // spirales / particules
      const n = z.kind === 'rain' ? 0 : 8;
      for (let i = 0; i < n; i++) {
        const a = t * (z.pull ? 5 : 2.2) + (i / n) * 6.28;
        const rr = (z.r - 3) * (0.35 + 0.65 * ((i * 0.37 + t * 0.6) % 1));
        px(ctx, x + Math.cos(a) * rr, y + Math.sin(a) * rr * 0.72 - 3, 2, 2, col.light);
      }
      ctx.globalAlpha = 1;
    }
    // anneaux, éclats au sol
    for (const f of E.fx) {
      if (f.type !== 'ring') continue;
      const k = f.t / f.life;
      const r = f.r0 + (f.r - f.r0) * (1 - Math.pow(1 - k, 2));
      ctx.globalAlpha = 1 - k;
      pxRing(ctx, f.x - camX, f.y - camY, r, r * 0.72, f.color);
      pxRing(ctx, f.x - camX, f.y - camY, Math.max(1, r - 1), Math.max(1, r - 1) * 0.72, f.color);
      ctx.globalAlpha = 1;
    }
    // stylet de Keqing
    const P = G.P;
    if (P.stiletto) {
      const s = P.stiletto;
      const x = Math.round(s.x - camX), y = Math.round(s.y - camY);
      px(ctx, x - 1, y - 14, 3, 12, '#c9a0ff'); px(ctx, x, y - 16, 1, 3, '#fff'); px(ctx, x - 3, y - 4, 7, 2, '#7a3fc4');
      const blink = Math.sin(t * 12) > 0;
      if (blink) pxRing(ctx, x, y, 8, 5, '#e4c4ff');
    }
  };
  function S_ell(ctx, cx, cy, rx, ry) {
    for (let y = -Math.floor(ry); y <= ry; y++) {
      const hw = Math.floor(rx * Math.sqrt(1 - (y * y) / (ry * ry + 0.01)) + 0.3);
      ctx.fillRect(Math.round(cx - hw), Math.round(cy + y), hw * 2 + 1, 1);
    }
  }
  C.S_ell = S_ell;

  const PROJ_SPR = {};
  C.drawTop = function (ctx, camX, camY, t) {
    // projectiles
    for (const p of E.proj) {
      const x = Math.round(p.x - camX), y = Math.round(p.y - camY);
      if (p.kind === 'arrow') {
        const c = Math.cos(p.ang), s = Math.sin(p.ang);
        for (let i = 0; i < 7; i++) px(ctx, x - c * i, y - s * i, 1, 1, i < 2 ? '#ffffff' : '#c9b48a');
        px(ctx, x + c, y + s, 1, 1, '#ffffff');
      } else if (p.kind === 'orb' || p.kind === 'eorb') {
        ctx.fillStyle = p.color; ctx.fillRect(x - 2, y - 2, 5, 5);
        ctx.fillStyle = '#ffffff'; ctx.fillRect(x - 1, y - 1, 3, 3);
        px(ctx, x - 3, y - 1, 1, 3, p.color); px(ctx, x + 3, y - 1, 1, 3, p.color);
      } else if (p.kind === 'bolt') {
        C.pxLine(ctx, x, y, x - p.vx * 0.04, y - p.vy * 0.04, p.color); px(ctx, x - 1, y - 1, 3, 3, '#ffffff');
      } else if (p.kind === 'flame') {
        for (let i = 0; i < 3; i++) { ctx.fillStyle = i === 0 ? '#ffe27a' : i === 1 ? '#ffa94a' : '#ff6a2a'; ctx.fillRect(x - 3 + i, y - 3 + i, 6 - i * 2, 6 - i * 2); }
      } else if (p.kind === 'stiletto') {
        const c = Math.cos(p.ang), s = Math.sin(p.ang);
        for (let i = 0; i < 9; i++) px(ctx, x - c * i, y - s * i, 2, 2, i < 3 ? '#ffffff' : '#c9a0ff');
      } else if (p.kind === 'wind') {
        const a = t * 14 + p.t * 10;
        for (let i = 0; i < 6; i++) px(ctx, x + Math.cos(a + i) * (3 - i * 0.3), y + Math.sin(a + i) * (3 - i * 0.3), 2, 2, i % 2 ? '#ffffff' : '#7af0c4');
      } else if (p.kind === 'earth') {
        ctx.fillStyle = '#8a7a58'; ctx.fillRect(x - 3, y - 3, 6, 6); ctx.fillStyle = '#c9b88a'; ctx.fillRect(x - 2, y - 2, 3, 3);
      } else {
        ctx.fillStyle = p.color || '#fff'; ctx.fillRect(x - 2, y - 2, 4, 4);
      }
    }
    // effets
    for (const f of E.fx) {
      const k = f.t / f.life;
      if (f.type === 'slash') {
        const n = Math.floor(f.r * 1.3);
        for (let i = 0; i <= n; i++) {
          const u = i / n;
          const a = f.ang - f.arc / 2 + f.arc * (f.t / f.life * 0.5 + u * 0.5 > 1 ? 1 : u);
          const prog = (k * 1.1);
          if (u > prog) continue;
          const rr = f.r * (0.7 + 0.3 * Math.sin(u * Math.PI));
          const th = 1 + (u > 0.3 && u < 0.8 && k < 0.7 ? 1 : 0);
          ctx.globalAlpha = Math.min(1, (1 - k) * 1.5);
          px(ctx, f.x + Math.cos(a) * rr - camX, f.y + Math.sin(a) * rr * 0.8 - camY, th + 1, th + 1, f.color);
        }
        ctx.globalAlpha = 1;
      } else if (f.type === 'thrust') {
        const len = f.len * Math.min(1, k * 3);
        ctx.globalAlpha = 1 - k;
        for (let i = 0; i < len; i += 2) px(ctx, f.x + Math.cos(f.ang) * i - camX, f.y + Math.sin(f.ang) * i - camY, 2, 2, f.color);
        ctx.globalAlpha = 1;
      } else if (f.type === 'bolt') {
        ctx.globalAlpha = 1 - k * 0.8;
        C.boltLine(ctx, f.x0 - camX, f.y0 - camY, f.x1 - camX, f.y1 - camY, f.color, f.seed + Math.floor(f.t * 30));
        ctx.globalAlpha = 1;
      } else if (f.type === 'dot') {
        ctx.globalAlpha = 1 - k;
        px(ctx, f.x - camX, f.y - camY, f.sz, f.sz, f.color);
        ctx.globalAlpha = 1;
      }
    }
    // bouclier
    const P = G.P;
    if (P.shield && P.shield.t > 0) {
      const col = G.EL[P.shield.el];
      const x = Math.round(P.x - camX), y = Math.round(P.y - camY - 8);
      ctx.globalAlpha = 0.28; ctx.fillStyle = col.color; S_ell(ctx, x, y, 11, 14);
      ctx.globalAlpha = 0.9; pxRing(ctx, x, y, 11, 14, col.light);
      ctx.globalAlpha = 1;
    }
  };

  C.pxLine = function (ctx, x0, y0, x1, y1, color) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    ctx.fillStyle = color;
    const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx - dy, n = 0;
    for (;;) {
      ctx.fillRect(x0, y0, 1, 1);
      if ((x0 === x1 && y0 === y1) || n++ > 300) break;
      const e2 = 2 * err;
      if (e2 > -dy) { err -= dy; x0 += sx; }
      if (e2 < dx) { err += dx; y0 += sy; }
    }
  };
  C.boltLine = function (ctx, x0, y0, x1, y1, color, seed) {
    const segs = 6;
    let px_ = x0, py_ = y0;
    const rnd = G.rng(Math.floor(seed * 100));
    for (let i = 1; i <= segs; i++) {
      const u = i / segs;
      const nx = x0 + (x1 - x0) * u + (i < segs ? (rnd() - 0.5) * 10 : 0), ny = y0 + (y1 - y0) * u + (i < segs ? (rnd() - 0.5) * 10 : 0);
      C.pxLine(ctx, px_, py_, nx, ny, color);
      C.pxLine(ctx, px_ + 1, py_, nx + 1, ny, '#ffffff');
      px_ = nx; py_ = ny;
    }
  };

  C.drawTexts = function (ctx, camX, camY) {
    for (const t of E.texts) {
      const a = t.t > t.life - 0.25 ? (t.life - t.t) / 0.25 : 1;
      ctx.globalAlpha = Math.max(0, a);
      G.text(ctx, t.text, t.x - camX, t.y - camY, t.color, { align: 'c', outline: '#1a1a2a', scale: t.big ? 1 : 1 });
      ctx.globalAlpha = 1;
    }
  };

  // Familiers dessinés dans la liste triée
  C.summonSprite = function (ctx, s, camX, camY, t) {
    const col = G.EL[s.el];
    const x = Math.round(s.x - camX), y = Math.round(s.y - camY);
    ctx.fillStyle = 'rgba(30,40,60,0.3)'; S_ell(ctx, x, y, 6, 2);
    if (s.kind === 'turret') {
      if (s.bird) {
        const fy = Math.round(s.flyY - 12);
        px(ctx, x - 4, y + fy - 4, 8, 7, '#2a2a3a'); px(ctx, x - 3, y + fy - 3, 6, 5, '#4a3a6a'); px(ctx, x + 2, y + fy - 2, 2, 1, '#e4c4ff'); px(ctx, x - 7, y + fy - 2 + (Math.floor(t * 8) % 2), 4, 2, '#2a2a3a'); px(ctx, x + 4, y + fy - 2 + (Math.floor(t * 8) % 2), 4, 2, '#2a2a3a');
      } else {
        px(ctx, x - 5, y - 8, 10, 8, '#c8683a'); px(ctx, x - 4, y - 7, 8, 6, '#e88a4a'); px(ctx, x - 3, y - 5, 2, 2, '#fff'); px(ctx, x + 1, y - 5, 2, 2, '#fff'); px(ctx, x - 2, y - 2, 4, 1, '#7a2a1a'); px(ctx, x - 6, y - 10, 3, 3, '#e88a4a'); px(ctx, x + 3, y - 10, 3, 3, '#e88a4a');
      }
    } else if (s.kind === 'decoy') {
      const blink = s.dur - s.t < 1 && Math.floor(t * 10) % 2;
      px(ctx, x - 5, y - 12, 10, 12, blink ? '#fff' : col.color); px(ctx, x - 4, y - 11, 8, 4, col.light); px(ctx, x - 3, y - 7, 2, 2, '#222'); px(ctx, x + 1, y - 7, 2, 2, '#222');
    } else if (s.kind === 'orbit') {
      for (let k = 0; k < 3; k++) {
        const a = s.ang + (k * Math.PI * 2) / 3;
        const ox = Math.round(s.x + Math.cos(a) * s.r - camX), oy = Math.round(s.y + Math.sin(a) * s.r * 0.8 - camY - 8);
        ctx.fillStyle = col.color; ctx.fillRect(ox - 2, oy - 2, 5, 5); ctx.fillStyle = col.light; ctx.fillRect(ox - 1, oy - 1, 3, 3);
      }
    }
  };
})();
