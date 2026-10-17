/**
 * Peintres de textures de blocs — toutes les textures du jeu sont générées
 * procéduralement (aucune ressource propriétaire). Chaque fonction peint une
 * image 16x16 ; les textures animées renvoient plusieurs images.
 */
import { Pixmap, hex, mix, scale, type RGB } from './pixmap';

type Painter = (p: Pixmap, frame: number) => void;

const P = new Map<string, Painter>();
/** Nombre d'images des textures animées. */
export const ANIMATED: Record<string, number> = {
  water_still: 16,
  water_flow: 16,
  lava_still: 16,
  lava_flow: 16,
  ember_portal: 16,
  sky_portal: 16,
  fire: 8,
  campfire_fire: 8,
  mythril_block: 8,
  etherium_block: 8,
  celestine_block: 8,
};

const reg = (names: string | string[], fn: Painter) => {
  for (const n of Array.isArray(names) ? names : [names]) P.set(n, fn);
};

// ------------------------------------------------------------------ primitives

function stoneBase(p: Pixmap, base: RGB, light: RGB, dark: RGB): void {
  p.noise(base, 0.05);
  p.blobs(dark, 7, 0.8, 2.2, 0.05);
  p.blobs(light, 6, 0.6, 1.8, 0.05);
  p.speckle(scale(dark, 0.9), 0.05);
}

function dirtBase(p: Pixmap): void {
  p.palette([hex(0x79553a), hex(0x866043), hex(0x8f6a4b), hex(0x6b4a33), hex(0x9a7553)], [3, 4, 3, 2, 1]);
  p.speckle(hex(0x5a3f2b), 0.06);
  p.speckle(hex(0xb08460), 0.03);
}

function grassGray(p: Pixmap): void {
  p.palette([[152, 152, 152], [138, 138, 138], [166, 166, 166], [128, 128, 128], [178, 178, 178]], [4, 3, 3, 2, 1]);
}

function ore(p: Pixmap, base: (q: Pixmap) => void, c: RGB, dark: RGB, light?: RGB): void {
  base(p);
  const rng = p.rng;
  const clusters = 4 + Math.floor(rng.next() * 2);
  for (let i = 0; i < clusters; i++) {
    const cx = 2 + Math.floor(rng.next() * 12);
    const cy = 2 + Math.floor(rng.next() * 12);
    const cells: Array<[number, number]> = [
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1],
    ];
    if (rng.next() < 0.6) cells.push([-1, 0]);
    if (rng.next() < 0.6) cells.push([0, -1]);
    if (rng.next() < 0.4) cells.push([2, 1]);
    for (const [dx, dy] of cells) {
      const shade = (dx + dy) % 2 === 0 ? c : dark;
      p.set(cx + dx, cy + dy, shade);
    }
    if (light) p.set(cx, cy, light);
  }
}

/** Minerai en éclats : un cristal par quart de bloc (pointe claire, face éclairée, face d'ombre). */
function shardOre(p: Pixmap, base: (q: Pixmap) => void, c: RGB, dark: RGB, light: RGB): void {
  base(p);
  const rng = p.rng;
  for (let q = 0; q < 4; q++) {
    const x = (q % 2) * 8 + 2 + Math.floor(rng.next() * 4);
    const y = Math.floor(q / 2) * 8 + 4 + Math.floor(rng.next() * 3);
    const h = 3 + Math.floor(rng.next() * 2);
    const lean = rng.next() < 0.5 ? 0 : rng.next() < 0.5 ? -1 : 1;
    for (let k = 0; k < h; k++) {
      const dx = k >= 2 ? lean : 0;
      p.set(x + dx, y - k, c);
      p.set(x + dx + 1, y - k, dark);
    }
    p.set(x + lean, y - h, light);
  }
}

function logSide(p: Pixmap, bark: RGB, dark: RGB, light: RGB): void {
  for (let x = 0; x < 16; x++) {
    const col = p.rng.next();
    const c = col < 0.3 ? dark : col < 0.75 ? bark : light;
    for (let y = 0; y < 16; y++) {
      const f = 1 + (p.rng.next() - 0.5) * 0.12;
      p.set(x, y, scale(c, f));
    }
  }
  for (let i = 0; i < 10; i++) {
    const x = Math.floor(p.rng.next() * 16);
    const y = Math.floor(p.rng.next() * 14);
    p.vline(x, y, y + 1 + Math.floor(p.rng.next() * 3), scale(dark, 0.85));
  }
}

function logTop(p: Pixmap, bark: RGB, ring: RGB, ringDark: RGB): void {
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const d = Math.max(Math.abs(x - 7.5), Math.abs(y - 7.5));
      let c: RGB;
      if (d > 6.6) c = bark;
      else c = Math.floor(d) % 2 === 0 ? ring : ringDark;
      p.set(x, y, scale(c, 1 + (p.rng.next() - 0.5) * 0.08));
    }
}

function planks(p: Pixmap, c: RGB): void {
  const dark = scale(c, 0.72);
  const light = scale(c, 1.08);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const f = 1 + (p.rng.next() - 0.5) * 0.1;
      p.set(x, y, scale(y % 4 === 0 ? light : c, f));
    }
  for (let row = 0; row < 4; row++) {
    const y = row * 4 + 3;
    p.hline(0, 15, y, dark);
    const seam = (row * 7 + 3) % 16;
    p.vline(seam, row * 4, y, dark);
    // grain
    for (let i = 0; i < 3; i++) {
      const gx = Math.floor(p.rng.next() * 14);
      const gy = row * 4 + 1 + Math.floor(p.rng.next() * 2);
      p.hline(gx, gx + 2, gy, scale(c, 0.86));
    }
  }
}

function leaves(p: Pixmap, c: RGB, holes = 0.18): void {
  p.clear();
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      if (p.rng.next() < holes) continue;
      const r = p.rng.next();
      const f = r < 0.25 ? 0.72 : r < 0.6 ? 0.9 : r < 0.9 ? 1.0 : 1.15;
      p.set(x, y, scale(c, f));
    }
  // petites zones sombres (profondeur)
  for (let i = 0; i < 8; i++) {
    const x = Math.floor(p.rng.next() * 16);
    const y = Math.floor(p.rng.next() * 16);
    if (p.alpha(x, y) > 0) p.set(x, y, scale(c, 0.6));
  }
}

function bricksPattern(p: Pixmap, brick: RGB, mortar: RGB, rows = 4, h = 4): void {
  p.noise(mortar, 0.04);
  for (let r = 0; r < rows; r++) {
    const off = r % 2 === 0 ? 0 : 4;
    for (let bx = -1; bx < 3; bx++) {
      const x0 = bx * 8 + off;
      for (let y = r * h; y < r * h + h - 1; y++)
        for (let x = x0; x < x0 + 7; x++) {
          if (x < 0 || x > 15) continue;
          const f = 1 + (p.rng.next() - 0.5) * 0.14;
          const edge = y === r * h ? 1.1 : y === r * h + h - 2 ? 0.88 : 1;
          p.set(x, y, scale(brick, f * edge));
        }
    }
  }
}

function stoneBricks(p: Pixmap, base: RGB, mortar: RGB): void {
  p.noise(base, 0.06);
  p.blobs(scale(base, 0.88), 4, 0.6, 1.5, 0.04);
  for (const y of [0, 7, 8, 15]) p.hline(0, 15, y, y === 0 || y === 8 ? scale(base, 1.15) : mortar);
  p.vline(15, 0, 7, mortar);
  p.vline(0, 0, 7, scale(base, 1.12));
  p.vline(7, 8, 15, mortar);
  p.vline(8, 8, 15, scale(base, 1.12));
}

function cobble(p: Pixmap, base: RGB, dark: RGB, light: RGB): void {
  p.fill(dark);
  // Pavés : grille irrégulière de pierres arrondies
  const stones: Array<[number, number, number, number]> = [
    [0, 0, 5, 4],
    [6, 0, 10, 3],
    [11, 0, 15, 5],
    [0, 5, 4, 9],
    [5, 4, 10, 8],
    [11, 6, 15, 10],
    [0, 10, 6, 15],
    [7, 9, 11, 13],
    [12, 11, 15, 15],
    [7, 14, 11, 15],
  ];
  for (const [x0, y0, x1, y1] of stones) {
    for (let y = y0; y <= y1; y++)
      for (let x = x0; x <= x1; x++) {
        const edge = x === x0 || y === y0 || x === x1 || y === y1;
        const corner = (x === x0 || x === x1) && (y === y0 || y === y1);
        if (corner) continue;
        const f = 1 + (p.rng.next() - 0.5) * 0.18;
        const c = edge && (x === x1 || y === y1) ? scale(base, 0.85) : edge ? light : base;
        p.set(x, y, scale(c, f));
      }
  }
}

