import { CraftureType } from '@/types/crafture';

// Hybrid images
import craftureSteamfury from '@/assets/crafture-steamfury.png';
import craftureEmberfuzz from '@/assets/crafture-emberfuzz.png';
import craftureFrostide from '@/assets/crafture-frostide.png';
import craftureVoltflare from '@/assets/crafture-voltflare.png';
import craftureVoidspirit from '@/assets/crafture-voidspirit.png';
import craftureLilywave from '@/assets/crafture-lilywave.png';
import craftureShockstone from '@/assets/crafture-shockstone.png';
import craftureFrostfuzz from '@/assets/crafture-frostfuzz.png';
import craftureBlazepetal from '@/assets/crafture-blazepetal.png';
import craftureFrostspirit from '@/assets/crafture-frostspirit.png';
import craftureCybervolt from '@/assets/crafture-cybervolt.png';
import craftureRainpuff from '@/assets/crafture-rainpuff.png';
import craftureForgekit from '@/assets/crafture-forgekit.png';
import craftureMeadowpuff from '@/assets/crafture-meadowpuff.png';
import craftureStormtide from '@/assets/crafture-stormtide.png';
import craftureShadowflame from '@/assets/crafture-shadowflame.png';
import craftureFroststone from '@/assets/crafture-froststone.png';
import craftureSparkswamp from '@/assets/crafture-sparkswamp.png';
import craftureSuncloud from '@/assets/crafture-suncloud.png';
import crafturePhantomcrystal from '@/assets/crafture-phantomcrystal.png';
import craftureRainfern from '@/assets/crafture-rainfern.png';
import craftureFrostgear from '@/assets/crafture-frostgear.png';
import craftureBlazebone from '@/assets/crafture-blazebone.png';
import craftureShockreef from '@/assets/crafture-shockreef.png';
import crafturePhantomdream from '@/assets/crafture-phantomdream.png';

export interface HybridRecipe {
  id: string;
  name: string;
  parentType1: CraftureType;
  parentType2: CraftureType;
  resultType: CraftureType;
  image: string;
  description: string;
  breedingTime: number; // in seconds
  coinCost: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  baseStats: {
    attack: number;
    defense: number;
    speed: number;
  };
}

