package io.github.fullboss971.voxerra;

import android.content.Context;
import android.net.wifi.WifiManager;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;
import org.json.JSONArray;
import org.json.JSONObject;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.Inet4Address;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.InterfaceAddress;
import java.net.NetworkInterface;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Relais de la partie ouverte au réseau local (même protocole que le lanceur Windows). Le serveur
 * de jeu tourne dans la page de l'hôte ; l'appli ne fait que transmettre les messages :
 * - la page se connecte à ws://127.0.0.1:47184/hote (contrôle, réservé à la page du jeu) ;
 * - les amis se connectent à ws://<adresse>:25590 (ouvert seulement tant que la partie l'est) ;
 * - chaque invité est relayé : {"e":"open"|"msg"|"close","id":n,"d":"…"} ;
 * - la partie est annoncée sur le Wi-Fi (UDP 25591), et lanGames() liste celles des autres.
 */
final class LanRelay {
    static final int CONTROL_PORT = 47184;
    static final int LAN_PORT = 25590;
    static final int DISCOVERY_PORT = 25591;
    static final String PAGE_ORIGIN = "https://appassets.androidplatform.net";

    private final Context context;
    private final ControlServer control;
    private GuestServer guests;
    private WebSocket host;
    private String world = "", player = "";
    private Thread announcer;
    private final Map<String, JSONObject> games = new HashMap<>();
    private Thread listener;
    private WifiManager.MulticastLock multicast;

    LanRelay(Context context) {
        this.context = context.getApplicationContext();
        control = new ControlServer();
        control.setReuseAddr(true);
        control.start();
    }

    void shutdown() {
        closeHost();
        try {
            control.stop(500);
        } catch (Exception ignored) {
        }
        if (listener != null) listener.interrupt();
        if (multicast != null && multicast.isHeld()) multicast.release();
    }

    // ------------------------------------------------------------------ contrôle (page de l'hôte)

    private final class ControlServer extends WebSocketServer {
        ControlServer() {
            super(new InetSocketAddress(InetAddress.getLoopbackAddress(), CONTROL_PORT));
        }

        @Override
        public void onOpen(WebSocket conn, ClientHandshake hs) {
            // seule la page du jeu peut ouvrir la partie
            if (!PAGE_ORIGIN.equals(hs.getFieldValue("Origin")) || !hs.getResourceDescriptor().startsWith("/hote")) {
                conn.close();
                return;
            }
            synchronized (LanRelay.this) {
                if (host != null) {
                    conn.send(json("e", "error", "msg", "Une partie est déjà ouverte."));
                    conn.close();
                    return;
                }
                host = conn;
                Map<String, String> q = query(hs.getResourceDescriptor());
                world = clip(q.get("monde"), 40);
                player = clip(q.get("joueur"), 16);
                guests = new GuestServer();
                guests.setReuseAddr(true);
                guests.start(); // onStart → « ready », ou onError → « error »
            }
        }

        @Override
        public void onMessage(WebSocket conn, String message) {
            if (conn != host) return;
            try {
                JSONObject m = new JSONObject(message);
                WebSocket g;
                synchronized (LanRelay.this) {
                    g = guests != null ? guests.byId.get(m.optInt("id", -1)) : null;
                }
                if (g == null) return;
                if ("msg".equals(m.optString("e"))) {
                    if (g.isOpen()) g.send(m.optString("d"));
                } else if ("close".equals(m.optString("e"))) g.close();
            } catch (Exception ignored) {
            }
        }

        @Override
        public void onClose(WebSocket conn, int code, String reason, boolean remote) {
            if (conn == host) closeHost();
        }

        @Override
        public void onError(WebSocket conn, Exception ex) {
        }

        @Override
        public void onStart() {
        }
    }

    private synchronized void closeHost() {
        host = null;
        if (announcer != null) announcer.interrupt();
        announcer = null;
        if (guests != null) {
            GuestServer g = guests;
            guests = null;
            new Thread(() -> {
                try {
                    g.stop(500);
                } catch (Exception ignored) {
                }
            }).start();
        }
    }

    private void toHost(String msg) {
        WebSocket h;
        synchronized (this) {
            h = host;
        }
        if (h != null && h.isOpen()) h.send(msg);
    }

    // ------------------------------------------------------------------ invités (réseau local)

    private final class GuestServer extends WebSocketServer {
        final Map<Integer, WebSocket> byId = Collections.synchronizedMap(new HashMap<>());
        private final Map<WebSocket, Integer> ids = Collections.synchronizedMap(new HashMap<>());
        private int next = 0;

        GuestServer() {
            super(new InetSocketAddress(LAN_PORT));
        }

        @Override
        public void onStart() {
            toHost(json("e", "ready", "port", LAN_PORT, "addresses", new JSONArray(localAddresses())));
            startAnnouncer();
        }

        @Override
        public void onError(WebSocket conn, Exception ex) {
            if (conn == null) toHost(json("e", "error", "msg", "Le port " + LAN_PORT + " est déjà utilisé par une autre appli."));
        }

        @Override
        public void onOpen(WebSocket conn, ClientHandshake hs) {
            int id;
            synchronized (this) {
                id = ++next;
            }
            byId.put(id, conn);
            ids.put(conn, id);
            toHost(json("e", "open", "id", id));
        }

