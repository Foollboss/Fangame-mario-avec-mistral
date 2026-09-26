import * as THREE from 'three';
import { el, esc, onTap } from './dom.js';
import { TEAM } from '../config/GameConfig.js';

const _v = new THREE.Vector3();

// Affichage tête haute pendant le match.
export class HUD {
  constructor(root, game, match) {
    this.game = game;
    this.match = match;
    const training = match.training;
    this.node = el(`<div class="hud">
      <div class="hud-top-left"><div class="hbtn clickable" data-pause>❚❚</div>${training ? '<div class="hbtn clickable" data-reset title="Replacer">⟲</div>' : ''}</div>
      ${training ? '' : `<div class="scoreboard">
        <div class="t t0" data-s0>0</div>
        <div class="clock"><span data-clock>5:00</span><small data-sub>${esc(match.opts.label || '')}</small></div>
        <div class="t t1" data-s1>0</div>
      </div>
      <div class="team-strip"><span style="color:${TEAM[0].css}">${TEAM[0].name}</span> · vous · <span style="color:${TEAM[1].css}">${TEAM[1].name}</span></div>`}
      <div class="hud-top-right"><span class="fps hidden" data-fps></span><div class="hbtn clickable" data-cam title="Caméra balle">🎯</div></div>
      <div class="feed" data-feed></div>
      <div class="center-msg hidden" data-center></div>
      <div class="ball-arrow hidden" data-arrow></div>
      ${training ? '<div class="drill-hud" data-drill></div>' : ''}
      <div class="boost-hud" data-boosthud>
        <svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="rgba(8,10,22,.7)" stroke="rgba(255,255,255,.12)" stroke-width="8" stroke-dasharray="198 264"/>
        <circle data-arc cx="50" cy="50" r="42" fill="none" stroke="#ffb52e" stroke-width="8" stroke-linecap="round" stroke-dasharray="0 264"/></svg>
        <div class="n" data-bn>33</div>
      </div>
    </div>`);
    root.appendChild(this.node);
    this.q = (s) => this.node.querySelector(s);
    this.clock = this.q('[data-clock]');
    this.s0 = this.q('[data-s0]');
    this.s1 = this.q('[data-s1]');
    this.fps = this.q('[data-fps]');
    this.arrow = this.q('[data-arrow]');
    this.center = this.q('[data-center]');
    this.feedEl = this.q('[data-feed]');
    this.arc = this.q('[data-arc]');
    this.bn = this.q('[data-bn]');
    this.drill = this.q('[data-drill]');
    this.boostHud = this.q('[data-boosthud]');
    onTap(this.q('[data-pause]'), () => game.pause());
    onTap(this.q('[data-cam]'), () => game.toggleBallCam());
    const r = this.q('[data-reset]');
    if (r) onTap(r, () => game.resetDrill());
    this.fpsAcc = 0; this.fpsN = 0; this.fpsT = 0;
    this.setBallCam(game.save.data.settings.camera.ballCam);
    this.setTouch(false);
  }

  setTouch(v) { this.boostHud.classList.toggle('hidden', v); }
  setBallCam(on) { this.q('[data-cam]').classList.toggle('on', on); }

  update(dt, camera, playerCar) {
    const m = this.match;
    if (this.clock) {
      const txt = m.timeLabel();
      if (txt !== this._clk) { this._clk = txt; this.clock.textContent = txt; }
      const [a, b] = m.score.teamScore;
      if (a !== this._a) { this._a = a; this.s0.textContent = a; }
      if (b !== this._b) { this._b = b; this.s1.textContent = b; }
      const sub = m.overtime ? 'PROLONGATION' : (m.opts.label || '');
      if (sub !== this._sub) { this._sub = sub; this.q('[data-sub]').textContent = sub; }
    }
    if (playerCar) {
      const bv = Math.round(playerCar.boost);
      if (bv !== this._bv) {
        this._bv = bv;
        this.bn.textContent = playerCar.infiniteBoost ? '∞' : bv;
        this.arc.setAttribute('stroke-dasharray', `${1.98 * bv} 264`);
      }
    }
    // Indicateur de balle hors champ
    const ball = m.sim.ball;
    const replay = m.phase === 'replay';
    if (!replay && m.sim.ballActive) {
      _v.copy(ball.pos).project(camera);
      const behind = _v.z > 1;
      const off = behind || Math.abs(_v.x) > 1 || Math.abs(_v.y) > 1;
      this.arrow.classList.toggle('hidden', !off);
      if (off) {
        let x = _v.x, y = _v.y;
        if (behind) { x = -x; y = -y; }
        const ang = Math.atan2(x, y);
        const k = 0.86 / Math.max(Math.abs(x), Math.abs(y), 1e-3);
        const px = (x * k * 0.5 + 0.5) * window.innerWidth;
        const py = Math.max(96, (-Math.max(-0.86, Math.min(0.62, y * k)) * 0.5 + 0.5) * window.innerHeight);
        this.arrow.style.transform = `translate(${px - 12}px, ${py - 11}px) rotate(${ang}rad)`;
      }
    } else this.arrow.classList.add('hidden');
    // FPS
    this.fpsT += dt; this.fpsN++;
    if (this.fpsT > 0.5) {
      this.fps.textContent = `${Math.round(this.fpsN / this.fpsT)} FPS`;
      this.fpsT = 0; this.fpsN = 0;
    }
  }

  showFps(v) { this.fps.classList.toggle('hidden', !v); }

  feed(text, color = 'var(--cyan)') {
    const d = el(`<div style="--c:${color}">${esc(text)}</div>`);
    this.feedEl.appendChild(d);
    while (this.feedEl.children.length > 3) this.feedEl.firstChild.remove();
    setTimeout(() => d.remove(), 3000);
  }

  centerText(text, color = '#fff') {
    this.center.textContent = text;
    this.center.style.color = color;
    this.center.classList.remove('hidden', 'pop');
    void this.center.offsetWidth;
    this.center.classList.add('pop');
    clearTimeout(this._ct);
    this._ct = setTimeout(() => this.center.classList.add('hidden'), text === 'GO !' ? 700 : 950);
  }

  goal(info, playerTeam) {
    const team = TEAM[info.team];
    const who = info.training ? '' : info.ownGoal ? 'Contre son camp !' : info.scorer ? `${info.scorer.name}${info.assist ? ` · passe de ${info.assist.name}` : ''} · ${Math.round(info.speed * 3.6 / 3)} km/h` : '';
    const b = el(`<div class="goal-banner"><h1 style="color:${team.css};text-shadow:0 0 30px ${team.css}">BUT !</h1><p>${esc(who)}</p></div>`);
    this.node.appendChild(b);
    setTimeout(() => b.remove(), 2400);
  }

  replay(on) {
    this.node.querySelector('.replay-tag')?.remove();
    this.node.querySelector('.replay-skip')?.remove();
    if (!on) return;
    this.node.appendChild(el('<div class="replay-tag">REPLAY</div>'));
    const skip = el('<div class="replay-skip clickable">Toucher pour passer ▶▶</div>');
    this.node.appendChild(skip);
    onTap(skip, () => this.match.skipReplay());
  }

  drillState(s, result) {
    if (!this.drill) return;
    this.drill.innerHTML = `${esc(s.label)}${s.id !== 'free' ? ` · Réussites <b>${s.success}</b> / ${s.attempts}` : ' · Buts <b>' + (this.game.trainingGoals || 0) + '</b>'}${result ? ` <span style="color:${result.ok ? 'var(--ok)' : 'var(--bad)'}">· ${esc(result.text)}</span>` : ''}`;
  }

  destroy() { this.node.remove(); }
}
