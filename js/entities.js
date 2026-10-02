/* Teyvat Pixel — ennemis (IA), PNJ, objets ramassables, séelies, ambiance, coffres */
(function () {
  const G = window.G;
  const E = G.E, C = G.Combat, TS = G.TS, World = G.World, P = G.P;
  const Entities = (G.Entities = {});
  const px = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), w, h); };
  const refHP = (lvl) => 1500 * G.sLevel(lvl);
  const refDmg = (lvl) => G.REF_PLAYER_HP * G.sLevel(lvl);
  const COUNTER = { pyro: 'hydro', hydro: 'electro', cryo: 'pyro', electro: 'cryo' };

  // =====================================================================
  //  Ennemis
  // =====================================================================
  class Enemy {
    constructor(type, x, y, camp) {
      const d = G.ENEMIES[type];
      this.type = type; this.d = d; this.kind = d.kind; this.x = x; this.y = y; this.hx = x; this.hy = y; this.camp = camp;
      this.boss = !!d.boss;
      this.lvl = G.clamp(G.enemyLvl(this.boss ? 4 : 0) + G.irand(-1, 1), 1, 90);
      this.r = d.r;
      this.maxhp = Math.max(10, Math.round(refHP(this.lvl) * d.hp));
      this.hp = this.maxhp;
      this.aura = { pyro: 0, hydro: 0, cryo: 0, electro: 0 };
      this.icd = {}; this.frozen = 0; this.stun = 0; this.vx = 0; this.vy = 0; this.hurtT = 0; this.barT = 0;
      this.st = 'idle'; this.stT = 0; this.cd = G.rand(0, 1); this.faceX = 1; this.dirAng = Math.PI / 2;
      this.hopT = Math.random() * 1; this.frame = 0; this.react = 0; this.dead = false; this.anim = Math.random() * 10;
      this.tele = null; this.wanderT = G.rand(0.5, 3); this.wx = x; this.wy = y; this.alert = false;
      this.innate = d.kind === 'slime' ? d.el : null;
      if (this.innate) this.aura[this.innate] = 1.2;
      this.shield = d.shieldHP ? d.shieldHP * refHP(this.lvl) * 0.5 : 0;
      this.shieldMax = this.shield;
      this.bossState = { atk: 0, t: 0, phase: 1 };
    }

    guardMult(src, el) {
      let m = 1;
      if (this.shield > 0) {
        if (COUNTER[this.d.el] === el) m *= 2.5; else m *= 0.55;
      }
      if (this.kind === 'brute' && src.kind === 'normal' && this.st !== 'slam' && this.st !== 'charge') {
        const a = Math.atan2(P.y - this.y, P.x - this.x);
        if (Math.abs(G.angDiff(this.dirAng, a)) < 1.3) { m *= 0.2; C.spark(this.x + Math.cos(a) * 8, this.y - 8, '#ffffff', 3, 40); if (!this._blockT || this._blockT < 0) { C.text(this.x, this.y - this.r - 16, 'Bloqué', '#cfd6e8', false, 0.5); this._blockT = 0.5; } }
      }
      return m;
    }

    takeHit(dmg, el, o) {
      if (this.dead) return;
      o = o || {};
      this.alert = true;
      this.barT = 5;
      G.lastTarget = this; G.lastTargetT = 6;
      if (this.shield > 0) {
        this.shield -= dmg;
        if (this.shield <= 0) {
          this.shield = 0; this.stun = 1.6; this.react = 0;
          C.text(this.x, this.y - this.r - 18, 'Bouclier brisé', '#ffe27a', true, 1.1);
          C.spark(this.x, this.y - 8, G.EL[this.d.el].light, 16, 100);
          if (G.Audio) G.Audio.sfx('boom');
        }
        this.hurtT = 0.08;
        return;
      }
      this.hp -= dmg;
      if (!o.noFlash) this.hurtT = 0.12;
      if (!this.boss) {
        this.vx += o.kx || 0; this.vy += o.ky || 0;
        if (!o.noStagger && this.kind !== 'brute') { this.stun = Math.max(this.stun, 0.22); if (this.st === 'wind') { this.st = 'chase'; this.tele = null; this.stT = 0; } }
      }
      if (this.hp <= 0) this.die();
    }

    die() {
      if (this.dead) return;
      this.dead = true;
      const d = this.d, S = G.state;
      C.spark(this.x, this.y - 6, d.el ? G.EL[d.el].light : '#ffffff', 16, 90);
      C.ring(this.x, this.y, 14, d.el ? G.EL[d.el].color : '#ffffff', 0.3);
      S.stats.kills++;
      G.addArExp(Math.round(d.exp / 5));
      G.state.bp.xp += Math.max(1, Math.round(d.exp / 10));
      const mora = G.irand(d.mora[0], d.mora[1]) * (1 + Math.floor(S.ar / 20) * 0.25);
      Entities.drop('mora', Math.round(mora), this.x, this.y);
      for (const [id, ch] of d.drops) {
        if (Math.random() < ch) Entities.drop(id, id === 'book3' || id === 'book2' ? Math.ceil(ch) : 1, this.x, this.y);
        else if (ch > 1) Entities.drop(id, Math.floor(ch), this.x, this.y);
      }
      if (this.boss) for (let i = 0; i < 30; i++) C.spark(this.x + G.rand(-20, 20), this.y - G.rand(0, 30), '#7af0c4', 3, 120);
      if (G.Quest) G.Quest.event('kill', { type: this.type, kind: this.kind, camp: this.camp, boss: this.boss });
      if (G.Audio) G.Audio.sfx(this.boss ? 'boom' : 'die');
      S.codex[this.type] = (S.codex[this.type] || 0) + 1;
      if (this.camp) Entities.campCheck(this.camp);
    }

    target() {
      let best = null, bd = this.d.sense + 40;
      for (const s of E.summons) {
        if (s.kind !== 'decoy') continue;
        const dd = Math.hypot(s.x - this.x, s.y - this.y);
        if (dd < bd) { bd = dd; best = { x: s.x, y: s.y, decoy: true }; }
      }
      return best || { x: P.x, y: P.y };
    }

    step(tx, ty, sp, dt) {
      const dx = tx - this.x, dy = ty - this.y, l = Math.hypot(dx, dy) || 1;
      const mx = (dx / l) * sp * dt, my = (dy / l) * sp * dt;
      const hb = Math.max(3, this.r * 0.55);
      const nx = this.x + mx, ny = this.y + my;
      if (!World.isWater(nx, ny)) {
        if (!World.blockedBox(nx, this.y, hb, hb)) this.x = nx;
        if (!World.blockedBox(this.x, ny, hb, hb)) this.y = ny;
      }
      if (Math.abs(dx) > 1) this.faceX = dx < 0 ? -1 : 1;
    }

    atkDmg(mult) { return refDmg(this.lvl) * this.d.atk * mult; }

    update(dt) {
      if (this.dead) return;
      this.anim += dt;
      if (this._blockT > 0) this._blockT -= dt;
      this.barT = Math.max(0, this.barT - dt);
      this.hurtT = Math.max(0, this.hurtT - dt);
      this.react = Math.max(0, this.react - dt);
      const dx0 = P.x - this.x, dy0 = P.y - this.y, pd = Math.hypot(dx0, dy0);
      if (pd > 700 && !this.alert) return; // dormant
      // statuts
      for (const k of ['pyro', 'hydro', 'cryo', 'electro']) {
        if (this.aura[k] > 0) {
          if (k === this.innate && this.react <= 0 && this.aura[k] < 1) this.aura[k] = Math.min(1.2, this.aura[k] + 0.3 * dt);
          else this.aura[k] = Math.max(0, this.aura[k] - 0.14 * dt);
        }
      }
      for (const k in this.icd) { this.icd[k].t -= dt; if (this.icd[k].t <= 0) delete this.icd[k]; }
      if (this.vuln) { this.vuln.t -= dt; if (this.vuln.t <= 0) this.vuln = null; }
      if (this.ec) {
        this.ec.t -= dt; this.ec.tick -= dt;
        if (this.ec.tick <= 0) {
          this.ec.tick = 1;
          C.flat(this, 'electro', 1.0, this.ec.cs, { noFlash: false });
          C.bolt(this.x - 8, this.y - 14, this.x + 8, this.y - 2, G.EL.electro.light, 0.15);
          this.aura.hydro = Math.max(0, this.aura.hydro - 0.25); this.aura.electro = Math.max(0, this.aura.electro - 0.25);
          for (const o of C.inRadius(this.x, this.y, 28)) if (o !== this && o.aura.hydro > 0.05) { C.flat(o, 'electro', 0.8, this.ec.cs); }
        }
        if (this.ec.t <= 0 || (this.aura.hydro <= 0.05 && this.aura.electro <= 0.05)) this.ec = null;
      }
      // déplacement dû aux impulsions
      if (this.vx || this.vy) {
        const hb = Math.max(3, this.r * 0.55);
        const nx = this.x + this.vx * dt, ny = this.y + this.vy * dt;
        if (!World.blockedBox(nx, this.y, hb, hb)) this.x = nx; else this.vx = 0;
        if (!World.blockedBox(this.x, ny, hb, hb)) this.y = ny; else this.vy = 0;
        const f = Math.pow(0.003, dt);
        this.vx *= f; this.vy *= f;
        if (Math.abs(this.vx) < 3) this.vx = 0; if (Math.abs(this.vy) < 3) this.vy = 0;
      }
      if (this.frozen > 0) { this.frozen -= dt; this.tele = null; return; }
      if (this.stun > 0) { this.stun -= dt; this.tele = null; if (this.st === 'wind') this.st = 'chase'; return; }
      this.cd = Math.max(0, this.cd - dt);
      this.stT += dt;
      const tg = this.target();
      const dx = tg.x - this.x, dy = tg.y - this.y, dist = Math.hypot(dx, dy), ang = Math.atan2(dy, dx);
      if (this.kind !== 'boss' || true) this.think(dt, tg, dist, ang, pd);
      // séparation entre ennemis
      for (const o of E.enemies) {
        if (o === this || o.dead) continue;
        const ox = this.x - o.x, oy = this.y - o.y, od = Math.hypot(ox, oy);
        const min = this.r + o.r - 2;
        if (od < min && od > 0.01 && !this.boss) { this.x += (ox / od) * 14 * dt; this.y += (oy / od) * 14 * dt; }
      }
    }

    set(st) { this.st = st; this.stT = 0; }

    hurtPlayerArc(mult, el, reach, arc, ang, o) {
      const dx = P.x - this.x, dy = P.y - this.y, d = Math.hypot(dx, dy);
      if (d > reach + 4) return false;
      const a = Math.atan2(dy, dx);
      if (Math.abs(G.angDiff(ang, a)) > arc / 2 && d > 8) return false;
      return C.hurtPlayer(this.atkDmg(mult), el || 'phys', this.x, this.y, o);
    }

    think(dt, tg, dist, ang, pd) {
      const d = this.d;
      const home = Math.hypot(this.x - this.hx, this.y - this.hy);
      const sees = dist < d.sense || this.alert;
      switch (this.kind) {
        case 'slime': return this.thinkSlime(dt, tg, dist, ang, sees, home);
        case 'melee': return this.thinkMelee(dt, tg, dist, ang, sees, home);
        case 'ranged': return this.thinkRanged(dt, tg, dist, ang, sees, home);
        case 'brute': return this.thinkBrute(dt, tg, dist, ang, sees, home);
        case 'mage': return this.thinkMage(dt, tg, dist, ang, sees, home);
        case 'boss': return this.thinkBoss(dt, tg, dist, ang, sees, home);
      }
    }

    wander(dt, sp) {
      this.wanderT -= dt;
      if (this.wanderT <= 0) { this.wanderT = G.rand(2, 4.5); const a = Math.random() * 6.28, r = Math.random() * 40; this.wx = this.hx + Math.cos(a) * r; this.wy = this.hy + Math.sin(a) * r; }
      if (Math.hypot(this.wx - this.x, this.wy - this.y) > 3) this.step(this.wx, this.wy, sp, dt);
    }

    thinkSlime(dt, tg, dist, ang, sees, home) {
      const d = this.d;
      if (this.st === 'idle') {
        this.frame = Math.floor(this.anim * 2) % 4 === 3 ? 1 : 0;
        this.wander(dt, 12);
        if (sees) this.set('chase');
      } else if (this.st === 'chase') {
        if (!sees && home > 20) { this.set('idle'); return; }
        this.hopT += dt;
        const cyc = 0.85, ph = this.hopT % cyc;
        this.frame = ph < 0.45 ? 0 : ph < 0.55 ? 1 : ph < 0.8 ? 2 : 3;
        if (ph >= 0.5 && ph < 0.8) this.step(tg.x, tg.y, d.spd * 2.4, dt);
        if (dist < (d.big ? 24 : 17) && this.cd <= 0) { this.set('wind'); this.lockAng = ang; this.tele = { type: 'circle', x: this.x + Math.cos(ang) * 8, y: this.y + Math.sin(ang) * 8, r: d.big ? 20 : 13 }; }
        if (home > 320) { this.alert = false; this.set('idle'); }
      } else if (this.st === 'wind') {
        this.frame = 1;
        if (this.stT > 0.45) { this.set('lunge'); this.tele = null; this.hit = false; }
      } else if (this.st === 'lunge') {
        this.frame = 2;
        this.step(this.x + Math.cos(this.lockAng) * 20, this.y + Math.sin(this.lockAng) * 20, 130, dt);
        if (!this.hit && Math.hypot(P.x - this.x, P.y - this.y) < d.r + 6) { this.hit = C.hurtPlayer(this.atkDmg(1), d.el, this.x, this.y, { ground: true }); }
        if (this.stT > 0.25) { this.cd = 1.4; this.set('chase'); }
      }
    }

    thinkMelee(dt, tg, dist, ang, sees, home) {
      const d = this.d;
      if (this.st === 'idle') {
        this.wander(dt, 14);
        if (sees) { this.set('chase'); }
      } else if (this.st === 'chase') {
        if (!sees && home > 20) { this.set('idle'); return; }
        if (d.rush && dist > 40 && dist < 110 && this.cd <= 0) { this.lockAng = ang; this.set('rushwind'); this.tele = { type: 'line', x: this.x, y: this.y, ang, len: 70, w: 10 }; return; }
        if (dist > 18) this.step(tg.x, tg.y, d.spd, dt);
        else if (this.cd <= 0) { this.lockAng = ang; this.set('wind'); this.tele = { type: 'cone', x: this.x, y: this.y, ang, r: 26, arc: 1.7 }; }
        if (home > 320) { this.alert = false; this.set('idle'); }
        this.dirAng = ang;
      } else if (this.st === 'wind') {
        if (this.stT > 0.55) {
          this.tele = null;
          this.hurtPlayerArc(1, 'phys', 26, 1.7, this.lockAng, { ground: false });
          C.slash(this.x + Math.cos(this.lockAng) * 6, this.y - 8, this.lockAng, 24, 1.7, '#ffd9a0', 0.15);
          this.cd = 1.1; this.set('recover');
        }
      } else if (this.st === 'rushwind') {
        if (this.stT > 0.45) { this.tele = null; this.set('rush'); this.hit = false; }
      } else if (this.st === 'rush') {
        this.step(this.x + Math.cos(this.lockAng) * 20, this.y + Math.sin(this.lockAng) * 20, 150, dt);
        if (!this.hit && Math.hypot(P.x - this.x, P.y - this.y) < 12) this.hit = C.hurtPlayer(this.atkDmg(1.1), 'phys', this.x, this.y, { ground: false });
        if (this.stT > 0.35) { this.cd = 2; this.set('recover'); }
      } else if (this.st === 'recover') {
        if (this.stT > 0.5) this.set('chase');
      }
    }

    thinkRanged(dt, tg, dist, ang, sees, home) {
      const d = this.d;
      this.faceX = tg.x < this.x ? -1 : 1;
      if (this.st === 'idle') { this.wander(dt, 12); if (sees) this.set('chase'); }
      else if (this.st === 'chase') {
        if (!sees && home > 20) { this.set('idle'); return; }
        if (dist > d.range * 0.85) this.step(tg.x, tg.y, d.spd, dt);
        else if (dist < 55) this.step(this.x - Math.cos(ang) * 20, this.y - Math.sin(ang) * 20, d.spd * 0.9, dt);
        if (dist < d.range && this.cd <= 0) { this.lockAng = ang; this.set('wind'); this.tele = { type: 'line', x: this.x, y: this.y - 6, ang, len: Math.min(dist + 20, d.range), w: 3 }; }
      } else if (this.st === 'wind') {
        this.lockAng = ang; if (this.tele) this.tele.ang = ang;
        if (this.stT > 0.65) {
          this.tele = null;
          E.proj.push({ from: 'e', kind: 'arrow', x: this.x, y: this.y - 10, vx: Math.cos(this.lockAng) * 150, vy: Math.sin(this.lockAng) * 150, r: 3, life: 1.6, dmg: this.atkDmg(1), el: 'phys', color: '#ffd9a0', ang: this.lockAng });
          if (G.Audio) G.Audio.sfx('shot');
          this.cd = 2.1; this.set('chase');
        }
      }
    }

    thinkBrute(dt, tg, dist, ang, sees, home) {
      const d = this.d;
      if (this.st === 'idle') { this.wander(dt, 10); if (sees) this.set('chase'); }
      else if (this.st === 'chase') {
        if (!sees && home > 20) { this.set('idle'); return; }
        this.dirAng = ang;
        if (dist > 30) this.step(tg.x, tg.y, d.spd, dt);
        if (this.cd <= 0) {
          if (dist < 40) { this.lockAng = ang; this.set('slam'); this.tele = { type: 'circle', x: this.x + Math.cos(ang) * 16, y: this.y + Math.sin(ang) * 16, r: 30 }; }
          else if (dist < 130 && Math.random() < 0.5) { this.lockAng = ang; this.set('chargewind'); this.tele = { type: 'line', x: this.x, y: this.y, ang, len: 100, w: 14 }; }
        }
      } else if (this.st === 'slam') {
        if (this.stT > 0.9) {
          const tx = this.tele.x, ty = this.tele.y; this.tele = null;
          C.ring(tx, ty, 30, '#c9b88a', 0.35, 4); C.spark(tx, ty, '#c9b88a', 14, 100); G.shake = Math.max(G.shake || 0, 4);
          if (Math.hypot(P.x - tx, P.y - ty) < 32) C.hurtPlayer(this.atkDmg(1.2), 'phys', tx, ty, { ground: true, knock: 110 });
          if (G.Audio) G.Audio.sfx('boom');
          this.cd = 2.2; this.set('recover');
        }
      } else if (this.st === 'chargewind') {
        if (this.stT > 0.6) { this.tele = null; this.set('charge'); this.hit = false; }
      } else if (this.st === 'charge') {
        this.step(this.x + Math.cos(this.lockAng) * 20, this.y + Math.sin(this.lockAng) * 20, 125, dt);
        if (!this.hit && Math.hypot(P.x - this.x, P.y - this.y) < 16) this.hit = C.hurtPlayer(this.atkDmg(1.1), 'phys', this.x, this.y, { ground: false, knock: 90 });
        if (this.stT > 0.55) { this.cd = 2.6; this.set('recover'); }
      } else if (this.st === 'recover') { if (this.stT > 0.7) this.set('chase'); }
    }

    thinkMage(dt, tg, dist, ang, sees, home) {
      const d = this.d;
      this.faceX = tg.x < this.x ? -1 : 1;
      if (this.st === 'idle') { this.wander(dt, 12); if (sees) this.set('chase'); }
      else if (this.st === 'chase') {
        if (!sees && home > 20) { this.set('idle'); return; }
        if (dist > d.range * 0.8) this.step(tg.x, tg.y, d.spd, dt);
        else if (dist < 70) this.step(this.x - Math.cos(ang) * 20, this.y - Math.sin(ang) * 20, d.spd, dt);
        if (dist < 36 && this.cd <= 0.5 && !this.tpCd) { // téléportation
          const a = Math.random() * 6.28;
          const nx = this.x + Math.cos(a) * 70, ny = this.y + Math.sin(a) * 70;
          if (!World.blockedBox(nx, ny, 5, 5) && !World.isWater(nx, ny)) { C.spark(this.x, this.y - 10, G.EL[d.el].color, 10, 60); this.x = nx; this.y = ny; C.spark(this.x, this.y - 10, G.EL[d.el].color, 10, 60); this.tpCd = 6; }
        }
        if (this.tpCd) { this.tpCd -= dt; if (this.tpCd <= 0) this.tpCd = 0; }
        if (dist < d.range && this.cd <= 0) { this.set('wind'); this.lockAng = ang; }
      } else if (this.st === 'wind') {
        if (this.stT > 0.8) {
          const n = 3;
          for (let i = 0; i < n; i++) { const a = ang + (i - 1) * 0.25; E.proj.push({ from: 'e', kind: 'eorb', x: this.x, y: this.y - 12, vx: Math.cos(a) * 80, vy: Math.sin(a) * 80, r: 4, life: 3, dmg: this.atkDmg(0.9), el: d.el, color: G.EL[d.el].color, ang: a, t: 0 }); }
          if (G.Audio) G.Audio.sfx('skill');
          this.cd = 3; this.set('chase');
        }
      }
    }

    thinkBoss(dt, tg, dist, ang, sees, home) {
      const b = this.bossState, d = this.d;
      this.faceX = tg.x < this.x ? -1 : 1;
      b.phase = this.hp < this.maxhp * 0.4 ? 2 : 1;
      const rate = b.phase === 2 ? 0.7 : 1;
      if (this.st === 'idle') {
        if (dist < 260) { this.alert = true; this.set('float'); G.bossFight = this; G.banner(d.name, 'Boss', 'boss'); }
        return;
      }
      if (this.st === 'float') {
        if (dist > 70) this.step(tg.x, tg.y, d.spd, dt);
        if (this.stT > 1.4 * rate) {
          const pick = (b.atk++) % 4;
          this.set(['spin', 'slams', 'summon', 'dive'][pick]);
          b.n = 0; b.t = 0;
        }
      } else if (this.st === 'spin') { // vague de lames de vent rotatives
        b.t -= dt;
        if (b.t <= 0) {
          b.t = 0.12 * rate;
          const n = b.n++;
          for (let k = 0; k < 3; k++) { const a = n * 0.45 + (k * Math.PI * 2) / 3; E.proj.push({ from: 'e', kind: 'wind', x: this.x, y: this.y - 14, vx: Math.cos(a) * 95, vy: Math.sin(a) * 95, r: 4, life: 3.2, dmg: this.atkDmg(0.45), el: 'anemo', color: '#7af0c4', ang: a, t: 0 }); }
          if (G.Audio && n % 3 === 0) G.Audio.sfx('skill');
        }
        if (this.stT > 3.2 * (b.phase === 2 ? 1.2 : 1)) this.set('float');
      } else if (this.st === 'slams') { // frappes au sol télégraphiées
        b.t -= dt;
        if (b.t <= 0 && b.n < (b.phase === 2 ? 5 : 3)) {
          b.t = 0.95 * rate; b.n++;
          const sx = P.x + G.rand(-10, 10), sy = P.y + G.rand(-6, 6);
          const z = { x: sx, y: sy, t: 0 };
          (b.slams = b.slams || []).push(z);
        }
        if (b.slams) for (let i = b.slams.length - 1; i >= 0; i--) {
          const z = b.slams[i]; z.t += dt;
          this.tele = { type: 'multi', list: b.slams, r: 26 };
          if (z.t > 0.9) {
            C.ring(z.x, z.y, 26, '#7af0c4', 0.3, 4); C.spark(z.x, z.y, '#bdf7e2', 12, 90); G.shake = Math.max(G.shake || 0, 3);
            if (Math.hypot(P.x - z.x, P.y - z.y) < 27) C.hurtPlayer(this.atkDmg(1), 'anemo', z.x, z.y, { ground: true, knock: 90 });
            b.slams.splice(i, 1);
          }
        }
        if (b.n >= (b.phase === 2 ? 5 : 3) && (!b.slams || !b.slams.length)) { this.tele = null; this.set('float'); }
      } else if (this.st === 'summon') { // tornade attirante + gelées anémo
        if (this.stT < 0.1 && !b.sumDone) {
          b.sumDone = true;
          E.zones.push({ kind: 'bosswind', x: P.x + 30, y: P.y, r: 44, t: 0, dur: 4, tick: 0.5, tickT: 0, mult: 0, el: 'anemo', cs: G.cs(), pull: 0, boss: this });
          for (let i = 0; i < 2; i++) { const a = Math.random() * 6.28; const e = new Enemy('slime_anemo', this.x + Math.cos(a) * 50, this.y + Math.sin(a) * 40, null); e.alert = true; e.lvl = this.lvl; e.maxhp = Math.round(refHP(this.lvl) * 1.2); e.hp = e.maxhp; E.enemies.push(e); }
        }
        if (this.stT > 4) { b.sumDone = false; this.set('float'); }
      } else if (this.st === 'dive') { // charge dans l'arène
        if (this.stT < 0.8) { this.tele = { type: 'line', x: this.x, y: this.y, ang: Math.atan2(P.y - this.y, P.x - this.x), len: 220, w: 18 }; this.lockAng = Math.atan2(P.y - this.y, P.x - this.x); }
        else if (this.stT < 1.5) { this.tele = null; this.step(this.x + Math.cos(this.lockAng) * 20, this.y + Math.sin(this.lockAng) * 20, 190, dt); if (Math.hypot(P.x - this.x, P.y - this.y) < 22) { if (C.hurtPlayer(this.atkDmg(1.2), 'anemo', this.x, this.y, { knock: 130 })) this.stT = 1.5; } }
        else if (this.stT > 2.2) this.set('float');
      }
    }
  }
  Entities.Enemy = Enemy;

  // Vent de la tornade du boss (attire le joueur)
  const _czUpdate = C.update;
  C.update = function (dt) {
    _czUpdate(dt);
    for (const z of E.zones) {
      if (z.kind !== 'bosswind') continue;
      const dx = z.x - P.x, dy = z.y - P.y, d = Math.hypot(dx, dy);
      if (d < z.r && d > 3) G.World.move(P, (dx / d) * 30 * dt, (dy / d) * 30 * dt, 4, 4);
      z.tickT -= dt;
      if (z.tickT <= 0 && d < z.r * 0.6) { z.tickT = 0.5; C.hurtPlayer(refDmg(z.boss.lvl) * z.boss.d.atk * 0.3, 'anemo', z.x, z.y, { knock: 20 }); }
    }
  };

  // =====================================================================
  //  PNJ
  // =====================================================================
  class NPC {
    constructor(def) {
      Object.assign(this, def);
      this.hx = this.x; this.hy = this.y; this.dir = def.dir || 'd'; this.anim = Math.random() * 5; this.wanderT = G.rand(1, 4); this.wx = this.x; this.wy = this.y; this.moving = false;
      this.r = 5;
    }
    update(dt) {
      this.anim += dt;
      if (this.still) return;
      this.wanderT -= dt;
      const near = Math.hypot(P.x - this.x, P.y - this.y) < 32;
      if (near) { const a = Math.atan2(P.y - this.y, P.x - this.x); this.dir = G.dirOf(a); this.moving = false; return; }
      if (this.wanderT <= 0) {
        this.wanderT = G.rand(2, 5);
        if (Math.random() < 0.6) { const a = Math.random() * 6.28, r = Math.random() * 22; this.wx = this.hx + Math.cos(a) * r; this.wy = this.hy + Math.sin(a) * r; } else { this.wx = this.x; this.wy = this.y; }
      }
      const dx = this.wx - this.x, dy = this.wy - this.y, l = Math.hypot(dx, dy);
      this.moving = l > 2;
      if (this.moving) {
        World.move(this, (dx / l) * 18 * dt, (dy / l) * 18 * dt, 4, 4);
        this.dir = G.dirOf(Math.atan2(dy, dx));
      }
    }
    sprite() {
      const f = this.moving ? [1, 0, 2, 0][Math.floor(this.anim * 5) % 4] : 0;
      return G.S.lookFrame(this.id, this.look, this.dir, f);
    }
  }
  Entities.NPC = NPC;

  function randomLook(seed) {
    const r = G.rng(seed);
    const hairs = ['#3a2a22', '#7a4a2a', '#d9b44a', '#a8a8b8', '#c8603a', '#5a3a2a', '#2a2a3a'];
    const outs = ['#6a8ad0', '#c8683a', '#7ab060', '#d0a040', '#a070c0', '#e0e0d8', '#c05050'];
    const h = hairs[Math.floor(r() * hairs.length)], o = outs[Math.floor(r() * outs.length)];
    return { hair: h, hairD: G.shade(h, -0.3), eye: '#4a3a2a', outfit: o, outfitD: G.shade(o, -0.25), accent: G.shade(o, 0.35), legs: '#4a3a30', shoes: '#3a2a20', style: ['short', 'bob', 'pony', 'long', 'spiky'][Math.floor(r() * 5)], head: 'none', cape: null };
  }
  Entities.randomLook = randomLook;

  // =====================================================================
  //  Objets ramassables
  // =====================================================================
  Entities.drop = function (id, n, x, y) {
    if (id === 'mora') {
      const coins = Math.min(5, Math.max(1, Math.round(n / 40)));
      for (let i = 0; i < coins; i++) E.pickups.push({ kind: 'item', item: 'mora', n: Math.ceil(n / coins), x, y, z: 5, vx: G.rand(-40, 40), vy: G.rand(-40, 30), t: 0, life: 40, bounce: 0 });
    } else E.pickups.push({ kind: 'item', item: id, n, x, y, z: 5, vx: G.rand(-40, 40), vy: G.rand(-40, 30), t: 0, life: 60, bounce: 0 });
  };

  function updatePickups(dt) {
    for (let i = E.pickups.length - 1; i >= 0; i--) {
      const p = E.pickups[i];
      p.t += dt; p.life -= dt;
      const dx = P.x - p.x, dy = (P.y - 8) - p.y, d = Math.hypot(dx, dy);
      if (p.kind === 'energy') {
        if (p.t > 0.5 || d < 50) {
          const sp = 90 + Math.min(200, p.t * 120);
          if (d > 0.1) { p.vx = G.lerp(p.vx, (dx / d) * sp, 0.12); p.vy = G.lerp(p.vy, (dy / d) * sp, 0.12); }
        } else { p.vx *= 0.96; p.vy *= 0.96; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (d < 8 && p.t > 0.3) { G.giveEnergy(p.amount, p.el); E.pickups.splice(i, 1); continue; }
      } else {
        // pièce / objet
        if (p.z > 0 || Math.abs(p.vx) + Math.abs(p.vy) > 1) {
          p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.92; p.vy *= 0.92;
          p.zv = (p.zv == null ? 50 : p.zv) - 240 * dt; p.z += p.zv * dt;
          if (p.z <= 0) { p.z = 0; p.zv = p.bounce < 1 ? 25 : 0; p.bounce++; }
        }
        if (d < 28 && p.t > 0.35) { p.x += (dx / (d || 1)) * 120 * dt; p.y += (dy / (d || 1)) * 120 * dt; }
        if (d < 8 && p.t > 0.35) {
          G.gain(p.item, p.n);
          if (G.Audio) G.Audio.sfx(p.item === 'mora' ? 'mora' : 'pickup');
          E.pickups.splice(i, 1); continue;
        }
      }
      if (p.life <= 0) E.pickups.splice(i, 1);
    }
  }

  // Coffres
  Entities.openChest = function (c) {
    const S = G.state;
    S.opened[c.id] = true; S.stats.chests++;
    const tier = c.tier;
    const mora = [G.irand(180, 360), G.irand(500, 800), G.irand(1200, 1800), G.irand(2500, 3500)][tier] * (1 + Math.floor(S.ar / 20) * 0.3);
    Entities.drop('mora', Math.round(mora), c.x, c.y - 4);
    const loot = [
      [['book1', 1, 0.8], ['apple', 1, 0.5]],
      [['book2', 1, 0.8], ['book1', 2, 1], ['primo', 5, 1], ['bread', 1, 0.5]],
      [['book3', 1, 0.5], ['book2', 2, 1], ['primo', 20, 1], ['meal', 1, 0.6]],
      [['book3', 2, 1], ['primo', 40, 1], ['fate', 1, 1], ['meal', 2, 1]],
    ][tier];
    loot.forEach(([id, n, ch]) => { if (Math.random() < ch) Entities.drop(id, n, c.x, c.y - 4); });
    G.addArExp([10, 25, 50, 100][tier]);
    G.state.bp.xp += [4, 8, 14, 30][tier];
    C.spark(c.x, c.y - 8, ['#f0d070', '#9ab6ff', '#ffe27a', '#d9a0ff'][tier], 18, 80);
    C.ring(c.x, c.y, 18, '#ffe27a', 0.4);
    if (G.Audio) G.Audio.sfx('chest');
    if (G.Quest) G.Quest.event('chest', { tier });
  };

  // =====================================================================
  //  Camps / apparitions
  // =====================================================================
  function randomSpot(camp, tries) {
    for (let k = 0; k < (tries || 30); k++) {
      const a = Math.random() * 6.28, r = Math.sqrt(Math.random()) * camp.r * 0.6;
      const x = camp.x + Math.cos(a) * r, y = camp.y + Math.sin(a) * r;
      if (!World.blockedBox(x, y, 6, 6) && !World.isWater(x, y)) return { x, y };
    }
    return { x: camp.x, y: camp.y };
  }
  Entities.spawnCamp = function (camp) {
    camp.alive = 0;
    camp.spawns.forEach(([type, n]) => {
      for (let i = 0; i < n; i++) {
        const p = randomSpot(camp);
        const e = new Enemy(type, p.x, p.y, camp.id);
        E.enemies.push(e);
        camp.alive++;
      }
    });
    camp.respT = 0;
  };
  Entities.campCheck = function (id) {
    const camp = World.camps.find((c) => c.id === id);
    if (!camp) return;
    camp.alive--;
    if (camp.alive <= 0) {
      camp.cleared = true; camp.respT = camp.respawn;
      if (id === 'camp' || id === 'mita') {
        G.state.camps[id + '_clear'] = true;
        G.toast('Campement éliminé : le coffre est déverrouillé !');
        if (G.Quest) G.Quest.event('camp', { id });
      }
    }
  };

  Entities.initWorld = function () {
    const S = G.state;
    C.reset();
    World.camps.forEach((c) => { c.cleared = false; Entities.spawnCamp(c); });
    // PNJ
    G.Story.npcDefs().forEach((def) => E.npcs.push(new NPC(def)));
    // villageois
    const spots = [[135, 48], [143, 46], [128, 40], [150, 40], [139, 28], [132, 30], [146, 32], [130, 52], [122, 36], [158, 36], [138, 20]];
    spots.forEach(([tx, ty], i) => {
      E.npcs.push(new NPC({ id: 'v' + i, name: ['Habitante', 'Marchand', 'Garde de la ville', 'Enfant', 'Voyageur', 'Boulanger', 'Fleuriste', 'Barde'][i % 8], role: 'villager', x: tx * TS + 8, y: ty * TS + 8, look: randomLook(900 + i), lineIdx: i }));
    });
    // séelies
    World.seelies.forEach((s) => {
      s.x = s.start.x; s.y = s.start.y; s.pi = 0; s.done = !!S.seelies[s.id]; s.follow = false; s.anim = Math.random() * 6; s.rewarded = s.done;
    });
    World.collectibles.forEach((c) => { if (S.taken[c.id] === undefined) S.taken[c.id] = 0; });
    G.Domain.reset();
  };

  // =====================================================================
  //  Séelies : suivez l'esprit jusqu'à sa cour
  // =====================================================================
  function updateSeelies(dt) {
    for (const s of World.seelies) {
      if (s.done) continue;
      s.anim += dt;
      const d = Math.hypot(P.x - s.x, P.y - s.y);
      const tgt = s.pi < s.path.length ? s.path[s.pi] : s.court;
      if (d < 70) {
        if (!s.started) { s.started = true; G.toast('Suivez la Séelie jusqu’à sa cour !'); }
        const dx = tgt.x - s.x, dy = tgt.y - s.y, l = Math.hypot(dx, dy);
        if (l > 3) { s.x += (dx / l) * 42 * dt; s.y += (dy / l) * 42 * dt; } else if (s.pi < s.path.length) s.pi++;
      }
      if (s.pi >= s.path.length) {
        // arrivée : la cour s'active quand le joueur s'en approche
        if (Math.hypot(P.x - s.court.x, P.y - s.court.y) < 16) {
          s.done = true; G.state.seelies[s.id] = true;
          G.banner('Cour des Séelies', 'Récompense obtenue !', 'unlock');
          Entities.openChest({ id: 'seelie_' + s.id, x: s.court.x, y: s.court.y, tier: 2 });
          C.spark(s.court.x, s.court.y - 10, '#d2c8ff', 30, 120);
        }
      }
      if (Math.random() < dt * 8) E.fx.push({ type: 'dot', x: s.x + G.rand(-4, 4), y: s.y - 4, vx: G.rand(-8, 8), vy: G.rand(-10, 4), color: '#d2c8ff', life: 0.6, t: 0, sz: 1, g: 0 });
    }
  }

  // =====================================================================
  //  Domaine (arène du boss)
  // =====================================================================
  const Domain = (G.Domain = { active: false, exit: { x: 0, y: 0 }, boss: null });
  Domain.reset = function () { Domain.active = false; Domain.boss = null; Domain.exit = { x: 179 * TS + 8, y: 117 * TS }; G.bossFight = null; };
  Domain.enter = function () {
    const S = G.state;
    G.fade = { t: 0, dir: 1, cb: () => {
      Domain.active = true;
      P.x = 179 * TS + 8; P.y = 115 * TS;
      G.cam.x = P.x; G.cam.y = P.y;
      if (!Domain.boss || Domain.boss.dead) {
        for (let i = E.enemies.length - 1; i >= 0; i--) if (E.enemies[i].boss) E.enemies.splice(i, 1);
        const b = new Enemy('hypostasis', 179 * TS + 8, 100 * TS, 'boss');
        b.alert = false; E.enemies.push(b); Domain.boss = b;
      }
      G.banner('Domaine : Tempête de pierre', 'Affrontez l’Hypostase Anémo', 'boss');
    } };
  };
  Domain.leave = function () {
    G.fade = { t: 0, dir: 1, cb: () => {
      Domain.active = false;
      P.x = 179 * TS + 8; P.y = 131 * TS;
      G.cam.x = P.x; G.cam.y = P.y;
      G.bossFight = null;
    } };
  };

  // =====================================================================
  //  Ambiance : papillons, oiseaux
  // =====================================================================
  function updateAmbient(dt, camX, camY, vw, vh) {
    const A = E.ambient;
    if (A.length < 9 && Math.random() < dt * 2) {
      const x = camX + G.rand(-60, vw + 60), y = camY + G.rand(-40, vh + 40);
      const tt = World.tileAt(Math.floor(x / TS), Math.floor(y / TS));
      if (tt === G.S.T.GRASS || tt === G.S.T.FOREST) A.push({ kind: 'bf', x, y, a: Math.random() * 6.28, t: 0, col: G.pick(['#ffffff', '#f7a6c4', '#ffe27a', '#8fc8ff']), life: G.rand(10, 25) });
    }
    for (let i = A.length - 1; i >= 0; i--) {
      const b = A[i];
      b.t += dt; b.life -= dt;
      b.a += G.rand(-4, 4) * dt;
      b.x += Math.cos(b.a) * 14 * dt; b.y += Math.sin(b.a) * 9 * dt;
      if (b.life <= 0 || b.x < camX - 140 || b.x > camX + vw + 140 || b.y < camY - 100 || b.y > camY + vh + 100) A.splice(i, 1);
    }
  }

  // =====================================================================
  //  Mise à jour globale
  // =====================================================================
  Entities.update = function (dt, cam, vw, vh) {
    const S = G.state;
    for (const e of E.enemies) e.update(dt);
    for (let i = E.enemies.length - 1; i >= 0; i--) if (E.enemies[i].dead) E.enemies.splice(i, 1);
    for (const n of E.npcs) n.update(dt);
    updatePickups(dt);
    updateSeelies(dt);
    updateAmbient(dt, cam.x - vw / 2, cam.y - vh / 2, vw, vh);
    // anémoculi (au contact)
    for (const c of World.collectibles) {
      if (c.kind !== 'anemo' || (S.taken[c.id] && S.taken[c.id] > S.t)) continue;
      if (Math.hypot(c.x - P.x, c.y - 6 - P.y) < 14) {
        S.taken[c.id] = S.t + 1e9; G.gain('anemoculus', 1); S.stats.anemo++;
        G.addArExp(10);
        C.spark(c.x, c.y, '#7af0c4', 14, 70); C.ring(c.x, c.y, 14, '#7af0c4', 0.4);
        if (G.Audio) G.Audio.sfx('anemo');
        if (G.Quest) G.Quest.event('collect', { id: 'anemoculus', n: 1 });
      }
    }
    // réapparition des camps
    for (const camp of World.camps) {
      if (camp.cleared && camp.respT > 0) {
        camp.respT -= dt;
        if (camp.respT <= 0 && Math.hypot(P.x - camp.x, P.y - camp.y) > 420) {
          camp.cleared = false; Entities.spawnCamp(camp);
          if (camp.id === 'camp' || camp.id === 'mita') S.camps[camp.id + '_clear'] = false;
          // les coffres de camp se verrouillent à nouveau mais restent ouverts
        } else if (camp.respT <= 0) camp.respT = 5;
      }
    }
    // coffres de camp : accessibles seulement une fois nettoyés
    if (G.lastTargetT > 0) G.lastTargetT -= dt;
  };

  // =====================================================================
  //  Rendu
  // =====================================================================
  const sprCache = {};
  function enemySprite(e) {
    const d = e.d, f = e.frame | 0;
    let key, mk;
    switch (e.kind) {
      case 'slime': key = 'sl' + d.el + f + (d.big ? 'b' : ''); mk = () => G.S.slime(d.el, f, d.big); break;
      case 'melee': key = 'hm' + e.type + (Math.floor(e.anim * 5) % 2); mk = () => G.S.hilichurl(d.rush ? 'fighter' : 'x', 'd', Math.floor(e.anim * 5) % 2); break;
      case 'ranged': key = 'ha' + (Math.floor(e.anim * 4) % 2); mk = () => G.S.hilichurl('archer', 'd', Math.floor(e.anim * 4) % 2); break;
      case 'brute': key = 'mi' + (Math.floor(e.anim * 3) % 2); mk = () => G.S.mitachurl(Math.floor(e.anim * 3) % 2); break;
      case 'mage': key = 'mg' + d.el + (Math.floor(e.anim * 3) % 3); mk = () => G.S.mage(d.el, Math.floor(e.anim * 3) % 3); break;
      case 'boss': key = 'bs' + (Math.floor(e.anim * 8) % 64); mk = () => G.S.hypostasis(Math.floor(e.anim * 8) % 64); break;
    }
    const flip = e.faceX < 0 && e.kind !== 'slime' ? 'f' : '';
    const k2 = key + flip;
    if (sprCache[k2]) return sprCache[k2];
    let s = mk();
    if (flip) s = G.flipX(s);
    // limite du cache pour le boss animé
    if (e.kind === 'boss' && Object.keys(sprCache).length > 400) for (const k in sprCache) if (k.startsWith('bs')) delete sprCache[k];
    return (sprCache[k2] = s);
  }

  function drawEnemy(ctx, e, camX, camY, t) {
    const x = Math.round(e.x - camX), y = Math.round(e.y - camY);
    let spr = enemySprite(e);
    const ox = Math.round(spr.width / 2);
    let oy;
    switch (e.kind) { case 'slime': oy = spr.height - 2; break; case 'boss': oy = spr.height - 6; break; default: oy = spr.height - 2; }
    let lift = 0;
    if (e.kind === 'mage') lift = 6 + Math.round(Math.sin(e.anim * 3) * 2);
    if (e.kind === 'boss') lift = 16 + Math.round(Math.sin(e.anim * 2) * 3);
    ctx.fillStyle = 'rgba(30,40,60,0.3)'; C.S_ell(ctx, x, y, Math.max(5, e.r - (lift ? 2 : 0)), Math.max(2, e.r / 3));
    if (e.st === 'lunge' || e.st === 'rush' || e.st === 'charge') lift = 0;
    if (e.frozen > 0) { ctx.drawImage(G.tint(spr, '#a8f0ff'), x - ox, y - oy - lift); ctx.globalAlpha = 0.6; px(ctx, x - e.r, y - e.r * 2, e.r * 2, e.r * 2, '#cdf6ff'); ctx.globalAlpha = 1; }
    else {
      ctx.drawImage(spr, x - ox, y - oy - lift);
      if (e.hurtT > 0) { ctx.globalAlpha = 0.7; ctx.drawImage(G.tint(spr, '#ffffff'), x - ox, y - oy - lift); ctx.globalAlpha = 1; }
      else if (e.st === 'wind' || e.st === 'rushwind' || e.st === 'chargewind') { if (Math.floor(t * 14) % 2) { ctx.globalAlpha = 0.5; ctx.drawImage(G.tint(spr, '#ff6a6a'), x - ox, y - oy - lift); ctx.globalAlpha = 1; } }
    }
    // bouclier élémentaire des mages
    if (e.shield > 0) {
      const col = G.EL[e.d.el];
      ctx.globalAlpha = 0.35; ctx.fillStyle = col.color; C.S_ell(ctx, x, y - 10 - lift, 10, 12); ctx.globalAlpha = 0.9; C.pxRing(ctx, x, y - 10 - lift, 10, 12, col.light); ctx.globalAlpha = 1;
    }
    // barre de vie + aura
    if ((e.barT > 0 || e.boss) && !e.boss) {
      const w = Math.max(14, Math.round(e.r * 2.6));
      const by = y - oy - lift - 5;
      px(ctx, x - w / 2 - 1, by - 1, w + 2, 4, '#1a1a2a');
      px(ctx, x - w / 2, by, w, 2, '#4a2a2a');
      px(ctx, x - w / 2, by, Math.max(1, Math.round((w * e.hp) / e.maxhp)), 2, '#e8553a');
      if (e.shield > 0) px(ctx, x - w / 2, by + 3, Math.max(1, Math.round((w * e.shield) / e.shieldMax)), 1, G.EL[e.d.el].color);
      let ax = x - w / 2;
      for (const k of ['pyro', 'hydro', 'cryo', 'electro']) if (e.aura[k] > 0.05) { px(ctx, ax, by - 4, 3, 3, G.EL[k].dark); px(ctx, ax, by - 4, 2, 2, G.EL[k].color); ax += 4; }
    } else if (e.boss) {
      let ax = x - 10;
      for (const k of ['pyro', 'hydro', 'cryo', 'electro']) if (e.aura[k] > 0.05) { px(ctx, ax, y - oy - lift - 8, 4, 4, G.EL[k].color); ax += 5; }
    }
    // état : électrocution
    if (e.ec) { if (Math.floor(t * 10) % 2) C.pxLine(ctx, x - 5, y - e.r * 2 - lift, x + 5, y - 3 - lift, G.EL.electro.light); }
  }

  function drawTele(ctx, tl, camX, camY, t) {
    if (!tl) return;
    const a = 0.28 + 0.12 * Math.sin(t * 20);
    ctx.globalAlpha = a; ctx.fillStyle = '#ff4a4a';
    const dither = (x0, y0, w, h) => { for (let yy = 0; yy < h; yy++) for (let xx = (yy & 1); xx < w; xx += 2) ctx.fillRect(x0 + xx, y0 + yy, 1, 1); };
    if (tl.type === 'circle') { C.S_ell(ctx, tl.x - camX, tl.y - camY, tl.r, tl.r * 0.72); ctx.globalAlpha = 0.9; C.pxRing(ctx, tl.x - camX, tl.y - camY, tl.r, tl.r * 0.72, '#ff7a7a'); }
    else if (tl.type === 'multi') { for (const z of tl.list) { ctx.globalAlpha = 0.25 + 0.2 * (z.t / 0.9); ctx.fillStyle = '#7af0c4'; C.S_ell(ctx, z.x - camX, z.y - camY, tl.r, tl.r * 0.72); ctx.globalAlpha = 0.9; C.pxRing(ctx, z.x - camX, z.y - camY, tl.r * Math.min(1, z.t / 0.9), tl.r * 0.72 * Math.min(1, z.t / 0.9), '#bdf7e2'); } }
    else if (tl.type === 'line') {
      const c = Math.cos(tl.ang), s = Math.sin(tl.ang);
      for (let i = 0; i < tl.len; i += 2) for (let k = -tl.w / 2; k <= tl.w / 2; k += 2) ctx.fillRect(Math.round(tl.x + c * i - s * k - camX), Math.round(tl.y + s * i * 0.8 + c * k * 0.8 - camY), 2, 2);
    } else if (tl.type === 'cone') {
      for (let i = 4; i < tl.r; i += 2) for (let k = -tl.arc / 2; k <= tl.arc / 2; k += 2 / i) ctx.fillRect(Math.round(tl.x + Math.cos(tl.ang + k) * i - camX), Math.round(tl.y + Math.sin(tl.ang + k) * i * 0.8 - camY), 2, 2);
    }
    ctx.globalAlpha = 1;
  }

  const collSpr = {};
  function collectSprite(kind, t) {
    const key = kind + (kind === 'anemo' ? Math.floor(t * 4) % 2 : '');
    if (collSpr[key]) return collSpr[key];
    let c;
    if (kind === 'anemo') c = G.S.anemoculus(Math.floor(t * 4));
    else {
      c = G.canvas(11, 12); const x = c.ctx;
      if (kind === 'flower') { px(x, 5, 5, 1, 6, '#4a9a38'); [[5, 1], [5, 5], [2, 3], [8, 3]].forEach(([a, b]) => { x.fillStyle = '#ffffff'; x.fillRect(a, b, 3, 3); }); px(x, 5, 3, 1, 1, '#f4e46a'); px(x, 4, 4, 3, 1, '#f4e46a'); c = G.outline(c, '#3a5a30'); }
      else if (kind === 'mush') { px(x, 4, 7, 3, 4, '#f0e6d0'); px(x, 2, 3, 7, 4, '#c8685a'); px(x, 3, 2, 5, 1, '#c8685a'); px(x, 3, 4, 1, 1, '#fff'); px(x, 6, 3, 1, 1, '#fff'); c = G.outline(c, '#4a2a22'); }
      else { px(x, 5, 6, 1, 5, '#6aa84a'); for (let a = 0; a < 8; a++) { const an = (a * Math.PI) / 4; px(x, Math.round(5 + Math.cos(an) * 3), Math.round(4 + Math.sin(an) * 3), 1, 1, '#ffffff'); } px(x, 4, 3, 3, 3, '#e8f0f8'); c = G.outline(c, '#4a5a68'); }
    }
    return (collSpr[key] = c);
  }

  Entities.buildDrawList = function (camX, camY, vw, vh, t) {
    const S = G.state;
    const list = [];
    const x0 = camX - 60, y0 = camY - 40, x1 = camX + vw + 60, y1 = camY + vh + 120;
    // objets du monde
    for (const o of World.objsIn(x0, y0, x1, y1 + 60)) {
      if (o.flat) { list.push({ y: o.y - 100000, o }); continue; }
      if (o.gone) continue;
      if (o.x + 130 < camX || o.x - 130 > camX + vw || o.y + 20 < camY || o.y - 140 > camY + vh) continue;
      list.push({ y: o.y, o });
    }
    for (const e of E.enemies) if (!e.dead && e.x > x0 && e.x < x1 && e.y > y0 && e.y < y1) list.push({ y: e.y, e });
    for (const n of E.npcs) if (n.x > x0 && n.x < x1 && n.y > y0 && n.y < y1) list.push({ y: n.y, n });
    for (const s of E.summons) list.push({ y: s.y, s });
    for (const p of E.pickups) if (p.kind === 'item') list.push({ y: p.y, p });
    for (const c of World.chests) if (c.x > x0 && c.x < x1 && c.y > y0 && c.y < y1) list.push({ y: c.y, c });
    for (const c of World.collectibles) {
      if (c.x < x0 || c.x > x1 || c.y < y0 || c.y > y1) continue;
      if (S.taken[c.id] && S.taken[c.id] > S.t) continue;
      list.push({ y: c.y, col: c });
    }
    for (const s of World.seelies) if (!s.done && s.x > x0 && s.x < x1 && s.y > y0 && s.y < y1) list.push({ y: s.y + 20, sl: s });
    list.push({ y: P.y, pl: true });
    if (G.paimon) list.push({ y: G.paimon.y, pm: true });
    list.sort((a, b) => a.y - b.y);
    return list;
  };

  Entities.drawList = function (ctx, list, camX, camY, t) {
    const S = G.state;
    for (const it of list) {
      if (it.o) {
        const o = it.o;
        if (o.shadow) { ctx.fillStyle = G.P_SHADOW || 'rgba(30,40,60,0.26)'; C.S_ell(ctx, Math.round(o.x - camX), Math.round(o.y - camY), o.shadow[0], o.shadow[1]); }
        const spr = o.anim ? o.anim(t) : o.spr;
        let sx = Math.round(o.x - o.ox - camX);
        if (o.sway !== undefined && o.k === 'tree') sx += Math.round(Math.sin(t * 1.1 + o.sway) * 0.6);
        ctx.drawImage(spr, sx, Math.round(o.y - o.oy - camY));
        if (o.k === 'house' && o.name && Math.hypot(P.x - o.x, P.y - o.y) < 90) G.text(ctx, o.name, Math.round(o.x - camX), Math.round(o.y - o.oy - camY - 6), '#ffffff', { align: 'c', outline: '#2a1a1a' });
        if (o.k === 'waypoint' && o.wp.unlocked && Math.floor(t * 3) % 2) { px(ctx, Math.round(o.x - camX) - 1, Math.round(o.y - camY) - 50, 3, 1, '#d8f4ff'); }
      } else if (it.e) drawEnemy(ctx, it.e, camX, camY, t);
      else if (it.n) {
        const n = it.n;
        const spr = n.sprite();
        const x = Math.round(n.x - camX), y = Math.round(n.y - camY);
        ctx.fillStyle = 'rgba(30,40,60,0.3)'; C.S_ell(ctx, x, y - 1, 6, 2);
        ctx.drawImage(spr, x - 13, y - 29);
        const near = Math.hypot(P.x - n.x, P.y - n.y) < 70;
        const mark = G.Quest ? G.Quest.markFor(n) : null;
        if (mark) { const bob = Math.round(Math.sin(t * 4) * 1.5); G.text(ctx, mark === 'turnin' ? '?' : '!', x, y - 40 + bob, '#ffd45a', { align: 'c', outline: '#3a2a10' }); }
        if (near) G.text(ctx, n.name, x, y - 33 - (mark ? 8 : 0), n.role === 'villager' ? '#ffffff' : '#ffe9a0', { align: 'c', outline: '#1a1a2a' });
      } else if (it.s) C.summonSprite(ctx, it.s, camX, camY, t);
      else if (it.p) {
        const p = it.p;
        const x = Math.round(p.x - camX), y = Math.round(p.y - camY - Math.max(0, p.z) - 4 + Math.round(Math.sin(p.t * 5) * (p.z <= 0 ? 1 : 0)));
        const ic = G.I.item(p.item);
        ctx.fillStyle = 'rgba(30,40,60,0.25)'; C.S_ell(ctx, x, Math.round(p.y - camY), 3, 1);
        ctx.drawImage(ic, x - 8, y - 8 + 4);
      } else if (it.c) {
        const c = it.c, op = !!S.opened[c.id];
        const spr = G.S.chest(c.tier, op);
        const x = Math.round(c.x - camX), y = Math.round(c.y - camY);
        ctx.fillStyle = 'rgba(30,40,60,0.3)'; C.S_ell(ctx, x, y, 8, 2);
        ctx.globalAlpha = op ? 0.85 : 1;
        ctx.drawImage(spr, x - 9, y - 14);
        ctx.globalAlpha = 1;
        if (!op) {
          const near = Math.hypot(P.x - c.x, P.y - c.y);
          if (near < 70 || G.sight > 0) {
            const col = ['#ffe9a0', '#9ab6ff', '#ffe27a', '#d9a0ff'][c.tier];
            const a = 0.4 + 0.3 * Math.sin(t * 5);
            ctx.globalAlpha = a; px(ctx, x - 1, y - 40, 3, 22, col); ctx.globalAlpha = 1;
          }
          if (c.locked && !S.camps[c.locked + '_clear']) { px(ctx, x - 2, y - 11, 5, 5, '#ff6a6a'); px(ctx, x - 1, y - 10, 3, 3, '#3a1a1a'); }
        }
      } else if (it.col) {
        const c = it.col;
        const spr = collectSprite(c.kind, t);
        const x = Math.round(c.x - camX), y = Math.round(c.y - camY);
        const bob = c.kind === 'anemo' ? Math.round(Math.sin(t * 3 + c.x) * 2) - 8 : 0;
        ctx.fillStyle = 'rgba(30,40,60,0.25)'; C.S_ell(ctx, x, y + 2, 3, 1);
        ctx.drawImage(spr, x - Math.floor(spr.width / 2), y - spr.height + 3 + bob);
        if (c.kind === 'anemo' && Math.floor(t * 5 + c.x) % 4 === 0) px(ctx, x + 4, y - 14 + bob, 1, 1, '#ffffff');
        if (G.sight > 0) { ctx.globalAlpha = 0.35 + 0.25 * Math.sin(t * 6); px(ctx, x - 1, y - 40, 3, 30, c.kind === 'anemo' ? '#7af0c4' : '#ffffff'); ctx.globalAlpha = 1; }
      } else if (it.sl) {
        const s = it.sl;
        const spr = G.S.seelie(Math.floor(s.anim * 3));
        const x = Math.round(s.x - camX), y = Math.round(s.y - camY + Math.sin(s.anim * 3) * 3 - 14);
        ctx.fillStyle = 'rgba(30,40,60,0.25)'; C.S_ell(ctx, x, Math.round(s.y - camY), 5, 2);
        ctx.drawImage(spr, x - 9, y - 10);
        if (!s.started && Math.floor(t * 4) % 2) px(ctx, x - 1, y - 22, 3, 1, '#d2c8ff');
      } else if (it.pl) G.Player.draw(ctx, camX, camY, t);
      else if (it.pm) G.drawPaimon(ctx, camX, camY, t);
    }
  };

  Entities.drawGroundFx = function (ctx, camX, camY, t) {
    for (const e of E.enemies) if (e.tele) drawTele(ctx, e.tele, camX, camY, t);
    // cours des séelies (marque dynamique)
    for (const s of World.seelies) if (!s.done && s.pi >= s.path.length) { const a = 0.4 + 0.3 * Math.sin(t * 5); ctx.globalAlpha = a; px(ctx, Math.round(s.court.x - camX) - 1, Math.round(s.court.y - camY) - 40, 3, 36, '#d2c8ff'); ctx.globalAlpha = 1; }
    // ambiance
    for (const b of E.ambient) {
      const spr = G.S.butterfly(Math.floor(t * 8 + b.x) % 2, b.col);
      ctx.drawImage(spr, Math.round(b.x - camX), Math.round(b.y - camY - 10 + Math.sin(b.t * 6) * 2));
    }
  };

  // Compagnon : Paimon
  G.paimon = { x: 0, y: 0, tx: 0, ty: 0 };
  G.updatePaimon = function (dt) {
    const pm = G.paimon;
    const dx = P.x - 14 - pm.x, dy = P.y - 6 - pm.y;
    const d = Math.hypot(dx, dy);
    if (d > 120) { pm.x = P.x - 14; pm.y = P.y; }
    else if (d > 6) { const s = Math.min(1, d / 20) * 80; pm.x += (dx / d) * s * dt; pm.y += (dy / d) * s * dt; }
  };
  G.drawPaimon = function (ctx, camX, camY, t) {
    const pm = G.paimon;
    const spr = G.S.paimon(Math.floor(t * 3));
    const x = Math.round(pm.x - camX), y = Math.round(pm.y - camY);
    ctx.fillStyle = 'rgba(30,40,60,0.2)'; C.S_ell(ctx, x, y, 4, 1);
    ctx.drawImage(spr, x - 9, y - 38 + Math.round(Math.sin(t * 2.5) * 2));
  };

  Entities.drawTop = function (ctx, camX, camY, t) {
    // rien : réservé
  };
})();
