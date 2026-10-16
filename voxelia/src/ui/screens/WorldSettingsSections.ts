/**
 * Panneaux de l'écran « Paramètres du monde » : Général, Avancé, Multijoueur, Triches,
 * Packs de ressources, Règles du jeu et Expériences. Chaque réglage lit et écrit la copie
 * de travail `host.meta` (seule source de vérité : `meta.rules` pour les règles).
 */
import { button, clickSound, confirmDialog, h, img, segmented, slider, textField, toast, toggle } from '../dom';
import { permissionIcon, type PermissionKind } from './WorldSettingsArt';
import { defaultRules, type Difficulty, type Experiments, type GameMode, type GameRules, type WorldMeta } from '../../save/SaveManager';
import type { WorldTemplate } from '../../world/gen/terrain';
import type { AppContext } from '../../core/AppContext';
import type { PackInfo } from '../../packs/ResourcePacks';

export type SectionId = 'general' | 'advanced' | 'multiplayer' | 'cheats' | 'packs' | 'rules' | 'experiments' | 'manage';

/** Ce que l'écran met à disposition des panneaux. */
export interface WsHost {
  readonly app: AppContext;
  /** Copie de travail des réglages du monde. */
  readonly meta: WorldMeta;
  /** Monde existant : graine, modèle et options de génération sont figés. */
  readonly editing: boolean;
  /** Le joueur local est déjà apparu dans ce monde (carte et coffre de départ déjà donnés). */
  readonly hasPlayed: boolean;
  /** Mode de jeu actuel du personnage local (édition), sinon null. */
  readonly playerMode: GameMode | null;
  /** Graine saisie (création uniquement). */
  seedInput: string;
  packs: PackInfo[] | null;
  packsError: string;
  packTab: 'active' | 'available';
  /** Une valeur a changé (rafraîchit l'aperçu si besoin). */
  changed(): void;
  /** Reconstruit le panneau affiché (défilement et focus conservés). */
  rerender(): void;
  goto(section: SectionId): void;
  openTemplates(): void;
  setPlayerMode(mode: GameMode): void;
  importPack(): void;
}

// ---------------------------------------------------------------- textes partagés

export const FIXED_NOTE = 'Fixé à la création du monde';

/**
 * Réglages enregistrés dans le monde mais encore lus par aucune partie du jeu :
 * on ne les affiche pas tant qu'ils n'ont pas d'effet réel (retirer l'entrée pour les montrer).
 */
const NOT_WIRED = new Set<string>(['rules.pvp', 'experiments.tradeRebalance']);

export const TEMPLATES: Array<{ id: WorldTemplate; name: string; desc: string }> = [
  { id: 'default', name: 'Normal', desc: 'Relief varié : plaines, forêts, montagnes, rivières et océans.' },
  { id: 'flat', name: 'Plat', desc: 'Un sol parfaitement plat, idéal pour construire.' },
  { id: 'archipelago', name: 'Archipel', desc: "Un vaste océan chaud parsemé d'îles." },
  { id: 'amplified', name: 'Amplifié', desc: 'Des montagnes bien plus hautes et des vallées vertigineuses.' },
  { id: 'continents', name: 'Continents', desc: "De grandes terres d'un seul tenant et moins d'océan." },
];

export function templateName(t: WorldTemplate): string {
  return TEMPLATES.find((x) => x.id === t)?.name ?? 'Normal';
}

const MODE_DESC: Record<GameMode, string> = {
  survival: 'Explorez, récoltez des ressources, fabriquez vos outils et défendez-vous contre les monstres. Surveillez votre santé et votre faim.',
  creative: 'Ressources illimitées, vol libre et blocs cassés en un coup : construisez sans limites, sans dégâts ni faim.',
  adventure: "Comme en Survie, mais sans pouvoir casser ni poser de blocs : idéal pour parcourir une carte construite par d'autres.",
  spectator: 'Vous traversez les blocs et observez le monde sans pouvoir agir dessus.',
};

