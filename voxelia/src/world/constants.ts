/** Constantes partagées entre le thread principal et les workers. */
export const CHUNK_SIZE = 16;
export const CHUNK_SHIFT = 4;
export const WORLD_HEIGHT = 256;
export const SECTION_SIZE = 16;
export const SECTION_COUNT = WORLD_HEIGHT / SECTION_SIZE;
export const COLUMN_VOLUME = CHUNK_SIZE * CHUNK_SIZE * WORLD_HEIGHT;
export const SEA_LEVEL = 62;

/** Un bloc est stocké sur 16 bits : 10 bits d'identifiant + 6 bits d'état (orientation, niveau…). */
export const ID_BITS = 10;
export const ID_MASK = (1 << ID_BITS) - 1;
export const META_MASK = 0x3f;

export const blockId = (v: number): number => v & ID_MASK;
export const blockMeta = (v: number): number => (v >> ID_BITS) & META_MASK;
export const packBlock = (id: number, meta = 0): number => (id & ID_MASK) | ((meta & META_MASK) << ID_BITS);

/** Index d'un bloc dans une colonne : y-majeur, puis z, puis x. */
export const colIndex = (x: number, y: number, z: number): number => (y << 8) | (z << 4) | x;

export const chunkKey = (cx: number, cz: number): string => cx + ',' + cz;

export const enum Face {
  PX = 0, // +X (est)
  NX = 1, // -X (ouest)
  PY = 2, // haut
  NY = 3, // bas
  PZ = 4, // +Z (sud)
  NZ = 5, // -Z (nord)
}

export const FACE_DIRS: ReadonlyArray<readonly [number, number, number]> = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export const OPPOSITE_FACE = [1, 0, 3, 2, 5, 4];

/** Directions horizontales (orientation des blocs) : 0 = sud (+Z), 1 = ouest (-X), 2 = nord (-Z), 3 = est (+X). */
export const HORIZONTAL_DIRS: ReadonlyArray<readonly [number, number]> = [
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 0],
];

export const enum Dimension {
  Overworld = 0,
  Ember = 1,
  Sky = 2,
}

export const DIMENSION_NAMES = ['Surface', 'Terres de braise', 'Royaume céleste'];
