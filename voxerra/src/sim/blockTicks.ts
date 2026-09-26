/**
 * Blocs vivants : mises à jour programmées (écoulement des liquides, chute du
 * sable, supports des plantes/torches, intégrité des portes et portails) et
 * ticks aléatoires (herbe, cultures, pousses d'arbres, cactus, baies).
 */
import type { World } from '../world/world';
import type { Sim } from './sim';
import { Shape, LIQ_WATER, LIQ_LAVA, makeCell } from '../registry/blocks';
import { placeTree } from '../worldgen/trees';
import type { BlockWriter } from '../worldgen/buffer';
import { hash3 } from '../engine/rng';
import { rollEntries } from './loot';

const posKey = (x: number, y: number, z: number): number => ((x + 524288) * 1048576 + (z + 524288)) * 256 + y;

class WorldWriter implements BlockWriter {
  constructor(private w: World) {}
  place(x: number, y: number, z: number, v: number, overLeaves = false): void {
    const t = this.w.content.blocks;
    const cur = this.w.getId(x, y, z);
    if (cur === 0 || t.shape[cur] === Shape.CROSS || (overLeaves && t.pass[cur] === 1 && t.shape[cur] === Shape.CUBE)) this.w.setBlock(x, y, z, v);
  }
  setW(x: number, y: number, z: number, v: number): void {
    this.w.setBlock(x, y, z, v);
  }
  getW(x: number, y: number, z: number): number {
    return this.w.isLoaded(x, z) ? this.w.getBlock(x, y, z) : -1;
  }
}

export class BlockTicker {
  private queue = new Map<number, { x: number; y: number; z: number; at: number }>();
  private ids: Record<string, number>;
  private writer: WorldWriter;
  randomTickSpeed = 3;

  constructor(
    private sim: Sim,
    private w: World,
  ) {
    const b = (id: string) => w.content.blocks.tryNum(id);
    this.ids = {
      eau: b('eau'),
      lave: b('lave'),
      terre: b('terre'),
      herbe: b('herbe'),
      terre_labouree: b('terre_labouree'),
      pierre: b('pierre'),
      moellon: b('moellon'),
      verre_volcanique: b('verre_volcanique'),
      pierre_runique: b('pierre_runique'),
      voile_abime: b('voile_abime'),
      pierre_aurore: b('pierre_aurore'),
      voile_celeste: b('voile_celeste'),
      sable: b('sable'),
      glace: b('glace'),
    };
    this.writer = new WorldWriter(w);
  }

  schedule(x: number, y: number, z: number, delay: number): void {
    const k = posKey(x, y, z);
    const at = this.sim.tickCount + delay;
    const cur = this.queue.get(k);
    if (!cur || cur.at > at) this.queue.set(k, { x, y, z, at });
  }

  private delayFor(id: number): number {
    const t = this.w.content.blocks;
    if (t.liquid[id] === LIQ_WATER) return 5;
    if (t.liquid[id] === LIQ_LAVA) return this.w.dim === 'abime' ? 10 : 30;
    return 1;
  }

  onBlockChange(x: number, y: number, z: number, _old: number, cell: number): void {
    this.schedule(x, y, z, this.delayFor(cell & 0xfff));
    for (const [dx, dy, dz] of [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ]) {
      const v = this.w.getBlock(x + dx, y + dy, z + dz);
      if (v === 0) continue;
      this.schedule(x + dx, y + dy, z + dz, this.delayFor(v & 0xfff));
    }
  }

  tick(): void {
    // Mises à jour programmées
    const now = this.sim.tickCount;
    let budget = 3000;
    const due: { x: number; y: number; z: number }[] = [];
    for (const [k, e] of this.queue) {
      if (e.at > now) continue;
      due.push(e);
      this.queue.delete(k);
      if (--budget <= 0) break;
    }
    for (const e of due) if (this.w.isLoaded(e.x, e.z)) this.update(e.x, e.y, e.z);
    // Ticks aléatoires autour des joueurs
    const rng = this.sim.rng;
    for (const p of this.sim.players) {
      if (p.dim !== this.w.dim) continue;
      const pcx = Math.floor(p.x / 16),
        pcz = Math.floor(p.z / 16);
      for (let dz = -6; dz <= 6; dz++)
        for (let dx = -6; dx <= 6; dx++) {
          const c = this.w.getChunk(pcx + dx, pcz + dz);
          if (!c) continue;
          for (let s = 0; s < 16; s++) {
            const sec = c.sections[s];
            if (!sec.blocks) continue;
            for (let n = 0; n < this.randomTickSpeed; n++) {
              const i = rng.int(4096);
              const v = sec.blocks[i];
              if (v === 0) continue;
              const def = this.w.content.blocks.get(v & 0xfff).def;
              if (!def.tick) continue;
              const x = c.cx * 16 + (i & 15),
                y = s * 16 + (i >> 8),
                z = c.cz * 16 + ((i >> 4) & 15);
              this.randomTick(x, y, z, v, def.tick);
            }
          }
        }
    }
  }

