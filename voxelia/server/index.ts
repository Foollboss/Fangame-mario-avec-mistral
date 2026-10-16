/**
 * Point d'entrée du serveur multijoueur Voxelia.
 * Lancement : node --experimental-strip-types server/index.ts [options]   (voir --help)
 */
import { resolve } from 'node:path';
import { attachConsole } from './console.ts';
import { ConfigError, parseArgs, USAGE, type ServerConfig } from './config.ts';
import { logStoreSummary, WorldStore } from './storage.ts';
import { errorText, lanAddresses, log, warn } from './util.ts';
import { permissionLabel, PROTOCOL_VERSION, VoxeliaServer } from './VoxeliaServer.ts';
import { checkRules } from './world.ts';

function fail(msg: string): never {
  process.stderr.write(`Erreur : ${msg}\n`);
  process.exit(2);
}

function readConfig(): ServerConfig {
  try {
    const cfg = parseArgs(process.argv.slice(2));
    if (cfg === 'help') {
      process.stdout.write(USAGE);
      process.exit(0);
    }
    const errors = checkRules(cfg.rules);
    if (errors.length) fail(errors.join('\n'));
    return cfg;
  } catch (e) {
    if (e instanceof ConfigError) fail(e.message);
    throw e;
  }
}

async function main(): Promise<void> {
  const cfg = readConfig();
  const dir = resolve(cfg.worldDir);
  const store = new WorldStore(dir);
  let opened: { created: boolean; notes: string[] };
  try {
    opened = store.open(cfg);
  } catch (e) {
    fail(`impossible d'ouvrir le dossier du monde ${dir} : ${errorText(e)}`);
  }
  for (const n of opened.notes) warn(n);
  const w = store.world;
  log(`${opened.created ? 'Nouveau monde' : 'Monde chargé'} : « ${w.info.name} » · graine ${w.info.seedText} (${w.info.seed}) · type ${w.info.template} · ${store.chunkFileCount} tronçon(s) modifié(s)`);
  log(`Dossier : ${dir}`);

  const server = new VoxeliaServer(cfg, store);
  try {
    await server.start();
  } catch (e) {
    fail(errorText(e));
  }
  // Première écriture : world.json existe dès le démarrage.
  await store.flush();

  const port = cfg.port;
  const suffix = port === 19140 ? '' : `:${port}`;
  log(`Serveur Voxelia prêt (protocole ${PROTOCOL_VERSION}) — port ${port}${cfg.host ? ` sur ${cfg.host}` : ''}`);
  const ips = lanAddresses();
  if (ips.length) {
    log('Adresses à saisir dans Voxelia (Jouer › Serveurs › Ajouter) :');
    for (const ip of ips) log(`  ${ip}${suffix}`);
  } else log(`Aucune adresse réseau local détectée ; sur cette machine : localhost${suffix}`);
  log(
    `Mode ${w.info.gameMode} · difficulté ${w.info.difficulty} · triches ${w.info.cheats ? 'oui' : 'non'} · ${cfg.max} joueurs max · droits par défaut : ${permissionLabel(cfg.defaultPermission)}` +
      (cfg.invite ? ' · code d’invitation exigé' : ' · sans code d’invitation'),
  );
  if (!cfg.invite) warn('aucun code d’invitation : toute personne qui connaît l’adresse peut entrer (option --invite).');
  log('Tapez « aide » pour la liste des commandes, Ctrl+C pour arrêter.');

  let stopping = false;
  const shutdown = (why: string) => {
    if (stopping) {
      warn('arrêt forcé.');
      process.exit(1);
    }
    stopping = true;
    log(`Arrêt du serveur (${why})…`);
    server
      .stop()
      .then(() => {
        logStoreSummary(store);
        log('Monde enregistré. Au revoir.');
        process.exit(0);
      })
      .catch((e) => {
        warn(`erreur à l'arrêt : ${errorText(e)}`);
        process.exit(1);
      });
  };
  process.on('SIGINT', () => shutdown('Ctrl+C'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGHUP', () => shutdown('SIGHUP'));
  process.on('uncaughtException', (e) => {
    warn(`erreur inattendue : ${e.stack ?? errorText(e)}`);
    shutdown('erreur');
  });
  process.on('unhandledRejection', (e) => warn(`promesse rejetée : ${errorText(e)}`));
  attachConsole(server, () => shutdown('commande arreter'));
}

void main();
