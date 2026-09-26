// Les trois arènes partagent les mêmes dimensions (équité) mais ont chacune leur ambiance.
export const ARENAS = {
  neon_dome: {
    id: 'neon_dome', name: 'Neon Dome', desc: 'Dôme nocturne, grilles néon et foule électrique',
    sky: [0x05010f, 0x1a0636, 0x3a0a5c], fog: 0x12052a, fogDensity: 0.0026,
    floorA: '#161a44', floorB: '#1e2358', line: '#7af3ff', accent: '#ff3dd8',
    wall: 0x6b3dff, wallGlow: 0xff3dd8, lowerWall: 0x151036,
    hemi: [0xb8b0ff, 0x2a1f55, 2.6], sun: [0xe0d8ff, 2.2, [40, 90, 20]],
    crowd: [0xff3dd8, 0x19e3ff, 0x9d6bff, 0xffffff, 0xff7a1a], decor: 'dome',
  },
  desert_reactor: {
    id: 'desert_reactor', name: 'Desert Reactor', desc: 'Réacteur à fusion au cœur des dunes au coucher du soleil',
    sky: [0x2a0f1c, 0xb4442a, 0xffb36b], fog: 0x9c4a2e, fogDensity: 0.0022,
    floorA: '#4a2e1e', floorB: '#5a3822', line: '#ffd08a', accent: '#ff5a1f',
    wall: 0xff8a3d, wallGlow: 0xffd24a, lowerWall: 0x3a2014,
    hemi: [0xffe0c0, 0x5a3020, 2.4], sun: [0xffc090, 2.6, [-80, 45, -30]],
    crowd: [0xffd24a, 0xff5a1f, 0xfff0d0, 0x8a3a1a, 0x19e3ff], decor: 'reactor',
  },
  sky_stadium: {
    id: 'sky_stadium', name: 'Sky Stadium', desc: 'Stade flottant au-dessus des nuages, en plein jour',
    sky: [0x3f8fe0, 0x86c3f5, 0xe6f4ff], fog: 0xbfe0ff, fogDensity: 0.0018,
    floorA: '#1d5a3e', floorB: '#22694a', line: '#e9fff6', accent: '#4cf0c0',
    wall: 0x9fe8ff, wallGlow: 0xffffff, lowerWall: 0x1b3a52,
    hemi: [0xeef8ff, 0x4a7a5a, 2.4], sun: [0xfff6e0, 3, [60, 120, 40]],
    crowd: [0xffffff, 0x19e3ff, 0xff7a1a, 0x4cf0c0, 0xffd24a], decor: 'sky',
  },
};
export const ARENA_IDS = Object.keys(ARENAS);
