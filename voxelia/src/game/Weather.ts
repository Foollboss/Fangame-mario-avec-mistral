/**
 * WeatherSystem — pluie, orages (éclairs), neige, tempêtes de sable, cendres et brume.
 * Les précipitations dépendent du biome ; elles assombrissent le ciel, éteignent les feux,
 * accumulent la neige et gèlent l'eau dans les régions froides.
 */
import * as THREE from 'three';
import { B, BLOCKS, OPAQUE, WATERLOGGED } from '../world/blocks';
import type { World } from '../world/World';

export type WeatherState = 'clear' | 'rain' | 'thunder';

const RAIN_COUNT = 1400;

export class WeatherSystem {
  state: WeatherState = 'clear';
  timer = 12000;
  rain = 0;
  thunder = 0;
  fog = 0;
  enabled = true;
  readonly group = new THREE.Group();
  private rainMesh: THREE.LineSegments;
  private snowMesh: THREE.Points;
  private drops: Float32Array;
  private speeds: Float32Array;
  private kind: 'rain' | 'snow' | 'sand' | 'ash' | 'none' = 'none';
  private lightningTimer = 200;
  onLightning: ((x: number, y: number, z: number) => void) | null = null;
  private fogTimer = 0;

  constructor() {
    this.drops = new Float32Array(RAIN_COUNT * 3);
    this.speeds = new Float32Array(RAIN_COUNT);
    for (let i = 0; i < RAIN_COUNT; i++) this.speeds[i] = 0.8 + Math.random() * 0.4;
    const lg = new THREE.BufferGeometry();
    lg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(RAIN_COUNT * 6), 3).setUsage(THREE.DynamicDrawUsage));
    this.rainMesh = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x9ab0d8, transparent: true, opacity: 0.5, depthWrite: false }));
    this.rainMesh.frustumCulled = false;
    const pg = new THREE.BufferGeometry();
    pg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(RAIN_COUNT * 3), 3).setUsage(THREE.DynamicDrawUsage));
    this.snowMesh = new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.85, depthWrite: false }));
    this.snowMesh.frustumCulled = false;
    this.group.add(this.rainMesh, this.snowMesh);
  }

  load(state: WeatherState, timer: number): void {
    this.state = state;
    this.timer = timer;
    this.rain = state === 'clear' ? 0 : 1;
    this.thunder = state === 'thunder' ? 1 : 0;
  }

  set(state: WeatherState, duration = 6000): void {
    this.state = state;
    this.timer = duration;
  }

  /** Tic logique (20/s). */
  tick(world: World, playerPos: THREE.Vector3, dimension: number, cycle: boolean): void {
    if (dimension !== 0) {
      this.rain = Math.max(0, this.rain - 0.01);
      this.thunder = Math.max(0, this.thunder - 0.01);
      return;
    }
    if (cycle && --this.timer <= 0) {
      if (this.state === 'clear') {
        this.state = Math.random() < 0.25 ? 'thunder' : 'rain';
        this.timer = 3600 + Math.random() * 8000;
      } else {
        this.state = 'clear';
        this.timer = 12000 + Math.random() * 120000;
      }
    }
    const tr = this.state === 'clear' ? 0 : 1;
    const tt = this.state === 'thunder' ? 1 : 0;
    this.rain += Math.sign(tr - this.rain) * Math.min(0.005, Math.abs(tr - this.rain));
    this.thunder += Math.sign(tt - this.thunder) * Math.min(0.005, Math.abs(tt - this.thunder));
    // Brume matinale dans les biomes humides
    this.fogTimer--;
    const biome = world.biome(Math.floor(playerPos.x), Math.floor(playerPos.z));
    const humid = biome.key === 'swamp' || biome.key === 'taiga' || biome.key === 'snowy_taiga' || biome.key === 'dark_forest' || biome.key === 'enchanted_forest';
    if (this.fogTimer <= 0) {
      this.fogTimer = 2400;
      this.fogTarget = humid && Math.random() < 0.5 ? 1 : 0;
    }
    this.fog += (this.fogTarget * (humid ? 1 : 0) - this.fog) * 0.002;
    // Éclairs
    if (this.thunder > 0.8 && --this.lightningTimer <= 0) {
      this.lightningTimer = 100 + Math.floor(Math.random() * 300);
      const x = Math.floor(playerPos.x + (Math.random() - 0.5) * 120);
      const z = Math.floor(playerPos.z + (Math.random() - 0.5) * 120);
      if (world.isLoaded(x, z)) this.onLightning?.(x + 0.5, world.height(x, z) + 1, z + 0.5);
    }
    // Neige et gel
    if (this.rain > 0.5 && Math.random() < 0.6) {
      for (let i = 0; i < 4; i++) {
        const x = Math.floor(playerPos.x + (Math.random() - 0.5) * 64);
        const z = Math.floor(playerPos.z + (Math.random() - 0.5) * 64);
        if (!world.isLoaded(x, z)) continue;
        const b = world.biome(x, z);
        if (b.precip !== 'snow') continue;
        const y = world.height(x, z);
        const id = world.id(x, y, z);
        if (WATERLOGGED[id] && id === B.water && world.meta(x, y, z) === 0) world.set(x, y, z, B.ice, 0, 'tick');
        else if (id === B.snow_layer) {
          const m = world.meta(x, y, z);
          if (m < 3) world.set(x, y, z, B.snow_layer, m + 1, 'tick');
        } else if (OPAQUE[id] && world.id(x, y + 1, z) === 0 && BLOCKS[id]?.shape === 'cube' && id !== B.ice) world.set(x, y + 1, z, B.snow_layer, 0, 'tick');
      }
    }
  }

  private fogTarget = 0;

  /** Animation des précipitations autour de la caméra. */
  frame(dt: number, world: World, cam: THREE.Vector3, dimension: number): void {
    const biome = world.biome(Math.floor(cam.x), Math.floor(cam.z));
    let kind: typeof this.kind = this.rain > 0.02 ? (biome.precip === 'snow' ? 'snow' : biome.precip === 'none' ? 'none' : biome.precip === 'sand' ? 'sand' : 'rain') : 'none';
    if (biome.precip === 'ash' && dimension === 0) kind = this.rain > 0.02 ? 'ash' : 'none';
    if (dimension === 1) kind = 'ash';
    if (kind !== this.kind) {
      this.kind = kind;
      for (let i = 0; i < RAIN_COUNT; i++) this.respawn(i, cam, true);
    }
    this.rainMesh.visible = kind === 'rain';
    this.snowMesh.visible = kind === 'snow' || kind === 'sand' || kind === 'ash';
    if (kind === 'none') return;
    const intensity = dimension === 1 ? 0.35 : this.rain;
    const active = Math.floor(RAIN_COUNT * intensity);
    const mat = this.snowMesh.material as THREE.PointsMaterial;
    if (kind === 'sand') mat.color.setHex(0xd8c090);
    else if (kind === 'ash') mat.color.setHex(0x8a8682);
    else mat.color.setHex(0xffffff);
    mat.size = kind === 'snow' ? 0.12 : 0.07;
    const d = this.drops;
    const lp = this.rainMesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    const pp = this.snowMesh.geometry.getAttribute('position') as THREE.BufferAttribute;
    const la = lp.array as Float32Array;
    const pa = pp.array as Float32Array;
    const fall = kind === 'rain' ? 22 : kind === 'snow' ? 2.5 : kind === 'ash' ? 1.2 : 1;
    const wind = kind === 'sand' ? 14 : this.thunder * 4 + (kind === 'ash' ? 0.6 : 0.3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      const o = i * 3;
      if (i >= active) {
        la[i * 6 + 1] = la[i * 6 + 4] = -1000;
        pa[o + 1] = -1000;
        continue;
      }
      d[o] += wind * dt * this.speeds[i];
      d[o + 1] -= fall * dt * this.speeds[i] * (kind === 'sand' ? 0.1 : 1);
      if (kind === 'snow' || kind === 'ash') d[o] += Math.sin(d[o + 1] * 0.8 + i) * dt * 0.5;
      const ground = world.height(Math.floor(d[o]), Math.floor(d[o + 2]));
      const dx = d[o] - cam.x;
      const dz = d[o + 2] - cam.z;
      if (d[o + 1] < ground + 1 || d[o + 1] < cam.y - 12 || dx * dx + dz * dz > 400) this.respawn(i, cam, false);
      if (kind === 'rain') {
        la[i * 6] = d[o];
        la[i * 6 + 1] = d[o + 1];
        la[i * 6 + 2] = d[o + 2];
        la[i * 6 + 3] = d[o] - wind * 0.02;
        la[i * 6 + 4] = d[o + 1] + 0.7;
        la[i * 6 + 5] = d[o + 2];
      } else {
        pa[o] = d[o];
        pa[o + 1] = d[o + 1];
        pa[o + 2] = d[o + 2];
      }
    }
    lp.needsUpdate = true;
    pp.needsUpdate = true;
  }

  private respawn(i: number, cam: THREE.Vector3, initial: boolean): void {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * 18;
    const o = i * 3;
    this.drops[o] = cam.x + Math.cos(a) * r;
    this.drops[o + 2] = cam.z + Math.sin(a) * r;
    this.drops[o + 1] = cam.y + (initial ? Math.random() * 24 - 8 : 12 + Math.random() * 6);
  }

  /** Le joueur est-il abrité de la pluie ? */
  sheltered(world: World, pos: THREE.Vector3): boolean {
    return world.height(Math.floor(pos.x), Math.floor(pos.z)) > pos.y + 1.6;
  }
}
