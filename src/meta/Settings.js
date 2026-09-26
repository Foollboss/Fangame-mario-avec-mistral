export const DEFAULT_SETTINGS = {
  controls: {
    sensitivity: 1,
    invertY: false,
    leftHanded: false,
    vibration: true,
    autoAccel: false,
    buttonScale: 1,
    joystickSize: 1,
    layout: null, // custom button positions { id: { x, y } } in viewport fractions
  },
  camera: {
    distance: 11,
    height: 4.2,
    fov: 78,
    stiffness: 1,
    ballCam: true,
    assist: true,
    shake: true,
  },
  graphics: {
    quality: 'auto', // auto | low | medium | high
    autoResolved: null,
    fpsCap: 60,
    showFps: false,
  },
  audio: {
    master: 0.8,
    music: 0.55,
    sfx: 0.9,
  },
  gameplay: {
    replays: true,
    nameplates: true,
  },
};

export const SETTING_LIMITS = {
  sensitivity: [0.5, 2, 0.05],
  buttonScale: [0.7, 1.4, 0.05],
  joystickSize: [0.7, 1.4, 0.05],
  distance: [7, 16, 0.5],
  height: [2, 7, 0.1],
  fov: [60, 100, 1],
  stiffness: [0.4, 2, 0.05],
  master: [0, 1, 0.05],
  music: [0, 1, 0.05],
  sfx: [0, 1, 0.05],
};
