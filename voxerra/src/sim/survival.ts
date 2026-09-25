/**
 * Survie du joueur : énergie (faim), régénération, air (noyade), température
 * corporelle, dangers de l'environnement (lave, cactus, magma, vide, suffocation).
 */
import type { Sim } from './sim';
import type { Player } from '../entity/player';
import { BIOMES } from '../worldgen/biomes';
import { clamp } from '../engine/math';
import { Shape } from '../registry/blocks';

export function tickSurvival(sim: Sim, p: Player, dt: number): void {
  p.tickLiving(dt);
  if (p.dead) return;
  p.attackCooldown = Math.max(0, p.attackCooldown - dt);
  p.dodgeCooldown = Math.max(0, p.dodgeCooldown - dt);
  p.portalCooldown = Math.max(0, p.portalCooldown - dt);
  const w = sim.world(p.dim);
  const t = w.content.blocks;
  const b = p.body;
  p.updateMaxHealth();
  if (p.spectator) return;

  // ---- dangers de l'environnement (toutes les 0,5 s)
  p.envAcc += dt;
  if (p.envAcc >= 0.5) {
    p.envAcc = 0;
    if (b.inLava) {
      p.damage(4, { type: 'lava', ignoreArmor: true });
      if (!p.hasEffect('resistance_feu')) p.addEffect('brulure', 6);
    }
    const voidY = p.dim === 'astral' ? -16 : p.dim === 'abime' ? -8 : -40;
    if (p.y < voidY) p.damage(4, { type: 'void', ignoreArmor: true });
    // contact : cactus, croûte de magma
    const x0 = Math.floor(b.x - b.hw - 0.05),
      x1 = Math.floor(b.x + b.hw + 0.05);
    const z0 = Math.floor(b.z - b.hw - 0.05),
      z1 = Math.floor(b.z + b.hw + 0.05);
    const y0 = Math.floor(b.y - 0.05),
      y1 = Math.floor(b.y + b.h);
    let contact = 0;
    for (let x = x0; x <= x1; x++)
      for (let z = z0; z <= z1; z++)
        for (let y = y0; y <= y1; y++) {
          const id = w.getId(x, y, z);
          const dmg = t.damage[id];
          if (dmg > 0 && !t.liquid[id]) {
            if (t.shape[id] === Shape.CUBE && y === y0 && p.sneaking) continue; // magma : marcher accroupi
            contact = Math.max(contact, dmg);
          }
        }
    if (contact > 0 && !p.creative) p.damage(contact, { type: 'contact', knockback: 0 });
    // suffocation
    const eye = w.getId(Math.floor(b.x), Math.floor(b.y + p.eye), Math.floor(b.z));
    if (t.opaque[eye] && t.solid[eye]) p.damage(1, { type: 'suffocate', ignoreArmor: true });
  }
  if (p.creative) return;

  // ---- énergie
  if (p.sprinting) p.exhaust(0.1 * dt * 20 * 0.05);
  while (p.exhaustion >= 4) {
    p.exhaustion -= 4;
    if (p.saturation > 0) p.saturation = Math.max(0, p.saturation - 1);
    else if (sim.difficulty > 0) p.energy = Math.max(0, p.energy - 1);
  }
  if (sim.difficulty === 0) {
    p.energy = Math.min(20, p.energy + dt * 0.5);
    if (p.health < p.maxHealth) p.heal(dt * 0.5);
  }
  if (sim.rules.naturalRegen && p.energy >= 18 && p.health < p.maxHealth) {
    p.regenAcc += dt;
    const period = p.saturation > 0 && p.energy >= 20 ? 1 : 3.5;
    if (p.regenAcc >= period) {
      p.regenAcc = 0;
      p.heal(1);
      p.exhaust(3);
    }
  } else p.regenAcc = 0;
  if (p.energy <= 0) {
    p.starveAcc += dt;
    if (p.starveAcc >= 4) {
      p.starveAcc = 0;
      const floor = sim.difficulty >= 3 ? 0 : sim.difficulty === 2 ? 1 : 10;
      if (p.health > floor) p.damage(1, { type: 'starve', ignoreArmor: true });
    }
  }

  // ---- air
  if (b.headInWater) {
    p.airAcc += dt;
    if (p.airAcc >= 1.5) {
      p.airAcc = 0;
      if (p.air > 0) p.air--;
      else p.damage(2, { type: 'drown', ignoreArmor: true });
    }
  } else {
    p.airAcc = 0;
    p.air = Math.min(10, p.air + dt * 4);
  }

  // ---- température
  const bx = Math.floor(p.x),
    bz = Math.floor(p.z);
  const biome = BIOMES[w.biomeAt(bx, bz)];
  let amb = biome ? biome.temp : 0;
  const env = sim.env;
  if (p.dim === 'surface') {
    amb -= Math.max(0, p.y - 100) * 0.006;
    if (env.isNight) amb -= biome?.id === 'desert' ? 0.7 : 0.25;
    const exposed = w.heightAt(bx, bz) <= p.y + 1;
    if (exposed) amb -= env.rain * 0.15;
    // à l'abri (grotte profonde) : température douce
    if (!exposed && p.y < 50) amb = amb * 0.4;
  } else if (p.dim === 'abime') amb = 0.95;
  else amb = -0.25;
  if (b.inWater) amb -= 0.35;
  const bl = w.blockLight(bx, Math.floor(p.y + 1), bz);
  amb += (bl / 15) * 0.55;
  const warmth = p.inventory.warmth();
  if (amb < 0) amb = Math.min(0, amb + warmth * 0.09);
  if (p.hasEffect('resistance_feu') && amb > 0.6) amb = 0.4;
  p.ambientTemp = clamp(amb, -1.2, 1.2);
  p.bodyTemp += (p.ambientTemp - p.bodyTemp) * dt * 0.06;
  if (p.bodyTemp < -0.6) {
    p.addEffect('frissons', 2);
    if (p.bodyTemp < -0.85) {
      p.starveAcc += 0;
      if (sim.tickCount % 120 === 0) p.damage(1, { type: 'freeze', ignoreArmor: true });
    }
  }
  if (p.bodyTemp > 0.7) {
    p.addEffect('fievre', 2);
    p.exhaust(0.004);
    if (p.bodyTemp > 0.9 && sim.tickCount % 100 === 0 && p.dim === 'abime') p.damage(1, { type: 'heat', ignoreArmor: true });
  }
}

/** Dégâts de chute (appelé à l'atterrissage). */
export function applyFall(sim: Sim, p: Player, dist: number): void {
  if (p.creative || p.flying || !sim.rules.fallDamage) return;
  if (p.hasEffect('chute_lente')) return;
  const w = sim.world(p.dim);
  const under = w.getId(Math.floor(p.x), Math.floor(p.y - 0.2), Math.floor(p.z));
  const t = w.content.blocks;
  let d = dist - 3.2;
  if (t.hasTag(under, 'leaves') || under === t.tryNum('neige') || under === t.tryNum('neige_poudreuse')) d *= 0.5;
  if (under === t.tryNum('mousse')) d *= 0.6;
  if (d >= 1) {
    p.damage(Math.floor(d), { type: 'fall', ignoreArmor: true });
    sim.emit({ t: 'sound', id: d > 4 ? 'chute_lourde' : 'chute', x: p.x, y: p.y, z: p.z });
  }
}
