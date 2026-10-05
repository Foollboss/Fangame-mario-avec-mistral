"""Bibliothèque d'animations des héros, style action-RPG « anime » (Genshin-like).

Toutes les distances sont en « longueurs de jambe » (hauteur des hanches du perso),
les angles en degrés. Les directions des bras / lames sont dans le repère de la poitrine :
az(azimut, élévation) avec 0 = devant, +90 = gauche, -90 = droite.
"""
import math
from .keys import Track, az, down, nz

TAU = math.tau


def cyc(phase, k=1.0, off=0.0):
    return math.cos(TAU * (k * phase - off))


def syc(phase, k=1.0, off=0.0):
    return math.sin(TAU * (k * phase - off))


def catmull_pts(pts, s):
    """pts : liste de tuples régulièrement espacés sur [0,1]."""
    n = len(pts) - 1
    x = min(max(s, 0.0), 1.0) * n
    i = min(int(x), n - 1)
    u = x - i
    p0 = pts[max(i - 1, 0)]
    p1 = pts[i]
    p2 = pts[i + 1]
    p3 = pts[min(i + 2, n)]
    out = []
    for c in range(len(p1)):
        a, b, cc, d = p0[c], p1[c], p2[c], p3[c]
        out.append(0.5 * ((2 * b) + (-a + cc) * u + (2 * a - 5 * b + 4 * cc - d) * u * u + (-a + 3 * b - 3 * cc + d) * u ** 3))
    return out


# ----------------------------------------------------------------------------
# Styles des personnages
# ----------------------------------------------------------------------------
STYLES = {
    "kael": {"fem": False, "weapon": "sword", "arm_swing": 1.0, "width": 0.05},
    "lyra": {"fem": True, "weapon": "sword", "arm_swing": 0.85, "width": 0.0},
    "zahara": {"fem": True, "weapon": "staff", "arm_swing": 0.8, "width": 0.02},
    "kaelith": {"fem": False, "weapon": "catalyst", "arm_swing": 0.9, "width": 0.03},
}

SPEEDS = {"Walk": 1.2, "Run": 5.2, "Sprint": 7.6}
STRIDE = {"Walk": 1.5, "Run": 3.5, "Sprint": 4.6}  # longueur d'un cycle complet, en longueurs de jambe


def cycle_length(name, LL, fps=30):
    """Durée d'un cycle (arrondie à l'image) pour que les pieds ne glissent pas à la vitesse de jeu."""
    return max(round(STRIDE[name] * LL / SPEEDS[name] * fps), 8) / fps


def natural_speed(name, LL, fps=30):
    """Vitesse (m/s) à laquelle le cycle exporté ne fait pas glisser les pieds."""
    return STRIDE[name] * LL / cycle_length(name, LL, fps)


# ----------------------------------------------------------------------------
# Locomotion
# ----------------------------------------------------------------------------
def gait(phase, st, kind):
    fem = st["fem"]
    S = STRIDE[kind]
    if kind == "Walk":
        duty, lean, bob, base_u = 0.6, 3.0, 0.018, -0.025
    elif kind == "Run":
        duty, lean, bob, base_u = 0.34, 11.0, 0.03, -0.07
    else:
        duty, lean, bob, base_u = 0.3, 19.0, 0.035, -0.09
    exc = duty * S
    F = exc * (0.5 if kind == "Walk" else 0.3)
    B = exc - F
    ch = {}
    for s, off in (("L", 0.0), ("R", 0.5)):
        p = (phase - off) % 1.0
        width = st["width"] - (0.035 if fem else 0.0)
        if p < duty:
            c = p / duty
            f = F - c * (F + B)
            u = 0.0
            if kind == "Walk":
                if c < 0.14:
                    pitch = -16.0 * (1 - c / 0.14) ** 1.5
                elif c > 0.66:
                    pitch = 34.0 * ((c - 0.66) / 0.34) ** 1.4
                else:
                    pitch = 0.0
            else:
                pitch = -6.0 * max(0.0, 1 - c / 0.18) + (48.0 * ((c - 0.55) / 0.45) ** 1.5 if c > 0.55 else 0.0)
        else:
            sw = (p - duty) / (1 - duty)
            if kind == "Walk":
                pts = [(-B, 0.0, 34.0), (-B * 0.55, 0.075, 42.0), (0.0, 0.07, 8.0), (F * 0.7, 0.045, -12.0), (F, 0.0, -16.0)]
            elif kind == "Run":
                pts = [(-B, 0.0, 48.0), (-B * 0.95, 0.30, 85.0), (-0.25, 0.46, 70.0), (0.28, 0.33, 15.0), (F + 0.06, 0.1, -10.0), (F, 0.0, -6.0)]
            else:
                pts = [(-B, 0.0, 50.0), (-B * 0.9, 0.38, 95.0), (-0.2, 0.56, 80.0), (0.42, 0.40, 10.0), (F + 0.1, 0.12, -10.0), (F, 0.0, -6.0)]
            f, u, pitch = catmull_pts(pts, sw)
            u = max(u, 0.0)
        ch["foot%s.p" % s] = (width, f, u)
        ch["foot%s.pitch" % s] = pitch
        ch["foot%s.yaw" % s] = 6.0 if kind == "Walk" else 3.0
    # bassin
    if kind == "Walk":
        hu = base_u + bob * cyc(phase, 2, 0.3 * 2)
    else:
        hu = base_u - bob * cyc(phase, 2, duty)
    sway = (0.03 if fem else 0.018) if kind == "Walk" else 0.012
    ch["hips_off"] = (sway * syc(phase, 1, 0.02), 0.0, hu)
    hip_turn = (9.0 if fem else 6.0) if kind == "Walk" else 11.0
    hip_tilt = (6.0 if fem else 3.5) if kind == "Walk" else 4.0
    ch["hips"] = (lean * 0.6, -hip_turn * cyc(phase), -hip_tilt * syc(phase, 1, 0.08))
    ch["spine"] = (lean * 0.3, hip_turn * 0.9 * cyc(phase), hip_tilt * 0.7 * syc(phase, 1, 0.08))
    chest_turn = (7.0 if kind == "Walk" else 12.0)
    ch["chest"] = (lean * 0.15 + 1.2 * cyc(phase, 2, 0.1), chest_turn * cyc(phase), 0.0)
    ch["neck"] = (-lean * 0.35, -chest_turn * 0.5 * cyc(phase), 0.0)
    ch["head"] = (-lean * 0.35 - 1.0 * cyc(phase, 2, 0.1), -chest_turn * 0.4 * cyc(phase), 0.0)
    # bras
    sw = st["arm_swing"]
    for s, sign in (("R", 1.0), ("L", -1.0)):
        side = 1 if s == "L" else -1
        a = sign * cyc(phase, 1, 0.04)
        if kind == "Walk":
            fwd = 3.0 + 17.0 * sw * a
            out = 13.0 if not fem else 15.0
            bend = 14.0 + 12.0 * max(0.0, a)
            curl = 30.0
        elif kind == "Run":
            fwd = 2.0 + 42.0 * sw * a
            out = 14.0
            bend = 82.0 + 12.0 * max(0.0, a)
            curl = 55.0
        else:
            fwd = 2.0 + 55.0 * sw * a
            out = 12.0
            bend = 78.0 + 18.0 * max(0.0, a)
            curl = 60.0
        ch["arm%s.up" % s] = down(side, fwd, out)
        ch["arm%s.fore" % s] = down(side, fwd + bend, out * (0.4 if kind != "Walk" else 0.8) - (8.0 if kind != "Walk" else 0.0))
        ch["arm%s.curl" % s] = curl
    ch["shL"] = (0.0, 0.0, 0.0)
    ch["shR"] = (0.0, 0.0, 0.0)
    return ch


