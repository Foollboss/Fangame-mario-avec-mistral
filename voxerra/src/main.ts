/** Point d'entrée du client Voxerra. */
import { App } from './app/app';

new App().boot().catch((e) => {
  console.error(e);
  document.body.insertAdjacentHTML('beforeend', `<pre style="color:#f88;position:fixed;top:10px;left:10px;font:14px monospace">Erreur au démarrage :\n${String(e?.stack ?? e)}</pre>`);
});