function wool(p: Pixmap, c: RGB): void {
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const weave = ((x + y) % 4 === 0 ? 0.92 : 1) * ((x - y + 16) % 4 === 0 ? 1.05 : 1);
      p.set(x, y, scale(c, weave * (1 + (p.rng.next() - 0.5) * 0.08)));
    }
}

function metalBlock(p: Pixmap, c: RGB): void {
  p.noise(c, 0.03);
  p.bevel(1.18, 0.75);
  for (let i = 2; i < 14; i++) {
    p.set(i, 2, scale(c, 1.1));
    p.set(2, i, scale(c, 1.1));
    p.set(i, 13, scale(c, 0.85));
    p.set(13, i, scale(c, 0.85));
  }
  p.set(4, 4, scale(c, 1.3));
  p.set(5, 4, scale(c, 1.2));
  p.set(4, 5, scale(c, 1.2));
}

function gemBlock(p: Pixmap, c: RGB): void {
  p.noise(c, 0.04);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      if ((x + y) % 5 === 0) p.set(x, y, scale(c, 1.2));
      if ((x - y + 16) % 7 === 0) p.set(x, y, scale(c, 0.85));
    }
  p.bevel(1.2, 0.7);
}

function flower(p: Pixmap, petal: RGB, center: RGB, stem = hex(0x3f8a2a), shape = 0): void {
  p.clear();
  const s = stem;
  const ds = scale(stem, 0.75);
  p.vline(7, 8, 15, s);
  p.set(6, 11, ds);
  p.set(5, 10, ds);
  p.set(8, 12, ds);
  p.set(9, 11, ds);
  if (shape === 0) {
    // fleur ronde
    for (const [x, y] of [[6, 4], [7, 4], [8, 4], [5, 5], [6, 5], [8, 5], [9, 5], [5, 6], [9, 6], [6, 7], [7, 7], [8, 7], [5, 7], [9, 7]]) p.set(x, y, petal);
    p.set(7, 5, center);
    p.set(7, 6, center);
    p.set(6, 6, scale(petal, 0.85));
    p.set(8, 6, scale(petal, 0.85));
  } else if (shape === 1) {
    // tulipe
    for (let y = 3; y <= 8; y++) for (let x = 6; x <= 8; x++) p.set(x, y, scale(petal, y < 5 ? 1.1 : 0.95));
    p.set(5, 4, petal);
    p.set(9, 4, petal);
    p.set(7, 2, petal);
  } else if (shape === 2) {
    // grappe (ail / muguet)
    for (const [x, y] of [[7, 2], [6, 3], [8, 3], [5, 4], [7, 4], [9, 4], [6, 5], [8, 5], [7, 6]]) p.set(x, y, petal);
    for (const [x, y] of [[7, 3], [6, 4], [8, 4], [7, 5]]) p.set(x, y, center);
  } else {
    // marguerite
    for (const [x, y] of [[7, 2], [7, 3], [5, 5], [4, 5], [10, 5], [9, 5], [7, 7], [7, 8], [5, 3], [9, 3], [5, 7], [9, 7]]) p.set(x, y, petal);
    for (const [x, y] of [[6, 4], [7, 4], [8, 4], [6, 5], [7, 5], [8, 5], [6, 6], [7, 6], [8, 6]]) p.set(x, y, center);
  }
}

function grassBlades(p: Pixmap, c: RGB, tall = 1): void {
  p.clear();
  const blades = 9;
  for (let i = 0; i < blades; i++) {
    const x = 1 + Math.floor((i / blades) * 14 + p.rng.next() * 1.5);
    const h = Math.floor((6 + p.rng.next() * 9) * tall);
    let bx = x;
    for (let y = 15; y > 15 - h && y >= 0; y--) {
      const f = 0.75 + ((15 - y) / h) * 0.45;
      p.set(bx, y, scale(c, f));
      if (p.rng.next() < 0.18) bx += p.rng.next() < 0.5 ? -1 : 1;
      bx = Math.max(0, Math.min(15, bx));
    }
  }
}

function crop(p: Pixmap, stage: number, max: number, stem: RGB, ripe: RGB, top?: RGB): void {
  p.clear();
  const h = 3 + Math.floor((stage / max) * 12);
  const t = stage / max;
  const c = mix(stem, ripe, t * t);
  for (const x of [1, 4, 7, 10, 13]) {
    for (let y = 15; y > 15 - h; y--) p.set(x + ((y >> 2) % 2), y, scale(c, 0.85 + (15 - y) / 40));
    if (top && stage === max) {
      p.set(x, 15 - h, top);
      p.set(x + 1, 16 - h, top);
    }
  }
}

function animatedLiquid(p: Pixmap, frame: number, frames: number, palette: RGB[], speedX: number, speedY: number, scaleN = 1): void {
  const t = (frame / frames) * Math.PI * 2;
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const v =
        Math.sin((x / 16) * Math.PI * 2 * scaleN + t * speedX) * 0.5 +
        Math.sin((y / 16) * Math.PI * 2 * scaleN + t * speedY + x * 0.4) * 0.35 +
        Math.sin(((x + y) / 16) * Math.PI * 2 + t) * 0.25;
      const k = Math.max(0, Math.min(palette.length - 1, Math.floor(((v + 1.1) / 2.2) * palette.length)));
      p.set(x, y, palette[k]);
    }
}

// ------------------------------------------------------------------ terrain

