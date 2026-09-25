/** Registre des objets. Chaque bloc « posable » possède automatiquement un objet du même identifiant. */
import type { ItemDef } from './types';
import type { BlockRegistry } from './blocks';

export interface ItemInfo extends ItemDef {
  stackSize: number;
  blockNum: number; // 0 si l'objet ne pose pas de bloc
  tagSet: Set<string>;
  isBlock: boolean;
}

export class ItemRegistry {
  readonly byId = new Map<string, ItemInfo>();
  readonly list: ItemInfo[] = [];

  constructor(defs: ItemDef[], blocks: BlockRegistry) {
    // 1) objets déclarés explicitement
    for (const d of defs) this.add(d, blocks);
    // 2) objets implicites pour les blocs
    for (const b of blocks.list) {
      if (b.num === 0 || b.def.item === false || this.byId.has(b.id)) continue;
      this.add({ id: b.id, name: b.name, block: b.id }, blocks);
    }
  }

  private add(d: ItemDef, blocks: BlockRegistry): void {
    const existing = this.byId.get(d.id);
    const merged: ItemDef = existing ? { ...existing, ...d } : d;
    const blockId = merged.block ?? (blocks.byId.has(merged.id) && !merged.icon ? merged.id : undefined);
    const blockInfo = blockId ? blocks.byId.get(blockId) : undefined;
    const tags = new Set<string>(merged.tags ?? []);
    if (blockInfo) for (const t of blockInfo.tags) tags.add(t);
    const info: ItemInfo = {
      ...merged,
      stackSize: merged.stack ?? (merged.tool || merged.armor || merged.shield ? 1 : 64),
      blockNum: blockInfo ? blockInfo.num : 0,
      tagSet: tags,
      isBlock: !!blockInfo,
    };
    if (existing) {
      const i = this.list.indexOf(existing);
      this.list[i] = info;
    } else this.list.push(info);
    this.byId.set(d.id, info);
  }

  get(id: string): ItemInfo | undefined {
    return this.byId.get(id);
  }

  has(id: string): boolean {
    return this.byId.has(id);
  }

  name(id: string): string {
    return this.byId.get(id)?.name ?? id;
  }

  /** L'ingrédient « #tag » ou « id » correspond-il à cet objet ? */
  matches(spec: string, id: string): boolean {
    if (spec.startsWith('#')) return this.byId.get(id)?.tagSet.has(spec.slice(1)) ?? false;
    return spec === id;
  }

  /** Durée de combustion (secondes) pour le fourneau. */
  fuelTime(id: string): number {
    const it = this.byId.get(id);
    if (!it) return 0;
    if (it.fuel) return it.fuel;
    if (it.tagSet.has('log') || it.tagSet.has('planks')) return 15;
    if (it.tagSet.has('sapling')) return 5;
    if (it.id.startsWith('planches') || it.id.endsWith('_barriere') || it.id === 'atelier' || it.id === 'coffre') return 15;
    return 0;
  }
}
