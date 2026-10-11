/**
 * Système d'énergie (mécanismes logiques) : leviers, boutons, plaques de pression,
 * blocs d'énergie, fils d'énergie (intensité 0..15 décroissante), et récepteurs
 * (lampes, portes, trappes, TNT, rails propulseurs).
 */
import { B, BLOCKS } from './blocks';
import { blockId, blockMeta } from './constants';
import type { World } from './World';

const N6 = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export interface PowerHost {
  world: World;
  igniteTnt(x: number, y: number, z: number): void;
  sound(name: string, x: number, y: number, z: number): void;
  schedule(x: number, y: number, z: number, delay: number): void;
  entitiesOn(x: number, y: number, z: number): boolean;
}

export class PowerSystem {
  private host!: PowerHost;
  private busy = false;
  private pending: Array<[number, number, number]> = [];
  /** Plaques de pression actives à surveiller. */
  private plates = new Set<string>();

  bind(host: PowerHost): void {
    this.host = host;
  }

  /** Puissance émise directement par un bloc source. */
  private sourcePower(raw: number): number {
    const id = blockId(raw);
    const m = blockMeta(raw);
    if (id === B.lever || id === B.stone_button || id === B.oak_button) return m & 8 ? 15 : 0;
    if (id === B.stone_pressure_plate || id === B.oak_pressure_plate) return m ? 15 : 0;
    if (id === B.energy_block) return 15;
    return 0;
  }

  private isPowerRelevant(id: number): boolean {
    const d = BLOCKS[id];
    return !!d && (d.powerSource === true || d.powerConsumer === true || d.shape === 'wire');
  }

  onBlockChanged(x: number, y: number, z: number): void {
    const w = this.host.world;
    let relevant = this.isPowerRelevant(w.id(x, y, z));
    for (const [dx, dy, dz] of N6) if (this.isPowerRelevant(w.id(x + dx, y + dy, z + dz))) relevant = true;
    // Un bloc posé/retiré à côté d'un fil peut changer les connexions : on recalcule.
    if (!relevant) return;
    this.pending.push([x, y, z]);
    if (!this.busy) this.flush();
  }

  private flush(): void {
    this.busy = true;
    let guard = 0;
    while (this.pending.length && guard++ < 16) {
      const [x, y, z] = this.pending.shift()!;
      this.recompute(x, y, z);
    }
    this.pending.length = 0;
    this.busy = false;
  }

