# -*- coding: utf-8 -*-
"""
Asphalt Legends Unite - Fangame
Générateur procédural de voitures pour Blender (testé avec Blender 4.2 LTS).

Lit godot/data/cars.json et produit pour chaque voiture :
  - godot/assets/cars/<id>.glb      (modèle 3D : Body + Wheel_FL/FR/RL/RR)
  - godot/assets/thumbs/<id>.png    (vignette rendue avec Cycles, style "carte" Asphalt)

Utilisation :
  blender -b -P blender/build_cars.py
  blender -b -P blender/build_cars.py -- --only bmw_m5,peugeot_3008
  blender -b -P blender/build_cars.py -- --no-thumbs
  blender -b -P blender/build_cars.py -- --showcase      (rendus HD des 3 voitures gratuites)

Conventions pour Godot :
  - la voiture regarde vers +Y dans Blender (=> -Z dans Godot, l'avant standard)
  - les matériaux "Paint" peuvent être repeints à la volée dans le jeu
  - chaque roue est un objet séparé avec son origine au centre (rotation sur X)
"""
import bpy
import bmesh
import json
import math
import os
import sys
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GODOT = os.path.join(ROOT, "godot")
DATA = os.path.join(GODOT, "data", "cars.json")
OUT_CARS = os.path.join(GODOT, "assets", "cars")
OUT_THUMBS = os.path.join(GODOT, "assets", "thumbs")
OUT_SHOWCASE = os.path.join(ROOT, "docs")

# ---------------------------------------------------------------------------
# Profils de carrosserie.  t = 0 à l'arrière, t = 1 à l'avant.
#   belt  : ligne de caisse (fraction de la hauteur totale H)
#   cabin : (base lunette arrière, début du toit, fin du toit, base du pare-brise)
#   roof_w: largeur du toit / largeur de caisse (effet "tumblehome")
#   clear : garde au sol (m)
#   front_oh : part du porte-à-faux total située à l'avant
# ---------------------------------------------------------------------------
PROFILES = {
    "sedan": dict(belt=[(0, .50), (.06, .60), (.20, .645), (.68, .63), (.90, .56), (1, .42)],
                  cabin=(.17, .33, .58, .745), roof_w=.74, clear=.15, front_oh=.55),
    "fastback": dict(belt=[(0, .50), (.06, .60), (.20, .64), (.68, .62), (.90, .55), (1, .41)],
                     cabin=(.10, .36, .58, .72), roof_w=.72, clear=.14, front_oh=.55),
    "suv": dict(belt=[(0, .52), (.04, .62), (.25, .645), (.72, .635), (.92, .58), (1, .47)],
                cabin=(.035, .12, .63, .75), roof_w=.80, clear=.20, front_oh=.52),
    "hatch": dict(belt=[(0, .52), (.04, .60), (.25, .62), (.72, .61), (.92, .55), (1, .44)],
                  cabin=(.03, .10, .60, .74), roof_w=.80, clear=.15, front_oh=.55),
    "coupe": dict(belt=[(0, .52), (.05, .63), (.25, .665), (.62, .62), (.92, .54), (1, .42)],
                  cabin=(.13, .34, .52, .66), roof_w=.72, clear=.13, front_oh=.55),
    "coupe911": dict(belt=[(0, .48), (.08, .58), (.30, .62), (.70, .58), (.92, .50), (1, .40)],
                     cabin=(.06, .40, .56, .70), roof_w=.72, clear=.12, front_oh=.45),
    "supercar": dict(belt=[(0, .56), (.05, .68), (.28, .70), (.55, .64), (.80, .58), (.93, .48), (1, .36)],
                     cabin=(.24, .42, .56, .76), roof_w=.64, clear=.11, front_oh=.45),
    "van": dict(belt=[(0, .45), (.03, .50), (.90, .50), (.97, .45), (1, .38)],
                cabin=(.005, .02, .80, .93), roof_w=.92, clear=.18, front_oh=.35),
}

STATIONS = 44  # sections le long de la voiture