  private lightAt(x: number, y: number, z: number): number {
    const l = this.w.getLight(x, y, z);
    return Math.max(l & 15, (l >> 4) - this.sim.env.skyDarken);
  }

  private randomTick(x: number, y: number, z: number, v: number, tick: { type: string; [k: string]: unknown }): void {
    const w = this.w;
    const t = w.content.blocks;
    const rng = this.sim.rng;
    const id = v & 0xfff;
    const meta = v >>> 12;
    switch (tick.type) {
      case 'spread': {
        const above = w.getId(x, y + 1, z);
        if (t.opaque[above] || t.liquid[above]) {
          w.setBlock(x, y, z, this.ids.terre);
          return;
        }
        if (this.lightAt(x, y + 1, z) < 9) return;
        for (let i = 0; i < 2; i++) {
          const nx = x + rng.range(-1, 1),
            ny = y + rng.range(-2, 1),
            nz = z + rng.range(-1, 1);
          if (w.getId(nx, ny, nz) !== this.ids.terre) continue;
          const na = w.getId(nx, ny + 1, nz);
          if (t.opaque[na] || t.liquid[na]) continue;
          if (this.lightAt(nx, ny + 1, nz) >= 4) w.setBlock(nx, ny, nz, this.ids.herbe);
        }
        break;
      }
      case 'crop': {
        const max = (t.stages[id] || 8) - 1;
        if (meta >= max) return;
        if (this.lightAt(x, y, z) < 9) return;
        if (w.getId(x, y - 1, z) !== this.ids.terre_labouree) return;
        if (rng.chance(0.35)) w.setBlock(x, y, z, makeCell(id, meta + 1));
        break;
      }
      case 'ripen':
        if (meta === 0 && rng.chance(0.25)) w.setBlock(x, y, z, makeCell(id, 1));
        break;
      case 'sapling': {
        if (this.lightAt(x, y, z) < 9 || !rng.chance(0.12)) return;
        for (let k = 1; k <= 5; k++) if (t.opaque[w.getId(x, y + k, z)]) return;
        w.setBlock(x, y, z, 0);
        placeTree(String(tick.tree ?? 'chene'), this.writer, { num: (s: string) => t.tryNum(s) }, hash3(this.sim.seed, x, y, z) ^ this.sim.tickCount, x, y, z);
        this.sim.emit({ t: 'particles', kind: 'coeur', x: x + 0.5, y: y + 1, z: z + 0.5, n: 4 });
        break;
      }
      case 'grow_up': {
        if (w.getId(x, y + 1, z) !== 0 || !rng.chance(0.15)) return;
        let h = 1;
        while (w.getId(x, y - h, z) === id) h++;
        if (h < ((tick.max as number) ?? 3)) w.setBlock(x, y + 1, z, id);
        break;
      }
    }
  }

