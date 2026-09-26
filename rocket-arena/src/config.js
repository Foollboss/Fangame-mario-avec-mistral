// Physical constants. 1 world unit = 100 Rocket League "unreal units".
export const PHYS = {
  dt: 1 / 120,
  gravity: -6.5,

  ballRadius: 0.9125,
  ballMass: 30,
  ballMaxSpeed: 60,
  ballMaxAngVel: 6,
  ballDrag: 0.0305,
  ballRestitution: 0.6,
  ballFriction: 0.35,

  carMass: 180,
  carMaxSpeed: 23,
  supersonic: 22,
  throttleMaxSpeed: 14.1,
  boostAccel: 9.9167,
  boostPerSecond: 33.33,
  brakeAccel: 35,
  coastAccel: 5.25,
  airThrottleAccel: 0.6667,
  jumpImpulse: 2.9167,
  jumpHoldAccel: 14.583,
  jumpHoldTime: 0.2,
  stickyAccel: 3.25,
  doubleJumpWindow: 1.25,
  dodgeImpulse: 5.0,
  flipTime: 0.65,
  maxAngVel: 5.5,
  rideHeight: 0.17,

  airPitchAccel: 12.46,
  airYawAccel: 9.11,
  airRollAccel: 38.34,
  airPitchDamp: 2.798,
  airYawDamp: 1.886,
  airRollDamp: 4.472,

  demoRespawnTime: 3,
  startBoost: 33.3,
};

// Hitboxes are half extents (forward, up, side).
export const BODIES = {
  octane: { name: 'Octane', hx: 0.59, hy: 0.18, hz: 0.42 },
  dominus: { name: 'Dominus', hx: 0.64, hy: 0.155, hz: 0.42 },
  breakout: { name: 'Breakout', hx: 0.66, hy: 0.15, hz: 0.40 },
  merc: { name: 'Merc', hx: 0.6, hy: 0.22, hz: 0.43 },
};

export const TEAM_COLORS = [
  { name: 'BLEU', main: 0x1f6bff, light: 0x5aa0ff, dark: 0x0b2d7a, css: '#2f7bff' },
  { name: 'ORANGE', main: 0xff7a14, light: 0xffae5c, dark: 0x7a2c05, css: '#ff8a1f' },
];

export const DIFFICULTIES = {
  rookie: { label: 'Recrue', reaction: 0.28, aim: 0.55, boostUse: 0.35, aerial: 0, flips: 0.3, speed: 0.85 },
  pro: { label: 'Pro', reaction: 0.14, aim: 0.8, boostUse: 0.8, aerial: 0.5, flips: 0.8, speed: 0.95 },
  allstar: { label: 'All-Star', reaction: 0.05, aim: 0.95, boostUse: 1, aerial: 1, flips: 1, speed: 1 },
};

export const BOT_NAMES = [
  'Viper', 'Hound', 'Sultan', 'Jester', 'Bandit', 'Gerwin', 'Poncho', 'Rainmaker', 'Merlin', 'Samara',
  'Sundown', 'Tex', 'Casper', 'Foamer', 'Stinger', 'Shepard', 'Boomer', 'Raja', 'Squall', 'Myrtle',
];