        @Override
        public void onMessage(WebSocket conn, String message) {
            Integer id = ids.get(conn);
            if (id != null) toHost(json("e", "msg", "id", id, "d", message));
        }

        @Override
        public void onClose(WebSocket conn, int code, String reason, boolean remote) {
            Integer id = ids.remove(conn);
            if (id == null) return;
            byId.remove(id);
            toHost(json("e", "close", "id", id));
        }
    }

    // ------------------------------------------------------------------ annonce et découverte

    private synchronized void startAnnouncer() {
        if (announcer != null) announcer.interrupt();
        final String msg = json("voxerra", 1, "nom", player, "monde", world, "port", LAN_PORT);
        announcer = new Thread(() -> {
            try (DatagramSocket s = new DatagramSocket()) {
                s.setBroadcast(true);
                byte[] data = msg.getBytes(StandardCharsets.UTF_8);
                while (!Thread.currentThread().isInterrupted()) {
                    for (InetAddress b : broadcastAddresses()) {
                        try {
                            s.send(new DatagramPacket(data, data.length, b, DISCOVERY_PORT));
                        } catch (Exception ignored) {
                        }
                    }
                    Thread.sleep(1500);
                }
            } catch (Exception ignored) {
            }
        }, "voxerra-annonce");
        announcer.start();
    }

    private synchronized void startListener() {
        if (listener != null) return;
        WifiManager wifi = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
        if (wifi != null) {
            multicast = wifi.createMulticastLock("voxerra");
            multicast.setReferenceCounted(false);
            multicast.acquire();
        }
        listener = new Thread(() -> {
            try (DatagramSocket s = new DatagramSocket(null)) {
                s.setReuseAddress(true);
                s.setBroadcast(true);
                s.bind(new InetSocketAddress(DISCOVERY_PORT));
                byte[] buf = new byte[2048];
                while (!Thread.currentThread().isInterrupted()) {
                    DatagramPacket p = new DatagramPacket(buf, buf.length);
                    s.receive(p);
                    try {
                        JSONObject a = new JSONObject(new String(p.getData(), 0, p.getLength(), StandardCharsets.UTF_8));
                        int port = a.optInt("port", 0);
                        if (a.optInt("voxerra") != 1 || port <= 0 || port > 65535) continue;
                        String ip = p.getAddress().getHostAddress();
                        JSONObject g = new JSONObject()
                                .put("name", clip(a.optString("nom"), 16))
                                .put("world", clip(a.optString("monde"), 40))
                                .put("host", ip)
                                .put("port", port)
                                .put("seen", System.currentTimeMillis());
                        synchronized (games) {
                            games.put(ip + ":" + port, g);
                        }
                    } catch (Exception ignored) {
                    }
                }
            } catch (Exception ignored) {
            }
        }, "voxerra-decouverte");
        listener.start();
    }

    /** Parties annoncées ces 5 dernières secondes (JSON pour la page). */
    String gamesJson() {
        startListener();
        JSONArray out = new JSONArray();
        long now = System.currentTimeMillis();
        synchronized (games) {
            games.values().removeIf(g -> now - g.optLong("seen") > 5000);
            for (JSONObject g : games.values()) out.put(g);
        }
        return out.toString();
    }

    // ------------------------------------------------------------------ outils

    static List<String> localAddresses() {
        List<String> out = new ArrayList<>();
        try {
            for (NetworkInterface it : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                if (!it.isUp() || it.isLoopback()) continue;
                for (InetAddress a : Collections.list(it.getInetAddresses()))
                    if (a instanceof Inet4Address && !a.isLinkLocalAddress()) out.add(a.getHostAddress());
            }
        } catch (Exception ignored) {
        }
        out.sort((a, b) -> Boolean.compare(!a.startsWith("192.168."), !b.startsWith("192.168.")));
        return out;
    }

    static List<InetAddress> broadcastAddresses() {
        List<InetAddress> out = new ArrayList<>();
        try {
            out.add(InetAddress.getByName("255.255.255.255"));
            for (NetworkInterface it : Collections.list(NetworkInterface.getNetworkInterfaces())) {
                if (!it.isUp() || it.isLoopback()) continue;
                for (InterfaceAddress a : it.getInterfaceAddresses()) if (a.getBroadcast() != null) out.add(a.getBroadcast());
            }
        } catch (Exception ignored) {
        }
        return out;
    }

    static Map<String, String> query(String resource) {
        Map<String, String> out = new HashMap<>();
        int i = resource.indexOf('?');
        if (i < 0) return out;
        for (String kv : resource.substring(i + 1).split("&")) {
            int j = kv.indexOf('=');
            if (j <= 0) continue;
            try {
                out.put(kv.substring(0, j), URLDecoder.decode(kv.substring(j + 1), "UTF-8"));
            } catch (Exception ignored) {
            }
        }
        return out;
    }

    static String clip(String s, int n) {
        if (s == null) return "";
        s = s.trim();
        return s.codePointCount(0, s.length()) > n ? s.substring(0, s.offsetByCodePoints(0, n)) : s;
    }

    static String json(Object... kv) {
        JSONObject o = new JSONObject();
        try {
            for (int i = 0; i + 1 < kv.length; i += 2) o.put((String) kv[i], kv[i + 1]);
        } catch (Exception ignored) {
        }
        return o.toString();
    }
}
