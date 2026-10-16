/**
 * Lecture d'un pack de ressources décompressé : détection du format (Java récent,
 * Java ancien, Bedrock) et de la racine (pack rangé dans un dossier), correspondance
 * des noms, découpage des animations, analyse de la teinte de biome, palettes de
 * couleurs (colormap). Code pur, sans DOM : testable hors navigateur.
 *
 * Choix pour les dossiers « overlay_* » des packs Java : ils ciblent des versions
 * précises du jeu de référence ; on garde toujours les fichiers de base du pack.
 */
import { blankImage, compose, crop, decodeImage, lerpPixels, meanSaturation, multiply, resizeBox, type RGBAImage } from './images';
import { BEDROCK_BLOCKS, BLOCK_RECIPES, FLOW_TEXTURES, JAVA_BLOCKS, JAVA_ITEMS, LEATHER_COLOR, LEATHER_PIECES, LEGACY_BLOCKS, LEGACY_ITEMS, SPAWN_EGG_NAMES, type Recipe } from './textureNames';
import { chestPart, bedPart } from './entityTextures';

export const TEX = 16;
export const TEX_BYTES = TEX * TEX * 4;
/** Nombre maximal d'images conservées pour une animation. */
const MAX_FRAMES = 64;

export type PackFormat = 'java' | 'java_legacy' | 'bedrock';

/** Accès aux fichiers d'une archive (chemins normalisés avec « / »). */
export interface PackSource {
  names: string[];
  read(path: string): Uint8Array | undefined;
}

/** Animation : liste [image, durée en ticks] et interpolation éventuelle. */
export interface AnimInfo {
  seq: Array<[number, number]>;
  interpolate?: boolean;
}

export interface ReadOptions {
  /** Noms des textures de blocs Voxelia (atlas). */
  blockTextures: string[];
  /** Nombre d'images de l'atlas pour une texture (1 = fixe). */
  frameSlots: (name: string) => number;
  /** Clés d'icônes d'objets Voxelia. */
  itemKeys: string[];
  /** Blocs teintés par biome (clé du bloc, texture principale). */
  tintedBlocks: Array<{ key: string; tex: string }>;
  onProgress?: (p: number) => void;
}

export interface ConvertedPack {
  format: PackFormat;
  root: string;
  /** Nom déclaré par le pack (manifeste Bedrock) ou chaîne vide. */
  title: string;
  description: string;
  /** Icône du pack (octets PNG d'origine). */
  icon?: Uint8Array;
  /** Textures de blocs : n images RGBA 16x16 concaténées. */
  textures: Record<string, Uint8Array>;
  anims: Record<string, AnimInfo>;
  /** Icônes d'objets : RGBA 16x16. */
  items: Record<string, Uint8Array>;
  /** Palettes de couleurs 256x256 RGBA. */
  colormaps: { grass?: Uint8Array; foliage?: Uint8Array };
  /** Blocs dont la texture du pack est déjà colorée (teinte de biome désactivée). */
  untinted: string[];
  /** Fichier source de chaque texture reconnue (diagnostic). */
  sources: Record<string, string>;
  /** Nombre de textures redimensionnées en 16x16. */
  resized: number;
  /** Fichiers reconnus mais illisibles. */
  broken: string[];
}

// ------------------------------------------------------------------ utilitaires

function stripCodes(s: string): string {
  return s.replace(/§./g, '').replace(/\s+/g, ' ').trim();
}

/** Texte d'un composant de texte JSON (chaîne, tableau ou objet { text, extra }). */
function flatText(x: unknown): string {
  if (typeof x === 'string') return x;
  if (typeof x === 'number' || typeof x === 'boolean') return String(x);
  if (Array.isArray(x)) return x.map(flatText).join('');
  if (x && typeof x === 'object') {
    const o = x as { text?: unknown; translate?: unknown; extra?: unknown };
    return flatText(o.text ?? o.translate ?? '') + flatText(o.extra ?? '');
  }
  return '';
}

