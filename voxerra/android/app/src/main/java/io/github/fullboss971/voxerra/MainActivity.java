package io.github.fullboss971.voxerra;

import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.database.Cursor;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.OpenableColumns;
import android.util.Base64;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.FrameLayout;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;

import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewClientCompat;

/**
 * Voxerra pour Android : le jeu (assets/index.html) dans une WebView plein
 * écran. Les pages sont servies en https://appassets.androidplatform.net pour
 * que les sauvegardes (IndexedDB) et les workers fonctionnent comme dans un
 * navigateur.
 */
public class MainActivity extends ComponentActivity {
    private static final String HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + HOST + "/assets/index.html";

    /** Retour Android : Échap dans le jeu, ou mise en arrière-plan depuis l'écran titre. */
    private static final String BACK_JS =
            "(function(){var v=window.voxerra;"
                    + "if(v&&!v.game&&v.ui&&v.ui.stack&&v.ui.stack.length<=1)return 'exit';"
                    + "var o={key:'Escape',code:'Escape',bubbles:true,cancelable:true};"
                    + "window.dispatchEvent(new KeyboardEvent('keydown',o));"
                    + "window.dispatchEvent(new KeyboardEvent('keyup',o));return 'ok';})()";
    private static final String SAVE_JS =
            "window.voxerra&&window.voxerra.game&&window.voxerra.game.save()";

    private WebView web;
    private Insets cutout = Insets.NONE;
    /** Relais de la partie ouverte au réseau local. */
    private LanRelay lan;

