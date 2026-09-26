/**
 * Structures des Terres d'Aube : hameaux (générés par règles : routes,
 * maisons, fermes, forge, enclos), ruines, tours de guet, temple des sables,
 * ruines de portail (runique et céleste), sanctuaire moussu (autel du Gardien sylvestre),
 * observatoire (autel astral), crypte (très rare).
 */
import { Builder, S, W, N, E, DX, DZ } from './builder';
import { type StructureType, type StructCtx, type Placement, biomeId, flatness } from './types';
import { Rng } from '../../engine/rng';
import { SEA_LEVEL } from '../../world/constants';

const WATERY = new Set(['ocean', 'ocean_profond', 'ocean_gele', 'riviere', 'riviere_gelee', 'plage', 'rivage_rocheux', 'marecage']);

// ------------------------------------------------------------------ styles
interface Style {
  planks: string;
  log: string;
  base: string;
  roof: string;
  floor: string;
  fence: string;
  path: string;
}

const STYLES: Record<string, Style> = {
  chene: { planks: 'planches_chene', log: 'buche_chene', base: 'moellon', roof: 'tuiles', floor: 'planches_chene', fence: 'planches_chene_barriere', path: 'gravier' },
  bouleau: { planks: 'planches_bouleau', log: 'buche_bouleau', base: 'moellon', roof: 'tuiles', floor: 'planches_bouleau', fence: 'planches_bouleau_barriere', path: 'gravier' },
  acacia: { planks: 'planches_acacia', log: 'buche_acacia', base: 'moellon', roof: 'tuiles', floor: 'planches_acacia', fence: 'planches_acacia_barriere', path: 'gravier' },
  sable: { planks: 'gres_taille', log: 'gres', base: 'gres', roof: 'gres_taille', floor: 'gres_taille', fence: 'planches_acacia_barriere', path: 'gres' },
  epicea: { planks: 'planches_epicea', log: 'buche_epicea', base: 'moellon', roof: 'tuiles_ardoise', floor: 'planches_epicea', fence: 'planches_epicea_barriere', path: 'gravier' },
};

const VILLAGE_BIOMES: Record<string, string> = {
  plaines: 'chene',
  prairie_fleurie: 'chene',
  foret_bouleaux: 'bouleau',
  savane: 'acacia',
  desert: 'sable',
  canyons_ocre: 'sable',
  taiga: 'epicea',
  taiga_enneigee: 'epicea',
  toundra: 'epicea',
};

// ------------------------------------------------------------------ pièces
/** Maison à pignon : porte en (0,1,-1), emprise x∈[-hw,hw], z∈[-D,-1]. */
function house(b: Builder, st: Style, hw: number, D: number, rich: boolean): void {
  if (!b.touches(-hw - 2, 1, hw + 2, -D - 2, 1)) return;
  const x0 = -hw,
    x1 = hw,
    z0 = -D,
    z1 = -1;
  const H = 4;
  const c = (n: string, m = 0) => b.c(n, m);
  b.clearTrees(x0 - 2, z0 - 2, x1 + 2, 1);
  for (let x = x0 - 1; x <= x1 + 1; x++)
    for (let z = z0 - 1; z <= z1 + 1; z++) {
      b.clearAbove(x, 1, z, H + hw + 4);
      if (x >= x0 && x <= x1 && z >= z0 && z <= z1) b.foundation(x, 0, z, c(st.base));
    }
  b.fill(x0, 0, z0, x1, 0, z1, c(st.base));
  b.fill(x0 + 1, 0, z0 + 1, x1 - 1, 0, z1 - 1, c(st.floor));
  for (let y = 1; y < H; y++)
    for (let x = x0; x <= x1; x++)
      for (let z = z0; z <= z1; z++) {
        const edgeX = x === x0 || x === x1,
          edgeZ = z === z0 || z === z1;
        if (!edgeX && !edgeZ) continue;
        b.set(x, y, z, c(edgeX && edgeZ ? st.log : st.planks));
      }
  // fenêtres
  const midZ = Math.round((z0 + z1) / 2);
  b.set(x0, 2, midZ, c('vitre'));
  b.set(x1, 2, midZ, c('vitre'));
  if (hw >= 3) {
    b.set(-2, 2, z1, c('vitre'));
    b.set(2, 2, z1, c('vitre'));
    b.set(-1, 2, z0, c('vitre'));
    b.set(1, 2, z0, c('vitre'));
  } else b.set(0, 2, z0, c('vitre'));
  // porte et seuil
  b.door(0, 1, z1, 'porte_bois', S);
  b.set(0, 0, 0, c(st.path));
  b.clearAbove(0, 1, 0, 3);
  b.torch(1, 2, 0, N);
  // toit à deux pans
  const roofS = st.roof + '_escalier',
    roofSlab = st.roof + '_dalle';
  for (let k = 0; ; k++) {
    const zf = z1 + 1 - k,
      zb = z0 - 1 + k,
      y = H + k;
    if (zf < zb) break;
    if (zf === zb) {
      for (let x = x0 - 1; x <= x1 + 1; x++) b.set(x, y, zf, c(roofSlab));
      break;
    }
    for (let x = x0 - 1; x <= x1 + 1; x++) {
      b.stairs(x, y, zf, roofS, N);
      b.stairs(x, y, zb, roofS, S);
    }
    for (let z = zb + 1; z < zf; z++) {
      if (z < z0 || z > z1) continue;
      b.set(x0, y, z, c(st.planks));
      b.set(x1, y, z, c(st.planks));
    }
  }
  // intérieur
  b.set(x0 + 1, 1, z0 + 1, c('couchette'));
  b.chest(x1 - 1, 1, z0 + 1, S, rich ? 'maison_riche' : 'maison');
  if (rich) {
    b.oriented(x1 - 1, 1, z0 + 2, 'atelier', W);
    b.set(x0 + 1, 1, z1 - 1, c('etagere'));
    b.set(x0 + 1, 2, z1 - 1, c('etagere'));
  }
  b.torch(0, 3, z0 + 1, N);
  b.entity('habitant', 0, 1, z0 + 1);
}

