# -*- coding: utf-8 -*-
"""
Générateur paramétrique de voitures pour Blender (4.5 LTS).

Chaque voiture est construite à partir d'un dictionnaire de paramètres :
  - carrosserie "loftée" (sections transversales le long de la longueur),
  - habitacle intégré (pare-brise, vitres latérales, lunette arrière, montants),
  - passages de roues découpés par booléen + coques noires,
  - phares / feux / calandre / prises d'air projetés sur la carrosserie (décalques),
  - rétroviseurs, aileron, échappements, barres de toit...
  - 4 roues séparées (Wheel_FL, Wheel_FR, Wheel_RL, Wheel_RR) pour Godot.

Repère Blender : X = droite, Y = avant, Z = haut.  (glTF -> Godot : avant = -Z)
"""
import bpy
import bmesh
import math
from bisect import bisect_right
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

# ---------------------------------------------------------------------------
# Outils
# ---------------------------------------------------------------------------

def pchip(points):
    """Interpolation cubique monotone (sans dépassement) sur une liste (x, y)."""
    xs = [p[0] for p in points]
    ys = [p[1] for p in points]
    n = len(xs)
    if n == 1:
        return lambda x: ys[0]
    h = [xs[i + 1] - xs[i] for i in range(n - 1)]
    d = [(ys[i + 1] - ys[i]) / h[i] for i in range(n - 1)]
    m = [0.0] * n
    m[0] = d[0]
    m[-1] = d[-1]
    for i in range(1, n - 1):
        if d[i - 1] * d[i] <= 0:
            m[i] = 0.0
        else:
            w1 = 2 * h[i] + h[i - 1]
            w2 = h[i] + 2 * h[i - 1]
            m[i] = (w1 + w2) / (w1 / d[i - 1] + w2 / d[i])

    def f(x):
        if x <= xs[0]:
            return ys[0]
        if x >= xs[-1]:
            return ys[-1]
        i = bisect_right(xs, x) - 1
        i = min(max(i, 0), n - 2)
        t = (x - xs[i]) / h[i]
        t2 = t * t
        t3 = t2 * t
        return ((2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h[i] * m[i]
                + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h[i] * m[i + 1])
    return f


def lerp(a, b, t):
    return a + (b - a) * t


def clamp01(x):
    return 0.0 if x < 0.0 else (1.0 if x > 1.0 else x)


def smoothstep(a, b, x):
    t = clamp01((x - a) / (b - a)) if b != a else 0.0
    return t * t * (3 - 2 * t)


def link(obj):
    bpy.context.scene.collection.objects.link(obj)
    return obj


def bake_modifiers(obj):
    """Applique tous les modificateurs via le depsgraph (sans opérateurs)."""
    dg = bpy.context.evaluated_depsgraph_get()
    ev = obj.evaluated_get(dg)
    me = bpy.data.meshes.new_from_object(ev, preserve_all_data_layers=True, depsgraph=dg)
    old = obj.data
    obj.modifiers.clear()
    obj.data = me
    bpy.data.meshes.remove(old)


def clear_scene():
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.cameras,
                 bpy.data.lights, bpy.data.curves):
        for item in list(coll):
            if item.users == 0:
                coll.remove(item)


# ---------------------------------------------------------------------------
# Matériaux (les noms sont reconnus et remplacés côté Godot)
# ---------------------------------------------------------------------------

MAT_DEFS = {
    # nom: (couleur, metallic, roughness, emission, emission_strength, coat)
    "Paint":     ((0.1, 0.2, 0.8), 0.6, 0.25, None, 0.0, 1.0),
    "Glass":     ((0.02, 0.025, 0.03), 0.2, 0.05, None, 0.0, 1.0),
    "Trim":      ((0.015, 0.015, 0.017), 0.0, 0.35, None, 0.0, 0.3),
    "Under":     ((0.01, 0.01, 0.01), 0.0, 0.8, None, 0.0, 0.0),
    "Chrome":    ((0.9, 0.9, 0.92), 1.0, 0.08, None, 0.0, 0.0),
    "Headlight": ((0.9, 0.95, 1.0), 0.0, 0.1, (0.85, 0.92, 1.0), 6.0, 0.0),
    "Taillight": ((0.6, 0.0, 0.0), 0.0, 0.1, (1.0, 0.02, 0.02), 5.0, 0.0),
    "Grille":    ((0.02, 0.02, 0.022), 0.4, 0.4, None, 0.0, 0.0),
    "Plate":     ((0.92, 0.92, 0.9), 0.0, 0.4, None, 0.0, 0.0),
    "Carbon":    ((0.03, 0.03, 0.035), 0.3, 0.2, None, 0.0, 1.0),
    "Roof":      ((0.01, 0.01, 0.012), 0.2, 0.15, None, 0.0, 1.0),
    "Tire":      ((0.025, 0.025, 0.025), 0.0, 0.85, None, 0.0, 0.0),
    "Rim":       ((0.75, 0.76, 0.78), 1.0, 0.22, None, 0.0, 0.0),
    "Caliper":   ((0.8, 0.05, 0.05), 0.0, 0.3, None, 0.0, 0.5),
    "Disc":      ((0.25, 0.25, 0.26), 1.0, 0.4, None, 0.0, 0.0),
    "Signal":    ((1.0, 0.45, 0.0), 0.0, 0.2, (1.0, 0.4, 0.0), 3.0, 0.0),
    "Stripe":    ((0.95, 0.95, 0.95), 0.3, 0.25, None, 0.0, 1.0),
}


