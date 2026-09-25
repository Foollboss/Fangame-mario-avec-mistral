/** Évènements émis par la simulation vers le client (sons, effets, messages…). */
export type SimEvent =
  | { t: 'sound'; id: string; x: number; y: number; z: number; vol?: number; pitch?: number }
  | { t: 'particles'; kind: string; x: number; y: number; z: number; n?: number; spread?: number; layer?: number; color?: [number, number, number] }
  | { t: 'blockBreakFx'; x: number; y: number; z: number; cell: number }
  | { t: 'msg'; text: string; color?: string; to?: number }
  | { t: 'toast'; title: string; text: string; icon?: string; to?: number }
  | { t: 'advancement'; id: string; to: number }
  | { t: 'hurt'; id: number; amount: number }
  | { t: 'death'; id: number; message: string }
  | { t: 'shake'; amount: number; to?: number }
  | { t: 'lightning'; x: number; y: number; z: number }
  | { t: 'dimension'; to: number; dim: string; x: number; y: number; z: number; mode: 'portal' | 'altar' | 'exact' }
  | { t: 'boss'; id: number; name: string; hp: number; max: number; phase: number; gone?: boolean }
  | { t: 'swing'; id: number }
  | { t: 'itemPickup'; id: number; item: string; count: number; to: number };

export type SimListener = (e: SimEvent) => void;
