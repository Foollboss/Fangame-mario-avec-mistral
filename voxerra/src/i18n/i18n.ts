/**
 * Traductions : français (langue source), anglais, espagnol.
 *
 * `t(« texte français », { x })` renvoie la traduction dans la langue courante
 * (le texte français sert de clé), avec remplacement des `{x}`. Les noms du
 * contenu (blocs, objets, créatures, biomes, progrès…) sont traduits par
 * identifiant (voir content.ts : localizeContent).
 */
import en from './en.json';
import es from './es.json';

export type Lang = 'fr' | 'en' | 'es';

export const LANGS: { id: Lang; name: string }[] = [
  { id: 'fr', name: 'Français' },
  { id: 'en', name: 'English' },
  { id: 'es', name: 'Español' },
];

const DICT: Record<Lang, Record<string, string>> = { fr: {}, en: en as Record<string, string>, es: es as Record<string, string> };
let current: Lang = 'fr';

export function getLang(): Lang {
  return current;
}

export function setLang(l: Lang): void {
  current = DICT[l] ? l : 'fr';
  if (typeof document !== 'undefined') document.documentElement.lang = current;
}

/** Langue du navigateur si elle est prise en charge, sinon le français. */
export function detectLang(): Lang {
  const nav = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : [];
  for (const l of nav) {
    const k = String(l).slice(0, 2).toLowerCase();
    if (k === 'fr' || k === 'en' || k === 'es') return k;
  }
  return 'fr';
}

export type Args = Record<string, string | number>;

export function t(src: string, args?: Args): string {
  let s = current === 'fr' ? src : (DICT[current][src] ?? src);
  if (args) s = s.replace(/\{(\w+)\}/g, (m, k) => (k in args ? String(args[k]) : m));
  return s;
}

/** Marque un texte à traduire plus tard avec t() (tables de libellés). */
export const tr = (src: string): string => src;

/** Libellés de la météo (état interne → texte à traduire). */
export const WEATHER_LABEL: Record<string, string> = { clair: tr('Clair'), pluie: tr('Pluie'), orage: tr('Orage') };

/** Locale pour les dates et nombres. */
export function locale(): string {
  return current === 'en' ? 'en-GB' : current === 'es' ? 'es-ES' : 'fr-FR';
}
