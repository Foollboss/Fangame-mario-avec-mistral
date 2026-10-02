/* Teyvat Pixel — audio chiptune synthétisé (Web Audio) : effets + musiques génératives */
(function () {
  const G = window.G;
  const A = (G.Audio = { ctx: null, music: 'none', mvol: 0.5, svol: 0.7, muted: false });
  let master, mGain, sGain, noiseBuf;

  A.unlock = function () {
    if (A.ctx) { if (A.ctx.state === 'suspended') A.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    A.ctx = new AC();
    master = A.ctx.createGain(); master.gain.value = 0.9; master.connect(A.ctx.destination);
    mGain = A.ctx.createGain(); mGain.gain.value = A.mvol * 0.22; mGain.connect(master);
    sGain = A.ctx.createGain(); sGain.gain.value = A.svol * 0.5; sGain.connect(master);
    const len = A.ctx.sampleRate * 1;
    noiseBuf = A.ctx.createBuffer(1, len, A.ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    startMusicLoop();
  };
  A.setVolumes = function (m, s) {
    A.mvol = m; A.svol = s;
    if (mGain) mGain.gain.value = m * 0.22;
    if (sGain) sGain.gain.value = s * 0.5;
  };

  function tone(type, f0, f1, dur, vol, when, dest) {
    const c = A.ctx; if (!c) return;
    const t0 = when || c.currentTime;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(f0, t0);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(dest || sGain);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(dur, vol, f0, f1, when, type, dest) {
    const c = A.ctx; if (!c) return;
    const t0 = when || c.currentTime;
    const s = c.createBufferSource(); s.buffer = noiseBuf; s.loop = true;
    const fl = c.createBiquadFilter(); fl.type = type || 'lowpass';
    fl.frequency.setValueAtTime(f0, t0); if (f1) fl.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
    const g = c.createGain();
    g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(fl); fl.connect(g); g.connect(dest || sGain);
    s.start(t0); s.stop(t0 + dur + 0.02);
  }
  const NOTE = (n) => 440 * Math.pow(2, (n - 69) / 12);

  let lastSfx = {};
  A.sfx = function (name) {
    if (!A.ctx || A.muted) return;
    const now = A.ctx.currentTime;
    if (lastSfx[name] && now - lastSfx[name] < 0.04) return;
    lastSfx[name] = now;
    switch (name) {
      case 'click': tone('square', 900, 700, 0.05, 0.25); break;
      case 'type': tone('square', 1200 + Math.random() * 200, 0, 0.02, 0.06); break;
      case 'hit': noise(0.08, 0.5, 2500, 400, 0, 'lowpass'); tone('square', 300, 120, 0.08, 0.3); break;
      case 'swing': noise(0.12, 0.35, 1800, 600, 0, 'bandpass'); break;
      case 'shot': tone('triangle', 700, 300, 0.1, 0.3); break;
      case 'skill': tone('sawtooth', 280, 900, 0.22, 0.25); noise(0.2, 0.2, 3000, 800, 0, 'bandpass'); break;
      case 'burst': tone('sawtooth', 120, 600, 0.5, 0.3); tone('square', 240, 1200, 0.5, 0.2); [0, 4, 7, 12].forEach((n, i) => tone('triangle', NOTE(60 + n), 0, 0.5, 0.2, A.ctx.currentTime + i * 0.08)); break;
      case 'boom': noise(0.5, 0.9, 1200, 60, 0, 'lowpass'); tone('sine', 120, 40, 0.4, 0.6); break;
      case 'react': tone('square', 880, 0, 0.07, 0.25); tone('square', 1320, 0, 0.1, 0.25, A.ctx.currentTime + 0.07); break;
      case 'pickup': tone('square', 988, 0, 0.06, 0.25); tone('square', 1318, 0, 0.09, 0.25, A.ctx.currentTime + 0.06); break;
      case 'mora': tone('square', 1568, 0, 0.05, 0.2); tone('square', 2093, 0, 0.1, 0.2, A.ctx.currentTime + 0.05); break;
      case 'anemo': [72, 76, 79, 84].forEach((n, i) => tone('triangle', NOTE(n), 0, 0.2, 0.3, A.ctx.currentTime + i * 0.05)); break;
      case 'chest': [60, 64, 67, 72, 76].forEach((n, i) => tone('square', NOTE(n), 0, 0.18, 0.2, A.ctx.currentTime + i * 0.07)); break;
      case 'hurt': tone('square', 200, 70, 0.18, 0.35); noise(0.1, 0.3, 900, 200); break;
      case 'die': noise(0.25, 0.5, 2000, 200); tone('square', 400, 80, 0.25, 0.2); break;
      case 'levelup': [60, 64, 67, 72, 76, 79, 84].forEach((n, i) => tone('square', NOTE(n), 0, 0.2, 0.2, A.ctx.currentTime + i * 0.07)); break;
      case 'swap': tone('triangle', 400, 1200, 0.12, 0.25); break;
      case 'jump': tone('square', 300, 600, 0.09, 0.15); break;
      case 'dash': noise(0.14, 0.4, 3500, 500, 0, 'bandpass'); break;
      case 'splash': noise(0.25, 0.5, 2500, 500, 0, 'bandpass'); break;
      case 'heal': [67, 71, 74, 79].forEach((n, i) => tone('triangle', NOTE(n), 0, 0.3, 0.25, A.ctx.currentTime + i * 0.09)); break;
      case 'unlock': [67, 72, 76, 79].forEach((n, i) => tone('square', NOTE(n), 0, 0.2, 0.2, A.ctx.currentTime + i * 0.09)); break;
      case 'quest': [62, 66, 69, 74].forEach((n, i) => tone('triangle', NOTE(n), 0, 0.3, 0.3, A.ctx.currentTime + i * 0.1)); break;
      case 'star3': tone('triangle', NOTE(72), 0, 0.4, 0.3); break;
      case 'star4': [72, 76, 79].forEach((n, i) => tone('triangle', NOTE(n), 0, 0.4, 0.3, A.ctx.currentTime + i * 0.12)); break;
      case 'star5': [72, 76, 79, 84, 88, 91, 96].forEach((n, i) => tone('square', NOTE(n), 0, 0.5, 0.22, A.ctx.currentTime + i * 0.1)); break;
      case 'wish': tone('sine', 200, 1600, 1.4, 0.35); noise(1.2, 0.25, 800, 6000, 0, 'bandpass'); break;
    }
  };

  // ---------- Musique générative ----------
  const SCALES = {
    field: { root: 60, scale: [0, 2, 4, 7, 9], chords: [[0, 4, 7], [9, 0, 4], [5, 9, 0], [7, 11, 2]], bpm: 84, lead: 'triangle', drums: false },
    city: { root: 62, scale: [0, 2, 4, 7, 9], chords: [[0, 4, 7], [7, 11, 2], [9, 0, 4], [5, 9, 0]], bpm: 96, lead: 'square', drums: false },
    combat: { root: 57, scale: [0, 3, 5, 7, 10], chords: [[0, 3, 7], [8, 0, 3], [5, 8, 0], [7, 10, 2]], bpm: 140, lead: 'square', drums: true },
    boss: { root: 55, scale: [0, 3, 5, 6, 7, 10], chords: [[0, 3, 7], [1, 5, 8], [5, 8, 0], [7, 10, 2]], bpm: 150, lead: 'sawtooth', drums: true },
    title: { root: 60, scale: [0, 2, 4, 7, 9], chords: [[0, 4, 7], [5, 9, 0], [7, 11, 2], [9, 0, 4]], bpm: 72, lead: 'triangle', drums: false },
  };
  let step = 0, nextT = 0, rngM = G.rng(5);
  A.setMusic = function (m) { if (A.music !== m) { A.music = m; step = 0; } };
  function startMusicLoop() {
    setInterval(() => {
      if (!A.ctx || A.muted || A.music === 'none' || A.ctx.state !== 'running') return;
      const M = SCALES[A.music]; if (!M) return;
      const c = A.ctx;
      const dur = 60 / M.bpm / 2; // croche
      if (nextT < c.currentTime) nextT = c.currentTime + 0.05;
      while (nextT < c.currentTime + 0.35) {
        const bar = Math.floor(step / 8) % 4;
        const beat = step % 8;
        const ch = M.chords[bar];
        // basse
        if (beat === 0 || beat === 4) tone('triangle', NOTE(M.root - 12 + ch[0]), 0, dur * 3.6, 0.5, nextT, mGain);
        // arpège
        if (beat % 2 === 1 || M.drums) tone('square', NOTE(M.root + ch[beat % 3] + (beat > 3 ? 12 : 0)), 0, dur * 1.4, 0.12, nextT, mGain);
        // mélodie
        if (beat % 2 === 0 && rngM() < (M.drums ? 0.75 : 0.5)) {
          const n = M.scale[Math.floor(rngM() * M.scale.length)] + 12 + (rngM() < 0.25 ? 12 : 0);
          tone(M.lead, NOTE(M.root + n), 0, dur * (rngM() < 0.3 ? 3 : 1.6), 0.26, nextT, mGain);
        }
        // percussions
        if (M.drums) {
          if (beat % 4 === 0) { tone('sine', 140, 45, 0.12, 0.8, nextT, mGain); }
          if (beat % 4 === 2) noise(0.06, 0.35, 5000, 2000, nextT, 'highpass', mGain);
          if (beat % 2 === 1) noise(0.03, 0.15, 7000, 5000, nextT, 'highpass', mGain);
        }
        nextT += dur; step++;
      }
    }, 90);
  }
})();
