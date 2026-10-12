/**
 * Packs de ressources : import de fichiers .zip / .mcpack (format Java ou Bedrock),
 * conversion des textures vers les noms Voxelia, activation globale ou par monde.
 * (Contrat : l'implémentation complète remplace ce squelette.)
 */
import type { SaveManager } from '../save/SaveManager';
import type { TextureAtlas } from '../render/TextureAtlas';

export interface PackInfo {
  id: string;
  name: string;
  description: string;
  /** Icône (URL de données PNG) ou undefined. */
  icon?: string;
  /** Nombre de textures reconnues. */
  count: number;
}

export class ResourcePackManager {
  /** Packs actifs globalement, du plus prioritaire au moins prioritaire. */
  active: string[] = [];

  constructor(
    protected saves: SaveManager,
    protected atlas: TextureAtlas,
    protected onApplied: () => void,
  ) {}

  async list(): Promise<PackInfo[]> {
    return [];
  }

  /** Importe un pack (.zip/.mcpack) ; onProgress reçoit 0..1. */
  async importPack(_file: Blob, _name?: string, _onProgress?: (p: number) => void): Promise<PackInfo> {
    throw new Error('Import non disponible');
  }

  async remove(_id: string): Promise<void> {}

  /** Change l'ordre / la sélection des packs actifs globaux et les applique. */
  async setActive(ids: string[]): Promise<void> {
    this.active = ids;
  }

  /** Applique les packs globaux puis ceux du monde (worldPacks prioritaires). */
  async apply(_worldPacks: string[] = []): Promise<void> {}
}
