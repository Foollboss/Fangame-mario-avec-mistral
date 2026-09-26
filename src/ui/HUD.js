import { TEAM } from '../core/Config.js';
import { formatTime } from '../core/MathUtil.js';

const ICON_PAUSE = '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
const ICON_ARROW = '<svg viewBox="0 0 24 24"><path d="M12 2l8 16-8-4-8 4z"/></svg>';

// In-match heads-up display (DOM). Updates only what changed.
export class HUD {
  constructor(root, handlers) {
    this.root = root;
    this.handlers = handlers;
    root.innerHTML = `
      <div class="sb hidden">
        <div class="tm t0">0</div>
        <div class="clock"><b>5:00</b><small>NOVA · EMBER</small></div>
        <div class="tm t1">0</div>
      </div>
      <div class="train-hud hidden"><div class="info"></div><button data-h="ball">BALLE</button><button data-h="reset">RÉINIT.</button></div>
      <button class="hud-btn hud-pause" data-h="pause" aria-label="Pause">${ICON_PAUSE}</button>
      <button class="hud-btn hud-cam" data-h="cam" aria-label="Caméra balle"><span>◎</span><span>BALLE</span></button>
      <div class="fps hidden"></div>
      <div class="feed"></div>
      <div class="announce"></div>
      <div class="popups"></div>
      <div class="plates"></div>
      <div class="ballarrow hidden">${ICON_ARROW}</div>
      <div class="replay-badge hidden">REPLAY</div>
      <button class="btn ghost skip hidden" data-h="skip"><span class="face"><span>PASSER ▸</span></span></button>
      <div class="respawn hidden"></div>
      <div class="speedfx"></div>
      <div class="flashfx"></div>`;
    const q = (s) => root.querySelector(s);
    this.el = {
      sb: q('.sb'), s0: q('.t0'), s1: q('.t1'), clock: q('.clock'), time: q('.clock b'), clockSub: q('.clock small'),
      train: q('.train-hud'), trainInfo: q('.train-hud .info'), cam: q('.hud-cam'), fps: q('.fps'), feed: q('.feed'),
      announce: q('.announce'), popups: q('.popups'), plates: q('.plates'), arrow: q('.ballarrow'), replay: q('.replay-badge'),
      skip: q('.skip'), respawn: q('.respawn'), speed: q('.speedfx'), flash: q('.flashfx'),
    };
    root.addEventListener('pointerdown', (e) => {
      const b = e.target.closest('[data-h]');
      if (!b) return;
      e.stopPropagation();
      this.handlers[b.dataset.h] && this.handlers[b.dataset.h]();
    });
    this.cache = {};
    this.plates = [];
    this.announceTimer = null;
    this.tmp = { x: 0, y: 0, inside: false };
  }

  show(on) {
    this.root.classList.toggle('hidden', !on);
  }

  setMode(training) {
    this.el.sb.classList.toggle('hidden', training);
    this.el.train.classList.toggle('hidden', !training);
  }

  set(key, value, fn) {
    if (this.cache[key] === value) return;
    this.cache[key] = value;
    fn(value);
  }

  setScore(score) {
    this.set('s0', score[0], (v) => (this.el.s0.textContent = v));
    this.set('s1', score[1], (v) => (this.el.s1.textContent = v));
  }

  setClock(seconds, overtime, waiting) {
    const txt = overtime ? `+${formatTime(seconds)}` : formatTime(seconds);
    this.set('time', txt, (v) => (this.el.time.textContent = v));
    this.set('ot', overtime, (v) => {
      this.el.clock.classList.toggle('ot', v);
      this.el.clockSub.textContent = v ? 'PROLONGATION' : `${TEAM[0].name} · ${TEAM[1].name}`;
    });
    this.set('wait', waiting, (v) => this.el.clock.classList.toggle('ot', v || overtime));
  }

  setTraining(text) {
    this.set('train', text, (v) => (this.el.trainInfo.textContent = v));
  }

  setBallCam(on) {
    this.el.cam.classList.toggle('on', on);
  }

