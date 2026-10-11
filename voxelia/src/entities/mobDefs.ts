/** Définitions data-driven des créatures : statistiques, comportement, butin, apparition. */

export type MobKind = 'passive' | 'hostile' | 'neutral' | 'aquatic' | 'flying' | 'npc' | 'boss';

export interface MobDef {
  key: string;
  name: string;
  model: string;
  kind: MobKind;
  width: number;
  height: number;
  health: number;
  speed: number;
  damage?: number;
  /** Attaque à distance. */
  ranged?: { projectile: 'arrow' | 'small_fireball' | 'fireball' | 'poison' | 'snowball'; range: number; cooldown: number };
  drops?: Array<[string, number, number, number?]>;
  xp?: [number, number];
  sound: string;
  tempt?: string[];
  burnsInSun?: boolean;
  fireImmune?: boolean;
  climbs?: boolean;
  explode?: { power: number; fuse: number };
  splits?: boolean;
  rideable?: boolean;
  /** Vole (pas de gravité). */
  flies?: boolean;
  /** Ne vit que dans l'eau. */
  swims?: boolean;
  /** Créature rare ou légendaire (nom en couleur). */
  rarity?: 'rare' | 'legendary';
  /** Taille du modèle (multiplicateur). */
  scale?: number;
  /** Lumineux (non assombri la nuit). */
  glow?: boolean;
  /** Distance de détection des cibles. */
  follow?: number;
  /** Nom du boss pour la barre de vie. */
  bossTitle?: string;
}

export const MOB_DEFS: Record<string, MobDef> = {};

function m(d: MobDef): void {
  MOB_DEFS[d.key] = d;
}

// Animaux
m({ key: 'cow', name: 'Vache', model: 'cow', kind: 'passive', width: 0.9, height: 1.4, health: 10, speed: 0.2, drops: [['raw_beef', 1, 3], ['leather', 0, 2]], xp: [1, 3], sound: 'cow', tempt: ['wheat'] });
m({ key: 'mooshroom', name: 'Champimeuh', model: 'mooshroom', kind: 'passive', width: 0.9, height: 1.4, health: 10, speed: 0.2, drops: [['raw_beef', 1, 3], ['red_mushroom', 0, 2]], xp: [1, 3], sound: 'cow', tempt: ['wheat'] });
m({ key: 'pig', name: 'Cochon', model: 'pig', kind: 'passive', width: 0.9, height: 0.9, health: 10, speed: 0.25, drops: [['raw_porkchop', 1, 3]], xp: [1, 3], sound: 'pig', tempt: ['carrot', 'potato', 'beetroot'] });
m({ key: 'sheep', name: 'Mouton', model: 'sheep', kind: 'passive', width: 0.9, height: 1.3, health: 8, speed: 0.23, drops: [['raw_mutton', 1, 2], ['white_wool', 1, 1]], xp: [1, 3], sound: 'sheep', tempt: ['wheat'] });
m({ key: 'sky_sheep', name: 'Mouton céleste', model: 'sky_sheep', kind: 'passive', width: 0.9, height: 1.3, health: 10, speed: 0.23, drops: [['raw_mutton', 1, 2], ['light_blue_wool', 1, 2], ['sky_feather', 0, 1, 0.3]], xp: [2, 4], sound: 'sheep', tempt: ['wheat'] });
m({ key: 'chicken', name: 'Poule', model: 'chicken', kind: 'passive', width: 0.4, height: 0.7, health: 4, speed: 0.25, drops: [['raw_chicken', 1, 1], ['feather', 0, 2]], xp: [1, 2], sound: 'chicken', tempt: ['wheat_seeds', 'beetroot_seeds'] });
m({ key: 'parrot', name: 'Perroquet', model: 'parrot', kind: 'passive', width: 0.5, height: 0.9, health: 6, speed: 0.25, drops: [['feather', 1, 2]], xp: [1, 3], sound: 'parrot', tempt: ['wheat_seeds'] });
m({ key: 'horse', name: 'Cheval', model: 'horse', kind: 'passive', width: 1.3, height: 1.6, health: 22, speed: 0.225, drops: [['leather', 0, 2]], xp: [1, 3], sound: 'horse', tempt: ['apple', 'wheat', 'golden_apple'], rideable: true });
m({ key: 'rabbit', name: 'Lapin', model: 'rabbit', kind: 'passive', width: 0.4, height: 0.5, health: 3, speed: 0.3, drops: [['leather', 0, 1]], xp: [1, 2], sound: 'rabbit', tempt: ['carrot'] });
m({ key: 'fox', name: 'Renard', model: 'fox', kind: 'passive', width: 0.6, height: 0.7, health: 10, speed: 0.3, drops: [['leather', 0, 1]], xp: [1, 3], sound: 'fox', tempt: ['raw_chicken'] });
m({ key: 'deer', name: 'Cerf', model: 'deer', kind: 'passive', width: 0.8, height: 1.6, health: 14, speed: 0.26, drops: [['raw_venison', 1, 3], ['leather', 0, 2]], xp: [1, 3], sound: 'deer', tempt: ['apple'] });
m({ key: 'goat', name: 'Chèvre', model: 'goat', kind: 'passive', width: 0.8, height: 1.2, health: 10, speed: 0.25, drops: [['raw_mutton', 1, 2]], xp: [1, 3], sound: 'goat', tempt: ['wheat'] });
m({ key: 'turtle', name: 'Tortue', model: 'turtle', kind: 'passive', width: 1.1, height: 0.4, health: 30, speed: 0.12, drops: [['kelp', 0, 2]], xp: [1, 3], sound: 'turtle', tempt: ['seagrass'] });
m({ key: 'frog', name: 'Grenouille', model: 'frog', kind: 'passive', width: 0.5, height: 0.5, health: 6, speed: 0.25, xp: [1, 2], sound: 'frog' });
m({ key: 'golden_stag', name: 'Cerf doré', model: 'golden_stag', kind: 'passive', width: 0.9, height: 1.8, health: 40, speed: 0.34, drops: [['golden_antler', 1, 1], ['gold_ingot', 2, 5]], xp: [40, 60], sound: 'golden_stag', rarity: 'legendary', glow: true });
m({ key: 'polar_bear_cub', name: 'Ourson polaire', model: 'sheep', kind: 'passive', width: 0.9, height: 1.2, health: 15, speed: 0.25, xp: [1, 3], sound: 'cow' });

