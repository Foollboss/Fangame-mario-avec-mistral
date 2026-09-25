/**
 * Registre des blocs : transforme les définitions JSON en tables typées compactes
 * (accès O(1) dans le mailleur, l'éclairage et la physique).
 */
import type { BlockDef, ShapeName, TexSpec, DropDef, SoundType, ToolType } from './types';

export const SHAPES: ShapeName[] = [
  'none', 'cube', 'cross', 'liquid', 'slab', 'stairs', 'door', 'torch', 'pane', 'wall', 'fence',
  'ladder', 'lever', 'plate', 'crop', 'carpet', 'chest', 'lantern', 'cactus', 'farmland', 'portal',
];
export const Shape = Object.fromEntries(SHAPES.map((s, i) => [s.toUpperCase(), i])) as Record<Uppercase<ShapeName>, number>;

export const PASS_OPAQUE = 0;
export const PASS_CUTOUT = 1;
export const PASS_TRANSLUCENT = 2;

export const TINT_NONE = 0;
export const TINT_GRASS = 1;
export const TINT_FOLIAGE = 2;
export const TINT_WATER = 3;

export const ANIM_NONE = 0;
export const ANIM_WATER = 1;
export const ANIM_LAVA = 2;
export const ANIM_PORTAL = 3;
export const ANIM_SWAY = 4;

export const LIQ_NONE = 0;
export const LIQ_WATER = 1;
export const LIQ_LAVA = 2;

/** Ordre des faces : +X, -X, +Y, -Y, +Z, -Z */
export const FACE_PX = 0;
export const FACE_NX = 1;
export const FACE_PY = 2;
export const FACE_NY = 3;
export const FACE_PZ = 4;
export const FACE_NZ = 5;
export const FACE_DIRS: readonly [number, number, number][] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

/** Cellule = id (12 bits) | méta (4 bits) << 12 */
export const ID_MASK = 0xfff;
export const cellId = (v: number): number => v & ID_MASK;
export const cellMeta = (v: number): number => v >>> 12;
export const makeCell = (id: number, meta = 0): number => (id & ID_MASK) | ((meta & 15) << 12);

export interface BlockInfo {
  num: number;
  id: string;
  name: string;
  def: BlockDef;
  shape: number;
  pass: number;
  solid: boolean;
  opaque: boolean;
  hardness: number;
  tool?: ToolType;
  level: number;
  drops: DropDef[];
  sound: SoundType;
  tags: Set<string>;
  interact?: string;
  light: number;
  color: [number, number, number];
  faceTex: string[]; // 6 noms de texture
}

const VOWELS = /^[aeiouyhàâéèêëîïôûùAEIOUYHÉÈÊ]/;
export const deName = (name: string): string => (VOWELS.test(name) ? "d'" : 'de ') + name.charAt(0).toLowerCase() + name.slice(1);

const VARIANT_INFO: Record<string, { suffix: string; label: string; shape: ShapeName }> = {
  slab: { suffix: '_dalle', label: 'Dalle', shape: 'slab' },
  stairs: { suffix: '_escalier', label: 'Escalier', shape: 'stairs' },
  wall: { suffix: '_muret', label: 'Muret', shape: 'wall' },
  fence: { suffix: '_barriere', label: 'Barrière', shape: 'fence' },
};

/** Développe les variantes (dalles, escaliers, murets, barrières) déclarées dans un bloc. */
export function expandBlockDefs(defs: BlockDef[]): BlockDef[] {
  const out: BlockDef[] = [];
  for (const d of defs) {
    out.push(d);
    for (const v of d.variants ?? []) {
      const info = VARIANT_INFO[v];
      if (!info) continue;
      out.push({
        id: d.id + info.suffix,
        name: `${info.label} ${deName(d.name)}`,
        tex: d.tex,
        shape: info.shape,
        pass: d.pass === 'translucent' ? 'translucent' : d.pass === 'cutout' ? 'cutout' : 'opaque',
        hardness: d.hardness,
        tool: d.tool,
        level: d.level,
        sound: d.sound,
        tags: [...(d.tags ?? []).filter((t) => t !== 'ore'), 'variant', v],
        color: d.color,
        flammable: d.flammable,
      });
    }
  }
  return out;
}

function faceTextures(tex: TexSpec | undefined, fallback: string): string[] {
  if (!tex) return Array(6).fill(fallback);
  if (typeof tex === 'string') return Array(6).fill(tex);
  const all = tex.all ?? tex.side ?? fallback;
  const side = tex.side ?? all;
  return [
    tex.east ?? side,
    tex.west ?? side,
    tex.top ?? all,
    tex.bottom ?? tex.top ?? all,
    tex.south ?? tex.front ?? side,
    tex.north ?? side,
  ];
}

