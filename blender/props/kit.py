"""Petit kit de modélisation procédurale (bmesh) pour les décors d'Aetheria."""
import bpy
import bmesh
import math
import random
import numpy as np
from mathutils import Matrix, Vector, Euler, noise

_TEX_CACHE = {}


# ----------------------------------------------------------------------------
# Textures peintes générées (numpy)
# ----------------------------------------------------------------------------
def _value_noise(size, cells, seed):
    rng = np.random.default_rng(seed)
    g = rng.random((cells + 1, cells + 1))
    g[-1, :] = g[0, :]
    g[:, -1] = g[:, 0]
    x = np.linspace(0, cells, size, endpoint=False)
    xi = x.astype(int)
    xf = x - xi
    xf = xf * xf * (3 - 2 * xf)
    a = g[np.ix_(xi, xi)]
    b = g[np.ix_(xi, xi + 1)]
    c = g[np.ix_(xi + 1, xi)]
    d = g[np.ix_(xi + 1, xi + 1)]
    fy = xf[:, None]
    fx = xf[None, :]
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy


def fbm(size, base=4, octaves=4, seed=0):
    out = np.zeros((size, size))
    amp = 1.0
    tot = 0.0
    for o in range(octaves):
        out += _value_noise(size, base * (2 ** o), seed + o) * amp
        tot += amp
        amp *= 0.5
    return out / tot


def _save(name, rgb, alpha=None):
    size = rgb.shape[0]
    img = bpy.data.images.new(name, size, size, alpha=alpha is not None)
    rgba = np.ones((size, size, 4), dtype=np.float32)
    rgba[:, :, :3] = np.clip(rgb, 0, 1)
    if alpha is not None:
        rgba[:, :, 3] = np.clip(alpha, 0, 1)
    img.pixels.foreach_set(rgba[::-1].ravel())
    img.pack()
    return img


def tex_plaster(size=256):
    n = fbm(size, 3, 4, 11)
    s = fbm(size, 24, 2, 12)
    v = 0.86 + 0.1 * (n - 0.5) + 0.05 * (s - 0.5)
    rgb = np.stack([v * 1.0, v * 0.96, v * 0.88], -1)
    return _save("tx_plaster", rgb)


def tex_wood(size=256):
    y = np.linspace(0, 1, size)[:, None]
    n = fbm(size, 4, 3, 21)
    grain = 0.5 + 0.5 * np.sin((y * 34.0 + n * 6.0) * math.pi)
    v = 0.78 + 0.18 * grain + 0.08 * (fbm(size, 16, 2, 22) - 0.5)
    planks = (np.floor(np.linspace(0, 4, size))[None, :] % 2) * 0.04
    v = v - planks
    rgb = np.stack([v, v * 0.93, v * 0.86], -1)
    return _save("tx_wood", rgb)


def tex_tiles(size=256, rows=8):
    """Tuiles plates rectangulaires en quinconce, ombrées en bas de chaque rang (teintées par instance)."""
    yy, xx = np.mgrid[0:size, 0:size] / size
    r = yy * rows
    row = np.floor(r)
    fy = r - row
    cols = rows * 0.9
    fx = (xx * cols + (row % 2) * 0.5) % 1.0
    seam = np.clip(np.minimum(fx, 1 - fx) * 14, 0, 1)
    lip = np.clip((1 - fy) * 9, 0, 1)
    rng = np.random.default_rng(31)
    tone = rng.random(256)[((row * 17 + np.floor(xx * cols + (row % 2) * 0.5)) % 256).astype(int)]
    v = (0.68 + 0.3 * fy) * (0.6 + 0.4 * seam) * (0.55 + 0.45 * lip) * (0.9 + 0.14 * tone) * (0.94 + 0.1 * fbm(size, 6, 2, 33))
    rgb = np.stack([v, v, v], -1)
    return _save("tx_tiles", rgb)


def tex_rock(size=256):
    n = fbm(size, 4, 5, 61)
    c = np.abs(fbm(size, 7, 3, 62) - 0.5)
    v = 0.74 + 0.22 * (n - 0.5) - 0.25 * np.clip(0.06 - c, 0, 1) * 6
    rgb = np.stack([v, v * 0.98, v * 0.95], -1)
    return _save("tx_rock", rgb)


