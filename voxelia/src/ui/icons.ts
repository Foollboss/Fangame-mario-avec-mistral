/** Icônes pixel de l'interface (menus, HUD, commandes tactiles), dessinées à partir de motifs. */
import { Pixmap, hex, type RGB } from '../render/textures/pixmap';

const cache = new Map<string, string>();

function render(rows: string[], pal: Record<string, number>, size = 16): string {
  const p = new Pixmap(size, size, 'icon');
  p.clear();
  const pp: Record<string, RGB> = {};
  for (const [k, v] of Object.entries(pal)) pp[k] = hex(v);
  const oy = Math.floor((size - rows.length) / 2);
  const ox = Math.floor((size - Math.max(...rows.map((r) => r.length))) / 2);
  p.pattern(rows, pp, ox, oy);
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d')!;
  const img = g.createImageData(size, size);
  img.data.set(p.data);
  g.putImageData(img, 0, 0);
  return c.toDataURL();
}

const DEFS: Record<string, [string[], Record<string, number>]> = {
  heart: [['.XX.XX.', 'XRRXRRX', 'XRWRRRX', 'XRRRRRX', '.XRRRX.', '..XRX..', '...X...'], { X: 0x2a0000, R: 0xe01818, W: 0xffb0b0 }],
  heart_half: [['.XX.XX.', 'XRRXDDX', 'XRWXDDX', 'XRRDDDX', '.XRDDX.', '..XDX..', '...X...'], { X: 0x2a0000, R: 0xe01818, W: 0xffb0b0, D: 0x3a1010 }],
  heart_empty: [['.XX.XX.', 'XDDXDDX', 'XDDDDDX', 'XDDDDDX', '.XDDDX.', '..XDX..', '...X...'], { X: 0x1a1a1a, D: 0x3a1010 }],
  heart_poison: [['.XX.XX.', 'XGGXGGX', 'XGWGGGX', 'XGGGGGX', '.XGGGX.', '..XGX..', '...X...'], { X: 0x0a2a00, G: 0x7a9a20, W: 0xd0f080 }],
  hunger: [['....XX.', '...XWWX', '..XMWX.', '.XMMMX.', 'XMLMMX.', 'XMMMX..', '.XXX...'], { X: 0x2a1000, M: 0xb05a20, L: 0xe08a40, W: 0xe8e4d8 }],
  hunger_half: [['....XX.', '...XWWX', '..XMWX.', '.XMMDX.', 'XMLDDX.', 'XMDDX..', '.XXX...'], { X: 0x2a1000, M: 0xb05a20, L: 0xe08a40, W: 0xe8e4d8, D: 0x3a2010 }],
  hunger_empty: [['....XX.', '...XDDX', '..XDDX.', '.XDDDX.', 'XDDDDX.', 'XDDDX..', '.XXX...'], { X: 0x1a1a1a, D: 0x3a2a1a }],
  armor: [['XX...XX', 'XWXXXWX', 'XWWWWWX', '.XWWWX.', '.XWWWX.', '.XWWWX.', '.XXXXX.'], { X: 0x1a1a1a, W: 0xd8d8d8 }],
  armor_half: [['XX...XX', 'XWXXXDX', 'XWWWDDX', '.XWWDX.', '.XWWDX.', '.XWWDX.', '.XXXXX.'], { X: 0x1a1a1a, W: 0xd8d8d8, D: 0x4a4a4a }],
  armor_empty: [['XX...XX', 'XDXXXDX', 'XDDDDDX', '.XDDDX.', '.XDDDX.', '.XDDDX.', '.XXXXX.'], { X: 0x1a1a1a, D: 0x4a4a4a }],
  bubble: [['..XXX..', '.XBBBX.', 'XBWBBBX', 'XBBBBBX', 'XBBBBBX', '.XBBBX.', '..XXX..'], { X: 0x1a3a8a, B: 0x5a8ae8, W: 0xffffff }],
  back: [['....X...', '...XX...', '..XXXXXX', '.XXXXXXX', '..XXXXXX', '...XX...', '....X...'], { X: 0x1e1e1f }],
  chevron_left: [['...X', '..X.', '.X..', 'X...', '.X..', '..X.', '...X'], { X: 0x1e1e1f }],
  social: [['..XXX......', '.X...X.XXX.', '.X...XX...X', '..XXX.X...X', '.X...X.XXX.', 'X.....X...X', 'X.....X...X'], { X: 0x1e1e1f }],
  social_white: [['..XXX......', '.X...X.XXX.', '.X...XX...X', '..XXX.X...X', '.X...X.XXX.', 'X.....X...X', 'X.....X...X'], { X: 0xffffff }],
  pencil: [['.......XX', '......XWX', '.....XWX.', '....XWX..', '...XWX...', '..XWX....', '.XWX.....', 'XXX......', 'XX.......'], { X: 0xffffff, W: 0x313233 }],
  gear: [['...XX...', '.X.XX.X.', '..XXXX..', 'XXX..XXX', 'XXX..XXX', '..XXXX..', '.X.XX.X.', '...XX...'], { X: 0xd88a3a }],
  chest_icon: [['XXXXXXXX', 'XWWWWWWX', 'XWWWWWWX', 'XXXKKXXX', 'XWWKKWWX', 'XWWWWWWX', 'XXXXXXXX'], { X: 0x3a2510, W: 0xa4762e, K: 0xd0d0d0 }],
  heads: [['XXXX....', 'XSSX.YYY', 'XEEX.YSS', 'XSSX.YEE', '.....YSS'], { X: 0x6a4a2a, S: 0xd8a080, E: 0x3a3aaa, Y: 0xe8c040 }],
  crystal: [['...XX...', '..XWBX..', '.XWBBBX.', 'XBBBBBBX', '.XBBBBX.', '..XBBX..', '...XX...'], { X: 0x6a0a2a, W: 0xffffff, B: 0xd02a6a }],
  box: [['XXXXXXXX', 'XOOOOOOX', 'XOYYYYOX', 'XOYYYYOX', 'XOOOOOOX', 'XXXXXXXX'], { X: 0x5a3a1a, O: 0xa0602a, Y: 0xe8c040 }],
  book: [['XXXXXXX.', 'XPPPPPWX', 'XPPPPPWX', 'XPPPPPWX', 'XPPPPPWX', 'XXXXXXX.'], { X: 0x3a1a3a, P: 0x8a4ab0, W: 0xf0f0e0 }],
  flask: [['..XXX...', '..XWX...', '..XWX...', '.XOOOX..', 'XOOOOOX.', 'XOOOOOX.', '.XXXXX..'], { X: 0x3a2a10, W: 0xe8e8e8, O: 0xe8a030 }],
  world: [['XXXXXXXXX', 'XBBBWBBBX', 'XBBWWWBBX', 'XGGGGGGGX', 'XGGDGGGGX', 'XDDDDDDDX', 'XXXXXXXXX'], { X: 0x1e1e1f, B: 0x6aa8f0, W: 0xffffff, G: 0x5aa83a, D: 0x8a6040 }],
  realm: [['XXXXXXX', 'XPPPPPX', 'XPLLLPX', 'XPLWLPX', 'XPLLLPX', 'XPPPPPX', 'XXXXXXX'], { X: 0x1e1e1f, P: 0x7f4ce4, L: 0xa070ff, W: 0xffffff }],
  globe: [['..XXXX..', '.XBGBBX.', 'XBGGGBBX', 'XBBGBBGX', 'XBBBBGGX', 'XGBBBBBX', '.XBBGBX.', '..XXXX..'], { X: 0x1e1e1f, B: 0x3a7ae0, G: 0x5ac03a }],
  mail: [['XXXXXXXXX', 'XWXWWWXWX', 'XWWXWXWWX', 'XWWWRWWWX', 'XWWWWWWWX', 'XXXXXXXXX'], { X: 0x5a3a1a, W: 0xf0e0c0, R: 0xe01010 }],
  face: [['XXXXXXXX', 'XHHHHHHX', 'XSSSSSSX', 'XSWESWEX', 'XSSSSSSX', 'XSSMMSSX', 'XSSSSSSX', 'XXXXXXXX'], { X: 0x3a2a1a, H: 0xe8a040, S: 0xf0c090, W: 0xffffff, E: 0x2a8a3a, M: 0xc06050 }],
  search: [['.XXX....', 'X...X...', 'X...X...', 'X...X...', '.XXXX...', '....XX..', '.....XX.', '......XX'], { X: 0xffffff }],
  search_dark: [['.XXX....', 'X...X...', 'X...X...', 'X...X...', '.XXXX...', '....XX..', '.....XX.', '......XX'], { X: 0x3f3f3f }],
  close: [['X.....X', '.X...X.', '..X.X..', '...X...', '..X.X..', '.X...X.', 'X.....X'], { X: 0x3f3f3f }],
  close_white: [['X.....X', '.X...X.', '..X.X..', '...X...', '..X.X..', '.X...X.', 'X.....X'], { X: 0xffffff }],
  keyboard: [['XXXXXXXXXX', 'XWXWXWXWXX', 'XXXXXXXXXX', 'XWXWXWXWXX', 'XXXXXXXXXX', 'XXWWWWWWXX', 'XXXXXXXXXX'], { X: 0x6a6a6a, W: 0xe8e8e8 }],
  controller: [['.XXXXXXX.', 'XXWXXXRXX', 'XWWWXGXBX', 'XXWXXXYXX', 'XX.....XX', 'X.......X'], { X: 0x5a5a5a, W: 0xe8e8e8, R: 0xe03030, G: 0x30c030, B: 0x3060e0, Y: 0xe8c030 }],
  touch: [['..XX....', '..XWX...', '..XWXXX.', 'XXXWXWXX', 'XWWWWWWX', 'XWWWWWWX', '.XWWWWX.', '..XXXX..'], { X: 0x3a2a1a, W: 0xf0c090 }],
  speaker: [['...X..X..', '..XX...X.', 'XXXX.X..X', 'XXXX.X..X', 'XXXX.X..X', '..XX...X.', '...X..X..'], { X: 0xe8e8e8 }],
  monitor: [['XXXXXXXXX', 'XBBBBBBBX', 'XBBBBBBBX', 'XBBBBBBBX', 'XXXXXXXXX', '...XXX...', '..XXXXX..'], { X: 0x8a8a8a, B: 0x3a7ae0 }],
  disk: [['XXXXXXXX', 'XWWWWWKX', 'XWWWWWWX', 'XXXXXXXX', 'XXKKKKXX', 'XXKKKKXX', 'XXXXXXXX'], { X: 0x3a3a8a, W: 0xe8e8e8, K: 0x1a1a3a }],
  person: [['...XX...', '...XX...', '.XXXXXX.', '...XX...', '...XX...', '..X..X..', '.X....X.'], { X: 0xffffff }],
  access: [['XXXXXXXX', 'X..WW..X', 'XWWWWWWX', 'X..WW..X', 'X.W..W.X', 'XXXXXXXX'], { X: 0x2a6ad0, W: 0xffffff }],
  // HUD et commandes tactiles
  jump: [['...X...', '..XXX..', '.XXXXX.', 'XXXXXXX', '..XXX..', '..XXX..', '.......', 'XXXXXXX'], { X: 0xffffff }],
  sneak: [['XXXXXXX', '.......', '..XXX..', '..XXX..', 'XXXXXXX', '.XXXXX.', '..XXX..', '...X...'], { X: 0xffffff }],
  sprint: [['X...X...', 'XX..XX..', '.XX..XX.', '..XX..XX', '.XX..XX.', 'XX..XX..', 'X...X...'], { X: 0x313233 }],
  sword: [['......XX', '.....XWX', '....XWX.', 'X..XWX..', '.XXWX...', '..XX....', '.X.XX...', 'X...X...'], { X: 0x313233, W: 0x8a8a8a }],
  use: [['...X...', '...X...', '...X...', 'XXX.XXX', '...X...', '...X...', '...X...'], { X: 0x313233 }],
  chat: [['XXXXXXXX', 'XWWWWWWX', 'XWXXXXWX', 'XWWWWWWX', 'XXXXWXXX', '...XX...', '..X.....'], { X: 0x313233, W: 0xd0d0d0 }],
  pause: [['XXXXXXX', '.......', 'XXXXXXX', '.......', 'XXXXXXX'], { X: 0x313233 }],
  camera: [['..XXX...', '..X.X...', '..XXX...', 'XXXXXXX.', '..XXX..X', '..X.X...', '.X...X..'], { X: 0x313233 }],
  dots: [['X.X.X'], { X: 0xdddddd }],
  drop: [['...X...', '...X...', '...X...', '.X.X.X.', '..XXX..', '...X...', 'XXXXXXX'], { X: 0xffffff }],
  flyup: [['...X...', '..XXX..', '.XXXXX.', 'XXXXXXX'], { X: 0xffffff }],
  flydown: [['XXXXXXX', '.XXXXX.', '..XXX..', '...X...'], { X: 0xffffff }],
  map_icon: [['XXXXXXXX', 'XGGBBGGX', 'XGBBBGGX', 'XGGBGGRX', 'XGGGGGGX', 'XXXXXXXX'], { X: 0xd8c8a0, G: 0x7ab050, B: 0x3a6ae0, R: 0xd02020 }],
  trophy: [['XXXXXXX', 'XYYYYYX', '.XYYYX.', '..XYX..', '...X...', '..XXX..'], { X: 0x8a6a10, Y: 0xf6d23c }],
  plus: [['...X...', '...X...', '...X...', 'XXXXXXX', '...X...', '...X...', '...X...'], { X: 0xffffff }],
  folder: [['XXX.....', 'XYYXXXXX', 'XYYYYYYX', 'XYYYYYYX', 'XYYYYYYX', 'XXXXXXXX'], { X: 0x6a4a10, Y: 0xe8c040 }],
  trash: [['..XXX..', 'XXXXXXX', '.X.X.X.', '.X.X.X.', '.X.X.X.', '.XXXXX.'], { X: 0xffffff }],
  copy: [['XXXXX..', 'X...X..', 'X..XXXX', 'X..X..X', 'XXXX..X', '...X..X', '...XXXX'], { X: 0xffffff }],
  export: [['...X...', '..XXX..', '.X.X.X.', '...X...', 'X..X..X', 'X.....X', 'XXXXXXX'], { X: 0xffffff }],
};

export function icon(name: string): string {
  let url = cache.get(name);
  if (url) return url;
  const d = DEFS[name];
  if (!d) return '';
  // Les icônes de statut (cœurs, faim, armure, bulles) remplissent leur case : canevas 9×9.
  const stat = /^(heart|hunger|armor|bubble)/.test(name);
  url = render(d[0], d[1], stat ? 9 : 16);
  cache.set(name, url);
  return url;
}
