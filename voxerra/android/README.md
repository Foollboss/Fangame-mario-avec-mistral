# Voxerra — version Android (.apk)

Une activité plein écran avec une WebView qui charge le jeu autonome (`../Voxerra.html`, copié dans les
assets au moment de la construction). Le jeu est servi en `https://appassets.androidplatform.net/` pour que
les sauvegardes (IndexedDB) et les workers fonctionnent comme dans un navigateur.

- Android 7 (API 24) ou plus récent, WebView (Chrome) à jour, OpenGL ES 3 (WebGL 2).
- Paysage, plein écran, écran maintenu allumé ; contrôles tactiles (joystick) toujours activés au lancement
  (l'appli ajoute `VoxerraApp/Android` à l'agent utilisateur, que le jeu reconnaît).
- Bouton Retour : Échap du jeu (menu pause, fermer un écran) ; depuis l'écran titre, met l'appli en arrière-plan.
- Le monde est sauvegardé quand l'appli passe en arrière-plan ; « Quitter le jeu » ferme l'appli.
- Tout l'écran, y compris sous l'encoche de la caméra : l'appli transmet sa taille au jeu (variables CSS
  `--app-inset-*`), qui en écarte le joystick, les boutons et les textes des coins.
- Le clavier du téléphone réduit la zone de jeu : la saisie de la discussion reste visible.
- Fichiers : **Importer un pack JSON…** ouvre le sélecteur de documents d'Android (tous les types de fichiers
  sont proposés, car un `.json` n'a pas toujours le bon type selon le gestionnaire) ; l'export d'un monde et
  les captures d'écran passent par **Enregistrer sous** (la WebView ne sait pas télécharger). Le jeu les demande
  à l'appli par le pont `voxerraHost.openTextFile` / `saveFile` ([`src/app/files.ts`](../src/app/files.ts)) ;
  un `<input type="file">` ordinaire est aussi pris en charge.
- **Ouvrir au réseau local** (menu pause) : l'appli relaie les amis du même Wi-Fi vers le serveur intégré à la
  page du jeu ([`LanRelay.java`](app/src/main/java/io/github/fullboss971/voxerra/LanRelay.java), même protocole
  que le lanceur Windows : PC et téléphones jouent ensemble). Port 25590 (WebSocket) ouvert le temps de la partie,
  annonce et découverte sur le port UDP 25591 ; la page se connecte au relais par `ws://127.0.0.1:47184/hote`
  (origine vérifiée). Permissions : Internet, état du réseau et du Wi-Fi, multidiffusion Wi-Fi (pour recevoir les
  annonces). La partie se met en pause si l'appli de l'hôte passe en arrière-plan.

## Construire

Il faut un JDK 17+ et le SDK Android (plateforme `android-36`), indiqué par `ANDROID_HOME` ou
`local.properties` (`sdk.dir=…`).

```bash
cd voxerra
npm install
npm run build:apk          # → android/app/build/outputs/apk/release/app-release.apk
```

Le relais réseau s'essaie sur la JVM, sans téléphone (doublures des classes Android, vrais clients WebSocket) :

```bash
android/relay-test/run.sh   # après un premier « npm run build:apk » (bibliothèques dans le cache Gradle)
```

Le pont « fichiers », vu du jeu (pack importé puis actif après **Relancer le jeu**, choix annulé, export,
capture d'écran) : `npm run build:html && node android/test-pont-fichiers.mjs`.

## Signature

L'APK est signé avec `app/voxerra.keystore` (mot de passe `voxerra`). C'est une **clé de développement
publique**, versionnée pour que chaque nouvelle version s'installe par-dessus l'ancienne sans perdre les mondes.
Pour une publication sur un magasin d'applications, créez votre propre clé et gardez-la secrète.

Installation sur le téléphone : copier l'APK, l'ouvrir et autoriser « Installer des applis inconnues »
pour le gestionnaire de fichiers ou le navigateur utilisé.
