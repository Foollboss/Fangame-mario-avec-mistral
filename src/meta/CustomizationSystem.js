import { ITEMS, CATEGORIES, getItem, RARITY } from './Catalog.js';

// Equip / preview cosmetics. Purely visual: nothing here reaches the physics.
export class CustomizationSystem {
  constructor(save) {
    this.save = save;
    this.categories = CATEGORIES;
  }

  get data() {
    return this.save.data;
  }

  itemsFor(cat) {
    const order = { common: 0, rare: 1, epic: 2, legendary: 3 };
    return ITEMS.filter((i) => i.cat === cat).sort((a, b) => (a.level || 99) - (b.level || 99) || order[a.rarity] - order[b.rarity]);
  }

  isUnlocked(id) {
    return this.data.unlocked.includes(id);
  }

  isNew(id) {
    return this.data.newItems.includes(id);
  }

  markSeen(id) {
    const i = this.data.newItems.indexOf(id);
    if (i >= 0) {
      this.data.newItems.splice(i, 1);
      this.save.save();
    }
  }

  newCount(cat) {
    return this.data.newItems.filter((id) => getItem(id)?.cat === cat).length;
  }

  equipped() {
    return { ...this.data.equipped };
  }

  equip(id) {
    const item = getItem(id);
    if (!item || !this.isUnlocked(id)) return false;
    this.data.equipped[item.cat] = id;
    this.markSeen(id);
    this.save.save();
    return true;
  }

  rarityOf(id) {
    return RARITY[getItem(id)?.rarity] || RARITY.common;
  }

  titleText() {
    return getItem(this.data.equipped.title)?.name || 'Recrue';
  }
}