def get_mat(name, color=None):
    key = name if color is None else name
    mat = bpy.data.materials.get(key)
    if mat is None:
        base = name.split(".")[0]
        col, met, rough, emi, emis, coat = MAT_DEFS.get(base, MAT_DEFS["Trim"])
        if color is not None:
            col = color
        mat = bpy.data.materials.new(key)
        mat.use_nodes = True
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        bsdf.inputs["Base Color"].default_value = (col[0], col[1], col[2], 1.0)
        bsdf.inputs["Metallic"].default_value = met
        bsdf.inputs["Roughness"].default_value = rough
        try:
            bsdf.inputs["Coat Weight"].default_value = coat
            bsdf.inputs["Coat Roughness"].default_value = 0.03
        except KeyError:
            pass
        if emi is not None:
            bsdf.inputs["Emission Color"].default_value = (emi[0], emi[1], emi[2], 1.0)
            bsdf.inputs["Emission Strength"].default_value = emis
        mat.diffuse_color = (col[0], col[1], col[2], 1.0)
    elif color is not None:
        bsdf = mat.node_tree.nodes.get("Principled BSDF")
        bsdf.inputs["Base Color"].default_value = (color[0], color[1], color[2], 1.0)
    return mat


class MatSlots:
    """Gère les index de matériaux d'un objet."""

    def __init__(self, me):
        self.me = me
        self.index = {}

    def idx(self, name):
        if name not in self.index:
            self.me.materials.append(get_mat(name))
            self.index[name] = len(self.me.materials) - 1
        return self.index[name]


# ---------------------------------------------------------------------------
# Carrosserie
# ---------------------------------------------------------------------------

# Indices des points de section (côté droit, x >= 0) :
# 0 dessous-centre, 1 dessous-bord, 2 bas de caisse, 3 largeur max, 4 épaule,
# 5 ligne de caisse, 6 bas de vitre, 7 haut de vitre (bas du montant),
# 8 bord de toit, 9 centre du toit
NPTS = 10


class BodyProfile:
    def __init__(self, S):
        self.S = S
        self.L = S["L"]
        self.hw = S["W"] / 2.0
        self.H = S["H"]
        self.zb = pchip(S["zb"])
        self.zt = pchip(S["zt"])
        self.wf = pchip(S["w"])
        self.c0, self.c1, self.c2, self.c3 = S["cabin"]
        self.tumble = S.get("tumble", 0.74)
        self.cab_base = S.get("cab_base", 0.90)
        self.roof_arc = S.get("roof_arc", 0.03)
        self.ws_curve = S.get("ws_curve", 0.8)
        self.rw_curve = S.get("rw_curve", 0.85)
        self.crown = S.get("crown", 0.05)
        self.sill = S.get("sill", 0.02)
        self.maxw_h = S.get("maxw_h", 0.42)
        self.flare = S.get("flare", 0.02)
        self.shoulder_in = S.get("shoulder_in", 0.965)
        self.belt_in = S.get("belt_in", 0.90)
        self.axles = S["_axles_t"]
        self.roof_w_ends = S.get("roof_w_ends", 0.86)
        self.axles_y = S["_axles_y"]
        self.arch_r = S["wr"] + S.get("arch_gap", 0.05)
        self.arch_zc = S["wr"] + S.get("ride", 0.0)

    def fender_z(self, t):
        """Hauteur minimale de l'aile pour couvrir la roue (0 si pas nécessaire)."""
        y = (t - 0.5) * self.L
        best = 0.0
        r = self.arch_r + 0.05
        for ya in self.axles_y:
            dy = abs(y - ya)
            ext = r + 0.30
            if dy < ext:
                if dy < r:
                    z = self.arch_zc + math.sqrt(r * r - dy * dy) + 0.07
                else:
                    z = self.arch_zc + 0.035
                # adoucissement en bord
                k = 1.0 - smoothstep(r * 0.75, ext, dy)
                best = max(best, z * k + (1 - k) * 0.0)
        return best

    def zroof(self, t):
        c1, c2 = self.c1, self.c2
        tm = (c1 + c2) / 2
        half = max((c2 - c1) / 2, 1e-3)
        u = (t - tm) / half
        return self.H - self.roof_arc * u * u

    def section(self, t):
        """Retourne la liste des points (x, z) du côté droit pour la station t."""
        hw = self.hw * self.wf(t)
        zb = self.zb(t)
        zt = self.zt(t)
        hgt = max(zt - zb, 0.05)
        flare = 0.0
        for ta in self.axles:
            flare += self.flare * math.exp(-((t - ta) / 0.075) ** 2)
        pts = [None] * NPTS
        pts[0] = (0.0, zb)
        pts[1] = (hw * 0.86, zb)
        pts[2] = (hw * 0.975 + flare * 0.5, zb + 0.14 * hgt)
        pts[3] = (hw + flare, zb + self.maxw_h * hgt)
        pts[4] = (hw * self.shoulder_in + flare * 0.6, zb + 0.82 * hgt)
        pts[5] = (hw * self.belt_in, zt)

        # Positions "écrasées" (capot / coffre) hors habitacle
        crown = self.crown
        col6 = (hw * 0.80, zt + crown * 0.45)
        col8 = (hw * 0.45, zt + crown * 0.92)
        col9 = (0.0, zt + crown)

        c0, c1, c2, c3 = self.c0, self.c1, self.c2, self.c3
        if t <= c0 or t >= c3:
            p6, p8, p9 = col6, col8, col9
        else:
            # facteur f : 0 à la base du pare-brise / lunette, 1 sur le toit
            if t >= c2:
                f = (c3 - t) / max(c3 - c2, 1e-4)
                g = f ** self.ws_curve
                tr = c2
            elif t <= c1:
                f = (t - c0) / max(c1 - c0, 1e-4)
                g = f ** self.rw_curve
                tr = c1
            else:
                f = 1.0
                g = 1.0
                tr = t
            # largeurs de l'habitacle
            wcb = hw * self.cab_base
            end_narrow = lerp(self.roof_w_ends, 1.0, smoothstep(0.0, 1.0, f))
            wct = self.hw * self.wf(tr) * self.tumble * end_narrow
            k = clamp01(f * 5.0)
            p6 = (lerp(col6[0], wcb, k), lerp(col6[1], zt + self.sill, k))
            zr = self.zroof(tr) if f >= 1.0 else self.zroof(tr)
            z_edge = zr - 0.035
            p8 = (lerp(col8[0], wct, clamp01(f * 2.5)), lerp(col8[1], z_edge, g))
            p9 = (0.0, lerp(col9[1], zr, g))
        # point 7 : un peu sous le bord de toit (montant)
        p7 = (p8[0] + (p6[0] - p8[0]) * 0.14, p8[1] - (p8[1] - p6[1]) * 0.14)
        # ailes bombées au-dessus des roues (voitures basses)
        fz = self.fender_z(t)
        if fz > 0.0:
            def up(p, z):
                return (p[0], max(p[1], z))
            k4 = fz
            if pts[4][1] < k4:
                pts[4] = up(pts[4], k4)
                pts[5] = up(pts[5], k4 + 0.01)
                p6 = up(p6, k4 - 0.005)
                if p8[1] < k4:
                    p8 = (p8[0], lerp(p8[1], k4, 0.35))
                p7 = (p8[0] + (p6[0] - p8[0]) * 0.14, p8[1] - (p8[1] - p6[1]) * 0.14)
        pts[6] = p6
        pts[7] = p7
        pts[8] = p8
        pts[9] = p9
        return pts


