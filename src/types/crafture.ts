export type CraftureType = 'forest' | 'ice' | 'fire' | 'water' | 'shadow' | 'flower' | 'cube' | 'thunder' | 'rock' | 'ghost' | 'mechanical';

export interface CraftureSpecies {
  id: string;
  name: string;
  type: CraftureType;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  baseHappiness: number;
  baseHunger: number;
  baseAttack: number;
  baseDefense: number;
  baseSpeed: number;
  evolvesTo?: string;
  evolvesAt?: number;
  evolutionPaths?: { targetId: string; levelRequired: number; condition?: 'high-hunger' | 'low-hunger' }[];
  evolutionStage?: 1 | 2 | 3 | 4; // 1=base, 2=mid, 3=final, 4=supreme
}

export interface OwnedCrafture {
  id: string;
  speciesId: string;
  nickname: string;
  happiness: number;
  hunger: number;
  level: number;
  experience: number;
  learnedMoveIds?: string[];
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  caughtAt: Date;
  lastFed: Date;
  lastPetted: Date;
}

export type GameScreen = 'starter' | 'menu' | 'encounter' | 'collection' | 'care' | 'battle' | 'inventory' | 'encyclopedia' | 'stageroad' | 'shop' | 'biomemap' | 'arena';

// Evolution can be branching based on conditions
export interface EvolutionPath {
  targetId: string;
  levelRequired: number;
  condition?: 'high-hunger' | 'low-hunger' | 'high-happiness' | 'low-happiness';
}

export interface BattleState {
  playerCrafture: OwnedCrafture;
  wildCrafture: OwnedCrafture;
  playerTurn: boolean;
  battleLog: string[];
  isOver: boolean;
  winner: 'player' | 'wild' | null;
}

export interface GameSave {
  ownedCraftures: OwnedCrafture[];
  completedStages: number[];
  completedBiomeNodes: string[];
  discoveredSpecies: string[];
  savedAt: string;
}

// Helper to calculate hunger weakness multiplier (0.5 at 0 hunger, 1.0 at 100 hunger)
export const getHungerMultiplier = (hunger: number): number => {
  // At 0 hunger = 0.5x stats (very weak)
  // At 50 hunger = 0.75x stats (weak)
  // At 100 hunger = 1.0x stats (normal)
  return 0.5 + (hunger / 200);
};
