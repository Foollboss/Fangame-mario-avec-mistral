#!/usr/bin/env python3
"""Génère les icônes des objets (ingrédients, plats, objets de quête, Mora) dans game/ui/items/.

Dessin vectoriel simple avec Pillow, rendu en 512 px puis réduit en 128 px (anticrénelage).
Usage : python3 game/tools/make_item_icons.py
"""
import math
import os
import random

from PIL import Image, ImageDraw, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "..", "ui", "items")
S = 512


def new():
    return Image.new("RGBA", (S, S), (0, 0, 0, 0))


def shade(col, k):
    return tuple(max(0, min(255, int(c * k))) for c in col[:3]) + ((col[3],) if len(col) > 3 else (255,))


def ball(im, cx, cy, r, col, hl=True, outline=True):
    """Sphère ombrée : disque + dégradé radial + reflet."""
    d = ImageDraw.Draw(im)
    if outline:
        d.ellipse([cx - r - 6, cy - r - 6, cx + r + 6, cy + r + 6], fill=shade(col, 0.45))
    steps = 24
    for i in range(steps):
        k = i / steps
        rr = r * (1.0 - k * 0.92)
        ox, oy = -r * 0.25 * k, -r * 0.3 * k
        c = shade(col, 0.72 + 0.45 * k)
        d.ellipse([cx + ox - rr, cy + oy - rr, cx + ox + rr, cy + oy + rr], fill=c)
    if hl:
        d.ellipse([cx - r * 0.55, cy - r * 0.62, cx - r * 0.18, cy - r * 0.3], fill=(255, 255, 255, 200))


def leaf(im, x, y, ang, length, width, col=(90, 175, 70)):
    d = ImageDraw.Draw(im)
    pts = []
    for i in range(21):
        t = i / 20
        w = math.sin(t * math.pi) * width
        pts.append((t * length, w))
    for i in range(20, -1, -1):
        t = i / 20
        w = math.sin(t * math.pi) * width
        pts.append((t * length, -w))
    ca, sa = math.cos(ang), math.sin(ang)
    poly = [(x + px * ca - py * sa, y + px * sa + py * ca) for px, py in pts]
    d.polygon(poly, fill=shade(col, 0.55))
    inner = [(x + px * 0.92 * ca - py * 0.75 * sa, y + px * 0.92 * sa + py * 0.75 * ca) for px, py in pts]
    d.polygon(inner, fill=col)
    d.line([(x, y), (x + length * 0.9 * ca, y + length * 0.9 * sa)], fill=shade(col, 0.7), width=5)


def plate(im, cx=256, cy=320, rx=200, ry=110, col=(245, 242, 232)):
    d = ImageDraw.Draw(im)
    d.ellipse([cx - rx - 6, cy - ry - 6 + 14, cx + rx + 6, cy + ry + 6 + 14], fill=(120, 110, 100, 255))
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=col)
    d.ellipse([cx - rx * 0.72, cy - ry * 0.68, cx + rx * 0.72, cy + ry * 0.68], fill=shade(col, 0.93))
    d.arc([cx - rx + 10, cy - ry + 8, cx + rx - 10, cy + ry - 8], 200, 320, fill=(255, 255, 255, 255), width=6)


def bowl(im, cx, cy, r, col=(240, 236, 226), inner=(200, 120, 70)):
    d = ImageDraw.Draw(im)
    d.pieslice([cx - r - 6, cy - r * 0.9 - 6, cx + r + 6, cy + r * 1.1 + 6], 0, 180, fill=shade(col, 0.5))
    d.pieslice([cx - r, cy - r * 0.9, cx + r, cy + r * 1.1], 0, 180, fill=col)
    d.ellipse([cx - r - 6, cy - r * 0.32 - 6, cx + r + 6, cy + r * 0.32 + 6], fill=shade(col, 0.6))
    d.ellipse([cx - r, cy - r * 0.32, cx + r, cy + r * 0.32], fill=shade(col, 1.05))
    d.ellipse([cx - r * 0.88, cy - r * 0.26, cx + r * 0.88, cy + r * 0.26], fill=inner)