export const hybridRecipes: HybridRecipe[] = [
  {
    id: 'steamfury',
    name: 'Steamfury',
    parentType1: 'fire',
    parentType2: 'ice',
    resultType: 'water',
    image: craftureSteamfury,
    description: 'Born from the clash of fire and ice, this steaming furball channels both elements.',
    breedingTime: 120,
    coinCost: 200,
    rarity: 'rare',
    baseStats: { attack: 75, defense: 60, speed: 70 },
  },
  {
    id: 'emberfuzz',
    name: 'Emberfuzz',
    parentType1: 'forest',
    parentType2: 'fire',
    resultType: 'fire',
    image: craftureEmberfuzz,
    description: 'A forest creature touched by flames, with smoldering fur and leafy embers.',
    breedingTime: 90,
    coinCost: 150,
    rarity: 'uncommon',
    baseStats: { attack: 70, defense: 45, speed: 65 },
  },
  {
    id: 'frostide',
    name: 'Frostide',
    parentType1: 'water',
    parentType2: 'ice',
    resultType: 'ice',
    image: craftureFrostide,
    description: 'Ocean waters frozen into a beautiful ice creature with tidal powers.',
    breedingTime: 100,
    coinCost: 180,
    rarity: 'rare',
    baseStats: { attack: 60, defense: 75, speed: 55 },
  },
  {
    id: 'voltflare',
    name: 'Voltflare',
    parentType1: 'thunder',
    parentType2: 'fire',
    resultType: 'thunder',
    image: craftureVoltflare,
    description: 'Lightning and fire combined into an explosive electric furball.',
    breedingTime: 150,
    coinCost: 250,
    rarity: 'rare',
    baseStats: { attack: 85, defense: 40, speed: 90 },
  },
  {
    id: 'voidspirit',
    name: 'Voidspirit',
    parentType1: 'ghost',
    parentType2: 'shadow',
    resultType: 'shadow',
    image: craftureVoidspirit,
    description: 'A spectral entity from the deepest void, half ghost and half shadow.',
    breedingTime: 180,
    coinCost: 300,
    rarity: 'legendary',
    baseStats: { attack: 80, defense: 55, speed: 85 },
  },
  {
    id: 'lilywave',
    name: 'Lilywave',
    parentType1: 'flower',
    parentType2: 'water',
    resultType: 'flower',
    image: craftureLilywave,
    description: 'A water lily creature that floats gracefully with petal fins.',
    breedingTime: 80,
    coinCost: 120,
    rarity: 'uncommon',
    baseStats: { attack: 50, defense: 65, speed: 60 },
  },
  {
    id: 'shockstone',
    name: 'Shockstone',
    parentType1: 'rock',
    parentType2: 'thunder',
    resultType: 'rock',
    image: craftureShockstone,
    description: 'A living boulder crackling with electric energy.',
    breedingTime: 140,
    coinCost: 220,
    rarity: 'rare',
    baseStats: { attack: 70, defense: 90, speed: 35 },
  },
  {
    id: 'frostfuzz',
    name: 'Frostfuzz',
    parentType1: 'forest',
    parentType2: 'ice',
    resultType: 'ice',
    image: craftureFrostfuzz,
    description: 'A forest creature adapted to frozen climates with icy leaf fur.',
    breedingTime: 90,
    coinCost: 140,
    rarity: 'uncommon',
    baseStats: { attack: 55, defense: 65, speed: 60 },
  },
  {
    id: 'blazepetal',
    name: 'Blazepetal',
    parentType1: 'flower',
    parentType2: 'fire',
    resultType: 'fire',
    image: craftureBlazepetal,
    description: 'A fiery flower with burning petals that never wilt.',
    breedingTime: 100,
    coinCost: 160,
    rarity: 'uncommon',
    baseStats: { attack: 75, defense: 50, speed: 55 },
  },
  {
    id: 'frostspirit',
    name: 'Frostspirit',
    parentType1: 'ghost',
    parentType2: 'ice',
    resultType: 'ghost',
    image: craftureFrostspirit,
    description: 'An icy phantom that chills the air wherever it floats.',
    breedingTime: 160,
    coinCost: 280,
    rarity: 'rare',
    baseStats: { attack: 65, defense: 50, speed: 80 },
  },
  {
    id: 'cybervolt',
    name: 'Cybervolt',
    parentType1: 'cube',
    parentType2: 'thunder',
    resultType: 'mechanical',
    image: craftureCybervolt,
    description: 'A digital creature overclocked with electrical power.',
    breedingTime: 170,
    coinCost: 290,
    rarity: 'rare',
    baseStats: { attack: 80, defense: 60, speed: 75 },
  },
  {
    id: 'rainpuff',
    name: 'Rainpuff',
    parentType1: 'forest',
    parentType2: 'water',
    resultType: 'water',
    image: craftureRainpuff,
    description: 'A mossy furball that brings rain wherever it goes.',
    breedingTime: 70,
    coinCost: 100,
    rarity: 'common',
    baseStats: { attack: 45, defense: 55, speed: 50 },
  },
  {
    id: 'forgekit',
    name: 'Forgekit',
    parentType1: 'mechanical',
    parentType2: 'fire',
    resultType: 'mechanical',
    image: craftureForgekit,
    description: 'A mechanical creature with a furnace heart.',
    breedingTime: 130,
    coinCost: 200,
    rarity: 'rare',
    baseStats: { attack: 75, defense: 70, speed: 45 },
  },
  {
    id: 'meadowpuff',
    name: 'Meadowpuff',
    parentType1: 'flower',
    parentType2: 'forest',
    resultType: 'forest',
    image: craftureMeadowpuff,
    description: 'A gentle creature covered in wildflowers and soft grass.',
    breedingTime: 60,
    coinCost: 80,
    rarity: 'common',
    baseStats: { attack: 40, defense: 60, speed: 55 },
  },
  {
    id: 'stormtide',
    name: 'Stormtide',
    parentType1: 'thunder',
    parentType2: 'water',
    resultType: 'water',
    image: craftureStormtide,
    description: 'An oceanic storm given furry form.',
    breedingTime: 140,
    coinCost: 230,
    rarity: 'rare',
    baseStats: { attack: 80, defense: 55, speed: 70 },
  },
  {
    id: 'shadowflame',
    name: 'Shadowflame',
    parentType1: 'shadow',
    parentType2: 'fire',
    resultType: 'shadow',
    image: craftureShadowflame,
    description: 'Dark flames that consume light itself.',
    breedingTime: 160,
    coinCost: 270,
    rarity: 'rare',
    baseStats: { attack: 90, defense: 45, speed: 75 },
  },
  {
    id: 'froststone',
    name: 'Froststone',
    parentType1: 'rock',
    parentType2: 'ice',
    resultType: 'rock',
    image: craftureFroststone,
    description: 'A frozen boulder creature with permafrost armor.',
    breedingTime: 120,
    coinCost: 190,
    rarity: 'uncommon',
    baseStats: { attack: 55, defense: 95, speed: 25 },
  },
  {
    id: 'sparkswamp',
    name: 'Sparkswamp',
    parentType1: 'thunder',
    parentType2: 'shadow',
    resultType: 'thunder',
    image: craftureSparkswamp,
    description: 'A swampy creature crackling with murky electricity.',
    breedingTime: 130,
    coinCost: 210,
    rarity: 'rare',
    baseStats: { attack: 70, defense: 60, speed: 65 },
  },
  {
    id: 'suncloud',
    name: 'Suncloud',
    parentType1: 'fire',
    parentType2: 'forest',
    resultType: 'fire',
    image: craftureSuncloud,
    description: 'A fluffy cloud infused with solar fire energy.',
    breedingTime: 110,
    coinCost: 175,
    rarity: 'uncommon',
    baseStats: { attack: 65, defense: 50, speed: 70 },
  },
  {
    id: 'phantomcrystal',
    name: 'Phantomcrystal',
    parentType1: 'ghost',
    parentType2: 'rock',
    resultType: 'ghost',
    image: crafturePhantomcrystal,
    description: 'A ghostly crystal entity phasing between dimensions.',
    breedingTime: 170,
    coinCost: 280,
    rarity: 'rare',
    baseStats: { attack: 60, defense: 70, speed: 75 },
  },
  {
    id: 'rainfern',
    name: 'Rainfern',
    parentType1: 'water',
    parentType2: 'forest',
    resultType: 'forest',
    image: craftureRainfern,
    description: 'A jungle creature constantly drenched in tropical rain.',
    breedingTime: 85,
    coinCost: 130,
    rarity: 'uncommon',
    baseStats: { attack: 50, defense: 60, speed: 65 },
  },
  {
    id: 'frostgear',
    name: 'Frostgear',
    parentType1: 'mechanical',
    parentType2: 'ice',
    resultType: 'mechanical',
    image: craftureFrostgear,
    description: 'A frozen clockwork creature with icy gears.',
    breedingTime: 150,
    coinCost: 250,
    rarity: 'rare',
    baseStats: { attack: 65, defense: 80, speed: 50 },
  },
  {
    id: 'blazebone',
    name: 'Blazebone',
    parentType1: 'ghost',
    parentType2: 'fire',
    resultType: 'ghost',
    image: craftureBlazebone,
    description: 'A skeletal furball with bones wreathed in eternal flame.',
    breedingTime: 180,
    coinCost: 320,
    rarity: 'legendary',
    baseStats: { attack: 95, defense: 50, speed: 70 },
  },
  {
    id: 'shockreef',
    name: 'Shockreef',
    parentType1: 'water',
    parentType2: 'thunder',
    resultType: 'water',
    image: craftureShockreef,
    description: 'A coral creature electrified by underwater lightning.',
    breedingTime: 140,
    coinCost: 230,
    rarity: 'rare',
    baseStats: { attack: 75, defense: 65, speed: 60 },
  },
  {
    id: 'phantomdream',
    name: 'Phantomdream',
    parentType1: 'ghost',
    parentType2: 'shadow',
    resultType: 'ghost',
    image: crafturePhantomdream,
    description: 'A dreamy spirit that exists between sleep and waking.',
    breedingTime: 160,
    coinCost: 260,
    rarity: 'rare',
    baseStats: { attack: 55, defense: 55, speed: 85 },
  },
];

