/** Écrans de menu : titre, mondes, création, chargement, options, pause, mort… */
import { h, button, slider, cycle, clear } from '../dom';
import type { Screen } from '../ui';
import type { AppApi } from '../../app/api';
import { drawLogo, SPLASHES } from '../logo';
import { DEFAULT_RULES, type GameMode, type WorldMeta } from '../../save/storage';
import { seedFromString } from '../../engine/rng';
import { DEFAULT_BINDINGS, type Action } from '../../input/input';

const MODE_LABEL: Record<GameMode, string> = { survie: 'Mode survie', creatif: 'Mode créatif', hardcore: 'Mode hardcore', spectateur: 'Mode spectateur' };
const DIFF = ['Paisible', 'Facile', 'Normale', 'Difficile'];

function fmtDate(t: number): string {
  const d = new Date(t);
  return d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// ---------------------------------------------------------------------------
export function mainMenu(app: AppApi): Screen {
  const logo = drawLogo();
  logo.style.width = `${logo.width * 1.25}px`;
  const splash = h('div', { class: 'splash' }, SPLASHES[Math.floor(Math.random() * SPLASHES.length)]);
  const sub = h('div', {
    style: { position: 'absolute', left: '50%', bottom: '-14px', transform: 'translateX(-50%)', fontSize: '22px', letterSpacing: '4px', color: '#f0d8a0', textShadow: '2px 2px 0 #4a2a10, -1px -1px 0 #4a2a10' },
  }, 'ÉDITION WEB');
  const el = h(
    'div',
    { class: 'screen blur' },
    h('div', { class: 'logo-wrap' }, logo, sub, splash),
    h(
      'div',
      { class: 'menu-buttons' },
      button('Solo', () => app.ui.push(worldSelect(app))),
      button('Multijoueur', () => app.ui.push(multiplayerScreen(app))),
      button('Mods et contenu', () => app.ui.push(modsScreen(app))),
      h(
        'div',
        { class: 'row', style: { marginTop: '14px' } },
        button('🌐', () => app.ui.push(helpScreen(app)), 'square icon-btn'),
        button('Options...', () => app.ui.push(optionsScreen(app, false)), 'half'),
        button('Quitter le jeu', () => app.ui.push(quitScreen(app)), 'half'),
        button('♿', () => app.ui.push(optionsScreen(app, false)), 'square icon-btn'),
      ),
    ),
    h('div', { class: 'corner left' }, `Voxerra ${app.version}`),
    h('div', { class: 'corner right' }, 'Fangame original — aucun contenu tiers'),
  );
  return { el, onEscape: () => {} };
}

function quitScreen(app: AppApi): Screen {
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, 'À bientôt !'),
    h('div', { class: 'subtitle' }, 'Vos mondes sont sauvegardés dans ce navigateur.'),
    h('div', { class: 'subtitle', style: { marginBottom: '20px' } }, 'Vous pouvez fermer cet onglet en toute sécurité.'),
    button('Retour', () => app.ui.pop()),
  );
  return { el };
}

