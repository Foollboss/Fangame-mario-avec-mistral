/* Teyvat Pixel — sauvegarde locale */
(function () {
  const G = window.G;
  const KEY = 'teyvat-pixel-save-v2';
  const Save = (G.Save = {});

  Save.has = () => { try { return !!localStorage.getItem(KEY); } catch (e) { return false; } };
  Save.info = () => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      return s ? { ar: s.ar, mode: s.mode, play: s.stats && s.stats.play } : null;
    } catch (e) { return null; }
  };
  Save.save = function () {
    const S = G.state;
    if (!S) return false;
    try {
      S.pos = { x: G.P.x, y: G.P.y };
      S.savedAt = Date.now();
      localStorage.setItem(KEY, JSON.stringify(S));
      return true;
    } catch (e) { return false; }
  };
  Save.load = function () {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (!s || s.ver !== 2) return null;
      return (G.state = s);
    } catch (e) { return null; }
  };
  Save.clear = function () { try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ } };
})();