    // Fichiers : la WebView ne sait pas télécharger, et son sélecteur de fichiers dépend de l'appli.
    // Le jeu passe par openTextFile / saveFile (pont voxerraHost) ; un <input type="file"> passe par
    // onShowFileChooser. Un seul sélecteur à la fois.
    private static final int MAX_FILE = 16 << 20;
    private ValueCallback<Uri[]> inputFiles;
    private int openId;
    private int saveId;
    private byte[] saveData;
    private final ActivityResultLauncher<Intent> openDoc = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            r -> onOpened(r.getResultCode() == RESULT_OK && r.getData() != null ? r.getData().getData() : null));
    private final ActivityResultLauncher<Intent> createDoc = registerForActivityResult(
            new ActivityResultContracts.StartActivityForResult(),
            r -> onCreated(r.getResultCode() == RESULT_OK && r.getData() != null ? r.getData().getData() : null));

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        // tout l'écran, y compris la zone de l'encoche (caméra)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = Build.VERSION.SDK_INT >= Build.VERSION_CODES.R
                    ? WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_ALWAYS
                    : WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        try {
            lan = new LanRelay(this);
        } catch (Exception e) {
            lan = null;
        }

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(0xFF1B1B22);
        web = new WebView(this);
        root.addView(web, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        setContentView(root);

        // Le jeu occupe tout l'écran. Seul le clavier réduit la WebView (la saisie reste visible) ;
        // la taille de l'encoche est transmise à la page, qui écarte ses boutons des bords.
        ViewCompat.setOnApplyWindowInsetsListener(root, (v, insets) -> {
            Insets cut = insets.getInsets(WindowInsetsCompat.Type.displayCutout());
            Insets ime = insets.getInsets(WindowInsetsCompat.Type.ime());
            v.setPadding(0, 0, 0, ime.bottom);
            cutout = cut;
            pushInsets();
            return WindowInsetsCompat.CONSUMED;
        });
        hideSystemBars();

        WebViewAssetLoader loader = new WebViewAssetLoader.Builder()
                .setDomain(HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW); // multijoueur en ws://
        s.setTextZoom(100);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setUseWideViewPort(true);
        // marqueur lu par le jeu : contrôles tactiles activés d'office
        s.setUserAgentString(s.getUserAgentString() + " VoxerraApp/Android");

        web.setWebViewClient(new WebViewClientCompat() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return loader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                pushInsets();
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (HOST.equals(uri.getHost())) return false;
                // liens externes : navigateur du téléphone
                try {
                    startActivity(new Intent(Intent.ACTION_VIEW, uri));
                } catch (Exception ignored) {
                }
                return true;
            }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                cancelOpen();
                inputFiles = callback;
                if (launchOpen()) return true;
                inputFiles = null;
                return false;
            }
        });
        web.addJavascriptInterface(new Host(), "voxerraHost");

        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                web.evaluateJavascript(BACK_JS, result -> {
                    if ("\"exit\"".equals(result)) moveTaskToBack(true);
                });
            }
        });

        if (savedInstanceState == null || web.restoreState(savedInstanceState) == null) web.loadUrl(START_URL);
    }

    /** Zones à éviter (encoche) en pixels CSS : variables --app-inset-* lues par la feuille de style du jeu. */
    private void pushInsets() {
        if (web == null) return;
        float d = getResources().getDisplayMetrics().density;
        String js = String.format(Locale.ROOT,
                "(function(s){s.setProperty('--app-inset-top','%dpx');s.setProperty('--app-inset-right','%dpx');"
                        + "s.setProperty('--app-inset-bottom','%dpx');s.setProperty('--app-inset-left','%dpx');})(document.documentElement.style)",
                Math.round(cutout.top / d), Math.round(cutout.right / d), Math.round(cutout.bottom / d), Math.round(cutout.left / d));
        web.evaluateJavascript(js, null);
    }

    private void hideSystemBars() {
        WindowInsetsControllerCompat c = WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        c.hide(WindowInsetsCompat.Type.systemBars());
        c.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemBars();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        web.saveState(outState);
    }

    @Override
    protected void onPause() {
        // sauvegarde du monde en cours (la page passe aussi en « cachée »)
        web.evaluateJavascript(SAVE_JS, null);
        web.onPause();
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        hideSystemBars();
    }

    @Override
    protected void onDestroy() {
        if (lan != null) lan.shutdown();
        web.destroy();
        super.onDestroy();
    }

    // ------------------------------------------------------------------ fichiers

    /** Sélecteur de documents du système (tous les types : selon les gestionnaires, un .json n'a pas toujours le bon). */
    private boolean launchOpen() {
        Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("*/*");
        try {
            openDoc.launch(i);
            return true;
        } catch (ActivityNotFoundException e) {
            Intent g = new Intent(Intent.ACTION_GET_CONTENT);
            g.addCategory(Intent.CATEGORY_OPENABLE);
            g.setType("*/*");
            try {
                openDoc.launch(Intent.createChooser(g, null));
                return true;
            } catch (ActivityNotFoundException e2) {
                return false;
            }
        }
    }

    /** Annule le choix en cours (un nouveau commence). */
    private void cancelOpen() {
        if (inputFiles != null) inputFiles.onReceiveValue(null);
        inputFiles = null;
        if (openId != 0) callJs("__voxerraFichier", openId, null, null);
        openId = 0;
    }

    private void onOpened(Uri uri) {
        if (inputFiles != null) {
            inputFiles.onReceiveValue(uri != null ? new Uri[]{uri} : null);
            inputFiles = null;
            return;
        }
        final int id = openId;
        openId = 0;
        if (id == 0) return;
        if (uri == null) {
            callJs("__voxerraFichier", id, null, null);
            return;
        }
        new Thread(() -> {
            String name = null, text = null;
            try {
                name = displayName(uri);
                text = readText(uri);
            } catch (Exception ignored) {
            }
            final String n = name, tx = text;
            runOnUiThread(() -> callJs("__voxerraFichier", id, n, tx));
        }, "voxerra-fichier").start();
    }

    private String displayName(Uri uri) {
        try (Cursor c = getContentResolver().query(uri, new String[]{OpenableColumns.DISPLAY_NAME}, null, null, null)) {
            if (c != null && c.moveToFirst() && !c.isNull(0)) return c.getString(0);
        } catch (Exception ignored) {
        }
        String last = uri.getLastPathSegment();
        return last != null ? last : "";
    }

    private String readText(Uri uri) throws IOException {
        try (InputStream in = getContentResolver().openInputStream(uri)) {
            if (in == null) throw new IOException("illisible");
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            byte[] buf = new byte[65536];
            int n;
            while ((n = in.read(buf)) > 0) {
                out.write(buf, 0, n);
                if (out.size() > MAX_FILE) throw new IOException("trop gros");
            }
            String s = new String(out.toByteArray(), StandardCharsets.UTF_8);
            return s.startsWith("\uFEFF") ? s.substring(1) : s;
        }
    }

    private void onCreated(Uri uri) {
        final int id = saveId;
        final byte[] data = saveData;
        saveId = 0;
        saveData = null;
        if (id == 0) return;
        if (uri == null || data == null) {
            callJs("__voxerraEnregistre", id, false);
            return;
        }
        new Thread(() -> {
            boolean ok = false;
            try (OutputStream out = getContentResolver().openOutputStream(uri, "wt")) {
                if (out != null) {
                    out.write(data);
                    ok = true;
                }
            } catch (Exception ignored) {
            }
            final boolean done = ok;
            runOnUiThread(() -> callJs("__voxerraEnregistre", id, done));
        }, "voxerra-enregistrement").start();
    }

    /** Appelle window.<fn>(…) dans la page, si elle existe ; les textes sont passés en littéraux JSON. */
    private void callJs(String fn, Object... args) {
        if (web == null) return;
        StringBuilder js = new StringBuilder("window.").append(fn).append("&&window.").append(fn).append('(');
        for (int i = 0; i < args.length; i++) {
            if (i > 0) js.append(',');
            Object a = args[i];
            js.append(a == null ? "null" : a instanceof String ? JSONObject.quote((String) a) : String.valueOf(a));
        }
        web.evaluateJavascript(js.append(')').toString(), null);
    }

    /** Pont appelé par le jeu (window.voxerraHost). */
    private class Host {
        @JavascriptInterface
        public void quit() {
            runOnUiThread(() -> web.evaluateJavascript(SAVE_JS, r -> finishAndRemoveTask()));
        }

        /** Partie ouverte au réseau local : WebSocket de contrôle du relais. */
        @JavascriptInterface
        public String lanHostUrl() {
            return "ws://127.0.0.1:" + LanRelay.CONTROL_PORT + "/hote";
        }

        /** Parties annoncées sur le Wi-Fi (JSON). */
        @JavascriptInterface
        public String lanGames() {
            return lan != null ? lan.gamesJson() : "[]";
        }

        /** Choisir un fichier texte (pack de mod…) : réponse par window.__voxerraFichier(id, nom, texte). */
        @JavascriptInterface
        public void openTextFile(int id) {
            runOnUiThread(() -> {
                cancelOpen();
                openId = id;
                if (!launchOpen()) {
                    openId = 0;
                    callJs("__voxerraFichier", id, null, null);
                }
            });
        }

        /** « Enregistrer sous » (export, capture d'écran) : réponse par window.__voxerraEnregistre(id, ok). */
        @JavascriptInterface
        public void saveFile(int id, String name, String mime, String base64) {
            byte[] data;
            try {
                data = Base64.decode(base64, Base64.DEFAULT);
            } catch (Exception e) {
                runOnUiThread(() -> callJs("__voxerraEnregistre", id, false));
                return;
            }
            runOnUiThread(() -> {
                if (saveId != 0) callJs("__voxerraEnregistre", saveId, false);
                saveId = id;
                saveData = data;
                Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                i.addCategory(Intent.CATEGORY_OPENABLE);
                i.setType(mime == null || mime.isEmpty() ? "application/octet-stream" : mime);
                i.putExtra(Intent.EXTRA_TITLE, name == null || name.isEmpty() ? "voxerra" : name.replaceAll("[\\\\/:*?\"<>|]", "_"));
                try {
                    createDoc.launch(i);
                } catch (ActivityNotFoundException e) {
                    saveId = 0;
                    saveData = null;
                    callJs("__voxerraEnregistre", id, false);
                }
            });
        }
    }
}
