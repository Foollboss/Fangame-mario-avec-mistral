/**
 * Simulation des blocs : écoulement de l'eau et de la lave, blocs soumis à la gravité,
 * blocs qui ont besoin d'un support, mises à jour aléatoires (croissance des plantes,
 * propagation de l'herbe, chute des feuilles, feu, fonte de la glace…).
 */
import { B, BLOCKS, IS_LIQUID, OPAQUE, REPLACEABLE, WATERLOGGED, type BlockDef } from './blocks';
import { blockId, blockMeta, WORLD_HEIGHT } from './constants';
import { growTree } from './gen/trees';
import { supportsPlant } from '../game/drops';
import type { World } from './World';
import type { ChunkWriter } from './gen/writer';
import type { TreeKind } from './biomes';

export interface TickHost {
  world: World;
  dimension: number;
  rules: { randomTickSpeed: number; fireSpread: boolean; mobGriefing: boolean };
  /** Joueur (centre de la simulation). */
  center: { x: number; y: number; z: number };
  spawnFalling(x: number, y: number, z: number, raw: number): void;
  dropBlock(x: number, y: number, z: number, raw: number): void;
  particlesAt(x: number, y: number, z: number, blockId: number): void;
  sound(name: string, x: number, y: number, z: number): void;
  isRaining(): boolean;
  power: { onBlockChanged(x: number, y: number, z: number): void; scheduled(x: number, y: number, z: number): void };
}

const LIQUID_WATER = 9;
const LIQUID_LAVA = 10;

const enum TickKind {
  Fluid = 1,
  Power = 2,
  Gravity = 3,
}

export class BlockTicks {
  private scheduled = new Map<string, { x: number; y: number; z: number; due: number; kind: TickKind }>();
  tickCount = 0;
  private host!: TickHost;

  bind(host: TickHost): void {
    this.host = host;
  }

  schedule(x: number, y: number, z: number, delay: number, kind: TickKind): void {
    const k = `${x},${y},${z},${kind}`;
    const cur = this.scheduled.get(k);
    const due = this.tickCount + delay;
    if (cur && cur.due <= due) return;
    this.scheduled.set(k, { x, y, z, due, kind });
  }

  schedulePower(x: number, y: number, z: number, delay: number): void {
    this.schedule(x, y, z, delay, TickKind.Power);
  }

  clear(): void {
    this.scheduled.clear();
  }

  /** Un bloc a changé : réveille les voisins concernés. */
  onChange(x: number, y: number, z: number, prev: number, next: number): void {
    const w = this.host.world;
    for (const [dx, dy, dz] of [
      [0, 0, 0],
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ]) {
      const nx = x + dx;
      const ny = y + dy;
      const nz = z + dz;
      const id = w.id(nx, ny, nz);
      if (IS_LIQUID[id] || WATERLOGGED[id]) this.schedule(nx, ny, nz, this.fluidDelay(id), TickKind.Fluid);
      const d = BLOCKS[id];
      if (!d) continue;
      if (d.gravity) this.schedule(nx, ny, nz, 2, TickKind.Gravity);
      if (dx || dy || dz) this.checkSupport(nx, ny, nz, d);
    }
    if (blockId(prev) !== blockId(next) || blockMeta(prev) !== blockMeta(next)) this.host.power.onBlockChanged(x, y, z);
  }

  private fluidDelay(id: number): number {
    if (id === LIQUID_LAVA) return this.host.dimension === 1 ? 10 : 30;
    return 5;
  }

  tick(): void {
    this.tickCount++;
    // Tics programmés
    const due: Array<{ x: number; y: number; z: number; kind: TickKind }> = [];
    for (const [k, t] of this.scheduled) {
      if (t.due <= this.tickCount) {
        due.push(t);
        this.scheduled.delete(k);
        if (due.length > 400) break;
      }
    }
    for (const t of due) {
      if (!this.host.world.isLoaded(t.x, t.z)) continue;
      if (t.kind === TickKind.Fluid) this.fluidTick(t.x, t.y, t.z);
      else if (t.kind === TickKind.Gravity) this.gravityTick(t.x, t.y, t.z);
      else if (t.kind === TickKind.Power) this.host.power.scheduled(t.x, t.y, t.z);
    }
    this.randomTicks();
  }

