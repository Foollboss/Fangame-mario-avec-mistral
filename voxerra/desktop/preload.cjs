// Pont minimal entre le jeu et l'application : « Quitter le jeu » ferme la fenêtre.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('voxerraHost', {
  platform: 'desktop',
  quit: () => ipcRenderer.send('voxerra:quit'),
});
