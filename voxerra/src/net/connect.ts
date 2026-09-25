/** Connexion à un serveur multijoueur (voir net/client.ts et server/). */
import type { App } from '../app/app';
import { Game } from '../game/game';
import type { LoadingHandle } from '../ui/screens/menus';
import type { WorldMeta } from '../save/storage';
import { DEFAULT_RULES } from '../save/storage';
import { RemoteSession } from './client';
import { DEFAULT_PORT } from './protocol';

/** « hote », « hote:port » ou « ws(s)://… » → URL WebSocket. */
export function normalizeAddress(address: string): string {
  let a = address.trim();
  if (!/^wss?:\/\//i.test(a)) a = 'ws://' + a;
  const u = new URL(a);
  if (!u.port) u.port = String(DEFAULT_PORT);
  return u.toString().replace(/\/$/, '');
}

export async function connectToServer(app: App, address: string, name: string, loading: LoadingHandle): Promise<Game> {
  const url = normalizeAddress(address);
  loading.set(`Connexion à ${url}…`, 0, 1);
  const session = await RemoteSession.connect(url, name);
  const w = session.welcome;
  loading.set('Préparation…', 0, 1);
  await app.initPool(w.world.seed, w.world.worldType, w.world.structures);
  const meta: WorldMeta = {
    id: 'distant:' + url,
    name: w.world.name,
    seed: w.world.seed,
    seedText: w.world.seedText,
    version: 1,
    created: 0,
    lastPlayed: Date.now(),
    gameMode: w.world.gameMode as WorldMeta['gameMode'],
    difficulty: w.world.difficulty,
    allowCommands: false,
    worldType: w.world.worldType as WorldMeta['worldType'],
    structures: w.world.structures,
    bonusChest: false,
    rules: { ...DEFAULT_RULES, ...w.world.rules },
    time: w.world.time,
    weather: { state: 'clair', timer: 9000 },
    spawn: null,
    player: null,
    dimension: String(w.player.dim ?? 'surface'),
    portals: [],
    advancements: [],
    stats: {},
    bosses: [],
    playTime: 0,
  };
  const game = new Game(app, meta, false);
  session.onClose = (reason) => app.disconnected(reason);
  try {
    await game.loadRemote(loading, session);
  } catch (e) {
    session.close();
    await game.dispose(false);
    throw e;
  }
  return game;
}
