#!/usr/bin/env bash
# Construit l'APK Android de Voxelia sans Gradle :
#   javac -> d8 (dex) -> aapt2 (ressources + assets) -> zipalign -> apksigner
#
# Prérequis : JDK 17+, Android SDK avec "platforms;android-35" et "build-tools;35.0.0".
# Variables : ANDROID_HOME (défaut /opt/android-sdk), KEYSTORE, KS_PASS, KS_ALIAS.
# Le jeu web doit avoir été construit au préalable (npm run build -> ../dist).
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"

SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-/opt/android-sdk}}"
BT_VERSION="${BUILD_TOOLS_VERSION:-35.0.0}"
PLATFORM="${ANDROID_PLATFORM:-android-35}"
BT="$SDK/build-tools/$BT_VERSION"
PLAT_JAR="$SDK/platforms/$PLATFORM/android.jar"
KEYSTORE="${KEYSTORE:-$HERE/debug.keystore}"
KS_PASS="${KS_PASS:-voxelia}"
KS_ALIAS="${KS_ALIAS:-voxelia}"
WEB_DIST="${WEB_DIST:-$HERE/../dist}"
OUT_APK="${OUT_APK:-$HERE/../releases/Voxelia.apk}"

for f in "$BT/aapt2" "$BT/d8" "$BT/zipalign" "$BT/apksigner" "$PLAT_JAR"; do
  [ -e "$f" ] || { echo "Introuvable : $f (installez le SDK Android, voir docs/BUILD.md)"; exit 1; }
done
[ -f "$WEB_DIST/index.html" ] || { echo "Jeu web absent : lancez d'abord 'npm run build'"; exit 1; }

B="$HERE/build"
rm -rf "$B"
mkdir -p "$B/classes" "$B/assets/www" "$B/compiled" "$(dirname "$OUT_APK")"

echo "• Copie du jeu web dans les assets"
cp -r "$WEB_DIST"/. "$B/assets/www/"

echo "• Compilation des ressources (aapt2)"
"$BT/aapt2" compile --dir res -o "$B/compiled/res.zip"
"$BT/aapt2" link -o "$B/app-unaligned.apk" -I "$PLAT_JAR" \
  --manifest AndroidManifest.xml \
  --min-sdk-version 24 --target-sdk-version 35 \
  -A "$B/assets" "$B/compiled/res.zip" --auto-add-overlay

echo "• Compilation Java"
javac -nowarn -source 11 -target 11 -encoding UTF-8 -classpath "$PLAT_JAR" -d "$B/classes" \
  $(find src -name '*.java') 2>&1 | grep -v -E 'bootstrap class path|^1 warning|source value 11|target value 11|To suppress warnings' || true
[ -n "$(find "$B/classes" -name '*.class')" ] || { echo "Échec de la compilation Java"; exit 1; }

echo "• Conversion en DEX (d8)"
"$BT/d8" --release --min-api 24 --lib "$PLAT_JAR" --output "$B" $(find "$B/classes" -name '*.class')

echo "• Assemblage"
(cd "$B" && zip -q -u app-unaligned.apk classes.dex)
"$BT/zipalign" -p -f 4 "$B/app-unaligned.apk" "$B/app-aligned.apk"

echo "• Signature"
"$BT/apksigner" sign --ks "$KEYSTORE" --ks-pass "pass:$KS_PASS" --ks-key-alias "$KS_ALIAS" \
  --out "$OUT_APK" "$B/app-aligned.apk"
"$BT/apksigner" verify "$OUT_APK"

echo "APK prêt : $OUT_APK ($(du -h "$OUT_APK" | cut -f1))"
