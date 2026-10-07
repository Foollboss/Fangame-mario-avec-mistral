# -*- coding: utf-8 -*-
"""
Asphalt Legends Unite - Fangame
Décors et éléments de piste générés dans Blender (testé avec Blender 4.2 LTS).

Produit dans godot/assets/props/ :
  ramp.glb         rampe classique (boîte unitaire 1 x 1 x 1, monte vers l'avant)
  barrel_ramp.glb  rampe à tonneau (inclinée, côté haut à droite)
  barrel_ramp_l.glb  même rampe, côté haut à gauche
  palm.glb         palmier
  tree.glb         arbre feuillu
  lamp.glb         lampadaire (le bras pointe vers +X)
  billboard.glb    panneau publicitaire lumineux (matériau "Screen")
  cone.glb         plot de chantier

Utilisation : blender -b -P blender/build_props.py
"""
import bpy
import bmesh
import math
import os
import random
from mathutils import Vector, Matrix

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "godot", "assets", "props")


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def mat(name, color, metallic=0.0, rough=0.6, emission=None, strength=0.0, double=False):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get("Principled BSDF")
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = rough
    if emission:
        b.inputs["Emission Color"].default_value = (*emission, 1.0)
        b.inputs["Emission Strength"].default_value = strength
    m.use_backface_culling = not double
    return m


def obj_from_bm(name, bm, mats):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    bm.free()
    for m in mats:
        me.materials.append(m)
    o = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(o)
    return o


def smooth(o):
    for p in o.data.polygons:
        p.use_smooth = True


def export(name, objs):
    os.makedirs(OUT, exist_ok=True)
    for o in bpy.context.scene.objects:
        o.select_set(False)
    for o in objs:
        o.select_set(True)
    bpy.ops.export_scene.gltf(filepath=os.path.join(OUT, name + ".glb"), export_format="GLB",
                              use_selection=True, export_apply=True, export_yup=True)
    print("exported", name)


def add_box(bm, center, size, mat_index=0, rot=None):
    res = bmesh.ops.create_cube(bm, size=1.0)
    vs = res["verts"]
    for v in vs:
        v.co = Vector((v.co.x * size[0], v.co.y * size[1], v.co.z * size[2]))
        if rot is not None:
            v.co = rot @ v.co
        v.co += Vector(center)
    for f in {f for v in vs for f in v.link_faces}:
        f.material_index = mat_index
    return vs


def add_cyl(bm, center, r1, r2, depth, segs=12, mat_index=0, rot=None):
    res = bmesh.ops.create_cone(bm, cap_ends=True, segments=segs, radius1=r1, radius2=r2, depth=depth)
    vs = res["verts"]
    for v in vs:
        if rot is not None:
            v.co = rot @ v.co
        v.co += Vector(center)
    for f in {f for v in vs for f in v.link_faces}:
        f.material_index = mat_index
    return vs


# ---------------------------------------------------------------------------
def build_ramp(barrel=False, mirror=False):
    """Rampe unitaire : X dans [-0.5, 0.5], Y (avant) dans [0, 1], Z hauteur.
    Rampe normale : h = y.   Rampe tonneau : h = y * (0.15 + 0.85 * (x + 0.5))
    (côté haut à droite ; version "_l" : côté haut à gauche)."""
    reset()
    m_top = mat("RampTop", (0.03, 0.03, 0.035), rough=0.55)
    m_side = mat("RampSide", (0.18, 0.18, 0.2), metallic=0.8, rough=0.35)
    m_chev = mat("RampChevron", (1.0, 0.75, 0.05), emission=(1.0, 0.7, 0.0), strength=3.0)
    m_neon = mat("RampNeon", (0.7, 0.2, 1.0), emission=(0.75, 0.2, 1.0), strength=6.0)

    def h(x, y):
        if not barrel:
            return y
        xs = -x if mirror else x
        return y * (0.15 + 0.85 * (xs + 0.5))

    bm = bmesh.new()
    nx, ny = 6, 10
    grid = [[bm.verts.new((-0.5 + i / nx, j / ny, h(-0.5 + i / nx, j / ny))) for i in range(nx + 1)] for j in range(ny + 1)]
    base = [[bm.verts.new((-0.5 + i / nx, j / ny, 0.0)) for i in range(nx + 1)] for j in range(ny + 1)]
    for j in range(ny):
        for i in range(nx):
            f = bm.faces.new((grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]))
            f.material_index = 0
    # côtés
    for j in range(ny):
        f = bm.faces.new((base[j][0], grid[j][0], grid[j + 1][0], base[j + 1][0]))
        f.material_index = 1
        f = bm.faces.new((base[j][nx], base[j + 1][nx], grid[j + 1][nx], grid[j][nx]))
        f.material_index = 1
    # face arrière (y = 1)
    for i in range(nx):
        f = bm.faces.new((base[ny][i], grid[ny][i], grid[ny][i + 1], base[ny][i + 1]))
        f.material_index = 1
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    # chevrons lumineux posés sur la surface
    for k in range(4):
        y0 = 0.12 + k * 0.21
        for side in (-1, 1):
            for q in range(4):
                x = side * (0.05 + q * 0.1)
                y = y0 + q * 0.04
                pts = [(x - 0.03, y, 0), (x + 0.03, y, 0), (x + 0.03, y + 0.06, 0), (x - 0.03, y + 0.06, 0)]
                vs = [bm.verts.new((px, py, h(px, py) + 0.006)) for px, py, _ in pts]
                f = bm.faces.new(vs)
                f.material_index = 2
    # bandes néon latérales
    for side in (-0.5, 0.5):
        for j in range(ny):
            y0, y1 = j / ny, (j + 1) / ny
            vs = [bm.verts.new((side, y0, h(side, y0) + 0.002)), bm.verts.new((side, y1, h(side, y1) + 0.002)),
                  bm.verts.new((side, y1, h(side, y1) - 0.04)), bm.verts.new((side, y0, h(side, y0) - 0.04))]
            f = bm.faces.new(vs if side > 0 else list(reversed(vs)))
            f.material_index = 3
    o = obj_from_bm("Ramp", bm, [m_top, m_side, m_chev, m_neon])
    export(("barrel_ramp_l" if mirror else "barrel_ramp") if barrel else "ramp", [o])


