/** Logo « VOXERRA » en blocs de pierre pixelisés, dessiné sur canvas. */
const GLYPHS: Record<string, string[]> = {
  V: ['X...X', 'X...X', 'X...X', 'X...X', '.X.X.', '.X.X.', '..X..'],
  O: ['.XXX.', 'X...X', 'X...X', 'X...X', 'X...X', 'X...X', '.XXX.'],
  X: ['X...X', 'X...X', '.X.X.', '..X..', '.X.X.', 'X...X', 'X...X'],
  E: ['XXXXX', 'X....', 'X....', 'XXXX.', 'X....', 'X....', 'XXXXX'],
  R: ['XXXX.', 'X...X', 'X...X', 'XXXX.', 'X.X..', 'X..X.', 'X...X'],
  A: ['.XXX.', 'X...X', 'X...X', 'XXXXX', 'X...X', 'X...X', 'X...X'],
};

export function drawLogo(text = 'VOXERRA', cell = 11): HTMLCanvasElement {
  const letters = [...text];
  const gap = cell;
  const w = letters.length * 5 * cell + (letters.length - 1) * gap + 12;
  const hgt = 7 * cell + 14;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = hgt;
  const g = c.getContext('2d')!;
  // graine fixe : le logo est identique à chaque lancement
  let seed = 1337;
  const rnd = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
  const cells: [number, number][] = [];
  letters.forEach((ch, li) => {
    const glyph = GLYPHS[ch] ?? GLYPHS.O;
    const ox = 4 + li * (5 * cell + gap);
    glyph.forEach((row, y) => [...row].forEach((v, x) => v === 'X' && cells.push([ox + x * cell, 4 + y * cell])));
  });
  // extrusion (ombre portée en profondeur)
  for (let d = 6; d >= 1; d--) {
    g.fillStyle = d > 3 ? '#1b1b1f' : '#2c2c33';
    for (const [x, y] of cells) g.fillRect(x + d, y + d, cell, cell);
  }
  // blocs texturés
  for (const [x, y] of cells) {
    for (let py = 0; py < cell; py++)
      for (let px = 0; px < cell; px++) {
        const n = rnd();
        let v = 150 + Math.floor(n * 40);
        if (py === 0 || px === 0) v += 45;
        if (py === cell - 1 || px === cell - 1) v -= 55;
        if (n > 0.93) v -= 40;
        const tint = y < 4 + 2 * cell ? 8 : 0;
        g.fillStyle = `rgb(${v + tint},${v + tint},${v + 6 + tint})`;
        g.fillRect(x + px, y + py, 1, 1);
      }
  }
  // fissures légères
  g.fillStyle = 'rgba(40,40,48,0.55)';
  for (let i = 0; i < cells.length; i += 3) {
    const [x, y] = cells[i];
    const len = 2 + Math.floor(rnd() * 5);
    let cx = x + Math.floor(rnd() * cell),
      cy = y + Math.floor(rnd() * 3);
    for (let k = 0; k < len; k++) {
      g.fillRect(cx, cy, 1, 1);
      cy++;
      cx += rnd() < 0.5 ? 0 : rnd() < 0.5 ? 1 : -1;
    }
  }
  return c;
}

export const SPLASHES = [
  'Cent pour cent procédural !',
  'Aucune texture copiée !',
  'Attention aux vesses explosives !',
  'La lumirite brille dans le noir.',
  'Ne réveillez pas le Veilleur !',
  'Des cubes à perte de vue !',
  'Aussi en multijoueur !',
  'Minez, construisez, survivez !',
  "L'Abîme vous attend…",
  'Fait avec des voxels frais !',
  'Plus de 160 blocs !',
  'Gravité réduite dans les Cimes !',
  'Les pelucheons adorent le blé.',
  'Sauvegarde anti-coupure !',
  'Avez-vous vu un cerf d’argent ?',
  'Greedy meshing inside!',
  'Les nuages sont en blocs !',
  'Écrit en TypeScript !',
];
