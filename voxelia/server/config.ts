/**
 * Options de ligne de commande du serveur Voxelia (analyse manuelle, messages en français).
 */
import type { Permission } from '../src/net/protocol.ts';

export const GAME_MODES = ['survival', 'creative', 'adventure', 'spectator'] as const;
export const DIFFICULTIES = ['peaceful', 'easy', 'normal', 'hard'] as const;
export const TEMPLATES = ['default', 'flat', 'archipelago', 'amplified', 'continents'] as const;

export type GameModeName = (typeof GAME_MODES)[number];
export type DifficultyName = (typeof DIFFICULTIES)[number];
export type TemplateName = (typeof TEMPLATES)[number];

export interface ServerConfig {
  port: number;
  host: string | undefined;
  name: string;
  motd: string;
  /** Graine telle que saisie (null : aléatoire à la création du monde). */
  seed: string | null;
  template: TemplateName;
  invite: string | null;
  max: number;
  ops: string[];
  defaultPermission: Permission;
  autoOp: boolean;
  worldDir: string;
  gameMode: GameModeName;
  difficulty: DifficultyName;
  cheats: boolean;
  rules: Record<string, boolean | number>;
  /** Rayon d'action direct d'un joueur (blocs). */
  reach: number;
  /** Rayon maximal des mises à jour automatiques envoyées par un client (liquides, cultures, explosions). */
  simRadius: number;
  /** Options données explicitement (elles remplacent les valeurs enregistrées dans world.json). */
  explicit: Set<string>;
}

export const USAGE = `Serveur multijoueur Voxelia

Utilisation : node --experimental-strip-types server/index.ts [options]

  --port <n>                 Port d'écoute (défaut 19140)
  --host <adresse>           Interface d'écoute (défaut : toutes)
  --name "<nom>"             Nom du serveur et du monde (défaut « Serveur Voxelia »)
  --motd "<texte>"           Message d'accueil affiché dans la liste des serveurs
  --seed <graine>            Graine du monde (texte ou nombre) — utilisée à la création
  --template <type>          default | flat | archipelago | amplified | continents
  --invite <code>            Code d'invitation exigé pour entrer
  --max <n>                  Nombre maximal de joueurs (défaut 10)
  --ops <nom1,nom2>          Opérateurs (pour cette exécution)
  --default-permission <p>   visitor | member | operator (défaut member)
  --no-auto-op               Ne pas nommer opérateur le premier joueur quand il n'y en a aucun
  --world-dir <dossier>      Dossier du monde (défaut server/data/monde)
  --gamemode <mode>          survival | creative | adventure | spectator
  --difficulty <niveau>      peaceful | easy | normal | hard
  --cheats / --no-cheats     Autorise les commandes de triche côté client
  --rule <nom>=<valeur>      Règle de jeu (ex. --rule daylightCycle=false), répétable
  --reach <n>                Rayon d'action d'un joueur en blocs (défaut 12)
  --sim-radius <n>           Rayon des mises à jour automatiques en blocs (défaut 96)
  -h, --help                 Affiche cette aide
`;

const PERMISSION_ALIASES: Record<string, Permission> = {
  visitor: 'visitor',
  visiteur: 'visitor',
  member: 'member',
  membre: 'member',
  operator: 'operator',
  operateur: 'operator',
  opérateur: 'operator',
  op: 'operator',
};

const MODE_ALIASES: Record<string, GameModeName> = {
  survival: 'survival',
  survie: 'survival',
  creative: 'creative',
  creatif: 'creative',
  créatif: 'creative',
  adventure: 'adventure',
  aventure: 'adventure',
  spectator: 'spectator',
  spectateur: 'spectator',
};

const DIFFICULTY_ALIASES: Record<string, DifficultyName> = {
  peaceful: 'peaceful',
  paisible: 'peaceful',
  easy: 'easy',
  facile: 'easy',
  normal: 'normal',
  normale: 'normal',
  hard: 'hard',
  difficile: 'hard',
};

export function parsePermission(v: string): Permission | null {
  return PERMISSION_ALIASES[v.trim().toLowerCase()] ?? null;
}

export class ConfigError extends Error {}

function intOpt(flag: string, v: string, min: number, max: number): number {
  const n = Number(v);
  if (!Number.isInteger(n) || n < min || n > max) throw new ConfigError(`${flag} : nombre entier attendu entre ${min} et ${max} (reçu « ${v} »)`);
  return n;
}

