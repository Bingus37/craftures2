import { CraftureType } from './crafture';

export type StatusEffect = 'burn' | 'freeze' | 'stun' | 'poison' | 'sleep' | null;

export interface BattleMove {
  id: string;
  name: string;
  type: CraftureType;
  power: number;
  accuracy: number;
  description: string;
  statusEffect?: StatusEffect;
  statusChance?: number; // 0-1 probability
  icon: string;
}

// Moves for each type
export const BATTLE_MOVES: Record<CraftureType, BattleMove[]> = {
  forest: [
    { id: 'vine-whip', name: 'Vine Whip', type: 'forest', power: 40, accuracy: 100, description: 'Strikes with vines', icon: '🌿' },
    { id: 'nature-heal', name: 'Nature Heal', type: 'forest', power: 0, accuracy: 100, description: 'Heals 30 HP', icon: '💚' },
    { id: 'leaf-storm', name: 'Leaf Storm', type: 'forest', power: 70, accuracy: 85, description: 'A powerful storm of leaves', icon: '🍃' },
    { id: 'spore-cloud', name: 'Spore Cloud', type: 'forest', power: 35, accuracy: 95, description: 'May put foe to sleep', statusEffect: 'sleep', statusChance: 0.3, icon: '🌸' },
  ],
  fire: [
    { id: 'ember', name: 'Ember', type: 'fire', power: 40, accuracy: 100, description: 'A small fire attack', icon: '🔥' },
    { id: 'flame-burst', name: 'Flame Burst', type: 'fire', power: 60, accuracy: 90, description: 'May burn the target', statusEffect: 'burn', statusChance: 0.2, icon: '💥' },
    { id: 'inferno', name: 'Inferno', type: 'fire', power: 85, accuracy: 75, description: 'High power, low accuracy. May burn', statusEffect: 'burn', statusChance: 0.4, icon: '🌋' },
    { id: 'heat-wave', name: 'Heat Wave', type: 'fire', power: 55, accuracy: 95, description: 'A wave of intense heat', icon: '🌡️' },
  ],
  water: [
    { id: 'water-gun', name: 'Water Gun', type: 'water', power: 40, accuracy: 100, description: 'A simple water attack', icon: '💧' },
    { id: 'bubble-blast', name: 'Bubble Blast', type: 'water', power: 55, accuracy: 95, description: 'Exploding bubbles', icon: '🫧' },
    { id: 'hydro-pump', name: 'Hydro Pump', type: 'water', power: 85, accuracy: 75, description: 'Powerful water blast', icon: '🌊' },
    { id: 'aqua-jet', name: 'Aqua Jet', type: 'water', power: 45, accuracy: 100, description: 'Always strikes first', icon: '💨' },
  ],
  ice: [
    { id: 'ice-shard', name: 'Ice Shard', type: 'ice', power: 40, accuracy: 100, description: 'Sharp ice projectile', icon: '❄️' },
    { id: 'frost-breath', name: 'Frost Breath', type: 'ice', power: 55, accuracy: 90, description: 'May freeze target', statusEffect: 'freeze', statusChance: 0.25, icon: '🥶' },
    { id: 'blizzard', name: 'Blizzard', type: 'ice', power: 80, accuracy: 70, description: 'High chance to freeze', statusEffect: 'freeze', statusChance: 0.5, icon: '🌨️' },
    { id: 'icicle-crash', name: 'Icicle Crash', type: 'ice', power: 65, accuracy: 85, description: 'Falling icicles', icon: '🧊' },
  ],
  shadow: [
    { id: 'shadow-claw', name: 'Shadow Claw', type: 'shadow', power: 45, accuracy: 100, description: 'A dark slashing attack', icon: '🌑' },
    { id: 'dark-pulse', name: 'Dark Pulse', type: 'shadow', power: 60, accuracy: 90, description: 'May stun target', statusEffect: 'stun', statusChance: 0.2, icon: '💜' },
    { id: 'nightmare', name: 'Nightmare', type: 'shadow', power: 75, accuracy: 80, description: 'Terrifying attack', icon: '👁️' },
    { id: 'void-drain', name: 'Void Drain', type: 'shadow', power: 50, accuracy: 95, description: 'Drains HP from target', icon: '🕳️' },
  ],
  flower: [
    { id: 'petal-dance', name: 'Petal Dance', type: 'flower', power: 40, accuracy: 100, description: 'Dance of petals', icon: '🌸' },
    { id: 'pollen-burst', name: 'Pollen Burst', type: 'flower', power: 50, accuracy: 90, description: 'May cause sleep', statusEffect: 'sleep', statusChance: 0.25, icon: '🌺' },
    { id: 'bloom-beam', name: 'Bloom Beam', type: 'flower', power: 70, accuracy: 85, description: 'A beam of floral energy', icon: '🌷' },
    { id: 'sweet-scent', name: 'Sweet Scent', type: 'flower', power: 30, accuracy: 100, description: 'Lowers foe accuracy', icon: '🌹' },
  ],
  thunder: [
    { id: 'spark', name: 'Spark', type: 'thunder', power: 40, accuracy: 100, description: 'A small electric shock', icon: '⚡' },
    { id: 'thunderbolt', name: 'Thunderbolt', type: 'thunder', power: 65, accuracy: 90, description: 'May stun target', statusEffect: 'stun', statusChance: 0.3, icon: '🌩️' },
    { id: 'thunder-wave', name: 'Thunder Wave', type: 'thunder', power: 25, accuracy: 95, description: 'High stun chance', statusEffect: 'stun', statusChance: 0.7, icon: '〰️' },
    { id: 'volt-tackle', name: 'Volt Tackle', type: 'thunder', power: 80, accuracy: 80, description: 'Powerful but risky', icon: '💛' },
  ],
  rock: [
    { id: 'rock-throw', name: 'Rock Throw', type: 'rock', power: 45, accuracy: 95, description: 'Throws a rock', icon: '🪨' },
    { id: 'stone-edge', name: 'Stone Edge', type: 'rock', power: 75, accuracy: 75, description: 'Sharp stone attack', icon: '⛰️' },
    { id: 'earthquake', name: 'Earthquake', type: 'rock', power: 65, accuracy: 90, description: 'Shakes the ground', icon: '🌍' },
    { id: 'rock-shield', name: 'Rock Shield', type: 'rock', power: 0, accuracy: 100, description: 'Boosts defense', icon: '🛡️' },
  ],
  ghost: [
    { id: 'lick', name: 'Lick', type: 'ghost', power: 35, accuracy: 100, description: 'A ghostly lick', icon: '👻' },
    { id: 'shadow-ball', name: 'Shadow Ball', type: 'ghost', power: 65, accuracy: 90, description: 'A ball of shadows', icon: '🔮' },
    { id: 'curse', name: 'Curse', type: 'ghost', power: 50, accuracy: 85, description: 'May poison target', statusEffect: 'poison', statusChance: 0.35, icon: '☠️' },
    { id: 'phantom-force', name: 'Phantom Force', type: 'ghost', power: 70, accuracy: 85, description: 'Phases through defense', icon: '👤' },
  ],
  cube: [
    { id: 'pixel-punch', name: 'Pixel Punch', type: 'cube', power: 45, accuracy: 100, description: 'A blocky punch', icon: '🟧' },
    { id: 'data-beam', name: 'Data Beam', type: 'cube', power: 60, accuracy: 90, description: 'Digital energy beam', icon: '📊' },
    { id: 'glitch-strike', name: 'Glitch Strike', type: 'cube', power: 55, accuracy: 85, description: 'May stun target', statusEffect: 'stun', statusChance: 0.25, icon: '🔲' },
    { id: 'compress', name: 'Compress', type: 'cube', power: 75, accuracy: 80, description: 'Crushing pressure', icon: '📦' },
  ],
  mechanical: [
    { id: 'gear-grind', name: 'Gear Grind', type: 'mechanical', power: 45, accuracy: 100, description: 'Spinning gears attack', icon: '⚙️' },
    { id: 'steam-blast', name: 'Steam Blast', type: 'mechanical', power: 60, accuracy: 90, description: 'High-pressure steam', icon: '💨' },
    { id: 'piston-punch', name: 'Piston Punch', type: 'mechanical', power: 70, accuracy: 85, description: 'Powerful mechanical punch', icon: '🔩' },
    { id: 'overclock', name: 'Overclock', type: 'mechanical', power: 80, accuracy: 75, description: 'Overheats for massive damage', statusEffect: 'burn', statusChance: 0.2, icon: '🔧' },
  ],
};

