/**
 * Objectifs d'IA (data-driven) : ciblage, poursuite, perte de cible, fuite,
 * nourriture, troupeau, patrouille, errance, embuscade, attaques au corps à
 * corps / à distance / en piqué, esquive du soleil, capacités de boss
 * (onde de choc, charge, invocations, salves, téléportation, bouclier).
 */
import type { Mob } from '../mob';
import type { Sim } from '../../sim/sim';
import type { LivingEntity } from '../living';
import type { Player } from '../player';
import { Projectile } from '../projectile';
import { lookDir } from '../../engine/math';
import { tr } from '../../i18n/i18n';

export interface Goal {
  targeting?: boolean;
  always?: boolean;
  canStart(m: Mob, sim: Sim): boolean;
  canContinue?(m: Mob, sim: Sim): boolean;
  start?(m: Mob, sim: Sim): void;
  tick(m: Mob, sim: Sim, dt: number): void;
  stop?(m: Mob): void;
}

type P = Record<string, unknown>;
const num = (p: P, k: string, d: number): number => (typeof p[k] === 'number' ? (p[k] as number) : d);
const DIFF_MUL = [0.5, 0.75, 1, 1.4];

function dist(a: { x: number; y: number; z: number }, b: { x: number; y: number; z: number }): number {
  return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
}

function validPlayer(p: Player): boolean {
  return !p.dead && !p.creative && !p.removed;
}

/** Trouve une position debout près de (x,z) autour de la hauteur y. */
function groundNear(sim: Sim, m: Mob, x: number, y: number, z: number): number | null {
  const w = sim.world(m.dim);
  const t = w.content.blocks;
  const bx = Math.floor(x),
    bz = Math.floor(z);
  if (!w.isLoaded(bx, bz)) return null;
  for (let dy = 4; dy >= -6; dy--) {
    const yy = Math.floor(y) + dy;
    const below = w.getId(bx, yy - 1, bz);
    if (!t.solid[below] || t.damage[below] > 0) continue;
    if (t.solid[w.getId(bx, yy, bz)] || t.solid[w.getId(bx, yy + 1, bz)]) continue;
    if (t.liquid[w.getId(bx, yy, bz)] === 2 && !m.fireImmune) continue;
    return yy;
  }
  return null;
}

function attack(m: Mob, sim: Sim, target: LivingEntity, damage: number, element?: string, knockback = 1): void {
  const d = damage * DIFF_MUL[sim.difficulty] ;
  const done = target.damage(d, { type: 'melee', attacker: m, element: element as never, knockback });
  m.swing = 1;
  sim.emit({ t: 'swing', id: m.id });
  sim.emit({ t: 'sound', id: `mob_${m.type}_attack`, x: m.x, y: m.y + 1, z: m.z, vol: 0.7 });
  if (done > 0) sim.emit({ t: 'hurt', id: target.id, amount: done });
}

export function shoot(m: Mob, sim: Sim, target: { x: number; y: number; z: number; body?: { vx: number; vz: number; h: number } }, type: string, damage: number, speed: number, spreadAngle = 0): void {
  const pr = new Projectile(type, m, damage * DIFF_MUL[sim.difficulty]);
  pr.dim = m.dim;
  const ox = m.x,
    oy = m.y + m.eye * 0.85,
    oz = m.z;
  const th = (target.body?.h ?? 1.6) * 0.6;
  let dx = target.x - ox,
    dy = target.y + th - oy,
    dz = target.z - oz;
  const d = Math.hypot(dx, dy, dz) || 1;
  // anticipation
  const lead = d / speed;
  dx += (target.body?.vx ?? 0) * lead * 0.6;
  dz += (target.body?.vz ?? 0) * lead * 0.6;
  const spec = pr.spec;
  if (spec.gravity > 0) dy += 0.5 * spec.gravity * lead * lead * 0.9;
  const yawOff = spreadAngle;
  const cos = Math.cos(yawOff),
    sin = Math.sin(yawOff);
  const rx = dx * cos - dz * sin,
    rz = dx * sin + dz * cos;
  const l = Math.hypot(rx, dy, rz) || 1;
  const inacc = 0.03 * (3 - sim.difficulty);
  pr.setPos(ox + (rx / l) * (m.body.hw + 0.3), oy, oz + (rz / l) * (m.body.hw + 0.3));
  pr.body.vx = (rx / l + (Math.random() - 0.5) * inacc) * speed;
  pr.body.vy = (dy / l + (Math.random() - 0.5) * inacc) * speed;
  pr.body.vz = (rz / l + (Math.random() - 0.5) * inacc) * speed;
  sim.entities.add(pr);
  sim.emit({ t: 'sound', id: 'tir_' + type, x: ox, y: oy, z: oz, vol: 0.7 });
  m.swing = 1;
}

