/** Écrans de menu : titre, mondes, création, chargement, options, pause, mort… */
import { h, button, slider, cycle, clear } from '../dom';
import type { Screen } from '../ui';
import type { AppApi } from '../../app/api';
import { drawLogo, SPLASHES } from '../logo';
import { DEFAULT_RULES, type GameMode, type WorldMeta } from '../../save/storage';
import { seedFromString } from '../../engine/rng';
import { DEFAULT_BINDINGS, type Action } from '../../input/input';
import { t, tr, locale, getLang, LANGS, type Lang } from '../../i18n/i18n';

const MODE_LABEL = (m: GameMode): string => ({ survie: t('Mode survie'), creatif: t('Mode créatif'), hardcore: t('Mode hardcore'), spectateur: t('Mode spectateur') })[m] ?? m;
const DIFF = (): string[] => [t('Paisible'), t('Facile'), t('Normale'), t('Difficile')];
const YES_NO = <T,>(yes: T, no: T, yesFirst = true) => (yesFirst ? [{ v: yes, t: t('OUI') }, { v: no, t: t('NON') }] : [{ v: no, t: t('NON') }, { v: yes, t: t('OUI') }]);

function fmtDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString(locale()) + ' ' + d.toLocaleTimeString(locale(), { hour: '2-digit', minute: '2-digit' });
}

/** Signature de l'auteur (affichée au-dessus du numéro de version). */
export const AUTHOR = '@Fullboss971';

// ---------------------------------------------------------------------------
export function mainMenu(app: AppApi): Screen {
  const logo = drawLogo();
  logo.style.width = `${logo.width * 1.25}px`;
  const splash = h('div', { class: 'splash' }, t(SPLASHES[Math.floor(Math.random() * SPLASHES.length)]));
  const sub = h('div', {
    style: { position: 'absolute', left: '50%', bottom: '-14px', transform: 'translateX(-50%)', fontSize: '22px', letterSpacing: '4px', color: '#f0d8a0', textShadow: '2px 2px 0 #4a2a10, -1px -1px 0 #4a2a10' },
  }, t('ÉDITION WEB'));
  const el = h(
    'div',
    { class: 'screen blur' },
    h('div', { class: 'logo-wrap' }, logo, sub, splash),
    h(
      'div',
      { class: 'menu-buttons' },
      button(t('Solo'), () => app.ui.push(worldSelect(app))),
      button(t('Multijoueur'), () => app.ui.push(multiplayerScreen(app))),
      button(t('Mods et contenu'), () => app.ui.push(modsScreen(app))),
      h(
        'div',
        { class: 'row', style: { marginTop: '14px' } },
        button('🌐', () => app.ui.push(languageScreen(app)), 'square icon-btn'),
        button(t('Options...'), () => app.ui.push(optionsScreen(app, false)), 'half'),
        button(t('Quitter le jeu'), () => {
          const host = appHost();
          if (host) host.quit();
          else app.ui.push(quitScreen(app));
        }, 'half'),
        button('?', () => app.ui.push(helpScreen(app)), 'square icon-btn'),
      ),
    ),
    h('div', { class: 'corner left' }, h('div', { class: 'author' }, AUTHOR), h('div', {}, `Voxerra ${app.version}`)),
    h('div', { class: 'corner right' }, t('Fangame original — aucun contenu tiers')),
  );
  return { el, onEscape: () => {} };
}

/** Version installée (Windows, Android) : l'application hôte sait fermer le jeu. */
function appHost(): { quit(): void } | undefined {
  return (globalThis as { voxerraHost?: { quit(): void } }).voxerraHost;
}

function quitScreen(app: AppApi): Screen {
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, t('À bientôt !')),
    h('div', { class: 'subtitle' }, t('Vos mondes sont sauvegardés dans ce navigateur.')),
    h('div', { class: 'subtitle', style: { marginBottom: '20px' } }, t('Vous pouvez fermer cet onglet en toute sécurité.')),
    button(t('Retour'), () => app.ui.pop()),
  );
  return { el };
}

