#!/usr/bin/env bash
# Builds the Android APK from the web build.
#   1. copies dist/index.html into the app assets
#   2. runs Gradle (assembleRelease), signed with the development key
# Requires: JDK 17+, Android SDK (ANDROID_HOME or android/local.properties).
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
root="$(cd "$here/.." && pwd)"

if [ ! -f "$root/dist/index.html" ]; then
  echo "dist/index.html missing: run 'npm run build' first" >&2
  exit 1
fi
mkdir -p "$here/app/src/main/assets"
cp "$root/dist/index.html" "$here/app/src/main/assets/index.html"

if [ -z "${ANDROID_HOME:-}" ] && [ ! -f "$here/local.properties" ]; then
  for guess in "$HOME/Android/Sdk" "/opt/android-sdk" "$HOME/Library/Android/sdk"; do
    if [ -d "$guess" ]; then export ANDROID_HOME="$guess"; break; fi
  done
fi

cd "$here"
if [ -x ./gradlew ]; then GRADLE=./gradlew; else GRADLE=gradle; fi
$GRADLE --no-daemon assembleRelease

mkdir -p "$root/release"
cp app/build/outputs/apk/release/app-release.apk "$root/release/NeonCarArena.apk"
echo "APK: release/NeonCarArena.apk ($(du -h "$root/release/NeonCarArena.apk" | cut -f1))"
