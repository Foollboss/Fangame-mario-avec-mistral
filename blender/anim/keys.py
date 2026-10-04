"""Clés d'animation : poses partielles, interpolation Catmull-Rom + easing."""
import math
from mathutils import Vector
from .rig import V, E


def nz(t):
    l = math.sqrt(sum(c * c for c in t)) or 1.0
    return tuple(c / l for c in t)


def az(azim, elev=0.0):
    """Direction (repère corps) : azimut 0 = devant, +90 = à gauche, -90 = à droite, 180 = derrière ;
    élévation + vers le haut."""
    a = math.radians(azim)
    e = math.radians(elev)
    return (math.sin(a) * math.cos(e), math.cos(a) * math.cos(e), math.sin(e))


def down(side, fwd=0.0, out=12.0):
    """Membre pendant, levé de fwd degrés vers l'avant et écarté de out degrés. side +1 = gauche."""
    f = math.radians(fwd)
    o = math.radians(out)
    return (side * math.sin(o), math.sin(f) * math.cos(o), -math.cos(f) * math.cos(o))


EASES = {
    "linear": lambda s: s,
    "in": lambda s: s * s,
    "in3": lambda s: s * s * s,
    "out": lambda s: 1 - (1 - s) * (1 - s),
    "out3": lambda s: 1 - (1 - s) ** 3,
    "io": lambda s: s * s * (3 - 2 * s),
    "snap": lambda s: 1 - (1 - s) ** 4,
    "hold": lambda s: 0.0,
}


def _catmull(p0, p1, p2, p3, s):
    s2 = s * s
    s3 = s2 * s
    return 0.5 * ((2 * p1) + (-p0 + p2) * s + (2 * p0 - 5 * p1 + 4 * p2 - p3) * s2 + (-p0 + 3 * p1 - 3 * p2 + p3) * s3)


def _mix(a, b, c, d, s, smooth):
    if b is None or c is None or isinstance(b, str) or (isinstance(b, tuple) and any(isinstance(x, str) for x in b)):
        return b if s < 0.5 else c
    if isinstance(b, (int, float)):
        return _catmull(a, b, c, d, s) if smooth else b + (c - b) * s
    return tuple(_catmull(a[i], b[i], c[i], d[i], s) if smooth else b[i] + (c[i] - b[i]) * s for i in range(len(b)))


DEFAULTS = {"spin": 0.0}


class Track:
    """Suite de clés (t, dict de canaux, ease). Les canaux absents héritent de la clé précédente."""

    def __init__(self, base, keys, smooth=True):
        self.keys = []
        cur = dict(base)
        for k in keys:
            t = k["t"]
            ease = k.get("ease", "io")
            cur = dict(cur)
            for ch, v in k.items():
                if ch in ("t", "ease"):
                    continue
                cur[ch] = v
            self.keys.append((t, ease, cur))
        # un canal qui apparaît en cours de route part de sa valeur par défaut
        names = set()
        for _, _, k in self.keys:
            names.update(k.keys())
        for n in names:
            first = next(k[n] for _, _, k in self.keys if n in k)
            for _, _, k in self.keys:
                if n in k:
                    break
                k[n] = DEFAULTS.get(n, first)
        self.smooth = smooth
        self.length = self.keys[-1][0]

    def sample(self, t):
        ks = self.keys
        if t <= ks[0][0]:
            return dict(ks[0][2])
        if t >= ks[-1][0]:
            return dict(ks[-1][2])
        i = 0
        while i < len(ks) - 2 and t > ks[i + 1][0]:
            i += 1
        t0, _, a = ks[i]
        t1, ease, b = ks[i + 1]
        s = (t - t0) / max(t1 - t0, 1e-6)
        s = EASES[ease](s)
        pa = ks[i - 1][2] if i > 0 else a
        pd = ks[i + 2][2] if i + 2 < len(ks) else b
        out = {}
        for ch in b:
            vb = a.get(ch, b[ch])
            out[ch] = _mix(pa.get(ch, vb), vb, b[ch], pd.get(ch, b[ch]), s, self.smooth and ease not in ("hold",))
        return out


def blend(a, b, w):
    out = dict(a)
    for ch, vb in b.items():
        va = a.get(ch, vb)
        out[ch] = _mix(va, va, vb, vb, w, False)
    return out


def build_pose(rig, ch):
    """Canaux -> dict attendu par Rig.solve (vecteurs/quaternions en espace armature)."""
    LL = rig.LL
    P = {}
    spin = ch.get("spin", 0.0)
    Q = E(turn=spin)
    hl, hf, hu = ch.get("hips_off", (0, 0, 0))
    P["hips_off"] = Q @ V(hl * LL, hf * LL, hu * LL)
    for n in ("hips", "spine", "chest", "neck", "head"):
        P[n] = E(*ch.get(n, (0, 0, 0)))
    P["hips"] = Q @ P["hips"]
    # cou et tête : on cumule pour ne pas avoir à tout respécifier
    P["spine"] = P["hips"] @ P["spine"] if ch.get("spine_rel", True) else P["spine"]
    P["chest"] = P["spine"] @ P["chest"]
    P["neck"] = P["chest"] @ P["neck"]
    P["head"] = P["neck"] @ P["head"]
    # repère des bras : la poitrine (locomotion) ou le personnage entier (gestes de combat)
    P["armframe"] = Q if ch.get("armframe", "chest") == "root" else P["chest"]
    for s in ("L", "R"):
        side = 1 if s == "L" else -1
        P["sh" + s] = E(*ch.get("sh" + s, (0, 0, 0)))
        arm = {}
        arm["up"] = V(*ch.get("arm%s.up" % s, down(side, 0, 14)))
        arm["fore"] = V(*ch.get("arm%s.fore" % s, down(side, 12, 10)))
        if ("arm%s.blade" % s) in ch:
            arm["blade"] = V(*ch["arm%s.blade" % s])
        if ("arm%s.hand" % s) in ch:
            arm["hand"] = V(*ch["arm%s.hand" % s])
        if ch.get("arm%s.ik" % s):
            arm["ik"] = ch["arm%s.ik" % s]
        arm["curl"] = ch.get("arm%s.curl" % s, 25.0)
        for tw in ("up_twist", "fore_twist", "hand_twist"):
            if ("arm%s.%s" % (s, tw)) in ch:
                arm[tw] = ch["arm%s.%s" % (s, tw)]
        P["arm" + s] = arm
        # pieds : p = (écart vers l'extérieur, avant, hauteur) en unités de jambe
        leg = rig.leg[s]
        th = rig.head["thigh." + s]
        neutral = Vector((th.x, rig.head["hips"].y, leg["ankle"].z))
        fo, ff, fu = ch.get("foot%s.p" % s, (0.0, 0.0, 0.0))
        p = Q @ (neutral + V(side * fo * LL, ff * LL, fu * LL))
        P["foot" + s] = {
            "p": p,
            "pitch": ch.get("foot%s.pitch" % s, 0.0),
            "yaw": ch.get("foot%s.yaw" % s, 0.0) * side + spin,
            "pivot": ch.get("foot%s.pivot" % s, "auto"),
        }
        if P["foot" + s]["pivot"] == "auto":
            P["foot" + s]["pivot"] = "ball" if P["foot" + s]["pitch"] > 0 else "heel"
        if ("foot%s.toe" % s) in ch:
            P["foot" + s]["toe"] = ch["foot%s.toe" % s]
    return P