const DIFF_DESC: Record<Difficulty, string> = {
  peaceful: "Aucun monstre hostile. La santé se régénère d'elle-même et la faim ne diminue pas.",
  easy: "Les monstres apparaissent mais infligent moins de dégâts. La faim peut faire descendre la santé jusqu'à cinq cœurs.",
  normal: "Les monstres apparaissent et infligent des dégâts normaux. La faim peut faire descendre la santé jusqu'à un demi-cœur.",
  hard: 'Les monstres sont plus nombreux et frappent plus fort. La faim peut être mortelle.',
};

type RuleKey = keyof GameRules;
type BoolRule = { [K in RuleKey]: GameRules[K] extends boolean ? K : never }[RuleKey];

/** Libellés, descriptions et emplacement de chaque règle (une seule commande par règle). */
const RULES: Record<RuleKey, { label: string; desc: string; where: SectionId; cheat?: boolean }> = {
  daylightCycle: { label: 'Cycle jour/nuit', desc: 'Le temps passe du jour à la nuit.', where: 'cheats', cheat: true },
  keepInventory: { label: "Conserver l'inventaire", desc: 'Gardez vos objets et votre expérience à la mort.', where: 'cheats', cheat: true },
  mobSpawning: { label: 'Apparition des créatures', desc: 'Les créatures apparaissent naturellement dans le monde.', where: 'cheats', cheat: true },
  mobGriefing: { label: 'Dégâts des créatures sur le monde', desc: 'Les explosions de créatures détruisent les blocs. Désactivé, aucune explosion ne détruit de blocs.', where: 'cheats', cheat: true },
  weatherCycle: { label: 'Cycle météo', desc: 'La pluie et les orages vont et viennent au fil du temps.', where: 'cheats', cheat: true },
  randomTickSpeed: { label: 'Vitesse des mises à jour aléatoires', desc: "Rythme des événements aléatoires : pousse des plantes, propagation de l'herbe et du feu… 0 les arrête (par défaut : 1).", where: 'cheats', cheat: true },
  fallDamage: { label: 'Dégâts de chute', desc: 'Les chutes de haut font perdre de la santé.', where: 'rules' },
  fireDamage: { label: 'Dégâts du feu', desc: 'Le feu et la lave brûlent les joueurs.', where: 'rules' },
  drowningDamage: { label: 'Noyade', desc: "Rester sous l'eau sans air fait perdre de la santé.", where: 'rules' },
  pvp: { label: 'Combat entre joueurs', desc: 'Les joueurs peuvent se blesser entre eux.', where: 'rules' },
  fireSpread: { label: 'Propagation du feu', desc: 'Le feu se propage et consume les blocs inflammables.', where: 'advanced' },
  tntExplodes: { label: 'La TNT explose', desc: 'Les explosions de TNT détruisent les blocs alentour.', where: 'advanced' },
  naturalRegeneration: { label: 'Régénération naturelle', desc: 'La santé remonte peu à peu quand la barre de faim est bien remplie.', where: 'advanced' },
  immediateRespawn: { label: 'Réapparition immédiate', desc: "Réapparaissez aussitôt, sans passer par l'écran de mort.", where: 'advanced' },
  showDeathMessages: { label: 'Messages de mort', desc: 'Annonce dans le chat la mort des joueurs.', where: 'advanced' },
};

const EXPERIMENTS: Record<keyof Experiments, { label: string; desc: string; generation: boolean }> = {
  fantasyBiomes: { label: 'Biomes fantastiques', desc: 'Ajoute des biomes imaginaires à la génération : forêts de cristal, forêts enchantées et champs de champignons.', generation: true },
  dimensions: { label: 'Dimensions (Terres de braise, Royaume céleste)', desc: "Les portails mènent vers deux autres dimensions. Désactivé, les portails ne s'allument pas.", generation: true },
  bosses: { label: 'Boss', desc: 'Les boss (Golem antique, Gardien des profondeurs, Souverain des braises, Dragon des cieux) peuvent apparaître.', generation: false },
  tradeRebalance: { label: 'Rééquilibrage des échanges', desc: 'Nouveaux prix pour les échanges avec les villageois.', generation: false },
  drop3: { label: 'Pack de contenu 3 : camps abandonnés', desc: 'Ajoute un nouveau biome de surface : les Plaines cendrées, avec leur herbe grise, leurs arbres morts et leurs retombées de cendre.', generation: true },
};

// ---------------------------------------------------------------- briques d'interface

