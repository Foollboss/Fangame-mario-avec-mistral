import { VehiclePhysics } from './VehiclePhysics.js';
import { VehicleController } from './VehicleController.js';
import { getVehicle } from './Vehicles.js';

export function emptyMatchStats() {
  return { goals: 0, assists: 0, saves: 0, shots: 0, points: 0, touches: 0, demos: 0 };
}

export class Car {
  constructor({ id, team, name, isBot = false, isLocal = false, vehicleId = 'pulse', cosmetics = null, events }) {
    this.id = id;
    this.team = team;
    this.name = name;
    this.isBot = isBot;
    this.isLocal = isLocal;
    this.vehicle = getVehicle(vehicleId);
    this.cosmetics = cosmetics;
    this.physics = new VehiclePhysics(this.vehicle.stats);
    this.controller = new VehicleController(this, events);
    this.boost = 33;
    this.demolished = false;
    this.respawnTimer = 0;
    this.touchCooldown = 0;
    this.stats = emptyMatchStats();
  }

  get pos() { return this.physics.pos; }
  get vel() { return this.physics.vel; }
  get boosting() { return this.controller.boosting; }
}
