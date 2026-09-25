import { describe, it, expect } from 'vitest';
import { content } from './helpers';
import { GameServer, newServerMeta, type ServerStorage } from '../server/gameServer';
import type { ChunkRecord } from '../src/save/serializer';
import type { WorldMeta } from '../src/save/storage';
import { wireToChunk, PROTOCOL_VERSION, type ServerMsg } from '../src/net/protocol';
import { decodeChunk } from '../src/save/serializer';

class MemStore implements ServerStorage {
  chunks = new Map<string, ChunkRecord>();
  players = new Map<string, Record<string, unknown>>();
  meta: WorldMeta | null = null;
  loadChunkSync(id: string, dim: string, cx: number, cz: number): ChunkRecord | null {
    return this.chunks.get(`${id}|${dim}|${cx}|${cz}`) ?? null;
  }
  saveBatchSync(meta: WorldMeta | null, recs: { dim: string; rec: ChunkRecord }[]): void {
    if (meta) this.meta = structuredClone(meta);
    for (const r of recs) this.chunks.set(`${meta?.id}|${r.dim}|${r.rec.cx}|${r.rec.cz}`, structuredClone(r.rec));
  }
  loadPlayer(_id: string, name: string): Record<string, unknown> | null {
    return this.players.get(name) ?? null;
  }
  savePlayer(_id: string, name: string, d: Record<string, unknown>): void {
    this.players.set(name, structuredClone(d));
  }
}

function fakeConn() {
  const got: ServerMsg[] = [];
  return { got, conn: { send: (d: string) => got.push(JSON.parse(d)), close: () => {} } };
}

describe('serveur multijoueur', () => {
  it('accueil, colonnes, réplication des blocs, discussion et sauvegarde des joueurs', () => {
    const store = new MemStore();
    const srv = new GameServer(content, newServerMeta('t', 'Test', 777, '777'), store, { radius: 2, log: () => {} });
    const a = fakeConn(),
      b = fakeConn();
    const ca = srv.connect(a.conn),
      cb = srv.connect(b.conn);
    srv.handle(ca, JSON.stringify({ t: 'hello', name: 'Alba', version: PROTOCOL_VERSION }));
    srv.handle(cb, JSON.stringify({ t: 'hello', name: 'Brune', version: PROTOCOL_VERSION }));
    for (let i = 0; i < 6; i++) srv.tick();
    const welcome = a.got.find((m) => m.t === 'welcome');
    expect(welcome).toBeTruthy();
    const chunks = a.got.filter((m): m is Extract<ServerMsg, { t: 'chunk' }> => m.t === 'chunk');
    expect(chunks.length).toBeGreaterThanOrEqual(13);
    // une colonne reçue se décode
    const dec = decodeChunk(wireToChunk(chunks[0].rec), content.blocks);
    expect(dec.sections.some((s) => s)).toBe(true);
    // Brune voit Alba
    const ents = b.got.filter((m): m is Extract<ServerMsg, { t: 'ents' }> => m.t === 'ents').pop()!;
    expect(ents.list.some((e) => e.k === 'player' && e.n === 'Alba')).toBe(true);
    // Alba pose un bloc : Brune reçoit le changement
    const pa = ca.player!;
    const w = srv.sim.world('surface');
    const x = Math.floor(pa.x) + 2,
      z = Math.floor(pa.z);
    const y = w.findGround(x, z);
    pa.inventory.set(0, { id: 'bloc_or', count: 3 });
    pa.inventory.selected = 0;
    srv.handle(ca, JSON.stringify({ t: 'place', hit: { x, y, z, face: 2, dist: 2, px: x + 0.5, py: y + 1, pz: z + 0.5 }, slot: 0 }));
    srv.tick();
    expect(content.blocks.get(w.getId(x, y + 1, z)).id).toBe('bloc_or');
    expect(b.got.some((m) => m.t === 'block' && m.n === 'bloc_or' && m.x === x && m.y === y + 1 && m.z === z)).toBe(true);
    // l'inventaire d'Alba est resynchronisé (2 blocs restants)
    const inv = a.got.filter((m): m is Extract<ServerMsg, { t: 'inv' }> => m.t === 'inv').pop()!;
    expect(JSON.stringify(inv.data)).toContain('"count":2');
    // discussion
    srv.handle(cb, JSON.stringify({ t: 'chat', text: 'salut' }));
    srv.flush();
    expect(a.got.some((m) => m.t === 'ev' && m.e.t === 'msg' && m.e.text === '<{name}> {msg}' && m.e.args?.name === 'Brune' && m.e.args?.msg === 'salut')).toBe(true);
    // un message invalide est ignoré
    srv.handle(ca, '{pas du json');
    srv.handle(ca, JSON.stringify({ t: 'dig', x: x + 500, y, z }));
    // déconnexion : le joueur est sauvegardé, puis restauré à la reconnexion
    pa.health = 11;
    srv.disconnect(ca);
    expect(store.players.get('Alba')?.health).toBe(11);
    const a2 = fakeConn();
    const ca2 = srv.connect(a2.conn);
    srv.handle(ca2, JSON.stringify({ t: 'hello', name: 'Alba', version: PROTOCOL_VERSION }));
    expect(ca2.player!.health).toBe(11);
    // sauvegarde du monde
    srv.save();
    expect(store.meta?.id).toBe('t');
    expect([...store.chunks.keys()].length).toBeGreaterThan(0);
  });

  it('refuse les versions incompatibles et les noms déjà pris', () => {
    const srv = new GameServer(content, newServerMeta('u', 'U', 1, '1'), new MemStore(), { radius: 1, log: () => {} });
    const a = fakeConn();
    srv.handle(srv.connect(a.conn), JSON.stringify({ t: 'hello', name: 'X', version: 999 }));
    expect(a.got[0]).toMatchObject({ t: 'kick' });
    const b = fakeConn(),
      c = fakeConn();
    srv.handle(srv.connect(b.conn), JSON.stringify({ t: 'hello', name: 'Même', version: PROTOCOL_VERSION }));
    srv.handle(srv.connect(c.conn), JSON.stringify({ t: 'hello', name: 'même', version: PROTOCOL_VERSION }));
    expect(c.got[0]).toMatchObject({ t: 'kick' });
  });
});
