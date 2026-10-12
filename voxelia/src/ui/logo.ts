/**
 * Logo « VOXELIA » dessiné procéduralement : lettres en blocs de pierre
 * (texture bruitée, biseau clair, ombre portée et extrusion sombre).
 */

// Police de lettres en grille 6×7 (# = bloc).
const GLYPHS: Record<string, string[]> = {
  V: ['##  ##', '##  ##', '##  ##', '##  ##', ' #### ', ' #### ', '  ##  '],
  O: [' #### ', '##  ##', '##  ##', '##  ##', '##  ##', '##  ##', ' #### '],
  X: ['##  ##', '##  ##', ' #### ', '  ##  ', ' #### ', '##  ##', '##  ##'],
  E: ['######', '##    ', '##    ', '##### ', '##    ', '##    ', '######'],
  L: ['##    ', '##    ', '##    ', '##    ', '##    ', '##    ', '######'],
  I: ['######', '  ##  ', '  ##  ', '  ##  ', '  ##  ', '  ##  ', '######'],
  A: [' #### ', '##  ##', '##  ##', '######', '##  ##', '##  ##', '##  ##'],
};

function rand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Crée le canvas du logo (résolution interne fixe, mise à l'échelle par CSS). */
export function createLogoCanvas(text = 'VOXELIA'): HTMLCanvasElement {
  const cell = 8; // taille d'un « bloc » en pixels
  const depth = 3; // extrusion en blocs-pixels
  const gap = 1;
  const letters = [...text].map((ch) => GLYPHS[ch] ?? GLYPHS.O);
  const cols = letters.reduce((n, g) => n + g[0].length + gap, -gap);
  const w = cols * cell + depth * 4 + 16;
  const h = 7 * cell + depth * 4 + 16;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d')!;
  g.imageSmoothingEnabled = false;
  const r = rand(1337);
  const ox = 8;
  const oy = 6;
  const cells: Array<[number, number]> = [];
  let cx = 0;
  for (const glyph of letters) {
    for (let y = 0; y < 7; y++) for (let x = 0; x < glyph[y].length; x++) if (glyph[y][x] === '#') cells.push([cx + x, y]);
    cx += glyph[0].length + gap;
  }
  // Contour noir épais + extrusion
  g.fillStyle = '#000';
  for (const [x, y] of cells) g.fillRect(ox + x * cell - 2, oy + y * cell - 2, cell + 4 + depth * 4, cell + 4 + depth * 4);
  for (let d = depth * 4; d > 0; d -= 1) {
    const shade = 40 + (depth * 4 - d) * 6;
    g.fillStyle = `rgb(${shade},${shade},${shade + 4})`;
    for (const [x, y] of cells) g.fillRect(ox + x * cell + d, oy + y * cell + d, cell, cell);
  }
  // Faces avant : pierre claire bruitée avec biseau
  for (const [x, y] of cells) {
    const px = ox + x * cell;
    const py = oy + y * cell;
    for (let j = 0; j < cell; j++)
      for (let i = 0; i < cell; i++) {
        const n = r();
        let v = 196 + Math.floor(n * 34) - (j > cell * 0.6 ? 18 : 0);
        if (i === 0 || j === 0) v += 30;
        if (i === cell - 1 || j === cell - 1) v -= 40;
        if (n > 0.93) v -= 50;
        v = Math.max(0, Math.min(255, v));
        g.fillStyle = `rgb(${v},${v - 4},${v - 10})`;
        g.fillRect(px + i, py + j, 1, 1);
      }
  }
  // Fissures discrètes (joints entre blocs)
  g.fillStyle = 'rgba(60,55,50,0.55)';
  for (const [x, y] of cells) if ((x * 7 + y * 3) % 5 === 0) g.fillRect(ox + x * cell + 2, oy + y * cell + cell - 3, cell - 3, 1);
  return c;
}