// ---------------------------------------------------------------- ciblage
function targetPlayer(p: P): Goal {
  const range = num(p, 'range', 16);
  return {
    targeting: true,
    canStart: () => true,
    tick(m, sim) {
      if (m.target) {
        // perte de cible : trop loin ou invisible depuis longtemps
        const d = dist(m, m.target);
        if (d > range * 1.6) m.target = null;
        else if (m.canSee(sim, m.target)) {
          m.targetMemory = 0;
          m.lastSeen = { x: m.target.x, y: m.target.y, z: m.target.z };
        } else {
          m.targetMemory += 0.25;
          if (m.targetMemory > 8) m.target = null;
        }
        return;
      }
      if (p.night && !sim.env.isNight) return;
      if (p.chance !== undefined && Math.random() > (p.chance as number) * 0.25) return;
      let best: Player | null = null,
        bd = range;
      for (const pl of sim.players) {
        if (pl.dim !== m.dim || !validPlayer(pl)) continue;
        const d = dist(m, pl);
        const r = pl.sneaking ? range * 0.6 : range;
        if (d > r || d > bd) continue;
        if (p.inWater && !pl.body.inWater) continue;
        if (p.stare) {
          const dir = lookDir(pl.yaw, pl.pitch);
          const vx = m.x - pl.x,
            vy = m.y + m.eye - (pl.y + pl.eye),
            vz = m.z - pl.z;
          const l = Math.hypot(vx, vy, vz) || 1;
          if ((dir.x * vx + dir.y * vy + dir.z * vz) / l < 0.97 && d > 4) continue;
        }
        if (d > 4 && !m.canSee(sim, pl)) continue;
        best = pl;
        bd = d;
      }
      if (best) {
        m.target = best;
        m.targetMemory = 0;
        if (p.stare) sim.emit({ t: 'sound', id: `mob_${m.type}_attack`, x: m.x, y: m.y + 2, z: m.z });
      }
    },
  };
}

function targetAttacker(p: P): Goal {
  const memory = num(p, 'memory', 10);
  return {
    targeting: true,
    canStart: () => true,
    tick(m) {
      const a = m.lastAttacker as LivingEntity | null;
      if (!a || m.lastAttackerTime > memory || a.dead || a.dim !== m.dim) return;
      if ((a as Player).creative) return;
      if (a.kind === 'mob' && (a as Mob).type === m.type) return;
      m.target = a;
      m.targetMemory = 0;
    },
  };
}

function targetGroup(): Goal {
  return {
    targeting: true,
    canStart: () => true,
    tick(m, sim) {
      if (m.target) return;
      for (const e of sim.entities.near(m.dim, m.x, m.y, m.z, 16, (e) => e.kind === 'mob' && (e as Mob).type === m.type && e !== m)) {
        const o = e as Mob;
        if (o.target && !o.target.dead) {
          m.target = o.target;
          return;
        }
      }
    },
  };
}

// ---------------------------------------------------------------- actions simples
function float(lava = false): Goal {
  return {
    always: true,
    canStart: () => false,
    tick(m) {
      const b = m.body;
      if ((lava ? b.inLava : b.inWater) && m.movement !== 'swim') b.vy = Math.max(b.vy, 2.6);
    },
  };
}

function panic(p: P): Goal {
  const speed = num(p, 'speed', 1.5);
  let t = 0;
  return {
    canStart: (m) => !!m.lastAttacker && m.lastAttackerTime < 0.3,
    canContinue: () => t > 0,
    start: () => (t = 4),
    tick(m, _sim, dt) {
      t -= dt;
      const a = m.lastAttacker;
      if (!a) return;
      const dx = m.x - a.x,
        dz = m.z - a.z;
      const l = Math.hypot(dx, dz) || 1;
      if (!m.moving || Math.random() < dt * 2) m.moveDirect(m.x + (dx / l) * 6 + (Math.random() - 0.5) * 4, m.y, m.z + (dz / l) * 6 + (Math.random() - 0.5) * 4, speed);
    },
    stop: (m) => m.stopMoving(),
  };
}

function fleeLowHp(p: P): Goal {
  const ratio = num(p, 'ratio', 0.25),
    speed = num(p, 'speed', 1.3);
  let t = 0;
  return {
    canStart: (m) => !!m.target && m.health < m.maxHealth * ratio,
    canContinue: (m) => t > 0 && !!m.target,
    start: (m, sim) => {
      t = 6;
      sim.emit({ t: 'sound', id: `mob_${m.type}_hurt`, x: m.x, y: m.y + 1, z: m.z });
    },
    tick(m, _sim, dt) {
      t -= dt;
      const a = m.target!;
      const dx = m.x - a.x,
        dz = m.z - a.z;
      const l = Math.hypot(dx, dz) || 1;
      m.navigateTo(m.x + (dx / l) * 10, m.y, m.z + (dz / l) * 10, speed);
      m.heal(dt * 0.4);
    },
    stop: (m) => m.stopMoving(),
  };
}

