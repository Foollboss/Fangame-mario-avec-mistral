# Supersonic Arena 🚗⚽🚀

Un jeu de **football en voitures à réaction** en 3D, inspiré de *Rocket League*, jouable sur **PC** directement dans le navigateur
(Chrome, Edge ou Firefox). Aucune installation, aucun serveur : tout est calculé en local.

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
- **Modes** : 1c1, 2c2, 3c3 et 4c4 contre l'IA, **écran partagé à 2 joueurs** (avec ou contre ton pote), **entraînement libre**
  (boost illimité, balle replacée ou lancée vers toi pour travailler les aériennes).
- **IA** en 3 niveaux (Recrue, Pro, All-Star) : coups d'envoi, rotations, défense, frappes flip, tirs sautés et **aériennes**.
- **Mutateurs** : boost normal / illimité / désactivé, gravité normale / lunaire / forte.
- **Règles du vrai jeu** : chrono qui démarre à la première touche, fin du match quand la balle touche le sol à 0:00,
  **prolongation** en but en or, démolitions (réapparition en 3 s), explosions de but qui repoussent les voitures.
- **Replays** automatiques des buts (passables avec SAUT), vitesse du tir en km/h, fil d'actions, statistiques
  (buts, passes décisives, arrêts, tirs cadrés, démolitions) et **MVP** en fin de match.
- **Caméra** voiture / balle façon RL, réglable (champ de vision, distance, hauteur, rigidité).
- **Garage** : 4 carrosseries avec leur hitbox (Octane, Dominus, Breakout, Merc), couleur secondaire, couleur de la traînée de boost.
- **Messages rapides** (touches 1 à 8 ou croix directionnelle : « Joli tir ! », « Quel arrêt ! », « Calculé. »…) — les bots
  répondent aussi —, **reset de flip** en touchant la balle avec les roues, vibrations des manettes.
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
```

- `src/sim/` : simulation (arène en champ de distance signé, voiture, balle, collisions, règles du match, replays) — tourne à 120 Hz
  et fonctionne aussi dans Node.
- `src/ai/` : intelligence artificielle des bots.
- `src/render/` : rendu Three.js (arène, stade, voitures, particules, caméras).
- `src/ui/`, `src/input/`, `src/audio/` : menus, HUD, clavier/souris/manette et sons WebAudio.

*Projet de fan non officiel, sans lien avec Psyonix ni Epic Games. Rocket League est une marque de Psyonix LLC.*
