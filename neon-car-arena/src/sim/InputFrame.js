// Entrées d'une voiture pour un tick. Même format pour le joueur, les bots et (plus tard) le réseau.
export class InputFrame {
  constructor() { this.clear(); }

  clear() {
    this.throttle = 0; // -1..1
    this.steer = 0;    // -1..1 (droite positive) ; lacet en l'air
    this.pitch = 0;    // -1..1 (haut du joystick positif = nez vers le bas en l'air)
    this.roll = 0;     // -1..1
    this.jump = false;
    this.boost = false;
    this.dash = false;
    return this;
  }

  copy(o) {
    this.throttle = o.throttle; this.steer = o.steer; this.pitch = o.pitch; this.roll = o.roll;
    this.jump = o.jump; this.boost = o.boost; this.dash = o.dash;
    return this;
  }

  // Encodage compact (6 octets) pour l'envoi réseau.
  encode(view, offset) {
    const q = (v) => Math.round(Math.max(-1, Math.min(1, v)) * 127);
    view.setInt8(offset, q(this.throttle));
    view.setInt8(offset + 1, q(this.steer));
    view.setInt8(offset + 2, q(this.pitch));
    view.setInt8(offset + 3, q(this.roll));
    view.setUint8(offset + 4, (this.jump ? 1 : 0) | (this.boost ? 2 : 0) | (this.dash ? 4 : 0));
    return offset + 6;
  }

  decode(view, offset) {
    this.throttle = view.getInt8(offset) / 127;
    this.steer = view.getInt8(offset + 1) / 127;
    this.pitch = view.getInt8(offset + 2) / 127;
    this.roll = view.getInt8(offset + 3) / 127;
    const b = view.getUint8(offset + 4);
    this.jump = !!(b & 1); this.boost = !!(b & 2); this.dash = !!(b & 4);
    return offset + 6;
  }
}
