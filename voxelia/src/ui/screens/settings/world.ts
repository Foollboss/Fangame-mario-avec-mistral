/**
 * Sections « Jeu » et « Multijoueur » des paramètres (visibles seulement en partie).
 * Les modifications passent par les méthodes de Game et sont enregistrées en quittant la section.
 */
import { button, h, saveFile, textField, toast } from '../../dom';
import { DEFAULT_PORT } from '../ServerStatus';
import { drawSkinFace, validSkin } from '../SocialScreens';
import type { Difficulty, GameMode, GameRules } from '../../../save/SaveManager';
import type { Game } from '../../../game/Game';
import { choiceRow, errorText, infoRow, intro, note, sectionHead, sliderRow, toggleRow, type SectionCtx } from './common';

const DIFFICULTIES: Array<[Difficulty, string]> = [
  ['peaceful', 'Paisible'],
  ['easy', 'Facile'],
  ['normal', 'Normale'],
  ['hard', 'Difficile'],
];

const DIFF_DESC: Record<Difficulty, string> = {
  peaceful: 'Aucune créature hostile. La santé et la faim se rétablissent d’elles-mêmes.',
  easy: 'Créatures hostiles peu nombreuses, dégâts réduits. La faim ne fait pas descendre la santé sous 5 cœurs.',
  normal: 'Créatures hostiles et dégâts normaux. La faim peut faire descendre la santé jusqu’à un demi-cœur.',
  hard: 'Créatures hostiles plus nombreuses, dégâts accrus. La faim peut être mortelle.',
};

const MODES: Array<[GameMode, string]> = [
  ['survival', 'Survie'],
  ['creative', 'Créatif'],
  ['adventure', 'Aventure'],
  ['spectator', 'Spectateur'],
];

const MODE_DESC: Record<GameMode, string> = {
  survival: 'Récoltez, fabriquez et survivez : santé et faim sont actives.',
  creative: 'Objets illimités, vol et invulnérabilité.',
  adventure: 'Comme la survie, sans pouvoir casser ni poser de blocs.',
  spectator: 'Vol libre pour observer, sans interagir avec le monde.',
};

type BoolRule = { [K in keyof GameRules]: GameRules[K] extends boolean ? K : never }[keyof GameRules];

/** Règles réellement lues par la simulation locale. */
const RULES: Array<[BoolRule, string, string]> = [
  ['daylightCycle', 'Cycle jour/nuit', 'Le temps s’écoule ; désactivé, l’heure reste figée.'],
  ['weatherCycle', 'Cycle météo', 'La pluie et les orages vont et viennent.'],
  ['mobSpawning', 'Apparition des créatures', 'Les créatures apparaissent naturellement.'],
  ['mobGriefing', 'Dégâts des créatures', 'Les créatures peuvent détruire des blocs (explosions…).'],
  ['keepInventory', 'Conserver l’inventaire', 'Vous gardez tous vos objets à la mort.'],
  ['naturalRegeneration', 'Régénération naturelle', 'La santé remonte quand la barre de faim est pleine.'],
  ['fallDamage', 'Dégâts de chute', 'Les chutes infligent des dégâts.'],
  ['drowningDamage', 'Noyade', 'Manquer d’air sous l’eau inflige des dégâts.'],
  ['fireSpread', 'Propagation du feu', 'Le feu s’étend aux blocs inflammables voisins.'],
  ['tntExplodes', 'Explosion de la TNT', 'La TNT allumée explose et détruit les blocs.'],
  ['immediateRespawn', 'Réapparition immédiate', 'Pas d’écran de mort : vous réapparaissez aussitôt.'],
  ['showDeathMessages', 'Messages de mort', 'La cause de chaque mort s’affiche dans la discussion.'],
];

