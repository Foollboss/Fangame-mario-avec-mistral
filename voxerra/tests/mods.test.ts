import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import { Content, BASE_PACK, mergePacks } from '../src/registry/content';
import { validatePack } from '../src/app/mods';
import { createGenerator } from '../src/worldgen/generator';
import type { ContentPack } from '../src/registry/types';
import type { OverworldGenerator } from '../src/worldgen/overworld';
import { MISSING_BLOCKS } from '../src/worldgen/structures/builder';

const pack = JSON.parse(fs.readFileSync('public/mods/lucioles.json', 'utf8')) as ContentPack;

describe('mods de données', () => {
  it('le mod d’exemple est valide et ajoute blocs, objets, recettes, créature, structure', () => {
    expect(validatePack(pack)).toBeNull();
    const content = new Content(mergePacks([BASE_PACK, pack]));
    expect(content.blocks.tryNum('verre_luciole')).toBeGreaterThan(0);
    expect(content.blocks.tryNum('pierre_cairn_escalier')).toBeGreaterThan(0);
    expect(content.items.has('pollen_lumineux')).toBe(true);
    expect(content.creatures.get('luciole')?.movement).toBe('fly');
    expect(content.blocks.textureNames.filter((n) => !(n in content.textures))).toEqual([]);
    // recette façonnée du mod
    const grid = [null, 'pollen_lumineux', null, 'pollen_lumineux', 'verre', 'pollen_lumineux', null, 'pollen_lumineux', null];
    expect(content.recipes.match(grid, 3, 3, 'atelier')?.item).toBe('verre_luciole');
    // structure gabarit localisable et générée avec son coffre
    const gen = createGenerator('surface', 99, content) as OverworldGenerator;
    const p = gen.structures.locate('cairn_luciole', 0, 0, 20000);
    expect(p).not.toBeNull();
    const buf = gen.generate(Math.floor(p!.x / 16), Math.floor(p!.z / 16));
    const chest = buf.blockEntities.find((b) => b.data.type === 'chest' && b.data.loot === 'cairn_luciole');
    expect(chest).toBeTruthy();
    expect([...MISSING_BLOCKS]).toEqual([]);
  });

  it('un pack invalide est refusé avec un message clair', () => {
    expect(validatePack({ id: 'X!' })).toMatch(/Identifiant/);
    expect(validatePack({ id: 'ok', blocks: {} })).toMatch(/liste/);
    expect(validatePack({ id: 'ok', items: [{ id: 'a' }] })).toMatch(/nom/);
  });
});
