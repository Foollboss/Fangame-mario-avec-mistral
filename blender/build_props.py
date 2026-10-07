# -*- coding: utf-8 -*-
"""
Décors modélisés dans Blender -> game/assets/props/<nom>.glb
Usage : blender -b -P blender/build_props.py -- [--preview dossier/]
"""
import math
import os
import random
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import bpy  # noqa: E402
import bmesh  # noqa: E402
from mathutils import Vector, Matrix, noise  # noqa: E402
import carlib  # noqa: E402

ROOT = os.path.abspath(os.path.join(HERE, ".."))
OUT = os.path.join(ROOT, "game", "assets", "props")
os.makedirs(OUT, exist_ok=True)

PROP_MATS = {
    "RampStripes": ((1.0, 0.75, 0.0), 0.3, 0.5),
    "Metal": ((0.35, 0.36, 0.38), 0.9, 0.35),
    "Concrete": ((0.55, 0.54, 0.52), 0.0, 0.9),
    "PalmTrunk": ((0.35, 0.26, 0.17), 0.0, 0.9),
    "PalmLeaf": ((0.2, 0.45, 0.15), 0.0, 0.7),
    "Foliage": ((0.15, 0.35, 0.1), 0.0, 0.8),
    "Bark": ((0.25, 0.18, 0.12), 0.0, 0.9),
    "LampGlow": ((1.0, 0.9, 0.7), 0.0, 0.3),
    "PoleMetal": ((0.15, 0.16, 0.17), 0.7, 0.4),
    "GGRed": ((0.75, 0.16, 0.05), 0.1, 0.6),
    "Billboard": ((0.9, 0.9, 0.9), 0.0, 0.5),
    "LightRed": ((1.0, 0.05, 0.05), 0.0, 0.3),
    "LightAmber": ((1.0, 0.6, 0.0), 0.0, 0.3),
    "LightGreen": ((0.1, 1.0, 0.3), 0.0, 0.3),
    "Cactus": ((0.25, 0.45, 0.2), 0.0, 0.8),
    "Rock": ((0.55, 0.35, 0.22), 0.0, 0.95),
    "Cone": ((1.0, 0.35, 0.0), 0.0, 0.6),
    "White": ((0.9, 0.9, 0.9), 0.0, 0.5),
}


def pmat(name):
    m = bpy.data.materials.get(name)
    if m is None:
        col, met, rough = PROP_MATS.get(name, ((0.5, 0.5, 0.5), 0, 0.5))
        m = bpy.data.materials.new(name)
        m.use_nodes = True
        b = m.node_tree.nodes.get("Principled BSDF")
        b.inputs["Base Color"].default_value = (*col, 1)
        b.inputs["Metallic"].default_value = met
        b.inputs["Roughness"].default_value = rough
        if name in ("LampGlow", "LightRed", "LightAmber", "LightGreen"):
            b.inputs["Emission Color"].default_value = (*col, 1)
            b.inputs["Emission Strength"].default_value = 4.0
    return m