/** Choix de la langue (bouton globe du menu principal). */
export function languageScreen(app: AppApi): Screen {
  const pick = (l: Lang) => {
    app.setLanguage(l);
    app.ui.pop();
    app.showMainMenu();
  };
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, t('Langue')),
    h('div', { class: 'menu-buttons' }, ...LANGS.map((l) => {
      const b = button((l.id === getLang() ? '> ' : '') + l.name + (l.id === getLang() ? ' <' : ''), () => pick(l.id));
      return b;
    })),
    h('div', { style: { height: '14px' } }),
    button(t('Retour'), () => app.ui.pop()),
  );
  return { el };
}

// ---------------------------------------------------------------------------
export function worldSelect(app: AppApi): Screen {
  let worlds: WorldMeta[] = [];
  let sel: WorldMeta | null = null;
  const search = h('input', { class: 'input', placeholder: t('Rechercher un monde…') }) as HTMLInputElement;
  const list = h('div', { class: 'world-list' });
  const playBtn = button(t('Jouer au monde sélectionné'), () => sel && app.startWorld(sel, false), 'half');
  const editBtn = button(t('Modifier'), () => sel && app.ui.push(editWorld(app, sel, refresh)), 'third');
  const delBtn = button(t('Supprimer'), () =>
    sel &&
    app.ui.push(
      confirmScreen(app, t('Supprimer « {name} » ?', { name: sel.name }), t('Ce monde sera perdu pour toujours ! (Longtemps !)'), async () => {
        await app.storage.deleteWorld(sel!.id);
        sel = null;
        await refresh();
      }),
    ), 'third');
  const recreateBtn = button(t('Recréer'), () => sel && app.ui.push(createWorld(app, sel)), 'third');
  const render = () => {
    clear(list);
    const q = search.value.trim().toLowerCase();
    const shown = worlds.filter((w) => !q || w.name.toLowerCase().includes(q));
    if (shown.length === 0) list.appendChild(h('div', { class: 'list-empty' }, worlds.length ? t('Aucun monde ne correspond.') : t('Aucun monde pour l’instant. Créez-en un !')));
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
          h('div', { class: 'meta' }, h('span', { class: modeCls }, MODE_LABEL(w.gameMode)), w.allowCommands ? ', ' + t('Commandes') : '', `, Version ${w.version === 1 ? app.version : w.version}`),
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
    h('div', { class: 'label', style: { marginTop: '0' } }, t('Choisir un monde')),
    search,
    h('div', { style: { height: '10px' } }),
    list,
    h(
      'div',
      { class: 'bottom-bar two-rows' },
      h('div', { class: 'row' }, playBtn, button(t('Créer un nouveau monde'), () => app.ui.push(createWorld(app, null)), 'half')),
      h('div', { class: 'row' }, editBtn, delBtn, recreateBtn, button(t('Retour'), () => app.ui.pop(), 'third')),
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
    name: base ? base.name : t('Nouveau monde'),
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
  const tabNames = [t('Partie'), t('Monde'), t('Plus')];
  const show = (i: number) => {
    tabs.forEach((tb, k) => tb.classList.toggle('on', k === i));
    clear(body);
    if (i === 0) {
      const nameIn = h('input', { class: 'input', value: st.name, maxlength: 40 }) as HTMLInputElement;
      nameIn.addEventListener('input', () => (st.name = nameIn.value));
      const diffBtn = cycle(t('Difficulté'), DIFF().map((label, v) => ({ v, t: label })), st.difficulty, (v) => (st.difficulty = v));
      diffBtn.disabled = st.mode === 'hardcore';
      const cmd = cycle(t('Autoriser les commandes'), YES_NO(true, false, false), st.commands, (v) => (st.commands = v));
      body.append(
        h('div', { class: 'label' }, t('Nom du monde')),
        nameIn,
        h('div', { class: 'tooltip-inline' }, t('Dossier de sauvegarde : {id}', { id })),
        cycle(t('Mode de jeu'), [
          { v: 'survie' as GameMode, t: t('Survie') },
          { v: 'creatif' as GameMode, t: t('Créatif') },
          { v: 'hardcore' as GameMode, t: t('Hardcore') },
        ], st.mode, (v) => {
          st.mode = v;
          if (v === 'hardcore') st.difficulty = 3;
          if (v === 'creatif') st.commands = true;
          show(0);
        }),
        diffBtn,
        cmd,
        h('div', { class: 'hint', style: { maxWidth: '400px', textAlign: 'center' } }, st.mode === 'hardcore' ? t('Une seule vie : à la mort, le monde passe en mode spectateur.') : st.mode === 'creatif' ? t('Ressources illimitées, vol libre, destruction instantanée.') : t('Récoltez, fabriquez, survivez. Faim, santé et température comptent.')),
      );
      setTimeout(() => nameIn.focus(), 30);
    } else if (i === 1) {
      const seedIn = h('input', { class: 'input', value: st.seed, placeholder: t('Laisser vide pour une graine aléatoire') }) as HTMLInputElement;
      seedIn.addEventListener('input', () => (st.seed = seedIn.value));
      body.append(
        h('div', { class: 'label' }, t('Graine du générateur de monde')),
        seedIn,
        h('div', { class: 'hint' }, t('Une même graine produit toujours le même monde.')),
        cycle(t('Type de monde'), [{ v: 'normal' as const, t: t('Normal') }, { v: 'plat' as const, t: t('Plat (construction)') }], st.worldType, (v) => (st.worldType = v)),
        cycle(t('Générer les structures'), YES_NO(true, false), st.structures, (v) => (st.structures = v)),
        cycle(t('Coffre bonus'), YES_NO(true, false, false), st.bonusChest, (v) => (st.bonusChest = v)),
      );
    } else {
      const rule = (label: string, key: keyof typeof st.rules) => cycle(label, YES_NO(true, false), st.rules[key], (v) => (st.rules[key] = v));
      body.append(
        h('div', { class: 'label' }, t('Règles du jeu')),
        rule(t('Garder l’inventaire à la mort'), 'keepInventory'),
        rule(t('Cycle jour/nuit'), 'daylightCycle'),
        rule(t('Cycle météo'), 'weatherCycle'),
        rule(t('Apparition des créatures'), 'mobSpawning'),
        rule(t('Régénération naturelle'), 'naturalRegen'),
        rule(t('Dégâts de chute'), 'fallDamage'),
      );
    }
  };
  tabNames.forEach((n, i) => {
    const tb = h('button', { class: 'tab', onclick: () => show(i) }, n) as HTMLButtonElement;
    tabs.push(tb);
  });
  const create = () => {
    const seedText = st.seed.trim();
    const seed = seedFromString(seedText);
    const now = Date.now();
    const meta: WorldMeta = {
      id,
      name: st.name.trim() || t('Nouveau monde'),
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
    h('div', { class: 'bottom-bar' }, button(t('Créer le nouveau monde'), create, 'half'), button(t('Annuler'), () => app.ui.pop(), 'half')),
  );
  show(0);
  return { el };
}

function editWorld(app: AppApi, meta: WorldMeta, refresh: () => void): Screen {
  const nameIn = h('input', { class: 'input', value: meta.name, maxlength: 40 }) as HTMLInputElement;
  let commands = meta.allowCommands;
  const cmdBtn = meta.gameMode === 'hardcore' ? null : cycle(t('Autoriser les commandes'), YES_NO(true, false, false), commands, (v) => (commands = v));
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, t('Modifier le monde')),
    h('div', { class: 'label' }, t('Nom du monde')),
    nameIn,
    h('div', { class: 'hint' }, t('Graine : {seed}', { seed: meta.seedText })),
    h('div', { class: 'hint' }, t('Créé le {date} — temps de jeu : {min} min', { date: fmtDate(meta.created), min: Math.round((meta.playTime ?? 0) / 60) })),
    h('div', { style: { height: '12px' } }),
    cmdBtn,
    h('div', { style: { height: '12px' } }),
    button(t('Enregistrer'), async () => {
      const m = await app.storage.loadMeta(meta.id);
      if (m) {
        m.name = nameIn.value.trim() || m.name;
        m.allowCommands = commands;
        await app.storage.saveBatch(m, []);
      }
      app.ui.pop();
      refresh();
    }),
    button(t('Exporter (JSON des paramètres)'), () => {
      const blob = new Blob([JSON.stringify({ name: meta.name, seed: meta.seedText, mode: meta.gameMode }, null, 2)], { type: 'application/json' });
      const a = h('a', { href: URL.createObjectURL(blob), download: `${meta.id}.json` });
      a.click();
    }),
    button(t('Annuler'), () => app.ui.pop()),
  );
  return { el };
}

export function confirmScreen(app: AppApi, title: string, text: string, onYes: () => void | Promise<void>): Screen {
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, title),
    h('div', { class: 'subtitle', style: { marginBottom: '24px' } }, text),
    h('div', { class: 'row' }, button(t('Confirmer'), async () => {
      app.ui.pop();
      await onYes();
    }, 'half'), button(t('Annuler'), () => app.ui.pop(), 'half')),
  );
  return { el };
}