// Aquatiques
m({ key: 'cod', name: 'Morue', model: 'cod', kind: 'aquatic', width: 0.5, height: 0.3, health: 3, speed: 0.1, drops: [['raw_cod', 1, 1], ['bone_meal', 0, 1, 0.05]], xp: [1, 2], sound: 'cod', swims: true });
m({ key: 'salmon', name: 'Saumon', model: 'salmon', kind: 'aquatic', width: 0.6, height: 0.4, health: 3, speed: 0.1, drops: [['raw_salmon', 1, 1]], xp: [1, 2], sound: 'cod', swims: true });
m({ key: 'tropical_fish', name: 'Poisson tropical', model: 'tropical_fish', kind: 'aquatic', width: 0.4, height: 0.3, health: 3, speed: 0.1, drops: [['bone_meal', 0, 1, 0.1]], xp: [1, 2], sound: 'cod', swims: true });
m({ key: 'squid', name: 'Calmar', model: 'squid', kind: 'aquatic', width: 0.8, height: 0.8, health: 10, speed: 0.08, drops: [['black_wool', 0, 1]], xp: [1, 3], sound: 'cod', swims: true });
m({ key: 'dolphin', name: 'Dauphin', model: 'dolphin', kind: 'aquatic', width: 0.9, height: 0.6, health: 10, speed: 0.15, drops: [['raw_cod', 0, 1]], xp: [1, 3], sound: 'dolphin', swims: true });