// ---------------------------------------------------------------- jeu
export function gameSection(ctx: SectionCtx): HTMLElement[] {
  const g = ctx.app.game;
  if (!g) return [intro('Jeu', 'Paramètres du monde en cours.'), note('Aucune partie en cours.')];
  const meta = g.meta;
  const remote = !!g.net;
  const cheats = meta.cheats && !remote;
  let dirty = false;
  const touched = () => {
    dirty = true;
  };
  ctx.onLeave(() => {
    if (dirty && !g.net && ctx.app.game === g) void g.save(false);
  });

  const out: HTMLElement[] = [intro('Jeu', remote ? 'Ce monde est géré par le serveur : ses paramètres ne peuvent pas être modifiés ici.' : 'Modifiez les paramètres du monde et votre style de jeu.')];

  // Nom du monde
  if (remote) out.push(infoRow('Nom du monde', meta.name));
  else {
    const field = textField(meta.name, 'Nom du monde', (v) => {
      const t = v.trim().slice(0, 32);
      if (t && t !== meta.name) {
        meta.name = t;
        touched();
      }
    }, 32);
    field.classList.add('focus-ring');
    field.addEventListener('keydown', (e) => {
      if (e.code === 'Enter' || e.code === 'Escape') field.blur();
    });
    field.addEventListener('blur', () => {
      if (!field.value.trim()) field.value = meta.name;
    });
    out.push(h('div', { class: 'section' }, h('div', { class: 'label' }, 'Nom du monde'), field));
  }

  out.push(
    choiceRow(
      'Difficulté',
      DIFFICULTIES,
      meta.difficulty,
      (d) => {
        g.setDifficulty(d);
        touched();
      },
      (d) => DIFF_DESC[d],
      remote,
    ),
    choiceRow(
      'Mode de jeu',
      MODES,
      g.player.gameMode,
      (m) => {
        g.setGameMode(m);
        // Monde local : un seul joueur, le mode par défaut du monde suit le sien.
        meta.gameMode = m;
        touched();
      },
      (m) => MODE_DESC[m] + (remote ? '' : cheats ? '' : ' Activez les triches ci-dessous pour changer de mode.'),
      !cheats,
    ),
    toggleRow('Afficher les coordonnées', meta.showCoordinates, (v) => {
      meta.showCoordinates = v;
      touched();
    }, 'Votre position s’affiche en haut à gauche de l’écran.'),
  );

  out.push(
    sectionHead('TRICHES'),
    toggleRow(
      'Triches',
      meta.cheats,
      (v) => {
        meta.cheats = v;
        touched();
        ctx.rerender();
      },
      'Autorise les commandes (/) dans la discussion, le changement de mode de jeu et la modification des règles.',
      remote,
    ),
    sectionHead('RÈGLES DU MONDE'),
  );
  if (!cheats && !remote) out.push(note('Activez les triches pour modifier ces règles.'));
  for (const [key, label, desc] of RULES)
    out.push(
      toggleRow(label, meta.rules[key], (v) => {
        g.setRule(key, v);
        touched();
      }, desc, !cheats),
    );
  const tick = sliderRow(ctx.app, {
    label: 'Vitesse des mises à jour aléatoires',
    desc: 'Pousse des plantes, propagation de l’herbe et du feu… 0 les arrête ; 1 est la valeur normale.',
    min: 0,
    max: 10,
    step: 1,
    value: meta.rules.randomTickSpeed,
    fmt: (v) => '×' + v,
    apply: (v) => {
      g.setRule('randomTickSpeed', v);
      touched();
    },
  });
  if (!cheats) {
    const inp = tick.querySelector('input');
    if (inp) inp.disabled = true;
    tick.style.opacity = '0.5';
  }
  out.push(tick);
  return out;
}

// ---------------------------------------------------------------- multijoueur
const PERMISSIONS: Record<string, [string, string]> = {
  visitor: ['Visiteur', 'Vous pouvez explorer, sans modifier le monde.'],
  member: ['Membre', 'Vous pouvez construire et casser des blocs.'],
  operator: ['Opérateur', 'Droits étendus : vous pouvez notamment régler l’heure du serveur.'],
};

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = h('textarea', { style: 'position:fixed;left:-9999px;top:0' }, text) as HTMLTextAreaElement;
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

function personRow(name: string, skin: string, badge: string | null): HTMLElement {
  const face = h('canvas', { class: 'pixel st-face' });
  drawSkinFace(face, validSkin(skin));
  return h('div', { class: 'st-person' }, face, h('div', { class: 'grow' }, name), badge ? h('span', { class: 'badge green' }, badge) : null);
}

export function multiplayerSection(ctx: SectionCtx): HTMLElement[] {
  const g = ctx.app.game;
  if (!g) return [intro('Multijoueur', 'Partie en ligne.'), note('Aucune partie en cours.')];
  return g.net ? onlineSection(ctx, g) : localSection(ctx, g);
}