def build_palm():
    reset()
    m_trunk = mat("PalmTrunk", (0.25, 0.17, 0.10), rough=0.9)
    m_leaf = mat("PalmLeaf", (0.06, 0.28, 0.06), rough=0.7, double=True)
    bm = bmesh.new()
    height = 9.0
    segs = 10
    prev = None
    lean = 0.9
    for i in range(segs):
        t0, t1 = i / segs, (i + 1) / segs
        z0, z1 = t0 * height, t1 * height
        x0, x1 = lean * t0 ** 2, lean * t1 ** 2
        r0 = 0.24 - 0.08 * t0
        r1 = 0.24 - 0.08 * t1
        c = Vector(((x0 + x1) / 2, 0, (z0 + z1) / 2))
        d = Vector((x1 - x0, 0, z1 - z0))
        rot = d.to_track_quat("Z", "Y").to_matrix()
        add_cyl(bm, c, r0 * 1.08, r1, d.length * 1.02, segs=9, mat_index=0, rot=rot)
    top = Vector((lean, 0, height))
    rnd = random.Random(4)
    for k in range(9):
        a = k * 2 * math.pi / 9 + rnd.uniform(-0.15, 0.15)
        length = rnd.uniform(3.4, 4.4)
        droop = rnd.uniform(0.9, 1.5)
        n = 8
        left, right = [], []
        for j in range(n + 1):
            u = j / n
            r = u * length
            z = top.z + 0.5 * u - droop * u * u * 1.6
            w = 0.55 * math.sin(math.pi * min(1.0, u * 1.1)) + 0.05
            cx = top.x + math.cos(a) * r
            cy = top.y + math.sin(a) * r
            px, py = -math.sin(a) * w, math.cos(a) * w
            left.append(bm.verts.new((cx + px, cy + py, z - 0.12 * w)))
            right.append(bm.verts.new((cx - px, cy - py, z - 0.12 * w)))
        mid = [bm.verts.new((top.x + math.cos(a) * j / n * length, top.y + math.sin(a) * j / n * length,
                             top.z + 0.5 * j / n - droop * (j / n) ** 2 * 1.6 + 0.08)) for j in range(n + 1)]
        for j in range(n):
            f = bm.faces.new((left[j], left[j + 1], mid[j + 1], mid[j]))
            f.material_index = 1
            f = bm.faces.new((mid[j], mid[j + 1], right[j + 1], right[j]))
            f.material_index = 1
    o = obj_from_bm("Palm", bm, [m_trunk, m_leaf])
    smooth(o)
    export("palm", [o])


