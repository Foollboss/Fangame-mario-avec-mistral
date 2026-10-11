/**
 * Échantillonne une fonction de bruit 3D sur une grille grossière couvrant un tronçon,
 * puis interpole trilinéairement : ~60 fois moins d'appels au bruit qu'un échantillonnage par bloc.
 */
export class NoiseGrid {
  private data: Float32Array;
  private nx: number;
  private ny: number;
  private nz: number;

  constructor(
    private x0: number,
    private z0: number,
    private sxz: number,
    private sy: number,
    private yMin: number,
    private yMax: number,
    fn: (x: number, y: number, z: number) => number,
  ) {
    this.nx = Math.floor(16 / sxz) + 1;
    this.nz = this.nx;
    this.ny = Math.floor((yMax - yMin) / sy) + 1;
    this.data = new Float32Array(this.nx * this.ny * this.nz);
    let i = 0;
    for (let iy = 0; iy < this.ny; iy++)
      for (let iz = 0; iz < this.nz; iz++)
        for (let ix = 0; ix < this.nx; ix++) this.data[i++] = fn(x0 + ix * sxz, yMin + iy * sy, z0 + iz * sxz);
  }

  /** lx, lz locaux au tronçon (0..15), y absolu. */
  get(lx: number, y: number, lz: number): number {
    const fx = lx / this.sxz;
    const fz = lz / this.sxz;
    let fy = (y - this.yMin) / this.sy;
    if (fy < 0) fy = 0;
    if (fy > this.ny - 1.0001) fy = this.ny - 1.0001;
    const ix = Math.min(Math.floor(fx), this.nx - 2);
    const iz = Math.min(Math.floor(fz), this.nz - 2);
    const iy = Math.floor(fy);
    const tx = fx - ix;
    const tz = fz - iz;
    const ty = fy - iy;
    const nx = this.nx;
    const plane = this.nx * this.nz;
    const d = this.data;
    const i000 = iy * plane + iz * nx + ix;
    const i100 = i000 + 1;
    const i010 = i000 + nx;
    const i110 = i010 + 1;
    const a = d[i000] + (d[i100] - d[i000]) * tx;
    const b = d[i010] + (d[i110] - d[i010]) * tx;
    const c0 = a + (b - a) * tz;
    const j = i000 + plane;
    const a2 = d[j] + (d[j + 1] - d[j]) * tx;
    const b2 = d[j + nx] + (d[j + nx + 1] - d[j + nx]) * tx;
    const c1 = a2 + (b2 - a2) * tz;
    return c0 + (c1 - c0) * ty;
  }
}