/** Forge ouverte : bassin de lave, fourneaux, coffre du forgeron. */
function forge(b: Builder, st: Style): void {
  if (!b.touches(-4, 1, 4, -7, 1)) return;
  const c = (n: string, m = 0) => b.c(n, m);
  for (let x = -4; x <= 4; x++)
    for (let z = -7; z <= 0; z++) {
      b.clearAbove(x, 1, z, 7);
      if (z <= -1 && Math.abs(x) <= 3) b.foundation(x, 0, z, c('moellon'));
    }
  b.fill(-3, 0, -6, 3, 0, -1, c('moellon'));
  for (let y = 1; y <= 3; y++) {
    for (let z = -6; z <= -1; z++) {
      b.set(-3, y, z, c(z === -1 || z === -6 ? st.log : 'moellon'));
      if (z === -6 || z === -1) b.set(3, y, z, c(st.log));
    }
    for (let x = -3; x <= 3; x++) b.set(x, y, -6, c(x === -3 || x === 3 ? st.log : 'moellon'));
  }
  b.fill(-4, 4, -7, 4, 4, 0, c('moellon_dalle'));
  b.set(-2, 0, -5, c('lave'));
  b.set(-1, 0, -5, c('lave'));
  b.set(-2, 1, -4, c('moellon_muret'));
  b.set(-1, 1, -4, c('moellon_muret'));
  b.oriented(0, 1, -5, 'fourneau', S);
  b.oriented(1, 1, -5, 'fourneau', S);
  b.set(2, 1, -3, c('bloc_fer'));
  b.chest(2, 1, -5, W, 'forgeron');
  b.oriented(2, 1, -2, 'atelier', W);
  b.torch(-2, 3, -5, N);
  b.entity('habitant', 0, 1, -3);
}

/** Champ cultivé avec canal d'irrigation. */
function farm(b: Builder, st: Style): void {
  if (!b.touches(-3, -1, 3, -9, 1)) return;
  const c = (n: string, m = 0) => b.c(n, m);
  for (let x = -3; x <= 3; x++)
    for (let z = -9; z <= -1; z++) {
      b.clearAbove(x, 1, z, 5);
      b.foundation(x, 0, z, c('terre'));
      const edge = x === -3 || x === 3 || z === -9 || z === -1;
      if (edge) b.set(x, 0, z, c(st.log === 'gres' ? 'gres' : st.log));
      else if (x === 0) b.set(x, 0, z, c('eau'));
      else {
        b.set(x, 0, z, c('terre_labouree', 7));
        b.set(x, 1, z, c('ble', 2 + Math.floor(b.rnd(x, 1, z) * 6)));
      }
    }
}

/** Enclos à animaux. */
function pen(b: Builder, st: Style, animal: string): void {
  if (!b.touches(-3, -1, 3, -7, 1)) return;
  const c = (n: string) => b.c(n);
  for (let x = -3; x <= 3; x++)
    for (let z = -7; z <= -1; z++) {
      b.clearAbove(x, 1, z, 4);
      b.foundation(x, 0, z, c('terre'));
      if (st.path === 'gres') b.set(x, 0, z, c('sable'));
      else b.set(x, 0, z, c('herbe'));
      if (x === -3 || x === 3 || z === -7 || z === -1) b.set(x, 1, z, c(st.fence));
    }
  b.entity(animal, -1, 1, -4);
  b.entity(animal, 1, 1, -3);
  b.entity(animal, 0, 1, -5);
}

function lampPost(b: Builder, st: Style): void {
  b.clearAbove(0, 1, 0, 5);
  b.foundation(0, 1, 0, b.c(st.base));
  for (let y = 1; y <= 3; y++) b.set(0, y, 0, b.c(st.fence));
  b.set(0, 4, 0, b.c('lanterne'));
}

function well(b: Builder, st: Style): void {
  const c = (n: string) => b.c(n);
  for (let x = -3; x <= 3; x++)
    for (let z = -3; z <= 3; z++) {
      b.clearAbove(x, 1, z, 6);
      b.foundation(x, 0, z, c(st.base));
      b.set(x, 0, z, c(st.path));
    }
  for (let x = -1; x <= 1; x++)
    for (let z = -1; z <= 1; z++) {
      if (x === 0 && z === 0) {
        for (let y = -4; y <= 0; y++) b.set(0, y, 0, c('eau'));
        b.set(0, -5, 0, c(st.base));
        continue;
      }
      b.set(x, 1, z, c(st.base));
      b.set(x, 0, z, c(st.base));
      for (let y = -4; y < 0; y++) b.set(x, y, z, c(st.base));
    }
  for (const [x, z] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ]) {
    b.set(x, 2, z, c(st.fence));
    b.set(x, 3, z, c(st.fence));
  }
  b.fill(-1, 4, -1, 1, 4, 1, c(st.base === 'gres' ? 'gres_taille_dalle' : 'moellon_dalle'));
}

