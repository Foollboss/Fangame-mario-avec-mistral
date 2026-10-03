# Teyvat Pixel — fan-game pixel-art inspiré de Genshin Impact

Une version **pixel-art** de la moitié du jeu *Genshin Impact* (version mobile) : monde ouvert à explorer,
combat en temps réel avec une équipe de 4 personnages, réactions élémentaires, vœux, quêtes… et surtout
**la même interface que la capture d'écran d'origine** (mini-carte ronde, rang d'aventure, liste d'équipe,
boutons d'action tactiles, barre de PV centrale, UID, ping…).

> ⚠️ Projet de fan **non officiel**, sans lien avec HoYoverse / miHoYo. **Aucun asset original** n'est utilisé :
> tous les graphismes (tuiles, personnages, ennemis, icônes, police) et tous les sons sont **générés par code**
> au démarrage. Jeu gratuit, sans but commercial.

## Jouer

Aucune installation, aucune dépendance : ouvrez simplement **`index.html`** dans un navigateur récent
(Chrome, Firefox, Safari, Edge — ordinateur ou téléphone en **mode paysage**).

Pour l'héberger (par ex. GitHub Pages) : publiez le dossier tel quel, c'est un site statique.
Pour le servir en local : `npx serve .` (ou `python3 -m http.server`).

Trois façons de démarrer :

| Mode | Description |
| --- | --- |
| **Nouvelle aventure** | Rang d'aventure 1, équipe niveau 1 (Voyageur, Kaeya, Xingqiu, Thoma). Prologue de Mondstadt. |
| **Continuer** | Reprend la sauvegarde locale (automatique toutes les 45 s et en quittant l'onglet ; manuelle depuis une Statue des Sept ou le menu). |
| **Voyageur confirmé** | Rang 60, équipe **Keqing · Venti · Tartaglia · Diona niveau 90**, exactement comme sur la capture. |

## Version Android (APK)

Le dossier `android/` contient une enveloppe Android minimale (une `WebView` plein écran paysage qui charge le jeu
depuis ses assets, sans permission ni connexion). Pour générer l'APK signé :

```bash
export ANDROID_HOME=/chemin/vers/android-sdk   # platforms;android-34 + build-tools;35.0.0
./android/build-apk.sh                          # -> android/build/teyvat-pixel.apk
```

Le script n'utilise pas Gradle (aapt2 + javac + d8 + apksigner) et crée une clé de signature locale la première fois.
Pour installer l'APK, autorisez « l'installation d'applis inconnues » pour votre navigateur / gestionnaire de fichiers.
Le bouton Retour d'Android ferme le menu ouvert, ou quitte depuis l'écran titre.

## Commandes

| Action | Clavier (touches physiques, donc ZQSD sur AZERTY) | Tactile |
| --- | --- | --- |
| Se déplacer | `Z Q S D` / `W A S D` / flèches | joystick flottant (moitié gauche de l'écran) |
| Attaque normale | clic gauche ou `J` (maintenir) | bouton épée |
| Compétence élémentaire | `E` | bouton violet |
| Déchaînement élémentaire | `Q` (touche physique A en AZERTY) | bouton blanc/gris |
| Sprint / esquive | `Maj` (appui court = esquive, maintenu = sprint) | bouton « » » |
| Saut | `Espace` | bouton silhouette |
| Changer de personnage | `1` `2` `3` `4` | toucher le portrait dans la liste d'équipe |
| Interagir | `F` | toucher l'invite à droite |
| Manger (feuille d'érable) | `T` | bouton feuille |
| Menu de Paimon | `Échap` / `Tab` | icône Paimon (haut gauche) |
| Carte · Personnages · Sac · Quêtes · Vœux | `M` · `C` · `B` · `L` · `G` | icônes du HUD |
| Vue élémentaire | `V` | icône œil |

## Ce que contient le jeu

**Monde ouvert** (192 × 144 tuiles, généré de façon déterministe)
- Plateau de la Statue des Sept (la scène de la capture : dalles hexagonales, ruines, Séelie), plaine de Mondstadt,
  **cité de Mondstadt** (remparts, maisons, cathédrale, moulin animé, place centrale), forêt bruissante avec
  campement hilichurl, lac du Cidre et rivière (**nage** + endurance), ruines du vent, camp du Mitachurl.
- **Cycle jour / nuit** (feux de camp et lampadaires qui s'éclairent), ombres de nuages, papillons, graines au vent.
- 8 **téléporteurs** (voyage rapide depuis la carte), 3 **Statues des Sept** (soin + offrande d'Anémoculi),
  28 coffres (4 raretés), 20 Anémoculi, fleurs / champignons / pissenlits à cueillir,
  3 **Cours des Séelies** (suivez l'esprit violet jusqu'à son trésor).
- Mini-carte ronde avec marqueurs (téléporteurs, statues, domaine, Séelies, ennemis alertés, objectif de quête).

**Combat**
- **18 personnages** jouables, chacun avec son sprite, son arme (épée, pourfendeur, arme d'hast, arc, catalyseur),
  une **compétence (E)** et un **déchaînement (Q)** : Keqing (stylet + téléportation), Venti (vortex), Tartaglia (mode mêlée Hydro),
  Diona (bouclier cryo), Kaeya, Xingqiu, Thoma, Sethos, Bennett, Razor, Diluc, Jean, Cyno, Lyney, Kazuha, Neuvillette, Wriothesley, Voyageur.
- **Éléments** Pyro / Hydro / Électro / Cryo / Anémo avec auras et **réactions** : Vaporisation, Fonte, Surcharge,
  Électrocution, Superconduction, Gel + Brisure, Diffusion.
- Boucliers élémentaires des mages de l'Abysse (à briser avec l'élément opposé), garde frontale du Mitachurl,
  attaques télégraphiées (zones rouges), énergie par particules, plan rapproché au déchaînement.
- **Ennemis** : gelées des 5 éléments (et grande gelée), hilichurls (corps à corps, combattant fonceur, archer),
  Mitachurl, mages de l'Abysse (4 éléments) et **boss : l'Hypostase Anémo** dans le domaine « Tempête de pierre ».
- Endurance, sprint, esquive avec invulnérabilité, saut, nage, noyade, mort et réapparition.

**Progression et menus**
- Rang d'aventure, niveaux de personnage (livres d'EXP), statistiques, constellations (doublons de vœux).
- **Vœux** à la Genshin : bannière événement (Venti) et standard, pitié 90 / 10, 50/50, animation d'étoile filante.
- Quêtes (prologue en 10 étapes), **commissions quotidiennes** de la Guilde, **passe de combat** (30 niveaux),
  boutique de Sara (achat / vente), manuel (bestiaire & statistiques), journal de messages, réglages (volumes).
- Conseils contextuels de **Paimon** (compagne flottante).

## Fidélité à la capture d'origine

Tous les éléments de l'interface de la capture sont reproduits à la même place (en proportion) : Paimon + pastille rouge,
mini-carte avec « N » et cône de vision, icônes œil / radar, signet de quête, **« Adventure Rank 60 »**, les six icônes
en haut à droite (événements, vœux, passe, manuel, sac, personnages) + ping, la liste des 3 autres membres de l'équipe
(anneau d'énergie, nom, barre de PV, portrait), **« Lv. 90 — 17883 / 17883 »**, la feuille d'érable, la bulle de chat,
les boutons saut / attaque / sprint / compétence / déchaînement et l'**UID 800125548**.

L'écran est mis à l'échelle par **multiples entiers** (pixels parfaits) et la mise en page s'adapte du téléphone
(paysage) au grand écran.

## Structure du code

```
index.html            page unique (canvas)
css/style.css
js/util.js            maths, bruit, couleurs, canvas, contours pixel
js/font.js            police bitmap 5×7 avec accents français
js/data.js            éléments, personnages, ennemis, objets, vœux
js/sprites.js         tuiles, décors, bâtiments, personnages « poupée », ennemis (procédural)
js/icons.js           icônes du HUD, symboles élémentaires, objets
js/world.js           génération du monde, rendu du terrain par chunks, collisions, mini-carte
js/game.js            état de jeu, progression, notifications
js/combat.js          dégâts, réactions, compétences, projectiles, zones, familiers
js/player.js          contrôleur du joueur (déplacement, endurance, interactions)
js/entities.js        IA des ennemis, PNJ, ramassables, séelies, domaine, ambiance
js/story.js           dialogues, quêtes, commissions, statues
js/ui.js              HUD fidèle à la capture, dialogues, plan rapproché
js/menus.js           carte, personnages, sac, vœux, quêtes, passe, manuel, boutique, réglages
js/audio.js           effets sonores et musiques génératives (Web Audio)
js/save.js            sauvegarde locale (localStorage)
js/input.js           clavier, souris, tactile
js/main.js            démarrage, boucle, écran titre, rendu
```

## Notes

- Les textes du jeu sont en français ; les libellés du HUD repris de la capture restent en anglais
  (« Adventure Rank », « Lv. », « UID »).
- La sauvegarde est stockée dans le navigateur (`localStorage`) ; l'effacer remet le jeu à zéro.
- « Voyageur confirmé » est idéal pour tester : toutes les compétences sont déjà utilisables et les vœux sont disponibles.