class Builder:
    def __init__(self, name):
        self.name = name
        self.me = bpy.data.meshes.new(name)
        self.obj = carlib.link(bpy.data.objects.new(name, self.me))
        self.bm = bmesh.new()
        self.uv = self.bm.loops.layers.uv.new("UVMap")
        self.mats = {}

    def mi(self, mat):
        if mat not in self.mats:
            self.me.materials.append(pmat(mat))
            self.mats[mat] = len(self.me.materials) - 1
        return self.mats[mat]

    def face(self, pts, mat, uvs=None, smooth=False):
        vs = [self.bm.verts.new(p) for p in pts]
        f = self.bm.faces.new(vs)
        f.material_index = self.mi(mat)
        f.smooth = smooth
        if uvs:
            for loop, uv in zip(f.loops, uvs):
                loop[self.uv].uv = uv
        return f

    def box(self, center, size, mat, rot_z=0.0, uv_scale=1.0):
        cx, cy, cz = center
        sx, sy, sz = size[0] / 2, size[1] / 2, size[2] / 2
        R = Matrix.Rotation(rot_z, 3, 'Z')
        def P(x, y, z):
            v = R @ Vector((x, y, z))
            return (cx + v.x, cy + v.y, cz + v.z)
        c = [P(-sx, -sy, -sz), P(sx, -sy, -sz), P(sx, sy, -sz), P(-sx, sy, -sz),
             P(-sx, -sy, sz), P(sx, -sy, sz), P(sx, sy, sz), P(-sx, sy, sz)]
        faces = [(0, 3, 2, 1), (4, 5, 6, 7), (0, 1, 5, 4), (1, 2, 6, 5), (2, 3, 7, 6), (3, 0, 4, 7)]
        dims = [(size[0], size[1]), (size[0], size[1]), (size[0], size[2]), (size[1], size[2]), (size[0], size[2]),
                (size[1], size[2])]
        for fi, (a, b, cc, d) in enumerate(faces):
            w, h = dims[fi]
            self.face([c[a], c[b], c[cc], c[d]], mat,
                      [(0, 0), (w * uv_scale, 0), (w * uv_scale, h * uv_scale), (0, h * uv_scale)])

    def tube(self, path, radii, mat, segs=10, cap=True, uv_v_scale=1.0, smooth=True):
        """Tube le long d'une liste de points avec rayons."""
        rings = []
        acc = 0.0
        for i, p in enumerate(path):
            p = Vector(p)
            if i < len(path) - 1:
                d = (Vector(path[i + 1]) - p).normalized()
            else:
                d = (p - Vector(path[i - 1])).normalized()
            if i > 0:
                acc += (p - Vector(path[i - 1])).length
            up = Vector((0, 0, 1)) if abs(d.z) < 0.95 else Vector((1, 0, 0))
            side = d.cross(up).normalized()
            up2 = side.cross(d).normalized()
            ring = []
            for k in range(segs):
                a = 2 * math.pi * k / segs
                v = p + (side * math.cos(a) + up2 * math.sin(a)) * radii[i]
                ring.append((self.bm.verts.new(v), k / segs, acc * uv_v_scale))
            rings.append(ring)
        m = self.mi(mat)
        for i in range(len(rings) - 1):
            for k in range(segs):
                k2 = (k + 1) % segs
                a, b = rings[i][k], rings[i][k2]
                c, d = rings[i + 1][k2], rings[i + 1][k]
                f = self.bm.faces.new((a[0], b[0], c[0], d[0]))
                f.material_index = m
                f.smooth = smooth
                ub = b[1] if k2 != 0 else 1.0
                uvs = [(a[1], a[2]), (ub, b[2]), (ub, c[2]), (d[1], d[2])]
                for loop, uv in zip(f.loops, uvs):
                    loop[self.uv].uv = uv
        if cap:
            f = self.bm.faces.new([r[0] for r in reversed(rings[-1])])
            f.material_index = m

    def finish(self):
        bmesh.ops.remove_doubles(self.bm, verts=self.bm.verts, dist=0.0001)
        self.bm.normal_update()
        self.bm.to_mesh(self.me)
        self.bm.free()
        return self.obj


def export(obj, name):
    path = os.path.join(OUT, name + ".glb")
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    for c in obj.children_recursive:
        c.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.export_scene.gltf(filepath=path, export_format='GLB', use_selection=True, export_apply=True,
                              export_yup=True)
    print("prop", name, flush=True)


# ---------------------------------------------------------------------------
# Rampes (origine = début de la rampe, montée vers +Y)
# ---------------------------------------------------------------------------

RAMP_L, RAMP_W, RAMP_H = 9.0, 4.4, 1.5


