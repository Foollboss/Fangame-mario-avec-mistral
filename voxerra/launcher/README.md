# Voxerra.exe — lanceur léger pour Windows (≈ 8 Mo)

Un petit programme Go (sans console) qui contient le jeu autonome, le sert sur
`http://127.0.0.1:47183` et l'affiche dans **sa propre fenêtre** : une fenêtre Windows ordinaire
(titre « Voxerra », icône, redimensionnable) avec **WebView2**, le moteur d'Edge fourni avec Windows 10
et 11 ([`native_windows.go`](native_windows.go)). Pas de barre d'adresse, de menu ni de raccourcis de
navigateur ; clic droit, zoom et outils de développement sont désactivés.

- **F11** : plein écran sans bordure (et retour). La fenêtre retrouve sa place et sa taille (ou son état
  « agrandie ») au lancement suivant ; réduite, le jeu se met en pause et sauvegarde.
- La croix (ou `Alt+F4`, ou **Quitter le jeu**) sauvegarde le monde en cours — et la partie ouverte au
  réseau — puis ferme la fenêtre et arrête le lanceur.
- Les mondes et réglages sont gardés dans `%LOCALAPPDATA%\Voxerra\WebView2`.
- Relancer `Voxerra.exe` alors qu'il tourne déjà ramène simplement la fenêtre au premier plan.
- Sans WebView2 (Windows 10 jamais mis à jour), le lanceur se rabat sur une fenêtre d'application
  Microsoft Edge (sinon Chrome, sinon le navigateur par défaut), comme les premières versions.
- **Mondes de l'ancienne version** : avant, le jeu s'affichait dans une fenêtre Edge et les mondes étaient
  rangés dans le profil d'Edge. Au premier lancement, la nouvelle fenêtre les récupère seule
  ([`transfer.go`](transfer.go), [`../src/app/transfer.ts`](../src/app/transfer.ts)) : le lanceur ouvre
  quelques secondes l'ancienne fenêtre Edge, qui lit mondes et réglages et les envoie à la nouvelle. Rien
  n'est effacé côté Edge, et une copie est gardée (`%LOCALAPPDATA%\Voxerra\ancienne-version.json`).
  **Options → Récupérer les mondes de l'ancienne version** relance la récupération.
- **Ouvrir au réseau local** (menu pause) : le lanceur relaie les amis du même Wi-Fi vers le serveur intégré à la
  page du jeu ([`lan.go`](lan.go)). Il ouvre le port 25590 (WebSocket) le temps de la partie, l'annonce sur le
  port UDP 25591 et liste les parties des autres (`/lan/parties`) dans **Multijoueur**. Seule la page du jeu peut
  ouvrir une partie (origine vérifiée). Windows demande d'autoriser Voxerra sur le réseau : accepter (réseaux privés).

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

Sous Linux, le lanceur s'affiche dans Chromium en mode application (l'affichage de secours) :

```bash
cd voxerra/launcher
node ../scripts/build-html.mjs game/index.html && go build -o dist/voxerra-test .
xvfb-run -a node test-launcher.mjs   # partie, sauvegarde, Quitter, relance
xvfb-run -a node test-raccourcis.mjs # vraies touches (xdotool) : Ctrl+W, Ctrl+R, molette avec Ctrl / Maj / Z
xvfb-run -a node test-minage.mjs     # vrais clics (xdotool) : le minage s'arrête au relâchement, même perdu en route
xvfb-run -a node test-lan.mjs        # partie ouverte au réseau, à deux navigateurs : découverte, rejoindre,
                                     # déplacements en temps réel, blocs, discussion, départ de l'hôte, sauvegarde
xvfb-run -a node test-transfert.mjs  # mondes de l'ancienne version (profil A) récupérés par la nouvelle fenêtre (profil B)
```

La fenêtre native s'essaie avec Wine (création, taille minimale, plein écran, premier plan, fermeture,
position retrouvée) :

```bash
GOOS=windows go test -c -o fenetre_test.exe && xvfb-run -a wine64 fenetre_test.exe -test.v
```

Variables utiles : `VOXERRA_NAVIGATEUR=1` (forcer la fenêtre Edge), `VOXERRA_DEBUG=1` (clic droit et outils de
développement dans la fenêtre native), `VOXERRA_WEBVIEW2=<dossier>` (WebView2 « version fixe »),
`VOXERRA_DONNEES=<dossier>` (à la place de `%LOCALAPPDATA%\Voxerra`).