def tex_stone(size=256, rows=6, warm=0.0):
    yy, xx = np.mgrid[0:size, 0:size] / size
    r = yy * rows
    row = np.floor(r)
    fy = r - row
    fx = (xx * rows * 0.7 + (row % 2) * 0.5 + np.sin(row * 7.3) * 0.2) % 1.0
    gap = np.minimum(np.minimum(fx, 1 - fx) * 7, np.minimum(fy, 1 - fy) * 9)
    mortar = np.clip(gap * 2.2, 0, 1)
    rng = np.random.default_rng(41)
    tone = rng.random(64)[((row * 13 + np.floor(xx * rows * 0.7 + (row % 2) * 0.5)) % 64).astype(int)]
    v = (0.72 + 0.16 * tone + 0.1 * (fbm(size, 8, 3, 42) - 0.5)) * (0.55 + 0.45 * mortar)
    rgb = np.stack([v * (1 + warm), v * (1 + warm * 0.5), v * (1 - warm * 0.3) * 1.02], -1)
    return _save("tx_stone%d" % int(warm * 100), rgb)


def tex_bark(size=256):
    xx = np.linspace(0, 1, size)[None, :]
    n = fbm(size, 5, 3, 51)
    v = 0.7 + 0.22 * (0.5 + 0.5 * np.sin((xx * 22 + n * 4) * math.pi)) + 0.08 * (fbm(size, 20, 2, 52) - 0.5)
    rgb = np.stack([v, v * 0.9, v * 0.8], -1)
    return _save("tx_bark", rgb)


