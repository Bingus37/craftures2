import { Button } from '@/components/ui/button';
import { InventoryItem, getItem } from '@/types/inventory';
import { OwnedCrafture } from '@/types/crafture';
import { X, Backpack } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface BattleItemsMenuProps {
  inventory: InventoryItem[];
  playerCrafture: OwnedCrafture;
  onUseItem: (itemId: string) => void;
  onClose: () => void;
  disabled?: boolean;
}

export function BattleItemsMenu({
  inventory,
  playerCrafture,
  onUseItem,
  onClose,
  disabled = false,
}: BattleItemsMenuProps) {
  // Only show usable items (potions, revives)
  const usableItems = inventory.filter(i => {
    const item = getItem(i.itemId);
    if (!item) return false;
    if (item.type === 'ball') return false; // Balls are handled separately
    
    // Check if item can be used
    if (item.type === 'revive' && playerCrafture.hp > 0) return false;
    if (item.type === 'potion') {
      // Food items need hunger check, HP potions need HP check
      if (item.id === 'berrySnack' || item.id === 'gourmetMeal') {
        return playerCrafture.hunger < 100;
      }
      return playerCrafture.hp < playerCrafture.maxHp && playerCrafture.hp > 0;
    }
    return true;
  });

  if (usableItems.length === 0) {
    return (
      <div className="bg-card/95 backdrop-blur rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold flex items-center gap-2">
            <Backpack className="h-5 w-5" />
            Items
          </h3>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground text-center py-4">
          No usable items available
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card/95 backdrop-blur rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-display font-bold flex items-center gap-2">
          <Backpack className="h-5 w-5" />
          Use Item
        </h3>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
        {usableItems.map((invItem) => {
          const item = getItem(invItem.itemId);
          if (!item) return null;
          
          return (
            <Button
              key={invItem.itemId}
              variant="outline"
              size="sm"
              onClick={() => onUseItem(invItem.itemId)}
              disabled={disabled}
              className="flex items-center gap-2 h-auto py-2 justify-start"
            >
              <span className="text-xl">{item.icon}</span>
              <div className="text-left">
                <div className="text-xs font-semibold">{item.name}</div>
                <div className="text-[10px] text-muted-foreground">x{invItem.quantity}</div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
