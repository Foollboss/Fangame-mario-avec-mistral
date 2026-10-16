/**
 * Commandes de chat (« / ») : temps, mode de jeu, téléportation, objets, météo,
 * créatures, règles, effets, expérience, blocs, dimensions, localisation de biomes.
 * Elles nécessitent l'option « Activer les triches » du monde (sauf /help et /seed).
 */
import { ITEM_BY_KEY, ITEMS } from '../items/items';
import { BLOCK_BY_KEY } from '../world/blocks';
import { BIOMES } from '../world/biomes';
import { MOB_DEFS, resolveMob } from '../entities/mobDefs';
import { OverworldShaper } from '../world/gen/terrain';
import { OverworldGenerator } from '../world/gen/overworld';
import { EmberGenerator, SkyGenerator } from '../world/gen/otherDims';
import { locateStructure, structureKindKey, STRUCTURE_KINDS } from '../world/gen/structures';
import { locateDimStructure } from '../world/gen/dimStructures';
import { DIMENSION_NAMES } from '../world/constants';
import { EFFECT_NAMES } from '../player/Player';
import type { GameMode, GameRules, Difficulty } from '../save/SaveManager';
import type { Game } from './Game';

const MODES: Record<string, GameMode> = {
  s: 'survival',
  '0': 'survival',
  survival: 'survival',
  survie: 'survival',
  c: 'creative',
  '1': 'creative',
  creative: 'creative',
  creatif: 'creative',
  créatif: 'creative',
  a: 'adventure',
  '2': 'adventure',
  adventure: 'adventure',
  aventure: 'adventure',
  sp: 'spectator',
  spectator: 'spectator',
  spectateur: 'spectator',
};

const DIFFS: Record<string, Difficulty> = { p: 'peaceful', peaceful: 'peaceful', paisible: 'peaceful', e: 'easy', easy: 'easy', facile: 'easy', n: 'normal', normal: 'normal', h: 'hard', hard: 'hard', difficile: 'hard' };

export const COMMAND_HELP: Array<[string, string]> = [
  ['/help', 'Liste des commandes'],
  ['/seed', 'Affiche la graine du monde'],
  ['/time set <day|noon|night|midnight|n>', 'Règle l’heure'],
  ['/time add <n>', 'Avance le temps'],
  ['/gamemode <survival|creative|adventure|spectator>', 'Change de mode de jeu'],
  ['/difficulty <peaceful|easy|normal|hard>', 'Change la difficulté'],
  ['/tp <x> <y> <z>', 'Téléporte (~ = relatif)'],
  ['/give <objet> [quantité]', 'Donne un objet'],
  ['/clear', 'Vide l’inventaire'],
  ['/weather <clear|rain|thunder> [secondes]', 'Change la météo'],
  ['/summon <créature> [x y z]', 'Fait apparaître une créature'],
  ['/kill [@e|@s|type]', 'Élimine des entités'],
  ['/effect <effet> [secondes] [niveau] | clear', 'Applique un effet'],
  ['/xp <n>[L]', 'Donne de l’expérience (L = niveaux)'],
  ['/setblock <x> <y> <z> <bloc>', 'Place un bloc'],
  ['/fill <x1> <y1> <z1> <x2> <y2> <z2> <bloc>', 'Remplit une zone (32 768 blocs max)'],
  ['/gamerule <règle> [valeur]', 'Lit ou modifie une règle'],
  ['/spawnpoint', 'Définit le point d’apparition ici'],
  ['/locate <biome|structure>', 'Trouve le biome ou la structure la plus proche (village, donjon, forteresse…)'],
  ['/dimension <surface|braise|ciel>', 'Change de dimension'],
];

