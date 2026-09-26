// Every vehicle spends the same "stat budget": each strength is paid for by a weakness.
// Vehicles are unlocked through progression only, never sold.
export const VEHICLES = [
  {
    id: 'pulse', name: 'Pulse', tagline: 'Équilibrée', unlockLevel: 1, rarity: 'common',
    desc: 'La référence : stable au sol comme en l’air.',
    stats: { accel: 1.0, speed: 1.0, handling: 1.0, mass: 1.0, jump: 1.0, boost: 1.0, air: 1.0 },
  },
  {
    id: 'vortex', name: 'Vortex', tagline: 'Rapide et légère', unlockLevel: 3, rarity: 'rare',
    desc: 'Démarre fort et saute haut, mais pèse peu dans les contacts.',
    stats: { accel: 1.06, speed: 1.05, handling: 1.0, mass: 0.85, jump: 1.05, boost: 1.0, air: 1.02 },
  },
  {
    id: 'titan', name: 'Titan', tagline: 'Lourde et puissante', unlockLevel: 6, rarity: 'rare',
    desc: 'Frappes lourdes et bousculades gagnées, au prix de l’agilité.',
    stats: { accel: 0.9, speed: 0.97, handling: 0.9, mass: 1.3, jump: 0.94, boost: 1.06, air: 0.92 },
  },
  {
    id: 'phantom', name: 'Phantom', tagline: 'Très maniable', unlockLevel: 10, rarity: 'epic',
    desc: 'Vire sec et pivote vite en l’air. Moins de vitesse de pointe.',
    stats: { accel: 0.96, speed: 0.95, handling: 1.15, mass: 0.92, jump: 0.98, boost: 0.95, air: 1.12 },
  },
  {
    id: 'comet', name: 'Comet', tagline: 'Spécialiste aérien', unlockLevel: 18, rarity: 'epic',
    desc: 'Saut puissant et contrôle aérien fin, plus lente au sol.',
    stats: { accel: 0.94, speed: 0.96, handling: 1.0, mass: 0.9, jump: 1.1, boost: 1.0, air: 1.1 },
  },
  {
    id: 'raptor', name: 'Raptor', tagline: 'Agressive', unlockLevel: 28, rarity: 'legendary',
    desc: 'Nerveuse et solide, pensée pour presser l’adversaire.',
    stats: { accel: 1.04, speed: 1.02, handling: 1.03, mass: 1.05, jump: 0.96, boost: 0.97, air: 0.95 },
  },
];

export const VEHICLE_BY_ID = Object.fromEntries(VEHICLES.map((v) => [v.id, v]));
export const getVehicle = (id) => VEHICLE_BY_ID[id] || VEHICLES[0];
