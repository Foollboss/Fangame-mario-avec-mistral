/** Pool de workers avec répartition par charge et promesses par requête. */

type Pending = { resolve: (v: any) => void; reject: (e: unknown) => void; worker: number };

export class WorkerPool {
  private workers: Worker[] = [];
  private load: number[] = [];
  private pending = new Map<number, Pending>();
  private nextId = 1;

  constructor(factory: () => Worker, count: number) {
    for (let i = 0; i < count; i++) {
      const w = factory();
      const idx = i;
      w.onmessage = (e: MessageEvent) => {
        const m = e.data;
        const p = this.pending.get(m.id);
        if (!p) return;
        this.pending.delete(m.id);
        this.load[idx]--;
        if (m.type === 'error') {
          console.error('[worker]', m.error);
          p.reject(new Error(m.error));
        } else p.resolve(m);
      };
      w.onerror = (e) => console.error('[worker] erreur', e.message);
      this.workers.push(w);
      this.load.push(0);
    }
  }

  get size(): number {
    return this.workers.length;
  }

  get busy(): number {
    return this.pending.size;
  }

  /** Envoie une requête au worker le moins chargé. */
  request<T = any>(msg: Record<string, unknown>, transfer: Transferable[] = []): Promise<T> {
    let best = 0;
    for (let i = 1; i < this.load.length; i++) if (this.load[i] < this.load[best]) best = i;
    return this.requestOn<T>(best, msg, transfer);
  }

  requestOn<T = any>(worker: number, msg: Record<string, unknown>, transfer: Transferable[] = []): Promise<T> {
    const id = this.nextId++;
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve, reject, worker });
      this.load[worker]++;
      this.workers[worker].postMessage({ ...msg, id }, transfer);
    });
  }

  /** Diffuse un message à tous les workers (initialisation). */
  broadcast(msg: Record<string, unknown>): Promise<unknown[]> {
    return Promise.all(this.workers.map((_, i) => this.requestOn(i, msg)));
  }

  terminate(): void {
    for (const w of this.workers) w.terminate();
    for (const p of this.pending.values()) p.reject(new Error('pool terminé'));
    this.pending.clear();
    this.workers = [];
  }
}
