import { Button } from '@/components/ui/button';
import { InventoryItem, ITEMS, getItem } from '@/types/inventory';
import { ArrowLeft, Coins, ShoppingBag, Minus, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ShopScreenProps {
  coins: number;
  onBack: () => void;
  onBuyItem: (itemId: string, quantity: number) => boolean;
}

export function ShopScreen({ coins, onBack, onBuyItem }: ShopScreenProps) {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [message, setMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 2000);
  };

  const getQuantity = (itemId: string) => quantities[itemId] || 1;

  const setQuantity = (itemId: string, qty: number) => {
    setQuantities(prev => ({ ...prev, [itemId]: Math.max(1, qty) }));
  };

  const handleBuy = (itemId: string) => {
    const item = getItem(itemId);
    const qty = getQuantity(itemId);
    if (!item) return;
    
    if (onBuyItem(itemId, qty)) {
      showMessage(`Bought ${qty}x ${item.name}!`);
      setQuantity(itemId, 1);
    } else {
      showMessage('Not enough coins!');
    }
  };

  const shopItems = Object.values(ITEMS);

  // Group items by type
  const potions = shopItems.filter(i => i.type === 'potion' && !['berrySnack', 'gourmetMeal'].includes(i.id));
  const food = shopItems.filter(i => ['berrySnack', 'gourmetMeal'].includes(i.id));
  const revives = shopItems.filter(i => i.type === 'revive');
  const balls = shopItems.filter(i => i.type === 'ball');

  const ItemCard = ({ itemId }: { itemId: string }) => {
    const item = getItem(itemId);
    if (!item) return null;
    
    const qty = getQuantity(itemId);
    const totalCost = item.price * qty;
    const canAfford = coins >= totalCost;

    return (
      <div className={cn(
        'bg-card p-4 rounded-xl shadow-soft transition-all',
        !canAfford && 'opacity-60'
      )}>
        <div className="flex items-start gap-3 mb-3">
          <span className="text-3xl">{item.icon}</span>
          <div className="flex-1">
            <div className="font-semibold">{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.description}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setQuantity(itemId, qty - 1)}
              disabled={qty <= 1}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center font-bold">{qty}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() => setQuantity(itemId, qty + 1)}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleBuy(itemId)}
            disabled={!canAfford}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <Coins className="h-3 w-3 mr-1" />
            {totalCost}
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-secondary/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" />
            Shop
          </h1>
        </div>
        <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
          <Coins className="h-4 w-4" />
          {coins}
        </div>
      </div>

      {/* Message toast */}
      {message && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-card px-4 py-2 rounded-full shadow-lg z-50 animate-fade-in">
          {message}
        </div>
      )}

      <div className="space-y-6">
        {/* Healing Items */}
        <div>
          <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
            🧪 Healing Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {potions.map(item => <ItemCard key={item.id} itemId={item.id} />)}
          </div>
        </div>

        {/* Food */}
        <div>
          <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
            🍖 Food
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {food.map(item => <ItemCard key={item.id} itemId={item.id} />)}
          </div>
        </div>

        {/* Revives */}
        <div>
          <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
            ⭐ Revives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {revives.map(item => <ItemCard key={item.id} itemId={item.id} />)}
          </div>
        </div>

        {/* Catch Balls */}
        <div>
          <h2 className="font-display text-lg font-semibold mb-3 flex items-center gap-2">
            ⚪ Catch Balls
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {balls.map(item => <ItemCard key={item.id} itemId={item.id} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
