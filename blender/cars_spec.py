# -*- coding: utf-8 -*-
"""
Spécifications des voitures (géométrie Blender).
Les statistiques de jeu (vitesse, accélération...) sont dans game/data/cars.json.

Chaque fonction d'archétype produit les profils de carrosserie (t = 0 arrière -> 1 avant).
"""
from carlib import pchip


def _rgb(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4)]
    # sRGB -> linéaire
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)


# ---------------------------------------------------------------------------
# Formes de décalques (fonctions u -> (v_bas, v_haut))
# ---------------------------------------------------------------------------

def v_full(u):
    return (0.0, 1.0)


def v_taper_in(r=0.35):
    """Plus fin côté intérieur (u=0) que côté extérieur (u=1)."""
    return lambda u: (0.0 + (1 - u) * r * 0.5, 1.0 - (1 - u) * r * 0.5)


def v_taper_out(r=0.5):
    return lambda u: (u * r * 0.6, 1.0 - u * r * 0.4)


def v_swept(r=0.5):
    """Phare effilé vers l'intérieur, remontant vers l'extérieur."""
    return lambda u: (r * (1 - u) * 0.8, 1.0 - r * (1 - u) * 0.1)


def v_slim_up(r=0.6):
    return lambda u: (u * r, u * r + (1 - r))


def v_band(lo, hi):
    return lambda u: (lo, hi)


def v_arc(a=0.3):
    return lambda u: (a * (1 - 4 * (u - 0.5) ** 2), 1.0 - a * (1 - 4 * (u - 0.5) ** 2) * 0.2)


def D(mat, plane, rect, v=None, nu=14, nv=3, off=0.006, mirror=True):
    return ("strip", dict(mat=mat, plane=plane, rect=rect, v=v, nu=nu, nv=nv, off=off, mirror=mirror))


# ---------------------------------------------------------------------------
# Archétypes
# ---------------------------------------------------------------------------

def base(cid, L, W, H, wb, wr, ww, gc=0.13, **kw):
    S = dict(id=cid, L=L, W=W, H=H, wb=wb, wr=wr, ww=ww, gc=gc)
    S.update(kw)
    return S


def sedan(cid, L, W, H, wb, wr, ww, gc=0.13, cabin=(0.17, 0.33, 0.60, 0.745), deck=0.70, belt=0.665,
          hood=0.645, nose=0.47, tail=0.53, **kw):
    S = base(cid, L, W, H, wb, wr, ww, gc, **kw)
    c0, c1, c2, c3 = cabin
    S["cabin"] = cabin
    S["zb"] = [(0, gc + 0.24), (0.035, gc + 0.11), (0.10, gc + 0.015), (0.2, gc), (0.8, gc), (0.9, gc + 0.012),
               (0.965, gc + 0.09), (1.0, gc + 0.20)]
    S["zt"] = [(0, tail * H), (0.02, (tail + 0.08) * H), (0.07, (deck - 0.01) * H), (c0, deck * H),
               ((c0 + c3) / 2, belt * H), (c3, hood * H), (0.87, (nose + 0.10) * H), (0.955, (nose + 0.03) * H),
               (1.0, (nose - 0.03) * H)]
    S["w"] = [(0, 0.88), (0.03, 0.95), (0.10, 0.99), (0.22, 1.0), (0.78, 1.0), (0.90, 0.99), (0.965, 0.96),
              (1.0, 0.87)]
    S.setdefault("bpillar", [((c1 + c2) / 2 - 0.012, (c1 + c2) / 2 + 0.012)])
    return S


def suv(cid, L, W, H, wb, wr, ww, gc=0.19, cabin=(0.05, 0.12, 0.60, 0.74), **kw):
    S = base(cid, L, W, H, wb, wr, ww, gc, **kw)
    c0, c1, c2, c3 = cabin
    S["cabin"] = cabin
    S["zb"] = [(0, gc + 0.22), (0.04, gc + 0.10), (0.11, gc + 0.01), (0.2, gc), (0.8, gc), (0.9, gc + 0.01),
               (0.965, gc + 0.10), (1.0, gc + 0.24)]
    S["zt"] = [(0, 0.60 * H), (0.025, 0.66 * H), (c0, 0.685 * H), (c1, 0.685 * H), ((c1 + c3) / 2, 0.665 * H),
               (c3, 0.64 * H), (0.88, 0.585 * H), (0.96, 0.54 * H), (1.0, 0.48 * H)]
    S["w"] = [(0, 0.88), (0.03, 0.95), (0.10, 0.99), (0.22, 1.0), (0.78, 1.0), (0.90, 0.985), (0.965, 0.95),
              (1.0, 0.85)]
    S.setdefault("rw_curve", 0.6)
    S.setdefault("bpillar", [(0.395, 0.415)])
    S.setdefault("lower_mat", "Trim")
    S.setdefault("cladding_arches", True)
    S.setdefault("tumble", 0.80)
    S.setdefault("roof_arc", 0.025)
    S.setdefault("side_glass_t0", 0.115)
    return S


def coupe(cid, L, W, H, wb, wr, ww, gc=0.12, cabin=(0.14, 0.36, 0.55, 0.70), deck=0.68, belt=0.66,
          hood=0.63, nose=0.43, tail=0.52, **kw):
    S = sedan(cid, L, W, H, wb, wr, ww, gc, cabin=cabin, deck=deck, belt=belt, hood=hood, nose=nose,
              tail=tail, **kw)
    S.setdefault("rw_curve", 0.7)
    S["bpillar"] = kw.get("bpillar", [])
    return S


