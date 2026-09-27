// Boost pads: 6 large (full refill) and 24 small (+12). Layout is point-symmetric for fairness.
const BIG = [[40, 0], [-40, 0], [38, 58], [-38, 58], [38, -58], [-38, -58]];
const SMALL_HALF = [
  [14, 62], [-14, 62],
  [0, 46], [30, 46], [-30, 46],
  [12, 28], [-12, 28], [40, 28], [-40, 28],
  [24, 12], [-24, 12],
  [26, 0],
];

export const PAD_LAYOUT = [
  ...BIG.map(([x, z]) => ({ x, z, big: true })),
  ...SMALL_HALF.map(([x, z]) => ({ x, z, big: false })),
  ...SMALL_HALF.filter(([, z]) => z !== 0).map(([x, z]) => ({ x: -x, z: -z, big: false })),
  { x: -26, z: 0, big: false },
];

export class BoostSystem {
  constructor(events) {
    this.events = events;
    this.pads = PAD_LAYOUT.map((p, i) => ({ ...p, id: i, active: true, timer: 0 }));
  }

  reset() {
    for (const p of this.pads) {
      p.active = true;
      p.timer = 0;
    }
  }

  update(dt, cars) {
    for (const pad of this.pads) {
      if (!pad.active) {
        pad.timer -= dt;
        if (pad.timer <= 0) pad.active = true;
        continue;
      }
      const r = pad.big ? 3.4 : 2.4;
      for (const car of cars) {
        if (car.demolished || car.boost >= 100) continue;
        const p = car.physics.pos;
        if (p.y > 4) continue;
        const dx = p.x - pad.x;
        const dz = p.z - pad.z;
        if (dx * dx + dz * dz > r * r) continue;
        car.boost = Math.min(100, car.boost + (pad.big ? 100 : 12));
        pad.active = false;
        pad.timer = pad.big ? 10 : 4;
        this.events.emit('boostPickup', { car, pad });
        break;
      }
    }
  }
}