function parseJson(bytes: Uint8Array | undefined): any {
  if (!bytes) return undefined;
  try {
    let s = new TextDecoder('utf-8').decode(bytes);
    if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
    // Certains packs contiennent des commentaires « // » ou des virgules finales.
    try {
      return JSON.parse(s);
    } catch {
      return JSON.parse(s.replace(/^\s*\/\/.*$/gm, '').replace(/,\s*([}\]])/g, '$1'));
    }
  } catch {
    return undefined;
  }
}

function baseName(p: string): string {
  const s = p.slice(p.lastIndexOf('/') + 1);
  return s.replace(/\.(png|tga)$/i, '');
}

const yieldUI = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

// ------------------------------------------------------------------ détection

interface Layout {
  format: PackFormat;
  root: string;
  blockDir: string;
  itemDir: string;
  colormapDir: string;
  /** Index nom de base → chemin (blocs, objets, environnement). */
  blocks: Map<string, string>;
  items: Map<string, string>;
  env: Map<string, string>;
  entityDir: string;
  packFormat: number;
}

/** Détecte le format et la racine du pack ; null si l'archive n'est pas un pack reconnu. */
export function detectLayout(src: PackSource): Layout | null {
  const names = src.names;
  let javaRoot: string | null = null;
  const dirs = new Map<string, Set<string>>();
  for (const n of names) {
    const m = /^(.*?)assets\/minecraft\/textures\/(block|blocks|item|items|colormap|entity)\//.exec(n);
    if (!m) continue;
    const root = m[1];
    if (!dirs.has(root)) dirs.set(root, new Set());
    dirs.get(root)!.add(m[2]);
    if (javaRoot === null || root.length < javaRoot.length) javaRoot = root;
  }
  if (javaRoot !== null) {
    // Ancien format (avant 1.13) : dossiers au pluriel uniquement.
    const d = dirs.get(javaRoot)!;
    const legacy = (d.has('blocks') || d.has('items')) && !d.has('block') && !d.has('item');
    const base = javaRoot + 'assets/minecraft/textures/';
    const blockDir = base + (legacy ? 'blocks/' : 'block/');
    const itemDir = base + (legacy ? 'items/' : 'item/');
    const mc = parseJson(src.read(javaRoot + 'pack.mcmeta'));
    const packFormat = Number(mc?.pack?.pack_format) || 0;
    return {
      format: legacy ? 'java_legacy' : 'java',
      root: javaRoot,
      blockDir,
      itemDir,
      colormapDir: base + 'colormap/',
      blocks: indexDir(names, blockDir, false),
      items: indexDir(names, itemDir, false),
      env: new Map(),
      entityDir: base + 'entity/',
      packFormat,
    };
  }
  // Bedrock : manifeste ou dossier textures/blocks à la racine (ou dans un sous-dossier).
  let bedRoot: string | null = null;
  for (const n of names) {
    const m = /^(.*?)textures\/(blocks|items|colormap)\//.exec(n);
    if (m && (bedRoot === null || m[1].length < bedRoot.length)) bedRoot = m[1];
  }
  if (bedRoot === null) return null;
  const base = bedRoot + 'textures/';
  return {
    format: 'bedrock',
    root: bedRoot,
    blockDir: base + 'blocks/',
    itemDir: base + 'items/',
    colormapDir: base + 'colormap/',
    blocks: indexDir(names, base + 'blocks/', true),
    items: indexDir(names, base + 'items/', true),
    env: indexDir(names, base + 'environment/', false),
    entityDir: base + 'entity/',
    packFormat: 0,
  };
}

