#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Génère toutes les textures procédurales du jeu (numpy + Pillow).
Sortie : game/assets/textures/, game/assets/sky/, game/assets/ui/
"""
import math
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
TEX = os.path.join(ROOT, "game", "assets", "textures")
SKY = os.path.join(ROOT, "game", "assets", "sky")
UI = os.path.join(ROOT, "game", "assets", "ui")
FONT = os.path.join(ROOT, "game", "assets", "fonts", "BarlowCondensed-800i.ttf")
for d in (TEX, SKY, UI):
    os.makedirs(d, exist_ok=True)

rng = np.random.default_rng(1234)


# ---------------------------------------------------------------------------
# Bruit
# ---------------------------------------------------------------------------

def fnoise(h, w, beta=2.0, seed=None):
    """Bruit fractal raccordable (filtrage 1/f dans le domaine de Fourier)."""
    r = np.random.default_rng(seed) if seed is not None else rng
    white = r.standard_normal((h, w))
    F = np.fft.fft2(white)
    fy = np.fft.fftfreq(h)[:, None]
    fx = np.fft.fftfreq(w)[None, :]
    f = np.sqrt(fx ** 2 + fy ** 2)
    f[0, 0] = 1.0
    F = F / f ** (beta / 2.0)
    F[0, 0] = 0
    n = np.real(np.fft.ifft2(F))
    n = (n - n.min()) / (n.max() - n.min() + 1e-9)
    return n


def save_rgb(arr, path):
    arr = np.clip(arr, 0, 1)
    Image.fromarray((arr * 255 + 0.5).astype(np.uint8)).save(path)


def normal_from_height(hm, strength=2.0):
    gy, gx = np.gradient(hm)
    nx = -gx * strength
    ny = gy * strength  # convention OpenGL (Y+)
    nz = np.ones_like(hm)
    ln = np.sqrt(nx * nx + ny * ny + nz * nz)
    n = np.stack([nx / ln, ny / ln, nz / ln], axis=-1)
    return n * 0.5 + 0.5


def wrap_gradient(hm):
    gx = (np.roll(hm, -1, 1) - np.roll(hm, 1, 1)) * 0.5
    gy = (np.roll(hm, -1, 0) - np.roll(hm, 1, 0)) * 0.5
    return gx, gy


def normal_tile(hm, strength=2.0):
    gx, gy = wrap_gradient(hm)
    nx = -gx * strength
    ny = gy * strength
    nz = np.ones_like(hm)
    ln = np.sqrt(nx * nx + ny * ny + nz * nz)
    return np.stack([nx / ln, ny / ln, nz / ln], axis=-1) * 0.5 + 0.5


# ---------------------------------------------------------------------------
# Sol : asphalte, béton, sable, herbe, roche
# ---------------------------------------------------------------------------

def asphalt():
    S = 1024
    big = fnoise(S, S, 3.2, 1)
    mid = fnoise(S, S, 2.0, 2)
    fine = fnoise(S, S, 0.3, 3)
    base = 0.17 + 0.05 * (big - 0.5) + 0.04 * (mid - 0.5) + 0.09 * (fine - 0.5)
    # granulats clairs
    spots = (rng.random((S, S)) > 0.985).astype(float)
    spots = np.array(Image.fromarray((spots * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))) / 255.0
    base += spots * 0.12
    # rapiéçages
    patch = fnoise(S, S, 3.8, 4)
    base = np.where(patch > 0.78, base * 0.82, base)
    col = np.stack([base * 0.98, base * 0.99, base * 1.04], -1)
    save_rgb(col, os.path.join(TEX, "asphalt_albedo.png"))
    h = 0.6 * fine + 0.3 * spots + 0.1 * mid
    save_rgb(normal_tile(h, 6.0), os.path.join(TEX, "asphalt_normal.png"))
    # rugosité dans le canal R (Godot : roughness texture channel)
    rough = 0.82 + 0.12 * (fine - 0.5) - 0.2 * spots
    rough = np.where(patch > 0.78, rough - 0.08, rough)
    save_rgb(np.stack([rough] * 3, -1), os.path.join(TEX, "asphalt_rough.png"))


def asphalt_wet():
    """Variante nuit (Tokyo) : plus sombre et brillante."""
    S = 512
    fine = fnoise(S, S, 0.4, 13)
    big = fnoise(S, S, 3.0, 14)
    base = 0.09 + 0.03 * (big - 0.5) + 0.05 * (fine - 0.5)
    col = np.stack([base, base, base * 1.08], -1)
    save_rgb(col, os.path.join(TEX, "asphalt_wet_albedo.png"))
    puddle = fnoise(S, S, 3.5, 15)
    rough = np.clip(0.55 - 0.45 * (puddle > 0.62) + 0.08 * (fine - 0.5), 0.05, 1)
    save_rgb(np.stack([rough] * 3, -1), os.path.join(TEX, "asphalt_wet_rough.png"))


def concrete():
    S = 512
    n = fnoise(S, S, 1.2, 5)
    f = fnoise(S, S, 0.2, 6)
    base = 0.55 + 0.08 * (n - 0.5) + 0.06 * (f - 0.5)
    img = np.stack([base * 1.0, base * 0.98, base * 0.94], -1)
    # joints de dalles tous les 1/2 de texture (texture = 4 m -> dalles 2 m)
    for k in (0, S // 2):
        img[max(k - 2, 0):k + 2, :, :] *= 0.6
        img[:, max(k - 2, 0):k + 2, :] *= 0.6
    img[-2:, :, :] *= 0.6
    img[:, -2:, :] *= 0.6
    save_rgb(img, os.path.join(TEX, "concrete_albedo.png"))


def sand():
    S = 512
    n = fnoise(S, S, 2.2, 7)
    f = fnoise(S, S, 0.4, 8)
    b = 0.62 + 0.10 * (n - 0.5) + 0.06 * (f - 0.5)
    save_rgb(np.stack([b * 1.0, b * 0.82, b * 0.6], -1), os.path.join(TEX, "sand_albedo.png"))


def grass():
    S = 512
    n = fnoise(S, S, 2.5, 9)
    f = fnoise(S, S, 0.3, 10)
    g = 0.30 + 0.12 * (n - 0.5) + 0.1 * (f - 0.5)
    save_rgb(np.stack([g * 0.55, g * 1.0, g * 0.38], -1), os.path.join(TEX, "grass_albedo.png"))


def rock():
    S = 512
    n = fnoise(S, S, 2.6, 11)
    f = fnoise(S, S, 0.8, 12)
    strata = 0.5 + 0.5 * np.sin(np.linspace(0, 18 * math.pi, S))[:, None] * np.ones((1, S))
    b = 0.45 + 0.15 * (n - 0.5) + 0.08 * (f - 0.5) + 0.05 * strata
    save_rgb(np.stack([b * 1.0, b * 0.62, b * 0.42], -1), os.path.join(TEX, "rock_albedo.png"))
    save_rgb(normal_tile(0.6 * n + 0.4 * f, 8.0), os.path.join(TEX, "rock_normal.png"))


def water_normal():
    S = 512
    h = 0.6 * fnoise(S, S, 2.4, 21) + 0.4 * fnoise(S, S, 1.6, 22)
    save_rgb(normal_tile(h, 10.0), os.path.join(TEX, "water_normal.png"))


# ---------------------------------------------------------------------------
# Façades (texture = 2 x 2 modules d'étage de 3.5 m ; alpha = masque de teinte)
# ---------------------------------------------------------------------------

def _img(S, color):
    return Image.new("RGBA", (S, S), color)


def facade(style, seed):
    S = 1024
    U = S // 2  # un module
    r = np.random.default_rng(seed)
    im = Image.new("RGBA", (S, S), (200, 200, 200, 255))
    em = Image.new("RGB", (S, S), (0, 0, 0))
    d = ImageDraw.Draw(im)
    de = ImageDraw.Draw(em)
    if style == "victorian":
        # bardage horizontal teintable (alpha 255 = teinte)
        for y in range(0, S, 12):
            d.rectangle([0, y, S, y + 10], fill=(225, 225, 225, 255))
            d.line([0, y + 11, S, y + 11], fill=(150, 150, 150, 255), width=2)
        for mx in range(2):
            for my in range(2):
                x0, y0 = mx * U, my * U
                # fenêtre haute avec cadre blanc (non teinté)
                wx0, wx1 = x0 + 150, x0 + 362
                wy0, wy1 = y0 + 90, y0 + 430
                d.rectangle([wx0 - 22, wy0 - 40, wx1 + 22, wy1 + 26], fill=(245, 245, 240, 0))
                d.rectangle([wx0 - 30, wy0 - 60, wx1 + 30, wy0 - 38], fill=(250, 250, 248, 0))  # fronton
                d.rectangle([wx0, wy0, wx1, wy1], fill=(30, 38, 48, 0))
                d.line([(wx0 + wx1) // 2, wy0, (wx0 + wx1) // 2, wy1], fill=(245, 245, 240, 0), width=12)
                d.line([wx0, (wy0 + wy1) // 2 - 30, wx1, (wy0 + wy1) // 2 - 30], fill=(245, 245, 240, 0), width=12)
                # reflets
                d.polygon([(wx0 + 10, wy1 - 10), (wx0 + 90, wy0 + 10), (wx0 + 130, wy0 + 10), (wx0 + 50, wy1 - 10)],
                          fill=(70, 85, 100, 0))
                if r.random() < 0.35:
                    de.rectangle([wx0, wy0, wx1, wy1], fill=(255, 196, 120))
                # pilastres
                d.rectangle([x0 + 10, y0, x0 + 38, y0 + U], fill=(240, 240, 235, 0))
                d.rectangle([x0 + U - 38, y0, x0 + U - 10, y0 + U], fill=(240, 240, 235, 0))
            # corniche
        for y in (0, U):
            d.rectangle([0, y, S, y + 24], fill=(245, 245, 240, 0))
            for x in range(0, S, 32):
                d.rectangle([x, y + 24, x + 16, y + 40], fill=(235, 235, 230, 0))
    elif style == "office":
        im.paste((60, 78, 96, 40), [0, 0, S, S])
        for mx in range(4):
            for my in range(4):
                x0, y0 = mx * U // 2, my * U // 2
                shade = int(r.integers(60, 110))
                d.rectangle([x0 + 8, y0 + 8, x0 + U // 2 - 8, y0 + U // 2 - 30],
                            fill=(shade - 20, shade, shade + 30, 30))
                d.polygon([(x0 + 8, y0 + U // 2 - 30), (x0 + 120, y0 + 8), (x0 + 170, y0 + 8),
                           (x0 + 60, y0 + U // 2 - 30)], fill=(shade + 10, shade + 30, shade + 60, 30))
                d.rectangle([x0, y0 + U // 2 - 30, x0 + U // 2, y0 + U // 2], fill=(150, 155, 165, 255))
                if r.random() < 0.45:
                    de.rectangle([x0 + 8, y0 + 8, x0 + U // 2 - 8, y0 + U // 2 - 30],
                                 fill=(int(r.integers(200, 255)), int(r.integers(190, 240)), 170))
            d.rectangle([mx * U // 2, 0, mx * U // 2 + 10, S], fill=(170, 175, 185, 255))
    elif style == "brick":
        for y in range(0, S, 22):
            off = 0 if (y // 22) % 2 == 0 else 24
            for x in range(-48, S, 48):
                c = int(r.integers(150, 200))
                d.rectangle([x + off, y, x + off + 44, y + 18], fill=(c, int(c * 0.55), int(c * 0.45), 255))
        for mx in range(2):
            for my in range(2):
                x0, y0 = mx * U, my * U
                for k in range(2):
                    wx0 = x0 + 70 + k * 200
                    d.rectangle([wx0 - 10, y0 + 110, wx0 + 150, y0 + 400], fill=(220, 215, 205, 0))
                    d.rectangle([wx0, y0 + 120, wx0 + 140, y0 + 390], fill=(28, 34, 42, 0))
                    d.line([wx0 + 70, y0 + 120, wx0 + 70, y0 + 390], fill=(220, 215, 205, 0), width=8)
                    if r.random() < 0.4:
                        de.rectangle([wx0, y0 + 120, wx0 + 140, y0 + 390], fill=(255, 190, 110))
    elif style == "stucco":
        n = fnoise(S, S, 1.0, seed)
        arr = (205 + 30 * (n - 0.5)).astype(np.uint8)
        base = np.stack([arr, arr, arr, np.full_like(arr, 255)], -1)
        im = Image.fromarray(base, "RGBA")
        d = ImageDraw.Draw(im)
        for mx in range(2):
            for my in range(2):
                x0, y0 = mx * U, my * U
                d.rectangle([x0 + 110, y0 + 150, x0 + 400, y0 + 380], fill=(60, 50, 45, 0))
                d.rectangle([x0 + 120, y0 + 160, x0 + 390, y0 + 370], fill=(35, 45, 58, 0))
                d.line([x0 + 255, y0 + 160, x0 + 255, y0 + 370], fill=(60, 50, 45, 0), width=8)
                if r.random() < 0.4:
                    de.rectangle([x0 + 120, y0 + 160, x0 + 390, y0 + 370], fill=(255, 200, 130))
    elif style == "tokyo":
        im.paste((70, 72, 80, 255), [0, 0, S, S])
        for row in range(8):
            y0 = row * S // 8
            d.rectangle([0, y0 + 20, S, y0 + 100], fill=(25, 30, 40, 0))
            for x in range(0, S, 64):
                d.rectangle([x, y0 + 20, x + 6, y0 + 100], fill=(90, 92, 100, 0))
                if r.random() < 0.55:
                    c = [(255, 240, 210), (200, 230, 255), (255, 210, 160), (220, 255, 255)][int(r.integers(0, 4))]
                    de.rectangle([x + 6, y0 + 20, x + 64, y0 + 100], fill=c)
            d.rectangle([0, y0 + 100, S, y0 + 128], fill=(110, 112, 120, 255))
    elif style == "shop":
        im.paste((50, 50, 55, 255), [0, 0, S, S])
        for mx in range(2):
            x0 = mx * U
            # vitrine
            d.rectangle([x0 + 20, 380, x0 + U - 20, S], fill=(25, 30, 36, 0))
            d.rectangle([x0 + 20, 380, x0 + U - 20, 400], fill=(200, 200, 205, 0))
            d.line([x0 + U // 2, 400, x0 + U // 2, S], fill=(160, 160, 165, 0), width=10)
            de.rectangle([x0 + 30, 410, x0 + U - 30, S - 10], fill=(255, 225, 170))
            # store / auvent rayé teintable
            for k in range(0, U - 40, 40):
                c = 255 if (k // 40) % 2 == 0 else 200
                d.polygon([(x0 + 20 + k, 250), (x0 + 60 + k, 250), (x0 + 60 + k, 370), (x0 + 20 + k, 370)],
                          fill=(c, c, c, 255))
            d.rectangle([x0 + 20, 360, x0 + U - 20, 378], fill=(240, 240, 240, 255))
            # enseigne
            d.rectangle([x0 + 60, 140, x0 + U - 60, 230], fill=(20, 20, 24, 0))
            de.rectangle([x0 + 70, 150, x0 + U - 70, 220],
                         fill=[(255, 60, 160), (60, 200, 255), (255, 200, 40), (140, 80, 255)][int(r.integers(0, 4))])
        d.rectangle([0, 0, S, 120], fill=(205, 205, 205, 255))
    im = im.resize((512, 512), Image.LANCZOS)
    em = em.resize((512, 512), Image.LANCZOS)
    im.save(os.path.join(TEX, "facade_%s.png" % style))
    em.save(os.path.join(TEX, "facade_%s_emit.png" % style))


def roof_tex():
    S = 256
    n = fnoise(S, S, 1.5, 31)
    b = 0.35 + 0.1 * (n - 0.5)
    save_rgb(np.stack([b, b, b * 1.02], -1), os.path.join(TEX, "roof_albedo.png"))


# ---------------------------------------------------------------------------
# Néons, panneaux publicitaires, rampes, pneus, palmiers
# ---------------------------------------------------------------------------

def font(size):
    try:
        return ImageFont.truetype(FONT, size)
    except Exception:
        return ImageFont.load_default()


def neon_atlas():
    S = 1024
    im = Image.new("RGB", (S, S), (6, 4, 10))
    cols = [(255, 40, 160), (40, 220, 255), (255, 210, 40), (160, 70, 255), (60, 255, 140), (255, 90, 40),
            (255, 255, 255), (255, 60, 90)]
    words = ["NITRO", "ラーメン", "UNITE", "カラオケ", "TURBO", "ホテル", "DRIFT", "寿司"]
    r = np.random.default_rng(77)
    for i in range(8):
        cx, cy = (i % 2) * 512, (i // 2) * 256
        c = cols[i]
        glow = Image.new("RGB", (512, 256), (0, 0, 0))
        g = ImageDraw.Draw(glow)
        g.rounded_rectangle([14, 14, 498, 242], radius=26, outline=c, width=10)
        w = words[i]
        if all(ord(ch) < 128 for ch in w):
            f = font(150)
            tw = g.textlength(w, font=f)
            g.text((256 - tw / 2, 40), w, font=f, fill=c)
        else:
            # glyphes stylisés (blocs) pour évoquer des caractères
            for k in range(4):
                x0 = 60 + k * 100
                for _ in range(5):
                    x = x0 + int(r.integers(0, 60))
                    y = 50 + int(r.integers(0, 120))
                    if r.random() < 0.5:
                        g.rectangle([x, y, x + int(r.integers(20, 70)), y + 12], fill=c)
                    else:
                        g.rectangle([x, y, x + 12, y + int(r.integers(20, 90))], fill=c)
        blur = glow.filter(ImageFilter.GaussianBlur(10))
        out = Image.blend(blur, glow, 0.6)
        im.paste(out, (cx, cy))
    im.save(os.path.join(TEX, "neon_atlas.png"))


def billboards():
    W, H = 1024, 1024
    im = Image.new("RGB", (W, H), (0, 0, 0))
    ads = [("NITRO COLA", (220, 20, 60), (255, 255, 255), "BOOSTE TA SOIF"),
           ("TURBO FUEL", (20, 30, 60), (255, 200, 0), "PLEIN DE PUISSANCE"),
           ("UNITE FM", (120, 40, 255), (255, 255, 255), "LA RADIO DES PILOTES"),
           ("GRIP TIRES", (10, 10, 12), (60, 220, 120), "ADHÉRENCE MAXIMALE")]
    for i, (title, bg, fg, sub) in enumerate(ads):
        x0, y0 = 0, i * 256
        tile = Image.new("RGB", (W, 256), bg)
        d = ImageDraw.Draw(tile)
        for k in range(0, W, 60):
            d.polygon([(k, 256), (k + 30, 256), (k + 130, 0), (k + 100, 0)],
                      fill=tuple(min(255, int(c * 1.15) + 10) for c in bg))
        f = font(150)
        tw = d.textlength(title, font=f)
        d.text((W / 2 - tw / 2 + 4, 14 + 4), title, font=f, fill=(0, 0, 0))
        d.text((W / 2 - tw / 2, 14), title, font=f, fill=fg)
        f2 = font(54)
        tw = d.textlength(sub, font=f2)
        d.text((W / 2 - tw / 2, 180), sub, font=f2, fill=(255, 255, 255))
        im.paste(tile, (x0, y0))
    im.save(os.path.join(TEX, "billboards.png"))


def ramp_stripes():
    W, H = 512, 1024
    im = Image.new("RGB", (W, H), (25, 25, 28))
    d = ImageDraw.Draw(im)
    for k in range(-H, H * 2, 160):
        d.polygon([(0, k), (W // 2, k - 160), (W, k), (W, k + 80), (W // 2, k - 80), (0, k + 80)],
                  fill=(255, 196, 0))
    d.rectangle([0, 0, 24, H], fill=(230, 230, 230))
    d.rectangle([W - 24, 0, W, H], fill=(230, 230, 230))
    n = fnoise(H, W, 1.0, 41)
    arr = np.array(im).astype(float) / 255.0
    arr *= (0.85 + 0.25 * n)[:, :, None]
    save_rgb(arr, os.path.join(TEX, "ramp_stripes.png"))


def tire_tread():
    W, H = 256, 64
    im = Image.new("RGB", (W, H), (18, 18, 18))
    d = ImageDraw.Draw(im)
    for x in range(0, W, 16):
        d.line([(x, 8), (x + 8, 32), (x, 56)], fill=(8, 8, 8), width=4)
    d.rectangle([0, 0, W, 6], fill=(30, 30, 30))
    d.rectangle([0, H - 6, W, H], fill=(30, 30, 30))
    im.save(os.path.join(TEX, "tire_tread.png"))


def palm_leaf():
    W, H = 512, 256
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    # nervure centrale le long de x, folioles de part et d'autre
    for i in range(60):
        t = i / 60
        x = 10 + t * (W - 30)
        width = math.sin(t * math.pi) ** 0.7 * 110 + 6
        for s in (-1, 1):
            d.line([(x, H / 2), (x + 26, H / 2 + s * width)], fill=(50, 110, 40, 255), width=7)
            d.line([(x + 2, H / 2), (x + 28, H / 2 + s * width * 0.96)], fill=(80, 150, 55, 255), width=3)
    d.line([(10, H / 2), (W - 20, H / 2)], fill=(110, 95, 50, 255), width=6)
    im = im.filter(ImageFilter.SMOOTH)
    im.save(os.path.join(TEX, "palm_leaf.png"))


def foliage():
    S = 512
    n = fnoise(S, S, 0.8, 51)
    m = fnoise(S, S, 2.0, 52)
    g = 0.18 + 0.25 * n + 0.08 * (m - 0.5)
    save_rgb(np.stack([g * 0.55, g * 1.0, g * 0.35], -1), os.path.join(TEX, "foliage_albedo.png"))


def crowd_flags():
    """Banderole d'arrivée damier + texte FINISH."""
    W, H = 1024, 256
    im = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(im)
    for x in range(0, W, 32):
        for y in (0, 32, H - 64, H - 32):
            if ((x // 32) + (y // 32)) % 2 == 0:
                d.rectangle([x, y, x + 32, y + 32], fill=(10, 10, 10))
    d.rectangle([0, 64, W, H - 64], fill=(170, 40, 255))
    f = font(130)
    tw = d.textlength("FINISH", font=f)
    d.text((W / 2 - tw / 2, 48), "FINISH", font=f, fill=(255, 255, 255))
    im.save(os.path.join(TEX, "finish_banner.png"))
    im2 = Image.new("RGB", (W, H), (20, 10, 40))
    d = ImageDraw.Draw(im2)
    d.rectangle([0, 0, W, 20], fill=(255, 200, 0))
    d.rectangle([0, H - 20, W, H], fill=(255, 200, 0))
    tw = d.textlength("START", font=f)
    d.text((W / 2 - tw / 2, 48), "START", font=f, fill=(255, 255, 255))
    im2.save(os.path.join(TEX, "start_banner.png"))


# ---------------------------------------------------------------------------
# Ciels (panoramas équirectangulaires)
# ---------------------------------------------------------------------------

def sky(name, zenith, horizon, ground, sun_dir, sun_col, sun_size, cloud_amt, cloud_col, skyline=None,
        stars=False, glow_col=None, W=2048, H=1024, seed=0):
    yy, xx = np.mgrid[0:H, 0:W]
    lon = (xx + 0.5) / W * 2 * math.pi - math.pi
    lat = math.pi / 2 - (yy + 0.5) / H * math.pi
    dx = np.cos(lat) * np.sin(lon)
    dy = np.sin(lat)
    dz = -np.cos(lat) * np.cos(lon)
    e = np.clip(dy, -1, 1)
    zen = np.array(zenith)[None, None, :]
    hor = np.array(horizon)[None, None, :]
    gnd = np.array(ground)[None, None, :]
    t = np.clip(e, 0, 1) ** 0.45
    col = hor * (1 - t[..., None]) + zen * t[..., None]
    below = e < 0
    tb = np.clip(-e * 6, 0, 1)[..., None]
    col = np.where(below[..., None], hor * (1 - tb) + gnd * tb, col)
    # soleil
    sd = np.array(sun_dir, float)
    sd /= np.linalg.norm(sd)
    cosang = dx * sd[0] + dy * sd[1] + dz * sd[2]
    sc = np.array(sun_col)[None, None, :]
    halo = np.clip(cosang, 0, 1) ** 8 * 0.35 + np.clip(cosang, 0, 1) ** 64 * 0.6
    disc = (cosang > math.cos(math.radians(sun_size))).astype(float)
    col = col + sc * halo[..., None] + sc * disc[..., None] * 3.0
    if glow_col is not None:
        gl = np.exp(-np.clip(e, 0, 1) * 18)[..., None] * np.array(glow_col)[None, None, :]
        col = col + np.where((e >= -0.02)[..., None], gl, 0)
    # nuages (projection plane)
    if cloud_amt > 0:
        cn = fnoise(512, 512, 2.3, 100 + seed)
        cn2 = fnoise(512, 512, 1.4, 200 + seed)
        up = np.clip(dy, 0.02, 1)
        u = (dx / up * 0.18) % 1.0
        v = (dz / up * 0.18) % 1.0
        iu = (u * 511).astype(int)
        iv = (v * 511).astype(int)
        c = cn[iv, iu] * 0.7 + cn2[iv, iu] * 0.3
        c = np.clip((c - (1 - cloud_amt)) / max(cloud_amt, 1e-3) * 1.6, 0, 1)
        fade = np.clip((dy - 0.02) * 6, 0, 1)
        c = c * fade
        cc = np.array(cloud_col)[None, None, :] * (0.75 + 0.35 * np.clip(cosang, 0, 1)[..., None] ** 2)
        col = col * (1 - c[..., None]) + cc * c[..., None]
    if stars:
        st = (rng.random((H, W)) > 0.9975) & (e > 0.05)
        col = col + st[..., None] * 0.9
    # silhouette d'horizon (ville / collines)
    if skyline is not None:
        kind, scol, maxh = skyline
        r = np.random.default_rng(seed + 9)
        prof = np.zeros(W)
        if kind == "city":
            x = 0
            while x < W:
                w = int(r.integers(8, 40))
                h = r.random() ** 2.2 * maxh
                prof[x:x + w] = h
                x += w
            prof = np.maximum(prof, 0.004)
        elif kind == "hills":
            n1 = fnoise(1, W, 3.0, seed + 3)[0]
            prof = (0.3 + 0.7 * n1) * maxh
        elif kind == "mesa":
            n1 = fnoise(1, W, 3.6, seed + 4)[0]
            prof = np.where(n1 > 0.45, maxh * (0.6 + 0.4 * n1), maxh * 0.25 * n1)
        latp = np.arcsin(np.clip(prof, 0, 0.5))
        mask = (lat >= -0.01) & (lat < latp[xx])
        sk = np.array(scol)[None, None, :]
        # éclairage des fenêtres pour la ville la nuit
        col = np.where(mask[..., None], sk * (1.0 - 0.3 * (lat / (latp[xx] + 1e-4)))[..., None] *
                       np.ones_like(col) if False else sk, col)
        if kind == "city" and stars:
            win = (rng.random((H, W)) > 0.93) & mask
            col = col + win[..., None] * np.array([0.9, 0.7, 0.4])[None, None, :] * 0.5
    col = np.clip(col, 0, 4)
    # tonemapping doux vers sRGB 8 bits
    out = 1 - np.exp(-col * 1.25)
    out = out ** (1 / 1.6)
    Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8)).save(os.path.join(SKY, name + ".png"))


