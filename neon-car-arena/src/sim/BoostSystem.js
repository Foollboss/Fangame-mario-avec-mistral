import { ARENA, MATCH } from '../config/GameConfig.js';

// Capsules de boost : 6 grandes (100 %) et 28 petites (+12).
export const BoostSystem = {
  createPads() {
    const { W, L } = ARENA;
    const pads = [];
    const add = (x, z, big) => pads.push({ x, z, big, active: true, timer: 0 });
    for (const sx of [-1, 1]) {
      add(sx * 0.9 * W, 0, true);
      for (const sz of [-1, 1]) add(sx * 0.74 * W, sz * 0.84 * L, true);
    }
    const small = [
      [0.2, 0.9], [0.5, 0.7], [0, 0.7], [0.25, 0.45], [0.75, 0.45], [0, 0.45], [0, 0.2], [0.55, 0.2],
    ];
    for (const [fx, fz] of small) {
      for (const sz of [-1, 1]) {
        if (fx === 0) add(0, sz * fz * L, false);
        else for (const sx of [-1, 1]) add(sx * fx * W, sz * fz * L, false);
      }
    }
    for (const sx of [-1, 1]) add(sx * 0.4 * W, 0, false);
    return pads;
  },

  update(pads, cars, dt, events) {
    for (const pad of pads) {
      if (!pad.active) {
        pad.timer -= dt;
        if (pad.timer <= 0) pad.active = true;
        continue;
      }
      const r = pad.big ? MATCH.BIG_PAD_RADIUS : MATCH.SMALL_PAD_RADIUS;
      for (const car of cars) {
        if (car.pos.y > 5 || car.boost >= 100) continue;
        const dx = car.pos.x - pad.x, dz = car.pos.z - pad.z;
        if (dx * dx + dz * dz > r * r) continue;
        car.boost = Math.min(100, car.boost + (pad.big ? MATCH.BIG_PAD_AMOUNT : MATCH.SMALL_PAD_AMOUNT));
        pad.active = false;
        pad.timer = pad.big ? MATCH.BIG_PAD_RESPAWN : MATCH.SMALL_PAD_RESPAWN;
        events?.emit('boostPickup', { car, pad });
        break;
      }
    }
  },

  reset(pads) { for (const p of pads) { p.active = true; p.timer = 0; } },
};
