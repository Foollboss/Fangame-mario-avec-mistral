# Échos d'Aetheria

Action-RPG élémentaire en monde ouvert (Godot 4.7 + Blender), dans l'esprit des action-RPG « anime » :
quatre héros — **Kaelith** (Hydro, catalyseur), **Lyra** (Électro, épée), **Kael** (Pyro, épée) et
**Zahara** (Lave, bâton) — à explorer, combattre, planer et résoudre des quêtes sur l'île d'Aetheria.

> Le nom du dépôt vient d'un ancien projet ; le jeu actuel est *Échos d'Aetheria*.

## Version 8.0 : villages, cuisine, boutiques et cinématiques

- **Trois nouveaux villages** sur les autres îles : **Joncbourg** (Marais d'Émeraude, village de pêcheurs),
  **Forgeval** (Terres de Braise, village de forgerons, avec sa grande forge) et **Hautevent** (Falaises de
  l'Orage, village des guetteurs, avec son moulin). Chacun a ses maisons, sa place, une épicerie, un
  cuisinier, une marmite, et quatre habitants avec leurs quêtes.
- **12 nouvelles quêtes** : l'acte II « Les Échos lointains » (rencontrer les chefs des trois villages),
  des quêtes de village (chasse, cueillette, cuisine, feux de vigie à rallumer en hauteur) et **trois quêtes
  dans les domaines** (pages du carnet de Basile et sa cage dans le Repaire des Masques, Cœurs de braise de la
  Forge d'Ignis, pierres d'écho et Esprit céleste du Sanctuaire).
- **Cinématiques** (bandes noires, caméra animée, sous-titres, bouton « Passer ») : prologue, arrivée dans
  chaque village, réveil du Gardien Givré, présentation des boss du monde, rallumage de la grande forge,
  union des trois villages et scène de fin. Nouvelles animations Blender pour l'occasion : parler, saluer, victoire.
- **Inventaire à onglets** (Nourriture, Ingrédients, Matériaux, Trésors) et **Mora**, la monnaie (monstres,
  coffres, quêtes). **Sac à provisions** (touche H ou bouton) pour manger sans ouvrir le menu.
- **Arbres fruitiers** : frappe un arbre qui porte des fruits (pommes, soleillettes, cerises, baies givrées),
  il tremble et ses fruits tombent ; ils repoussent quelques minutes plus tard. **Plantes à cueillir** :
  menthe, champignons, lotus, piments de braise, lys des vents.
- **Cuisine** aux marmites : 12 recettes, mini-jeu de cuisson (zone dorée = « Délicieux ! » ×2), cuisson
  automatique après 3 réussites. Plats : soins, résurrection, endurance, ATQ +%, endurance économisée,
  dégâts réduits (icône et minuteur au-dessus des PV).
- **Boutiques** : épicerie et cuisinier dans chaque village (et Mireille à Brise-Marée) ; on y achète
  ingrédients, plats et recettes. Choix de réponse dans les dialogues (« Voir la boutique »).
- **Techniques multicolores** : chaque élément a une palette de 4 couleurs (Hydro blanc-cyan-bleu-indigo,
  Électro blanc-rose-violet, Pyro crème-or-orange-carmin, Lave jaune-orange-rouge-sombre) : arcs en dégradé,
  sphères et anneaux à plusieurs couches, étincelles d'accent, traînées d'arme en dégradé, éclairs variés.
- **Vision élémentaire** (touche V maintenue, bouton œil sur mobile) : le monde se décolore et les
  Anémoculus, coffres, plantes, fruits et cristaux proches s'illuminent. **Courants ascendants** près des
  aiguilles rocheuses et à Hautevent : on y monte en planeur.
- Carte : noms des villages, boutiques et marmites.

## Version 7.1 : escalade, nage et Anémoculus

- **Escalade** : pousse contre un mur, une falaise, un toit, une tour ou un pilier pour t'y accrocher.
  Saut = bond vers le haut (coûte de l'endurance), esquive = lâcher prise ; arrivé en haut, le héros
  se hisse tout seul. Grimper consomme de l'endurance ; à zéro, on tombe.
- **Nage** dans la mer, le lac et le marais : nage normale, nage rapide en maintenant l'esquive (plus
  gourmande en endurance). Si l'endurance tombe à zéro dans l'eau, on est ramené sur la rive.
- **44 Anémoculus** cachés en hauteur (toits du village, moulin, phare, ruines, aiguilles rocheuses,
  sommets, statues) ou au-dessus de l'eau ; un petit tintement signale ceux qui sont tout proches.
- **Statues d'Aetheria** : « Interagir » près d'une statue ouvre l'offrande. 8 niveaux de résonance
  (3, 4, 4, 5, 5, 6, 6 et 7 Anémoculus) ; chaque niveau donne **+15 d'endurance maximale** (jusqu'à 220),
  de l'expérience et des éclats.
- Nouvelles animations Blender : `Climb`, `Climb_Idle`, `Swim`, `Swim_Idle` ; nouveaux décors `Oculus`
  et `Spire` (aiguille rocheuse escaladable).

## Version 7.0 : ce qui a changé

- **Animations refaites dans Blender** (`blender/`) : marche, course, sprint, saut, chute, planeur,
  esquive, coup reçu, combos d'attaque (épée, bâton à deux mains, gestes de magie), compétences et
  déchaînements des 4 héros. Les pieds restent plantés au sol (IK) et les cycles sont calés sur la
  vitesse de déplacement : plus de glissement.
- **Combat plus nerveux** : micro-gel à l'impact (« hitstop »), traînée lumineuse derrière les lames,
  petit pas en avant pendant les coups, chiffres de dégâts qui apparaissent avec un « pop ».
- **Décors modélisés dans Blender** façon Mondstadt : maisons à colombages à étage, arbres en touffes
  avec feuillage détouré, sapins, rochers, buissons, fleurs, téléporteurs, statues, lanternes,
  puits, étals et moulin. Textures peintes générées par script.
- **Rendu** : cel-shading des héros (ombres teintées à deux tons, liseré de lumière, contour coloré),
  tonemapping filmique, halo doux, herbe moins « fluo ».
- **Interface et menus** : écran titre, menu principal (profil + grille d'icônes), écran Personnages
  avec modèle 3D, inventaire, paramètres (qualité, sensibilité, volumes, FPS, plein écran), carte du
  monde, journal des quêtes, horloge et dialogues restylés (bouton « Passer »), fil des objets obtenus.

## Commandes (PC)

| Action | Touche |
| --- | --- |
| Se déplacer | ZQSD / WASD / flèches |
| Attaque | Clic gauche ou J |
| Compétence / Déchaînement | E / Q ou R |
| Saut, planeur, bond en escalade | Espace |
| Sprint, esquive, lâcher prise, nage rapide | Maj ou clic droit |
| Changer de héros | 1 – 4 |
| Interagir (PNJ, coffres, statues, cueillette, marmites) | F |
| Sac à provisions (manger) | H |
| Vision élémentaire (maintenir) | V |
| Carte / Quêtes / Heure | M / L / N |
| Zoom caméra | Molette |
| Menu | Échap |

Sur mobile, les commandes sont tactiles (joystick à gauche, boutons à droite).

## Structure du dépôt

```
game/                  projet Godot 4.7 (ouvrir game/project.godot)
  scripts/             code GDScript (main, party = héros, ui + menu_*.gd, world, enemy…)
  shaders/             shaders (toon_char, toon_outline, foliage, sky, terrain, grass…)
  assets/              modèles GLB (héros, décors, armes), terrain pré-calculé (*.bin)
  ui/, audio/          images de l'interface, portraits, sons et musiques
  tools/               outils de vérification (planches d'animations, aperçu des décors)
blender/
  build_characters.py  régénère les animations des héros → game/assets/<héros>.glb
  anim/                solveur de pose (FK/IK) et bibliothèque d'animations
  build_props.py       modélise les décors → game/assets/props_genshin.glb
  props/kit.py         kit de modélisation procédurale + textures peintes
game/tools/make_item_icons.py  dessine les icônes des objets (ui/items/*.png)
  source/              GLB d'origine des héros (maillage + squelette + texture)
```

## Régénérer les assets avec Blender

Blender 4.5+ (testé avec 5.2) en ligne de commande, depuis la racine du dépôt :

```bash
blender -b -P blender/build_characters.py              # les 4 héros
blender -b -P blender/build_characters.py -- kael lyra # seulement certains
blender -b -P blender/build_props.py                   # les décors
```

Les vitesses de pas exportées sont écrites dans `blender/anim_info.json` (à reporter dans
`game/scripts/party.gd`, champ `gait`, si on change les foulées).

Vérification visuelle (Godot avec affichage) :

```bash
cd game
godot --script res://tools/anim_sheet.gd -- --char=kael --anims=Walk,Run,Attack1 --view=34 --out=/tmp/planches
godot --script res://tools/props_sheet.gd -- --out=/tmp/decors
godot -- --menutest --shots=/tmp/menus      # captures de tous les menus
godot -- --combattest --shots=/tmp/combat   # captures des 4 héros en combat
godot -- --climbtest --shots=/tmp/escalade  # escalade (maison, phare, aiguille, planeur)
godot -- --swimtest --shots=/tmp/nage       # nage (lac, mer, noyade, sortie de l'eau)
godot -- --oculustest --shots=/tmp/oculus   # Anémoculus, offrande, sauvegarde
godot -- --v8test --shots=/tmp/v8            # inventaire, fruits, cuisine, boutique, quêtes, domaine
godot -- --v8shots --shots=/tmp/v8img        # villages, menus, vision, techniques, cinématiques
```

## Exporter le jeu

Préréglages fournis dans `game/export_presets.cfg` (Windows, Android, Linux) :

```bash
cd game
godot --headless --export-release "Windows" ../builds/Echos_Aetheria.exe
# Android : la clé de signature n'est PAS dans le dépôt (il est public), on la passe par variables d'environnement
GODOT_ANDROID_KEYSTORE_RELEASE_PATH=/chemin/aetheria_v7.keystore \
GODOT_ANDROID_KEYSTORE_RELEASE_USER=aetheria \
GODOT_ANDROID_KEYSTORE_RELEASE_PASSWORD=******** \
godot --headless --export-release "Android" ../builds/Echos_Aetheria_v8.apk
```

Garde précieusement le fichier `aetheria_v7.keystore` et son mot de passe : Android n'accepte une
mise à jour que si elle est signée avec la même clé.

### Moteur Android allégé (optionnel)

Par défaut, l'APK utilise le moteur Godot officiel (environ 44 Mo). Pour un APK plus léger
(environ 37 Mo), `engine/custom_aetheria.py` décrit un moteur Godot 4.7.2 compilé sans ce que le
jeu n'utilise pas (Vulkan, XR, réseau, vidéo, navigation, CSG…), testé sur Linux avec tous les tests
du jeu mais pas sur téléphone. `engine/build_android_template.sh` le compile (NDK 29.0.14206865) et
fabrique `game/android_template/android_release.apk` ; il suffit ensuite de renseigner ce fichier
dans « Modèle personnalisé › Release » du préréglage Android avant d'exporter.

Attention : les textures `assets/*_albedo_2048.png` sont utilisées par les modèles des héros,
il ne faut pas les exclure de l'export.
