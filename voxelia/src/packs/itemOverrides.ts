/**
 * Icônes d'objets fournies par les packs de ressources, partagées entre les icônes
 * d'inventaire (ItemIcons) et les objets 3D tenus en main ou posés au sol (ItemMesh).
 * Clés : clé d'objet Voxelia (prioritaire) ou clé d'icône (`ItemDef.icon ?? key`).
 */
import type { ItemDef } from '../items/items';
import { EGG_COLORS } from '../render/textures/itemTextures';

const PX = 16 * 16 * 4;
const overrides = new Map<string, Uint8Array>();
const listeners = new Set<() => void>();
let version = 0;

function changed(): void {
  version++;
  for (const l of listeners) l();
}

/** Remplace toutes les icônes du pack (RGBA 16x16 par clé) ; vide = icônes d'origine. */
export function setItemTextures(map: Record<string, Uint8Array>): void {
  overrides.clear();
  for (const [k, v] of Object.entries(map)) if (v && v.length >= PX) overrides.set(k, v.subarray(0, PX));
  changed();
}

/** Remplace une seule icône (pixels RGBA 16x16). */
export function setItemTexture(key: string, rgba: Uint8Array | Uint8ClampedArray): void {
  if (rgba.length < PX) return;
  overrides.set(key, new Uint8Array(rgba.buffer, rgba.byteOffset, PX).slice());
  changed();
}

export function clearItemTextures(): void {
  if (!overrides.size) return;
  overrides.clear();
  changed();
}

export function hasItemTextures(): boolean {
  return overrides.size > 0;
}

export function itemTexturesVersion(): number {
  return version;
}

/** Abonnement aux changements (renvoie la fonction de désabonnement). */
export function onItemTexturesChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function tinted(px: Uint8Array, color: number): Uint8ClampedArray {
  const out = new Uint8ClampedArray(px);
  const r = ((color >> 16) & 255) / 255;
  const g = ((color >> 8) & 255) / 255;
  const b = (color & 255) / 255;
  for (let i = 0; i < out.length; i += 4) {
    out[i] *= r;
    out[i + 1] *= g;
    out[i + 2] *= b;
  }
  return out;
}

/**
 * Pixels 16x16 de l'icône d'un objet fournie par un pack, ou null (icône d'origine).
 * Les œufs génériques sont teintés avec les deux couleurs de la créature.
 */
export function itemOverridePixels(def: ItemDef): Uint8ClampedArray | null {
  if (!overrides.size) return null;
  const own = overrides.get(def.key);
  if (own) return new Uint8ClampedArray(own);
  const icon = def.icon ?? def.key;
  const base = overrides.get(icon);
  if (!base) return null;
  if (icon === 'spawn_egg' && def.data && EGG_COLORS[def.data]) {
    const [a, b] = EGG_COLORS[def.data];
    const out = tinted(base, a);
    const ov = overrides.get('spawn_egg_overlay');
    if (ov) {
      const top = tinted(ov, b);
      for (let i = 0; i < out.length; i += 4) {
        const al = top[i + 3] / 255;
        if (al <= 0) continue;
        for (let c = 0; c < 3; c++) out[i + c] = top[i + c] * al + out[i + c] * (1 - al);
        out[i + 3] = Math.max(out[i + 3], top[i + 3]);
      }
    }
    return out;
  }
  return new Uint8ClampedArray(base);
}
