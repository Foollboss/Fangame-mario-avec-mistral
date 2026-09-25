/** Dimensions du monde voxel. */
export const CS = 16; // taille d'un chunk (X/Z) et d'une section (Y)
export const CS_BITS = 4;
export const CS_MASK = 15;
export const WORLD_H = 256;
export const SECTIONS = WORLD_H / CS; // 16 sections par colonne
export const SECTION_VOL = CS * CS * CS; // 4096
export const SEA_LEVEL = 64;

/** Clé numérique d'une colonne de chunks (supporte ±32768 chunks, soit ±524 288 blocs). */
export const ckey = (cx: number, cz: number): number => (cx + 0x8000) * 0x10000 + (cz + 0x8000);
export const ckeyX = (k: number): number => Math.floor(k / 0x10000) - 0x8000;
export const ckeyZ = (k: number): number => (k % 0x10000) - 0x8000;

/** Clé d'une section : colonne + indice vertical. */
export const skey = (cx: number, sy: number, cz: number): number => ckey(cx, cz) * 32 + sy;
export const skeyC = (k: number): number => Math.floor(k / 32);
export const skeyY = (k: number): number => k % 32;

/** Index local dans une section 16³. */
export const sidx = (x: number, y: number, z: number): number => (y << 8) | (z << 4) | x;
/** Index local dans une colonne (y 0..255). */
export const cidx = (x: number, y: number, z: number): number => (y << 8) | (z << 4) | x;
