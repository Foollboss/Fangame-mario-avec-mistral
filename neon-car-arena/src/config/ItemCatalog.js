// Objets de personnalisation : PUREMENT cosmétiques (aucun effet sur la simulation).
// Chaque objet est débloqué à un niveau donné (progression 1 → 50).

export const RARITY = {
  common: { label: 'Commun', color: '#b8c4d6' },
  rare: { label: 'Rare', color: '#3da5ff' },
  epic: { label: 'Épique', color: '#b85cff' },
  legendary: { label: 'Légendaire', color: '#ffb52e' },
};

export const CATEGORIES = [
  { id: 'car', label: 'Carrosserie' },
  { id: 'paint', label: 'Couleur' },
  { id: 'finish', label: 'Peinture' },
  { id: 'decal', label: 'Autocollant' },
  { id: 'wheels', label: 'Roues' },
  { id: 'antenna', label: 'Antenne' },
  { id: 'boost', label: 'Boost' },
  { id: 'trail', label: 'Traînée' },
  { id: 'goalfx', label: 'Effet de but' },
  { id: 'engine', label: 'Son moteur' },
  { id: 'title', label: 'Titre' },
];

const I = (id, cat, name, rarity, level, data = {}) => ({ id, cat, name, rarity, level, data });

export const ITEMS = [
  // Carrosseries (véhicules)
  I('car_pulse', 'car', 'Pulse', 'common', 1, { vehicle: 'pulse' }),
  I('car_vortex', 'car', 'Vortex', 'rare', 3, { vehicle: 'vortex' }),
  I('car_titan', 'car', 'Titan', 'rare', 6, { vehicle: 'titan' }),
  I('car_phantom', 'car', 'Phantom', 'epic', 10, { vehicle: 'phantom' }),
  I('car_rift', 'car', 'Rift', 'epic', 20, { vehicle: 'rift' }),
  I('car_nomad', 'car', 'Nomad', 'legendary', 32, { vehicle: 'nomad' }),

  // Couleurs
  I('paint_graphite', 'paint', 'Graphite', 'common', 1, { color: '#2b2f3a' }),
  I('paint_ice', 'paint', 'Glace', 'common', 1, { color: '#dfe8f2' }),
  I('paint_crimson', 'paint', 'Cramoisi', 'common', 1, { color: '#b3122e' }),
  I('paint_cobalt', 'paint', 'Cobalt', 'common', 2, { color: '#1d4fd8' }),
  I('paint_lime', 'paint', 'Citron vert', 'common', 4, { color: '#7ed321' }),
  I('paint_violet', 'paint', 'Violet', 'rare', 7, { color: '#6a2cd8' }),
  I('paint_sunset', 'paint', 'Crépuscule', 'rare', 11, { color: '#ff5a3c' }),
  I('paint_teal', 'paint', 'Sarcelle', 'rare', 14, { color: '#0fa39a' }),
  I('paint_gold', 'paint', 'Or', 'epic', 22, { color: '#d9a21b' }),
  I('paint_rose', 'paint', 'Rose néon', 'epic', 27, { color: '#ff2fa8' }),
  I('paint_void', 'paint', 'Néant', 'legendary', 40, { color: '#0a0a12' }),
  I('paint_emerald', 'paint', 'Émeraude', 'epic', 34, { color: '#12b85a' }),
  I('paint_pearl', 'paint', 'Perle', 'legendary', 47, { color: '#f4efe6' }),

  // Finitions de peinture
  I('finish_matte', 'finish', 'Mat', 'common', 1, { metalness: 0.1, roughness: 0.85 }),
  I('finish_metal', 'finish', 'Métallique', 'common', 1, { metalness: 0.65, roughness: 0.35 }),
  I('finish_pearl', 'finish', 'Nacré', 'rare', 9, { metalness: 0.4, roughness: 0.2, clearcoat: true }),
  I('finish_chrome', 'finish', 'Chrome', 'epic', 24, { metalness: 1.0, roughness: 0.08 }),
  I('finish_holo', 'finish', 'Holographique', 'legendary', 44, { metalness: 0.8, roughness: 0.15, holo: true }),

  // Autocollants
  I('decal_none', 'decal', 'Aucun', 'common', 1, { pattern: 'none' }),
  I('decal_stripes', 'decal', 'Bandes course', 'common', 1, { pattern: 'stripes' }),
  I('decal_split', 'decal', 'Bicolore', 'common', 5, { pattern: 'split' }),
  I('decal_hex', 'decal', 'Hexagones', 'rare', 8, { pattern: 'hex' }),
  I('decal_flames', 'decal', 'Flammes', 'rare', 13, { pattern: 'flames' }),
  I('decal_circuit', 'decal', 'Circuit', 'epic', 18, { pattern: 'circuit' }),
  I('decal_number', 'decal', 'Numéro 07', 'rare', 16, { pattern: 'number' }),
  I('decal_tiger', 'decal', 'Griffes', 'epic', 30, { pattern: 'claws' }),
  I('decal_carbon', 'decal', 'Carbone', 'rare', 37, { pattern: 'carbon' }),
  I('decal_galaxy', 'decal', 'Galaxie', 'legendary', 46, { pattern: 'galaxy' }),

  // Roues
  I('wheels_std', 'wheels', 'Standard', 'common', 1, { style: 'std', rim: '#9aa3b2' }),
  I('wheels_black', 'wheels', 'Ombre', 'common', 2, { style: 'std', rim: '#1a1c22' }),
  I('wheels_spoke', 'wheels', 'Rayons', 'rare', 5, { style: 'spoke', rim: '#d0d6e0' }),
  I('wheels_turbine', 'wheels', 'Turbine', 'rare', 12, { style: 'turbine', rim: '#ffcf3a' }),
  I('wheels_neon', 'wheels', 'Anneau néon', 'epic', 19, { style: 'neon', rim: '#19e3ff' }),
  I('wheels_disc', 'wheels', 'Disque plein', 'rare', 25, { style: 'disc', rim: '#ff5a3c' }),
  I('wheels_gold', 'wheels', 'Jantes d\'or', 'epic', 39, { style: 'spoke', rim: '#ffb52e' }),
  I('wheels_plasma', 'wheels', 'Plasma', 'legendary', 38, { style: 'neon', rim: '#ff2fa8' }),

  // Antennes
  I('ant_none', 'antenna', 'Aucune', 'common', 1, { style: 'none' }),
  I('ant_orb', 'antenna', 'Orbe', 'common', 2, { style: 'orb', color: '#19e3ff' }),
  I('ant_flag', 'antenna', 'Fanion', 'common', 6, { style: 'flag', color: '#ffffff' }),
  I('ant_bolt', 'antenna', 'Éclair', 'rare', 15, { style: 'bolt', color: '#ffd24a' }),
  I('ant_star', 'antenna', 'Étoile', 'epic', 23, { style: 'star', color: '#ff2fa8' }),
  I('ant_comet', 'antenna', 'Comète', 'epic', 41, { style: 'orb', color: '#ff2fa8' }),
  I('ant_crown', 'antenna', 'Couronne', 'legendary', 35, { style: 'crown', color: '#ffb52e' }),

  // Boost
  I('boost_flame', 'boost', 'Flamme', 'common', 1, { colors: ['#ffd24a', '#ff5a1f'], size: 1 }),
  I('boost_ion', 'boost', 'Ion', 'common', 3, { colors: ['#c9f6ff', '#19b8ff'], size: 1 }),
  I('boost_toxic', 'boost', 'Toxique', 'rare', 9, { colors: ['#e6ff5a', '#3dd11f'], size: 1.1 }),
  I('boost_plasma', 'boost', 'Plasma', 'epic', 17, { colors: ['#ffc2f5', '#b85cff'], size: 1.2 }),
  I('boost_pixel', 'boost', 'Pixels', 'epic', 28, { colors: ['#ffffff', '#4cf0c0'], size: 1.15, square: true }),
  I('boost_void', 'boost', 'Trou noir', 'legendary', 49, { colors: ['#b85cff', '#12001f'], size: 1.25 }),
  I('boost_nova', 'boost', 'Supernova', 'legendary', 42, { colors: ['#ffffff', '#ff2fa8', '#19e3ff'], size: 1.3 }),

  // Traînées
  I('trail_none', 'trail', 'Aucune', 'common', 1, { color: null }),
  I('trail_light', 'trail', 'Filet lumineux', 'common', 1, { color: '#bff6ff' }),
  I('trail_ember', 'trail', 'Braise', 'rare', 11, { color: '#ff7a1a' }),
  I('trail_aurora', 'trail', 'Aurore', 'epic', 21, { color: '#4cf0c0', rainbow: false }),
  I('trail_venom', 'trail', 'Venin', 'epic', 43, { color: '#b6ff3a' }),
  I('trail_prism', 'trail', 'Prisme', 'legendary', 36, { color: '#ffffff', rainbow: true }),

  // Effets de but
  I('goal_burst', 'goalfx', 'Déflagration', 'common', 1, { colors: ['#ffffff', '#ffd24a'], shape: 'burst' }),
  I('goal_ring', 'goalfx', 'Onde de choc', 'rare', 8, { colors: ['#19e3ff', '#ffffff'], shape: 'ring' }),
  I('goal_fountain', 'goalfx', 'Fontaine', 'rare', 14, { colors: ['#4cf0c0', '#e6ff5a'], shape: 'fountain' }),
  I('goal_nebula', 'goalfx', 'Nébuleuse', 'epic', 26, { colors: ['#b85cff', '#ff2fa8', '#19e3ff'], shape: 'burst' }),
  I('goal_supernova', 'goalfx', 'Supernova', 'legendary', 48, { colors: ['#ffffff', '#ffb52e', '#ff2fa8'], shape: 'ring' }),

  // Sons moteur
  I('eng_classic', 'engine', 'Thermique', 'common', 1, { wave: 'sawtooth', base: 48, range: 140 }),
  I('eng_electric', 'engine', 'Électrique', 'rare', 12, { wave: 'sine', base: 180, range: 520 }),
  I('eng_turbine', 'engine', 'Turbine', 'epic', 29, { wave: 'triangle', base: 220, range: 700 }),
  I('eng_rumble', 'engine', 'Grondement', 'rare', 33, { wave: 'square', base: 32, range: 90 }),

  // Titres
  I('title_rookie', 'title', 'Recrue', 'common', 1),
  I('title_striker', 'title', 'Buteur', 'common', 4),
  I('title_wall', 'title', 'Le Mur', 'rare', 10),
  I('title_flyer', 'title', 'Pilote aérien', 'rare', 16),
  I('title_neon', 'title', 'Âme néon', 'epic', 24),
  I('title_captain', 'title', 'Capitaine', 'epic', 31),
  I('title_legend', 'title', 'Légende de l\'arène', 'legendary', 45),
  I('title_apex', 'title', 'Apex', 'legendary', 50),
  I('title_champion', 'title', 'Champion de tournoi', 'epic', 99, { tournament: true }),
];

export const ITEM_BY_ID = Object.fromEntries(ITEMS.map((it) => [it.id, it]));

export const DEFAULT_LOADOUT = {
  car: 'car_pulse', paint: 'paint_crimson', finish: 'finish_metal', decal: 'decal_stripes',
  wheels: 'wheels_std', antenna: 'ant_none', boost: 'boost_flame', trail: 'trail_light',
  goalfx: 'goal_burst', engine: 'eng_classic', title: 'title_rookie',
};

// Récompenses de niveau : tout objet dont le niveau correspond.
export const itemsForLevel = (lvl) => ITEMS.filter((it) => it.level === lvl);
