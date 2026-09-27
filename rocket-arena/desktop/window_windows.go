//go:build windows

package main

import (
	"os"
	"path/filepath"
	"unsafe"

	webview2 "github.com/jchv/go-webview2"
	"golang.org/x/sys/windows"
)

var (
	user32              = windows.NewLazySystemDLL("user32.dll")
	pGetWindowLongPtr   = user32.NewProc("GetWindowLongPtrW")
	pSetWindowLongPtr   = user32.NewProc("SetWindowLongPtrW")
	pGetWindowPlacement = user32.NewProc("GetWindowPlacement")
	pSetWindowPlacement = user32.NewProc("SetWindowPlacement")
	pMonitorFromWindow  = user32.NewProc("MonitorFromWindow")
	pGetMonitorInfo     = user32.NewProc("GetMonitorInfoW")
	pSetWindowPos       = user32.NewProc("SetWindowPos")
	pShowWindow         = user32.NewProc("ShowWindow")
)

const (
	wsOverlappedWindow    = 0x00CF0000
	swpNoSize             = 0x0001
	swpNoMove             = 0x0002
	swpNoZOrder           = 0x0004
	swpFrameChanged       = 0x0020
	swpNoOwnerZOrder      = 0x0200
	monitorDefaultNearest = 2
	swMaximize            = 3
)

type rect struct{ Left, Top, Right, Bottom int32 }

type point struct{ X, Y int32 }

type monitorInfo struct {
	CbSize    uint32
	RcMonitor rect
	RcWork    rect
	DwFlags   uint32
}

type windowPlacement struct {
	Length           uint32
	Flags            uint32
	ShowCmd          uint32
	PtMinPosition    point
	PtMaxPosition    point
	RcNormalPosition rect
}

// Borderless full screen toggle, like the F11 of a browser.
type fullscreen struct {
	hwnd  uintptr
	on    bool
	style uintptr
	wp    windowPlacement
}

func gwlStyle() uintptr {
	idx := -16
	return uintptr(idx)
}

func (f *fullscreen) set(on bool) bool {
	if on == f.on {
		return f.on
	}
	if on {
		f.style, _, _ = pGetWindowLongPtr.Call(f.hwnd, gwlStyle())
		f.wp.Length = uint32(unsafe.Sizeof(f.wp))
		pGetWindowPlacement.Call(f.hwnd, uintptr(unsafe.Pointer(&f.wp)))
		mon, _, _ := pMonitorFromWindow.Call(f.hwnd, monitorDefaultNearest)
		var mi monitorInfo
		mi.CbSize = uint32(unsafe.Sizeof(mi))
		pGetMonitorInfo.Call(mon, uintptr(unsafe.Pointer(&mi)))
		pSetWindowLongPtr.Call(f.hwnd, gwlStyle(), f.style&^wsOverlappedWindow)
		r := mi.RcMonitor
		pSetWindowPos.Call(f.hwnd, 0, uintptr(int(r.Left)), uintptr(int(r.Top)),
			uintptr(int(r.Right-r.Left)), uintptr(int(r.Bottom-r.Top)), swpNoOwnerZOrder|swpFrameChanged)
	} else {
		pSetWindowLongPtr.Call(f.hwnd, gwlStyle(), f.style)
		pSetWindowPlacement.Call(f.hwnd, uintptr(unsafe.Pointer(&f.wp)))
		pSetWindowPos.Call(f.hwnd, 0, 0, 0, 0, 0, swpNoMove|swpNoSize|swpNoZOrder|swpNoOwnerZOrder|swpFrameChanged)
	}
	f.on = on
	return f.on
}

func runWindow(base string, ping *int64) {
	dataDir := filepath.Join(os.Getenv("LOCALAPPDATA"), "SupersonicArena")
	w := webview2.NewWithOptions(webview2.WebViewOptions{
		Debug:     false,
		AutoFocus: true,
		DataPath:  dataDir,
		WindowOptions: webview2.WindowOptions{
			Title:  "Supersonic Arena",
			Width:  1600,
			Height: 900,
			IconId: 1,
			Center: true,
		},
	})
	if w == nil {
		// WebView2 runtime missing (very old Windows 10): fall back to the browser.
		browserFallback(base, ping)
		return
	}
	defer w.Destroy()

	fs := &fullscreen{hwnd: uintptr(w.Window())}
	_ = w.Bind("appQuit", func() { w.Terminate() })
	_ = w.Bind("appToggleFullscreen", func() bool { return fs.set(!fs.on) })
	_ = w.Bind("appIsFullscreen", func() bool { return fs.on })

	pShowWindow.Call(fs.hwnd, swMaximize)
	fs.set(true)
	w.Navigate(base + "?app=desktop")
	w.Run()
}