  /** Mise à jour d'un bloc (après modification d'un voisin). */
  private update(x: number, y: number, z: number): void {
    const w = this.w;
    const t = w.content.blocks;
    const v = w.getBlock(x, y, z);
    const id = v & 0xfff;
    if (id === 0) return;
    if (t.liquid[id]) {
      this.flow(x, y, z, v);
      return;
    }
    const info = t.get(id);
    // Blocs soumis à la gravité
    if (info.def.gravity) {
      const below = w.getId(x, y - 1, z);
      if (y > 0 && (below === 0 || t.liquid[below] || (t.replaceable[below] && !t.solid[below]))) {
        let ny = y - 1;
        while (ny > 0) {
          const b = w.getId(x, ny - 1, z);
          if (!(b === 0 || t.liquid[b] || (t.replaceable[b] && !t.solid[b]))) break;
          ny--;
        }
        w.setBlock(x, y, z, 0);
        w.setBlock(x, ny, z, v);
      }
      return;
    }
    // Supports
    if (!this.supported(x, y, z, v)) {
      this.popBlock(x, y, z, v);
      return;
    }
    // Portail : intégrité du cadre
    if (id === this.ids.voile_abime || id === this.ids.voile_celeste) {
      const axisX = (v >>> 12) === 0;
      const frame = id === this.ids.voile_abime ? this.ids.pierre_runique : this.ids.pierre_aurore;
      const ok = (nx: number, ny: number, nz: number) => {
        const n = w.getId(nx, ny, nz);
        return n === id || n === frame;
      };
      if (!ok(x, y + 1, z) || !ok(x, y - 1, z) || (axisX ? !ok(x + 1, y, z) || !ok(x - 1, y, z) : !ok(x, y, z + 1) || !ok(x, y, z - 1))) w.setBlock(x, y, z, 0);
    }
  }

