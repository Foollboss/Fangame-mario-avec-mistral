"""Décors d'Aetheria façon « Mondstadt » : maisons à colombages, arbres en touffes, rochers,
téléporteur, statue, lanternes, puits, étal, moulin...

Usage : blender -b -P blender/build_props.py
Sortie : game/assets/props_genshin.glb (les nœuds remplacent ceux de props.glb du même nom).
Convention : l'avant des objets regarde vers -Y (Blender) = +Z dans Godot.
"""
import bpy, sys, os, math, random
from mathutils import Vector

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from props.kit import Builder, material  # noqa: E402

OUT = os.path.normpath(os.path.join(HERE, "..", "game", "assets", "props_genshin.glb"))


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)


def M():
    """Palette de matériaux (noms = ceux attendus par world.gd)."""
    return {
        "plaster": material("plaster", (0.95, 0.91, 0.82), "plaster"),
        "timber": material("timber", (0.42, 0.27, 0.17), "wood"),
        "tint_roof": material("tint_roof", (1.0, 1.0, 1.0), "tiles"),
        "footing": material("footing", (0.78, 0.76, 0.72), "stone"),
        "window_lit": material("window_lit", (0.32, 0.42, 0.55), emit=(1.0, 0.75, 0.4), emit_strength=1.0, rough=0.2),
        "door": material("door", (0.36, 0.22, 0.14), "wood"),
        "flower_red": material("flower_red", (0.92, 0.3, 0.32)),
        "leafg": material("leafg", (0.35, 0.62, 0.3)),
        "bark": material("bark", (0.52, 0.38, 0.27), "bark"),
        "tint_leaves": material("tint_leaves", (1.0, 1.0, 1.0), "leaves"),
        "tint_needles": material("tint_needles", (1.0, 1.0, 1.0), "leaves"),
        "apple": material("apple", (0.86, 0.16, 0.14), rough=0.4),
        "tint_rock": material("tint_rock", (1.0, 1.0, 1.0), "rock"),
        "rock": material("rock", (0.66, 0.65, 0.62), "rock"),
        "tint_moss": material("tint_moss", (1.0, 1.0, 1.0)),
        "tint_bush": material("tint_bush", (1.0, 1.0, 1.0)),
        "tint_petal": material("tint_petal", (1.0, 1.0, 1.0)),
        "petal2": material("petal2", (1.0, 0.86, 0.3)),
        "stem": material("stem", (0.3, 0.55, 0.25)),
        "wp_stone": material("wp_stone", (0.86, 0.84, 0.8), "stone"),
        "wp_dark": material("wp_dark", (0.2, 0.24, 0.34)),
        "gold": material("gold", (0.95, 0.76, 0.36), rough=0.35),
        "tint_wpcrystal": material("tint_wpcrystal", (1.0, 1.0, 1.0), rough=0.2),
        "marble": material("marble", (0.93, 0.92, 0.88), "plaster"),
        "aether": material("aether", (0.5, 0.85, 1.0), emit=(0.45, 0.85, 1.0), emit_strength=2.0, rough=0.2),
        "iron": material("iron", (0.18, 0.18, 0.22), rough=0.5),
        "lamp": material("lamp", (1.0, 0.86, 0.55), emit=(1.0, 0.75, 0.4), emit_strength=1.0, rough=0.2),
        "fence_wood": material("fence_wood", (0.62, 0.45, 0.3), "wood"),
        "wellstone": material("wellstone", (0.75, 0.73, 0.7), "stone"),
        "water_dark": material("water_dark", (0.12, 0.3, 0.4), rough=0.1),
        "tint_cloth": material("tint_cloth", (1.0, 1.0, 1.0)),
        "cloth_white": material("cloth_white", (0.96, 0.94, 0.88)),
        "orange": material("orange", (1.0, 0.6, 0.15), rough=0.5),
        "sail": material("sail", (0.95, 0.92, 0.84)),
        "oculus_core": material("oculus_core", (0.45, 1.0, 0.82), emit=(0.35, 1.0, 0.75), emit_strength=2.5, rough=0.2),
        "oculus_wing": material("oculus_wing", (0.75, 1.0, 0.92), emit=(0.55, 1.0, 0.85), emit_strength=1.2, rough=0.3),
        "mint": material("mint", (0.36, 0.76, 0.42)),
        "mint_dark": material("mint_dark", (0.22, 0.55, 0.3)),
        "mush_cap": material("mush_cap", (0.86, 0.24, 0.18)),
        "mush_stem": material("mush_stem", (0.95, 0.9, 0.78)),
        "lotus_pad": material("lotus_pad", (0.3, 0.6, 0.32)),
        "lotus_petal": material("lotus_petal", (1.0, 0.72, 0.84), emit=(1.0, 0.6, 0.8), emit_strength=0.15),
        "lotus_pod": material("lotus_pod", (0.62, 0.8, 0.45)),
        "chili": material("chili", (0.9, 0.18, 0.1), emit=(1.0, 0.35, 0.1), emit_strength=0.35, rough=0.4),
        "chili_leaf": material("chili_leaf", (0.25, 0.45, 0.2)),
        "lily": material("lily", (0.95, 0.92, 1.0), emit=(0.75, 0.8, 1.0), emit_strength=0.35),
        "lily_heart": material("lily_heart", (1.0, 0.85, 0.4), emit=(1.0, 0.8, 0.3), emit_strength=0.6),
        "fire": material("fire", (1.0, 0.42, 0.08), emit=(1.0, 0.35, 0.05), emit_strength=1.4, rough=0.5),
        "fire_core": material("fire_core", (1.0, 0.8, 0.3), emit=(1.0, 0.7, 0.2), emit_strength=1.8, rough=0.5),
        "soup": material("soup", (0.95, 0.6, 0.25), emit=(1.0, 0.55, 0.2), emit_strength=0.25, rough=0.3),
        "forge_glow": material("forge_glow", (1.0, 0.45, 0.12), emit=(1.0, 0.4, 0.1), emit_strength=3.5),
        "sign_wood": material("sign_wood", (0.68, 0.5, 0.32), "wood"),
        "forge_stone": material("forge_stone", (0.36, 0.32, 0.31), "stone"),
    }