/** Index des images d'un dossier (sous-dossiers inclus pour Bedrock, PNG préféré au TGA). */
function indexDir(names: string[], dir: string, deep: boolean): Map<string, string> {
  const out = new Map<string, string>();
  const depth = new Map<string, number>();
  for (const n of names) {
    if (!n.startsWith(dir)) continue;
    const rest = n.slice(dir.length);
    if (!/\.(png|tga)$/i.test(rest)) continue;
    const d = rest.split('/').length - 1;
    if (d > 0 && !deep) continue;
    const key = baseName(rest);
    const prev = depth.get(key);
    const isPng = /\.png$/i.test(rest);
    if (prev === undefined || d < prev || (d === prev && isPng)) {
      out.set(key, n);
      depth.set(key, d);
    }
  }
  return out;
}

// ------------------------------------------------------------------ lecture

export async function readPack(src: PackSource, opts: ReadOptions): Promise<ConvertedPack> {
  const layout = detectLayout(src);
  if (!layout) throw new Error('Ce fichier ne contient pas de pack de ressources reconnu (dossier « assets/minecraft/textures » ou « textures/blocks » introuvable).');
  const out: ConvertedPack = {
    format: layout.format,
    root: layout.root,
    title: '',
    description: '',
    textures: {},
    anims: {},
    items: {},
    colormaps: {},
    untinted: [],
    sources: {},
    resized: 0,
    broken: [],
  };
  readMeta(src, layout, out);
  const progress = opts.onProgress ?? (() => undefined);
  const flipbooks = layout.format === 'bedrock' ? readFlipbooks(src, layout) : new Map<string, AnimInfo>();
  const aliases = layout.format === 'java' ? JAVA_BLOCKS : layout.format === 'bedrock' ? { ...LEGACY_BLOCKS, ...BEDROCK_BLOCKS } : LEGACY_BLOCKS;
  const total = opts.blockTextures.length + opts.itemKeys.length + 4;
  let done = 0;
  const tick = async () => {
    done++;
    if (done % 24 === 0) {
      progress(done / total);
      await yieldUI();
    }
  };

  // Images décodées une seule fois (plusieurs textures Voxelia peuvent partager un fichier).
  const cache = new Map<string, RGBAImage | null>();
  const image = (path: string): RGBAImage | null => {
    if (cache.has(path)) return cache.get(path)!;
    let img: RGBAImage | null = null;
    const bytes = src.read(path);
    if (bytes) {
      try {
        img = decodeImage(bytes, path);
      } catch {
        out.broken.push(path);
      }
    }
    cache.set(path, img);
    return img;
  };
  const blockPath = (name: string): string | undefined => layout.blocks.get(name);

  // ---------------------------------------------------------------- blocs
  for (const name of opts.blockTextures) {
    await tick();
    const recipe = BLOCK_RECIPES[name];
    if (recipe) {
      const px = runRecipe(recipe, layout, image, blockPath);
      if (px) {
        out.textures[name] = px.data;
        out.sources[name] = px.source;
      }
      continue;
    }
    const cands = aliases[name] ?? [name];
    for (const c of cands) {
      const path = blockPath(c);
      if (!path) continue;
      const img = image(path);
      if (!img) continue;
      const anim = layout.format === 'bedrock' ? flipbooks.get(c) : readMcmeta(src, path);
      const res = toFrames(img, anim, FLOW_TEXTURES.has(name), opts.frameSlots(name));
      out.textures[name] = res.data;
      if (res.anim) out.anims[name] = res.anim;
      if (res.resized) out.resized++;
      out.sources[name] = path;
      break;
    }
  }
  // Pack Bedrock : côté d'herbe « porté » (déjà coloré) sans superposition séparée.
  if (layout.format === 'bedrock' && out.sources.grass_side?.includes('grass_side_carried') && !out.textures.grass_side_overlay) {
    out.textures.grass_side_overlay = new Uint8Array(TEX_BYTES);
    out.sources.grass_side_overlay = out.sources.grass_side;
  }

  // ---------------------------------------------------------------- objets
  const itemAliases = layout.format === 'java' ? JAVA_ITEMS : LEGACY_ITEMS;
  const itemImage = (n: string): { px: Uint8Array; path: string } | null => {
    const path = layout.items.get(n);
    if (!path) return null;
    const img = image(path);
    if (!img) return null;
    const anim = layout.format === 'bedrock' ? undefined : readMcmeta(src, path);
    const res = toFrames(img, anim, false, 1);
    if (res.resized) out.resized++;
    return { px: res.data.subarray(0, TEX_BYTES), path };
  };
  for (const key of opts.itemKeys) {
    await tick();
    const cands = itemAliases[key] ?? [key];
    for (const c of cands) {
      const it = itemImage(c);
      if (!it) continue;
      let px = it.px;
      if (LEATHER_PIECES.includes(key) && meanSaturation(px) < 0.15) {
        px = multiply(px, LEATHER_COLOR);
        const ov = itemImage(c + '_overlay');
        if (ov) px = compose(px, ov.px);
      }
      out.items[key] = px.slice();
      out.sources['item:' + key] = it.path;
      break;
    }
  }
  // Œufs d'apparition : base + motif (teintés à l'affichage), ou texture dédiée par créature.
  const egg = itemImage('spawn_egg');
  const eggOv = itemImage('spawn_egg_overlay');
  if (egg && opts.itemKeys.includes('spawn_egg')) {
    out.items.spawn_egg = egg.px.slice();
    out.sources['item:spawn_egg'] = egg.path;
    if (eggOv) out.items.spawn_egg_overlay = eggOv.px.slice();
  }
  for (const [mob, java] of Object.entries(SPAWN_EGG_NAMES)) {
    const k = 'spawn_' + mob;
    if (!opts.itemKeys.includes(k)) continue;
    const it = itemImage(java + '_spawn_egg') ?? (layout.format === 'bedrock' ? itemImage('egg_' + java) : null);
    if (it) {
      out.items[k] = it.px.slice();
      out.sources['item:' + k] = it.path;
    }
  }

  // ---------------------------------------------------------------- palettes de couleurs
  for (const kind of ['grass', 'foliage'] as const) {
    await tick();
    const img = image(layout.colormapDir + kind + '.png');
    if (img) out.colormaps[kind] = resizeBox(img, 256, 256).data;
  }

  // ---------------------------------------------------------------- teinte de biome
  const models = layout.format === 'java' ? new ModelTint(src, layout.root) : null;
  for (const { key, tex } of opts.tintedBlocks) {
    const px = out.textures[tex];
    if (!px) continue;
    const srcName = baseName(out.sources[tex] ?? '');
    let tinted: boolean | null = null;
    if (models) for (const b of new Set([key, srcName])) if (tinted === null) tinted = models.blockTint(b);
    const sat = meanSaturation(px.subarray(0, TEX_BYTES));
    // Sans information de modèle, une texture nettement colorée est déjà « peinte ».
    if (tinted === null) tinted = models ? sat < 0.45 : sat < 0.22;
    if (!tinted) out.untinted.push(key);
  }
  progress(1);
  return out;
}

