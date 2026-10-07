# -*- coding: utf-8 -*-
"""
Usage :
  blender -b -P blender/build_cars.py -- [--only id1,id2] [--no-thumbs] [--preview out.png] [--traffic]

Génère game/assets/cars/<id>.glb et game/assets/thumbs/<id>.png
"""
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)

import bpy  # noqa: E402
import carlib  # noqa: E402
import cars_spec  # noqa: E402

ROOT = os.path.abspath(os.path.join(HERE, ".."))
OUT_CARS = os.path.join(ROOT, "game", "assets", "cars")
OUT_THUMBS = os.path.join(ROOT, "game", "assets", "thumbs")


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    opts = {"only": None, "thumbs": True, "preview": None, "traffic": False, "views": False, "samples": 40}
    i = 0
    while i < len(argv):
        a = argv[i]
        if a == "--only":
            opts["only"] = argv[i + 1].split(",")
            i += 1
        elif a == "--no-thumbs":
            opts["thumbs"] = False
        elif a == "--preview":
            opts["preview"] = argv[i + 1]
            i += 1
        elif a == "--traffic":
            opts["traffic"] = True
        elif a == "--views":
            opts["views"] = True
        elif a == "--samples":
            opts["samples"] = int(argv[i + 1])
            i += 1
        i += 1
    return opts


def main():
    opts = parse_args()
    os.makedirs(OUT_CARS, exist_ok=True)
    os.makedirs(OUT_THUMBS, exist_ok=True)
    specs = cars_spec.traffic_specs() if opts["traffic"] else cars_spec.car_specs()
    if opts["only"]:
        specs = [s for s in specs if s["id"] in opts["only"]]
    for S in specs:
        t0 = time.time()
        carlib.clear_scene()
        root, body, wheels = carlib.build_car(S)
        tris = sum(len(p.vertices) - 2 for o in [body] + wheels for p in o.data.polygons)
        glb = os.path.join(OUT_CARS, S["id"] + ".glb")
        carlib.export_glb(root, glb)
        msg = "%s : %d tris" % (S["id"], tris)
        if opts["thumbs"] or opts["preview"] or opts["views"]:
            cam = carlib.setup_thumb_scene(samples=opts["samples"])
            if opts["views"]:
                base = opts["preview"] or os.path.join(ROOT, "build", "preview_" + S["id"])
                for name, yaw, pitch in (("front", -38, 10), ("rear", 145, 12), ("side", -90, 4), ("top", -30, 55)):
                    carlib.frame_camera(cam, S, yaw, pitch)
                    carlib.render_to(base + "_" + name + ".png")
            else:
                carlib.frame_camera(cam, S)
                out = opts["preview"] or os.path.join(OUT_THUMBS, S["id"] + ".png")
                if out.endswith("/"):
                    out = out + S["id"] + ".png"
                carlib.render_to(out)
        print(msg, "(%.1fs)" % (time.time() - t0), flush=True)


main()
