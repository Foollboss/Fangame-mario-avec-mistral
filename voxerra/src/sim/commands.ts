/** Commandes de discussion (/aide, /donner, /tp, /temps, /meteo, /mode…). */
import type { Sim } from './sim';
import type { Player } from '../entity/player';
import type { GameMode } from '../save/storage';
import { t, tr, WEATHER_LABEL, type Lang } from '../i18n/i18n';

export interface CommandHost {
  sim: Sim;
  /** Recherche de structure (renseigné par le client/serveur). */
  locate?(type: string, dim: string, x: number, z: number): { x: number; z: number; name?: string } | null;
  travel?(p: Player, dim: string): void;
  summon?(type: string, dim: string, x: number, y: number, z: number): boolean;
  /** Partie solo : le refus indique comment autoriser les commandes. */
  solo?: boolean;
}

const HELP = [
  tr('/aide — cette liste'),
  tr('/donner <objet> [quantité] — (alias /give)'),
  tr('/tp <x> <y> <z> — téléportation'),
  tr('/temps <jour|nuit|midi|minuit|nombre> — régler l’heure'),
  tr('/meteo <clair|pluie|orage> — météo'),
  tr('/mode <survie|creatif|spectateur> — mode de jeu'),
  tr('/effet <id> [secondes] [niveau] — effet de statut'),
  tr('/invoquer <créature> — faire apparaître une créature'),
  tr('/localiser <structure> — structure la plus proche'),
  tr('/dimension <surface|abime|astral|celeste> — changer de dimension'),
  tr('/soigner — rendre santé et énergie'),
  tr('/tuer — mourir'),
  tr('/graine — graine du monde'),
  tr('/regle <nom> <oui|non> — règles (keepInventory, mobSpawning…)'),
];