// ------------------------------------------------------------------ métadonnées

function readMeta(src: PackSource, layout: Layout, out: ConvertedPack): void {
  const r = layout.root;
  if (layout.format === 'bedrock') {
    const man = parseJson(src.read(r + 'manifest.json'));
    const header = man?.header ?? {};
    const lang = readLang(src, r);
    const resolve = (s: unknown): string => {
      const t = flatText(s);
      return stripCodes(lang.get(t) ?? t);
    };
    out.title = resolve(header.name ?? '');
    out.description = resolve(header.description ?? '');
    out.icon = src.read(r + 'pack_icon.png');
  } else {
    const mc = parseJson(src.read(r + 'pack.mcmeta'));
    out.description = stripCodes(flatText(mc?.pack?.description ?? ''));
    out.icon = src.read(r + 'pack.png');
  }
}

function readLang(src: PackSource, root: string): Map<string, string> {
  const m = new Map<string, string>();
  for (const f of ['texts/fr_FR.lang', 'texts/en_US.lang']) {
    const b = src.read(root + f);
    if (!b) continue;
    for (const line of new TextDecoder().decode(b).split(/\r?\n/)) {
      const i = line.indexOf('=');
      if (i <= 0) continue;
      const k = line.slice(0, i).trim();
      if (!m.has(k)) m.set(k, line.slice(i + 1).replace(/\t*##.*$/, '').trim());
    }
  }
  return m;
}

/** Animation Java (fichier .png.mcmeta). */
function readMcmeta(src: PackSource, path: string): (AnimInfo & { fw?: number; fh?: number }) | undefined {
  const j = parseJson(src.read(path + '.mcmeta'));
  const a = j?.animation;
  if (!a || typeof a !== 'object') return undefined;
  const ft = Math.max(1, Number(a.frametime) || 1);
  const seq: Array<[number, number]> = [];
  if (Array.isArray(a.frames))
    for (const f of a.frames) {
      if (typeof f === 'number') seq.push([f, ft]);
      else if (f && typeof f.index === 'number') seq.push([f.index, Math.max(1, Number(f.time) || ft)]);
    }
  return { seq: seq.length ? seq : [[-1, ft]], interpolate: !!a.interpolate, fw: Number(a.width) || undefined, fh: Number(a.height) || undefined };
}

/** Animations Bedrock (textures/flipbook_textures.json), indexées par nom de texture. */
function readFlipbooks(src: PackSource, layout: Layout): Map<string, AnimInfo> {
  const m = new Map<string, AnimInfo>();
  const j = parseJson(src.read(layout.root + 'textures/flipbook_textures.json'));
  if (!Array.isArray(j)) return m;
  for (const f of j) {
    const tex = typeof f?.flipbook_texture === 'string' ? baseName(f.flipbook_texture) : null;
    if (!tex) continue;
    const t = Math.max(1, Number(f.ticks_per_frame) || 1);
    const seq: Array<[number, number]> = Array.isArray(f.frames) ? f.frames.filter((x: unknown) => typeof x === 'number').map((x: number) => [x, t]) : [[-1, t]];
    m.set(tex, { seq: seq.length ? seq : [[-1, t]], interpolate: !!f.blend_frames });
  }
  return m;
}

// ------------------------------------------------------------------ images → images 16x16

/** Ramène une image en 16x16 (découpe « coulante » éventuelle, puis filtre boîte). */
function to16(img: RGBAImage, flow: boolean): { img: RGBAImage; resized: boolean } {
  let im = img;
  if (flow && im.width >= 2 * TEX && im.width === im.height) im = crop(im, 0, 0, im.width / 2, im.height / 2);
  if (im.width === TEX && im.height === TEX) return { img: im, resized: false };
  return { img: resizeBox(im, TEX, TEX), resized: true };
}

/**
 * Découpe une bande d'animation (images empilées) en images 16x16. Pour une texture fixe
 * de l'atlas (slots = 1), on ne garde que la première image affichée par l'animation.
 */
function toFrames(img: RGBAImage, anim: (AnimInfo & { fw?: number; fh?: number }) | undefined, flow: boolean, slots: number): { data: Uint8Array; anim?: AnimInfo; resized: boolean } {
  const fw = anim?.fw ?? img.width;
  const fh = anim?.fh ?? (img.height > img.width && img.height % img.width === 0 ? img.width : img.height);
  const cols = Math.max(1, Math.floor(img.width / fw));
  const rows = Math.max(1, Math.floor(img.height / fh));
  const count = Math.min(MAX_FRAMES, cols * rows);
  let seq: Array<[number, number]> = [];
  if (anim) {
    for (const [i, t] of anim.seq) {
      if (i === -1) for (let k = 0; k < count; k++) seq.push([k, t]);
      else if (i >= 0 && i < count) seq.push([i, t]);
    }
  }
  if (!seq.length) seq = [[0, 1]];
  const frameImg = (k: number): RGBAImage => (count === 1 && fw === img.width && fh === img.height ? img : crop(img, (k % cols) * fw, Math.floor(k / cols) * fh, fw, fh));
  let resized = false;
  const get = (k: number): Uint8Array => {
    const r = to16(frameImg(k), flow);
    if (r.resized) resized = true;
    return r.img.data;
  };
  if (slots <= 1 || count === 1) return { data: get(seq[0][0]).slice(), resized };
  // Images réellement utilisées, renumérotées.
  const used = [...new Set(seq.map((s) => s[0]))].sort((a, b) => a - b);
  const remap = new Map(used.map((k, i) => [k, i]));
  const data = new Uint8Array(used.length * TEX_BYTES);
  used.forEach((k, i) => data.set(get(k), i * TEX_BYTES));
  return { data, anim: { seq: seq.map(([k, t]) => [remap.get(k)!, t]), interpolate: anim?.interpolate }, resized };
}

/**
 * Échantillonne une animation sur `slots` images d'atlas jouées à vitesse constante :
 * la durée totale de l'animation du pack est répartie uniformément sur la boucle.
 */
export function sampleAnimation(data: Uint8Array, anim: AnimInfo | undefined, slots: number): Uint8Array[] {
  const n = Math.max(1, Math.floor(data.length / TEX_BYTES));
  const frame = (k: number) => data.subarray(Math.min(k, n - 1) * TEX_BYTES, (Math.min(k, n - 1) + 1) * TEX_BYTES);
  if (!anim || n === 1) return Array.from({ length: slots }, () => frame(0));
  const seq = anim.seq.length ? anim.seq : [[0, 1] as [number, number]];
  const total = seq.reduce((s, [, t]) => s + t, 0);
  const out: Uint8Array[] = [];
  for (let f = 0; f < slots; f++) {
    let tick = (f * total) / slots;
    let i = 0;
    while (i < seq.length - 1 && tick >= seq[i][1]) {
      tick -= seq[i][1];
      i++;
    }
    const [k, t] = seq[i];
    if (anim.interpolate) {
      const next = seq[(i + 1) % seq.length][0];
      out.push(lerpPixels(frame(k), frame(next), Math.min(1, tick / t)));
    } else out.push(frame(k));
  }
  return out;
}

// ------------------------------------------------------------------ recettes

function runRecipe(r: Recipe, layout: Layout, image: (p: string) => RGBAImage | null, blockPath: (n: string) => string | undefined): { data: Uint8Array; source: string } | null {
  const first = (names: string[]): { img: RGBAImage; path: string } | null => {
    for (const n of names) {
      const p = blockPath(n) ?? layout.env.get(n);
      if (!p) continue;
      const img = image(p);
      if (img) return { img, path: p };
    }
    return null;
  };
  switch (r.kind) {
    case 'crack': {
      const f = first(r.from);
      if (!f) return null;
      return { data: crackToAlpha(to16(firstSquare(f.img), false).img.data), source: f.path };
    }
    case 'union': {
      let acc: Uint8Array | null = null;
      let src = '';
      for (const group of r.from) {
        const f = first(group.names);
        if (!f) continue;
        let px = to16(firstSquare(f.img), false).img.data;
        if (group.rotate) px = rotate90(px);
        acc = acc ? compose(acc, px) : px.slice();
        src = src ? src + ' + ' + f.path : f.path;
      }
      return acc ? { data: acc, source: src } : null;
    }
    case 'chest':
    case 'bed': {
      // Mise en page des textures d'entité du jeu de référence 1.15+ uniquement.
      if (layout.format !== 'java' || (layout.packFormat > 0 && layout.packFormat < 5)) return null;
      const path = layout.entityDir + (r.kind === 'chest' ? 'chest/normal.png' : 'bed/red.png');
      const img = image(path);
      if (!img) return null;
      const px = r.kind === 'chest' ? chestPart(img, r.part) : bedPart(img, r.part);
      return px ? { data: px, source: path } : null;
    }
  }
}

/** Quart de tour (sens horaire) d'une texture 16x16. */
function rotate90(px: Uint8Array): Uint8Array {
  const out = new Uint8Array(px.length);
  for (let y = 0; y < TEX; y++) for (let x = 0; x < TEX; x++) out.set(px.subarray((y * TEX + x) * 4, (y * TEX + x) * 4 + 4), (x * TEX + (TEX - 1 - y)) * 4);
  return out;
}

function firstSquare(img: RGBAImage): RGBAImage {
  return img.height > img.width ? crop(img, 0, 0, img.width, img.width) : img;
}

/**
 * Fissures : le jeu de référence les multiplie par la couleur du bloc (gris < 128 assombrit,
 * > 128 éclaircit). Voxelia les dessine en fusion alpha : on convertit en noir/blanc + alpha.
 */
export function crackToAlpha(px: Uint8Array): Uint8Array {
  const out = new Uint8Array(px.length);
  for (let i = 0; i < px.length; i += 4) {
    if (px[i + 3] < 26) continue;
    const g = (px[i] + px[i + 1] + px[i + 2]) / 3;
    const f = (2 * g) / 255;
    if (f < 1) out[i + 3] = Math.round((1 - f) * 255);
    else {
      out[i] = out[i + 1] = out[i + 2] = 255;
      out[i + 3] = Math.round(Math.min(1, (f - 1) * 0.5) * 255);
    }
  }
  return out;
}

// ------------------------------------------------------------------ modèles (teinte)

/** Modèles parents du jeu de référence dont on connaît la teinte. */
const VANILLA_MODEL_TINT: Record<string, boolean> = {
  'block/leaves': true,
  'block/tinted_cross': true,
  'block/grass_block': true,
  'block/vine': true,
  'block/lily_pad': true,
  'block/redstone_dust_dot': true,
  'block/cross': false,
  'block/cube_all': false,
  'block/cube': false,
  'block/cube_column': false,
  'block/block': false,
};

/** Analyse les modèles d'un pack Java : la face porte-t-elle un « tintindex » ? */
class ModelTint {
  constructor(
    private src: PackSource,
    private root: string,
  ) {}

  private json(path: string): any {
    return parseJson(this.src.read(this.root + 'assets/minecraft/' + path));
  }

  /** true = teinté, false = non teinté ; le modèle d'origine (teinté) s'applique sinon. */
  blockTint(block: string): boolean | null {
    if (!block) return null;
    const bs = this.json(`blockstates/${block}.json`);
    const models: string[] = [];
    const push = (v: unknown) => {
      for (const o of Array.isArray(v) ? v : [v]) if (o && typeof (o as { model?: unknown }).model === 'string') models.push((o as { model: string }).model);
    };
    if (bs?.variants && typeof bs.variants === 'object') for (const v of Object.values(bs.variants)) push(v);
    else if (Array.isArray(bs?.multipart)) for (const p of bs.multipart) push(p?.apply);
    if (!models.length) {
      if (!this.json(`models/block/${block}.json`)) return null;
      models.push('block/' + block);
    }
    for (const m of models.slice(0, 6)) {
      const r = this.model(m, 0);
      if (r !== null) return r;
    }
    return null;
  }

  private model(name: string, depth: number): boolean | null {
    if (depth > 10) return null;
    let p = name.replace(/^minecraft:/, '');
    if (!p.includes('/')) p = 'block/' + p;
    const j = this.json(`models/${p}.json`);
    if (!j) return VANILLA_MODEL_TINT[p] ?? null;
    if (Array.isArray(j.elements)) {
      for (const e of j.elements) for (const f of Object.values((e?.faces ?? {}) as Record<string, { tintindex?: number }>)) if (typeof f?.tintindex === 'number' && f.tintindex >= 0) return true;
      return false;
    }
    if (typeof j.parent === 'string') return this.model(j.parent, depth + 1);
    return null;
  }
}

/** Petite image vide 16x16 (utilitaire pour les recettes). */
export function emptyTexture(): Uint8Array {
  return blankImage(TEX, TEX).data;
}