/** Interrupteur O/I ; désactivé = simple affichage (focalisable mais sans action). */
export function switchEl(key: string, value: boolean, onChange: (v: boolean) => void, disabled = false): HTMLElement {
  if (disabled) {
    const t = h('div', { class: 'toggle disabled' + (value ? ' on' : ''), tabindex: '-1', role: 'switch', 'aria-checked': String(value), 'aria-disabled': 'true' }, h('div', { class: 'half i' }, 'I'), h('div', { class: 'half o' }, 'O'), h('div', { class: 'knob' }));
    t.dataset.wssKey = key;
    return t;
  }
  const t = toggle(value, (v) => {
    t.setAttribute('aria-checked', String(v));
    onChange(v);
  });
  t.setAttribute('aria-checked', String(value));
  t.dataset.wssKey = key;
  // Entrée bascule une seule fois (sans repasser par la navigation des menus).
  t.addEventListener('keydown', (e) => {
    if ((e as KeyboardEvent).code === 'Enter') e.stopPropagation();
  });
  return t;
}

interface RowOpts {
  disabled?: boolean;
  note?: string;
  dim?: boolean;
}

export function toggleRow(key: string, label: string, desc: string, value: boolean, onChange: (v: boolean) => void, o: RowOpts = {}): HTMLElement {
  return h(
    'div',
    { class: 'section' + (o.dim ? ' wss-dim' : '') },
    h('div', { class: 'row' }, h('div', { class: 'grow' }, h('div', null, label), desc ? h('div', { class: 'desc' }, desc) : null, o.note ? h('div', { class: 'desc wss-note' }, o.note) : null), switchEl(key, value, onChange, o.disabled)),
  );
}

export function headRow(label: string, desc?: string): HTMLElement {
  return h('div', { class: 'section head' }, label, desc ? h('div', { class: 'desc wss-head-desc' }, desc) : null);
}

/** Boutons segmentés avec description mise à jour selon le choix. */
function segRow<T extends string>(key: string, label: string, options: Array<[T, string]>, value: T, describe: (v: T) => string, onChange: (v: T) => void, cls = ''): HTMLElement {
  const desc = h('div', { class: 'desc' }, describe(value));
  const seg = segmented(options, value, (v) => {
    desc.textContent = describe(v);
    onChange(v);
  });
  seg.querySelectorAll<HTMLElement>('.btn').forEach((b, i) => (b.dataset.wssKey = key + '-' + options[i][0]));
  return h('div', { class: 'section' + (cls ? ' ' + cls : '') }, h('div', { class: 'label' }, label), seg, desc);
}

/** Variante avec icône dans chaque segment (permissions). */
function segIconRow(key: string, label: string, options: Array<[PermissionKind, string]>, value: PermissionKind, describe: (v: PermissionKind) => string, onChange: (v: PermissionKind) => void): HTMLElement {
  const desc = h('div', { class: 'desc' }, describe(value));
  const wrap = h('div', { class: 'seg' });
  const btns: HTMLButtonElement[] = [];
  for (const [v, text] of options) {
    const b = button([h('img', { class: 'ico wss-perm-ico', src: permissionIcon(v), alt: '', draggable: 'false' }), text], () => {
      btns.forEach((x, i) => x.classList.toggle('sel', options[i][0] === v));
      desc.textContent = describe(v);
      onChange(v);
    });
    b.dataset.wssKey = key + '-' + v;
    if (v === value) b.classList.add('sel');
    btns.push(b);
    wrap.appendChild(b);
  }
  return h('div', { class: 'section' }, h('div', { class: 'label' }, label), wrap, desc);
}

function ruleRow(host: WsHost, k: BoolRule, o: RowOpts & { onSet?: () => void } = {}): HTMLElement | null {
  if (NOT_WIRED.has('rules.' + k)) return null;
  const info = RULES[k];
  return toggleRow('rule-' + k, info.label, info.desc, host.meta.rules[k], (v) => {
    host.meta.rules[k] = v;
    o.onSet?.();
    host.changed();
  }, o);
}

/** Copie dans le presse-papiers (API moderne, sinon repli par sélection). */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* repli ci-dessous */
  }
  try {
    const ta = h('textarea', { style: 'position:fixed;left:-9999px;top:0' });
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch {
    return false;
  }
}

