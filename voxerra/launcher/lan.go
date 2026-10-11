package main

// Relais de la partie ouverte au réseau local. Le serveur de jeu tourne dans la page de l'hôte ;
// le lanceur se contente de faire passer les messages :
//   - la page se connecte à ws://127.0.0.1:47183/lan/hote (contrôle, réservé à la page du jeu) ;
//   - les amis se connectent à ws://<adresse>:25590 (ouvert seulement tant que la partie l'est) ;
//   - chaque invité est relayé : {"e":"open"|"msg"|"close","id":n,"d":"…"} ;
//   - la partie est annoncée sur le réseau (UDP 25591), et /lan/parties liste celles des autres.

import (
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

const (
	lanPort       = 25590
	discoveryPort = 25591
	guestQueue    = 2048
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  64 << 10,
	WriteBufferSize: 64 << 10,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

type guest struct {
	conn *websocket.Conn
	out  chan []byte
	done chan struct{}
	once sync.Once
}

// La file n'est jamais fermée (d'autres goroutines peuvent y écrire) : « done » signale l'arrêt.
func (g *guest) stop() {
	g.once.Do(func() {
		close(g.done)
		g.conn.Close()
	})
}

// Message vers l'invité ; un invité trop lent est déconnecté plutôt que de ralentir les autres.
func (g *guest) send(m []byte) {
	select {
	case <-g.done:
	case g.out <- m:
	default:
		g.stop()
	}
}

func (g *guest) writer() {
	for {
		select {
		case <-g.done:
			return
		case m := <-g.out:
			if g.conn.WriteMessage(websocket.TextMessage, m) != nil {
				g.stop()
				return
			}
		}
	}
}

type lanRelay struct {
	mu      sync.Mutex
	host    *websocket.Conn
	hostOut chan []byte
	guests  map[int]*guest
	nextID  int
	server  *http.Server
	world   string
	player  string
	quit    chan struct{}

	gamesMu  sync.Mutex
	games    map[string]lanGame
	listenUp bool
}

type lanGame struct {
	Name  string    `json:"name"`
	World string    `json:"world"`
	Host  string    `json:"host"`
	Port  int       `json:"port"`
	Seen  time.Time `json:"-"`
}

type announce struct {
	Voxerra int    `json:"voxerra"`
	Nom     string `json:"nom"`
	Monde   string `json:"monde"`
	Port    int    `json:"port"`
}

func newLanRelay() *lanRelay {
	return &lanRelay{guests: map[int]*guest{}, games: map[string]lanGame{}}
}

// Adresses IPv4 du réseau local (réseaux privés d'abord), à donner aux amis.
func localAddresses() []string {
	var out []string
	ifs, _ := net.Interfaces()
	for _, it := range ifs {
		if it.Flags&net.FlagUp == 0 || it.Flags&net.FlagLoopback != 0 {
			continue
		}
		addrs, _ := it.Addrs()
		for _, a := range addrs {
			ipn, ok := a.(*net.IPNet)
			if !ok || ipn.IP.To4() == nil || ipn.IP.IsLinkLocalUnicast() {
				continue
			}
			out = append(out, ipn.IP.String())
		}
	}
	sort.SliceStable(out, func(i, j int) bool { return net.ParseIP(out[i]).IsPrivate() && !net.ParseIP(out[j]).IsPrivate() })
	return out
}

// Adresses de diffusion de chaque réseau local (plus la diffusion générale).
func broadcastAddresses() []string {
	out := []string{"255.255.255.255"}
	ifs, _ := net.Interfaces()
	for _, it := range ifs {
		if it.Flags&net.FlagUp == 0 || it.Flags&net.FlagLoopback != 0 || it.Flags&net.FlagBroadcast == 0 {
			continue
		}
		addrs, _ := it.Addrs()
		for _, a := range addrs {
			ipn, ok := a.(*net.IPNet)
			if !ok || ipn.IP.To4() == nil {
				continue
			}
			ip, mask := ipn.IP.To4(), ipn.Mask
			b := make(net.IP, 4)
			for i := range b {
				b[i] = ip[i] | ^mask[len(mask)-4+i]
			}
			out = append(out, b.String())
		}
	}
	return out
}

// Contrôle : seule la page du jeu (même machine, même origine) peut ouvrir la partie.
func (l *lanRelay) handleHost(w http.ResponseWriter, r *http.Request) {
	if origin := r.Header.Get("Origin"); origin != fmt.Sprintf("http://127.0.0.1:%d", port) {
		http.Error(w, "origine refusée", http.StatusForbidden)
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	l.mu.Lock()
	if l.host != nil {
		l.mu.Unlock()
		conn.WriteJSON(map[string]any{"e": "error", "msg": "Une partie est déjà ouverte."})
		conn.Close()
		return
	}
	srv := &http.Server{Addr: fmt.Sprintf(":%d", lanPort), Handler: http.HandlerFunc(l.handleGuest), ReadHeaderTimeout: 10 * time.Second}
	ln, err := net.Listen("tcp", srv.Addr)
	if err != nil {
		l.mu.Unlock()
		conn.WriteJSON(map[string]any{"e": "error", "msg": fmt.Sprintf("Le port %d est déjà utilisé par un autre programme.", lanPort)})
		conn.Close()
		return
	}
	l.host = conn
	l.hostOut = make(chan []byte, 8192)
	l.server = srv
	l.world = clip(r.URL.Query().Get("monde"), 40)
	l.player = clip(r.URL.Query().Get("joueur"), 16)
	l.quit = make(chan struct{})
	out, quit := l.hostOut, l.quit
	l.mu.Unlock()

	go srv.Serve(ln)
	go l.announce(quit)
	go func() {
		for m := range out {
			if conn.WriteMessage(websocket.TextMessage, m) != nil {
				conn.Close()
			}
		}
	}()
	l.toHost(map[string]any{"e": "ready", "port": lanPort, "addresses": localAddresses()})

	// messages de la page : vers les invités
	for {
		_, data, err := conn.ReadMessage()
		if err != nil {
			break
		}
		var m struct {
			E  string `json:"e"`
			ID int    `json:"id"`
			D  string `json:"d"`
		}
		if json.Unmarshal(data, &m) != nil {
			continue
		}
		l.mu.Lock()
		g := l.guests[m.ID]
		l.mu.Unlock()
		if g == nil {
			continue
		}
		switch m.E {
		case "msg":
			g.send([]byte(m.D))
		case "close":
			g.stop()
		}
	}
	l.closeHost()
}

func (l *lanRelay) closeHost() {
	l.mu.Lock()
	defer l.mu.Unlock()
	if l.host == nil {
		return
	}
	l.host.Close()
	close(l.hostOut)
	close(l.quit)
	for id, g := range l.guests {
		g.stop()
		delete(l.guests, id)
	}
	l.server.Close()
	l.host, l.server = nil, nil
}

func (l *lanRelay) toHost(m map[string]any) {
	b, _ := json.Marshal(m)
	l.mu.Lock()
	defer l.mu.Unlock()
	if l.host == nil {
		return
	}
	select {
	case l.hostOut <- b:
	default:
	}
}

// Un ami se connecte (port 25590) : ses messages sont relayés vers la page de l'hôte.
func (l *lanRelay) handleGuest(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}
	conn.SetReadLimit(1 << 20)
	g := &guest{conn: conn, out: make(chan []byte, guestQueue), done: make(chan struct{})}
	l.mu.Lock()
	if l.host == nil {
		l.mu.Unlock()
		conn.Close()
		return
	}
	l.nextID++
	id := l.nextID
	l.guests[id] = g
	l.mu.Unlock()
	go g.writer()
	l.toHost(map[string]any{"e": "open", "id": id})
	for {
		_, data, err := conn.ReadMessage()
		if err != nil {
			break
		}
		l.toHost(map[string]any{"e": "msg", "id": id, "d": string(data)})
	}
	g.stop()
	l.mu.Lock()
	delete(l.guests, id)
	l.mu.Unlock()
	l.toHost(map[string]any{"e": "close", "id": id})
}

// Annonce la partie sur le réseau local toutes les 1,5 s.
func (l *lanRelay) announce(quit chan struct{}) {
	conn, err := net.ListenUDP("udp4", nil)
	if err != nil {
		return
	}
	defer conn.Close()
	l.mu.Lock()
	msg, _ := json.Marshal(announce{Voxerra: 1, Nom: l.player, Monde: l.world, Port: lanPort})
	l.mu.Unlock()
	tick := time.NewTicker(1500 * time.Millisecond)
	defer tick.Stop()
	for {
		for _, b := range broadcastAddresses() {
			conn.WriteToUDP(msg, &net.UDPAddr{IP: net.ParseIP(b), Port: discoveryPort})
		}
		select {
		case <-quit:
			return
		case <-tick.C:
		}
	}
}

// Écoute les annonces des autres parties (lancée à la première demande de liste).
func (l *lanRelay) listen() {
	l.gamesMu.Lock()
	if l.listenUp {
		l.gamesMu.Unlock()
		return
	}
	l.listenUp = true
	l.gamesMu.Unlock()
	conn, err := net.ListenUDP("udp4", &net.UDPAddr{Port: discoveryPort})
	if err != nil {
		l.gamesMu.Lock()
		l.listenUp = false
		l.gamesMu.Unlock()
		return
	}
	go func() {
		buf := make([]byte, 2048)
		for {
			n, from, err := conn.ReadFromUDP(buf)
			if err != nil {
				return
			}
			var a announce
			if json.Unmarshal(buf[:n], &a) != nil || a.Voxerra != 1 || a.Port <= 0 || a.Port > 65535 {
				continue
			}
			g := lanGame{Name: clip(a.Nom, 16), World: clip(a.Monde, 40), Host: from.IP.String(), Port: a.Port, Seen: time.Now()}
			l.gamesMu.Lock()
			l.games[fmt.Sprintf("%s:%d", g.Host, g.Port)] = g
			l.gamesMu.Unlock()
		}
	}()
}

func (l *lanRelay) handleGames(w http.ResponseWriter, r *http.Request) {
	l.listen()
	l.gamesMu.Lock()
	list := []lanGame{}
	for k, g := range l.games {
		if time.Since(g.Seen) > 5*time.Second {
			delete(l.games, k)
			continue
		}
		list = append(list, g)
	}
	l.gamesMu.Unlock()
	sort.Slice(list, func(i, j int) bool { return list[i].Host < list[j].Host })
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Cache-Control", "no-store")
	json.NewEncoder(w).Encode(list)
}

func clip(s string, n int) string {
	s = strings.TrimSpace(s)
	if r := []rune(s); len(r) > n {
		return string(r[:n])
	}
	return s
}
