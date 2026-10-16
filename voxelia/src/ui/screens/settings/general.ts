/**
 * Sections générales des paramètres : accessibilité, profil, vidéo et audio.
 * Chaque contrôle écrit dans SettingsManager (enregistré aussitôt) puis applique le réglage.
 */
import { button, h } from '../../dom';
import { drawSkinFace, sanitizeName, validSkin } from '../SocialScreens';
import { PLAYER_SKINS } from '../../../entities/models';
import type { Quality } from '../../../core/Settings';
import { choiceRow, intro, pct, sectionHead, setSetting, settingToggle, sliderRow, type SectionCtx } from './common';

// ---------------------------------------------------------------- accessibilité
const GUI_SCALES: Array<['0' | '1' | '2' | '3' | '4', string]> = [
  ['0', 'Auto'],
  ['1', '80 %'],
  ['2', '100 %'],
  ['3', '120 %'],
  ['4', '140 %'],
];

export function accessibilitySection(ctx: SectionCtx): HTMLElement[] {
  const app = ctx.app;
  const s = app.settings.data;
  const scale = String(Math.max(0, Math.min(4, Math.round(s.guiScale)))) as (typeof GUI_SCALES)[number][0];
  return [
    intro('Accessibilité', "Adaptez l'interface et la caméra à votre confort."),
    choiceRow('Taille de l’interface', GUI_SCALES, scale, (v) => setSetting(app, 'guiScale', Number(v)), 'Auto adapte la taille des menus et du HUD à l’écran ; les pourcentages sont relatifs à cette taille automatique.'),
    settingToggle(app, 'invertY', 'Inverser l’axe vertical', 'Pousser vers le haut fait regarder vers le bas (souris, tactile et manette).'),
    settingToggle(app, 'viewBobbing', 'Balancement de la vue', 'La caméra oscille légèrement pendant la marche. Désactivez-le si le mouvement vous gêne.'),
    settingToggle(app, 'vibration', 'Vibrations', 'Le téléphone ou la manette vibre quand vous subissez des dégâts.'),
    sliderRow(app, {
      label: 'Opacité des commandes tactiles',
      min: 0,
      max: 1,
      step: 0.05,
      value: s.touchOpacity,
      fmt: pct,
      apply: (v) => setSetting(app, 'touchOpacity', v),
    }),
    sliderRow(app, {
      label: 'Sensibilité tactile',
      desc: 'Vitesse de rotation de la caméra quand vous faites glisser le doigt.',
      min: 0,
      max: 1,
      step: 0.05,
      value: s.touchSensitivity,
      fmt: pct,
      apply: (v) => setSetting(app, 'touchSensitivity', v),
    }),
    settingToggle(app, 'showFps', 'Afficher les images par seconde', 'Compteur discret en bas à droite de l’écran.'),
  ];
}

// ---------------------------------------------------------------- profil
export function profileSection(ctx: SectionCtx): HTMLElement[] {
  const app = ctx.app;
  const s = app.settings.data;
  const face = h('canvas', { class: 'pixel st-face' });
  drawSkinFace(face, s.skin);
  const skinName = PLAYER_SKINS[validSkin(s.skin)]?.name ?? '';

  const hint = h('div', { class: 'desc' });
  const setHint = (warn: boolean) => {
    hint.textContent = warn ? 'Le nom ne peut pas être vide : le précédent est conservé.' : 'De 1 à 16 caractères : lettres sans accent, chiffres et « _ ». Visible par les autres joueurs en multijoueur.';
    hint.classList.toggle('st-warn', warn);
  };
  setHint(false);
  const field = h('input', { class: 'field focus-ring', value: s.profileName, placeholder: 'Nom du joueur', maxlength: '16', spellcheck: 'false', autocomplete: 'off' }) as HTMLInputElement;
  field.addEventListener('keydown', (e) => {
    e.stopPropagation();
    if (e.code === 'Enter' || e.code === 'Escape') field.blur();
  });
  field.addEventListener('input', () => {
    const v = field.value;
    const clean = sanitizeName(v);
    if (clean !== v) {
      const pos = Math.max(0, (field.selectionStart ?? clean.length) - (v.length - clean.length));
      field.value = clean;
      field.setSelectionRange(pos, pos);
    }
    if (!clean) {
      setHint(true);
      return;
    }
    setHint(false);
    app.settings.set('profileName', clean);
    const g = app.game;
    // En multijoueur, le serveur a déjà reçu le nom : il changera à la prochaine connexion.
    if (g && !g.net) g.player.name = clean;
  });
  field.addEventListener('blur', () => {
    if (!field.value) {
      field.value = app.settings.data.profileName;
      setHint(false);
    }
  });

  const out: HTMLElement[] = [
    intro('Profil', 'Votre nom et votre apparence, enregistrés sur cet appareil.'),
    h('div', { class: 'section' }, h('div', { class: 'label' }, 'Nom du joueur'), field, hint),
    h(
      'div',
      { class: 'section' },
      h('div', { class: 'label' }, 'Apparence'),
      h('div', { class: 'row' }, face, h('div', { class: 'grow' }, skinName), button('Changer d’apparence', () => app.openDressingRoom(), '', 'face')),
    ),
  ];
  if (app.game?.net) out.push(h('div', { class: 'section st-note' }, 'Vous êtes connecté à un serveur : les autres joueurs verront le nouveau nom et la nouvelle apparence à votre prochaine connexion.'));
  return out;
}

