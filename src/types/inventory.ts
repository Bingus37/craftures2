export type ItemType = 'potion' | 'revive' | 'ball';

export type BallType = 'basic' | 'great' | 'ultra' | 'master';

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  ballType?: BallType;
  healAmount?: number;
  catchBonus?: number;
  icon: string;
  price: number;
}

export interface InventoryItem {
  itemId: string;
  quantity: number;
}

export const ITEMS: Record<string, Item> = {
  // Potions
  potion: {
    id: 'potion',
    name: 'Potion',
    description: 'Restores 20 HP',
    type: 'potion',
    healAmount: 20,
    icon: '🧪',
    price: 100,
  },
  superPotion: {
    id: 'superPotion',
    name: 'Super Potion',
    description: 'Restores 50 HP',
    type: 'potion',
    healAmount: 50,
    icon: '🧴',
    price: 300,
  },
  hyperPotion: {
    id: 'hyperPotion',
    name: 'Hyper Potion',
    description: 'Restores 100 HP',
    type: 'potion',
    healAmount: 100,
    icon: '💉',
    price: 600,
  },
  fullRestore: {
    id: 'fullRestore',
    name: 'Full Restore',
    description: 'Fully restores HP',
    type: 'potion',
    healAmount: 9999,
    icon: '✨',
    price: 1500,
  },
  
  // Revives
  revive: {
    id: 'revive',
    name: 'Revive',
    description: 'Revives a fainted Crafture to 50% HP',
    type: 'revive',
    healAmount: 0.5,
    icon: '💫',
    price: 500,
  },
  maxRevive: {
    id: 'maxRevive',
    name: 'Max Revive',
    description: 'Revives a fainted Crafture to full HP',
    type: 'revive',
    healAmount: 1,
    icon: '⭐',
    price: 1200,
  },
  
  // Catch Balls
  basicBall: {
    id: 'basicBall',
    name: 'Basic Ball',
    description: 'A standard ball for catching Craftures',
    type: 'ball',
    ballType: 'basic',
    catchBonus: 1,
    icon: '⚪',
    price: 50,
  },
  greatBall: {
    id: 'greatBall',
    name: 'Great Ball',
    description: 'Better catch rate than Basic Ball',
    type: 'ball',
    ballType: 'great',
    catchBonus: 1.5,
    icon: '🔵',
    price: 150,
  },
  ultraBall: {
    id: 'ultraBall',
    name: 'Ultra Ball',
    description: 'High catch rate ball',
    type: 'ball',
    ballType: 'ultra',
    catchBonus: 2,
    icon: '🟡',
    price: 400,
  },
  masterBall: {
    id: 'masterBall',
    name: 'Master Ball',
    description: 'Never fails to catch!',
    type: 'ball',
    ballType: 'master',
    catchBonus: 999,
    icon: '🟣',
    price: 10000,
  },
  
  // Food items
  berrySnack: {
    id: 'berrySnack',
    name: 'Berry Snack',
    description: 'Restores 30 hunger',
    type: 'potion',
    healAmount: 30,
    icon: '🍇',
    price: 75,
  },
  gourmetMeal: {
    id: 'gourmetMeal',
    name: 'Gourmet Meal',
    description: 'Fully restores hunger',
    type: 'potion',
    healAmount: 100,
    icon: '🍖',
    price: 250,
  },
};

export const getItem = (itemId: string): Item | undefined => ITEMS[itemId];
