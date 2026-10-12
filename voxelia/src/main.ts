/**
 * Point d'entrée de Voxelia : vérifie WebGL2 puis démarre l'application.
 */
import { App } from './core/App';

function fatal(message: string): void {
  const ui = document.getElementById('ui');
  if (!ui) return;
  ui.innerHTML = '';
  const box = document.createElement('div');
  box.className = 'modal-back';
  box.innerHTML = '<div class="modal"><div class="modal-title">Voxelia ne peut pas démarrer</div><div class="modal-body"></div></div>';
  box.querySelector('.modal-body')!.textContent = message;
  ui.appendChild(box);
}

function hasWebGL2(): boolean {
  try {
    const c = document.createElement('canvas');
    return !!c.getContext('webgl2');
  } catch {
    return false;
  }
}

if (!hasWebGL2()) {
  fatal('Votre appareil ou navigateur ne prend pas en charge WebGL 2, nécessaire pour afficher le monde en 3D.');
} else {
  try {
    const app = new App();
    (window as unknown as { voxelia: App }).voxelia = app;
    void app.start();
  } catch (e) {
    console.error(e);
    fatal(String((e as Error)?.message ?? e));
  }
}
