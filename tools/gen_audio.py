#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Synthèse procédurale de tous les sons et musiques du jeu (numpy + scipy).
Sortie : game/assets/audio/*.ogg (encodage Vorbis via ffmpeg)
"""
import os
import subprocess
import tempfile
import numpy as np
from scipy.signal import lfilter, butter, sosfilt
from scipy.io import wavfile

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
OUT = os.path.join(ROOT, "game", "assets", "audio")
os.makedirs(OUT, exist_ok=True)
SR = 44100
rng = np.random.default_rng(42)


def save(name, x, stereo=False, quality=4):
    x = np.asarray(x, dtype=np.float64)
    peak = np.max(np.abs(x)) + 1e-9
    x = x / peak * 0.92
    if stereo and x.ndim == 1:
        x = np.stack([x, x], -1)
    data = (x * 32767).astype(np.int16)
    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as f:
        tmp = f.name
    wavfile.write(tmp, SR, data)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", tmp, "-c:a", "libvorbis", "-q:a", str(quality),
                    os.path.join(OUT, name + ".ogg")], check=True)
    os.remove(tmp)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def lp(x, fc, order=2):
    sos = butter(order, fc / (SR / 2), btype="low", output="sos")
    return sosfilt(sos, x, axis=0)


def hp(x, fc, order=2):
    sos = butter(order, fc / (SR / 2), btype="high", output="sos")
    return sosfilt(sos, x, axis=0)


def bp(x, f1, f2, order=2):
    sos = butter(order, [f1 / (SR / 2), f2 / (SR / 2)], btype="band", output="sos")
    return sosfilt(sos, x, axis=0)


def periodic_noise(n, seed=0):
    r = np.random.default_rng(seed)
    spec = r.standard_normal(n // 2 + 1) + 1j * r.standard_normal(n // 2 + 1)
    return np.fft.irfft(spec, n)


def env_exp(n, decay):
    return np.exp(-np.arange(n) / SR / decay)


# ---------------------------------------------------------------------------
# Moteurs (boucles parfaites)
# ---------------------------------------------------------------------------

def engine(name, f0, harmonics, rough, noise_amt, cycles, seed):
    n = int(round(cycles / f0 * SR))
    t = np.arange(n) / SR
    f = cycles / (n / SR)  # fréquence ajustée pour boucler exactement
    x = np.zeros(n)
    r = np.random.default_rng(seed)
    for k, a in harmonics:
        ph = r.random() * 2 * np.pi
        x += a * np.sin(2 * np.pi * f * k * t + ph)
    # irrégularité cycle à cycle (explosions)
    cyc = np.floor(t * f).astype(int)
    amp = 1.0 + rough * r.standard_normal(cycles)[cyc % cycles]
    pulse = (np.sin(2 * np.pi * f * t) * 0.5 + 0.5) ** 6
    x = x * amp + 0.6 * pulse * amp
    nz = periodic_noise(n, seed + 1)
    nz = nz / np.max(np.abs(nz))
    nz_f = np.real(np.fft.irfft(np.fft.rfft(nz) * (np.arange(n // 2 + 1) < n * 2500 / SR), n))
    x += noise_amt * nz_f * (0.5 + pulse)
    x = np.tanh(x * 1.4)
    save(name, x)


# ---------------------------------------------------------------------------
# Effets
# ---------------------------------------------------------------------------

def noise_loop(name, dur, f1, f2, seed, am=0.0, amf=6.0):
    n = int(dur * SR)
    nz = periodic_noise(n, seed)
    spec = np.fft.rfft(nz)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    spec *= ((freqs > f1) & (freqs < f2)).astype(float)
    x = np.fft.irfft(spec, n)
    if am > 0:
        cycles = max(1, round(amf * dur))
        x *= 1 + am * np.sin(2 * np.pi * cycles / dur * np.arange(n) / SR)
    save(name, x)


def screech():
    dur = 2.0
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = periodic_noise(n, 7)
    spec = np.fft.rfft(nz)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    spec *= np.exp(-((freqs - 1400) / 500) ** 2) + 0.6 * np.exp(-((freqs - 2800) / 400) ** 2)
    x = np.fft.irfft(spec, n)
    x /= np.max(np.abs(x))
    # composante tonale vibrante
    cycles = 2400
    tone = np.sin(2 * np.pi * (cycles / dur) * t + 3 * np.sin(2 * np.pi * 12 / dur * t))
    x = 0.7 * x + 0.35 * tone * (0.6 + 0.4 * np.sin(2 * np.pi * 9 / dur * t))
    save("tire_screech", x)


def whoosh(name, dur=0.9, f_start=300, f_end=2500, seed=3):
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    out = np.zeros(n)
    seg = 256
    for i in range(0, n, seg):
        u = i / n
        fc = f_start + (f_end - f_start) * u
        chunk = nz[i:i + seg]
        out[i:i + seg] = chunk
    out = bp(out, 200, 4000)
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    out = out * env
    out = lp(out, 3000) + 0.3 * hp(out, 2000)
    save(name, out)


def nitro_start():
    dur = 1.4
    n = int(dur * SR)
    t = np.arange(n) / SR
    nz = rng.standard_normal(n)
    x = bp(nz, 600, 6000) * np.minimum(t / 0.05, 1) * np.exp(-t / 0.9)
    boom = np.sin(2 * np.pi * (80 - 40 * t) * t) * np.exp(-t / 0.25)
    x = x + 0.8 * boom
    save("nitro_start", x)


def shockwave():
    dur = 1.8
    n = int(dur * SR)
    t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * (120 * np.exp(-t * 3) + 30) * t) * np.exp(-t / 0.5)
    nz = lp(rng.standard_normal(n), 1500) * np.exp(-t / 0.6)
    sweep = np.sin(2 * np.pi * (200 + 1800 * t) * t) * np.exp(-t / 0.4) * 0.3
    save("shockwave", boom + 0.8 * nz + sweep)


def crash():
    dur = 1.6
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = lp(rng.standard_normal(n), 2500) * np.exp(-t / 0.35) * 1.2
    x += np.sin(2 * np.pi * 55 * t) * np.exp(-t / 0.18) * 1.5
    # tôle / verre
    for k in range(12):
        t0 = rng.random() * 0.6
        f = rng.uniform(900, 5000)
        d = rng.uniform(0.05, 0.3)
        m = (t >= t0)
        x += m * np.sin(2 * np.pi * f * (t - t0)) * np.exp(-(t - t0) / d) * 0.25 * rng.random()
    glass = hp(rng.standard_normal(n), 4000) * np.exp(-t / 0.4) * (t > 0.05) * 0.4
    save("crash", x + glass)


def hit():
    dur = 0.5
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = lp(rng.standard_normal(n), 1500) * np.exp(-t / 0.08)
    x += np.sin(2 * np.pi * 70 * t) * np.exp(-t / 0.1) * 1.2
    x += np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.05) * 0.2
    save("hit", x)


def land():
    dur = 0.6
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = np.sin(2 * np.pi * (90 - 50 * t) * t) * np.exp(-t / 0.15) * 1.3
    x += lp(rng.standard_normal(n), 800) * np.exp(-t / 0.1)
    save("land", x)


def scrape():
    dur = 1.5
    n = int(dur * SR)
    nz = periodic_noise(n, 11)
    spec = np.fft.rfft(nz)
    freqs = np.fft.rfftfreq(n, 1 / SR)
    spec *= np.exp(-((freqs - 3000) / 1800) ** 2) + 0.4 * np.exp(-((freqs - 700) / 200) ** 2)
    x = np.fft.irfft(spec, n)
    t = np.arange(n) / SR
    x *= 1 + 0.5 * np.sin(2 * np.pi * 22 / dur * t)
    save("scrape", x)


def beep(name, f, dur=0.25):
    t = t_axis(dur)
    x = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t)) * np.minimum(t / 0.005, 1) * np.exp(-t / (dur * 0.5))
    save(name, x)


def ui_sounds():
    t = t_axis(0.08)
    save("ui_click", np.sin(2 * np.pi * 1800 * t) * np.exp(-t / 0.015) + 0.3 * hp(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.008))
    t = t_axis(0.35)
    x = np.zeros(len(t))
    for i, f in enumerate([660, 990]):
        m = t >= i * 0.07
        x += m * np.sin(2 * np.pi * f * (t - i * 0.07)) * np.exp(-(t - i * 0.07) / 0.12)
    save("ui_confirm", x)
    t = t_axis(0.25)
    save("ui_back", np.sin(2 * np.pi * (700 - 900 * t) * t) * np.exp(-t / 0.08))
    # récompense : arpège de pièces
    t = t_axis(1.0)
    x = np.zeros(len(t))
    for i, f in enumerate([1046, 1318, 1568, 2093, 2637]):
        t0 = i * 0.08
        m = t >= t0
        x += m * (np.sin(2 * np.pi * f * (t - t0)) + 0.4 * np.sin(2 * np.pi * 2 * f * (t - t0))) * np.exp(-(t - t0) / 0.25)
    save("reward", x)
    # déblocage : fanfare
    t = t_axis(1.8)
    x = np.zeros(len(t))
    for i, chord in enumerate([[523, 659, 784], [587, 740, 880], [784, 988, 1175, 1568]]):
        t0 = i * 0.28
        m = t >= t0
        for f in chord:
            ph = 2 * np.pi * f * (t - t0)
            x += m * (np.sin(ph) + 0.5 * np.sin(2 * ph) + 0.25 * np.sin(3 * ph)) * np.exp(-(t - t0) / (0.4 if i < 2 else 0.9))
    save("unlock", x)
    # popup cascade (stunt)
    t = t_axis(0.4)
    save("stunt", np.sin(2 * np.pi * (500 + 1500 * t) * t) * np.exp(-t / 0.15) + 0.2 * hp(rng.standard_normal(len(t)), 5000) * np.exp(-t / 0.05))
    # takedown impact lourd
    t = t_axis(1.0)
    x = np.sin(2 * np.pi * (60 + 30 * np.exp(-t * 8)) * t) * np.exp(-t / 0.3) * 1.5
    x += lp(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.2)
    x += np.sin(2 * np.pi * 220 * t) * np.exp(-t / 0.4) * 0.3
    save("takedown", x)


# ---------------------------------------------------------------------------
# Musique
# ---------------------------------------------------------------------------

NOTE = {"C": 0, "C#": 1, "D": 2, "D#": 3, "E": 4, "F": 5, "F#": 6, "G": 7, "G#": 8, "A": 9, "A#": 10, "B": 11}


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def chord_notes(root, kind):
    r = 48 + NOTE[root]
    if kind == "m":
        return [r, r + 3, r + 7]
    if kind == "M":
        return [r, r + 4, r + 7]
    if kind == "m7":
        return [r, r + 3, r + 7, r + 10]
    if kind == "M7":
        return [r, r + 4, r + 7, r + 11]
    return [r, r + 4, r + 7]


def saw(f, t, detune=0.0):
    ph = (f * (1 + detune) * t) % 1.0
    return 2 * ph - 1


def supersaw(f, t, voices=5, spread=0.012):
    x = np.zeros_like(t)
    for v in range(voices):
        d = (v - (voices - 1) / 2) / ((voices - 1) / 2 + 1e-9) * spread
        x += saw(f, t + rng.random(), d)
    return x / voices


def adsr(n, a, d, s, r_, total):
    env = np.ones(n) * s
    na, nd, nr = int(a * SR), int(d * SR), int(r_ * SR)
    nt = int(total * SR)
    env[:na] = np.linspace(0, 1, na) if na > 0 else 1
    if nd > 0:
        env[na:na + nd] = np.linspace(1, s, min(nd, max(0, n - na)))[:max(0, min(nd, n - na))]
    if nt < n:
        rel = np.linspace(s, 0, max(1, nr))
        end = min(n, nt + nr)
        env[nt:end] = rel[:end - nt]
        env[end:] = 0
    return env


def render_song(name, bpm, progression, bars, sections, seed, style="synthwave", key_root=57):
    r = np.random.default_rng(seed)
    beat = 60.0 / bpm
    bar = beat * 4
    total = bars * bar + 2.0
    n = int(total * SR)
    L = np.zeros(n)
    R = np.zeros(n)
    side = np.zeros(n)  # sidechain envelope accumulator (kick)

    def add(sig, start, gain=1.0, pan=0.0):
        i0 = int(start * SR)
        if i0 >= n:
            return
        sig = sig[:n - i0]
        L[i0:i0 + len(sig)] += sig * gain * (1 - pan) * 0.5 * 2 ** 0.5
        R[i0:i0 + len(sig)] += sig * gain * (1 + pan) * 0.5 * 2 ** 0.5

    # instruments
    def kick():
        t = t_axis(0.45)
        return np.sin(2 * np.pi * (45 + 110 * np.exp(-t * 28)) * t) * np.exp(-t / 0.22) + \
            0.3 * np.exp(-t / 0.004) * rng.standard_normal(len(t))

    def snare():
        t = t_axis(0.35)
        nz = hp(rng.standard_normal(len(t)), 1500) * np.exp(-t / 0.12)
        tone = np.sin(2 * np.pi * 190 * t) * np.exp(-t / 0.06)
        return 0.8 * nz + 0.6 * tone

    def hat(open_=False):
        t = t_axis(0.3 if open_ else 0.06)
        return hp(rng.standard_normal(len(t)), 7000) * np.exp(-t / (0.12 if open_ else 0.018))

    K, Sn, H, HO = kick(), snare(), hat(), hat(True)
    prog = [chord_notes(*c) for c in progression]

    for b in range(bars):
        sec = sections[min(b * len(sections) // bars, len(sections) - 1)]
        ch = prog[b % len(prog)]
        t0 = b * bar
        # batterie
        if "drums" in sec:
            for q in range(4):
                add(K, t0 + q * beat, 0.9)
                side_i = int((t0 + q * beat) * SR)
                ln = int(0.25 * SR)
                if side_i < n:
                    seg = np.linspace(1, 0, min(ln, n - side_i)) ** 2
                    side[side_i:side_i + len(seg)] = np.maximum(side[side_i:side_i + len(seg)], seg)
            for q in (1, 3):
                add(Sn, t0 + q * beat, 0.55)
            for e in range(8):
                add(H if e % 2 == 0 else HO * 0.5, t0 + e * beat / 2 + (beat / 2 if style == "dnb" and e % 2 else 0) * 0,
                    0.18, pan=0.3)
            if style == "dnb":
                add(K, t0 + 2.5 * beat, 0.7)
        elif "hats" in sec:
            for e in range(8):
                add(H, t0 + e * beat / 2, 0.12, pan=0.3)
        # basse
        if "bass" in sec:
            root = ch[0] - 12
            for e in range(8):
                f = mtof(root + (12 if e % 2 == 1 and style != "chill" else 0))
                t = t_axis(beat / 2)
                sig = saw(f, t) + 0.5 * np.sin(2 * np.pi * f * t)
                sig = lp(sig, 900) * adsr(len(t), 0.003, 0.1, 0.6, 0.03, beat / 2 - 0.03)
                add(sig, t0 + e * beat / 2, 0.38)
        # nappe
        if "pad" in sec:
            t = t_axis(bar + 0.3)
            sig = np.zeros(len(t))
            for m in ch:
                sig += supersaw(mtof(m + 12), t, 5, 0.01)
            sig = lp(sig, 2200) * adsr(len(t), 0.25, 0.3, 0.8, 0.3, bar)
            add(sig, t0, 0.16, pan=-0.2)
            add(sig, t0 + 0.012, 0.12, pan=0.4)
        # arpège
        if "arp" in sec:
            notes = ch + [ch[0] + 12, ch[1] + 12]
            for e in range(16):
                m = notes[(e * 3 + b) % len(notes)] + 12
                t = t_axis(beat / 4)
                f = mtof(m)
                sig = np.sign(np.sin(2 * np.pi * f * t)) * 0.6 + saw(f, t) * 0.4
                sig = lp(sig, 3500) * np.exp(-t / 0.08)
                add(sig, t0 + e * beat / 4, 0.10, pan=0.5 * np.sin(e))
                add(sig, t0 + e * beat / 4 + beat * 0.75, 0.04, pan=-0.5)  # écho
        # mélodie
        if "lead" in sec:
            scale = [0, 2, 3, 5, 7, 8, 10]
            pos = 4
            for e in range(8):
                if r.random() < 0.25 and e % 2 == 1:
                    continue
                pos = int(np.clip(pos + r.integers(-2, 3), 0, 9))
                if e % 4 == 0:
                    # notes de l'accord sur les temps forts
                    m = ch[r.integers(0, len(ch))] + 24
                else:
                    deg = scale[pos % 7] + 12 * (pos // 7)
                    m = key_root + deg + 12
                dur = beat / 2 * (2 if r.random() < 0.3 else 1)
                t = t_axis(dur + 0.2)
                f = mtof(m)
                vib = 1 + 0.004 * np.sin(2 * np.pi * 5.5 * t) * np.minimum(t / 0.2, 1)
                sig = supersaw(f, t * vib, 3, 0.006)
                sig = lp(sig, 4000) * adsr(len(t), 0.01, 0.1, 0.7, 0.15, dur)
                add(sig, t0 + e * beat / 2, 0.14, pan=0.1)
                add(sig, t0 + e * beat / 2 + beat * 0.75, 0.05, pan=-0.4)
    # sidechain
    duck = 1 - 0.55 * side
    mix_l = L * duck + 0.0
    mix_r = R * duck
    # réverbération simple (peignes)
    def verb(x):
        y = np.zeros_like(x)
        for dly, g in ((0.031, 0.5), (0.047, 0.4), (0.071, 0.33), (0.113, 0.25)):
            d = int(dly * SR)
            b = np.zeros(d + 1); b[0] = 1
            a = np.zeros(d + 1); a[0] = 1; a[d] = -g
            y += lfilter(b, a, x) * 0.25
        return lp(y, 5000)
    mix_l = mix_l + 0.25 * verb(mix_l)
    mix_r = mix_r + 0.25 * verb(mix_r)
    # master
    out = np.stack([mix_l, mix_r], -1)
    out = np.tanh(out * 1.6) / np.tanh(1.6)
    # fondu pour boucle propre
    fade = int(1.5 * SR)
    out[-fade:] *= np.linspace(1, 0, fade)[:, None]
    out[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))[:, None]
    save(name, out, stereo=True, quality=3)


def music():
    render_song("music_menu", 96, [("A", "m7"), ("F", "M7"), ("C", "M"), ("G", "M")], 32,
                [["pad", "hats"], ["pad", "bass", "drums", "arp"], ["pad", "bass", "drums", "arp", "lead"],
                 ["pad", "arp"]], seed=1, style="chill", key_root=57)
    render_song("music_race1", 128, [("A", "m"), ("F", "M"), ("C", "M"), ("G", "M")], 48,
                [["pad", "arp", "hats"], ["pad", "bass", "drums", "arp"], ["pad", "bass", "drums", "arp", "lead"],
                 ["bass", "drums", "arp"], ["pad", "bass", "drums", "arp", "lead"]], seed=2, key_root=57)
    render_song("music_race2", 140, [("E", "m"), ("C", "M"), ("D", "M"), ("B", "m")], 48,
                [["bass", "drums", "hats"], ["pad", "bass", "drums", "arp"], ["pad", "bass", "drums", "arp", "lead"],
                 ["pad", "bass", "drums", "lead"]], seed=3, style="dnb", key_root=52)


if __name__ == "__main__":
    engine("engine_4cyl", 42.0, [(1, 1.0), (2, 0.7), (3, 0.45), (4, 0.35), (6, 0.2), (8, 0.12), (12, 0.06)],
           0.18, 0.35, 84, 1)
    engine("engine_v8", 38.0, [(0.5, 0.6), (1, 1.0), (1.5, 0.35), (2, 0.6), (3, 0.3), (4, 0.25), (5, 0.12),
                                (8, 0.08)], 0.28, 0.25, 76, 2)
    noise_loop("wind", 3.0, 150, 2500, 21, am=0.25, amf=0.67)
    noise_loop("nitro_loop", 2.0, 400, 9000, 22, am=0.15, amf=8)
    screech(); whoosh("whoosh"); nitro_start(); shockwave(); crash(); hit(); land(); scrape()
    beep("beep_count", 660); beep("beep_go", 1320, 0.5)
    ui_sounds()
    music()
    print("audio OK")