  /** Le bloc tient-il encore (plante sur sol, torche contre un mur, porte complète…) ? */
  supported(x: number, y: number, z: number, v: number): boolean {
    const w = this.w;
    const t = w.content.blocks;
    const id = v & 0xfff;
    const meta = v >>> 12;
    const sh = t.shape[id];
    const solidAt = (xx: number, yy: number, zz: number) => t.solid[w.getId(xx, yy, zz)] === 1;
    const def = t.get(id).def;
    if (sh === Shape.CROSS || sh === Shape.CROP) {
      const below = w.getId(x, y - 1, z);
      if (sh === Shape.CROP) return below === this.ids.terre_labouree;
      if (def.placeOn) return def.placeOn.some((tag) => t.hasTag(below, tag)) || below === id;
      if (id === w.content.blocks.tryNum('roseau')) return below === id || t.hasTag(below, 'soil') || t.hasTag(below, 'grass') || t.hasTag(below, 'sand');
      if (t.get(id).tags.has('mushroom')) return t.solid[below] === 1;
      if (t.liquid[id] === 0 && def.tags?.includes('portal')) return true;
      if (t.get(id).tags.has('plant')) return t.solid[below] === 1;
      return true;
    }
    if (sh === Shape.TORCH) {
      const m = meta & 7;
      if (m === 0) return solidAt(x, y - 1, z);
      const d = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]][m];
      return solidAt(x + d[0], y, z + d[1]);
    }
    if (sh === Shape.LADDER) {
      if (def.climbable && id === t.tryNum('lianes')) return true;
      const d = [[1, 0], [-1, 0], [0, 1], [0, -1]][meta & 3];
      return solidAt(x + d[0], y, z + d[1]);
    }
    if (sh === Shape.DOOR) {
      const upper = (meta & 8) !== 0;
      const other = w.getId(x, upper ? y - 1 : y + 1, z);
      if (other !== id) return false;
      if (!upper) return solidAt(x, y - 1, z);
      return true;
    }
    if (sh === Shape.CARPET || sh === Shape.PLATE || sh === Shape.LEVER) return solidAt(x, y - 1, z);
    if (sh === Shape.CACTUS) {
      const below = w.getId(x, y - 1, z);
      if (below !== id && !t.hasTag(below, 'sand')) return false;
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ])
        if (solidAt(x + dx, y, z + dz)) return false;
    }
    return true;
  }

  /** Casse un bloc non soutenu en lâchant ses objets. */
  private popBlock(x: number, y: number, z: number, v: number): void {
    const t = this.w.content.blocks;
    const info = t.get(v & 0xfff);
    const meta = v >>> 12;
    this.w.setBlock(x, y, z, 0);
    const drops = info.drops.filter((d) => (d.minStage === undefined || meta >= d.minStage) && (d.maxStage === undefined || meta <= d.maxStage) && !d.tool);
    for (const s of rollEntries(drops, this.sim.rng)) this.sim.spawnItem(this.w.dim, x + 0.5, y + 0.3, z + 0.5, s);
    this.sim.emit({ t: 'blockBreakFx', x, y, z, cell: v });
  }

  // ------------------------------------------------------------------ liquides
  private maxLevel(lq: number): number {
    if (lq === LIQ_LAVA) return this.w.dim === 'abime' ? 6 : 3;
    return 7;
  }

  private flow(x: number, y: number, z: number, v: number): void {
    const w = this.w;
    const t = w.content.blocks;
    const id = v & 0xfff;
    const lq = t.liquid[id];
    let meta = v >>> 12;
    const max = this.maxLevel(lq);
    const levelOf = (cell: number): number => {
      if ((cell & 0xfff) !== id) return -1;
      const m = cell >>> 12;
      return m === 0 || m === 8 ? 0 : m;
    };
    if (meta !== 0) {
      let nm: number;
      if ((w.getBlock(x, y + 1, z) & 0xfff) === id) nm = 8;
      else {
        let min = 99,
          sources = 0;
        for (const [dx, dz] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          const c = w.getBlock(x + dx, y, z + dz);
          const l = levelOf(c);
          if (l < 0) continue;
          if ((c >>> 12) === 0) sources++;
          // un liquide qui tombe ne nourrit pas latéralement
          if ((c >>> 12) === 8) continue;
          min = Math.min(min, l);
        }
        const below = w.getBlock(x, y - 1, z);
        if (lq === LIQ_WATER && sources >= 2 && (t.solid[below & 0xfff] || ((below & 0xfff) === id && below >>> 12 === 0))) nm = 0;
        else nm = min + 1;
      }
      if (nm !== 8 && nm > max) {
        w.setBlock(x, y, z, 0);
        return;
      }
      if (nm !== meta) {
        w.setBlock(x, y, z, makeCell(id, nm));
        meta = nm;
      }
    }
    // écoulement vers le bas
    const bv = w.getBlock(x, y - 1, z);
    const bid = bv & 0xfff;
    if (y > 0 && this.canFlowInto(bid, id)) {
      if (this.mixLiquids(x, y - 1, z, lq, bv)) return;
      this.displace(x, y - 1, z, bv);
      w.setBlock(x, y - 1, z, makeCell(id, 8));
      return;
    }
    if (bid === id) return; // alimente le liquide du dessous
    // étalement latéral
    const lvl = meta === 8 || meta === 0 ? 0 : meta;
    const next = lvl + 1;
    if (next > max) return;
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nv = w.getBlock(x + dx, y, z + dz);
      const nid = nv & 0xfff;
      if (nid === id) {
        const nl = nv >>> 12;
        if (nl !== 0 && nl !== 8 && nl > next) w.setBlock(x + dx, y, z + dz, makeCell(id, next));
        continue;
      }
      if (!this.canFlowInto(nid, id)) continue;
      if (this.mixLiquids(x + dx, y, z + dz, lq, nv)) continue;
      this.displace(x + dx, y, z + dz, nv);
      w.setBlock(x + dx, y, z + dz, makeCell(id, next));
    }
  }

  private canFlowInto(nid: number, id: number): boolean {
    const t = this.w.content.blocks;
    if (nid === 0) return true;
    if (nid === id) return false;
    if (t.liquid[nid]) return true;
    return t.replaceable[nid] === 1 && !t.solid[nid];
  }

  /** Contact eau/lave : pierre ou verre volcanique. */
  private mixLiquids(x: number, y: number, z: number, lq: number, target: number): boolean {
    const t = this.w.content.blocks;
    const tl = t.liquid[target & 0xfff];
    if (!tl || tl === lq) return false;
    const targetSource = target >>> 12 === 0;
    let result: number;
    if (lq === LIQ_WATER) result = targetSource ? this.ids.verre_volcanique : this.ids.moellon;
    else result = this.ids.pierre;
    this.w.setBlock(x, y, z, result);
    this.sim.emit({ t: 'sound', id: 'grésillement', x, y, z, vol: 0.6 });
    this.sim.emit({ t: 'particles', kind: 'fumee', x: x + 0.5, y: y + 1, z: z + 0.5, n: 8 });
    return true;
  }

  /** Un liquide emporte une plante : on lâche ses objets. */
  private displace(x: number, y: number, z: number, v: number): void {
    const id = v & 0xfff;
    if (id === 0 || this.w.content.blocks.liquid[id]) return;
    const info = this.w.content.blocks.get(id);
    for (const s of rollEntries(info.drops.filter((d) => !d.tool && d.minStage === undefined), this.sim.rng)) this.sim.spawnItem(this.w.dim, x + 0.5, y + 0.3, z + 0.5, s);
  }
}