# ----------------------------------------------------------------------------
# Maison de Mondstadt
# ----------------------------------------------------------------------------
def house(mt):
    b = Builder("House", [mt[k] for k in ("plaster", "timber", "tint_roof", "footing", "window_lit", "door", "flower_red", "leafg")])
    W, D = 5.0, 4.2          # rez-de-chaussée
    W2, D2 = 5.4, 4.6        # étage en encorbellement
    z0, z1, z2, z3 = 0.0, 0.7, 3.2, 5.6
    b.box("footing", (0, 0, 0.35), (W + 0.3, D + 0.3, 0.7), bevel=0.05)
    b.box("plaster", (0, 0, (z1 + z2) * 0.5), (W, D, z2 - z1))
    b.box("timber", (0, 0, z2 + 0.09), (W2 + 0.1, D2 + 0.1, 0.18))
    b.box("plaster", (0, 0, (z2 + 0.18 + z3) * 0.5), (W2, D2, z3 - z2 - 0.18))
    # colombages : poteaux verticaux et sablières
    for (w, d, za, zb) in ((W, D, z1, z2), (W2, D2, z2 + 0.18, z3)):
        for zz in (za + 0.08, zb - 0.08):
            b.box("timber", (0, -d * 0.5 - 0.03, zz), (w + 0.06, 0.08, 0.16))
            b.box("timber", (0, d * 0.5 + 0.03, zz), (w + 0.06, 0.08, 0.16))
            b.box("timber", (-w * 0.5 - 0.03, 0, zz), (0.08, d + 0.06, 0.16))
            b.box("timber", (w * 0.5 + 0.03, 0, zz), (0.08, d + 0.06, 0.16))
        for k in range(5):
            x = -w * 0.5 + w * k / 4
            for sy in (-1, 1):
                b.box("timber", (x, sy * (d * 0.5 + 0.03), (za + zb) * 0.5), (0.16, 0.08, zb - za))
        for k in range(4):
            y = -d * 0.5 + d * k / 3
            for sx in (-1, 1):
                b.box("timber", (sx * (w * 0.5 + 0.03), y, (za + zb) * 0.5), (0.08, 0.16, zb - za))
    # croisillons à l'étage (en X)
    hz = z3 - z2 - 0.18
    ang = math.atan2(hz - 0.3, W2 / 4)
    for k in (0, 3):
        x = -W2 * 0.5 + W2 * (k + 0.5) / 4
        for sy in (-1, 1):
            for s in (-1, 1):
                b.box("timber", (x, sy * (D2 * 0.5 + 0.035), z2 + 0.18 + hz * 0.5), (math.hypot(W2 / 4, hz - 0.3) - 0.1, 0.07, 0.12), rot=(0, s * ang, 0))
    # pignons + toit
    rise = 2.7
    b.gable("plaster", (0, 0, z3), W2 - 0.02, D2 - 0.02, rise)
    for sx in (-1, 1):
        b.box("timber", (sx * (W2 * 0.5 + 0.02), 0, z3 + 0.6), (0.08, 0.14, 1.2))
        b.box("timber", (sx * (W2 * 0.5 + 0.02), 0, z3 + 0.05), (0.08, D2, 0.14))
    b.roof("tint_roof", (0, 0, z3), W2, D2, rise, thick=0.16, overhang=0.45)
    b.box("timber", (0, 0, z3 + rise + 0.2), (W2 + 1.0, 0.24, 0.2))
    # cheminée
    b.box("footing", (1.5, 0.9, z3 + 1.8), (0.62, 0.62, 2.6), bevel=0.03)
    b.box("footing", (1.5, 0.9, z3 + 3.15), (0.78, 0.78, 0.16))
    # porte (façade avant = -Y)
    b.box("timber", (0, -D * 0.5 - 0.06, z1 + 1.12), (1.36, 0.12, 2.3))
    b.box("door", (0, -D * 0.5 - 0.1, z1 + 1.05), (1.06, 0.1, 2.08))
    b.box("iron" if False else "timber", (0.36, -D * 0.5 - 0.17, z1 + 1.05), (0.1, 0.06, 0.1))
    # auvent au-dessus de la porte
    b.roof("tint_roof", (0, -D * 0.5 - 0.55, z1 + 2.35), 1.5, 1.1, 0.35, thick=0.08, overhang=0.12)
    # marches
    b.box("footing", (0, -D * 0.5 - 0.45, 0.18), (1.6, 0.6, 0.36))
    # fenêtres
    def window(x, y, z, face, w=0.8, h=1.0, box=True):
        n = Vector(face)
        if abs(n.y) > 0.5:
            off = (x, y + n.y * 0.04, z)
            b.box("timber", off, (w + 0.2, 0.1, h + 0.2))
            b.box("window_lit", (x, y + n.y * 0.09, z), (w, 0.04, h))
            b.box("timber", (x, y + n.y * 0.11, z), (0.06, 0.04, h))
            b.box("timber", (x, y + n.y * 0.11, z), (w, 0.04, 0.06))
            for sx in (-1, 1):
                b.box("door", (x + sx * (w * 0.5 + 0.26), y + n.y * 0.07, z), (0.36, 0.05, h + 0.06))
            if box:
                b.box("timber", (x, y + n.y * 0.22, z - h * 0.5 - 0.12), (w + 0.2, 0.3, 0.2))
                for k in range(4):
                    b.sphere("flower_red" if k % 2 == 0 else "leafg", (x - w * 0.36 + k * w * 0.24, y + n.y * 0.24, z - h * 0.5 + 0.02), 0.13, subdiv=1)
        else:
            b.box("timber", (x + n.x * 0.04, y, z), (0.1, w + 0.2, h + 0.2))
            b.box("window_lit", (x + n.x * 0.09, y, z), (0.04, w, h))
            b.box("timber", (x + n.x * 0.11, y, z), (0.04, 0.06, h))
    for x in (-1.6, 1.6):
        window(x, -D * 0.5, 2.0, (0, -1, 0), box=False)
        window(x, D * 0.5, 2.0, (0, 1, 0), box=False)
    for x in (-1.75, 0.0, 1.75):
        window(x, -D2 * 0.5, 4.45, (0, -1, 0))
        window(x, D2 * 0.5, 4.45, (0, 1, 0), box=False)
    for sx in (-1, 1):
        window(sx * W2 * 0.5, 0, 4.45, (sx, 0, 0))
        window(sx * W * 0.5, 0.6, 2.0, (sx, 0, 0))
        window(0, 0, 0, (0, 0, 1)) if False else None
    # lucarne ronde dans le pignon
    for sx in (-1, 1):
        b.cyl("timber", (sx * (W2 * 0.5 + 0.02), 0, z3 + 1.15), 0.34, 0.34, 0.06, segs=14, rot=(0, math.pi / 2, 0))
        b.cyl("window_lit", (sx * (W2 * 0.5 + 0.05), 0, z3 + 1.15), 0.26, 0.26, 0.06, segs=14, rot=(0, math.pi / 2, 0))
    return b.finish(uv_scale=2.0)


