/* Teyvat Pixel — état de jeu, progression, inventaire, notifications */
(function () {
  const G = window.G;

  // ---------- Statistiques de personnage ----------
  const statCache = {};
  G.charStats = function (cs) {
    const key = cs.id + '|' + cs.level + '|' + (cs.c || 0);
    if (statCache[key]) return statCache[key];
    const d = G.CHARS[cs.id];
    const L = cs.level, s = G.sLevel(L);
    const cb = 1 + 0.06 * (cs.c || 0);
    const st = {
      hp: Math.round(d.hp90 * (0.07 + 0.93 * Math.pow((L - 1) / 89, 1.05))),
      atk: Math.round(d.atk90 * s * cb),
      def: Math.round(d.def90 * (0.07 + 0.93 * Math.pow((L - 1) / 89, 1.05))),
      cr: 0.05 + 0.55 * s,
      cd: 0.5 + 0.85 * s,
      elb: 0.04 + 0.36 * s,
      em: Math.round(40 + 120 * s),
      er: 1 + 0.2 * s,
    };
    return (statCache[key] = st);
  };

  // ---------- Création / état ----------
  G.newGame = function (mode) {
    const vet = mode === 'veteran';
    const S = (G.state = {
      ver: 2, mode, t: 0, tod: 9 * 60, day: 1,
      chars: {}, party: [], active: 0,
      inv: {}, ar: vet ? 60 : 1, arExp: 0, wl: vet ? 8 : 0,
      stamina: 240, staminaMax: 240,
      quest: { main: 0, step: 0, flags: {}, done: {} },
      commissions: null, commDay: -1, commDone: 0,
      opened: {}, taken: {}, unlocked: { plateau: true }, statues: {}, seelies: {}, camps: {},
      bp: { xp: 0, claimed: {} }, codex: {}, stats: { kills: 0, chests: 0, reactions: 0, flowers: 0, anemo: 0, wishes: 0, play: 0 },
      pity: { e5: 0, e4: 0, s5: 0, s4: 0, guaranteed: false },
      settings: { music: 0.5, sfx: 0.7, hints: true },
      pos: { x: G.World.pois.spawn.x, y: G.World.pois.spawn.y },
      uid: 800125548, domainDone: false,
    });
    const give = (id, lv) => (S.chars[id] = { id, level: lv, exp: 0, hp: 0, energy: 0, cdE: 0, cdQ: 0, c: 0 });
    if (vet) {
      ['keqing', 'venti', 'tartaglia', 'diona'].forEach((id) => give(id, 90));
      ['aether', 'amber', 'kaeya', 'lisa', 'barbara', 'xiangling', 'fischl', 'bennett', 'sucrose', 'razor', 'diluc', 'jean', 'mona', 'qiqi'].forEach((id, i) => give(id, 80 + (i % 3) * 5));
      S.party = ['keqing', 'venti', 'tartaglia', 'diona'];
      S.active = 0;
      Object.assign(S.inv, { mora: 1245300, primo: 3200, fate: 21, book3: 18, book2: 40, book1: 60, bread: 8, meal: 6, apple: 12, stardust: 400, starglitter: 120 });
      S.arExp = 0;
    } else {
      ['aether', 'amber', 'kaeya', 'lisa'].forEach((id) => give(id, 1));
      S.party = ['aether', 'amber', 'kaeya', 'lisa'];
      S.active = 0;
      Object.assign(S.inv, { mora: 2000, primo: 1600, fate: 5, apple: 3, bread: 1, book1: 3 });
    }
    Object.values(S.chars).forEach((cs) => { cs.hp = G.charStats(cs).hp; cs.energy = 0; });
    return S;
  };

  G.cs = (i) => { const S = G.state; return S.chars[S.party[i == null ? S.active : i]]; };
  G.activeDef = () => G.CHARS[G.cs().id];
  G.partyList = () => G.state.party.map((id) => G.state.chars[id]);

  // ---------- Notifications ----------
  G.feed = [];
  G.banners = [];
  G.toast = function (text, item, n) {
    G.feed.push({ text, item, n, t: 0, life: 3.2 });
    if (G.feed.length > 6) G.feed.shift();
  };
  G.banner = function (title, sub, kind) {
    G.banners.push({ title, sub, kind: kind || 'zone', t: 0, life: 3.4 });
  };

  G.gain = function (id, n, silent) {
    const S = G.state;
    S.inv[id] = (S.inv[id] || 0) + n;
    if (!silent) G.toast(G.ITEMS[id].name, id, n);
    if (G.Quest) G.Quest.event('gain', { id, n });
  };
  G.has = (id, n) => (G.state.inv[id] || 0) >= (n || 1);
  G.spend = (id, n) => { if (!G.has(id, n)) return false; G.state.inv[id] -= n; return true; };

  G.addArExp = function (n) {
    const S = G.state;
    if (S.ar >= 60) return;
    S.arExp += n;
    while (S.ar < 60 && S.arExp >= G.arExpToNext(S.ar)) {
      S.arExp -= G.arExpToNext(S.ar);
      S.ar++;
      G.banner('Rang d’aventure ' + S.ar, 'Récompense : 20 Gemmes primordiales, 1 000 Méra', 'ar');
      G.gain('primo', 20, true); G.gain('mora', 1000, true);
      if (S.ar % 5 === 0) { S.wl = Math.min(8, Math.floor(S.ar / 7.5)); }
      if (G.Audio) G.Audio.sfx('levelup');
    }
  };

  // PV / expérience / énergie
  G.healChar = function (cs, amt) {
    const max = G.charStats(cs).hp;
    const before = cs.hp;
    cs.hp = Math.min(max, cs.hp + amt);
    return cs.hp - before;
  };
  G.addCharExp = function (cs, amt) {
    let gained = 0;
    while (amt > 0 && cs.level < 90) {
      const need = G.charExpToNext(cs.level) - cs.exp;
      if (amt >= need) { amt -= need; cs.exp = 0; cs.level++; gained++; } else { cs.exp += amt; amt = 0; }
    }
    if (gained) { const st = G.charStats(cs); cs.hp = Math.min(st.hp, cs.hp + st.hp * 0.2); }
    return gained;
  };

  // ---------- Heure du jour ----------
  G.todLabel = () => {
    const m = Math.floor(G.state.tod) % 1440;
    return String(Math.floor(m / 60)).padStart(2, '0') + ':' + String(m % 60).padStart(2, '0');
  };
  // 0 = plein jour, 1 = pleine nuit
  G.nightness = () => {
    const h = (G.state.tod / 60) % 24;
    if (h >= 7 && h <= 17.5) return 0;
    if (h > 17.5 && h < 20.5) return (h - 17.5) / 3;
    if (h >= 20.5 || h <= 4.5) return 1;
    return 1 - (h - 4.5) / 2.5;
  };

  G.enemyLvl = (bonus) => G.enemyLevel(G.state.ar, bonus || 0);

  // Énergie distribuée à l'équipe
  G.giveEnergy = function (amount, el, activeOnly) {
    const S = G.state;
    S.party.forEach((id, i) => {
      const cs = S.chars[id], d = G.CHARS[id];
      if (cs.hp <= 0) return;
      const b = d.burst.cost;
      let a = amount * (el === d.el || el === 'any' ? 1 : 0.5) * G.charStats(cs).er;
      if (i !== S.active) a *= 0.6;
      if (activeOnly && i !== S.active) return;
      cs.energy = Math.min(b, cs.energy + a);
    });
  };
})();
