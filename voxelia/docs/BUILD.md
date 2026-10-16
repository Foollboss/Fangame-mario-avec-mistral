# Compiler Voxelia

## 1. Version web (PC, navigateur)

Prérequis : Node.js 22 ou plus récent.

```bash
cd voxelia
npm install
npm run build          # produit dist/ (game.js, world.worker.js, index.html…)
npm run dev            # reconstruit à chaque modification + serveur http://localhost:8080
```

Ouvrez `http://localhost:8080` dans Chrome, Edge ou Firefox récent (WebGL 2 obligatoire).
Les mondes sont enregistrés dans le stockage local du navigateur (IndexedDB).

## 2. APK Android (sans Gradle)

Prérequis :

- JDK 17 ou plus récent (`javac` dans le PATH) ;
- Android SDK avec `platforms;android-35` et `build-tools;35.0.0`
  (`sdkmanager "platforms;android-35" "build-tools;35.0.0"`) ;
- la variable `ANDROID_HOME` (par défaut `/opt/android-sdk`).

```bash
cd voxelia
npm run apk            # = npm run build && bash android/build-apk.sh
```

L'APK signé est écrit dans `releases/Voxelia.apk`.

Étapes du script `android/build-apk.sh` : copie de `dist/` dans les assets,
`aapt2` (ressources + manifeste), `javac` (activité `MainActivity`), `d8` (DEX),
`zipalign`, puis `apksigner`.

La clé `android/debug.keystore` (mot de passe `voxelia`) ne sert qu'aux essais.
Pour une version publique, créez votre propre clé :

```bash
keytool -genkeypair -v -keystore ma-cle.jks -alias voxelia -keyalg RSA -keysize 2048 -validity 10000
KEYSTORE=ma-cle.jks KS_PASS=motdepasse KS_ALIAS=voxelia npm run apk
```

### Installation sur le téléphone

1. Copiez `Voxelia.apk` sur le téléphone (ou `adb install releases/Voxelia.apk`).
2. Autorisez l'installation d'applications de source inconnue pour votre gestionnaire de fichiers.
3. Ouvrez l'APK. Android 7.0 (API 24) minimum, OpenGL ES 3.0 requis.

## 3. Serveur multijoueur

Voir [`server/README.md`](../server/README.md).

## 4. Tests

```bash
npm test               # tests unitaires (vitest)
npm run typecheck      # vérification TypeScript
npm run build && npm run e2e   # partie complète dans Chromium sans écran (captures dans test-results/e2e/)
```