function avoidPlayer(p: P): Goal {
  const radius = num(p, 'radius', 8),
    speed = num(p, 'speed', 1.4);
  let from: Player | null = null;
  return {
    canStart(m, sim) {
      from = null;
      for (const pl of sim.players) if (pl.dim === m.dim && !pl.dead && !pl.spectator && !pl.sneaking && dist(m, pl) < radius) from = pl;
      return from !== null;
    },
    canContinue: (m) => !!from && dist(m, from) < radius * 1.6,
    tick(m) {
      const a = from!;
      const dx = m.x - a.x,
        dz = m.z - a.z;
      const l = Math.hypot(dx, dz) || 1;
      m.navigateTo(m.x + (dx / l) * 8, m.y, m.z + (dz / l) * 8, speed);
    },
    stop: (m) => m.stopMoving(),
  };
}

function followFood(p: P): Goal {
  const items = (p.items as string[]) ?? [];
  const speed = num(p, 'speed', 1);
  let who: Player | null = null;
  return {
    canStart(m, sim) {
      who = null;
      for (const pl of sim.players) {
        if (pl.dim !== m.dim || pl.dead) continue;
        const h = pl.inventory.held;
        if (h && items.includes(h.id) && dist(m, pl) < 9) who = pl;
      }
      return who !== null;
    },
    tick(m) {
      const pl = who!;
      m.lookAt(pl.x, pl.y + pl.eye, pl.z);
      if (dist(m, pl) > 2.2) m.navigateTo(pl.x, pl.y, pl.z, speed);
      else m.stopMoving();
    },
    stop: (m) => m.stopMoving(),
  };
}

function eatGrass(p: P): Goal {
  const chance = num(p, 'chance', 0.004);
  let t = 0;
  return {
    canStart(m, sim) {
      if (Math.random() > chance) return false;
      const w = sim.world(m.dim);
      return m.body.onGround && w.getId(Math.floor(m.x), Math.floor(m.y - 0.5), Math.floor(m.z)) === w.content.blocks.tryNum('herbe');
    },
    canContinue: () => t > 0,
    start: (m) => {
      t = 1.2;
      m.stopMoving();
    },
    tick(m, sim, dt) {
      t -= dt;
      m.pitch = -0.8;
      if (t <= 0) {
        const w = sim.world(m.dim);
        const x = Math.floor(m.x),
          y = Math.floor(m.y - 0.5),
          z = Math.floor(m.z);
        if (w.getId(x, y, z) === w.content.blocks.tryNum('herbe')) w.setBlock(x, y, z, w.content.blocks.tryNum('terre'));
        m.data.shorn = false;
        m.heal(2);
      }
    },
  };
}

function herd(p: P): Goal {
  const radius = num(p, 'radius', 10);
  let cx = 0,
    cz = 0;
  return {
    canStart(m, sim) {
      if (Math.random() > 0.02) return false;
      const mates = sim.entities.near(m.dim, m.x, m.y, m.z, 24, (e) => e.kind === 'mob' && (e as Mob).type === m.type && e !== m);
      if (mates.length === 0) return false;
      cx = mates.reduce((s, e) => s + e.x, 0) / mates.length;
      cz = mates.reduce((s, e) => s + e.z, 0) / mates.length;
      return Math.hypot(cx - m.x, cz - m.z) > radius;
    },
    canContinue: (m) => m.moving,
    start(m) {
      m.navigateTo(cx + (Math.random() - 0.5) * 3, m.y, cz + (Math.random() - 0.5) * 3, 1);
    },
    tick() {},
    stop: (m) => m.stopMoving(),
  };
}

function wander(p: P, patrol = false): Goal {
  const speed = num(p, 'speed', 0.7);
  const radius = num(p, 'radius', 8);
  let idle = Math.random() * 5;
  let t = 0;
  return {
    canStart(m, _sim) {
      return idle <= 0 || Math.random() < 0.004;
    },
    canContinue: (m) => m.moving && t > 0,
    start(m, sim) {
      t = 10;
      idle = 3 + Math.random() * 6;
      const home = patrol && m.home ? m.home : m;
      for (let i = 0; i < 6; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = 2 + Math.random() * (patrol ? radius : 8);
        const x = home.x + Math.cos(a) * r,
          z = home.z + Math.sin(a) * r;
        const y = groundNear(sim, m, x, m.y, z);
        if (y !== null) {
          m.navigateTo(x, y, z, speed);
          return;
        }
      }
    },
    tick(m, _sim, dt) {
      t -= dt;
      void m;
    },
    stop: (m) => m.stopMoving(),
    always: false,
  };
  // idle diminue via lookAround (voir ci-dessous) : on l'expose par fermeture
}