# ---------------------------------------------------------------------------
# Utilitaires
# ---------------------------------------------------------------------------
def srgb_to_linear(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def hex_color(h):
    h = h.lstrip("#")
    return tuple(srgb_to_linear(int(h[i:i + 2], 16) / 255.0) for i in (0, 2, 4))


def interp(pts, t):
    if t <= pts[0][0]:
        return pts[0][1]
    for i in range(len(pts) - 1):
        t0, v0 = pts[i]
        t1, v1 = pts[i + 1]
        if t <= t1:
            u = (t - t0) / (t1 - t0) if t1 > t0 else 0.0
            return v0 + (v1 - v0) * u
    return pts[-1][1]


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def new_mat(name, color, metallic=0.0, rough=0.5, emission=None, strength=0.0, alpha=1.0, coat=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (color[0], color[1], color[2], 1.0)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = rough
    if emission is not None:
        b.inputs["Emission Color"].default_value = (emission[0], emission[1], emission[2], 1.0)
        b.inputs["Emission Strength"].default_value = strength
    if alpha < 1.0:
        b.inputs["Alpha"].default_value = alpha
        try:
            m.surface_render_method = "BLENDED"
        except AttributeError:
            m.blend_method = "BLEND"
    if coat > 0.0:
        b.inputs["Coat Weight"].default_value = coat
        b.inputs["Coat Roughness"].default_value = 0.03
    return m


def link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def mesh_object(name, bm, mats):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    obj = bpy.data.objects.new(name, me)
    return link(obj)


def activate(obj):
    for o in bpy.context.scene.objects:
        if o is not None:
            o.select_set(False)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)


def apply_modifiers(obj):
    activate(obj)
    for mod in list(obj.modifiers):
        bpy.ops.object.modifier_apply(modifier=mod.name)


def shade_smooth(obj, angle=40.0):
    activate(obj)
    bpy.ops.object.shade_smooth()
    try:
        bpy.ops.object.shade_auto_smooth(angle=math.radians(angle))
    except Exception:
        pass


def box(name, size, mat, loc=(0, 0, 0), rot=None, bevel=0.0):
    """Boîte (size = dimensions complètes) avec biseau optionnel."""
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
    obj = mesh_object(name, bm, [mat])
    if bevel > 0.0:
        md = obj.modifiers.new("bevel", "BEVEL")
        md.width = bevel
        md.segments = 2
        md.limit_method = "NONE"
        apply_modifiers(obj)
    if rot is not None:
        obj.matrix_world = Matrix.Translation(Vector(loc)) @ rot.to_4x4()
    else:
        obj.location = loc
    return obj


def cylinder(name, radius, depth, mat, loc=(0, 0, 0), axis="X", verts=24):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=verts,
                          radius1=radius, radius2=radius, depth=depth)
    if axis == "X":
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(math.pi / 2, 3, "Y"))
    elif axis == "Y":
        bmesh.ops.rotate(bm, verts=bm.verts, cent=(0, 0, 0), matrix=Matrix.Rotation(math.pi / 2, 3, "X"))
    obj = mesh_object(name, bm, [mat])
    obj.location = loc
    return obj


def join(objs, name):
    objs = [o for o in objs if o is not None]
    activate(objs[0])
    for o in objs:
        o.select_set(True)
    bpy.ops.object.join()
    res = bpy.context.view_layer.objects.active
    res.name = name
    res.data.name = name
    return res


def apply_transforms(obj):
    activate(obj)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)


def aligned_rot(normal):
    """Rotation qui aligne l'axe local +Y sur la normale (Z reste vers le haut)."""
    n = Vector(normal).normalized()
    return n.to_track_quat("Y", "Z").to_matrix()