// Hostiles
m({ key: 'zombie', name: 'Zombie', model: 'zombie', kind: 'hostile', width: 0.6, height: 1.9, health: 20, speed: 0.23, damage: 3, drops: [['rotten_flesh', 0, 2], ['iron_ingot', 0, 1, 0.025], ['carrot', 0, 1, 0.025], ['potato', 0, 1, 0.025]], xp: [5, 5], sound: 'zombie', burnsInSun: true, follow: 35 });
m({ key: 'husk', name: 'Zombie des sables', model: 'husk', kind: 'hostile', width: 0.6, height: 1.9, health: 20, speed: 0.23, damage: 3, drops: [['rotten_flesh', 0, 2], ['sand', 0, 1]], xp: [5, 5], sound: 'zombie', follow: 35 });
m({ key: 'skeleton', name: 'Squelette', model: 'skeleton', kind: 'hostile', width: 0.6, height: 1.9, health: 20, speed: 0.25, damage: 2, ranged: { projectile: 'arrow', range: 15, cooldown: 40 }, drops: [['bone', 0, 2], ['arrow', 0, 2]], xp: [5, 5], sound: 'skeleton', burnsInSun: true, follow: 16 });
m({ key: 'stray', name: 'Squelette glacé', model: 'stray', kind: 'hostile', width: 0.6, height: 1.9, health: 20, speed: 0.25, damage: 2, ranged: { projectile: 'arrow', range: 15, cooldown: 40 }, drops: [['bone', 0, 2], ['arrow', 0, 2], ['snowball', 0, 2]], xp: [5, 5], sound: 'skeleton', burnsInSun: true, follow: 16 });
m({ key: 'spider', name: 'Araignée', model: 'spider', kind: 'hostile', width: 1.4, height: 0.9, health: 16, speed: 0.3, damage: 2, drops: [['string', 0, 2], ['spider_eye', 0, 1, 0.33]], xp: [5, 5], sound: 'spider', climbs: true, follow: 16 });
m({ key: 'boomshroom', name: 'Champignon explosif', model: 'boomshroom', kind: 'hostile', width: 0.8, height: 1.5, health: 20, speed: 0.22, explode: { power: 3, fuse: 30 }, drops: [['gunpowder', 0, 2], ['red_mushroom', 0, 1]], xp: [5, 5], sound: 'boomshroom', follow: 16 });
m({ key: 'cave_crawler', name: 'Rampant des cavernes', model: 'cave_crawler', kind: 'hostile', width: 1.0, height: 0.6, health: 18, speed: 0.32, damage: 4, drops: [['bone', 0, 2], ['string', 0, 1], ['crystal_shard', 0, 1, 0.2]], xp: [6, 8], sound: 'cave_crawler', climbs: true, follow: 20 });
m({ key: 'night_wraith', name: 'Spectre nocturne', model: 'night_wraith', kind: 'flying', width: 0.8, height: 2.0, health: 20, speed: 0.15, damage: 3, drops: [['glowstone_dust', 0, 2], ['feather', 0, 1]], xp: [6, 8], sound: 'night_wraith', burnsInSun: true, flies: true, follow: 32 });
m({ key: 'slime', name: 'Slime', model: 'slime', kind: 'hostile', width: 1.0, height: 1.0, health: 16, speed: 0.25, damage: 3, drops: [['slime_ball', 0, 2]], xp: [3, 4], sound: 'slime', splits: true, follow: 16 });
m({ key: 'crystal_slime', name: 'Slime de cristal', model: 'crystal_slime', kind: 'hostile', width: 1.0, height: 1.0, health: 18, speed: 0.25, damage: 3, drops: [['crystal_shard', 0, 2], ['slime_ball', 0, 1]], xp: [4, 6], sound: 'crystal_slime', splits: true, follow: 16, glow: true });
m({ key: 'magma_cube', name: 'Gelée de magma', model: 'magma_cube', kind: 'hostile', width: 1.0, height: 1.0, health: 16, speed: 0.25, damage: 4, drops: [['magma_cream', 0, 1]], xp: [4, 4], sound: 'magma_cube', splits: true, fireImmune: true, follow: 16, glow: true });
m({ key: 'witch', name: 'Sorcière', model: 'witch', kind: 'hostile', width: 0.6, height: 1.9, health: 26, speed: 0.25, damage: 2, ranged: { projectile: 'poison', range: 10, cooldown: 60 }, drops: [['glowstone_dust', 0, 2], ['sugar', 0, 2], ['spider_eye', 0, 1]], xp: [5, 5], sound: 'witch', follow: 16 });
m({ key: 'ember_salamander', name: 'Salamandre de braise', model: 'ember_salamander', kind: 'hostile', width: 1.0, height: 0.7, health: 22, speed: 0.28, damage: 5, drops: [['ember_shard', 0, 2], ['leather', 0, 1]], xp: [6, 9], sound: 'ember_salamander', fireImmune: true, follow: 20, glow: true });
m({ key: 'fire_spirit', name: 'Esprit de feu', model: 'fire_spirit', kind: 'flying', width: 0.8, height: 1.4, health: 20, speed: 0.12, damage: 3, ranged: { projectile: 'small_fireball', range: 20, cooldown: 50 }, drops: [['ember_shard', 0, 1], ['glowstone_dust', 0, 2]], xp: [8, 10], sound: 'fire_spirit', fireImmune: true, flies: true, follow: 32, glow: true });
m({ key: 'storm_bird', name: 'Oiseau-tempête', model: 'storm_bird', kind: 'flying', width: 1.2, height: 0.8, health: 18, speed: 0.18, damage: 4, drops: [['sky_feather', 1, 2], ['feather', 1, 3]], xp: [6, 9], sound: 'storm_bird', flies: true, follow: 32 });

