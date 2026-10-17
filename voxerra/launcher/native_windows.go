package main

// Fenêtre de l'application : une fenêtre Windows ordinaire (titre, icône, redimensionnable) qui
// affiche le jeu avec WebView2, le moteur d'Edge fourni avec Windows 10 et 11. Pas de barre
// d'adresse, de menu ni de raccourcis de navigateur. F11 : plein écran. Fermer la fenêtre
// sauvegarde le monde en cours. Les données du jeu sont dans %LOCALAPPDATA%\Voxerra\WebView2.

import (
	"encoding/json"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"unsafe"

	"github.com/wailsapp/go-webview2/pkg/edge"
	"github.com/wailsapp/go-webview2/webviewloader"
	"golang.org/x/sys/windows"
)

// La fenêtre et WebView2 vivent sur le fil principal (COM, file de messages).
func init() { runtime.LockOSThread() }

var (
	gdi32                  = windows.NewLazySystemDLL("gdi32.dll")
	pCreateSolidBrush      = gdi32.NewProc("CreateSolidBrush")
	pRegisterClassExW      = user32.NewProc("RegisterClassExW")
	pCreateWindowExW       = user32.NewProc("CreateWindowExW")
	pDefWindowProcW        = user32.NewProc("DefWindowProcW")
	pDestroyWindow         = user32.NewProc("DestroyWindow")
	pShowWindow            = user32.NewProc("ShowWindow")
	pPostQuitMessage       = user32.NewProc("PostQuitMessage")
	pGetMessageW           = user32.NewProc("GetMessageW")
	pTranslateMessage      = user32.NewProc("TranslateMessage")
	pDispatchMessageW      = user32.NewProc("DispatchMessageW")
	pPostMessageW          = user32.NewProc("PostMessageW")
	pSetTimer              = user32.NewProc("SetTimer")
	pKillTimer             = user32.NewProc("KillTimer")
	pLoadImageW            = user32.NewProc("LoadImageW")
	pLoadCursorW           = user32.NewProc("LoadCursorW")
	pGetSystemMetrics      = user32.NewProc("GetSystemMetrics")
	pSetWindowPos          = user32.NewProc("SetWindowPos")
	pGetWindowLongPtrW     = user32.NewProc("GetWindowLongPtrW")
	pSetWindowLongPtrW     = user32.NewProc("SetWindowLongPtrW")
	pGetWindowPlacement    = user32.NewProc("GetWindowPlacement")
	pSetWindowPlacement    = user32.NewProc("SetWindowPlacement")
	pMonitorFromWindow     = user32.NewProc("MonitorFromWindow")
	pMonitorFromRect       = user32.NewProc("MonitorFromRect")
	pGetMonitorInfoW       = user32.NewProc("GetMonitorInfoW")
	pSetForegroundWindow   = user32.NewProc("SetForegroundWindow")
	pIsIconic              = user32.NewProc("IsIconic")
	pGetDpiForWindow       = user32.NewProc("GetDpiForWindow")
	pGetDpiForSystem       = user32.NewProc("GetDpiForSystem")
	pSystemParametersInfoW = user32.NewProc("SystemParametersInfoW")
)

const (
	wsOverlappedWindow = 0x00CF0000
	cwUseDefault       = -0x80000000
	gwlStyle           = ^uintptr(15) // -16

	wmDestroy       = 0x0002
	wmMove          = 0x0003
	wmSize          = 0x0005
	wmSetFocus      = 0x0007
	wmClose         = 0x0010
	wmGetMinMaxInfo = 0x0024
	wmTimer         = 0x0113
	wmMoving        = 0x0216
	wmDpiChanged    = 0x02E0
	wmApp           = 0x8000
	wmAppClose      = wmApp + 1 // fermer (sauvegarde d'abord)
	wmAppFocus      = wmApp + 2 // revenir au premier plan
	wmAppDestroy    = wmApp + 3 // fermer tout de suite (monde sauvegardé)
	wmAppFullscreen = wmApp + 4 // wParam : 0 fenêtre, 1 plein écran, 2 bascule
	wmAppReload     = wmApp + 5 // recharger la page (plantée)
	sizeMinimized   = 1

	swHide          = 0
	swShowNormal    = 1
	swShowMaximized = 3
	swRestore       = 9

	swpNoSize        = 0x0001
	swpNoMove        = 0x0002
	swpNoZOrder      = 0x0004
	swpNoActivate    = 0x0010
	swpFrameChanged  = 0x0020
	swpNoOwnerZOrder = 0x0200
	monitorToNull    = 0
	monitorToNearest = 2
	spiGetWorkArea   = 0x0030
	imageIcon        = 1
	lrDefaultSize    = 0x0040
	lrShared         = 0x8000
	smCxSmIcon       = 49
	smCySmIcon       = 50
	vkF11            = 0x7A
	closeTimer       = 1
	closeTimeoutMs   = 5000
	minWidth         = 800
	minHeight        = 500
	startWidth       = 1280
	startHeight      = 760
)