# ----------------------------------------------------------------------------
# Arbres
# ----------------------------------------------------------------------------
def _trunk(b, rng, h, r0, branches=3, lean=0.12):
    # tronc légèrement penché + racines
    b.cyl("bark", (0, 0, 0), r0, r0 * 0.62, h, segs=9, rot=(lean * 0.3, lean, 0))
    for k in range(5):
        a = k * math.tau / 5 + rng.random() * 0.5
        b.cyl("bark", (math.cos(a) * r0 * 0.6, math.sin(a) * r0 * 0.6, -0.05), r0 * 0.45, 0.02, 0.9, segs=6,
              rot=(math.sin(a) * 1.0, -math.cos(a) * 1.0, 0))
    tops = []
    for k in range(branches):
        a = k * math.tau / branches + rng.random() * 0.8
        z = h * (0.62 + 0.28 * rng.random())
        L = h * 0.45
        tilt = 0.75 + rng.random() * 0.3
        b.cyl("bark", (0, 0, z), r0 * 0.38, r0 * 0.14, L, segs=6,
              rot=(-math.sin(a) * tilt, math.cos(a) * tilt, 0))
        tops.append(Vector((math.cos(a) * math.sin(tilt) * L, math.sin(a) * math.sin(tilt) * L, z + math.cos(tilt) * L)))
    return tops


def tree_round(name, seed, height=5.8, crown=2.0, apples=False, far=False):
    mats = ["bark", "tint_leaves"] + (["apple"] if apples else [])
    b = Builder(name, [MT[k] for k in mats])
    rng = random.Random(seed)
    th = height * 0.5
    tops = _trunk(b, rng, th, 0.3 if not far else 0.28, branches=0 if far else 3)
    cz = height - crown * 0.95
    sub = 1 if far else 2
    # grosse masse centrale + touffes autour (silhouette « nuage » des arbres d'anime)
    b.sphere("tint_leaves", (0, 0, cz), crown, scale=(1.0, 1.0, 0.82), subdiv=sub + (0 if far else 1), jitter=0.14, col=(0.92, 0.92, 0.92))
    n = 4 if far else 9
    for k in range(n):
        a = k * math.tau / n + rng.random() * 0.4
        r = crown * (0.72 + rng.random() * 0.18)
        z = cz + (rng.random() - 0.35) * crown * 0.9
        s = crown * (0.42 + rng.random() * 0.2)
        shade = 0.8 + 0.25 * (z - cz + crown) / (2 * crown)
        b.sphere("tint_leaves", (math.cos(a) * r, math.sin(a) * r, z), s, scale=(1, 1, 0.85), subdiv=sub, jitter=0.2,
                 col=(shade, shade, shade))
    if not far:
        b.sphere("tint_leaves", (0.2, -0.1, cz + crown * 0.62), crown * 0.55, scale=(1, 1, 0.8), subdiv=sub, jitter=0.18, col=(1.05, 1.05, 1.05))
    # cartes de feuilles sur la surface du houppier : silhouette touffue
    if not far:
        for k in range(46):
            a = rng.random() * math.tau
            el = (rng.random() * 1.5 - 0.45)
            nrm = Vector((math.cos(a) * math.cos(el), math.sin(a) * math.cos(el), math.sin(el)))
            p = Vector((0, 0, cz)) + Vector((nrm.x * crown * 1.12, nrm.y * crown * 1.12, nrm.z * crown * 0.9))
            sh = 0.85 + 0.25 * max(0.0, nrm.z)
            b.card("tint_leaves", p, (nrm + Vector((rng.random() - 0.5, rng.random() - 0.5, 0.3)) * 0.6), crown * 0.75,
                   spin=rng.random() * math.tau, col=(sh, sh, sh))
    if apples:
        for k in range(14):
            a = rng.random() * math.tau
            el = (rng.random() - 0.4) * 1.2
            p = Vector((math.cos(a) * math.cos(el), math.sin(a) * math.cos(el), math.sin(el) * 0.8)) * crown * 1.02
            b.sphere("apple", (p.x, p.y, cz + p.z), 0.13, subdiv=1)
    return b.finish(uv_scale=1.5)