def ramp():
    b = Builder("Ramp")
    L, W, H = RAMP_L, RAMP_W, RAMP_H
    hw = W / 2
    # dessus (chevrons)
    b.face([(-hw, 0, 0.0), (hw, 0, 0.0), (hw, L, H), (-hw, L, H)], "RampStripes",
           [(0, 0), (1, 0), (1, 2), (0, 2)])
    # côtés
    for s in (-1, 1):
        pts = [(s * hw, 0, 0), (s * hw, L, 0), (s * hw, L, H)]
        if s < 0:
            pts.reverse()
        b.face(pts, "Metal", [(0, 0), (1, 0), (1, 1)])
    # face arrière (lèvre)
    b.face([(hw, L, 0), (-hw, L, 0), (-hw, L, H), (hw, L, H)], "Metal", [(0, 0), (1, 0), (1, 1), (0, 1)])
    # renforts
    for x in (-hw + 0.3, 0.0, hw - 0.3):
        b.box((x, L - 0.15, H / 2), (0.15, 0.15, H), "Metal")
    b.box((0, L - 0.05, H - 0.05), (W + 0.1, 0.12, 0.12), "Metal")
    return b.finish()


def ramp_barrel():
    """Rampe vrillée : le côté droit monte, pas le gauche -> tonneau vers la gauche."""
    b = Builder("RampBarrel")
    L, W, H = 8.0, 3.6, 1.9
    hw = W / 2
    nu, nv = 8, 4
    grid = []
    for i in range(nu + 1):
        u = i / nu
        row = []
        for k in range(nv + 1):
            v = k / nv
            x = -hw + v * W
            row.append((x, u * L, H * u * v))
        grid.append(row)
    for i in range(nu):
        for k in range(nv):
            b.face([grid[i][k], grid[i][k + 1], grid[i + 1][k + 1], grid[i + 1][k]], "RampStripes",
                   [(k / nv, i / nu * 2), ((k + 1) / nv, i / nu * 2), ((k + 1) / nv, (i + 1) / nu * 2),
                    (k / nv, (i + 1) / nu * 2)])
    # côté haut (droite)
    b.face([(hw, L, 0), (hw, L, H), (hw, 0, 0)], "Metal", [(1, 0), (1, 1), (0, 0)])
    # lèvre
    pts = [(hw, L, 0)] + [(hw - v * W, L, H * (1 - v)) for v in [0.0, 0.25, 0.5, 0.75, 1.0]][::-1]
    lip = [(hw - v * W, L, 0) for v in (0, 1)]
    b.face([(hw, L, 0), (-hw, L, 0), (hw, L, H)], "Metal", [(0, 0), (1, 0), (0, 1)])
    for k in range(3):
        x = hw - 0.3 - k * 1.0
        hh = H * (x + hw) / W
        b.box((x, L - 0.15, hh / 2), (0.14, 0.14, hh), "Metal")
    return b.finish()


# ---------------------------------------------------------------------------
# Végétation
# ---------------------------------------------------------------------------

def palm(seed, height=10.0):
    random.seed(seed)
    b = Builder("Palm")
    lean = Vector((random.uniform(-0.8, 0.8), random.uniform(-0.8, 0.8), 0))
    path, radii = [], []
    n = 10
    for i in range(n + 1):
        t = i / n
        p = Vector((0, 0, t * height)) + lean * (t ** 2)
        path.append(tuple(p))
        radii.append(0.28 * (1 - t) + 0.17 * t + (0.04 if i == 0 else 0))
    b.tube(path, radii, "PalmTrunk", segs=8, uv_v_scale=0.5)
    top = Vector(path[-1])
    # couronne
    for k in range(4):
        a = random.uniform(0, 6.28)
        b.box(tuple(top + Vector((math.cos(a) * 0.25, math.sin(a) * 0.25, -0.35))), (0.22, 0.22, 0.22), "PalmTrunk")
    nf = 10
    for f in range(nf):
        a = 2 * math.pi * f / nf + random.uniform(-0.15, 0.15)
        d = Vector((math.cos(a), math.sin(a), 0))
        side = Vector((-d.y, d.x, 0))
        length = random.uniform(3.6, 4.6)
        rise = random.uniform(0.2, 0.9)
        segs = 4
        prev_l = prev_r = None
        for s in range(segs + 1):
            t = s / segs
            p = top + d * (length * t) + Vector((0, 0, rise * math.sin(t * math.pi * 0.9) - 2.0 * t * t))
            w = 0.7 * math.sin(t * math.pi) + 0.15
            l = p - side * w + Vector((0, 0, 0.05))
            r = p + side * w + Vector((0, 0, 0.05))
            if prev_l is not None:
                b.face([prev_l, prev_r, r, l], "PalmLeaf", [(t - 1 / segs, 0), (t - 1 / segs, 1), (t, 1), (t, 0)])
            prev_l, prev_r = l, r
    return b.finish()