// PNJ
m({ key: 'villager', name: 'Villageois', model: 'villager', kind: 'npc', width: 0.6, height: 1.9, health: 20, speed: 0.25, xp: [0, 0], sound: 'villager' });
m({ key: 'village_guard', name: 'Garde du village', model: 'village_guard', kind: 'neutral', width: 0.7, height: 2.0, health: 60, speed: 0.25, damage: 7, drops: [['iron_ingot', 1, 3], ['bread', 0, 2]], xp: [0, 0], sound: 'village_guard', follow: 20 });

// Boss
m({ key: 'ancient_golem', name: 'Golem antique', model: 'ancient_golem', kind: 'boss', width: 2.4, height: 4.4, health: 300, speed: 0.22, damage: 12, drops: [['ancient_gear', 1, 1], ['mythril_ingot', 3, 6], ['diamond', 2, 5]], xp: [200, 200], sound: 'ancient_golem', bossTitle: 'Golem antique', follow: 40 });
m({ key: 'deep_guardian', name: 'Gardien des profondeurs', model: 'deep_guardian', kind: 'boss', width: 2.6, height: 2.6, health: 260, speed: 0.12, damage: 8, drops: [['abyss_pearl', 1, 1], ['diamond', 3, 7], ['sapphire', 6, 12]], xp: [200, 200], sound: 'deep_guardian', flies: true, bossTitle: 'Gardien des profondeurs', follow: 40, glow: true });
m({ key: 'ember_sovereign', name: 'Souverain des braises', model: 'ember_sovereign', kind: 'boss', width: 1.6, height: 4.6, health: 350, speed: 0.24, damage: 10, ranged: { projectile: 'fireball', range: 30, cooldown: 60 }, drops: [['ember_crown', 1, 1], ['ember_shard', 8, 16], ['mythril_ingot', 2, 4]], xp: [300, 300], sound: 'ember_sovereign', fireImmune: true, bossTitle: 'Souverain des braises', follow: 48, glow: true });
m({ key: 'sky_dragon', name: 'Dragon des cieux', model: 'sky_dragon', kind: 'boss', width: 4, height: 2.5, health: 400, speed: 0.3, damage: 10, drops: [['dragon_scale', 1, 1], ['sky_feather', 6, 12], ['diamond', 4, 8]], xp: [500, 500], sound: 'sky_dragon', flies: true, bossTitle: 'Dragon des cieux', follow: 64 });

/** Correspondance des noms utilisés par les biomes vers les créatures disponibles. */
export function resolveMob(key: string): string | null {
  return MOB_DEFS[key] ? key : null;
}
