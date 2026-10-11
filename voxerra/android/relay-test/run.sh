#!/usr/bin/env bash
# Essai du relais réseau de l'appli (LanRelay.java) sur la JVM, sans téléphone ni émulateur :
# doublures des classes Android utilisées, vrais clients WebSocket pour l'hôte et un invité.
#   android/relay-test/run.sh   (après un « ./gradlew assembleRelease », pour les bibliothèques)
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
out="$(mktemp -d)"
trap 'rm -rf "$out"' EXIT
jar() { find ~/.gradle/caches/modules-2/files-2.1 -name "$1" | head -1; }
ws="$(jar 'Java-WebSocket-1.6.0.jar')"
slf="$(jar 'slf4j-api-2*.jar')"
json="${JSON_JAR:-$out/json.jar}"
if [ ! -f "$json" ]; then
  for i in 1 2 4 8 16; do
    curl -sS -o "$json" https://repo1.maven.org/maven2/org/json/json/20240303/json-20240303.jar && unzip -tq "$json" >/dev/null 2>&1 && break
    sleep "$i"
  done
fi
cp="$ws:$slf:$json"
javac -encoding UTF-8 -nowarn -d "$out" -cp "$cp" \
  "$here"/stubs/android/content/Context.java "$here"/stubs/android/net/wifi/WifiManager.java \
  "$here"/../app/src/main/java/io/github/fullboss971/voxerra/LanRelay.java "$here"/LanRelayTest.java
java -Dstdout.encoding=UTF-8 -Dfile.encoding=UTF-8 -cp "$out:$cp" io.github.fullboss971.voxerra.LanRelayTest