  // ------------------------------------------------------------------ liquides
  private fluidTick(x: number, y: number, z: number): void {
    const w = this.host.world;
    const raw = w.raw(x, y, z);
    const id = blockId(raw);
    const isWaterlogged = WATERLOGGED[id] && id !== LIQUID_WATER;
    const liquid = isWaterlogged ? LIQUID_WATER : id;
    if (liquid !== LIQUID_WATER && liquid !== LIQUID_LAVA) return;
    const lava = liquid === LIQUID_LAVA;
    const step = lava && this.host.dimension !== 1 ? 2 : 1;
    let level = isWaterlogged ? 0 : blockMeta(raw) & 7;
    const falling = !isWaterlogged && (blockMeta(raw) & 8) !== 0;
    const same = (rid: number) => rid === liquid || (liquid === LIQUID_WATER && WATERLOGGED[rid] === 1);
    const levelOf = (xx: number, yy: number, zz: number): number => {
      const r = w.raw(xx, yy, zz);
      const i = blockId(r);
      if (!same(i)) return -1;
      if (i !== liquid) return 0;
      return blockMeta(r) & 8 ? 1 : blockMeta(r) & 7;
    };

    // 1. Niveau d'un liquide qui coule
    if (level !== 0 || falling) {
      let best = 99;
      let sources = 0;
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const l = levelOf(x + dx, y, z + dz);
        if (l < 0) continue;
        if (l === 0) sources++;
        best = Math.min(best, l + step);
      }
      const aboveSame = same(w.id(x, y + 1, z));
      let newLevel = aboveSame ? 1 : best;
      let newFalling = aboveSame;
      // Source infinie (eau uniquement)
      if (!lava && sources >= 2 && (BLOCKS[w.id(x, y - 1, z)]?.solid || levelOf(x, y - 1, z) === 0)) {
        newLevel = 0;
        newFalling = false;
      }
      if (newLevel > 7) {
        w.set(x, y, z, 0, 0, 'tick');
        return;
      }
      if (newLevel !== level || newFalling !== falling) {
        level = newLevel;
        w.set(x, y, z, liquid, newLevel | (newFalling ? 8 : 0), 'tick');
      }
    }

