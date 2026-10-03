/* Teyvat Pixel — données de jeu : éléments, personnages, ennemis, objets */
(function () {
  const G = window.G;

  // ---------- Éléments ----------
  G.EL = {
    pyro: { fr: 'Pyro', color: '#ff7a3d', light: '#ffc79a', dark: '#b8431a' },
    hydro: { fr: 'Hydro', color: '#3fa9ff', light: '#a6dcff', dark: '#1f67c4' },
    electro: { fr: 'Électro', color: '#c07dff', light: '#e6c9ff', dark: '#7a3fc4' },
    cryo: { fr: 'Cryo', color: '#8fe8ff', light: '#dcfaff', dark: '#4aaed0' },
    anemo: { fr: 'Anémo', color: '#5fe3b6', light: '#bdf7e2', dark: '#2ba784' },
    phys: { fr: 'Physique', color: '#f0f0f0', light: '#ffffff', dark: '#9a9aa8' },
  };

  // ---------- Armes (attaque normale) ----------
  // chain : multiplicateurs de chaque coup du combo ; spd : délai entre coups (s) ; reach : portée (px)
  G.WEAPONS = {
    sword: { fr: 'Épée', chain: [0.45, 0.43, 0.55, 0.60, 0.74], spd: 0.34, reach: 24, arc: 2.1, kind: 'melee', lunge: 3 },
    claymore: { fr: 'Pourfendeur', chain: [0.95, 0.88, 1.15, 1.45], spd: 0.55, reach: 26, arc: 2.5, kind: 'melee', lunge: 4 },
    polearm: { fr: 'Arme d’hast', chain: [0.52, 0.50, 0.64, 0.38, 0.85], spd: 0.4, reach: 34, arc: 0.7, kind: 'thrust', lunge: 3 },
    bow: { fr: 'Arc', chain: [0.42, 0.44, 0.55, 0.6], spd: 0.38, reach: 150, kind: 'shot', proj: 'arrow' },
    catalyst: { fr: 'Catalyseur', chain: [0.55, 0.52, 0.8], spd: 0.5, reach: 120, kind: 'shot', proj: 'orb', elemental: true },
  };

  // ---------- Personnages ----------
  // look : apparence procédurale ; skill/burst : kit (voir combat.js)
  const C = (o) => o;
  G.CHARS = {
    aether: C({
      name: 'Voyageur', title: 'Étranger venu d’ailleurs', el: 'anemo', weapon: 'sword', rarity: 5, hp90: 15200, atk90: 1850, def90: 780, wname: 'Épée du voyageur',
      look: { m: true, hair: '#f0cb5a', hairD: '#c9992f', eye: '#f0a52a', outfit: '#f3f1e8', outfitD: '#cfcab8', accent: '#e2a93a', legs: '#e9e6da', shoes: '#c9a24a', style: 'pony', head: 'none', cape: '#f7f5ee' },
      skill: { n: 'Tempête déferlante', k: 'vortex', cd: 8, r: 34, dur: 1.4, mult: 1.6, pull: 120, dist: 38, el: 'anemo' },
      burst: { n: 'Fureur des vents', k: 'zone', cost: 60, cd: 15, r: 52, dur: 6, tick: 0.5, mult: 0.55, pull: 80, el: 'anemo' },
    }),
    lyney: C({
      name: 'Lyney', title: 'Magicien de la scène', el: 'pyro', weapon: 'bow', rarity: 5, hp90: 12400, atk90: 2000, def90: 700, wname: 'Arc du grand illusionniste',
      look: { m: true, hair: '#2b2433', hairD: '#1a1520', eye: '#7a8ae8', outfit: '#26202e', outfitD: '#17121e', accent: '#d9483a', legs: '#2a2430', shoes: '#d9483a', style: 'short', head: 'tophat', cape: '#8a2a30' },
      skill: { n: 'Piège de lumière', k: 'decoy', cd: 12, dur: 3.5, r: 42, mult: 2.8, el: 'pyro', name: 'Piège' },
      burst: { n: 'Grand final', k: 'nova', cost: 50, cd: 14, r: 58, mult: 1.0, hits: 6, el: 'pyro' },
    }),
    kaeya: C({
      name: 'Kaeya', title: 'Capitaine de cavalerie', el: 'cryo', weapon: 'sword', rarity: 4, hp90: 13400, atk90: 1700, def90: 790, wname: 'Épée de cavalerie',
      look: { m: true, hair: '#2b3b72', hairD: '#1e2a55', eye: '#5fb8e8', outfit: '#2f4c8f', outfitD: '#22386b', accent: '#e9d27a', legs: '#252c4a', shoes: '#1e2038', style: 'short', head: 'eyepatch', cape: '#e8eef6' },
      skill: { n: 'Morsure de givre', k: 'cone', cd: 6, r: 36, arc: 1.6, mult: 2.5, n2: 1, el: 'cryo' },
      burst: { n: 'Danse de la tempête', k: 'orbit', cost: 60, cd: 15, dur: 8, r: 34, mult: 0.9, tickRate: 0.35, el: 'cryo' },
    }),
    cyno: C({
      name: 'Cyno', title: 'Juge du désert', el: 'electro', weapon: 'polearm', rarity: 5, hp90: 13100, atk90: 1960, def90: 780, wname: 'Lance du juge',
      look: { m: true, hair: '#f0eef2', hairD: '#b8b4c0', eye: '#e8a838', outfit: '#2a2a38', outfitD: '#16161f', accent: '#e0b455', legs: '#2a2a38', shoes: '#e0b455', style: 'spiky', head: 'headdress', cape: '#2a2a38' },
      skill: { n: 'Lame du jugement', k: 'cone', cd: 7, r: 38, arc: 1.6, mult: 2.2, n2: 2, el: 'electro' },
      burst: { n: 'Sentence pour les impies', k: 'zone', cost: 80, cd: 20, r: 62, dur: 7, tick: 0.5, mult: 0.9, el: 'electro' },
    }),
    xingqiu: C({
      name: 'Xingqiu', title: 'Érudit épéiste', el: 'hydro', weapon: 'sword', rarity: 4, hp90: 10222, atk90: 1650, def90: 758, wname: 'Épée de la pluie',
      look: { m: true, hair: '#2d4a78', hairD: '#1e3358', eye: '#5aa0e8', outfit: '#4a6fb8', outfitD: '#324f8a', accent: '#f4f0e6', legs: '#e9e6da', shoes: '#324f8a', style: 'short', head: 'none', cape: null },
      skill: { n: 'Épées de pluie', k: 'cone', cd: 5, r: 36, arc: 1.6, mult: 2.4, n2: 2, el: 'hydro' },
      burst: { n: 'Tempête de lames', k: 'orbit', cost: 80, cd: 20, dur: 10, r: 36, mult: 1.0, tickRate: 0.4, el: 'hydro' },
    }),
    thoma: C({
      name: 'Thoma', title: 'Intendant dévoué', el: 'pyro', weapon: 'polearm', rarity: 4, hp90: 10600, atk90: 1620, def90: 740, wname: 'Lance du foyer',
      look: { m: true, hair: '#c8602a', hairD: '#963e18', eye: '#d8a838', outfit: '#b83a30', outfitD: '#8a2820', accent: '#f2e6c0', legs: '#3a3030', shoes: '#5a3a2a', style: 'spiky', head: 'headband', cape: null },
      skill: { n: 'Écran du brasier', k: 'shield', cd: 15, r: 34, mult: 2.0, absorb: 0.18, dur: 8, el: 'pyro' },
      burst: { n: 'Flamme du foyer', k: 'nova', cost: 80, cd: 20, r: 58, mult: 3.0, hits: 1, el: 'pyro', knock: 30 },
    }),
    sethos: C({
      name: 'Sethos', title: 'Gardien des sables', el: 'electro', weapon: 'bow', rarity: 4, hp90: 9800, atk90: 1700, def90: 640, wname: 'Arc des sables',
      look: { m: true, hair: '#2a2a3a', hairD: '#16161f', eye: '#c07dff', outfit: '#cfa84a', outfitD: '#a8822c', accent: '#6a3fb8', legs: '#e9d8b0', shoes: '#6a3fb8', style: 'short', head: 'headband', cape: null },
      skill: { n: 'Faucon des sables', k: 'summon', cd: 15, dur: 10, every: 1, mult: 0.9, range: 110, el: 'electro', name: 'Faucon', bird: true },
      burst: { n: 'Éclair de Khemenu', k: 'nova', cost: 60, cd: 15, r: 60, mult: 2.8, hits: 1, el: 'electro' },
    }),
    bennett: C({
      name: 'Bennett', title: 'Aventurier malchanceux', el: 'pyro', weapon: 'sword', rarity: 4, hp90: 12400, atk90: 1550, def90: 780, wname: 'Lame de l’explorateur',
      look: { m: true, hair: '#6a3b2a', hairD: '#4a2819', eye: '#8a5a3a', outfit: '#d9483a', outfitD: '#a8302a', accent: '#f4f0e6', legs: '#4a3a30', shoes: '#4a3a30', style: 'spiky', head: 'none', cape: null },
      skill: { n: 'Surcharge de passion', k: 'blast', cd: 5, r: 34, mult: 2.2, el: 'pyro', knock: 36 },
      burst: { n: 'Cercle fantastique', k: 'zone', cost: 60, cd: 15, r: 56, dur: 12, tick: 1, mult: 0, heal: 0.03, buff: 0.45, infuse: 'pyro', el: 'pyro' },
    }),
    kazuha: C({
      name: 'Kazuha', title: 'Vagabond de l’érable', el: 'anemo', weapon: 'sword', rarity: 5, hp90: 13348, atk90: 1890, def90: 800, wname: 'Lame de l’érable',
      look: { m: true, hair: '#d8e0e8', hairD: '#a8b0bc', hairTip: '#c8453a', eye: '#d8453a', outfit: '#8a2e2e', outfitD: '#5a1a1a', accent: '#f2d27a', legs: '#2a2a30', shoes: '#3a2a2a', style: 'pony', head: 'none', cape: '#c8453a' },
      skill: { n: 'Tourbillon d’érable', k: 'vortex', cd: 6, r: 32, dur: 1.2, mult: 3.0, pull: 110, dist: 34, el: 'anemo' },
      burst: { n: 'Éclat des feuilles', k: 'zone', cost: 60, cd: 15, r: 62, dur: 8, tick: 0.5, mult: 0.9, pull: 130, el: 'anemo', swirlInfuse: true },
    }),
    diona: C({
      name: 'Diona', title: 'Barmaid chat', el: 'cryo', weapon: 'bow', rarity: 4, hp90: 9570, atk90: 1500, def90: 600, wname: 'Arc à la cime',
      look: { hair: '#f0a1bd', hairD: '#c97493', eye: '#e8c24a', outfit: '#e9d6c2', outfitD: '#bfa68e', accent: '#7a4f33', legs: '#4a3a40', shoes: '#7a4f33', style: 'bob', head: 'cathat', cape: '#9a6a44' },
      skill: { n: 'Pattes de glace', k: 'shield', cd: 10, r: 38, mult: 1.9, absorb: 0.18, dur: 5, el: 'cryo' },
      burst: { n: 'Mélange signature', k: 'zone', cost: 80, cd: 20, r: 58, dur: 6, tick: 1, mult: 0.9, heal: 0.05, el: 'cryo' },
    }),
    razor: C({
      name: 'Razor', title: 'Garçon-loup', el: 'electro', weapon: 'claymore', rarity: 4, hp90: 11800, atk90: 1760, def90: 690, wname: 'Pourfendeur de loup',
      look: { m: true, hair: '#c5c8d6', hairD: '#8d90a2', eye: '#f0c64a', outfit: '#3d3d4c', outfitD: '#28283a', accent: '#e8e8f0', legs: '#2a2a38', shoes: '#4a3a30', style: 'spiky', head: 'none', cape: null },
      skill: { n: 'Griffe de foudre', k: 'blast', cd: 6, r: 34, mult: 3.2, el: 'electro', knock: 16, energyBonus: 3 },
      burst: { n: 'Lupus Fulguris', k: 'stance', cost: 40, cd: 20, dur: 15, el: 'electro', mult: 1.25 },
    }),
    keqing: C({
      name: 'Keqing', title: 'Yuheng des Qixing', el: 'electro', weapon: 'sword', rarity: 5, hp90: 17883, atk90: 1980, def90: 840, wname: 'Épée d’acier céleste',
      look: { hair: '#9b82d9', hairD: '#6c52b0', eye: '#b06cf2', outfit: '#3e3278', outfitD: '#2a2158', accent: '#7a4f38', legs: '#3a2d44', shoes: '#4b2f66', style: 'bun2', head: 'none', cape: '#7a4f38' },
      skill: { n: 'Restauration stellaire', k: 'blink', cd: 7.5, mult: 5.0, mult2: 1.7, dur: 5, el: 'electro' },
      burst: { n: 'Épée vers les étoiles', k: 'flurry', cost: 40, cd: 12, hits: 8, mult: 0.9, endMult: 3.8, el: 'electro' },
    }),
    venti: C({
      name: 'Venti', title: 'Barde de Mondstadt', el: 'anemo', weapon: 'bow', rarity: 5, hp90: 13200, atk90: 1980, def90: 700, wname: 'Arc du ciel',
      look: { m: true, hair: '#27323f', hairD: '#161c26', hairTip: '#5cd0c4', eye: '#5ad0c0', outfit: '#f3f0e6', outfitD: '#cfcab8', accent: '#3f8a5a', legs: '#f3f0e6', shoes: '#3f8a5a', style: 'braid', head: 'beret', cape: '#3f8a5a' },
      skill: { n: 'Sonate céleste', k: 'vortex', cd: 6, r: 32, dur: 1.2, mult: 3.0, pull: 110, dist: 40, el: 'anemo' },
      burst: { n: 'Ode du vent', k: 'zone', cost: 60, cd: 15, r: 62, dur: 8, tick: 0.5, mult: 0.9, pull: 130, el: 'anemo', swirlInfuse: true },
    }),
    tartaglia: C({
      name: 'Tartaglia', title: 'Onzième des Fatui', el: 'hydro', weapon: 'bow', rarity: 5, hp90: 14000, atk90: 2000, def90: 780, wname: 'Arc des profondeurs',
      look: { m: true, hair: '#e8742c', hairD: '#b8501a', eye: '#4a8fe8', outfit: '#35364a', outfitD: '#222232', accent: '#d03a3a', legs: '#2a2a3a', shoes: '#d03a3a', style: 'spiky', head: 'mask', cape: null },
      skill: { n: 'Legs de l’abysse', k: 'stance', cd: 6, dur: 30, el: 'hydro', mult: 1.45, melee: true, cdStart: true },
      burst: { n: 'Dévastation totale', k: 'nova', cost: 60, cd: 15, r: 56, mult: 3.9, hits: 1, el: 'hydro', knock: 40 },
    }),
    diluc: C({
      name: 'Diluc', title: 'Chevalier des ténèbres', el: 'pyro', weapon: 'claymore', rarity: 5, hp90: 12980, atk90: 2020, def90: 784, wname: 'Pourfendeur de l’aube',
      look: { m: true, hair: '#a8302f', hairD: '#7a1f20', eye: '#d84a3a', outfit: '#25252a', outfitD: '#16161a', accent: '#d9483a', legs: '#2a2a30', shoes: '#16161a', style: 'pony', head: 'none', cape: '#25252a' },
      skill: { n: 'Lame d’aube', k: 'cone', cd: 10, r: 38, arc: 1.5, mult: 1.9, n2: 3, el: 'pyro' },
      burst: { n: 'Aube', k: 'nova', cost: 40, cd: 12, r: 60, mult: 4.2, hits: 1, el: 'pyro', knock: 36, infuse: true },
    }),
    jean: C({
      name: 'Jean', title: 'Grand maître suppléant', el: 'anemo', weapon: 'sword', rarity: 5, hp90: 14695, atk90: 1850, def90: 769, wname: 'Épée de Favonius',
      look: { hair: '#f1d062', hairD: '#c8a53a', eye: '#4a9ee8', outfit: '#2c4a8a', outfitD: '#1e3366', accent: '#f4f0e6', legs: '#f4f0e6', shoes: '#2c4a8a', style: 'pony', head: 'none', cape: '#2c4a8a' },
      skill: { n: 'Lame de la tempête', k: 'vortex', cd: 6, r: 30, dur: 1, mult: 3.2, pull: 90, dist: 36, el: 'anemo' },
      burst: { n: 'Éclat de Dandelion', k: 'zone', cost: 80, cd: 20, r: 62, dur: 10, tick: 1, mult: 0.8, heal: 0.06, el: 'anemo' },
    }),
    neuvillette: C({
      name: 'Neuvillette', title: 'Grand juge', el: 'hydro', weapon: 'catalyst', rarity: 5, hp90: 14695, atk90: 1900, def90: 740, wname: 'Registre du tribunal',
      look: { m: true, hair: '#e8eef4', hairD: '#9fb0c8', hairTip: '#5aa0e8', eye: '#8ac8e8', outfit: '#f2f0f4', outfitD: '#c0c4d2', accent: '#3a5a9a', legs: '#3a4a7a', shoes: '#2a3a6a', style: 'pony', head: 'none', cape: '#3a5a9a' },
      skill: { n: 'Marée du juge', k: 'blast', cd: 8, r: 40, mult: 2.8, el: 'hydro', knock: 20 },
      burst: { n: 'Jugement des flots', k: 'nova', cost: 70, cd: 18, r: 70, mult: 4.5, hits: 1, el: 'hydro', knock: 30 },
    }),
    wriothesley: C({
      name: 'Wriothesley', title: 'Duc de la forteresse', el: 'cryo', weapon: 'catalyst', rarity: 5, hp90: 13103, atk90: 1920, def90: 790, wname: 'Gantelets de givre',
      look: { m: true, hair: '#1e1e2a', hairD: '#0e0e16', eye: '#8ac8e8', outfit: '#2a2e3a', outfitD: '#171a22', accent: '#d8dde8', legs: '#2a2e3a', shoes: '#171a22', style: 'short', head: 'none', cape: '#5a5e6a' },
      skill: { n: 'Chaînes de givre', k: 'heal', cd: 12, r: 44, mult: 2.2, healPct: 0.1, el: 'cryo' },
      burst: { n: 'Tribunal de glace', k: 'nova', cost: 60, cd: 15, r: 60, mult: 3.8, hits: 1, el: 'cryo', healPct: 0.12 },
    }),
  };
  G.CHAR_ORDER = Object.keys(G.CHARS);

  // ---------- Objets ----------
  G.ITEMS = {
    mora: { name: 'Méra', icon: 'mora', rarity: 3, desc: 'La monnaie de Teyvat.' },
    primo: { name: 'Gemme primordiale', icon: 'primo', rarity: 5, desc: 'Cristallise la volonté du ciel. Sert à obtenir des Destins.' },
    fate: { name: 'Destin entrelacé', icon: 'fate', rarity: 5, desc: 'Un lien tissé entre les étoiles. Permet de faire un vœu.' },
    stardust: { name: 'Poussière d’étoile', icon: 'stardust', rarity: 3, desc: 'Reste d’un vœu. Peut s’échanger contre des Destins.' },
    starglitter: { name: 'Éclat d’étoile', icon: 'starglitter', rarity: 4, desc: 'Éclat de vœu. Peut s’échanger contre des Destins.' },
    book1: { name: 'Conseil de l’errant', icon: 'book1', rarity: 2, exp: 1000, desc: 'Donne 1 000 points d’expérience à un personnage.' },
    book2: { name: 'Expérience d’aventurier', icon: 'book2', rarity: 3, exp: 5000, desc: 'Donne 5 000 points d’expérience à un personnage.' },
    book3: { name: 'Sagesse de héros', icon: 'book3', rarity: 4, exp: 20000, desc: 'Donne 20 000 points d’expérience à un personnage.' },
    apple: { name: 'Pomme', icon: 'apple', rarity: 1, heal: 0.12, desc: 'Une pomme croquante. Restaure 12 % des PV max.' },
    bread: { name: 'Pain frais', icon: 'bread', rarity: 2, heal: 0.25, desc: 'Sorti du four de la ville. Restaure 25 % des PV max.' },
    meal: { name: 'Ragoût de Mondstadt', icon: 'meal', rarity: 3, heal: 0.5, desc: 'Un plat copieux. Restaure 50 % des PV max.' },
    flower: { name: 'Fleur douce', icon: 'flower', rarity: 1, desc: 'Fleur sauvage au parfum sucré. Sert aux plats.' },
    dandelion: { name: 'Graine de pissenlit', icon: 'dandelion', rarity: 1, desc: 'Une graine légère portée par le vent.' },
    mushroom: { name: 'Champignon philanémo', icon: 'mushroom', rarity: 1, desc: 'Pousse près des courants d’air.' },
    anemoculus: { name: 'Anémoculus', icon: 'anemoculus', rarity: 3, desc: 'Cristal du vent. À offrir à la Statue des Sept.' },
    slimeC: { name: 'Condensé de gelée', icon: 'slime', rarity: 1, desc: 'Un résidu visqueux. Se revend.' },
    mask: { name: 'Masque abîmé', icon: 'mask', rarity: 1, desc: 'Masque de hilichurl. Se revend.' },
    arrowhead: { name: 'Pointe de flèche', icon: 'arrowhead', rarity: 2, desc: 'Pointe de flèche hilichurl. Se revend.' },
    crystal: { name: 'Fragment d’abysse', icon: 'crystal', rarity: 3, desc: 'Éclat sombre laissé par un mage de l’Abysse.' },
    core: { name: 'Noyau anémo', icon: 'core', rarity: 4, desc: 'Cœur de l’Hypostase Anémo.' },
  };
  G.SELL = { slimeC: 40, mask: 60, arrowhead: 120, crystal: 280, flower: 20, dandelion: 20, mushroom: 30, core: 3000 };
  G.SHOP = [
    { id: 'book1', price: 300 }, { id: 'book2', price: 1200 }, { id: 'book3', price: 5000 },
    { id: 'bread', price: 150 }, { id: 'meal', price: 450 }, { id: 'apple', price: 60 },
  ];

  // ---------- Ennemis ----------
  // hp : multiple de la PV de référence ; atk : % PV de référence du joueur ; spd : px/s
  G.ENEMIES = {
    slime_pyro: { name: 'Gelée Pyro', kind: 'slime', el: 'pyro', hp: 3, atk: 0.05, spd: 26, r: 6, sense: 90, exp: 20, mora: [20, 40], drops: [['slimeC', 0.7], ['book1', 0.08]] },
    slime_hydro: { name: 'Gelée Hydro', kind: 'slime', el: 'hydro', hp: 3, atk: 0.05, spd: 26, r: 6, sense: 90, exp: 20, mora: [20, 40], drops: [['slimeC', 0.7], ['book1', 0.08]] },
    slime_cryo: { name: 'Gelée Cryo', kind: 'slime', el: 'cryo', hp: 3, atk: 0.05, spd: 26, r: 6, sense: 90, exp: 20, mora: [20, 40], drops: [['slimeC', 0.7], ['book1', 0.08]] },
    slime_electro: { name: 'Gelée Électro', kind: 'slime', el: 'electro', hp: 3, atk: 0.05, spd: 28, r: 6, sense: 90, exp: 20, mora: [20, 40], drops: [['slimeC', 0.7], ['book1', 0.08]] },
    slime_anemo: { name: 'Gelée Anémo', kind: 'slime', el: 'anemo', hp: 3, atk: 0.05, spd: 28, r: 6, sense: 90, exp: 20, mora: [20, 40], drops: [['slimeC', 0.7], ['book1', 0.08]] },
    slime_big: { name: 'Grande Gelée', kind: 'slime', el: 'hydro', hp: 14, atk: 0.09, spd: 22, r: 10, sense: 100, exp: 60, mora: [60, 110], drops: [['slimeC', 1], ['book2', 0.2]], big: true },
    hilichurl: { name: 'Hilichurl', kind: 'melee', el: null, hp: 5, atk: 0.08, spd: 34, r: 6, sense: 100, exp: 35, mora: [30, 60], drops: [['mask', 0.7], ['arrowhead', 0.2], ['apple', 0.1], ['book1', 0.12]] },
    hili_archer: { name: 'Hilichurl archer', kind: 'ranged', el: null, hp: 4, atk: 0.07, spd: 30, r: 6, sense: 150, range: 120, exp: 40, mora: [30, 60], drops: [['arrowhead', 0.6], ['mask', 0.5], ['book1', 0.12]] },
    hili_fighter: { name: 'Hilichurl combattant', kind: 'melee', el: null, hp: 5.5, atk: 0.09, spd: 40, r: 6, sense: 110, exp: 40, mora: [30, 60], drops: [['mask', 0.7], ['book1', 0.15]], rush: true },
    mitachurl: { name: 'Mitachurl', kind: 'brute', el: null, hp: 26, atk: 0.14, spd: 24, r: 9, sense: 110, exp: 140, mora: [150, 260], drops: [['mask', 1], ['book2', 0.6], ['bread', 0.3]], shield: true },
    mage_pyro: { name: 'Mage Abyssal Pyro', kind: 'mage', el: 'pyro', hp: 7, atk: 0.09, spd: 28, r: 6, sense: 150, range: 130, exp: 80, mora: [60, 100], drops: [['crystal', 0.8], ['book2', 0.3]], shieldHP: 3 },
    mage_hydro: { name: 'Mage Abyssal Hydro', kind: 'mage', el: 'hydro', hp: 7, atk: 0.09, spd: 28, r: 6, sense: 150, range: 130, exp: 80, mora: [60, 100], drops: [['crystal', 0.8], ['book2', 0.3]], shieldHP: 3 },
    mage_cryo: { name: 'Mage Abyssal Cryo', kind: 'mage', el: 'cryo', hp: 7, atk: 0.09, spd: 28, r: 6, sense: 150, range: 130, exp: 80, mora: [60, 100], drops: [['crystal', 0.8], ['book2', 0.3]], shieldHP: 3 },
    mage_electro: { name: 'Mage Abyssal Électro', kind: 'mage', el: 'electro', hp: 7, atk: 0.09, spd: 28, r: 6, sense: 150, range: 130, exp: 80, mora: [60, 100], drops: [['crystal', 0.8], ['book2', 0.3]], shieldHP: 3 },
    hypostasis: { name: 'Hypostase Anémo', kind: 'boss', el: 'anemo', hp: 330, atk: 0.16, spd: 30, r: 16, sense: 400, range: 200, exp: 2000, mora: [4000, 6000], drops: [['core', 1], ['book3', 2], ['book2', 3]], boss: true },
  };

  // Réactions élémentaires (nom affiché + couleur)
  G.REACT = {
    vaporize: { fr: 'Vaporisation', color: '#ffb36a' },
    melt: { fr: 'Fonte', color: '#ffcf7a' },
    overload: { fr: 'Surcharge', color: '#ff6a8a' },
    electrocharged: { fr: 'Électrocution', color: '#d49cff' },
    superconduct: { fr: 'Superconduction', color: '#b8e8ff' },
    frozen: { fr: 'Gel', color: '#a8f0ff' },
    swirl: { fr: 'Diffusion', color: '#7af0c4' },
    shatter: { fr: 'Brisure', color: '#dff8ff' },
  };

  // ---------- Progression ----------
  G.sLevel = (L) => 0.05 + 0.95 * Math.pow((L - 1) / 89, 1.1);
  G.charExpToNext = (L) => 60 + 25 * L;
  G.arExpToNext = (ar) => 200 + 80 * ar;
  G.enemyLevel = (ar, bonus) => G.clamp(Math.round(2 + ar * 1.45) + (bonus || 0), 1, 90);
  G.REF_PLAYER_HP = 15000;

  // ---------- Vœux ----------
  G.BANNERS = [
    { id: 'event', name: 'Chant du vent', sub: 'Venti · Barde de Mondstadt', featured5: 'venti', featured4: ['diona', 'thoma', 'sethos'] },
    { id: 'standard', name: 'Vœu des voyageurs', sub: 'Tous les personnages de Mondstadt', featured5: null, featured4: [] },
  ];
  G.POOL5 = ['keqing', 'diluc', 'jean', 'cyno', 'lyney', 'kazuha', 'neuvillette', 'wriothesley'];
  G.POOL4 = ['kaeya', 'xingqiu', 'thoma', 'sethos', 'bennett', 'diona', 'razor'];
})();
