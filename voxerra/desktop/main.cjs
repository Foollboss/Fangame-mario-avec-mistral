// Voxerra — version de bureau : une fenêtre Chromium qui charge le jeu
// autonome (app/index.html). Les mondes sont enregistrés dans le dossier de
// données de l'application (%APPDATA%\Voxerra sous Windows).
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('node:path');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.commandLine.appendSwitch('ignore-gpu-blocklist');

// une seule instance : les sauvegardes (IndexedDB) ne se partagent pas
if (!app.requestSingleInstanceLock()) app.quit();

let win = null;
let saved = false;

function createWindow() {
  win = new BrowserWindow({
    width: 1280,
    height: 760,
    minWidth: 800,
    minHeight: 500,
    title: 'Voxerra',
    backgroundColor: '#1b1b22',
    icon: path.join(__dirname, 'app', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
      spellcheck: false,
    },
  });
  win.loadFile(path.join(__dirname, 'app', 'index.html'));

  // F11 : plein écran
  win.webContents.on('before-input-event', (event, input) => {
    if (input.type === 'keyDown' && input.key === 'F11') {
      win.setFullScreen(!win.isFullScreen());
      event.preventDefault();
    }
  });
  // liens externes (README, etc.) dans le navigateur
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:/.test(url)) shell.openExternal(url);
    return { action: 'deny' };
  });
  // sauvegarde du monde en cours avant de fermer
  win.on('close', (event) => {
    if (saved) return;
    event.preventDefault();
    const done = () => {
      saved = true;
      win.close();
    };
    const timer = setTimeout(done, 4000);
    win.webContents
      .executeJavaScript('Promise.resolve(window.voxerra && window.voxerra.game && window.voxerra.game.save()).then(() => true, () => false)')
      .catch(() => false)
      .finally(() => {
        clearTimeout(timer);
        done();
      });
  });
  win.on('closed', () => (win = null));
}

// pas de menu : ses raccourcis (Ctrl+R, Ctrl+W…) gêneraient le jeu (Ctrl = courir)
Menu.setApplicationMenu(null);
ipcMain.on('voxerra:quit', () => win?.close());
app.on('second-instance', () => {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.focus();
});
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
