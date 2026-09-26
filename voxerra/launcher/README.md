# Voxerra.exe — lanceur Windows léger (≈ 7 Mo)

Un petit programme Go (sans console) qui contient le jeu autonome, le sert sur
`http://127.0.0.1:47183` et l'ouvre dans une **fenêtre d'application Microsoft Edge** (présent sur
Windows 10 et 11 ; sinon Google Chrome, sinon le navigateur par défaut).

- L'adresse est fixe : les mondes, gardés par le navigateur (IndexedDB), se retrouvent à chaque lancement.
- « Quitter le jeu » ferme la fenêtre et arrête le lanceur ; il s'arrête aussi tout seul quand la fenêtre est fermée.
- `Ctrl` sert à courir : `Ctrl+W` ne ferme jamais la fenêtre et, en jeu, les autres raccourcis du navigateur
  (`Ctrl+R`, `Ctrl+1`…`9`…) sont ignorés. Pendant une partie, la croix de la fenêtre demande confirmation.
- Relancer `Voxerra.exe` alors qu'il tourne déjà ouvre simplement une nouvelle fenêtre.

Pour une application entièrement autonome (Chromium intégré, ≈ 90 Mo), voir [`../desktop`](../desktop).

## Construire

```bash
cd voxerra
npm install
npm run build:launcher     # → launcher/dist/Voxerra.exe (Go 1.24+ requis, depuis Linux, macOS ou Windows)
```

Icône et informations de version : [go-winres](https://github.com/tc-hib/go-winres), installé automatiquement.
L'exécutable n'est pas signé : SmartScreen peut demander **Informations complémentaires → Exécuter quand même**.

## Essayer (Linux)

```bash
cd voxerra/launcher
node ../scripts/build-html.mjs game/index.html && go build -o dist/voxerra-test .
xvfb-run -a node test-launcher.mjs   # Chromium à la place d'Edge : partie, sauvegarde, Quitter, relance
xvfb-run -a node test-raccourcis.mjs # vraies touches (xdotool) : Ctrl+W, Ctrl+R, molette avec Ctrl / Maj / Z
```