def mid(cid, L, W, H, wb, wr, ww, gc=0.11, cabin=(0.24, 0.42, 0.58, 0.76), deck=0.72, belt=0.69,
        hood=0.55, nose=0.34, tail=0.58, **kw):
    """Moteur central / supercar : nez bas, habitacle avancé, capot arrière long."""
    S = base(cid, L, W, H, wb, wr, ww, gc, **kw)
    c0, c1, c2, c3 = cabin
    S["cabin"] = cabin
    S["zb"] = [(0, gc + 0.18), (0.04, gc + 0.07), (0.10, gc + 0.01), (0.2, gc), (0.8, gc), (0.9, gc + 0.01),
               (0.965, gc + 0.03), (1.0, gc + 0.08)]
    S["zt"] = [(0, tail * H), (0.025, (tail + 0.08) * H), (0.08, (deck - 0.02) * H), (c0, deck * H),
               ((c0 + c3) / 2, belt * H), (c3, hood * H), (0.88, (nose + 0.12) * H), (0.96, (nose + 0.03) * H),
               (1.0, (nose - 0.06) * H)]
    S["w"] = [(0, 0.90), (0.03, 0.96), (0.12, 1.0), (0.3, 1.0), (0.55, 0.96), (0.75, 0.98), (0.90, 0.975),
              (0.965, 0.93), (1.0, 0.78)]
    S.setdefault("rw_curve", 0.55)
    S.setdefault("ws_curve", 0.72)
    S.setdefault("tumble", 0.66)
    S.setdefault("flare", 0.045)
    S.setdefault("bpillar", [])
    S.setdefault("roof_w_ends", 0.80)
    S.setdefault("side_glass_t1", c2 + (c3 - c2) * 0.75)
    return S


# ---------------------------------------------------------------------------
# Éléments récurrents
# ---------------------------------------------------------------------------

def front_z(S, t=0.975):
    zb = pchip(S["zb"])(t)
    zt = pchip(S["zt"])(t)
    return zb, zt


def rear_z(S, t=0.02):
    zb = pchip(S["zb"])(t)
    zt = pchip(S["zt"])(t)
    return zb, zt


def stripes(S, x0, x1, roof=True):
    """Bandes racing sur capot / toit / coffre sans passer sur les vitres."""
    L = S["L"]
    c0, c1, c2, c3 = S["cabin"]
    out = [D("Stripe", "top", (x0, x1, (c3 - 0.5) * L + 0.02, L / 2), nu=1, nv=12, off=0.004),
           D("Stripe", "top", (x0, x1, -L / 2, (c0 - 0.5) * L - 0.02), nu=1, nv=8, off=0.004)]
    if roof:
        out.append(D("Stripe", "top", (x0, x1, (c1 - 0.5) * L + 0.03, (c2 - 0.5) * L - 0.03), nu=1, nv=6, off=0.004))
    return out


def plates(S, front=True, rear=True, fz=None, rz=None):
    out = []
    zb, zt = front_z(S, 0.99)
    rb, rt = rear_z(S, 0.01)
    if front:
        z0 = fz if fz is not None else zb + (zt - zb) * 0.18
        out.append(D("Plate", "front", (0.0, 0.25, z0, z0 + 0.11), nu=2, nv=1, off=0.008))
    if rear:
        z0 = rz if rz is not None else rb + (rt - rb) * 0.52
        out.append(D("Plate", "rear", (0.0, 0.25, z0, z0 + 0.11), nu=2, nv=1, off=0.008))
    return out


def diffuser(S, w=0.6, h=0.12):
    rb, rt = rear_z(S, 0.01)
    return [D("Trim", "rear", (0.0, w, rb - 0.02, rb + h), nu=3, nv=1, off=0.004)]


# ---------------------------------------------------------------------------
# Voitures
# ---------------------------------------------------------------------------

