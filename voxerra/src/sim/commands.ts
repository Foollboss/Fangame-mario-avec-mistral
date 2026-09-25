/** Commandes de discussion (/aide, /donner, /tp, /temps, /meteo, /mode…). */
import type { Sim } from './sim';
import type { Player } from '../entity/player';
import type { GameMode } from '../save/storage';

export interface CommandHost {
  sim: Sim;
  /** Recherche de structure (renseigné par le client/serveur). */
  locate?(type: string, dim: string, x: number, z: number): { x: number; z: number } | null;
  travel?(p: Player, dim: string): void;
  summon?(type: string, dim: string, x: number, y: number, z: number): boolean;
}

const HELP = [
  '/aide — cette liste',
  '/donner <objet> [quantité] — (alias /give)',
  '/tp <x> <y> <z> — téléportation',
  '/temps <jour|nuit|midi|minuit|nombre> — régler l’heure',
  '/meteo <clair|pluie|orage> — météo',
  '/mode <survie|creatif|spectateur> — mode de jeu',
  '/effet <id> [secondes] [niveau] — effet de statut',
  '/invoquer <créature> — faire apparaître une créature',
  '/localiser <structure> — structure la plus proche',
  '/dimension <surface|abime|astral> — changer de dimension',
  '/soigner — rendre santé et énergie',
  '/tuer — mourir',
  '/graine — graine du monde',
  '/regle <nom> <oui|non> — règles (keepInventory, mobSpawning…)',
];