// ---------------------------------------------------------------------------
export function worldSelect(app: AppApi): Screen {
  let worlds: WorldMeta[] = [];
  let sel: WorldMeta | null = null;
  const search = h('input', { class: 'input', placeholder: 'Rechercher un monde…' }) as HTMLInputElement;
  const list = h('div', { class: 'world-list' });
  const playBtn = button('Jouer au monde sélectionné', () => sel && app.startWorld(sel, false), 'half');
  const editBtn = button('Modifier', () => sel && app.ui.push(editWorld(app, sel, refresh)), 'third');
  const delBtn = button('Supprimer', () =>
    sel &&
    app.ui.push(
      confirmScreen(app, `Supprimer « ${sel.name} » ?`, 'Ce monde sera perdu pour toujours ! (Longtemps !)', async () => {
        await app.storage.deleteWorld(sel!.id);
        sel = null;
        await refresh();
      }),
    ), 'third');
  const recreateBtn = button('Recréer', () => sel && app.ui.push(createWorld(app, sel)), 'third');
  const render = () => {
    clear(list);
    const q = search.value.trim().toLowerCase();
    const shown = worlds.filter((w) => !q || w.name.toLowerCase().includes(q));
    if (shown.length === 0) list.appendChild(h('div', { class: 'list-empty' }, worlds.length ? 'Aucun monde ne correspond.' : 'Aucun monde pour l’instant. Créez-en un !'));
    for (const w of shown) {
      const thumb = w.thumbnail ? h('img', { src: w.thumbnail }) : h('div', { class: 'thumb' });
      const modeCls = w.gameMode === 'hardcore' ? 'mode-hard' : '';
      const item = h(
        'div',
        { class: 'world-item' + (sel?.id === w.id ? ' sel' : '') },
        thumb,
        h(
          'div',
          { class: 'info' },
          h('div', { class: 'name' }, w.name),
          h('div', { class: 'meta' }, `${w.id} (${fmtDate(w.lastPlayed)})`),
          h('div', { class: 'meta' }, h('span', { class: modeCls }, MODE_LABEL[w.gameMode] ?? w.gameMode), w.allowCommands ? ', Commandes' : '', `, Version ${w.version === 1 ? app.version : w.version}`),
        ),
      );
      item.addEventListener('click', () => {
        sel = w;
        render();
      });
      item.addEventListener('dblclick', () => app.startWorld(w, false));
      list.appendChild(item);
    }
    for (const b of [playBtn, editBtn, delBtn, recreateBtn]) b.disabled = !sel;
  };
  const refresh = async () => {
    worlds = await app.storage.listWorlds();
    if (sel) sel = worlds.find((w) => w.id === sel!.id) ?? null;
    render();
  };
  search.addEventListener('input', render);
  const el = h(
    'div',
    { class: 'screen dim', style: { justifyContent: 'flex-start', paddingTop: '14px' } },
    h('div', { class: 'label', style: { marginTop: '0' } }, 'Choisir un monde'),
    search,
    h('div', { style: { height: '10px' } }),
    list,
    h(
      'div',
      { class: 'bottom-bar two-rows' },
      h('div', { class: 'row' }, playBtn, button('Créer un nouveau monde', () => app.ui.push(createWorld(app, null)), 'half')),
      h('div', { class: 'row' }, editBtn, delBtn, recreateBtn, button('Retour', () => app.ui.pop(), 'third')),
    ),
  );
  refresh();
  setTimeout(() => search.focus(), 50);
  return { el, onKey: (e) => {
    if (e.code === 'Enter' && sel) {
      app.startWorld(sel, false);
      return true;
    }
  } };
}