function onlineSection(ctx: SectionCtx, g: Game): HTMLElement[] {
  const net = g.net!;
  const app = ctx.app;
  const perm = PERMISSIONS[net.permission] ?? [net.permission, ''];
  const list = h('div', { class: 'st-list' });
  let sig = '';
  const refresh = () => {
    let others: Array<{ name: string; skin: string }> = [];
    try {
      others = net.remotePlayers().map((p) => ({ name: p.name, skin: p.skinKey.replace(/^player_/, '') }));
    } catch {
      others = [];
    }
    const s = others.map((p) => p.name + '|' + p.skin).join(',');
    if (s === sig && list.childElementCount) return;
    sig = s;
    list.replaceChildren(personRow(app.settings.data.profileName, app.settings.data.skin, 'Vous'), ...others.map((p) => personRow(p.name, p.skin, null)));
  };
  refresh();
  let acc = 0;
  ctx.onFrame((dt) => {
    acc += dt;
    if (acc < 1) return;
    acc = 0;
    refresh();
  });
  const w = net.world;
  return [
    intro('Multijoueur', 'Vous êtes connecté à un serveur Voxelia.'),
    infoRow('Serveur', w?.name ?? '—'),
    infoRow('Adresse', net.address),
    w?.motd ? infoRow('Message du serveur', w.motd) : null,
    infoRow('Votre permission', perm[0], perm[1]),
    h(
      'div',
      { class: 'section' },
      h(
        'div',
        { class: 'st-actions' },
        button(
          'Copier l’adresse',
          () => void copyText(net.address).then((ok) => toast(ok ? 'Adresse copiée' : 'Copie impossible')),
          'dark',
          'copy',
        ),
      ),
    ),
    sectionHead('JOUEURS'),
    list,
    note('Seuls les joueurs présents dans la même dimension que vous apparaissent dans cette liste.'),
  ].filter((e): e is HTMLElement => !!e);
}

function localSection(ctx: SectionCtx, g: Game): HTMLElement[] {
  const app = ctx.app;
  const meta = g.meta;
  let busy = false;
  const share = button(
    'Partager ce monde (fichier .voxelia)',
    () => {
      if (busy) return;
      busy = true;
      void (async () => {
        try {
          await g.save(false);
          const blob = await app.saves.exportWorld(meta.id);
          if (!blob) throw new Error('Monde introuvable dans le stockage.');
          const name = (meta.name.replace(/[\\/:*?"<>|]+/g, '_').trim() || 'monde') + '.voxelia';
          const where = await saveFile(name, blob);
          toast(where ? 'Monde exporté : ' + where : 'Export impossible');
        } catch (e) {
          toast('Export impossible : ' + errorText(e), 4000);
        } finally {
          busy = false;
        }
      })();
    },
    'green',
    'export',
  );
  const cmd = 'npm run server';
  return [
    intro('Multijoueur', 'Jouer avec d’autres joueurs.'),
    note('Ce monde est enregistré uniquement sur cet appareil : d’autres joueurs ne peuvent pas le rejoindre directement.'),
    sectionHead('HÉBERGER UNE PARTIE'),
    note(
      'Pour jouer à plusieurs, lancez le serveur Voxelia fourni avec le jeu sur un ordinateur (Node.js 22.6 ou plus récent). Ouvrez un terminal dans le dossier « voxelia » du jeu, tapez « npm install » la première fois, puis :',
      h('div', { class: 'st-code' }, cmd),
    ),
    note(
      `Le serveur gère son propre monde et attend les joueurs sur le port ${DEFAULT_PORT}. Les autres joueurs le rejoignent depuis Jouer → Serveurs ou Jouer → Invitations, avec l’adresse de l’ordinateur (par ex. 192.168.1.20:${DEFAULT_PORT}). Le guide « Héberger un serveur » de l’onglet Invitations donne la commande complète avec un code d’invitation.`,
    ),
    sectionHead('PARTAGER CE MONDE'),
    note('Exportez ce monde dans un fichier : un ami pourra l’importer sur son appareil depuis Jouer → Mondes → Importer et y jouer de son côté.'),
    infoRow('Graine du monde', meta.seedText || String(meta.seed)),
    h('div', { class: 'section' }, h('div', { class: 'st-actions' }, share)),
  ];
}