def build_body(S):
    prof = BodyProfile(S)
    L = S["L"]
    nst = S.get("stations", 52)
    # stations : légèrement resserrées aux extrémités
    ts = []
    for i in range(nst):
        u = i / (nst - 1)
        t = 0.5 - 0.5 * math.cos(math.pi * u)
        t = lerp(u, t, 0.45)
        ts.append(t)
    # insérer les limites importantes pour des bords de vitres nets
    c0, c1, c2, c3 = prof.c0, prof.c1, prof.c2, prof.c3
    extra = [c0 + 0.004, c1, c2, c3 - 0.004]
    extra += S.get("_extra_t", [])
    for e in extra:
        if 0.01 < e < 0.99:
            ts.append(e)
    ts = sorted(set(round(t, 5) for t in ts))
    # retirer les stations trop proches
    clean = [ts[0]]
    for t in ts[1:]:
        if t - clean[-1] > 0.004:
            clean.append(t)
    ts = clean

    me = bpy.data.meshes.new(S["id"] + "_body")
    obj = link(bpy.data.objects.new("Body", me))
    slots = MatSlots(me)
    bm = bmesh.new()
    crease = bm.edges.layers.float.new("crease_edge")

    rings = []
    for t in ts:
        y = (t - 0.5) * L
        pts = prof.section(t)
        ring = []
        # côté droit de bas en haut (0..9) puis côté gauche de haut en bas (8..1)
        order = list(range(NPTS)) + list(range(NPTS - 2, 0, -1))
        for j, pi in enumerate(order):
            x, z = pts[pi]
            if j >= NPTS:
                x = -x
            ring.append(bm.verts.new((x, y, z)))
        rings.append(ring)
    bm.verts.ensure_lookup_table()

    nring = len(rings[0])
    order = list(range(NPTS)) + list(range(NPTS - 2, 0, -1))

    def strip_of(j):
        # bande entre point order[j] et order[j+1]
        a = order[j]
        b = order[(j + 1) % nring]
        return min(a, b)

    side_glass_t0 = S.get("side_glass_t0", c0 + (c1 - c0) * 0.45)
    side_glass_t1 = S.get("side_glass_t1", c2 + (c3 - c2) * 0.70)
    bpillars = S.get("bpillar", [])
    roof_mat = "Roof" if S.get("black_roof") else "Paint"
    pillar_mat = S.get("pillar_mat", "Paint")
    lower_mat = S.get("lower_mat", "Paint")    # "Trim" pour bas de caisse noir (SUV)
    rear_glass = S.get("rear_glass", True)

    def face_mat(strip, tm, ring_j):
        if strip == 0:
            return "Under"
        if strip == 1:
            # bas de caisse
            if tm < 0.05 or tm > 0.95:
                return S.get("bumper_low_mat", lower_mat)
            return lower_mat
        if strip == 2 and S.get("cladding_arches"):
            for ta in prof.axles:
                if abs(tm - ta) < 0.085:
                    return "Trim"
        if strip in (2, 3, 4, 5):
            return "Paint"
        in_cab = c0 < tm < c3
        if strip == 6:
            if in_cab and side_glass_t0 < tm < side_glass_t1:
                for (b0, b1) in bpillars:
                    if b0 < tm < b1:
                        return "Trim"
                return "Glass"
            return "Paint"
        if strip == 7:
            if in_cab:
                return pillar_mat if not (c1 <= tm <= c2) else roof_mat if roof_mat != "Paint" else "Paint"
            return "Paint"
        if strip == 8:
            if c2 < tm < c3:
                return "Glass"
            if c0 < tm < c1:
                return "Glass" if rear_glass else roof_mat
            if c1 <= tm <= c2:
                return roof_mat
            return "Paint"
        return "Paint"

    for i in range(len(rings) - 1):
        ra, rb = rings[i], rings[i + 1]
        tm = (ts[i] + ts[i + 1]) / 2
        for j in range(nring):
            jn = (j + 1) % nring
            f = bm.faces.new((ra[j], ra[jn], rb[jn], rb[j]))
            f.material_index = slots.idx(face_mat(strip_of(j), tm, j))
    # bouchons avant / arrière
    fr = bm.faces.new(list(reversed(rings[0])))
    fr.material_index = slots.idx("Paint")
    ff = bm.faces.new(rings[-1])
    ff.material_index = slots.idx("Paint")
    bm.normal_update()
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    # plis (creases) : ligne de caisse et bords de vitres
    for e in bm.edges:
        v0, v1 = e.verts
        if abs(v0.co.y - v1.co.y) > 1e-6:
            # arêtes longitudinales: retrouver leur index de point
            pass
    idx_of = {}
    for ring in rings:
        for j, v in enumerate(ring):
            idx_of[v] = order[j]
    belt_crease = S.get("belt_crease", 0.5)
    for e in bm.edges:
        a, b = e.verts
        ia, ib = idx_of.get(a), idx_of.get(b)
        if ia is None or ib is None or ia != ib:
            continue
        if ia == 5:
            e[crease] = belt_crease
        elif ia == 4:
            e[crease] = S.get("shoulder_crease", 0.45)
        elif ia == 3:
            e[crease] = S.get("side_crease", 0.2)
        elif ia in (6, 7, 8):
            e[crease] = 0.75
        elif ia == 1:
            e[crease] = 0.7
        elif ia == 2:
            e[crease] = 0.35
    bm.to_mesh(me)
    bm.free()

    mod = obj.modifiers.new("Subsurf", 'SUBSURF')
    mod.levels = S.get("subsurf", 1)
    mod.render_levels = mod.levels
    bake_modifiers(obj)

    # passages de roues
    cutters = []
    for (y, side) in S["_wheels"]:
        pass
    for y in S["_axles_y"]:
        r = S["wr"] + S.get("arch_gap", 0.05)
        x_in = max(S["track"] - S["ww"] / 2 - 0.13, 0.15)
        x_out = S["W"] / 2 + 0.4
        for sgn in (1, -1):
            bpy.ops.mesh.primitive_cylinder_add(vertices=40, radius=r, depth=x_out - x_in,
                                                location=(sgn * (x_in + x_out) / 2, y, S["wr"] + S.get("ride", 0.0)),
                                                rotation=(0, math.pi / 2, 0))
            c = bpy.context.active_object
            cutters.append(c)
    for c in cutters:
        m = obj.modifiers.new("Arch", 'BOOLEAN')
        m.operation = 'DIFFERENCE'
        m.object = c
        m.solver = 'EXACT'
        bake_modifiers(obj)
    for c in cutters:
        bpy.data.objects.remove(c, do_unlink=True)

    obj.data.shade_smooth()
    try:
        obj.data.set_sharp_from_angle(angle=math.radians(48))
    except Exception:
        pass
    return obj, prof