// ---------------------------------------------------------------------------
export function createWorld(app: AppApi, base: WorldMeta | null): Screen {
  const id = 'monde-' + Date.now().toString(36);
  const st = {
    name: base ? base.name : 'Nouveau monde',
    mode: (base?.gameMode ?? 'survie') as GameMode,
    difficulty: base?.difficulty ?? 2,
    commands: base?.allowCommands ?? false,
    seed: base ? base.seedText : '',
    worldType: (base?.worldType ?? 'normal') as 'normal' | 'plat',
    structures: base?.structures ?? true,
    bonusChest: base?.bonusChest ?? false,
    rules: { ...DEFAULT_RULES, ...(base?.rules ?? {}) },
  };
  const body = h('div', { class: 'col', style: { marginTop: '40px' } });
  const tabs: HTMLButtonElement[] = [];
  const tabNames = ['Partie', 'Monde', 'Plus'];
  const show = (i: number) => {
    tabs.forEach((t, k) => t.classList.toggle('on', k === i));
    clear(body);
    if (i === 0) {
      const nameIn = h('input', { class: 'input', value: st.name, maxlength: 40 }) as HTMLInputElement;
      nameIn.addEventListener('input', () => (st.name = nameIn.value));
      const diffBtn = cycle('Difficulté', DIFF.map((t, v) => ({ v, t })), st.difficulty, (v) => (st.difficulty = v));
      diffBtn.disabled = st.mode === 'hardcore';
      const cmd = cycle('Autoriser les commandes', [{ v: false, t: 'NON' }, { v: true, t: 'OUI' }], st.commands, (v) => (st.commands = v));
      body.append(
        h('div', { class: 'label' }, 'Nom du monde'),
        nameIn,
        h('div', { class: 'tooltip-inline' }, `Dossier de sauvegarde : ${id}`),
        cycle('Mode de jeu', [
          { v: 'survie' as GameMode, t: 'Survie' },
          { v: 'creatif' as GameMode, t: 'Créatif' },
          { v: 'hardcore' as GameMode, t: 'Hardcore' },
        ], st.mode, (v) => {
          st.mode = v;
          if (v === 'hardcore') st.difficulty = 3;
          if (v === 'creatif') st.commands = true;
          show(0);
        }),
        diffBtn,
        cmd,
        h('div', { class: 'hint', style: { maxWidth: '400px', textAlign: 'center' } }, st.mode === 'hardcore' ? 'Une seule vie : à la mort, le monde passe en mode spectateur.' : st.mode === 'creatif' ? 'Ressources illimitées, vol libre, destruction instantanée.' : 'Récoltez, fabriquez, survivez. Faim, santé et température comptent.'),
      );
      setTimeout(() => nameIn.focus(), 30);
    } else if (i === 1) {
      const seedIn = h('input', { class: 'input', value: st.seed, placeholder: 'Laisser vide pour une graine aléatoire' }) as HTMLInputElement;
      seedIn.addEventListener('input', () => (st.seed = seedIn.value));
      body.append(
        h('div', { class: 'label' }, 'Graine du générateur de monde'),
        seedIn,
        h('div', { class: 'hint' }, 'Une même graine produit toujours le même monde.'),
        cycle('Type de monde', [{ v: 'normal' as const, t: 'Normal' }, { v: 'plat' as const, t: 'Plat (construction)' }], st.worldType, (v) => (st.worldType = v)),
        cycle('Générer les structures', [{ v: true, t: 'OUI' }, { v: false, t: 'NON' }], st.structures, (v) => (st.structures = v)),
        cycle('Coffre bonus', [{ v: false, t: 'NON' }, { v: true, t: 'OUI' }], st.bonusChest, (v) => (st.bonusChest = v)),
      );
    } else {
      const rule = (label: string, key: keyof typeof st.rules) => cycle(label, [{ v: true, t: 'OUI' }, { v: false, t: 'NON' }], st.rules[key], (v) => (st.rules[key] = v));
      body.append(
        h('div', { class: 'label' }, 'Règles du jeu'),
        rule('Garder l’inventaire à la mort', 'keepInventory'),
        rule('Cycle jour/nuit', 'daylightCycle'),
        rule('Cycle météo', 'weatherCycle'),
        rule('Apparition des créatures', 'mobSpawning'),
        rule('Régénération naturelle', 'naturalRegen'),
        rule('Dégâts de chute', 'fallDamage'),
      );
    }
  };
  tabNames.forEach((n, i) => {
    const t = h('button', { class: 'tab', onclick: () => show(i) }, n) as HTMLButtonElement;
    tabs.push(t);
  });
  const create = () => {
    const seedText = st.seed.trim();
    const seed = seedFromString(seedText);
    const now = Date.now();
    const meta: WorldMeta = {
      id,
      name: st.name.trim() || 'Nouveau monde',
      seed,
      seedText: seedText || String(seed),
      version: 1,
      created: now,
      lastPlayed: now,
      gameMode: st.mode,
      difficulty: st.mode === 'hardcore' ? 3 : st.difficulty,
      allowCommands: st.commands,
      worldType: st.worldType,
      structures: st.structures,
      bonusChest: st.bonusChest,
      rules: st.rules,
      time: 1000,
      weather: { state: 'clair', timer: 12000 },
      spawn: null,
      player: null,
      dimension: 'surface',
      portals: [],
      advancements: [],
      stats: {},
      bosses: [],
      playTime: 0,
    };
    app.startWorld(meta, true);
  };
  const el = h(
    'div',
    { class: 'screen dim', style: { justifyContent: 'flex-start' } },
    h('div', { class: 'tabs' }, ...tabs),
    body,
    h('div', { class: 'bottom-bar' }, button('Créer le nouveau monde', create, 'half'), button('Annuler', () => app.ui.pop(), 'half')),
  );
  show(0);
  return { el };
}