reg('grass_top', (p) => grassGray(p));
reg('grass_side', (p) => {
  dirtBase(p);
  // la bordure d'herbe est dans la superposition teintée : ici, la terre est transparente en haut
  for (let x = 0; x < 16; x++) {
    const h = 3 + ((x * 7) % 5 === 0 ? 1 : 0) + ((x * 3) % 4 === 1 ? 1 : 0);
    for (let y = 0; y < h; y++) p.set(x, y, [0, 0, 0], 0);
  }
});
reg('grass_side_overlay', (p) => {
  p.clear();
  for (let x = 0; x < 16; x++) {
    const h = 3 + ((x * 7) % 5 === 0 ? 1 : 0) + ((x * 3) % 4 === 1 ? 1 : 0);
    for (let y = 0; y < h; y++) {
      const r = p.rng.next();
      p.set(x, y, r < 0.3 ? [130, 130, 130] : r < 0.8 ? [155, 155, 155] : [175, 175, 175]);
    }
  }
});
reg('dirt', (p) => dirtBase(p));
reg('coarse_dirt', (p) => {
  dirtBase(p);
  p.blobs(hex(0x5f4430), 6, 0.8, 1.6);
  p.speckle(hex(0x8a8a8a), 0.05);
});
reg('stone', (p) => stoneBase(p, hex(0x7f7f7f), hex(0x8e8e8e), hex(0x6b6b6b)));
reg('smooth_stone', (p) => {
  p.noise(hex(0x9e9e9e), 0.03);
  p.bevel(1.0, 0.82);
});
reg('smooth_stone_slab_side', (p) => {
  p.noise(hex(0x9e9e9e), 0.03);
  p.hline(0, 15, 0, hex(0xb0b0b0));
  p.hline(0, 15, 7, hex(0x7a7a7a));
  p.hline(0, 15, 8, hex(0xb0b0b0));
  p.hline(0, 15, 15, hex(0x7a7a7a));
});
reg('cobblestone', (p) => cobble(p, hex(0x7f7f7f), hex(0x4f4f4f), hex(0x9f9f9f)));
reg('mossy_cobblestone', (p) => {
  cobble(p, hex(0x7f7f7f), hex(0x4f4f4f), hex(0x9f9f9f));
  p.blobs(hex(0x5a7d3a), 5, 1, 2.5, 0.12);
});
reg('cobbled_deepslate', (p) => cobble(p, hex(0x4d4d52), hex(0x2a2a2e), hex(0x606066)));
reg('deepslate', (p) => {
  p.noise(hex(0x505056), 0.06);
  for (let i = 0; i < 9; i++) {
    const y = Math.floor(p.rng.next() * 16);
    const x = Math.floor(p.rng.next() * 12);
    p.hline(x, x + 2 + Math.floor(p.rng.next() * 4), y, hex(0x3a3a3f));
  }
  p.speckle(hex(0x646469), 0.05);
});
reg('deepslate_top', (p) => {
  p.noise(hex(0x58585e), 0.07);
  p.blobs(hex(0x404045), 5, 0.7, 1.5);
});
reg('bedrock', (p) => {
  p.palette([hex(0x575757), hex(0x353535), hex(0x7a7a7a), hex(0x1f1f1f)], [3, 3, 2, 1]);
  p.blobs(hex(0x2a2a2a), 5, 1, 2);
});
reg('sand', (p) => {
  p.palette([hex(0xdbd3a0), hex(0xe3dbb0), hex(0xd1c793), hex(0xc8bc87), hex(0xece4bc)], [4, 3, 3, 1, 1]);
});
reg('red_sand', (p) => p.palette([hex(0xbb6522), hex(0xa95a1e), hex(0xc87232), hex(0x9a501a)], [4, 3, 2, 1]));
reg('gravel', (p) => {
  p.palette([hex(0x837e7c), hex(0x6e6a68), hex(0x9a9493), hex(0x5a5452), hex(0x7f6f66)], [3, 3, 2, 2, 1]);
  p.blobs(hex(0x948e8c), 6, 0.6, 1.2);
  p.blobs(hex(0x605b59), 6, 0.6, 1.2);
});
reg('clay', (p) => {
  p.noise(hex(0xa0a6b3), 0.04);
  p.blobs(hex(0x959aa6), 6, 0.8, 1.6);
});
reg('mud', (p) => {
  p.noise(hex(0x3c3837), 0.08);
  p.blobs(hex(0x4a4442), 6, 1, 2);
});
reg('granite', (p) => {
  p.palette([hex(0x9a6b58), hex(0x8d5f4e), hex(0xaa7b66), hex(0x7c5242), hex(0xc4998a)], [4, 3, 2, 1, 1]);
});
reg('polished_granite', (p) => {
  p.noise(hex(0x9a6b58), 0.05);
  p.blobs(hex(0xa87865), 5, 1, 2);
  p.bevel(1.12, 0.78);
});
reg('diorite', (p) => p.palette([hex(0xbcbcbc), hex(0xd0d0d0), hex(0x9a9a9a), hex(0x7c7c7c), hex(0xe2e2e2)], [4, 3, 2, 1, 1]));
reg('andesite', (p) => p.palette([hex(0x888888), hex(0x7a7a7a), hex(0x969696), hex(0x6a6a6a), hex(0xa4a4a4)], [4, 3, 2, 1, 1]));
reg('tuff', (p) => {
  p.palette([hex(0x6c6d66), hex(0x5f605a), hex(0x7a7b74), hex(0x8a8a80)], [4, 3, 2, 1]);
});
reg('calcite', (p) => {
  p.noise(hex(0xdfe0dc), 0.04);
  p.blobs(hex(0xcfd0cc), 4, 1, 2);
});
reg('sandstone', (p) => {
  p.noise(hex(0xd8cb94), 0.04);
  for (let y = 0; y < 16; y++) {
    if (y === 3 || y === 11) p.hline(0, 15, y, hex(0xc9b981));
    if (y === 12) for (let x = 0; x < 16; x++) if (p.rng.next() < 0.5) p.set(x, y, hex(0xe2d6a4));
  }
  p.hline(0, 15, 0, hex(0xe6daa9));
  p.hline(0, 15, 15, hex(0xbfae76));
});
reg(['sandstone_top', 'sandstone_bottom'], (p) => p.noise(hex(0xdfd3a0), 0.035));
reg('red_sandstone', (p) => {
  p.noise(hex(0xb5621f), 0.05);
  for (const y of [3, 11]) p.hline(0, 15, y, hex(0x9c521a));
  p.hline(0, 15, 0, hex(0xc4722e));
  p.hline(0, 15, 15, hex(0x8c4816));
});
reg('red_sandstone_top', (p) => p.noise(hex(0xb6631f), 0.04));
const TERRA: Record<string, number> = {
  terracotta: 0x985e43,
  orange_terracotta: 0xa1531f,
  yellow_terracotta: 0xba8523,
  red_terracotta: 0x8f3d2e,
  white_terracotta: 0xd1b2a1,
  brown_terracotta: 0x4d3323,
  light_gray_terracotta: 0x876a61,
};
for (const [k, c] of Object.entries(TERRA)) reg(k, (p) => p.noise(hex(c), 0.035));
reg('snow', (p) => {
  p.noise(hex(0xf2fbfb), 0.025);
  p.speckle(hex(0xdde9ef), 0.08);
});
reg('ice', (p) => {
  p.noise(hex(0x91b7fd), 0.04, 190);
  for (let i = 0; i < 4; i++) {
    const x = Math.floor(p.rng.next() * 12);
    const y = Math.floor(p.rng.next() * 12);
    for (let k = 0; k < 4; k++) p.set(x + k, y + k, hex(0xc8dcff), 210);
  }
});
reg('packed_ice', (p) => {
  p.noise(hex(0x8db4f8), 0.05);
  p.blobs(hex(0xa4c4fc), 6, 0.6, 1.5);
});
reg('blue_ice', (p) => {
  p.noise(hex(0x74a8fd), 0.05);
  p.blobs(hex(0x8cbcff), 6, 0.6, 1.5);
});
reg('mycelium_top', (p) => {
  p.palette([hex(0x6f6266), hex(0x7d6e74), hex(0x5f5358), hex(0x8b7f86)], [4, 3, 2, 1]);
  p.speckle(hex(0x9a8f96), 0.04);
});
reg('mycelium_side', (p) => {
  dirtBase(p);
  for (let x = 0; x < 16; x++) {
    const h = 2 + ((x * 5) % 3);
    for (let y = 0; y < h; y++) p.set(x, y, p.rng.next() < 0.5 ? hex(0x6f6266) : hex(0x7d6e74));
  }
});
reg('podzol_top', (p) => {
  p.palette([hex(0x5b3f18), hex(0x6e4c1f), hex(0x4a3313), hex(0x7d5a2a)], [4, 3, 2, 1]);
});
reg('podzol_side', (p) => {
  dirtBase(p);
  for (let x = 0; x < 16; x++) {
    const h = 2 + ((x * 5) % 3);
    for (let y = 0; y < h; y++) p.set(x, y, p.rng.next() < 0.5 ? hex(0x5b3f18) : hex(0x6e4c1f));
  }
});
reg('moss_block', (p) => {
  p.palette([hex(0x596e2d), hex(0x657c34), hex(0x4e6227), hex(0x728a3c)], [4, 3, 2, 1]);
});
reg('farmland', (p) => {
  p.palette([hex(0x8c6340), hex(0x7a5536), hex(0x9a7050)], [3, 3, 1]);
  for (let y = 1; y < 16; y += 4) p.hline(0, 15, y, hex(0x5a3d26));
});
reg('farmland_moist', (p) => {
  p.palette([hex(0x523620), hex(0x46301c), hex(0x5e4027)], [3, 3, 1]);
  for (let y = 1; y < 16; y += 4) p.hline(0, 15, y, hex(0x2e1f12));
});
reg('dirt_path_top', (p) => {
  p.palette([hex(0x947c45), hex(0x8a7240), hex(0xa48a51), hex(0x7d6638)], [4, 3, 2, 1]);
});
reg('dirt_path_side', (p) => {
  dirtBase(p);
  for (let x = 0; x < 16; x++) for (let y = 0; y < 2; y++) p.set(x, y, p.rng.next() < 0.5 ? hex(0x947c45) : hex(0x8a7240));
  for (let x = 0; x < 16; x++) p.set(x, 0, [0, 0, 0], 0);
});
reg('ash_grass_top', (p) => {
  p.palette([hex(0x9a9a86), hex(0x8a8a78), hex(0xaaa994), hex(0x7a7a6a)], [4, 3, 2, 1]);
});
reg('ash_grass_side', (p) => {
  dirtBase(p);
  for (let x = 0; x < 16; x++) {
    const h = 2 + ((x * 7) % 3);
    for (let y = 0; y < h; y++) p.set(x, y, p.rng.next() < 0.5 ? hex(0x9a9a86) : hex(0x8a8a78));
  }
});

// ------------------------------------------------------------------ liquides
reg('water_still', (p, f) => animatedLiquid(p, f, 16, [[155, 155, 155], [170, 170, 170], [185, 185, 185], [196, 196, 196], [210, 210, 210]], 1, 1));
reg('water_flow', (p, f) => animatedLiquid(p, f, 16, [[150, 150, 150], [168, 168, 168], [184, 184, 184], [200, 200, 200]], 0.5, 2, 1));
reg('lava_still', (p, f) => animatedLiquid(p, f, 16, [hex(0xcf3a00), hex(0xe25c0a), hex(0xf07a14), hex(0xfa9a28), hex(0xffc040), hex(0xffe070)], 1, 1));
reg('lava_flow', (p, f) => animatedLiquid(p, f, 16, [hex(0xc93500), hex(0xe25c0a), hex(0xf58a1e), hex(0xffb83a)], 0.5, 2));
reg('ember_portal', (p, f) => animatedLiquid(p, f, 16, [hex(0x7a1a00), hex(0xb83a00), hex(0xf06a10), hex(0xffa040), hex(0xffd080)], 2, 1.4, 2));
reg('sky_portal', (p, f) => animatedLiquid(p, f, 16, [hex(0x3a6ad8), hex(0x5a8cf0), hex(0x86b4ff), hex(0xc0dcff), hex(0xffffff)], 2, 1.4, 2));
reg('fire', (p, f) => {
  p.clear();
  for (let x = 0; x < 16; x++) {
    const h = 6 + Math.abs(Math.sin(x * 1.7 + f * 0.9)) * 8 + Math.sin(x * 0.6 - f) * 2;
    for (let y = 15; y > 15 - h; y--) {
      const t = (15 - y) / h;
      const c = t < 0.3 ? hex(0xfff070) : t < 0.6 ? hex(0xffa020) : hex(0xe04010);
      if (t > 0.85 && (x + f) % 2 === 0) continue;
      p.set(x, y, c, 255);
    }
  }
});
reg('campfire_fire', (p, f) => {
  P.get('fire')!(p, f);
});

