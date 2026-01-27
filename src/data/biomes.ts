import { CraftureType } from '@/types/crafture';

export interface BiomeNode {
  id: string;
  biomeId: string;
  x: number; // percentage position
  y: number;
  enemySpeciesId: string;
  enemyLevel: number;
  isBoss: boolean;
  rewards: { coins: number; xp: number };
  unlocksNodes: string[]; // node IDs this unlocks when completed
}

export interface EncounterZone {
  id: string;
  biomeId: string;
  name: string;
  x: number;
  y: number;
  possibleSpecies: string[]; // species IDs that can spawn here
  minLevel: number;
  maxLevel: number;
  unlockRequirement: string | null; // node ID required to unlock
}

export interface Biome {
  id: string;
  name: string;
  description: string;
  type: CraftureType;
  color: string;
  gradient: string;
  unlockRequirement: string | null; // boss node ID required to unlock this biome
  texture: string; // CSS pattern class
}

export const BIOMES: Biome[] = [
  {
    id: 'forest',
    name: 'Emerald Woods',
    description: 'A peaceful forest where forest Craftures roam',
    type: 'forest',
    color: 'bg-green-500',
    gradient: 'from-green-400 to-emerald-500',
    unlockRequirement: null,
    texture: 'forest-texture',
  },
  {
    id: 'fire',
    name: 'Volcanic Peaks',
    description: 'A dangerous volcanic region with fire Craftures',
    type: 'fire',
    color: 'bg-orange-500',
    gradient: 'from-orange-400 to-red-500',
    unlockRequirement: 'forest-boss',
    texture: 'fire-texture',
  },
  {
    id: 'ice',
    name: 'Frozen Tundra',
    description: 'An icy wasteland home to ice Craftures',
    type: 'ice',
    color: 'bg-cyan-500',
    gradient: 'from-cyan-400 to-blue-500',
    unlockRequirement: 'forest-boss',
    texture: 'ice-texture',
  },
  {
    id: 'water',
    name: 'Ocean Depths',
    description: 'Deep underwater caverns with water Craftures',
    type: 'water',
    color: 'bg-blue-500',
    gradient: 'from-blue-400 to-indigo-500',
    unlockRequirement: 'forest-boss',
    texture: 'water-texture',
  },
  {
    id: 'shadow',
    name: 'Shadow Realm',
    description: 'A dark dimension filled with shadow Craftures',
    type: 'shadow',
    color: 'bg-purple-500',
    gradient: 'from-purple-400 to-violet-600',
    unlockRequirement: 'fire-boss',
    texture: 'shadow-texture',
  },
  {
    id: 'flower',
    name: 'Bloom Gardens',
    description: 'Magical gardens bursting with flower Craftures',
    type: 'flower',
    color: 'bg-pink-500',
    gradient: 'from-pink-400 to-rose-500',
    unlockRequirement: 'water-boss',
    texture: 'flower-texture',
  },
  {
    id: 'rock',
    name: 'Stone Caverns',
    description: 'Ancient caverns where rock Craftures dwell',
    type: 'rock',
    color: 'bg-stone-500',
    gradient: 'from-stone-400 to-amber-600',
    unlockRequirement: 'ice-boss',
    texture: 'rock-texture',
  },
  {
    id: 'crystal',
    name: 'Crystal Caves',
    description: 'Glittering crystal caves with rare gem Craftures',
    type: 'ice',
    color: 'bg-purple-400',
    gradient: 'from-purple-300 to-pink-400',
    unlockRequirement: 'rock-boss',
    texture: 'crystal-texture',
  },
  {
    id: 'desert',
    name: 'Scorching Sands',
    description: 'A vast desert with ancient ruins and sand Craftures',
    type: 'rock',
    color: 'bg-amber-500',
    gradient: 'from-amber-400 to-orange-500',
    unlockRequirement: 'shadow-boss',
    texture: 'desert-texture',
  },
  {
    id: 'graveyard',
    name: 'Haunted Graveyard',
    description: 'A spooky graveyard where skeleton Craftures guard ancient tombs',
    type: 'ghost',
    color: 'bg-gray-700',
    gradient: 'from-gray-600 to-slate-800',
    unlockRequirement: 'flower-boss',
    texture: 'graveyard-texture',
  },
  {
    id: 'sky',
    name: 'Sky Realm',
    description: 'A magical realm above the clouds where sky Craftures soar',
    type: 'ice',
    color: 'bg-sky-400',
    gradient: 'from-sky-300 to-blue-400',
    unlockRequirement: 'crystal-boss',
    texture: 'sky-texture',
  },
  {
    id: 'jungle',
    name: 'Ancient Jungle',
    description: 'A dense primordial jungle with vine-covered Craftures',
    type: 'forest',
    color: 'bg-lime-600',
    gradient: 'from-lime-500 to-green-600',
    unlockRequirement: 'graveyard-boss',
    texture: 'jungle-texture',
  },
  {
    id: 'swamp',
    name: 'Toxic Swamp',
    description: 'A murky swamp filled with poisonous Craftures',
    type: 'water',
    color: 'bg-teal-700',
    gradient: 'from-teal-600 to-emerald-800',
    unlockRequirement: 'jungle-boss',
    texture: 'swamp-texture',
  },
  {
    id: 'volcano',
    name: 'Molten Caldera',
    description: 'An active volcano with the most powerful fire Craftures',
    type: 'fire',
    color: 'bg-red-700',
    gradient: 'from-red-600 to-orange-700',
    unlockRequirement: 'swamp-boss',
    texture: 'volcano-texture',
  },
  {
    id: 'coralreef',
    name: 'Coral Reef',
    description: 'A vibrant underwater paradise with coral Craftures',
    type: 'water',
    color: 'bg-pink-400',
    gradient: 'from-pink-300 to-cyan-400',
    unlockRequirement: 'volcano-boss',
    texture: 'coral-texture',
  },
  {
    id: 'arctictundra',
    name: 'Arctic Tundra',
    description: 'Frozen wastelands under the northern lights with arctic Craftures',
    type: 'ice',
    color: 'bg-cyan-200',
    gradient: 'from-cyan-100 to-blue-300',
    unlockRequirement: 'coralreef-boss',
    texture: 'arctic-texture',
  },
];