def skies():
    sky("sky_sf", zenith=(0.12, 0.32, 0.85), horizon=(0.65, 0.78, 0.95), ground=(0.25, 0.27, 0.3),
        sun_dir=(0.45, 0.62, -0.62), sun_col=(1.0, 0.92, 0.8), sun_size=1.2, cloud_amt=0.42,
        cloud_col=(1.0, 1.0, 1.0), skyline=("hills", (0.42, 0.5, 0.58), 0.05), seed=1)
    sky("sky_la", zenith=(0.16, 0.10, 0.42), horizon=(1.0, 0.45, 0.25), ground=(0.2, 0.12, 0.15),
        sun_dir=(-0.2, 0.08, -0.97), sun_col=(1.0, 0.55, 0.25), sun_size=2.2, cloud_amt=0.35,
        cloud_col=(0.95, 0.5, 0.55), skyline=("city", (0.2, 0.1, 0.22), 0.07), glow_col=(0.6, 0.2, 0.3), seed=2)
    sky("sky_tokyo", zenith=(0.01, 0.01, 0.05), horizon=(0.12, 0.06, 0.25), ground=(0.02, 0.02, 0.04),
        sun_dir=(0.3, 0.5, 0.8), sun_col=(0.0, 0.0, 0.0), sun_size=0.1, cloud_amt=0.25,
        cloud_col=(0.10, 0.06, 0.18), skyline=("city", (0.03, 0.02, 0.06), 0.12), stars=True,
        glow_col=(0.45, 0.12, 0.55), seed=3)
    sky("sky_desert", zenith=(0.2, 0.45, 0.9), horizon=(0.9, 0.85, 0.78), ground=(0.6, 0.45, 0.3),
        sun_dir=(-0.3, 0.8, 0.45), sun_col=(1.0, 0.95, 0.85), sun_size=1.4, cloud_amt=0.18,
        cloud_col=(1.0, 1.0, 1.0), skyline=("mesa", (0.62, 0.4, 0.3), 0.07), seed=4)