// ------------------------------------------------------------------ hameau
const village: StructureType = {
  id: 'village',
  name: 'Hameau',
  aliases: ['hameau', 'hamlet', 'aldea'],
  dim: 'surface',
  region: 22,
  salt: 101,
  chance: 0.55,
  radius: 44,
  site(ctx, x, z, rng) {
    const style = VILLAGE_BIOMES[biomeId(ctx, x, z)];
    if (!style) return null;
    const [lo, hi, h] = flatness(ctx, x, z, 20);
    if (lo <= SEA_LEVEL || hi - lo > 8) return null;
    return { x, y: h, z, rot: 0, seed: rng.nextU32(), style };
  },
  build(b, p, ctx) {
    const st = STYLES[p.style ?? 'chene'];
    const rng = new Rng(p.seed);
    const g = ctx.gen;
    // Routes
    const roads: { d: number; len: number }[] = [];
    for (let d = 0; d < 4; d++) if (d < 2 || rng.chance(0.75)) roads.push({ d, len: 14 + rng.int(16) });
    const reach = Math.max(...roads.map((r) => r.len)) + 12;
    for (let wx = b.buf.bx; wx < b.buf.bx + 16; wx++)
      for (let wz = b.buf.bz; wz < b.buf.bz + 16; wz++) {
        const d = Math.hypot(wx - p.x, wz - p.z);
        if (d <= reach) b.clearTreesWorld(wx, wz, g.surfaceHeight(wx, wz) - 1, 34);
      }
    const pathCell = b.c(st.path);
    const bridge = b.c(st.planks === 'gres_taille' ? 'gres_taille' : st.planks);
    const t = b.t;
    for (const r of roads) {
      const px = DX[(r.d + 1) % 4],
        pz = DZ[(r.d + 1) % 4];
      for (let k = 3; k <= r.len; k++)
        for (let w = -1; w <= 1; w++) {
          const x = p.x + DX[r.d] * k + px * w,
            z = p.z + DZ[r.d] * k + pz * w;
          if (!b.buf.inside(x, z)) continue;
          const y = g.surfaceHeight(x, z);
          if (y < SEA_LEVEL - 1) {
            b.buf.setW(x, SEA_LEVEL - 1, z, bridge);
            continue;
          }
          const cur = b.buf.getW(x, y, z) & 0xfff;
          if (cur !== 0 && t.solid[cur] && t.pass[cur] === 0) b.buf.setW(x, y, z, pathCell);
          for (let k2 = 1; k2 <= 4; k2++) {
            const up = b.buf.getW(x, y + k2, z) & 0xfff;
            if (up !== 0 && !t.liquid[up]) b.buf.setW(x, y + k2, z, 0);
          }
        }
    }
    // Place centrale
    b.at(p.x, p.y, p.z, 0);
    well(b, st);
    b.entity('habitant', 2, 1, 2);
    // Bâtiments le long des routes (règles : alternance, pas, types pondérés)
    let forges = 0;
    const kinds = [
      { k: 'maison', weight: 4 },
      { k: 'grande', weight: 2 },
      { k: 'champ', weight: 2 },
      { k: 'forge', weight: 0.8 },
      { k: 'enclos', weight: 1 },
    ];
    for (const r of roads) {
      for (let k = 6; k + 3 <= r.len; k += 8 + rng.int(3)) {
        for (const side of [1, -1]) {
          if (!rng.chance(0.8)) continue;
          let kind = rng.weighted(kinds).k;
          if (kind === 'forge' && forges++ > 0) kind = 'maison';
          const sd = (r.d + (side === 1 ? 1 : 3)) % 4;
          const ox = p.x + DX[r.d] * k + DX[sd] * 2,
            oz = p.z + DZ[r.d] * k + DZ[sd] * 2;
          const depth = kind === 'champ' ? 9 : kind === 'grande' ? 7 : 5;
          const cy = g.surfaceHeight(ox + DX[sd] * ((depth >> 1) + 1), oz + DZ[sd] * ((depth >> 1) + 1));
          const y = Math.max(SEA_LEVEL, cy);
          const animal = rng.chance(0.5) ? 'pelucheon' : 'picoreau';
          b.at(ox, y, oz, (sd + 2) % 4);
          switch (kind) {
            case 'maison':
              house(b, st, 2, 5, false);
              break;
            case 'grande':
              house(b, st, 3, 7, true);
              break;
            case 'champ':
              farm(b, st);
              break;
            case 'forge':
              forge(b, st);
              break;
            case 'enclos':
              pen(b, st, animal);
              break;
          }
        }
      }
      // lampadaire en bout de route
      const ex = p.x + DX[r.d] * (r.len + 1),
        ez = p.z + DZ[r.d] * (r.len + 1);
      b.at(ex, g.surfaceHeight(ex, ez), ez, 0);
      lampPost(b, st);
    }
  },
};

// ------------------------------------------------------------------ ruines
const ruins: StructureType = {
  id: 'ruines',
  name: 'Ruines',
  aliases: ['ruine', 'ruins', 'ruinas'],
  dim: 'surface',
  region: 9,
  salt: 102,
  chance: 0.35,
  radius: 9,
  site(ctx, x, z, rng) {
    if (WATERY.has(biomeId(ctx, x, z))) return null;
    const [lo, hi, h] = flatness(ctx, x, z, 5);
    if (lo <= SEA_LEVEL || hi - lo > 5) return null;
    return { x, y: h, z, rot: rng.int(4), seed: rng.nextU32(), v: rng.int(4) };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const hx = 3 + (p.v! & 1) * 2,
      hz = 3 + ((p.v! >> 1) & 1);
    const mats = ['moellon_moussu', 'briques_pierre_fissurees', 'briques_pierre_moussues', 'moellon', 'briques_pierre'];
    const pick = (x: number, y: number, z: number) => b.c(mats[Math.floor(b.rnd(x, y, z, 7) * mats.length)]);
    b.clearTrees(-hx - 3, -hz - 3, hx + 3, hz + 3);
    for (let x = -hx; x <= hx; x++)
      for (let z = -hz; z <= hz; z++) {
        const edge = Math.abs(x) === hx || Math.abs(z) === hz;
        b.clearAbove(x, 1, z, 6);
        b.foundation(x, 0, z, b.c('moellon'));
        if (edge) {
          const h = Math.floor(b.rnd(x, 0, z, 3) * 5);
          b.set(x, 0, z, pick(x, 0, z));
          for (let y = 1; y <= h; y++) if (b.keep(x, y, z, 0.85)) b.set(x, y, z, pick(x, y, z));
        } else if (b.keep(x, 0, z, 0.7)) b.set(x, 0, z, b.c(b.rnd(x, 0, z, 9) < 0.5 ? 'pierre_taillee' : 'gravier'));
      }
    // colonne effondrée
    for (let y = 1; y <= 3; y++) if (b.keep(-hx + 2, y, 0, 0.9)) b.set(-hx + 2, y, 0, b.c('pierre_taillee'));
    b.chest(hx - 1, 1, -hz + 1, S, 'ruines');
    // cave cachée
    if (p.v! >= 2) {
      b.box(-2, -5, -2, 2, -1, 2, b.c('moellon_moussu'));
      b.set(0, 0, 0, b.c('gravier'));
      for (let y = -4; y <= -1; y++) b.ladder(0, y, -1, N);
      b.set(0, -1, 0, 0);
      b.chest(1, -4, 1, N, 'ruines');
      b.torch(-1, -3, 1, S);
    }
  },
};