// ------------------------------------------------------------------ bois
const WOODS: Record<string, { bark: number; dark: number; light: number; ring: number; ringDark: number; plank: number }> = {
  oak: { bark: 0x6d5532, dark: 0x4c3b23, light: 0x826640, ring: 0xb4935d, ringDark: 0x977748, plank: 0xa2834f },
  birch: { bark: 0xd8d7d2, dark: 0x2a2a28, light: 0xeeeeea, ring: 0xd4c48a, ringDark: 0xbca972, plank: 0xc0af79 },
  spruce: { bark: 0x3a2a1b, dark: 0x2a1d12, light: 0x4d3825, ring: 0x8a6a40, ringDark: 0x6e5333, plank: 0x735531 },
  jungle: { bark: 0x554319, dark: 0x3d3010, light: 0x6c5624, ring: 0xb0884f, ringDark: 0x936f3c, plank: 0xa0734d },
  acacia: { bark: 0x676157, dark: 0x4d4840, light: 0x7d766a, ring: 0xb86538, ringDark: 0x9a512a, plank: 0xad5d32 },
  dark_oak: { bark: 0x3c2e1a, dark: 0x2a2012, light: 0x4e3c24, ring: 0x6a5032, ringDark: 0x553f26, plank: 0x4f3218 },
  cherry: { bark: 0x3b2a2c, dark: 0x271b1d, light: 0x553c3e, ring: 0xe2b6ae, ringDark: 0xcf9d95, plank: 0xe2b2a8 },
  palm: { bark: 0x9d8a63, dark: 0x7a6a48, light: 0xb4a074, ring: 0xc8b07a, ringDark: 0xae975f, plank: 0xb59a6a },
  golden: { bark: 0xc8a24a, dark: 0x9a7a2a, light: 0xe0c060, ring: 0xf0d878, ringDark: 0xd8bc58, plank: 0xe8cc6a },
};
for (const [k, w] of Object.entries(WOODS)) {
  reg(k + '_log', (p) => {
    if (k === 'birch') {
      p.noise(hex(w.bark), 0.04);
      for (let i = 0; i < 9; i++) {
        const y = Math.floor(p.rng.next() * 16);
        const x = Math.floor(p.rng.next() * 13);
        p.hline(x, x + 1 + Math.floor(p.rng.next() * 3), y, hex(w.dark));
      }
    } else if (k === 'palm') {
      logSide(p, hex(w.bark), hex(w.dark), hex(w.light));
      for (const y of [3, 7, 11, 15]) p.hline(0, 15, y, hex(w.dark));
    } else logSide(p, hex(w.bark), hex(w.dark), hex(w.light));
  });
  reg(k + '_log_top', (p) => logTop(p, hex(w.bark), hex(w.ring), hex(w.ringDark)));
  reg(k + '_planks', (p) => planks(p, hex(w.plank)));
}
reg('stripped_oak_log', (p) => logSide(p, hex(0xb08c58), hex(0x987848), hex(0xbc9864)));
reg('stripped_oak_log_top', (p) => logTop(p, hex(0xb08c58), hex(0xb4935d), hex(0x977748)));
reg(['oak_leaves', 'jungle_leaves', 'acacia_leaves', 'dark_oak_leaves', 'palm_leaves'], (p) => leaves(p, [150, 150, 150]));
reg('birch_leaves', (p) => leaves(p, [160, 160, 160], 0.2));
reg('spruce_leaves', (p) => leaves(p, [140, 140, 140], 0.14));
reg('cherry_leaves', (p) => {
  leaves(p, hex(0xe9a6c3), 0.15);
  p.speckle(hex(0xffd0e4), 0.06);
});
reg('golden_leaves', (p) => {
  leaves(p, hex(0xf2c94a), 0.16);
  p.speckle(hex(0xfff0a0), 0.06);
});
reg('bookshelf', (p) => {
  planks(p, hex(0xa2834f));
  const colors = [0x8a2a2a, 0x2a4a8a, 0x2a7a3a, 0x8a7a2a, 0x5a2a7a, 0x6a4a2a];
  for (const row of [1, 9]) {
    p.rect(0, row, 15, row + 5, hex(0x3a2a18));
    let x = 1;
    while (x < 15) {
      const w = 1 + Math.floor(p.rng.next() * 2);
      const c = hex(colors[Math.floor(p.rng.next() * colors.length)]);
      const h = 4 + Math.floor(p.rng.next() * 2);
      p.rect(x, row + 6 - h, x + w - 1, row + 5, c);
      p.vline(x, row + 6 - h, row + 5, scale(c, 1.25));
      x += w + (p.rng.next() < 0.2 ? 1 : 0);
    }
  }
});
reg('crafting_table_top', (p) => {
  planks(p, hex(0xa2834f));
  p.rect(1, 1, 14, 14, hex(0x8a6b3e));
  for (let i = 1; i < 15; i++) {
    p.set(i, 5, hex(0x6a5030));
    p.set(i, 10, hex(0x6a5030));
    p.set(5, i, hex(0x6a5030));
    p.set(10, i, hex(0x6a5030));
  }
  p.bevel(1.1, 0.7);
});
reg(['crafting_table_side', 'crafting_table_front'], (p) => {
  planks(p, hex(0x9a7a48));
  p.rect(0, 0, 15, 2, hex(0x6d5532));
  // outils accrochés
  p.vline(4, 4, 12, hex(0x6a4a28));
  p.rect(2, 4, 6, 5, hex(0x9a9a9a));
  p.vline(11, 5, 12, hex(0x6a4a28));
  p.rect(10, 4, 12, 6, hex(0xa0a0a0));
});
reg('furnace_side', (p) => {
  stoneBase(p, hex(0x7a7a7a), hex(0x8a8a8a), hex(0x666666));
  p.bevel(1.1, 0.75);
});
reg('furnace_top', (p) => {
  stoneBase(p, hex(0x6e6e6e), hex(0x7e7e7e), hex(0x5a5a5a));
  p.bevel(1.1, 0.75);
});
const furnaceFront = (lit: boolean) => (p: Pixmap) => {
  stoneBase(p, hex(0x7a7a7a), hex(0x8a8a8a), hex(0x666666));
  p.bevel(1.1, 0.75);
  p.rect(3, 9, 12, 13, hex(0x1e1e1e));
  p.rect(4, 3, 11, 5, hex(0x3a3a3a));
  if (lit) {
    p.rect(4, 11, 11, 13, hex(0xff9a1c));
    p.rect(5, 10, 10, 11, hex(0xffd04a));
    p.set(6, 9, hex(0xffe68a));
    p.set(9, 9, hex(0xffe68a));
  }
};
reg('furnace_front', furnaceFront(false));
reg('furnace_front_on', furnaceFront(true));
reg('chest_top', (p) => {
  planks(p, hex(0xa4762e));
  p.bevel(1.1, 0.6);
});
reg('chest_side', (p) => {
  planks(p, hex(0x9c6e2a));
  p.hline(0, 15, 4, hex(0x3a2510));
  p.bevel(1.1, 0.6);
});
reg('chest_front', (p) => {
  planks(p, hex(0x9c6e2a));
  p.hline(0, 15, 4, hex(0x3a2510));
  p.rect(7, 3, 8, 6, hex(0xc8c8c8));
  p.set(7, 6, hex(0x5a5a5a));
  p.bevel(1.1, 0.6);
});
reg('barrel_side', (p) => {
  planks(p, hex(0x8a6236));
  p.hline(0, 15, 2, hex(0x3a3a3a));
  p.hline(0, 15, 13, hex(0x3a3a3a));
});
reg('barrel_top', (p) => {
  logTop(p, hex(0x6a4a28), hex(0x9a7040), hex(0x8a6036));
  p.rect(5, 5, 10, 10, hex(0x3a2a18));
});
reg('barrel_bottom', (p) => logTop(p, hex(0x6a4a28), hex(0x9a7040), hex(0x8a6036)));