# ---------------------------------------------------------------------------
# Interface (icônes)
# ---------------------------------------------------------------------------

def aa(draw_fn, size, scale=4):
    big = Image.new("RGBA", (size[0] * scale, size[1] * scale), (0, 0, 0, 0))
    draw_fn(ImageDraw.Draw(big), scale, big)
    return big.resize(size, Image.LANCZOS)


def ui_icons():
    Y = (255, 216, 0, 255)
    W = (255, 255, 255, 255)

    def coin(d, s, img):
        d.ellipse([4 * s, 4 * s, 60 * s, 60 * s], fill=(255, 196, 0, 255), outline=(170, 110, 0, 255), width=4 * s)
        d.ellipse([12 * s, 12 * s, 52 * s, 52 * s], outline=(255, 235, 120, 255), width=3 * s)
        f = font(44 * s)
        d.text((22 * s, 6 * s), "C", font=f, fill=(150, 90, 0, 255))
    aa(coin, (64, 64)).save(os.path.join(UI, "icon_credits.png"))

    def token(d, s, img):
        pts = [(32 + 28 * math.cos(math.radians(60 * k + 30)), 32 + 28 * math.sin(math.radians(60 * k + 30)))
               for k in range(6)]
        d.polygon([(x * s, y * s) for x, y in pts], fill=(40, 120, 255, 255), outline=(150, 210, 255, 255))
        d.polygon([(32 * s, 14 * s), (46 * s, 46 * s), (18 * s, 46 * s)], fill=(10, 30, 80, 255))
        d.polygon([(32 * s, 24 * s), (40 * s, 42 * s), (24 * s, 42 * s)], fill=(120, 200, 255, 255))
    aa(token, (64, 64)).save(os.path.join(UI, "icon_tokens.png"))

    def star(d, s, img, fill=Y):
        pts = []
        for k in range(10):
            r = 28 if k % 2 == 0 else 12
            a = math.radians(-90 + 36 * k)
            pts.append(((32 + r * math.cos(a)) * s, (34 + r * math.sin(a)) * s))
        d.polygon(pts, fill=fill)
    aa(star, (64, 64)).save(os.path.join(UI, "icon_star.png"))
    aa(lambda d, s, i: star(d, s, i, (90, 80, 110, 255)), (64, 64)).save(os.path.join(UI, "icon_star_empty.png"))

    def lock(d, s, img):
        d.rounded_rectangle([14 * s, 28 * s, 50 * s, 58 * s], radius=5 * s, fill=W)
        d.arc([20 * s, 8 * s, 44 * s, 40 * s], 180, 360, fill=W, width=6 * s)
        d.line([20 * s, 24 * s, 20 * s, 30 * s], fill=W, width=6 * s)
        d.line([44 * s, 24 * s, 44 * s, 30 * s], fill=W, width=6 * s)
        d.ellipse([28 * s, 36 * s, 36 * s, 44 * s], fill=(200, 30, 40, 255))
    aa(lock, (64, 64)).save(os.path.join(UI, "icon_lock.png"))

    def flag(d, s, img):
        d.line([14 * s, 8 * s, 14 * s, 58 * s], fill=W, width=5 * s)
        for i in range(4):
            for j in range(3):
                c = W if (i + j) % 2 == 0 else (20, 20, 20, 255)
                d.rectangle([(16 + i * 9) * s, (8 + j * 8) * s, (25 + i * 9) * s, (16 + j * 8) * s], fill=c)
    aa(flag, (64, 64)).save(os.path.join(UI, "icon_flag.png"))

    def fuel(d, s, img):
        d.rounded_rectangle([14 * s, 12 * s, 44 * s, 58 * s], radius=4 * s, fill=W)
        d.rectangle([18 * s, 18 * s, 40 * s, 30 * s], fill=(30, 30, 30, 255))
        d.line([44 * s, 24 * s, 54 * s, 30 * s, 54 * s, 50 * s], fill=W, width=4 * s)
    aa(fuel, (64, 64)).save(os.path.join(UI, "icon_fuel.png"))

    def bp(d, s, img):
        d.rounded_rectangle([12 * s, 6 * s, 52 * s, 58 * s], radius=4 * s, fill=(230, 230, 240, 255))
        d.rectangle([16 * s, 10 * s, 48 * s, 40 * s], fill=(60, 120, 255, 255))
        d.line([20 * s, 48 * s, 44 * s, 48 * s], fill=(60, 60, 70, 255), width=3 * s)
    aa(bp, (64, 64)).save(os.path.join(UI, "icon_blueprint.png"))

    def gear(d, s, img):
        cx, cy = 32 * s, 32 * s
        for k in range(8):
            a = math.radians(45 * k)
            d.line([cx, cy, cx + 26 * s * math.cos(a), cy + 26 * s * math.sin(a)], fill=W, width=10 * s)
        d.ellipse([12 * s, 12 * s, 52 * s, 52 * s], fill=W)
        d.ellipse([24 * s, 24 * s, 40 * s, 40 * s], fill=(0, 0, 0, 0))
    aa(gear, (64, 64)).save(os.path.join(UI, "icon_settings.png"))

    def trophy(d, s, img):
        d.rectangle([20 * s, 8 * s, 44 * s, 30 * s], fill=Y)
        d.ellipse([20 * s, 18 * s, 44 * s, 40 * s], fill=Y)
        d.rectangle([29 * s, 38 * s, 35 * s, 50 * s], fill=Y)
        d.rectangle([20 * s, 50 * s, 44 * s, 56 * s], fill=Y)
        d.arc([10 * s, 10 * s, 26 * s, 30 * s], 90, 270, fill=Y, width=4 * s)
        d.arc([38 * s, 10 * s, 54 * s, 30 * s], 270, 90, fill=Y, width=4 * s)
    aa(trophy, (64, 64)).save(os.path.join(UI, "icon_trophy.png"))

    def carico(d, s, img):
        d.polygon([(6 * s, 40 * s), (12 * s, 28 * s), (24 * s, 22 * s), (42 * s, 22 * s), (52 * s, 30 * s),
                   (60 * s, 34 * s), (60 * s, 42 * s), (6 * s, 44 * s)], fill=W)
        d.ellipse([12 * s, 36 * s, 24 * s, 48 * s], fill=(20, 20, 20, 255), outline=W, width=3 * s)
        d.ellipse([42 * s, 36 * s, 54 * s, 48 * s], fill=(20, 20, 20, 255), outline=W, width=3 * s)
    aa(carico, (64, 64)).save(os.path.join(UI, "icon_car.png"))

    def homeico(d, s, img):
        d.polygon([(32 * s, 8 * s), (58 * s, 32 * s), (50 * s, 32 * s), (50 * s, 56 * s), (14 * s, 56 * s),
                   (14 * s, 32 * s), (6 * s, 32 * s)], fill=W)
    aa(homeico, (64, 64)).save(os.path.join(UI, "icon_home.png"))

    def check(d, s, img):
        d.line([10 * s, 34 * s, 26 * s, 50 * s, 54 * s, 16 * s], fill=(80, 230, 120, 255), width=9 * s)
    aa(check, (64, 64)).save(os.path.join(UI, "icon_check.png"))

    # ---- commandes tactiles ----
    def round_btn(label, col, size=200, icon=None):
        def f(d, s, img):
            d.ellipse([6 * s, 6 * s, (size - 6) * s, (size - 6) * s], fill=(col[0], col[1], col[2], 150),
                      outline=(255, 255, 255, 200), width=5 * s)
            if icon:
                icon(d, s)
            else:
                fnt = font(int(size * 0.32) * s)
                tw = d.textlength(label, font=fnt)
                d.text((size * s / 2 - tw / 2, size * s * 0.30), label, font=fnt, fill=(255, 255, 255, 255))
        return aa(f, (size, size), 3)

    def arrow(direction):
        def ic(d, s):
            c = 100 * s
            if direction < 0:
                pts = [(c - 40 * s, c), (c + 25 * s, c - 45 * s), (c + 25 * s, c + 45 * s)]
            else:
                pts = [(c + 40 * s, c), (c - 25 * s, c - 45 * s), (c - 25 * s, c + 45 * s)]
            d.polygon(pts, fill=(255, 255, 255, 235))
        return ic
    round_btn("", (40, 20, 70), icon=arrow(-1)).save(os.path.join(UI, "btn_left.png"))
    round_btn("", (40, 20, 70), icon=arrow(1)).save(os.path.join(UI, "btn_right.png"))
    round_btn("NITRO", (150, 40, 255), size=220).save(os.path.join(UI, "btn_nitro.png"))
    round_btn("DRIFT", (30, 30, 40), size=180).save(os.path.join(UI, "btn_drift.png"))

    def pause_ic(d, s, img):
        d.rounded_rectangle([4 * s, 4 * s, 60 * s, 60 * s], radius=6 * s, fill=(20, 20, 30, 200),
                            outline=(255, 255, 255, 230), width=3 * s)
        d.rectangle([20 * s, 18 * s, 28 * s, 46 * s], fill=W)
        d.rectangle([36 * s, 18 * s, 44 * s, 46 * s], fill=W)
    aa(pause_ic, (64, 64)).save(os.path.join(UI, "btn_pause.png"))