function editWorld(app: AppApi, meta: WorldMeta, refresh: () => void): Screen {
  const nameIn = h('input', { class: 'input', value: meta.name, maxlength: 40 }) as HTMLInputElement;
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, 'Modifier le monde'),
    h('div', { class: 'label' }, 'Nom du monde'),
    nameIn,
    h('div', { class: 'hint' }, `Graine : ${meta.seedText}`),
    h('div', { class: 'hint' }, `Créé le ${fmtDate(meta.created)} — temps de jeu : ${Math.round((meta.playTime ?? 0) / 60)} min`),
    h('div', { style: { height: '20px' } }),
    button('Enregistrer', async () => {
      const m = await app.storage.loadMeta(meta.id);
      if (m) {
        m.name = nameIn.value.trim() || m.name;
        await app.storage.saveBatch(m, []);
      }
      app.ui.pop();
      refresh();
    }),
    button('Exporter (JSON des paramètres)', () => {
      const blob = new Blob([JSON.stringify({ name: meta.name, seed: meta.seedText, mode: meta.gameMode }, null, 2)], { type: 'application/json' });
      const a = h('a', { href: URL.createObjectURL(blob), download: `${meta.id}.json` });
      a.click();
    }),
    button('Annuler', () => app.ui.pop()),
  );
  return { el };
}

export function confirmScreen(app: AppApi, title: string, text: string, onYes: () => void | Promise<void>): Screen {
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, title),
    h('div', { class: 'subtitle', style: { marginBottom: '24px' } }, text),
    h('div', { class: 'row' }, button('Confirmer', async () => {
      app.ui.pop();
      await onYes();
    }, 'half'), button('Annuler', () => app.ui.pop(), 'half')),
  );
  return { el };
}

export function messageScreen(app: AppApi, title: string, text: string): Screen {
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, title),
    h('div', { class: 'subtitle', style: { marginBottom: '24px', maxWidth: '640px', textAlign: 'center' } }, text),
    button('Retour au menu', () => app.ui.pop()),
  );
  return { el };
}

// ---------------------------------------------------------------------------
export interface LoadingHandle {
  screen: Screen;
  set(label: string, done: number, total: number): void;
  map(draw: (g: CanvasRenderingContext2D, size: number) => void): void;
}

export function loadingScreen(): LoadingHandle {
  const label = h('div', { class: 'subtitle' }, 'Préparation…');
  const fill = h('div');
  const bar = h('div', { class: 'loading-bar' }, fill);
  const canvas = h('canvas', { class: 'chunk-map', width: 100, height: 100 }) as HTMLCanvasElement;
  canvas.style.width = '100px';
  canvas.style.height = '100px';
  const el = h('div', { class: 'screen blur' }, label, bar, canvas);
  return {
    screen: { el, onEscape: () => {} },
    set(t, done, total) {
      label.textContent = t;
      fill.style.width = `${Math.round((total ? done / total : 0) * 100)}%`;
    },
    map(draw) {
      const g = canvas.getContext('2d')!;
      draw(g, canvas.width);
    },
  };
}