export function runCommand(host: CommandHost, p: Player, line: string): { ok: boolean; out: string[] } {
  const sim = host.sim;
  const parts = line.trim().replace(/^\//, '').split(/\s+/);
  const cmd = (parts.shift() ?? '').toLowerCase();
  const out: string[] = [];
  const allowed = sim.meta.allowCommands || p.creative;
  if (!['aide', 'help', 'ayuda', 'graine', 'seed', 'semilla'].includes(cmd) && !allowed) {
    const out = [t('Les commandes ne sont pas autorisées dans ce monde.')];
    if (host.solo) out.push(t('Pour les activer : écran titre → Solo → Modifier → Autoriser les commandes.'));
    return { ok: false, out };
  }
  const num = (s: string | undefined, rel: number) => {
    if (s === undefined) return NaN;
    if (s.startsWith('~')) return rel + (s.length > 1 ? Number(s.slice(1)) : 0);
    return Number(s);
  };
  switch (cmd) {
    case 'aide':
    case 'help':
    case 'ayuda':
      return { ok: true, out: HELP.map((l) => t(l)) };
    case 'graine':
    case 'seed':
    case 'semilla':
      return { ok: true, out: [t('Graine : {seed}', { seed: `${sim.meta.seedText} (${sim.meta.seed})` })] };
    case 'donner':
    case 'give':
    case 'dar': {
      const id = parts[0];
      const n = Math.max(1, Math.min(6400, Number(parts[1] ?? 1) || 1));
      const it = id ? sim.content.items.get(id) : undefined;
      if (!it) {
        const sugg = id ? sim.content.items.list.filter((x) => x.id.includes(id) || x.name.toLowerCase().includes(id.toLowerCase())).slice(0, 6).map((x) => x.id) : [];
        return { ok: false, out: [t('Objet inconnu : {id}', { id: id ?? '?' }), sugg.length ? t('Suggestions : {list}', { list: sugg.join(', ') }) : ''] };
      }
      let left = n;
      while (left > 0) {
        const k = Math.min(left, it.stackSize);
        const rest = p.inventory.give({ id: it.id, count: k });
        if (rest) sim.spawnItem(p.dim, p.x, p.y + 1, p.z, rest, false);
        left -= k;
      }
      sim.onItemObtained(p, it.id, n);
      return { ok: true, out: [t('{n} × {item} donné(s) à {name}', { n, item: it.name, name: p.name })] };
    }
    case 'tp': {
      const x = num(parts[0], p.x),
        y = num(parts[1], p.y),
        z = num(parts[2], p.z);
      if ([x, y, z].some((v) => !Number.isFinite(v))) return { ok: false, out: [t('Usage : /tp <x> <y> <z> (~ pour relatif)')] };
      p.setPos(x, y, z);
      p.body.vx = p.body.vy = p.body.vz = 0;
      p.body.fallDist = 0;
      return { ok: true, out: [t('Téléporté en {x} {y} {z}', { x: x.toFixed(1), y: y.toFixed(1), z: z.toFixed(1) })] };
    }
    case 'temps':
    case 'time':
    case 'tiempo': {
      const a = (parts[0] ?? '').toLowerCase();
      const map: Record<string, number> = { jour: 1000, day: 1000, dia: 1000, día: 1000, midi: 6000, noon: 6000, mediodia: 6000, mediodía: 6000, nuit: 13000, night: 13000, noche: 13000, minuit: 18000, midnight: 18000, medianoche: 18000 };
      const tk = map[a] ?? Number(a);
      if (!Number.isFinite(tk)) return { ok: false, out: [t('Usage : /temps <jour|nuit|midi|minuit|ticks>')] };
      sim.env.time = sim.env.day * 24000 + (tk % 24000);
      return { ok: true, out: [t('Heure réglée ({n})', { n: tk % 24000 })] };
    }
    case 'meteo':
    case 'weather':
    case 'clima': {
      const w = (parts[0] ?? '').toLowerCase();
      const map: Record<string, 'clair' | 'pluie' | 'orage'> = { clair: 'clair', clear: 'clair', despejado: 'clair', pluie: 'pluie', rain: 'pluie', lluvia: 'pluie', orage: 'orage', thunder: 'orage', tormenta: 'orage' };
      if (!map[w]) return { ok: false, out: [t('Usage : /meteo <clair|pluie|orage>')] };
      sim.env.setWeather(map[w], 12000);
      return { ok: true, out: [t('Météo : {w}', { w: t(WEATHER_LABEL[map[w]]) })] };
    }
    case 'mode':
    case 'gamemode':
    case 'modo': {
      const m = (parts[0] ?? '').toLowerCase();
      const map: Record<string, GameMode> = { survie: 'survie', survival: 'survie', s: 'survie', '0': 'survie', creatif: 'creatif', créatif: 'creatif', creative: 'creatif', c: 'creatif', '1': 'creatif', spectateur: 'spectateur', spectator: 'spectateur', sp: 'spectateur', '3': 'spectateur', supervivencia: 'survie', creativo: 'creatif', espectador: 'spectateur' };
      if (!map[m]) return { ok: false, out: [t('Usage : /mode <survie|creatif|spectateur>')] };
      p.gameMode = map[m];
      if (!p.creative) p.flying = false;
      return { ok: true, out: [t('Mode de jeu : {m}', { m: t({ survie: tr('Survie'), creatif: tr('Créatif'), spectateur: tr('Spectateur'), hardcore: tr('Hardcore') }[map[m]]) })] };
    }
    case 'effet':
    case 'effect':
    case 'efecto': {
      const id = parts[0];
      if (!id || !sim.content.effects.has(id)) return { ok: false, out: [t('Effets : {list}', { list: [...sim.content.effects.keys()].join(', ') })] };
      p.addEffect(id, Number(parts[1] ?? 30) || 30, Math.max(0, (Number(parts[2] ?? 1) || 1) - 1));
      return { ok: true, out: [t('Effet {id} appliqué', { id: sim.content.effects.get(id)?.name ?? id })] };
    }
    case 'soigner':
    case 'heal':
    case 'curar':
      p.health = p.maxHealth;
      p.energy = 20;
      p.saturation = 10;
      p.air = 10;
      p.bodyTemp = 0;
      p.effects.clear();
      return { ok: true, out: [t('Santé et énergie restaurées')] };
    case 'tuer':
    case 'kill':
    case 'matar':
      p.damage(9999, { type: 'kill', ignoreArmor: true });
      return { ok: true, out: [] };
    case 'invoquer':
    case 'summon':
    case 'invocar': {
      const type = parts[0];
      if (!type || !sim.content.creatures.has(type)) return { ok: false, out: [t('Créatures : {list}', { list: [...sim.content.creatures.keys()].join(', ') })] };
      const d = { x: -Math.sin(p.yaw) * 3, z: -Math.cos(p.yaw) * 3 };
      const ok = host.summon?.(type, p.dim, p.x + d.x, p.y + 0.5, p.z + d.z) ?? false;
      return { ok, out: [ok ? t('{name} invoqué(e)', { name: sim.content.creatures.get(type)!.name }) : t('Invocation impossible ici')] };
    }
    case 'localiser':
    case 'locate':
    case 'localizar': {
      const type = parts[0];
      if (!type || !host.locate) return { ok: false, out: [t('Usage : /localiser <village|ruines|tour|temple|mine|donjon|sanctuaire|observatoire|crypte|forteresse|citadelle|fleche|temple_nuees>')] };
      const r = host.locate(type, p.dim, p.x, p.z);
      if (!r) return { ok: false, out: [t('Aucune structure « {type} » trouvée à proximité.', { type })] };
      return { ok: true, out: [t('{type} le plus proche : x={x}, z={z} ({d} blocs)', { type: r.name ?? type, x: r.x, z: r.z, d: Math.round(Math.hypot(r.x - p.x, r.z - p.z)) })] };
    }
    case 'dimension':
    case 'dim': {
      const d = (parts[0] ?? '').toLowerCase();
      if (!['surface', 'abime', 'astral', 'celeste'].includes(d)) return { ok: false, out: [t('Usage : /dimension <surface|abime|astral|celeste>')] };
      if (host.travel) host.travel(p, d);
      else sim.requestTravel(p, d, { x: p.x, y: p.y, z: p.z });
      return { ok: true, out: [t('Voyage vers {dim}…', { dim: d })] };
    }
    case 'regle':
    case 'gamerule':
    case 'regla': {
      const k = parts[0] as keyof typeof sim.rules;
      if (!k || !(k in sim.rules)) return { ok: false, out: [t('Règles : {list}', { list: Object.keys(sim.rules).join(', ') })] };
      const v = /^(oui|true|1|yes|si|sí)$/i.test(parts[1] ?? '');
      sim.rules[k] = v;
      sim.meta.rules = { ...sim.rules };
      return { ok: true, out: [`${k} = ${v ? t('oui') : t('non')}`] };
    }
    default:
      return { ok: false, out: [t('Commande inconnue : /{cmd}. Tapez /aide.', { cmd })] };
  }
}

// ---------------------------------------------------------------------------
// Complétion (suggestions à toucher sous la saisie, touche Tab)

/** Noms des commandes dans chaque langue, dans le même ordre (le français fait foi). */
const CMD_NAMES: Record<Lang, string[]> = {
  fr: ['aide', 'donner', 'tp', 'temps', 'meteo', 'mode', 'effet', 'invoquer', 'localiser', 'dimension', 'soigner', 'tuer', 'graine', 'regle'],
  en: ['help', 'give', 'tp', 'time', 'weather', 'gamemode', 'effect', 'summon', 'locate', 'dimension', 'heal', 'kill', 'seed', 'gamerule'],
  es: ['ayuda', 'dar', 'tp', 'tiempo', 'clima', 'modo', 'efecto', 'invocar', 'localizar', 'dimension', 'curar', 'matar', 'semilla', 'regla'],
};
const ALIASES: Record<string, string> = { dim: 'dimension', gamemode: 'mode' };
for (const lang of Object.keys(CMD_NAMES) as Lang[]) CMD_NAMES[lang].forEach((n, i) => (ALIASES[n] = CMD_NAMES.fr[i]));

const ARG_WORDS: Record<string, Record<Lang, string[]>> = {
  temps: { fr: ['jour', 'midi', 'nuit', 'minuit'], en: ['day', 'noon', 'night', 'midnight'], es: ['dia', 'mediodia', 'noche', 'medianoche'] },
  meteo: { fr: ['clair', 'pluie', 'orage'], en: ['clear', 'rain', 'thunder'], es: ['despejado', 'lluvia', 'tormenta'] },
  mode: { fr: ['survie', 'creatif', 'spectateur'], en: ['survival', 'creative', 'spectator'], es: ['supervivencia', 'creativo', 'espectador'] },
};
const STRUCTURES = ['village', 'ruines', 'tour', 'temple', 'portail', 'sanctuaire', 'observatoire', 'crypte', 'mine', 'donjon', 'forteresse', 'citadelle', 'fleche', 'temple_nuees'];
const MAX_SUGGESTIONS = 30;

/**
 * Suggestions pour la ligne en cours de saisie : chaque suggestion est la
 * ligne complétée (le dernier mot remplacé, suivi d'une espace).
 */
export function completeCommand(sim: Sim, line: string, lang: Lang): string[] {
  if (!line.startsWith('/')) return [];
  const words = line.slice(1).split(' ');
  const last = words.pop()!.toLowerCase();
  const head = '/' + words.map((w) => w + ' ').join('');
  const pick = (list: string[]) => {
    const starts = list.filter((x) => x.toLowerCase().startsWith(last));
    const inside = last.length >= 2 ? list.filter((x) => !x.toLowerCase().startsWith(last) && x.toLowerCase().includes(last)) : [];
    return [...starts, ...inside].filter((x) => x.toLowerCase() !== last).slice(0, MAX_SUGGESTIONS).map((x) => head + x + ' ');
  };
  if (words.length === 0) return pick(CMD_NAMES[lang]);
  const cmd = ALIASES[words[0].toLowerCase()];
  const arg = words.length; // 1 = premier argument
  switch (cmd) {
    case 'temps':
    case 'meteo':
    case 'mode':
      return arg === 1 ? pick(ARG_WORDS[cmd][lang]) : [];
    case 'dimension':
      return arg === 1 ? pick(['surface', 'abime', 'astral', 'celeste']) : [];
    case 'localiser':
      return arg === 1 ? pick(STRUCTURES) : [];
    case 'invoquer':
      return arg === 1 ? pick([...sim.content.creatures.keys()]) : [];
    case 'effet':
      return arg === 1 ? pick([...sim.content.effects.keys()]) : arg === 2 ? pick(['30', '60', '300']) : [];
    case 'donner':
      return arg === 1 ? pick(sim.content.items.list.map((x) => x.id)) : arg === 2 ? pick(['1', '16', '64']) : [];
    case 'regle':
      return arg === 1 ? pick(Object.keys(sim.rules)) : arg === 2 ? pick(lang === 'en' ? ['yes', 'no'] : lang === 'es' ? ['si', 'no'] : ['oui', 'non']) : [];
    case 'tp':
      return arg === 1 && !last ? [head + '~ ~ ~ '] : [];
    default:
      return [];
  }
}