export class BlockRegistry {
  readonly list: BlockInfo[] = [];
  readonly byId = new Map<string, BlockInfo>();
  /** Liste ordonnée des textures ; index = couche dans la texture tableau. */
  readonly textureNames: string[] = [];
  private texIndex = new Map<string, number>();

  // Tables typées « chaudes »
  solid!: Uint8Array;
  opaque!: Uint8Array;
  lightOpacity!: Uint8Array;
  lightEmit!: Uint8Array;
  shape!: Uint8Array;
  pass!: Uint8Array;
  faceTex!: Uint16Array;
  tint!: Uint8Array;
  cullSelf!: Uint8Array;
  liquid!: Uint8Array;
  replaceable!: Uint8Array;
  climbable!: Uint8Array;
  anim!: Uint8Array;
  stages!: Uint8Array;
  hardness!: Float32Array;
  damage!: Float32Array;
  slow!: Float32Array;
  friction!: Float32Array;
  connectable!: Uint8Array;
  orient!: Uint8Array;

  constructor(defs: BlockDef[], extraTextures: string[] = []) {
    const all: BlockDef[] = [{ id: 'air', name: 'Air', shape: 'none', item: false }, ...expandBlockDefs(defs.filter((d) => d.id !== 'air'))];
    const seen = new Set<string>();
    const unique: BlockDef[] = [];
    // Une redéfinition (mod) remplace la définition précédente au même rang.
    for (const d of all) {
      if (seen.has(d.id)) {
        const i = unique.findIndex((u) => u.id === d.id);
        unique[i] = { ...unique[i], ...d };
      } else {
        seen.add(d.id);
        unique.push(d);
      }
    }
    if (unique.length > ID_MASK) throw new Error('Trop de blocs (max 4095)');

    const n = unique.length;
    this.solid = new Uint8Array(n);
    this.opaque = new Uint8Array(n);
    this.lightOpacity = new Uint8Array(n);
    this.lightEmit = new Uint8Array(n);
    this.shape = new Uint8Array(n);
    this.pass = new Uint8Array(n);
    this.faceTex = new Uint16Array(n * 6);
    this.tint = new Uint8Array(n);
    this.cullSelf = new Uint8Array(n);
    this.liquid = new Uint8Array(n);
    this.replaceable = new Uint8Array(n);
    this.climbable = new Uint8Array(n);
    this.anim = new Uint8Array(n);
    this.stages = new Uint8Array(n);
    this.hardness = new Float32Array(n);
    this.damage = new Float32Array(n);
    this.slow = new Float32Array(n);
    this.friction = new Float32Array(n);
    this.connectable = new Uint8Array(n);
    this.orient = new Uint8Array(n);

    unique.forEach((d, num) => {
      const shapeName: ShapeName = d.shape ?? 'cube';
      const shape = SHAPES.indexOf(shapeName);
      const isCube = shapeName === 'cube';
      const passName = d.pass ?? (isCube || shapeName === 'slab' || shapeName === 'stairs' || shapeName === 'wall' || shapeName === 'fence' || shapeName === 'chest' || shapeName === 'cactus' || shapeName === 'farmland' || shapeName === 'carpet' || shapeName === 'plate' || shapeName === 'lantern' ? 'opaque' : shapeName === 'liquid' ? 'translucent' : 'cutout');
      const pass = passName === 'opaque' ? PASS_OPAQUE : passName === 'cutout' ? PASS_CUTOUT : PASS_TRANSLUCENT;
      const nonSolidShapes: ShapeName[] = ['none', 'cross', 'liquid', 'torch', 'lever', 'plate', 'crop', 'carpet', 'ladder', 'portal'];
      const solid = d.solid ?? !nonSolidShapes.includes(shapeName);
      const opaque = isCube && pass === PASS_OPAQUE && solid !== false;
      const lightOpacity = d.lightOpacity ?? (opaque ? 15 : shapeName === 'liquid' ? (d.liquid === 'lava' ? 15 : 2) : isCube && pass === PASS_CUTOUT ? 1 : 0);
      const faces = faceTextures(d.tex, d.id);
      const info: BlockInfo = {
        num,
        id: d.id,
        name: d.name,
        def: d,
        shape,
        pass,
        solid,
        opaque,
        hardness: d.hardness ?? (shapeName === 'none' ? 0 : 1),
        tool: d.tool,
        level: d.level ?? 0,
        drops: normalizeDrops(d),
        sound: d.sound ?? 'stone',
        tags: new Set(d.tags ?? []),
        interact: d.interact,
        light: d.light ?? 0,
        color: hexColor(d.color ?? '#888888'),
        faceTex: faces,
      };
      this.list.push(info);
      this.byId.set(d.id, info);
      this.solid[num] = solid ? 1 : 0;
      this.opaque[num] = opaque ? 1 : 0;
      this.lightOpacity[num] = Math.min(15, lightOpacity);
      this.lightEmit[num] = Math.min(15, d.light ?? 0);
      this.shape[num] = shape;
      this.pass[num] = pass;
      this.tint[num] = d.tint === 'grass' ? TINT_GRASS : d.tint === 'foliage' ? TINT_FOLIAGE : d.tint === 'water' ? TINT_WATER : TINT_NONE;
      this.cullSelf[num] = (d.cullSelf ?? (pass === PASS_TRANSLUCENT || shapeName === 'liquid')) ? 1 : 0;
      this.liquid[num] = d.liquid === 'water' ? LIQ_WATER : d.liquid === 'lava' ? LIQ_LAVA : LIQ_NONE;
      this.replaceable[num] = (d.replaceable ?? (shapeName === 'none' || shapeName === 'liquid')) ? 1 : 0;
      this.climbable[num] = (d.climbable ?? shapeName === 'ladder') ? 1 : 0;
      this.anim[num] = d.anim === 'water' ? ANIM_WATER : d.anim === 'lava' ? ANIM_LAVA : d.anim === 'portal' ? ANIM_PORTAL : d.anim === 'sway' ? ANIM_SWAY : ANIM_NONE;
      this.stages[num] = d.stages ?? 0;
      this.hardness[num] = info.hardness;
      this.damage[num] = d.damage ?? 0;
      this.slow[num] = d.slow ?? 0;
      this.friction[num] = d.friction ?? 0;
      this.connectable[num] = opaque || shapeName === 'fence' || shapeName === 'wall' || shapeName === 'pane' ? 1 : 0;
      this.orient[num] = d.orient ? 1 : 0;
    });

    // Allocation des couches de texture (les étapes de croissance sont consécutives).
    const alloc = (name: string, stages: number) => {
      if (stages > 1) {
        const key = `${name}_0`;
        if (!this.texIndex.has(key)) for (let s = 0; s < stages; s++) this.addTex(`${name}_${s}`);
        return this.texIndex.get(key)!;
      }
      if (!this.texIndex.has(name)) this.addTex(name);
      return this.texIndex.get(name)!;
    };
    for (const info of this.list) {
      if (info.shape === Shape.NONE) continue;
      const st = this.stages[info.num];
      for (let f = 0; f < 6; f++) this.faceTex[info.num * 6 + f] = alloc(info.faceTex[f], st);
    }
    for (const t of extraTextures) alloc(t, 0);
  }