function lookAround(): Goal {
  let t = 0;
  let look: { x: number; y: number; z: number } | null = null;
  return {
    canStart: () => true,
    tick(m, sim, dt) {
      t -= dt;
      if (t <= 0) {
        t = 2 + Math.random() * 4;
        const pl = sim.players.find((p) => p.dim === m.dim && dist(m, p) < 8);
        look = pl ? { x: pl.x, y: pl.y + pl.eye, z: pl.z } : Math.random() < 0.5 ? { x: m.x + (Math.random() - 0.5) * 10, y: m.y + m.eye, z: m.z + (Math.random() - 0.5) * 10 } : null;
      }
      if (look) m.lookAt(look.x, look.y, look.z);
    },
  };
}

function swimWander(p: P): Goal {
  const speed = num(p, 'speed', 0.8);
  return {
    canStart: (m) => m.body.inWater && (!m.moving || Math.random() < 0.01),
    canContinue: (m) => m.body.inWater && m.moving,
    start(m, sim) {
      const w = sim.world(m.dim);
      for (let i = 0; i < 8; i++) {
        const x = m.x + (Math.random() - 0.5) * 12,
          y = m.y + (Math.random() - 0.5) * 4,
          z = m.z + (Math.random() - 0.5) * 12;
        if (w.content.blocks.liquid[w.getId(Math.floor(x), Math.floor(y), Math.floor(z))] === 1) {
          m.moveDirect(x, y, z, speed);
          return;
        }
      }
    },
    tick() {},
  };
}

function flyWander(p: P): Goal {
  const speed = num(p, 'speed', 0.7);
  const h = (p.height as [number, number]) ?? [2, 8];
  let t = 0;
  return {
    canStart: () => true,
    tick(m, sim, dt) {
      t -= dt;
      if (t > 0 && m.moving) return;
      t = 3 + Math.random() * 4;
      const w = sim.world(m.dim);
      const x = m.x + (Math.random() - 0.5) * 16,
        z = m.z + (Math.random() - 0.5) * 16;
      let ground = m.y;
      for (let y = Math.floor(m.y) + 6; y > m.y - 20; y--) if (w.content.blocks.solid[w.getId(Math.floor(x), y, Math.floor(z))]) {
        ground = y + 1;
        break;
      }
      const ty = ground + h[0] + Math.random() * (h[1] - h[0]);
      m.moveDirect(x, ty, z, speed);
    },
  };
}

function seekShade(): Goal {
  let dest: { x: number; y: number; z: number } | null = null;
  return {
    canStart(m, sim) {
      if (!m.def.burnsInDaylight || sim.env.isNight || m.target) return false;
      const w = sim.world(m.dim);
      if (w.skyLight(Math.floor(m.x), Math.floor(m.y + 1), Math.floor(m.z)) < 15) return false;
      dest = null;
      for (let i = 0; i < 16; i++) {
        const x = m.x + (Math.random() - 0.5) * 20,
          z = m.z + (Math.random() - 0.5) * 20;
        const y = groundNear(sim, m, x, m.y, z);
        if (y !== null && w.skyLight(Math.floor(x), y + 1, Math.floor(z)) < 12) {
          dest = { x, y, z };
          break;
        }
      }
      return dest !== null;
    },
    canContinue: (m) => m.moving,
    start: (m) => dest && m.navigateTo(dest.x, dest.y, dest.z, 1.2),
    tick() {},
  };
}

// ---------------------------------------------------------------- combat
function melee(p: P): Goal {
  const reach = num(p, 'reach', 1.8),
    cooldown = num(p, 'cooldown', 1),
    damage = num(p, 'damage', 2);
  const element = p.element as string | undefined;
  let leapT = 0;
  return {
    canStart: (m) => !!m.target,
    tick(m, sim, dt) {
      const t = m.target!;
      const d = Math.hypot(t.x - m.x, t.z - m.z);
      const dy = Math.abs(t.y - m.y);
      m.lookAt(t.x, t.y + t.eye, t.z);
      leapT -= dt;
      if (p.leap && m.body.onGround && d > 2 && d < 5 && leapT <= 0) {
        leapT = 3;
        const l = d || 1;
        m.body.vx = ((t.x - m.x) / l) * 8;
        m.body.vz = ((t.z - m.z) / l) * 8;
        m.body.vy = 6;
      }
      if (d > reach * 0.7) {
        if (m.canSee(sim, t) && d < 6 && dy < 1.5) m.moveDirect(t.x, t.y, t.z, 1.15);
        else m.navigateTo(t.x, t.y, t.z, 1.15);
      } else m.stopMoving();
      if (d <= reach + t.body.hw && dy < 2.2 && m.attackTimer <= 0) {
        m.attackTimer = cooldown;
        attack(m, sim, t, damage, element);
      }
    },
    stop: (m) => m.stopMoving(),
  };
}