// ------------------------------------------------------------------ minerais et métaux
const stoneFn = (q: Pixmap) => stoneBase(q, hex(0x7f7f7f), hex(0x8e8e8e), hex(0x6b6b6b));
const deepFn = (q: Pixmap) => P.get('deepslate')!(q, 0);
reg('coal_ore', (p) => ore(p, stoneFn, hex(0x2e2e2e), hex(0x161616), hex(0x444444)));
reg('iron_ore', (p) => ore(p, stoneFn, hex(0xd8af93), hex(0xaf8e74), hex(0xe8cbb6)));
reg('copper_ore', (p) => ore(p, stoneFn, hex(0xe07b54), hex(0x4a9c7c), hex(0xf09a70)));
reg('gold_ore', (p) => ore(p, stoneFn, hex(0xfcee4b), hex(0xd8b81e), hex(0xfffaa0)));
reg('energy_ore', (p) => ore(p, stoneFn, hex(0xe01010), hex(0x8a0000), hex(0xff6060)));
reg('sapphire_ore', (p) => ore(p, stoneFn, hex(0x2456d0), hex(0x123488), hex(0x6a90f0)));
reg('diamond_ore', (p) => ore(p, stoneFn, hex(0x5decf5), hex(0x1aa5ad), hex(0xd2fbff)));
reg('emerald_ore', (p) => ore(p, stoneFn, hex(0x17dd62), hex(0x008a2c), hex(0x9cffbe)));
reg('mythril_ore', (p) => ore(p, deepFn, hex(0x6ff0d8), hex(0x2aa898), hex(0xe0fff8)));
reg('deepslate_iron_ore', (p) => ore(p, deepFn, hex(0xd8af93), hex(0xaf8e74), hex(0xe8cbb6)));
reg('deepslate_gold_ore', (p) => ore(p, deepFn, hex(0xfcee4b), hex(0xd8b81e), hex(0xfffaa0)));
reg('deepslate_diamond_ore', (p) => ore(p, deepFn, hex(0x5decf5), hex(0x1aa5ad), hex(0xd2fbff)));
reg('deepslate_energy_ore', (p) => ore(p, deepFn, hex(0xe01010), hex(0x8a0000), hex(0xff6060)));
reg('ember_ore', (p) => ore(p, (q) => P.get('ember_stone')!(q, 0), hex(0xffa020), hex(0xd05a00), hex(0xfff070)));
reg('etherium_ore', (p) => shardOre(p, (q) => P.get('ember_stone')!(q, 0), hex(0xc060ff), hex(0x7a2ac0), hex(0xf0c8ff)));
reg('celestine_ore', (p) => shardOre(p, (q) => P.get('sky_stone')!(q, 0), hex(0x7ec8ff), hex(0x2f6fb0), hex(0xffffff)));
reg('coal_block', (p) => {
  p.noise(hex(0x161616), 0.15);
  p.bevel(1.4, 0.7);
});
reg('iron_block', (p) => metalBlock(p, hex(0xdcdcdc)));
reg('copper_block', (p) => metalBlock(p, hex(0xc06c50)));
reg('gold_block', (p) => metalBlock(p, hex(0xf6d038)));
reg('diamond_block', (p) => gemBlock(p, hex(0x62ede4)));
reg('emerald_block', (p) => gemBlock(p, hex(0x42dc76)));
reg('sapphire_block', (p) => gemBlock(p, hex(0x2856c8)));
reg('energy_block', (p) => {
  p.noise(hex(0xb01212), 0.08);
  for (let i = 0; i < 16; i += 3) {
    p.vline(i, 0, 15, hex(0x7a0606));
    p.hline(0, 15, i, hex(0x7a0606));
  }
  p.speckle(hex(0xff4040), 0.08);
});
reg('mythril_block', (p, f) => {
  gemBlock(p, hex(0x3ad6c0));
  const k = (f / 8) * 16;
  for (let y = 0; y < 16; y++) {
    const x = Math.floor((y + k) % 16);
    p.set(x, y, hex(0xc8fff4));
  }
});
// Étherium : métal violet gravé d'un losange d'énergie qui pulse.
reg('etherium_block', (p, f) => {
  metalBlock(p, hex(0x9a44e8));
  const glow = mix(hex(0x5a1a8a), hex(0xf0c8ff), 0.5 + 0.5 * Math.cos((f / 8) * Math.PI * 2));
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const d = Math.abs(x - 7.5) + Math.abs(y - 7.5);
      if (d === 4) p.set(x, y, glow);
      else if (d === 1) p.set(x, y, mix(glow, hex(0xffffff), 0.4));
    }
});
// Célestine : gemme nacrée (reflets lavande sur les arêtes) où scintillent quelques étoiles.
reg('celestine_block', (p, f) => {
  gemBlock(p, hex(0x9ccff8));
  for (let y = 1; y < 15; y++)
    for (let x = 1; x < 15; x++) if ((x + y) % 5 === 0 && (x - y + 16) % 6 < 2) p.set(x, y, hex(0xe6d8ff));
  for (const [x, y, ph] of [[3, 4, 0], [11, 3, 3], [7, 9, 5], [12, 12, 2], [4, 12, 6]]) {
    const k = (f + ph) % 8;
    p.set(x, y, k < 3 ? hex(0xffffff) : hex(0xd8f0ff));
    if (k === 1) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) p.set(x + dx, y + dy, hex(0xf4fbff));
  }
});
reg('metal_panel', (p) => {
  metalBlock(p, hex(0x8a9096));
  for (const [x, y] of [[2, 2], [13, 2], [2, 13], [13, 13]]) p.set(x, y, hex(0x50565c));
});

// ------------------------------------------------------------------ construction
reg('glass', (p) => {
  p.clear();
  for (let i = 0; i < 16; i++) {
    p.set(i, 0, hex(0xdaf2f6));
    p.set(0, i, hex(0xdaf2f6));
    p.set(i, 15, hex(0xa8cfd6));
    p.set(15, i, hex(0xa8cfd6));
  }
  for (let k = 0; k < 3; k++) {
    p.set(3 + k, 4 - k, hex(0xffffff));
    p.set(9 + k, 12 - k, hex(0xeaf8fb));
  }
  p.set(4, 4, hex(0xffffff));
});
reg('tinted_glass', (p) => {
  p.noise(hex(0x2c2730), 0.06, 220);
  for (let i = 0; i < 16; i++) {
    p.set(i, 0, hex(0x3c3640));
    p.set(0, i, hex(0x3c3640));
  }
});
reg('blue_stained_glass', (p) => {
  p.fill(hex(0x3c5ad0), 120);
  for (let i = 0; i < 16; i++) {
    p.set(i, 0, hex(0x5a78e8), 200);
    p.set(0, i, hex(0x5a78e8), 200);
    p.set(i, 15, hex(0x2a44a8), 200);
    p.set(15, i, hex(0x2a44a8), 200);
  }
});
reg('bricks', (p) => bricksPattern(p, hex(0x966453), hex(0xb5a598)));
reg('ancient_bricks', (p) => {
  bricksPattern(p, hex(0x8a8060), hex(0x5a5440), 4, 4);
  p.speckle(hex(0x6a7a4a), 0.06);
});
reg('obsidian_bricks', (p) => bricksPattern(p, hex(0x241c34), hex(0x0e0a16), 4, 4));
reg('stone_bricks', (p) => stoneBricks(p, hex(0x7b7b7b), hex(0x585858)));
reg('mossy_stone_bricks', (p) => {
  stoneBricks(p, hex(0x7b7b7b), hex(0x585858));
  p.blobs(hex(0x5f7a3a), 5, 0.8, 2, 0.12);
});
reg('cracked_stone_bricks', (p) => {
  stoneBricks(p, hex(0x777777), hex(0x585858));
  let x = 3;
  for (let y = 1; y < 15; y++) {
    p.set(x, y, hex(0x4a4a4a));
    x += p.rng.next() < 0.5 ? 1 : 0;
  }
});
reg('chiseled_stone_bricks', (p) => {
  p.noise(hex(0x7b7b7b), 0.05);
  p.bevel(1.15, 0.7);
  p.rect(3, 3, 12, 12, hex(0x6a6a6a));
  p.rect(5, 5, 10, 10, hex(0x8a8a8a));
  p.rect(7, 7, 8, 8, hex(0x5a5a5a));
});
reg(['quartz_block_side', 'quartz_block_top'], (p) => {
  p.noise(hex(0xece6df), 0.025);
  p.bevel(1.03, 0.92);
});
reg('white_concrete', (p) => p.noise(hex(0xcfd5d6), 0.02));
reg('gray_concrete', (p) => p.noise(hex(0x36393d), 0.03));
reg('black_concrete', (p) => p.noise(hex(0x080a0f), 0.08));
reg('blue_concrete', (p) => p.noise(hex(0x2c2e8f), 0.03));
reg('red_concrete', (p) => p.noise(hex(0x8e2121), 0.03));
reg('yellow_concrete', (p) => p.noise(hex(0xf1af15), 0.03));
reg('green_concrete', (p) => p.noise(hex(0x495b24), 0.03));
const WOOLS: Record<string, number> = {
  white: 0xe9ecec,
  orange: 0xf07613,
  magenta: 0xbd44b3,
  light_blue: 0x3aafd9,
  yellow: 0xf8c627,
  lime: 0x70b919,
  pink: 0xed8dac,
  gray: 0x3e4447,
  light_gray: 0x8e8e86,
  cyan: 0x158991,
  purple: 0x792aac,
  blue: 0x35399d,
  brown: 0x724728,
  green: 0x546d1b,
  red: 0xa12722,
  black: 0x141519,
};
for (const [k, c] of Object.entries(WOOLS)) reg(k + '_wool', (p) => wool(p, hex(c)));
reg('hay_block_side', (p) => {
  for (let x = 0; x < 16; x++) for (let y = 0; y < 16; y++) p.set(x, y, scale(hex(0xb5970f), 0.85 + p.rng.next() * 0.3));
  for (const y of [3, 12]) p.hline(0, 15, y, hex(0x7a3a1a));
});
reg('hay_block_top', (p) => {
  p.noise(hex(0xa88a16), 0.15);
});
reg('bone_block_side', (p) => {
  p.noise(hex(0xe2ddc8), 0.04);
  for (let x = 0; x < 16; x += 4) p.vline(x, 0, 15, hex(0xc8c2aa));
});
reg('bone_block_top', (p) => {
  p.noise(hex(0xe2ddc8), 0.04);
  p.rect(4, 4, 11, 11, hex(0xc8c2aa));
  p.rect(6, 6, 9, 9, hex(0xb0aa92));
});

