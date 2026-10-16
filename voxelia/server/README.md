# Serveur multijoueur Voxelia

Serveur WebSocket autonome (Node.js 22.6 ou plus récent, paquet `ws`). Il fait autorité sur les
**blocs modifiés**, les **blocs à données** (coffres, fours…), l'**heure**, le **chat** et les
**permissions**. Le terrain n'est pas envoyé : chaque client le génère à partir de la graine, le
serveur ne stocke et ne transmet que les différences.

## Démarrage

```sh
npm install            # une seule fois, dans le dossier voxelia
npm run server -- --name "Mon serveur" --invite ABC123
# équivalent :
node --experimental-strip-types server/index.ts --name "Mon serveur" --invite ABC123
```

Au démarrage, le serveur affiche les adresses IP du réseau local et le port. Dans le jeu :
**Jouer › Invitations › Rejoindre avec une invitation** (adresse + code), ou **Jouer › Serveurs ›
Ajouter un serveur**. Le port 19140 est ajouté automatiquement s'il n'est pas précisé
(`192.168.1.20` ou `192.168.1.20:19140`).

Arrêt : **Ctrl+C** (ou `SIGTERM`, ou la commande `arreter`) — le serveur prévient les joueurs,
enregistre tout puis s'arrête. Un second Ctrl+C force l'arrêt sans attendre.

## Options

| Option | Effet | Défaut |
| --- | --- | --- |
| `--port <n>` | port d'écoute (WebSocket et page d'information HTTP) | 19140 |
| `--host <adresse>` | interface d'écoute | toutes |
| `--name "<nom>"` | nom du serveur et du monde | Serveur Voxelia |
| `--motd "<texte>"` | message affiché dans la liste des serveurs | vide |
| `--seed <graine>` | graine (texte ou nombre, même conversion que le jeu), utilisée à la création | aléatoire |
| `--template <type>` | `default`, `flat`, `archipelago`, `amplified`, `continents` (création) | default |
| `--invite <code>` | code exigé pour entrer (insensible à la casse) | aucun |
| `--max <n>` | joueurs simultanés | 10 |
| `--ops a,b` | opérateurs pour cette exécution (non enregistrés) | aucun |
| `--default-permission <p>` | `visitor`, `member` ou `operator` (ou visiteur, membre, operateur) | member |
| `--no-auto-op` | ne pas nommer opérateur le premier joueur | auto-op actif |
| `--world-dir <dossier>` | dossier du monde | server/data/monde |
| `--gamemode <mode>` | `survival`, `creative`, `adventure`, `spectator` | survival |
| `--difficulty <niveau>` | `peaceful`, `easy`, `normal`, `hard` | normal |
| `--cheats` / `--no-cheats` | commandes de triche autorisées côté jeu | non |
| `--rule nom=valeur` | règle de jeu, répétable (ex. `--rule daylightCycle=false`) | règles par défaut |
| `--reach <n>` | rayon d'action direct d'un joueur, en blocs | 12 |
| `--sim-radius <n>` | rayon des mises à jour automatiques acceptées, en blocs | 96 |

