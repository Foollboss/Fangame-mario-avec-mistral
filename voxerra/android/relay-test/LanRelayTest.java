package io.github.fullboss971.voxerra;

import android.content.Context;

import org.java_websocket.client.WebSocketClient;
import org.java_websocket.handshake.ServerHandshake;
import org.json.JSONArray;
import org.json.JSONObject;

import java.net.URI;
import java.util.Map;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

/** Essai du relais Android sur la JVM : contrôle, invité, messages dans les deux sens, découverte. */
public class LanRelayTest {
    static int failures = 0;

    static void check(boolean ok, String what) {
        System.out.println((ok ? "✔ " : "✘ ") + what);
        if (!ok) failures++;
    }

    static class Client extends WebSocketClient {
        final LinkedBlockingQueue<String> got = new LinkedBlockingQueue<>();
        volatile boolean closed;

        Client(String url, Map<String, String> headers) throws Exception {
            super(new URI(url), headers);
        }

        @Override
        public void onOpen(ServerHandshake h) {
        }

        @Override
        public void onMessage(String m) {
            got.add(m);
        }

        @Override
        public void onClose(int code, String reason, boolean remote) {
            closed = true;
        }

        @Override
        public void onError(Exception e) {
        }

        JSONObject next() throws Exception {
            String m = got.poll(5, TimeUnit.SECONDS);
            return m == null ? new JSONObject() : new JSONObject(m);
        }
    }

    public static void main(String[] args) throws Exception {
        LanRelay relay = new LanRelay(new Context() {});
        Thread.sleep(500);
        String ctl = "ws://127.0.0.1:" + LanRelay.CONTROL_PORT + "/hote?monde=Mon%20monde&joueur=Alba";

        // une autre page (autre origine) ne peut pas ouvrir la partie
        Client intrus = new Client(ctl, Map.of("Origin", "https://exemple.com"));
        intrus.connectBlocking(3, TimeUnit.SECONDS);
        Thread.sleep(500);
        check(intrus.closed && intrus.got.isEmpty(), "contrôle refusé à une autre origine");

        Client host = new Client(ctl, Map.of("Origin", LanRelay.PAGE_ORIGIN));
        check(host.connectBlocking(3, TimeUnit.SECONDS), "page du jeu connectée au contrôle");
        JSONObject ready = host.next();
        check("ready".equals(ready.optString("e")) && ready.optInt("port") == LanRelay.LAN_PORT, "relais prêt : " + ready);

        Client guest = new Client("ws://127.0.0.1:" + LanRelay.LAN_PORT + "/", Map.of());
        check(guest.connectBlocking(3, TimeUnit.SECONDS), "invité connecté au port " + LanRelay.LAN_PORT);
        JSONObject open = host.next();
        int id = open.optInt("id", -1);
        check("open".equals(open.optString("e")) && id > 0, "l'hôte voit arriver l'invité : " + open);

        guest.send("{\"t\":\"hello\",\"name\":\"Brune\"}");
        JSONObject msg = host.next();
        check("msg".equals(msg.optString("e")) && msg.optInt("id") == id && msg.optString("d").contains("Brune"), "message invité → hôte relayé");

        host.send(new JSONObject().put("e", "msg").put("id", id).put("d", "{\"t\":\"welcome\"}").toString());
        String back = guest.got.poll(5, TimeUnit.SECONDS);
        check("{\"t\":\"welcome\"}".equals(back), "message hôte → invité relayé : " + back);

        // gros message (colonne du monde) dans les deux sens
        String big = "x".repeat(300_000);
        host.send(new JSONObject().put("e", "msg").put("id", id).put("d", big).toString());
        String bigBack = guest.got.poll(5, TimeUnit.SECONDS);
        check(bigBack != null && bigBack.length() == big.length(), "gros message relayé (300 ko)");

        // découverte sur le réseau
        JSONArray games = new JSONArray();
        for (int i = 0; i < 20 && games.length() == 0; i++) {
            games = new JSONArray(relay.gamesJson());
            Thread.sleep(300);
        }
        check(games.length() > 0 && "Alba".equals(games.getJSONObject(0).optString("name")) && "Mon monde".equals(games.getJSONObject(0).optString("world")), "partie annoncée et trouvée : " + games);

        guest.closeBlocking();
        JSONObject closed = host.next();
        check("close".equals(closed.optString("e")) && closed.optInt("id") == id, "départ de l'invité signalé à l'hôte");

        // l'hôte ferme : le port des invités se ferme aussi
        host.closeBlocking();
        Thread.sleep(1200);
        Client late = new Client("ws://127.0.0.1:" + LanRelay.LAN_PORT + "/", Map.of());
        check(!late.connectBlocking(2, TimeUnit.SECONDS), "port " + LanRelay.LAN_PORT + " fermé une fois la partie fermée");

        relay.shutdown();
        System.out.println(failures == 0 ? "relais Android : tout est bon" : "relais Android : " + failures + " échec(s)");
        System.exit(failures == 0 ? 0 : 1);
    }
}