function ranged(p: P): Goal {
  const range = num(p, 'range', 16),
    min = num(p, 'min', 5),
    cooldown = num(p, 'cooldown', 1.5),
    damage = num(p, 'damage', 3),
    speed = num(p, 'speed', 25),
    burst = num(p, 'burst', 1);
  const proj = String(p.projectile ?? 'fleche');
  let strafe = 1,
    strafeT = 0,
    burstLeft = 0,
    burstT = 0;
  return {
    canStart: (m) => !!m.target && dist(m, m.target) < range * 1.4,
    canContinue: (m) => !!m.target,
    tick(m, sim, dt) {
      const t = m.target!;
      const d = dist(m, t);
      m.lookAt(t.x, t.y + t.eye, t.z);
      const see = m.canSee(sim, t);
      strafeT -= dt;
      if (strafeT <= 0) {
        strafeT = 1 + Math.random() * 2;
        strafe = Math.random() < 0.5 ? -1 : 1;
      }
      const fly = m.movement === 'fly' || m.movement === 'hover';
      if (p.melee && d < 2.6) {
        m.moveDirect(t.x, t.y, t.z, 1);
        if (m.attackTimer <= 0) {
          m.attackTimer = 1.2;
          attack(m, sim, t, damage * 1.5);
        }
        return;
      }
      if (d > range || !see) {
        if (fly) m.moveDirect(t.x, t.y + 4, t.z, 1);
        else m.navigateTo(t.x, t.y, t.z, 1);
      } else if (d < min) {
        const dx = m.x - t.x,
          dz = m.z - t.z;
        const l = Math.hypot(dx, dz) || 1;
        if (fly) m.moveDirect(m.x + (dx / l) * 4, t.y + 5, m.z + (dz / l) * 4, 1);
        else m.navigateTo(m.x + (dx / l) * 5, m.y, m.z + (dz / l) * 5, 1.1);
      } else {
        // tir en se déplaçant latéralement (plus difficile à toucher)
        const dx = t.x - m.x,
          dz = t.z - m.z;
        const l = Math.hypot(dx, dz) || 1;
        const sx = (-dz / l) * strafe,
          sz = (dx / l) * strafe;
        m.moveDirect(m.x + sx * 2, fly ? t.y + 4 : m.y, m.z + sz * 2, 0.6);
      }
      burstT -= dt;
      if (see && d < range) {
        if (burstLeft > 0 && burstT <= 0) {
          burstLeft--;
          burstT = 0.3;
          shoot(m, sim, t, proj, damage, speed);
        } else if (m.attackTimer <= 0 && burstLeft === 0) {
          m.attackTimer = cooldown;
          burstLeft = burst - 1;
          burstT = 0.3;
          shoot(m, sim, t, proj, damage, speed);
        }
      }
    },
    stop: (m) => m.stopMoving(),
  };
}

function ambush(p: P): Goal {
  const radius = num(p, 'radius', 6);
  return {
    canStart: (m) => !m.data.revealed,
    canContinue: (m) => !m.data.revealed,
    tick(m, sim) {
      m.stopMoving();
      m.target = null;
      for (const pl of sim.players) {
        if (pl.dim !== m.dim || !validPlayer(pl)) continue;
        const r = pl.sneaking ? radius * 0.5 : radius;
        if (dist(m, pl) < r || (m.lastAttacker && m.lastAttackerTime < 1)) {
          m.data.revealed = true;
          m.target = pl;
          sim.emit({ t: 'sound', id: `mob_${m.type}_attack`, x: m.x, y: m.y + 1, z: m.z });
          sim.emit({ t: 'particles', kind: p.disguise ? 'spore' : 'poussiere', x: m.x, y: m.y + 0.5, z: m.z, n: 10 });
          return;
        }
      }
    },
  };
}

