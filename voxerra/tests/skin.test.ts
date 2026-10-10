import { describe, it, expect } from 'vitest';
import { ACCESSOIRES, COIFFURES, DEFAULT_SKIN, DEFAULT_SKIN_CODE, PRESETS, decodeSkin, encodeSkin, playerParts, randomSkin, sanitizeSkin } from '../src/entity/skin';
import { Rng } from '../src/engine/rng';

describe('skins', () => {
  it('le code court fait l’aller-retour pour tous les préréglages et des skins au hasard', () => {
    const rng = new Rng(7);
    const skins = [...PRESETS.map((p) => p.skin), ...Array.from({ length: 50 }, () => randomSkin(() => rng.next()))];
    for (const s of skins) {
      const code = encodeSkin(s);
      expect(code).toMatch(/^1(\.[0-9a-f]+){11}$/);
      expect(decodeSkin(code)).toEqual(s);
    }
    expect(DEFAULT_SKIN_CODE).toBe('1.e8b88a.1a1a2a.5a3a24.0.2a6a8a.0.0.3a3a5a.4a2a1a.0.d04a2a');
  });

  it('refuse les codes mal formés et répare les réglages abîmés', () => {
    for (const bad of ['', 'abc', '2.e8b88a.1a1a2a.5a3a24.0.2a6a8a.0.0.3a3a5a.4a2a1a.0.d04a2a', '1.e8b88a.1a1a2a.5a3a24.9.2a6a8a.0.0.3a3a5a.4a2a1a.0.d04a2a', '1.zzzzzz.1a1a2a.5a3a24.0.2a6a8a.0.0.3a3a5a.4a2a1a.0.d04a2a', 42, null])
      expect(decodeSkin(bad)).toBeNull();
    // un code collé avec des espaces ou des majuscules passe
    expect(decodeSkin('  1.E8B88A.1a1a2a.5a3a24.0.2a6a8a.0.0.3a3a5a.4a2a1a.0.d04a2a ')).toEqual(DEFAULT_SKIN);
    expect(sanitizeSkin({ peau: '#123456', coiffure: 'mohawk', haut: 'rouge' })).toEqual({ ...DEFAULT_SKIN, peau: '#123456' });
    expect(sanitizeSkin(undefined)).toEqual(DEFAULT_SKIN);
  });

  it('le modèle suit la coiffure et l’accessoire, toujours avec les 6 pièces animées', () => {
    for (const coiffure of COIFFURES)
      for (const accessoire of ACCESSOIRES) {
        const parts = playerParts({ ...DEFAULT_SKIN, coiffure, accessoire });
        const ids = parts.map((p) => p.id);
        for (const r of ['body', 'head', 'arm_r', 'arm_l', 'leg_r', 'leg_l']) expect(parts.some((p) => p.role === r)).toBe(true);
        expect(new Set(ids).size).toBe(ids.length);
        // chaque pièce rattachée l'est à une pièce qui existe
        for (const p of parts) if (p.parent) expect(ids).toContain(p.parent);
        expect(ids.includes('scarf')).toBe(accessoire === 'echarpe');
        expect(ids.includes('cape')).toBe(accessoire === 'cape');
        expect(ids.includes('cap')).toBe(accessoire === 'casquette');
        expect(ids.includes('hair_back')).toBe(coiffure === 'longue');
      }
  });
});