def car_specs():
    cars = []

    # --- Mitsubishi Lancer Evolution X (classe D, gratuite) ---------------
    S = sedan("lancer_evo", 4.50, 1.81, 1.48, 2.65, 0.335, 0.245, gc=0.13,
              cabin=(0.19, 0.335, 0.60, 0.735), nose=0.50, hood=0.65)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#1f4fd1"), spokes=6, spoke_style="split", rim_color=_rgb("#1a1a1c"), rim_metal=0.6,
             caliper=_rgb("#c8102e"), wing=dict(kind="wing", t=0.045, h=0.24, chord=0.26, mat="Paint"),
             exhaust=dict(n=2, x=0.5, r=0.045), flare=0.035)
    S["decals"] = [
        D("Grille", "front", (0.0, 0.47, zb + 0.06, zt - 0.08), v=lambda u: (u * 0.10, 1.0 - u * 0.25), nu=6, nv=4),
        D("Chrome", "front", (0.0, 0.47, zt - 0.10, zt - 0.075), nu=6, nv=1, off=0.008),
        D("Headlight", "front", (0.47, 0.86, zt - 0.20, zt - 0.03), v=v_swept(0.7), nu=12, nv=3),
        D("Trim", "front", (0.55, 0.82, zb + 0.06, zb + 0.20), v=v_taper_in(0.4), nu=6, nv=2),
        D("Taillight", "rear", (0.46, 0.87, rt - 0.02, rt + 0.10), v=v_taper_in(0.45), nu=10, nv=3),
        D("Grille", "top", (0.18, 0.34, 1.62, 1.82), nu=4, nv=3, off=0.006),
    ] + plates(S) + diffuser(S)
    cars.append(S)

    # --- Mercedes-Benz CLA (classe D, gratuite) ---------------------------
    S = sedan("cla", 4.69, 1.83, 1.43, 2.73, 0.335, 0.235, gc=0.12,
              cabin=(0.13, 0.33, 0.585, 0.74), deck=0.69, belt=0.66, hood=0.625, nose=0.45, rw_curve=0.62,
              roof_arc=0.05, tumble=0.70)
    S["bpillar"] = [(0.455, 0.47)]
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#3a3d44"), metallic=0.75, spokes=10, spoke_style="single", rim_color=_rgb("#151517"),
             rim_metal=0.5, caliper=_rgb("#8a8d93"), wing=dict(kind="lip", t=0.03, mat="Paint"),
             exhaust=dict(n=2, x=0.55, r=0.045))
    S["decals"] = [
        D("Grille", "front", (0.0, 0.42, zb + 0.10, zt - 0.06), v=lambda u: (0.0, 1.0 - u * 0.15), nu=6, nv=4),
        D("Chrome", "front", (0.0, 0.42, zb + 0.24, zb + 0.255), nu=6, nv=1, off=0.009),
        D("Headlight", "front", (0.45, 0.88, zt - 0.11, zt - 0.02), v=v_swept(0.75), nu=14, nv=2),
        D("Trim", "front", (0.30, 0.80, zb + 0.02, zb + 0.10), nu=6, nv=1),
        D("Taillight", "rear", (0.40, 0.88, rt + 0.03, rt + 0.09), v=v_taper_in(0.5), nu=12, nv=2),
    ] + plates(S) + diffuser(S, 0.65, 0.1)
    cars.append(S)

    # --- BMW M5 (classe B, gratuite) --------------------------------------
    S = sedan("m5", 4.97, 1.90, 1.47, 2.98, 0.355, 0.265, gc=0.125,
              cabin=(0.19, 0.33, 0.62, 0.745), deck=0.695, belt=0.665, hood=0.64, nose=0.48)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#0b0c10"), metallic=0.7, spokes=7, spoke_style="split", rim_color=_rgb("#121214"),
             rim_metal=0.6, caliper=_rgb("#1f5bff"), wing=dict(kind="lip", t=0.03, mat="Carbon"),
             exhaust=dict(n=4, x=0.62, r=0.045), flare=0.03)
    S["decals"] = [
        # double haricot
        D("Chrome", "front", (0.035, 0.24, zt - 0.20, zt - 0.02), nu=4, nv=4, off=0.007, mirror=True),
        D("Grille", "front", (0.05, 0.225, zt - 0.185, zt - 0.035), nu=4, nv=4, off=0.010, mirror=True),
        D("Headlight", "front", (0.27, 0.80, zt - 0.13, zt - 0.03), v=v_taper_out(0.4), nu=12, nv=2),
        D("Grille", "front", (0.0, 0.85, zb + 0.03, zb + 0.17), v=lambda u: (0.0, 1.0 - 0.4 * u), nu=10, nv=2),
        D("Taillight", "rear", (0.50, 0.90, rt - 0.02, rt + 0.09), v=lambda u: (0.0 if u > 0.7 else 0.55, 1.0),
          nu=10, nv=3),
    ] + plates(S) + diffuser(S, 0.75, 0.12)
    cars.append(S)

    # --- Peugeot 3008 (classe C, gratuite) --------------------------------
    S = suv("p3008", 4.45, 1.84, 1.62, 2.68, 0.36, 0.235, gc=0.19,
            cabin=(0.06, 0.22, 0.61, 0.745), black_roof=True, roof_rails=False, rw_curve=0.55, roof_arc=0.045)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#55585f"), metallic=0.75, spokes=5, spoke_style="split", rim_color=_rgb("#1b1b1d"),
             rim_metal=0.7, caliper=_rgb("#2b2b2b"), wing=dict(kind="lip", t=0.06, mat="Roof"),
             exhaust=dict(n=2, x=0.55, r=0.04), flare=0.03)
    S["decals"] = [
        # grande calandre sans cadre
        D("Grille", "front", (0.0, 0.62, zb + 0.18, zt - 0.06), v=lambda u: (0.0, 1.0 - 0.12 * u), nu=8, nv=5),
        D("Headlight", "front", (0.52, 0.87, zt - 0.10, zt - 0.02), v=v_swept(0.5), nu=10, nv=2),
        # "crocs" lumineux verticaux
        D("Headlight", "front", (0.70, 0.78, zb + 0.10, zt - 0.10), v=lambda u: (0.0, 1.0), nu=2, nv=6, off=0.009),
        D("Trim", "front", (0.0, 0.88, zb + 0.0, zb + 0.13), nu=8, nv=1),
        # feux à 3 griffes
        D("Taillight", "rear", (0.55, 0.62, rt - 0.12, rt + 0.03), nu=1, nv=4, off=0.008),
        D("Taillight", "rear", (0.66, 0.73, rt - 0.12, rt + 0.03), nu=1, nv=4, off=0.008),
        D("Taillight", "rear", (0.77, 0.84, rt - 0.12, rt + 0.03), nu=1, nv=4, off=0.008),
        D("Trim", "rear", (0.0, 0.86, rt - 0.14, rt + 0.05), nu=8, nv=2, off=0.004),
    ] + plates(S) + diffuser(S, 0.8, 0.16)
    cars.append(S)

    # --- BMW Z4 LCI E89 (classe D) ----------------------------------------
    S = coupe("z4", 4.24, 1.79, 1.29, 2.50, 0.33, 0.235, gc=0.12, cabin=(0.20, 0.30, 0.45, 0.56),
              hood=0.66, belt=0.68, deck=0.70, nose=0.46, rw_curve=0.6, roof_arc=0.04, tumble=0.66)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#b3121b"), spokes=5, spoke_style="split", caliper=_rgb("#333333"),
             exhaust=dict(n=2, x=0.5, r=0.04))
    S["decals"] = [
        D("Chrome", "front", (0.03, 0.17, zt - 0.17, zt - 0.02), nu=3, nv=4, off=0.007),
        D("Grille", "front", (0.045, 0.155, zt - 0.155, zt - 0.035), nu=3, nv=4, off=0.010),
        D("Headlight", "front", (0.30, 0.82, zt - 0.11, zt - 0.02), v=v_slim_up(0.3), nu=12, nv=2),
        D("Grille", "front", (0.0, 0.75, zb + 0.04, zb + 0.16), nu=8, nv=1),
        D("Taillight", "rear", (0.48, 0.86, rt - 0.03, rt + 0.06), v=v_taper_in(0.5), nu=10, nv=2),
    ] + plates(S) + diffuser(S)
    cars.append(S)

    # --- Chevrolet Camaro LT (classe D) -----------------------------------
    S = coupe("camaro_lt", 4.78, 1.90, 1.35, 2.81, 0.35, 0.255, gc=0.125, cabin=(0.17, 0.34, 0.53, 0.66),
              hood=0.66, belt=0.71, deck=0.72, nose=0.50, tail=0.56, rw_curve=0.7, roof_arc=0.02, tumble=0.70)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#f2c500"), spokes=5, spoke_style="split", rim_color=_rgb("#c9cbd0"),
             wing=dict(kind="lip", t=0.03, mat="Paint"), exhaust=dict(n=2, x=0.55, r=0.05), flare=0.04)
    S["decals"] = [
        D("Grille", "front", (0.0, 0.62, zt - 0.17, zt - 0.03), nu=8, nv=3),
        D("Headlight", "front", (0.62, 0.86, zt - 0.12, zt - 0.03), v=v_swept(0.5), nu=8, nv=2, off=0.008),
        D("Grille", "front", (0.0, 0.70, zb + 0.04, zb + 0.20), v=lambda u: (0.0, 1.0 - 0.3 * u), nu=8, nv=2),
        D("Taillight", "rear", (0.40, 0.85, rt - 0.02, rt + 0.07), nu=10, nv=2),
    ] + stripes(S, 0.0, 0.12) + plates(S) + diffuser(S)
    cars.append(S)

    # --- Nissan 370Z Nismo (classe D) -------------------------------------
    S = coupe("nismo_370z", 4.33, 1.87, 1.32, 2.55, 0.34, 0.25, gc=0.12, cabin=(0.10, 0.36, 0.53, 0.67),
              hood=0.62, belt=0.68, deck=0.69, nose=0.44, rw_curve=0.55, roof_arc=0.06, tumble=0.66)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#e9ecef"), metallic=0.3, spokes=6, spoke_style="single", rim_color=_rgb("#232326"),
             caliper=_rgb("#c8102e"), wing=dict(kind="wing", t=0.04, h=0.12, chord=0.22, mat="Carbon"),
             exhaust=dict(n=2, x=0.5, r=0.05), flare=0.04)
    S["decals"] = [
        D("Grille", "front", (0.0, 0.55, zb + 0.02, zb + 0.22), v=lambda u: (0.0, 1.0 - 0.2 * u), nu=8, nv=3),
        D("Headlight", "front", (0.40, 0.88, zt - 0.08, zt + 0.05), v=v_swept(0.6), nu=12, nv=3),
        D("Taillight", "rear", (0.52, 0.88, rt - 0.03, rt + 0.08), v=v_swept(0.6), nu=10, nv=3),
        D("Taillight", "rear", (0.0, 0.08, rb + 0.02, rb + 0.09), nu=1, nv=1, off=0.008),
    ] + plates(S) + diffuser(S, 0.7, 0.14)
    cars.append(S)

    # --- Nissan Leaf Nismo RC (classe D) ----------------------------------
    S = mid("leaf_rc", 4.55, 1.94, 1.21, 2.75, 0.34, 0.28, gc=0.09, cabin=(0.30, 0.42, 0.55, 0.72),
            hood=0.50, nose=0.30, deck=0.66, belt=0.64, tail=0.62, tumble=0.55, flare=0.06)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#f4f6f8"), metallic=0.2, spokes=6, spoke_style="single", rim_color=_rgb("#111113"),
             caliper=_rgb("#1f5bff"), black_roof=True,
             wing=dict(kind="wing", t=0.03, h=0.34, chord=0.36, span=1.9, mat="Carbon", swan=True),
             exhaust=dict(n=0), mirrors=True, mirror_mat="Carbon")
    S["decals"] = [
        D("Headlight", "front", (0.45, 0.85, zt - 0.06, zt + 0.02), v=v_taper_in(0.5), nu=10, nv=2),
        D("Grille", "front", (0.0, 0.85, zb - 0.02, zb + 0.10), nu=8, nv=1),
        D("Taillight", "rear", (0.0, 0.90, rt - 0.03, rt + 0.02), nu=12, nv=1),
        D("Grille", "right", (-0.9, -0.3, 0.30, 0.55), nu=4, nv=2),
    ] + stripes(S, 0.0, 0.25) + diffuser(S, 0.9, 0.16)
    cars.append(S)

    # --- KTM X-Bow GTX (classe D) -----------------------------------------
    S = mid("xbow_gtx", 4.60, 2.04, 1.20, 2.70, 0.34, 0.28, gc=0.09, cabin=(0.36, 0.46, 0.58, 0.73),
            hood=0.50, nose=0.30, deck=0.66, belt=0.62, tail=0.60, tumble=0.50, flare=0.07, roof_arc=0.06)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#ff6a00"), metallic=0.3, spokes=5, spoke_style="split", rim_color=_rgb("#151517"),
             caliper=_rgb("#ff6a00"), black_roof=True,
             wing=dict(kind="wing", t=0.02, h=0.40, chord=0.36, span=1.95, mat="Carbon", swan=True),
             exhaust=dict(n=1, x=0.0, r=0.06))
    S["decals"] = [
        D("Headlight", "front", (0.55, 0.85, zt - 0.05, zt + 0.03), v=v_taper_in(0.6), nu=8, nv=2),
        D("Grille", "front", (0.0, 0.90, zb - 0.02, zb + 0.12), nu=8, nv=1),
        D("Taillight", "rear", (0.55, 0.92, rt - 0.03, rt + 0.04), nu=6, nv=1),
        D("Grille", "right", (-0.85, -0.25, 0.28, 0.60), nu=4, nv=2),
        D("Carbon", "top", (0.0, 0.5, 0.95, 1.6), nu=3, nv=4, off=0.004),
    ] + diffuser(S, 0.95, 0.18)
    cars.append(S)

    # --- Ford Mustang GT (classe C) ---------------------------------------
    S = coupe("mustang_gt", 4.79, 1.92, 1.38, 2.72, 0.35, 0.255, gc=0.125, cabin=(0.10, 0.36, 0.54, 0.68),
              hood=0.66, belt=0.70, deck=0.71, nose=0.52, tail=0.56, rw_curve=0.55, roof_arc=0.035, tumble=0.70)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#1c2a4a"), metallic=0.7, spokes=10, spoke_style="single", rim_color=_rgb("#1a1a1c"),
             caliper=_rgb("#c8102e"), wing=dict(kind="lip", t=0.03, mat="Paint"),
             exhaust=dict(n=4, x=0.62, r=0.045), flare=0.035)
    S["decals"] = [
        D("Grille", "front", (0.0, 0.56, zt - 0.24, zt - 0.03), v=lambda u: (u * 0.1, 1.0 - u * 0.1), nu=8, nv=4),
        D("Headlight", "front", (0.56, 0.86, zt - 0.13, zt - 0.03), v=v_swept(0.6), nu=8, nv=2),
        D("Grille", "front", (0.0, 0.50, zb + 0.02, zb + 0.12), nu=6, nv=1),
        D("Taillight", "rear", (0.30, 0.38, rt - 0.06, rt + 0.06), nu=1, nv=3, off=0.008),
        D("Taillight", "rear", (0.42, 0.50, rt - 0.06, rt + 0.06), nu=1, nv=3, off=0.008),
        D("Taillight", "rear", (0.54, 0.62, rt - 0.06, rt + 0.06), nu=1, nv=3, off=0.008),
        D("Trim", "rear", (0.0, 0.70, rt - 0.08, rt + 0.08), nu=6, nv=2, off=0.004),
    ] + stripes(S, 0.10, 0.22) + plates(S) + diffuser(S)
    cars.append(S)

    # --- Porsche 718 Cayman GT4 (classe C) --------------------------------
    S = mid("cayman_gt4", 4.46, 1.80, 1.27, 2.48, 0.34, 0.255, gc=0.11, cabin=(0.25, 0.40, 0.55, 0.71),
            hood=0.58, nose=0.38, deck=0.72, belt=0.69, tail=0.60, tumble=0.66, roof_arc=0.05)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#e2b100"), spokes=5, spoke_style="split", rim_color=_rgb("#232326"),
             caliper=_rgb("#c8102e"), wing=dict(kind="wing", t=0.035, h=0.22, chord=0.28, mat="Trim"),
             exhaust=dict(n=2, x=0.08, r=0.05))
    S["decals"] = [
        D("Headlight", "front", (0.48, 0.84, zt - 0.06, zt + 0.08), v=v_arc(0.25), nu=10, nv=3),
        D("Grille", "front", (0.0, 0.85, zb - 0.02, zb + 0.16), v=lambda u: (0.0, 1.0 - 0.4 * abs(u - 0.5)),
          nu=10, nv=2),
        D("Taillight", "rear", (0.0, 0.88, rt + 0.02, rt + 0.06), nu=12, nv=1),
        D("Grille", "right", (-0.75, -0.25, 0.35, 0.62), v=v_taper_in(0.5), nu=4, nv=2),
    ] + plates(S, front=False) + diffuser(S, 0.8, 0.14)
    cars.append(S)

    # --- Alpine A110 (classe C) -------------------------------------------
    S = mid("alpine_a110", 4.18, 1.80, 1.25, 2.42, 0.33, 0.235, gc=0.12, cabin=(0.22, 0.38, 0.54, 0.70),
            hood=0.60, nose=0.40, deck=0.70, belt=0.68, tail=0.62, tumble=0.68, roof_arc=0.06, flare=0.03)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#1a5fc2"), spokes=4, spoke_style="split", rim_color=_rgb("#c9cbd0"),
             caliper=_rgb("#1f5bff"), exhaust=dict(n=1, x=0.0, r=0.05))
    S["decals"] = [
        D("Headlight", "front", (0.50, 0.80, zt - 0.06, zt + 0.06), v=v_arc(0.35), nu=10, nv=3),
        D("Headlight", "front", (0.18, 0.28, zb + 0.18, zb + 0.28), nu=2, nv=2, off=0.008),
        D("Grille", "front", (0.0, 0.70, zb + 0.0, zb + 0.15), nu=8, nv=1),
        D("Taillight", "rear", (0.45, 0.85, rt - 0.02, rt + 0.06), v=lambda u: (abs(u - 0.5) * 0.8, 1 - abs(u - 0.5) * 0.8),
          nu=10, nv=3),
    ] + plates(S) + diffuser(S, 0.7, 0.12)
    cars.append(S)

    # --- Nissan GT-R Nismo (classe B) -------------------------------------
    S = coupe("gtr_nismo", 4.69, 1.90, 1.37, 2.78, 0.35, 0.265, gc=0.12, cabin=(0.15, 0.32, 0.56, 0.70),
              hood=0.66, belt=0.69, deck=0.71, nose=0.48, tail=0.58, rw_curve=0.75, roof_arc=0.025, tumble=0.72)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#8f949b"), metallic=0.8, spokes=6, spoke_style="split", rim_color=_rgb("#121214"),
             caliper=_rgb("#c8102e"), wing=dict(kind="wing", t=0.05, h=0.22, chord=0.28, mat="Carbon"),
             exhaust=dict(n=4, x=0.55, r=0.05), flare=0.04)
    S["decals"] = [
        D("Grille", "front", (0.0, 0.38, zb + 0.06, zt - 0.05), v=lambda u: (0.0, 1.0 - u * 0.15), nu=6, nv=4),
        D("Chrome", "front", (0.38, 0.41, zb + 0.06, zt - 0.06), nu=1, nv=4, off=0.008),
        D("Headlight", "front", (0.44, 0.88, zt - 0.10, zt + 0.0), v=v_swept(0.6), nu=12, nv=2),
        D("Grille", "front", (0.55, 0.85, zb + 0.02, zb + 0.20), nu=4, nv=2),
        # 4 feux ronds (approchés par petits carrés)
        D("Taillight", "rear", (0.48, 0.60, rt - 0.03, rt + 0.09), nu=2, nv=2, off=0.008),
        D("Taillight", "rear", (0.68, 0.80, rt - 0.03, rt + 0.09), nu=2, nv=2, off=0.008),
    ] + plates(S) + diffuser(S, 0.8, 0.16)
    cars.append(S)

    # --- Mercedes-AMG GT (classe B) ---------------------------------------
    S = coupe("amg_gt", 4.55, 1.94, 1.29, 2.63, 0.35, 0.265, gc=0.11, cabin=(0.10, 0.30, 0.44, 0.58),
              hood=0.66, belt=0.70, deck=0.70, nose=0.48, tail=0.58, rw_curve=0.5, roof_arc=0.06, tumble=0.64)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#b7bcc4"), metallic=0.9, spokes=5, spoke_style="split", rim_color=_rgb("#121214"),
             caliper=_rgb("#e0b000"), wing=dict(kind="lip", t=0.03, mat="Paint"),
             exhaust=dict(n=4, x=0.55, r=0.045), flare=0.04)
    S["decals"] = [
        D("Grille", "front", (0.0, 0.36, zb + 0.08, zt - 0.03), v=lambda u: (u * 0.1, 1.0), nu=6, nv=4),
        D("Chrome", "front", (0.04, 0.05, zb + 0.10, zt - 0.05), nu=1, nv=4, off=0.010),
        D("Chrome", "front", (0.14, 0.15, zb + 0.10, zt - 0.05), nu=1, nv=4, off=0.010),
        D("Chrome", "front", (0.24, 0.25, zb + 0.10, zt - 0.05), nu=1, nv=4, off=0.010),
        D("Headlight", "front", (0.45, 0.88, zt - 0.06, zt + 0.06), v=v_swept(0.6), nu=12, nv=2),
        D("Taillight", "rear", (0.45, 0.88, rt - 0.03, rt + 0.05), v=v_taper_in(0.5), nu=10, nv=2),
    ] + plates(S) + diffuser(S, 0.8, 0.14)
    cars.append(S)

    # --- Porsche 911 GT3 RS (classe B) ------------------------------------
    S = coupe("gt3_rs", 4.57, 1.90, 1.32, 2.46, 0.345, 0.27, gc=0.11, cabin=(0.20, 0.37, 0.55, 0.69),
              hood=0.58, belt=0.68, deck=0.70, nose=0.40, tail=0.58, rw_curve=0.55, roof_arc=0.07, tumble=0.66)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#2fbf71"), spokes=10, spoke_style="single", rim_color=_rgb("#121214"),
             caliper=_rgb("#e0b000"), wing=dict(kind="wing", t=0.06, h=0.36, chord=0.36, span=1.8, mat="Carbon", swan=True),
             exhaust=dict(n=2, x=0.10, r=0.055), flare=0.05)
    S["decals"] = [
        D("Headlight", "front", (0.50, 0.84, zt - 0.04, zt + 0.10), v=v_arc(0.3), nu=10, nv=3),
        D("Grille", "front", (0.0, 0.82, zb - 0.02, zb + 0.15), nu=10, nv=1),
        D("Taillight", "rear", (0.0, 0.90, rt + 0.03, rt + 0.06), nu=12, nv=1),
        D("Grille", "top", (0.12, 0.42, 1.55, 1.95), nu=3, nv=2, off=0.006),
    ] + plates(S, front=False) + diffuser(S, 0.85, 0.16)
    cars.append(S)

    # --- Lamborghini Huracán EVO (classe A) -------------------------------
    S = mid("huracan_evo", 4.52, 1.93, 1.17, 2.62, 0.35, 0.27, gc=0.10, cabin=(0.23, 0.43, 0.56, 0.78),
            hood=0.48, nose=0.30, deck=0.70, belt=0.66, tail=0.62, tumble=0.62, roof_arc=0.03, ws_curve=0.9)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#7bd400"), spokes=5, spoke_style="split", rim_color=_rgb("#121214"),
             caliper=_rgb("#e0b000"), wing=dict(kind="lip", t=0.03, mat="Carbon"),
             exhaust=dict(n=2, x=0.18, r=0.06))
    S["decals"] = [
        D("Headlight", "front", (0.50, 0.86, zt - 0.03, zt + 0.06), v=v_taper_in(0.7), nu=10, nv=2),
        D("Grille", "front", (0.0, 0.86, zb - 0.02, zb + 0.14), v=lambda u: (0.0, 1.0 - 0.5 * u), nu=10, nv=2),
        D("Taillight", "rear", (0.50, 0.90, rt + 0.0, rt + 0.06), v=v_taper_in(0.6), nu=10, nv=2),
        D("Grille", "rear", (0.0, 0.85, rb + 0.0, rt - 0.03), nu=8, nv=2, off=0.004),
        D("Grille", "right", (-0.65, -0.15, 0.32, 0.62), v=v_taper_out(0.6), nu=4, nv=2),
    ]
    cars.append(S)

    # --- Ferrari F8 Tributo (classe A) ------------------------------------
    S = mid("f8_tributo", 4.61, 1.98, 1.21, 2.65, 0.35, 0.27, gc=0.10, cabin=(0.24, 0.42, 0.56, 0.76),
            hood=0.52, nose=0.33, deck=0.70, belt=0.68, tail=0.60, tumble=0.64, roof_arc=0.05)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#c00d0d"), spokes=5, spoke_style="split", rim_color=_rgb("#c9cbd0"),
             caliper=_rgb("#e0b000"), wing=dict(kind="lip", t=0.03, mat="Paint"),
             exhaust=dict(n=2, x=0.42, r=0.05))
    S["decals"] = [
        D("Headlight", "front", (0.55, 0.86, zt - 0.02, zt + 0.05), v=v_taper_in(0.6), nu=8, nv=2),
        D("Grille", "front", (0.0, 0.80, zb - 0.02, zb + 0.16), v=lambda u: (0.0, 1.0 - 0.3 * u), nu=10, nv=2),
        D("Taillight", "rear", (0.40, 0.52, rt + 0.0, rt + 0.08), nu=2, nv=2, off=0.008),
        D("Taillight", "rear", (0.62, 0.74, rt + 0.0, rt + 0.08), nu=2, nv=2, off=0.008),
        D("Grille", "right", (-0.70, -0.20, 0.30, 0.58), v=v_taper_out(0.6), nu=4, nv=2),
    ] + diffuser(S, 0.85, 0.18)
    cars.append(S)

    # --- McLaren 720S (classe A) ------------------------------------------
    S = mid("mclaren_720s", 4.54, 1.93, 1.20, 2.67, 0.35, 0.27, gc=0.10, cabin=(0.25, 0.44, 0.57, 0.77),
            hood=0.50, nose=0.31, deck=0.68, belt=0.66, tail=0.62, tumble=0.60, roof_arc=0.06, ws_curve=0.65)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#ff7a1a"), spokes=10, spoke_style="single", rim_color=_rgb("#121214"),
             caliper=_rgb("#ff7a1a"), wing=dict(kind="lip", t=0.025, mat="Carbon"),
             exhaust=dict(n=2, x=0.20, r=0.055))
    S["decals"] = [
        D("Trim", "front", (0.48, 0.86, zt - 0.10, zt + 0.06), v=v_taper_in(0.3), nu=10, nv=3, off=0.005),
        D("Headlight", "front", (0.55, 0.80, zt - 0.02, zt + 0.03), v=v_taper_in(0.6), nu=8, nv=1, off=0.008),
        D("Grille", "front", (0.0, 0.70, zb - 0.02, zb + 0.10), nu=8, nv=1),
        D("Taillight", "rear", (0.55, 0.88, rt + 0.0, rt + 0.04), nu=8, nv=1),
        D("Grille", "rear", (0.0, 0.85, rb + 0.0, rt - 0.03), nu=8, nv=2, off=0.004),
    ]
    cars.append(S)

    # --- Ford GT (classe A) -----------------------------------------------
    S = mid("ford_gt", 4.76, 2.00, 1.11, 2.71, 0.35, 0.28, gc=0.09, cabin=(0.30, 0.45, 0.58, 0.76),
            hood=0.50, nose=0.30, deck=0.66, belt=0.66, tail=0.64, tumble=0.55, roof_arc=0.06, flare=0.07)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#0d47a1"), metallic=0.6, spokes=5, spoke_style="split", rim_color=_rgb("#121214"),
             caliper=_rgb("#c8102e"), wing=dict(kind="wing", t=0.03, h=0.10, chord=0.30, mat="Carbon"),
             exhaust=dict(n=2, x=0.10, r=0.065))
    S["decals"] = [
        D("Headlight", "front", (0.50, 0.86, zt - 0.03, zt + 0.06), v=v_taper_in(0.6), nu=8, nv=2),
        D("Grille", "front", (0.0, 0.55, zb - 0.02, zb + 0.18), v=lambda u: (0.0, 1.0 - 0.4 * u), nu=8, nv=2),
        D("Taillight", "rear", (0.50, 0.70, rt - 0.04, rt + 0.05), nu=3, nv=2, off=0.008),
    ] + stripes(S, 0.08, 0.20) + diffuser(S, 0.9, 0.2)
    cars.append(S)

    # --- Koenigsegg Jesko (classe S) --------------------------------------
    S = mid("jesko", 4.61, 2.03, 1.21, 2.70, 0.355, 0.29, gc=0.10, cabin=(0.27, 0.44, 0.57, 0.76),
            hood=0.50, nose=0.32, deck=0.68, belt=0.66, tail=0.62, tumble=0.62, roof_arc=0.07, ws_curve=0.7)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#e6e8ec"), metallic=0.85, spokes=10, spoke_style="single", rim_color=_rgb("#121214"),
             caliper=_rgb("#c8102e"),
             wing=dict(kind="wing", t=0.04, h=0.45, chord=0.40, span=1.95, mat="Carbon", swan=True),
             exhaust=dict(n=3, x=0.0, r=0.05), flare=0.05)
    S["decals"] = [
        D("Headlight", "front", (0.52, 0.84, zt - 0.02, zt + 0.06), v=v_taper_in(0.5), nu=8, nv=2),
        D("Grille", "front", (0.0, 0.60, zb - 0.02, zb + 0.20), v=lambda u: (0.0, 1.0 - 0.2 * u), nu=8, nv=2),
        D("Taillight", "rear", (0.55, 0.85, rt - 0.02, rt + 0.03), nu=6, nv=1),
        D("Carbon", "top", (0.0, 0.55, 1.2, 2.0), nu=3, nv=4, off=0.004),
    ] + diffuser(S, 0.9, 0.22)
    cars.append(S)

    # --- Bugatti Chiron (classe S) ----------------------------------------
    S = mid("chiron", 4.54, 2.04, 1.21, 2.71, 0.355, 0.29, gc=0.11, cabin=(0.27, 0.43, 0.56, 0.75),
            hood=0.55, nose=0.38, deck=0.66, belt=0.66, tail=0.62, tumble=0.64, roof_arc=0.06, ws_curve=0.7)
    zb, zt = front_z(S)
    rb, rt = rear_z(S)
    S.update(color=_rgb("#0b2a6b"), metallic=0.85, spokes=5, spoke_style="split", rim_color=_rgb("#c9cbd0"),
             caliper=_rgb("#1f5bff"), black_roof=True, wing=dict(kind="lip", t=0.03, mat="Carbon"),
             exhaust=dict(n=4, x=0.20, r=0.05), flare=0.04)
    S["decals"] = [
        D("Chrome", "front", (0.0, 0.17, zb + 0.06, zt - 0.02), v=lambda u: (0.0 + 0.5 * u * u, 1.0 - 0.1 * u * u),
          nu=4, nv=4, off=0.007),
        D("Grille", "front", (0.0, 0.15, zb + 0.08, zt - 0.04), v=lambda u: (0.0 + 0.5 * u * u, 1.0 - 0.1 * u * u),
          nu=4, nv=4, off=0.010),
        D("Headlight", "front", (0.50, 0.82, zt - 0.06, zt + 0.02), v=v_band(0.0, 1.0), nu=6, nv=2),
        D("Grille", "front", (0.25, 0.85, zb - 0.02, zb + 0.18), nu=8, nv=2),
        D("Taillight", "rear", (0.0, 0.92, rt + 0.0, rt + 0.03), nu=14, nv=1),
        D("Grille", "rear", (0.0, 0.85, rb + 0.0, rt - 0.03), nu=8, nv=2, off=0.004),
    ]
    cars.append(S)

    return cars