// ================================================================ Général
export function generalSection(host: WsHost): HTMLElement[] {
  const m = host.meta;
  const name = textField(m.name, 'Mon monde', (v) => {
    m.name = v;
    host.changed();
  }, 40);
  name.dataset.wssKey = 'name';
  name.addEventListener('keydown', (e) => {
    if (e.code === 'Enter' || e.code === 'Escape') name.blur();
  });

  const shown: GameMode = host.editing && host.playerMode ? host.playerMode : m.gameMode;
  const modeDesc = (v: GameMode): string => {
    let d = MODE_DESC[v];
    if (host.editing && host.hasPlayed) d += ' Le changement s’applique aussi à votre personnage dans ce monde.';
    return d;
  };
  const mode = segRow<GameMode>('mode', 'Mode de jeu', [['survival', 'Survie'], ['creative', 'Créatif'], ['adventure', 'Aventure']], shown, modeDesc, (v) => {
    m.gameMode = v;
    host.setPlayerMode(v);
    host.changed();
  });
  if (shown === 'spectator') mode.appendChild(h('div', { class: 'desc wss-note' }, 'Votre personnage est actuellement en mode Spectateur.'));

  const diff = segRow<Difficulty>('diff', 'Difficulté', [['peaceful', 'Paisible'], ['easy', 'Facile'], ['normal', 'Normale'], ['hard', 'Difficile']], m.difficulty, (v) => DIFF_DESC[v], (v) => {
    m.difficulty = v;
    host.changed();
  });

  return [h('div', { class: 'section' }, h('div', { class: 'label' }, 'Nom du monde'), name), mode, diff];
}

// ================================================================ Avancé
export function advancedSection(host: WsHost): HTMLElement[] {
  const m = host.meta;
  const ed = host.editing;
  const out: HTMLElement[] = [];

  // Graine.
  if (ed) {
    const text = m.seedText || String(m.seed);
    const f = h('input', { class: 'field wss-sel', value: text, readonly: true, spellcheck: 'false', 'aria-readonly': 'true' }) as HTMLInputElement;
    f.dataset.wssKey = 'seed';
    f.addEventListener('keydown', (e) => e.stopPropagation());
    const copy = button('Copier', () => {
      void copyText(text).then((ok) => toast(ok ? 'Graine copiée' : 'Copie impossible : sélectionnez la graine à la main'));
    });
    copy.dataset.wssKey = 'seed-copy';
    out.push(
      h(
        'div',
        { class: 'section' },
        h('div', { class: 'label' }, 'Graine du monde'),
        h('div', { class: 'row' }, h('div', { class: 'grow' }, f), copy),
        h('div', { class: 'desc' }, text !== String(m.seed) ? `Valeur numérique utilisée : ${m.seed}. Modèle : ${templateName(m.template)}.` : `Modèle : ${templateName(m.template)}.`),
        h('div', { class: 'desc wss-note' }, FIXED_NOTE),
      ),
    );
  } else {
    const f = textField(host.seedInput, 'Vide = graine au hasard', (v) => {
      host.seedInput = v;
      host.changed();
    }, 40);
    f.dataset.wssKey = 'seed';
    f.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Escape') f.blur();
    });
    const tpl = button('Modèles', () => host.openTemplates());
    tpl.dataset.wssKey = 'seed-tpl';
    out.push(
      h(
        'div',
        { class: 'section' },
        h('div', { class: 'label' }, 'Graine du monde'),
        h('div', { class: 'row' }, h('div', { class: 'grow' }, f), tpl),
        h('div', { class: 'desc' }, `Guide l'algorithme qui façonne votre monde : la même graine donne le même monde. Laissez vide pour une graine au hasard ; un mot ou une phrase sont convertis en nombre. Modèle choisi : ${templateName(m.template)}.`),
      ),
    );
  }

  const fixed = ed ? { disabled: true, note: FIXED_NOTE } : {};
  out.push(
    toggleRow('flat', 'Monde plat', 'Un monde parfaitement plat pour construire en surface ou creuser vers le bas.', m.template === 'flat', (v) => {
      m.template = v ? 'flat' : 'default';
      host.changed();
    }, fixed),
  );
  const firstSpawn = ed && host.hasPlayed ? { disabled: true, note: 'Déjà appliqué : ne concerne que la toute première apparition.' } : {};
  out.push(
    toggleRow('startmap', 'Carte de départ', 'Apparaissez avec une carte vierge pour explorer votre monde.', m.startingMap, (v) => {
      m.startingMap = v;
      host.changed();
    }, firstSpawn),
    toggleRow('bonus', 'Coffre bonus', 'Apparaissez près d’un coffre rempli de quoi bien démarrer.', m.bonusChest, (v) => {
      m.bonusChest = v;
      host.changed();
    }, firstSpawn),
    toggleRow('coords', 'Afficher les coordonnées', 'Affiche votre position (X, Y, Z) à l’écran.', m.showCoordinates, (v) => {
      m.showCoordinates = v;
      host.changed();
    }),
    toggleRow('caves', 'Grottes', 'Creuse des grottes et des galeries sous la surface.', m.caves, (v) => {
      m.caves = v;
      host.changed();
    }, fixed),
    toggleRow('structures', 'Structures', 'Génère des constructions à découvrir : villages, donjons, ruines…', m.structures, (v) => {
      m.structures = v;
      host.changed();
    }, fixed),
  );
  for (const k of ['fireSpread', 'tntExplodes', 'naturalRegeneration', 'immediateRespawn', 'showDeathMessages'] as const) {
    const r = ruleRow(host, k);
    if (r) out.push(r);
  }
  return out;
}

