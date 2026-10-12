/**
 * Explosions : lancer de rayons depuis le centre (la résistance des blocs absorbe l'onde),
 * destruction et lâcher d'une partie des blocs, dégâts et recul selon l'exposition,
 * réaction en chaîne de la TNT et feu optionnel.
 */
import * as THREE from 'three';
import { B, BLOCKS, IS_LIQUID } from '../world/blocks';
import { blockId } from '../world/constants';
import { blockDrops } from './drops';
import { raycast } from '../world/Raycast';
import type { Entity } from '../entity/Entity';
import type { Game } from './Game';

function resistance(id: number): number {
  const d = BLOCKS[id];
  if (!d) return 0;
  if (IS_LIQUID[id]) return 100;
  if (d.hardness < 0) return 3600000;
  if (d.key === 'obsidian' || d.key === 'obsidian_bricks') return 1200;
  return d.hardness * 3;
}

const dirs: THREE.Vector3[] = [];
for (let x = 0; x < 16; x++)
  for (let y = 0; y < 16; y++)
    for (let z = 0; z < 16; z++) {
      if (x !== 0 && x !== 15 && y !== 0 && y !== 15 && z !== 0 && z !== 15) continue;
      dirs.push(new THREE.Vector3(x / 15 - 0.5, y / 15 - 0.5, z / 15 - 0.5).normalize());
    }

export function explode(g: Game, x: number, y: number, z: number, power: number, source: Entity | null, breakBlocks: boolean, fire: boolean): void {
  const w = g.world;
  const center = new THREE.Vector3(x, y, z);
  g.particles.explosion(x, y, z, power);
  g.audio('explode', center, Math.min(1, 0.4 + power * 0.15));
  g.shake = Math.max(g.shake, Math.min(1, power / 6) * Math.max(0, 1 - g.player.pos.distanceTo(center) / 32));

  // 1. Blocs touchés
  const hit = new Set<string>();
  const toBreak: Array<[number, number, number]> = [];
  if (breakBlocks) {
    for (const d of dirs) {
      let intensity = power * (0.7 + Math.random() * 0.6);
      let px = x;
      let py = y;
      let pz = z;
      while (intensity > 0) {
        const bx = Math.floor(px);
        const by = Math.floor(py);
        const bz = Math.floor(pz);
        const id = w.id(bx, by, bz);
        if (id !== 0) {
          intensity -= (resistance(id) + 0.3) * 0.3;
          if (intensity > 0 && !IS_LIQUID[id]) {
            const k = bx + ',' + by + ',' + bz;
            if (!hit.has(k)) {
              hit.add(k);
              toBreak.push([bx, by, bz]);
            }
          }
        }
        px += d.x * 0.3;
        py += d.y * 0.3;
        pz += d.z * 0.3;
        intensity -= 0.225;
      }
    }
  }

  // 2. Entités : dégâts selon l'exposition (rayons non bloqués)
  const radius = power * 2;
  for (const e of g.entitiesNear(center, radius)) {
    if (e === source && e.type === 'tnt') continue;
    const dist = e.pos.distanceTo(center) / radius;
    if (dist > 1) continue;
    const exposure = exposureOf(g, center, e);
    const impact = (1 - dist) * exposure;
    const dmg = Math.floor(((impact * impact + impact) / 2) * 7 * radius + 1);
    const kb = e.pos.clone().add(new THREE.Vector3(0, e.height / 2, 0)).sub(center).normalize().multiplyScalar(impact);
    if (e.living || e.type === 'player') e.hurt(dmg, { type: 'explosion', attacker: source, knockback: kb.clone().multiplyScalar(0.5) });
    else if (e.type === 'item' || e.type === 'xp') {
      if (impact > 0.5) e.remove();
    }
    e.vel.add(kb);
  }

  // 3. Destruction (après les dégâts, pour que les blocs protègent)
  const yieldChance = 1 / power;
  for (const [bx, by, bz] of toBreak) {
    const raw = w.raw(bx, by, bz);
    const id = blockId(raw);
    if (id === 0) continue;
    const def = BLOCKS[id];
    if (!def) continue;
    if (g.net && !g.net.canEdit(bx, by, bz)) continue;
    if (id === B.tnt) {
      w.set(bx, by, bz, 0, 0, 'tick');
      g.igniteTnt(bx, by, bz, 10 + Math.floor(Math.random() * 20));
      continue;
    }
    // Contenu des coffres
    const be = w.blockEntity(bx, by, bz);
    if (be && Array.isArray(be.items)) for (const s of be.items as Array<{ id: number; count: number } | null>) if (s) g.dropItem(bx + 0.5, by + 0.5, bz + 0.5, s);
    w.set(bx, by, bz, 0, 0, 'tick');
    if (Math.random() < yieldChance) {
      const drops = blockDrops(def, 0, null);
      for (const s of drops.items) g.dropItem(bx + 0.5, by + 0.5, bz + 0.5, s);
    }
    if (Math.random() < 0.2) g.particles.smoke(bx + 0.5, by + 0.5, bz + 0.5);
  }
  if (fire) {
    for (const [bx, by, bz] of toBreak) {
      if (Math.random() > 0.33) continue;
      if (w.id(bx, by, bz) === 0 && BLOCKS[w.id(bx, by - 1, bz)]?.opaque) w.set(bx, by, bz, B.fire, 0, 'tick');
    }
  }
}

function exposureOf(g: Game, center: THREE.Vector3, e: Entity): number {
  const b = e.box;
  let seen = 0;
  let total = 0;
  const dir = new THREE.Vector3();
  for (let i = 0; i <= 1; i += 0.5)
    for (let j = 0; j <= 1; j += 0.5)
      for (let k = 0; k <= 1; k += 0.5) {
        const p = new THREE.Vector3(b.x0 + (b.x1 - b.x0) * i, b.y0 + (b.y1 - b.y0) * j, b.z0 + (b.z1 - b.z0) * k);
        dir.copy(p).sub(center);
        const dist = dir.length();
        total++;
        if (dist < 0.01) {
          seen++;
          continue;
        }
        dir.divideScalar(dist);
        const h = raycast(g.world, center, dir, dist);
        if (!h || !BLOCKS[h.id]?.solid) seen++;
      }
  return total ? seen / total : 1;
}
