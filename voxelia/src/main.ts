// Point d'entrée temporaire : rendu d'un monde pour vérifier le moteur.
import { Renderer } from './render/Renderer';
import { WorkerPool } from './world/WorkerPool';
import { ChunkManager } from './world/ChunkManager';
import { World } from './world/World';
import * as THREE from 'three';

const canvas = document.getElementById('game') as HTMLCanvasElement;
const r = new Renderer(canvas);
const pool = new WorkerPool('world.worker.js');
const seed = Number(new URLSearchParams(location.search).get('seed') ?? 12345);
pool.broadcast({ type: 'init', opts: { seed, template: 'default', caves: true, structures: true, fantasyBiomes: true, drop3: true, dimensions: true }, textures: r.atlas.info });
const cm = new ChunkManager(pool, r.materials, { load: async () => null });
cm.renderDistance = Number(new URLSearchParams(location.search).get('rd') ?? 6);
r.options.renderDistance = cm.renderDistance;
r.terrain.add(cm.root);
const world = new World(cm);
const cam = r.camera;
cam.position.set(0, 110, 0);
cam.rotation.set(-0.35, 0.6, 0);
let time = 3000;
const state = { time, day: 0, rain: 0, thunder: 0, dimension: 0, biomeSky: new THREE.Color(0x78a7ff), biomeFog: new THREE.Color(0xc0d8ff), underwater: false };
(window as any).__dbg = { r, cm, world, cam, state };
let last = performance.now();
function frame(now: number) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  cm.update(cam.position.x, cam.position.z, cam.position);
  r.update(dt, state);
  r.render();
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
window.addEventListener('resize', () => r.resize());