def build_tree():
    reset()
    m_trunk = mat("TreeTrunk", (0.18, 0.12, 0.07), rough=0.9)
    m_leaf = mat("TreeLeaf", (0.07, 0.22, 0.05), rough=0.8)
    bm = bmesh.new()
    add_cyl(bm, (0, 0, 1.6), 0.28, 0.18, 3.2, segs=10, mat_index=0)
    rnd = random.Random(7)
    for k in range(6):
        c = Vector((rnd.uniform(-1.2, 1.2), rnd.uniform(-1.2, 1.2), rnd.uniform(3.8, 5.6)))
        res = bmesh.ops.create_icosphere(bm, subdivisions=2, radius=rnd.uniform(1.3, 2.0))
        for v in res["verts"]:
            v.co = Vector((v.co.x, v.co.y, v.co.z * 0.85)) + c
            v.co += Vector((rnd.uniform(-0.12, 0.12), rnd.uniform(-0.12, 0.12), rnd.uniform(-0.12, 0.12)))
        for f in {f for v in res["verts"] for f in v.link_faces}:
            f.material_index = 1
    o = obj_from_bm("Tree", bm, [m_trunk, m_leaf])
    export("tree", [o])


def build_lamp():
    reset()
    m_pole = mat("LampPole", (0.12, 0.12, 0.13), metallic=0.8, rough=0.4)
    m_light = mat("LampLight", (1.0, 0.92, 0.75), emission=(1.0, 0.85, 0.6), strength=12.0)
    bm = bmesh.new()
    add_cyl(bm, (0, 0, 4.5), 0.13, 0.08, 9.0, segs=10, mat_index=0)
    add_box(bm, (1.3, 0, 8.9), (2.7, 0.12, 0.10), mat_index=0)
    add_box(bm, (2.55, 0, 8.82), (0.75, 0.32, 0.12), mat_index=0)
    add_box(bm, (2.55, 0, 8.75), (0.65, 0.26, 0.03), mat_index=1)
    add_cyl(bm, (0, 0, 0.3), 0.25, 0.2, 0.6, segs=10, mat_index=0)
    o = obj_from_bm("Lamp", bm, [m_pole, m_light])
    export("lamp", [o])


def build_billboard():
    reset()
    m_frame = mat("BillboardFrame", (0.08, 0.08, 0.09), metallic=0.7, rough=0.4)
    m_screen = mat("Screen", (0.8, 0.2, 1.0), emission=(0.8, 0.2, 1.0), strength=4.0)
    bm = bmesh.new()
    for x in (-2.6, 2.6):
        add_box(bm, (x, 0, 3.0), (0.35, 0.35, 6.0), mat_index=0)
    add_box(bm, (0, 0.05, 7.5), (9.0, 0.35, 3.6), mat_index=0)
    add_box(bm, (0, -0.16, 7.5), (8.6, 0.05, 3.2), mat_index=1)
    o = obj_from_bm("Billboard", bm, [m_frame, m_screen])
    export("billboard", [o])


def build_rock():
    """Rocher / mesa unitaire : X,Y dans [-0.5, 0.5], Z dans [-0.5, 0.5] (comme un cube)."""
    reset()
    m = mat("Rock", (0.45, 0.24, 0.12), rough=1.0)
    bm = bmesh.new()
    res = bmesh.ops.create_icosphere(bm, subdivisions=3, radius=0.5)
    rnd = random.Random(11)
    for v in res["verts"]:
        d = 1.0 + 0.10 * math.sin(v.co.x * 17.0 + v.co.y * 9.0) + rnd.uniform(-0.06, 0.06)
        v.co *= d
        # flancs presque verticaux, sommet plat (mesa)
        v.co.x = max(-0.5, min(0.5, v.co.x * 1.35))
        v.co.y = max(-0.5, min(0.5, v.co.y * 1.35))
        v.co.z = max(-0.5, min(0.42, v.co.z * 1.25))
    o = obj_from_bm("Rock", bm, [m])
    export("rock", [o])


def build_cone():
    reset()
    m_or = mat("ConeOrange", (1.0, 0.25, 0.0), rough=0.5)
    m_wh = mat("ConeWhite", (0.95, 0.95, 0.95), rough=0.4)
    bm = bmesh.new()
    add_box(bm, (0, 0, 0.02), (0.42, 0.42, 0.04), mat_index=0)
    add_cyl(bm, (0, 0, 0.38), 0.16, 0.035, 0.7, segs=14, mat_index=0)
    add_cyl(bm, (0, 0, 0.42), 0.115, 0.095, 0.1, segs=14, mat_index=1)
    o = obj_from_bm("Cone", bm, [m_or, m_wh])
    smooth(o)
    export("cone", [o])


if __name__ == "__main__":
    build_ramp(False)
    build_ramp(True)
    build_ramp(True, mirror=True)
    build_palm()
    build_tree()
    build_lamp()
    build_billboard()
    build_cone()
    build_rock()
    print("OK")