def tree_pine(name, seed, height=6.7, far=False):
    b = Builder(name, [MT["bark"], MT["tint_needles"]])
    rng = random.Random(seed)
    b.cyl("bark", (0, 0, 0), 0.28, 0.1, height * 0.9, segs=8)
    tiers = 3 if far else 5
    for k in range(tiers):
        f = k / tiers
        z = height * (0.18 + 0.72 * f)
        r = 2.3 * (1.0 - f * 0.75)
        h = height * 0.34 * (1.0 - f * 0.35)
        shade = 0.82 + 0.25 * f
        b.cyl("tint_needles", (0, 0, z), r, 0.0, h, segs=8 if far else 12, col=(shade, shade, shade), smooth=False)
        if not far:
            # bord inférieur ondulé : petits cônes retombants
            for j in range(9):
                a = j * math.tau / 9 + k * 0.4
                b.cyl("tint_needles", (math.cos(a) * r * 0.82, math.sin(a) * r * 0.82, z - 0.12), r * 0.28, 0.0, h * 0.35, segs=6,
                      rot=(math.sin(a) * 0.5, -math.cos(a) * 0.5, 0), col=(shade * 0.92,) * 3, smooth=False)
    return b.finish(uv_scale=1.5)


# ----------------------------------------------------------------------------
# Rochers, buissons, fleurs
# ----------------------------------------------------------------------------
def rock(name, moss=False, seed=3):
    b = Builder(name, [MT["rock" if moss else "tint_rock"]] + ([MT["tint_moss"]] if moss else []))
    rng = random.Random(seed)
    m = "rock" if moss else "tint_rock"
    b.sphere(m, (0, 0, 0.12), 0.95, scale=(1.05, 0.92, 0.6), subdiv=1, jitter=0.35, smooth=False)
    b.sphere(m, (0.75, 0.35, 0.02), 0.42, scale=(1, 0.9, 0.7), subdiv=1, jitter=0.3, smooth=False, col=(0.9, 0.9, 0.9))
    b.sphere(m, (-0.6, -0.5, 0.0), 0.3, scale=(1, 1, 0.7), subdiv=1, jitter=0.3, smooth=False, col=(0.95, 0.95, 0.95))
    if moss:
        b.sphere("tint_moss", (0.05, 0.05, 0.42), 0.82, scale=(1.08, 0.98, 0.32), subdiv=2, jitter=0.25, smooth=True)
    ob = b.finish(uv_scale=1.0)
    return ob


def bush(name="Bush", seed=7):
    b = Builder(name, [MT["tint_bush"]])
    rng = random.Random(seed)
    for k in range(6):
        a = k * math.tau / 6 + rng.random() * 0.5
        r = 0.5 + rng.random() * 0.2
        s = 0.45 + rng.random() * 0.15
        sh = 0.85 + rng.random() * 0.2
        b.sphere("tint_bush", (math.cos(a) * r, math.sin(a) * r, 0.22), s, scale=(1, 1, 0.8), subdiv=2, jitter=0.22, col=(sh, sh, sh), flat_bottom=-0.1)
    b.sphere("tint_bush", (0, 0, 0.38), 0.62, scale=(1, 1, 0.75), subdiv=2, jitter=0.2, col=(1.05, 1.05, 1.05), flat_bottom=-0.1)
    return b.finish(uv_scale=1.0)


def flowers(name="Flower", seed=9):
    b = Builder(name, [MT["tint_petal"], MT["petal2"], MT["stem"]])
    rng = random.Random(seed)
    for k in range(5):
        x = (rng.random() - 0.5) * 0.6
        y = (rng.random() - 0.5) * 0.4
        h = 0.14 + rng.random() * 0.12
        b.cyl("stem", (x, y, 0), 0.012, 0.01, h, segs=4, smooth=False)
        for j in range(5):
            a = j * math.tau / 5 + k
            b.sphere("tint_petal", (x + math.cos(a) * 0.045, y + math.sin(a) * 0.045, h), 0.04, scale=(1.4, 0.7, 0.3), subdiv=1,
                     rot=(0, 0, a))
        b.sphere("petal2", (x, y, h + 0.01), 0.022, subdiv=1)
        b.box("stem", (x + 0.03, y, h * 0.4), (0.09, 0.03, 0.01), rot=(0, -0.5, 0))
    return b.finish(uv_scale=0.5)


# ----------------------------------------------------------------------------
# Téléporteur et statue
# ----------------------------------------------------------------------------
def waypoint():
    b = Builder("Waypoint", [MT["wp_stone"], MT["wp_dark"], MT["gold"]])
    b.box("wp_stone", (0, 0, 0.12), (2.5, 2.5, 0.24), bevel=0.04)
    b.box("wp_stone", (0, 0, 0.34), (1.9, 1.9, 0.2), bevel=0.04)
    b.box("wp_dark", (0, 0, 0.45), (1.5, 1.5, 0.04))
    for sx, sy in ((1, 1), (1, -1), (-1, 1), (-1, -1)):
        b.box("gold", (sx * 0.95, sy * 0.95, 0.46), (0.16, 0.16, 0.06))
    b.cyl("wp_stone", (0, 0, 0.44), 0.55, 0.42, 0.35, segs=8, smooth=False)
    b.cyl("wp_stone", (0, 0, 0.79), 0.32, 0.27, 1.9, segs=8, smooth=False)
    for z in (0.95, 1.9, 2.55):
        b.cyl("gold", (0, 0, z), 0.34 if z < 2 else 0.31, 0.34 if z < 2 else 0.31, 0.08, segs=8, smooth=False)
    b.cyl("wp_dark", (0, 0, 2.69), 0.3, 0.5, 0.3, segs=8, smooth=False)
    b.cyl("gold", (0, 0, 2.99), 0.52, 0.52, 0.06, segs=16)
    # griffes dorées qui tiennent le cristal
    for k in range(4):
        a = k * math.tau / 4 + math.pi / 4
        x, y = math.cos(a), math.sin(a)
        b.cyl("gold", (x * 0.42, y * 0.42, 3.0), 0.05, 0.025, 0.75, segs=5, rot=(y * 0.35, -x * 0.35, 0), smooth=False)
    w = b.finish(uv_scale=1.0)
    c = Builder("WaypointCrystal", [MT["tint_wpcrystal"]])
    c.cyl("tint_wpcrystal", (0, 0, -0.5), 0.0, 0.26, 0.55, segs=6, smooth=False)
    c.cyl("tint_wpcrystal", (0, 0, 0.05), 0.26, 0.0, 0.65, segs=6, smooth=False)
    for k in range(3):
        a = k * math.tau / 3
        c.cyl("tint_wpcrystal", (math.cos(a) * 0.33, math.sin(a) * 0.33, -0.15), 0.0, 0.07, 0.15, segs=4, smooth=False)
        c.cyl("tint_wpcrystal", (math.cos(a) * 0.33, math.sin(a) * 0.33, 0.0), 0.07, 0.0, 0.25, segs=4, smooth=False)
    return w, c.finish()