type point struct{ X, Y int32 }

type rect struct{ Left, Top, Right, Bottom int32 }

type msg struct {
	Hwnd     uintptr
	Message  uint32
	WParam   uintptr
	LParam   uintptr
	Time     uint32
	Pt       point
	LPrivate uint32
}

type wndClassEx struct {
	Size       uint32
	Style      uint32
	WndProc    uintptr
	ClsExtra   int32
	WndExtra   int32
	Instance   uintptr
	Icon       uintptr
	Cursor     uintptr
	Background uintptr
	MenuName   *uint16
	ClassName  *uint16
	IconSm     uintptr
}

type minMaxInfo struct {
	Reserved     point
	MaxSize      point
	MaxPosition  point
	MinTrackSize point
	MaxTrackSize point
}

type windowPlacement struct {
	Length         uint32
	Flags          uint32
	ShowCmd        uint32
	MinPosition    point
	MaxPosition    point
	NormalPosition rect
}

type monitorInfo struct {
	Size    uint32
	Monitor rect
	Work    rect
	Flags   uint32
}

// Script lu avant la page : fenêtre native, « Quitter le jeu » passe par la fenêtre.
const nativeBridge = `window.voxerraHost = {
  nativeWindow: true,
  quit: function () { window.chrome.webview.postMessage('voxerra:quitter'); }
};`

// Fermeture : le monde en cours (et la partie ouverte au réseau) est sauvegardé, puis la page prévient.
const closeScript = `(function () {
  var v = window.voxerra, p = [];
  try {
    if (v && v.game) p.push(v.game.save());
    if (v && v.lanHost) p.push(v.lanHost.stop());
  } catch (e) {}
  Promise.all(p).catch(function () {}).then(function () { window.chrome.webview.postMessage('voxerra:ferme'); });
})();`

type nativeWindow struct {
	hwnd       uintptr
	chromium   *edge.Chromium
	ready      bool
	closing    bool
	destroyed  bool
	fullscreen bool
	saved      windowPlacement // avant le plein écran
	savedStyle uintptr
	dir        string
	url        string
	crashed    bool
}

var win *nativeWindow

