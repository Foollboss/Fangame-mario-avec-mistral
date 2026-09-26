import { VEHICLES } from '../game/Vehicles.js';

// Cosmetic items. None of them change physics: only visuals and sounds.
export const RARITY = {
  common: { label: 'Commun', color: '#9aa7bd' },
  rare: { label: 'Rare', color: '#4b93ff' },
  epic: { label: 'Épique', color: '#b86bff' },
  legendary: { label: 'Légendaire', color: '#ffb02e' },
};

export const CATEGORIES = [
  { id: 'car', label: 'Carrosserie' },
  { id: 'color', label: 'Couleur' },
  { id: 'paint', label: 'Peinture' },
  { id: 'decal', label: 'Autocollant' },
  { id: 'wheels', label: 'Roues' },
  { id: 'antenna', label: 'Antenne' },
  { id: 'boost', label: 'Boost' },
  { id: 'trail', label: 'Traînée' },
  { id: 'goalfx', label: 'Effet de but' },
  { id: 'engine', label: 'Son moteur' },
  { id: 'title', label: 'Titre' },
];

const I = (id, cat, name, rarity, level, data = {}) => ({ id, cat, name, rarity, level, ...data });

export const ITEMS = [
  // Colors
  I('col_cobalt', 'color', 'Bleu Cobalt', 'common', 1, { hex: 0x2461ff }),
  I('col_polar', 'color', 'Blanc Polaire', 'common', 1, { hex: 0xe8eef6 }),
  I('col_carbon', 'color', 'Noir Carbone', 'common', 1, { hex: 0x1d2129 }),
  I('col_red', 'color', 'Rouge Vif', 'common', 1, { hex: 0xe0283c }),
  I('col_mint', 'color', 'Vert Menthe', 'common', 4, { hex: 0x2ee5a0 }),
  I('col_sun', 'color', 'Jaune Soleil', 'common', 7, { hex: 0xffd23f }),
  I('col_lava', 'color', 'Orange Lave', 'rare', 9, { hex: 0xff6a1f }),
  I('col_violet', 'color', 'Violet Néon', 'rare', 12, { hex: 0x9b4dff }),
  I('col_glacier', 'color', 'Cyan Glacier', 'rare', 15, { hex: 0x3fe3ff }),
  I('col_flash', 'color', 'Rose Flash', 'rare', 19, { hex: 0xff4fb3 }),
  I('col_rosegold', 'color', 'Or Rose', 'epic', 24, { hex: 0xe7a08b }),
  I('col_emerald', 'color', 'Émeraude', 'epic', 30, { hex: 0x0fa36b }),
  I('col_titanium', 'color', 'Titane', 'epic', 35, { hex: 0x8a94a6 }),
  I('col_prism', 'color', 'Prisme', 'legendary', 45, { hex: 0xff3b8d, animated: 'rainbow' }),
  // Paint finishes
  I('pnt_gloss', 'paint', 'Brillant', 'common', 1, { rough: 0.32, metal: 0.25 }),
  I('pnt_matte', 'paint', 'Mat', 'common', 1, { rough: 0.85, metal: 0.05 }),
  I('pnt_metal', 'paint', 'Métallisé', 'rare', 5, { rough: 0.22, metal: 0.8 }),
  I('pnt_carbon', 'paint', 'Fibre carbone', 'rare', 16, { rough: 0.4, metal: 0.4, pattern: 'carbon' }),
  I('pnt_pearl', 'paint', 'Nacré', 'epic', 22, { rough: 0.15, metal: 0.5, glow: 0.12 }),
  I('pnt_neon', 'paint', 'Néon', 'epic', 33, { rough: 0.4, metal: 0.1, glow: 0.55 }),
  I('pnt_chrome', 'paint', 'Chrome', 'legendary', 42, { rough: 0.05, metal: 1 }),
  // Decals
  I('dec_none', 'decal', 'Aucun', 'common', 1),
  I('dec_number', 'decal', 'Numéro 7', 'common', 2),
  I('dec_stripes', 'decal', 'Bandes course', 'common', 7),
  I('dec_bolt', 'decal', 'Éclair', 'rare', 20),
  I('dec_flames', 'decal', 'Flammes', 'rare', 27),
  I('dec_checker', 'decal', 'Damier', 'epic', 36),
  I('dec_hex', 'decal', 'Hexagones', 'epic', 43),
  I('dec_tiger', 'decal', 'Tigre', 'legendary', 48),
  // Wheels
  I('whl_std', 'wheels', 'Standard', 'common', 1),
  I('whl_spoke', 'wheels', 'Rayons', 'common', 8),
  I('whl_star', 'wheels', 'Étoile', 'rare', 13),
  I('whl_turbine', 'wheels', 'Turbine', 'epic', 21),
  I('whl_neon', 'wheels', 'Disque néon', 'epic', 27),
  I('whl_plasma', 'wheels', 'Anneau plasma', 'legendary', 39),
  // Antennas
  I('ant_none', 'antenna', 'Aucune', 'common', 1),
  I('ant_beacon', 'antenna', 'Balise', 'common', 2),
  I('ant_flag', 'antenna', 'Fanion', 'common', 11),
  I('ant_star', 'antenna', 'Étoile', 'rare', 17),
  I('ant_bolt', 'antenna', 'Éclair', 'rare', 25),
  I('ant_cube', 'antenna', 'Pixel', 'epic', 32),
  I('ant_crown', 'antenna', 'Couronne', 'legendary', 48),
  // Boost effects
  I('bst_flame', 'boost', 'Flamme', 'common', 1, { core: 0xfff1b0, edge: 0xff6a1a }),
  I('bst_plasma', 'boost', 'Plasma', 'rare', 12, { core: 0xd8fbff, edge: 0x1aa8ff }),
  I('bst_toxic', 'boost', 'Toxique', 'rare', 20, { core: 0xf0ffb0, edge: 0x35ff4a }),
  I('bst_smoke', 'boost', 'Fumée noire', 'rare', 26, { core: 0xffa040, edge: 0x2a2a30, smoke: true }),
  I('bst_sparks', 'boost', 'Étincelles', 'epic', 34, { core: 0xffffff, edge: 0xffc23a, sparks: true }),
  I('bst_void', 'boost', 'Néant violet', 'epic', 41, { core: 0xf3d1ff, edge: 0x8a2bff }),
  I('bst_rainbow', 'boost', 'Arc-en-ciel', 'legendary', 46, { core: 0xffffff, edge: 0xff0000, rainbow: true }),
  // Trails
  I('trl_none', 'trail', 'Aucune', 'common', 1),
  I('trl_team', 'trail', 'Ruban d’équipe', 'common', 3, { team: true }),
  I('trl_white', 'trail', 'Lumière blanche', 'rare', 10, { color: 0xffffff }),
  I('trl_fire', 'trail', 'Braise', 'rare', 23, { color: 0xff5a1f, color2: 0xffd23f }),
  I('trl_electric', 'trail', 'Électrique', 'epic', 37, { color: 0x6ff6ff, flicker: true }),
  I('trl_rainbow', 'trail', 'Arc-en-ciel', 'legendary', 44, { rainbow: true }),
  // Goal explosions
  I('gfx_classic', 'goalfx', 'Classique', 'common', 1),
  I('gfx_nova', 'goalfx', 'Supernova', 'rare', 14),
  I('gfx_fireworks', 'goalfx', 'Feu d’artifice', 'epic', 31),
  I('gfx_pixel', 'goalfx', 'Tempête de pixels', 'epic', 40),
  I('gfx_blackhole', 'goalfx', 'Trou noir', 'legendary', 49),
  // Engine sounds
  I('eng_std', 'engine', 'V-Néon', 'common', 1, { wave: 'sawtooth', base: 48, sub: 0.5 }),
  I('eng_electric', 'engine', 'Électrique', 'rare', 29, { wave: 'sine', base: 90, sub: 0, whine: true }),
  I('eng_roar', 'engine', 'Rugissant', 'epic', 38, { wave: 'square', base: 34, sub: 0.8 }),
  I('eng_jet', 'engine', 'Réacteur', 'legendary', 47, { wave: 'triangle', base: 70, sub: 0.2, noise: true }),
  // Titles
  I('tit_rookie', 'title', 'Recrue', 'common', 1),
  I('tit_driver', 'title', 'Pilote', 'common', 5),
  I('tit_striker', 'title', 'Buteur', 'rare', 15),
  I('tit_wall', 'title', 'Mur de fer', 'rare', 22),
  I('tit_flyer', 'title', 'Voltigeur', 'epic', 30),
  I('tit_boostace', 'title', 'As du boost', 'epic', 35),
  I('tit_maestro', 'title', 'Maestro', 'epic', 40),
  I('tit_neonmaster', 'title', 'Maître du néon', 'legendary', 45),
  I('tit_legend', 'title', 'Légende de l’Arène', 'legendary', 50),
  I('tit_champion', 'title', 'Champion', 'legendary', 0, { tournament: true }),
  // Vehicles (bodies)
  ...VEHICLES.map((v) => I(v.id, 'car', v.name, v.rarity, v.unlockLevel, { vehicle: true })),
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((i) => [i.id, i]));
export const getItem = (id) => ITEM_BY_ID[id];

