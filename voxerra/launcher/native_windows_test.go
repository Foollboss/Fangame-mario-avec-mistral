package main

// Essai de la fenêtre native sans WebView2 (création, taille minimale, plein écran, fermeture,
// position retrouvée). Depuis Linux, avec Wine :
//   GOOS=windows go test -c -o fenetre_test.exe && xvfb-run -a wine64 fenetre_test.exe -test.v

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"testing"
	"time"
	"unsafe"
)

var (
	pIsWindowVisible = user32.NewProc("IsWindowVisible")
	pIsZoomed        = user32.NewProc("IsZoomed")
	pGetWindowRect   = user32.NewProc("GetWindowRect")
	pPeekMessageW    = user32.NewProc("PeekMessageW")
	pIsWindow        = user32.NewProc("IsWindow")
)

const wsCaption = 0x00C00000

func windowRect(hwnd uintptr) rect {
	var r rect
	pGetWindowRect.Call(hwnd, uintptr(unsafe.Pointer(&r)))
	return r
}

func style(hwnd uintptr) uintptr {
	s, _, _ := pGetWindowLongPtrW.Call(hwnd, gwlStyle)
	return s
}

// Traite les messages en attente jusqu'à ce que cond soit vraie (ou WM_QUIT).
func pump(t *testing.T, cond func() bool) (quit bool) {
	t.Helper()
	deadline := time.Now().Add(5 * time.Second)
	var m msg
	for time.Now().Before(deadline) {
		for {
			r, _, _ := pPeekMessageW.Call(uintptr(unsafe.Pointer(&m)), 0, 0, 0, 1) // PM_REMOVE
			if r == 0 {
				break
			}
			if m.Message == 0x0012 { // WM_QUIT
				return true
			}
			pTranslateMessage.Call(uintptr(unsafe.Pointer(&m)))
			pDispatchMessageW.Call(uintptr(unsafe.Pointer(&m)))
		}
		if cond != nil && cond() {
			return false
		}
		time.Sleep(10 * time.Millisecond)
	}
	t.Fatal("délai dépassé")
	return false
}

