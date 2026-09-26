# Architecture

```
src/
  core/       Config (constantes), EventBus, MathUtil (RNG déterministe…)
  physics/    ArenaCollision (rectangles orientés + sol/plafond), CollisionSystem (voiture↔balle, voiture↔voiture)
  game/       World, Car, VehiclePhysics, VehicleController, BallController, BallPredictor,
              BoostSystem, GoalManager, ScoreManager, MatchManager, ReplaySystem, TrainingManager, Vehicles
  ai/         BotAI (+ TeamBrain : rôles d'équipe)
  input/      MobileInput (tactile + éditeur de disposition), KeyboardInput/GamepadInput, InputRouter
  render/     GameRenderer, Quality, MatchView, ArenaBuilder, Themes, CarModelFactory, CarView,
              BallView, Particles, Trails, Effects, CameraController, Showroom, Textures
  meta/       SaveSystem, Settings, Catalog, CustomizationSystem, GarageSystem, ProgressionSystem, TournamentSystem
  audio/      AudioManager (synthèse WebAudio, musique séquencée)
  ui/         UIManager (écrans), HUD, styles.css
  platform/   Platform (pont Android, vibration, plein écran, encoches, bouton retour)
  main.js     Game : boucle, sessions de jeu, câblage des événements
tools/        build.mjs (bundle HTML unique), simtest.mjs (tests headless)
android/      Projet Gradle : WebView plein écran + pont natif
```

## Couches

1. **Simulation** (`core`, `physics`, `game`, `ai`) : aucune dépendance au DOM, à WebGL ou à l'audio. Elle n'importe de Three.js que les classes mathématiques (`Vector3`, `Quaternion`). Elle tourne à l'identique dans le navigateur et sous Node (`tools/simtest.mjs` joue des matchs complets entre bots).
2. **Présentation** (`render`, `ui`, `audio`) : lit l'état du `World` et s'abonne à ses événements (`goal`, `ballTouch`, `demolish`, `boostPickup`…). Elle ne modifie jamais la physique.
3. **Méta** (`meta`) : progression, cosmétiques, sauvegarde. Les cosmétiques ne sont lus que par la présentation.

## Boucle

- `requestAnimationFrame` → `Game.frameSession(dt)`.
- Le temps réel (multiplié par `timeScale` pour le ralenti de but) alimente un accumulateur ; la simulation avance par **pas fixes de 1/120 s** (`World.step`).
- À chaque pas : prédiction de balle (tous les 4 pas), rôles d'équipe, entrées (joueur + bots), `World.step`, puis règles du match (`MatchManager.simStep`).
- Le rendu lit l'état final ; les transitions « temps réel » (compte à rebours, ralenti, replay) sont gérées par `MatchManager.update`.

## Entrées

Chaque voiture reçoit à chaque pas un **`ControllerState`** : `{ steer, pitch, throttle, jump, boost, dash, dodgeX, dodgeY }` — uniquement des états maintenus. Les fronts (appui) sont dérivés dans `VehicleController`, ce qui permet d'envoyer la même structure par le réseau sans perte d'événements.

Sources : `MobileInput` (tactile), `KeyboardInput`, `GamepadInput`, fusionnées par `InputRouter` ; les bots produisent la même structure.

## Physique

- **Arène** : ensemble de rectangles orientés à une face (murs, coins coupés, murs de fond découpés autour des buts, intérieur des buts) + sol et plafond analytiques. Collision sphère/rectangle par point le plus proche : les poteaux et la transversale deviennent naturellement des bords arrondis. Les jonctions concaves sont prolongées pour éviter les accrochages.
- **Voiture** : au sol, cap (yaw) + vitesse longitudinale + forte adhérence latérale ; courbe de virage dépendant de la vitesse ; en l'air, corps libre avec contrôle direct de la vitesse angulaire, boost dans l'axe, dash = impulsion + rotation complète scriptée. Collision avec l'arène par capsule (2 sphères), boîte orientée contre la balle.
- **Balle** : gravité, traînée, vitesse max, restitution, frottement tangentiel, roulement, rotation visuelle.
- **Contact voiture/balle** : impulsion physique (masses, faible restitution) + impulsion « arcade » dépendant de la vitesse relative, orientée surtout dans l'axe voiture→balle (hauteur atténuée), une fois par contact. Résultat : tirs puissants et lisibles, dribbles possibles.

## IA

- `BallPredictor` simule la balle 4 s en avance (sans voitures).
- `TeamBrain` estime pour chaque membre de l'équipe (humain compris) le premier point d'interception atteignable et attribue les rôles attaquant / défenseur / soutien avec hystérésis.
- `BotAI` décide à la fréquence de son niveau (réaction), puis pilote à chaque pas : approche en courbe sur la ligne de tir, vitesse limitée par le rayon de virage, sauts/dashs synchronisés sur le temps de contact, aériens (accélération requise → orientation + boost), arrêts (course vers la ligne de but), gardien, dégagements latéraux, passes centrées, collecte de boost, contournement de la balle pour ne pas marquer contre son camp, anti-blocage.
- La difficulté règle : réaction, précision, horizon de prédiction, vitesse de croisière, usage du boost, sauts/dashs/aériens, discipline de rôle.

`npm run sim` vérifie que les matchs se terminent, que rien ne sort de l'arène, et que les niveaux supérieurs battent les inférieurs.

## Multijoueur (préparé, non implémenté)

Ce qui existe déjà et servira tel quel :

- Simulation **déterministe à pas fixe** sans rendu (exécutable sur un serveur Node).
- **Entrées sérialisables** (`ControllerState`, états maintenus uniquement).
- **Snapshots compacts** : `World.serialize()` / `World.applySnapshot()` (Float32Array), déjà utilisés par le système de replay.
- **Événements** de jeu découplés (EventBus) : l'UI réagit aux mêmes événements qu'ils viennent du local ou du serveur.
- Graine aléatoire par match (`createRng`) pour reproduire les engagements.

Plan d'intégration proposé :

1. Serveur autoritaire Node : une instance de `World` + `MatchManager` par partie, 120 Hz, diffusion de snapshots à 30 Hz.
2. Client : envoie ses `ControllerState` numérotés ; prédiction locale de sa voiture, réconciliation sur snapshot, interpolation des autres voitures et de la balle.
3. Services : matchmaking / salons / amis / classement dans un service séparé ; reconnexion = reprise du flux de snapshots avec l'identifiant de voiture.
4. Remplacer `BotAI` par le flux réseau pour les joueurs humains, garder les bots pour compléter les équipes.

## Sauvegarde

`SaveSystem` sérialise un objet versionné (`version`, `profile`, `stats`, `unlocked`, `equipped`, `settings`, `tournament`…) via un backend `{ load(), save(str) }`. Backends fournis : `LocalStorageBackend` (par défaut, persistant dans la WebView Android) et `MemoryBackend`. Un backend cloud n'a qu'à implémenter la même interface ; la fusion avec les valeurs par défaut et `migrate()` gèrent les évolutions de format.

## Performance

- Qualité BASSE / MOYENNE / HAUTE : résolution interne, anticrénelage, particules, densité de foule, taille de texture du terrain, map d'environnement.
- Détection initiale par le nom du GPU (Adreno, Mali, PowerVR…), cœurs et mémoire, puis **descente automatique** d'un cran si les FPS restent sous le seuil.
- Géométries statiques fusionnées, foule en `InstancedMesh` animée dans le shader, particules en un seul `Points` par système, ombres portées remplacées par des ombres « blob », aucune texture téléchargée (tout est généré au lancement).
