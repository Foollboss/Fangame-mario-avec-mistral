import { VEHICLES } from '../config/VehicleCatalog.js';
import { ITEM_BY_ID } from '../config/ItemCatalog.js';

// Véhicules possédés et véhicule sélectionné.
export class GarageSystem {
  constructor(save, customization) {
    this.save = save;
    this.custom = customization;
  }

  get vehicleId() {
    return ITEM_BY_ID[this.save.data.loadout.car]?.data.vehicle || 'pulse';
  }

  owned() {
    return Object.values(VEHICLES).map((v) => ({ ...v, itemId: `car_${v.id}`, unlocked: this.custom.isUnlocked(`car_${v.id}`), level: ITEM_BY_ID[`car_${v.id}`].level }));
  }

  select(vehicleId) { return this.custom.equip(`car_${vehicleId}`); }
}
