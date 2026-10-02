#!/usr/bin/env bash
# Construit l'APK de Teyvat Pixel sans Gradle (aapt2 + javac + d8 + apksigner).
# Prérequis : JDK 11+ et Android SDK (platforms;android-34, build-tools;34.0.0).
#   export ANDROID_HOME=/chemin/vers/sdk
#   ./android/build-apk.sh [sortie.apk]
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:?définissez ANDROID_HOME}}"
BT="$(ls -d "$SDK"/build-tools/* | sort -V | tail -1)"
JAR="$SDK/platforms/android-34/android.jar"
OUT="${1:-$HERE/build/teyvat-pixel.apk}"
B="$HERE/build"
rm -rf "$B"; mkdir -p "$B/assets" "$B/classes" "$B/gen"

# 1. Les fichiers du jeu deviennent les « assets » de l'appli
cp -r "$ROOT/index.html" "$ROOT/css" "$ROOT/js" "$B/assets/"

# 2. Ressources + manifeste
"$BT/aapt2" compile --dir "$HERE/app/src/main/res" -o "$B/res.zip"
"$BT/aapt2" link -I "$JAR" --manifest "$HERE/app/src/main/AndroidManifest.xml" \
  -A "$B/assets" -R "$B/res.zip" --min-sdk-version 21 --target-sdk-version 34 \
  --version-code 1 --version-name 1.0 --java "$B/gen" -o "$B/base.apk"

# 3. Java -> DEX
javac --release 8 -g:none -Xlint:-options -classpath "$JAR" -d "$B/classes" \
  $(find "$HERE/app/src/main/java" "$B/gen" -name '*.java')
"$BT/d8" --release --min-api 21 --lib "$JAR" --output "$B" $(find "$B/classes" -name '*.class')

# 4. Assemblage, alignement, signature
cp "$B/base.apk" "$B/app.apk"
(cd "$B" && zip -q -j app.apk classes.dex)
"$BT/zipalign" -f -p 4 "$B/app.apk" "$B/aligned.apk"
KS="${KEYSTORE:-$HERE/teyvat-pixel.jks}"
if [ ! -f "$KS" ]; then
  keytool -genkeypair -keystore "$KS" -alias teyvat -keyalg RSA -keysize 2048 -validity 36500 \
    -storepass teyvatpixel -keypass teyvatpixel -dname "CN=Teyvat Pixel (fan game), O=Fan project" >/dev/null 2>&1
fi
"$BT/apksigner" sign --ks "$KS" --ks-pass pass:"${KS_PASS:-teyvatpixel}" --key-pass pass:"${KS_PASS:-teyvatpixel}" \
  --ks-key-alias teyvat --out "$OUT" "$B/aligned.apk"
"$BT/apksigner" verify --verbose "$OUT" | head -5
echo "APK prêt : $OUT"