def add_arch_liners(S, target_bm, slots):
    """Coques noires dans les passages de roues (ne traversent pas le capot)."""
    mi = slots.idx("Under")
    for y in S["_axles_y"]:
        r = S["wr"] + S.get("arch_gap", 0.05) + 0.005
        zc = S["wr"] + S.get("ride", 0.0)
        hw = S["W"] / 2
        seg = 18
        for s in (1, -1):
            x_out = s * (hw - 0.01)
            x_in = s * max(S["track"] - S["ww"] / 2 - 0.10, 0.2)
            arc = []
            for k in range(seg + 1):
                a = math.pi * (k / seg) * 1.15 - math.pi * 0.075
                yy = y + r * math.cos(a)
                zz = zc + r * math.sin(a)
                arc.append((target_bm.verts.new((x_in, yy, zz)), target_bm.verts.new((x_out, yy, zz))))
            for k in range(seg):
                a0, b0 = arc[k]
                a1, b1 = arc[k + 1]
                q = [a0, b0, b1, a1] if s > 0 else [a1, b1, b0, a0]
                f = target_bm.faces.new(q)
                f.material_index = mi
            # paroi intérieure
            c = target_bm.verts.new((x_in, y, zc - 0.05))
            for k in range(seg):
                tri = [c, arc[k + 1][0], arc[k][0]] if s > 0 else [c, arc[k][0], arc[k + 1][0]]
                f = target_bm.faces.new(tri)
                f.material_index = mi


# ---------------------------------------------------------------------------
# Décalques projetés (phares, feux, calandres...)
# ---------------------------------------------------------------------------