// ---------------------------------------------------------------------------
export function optionsScreen(app: AppApi, inGame: boolean): Screen {
  const s = app.settings;
  const save = () => {
    app.saveSettings();
    app.applySettings();
  };
  const grid = h(
    'div',
    { class: 'options-grid' },
    slider({ label: (v) => `Champ de vision : ${v}°`, min: 50, max: 110, step: 1, value: s.fov, onChange: (v) => ((s.fov = v), save()) }),
    slider({ label: (v) => `Distance d’affichage : ${v} tronçons`, min: 3, max: 16, step: 1, value: s.renderDistance, onChange: (v) => ((s.renderDistance = v), save()) }),
    slider({ label: (v) => `Sensibilité : ${Math.round(v * 100)} %`, min: 0.2, max: 3, step: 0.05, value: s.sensitivity, onChange: (v) => ((s.sensitivity = v), save()) }),
    slider({ label: (v) => `Volume général : ${Math.round(v * 100)} %`, min: 0, max: 1, step: 0.05, value: s.masterVolume, onChange: (v) => ((s.masterVolume = v), save()) }),
    slider({ label: (v) => `Musique : ${Math.round(v * 100)} %`, min: 0, max: 1, step: 0.05, value: s.musicVolume, onChange: (v) => ((s.musicVolume = v), save()) }),
    slider({ label: (v) => `Effets sonores : ${Math.round(v * 100)} %`, min: 0, max: 1, step: 0.05, value: s.sfxVolume, onChange: (v) => ((s.sfxVolume = v), save()) }),
    cycle('Nuages', [{ v: true, t: 'OUI' }, { v: false, t: 'NON' }], s.clouds, (v) => ((s.clouds = v), save())),
    cycle('Particules', [{ v: 'tout' as const, t: 'Toutes' }, { v: 'reduit' as const, t: 'Réduites' }, { v: 'minimal' as const, t: 'Minimales' }], s.particles, (v) => ((s.particles = v), save())),
    cycle('Balancement de la vue', [{ v: true, t: 'OUI' }, { v: false, t: 'NON' }], s.viewBobbing, (v) => ((s.viewBobbing = v), save())),
    cycle('Inverser la souris', [{ v: false, t: 'NON' }, { v: true, t: 'OUI' }], s.invertY, (v) => ((s.invertY = v), save())),
    cycle('Culling des grottes', [{ v: true, t: 'OUI' }, { v: false, t: 'NON' }], s.caveCulling, (v) => ((s.caveCulling = v), save())),
    cycle('Afficher les IPS', [{ v: false, t: 'NON' }, { v: true, t: 'OUI' }], s.showFps, (v) => ((s.showFps = v), save())),
    cycle('Résolution', [{ v: 0.75, t: 'Performance' }, { v: 1, t: 'Normale' }, { v: 1.5, t: 'Haute' }], s.pixelRatio, (v) => ((s.pixelRatio = v), save())),
    cycle('Taille de l’interface', [{ v: 0.85, t: 'Petite' }, { v: 1, t: 'Normale' }, { v: 1.2, t: 'Grande' }], s.guiScale, (v) => ((s.guiScale = v), save())),
  );
  const nameIn = h('input', { class: 'input', value: s.playerName, maxlength: 16 }) as HTMLInputElement;
  nameIn.addEventListener('change', () => {
    s.playerName = nameIn.value.trim() || 'Aventurier';
    save();
  });
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, 'Options'),
    h('div', { class: 'row', style: { alignItems: 'center', marginBottom: '10px' } }, h('div', { class: 'label' }, 'Pseudo :'), nameIn),
    grid,
    h('div', { style: { height: '16px' } }),
    h('div', { class: 'row' }, button('Commandes…', () => app.ui.push(controlsScreen(app)), 'half'), button('Terminé', () => app.ui.pop(), 'half')),
  );
  void inGame;
  return { el, pauses: inGame };
}

const ACTION_LABELS: Partial<Record<Action, string>> = {
  forward: 'Avancer',
  back: 'Reculer',
  left: 'Aller à gauche',
  right: 'Aller à droite',
  jump: 'Sauter / nager',
  sneak: 'S’accroupir',
  sprint: 'Courir',
  attack: 'Attaquer / casser',
  use: 'Utiliser / poser',
  pick: 'Choisir le bloc',
  inventory: 'Inventaire',
  drop: 'Lâcher l’objet',
  chat: 'Discussion',
  command: 'Commande',
  dodge: 'Esquive',
  perspective: 'Changer de vue',
  advancements: 'Progrès',
  debug: 'Informations de débogage',
  hideHud: 'Masquer l’interface',
  screenshot: 'Capture d’écran',
  players: 'Liste des joueurs',
};

function keyName(code: string): string {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  const map: Record<string, string> = { Mouse0: 'Clic gauche', Mouse1: 'Clic milieu', Mouse2: 'Clic droit', Space: 'Espace', ShiftLeft: 'Maj gauche', ControlLeft: 'Ctrl gauche', Escape: 'Échap', Slash: '/', Enter: 'Entrée', Tab: 'Tab' };
  return map[code] ?? code;
}

