const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const teamCls = (t) => (t === 0 ? 'b' : 'o');

export function formatClock(match) {
  if (match.opts.freeplay) return 'LIBRE';
  if (match.overtime) {
    const t = Math.floor(match.overtimeElapsed);
    return `+${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
  }
  if (match.opts.duration <= 0) return '∞';
  const t = Math.ceil(match.timeLeft);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
}

const CIRC = 2 * Math.PI * 60;

export class Hud {
  constructor(root) {
    this.root = root;
    this.players = [];
    this.centerTimer = 0;
    this.goalTimer = 0;
  }

  setup(match, locals, viewports) {
    const r = this.root;
    r.innerHTML = `
      <div id="scorebar"><div class="team t0" id="s0">0</div><div id="clock">5:00</div><div class="team t1" id="s1">0</div></div>
      <div id="feed"></div>
      <div id="center-msg"></div>
      <div id="goal-banner"></div>
      <div id="replay-tag" class="hidden"><div class="r">REPLAY</div><div class="s">Appuyez sur SAUT pour passer</div></div>
      <div id="scoretable" class="hidden"></div>
      <div id="fps" class="hidden"></div>`;
    this.el = {
      s0: r.querySelector('#s0'), s1: r.querySelector('#s1'), clock: r.querySelector('#clock'), feed: r.querySelector('#feed'),
      center: r.querySelector('#center-msg'), goal: r.querySelector('#goal-banner'), replay: r.querySelector('#replay-tag'),
      table: r.querySelector('#scoretable'), fps: r.querySelector('#fps'),
    };
    this.players = locals.map((lp, i) => {
      const d = document.createElement('div');
      d.className = 'phud';
      const vp = viewports[i];
      Object.assign(d.style, { left: `${vp.x * 100}%`, top: `${vp.y * 100}%`, width: `${vp.w * 100}%`, height: `${vp.h * 100}%` });
      const scale = vp.h < 0.9 ? 0.72 : 1;
      d.innerHTML = `
        <div class="boost" style="transform: scale(${scale}); transform-origin: bottom right">
          <svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="60" fill="rgba(0,0,0,0.45)" stroke="rgba(255,255,255,0.12)" stroke-width="12" stroke-dasharray="${CIRC * 0.75} ${CIRC}"/>
          <circle class="arc" cx="70" cy="70" r="60" fill="none" stroke="url(#bg${i})" stroke-width="12" stroke-linecap="round" stroke-dasharray="0 ${CIRC}"/>
          <defs><linearGradient id="bg${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd24d"/><stop offset="1" stop-color="#ff6a00"/></linearGradient></defs></svg>
          <div class="num">33</div><div class="lbl">BOOST</div>
        </div>
        <div class="speedo" style="transform: scale(${scale}); transform-origin: bottom right"><span class="sp">0</span> <small>km/h</small></div>
        <div class="camtag"></div>
        <div class="popups"></div>
        <div class="demo-msg hidden">DÉTRUIT !</div>`;
      this.root.appendChild(d);
      return {
        el: d, car: lp.car, arc: d.querySelector('.arc'), num: d.querySelector('.num'), sp: d.querySelector('.sp'),
        speedo: d.querySelector('.speedo'), cam: d.querySelector('.camtag'), popups: d.querySelector('.popups'),
        demo: d.querySelector('.demo-msg'), lastBoost: -1,
      };
    });
    if (viewports.length > 1) {
      const line = document.createElement('div');
      line.className = 'split-line';
      this.root.appendChild(line);
    }
    this.centerTimer = 0;
    this.goalTimer = 0;
  }

  showCenter(text, dur = 1, cls = '', color = '#fff') {
    const c = this.el.center;
    c.textContent = text;
    c.style.color = color;
    c.className = '';
    void c.offsetWidth;
    c.className = `pop ${cls}`;
    this.centerTimer = dur;
  }

  feed(html, color = '#fff') {
    const d = document.createElement('div');
    d.className = 'feed-item';
    d.style.borderLeftColor = color;
    d.innerHTML = html;
    this.el.feed.prepend(d);
    while (this.el.feed.children.length > 6) this.el.feed.lastChild.remove();
    setTimeout(() => d.remove(), 6000);
  }

  chat(car, text) {
    this.feed(`${this.name(car)} : <span style="color:#fff">${esc(text)}</span>`, car.team === 0 ? '#2f7bff' : '#ff8a1f');
  }

  popup(p, text, pts) {
    const d = document.createElement('div');
    d.className = 'popup';
    d.innerHTML = `${esc(text)}${pts ? `<b>+${pts}</b>` : ''}`;
    p.popups.appendChild(d);
    setTimeout(() => d.remove(), 2300);
  }

  name(car) {
    return `<span class="${teamCls(car.team)}">${esc(car.name)}</span>`;
  }

  onEvent(e, match) {
    switch (e.type) {
      case 'countdown':
        this.showCenter(String(e.n), 0.95);
        break;
      case 'go':
        this.showCenter('GO !', 0.8, '', '#ffe066');
        break;
      case 'overtime':
        this.showCenter('PROLONGATION', 2.4, '', '#ffd34d');
        break;
      case 'goal': {
        const color = e.team === 0 ? 'var(--blue)' : 'var(--orange)';
        let sub = '';
        if (e.scorer) sub = `${esc(e.scorer.name)} a marqué !`;
        else if (e.ownGoal) sub = `Contre son camp de ${esc(e.ownGoal.name)}`;
        if (e.assist) sub += ` <span style="color:#cfe0ff;font-size:20px">(passe de ${esc(e.assist.name)})</span>`;
        this.el.goal.innerHTML = `<div class="big" style="color:${color}">BUT !</div><div class="sub">${sub}</div><div class="speed">${e.speedKmh} km/h</div>`;
        this.goalTimer = 3;
        if (e.scorer) this.feed(`⚽ ${this.name(e.scorer)} a marqué`, e.team === 0 ? '#2f7bff' : '#ff8a1f');
        else this.feed(`⚽ But pour l'équipe ${e.team === 0 ? 'BLEUE' : 'ORANGE'}`, e.team === 0 ? '#2f7bff' : '#ff8a1f');
        break;
      }
      case 'demo':
        this.feed(`${this.name(e.attacker)} 💥 ${this.name(e.victim)}`, '#ff5050');
        for (const p of this.players) {
          if (p.car === e.victim) p.demo.classList.remove('hidden');
        }
        break;
      case 'respawn':
        for (const p of this.players) if (p.car === e.car) p.demo.classList.add('hidden');
        break;
      case 'stat':
        for (const p of this.players) if (p.car === e.car) this.popup(p, e.label, e.points);
        if (e.label === 'ARRÊT' || e.label === 'ARRÊT ÉPIQUE') this.feed(`🧤 ${this.name(e.car)} — ${e.label.toLowerCase()}`, '#9fe0ff');
        break;
      case 'flipReset':
        for (const p of this.players) if (p.car === e.car) this.popup(p, 'RESET DE FLIP !', 0);
        break;
      case 'replayStart':
        this.el.goal.innerHTML = '';
        break;
      default:
        break;
    }
    return match;
  }

  update(dt, match, locals, opts) {
    const el = this.el;
    el.s0.textContent = match.score[0];
    el.s1.textContent = match.score[1];
    el.clock.textContent = formatClock(match);
    el.clock.className = match.overtime ? 'ot' : (!match.opts.freeplay && match.opts.duration > 0 && match.timeLeft <= 30 ? 'low' : '');
    el.replay.classList.toggle('hidden', match.state !== 'replay');
    if (this.centerTimer > 0) {
      this.centerTimer -= dt;
      if (this.centerTimer <= 0) el.center.textContent = '';
    }
    if (this.goalTimer > 0) {
      this.goalTimer -= dt;
      if (this.goalTimer <= 0) el.goal.innerHTML = '';
    }
    const inReplay = match.state === 'replay';
    this.players.forEach((p, i) => {
      const car = p.car;
      p.el.style.visibility = inReplay ? 'hidden' : 'visible';
      const b = Math.round(car.boost);
      if (b !== p.lastBoost) {
        p.lastBoost = b;
        p.num.textContent = b;
        p.arc.setAttribute('stroke-dasharray', `${CIRC * 0.75 * (b / 100)} ${CIRC}`);
        p.arc.style.opacity = b > 0 ? 1 : 0;
      }
      const kmh = Math.round(car.vel.length() * 3.6);
      p.sp.textContent = kmh;
      p.speedo.classList.toggle('ss', car.supersonic);
      p.cam.textContent = opts.ballCam[i] ? 'CAMÉRA BALLE' : 'CAMÉRA VOITURE';
      if (!car.demolished) p.demo.classList.add('hidden');
      else p.demo.textContent = `DÉTRUIT ! Retour dans ${Math.max(1, Math.ceil(car.respawnTimer))}…`;
    });
    el.fps.classList.toggle('hidden', !opts.showFps);
    if (opts.showFps) el.fps.textContent = `${opts.fps} FPS`;
    const show = opts.scoreboard || match.state === 'ended';
    el.table.classList.toggle('hidden', !opts.scoreboard);
    if (opts.scoreboard) el.table.innerHTML = scoreTableHtml(match);
    return show;
  }

  clear() {
    this.root.innerHTML = '';
    this.players = [];
  }
}