class Decaler:
    def __init__(self, body_obj, bm, slots):
        dg = bpy.context.evaluated_depsgraph_get()
        self.bvh = BVHTree.FromObject(body_obj, dg)
        self.bm = bm
        self.slots = slots
        bb = [body_obj.matrix_world @ Vector(c) for c in body_obj.bound_box]
        self.ymax = max(v.y for v in bb) + 1.0
        self.ymin = min(v.y for v in bb) - 1.0
        self.xmax = max(v.x for v in bb) + 1.0
        self.zmax = max(v.z for v in bb) + 1.0

    def cast(self, plane, a, b):
        if plane == "front":
            o = Vector((a, self.ymax, b)); d = Vector((0, -1, 0))
        elif plane == "rear":
            o = Vector((a, self.ymin, b)); d = Vector((0, 1, 0))
        elif plane == "right":
            o = Vector((self.xmax, a, b)); d = Vector((-1, 0, 0))
        elif plane == "left":
            o = Vector((-self.xmax, a, b)); d = Vector((1, 0, 0))
        else:  # top
            o = Vector((a, b, self.zmax)); d = Vector((0, 0, -1))
        hit = self.bvh.ray_cast(o, d, 20.0)
        if hit[0] is None:
            return None, None
        return hit[0], hit[1]

    def strip(self, mat, plane, rect, vfun=None, nu=16, nv=4, offset=0.006, mirror=True,
              inset=0.0):
        """Décalque en bande : pour u dans [0,1], v va de vb(u) à vt(u)."""
        if vfun is None:
            vfun = lambda u: (0.0, 1.0)
        a0, a1, b0, b1 = rect
        sides = [1, -1] if mirror else [1]
        for sgn in sides:
            grid = []
            for i in range(nu + 1):
                u = i / nu
                vb, vt = vfun(u)
                row = []
                for k in range(nv + 1):
                    v = lerp(vb, vt, k / nv)
                    a = lerp(a0, a1, u)
                    b = lerp(b0, b1, v)
                    if plane in ("front", "rear", "top"):
                        a = a * sgn
                    p, n = self.cast(plane if plane not in ("right", "left") else
                                     ("right" if sgn > 0 else "left"), a, b)
                    if p is None:
                        row.append(None)
                    else:
                        row.append(self.bm.verts.new(p + n * offset - n * inset))
                grid.append(row)
            mi = self.slots.idx(mat)
            flip = (sgn < 0)
            if plane in ("rear",):
                flip = not flip
            if plane == "left":
                flip = not flip
            for i in range(nu):
                for k in range(nv):
                    q = [grid[i][k], grid[i + 1][k], grid[i + 1][k + 1], grid[i][k + 1]]
                    if any(v is None for v in q):
                        continue
                    if flip:
                        q = list(reversed(q))
                    try:
                        f = self.bm.faces.new(q)
                        f.material_index = mi
                        f.smooth = True
                    except ValueError:
                        pass


# ---------------------------------------------------------------------------
# Primitives
# ---------------------------------------------------------------------------

def add_box(bm, slots, mat, center, size, rot=None, bevel=0.0):
    geom = bmesh.ops.create_cube(bm, size=1.0)
    verts = geom["verts"]
    m = Matrix.Diagonal((size[0], size[1], size[2], 1.0))
    if rot is not None:
        m = rot.to_4x4() @ m
    m = Matrix.Translation(Vector(center)) @ m
    bmesh.ops.transform(bm, matrix=m, verts=verts)
    faces = list({f for v in verts for f in v.link_faces})
    for f in faces:
        f.material_index = slots.idx(mat)
    if bevel > 0:
        edges = list({e for v in verts for e in v.link_edges})
        res = bmesh.ops.bevel(bm, geom=edges, offset=bevel, segments=2, affect='EDGES', profile=0.5)
        for f in res.get("faces", []):
            f.material_index = slots.idx(mat)
    return verts


def add_cylinder(bm, slots, mat, center, radius, depth, axis='Y', segs=16, cap_mat=None):
    geom = bmesh.ops.create_cone(bm, cap_ends=True, cap_tris=False, segments=segs,
                                 radius1=radius, radius2=radius, depth=depth)
    verts = geom["verts"]
    if axis == 'Y':
        r = Matrix.Rotation(math.pi / 2, 4, 'X')
    elif axis == 'X':
        r = Matrix.Rotation(math.pi / 2, 4, 'Y')
    else:
        r = Matrix.Identity(4)
    bmesh.ops.transform(bm, matrix=Matrix.Translation(Vector(center)) @ r, verts=verts)
    faces = list({f for v in verts for f in v.link_faces})
    for f in faces:
        f.material_index = slots.idx(mat)
        if cap_mat and len(f.verts) > 4:
            f.material_index = slots.idx(cap_mat)
    return verts


def add_wing(bm, slots, S, prof):
    w = S.get("wing")
    if not w:
        return
    kind = w.get("kind", "wing")
    L = S["L"]
    t = w.get("t", 0.05)
    y = (t - 0.5) * L
    zt = prof.zt(t)
    mat = w.get("mat", "Carbon")
    span = w.get("span", S["W"] * 0.86)
    if kind == "lip":
        add_box(bm, slots, mat, (0, y, zt + 0.03), (span, 0.12, 0.03),
                rot=Matrix.Rotation(math.radians(-12), 3, 'X'), bevel=0.008)
        return
    hgt = w.get("h", 0.28)
    chord = w.get("chord", 0.32)
    z = zt + hgt
    ang = math.radians(w.get("angle", -8))
    add_box(bm, slots, mat, (0, y, z), (span, chord, 0.035),
            rot=Matrix.Rotation(ang, 3, 'X'), bevel=0.012)
    # dérives latérales
    for s in (1, -1):
        add_box(bm, slots, mat, (s * span / 2, y + 0.02, z - 0.02), (0.015, chord * 1.15, 0.16), bevel=0.004)
    # supports
    px = w.get("posts_x", span * 0.32)
    swan = w.get("swan", False)
    for s in (1, -1):
        if swan:
            add_box(bm, slots, mat, (s * px, y + chord * 0.1, z + 0.02 - hgt / 2), (0.025, 0.12, hgt + 0.06), bevel=0.006)
        else:
            add_box(bm, slots, mat, (s * px, y + chord * 0.1, zt + hgt / 2 - 0.01), (0.03, 0.10, hgt), bevel=0.006)


