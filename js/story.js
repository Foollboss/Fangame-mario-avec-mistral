/* Teyvat Pixel — histoire : PNJ, dialogues, quêtes, commissions, statues */
(function () {
  const G = window.G;
  const TS = G.TS;
  const Story = (G.Story = {});
  const Quest = (G.Quest = {});
  const Dialog = (G.Dialog = { active: false });
  G.dialog = null;

  // =====================================================================
  //  Système de dialogue
  // =====================================================================
  // script : [{ who, text, face?, choices?:[{label, fn}] }]
  Dialog.start = function (script, onEnd) {
    G.dialog = { script, i: 0, shown: 0, onEnd, sel: 0, t: 0 };
    Dialog.active = true;
    if (G.Audio) G.Audio.sfx('click');
  };
  Dialog.cur = () => (G.dialog ? G.dialog.script[G.dialog.i] : null);
  Dialog.advance = function () {
    const d = G.dialog; if (!d) return;
    const line = d.script[d.i];
    if (d.shown < line.text.length) { d.shown = line.text.length; return; }
    if (line.choices) return;
    d.i++; d.shown = 0; d.sel = 0;
    if (G.Audio) G.Audio.sfx('click');
    if (d.i >= d.script.length) Dialog.end();
  };
  Dialog.choose = function (k) {
    const d = G.dialog; if (!d) return;
    const line = d.script[d.i];
    const ch = line.choices && line.choices[k];
    if (!ch) return;
    if (G.Audio) G.Audio.sfx('click');
    const fn = ch.fn;
    d.i++; d.shown = 0; d.sel = 0;
    if (ch.next) { d.script = d.script.concat(ch.next.map((x) => x)); }
    if (d.i >= d.script.length) Dialog.end();
    if (fn) fn();
  };
  Dialog.end = function () {
    const d = G.dialog;
    G.dialog = null; Dialog.active = false;
    if (d && d.onEnd) d.onEnd();
  };
  Dialog.update = function (dt) {
    const d = G.dialog; if (!d) return;
    d.t += dt;
    const line = d.script[d.i]; if (!line) return;
    if (d.shown < line.text.length) { const before = Math.floor(d.shown); d.shown = Math.min(line.text.length, d.shown + dt * 55); if (Math.floor(d.shown) !== before && Math.floor(d.shown) % 3 === 0 && G.Audio) G.Audio.sfx('type'); }
    const I = G.input;
    if (I.anyEdge('Space', 'Enter', 'KeyF', 'NumpadEnter')) {
      if (line.choices && d.shown >= line.text.length) Dialog.choose(d.sel);
      else Dialog.advance();
    }
    if (line.choices && d.shown >= line.text.length) {
      if (I.anyEdge('ArrowUp', 'KeyW')) d.sel = (d.sel + line.choices.length - 1) % line.choices.length;
      if (I.anyEdge('ArrowDown', 'KeyS')) d.sel = (d.sel + 1) % line.choices.length;
      for (let k = 0; k < line.choices.length; k++) if (I.edge('Digit' + (k + 1))) Dialog.choose(k);
    }
  };

  // =====================================================================
  //  PNJ
  // =====================================================================
  const bpx = (tx) => tx * TS + TS / 2;
  Story.npcDefs = function () {
    const L = (id) => G.CHARS[id].look;
    return [
      { id: 'amber', name: 'Amber', role: 'quest', x: bpx(60), y: 64 * TS, look: L('amber'), dir: 'd', still: true },
      { id: 'katheryne', name: 'Katheryne', role: 'guild', x: bpx(151), y: 33 * TS + 6, look: { hair: '#e0a85a', hairD: '#b07a38', eye: '#4a9ee8', outfit: '#2f4a8a', outfitD: '#1e3366', accent: '#f4e6a0', legs: '#f4f0e6', shoes: '#2f4a8a', style: 'pony', head: 'ribbon', cape: null }, dir: 'd', still: true },
      { id: 'jean', name: 'Jean', role: 'quest', x: bpx(141), y: 27 * TS + 8, look: L('jean'), dir: 'd', still: true },
      { id: 'kaeya', name: 'Kaeya', role: 'chat', x: bpx(120), y: 43 * TS + 6, look: L('kaeya'), dir: 'd', still: true },
      { id: 'sara', name: 'Sara', role: 'shop', x: bpx(151), y: 49 * TS + 4, look: { hair: '#7a4a2a', hairD: '#5a3320', eye: '#5a7a3a', outfit: '#6aa860', outfitD: '#4a8040', accent: '#f4f0e6', legs: '#4a3a30', shoes: '#4a3a30', style: 'bob', head: 'none', cape: null }, dir: 'd', still: true },
      { id: 'barde', name: 'Barde errant', role: 'chat', x: bpx(136), y: 38 * TS, look: { hair: '#2a3a4a', hairD: '#161c26', hairTip: '#5cd0c4', eye: '#5ad0c0', outfit: '#3f8a5a', outfitD: '#2a6a40', accent: '#f3f0e6', legs: '#f3f0e6', shoes: '#3f8a5a', style: 'braid', head: 'beret', cape: null }, dir: 'r', still: true },
    ];
  };

  const VILLAGER = [
    'Le vent a un parfum de pissenlit aujourd’hui.',
    'Méfiez-vous des hilichurls dans la forêt, voyageur !',
    'Mondstadt, la cité de la liberté… et du cidre !',
    'Les statues des Sept soignent les voyageurs fatigués.',
    'Suivez les Séelies : elles mènent à de beaux trésors.',
    'Un bon repas vaut mieux qu’une potion. Les deux, c’est encore mieux.',
    'Combinez les éléments : le Pyro et l’Hydro s’entendent à merveille… pour s’évaporer.',
    'Il paraît qu’une Hypostase s’est réveillée dans les ruines de l’est.',
    'La Guilde des aventuriers donne de bonnes commissions chaque jour.',
    'Le moulin tourne, la ville respire. Tout va bien.',
    'J’ai vu un Mitachurl près du lac. Il avait un bouclier énorme !',
  ];

  // =====================================================================
  //  Quêtes principales
  // =====================================================================
  const STEPS = [
    { t: 'talk', npc: 'amber', text: 'Parler à Amber, près de la statue' },
    { t: 'kill', kind: 'slime', n: 3, text: 'Éliminer 3 gelées dans la plaine' },
    { t: 'talk', npc: 'amber', text: 'Retourner voir Amber' },
    { t: 'waypoint', id: 'city', text: 'Activer le téléporteur de la porte sud de Mondstadt' },
    { t: 'talk', npc: 'katheryne', text: 'Se présenter à la Guilde des aventuriers (Katheryne)' },
    { t: 'talk', npc: 'jean', text: 'Rencontrer Jean, devant la cathédrale' },
    { t: 'camp', id: 'camp', text: 'Éliminer le campement hilichurl de la forêt bruissante' },
    { t: 'talk', npc: 'jean', text: 'Faire votre rapport à Jean' },
    { t: 'boss', text: 'Vaincre l’Hypostase Anémo dans le domaine, à l’est' },
    { t: 'talk', npc: 'jean', text: 'Annoncer la nouvelle à Jean' },
  ];
  Quest.STEPS = STEPS;
  Quest.cur = () => { const q = G.state.quest; return q.step < STEPS.length ? STEPS[q.step] : null; };

  const stepRewards = {
    2: () => { G.gain('apple', 3); G.gain('mora', 400); G.addArExp(60); },
    4: () => { G.gain('mora', 600); G.gain('primo', 20); G.addArExp(100); },
    7: () => { G.gain('primo', 40); G.gain('mora', 5000); G.gain('book2', 3); G.addArExp(200); },
    9: () => { G.gain('primo', 60); G.gain('fate', 5); G.gain('mora', 20000); G.gain('book3', 2); G.addArExp(400); },
  };

  Quest.advance = function () {
    const q = G.state.quest;
    const rw = stepRewards[q.step];
    q.step++; q.prog = 0;
    if (rw) rw();
    const nx = Quest.cur();
    if (nx) { G.banner('Quête principale', nx.text, 'quest'); G.questDot = true; }
    else { G.banner('Prologue terminé !', 'Le vent de la liberté souffle sur Mondstadt', 'quest'); }
    if (G.Audio) G.Audio.sfx('quest');
  };

  Quest.event = function (type, data) {
    const S = G.state; if (!S) return;
    const q = S.quest;
    const st = Quest.cur();
    if (st) {
      if (type === 'kill' && st.t === 'kill' && data.kind === st.kind) { q.prog = (q.prog || 0) + 1; if (q.prog >= st.n) Quest.advance(); }
      else if (type === 'waypoint' && st.t === 'waypoint' && data.id === st.id) Quest.advance();
      else if (type === 'camp' && st.t === 'camp' && data.id === st.id) Quest.advance();
      else if (type === 'kill' && st.t === 'boss' && data.boss) Quest.advance();
    }
    Quest.commissionEvent(type, data);
  };

  Quest.markFor = function (npc) {
    const st = Quest.cur();
    if (st && st.t === 'talk' && st.npc === npc.id) return 'quest';
    if (npc.id === 'katheryne' && G.state.quest.step >= 5) { if (Quest.commissionsClaimable() > 0) return 'turnin'; }
    return null;
  };

  // Cible de suivi (boussole)
  Quest.target = function () {
    const st = Quest.cur();
    if (!st) return null;
    const W = G.World;
    if (st.t === 'talk') { const n = G.E.npcs.find((x) => x.id === st.npc); if (n) return { x: n.x, y: n.y, label: st.text }; }
    if (st.t === 'kill') { const c = W.camps.find((x) => x.id === 'plain1'); const e = G.Combat.nearest(G.P.x, G.P.y, 9999, (z) => z.kind === 'slime'); if (e) return { x: e.x, y: e.y, label: st.text, area: 20 }; return { x: c.x, y: c.y, label: st.text }; }
    if (st.t === 'waypoint') { const w = W.waypoints.find((x) => x.id === st.id); return { x: w.x, y: w.y, label: st.text }; }
    if (st.t === 'camp') { const c = W.camps.find((x) => x.id === st.id); return { x: c.x, y: c.y, label: st.text }; }
    if (st.t === 'boss') return { x: W.pois.domain.x, y: W.pois.domain.y, label: st.text };
    return null;
  };

  // =====================================================================
  //  Commissions quotidiennes
  // =====================================================================
  const TEMPLATES = [
    { id: 'kill', text: (n) => 'Éliminer ' + n + ' ennemis', n: [6, 10], ev: 'kill' },
    { id: 'slime', text: (n) => 'Éliminer ' + n + ' gelées', n: [3, 6], ev: 'kill', kind: 'slime' },
    { id: 'hili', text: (n) => 'Éliminer ' + n + ' hilichurls', n: [3, 6], ev: 'kill', kinds: ['melee', 'ranged', 'brute'] },
    { id: 'flower', text: (n) => 'Cueillir ' + n + ' fleurs douces', n: [3, 6], ev: 'collect', item: 'flower' },
    { id: 'chest', text: (n) => 'Ouvrir ' + n + ' coffres', n: [1, 3], ev: 'chest' },
    { id: 'react', text: (n) => 'Déclencher ' + n + ' réactions élémentaires', n: [3, 6], ev: 'reaction' },
    { id: 'anemo', text: (n) => 'Collecter ' + n + ' Anémoculi', n: [2, 3], ev: 'collect', item: 'anemoculus' },
    { id: 'burst', text: (n) => 'Utiliser ' + n + ' fois un déchaînement élémentaire', n: [2, 4], ev: 'burst' },
  ];
  Quest.rollCommissions = function () {
    const S = G.state;
    const pool = TEMPLATES.slice();
    const out = [];
    for (let i = 0; i < 4; i++) {
      const t = pool.splice(Math.floor(Math.random() * pool.length), 1)[0];
      const n = G.irand(t.n[0], t.n[1]);
      out.push({ id: t.id, text: t.text(n), n, prog: 0, claimed: false, ev: t.ev, kind: t.kind, kinds: t.kinds, item: t.item });
    }
    S.commissions = out; S.commDay = S.day; S.commBonus = false;
  };
  Quest.ensureCommissions = function () {
    const S = G.state;
    if (!S.commissions || S.commDay !== S.day) Quest.rollCommissions();
  };
  Quest.commissionEvent = function (type, data) {
    const S = G.state;
    if (!S.commissions) return;
    for (const c of S.commissions) {
      if (c.claimed || c.prog >= c.n || c.ev !== type) continue;
      if (type === 'kill') { if (c.kind && data.kind !== c.kind) continue; if (c.kinds && !c.kinds.includes(data.kind)) continue; c.prog++; }
      else if (type === 'collect') { if (c.item !== data.id) continue; c.prog = Math.min(c.n, c.prog + (data.n || 1)); }
      else c.prog++;
      if (c.prog >= c.n) { G.toast('Commission terminée : ' + c.text); G.commDot = true; }
    }
  };
  Quest.commissionsClaimable = function () {
    const S = G.state;
    if (!S.commissions) return 0;
    return S.commissions.filter((c) => c.prog >= c.n && !c.claimed).length;
  };
  Quest.claimCommissions = function () {
    const S = G.state;
    let n = 0;
    for (const c of S.commissions) if (c.prog >= c.n && !c.claimed) { c.claimed = true; n++; G.gain('primo', 10); G.gain('mora', 800); G.gain('book2', 1); G.addArExp(60); S.bp.xp += 20; }
    if (S.commissions.every((c) => c.claimed) && !S.commBonus) { S.commBonus = true; G.gain('primo', 60); G.gain('fate', 1); G.gain('mora', 2000); G.toast('Bonus quotidien de Katheryne !'); }
    return n;
  };

  // =====================================================================
  //  Interactions de dialogue
  // =====================================================================
  const stepTalk = (npc) => { const st = Quest.cur(); if (st && st.t === 'talk' && st.npc === npc.id) { Quest.advance(); return true; } return false; };

  Story.talk = function (npc) {
    const S = G.state;
    const st = Quest.cur();
    const line = (who, text, face) => ({ who, text, face });
    const after = (fn) => fn;
    // quêtes principales
    if (st && st.t === 'talk' && st.npc === npc.id) {
      const idx = S.quest.step;
      const scripts = {
        0: [line('Amber', 'Salut, voyageur ! Moi, c’est Amber, éclaireuse de l’ordre de Favonius. Ravie de te voir sur pied !', 'amber'), line('Paimon', 'Éclaireuse ? Comme une guide ? Paimon adore les guides !', 'paimon'), line('Amber', 'Les gelées pullulent dans la plaine. Élimine-en trois : je veux voir comment tu te bats ! Utilise l’attaque, la compétence (E) et le déchaînement (Q).', 'amber')],
        2: [line('Amber', 'Bravo ! Tu as le rythme du vent dans les jambes. Tiens, un petit casse-croûte et quelques Méra.', 'amber'), line('Amber', 'Rends-toi à Mondstadt, à l’est. Active le téléporteur près de la porte sud : ensuite, tu pourras voyager d’un point à l’autre depuis la carte.', 'amber')],
        4: [line('Katheryne', 'Bienvenue à la Guilde des aventuriers ! Je vous inscris sur le registre.', 'katheryne'), line('Katheryne', 'Chaque jour, je propose des commissions : revenez me voir, vous serez payé en Gemmes primordiales.', 'katheryne'), line('Katheryne', 'Au fait, le Grand Maître Jean cherche des bras pour une mission. Elle est devant la cathédrale.', 'katheryne')],
        5: [line('Jean', 'Un voyageur ? Bienvenue à Mondstadt. Je suis Jean, Grand Maître suppléant des Chevaliers de Favonius.', 'jean'), line('Jean', 'Un campement de hilichurls s’est installé dans la forêt bruissante, à l’ouest. Les caravanes n’osent plus passer.', 'jean'), line('Jean', 'Pouvez-vous le nettoyer ? Méfiez-vous du Mitachurl : son bouclier arrête les attaques de face. Frappez-le par les côtés, ou utilisez vos compétences !', 'jean')],
        7: [line('Jean', 'La route est dégagée. Mondstadt vous est redevable.', 'jean'), line('Jean', 'Mais ce n’est pas fini : les ruines à l’est émettent une étrange énergie. Une Hypostase Anémo s’y est réveillée.', 'jean'), line('Jean', 'Le domaine « Tempête de pierre » y est ouvert. Si quelqu’un peut le vaincre, c’est vous. Et prenez ceci pour la route.', 'jean')],
        9: [line('Jean', 'Vous avez vaincu l’Hypostase ! Le vent est de nouveau libre à Mondstadt.', 'jean'), line('Paimon', 'Hé hé, Paimon savait qu’on y arriverait ! On a gagné une récompense, non ?', 'paimon'), line('Jean', 'Votre prologue s’achève ici, mais votre aventure ne fait que commencer. Continuez d’explorer, de faire des vœux et de monter en rang !', 'jean')],
      };
      const sc = scripts[idx];
      if (sc) { Dialog.start(sc, () => Quest.advance()); return; }
    }
    if (npc.id === 'katheryne') {
      Quest.ensureCommissions();
      const claim = Quest.commissionsClaimable();
      Dialog.start([{ who: 'Katheryne', face: 'katheryne', text: claim ? 'Vous avez des commissions terminées. Voulez-vous récupérer vos récompenses ?' : 'Bienvenue à la Guilde. Voici les commissions du jour.', choices: [
        { label: 'Voir les commissions', fn: () => G.Menus.open('commissions') },
        { label: 'Au revoir', fn: null },
      ] }]);
      return;
    }
    if (npc.id === 'sara') {
      Dialog.start([{ who: 'Sara', face: 'sara', text: 'Bienvenue ! Livres d’expérience, pain frais, ragoût du jour… ou vendez-moi vos trouvailles.', choices: [
        { label: 'Acheter / Vendre', fn: () => G.Menus.open('shop') },
        { label: 'Non merci', fn: null },
      ] }]);
      return;
    }
    if (npc.id === 'amber') { Dialog.start([line('Amber', G.pick(['Les gelées pyro sont fragiles à l’eau : essaie l’Hydro !', 'Le Cryo gèle un ennemi mouillé. Tu verras, c’est très drôle.', 'N’oublie pas de manger quand tu es blessé (touche T).', 'Les statues des Sept te soignent entièrement.']), 'amber')]); return; }
    if (npc.id === 'jean') { Dialog.start([line('Jean', G.pick(['Mondstadt compte sur vous.', 'Le vent est avec vous, voyageur.', 'Les ruines de l’est abritent encore bien des secrets.']), 'jean')]); return; }
    if (npc.id === 'kaeya') { Dialog.start([line('Kaeya', G.pick(['Toujours à l’heure, voyageur. Un verre de cidre ? Non ? Tant pis.', 'Tu veux un conseil ? Gèle l’ennemi puis frappe fort : ça le brise.', 'Je fais mon rapport quotidien : tout va bien… en apparence.']), 'kaeya')]); return; }
    if (npc.id === 'barde') { Dialog.start([line('Barde errant', G.pick(['♥ La la la, le vent chante la liberté ♥', 'Une chanson contre une Méra ? Non ? Dommage !', 'Tu cherches des Anémoculi ? Écoute le vent, il te guide.']), 'venti')]); return; }
    // villageois
    Dialog.start([line(npc.name, VILLAGER[((npc.lineIdx || 0) + G.irand(0, VILLAGER.length - 1)) % VILLAGER.length])]);
  };

  // Statue des Sept
  Story.statue = function (st) {
    const S = G.state;
    S.party.forEach((id) => { const cs = S.chars[id]; cs.hp = G.charStats(cs).hp; });
    G.Combat.spark(G.P.x, G.P.y - 12, '#bdf7e2', 14, 60);
    G.Combat.text(G.P.x, G.P.y - 34, 'PV restaurés', '#8dff9a', true, 1.2);
    if (G.Audio) G.Audio.sfx('heal');
    const n = S.inv.anemoculus || 0;
    const choices = [];
    if (n > 0) choices.push({ label: 'Offrir ' + n + ' Anémoculus', fn: () => {
      S.inv.anemoculus = 0;
      const r = G.irand(18, 22) * n;
      G.gain('primo', r); G.gain('mora', 400 * n); G.addArExp(30 * n);
      G.banner('Statue des Sept', 'Vos offrandes ont été acceptées', 'unlock');
    } });
    choices.push({ label: 'Sauvegarder la partie', fn: () => { G.Save.save(); G.toast('Partie sauvegardée.'); } });
    choices.push({ label: 'Fermer', fn: null });
    Dialog.start([{ who: 'Statue des Sept', text: 'Un souffle doux vous enveloppe. Votre équipe est entièrement soignée.' + (n ? ' La statue accepte les Anémoculi en offrande.' : ''), choices }]);
  };

  // Introduction
  Story.intro = function () {
    const S = G.state;
    const vet = S.mode === 'veteran';
    const script = vet
      ? [{ who: 'Paimon', face: 'paimon', text: 'Te revoilà, voyageur confirmé ! Rang 60, équipe niveau 90… Paimon est impressionnée.' },
        { who: 'Paimon', face: 'paimon', text: 'Mais le vent ne s’arrête jamais de souffler. Explore Mondstadt, vaincs l’Hypostase des ruines de l’est, et fais des vœux avec tes Gemmes !' }]
      : [{ who: 'Paimon', face: 'paimon', text: 'Hé, voyageur ! Enfin réveillé ! Nous voici sur le plateau de la Statue des Sept, au-dessus de la plaine de Mondstadt.' },
        { who: 'Paimon', face: 'paimon', text: 'Vois-tu cette Séelie violette qui flotte ? Suis-la : elle te mènera à un trésor. Et il y a une éclaireuse, là-bas : allons lui parler !' },
        { who: 'Paimon', face: 'paimon', text: 'Déplace-toi avec ZQSD/WASD ou le joystick, attaque avec le clic ou le bouton épée, et interagis avec F.' }];
    Dialog.start(script);
  };
})();
