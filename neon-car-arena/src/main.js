import './ui/styles.css';
import { Game } from './Game.js';

const game = new Game({
  canvas: document.getElementById('game'),
  uiRoot: document.getElementById('ui'),
  touchRoot: document.getElementById('touch'),
});
window.__game = game; // accès de débogage / tests automatisés

// Hors-ligne et installation (PWA) quand le jeu est servi en HTTP(S) avec le service worker.
if ('serviceWorker' in navigator && location.protocol.startsWith('http') && !import.meta.env.DEV && import.meta.env.MODE !== 'single') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
