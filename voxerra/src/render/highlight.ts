/** Contour du bloc visé et fissures de minage progressives. */
import * as THREE from 'three';
import type { Box } from '../world/shapes';

function crackTexture(stage: number): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 16;
  const g = c.getContext('2d')!;
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const lines = 2 + stage * 2;
  g.fillStyle = 'rgba(0,0,0,0.75)';
  for (let l = 0; l < lines; l++) {
    let x = 8 + Math.floor((rnd() - 0.5) * 4),
      y = 8 + Math.floor((rnd() - 0.5) * 4);
    const len = 3 + stage;
    const dx = rnd() < 0.5 ? 1 : -1,
      dy = rnd() < 0.5 ? 1 : -1;
    for (let k = 0; k < len; k++) {
      g.fillRect((x + 16) % 16, (y + 16) % 16, 1, 1);
      if (rnd() < 0.6) x += dx;
      else y += dy;
      if (rnd() < 0.15) x -= dx;
    }
  }
  const t = new THREE.CanvasTexture(c);
  t.magFilter = THREE.NearestFilter;
  t.minFilter = THREE.NearestFilter;
  return t;
}

export class BlockHighlight {
  readonly group = new THREE.Group();
  private lines: THREE.LineSegments;
  private crack: THREE.Mesh;
  private crackMat: THREE.MeshBasicMaterial;
  private stages: THREE.CanvasTexture[] = [];

  constructor() {
    const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
    this.lines = new THREE.LineSegments(geo, new THREE.LineBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.55 }));
    for (let i = 0; i < 10; i++) this.stages.push(crackTexture(i));
    this.crackMat = new THREE.MeshBasicMaterial({ map: this.stages[0], transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2, fog: false });
    this.crack = new THREE.Mesh(new THREE.BoxGeometry(1.002, 1.002, 1.002), this.crackMat);
    this.crack.renderOrder = 3;
    this.group.add(this.lines, this.crack);
    this.group.visible = false;
  }

  set(x: number, y: number, z: number, boxes: Box[] | null, progress: number): void {
    if (!boxes || boxes.length === 0) {
      this.group.visible = false;
      return;
    }
    let x0 = 16,
      y0 = 16,
      z0 = 16,
      x1 = 0,
      y1 = 0,
      z1 = 0;
    for (const b of boxes) {
      x0 = Math.min(x0, b[0]);
      y0 = Math.min(y0, b[1]);
      z0 = Math.min(z0, b[2]);
      x1 = Math.max(x1, b[3]);
      y1 = Math.max(y1, b[4]);
      z1 = Math.max(z1, b[5]);
    }
    const sx = (x1 - x0) / 16 + 0.004,
      sy = (y1 - y0) / 16 + 0.004,
      sz = (z1 - z0) / 16 + 0.004;
    this.group.visible = true;
    this.lines.position.set(x + (x0 + x1) / 32, y + (y0 + y1) / 32, z + (z0 + z1) / 32);
    this.lines.scale.set(sx, sy, sz);
    if (progress > 0) {
      this.crack.visible = true;
      this.crack.position.copy(this.lines.position);
      this.crack.scale.set(sx, sy, sz);
      const st = Math.min(9, Math.floor(progress * 10));
      if (this.crackMat.map !== this.stages[st]) {
        this.crackMat.map = this.stages[st];
        this.crackMat.needsUpdate = true;
      }
    } else this.crack.visible = false;
  }
}
