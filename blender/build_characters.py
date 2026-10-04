"""Régénère les animations des 4 héros et réexporte les GLB pour Godot.

Usage : blender -b -P blender/build_characters.py -- [kael lyra zahara kaelith]
Entrée : game/assets/<perso>.glb (maillage + squelette + texture)
Sortie : game/assets/<perso>.glb avec les nouvelles animations.
"""
import bpy, sys, os, math, json
from mathutils import Vector, Quaternion

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from anim.rig import Rig  # noqa: E402
from anim.keys import build_pose  # noqa: E402
from anim import library  # noqa: E402
from bpy_extras import anim_utils  # noqa: E402

ASSETS = os.path.normpath(os.path.join(HERE, "..", "game", "assets"))
SRC = os.path.join(HERE, "source")
FPS = 30
CHARS = ["kael", "lyra", "zahara", "kaelith"]


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for o in list(bpy.data.objects):
        bpy.data.objects.remove(o, do_unlink=True)
    bpy.context.scene.render.fps = FPS


def rename_bones(arm):
    for b in arm.data.bones:
        n = b.name
        if n.endswith("_L") or n.endswith("_R"):
            if not n.startswith("cloth"):
                b.name = n[:-2] + "." + n[-1]


def reorient_weapon_bones(obj):
    """L'arme suit l'axe Y de l'os weapon.X : on l'oriente à ~70° de l'avant-bras, vers l'avant,
    tranchant dans le plan avant-bras/lame (prise « marteau »)."""
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.mode_set(mode="EDIT")
    eb = obj.data.edit_bones
    for s in ("L", "R"):
        w = eb.get("weapon." + s)
        fo = eb.get("forearm." + s)
        if not w or not fo:
            continue
        f = (fo.tail - fo.head).normalized()
        fw = Vector((0, -1, 0))
        axis = f.cross(fw).normalized()
        blade = (Quaternion(axis, math.radians(72)) @ f).normalized()
        L = 0.1
        w.tail = w.head + blade * L
        w.align_roll(axis)
    bpy.ops.object.mode_set(mode="OBJECT")


def write_action(obj, rig, name, length, loop, fn):
    act = bpy.data.actions.new(name)
    act.use_fake_user = True
    if obj.animation_data is None:
        obj.animation_data_create()
    obj.animation_data.action = act
    slot = obj.animation_data.action_slot
    if slot is None:
        slot = act.slots.new(id_type="OBJECT", name=obj.name)
        obj.animation_data.action_slot = slot
    cb = anim_utils.action_ensure_channelbag_for_slot(act, slot)
    n = max(int(round(length * FPS)), 1)
    frames = list(range(n + 1))
    data = {}
    for fr in frames:
        t = fr / FPS
        if loop:
            t = (fr % n) / FPS
        ch = fn(min(t, length))
        P = build_pose(rig, ch)
        res = rig.solve(P)
        for bn, (loc, q) in res.items():
            d = data.setdefault(bn, {"q": [], "l": []})
            d["q"].append(q)
            d["l"].append(loc)
    for bn, d in data.items():
        # continuité des quaternions (évite les retournements)
        qs = d["q"]
        for i in range(1, len(qs)):
            if qs[i].dot(qs[i - 1]) < 0:
                qs[i] = -qs[i]
        base = 'pose.bones["%s"]' % bn
        for i in range(4):
            fc = cb.fcurves.new(base + ".rotation_quaternion", index=i, group_name=bn)
            fc.keyframe_points.add(len(frames))
            co = []
            for k, fr in enumerate(frames):
                co += [fr, qs[k][i]]
            fc.keyframe_points.foreach_set("co", co)
            for kp in fc.keyframe_points:
                kp.interpolation = "LINEAR"
            fc.update()
        if bn == "hips":
            for i in range(3):
                fc = cb.fcurves.new(base + ".location", index=i, group_name=bn)
                fc.keyframe_points.add(len(frames))
                co = []
                for k, fr in enumerate(frames):
                    co += [fr, d["l"][k][i]]
                fc.keyframe_points.foreach_set("co", co)
                for kp in fc.keyframe_points:
                    kp.interpolation = "LINEAR"
                fc.update()
    act.frame_range = (0, n)
    act.use_frame_range = True
    return act


def build(char):
    reset()
    src = os.path.join(SRC, char + ".glb")
    bpy.ops.import_scene.gltf(filepath=src)
    arm = [o for o in bpy.data.objects if o.type == "ARMATURE"][0]
    root = arm.parent
    keep = {root, arm} | set(arm.children_recursive)
    for o in list(bpy.data.objects):
        if o not in keep:
            bpy.data.objects.remove(o, do_unlink=True)
    for a in list(bpy.data.actions):
        bpy.data.actions.remove(a)
    if arm.animation_data:
        arm.animation_data_clear()
    rename_bones(arm)
    reorient_weapon_bones(arm)
    for pb in arm.pose.bones:
        pb.rotation_mode = "QUATERNION"
        pb.location = (0, 0, 0)
        pb.rotation_quaternion = (1, 0, 0, 0)
        pb.scale = (1, 1, 1)
    rig = Rig(arm)
    anims = library.build(char, rig.LL)
    info = {"LL": rig.LL, "anims": {}}
    for name, (length, loop, fn) in sorted(anims.items()):
        write_action(arm, rig, name, length, loop, fn)
        info["anims"][name] = round(length, 4)
    for k in ("Walk", "Run", "Sprint"):
        info.setdefault("gait", {})[k] = round(library.natural_speed(k, rig.LL), 4)
    arm.animation_data.action = bpy.data.actions.get("Idle")
    out = os.path.join(ASSETS, char + ".glb")
    bpy.ops.export_scene.gltf(
        filepath=out, export_format="GLB", use_selection=False,
        export_animations=True, export_animation_mode="ACTIONS", export_force_sampling=True,
        export_frame_range=False, export_anim_single_armature=True, export_def_bones=False,
        export_optimize_animation_size=False, export_reset_pose_bones=True,
        export_apply=False, export_yup=True, export_skins=True,
    )
    print("BUILT", char, json.dumps(info))
    return info


if __name__ == "__main__":
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    chars = [a for a in argv if a in CHARS] or CHARS
    path = os.path.join(HERE, "anim_info.json")
    allinfo = json.load(open(path)) if os.path.exists(path) else {}
    for c in chars:
        allinfo[c] = build(c)
    with open(path, "w") as f:
        json.dump(allinfo, f, indent=1)
