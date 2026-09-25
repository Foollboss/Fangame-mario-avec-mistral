/**
 * Serveur dédié Voxerra (Node.js) : `npm run server -- --port 25590 --monde MonMonde --graine 1234`.
 *
 * Options :
 *   --port <n>          port WebSocket (25590 par défaut)
 *   --monde <nom>       nom/identifiant du monde (« serveur » par défaut, dossier dans --dossier)
 *   --graine <texte>    graine d'un nouveau monde
 *   --mode <survie|creatif|hardcore>
 *   --difficulte <0-3>
 *   --distance <n>      rayon de colonnes envoyées (6 par défaut)
 *   --commandes         autorise les commandes pour tous les joueurs
 *   --dossier <chemin>  dossier des sauvegardes (./saves)
 *   --motd <texte>      message d'accueil
 */
import { WebSocketServer } from 'ws';
import fs from 'node:fs';
import path from 'node:path';
import { Content, BASE_PACK, mergePacks } from '../src/registry/content';
import { applyBiomeOverrides } from '../src/worldgen/biomes';
import { seedFromString } from '../src/engine/rng';
import { validatePack } from '../src/app/mods';
import type { ContentPack } from '../src/registry/types';
import type { WorldMeta } from '../src/save/storage';
import { FileStorage } from './fileStorage';
import { GameServer, newServerMeta } from './gameServer';
import { DEFAULT_PORT } from '../src/net/protocol';
import { TICK } from '../src/sim/sim';

function args(): Record<string, string | true> {
  const out: Record<string, string | true> = {};
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (!a[i].startsWith('--')) continue;
    const k = a[i].slice(2);
    const v = a[i + 1];
    if (v === undefined || v.startsWith('--')) out[k] = true;
    else {
      out[k] = v;
      i++;
    }
  }
  return out;
}

/** Packs de contenu du dossier public/mods (mêmes mods que les clients). */
function loadModPacks(): ContentPack[] {
  const dir = path.resolve(import.meta.dirname ?? '.', '../public/mods');
  const packs: ContentPack[] = [];
  try {
    const index = JSON.parse(fs.readFileSync(path.join(dir, 'index.json'), 'utf8')) as { packs: string[] };
    for (const f of index.packs ?? []) {
      const pack = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      const err = validatePack(pack);
      if (err) console.warn(`[mods] ${f} ignoré : ${err}`);
      else packs.push(pack);
    }
  } catch (e) {
    console.warn('[mods] aucun mod chargé :', (e as Error).message);
  }
  return packs;
}

function main(): void {
  const a = args();
  const port = Number(a.port ?? DEFAULT_PORT);
  const worldName = String(a.monde ?? a.world ?? 'serveur');
  const id = worldName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const storage = new FileStorage(path.resolve(String(a.dossier ?? 'saves')));
  const packs = loadModPacks();
  const pack = mergePacks([BASE_PACK, ...packs]);
  applyBiomeOverrides(pack.biomes);
  const content = new Content(pack);
  let meta: WorldMeta | null = storage.loadMetaSync(id);
  if (!meta) {
    const seedText = String(a.graine ?? a.seed ?? '');
    const gm = String(a.mode ?? 'survie') as WorldMeta['gameMode'];
    meta = newServerMeta(id, worldName, seedFromString(seedText), seedText, ['survie', 'creatif', 'hardcore'].includes(gm) ? gm : 'survie', Number(a.difficulte ?? 2));
    console.log(`[serveur] nouveau monde « ${worldName} » (graine ${meta.seed})`);
  } else console.log(`[serveur] monde « ${meta.name} » chargé (graine ${meta.seed})`);
  if (a.commandes) meta.allowCommands = true;
  const server = new GameServer(content, meta, storage, {
    radius: Number(a.distance ?? 6),
    motd: typeof a.motd === 'string' ? a.motd : `Bienvenue sur ${worldName} !`,
  });
  server.save();

  const wss = new WebSocketServer({ port, maxPayload: 1 << 20 });
  wss.on('connection', (ws, req) => {
    const client = server.connect({ send: (d) => ws.readyState === ws.OPEN && ws.send(d), close: () => ws.close() });
    console.log(`[serveur] connexion de ${req.socket.remoteAddress}`);
    ws.on('message', (data) => server.handle(client, data.toString()));
    ws.on('close', () => server.disconnect(client));
    ws.on('error', () => server.disconnect(client));
  });
  console.log(`[serveur] Voxerra écoute sur ws://0.0.0.0:${port} — ${packs.length} mod(s)`);

  // Boucle à 20 ticks par seconde (rattrapage limité)
  let last = performance.now();
  let acc = 0;
  const loop = setInterval(() => {
    const now = performance.now();
    acc += (now - last) / 1000;
    last = now;
    let n = 0;
    while (acc >= TICK && n < 4) {
      server.tick();
      acc -= TICK;
      n++;
    }
    if (acc > TICK * 10) acc = 0;
  }, 10);

  const stop = () => {
    console.log('\n[serveur] arrêt…');
    clearInterval(loop);
    server.stop();
    wss.close();
    process.exit(0);
  };
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

main();
