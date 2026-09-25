/**
 * Worker « monde » : génération procédurale et maillage des sections,
 * hors du fil principal. Plusieurs instances tournent en parallèle.
 */
import { createWorldHandler } from './worldHandler';

interface Ctx {
  postMessage(msg: unknown, transfer?: Transferable[]): void;
  onmessage: ((e: MessageEvent) => void) | null;
}
const ctx = self as unknown as Ctx;
const handle = createWorldHandler((msg, transfer) => ctx.postMessage(msg, transfer ?? []));
ctx.onmessage = (e: MessageEvent) => handle(e.data);
