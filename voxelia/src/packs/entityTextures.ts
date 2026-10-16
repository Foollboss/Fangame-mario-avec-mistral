/**
 * Coffre et lit : le jeu de référence les dessine avec des textures d'entité 64x64
 * (patrons dépliés), Voxelia avec des textures de bloc 16x16. On recompose ici les faces
 * Voxelia à partir des patrons (mise en page 1.15+ : bandes latérales retournées).
 * Les packs HD (128x128…) sont ramenés à l'échelle 64.
 */
import { crop, resizeBox, type RGBAImage } from './images';

/** Région (x, y, l, h) exprimée à l'échelle 64x64, ramenée à cette taille. */
function region(img: RGBAImage, x: number, y: number, w: number, h: number): RGBAImage {
  const s = img.width / 64;
  const r = crop(img, Math.round(x * s), Math.round(y * s), Math.round(w * s), Math.round(h * s));
  return s === 1 ? r : resizeBox(r, w, h);
}

function px(img: RGBAImage, x: number, y: number): [number, number, number, number] {
  const i = (y * img.width + x) * 4;
  return [img.data[i], img.data[i + 1], img.data[i + 2], img.data[i + 3]];
}

class Tex16 {
  readonly data = new Uint8Array(16 * 16 * 4);
  set(x: number, y: number, c: [number, number, number, number]): void {
    if (x < 0 || y < 0 || x > 15 || y > 15) return;
    this.data.set(c, (y * 16 + x) * 4);
  }
  /** Copie `src` en (dx, dy), retournée verticalement si `flipY`. */
  blit(src: RGBAImage, dx: number, dy: number, flipY = false): void {
    for (let y = 0; y < src.height; y++) for (let x = 0; x < src.width; x++) this.set(dx + x, dy + y, px(src, x, flipY ? src.height - 1 - y : y));
  }
  /** Remplit les bords non couverts (ligne 0-1, colonnes 0 et 15) avec les pixels voisins. */
  extendEdges(x0: number, y0: number, x1: number, y1: number): void {
    for (let y = 0; y < 16; y++)
      for (let x = 0; x < 16; x++) {
        if (x >= x0 && x <= x1 && y >= y0 && y <= y1) continue;
        const sx = Math.min(x1, Math.max(x0, x));
        const sy = Math.min(y1, Math.max(y0, y));
        this.data.copyWithin((y * 16 + x) * 4, (sy * 16 + sx) * 4, (sy * 16 + sx) * 4 + 4);
      }
  }
  opaque(): boolean {
    let n = 0;
    for (let i = 3; i < this.data.length; i += 4) if (this.data[i] > 127) n++;
    return n > 64;
  }
}

/**
 * Coffre (entity/chest/normal.png). Couvercle : boîte 14x5x14 en (0,0) ; base : 14x10x14
 * en (0,19) ; loquet : 2x4x1 en (0,0). Voxelia lit la zone colonnes 1-14, lignes 2-15
 * des côtés (haut du coffre en ligne 2) et colonnes/lignes 1-14 du dessus.
 */
export function chestPart(img: RGBAImage, part: 'top' | 'side' | 'front'): Uint8Array | null {
  if (img.width < 64 || img.width !== img.height) return null;
  const t = new Tex16();
  if (part === 'top') {
    // Dessus extérieur du couvercle (emplacement « dessous » du patron, retourné).
    t.blit(region(img, 28, 0, 14, 14), 1, 1, true);
    t.extendEdges(1, 1, 14, 14);
  } else {
    // 1re bande = côté, 4e bande = face avant (avec l'ombre du loquet).
    const u = part === 'front' ? 42 : 0;
    t.blit(region(img, u, 14, 14, 5), 1, 2, true);
    // Base : 10 lignes dont la plus haute est cachée par le couvercle.
    const base = region(img, u, 33, 14, 10);
    t.blit(crop(base, 0, 0, 14, 9), 1, 7, true);
    if (part === 'front') {
      // Loquet : face avant 2x4 en (1,1), centré, lignes 5 à 8.
      t.blit(region(img, 1, 1, 2, 4), 7, 5, true);
    }
    t.extendEdges(1, 2, 14, 15);
  }
  return t.opaque() ? t.data : null;
}

/**
 * Lit (entity/bed/red.png). Tête : boîte 16x16x6 en (0,0) ; pied : 16x16x6 en (0,22).
 * Le matelas vu de dessus est la face 16x16 en (6,6) (tête, avec l'oreiller) et (6,28)
 * (pied). Côté Voxelia : matelas sur les lignes 7-12, cadre en bois sur les lignes 13-15.
 */
export function bedPart(img: RGBAImage, part: 'top' | 'head_top' | 'side'): Uint8Array | null {
  if (img.width < 64 || img.width !== img.height) return null;
  const t = new Tex16();
  if (part === 'head_top') t.blit(region(img, 6, 6, 16, 16), 0, 0);
  else if (part === 'top') t.blit(region(img, 6, 28, 16, 16), 0, 0);
  else {
    // Bande latérale du pied (6 de large, 16 de long) tournée d'un quart de tour :
    // la colonne la plus proche du dessus (x = 5) devient la ligne du haut.
    const strip = region(img, 0, 28, 6, 16);
    for (let h = 0; h < 6; h++) for (let c = 0; c < 16; c++) t.set(c, 7 + h, px(strip, 5 - h, c));
    // Cadre : planche d'extrémité du pied (dessous de la boîte), 3 lignes.
    const board = region(img, 22, 22, 16, 3);
    t.blit(board, 0, 13);
  }
  return t.opaque() || part === 'side' ? t.data : null;
}