export function controlsScreen(app: AppApi): Screen {
  const list = h('div', { class: 'keybind-list' });
  let waiting: Action | null = null;
  const render = () => {
    clear(list);
    for (const a of Object.keys(ACTION_LABELS) as Action[]) {
      const codes = app.settings.bindings[a] ?? [];
      const b = h('button', { class: 'btn small', style: { width: '200px' } }, waiting === a ? '> ??? <' : codes.map(keyName).join(', ') || '—') as HTMLButtonElement;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        waiting = a;
        render();
      });
      list.appendChild(h('div', { class: 'keybind-row' }, h('span', {}, ACTION_LABELS[a]!), b));
    }
  };
  const capture = (code: string) => {
    if (!waiting) return false;
    app.settings.bindings[waiting] = [code];
    waiting = null;
    app.saveSettings();
    app.applySettings();
    render();
    return true;
  };
  const mouse = (e: MouseEvent) => {
    if (waiting && (e.target as HTMLElement).tagName !== 'BUTTON') capture('Mouse' + e.button);
  };
  window.addEventListener('mousedown', mouse, true);
  render();
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, 'Commandes'),
    h('div', { class: 'hint', style: { marginBottom: '8px' } }, 'Cliquez sur une touche puis appuyez sur la nouvelle. Manette compatible (Xbox/PlayStation standard).'),
    list,
    h('div', { style: { height: '12px' } }),
    h('div', { class: 'row' }, button('Réinitialiser', () => {
      app.settings.bindings = structuredClone(DEFAULT_BINDINGS);
      app.saveSettings();
      app.applySettings();
      render();
    }, 'half'), button('Terminé', () => app.ui.pop(), 'half')),
  );
  return {
    el,
    onKey: (e) => {
      if (waiting && e.type === 'keydown') {
        if (e.code === 'Escape') {
          waiting = null;
          render();
          return true;
        }
        return capture(e.code);
      }
    },
    onClose: () => window.removeEventListener('mousedown', mouse, true),
  };
}

// ---------------------------------------------------------------------------
export function multiplayerScreen(app: AppApi): Screen {
  const list = h('div', { class: 'world-list', style: { height: '260px' } });
  let sel = 0;
  const render = () => {
    clear(list);
    app.settings.servers.forEach((s, i) => {
      const it = h('div', { class: 'world-item' + (i === sel ? ' sel' : '') }, h('div', { class: 'thumb', style: { background: '#2a3a4a' } }), h('div', { class: 'info' }, h('div', { class: 'name' }, s.name), h('div', { class: 'meta' }, s.address)));
      it.addEventListener('click', () => {
        sel = i;
        render();
      });
      it.addEventListener('dblclick', () => app.connect(s.address, app.settings.playerName));
      list.appendChild(it);
    });
    if (!app.settings.servers.length) list.appendChild(h('div', { class: 'list-empty' }, 'Aucun serveur. Ajoutez-en un.'));
  };
  const addr = h('input', { class: 'input', placeholder: 'adresse:25590 (ex. localhost)' }) as HTMLInputElement;
  const el = h(
    'div',
    { class: 'screen dim', style: { justifyContent: 'flex-start', paddingTop: '20px' } },
    h('div', { class: 'title', style: { marginBottom: '6px' } }, 'Jouer en multijoueur'),
    h('div', { class: 'hint', style: { marginBottom: '10px', maxWidth: '620px', textAlign: 'center' } }, 'Lancez un serveur avec « npm run server » puis connectez-vous. Le serveur est autoritaire : blocs, créatures, temps et sauvegarde sont gérés par lui.'),
    list,
    h('div', { style: { height: '10px' } }),
    addr,
    h(
      'div',
      { class: 'bottom-bar two-rows' },
      h('div', { class: 'row' }, button('Rejoindre le serveur', () => app.settings.servers[sel] && app.connect(app.settings.servers[sel].address, app.settings.playerName), 'half'), button('Connexion directe', () => addr.value && app.connect(addr.value.trim(), app.settings.playerName), 'half')),
      h('div', { class: 'row' }, button('Ajouter', () => {
        if (!addr.value.trim()) return;
        app.settings.servers.push({ name: 'Serveur ' + (app.settings.servers.length + 1), address: addr.value.trim() });
        app.saveSettings();
        render();
      }, 'third'), button('Supprimer', () => {
        app.settings.servers.splice(sel, 1);
        sel = 0;
        app.saveSettings();
        render();
      }, 'third'), button('Retour', () => app.ui.pop(), 'third')),
    ),
  );
  render();
  return { el };
}