// Encounter zones - grass patches where you can search for wild Craftures
export const ENCOUNTER_ZONES: EncounterZone[] = [
  // Forest encounters (always available) - 10% chance for Rathalos
  { id: 'forest-grass-1', biomeId: 'forest', name: 'Starter Meadow', x: 55, y: 52, possibleSpecies: ['fluffkin', 'bloomsprout'], minLevel: 1, maxLevel: 3, unlockRequirement: null },
  { id: 'forest-grass-2', biomeId: 'forest', name: 'Deep Woods', x: 42, y: 40, possibleSpecies: ['fluffkin', 'fluffguard', 'bloomsprout', 'floffeon', 'rathalos'], minLevel: 3, maxLevel: 6, unlockRequirement: 'forest-2' },
  { id: 'forest-grass-3', biomeId: 'forest', name: 'Ancient Grove', x: 55, y: 28, possibleSpecies: ['fluffguard', 'floffeon', 'zephkit', 'rathalos'], minLevel: 5, maxLevel: 9, unlockRequirement: 'forest-4' },
  
  // Fire encounters
  { id: 'fire-grass-1', biomeId: 'fire', name: 'Ember Fields', x: 70, y: 16, possibleSpecies: ['emberpuff', 'flarepup'], minLevel: 8, maxLevel: 12, unlockRequirement: 'fire-1' },
  { id: 'fire-grass-2', biomeId: 'fire', name: 'Lava Pools', x: 85, y: 8, possibleSpecies: ['emberpuff', 'embercore', 'infernix'], minLevel: 12, maxLevel: 18, unlockRequirement: 'fire-3' },
  
  // Ice encounters
  { id: 'ice-grass-1', biomeId: 'ice', name: 'Frost Flats', x: 32, y: 10, possibleSpecies: ['frostling', 'crystalpuff'], minLevel: 8, maxLevel: 12, unlockRequirement: 'ice-1' },
  { id: 'ice-grass-2', biomeId: 'ice', name: 'Blizzard Peak', x: 45, y: 8, possibleSpecies: ['frostling', 'frostclaw', 'crystalpuff', 'prismling'], minLevel: 12, maxLevel: 18, unlockRequirement: 'ice-3' },
  
  // Water encounters
  { id: 'water-grass-1', biomeId: 'water', name: 'Shallow Shores', x: 30, y: 16, possibleSpecies: ['bubblefur', 'aquakit'], minLevel: 8, maxLevel: 12, unlockRequirement: 'water-1' },
  { id: 'water-grass-2', biomeId: 'water', name: 'Abyssal Trench', x: 15, y: 8, possibleSpecies: ['bubblefur', 'tidalwave', 'wavecrest'], minLevel: 12, maxLevel: 18, unlockRequirement: 'water-3' },
  
  // Shadow encounters
  { id: 'shadow-grass-1', biomeId: 'shadow', name: 'Void Edge', x: 92, y: 24, possibleSpecies: ['shadowmop', 'spectrepuff'], minLevel: 18, maxLevel: 24, unlockRequirement: 'shadow-1' },
  { id: 'shadow-grass-2', biomeId: 'shadow', name: 'Dark Hollow', x: 92, y: 44, possibleSpecies: ['shadowfiend', 'wraith'], minLevel: 22, maxLevel: 28, unlockRequirement: 'shadow-2' },
  
  // Flower encounters
  { id: 'flower-grass-1', biomeId: 'flower', name: 'Petal Path', x: 8, y: 24, possibleSpecies: ['bloomsprout', 'petalwisp'], minLevel: 18, maxLevel: 24, unlockRequirement: 'flower-1' },
  { id: 'flower-grass-2', biomeId: 'flower', name: 'Rose Garden', x: 8, y: 44, possibleSpecies: ['petalguard', 'bloomsprout'], minLevel: 22, maxLevel: 28, unlockRequirement: 'flower-2' },
  
  // Rock encounters
  { id: 'rock-grass-1', biomeId: 'rock', name: 'Boulder Field', x: 65, y: 8, possibleSpecies: ['pebblite', 'caveling', 'boulderball'], minLevel: 18, maxLevel: 24, unlockRequirement: 'rock-1' },
  { id: 'rock-grass-2', biomeId: 'rock', name: 'Deep Cavern', x: 76, y: 8, possibleSpecies: ['stoneshield', 'caveling', 'stalactite'], minLevel: 22, maxLevel: 28, unlockRequirement: 'rock-2' },
  
  // Crystal encounters
  { id: 'crystal-grass-1', biomeId: 'crystal', name: 'Gem Grotto', x: 94, y: 8, possibleSpecies: ['crystalpuff', 'prismling', 'frostling'], minLevel: 28, maxLevel: 35, unlockRequirement: 'crystal-1' },
  
  // Desert encounters
  { id: 'desert-grass-1', biomeId: 'desert', name: 'Oasis', x: 90, y: 68, possibleSpecies: ['sandfur', 'pebblite'], minLevel: 35, maxLevel: 40, unlockRequirement: 'desert-1' },
  { id: 'desert-grass-2', biomeId: 'desert', name: 'Ancient Ruins', x: 90, y: 80, possibleSpecies: ['sandfur', 'dunecrawler'], minLevel: 38, maxLevel: 45, unlockRequirement: 'desert-2' },
  
  // Graveyard encounters
  { id: 'graveyard-grass-1', biomeId: 'graveyard', name: 'Old Tombstones', x: 10, y: 68, possibleSpecies: ['skeleton', 'spectrepuff'], minLevel: 35, maxLevel: 40, unlockRequirement: 'graveyard-1' },
  { id: 'graveyard-grass-2', biomeId: 'graveyard', name: 'Crypt Entrance', x: 10, y: 80, possibleSpecies: ['skeleton', 'skeletonguard', 'wraith'], minLevel: 38, maxLevel: 45, unlockRequirement: 'graveyard-2' },
  
  // Sky encounters
  { id: 'sky-grass-1', biomeId: 'sky', name: 'Cloud Tops', x: 25, y: 8, possibleSpecies: ['cloudpuff', 'sparkfuzz'], minLevel: 40, maxLevel: 48, unlockRequirement: 'sky-1' },
  { id: 'sky-grass-2', biomeId: 'sky', name: 'Storm Front', x: 35, y: 5, possibleSpecies: ['cloudpuff', 'stormcloud'], minLevel: 45, maxLevel: 55, unlockRequirement: 'sky-2' },
  
  // Jungle encounters
  { id: 'jungle-grass-1', biomeId: 'jungle', name: 'Vine Thicket', x: 15, y: 85, possibleSpecies: ['junglekit', 'zephkit'], minLevel: 48, maxLevel: 55, unlockRequirement: 'jungle-1' },
  { id: 'jungle-grass-2', biomeId: 'jungle', name: 'Ancient Trees', x: 25, y: 90, possibleSpecies: ['junglekit', 'vineguard'], minLevel: 52, maxLevel: 60, unlockRequirement: 'jungle-2' },
  
  // Swamp encounters
  { id: 'swamp-grass-1', biomeId: 'swamp', name: 'Murky Pools', x: 45, y: 92, possibleSpecies: ['murkpuff', 'bubblefur'], minLevel: 55, maxLevel: 62, unlockRequirement: 'swamp-1' },
  { id: 'swamp-grass-2', biomeId: 'swamp', name: 'Poison Bog', x: 55, y: 88, possibleSpecies: ['murkpuff', 'toxifrog'], minLevel: 58, maxLevel: 65, unlockRequirement: 'swamp-2' },
  
  // Volcano encounters
  { id: 'volcano-grass-1', biomeId: 'volcano', name: 'Lava Fields', x: 78, y: 78, possibleSpecies: ['lavapup', 'emberpuff'], minLevel: 60, maxLevel: 68, unlockRequirement: 'volcano-1' },
  { id: 'volcano-grass-2', biomeId: 'volcano', name: 'Magma Chamber', x: 86, y: 84, possibleSpecies: ['lavapup', 'magmacore'], minLevel: 65, maxLevel: 75, unlockRequirement: 'volcano-2' },
  
  // Coral Reef encounters
  { id: 'coralreef-grass-1', biomeId: 'coralreef', name: 'Shallow Reef', x: 96, y: 68, possibleSpecies: ['coralkit', 'aquakit'], minLevel: 72, maxLevel: 80, unlockRequirement: 'coralreef-1' },
  { id: 'coralreef-grass-2', biomeId: 'coralreef', name: 'Deep Reef', x: 96, y: 52, possibleSpecies: ['coralkit', 'reefguard'], minLevel: 78, maxLevel: 88, unlockRequirement: 'coralreef-2' },
  
  // Arctic Tundra encounters
  { id: 'arctictundra-grass-1', biomeId: 'arctictundra', name: 'Frozen Plains', x: 10, y: 6, possibleSpecies: ['tundrakit', 'frostling'], minLevel: 82, maxLevel: 90, unlockRequirement: 'arctictundra-1' },
  { id: 'arctictundra-grass-2', biomeId: 'arctictundra', name: 'Blizzard Peaks', x: 20, y: 6, possibleSpecies: ['tundrakit', 'blizzardwolf'], minLevel: 88, maxLevel: 98, unlockRequirement: 'arctictundra-2' },
];