// ================================================================ Multijoueur
export function multiplayerSection(host: WsHost): HTMLElement[] {
  const m = host.meta;
  const mp = m.multiplayer;
  const id = host.editing ? m.id : '<identifiant du monde>';
  const info = h(
    'div',
    { class: 'section' },
    h(
      'div',
      { class: 'desc' },
      'Ces réglages sont enregistrés avec le monde et servent quand il est hébergé par le serveur Voxelia sur un ordinateur :',
      h('span', { class: 'wss-code wss-cmd wss-sel' }, `npm run server -- --world ${id}`),
      host.editing ? '' : 'L’identifiant apparaît dans « Gestion » une fois le monde créé. ',
      'Dans l’application, un monde local se joue en solo.',
    ),
  );
  const access = segRow<WorldMeta['multiplayer']['access']>('access', 'Accès des joueurs', [['invite', 'Joueurs invités'], ['friends', 'Amis'], ['friends_of_friends', "Amis d'amis"]], mp.access, (v) =>
    v === 'invite' ? "Seuls les joueurs qui ont reçu votre code d'invitation peuvent entrer." : v === 'friends' ? 'Vos amis peuvent rejoindre la partie.' : 'Vos amis et leurs propres amis peuvent rejoindre la partie.',
  (v) => {
    mp.access = v;
    host.changed();
  });
  const perms = segIconRow('perm', 'Permissions par défaut', [['visitor', 'Visiteur'], ['member', 'Membre'], ['operator', 'Opérateur']], mp.defaultPermission, (v) =>
    v === 'visitor' ? 'Les visiteurs se déplacent et regardent, sans construire, miner ni utiliser les objets.' : v === 'member' ? 'Les membres construisent, minent, combattent les créatures et utilisent les objets.' : 'Les opérateurs ont les droits des membres et peuvent aussi gérer les joueurs et utiliser les commandes.',
  (v) => {
    mp.defaultPermission = v;
    host.changed();
  });
  const dim = !mp.enabled;
  if (dim) {
    access.classList.add('wss-dim');
    perms.classList.add('wss-dim');
  }
  const enabled = toggleRow('mp', 'Partie multijoueur', "D'autres joueurs peuvent rejoindre ce monde quand il est hébergé.", mp.enabled, (v) => {
    mp.enabled = v;
    access.classList.toggle('wss-dim', !v);
    perms.classList.toggle('wss-dim', !v);
    host.changed();
  });
  return [enabled, info, headRow('PARAMÈTRES'), access, perms];
}

// ================================================================ Triches
const CHEAT_RULES: BoolRule[] = ['keepInventory', 'mobSpawning', 'mobGriefing', 'weatherCycle'];

