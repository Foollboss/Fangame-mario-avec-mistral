/* Teyvat Pixel — entrées : clavier (touches physiques → ZQSD/WASD), souris, tactile (joystick flottant) */
(function () {
  const G = window.G;
  const keys = {};
  const edges = new Set();
  const I = (G.input = {
    axis: { x: 0, y: 0 },
    pointer: { x: 0, y: 0, down: false, id: null },
    joy: null,
    held: {}, // actions maintenues par l'interface tactile
    touch: false,
    wheel: 0,
  });

  I.down = (code) => !!keys[code];
  I.edge = (code) => edges.has(code);
  I.any = (...codes) => codes.some((c) => keys[c]);
  I.anyEdge = (...codes) => codes.some((c) => edges.has(c));
  const pend = new Set();
  I.fire = (n) => pend.add(n);
  I.take = (n) => { if (pend.has(n)) { pend.delete(n); return true; } return false; };
  I.endFrame = () => { edges.clear(); I.wheel = 0; };
  I.clearEdges = () => edges.clear();

  window.addEventListener('keydown', (e) => {
    if (e.repeat) { if (['Space', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault(); return; }
    if (!keys[e.code]) edges.add(e.code);
    keys[e.code] = true;
    if (['Space', 'Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    if (G.Audio) G.Audio.unlock();
  });
  window.addEventListener('keyup', (e) => { keys[e.code] = false; });
  window.addEventListener('blur', () => { for (const k in keys) keys[k] = false; I.held = {}; I.joy = null; });

  // Axe de déplacement (clavier ou joystick)
  I.updateAxis = function () {
    let x = 0, y = 0;
    if (I.any('KeyA', 'ArrowLeft')) x -= 1;
    if (I.any('KeyD', 'ArrowRight')) x += 1;
    if (I.any('KeyW', 'ArrowUp')) y -= 1;
    if (I.any('KeyS', 'ArrowDown')) y += 1;
    if (I.joy) { x += I.joy.dx; y += I.joy.dy; }
    const l = Math.hypot(x, y);
    if (l > 1) { x /= l; y /= l; }
    I.axis.x = x; I.axis.y = y;
  };

  I.isHeld = (name) => !!I.held[name] || (name === 'attack' && (keys['KeyJ'] || I.mouseAttack)) || (name === 'sprint' && (keys['ShiftLeft'] || keys['ShiftRight']));

  // ---------- Pointeur ----------
  const toLogical = (e) => {
    const cv = G.canvasEl, r = cv.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * G.view.w, y: ((e.clientY - r.top) / r.height) * G.view.h };
  };
  const owned = new Map(); // pointerId -> {region|'joy'|'game'}

  I.attach = function (cv) {
    cv.addEventListener('contextmenu', (e) => e.preventDefault());
    cv.addEventListener('pointerdown', (e) => {
      cv.setPointerCapture(e.pointerId);
      if (G.Audio) G.Audio.unlock();
      if (e.pointerType === 'touch') I.touch = true;
      const p = toLogical(e);
      I.pointer.x = p.x; I.pointer.y = p.y; I.pointer.down = true;
      const reg = G.UI ? G.UI.hit(p.x, p.y) : null;
      if (reg) {
        owned.set(e.pointerId, { type: 'region', reg });
        if (reg.onDown) reg.onDown(p.x, p.y);
        if (reg.hold) I.held[reg.hold] = (I.held[reg.hold] || 0) + 1;
        if (reg.drag) reg.drag(p.x, p.y, 'start');
        return;
      }
      if (G.mode === 'play' && !G.dialog) {
        if (e.pointerType === 'touch' || e.pointerType === 'pen') {
          if (!I.joy && p.x < G.view.w * 0.55) {
            I.joy = { id: e.pointerId, ox: p.x, oy: p.y, x: p.x, y: p.y, dx: 0, dy: 0 };
            owned.set(e.pointerId, { type: 'joy' });
            return;
          }
        } else if (e.button === 0) { I.mouseAttack = true; owned.set(e.pointerId, { type: 'mouse' }); return; }
      }
      owned.set(e.pointerId, { type: 'none' });
      if (G.UI && G.UI.onBackgroundTap) G.UI.onBackgroundTap(p.x, p.y);
    });
    cv.addEventListener('pointermove', (e) => {
      const p = toLogical(e);
      I.pointer.x = p.x; I.pointer.y = p.y;
      const o = owned.get(e.pointerId);
      if (o && o.type === 'joy' && I.joy && I.joy.id === e.pointerId) {
        const j = I.joy; j.x = p.x; j.y = p.y;
        const dx = p.x - j.ox, dy = p.y - j.oy, l = Math.hypot(dx, dy), R = 26;
        if (l > R) { j.ox += (dx / l) * (l - R); j.oy += (dy / l) * (l - R); }
        const ndx = p.x - j.ox, ndy = p.y - j.oy, nl = Math.hypot(ndx, ndy);
        const dead = 4;
        j.dx = nl > dead ? (ndx / R) : 0; j.dy = nl > dead ? (ndy / R) : 0;
        const m = Math.hypot(j.dx, j.dy); if (m > 1) { j.dx /= m; j.dy /= m; }
      } else if (o && o.type === 'region' && o.reg.drag) o.reg.drag(p.x, p.y, 'move');
    });
    const up = (e) => {
      const o = owned.get(e.pointerId);
      const p = toLogical(e);
      owned.delete(e.pointerId);
      if (!o) return;
      if (o.type === 'joy') I.joy = null;
      else if (o.type === 'mouse') I.mouseAttack = false;
      else if (o.type === 'region') {
        const r = o.reg;
        if (r.hold) I.held[r.hold] = Math.max(0, (I.held[r.hold] || 1) - 1);
        if (r.drag) r.drag(p.x, p.y, 'end');
        if (r.onClick && p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h) r.onClick(p.x, p.y);
      }
      I.pointer.down = owned.size > 0;
    };
    cv.addEventListener('pointerup', up);
    cv.addEventListener('pointercancel', up);
    cv.addEventListener('wheel', (e) => { I.wheel += Math.sign(e.deltaY); e.preventDefault(); }, { passive: false });
  };
})();