def idle(phase, st):
    fem = st["fem"]
    b = syc(phase)          # respiration (1 cycle par boucle)
    w = syc(phase, 1, 0.15)  # transfert de poids
    ch = {
        "hips_off": (0.012 * w - (0.012 if fem else 0.0), 0.0, -0.02 + 0.004 * b),
        "hips": (2.0, 4.0 if fem else -3.0, (-3.5 if fem else -1.5) + 1.0 * w),
        "spine": (-1.0 + 0.6 * b, 0.0, (2.0 if fem else 1.0)),
        "chest": (-1.5 - 1.6 * b, -2.0 if fem else 2.0, 0.5),
        "neck": (1.0, 0.0, 0.0),
        "head": (1.0 + 1.2 * b, 6.0 * syc(phase, 1, 0.4), 2.0 if fem else 0.0),
        "shL": (0.0, 0.0, -1.5 * b),
        "shR": (0.0, 0.0, 1.5 * b),
        "footL.p": (0.03 if not fem else -0.01, 0.06 if fem else 0.03, 0.0), "footL.yaw": 14.0, "footL.pitch": 0.0,
        "footR.p": (0.06 if not fem else 0.02, -0.04 if fem else -0.02, 0.0), "footR.yaw": 18.0, "footR.pitch": 0.0,
    }
    if fem:
        ch["footL.p"] = (-0.02, 0.07, 0.0)
        ch["footL.pitch"] = 12.0
        ch["footL.yaw"] = 8.0
    for s in ("L", "R"):
        side = 1 if s == "L" else -1
        ch["arm%s.up" % s] = down(side, 4.0 + 1.5 * b, 11.0 + 1.0 * b)
        ch["arm%s.fore" % s] = down(side, 16.0 + 2.0 * b, 6.0)
        ch["arm%s.curl" % s] = 28.0
    if st["weapon"] == "catalyst":
        # main droite légèrement levée, comme si elle tenait une lueur
        ch["armR.fore"] = down(-1, 55.0 + 4.0 * b, -10.0)
        ch["armR.hand"] = az(10, 20)
        ch["armR.curl"] = 18.0
    return ch


# ----------------------------------------------------------------------------
# Postures de combat
# ----------------------------------------------------------------------------
def ready_pose(st):
    """Garde de combat (sert de base à Idle_Combat et aux attaques)."""
    wp = st["weapon"]
    if wp == "sword":
        return {
            "hips_off": (0.0, -0.02, -0.075), "hips": (6.0, -22.0, 0.0), "spine": (2.0, 6.0, 0.0),
            "chest": (2.0, 6.0, 0.0), "neck": (-2.0, 4.0, 0.0), "head": (-3.0, 6.0, 0.0),
            "footL.p": (0.03, 0.26, 0.0), "footL.yaw": 4.0, "footL.pitch": 0.0,
            "footR.p": (0.09, -0.22, 0.0), "footR.yaw": 38.0, "footR.pitch": 6.0,
            "armR.up": down(-1, 32, 26), "armR.fore": down(-1, 72, 0), "armR.blade": az(20, 22), "armR.curl": 80.0,
            "armL.up": down(1, 22, 26), "armL.fore": down(1, 58, -6), "armL.curl": 40.0, "armL.hand": az(40, -20),
            "shL": (0, 0, 0), "shR": (0, 0, 0), "armframe": "root",
        }
    if wp == "staff":
        return {
            "hips_off": (0.0, -0.02, -0.085), "hips": (5.0, -28.0, 0.0), "spine": (2.0, 8.0, 0.0),
            "chest": (3.0, 6.0, 0.0), "neck": (-2.0, 6.0, 0.0), "head": (-3.0, 8.0, 0.0),
            "footL.p": (0.05, 0.28, 0.0), "footL.yaw": 6.0, "footL.pitch": 0.0,
            "footR.p": (0.11, -0.24, 0.0), "footR.yaw": 40.0, "footR.pitch": 5.0,
            "armR.up": down(-1, 30, 30), "armR.fore": down(-1, 80, -10), "armR.blade": az(25, 38), "armR.curl": 80.0,
            "armL.ik": ("grip", -0.42), "armL.curl": 80.0,
            "shL": (0, 0, 0), "shR": (0, 0, 0), "armframe": "root",
        }
    # catalyseur : mains libres, magie prête
    return {
        "hips_off": (0.0, -0.01, -0.06), "hips": (4.0, -14.0, 0.0), "spine": (1.0, 5.0, 0.0),
        "chest": (0.0, 4.0, 0.0), "neck": (-1.0, 3.0, 0.0), "head": (-2.0, 4.0, 0.0),
        "footL.p": (0.03, 0.2, 0.0), "footL.yaw": 6.0, "footL.pitch": 0.0,
        "footR.p": (0.08, -0.17, 0.0), "footR.yaw": 30.0, "footR.pitch": 4.0,
        "armR.up": down(-1, 40, 30), "armR.fore": az(-25, 10), "armR.hand": az(-10, 45), "armR.curl": 15.0,
        "armL.up": down(1, 18, 28), "armL.fore": down(1, 62, 10), "armL.hand": az(30, 30), "armL.curl": 20.0,
        "shL": (0, 0, 0), "shR": (0, 0, 0), "armframe": "root",
    }


def idle_combat(phase, st):
    ch = ready_pose(st)
    b = syc(phase)
    hl, hf, hu = ch["hips_off"]
    ch["hips_off"] = (hl, hf, hu + 0.012 * syc(phase, 2))
    lean, turn, tilt = ch["chest"]
    ch["chest"] = (lean - 1.5 * b, turn + 1.5 * syc(phase, 1, 0.25), tilt)
    if st["weapon"] == "catalyst":
        ch["armR.hand"] = az(-10 + 8 * b, 45)
        ch["armR.fore"] = az(-25, 10 + 6 * syc(phase, 2))
    return ch


# ----------------------------------------------------------------------------
# Mouvements partagés (one-shot)
# ----------------------------------------------------------------------------
def rest_pose(st):
    return idle(0.0, st)


def jump(st):
    base = rest_pose(st)
    return Track(base, [
        {"t": 0.0, "hips_off": (0, 0.02, -0.02), "hips": (8, 0, 0), "spine": (2, 0, 0), "chest": (-4, 0, 0), "head": (-6, 0, 0),
         "footL.p": (0.02, 0.05, 0.0), "footL.pitch": 45.0, "footR.p": (0.04, -0.05, 0.0), "footR.pitch": 50.0,
         "armL.up": down(1, 60, 25), "armL.fore": down(1, 110, 15), "armR.up": down(-1, 50, 25), "armR.fore": down(-1, 100, 15)},
        {"t": 0.14, "ease": "out", "hips_off": (0, 0.0, 0.03), "hips": (2, 0, 0), "chest": (-6, 0, 0),
         "footL.p": (0.02, 0.12, 0.22), "footL.pitch": 25.0, "footR.p": (0.04, -0.14, 0.12), "footR.pitch": 55.0,
         "armL.up": down(1, 95, 40), "armL.fore": down(1, 140, 35), "armR.up": down(-1, 80, 40), "armR.fore": down(-1, 125, 35)},
        {"t": 0.36, "ease": "io", "hips_off": (0, 0.0, 0.06), "hips": (-4, 0, 0), "chest": (4, 0, 0), "head": (-4, 0, 0),
         "footL.p": (0.03, 0.2, 0.36), "footL.pitch": 10.0, "footR.p": (0.05, -0.04, 0.24), "footR.pitch": 35.0,
         "armL.up": down(1, 40, 55), "armL.fore": down(1, 70, 55), "armR.up": down(-1, 35, 55), "armR.fore": down(-1, 65, 55)},
        {"t": 0.66, "ease": "io", "hips_off": (0, 0.0, 0.04), "hips": (0, 0, 0), "chest": (0, 0, 0),
         "footL.p": (0.03, 0.12, 0.2), "footL.pitch": 20.0, "footR.p": (0.05, -0.08, 0.14), "footR.pitch": 35.0,
         "armL.up": down(1, 25, 45), "armL.fore": down(1, 50, 40), "armR.up": down(-1, 22, 45), "armR.fore": down(-1, 48, 40)},
    ])