// Affiche le jeu dans la fenêtre native jusqu'à sa fermeture. false : WebView2 indisponible
// (rien n'a été affiché), l'appelant ouvre alors une fenêtre de navigateur.
func runNative(s *state, url string) bool {
	if os.Getenv("VOXERRA_NAVIGATEUR") != "" {
		return false
	}
	// VOXERRA_WEBVIEW2 : dossier d'un WebView2 « version fixe » au lieu de celui de Windows (essais)
	runtimeDir := os.Getenv("VOXERRA_WEBVIEW2")
	if v, err := webviewloader.GetAvailableCoreWebView2BrowserVersionString(runtimeDir); err != nil || v == "" {
		return false
	}
	w := &nativeWindow{dir: dataDir()}
	win = w
	os.MkdirAll(w.dir, 0o755)
	if !w.create() {
		return false
	}
	debug := os.Getenv("VOXERRA_DEBUG") != ""

	c := edge.NewChromium()
	w.chromium = c
	c.DataPath = filepath.Join(w.dir, "WebView2")
	c.BrowserPath = runtimeDir
	c.AdditionalBrowserArgs = append([]string{"--autoplay-policy=no-user-gesture-required"}, strings.Fields(os.Getenv("VOXERRA_WEBVIEW2_ARGS"))...)
	c.SetErrorCallback(func(err error) {
		if w.ready {
			if !w.destroyed {
				fail("Voxerra s'est arrêté : " + err.Error())
			}
			return
		}
		// WebView2 inutilisable : fenêtre de navigateur à la place (ne revient pas)
		pShowWindow.Call(w.hwnd, swHide)
		if openWindow(url) != nil {
			fail("Voxerra n'a trouvé aucun moyen de s'afficher : " + err.Error())
			os.Exit(1)
		}
		waitBrowser(s)
		os.Exit(0)
	})
	// Les évènements de WebView2 ne font que poster un message : la fenêtre agit ensuite, hors de l'évènement.
	post := func(m, wp uintptr) { pPostMessageW.Call(w.hwnd, m, wp, 0) }
	c.MessageCallback = func(m string, _ *edge.ICoreWebView2, _ *edge.ICoreWebView2WebMessageReceivedEventArgs) {
		switch m {
		case "voxerra:quitter":
			post(wmAppClose, 0)
		case "voxerra:ferme":
			post(wmAppDestroy, 0)
		}
	}
	c.AcceleratorKeyCallback = func(vk uint) bool {
		if vk == vkF11 {
			post(wmAppFullscreen, 2)
			return true
		}
		return false
	}
	c.ContainsFullScreenElementChangedCallback = func(sender *edge.ICoreWebView2, _ *edge.ICoreWebView2ContainsFullScreenElementChangedEventArgs) {
		if on, err := sender.GetContainsFullScreenElement(); err == nil {
			post(wmAppFullscreen, map[bool]uintptr{false: 0, true: 1}[on])
		}
	}
	c.ProcessFailedCallback = func(_ *edge.ICoreWebView2, args *edge.ICoreWebView2ProcessFailedEventArgs) {
		kind, _ := args.GetProcessFailedKind()
		switch kind {
		case edge.COREWEBVIEW2_PROCESS_FAILED_KIND_BROWSER_PROCESS_EXITED:
			w.crashed = true
			post(wmAppDestroy, 0)
		case edge.COREWEBVIEW2_PROCESS_FAILED_KIND_RENDER_PROCESS_EXITED:
			post(wmAppReload, 0) // page plantée : on la recharge (le monde est sauvegardé régulièrement)
		}
	}
	c.Embed(w.hwnd)
	if c.GetController() == nil {
		pDestroyWindow.Call(w.hwnd)
		return false
	}
	w.ready = true

	if st, err := c.GetSettings(); err == nil {
		st.PutAreDevToolsEnabled(debug)
		st.PutAreDefaultContextMenusEnabled(debug)
		st.PutAreBrowserAcceleratorKeysEnabled(debug)
		st.PutIsStatusBarEnabled(false)
		st.PutIsZoomControlEnabled(false)
		st.PutIsPinchZoomEnabled(false)
	}
	c.PutIsGeneralAutofillEnabled(false)
	c.PutIsPasswordAutosaveEnabled(false)
	c.PutIsSwipeNavigationEnabled(false)
	c.SetBackgroundColour(0x1b, 0x1b, 0x22, 255)
	w.updateScale()
	c.Init(nativeBridge)
	c.Resize()
	c.Navigate(url)
	w.show()
	c.Focus()

	s.mu.Lock()
	s.focus = func() { pPostMessageW.Call(w.hwnd, wmAppFocus, 0, 0) }
	s.mu.Unlock()
	go func() {
		<-s.quit
		pPostMessageW.Call(w.hwnd, wmAppClose, 0, 0)
	}()

	w.url = url
	var m msg
	for {
		r, _, _ := pGetMessageW.Call(uintptr(unsafe.Pointer(&m)), 0, 0, 0)
		if int32(r) <= 0 {
			break
		}
		pTranslateMessage.Call(uintptr(unsafe.Pointer(&m)))
		pDispatchMessageW.Call(uintptr(unsafe.Pointer(&m)))
	}
	if w.crashed {
		fail("Le moteur d'affichage (WebView2) s'est arrêté. Relancez Voxerra.")
	}
	return true
}

func dpiScale(hwnd uintptr) float64 {
	if hwnd != 0 && pGetDpiForWindow.Find() == nil {
		if d, _, _ := pGetDpiForWindow.Call(hwnd); d > 0 {
			return float64(d) / 96
		}
	}
	if pGetDpiForSystem.Find() == nil {
		if d, _, _ := pGetDpiForSystem.Call(); d > 0 {
			return float64(d) / 96
		}
	}
	return 1
}

