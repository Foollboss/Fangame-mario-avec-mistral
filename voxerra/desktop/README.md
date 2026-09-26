# Voxerra — version Windows (.exe)

Une fenêtre [Electron](https://www.electronjs.org/) (Chromium intégré) qui charge le jeu autonome
(`app/index.html`, produit par `scripts/build-html.mjs`). Aucune installation : le fichier
`Voxerra-1.0.0-Windows.exe` se lance directement (Windows 10 ou 11, 64 bits).

- Mondes et réglages : dans `%APPDATA%\Voxerra` (conservés d'une version à l'autre).
- `F11` : plein écran. « Quitter le jeu » ferme l'application ; fermer la fenêtre sauvegarde le monde en cours.
- Pas de menu Electron : ses raccourcis (`Ctrl+R`, `Ctrl+W`…) gêneraient le jeu (`Ctrl` = courir).

## Construire

```bash
cd voxerra
npm install
npm run build:exe          # → desktop/dist/Voxerra-1.0.0-Windows.exe
```

La construction marche aussi depuis Linux ou macOS (electron-builder, cible `portable`, sans Wine).
L'exécutable n'est pas signé : Windows SmartScreen peut afficher « Windows a protégé votre ordinateur »
→ **Informations complémentaires** → **Exécuter quand même**.

## Essayer

```bash
cd voxerra/desktop
npm start                  # lance l'application sur la machine actuelle
xvfb-run -a node test-electron.mjs   # essai automatique (Linux) : sauvegarde à la fermeture, relance, Quitter
```

Icônes : `desktop/build/icon.ico` et `icon.png`, générées par `npm run icons` depuis l'icône du bloc d'herbe du jeu.