def tex_leaves(size=256):
    """Atlas feuillage : moitié gauche opaque (touffes), moitié droite = bouquet de feuilles détouré (cartes)."""
    rgb = np.ones((size, size, 3)) * 0.92
    alpha = np.zeros((size, size))
    alpha[:, : size // 2] = 1.0
    rng = np.random.default_rng(71)
    yy, xx = np.mgrid[0:size, 0:size].astype(float)
    half = size // 2
    for k in range(26):
        cx = half + half * (0.18 + 0.64 * rng.random())
        cy = size * (0.12 + 0.76 * rng.random())
        if ((cx - half * 1.5) / (half * 0.5)) ** 2 + ((cy - size * 0.5) / (size * 0.5)) ** 2 > 0.85:
            continue
        a = rng.random() * math.pi
        L = size * (0.09 + 0.05 * rng.random())
        Wd = L * 0.42
        dx = xx - cx
        dy = yy - cy
        u = dx * math.cos(a) + dy * math.sin(a)
        v = -dx * math.sin(a) + dy * math.cos(a)
        d = (u / L) ** 2 + (v / Wd) ** 2
        inside = (d < 1.0) & (xx >= half)
        alpha[inside] = 1.0
        shade = 0.8 + 0.2 * rng.random()
        vein = np.abs(v) < 1.2
        rgb[inside] = (shade * (0.9 + 0.1 * (1 - d[inside])))[:, None] * np.array([1.0, 1.0, 1.0])
        rgb[inside & vein] *= 0.93
    rgb[:, : size // 2] = 0.95
    return _save("tx_leaves", rgb, alpha)


TEXTURES = {"leaves": tex_leaves, "plaster": tex_plaster, "wood": tex_wood, "tiles": tex_tiles, "stone": lambda: tex_stone(),
            "stone_warm": lambda: tex_stone(warm=0.08), "bark": tex_bark, "rock": tex_rock}


def texture(kind):
    if kind not in _TEX_CACHE:
        _TEX_CACHE[kind] = TEXTURES[kind]()
    return _TEX_CACHE[kind]


# ----------------------------------------------------------------------------
# Matériaux
# ----------------------------------------------------------------------------
def material(name, color, tex=None, emit=None, emit_strength=0.0, rough=0.8):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Roughness"].default_value = rough
    if tex:
        tn = m.node_tree.nodes.new("ShaderNodeTexImage")
        tn.image = texture(tex)
        # couleur * texture
        mix = m.node_tree.nodes.new("ShaderNodeMix")
        mix.data_type = "RGBA"
        mix.blend_type = "MULTIPLY"
        mix.inputs[0].default_value = 1.0
        mix.inputs[6].default_value = (*color, 1.0)
        m.node_tree.links.new(tn.outputs["Color"], mix.inputs[7])
        m.node_tree.links.new(mix.outputs[2], bsdf.inputs["Base Color"])
    if emit:
        bsdf.inputs["Emission Color"].default_value = (*emit, 1.0)
        bsdf.inputs["Emission Strength"].default_value = emit_strength
    return m


# ----------------------------------------------------------------------------
# Construction de maillages
# ----------------------------------------------------------------------------
class Builder:
    """Accumule de la géométrie dans un bmesh avec des index de matériaux."""

    def __init__(self, name, mats):
        self.name = name
        self.mats = mats  # liste de bpy materials
        self.bm = bmesh.new()
        self.col_layer = self.bm.loops.layers.color.new("Col")
        self.card_layer = self.bm.faces.layers.int.new("card")
        self.rng = random.Random(hash(name) & 0xFFFF)

    def mi(self, mat):
        for i, m in enumerate(self.mats):
            if m.name == mat:
                return i
        raise KeyError(mat)

    def _tag(self, geom_faces, mat, col=None):
        idx = self.mi(mat)
        for f in geom_faces:
            f.material_index = idx
            for l in f.loops:
                l[self.col_layer] = (*(col or (1, 1, 1)), 1.0)
        return geom_faces

    def _run(self, fn, mat, col=None, smooth=False):
        for f in self.bm.faces:
            f.index = 0
        before = set(self.bm.faces)
        fn()
        new = [f for f in self.bm.faces if f not in before]
        for f in new:
            f.smooth = smooth
        self._tag(new, mat, col)
        return new

    def box(self, mat, center, size, rot=(0, 0, 0), col=None, bevel=0.0):
        M = Matrix.Translation(Vector(center)) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Diagonal((*size, 1.0))
        def f():
            r = bmesh.ops.create_cube(self.bm, size=1.0, matrix=M)
            if bevel > 0:
                edges = list({e for v in r["verts"] for e in v.link_edges})
                bmesh.ops.bevel(self.bm, geom=edges, offset=bevel, segments=1, affect="EDGES", profile=0.5)
        return self._run(f, mat, col)

    def cyl(self, mat, base, r1, r2, h, segs=12, rot=(0, 0, 0), col=None, smooth=True, caps=True):
        M = Matrix.Translation(Vector(base)) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Translation((0, 0, h * 0.5))
        def f():
            bmesh.ops.create_cone(self.bm, cap_ends=caps, cap_tris=False, segments=segs, radius1=r1, radius2=r2, depth=h, matrix=M)
        return self._run(f, mat, col, smooth)

    def sphere(self, mat, center, radius, scale=(1, 1, 1), subdiv=2, rot=(0, 0, 0), col=None, smooth=True, jitter=0.0, flat_bottom=None):
        M = Matrix.Translation(Vector(center)) @ Euler(rot).to_matrix().to_4x4() @ Matrix.Diagonal((*scale, 1.0))
        def f():
            r = bmesh.ops.create_icosphere(self.bm, subdivisions=subdiv, radius=radius, matrix=M)
            if jitter > 0 or flat_bottom is not None:
                c = Vector(center)
                for v in r["verts"]:
                    if jitter > 0:
                        d = (v.co - c)
                        n = noise.noise(v.co * 1.7 + Vector((self.rng.random() * 0.0, 0, 0)))
                        v.co = c + d * (1.0 + jitter * n)
                    if flat_bottom is not None and v.co.z < flat_bottom:
                        v.co.z = flat_bottom + (v.co.z - flat_bottom) * 0.25
        return self._run(f, mat, col, smooth)

    def cone(self, mat, base, r, h, segs=10, col=None, smooth=False, rot=(0, 0, 0)):
        return self.cyl(mat, base, r, 0.0, h, segs, rot, col, smooth)

    def roof(self, mat, center, length, span, rise, thick=0.14, overhang=0.4, col=None):
        """Toit à deux pans fait de deux dalles, faîtage le long de X (centre = milieu de la base)."""
        half = span * 0.5 + overhang
        ang = math.atan2(rise, span * 0.5)
        slope = half / math.cos(ang)
        cx, cy, cz = center
        faces = []
        for side in (-1, 1):
            mid_y = cy + side * (half * 0.5)
            mid_z = cz + rise - (half * 0.5) * math.tan(ang)
            faces += self.box(mat, (cx, mid_y + side * thick * 0.5 * math.sin(ang), mid_z + thick * 0.5 * math.cos(ang)),
                              (length + overhang * 2, slope, thick), rot=(-side * ang, 0, 0), col=col)
        return faces

    def card(self, mat, center, normal, size, spin=0.0, col=None):
        """Carte de feuilles (quad) orientée selon `normal`, UV sur la moitié droite de l'atlas."""
        n = Vector(normal).normalized()
        t = n.orthogonal().normalized()
        t.rotate(__import__("mathutils").Quaternion(n, spin))
        bt = n.cross(t)
        c = Vector(center)
        h = size * 0.5
        def f():
            vs = [self.bm.verts.new(c + (-t - bt) * h), self.bm.verts.new(c + (t - bt) * h),
                  self.bm.verts.new(c + (t + bt) * h), self.bm.verts.new(c + (-t + bt) * h)]
            fc = self.bm.faces.new(vs)
            fc[self.card_layer] = 1
        return self._run(f, mat, col, smooth=True)

    def gable(self, mat, center, width, depth, height, col=None, rot=(0, 0, 0)):
        """Pignon triangulaire plein (mur sous le toit), arête le long de X."""
        M = Matrix.Translation(Vector(center)) @ Euler(rot).to_matrix().to_4x4()
        w, d = width * 0.5, depth * 0.5
        def f():
            pts = [Vector((-w, -d, 0)), Vector((w, -d, 0)), Vector((w, d, 0)), Vector((-w, d, 0)),
                   Vector((-w, 0, height)), Vector((w, 0, height))]
            v = [self.bm.verts.new(M @ p) for p in pts]
            self.bm.faces.new([v[0], v[1], v[5], v[4]])
            self.bm.faces.new([v[2], v[3], v[4], v[5]])
            self.bm.faces.new([v[0], v[4], v[3]])
            self.bm.faces.new([v[1], v[2], v[5]])
            self.bm.faces.new([v[0], v[3], v[2], v[1]])
        return self._run(f, mat, col)

    def finish(self, smooth_angle=None, uv_scale=1.0, origin=(0, 0, 0)):
        bmesh.ops.remove_doubles(self.bm, verts=self.bm.verts, dist=1e-5)
        bmesh.ops.recalc_face_normals(self.bm, faces=self.bm.faces)
        me = bpy.data.meshes.new(self.name)
        self.bm.to_mesh(me)
        self.bm.free()
        for m in self.mats:
            me.materials.append(m)
        ob = bpy.data.objects.new(self.name, me)
        bpy.context.scene.collection.objects.link(ob)
        # UV : projection cubique à l'échelle du monde
        bpy.context.view_layer.objects.active = ob
        for o in bpy.context.selected_objects:
            o.select_set(False)
        ob.select_set(True)
        bpy.ops.object.mode_set(mode="EDIT")
        bpy.ops.mesh.select_all(action="SELECT")
        bpy.ops.uv.cube_project(cube_size=uv_scale, scale_to_bounds=False, correct_aspect=True)
        bpy.ops.object.mode_set(mode="OBJECT")
        # atlas feuillage : touffes à gauche, cartes à droite
        cards = me.attributes.get("card")
        uv = me.uv_layers.active.data
        leafy = {i for i, m in enumerate(self.mats) if m.name in ("tint_leaves", "tint_needles")}
        if leafy:
            corners = [(0.5, 0.0), (1.0, 0.0), (1.0, 1.0), (0.5, 1.0)]
            for poly in me.polygons:
                if cards and cards.data[poly.index].value == 1:
                    for k, li in enumerate(poly.loop_indices):
                        uv[li].uv = corners[k % 4]
                elif poly.material_index in leafy:
                    for li in poly.loop_indices:
                        u, v = uv[li].uv
                        uv[li].uv = (0.04 + (u % 1.0) * 0.38, v % 1.0)
        if smooth_angle is not None:
            try:
                bpy.ops.object.shade_auto_smooth(angle=math.radians(smooth_angle))
            except Exception:
                pass
        ob.select_set(False)
        return ob


def rnd(seed):
    return random.Random(seed)