  /** Recalcule le réseau autour d'un point. */
  private recompute(cx: number, cy: number, cz: number): void {
    const w = this.host.world;
    const R = 16;
    // 1) Réseau de fils connectés à la zone
    const wires = new Map<string, [number, number, number]>();
    const stack: Array<[number, number, number]> = [];
    const seed = (x: number, y: number, z: number) => {
      if (BLOCKS[w.id(x, y, z)]?.shape === 'wire') {
        const k = `${x},${y},${z}`;
        if (!wires.has(k)) {
          wires.set(k, [x, y, z]);
          stack.push([x, y, z]);
        }
      }
    };
    seed(cx, cy, cz);
    for (const [dx, dy, dz] of N6) {
      seed(cx + dx, cy + dy, cz + dz);
      for (const [ex, ey, ez] of N6) seed(cx + dx + ex, cy + dy + ey, cz + dz + ez);
    }
    while (stack.length) {
      const [x, y, z] = stack.pop()!;
      if (Math.abs(x - cx) > R || Math.abs(z - cz) > R) continue;
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ])
        for (const dy of [0, 1, -1]) seed(x + dx, y + dy, z + dz);
    }
    // 2) Propagation : sources -> fils
    const level = new Map<string, number>();
    const queue: Array<[number, number, number, number]> = [];
    for (const [k, [x, y, z]] of wires) {
      let p = 0;
      for (const [dx, dy, dz] of N6) {
        p = Math.max(p, this.sourcePower(w.raw(x + dx, y + dy, z + dz)));
        // bloc solide alimenté par une source posée dessus/contre lui
        const nid = w.id(x + dx, y + dy, z + dz);
        if (BLOCKS[nid]?.opaque && this.strongPowered(x + dx, y + dy, z + dz)) p = 15;
      }
      if (p > 0) {
        level.set(k, p);
        queue.push([x, y, z, p]);
      }
    }
    while (queue.length) {
      const [x, y, z, p] = queue.shift()!;
      if (p <= 1) continue;
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ])
        for (const dy of [0, 1, -1]) {
          const k = `${x + dx},${y + dy},${z + dz}`;
          if (!wires.has(k)) continue;
          if ((level.get(k) ?? 0) >= p - 1) continue;
          level.set(k, p - 1);
          queue.push([x + dx, y + dy, z + dz, p - 1]);
        }
    }
    // 3) Mise à jour des fils
    for (const [k, [x, y, z]] of wires) {
      const p = level.get(k) ?? 0;
      if ((w.meta(x, y, z) & 15) !== p) w.set(x, y, z, B.energy_wire, p, 'tick');
    }
    // 4) Récepteurs autour du réseau et du point modifié
    const consumers = new Set<string>();
    const consider = (x: number, y: number, z: number) => {
      for (const [dx, dy, dz] of [[0, 0, 0], ...N6]) {
        const id = w.id(x + dx, y + dy, z + dz);
        if (BLOCKS[id]?.powerConsumer) consumers.add(`${x + dx},${y + dy},${z + dz}`);
        // à travers un bloc solide (levier sur un mur à côté d'une porte)
        if (BLOCKS[id]?.opaque)
          for (const [ex, ey, ez] of N6) {
            const id2 = w.id(x + dx + ex, y + dy + ey, z + dz + ez);
            if (BLOCKS[id2]?.powerConsumer) consumers.add(`${x + dx + ex},${y + dy + ey},${z + dz + ez}`);
          }
      }
    };
    consider(cx, cy, cz);
    for (const [, [x, y, z]] of wires) consider(x, y, z);
    for (const k of consumers) {
      const [x, y, z] = k.split(',').map(Number);
      this.updateConsumer(x, y, z, this.isPowered(x, y, z, level));
    }
  }

  /** Bloc solide fortement alimenté (levier/bouton fixé dessus, plaque posée dessus). */
  private strongPowered(x: number, y: number, z: number): boolean {
    const w = this.host.world;
    for (const [dx, dy, dz] of N6) {
      const raw = w.raw(x + dx, y + dy, z + dz);
      if (this.sourcePower(raw) > 0) return true;
    }
    return false;
  }

  private isPowered(x: number, y: number, z: number, level: Map<string, number>): boolean {
    const w = this.host.world;
    const check = (xx: number, yy: number, zz: number) => {
      for (const [dx, dy, dz] of N6) {
        const nx = xx + dx;
        const ny = yy + dy;
        const nz = zz + dz;
        if (this.sourcePower(w.raw(nx, ny, nz)) > 0) return true;
        const lv = level.get(`${nx},${ny},${nz}`);
        if (lv && lv > 0) return true;
        if (BLOCKS[w.id(nx, ny, nz)]?.shape === 'wire' && (w.meta(nx, ny, nz) & 15) > 0) return true;
        if (BLOCKS[w.id(nx, ny, nz)]?.opaque && this.strongPowered(nx, ny, nz)) return true;
      }
      return false;
    };
    const id = w.id(x, y, z);
    const d = BLOCKS[id];
    if (d?.shape === 'door') {
      const top = (w.meta(x, y, z) & 8) !== 0;
      const by = top ? y - 1 : y;
      return check(x, by, z) || check(x, by + 1, z);
    }
    return check(x, y, z);
  }

  private updateConsumer(x: number, y: number, z: number, on: boolean): void {
    const w = this.host.world;
    const raw = w.raw(x, y, z);
    const id = blockId(raw);
    const m = blockMeta(raw);
    const d = BLOCKS[id];
    if (!d) return;
    if (id === B.lamp) {
      if (((m & 1) === 1) !== on) w.set(x, y, z, id, on ? 1 : 0, 'tick');
    } else if (d.shape === 'door') {
      const top = (m & 8) !== 0;
      const by = top ? y - 1 : y;
      const bm = w.meta(x, by, z);
      const open = (bm & 4) !== 0;
      if (open !== on) {
        w.set(x, by, z, id, on ? bm | 4 : bm & ~4, 'tick');
        const tm = w.meta(x, by + 1, z);
        w.set(x, by + 1, z, id, on ? tm | 4 : tm & ~4, 'tick');
        this.host.sound(on ? 'door_open' : 'door_close', x, y, z);
      }
    } else if (d.shape === 'trapdoor') {
      if (((m & 4) !== 0) !== on) {
        w.set(x, y, z, id, on ? m | 4 : m & ~4, 'tick');
        this.host.sound(on ? 'door_open' : 'door_close', x, y, z);
      }
    } else if (id === B.tnt && on) {
      w.set(x, y, z, 0, 0, 'tick');
      this.host.igniteTnt(x, y, z);
    } else if (id === B.powered_rail) {
      if (((m & 16) !== 0) !== on) w.set(x, y, z, id, on ? m | 16 : m & ~16, 'tick');
    }
  }

  /** Tic programmé : relâchement des boutons, vérification des plaques. */
  scheduled(x: number, y: number, z: number): void {
    const w = this.host.world;
    const raw = w.raw(x, y, z);
    const id = blockId(raw);
    const m = blockMeta(raw);
    if ((id === B.stone_button || id === B.oak_button) && m & 8) {
      w.set(x, y, z, id, m & ~8, 'tick');
      this.host.sound('lever', x, y, z);
    } else if ((id === B.stone_pressure_plate || id === B.oak_pressure_plate) && m) {
      if (this.host.entitiesOn(x, y, z)) this.host.schedule(x, y, z, 10);
      else {
        w.set(x, y, z, id, 0, 'tick');
        this.host.sound('lever', x, y, z);
        this.plates.delete(`${x},${y},${z}`);
      }
    }
  }

  /** Une entité marche sur une plaque. */
  stepOn(x: number, y: number, z: number): void {
    const w = this.host.world;
    const id = w.id(x, y, z);
    if (id !== B.stone_pressure_plate && id !== B.oak_pressure_plate) return;
    if (w.meta(x, y, z) === 0) {
      w.set(x, y, z, id, 1, 'tick');
      this.host.sound('lever', x, y, z);
      this.host.schedule(x, y, z, 10);
      this.plates.add(`${x},${y},${z}`);
    }
  }

  pressButton(x: number, y: number, z: number): void {
    const w = this.host.world;
    const raw = w.raw(x, y, z);
    const id = blockId(raw);
    const m = blockMeta(raw);
    if (m & 8) return;
    w.set(x, y, z, id, m | 8, 'tick');
    this.host.schedule(x, y, z, id === B.oak_button ? 30 : 20);
  }
}