// ------------------------------------------------------------------ lumières
reg('torch', (p) => {
  p.clear();
  p.rect(7, 8, 8, 15, hex(0x6b4a2a));
  p.vline(7, 8, 15, hex(0x80592f));
  p.rect(7, 6, 8, 7, hex(0xffd84a));
  p.set(7, 6, hex(0xfff6c0));
});
reg('lever_handle', (p) => {
  p.clear();
  p.rect(7, 6, 8, 15, hex(0x6b4a2a));
  p.rect(7, 6, 8, 7, hex(0x8a6a3a));
});
reg('glowstone', (p) => {
  p.palette([hex(0xae7c3e), hex(0xd8a85a), hex(0xfbda74), hex(0x8a5a28), hex(0xfff0b0)], [3, 3, 2, 2, 1]);
});
reg('sea_lantern', (p) => {
  p.noise(hex(0xacc8be), 0.06);
  p.bevel(1.2, 0.85);
  p.rect(4, 4, 11, 11, hex(0xdef0e8));
  p.rect(6, 6, 9, 9, hex(0xffffff));
});
reg('lantern', (p) => {
  p.clear();
  p.rect(0, 2, 5, 8, hex(0x3a3d44));
  p.rect(1, 3, 4, 7, hex(0xffc860));
  p.rect(2, 4, 3, 6, hex(0xfff0b0));
  p.rect(0, 9, 5, 14, hex(0x3a3d44));
  p.rect(1, 0, 4, 1, hex(0x3a3d44));
  p.rect(1, 10, 4, 13, hex(0x50545c));
});
reg('lamp', (p) => {
  p.noise(hex(0x5a3a22), 0.08);
  p.rect(2, 2, 13, 13, hex(0x7a5a3a));
  for (let i = 2; i < 14; i += 3) {
    p.vline(i, 2, 13, hex(0x3a2412));
    p.hline(2, 13, i, hex(0x3a2412));
  }
});
reg('lamp_on', (p) => {
  p.noise(hex(0x9a6a3a), 0.08);
  p.rect(2, 2, 13, 13, hex(0xf8d890));
  for (let i = 2; i < 14; i += 3) {
    p.vline(i, 2, 13, hex(0xb07a3a));
    p.hline(2, 13, i, hex(0xb07a3a));
  }
});
reg('obsidian', (p) => {
  p.palette([hex(0x1a1725), hex(0x0f0c18), hex(0x2a2140), hex(0x3c2e5a)], [5, 4, 2, 1]);
});
reg('crystal_block', (p) => {
  p.palette([hex(0x7cc8e8), hex(0x5aa8d8), hex(0x9ee0f4), hex(0xc8f4ff)], [4, 3, 2, 1]);
  for (let i = 0; i < 16; i++) if (i % 5 === 0) p.vline(i, 0, 15, hex(0xb8ecff));
});
reg('crystal_cluster', (p) => {
  p.clear();
  const pal = { a: hex(0x9ee0f4), b: hex(0x5aa8d8), c: hex(0xe0fbff) };
  p.pattern(
    ['................', '.......c........', '......ca........', '......ab....c...', '..c...ab...ca...', '..ab..ab...ab...', '..ab.cab...ab...', '..abcaab..cab...', '..abaabb..aab...', '.cabaabb.caab...', '.aabaabbcaabb...', '.aabaabbaaabb...', '.aabaabbaaabb...', 'aaabaabbaaabbb..', 'abbbbbbbbbbbbb..', '................'],
    pal,
  );
});
reg('glow_mushroom', (p) => {
  p.clear();
  p.pattern(['................', '................', '................', '................', '.....cccccc.....', '....cbbccbbc....', '...cbbbccbbbc...', '...cccccccccc...', '......aaaa......', '.......aa.......', '.......aa.......', '.......aa.......', '.......aa.......', '......aaaa......', '................', '................'], { a: hex(0xc8e8d8), b: hex(0x70ffd0), c: hex(0x30c8a0) });
});
reg('glow_lichen', (p) => {
  p.clear();
  for (let i = 0; i < 40; i++) {
    const x = Math.floor(p.rng.next() * 16);
    const y = Math.floor(p.rng.next() * 16);
    p.set(x, y, p.rng.next() < 0.4 ? hex(0xb0ffd0) : hex(0x6a9a7a));
  }
});