def fall(phase, st):
    k = syc(phase)
    return {
        "hips_off": (0.0, 0.0, 0.05), "hips": (2.0, 3.0 * k, 0.0), "spine": (0.0, 0.0, 0.0), "chest": (-4.0, -2.0 * k, 0.0),
        "neck": (0, 0, 0), "head": (-8.0, 0.0, 0.0), "shL": (0, 0, 0), "shR": (0, 0, 0),
        "footL.p": (0.04, 0.10 + 0.05 * k, 0.12 + 0.04 * k), "footL.pitch": 30.0, "footL.yaw": 8.0,
        "footR.p": (0.06, -0.06 - 0.05 * k, 0.06 - 0.03 * k), "footR.pitch": 40.0, "footR.yaw": 8.0,
        "armL.up": down(1, 40 + 10 * k, 70), "armL.fore": down(1, 70 + 15 * k, 75), "armL.curl": 15.0,
        "armR.up": down(-1, 40 - 10 * k, 70), "armR.fore": down(-1, 70 - 15 * k, 75), "armR.curl": 15.0,
    }


def glide(phase, st):
    k = syc(phase)
    return {
        "hips_off": (0.0, 0.0, 0.03), "hips": (-6.0, 2.0 * k, 1.5 * k), "spine": (-4.0, 0.0, 0.0), "chest": (-6.0, 0.0, -1.0 * k),
        "neck": (6.0, 0.0, 0.0), "head": (12.0, 0.0, 0.0), "shL": (0, 0, 8), "shR": (0, 0, -8),
        "footL.p": (0.03, -0.18 + 0.04 * k, 0.08), "footL.pitch": 45.0, "footL.yaw": 4.0,
        "footR.p": (0.05, -0.28 - 0.04 * k, 0.14), "footR.pitch": 55.0, "footR.yaw": 4.0,
        "armL.up": down(1, 168, 24), "armL.fore": down(1, 178, 18), "armL.curl": 85.0,
        "armR.up": down(-1, 168, 24), "armR.fore": down(-1, 178, 18), "armR.curl": 85.0,
    }


def land(st):
    base = rest_pose(st)
    return Track(base, [
        {"t": 0.0, "hips_off": (0, 0.0, -0.06), "hips": (10, 0, 0), "chest": (6, 0, 0), "head": (-8, 0, 0),
         "footL.p": (0.06, 0.08, 0.0), "footR.p": (0.08, -0.06, 0.0),
         "armL.up": down(1, 30, 40), "armL.fore": down(1, 60, 35), "armR.up": down(-1, 30, 40), "armR.fore": down(-1, 60, 35)},
        {"t": 0.08, "ease": "out", "hips_off": (0, 0.03, -0.2), "hips": (22, 0, 0), "spine": (6, 0, 0), "chest": (8, 0, 0), "head": (-18, 0, 0),
         "armL.up": down(1, 45, 35), "armL.fore": down(1, 70, 25), "armR.up": down(-1, 40, 35), "armR.fore": down(-1, 65, 25)},
        {"t": 0.3, "ease": "io", "hips_off": (0, 0.01, -0.08), "hips": (8, 0, 0), "spine": (0, 0, 0), "chest": (2, 0, 0), "head": (-4, 0, 0)},
        {"t": 0.56, "ease": "io", **{k: v for k, v in base.items() if not k.startswith("foot")}},
    ])


def dash(st):
    base = rest_pose(st)
    return Track(base, [
        {"t": 0.0, "hips_off": (0, 0.05, -0.1), "hips": (25, 0, 0), "spine": (6, 0, 0), "chest": (4, 0, 0), "head": (-22, 0, 0),
         "footL.p": (0.04, 0.3, 0.06), "footL.pitch": -10.0, "footR.p": (0.06, -0.35, 0.05), "footR.pitch": 40.0,
         "armL.up": down(1, -35, 25), "armL.fore": down(1, -10, 20), "armR.up": down(-1, -40, 25), "armR.fore": down(-1, -15, 20)},
        {"t": 0.08, "ease": "out", "hips_off": (0, 0.1, -0.16), "hips": (32, 0, 0), "chest": (6, 0, 0), "head": (-28, 0, 0),
         "footL.p": (0.04, 0.42, 0.0), "footL.pitch": 0.0, "footR.p": (0.06, -0.62, 0.12), "footR.pitch": 55.0,
         "armL.up": down(1, -55, 30), "armL.fore": down(1, -40, 25), "armR.up": down(-1, -60, 30), "armR.fore": down(-1, -45, 25)},
        {"t": 0.28, "ease": "linear", "hips_off": (0, 0.08, -0.14), "hips": (28, 0, 0)},
        {"t": 0.5, "ease": "io", **{k: v for k, v in base.items()}},
    ])


def hit(st):
    base = ready_pose(st) if st["weapon"] != "catalyst" else rest_pose(st)
    return Track(base, [
        {"t": 0.0},
        {"t": 0.07, "ease": "snap", "hips_off": (0, -0.06, -0.08), "hips": (-10, 8, 4), "spine": (-8, 0, 0), "chest": (-10, 6, 0),
         "head": (-14, -10, 6), "armL.up": down(1, 40, 45), "armL.fore": down(1, 80, 40), "armL.curl": 10.0},
        {"t": 0.22, "ease": "out", "hips_off": (0, -0.04, -0.1), "hips": (6, 4, 2), "chest": (4, 3, 0), "head": (2, -4, 2)},
        {"t": 0.5, "ease": "io", **base},
    ])


# ----------------------------------------------------------------------------
# Épée (Kael, Lyra)
# ----------------------------------------------------------------------------
def _sw(st, keys, ready=None):
    r = ready or ready_pose(st)
    return Track(r, [{"t": 0.0}] + keys)