def app_icon():
    S = 512
    im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for y in range(S):
        t = y / S
        c = (int(40 + 120 * t), int(10 + 20 * t), int(90 + 120 * (1 - t)), 255)
        d.line([0, y, S, y], fill=c)
    for k in range(-S, S * 2, 70):
        d.polygon([(k, S), (k + 30, S), (k + 230, 0), (k + 200, 0)], fill=(255, 255, 255, 18))
    f = font(300)
    d.text((70 + 8, 40 + 8), "A", font=f, fill=(0, 0, 0, 160))
    d.text((70, 40), "A", font=f, fill=(255, 255, 255, 255))
    f2 = font(96)
    d.text((140, 360), "UNITE", font=f2, fill=(255, 216, 0, 255))
    im.save(os.path.join(UI, "icon.png"))
    im.resize((192, 192), Image.LANCZOS).save(os.path.join(UI, "icon_192.png"))
    # icône adaptative : fond + premier plan (432x432)
    bg = im.resize((432, 432), Image.LANCZOS).copy()
    bgd = ImageDraw.Draw(bg)
    bg2 = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
    for y in range(432):
        t = y / 432
        ImageDraw.Draw(bg2).line([0, y, 432, y], fill=(int(40 + 120 * t), int(10 + 20 * t), int(90 + 120 * (1 - t)), 255))
    bg2.save(os.path.join(UI, "icon_adaptive_bg.png"))
    fg = Image.new("RGBA", (432, 432), (0, 0, 0, 0))
    d = ImageDraw.Draw(fg)
    f = font(210)
    d.text((140 + 6, 70 + 6), "A", font=f, fill=(0, 0, 0, 160))
    d.text((140, 70), "A", font=f, fill=(255, 255, 255, 255))
    d.text((150, 270), "UNITE", font=font(66), fill=(255, 216, 0, 255))
    fg.save(os.path.join(UI, "icon_adaptive_fg.png"))
    # écran de démarrage
    sp = Image.new("RGB", (1280, 720), (18, 6, 40))
    d = ImageDraw.Draw(sp)
    for k in range(-720, 2000, 90):
        d.polygon([(k, 720), (k + 40, 720), (k + 340, 0), (k + 300, 0)], fill=(40, 14, 80))
    f = font(150)
    t1 = "ASPHALT"
    tw = d.textlength(t1, font=f)
    d.text((640 - tw / 2, 170), t1, font=f, fill=(255, 255, 255))
    f2 = font(110)
    t2 = "LEGENDS UNITE"
    tw = d.textlength(t2, font=f2)
    d.text((640 - tw / 2, 330), t2, font=f2, fill=(190, 80, 255))
    f3 = font(44)
    t3 = "FANGAME NON OFFICIEL"
    tw = d.textlength(t3, font=f3)
    d.text((640 - tw / 2, 480), t3, font=f3, fill=(255, 216, 0))
    sp.save(os.path.join(UI, "splash.png"))


