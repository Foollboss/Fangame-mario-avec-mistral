package main

import (
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"syscall"
	"unsafe"
)

// Fenêtre d'application Edge (présent sur Windows 10 et 11), sinon Chrome,
// sinon le navigateur par défaut : affichage de secours sans WebView2.
func openWindow(url string) error {
	return openApp(url, 1280, 760)
}

// Ancienne fenêtre (transfert des mondes) : le même navigateur que l'ancienne version, donc le même profil.
func openOldWindow(url string) error {
	return openApp(url, 560, 360)
}

func openApp(url string, w, h int) error {
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
				fmt.Sprintf("--window-size=%d,%d", w, h),
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

// Profils où l'ancienne version a pu ranger les mondes (Edge, sinon Chrome).
func oldUserDataDirs() []string {
	base := os.Getenv("LocalAppData")
	if base == "" {
		return nil
	}
	return []string{
		filepath.Join(base, `Microsoft\Edge\User Data`),
		filepath.Join(base, `Google\Chrome\User Data`),
	}
}

var user32 = syscall.NewLazyDLL("user32.dll")

// Autorise l'instance déjà lancée à passer au premier plan.
func allowForeground() {
	user32.NewProc("AllowSetForegroundWindow").Call(^uintptr(0)) // ASFW_ANY
}

func fail(msg string) {
	box := user32.NewProc("MessageBoxW")
	t, _ := syscall.UTF16PtrFromString(msg)
	c, _ := syscall.UTF16PtrFromString("Voxerra")
	box.Call(0, uintptr(unsafe.Pointer(t)), uintptr(unsafe.Pointer(c)), 0x10)
}
