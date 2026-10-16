/**
 * Packs de ressources : import de fichiers .zip / .mcpack (format Java ou Bedrock),
 * conversion des textures vers les noms Voxelia, activation globale ou par monde.
 *
 * Import : l'archive est lue sur l'appareil (rien n'est envoyé ni intégré au jeu),
 * les images sont décodées une seule fois et stockées en RGBA 16x16 dans IndexedDB
 * (textures de blocs avec leurs animations, icônes d'objets, palettes de couleurs).
 * Application : atlas remis à l'origine, packs globaux du moins au plus prioritaire,
 * puis packs du monde (prioritaires) ; couleurs de biome et teintes de blocs envoyées
 * aux workers ; enfin notification (le jeu remaille les tronçons).
 */
import { unzipSync, type UnzipFileInfo } from 'fflate';
import type { SaveManager } from '../save/SaveManager';
import type { TextureAtlas } from '../render/TextureAtlas';
import { BLOCKS, Tint } from '../world/blocks';
import { ITEMS } from '../items/items';
import { biomeColorsFromColormaps, setBiomeColorTables } from '../world/biomes';
import { broadcastShared } from '../world/WorkerPool';
import { decodePng, isPng, resizeBox } from './images';
import { detectLayout, readPack, sampleAnimation, type AnimInfo, type ConvertedPack, type PackSource } from './packReader';
import { setItemTextures } from './itemOverrides';

export interface PackInfo {
  id: string;
  name: string;
  description: string;
  /** Icône (URL de données PNG) ou undefined. */
  icon?: string;
  /** Nombre de textures reconnues. */
  count: number;
}

/** Enregistrement stocké dans IndexedDB (champs étendus facultatifs). */
interface PackRecord {
  name: string;
  description: string;
  icon?: string;
  /** Textures de blocs : n images RGBA 16x16 concaténées par nom Voxelia. */
  textures: Record<string, Uint8Array>;
  /** Icônes d'objets : RGBA 16x16 par clé d'objet ou d'icône. */
  items?: Record<string, Uint8Array>;
  v?: number;
  format?: string;
  anims?: Record<string, AnimInfo>;
  colormaps?: { grass?: Uint8Array; foliage?: Uint8Array };
  /** Blocs dont la texture est déjà colorée (teinte de biome désactivée). */
  untinted?: string[];
  count?: number;
  resized?: number;
  importedAt?: number;
}

const ACTIVE_KEY = 'voxelia.packs.active';
const RECORD_VERSION = 1;
/** Limites de sécurité (archives piégées). */
const MAX_ENTRY = 64 * 1024 * 1024;
const MAX_TOTAL = 768 * 1024 * 1024;

/** Teintes d'origine des blocs teintés (pour annuler un pack). */
const ORIGINAL_TINTS = new Map<number, [Tint, number]>();
for (const b of BLOCKS) if (b && b.tint !== Tint.None) ORIGINAL_TINTS.set(b.id, [b.tint, b.tintColor]);

const nextFrame = (): Promise<void> => new Promise((r) => setTimeout(r, 0));

export class ResourcePackManager {
  /** Packs actifs globalement, du plus prioritaire au moins prioritaire. */
  active: string[] = [];

  private cache = new Map<string, PackRecord>();
  private chain: Promise<void> = Promise.resolve();
  /** Packs du monde de la dernière application. */
  private lastWorld: string[] = [];
  /** Signature de l'état appliqué ('' = textures d'origine). */
  private appliedKey: string | null = '';
  private appliedIds: string[] = [];

  constructor(
    protected saves: SaveManager,
    protected atlas: TextureAtlas,
    protected onApplied: () => void,
  ) {
    try {
      const raw = localStorage.getItem(ACTIVE_KEY);
      const ids = raw ? (JSON.parse(raw) as unknown) : [];
      if (Array.isArray(ids)) this.active = ids.filter((x): x is string => typeof x === 'string');
    } catch {
      this.active = [];
    }
  }

  async list(): Promise<PackInfo[]> {
    const rows = await this.saves.listPacks();
    const out: PackInfo[] = [];
    for (const r of rows) {
      const rec = await this.load(r.id);
      out.push({ id: r.id, name: r.name, description: r.description, icon: r.icon, count: rec?.count ?? r.count });
    }
    return out.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
  }