def tree(seed):
    random.seed(seed)
    b = Builder("Tree")
    h = random.uniform(3.0, 4.0)
    b.tube([(0, 0, 0), (0.05, 0, h * 0.5), (0, 0.05, h)], [0.22, 0.17, 0.12], "Bark", segs=7)
    obj = b.finish()
    # canopée : icosphères déformées
    me = obj.data
    bm = bmesh.new()
    bm.from_mesh(me)
    if "Foliage" not in [m.name for m in me.materials]:
        me.materials.append(pmat("Foliage"))
    fi = [m.name for m in me.materials].index("Foliage")
    uvl = bm.loops.layers.uv.get("UVMap") or bm.loops.layers.uv.new("UVMap")
    for k in range(4):
        c = Vector((random.uniform(-0.8, 0.8), random.uniform(-0.8, 0.8), h + random.uniform(-0.4, 1.2)))
        r = random.uniform(1.4, 2.1)
        geom = bmesh.ops.create_icosphere(bm, subdivisions=2, radius=r)
        for v in geom["verts"]:
            nv = v.co.normalized()
            disp = 1.0 + 0.22 * noise.noise(nv * 2.5 + Vector((seed, k, 0)))
            v.co = c + v.co * disp
        for f in {f for v in geom["verts"] for f in v.link_faces}:
            f.material_index = fi
            f.smooth = True
            for loop in f.loops:
                p = loop.vert.co
                loop[uvl].uv = (p.x * 0.3 + p.y * 0.2, p.z * 0.3)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    return obj


def cactus(seed):
    random.seed(seed)
    b = Builder("Cactus")
    h = random.uniform(3.0, 5.0)
    b.tube([(0, 0, 0), (0, 0, h * 0.5), (0, 0, h)], [0.32, 0.32, 0.28], "Cactus", segs=10)
    for s in (-1, 1):
        if random.random() < 0.85:
            z0 = random.uniform(h * 0.3, h * 0.55)
            b.tube([(0, 0, z0), (s * 0.8, 0, z0 + 0.1), (s * 0.95, 0, z0 + 0.6), (s * 0.95, 0, z0 + 1.6)],
                   [0.2, 0.2, 0.2, 0.17], "Cactus", segs=8)
    return b.finish()


def rock(seed, scale=(3, 3, 2)):
    random.seed(seed)
    me = bpy.data.meshes.new("Rock")
    obj = carlib.link(bpy.data.objects.new("Rock", me))
    bm = bmesh.new()
    geom = bmesh.ops.create_icosphere(bm, subdivisions=2, radius=1.0)
    for v in bm.verts:
        n = v.co.normalized()
        d = 1.0 + 0.35 * noise.noise(n * 1.7 + Vector((seed * 3.1, 0, 0))) + 0.12 * noise.noise(n * 5.0)
        v.co = Vector((n.x * scale[0], n.y * scale[1], max(n.z, -0.3) * scale[2])) * d
    me.materials.append(pmat("Rock"))
    uvl = bm.loops.layers.uv.new("UVMap")
    for f in bm.faces:
        f.smooth = False
        for loop in f.loops:
            p = loop.vert.co
            loop[uvl].uv = (p.x * 0.25 + p.y * 0.25, p.z * 0.25)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    return obj