function parseCoord(s: string | undefined, base: number): number | null {
  if (s === undefined) return null;
  if (s.startsWith('~')) {
    const rest = s.slice(1);
    return base + (rest ? Number(rest) : 0);
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export function runCommand(g: Game, line: string): string[] {
  const parts = line.trim().replace(/^\//, '').split(/\s+/);
  const cmd = (parts.shift() ?? '').toLowerCase();
  const p = g.player;
  const out: string[] = [];
  if (cmd === 'help' || cmd === '?') {
    for (const [c, d] of COMMAND_HELP) out.push(`${c} — ${d}`);
    return out;
  }
  if (cmd === 'seed') return [`Graine : ${g.meta.seedText || g.meta.seed}`];
  if (!g.meta.cheats) return ['Les triches ne sont pas activées dans ce monde (Paramètres du monde → Triches).'];
  if (g.net && !g.net.isOperator) return ['Vous devez être opérateur pour utiliser les commandes.'];

  switch (cmd) {
    case 'time': {
      const sub = parts[0];
      if (sub === 'query') return [`Heure : ${Math.floor(g.time)} (jour ${g.meta.day + 1})`];
      const v = parts[1];
      const named: Record<string, number> = { day: 1000, jour: 1000, noon: 6000, midi: 6000, night: 13000, nuit: 13000, midnight: 18000, minuit: 18000, sunrise: 23000, sunset: 12000 };
      const n = v !== undefined ? (named[v] ?? Number(v)) : NaN;
      if (!Number.isFinite(n)) return ['Usage : /time set <day|noon|night|midnight|n> ou /time add <n>'];
      if (sub === 'set') g.setTime(n);
      else if (sub === 'add') g.setTime(g.time + n);
      else return ['Usage : /time set <…> ou /time add <n>'];
      return [`Heure réglée sur ${Math.floor(g.time)}`];
    }
    case 'gamemode':
    case 'gm': {
      const m = MODES[(parts[0] ?? '').toLowerCase()];
      if (!m) return ['Mode inconnu. Modes : survival, creative, adventure, spectator'];
      g.setGameMode(m);
      return [`Mode de jeu : ${m}`];
    }
    case 'difficulty': {
      const d = DIFFS[(parts[0] ?? '').toLowerCase()];
      if (!d) return ['Difficultés : peaceful, easy, normal, hard'];
      g.setDifficulty(d);
      return [`Difficulté : ${d}`];
    }
    case 'tp':
    case 'teleport': {
      const x = parseCoord(parts[0], p.pos.x);
      const y = parseCoord(parts[1], p.pos.y);
      const z = parseCoord(parts[2], p.pos.z);
      if (x === null || y === null || z === null) return ['Usage : /tp <x> <y> <z>'];
      g.teleport(x, y, z);
      return [`Téléporté en ${x.toFixed(1)}, ${y.toFixed(1)}, ${z.toFixed(1)}`];
    }
    case 'give': {
      const key = (parts[0] ?? '').toLowerCase().replace(/^minecraft:|^voxelia:/, '');
      const def = ITEM_BY_KEY.get(key) ?? ITEMS.find((i) => i && i.name.toLowerCase() === key.replace(/_/g, ' '));
      if (!def) return [`Objet inconnu : ${key}`];
      const count = Math.max(1, Math.min(64 * 36, Number(parts[1] ?? 1) || 1));
      let left = count;
      while (left > 0) {
        const n = Math.min(left, def.maxStack);
        const rest = p.inventory.give({ id: def.id, count: n });
        if (rest > 0) g.dropItem(p.pos.x, p.pos.y + 1, p.pos.z, { id: def.id, count: rest });
        left -= n;
      }
      return [`${count} × ${def.name} donné(s)`];
    }
    case 'clear': {
      p.inventory.clear();
      p.inventory.armor.clear();
      p.inventory.offhand.clear();
      p.inventory.changed();
      return ['Inventaire vidé'];
    }
    case 'weather': {
      const s = parts[0] as 'clear' | 'rain' | 'thunder';
      if (!['clear', 'rain', 'thunder'].includes(s)) return ['Usage : /weather <clear|rain|thunder> [secondes]'];
      const dur = Number(parts[1] ?? 0) * 20 || (s === 'clear' ? 12000 : 6000);
      g.weather.set(s, dur);
      return [`Météo : ${s}`];
    }
    case 'summon': {
      const type = resolveMob((parts[0] ?? '').toLowerCase());
      if (!type) return [`Créature inconnue. Exemples : ${Object.keys(MOB_DEFS).slice(0, 12).join(', ')}…`];
      const x = parseCoord(parts[1], p.pos.x) ?? p.pos.x - Math.sin(p.yaw) * 2;
      const y = parseCoord(parts[2], p.pos.y) ?? p.pos.y;
      const z = parseCoord(parts[3], p.pos.z) ?? p.pos.z - Math.cos(p.yaw) * 2;
      const m = g.spawnMob(type, x, y, z, { persistent: true, force: true });
      return [m ? `${MOB_DEFS[type]?.name ?? type} invoqué(e)` : 'Impossible d’invoquer ici'];
    }
    case 'kill': {
      const target = parts[0] ?? '@s';
      if (target === '@s' || target === '@p') {
        p.invulnerable = 0; // /kill ignore l'invulnérabilité qui suit un coup
        p.hurt(1000, { type: 'void' });
        return ['Vous vous êtes éliminé'];
      }
      let n = 0;
      for (const e of g.entities.list) {
        if (e === p || e.removed) continue;
        if (target === '@e' || e.type === target || (target === '@items' && e.type === 'item')) {
          if (e.living) e.hurt(10000, { type: 'void' });
          else e.remove();
          n++;
        }
      }
      return [`${n} entité(s) éliminée(s)`];
    }
    case 'effect': {
      const id = (parts[0] ?? '').toLowerCase();
      if (id === 'clear') {
        p.effects.clear();
        return ['Effets retirés'];
      }
      if (!EFFECT_NAMES[id]) return [`Effets : ${Object.keys(EFFECT_NAMES).join(', ')}`];
      const sec = Number(parts[1] ?? 30) || 30;
      const lvl = Math.max(0, (Number(parts[2] ?? 1) || 1) - 1);
      p.addEffect(id, sec, lvl);
      return [`${EFFECT_NAMES[id]} appliqué(e) pour ${sec} s`];
    }
    case 'xp':
    case 'experience': {
      const raw = parts[0] ?? '';
      const levels = /l$/i.test(raw);
      const n = Number(raw.replace(/l$/i, ''));
      if (!Number.isFinite(n)) return ['Usage : /xp <n> ou /xp <n>L'];
      if (levels) {
        p.xpLevel = Math.max(0, p.xpLevel + n);
        p.xpProgress = 0;
      } else p.addXp(n);
      return [levels ? `${n} niveau(x) ajouté(s)` : `${n} points d’expérience ajoutés`];
    }
    case 'setblock': {
      const x = parseCoord(parts[0], p.pos.x);
      const y = parseCoord(parts[1], p.pos.y);
      const z = parseCoord(parts[2], p.pos.z);
      const b = BLOCK_BY_KEY.get((parts[3] ?? '').toLowerCase());
      if (x === null || y === null || z === null || !b) return ['Usage : /setblock <x> <y> <z> <bloc>'];
      g.world.set(Math.floor(x), Math.floor(y), Math.floor(z), b.id, 0, 'player');
      return ['Bloc placé'];
    }
    case 'fill': {
      const c = [0, 1, 2, 3, 4, 5].map((i) => parseCoord(parts[i], i % 3 === 0 ? p.pos.x : i % 3 === 1 ? p.pos.y : p.pos.z));
      const b = parts[6] === 'air' ? { id: 0 } : BLOCK_BY_KEY.get((parts[6] ?? '').toLowerCase());
      if (c.some((v) => v === null) || !b) return ['Usage : /fill <x1> <y1> <z1> <x2> <y2> <z2> <bloc>'];
      const [x1, y1, z1, x2, y2, z2] = (c as number[]).map(Math.floor);
      const vol = (Math.abs(x2 - x1) + 1) * (Math.abs(y2 - y1) + 1) * (Math.abs(z2 - z1) + 1);
      if (vol > 32768) return [`Zone trop grande (${vol} blocs, max 32 768)`];
      let n = 0;
      for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++)
        for (let y = Math.max(0, Math.min(y1, y2)); y <= Math.min(255, Math.max(y1, y2)); y++)
          for (let z = Math.min(z1, z2); z <= Math.max(z1, z2); z++) if (g.world.set(x, y, z, b.id, 0, 'player')) n++;
      return [`${n} bloc(s) modifié(s)`];
    }
    case 'gamerule': {
      const rules = g.meta.rules as unknown as Record<string, boolean | number>;
      const k = Object.keys(rules).find((r) => r.toLowerCase() === (parts[0] ?? '').toLowerCase());
      if (!k) return [`Règles : ${Object.keys(rules).join(', ')}`];
      if (parts[1] === undefined) return [`${k} = ${rules[k]}`];
      const v = typeof rules[k] === 'number' ? Number(parts[1]) : parts[1] === 'true' || parts[1] === '1';
      if (typeof v === 'number' && !Number.isFinite(v)) return ['Valeur invalide'];
      g.setRule(k as keyof GameRules, v as never);
      return [`${k} = ${v}`];
    }
    case 'spawnpoint':
    case 'setworldspawn': {
      const s: [number, number, number] = [Math.floor(p.pos.x) + 0.5, Math.floor(p.pos.y), Math.floor(p.pos.z) + 0.5];
      if (cmd === 'setworldspawn') g.meta.spawn = s;
      else p.spawnPoint = s;
      return [`Point d’apparition défini en ${s.map(Math.floor).join(', ')}`];
    }
    case 'locate': {
      const key = (parts[0] ?? '').toLowerCase();
      const opts = g.genOptions();
      const px0 = Math.floor(p.pos.x);
      const pz0 = Math.floor(p.pos.z);
      const dist = (x: number, z: number) => Math.round(Math.hypot(x - px0, z - pz0));
      // Structures des dimensions
      if (['forteresse', 'fortress', 'temple_celeste', 'temple', 'sky_temple'].includes(key)) {
        const kind = key.startsWith('fort') ? 'fortress' : 'sky_temple';
        const dim = kind === 'fortress' ? 1 : 2;
        if (g.dimension !== dim) return [kind === 'fortress' ? 'Les forteresses se trouvent dans les Terres de braise.' : 'Le temple céleste se trouve dans le Royaume céleste.'];
        const gen = dim === 1 ? new EmberGenerator(opts) : new SkyGenerator(opts);
        const r = locateDimStructure(gen, kind, px0, pz0, 20000);
        return r ? [`${kind === 'fortress' ? 'Forteresse' : 'Temple céleste'} la plus proche : ${r.x}, ~, ${r.z} (${dist(r.x, r.z)} blocs)`] : ['Aucune structure trouvée'];
      }
      // Structures de la Surface
      const sk = structureKindKey(key);
      if (sk) {
        if (g.dimension !== 0) return ['Disponible uniquement à la Surface'];
        if (!g.meta.structures) return ['Les structures sont désactivées dans ce monde.'];
        const r = locateStructure(new OverworldGenerator(opts), sk, px0, pz0, 6000);
        const name = STRUCTURE_KINDS.find((k) => k.key === sk)?.name ?? sk;
        return r ? [`${name} le plus proche : ${r.x}, ${r.y}, ${r.z} (${dist(r.x, r.z)} blocs)`] : [`Aucun(e) ${name} trouvé(e) à moins de 6000 blocs`];
      }
      if (g.dimension !== 0) return ['Disponible uniquement à la Surface'];
      const biome = BIOMES.find((b) => b && (b.key === key || b.name.toLowerCase() === key));
      if (!biome) return [`Structures : ${STRUCTURE_KINDS.map((k) => k.key).join(', ')}, forteresse, temple`, `Biomes : ${BIOMES.filter(Boolean).map((b) => b.key).join(', ')}`];
      const shaper = new OverworldShaper({ seed: g.meta.seed, template: g.meta.template, caves: g.meta.caves, structures: g.meta.structures, fantasyBiomes: g.meta.experiments.fantasyBiomes, drop3: g.meta.experiments.drop3, dimensions: g.meta.experiments.dimensions });
      const px = Math.floor(p.pos.x);
      const pz = Math.floor(p.pos.z);
      for (let r = 0; r <= 4000; r += 32) {
        const steps = Math.max(1, Math.floor((2 * Math.PI * r) / 32));
        for (let i = 0; i < steps; i++) {
          const a = (i / steps) * Math.PI * 2;
          const x = px + Math.round(Math.cos(a) * r);
          const z = pz + Math.round(Math.sin(a) * r);
          if (shaper.sample(x, z).biome === biome.id) return [`${biome.name} le plus proche : ${x}, ~, ${z} (${r} blocs)`];
        }
      }
      return [`Aucun biome « ${biome.name} » trouvé dans un rayon de 4000 blocs`];
    }
    case 'dimension':
    case 'dim': {
      const map: Record<string, number> = { surface: 0, overworld: 0, '0': 0, braise: 1, ember: 1, '1': 1, ciel: 2, sky: 2, '2': 2 };
      const d = map[(parts[0] ?? '').toLowerCase()];
      if (d === undefined) return ['Usage : /dimension <surface|braise|ciel>'];
      if (!g.meta.experiments.dimensions && d !== 0) return ['Les dimensions sont désactivées dans ce monde (Expériences)'];
      void g.changeDimension(d, null);
      return [`Voyage vers : ${DIMENSION_NAMES[d]}`];
    }
    default:
      return [`Commande inconnue : /${cmd}. Tapez /help`];
  }
}