Pour un monde existant, `--name`, `--motd`, `--gamemode`, `--difficulty`, `--cheats` et `--rule`
remplacent les valeurs enregistrées ; la graine et le type de monde ne changent jamais (un
avertissement s'affiche).

## Permissions

- **visiteur** : se déplace et discute, ne peut pas modifier les blocs ni les coffres ;
- **membre** : peut construire ;
- **opérateur** : peut en plus régler l'heure depuis le jeu.

Ordre de décision : `--ops` ou opérateurs enregistrés → permission enregistrée pour ce nom →
permission par défaut. **Choix retenu** : s'il n'existe aucun opérateur (ni `--ops`, ni dans
`world.json`), qu'aucune permission n'a été réglée depuis la console, que l'auto-op est actif et
que la permission par défaut n'est pas déjà « operator », le **premier joueur accueilli devient
opérateur** et c'est enregistré dans `world.json`. Sur un serveur ouvert, utilisez `--ops` ou
`--no-auto-op`.

Une permission changée depuis la console s'applique tout de suite côté serveur ; le jeu du joueur
ne la reçoit qu'à la connexion, il est donc invité à se reconnecter.

## Console d'administration

Tapez dans le terminal du serveur : `aide`, `liste`, `dire <message>`, `op <nom>`, `deop <nom>`,
`permission <nom> <visiteur|membre|operateur>`, `expulser <nom> [raison]`,
`heure <tics|jour|midi|nuit|minuit>`, `sauver`, `stats`, `arreter`.

## Fichiers du monde

```
<world-dir>/world.json                 infos du monde, heure/jour, point d'apparition, opérateurs, permissions
<world-dir>/chunks/<dim>_<cx>_<cz>.json  blocs modifiés [index local, bloc brut] et blocs à données
<world-dir>/players/<nom>.json         sauvegarde du joueur (inventaire…) et dernière position
```

Écritures atomiques (fichier temporaire, `fsync`, renommage) toutes les 10 s et à l'arrêt. Un
fichier illisible est mis de côté (`*.corrupt-<date>`) et ignoré, sans arrêter le serveur. Le
dossier peut être sauvegardé en le copiant pendant que le serveur est arrêté. Le point
d'apparition (`spawn`) se règle à la main dans `world.json`, serveur arrêté (sinon le jeu choisit).

## Réseau et ports

- Un seul port TCP (19140 par défaut) : WebSocket `ws://` pour le jeu et une petite page texte
  pour vérifier depuis un navigateur que le serveur est joignable (`http://<ip>:19140`).
- Autorisez ce port dans le pare-feu de l'ordinateur. Pour des joueurs hors du réseau local,
  redirigez-le sur la box internet (ou utilisez un VPN de réseau privé).
- Le serveur ne fait pas de `wss://` (TLS). Une page du jeu servie en `https://` peut refuser une
  adresse `ws://` ; l'APK et la version locale ne sont pas concernés. Pour du TLS, placez un proxy
  inverse (nginx, Caddy…) devant le serveur.

## Sécurité

- Utilisez **toujours** `--invite` hors d'un réseau de confiance. Cinq mauvais codes en une minute
  depuis une même adresse bloquent cette adresse pendant une minute.
- **Les noms ne sont pas authentifiés** : le protocole n'a ni compte ni mot de passe. Quelqu'un qui
  connaît le code d'invitation peut prendre le nom d'un opérateur absent. Un nom déjà connecté
  depuis une autre adresse reçoit un suffixe (« Bob2 ») ; depuis la même adresse, l'ancienne
  connexion est remplacée (reconnexion après une coupure).
- Contrôles appliqués : taille des messages (64 Ko, 16 Ko pour un bloc à données, 60 Ko pour une
  sauvegarde de joueur), JSON invalide et types inconnus ignorés (comptés dans `stats`), débits
  limités (blocs 40/s avec réserve de 400, états 25/s, chat 1/s avec réserve de 6…), coordonnées
  et valeurs bornées, connexions mortes coupées (ping toutes les 15 s), clients trop lents coupés.
- Le jeu applique lui-même le mode de jeu, les dégâts et les commandes de triche : un client modifié
  peut tricher sur ces points. Le serveur ne valide que les permissions, les débits et la
  plausibilité de la position des modifications.

## Limites connues

- **Les créatures, objets lâchés, projectiles et la météo ne sont pas synchronisés** : chaque joueur
  simule les siens. Les combats entre joueurs ne sont pas transmis. Le sommeil est désactivé en
  multijoueur.
- Les mises à jour automatiques (écoulement des liquides, cultures, feu, explosions) sont calculées
  par chaque client et envoyées comme des modifications ordinaires : le serveur accepte une
  modification si elle est à portée de main (`--reach`, 12 blocs) **ou** dans la zone que le jeu
  simule autour du joueur (`--sim-radius`, 96 blocs). Le protocole ne distinguant pas les deux, une
  limite stricte de 12 blocs annulerait les explosions et les écoulements lointains.
- Un refus (`denied`) renvoie le bloc enregistré ; si le serveur ne le connaît pas (terrain jamais
  modifié, donc généré par le client) il envoie `raw: -1`, que le jeu doit ignorer.
- L'heure n'avance que lorsqu'au moins un joueur est connecté ; elle est diffusée toutes les 5 s.
- Les données d'un coffre sont supprimées côté serveur quand le bloc devient de l'air.

## Test

```sh
node tools/server-smoke.mjs          # SMOKE_VERBOSE=1 pour afficher le journal du serveur
npx tsc -p server/tsconfig.json      # vérification des types du serveur
```