def statue():
    """Statue d'Aetheria : figure encapuchonnée aux ailes de cape, tenant un orbe d'éther."""
    b = Builder("Statue", [MT["marble"], MT["gold"], MT["aether"], MT["wp_stone"]])
    # socle à gradins octogonal
    b.cyl("wp_stone", (0, 0, 0), 1.32, 1.3, 0.28, segs=8, smooth=False)
    b.cyl("gold", (0, 0, 0.28), 1.2, 1.2, 0.05, segs=8, smooth=False)
    b.cyl("wp_stone", (0, 0, 0.33), 1.12, 1.08, 0.3, segs=8, smooth=False)
    b.cyl("marble", (0, 0, 0.63), 0.86, 0.8, 0.42, segs=8, smooth=False)
    b.cyl("gold", (0, 0, 1.0), 0.84, 0.84, 0.05, segs=8, smooth=False)
    # robe évasée
    b.cyl("marble", (0, 0.05, 1.05), 0.72, 0.34, 1.7, segs=20)
    for k in range(6):
        a = k * math.tau / 6 + 0.3
        b.cyl("marble", (math.cos(a) * 0.5, 0.05 + math.sin(a) * 0.5, 1.05), 0.16, 0.03, 1.5, segs=6,
              rot=(-math.sin(a) * 0.25, math.cos(a) * 0.25, 0))
    # buste
    b.cyl("marble", (0, 0.08, 2.7), 0.34, 0.27, 0.55, segs=14)
    b.sphere("marble", (0, 0.06, 3.38), 0.19, scale=(1, 1, 1.15), subdiv=2)
    b.sphere("marble", (0, 0.12, 3.43), 0.25, scale=(1.0, 1.1, 1.18), subdiv=2, flat_bottom=3.2)
    # grandes ailes / pans de cape vers l'arrière
    for sx in (-1, 1):
        for k in range(3):
            h = 1.9 - k * 0.35
            b.box("marble", (sx * (0.55 + k * 0.32), 0.42 + k * 0.12, 2.55 + k * 0.28), (0.5, 0.06, h),
                  rot=(0.25, sx * (0.55 + k * 0.18), sx * -(0.35 + k * 0.12)))
        b.box("gold", (sx * 1.18, 0.7, 3.25), (0.1, 0.08, 0.5), rot=(0.25, sx * 0.9, sx * -0.6))
    # bras qui tiennent l'orbe devant la poitrine
    for sx in (-1, 1):
        b.cyl("marble", (sx * 0.3, 0.05, 3.0), 0.085, 0.07, 0.5, segs=8, rot=(1.9, 0, sx * 0.5))
        b.sphere("marble", (sx * 0.17, -0.42, 2.7), 0.07, subdiv=1)
    b.sphere("aether", (0, -0.5, 2.82), 0.24, subdiv=2)
    b.cyl("gold", (0, -0.5, 2.82), 0.32, 0.32, 0.035, segs=24, rot=(math.pi / 2, 0, 0))
    b.cyl("gold", (0, -0.5, 2.82), 0.32, 0.32, 0.035, segs=24, rot=(0, math.pi / 2, 0))
    # auréole dorée derrière la tête
    b.cyl("gold", (0, 0.36, 3.5), 0.5, 0.5, 0.03, segs=28, rot=(math.pi / 2, 0, 0))
    b.cyl("marble", (0, 0.38, 3.5), 0.43, 0.43, 0.035, segs=28, rot=(math.pi / 2, 0, 0))
    return b.finish(uv_scale=1.0)


# ----------------------------------------------------------------------------
# Petit mobilier de village
# ----------------------------------------------------------------------------
def lantern():
    b = Builder("Lantern", [MT["iron"], MT["lamp"], MT["footing"]])
    b.box("footing", (0, 0, 0.12), (0.34, 0.34, 0.24), bevel=0.03)
    b.cyl("iron", (0, 0, 0.2), 0.06, 0.045, 2.2, segs=8)
    b.cyl("iron", (0, 0, 2.38), 0.07, 0.03, 0.08, segs=8)
    # bras recourbé vers +X
    b.box("iron", (0.22, 0, 2.3), (0.46, 0.04, 0.04))
    b.box("iron", (0.1, 0, 2.18), (0.24, 0.03, 0.03), rot=(0, 0.8, 0))
    b.box("iron", (0.42, 0, 2.27), (0.03, 0.03, 0.08))
    # lanterne suspendue
    b.cyl("iron", (0.42, 0, 2.19), 0.0, 0.16, 0.0, segs=4) if False else None
    b.cyl("iron", (0.42, 0, 2.12), 0.16, 0.04, 0.1, segs=4, smooth=False, rot=(0, 0, math.pi / 4))
    b.box("lamp", (0.42, 0, 1.95), (0.2, 0.2, 0.28))
    for sx, sy in ((1, 1), (1, -1), (-1, 1), (-1, -1)):
        b.box("iron", (0.42 + sx * 0.11, sy * 0.11, 1.95), (0.03, 0.03, 0.32))
    b.cyl("iron", (0.42, 0, 1.79), 0.13, 0.13, 0.04, segs=4, smooth=False, rot=(0, 0, math.pi / 4))
    return b.finish(uv_scale=1.0)


