# Voxerra

Bac à sable voxel original, jouable dans le navigateur, avec un serveur multijoueur autoritaire en Node.js.
Tout le contenu (noms, créatures, objets, structures, dimensions, textures, sons, musique) est propre au projet :
aucune ressource n'est copiée, tout est généré par le code ou décrit dans des fichiers de données.

Progression : **Découverte → Ressources → Outils → Construction → Exploration → Combat → Technologie → Fin de partie**,
à travers trois dimensions : les **Terres d'Aube** (surface), l'**Abîme cendré** (monde hostile) et les **Cimes astrales** (monde final).

---

## Jouer sans rien installer

Ouvrez **[`Voxerra.html`](Voxerra.html)** dans un navigateur (double-clic sur le fichier téléchargé) :
c'est le jeu complet en un seul fichier HTML de 1,4 Mo (code, style, police, worker de génération et mods intégrés).
Les mondes sont sauvegardés dans le navigateur. Pour le régénérer après une modification : `npm run build:html`.

Si le navigateur refuse les workers ou le verrouillage de la souris (cadre isolé, tablette), le jeu bascule seul :
génération sur le fil principal et regard à la souris sans verrouillage.

## Versions installables : Windows (.exe) et Android (.apk)

| Plateforme | Fichier | Construire | Détails |
|---|---|---|---|
| Windows 10/11 (64 bits) | `Voxerra-1.0.0-Windows.exe` (portable, ~90 Mo, sans installation) | `npm run build:exe` | [`desktop/README.md`](desktop/README.md) |
| Android 7+ | `app-release.apk` (~2,5 Mo) | `npm run build:apk` | [`android/README.md`](android/README.md) |

