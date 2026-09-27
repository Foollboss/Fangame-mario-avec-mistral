// Voxerra.exe — lanceur léger : contient le jeu autonome (game/index.html),
// le sert sur http://127.0.0.1:47183 (adresse fixe : les mondes, gardés par
// le navigateur, restent attachés à cette adresse) et l'ouvre dans une
// fenêtre d'application Microsoft Edge (ou Chrome, sinon le navigateur par
// défaut). Le lanceur s'arrête quand la fenêtre est fermée.
package main

import (
	"bytes"
	_ "embed"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"strings"
	"sync"
	"time"
)

//go:embed game/index.html
var gameHTML []byte

const port = 47183

// Pont avec le jeu : « Quitter le jeu » ferme la fenêtre ; signe de vie régulier.
const bridge = `<script>
window.voxerraHost = {
  platform: 'launcher',
  quit: function () {
    fetch('/quit', { method: 'POST' }).catch(function () {}).then(function () {
      window.close();
      setTimeout(function () {
        document.title = 'Voxerra';
        document.body.innerHTML = '<p style="font:20px sans-serif;color:#ddd;text-align:center;margin-top:30vh">Voxerra est fermé. Vous pouvez fermer cette fenêtre.</p>';
      }, 400);
    });
  },
};
setInterval(function () { fetch('/alive', { method: 'POST' }).catch(function () {}); }, 5000);
fetch('/alive', { method: 'POST' }).catch(function () {});
</script>`

type state struct {
	mu        sync.Mutex
	lastAlive time.Time
	quit      chan struct{}
	quitOnce  sync.Once
}

func (s *state) alive() {
	s.mu.Lock()
	s.lastAlive = time.Now()
	s.mu.Unlock()
}

func (s *state) since() (time.Duration, bool) {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.lastAlive.IsZero() {
		return 0, false
	}
	return time.Since(s.lastAlive), true
}

func page() []byte {
	i := bytes.Index(gameHTML, []byte("<head>"))
	if i < 0 {
		return append([]byte(bridge), gameHTML...)
	}
	i += len("<head>")
	out := make([]byte, 0, len(gameHTML)+len(bridge))
	out = append(out, gameHTML[:i]...)
	out = append(out, bridge...)
	return append(out, gameHTML[i:]...)
}

func handler(s *state) http.Handler {
	body := page()
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/" && r.URL.Path != "/index.html" {
			http.NotFound(w, r)
			return
		}
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		w.Header().Set("Cache-Control", "no-store")
		w.Write(body)
	})
	mux.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		io.WriteString(w, "voxerra")
	})
	mux.HandleFunc("/alive", func(w http.ResponseWriter, r *http.Request) {
		s.alive()
		w.WriteHeader(http.StatusNoContent)
	})
	mux.HandleFunc("/quit", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST", http.StatusMethodNotAllowed)
			return
		}
		w.WriteHeader(http.StatusNoContent)
		s.quitOnce.Do(func() { close(s.quit) })
	})
	return mux
}

// Une autre instance tourne déjà : elle répond « voxerra » sur /ping.
func alreadyRunning(url string) bool {
	c := http.Client{Timeout: 2 * time.Second}
	res, err := c.Get(url + "ping")
	if err != nil {
		return false
	}
	defer res.Body.Close()
	b, _ := io.ReadAll(res.Body)
	return strings.TrimSpace(string(b)) == "voxerra"
}

func main() {
	addr := fmt.Sprintf("127.0.0.1:%d", port)
	url := "http://" + addr + "/"
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		if alreadyRunning(url) {
			openWindow(url)
			return
		}
		fail(fmt.Sprintf("Voxerra ne peut pas démarrer : le port %d est déjà utilisé par un autre programme.", port))
		return
	}
	s := &state{quit: make(chan struct{})}
	srv := &http.Server{Handler: handler(s), ReadHeaderTimeout: 10 * time.Second}
	go srv.Serve(ln)

	if err := openWindow(url); err != nil {
		fail("Voxerra n'a trouvé aucun navigateur pour s'afficher : " + err.Error())
		return
	}

	// Arrêt : « Quitter le jeu », ou plus de signe de vie de la fenêtre.
	start := time.Now()
	tick := time.NewTicker(2 * time.Second)
	defer tick.Stop()
	for {
		select {
		case <-s.quit:
			time.Sleep(500 * time.Millisecond)
			return
		case <-tick.C:
			if d, ok := s.since(); ok {
				if d > 45*time.Second {
					return
				}
			} else if time.Since(start) > 5*time.Minute {
				return
			}
		}
	}
}

// Arguments supplémentaires (essais) : VOXERRA_BROWSER_ARGS="--flag1 --flag2".
func extraArgs() []string {
	return strings.Fields(os.Getenv("VOXERRA_BROWSER_ARGS"))
}
