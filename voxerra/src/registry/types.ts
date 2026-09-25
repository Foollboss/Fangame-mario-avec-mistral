/** Schémas des données de contenu (JSON). Les mods utilisent exactement ces formats. */
import type { TextureDef } from '../render/texgen';

export type ShapeName =
  | 'none'
  | 'cube'
  | 'cross'
  | 'liquid'
  | 'slab'
  | 'stairs'
  | 'door'
  | 'torch'
  | 'pane'
  | 'wall'
  | 'fence'
  | 'ladder'
  | 'lever'
  | 'plate'
  | 'crop'
  | 'carpet'
  | 'chest'
  | 'lantern'
  | 'cactus'
  | 'farmland'
  | 'portal';

export type PassName = 'opaque' | 'cutout' | 'translucent';
export type ToolType = 'pickaxe' | 'axe' | 'shovel' | 'hoe' | 'sword' | 'shears';
export type SoundType = 'stone' | 'wood' | 'dirt' | 'grass' | 'sand' | 'gravel' | 'glass' | 'metal' | 'snow' | 'cloth' | 'crystal' | 'plant' | 'water' | 'lava';

export type TexSpec = string | { all?: string; top?: string; bottom?: string; side?: string; east?: string; west?: string; south?: string; north?: string; front?: string };

export interface DropDef {
  item: string;
  count?: number | [number, number];
  chance?: number;
  /** Nécessite un outil de ce type (ex : cisailles pour les feuilles). */
  tool?: ToolType;
  /** Conditions sur l'étape de croissance (méta) du bloc. */
  minStage?: number;
  maxStage?: number;
}

export interface BlockDef {
  id: string;
  name: string;
  tex?: TexSpec;
  shape?: ShapeName;
  pass?: PassName;
  solid?: boolean;
  lightOpacity?: number;
  light?: number;
  hardness?: number;
  tool?: ToolType;
  level?: number;
  drops?: 'self' | 'none' | string | DropDef[];
  sound?: SoundType;
  replaceable?: boolean;
  climbable?: boolean;
  liquid?: 'water' | 'lava';
  damage?: number;
  slow?: number;
  friction?: number;
  bounce?: number;
  tint?: 'grass' | 'foliage' | 'water';
  cullSelf?: boolean;
  anim?: 'water' | 'lava' | 'portal' | 'sway';
  variants?: ('slab' | 'stairs' | 'wall' | 'fence')[];
  interact?: string;
  item?: boolean;
  tags?: string[];
  stages?: number;
  tick?: { type: string; [k: string]: unknown };
  /** Propriétés arbitraires (données de comportement pour les mods). */
  data?: Record<string, unknown>;
  /** Couleur sur la carte / particules (hex). */
  color?: string;
  placeOn?: string[];
  flammable?: boolean;
  gravity?: boolean;
  /** Bloc orientable : la face « front » regarde le joueur qui le pose. */
  orient?: boolean;
}

export interface IconDef {
  t: string; // gabarit
  c?: string[]; // couleurs
}

export interface ItemDef {
  id: string;
  name: string;
  icon?: IconDef;
  block?: string;
  stack?: number;
  desc?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  tool?: { type: ToolType; tier: number; speed: number; durability: number };
  weapon?: { damage: number; cooldown: number; reach?: number; knockback?: number; element?: 'fire' | 'frost' | 'poison' | 'shock'; sweep?: boolean };
  ranged?: { projectile: string; ammo?: string; charge?: number; damage: number; speed: number; cooldown: number; durabilityCost?: number };
  armor?: { slot: 'head' | 'chest' | 'legs' | 'feet'; defense: number; durability: number; warmth?: number; fireRes?: number };
  shield?: { durability: number; block: number };
  food?: { energy: number; saturation?: number; heal?: number; effects?: { id: string; duration: number; level?: number; chance?: number }[]; returns?: string };
  fuel?: number;
  use?: string;
  useData?: Record<string, unknown>;
  throwable?: { projectile: string; speed: number };
  tags?: string[];
}

export interface IngredientSpec {
  item?: string;
  tag?: string;
}

export interface RecipeDef {
  id?: string;
  type: 'shaped' | 'shapeless';
  pattern?: string[];
  key?: Record<string, string>;
  ingredients?: string[];
  result: { item: string; count?: number };
  station?: string;
}

export interface SmeltDef {
  input: string;
  output: string;
  count?: number;
  time?: number;
}

export interface LootEntry {
  item: string;
  count?: number | [number, number];
  chance?: number;
  weight?: number;
}
export interface LootTable {
  rolls?: number | [number, number];
  entries: LootEntry[];
}

export interface ModelPart {
  id: string;
  size: [number, number, number];
  pos: [number, number, number];
  pivot?: [number, number, number];
  color: string;
  color2?: string;
  parent?: string;
  role?: string;
  eyes?: string;
  glow?: boolean;
  rot?: [number, number, number];
}

export interface CreatureDef {
  id: string;
  name: string;
  category: 'passive' | 'neutral' | 'hostile' | 'boss' | 'ambient';
  health: number;
  speed: number;
  damage?: number;
  armor?: number;
  size: [number, number];
  movement?: 'ground' | 'fly' | 'swim' | 'climb' | 'hover';
  ai: { type: string; [k: string]: unknown }[];
  model: { scale?: number; parts: ModelPart[] };
  loot?: LootEntry[];
  xp?: number;
  spawn?: {
    dimension: string;
    biomes?: string[];
    light?: [number, number];
    time?: 'day' | 'night' | 'any';
    weight?: number;
    group?: [number, number];
    where?: 'surface' | 'cave' | 'water' | 'air' | 'lava' | 'any';
    minY?: number;
    maxY?: number;
  }[];
  immune?: string[];
  element?: 'fire' | 'frost' | 'poison' | 'shock';
  sounds?: { idle?: string; hurt?: string; death?: string; attack?: string };
  phases?: { below: number; ai: { type: string; [k: string]: unknown }[]; message?: string; speed?: number }[];
  burnsInDaylight?: boolean;
  fireImmune?: boolean;
  knockbackResist?: number;
  gravity?: number;
  persistent?: boolean;
  bossBar?: boolean;
}

export interface AdvancementDef {
  id: string;
  title: string;
  desc: string;
  icon: string;
  parent?: string;
  trigger: { type: string; [k: string]: unknown };
  goal?: boolean;
}

export interface EffectDef {
  id: string;
  name: string;
  color: string;
  bad?: boolean;
}

export interface ContentPack {
  id: string;
  name?: string;
  textures?: Record<string, TextureDef>;
  blocks?: BlockDef[];
  items?: ItemDef[];
  recipes?: RecipeDef[];
  smelting?: SmeltDef[];
  creatures?: CreatureDef[];
  loot?: Record<string, LootTable>;
  advancements?: AdvancementDef[];
  effects?: EffectDef[];
  biomes?: BiomeDefLike[];
  structures?: StructureTemplateDef[];
  lang?: Record<string, string>;
}

/** Biomes : voir worldgen/biomes.ts pour la sémantique. */
export interface BiomeDefLike {
  id: string;
  name: string;
  dimension: string;
  [k: string]: unknown;
}

/** Structures « gabarit » (définies par couches dans les données, utiles pour les mods). */
export interface StructureTemplateDef {
  id: string;
  dimension: string;
  biomes?: string[];
  rarity: number; // 1 sur N régions
  spacing?: number; // taille de région en chunks
  palette: Record<string, string>;
  layers: string[][]; // [y][z] chaînes sur x
  loot?: string;
  offsetY?: number;
}
