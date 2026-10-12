/**
 * Carte (objet « carte ») : vue de dessus des environs, couleurs moyennes des textures
 * teintées selon le biome, relief ombré, flèche du joueur.
 */
import { BLOCKS, Tint } from '../world/blocks';
import { biomeById } from '../world/biomes';
import type { TextureAtlas } from '../render/TextureAtlas';
import type { World } from '../world/World';

export class MiniMap {
  private colors = new Map<number, [number, number, number]>();
  private timer = 0;
  private img: ImageData | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private atlas: TextureAtlas,
  ) {
    atlas.onChange(() => this.colors.clear());
  }

  private color(id: number): [number, number, number] {
    let c = this.colors.get(id);
    if (!c) {
      const d = BLOCKS[id];
      c = d ? this.atlas.average(d.tex.top) : [0, 0, 0];
      this.colors.set(id, c);
    }
    return c;
  }

  update(dt: number, world: World, px: number, pz: number, yaw: number): void {
    this.timer -= dt;
    if (this.timer > 0) return;
    this.timer = 0.5;
    const size = this.canvas.width;
    const g = this.canvas.getContext('2d');
    if (!g) return;
    if (!this.img) this.img = g.createImageData(size, size);
    const data = this.img.data;
    const half = size >> 1;
    const x0 = Math.floor(px) - half;
    const z0 = Math.floor(pz) - half;
    let prevRow: Int16Array = new Int16Array(size);
    for (let j = 0; j < size; j++) {
      const row = new Int16Array(size);
      for (let i = 0; i < size; i++) {
        const x = x0 + i;
        const z = z0 + j;
        const o = (j * size + i) * 4;
        if (!world.isLoaded(x, z)) {
          data[o] = 40;
          data[o + 1] = 34;
          data[o + 2] = 26;
          data[o + 3] = 255;
          row[i] = -1;
          continue;
        }
        let y = world.height(x, z);
        let id = world.id(x, y, z);
        // Ignorer les petites plantes
        while (y > 0 && BLOCKS[id] && !BLOCKS[id].solid && BLOCKS[id].shape !== 'liquid') {
          y--;
          id = world.id(x, y, z);
        }
        row[i] = y;
        const def = BLOCKS[id];
        let [r, gg, b] = this.color(id);
        if (def && def.tint !== Tint.None) {
          const bio = biomeById(world.biome(x, z).id);
          const t = def.tint === Tint.Grass ? bio.grass : def.tint === Tint.Foliage ? bio.foliage : def.tint === Tint.Water ? bio.water : def.tintColor;
          r = (r * ((t >> 16) & 255)) / 255;
          gg = (gg * ((t >> 8) & 255)) / 255;
          b = (b * (t & 255)) / 255;
        }
        // Ombrage du relief (comparaison avec la ligne au nord)
        const north = j > 0 ? prevRow[i] : y;
        const shade = north < 0 ? 1 : y > north ? 1.12 : y < north ? 0.82 : 1;
        data[o] = Math.min(255, r * shade);
        data[o + 1] = Math.min(255, gg * shade);
        data[o + 2] = Math.min(255, b * shade);
        data[o + 3] = 255;
      }
      prevRow = row;
    }
    g.putImageData(this.img, 0, 0);
    // Flèche du joueur
    g.save();
    g.translate(half, half);
    g.rotate(-yaw);
    g.fillStyle = '#ffffff';
    g.strokeStyle = '#000000';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(0, -5);
    g.lineTo(4, 4);
    g.lineTo(0, 2);
    g.lineTo(-4, 4);
    g.closePath();
    g.fill();
    g.stroke();
    g.restore();
  }
}