  /** Importe un pack (.zip/.mcpack) ; onProgress reçoit 0..1. */
  async importPack(file: Blob, name?: string, onProgress?: (p: number) => void): Promise<PackInfo> {
    const report = (p: number) => onProgress?.(Math.max(0, Math.min(1, p)));
    report(0);
    let buf: Uint8Array;
    try {
      buf = new Uint8Array(await file.arrayBuffer());
    } catch {
      throw new Error('Lecture du fichier impossible.');
    }
    if (!isZip(buf)) throw new Error('Ce fichier n’est pas une archive .zip ou .mcpack valide.');
    report(0.04);
    await nextFrame();
    const src = await this.openPack(buf, report, 0);
    report(0.4);
    const converted = await readPack(src, {
      blockTextures: this.atlas.names,
      frameSlots: (n) => this.atlas.info[n]?.frames ?? 1,
      itemKeys: itemIconKeys(),
      tintedBlocks: [...ORIGINAL_TINTS.keys()].map((id) => ({ key: BLOCKS[id].key, tex: BLOCKS[id].tex.top })),
      onProgress: (p) => report(0.4 + p * 0.52),
    });
    const count = Object.keys(converted.textures).length + Object.keys(converted.items).length + (converted.colormaps.grass ? 1 : 0) + (converted.colormaps.foliage ? 1 : 0);
    if (!count) throw new Error('Aucune texture reconnue dans ce pack : il ne contient ni textures de blocs, ni icônes d’objets, ni palettes de couleurs utilisables.');
    const fileName = typeof (file as File).name === 'string' ? (file as File).name.replace(/\.(zip|mcpack|mcaddon)$/i, '') : '';
    const rec: PackRecord = {
      name: (converted.title || name?.trim() || fileName || 'Pack sans nom').slice(0, 80),
      description: converted.description.slice(0, 300),
      icon: makeIcon(converted.icon),
      textures: converted.textures,
      items: converted.items,
      v: RECORD_VERSION,
      format: converted.format,
      anims: converted.anims,
      colormaps: converted.colormaps,
      untinted: converted.untinted,
      count,
      resized: converted.resized,
      importedAt: Date.now(),
    };
    const id = 'pack-' + hashBytes(buf);
    report(0.95);
    await this.saves.savePack(id, rec);
    this.cache.set(id, rec);
    // Pack déjà appliqué (réimport) : on rafraîchit l'affichage.
    if (this.appliedIds.includes(id)) {
      this.appliedKey = null;
      await this.apply(this.lastWorld);
    }
    report(1);
    return { id, name: rec.name, description: rec.description, icon: rec.icon, count };
  }

  async remove(id: string): Promise<void> {
    await this.saves.deletePack(id);
    this.cache.delete(id);
    const wasActive = this.active.includes(id);
    this.active = this.active.filter((x) => x !== id);
    if (wasActive) this.saveActive();
    if (this.appliedIds.includes(id)) {
      this.appliedKey = null;
      await this.apply(this.lastWorld.filter((x) => x !== id));
    }
  }

  /** Change l'ordre / la sélection des packs actifs globaux et les applique. */
  async setActive(ids: string[]): Promise<void> {
    this.active = [...new Set(ids)];
    this.saveActive();
    await this.apply(this.lastWorld);
  }

  /** Applique les packs globaux puis ceux du monde (worldPacks prioritaires). */
  apply(worldPacks: string[] = []): Promise<void> {
    const run = this.chain.then(() => this.doApply(worldPacks));
    this.chain = run.catch(() => undefined);
    return run;
  }

  // ---------------------------------------------------------------- application