// ------------------------------------------------------------------ végétation
reg('short_grass', (p) => grassBlades(p, [160, 160, 160], 0.85));
reg('fern', (p) => {
  p.clear();
  for (let y = 2; y < 16; y++) {
    const w = Math.floor((16 - y) / 3) + 1;
    p.set(7, y, [140, 140, 140]);
    for (let k = 1; k <= w; k++) {
      if ((y + k) % 2 === 0) {
        p.set(7 - k, y - Math.floor(k / 2), [165, 165, 165]);
        p.set(8 + k, y - Math.floor(k / 2), [150, 150, 150]);
      }
    }
  }
});
reg('dead_bush', (p) => {
  p.clear();
  const c = hex(0x8a5a2a);
  for (const [x0, y0, dx] of [[7, 15, 0], [7, 11, -1], [8, 11, 1], [6, 8, -1], [9, 7, 1], [8, 6, 0]]) {
    let x = x0;
    for (let y = y0; y > y0 - 4; y--) {
      p.set(x, y, c);
      x += dx;
    }
  }
});
reg('dry_shrub', (p) => grassBlades(p, hex(0xb09a5a), 0.6));
reg('dandelion', (p) => flower(p, hex(0xf6e533), hex(0xe2a817)));
reg('poppy', (p) => flower(p, hex(0xd8251c), hex(0x2a2a10)));
reg('cornflower', (p) => flower(p, hex(0x4a72e0), hex(0x2a3ab0)));
reg('allium', (p) => flower(p, hex(0xb86ae8), hex(0x8a3ac0), undefined, 2));
reg('oxeye_daisy', (p) => flower(p, hex(0xf2f2f2), hex(0xf0c020), undefined, 3));
reg('red_tulip', (p) => flower(p, hex(0xe0302a), hex(0xa01a14), undefined, 1));
reg('lily_of_the_valley', (p) => flower(p, hex(0xffffff), hex(0xe0e8e0), undefined, 2));
reg('cactus_side', (p) => {
  p.clear();
  for (let y = 0; y < 16; y++)
    for (let x = 1; x < 15; x++) {
      const stripe = x % 4 === 1 ? 0.8 : 1;
      p.set(x, y, scale(hex(0x58822d), stripe * (0.9 + p.rng.next() * 0.2)));
    }
  for (let i = 0; i < 10; i++) p.set(1 + Math.floor(p.rng.next() * 14), Math.floor(p.rng.next() * 16), hex(0xe8e0b0));
});
reg('cactus_top', (p) => {
  p.clear();
  p.rect(1, 1, 14, 14, hex(0x5f8c30));
  p.rect(3, 3, 12, 12, hex(0x6d9a3a));
  p.rect(6, 6, 9, 9, hex(0x87b04a));
});
reg('cactus_bottom', (p) => p.rect(1, 1, 14, 14, hex(0x4c7024)));
reg('sugar_cane', (p) => {
  p.clear();
  for (const x of [3, 8, 12]) {
    for (let y = 0; y < 16; y++) p.set(x, y, [170, 170, 170]);
    for (let y = 0; y < 16; y++) p.set(x + 1, y, [140, 140, 140]);
    p.hline(x, x + 1, 5, [110, 110, 110]);
    p.hline(x, x + 1, 12, [110, 110, 110]);
  }
});
reg('pumpkin_side', (p) => {
  p.noise(hex(0xc8771a), 0.06);
  for (let x = 0; x < 16; x += 4) p.vline(x, 0, 15, hex(0xa65d10));
});
reg('pumpkin_top', (p) => {
  p.noise(hex(0xc8771a), 0.06);
  p.rect(6, 6, 9, 9, hex(0x6a5a20));
});
reg('melon_side', (p) => {
  p.noise(hex(0x6f9a20), 0.06);
  for (let x = 1; x < 16; x += 3) p.vline(x, 0, 15, hex(0x9ac43c));
});
reg('melon_top', (p) => {
  p.noise(hex(0x6f9a20), 0.06);
  p.rect(6, 6, 9, 9, hex(0x9ac43c));
});
reg('brown_mushroom', (p) => {
  p.clear();
  p.pattern(['................', '................', '................', '................', '................', '................', '.....bbbbbb.....', '....bbbbbbbb....', '...bbcbbbbcbb...', '...bbbbbbbbbb...', '......aaaa......', '.......aa.......', '.......aa.......', '......aaaa......', '................', '................'], { a: hex(0xd8cbb2), b: hex(0x9a7458), c: hex(0xb08a6a) });
});
reg('red_mushroom', (p) => {
  p.clear();
  p.pattern(['................', '................', '................', '................', '.....bbbbbb.....', '....bbwbbbbb....', '...bbbbbbwbbb...', '...bwbbbbbbbb...', '...bbbbbbbbwb...', '......aaaa......', '.......aa.......', '.......aa.......', '.......aa.......', '......aaaa......', '................', '................'], { a: hex(0xd8cbb2), b: hex(0xd02a20), w: hex(0xf0e8e0) });
});
reg('red_mushroom_block', (p) => {
  p.noise(hex(0xc42a20), 0.06);
  p.blobs(hex(0xf0e8e0), 4, 1, 1.8, 0.02);
});
reg('mushroom_stem', (p) => {
  p.noise(hex(0xd2c8b0), 0.04);
  for (let x = 0; x < 16; x += 3) p.vline(x, 0, 15, hex(0xc0b598));
});
reg('vine', (p) => {
  p.clear();
  for (let i = 0; i < 6; i++) {
    let x = 1 + i * 3;
    for (let y = 0; y < 16; y++) {
      if (p.rng.next() < 0.8) p.set(x, y, [150, 150, 150]);
      if (p.rng.next() < 0.35) {
        p.set(x + 1, y, [120, 120, 120]);
        p.set(x - 1, y, [170, 170, 170]);
      }
      if (p.rng.next() < 0.2) x += p.rng.next() < 0.5 ? -1 : 1;
    }
  }
});
reg('lily_pad', (p) => {
  p.clear();
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const dx = x - 7.5;
      const dy = y - 7.5;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 7.2 && !(dx > 0 && Math.abs(dy) < 1)) p.set(x, y, d > 6 ? [120, 120, 120] : [160 + (d < 3 ? 20 : 0), 160, 160]);
    }
});
reg('seagrass', (p) => grassBlades(p, hex(0x3a8a3a), 1));
reg('kelp', (p) => {
  p.clear();
  for (let y = 0; y < 16; y++) {
    const x = 7 + Math.round(Math.sin(y * 0.6) * 2);
    p.set(x, y, hex(0x4a8a2a));
    p.set(x + 1, y, hex(0x3a7020));
    if (y % 4 === 1) {
      p.set(x + 2, y, hex(0x5aa034));
      p.set(x - 1, y + 1, hex(0x5aa034));
    }
  }
});
reg('tube_coral_block', (p) => {
  p.noise(hex(0x3156d0), 0.08);
  p.speckle(hex(0x6a8af0), 0.15);
});
reg('brain_coral_block', (p) => {
  p.noise(hex(0xcf5a9a), 0.08);
  for (let y = 0; y < 16; y += 3) for (let x = 0; x < 16; x++) if ((x + y) % 4 < 2) p.set(x, y, hex(0xe88ab8));
});
for (let s = 0; s <= 7; s++) reg('wheat_stage' + s, (p) => crop(p, s, 7, hex(0x3ea02a), hex(0xc8a83a), hex(0xd8b850)));
for (let s = 0; s <= 3; s++) {
  reg('carrots_stage' + s, (p) => crop(p, s, 3, hex(0x3ea02a), hex(0x4ab830), hex(0xf08a20)));
  reg('potatoes_stage' + s, (p) => crop(p, s, 3, hex(0x3ea02a), hex(0x5aa83a), hex(0xd8c070)));
  reg('beetroots_stage' + s, (p) => crop(p, s, 3, hex(0x3ea02a), hex(0x4a9a30), hex(0xa02a3a)));
}
const SAPLINGS: Record<string, number> = { oak: 0x4a8a2a, birch: 0x6a9a3a, spruce: 0x2f5a3a, jungle: 0x3a9a20, acacia: 0x7a8a2a, dark_oak: 0x2a6a1a, cherry: 0xe8a6c0, palm: 0x5a9a3a, golden: 0xf0c848 };
for (const [k, c] of Object.entries(SAPLINGS))
  reg(k + '_sapling', (p) => {
    p.clear();
    p.vline(7, 9, 15, hex(0x6b4a2a));
    p.blobs(hex(c), 5, 1.2, 2.4, 0.15);
    for (let y = 12; y < 16; y++) for (let x = 0; x < 16; x++) if (x !== 7) p.setAlpha(x, y, 0);
    for (let y = 0; y < 2; y++) for (let x = 0; x < 16; x++) p.setAlpha(x, y, 0);
  });