    // 2. Écoulement vers le bas
    const below = w.raw(x, y - 1, z);
    const bid = blockId(below);
    if (y > 0 && this.canFlowInto(bid, liquid)) {
      if (this.react(x, y - 1, z, liquid, bid)) return;
      w.set(x, y - 1, z, liquid, 1 | 8, 'tick');
      return;
    }
    if (y > 0 && same(bid) && bid === liquid && (blockMeta(below) & 7) !== 0 && !(blockMeta(below) & 8)) {
      w.set(x, y - 1, z, liquid, 1 | 8, 'tick');
    }
    // 3. Écoulement latéral
    const next = level + step;
    if (next > 7) return;
    // Directions vers la descente la plus proche (jusqu'à 4 blocs) en priorité
    const dirs = this.flowDirections(x, y, z, liquid);
    for (const [dx, dz] of dirs) {
      const nx = x + dx;
      const nz = z + dz;
      const nid = w.id(nx, y, nz);
      if (!this.canFlowInto(nid, liquid)) {
        if (same(nid) && nid === liquid) {
          const nl = blockMeta(w.raw(nx, y, nz)) & 7;
          if (nl > next) w.set(nx, y, nz, liquid, next, 'tick');
        }
        continue;
      }
      if (this.react(nx, y, nz, liquid, nid)) continue;
      w.set(nx, y, nz, liquid, next, 'tick');
    }
  }

  private flowDirections(x: number, y: number, z: number, liquid: number): number[][] {
    const w = this.host.world;
    const all = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const dist = all.map(([dx, dz]) => {
      for (let i = 1; i <= 4; i++) {
        const id = w.id(x + dx * i, y, z + dz * i);
        if (!this.canFlowInto(id, liquid) && id !== liquid) return 99;
        if (this.canFlowInto(w.id(x + dx * i, y - 1, z + dz * i), liquid)) return i;
      }
      return 50;
    });
    const min = Math.min(...dist);
    if (min >= 50) return all;
    return all.filter((_, i) => dist[i] === min);
  }

  private canFlowInto(id: number, liquid: number): boolean {
    if (id === 0) return true;
    if (id === liquid) return false;
    const d = BLOCKS[id];
    if (!d) return false;
    if (IS_LIQUID[id]) return true; // pour les réactions eau/lave
    if (WATERLOGGED[id]) return false;
    return d.replaceable || (!d.solid && d.shape !== 'portal' && d.hardness === 0 && d.shape !== 'none');
  }

  /** Eau + lave : obsidienne ou pierre. Renvoie true si une réaction a eu lieu. */
  private react(x: number, y: number, z: number, liquid: number, targetId: number): boolean {
    const w = this.host.world;
    if (liquid === LIQUID_WATER && targetId === LIQUID_LAVA) {
      const src = (w.meta(x, y, z) & 7) === 0;
      w.set(x, y, z, src ? B.obsidian : B.cobblestone, 0, 'tick');
      this.host.sound('fire', x, y, z);
      return true;
    }
    if (liquid === LIQUID_LAVA && (targetId === LIQUID_WATER || WATERLOGGED[targetId])) {
      w.set(x, y, z, B.cobblestone, 0, 'tick');
      this.host.sound('fire', x, y, z);
      return true;
    }
    if (targetId !== 0 && !IS_LIQUID[targetId]) {
      // Détruit plantes / torches emportées par le courant
      this.host.dropBlock(x, y, z, w.raw(x, y, z));
    }
    return false;
  }

  // ------------------------------------------------------------------ gravité
  private gravityTick(x: number, y: number, z: number): void {
    const w = this.host.world;
    const raw = w.raw(x, y, z);
    const d = BLOCKS[blockId(raw)];
    if (!d?.gravity) return;
    const below = BLOCKS[w.id(x, y - 1, z)];
    if (y > 0 && (!below || !below.solid || below.replaceable)) {
      w.set(x, y, z, 0, 0, 'tick');
      this.host.spawnFalling(x, y, z, raw);
    }
  }

  // ------------------------------------------------------------------ supports
  private checkSupport(x: number, y: number, z: number, d: BlockDef): void {
    const w = this.host.world;
    const meta = w.meta(x, y, z);
    const solidAt = (xx: number, yy: number, zz: number) => BLOCKS[w.id(xx, yy, zz)]?.solid ?? false;
    const opaqueAt = (xx: number, yy: number, zz: number) => OPAQUE[w.id(xx, yy, zz)] === 1 || (BLOCKS[w.id(xx, yy, zz)]?.solid ?? false);
    let ok = true;
    const H = [
      [0, 1],
      [-1, 0],
      [0, -1],
      [1, 0],
    ];
    switch (d.shape) {
      case 'torch':
        if (meta === 0) ok = opaqueAt(x, y - 1, z) || BLOCKS[w.id(x, y - 1, z)]?.shape === 'fence';
        else {
          const [dx, dz] = H[(meta - 1) & 3];
          ok = opaqueAt(x + dx, y, z + dz);
        }
        break;
      case 'cross':
        if (d.key === 'cobweb') break;
        ok = supportsPlant(w.id(x, y - 1, z), d.key) || (d.waterlogged && solidAt(x, y - 1, z));
        if (d.key === 'sugar_cane' && ok && w.id(x, y - 1, z) !== d.id) ok = this.waterNear(x, y - 1, z);
        if (d.key === 'kelp' || d.key === 'seagrass') ok = solidAt(x, y - 1, z) || w.id(x, y - 1, z) === d.id;
        break;
      case 'crop':
        ok = w.id(x, y - 1, z) === B.farmland;
        break;
      case 'cactus': {
        const g = w.id(x, y - 1, z);
        ok = g === B.sand || g === B.red_sand || g === B.cactus;
        for (const [dx, dz] of H) if (solidAt(x + dx, y, z + dz)) ok = false;
        break;
      }
      case 'layer':
      case 'carpet':
      case 'plate':
      case 'wire':
      case 'rail':
        ok = solidAt(x, y - 1, z) && w.id(x, y - 1, z) !== B.ice;
        break;
      case 'lily':
        ok = WATERLOGGED[w.id(x, y - 1, z)] === 1;
        break;
      case 'ladder':
      case 'vine': {
        const [dx, dz] = H[meta & 3];
        ok = opaqueAt(x + dx, y, z + dz) || (d.key === 'vine' && BLOCKS[w.id(x, y + 1, z)]?.key === 'vine') || (d.key === 'vine' && opaqueAt(x, y + 1, z));
        break;
      }
      case 'lever':
      case 'button': {
        const face = meta & 7;
        if (face === 0) ok = opaqueAt(x, y - 1, z);
        else if (face === 1) ok = opaqueAt(x, y + 1, z);
        else {
          const [dx, dz] = H[(face - 2) & 3];
          ok = opaqueAt(x + dx, y, z + dz);
        }
        break;
      }
      case 'door': {
        const top = (meta & 8) !== 0;
        if (top) ok = w.id(x, y - 1, z) === d.id;
        else ok = w.id(x, y + 1, z) === d.id && solidAt(x, y - 1, z);
        break;
      }
      case 'bed': {
        const head = (meta & 8) !== 0;
        const [dx, dz] = H[meta & 3];
        ok = head ? w.id(x - dx, y, z - dz) === d.id : w.id(x + dx, y, z + dz) === d.id;
        break;
      }
      case 'fire':
        ok = solidAt(x, y - 1, z) || this.flammableAround(x, y, z);
        break;
    }
    if (d.key === 'snow_layer' && !solidAt(x, y - 1, z)) ok = false;
    if (!ok) {
      this.host.dropBlock(x, y, z, w.raw(x, y, z));
    }
  }

  private waterNear(x: number, y: number, z: number): boolean {
    const w = this.host.world;
    for (const [dx, dz] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ])
      if (WATERLOGGED[w.id(x + dx, y, z + dz)]) return true;
    return false;
  }

  private flammableAround(x: number, y: number, z: number): boolean {
    const w = this.host.world;
    for (const [dx, dy, dz] of [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ])
      if (BLOCKS[w.id(x + dx, y + dy, z + dz)]?.flammable) return true;
    return false;
  }

  // ------------------------------------------------------------------ mises à jour aléatoires
  private randomTicks(): void {
    const h = this.host;
    const speed = h.rules.randomTickSpeed;
    if (speed <= 0) return;
    const w = h.world;
    const pcx = Math.floor(h.center.x / 16);
    const pcz = Math.floor(h.center.z / 16);
    const R = 5;
    for (let cz = pcz - R; cz <= pcz + R; cz++)
      for (let cx = pcx - R; cx <= pcx + R; cx++) {
        const c = w.chunks.get(cx, cz);
        if (!c || !c.ready) continue;
        let maxH = 0;
        for (let i = 0; i < 256; i++) maxH = Math.max(maxH, c.heightmap[i]);
        const sections = (maxH >> 4) + 1;
        for (let s = 0; s < sections; s++)
          for (let k = 0; k < 3 * speed; k++) {
            const lx = Math.floor(Math.random() * 16);
            const lz = Math.floor(Math.random() * 16);
            const y = s * 16 + Math.floor(Math.random() * 16);
            const raw = c.get(lx, y, lz);
            const id = raw & 0x3ff;
            if (id === 0) continue;
            const d = BLOCKS[id];
            if (!d?.tick) continue;
            this.randomTick(cx * 16 + lx, y, cz * 16 + lz, d, (raw >> 10) & 63);
          }
      }
  }

  private randomTick(x: number, y: number, z: number, d: BlockDef, meta: number): void {
    const w = this.host.world;
    const lightAbove = () => Math.max(w.skyLight(x, y + 1, z), w.blockLight(x, y + 1, z));
    switch (d.tick) {
      case 'grass_spread':
      case 'mycelium': {
        if (OPAQUE[w.id(x, y + 1, z)]) {
          w.set(x, y, z, B.dirt, 0, 'tick');
          return;
        }
        if (lightAbove() < 9) return;
        const tx = x + Math.floor(Math.random() * 3) - 1;
        const ty = y + Math.floor(Math.random() * 5) - 3;
        const tz = z + Math.floor(Math.random() * 3) - 1;
        if (w.id(tx, ty, tz) === B.dirt && w.meta(tx, ty, tz) === 0 && !OPAQUE[w.id(tx, ty + 1, tz)] && !IS_LIQUID[w.id(tx, ty + 1, tz)]) w.set(tx, ty, tz, d.id, 0, 'tick');
        return;
      }
      case 'crop': {
        if (meta >= 7) return;
        if (lightAbove() < 9 && w.skyLight(x, y, z) < 9 && w.blockLight(x, y, z) < 9) return;
        const moist = w.meta(x, y - 1, z) > 0;
        if (Math.random() < (moist ? 0.35 : 0.15)) w.set(x, y, z, d.id, meta + 1, 'tick');
        return;
      }
      case 'sapling': {
        if (Math.max(w.skyLight(x, y, z), w.blockLight(x, y, z)) < 9 || Math.random() > 0.15) return;
        this.growSapling(x, y, z, d);
        return;
      }
      case 'leaves_decay': {
        if (meta & 1) return; // feuilles posées par un joueur
        if (!this.logNearby(x, y, z, 4)) {
          this.host.dropBlock(x, y, z, w.raw(x, y, z));
        }
        return;
      }
      case 'cactus':
      case 'cane': {
        if (w.id(x, y + 1, z) !== 0) return;
        let n = 1;
        while (w.id(x, y - n, z) === d.id && n < 4) n++;
        if (n >= 3 || Math.random() > 0.2) return;
        w.set(x, y + 1, z, d.id, 0, 'tick');
        return;
      }
      case 'ice_melt':
        if (w.blockLight(x, y, z) >= 12 || (this.host.dimension === 1)) w.set(x, y, z, LIQUID_WATER, 0, 'tick');
        return;
      case 'farmland': {
        let water = false;
        for (let dx = -4; dx <= 4 && !water; dx++) for (let dz = -4; dz <= 4 && !water; dz++) for (let dy = 0; dy <= 1; dy++) if (WATERLOGGED[w.id(x + dx, y + dy, z + dz)]) water = true;
        if (this.host.isRaining() && w.skyLight(x, y + 1, z) >= 14) water = true;
        if (water && meta === 0) w.set(x, y, z, d.id, 1, 'tick');
        else if (!water && meta > 0) w.set(x, y, z, d.id, 0, 'tick');
        else if (!water && BLOCKS[w.id(x, y + 1, z)]?.shape !== 'crop' && Math.random() < 0.1) w.set(x, y, z, B.dirt, 0, 'tick');
        return;
      }
      case 'fire': {
        if (!this.host.rules.fireSpread) {
          if (Math.random() < 0.3) w.set(x, y, z, 0, 0, 'tick');
          return;
        }
        const below = BLOCKS[w.id(x, y - 1, z)];
        const eternal = below?.key === 'magma' || below?.key === 'ember_stone' || below?.key === 'basalt';
        if (this.host.isRaining() && w.skyLight(x, y, z) >= 14) {
          w.set(x, y, z, 0, 0, 'tick');
          return;
        }
        // Propagation et combustion
        for (const [dx, dy, dz] of [
          [1, 0, 0],
          [-1, 0, 0],
          [0, 1, 0],
          [0, -1, 0],
          [0, 0, 1],
          [0, 0, -1],
        ]) {
          const n = BLOCKS[w.id(x + dx, y + dy, z + dz)];
          if (n?.flammable && Math.random() < 0.15) {
            w.set(x + dx, y + dy, z + dz, Math.random() < 0.6 ? B.fire : 0, 0, 'tick');
          }
        }
        if (!eternal && Math.random() < 0.25 && !this.flammableAround(x, y, z)) w.set(x, y, z, 0, 0, 'tick');
        else if (!eternal && Math.random() < 0.08) w.set(x, y, z, 0, 0, 'tick');
        return;
      }
    }
  }

  private logNearby(x: number, y: number, z: number, r: number): boolean {
    const w = this.host.world;
    for (let dy = -r; dy <= r; dy++)
      for (let dz = -r; dz <= r; dz++)
        for (let dx = -r; dx <= r; dx++) {
          if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) > r + 1) continue;
          const k = BLOCKS[w.id(x + dx, y + dy, z + dz)]?.key ?? '';
          if (k.endsWith('_log') || k === 'mushroom_stem') return true;
        }
    return false;
  }

  /** Fait pousser un arbre à partir d'une pousse (avec poudre d'os ou aléatoirement). */
  growSapling(x: number, y: number, z: number, d: BlockDef): boolean {
    const w = this.host.world;
    const kinds: Record<string, TreeKind> = { oak: Math.random() < 0.1 ? 'big_oak' : 'oak', birch: 'birch', spruce: 'spruce', jungle: 'jungle', acacia: 'acacia', dark_oak: 'dark_oak', cherry: 'cherry', palm: 'palm', golden: 'golden' };
    const kind = kinds[d.sapling ?? 'oak'] ?? 'oak';
    for (let i = 1; i < 6; i++) if (BLOCKS[w.id(x, y + i, z)]?.solid) return false;
    w.set(x, y, z, 0, 0, 'tick');
    const writer = worldWriter(w);
    growTree(writer, kind, x, y, z, Math.floor(Math.random() * 1e9));
    return true;
  }
}

/** Adaptateur : permet aux générateurs d'arbres d'écrire directement dans le monde. */
export function worldWriter(w: World): ChunkWriter {
  return {
    get: (x: number, y: number, z: number) => (y < 0 || y >= WORLD_HEIGHT ? -1 : w.id(x, y, z)),
    set: (x: number, y: number, z: number, id: number, meta = 0) => {
      w.set(x, y, z, id, meta, 'tick');
    },
    setSoft: (x: number, y: number, z: number, id: number, meta = 0) => {
      const cur = w.id(x, y, z);
      if (cur === 0 || REPLACEABLE[cur] || !OPAQUE[cur]) w.set(x, y, z, id, meta, 'tick');
    },
    fill: () => undefined,
    touches: () => true,
    inside: () => true,
    mark: () => undefined,
    markers: [],
  } as unknown as ChunkWriter;
}
