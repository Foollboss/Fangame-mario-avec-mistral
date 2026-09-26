// Global gameplay constants. Units are "arena meters"; time in seconds.
// Team 0 (NOVA) defends the goal at -Z, team 1 (EMBER) defends +Z.

export const ARENA = {
  halfWidth: 50,      // X
  halfLength: 72,     // Z, goal line position
  height: 38,         // ceiling
  corner: 16,         // 45° chamfer size in each XZ corner
  goalHalfWidth: 14,
  goalHeight: 11,
  goalDepth: 11,
};

export const PHYS = {
  fixedDt: 1 / 120,
  gravity: 28,
};

export const BALL = {
  radius: 3,
  mass: 30,
  restitution: 0.6,
  friction: 0.22,
  rollingDrag: 0.18,
  airDrag: 0.03,
  maxSpeed: 110,
};

export const CAR = {
  halfExtents: { x: 1.3, y: 0.62, z: 2.2 },
  rideHeight: 1.05,        // hitbox centre height when on wheels
  baseMass: 180,
  maxThrottleSpeed: 36,
  maxSpeed: 60,            // absolute cap (boost)
  supersonic: 52,
  throttleAccel: 42,
  reverseAccel: 26,
  reverseMax: 20,
  brakeDecel: 62,
  coastDecel: 9,
  boostAccel: 32,
  airBoostAccel: 30,
  grip: 10,
  turnRate: 2.3,
  jumpImpulse: 11,
  jumpHoldAccel: 28,
  jumpHoldTime: 0.18,
  doubleJumpImpulse: 10.5,
  dodgeImpulse: 15,
  dodgeDuration: 0.55,
  secondJumpWindow: 1.35,
  airPitchRate: 5.2,
  airYawRate: 4.2,
  airResponse: 7,
  capsuleOffset: 1.35,
  capsuleRadius: 1.3,
  boostPerSecond: 33.3,
};

export const TEAM = [
  { name: 'NOVA', color: 0x19e6ff, css: '#19e6ff', dark: 0x0a4c66 },
  { name: 'EMBER', color: 0xff2f7d, css: '#ff2f7d', dark: 0x661233 },
];

export const MATCH = {
  countdown: 3,
  goalSlowmo: 1.4,        // real seconds of slow motion after a goal
  goalPause: 2.2,         // total real seconds before replay/kickoff
  slowmoScale: 0.3,
  respawnTime: 3,
};

// Opposing goal direction for a team: team 0 attacks +Z.
export const attackSign = (team) => (team === 0 ? 1 : -1);