// ---------------------------------------------------------------- vidéo
const QUALITIES: Array<[Quality, string]> = [
  ['low', 'Basse'],
  ['medium', 'Moyenne'],
  ['high', 'Haute'],
  ['ultra', 'Ultra'],
];

const QUALITY_DESC: Record<Quality, string> = {
  low: 'Pour les appareils modestes : 4 tronçons, sans nuages ni effets de feuillage, résolution réduite.',
  medium: 'Équilibre conseillé sur téléphone : 6 tronçons, particules réduites.',
  high: 'Pour les ordinateurs et téléphones récents : 8 tronçons, tous les effets.',
  ultra: 'Distance de 12 tronçons et tous les effets : demande une machine puissante.',
};

export function videoSection(ctx: SectionCtx): HTMLElement[] {
  const app = ctx.app;
  const s = app.settings.data;
  const set = setSetting;
  return [
    intro('Vidéo', 'Qualité d’affichage et performances.'),
    choiceRow(
      'Qualité graphique',
      QUALITIES,
      s.quality,
      (q) => {
        app.settings.applyQuality(q);
        app.applySettings();
        // Les curseurs ci-dessous suivent le préréglage choisi.
        ctx.rerender();
      },
      (q) => QUALITY_DESC[q] + ' Vous pouvez ensuite ajuster chaque réglage.',
    ),
    sliderRow(app, {
      label: 'Distance d’affichage',
      desc: 'Nombre de tronçons (16 blocs) affichés autour de vous. Une grande distance ralentit les appareils modestes.',
      min: 2,
      max: 16,
      step: 1,
      value: s.renderDistance,
      fmt: (v) => v + ' tronçons',
      live: false,
      apply: (v) => set(app, 'renderDistance', v),
    }),
    sliderRow(app, {
      label: 'Champ de vision',
      min: 50,
      max: 110,
      step: 1,
      value: s.fov,
      fmt: (v) => v + '°',
      apply: (v) => set(app, 'fov', v),
    }),
    sliderRow(app, {
      label: 'Luminosité',
      min: 0,
      max: 1,
      step: 0.05,
      value: s.brightness,
      fmt: (v) => (v <= 0 ? 'Sombre' : v >= 1 ? 'Lumineux' : pct(v)),
      apply: (v) => set(app, 'brightness', v),
    }),
    sliderRow(app, {
      label: 'Échelle de résolution',
      desc: 'Résolution du rendu 3D par rapport à l’écran. Baissez-la pour gagner en fluidité.',
      min: 0.4,
      max: 1,
      step: 0.05,
      value: s.resolutionScale,
      fmt: pct,
      live: false,
      apply: (v) => set(app, 'resolutionScale', v),
    }),
    sectionHead('EFFETS'),
    settingToggle(app, 'clouds', 'Nuages'),
    settingToggle(app, 'fancyLeaves', 'Feuillage détaillé', 'Feuilles ajourées au lieu de blocs pleins (plus coûteux à afficher).'),
    settingToggle(app, 'wavingPlants', 'Plantes ondulantes', 'Herbes, fleurs et feuilles bougent avec le vent.'),
    choiceRow<'all' | 'reduced' | 'minimal'>(
      'Particules',
      [
        ['all', 'Toutes'],
        ['reduced', 'Réduites'],
        ['minimal', 'Minimales'],
      ],
      s.particles,
      (v) => set(app, 'particles', v),
    ),
    settingToggle(app, 'fog', 'Brouillard', 'Estompe progressivement le paysage au loin.'),
  ];
}

// ---------------------------------------------------------------- audio
export function audioSection(ctx: SectionCtx): HTMLElement[] {
  const app = ctx.app;
  const s = app.settings.data;
  const preview = () => app.audio.play('click', { volume: 0.8 });
  const vol = (label: string, key: 'masterVolume' | 'musicVolume' | 'soundVolume' | 'ambientVolume', value: number, desc?: string) =>
    sliderRow(app, {
      label,
      desc,
      min: 0,
      max: 1,
      step: 0.01,
      value,
      fmt: pct,
      apply: (v) => setSetting(app, key, v),
      release: preview,
    });
  return [
    intro('Audio', 'Tous les sons du jeu sont synthétisés en direct.'),
    vol('Volume général', 'masterVolume', s.masterVolume),
    vol('Musique', 'musicVolume', s.musicVolume, 'Morceaux générés selon le lieu et le moment (jour, nuit, grottes, combats de boss).'),
    vol('Effets sonores', 'soundVolume', s.soundVolume, 'Pas, blocs, créatures, combats et interface.'),
    vol('Ambiance', 'ambientVolume', s.ambientVolume, 'Pluie, vent, oiseaux et bruits des grottes.'),
  ];
}