def add_mirrors(bm, slots, S, prof):
    if not S.get("mirrors", True):
        return
    L = S["L"]
    t = prof.c3 - (prof.c3 - prof.c2) * 0.62
    y = (t - 0.5) * L
    p = prof.section(t)
    x = p[6][0] + 0.12
    z = p[6][1] + 0.10
    mat = S.get("mirror_mat", "Paint")
    for s in (1, -1):
        add_box(bm, slots, mat, (s * x, y - 0.03, z), (0.16, 0.10, 0.10), bevel=0.025)
        add_box(bm, slots, "Trim", (s * (x - 0.09), y - 0.01, z - 0.03), (0.06, 0.05, 0.03), bevel=0.008)


def add_exhausts(bm, slots, S, prof):
    ex = S.get("exhaust", {"n": 2, "x": 0.45, "r": 0.04})
    if not ex or ex.get("n", 0) == 0:
        return
    L = S["L"]
    y = -L / 2 + 0.06
    z = S.get("exhaust_z", prof.zb(0.03) + 0.10)
    r = ex.get("r", 0.04)
    xs = []
    n = ex["n"]
    x0 = ex.get("x", 0.45)
    if n == 1:
        xs = [x0]
    elif n == 2:
        xs = [x0, -x0]
    elif n == 3:
        xs = [0.0, 0.09, -0.09]
    elif n == 4:
        xs = [x0, x0 - 2.3 * r, -x0, -x0 + 2.3 * r]
    for x in xs:
        add_cylinder(bm, slots, "Chrome", (x, y, z), r, 0.22, axis='Y', segs=14, cap_mat="Under")


def add_roof_rails(bm, slots, S, prof):
    if not S.get("roof_rails"):
        return
    L = S["L"]
    for s in (1, -1):
        t0 = prof.c1 - 0.02
        t1 = prof.c2 + 0.02
        n = 8
        prev = None
        for i in range(n + 1):
            t = lerp(t0, t1, i / n)
            p = prof.section(t)
            x = p[8][0] * 0.92
            z = p[9][1] - 0.02 + 0.04
            v = (s * x, (t - 0.5) * L, z)
            if prev is not None:
                c = ((v[0] + prev[0]) / 2, (v[1] + prev[1]) / 2, (v[2] + prev[2]) / 2)
                ln = math.dist(v, prev)
                ang = math.atan2(v[2] - prev[2], v[1] - prev[1])
                add_box(bm, slots, "Trim", c, (0.035, ln + 0.01, 0.04),
                        rot=Matrix.Rotation(ang, 3, 'X'), bevel=0.008)
            prev = v


# ---------------------------------------------------------------------------
# Roues
# ---------------------------------------------------------------------------

