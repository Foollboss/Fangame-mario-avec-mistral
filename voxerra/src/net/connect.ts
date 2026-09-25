/** Connexion à un serveur multijoueur (voir net/client.ts). */
import type { App } from '../app/app';
import type { Game } from '../game/game';
import type { LoadingHandle } from '../ui/screens/menus';

export async function connectToServer(app: App, address: string, name: string, loading: LoadingHandle): Promise<Game> {
  void app;
  void name;
  void loading;
  throw new Error(`Serveur injoignable (${address})`);
}
