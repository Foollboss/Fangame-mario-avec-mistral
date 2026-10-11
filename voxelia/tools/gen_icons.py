"""Génère l'icône du lanceur Android (bloc d'herbe isométrique original, dessiné pixel par pixel)."""
import os, random, sys
from PIL import Image, ImageDraw

def face_texture(kind, rnd):
    img = Image.new('RGB', (16, 16))
    px = img.load()
    for y in range(16):
        for x in range(16):
            if kind == 'top':
                g = rnd.randint(-18, 18)
                px[x, y] = (95 + g // 2, 176 + g, 62 + g // 2)
            else:
                edge = 3 + (1 if (x * 7) % 5 == 0 else 0) + (1 if (x * 3) % 4 == 1 else 0)
                if y < edge:
                    g = rnd.randint(-15, 15)
                    px[x, y] = (88 + g // 2, 160 + g, 56 + g // 2)
                else:
                    d = rnd.randint(-14, 14)
                    px[x, y] = (134 + d, 96 + d, 67 + d)
    return img

def iso_block(size):
    rnd = random.Random(7)
    top, side = face_texture('top', rnd), face_texture('side', rnd)
    W = size
    img = Image.new('RGBA', (W, W), (0, 0, 0, 0))
    s = W / 2.4  # demi-largeur d'une face
    cx, cy = W / 2, W * 0.27
    hgt = s * 1.15
    def poly(points, tex, shade, mapping):
        # échantillonnage simple : remplit chaque pixel du losange avec le texel correspondant
        drw = ImageDraw.Draw(img)
        for ty in range(16):
            for tx in range(16):
                quad = [mapping(tx + a, ty + b) for a, b in ((0, 0), (1, 0), (1, 1), (0, 1))]
                c = tex.getpixel((tx, ty))
                c = tuple(int(v * shade) for v in c) + (255,)
                drw.polygon(quad, fill=c)
    # face supérieure
    poly(None, top, 1.0, lambda u, v: (cx + (u - v) * s / 16, cy + (u + v) * s / 32))
    # face gauche
    poly(None, side, 0.80, lambda u, v: (cx - s + u * s / 16, cy + s / 2 + u * s / 32 + v * hgt / 16))
    # face droite
    poly(None, side, 0.62, lambda u, v: (cx + u * s / 16, cy + s + -u * s / 32 + v * hgt / 16))
    return img

def main(res_dir):
    sizes = {'mdpi': 48, 'hdpi': 72, 'xhdpi': 96, 'xxhdpi': 144, 'xxxhdpi': 192}
    for dens, sz in sizes.items():
        d = os.path.join(res_dir, 'mipmap-' + dens)
        os.makedirs(d, exist_ok=True)
        big = iso_block(sz * 4).resize((sz, sz), Image.LANCZOS)
        bg = Image.new('RGBA', (sz, sz), (0, 0, 0, 0))
        bg.alpha_composite(big)
        bg.save(os.path.join(d, 'ic_launcher.png'))
    print('icônes générées dans', res_dir)

if __name__ == '__main__':
    main(sys.argv[1])
