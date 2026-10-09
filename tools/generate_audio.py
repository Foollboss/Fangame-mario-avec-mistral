# -*- coding: utf-8 -*-
"""
Asphalt Fangame — génération des sons et de la musique en fichiers .wav.

Avant, la musique synthwave et les bruitages étaient calculés en GDScript au lancement du
jeu (la musique dans un Thread). Sur téléphone ce calcul prend plusieurs dizaines de
secondes : on les pré-calcule donc ici, une fois pour toutes.

Utilisation : python3 tools/generate_audio.py
Sortie      : godot/assets/audio/*.wav (mono, 16 bits, 22 050 Hz)
"""
import math
import os
import struct
import wave

import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "godot", "assets", "audio")
MIX = 22050
rng = np.random.default_rng(1234567)


def write_wav(name, samples):
    os.makedirs(OUT, exist_ok=True)
    s = np.clip(np.asarray(samples, dtype=np.float64), -1.0, 1.0)
    data = (s * 32000.0).astype("<i2").tobytes()
    with wave.open(os.path.join(OUT, name + ".wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(MIX)
        w.writeframes(data)
    print("ok", name, len(s))


def gen(duration, f):
    n = int(duration * MIX)
    out = np.zeros(n)
    state = {"lp": 0.0}
    for i in range(n):
        out[i] = f(i / MIX, duration, state)
    return out


def noise():
    return rng.uniform(-1.0, 1.0)


def sfx():
    def crash(t, d, st):
        e = math.exp(-t * 5.0)
        st["lp"] = st["lp"] * 0.75 + noise() * 0.25
        return (st["lp"] * 1.6 + math.sin(math.tau * 55.0 * t) * math.exp(-t * 9.0)) * e * 0.9

    def takedown(t, d, st):
        e = math.exp(-t * 4.0)
        return (noise() * 0.5 * e + math.sin(math.tau * (90.0 - 40.0 * t) * t) * math.exp(-t * 6.0) * 0.8
                + math.sin(math.tau * 1800.0 * t) * math.exp(-t * 18.0) * 0.2)

    def boost(t, d, st):
        e = math.sin(math.pi * t / d)
        st["lp"] = st["lp"] * (0.92 - 0.3 * t) + noise() * (0.08 + 0.3 * t)
        return st["lp"] * e * 1.5

    def shockwave(t, d, st):
        e = math.exp(-t * 2.5)
        st["lp"] = st["lp"] * 0.85 + noise() * 0.15
        return (math.sin(math.tau * (70.0 - 30.0 * t) * t) * 0.9 + st["lp"] * 1.8) * e

    def beep(t, d, st):
        return math.sin(math.tau * 880.0 * t) * 0.5 * (1.0 - t / d)

    def go(t, d, st):
        return (math.sin(math.tau * 1320.0 * t) + 0.4 * math.sin(math.tau * 1980.0 * t)) * 0.4 * (1.0 - t / d)

    def click(t, d, st):
        return math.sin(math.tau * 2200.0 * t) * 0.35 * (1.0 - t / d)

    def confirm(t, d, st):
        f = 880.0 if t < 0.09 else 1320.0
        return math.sin(math.tau * f * t) * 0.35 * (1.0 - t / d)

    def land(t, d, st):
        st["lp"] = st["lp"] * 0.9 + noise() * 0.1
        return (math.sin(math.tau * 60.0 * t) * 0.9 + st["lp"] * 1.2) * math.exp(-t * 14.0)

    def scrape(t, d, st):
        return (noise() * 0.3 + math.sin(math.tau * 2600.0 * t + noise()) * 0.15) * (1.0 - t / d)

    def whoosh(t, d, st):
        st["lp"] = st["lp"] * 0.8 + noise() * 0.2
        return st["lp"] * math.sin(math.pi * t / d) * 1.6

    def reward(t, d, st):
        notes = [523.25, 659.25, 783.99, 1046.5]
        k = min(3, int(t / 0.12))
        return math.sin(math.tau * notes[k] * t) * 0.3 * math.exp(-(t - k * 0.12) * 6.0)

    def star(t, d, st):
        return (math.sin(math.tau * 1046.5 * t) + math.sin(math.tau * 1318.5 * t) + math.sin(math.tau * 1568.0 * t)) * 0.15 * math.exp(-t * 3.0)

    table = [("crash", 0.9, crash), ("takedown", 0.8, takedown), ("boost", 0.7, boost), ("shockwave", 1.1, shockwave),
             ("beep", 0.18, beep), ("go", 0.5, go), ("click", 0.05, click), ("confirm", 0.22, confirm), ("land", 0.3, land),
             ("scrape", 0.35, scrape), ("whoosh", 0.45, whoosh), ("reward", 0.7, reward), ("star", 1.0, star)]
    for name, dur, f in table:
        write_wav("sfx_" + name, gen(dur, f))


def music():
    """Boucle synthwave : Am - F - C - G (x2), 112 BPM, 8 mesures."""
    bpm = 112.0
    beat = 60.0 / bpm
    bars = 8
    n = int(bars * 4 * beat * MIX)
    t = np.arange(n) / MIX
    roots = np.array([57, 53, 60, 55, 57, 53, 60, 55])
    chords = np.array([[0, 3, 7, 12], [0, 4, 7, 12], [0, 4, 7, 12], [0, 4, 7, 12]])
    bar = (t / (4.0 * beat)).astype(int) % bars
    in_bar = np.mod(t, 4.0 * beat)
    root = roots[bar]
    ch = chords[bar % 4]
    # basse en croches
    e8 = np.mod(t, beat * 0.5)
    bass_f = 440.0 * 2.0 ** ((root - 24 - 69) / 12.0)
    bass_ph = np.mod(t * bass_f, 1.0)
    bass = (bass_ph * 2.0 - 1.0) * np.exp(-e8 * 5.0) * 0.32
    # arpège en doubles croches
    step = (in_bar / (beat * 0.25)).astype(int)
    e16 = np.mod(t, beat * 0.25)
    note = root + ch[np.arange(n), step % 4] + np.where((step // 4) % 2 == 1, 12, 0)
    af = 440.0 * 2.0 ** ((note - 69) / 12.0)
    arp_ph = np.mod(t * af, 1.0)
    arp = np.where(arp_ph < 0.5, 1.0, -1.0) * np.exp(-e16 * 9.0) * 0.07
    # nappe
    pad = np.zeros(n)
    for k in range(3):
        pf = 440.0 * 2.0 ** ((root + ch[:, k] - 69) / 12.0)
        pad += np.sin(math.tau * pf * t) * 0.035 + np.sin(math.tau * pf * 1.003 * t) * 0.03
    # batterie
    eb = np.mod(t, beat)
    kick = np.sin(math.tau * (50.0 + 90.0 * np.exp(-eb * 30.0)) * eb) * np.exp(-eb * 7.0) * 0.55
    beat_idx = (t / beat).astype(int) % 4
    nz = rng.uniform(-1.0, 1.0, n)
    snare = np.where((beat_idx == 1) | (beat_idx == 3), nz * np.exp(-eb * 14.0) * 0.28, 0.0)
    hat = nz * np.exp(-e8 * 60.0) * 0.06
    # filtres passe-bas (récursifs)
    out = np.zeros(n)
    lpb = 0.0
    lp = 0.0
    for i in range(n):
        lpb += (bass[i] - lpb) * 0.08
        s = lpb + arp[i] + pad[i] + kick[i] + snare[i] + hat[i]
        lp += (s - lp) * 0.6
        out[i] = math.tanh(lp * 1.2) * 0.8
    write_wav("music_synthwave", out)


if __name__ == "__main__":
    sfx()
    music()
