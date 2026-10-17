//go:build !windows

package main

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
)

// Hors Windows (essais) : Chromium / Chrome en mode application.
func openWindow(url string) error {
	return openApp(url, 1280, 760)
}

// Essais : l'« ancien » profil est celui de VOXERRA_BROWSER_ARGS (--user-data-dir).
func openOldWindow(url string) error {
	return openApp(url, 560, 360)
}

func openApp(url string, w, h int) error {
	candidates := []string{os.Getenv("VOXERRA_BROWSER"), "chromium", "chromium-browser", "google-chrome", "microsoft-edge"}
	for _, c := range candidates {
		if c == "" {
			continue
		}
		p, err := exec.LookPath(c)
		if err != nil {
			continue
		}
		args := append([]string{"--app=" + url, fmt.Sprintf("--window-size=%d,%d", w, h), "--no-first-run", "--no-default-browser-check"}, extraArgs()...)
		if err := exec.Command(p, args...).Start(); err == nil {
			return nil
		}
	}
	if err := exec.Command("xdg-open", url).Start(); err != nil {
		return errors.New("aucun navigateur trouvé")
	}
	return nil
}

// Essais : VOXERRA_ANCIEN_PROFIL, dossier de profil Chromium de l'« ancienne version ».
func oldUserDataDirs() []string {
	if d := os.Getenv("VOXERRA_ANCIEN_PROFIL"); d != "" {
		return []string{d}
	}
	return nil
}

func allowForeground() {}

// Pas de fenêtre native hors Windows.
func runNative(s *state, url string) bool {
	return false
}

func fail(msg string) {
	fmt.Fprintln(os.Stderr, msg)
}