/** Les réglages de triche s'écartent-ils des valeurs par défaut ? */
function cheatRulesCustom(m: WorldMeta): boolean {
  const d = defaultRules();
  return (Object.keys(RULES) as RuleKey[]).some((k) => RULES[k].cheat && m.rules[k] !== d[k]);
}

export function cheatsSection(host: WsHost): HTMLElement[] {
  const m = host.meta;
  const dimmed: HTMLElement[] = [];
  let cheatCtl: HTMLElement;

  const makeCheatToggle = (value: boolean): HTMLElement =>
    switchEl('cheats', value, (v) => {
      if (v) {
        m.cheats = true;
        dimmed.forEach((e) => e.classList.remove('wss-dim'));
        host.changed();
        return;
      }
      if (!cheatRulesCustom(m)) {
        m.cheats = false;
        dimmed.forEach((e) => e.classList.add('wss-dim'));
        host.changed();
        return;
      }
      // Pas de règle de triche active sans triches : on demande avant de tout remettre par défaut.
      confirmDialog('Désactiver les triches ?', 'Les paramètres des triches modifiés seront remis à leurs valeurs par défaut.', 'Désactiver', () => {
        const d = defaultRules();
        for (const k of Object.keys(RULES) as RuleKey[]) if (RULES[k].cheat) (m.rules as unknown as Record<string, unknown>)[k] = d[k];
        m.cheats = false;
        host.changed();
        host.rerender();
      });
      // Tant que ce n'est pas confirmé, l'interrupteur reste sur « I ».
      const t = makeCheatToggle(true);
      cheatCtl.replaceWith(t);
      cheatCtl = t;
    });

  /** Modifier un réglage de triche active les triches (comme dans l'écran de création d'origine). */
  const requireCheats = (): void => {
    if (m.cheats) return;
    m.cheats = true;
    const t = makeCheatToggle(true);
    cheatCtl.replaceWith(t);
    cheatCtl = t;
    dimmed.forEach((e) => e.classList.remove('wss-dim'));
    toast('Triches activées : ce réglage en fait partie');
  };

  cheatCtl = makeCheatToggle(m.cheats);
  const cheatsRow = h(
    'div',
    { class: 'section' },
    h('div', { class: 'row' }, h('div', { class: 'grow' }, h('div', null, 'Triches'), h('div', { class: 'desc' }, 'Autorise les commandes dans le chat : /gamemode, /time, /give, /tp, /weather, /gamerule…')), cheatCtl),
  );
  // L'interrupteur est remplacé à la volée : on garde la ligne et on y réinsère le nouveau.
  const out: HTMLElement[] = [cheatsRow, headRow('PARAMÈTRES DES TRICHES', 'Modifier un de ces réglages active les triches.')];

  const dayDesc = (v: 'normal' | 'day'): string => {
    if (v === 'normal') return "Le temps s'écoule normalement, du jour à la nuit.";
    if (m.time !== 6000 && !m.rules.daylightCycle) return `Le temps est arrêté (heure actuelle : ${Math.floor(m.time)}). Choisissez « Toujours jour » pour le fixer en plein jour.`;
    return 'Le soleil reste au zénith : le temps est arrêté en plein jour.';
  };
  const day = segRow<'normal' | 'day'>('day', 'Cycle jour/nuit', [['normal', 'Normal'], ['day', 'Toujours jour']], m.rules.daylightCycle ? 'normal' : 'day', dayDesc, (v) => {
    m.rules.daylightCycle = v === 'normal';
    if (v === 'day') m.time = 6000;
    requireCheats();
    host.changed();
  });
  dimmed.push(day);
  out.push(day);

  for (const k of CHEAT_RULES) {
    const r = ruleRow(host, k, { onSet: requireCheats });
    if (r) {
      dimmed.push(r);
      out.push(r);
    }
  }

  const tick = h(
    'div',
    { class: 'section' },
    h('div', { class: 'label' }, RULES.randomTickSpeed.label),
    slider(0, 10, 1, m.rules.randomTickSpeed, (v) => {
      m.rules.randomTickSpeed = v;
      requireCheats();
      host.changed();
    }),
    h('div', { class: 'desc' }, RULES.randomTickSpeed.desc),
  );
  const range = tick.querySelector<HTMLElement>('.slider');
  if (range) range.dataset.wssKey = 'tick';
  dimmed.push(tick);
  out.push(tick);

  if (!m.cheats) dimmed.forEach((e) => e.classList.add('wss-dim'));
  return out;
}

