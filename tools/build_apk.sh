#!/bin/bash
# Construit l'APK Android (Godot 4.7 + Gradle, minSdk 33 = Android 13, targetSdk 35).
# Prérequis : Godot 4.7.2 + modèles d'export, SDK Android (build-tools 35, platform 35), JDK 17+.
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GODOT="${GODOT:-godot}"
export GODOT_ANDROID_KEYSTORE_RELEASE_PATH="$ROOT/keystore/fangame-release.keystore"
export GODOT_ANDROID_KEYSTORE_RELEASE_USER="fangame"
export GODOT_ANDROID_KEYSTORE_RELEASE_PASSWORD="fangame-unite"
mkdir -p "$ROOT/release"
cd "$ROOT/game"
"$GODOT" --headless --path . --import
if [ ! -d android/build ]; then
  "$GODOT" --headless --path . --install-android-build-template --export-release "Android" "$ROOT/release/AsphaltUniteFangame.apk"
else
  "$GODOT" --headless --path . --export-release "Android" "$ROOT/release/AsphaltUniteFangame.apk"
fi
ls -la "$ROOT/release/AsphaltUniteFangame.apk"