function parseRule(v: string): [string, boolean | number] {
  const m = /^([A-Za-z][A-Za-z0-9]*)=(.+)$/.exec(v.trim());
  if (!m) throw new ConfigError(`--rule : format attendu nom=valeur (reçu « ${v} »)`);
  const key = m[1]!;
  const raw = m[2]!.trim().toLowerCase();
  if (raw === 'true' || raw === 'oui' || raw === 'vrai') return [key, true];
  if (raw === 'false' || raw === 'non' || raw === 'faux') return [key, false];
  const n = Number(raw);
  if (Number.isFinite(n)) return [key, n];
  throw new ConfigError(`--rule ${key} : valeur booléenne ou numérique attendue (reçu « ${m[2]} »)`);
}

/** Analyse les arguments (sans « node » ni le script). Lève ConfigError si une option est invalide. */
export function parseArgs(argv: string[]): ServerConfig | 'help' {
  const cfg: ServerConfig = {
    port: 19140,
    host: undefined,
    name: 'Serveur Voxelia',
    motd: '',
    seed: null,
    template: 'default',
    invite: null,
    max: 10,
    ops: [],
    defaultPermission: 'member',
    autoOp: true,
    worldDir: 'server/data/monde',
    gameMode: 'survival',
    difficulty: 'normal',
    cheats: false,
    rules: {},
    reach: 12,
    simRadius: 96,
    explicit: new Set(),
  };
  const args = argv.slice();
  while (args.length) {
    let a = args.shift()!;
    let inline: string | null = null;
    const eq = a.indexOf('=');
    if (a.startsWith('--') && eq > 2) {
      inline = a.slice(eq + 1);
      a = a.slice(0, eq);
    }
    const value = (): string => {
      const v = inline ?? args.shift();
      if (v === undefined) throw new ConfigError(`${a} : valeur manquante`);
      return v;
    };
    switch (a) {
      case '-h':
      case '--help':
        return 'help';
      case '--port':
        cfg.port = intOpt(a, value(), 1, 65535);
        break;
      case '--host':
        cfg.host = value().trim() || undefined;
        break;
      case '--name':
        cfg.name = value().trim().slice(0, 64) || cfg.name;
        cfg.explicit.add('name');
        break;
      case '--motd':
        cfg.motd = value().trim().slice(0, 128);
        cfg.explicit.add('motd');
        break;
      case '--seed':
        cfg.seed = value();
        cfg.explicit.add('seed');
        break;
      case '--template': {
        const v = value().trim().toLowerCase();
        if (!(TEMPLATES as readonly string[]).includes(v)) throw new ConfigError(`--template : ${TEMPLATES.join(' | ')} (reçu « ${v} »)`);
        cfg.template = v as TemplateName;
        cfg.explicit.add('template');
        break;
      }
      case '--invite': {
        const v = value().trim();
        if (!v || v.length > 64) throw new ConfigError('--invite : code de 1 à 64 caractères attendu');
        cfg.invite = v;
        break;
      }
      case '--max':
        cfg.max = intOpt(a, value(), 1, 200);
        break;
      case '--ops':
        cfg.ops = value()
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
        break;
      case '--default-permission': {
        const v = value();
        const p = parsePermission(v);
        if (!p) throw new ConfigError(`--default-permission : visitor | member | operator (reçu « ${v} »)`);
        cfg.defaultPermission = p;
        break;
      }
      case '--no-auto-op':
        cfg.autoOp = false;
        break;
      case '--world-dir':
        cfg.worldDir = value();
        break;
      case '--gamemode': {
        const v = value();
        const m = MODE_ALIASES[v.trim().toLowerCase()];
        if (!m) throw new ConfigError(`--gamemode : ${GAME_MODES.join(' | ')} (reçu « ${v} »)`);
        cfg.gameMode = m;
        cfg.explicit.add('gameMode');
        break;
      }
      case '--difficulty': {
        const v = value();
        const d = DIFFICULTY_ALIASES[v.trim().toLowerCase()];
        if (!d) throw new ConfigError(`--difficulty : ${DIFFICULTIES.join(' | ')} (reçu « ${v} »)`);
        cfg.difficulty = d;
        cfg.explicit.add('difficulty');
        break;
      }
      case '--cheats':
        cfg.cheats = true;
        cfg.explicit.add('cheats');
        break;
      case '--no-cheats':
        cfg.cheats = false;
        cfg.explicit.add('cheats');
        break;
      case '--rule': {
        const [k, v] = parseRule(value());
        cfg.rules[k] = v;
        break;
      }
      case '--reach':
        cfg.reach = intOpt(a, value(), 4, 64);
        break;
      case '--sim-radius':
        cfg.simRadius = intOpt(a, value(), 0, 512);
        break;
      default:
        throw new ConfigError(`Option inconnue : ${a} (voir --help)`);
    }
  }
  return cfg;
}
