/** Point d'entrée du client Voxerra. */
import { App } from './app/app';
import { handleTransfer } from './app/transfer';

// Lanceur Windows : récupération des mondes de l'ancienne version avant de démarrer.
handleTransfer()
  .then((start) => (start ? new App().boot() : undefined))
  .catch((e) => {
    console.error(e);
    document.body.insertAdjacentHTML('beforeend', `<pre style="color:#f88;position:fixed;top:10px;left:10px;font:14px monospace">Erreur au démarrage :\n${String(e?.stack ?? e)}</pre>`);
  });
