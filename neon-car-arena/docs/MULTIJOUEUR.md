# Plan du multijoueur en ligne

Ce document décrit comment ajouter le jeu en ligne **sans réécrire le jeu**. Rien de ce qui suit n'est encore implémenté côté serveur.

## Déjà en place dans le code

| Élément | Fichier | Rôle en ligne |
|---|---|---|
| Simulation sans rendu | `src/sim/Simulation.js` | Exécutée à l'identique par le serveur (Node) et par le client (prédiction). |
| Pas fixe 120 Hz | `src/sim/MatchManager.js` | Horloge commune serveur/clients (numéro de tick). |
| Déterminisme | `src/core/Random.js`, test « déterminisme » | Rejouer des ticks après correction (rollback). |
| Entrées compactes | `src/sim/InputFrame.js` (6 octets) | Message client → serveur à chaque tick. |
| Instantanés d'état | `src/net/Snapshot.js` | Message serveur → clients (≈ 20–30 Hz). |
| Transport | `src/net/NetworkTransport.js` | Interface `send / onMessage / pump`, transport local testé. |

## Architecture cible

1. **Serveur autoritaire** (Node.js) : une instance `MatchManager` par partie, sans rendu. Réception des entrées horodatées par tick, simulation, diffusion d'instantanés.
2. **Client** : envoie ses entrées, **prédit** sa voiture localement, garde un historique des entrées ; à réception d'un instantané, remplace l'état, puis **rejoue** les entrées non encore confirmées (réconciliation). Les autres voitures et la balle sont **interpolées** entre deux instantanés (≈ 100 ms de retard).
3. **Transport** : WebSocket (simple, TCP) pour commencer, puis WebRTC DataChannel non fiable (UDP-like) pour réduire la latence. Les deux implémentent l'interface de `NetworkTransport.js`.

## Services à créer

- **Comptes** (anonymes puis liés) → identifiant stable, nécessaire pour amis, classement et sauvegarde cloud.
- **Matchmaking** : file par mode (1v1, 2v2, 3v3) et par cote (Elo/Glicko), bots pour compléter les équipes.
- **Salons / parties privées** : code à 6 caractères, hôte qui choisit mode, arène, durée.
- **Amis** : liste, invitations, présence.
- **Classement** : cote par mode, saisons.
- **Reconnexion** : le serveur garde la voiture (pilotée par un bot) pendant 60 s ; le client se reconnecte avec son jeton de partie et reçoit un instantané complet.
- **Sauvegarde cloud** : implémenter un adaptateur `CloudStorageAdapter` avec `load()` / `save()` et le passer à `new SaveSystem(adapter)`. Fusion : garder le maximum d'XP et l'union des objets débloqués.

## Anti-triche

Serveur autoritaire : le client n'envoie que des entrées bornées (`InputFrame` est quantifié et borné à [-1, 1]), jamais des positions. Les cosmétiques n'ont aucun effet sur la simulation, donc aucune triche possible par ce biais.