function explode(p: P): Goal {
  const radius = num(p, 'radius', 3),
    damage = num(p, 'damage', 8),
    fuseT = num(p, 'fuse', 1.4);
  let fuse = 0;
  return {
    canStart: (m) => !!m.target,
    tick(m, sim, dt) {
      const t = m.target!;
      const d = dist(m, t);
      m.lookAt(t.x, t.y + 1, t.z);
      if (fuse <= 0) {
        if (d < 2.4) {
          fuse = fuseT;
          m.stopMoving();
          sim.emit({ t: 'sound', id: `mob_${m.type}_attack`, x: m.x, y: m.y, z: m.z });
        } else m.navigateTo(t.x, t.y, t.z, 1.2);
        return;
      }
      fuse -= dt;
      m.swing = 1;
      if (Math.random() < 0.3) sim.emit({ t: 'particles', kind: 'spore', x: m.x, y: m.y + 0.8, z: m.z, n: 2 });
      if (d > radius + 1.5) {
        fuse = 0;
        return;
      }
      if (fuse <= 0) {
        sim.emit({ t: 'particles', kind: p.cloud === 'poison' ? 'nuage_poison' : 'explosion', x: m.x, y: m.y + 0.5, z: m.z, n: 24, spread: radius * 0.6 });
        sim.emit({ t: 'particles', kind: 'explosion', x: m.x, y: m.y + 0.5, z: m.z, n: 12, spread: 1 });
        sim.emit({ t: 'sound', id: 'explosion', x: m.x, y: m.y, z: m.z });
        for (const e of sim.entities.near(m.dim, m.x, m.y, m.z, radius + 1)) {
          if (e === m || e.kind === 'item' || e.kind === 'projectile' || e.kind === 'grave') continue;
          const le = e as LivingEntity;
          const f = 1 - Math.min(1, dist(m, e) / (radius + 1));
          le.damage?.(damage * f * DIFF_MUL[sim.difficulty] + 1, { type: 'explosion', attacker: m, fromX: m.x, fromZ: m.z, knockback: 1.5 * f });
          if (p.cloud === 'poison') le.addEffect?.('poison', 6);
        }
        m.damage(999, { type: 'kill', ignoreArmor: true });
      }
    },
    stop: () => (fuse = 0),
  };
}

function flyAttack(p: P): Goal {
  const reach = num(p, 'reach', 1.4),
    cooldown = num(p, 'cooldown', 1.5),
    damage = num(p, 'damage', 2),
    orbit = num(p, 'orbit', 4);
  let ang = Math.random() * 6;
  let diving = false;
  return {
    canStart: (m) => !!m.target,
    tick(m, sim, dt) {
      const t = m.target!;
      m.lookAt(t.x, t.y + t.eye, t.z);
      if (!diving) {
        ang += dt * (orbit > 6 ? 0.5 : 1.3);
        m.moveDirect(t.x + Math.cos(ang) * orbit, t.y + 3 + (orbit > 6 ? 4 : 0), t.z + Math.sin(ang) * orbit, 1);
        if (m.attackTimer <= 0 && m.canSee(sim, t)) diving = true;
      } else {
        m.moveDirect(t.x, t.y + t.body.h * 0.6, t.z, 1.5);
        if (dist(m, { x: t.x, y: t.y + t.body.h * 0.5, z: t.z }) < reach + m.body.hw + 0.5) {
          attack(m, sim, t, damage, m.def.element);
          m.attackTimer = cooldown;
          diving = false;
          m.body.vy = 5;
        }
        if (m.attackTimer <= -3) diving = false;
      }
    },
  };
}

function swimAttack(p: P): Goal {
  const reach = num(p, 'reach', 1.4),
    cooldown = num(p, 'cooldown', 1),
    damage = num(p, 'damage', 3);
  return {
    canStart: (m) => !!m.target && m.body.inWater && m.target.body.inWater,
    tick(m, sim) {
      const t = m.target!;
      m.lookAt(t.x, t.y + 1, t.z);
      m.moveDirect(t.x, t.y + 0.5, t.z, 1.3);
      if (dist(m, t) < reach + 0.8 && m.attackTimer <= 0) {
        m.attackTimer = cooldown;
        attack(m, sim, t, damage, p.element as string);
      }
    },
  };
}

// ---------------------------------------------------------------- capacités spéciales
function teleport(p: P): Goal {
  const range = num(p, 'range', 12),
    cooldown = num(p, 'cooldown', 5);
  let t = cooldown;
  return {
    always: true,
    canStart: () => false,
    tick(m, sim, dt) {
      t -= dt;
      if (t > 0) return;
      const target = m.target;
      const hurt = m.lastAttacker && m.lastAttackerTime < 0.5;
      if (!hurt && !(target && dist(m, target) > 8) && Math.random() > 0.02) return;
      const c = target ?? m;
      const fly = m.movement === 'fly';
      for (let i = 0; i < 12; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = (hurt ? 6 : 3) + Math.random() * (range - 3);
        const x = c.x + Math.cos(a) * r,
          z = c.z + Math.sin(a) * r;
        const y = fly ? c.y + 3 + Math.random() * 5 : groundNear(sim, m, x, c.y, z);
        if (y === null) continue;
        sim.emit({ t: 'particles', kind: 'portail', x: m.x, y: m.y + 1, z: m.z, n: 20, spread: 0.8 });
        m.setPos(x, y, z);
        sim.emit({ t: 'particles', kind: 'portail', x, y: y + 1, z, n: 20, spread: 0.8 });
        sim.emit({ t: 'sound', id: 'rappel', x, y, z, vol: 0.6 });
        t = cooldown;
        return;
      }
    },
  };
}

