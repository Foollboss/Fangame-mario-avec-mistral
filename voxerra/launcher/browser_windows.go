package main

import (
	"errors"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"unsafe"
)

// Fenêtre d'application Edge (présent sur Windows 10 et 11), sinon Chrome,
// sinon le navigateur par défaut.
func openWindow(url string) error {
	var candidates []string
	for _, env := range []string{"ProgramFiles(x86)", "ProgramFiles", "LocalAppData"} {
		base := os.Getenv(env)
		if base == "" {
			continue
		}
		candidates = append(candidates,
			filepath.Join(base, `Microsoft\Edge\Application\msedge.exe`),
			filepath.Join(base, `Google\Chrome\Application\chrome.exe`),
		)
	}
	if p := os.Getenv("VOXERRA_BROWSER"); p != "" {
		candidates = append([]string{p}, candidates...)
	}
	for _, c := range candidates {
		if _, err := os.Stat(c); err == nil {
			args := append([]string{
				"--app=" + url,
				"--window-size=1280,760",
				"--no-first-run",
				"--no-default-browser-check",
				"--autoplay-policy=no-user-gesture-required",
			}, extraArgs()...)
			cmd := exec.Command(c, args...)
			if err := cmd.Start(); err == nil {
				return nil
			}
		}
	}
	// navigateur par défaut
	cmd := exec.Command("rundll32", "url.dll,FileProtocolHandler", url)
	if err := cmd.Start(); err != nil {
		return errors.New("ni Microsoft Edge, ni Google Chrome, ni navigateur par défaut")
	}
	return nil
}

func fail(msg string) {
	user32 := syscall.NewLazyDLL("user32.dll")
	box := user32.NewProc("MessageBoxW")
	t, _ := syscall.UTF16PtrFromString(msg)
	c, _ := syscall.UTF16PtrFromString("Voxerra")
	box.Call(0, uintptr(unsafe.Pointer(t)), uintptr(unsafe.Pointer(c)), 0x10)
}
