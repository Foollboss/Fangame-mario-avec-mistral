# NEON CAR ARENA

Jeu mobile de **football automobile arcade en 3D** : pousser une énorme balle dans le but adverse avec une voiture capable d'accélérer, sauter, faire un double saut, booster, dasher et voler.
Identité, arènes, véhicules, noms, interface et sons sont **originaux** (aucun élément repris d'un jeu existant).

Le jeu est **réellement jouable** : `MENU → MATCH → CONTRÔLE → PHYSIQUE → BALLE → BUT → SCORE → FIN → RÉSULTATS → MENU`.

## Pourquoi pas Unity ?

L'environnement dans lequel le projet a été construit est un conteneur Linux sans interface graphique, sans éditeur Unity ni licence, et sans SDK Android : un projet Unity généré ici n'aurait jamais pu être ouvert, compilé ni testé, donc aucune garantie qu'il fonctionne.
L'alternative retenue est **Three.js (WebGL) + JavaScript, construit avec Vite** :

- le jeu tourne tout de suite dans le navigateur d'un smartphone Android ou iPhone (et sur PC) ;
- il s'installe comme une application (PWA : plein écran, paysage, hors ligne) ;
- il peut être empaqueté en application Android/iOS native avec **Capacitor** (voir plus bas) ;
- tout a été testé ici : tests de simulation sous Node et tests de bout en bout dans Chromium en mode smartphone tactile.

## Lancer le jeu

```bash
cd neon-car-arena
npm install
npm run dev        # serveur de dev, accessible depuis le téléphone sur le même Wi-Fi (http://IP:5173)
npm run build      # version optimisée dans dist/ (hébergement statique)
npm run build:single   # un seul fichier HTML autonome dans dist-single/
npm test           # tests de simulation (physique, IA, matchs complets, déterminisme)
npm run test:e2e   # test de bout en bout dans Chromium (nécessite `npm run preview` en parallèle)
```

Un workflow GitHub Actions (`.github/workflows/deploy-neon-car-arena.yml`) publie le jeu sur GitHub Pages à chaque push sur `main` (à activer une fois dans *Settings → Pages → Source : GitHub Actions*).

## Commandes

| Action | Tactile | Clavier | Manette |
|---|---|---|---|
| Diriger / orienter en l'air | Joystick flottant (moitié gauche) | ZQSD / WASD / flèches | Stick gauche |
| Accélérer | ACCÉL | Z / W / ↑ | RT |
| Freiner / marche arrière | FREIN | S / ↓ | LT |
| Sauter (2e appui en l'air = double saut) | SAUT | Espace | A |
| Boost | BOOST (la jauge est affichée dans le bouton) | Maj | B |
| Dash (au sol : petit saut + dash) | DASH | E | X |
| Roulis en l'air | — | J / L | LB / RB |
| Caméra balle / libre | 🎯 | C | Y |
| Pause | ❚❚ | Échap | Start |

On peut glisser le pouce d'un bouton à l'autre (ex. ACCÉL → BOOST) sans le lever.
Options : sensibilité, inversion des axes, vibration (Android), taille des boutons, **éditeur de disposition** (glisser-déposer), préréglage **« une main »** avec accélération automatique, aide à l'atterrissage.

## Contenu

- **Modes** : Match rapide 3v3, Duel 1v1, Doubles 2v2, Chaos 4v4, Tournoi (3 matchs à élimination directe, 3 coupes), Entraînement (terrain libre, tirs, aériens, dribbles, arrêts).
- **Match** : 5 min par défaut (2/3/5), coup d'envoi avec compte à rebours, prolongation en but en or, ralenti + explosion + annonce à chaque but, **replay** du but, écran de résultats (MVP, points, buts, passes, arrêts, tirs).
- **Physique arcade** : suspension à 4 rayons, adhérence latérale, conduite sur les murs et le plafond, saut maintenu, double saut, dash directionnel, contrôle aérien, redressement automatique, collisions voiture/balle avec impulsion de frappe lisible, collisions voiture/voiture, rebonds et effet de la balle.
- **Boost** : jauge 0–100, 6 grandes capsules (+100) et 28 petites (+12), réapparition temporisée, traînée lumineuse, particules, son.
- **3 arènes** : Neon Dome (nuit, néons), Desert Reactor (dunes, réacteur, coucher de soleil), Sky Stadium (stade flottant en plein jour). Même géométrie de jeu (équité), ambiances différentes : tribunes et foule animée, écrans géants et cube d'affichage avec le score, décors, éclairage.
- **6 véhicules** (Pulse, Vortex, Titan, Phantom, Rift, Nomad) avec modèle, gabarit et caractéristiques propres (écarts ≤ 10 %, compensés — aucun n'est strictement supérieur).
- **Garage** : 80 objets cosmétiques (couleur, finition de peinture, autocollants, roues, antenne, boost, traînée, effet de but, son moteur, titres) en 4 raretés. **Purement cosmétiques**, aucun achat, aucun avantage payant.
- **Progression** : XP à chaque match, 50 niveaux, chaque niveau débloque au moins un objet ; statistiques de profil.
- **IA** : 4 difficultés (Facile, Moyen, Difficile, Expert) qui changent le temps de réaction, l'horizon d'anticipation, la précision, l'usage du boost, des dashs et des aériens. Les bots se répartissent les rôles (attaquant / soutien / défenseur), anticipent la trajectoire de la balle, contournent la balle s'ils sont du mauvais côté, se replient pour défendre au lieu de se jeter sur la balle quand l'adversaire arrive avant eux, font des arrêts, des centres pour un coéquipier et vont chercher du boost.
- **Audio** : 100 % synthétisé en temps réel — moteur (4 sons), boost, frappes, rebonds, chocs, buts, foule, menus, et une **musique synthwave originale** générée par un séquenceur.
- **Sauvegarde locale** : progression, niveau, XP, objets, personnalisation, paramètres, statistiques, tournoi en cours ; export/import JSON.
- **Graphismes** : profils BASSE / MOYENNE / HAUTE + mode **AUTO** (détection selon le GPU/la mémoire, puis ajustement de la résolution et du profil selon les FPS mesurés), limitation à 30 FPS pour économiser la batterie, textures générées (aucun fichier à télécharger : ~190 Ko gzip au total).
- **Interface** : pensée pour le paysage 16:9 à 21:9, marges de sécurité pour les encoches (`safe-area-inset`), message pour tourner le téléphone en portrait.

## Architecture

```
src/
  config/       constantes de gameplay, catalogues (véhicules, arènes, objets)
  core/         bus d'événements, PRNG déterministe, maths
  physics/      ArenaGeometry (distance signée), VehiclePhysics, BallPhysics (balle), Collisions
  sim/          Simulation (monde pur), MatchManager, GoalManager, ScoreManager, BoostSystem,
                ReplaySystem, BallPrediction, TrainingDrills, Car, InputFrame
  controllers/  VehicleController (saut / dash / boost), BotAI (+ TeamBrain), HumanController, Steering
  input/        MobileInput (tactile), InputManager (tactile + clavier + manette)
  render/       SceneView, ArenaRenderer, CarModelFactory, CameraController, ParticleSystem, TrailRenderer
  audio/        AudioManager, MusicGenerator
  meta/         SaveSystem, ProgressionSystem, CustomizationSystem, GarageSystem, TournamentSystem
  net/          Snapshot (sérialisation d'état), NetworkTransport (format des messages + transport local)
  quality/      QualityManager
  ui/           UIManager, HUD, écrans (garage, paramètres, résultats, éditeur de disposition)
  Game.js       orchestration menu / match / résultats
```

Points clés :

- **La simulation est séparée du rendu.** `sim/`, `physics/` et `controllers/` n'utilisent ni DOM ni WebGL : ils tournent sous Node (tests) et pourront tourner tels quels sur un serveur de jeu.
- **Pas fixe de 120 Hz** avec interpolation au rendu : même comportement physique à 30, 60 ou 120 FPS.
- **Déterministe** : aucune utilisation de `Math.random` dans la simulation (PRNG à graine). Un test vérifie que deux matchs de même graine sont identiques.
- **Une seule géométrie d'arène** (fonction de distance signée) sert aux collisions, aux rayons de suspension, à la caméra anti-mur et à la construction du maillage : ce qu'on voit correspond exactement à ce qui collisionne.
- **Même format d'entrée pour tous** (`InputFrame`, 6 octets) : joueur local, bots et, plus tard, joueurs distants.

Correspondance avec les modules demandés : `BallController` → `physics/BallPhysics.js` (classe `Ball` + intégration), les autres noms existent tels quels.

## Multijoueur en ligne : ce qui est prêt, ce qui reste à faire

Prêt et testé : simulation autoritaire indépendante du rendu, déterminisme, entrées compactes sérialisables, instantanés d'état (`Snapshot`, déjà utilisés par le replay), interface de transport (`NetworkTransport.js`) avec un transport local testé.

**Non implémenté** (nécessite un serveur) : matchmaking, salons, amis, parties privées, classement, serveurs dédiés, synchronisation réseau réelle, reconnexion, sauvegarde cloud. Plan détaillé dans [`docs/MULTIJOUEUR.md`](docs/MULTIJOUEUR.md). La sauvegarde cloud se branchera en fournissant un autre adaptateur à `SaveSystem` (interface `load()` / `save()`).

## Application Android / iOS (Capacitor)

Non réalisé ici (pas de SDK Android/Xcode dans l'environnement). Étapes :

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init "Neon Car Arena" com.exemple.neoncararena --web-dir dist
npm run build && npx cap add android && npx cap open android   # puis compiler depuis Android Studio
```

Penser à verrouiller l'orientation en paysage dans `AndroidManifest.xml` (`android:screenOrientation="sensorLandscape"`).

## Limites connues (honnêtes)

- Pas de démolition de voiture, pas de « powerslide » dédié.
- Vibrations : Android uniquement (iOS Safari ne les prend pas en charge).
- Le rendu a été vérifié avec un GPU logiciel (SwiftShader) : ~25 FPS dans ces conditions extrêmes ; sur un vrai GPU mobile milieu de gamme, le mode AUTO vise 60 FPS et redescend la résolution/qualité si besoin, mais les FPS réels n'ont pas pu être mesurés sur un téléphone physique depuis cet environnement.
- Les modèles 3D sont procéduraux (formes extrudées), volontairement simples : faciles à remplacer par des modèles glTF réalisés par un graphiste.
