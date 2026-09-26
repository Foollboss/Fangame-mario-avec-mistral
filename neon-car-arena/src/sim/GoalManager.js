import { Vector3 } from 'three';

const _d = new Vector3();

// Détection des buts et onde de choc de l'explosion.
export const GoalManager = {
  // Retourne l'équipe qui marque (0 ou 1) ou -1.
  detect(sim) {
    const side = sim.arena.goalSide(sim.ball.pos, sim.ball.radius);
    if (side === 0) return -1;
    return side > 0 ? 0 : 1; // l'équipe 0 attaque +Z
  },

  explode(sim, strength = 60, radius = 30) {
    for (const car of sim.cars) {
      _d.subVectors(car.pos, sim.ball.pos);
      const dist = _d.length();
      if (dist > radius || dist < 1e-3) continue;
      const k = (1 - dist / radius) * strength;
      _d.multiplyScalar(1 / dist);
      _d.y = Math.max(_d.y, 0.35);
      car.vel.addScaledVector(_d.normalize(), k);
      const r = sim.rng;
      car.angVel.set((r.next() - 0.5) * 6, (r.next() - 0.5) * 4, (r.next() - 0.5) * 6);
    }
  },
};