function slam(p: P): Goal {
  const radius = num(p, 'radius', 5),
    cooldown = num(p, 'cooldown', 6),
    damage = num(p, 'damage', 7);
  let timer = cooldown * 0.5,
    windup = 0;
  return {
    canStart(m, _sim) {
      return !!m.target && timer <= 0 && dist(m, m.target) < radius + 2;
    },
    canContinue: () => windup > 0,
    start(m, sim) {
      windup = 0.9;
      m.stopMoving();
      m.body.vy = 6;
      sim.emit({ t: 'sound', id: `mob_${m.type}_attack`, x: m.x, y: m.y + 2, z: m.z });
    },
    tick(m, sim, dt) {
      windup -= dt;
      m.swing = 1;
      if (windup <= 0) {
        timer = cooldown;
        sim.emit({ t: 'shake', amount: 0.7 });
        sim.emit({ t: 'sound', id: 'chute_lourde', x: m.x, y: m.y, z: m.z, vol: 1 });
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * Math.PI * 2;
          sim.emit({ t: 'particles', kind: p.fire ? 'flamme' : 'poussiere', x: m.x + Math.cos(a) * radius * 0.7, y: m.y + 0.3, z: m.z + Math.sin(a) * radius * 0.7, n: 2, spread: 0.3 });
        }
        for (const pl of sim.players) {
          if (pl.dim !== m.dim || !validPlayer(pl)) continue;
          const d = Math.hypot(pl.x - m.x, pl.z - m.z);
          if (d > radius || Math.abs(pl.y - m.y) > 3) continue;
          const done = pl.damage(damage * (1 - d / (radius * 1.5)) * DIFF_MUL[sim.difficulty], { type: 'melee', attacker: m, knockback: 1.8, element: p.fire ? 'fire' : undefined });
          if (done > 0) sim.emit({ t: 'hurt', id: pl.id, amount: done });
          pl.body.vy = 8;
        }
      }
    },
    stop: () => (windup = 0),
    always: false,
  } as Goal & { always: false };
}

function charge(p: P): Goal {
  const speed = num(p, 'speed', 2.4),
    cooldown = num(p, 'cooldown', 7),
    damage = num(p, 'damage', 9);
  let timer = cooldown,
    t = 0,
    hit = false;
  let dest = { x: 0, y: 0, z: 0 };
  return {
    canStart: (m) => !!m.target && timer <= 0 && dist(m, m.target) > 4 && dist(m, m.target) < 20,
    canContinue: () => t > 0,
    start(m, sim) {
      t = 2;
      hit = false;
      const tg = m.target!;
      const dx = tg.x - m.x,
        dz = tg.z - m.z;
      const l = Math.hypot(dx, dz) || 1;
      dest = { x: tg.x + (dx / l) * 4, y: tg.y, z: tg.z + (dz / l) * 4 };
      sim.emit({ t: 'sound', id: `mob_${m.type}_idle`, x: m.x, y: m.y + 2, z: m.z, vol: 1 });
    },
    tick(m, sim, dt) {
      t -= dt;
      m.moveDirect(dest.x, dest.y, dest.z, speed);
      const tg = m.target;
      if (tg && !hit && dist(m, tg) < m.body.hw + 1.5) {
        hit = true;
        attack(m, sim, tg, damage, m.def.element, 2.5);
        sim.emit({ t: 'shake', amount: 0.5, to: tg.id });
      }
      if (Math.random() < 0.5) sim.emit({ t: 'particles', kind: 'poussiere', x: m.x, y: m.y + 0.2, z: m.z, n: 2 });
    },
    stop(m) {
      timer = cooldown;
      m.stopMoving();
    },
  };
}

/** Horloge partagée des capacités « toujours actives ». */
function cooldownAlways(cooldown: number, fn: (m: Mob, sim: Sim) => boolean): Goal {
  let t = cooldown * 0.6;
  return {
    always: true,
    canStart: () => false,
    tick(m, sim, dt) {
      t -= dt;
      if (t <= 0 && m.target && fn(m, sim)) t = cooldown;
      else if (t <= 0) t = 0.5;
    },
  };
}

