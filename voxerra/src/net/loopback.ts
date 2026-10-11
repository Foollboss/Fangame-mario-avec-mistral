/**
 * Connexion en mémoire entre le joueur qui héberge et le serveur intégré à sa page : même
 * protocole qu'un WebSocket (messages JSON), livrés de façon asynchrone comme sur le réseau.
 */
import type { GameServer } from '../../server/gameServer';
import type { SocketLike } from './client';

export class LoopbackSocket implements SocketLike {
  readyState = 0;
  onopen: ((ev?: unknown) => void) | null = null;
  onmessage: ((ev: { data: unknown }) => void) | null = null;
  onclose: ((ev?: unknown) => void) | null = null;
  onerror: ((ev?: unknown) => void) | null = null;
  private client: ReturnType<GameServer['connect']>;

  constructor(private server: GameServer) {
    this.client = server.connect({
      send: (data) => queueMicrotask(() => this.readyState === 1 && this.onmessage?.({ data })),
      close: () => queueMicrotask(() => this.shut()),
    });
    setTimeout(() => {
      this.readyState = 1;
      this.onopen?.();
    }, 0);
  }

  send(data: string): void {
    if (this.readyState !== 1) return;
    queueMicrotask(() => this.server.handle(this.client, data));
  }

  close(): void {
    if (this.readyState >= 2) return;
    this.server.disconnect(this.client);
    this.shut();
  }

  private shut(): void {
    if (this.readyState === 3) return;
    this.readyState = 3;
    this.onclose?.();
  }
}