def build_wheel(name, S, center, side):
    """side = +1 (droite) / -1 (gauche). La face de la jante regarde vers l'extérieur."""
    me = bpy.data.meshes.new(S["id"] + "_" + name)
    obj = link(bpy.data.objects.new(name, me))
    slots = MatSlots(me)
    bm = bmesh.new()
    R = S["wr"]
    ww = S["ww"]
    hwid = ww / 2
    rr = R * S.get("rim_ratio", 0.70)
    segs = S.get("wheel_segs", 30)

    def revolve(profile, mat, segs, smooth=True):
        rings = []
        for k in range(segs):
            a = 2 * math.pi * k / segs
            ca, sa = math.cos(a), math.sin(a)
            ring = []
            for (r, x) in profile:
                ring.append(bm.verts.new((x * side, r * ca, r * sa)))
            rings.append(ring)
        mi = slots.idx(mat)
        for k in range(segs):
            ra, rb = rings[k], rings[(k + 1) % segs]
            for j in range(len(profile) - 1):
                q = [ra[j], rb[j], rb[j + 1], ra[j + 1]]
                if side < 0:
                    q.reverse()
                f = bm.faces.new(q)
                f.material_index = mi
                f.smooth = smooth

    # pneu
    tire = [(rr * 0.98, hwid * 0.82), (R * 0.90, hwid * 0.98), (R * 0.985, hwid * 0.86), (R, hwid * 0.55),
            (R, -hwid * 0.55), (R * 0.985, -hwid * 0.86), (R * 0.90, -hwid * 0.98), (rr * 0.98, -hwid * 0.82)]
    revolve(tire, "Tire", segs)
    # tonneau de jante (intérieur)
    xf = hwid * 0.80   # plan de la face de jante
    barrel = [(rr, xf + 0.012), (rr * 0.93, xf - 0.005), (rr * 0.93, -hwid * 0.7), (rr, -hwid * 0.78)]
    revolve(list(reversed(barrel)), "Rim", segs)
    # lèvre de jante
    lip = [(rr * 0.99, xf + 0.012), (rr * 0.90, xf + 0.008)]
    revolve(list(reversed(lip)), "Rim", segs)
    # disque de frein + étrier
    add_cylinder_x(bm, slots, "Disc", (side * (xf - 0.085), 0, 0), rr * 0.78, 0.025, 24)
    cal_a = math.radians(S.get("caliper_angle", 35))
    cr = rr * 0.66
    add_box(bm, slots, "Caliper", (side * (xf - 0.06), -cr * math.sin(cal_a) * 1.0, cr * math.cos(cal_a)),
            (0.05, 0.11, 0.075), rot=Matrix.Rotation(cal_a, 3, 'X'), bevel=0.012)
    # fond sombre derrière les branches
    add_cylinder_x(bm, slots, "Under", (side * (xf - 0.11), 0, 0), rr * 0.93, 0.01, 24)
    # moyeu
    hub_r = rr * 0.22
    add_cylinder_x(bm, slots, "Rim", (side * (xf - 0.015), 0, 0), hub_r, 0.05, 16)
    add_cylinder_x(bm, slots, "Chrome", (side * (xf + 0.012), 0, 0), hub_r * 0.45, 0.02, 10)
    # branches
    n = S.get("spokes", 5)
    style = S.get("spoke_style", "split")
    sw = S.get("spoke_w", 0.11) * rr
    mi = slots.idx("Rim")
    variants = [0.0]
    if style == "split":
        variants = [-0.085, 0.085]
    elif style == "mesh":
        variants = [-0.11, 0.0, 0.11]
    for i in range(n):
        base_a = 2 * math.pi * i / n
        for dv in variants:
            a = base_a + dv
            w = sw * (0.6 if style != "solid" else 1.0)
            r0 = hub_r * 0.9
            r1 = rr * 0.93
            # quad en légère concavité (déport)
            pts = []
            for (r, dx) in ((r0, -0.01), (r1, -0.045)):
                for s2 in (-1, 1):
                    aa = a + s2 * (w / max(r, 0.01)) * 0.5
                    pts.append(Vector((side * (xf + dx), r * math.cos(aa), r * math.sin(aa))))
            # face avant + épaisseur
            depth = Vector((-side * 0.03, 0, 0))
            v = [bm.verts.new(p) for p in pts]
            vb = [bm.verts.new(p + depth) for p in pts]
            quads = [(v[0], v[2], v[3], v[1]), (v[0], v[1], vb[1], vb[0]), (v[2], vb[2], vb[3], v[3]),
                     (v[1], v[3], vb[3], vb[1]), (v[0], vb[0], vb[2], v[2])]
            for q in quads:
                q = list(q)
                if side < 0:
                    q.reverse()
                try:
                    f = bm.faces.new(q)
                    f.material_index = mi
                except ValueError:
                    pass
    bmesh.ops.recalc_face_normals(bm, faces=[f for f in bm.faces if f.material_index != slots.idx("Tire")])
    bm.to_mesh(me)
    bm.free()
    me.shade_smooth()
    try:
        me.set_sharp_from_angle(angle=math.radians(40))
    except Exception:
        pass
    obj.location = center
    return obj


def add_cylinder_x(bm, slots, mat, center, radius, depth, segs):
    return add_cylinder(bm, slots, mat, center, radius, depth, axis='X', segs=segs)


# ---------------------------------------------------------------------------
# Assemblage complet
# ---------------------------------------------------------------------------

def prepare_spec(S):
    L = S["L"]
    wb = S["wb"]
    fo = S.get("fo", (L - wb) / 2)
    yf = L / 2 - fo
    yr = yf - wb
    S["_axles_y"] = [yf, yr]
    S["_axles_t"] = [yf / L + 0.5, yr / L + 0.5]
    S["_wheels"] = [(yf, -1), (yf, 1), (yr, -1), (yr, 1)]
    S.setdefault("track", S["W"] / 2 - S["ww"] / 2 - 0.035)
    S.setdefault("ride", 0.0)
    return S


def decorate(body, S, prof):
    """Ajoute décalques & accessoires dans un second objet puis fusionne."""
    me = body.data
    bm = bmesh.new()
    bm.from_mesh(me)
    slots = MatSlots(me)
    for i, m in enumerate(me.materials):
        slots.index[m.name] = i
    dec = Decaler(body, bm, slots)
    L = S["L"]

    for d in S.get("decals", []):
        kind = d[0]
        args = d[1]
        dec.strip(args["mat"], args["plane"], args["rect"], vfun=args.get("v"),
                  nu=args.get("nu", 14), nv=args.get("nv", 3), offset=args.get("off", 0.006),
                  mirror=args.get("mirror", True))

    add_arch_liners(S, bm, slots)
    add_wing(bm, slots, S, prof)
    add_mirrors(bm, slots, S, prof)
    add_exhausts(bm, slots, S, prof)
    add_roof_rails(bm, slots, S, prof)
    for extra in S.get("boxes", []):
        add_box(bm, slots, extra["mat"], extra["c"], extra["s"],
                rot=Matrix.Rotation(math.radians(extra.get("rx", 0)), 3, 'X'), bevel=extra.get("bevel", 0.0))
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    try:
        me.set_sharp_from_angle(angle=math.radians(48))
    except Exception:
        pass


