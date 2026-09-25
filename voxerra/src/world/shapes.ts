/**
 * Formes des blocs non cubiques (en 1/16 de bloc), partagées par le mailleur,
 * la physique (collisions) et le ciblage (sélection).
 */
import { Shape } from '../registry/blocks';

/** Boîte [x0, y0, z0, x1, y1, z1] en seizièmes. */
export type Box = [number, number, number, number, number, number];

/** Connexions horizontales : bit 0 = +X, 1 = −X, 2 = +Z, 3 = −Z */
export const CONN_PX = 1;
export const CONN_NX = 2;
export const CONN_PZ = 4;
export const CONN_NZ = 8;

const FULL: Box = [0, 0, 0, 16, 16, 16];

export function stairsBoxes(meta: number): Box[] {
  const f = meta & 3;
  const top = (meta & 4) !== 0;
  const slab: Box = top ? [0, 8, 0, 16, 16, 16] : [0, 0, 0, 16, 8, 16];
  const y0 = top ? 0 : 8,
    y1 = top ? 8 : 16;
  let back: Box;
  if (f === 0) back = [0, y0, 8, 16, y1, 16];
  else if (f === 1) back = [0, y0, 0, 8, y1, 16];
  else if (f === 2) back = [0, y0, 0, 16, y1, 8];
  else back = [8, y0, 0, 16, y1, 16];
  return [slab, back];
}

export function doorBox(meta: number): Box {
  const f = meta & 3;
  const open = (meta & 4) !== 0;
  const t = 3;
  const boxes: Box[] = [
    [0, 0, 0, 16, 16, t], // plaque nord
    [16 - t, 0, 0, 16, 16, 16], // plaque est
    [0, 0, 16 - t, 16, 16, 16], // plaque sud
    [0, 0, 0, t, 16, 16], // plaque ouest
  ];
  // fermé : côté d'où venait le joueur ; ouvert : pivote de 90°
  const closed = [0, 1, 2, 3][f];
  const opened = [3, 0, 1, 2][f];
  return boxes[open ? opened : closed];
}

export function torchBox(meta: number): Box {
  switch (meta & 7) {
    case 1:
      return [12, 3, 7, 14, 14, 9];
    case 2:
      return [2, 3, 7, 4, 14, 9];
    case 3:
      return [7, 3, 12, 9, 14, 14];
    case 4:
      return [7, 3, 2, 9, 14, 4];
    default:
      return [7, 0, 7, 9, 11, 9];
  }
}

export function ladderBox(meta: number): Box {
  switch (meta & 3) {
    case 0:
      return [15, 0, 0, 16, 16, 16];
    case 1:
      return [0, 0, 0, 1, 16, 16];
    case 2:
      return [0, 0, 15, 16, 16, 16];
    default:
      return [0, 0, 0, 16, 16, 1];
  }
}

function armBoxes(conn: number, post: Box, arm: (dir: number) => Box): Box[] {
  const out: Box[] = [post];
  if (conn & CONN_PX) out.push(arm(0));
  if (conn & CONN_NX) out.push(arm(1));
  if (conn & CONN_PZ) out.push(arm(2));
  if (conn & CONN_NZ) out.push(arm(3));
  return out;
}

function arm(dir: number, w0: number, w1: number, y0: number, y1: number, from: number): Box {
  switch (dir) {
    case 0:
      return [from, y0, w0, 16, y1, w1];
    case 1:
      return [0, y0, w0, 16 - from, y1, w1];
    case 2:
      return [w0, y0, from, w1, y1, 16];
    default:
      return [w0, y0, 0, w1, y1, 16 - from];
  }
}

/** Boîtes visuelles d'une forme de modèle. */
export function modelBoxes(shape: number, meta: number, conn: number): Box[] {
  switch (shape) {
    case Shape.SLAB:
      return [(meta & 1) === 1 ? [0, 8, 0, 16, 16, 16] : [0, 0, 0, 16, 8, 16]];
    case Shape.STAIRS:
      return stairsBoxes(meta);
    case Shape.DOOR:
      return [doorBox(meta)];
    case Shape.TORCH:
      return [torchBox(meta)];
    case Shape.LADDER:
      return [ladderBox(meta)];
    case Shape.PANE:
      return armBoxes(conn, [7, 0, 7, 9, 16, 9], (d) => arm(d, 7, 9, 0, 16, 9));
    case Shape.FENCE: {
      const out = armBoxes(conn, [6, 0, 6, 10, 16, 10], (d) => arm(d, 7, 9, 12, 15, 10));
      if (conn & CONN_PX) out.push(arm(0, 7, 9, 6, 9, 10));
      if (conn & CONN_NX) out.push(arm(1, 7, 9, 6, 9, 10));
      if (conn & CONN_PZ) out.push(arm(2, 7, 9, 6, 9, 10));
      if (conn & CONN_NZ) out.push(arm(3, 7, 9, 6, 9, 10));
      return out;
    }
    case Shape.WALL:
      return armBoxes(conn, [4, 0, 4, 12, 16, 12], (d) => arm(d, 5, 11, 0, 14, 12));
    case Shape.LEVER:
      return (meta & 8) !== 0
        ? [
            [5, 0, 4, 11, 2, 12],
            [7, 2, 9, 9, 10, 11],
          ]
        : [
            [5, 0, 4, 11, 2, 12],
            [7, 2, 5, 9, 10, 7],
          ];
    case Shape.PLATE:
      return [(meta & 1) === 1 ? [1, 0, 1, 15, 0.5, 15] : [1, 0, 1, 15, 1, 15]];
    case Shape.CARPET:
      return [[0, 0, 0, 16, 2, 16]];
    case Shape.CHEST:
      return [[1, 0, 1, 15, 14, 15]];
    case Shape.LANTERN:
      return [
        [5, 0, 5, 11, 7, 11],
        [6, 7, 6, 10, 9, 10],
      ];
    case Shape.CACTUS:
      return [[1, 0, 1, 15, 16, 15]];
    case Shape.FARMLAND:
      return [[0, 0, 0, 16, 15, 16]];
    case Shape.PORTAL:
      return [(meta & 1) === 0 ? [0, 0, 6, 16, 16, 10] : [6, 0, 0, 10, 16, 16]];
    default:
      return [FULL];
  }
}

/** Boîtes de collision (null = traversable). */
export function collisionBoxes(shape: number, meta: number, conn: number, solid: boolean): Box[] | null {
  if (!solid) return null;
  switch (shape) {
    case Shape.CUBE:
    case Shape.LIQUID:
      return [FULL];
    case Shape.FENCE:
    case Shape.WALL: {
      const boxes = modelBoxes(shape, meta, conn).map((b) => [b[0], 0, b[2], b[3], 24, b[5]] as Box);
      return boxes;
    }
    case Shape.PANE:
      return modelBoxes(shape, meta, conn);
    case Shape.LANTERN:
      return [[5, 0, 5, 11, 9, 11]];
    default:
      return modelBoxes(shape, meta, conn);
  }
}

/** Boîte de sélection (contour de ciblage). */
export function selectionBox(shape: number, meta: number, conn: number): Box[] {
  switch (shape) {
    case Shape.CROSS:
      return [[2, 0, 2, 14, 14, 14]];
    case Shape.CROP:
      return [[0, 0, 0, 16, 2 + (meta & 7) * 2, 16]];
    case Shape.LIQUID:
    case Shape.CUBE:
      return [FULL];
    default:
      return modelBoxes(shape, meta, conn);
  }
}
