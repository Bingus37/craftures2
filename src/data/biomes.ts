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
];

// Encounter zones - grass patches where you can search for wild Craftures
export const ENCOUNTER_ZONES: EncounterZone[] = [
  // Forest encounters (always available) - 10% chance for Rathalos
  { id: 'forest-grass-1', biomeId: 'forest', name: 'Starter Meadow', x: 58, y: 72, possibleSpecies: ['fluffkin', 'bloomsprout'], minLevel: 1, maxLevel: 3, unlockRequirement: null },
  { id: 'forest-grass-2', biomeId: 'forest', name: 'Deep Woods', x: 40, y: 58, possibleSpecies: ['fluffkin', 'fluffguard', 'bloomsprout', 'floffeon', 'rathalos'], minLevel: 3, maxLevel: 6, unlockRequirement: 'forest-2' },
  { id: 'forest-grass-3', biomeId: 'forest', name: 'Ancient Grove', x: 55, y: 45, possibleSpecies: ['fluffguard', 'floffeon', 'zephkit', 'rathalos'], minLevel: 5, maxLevel: 9, unlockRequirement: 'forest-4' },
  
  // Fire encounters
  { id: 'fire-grass-1', biomeId: 'fire', name: 'Ember Fields', x: 68, y: 35, possibleSpecies: ['emberpuff', 'flarepup'], minLevel: 8, maxLevel: 12, unlockRequirement: 'fire-1' },
  { id: 'fire-grass-2', biomeId: 'fire', name: 'Lava Pools', x: 80, y: 22, possibleSpecies: ['emberpuff', 'embercore', 'infernix'], minLevel: 12, maxLevel: 18, unlockRequirement: 'fire-3' },
  
  // Ice encounters
  { id: 'ice-grass-1', biomeId: 'ice', name: 'Frost Flats', x: 42, y: 25, possibleSpecies: ['frostling', 'crystalpuff'], minLevel: 8, maxLevel: 12, unlockRequirement: 'ice-1' },
  { id: 'ice-grass-2', biomeId: 'ice', name: 'Blizzard Peak', x: 52, y: 12, possibleSpecies: ['frostling', 'frostclaw', 'crystalpuff', 'prismling'], minLevel: 12, maxLevel: 18, unlockRequirement: 'ice-3' },
  
  // Water encounters
  { id: 'water-grass-1', biomeId: 'water', name: 'Shallow Shores', x: 28, y: 38, possibleSpecies: ['bubblefur', 'aquakit'], minLevel: 8, maxLevel: 12, unlockRequirement: 'water-1' },
  { id: 'water-grass-2', biomeId: 'water', name: 'Abyssal Trench', x: 15, y: 22, possibleSpecies: ['bubblefur', 'tidalwave', 'wavecrest'], minLevel: 12, maxLevel: 18, unlockRequirement: 'water-3' },
  
  // Shadow encounters
  { id: 'shadow-grass-1', biomeId: 'shadow', name: 'Void Edge', x: 88, y: 38, possibleSpecies: ['shadowmop', 'spectrepuff'], minLevel: 18, maxLevel: 24, unlockRequirement: 'shadow-1' },
  { id: 'shadow-grass-2', biomeId: 'shadow', name: 'Dark Hollow', x: 92, y: 48, possibleSpecies: ['shadowfiend', 'wraith'], minLevel: 22, maxLevel: 28, unlockRequirement: 'shadow-2' },
  
  // Flower encounters
  { id: 'flower-grass-1', biomeId: 'flower', name: 'Petal Path', x: 10, y: 30, possibleSpecies: ['bloomsprout', 'petalwisp'], minLevel: 18, maxLevel: 24, unlockRequirement: 'flower-1' },
  { id: 'flower-grass-2', biomeId: 'flower', name: 'Rose Garden', x: 8, y: 45, possibleSpecies: ['petalguard', 'bloomsprout'], minLevel: 22, maxLevel: 28, unlockRequirement: 'flower-2' },
  
  // Rock encounters
  { id: 'rock-grass-1', biomeId: 'rock', name: 'Boulder Field', x: 58, y: 8, possibleSpecies: ['pebblite', 'caveling', 'boulderball'], minLevel: 18, maxLevel: 24, unlockRequirement: 'rock-1' },
  { id: 'rock-grass-2', biomeId: 'rock', name: 'Deep Cavern', x: 72, y: 6, possibleSpecies: ['stoneshield', 'caveling', 'stalactite'], minLevel: 22, maxLevel: 28, unlockRequirement: 'rock-2' },
  
  // Crystal encounters
  { id: 'crystal-grass-1', biomeId: 'crystal', name: 'Gem Grotto', x: 85, y: 8, possibleSpecies: ['crystalpuff', 'prismling', 'frostling'], minLevel: 28, maxLevel: 35, unlockRequirement: 'crystal-1' },
  
  // Desert encounters
  { id: 'desert-grass-1', biomeId: 'desert', name: 'Oasis', x: 95, y: 62, possibleSpecies: ['sandfur', 'pebblite'], minLevel: 35, maxLevel: 40, unlockRequirement: 'desert-1' },
  { id: 'desert-grass-2', biomeId: 'desert', name: 'Ancient Ruins', x: 92, y: 72, possibleSpecies: ['sandfur', 'dunecrawler'], minLevel: 38, maxLevel: 45, unlockRequirement: 'desert-2' },
  
  // Graveyard encounters
  { id: 'graveyard-grass-1', biomeId: 'graveyard', name: 'Old Tombstones', x: 6, y: 62, possibleSpecies: ['skeleton', 'spectrepuff'], minLevel: 35, maxLevel: 40, unlockRequirement: 'graveyard-1' },
  { id: 'graveyard-grass-2', biomeId: 'graveyard', name: 'Crypt Entrance', x: 8, y: 72, possibleSpecies: ['skeleton', 'skeletonguard', 'wraith'], minLevel: 38, maxLevel: 45, unlockRequirement: 'graveyard-2' },
];