export function messageScreen(app: AppApi, title: string, text: string): Screen {
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, title),
    h('div', { class: 'subtitle', style: { marginBottom: '24px', maxWidth: '640px', textAlign: 'center' } }, text),
    button(t('Retour au menu'), () => app.ui.pop()),
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
  const label = h('div', { class: 'subtitle' }, t('Préparation…'));
  const fill = h('div');
  const bar = h('div', { class: 'loading-bar' }, fill);
  const canvas = h('canvas', { class: 'chunk-map', width: 100, height: 100 }) as HTMLCanvasElement;
  canvas.style.width = '100px';
  canvas.style.height = '100px';
  const el = h('div', { class: 'screen blur' }, label, bar, canvas);
  return {
    screen: { el, onEscape: () => {} },
    set(text, done, total) {
      label.textContent = t(text);
      fill.style.width = `${Math.round((total ? done / total : 0) * 100)}%`;
    },
    map(draw) {
      const g = canvas.getContext('2d')!;
      draw(g, canvas.width);
    },
  };
}

// ---------------------------------------------------------------------------
/** Interrupteur des contrôles tactiles (joystick), partagé par Options et Commandes. */
function touchToggle(app: AppApi): HTMLButtonElement {
  return cycle(t('Contrôles tactiles'), YES_NO(true, false, false), app.settings.touchControls, (v) => {
    app.settings.touchControls = v;
    app.saveSettings();
    app.applySettings();
  });
}

