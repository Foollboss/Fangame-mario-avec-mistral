# Supersonic Arena 🚗⚽🚀

Un jeu de **football en voitures à réaction** en 3D, inspiré de *Rocket League*, jouable sur **PC** dans le navigateur
(Chrome, Edge ou Firefox) et sur **Android** (APK avec commandes tactiles). Aucun serveur : tout est calculé en local.

## Jouer sur PC Windows (.exe)

1. Télécharge [`SupersonicArena.exe`](SupersonicArena.exe) (sur GitHub : ouvre le fichier puis *Download raw file*).
2. Double-clique dessus : le jeu s'ouvre directement en plein écran dans sa propre fenêtre. Rien à installer, tout le jeu
   est à l'intérieur de ce seul fichier (7 Mo).
3. **F11** passe de plein écran à fenêtre, et le bouton **Quitter le jeu** du menu ferme l'application.

L'exe n'est pas signé numériquement : au premier lancement, Windows peut afficher « Windows a protégé votre
ordinateur ». Clique sur **Informations complémentaires** puis **Exécuter quand même**. Il faut Windows 10 ou 11
(il utilise le moteur Edge WebView2 déjà présent ; s'il manque, le jeu s'ouvre dans ton navigateur). Tes réglages
sont gardés d'une partie à l'autre.

## Installer sur Android (APK)

1. Sur ton téléphone, télécharge [`SupersonicArena.apk`](SupersonicArena.apk) (sur GitHub : ouvre le fichier puis
   *Download raw file*).
2. Ouvre le fichier téléchargé. Android demande d'autoriser l'installation d'applications depuis cette source
   (navigateur ou gestionnaire de fichiers) : accepte, puis **Installer**.
3. Lance **Supersonic Arena** : le jeu s'ouvre en plein écran, en paysage.

Android 8.0 minimum. Commandes tactiles :

