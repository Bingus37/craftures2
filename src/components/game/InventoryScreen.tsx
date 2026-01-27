import { Button } from '@/components/ui/button';
import { OwnedCrafture } from '@/types/crafture';
import { InventoryItem, ITEMS, getItem } from '@/types/inventory';
import { ArrowLeft, Coins, Package, Heart, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { craftureSpecies, craftureImages } from '@/data/craftures';

interface InventoryScreenProps {
  inventory: InventoryItem[];
  coins: number;
  ownedCraftures: OwnedCrafture[];
  onBack: () => void;
  onUseItem: (itemId: string, craftureId: string) => void;
  onBuyItem: (itemId: string, quantity: number) => boolean;
}

export function InventoryScreen({
  inventory,
  coins,
  ownedCraftures,
  onBack,
  onUseItem,
  onBuyItem,
}: InventoryScreenProps) {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [showShop, setShowShop] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleBuy = (itemId: string) => {
    const item = getItem(itemId);
    if (!item) return;
    
    if (onBuyItem(itemId, 1)) {
      showMessage(`Bought ${item.name}!`);
    } else {
      showMessage('Not enough coins!');
    }
  };

  const handleUseItem = (craftureId: string) => {
    if (!selectedItem) return;
    
    const crafture = ownedCraftures.find(c => c.id === craftureId);
    const item = getItem(selectedItem);
    if (!crafture || !item) return;

    onUseItem(selectedItem, craftureId);
    setSelectedItem(null);
    showMessage(`Used ${item.name} on ${crafture.nickname}!`);
  };

  const usableItems = inventory.filter(i => {
    const item = getItem(i.itemId);
    return item && (item.type === 'potion' || item.type === 'revive');
  });

  const ballItems = inventory.filter(i => {
    const item = getItem(i.itemId);
    return item?.type === 'ball';
  });

  const shopItems = Object.values(ITEMS);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-secondary/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-6 w-6" />
            {showShop ? 'Shop' : 'Inventory'}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={showShop ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowShop(!showShop)}
          >
            {showShop ? 'Back to Bag' : 'Shop'}
          </Button>
          <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
            <Coins className="h-4 w-4" />
            {coins}
          </div>
        </div>
      </div>

      {/* Message toast */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-card px-4 py-2 rounded-full shadow-lg z-50 animate-fade-in">
          {message}
        </div>
      )}

      {showShop ? (
        /* Shop View */
        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">Tap an item to buy it!</p>
          <div className="grid grid-cols-2 gap-3">
            {shopItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleBuy(item.id)}
                className={cn(
                  'bg-card p-3 rounded-xl shadow-soft text-left transition-all hover:scale-105 active:scale-95',
                  coins < item.price && 'opacity-50'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <div className="font-semibold text-sm">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-600 text-sm font-semibold">
                  <Coins className="h-3 w-3" />
                  {item.price}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : selectedItem ? (
        /* Crafture Selection for Item Use */
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setSelectedItem(null)}>
              ← Back
            </Button>
            <span className="text-sm text-muted-foreground">
              Select a Crafture to use {getItem(selectedItem)?.name} on:
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {ownedCraftures.map((crafture) => {
              const species = craftureSpecies.find(s => s.id === crafture.speciesId);
              const item = getItem(selectedItem);
              const canUse = item?.type === 'revive' 
                ? crafture.hp === 0 
                : crafture.hp < crafture.maxHp;
              
              return (
                <button
                  key={crafture.id}
                  onClick={() => canUse && handleUseItem(crafture.id)}
                  disabled={!canUse}
                  className={cn(
                    'bg-card p-3 rounded-xl shadow-soft text-left transition-all',
                    canUse ? 'hover:scale-105 active:scale-95' : 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={craftureImages[crafture.speciesId]}
                      alt={crafture.nickname}
                      className="h-12 w-12 object-contain"
                    />
                    <div>
                      <div className="font-semibold text-sm">{crafture.nickname}</div>
                      <div className="text-xs text-muted-foreground">
                        HP: {crafture.hp}/{crafture.maxHp}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Inventory View */
        <div className="space-y-6">
          {/* Healing Items */}
          <div>
            <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Healing Items
            </h2>
            {usableItems.length === 0 ? (
              <p className="text-muted-foreground text-sm">No healing items. Visit the shop!</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {usableItems.map((invItem) => {
                  const item = getItem(invItem.itemId);
                  if (!item) return null;
                  return (
                    <button
                      key={invItem.itemId}
                      onClick={() => setSelectedItem(invItem.itemId)}
                      className="bg-card p-3 rounded-xl shadow-soft text-left transition-all hover:scale-105 active:scale-95"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">x{invItem.quantity}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Catch Balls */}
          <div>
            <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500" />
              Catch Balls
            </h2>
            {ballItems.length === 0 ? (
              <p className="text-muted-foreground text-sm">No balls left. Visit the shop!</p>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {ballItems.map((invItem) => {
                  const item = getItem(invItem.itemId);
                  if (!item) return null;
                  return (
                    <div
                      key={invItem.itemId}
                      className="bg-card p-3 rounded-xl shadow-soft"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <div>
                          <div className="font-semibold text-sm">{item.name}</div>
                          <div className="text-xs text-muted-foreground">x{invItem.quantity}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