  setFps(fps, show) {
    this.el.fps.classList.toggle('hidden', !show);
    if (show) this.set('fps', fps, (v) => (this.el.fps.textContent = `${v} FPS`));
  }

  announce(big, small = '', color = null, duration = 1.6) {
    clearTimeout(this.announceTimer);
    const glow = color || 'rgba(25,230,255,0.6)';
    this.el.announce.innerHTML = `<div class="a1" style="--glow:${glow};color:${color || '#fff'}">${big}</div>${small ? `<div class="a2">${small}</div>` : ''}`;
    if (duration > 0) this.announceTimer = setTimeout(() => (this.el.announce.innerHTML = ''), duration * 1000);
  }

  clearAnnounce() {
    clearTimeout(this.announceTimer);
    this.el.announce.innerHTML = '';
  }

  popup(text) {
    const d = document.createElement('div');
    d.className = 'popup';
    d.textContent = text;
    this.el.popups.replaceChildren(d);
    setTimeout(() => d.remove(), 1300);
  }

  feed(text, team) {
    const d = document.createElement('div');
    d.textContent = text;
    d.style.setProperty('--c', team === 1 ? TEAM[1].css : TEAM[0].css);
    this.el.feed.prepend(d);
    while (this.el.feed.children.length > 4) this.el.feed.lastChild.remove();
    setTimeout(() => d.remove(), 4500);
  }

  flash(color) {
    const f = this.el.flash;
    f.style.setProperty('--fc', color);
    f.classList.remove('go');
    void f.offsetWidth;
    f.classList.add('go');
  }

  setSpeedFx(on) {
    this.set('speed', on, (v) => this.el.speed.classList.toggle('on', v));
  }

  setReplay(on) {
    this.el.replay.classList.toggle('hidden', !on);
    this.el.skip.classList.toggle('hidden', !on);
  }

  setRespawn(text) {
    this.set('resp', text, (v) => {
      this.el.respawn.classList.toggle('hidden', !v);
      this.el.respawn.textContent = v || '';
    });
  }

  initPlates(cars, localCar) {
    this.el.plates.innerHTML = '';
    this.plates = cars.filter((c) => c !== localCar).map((car) => {
      const d = document.createElement('div');
      d.className = 'nameplate';
      d.textContent = car.name;
      d.style.setProperty('--c', TEAM[car.team].css);
      this.el.plates.appendChild(d);
      return { car, d, visible: true };
    });
  }

  updatePlates(view, show) {
    const t = this.tmp;
    for (const p of this.plates) {
      let vis = show && !p.car.demolished;
      if (vis) {
        const entry = view.cars.find((c) => c.car === p.car);
        const s = view.project(entry.view.labelPosition(entry.view.group.position.clone()), t);
        vis = !!s && s.inside;
        if (vis) p.d.style.transform = `translate(${t.x.toFixed(1)}px, ${t.y.toFixed(1)}px) translate(-50%, -100%)`;
      }
      if (vis !== p.visible) {
        p.visible = vis;
        p.d.style.display = vis ? '' : 'none';
      }
    }
  }

  // Off-screen ball indicator pinned to the screen edge.
  updateBallArrow(view, ball, show) {
    const a = this.el.arrow;
    if (!show || ball.hidden) {
      this.set('arrow', false, (v) => a.classList.toggle('hidden', !v));
      return;
    }
    const cam = view.camera;
    const v = ball.pos.clone().project(cam);
    const behind = v.z > 1;
    let x = v.x, y = v.y;
    if (behind) { x = -x; y = -y; }
    const inside = !behind && Math.abs(x) < 0.95 && Math.abs(y) < 0.95;
    this.set('arrow', !inside, (on) => a.classList.toggle('hidden', !on));
    if (inside) return;
    const m = Math.max(Math.abs(x), Math.abs(y)) || 1;
    x /= m; y /= m;
    const W = window.innerWidth, H = window.innerHeight;
    const px = (x * 0.46 + 0.5) * W, py = (-y * 0.44 + 0.5) * H;
    const ang = Math.atan2(x, y);
    a.style.transform = `translate(${px.toFixed(1)}px, ${py.toFixed(1)}px) rotate(${ang}rad)`;
  }
}
