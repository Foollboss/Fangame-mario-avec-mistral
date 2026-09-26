// Thin layer over the host: browser or the Android WebView wrapper (window.AndroidBridge).
const bridge = typeof window !== 'undefined' ? window.AndroidBridge : null;

export const Platform = {
  isAndroidApp: !!bridge,
  vibrationEnabled: true,

  vibrate(pattern) {
    if (!this.vibrationEnabled) return;
    try {
      if (bridge && bridge.vibrate) bridge.vibrate(Array.isArray(pattern) ? pattern.join(',') : String(pattern));
      else if (navigator.vibrate) navigator.vibrate(pattern);
    } catch (e) {
      /* vibration unsupported */
    }
  },

  async enterFullscreen() {
    if (bridge) return;
    try {
      const el = document.documentElement;
      if (!document.fullscreenElement && el.requestFullscreen) await el.requestFullscreen({ navigationUI: 'hide' });
      if (screen.orientation && screen.orientation.lock) await screen.orientation.lock('landscape');
    } catch (e) {
      /* not allowed here (iframe, iOS): the rotate hint covers it */
    }
  },

  async keepAwake() {
    try {
      if (navigator.wakeLock) this.wakeLock = await navigator.wakeLock.request('screen');
    } catch (e) {
      this.wakeLock = null;
    }
  },

  exitApp() {
    if (bridge && bridge.exitApp) bridge.exitApp();
  },

  // Android back button: handler returns true when it consumed the event.
  onBack(handler) {
    window.__onAndroidBack = () => (handler() ? 'handled' : 'exit');
  },

  onPause(handler) {
    window.__onAppPause = handler;
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) handler();
    });
  },

  onResume(handler) {
    window.__onAppResume = handler;
  },

  // Safe-area insets in CSS px (notches), from CSS env() or the Android wrapper.
  insets() {
    const probe = document.getElementById('safe-probe');
    if (!probe) return { top: 0, right: 0, bottom: 0, left: 0 };
    const cs = getComputedStyle(probe);
    return {
      top: parseFloat(cs.paddingTop) || 0,
      right: parseFloat(cs.paddingRight) || 0,
      bottom: parseFloat(cs.paddingBottom) || 0,
      left: parseFloat(cs.paddingLeft) || 0,
    };
  },
};