# ---------------------------------------------------------------------------
# Construction de la carrosserie
# ---------------------------------------------------------------------------
class Shape:
    def __init__(self, spec):
        self.spec = spec
        self.prof = PROFILES[spec.get("body", "sedan")]
        self.L = spec["L"]
        self.W = spec["W"]
        self.H = spec["H"]
        self.wr = spec["wr"]
        self.wb = spec["wb"]
        oh = self.L - self.wb
        f_oh = oh * self.prof["front_oh"]
        self.y_front_axle = self.L / 2 - f_oh
        self.y_rear_axle = self.y_front_axle - self.wb

    def y_of(self, t):
        return -self.L / 2 + t * self.L

    def t_of(self, y):
        return (y + self.L / 2) / self.L

    def half_width(self, t):
        w = self.W / 2
        if t < 0.10:
            w *= 0.88 + 0.12 * math.sin((t / 0.10) * math.pi / 2)
        if t > 0.84:
            w *= 1.0 - 0.14 * ((t - 0.84) / 0.16) ** 1.7
        # ailes galbées au-dessus des roues (plus marquées à l'arrière des sportives)
        tr = self.t_of(self.y_rear_axle)
        tf = self.t_of(self.y_front_axle)
        hips = 0.04 if self.spec.get("body") in ("supercar", "coupe", "coupe911") else 0.025
        w *= 1.0 + hips * math.exp(-((t - tr) / 0.075) ** 2) + 0.022 * math.exp(-((t - tf) / 0.07) ** 2)
        return w

    def bottom(self, t):
        c = self.prof["clear"]
        c += 0.13 * max(0.0, (0.12 - t) / 0.12) ** 1.5
        c += 0.10 * max(0.0, (t - 0.88) / 0.12) ** 1.5
        return c

    def belt(self, t):
        return interp(self.prof["belt"], t) * self.H

    def top(self, t):
        rw, rr, rf, ws = self.prof["cabin"]
        zb = self.belt(t)
        if t <= rw or t >= ws:
            return zb + 0.035
        if t < rr:
            u = (t - rw) / (rr - rw)
        elif t <= rf:
            u = 1.0
        else:
            u = (ws - t) / (ws - rf)
        u = math.sin(u * math.pi / 2) ** 0.85
        return max(zb + 0.035, zb + (self.H - zb) * u)

    def ring(self, t, end=False):
        """Demi-section droite (x>=0), du bas au centre du toit."""
        w = self.half_width(t)
        zb = self.bottom(t)
        zt = self.belt(t)
        ztop = self.top(t)
        ch = ztop - zt
        rw = self.prof["roof_w"]
        # les ailes doivent toujours couvrir les roues
        tf = self.t_of(self.y_front_axle)
        tr = self.t_of(self.y_rear_axle)
        g = max(math.exp(-((t - tf) / 0.13) ** 2), math.exp(-((t - tr) / 0.13) ** 2))
        zs = max(zt, zt + (2 * self.wr + 0.27 - zt) * g)
        pts = [
            (0.0, zb),
            (w * 0.90, zb),
            (w * 0.99, zb + 0.18 * (zs - zb)),
            (w * 1.00, zb + 0.55 * (zs - zb)),
            (w * 0.975, zb + 0.86 * (zs - zb)),
            (w * 0.93, zs),
            (w * (0.93 + (rw - 0.93) * min(1.0, ch / 0.25 + 0.6)), zt + ch * 0.86),
            (w * rw * 0.84, ztop - min(0.012, ch * 0.1)),
            (w * rw * 0.45, ztop),
            (0.0, ztop),
        ]
        if end:
            mid = (zb + ztop) * 0.5
            pts = [(x * 0.86, mid + (z - mid) * 0.88) for x, z in pts]
        return pts


def build_body(shape, mats):
    spec = shape.spec
    bm = bmesh.new()
    rings = []
    n = STATIONS
    ts = [i / n for i in range(n + 1)]
    for i in range(n + 1):
        t = ts[i]
        y = shape.y_of(t)
        half = shape.ring(t, end=(i == 0 or i == n))
        full = [(x, z) for x, z in half] + [(-x, z) for x, z in reversed(half[1:-1])]
        rings.append([bm.verts.new((x, y, z)) for x, z in full])
    bm.verts.ensure_lookup_table()

    M_PAINT, M_GLASS, M_TRIM, M_ROOF = 0, 1, 2, 3
    rw, rr, rf, ws = shape.prof["cabin"]
    k = len(rings[0])
    half_n = 10
    b_pillar_t = rr + (rf - rr) * 0.45
    for i in range(n):
        t0 = ts[i]
        t1 = ts[i + 1]
        tm = (t0 + t1) / 2
        ch = min(shape.top(t0) - shape.belt(t0), shape.top(t1) - shape.belt(t1))
        cabin_ok = ch > 0.22 * (shape.H - shape.belt(tm)) and ch > 0.08
        for j in range(k):
            a = rings[i][j]
            b = rings[i][(j + 1) % k]
            c = rings[i + 1][(j + 1) % k]
            d = rings[i + 1][j]
            f = bm.faces.new((a, d, c, b))
            # index de segment dans la demi-section (symétrique)
            seg = j if j < half_n - 1 else (k - 1 - j)
            mat = M_PAINT
            if seg == 0:
                mat = M_TRIM
            elif seg == 5 and cabin_ok:
                mat = M_GLASS
                if t0 <= b_pillar_t < t1 and spec.get("body") != "van":
                    mat = M_TRIM
            elif seg in (6, 7, 8) and cabin_ok and (tm < rr - 0.005 or tm > rf + 0.005):
                mat = M_GLASS
            elif seg in (6, 7, 8) and rr <= tm <= rf and spec.get("roof_black"):
                mat = M_ROOF
            f.material_index = mat
    # bouchons avant / arrière
    bm.faces.new(list(reversed(rings[0])))
    bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    # arêtes vives (creases) : bas de caisse, ligne d'épaule, vitres, contour des boucliers
    crease = bm.edges.layers.float.get("crease_edge") or bm.edges.layers.float.new("crease_edge")
    sharp = {1: 0.85, 3: 0.35, 5: 0.75, 6: 0.55, 7: 0.6}
    for i in range(n):
        for j, val in sharp.items():
            for jj in (j, (k - j) % k):
                e = bm.edges.get((rings[i][jj], rings[i + 1][jj]))
                if e is not None:
                    e[crease] = val
    for r, val in ((rings[0], 0.5), (rings[-1], 0.4)):
        for j in range(k):
            e = bm.edges.get((r[j], r[(j + 1) % k]))
            if e is not None:
                e[crease] = val
    body = mesh_object("Body", bm, [mats["paint"], mats["glass"], mats["trim"], mats["roof"]])

    sub = body.modifiers.new("subsurf", "SUBSURF")
    sub.levels = 2
    sub.render_levels = 2
    apply_modifiers(body)

    # Passages de roues (booléens)
    cutters = []
    for y in (shape.y_front_axle, shape.y_rear_axle):
        for side in (-1, 1):
            r = shape.wr + 0.055
            cx = side * (shape.W / 2 - 0.12)
            cut = cylinder("cut", r, 0.56, mats["arch"], loc=(cx, y, shape.wr + 0.01), axis="X", verts=40)
            cutters.append(cut)
    for cut in cutters:
        md = body.modifiers.new("arch", "BOOLEAN")
        md.operation = "DIFFERENCE"
        md.solver = "EXACT"
        md.object = cut
        try:
            md.material_mode = "TRANSFER"
        except Exception:
            pass
        apply_modifiers(body)
    for cut in cutters:
        bpy.data.objects.remove(cut, do_unlink=True)
    shade_smooth(body, 35)
    return body