def fence():
    b = Builder("Fence", [MT["fence_wood"]])
    for x in (-1.5, 0.0, 1.5):
        b.box("fence_wood", (x, 0, 0.5), (0.12, 0.12, 1.0))
        b.cyl("fence_wood", (x, 0, 1.0), 0.085, 0.0, 0.14, segs=4, smooth=False, rot=(0, 0, math.pi / 4))
    for z in (0.38, 0.78):
        b.box("fence_wood", (0, 0.07, z), (3.2, 0.05, 0.13))
    return b.finish(uv_scale=1.0)


def well():
    b = Builder("Well", [MT["wellstone"], MT["timber"], MT["tint_roof"], MT["water_dark"]])
    b.cyl("wellstone", (0, 0, 0), 0.92, 0.92, 0.8, segs=16, caps=False, smooth=False)
    b.cyl("wellstone", (0, 0, 0), 0.72, 0.72, 0.8, segs=16, caps=False, smooth=False)
    b.cyl("wellstone", (0, 0, 0.78), 0.98, 0.98, 0.1, segs=16, smooth=False)
    b.cyl("water_dark", (0, 0, 0.3), 0.72, 0.72, 0.02, segs=16)
    for sx in (-1, 1):
        b.box("timber", (sx * 0.8, 0, 1.55), (0.14, 0.14, 1.6))
    b.box("timber", (0, 0, 2.2), (1.8, 0.1, 0.1))
    b.cyl("timber", (0, 0, 1.75), 0.1, 0.1, 1.4, segs=8, rot=(0, math.pi / 2, 0))
    b.cyl("timber", (0, 0, 1.75), 0.1, 0.1, 1.4, segs=8, rot=(0, math.pi / 2, 0)) if False else None
    b.roof("tint_roof", (0, 0, 2.3), 1.7, 1.2, 0.55, thick=0.07, overhang=0.18)
    return b.finish(uv_scale=1.0)


def stall():
    b = Builder("Stall", [MT["fence_wood"], MT["tint_cloth"], MT["apple"], MT["orange"], MT["cloth_white"]])
    b.box("fence_wood", (0, 0.15, 0.48), (2.8, 1.0, 0.96))
    b.box("fence_wood", (0, 0.15, 0.98), (2.95, 1.12, 0.06))
    for sx in (-1.35, 1.35):
        for sy in (-0.75, 0.75):
            b.box("fence_wood", (sx, sy, 1.3), (0.1, 0.1, 2.6))
    # auvent rayé (bandes teintées / blanches)
    for k in range(7):
        x = -1.5 + k * 3.0 / 7 + 3.0 / 14
        b.box("tint_cloth" if k % 2 == 0 else "cloth_white", (x, -0.05, 2.5), (3.0 / 7, 2.0, 0.05), rot=(0.28, 0, 0))
        b.box("tint_cloth" if k % 2 == 0 else "cloth_white", (x, -1.02, 2.2), (3.0 / 7, 0.03, 0.3))
    for k in range(9):
        b.sphere("apple" if k % 2 == 0 else "orange", (-1.1 + k * 0.27, -0.1 + (k % 3) * 0.08, 1.08), 0.09, subdiv=1)
    for k in range(3):
        b.box("fence_wood", (-0.8 + k * 0.8, 0.45, 1.13), (0.6, 0.4, 0.24))
    return b.finish(uv_scale=1.0)


def windmill_base():
    b = Builder("WindmillBase", [MT["plaster"], MT["tint_roof"], MT["timber"], MT["footing"]])
    b.cyl("footing", (0, 0, 0), 2.0, 1.9, 1.0, segs=8, smooth=False)
    b.cyl("plaster", (0, 0, 1.0), 1.85, 1.35, 6.4, segs=8, smooth=False)
    for k in range(8):
        a = k * math.tau / 8 + math.tau / 16
        r = 1.6
        b.box("timber", (math.cos(a) * r * 1.0, math.sin(a) * r * 1.0, 4.2), (0.14, 0.14, 6.4), rot=(math.sin(a) * 0.08, -math.cos(a) * 0.08, 0))
    for z, r in ((1.05, 1.9), (4.2, 1.62), (7.35, 1.4)):
        b.cyl("timber", (0, 0, z), r, r, 0.14, segs=8, smooth=False)
    b.cyl("tint_roof", (0, 0, 7.4), 1.85, 0.0, 3.0, segs=8, smooth=False)
    # porte et fenêtres
    b.box("timber", (0, -1.83, 1.95), (0.9, 0.14, 1.8))
    b.box("timber", (0, -1.55, 5.2), (0.55, 0.14, 0.7), rot=(0.1, 0, 0))
    # carter du moyeu (face avant -Y, hauteur 6.2)
    b.box("timber", (0, -1.75, 6.2), (0.8, 1.1, 0.8))
    b.cyl("timber", (0, -2.2, 6.2), 0.18, 0.18, 0.3, segs=8, rot=(math.pi / 2, 0, 0))
    return b.finish(uv_scale=2.0)


# ----------------------------------------------------------------------------
# Cueillette, cuisine et villages
# ----------------------------------------------------------------------------
def mint():
    b = Builder("Mint", [MT["mint"], MT["mint_dark"]])
    rng = random.Random(31)
    for k in range(9):
        a = k * math.tau / 9 + rng.random() * 0.4
        r = 0.08 + rng.random() * 0.12
        h = 0.18 + rng.random() * 0.16
        x, y = math.cos(a) * r, math.sin(a) * r
        b.cyl("mint_dark", (x, y, 0), 0.012, 0.01, h, segs=4, smooth=False)
        for j in range(2):
            la = a + (j - 0.5) * 1.6
            b.sphere("mint", (x + math.cos(la) * 0.06, y + math.sin(la) * 0.06, h - 0.02 + j * 0.04), 0.07,
                     scale=(1.6, 0.8, 0.22), rot=(0.3, 0, la), subdiv=1, smooth=False)
        b.sphere("mint", (x, y, h + 0.05), 0.05, scale=(1.0, 1.0, 1.3), subdiv=1, smooth=False)
    return b.finish(uv_scale=0.5)