- **▲ AVANCER** (vert) et **▼ RECULER** (rouge), à droite : accélérer, freiner et reculer. On peut glisser le pouce
  d'un bouton à l'autre (par exemple d'AVANCER vers BOOST) sans le lever.
- **Moitié gauche de l'écran** : un joystick apparaît sous ton pouce pour **tourner** ; en l'air il dirige le vol
  (haut = monter).
- **Voler** : SAUT puis maintiens BOOST en poussant le joystick vers le haut. **Murs / plafond** : fonce vers un mur.
- **SAUT** (bleu) : saut, et une deuxième pression en tenant le joystick = flip. **BOOST** (orange) : maintiens pour foncer.
- **DÉRAPE** : dérapage au sol, air roll en l'air. **CAM** : caméra balle / voiture. **II** : pause.
  Le bouton *Retour* d'Android met aussi en pause.
- En entraînement libre : **BALLE** replace la balle devant toi, **TIR** te la lance dessus.
- Une manette Bluetooth peut aussi fonctionner.

L'APK est signé avec une clé de test publique (`android/keystore/`) pour pouvoir être réinstallé par-dessus une version
précédente ; ce n'est pas une clé de publication sur le Play Store.

## Lancer le jeu

1. Télécharge le dépôt (bouton *Code → Download ZIP* sur GitHub) et décompresse-le.
2. Ouvre le dossier `rocket-arena/` et **double-clique sur `Jouer.bat`** (Windows : ouvre le jeu en plein écran dans une
   fenêtre dédiée Edge/Chrome) ou directement sur **`index.html`**.
3. En navigateur classique, passe en plein écran avec **F11** (ou le bouton « Plein écran » du menu).

> Le jeu fonctionne hors ligne. Si ton navigateur bloque l'ouverture locale, lance `npx http-server rocket-arena` puis ouvre
> l'adresse affichée.

## Contenu

- **Physique fidèle à Rocket League** : accélération, boost (33 % au coup d'envoi, pastilles de 12 et 100), vitesse supersonique,
  saut modulable, double saut, **flips** (avant, arrière, latéraux, annulation de flip), contrôle aérien (tangage, lacet, air roll),
  « impulsion Psyonix » sur les frappes, rebonds et effets de balle.
- **Arène complète** avec rampes courbes : on peut rouler sur les **murs et le plafond**, entrer dans les cages, 34 pastilles de boost
  aux positions officielles, 3 ambiances (jour, coucher de soleil, nuit).
- **Murs et plafond** : fonce vers un mur, la rampe te fait monter ; continue et tu arrives au plafond. En mode
  « On colle partout » (par défaut), tant que tu roules les roues tiennent au mur et au plafond ; le mode
  « Réaliste (RL) » reprend la vraie physique où l'on tombe du plafond.
- **Voler au nitro** : saute puis maintiens le boost. Avec le **vol assisté** (activé par défaut sur téléphone, option dans
  *Paramètres → Pilotage*), le joystick / stick / W-S dirige directement la voiture (haut = monter) et elle garde son cap
  toute seule ; sans assistance, c'est le contrôle aérien de Rocket League.
- **Modes** : 1c1, 2c2, 3c3 et 4c4 contre l'IA, **écran partagé à 2 joueurs** (avec ou contre ton pote), **entraînement libre**
  (boost illimité, balle replacée ou lancée vers toi pour travailler les aériennes).
- **IA** en 3 niveaux (Recrue, Pro, All-Star) : coups d'envoi, rotations, défense, frappes flip, tirs sautés et **aériennes**.
- **Mode Heatseeker** : après chaque touche, la balle fonce toute seule vers le but adverse, de plus en plus vite.
- **Mutateurs** : boost normal / illimité / désactivé, gravité normale / lunaire / forte.
- **Règles du vrai jeu** : chrono qui démarre à la première touche, fin du match quand la balle touche le sol à 0:00,
  **prolongation** en but en or, démolitions (réapparition en 3 s), explosions de but qui repoussent les voitures.
- **Replays** automatiques des buts (passables avec SAUT), vitesse du tir en km/h, fil d'actions, statistiques
  (buts, passes décisives, arrêts, tirs cadrés, démolitions) et **MVP** en fin de match.
- **Caméra** voiture / balle façon RL, réglable (champ de vision, distance, hauteur, rigidité).
- **Garage** : 4 carrosseries avec leur hitbox (Octane, Dominus, Breakout, Merc), couleur secondaire, couleur de la traînée de boost.
- **Messages rapides** (touches 1 à 8 ou croix directionnelle : « Joli tir ! », « Quel arrêt ! », « Calculé. »…) — les bots
  répondent aussi —, **reset de flip** en touchant la balle avec les roues, vibrations des manettes.
- **Graphismes** : carrosseries lissées avec toit peint et vitres teintées, feux stop, jantes chromées, ombres de contact,
  reflets calculés à partir du ciel de chaque arène, nuages, ville au loin, tribunes couvertes et projecteurs,
  relief de la pelouse, anti-crénelage, bloom, étalonnage des couleurs, traînée de balle rapide.
- Effets : traînées de boost, traînée supersonique, étincelles, explosions, bloom, ombres, sons synthétisés (moteur, boost, frappes,
  klaxon de but, foule) et musique de menu.
- **Clavier/souris entièrement reconfigurable** et support des **manettes** Xbox/PlayStation.

## Commandes par défaut

| Action | Clavier / souris | Manette |
| --- | --- | --- |
| Accélérer / reculer | W / S (ou ↑ / ↓) | RT / LT |
| Diriger, lacet en l'air | A / D (ou ← / →) | Stick gauche |
| Tangage (en l'air) | W / S | Stick gauche haut/bas |
| Sauter, double saut, flip | Espace ou clic droit | A (✕) |
| Boost | Maj gauche ou clic gauche | B (○) ou RB |
| Dérapage / air roll libre | C | X (□) |
| Air roll gauche / droite | Q / E | LB |
| Caméra balle | V ou clic molette | Y (△) |
| Tableau des scores | Tab | Back |
| Pause | Échap ou P | Start |
| Messages rapides | 1 à 8 | Croix directionnelle |
| Entraînement : replacer / lancer la balle | R / T | Croix haut / bas |

Toutes les touches se changent dans **Commandes** (clique sur une touche puis appuie sur la nouvelle).

## Pour les développeurs

Le code source est dans `src/` (modules ES) et compilé en un seul fichier `dist/game.js` par esbuild.

```bash
cd rocket-arena
npm install
npm run build   # recompile dist/game.js
npm run watch   # recompile à chaque modification
npm test        # simule des matchs IA contre IA sans affichage pour vérifier la physique
npm run apk     # recompile le jeu puis l'APK Android (SupersonicArena.apk)
npm run exe     # recompile le jeu puis l'exe Windows (SupersonicArena.exe), avec Go 1.24+
```

L'exe est un petit programme Go (`desktop/`) qui embarque `index.html`, `style.css` et `dist/game.js`, les sert sur
`127.0.0.1` et les affiche dans une fenêtre WebView2 (plein écran, F11, bouton Quitter). Il se compile depuis Linux,
macOS ou Windows. L'icône, le manifeste et les infos de version sont dans `desktop/winres/` ; après les avoir modifiés,
régénère la ressource avec `cd desktop && go run github.com/tc-hib/go-winres@v0.3.3 make --in winres/winres.json --arch amd64`.

Pour `npm run apk`, il faut un JDK 17+ et le SDK Android (plateforme 35, build-tools 35) : indique son chemin dans
`android/local.properties` (`sdk.dir=/chemin/vers/android-sdk`) ou via la variable `ANDROID_HOME`. Le projet
`android/` est une simple application WebView qui embarque `index.html`, `style.css` et `dist/game.js`.

- `src/sim/` : simulation (arène en champ de distance signé, voiture, balle, collisions, règles du match, replays) — tourne à 120 Hz
  et fonctionne aussi dans Node.
- `src/ai/` : intelligence artificielle des bots.
- `src/render/` : rendu Three.js (arène, stade, voitures, particules, caméras).
- `src/ui/`, `src/input/`, `src/audio/` : menus, HUD, clavier/souris/manette/tactile et sons WebAudio.
- `android/` : projet Gradle de l'application Android.
- `desktop/` : lanceur Windows (.exe) en Go.

*Projet de fan non officiel, sans lien avec Psyonix ni Epic Games. Rocket League est une marque de Psyonix LLC.*