def sword_attacks(st, hits, speed=1.0):
    """hits : instants d'impact (temps d'animation) pour chaque coup."""
    R = ready_pose(st)
    rec = {k: v for k, v in R.items()}
    out = {}
    h = hits
    # Coup 1 : taille horizontale droite -> gauche
    t = h[0]
    out["Attack1"] = _sw(st, [
        {"t": t * 0.5, "ease": "out", "hips": (6, -48, 0), "spine": (2, -10, 0), "chest": (0, -14, 0), "head": (-2, 40, 0),
         "hips_off": (-0.03, -0.04, -0.09),
         "armR.up": az(-100, -5), "armR.fore": az(-140, 5), "armR.blade": az(-175, 18), "armR.curl": 90.0,
         "armL.up": az(55, -40), "armL.fore": az(30, -5), "armL.hand": az(30, 10)},
        {"t": t, "ease": "in", "hips": (8, -12, 0), "spine": (3, 0, 0), "chest": (4, 0, 0), "head": (-4, 10, 0),
         "hips_off": (0.0, 0.05, -0.1), "footL.p": (0.03, 0.34, 0.0),
         "armR.up": az(-35, -8), "armR.fore": az(-5, -4), "armR.blade": az(30, 2),
         "armL.up": down(1, 10, 35), "armL.fore": down(1, 40, 30)},
        {"t": t + 0.08, "ease": "out", "hips": (10, 18, 0), "spine": (3, 10, 0), "chest": (4, 18, 0), "head": (-4, -30, 0),
         "hips_off": (0.02, 0.07, -0.11),
         "armR.up": az(45, -18), "armR.fore": az(85, -20), "armR.blade": az(125, -14),
         "armL.up": down(1, -30, 35), "armL.fore": down(1, -10, 30)},
        {"t": t + 0.14, "ease": "out", "hips": (9, 22, 0), "chest": (4, 20, 0), "armR.blade": az(135, -20)},
        {"t": t + 0.36, "ease": "io", **rec},
    ])
    # Coup 2 : revers montant gauche -> droite
    t = h[1]
    start2 = {"hips": (8, 14, 0), "spine": (3, 8, 0), "chest": (4, 14, 0), "head": (-4, -20, 0),
              "armR.up": az(40, -20), "armR.fore": az(75, -22), "armR.blade": az(115, -18)}
    out["Attack2"] = _sw(st, [
        {"t": t * 0.45, "ease": "out", **start2, "hips": (8, 26, 0), "chest": (4, 22, 0),
         "armR.up": az(55, -25), "armR.fore": az(95, -30), "armR.blade": az(150, -25), "hips_off": (0.02, 0.0, -0.1)},
        {"t": t, "ease": "in", "hips": (8, -8, 0), "spine": (3, -4, 0), "chest": (2, -8, 0), "head": (-4, 14, 0),
         "hips_off": (-0.01, 0.06, -0.08), "footL.p": (0.04, 0.32, 0.0),
         "armR.up": az(-10, 5), "armR.fore": az(-15, 18), "armR.blade": az(-15, 28)},
        {"t": t + 0.08, "ease": "out", "hips": (6, -34, 0), "spine": (2, -10, 0), "chest": (0, -18, 0), "head": (-2, 40, 0),
         "hips_off": (-0.03, 0.04, -0.06),
         "armR.up": az(-80, 25), "armR.fore": az(-105, 45), "armR.blade": az(-120, 55),
         "armL.up": down(1, 40, 40), "armL.fore": down(1, 70, 30)},
        {"t": t + 0.14, "ease": "out", "armR.blade": az(-125, 60)},
        {"t": t + 0.36, "ease": "io", **rec},
    ])
    # Coup 3 : grande taille verticale au-dessus de la tête
    t = h[2]
    out["Attack3"] = _sw(st, [
        {"t": t * 0.55, "ease": "out", "hips": (-6, -20, 0), "spine": (-6, 4, 0), "chest": (-8, 6, 0), "head": (4, 10, 0),
         "hips_off": (0.0, -0.05, -0.02), "footR.pitch": 20.0,
         "armR.up": az(-30, 75), "armR.fore": az(-150, 70), "armR.blade": az(175, 10), "armR.curl": 90.0,
         "armL.up": az(60, 30), "armL.fore": az(40, 50), "armL.hand": az(40, 60)},
        {"t": t, "ease": "in3", "hips": (16, -6, 0), "spine": (8, 2, 0), "chest": (8, 4, 0), "head": (-14, 4, 0),
         "hips_off": (0.0, 0.1, -0.16), "footL.p": (0.04, 0.42, 0.0), "footR.pitch": 30.0,
         "armR.up": az(-5, 15), "armR.fore": az(0, -10), "armR.blade": az(5, -30),
         "armL.up": down(1, -20, 40), "armL.fore": down(1, 0, 35)},
        {"t": t + 0.08, "ease": "out", "hips": (20, -4, 0), "chest": (10, 4, 0), "head": (-18, 4, 0), "hips_off": (0.0, 0.12, -0.19),
         "armR.up": az(-10, -20), "armR.fore": az(-5, -45), "armR.blade": az(-5, -70)},
        {"t": t + 0.18, "ease": "out", "hips": (18, -6, 0), "armR.blade": az(-10, -72)},
        {"t": t + 0.42, "ease": "io", **rec},
    ])
    # Coup 4 (Kael) : estoc plongeant enflammé
    t = h[3] if len(h) > 3 else 0.31
    out["Attack4"] = _sw(st, [
        {"t": t * 0.55, "ease": "out", "hips": (8, -55, 0), "spine": (2, -10, 0), "chest": (2, -12, 0), "head": (-4, 60, 0),
         "hips_off": (-0.02, -0.08, -0.16), "footR.pitch": 10.0,
         "armR.up": down(-1, -45, 30), "armR.fore": az(-30, -10), "armR.blade": az(-5, 2), "armR.curl": 90.0,
         "armL.up": az(60, 0), "armL.fore": az(10, 10), "armL.hand": az(0, 20), "armL.curl": 10.0},
        {"t": t, "ease": "in3", "hips": (14, 5, 0), "spine": (6, 2, 0), "chest": (8, 6, 0), "head": (-16, -10, 0),
         "hips_off": (0.0, 0.3, -0.2), "footL.p": (0.04, 0.72, 0.0), "footR.p": (0.1, -0.28, 0.0), "footR.pitch": 40.0,
         "armR.up": az(0, 6), "armR.fore": az(0, 4), "armR.blade": az(0, 2), "armR.hand": az(0, 40),
         "armL.up": az(155, -30), "armL.fore": az(165, -25), "armL.hand": az(170, -20)},
        {"t": t + 0.15, "ease": "out", "hips": (16, 6, 0), "hips_off": (0.0, 0.33, -0.22)},
        {"t": t + 0.56, "ease": "io", **rec},
    ])
    return out


def kael_skill(st):
    R = ready_pose(st)
    t = 0.5
    return _sw(st, [
        {"t": 0.24, "ease": "out", "hips": (14, -55, 0), "spine": (6, -8, 0), "chest": (6, -10, 0), "head": (-10, 55, 0),
         "hips_off": (-0.02, -0.06, -0.24), "footR.pitch": 15.0,
         "armR.up": az(-130, -40), "armR.fore": az(-160, -45), "armR.blade": az(-175, -35), "armR.curl": 95.0,
         "armL.up": az(45, -10), "armL.fore": az(20, 5), "armL.hand": az(10, 30), "armL.curl": 5.0},
        {"t": t, "ease": "in3", "hips": (-4, -5, 0), "spine": (-4, 2, 0), "chest": (-6, 4, 0), "head": (2, 0, 0),
         "hips_off": (0.0, 0.14, -0.04), "footL.p": (0.04, 0.42, 0.0), "footR.pitch": 35.0,
         "armR.up": az(-10, 45), "armR.fore": az(0, 60), "armR.blade": az(10, 70),
         "armL.up": down(1, -25, 45), "armL.fore": down(1, -5, 40)},
        {"t": t + 0.1, "ease": "out", "hips": (-8, 10, 0), "chest": (-8, 10, 0), "head": (4, -10, 0), "hips_off": (0.0, 0.16, 0.0),
         "armR.up": az(20, 70), "armR.fore": az(60, 95), "armR.blade": az(110, 80)},
        {"t": t + 0.25, "ease": "out", "armR.blade": az(125, 75)},
        {"t": 1.13, "ease": "io", **R},
    ])


