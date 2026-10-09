# ASPHALT LEGENDS UNITE — FANGAME 🏎️💨

Fangame de course arcade inspiré d'**Asphalt Legends Unite**, réalisé avec **Godot 4.7** (jeu) et **Blender 4.5** (voitures et décors 3D).
APK Android prêt à installer : **Android 13 minimum** (minSdk 33, targetSdk 35, arm64).

> ⚠️ Fangame **non officiel**, gratuit et sans but commercial. Non affilié à Gameloft.
> Les noms de marques et de modèles de voitures appartiennent à leurs propriétaires respectifs.
> Aucun logo officiel n'est utilisé : toutes les voitures, textures, sons et musiques sont générés par les scripts de ce dépôt.

---

## 📲 Installer sur Android

1. Télécharge **[`release/AsphaltUniteFangame.apk`](release/AsphaltUniteFangame.apk)** sur ton téléphone (Android 13 ou plus récent).
2. Ouvre le fichier et autorise « Installer des applications inconnues » pour ton navigateur / gestionnaire de fichiers.
3. Lance **Asphalt Unite Fangame** (le jeu est en paysage).

L'APK est signé avec la clé du dépôt (`keystore/`) : les futures versions s'installeront par-dessus sans perdre ta sauvegarde.

---

## 🎮 Contenu

### Gameplay façon Asphalt
- **Nitro** à 3 niveaux : nitro normal (tape), **NITRO PARFAIT** (retape quand le curseur est dans la zone bleue), **ONDE DE CHOC** (double tape avec la jauge pleine) — les « séquences parfaites » s'enchaînent.
- **Rampes** et **rampes vrillées** qui font faire des **TONNEAUX** (simples ou doubles), **360°** en l'air (bouton DRIFT pendant un saut), **sauts** sur les collines de San Francisco, **atterrissages parfaits**.
- **Drift** (DRIFT + direction), **frôlements** du trafic, **takedowns** sur les adversaires, trafic qu'on peut percuter (il s'envole !), **épaves** si tu prends un mur ou une voiture de face.
- **TouchDrive** (OUI/NON) : la voiture se dirige toute seule, toi tu gères la nitro, les drifts et les 360° ; glisse à gauche/droite pour changer de voie.
- 5 adversaires IA (6 pilotes), trafic avec voies à contresens, clignotants, bus, taxis…
- Modes : **Course classique**, **Élimination**, **Contre-la-montre**, **Chasse aux takedowns**.

### 8 circuits, 4 ambiances
| Ville | Circuits | Ambiance |
|---|---|---|
| San Francisco | Downtown, Golden Gate | Collines et sauts, maisons victoriennes, rails de tram, voie de bus rouge, **pont du Golden Gate** |
| Los Angeles | Hollywood, Pacific Coast | Coucher de soleil, palmiers, panneaux publicitaires, **plage** |
| Tokyo | Shibuya, Rainbow Bay | **Nuit**, gratte-ciels, enseignes néon, **tunnel**, pont blanc illuminé |
| Nevada | Canyon, Route 66 | Désert, **canyon**, mesas, cactus, gros sauts |

### 21 voitures (modélisées par script dans Blender)
**Voitures gratuites** (dès le début) :
- **Mitsubishi Lancer Evolution** — classe D
- **Mercedes-Benz CLA** — classe D
- **Peugeot 3008** — classe C
- **BMW M5** — classe B

À débloquer avec des plans : BMW Z4 LCI E89, Chevrolet Camaro LT, Nissan 370Z Nismo, Nissan Leaf Nismo RC, KTM X-Bow GTX (D) · Ford Mustang GT, Porsche 718 Cayman GT4, Alpine A110 (C) · Nissan GT-R Nismo, Mercedes-AMG GT, Porsche 911 GT3 RS (B) · Lamborghini Huracán EVO, Ferrari F8 Tributo, McLaren 720S, Ford GT (A) · Koenigsegg Jesko, Bugatti Chiron (S).

### Menus « Unite »
Accueil avec showroom 3D néon, **Carrière** (3 chapitres, 9 saisons, 34 épreuves, drapeaux, plans), carte de saison, **Sélection de voiture**, fiche voiture (rang, étoiles, plans, **AMÉLIORER**, **PEINTURE**, carburant 6/6, TouchDrive, JOUER), **Garage**, **Boutique** (packs de plans, crédits, voitures — tout est gratuit), **Pass Unité** (30 paliers), **Événements quotidiens**, **Événements spéciaux** (défis Mustang, 911 GT3 RS, Huracán, Jesko), **Multijoueur** (ligue classée contre des pilotes IA, hors-ligne), objectifs quotidiens, profil et paramètres (qualité graphique, commandes boutons/inclinaison, vibrations…).

---

## 🕹️ Commandes

| Action | Tactile | Clavier | Manette |
|---|---|---|---|
| Tourner | ◀ ▶ (ou inclinaison) | ← → / A D | Stick gauche / croix |
| Nitro | NITRO | Espace / ↑ | A / RT |
| Drift / frein / 360° en l'air | DRIFT | ↓ / Maj | X / LT |
| Pause | ⏸ | Échap | Start |

---

## 🛠️ Reconstruire le projet

```
blender/            Scripts Python Blender : voitures paramétriques + décors (export .glb, vignettes Cycles)
  carlib.py           générateur de carrosserie (loft, passages de roues, phares projetés, jantes…)
  cars_spec.py        géométrie des 21 voitures + 6 véhicules de trafic
  build_cars.py       blender -b -P blender/build_cars.py [-- --traffic] [-- --no-thumbs]
  build_props.py      rampes, rampe à tonneau, palmiers, arbres, lampadaires, feux, tour du Golden Gate…
tools/
  gen_textures.py     asphalte, façades, néons, ciels panoramiques, icônes (numpy + Pillow)
  gen_audio.py        moteurs, nitro, crash, musiques synthwave (numpy + scipy + ffmpeg)
  build_apk.sh        export Android (Godot + Gradle)
game/               Projet Godot 4.7 (rendu Compatibility / OpenGL ES 3)
  scripts/race/       piste, physique, IA, trafic, décor procédural, caméra, HUD, commandes
  scripts/menu/       menus façon Asphalt Unite
  scripts/data/       voitures, carrière, circuits
keystore/           clé de signature de l'APK (fangame uniquement)
release/            APK prêt à installer
```

1. `blender -b -P blender/build_cars.py` puis `blender -b -P blender/build_cars.py -- --traffic --no-thumbs` et `blender -b -P blender/build_props.py`
2. `python3 tools/gen_textures.py` et `python3 tools/gen_audio.py`
3. Ouvre `game/` dans Godot 4.7, ou lance `./tools/build_apk.sh` (SDK Android 35 + JDK 17+ + modèles d'export Godot 4.7.2).

Tests automatiques (rendu sous Xvfb) : `godot --path game res://tools/shot_race.tscn -- track=sf_downtown car=lancer_evo` et `res://tools/flow_test.tscn`.

---

## Crédits
- Moteur : [Godot Engine](https://godotengine.org) (MIT) · Modélisation : [Blender](https://www.blender.org) (GPL)
- Police : Barlow Condensed — SIL Open Font License (`game/assets/fonts/OFL-BarlowCondensed.txt`)
- Voitures, décors, textures, sons et musiques : générés procéduralement par les scripts de ce dépôt.