def mesa(seed):
    random.seed(seed)
    me = bpy.data.meshes.new("Mesa")
    obj = carlib.link(bpy.data.objects.new("Mesa", me))
    bm = bmesh.new()
    segs, rings = 20, 6
    R = random.uniform(18, 28)
    H = random.uniform(25, 45)
    verts = []
    for j in range(rings + 1):
        z = H * j / rings
        row = []
        for i in range(segs):
            a = 2 * math.pi * i / segs
            rr = R * (1.0 + 0.25 * noise.noise(Vector((math.cos(a) * 2, math.sin(a) * 2, z * 0.05 + seed))))
            rr *= 1.0 - 0.15 * (j / rings)
            if j == 0:
                rr *= 1.35
            row.append(bm.verts.new((math.cos(a) * rr, math.sin(a) * rr, z)))
        verts.append(row)
    me.materials.append(pmat("Rock"))
    uvl = bm.loops.layers.uv.new("UVMap")
    for j in range(rings):
        for i in range(segs):
            i2 = (i + 1) % segs
            f = bm.faces.new((verts[j][i], verts[j][i2], verts[j + 1][i2], verts[j + 1][i]))
            for loop in f.loops:
                p = loop.vert.co
                loop[uvl].uv = (math.atan2(p.y, p.x) * 3.0, p.z * 0.08)
    top = bm.faces.new(verts[-1])
    for loop in top.loops:
        p = loop.vert.co
        loop[uvl].uv = (p.x * 0.05, p.y * 0.05)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    return obj


# ---------------------------------------------------------------------------
# Mobilier urbain
# ---------------------------------------------------------------------------

def streetlamp():
    b = Builder("StreetLamp")
    h = 8.0
    b.tube([(0, 0, 0), (0, 0, h * 0.6), (0, 0, h)], [0.14, 0.11, 0.09], "PoleMetal", segs=8)
    # bras incurvé vers la route (+X)
    arm = []
    for i in range(7):
        t = i / 6
        arm.append((t * 2.4, 0, h + math.sin(t * math.pi * 0.6) * 0.5))
    b.tube(arm, [0.07] * 7, "PoleMetal", segs=6)
    b.box((2.5, 0, h + 0.35), (0.9, 0.38, 0.18), "PoleMetal")
    b.face([(2.1, -0.16, h + 0.255), (2.1, 0.16, h + 0.255), (2.9, 0.16, h + 0.255), (2.9, -0.16, h + 0.255)],
           "LampGlow", [(0, 0), (1, 0), (1, 1), (0, 1)])
    b.box((0, 0, 0.3), (0.45, 0.45, 0.6), "PoleMetal")
    return b.finish()


def traffic_light():
    """Potence de feux tricolores : mât en bord de route, bras vers +X au-dessus de la chaussée."""
    b = Builder("TrafficLight")
    h = 6.0
    b.tube([(0, 0, 0), (0, 0, h)], [0.16, 0.13], "PoleMetal", segs=8)
    b.tube([(0, 0, h - 0.3), (6.5, 0, h - 0.1)], [0.1, 0.08], "PoleMetal", segs=6)
    for x in (3.0, 6.0):
        b.box((x, 0, h - 0.9), (0.45, 0.4, 1.3), "PoleMetal")
        for k, mat in enumerate(("LightRed", "LightAmber", "LightGreen")):
            z = h - 0.5 - k * 0.4
            b.face([(x - 0.13, -0.205, z - 0.13), (x + 0.13, -0.205, z - 0.13), (x + 0.13, -0.205, z + 0.13),
                    (x - 0.13, -0.205, z + 0.13)], mat, [(0, 0), (1, 0), (1, 1), (0, 1)])
    return b.finish()


def billboard():
    b = Builder("Billboard")
    W, H, z0 = 12.0, 4.0, 4.0
    for x in (-W * 0.3, W * 0.3):
        b.box((x, 0.3, z0 / 2), (0.35, 0.35, z0), "PoleMetal")
    b.box((0, 0.35, z0 + H / 2), (W + 0.4, 0.3, H + 0.4), "PoleMetal")
    b.face([(-W / 2, 0.19, z0), (W / 2, 0.19, z0), (W / 2, 0.19, z0 + H), (-W / 2, 0.19, z0 + H)][::-1],
           "Billboard", [(1, 0.75), (0, 0.75), (0, 1.0), (1, 1.0)][::-1])
    return b.finish()


