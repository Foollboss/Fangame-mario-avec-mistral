/** Session multijoueur côté client (connexion WebSocket à un serveur autoritaire). */
import type { ChunkStreamer } from '../world/chunkStreamer';
import type { ItemStack } from '../inventory/inventory';

export class RemoteSession {
  attachStreamer(_s: ChunkStreamer): void {}
  dropStack(_s: ItemStack): void {}
  syncInventory(): void {}
  syncBlockEntity(_x: number, _y: number, _z: number): void {}
  chat(_text: string): void {}
  respawn(): void {}
  update(_dt: number): void {}
  close(): void {}
}
