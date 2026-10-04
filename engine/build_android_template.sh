#!/usr/bin/env bash
# Compile un modèle d'export Android allégé (Godot 4.7.2, rendu GL Compatibility seul)
# et l'emballe dans game/android_template/android_release.apk.
#
# Prérequis : sources de Godot 4.7.2 (godot-4.7.2-stable.tar.xz), SCons, Android SDK avec le
# NDK 29.0.14206865, et les modèles d'export officiels 4.7.2 installés (pour la partie Java).
#
#   ANDROID_HOME=/opt/android/sdk GODOT_SRC=/opt/build/godot-4.7.2-stable ./engine/build_android_template.sh
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$HERE")"
: "${GODOT_SRC:?chemin des sources de Godot 4.7.2}"
: "${ANDROID_HOME:?chemin du SDK Android}"
TPL="${GODOT_TEMPLATES:-$HOME/.local/share/godot/export_templates/4.7.2.stable}"

cp "$HERE/custom_aetheria.py" "$GODOT_SRC/"
cd "$GODOT_SRC"
scons platform=android target=template_release arch=arm64 profile=custom_aetheria.py lto=full -j"$(nproc)"

SO="$GODOT_SRC/bin/libgodot.android.template_release.arm64.so"
[ -f "$SO" ] || SO="$(ls "$GODOT_SRC"/bin/libgodot.android.template_release.arm64*.so | head -1)"
OUT="$ROOT/game/android_template"
mkdir -p "$OUT" && rm -rf "$OUT/tmp" && mkdir -p "$OUT/tmp/lib/arm64-v8a"
cp "$TPL/android_release.apk" "$OUT/android_release.apk"
cp "$SO" "$OUT/tmp/lib/arm64-v8a/libgodot_android.so"
"$ANDROID_HOME"/ndk/*/toolchains/llvm/prebuilt/linux-x86_64/bin/llvm-strip --strip-unneeded "$OUT/tmp/lib/arm64-v8a/libgodot_android.so"
# on ne remplace que le moteur arm64 (libc++_shared.so et le code Java restent ceux du modèle officiel)
(cd "$OUT/tmp" && zip -q -d "$OUT/android_release.apk" 'lib/arm64-v8a/libgodot_android.so' && zip -q -9 "$OUT/android_release.apk" lib/arm64-v8a/libgodot_android.so)
rm -rf "$OUT/tmp"
echo "Modèle prêt : $OUT/android_release.apk (à indiquer dans custom_template/release du préréglage Android)"
