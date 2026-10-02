package io.github.foollboss.teyvatpixel;

import android.app.Activity;
import android.webkit.ValueCallback;
import android.webkit.WebView;

/** Retour Android : ferme le menu ouvert (touche Échap du jeu) ou quitte depuis l'écran titre. */
public class BackHandler implements ValueCallback<String> {
    private final Activity activity;
    private final WebView web;

    public BackHandler(Activity activity, WebView web) {
        this.activity = activity;
        this.web = web;
    }

    @Override
    public void onReceiveValue(String mode) {
        if (mode == null || mode.contains("title") || mode.contains("loading") || mode.contains("none")) {
            activity.finish();
        } else {
            web.evaluateJavascript(
                    "window.dispatchEvent(new KeyboardEvent('keydown',{code:'Escape'}));"
                            + "window.dispatchEvent(new KeyboardEvent('keyup',{code:'Escape'}));", null);
        }
    }
}