// Get moves for a Crafture type
export const getMovesForType = (type: CraftureType): BattleMove[] => {
  return BATTLE_MOVES[type] || BATTLE_MOVES.forest;
};

// Status effect descriptions and damage
export const STATUS_EFFECTS: Record<NonNullable<StatusEffect>, {
  name: string;
  description: string;
  icon: string;
  damagePerTurn: number;
  skipTurnChance: number;
  duration: number;
}> = {
  burn: {
    name: 'Burn',
    description: 'Takes damage each turn',
    icon: '🔥',
    damagePerTurn: 0.0625, // 1/16 of max HP
    skipTurnChance: 0,
    duration: 5,
  },
  freeze: {
    name: 'Freeze',
    description: 'Cannot move',
    icon: '❄️',
    damagePerTurn: 0,
    skipTurnChance: 1, // Always skips turn
    duration: 2, // Shorter duration since it's powerful
  },
  stun: {
    name: 'Stun',
    description: 'May skip turn',
    icon: '⚡',
    damagePerTurn: 0,
    skipTurnChance: 0.5,
    duration: 3,
  },
  poison: {
    name: 'Poison',
    description: 'Takes increasing damage each turn',
    icon: '☠️',
    damagePerTurn: 0.0833, // 1/12 of max HP
    skipTurnChance: 0,
    duration: 4,
  },
  sleep: {
    name: 'Sleep',
    description: 'Cannot move',
    icon: '💤',
    damagePerTurn: 0,
    skipTurnChance: 1,
    duration: 3,
  },
};