# ---------------------------------------------------------------------------
# Détails (phares, calandre, rétros, aileron...)
# ---------------------------------------------------------------------------
def build_details(shape, body, mats):
    spec = shape.spec
    L, W, H = shape.L, shape.W, shape.H
    dg = bpy.context.evaluated_depsgraph_get()
    bvh = BVHTree.FromObject(body, dg)
    parts = []

    def hit(origin, direction):
        loc, nor, _, _ = bvh.ray_cast(Vector(origin), Vector(direction).normalized(), 20.0)
        return loc, nor

    def stick(name, size, mat, origin, direction, embed=0.6, offset=(0, 0, 0)):
        loc, nor = hit(origin, direction)
        if loc is None:
            return None
        rot = aligned_rot(nor)
        p = loc - nor * (size[1] * embed) + Vector(offset)
        o = box(name, size, mat, loc=p, rot=rot, bevel=min(size) * 0.3)
        parts.append(o)
        return o

    tf = 0.965
    zb_f, zt_f = shape.bottom(tf), shape.belt(tf)
    zb_r, zt_r = shape.bottom(0.03), shape.belt(0.03)
    front = (0, L, 0)
    back = (0, -L, 0)
    dirF = (0, -1, 0)
    dirB = (0, 1, 0)

    # --- Phares ---
    zl = zb_f + 0.74 * (zt_f - zb_f)
    xl = W / 2 - 0.36
    for s in (-1, 1):
        stick("hl", (0.42, 0.12, 0.07), mats["headlight"], (s * xl, L, zl), dirF, embed=0.4)
        stick("hlh", (0.48, 0.12, 0.12), mats["trim"], (s * xl, L, zl - 0.012), dirF, embed=0.62)
        if spec.get("fangs"):
            for q in range(3):
                stick("fang", (0.035, 0.08, 0.13), mats["headlight"],
                      (s * (xl + 0.06 - q * 0.05), L, zl - 0.17 - q * 0.02), dirF, embed=0.5)

    # --- Calandre ---
    zg = zb_f + 0.42 * (zt_f - zb_f)
    g = spec.get("grille", "wide")
    if g == "kidney":
        for s in (-1, 1):
            stick("grille", (0.24, 0.10, 0.20), mats["chrome"], (s * 0.15, L, zg + 0.05), dirF, embed=0.7)
            stick("grille", (0.20, 0.10, 0.16), mats["trim"], (s * 0.15, L, zg + 0.05), dirF, embed=0.55)
    elif g == "wide":
        stick("grille", (W * 0.52, 0.10, 0.17), mats["trim"], (0, L, zg + 0.04), dirF, embed=0.6)
    elif g == "star":
        stick("grille", (0.62, 0.10, 0.24), mats["trim"], (0, L, zg + 0.04), dirF, embed=0.6)
        stick("logo", (0.13, 0.10, 0.13), mats["chrome"], (0, L, zg + 0.05), dirF, embed=0.35)
    elif g == "mesh":
        stick("grille", (W * 0.60, 0.10, 0.22), mats["trim"], (0, L, zg), dirF, embed=0.6)
    elif g == "slim":
        stick("grille", (W * 0.40, 0.10, 0.06), mats["trim"], (0, L, zg + 0.08), dirF, embed=0.6)
    # prise d'air basse + écopes latérales
    stick("intake", (W * 0.55, 0.10, 0.10), mats["trim"], (0, L, zb_f + 0.12), dirF, embed=0.6)
    for s in (-1, 1):
        stick("sideintake", (0.24, 0.10, 0.12), mats["trim"], (s * (W / 2 - 0.30), L, zb_f + 0.15), dirF, embed=0.6)
    if spec.get("body") != "supercar":
        stick("plate_f", (0.50, 0.08, 0.11), mats["plate"], (0, L, zb_f + 0.25), dirF, embed=0.45)

    # --- Feux arrière ---
    ztl = zb_r + 0.80 * (zt_r - zb_r)
    if spec.get("tail") == "bar":
        stick("tl", (W * 0.86, 0.10, 0.045), mats["taillight"], (0, -L, ztl), dirB, embed=0.5)
    for s in (-1, 1):
        stick("tl", (0.36, 0.10, 0.09), mats["taillight"], (s * (W / 2 - 0.26), -L, ztl), dirB, embed=0.5)
    stick("plate_r", (0.50, 0.08, 0.11), mats["plate"], (0, -L, zb_r + 0.40 * (zt_r - zb_r)), dirB, embed=0.45)
    stick("diffuser", (W * 0.62, 0.12, 0.14), mats["trim"], (0, -L, zb_r + 0.06), dirB, embed=0.6)

    # --- Échappements ---
    ex = spec.get("exhaust", 2)
    xs = []
    if ex == 1:
        xs = [W / 2 - 0.40]
    elif ex == 2:
        xs = [-(W / 2 - 0.40), W / 2 - 0.40]
    elif ex == 4:
        xs = [-(W / 2 - 0.34), -(W / 2 - 0.47), W / 2 - 0.47, W / 2 - 0.34]
    for x in xs:
        loc, nor = hit((x, -L, zb_r + 0.07), dirB)
        if loc is not None:
            o = cylinder("exhaust", 0.045, 0.22, mats["chrome"], loc=(x, loc.y + 0.06, zb_r + 0.07), axis="Y", verts=16)
            parts.append(o)
            inner = cylinder("exhaust_in", 0.033, 0.23, mats["arch"], loc=(x, loc.y + 0.055, zb_r + 0.07), axis="Y", verts=16)
            parts.append(inner)

    # --- Rétroviseurs ---
    rw, rr, rf, ws = shape.prof["cabin"]
    ym = shape.y_of(ws - 0.035)
    zm = shape.belt(ws - 0.035) + 0.07
    for s in (-1, 1):
        loc, nor = hit((s * W, ym, zm), (-s, 0, 0))
        if loc is not None:
            o = box("mirror", (0.16, 0.09, 0.10), mats["paint"], loc=(loc.x + s * 0.09, ym, zm), bevel=0.025)
            parts.append(o)
            parts.append(box("mirror_glass", (0.02, 0.07, 0.08), mats["chrome"], loc=(loc.x + s * 0.09, ym - 0.046, zm)))

    # --- Étriers de frein (fixes, sur la caisse) ---
    for y in (shape.y_front_axle, shape.y_rear_axle):
        for s in (-1, 1):
            parts.append(box("caliper", (0.07, 0.14, 0.10), mats["caliper"],
                             loc=(s * (W / 2 - 0.20), y - shape.wr * 0.30, shape.wr + shape.wr * 0.38), bevel=0.02))

    # --- Écopes latérales des sportives à moteur central ---
    if spec.get("body") == "supercar":
        ys = shape.y_rear_axle + shape.wr + 0.35
        ts = shape.t_of(ys)
        zs = shape.bottom(ts) + 0.55 * (shape.belt(ts) - shape.bottom(ts))
        for s in (-1, 1):
            stick("scoop", (0.10, 0.45, 0.20), mats["trim"], (s * W, ys, zs), (-s, 0, 0), embed=0.5)

    # --- Aileron ---
    sp = spec.get("spoiler", "none")
    t_sp = 0.045 if spec.get("body") != "supercar" else 0.085
    y_sp = shape.y_of(t_sp)
    loc, nor = hit((0, y_sp, H + 2.0), (0, 0, -1))
    if loc is not None and sp != "none":
        zdeck = loc.z
        if sp == "lip":
            parts.append(box("lip", (W * 0.70, 0.12, 0.035), mats["trim"], loc=(0, y_sp, zdeck + 0.005), bevel=0.01))
        else:
            hgt = 0.18 if sp == "wing" else 0.30
            wid = W * (0.82 if sp == "wing" else 0.96)
            rot = Matrix.Rotation(math.radians(-8), 3, "X")
            parts.append(box("wing", (wid, 0.30, 0.03), mats["trim"], loc=(0, y_sp - 0.04, zdeck + hgt), rot=rot, bevel=0.01))
            for s in (-1, 1):
                parts.append(box("wing_post", (0.03, 0.10, hgt), mats["trim"], loc=(s * wid * 0.30, y_sp, zdeck + hgt * 0.5)))
                if sp == "big":
                    parts.append(box("endplate", (0.02, 0.38, 0.16), mats["trim"], loc=(s * wid / 2, y_sp - 0.04, zdeck + hgt)))

    # --- Habitacle (visible à travers les vitres teintées) : volume qui suit le pavillon ---
    bm = bmesh.new()
    rings = []
    m = 16
    for i in range(m + 1):
        t = (rw + 0.005) + (ws - rw - 0.01) * i / m
        y = shape.y_of(t)
        zb = shape.belt(t) - 0.35
        zt = max(shape.belt(t) - 0.05, shape.top(t) - 0.11)
        hw = shape.half_width(t) * shape.prof["roof_w"] * 0.97
        rings.append([bm.verts.new(p) for p in ((-hw, y, zb), (hw, y, zb), (hw * 0.92, y, zt), (-hw * 0.92, y, zt))])
    for i in range(m):
        for j in range(4):
            bm.faces.new((rings[i][j], rings[i][(j + 1) % 4], rings[i + 1][(j + 1) % 4], rings[i + 1][j]))
    bm.faces.new(list(reversed(rings[0])))
    bm.faces.new(rings[-1])
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    parts.append(mesh_object("interior", bm, [mats["interior"]]))

    # --- Taxi ---
    if spec.get("taxi"):
        loc, nor = hit((0, shape.y_of((rr + rf) / 2), H + 2), (0, 0, -1))
        if loc is not None:
            parts.append(box("taxi_sign", (0.55, 0.22, 0.16), mats["taxi"], loc=(0, loc.y, loc.z + 0.07), bevel=0.02))

    return parts