export function optionsScreen(app: AppApi, inGame: boolean): Screen {
  const s = app.settings;
  const save = () => {
    app.saveSettings();
    app.applySettings();
  };
  let touchBtn = touchToggle(app);
  const grid = h(
    'div',
    { class: 'options-grid' },
    touchBtn,
    slider({ label: (v) => t('Champ de vision : {v}°', { v }), min: 50, max: 110, step: 1, value: s.fov, onChange: (v) => ((s.fov = v), save()) }),
    slider({ label: (v) => t('Distance d’affichage : {v} tronçons', { v }), min: 3, max: 16, step: 1, value: s.renderDistance, onChange: (v) => ((s.renderDistance = v), save()) }),
    slider({ label: (v) => t('Sensibilité : {v} %', { v: Math.round(v * 100) }), min: 0.2, max: 3, step: 0.05, value: s.sensitivity, onChange: (v) => ((s.sensitivity = v), save()) }),
    slider({ label: (v) => t('Volume général : {v} %', { v: Math.round(v * 100) }), min: 0, max: 1, step: 0.05, value: s.masterVolume, onChange: (v) => ((s.masterVolume = v), save()) }),
    slider({ label: (v) => t('Musique : {v} %', { v: Math.round(v * 100) }), min: 0, max: 1, step: 0.05, value: s.musicVolume, onChange: (v) => ((s.musicVolume = v), save()) }),
    slider({ label: (v) => t('Effets sonores : {v} %', { v: Math.round(v * 100) }), min: 0, max: 1, step: 0.05, value: s.sfxVolume, onChange: (v) => ((s.sfxVolume = v), save()) }),
    cycle(t('Langue'), LANGS.map((l) => ({ v: l.id, t: l.name })), getLang(), (v) => {
      app.setLanguage(v);
      app.ui.pop();
      app.ui.push(optionsScreen(app, inGame));
    }),
    cycle(t('Nuages'), YES_NO(true, false), s.clouds, (v) => ((s.clouds = v), save())),
    cycle(t('Particules'), [{ v: 'tout' as const, t: t('Toutes') }, { v: 'reduit' as const, t: t('Réduites') }, { v: 'minimal' as const, t: t('Minimales') }], s.particles, (v) => ((s.particles = v), save())),
    cycle(t('Balancement de la vue'), YES_NO(true, false), s.viewBobbing, (v) => ((s.viewBobbing = v), save())),
    cycle(t('Inverser la souris'), YES_NO(true, false, false), s.invertY, (v) => ((s.invertY = v), save())),
    cycle(t('Culling des grottes'), YES_NO(true, false), s.caveCulling, (v) => ((s.caveCulling = v), save())),
    cycle(t('Afficher les IPS'), YES_NO(true, false, false), s.showFps, (v) => ((s.showFps = v), save())),
    cycle(t('Résolution'), [{ v: 0.75, t: t('Performance') }, { v: 1, t: t('Normale') }, { v: 1.5, t: t('Haute') }], s.pixelRatio, (v) => ((s.pixelRatio = v), save())),
    cycle(t('Taille de l’interface'), [{ v: 0.85, t: t('Petite') }, { v: 1, t: t('Normale') }, { v: 1.2, t: t('Grande') }], s.guiScale, (v) => ((s.guiScale = v), save())),
  );
  const nameIn = h('input', { class: 'input', value: s.playerName, maxlength: 16 }) as HTMLInputElement;
  nameIn.addEventListener('change', () => {
    s.playerName = nameIn.value.trim() || t('Aventurier');
    save();
  });
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, t('Options')),
    h('div', { class: 'row', style: { alignItems: 'center', marginBottom: '10px' } }, h('div', { class: 'label' }, t('Pseudo :')), nameIn),
    grid,
    h('div', { style: { height: '16px' } }),
    h('div', { class: 'row' }, button(t('Commandes…'), () => app.ui.push(controlsScreen(app, () => {
      const nb = touchToggle(app);
      touchBtn.replaceWith(nb);
      touchBtn = nb;
    })), 'half'), button(t('Terminé'), () => app.ui.pop(), 'half')),
  );
  void inGame;
  return { el, pauses: inGame };
}