  private addTex(name: string): void {
    this.texIndex.set(name, this.textureNames.length);
    this.textureNames.push(name);
  }

  textureLayer(name: string): number {
    return this.texIndex.get(name) ?? -1;
  }

  get count(): number {
    return this.list.length;
  }

  num(id: string): number {
    const b = this.byId.get(id);
    if (!b) throw new Error(`Bloc inconnu : ${id}`);
    return b.num;
  }

  /** Comme num() mais renvoie 0 (air) si inconnu. */
  tryNum(id: string): number {
    return this.byId.get(id)?.num ?? 0;
  }

  get(num: number): BlockInfo {
    return this.list[num] ?? this.list[0];
  }

  hasTag(num: number, tag: string): boolean {
    return this.list[num]?.tags.has(tag) ?? false;
  }

  /** Tables sérialisables pour les workers. */
  tables() {
    return {
      solid: this.solid,
      opaque: this.opaque,
      lightOpacity: this.lightOpacity,
      lightEmit: this.lightEmit,
      shape: this.shape,
      pass: this.pass,
      faceTex: this.faceTex,
      tint: this.tint,
      cullSelf: this.cullSelf,
      liquid: this.liquid,
      anim: this.anim,
      stages: this.stages,
      connectable: this.connectable,
      orient: this.orient,
    };
  }
}

export type BlockTables = ReturnType<BlockRegistry['tables']>;

function normalizeDrops(d: BlockDef): DropDef[] {
  if (d.drops === 'none') return [];
  if (d.drops === undefined || d.drops === 'self') return d.item === false ? [] : [{ item: d.id }];
  if (typeof d.drops === 'string') return [{ item: d.drops }];
  return d.drops;
}

function hexColor(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