// ================================================================ Règles du jeu
export function rulesSection(host: WsHost): HTMLElement[] {
  const m = host.meta;
  const out: HTMLElement[] = [headRow('DÉGÂTS', 'Ce qui peut blesser les joueurs')];
  for (const k of ['fallDamage', 'fireDamage', 'drowningDamage'] as const) {
    const r = ruleRow(host, k);
    if (r) out.push(r);
  }
  // Récapitulatif : chaque règle n'a qu'un seul interrupteur ; on renvoie vers son panneau.
  out.push(headRow('TOUTES LES RÈGLES', 'Chaque règle se règle à un seul endroit. En jeu, avec les triches, /gamerule <règle> <valeur> les modifie aussi.'));
  const SECTION_NAME: Partial<Record<SectionId, string>> = { advanced: 'Avancé', cheats: 'Triches', rules: 'Règles du jeu' };
  const list = h('div', { class: 'wss-rules' });
  for (const k of Object.keys(RULES) as RuleKey[]) {
    if (NOT_WIRED.has('rules.' + k)) continue;
    const info = RULES[k];
    const v = m.rules[k];
    const value = typeof v === 'number' ? String(v) : v ? 'Oui' : 'Non';
    const row = h(
      'div',
      { class: 'side-item focus-ring wss-rule', tabindex: '0', role: 'button', 'data-wss-key': 'sum-' + k },
      h('div', { class: 'grow' }, h('div', null, info.label), h('div', { class: 'desc' }, `/gamerule ${k} · ${SECTION_NAME[info.where] ?? ''}`)),
      h('div', { class: 'wss-val' + (value === 'Non' ? ' off' : '') }, value),
    );
    row.addEventListener('click', () => {
      clickSound?.();
      host.goto(info.where);
    });
    list.appendChild(row);
  }
  out.push(list);
  return out;
}

// ================================================================ Expériences
export function experimentsSection(host: WsHost): HTMLElement[] {
  const m = host.meta;
  const out: HTMLElement[] = [
    h('div', { class: 'wss-banner' }, 'Les expériences sont des fonctionnalités en test. Attention, des choses peuvent mal fonctionner.'),
    headRow('JOUABILITÉ', 'Change le fonctionnement de votre monde'),
  ];
  for (const k of ['fantasyBiomes', 'dimensions', 'bosses', 'tradeRebalance', 'drop3'] as Array<keyof Experiments>) {
    if (NOT_WIRED.has('experiments.' + k)) continue;
    const info = EXPERIMENTS[k];
    const locked = host.editing && info.generation;
    out.push(
      toggleRow('exp-' + k, info.label, info.desc, m.experiments[k], (v) => {
        m.experiments[k] = v;
        host.changed();
      }, locked ? { disabled: true, note: FIXED_NOTE } : {}),
    );
  }
  return out;
}

// ================================================================ Packs de ressources
function packIcon(p: PackInfo | undefined): HTMLElement {
  if (p?.icon) return h('img', { class: 'wss-pack-ico wss-px', src: p.icon, alt: '', draggable: 'false' });
  return h('div', { class: 'wss-pack-ico wss-pack-noico' }, img('chest_icon'));
}

function packInfo(p: PackInfo | undefined, id: string): HTMLElement {
  if (!p) return h('div', { class: 'grow' }, h('div', null, 'Pack introuvable'), h('div', { class: 'desc' }, `Ce pack (${id}) a été supprimé de l’appareil. Retirez-le de ce monde.`));
  return h(
    'div',
    { class: 'grow' },
    h('div', { class: 'wss-ell' }, p.name || 'Pack sans nom'),
    p.description ? h('div', { class: 'desc wss-clamp' }, p.description) : null,
    h('div', { class: 'desc' }, `${p.count} texture${p.count > 1 ? 's' : ''} reconnue${p.count > 1 ? 's' : ''}`),
  );
}