// ------------------------------------------------------------------ objets fonctionnels
reg('ladder', (p) => {
  p.clear();
  const c = hex(0x8a6a3a);
  p.vline(2, 0, 15, c);
  p.vline(3, 0, 15, scale(c, 0.8));
  p.vline(12, 0, 15, c);
  p.vline(13, 0, 15, scale(c, 0.8));
  for (const y of [1, 5, 9, 13]) {
    p.hline(2, 13, y, scale(c, 1.15));
    p.hline(2, 13, y + 1, scale(c, 0.75));
  }
});
const door = (top: boolean, iron: boolean) => (p: Pixmap) => {
  const base = iron ? hex(0xc8c8c8) : hex(0x9a7a48);
  const dark = iron ? hex(0x8a8a8a) : hex(0x6a5030);
  p.noise(base, 0.05);
  p.bevel(1.1, 0.7);
  if (top) {
    p.rect(3, 3, 6, 7, iron ? hex(0x7a8a90) : [0, 0, 0]);
    p.rect(9, 3, 12, 7, iron ? hex(0x7a8a90) : [0, 0, 0]);
    if (!iron) {
      p.rect(3, 3, 6, 7, [0, 0, 0], 0);
      p.rect(9, 3, 12, 7, [0, 0, 0], 0);
    }
    p.hline(2, 13, 10, dark);
  } else {
    p.rect(3, 2, 12, 6, dark);
    p.rect(3, 9, 12, 13, dark);
    p.rect(11, 7, 12, 8, iron ? hex(0x5a5a5a) : hex(0x3a3a3a));
  }
};
reg('oak_door_top', door(true, false));
reg('oak_door_bottom', door(false, false));
reg('iron_door_top', door(true, true));
reg('iron_door_bottom', door(false, true));
reg('oak_trapdoor', (p) => {
  planks(p, hex(0x9a7a48));
  p.bevel(1.1, 0.7);
  p.rect(3, 3, 6, 6, [0, 0, 0], 0);
  p.rect(9, 3, 12, 6, [0, 0, 0], 0);
  p.rect(3, 9, 6, 12, [0, 0, 0], 0);
  p.rect(9, 9, 12, 12, [0, 0, 0], 0);
});
reg('bed_top', (p) => {
  p.noise(hex(0xa82a2a), 0.05);
  p.hline(0, 15, 0, hex(0xc84040));
  p.vline(0, 0, 15, hex(0x8a1a1a));
  p.vline(15, 0, 15, hex(0x8a1a1a));
});
reg('bed_head_top', (p) => {
  p.noise(hex(0xa82a2a), 0.05);
  p.rect(2, 2, 13, 7, hex(0xeeeeee));
  p.rect(2, 7, 13, 7, hex(0xcfcfcf));
});
reg('bed_side', (p) => {
  p.clear();
  p.rect(0, 7, 15, 12, hex(0xa82a2a));
  p.rect(0, 13, 15, 15, hex(0x9a7a48));
});
reg('tnt_side', (p) => {
  p.noise(hex(0xdb441a), 0.05);
  p.rect(0, 5, 15, 10, hex(0xe8e8e8));
  p.pattern(['.XXX.X..X.XXX.', '..X..XX.X..X..', '..X..X.XX..X..', '..X..X..X..X..'], { X: hex(0x1a1a1a) }, 1, 6);
});
reg('tnt_top', (p) => {
  p.noise(hex(0xdb441a), 0.05);
  p.rect(6, 6, 9, 9, hex(0x2a2a2a));
});
reg('tnt_bottom', (p) => p.noise(hex(0xdb441a), 0.05));
reg(['energy_wire', 'energy_wire_on'], (p) => {
  p.clear();
  p.rect(0, 6, 15, 9, [220, 220, 220]);
  p.rect(0, 7, 15, 8, [255, 255, 255]);
});
const railTex = (corner: boolean, rail: RGB) => (p: Pixmap) => {
  p.clear();
  const tie = hex(0x6b4a2a);
  if (!corner) {
    for (const y of [1, 5, 9, 13]) p.rect(2, y, 13, y + 1, tie);
    p.vline(3, 0, 15, rail);
    p.vline(12, 0, 15, rail);
  } else {
    for (const [x, y] of [[3, 13], [6, 10], [10, 6], [13, 3]]) p.rect(x - 1, y - 1, x + 1, y + 1, tie);
    for (let t = 0; t <= 20; t++) {
      const a = (t / 20) * (Math.PI / 2);
      p.set(Math.round(15.5 - Math.cos(a) * 12.5), Math.round(15.5 - Math.sin(a) * 12.5), rail);
      p.set(Math.round(15.5 - Math.cos(a) * 3.5), Math.round(15.5 - Math.sin(a) * 3.5), rail);
    }
  }
};
reg('rail', railTex(false, hex(0xa0a0a0)));
reg('rail_corner', railTex(true, hex(0xa0a0a0)));
reg('powered_rail', railTex(false, hex(0xd8b030)));
reg('powered_rail_on', (p) => {
  railTex(false, hex(0xffd040))(p);
  for (let y = 0; y < 16; y += 3) p.set(7, y, hex(0xff3020));
});
reg('elevator', (p) => {
  metalBlock(p, hex(0x9aa0a8));
  p.pattern(['.....X.....', '....XXX....', '...XXXXX...', '.....X.....', '.....X.....', '...........', '.....X.....', '.....X.....', '...XXXXX...', '....XXX....', '.....X.....'], { X: hex(0x3a8ad8) }, 2, 2);
});
reg('spawner', (p) => {
  p.clear();
  for (let i = 0; i < 16; i++) {
    for (const k of [0, 5, 10, 15]) {
      p.set(i, k, hex(0x2a3a4a));
      p.set(k, i, hex(0x2a3a4a));
    }
  }
  p.speckle(hex(0x3a4a5a), 0.05);
});
reg('cobweb', (p) => {
  p.clear();
  const c = hex(0xe8e8e8);
  for (let i = 0; i < 16; i++) {
    p.set(i, i, c);
    p.set(15 - i, i, c);
    p.set(7, i, c);
    p.set(i, 7, c);
  }
  for (const r of [3, 6]) for (let a = 0; a < 16; a++) p.set(Math.round(7.5 + Math.cos(a / 2.5) * r), Math.round(7.5 + Math.sin(a / 2.5) * r), c);
});
reg('iron_bars', (p) => {
  p.clear();
  for (const x of [1, 5, 9, 13]) p.vline(x, 0, 15, hex(0x7a7a7a));
  for (const x of [2, 6, 10, 14]) p.vline(x, 0, 15, hex(0x5a5a5a));
  p.hline(0, 15, 0, hex(0x6a6a6a));
  p.hline(0, 15, 15, hex(0x6a6a6a));
});
reg('campfire_log', (p) => {
  logSide(p, hex(0x5a4228), hex(0x3a2a18), hex(0x6a5030));
  p.rect(0, 0, 15, 2, hex(0x2a1a10));
});

// ------------------------------------------------------------------ dimensions
reg('basalt_side', (p) => {
  p.noise(hex(0x4a4a50), 0.06);
  for (let x = 0; x < 16; x += 3) p.vline(x, 0, 15, hex(0x36363a));
});
reg('basalt_top', (p) => {
  p.noise(hex(0x55555c), 0.06);
  p.rect(3, 3, 12, 12, hex(0x4a4a50));
});
reg('magma', (p) => {
  p.fill(hex(0x8a3a10));
  p.blobs(hex(0x3a1a0a), 9, 1, 2, 0.1);
  p.speckle(hex(0xff8a1a), 0.12);
  p.speckle(hex(0xffd040), 0.03);
});
reg('ash', (p) => p.palette([hex(0x8a8682), hex(0x7a7672), hex(0x9a9692), hex(0x6a6662)], [4, 3, 2, 1]));
reg('ember_stone', (p) => {
  p.palette([hex(0x6e2a22), hex(0x5a201a), hex(0x82342a), hex(0x4a1a14)], [4, 3, 2, 1]);
  p.speckle(hex(0xa04a2a), 0.04);
});
reg('cloud', (p) => {
  p.noise(hex(0xf4f8ff), 0.03, 220);
});
reg('sky_stone', (p) => {
  p.palette([hex(0xc8d4e8), hex(0xb8c4d8), hex(0xd8e2f2), hex(0xa8b4c8)], [4, 3, 2, 1]);
});
reg('sky_dirt', (p) => p.palette([hex(0x8a7aa0), hex(0x7a6a90), hex(0x9a8ab0)], [3, 3, 2]));
reg('sky_grass_top', (p) => p.palette([hex(0x7fdc8f), hex(0x6fcc80), hex(0x8fe8a0), hex(0x60b870)], [4, 3, 2, 1]));
reg('sky_grass_side', (p) => {
  P.get('sky_dirt')!(p, 0);
  for (let x = 0; x < 16; x++) {
    const h = 3 + ((x * 7) % 3);
    for (let y = 0; y < h; y++) p.set(x, y, p.rng.next() < 0.5 ? hex(0x7fdc8f) : hex(0x6fcc80));
  }
});
reg('ancient_core', (p) => {
  p.noise(hex(0x3a3020), 0.1);
  p.rect(4, 4, 11, 11, hex(0xf0c040));
  p.rect(6, 6, 9, 9, hex(0xfff8c0));
});
reg('abyss_stone', (p) => {
  p.palette([hex(0x1e2a36), hex(0x16202a), hex(0x283646), hex(0x3a6a8a)], [5, 4, 2, 0.4]);
});

// ------------------------------------------------------------------ fissures (destruction)
for (let s = 0; s < 10; s++)
  reg('destroy_' + s, (p) => {
    p.clear();
    const rng = p.rng;
    const lines = 2 + s * 2;
    for (let i = 0; i < lines; i++) {
      let x = 7 + Math.floor(rng.next() * 3) - 1;
      let y = 7 + Math.floor(rng.next() * 3) - 1;
      const len = 3 + s;
      const dx = rng.next() < 0.5 ? -1 : 1;
      const dy = rng.next() < 0.5 ? -1 : 1;
      for (let k = 0; k < len; k++) {
        p.set(x, y, [20, 20, 20], 200);
        if (rng.next() < 0.6) x += dx;
        if (rng.next() < 0.6) y += dy;
        if (x < 0 || y < 0 || x > 15 || y > 15) break;
      }
    }
  });

// ------------------------------------------------------------------ API

/** Peint une texture (ou une image d'animation). Renvoie null si inconnue. */
export function paintBlockTexture(name: string, frame = 0): Pixmap | null {
  const fn = P.get(name);
  if (!fn) return null;
  const p = new Pixmap(16, 16, name + ':' + frame);
  fn(p, frame);
  return p;
}

export function hasPainter(name: string): boolean {
  return P.has(name);
}

/** Texture de secours (damier magenta/noir). */
export function missingTexture(): Pixmap {
  const p = new Pixmap(16, 16, 'missing');
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) p.set(x, y, (x < 8) !== (y < 8) ? [248, 0, 248] : [0, 0, 0]);
  return p;
}
