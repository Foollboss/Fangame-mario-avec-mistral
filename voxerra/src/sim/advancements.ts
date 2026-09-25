/** Progrès (arbre de progression data-driven) : déclencheurs, attribution, notifications. */
import type { Sim, SimModule } from './sim';
import type { Player } from '../entity/player';
import type { AdvancementDef } from '../registry/types';
import { BIOMES } from '../worldgen/biomes';

export class AdvancementTracker implements SimModule {
  readonly done: Set<string>;
  private visited: Set<string>;

  constructor(private sim: Sim) {
    this.done = new Set(sim.meta.advancements ?? []);
    const extra = (sim.meta.extra ??= {});
    this.visited = new Set((extra.biomesVisited as string[]) ?? []);
    sim.itemObtainedHooks.push((p, id) => this.check(p, 'obtain', { item: id }));
    sim.triggerHooks.push((p, type, data) => this.check(p, type, data));
    (sim as unknown as { advancements: AdvancementTracker }).advancements = this;
  }

  private matches(def: AdvancementDef, type: string, data: Record<string, unknown>): boolean {
    const t = def.trigger;
    if (t.type !== type) return false;
    const items = this.sim.content.items;
    switch (type) {
      case 'obtain':
      case 'craft':
      case 'eat': {
        const id = String(data.item ?? '');
        if (t.item) return t.item === id;
        if (t.items) return (t.items as string[]).includes(id);
        if (t.tag) return items.get(id)?.tagSet.has(String(t.tag)) ?? false;
        return true;
      }
      case 'kill': {
        const c = String(data.creature ?? '');
        if (t.creature) return t.creature === c;
        if (t.category) {
          const cat = this.sim.content.creatures.get(c)?.category;
          return cat === t.category || (t.category === 'hostile' && cat === 'boss');
        }
        return true;
      }
      case 'dimension':
        return t.dim === data.dim;
      case 'biome':
        return t.biome === data.biome;
      default:
        return true;
    }
  }

  check(p: Player, type: string, data: Record<string, unknown>): void {
    for (const def of this.sim.content.advancements) {
      if (this.done.has(def.id)) continue;
      if (this.matches(def, type, data)) this.grant(p, def);
    }
  }

  grant(p: Player, def: AdvancementDef): void {
    if (this.done.has(def.id)) return;
    this.done.add(def.id);
    this.sim.meta.advancements = [...this.done];
    this.sim.emit({ t: 'toast', title: def.goal ? 'Défi relevé !' : 'Progrès accompli !', text: def.title, icon: def.icon, to: p.id });
    this.sim.emit({ t: 'msg', text: `${p.name} a obtenu le progrès [${def.title}]`, color: def.goal ? '#d08aff' : '#80ff80' });
  }

  tick(sim: Sim): void {
    if (sim.tickCount % 20 !== 0) return;
    for (const p of sim.players) {
      if (p.dead) continue;
      this.check(p, 'tick', {});
      if (p.y < 12 && p.dim === 'surface') {
        for (const def of sim.content.advancements) if (def.trigger.type === 'depth' && !this.done.has(def.id) && p.y < (def.trigger.below as number)) this.grant(p, def);
      }
      if (p.y > 150 && p.dim === 'surface') {
        for (const def of sim.content.advancements) if (def.trigger.type === 'height' && !this.done.has(def.id) && p.y > (def.trigger.above as number)) this.grant(p, def);
      }
      const w = sim.worldsByDim.get(p.dim);
      if (!w) continue;
      const b = BIOMES[w.biomeAt(Math.floor(p.x), Math.floor(p.z))];
      if (b && !this.visited.has(b.id) && w.isLoaded(Math.floor(p.x), Math.floor(p.z))) {
        this.visited.add(b.id);
        (sim.meta.extra ??= {}).biomesVisited = [...this.visited];
        this.check(p, 'biome', { biome: b.id });
        for (const def of sim.content.advancements) if (def.trigger.type === 'biomes' && !this.done.has(def.id) && this.visited.size >= (def.trigger.count as number)) this.grant(p, def);
      }
    }
  }

  visitedCount(): number {
    return this.visited.size;
  }
}
