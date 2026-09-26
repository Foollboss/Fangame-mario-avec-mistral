import { VEHICLES, getVehicle } from '../game/Vehicles.js';

const STAT_LABELS = [
  ['speed', 'Vitesse'],
  ['accel', 'Accélération'],
  ['handling', 'Maniabilité'],
  ['mass', 'Masse'],
  ['jump', 'Saut'],
  ['boost', 'Boost'],
  ['air', 'Contrôle aérien'],
];

// Vehicle selection and readable stat bars for the garage.
export class GarageSystem {
  constructor(customization) {
    this.custom = customization;
  }

  vehicles() {
    return VEHICLES.map((v) => ({ ...v, unlocked: this.custom.isUnlocked(v.id) }));
  }

  current() {
    return getVehicle(this.custom.data.equipped.car);
  }

  // Maps multipliers (≈0.85–1.3) onto 0–100 bars around a 60% baseline.
  statBars(id) {
    const v = getVehicle(id);
    return STAT_LABELS.map(([k, label]) => ({ key: k, label, value: Math.round(Math.max(8, Math.min(100, 60 + (v.stats[k] - 1) * 200))) }));
  }
}
