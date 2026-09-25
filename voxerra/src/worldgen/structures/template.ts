/**
 * Structures « gabarit » décrites dans les données (packs de contenu / mods) :
 * couches [y][z] de chaînes sur x, palette de caractères, rareté par région.
 *
 * Palette : "bloc" ou "bloc:meta" ; "coffre" reçoit la table `loot` ;
 * "foyer_maudit@creature" pose un foyer ; "@creature" place une créature ;
 * "." = air forcé ; " " = inchangé.
 */
import type { StructureTemplateDef } from '../../registry/types';
import type { StructureType } from './types';
import { biomeId, flatness } from './types';
import { S } from './builder';
import { SEA_LEVEL } from '../../world/constants';

export function templateStructure(def: StructureTemplateDef, salt: number): StructureType {
  const height = def.layers.length;
  const depth = Math.max(1, ...def.layers.map((l) => l.length));
  const width = Math.max(1, ...def.layers.flatMap((l) => l.map((r) => r.length)));
  const hx = Math.floor(width / 2),
    hz = Math.floor(depth / 2);
  return {
    id: def.id,
    name: def.id,
    dim: def.dimension,
    region: def.spacing ?? 16,
    salt,
    chance: 1 / Math.max(1, def.rarity),
    radius: Math.max(hx, hz) + 1,
    site(ctx, x, z, rng) {
      if (def.biomes && !def.biomes.includes(biomeId(ctx, x, z))) return null;
      const [lo, hi, h] = flatness(ctx, x, z, Math.max(hx, hz));
      if (def.dimension === 'surface' && (lo <= SEA_LEVEL || hi - lo > 6)) return null;
      if (h <= 0) return null;
      return { x, y: h + (def.offsetY ?? 0), z, rot: rng.int(4), seed: rng.nextU32() };
    },
    build(b, p) {
      b.at(p.x, p.y, p.z, p.rot);
      if (!b.touches(-hx, -hz, width - hx, depth - hz, 1)) return;
      for (let y = 0; y < height; y++) {
        const layer = def.layers[y];
        for (let z = 0; z < layer.length; z++) {
          const row = layer[z];
          for (let x = 0; x < row.length; x++) {
            const ch = row[x];
            if (ch === ' ') continue;
            const lx = x - hx,
              lz = z - hz;
            if (ch === '.') {
              b.set(lx, y, lz, 0);
              continue;
            }
            const entry = def.palette[ch];
            if (!entry) continue;
            if (entry.startsWith('@')) {
              b.entity(entry.slice(1), lx, y, lz);
              continue;
            }
            const [blockPart, creature] = entry.split('@');
            const [name, meta] = blockPart.split(':');
            if (name === 'coffre' && def.loot) b.chest(lx, y, lz, S, def.loot);
            else if (name === 'foyer_maudit' && creature) b.spawner(lx, y, lz, creature);
            else b.set(lx, y, lz, b.c(name, meta ? Number(meta) : 0));
            if (y === 0) b.foundation(lx, 0, lz, b.c(name, meta ? Number(meta) : 0), 8);
          }
        }
      }
    },
  };
}
