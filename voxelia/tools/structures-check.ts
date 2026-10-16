/**
 * Vérification des structures de la Surface : comptages, marqueurs, temps de génération,
 * indépendance vis-à-vis de l'ordre des tronçons, écritures confinées aux boîtes déclarées
 * et cohérence de locateStructure.
 *
 * Usage :
 *   npx esbuild tools/structures-check.ts --bundle --platform=node --format=esm --outfile=/tmp/structures-check.mjs
 *   node /tmp/structures-check.mjs [taille en tronçons = 32] [graines = 777,12345]
 */
import { OverworldGenerator } from '../src/world/gen/overworld';
import { listStructures, locateStructure, structurePlansIn, STRUCTURE_KINDS } from '../src/world/gen/structures';
import { B } from '../src/world/blocks';
import { SEA_LEVEL } from '../src/world/constants';
import type { GenMarker } from '../src/world/gen/writer';

const N = Number(process.argv[2] ?? 32);
const SEEDS = (process.argv[3] ?? '777,12345').split(',').map(Number);
const opts = (seed: number, structures = true) => ({ seed, template: 'default' as const, caves: true, structures, fantasyBiomes: true, drop3: true, dimensions: true });
let failures = 0;
const fail = (m: string): void => {
  failures++;
  if (failures <= 30) console.log('  ÉCHEC :', m);
};