const ACTION_LABELS_FR: Partial<Record<Action, string>> = {
  forward: tr('Avancer'),
  back: tr('Reculer'),
  left: tr('Aller à gauche'),
  right: tr('Aller à droite'),
  jump: tr('Sauter / nager'),
  sneak: tr('S’accroupir'),
  sprint: tr('Courir'),
  attack: tr('Attaquer / casser'),
  use: tr('Utiliser / poser'),
  pick: tr('Choisir le bloc'),
  inventory: tr('Inventaire'),
  drop: tr('Lâcher l’objet'),
  chat: tr('Discussion'),
  command: tr('Commande'),
  dodge: tr('Esquive'),
  perspective: tr('Changer de vue'),
  advancements: tr('Progrès'),
  debug: tr('Informations de débogage'),
  hideHud: tr('Masquer l’interface'),
  screenshot: tr('Capture d’écran'),
  players: tr('Liste des joueurs'),
};

function keyName(code: string): string {
  if (code.startsWith('Key')) return code.slice(3);
  if (code.startsWith('Digit')) return code.slice(5);
  const map: Record<string, string> = { Mouse0: t('Clic gauche'), Mouse1: t('Clic milieu'), Mouse2: t('Clic droit'), Space: t('Espace'), ShiftLeft: t('Maj gauche'), ControlLeft: t('Ctrl gauche'), Escape: t('Échap'), Slash: '/', Enter: t('Entrée'), Tab: 'Tab' };
  return map[code] ?? code;
}