// Node positions for visual map layout
export const BIOME_NODES: BiomeNode[] = [
  // ======= FOREST BIOME (Center-Bottom) =======
  { id: 'forest-1', biomeId: 'forest', x: 50, y: 78, enemySpeciesId: 'fluffkin', enemyLevel: 2, isBoss: false, rewards: { coins: 40, xp: 25 }, unlocksNodes: ['forest-2'] },
  { id: 'forest-2', biomeId: 'forest', x: 45, y: 68, enemySpeciesId: 'fluffkin', enemyLevel: 3, isBoss: false, rewards: { coins: 50, xp: 35 }, unlocksNodes: ['forest-3'] },
  { id: 'forest-3', biomeId: 'forest', x: 52, y: 58, enemySpeciesId: 'fluffguard', enemyLevel: 5, isBoss: false, rewards: { coins: 70, xp: 50 }, unlocksNodes: ['forest-4'] },
  { id: 'forest-4', biomeId: 'forest', x: 48, y: 50, enemySpeciesId: 'fluffguard', enemyLevel: 7, isBoss: false, rewards: { coins: 90, xp: 70 }, unlocksNodes: ['forest-5'] },
  { id: 'forest-5', biomeId: 'forest', x: 50, y: 44, enemySpeciesId: 'floffeon', enemyLevel: 8, isBoss: false, rewards: { coins: 110, xp: 90 }, unlocksNodes: ['forest-boss'] },
  { id: 'forest-boss', biomeId: 'forest', x: 50, y: 38, enemySpeciesId: 'fluffemperor', enemyLevel: 10, isBoss: true, rewards: { coins: 250, xp: 180 }, unlocksNodes: ['fire-1', 'ice-1', 'water-1'] },

  // ======= FIRE BIOME (Right side) =======
  { id: 'fire-1', biomeId: 'fire', x: 62, y: 36, enemySpeciesId: 'emberpuff', enemyLevel: 10, isBoss: false, rewards: { coins: 100, xp: 80 }, unlocksNodes: ['fire-2'] },
  { id: 'fire-2', biomeId: 'fire', x: 68, y: 32, enemySpeciesId: 'flarepup', enemyLevel: 12, isBoss: false, rewards: { coins: 110, xp: 88 }, unlocksNodes: ['fire-3'] },
  { id: 'fire-3', biomeId: 'fire', x: 74, y: 28, enemySpeciesId: 'embercore', enemyLevel: 14, isBoss: false, rewards: { coins: 130, xp: 100 }, unlocksNodes: ['fire-4'] },
  { id: 'fire-4', biomeId: 'fire', x: 80, y: 22, enemySpeciesId: 'infernix', enemyLevel: 16, isBoss: false, rewards: { coins: 150, xp: 120 }, unlocksNodes: ['fire-5'] },
  { id: 'fire-5', biomeId: 'fire', x: 85, y: 18, enemySpeciesId: 'infernolord', enemyLevel: 18, isBoss: false, rewards: { coins: 180, xp: 140 }, unlocksNodes: ['fire-boss'] },
  { id: 'fire-boss', biomeId: 'fire', x: 90, y: 14, enemySpeciesId: 'infernolord', enemyLevel: 22, isBoss: true, rewards: { coins: 400, xp: 300 }, unlocksNodes: ['shadow-1'] },

  // ======= ICE BIOME (Top center) =======
  { id: 'ice-1', biomeId: 'ice', x: 48, y: 32, enemySpeciesId: 'frostling', enemyLevel: 10, isBoss: false, rewards: { coins: 100, xp: 80 }, unlocksNodes: ['ice-2'] },
  { id: 'ice-2', biomeId: 'ice', x: 50, y: 26, enemySpeciesId: 'crystalpuff', enemyLevel: 12, isBoss: false, rewards: { coins: 110, xp: 88 }, unlocksNodes: ['ice-3'] },
  { id: 'ice-3', biomeId: 'ice', x: 46, y: 20, enemySpeciesId: 'frostclaw', enemyLevel: 14, isBoss: false, rewards: { coins: 130, xp: 100 }, unlocksNodes: ['ice-4'] },
  { id: 'ice-4', biomeId: 'ice', x: 50, y: 14, enemySpeciesId: 'frostclaw', enemyLevel: 16, isBoss: false, rewards: { coins: 150, xp: 120 }, unlocksNodes: ['ice-5'] },
  { id: 'ice-5', biomeId: 'ice', x: 48, y: 10, enemySpeciesId: 'frostmonarch', enemyLevel: 18, isBoss: false, rewards: { coins: 180, xp: 140 }, unlocksNodes: ['ice-boss'] },
  { id: 'ice-boss', biomeId: 'ice', x: 50, y: 5, enemySpeciesId: 'frostmonarch', enemyLevel: 22, isBoss: true, rewards: { coins: 400, xp: 300 }, unlocksNodes: ['rock-1'] },

  // ======= WATER BIOME (Left side) =======
  { id: 'water-1', biomeId: 'water', x: 38, y: 36, enemySpeciesId: 'bubblefur', enemyLevel: 10, isBoss: false, rewards: { coins: 100, xp: 80 }, unlocksNodes: ['water-2'] },
  { id: 'water-2', biomeId: 'water', x: 32, y: 32, enemySpeciesId: 'aquakit', enemyLevel: 12, isBoss: false, rewards: { coins: 110, xp: 88 }, unlocksNodes: ['water-3'] },
  { id: 'water-3', biomeId: 'water', x: 26, y: 28, enemySpeciesId: 'tidalwave', enemyLevel: 14, isBoss: false, rewards: { coins: 130, xp: 100 }, unlocksNodes: ['water-4'] },
  { id: 'water-4', biomeId: 'water', x: 20, y: 22, enemySpeciesId: 'wavecrest', enemyLevel: 16, isBoss: false, rewards: { coins: 150, xp: 120 }, unlocksNodes: ['water-5'] },
  { id: 'water-5', biomeId: 'water', x: 15, y: 18, enemySpeciesId: 'oceanking', enemyLevel: 18, isBoss: false, rewards: { coins: 180, xp: 140 }, unlocksNodes: ['water-boss'] },
  { id: 'water-boss', biomeId: 'water', x: 10, y: 14, enemySpeciesId: 'oceanking', enemyLevel: 22, isBoss: true, rewards: { coins: 400, xp: 300 }, unlocksNodes: ['flower-1'] },

  // ======= SHADOW BIOME (Far Right) =======
  { id: 'shadow-1', biomeId: 'shadow', x: 92, y: 22, enemySpeciesId: 'shadowmop', enemyLevel: 22, isBoss: false, rewards: { coins: 180, xp: 150 }, unlocksNodes: ['shadow-2'] },
  { id: 'shadow-2', biomeId: 'shadow', x: 94, y: 30, enemySpeciesId: 'spectrepuff', enemyLevel: 24, isBoss: false, rewards: { coins: 200, xp: 165 }, unlocksNodes: ['shadow-3'] },
  { id: 'shadow-3', biomeId: 'shadow', x: 92, y: 38, enemySpeciesId: 'shadowfiend', enemyLevel: 28, isBoss: false, rewards: { coins: 240, xp: 195 }, unlocksNodes: ['shadow-4'] },
  { id: 'shadow-4', biomeId: 'shadow', x: 90, y: 46, enemySpeciesId: 'wraith', enemyLevel: 32, isBoss: false, rewards: { coins: 280, xp: 225 }, unlocksNodes: ['shadow-boss'] },
  { id: 'shadow-boss', biomeId: 'shadow', x: 92, y: 54, enemySpeciesId: 'voidlord', enemyLevel: 35, isBoss: true, rewards: { coins: 600, xp: 450 }, unlocksNodes: ['desert-1'] },

  // ======= FLOWER BIOME (Far Left) =======
  { id: 'flower-1', biomeId: 'flower', x: 8, y: 22, enemySpeciesId: 'bloomsprout', enemyLevel: 22, isBoss: false, rewards: { coins: 180, xp: 150 }, unlocksNodes: ['flower-2'] },
  { id: 'flower-2', biomeId: 'flower', x: 6, y: 30, enemySpeciesId: 'petalwisp', enemyLevel: 24, isBoss: false, rewards: { coins: 200, xp: 165 }, unlocksNodes: ['flower-3'] },
  { id: 'flower-3', biomeId: 'flower', x: 8, y: 38, enemySpeciesId: 'petalguard', enemyLevel: 28, isBoss: false, rewards: { coins: 240, xp: 195 }, unlocksNodes: ['flower-4'] },
  { id: 'flower-4', biomeId: 'flower', x: 10, y: 46, enemySpeciesId: 'petalguard', enemyLevel: 32, isBoss: false, rewards: { coins: 280, xp: 225 }, unlocksNodes: ['flower-boss'] },
  { id: 'flower-boss', biomeId: 'flower', x: 8, y: 54, enemySpeciesId: 'bloomqueen', enemyLevel: 35, isBoss: true, rewards: { coins: 600, xp: 450 }, unlocksNodes: ['graveyard-1'] },

  // ======= ROCK BIOME (Top) =======
  { id: 'rock-1', biomeId: 'rock', x: 58, y: 5, enemySpeciesId: 'pebblite', enemyLevel: 22, isBoss: false, rewards: { coins: 180, xp: 150 }, unlocksNodes: ['rock-2'] },
  { id: 'rock-2', biomeId: 'rock', x: 66, y: 6, enemySpeciesId: 'caveling', enemyLevel: 24, isBoss: false, rewards: { coins: 200, xp: 165 }, unlocksNodes: ['rock-3'] },
  { id: 'rock-3', biomeId: 'rock', x: 74, y: 5, enemySpeciesId: 'stoneshield', enemyLevel: 28, isBoss: false, rewards: { coins: 240, xp: 195 }, unlocksNodes: ['rock-4'] },
  { id: 'rock-4', biomeId: 'rock', x: 80, y: 6, enemySpeciesId: 'golemite', enemyLevel: 32, isBoss: false, rewards: { coins: 280, xp: 225 }, unlocksNodes: ['rock-boss'] },
  { id: 'rock-boss', biomeId: 'rock', x: 86, y: 5, enemySpeciesId: 'mountainlord', enemyLevel: 35, isBoss: true, rewards: { coins: 600, xp: 450 }, unlocksNodes: ['crystal-1'] },
  
  // ======= CRYSTAL BIOME (Top Right) =======
  { id: 'crystal-1', biomeId: 'crystal', x: 90, y: 8, enemySpeciesId: 'crystalpuff', enemyLevel: 35, isBoss: false, rewards: { coins: 300, xp: 250 }, unlocksNodes: ['crystal-2'] },
  { id: 'crystal-2', biomeId: 'crystal', x: 94, y: 5, enemySpeciesId: 'prismling', enemyLevel: 38, isBoss: false, rewards: { coins: 350, xp: 280 }, unlocksNodes: ['crystal-boss'] },
  { id: 'crystal-boss', biomeId: 'crystal', x: 96, y: 10, enemySpeciesId: 'crystalarch', enemyLevel: 40, isBoss: true, rewards: { coins: 800, xp: 600 }, unlocksNodes: [] },
  
  // ======= DESERT BIOME (Bottom Right) =======
  { id: 'desert-1', biomeId: 'desert', x: 94, y: 58, enemySpeciesId: 'sandfur', enemyLevel: 38, isBoss: false, rewards: { coins: 350, xp: 280 }, unlocksNodes: ['desert-2'] },
  { id: 'desert-2', biomeId: 'desert', x: 92, y: 66, enemySpeciesId: 'dunecrawler', enemyLevel: 42, isBoss: false, rewards: { coins: 400, xp: 320 }, unlocksNodes: ['desert-3'] },
  { id: 'desert-3', biomeId: 'desert', x: 94, y: 74, enemySpeciesId: 'dunecrawler', enemyLevel: 45, isBoss: false, rewards: { coins: 450, xp: 360 }, unlocksNodes: ['desert-boss'] },
  { id: 'desert-boss', biomeId: 'desert', x: 92, y: 82, enemySpeciesId: 'desertlord', enemyLevel: 50, isBoss: true, rewards: { coins: 1000, xp: 800 }, unlocksNodes: [] },
  
  // ======= GRAVEYARD BIOME (Bottom Left - after Flower) =======
  { id: 'graveyard-1', biomeId: 'graveyard', x: 6, y: 58, enemySpeciesId: 'skeleton', enemyLevel: 38, isBoss: false, rewards: { coins: 350, xp: 280 }, unlocksNodes: ['graveyard-2'] },
  { id: 'graveyard-2', biomeId: 'graveyard', x: 8, y: 66, enemySpeciesId: 'skeletonguard', enemyLevel: 42, isBoss: false, rewards: { coins: 400, xp: 320 }, unlocksNodes: ['graveyard-3'] },
  { id: 'graveyard-3', biomeId: 'graveyard', x: 6, y: 74, enemySpeciesId: 'skeletonguard', enemyLevel: 45, isBoss: false, rewards: { coins: 450, xp: 360 }, unlocksNodes: ['graveyard-boss'] },
  { id: 'graveyard-boss', biomeId: 'graveyard', x: 8, y: 82, enemySpeciesId: 'prisonguard', enemyLevel: 50, isBoss: true, rewards: { coins: 1000, xp: 800 }, unlocksNodes: [] },
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
