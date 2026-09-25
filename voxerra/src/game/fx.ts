/** Traduction des évènements de simulation en sons, particules et messages. */
import type { ParticleSystem } from '../render/particles';
import type { Content } from '../registry/content';

export class ParticleFx {
  private layers: Record<string, number> = {};

  constructor(
    private ps: ParticleSystem,
    private content: Content,
  ) {
    for (const n of ['fumee', 'flamme', 'etincelle', 'bulle', 'coeur', 'etoile', 'goutte', 'flocon', 'poussiere', 'portail', 'spore', 'cendre', 'braise', 'givre', 'poison']) this.layers[n] = content.blocks.textureLayer('fx_' + n);
  }

  private l(n: string): number {
    return this.layers[n] ?? 0;
  }

  emit(kind: string, x: number, y: number, z: number, n = 6, spread = 0.4, color?: [number, number, number]): void {
    const ps = this.ps;
    const r = () => (Math.random() - 0.5) * 2 * spread;
    const c = color ?? [1, 1, 1];
    switch (kind) {
      case 'explosion':
        for (let i = 0; i < n; i++) {
          ps.spawn({ x: x + r(), y: y + r(), z: z + r(), vx: r() * 3, vy: Math.random() * 3, vz: r() * 3, life: 0.8 + Math.random() * 0.6, size: 0.5, sizeEnd: 1.2, layer: this.l('fumee'), r: 0.6, g: 0.6, b: 0.6, drag: 0.4, rotSpeed: 1 });
          if (i % 2 === 0) ps.spawn({ x: x + r() * 0.5, y: y + r() * 0.5, z: z + r() * 0.5, vx: r() * 4, vy: r() * 4, vz: r() * 4, life: 0.4, size: 0.4, sizeEnd: 0.1, layer: this.l('flamme'), emissive: true, drag: 0.3 });
        }
        break;
      case 'nuage_poison':
        for (let i = 0; i < n; i++) ps.spawn({ x: x + r(), y: y + r() * 0.5, z: z + r(), vx: r() * 0.5, vy: 0.3, vz: r() * 0.5, life: 2 + Math.random(), size: 0.6, sizeEnd: 1.4, layer: this.l('poison'), a: 0.7, drag: 0.5, rotSpeed: 0.5 });
        break;
      case 'crit':
        for (let i = 0; i < n; i++) ps.spawn({ x: x + r(), y: y + r(), z: z + r(), vx: r() * 4, vy: Math.random() * 3, vz: r() * 4, life: 0.5, size: 0.15, layer: this.l('etoile'), r: 1, g: 0.95, b: 0.6, gravity: 8, emissive: true });
        break;
      case 'balayage':
        for (let i = 0; i < 8; i++) {
          const a = (i / 8) * Math.PI - Math.PI / 2;
          ps.spawn({ x: x + Math.cos(a) * 1.2, y, z: z + Math.sin(a) * 1.2, vy: 0.2, life: 0.3, size: 0.3, sizeEnd: 0.05, layer: this.l('poussiere'), emissive: true });
        }
        break;
      case 'coeur':
        for (let i = 0; i < n; i++) ps.spawn({ x: x + r(), y: y + Math.random() * 0.5, z: z + r(), vy: 0.8, life: 1.2, size: 0.25, layer: this.l('coeur'), emissive: true, drag: 0.8 });
        break;
      case 'eclair':
        for (let i = 0; i < n; i++) ps.spawn({ x: x + r(), y: y + Math.random() * 6, z: z + r(), vx: r(), vy: r() * 2, vz: r(), life: 0.4, size: 0.3, layer: this.l('etincelle'), r: 0.8, g: 0.9, b: 1, emissive: true });
        break;
      case 'eclaboussure':
        for (let i = 0; i < n; i++) ps.spawn({ x: x + r(), y, z: z + r(), vx: r() * 1.5, vy: 1.5 + Math.random() * 2, vz: r() * 1.5, life: 0.5, size: 0.08, layer: this.l('goutte'), gravity: 18, collide: true, r: 0.7, g: 0.8, b: 1 });
        break;
      case 'mort':
        for (let i = 0; i < n; i++) ps.spawn({ x: x + r(), y: y + Math.random() * 1.2, z: z + r(), vx: r() * 0.8, vy: 0.5 + Math.random(), vz: r() * 0.8, life: 1, size: 0.3, sizeEnd: 0.6, layer: this.l('fumee'), r: 0.85, g: 0.85, b: 0.85, drag: 0.5 });
        break;
      default: {
        const map: Record<string, { layer: string; vy: number; life: number; size: number; grav: number; emissive?: boolean }> = {
          fumee: { layer: 'fumee', vy: 0.8, life: 1.2, size: 0.25, grav: 0 },
          flamme: { layer: 'flamme', vy: 0.4, life: 0.5, size: 0.18, grav: 0, emissive: true },
          etincelle: { layer: 'etincelle', vy: 0.5, life: 0.5, size: 0.12, grav: 2, emissive: true },
          bulle: { layer: 'bulle', vy: 1.2, life: 0.8, size: 0.12, grav: 0 },
          poussiere: { layer: 'poussiere', vy: 0.3, life: 0.6, size: 0.18, grav: 0 },
          portail: { layer: 'portail', vy: 0.6, life: 1, size: 0.14, grav: 0, emissive: true },
          spore: { layer: 'spore', vy: 0.2, life: 1, size: 0.14, grav: 0 },
          cendre: { layer: 'cendre', vy: -0.3, life: 2, size: 0.1, grav: 0 },
          braise: { layer: 'braise', vy: 0.6, life: 0.8, size: 0.1, grav: 0, emissive: true },
          givre: { layer: 'givre', vy: 0.2, life: 0.8, size: 0.14, grav: 1, emissive: true },
          poison: { layer: 'poison', vy: 0.3, life: 0.8, size: 0.14, grav: 0 },
          etoile: { layer: 'etoile', vy: 0.3, life: 0.8, size: 0.14, grav: 0, emissive: true },
        };
        const m = map[kind] ?? map.poussiere;
        for (let i = 0; i < n; i++) ps.spawn({ x: x + r(), y: y + r(), z: z + r(), vx: r() * 0.6, vy: m.vy * (0.6 + Math.random() * 0.8), vz: r() * 0.6, life: m.life * (0.7 + Math.random() * 0.6), size: m.size, sizeEnd: m.size * 0.4, layer: this.l(m.layer), gravity: m.grav, emissive: m.emissive, r: c[0], g: c[1], b: c[2], drag: 0.6 });
      }
    }
  }
}