def kael_burst(st):
    R = ready_pose(st)
    return _sw(st, [
        {"t": 0.32, "ease": "out", "hips": (-2, -10, 0), "spine": (-4, 4, 0), "chest": (-6, 6, 0), "head": (-6, 8, 0),
         "hips_off": (0.0, 0.0, -0.05), "footL.p": (0.12, 0.18, 0.0), "footR.p": (0.16, -0.14, 0.0), "footR.pitch": 0.0,
         "armR.up": az(-15, 82), "armR.fore": az(-10, 88), "armR.blade": az(0, 88), "armR.curl": 95.0,
         "armL.up": down(1, 60, 40), "armL.fore": az(-40, 10), "armL.hand": az(-20, 60), "armL.curl": 10.0},
        {"t": 0.62, "ease": "io", "head": (-10, 8, 0), "armR.blade": az(5, 90)},
        {"t": 0.84, "ease": "out", "hips": (8, -30, 0), "chest": (-10, -8, 0), "head": (-4, 30, 0), "hips_off": (0.0, -0.06, -0.14),
         "armR.up": az(-60, 80), "armR.fore": az(-170, 70), "armR.blade": az(175, 25),
         "armL.up": az(60, 10), "armL.fore": az(30, 20), "armL.hand": az(20, 40)},
        {"t": 1.0, "ease": "in3", "hips": (26, -2, 0), "spine": (10, 0, 0), "chest": (10, 2, 0), "head": (-26, 0, 0),
         "hips_off": (0.0, 0.2, -0.3), "footL.p": (0.1, 0.52, 0.0), "footR.p": (0.14, -0.32, 0.0), "footR.pitch": 35.0,
         "armR.up": az(-5, -10), "armR.fore": az(0, -40), "armR.blade": az(0, -62),
         "armL.up": az(130, -20), "armL.fore": az(150, -10), "armL.hand": az(160, 0)},
        {"t": 1.25, "ease": "out", "hips": (24, -2, 0), "hips_off": (0.0, 0.21, -0.31)},
        {"t": 1.73, "ease": "io", **R},
    ])


def lyra_skill(st):
    R = ready_pose(st)
    t = 0.39
    return _sw(st, [
        {"t": 0.2, "ease": "out", "hips": (-4, -6, 0), "spine": (-2, 0, 0), "chest": (-6, 0, 0), "head": (-4, 0, 0),
         "hips_off": (0.0, 0.0, 0.0), "footL.p": (0.08, 0.12, 0.0), "footR.p": (0.12, -0.08, 0.0), "footR.pitch": 30.0,
         "armR.up": az(-10, 70), "armR.fore": az(0, 85), "armR.blade": az(0, -85), "armR.hand": az(0, 90), "armR.curl": 95.0,
         "armL.ik": None, "armL.up": az(20, 60), "armL.fore": az(0, 80), "armL.hand": az(0, 90)},
        {"t": t, "ease": "in3", "hips": (24, 0, 0), "spine": (8, 0, 0), "chest": (8, 0, 0), "head": (-22, 0, 0),
         "hips_off": (0.0, 0.08, -0.34), "footL.p": (0.12, 0.3, 0.0), "footR.p": (0.16, -0.3, 0.0), "footR.pitch": 50.0,
         "armR.up": az(-5, -30), "armR.fore": az(0, -70), "armR.blade": az(0, -88), "armR.hand": az(0, -60),
         "armL.up": az(30, -45), "armL.fore": az(10, -75), "armL.hand": az(0, -70)},
        {"t": t + 0.25, "ease": "out", "hips_off": (0.0, 0.08, -0.32)},
        {"t": 1.13, "ease": "io", **R},
    ])


def lyra_burst(st):
    R = ready_pose(st)
    return _sw(st, [
        {"t": 0.35, "ease": "out", "hips": (-8, -5, 0), "spine": (-6, 0, 0), "chest": (-8, 0, 0), "head": (-18, 0, 0),
         "hips_off": (0.0, 0.0, 0.0), "footL.p": (0.06, 0.1, 0.0), "footR.p": (0.08, -0.08, 0.0), "footR.pitch": 25.0,
         "armR.up": az(-5, 85), "armR.fore": az(0, 89), "armR.blade": az(0, 89), "armR.curl": 95.0,
         "armL.up": az(80, 20), "armL.fore": az(100, 30), "armL.hand": az(100, 50), "armL.curl": 5.0},
        {"t": 0.7, "ease": "io", "head": (-24, 0, 0), "chest": (-10, 0, 0), "armR.blade": az(10, 89)},
        {"t": 0.95, "ease": "in3", "hips": (12, -18, 0), "spine": (4, 0, 0), "chest": (6, 6, 0), "head": (-8, 12, 0),
         "hips_off": (0.0, 0.1, -0.16), "footL.p": (0.06, 0.38, 0.0), "footR.p": (0.1, -0.28, 0.0), "footR.pitch": 30.0,
         "armR.up": az(-10, 8), "armR.fore": az(0, 4), "armR.blade": az(5, 6),
         "armL.up": az(120, -20), "armL.fore": az(140, -10), "armL.hand": az(150, 0)},
        {"t": 1.25, "ease": "out", "hips_off": (0.0, 0.11, -0.17)},
        {"t": 1.73, "ease": "io", **R},
    ])


# ----------------------------------------------------------------------------
# Bâton (Zahara)
# ----------------------------------------------------------------------------
def staff_attacks(st, hits):
    R = ready_pose(st)
    rec = dict(R)
    out = {}
    t = hits[0]
    out["Attack1"] = _sw(st, [
        {"t": t * 0.55, "ease": "out", "hips": (6, -55, 0), "spine": (2, -12, 0), "chest": (0, -14, 0), "head": (-2, 55, 0),
         "hips_off": (-0.04, -0.05, -0.1),
         "armR.up": az(-110, -15), "armR.fore": az(-150, -5), "armR.blade": az(-150, 15)},
        {"t": t, "ease": "in", "hips": (10, -8, 0), "spine": (4, 0, 0), "chest": (4, 0, 0), "head": (-6, 8, 0),
         "hips_off": (0.0, 0.07, -0.13), "footL.p": (0.06, 0.38, 0.0),
         "armR.up": az(-40, -10), "armR.fore": az(-10, -5), "armR.blade": az(25, 5)},
        {"t": t + 0.1, "ease": "out", "hips": (12, 28, 0), "spine": (4, 10, 0), "chest": (4, 18, 0), "head": (-6, -40, 0),
         "hips_off": (0.03, 0.08, -0.14),
         "armR.up": az(30, -15), "armR.fore": az(70, -15), "armR.blade": az(110, -5)},
        {"t": t + 0.2, "ease": "out", "armR.blade": az(118, -8)},
        {"t": t + 0.44, "ease": "io", **rec},
    ])
    t = hits[1]
    out["Attack2"] = _sw(st, [
        {"t": t * 0.5, "ease": "out", "hips": (10, 30, 0), "spine": (4, 10, 0), "chest": (4, 18, 0), "head": (-6, -40, 0),
         "hips_off": (0.03, 0.0, -0.12),
         "armR.up": az(35, -20), "armR.fore": az(80, -20), "armR.blade": az(140, 0)},
        {"t": t, "ease": "in", "hips": (10, -10, 0), "spine": (4, -4, 0), "chest": (2, -6, 0), "head": (-4, 12, 0),
         "hips_off": (-0.01, 0.07, -0.12), "footL.p": (0.06, 0.38, 0.0),
         "armR.up": az(-15, -5), "armR.fore": az(-20, 5), "armR.blade": az(-20, 15)},
        {"t": t + 0.1, "ease": "out", "hips": (8, -45, 0), "spine": (2, -10, 0), "chest": (0, -16, 0), "head": (-2, 45, 0),
         "hips_off": (-0.04, 0.05, -0.1),
         "armR.up": az(-85, 10), "armR.fore": az(-115, 25), "armR.blade": az(-135, 35)},
        {"t": t + 0.2, "ease": "out", "armR.blade": az(-140, 38)},
        {"t": t + 0.44, "ease": "io", **rec},
    ])
    t = hits[2]
    out["Attack3"] = _sw(st, [
        {"t": t * 0.6, "ease": "out", "hips": (-8, -15, 0), "spine": (-6, 4, 0), "chest": (-8, 6, 0), "head": (6, 6, 0),
         "hips_off": (0.0, -0.04, -0.01), "footR.pitch": 25.0,
         "armR.up": az(-20, 80), "armR.fore": az(-160, 75), "armR.blade": az(170, 30)},
        {"t": t, "ease": "in3", "hips": (22, -4, 0), "spine": (8, 2, 0), "chest": (8, 2, 0), "head": (-20, 2, 0),
         "hips_off": (0.0, 0.12, -0.24), "footL.p": (0.08, 0.48, 0.0), "footR.pitch": 35.0,
         "armR.up": az(-5, 0), "armR.fore": az(0, -15), "armR.blade": az(0, -30)},
        {"t": t + 0.1, "ease": "out", "hips": (24, -4, 0), "hips_off": (0.0, 0.13, -0.27), "armR.blade": az(0, -34)},
        {"t": t + 0.3, "ease": "linear", "hips_off": (0.0, 0.12, -0.25)},
        {"t": t + 0.56, "ease": "io", **rec},
    ])
    return out