# ---------------------------------------------------------------------------
# Roues
# ---------------------------------------------------------------------------
def build_wheel(name, shape, center, side, mats):
    spec = shape.spec
    r = shape.wr
    w = 0.25 if r < 0.45 else 0.32
    ri = r * 0.70
    parts = []

    # pneu : profil arrondi en révolution
    bm = bmesh.new()
    prof = [(-w / 2, ri * 0.98), (-w / 2, r - 0.045), (-w / 2 + 0.02, r - 0.012), (-w / 2 + 0.06, r),
            (w / 2 - 0.06, r), (w / 2 - 0.02, r - 0.012), (w / 2, r - 0.045), (w / 2, ri * 0.98)]
    verts = [bm.verts.new((x, 0.0, z)) for x, z in prof]
    edges = [bm.edges.new((verts[i], verts[i + 1])) for i in range(len(verts) - 1)]
    bmesh.ops.spin(bm, geom=verts + edges, cent=(0, 0, 0), axis=(1, 0, 0), angle=2 * math.pi, steps=40)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    tire = mesh_object(name + "_tire", bm, [mats["tire"]])
    shade_smooth(tire, 50)
    parts.append(tire)

    xo = side * (w / 2 - 0.035)  # face extérieure de la jante
    # fond de jante (sombre) et disque de frein
    parts.append(cylinder("barrel", ri * 0.99, w * 0.85, mats["rim_inner"], loc=(0, 0, 0), axis="X", verts=32))
    parts.append(cylinder("disc", ri * 0.80, 0.03, mats["disc"], loc=(side * -0.01, 0, 0), axis="X", verts=32))
    # lèvre de jante
    lip = cylinder("lip", ri, 0.03, mats["rim"], loc=(xo, 0, 0), axis="X", verts=36)
    parts.append(lip)
    parts.append(cylinder("lip_hole", ri * 0.90, 0.032, mats["rim_inner"], loc=(xo + side * 0.001, 0, 0), axis="X", verts=36))
    # moyeu
    parts.append(cylinder("hub", ri * 0.22, 0.06, mats["rim"], loc=(xo + side * 0.005, 0, 0), axis="X", verts=20))
    parts.append(cylinder("cap", ri * 0.10, 0.065, mats["chrome"], loc=(xo + side * 0.008, 0, 0), axis="X", verts=16))

    style = spec.get("rim", "y5")
    spokes = []
    if style == "y5":
        for i in range(5):
            a = i * 2 * math.pi / 5
            for d in (-0.13, 0.13):
                spokes.append((a + d, 0.045, 0.0))
    elif style == "multi":
        for i in range(10):
            spokes.append((i * 2 * math.pi / 10, 0.030, 0.0))
    elif style == "turbine":
        for i in range(14):
            spokes.append((i * 2 * math.pi / 14, 0.035, 0.45))
    elif style == "star":
        for i in range(6):
            spokes.append((i * 2 * math.pi / 6, 0.070, 0.0))
    for a, thick, twist in spokes:
        length = ri * 0.72
        rot = Matrix.Rotation(a, 3, "X") @ Matrix.Rotation(twist, 3, "Z")
        mid = Matrix.Rotation(a, 3, "X") @ Vector((0, 0, ri * 0.22 + length / 2))
        o = box("spoke", (0.035, thick, length), mats["rim"], loc=(xo + mid.x, mid.y, mid.z), rot=rot)
        parts.append(o)

    wheel = join(parts, name)
    apply_transforms(wheel)
    wheel.location = center
    return wheel


