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
	candidates := []string{os.Getenv("VOXERRA_BROWSER"), "chromium", "chromium-browser", "google-chrome", "microsoft-edge"}
	for _, c := range candidates {
		if c == "" {
			continue
		}
		p, err := exec.LookPath(c)
		if err != nil {
			continue
		}
		args := append([]string{"--app=" + url, "--window-size=1280,760", "--no-first-run", "--no-default-browser-check"}, extraArgs()...)
		if err := exec.Command(p, args...).Start(); err == nil {
			return nil
		}
	}
	if err := exec.Command("xdg-open", url).Start(); err != nil {
		return errors.New("aucun navigateur trouvé")
	}
	return nil
}

func fail(msg string) {
	fmt.Fprintln(os.Stderr, msg)
}
