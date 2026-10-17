import { describe, it, expect } from 'vitest';
import { encodeValue, decodeValue } from '../src/app/transfer';

describe('transfert des mondes (ancienne fenêtre → nouvelle)', () => {
  it('les données d’IndexedDB font l’aller-retour par JSON', () => {
    const rec = {
      v: 2,
      cx: -3,
      cz: 7,
      palette: ['air', 'bloc_or'],
      sections: [null, Uint16Array.from([4096, 1]), new Uint16Array(0)],
      biomes: Uint8Array.from([1, 2, 255]),
      tints: Uint32Array.from([0xffffffff, 0x123456]),
      blockEntities: [[12, { items: [{ id: 'bloc_or', count: 3 }] }]],
      entities: [{ kind: 'lapin', pos: Float32Array.from([1.5, -2.25, 3]) }],
      when: new Date(1700000000000),
      extra: { $t: 'pas un type', m: new Map([['a', 1]]), s: new Set([1, 2]), buf: Uint8Array.from([9, 8]).buffer },
    };
    const back = decodeValue(JSON.parse(JSON.stringify(encodeValue(rec)))) as typeof rec;
    expect(back).toEqual(rec);
    expect(back.sections[1]).toBeInstanceOf(Uint16Array);
    expect(back.tints).toBeInstanceOf(Uint32Array);
    expect(back.entities[0].pos).toBeInstanceOf(Float32Array);
    expect(back.extra.buf).toBeInstanceOf(ArrayBuffer);
  });

  it('une vue partielle d’un tableau ne transporte que ses octets', () => {
    const big = Uint16Array.from([1, 2, 3, 4, 5, 6]);
    const back = decodeValue(JSON.parse(JSON.stringify(encodeValue(big.subarray(2, 4))))) as Uint16Array;
    expect(Array.from(back)).toEqual([3, 4]);
  });
});