# ---------------------------------------------------------------------------
# Voiture complète
# ---------------------------------------------------------------------------
def make_materials(spec):
    paint = hex_color(spec["color"])
    m = {
        "paint": new_mat("Paint", paint, metallic=0.55, rough=0.28, coat=1.0),
        "glass": new_mat("Glass", (0.01, 0.012, 0.016), metallic=0.0, rough=0.04, alpha=0.86),
        "trim": new_mat("Trim", (0.012, 0.012, 0.014), metallic=0.1, rough=0.35),
        "roof": new_mat("RoofBlack", (0.008, 0.008, 0.009), metallic=0.2, rough=0.25),
        "arch": new_mat("ArchInner", (0.006, 0.006, 0.006), rough=0.9),
        "chrome": new_mat("Chrome", (0.9, 0.9, 0.92), metallic=1.0, rough=0.08),
        "headlight": new_mat("Headlight", (0.9, 0.95, 1.0), emission=(0.85, 0.92, 1.0), strength=6.0, rough=0.1),
        "taillight": new_mat("Taillight", (0.35, 0.0, 0.0), emission=(1.0, 0.02, 0.02), strength=4.0, rough=0.15),
        "plate": new_mat("Plate", (0.85, 0.85, 0.85), rough=0.4),
        "interior": new_mat("Interior", (0.015, 0.015, 0.018), rough=0.8),
        "tire": new_mat("Tire", (0.018, 0.018, 0.02), rough=0.92),
        "rim": new_mat("Rim", hex_color(spec.get("rim_color", "#c0c0c0")), metallic=0.9, rough=0.28),
        "rim_inner": new_mat("RimInner", (0.03, 0.03, 0.035), metallic=0.6, rough=0.5),
        "disc": new_mat("BrakeDisc", (0.35, 0.35, 0.36), metallic=1.0, rough=0.35),
        "caliper": new_mat("Caliper", hex_color(spec.get("caliper", "#888888")), metallic=0.2, rough=0.35),
        "taxi": new_mat("TaxiSign", (1.0, 0.8, 0.1), emission=(1.0, 0.85, 0.2), strength=2.0),
    }
    return m