def zahara_skill(st):
    R = ready_pose(st)
    t = 0.68
    return _sw(st, [
        {"t": 0.3, "ease": "out", "hips": (-6, -20, 0), "spine": (-4, 4, 0), "chest": (-6, 6, 0), "head": (-2, 10, 0),
         "hips_off": (0.0, -0.02, -0.02), "footR.pitch": 20.0,
         "armR.up": az(-20, 60), "armR.fore": az(-10, 85), "armR.blade": az(0, 88)},
        {"t": 0.5, "ease": "io", "hips_off": (0.0, -0.02, 0.0), "armR.blade": az(150, 80)},
        {"t": t, "ease": "in3", "hips": (26, -2, 0), "spine": (8, 0, 0), "chest": (6, 0, 0), "head": (-22, 0, 0),
         "hips_off": (0.0, 0.1, -0.3), "footL.p": (0.1, 0.46, 0.0), "footR.p": (0.14, -0.3, 0.0), "footR.pitch": 40.0,
         "armR.up": az(-5, -20), "armR.fore": az(0, -40), "armR.blade": az(0, -55)},
        {"t": t + 0.25, "ease": "out", "hips_off": (0.0, 0.11, -0.32)},
        {"t": 1.36, "ease": "io", **R},
    ])


def zahara_burst(st):
    R = ready_pose(st)
    return _sw(st, [
        {"t": 0.3, "ease": "out", "hips": (18, -10, 0), "spine": (6, 0, 0), "chest": (6, 2, 0), "head": (-14, 6, 0),
         "hips_off": (0.0, 0.0, -0.26), "footL.p": (0.08, 0.12, 0.0), "footR.p": (0.12, -0.1, 0.0), "footR.pitch": 10.0,
         "armR.up": az(-40, -20), "armR.fore": az(-60, 10), "armR.blade": az(-30, 40)},
        {"t": 0.6, "ease": "out", "hips": (-10, 0, 0), "spine": (-6, 0, 0), "chest": (-8, 0, 0), "head": (-10, 0, 0),
         "hips_off": (0.0, 0.0, 0.32), "footL.p": (0.06, 0.2, 0.42), "footL.pitch": 30.0, "footR.p": (0.08, -0.05, 0.3), "footR.pitch": 45.0,
         "armR.up": az(-10, 80), "armR.fore": az(0, 88), "armR.blade": az(0, -80), "armR.hand": az(0, 90)},
        {"t": 0.97, "ease": "in3", "hips": (28, 0, 0), "spine": (10, 0, 0), "chest": (8, 0, 0), "head": (-24, 0, 0),
         "hips_off": (0.0, 0.12, -0.36), "footL.p": (0.12, 0.4, 0.0), "footL.pitch": 0.0, "footR.p": (0.16, -0.32, 0.0), "footR.pitch": 45.0,
         "armR.up": az(-5, -35), "armR.fore": az(0, -60), "armR.blade": az(0, -85), "armR.hand": az(0, -40)},
        {"t": 1.3, "ease": "out", "hips_off": (0.0, 0.12, -0.36)},
        {"t": 1.73, "ease": "io", **R},
    ])


# ----------------------------------------------------------------------------
# Catalyseur (Kaelith) : gestes de magie
# ----------------------------------------------------------------------------
def catalyst_attacks(st, hits):
    R = ready_pose(st)
    rec = dict(R)
    out = {}
    t = hits[0]
    out["Attack1"] = _sw(st, [
        {"t": t * 0.55, "ease": "out", "hips": (2, -26, 0), "chest": (-2, -14, 0), "head": (0, 30, 0),
         "armR.up": az(-80, -20), "armR.fore": az(-100, 20), "armR.hand": az(-60, 60)},
        {"t": t, "ease": "in", "hips": (6, -4, 0), "chest": (4, 4, 0), "head": (-4, 0, 0), "hips_off": (0.0, 0.04, -0.07),
         "armR.up": az(-12, 5), "armR.fore": az(-2, 8), "armR.hand": az(0, 75), "armR.curl": 5.0},
        {"t": t + 0.12, "ease": "out", "armR.fore": az(0, 6), "armR.hand": az(0, 70)},
        {"t": t + 0.3, "ease": "io", **rec},
    ])
    t = hits[1]
    out["Attack2"] = _sw(st, [
        {"t": t * 0.55, "ease": "out", "hips": (2, 20, 0), "chest": (-2, 16, 0), "head": (0, -25, 0),
         "armL.up": az(60, -10), "armL.fore": az(120, 10), "armL.hand": az(140, 40), "armL.curl": 10.0},
        {"t": t, "ease": "in", "hips": (6, -10, 0), "chest": (4, -10, 0), "head": (-4, 10, 0), "hips_off": (0.0, 0.04, -0.07),
         "armL.up": az(15, 5), "armL.fore": az(-5, 10), "armL.hand": az(-20, 60), "armL.curl": 5.0},
        {"t": t + 0.12, "ease": "out", "armL.fore": az(-15, 8)},
        {"t": t + 0.3, "ease": "io", **rec},
    ])
    t = hits[2]
    out["Attack3"] = _sw(st, [
        {"t": t * 0.6, "ease": "out", "hips": (-4, -6, 0), "chest": (-8, 0, 0), "head": (-2, 0, 0), "hips_off": (0.0, -0.04, -0.03),
         "armR.up": az(-70, 20), "armR.fore": az(-30, 60), "armR.hand": az(0, 80),
         "armL.up": az(70, 20), "armL.fore": az(30, 60), "armL.hand": az(0, 80), "armL.curl": 5.0, "armR.curl": 5.0},
        {"t": t, "ease": "in3", "hips": (10, 0, 0), "chest": (8, 0, 0), "head": (-10, 0, 0), "hips_off": (0.0, 0.08, -0.12),
         "footL.p": (0.04, 0.34, 0.0),
         "armR.up": az(-14, 4), "armR.fore": az(-4, 6), "armR.hand": az(0, 75),
         "armL.up": az(14, 4), "armL.fore": az(4, 6), "armL.hand": az(0, 75)},
        {"t": t + 0.16, "ease": "out", "hips_off": (0.0, 0.09, -0.13)},
        {"t": t + 0.42, "ease": "io", **rec},
    ])
    return out