// ------------------------------------------------------------------ tour de guet
const tower: StructureType = {
  id: 'tour',
  name: 'Tour de guet',
  aliases: ['tour_de_guet', 'watchtower', 'tower', 'torre'],
  dim: 'surface',
  region: 16,
  salt: 103,
  chance: 0.35,
  radius: 8,
  site(ctx, x, z, rng) {
    const bi = biomeId(ctx, x, z);
    if (!['plaines', 'savane', 'taiga', 'desert', 'canyons_ocre', 'foret', 'toundra', 'prairie_fleurie', 'foret_bouleaux'].includes(bi)) return null;
    const [lo, hi, h] = flatness(ctx, x, z, 4);
    if (lo <= SEA_LEVEL || hi - lo > 4) return null;
    return { x, y: h, z, rot: rng.int(4), seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const c = (n: string, m = 0) => b.c(n, m);
    const TOP = 13;
    b.clearTrees(-6, -6, 6, 6);
    for (let x = -3; x <= 3; x++)
      for (let z = -3; z <= 3; z++) {
        b.clearAbove(x, 1, z, 8);
        if (Math.abs(x) <= 2 && Math.abs(z) <= 2) b.foundation(x, 0, z, c('moellon'));
      }
    for (let y = 0; y <= TOP; y++)
      for (let x = -2; x <= 2; x++)
        for (let z = -2; z <= 2; z++) {
          const edge = Math.abs(x) === 2 || Math.abs(z) === 2;
          const corner = Math.abs(x) === 2 && Math.abs(z) === 2;
          if (y === 0) b.set(x, y, z, c('moellon'));
          else if (edge) b.set(x, y, z, c(corner ? 'briques_pierre' : b.rnd(x, y, z) < 0.25 ? 'moellon_moussu' : 'moellon'));
          else b.set(x, y, z, 0);
        }
    // meurtrières
    for (const y of [5, 9]) {
      b.set(0, y, 2, 0);
      b.set(2, y, 0, 0);
      b.set(-2, y, 0, 0);
    }
    b.door(0, 1, 2, 'porte_bois', S);
    b.clearAbove(0, 1, 3, 3);
    for (let y = 1; y <= TOP; y++) b.ladder(0, y, -1, N);
    // plate-forme
    for (let x = -3; x <= 3; x++)
      for (let z = -3; z <= 3; z++) {
        if (x === 0 && z === -1) continue;
        b.set(x, TOP, z, c('planches_chene'));
        const edge = Math.abs(x) === 3 || Math.abs(z) === 3;
        if (edge) b.set(x, TOP + 1, z, c('planches_chene_barriere'));
      }
    for (const [x, z] of [
      [-3, -3],
      [3, -3],
      [-3, 3],
      [3, 3],
    ]) {
      b.set(x, TOP + 2, z, c('planches_chene_barriere'));
      b.set(x, TOP + 3, z, c('planches_chene_barriere'));
    }
    b.fill(-3, TOP + 4, -3, 3, TOP + 4, 3, c('planches_chene_dalle'));
    b.set(0, TOP + 3, 0, c('lanterne'));
    b.chest(2, TOP + 1, 2, N, 'tour');
    b.entity('pillard_archer', 1, TOP + 1, 1);
    b.entity('pillard', -1, TOP + 1, 1);
    b.entity('pillard', 3, 1, 4);
  },
};

// ------------------------------------------------------------------ temple des sables
const temple: StructureType = {
  id: 'temple',
  name: 'Temple des sables',
  aliases: ['temple_sables', 'templo'],
  dim: 'surface',
  region: 20,
  salt: 104,
  chance: 0.7,
  radius: 14,
  site(ctx, x, z, rng) {
    const bi = biomeId(ctx, x, z);
    if (bi !== 'desert' && bi !== 'canyons_ocre') return null;
    const [lo, hi, h] = flatness(ctx, x, z, 10);
    if (lo <= SEA_LEVEL || hi - lo > 7) return null;
    return { x, y: Math.max(lo + 1, h - 1), z, rot: rng.int(4), seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const c = (n: string, m = 0) => b.c(n, m);
    const R = 10;
    const G = c('gres_taille'),
      Gs = c('gres');
    b.clearTrees(-R - 3, -R - 3, R + 3, R + 3);
    for (let x = -R - 1; x <= R + 1; x++)
      for (let z = -R - 1; z <= R + 1; z++) {
        b.clearAbove(x, 1, z, 22);
        if (Math.abs(x) <= R && Math.abs(z) <= R) b.foundation(x, 0, z, Gs);
      }
    b.fill(-R, 0, -R, R, 0, R, G);
    // salle et murs
    for (let y = 1; y <= 6; y++)
      for (let x = -R; x <= R; x++)
        for (let z = -R; z <= R; z++) {
          const edge = Math.abs(x) === R || Math.abs(z) === R;
          b.set(x, y, z, edge ? (y === 3 ? c('argile_cuite_ocre') : G) : 0);
        }
    // pyramide creuse
    for (let k = 0; k <= R; k++) {
      const s = R - k,
        y = 7 + k;
      for (let x = -s; x <= s; x++)
        for (let z = -s; z <= s; z++) {
          const edge = Math.abs(x) === s || Math.abs(z) === s;
          b.set(x, y, z, edge || s <= 1 ? (k % 3 === 2 ? c('argile_cuite_ocre') : G) : 0);
        }
    }
    // entrée et tours
    b.fill(-1, 1, R, 1, 3, R, 0);
    for (const sx of [-1, 1]) {
      const cx = sx * (R - 1);
      for (let y = 1; y <= 12; y++)
        for (let x = cx - 2; x <= cx + 2; x++)
          for (let z = R - 3; z <= R + 1; z++) {
            const edge = Math.abs(x - cx) === 2 || z === R - 3 || z === R + 1;
            if (edge || y === 12) b.set(x, y, z, y % 4 === 0 ? c('argile_cuite_ocre') : G);
          }
      b.set(cx, 13, R - 1, c('gres_taille_dalle'));
    }
    // piliers intérieurs et motif
    for (const [x, z] of [
      [-5, -5],
      [5, -5],
      [-5, 5],
      [5, 5],
    ])
      for (let y = 1; y <= 6; y++) b.set(x, y, z, c('pierre_taillee'));
    for (let x = -3; x <= 3; x++) for (let z = -3; z <= 3; z++) if ((x + z) % 2 === 0) b.set(x, 0, z, c('argile_cuite_ocre'));
    b.set(0, 0, 0, c('argile_cuite_blanche'));
    for (const [x, z] of [
      [-R + 1, 0],
      [R - 1, 0],
      [0, -R + 1],
    ])
      b.torch(x, 4, z, x < 0 ? W : x > 0 ? E : N, 'torche');
    // chambre secrète sous le motif central
    b.box(-4, -12, -4, 4, -7, 4, G);
    for (let y = -11; y <= -1; y++) {
      b.set(0, y, -1, G);
      b.ladder(0, y, 0, N);
    }
    b.set(0, 0, 0, c('argile_cuite_blanche'));
    b.chest(3, -11, 0, W, 'temple');
    b.chest(-3, -11, 0, E, 'temple');
    b.chest(0, -11, 3, N, 'temple');
    for (const [x, z] of [
      [2, 2],
      [-2, -3],
      [3, -3],
    ])
      b.set(x, -10, z, c('toile'));
    b.torch(0, -9, -3, N);
    b.spawner(-3, -11, -3, 'rodeur');
  },
};

// ------------------------------------------------------------------ ruine de portail
const portalRuin: StructureType = {
  id: 'portail',
  name: 'Ruine de portail',
  aliases: ['ruine_portail', 'portail_ruine', 'portal'],
  dim: 'surface',
  region: 14,
  salt: 105,
  chance: 0.35,
  radius: 7,
  site(ctx, x, z, rng) {
    if (WATERY.has(biomeId(ctx, x, z))) return null;
    const [lo, hi, h] = flatness(ctx, x, z, 4);
    if (lo <= SEA_LEVEL || hi - lo > 5) return null;
    return { x, y: h, z, rot: rng.int(4), seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const c = (n: string) => b.c(n);
    b.clearTrees(-6, -5, 6, 5);
    for (let x = -4; x <= 4; x++)
      for (let z = -3; z <= 3; z++) {
        const d = Math.abs(x) / 4.5 + Math.abs(z) / 3.5;
        if (d > 1.1) continue;
        b.clearAbove(x, 1, z, 7);
        b.foundation(x, 0, z, c('pierre'));
        const r = b.rnd(x, 0, z, 5);
        b.set(x, 0, z, c(r < 0.3 ? 'cendrite' : r < 0.5 ? 'sable_cendre' : r < 0.75 ? 'moellon_moussu' : 'pierre'));
      }
    // cadre 4×5 avec blocs manquants
    for (let x = -1; x <= 2; x++)
      for (let y = 1; y <= 5; y++) {
        const frame = x === -1 || x === 2 || y === 1 || y === 5;
        if (!frame) continue;
        if (b.keep(x, y, 0, 0.72)) b.set(x, y, 0, c('pierre_runique'));
        else if (b.keep(x, y, 0, 0.5)) b.set(x, y, 0, c('briques_pierre_fissurees'));
      }
    b.set(3, 1, 1, c('pierre_runique'));
    b.set(-2, 1, -1, c('pierre_runique'));
    b.chest(-3, 1, 1, E, 'portail_ruine');
  },
};

// ------------------------------------------------------------------ ruine de portail céleste
/**
 * Pendant lumineux de la ruine de portail : au lieu d'un cadre runique enfoncé dans la cendre,
 * un cadre de pierres d'aurore brisé sur un îlot de calcaire qui flotte au-dessus du sol,
 * entouré de nuages ; un escalier de nuages y monte, un coffre garde de quoi le réparer.
 */
const skyPortalRuin: StructureType = {
  id: 'portail_celeste',
  name: 'Ruine de portail céleste',
  aliases: ['ruine_portail_celeste', 'portail_aurore', 'sky_portal', 'portal_celeste'],
  dim: 'surface',
  region: 14,
  salt: 111,
  chance: 0.35,
  radius: 8,
  site(ctx, x, z, rng) {
    if (WATERY.has(biomeId(ctx, x, z))) return null;
    const [lo, hi, h] = flatness(ctx, x, z, 5);
    if (lo <= SEA_LEVEL || hi - lo > 6) return null;
    return { x, y: h, z, rot: rng.int(4), seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const c = (n: string) => b.c(n);
    const lime = c('calcaire'),
      cloud = c('nuage'),
      frame = c('pierre_aurore');
    const I = 6; // dessus de l'îlot
    b.clearTrees(-8, -7, 8, 7, -2, 20);
    // sol : calcaire et gravier clairs, fleurs d'aurore, nuages tombés
    for (let x = -5; x <= 5; x++)
      for (let z = -4; z <= 4; z++) {
        if (Math.abs(x) / 5.5 + Math.abs(z) / 4.5 > 1.1) continue;
        b.clearAbove(x, 1, z, I + 8);
        b.foundation(x, 0, z, c('pierre'));
        const r = b.rnd(x, 0, z, 7);
        b.set(x, 0, z, r < 0.45 ? lime : r < 0.6 ? c('gravier') : c('herbe'));
        const f = b.rnd(x, 1, z, 8);
        if (f < 0.1) b.place(x, 1, z, c('fleur_aurore'));
        else if (f > 0.94) b.place(x, 1, z, cloud);
      }
    // îlot flottant : dessus de calcaire, dessous qui s'affine en nuages
    for (let x = -4; x <= 4; x++)
      for (let z = -3; z <= 3; z++) {
        const d = (x / 4.5) ** 2 + (z / 3.5) ** 2;
        if (d > 1) continue;
        b.set(x, I, z, lime);
        if (d <= 0.55) b.set(x, I - 1, z, lime);
        else if (b.rnd(x, I - 1, z, 9) < 0.5) b.set(x, I - 1, z, cloud);
        if (d <= 0.2) b.set(x, I - 2, z, cloud);
      }
    // cadre 4×5 (intérieur 2×3) avec des pierres manquantes, deux autres tombées au sol
    for (let x = -1; x <= 2; x++)
      for (let y = I + 1; y <= I + 5; y++) {
        const edge = x === -1 || x === 2 || y === I + 1 || y === I + 5;
        if (!edge) continue;
        if (b.keep(x, y, 0, 0.72)) b.set(x, y, 0, frame);
        else if (b.keep(x, y, 0, 0.5)) b.set(x, y, 0, lime);
      }
    b.set(3, 1, 2, frame);
    b.set(-3, 1, -2, frame);
    // coffre au pied du cadre, fleurs sur l'îlot
    b.chest(-3, I + 1, 1, E, 'portail_celeste_ruine');
    b.place(3, I + 1, -1, c('fleur_aurore'));
    b.place(-2, I + 1, -2, c('fleur_aurore'));
    // escalier de nuages : du sol jusqu'au bord de l'îlot
    for (let i = 0; i < I; i++) {
      b.set(-6 + i, 1 + i, 5, cloud);
      b.clearAbove(-6 + i, 2 + i, 5, 3);
    }
    b.set(-1, I, 4, cloud);
    // quelques nuages qui dérivent au-dessus
    for (const [x, y, z] of [
      [-5, I + 6, -2],
      [-4, I + 6, -2],
      [4, I + 7, 1],
      [5, I + 7, 1],
      [5, I + 7, 2],
    ])
      b.set(x, y, z, cloud);
  },
};

// ------------------------------------------------------------------ sanctuaire moussu
const sanctuary: StructureType = {
  id: 'sanctuaire',
  name: 'Sanctuaire moussu',
  aliases: ['sanctuaire_moussu', 'sanctuary', 'santuario'],
  dim: 'surface',
  region: 24,
  salt: 106,
  chance: 0.7,
  radius: 11,
  site(ctx, x, z, rng) {
    const bi = biomeId(ctx, x, z);
    if (!['foret', 'foret_ancienne', 'jungle', 'foret_bouleaux', 'foret_fongique', 'bosquet_cristal', 'taiga'].includes(bi)) return null;
    const [lo, hi, h] = flatness(ctx, x, z, 8);
    if (lo <= SEA_LEVEL || hi - lo > 6) return null;
    return { x, y: h, z, rot: rng.int(4), seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const c = (n: string, m = 0) => b.c(n, m);
    b.clearTrees(-12, -12, 12, 12);
    for (let x = -9; x <= 9; x++)
      for (let z = -9; z <= 9; z++) {
        const d = Math.hypot(x, z);
        if (d > 9.3) continue;
        b.clearAbove(x, 1, z, 14);
        b.foundation(x, 0, z, c('terre'));
        const r = b.rnd(x, 0, z);
        b.set(x, 0, z, c(d < 3.2 ? 'briques_pierre_moussues' : r < 0.5 ? 'mousse' : r < 0.8 ? 'moellon_moussu' : 'herbe'));
        if (d >= 3.5 && d < 8 && r > 0.93) b.set(x, 1, z, c('lumifleur'));
      }
    // piliers en cercle
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const x = Math.round(Math.cos(a) * 7),
        z = Math.round(Math.sin(a) * 7);
      const h = 3 + Math.floor(b.rnd(x, 0, z, 11) * 3);
      for (let y = 1; y <= h; y++) b.set(x, y, z, c(y === h ? 'pierre_taillee' : 'moellon_moussu'));
      b.set(x, h + 1, z, c('feuilles_chene'));
      if (i % 2 === 0) b.set(x, h + 1, z, c('lanterne'));
    }
    // estrade et autel
    b.fill(-1, 1, -1, 1, 1, 1, c('briques_pierre_moussues'));
    b.stairs(0, 1, 2, 'briques_pierre_moussues_escalier', N);
    b.stairs(0, 1, -2, 'briques_pierre_moussues_escalier', S);
    b.stairs(2, 1, 0, 'briques_pierre_moussues_escalier', W);
    b.stairs(-2, 1, 0, 'briques_pierre_moussues_escalier', E);
    b.set(0, 2, 0, c('autel_sylvestre'));
    b.chest(0, 1, -5, S, 'sanctuaire');
    b.set(-1, 1, -5, c('lumifleur'));
    b.set(1, 1, -5, c('lumifleur'));
  },
};

// ------------------------------------------------------------------ observatoire
const observatory: StructureType = {
  id: 'observatoire',
  name: 'Observatoire',
  aliases: ['observatory', 'observatorio'],
  dim: 'surface',
  region: 22,
  salt: 107,
  chance: 0.75,
  radius: 7,
  site(ctx, x, z, rng) {
    if (WATERY.has(biomeId(ctx, x, z))) return null;
    const [lo, hi, h] = flatness(ctx, x, z, 4);
    if (lo <= SEA_LEVEL + 1 || hi - lo > 6) return null;
    return { x, y: lo, z, rot: rng.int(4), seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const c = (n: string, m = 0) => b.c(n, m);
    const TOP = 16;
    b.clearTrees(-9, -9, 9, 9, -2, 44);
    for (let x = -6; x <= 6; x++)
      for (let z = -6; z <= 6; z++) {
        b.clearAbove(x, 1, z, 10);
        if (Math.abs(x) <= 3 && Math.abs(z) <= 3) b.foundation(x, 0, z, c('pierre_taillee'));
      }
    for (let y = 0; y < TOP; y++)
      for (let x = -3; x <= 3; x++)
        for (let z = -3; z <= 3; z++) {
          const edge = Math.abs(x) === 3 || Math.abs(z) === 3;
          const corner = Math.abs(x) === 3 && Math.abs(z) === 3;
          if (y === 0 || (y === 8 && !(x === 0 && z === -2))) b.set(x, y, z, c('pierre_taillee'));
          else if (edge) b.set(x, y, z, c(corner ? 'pierre_taillee' : y % 5 === 0 ? 'briques_pierre_fissurees' : 'briques_pierre'));
          else b.set(x, y, z, 0);
        }
    for (const y of [4, 11]) {
      b.set(0, y, 3, c('vitre'));
      b.set(3, y, 0, c('vitre'));
      b.set(-3, y, 0, c('vitre'));
    }
    b.door(0, 1, 3, 'porte_bois', S);
    b.clearAbove(0, 1, 4, 3);
    for (let y = 1; y <= TOP; y++) b.ladder(0, y, -2, N);
    b.set(-2, 1, -2, c('etagere'));
    b.set(-2, 2, -2, c('etagere'));
    b.set(2, 1, -2, c('etagere'));
    b.set(2, 2, -2, c('etagere'));
    b.chest(2, 1, 1, W, 'observatoire');
    b.torch(-2, 3, 2, S);
    b.torch(-2, 11, 2, S);
    // plate-forme et coupole de verre
    for (let x = -6; x <= 6; x++)
      for (let z = -6; z <= 6; z++) {
        const d = Math.hypot(x, z);
        if (d > 6.2) continue;
        if (!(x === 0 && z === -2)) b.set(x, TOP, z, c(d > 5.4 ? 'briques_pierre' : 'pierre_taillee'));
        for (let y = 1; y <= 6; y++) {
          const r = Math.hypot(x, y * 1.05, z);
          if (r > 5.4 && r <= 6.3) b.set(x, TOP + y, z, c(x === 0 || z === 0 ? 'briques_pierre' : 'verre'));
          else if (r <= 5.4) b.set(x, TOP + y, z, 0);
        }
      }
    b.set(0, TOP + 1, 1, c('autel_astral'));
    b.set(2, TOP + 1, 2, c('lanterne_lumirite'));
    b.set(-2, TOP + 1, 2, c('lanterne_lumirite'));
    b.chest(-3, TOP + 1, 0, E, 'observatoire');
  },
};

// ------------------------------------------------------------------ crypte (très rare)
const crypt: StructureType = {
  id: 'crypte',
  name: 'Crypte oubliée',
  aliases: ['crypt', 'cripta'],
  dim: 'surface',
  region: 40,
  salt: 108,
  chance: 0.6,
  radius: 12,
  site(ctx, x, z, rng) {
    if (WATERY.has(biomeId(ctx, x, z))) return null;
    const [lo, hi, h] = flatness(ctx, x, z, 3);
    if (lo <= SEA_LEVEL + 1 || hi - lo > 4 || h < 50) return null;
    return { x, y: h, z, rot: rng.int(4), seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const c = (n: string, m = 0) => b.c(n, m);
    // mausolée
    b.clearTrees(-5, -5, 5, 6);
    for (let x = -3; x <= 3; x++)
      for (let z = -3; z <= 3; z++) {
        b.clearAbove(x, 1, z, 7);
        b.foundation(x, 0, z, c('briques_pierre'));
      }
    for (let y = 0; y <= 4; y++)
      for (let x = -2; x <= 2; x++)
        for (let z = -2; z <= 2; z++) {
          const edge = Math.abs(x) === 2 || Math.abs(z) === 2;
          if (y === 0 || y === 4 || edge) b.set(x, y, z, c(b.rnd(x, y, z) < 0.35 ? 'briques_pierre_moussues' : 'briques_pierre'));
          else b.set(x, y, z, 0);
        }
    for (let x = -3; x <= 3; x++) {
      b.stairs(x, 5, -3, 'briques_pierre_escalier', S);
      b.stairs(x, 5, 3, 'briques_pierre_escalier', N);
    }
    b.fill(-3, 5, -2, 3, 5, 2, c('briques_pierre_dalle'));
    // porte de fer actionnée par deux plaques de pression
    b.door(0, 1, 2, 'porte_fer', S);
    b.set(0, 0, 3, c('briques_pierre'));
    b.set(0, 1, 3, c('plaque_pression'));
    b.set(0, 1, 1, c('plaque_pression'));
    // puits vers la crypte
    const D = -16;
    for (let y = D + 1; y <= 0; y++) {
      b.set(0, y, 0, 0);
      b.ladder(0, y, 0, N);
      b.set(0, y, -1, c('briques_pierre'));
    }
    // grande salle
    b.box(-6, D - 5, -6, 6, D + 1, 6, c('briques_pierre'));
    for (let x = -6; x <= 6; x++)
      for (let z = -6; z <= 6; z++)
        for (let y = D - 5; y <= D + 1; y++) {
          const edge = Math.abs(x) === 6 || Math.abs(z) === 6 || y === D - 5 || y === D + 1;
          if (!edge) continue;
          const r = b.rnd(x, y, z, 3);
          if (r < 0.2) b.set(x, y, z, c('briques_pierre_fissurees'));
          else if (r < 0.3) b.set(x, y, z, c('pierre_runique'));
        }
    b.set(0, D + 1, 0, 0);
    for (let y = D - 4; y <= D; y++) {
      b.ladder(0, y, 0, N);
      b.set(0, y, -1, c('briques_pierre'));
    }
    // sarcophages et niches
    for (const x of [-3, 3])
      for (const z of [-3, 3]) {
        b.set(x, D - 4, z, c('pierre_taillee'));
        b.set(x, D - 4, z + (z < 0 ? 1 : -1), c('pierre_taillee'));
        b.set(x, D - 3, z, c('lanterne_lumirite'));
      }
    b.chest(0, D - 4, -5, S, 'crypte');
    b.chest(-5, D - 4, 0, E, 'crypte');
    b.chest(5, D - 4, 0, W, 'crypte');
    b.spawner(-4, D - 4, 4, 'rodeur');
    b.spawner(4, D - 4, -4, 'rodeur');
    for (let i = 0; i < 6; i++) {
      const x = -5 + Math.floor(b.rnd(i, D, 0, 17) * 11),
        z = -5 + Math.floor(b.rnd(0, D, i, 19) * 11);
      if (x !== 0 || z !== 0) b.place(x, D, z, c('toile'));
    }
  },
};

// ------------------------------------------------------------------ souterrains
/** Mine abandonnée : réseau de galeries grandi par règles (branches, virages). */
const mine: StructureType = {
  id: 'mine',
  name: 'Mine abandonnée',
  aliases: ['mina'],
  dim: 'surface',
  region: 12,
  salt: 109,
  chance: 0.4,
  radius: 72,
  site(ctx, x, z, rng) {
    const h = ctx.gen.surfaceHeight(x, z);
    if (h < 44) return null;
    const y = 14 + rng.int(Math.max(1, Math.min(26, h - 34)));
    return { x, y, z, rot: 0, seed: rng.nextU32() };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, 0);
    const rng = new Rng(p.seed);
    const air = 0;
    const planks = b.c('planches_chene'),
      fence = b.c('planches_chene_barriere');
    // salle de départ
    b.fill(-4, 0, -4, 4, 3, 4, air);
    b.fill(-4, -1, -4, 4, -1, 4, b.c('terre'));
    // croissance
    const segs: { x: number; y: number; z: number; d: number; len: number }[] = [];
    const queue: { x: number; y: number; z: number; d: number; depth: number }[] = [];
    for (let d = 0; d < 4; d++) if (rng.chance(0.8)) queue.push({ x: DX[d] * 5, y: 0, z: DZ[d] * 5, d, depth: 0 });
    while (queue.length && segs.length < 26) {
      const q = queue.shift()!;
      const len = 8 + rng.int(4) * 4;
      segs.push({ x: q.x, y: q.y, z: q.z, d: q.d, len });
      const ex = q.x + DX[q.d] * len,
        ez = q.z + DZ[q.d] * len;
      if (q.depth >= 5 || Math.hypot(ex, ez) > 60) continue;
      const r = rng.next();
      const ny = q.y + (rng.chance(0.2) ? (rng.chance(0.5) ? 1 : -1) * 3 : 0);
      if (r < 0.45) {
        // carrefour : on continue et on bifurque
        queue.push({ x: ex, y: q.y, z: ez, d: q.d, depth: q.depth + 1 });
        queue.push({ x: ex, y: ny, z: ez, d: (q.d + (rng.chance(0.5) ? 1 : 3)) % 4, depth: q.depth + 1 });
      } else if (r < 0.8) queue.push({ x: ex, y: ny, z: ez, d: (q.d + (rng.chance(0.5) ? 1 : 3)) % 4, depth: q.depth + 1 });
      else if (r < 0.92) queue.push({ x: ex, y: q.y, z: ez, d: q.d, depth: q.depth + 1 });
    }
    for (const s of segs) {
      const px = DX[(s.d + 1) % 4],
        pz = DZ[(s.d + 1) % 4];
      const ax = s.x,
        az = s.z,
        bx = s.x + DX[s.d] * s.len,
        bz = s.z + DZ[s.d] * s.len;
      if (!b.touches(Math.min(ax, bx) - 2, Math.min(az, bz) - 2, Math.max(ax, bx) + 2, Math.max(az, bz) + 2, 1)) continue;
      for (let k = 0; k <= s.len; k++) {
        const cx = s.x + DX[s.d] * k,
          cz = s.z + DZ[s.d] * k;
        for (let w = -1; w <= 1; w++) {
          const x = cx + px * w,
            z = cz + pz * w;
          if (!b.inside(x, z)) continue;
          for (let y = 0; y <= 2; y++) b.set(x, s.y + y, z, air);
          const below = b.get(x, s.y - 1, z) & 0xfff;
          if (below === 0 || b.t.liquid[below]) b.set(x, s.y - 1, z, planks);
          // décor
          const r = b.rnd(x, s.y, z, 23);
          if (r < 0.03) b.set(x, s.y + 2, z, b.c('toile'));
        }
        if (k % 4 === 0 && k > 0 && k < s.len) {
          // étai
          for (let y = 0; y <= 1; y++) {
            b.set(cx + px, s.y + y, cz + pz, fence);
            b.set(cx - px, s.y + y, cz - pz, fence);
          }
          for (let w = -1; w <= 1; w++) b.set(cx + px * w, s.y + 2, cz + pz * w, planks);
          if (b.rnd(cx, s.y, cz, 29) < 0.3) b.torch(cx, s.y + 1, cz, -1);
        } else if (k % 4 === 2) {
          const r = b.rnd(cx, s.y, cz, 31);
          if (r < 0.06) b.chest(cx + px, s.y, cz + pz, W, 'mine');
          else if (r < 0.075) b.spawner(cx, s.y, cz, 'tisseuse');
        }
      }
    }
  },
};

/** Donjon : salle souterraine avec foyer maudit et coffres. */
const dungeon: StructureType = {
  id: 'donjon',
  name: 'Donjon',
  aliases: ['cachot', 'dungeon', 'mazmorra'],
  dim: 'surface',
  region: 5,
  salt: 110,
  chance: 0.45,
  radius: 6,
  site(ctx, x, z, rng) {
    const h = ctx.gen.surfaceHeight(x, z);
    if (h < 30) return null;
    const y = 10 + rng.int(Math.max(1, h - 26));
    const creatures = ['rodeur', 'rodeur', 'tisseuse', 'vesse_explosive'];
    return { x, y, z, rot: rng.int(4), seed: rng.nextU32(), style: rng.pick(creatures), v: rng.int(2) };
  },
  build(b, p) {
    b.at(p.x, p.y, p.z, p.rot);
    const hz = p.v ? 4 : 3;
    for (let x = -4; x <= 4; x++)
      for (let z = -hz; z <= hz; z++)
        for (let y = 0; y <= 4; y++) {
          const edge = Math.abs(x) === 4 || Math.abs(z) === hz || y === 0 || y === 4;
          if (!edge) {
            b.set(x, y, z, 0);
            continue;
          }
          const cur = b.get(x, y, z) & 0xfff;
          if (y > 0 && y < 4 && cur === 0 && b.rnd(x, y, z, 5) < 0.5) continue; // ouvertures sur les grottes
          b.set(x, y, z, b.c(y === 0 ? (b.rnd(x, y, z) < 0.6 ? 'moellon_moussu' : 'moellon') : b.rnd(x, y, z) < 0.3 ? 'moellon_moussu' : 'moellon'));
        }
    b.spawner(0, 1, 0, p.style ?? 'rodeur');
    b.chest(-3, 1, hz - 1, N, 'donjon');
    if (p.v) b.chest(3, 1, -hz + 1, S, 'donjon');
    b.place(2, 3, 1, b.c('toile'));
  },
};

export const SURFACE_STRUCTURES: StructureType[] = [mine, dungeon, village, ruins, tower, temple, portalRuin, skyPortalRuin, sanctuary, observatory, crypt];
export type { StructCtx, Placement };
void W;
void E;
