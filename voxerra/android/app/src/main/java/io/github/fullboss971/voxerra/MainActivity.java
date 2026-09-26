package io.github.fullboss971.voxerra;

import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.FrameLayout;

import java.util.Locale;

import androidx.activity.ComponentActivity;
import androidx.activity.OnBackPressedCallback;
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
        web.setWebChromeClient(new WebChromeClient());
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
        web.destroy();
        super.onDestroy();
    }

    /** Pont appelé par le jeu (window.voxerraHost). */
    private class Host {
        @JavascriptInterface
        public void quit() {
            runOnUiThread(() -> web.evaluateJavascript(SAVE_JS, r -> finishAndRemoveTask()));
        }
    }
}
