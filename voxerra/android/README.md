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

## Construire

Il faut un JDK 17+ et le SDK Android (plateforme `android-36`), indiqué par `ANDROID_HOME` ou
`local.properties` (`sdk.dir=…`).

```bash
cd voxerra
npm install
npm run build:apk          # → android/app/build/outputs/apk/release/app-release.apk
```

## Signature

L'APK est signé avec `app/voxerra.keystore` (mot de passe `voxerra`). C'est une **clé de développement
publique**, versionnée pour que chaque nouvelle version s'installe par-dessus l'ancienne sans perdre les mondes.
Pour une publication sur un magasin d'applications, créez votre propre clé et gardez-la secrète.

Installation sur le téléphone : copier l'APK, l'ouvrir et autoriser « Installer des applis inconnues »
pour le gestionnaire de fichiers ou le navigateur utilisé.
