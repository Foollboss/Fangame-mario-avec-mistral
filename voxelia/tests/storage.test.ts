import { describe, expect, it } from 'vitest';
import { rleDecode, rleEncode, toBase64, fromBase64 } from '../src/save/db';
import { deserializeStack, serializeStack, itemId } from '../src/items/items';

describe('compression des tronçons (RLE)', () => {
  it('restitue exactement les données', () => {
    const data = new Uint16Array(65536);
    for (let i = 0; i < data.length; i++) data[i] = i < 20000 ? 1 : i % 7 === 0 ? (i * 31) & 0x3ff : 3;
    const rle = rleEncode(data);
    expect(rle.length).toBeLessThan(data.length);
    expect(Array.from(rleDecode(rle, data.length))).toEqual(Array.from(data));
  });

  it('gère une colonne vide', () => {
    const data = new Uint16Array(65536);
    expect(Array.from(rleDecode(rleEncode(data), data.length).slice(0, 10))).toEqual(new Array(10).fill(0));
  });

  it('base64 aller-retour', () => {
    const u = new Uint8Array([0, 1, 2, 250, 255, 128, 64]);
    expect(Array.from(fromBase64(toBase64(u)))).toEqual(Array.from(u));
  });
});

describe('sérialisation des objets', () => {
  it('stocke les objets par clé et les relit', () => {
    const s = { id: itemId('iron_pickaxe'), count: 1, damage: 12 };
    const back = deserializeStack(JSON.parse(JSON.stringify(serializeStack(s))));
    expect(back).toEqual(s);
  });

  it('ignore les objets inconnus ou vides', () => {
    expect(deserializeStack({ k: 'objet_inexistant', c: 3 })).toBeNull();
    expect(deserializeStack({ k: 'stone', c: 0 })).toBeNull();
    expect(deserializeStack(null)).toBeNull();
  });
});
