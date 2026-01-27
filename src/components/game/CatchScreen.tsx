import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { craftureSpecies, craftureImages, typeGradients } from '@/data/craftures';
import { InventoryItem, getItem } from '@/types/inventory';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCrafture } from './AnimatedCrafture';

interface CatchScreenProps {
  wildSpeciesId: string;
  wildLevel: number;
  inventory: InventoryItem[];
  onUseBall: (itemId: string) => boolean;
  onCatch: (speciesId: string) => void;
  onSkip: () => void;
}

export function CatchScreen({ wildSpeciesId, wildLevel, inventory, onUseBall, onCatch, onSkip }: CatchScreenProps) {
  const [isCatching, setIsCatching] = useState(false);
  const [catchResult, setCatchResult] = useState<'success' | 'fail' | null>(null);
  
  const species = craftureSpecies.find(s => s.id === wildSpeciesId);
  
  // Get available balls
  const availableBalls = inventory.filter(i => {
    const item = getItem(i.itemId);
    return item?.type === 'ball' && i.quantity > 0;
  }).map(i => ({ ...i, item: getItem(i.itemId)! }));

  const handleCatch = (ballId: string) => {
    if (!species) return;

    const ballItem = getItem(ballId);
    if (!ballItem || !onUseBall(ballId)) return;

    setIsCatching(true);

    const catchChances = {
      common: 0.6,
      uncommon: 0.4,
      rare: 0.25,
      legendary: 0.1,
    };

    const baseChance = catchChances[species.rarity];
    const ballBonus = ballItem.catchBonus || 1;
    // Weakened after battle = easier to catch!
    const chance = Math.min(1, baseChance * ballBonus * 1.5);
    const success = Math.random() < chance;

    setTimeout(() => {
      setIsCatching(false);
      setCatchResult(success ? 'success' : 'fail');

      if (success) {
        setTimeout(() => {
          onCatch(wildSpeciesId);
        }, 1500);
      }
    }, 1500);
  };

  if (!species) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900/20 via-background to-muted p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onSkip}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-yellow-500" />
          Catch Opportunity!
        </h1>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="mb-4 text-lg font-semibold text-foreground text-center">
          {catchResult === 'success'
            ? '🎉 Caught successfully!'
            : catchResult === 'fail'
            ? '💨 It escaped!'
            : `The weakened Lv.${wildLevel} ${species.name} is ready to catch!`}
        </p>

        <div className="mb-6 relative">
          <AnimatedCrafture
            speciesId={species.id}
            className="h-56 w-56 mx-auto"
            isAnimating={!catchResult}
            animationType={isCatching ? 'hurt' : catchResult === 'fail' ? 'faint' : 'idle'}
            showBackground={true}
          />
          {catchResult === 'success' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-24 w-24 text-yellow-400 animate-spin" />
            </div>
          )}
        </div>

        <h2 className="font-display text-2xl font-bold text-foreground mb-1">
          {species.name}
        </h2>
        <span
          className={cn(
            'inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize bg-gradient-to-r text-primary-foreground mb-4',
            typeGradients[species.type]
          )}
        >
          {species.type} • {species.rarity}
        </span>

        <div className="flex flex-wrap gap-3 justify-center mt-4">
          {!catchResult && (
            <>
              {/* Ball selection */}
              {availableBalls.length > 0 ? (
                <div className="flex gap-2">
                  {availableBalls.map(({ itemId, quantity, item }) => (
                    <Button
                      key={itemId}
                      variant="game"
                      size="lg"
                      onClick={() => handleCatch(itemId)}
                      disabled={isCatching}
                      className="flex-col h-auto py-2"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-xs">x{quantity}</span>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-muted-foreground bg-card px-3 py-2 rounded-lg">
                  No balls! Visit the shop.
                </div>
              )}
              
              <Button
                variant="outline"
                size="lg"
                onClick={onSkip}
                disabled={isCatching}
              >
                Skip Catch
              </Button>
            </>
          )}

          {catchResult === 'fail' && (
            <>
              {availableBalls.length > 0 ? (
                <div className="flex gap-2">
                  {availableBalls.map(({ itemId, quantity, item }) => (
                    <Button
                      key={itemId}
                      variant="game"
                      size="lg"
                      onClick={() => {
                        setCatchResult(null);
                        handleCatch(itemId);
                      }}
                      className="flex-col h-auto py-2"
                    >
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-xs">x{quantity}</span>
                    </Button>
                  ))}
                </div>
              ) : null}
              <Button
                variant="outline"
                size="lg"
                onClick={onSkip}
              >
                Give Up
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
