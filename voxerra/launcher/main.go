// Voxerra.exe — lanceur léger : contient le jeu autonome (game/index.html),
// le sert sur http://127.0.0.1:47183 et l'affiche dans sa propre fenêtre
// (WebView2, le moteur d'Edge intégré à Windows 10 et 11, sans barre ni menu
// de navigateur). Sans WebView2, il se rabat sur une fenêtre d'application
// Microsoft Edge (ou Chrome, sinon le navigateur par défaut). Le lanceur
// s'arrête quand la fenêtre est fermée.
package main

import (
	"bytes"
	_ "embed"
	"fmt"
	"io"
	"net"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"
)

//go:embed game/index.html
var gameHTML []byte

const port = 47183

// Pont avec le jeu : « Quitter le jeu » ferme la fenêtre ; signe de vie régulier.
// La fenêtre WebView2 prépare déjà window.voxerraHost (fenêtre native, fermeture) : on le complète.
const bridge = `<script>
window.voxerraHost = Object.assign({
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
  // partie ouverte au réseau local (relais du lanceur)
  lan: { hostUrl: 'ws://127.0.0.1:47183/lan/hote', gamesUrl: '/lan/parties' },
}, window.voxerraHost || {});
setInterval(function () { fetch('/alive', { method: 'POST' }).catch(function () {}); }, 5000);
fetch('/alive', { method: 'POST' }).catch(function () {});
</script>`

type state struct {
	mu        sync.Mutex
	lastAlive time.Time
	quit      chan struct{}
	quitOnce  sync.Once
	// fenêtre native : la ramener au premier plan (une deuxième instance a été lancée)
	focus func()
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

// Requête venue de la page du jeu (ou d'un programme local, sans en-tête Origin) : les autres
// sites ouverts dans un navigateur ne peuvent ni fermer le jeu ni lui envoyer des données.
func sameOrigin(r *http.Request) bool {
	o := r.Header.Get("Origin")
	return o == "" || o == fmt.Sprintf("http://127.0.0.1:%d", port)
}

func handler(s *state, lan *lanRelay, tr *transfer) http.Handler {
	body := page()
	mux := http.NewServeMux()
	mux.HandleFunc("/lan/hote", lan.handleHost)
	mux.HandleFunc("/lan/parties", lan.handleGames)
	tr.register(mux)
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
		if r.Method != http.MethodPost || !sameOrigin(r) {
			http.Error(w, "POST", http.StatusMethodNotAllowed)
			return
		}
		w.WriteHeader(http.StatusNoContent)
		s.quitOnce.Do(func() { close(s.quit) })
	})
	mux.HandleFunc("/focus", func(w http.ResponseWriter, r *http.Request) {
		s.mu.Lock()
		f := s.focus
		s.mu.Unlock()
		if r.Method != http.MethodPost || f == nil {
			http.NotFound(w, r)
			return
		}
		f()
		w.WriteHeader(http.StatusNoContent)
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

// Une instance tourne déjà avec sa fenêtre native : elle se met au premier plan.
func focusRunning(url string) bool {
	allowForeground()
	c := http.Client{Timeout: 2 * time.Second}
	res, err := c.Post(url+"focus", "text/plain", nil)
	if err != nil {
		return false
	}
	res.Body.Close()
	return res.StatusCode == http.StatusNoContent
}

func main() {
	addr := fmt.Sprintf("127.0.0.1:%d", port)
	url := "http://" + addr + "/"
	ln, err := net.Listen("tcp", addr)
	if err != nil {
		if alreadyRunning(url) {
			if !focusRunning(url) {
				openWindow(url)
			}
			return
		}
		fail(fmt.Sprintf("Voxerra ne peut pas démarrer : le port %d est déjà utilisé par un autre programme.", port))
		return
	}
	s := &state{quit: make(chan struct{})}
	lan := newLanRelay()
	defer lan.closeHost()
	srv := &http.Server{Handler: handler(s, lan, newTransfer(dataDir())), ReadHeaderTimeout: 10 * time.Second}
	go srv.Serve(ln)

	switch {
	case os.Getenv("VOXERRA_SANS_FENETRE") != "":
		// essais : la page est ouverte par le programme d'essai
	case runNative(s, url):
		// fenêtre de l'application fermée
		return
	default:
		if err := openWindow(url); err != nil {
			fail("Voxerra n'a trouvé aucun navigateur pour s'afficher : " + err.Error())
			return
		}
	}
	waitBrowser(s)
}

// Fenêtre de navigateur : arrêt sur « Quitter le jeu », ou quand la fenêtre ne donne plus signe de vie.
func waitBrowser(s *state) {
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

// Dossier des données du lanceur (%LOCALAPPDATA%\Voxerra) ; VOXERRA_DONNEES pour les essais.
func dataDir() string {
	if d := os.Getenv("VOXERRA_DONNEES"); d != "" {
		return d
	}
	base, err := os.UserCacheDir()
	if err != nil {
		base = os.TempDir()
	}
	return filepath.Join(base, "Voxerra")
}

// Arguments supplémentaires (essais) : VOXERRA_BROWSER_ARGS="--flag1 --flag2".
func extraArgs() []string {
	return strings.Fields(os.Getenv("VOXERRA_BROWSER_ARGS"))
}