export function scoreTableHtml(match, withMvp = false) {
  let mvp = null;
  if (withMvp && match.winner >= 0) {
    for (const c of match.cars) if (c.team === match.winner && (!mvp || c.stats.score > mvp.stats.score)) mvp = c;
  }
  let html = '';
  for (const team of [0, 1]) {
    const cars = match.cars.filter((c) => c.team === team).sort((a, b) => b.stats.score - a.stats.score);
    if (!cars.length) continue;
    html += `<div class="st-team"><h4 style="color:${team === 0 ? 'var(--blue)' : 'var(--orange)'}">${team === 0 ? 'BLEU' : 'ORANGE'} — ${match.score[team]}</h4>
      <table class="st-table st-t${team}"><tr><th>JOUEUR</th><th>SCORE</th><th>BUTS</th><th>PASSES</th><th>ARRÊTS</th><th>TIRS</th><th>DÉMOS</th></tr>`;
    for (const c of cars) {
      const s = c.stats;
      html += `<tr><td>${esc(c.name)}${c.isBot ? ' <span style="color:#6f80a3;font-size:11px">IA</span>' : ''}${c === mvp ? '<span class="mvp">★ MVP</span>' : ''}</td>
        <td>${s.score}</td><td>${s.goals}</td><td>${s.assists}</td><td>${s.saves}</td><td>${s.shots}</td><td>${s.demos}</td></tr>`;
    }
    html += '</table></div>';
  }
  return html;
}
