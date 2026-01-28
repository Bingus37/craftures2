import { useState, useCallback, useEffect } from 'react';
import { InventoryItem, ITEMS, getItem } from '@/types/inventory';

const INVENTORY_SAVE_KEY = 'crafture-inventory';

const DEFAULT_INVENTORY: InventoryItem[] = [
  { itemId: 'potion', quantity: 5 },
  { itemId: 'basicBall', quantity: 10 },
  { itemId: 'berrySnack', quantity: 5 },
];

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [coins, setCoins] = useState(500);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load inventory from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(INVENTORY_SAVE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setInventory(data.inventory || DEFAULT_INVENTORY);
        setCoins(data.coins ?? 500);
      } catch (e) {
        console.error('Failed to load inventory:', e);
        setInventory(DEFAULT_INVENTORY);
      }
    } else {
      setInventory(DEFAULT_INVENTORY);
    }
    setIsLoaded(true);
  }, []);

  // Auto-save inventory
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(INVENTORY_SAVE_KEY, JSON.stringify({ inventory, coins }));
    }
  }, [inventory, coins, isLoaded]);

  const addItem = useCallback((itemId: string, quantity: number = 1) => {
    setInventory(prev => {
      const existing = prev.find(i => i.itemId === itemId);
      if (existing) {
        return prev.map(i => 
          i.itemId === itemId 
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, { itemId, quantity }];
    });
  }, []);

  const removeItem = useCallback((itemId: string, quantity: number = 1): boolean => {
    // Check synchronously first if we have enough
    const existing = inventory.find(i => i.itemId === itemId);
    if (!existing || existing.quantity < quantity) {
      return false;
    }
    
    // We have enough, update the state
    setInventory(prev => {
      const item = prev.find(i => i.itemId === itemId);
      if (!item || item.quantity < quantity) {
        return prev;
      }
      if (item.quantity === quantity) {
        return prev.filter(i => i.itemId !== itemId);
      }
      return prev.map(i =>
        i.itemId === itemId
          ? { ...i, quantity: i.quantity - quantity }
          : i
      );
    });
    return true;
  }, [inventory]);

  const getItemQuantity = useCallback((itemId: string): number => {
    return inventory.find(i => i.itemId === itemId)?.quantity || 0;
  }, [inventory]);

  const hasItem = useCallback((itemId: string, quantity: number = 1): boolean => {
    return getItemQuantity(itemId) >= quantity;
  }, [getItemQuantity]);

  const addCoins = useCallback((amount: number) => {
    setCoins(prev => prev + amount);
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    if (coins < amount) return false;
    setCoins(prev => prev - amount);
    return true;
  }, [coins]);

  const buyItem = useCallback((itemId: string, quantity: number = 1): boolean => {
    const item = getItem(itemId);
    if (!item) return false;
    
    const totalCost = item.price * quantity;
    if (coins < totalCost) return false;
    
    setCoins(prev => prev - totalCost);
    addItem(itemId, quantity);
    return true;
  }, [coins, addItem]);

  const getBallsInInventory = useCallback(() => {
    return inventory
      .filter(i => {
        const item = getItem(i.itemId);
        return item?.type === 'ball';
      })
      .map(i => ({
        ...i,
        item: getItem(i.itemId)!,
      }));
  }, [inventory]);

  const resetInventory = useCallback(() => {
    setInventory(DEFAULT_INVENTORY);
    setCoins(500);
    localStorage.removeItem(INVENTORY_SAVE_KEY);
  }, []);

  return {
    inventory,
    coins,
    isLoaded,
    addItem,
    removeItem,
    getItemQuantity,
    hasItem,
    addCoins,
    spendCoins,
    buyItem,
    getBallsInInventory,
    resetInventory,
  };
}
