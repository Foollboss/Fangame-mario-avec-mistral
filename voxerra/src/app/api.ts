/** Interface de l'application exposée aux écrans (évite les imports circulaires). */
import type { UIManager } from '../ui/ui';
import type { Settings } from './settings';
import type { WorldMeta, WorldStorage } from '../save/storage';
import type { Content } from '../registry/content';
import type { IconFactory } from '../render/icons';
import type { AudioEngine } from '../audio/audio';
import type { Game } from '../game/game';
import type { ModInfo } from './mods';

export interface AppApi {
  readonly version: string;
  ui: UIManager;
  settings: Settings;
  storage: WorldStorage;
  content: Content;
  icons: IconFactory;
  audio: AudioEngine;
  game: Game | null;
  mods: ModInfo[];
  saveSettings(): void;
  applySettings(): void;
  startWorld(meta: WorldMeta, isNew: boolean): Promise<void>;
  quitToTitle(): Promise<void>;
  connect(address: string, name: string): Promise<void>;
  showMainMenu(): void;
  importMod(text: string): Promise<string>;
  removeMod(id: string): void;
}