Les deux embarquent le même fichier `Voxerra.html`. Dans ces versions, **Quitter le jeu** ferme l'application et le
monde en cours est sauvegardé à la fermeture (ou quand l'appli Android passe en arrière-plan). Les fichiers produits
ne sont pas versionnés (trop lourds) : ils sont dans `desktop/dist/` et `android/app/build/outputs/apk/release/`.

## Langues

Le jeu est entièrement traduit en **français**, **anglais** et **espagnol** : menus, HUD, inventaires, messages,
commandes (avec leurs noms anglais et espagnols : `/give`, `/dar`, `/locate`, `/localizar`…), messages de mort et
noms de tout le contenu (blocs, objets, créatures, biomes, progrès, structures, dimensions). Au premier lancement,
la langue du navigateur est choisie ; on la change avec le bouton 🌐 du menu principal ou dans **Options → Langue**,
sans recharger la page.

- Textes de l'interface : `src/i18n/en.json` et `src/i18n/es.json` (le texte français sert de clé).
- Noms du contenu : `src/i18n/names.en.json` et `names.es.json` (par identifiant).
- Mods : champ `lang` du pack, par exemple `"lang": { "en": { "mon_bloc": "My Block" }, "es": { … } }`.
- `node scripts/i18n-keys.mjs` liste les textes à traduire ; un test échoue si une traduction manque.

## Démarrage rapide

Prérequis : **Node.js 20.11 ou plus récent** (testé avec Node 22) et un navigateur récent compatible WebGL 2
(Chrome, Edge, Firefox, Safari 16+).

```bash
cd voxerra
npm install          # installe three, ws, vite, vitest, tsx…
npm run dev          # jeu sur http://localhost:5173
```

Autres commandes :

| Commande | Rôle |
|---|---|
| `npm test` | tests automatisés (Vitest, 45 tests) |
| `npm run typecheck` | vérification TypeScript stricte |
| `npm run build` puis `npm run preview` | version de production (dossier `dist/`, déployable sur n'importe quel hébergement statique) |
| `npm run build:html` | version en un seul fichier : `Voxerra.html` |
| `npm run server -- --monde serveur --graine 1234 --commandes` | serveur multijoueur dédié (port 25590) |
| `node scripts/e2e.mjs` | parcours automatisé menu → création → jeu → inventaire (captures dans `screenshots/`) |
| `node scripts/structures.mjs` / `creatures.mjs` / `dimensions.mjs` / `multiplayer.mjs` / `tactile.mjs` | captures de contrôle visuel (le serveur de dév. doit tourner ; `multiplayer.mjs` demande aussi `npm run server`) |

### Jouer à plusieurs

1. Lancer le serveur : `npm run server` (options ci-dessous).
2. Dans le jeu : **Multijoueur → Connexion directe**, adresse `localhost` (ou `IP:25590` sur le réseau local).

Options du serveur :

| Option | Défaut | Description |
|---|---|---|
| `--port <n>` | `25590` | port WebSocket |
| `--monde <nom>` | `serveur` | monde (dossier `saves/<nom>/`) ; créé s'il n'existe pas |
| `--graine <texte>` | aléatoire | graine d'un nouveau monde (nombre ou texte) |
| `--mode <survie\|creatif\|hardcore>` | `survie` | mode de jeu des nouveaux joueurs |
| `--difficulte <0-3>` | `2` | paisible, facile, normal, difficile |
| `--distance <n>` | `6` | rayon (en colonnes) envoyé aux clients |
| `--commandes` | non | autorise les commandes à tous les joueurs |
| `--dossier <chemin>` | `./saves` | dossier des sauvegardes |
| `--motd <texte>` | — | message d'accueil |

Le serveur sauvegarde toutes les 60 s et à l'arrêt (`Ctrl+C`) ; chaque joueur est sauvegardé à sa déconnexion
et retrouve position, inventaire et état à sa reconnexion.

---

## Choix technologiques

| Besoin | Choix | Pourquoi |
|---|---|---|
| Langage | **TypeScript strict** | typage fort sur un gros code (≈ 24 000 lignes), même code côté client et serveur |
| Rendu | **Three.js (WebGL 2)** + shaders GLSL maison | contrôle total du pipeline voxel (tableau de textures, lumière par sommet) sans moteur lourd ; tourne partout sans installation |
| Parallélisme | **Web Workers** (pool) | génération du terrain et maillage hors du fil principal |
| Build / dév. | **Vite** | démarrage instantané, workers ES modules, build de production optimisé |
| Serveur | **Node.js + ws** | réutilise *exactement* la simulation du solo (`Sim`) : un seul code de règles |
| Sauvegarde | **IndexedDB** (navigateur), **fichiers** (serveur) | transactions atomiques, gros volumes, hors ligne |
| Audio | **Web Audio API** | sons et musique synthétisés à la volée : aucun fichier audio |
| Tests | **Vitest** + **Playwright** | tests unitaires de la logique, captures de bout en bout dans un vrai navigateur |

Un moteur généraliste (Unity, Godot) aurait imposé des ressources binaires, une chaîne d'export et un serveur séparé ;
ici tout reste en texte, modifiable, testable et exécutable en une commande.

---

## Architecture

```
            ┌──────────────── Navigateur ───────────────────────────────────────┐
            │  App (menus, réglages, mods) ──► Game (boucle, caméra, HUD, sons)  │
            │        │                              │                            │
 Workers ◄──┼── ChunkStreamer ◄── World (colonnes, lumière) ◄── Sim (règles)     │
 (génération│        │                              ▲         ▲                  │
  + maillage)       ▼                              │         │ modules :         │
            │  ChunkRenderer / EntityRenderer / Sky / Particules / Météo        │
            │                                     créatures, progrès, portails… │
            │  PlayerController (déplacement prédit, actions) ─► Sim ou réseau   │
            └───────────────────────────────┬───────────────────────────────────┘
                                            │ WebSocket (JSON) : RemoteSession
            ┌───────────────── Serveur Node ─▼───────────────────────────────────┐
            │ GameServer : même Sim + World, génération synchrone, réplication,  │
            │ validation des actions, FileStorage (sauvegarde atomique)          │
            └────────────────────────────────────────────────────────────────────┘
```

- **Données d'abord** : blocs, objets, recettes, cuisson, créatures (statistiques, IA, modèle, butin, apparition),
  butins, progrès, effets, textures et biomes sont décrits en JSON (`src/data/`) et fusionnés avec les mods
  (`mergePacks`). Le moteur ne connaît aucun bloc par son nom, sauf quelques blocs de base de la génération.
- **Simulation autoritaire sans rendu** (`src/sim`) : 20 ticks/s, identique en solo et sur le serveur.
  Les évènements (`SimEvent`) portent sons, particules, messages et barres de boss vers l'affichage ou le réseau.
- **Monde** : colonnes de 16×256×16 en 16 sections allouées à la demande ; cellule = identifiant (12 bits) + état (4 bits) ;
  lumière ciel + blocs par propagation en largeur (ajout/retrait) ; carte des hauteurs.
- **Maillage** (worker) : *greedy meshing* avec élimination des faces cachées, occlusion ambiante et lumière lissée
  par sommet, teinte de biome mélangée, trois passes (opaque, découpe, translucide), attributs compacts ;
  élimination des sections invisibles par parcours de connectivité (grottes) et par le cône de vision.
- **Génération** : bruit simplex multi-couches (continentalité, érosion, crêtes, température, humidité, rivières),
  relief 3D en montagne, grottes « fromage » et « spaghetti », 33 biomes à transitions douces, minerais par profondeur,
  arbres traversant les colonnes, structures par régions reconstruites colonne par colonne — **tout est déterministe
  depuis la graine**, quel que soit l'ordre de génération (testé).

### Arborescence

```
voxerra/
├─ index.html, package.json, tsconfig.json, vite.config.ts
├─ desktop/                version Windows (Electron) : fenêtre, pont « Quitter », icônes, essai automatique
├─ android/                version Android (Gradle) : activité WebView plein écran, icônes, clé de signature
├─ public/mods/            mods « données » chargés au démarrage (index.json + lucioles.json d'exemple)
├─ server/
│  ├─ server.ts            point d'entrée du serveur dédié (options, boucle 20 ticks/s)
│  ├─ gameServer.ts        logique serveur (connexions, colonnes, réplication, actions, sauvegarde)
│  └─ fileStorage.ts       sauvegarde disque atomique (monde, colonnes, joueurs)
├─ src/
│  ├─ main.ts              démarrage
│  ├─ app/                 App (menus, pool de workers, panorama), réglages, mods, API des écrans
│  ├─ game/                Game (boucle de jeu), PlayerController (entrées → actions), effets, modules
│  ├─ engine/              maths, hasards déterministes, bruit simplex, pool de workers
│  ├─ registry/            types de contenu, registres blocs/objets, fusion des packs
│  ├─ data/                contenu de base en JSON (blocs, objets, recettes, créatures, butins, progrès…)
│  ├─ world/               colonnes, sections, lumière, formes, streaming, constantes
│  ├─ worldgen/            générateurs des 3 dimensions, biomes, arbres, minerais, structures/
│  │  └─ structures/       outil de construction, structures de surface, Abîme/Cimes, gabarits de mods
│  ├─ render/              textures procédurales, atlas, shaders, mailleur, ciel, particules, météo,
│  │                       modèles d'entités et d'objets, icônes, objet tenu, contour du bloc visé
│  ├─ physics/             collisions AABB, lancer de rayon
│  ├─ entity/              entités, vivants, joueur, créatures (mob.ts), projectiles, objets, tombes, ai/
│  ├─ sim/                 simulation : temps/météo, blocs vivants, survie, interactions, fourneaux,
│  │                       mécanismes, portails, commandes, progrès, créatures (mobs.ts), butins
│  ├─ inventory/           conteneurs, inventaire du joueur, clics (glisser, répartir, maj-clic…)
│  ├─ crafting/            livre de recettes (façonnées, sans forme, stations, cuisson)
│  ├─ save/                sérialisation (palette + RLE), stockage mémoire, IndexedDB
│  ├─ net/                 protocole, session client, connexion
│  ├─ audio/               synthèse des sons et ambiances, moteur audio et musique générative
│  ├─ input/               clavier, souris, manette, réaffectation des touches
│  ├─ ui/                  écrans (menus, inventaires, progrès, discussion), HUD, style
│  └─ workers/             worker de génération et de maillage
├─ tests/                  tests Vitest (génération, colonnes, sauvegarde, inventaire, fabrication,
│                          créatures, structures, serveur, mods, intégrité du contenu)
└─ scripts/                parcours Playwright et captures de contrôle
```

---

## Contrôles

| Action | Clavier / souris | Manette |
|---|---|---|
| Se déplacer | `Z Q S D` / `W A S D` (selon la disposition) ou flèches | stick gauche |
| Regarder | souris | stick droit |
| Sauter / nager / voler (double saut en créatif) | `Espace` | A |
| S'accroupir (ne tombe pas des bords) | `Maj` | B / clic stick droit |
| Sprinter | `Ctrl` ou `R` (ou double appui avant) | clic stick gauche |
| Casser / attaquer | clic gauche | RT |
| Utiliser / poser / manger / tirer / bloquer | clic droit | LT |
| Choisir le bloc visé | clic molette | — |
| Barre rapide | `1`–`9`, molette (change de case, sans agrandir la barre) | LB / RB |
| Inventaire (et livre de recettes) | `E` | Y |
| Jeter l'objet (tout : `Ctrl+Q`) | `Q` | X |
| Esquive | `C` | croix : bas |
| Discussion / commande | `T` ou `Entrée` / `/` | — |
| Progrès | `L` | — |
| Joueurs connectés | `Tab` | — |
| Vue 1re / 3e personne | `F5` ou `V` | Select |
| Informations de débogage | `F3` | — |
| Masquer l'interface / capture | `F1` / `F2` | — |
| Pause | `Échap` | Start |

Toutes les touches se réaffectent dans **Options → Commandes**.

### Écran tactile (téléphone, tablette)

Les contrôles tactiles s'activent tout seuls sur un appareil sans souris, et se règlent avec l'interrupteur
**Contrôles tactiles** (premier bouton de **Options** et tout en haut de **Options → Commandes**).

| Action | Geste |
|---|---|
| Se déplacer | joystick en bas à gauche |
| Sprinter | bouton 🏃 à droite du joystick : un appui pour courir, un autre pour marcher (ou pousser le joystick à fond vers l'avant) |
| Regarder | glisser le doigt n'importe où ailleurs sur l'écran |
| Utiliser / poser / manger | toucher brièvement l'écran, ou maintenir ✋ |
| Frapper une créature hostile | toucher brièvement l'écran en la visant (aide à la visée : pas besoin d'être pile dessus) |
| Casser / attaquer | appui long sur l'écran, ou maintenir ⚔ (maintenu, les coups s'enchaînent dès que l'arme est rechargée) |
| Sauter / nager | ⇧ (maintenir pour nager ou monter) |
| S'accroupir | ⇩ (interrupteur) |
| Barre rapide | toucher une case |
| Inventaire, discussion, commande, jeter, vue, pause | boutons 🎒 💬 / ⤓ 👁 ⏸ en haut à droite (le clavier du téléphone s'ouvre directement) |
| Fermer l'inventaire, un coffre, la discussion… | bouton ✕ en haut à droite |

Les menus défilent quand l'écran est trop petit ; le zoom du navigateur (pincement, `Ctrl` + molette) est bloqué
en jeu.

Inventaire : clic gauche (prendre, poser, échanger), clic droit (moitié / un seul), glisser (répartir),
Maj + clic (transfert rapide), double-clic (regrouper), touches `1`–`9` (échange avec la barre rapide).

Commandes (si autorisées) : `/aide`, `/donner`, `/tp`, `/temps`, `/meteo`, `/mode`, `/effet`, `/soigner`, `/tuer`,
`/invoquer`, `/localiser <village|ruines|tour|temple|portail|sanctuaire|observatoire|crypte|mine|donjon|forteresse|citadelle|fleche>`,
`/dimension <surface|abime|astral>`, `/graine`, `/regle` (alias anglais et espagnols acceptés).
Pendant la saisie, des suggestions à toucher (ou `Tab`) complètent la commande et ses arguments (heures, météo, modes,
objets, créatures, structures…) ; le bouton ➤ ou la touche Entrée du clavier du téléphone envoie. Pour un monde créé
sans commandes : **Solo → Modifier → Autoriser les commandes**.

---

## Fonctionnalités terminées

**Moteur voxel** : colonnes et sections, chargement/déchargement dynamique autour du joueur (priorité à la distance),
génération et maillage asynchrones dans des workers, *greedy meshing*, élimination des faces et des sections invisibles,
occlusion ambiante, lumière ciel/blocs propagée, eau animée, feuillage ondulant, coordonnées XYZ, bloc visé,
casser/poser, blocs orientés, dalles, escaliers, murets, barrières, portes, vitres, échelles, torches murales.

**Génération** (graine déterministe) : 24 biomes de surface (plaines, prairies fleuries, forêts, bouleaux, forêt ancienne,
jungle, désert, savane, canyons ocre, marécage, taïga, taïga enneigée, toundra, montagnes, pics gelés, océans, océan gelé,
plages, rivages rocheux, rivières, rivières gelées) dont 2 zones très rares (bosquet de cristal, forêt fongique),
5 biomes de l'Abîme, 4 des Cimes astrales ; transitions et teintes mélangées ; montagnes avec surplombs, rivières, lacs,
grottes, lave profonde, 8 minerais répartis par profondeur, 18 types d'arbres.

**Structures** (14 types + gabarits de mods) : hameaux générés par règles (routes, maisons à pignon selon le biome,
grandes maisons, forge, champs irrigués, enclos, puits, lampadaires, habitants), ruines (parfois avec cave cachée),
tours de guet occupées par des pillards, temple des sables à chambre secrète, ruines de portail, sanctuaire moussu
(autel du boss sylvestre), observatoire (autel astral), crypte oubliée (très rare, meilleur butin),
mines abandonnées en réseau de galeries, donjons à foyers maudits, forteresse de basalte (Abîme), ruines cendrées,
citadelle astrale et flèches de cristal (Cimes). 15 tables de butin.

**Environnement** : cycle jour/nuit, soleil, lune et ses phases, étoiles, planète astrale, nuages, brouillard par biome,
pluie, orages et éclairs, neige, cendres de l'Abîme, poussière d'étoiles, ambiances sonores par biome et sous terre.

**Survie** : santé, énergie (faim) et saturation, dégâts de chute, noyade, lave, feu, cactus, vide ; régénération ;
température corporelle (biome, altitude, nuit, pluie, eau, vêtements chauds, sources de lumière et de chaleur) ; 15 effets de statut ; mort avec tombe
qui conserve les objets, réapparition au lit ou au point d'apparition ; mode hardcore.

**Ressources, fabrication, inventaire** : 223 blocs (dont 57 variantes), 122 objets, 142 recettes façonnées ou sans forme,
17 cuissons, 3 stations (main, atelier, forge runique), fourneaux avec combustible, outils en 6 paliers,
armes (épées, lames élémentaires, bâtons magiques, arc et flèches), bouclier, 5 panoplies d'armure, élixirs ;
inventaire complet (grille, barre rapide, piles, glisser-déposer, clics gauche/droit, partage, transfert rapide),
livre de recettes avec remplissage automatique, inventaire créatif, coffres.

**Créatures** (24 + 1 dans le mod d'exemple) : passives, neutres, hostiles, aquatiques, volantes, grimpeuses,
en groupe ; IA à objectifs (repérer/perdre une cible, patrouille, fuite, nourriture, troupeau, éviter les dangers,
chercher l'ombre, embuscade, mêlée, tir avec anticipation, piqué, explosion, téléportation) ; recherche de chemin A* ;
apparition selon lumière, heure, biome, dimension et milieu ; 3 **boss à phases** (Gardien sylvestre, Tyran des braises,
Veilleur astral) invoqués sur leur autel avec une offrande, barre de vie, invocations, salves, charge, bouclier.

**Dimensions et progression** : portail runique (cadre de pierre runique + étincelle de braise) vers l'Abîme
(coordonnées ×4), autel astral + clé astrale vers les Cimes (gravité réduite) ; arbre de 37 progrès ;
statistiques ; fin de partie : vaincre le Veilleur astral et obtenir la couronne stellaire.

**Construction et mécanismes** : blocs pleins et décoratifs, verres, tissus de 12 couleurs, lampes, lanternes,
leviers, plaques de pression, lampes activables, portes de fer, rangements (coffres).

**Interface** : menu principal avec panorama, sélection/création/édition de monde (graine, mode, difficulté, type,
structures, coffre bonus, commandes), écran de chargement avec carte, HUD (santé, énergie, armure, air, température,
effets, barre de boss), inventaires, pause, options (distance de vue, champ de vision, sensibilité, volumes, échelle
de l'interface, touches), progrès, statistiques, mort, mods, multijoueur, aide.

**Sauvegarde** : IndexedDB transactionnelle (métadonnées + colonnes dans une seule transaction, copie de secours),
seules les colonnes modifiées sont écrites (palette locale + RLE), entités persistantes par colonne,
sauvegarde automatique et à la fermeture ; colonnes corrompues régénérées ; blocs de mods retirés tolérés.

**Audio** : sons de blocs par matériau (casser, poser, pas), armes, créatures (voix par espèce), météo, portails ;
musique générative selon l'ambiance (jour, nuit, grotte, Abîme, Cimes, combat de boss). Tout est synthétisé.

**Multijoueur** : serveur autoritaire (voir plus haut), connexion, synchronisation des joueurs, blocs, créatures,
objets, projectiles, coffres et fourneaux, discussion, commandes, sauvegarde serveur, reconnexion avec état conservé.

**Modding** : packs JSON ajoutant textures (motifs procéduraux), blocs (et variantes), objets, recettes, cuissons,
créatures (avec les objectifs d'IA existants), butins, structures gabarits, progrès, effets et réglages de biomes,
sans modifier le moteur. Chargés depuis `public/mods/` ou importés depuis le menu **Mods**.

---

## Créer un mod

Ajouter un fichier `public/mods/mon-mod.json` et le déclarer dans `public/mods/index.json`
(`{ "packs": ["lucioles.json", "mon-mod.json"] }`). Le serveur lit le même dossier. Exemple commenté :
[`public/mods/lucioles.json`](public/mods/lucioles.json) (bloc lumineux, pierre avec variantes, objet, 2 recettes,
une créature volante nocturne, une structure « cairn » décrite par couches avec coffre, une table de butin, un progrès).

Structure gabarit : `layers[y][z]` = chaînes sur l'axe x ; la `palette` associe un caractère à un bloc (`bloc:état`),
`coffre` reçoit la table `loot`, `foyer_maudit@creature` pose un foyer, `@creature` place une créature,
`.` force de l'air, l'espace laisse le terrain.

---

## Génération des ressources

Aucune image ni aucun son n'est fourni : tout est produit au lancement.

- **Textures** : `src/render/texgen.ts` dessine chaque texture 16×16 à partir d'un motif (pierre, planches, minerai,
  feuillage, verre…) et d'une palette décrite dans `src/data/textures.json`, avec un bruit déterministe ;
  les textures sont réunies dans un tableau de textures WebGL (`atlas.ts`).
- **Icônes d'objets** : modèles « pixel art » en ASCII recolorés (`itemArt.ts`) ou rendu isométrique des blocs (`icons.ts`).
- **Modèles** : créatures et joueurs sont faits de boîtes décrites dans `creatures.json` (rôles animés : pattes, bras,
  ailes, queue, mâchoire…).
- **Sons et musique** : synthèse Web Audio (`src/audio/synth.ts`, `audio.ts`) : bruits filtrés, enveloppes, voix de
  créatures, boucles d'ambiance, musique générative par gammes et humeurs.
- **Logo** : dessiné sur un canevas (`ui/logo.ts`). Police : *Pixelify Sans* (licence OFL, via `@fontsource`).

---

## Tests

`npm test` exécute 49 tests :

| Fichier | Couverture |
|---|---|
| `worldgen.test.ts` | déterminisme de la graine, graines différentes, socle et terrain, génération rapide des 3 dimensions |
| `world.test.ts` | lecture/écriture de blocs, lumière, colonnes, RLE, sérialisation, poser/casser |
| `save.test.ts` | aller-retour complet (monde modifié, coffre, créature, joueur), colonne corrompue, suppression |
| `inventory.test.ts` | piles, clics, répartition, transfert rapide, sérialisation |
| `crafting.test.ts` | recettes façonnées (miroir, décalage), sans forme, stations, cuisson |
| `mobs.test.ts` | poursuite et dégâts, chauve-furie à portée de coup, fuite, butin, apparitions nocturnes, mode paisible, phases de boss, sauvegarde |
| `commands.test.ts` | suggestions de commandes dans les 3 langues, chaque suggestion reconnue, message de refus |
| `structures.test.ts` | chaque structure localisable, blocs connus, coffres, déterminisme entre colonnes, désactivation |
| `server.test.ts` | accueil, colonnes, réplication des blocs, discussion, inventaire, reconnexion, refus |
| `mods.test.ts` | mod d'exemple complet, validation des packs |
| `i18n.test.ts` | chaque texte et chaque nom traduit en anglais et en espagnol, changement de langue à chaud |
| `content.test.ts` | textures, butins, modèles et autels cohérents |

---

## Limites connues

- **Multijoueur** : le serveur valide la portée, la vitesse et les actions, mais fait confiance au client pour le
  contenu de l'inventaire après une fabrication et pour les coffres (prévu pour jouer entre amis) ; connexion en `ws://`
  non chiffrée (utiliser un proxy TLS pour `wss://`) ; les progrès sont partagés par monde et non par joueur ;
  instantanés d'entités en JSON complet (adapté au réseau local, pas optimisé pour Internet).
- **Nouvelles dimensions** : leurs générateurs sont des classes TypeScript (`DimGenerator`) ; les mods peuvent ajouter
  biomes, blocs, créatures et structures, mais pas encore une dimension entière sans code.
- **Mécanismes** : leviers, plaques, lampes et portes de fer ; pas de circuits logiques complexes.
- **Liquides** : écoulement simplifié (sources et nappes, pas de courants).
- **Habitants** : présents dans les hameaux mais sans commerce.
- **Plateformes** : sur écran tactile, pas de glisser-déposer dans l'inventaire (toucher une case prend ou pose la
  pile) ; la capacité de sauvegarde dépend du quota IndexedDB du navigateur.
- **Performances** : prévues pour un GPU grand public ; la distance de vue se règle dans les options.