def gg_tower():
    """Tour du pont (style Golden Gate). Origine au niveau du tablier, centre de la chaussée."""
    b = Builder("GGTower")
    H = 75.0
    gap = 13.0
    for s in (-1, 1):
        x = s * gap
        # jambe en 3 étages qui s'affinent
        for k, (z0, z1, w, d) in enumerate(((-30, 20, 4.2, 6.0), (20, 50, 3.6, 5.2), (50, H, 3.0, 4.4))):
            b.box((x, 0, (z0 + z1) / 2), (w, d, z1 - z0), "GGRed")
            # rainures verticales
            b.box((x + s * (w / 2), 0, (z0 + z1) / 2), (0.3, d * 0.5, (z1 - z0) * 0.95), "GGRed")
    # entretoises (portails)
    for z in (12, 40, 64, H - 1.5):
        b.box((0, 0, z), (gap * 2, 3.0, 4.0 if z < H - 2 else 3.0), "GGRed")
    # selles des câbles
    for s in (-1, 1):
        b.box((s * gap, 0, H + 1.0), (3.2, 5.0, 2.0), "GGRed")
    return b.finish()


def cone():
    b = Builder("Cone")
    b.box((0, 0, 0.02), (0.5, 0.5, 0.04), "Cone")
    b.tube([(0, 0, 0.04), (0, 0, 0.75)], [0.18, 0.03], "Cone", segs=10)
    return b.finish()


def jersey_block():
    """Bloc de béton pour chantiers (décor)."""
    b = Builder("Jersey")
    prof = [(-0.3, 0), (0.3, 0), (0.3, 0.08), (0.16, 0.3), (0.1, 0.8), (-0.1, 0.8), (-0.16, 0.3), (-0.3, 0.08)]
    L = 3.0
    for i in range(len(prof)):
        a, c = prof[i], prof[(i + 1) % len(prof)]
        b.face([(a[0], -L / 2, a[1]), (c[0], -L / 2, c[1]), (c[0], L / 2, c[1]), (a[0], L / 2, a[1])][::-1],
               "Concrete", [(0, 0), (1, 0), (1, 1), (0, 1)])
    b.face([(p[0], -L / 2, p[1]) for p in prof], "Concrete")
    b.face([(p[0], L / 2, p[1]) for p in prof][::-1], "Concrete")
    return b.finish()


def main():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    builds = [
        ("ramp", ramp), ("ramp_barrel", ramp_barrel),
        ("palm_a", lambda: palm(1, 10.0)), ("palm_b", lambda: palm(2, 12.0)), ("palm_c", lambda: palm(3, 8.5)),
        ("tree_a", lambda: tree(4)), ("tree_b", lambda: tree(5)),
        ("cactus_a", lambda: cactus(6)), ("cactus_b", lambda: cactus(7)),
        ("rock_a", lambda: rock(8, (3, 2.5, 2))), ("rock_b", lambda: rock(9, (5, 4, 3.5))),
        ("mesa_a", lambda: mesa(10)), ("mesa_b", lambda: mesa(11)),
        ("streetlamp", streetlamp), ("traffic_light", traffic_light), ("billboard", billboard),
        ("gg_tower", gg_tower), ("cone", cone), ("jersey", jersey_block),
    ]
    preview = argv[argv.index("--preview") + 1] if "--preview" in argv else None
    for name, fn in builds:
        carlib.clear_scene()
        obj = fn()
        export(obj, name)
        if preview:
            cam = carlib.setup_thumb_scene(samples=12)
            bb = [obj.matrix_world @ Vector(c) for c in obj.bound_box]
            size = max((max(v[i] for v in bb) - min(v[i] for v in bb)) for i in range(3))
            S = {"L": size, "H": size * 0.8}
            carlib.frame_camera(cam, S, -38, 18)
            cz = (max(v.z for v in bb) + min(v.z for v in bb)) / 2
            cam.location.z += cz - S["H"] * 0.42
            carlib.render_to(os.path.join(preview, name + ".png"))


main()