def finish(im, name):
    im = im.resize((128, 128), Image.LANCZOS)
    # léger contour sombre pour la lisibilité sur tous les fonds
    a = im.split()[3].filter(ImageFilter.MaxFilter(3))
    sh = Image.new("RGBA", im.size, (20, 18, 30, 0))
    sh.putalpha(a.point(lambda v: int(v * 0.55)))
    out = Image.alpha_composite(sh, im)
    out.save(os.path.join(OUT, name + ".png"))


def sparkle(d, x, y, r, col=(255, 255, 255, 230)):
    d.polygon([(x, y - r), (x + r * 0.25, y - r * 0.25), (x + r, y), (x + r * 0.25, y + r * 0.25),
               (x, y + r), (x - r * 0.25, y + r * 0.25), (x - r, y), (x - r * 0.25, y - r * 0.25)], fill=col)


def make():
    os.makedirs(OUT, exist_ok=True)
    rnd = random.Random(7)

    # ---------------- fruits & plantes
    im = new(); ball(im, 256, 290, 150, (215, 45, 45, 255))
    d = ImageDraw.Draw(im); d.line([(256, 150), (270, 90)], fill=(110, 70, 40), width=16)
    leaf(im, 268, 112, -0.5, 120, 40); finish(im, "pomme")

    im = new(); ball(im, 256, 290, 150, (250, 150, 40, 255))
    d = ImageDraw.Draw(im)
    for k in range(5):
        a = -math.pi / 2 + (k - 2) * 0.35
        d.line([(256, 150), (256 + math.cos(a) * 60, 150 + math.sin(a) * 60)], fill=(80, 150, 60), width=18)
    d.ellipse([236, 132, 276, 168], fill=(60, 120, 50)); finish(im, "soleillette")

    im = new(); d = ImageDraw.Draw(im)
    d.line([(190, 300), (270, 110)], fill=(90, 120, 50), width=12); d.line([(330, 320), (270, 110)], fill=(90, 120, 50), width=12)
    leaf(im, 272, 112, -0.2, 110, 36)
    ball(im, 190, 330, 82, (235, 70, 110, 255)); ball(im, 332, 345, 82, (225, 55, 95, 255)); finish(im, "cerise")

    im = new(); d = ImageDraw.Draw(im)
    for (x, y) in [(200, 300), (300, 290), (250, 370), (250, 220), (330, 380), (170, 390)]:
        ball(im, x, y, 62, (80, 140, 235, 255))
    for k in range(6):
        sparkle(d, rnd.randint(140, 380), rnd.randint(170, 420), 18)
    leaf(im, 250, 170, -1.2, 110, 34, (70, 140, 110)); finish(im, "baie_givre")

    im = new()
    for a in (-2.3, -1.57, -0.85):
        leaf(im, 256, 430, a, 300, 85, (95, 195, 120))
    finish(im, "menthe")

    im = new(); d = ImageDraw.Draw(im)
    d.rounded_rectangle([200, 260, 312, 440], 40, fill=(150, 125, 95)); d.rounded_rectangle([212, 260, 300, 430], 34, fill=(240, 228, 200))
    d.pieslice([90, 110, 422, 400], 180, 360, fill=(120, 30, 25)); d.pieslice([100, 120, 412, 390], 180, 360, fill=(215, 60, 45))
    for (x, y, r) in [(180, 210, 26), (256, 170, 30), (330, 215, 24), (220, 240, 16), (300, 245, 18)]:
        d.ellipse([x - r, y - r, x + r, y + r], fill=(250, 245, 230))
    finish(im, "champignon")

    im = new(); d = ImageDraw.Draw(im)
    d.line([(256, 470), (256, 330)], fill=(70, 130, 70), width=22)
    d.polygon([(110, 200), (402, 200), (330, 340), (182, 340)], fill=(70, 140, 80))
    d.ellipse([110, 150, 402, 250], fill=(150, 205, 120)); d.ellipse([130, 165, 382, 238], fill=(120, 180, 95))
    for x in range(160, 360, 48):
        for y in (185, 215):
            d.ellipse([x - 14 + (y - 185) * 0.5, y - 12, x + 14 + (y - 185) * 0.5, y + 12], fill=(230, 220, 150))
    leaf(im, 250, 420, -2.6, 150, 60, (80, 160, 90)); finish(im, "lotus")

    im = new(); d = ImageDraw.Draw(im)
    pts = []
    for i in range(30):
        t = i / 29
        x = 170 + t * 200 + math.sin(t * 3.0) * 30
        y = 150 + t * 260
        w = 60 * (1 - t) + 10
        pts.append((x, y, w))
    for x, y, w in pts:
        d.ellipse([x - w - 6, y - w - 6, x + w + 6, y + w + 6], fill=(110, 20, 15))
    for x, y, w in pts:
        d.ellipse([x - w, y - w, x + w, y + w], fill=(215, 45, 30))
    for x, y, w in pts[:18]:
        d.ellipse([x - w * 0.4 - w * 0.3, y - w * 0.5, x - w * 0.1, y - w * 0.1], fill=(250, 120, 80))
    d.ellipse([350, 380, 400, 430], fill=(255, 180, 60))
    d.line([(160, 140), (130, 80)], fill=(70, 120, 50), width=20)
    leaf(im, 165, 140, -2.4, 90, 34); finish(im, "piment")

    im = new(); d = ImageDraw.Draw(im)
    d.line([(256, 470), (256, 270)], fill=(80, 140, 80), width=16)
    leaf(im, 256, 420, -0.6, 130, 34, (90, 160, 100))
    for k in range(6):
        a = k * math.tau / 6 - math.pi / 2
        x, y = 256 + math.cos(a) * 95, 220 + math.sin(a) * 95
        d.polygon([(256, 220), (x + math.cos(a + 1.3) * 55, y + math.sin(a + 1.3) * 55), (x + math.cos(a) * 30, y + math.sin(a) * 30),
                   (x + math.cos(a - 1.3) * 55, y + math.sin(a - 1.3) * 55)], fill=(220, 200, 250) if k % 2 else (245, 235, 255))
    d.ellipse([226, 190, 286, 250], fill=(250, 220, 120))
    for k in range(4):
        sparkle(d, 120 + k * 90, 110 + (k % 2) * 40, 16, (190, 230, 255, 230))
    finish(im, "lys_vent")

    im = new(); d = ImageDraw.Draw(im)
    d.line([(150, 380), (380, 150)], fill=(245, 240, 225), width=40)
    for (x, y) in [(150, 380), (380, 150)]:
        d.ellipse([x - 32, y - 32, x + 32, y + 32], fill=(245, 240, 225))
    d.ellipse([140, 150, 380, 370], fill=(150, 40, 45)); d.ellipse([155, 160, 365, 355], fill=(225, 95, 100))
    d.ellipse([200, 200, 300, 280], fill=(250, 200, 200)); finish(im, "viande")

    im = new(); d = ImageDraw.Draw(im)
    d.polygon([(380, 256), (470, 180), (470, 332)], fill=(70, 120, 170))
    d.ellipse([60, 170, 400, 342], fill=(60, 100, 150)); d.ellipse([70, 178, 392, 334], fill=(130, 180, 220))
    d.ellipse([70, 250, 392, 334], fill=(220, 235, 245)); d.ellipse([120, 220, 150, 250], fill=(30, 30, 40))
    d.polygon([(230, 180), (290, 120), (310, 185)], fill=(70, 120, 170)); finish(im, "poisson")

    im = new(); d = ImageDraw.Draw(im)
    d.ellipse([140, 100, 372, 420], fill=(170, 140, 100)); d.ellipse([150, 110, 362, 410], fill=(250, 238, 215))
    d.ellipse([185, 150, 245, 220], fill=(255, 255, 250)); finish(im, "oeuf")

    im = new(); d = ImageDraw.Draw(im)
    d.rounded_rectangle([130, 150, 382, 440], 60, fill=(150, 120, 80)); d.rounded_rectangle([142, 160, 370, 430], 56, fill=(225, 200, 160))
    d.polygon([(150, 160), (200, 90), (312, 90), (362, 160)], fill=(210, 185, 145)); d.line([(180, 140), (332, 140)], fill=(140, 90, 60), width=14)
    d.ellipse([200, 250, 312, 360], fill=(250, 248, 240)); finish(im, "farine")

    im = new(); d = ImageDraw.Draw(im)
    d.rounded_rectangle([170, 180, 342, 450], 50, fill=(150, 160, 170)); d.rounded_rectangle([180, 190, 332, 440], 46, fill=(250, 250, 252))
    d.rectangle([215, 110, 297, 190], fill=(240, 240, 245)); d.rounded_rectangle([200, 80, 312, 125], 14, fill=(60, 120, 200))
    d.rounded_rectangle([190, 290, 322, 380], 18, fill=(110, 170, 230)); finish(im, "lait")

    im = new(); d = ImageDraw.Draw(im)
    d.polygon([(100, 330), (256, 400), (412, 330), (256, 260)], fill=(230, 225, 210))
    d.polygon([(150, 250), (256, 300), (362, 250), (362, 330), (256, 380), (150, 330)], fill=(225, 185, 50))
    d.polygon([(150, 250), (256, 200), (362, 250), (256, 300)], fill=(250, 220, 110)); finish(im, "beurre")

    im = new(); d = ImageDraw.Draw(im)
    for (x, y) in [(180, 300), (300, 300), (240, 200)]:
        d.polygon([(x - 70, y), (x, y - 40), (x + 70, y), (x, y + 40)], fill=(255, 255, 255))
        d.polygon([(x - 70, y), (x, y + 40), (x, y + 120), (x - 70, y + 80)], fill=(215, 220, 230))
        d.polygon([(x + 70, y), (x, y + 40), (x, y + 120), (x + 70, y + 80)], fill=(190, 200, 215))
    finish(im, "sucre")

    im = new(); d = ImageDraw.Draw(im)
    d.rounded_rectangle([160, 200, 352, 440], 40, fill=(120, 160, 190)); d.rounded_rectangle([172, 210, 340, 430], 36, fill=(200, 230, 245))
    d.rounded_rectangle([180, 260, 332, 420], 30, fill=(250, 252, 255)); d.rounded_rectangle([180, 140, 332, 210], 20, fill=(150, 110, 80))
    for k in range(10):
        sparkle(d, rnd.randint(200, 310), rnd.randint(280, 400), 10, (190, 220, 240, 255))
    finish(im, "sel")

    # ---------------- plats
    im = new(); plate(im)
    d = ImageDraw.Draw(im)
    d.ellipse([100, 190, 412, 380], fill=(160, 95, 40)); d.ellipse([112, 196, 400, 360], fill=(230, 160, 70))
    for k in range(5):
        x = 150 + k * 52
        d.line([(x, 205), (x + 40, 350)], fill=(200, 120, 45), width=16)
        d.line([(x + 40, 205), (x, 350)], fill=(245, 190, 95), width=16)
    finish(im, "tarte")

    def skewer(im, chili=False):
        d = ImageDraw.Draw(im)
        d.line([(90, 420), (430, 100)], fill=(190, 160, 110), width=14)
        for k in range(4):
            x, y = 150 + k * 75, 365 - k * 70
            if chili and k % 2 == 1:
                d.ellipse([x - 40, y - 26, x + 40, y + 26], fill=(220, 40, 30)); d.ellipse([x - 30, y - 20, x - 5, y - 4], fill=(255, 140, 90))
            else:
                d.rounded_rectangle([x - 46, y - 40, x + 46, y + 40], 22, fill=(110, 55, 30))
                d.rounded_rectangle([x - 40, y - 34, x + 40, y + 34], 18, fill=(170, 90, 50))
                d.line([(x - 30, y - 10), (x + 30, y - 20)], fill=(90, 40, 20), width=6)
        if chili:
            for k in range(6):
                sparkle(d, rnd.randint(120, 400), rnd.randint(100, 380), 16, (255, 190, 80, 230))
    im = new(); plate(im, ry=90, cy=350); skewer(im); finish(im, "brochette")
    im = new(); plate(im, ry=90, cy=350); skewer(im, True); finish(im, "brochette_ardente")

    im = new(); bowl(im, 256, 290, 180, inner=(120, 190, 100))
    d = ImageDraw.Draw(im)
    for k in range(7):
        leaf(im, 160 + k * 30, 270 + (k % 2) * 10, -1.4 + k * 0.4, 90, 30, (110, 200, 120))
    for (x, y) in [(200, 280), (300, 270), (250, 300)]:
        d.rectangle([x - 18, y - 18, x + 18, y + 18], fill=(225, 60, 55))
    finish(im, "salade")

    im = new(); d = ImageDraw.Draw(im)
    d.polygon([(170, 130), (342, 130), (318, 450), (194, 450)], fill=(200, 215, 230, 255))
    d.polygon([(178, 200), (334, 200), (318, 440), (194, 440)], fill=(250, 150, 40))
    d.polygon([(178, 200), (250, 200), (240, 440), (194, 440)], fill=(255, 185, 80))
    d.line([(290, 60), (270, 330)], fill=(240, 90, 110), width=16)
    d.ellipse([300, 100, 380, 180], fill=(250, 150, 40)); d.ellipse([312, 112, 368, 168], fill=(255, 200, 110))
    finish(im, "jus")

    im = new(); plate(im)
    d = ImageDraw.Draw(im)
    d.pieslice([90, 160, 422, 420], 180, 360, fill=(200, 150, 30)); d.pieslice([100, 170, 412, 410], 180, 360, fill=(250, 210, 70))
    for (x, y) in [(180, 270), (260, 250), (330, 275)]:
        d.pieslice([x - 34, y - 30, x + 34, y + 20], 180, 360, fill=(160, 110, 80))
    leaf(im, 300, 300, -0.4, 60, 18, (100, 180, 90)); finish(im, "omelette")

    im = new(); bowl(im, 256, 300, 185, col=(150, 100, 70), inner=(140, 70, 35))
    d = ImageDraw.Draw(im)
    for (x, y, c) in [(190, 290, (230, 130, 40)), (270, 300, (200, 110, 70)), (320, 285, (110, 180, 90)), (230, 310, (240, 200, 120))]:
        d.ellipse([x - 26, y - 16, x + 26, y + 16], fill=c)
    for k in range(3):
        d.arc([200 + k * 40, 150, 250 + k * 40, 250], 200, 340, fill=(255, 255, 255, 170), width=8)
    finish(im, "ragout")

    im = new(); bowl(im, 256, 300, 185, inner=(240, 220, 180))
    d = ImageDraw.Draw(im)
    d.ellipse([200, 285, 290, 320], fill=(240, 160, 140)); leaf(im, 300, 300, -0.3, 50, 14, (100, 180, 90))
    d.ellipse([170, 290, 196, 306], fill=(140, 200, 120)); finish(im, "soupe")

    im = new(); d = ImageDraw.Draw(im)
    d.ellipse([110, 340, 402, 420], fill=(230, 225, 210))
    d.pieslice([140, 170, 372, 400], 0, 180, fill=(235, 240, 235)); d.ellipse([140, 230, 372, 300], fill=(245, 248, 245))
    d.ellipse([155, 240, 357, 292], fill=(180, 220, 150)); d.arc([340, 250, 420, 330], 270, 90, fill=(235, 240, 235), width=18)
    d.ellipse([220, 245, 290, 280], fill=(250, 210, 225)); finish(im, "the_lotus")

    im = new(); plate(im)
    d = ImageDraw.Draw(im)
    d.polygon([(140, 330), (360, 330), (360, 220), (140, 260)], fill=(240, 200, 210))
    d.polygon([(140, 260), (360, 220), (330, 190), (120, 230)], fill=(250, 230, 235))
    d.polygon([(140, 290), (360, 270), (360, 285), (140, 305)], fill=(230, 80, 110))
    for (x, y) in [(200, 200), (270, 190)]:
        ball(im, x, y, 30, (220, 40, 80, 255), outline=False)
    finish(im, "gateau")

    im = new(); plate(im)
    d = ImageDraw.Draw(im)
    d.ellipse([110, 180, 402, 380], fill=(200, 150, 80)); d.ellipse([120, 188, 392, 365], fill=(240, 200, 120))
    for k in range(5):
        a = k * math.tau / 5
        d.ellipse([256 + math.cos(a) * 50 - 26, 265 + math.sin(a) * 30 - 18, 256 + math.cos(a) * 50 + 26, 265 + math.sin(a) * 30 + 18], fill=(220, 200, 250))
    d.ellipse([240, 252, 272, 280], fill=(250, 220, 120)); finish(im, "galette")

    im = new(); d = ImageDraw.Draw(im)
    d.polygon([(150, 300), (362, 300), (300, 440), (212, 440)], fill=(200, 215, 235))
    for (x, y, c) in [(210, 260, (110, 160, 240)), (300, 260, (150, 200, 250)), (256, 190, (200, 230, 255))]:
        ball(im, x, y, 72, c + (255,), outline=False)
    for k in range(4):
        sparkle(d, rnd.randint(150, 360), rnd.randint(130, 300), 14)
    finish(im, "sorbet")

    # ---------------- objets de quête
    im = new(); d = ImageDraw.Draw(im)
    d.polygon([(130, 100), (380, 80), (400, 420), (150, 440)], fill=(150, 120, 80))
    d.polygon([(140, 110), (370, 92), (390, 410), (158, 430)], fill=(240, 225, 190))
    for k in range(7):
        d.line([(170, 150 + k * 38), (350, 136 + k * 38)], fill=(150, 120, 90), width=6)
    d.ellipse([240, 300, 340, 380], outline=(180, 60, 50), width=8); finish(im, "page_carnet")

    im = new(); d = ImageDraw.Draw(im)
    g = Image.new("RGBA", (S, S), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    gd.ellipse([80, 80, 432, 432], fill=(255, 120, 40, 120)); g = g.filter(ImageFilter.GaussianBlur(40)); im.alpha_composite(g)
    d = ImageDraw.Draw(im)
    heart = [(256, 430), (110, 280), (120, 170), (190, 130), (256, 180), (322, 130), (392, 170), (402, 280)]
    d.polygon(heart, fill=(120, 25, 15)); d.polygon([(256, 405), (135, 278), (142, 185), (192, 152), (256, 200), (320, 152), (370, 185), (377, 278)], fill=(235, 80, 30))
    d.polygon([(256, 200), (192, 152), (142, 185), (200, 260)], fill=(255, 170, 70)); d.line([(256, 200), (256, 405)], fill=(255, 210, 120), width=8)
    finish(im, "coeur_braise")

    im = new()
    g = Image.new("RGBA", (S, S), (0, 0, 0, 0)); gd = ImageDraw.Draw(g)
    gd.ellipse([80, 80, 432, 432], fill=(90, 170, 255, 120)); g = g.filter(ImageFilter.GaussianBlur(40)); im.alpha_composite(g)
    d = ImageDraw.Draw(im)
    d.ellipse([130, 300, 260, 400], fill=(60, 120, 220)); d.ellipse([142, 310, 250, 390], fill=(150, 210, 255))
    d.rectangle([232, 110, 262, 350], fill=(150, 210, 255)); d.polygon([(262, 110), (390, 160), (390, 230), (262, 180)], fill=(110, 180, 250))
    for k in range(5):
        sparkle(d, rnd.randint(120, 400), rnd.randint(90, 420), 18, (230, 245, 255, 240))
    finish(im, "note_celeste")

    # ---------------- Mora (pièce)
    im = new(); d = ImageDraw.Draw(im)
    d.ellipse([70, 70, 442, 442], fill=(140, 95, 30)); d.ellipse([86, 86, 426, 426], fill=(235, 185, 70))
    d.ellipse([130, 130, 382, 382], fill=(215, 160, 50)); d.ellipse([150, 150, 362, 362], fill=(250, 210, 100))
    d.polygon([(256, 170), (300, 256), (256, 342), (212, 256)], fill=(180, 120, 35)); d.ellipse([236, 236, 276, 276], fill=(250, 220, 140))
    d.arc([100, 100, 412, 412], 200, 260, fill=(255, 245, 210), width=14); finish(im, "mora")


if __name__ == "__main__":
    make()
    print("icônes écrites dans", os.path.abspath(OUT))
