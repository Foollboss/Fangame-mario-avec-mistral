import type * as THREE from 'three';
import type { Entity } from '../entity/Entity';
import type { World } from '../world/World';
import type { Player } from '../player/Player';
import type { ParticleSystem } from '../render/Effects';
import type { ItemStack } from '../items/items';
import type { GameRules, Difficulty } from '../save/SaveManager';

/** Services du jeu accessibles aux entités (monde, joueur, effets, sons…). */
export interface EntityHost {
  world: World;
  player: Player;
  particles: ParticleSystem;
  rules: GameRules;
  difficulty: Difficulty;
  /** Temps du jour (0..24000). */
  time: number;
  daylight: number;
  dimension: number;
  entitiesNear(pos: THREE.Vector3, radius: number): Entity[];
  audio(name: string, pos?: THREE.Vector3 | { x: number; y: number; z: number }, volume?: number, pitch?: number): void;
  explode(x: number, y: number, z: number, power: number, source: Entity | null, breakBlocks: boolean, fire: boolean): void;
  spawnMob(type: string, x: number, y: number, z: number, opts?: Record<string, unknown>): Entity | null;
  spawnEntity(e: Entity, x: number, y: number, z: number): Entity;
  dropItem(x: number, y: number, z: number, stack: ItemStack, vel?: THREE.Vector3): void;
  dropXp(x: number, y: number, z: number, amount: number): void;
  spawnProjectile(kind: string, owner: Entity | null, pos: THREE.Vector3, vel: THREE.Vector3): Entity | null;
  mount(rider: Entity, vehicle: Entity): void;
  openTrade(villager: Entity): void;
  strikeLightning(x: number, z: number): void;
  bossDefeated(boss: Entity): void;
  dismount(rider: Entity): void;
  message(text: string): void;
  bossBar(entity: Entity | null, title?: string, progress?: number): void;
  isRaining(): boolean;
}