def mushroom_pick():
    b = Builder("MushroomPick", [MT["mush_cap"], MT["mush_stem"]])
    for (x, y, s) in ((0, 0, 1.0), (0.2, 0.12, 0.7), (-0.16, 0.15, 0.6)):
        b.cyl("mush_stem", (x, y, 0), 0.07 * s, 0.055 * s, 0.26 * s, segs=8)
        b.sphere("mush_cap", (x, y, 0.27 * s), 0.17 * s, scale=(1, 1, 0.62), subdiv=2, flat_bottom=0.24 * s)
        for k in range(4):
            a = k * math.tau / 4 + x * 5
            b.sphere("mush_stem", (x + math.cos(a) * 0.1 * s, y + math.sin(a) * 0.1 * s, 0.33 * s), 0.025 * s, subdiv=1)
    return b.finish(uv_scale=0.5)


def lotus_plant():
    b = Builder("LotusPlant", [MT["lotus_pad"], MT["lotus_petal"], MT["lotus_pod"], MT["lily_heart"]])
    for (x, y, s) in ((0.0, 0.0, 1.0), (0.42, 0.2, 0.6), (-0.35, 0.28, 0.5)):
        b.cyl("lotus_pad", (x, y, 0.0), 0.32 * s, 0.32 * s, 0.02, segs=14, smooth=False)
    b.cyl("lotus_pod", (0, 0, 0.0), 0.02, 0.02, 0.35, segs=5)
    for k in range(8):
        a = k * math.tau / 8
        b.sphere("lotus_petal", (math.cos(a) * 0.1, math.sin(a) * 0.1, 0.42), 0.08, scale=(1.5, 0.7, 0.45),
                 rot=(0, -0.7, a), subdiv=1, smooth=False)
    b.cyl("lotus_pod", (0, 0, 0.42), 0.05, 0.08, 0.08, segs=8, smooth=False)
    b.cyl("lily_heart", (0, 0, 0.5), 0.08, 0.08, 0.01, segs=8)
    b.cyl("lotus_pod", (0.42, 0.2, 0.0), 0.015, 0.015, 0.45, segs=4)
    b.cyl("lotus_pod", (0.42, 0.2, 0.45), 0.04, 0.09, 0.09, segs=8, smooth=False)
    return b.finish(uv_scale=0.5)


def chili_plant():
    b = Builder("ChiliPlant", [MT["chili_leaf"], MT["chili"], MT["stem"]])
    rng = random.Random(41)
    b.cyl("stem", (0, 0, 0), 0.025, 0.015, 0.35, segs=5)
    for k in range(7):
        a = k * math.tau / 7
        b.sphere("chili_leaf", (math.cos(a) * 0.14, math.sin(a) * 0.14, 0.32 + rng.random() * 0.08), 0.1,
                 scale=(1.6, 0.7, 0.3), rot=(0.2, 0, a), subdiv=1, smooth=False)
    for k in range(5):
        a = k * math.tau / 5 + 0.3
        x, y = math.cos(a) * 0.12, math.sin(a) * 0.12
        b.cyl("chili", (x, y, 0.3), 0.035, 0.008, -0.16, segs=6, rot=(0.25 * math.sin(a), 0.25 * math.cos(a), 0))
    return b.finish(uv_scale=0.5)


def wind_lily():
    b = Builder("WindLily", [MT["stem"], MT["lily"], MT["lily_heart"]])
    for (x, y, h) in ((0, 0, 0.55), (0.14, 0.08, 0.42), (-0.12, 0.1, 0.36)):
        b.cyl("stem", (x, y, 0), 0.012, 0.01, h, segs=4, smooth=False)
        b.sphere("stem", (x + 0.05, y, h * 0.4), 0.05, scale=(1.8, 0.5, 0.2), rot=(0, -0.6, 0), subdiv=1)
        for k in range(6):
            a = k * math.tau / 6
            b.sphere("lily", (x + math.cos(a) * 0.06, y + math.sin(a) * 0.06, h + 0.03), 0.06, scale=(1.7, 0.6, 0.35),
                     rot=(0, -0.45, a), subdiv=1, smooth=False)
        b.sphere("lily_heart", (x, y, h + 0.05), 0.025, subdiv=1)
    return b.finish(uv_scale=0.5)


def cookpot():
    """Marmite de cuisine : feu de camp, trépied et chaudron."""
    b = Builder("CookPot", [MT["wellstone"], MT["timber"], MT["iron"], MT["fire"], MT["fire_core"], MT["soup"]])
    for k in range(9):
        a = k * math.tau / 9
        b.sphere("wellstone", (math.cos(a) * 0.62, math.sin(a) * 0.62, 0.08), 0.17, scale=(1.2, 1.0, 0.7), subdiv=1, jitter=0.25, smooth=False)
    for k in range(3):
        a = k * math.tau / 3 + 0.3
        b.cyl("timber", (math.cos(a) * 0.3, math.sin(a) * 0.3, 0.1), 0.06, 0.06, 0.7, segs=6, rot=(math.pi / 2, 0, a + math.pi / 2))
    b.cone("fire", (0, 0, 0.12), 0.32, 0.55, segs=7)
    for k in range(4):
        a = k * math.tau / 4
        b.cone("fire", (math.cos(a) * 0.14, math.sin(a) * 0.14, 0.12), 0.13, 0.4, segs=5)
    b.cone("fire_core", (0, 0, 0.12), 0.16, 0.36, segs=6)
    for k in range(3):
        a = k * math.tau / 3
        b.cyl("iron", (math.cos(a) * 0.75, math.sin(a) * 0.75, 0), 0.03, 0.03, 1.55, segs=5,
              rot=(math.sin(a) * 0.45, -math.cos(a) * 0.45, 0))
    b.cyl("iron", (0, 0, 1.0), 0.015, 0.015, 0.4, segs=4)
    b.sphere("iron", (0, 0, 0.82), 0.36, scale=(1, 1, 0.78), subdiv=2, flat_bottom=0.64)
    b.cyl("iron", (0, 0, 0.96), 0.33, 0.33, 0.05, segs=16)
    b.cyl("soup", (0, 0, 0.99), 0.3, 0.3, 0.02, segs=16)
    return b.finish(uv_scale=1.0)