function summon(p: P): Goal {
  const creature = String(p.creature),
    count = num(p, 'count', 2);
  return cooldownAlways(num(p, 'cooldown', 15), (m, sim) => {
    const near = sim.entities.count(m.dim, (e) => e.kind === 'mob' && (e as Mob).type === creature && dist(e, m) < 32);
    if (near >= count * 2) return false;
    let n = 0;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const x = m.x + Math.cos(a) * 3,
        z = m.z + Math.sin(a) * 3;
      if (sim.summon?.(creature, m.dim, x, m.y + 1, z)) n++;
    }
    if (n) {
      sim.emit({ t: 'particles', kind: 'portail', x: m.x, y: m.y + 2, z: m.z, n: 30, spread: 2 });
      sim.emit({ t: 'msg', text: tr('{name} invoque des renforts !'), args: { name: m.def.name }, color: '#ffb080' });
    }
    return n > 0;
  });
}

function barrage(p: P): Goal {
  const projectile = String(p.projectile ?? 'boule_feu'),
    count = num(p, 'count', 3),
    spread = num(p, 'spread', 0.4),
    damage = num(p, 'damage', 5),
    speed = num(p, 'speed', 22);
  return cooldownAlways(num(p, 'cooldown', 4), (m, sim) => {
    const t = m.target!;
    if (!m.canSee(sim, t) || dist(m, t) > 40) return false;
    for (let i = 0; i < count; i++) {
      const off = count === 1 ? 0 : (i / (count - 1) - 0.5) * 2 * spread;
      shoot(m, sim, t, projectile, damage, speed, off);
    }
    return true;
  });
}

function shield(p: P): Goal {
  const creature = String(p.creature ?? 'sentinelle_cristal'),
    count = num(p, 'count', 4);
  let spawned = false;
  let check = 0;
  return {
    always: true,
    canStart: () => false,
    tick(m, sim, dt) {
      if (!spawned) {
        spawned = true;
        for (let i = 0; i < count; i++) {
          const a = (i / count) * Math.PI * 2;
          const x = m.x + Math.cos(a) * 12,
            z = m.z + Math.sin(a) * 12;
          const mob = sim.spawnMob?.(creature, m.dim, x, m.y, z);
          if (mob) mob.data.guardOf = m.id;
        }
        m.shielded = true;
        sim.emit({ t: 'msg', text: tr('Des cristaux protègent le Veilleur : détruisez-les !'), color: '#d0b8ff' });
      }
      check -= dt;
      if (check > 0) return;
      check = 1;
      const alive = sim.entities.count(m.dim, (e) => e.kind === 'mob' && (e as Mob).data.guardOf === m.id && !(e as Mob).dead);
      if (m.shielded && alive === 0) {
        m.shielded = false;
        sim.emit({ t: 'msg', text: tr('Le bouclier du Veilleur se brise !'), color: '#ffe080' });
        sim.emit({ t: 'sound', id: 'casse_glass', x: m.x, y: m.y, z: m.z, vol: 1 });
      }
    },
  };
}

// ---------------------------------------------------------------- fabrique
export function createGoal(def: { type: string; [k: string]: unknown }): Goal | null {
  const p = def as P;
  switch (def.type) {
    case 'target_player':
      return targetPlayer(p);
    case 'target_attacker':
      return targetAttacker(p);
    case 'target_group':
      return targetGroup();
    case 'float':
      return float(false);
    case 'float_lava':
      return float(true);
    case 'panic':
      return panic(p);
    case 'flee_low_hp':
      return fleeLowHp(p);
    case 'avoid_player':
      return avoidPlayer(p);
    case 'follow_food':
      return followFood(p);
    case 'eat_grass':
      return eatGrass(p);
    case 'herd':
      return herd(p);
    case 'wander':
      return wander(p);
    case 'patrol':
      return wander(p, true);
    case 'look_around':
      return lookAround();
    case 'swim_wander':
      return swimWander(p);
    case 'fly_wander':
      return flyWander(p);
    case 'seek_shade':
      return seekShade();
    case 'melee':
      return melee(p);
    case 'ranged':
      return ranged(p);
    case 'ambush':
      return ambush(p);
    case 'explode':
      return explode(p);
    case 'fly_attack':
      return flyAttack(p);
    case 'swim_attack':
      return swimAttack(p);
    case 'teleport':
      return teleport(p);
    case 'slam':
      return slam(p);
    case 'charge':
      return charge(p);
    case 'summon':
      return summon(p);
    case 'barrage':
      return barrage(p);
    case 'shield':
      return shield(p);
    default:
      console.warn('Objectif d’IA inconnu :', def.type);
      return null;
  }
}