// Fenêtre cachée (montrée une fois WebView2 prêt), centrée sur l'écran principal.
func (w *nativeWindow) create() bool {
	var inst windows.Handle
	windows.GetModuleHandleEx(0, nil, &inst)
	class, _ := windows.UTF16PtrFromString("VoxerraFenetre")
	title, _ := windows.UTF16PtrFromString("Voxerra")
	icon, _, _ := pLoadImageW.Call(uintptr(inst), 1, imageIcon, 0, 0, lrDefaultSize|lrShared)
	cx, _, _ := pGetSystemMetrics.Call(smCxSmIcon)
	cy, _, _ := pGetSystemMetrics.Call(smCySmIcon)
	small, _, _ := pLoadImageW.Call(uintptr(inst), 1, imageIcon, cx, cy, lrShared)
	cursor, _, _ := pLoadCursorW.Call(0, 32512) // IDC_ARROW
	brush, _, _ := pCreateSolidBrush.Call(0x00221b1b)
	wc := wndClassEx{
		WndProc:    windows.NewCallback(wndProc),
		Instance:   uintptr(inst),
		Icon:       icon,
		Cursor:     cursor,
		Background: brush,
		ClassName:  class,
		IconSm:     small,
	}
	wc.Size = uint32(unsafe.Sizeof(wc))
	pRegisterClassExW.Call(uintptr(unsafe.Pointer(&wc)))

	scale := dpiScale(0)
	width, height := int32(startWidth*scale), int32(startHeight*scale)
	x, y := int32(cwUseDefault), int32(cwUseDefault) // CW_USEDEFAULT
	var work rect
	if r, _, _ := pSystemParametersInfoW.Call(spiGetWorkArea, 0, uintptr(unsafe.Pointer(&work)), 0); r != 0 {
		ww, wh := work.Right-work.Left, work.Bottom-work.Top
		width, height = min(width, ww*9/10), min(height, wh*9/10)
		x, y = work.Left+(ww-width)/2, work.Top+(wh-height)/2
	}
	w.hwnd, _, _ = pCreateWindowExW.Call(0, uintptr(unsafe.Pointer(class)), uintptr(unsafe.Pointer(title)), wsOverlappedWindow,
		uintptr(uint32(x)), uintptr(uint32(y)), uintptr(width), uintptr(height), 0, 0, uintptr(inst), 0)
	return w.hwnd != 0
}

// Affiche la fenêtre à la place et à la taille de la dernière fois (si cet écran existe encore).
func (w *nativeWindow) show() {
	var saved struct {
		Left, Top, Right, Bottom int32
		Max                      bool
	}
	if b, err := os.ReadFile(filepath.Join(w.dir, "fenetre.json")); err == nil && json.Unmarshal(b, &saved) == nil {
		r := rect{saved.Left, saved.Top, saved.Right, saved.Bottom}
		if r.Right-r.Left >= 200 && r.Bottom-r.Top >= 150 {
			if mon, _, _ := pMonitorFromRect.Call(uintptr(unsafe.Pointer(&r)), monitorToNull); mon != 0 {
				wp := windowPlacement{ShowCmd: swShowNormal, NormalPosition: r}
				if saved.Max {
					wp.ShowCmd = swShowMaximized
				}
				wp.Length = uint32(unsafe.Sizeof(wp))
				pSetWindowPlacement.Call(w.hwnd, uintptr(unsafe.Pointer(&wp)))
				pSetForegroundWindow.Call(w.hwnd)
				return
			}
		}
	}
	pShowWindow.Call(w.hwnd, swShowNormal)
	pSetForegroundWindow.Call(w.hwnd)
}

func (w *nativeWindow) savePlacement() {
	wp := w.saved
	if !w.fullscreen {
		wp = windowPlacement{}
		wp.Length = uint32(unsafe.Sizeof(wp))
		if r, _, _ := pGetWindowPlacement.Call(w.hwnd, uintptr(unsafe.Pointer(&wp))); r == 0 {
			return
		}
	}
	r := wp.NormalPosition
	b, _ := json.Marshal(map[string]any{"Left": r.Left, "Top": r.Top, "Right": r.Right, "Bottom": r.Bottom, "Max": wp.ShowCmd == swShowMaximized})
	os.WriteFile(filepath.Join(w.dir, "fenetre.json"), b, 0o644)
}

