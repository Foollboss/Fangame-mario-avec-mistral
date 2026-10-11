import { OverworldGenerator } from '../src/world/gen/overworld';
import { TerrainMesher } from '../src/world/mesher';
import { allBlockTextures } from '../src/world/blocks';
const opts = { seed: 777, template: 'default' as const, caves: true, structures: true, fantasyBiomes: true, drop3: true, dimensions: true };
const g = new OverworldGenerator(opts);
const t0 = performance.now();
const cols = new Map<string, any>();
for (let z = -2; z <= 2; z++) for (let x = -2; x <= 2; x++) cols.set(x + ',' + z, g.generate(x, z));
const t1 = performance.now();
console.log('génération : ', ((t1 - t0) / 25).toFixed(1), 'ms/tronçon');
const m = new TerrainMesher();
const tex: Record<string, any> = {}; allBlockTextures().forEach((n, i) => (tex[n] = { layer: i + 1, frames: 1 }));
m.setTextures(tex);
let quads = 0;
const t2 = performance.now();
for (let z = -1; z <= 1; z++) for (let x = -1; x <= 1; x++) {
  const c: any[] = [], b: any[] = [];
  for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) { const k = cols.get((x + dx) + ',' + (z + dz)); c.push(k.blocks); b.push(k.biomes); }
  const r = m.mesh({ cols: c, biomes: b, sections: 0xffff, hasSky: true, fancyLeaves: true });
  for (const s of r) quads += (s.solid ? s.solid.length / 12 : 0) + (s.trans ? s.trans.length / 12 : 0);
}
const t3 = performance.now();
console.log('maillage : ', ((t3 - t2) / 9).toFixed(1), 'ms/tronçon, quads/tronçon', Math.round(quads / 9));
