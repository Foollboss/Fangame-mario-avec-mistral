// Couche réseau (préparation du multijoueur en ligne).
//
// Principe retenu : serveur autoritaire. Les clients envoient leurs InputFrame (6 octets / tick),
// le serveur exécute la même Simulation (code partagé, sans rendu ni DOM) et diffuse des Snapshot.
// Le client prédit sa propre voiture et corrige à réception (réconciliation).
//
// Seul un transport local (boucle) est implémenté aujourd'hui : il sert aux tests et valide
// le format des messages. Un transport WebSocket/WebRTC implémentera la même interface.

export const MSG = { INPUT: 1, SNAPSHOT: 2 };

export class LoopbackTransport {
  constructor(latencyTicks = 0) {
    this.latency = latencyTicks;
    this.queue = [];
    this.handlers = [];
    this.tick = 0;
  }

  send(buffer) { this.queue.push({ at: this.tick + this.latency, buffer }); }
  onMessage(fn) { this.handlers.push(fn); }

  // À appeler une fois par tick : délivre les messages arrivés à échéance.
  pump() {
    this.tick++;
    while (this.queue.length && this.queue[0].at <= this.tick) {
      const { buffer } = this.queue.shift();
      for (const h of this.handlers) h(buffer);
    }
  }
}

// Paquet d'entrées : [type, tick(u32), carId, InputFrame(6 octets)]
export function encodeInput(tick, carId, frame) {
  const buf = new ArrayBuffer(12);
  const v = new DataView(buf);
  v.setUint8(0, MSG.INPUT);
  v.setUint32(1, tick);
  v.setUint8(5, carId);
  frame.encode(v, 6);
  return buf;
}

export function decodeInput(buf, frame) {
  const v = new DataView(buf);
  frame.decode(v, 6);
  return { type: v.getUint8(0), tick: v.getUint32(1), carId: v.getUint8(5) };
}
