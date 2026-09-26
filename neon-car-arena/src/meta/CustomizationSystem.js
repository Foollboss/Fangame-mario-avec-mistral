import { ITEMS, ITEM_BY_ID, CATEGORIES } from '../config/ItemCatalog.js';

// Équipement cosmétique du joueur. Aucun objet ne modifie la simulation.
export class CustomizationSystem {
  constructor(save) { this.save = save; }

  get loadout() { return this.save.data.loadout; }

  isUnlocked(id) { return this.save.data.unlocked.includes(id); }

  itemsOf(cat) {
    return ITEMS.filter((i) => i.cat === cat).sort((a, b) => a.level - b.level);
  }

  equip(id) {
    const it = ITEM_BY_ID[id];
    if (!it || !this.isUnlocked(id)) return false;
    this.save.data.loadout[it.cat] = id;
    this.save.data.newItems = this.save.data.newItems.filter((n) => n !== id);
    this.save.save();
    return true;
  }

  isNew(id) { return this.save.data.newItems.includes(id); }
  newCount() { return this.save.data.newItems.length; }
  categories() { return CATEGORIES; }
}