export function controlsScreen(app: AppApi, onClose?: () => void): Screen {
  const list = h('div', { class: 'keybind-list' });
  let waiting: Action | null = null;
  const render = () => {
    clear(list);
    for (const a of Object.keys(ACTION_LABELS_FR) as Action[]) {
      const codes = app.settings.bindings[a] ?? [];
      const b = h('button', { class: 'btn small', style: { width: '200px' } }, waiting === a ? '> ??? <' : codes.map(keyName).join(', ') || '—') as HTMLButtonElement;
      b.addEventListener('click', (e) => {
        e.stopPropagation();
        waiting = a;
        render();
      });
      list.appendChild(h('div', { class: 'keybind-row' }, h('span', {}, t(ACTION_LABELS_FR[a]!)), b));
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
    h('div', { class: 'title' }, t('Commandes')),
    touchToggle(app),
    h('div', { class: 'hint', style: { margin: '4px 0 12px', maxWidth: '620px', textAlign: 'center' } }, t('Joystick à gauche pour se déplacer, bouton 🏃 à côté pour courir (un appui : court, un autre : marche), boutons à droite, glissez sur l’écran pour regarder, touchez pour utiliser / poser ou frapper, appui long pour casser.')),
    h('div', { class: 'hint', style: { marginBottom: '8px' } }, t('Cliquez sur une touche puis appuyez sur la nouvelle. Manette compatible (Xbox/PlayStation standard).')),
    list,
    h('div', { style: { height: '12px' } }),
    h('div', { class: 'row' }, button(t('Réinitialiser'), () => {
      app.settings.bindings = structuredClone(DEFAULT_BINDINGS);
      app.saveSettings();
      app.applySettings();
      render();
    }, 'half'), button(t('Terminé'), () => app.ui.pop(), 'half')),
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
    onClose: () => {
      window.removeEventListener('mousedown', mouse, true);
      onClose?.();
    },
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
    if (!app.settings.servers.length) list.appendChild(h('div', { class: 'list-empty' }, t('Aucun serveur. Ajoutez-en un.')));
  };
  const addr = h('input', { class: 'input', placeholder: t('adresse:25590 (ex. localhost)') }) as HTMLInputElement;
  const el = h(
    'div',
    { class: 'screen dim', style: { justifyContent: 'flex-start', paddingTop: '20px' } },
    h('div', { class: 'title', style: { marginBottom: '6px' } }, t('Jouer en multijoueur')),
    h('div', { class: 'hint', style: { marginBottom: '10px', maxWidth: '620px', textAlign: 'center' } }, t('Lancez un serveur avec « npm run server » puis connectez-vous. Le serveur est autoritaire : blocs, créatures, temps et sauvegarde sont gérés par lui.')),
    list,
    h('div', { style: { height: '10px' } }),
    addr,
    h(
      'div',
      { class: 'bottom-bar two-rows' },
      h('div', { class: 'row' }, button(t('Rejoindre le serveur'), () => app.settings.servers[sel] && app.connect(app.settings.servers[sel].address, app.settings.playerName), 'half'), button(t('Connexion directe'), () => addr.value && app.connect(addr.value.trim(), app.settings.playerName), 'half')),
      h('div', { class: 'row' }, button(t('Ajouter'), () => {
        if (!addr.value.trim()) return;
        app.settings.servers.push({ name: t('Serveur {n}', { n: app.settings.servers.length + 1 }), address: addr.value.trim() });
        app.saveSettings();
        render();
      }, 'third'), button(t('Supprimer'), () => {
        app.settings.servers.splice(sel, 1);
        sel = 0;
        app.saveSettings();
        render();
      }, 'third'), button(t('Retour'), () => app.ui.pop(), 'third')),
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
      const item = h('div', { class: 'world-item' }, h('div', { class: 'thumb', style: { background: m.builtin ? '#3a5a3a' : '#4a3a6a' } }), h('div', { class: 'info' }, h('div', { class: 'name' }, `${m.name} (${m.id})`), h('div', { class: 'meta' }, m.summary), h('div', { class: 'meta' }, m.builtin ? t('Pack fourni (public/mods)') : t('Importé'))));
      if (!m.builtin) {
        const del = h('button', { class: 'btn small', style: { width: '110px', marginLeft: 'auto' } }, t('Retirer')) as HTMLButtonElement;
        del.addEventListener('click', (e) => {
          e.stopPropagation();
          app.removeMod(m.id);
          status.textContent = t('Mod retiré. Redémarrez la page pour appliquer.');
          render();
        });
        item.appendChild(del);
      }
      list.appendChild(item);
    }
    if (!app.mods.length) list.appendChild(h('div', { class: 'list-empty' }, t('Aucun mod chargé.')));
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
    h('div', { class: 'title', style: { marginBottom: '6px' } }, t('Mods et contenu')),
    h('div', { class: 'hint', style: { maxWidth: '620px', textAlign: 'center', marginBottom: '10px' } }, t('Les mods sont des packs JSON : blocs, objets, textures procédurales, recettes, créatures, butins, progrès, biomes. Aucun code n’est exécuté.')),
    list,
    status,
    file,
    h('div', { class: 'bottom-bar' }, button(t('Importer un pack JSON…'), () => file.click(), 'half'), button(t('Retour'), () => app.ui.pop(), 'half')),
  );
  render();
  return { el };
}

export function helpScreen(app: AppApi): Screen {
  const lines = [
    ['ZQSD / WASD', t('Se déplacer')],
    [t('Espace'), t('Sauter, nager (double appui : voler en créatif)')],
    [t('Maj'), t('S’accroupir (ne tombe pas des rebords)')],
    ['Ctrl / R', t('Courir')],
    [t('Clic gauche'), t('Casser / attaquer (attendre la recharge = plus de dégâts)')],
    [t('Clic droit'), t('Poser, utiliser, manger, tirer à l’arc (maintenir), bloquer')],
    ['C', t('Esquive (brève invulnérabilité)')],
    ['E', t('Inventaire et fabrication 2x2')],
    [t('1-9 / molette'), t('Barre rapide')],
    ['Q', t('Lâcher (Ctrl+Q : toute la pile)')],
    [t('T ou Entrée'), t('Discussion ; « / » pour les commandes (/aide)')],
    ['L', t('Progrès')],
    ['F3', t('Informations (coordonnées, biome, performances)')],
    ['F5 / V', t('Vue à la troisième personne')],
    ['F1 / F2', t('Masquer l’interface / capture d’écran')],
  ];
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, t('Aide et contrôles')),
    h('div', { class: 'stats-table' }, ...lines.map(([k, v]) => h('div', { class: 'srow' }, h('span', { style: { color: '#ffe080' } }, k), h('span', {}, v)))),
    h('div', { class: 'hint', style: { margin: '12px', maxWidth: '560px', textAlign: 'center' } }, t('Progression : bois → pierre → cuivre → fer → célestine (atelier puis forge runique) → portail de pierres runiques vers l’Abîme → Tyran des braises → clé astrale → Cimes astrales → Veilleur astral. À tout moment : portail de pierres d’aurore allumé à la plume d’azur vers les Îles célestes.')),
    button(t('Retour'), () => app.ui.pop()),
  );
  return { el, pauses: true };
}

