/** Pool de workers avec répartition par charge et promesses par requête. */

type Pending = { resolve: (v: any) => void; reject: (e: unknown) => void; worker: number };

export class WorkerPool {
  private workers: Worker[] = [];
  private load: number[] = [];
  private pending = new Map<number, Pending>();
  private nextId = 1;

  /** Vrai si les requêtes s'exécutent sur le fil principal (mode de secours). */
  readonly local: boolean;

  constructor(factory: () => Worker, count: number, local = false) {
    this.local = local;
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

/**
 * « Worker » exécuté sur le fil principal : même interface, traitement différé
 * pour ne pas bloquer l'appelant (utilisé quand les workers sont indisponibles).
 */
export class LocalWorker {
  onmessage: ((e: MessageEvent) => void) | null = null;
  onerror: ((e: ErrorEvent) => void) | null = null;
  private queue: unknown[] = [];
  private scheduled = false;
  private handle: (m: never) => void;

  constructor(makeHandler: (post: (msg: unknown) => void) => (m: never) => void) {
    this.handle = makeHandler((msg) => this.onmessage?.({ data: msg } as MessageEvent));
  }

  postMessage(msg: unknown): void {
    this.queue.push(msg);
    if (this.scheduled) return;
    this.scheduled = true;
    setTimeout(() => this.drain(), 0);
  }

  private drain(): void {
    // quelques requêtes par tranche pour garder l'image fluide
    const t0 = performance.now();
    while (this.queue.length && performance.now() - t0 < 12) this.handle(this.queue.shift() as never);
    if (this.queue.length) setTimeout(() => this.drain(), 0);
    else this.scheduled = false;
  }

  terminate(): void {
    this.queue = [];
    this.onmessage = null;
  }
}