def forge():
    """Grande forge de Forgeval : four de pierre rougeoyant, cheminée et enclume."""
    b = Builder("Forge", [MT["forge_stone"], MT["forge_glow"], MT["iron"], MT["timber"], MT["tint_roof"]])
    b.box("forge_stone", (0, 0, 1.0), (3.2, 2.6, 2.0), bevel=0.06)
    b.box("forge_glow", (0, -1.31, 0.9), (1.4, 0.04, 1.0))
    b.box("forge_stone", (0, -1.36, 1.55), (1.8, 0.2, 0.3))
    for k in range(5):
        b.box("forge_glow", (-0.7 + k * 0.35, -1.33, 0.32), (0.18, 0.05, 0.1))
    b.cyl("forge_stone", (0.6, 0.4, 2.0), 0.55, 0.42, 3.2, segs=8, smooth=False)
    b.cyl("iron", (0.6, 0.4, 5.15), 0.5, 0.5, 0.12, segs=8, smooth=False)
    b.box("iron", (-1.0, -2.6, 0.55), (0.9, 0.42, 0.18))
    b.box("iron", (-1.0, -2.6, 0.3), (0.32, 0.26, 0.5))
    b.box("timber", (-1.0, -2.6, 0.05), (0.7, 0.5, 0.1))
    b.roof("tint_roof", (0, -0.2, 2.0), 3.6, 3.2, 0.9, thick=0.1, overhang=0.25)
    return b.finish(uv_scale=1.0)


def signpost():
    b = Builder("Signpost", [MT["sign_wood"], MT["timber"]])
    b.box("timber", (0, 0, 1.0), (0.14, 0.14, 2.0))
    b.box("sign_wood", (0.35, 0, 1.6), (1.1, 0.08, 0.36), bevel=0.02)
    b.box("sign_wood", (-0.3, 0, 1.15), (0.9, 0.08, 0.3), bevel=0.02)
    return b.finish(uv_scale=1.0)


def spire(name="Spire", seed=21):
    """Aiguille rocheuse escaladable (~10 m) : blocs empilés, chapeau de mousse."""
    b = Builder(name, [MT["tint_rock"], MT["tint_moss"]])
    rng = random.Random(seed)
    z = -0.6
    layers = [(2.5, 3.0), (2.2, 2.8), (2.0, 2.6), (1.8, 2.4)]
    for k, (r, h) in enumerate(layers):
        g = 0.86 + 0.05 * k
        b.sphere("tint_rock", (rng.uniform(-0.15, 0.15), rng.uniform(-0.15, 0.15), z + h * 0.5), r,
                 scale=(1.0, 0.94, h * 0.62 / r), subdiv=2, jitter=0.16, smooth=False, col=(g, g, g))
        z += h * 0.92
    b.sphere("tint_rock", (0.0, 0.0, z + 0.1), 1.7, scale=(1.0, 0.96, 0.3), subdiv=2, jitter=0.08, smooth=False)
    b.sphere("tint_moss", (0.0, 0.0, z + 0.34), 1.55, scale=(1.0, 0.96, 0.18), subdiv=2, jitter=0.1, smooth=True)
    return b.finish(uv_scale=2.5)


def oculus():
    """Anémoculus : cristal-œil turquoise à quatre ailettes, dans un anneau doré."""
    b = Builder("Oculus", [MT["oculus_core"], MT["oculus_wing"], MT["gold"]])
    b.cyl("oculus_core", (0, 0, -0.26), 0.0, 0.17, 0.26, segs=8, smooth=False)
    b.cyl("oculus_core", (0, 0, 0.0), 0.17, 0.0, 0.3, segs=8, smooth=False)
    b.sphere("oculus_wing", (0, -0.05, 0.02), 0.07, subdiv=1)
    for k in range(4):
        a = k * math.tau / 4 + math.pi / 4
        x, y = math.cos(a), math.sin(a)
        b.sphere("oculus_wing", (x * 0.26, 0.0, y * 0.26), 0.12, scale=(1.0, 0.25, 0.45), rot=(0, -a, 0), subdiv=1, smooth=False)
    b.cyl("gold", (0, 0.035, 0), 0.31, 0.31, 0.03, segs=24, rot=(math.pi / 2, 0, 0), caps=False)
    b.cyl("gold", (0, -0.035, 0), 0.33, 0.33, 0.03, segs=24, rot=(math.pi / 2, 0, 0), caps=False)
    return b.finish(uv_scale=0.5)


def build():
    reset()
    global MT
    MT = M()
    house(MT)
    tree_round("TreeRound", 1)
    tree_round("TreeRound2", 2, height=5.2, crown=1.8)
    tree_round("TreeApple", 3, height=5.0, crown=1.75, apples=True)
    tree_round("TreeRoundFar", 4, height=6.0, crown=1.9, far=True)
    tree_pine("TreePine", 5)
    tree_pine("TreePineFar", 6, height=6.1, far=True)
    rock("Rock", False, 11)
    rock("RockMoss", True, 12)
    bush()
    flowers()
    waypoint()
    statue()
    lantern()
    fence()
    well()
    stall()
    windmill_base()
    oculus()
    spire()
    mint()
    mushroom_pick()
    lotus_plant()
    chili_plant()
    wind_lily()
    cookpot()
    forge()
    signpost()
    bpy.ops.export_scene.gltf(filepath=OUT, export_format="GLB", use_selection=False, export_apply=True,
                              export_vertex_color="ACTIVE", export_all_vertex_colors=True,
                              export_animations=False, export_yup=True)
    print("PROPS", OUT, [o.name for o in bpy.data.objects], sum(len(o.data.vertices) for o in bpy.data.objects if o.type == "MESH"))


MT = {}
if __name__ == "__main__":
    build()