// ---------------------------------------------------------------------------
export function pauseScreen(app: AppApi, opts: { advancements: () => void; stats: () => void; saveQuit: () => void; lan: () => void; multiplayer: boolean }): Screen {
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'subtitle', style: { marginBottom: '24px', fontSize: '20px' } }, t('Menu du jeu')),
    h(
      'div',
      { class: 'menu-buttons' },
      button(t('Retour au jeu'), () => app.ui.pop()),
      h('div', { class: 'row' }, button(t('Progrès'), opts.advancements, 'half'), button(t('Statistiques'), opts.stats, 'half')),
      h('div', { class: 'row' }, button(t('Aide et contrôles'), () => app.ui.push(helpScreen(app)), 'half'), button(t('Mods et contenu'), () => app.ui.push(modsScreen(app)), 'half')),
      h('div', { class: 'row' }, button(t('Options...'), () => app.ui.push(optionsScreen(app, true)), 'half'), button(opts.multiplayer ? t('Infos du serveur') : t('Ouvrir au réseau'), opts.lan, 'half')),
      button(opts.multiplayer ? t('Se déconnecter') : t('Sauvegarder et quitter vers le titre'), opts.saveQuit),
    ),
  );
  return { el, pauses: true };
}

export function lanInfoScreen(app: AppApi): Screen {
  const el = h(
    'div',
    { class: 'screen dim' },
    h('div', { class: 'title' }, t('Jouer à plusieurs')),
    h('div', { class: 'stats-table' },
      h('div', { class: 'srow' }, h('span', {}, t('1. Dans le dossier du projet :')), h('span', { style: { color: '#ffe080' } }, 'npm run server')),
      h('div', { class: 'srow' }, h('span', {}, t('2. Port par défaut :')), h('span', {}, '25590 (WebSocket)')),
      h('div', { class: 'srow' }, h('span', {}, t('3. Menu principal → Multijoueur')), h('span', {}, 'ws://IP:25590')),
      h('div', { class: 'srow' }, h('span', {}, t('Monde du serveur :')), h('span', {}, t('saves/serveur (fichiers)'))),
    ),
    h('div', { style: { height: '14px' } }),
    button(t('Retour'), () => app.ui.pop()),
  );
  return { el, pauses: true };
}