  private async doApply(worldPacks: string[]): Promise<void> {
    this.lastWorld = [...worldPacks];
    const world = [...new Set(worldPacks)];
    const global = this.active.filter((id) => !world.includes(id));
    // Du moins prioritaire au plus prioritaire : le dernier appliqué l'emporte.
    const order = [...global].reverse().concat([...world].reverse());
    const recs: Array<[string, PackRecord]> = [];
    for (const id of order) {
      const r = await this.load(id).catch(() => undefined);
      if (r) recs.push([id, r]);
    }
    const key = recs.map(([id]) => id).join('|');
    if (key === this.appliedKey) return;

    const atlas = this.atlas;
    atlas.resetToOriginal(false);
    // Textures de blocs : le pack le plus prioritaire qui fournit chaque texture.
    const owner = new Map<string, PackRecord>();
    for (const [, r] of recs) for (const n of Object.keys(r.textures)) owner.set(n, r);
    for (const [n, r] of owner) {
      const info = atlas.info[n];
      if (!info) continue;
      atlas.setFrames(n, sampleAnimation(r.textures[n], r.anims?.[n], info.frames));
    }
    // Icônes d'objets.
    const items: Record<string, Uint8Array> = {};
    for (const [, r] of recs) {
      if (!r.items) continue;
      if (r.items.spawn_egg) delete items.spawn_egg_overlay;
      Object.assign(items, r.items);
    }
    // Palettes de couleurs : celles du pack le plus prioritaire qui en fournit.
    let grass: Uint8Array | undefined;
    let foliage: Uint8Array | undefined;
    for (const [, r] of recs) {
      if (r.colormaps?.grass) grass = r.colormaps.grass;
      if (r.colormaps?.foliage) foliage = r.colormaps.foliage;
    }
    const map = (d?: Uint8Array) => (d && d.length === 256 * 256 * 4 ? { width: 256, height: 256, data: d } : null);
    const colors = biomeColorsFromColormaps(map(grass), map(foliage));
    setBiomeColorTables(colors.grass, colors.foliage);
    broadcastShared({ type: 'biomeColors', grass: colors.grass, foliage: colors.foliage });
    // Teinte de biome : désactivée (blanc fixe) pour les textures déjà colorées du pack.
    const tints: Array<[number, number, number]> = [];
    for (const [id, [t, c]] of ORIGINAL_TINTS) {
      const b = BLOCKS[id];
      const r = owner.get(b.tex.top);
      const off = !!r?.untinted?.includes(b.key);
      b.tint = off ? Tint.Fixed : t;
      b.tintColor = off ? 0xffffff : c;
      tints.push([id, b.tint, b.tintColor]);
    }
    broadcastShared({ type: 'blockTints', tints });
    setItemTextures(items);
    atlas.commit();
    this.appliedKey = key;
    this.appliedIds = recs.map(([id]) => id);
    this.onApplied();
  }

  private async load(id: string): Promise<PackRecord | undefined> {
    const c = this.cache.get(id);
    if (c) return c;
    const r = (await this.saves.getPack(id)) as PackRecord | undefined;
    if (!r || typeof r !== 'object' || !r.textures) return undefined;
    if (r.count === undefined) r.count = Object.keys(r.textures).length + Object.keys(r.items ?? {}).length;
    this.cache.set(id, r);
    return r;
  }

  private saveActive(): void {
    try {
      localStorage.setItem(ACTIVE_KEY, JSON.stringify(this.active));
    } catch {
      /* stockage local indisponible : la sélection vaut pour la session */
    }
  }

  // ---------------------------------------------------------------- archive

  /**
   * Ouvre l'archive : liste des fichiers, détection du pack (éventuellement dans un
   * dossier ou dans une archive imbriquée .mcpack d'un .mcaddon), puis décompression
   * des seuls fichiers utiles, par lots (progression 0.04 → 0.4).
   */
  private async openPack(buf: Uint8Array, report: (p: number) => void, depth: number): Promise<PackSource> {
    const entries = listZip(buf);
    const norm = new Map<string, string>();
    for (const e of entries) norm.set(normName(e.name), e.name);
    const names = [...norm.keys()];
    // Métadonnées seules pour détecter la racine et le format.
    const meta = extract(buf, (n) => /(^|\/)(pack\.mcmeta|manifest\.json)$/i.test(n));
    const metaSrc: PackSource = { names, read: (p) => meta[norm.get(p) ?? p] };
    const layout = detectLayout(metaSrc);
    if (!layout) {
      if (depth === 0) {
        // .mcaddon / archive contenant des packs : on essaie les archives imbriquées.
        const nested = entries.filter((e) => /\.(mcpack|zip)$/i.test(e.name)).sort((a, b) => b.originalSize - a.originalSize);
        for (const e of nested.slice(0, 6)) {
          const inner = extract(buf, (n) => n === e.name)[e.name];
          if (!inner || !isZip(inner)) continue;
          try {
            return await this.openPack(inner, report, 1);
          } catch {
            /* archive suivante */
          }
        }
      }
      throw new Error('Ce fichier ne contient pas de pack de ressources reconnu (dossier « assets/minecraft/textures » ou « textures/blocks » introuvable).');
    }
    const root = layout.root;
    const wanted = entries.filter((e) => {
      const n = normName(e.name);
      return n.startsWith(root) && !n.endsWith('/') && isUseful(n.slice(root.length));
    });
    let total = 0;
    for (const e of wanted) {
      if (e.originalSize > MAX_ENTRY) throw new Error(`Fichier trop volumineux dans le pack : ${e.name}`);
      total += e.originalSize;
    }
    if (total > MAX_TOTAL) throw new Error('Pack trop volumineux pour cet appareil.');
    const files: Record<string, Uint8Array> = { ...meta };
    const BATCH = 160;
    for (let i = 0; i < wanted.length; i += BATCH) {
      const set = new Set(wanted.slice(i, i + BATCH).map((e) => e.name));
      Object.assign(files, extract(buf, (n) => set.has(n)));
      report(0.06 + (0.34 * Math.min(wanted.length, i + BATCH)) / Math.max(1, wanted.length));
      await nextFrame();
    }
    return { names, read: (p) => files[norm.get(p) ?? p] };
  }
}

