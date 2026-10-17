package main

// Transfert des mondes de l'ancienne version. Celle-ci s'affichait dans une fenêtre Edge (ou Chrome) :
// les mondes sont restés dans le profil de ce navigateur. Au premier lancement de la fenêtre native,
// la page demande au lanceur d'ouvrir une fois l'ancienne fenêtre sur « ?transfert=export » ; elle
// envoie ses données ici, et la nouvelle fenêtre les récupère. Rien n'est effacé chez le navigateur ;
// une copie des données reçues est gardée (ancienne-version.json).
//
//   GET  /transfert/etat      {"etat": "a-faire" | "aucun" | "fait" | "plus-tard"}
//   POST /transfert/lancer    ouvre l'ancienne fenêtre
//   POST /transfert/donnees   (ancienne fenêtre) données du jeu, en JSON
//   GET  /transfert/donnees   (nouvelle fenêtre) 200 et les données, ou 204 tant qu'elles n'y sont pas
//   POST /transfert/fini | /transfert/plus-tard | /transfert/relancer

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"sync"
)

const maxTransfer = 2 << 30

type transfer struct {
	dir string
	mu  sync.Mutex
}

func newTransfer(dir string) *transfer {
	return &transfer{dir: dir}
}

func (t *transfer) file(name string) string {
	return filepath.Join(t.dir, name)
}

// État enregistré ; sans état, il reste à faire si un ancien profil contient des mondes.
func (t *transfer) state() string {
	if b, err := os.ReadFile(t.file("transfert.txt")); err == nil {
		if s := strings.TrimSpace(string(b)); s != "" {
			return s
		}
	}
	if oldProfileHasWorlds() {
		return "a-faire"
	}
	return "aucun"
}

func (t *transfer) setState(s string) error {
	if err := os.MkdirAll(t.dir, 0o755); err != nil {
		return err
	}
	return os.WriteFile(t.file("transfert.txt"), []byte(s+"\n"), 0o644)
}

// Un ancien profil de navigateur contient-il des mondes de Voxerra (stockage de http://127.0.0.1:47183) ?
func oldProfileHasWorlds() bool {
	for _, udd := range oldUserDataDirs() {
		if m, _ := filepath.Glob(filepath.Join(udd, "*", "IndexedDB", "http_127.0.0.1_47183.indexeddb.*")); len(m) > 0 {
			return true
		}
		// profils récents (« compartiments de stockage ») : l'origine est inscrite dans la base des quotas
		for _, pattern := range []string{filepath.Join(udd, "*", "WebStorage", "QuotaManager"), filepath.Join(udd, "*", "QuotaManager")} {
			m, _ := filepath.Glob(pattern)
			for _, f := range m {
				if b, err := os.ReadFile(f); err == nil && strings.Contains(string(b), "127.0.0.1:47183") {
					return true
				}
			}
		}
	}
	return false
}

func (t *transfer) register(mux *http.ServeMux) {
	post := func(path string, f func(w http.ResponseWriter, r *http.Request)) {
		mux.HandleFunc(path, func(w http.ResponseWriter, r *http.Request) {
			if r.Method != http.MethodPost || !sameOrigin(r) {
				http.Error(w, "POST", http.StatusMethodNotAllowed)
				return
			}
			f(w, r)
		})
	}
	mux.HandleFunc("/transfert/etat", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Header().Set("Cache-Control", "no-store")
		json.NewEncoder(w).Encode(map[string]string{"etat": t.state()})
	})
	post("/transfert/lancer", func(w http.ResponseWriter, r *http.Request) {
		t.mu.Lock()
		os.Remove(t.file("transfert-recu.json"))
		t.mu.Unlock()
		if err := openOldWindow("http://127.0.0.1:47183/?transfert=export"); err != nil {
			http.Error(w, "ancienne fenêtre introuvable : "+err.Error(), http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	})
	mux.HandleFunc("/transfert/donnees", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store")
		switch r.Method {
		case http.MethodGet:
			t.mu.Lock()
			f, err := os.Open(t.file("transfert-recu.json"))
			t.mu.Unlock()
			if err != nil {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			defer f.Close()
			w.Header().Set("Content-Type", "application/json")
			io.Copy(w, f)
		case http.MethodPost:
			if !sameOrigin(r) {
				http.Error(w, "origine refusée", http.StatusForbidden)
				return
			}
			if err := t.receive(r.Body); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			w.WriteHeader(http.StatusNoContent)
		default:
			http.Error(w, "GET ou POST", http.StatusMethodNotAllowed)
		}
	})
	post("/transfert/fini", func(w http.ResponseWriter, r *http.Request) {
		t.mu.Lock()
		os.Rename(t.file("transfert-recu.json"), t.file("ancienne-version.json"))
		t.mu.Unlock()
		reply(w, t.setState("fait"))
	})
	post("/transfert/plus-tard", func(w http.ResponseWriter, r *http.Request) { reply(w, t.setState("plus-tard")) })
	post("/transfert/relancer", func(w http.ResponseWriter, r *http.Request) { reply(w, t.setState("a-faire")) })
}

func reply(w http.ResponseWriter, err error) {
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

// Données de l'ancienne fenêtre : écrites à part puis renommées, pour n'être lues qu'entières.
func (t *transfer) receive(body io.Reader) error {
	if err := os.MkdirAll(t.dir, 0o755); err != nil {
		return err
	}
	tmp, err := os.CreateTemp(t.dir, "transfert-*.part")
	if err != nil {
		return err
	}
	_, err = io.Copy(tmp, io.LimitReader(body, maxTransfer))
	if cerr := tmp.Close(); err == nil {
		err = cerr
	}
	if err == nil {
		var probe struct {
			Voxerra int `json:"voxerra"`
		}
		f, _ := os.Open(tmp.Name())
		if f != nil {
			err = json.NewDecoder(f).Decode(&probe)
			f.Close()
		}
		if err == nil && probe.Voxerra != 1 {
			err = os.ErrInvalid
		}
	}
	if err != nil {
		os.Remove(tmp.Name())
		return err
	}
	t.mu.Lock()
	defer t.mu.Unlock()
	return os.Rename(tmp.Name(), t.file("transfert-recu.json"))
}