export const hybridImages: Record<string, string> = {
  steamfury: craftureSteamfury,
  emberfuzz: craftureEmberfuzz,
  frostide: craftureFrostide,
  voltflare: craftureVoltflare,
  voidspirit: craftureVoidspirit,
  lilywave: craftureLilywave,
  shockstone: craftureShockstone,
  frostfuzz: craftureFrostfuzz,
  blazepetal: craftureBlazepetal,
  frostspirit: craftureFrostspirit,
  cybervolt: craftureCybervolt,
  rainpuff: craftureRainpuff,
  forgekit: craftureForgekit,
  meadowpuff: craftureMeadowpuff,
  stormtide: craftureStormtide,
  shadowflame: craftureShadowflame,
  froststone: craftureFroststone,
  sparkswamp: craftureSparkswamp,
  suncloud: craftureSuncloud,
  phantomcrystal: crafturePhantomcrystal,
  rainfern: craftureRainfern,
  frostgear: craftureFrostgear,
  blazebone: craftureBlazebone,
  shockreef: craftureShockreef,
  phantomdream: crafturePhantomdream,
};

// Helper to find hybrid recipe by parent types
export function findHybridRecipe(type1: CraftureType, type2: CraftureType): HybridRecipe | undefined {
  return hybridRecipes.find(
    (r) =>
      (r.parentType1 === type1 && r.parentType2 === type2) ||
      (r.parentType1 === type2 && r.parentType2 === type1)
  );
}

// Get all possible hybrids for a given type
export function getHybridsForType(type: CraftureType): HybridRecipe[] {
  return hybridRecipes.filter((r) => r.parentType1 === type || r.parentType2 === type);
}
