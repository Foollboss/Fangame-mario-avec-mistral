/**
 * Portails entre dimensions : détection d'un cadre valide (obsidienne pour les Terres de braise,
 * blocs de cristal pour le Royaume céleste), remplissage, recherche ou construction
 * du portail d'arrivée et conversion des coordonnées (1:8 pour les Terres de braise).
 */
import { B } from '../world/blocks';
import { WORLD_HEIGHT } from '../world/constants';
import type { World } from '../world/World';

export type PortalKind = 'ember' | 'sky';

export function frameBlock(kind: PortalKind): number {
  return kind === 'ember' ? B.obsidian : B.crystal_block;
}

export function portalBlock(kind: PortalKind): number {
  return kind === 'ember' ? B.ember_portal : B.sky_portal;
}

export function portalKindOf(id: number): PortalKind | null {
  if (id === B.ember_portal) return 'ember';
  if (id === B.sky_portal) return 'sky';
  return null;
}

/** Dimension de destination d'un portail. */
export function portalTarget(kind: PortalKind, from: number): number {
  if (kind === 'ember') return from === 1 ? 0 : 1;
  return from === 2 ? 0 : 2;
}

export function convertCoords(kind: PortalKind, from: number, to: number, x: number, z: number): [number, number] {
  if (kind === 'ember') {
    if (from === 0 && to === 1) return [Math.floor(x / 8), Math.floor(z / 8)];
    if (from === 1 && to === 0) return [x * 8, z * 8];
  }
  return [x, z];
}

const isAir = (w: World, x: number, y: number, z: number) => {
  const id = w.id(x, y, z);
  return id === 0 || id === B.fire;
};

/**
 * Essaie d'allumer un portail dont l'intérieur contient (x, y, z).
 * Renvoie true si un cadre valide a été trouvé et rempli.
 */
export function tryLightPortal(w: World, x: number, y: number, z: number, kind: PortalKind): boolean {
  const frame = frameBlock(kind);
  for (const axis of [0, 1]) {
    const dx = axis === 0 ? 1 : 0;
    const dz = axis === 0 ? 0 : 1;
    if (!isAir(w, x, y, z)) return false;
    // Descendre jusqu'au cadre
    let by = y;
    while (by > 0 && isAir(w, x, by - 1, z) && y - by < 21) by--;
    if (w.id(x, by - 1, z) !== frame) continue;
    // Bord gauche
    let lx = x;
    let lz = z;
    let n = 0;
    while (isAir(w, lx - dx, by, lz - dz) && w.id(lx - dx, by - 1, lz - dz) === frame && n < 21) {
      lx -= dx;
      lz -= dz;
      n++;
    }
    if (w.id(lx - dx, by, lz - dz) !== frame) continue;
    // Largeur
    let width = 0;
    while (width < 22 && isAir(w, lx + dx * width, by, lz + dz * width) && w.id(lx + dx * width, by - 1, lz + dz * width) === frame) width++;
    if (width < 2 || width > 21) continue;
    if (w.id(lx + dx * width, by, lz + dz * width) !== frame) continue;
    // Hauteur
    let height = 0;
    let ok = true;
    outer: for (height = 0; height < 22; height++) {
      for (let i = 0; i < width; i++) {
        const cx = lx + dx * i;
        const cz = lz + dz * i;
        const id = w.id(cx, by + height, cz);
        if (id === frame) {
          if (i === 0) break outer;
          ok = false;
          break outer;
        }
        if (!isAir(w, cx, by + height, cz)) {
          ok = false;
          break outer;
        }
      }
      if (w.id(lx - dx, by + height, lz - dz) !== frame || w.id(lx + dx * width, by + height, lz + dz * width) !== frame) {
        ok = false;
        break;
      }
    }
    if (!ok || height < 3 || height > 21) continue;
    // Linteau complet
    for (let i = 0; i < width; i++) if (w.id(lx + dx * i, by + height, lz + dz * i) !== frame) ok = false;
    if (!ok) continue;
    const pb = portalBlock(kind);
    for (let h = 0; h < height; h++) for (let i = 0; i < width; i++) w.set(lx + dx * i, by + h, lz + dz * i, pb, axis, 'player');
    return true;
  }
  return false;
}

/** Cherche un bloc de portail du type voulu autour de (x, z). */
export function findPortal(w: World, kind: PortalKind, x: number, z: number, radius: number): [number, number, number] | null {
  const pb = portalBlock(kind);
  let best: [number, number, number] | null = null;
  let bestD = Infinity;
  for (let dz = -radius; dz <= radius; dz++)
    for (let dx = -radius; dx <= radius; dx++) {
      const px = x + dx;
      const pz = z + dz;
      if (!w.isLoaded(px, pz)) continue;
      const top = Math.min(WORLD_HEIGHT - 1, w.height(px, pz) + 2);
      for (let y = 1; y <= top; y++) {
        if (w.id(px, y, pz) !== pb || w.id(px, y - 1, pz) === pb) continue;
        const d = dx * dx + dz * dz;
        if (d < bestD) {
          bestD = d;
          best = [px, y, pz];
        }
      }
    }
  return best;
}

/** Construit un portail (cadre 4×5 + plateforme) à l'arrivée. Renvoie la position d'apparition. */
export function buildPortal(w: World, kind: PortalKind, dim: number, x: number, z: number): [number, number, number] {
  const frame = frameBlock(kind);
  const pb = portalBlock(kind);
  // Recherche d'une hauteur praticable
  let y = -1;
  if (dim === 1) {
    for (let yy = 100; yy > 36; yy--) {
      if (w.id(x, yy, z) === 0 && w.id(x, yy + 1, z) === 0 && w.id(x, yy + 2, z) === 0 && w.id(x, yy + 3, z) === 0 && w.def(x, yy - 1, z).solid) {
        y = yy;
        break;
      }
    }
    if (y < 0) y = 70;
  } else if (dim === 2) {
    const h = w.height(x, z);
    y = h > 10 ? h + 1 : 110;
  } else {
    y = Math.max(64, w.height(x, z) + 1);
  }
  // Plateforme 4×3 et dégagement
  for (let i = -1; i <= 2; i++)
    for (let k = -1; k <= 1; k++) {
      if (!w.def(x + i, y - 1, z + k).solid) w.set(x + i, y - 1, z + k, dim === 2 ? B.cloud : frame, 0, 'player');
      for (let h = 0; h < 4; h++) w.set(x + i, y + h, z + k, 0, 0, 'player');
    }
  // Cadre (axe X) : intérieur 2×3
  for (let i = -1; i <= 2; i++) {
    w.set(x + i, y - 1, z, frame, 0, 'player');
    w.set(x + i, y + 3, z, frame, 0, 'player');
  }
  for (let h = 0; h < 3; h++) {
    w.set(x - 1, y + h, z, frame, 0, 'player');
    w.set(x + 2, y + h, z, frame, 0, 'player');
    w.set(x, y + h, z, pb, 0, 'player');
    w.set(x + 1, y + h, z, pb, 0, 'player');
  }
  return [x + 1, y, z + 1.5];
}