export const DEFAULT_EQUIPPED = {
  car: 'pulse',
  color: 'col_cobalt',
  paint: 'pnt_gloss',
  decal: 'dec_none',
  wheels: 'whl_std',
  antenna: 'ant_none',
  boost: 'bst_flame',
  trail: 'trl_none',
  goalfx: 'gfx_classic',
  engine: 'eng_std',
  title: 'tit_rookie',
};

export const DEFAULT_UNLOCKED = ITEMS.filter((i) => i.level === 1).map((i) => i.id);

// Items granted at a given level.
export const rewardsForLevel = (level) => ITEMS.filter((i) => i.level === level);

// Random but tasteful cosmetics for bots, tinted towards their team for readability.
const TEAM_COLORS = [
  ['col_cobalt', 'col_polar', 'col_glacier', 'col_mint', 'col_violet', 'col_carbon'],
  ['col_red', 'col_lava', 'col_flash', 'col_sun', 'col_carbon', 'col_rosegold'],
];
export function randomBotCosmetics(team, rng = Math.random) {
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];
  const of = (cat) => ITEMS.filter((i) => i.cat === cat && !i.tournament);
  return {
    car: pick(VEHICLES).id,
    color: pick(TEAM_COLORS[team]),
    paint: pick(of('paint')).id,
    decal: pick(of('decal')).id,
    wheels: pick(of('wheels')).id,
    antenna: rng() < 0.5 ? 'ant_none' : pick(of('antenna')).id,
    boost: pick(of('boost')).id,
    trail: 'trl_none',
    goalfx: pick(of('goalfx')).id,
    engine: 'eng_std',
    title: 'tit_rookie',
  };
}