def build_car(S):
    S = prepare_spec(S)
    body, prof = build_body(S)
    decorate(body, S, prof)
    root = link(bpy.data.objects.new(S["id"], None))
    body.parent = root
    wheels = []
    names = {(0, -1): "Wheel_FL", (0, 1): "Wheel_FR", (1, -1): "Wheel_RL", (1, 1): "Wheel_RR"}
    for ai, y in enumerate(S["_axles_y"]):
        for side in (-1, 1):
            c = (side * S["track"], y, S["wr"] + S.get("ride", 0.0))
            w = build_wheel(names[(ai, side)], S, c, side)
            w.parent = root
            wheels.append(w)
    # couleur de peinture pour le rendu
    paint = bpy.data.materials.get("Paint")
    if paint:
        col = S.get("color", (0.1, 0.2, 0.8))
        bsdf = paint.node_tree.nodes.get("Principled BSDF")
        bsdf.inputs["Base Color"].default_value = (col[0], col[1], col[2], 1.0)
        bsdf.inputs["Metallic"].default_value = S.get("metallic", 0.55)
        paint.diffuse_color = (col[0], col[1], col[2], 1.0)
    cal = bpy.data.materials.get("Caliper")
    if cal and "caliper" in S:
        c = S["caliper"]
        cal.node_tree.nodes.get("Principled BSDF").inputs["Base Color"].default_value = (c[0], c[1], c[2], 1)
    rim = bpy.data.materials.get("Rim")
    if rim and "rim_color" in S:
        c = S["rim_color"]
        b = rim.node_tree.nodes.get("Principled BSDF")
        b.inputs["Base Color"].default_value = (c[0], c[1], c[2], 1)
        b.inputs["Metallic"].default_value = S.get("rim_metal", 1.0)
    return root, body, wheels


def export_glb(root, path):
    bpy.ops.object.select_all(action='DESELECT')
    root.select_set(True)
    for c in root.children_recursive:
        c.select_set(True)
    bpy.context.view_layer.objects.active = root
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True,
                              export_apply=True, export_yup=True, export_materials='EXPORT',
                              export_extras=False, export_cameras=False, export_lights=False)


# ---------------------------------------------------------------------------
# Rendu de vignette (Cycles CPU)
# ---------------------------------------------------------------------------

def setup_thumb_scene(res=(640, 360), samples=48):
    sc = bpy.context.scene
    sc.render.engine = 'CYCLES'
    sc.cycles.device = 'CPU'
    sc.cycles.samples = samples
    sc.cycles.use_denoising = True
    try:
        sc.cycles.denoiser = 'OPENIMAGEDENOISE'
    except Exception:
        pass
    sc.render.resolution_x = res[0]
    sc.render.resolution_y = res[1]
    sc.render.resolution_percentage = 100
    sc.render.film_transparent = True
    sc.render.image_settings.file_format = 'PNG'
    sc.render.image_settings.color_mode = 'RGBA'
    sc.view_settings.view_transform = 'AgX'
    sc.view_settings.look = 'AgX - Medium High Contrast'
    world = bpy.data.worlds.get("ThumbWorld") or bpy.data.worlds.new("ThumbWorld")
    sc.world = world
    world.use_nodes = True
    nt = world.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputWorld")
    bg = nt.nodes.new("ShaderNodeBackground")
    grad = nt.nodes.new("ShaderNodeTexGradient")
    coord = nt.nodes.new("ShaderNodeTexCoord")
    mapn = nt.nodes.new("ShaderNodeMapping")
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    nt.links.new(coord.outputs["Generated"], mapn.inputs["Vector"])
    mapn.inputs["Rotation"].default_value = (0, -math.pi / 2, 0)
    nt.links.new(mapn.outputs["Vector"], grad.inputs["Vector"])
    nt.links.new(grad.outputs["Fac"], ramp.inputs["Fac"])
    ramp.color_ramp.elements[0].color = (0.05, 0.02, 0.12, 1)
    ramp.color_ramp.elements[1].color = (0.35, 0.3, 0.45, 1)
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    bg.inputs["Strength"].default_value = 0.55
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])

    def area(name, loc, rot, size, energy, color):
        ld = bpy.data.lights.new(name, 'AREA')
        ld.size = size
        ld.energy = energy
        ld.color = color
        lo = link(bpy.data.objects.new(name, ld))
        lo.location = loc
        lo.rotation_euler = rot
        return lo
    area("Key", (0, -1.5, 6), (math.radians(-15), 0, 0), 8.0, 1000, (1.0, 1.0, 1.0))
    area("RimL", (-5, -3, 1.6), (math.radians(80), 0, math.radians(-120)), 3.0, 450, (0.75, 0.35, 1.0))
    area("RimR", (5, -2, 1.4), (math.radians(80), 0, math.radians(120)), 3.0, 350, (0.45, 0.6, 1.0))
    area("Fill", (-3, 6, 1.2), (math.radians(75), 0, math.radians(-150)), 4.0, 250, (1.0, 0.9, 0.95))
    # sol réfléchissant "shadow catcher"
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, 0))
    floor = bpy.context.active_object
    floor.name = "Floor"
    floor.is_shadow_catcher = True
    cam_d = bpy.data.cameras.new("Cam")
    cam_d.lens = 50
    cam = link(bpy.data.objects.new("Cam", cam_d))
    sc.camera = cam
    return cam


def frame_camera(cam, S, yaw_deg=-38, pitch_deg=10, dist_scale=1.0):
    L = S["L"]
    H = S["H"]
    d = (L * 1.45 + 1.6) * dist_scale
    yaw = math.radians(yaw_deg)
    pitch = math.radians(pitch_deg)
    target = Vector((0, 0.05, H * 0.42))
    pos = target + Vector((math.sin(yaw) * math.cos(pitch) * d * -1, math.cos(yaw) * math.cos(pitch) * d,
                           math.sin(pitch) * d))
    cam.location = pos
    direction = target - pos
    cam.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def render_to(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