function small(label: string, ico: string | undefined, fn: () => void, cls: string, key: string, title?: string): HTMLButtonElement {
  const b = button(label, fn, 'dark square wss-small ' + cls, ico);
  b.dataset.wssKey = key;
  if (title) {
    b.title = title;
    b.setAttribute('aria-label', title);
  }
  return b;
}

export function packsSection(host: WsHost): HTMLElement[] {
  const m = host.meta;
  const out: HTMLElement[] = [];
  const imp = button('Importer un pack (.zip, .mcpack)', () => host.importPack(), '', 'folder');
  imp.dataset.wssKey = 'pack-import';
  imp.classList.add('wss-import');
  out.push(
    h(
      'div',
      { class: 'section' },
      h('div', null, 'Packs de ce monde'),
      h('div', { class: 'desc' }, 'Changent les textures des blocs et des objets dans ce monde. Le pack du haut est prioritaire ; les packs du monde passent avant ceux activés pour tout le jeu.'),
      imp,
    ),
  );

  const tabs = h('div', { class: 'tabs wss-tabs', role: 'tablist' });
  for (const [id, label] of [['active', `Actifs (${m.packs.length})`], ['available', 'Disponibles']] as const) {
    const t = h('div', { class: 'tab focus-ring' + (host.packTab === id ? ' active' : ''), tabindex: '0', role: 'tab', 'aria-selected': String(host.packTab === id), 'data-wss-key': 'ptab-' + id }, label);
    t.addEventListener('click', () => {
      if (host.packTab === id) return;
      clickSound?.();
      host.packTab = id;
      host.rerender();
    });
    tabs.appendChild(t);
  }
  out.push(tabs);

  const list = h('div', { class: 'wss-packs' });
  out.push(list);
  if (host.packs === null) {
    list.appendChild(h('div', { class: 'empty-msg' }, host.packsError ? 'Impossible de lire les packs : ' + host.packsError : 'Chargement des packs…'));
    return out;
  }
  const byId = new Map(host.packs.map((p) => [p.id, p]));
  const move = (i: number, d: number): void => {
    const j = i + d;
    if (j < 0 || j >= m.packs.length) return;
    [m.packs[i], m.packs[j]] = [m.packs[j], m.packs[i]];
    host.changed();
    host.rerender();
  };

  if (host.packTab === 'active') {
    if (!m.packs.length) list.appendChild(h('div', { class: 'empty-msg' }, 'Aucun pack actif dans ce monde. Activez-en un dans « Disponibles » ou importez un fichier .zip / .mcpack.'));
    m.packs.forEach((id, i) => {
      const p = byId.get(id);
      list.appendChild(
        h(
          'div',
          { class: 'wss-pack' },
          h('div', { class: 'wss-rank' }, String(i + 1)),
          packIcon(p),
          packInfo(p, id),
          h(
            'div',
            { class: 'wss-pack-btns' },
            i > 0 ? small('', 'flyup', () => move(i, -1), '', `pk-up-${id}`, 'Monter (plus prioritaire)') : null,
            i < m.packs.length - 1 ? small('', 'flydown', () => move(i, 1), '', `pk-down-${id}`, 'Descendre (moins prioritaire)') : null,
            small('Retirer', undefined, () => {
              m.packs.splice(i, 1);
              host.changed();
              host.rerender();
            }, '', `pk-rm-${id}`),
          ),
        ),
      );
    });
  } else {
    const avail = host.packs.filter((p) => !m.packs.includes(p.id));
    if (!avail.length) list.appendChild(h('div', { class: 'empty-msg' }, host.packs.length ? 'Tous vos packs sont déjà actifs dans ce monde.' : 'Aucun pack importé pour le moment. Utilisez « Importer un pack » pour en ajouter un.'));
    for (const p of avail) {
      const on = button('Activer', () => {
        if (!m.packs.includes(p.id)) m.packs.unshift(p.id);
        host.changed();
        toast(`« ${p.name || 'Pack'} » activé pour ce monde`);
        host.rerender();
      }, 'green wss-small');
      on.dataset.wssKey = 'pk-on-' + p.id;
      list.appendChild(h('div', { class: 'wss-pack' }, packIcon(p), packInfo(p, p.id), h('div', { class: 'wss-pack-btns' }, on)));
    }
  }
  return out;
}