def traffic_specs():
    T = []
    S = sedan("t_sedan", 4.65, 1.80, 1.45, 2.75, 0.32, 0.215, gc=0.15, cabin=(0.18, 0.33, 0.60, 0.74))
    zb, zt = front_z(S); rb, rt = rear_z(S)
    S.update(color=_rgb("#8a8f99"), spokes=5, spoke_style="solid", rim_color=_rgb("#9a9ca0"), exhaust=dict(n=1, x=0.5, r=0.035),
             mirrors=False, subsurf=1, stations=34, wheel_segs=18)
    S["decals"] = [D("Grille", "front", (0.0, 0.40, zt - 0.17, zt - 0.05), nu=4, nv=2),
                   D("Headlight", "front", (0.42, 0.84, zt - 0.14, zt - 0.03), nu=6, nv=2),
                   D("Taillight", "rear", (0.50, 0.86, rt - 0.03, rt + 0.08), nu=4, nv=2),
                   D("Signal", "front", (0.80, 0.86, zt - 0.20, zt - 0.15), nu=1, nv=1, off=0.008),
                   D("Signal", "rear", (0.40, 0.48, rt - 0.03, rt + 0.03), nu=1, nv=1, off=0.008)] + plates(S)
    T.append(S)

    S = suv("t_suv", 4.70, 1.88, 1.72, 2.80, 0.36, 0.235, gc=0.20, cabin=(0.04, 0.10, 0.62, 0.75), lower_mat="Trim")
    zb, zt = front_z(S); rb, rt = rear_z(S)
    S.update(color=_rgb("#2b3a55"), spokes=6, spoke_style="solid", rim_color=_rgb("#9a9ca0"), exhaust=dict(n=1, x=0.5, r=0.035),
             roof_rails=True, mirrors=False, stations=34, wheel_segs=18)
    S["decals"] = [D("Grille", "front", (0.0, 0.50, zb + 0.20, zt - 0.06), nu=4, nv=2),
                   D("Headlight", "front", (0.52, 0.86, zt - 0.14, zt - 0.03), nu=6, nv=2),
                   D("Taillight", "rear", (0.60, 0.88, rt - 0.12, rt + 0.04), nu=2, nv=3),
                   D("Signal", "front", (0.78, 0.86, zt - 0.20, zt - 0.15), nu=1, nv=1, off=0.008),
                   D("Signal", "rear", (0.60, 0.70, rt - 0.16, rt - 0.12), nu=1, nv=1, off=0.008)] + plates(S)
    T.append(S)

    S = suv("t_hatch", 4.05, 1.75, 1.48, 2.55, 0.31, 0.205, gc=0.14, cabin=(0.04, 0.12, 0.58, 0.72), lower_mat="Paint",
            cladding_arches=False, tumble=0.76)
    zb, zt = front_z(S); rb, rt = rear_z(S)
    S.update(color=_rgb("#c23b22"), spokes=5, spoke_style="solid", rim_color=_rgb("#9a9ca0"), exhaust=dict(n=1, x=0.45, r=0.03),
             mirrors=False, stations=34, wheel_segs=18)
    S["decals"] = [D("Grille", "front", (0.0, 0.40, zb + 0.12, zt - 0.06), nu=4, nv=2),
                   D("Headlight", "front", (0.44, 0.84, zt - 0.13, zt - 0.02), nu=6, nv=2),
                   D("Taillight", "rear", (0.62, 0.86, rt - 0.14, rt + 0.04), nu=2, nv=3),
                   D("Signal", "front", (0.78, 0.84, zt - 0.20, zt - 0.15), nu=1, nv=1, off=0.008),
                   D("Signal", "rear", (0.62, 0.70, rt - 0.18, rt - 0.14), nu=1, nv=1, off=0.008)] + plates(S)
    T.append(S)

    S = suv("t_van", 5.10, 1.95, 2.25, 3.25, 0.34, 0.215, gc=0.18, cabin=(0.02, 0.04, 0.74, 0.86), lower_mat="Trim",
            cladding_arches=False, tumble=0.92, roof_arc=0.01, rw_curve=0.3, ws_curve=0.6)
    S["zt"] = [(0, 0.40 * 2.25), (0.02, 0.44 * 2.25), (0.5, 0.45 * 2.25), (0.86, 0.44 * 2.25), (0.95, 0.40 * 2.25),
               (1.0, 0.33 * 2.25)]
    S["bpillar"] = [(0.55, 0.57)]
    S["side_glass_t0"] = 0.55
    zb, zt = front_z(S); rb, rt = rear_z(S)
    S.update(color=_rgb("#e8e8e8"), metallic=0.1, spokes=5, spoke_style="solid", rim_color=_rgb("#9a9ca0"),
             exhaust=dict(n=1, x=0.5, r=0.035), mirrors=False, stations=30, wheel_segs=18)
    S["decals"] = [D("Grille", "front", (0.0, 0.50, zb + 0.15, zt - 0.10), nu=4, nv=2),
                   D("Headlight", "front", (0.55, 0.88, zt - 0.20, zt - 0.05), nu=4, nv=2),
                   D("Taillight", "rear", (0.80, 0.90, rt - 0.40, rt + 0.0), nu=1, nv=3),
                   D("Signal", "rear", (0.80, 0.90, rt - 0.48, rt - 0.42), nu=1, nv=1, off=0.008)] + plates(S)
    T.append(S)

    S = sedan("t_taxi", 4.65, 1.80, 1.45, 2.75, 0.32, 0.215, gc=0.15, cabin=(0.18, 0.33, 0.60, 0.74))
    zb, zt = front_z(S); rb, rt = rear_z(S)
    S.update(color=_rgb("#ffc400"), metallic=0.1, spokes=5, spoke_style="solid", rim_color=_rgb("#9a9ca0"),
             exhaust=dict(n=1, x=0.5, r=0.035), mirrors=False, stations=34, wheel_segs=18)
    S["decals"] = [D("Grille", "front", (0.0, 0.40, zt - 0.17, zt - 0.05), nu=4, nv=2),
                   D("Headlight", "front", (0.42, 0.84, zt - 0.14, zt - 0.03), nu=6, nv=2),
                   D("Taillight", "rear", (0.50, 0.86, rt - 0.03, rt + 0.08), nu=4, nv=2),
                   D("Signal", "rear", (0.40, 0.48, rt - 0.03, rt + 0.03), nu=1, nv=1, off=0.008)] + plates(S)
    S["boxes"] = [dict(mat="Plate", c=(0, -0.05, 1.49), s=(0.5, 0.22, 0.12), bevel=0.02)]
    T.append(S)

    S = suv("t_bus", 11.0, 2.50, 3.10, 6.0, 0.48, 0.30, gc=0.25, cabin=(0.015, 0.025, 0.95, 0.985), lower_mat="Trim",
            cladding_arches=False, tumble=0.96, roof_arc=0.0, rw_curve=0.3, ws_curve=0.5, shoulder_in=0.99, belt_in=0.98)
    S["zt"] = [(0, 1.20), (0.5, 1.25), (0.97, 1.25), (1.0, 1.15)]
    S["zb"] = [(0, 0.40), (0.02, 0.30), (0.98, 0.30), (1.0, 0.40)]
    S["w"] = [(0, 0.96), (0.01, 0.995), (0.5, 1.0), (0.99, 0.995), (1.0, 0.96)]
    S["bpillar"] = [(0.18, 0.19), (0.34, 0.35), (0.50, 0.51), (0.66, 0.67), (0.82, 0.83)]
    S["side_glass_t0"] = 0.04
    S["side_glass_t1"] = 0.98
    zb, zt = front_z(S, 0.995); rb, rt = rear_z(S, 0.005)
    S.update(color=_rgb("#d32f2f"), metallic=0.1, spokes=8, spoke_style="solid", rim_color=_rgb("#9a9ca0"),
             exhaust=dict(n=0), mirrors=False, stations=26, wheel_segs=18, fo=2.4)
    S["decals"] = [D("Headlight", "front", (0.80, 1.10, 0.55, 0.75), nu=2, nv=1),
                   D("Taillight", "rear", (0.95, 1.15, 0.60, 1.0), nu=1, nv=2),
                   D("Stripe", "right", (-5.0, 5.0, 0.95, 1.10), nu=10, nv=1, off=0.006)]
    T.append(S)
    return T