for (const seed of SEEDS) {
  // 1. Comptages, marqueurs et temps (avec / sans structures)
  const on = new OverworldGenerator(opts(seed));
  const off = new OverworldGenerator(opts(seed, false));
  on.generate(4000, 4000);
  off.generate(4000, 4000);
  let tOn = 0;
  let tOff = 0;
  const seen = new Set<string>();
  const mk: Record<string, number> = {};
  for (let cz = -N / 2; cz < N / 2; cz++)
    for (let cx = -N / 2; cx < N / 2; cx++) {
      let t = performance.now();
      const col = on.generate(cx, cz);
      tOn += performance.now() - t;
      t = performance.now();
      off.generate(cx, cz);
      tOff += performance.now() - t;
      for (const m of col.markers) {
        if (m.kind === 'mob' && !m.data) continue; // troupeaux du générateur de base
        const key = `${m.kind}:${Math.floor(m.x)},${Math.floor(m.y)},${Math.floor(m.z)}`;
        if (seen.has(key)) fail('marqueur dupliqué ' + key);
        seen.add(key);
        const lx = Math.floor(m.x) - cx * 16;
        const lz = Math.floor(m.z) - cz * 16;
        if (m.kind === 'chest' || m.kind === 'spawner') {
          const id = col.blocks[(Math.floor(m.y) << 8) | (lz << 4) | lx] & 0x3ff;
          if (m.kind === 'spawner' ? id !== B.spawner : id !== B.chest && id !== B.barrel) fail('marqueur sans bloc ' + key);
        }
        const k = m.kind === 'villager' ? 'villager:' + String(m.data?.profession) : m.kind + ':' + m.id;
        mk[k] = (mk[k] ?? 0) + 1;
      }
    }
  const counts: Record<string, number> = {};
  for (const s of listStructures(on, -N * 8, -N * 8, N * 8 - 1, N * 8 - 1)) counts[s.kind] = (counts[s.kind] ?? 0) + 1;
  console.log(`\n=== graine ${seed}, ${N}×${N} tronçons`);
  console.log('structures :', JSON.stringify(counts));
  console.log('marqueurs  :', JSON.stringify(mk));
  console.log(`temps      : ${(tOn / (N * N)).toFixed(2)} ms/tronçon avec structures, ${(tOff / (N * N)).toFixed(2)} sans`);

  // 2. Ordre de génération indifférent (une structure de chaque type)
  const probe = new OverworldGenerator(opts(seed));
  const firsts = new Map<string, { x: number; z: number }>();
  for (const s of listStructures(probe, -5000, -5000, 5000, 5000)) if (!firsts.has(s.kind)) firsts.set(s.kind, s);
  for (const [kind, s] of firsts) {
    const n = kind === 'village' ? 10 : 6;
    const cx0 = Math.floor(s.x / 16) - (n >> 1);
    const cz0 = Math.floor(s.z / 16) - (n >> 1);
    const order: Array<[number, number]> = [];
    for (let z = 0; z < n; z++) for (let x = 0; x < n; x++) order.push([cx0 + x, cz0 + z]);
    const a = new OverworldGenerator(opts(seed));
    const b = new OverworldGenerator(opts(seed));
    const ra = new Map(order.map(([x, z]) => [x + ',' + z, a.generate(x, z)]));
    let diff = 0;
    for (const [x, z] of [...order].reverse()) {
      const cb = b.generate(x, z);
      const ca = ra.get(x + ',' + z)!;
      for (let i = 0; i < ca.blocks.length; i++) if (ca.blocks[i] !== cb.blocks[i]) diff++;
      if (JSON.stringify(ca.markers) !== JSON.stringify(cb.markers)) diff++;
    }
    if (diff) fail(`${kind} : ${diff} différences selon l'ordre de génération`);
  }
  console.log(`ordre      : ${firsts.size} types testés`);

  // 3. Chaque écriture d'une pièce reste dans la boîte qu'elle déclare
  let pieces = 0;
  let outside = 0;
  for (const plan of structurePlansIn(probe, -3000, -3000, 3000, 3000)) {
    for (const m of plan.markers) if (m.x < plan.box.x0 || m.x > plan.box.x1 + 1 || m.z < plan.box.z0 || m.z > plan.box.z1 + 1) outside++;
    for (const piece of plan.pieces) {
      pieces++;
      const b = piece.box;
      const check = (x: number, z: number) => {
        if (x < b.x0 || x > b.x1 || z < b.z0 || z > b.z1) outside++;
      };
      const w = {
        x0: 0,
        z0: 0,
        cx: 0,
        cz: 0,
        blocks: new Uint16Array(0),
        markers: [] as GenMarker[],
        inside: (_x: number, y: number) => y >= 0 && y < 256,
        get: (x: number, y: number, z: number) => (y <= probe.groundAt(x, z) ? B.stone : y <= SEA_LEVEL ? B.water : 0),
        set: (x: number, _y: number, z: number) => check(x, z),
        setSoft: (x: number, _y: number, z: number) => check(x, z),
        replace: (x: number, _y: number, z: number) => check(x, z),
        fill: (x0: number, _y0: number, z0: number, x1: number, _y1: number, z1: number) => {
          check(x0, z0);
          check(x1, z1);
        },
        touches: () => true,
        mark: (m: GenMarker) => check(Math.floor(m.x), Math.floor(m.z)),
      };
      // Les pièces qui itèrent « le tronçon courant » sont balayées par fenêtres de 16.
      for (let z = b.z0; z <= b.z1; z += 16)
        for (let x = b.x0; x <= b.x1; x += 16) {
          w.x0 = x;
          w.z0 = z;
          piece.build(w as never);
        }
    }
  }
  if (outside) fail(`${outside} écritures hors des boîtes déclarées`);
  console.log(`boîtes     : ${pieces} pièces auditées`);

  // 4. locateStructure renvoie bien la structure la plus proche
  for (const k of STRUCTURE_KINDS) {
    const r = locateStructure(probe, k.key, 0, 0, 3000);
    const near = listStructures(probe, -3000, -3000, 3000, 3000, [k.key])
      .filter((s) => Math.hypot(s.x, s.z) <= 3000)
      .sort((p, q) => Math.hypot(p.x, p.z) - Math.hypot(q.x, q.z))[0];
    if ((r?.x ?? null) !== (near?.x ?? null) || (r?.z ?? null) !== (near?.z ?? null)) fail(`locate ${k.key} : ${JSON.stringify(r)} ≠ ${JSON.stringify(near)}`);
  }
  console.log('locate     : vérifié pour', STRUCTURE_KINDS.length, 'types');
}
console.log(failures ? `\n${failures} échec(s)` : '\nStructures cohérentes.');
if (failures) process.exit(1);