func TestFenetre(t *testing.T) {
	runtime.LockOSThread()
	defer runtime.UnlockOSThread()
	dir := t.TempDir()

	// 1) première ouverture : centrée, à la taille de départ (ou 90 % de l'écran)
	w := &nativeWindow{dir: dir}
	win = w
	if !w.create() {
		t.Fatal("fenêtre non créée")
	}
	w.show()
	pump(t, func() bool { v, _, _ := pIsWindowVisible.Call(w.hwnd); return v != 0 })
	r := windowRect(w.hwnd)
	t.Logf("fenêtre : %dx%d en (%d, %d)", r.Right-r.Left, r.Bottom-r.Top, r.Left, r.Top)
	if r.Right-r.Left < minWidth || r.Bottom-r.Top < minHeight {
		t.Errorf("fenêtre trop petite : %+v", r)
	}
	if style(w.hwnd)&wsCaption == 0 {
		t.Error("la fenêtre devrait avoir une barre de titre")
	}

	// 2) taille minimale
	pSetWindowPos.Call(w.hwnd, 0, 0, 0, 200, 150, swpNoMove|swpNoZOrder)
	pump(t, func() bool { return true })
	if s := windowRect(w.hwnd); s.Right-s.Left < minWidth || s.Bottom-s.Top < minHeight {
		t.Errorf("taille minimale non respectée : %dx%d", s.Right-s.Left, s.Bottom-s.Top)
	}
	pSetWindowPos.Call(w.hwnd, 0, uintptr(r.Left), uintptr(r.Top), uintptr(r.Right-r.Left), uintptr(r.Bottom-r.Top), swpNoZOrder)
	pump(t, func() bool { return true })

	// 3) F11 (message posté par l'évènement de touche) : plein écran sans bordure, puis retour
	pPostMessageW.Call(w.hwnd, wmAppFullscreen, 2, 0)
	pump(t, func() bool { return w.fullscreen })
	mi := monitorInfo{}
	mi.Size = uint32(unsafe.Sizeof(mi))
	mon, _, _ := pMonitorFromWindow.Call(w.hwnd, monitorToNearest)
	pGetMonitorInfoW.Call(mon, uintptr(unsafe.Pointer(&mi)))
	if f := windowRect(w.hwnd); f != mi.Monitor || style(w.hwnd)&wsCaption != 0 {
		t.Errorf("plein écran : %+v (écran %+v), style %#x", f, mi.Monitor, style(w.hwnd))
	}
	pPostMessageW.Call(w.hwnd, wmAppFullscreen, 2, 0)
	pump(t, func() bool { return !w.fullscreen })
	if b := windowRect(w.hwnd); b != r || style(w.hwnd)&wsCaption == 0 {
		t.Errorf("retour du plein écran : %+v au lieu de %+v", b, r)
	}
	// demandé par la page (élément en plein écran), deux fois de suite : sans effet la 2e fois
	pPostMessageW.Call(w.hwnd, wmAppFullscreen, 1, 0)
	pPostMessageW.Call(w.hwnd, wmAppFullscreen, 1, 0)
	pump(t, func() bool { return w.fullscreen })

	// 4) deuxième lancement : la fenêtre revient au premier plan (sans planter si elle est réduite)
	pShowWindow.Call(w.hwnd, 6) // SW_MINIMIZE
	pPostMessageW.Call(w.hwnd, wmAppFocus, 0, 0)
	pump(t, func() bool { z, _, _ := pIsIconic.Call(w.hwnd); return z == 0 })

	// 5) fermeture (croix) : fenêtre détruite, position enregistrée (celle d'avant le plein écran)
	pPostMessageW.Call(w.hwnd, wmClose, 0, 0)
	if !pump(t, nil) {
		t.Fatal("la boucle de messages ne s'arrête pas")
	}
	if ok, _, _ := pIsWindow.Call(w.hwnd); ok != 0 {
		t.Error("fenêtre toujours là")
	}
	b, err := os.ReadFile(filepath.Join(dir, "fenetre.json"))
	if err != nil {
		t.Fatal("position non enregistrée :", err)
	}
	var saved struct {
		Left, Top, Right, Bottom int32
		Max                      bool
	}
	json.Unmarshal(b, &saved)
	t.Logf("enregistré : %s", b)
	if saved.Right-saved.Left != r.Right-r.Left || saved.Bottom-saved.Top != r.Bottom-r.Top || saved.Max {
		t.Errorf("position enregistrée %+v, attendu la taille de %+v", saved, r)
	}

	// 6) relance : position et état « agrandie » retrouvés
	os.WriteFile(filepath.Join(dir, "fenetre.json"), []byte(`{"Left":60,"Top":40,"Right":960,"Bottom":640,"Max":false}`), 0o644)
	w2 := &nativeWindow{dir: dir}
	win = w2
	if !w2.create() {
		t.Fatal("2e fenêtre non créée")
	}
	w2.show()
	pump(t, func() bool { v, _, _ := pIsWindowVisible.Call(w2.hwnd); return v != 0 })
	if got := windowRect(w2.hwnd); got.Right-got.Left != 900 || got.Bottom-got.Top != 600 {
		t.Errorf("position retrouvée : %+v", got)
	}
	w2.destroy()
	pump(t, nil)

	os.WriteFile(filepath.Join(dir, "fenetre.json"), []byte(`{"Left":60,"Top":40,"Right":960,"Bottom":640,"Max":true}`), 0o644)
	w3 := &nativeWindow{dir: dir}
	win = w3
	w3.create()
	w3.show()
	pump(t, func() bool { z, _, _ := pIsZoomed.Call(w3.hwnd); return z != 0 })
	// position hors de tout écran : ignorée, fenêtre centrée
	w3.destroy()
	pump(t, nil)
	os.WriteFile(filepath.Join(dir, "fenetre.json"), []byte(`{"Left":-30000,"Top":-30000,"Right":-29000,"Bottom":-29300,"Max":false}`), 0o644)
	w4 := &nativeWindow{dir: dir}
	win = w4
	w4.create()
	w4.show()
	pump(t, func() bool { v, _, _ := pIsWindowVisible.Call(w4.hwnd); return v != 0 })
	if got := windowRect(w4.hwnd); got.Left < -1000 {
		t.Errorf("fenêtre placée hors écran : %+v", got)
	}
	w4.destroy()
	pump(t, nil)
}