def build_car(spec):
    reset_scene()
    shape = Shape(spec)
    mats = make_materials(spec)
    body = build_body(shape, mats)
    details = build_details(shape, body, mats)
    body = join([body] + details, "Body")
    shade_smooth(body, 35)
    wheels = []
    x = shape.W / 2 - 0.16
    for nm, y, s in (("Wheel_FL", shape.y_front_axle, -1), ("Wheel_FR", shape.y_front_axle, 1),
                     ("Wheel_RL", shape.y_rear_axle, -1), ("Wheel_RR", shape.y_rear_axle, 1)):
        wheels.append(build_wheel(nm, shape, (s * x, y, shape.wr), s, mats))
    return body, wheels


def export_glb(objs, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    for o in bpy.context.scene.objects:
        o.select_set(False)
    for o in objs:
        o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=path, export_format="GLB", use_selection=True,
                              export_apply=True, export_yup=True, export_materials="EXPORT")


# ---------------------------------------------------------------------------
# Studio de rendu (vignettes)
# ---------------------------------------------------------------------------
def setup_studio(spec, res=(640, 360), samples=40, hero=False, rear=False):
    scn = bpy.context.scene
    scn.render.engine = "CYCLES"
    scn.cycles.device = "CPU"
    scn.cycles.samples = samples
    scn.cycles.use_denoising = True
    scn.render.resolution_x, scn.render.resolution_y = res
    scn.render.resolution_percentage = 100
    scn.render.film_transparent = False
    try:
        scn.view_settings.view_transform = "AgX"
        scn.view_settings.look = "AgX - Punchy"
    except Exception:
        pass

    world = bpy.data.worlds.new("World")
    scn.world = world
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs["Color"].default_value = (0.035, 0.008, 0.07, 1.0)
    bg.inputs["Strength"].default_value = 1.0

    L = spec["L"]
    # sol brillant
    floor_mat = new_mat("Floor", (0.02, 0.012, 0.03), metallic=0.0, rough=0.18)
    bpy.ops.mesh.primitive_plane_add(size=80, location=(0, 0, 0))
    bpy.context.object.data.materials.append(floor_mat)
    # mur néon en fond
    wall_mat = new_mat("Wall", (0.05, 0.01, 0.09), emission=(0.45, 0.06, 0.85), strength=0.9)
    bpy.ops.mesh.primitive_plane_add(size=1, location=(6, -7, 4), rotation=(math.radians(90), 0, math.radians(40)))
    w = bpy.context.object
    w.scale = (40, 9, 1)
    w.data.materials.append(wall_mat)
    for i, x in enumerate((-4, 0, 4, 8)):
        neon = new_mat("Neon%d" % i, (1, 0.2, 0.9), emission=(1.0, 0.25 + 0.1 * i, 0.95), strength=12.0)
        bpy.ops.mesh.primitive_cube_add(size=1, location=(x - 2, -6 + x * 0.3, 0.05))
        n = bpy.context.object
        n.scale = (0.05, 9, 0.02)
        n.rotation_euler = (0, 0, math.radians(40))
        n.data.materials.append(neon)

    def area(name, loc, rot, energy, color, size):
        ld = bpy.data.lights.new(name, "AREA")
        ld.energy = energy
        ld.color = color
        ld.size = size
        o = bpy.data.objects.new(name, ld)
        o.location = loc
        o.rotation_euler = rot
        link(o)

    area("key", (-3.5, 4.5, 5.5), (math.radians(45), 0, math.radians(-145)), 1400, (1, 0.97, 1), 4)
    area("rim", (4, -5, 3), (math.radians(65), 0, math.radians(40)), 1800, (0.85, 0.2, 1.0), 5)
    area("fill", (5, 4, 2), (math.radians(70), 0, math.radians(130)), 500, (0.3, 0.55, 1.0), 4)
    area("top", (0, 0, 6), (0, 0, 0), 600, (1, 1, 1), 6)

    cam_d = bpy.data.cameras.new("cam")
    cam_d.lens = 42 if not hero else 38
    cam = bpy.data.objects.new("cam", cam_d)
    link(cam)
    scn.camera = cam
    cam.location = (-L * 0.85, L * 0.95, 1.05 + spec["H"] * 0.25)
    target = Vector((0.15, L * 0.06, spec["H"] * 0.42))
    if rear:
        cam.location = (L * 0.7, -L * 1.05, 1.6)
        target = Vector((0, 0, spec["H"] * 0.4))
    d = target - cam.location
    cam.rotation_euler = d.to_track_quat("-Z", "Y").to_euler()


