/**
 * Console d'administration du serveur (entrée standard) : liste des joueurs, messages,
 * permissions, expulsions, heure, sauvegarde et arrêt.
 */
import { createInterface } from 'node:readline';
import { parsePermission } from './config.ts';
import { logStoreSummary } from './storage.ts';
import { errorText, log, sanitizeChat } from './util.ts';
import { permissionLabel, type VoxeliaServer } from './VoxeliaServer.ts';

const HELP = `Commandes :
  aide                         cette aide
  liste                        joueurs connectés
  dire <message>               message à tous les joueurs
  op <nom> / deop <nom>        donne ou retire les droits d'opérateur
  permission <nom> <droit>     visiteur | membre | operateur
  expulser <nom> [raison]      déconnecte un joueur
  heure <tics|jour|midi|nuit|minuit>  règle l'heure du monde
  sauver                       écrit le monde sur le disque
  stats                        compteurs du serveur
  arreter                      enregistre puis arrête le serveur`;

const TIME_WORDS: Record<string, number> = { jour: 1000, day: 1000, midi: 6000, noon: 6000, nuit: 13000, night: 13000, minuit: 18000, midnight: 18000 };

/** Branche la console ; `shutdown` est appelé par « arreter ». */
export function attachConsole(server: VoxeliaServer, shutdown: () => void): void {
  if (!process.stdin.readable) return;
  const rl = createInterface({ input: process.stdin, terminal: false });
  rl.on('line', (line) => {
    try {
      run(server, line.trim(), shutdown);
    } catch (e) {
      log(`Commande impossible : ${errorText(e)}`);
    }
  });
  // Entrée fermée (service, redirection) : le serveur continue sans console.
  rl.on('close', () => undefined);
}

function run(server: VoxeliaServer, line: string, shutdown: () => void): void {
  if (!line) return;
  const [cmdRaw, ...rest] = line.replace(/^\//, '').split(/\s+/);
  const cmd = (cmdRaw ?? '').toLowerCase();
  const arg = rest.join(' ');
  switch (cmd) {
    case 'aide':
    case 'help':
    case '?':
      process.stdout.write(HELP + '\n');
      return;
    case 'liste':
    case 'list': {
      const list = server.players();
      if (!list.length) return log('Aucun joueur connecté.');
      log(`${list.length}/${server.cfg.max} joueur(s) :`);
      for (const p of list) log(`  #${p.id} ${p.name} — ${permissionLabel(p.permission)} — ${p.ip} — depuis ${Math.round((Date.now() - p.since) / 60000)} min`);
      return;
    }
    case 'dire':
    case 'say': {
      const text = sanitizeChat(arg);
      if (!text) return log('Utilisation : dire <message>');
      server.systemChat(`[Serveur] ${text}`);
      log(`[Serveur] ${text}`);
      return;
    }
    case 'op':
    case 'deop':
    case 'permission': {
      const name = rest[0] ?? '';
      const p = cmd === 'op' ? 'operator' : cmd === 'deop' ? 'member' : parsePermission(rest[1] ?? '');
      if (!name || !p) return log(cmd === 'permission' ? 'Utilisation : permission <nom> <visiteur|membre|operateur>' : `Utilisation : ${cmd} <nom>`);
      if (p !== 'operator' && server.isCliOp(name)) return log(`${name} est opérateur par l'option --ops : relancez le serveur sans ce nom.`);
      const key = server.setPermission(name, p);
      if (!key) return log('Nom invalide.');
      log(`Droits de ${name} : ${permissionLabel(p)} (enregistré dans world.json).`);
      return;
    }
    case 'expulser':
    case 'kick': {
      const name = rest[0] ?? '';
      if (!name) return log('Utilisation : expulser <nom> [raison]');
      const reason = sanitizeChat(rest.slice(1).join(' ')) || 'Vous avez été expulsé du serveur.';
      if (!server.kickByName(name, reason)) log(`${name} n'est pas connecté.`);
      return;
    }
    case 'heure':
    case 'time': {
      const w = arg.toLowerCase();
      const v = w in TIME_WORDS ? TIME_WORDS[w]! : Number(w);
      if (!w || !Number.isFinite(v)) return log('Utilisation : heure <0-23999 | jour | midi | nuit | minuit>');
      server.setTime(v, server.store.world.day);
      log(`Heure réglée sur ${Math.floor(server.store.world.time)}.`);
      return;
    }
    case 'sauver':
    case 'save':
      void server
        .saveNow()
        .then(() => log('Monde enregistré.'))
        .catch((e) => log(`Enregistrement impossible : ${errorText(e)}`));
      return;
    case 'stats': {
      const s = server.stats;
      log(`Connexions : ${s.connections} · joueurs : ${server.playerCount}/${server.cfg.max} · blocs modifiés : ${s.blocks} · messages de chat : ${s.chats}`);
      log(`Refus : ${s.denied} · limités : ${s.rateLimited} · JSON invalides : ${s.invalidJson} · types inconnus : ${s.unknownType} · champs invalides : ${s.invalidFields} · trop gros : ${s.oversize} · expulsions : ${s.kicked} · erreurs : ${s.handlerErrors}`);
      log(`Tronçons enregistrés : ${server.store.chunkFileCount} · en attente d'écriture : ${server.store.pendingChunks}`);
      logStoreSummary(server.store);
      return;
    }
    case 'arreter':
    case 'arrêter':
    case 'stop':
    case 'quit':
      shutdown();
      return;
    default:
      log(`Commande inconnue « ${cmd} » (tapez « aide »).`);
  }
}
