/**
 * Contrat entre l'application et ses écrans : services partagés et navigation.
 * Les écrans ne s'importent pas entre eux ; ils passent par ces méthodes.
 */
import type { SettingsManager } from './Settings';
import type { SaveManager, WorldMeta } from '../save/SaveManager';
import type { UIManager } from '../ui/UIManager';
import type { AudioManager } from '../audio/AudioManager';
import type { ItemIcons } from '../render/ItemIcons';
import type { Renderer } from '../render/Renderer';
import type { InputManager } from '../input/InputManager';
import type { TouchControls } from '../input/TouchControls';
import type { ModelPreview } from '../render/ModelPreview';
import type { ModelFactory } from '../entities/BoxModel';
import type { ResourcePackManager } from '../packs/ResourcePacks';
import type { Game } from '../game/Game';

export type PlayTab = 'worlds' | 'invites' | 'servers';
export type SettingsSection = 'accessibility' | 'game' | 'multiplayer' | 'keyboard' | 'controller' | 'touch' | 'profile' | 'video' | 'audio' | 'packs' | 'storage';

export interface AppContext {
  readonly version: string;
  readonly settings: SettingsManager;
  readonly saves: SaveManager;
  readonly ui: UIManager;
  readonly audio: AudioManager;
  readonly icons: ItemIcons;
  readonly renderer: Renderer;
  readonly input: InputManager;
  readonly touch: TouchControls;
  /** Aperçu 3D des personnages (menu, vestiaire, poupée d'inventaire). */
  readonly preview: ModelPreview;
  readonly models: ModelFactory;
  readonly packs: ResourcePackManager;
  /** Interface tactile active (Android / écran tactile). */
  touchMode: boolean;
  /** Partie en cours (null au menu). */
  readonly game: Game | null;

  // ---------------------------------------------------------------- parties
  /** Charge et lance un monde local (écran de chargement inclus). */
  startWorld(meta: WorldMeta): Promise<void>;
  /** Se connecte à un serveur multijoueur Voxelia (adresse « hôte:port »). */
  joinServer(address: string, invite?: string): Promise<void>;
  /** Sauvegarde, quitte la partie et revient au menu principal. */
  quitToMenu(): Promise<void>;

  // ---------------------------------------------------------------- navigation (remplace ou empile des écrans)
  showTitle(): void;
  openPlay(tab?: PlayTab): void;
  openCreateWorld(): void;
  openEditWorld(meta: WorldMeta): void;
  openSettings(section?: SettingsSection): void;
  openSocial(): void;
  openProfile(): void;
  openDressingRoom(): void;
  openCredits(): void;
  /** Quitte l'application (Android) ou revient à l'écran titre (navigateur). */
  exitApp(): void;
  /** Applique les réglages graphiques/sonores modifiés. */
  applySettings(): void;
}