def render(path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)


# ---------------------------------------------------------------------------
def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    only = None
    thumbs = "--no-thumbs" not in argv
    showcase = "--showcase" in argv
    if "--only" in argv:
        only = set(argv[argv.index("--only") + 1].split(","))
    with open(DATA, "r", encoding="utf-8") as f:
        data = json.load(f)
    specs = list(data["cars"]) + list(data["traffic"])
    for spec in specs:
        if only and spec["id"] not in only:
            continue
        print("==> build", spec["id"])
        body, wheels = build_car(spec)
        sub = "traffic" if spec["id"].startswith("traffic_") else ""
        out = os.path.join(OUT_CARS, sub, spec["id"] + ".glb") if sub else os.path.join(OUT_CARS, spec["id"] + ".glb")
        export_glb([body] + wheels, out)
        if showcase and spec.get("free"):
            setup_studio(spec, res=(1280, 720), samples=96, hero=True)
            render(os.path.join(OUT_SHOWCASE, spec["id"] + ".png"))
        elif "--rear" in argv:
            setup_studio(spec, rear=True)
            render(os.path.join("/tmp", "rear_" + spec["id"] + ".png"))
        elif thumbs and not sub:
            setup_studio(spec)
            render(os.path.join(OUT_THUMBS, spec["id"] + ".png"))
    print("OK")


if __name__ == "__main__":
    main()
