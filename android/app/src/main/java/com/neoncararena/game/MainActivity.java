package com.neoncararena.game;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.view.DisplayCutout;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

/**
 * Hosts the HTML5 game (assets/index.html) in a fullscreen, landscape WebView.
 * The page talks to Android through window.AndroidBridge (vibration, exit) and
 * receives back-button, pause/resume and notch-inset notifications.
 */
public class MainActivity extends Activity {
    private WebView web;
    private int[] insets = {0, 0, 0, 0}; // left, top, right, bottom in CSS px

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        if (Build.VERSION.SDK_INT >= 28) {
            WindowManager.LayoutParams lp = getWindow().getAttributes();
            lp.layoutInDisplayCutoutMode = WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
            getWindow().setAttributes(lp);
        }

        web = new WebView(this);
        web.setBackgroundColor(Color.rgb(7, 10, 20));
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        web.setOverScrollMode(View.OVER_SCROLL_NEVER);
        web.setVerticalScrollBarEnabled(false);
        web.setHorizontalScrollBarEnabled(false);
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");
        web.setWebChromeClient(new WebChromeClient());
        web.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                pushInsets();
            }
        });
        web.setOnApplyWindowInsetsListener((v, windowInsets) -> {
            readCutout(windowInsets);
            pushInsets();
            return windowInsets;
        });
        setContentView(web);
        hideSystemUi();
        web.loadUrl("file:///android_asset/index.html");
    }

    private void readCutout(WindowInsets wi) {
        if (Build.VERSION.SDK_INT < 28 || wi == null) return;
        DisplayCutout c = wi.getDisplayCutout();
        float d = getResources().getDisplayMetrics().density;
        if (c == null) {
            insets = new int[] {0, 0, 0, 0};
            return;
        }
        insets = new int[] {
            Math.round(c.getSafeInsetLeft() / d),
            Math.round(c.getSafeInsetTop() / d),
            Math.round(c.getSafeInsetRight() / d),
            Math.round(c.getSafeInsetBottom() / d),
        };
    }

    private void pushInsets() {
        if (web == null) return;
        String js = "(function(){var s=document.documentElement.style;"
            + "s.setProperty('--android-sal','" + insets[0] + "px');"
            + "s.setProperty('--android-sat','" + insets[1] + "px');"
            + "s.setProperty('--android-sar','" + insets[2] + "px');"
            + "s.setProperty('--android-sab','" + insets[3] + "px');"
            + "if(window.__onInsetsChanged)window.__onInsetsChanged();})()";
        web.evaluateJavascript(js, null);
    }

    @SuppressWarnings("deprecation")
    private void hideSystemUi() {
        if (Build.VERSION.SDK_INT >= 30) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController ctl = getWindow().getInsetsController();
            if (ctl != null) {
                ctl.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                ctl.setSystemBarsBehavior(WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    | View.SYSTEM_UI_FLAG_FULLSCREEN
                    | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
        }
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) hideSystemUi();
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (web == null) {
            super.onBackPressed();
            return;
        }
        web.evaluateJavascript("window.__onAndroidBack ? window.__onAndroidBack() : 'exit'", value -> {
            if (value == null || value.contains("exit")) finish();
        });
    }

    @Override
    protected void onPause() {
        if (web != null) {
            web.evaluateJavascript("window.__onAppPause && window.__onAppPause()", null);
            web.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (web != null) {
            web.onResume();
            web.evaluateJavascript("window.__onAppResume && window.__onAppResume()", null);
        }
        hideSystemUi();
    }

    @Override
    protected void onDestroy() {
        if (web != null) {
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }

    private class Bridge {
        @JavascriptInterface
        public void vibrate(String pattern) {
            try {
                Vibrator v;
                if (Build.VERSION.SDK_INT >= 31) {
                    VibratorManager vm = (VibratorManager) getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
                    v = vm.getDefaultVibrator();
                } else {
                    v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                }
                if (v == null || !v.hasVibrator()) return;
                String[] parts = pattern.split(",");
                if (parts.length == 1) {
                    long ms = Math.max(1, Math.min(1000, Long.parseLong(parts[0].trim())));
                    if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE));
                    else v.vibrate(ms);
                } else {
                    // Web pattern [on, off, on, ...] → Android [delay, on, off, on, ...]
                    long[] wave = new long[parts.length + 1];
                    wave[0] = 0;
                    for (int i = 0; i < parts.length; i++) wave[i + 1] = Math.max(0, Math.min(1000, Long.parseLong(parts[i].trim())));
                    if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createWaveform(wave, -1));
                    else v.vibrate(wave, -1);
                }
            } catch (Exception ignored) {
                // Vibration is optional
            }
        }

        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(MainActivity.this::finish);
        }
    }
}
