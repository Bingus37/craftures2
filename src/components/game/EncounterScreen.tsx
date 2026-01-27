import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { craftureSpecies, craftureImages, typeGradients } from '@/data/craftures';
import { CraftureSpecies } from '@/types/crafture';
import { InventoryItem, getItem } from '@/types/inventory';
import { ArrowLeft, Search, Sparkles, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCrafture } from './AnimatedCrafture';

interface EncounterScreenProps {
  onBack: () => void;
  onCatch: (speciesId: string) => void;
  onBattle: (wildSpeciesId: string, wildLevel: number) => void;
  ownedSpeciesIds: string[];
  inventory: InventoryItem[];
  onUseBall: (itemId: string) => boolean;
}

export function EncounterScreen({ onBack, onCatch, onBattle, ownedSpeciesIds, inventory, onUseBall }: EncounterScreenProps) {
  const [isSearching, setIsSearching] = useState(false);
  const [encounteredSpecies, setEncounteredSpecies] = useState<CraftureSpecies | null>(null);
  const [wildLevel, setWildLevel] = useState(1);
  const [isCatching, setIsCatching] = useState(false);
  const [catchResult, setCatchResult] = useState<'success' | 'fail' | null>(null);
  const [selectedBall, setSelectedBall] = useState<string | null>(null);

  // Filter out evolved forms from wild encounters
  const wildSpecies = craftureSpecies.filter(s => !craftureSpecies.some(e => e.evolvesTo === s.id));

  const getRandomEncounter = useCallback(() => {
    const weights = {
      common: 50,
      uncommon: 30,
      rare: 15,
      legendary: 5,
    };

    const weightedList: CraftureSpecies[] = [];
    wildSpecies.forEach((species) => {
      const weight = weights[species.rarity];
      for (let i = 0; i < weight; i++) {
        weightedList.push(species);
      }
    });

    const species = weightedList[Math.floor(Math.random() * weightedList.length)];
    const level = Math.floor(Math.random() * 10) + 1; // Level 1-10
    return { species, level };
  }, [wildSpecies]);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    setCatchResult(null);
    setEncounteredSpecies(null);
    setSelectedBall(null);

    setTimeout(() => {
      const { species, level } = getRandomEncounter();
      setEncounteredSpecies(species);
      setWildLevel(level);
      setIsSearching(false);
    }, 2000);
  }, [getRandomEncounter]);

  // Get available balls
  const availableBalls = inventory.filter(i => {
    const item = getItem(i.itemId);
    return item?.type === 'ball' && i.quantity > 0;
  }).map(i => ({ ...i, item: getItem(i.itemId)! }));

  const handleCatch = useCallback((ballId: string) => {
    if (!encounteredSpecies) return;

    const ballItem = getItem(ballId);
    if (!ballItem || !onUseBall(ballId)) return;

    setIsCatching(true);

    const catchChances = {
      common: 0.6,
      uncommon: 0.4,
      rare: 0.25,
      legendary: 0.1,
    };

    const baseChance = catchChances[encounteredSpecies.rarity];
    const ballBonus = ballItem.catchBonus || 1;
    const chance = Math.min(1, baseChance * ballBonus);
    const success = Math.random() < chance;

    setTimeout(() => {
      setIsCatching(false);
      setCatchResult(success ? 'success' : 'fail');

      if (success) {
        onCatch(encounteredSpecies.id);
      }
    }, 1500);
  }, [encounteredSpecies, onCatch, onUseBall]);

  const handleBattle = useCallback(() => {
    if (!encounteredSpecies) return;
    onBattle(encounteredSpecies.id, wildLevel);
  }, [encounteredSpecies, wildLevel, onBattle]);

  const alreadyOwned = encounteredSpecies
    ? ownedSpeciesIds.includes(encounteredSpecies.id)
    : false;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-muted p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Wild Encounter
        </h1>
      </div>

      {/* Encounter area */}
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        {!encounteredSpecies && !isSearching && (
          <div className="text-center">
            <div className="mb-8 relative">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center animate-pulse">
                <Search className="h-24 w-24 text-primary/50" />
              </div>
            </div>
            <p className="text-muted-foreground mb-6">
              Search the wild to find Craftures!
            </p>
            <Button variant="encounter" size="xl" onClick={handleSearch}>
              <Compass className="h-6 w-6" />
              Search for Craftures
            </Button>
          </div>
        )}

        {isSearching && (
          <div className="text-center">
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center animate-spin-slow">
              <Search className="h-24 w-24 text-primary animate-bounce" />
            </div>
            <p className="mt-6 text-lg font-semibold text-foreground animate-pulse">
              Searching...
            </p>
          </div>
        )}

        {encounteredSpecies && !isSearching && (
          <div className="text-center">
            <p className="mb-4 text-lg font-semibold text-foreground">
              {catchResult === 'success'
                ? '🎉 Caught successfully!'
                : catchResult === 'fail'
                ? '💨 It escaped!'
                : `A wild Lv.${wildLevel} Crafture appeared!`}
            </p>

            <div className="mb-6 relative">
              <AnimatedCrafture
                speciesId={encounteredSpecies.id}
                className="h-56 w-56 mx-auto"
                isAnimating={!catchResult}
                animationType={isCatching ? 'hurt' : catchResult === 'fail' ? 'faint' : 'idle'}
                showBackground={true}
              />
            </div>

            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              {encounteredSpecies.name}
            </h2>
            <span
              className={cn(
                'inline-block rounded-full px-3 py-1 text-sm font-semibold capitalize bg-gradient-to-r text-primary-foreground mb-4',
                typeGradients[encounteredSpecies.type]
              )}
            >
              {encounteredSpecies.type} • {encounteredSpecies.rarity}
            </span>

            {alreadyOwned && !catchResult && (
              <p className="text-sm text-muted-foreground mb-4">
                You already have this Crafture!
              </p>
            )}

            <div className="flex flex-wrap gap-3 justify-center mt-4">
              {!catchResult && (
                <>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={handleBattle}
                    className="bg-red-500 hover:bg-red-600"
                  >
                    <Swords className="h-5 w-5 mr-1" />
                    Battle!
                  </Button>
                  
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
                </>
              )}

              <Button
                variant="outline"
                size="lg"
                onClick={handleSearch}
                disabled={isCatching}
              >
                {catchResult ? 'Search Again' : 'Run Away'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Compass(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
