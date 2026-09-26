// Véhicules jouables. Les écarts de caractéristiques restent faibles (±10 %) et se compensent :
// aucun véhicule n'est strictement supérieur. Ils se débloquent en jouant, jamais en payant.

export const VEHICLES = {
  pulse: {
    id: 'pulse', name: 'Pulse', tagline: 'Équilibrée', rarity: 'common',
    half: { x: 1.3, y: 0.56, z: 1.85 },
    stats: { accel: 1.0, speed: 1.0, handling: 1.0, mass: 1.0, jump: 1.0, boost: 1.0 },
  },
  vortex: {
    id: 'vortex', name: 'Vortex', tagline: 'Rapide et légère', rarity: 'rare',
    half: { x: 1.24, y: 0.48, z: 1.92 },
    stats: { accel: 1.07, speed: 1.03, handling: 0.99, mass: 0.86, jump: 1.03, boost: 1.0 },
  },
  titan: {
    id: 'titan', name: 'Titan', tagline: 'Lourde et puissante', rarity: 'rare',
    half: { x: 1.42, y: 0.68, z: 1.95 },
    stats: { accel: 0.94, speed: 0.98, handling: 0.93, mass: 1.2, jump: 0.95, boost: 1.05 },
  },
  phantom: {
    id: 'phantom', name: 'Phantom', tagline: 'Très maniable', rarity: 'epic',
    half: { x: 1.22, y: 0.52, z: 1.8 },
    stats: { accel: 0.98, speed: 0.99, handling: 1.1, mass: 0.94, jump: 1.0, boost: 0.97 },
  },
  rift: {
    id: 'rift', name: 'Rift', tagline: 'Spécialiste aérienne', rarity: 'epic',
    half: { x: 1.26, y: 0.5, z: 1.86 },
    stats: { accel: 0.97, speed: 1.0, handling: 0.98, mass: 0.95, jump: 1.06, boost: 1.02 },
  },
  nomad: {
    id: 'nomad', name: 'Nomad', tagline: 'Tout-terrain stable', rarity: 'legendary',
    half: { x: 1.36, y: 0.62, z: 1.9 },
    stats: { accel: 0.99, speed: 1.0, handling: 0.97, mass: 1.1, jump: 0.98, boost: 1.01 },
  },
};

export const VEHICLE_IDS = Object.keys(VEHICLES);

// Valeurs 0..100 pour l'affichage des barres dans le garage.
export function vehicleStatBars(id) {
  const s = VEHICLES[id].stats;
  const bar = (v, lo, hi) => Math.round(35 + 60 * (v - lo) / (hi - lo));
  return [
    ['Accélération', bar(s.accel, 0.9, 1.1)],
    ['Vitesse', bar(s.speed, 0.95, 1.05)],
    ['Maniabilité', bar(s.handling, 0.9, 1.12)],
    ['Masse', bar(s.mass, 0.85, 1.22)],
    ['Saut', bar(s.jump, 0.93, 1.08)],
    ['Boost', bar(s.boost, 0.95, 1.06)],
  ];
}