export function modsScreen(app: AppApi): Screen {
  const list = h('div', { class: 'world-list', style: { height: '280px' } });
  const status = h('div', { class: 'hint', style: { margin: '6px' } });
  const render = () => {
    clear(list);
    for (const m of app.mods) {
      const item = h('div', { class: 'world-item' }, h('div', { class: 'thumb', style: { background: m.builtin ? '#3a5a3a' : '#4a3a6a' } }), h('div', { class: 'info' }, h('div', { class: 'name' }, `${m.name} (${m.id})`), h('div', { class: 'meta' }, m.summary), h('div', { class: 'meta' }, m.builtin ? 'Pack fourni (public/mods)' : 'Importé')));
      if (!m.builtin) {
        const del = h('button', { class: 'btn small', style: { width: '110px', marginLeft: 'auto' } }, 'Retirer') as HTMLButtonElement;
        del.addEventListener('click', (e) => {
          e.stopPropagation();
          app.removeMod(m.id);
          status.textContent = 'Mod retiré. Redémarrez la page pour appliquer.';
          render();
        });
        item.appendChild(del);
      }
      list.appendChild(item);
    }
    if (!app.mods.length) list.appendChild(h('div', { class: 'list-empty' }, 'Aucun mod chargé.'));
  };
  const file = h('input', { type: 'file', accept: '.json,application/json', style: { display: 'none' } }) as HTMLInputElement;
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    if (!f) return;
    status.textContent = await app.importMod(await f.text());
    render();
  });
  const el = h(
    'div',
    { class: 'screen dim', style: { justifyContent: 'flex-start', paddingTop: '20px' } },
    h('div', { class: 'title', style: { marginBottom: '6px' } }, 'Mods et contenu'),
    h('div', { class: 'hint', style: { maxWidth: '620px', textAlign: 'center', marginBottom: '10px' } }, 'Les mods sont des packs JSON : blocs, objets, textures procédurales, recettes, créatures, butins, progrès, biomes. Aucun code n’est exécuté.'),
    list,
    status,
    file,
    h('div', { class: 'bottom-bar' }, button('Importer un pack JSON…', () => file.click(), 'half'), button('Retour', () => app.ui.pop(), 'half')),
  );
  render();
  return { el };
}

export function helpScreen(app: AppApi): Screen {
  const lines = [
    ['ZQSD / WASD', 'Se déplacer'],
    ['Espace', 'Sauter, nager (double appui : voler en créatif)'],
    ['Maj', 'S’accroupir (ne tombe pas des rebords)'],
    ['Ctrl / R', 'Courir'],
    ['Clic gauche', 'Casser / attaquer (attendre la recharge = plus de dégâts)'],
    ['Clic droit', 'Poser, utiliser, manger, tirer à l’arc (maintenir), bloquer'],
    ['C', 'Esquive (brève invulnérabilité)'],
    ['E', 'Inventaire et fabrication 2x2'],
    ['1-9 / molette', 'Barre rapide'],
    ['Q', 'Lâcher (Ctrl+Q : toute la pile)'],
    ['T ou Entrée', 'Discussion ; « / » pour les commandes (/aide)'],
    ['L', 'Progrès'],
    ['F3', 'Informations (coordonnées, biome, performances)'],
    ['F5 / V', 'Vue à la troisième personne'],
    ['F1 / F2', 'Masquer l’interface / capture d’écran'],
  ];
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, 'Aide et contrôles'),
    h('div', { class: 'stats-table' }, ...lines.map(([k, v]) => h('div', { class: 'srow' }, h('span', { style: { color: '#ffe080' } }, k), h('span', {}, v)))),
    h('div', { class: 'hint', style: { margin: '12px', maxWidth: '560px', textAlign: 'center' } }, 'Progression : bois → pierre → cuivre → fer → célestine (atelier puis forge runique) → portail de pierres runiques vers l’Abîme → Tyran des braises → clé astrale → Cimes astrales → Veilleur astral.'),
    button('Retour', () => app.ui.pop()),
  );
  return { el, pauses: true };
}