export function deathScreen(app: AppApi, message: string, score: number, hardcore: boolean, onRespawn: () => void, onTitle: () => void): Screen {
  const respawn = button(hardcore ? t('Observer le monde (spectateur)') : t('Réapparaître'), onRespawn);
  respawn.disabled = true;
  setTimeout(() => (respawn.disabled = false), 1200);
  const el = h(
    'div',
    { class: 'screen death fade-in' },
    h('div', { class: 'title' }, hardcore ? t('Partie terminée !') : t('Vous êtes mort !')),
    h('div', { class: 'subtitle' }, message),
    h('div', { class: 'subtitle', style: { marginBottom: '30px' } }, t('Score : '), h('span', { style: { color: '#ffff55' } }, String(score))),
    h('div', { class: 'menu-buttons' }, respawn, button(t('Écran titre'), onTitle)),
    !hardcore ? h('div', { class: 'hint', style: { marginTop: '16px' } }, t('Vos objets reposent dans une tombe à l’endroit de votre mort.')) : null,
  );
  return { el, onEscape: () => {} };
}

export function statsScreen(app: AppApi, stats: Record<string, number>, playTime: number): Screen {
  const labels: Record<string, string> = {
    blocs_casses: tr('Blocs cassés'),
    blocs_poses: tr('Blocs posés'),
    creatures_tuees: tr('Créatures vaincues'),
    morts: tr('Morts'),
    degats_infliges: tr('Dégâts infligés'),
    degats_subis: tr('Dégâts subis'),
    objets_ramasses: tr('Objets ramassés'),
    objets_fabriques: tr('Objets fabriqués'),
    repas: tr('Repas'),
    nuits_dormies: tr('Nuits dormies'),
    distance: tr('Distance parcourue (blocs)'),
    sauts: tr('Sauts'),
    coups_bloques: tr('Coups bloqués'),
    boss_vaincus: tr('Boss vaincus'),
  };
  const rows = [h('div', { class: 'srow' }, h('span', {}, t('Temps de jeu')), h('span', {}, `${Math.floor(playTime / 3600)} h ${Math.floor((playTime % 3600) / 60)} min`))];
  for (const [k, label] of Object.entries(labels)) rows.push(h('div', { class: 'srow' }, h('span', {}, t(label)), h('span', {}, String(Math.round(stats[k] ?? 0)))));
  const el = h('div', { class: 'screen dim' }, h('div', { class: 'title' }, t('Statistiques')), h('div', { class: 'stats-table' }, ...rows), h('div', { style: { height: '12px' } }), button(t('Terminé'), () => app.ui.pop()));
  return { el, pauses: true };
}