def kaelith_skill(st):
    R = ready_pose(st)
    t = 0.455
    return _sw(st, [
        {"t": 0.2, "ease": "out", "hips": (-2, -20, 0), "chest": (-6, -10, 0), "head": (-6, 20, 0),
         "armR.up": az(-60, 60), "armR.fore": az(-30, 85), "armR.hand": az(0, 89), "armR.curl": 5.0,
         "armL.up": down(1, 40, 50), "armL.fore": az(60, 10), "armL.hand": az(60, 40)},
        {"t": 0.34, "ease": "io", "armR.fore": az(30, 80), "armR.hand": az(60, 85)},
        {"t": t, "ease": "in3", "hips": (12, -4, 0), "chest": (8, 2, 0), "head": (-12, 0, 0), "hips_off": (0.0, 0.08, -0.14),
         "footL.p": (0.04, 0.38, 0.0),
         "armR.up": az(-10, 20), "armR.fore": az(0, 10), "armR.hand": az(0, -20),
         "armL.up": down(1, -10, 40), "armL.fore": down(1, 20, 40)},
        {"t": t + 0.2, "ease": "out", "hips_off": (0.0, 0.09, -0.15)},
        {"t": 1.13, "ease": "io", **R},
    ])


def kaelith_burst(st):
    R = ready_pose(st)
    return _sw(st, [
        {"t": 0.25, "ease": "out", "hips": (6, 0, 0), "hips_off": (0.0, 0.0, -0.14), "chest": (6, 0, 0), "head": (-6, 0, 0),
         "armR.up": az(-40, -30), "armR.fore": az(-10, 10), "armR.hand": az(30, 50),
         "armL.up": az(40, -30), "armL.fore": az(10, 10), "armL.hand": az(-30, 50), "armL.curl": 10.0, "armR.curl": 10.0},
        {"t": 0.55, "ease": "io", "spin": 180.0, "hips": (-4, 0, 0), "hips_off": (0.0, 0.0, -0.02), "chest": (-4, 0, 0),
         "armR.up": az(-90, 10), "armR.fore": az(-90, 15), "armR.hand": az(-90, 30),
         "armL.up": az(90, 10), "armL.fore": az(90, 15), "armL.hand": az(90, 30)},
        {"t": 0.8, "ease": "io", "spin": 360.0, "hips": (-8, 0, 0), "chest": (-10, 0, 0), "head": (-16, 0, 0), "hips_off": (0.0, 0.0, 0.02),
         "armR.up": az(-40, 75), "armR.fore": az(-20, 85), "armR.hand": az(0, 89),
         "armL.up": az(40, 75), "armL.fore": az(20, 85), "armL.hand": az(0, 89)},
        {"t": 0.95, "ease": "in3", "spin": 360.0, "hips": (8, 0, 0), "chest": (6, 0, 0), "head": (-6, 0, 0), "hips_off": (0.0, 0.04, -0.16),
         "armR.up": az(-75, 10), "armR.fore": az(-85, 0), "armR.hand": az(-80, 40),
         "armL.up": az(75, 10), "armL.fore": az(85, 0), "armL.hand": az(80, 40)},
        {"t": 1.3, "ease": "out", "hips_off": (0.0, 0.04, -0.15)},
        {"t": 1.73, "ease": "io", **R, "spin": 360.0},
    ])


# ----------------------------------------------------------------------------
# Escalade et nage
# ----------------------------------------------------------------------------
def _cyc_dir(pts, phase):
    """Interpolation cyclique (Catmull-Rom) d'une suite de directions, puis normalisation."""
    n = len(pts)
    x = (phase % 1.0) * n
    i = int(x) % n
    u = x - int(x)
    p0, p1, p2, p3 = pts[(i - 1) % n], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
    out = []
    for c in range(3):
        a, b, cc, d = p0[c], p1[c], p2[c], p3[c]
        out.append(0.5 * ((2 * b) + (-a + cc) * u + (2 * a - 5 * b + 4 * cc - d) * u * u + (-a + 3 * b - 3 * cc + d) * u ** 3))
    return nz(tuple(out))


def climb(phase, st, idle_k=0.0):
    """Escalade : le mur est devant (≈ 0.4 longueur de jambe). Bras et jambes en diagonale."""
    k = 1.0 - idle_k
    c = cyc(phase) * k
    sR = c          # bras droit haut quand c = 1
    sL = -c
    ch = {
        "armframe": "root",
        "hips_off": (0.0, 0.02, -0.1 + 0.035 * syc(phase, 2) * k), "hips": (8.0, 4.0 * c, 4.0 * c),
        "spine": (3.0, -3.0 * c, 0.0), "chest": (3.0, -3.0 * c, -2.0 * c), "neck": (-10.0, 0.0, 0.0), "head": (-16.0, 8.0 * c, 0.0),
        "shL": (0, 0, 6.0 * max(0.0, sL)), "shR": (0, 0, -6.0 * max(0.0, sR)),
        "footL.p": (0.06, 0.26, 0.26 + 0.17 * (-c) + 0.05 * idle_k), "footL.pitch": 25.0, "footL.yaw": 6.0, "footL.pivot": "ankle", "footL.toe": 12.0,
        "footR.p": (0.06, 0.26, 0.26 + 0.17 * c - 0.05 * idle_k), "footR.pitch": 25.0, "footR.yaw": 6.0, "footR.pivot": "ankle", "footR.toe": 12.0,
    }
    for s, sg in (("R", sR), ("L", sL)):
        side = 1 if s == "L" else -1
        el = 48.0 + 26.0 * sg + (8.0 if (s == "R") else -6.0) * idle_k
        ch["arm%s.up" % s] = az(side * 22.0, el)
        ch["arm%s.fore" % s] = az(side * 8.0, min(el + 28.0, 89.0))
        ch["arm%s.hand" % s] = az(0.0, 88.0)
        ch["arm%s.curl" % s] = 55.0
    return ch


def climb_idle(phase, st):
    ch = climb(0.0, st, idle_k=1.0)
    b = syc(phase)
    hl, hf, hu = ch["hips_off"]
    ch["hips_off"] = (hl, hf, hu + 0.008 * b)
    ch["head"] = (-14.0 + 2.0 * b, 18.0 * syc(phase, 1, 0.3), 0.0)
    return ch


