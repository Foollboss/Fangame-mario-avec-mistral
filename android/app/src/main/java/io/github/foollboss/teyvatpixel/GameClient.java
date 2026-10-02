package io.github.foollboss.teyvatpixel;

import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/** Le jeu est autonome : toute navigation hors des assets est bloquée. */
public class GameClient extends WebViewClient {
    @Override
    public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
        return !request.getUrl().toString().startsWith("file:///android_asset/");
    }
}
