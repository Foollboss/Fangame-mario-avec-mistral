/**
 * Mods « données » : packs JSON (blocs, objets, textures, recettes, créatures,
 * butins, progrès, biomes). Chargés depuis public/mods/index.json et depuis
 * les imports de l'utilisateur (conservés dans le navigateur).
 */
import type { ContentPack } from '../registry/types';

export interface ModInfo {
  id: string;
  name: string;
  summary: string;
  builtin: boolean;
}

const KEY = 'voxerra.mods.v1';

export function validatePack(p: unknown): string | null {
  if (!p || typeof p !== 'object') return 'Le fichier doit contenir un objet JSON.';
  const o = p as Record<string, unknown>;
  if (typeof o.id !== 'string' || !/^[a-z0-9_-]{2,40}$/.test(o.id)) return 'Identifiant « id » manquant ou invalide (a-z, 0-9, _ et -).';
  for (const k of ['blocks', 'items', 'recipes', 'smelting', 'creatures', 'advancements', 'biomes', 'structures', 'effects'])
    if (o[k] !== undefined && !Array.isArray(o[k])) return `« ${k} » doit être une liste.`;
  for (const k of ['textures', 'loot', 'lang']) if (o[k] !== undefined && (typeof o[k] !== 'object' || Array.isArray(o[k]))) return `« ${k} » doit être un objet.`;
  for (const b of (o.blocks as { id?: unknown; name?: unknown }[]) ?? []) if (typeof b.id !== 'string' || typeof b.name !== 'string') return 'Chaque bloc doit avoir un id et un nom.';
  for (const i of (o.items as { id?: unknown; name?: unknown }[]) ?? []) if (typeof i.id !== 'string' || typeof i.name !== 'string') return 'Chaque objet doit avoir un id et un nom.';
  return null;
}

export function summarize(p: ContentPack): string {
  const parts: string[] = [];
  const n = (k: keyof ContentPack, label: string) => {
    const v = p[k];
    const c = Array.isArray(v) ? v.length : v && typeof v === 'object' ? Object.keys(v).length : 0;
    if (c) parts.push(`${c} ${label}`);
  };
  n('blocks', 'blocs');
  n('items', 'objets');
  n('recipes', 'recettes');
  n('creatures', 'créatures');
  n('textures', 'textures');
  n('biomes', 'biomes');
  n('advancements', 'progrès');
  return parts.join(', ') || 'pack vide';
}

function readImported(): ContentPack[] {
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as ContentPack[]) : [];
    return list.filter((p) => validatePack(p) === null);
  } catch {
    return [];
  }
}

function writeImported(list: ContentPack[]): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* quota ou stockage indisponible */
  }
}

export async function loadMods(): Promise<{ packs: ContentPack[]; infos: ModInfo[] }> {
  const packs: ContentPack[] = [];
  const infos: ModInfo[] = [];
  try {
    const res = await fetch('mods/index.json', { cache: 'no-cache' });
    if (res.ok) {
      const index = (await res.json()) as { packs?: string[] };
      for (const file of index.packs ?? []) {
        try {
          const r = await fetch('mods/' + file, { cache: 'no-cache' });
          const p = (await r.json()) as ContentPack;
          const err = validatePack(p);
          if (err) {
            console.warn(`Mod ${file} ignoré : ${err}`);
            continue;
          }
          packs.push(p);
          infos.push({ id: p.id, name: p.name ?? p.id, summary: summarize(p), builtin: true });
        } catch (e) {
          console.warn('Mod illisible', file, e);
        }
      }
    }
  } catch {
    /* pas de dossier de mods */
  }
  for (const p of readImported()) {
    if (packs.some((q) => q.id === p.id)) continue;
    packs.push(p);
    infos.push({ id: p.id, name: p.name ?? p.id, summary: summarize(p), builtin: false });
  }
  return { packs, infos };
}

export function importModText(text: string): { pack: ContentPack; info: ModInfo } | string {
  let p: unknown;
  try {
    p = JSON.parse(text);
  } catch {
    return 'JSON invalide.';
  }
  const err = validatePack(p);
  if (err) return err;
  const pack = p as ContentPack;
  const list = readImported().filter((q) => q.id !== pack.id);
  list.push(pack);
  writeImported(list);
  return { pack, info: { id: pack.id, name: pack.name ?? pack.id, summary: summarize(pack), builtin: false } };
}

export function removeImportedMod(id: string): void {
  writeImported(readImported().filter((p) => p.id !== id));
}
