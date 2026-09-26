// Constantes de gameplay partagées par la simulation (client, et plus tard serveur).
// Unités : 1 unité ≈ 33 cm. Les valeurs sont réglées pour un gameplay arcade maîtrisable.

export const TICK_RATE = 120;
export const TICK_DT = 1 / TICK_RATE;

export const ARENA = {
  W: 82,          // demi-largeur (axe X)
  L: 104,         // demi-longueur (axe Z) — les buts sont en ±Z
  H: 40,          // hauteur du plafond
  CHAMFER: 24,    // coins coupés à 45°
  CORNER_R: 6,    // arrondi des arêtes verticales
  FLOOR_R: 7,     // quart de lune sol/mur (permet de monter aux murs)
  CEIL_R: 7,
  GOAL_W: 20,     // demi-largeur du but
  GOAL_H: 15,
  GOAL_D: 18,
};

export const PHYS = {
  GRAVITY: 19.5,

  // Voiture
  DRIVE_MAX_SPEED: 42,
  CAR_MAX_SPEED: 69,
  THROTTLE_ACCEL: 48,        // à l'arrêt, décroît vers 0 à DRIVE_MAX_SPEED
  BRAKE_ACCEL: 105,
  COAST_DECEL: 15,
  BOOST_ACCEL: 30,
  AIR_THROTTLE_ACCEL: 2,
  BOOST_CONSUMPTION: 33.3,   // par seconde
  BOOST_START: 33,
  SUPERSONIC_RATIO: 0.93,

  SUSP_REST: 0.6,            // longueur du rayon de suspension (roue incluse)
  SUSP_FREQ: 2.8,            // Hz
  SUSP_DAMPING: 0.75,        // ratio d'amortissement
  STICKY_ACCEL: 9.5,
  LATERAL_GRIP: 11,

  JUMP_IMPULSE: 8.75,
  JUMP_HOLD_ACCEL: 43.75,
  JUMP_HOLD_TIME: 0.2,
  DOUBLE_JUMP_IMPULSE: 8.75,
  DODGE_WINDOW: 1.5,
  DASH_IMPULSE: 15,
  DASH_DURATION: 0.62,
  GROUND_DASH_DELAY: 0.09,

  AIR_PITCH: 12.5,
  AIR_YAW: 9.1,
  AIR_ROLL: 30,
  AIR_DAMP_PITCH: 2.8,
  AIR_DAMP_YAW: 1.9,
  AIR_DAMP_ROLL: 4.8,
  MAX_ANG_SPEED: 5.5,

  HULL_RESTITUTION: 0.15,
  HULL_FRICTION: 0.4,

  // Balle
  BALL_RADIUS: 2.8,
  BALL_MASS: 0.17,           // masse voiture de référence = 1
  BALL_RESTITUTION: 0.6,
  BALL_FRICTION: 0.3,
  BALL_DRAG: 0.03,
  BALL_MAX_SPEED: 180,
  BALL_MAX_SPIN: 6,

  CAR_BALL_RESTITUTION: 0.15,
  CAR_CAR_RESTITUTION: 0.35,
};

export const MATCH = {
  DEFAULT_DURATION: 300,
  COUNTDOWN: 3,
  GOAL_SLOWMO: 1.0,          // durée réelle du ralenti après un but
  GOAL_DELAY: 2.4,           // avant le replay
  REPLAY_LENGTH: 4.5,
  BIG_PAD_AMOUNT: 100,
  SMALL_PAD_AMOUNT: 12,
  BIG_PAD_RESPAWN: 10,
  SMALL_PAD_RESPAWN: 4,
  BIG_PAD_RADIUS: 4.2,
  SMALL_PAD_RADIUS: 2.8,
};

export const TEAM = [
  { id: 0, name: 'NOVA', color: 0x19e3ff, css: '#19e3ff', dark: '#06303a' },
  { id: 1, name: 'BLAZE', color: 0xff7a1a, css: '#ff7a1a', dark: '#3a1a06' },
];

// L'équipe 0 défend le but en -Z et attaque en +Z.
export const teamAttackSign = (team) => (team === 0 ? 1 : -1);