export function runCommand(host: CommandHost, p: Player, line: string): { ok: boolean; out: string[] } {
  const sim = host.sim;
  const parts = line.trim().replace(/^\//, '').split(/\s+/);
  const cmd = (parts.shift() ?? '').toLowerCase();
  const out: string[] = [];
  const allowed = sim.meta.allowCommands || p.creative;
  if (!['aide', 'help', 'graine', 'seed'].includes(cmd) && !allowed) return { ok: false, out: ['Les commandes ne sont pas autorisées dans ce monde.'] };
  const num = (s: string | undefined, rel: number) => {
    if (s === undefined) return NaN;
    if (s.startsWith('~')) return rel + (s.length > 1 ? Number(s.slice(1)) : 0);
    return Number(s);
  };
  switch (cmd) {
    case 'aide':
    case 'help':
      return { ok: true, out: HELP };
    case 'graine':
    case 'seed':
      return { ok: true, out: [`Graine : ${sim.meta.seedText} (${sim.meta.seed})`] };
    case 'donner':
    case 'give': {
      const id = parts[0];
      const n = Math.max(1, Math.min(6400, Number(parts[1] ?? 1) || 1));
      const it = id ? sim.content.items.get(id) : undefined;
      if (!it) {
        const sugg = id ? sim.content.items.list.filter((x) => x.id.includes(id) || x.name.toLowerCase().includes(id.toLowerCase())).slice(0, 6).map((x) => x.id) : [];
        return { ok: false, out: [`Objet inconnu : ${id ?? '?'}`, sugg.length ? 'Suggestions : ' + sugg.join(', ') : ''] };
      }
      let left = n;
      while (left > 0) {
        const k = Math.min(left, it.stackSize);
        const rest = p.inventory.give({ id: it.id, count: k });
        if (rest) sim.spawnItem(p.dim, p.x, p.y + 1, p.z, rest, false);
        left -= k;
      }
      sim.onItemObtained(p, it.id, n);
      return { ok: true, out: [`${n} × ${it.name} donné(s) à ${p.name}`] };
    }
    case 'tp': {
      const x = num(parts[0], p.x),
        y = num(parts[1], p.y),
        z = num(parts[2], p.z);
      if ([x, y, z].some((v) => !Number.isFinite(v))) return { ok: false, out: ['Usage : /tp <x> <y> <z> (~ pour relatif)'] };
      p.setPos(x, y, z);
      p.body.vx = p.body.vy = p.body.vz = 0;
      p.body.fallDist = 0;
      return { ok: true, out: [`Téléporté en ${x.toFixed(1)} ${y.toFixed(1)} ${z.toFixed(1)}`] };
    }
    case 'temps':
    case 'time': {
      const a = (parts[0] ?? '').toLowerCase();
      const map: Record<string, number> = { jour: 1000, day: 1000, midi: 6000, noon: 6000, nuit: 13000, night: 13000, minuit: 18000, midnight: 18000 };
      const t = map[a] ?? Number(a);
      if (!Number.isFinite(t)) return { ok: false, out: ['Usage : /temps <jour|nuit|midi|minuit|ticks>'] };
      sim.env.time = sim.env.day * 24000 + (t % 24000);
      return { ok: true, out: [`Heure réglée (${t % 24000})`] };
    }
    case 'meteo':
    case 'weather': {
      const w = (parts[0] ?? '').toLowerCase();
      const map: Record<string, 'clair' | 'pluie' | 'orage'> = { clair: 'clair', clear: 'clair', pluie: 'pluie', rain: 'pluie', orage: 'orage', thunder: 'orage' };
      if (!map[w]) return { ok: false, out: ['Usage : /meteo <clair|pluie|orage>'] };
      sim.env.setWeather(map[w], 12000);
      return { ok: true, out: [`Météo : ${map[w]}`] };
    }
    case 'mode':
    case 'gamemode': {
      const m = (parts[0] ?? '').toLowerCase();
      const map: Record<string, GameMode> = { survie: 'survie', survival: 'survie', s: 'survie', '0': 'survie', creatif: 'creatif', créatif: 'creatif', creative: 'creatif', c: 'creatif', '1': 'creatif', spectateur: 'spectateur', spectator: 'spectateur', sp: 'spectateur', '3': 'spectateur' };
      if (!map[m]) return { ok: false, out: ['Usage : /mode <survie|creatif|spectateur>'] };
      p.gameMode = map[m];
      if (!p.creative) p.flying = false;
      return { ok: true, out: [`Mode de jeu : ${map[m]}`] };
    }
    case 'effet':
    case 'effect': {
      const id = parts[0];
      if (!id || !sim.content.effects.has(id)) return { ok: false, out: ['Effets : ' + [...sim.content.effects.keys()].join(', ')] };
      p.addEffect(id, Number(parts[1] ?? 30) || 30, Math.max(0, (Number(parts[2] ?? 1) || 1) - 1));
      return { ok: true, out: [`Effet ${id} appliqué`] };
    }
    case 'soigner':
    case 'heal':
      p.health = p.maxHealth;
      p.energy = 20;
      p.saturation = 10;
      p.air = 10;
      p.bodyTemp = 0;
      p.effects.clear();
      return { ok: true, out: ['Santé et énergie restaurées'] };
    case 'tuer':
    case 'kill':
      p.damage(9999, { type: 'kill', ignoreArmor: true });
      return { ok: true, out: [] };
    case 'invoquer':
    case 'summon': {
      const type = parts[0];
      if (!type || !sim.content.creatures.has(type)) return { ok: false, out: ['Créatures : ' + [...sim.content.creatures.keys()].join(', ')] };
      const d = { x: -Math.sin(p.yaw) * 3, z: -Math.cos(p.yaw) * 3 };
      const ok = host.summon?.(type, p.dim, p.x + d.x, p.y + 0.5, p.z + d.z) ?? false;
      return { ok, out: [ok ? `${sim.content.creatures.get(type)!.name} invoqué(e)` : 'Invocation impossible ici'] };
    }
    case 'localiser':
    case 'locate': {
      const type = parts[0];
      if (!type || !host.locate) return { ok: false, out: ['Usage : /localiser <village|ruines|tour|temple|mine|donjon|sanctuaire|observatoire|crypte|forteresse|citadelle|fleche>'] };
      const r = host.locate(type, p.dim, p.x, p.z);
      if (!r) return { ok: false, out: [`Aucune structure « ${type} » trouvée à proximité.`] };
      return { ok: true, out: [`${type} le plus proche : x=${r.x}, z=${r.z} (${Math.round(Math.hypot(r.x - p.x, r.z - p.z))} blocs)`] };
    }
    case 'dimension':
    case 'dim': {
      const d = (parts[0] ?? '').toLowerCase();
      if (!['surface', 'abime', 'astral'].includes(d)) return { ok: false, out: ['Usage : /dimension <surface|abime|astral>'] };
      if (host.travel) host.travel(p, d);
      else sim.requestTravel(p, d, { x: p.x, y: p.y, z: p.z });
      return { ok: true, out: [`Voyage vers ${d}…`] };
    }
    case 'regle':
    case 'gamerule': {
      const k = parts[0] as keyof typeof sim.rules;
      if (!k || !(k in sim.rules)) return { ok: false, out: ['Règles : ' + Object.keys(sim.rules).join(', ')] };
      const v = /^(oui|true|1|yes)$/i.test(parts[1] ?? '');
      sim.rules[k] = v;
      sim.meta.rules = { ...sim.rules };
      return { ok: true, out: [`${k} = ${v ? 'oui' : 'non'}`] };
    }
    default:
      return { ok: false, out: [`Commande inconnue : /${cmd}. Tapez /aide.`] };
  }
}
