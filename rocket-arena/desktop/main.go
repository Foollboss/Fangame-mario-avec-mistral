// Supersonic Arena for Windows: a single .exe that embeds the game, serves it on localhost
// and shows it in a native window (Edge WebView2). Without WebView2 it opens the default browser.
package main

import (
	"embed"
	"fmt"
	"io/fs"
	"log"
	"mime"
	"net"
	"net/http"
	"os/exec"
	"runtime"
	"sync/atomic"
	"time"
)

//go:embed www
var assets embed.FS

// A fixed port keeps the same web origin between launches, so settings saved by the game persist.
const preferredPort = 47815

func startServer() (string, *int64) {
	// Windows can map .js to text/plain in the registry: force the right types.
	_ = mime.AddExtensionType(".js", "text/javascript; charset=utf-8")
	_ = mime.AddExtensionType(".css", "text/css; charset=utf-8")
	_ = mime.AddExtensionType(".html", "text/html; charset=utf-8")

	site, err := fs.Sub(assets, "www")
	if err != nil {
		log.Fatal(err)
	}
	lastPing := time.Now().Unix()
	mux := http.NewServeMux()
	files := http.FileServer(http.FS(site))
	mux.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-cache")
		files.ServeHTTP(w, r)
	}))
	mux.HandleFunc("/alive", func(w http.ResponseWriter, r *http.Request) {
		atomic.StoreInt64(&lastPing, time.Now().Unix())
		w.WriteHeader(http.StatusNoContent)
	})
	ln, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", preferredPort))
	if err != nil {
		ln, err = net.Listen("tcp", "127.0.0.1:0")
		if err != nil {
			log.Fatal(err)
		}
	}
	go func() { _ = http.Serve(ln, mux) }()
	return fmt.Sprintf("http://%s/", ln.Addr().String()), &lastPing
}

func openBrowser(url string) error {
	switch runtime.GOOS {
	case "windows":
		return exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		return exec.Command("open", url).Start()
	default:
		return exec.Command("xdg-open", url).Start()
	}
}

// browserFallback plays in the default browser and keeps serving while the page sends heartbeats.
func browserFallback(base string, ping *int64) {
	if err := openBrowser(base + "?app=desktop-browser"); err != nil {
		log.Println("impossible d'ouvrir le navigateur:", err, "- ouvre", base)
	}
	start := time.Now()
	for {
		time.Sleep(5 * time.Second)
		idle := time.Since(time.Unix(atomic.LoadInt64(ping), 0))
		if time.Since(start) > time.Minute && idle > 30*time.Second {
			return
		}
	}
}

func main() {
	base, ping := startServer()
	runWindow(base, ping)
}