def swim(phase, st):
    """Crawl : corps à l'horizontale, bras en moulinet, battements de jambes."""
    roll = 16.0 * syc(phase)
    # trajectoire d'un bras (repère du personnage) : entrée devant, traction sous le corps, poussée, retour aérien
    stroke_up = [az(-8, 4), down(-1, 55, 6), down(-1, -40, 16), az(-70, 48)]
    stroke_fore = [az(-4, 0), down(-1, 20, 2), down(-1, -70, 10), az(-25, 8)]
    ch = {
        "armframe": "root",
        "hips_off": (0.0, 0.0, -0.12), "hips": (72.0, 0.0, roll),
        "spine": (4.0, 0.0, 0.0), "chest": (4.0, 0.0, roll * 0.3), "neck": (-28.0, 0.0, 0.0),
        "head": (-34.0, -8.0 * syc(phase), -roll * 0.6),
        "shL": (0, 0, 0), "shR": (0, 0, 0),
    }
    for s, off in (("R", 0.0), ("L", 0.5)):
        # trajectoires définies pour le bras droit ; miroir gauche/droite pour l'autre bras
        up = stroke_up if s == "R" else [(-v[0], v[1], v[2]) for v in stroke_up]
        fo = stroke_fore if s == "R" else [(-v[0], v[1], v[2]) for v in stroke_fore]
        ph = phase + off
        ch["arm%s.up" % s] = _cyc_dir(up, ph)
        ch["arm%s.fore" % s] = _cyc_dir(fo, ph)
        ch["arm%s.curl" % s] = 12.0
    for s, off in (("L", 0.0), ("R", 0.5)):
        kick = syc(phase * 3.0 + off)
        ch["foot%s.p" % s] = (0.03, -0.92, 0.74 + 0.08 * kick)
        ch["foot%s.pitch" % s] = 135.0
        ch["foot%s.toe" % s] = 140.0
        ch["foot%s.yaw" % s] = 0.0
        ch["foot%s.pivot" % s] = "ankle"
    return ch


def swim_idle(phase, st):
    """Nage sur place : bras qui godillent, jambes en « batteur »."""
    b = syc(phase)
    ch = {
        "armframe": "root",
        "hips_off": (0.0, 0.0, -0.04 + 0.02 * b), "hips": (10.0, 0.0, 0.0), "spine": (2.0, 0.0, 0.0), "chest": (-2.0, 0.0, 0.0),
        "neck": (-4.0, 0.0, 0.0), "head": (-6.0, 10.0 * syc(phase, 1, 0.3), 0.0), "shL": (0, 0, 0), "shR": (0, 0, 0),
    }
    for s in ("L", "R"):
        side = 1 if s == "L" else -1
        ch["arm%s.up" % s] = down(side, 28.0 + 6.0 * b, 58.0 + 10.0 * b)
        ch["arm%s.fore" % s] = down(side, 62.0 + 8.0 * b, 70.0 - 10.0 * b)
        ch["arm%s.curl" % s] = 10.0
    for s, off in (("L", 0.0), ("R", 0.5)):
        side = 1 if s == "L" else -1
        a = TAU * (phase + off)
        ch["foot%s.p" % s] = (0.07 + 0.05 * math.cos(a), 0.06 * math.sin(a), 0.2 + 0.08 * math.sin(a))
        ch["foot%s.pitch" % s] = 40.0
        ch["foot%s.toe" % s] = 40.0
        ch["foot%s.yaw" % s] = 10.0
        ch["foot%s.pivot" % s] = "ankle"
    return ch


# ----------------------------------------------------------------------------
# Gestes de cinématique : parler, saluer, victoire
# ----------------------------------------------------------------------------
def talk(phase, st):
    """Conversation : la main droite accompagne la parole, petits hochements de tête."""
    ch = idle(phase, st)
    g = syc(phase, 2.0)
    g2 = syc(phase, 1.0, 0.25)
    ch["head"] = (2.0 + 4.0 * syc(phase, 3.0), 10.0 * g2, 2.0 * g)
    ch["chest"] = (-1.0, 5.0 * g2, 0.5)
    ch["armR.up"] = down(-1, 22.0 + 8.0 * g, 16.0)
    ch["armR.fore"] = az(-30.0 + 18.0 * g2, 8.0 + 14.0 * g)
    ch["armR.hand"] = az(-15.0, 25.0 + 10.0 * g)
    ch["armR.curl"] = 14.0
    ch["armL.up"] = down(1, 10.0 + 4.0 * g2, 12.0)
    ch["armL.fore"] = down(1, 38.0 + 6.0 * g2, 4.0)
    return ch


def wave(phase, st):
    """Salut de la main droite levée."""
    ch = idle(phase, st)
    w = syc(phase, 2.0)
    ch["armframe"] = "root"
    ch["armR.up"] = az(-62.0, 50.0)
    ch["armR.fore"] = az(-35.0 + 30.0 * w, 80.0)
    ch["armR.hand"] = az(-30.0 + 35.0 * w, 84.0)
    ch["armR.curl"] = 4.0
    ch["head"] = (-3.0, -8.0, -5.0 + 2.0 * w)
    ch["chest"] = (-2.0, -4.0, -3.0)
    return ch


def victory(phase, st):
    """Pose de victoire : poing levé, léger rebond."""
    ch = idle(phase, st)
    b = syc(phase, 2.0)
    ch["armframe"] = "root"
    ch["hips_off"] = (0.0, 0.0, -0.02 + 0.015 * b)
    ch["chest"] = (-6.0, 6.0, -2.0)
    ch["head"] = (-8.0, 6.0, -4.0)
    ch["armR.up"] = az(-28.0, 68.0 + 4.0 * b)
    ch["armR.fore"] = az(-12.0, 86.0)
    ch["armR.hand"] = az(-10.0, 88.0)
    ch["armR.curl"] = 92.0
    ch["armL.up"] = down(1, -12.0, 42.0)
    ch["armL.fore"] = az(150.0, -35.0)
    ch["armL.curl"] = 60.0
    return ch


# ----------------------------------------------------------------------------
# Assemblage par personnage
# ----------------------------------------------------------------------------
HITS = {
    "kael": [0.19, 0.19, 0.26, 0.31],
    "lyra": [0.16, 0.16, 0.2],
    "zahara": [0.38, 0.38, 0.44],
    "kaelith": [0.19, 0.19, 0.22],
}


def build(char, LL):
    """Retourne {nom: (durée, loop, fonction t -> canaux)}."""
    st = STYLES[char]
    anims = {}

    def cyclic(name, length, fn):
        anims[name] = (length, True, lambda t, L=length: fn((t / L) % 1.0, st))

    def track(name, tr):
        anims[name] = (tr.length, False, tr.sample)

    for k in ("Walk", "Run", "Sprint"):
        cyclic(k, cycle_length(k, LL), lambda p, s, k=k: gait(p, s, k))
    cyclic("Idle", 3.2, idle)
    cyclic("Idle_Combat", 2.0, idle_combat)
    cyclic("Fall", 1.0, fall)
    cyclic("Glide", 2.0, glide)
    cyclic("Climb", 1.0, climb)
    cyclic("Climb_Idle", 2.4, climb_idle)
    cyclic("Swim", 1.3, swim)
    cyclic("Swim_Idle", 1.8, swim_idle)
    cyclic("Talk", 3.0, talk)
    cyclic("Wave", 1.4, wave)
    cyclic("Victory", 2.0, victory)
    track("Jump", jump(st))
    track("Land", land(st))
    track("Dash", dash(st))
    track("Hit", hit(st))
    w = st["weapon"]
    if w == "sword":
        atk = sword_attacks(st, HITS[char])
        n = 4 if char == "kael" else 3
        for i in range(1, n + 1):
            track("Attack%d" % i, atk["Attack%d" % i])
    elif w == "staff":
        for k, v in staff_attacks(st, HITS[char]).items():
            track(k, v)
    else:
        for k, v in catalyst_attacks(st, HITS[char]).items():
            track(k, v)
    track("Skill", {"kael": kael_skill, "lyra": lyra_skill, "zahara": zahara_skill, "kaelith": kaelith_skill}[char](st))
    track("Burst", {"kael": kael_burst, "lyra": lyra_burst, "zahara": zahara_burst, "kaelith": kaelith_burst}[char](st))
    return anims
