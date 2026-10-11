/**
 * Pool de workers de génération/maillage avec file de priorité.
 * Les tâches les plus proches du joueur passent en premier.
 */
export interface Job {
  msg: Record<string, unknown> & { type: string };
  transfer?: Transferable[];
  priority: number;
  resolve: (data: any) => void;
  reject: (err: Error) => void;
  key?: string;
}

export class WorkerPool {
  private workers: Worker[] = [];
  private busy: number[] = [];
  private queue: Job[] = [];
  private pending = new Map<number, Job>();
  private nextId = 1;
  readonly size: number;

  constructor(url: string, count?: number) {
    const hc = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    this.size = Math.max(1, Math.min(count ?? hc - 1, 6));
    for (let i = 0; i < this.size; i++) {
      const w = new Worker(url);
      w.onmessage = (e) => this.onMessage(i, e.data);
      w.onerror = (e) => console.error('Erreur worker', e.message);
      this.workers.push(w);
      this.busy.push(0);
    }
  }

  /** Envoie un message à tous les workers (initialisation, textures). */
  broadcast(msg: Record<string, unknown>): void {
    for (const w of this.workers) w.postMessage(msg);
  }

  submit<T>(msg: Job['msg'], priority: number, transfer?: Transferable[], key?: string): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      this.queue.push({ msg, transfer, priority, resolve, reject, key });
      this.pump();
    });
  }

  /** Réévalue les priorités (le joueur s'est déplacé). */
  reprioritize(fn: (job: Job) => number): void {
    for (const j of this.queue) j.priority = fn(j);
  }

  /** Retire les tâches devenues inutiles (tronçons déchargés). */
  cancel(pred: (job: Job) => boolean): void {
    this.queue = this.queue.filter((j) => {
      if (pred(j)) {
        j.reject(new Error('annulé'));
        return false;
      }
      return true;
    });
  }

  get queued(): number {
    return this.queue.length;
  }

  get inFlight(): number {
    return this.pending.size;
  }

  private pump(): void {
    if (!this.queue.length) return;
    for (let i = 0; i < this.workers.length; i++) {
      while (this.busy[i] < 2 && this.queue.length) {
        // Choix de la tâche la plus prioritaire (plus petite valeur).
        let best = 0;
        for (let k = 1; k < this.queue.length; k++) if (this.queue[k].priority < this.queue[best].priority) best = k;
        const job = this.queue[best];
        this.queue[best] = this.queue[this.queue.length - 1];
        this.queue.pop();
        const id = this.nextId++;
        this.pending.set(id, job);
        this.busy[i]++;
        this.workers[i].postMessage({ ...job.msg, id }, job.transfer ?? []);
      }
    }
  }

  private onMessage(worker: number, data: any): void {
    const job = this.pending.get(data.id);
    this.busy[worker] = Math.max(0, this.busy[worker] - 1);
    if (job) {
      this.pending.delete(data.id);
      if (data.type === 'error') job.reject(new Error(data.message));
      else job.resolve(data);
    }
    this.pump();
  }

  terminate(): void {
    for (const w of this.workers) w.terminate();
    this.workers = [];
    for (const j of this.queue) j.reject(new Error('terminé'));
    this.queue = [];
  }
}