// Node positions for visual map layout - EXPANDED MAP with better spacing
export const BIOME_NODES: BiomeNode[] = [
  // ======= FOREST BIOME (Center) =======
  { id: 'forest-1', biomeId: 'forest', x: 50, y: 58, enemySpeciesId: 'fluffkin', enemyLevel: 2, isBoss: false, rewards: { coins: 40, xp: 25 }, unlocksNodes: ['forest-2'] },
  { id: 'forest-2', biomeId: 'forest', x: 44, y: 50, enemySpeciesId: 'fluffkin', enemyLevel: 3, isBoss: false, rewards: { coins: 50, xp: 35 }, unlocksNodes: ['forest-3'] },
  { id: 'forest-3', biomeId: 'forest', x: 52, y: 44, enemySpeciesId: 'fluffguard', enemyLevel: 5, isBoss: false, rewards: { coins: 70, xp: 50 }, unlocksNodes: ['forest-4'] },
  { id: 'forest-4', biomeId: 'forest', x: 46, y: 38, enemySpeciesId: 'fluffguard', enemyLevel: 7, isBoss: false, rewards: { coins: 90, xp: 70 }, unlocksNodes: ['forest-5'] },
  { id: 'forest-5', biomeId: 'forest', x: 50, y: 32, enemySpeciesId: 'floffeon', enemyLevel: 8, isBoss: false, rewards: { coins: 110, xp: 90 }, unlocksNodes: ['forest-boss'] },
  { id: 'forest-boss', biomeId: 'forest', x: 50, y: 26, enemySpeciesId: 'fluffemperor', enemyLevel: 10, isBoss: true, rewards: { coins: 250, xp: 180 }, unlocksNodes: ['fire-1', 'ice-1', 'water-1'] },

  // ======= FIRE BIOME (Right side) =======
  { id: 'fire-1', biomeId: 'fire', x: 62, y: 22, enemySpeciesId: 'emberpuff', enemyLevel: 10, isBoss: false, rewards: { coins: 100, xp: 80 }, unlocksNodes: ['fire-2'] },
  { id: 'fire-2', biomeId: 'fire', x: 68, y: 17, enemySpeciesId: 'flarepup', enemyLevel: 12, isBoss: false, rewards: { coins: 110, xp: 88 }, unlocksNodes: ['fire-3'] },
  { id: 'fire-3', biomeId: 'fire', x: 74, y: 12, enemySpeciesId: 'embercore', enemyLevel: 14, isBoss: false, rewards: { coins: 130, xp: 100 }, unlocksNodes: ['fire-4'] },
  { id: 'fire-4', biomeId: 'fire', x: 78, y: 7, enemySpeciesId: 'infernix', enemyLevel: 16, isBoss: false, rewards: { coins: 150, xp: 120 }, unlocksNodes: ['fire-5'] },
  { id: 'fire-5', biomeId: 'fire', x: 82, y: 12, enemySpeciesId: 'infernolord', enemyLevel: 18, isBoss: false, rewards: { coins: 180, xp: 140 }, unlocksNodes: ['fire-boss'] },
  { id: 'fire-boss', biomeId: 'fire', x: 86, y: 7, enemySpeciesId: 'infernolord', enemyLevel: 22, isBoss: true, rewards: { coins: 400, xp: 300 }, unlocksNodes: ['shadow-1'] },

  // ======= ICE BIOME (Top center-left) =======
  { id: 'ice-1', biomeId: 'ice', x: 38, y: 20, enemySpeciesId: 'frostling', enemyLevel: 10, isBoss: false, rewards: { coins: 100, xp: 80 }, unlocksNodes: ['ice-2'] },
  { id: 'ice-2', biomeId: 'ice', x: 34, y: 14, enemySpeciesId: 'crystalpuff', enemyLevel: 12, isBoss: false, rewards: { coins: 110, xp: 88 }, unlocksNodes: ['ice-3'] },
  { id: 'ice-3', biomeId: 'ice', x: 40, y: 8, enemySpeciesId: 'frostclaw', enemyLevel: 14, isBoss: false, rewards: { coins: 130, xp: 100 }, unlocksNodes: ['ice-4'] },
  { id: 'ice-4', biomeId: 'ice', x: 46, y: 12, enemySpeciesId: 'frostclaw', enemyLevel: 16, isBoss: false, rewards: { coins: 150, xp: 120 }, unlocksNodes: ['ice-5'] },
  { id: 'ice-5', biomeId: 'ice', x: 52, y: 8, enemySpeciesId: 'frostmonarch', enemyLevel: 18, isBoss: false, rewards: { coins: 180, xp: 140 }, unlocksNodes: ['ice-boss'] },
  { id: 'ice-boss', biomeId: 'ice', x: 56, y: 14, enemySpeciesId: 'frostmonarch', enemyLevel: 22, isBoss: true, rewards: { coins: 400, xp: 300 }, unlocksNodes: ['rock-1'] },

  // ======= WATER BIOME (Left side) =======
  { id: 'water-1', biomeId: 'water', x: 38, y: 26, enemySpeciesId: 'bubblefur', enemyLevel: 10, isBoss: false, rewards: { coins: 100, xp: 80 }, unlocksNodes: ['water-2'] },
  { id: 'water-2', biomeId: 'water', x: 30, y: 22, enemySpeciesId: 'aquakit', enemyLevel: 12, isBoss: false, rewards: { coins: 110, xp: 88 }, unlocksNodes: ['water-3'] },
  { id: 'water-3', biomeId: 'water', x: 24, y: 17, enemySpeciesId: 'tidalwave', enemyLevel: 14, isBoss: false, rewards: { coins: 130, xp: 100 }, unlocksNodes: ['water-4'] },
  { id: 'water-4', biomeId: 'water', x: 18, y: 12, enemySpeciesId: 'wavecrest', enemyLevel: 16, isBoss: false, rewards: { coins: 150, xp: 120 }, unlocksNodes: ['water-5'] },
  { id: 'water-5', biomeId: 'water', x: 14, y: 7, enemySpeciesId: 'oceanking', enemyLevel: 18, isBoss: false, rewards: { coins: 180, xp: 140 }, unlocksNodes: ['water-boss'] },
  { id: 'water-boss', biomeId: 'water', x: 8, y: 14, enemySpeciesId: 'oceanking', enemyLevel: 22, isBoss: true, rewards: { coins: 400, xp: 300 }, unlocksNodes: ['flower-1'] },

  // ======= SHADOW BIOME (Far Right) =======
  { id: 'shadow-1', biomeId: 'shadow', x: 92, y: 14, enemySpeciesId: 'shadowmop', enemyLevel: 22, isBoss: false, rewards: { coins: 180, xp: 150 }, unlocksNodes: ['shadow-2'] },
  { id: 'shadow-2', biomeId: 'shadow', x: 94, y: 22, enemySpeciesId: 'spectrepuff', enemyLevel: 24, isBoss: false, rewards: { coins: 200, xp: 165 }, unlocksNodes: ['shadow-3'] },
  { id: 'shadow-3', biomeId: 'shadow', x: 92, y: 30, enemySpeciesId: 'shadowfiend', enemyLevel: 28, isBoss: false, rewards: { coins: 240, xp: 195 }, unlocksNodes: ['shadow-4'] },
  { id: 'shadow-4', biomeId: 'shadow', x: 94, y: 38, enemySpeciesId: 'wraith', enemyLevel: 32, isBoss: false, rewards: { coins: 280, xp: 225 }, unlocksNodes: ['shadow-boss'] },
  { id: 'shadow-boss', biomeId: 'shadow', x: 92, y: 46, enemySpeciesId: 'voidlord', enemyLevel: 35, isBoss: true, rewards: { coins: 600, xp: 450 }, unlocksNodes: ['desert-1'] },

  // ======= FLOWER BIOME (Far Left) =======
  { id: 'flower-1', biomeId: 'flower', x: 4, y: 20, enemySpeciesId: 'bloomsprout', enemyLevel: 22, isBoss: false, rewards: { coins: 180, xp: 150 }, unlocksNodes: ['flower-2'] },
  { id: 'flower-2', biomeId: 'flower', x: 6, y: 28, enemySpeciesId: 'petalwisp', enemyLevel: 24, isBoss: false, rewards: { coins: 200, xp: 165 }, unlocksNodes: ['flower-3'] },
  { id: 'flower-3', biomeId: 'flower', x: 4, y: 36, enemySpeciesId: 'petalguard', enemyLevel: 28, isBoss: false, rewards: { coins: 240, xp: 195 }, unlocksNodes: ['flower-4'] },
  { id: 'flower-4', biomeId: 'flower', x: 6, y: 44, enemySpeciesId: 'petalguard', enemyLevel: 32, isBoss: false, rewards: { coins: 280, xp: 225 }, unlocksNodes: ['flower-boss'] },
  { id: 'flower-boss', biomeId: 'flower', x: 4, y: 52, enemySpeciesId: 'bloomqueen', enemyLevel: 35, isBoss: true, rewards: { coins: 600, xp: 450 }, unlocksNodes: ['graveyard-1'] },

  // ======= ROCK BIOME (Top Right) =======
  { id: 'rock-1', biomeId: 'rock', x: 62, y: 8, enemySpeciesId: 'pebblite', enemyLevel: 22, isBoss: false, rewards: { coins: 180, xp: 150 }, unlocksNodes: ['rock-2'] },
  { id: 'rock-2', biomeId: 'rock', x: 66, y: 14, enemySpeciesId: 'caveling', enemyLevel: 24, isBoss: false, rewards: { coins: 200, xp: 165 }, unlocksNodes: ['rock-3'] },
  { id: 'rock-3', biomeId: 'rock', x: 70, y: 8, enemySpeciesId: 'stoneshield', enemyLevel: 28, isBoss: false, rewards: { coins: 240, xp: 195 }, unlocksNodes: ['rock-4'] },
  { id: 'rock-4', biomeId: 'rock', x: 74, y: 14, enemySpeciesId: 'golemite', enemyLevel: 32, isBoss: false, rewards: { coins: 280, xp: 225 }, unlocksNodes: ['rock-boss'] },
  { id: 'rock-boss', biomeId: 'rock', x: 78, y: 8, enemySpeciesId: 'mountainlord', enemyLevel: 35, isBoss: true, rewards: { coins: 600, xp: 450 }, unlocksNodes: ['crystal-1'] },
  
  // ======= CRYSTAL BIOME (Top Far Right) =======
  { id: 'crystal-1', biomeId: 'crystal', x: 84, y: 14, enemySpeciesId: 'crystalpuff', enemyLevel: 35, isBoss: false, rewards: { coins: 300, xp: 250 }, unlocksNodes: ['crystal-2'] },
  { id: 'crystal-2', biomeId: 'crystal', x: 88, y: 8, enemySpeciesId: 'prismling', enemyLevel: 38, isBoss: false, rewards: { coins: 350, xp: 280 }, unlocksNodes: ['crystal-boss'] },
  { id: 'crystal-boss', biomeId: 'crystal', x: 92, y: 4, enemySpeciesId: 'crystalarch', enemyLevel: 40, isBoss: true, rewards: { coins: 800, xp: 600 }, unlocksNodes: ['sky-1'] },
  
  // ======= DESERT BIOME (Right Side Lower) =======
  { id: 'desert-1', biomeId: 'desert', x: 90, y: 52, enemySpeciesId: 'sandfur', enemyLevel: 38, isBoss: false, rewards: { coins: 350, xp: 280 }, unlocksNodes: ['desert-2'] },
  { id: 'desert-2', biomeId: 'desert', x: 86, y: 58, enemySpeciesId: 'dunecrawler', enemyLevel: 42, isBoss: false, rewards: { coins: 400, xp: 320 }, unlocksNodes: ['desert-3'] },
  { id: 'desert-3', biomeId: 'desert', x: 90, y: 64, enemySpeciesId: 'dunecrawler', enemyLevel: 45, isBoss: false, rewards: { coins: 450, xp: 360 }, unlocksNodes: ['desert-boss'] },
  { id: 'desert-boss', biomeId: 'desert', x: 86, y: 70, enemySpeciesId: 'desertlord', enemyLevel: 50, isBoss: true, rewards: { coins: 1000, xp: 800 }, unlocksNodes: [] },
  
  // ======= GRAVEYARD BIOME (Left Side Lower) =======
  { id: 'graveyard-1', biomeId: 'graveyard', x: 8, y: 58, enemySpeciesId: 'skeleton', enemyLevel: 38, isBoss: false, rewards: { coins: 350, xp: 280 }, unlocksNodes: ['graveyard-2'] },
  { id: 'graveyard-2', biomeId: 'graveyard', x: 12, y: 64, enemySpeciesId: 'skeletonguard', enemyLevel: 42, isBoss: false, rewards: { coins: 400, xp: 320 }, unlocksNodes: ['graveyard-3'] },
  { id: 'graveyard-3', biomeId: 'graveyard', x: 8, y: 70, enemySpeciesId: 'skeletonguard', enemyLevel: 45, isBoss: false, rewards: { coins: 450, xp: 360 }, unlocksNodes: ['graveyard-boss'] },
  { id: 'graveyard-boss', biomeId: 'graveyard', x: 12, y: 76, enemySpeciesId: 'prisonguard', enemyLevel: 50, isBoss: true, rewards: { coins: 1000, xp: 800 }, unlocksNodes: ['jungle-1'] },
  
  // ======= SKY REALM BIOME (Top Left - after Crystal) =======
  { id: 'sky-1', biomeId: 'sky', x: 28, y: 6, enemySpeciesId: 'cloudpuff', enemyLevel: 45, isBoss: false, rewards: { coins: 400, xp: 350 }, unlocksNodes: ['sky-2'] },
  { id: 'sky-2', biomeId: 'sky', x: 34, y: 2, enemySpeciesId: 'stormcloud', enemyLevel: 50, isBoss: false, rewards: { coins: 500, xp: 420 }, unlocksNodes: ['sky-3'] },
  { id: 'sky-3', biomeId: 'sky', x: 40, y: 6, enemySpeciesId: 'stormcloud', enemyLevel: 55, isBoss: false, rewards: { coins: 600, xp: 500 }, unlocksNodes: ['sky-boss'] },
  { id: 'sky-boss', biomeId: 'sky', x: 46, y: 2, enemySpeciesId: 'skylord', enemyLevel: 60, isBoss: true, rewards: { coins: 1500, xp: 1200 }, unlocksNodes: [] },
  
  // ======= JUNGLE BIOME (Bottom Left - after Graveyard) =======
  { id: 'jungle-1', biomeId: 'jungle', x: 18, y: 80, enemySpeciesId: 'junglekit', enemyLevel: 52, isBoss: false, rewards: { coins: 500, xp: 400 }, unlocksNodes: ['jungle-2'] },
  { id: 'jungle-2', biomeId: 'jungle', x: 24, y: 86, enemySpeciesId: 'vineguard', enemyLevel: 56, isBoss: false, rewards: { coins: 600, xp: 480 }, unlocksNodes: ['jungle-3'] },
  { id: 'jungle-3', biomeId: 'jungle', x: 30, y: 80, enemySpeciesId: 'vineguard', enemyLevel: 60, isBoss: false, rewards: { coins: 700, xp: 560 }, unlocksNodes: ['jungle-boss'] },
  { id: 'jungle-boss', biomeId: 'jungle', x: 36, y: 86, enemySpeciesId: 'jungleking', enemyLevel: 65, isBoss: true, rewards: { coins: 1800, xp: 1400 }, unlocksNodes: ['swamp-1'] },
  
  // ======= SWAMP BIOME (Bottom Center - after Jungle) =======
  { id: 'swamp-1', biomeId: 'swamp', x: 44, y: 82, enemySpeciesId: 'murkpuff', enemyLevel: 58, isBoss: false, rewards: { coins: 600, xp: 480 }, unlocksNodes: ['swamp-2'] },
  { id: 'swamp-2', biomeId: 'swamp', x: 52, y: 88, enemySpeciesId: 'toxifrog', enemyLevel: 62, isBoss: false, rewards: { coins: 700, xp: 560 }, unlocksNodes: ['swamp-3'] },
  { id: 'swamp-3', biomeId: 'swamp', x: 58, y: 82, enemySpeciesId: 'toxifrog', enemyLevel: 68, isBoss: false, rewards: { coins: 800, xp: 640 }, unlocksNodes: ['swamp-boss'] },
  { id: 'swamp-boss', biomeId: 'swamp', x: 64, y: 88, enemySpeciesId: 'swamplord', enemyLevel: 72, isBoss: true, rewards: { coins: 2000, xp: 1600 }, unlocksNodes: ['volcano-1'] },
  
  // ======= VOLCANO BIOME (Bottom Right - after Swamp) =======
  { id: 'volcano-1', biomeId: 'volcano', x: 72, y: 82, enemySpeciesId: 'lavapup', enemyLevel: 65, isBoss: false, rewards: { coins: 700, xp: 560 }, unlocksNodes: ['volcano-2'] },
  { id: 'volcano-2', biomeId: 'volcano', x: 78, y: 86, enemySpeciesId: 'magmacore', enemyLevel: 70, isBoss: false, rewards: { coins: 800, xp: 640 }, unlocksNodes: ['volcano-3'] },
  { id: 'volcano-3', biomeId: 'volcano', x: 84, y: 82, enemySpeciesId: 'magmacore', enemyLevel: 75, isBoss: false, rewards: { coins: 900, xp: 720 }, unlocksNodes: ['volcano-boss'] },
  { id: 'volcano-boss', biomeId: 'volcano', x: 88, y: 86, enemySpeciesId: 'volcanus', enemyLevel: 80, isBoss: true, rewards: { coins: 2500, xp: 2000 }, unlocksNodes: ['coralreef-1'] },
  
  // ======= CORAL REEF BIOME (Far Right Middle - after Volcano) =======
  { id: 'coralreef-1', biomeId: 'coralreef', x: 94, y: 72, enemySpeciesId: 'coralkit', enemyLevel: 75, isBoss: false, rewards: { coins: 900, xp: 720 }, unlocksNodes: ['coralreef-2'] },
  { id: 'coralreef-2', biomeId: 'coralreef', x: 96, y: 64, enemySpeciesId: 'reefguard', enemyLevel: 80, isBoss: false, rewards: { coins: 1000, xp: 800 }, unlocksNodes: ['coralreef-3'] },
  { id: 'coralreef-3', biomeId: 'coralreef', x: 94, y: 56, enemySpeciesId: 'reefguard', enemyLevel: 85, isBoss: false, rewards: { coins: 1100, xp: 880 }, unlocksNodes: ['coralreef-boss'] },
  { id: 'coralreef-boss', biomeId: 'coralreef', x: 96, y: 48, enemySpeciesId: 'coralemperor', enemyLevel: 90, isBoss: true, rewards: { coins: 3000, xp: 2400 }, unlocksNodes: ['arctictundra-1'] },
  
  // ======= ARCTIC TUNDRA BIOME (Top Far Left - after Coral Reef) =======
  { id: 'arctictundra-1', biomeId: 'arctictundra', x: 6, y: 4, enemySpeciesId: 'tundrakit', enemyLevel: 85, isBoss: false, rewards: { coins: 1100, xp: 880 }, unlocksNodes: ['arctictundra-2'] },
  { id: 'arctictundra-2', biomeId: 'arctictundra', x: 12, y: 2, enemySpeciesId: 'blizzardwolf', enemyLevel: 90, isBoss: false, rewards: { coins: 1200, xp: 960 }, unlocksNodes: ['arctictundra-3'] },
  { id: 'arctictundra-3', biomeId: 'arctictundra', x: 18, y: 4, enemySpeciesId: 'blizzardwolf', enemyLevel: 95, isBoss: false, rewards: { coins: 1300, xp: 1040 }, unlocksNodes: ['arctictundra-boss'] },
  { id: 'arctictundra-boss', biomeId: 'arctictundra', x: 24, y: 2, enemySpeciesId: 'arctictitan', enemyLevel: 100, isBoss: true, rewards: { coins: 5000, xp: 4000 }, unlocksNodes: [] },
];

export function getNodeConnections(): { from: string; to: string }[] {
  const connections: { from: string; to: string }[] = [];
  BIOME_NODES.forEach(node => {
    node.unlocksNodes.forEach(targetId => {
      connections.push({ from: node.id, to: targetId });
    });
  });
  return connections;
}

export function isEncounterZoneUnlocked(zoneId: string, completedNodes: string[]): boolean {
  const zone = ENCOUNTER_ZONES.find(z => z.id === zoneId);
  if (!zone) return false;
  if (!zone.unlockRequirement) return true;
  return completedNodes.includes(zone.unlockRequirement);
}