// ------------------------------------------------------------------ utilitaires

/** Chemin d'archive normalisé (séparateurs « / », sans « ./ » initial). */
function normName(n: string): string {
  return n.replace(/\\/g, '/').replace(/^\.?\//, '');
}

function isZip(b: Uint8Array): boolean {
  return b.length >= 22 && b[0] === 0x50 && b[1] === 0x4b && (b[2] === 3 || b[2] === 5 || b[2] === 7);
}

function listZip(buf: Uint8Array): UnzipFileInfo[] {
  const out: UnzipFileInfo[] = [];
  try {
    unzipSync(buf, {
      filter: (f) => {
        out.push(f);
        return false;
      },
    });
  } catch {
    throw new Error('Archive illisible : le fichier .zip / .mcpack est endommagé ou n’est pas une archive ZIP.');
  }
  return out;
}

function extract(buf: Uint8Array, pick: (name: string) => boolean): Record<string, Uint8Array> {
  try {
    return unzipSync(buf, { filter: (f) => pick(f.name) && f.originalSize <= MAX_ENTRY });
  } catch (e) {
    const msg = String((e as Error)?.message ?? e);
    if (/encrypt|password/i.test(msg)) throw new Error('Archive protégée par mot de passe : import impossible.');
    throw new Error('Archive illisible : décompression impossible (' + msg + ').');
  }
}

/** Fichiers utiles d'un pack, chemin relatif à sa racine. */
function isUseful(rel: string): boolean {
  const l = rel.toLowerCase();
  if (/^(pack\.png|pack_icon\.png|pack\.mcmeta|manifest\.json)$/.test(l)) return true;
  if (/^overlay_[^/]*\//.test(l)) return false;
  if (/textures\/(block|blocks|item|items|colormap|environment)\/.*\.(png|tga|mcmeta)$/.test(l)) return true;
  if (/textures\/entity\/(chest\/normal|bed\/red)\.png$/.test(l)) return true;
  if (/^assets\/minecraft\/(models\/block|blockstates)\/.*\.json$/.test(l)) return true;
  if (/^textures\/flipbook_textures\.json$/.test(l) || /^texts\/(en_us|fr_fr)\.lang$/.test(l)) return true;
  return false;
}

/** Clés d'icônes à chercher dans les packs (icônes d'objets et œufs par créature). */
function itemIconKeys(): string[] {
  const keys = new Set<string>();
  for (const d of ITEMS) {
    if (!d) continue;
    keys.add(d.icon ?? d.key);
    if (d.use === 'spawn_egg') keys.add(d.key);
  }
  return [...keys];
}

/** Empreinte du contenu (FNV-1a 32 bits + taille) : réimporter le même fichier garde l'identifiant. */
function hashBytes(b: Uint8Array): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < b.length; i++) h = Math.imul(h ^ b[i], 0x01000193);
  return (h >>> 0).toString(36) + b.length.toString(36);
}

function toBase64(b: Uint8Array): string {
  let s = '';
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
}

/** Icône du pack en URL de données, réduite à 64 px si elle est grande. */
function makeIcon(png: ConvertedPack['icon']): string | undefined {
  if (!png || !isPng(png)) return undefined;
  try {
    if (png.length <= 24 * 1024 || typeof document === 'undefined') return png.length <= 256 * 1024 ? 'data:image/png;base64,' + toBase64(png) : undefined;
    const img = decodePng(png);
    const s = Math.min(64, img.width, img.height);
    const small = resizeBox(img, s, s);
    const c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');
    if (!g) return undefined;
    const d = g.createImageData(s, s);
    d.data.set(small.data);
    g.putImageData(d, 0, 0);
    return c.toDataURL('image/png');
  } catch {
    return undefined;
  }
}