// ---------------------------------------------------------------------------
export function pauseScreen(app: AppApi, opts: { advancements: () => void; stats: () => void; saveQuit: () => void; lan: () => void; multiplayer: boolean }): Screen {
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'subtitle', style: { marginBottom: '24px', fontSize: '20px' } }, 'Menu du jeu'),
    h(
      'div',
      { class: 'menu-buttons' },
      button('Retour au jeu', () => app.ui.pop()),
      h('div', { class: 'row' }, button('Progrès', opts.advancements, 'half'), button('Statistiques', opts.stats, 'half')),
      h('div', { class: 'row' }, button('Aide et contrôles', () => app.ui.push(helpScreen(app)), 'half'), button('Mods et contenu', () => app.ui.push(modsScreen(app)), 'half')),
      h('div', { class: 'row' }, button('Options...', () => app.ui.push(optionsScreen(app, true)), 'half'), button(opts.multiplayer ? 'Infos du serveur' : 'Ouvrir au réseau', opts.lan, 'half')),
      button(opts.multiplayer ? 'Se déconnecter' : 'Sauvegarder et quitter vers le titre', opts.saveQuit),
    ),
  );
  return { el, pauses: true };
}

export function lanInfoScreen(app: AppApi): Screen {
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, 'Jouer à plusieurs'),
    h('div', { class: 'stats-table' },
      h('div', { class: 'srow' }, h('span', {}, '1. Dans le dossier du projet :'), h('span', { style: { color: '#ffe080' } }, 'npm run server')),
      h('div', { class: 'srow' }, h('span', {}, '2. Port par défaut :'), h('span', {}, '25590 (WebSocket)')),
      h('div', { class: 'srow' }, h('span', {}, '3. Menu principal → Multijoueur'), h('span', {}, 'ws://IP:25590')),
      h('div', { class: 'srow' }, h('span', {}, 'Monde du serveur :'), h('span', {}, 'saves/serveur (fichiers)')),
    ),
    h('div', { style: { height: '14px' } }),
    button('Retour', () => app.ui.pop()),
  );
  return { el, pauses: true };
}

export function deathScreen(app: AppApi, message: string, score: number, hardcore: boolean, onRespawn: () => void, onTitle: () => void): Screen {
  const respawn = button(hardcore ? 'Observer le monde (spectateur)' : 'Réapparaître', onRespawn);
  respawn.disabled = true;
  setTimeout(() => (respawn.disabled = false), 1200);
  const el = h(
    'div',
    { class: 'screen death fade-in' },
    h('div', { class: 'title' }, hardcore ? 'Partie terminée !' : 'Vous êtes mort !'),
    h('div', { class: 'subtitle' }, message),
    h('div', { class: 'subtitle', style: { marginBottom: '30px' } }, 'Score : ', h('span', { style: { color: '#ffff55' } }, String(score))),
    h('div', { class: 'menu-buttons' }, respawn, button('Écran titre', onTitle)),
    !hardcore ? h('div', { class: 'hint', style: { marginTop: '16px' } }, 'Vos objets reposent dans une tombe à l’endroit de votre mort.') : null,
  );
  return { el, onEscape: () => {} };
}

export function statsScreen(app: AppApi, stats: Record<string, number>, playTime: number): Screen {
  const labels: Record<string, string> = {
    blocs_casses: 'Blocs cassés',
    blocs_poses: 'Blocs posés',
    creatures_tuees: 'Créatures vaincues',
    morts: 'Morts',
    degats_infliges: 'Dégâts infligés',
    degats_subis: 'Dégâts subis',
    objets_ramasses: 'Objets ramassés',
    objets_fabriques: 'Objets fabriqués',
    repas: 'Repas',
    nuits_dormies: 'Nuits dormies',
    distance: 'Distance parcourue (blocs)',
    sauts: 'Sauts',
    coups_bloques: 'Coups bloqués',
    boss_vaincus: 'Boss vaincus',
  };
  const rows = [h('div', { class: 'srow' }, h('span', {}, 'Temps de jeu'), h('span', {}, `${Math.floor(playTime / 3600)} h ${Math.floor((playTime % 3600) / 60)} min`))];
  for (const [k, label] of Object.entries(labels)) rows.push(h('div', { class: 'srow' }, h('span', {}, label), h('span', {}, String(Math.round(stats[k] ?? 0)))));
  const el = h('div', { class: 'screen dim' }, h('div', { class: 'title' }, 'Statistiques'), h('div', { class: 'stats-table' }, ...rows), h('div', { style: { height: '12px' } }), button('Terminé', () => app.ui.pop()));
  return { el, pauses: true };
}