// Plein écran sans bordure sur l'écran de la fenêtre (F11, ou demandé par la page).
func (w *nativeWindow) setFullscreen(on bool) {
	if on == w.fullscreen {
		return
	}
	if on {
		w.savedStyle, _, _ = pGetWindowLongPtrW.Call(w.hwnd, gwlStyle)
		w.saved = windowPlacement{}
		w.saved.Length = uint32(unsafe.Sizeof(w.saved))
		pGetWindowPlacement.Call(w.hwnd, uintptr(unsafe.Pointer(&w.saved)))
		mi := monitorInfo{}
		mi.Size = uint32(unsafe.Sizeof(mi))
		mon, _, _ := pMonitorFromWindow.Call(w.hwnd, monitorToNearest)
		if r, _, _ := pGetMonitorInfoW.Call(mon, uintptr(unsafe.Pointer(&mi))); r == 0 {
			return
		}
		pSetWindowLongPtrW.Call(w.hwnd, gwlStyle, w.savedStyle&^wsOverlappedWindow)
		m := mi.Monitor
		pSetWindowPos.Call(w.hwnd, 0, uintptr(m.Left), uintptr(m.Top), uintptr(m.Right-m.Left), uintptr(m.Bottom-m.Top), swpNoOwnerZOrder|swpFrameChanged)
	} else {
		pSetWindowLongPtrW.Call(w.hwnd, gwlStyle, w.savedStyle)
		pSetWindowPlacement.Call(w.hwnd, uintptr(unsafe.Pointer(&w.saved)))
		pSetWindowPos.Call(w.hwnd, 0, 0, 0, 0, 0, swpNoMove|swpNoSize|swpNoZOrder|swpNoOwnerZOrder|swpFrameChanged)
	}
	w.fullscreen = on
}

// Échelle d'affichage de l'écran de la fenêtre (WebView2 travaille en pixels réels).
func (w *nativeWindow) updateScale() {
	if c3 := w.chromium.GetController().GetICoreWebView2Controller3(); c3 != nil {
		c3.PutRasterizationScale(dpiScale(w.hwnd))
	}
}

// Fermeture demandée (croix, Alt+F4, « Quitter le jeu ») : la page sauvegarde, puis la fenêtre se ferme.
func (w *nativeWindow) requestClose() {
	if !w.ready {
		w.destroy()
		return
	}
	if w.closing {
		return
	}
	w.closing = true
	w.chromium.Eval(closeScript)
	pSetTimer.Call(w.hwnd, closeTimer, closeTimeoutMs, 0) // page bloquée : on ferme quand même
}

func (w *nativeWindow) destroy() {
	if w.destroyed {
		return
	}
	w.destroyed = true
	if w.chromium != nil {
		w.chromium.ShuttingDown()
	}
	pDestroyWindow.Call(w.hwnd)
}

func wndProc(hwnd, message, wp, lp uintptr) uintptr {
	w := win
	if w == nil || hwnd != w.hwnd {
		r, _, _ := pDefWindowProcW.Call(hwnd, message, wp, lp)
		return r
	}
	switch message {
	case wmSize:
		if w.ready {
			// réduite : la page passe « cachée » (le jeu sauvegarde et ne dessine plus)
			if wp == sizeMinimized {
				w.chromium.Hide()
			} else {
				w.chromium.Show()
				w.chromium.Resize()
			}
		}
		return 0
	case wmMove, wmMoving:
		if w.ready {
			w.chromium.NotifyParentWindowPositionChanged()
		}
	case wmSetFocus:
		if w.ready {
			w.chromium.Focus()
		}
		return 0
	case wmGetMinMaxInfo:
		mmi := *(**minMaxInfo)(unsafe.Pointer(&lp)) // lp : adresse fournie par Windows
		s := dpiScale(hwnd)
		mmi.MinTrackSize = point{int32(minWidth * s), int32(minHeight * s)}
		return 0
	case wmDpiChanged:
		r := *(**rect)(unsafe.Pointer(&lp)) // lp : rectangle proposé par Windows
		pSetWindowPos.Call(hwnd, 0, uintptr(r.Left), uintptr(r.Top), uintptr(r.Right-r.Left), uintptr(r.Bottom-r.Top), swpNoZOrder|swpNoActivate)
		if w.ready {
			w.updateScale()
			w.chromium.Resize()
		}
		return 0
	case wmClose, wmAppClose:
		w.requestClose()
		return 0
	case wmTimer:
		if wp == closeTimer {
			pKillTimer.Call(hwnd, closeTimer)
			w.destroy()
		}
		return 0
	case wmAppDestroy:
		w.destroy()
		return 0
	case wmAppFullscreen:
		w.setFullscreen(wp == 1 || (wp == 2 && !w.fullscreen))
		return 0
	case wmAppReload:
		if w.ready && !w.closing {
			w.chromium.Navigate(w.url)
		}
		return 0
	case wmAppFocus:
		if r, _, _ := pIsIconic.Call(hwnd); r != 0 {
			pShowWindow.Call(hwnd, swRestore)
		}
		pSetForegroundWindow.Call(hwnd)
		return 0
	case wmDestroy:
		w.savePlacement()
		pPostQuitMessage.Call(0)
		return 0
	}
	r, _, _ := pDefWindowProcW.Call(hwnd, message, wp, lp)
	return r
}