def map_bg():
    W, H = 1280, 720
    im = Image.new("RGB", (W, H), (40, 18, 70))
    d = ImageDraw.Draw(im)
    r = np.random.default_rng(5)
    for _ in range(160):
        x = int(r.integers(0, W)); y = int(r.integers(0, H))
        if r.random() < 0.5:
            d.line([x, y, x + int(r.integers(80, 400)), y + int(r.integers(-40, 40))], fill=(60, 30, 100),
                   width=int(r.integers(1, 5)))
        else:
            d.line([x, y, x + int(r.integers(-40, 40)), y + int(r.integers(80, 300))], fill=(60, 30, 100),
                   width=int(r.integers(1, 5)))
    for _ in range(14):
        x = int(r.integers(0, W)); y = int(r.integers(0, H))
        d.line([x, y, x + int(r.integers(200, 700)), y + int(r.integers(-200, 200))], fill=(85, 45, 140), width=7)
    im = im.filter(ImageFilter.GaussianBlur(0.8))
    im.save(os.path.join(UI, "map_bg.png"))


if __name__ == "__main__":
    asphalt(); asphalt_wet(); concrete(); sand(); grass(); rock(); water_normal(); roof_tex()
    for i, st in enumerate(["victorian", "office", "brick", "stucco", "tokyo", "shop"]):
        facade(st, 60 + i)
    neon_atlas(); billboards(); ramp_stripes(); tire_tread(); palm_leaf(); foliage(); crowd_flags()
    skies(); ui_icons(); app_icon(); map_bg()
    print("textures OK")
