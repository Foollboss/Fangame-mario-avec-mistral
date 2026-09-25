/**
 * Définitions des biomes des trois dimensions (données pures).
 * L'indice dans BIOMES est stocké dans chaque colonne (Uint8).
 */
export type Precip = 'rain' | 'snow' | 'none' | 'ash' | 'stardust';

export interface WeightedStr {
  id: string;
  w: number;
}

export interface BiomeDef {
  id: string;
  name: string;
  dim: 'surface' | 'abime' | 'astral';
  top: string;
  filler: string;
  fillerDepth?: number;
  stone?: string;
  underwater?: string;
  grass: string;
  foliage: string;
  water: string;
  fog: string;
  sky: string;
  /** Température ressentie (−1 glacial … 1 torride). */
  temp: number;
  precip: Precip;
  trees?: WeightedStr[];
  treeChance?: number;
  plants?: WeightedStr[];
  plantChance?: number;
  features?: string[];
  music?: string;
  rare?: boolean;
}

const B = (d: BiomeDef): BiomeDef => d;

export const BIOMES: BiomeDef[] = [
  // --- Surface (0..23)
  B({ id: 'ocean', name: 'Océan', dim: 'surface', top: 'sable', filler: 'sable', underwater: 'gravier', grass: '#7bbd4a', foliage: '#5fa33a', water: '#3a6fd8', fog: '#bcd8ff', sky: '#8ec5ff', temp: 0.1, precip: 'rain' }),
  B({ id: 'ocean_profond', name: 'Océan profond', dim: 'surface', top: 'gravier', filler: 'gravier', underwater: 'gravier', grass: '#7bbd4a', foliage: '#5fa33a', water: '#2a52b8', fog: '#b0ccf5', sky: '#8ec5ff', temp: 0.05, precip: 'rain' }),
  B({ id: 'ocean_gele', name: 'Océan gelé', dim: 'surface', top: 'gravier', filler: 'gravier', underwater: 'gravier', grass: '#8ab09a', foliage: '#6a9a80', water: '#3a4ec0', fog: '#dde8f5', sky: '#a8c8f0', temp: -0.8, precip: 'snow' }),
  B({ id: 'plage', name: 'Plage', dim: 'surface', top: 'sable', filler: 'sable', fillerDepth: 4, grass: '#9ac060', foliage: '#7aab44', water: '#3a8ae0', fog: '#cfe4ff', sky: '#8ec5ff', temp: 0.4, precip: 'rain', plants: [{ id: 'buisson_mort', w: 1 }], plantChance: 0.004, features: ['reeds'] }),
  B({ id: 'riviere', name: 'Rivière', dim: 'surface', top: 'sable', filler: 'terre', underwater: 'gravier', grass: '#7bbd4a', foliage: '#5fa33a', water: '#3f76e4', fog: '#c8e0ff', sky: '#8ec5ff', temp: 0.3, precip: 'rain', features: ['reeds'] }),
  B({ id: 'riviere_gelee', name: 'Rivière gelée', dim: 'surface', top: 'gravier', filler: 'terre', underwater: 'gravier', grass: '#8ab09a', foliage: '#6a9a80', water: '#3a4ec0', fog: '#e0e8f0', sky: '#a8c8f0', temp: -0.8, precip: 'snow' }),
  B({ id: 'plaines', name: 'Plaines', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#7bbd4a', foliage: '#62a83a', water: '#3f76e4', fog: '#c8e0ff', sky: '#8ec5ff', temp: 0.35, precip: 'rain', trees: [{ id: 'chene', w: 3 }, { id: 'buisson', w: 2 }], treeChance: 0.0025, plants: [{ id: 'herbes_hautes', w: 40 }, { id: 'pissenlit', w: 2 }, { id: 'pavot', w: 2 }, { id: 'marguerite', w: 1 }, { id: 'buisson_baies', w: 0.3 }], plantChance: 0.22 }),
  B({ id: 'prairie_fleurie', name: 'Prairie fleurie', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#86c452', foliage: '#6cb044', water: '#3f76e4', fog: '#d0e6ff', sky: '#90c8ff', temp: 0.4, precip: 'rain', trees: [{ id: 'chene', w: 1 }, { id: 'bouleau', w: 1 }], treeChance: 0.004, plants: [{ id: 'herbes_hautes', w: 20 }, { id: 'pissenlit', w: 5 }, { id: 'pavot', w: 5 }, { id: 'bleuet', w: 5 }, { id: 'marguerite', w: 5 }, { id: 'digitale', w: 3 }, { id: 'lumifleur', w: 0.3 }], plantChance: 0.35 }),
  B({ id: 'foret', name: 'Forêt', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#5fa33a', foliage: '#4f9a30', water: '#3f76e4', fog: '#c4dcf5', sky: '#8ac0f8', temp: 0.25, precip: 'rain', trees: [{ id: 'chene', w: 6 }, { id: 'bouleau', w: 2 }, { id: 'grand_chene', w: 1 }], treeChance: 0.05, plants: [{ id: 'herbes_hautes', w: 12 }, { id: 'fougere', w: 5 }, { id: 'pavot', w: 1 }, { id: 'champignon_brun', w: 0.5 }, { id: 'buisson_baies', w: 0.6 }], plantChance: 0.14 }),
  B({ id: 'foret_bouleaux', name: 'Forêt de bouleaux', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#80b44e', foliage: '#74aa48', water: '#3f76e4', fog: '#cfe2f8', sky: '#8ec5ff', temp: 0.2, precip: 'rain', trees: [{ id: 'bouleau', w: 5 }, { id: 'grand_bouleau', w: 1 }], treeChance: 0.05, plants: [{ id: 'herbes_hautes', w: 12 }, { id: 'marguerite', w: 1 }, { id: 'bleuet', w: 1 }], plantChance: 0.15 }),
  B({ id: 'foret_ancienne', name: 'Forêt ancienne', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#4a8030', foliage: '#3a7026', water: '#3a6ad0', fog: '#a8bcc8', sky: '#7aa8d8', temp: 0.2, precip: 'rain', trees: [{ id: 'grand_chene', w: 4 }, { id: 'chene', w: 3 }, { id: 'champignon_geant', w: 0.4 }], treeChance: 0.085, plants: [{ id: 'fougere', w: 8 }, { id: 'herbes_hautes', w: 6 }, { id: 'champignon_brun', w: 1 }, { id: 'champignon_rouge', w: 1 }], plantChance: 0.15, features: ['humus'] }),
  B({ id: 'jungle', name: 'Jungle', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#3fae2e', foliage: '#30a024', water: '#2a9ab0', fog: '#b8e0c8', sky: '#80c0f0', temp: 0.8, precip: 'rain', trees: [{ id: 'teck_geant', w: 2 }, { id: 'teck', w: 4 }, { id: 'buisson_jungle', w: 4 }], treeChance: 0.1, plants: [{ id: 'herbes_hautes', w: 10 }, { id: 'fougere', w: 10 }, { id: 'buisson_baies', w: 0.3 }], plantChance: 0.3, features: ['moss'] }),
  B({ id: 'desert', name: 'Désert', dim: 'surface', top: 'sable', filler: 'sable', fillerDepth: 5, stone: 'gres', grass: '#c0b060', foliage: '#aea050', water: '#3a8ad0', fog: '#f0e2c0', sky: '#a8d4f5', temp: 0.95, precip: 'none', plants: [{ id: 'buisson_mort', w: 1 }], plantChance: 0.006, features: ['cactus', 'dunes'] }),
  B({ id: 'savane', name: 'Savane', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#b0b050', foliage: '#a0a040', water: '#3a86d0', fog: '#e8e0c0', sky: '#9accf5', temp: 0.75, precip: 'none', trees: [{ id: 'acacia', w: 5 }, { id: 'buisson', w: 1 }], treeChance: 0.006, plants: [{ id: 'herbe_seche', w: 6 }, { id: 'herbes_hautes', w: 4 }], plantChance: 0.25 }),
  B({ id: 'canyons_ocre', name: 'Canyons ocre', dim: 'surface', top: 'sable_ocre', filler: 'argile_cuite_ocre', fillerDepth: 3, grass: '#a09a50', foliage: '#9a9040', water: '#3a86d0', fog: '#f0c8a0', sky: '#a8c8e8', temp: 0.9, precip: 'none', plants: [{ id: 'buisson_mort', w: 1 }], plantChance: 0.008, features: ['cactus', 'terracotta'] }),
  B({ id: 'marecage', name: 'Marécage', dim: 'surface', top: 'herbe', filler: 'terre', underwater: 'boue', grass: '#5a7a3a', foliage: '#4a6a2a', water: '#4a6a4a', fog: '#a8b8a0', sky: '#8aa8b8', temp: 0.5, precip: 'rain', trees: [{ id: 'saule', w: 1 }], treeChance: 0.025, plants: [{ id: 'herbes_hautes', w: 10 }, { id: 'champignon_brun', w: 1 }, { id: 'fougere', w: 3 }], plantChance: 0.2, features: ['reeds', 'mud'] }),
  B({ id: 'taiga', name: 'Taïga', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#6a9a60', foliage: '#58885a', water: '#3a60c8', fog: '#c8d8e8', sky: '#8ab8e8', temp: -0.25, precip: 'rain', trees: [{ id: 'epicea', w: 6 }, { id: 'grand_epicea', w: 2 }], treeChance: 0.055, plants: [{ id: 'fougere', w: 8 }, { id: 'herbes_hautes', w: 4 }, { id: 'buisson_baies', w: 1 }, { id: 'champignon_brun', w: 0.5 }], plantChance: 0.16, features: ['humus'] }),
  B({ id: 'taiga_enneigee', name: 'Taïga enneigée', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#7aa08a', foliage: '#608a70', water: '#3a50c0', fog: '#dfe8f2', sky: '#a0c0e8', temp: -0.7, precip: 'snow', trees: [{ id: 'epicea', w: 5 }, { id: 'grand_epicea', w: 1 }], treeChance: 0.045, plants: [{ id: 'fougere', w: 3 }], plantChance: 0.06, features: ['snow'] }),
  B({ id: 'toundra', name: 'Toundra', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#8ab09a', foliage: '#6a9a80', water: '#3a50c0', fog: '#e6edf5', sky: '#a8c8f0', temp: -0.8, precip: 'snow', trees: [{ id: 'epicea', w: 1 }], treeChance: 0.002, plants: [{ id: 'herbes_hautes', w: 1 }], plantChance: 0.03, features: ['snow', 'ice_spikes'] }),
  B({ id: 'montagnes', name: 'Montagnes', dim: 'surface', top: 'herbe', filler: 'terre', fillerDepth: 2, grass: '#7aa060', foliage: '#5a8a50', water: '#3a6ad8', fog: '#d4e0ee', sky: '#90c0f0', temp: -0.1, precip: 'rain', trees: [{ id: 'epicea', w: 3 }, { id: 'chene', w: 1 }], treeChance: 0.008, plants: [{ id: 'herbes_hautes', w: 5 }, { id: 'digitale', w: 0.5 }], plantChance: 0.08, features: ['stony', 'snowcap'] }),
  B({ id: 'pics_geles', name: 'Pics gelés', dim: 'surface', top: 'neige', filler: 'neige', fillerDepth: 2, grass: '#8aa8a0', foliage: '#6a8a80', water: '#3a50c0', fog: '#eef3fa', sky: '#a8ccf5', temp: -0.9, precip: 'snow', features: ['stony', 'snowcap', 'ice'] }),
  B({ id: 'bosquet_cristal', name: 'Bosquet de cristal', dim: 'surface', top: 'herbe', filler: 'terre', grass: '#6ad0b0', foliage: '#5ac0c0', water: '#4ad0e0', fog: '#c0f0f0', sky: '#a0e0f8', temp: 0.1, precip: 'rain', trees: [{ id: 'prisme', w: 1 }], treeChance: 0.03, plants: [{ id: 'lumifleur', w: 3 }, { id: 'herbes_hautes', w: 6 }, { id: 'bleuet', w: 1 }], plantChance: 0.2, rare: true, features: ['crystals'] }),
  B({ id: 'foret_fongique', name: 'Forêt fongique', dim: 'surface', top: 'mycelium', filler: 'terre', grass: '#6a8a5a', foliage: '#5a7a4a', water: '#5a5ab0', fog: '#d0c0d8', sky: '#a8a0d0', temp: 0.3, precip: 'rain', trees: [{ id: 'champignon_geant', w: 1 }], treeChance: 0.03, plants: [{ id: 'champignon_rouge', w: 1 }, { id: 'champignon_brun', w: 1 }], plantChance: 0.06, rare: true }),
  B({ id: 'rivage_rocheux', name: 'Rivage rocheux', dim: 'surface', top: 'pierre', filler: 'pierre', grass: '#7aa060', foliage: '#5a8a50', water: '#3a6ad8', fog: '#c8dcf0', sky: '#8ec5ff', temp: 0.1, precip: 'rain', features: ['gravel'] }),
  // --- Abîme cendré (24..28)
  B({ id: 'plaines_cendre', name: 'Plaines de cendre', dim: 'abime', top: 'cendrite', filler: 'cendrite', grass: '#8a2a1a', foliage: '#8a2a1a', water: '#e8661a', fog: '#3a1210', sky: '#1a0806', temp: 0.9, precip: 'ash', plants: [{ id: 'champignon_ardent', w: 1 }, { id: 'clochette_ardente', w: 0.4 }], plantChance: 0.01, music: 'abime' }),
  B({ id: 'foret_ardente', name: 'Forêt ardente', dim: 'abime', top: 'mousse_braise', filler: 'cendrite', grass: '#b5302a', foliage: '#b5302a', water: '#e8661a', fog: '#4a1410', sky: '#200806', temp: 0.8, precip: 'ash', trees: [{ id: 'ardent_geant', w: 1 }, { id: 'ardent', w: 2 }], treeChance: 0.06, plants: [{ id: 'champignon_ardent', w: 3 }, { id: 'clochette_ardente', w: 2 }], plantChance: 0.12, music: 'abime' }),
  B({ id: 'delta_basalte', name: 'Delta de basalte', dim: 'abime', top: 'basalte', filler: 'basalte', grass: '#3d3c42', foliage: '#3d3c42', water: '#e8661a', fog: '#302a2e', sky: '#141014', temp: 0.95, precip: 'ash', features: ['basalt_columns', 'magma'], music: 'abime' }),
  B({ id: 'vallee_cristaux', name: 'Vallée des cristaux', dim: 'abime', top: 'sable_cendre', filler: 'sable_cendre', grass: '#ff6a1a', foliage: '#ff6a1a', water: '#e8661a', fog: '#3a1a28', sky: '#180812', temp: 0.7, precip: 'ash', plants: [{ id: 'cristal_braise', w: 1 }], plantChance: 0.03, features: ['ember_crystals'], music: 'abime' }),
  B({ id: 'marais_soufre', name: 'Marais de soufre', dim: 'abime', top: 'soufre', filler: 'cendrite', grass: '#d0bc3a', foliage: '#d0bc3a', water: '#e8661a', fog: '#3a3010', sky: '#181406', temp: 1, precip: 'ash', plants: [{ id: 'champignon_ardent', w: 1 }], plantChance: 0.01, music: 'abime' }),
  // --- Cimes astrales (29..32)
  B({ id: 'prairies_stellaires', name: 'Prairies stellaires', dim: 'astral', top: 'herbe_stellaire', filler: 'pierre_astrale', grass: '#3a6a8a', foliage: '#7a9aff', water: '#6a8aff', fog: '#1a1438', sky: '#07051a', temp: -0.1, precip: 'stardust', trees: [{ id: 'stellaire', w: 1 }], treeChance: 0.012, plants: [{ id: 'fleur_nebuleuse', w: 1 }], plantChance: 0.05, music: 'astral' }),
  B({ id: 'foret_cristalline', name: 'Forêt cristalline', dim: 'astral', top: 'herbe_stellaire', filler: 'pierre_astrale', grass: '#3a6a8a', foliage: '#b08aff', water: '#6a8aff', fog: '#201440', sky: '#0a061e', temp: -0.2, precip: 'stardust', trees: [{ id: 'stellaire', w: 2 }, { id: 'grand_stellaire', w: 1 }], treeChance: 0.05, plants: [{ id: 'cristal_astral', w: 1 }, { id: 'fleur_nebuleuse', w: 2 }], plantChance: 0.06, music: 'astral' }),
  B({ id: 'desert_etoiles', name: "Désert d'étoiles", dim: 'astral', top: 'poussiere_etoile', filler: 'poussiere_etoile', fillerDepth: 4, grass: '#ccc4e8', foliage: '#ccc4e8', water: '#6a8aff', fog: '#241c40', sky: '#0a0820', temp: 0, precip: 'stardust', plants: [{ id: 'cristal_astral', w: 1 }], plantChance: 0.01, music: 'astral' }),
  B({ id: 'vide_astral', name: 'Vide astral', dim: 'astral', top: 'pierre_astrale', filler: 'pierre_astrale', grass: '#3a6a8a', foliage: '#7a9aff', water: '#6a8aff', fog: '#0c0820', sky: '#030210', temp: -0.3, precip: 'none', music: 'astral' }),
];

export const BIOME_INDEX = new Map(BIOMES.map((b, i) => [b.id, i]));
export const biomeIdx = (id: string): number => {
  const i = BIOME_INDEX.get(id);
  if (i === undefined) throw new Error(`Biome inconnu : ${id}`);
  return i;
};

/** Applique d'éventuelles surcharges de biomes provenant des mods (même id = fusion). */
export function applyBiomeOverrides(overrides: { id: string; [k: string]: unknown }[] | undefined): void {
  for (const o of overrides ?? []) {
    const i = BIOME_INDEX.get(o.id);
    if (i !== undefined) BIOMES[i] = { ...BIOMES[i], ...(o as Partial<BiomeDef>) } as BiomeDef;
  }
}
