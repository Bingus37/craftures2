import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Plus, X, Timer, Coins, Sparkles, Grid3X3 } from 'lucide-react';
import { OwnedCrafture, CraftureType } from '@/types/crafture';
import { craftureSpecies, craftureImages, typeGradients } from '@/data/craftures';
import { hybridRecipes, HybridRecipe, findHybridRecipe } from '@/data/hybrids';
import { cn } from '@/lib/utils';

interface PenSlot {
  id: string;
  x: number;
  y: number;
  craftureId: string | null;
  isBreedingSlot?: boolean;
}

interface BreedingSession {
  parent1Type: CraftureType;
  parent2Type: CraftureType;
  recipe: HybridRecipe;
  startTime: number;
  endTime: number;
}

interface BreedingPenScreenProps {
  onBack: () => void;
  ownedCraftures: OwnedCrafture[];
  coins: number;
  onAddCoins: (amount: number) => void;
  onAddCrafture: (speciesId: string, nickname?: string, level?: number) => void;
}

const GRID_SIZE = 6;
const SLOT_SIZE = 80;

export function BreedingPenScreen({
  onBack,
  ownedCraftures,
  coins,
  onAddCoins,
  onAddCrafture,
}: BreedingPenScreenProps) {
  const [penSlots, setPenSlots] = useState<PenSlot[]>(() => {
    const slots: PenSlot[] = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        // Center 2x2 is the breeding area
        const isBreedingSlot = (x === 2 || x === 3) && (y === 2 || y === 3);
        slots.push({
          id: `slot-${x}-${y}`,
          x,
          y,
          craftureId: null,
          isBreedingSlot,
        });
      }
    }
    return slots;
  });

  const [selectedCraftureForPlacement, setSelectedCraftureForPlacement] = useState<string | null>(null);
  const [breedingSession, setBreedingSession] = useState<BreedingSession | null>(() => {
    const saved = localStorage.getItem('craftures-breeding-session');
    if (saved) {
      const session = JSON.parse(saved);
      if (session.endTime > Date.now()) {
        return session;
      }
    }
    return null;
  });
  const [breedingProgress, setBreedingProgress] = useState(0);
  const [showRecipes, setShowRecipes] = useState(false);

  // Save breeding session
  useEffect(() => {
    if (breedingSession) {
      localStorage.setItem('craftures-breeding-session', JSON.stringify(breedingSession));
    } else {
      localStorage.removeItem('craftures-breeding-session');
    }
  }, [breedingSession]);

  // Update breeding progress
  useEffect(() => {
    if (!breedingSession) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const total = breedingSession.endTime - breedingSession.startTime;
      const elapsed = now - breedingSession.startTime;
      const progress = Math.min(100, (elapsed / total) * 100);
      setBreedingProgress(progress);

      if (now >= breedingSession.endTime) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [breedingSession]);

  // Get craftures in breeding slots
  const getBreedingSlotCraftures = () => {
    const breedingSlots = penSlots.filter((s) => s.isBreedingSlot && s.craftureId);
    return breedingSlots
      .map((slot) => ownedCraftures.find((c) => c.id === slot.craftureId))
      .filter(Boolean) as OwnedCrafture[];
  };

  // Check if breeding is possible
  const canBreed = () => {
    if (breedingSession) return false;
    const crafturesInBreeding = getBreedingSlotCraftures();
    if (crafturesInBreeding.length < 2) return false;

    const types = crafturesInBreeding.map((c) => {
      const species = craftureSpecies.find((s) => s.id === c.speciesId);
      return species?.type;
    });

    if (!types[0] || !types[1]) return false;
    const recipe = findHybridRecipe(types[0], types[1]);
    return recipe && coins >= recipe.coinCost;
  };

  // Start breeding
  const startBreeding = () => {
    const crafturesInBreeding = getBreedingSlotCraftures();
    if (crafturesInBreeding.length < 2) return;

    const types = crafturesInBreeding.map((c) => {
      const species = craftureSpecies.find((s) => s.id === c.speciesId);
      return species?.type;
    }) as CraftureType[];

    const recipe = findHybridRecipe(types[0], types[1]);
    if (!recipe || coins < recipe.coinCost) return;

    onAddCoins(-recipe.coinCost);

    const now = Date.now();
    setBreedingSession({
      parent1Type: types[0],
      parent2Type: types[1],
      recipe,
      startTime: now,
      endTime: now + recipe.breedingTime * 1000,
    });
  };

  // Collect bred crafture
  const collectBred = () => {
    if (!breedingSession || Date.now() < breedingSession.endTime) return;

    // Add the new hybrid crafture
    onAddCrafture(breedingSession.recipe.id, breedingSession.recipe.name, 1);

    // Clear breeding slots
    setPenSlots((slots) =>
      slots.map((s) => (s.isBreedingSlot ? { ...s, craftureId: null } : s))
    );

    setBreedingSession(null);
    setBreedingProgress(0);
  };

  // Place crafture in slot
  const placeCrafture = (slotId: string) => {
    if (!selectedCraftureForPlacement) return;

    // Check if crafture is already placed elsewhere
    const existingSlot = penSlots.find((s) => s.craftureId === selectedCraftureForPlacement);
    if (existingSlot) {
      setPenSlots((slots) =>
        slots.map((s) => (s.id === existingSlot.id ? { ...s, craftureId: null } : s))
      );
    }

    setPenSlots((slots) =>
      slots.map((s) => (s.id === slotId ? { ...s, craftureId: selectedCraftureForPlacement } : s))
    );
    setSelectedCraftureForPlacement(null);
  };

  // Remove crafture from slot
  const removeCraftureFromSlot = (slotId: string) => {
    setPenSlots((slots) =>
      slots.map((s) => (s.id === slotId ? { ...s, craftureId: null } : s))
    );
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTypeColor = (type: CraftureType) => {
    const colors: Record<CraftureType, string> = {
      forest: 'bg-green-500',
      ice: 'bg-cyan-400',
      fire: 'bg-orange-500',
      water: 'bg-blue-500',
      shadow: 'bg-purple-600',
      flower: 'bg-pink-400',
      cube: 'bg-yellow-500',
      thunder: 'bg-yellow-400',
      rock: 'bg-stone-500',
      ghost: 'bg-indigo-400',
      mechanical: 'bg-gray-500',
    };
    return colors[type] || 'bg-gray-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-900/20 via-background to-green-900/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-yellow-500/20 px-3 py-1 rounded-full">
            <Coins className="h-4 w-4 text-yellow-500" />
            <span className="font-bold text-yellow-500">{coins}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRecipes(!showRecipes)}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Recipes
          </Button>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-400 to-green-400 bg-clip-text text-transparent">
        🏡 Breeding Pen
      </h1>

      <div className="max-w-4xl mx-auto grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Grid Pen */}
        <Card className="bg-gradient-to-br from-amber-950/50 to-green-950/50 border-amber-700/50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-amber-200">
              <Grid3X3 className="h-5 w-5" />
              Breeding Grid
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Grid */}
            <div
              className="relative mx-auto bg-gradient-to-br from-amber-800/30 to-green-800/30 rounded-lg p-2 border-2 border-amber-600/30"
              style={{
                width: GRID_SIZE * SLOT_SIZE + 16,
                height: GRID_SIZE * SLOT_SIZE + 16,
              }}
            >
              {/* Grass texture overlay */}
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzJkNWEyNyIvPgo8Y2lyY2xlIGN4PSI1IiBjeT0iNSIgcj0iMiIgZmlsbD0iIzNkN2EzNyIvPgo8L3N2Zz4=')]" />

              {penSlots.map((slot) => {
                const crafture = slot.craftureId
                  ? ownedCraftures.find((c) => c.id === slot.craftureId)
                  : null;
                const species = crafture
                  ? craftureSpecies.find((s) => s.id === crafture.speciesId)
                  : null;

                return (
                  <div
                    key={slot.id}
                    className={cn(
                      'absolute rounded-lg border-2 transition-all cursor-pointer',
                      slot.isBreedingSlot
                        ? 'border-pink-500/50 bg-pink-500/10'
                        : 'border-amber-600/30 bg-amber-900/20',
                      selectedCraftureForPlacement && !slot.craftureId && 'hover:bg-amber-500/30 hover:border-amber-400',
                      slot.craftureId && 'hover:border-red-400'
                    )}
                    style={{
                      left: slot.x * SLOT_SIZE + 8,
                      top: slot.y * SLOT_SIZE + 8,
                      width: SLOT_SIZE - 4,
                      height: SLOT_SIZE - 4,
                    }}
                    onClick={() => {
                      if (selectedCraftureForPlacement && !slot.craftureId) {
                        placeCrafture(slot.id);
                      } else if (slot.craftureId && !breedingSession) {
                        removeCraftureFromSlot(slot.id);
                      }
                    }}
                  >
                    {crafture && species && (
                      <div className="w-full h-full flex items-center justify-center relative">
                        <img
                          src={craftureImages[crafture.speciesId]}
                          alt={species.name}
                          className="w-14 h-14 object-contain drop-shadow-lg animate-bounce"
                          style={{ animationDuration: '3s' }}
                        />
                        {slot.craftureId && !breedingSession && (
                          <button
                            className="absolute -top-1 -right-1 bg-red-500 rounded-full p-0.5 opacity-0 hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeCraftureFromSlot(slot.id);
                            }}
                          >
                            <X className="h-3 w-3 text-white" />
                          </button>
                        )}
                      </div>
                    )}
                    {!crafture && slot.isBreedingSlot && (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-pink-400/50 text-xs">💕</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Breeding heart overlay */}
              {breedingSession && (
                <div
                  className="absolute flex items-center justify-center pointer-events-none"
                  style={{
                    left: 2 * SLOT_SIZE + 8,
                    top: 2 * SLOT_SIZE + 8,
                    width: 2 * SLOT_SIZE - 4,
                    height: 2 * SLOT_SIZE - 4,
                  }}
                >
                  <div className="text-6xl animate-pulse">💖</div>
                </div>
              )}
            </div>

            {/* Breeding Status */}
            {breedingSession && (
              <Card className="mt-4 bg-pink-500/10 border-pink-500/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={breedingSession.recipe.image}
                      alt={breedingSession.recipe.name}
                      className="w-16 h-16 object-contain rounded-lg bg-pink-500/20"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-pink-300">{breedingSession.recipe.name}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {breedingSession.recipe.description}
                      </p>
                      <Progress value={breedingProgress} className="h-2" />
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-pink-400 flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {breedingProgress >= 100
                            ? 'Ready!'
                            : formatTime(breedingSession.endTime - Date.now())}
                        </span>
                        {breedingProgress >= 100 && (
                          <Button size="sm" onClick={collectBred} className="h-6 text-xs">
                            Collect!
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Breed Button */}
            {!breedingSession && (
              <div className="mt-4 text-center">
                <Button
                  onClick={startBreeding}
                  disabled={!canBreed()}
                  className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Start Breeding
                  {canBreed() && (
                    <span className="ml-2 flex items-center gap-1">
                      <Coins className="h-3 w-3" />
                      {
                        findHybridRecipe(
                          craftureSpecies.find(
                            (s) =>
                              s.id ===
                              ownedCraftures.find(
                                (c) =>
                                  c.id === penSlots.find((slot) => slot.isBreedingSlot && slot.craftureId)?.craftureId
                              )?.speciesId
                          )?.type || 'forest',
                          craftureSpecies.find(
                            (s) =>
                              s.id ===
                              ownedCraftures.find(
                                (c) =>
                                  c.id ===
                                  penSlots.filter((slot) => slot.isBreedingSlot && slot.craftureId)[1]?.craftureId
                              )?.speciesId
                          )?.type || 'forest'
                        )?.coinCost
                      }
                    </span>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Place 2 Craftures in the pink breeding zone to breed
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Crafture Selection Panel */}
        <Card className="bg-card/80 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Craftures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto">
              {ownedCraftures.map((crafture) => {
                const species = craftureSpecies.find((s) => s.id === crafture.speciesId);
                if (!species) return null;

                const isPlaced = penSlots.some((s) => s.craftureId === crafture.id);
                const isSelected = selectedCraftureForPlacement === crafture.id;

                return (
                  <button
                    key={crafture.id}
                    onClick={() => {
                      if (breedingSession) return;
                      setSelectedCraftureForPlacement(isSelected ? null : crafture.id);
                    }}
                    disabled={breedingSession !== null}
                    className={cn(
                      'p-2 rounded-lg border-2 transition-all',
                      isSelected
                        ? 'border-primary bg-primary/20 ring-2 ring-primary'
                        : isPlaced
                        ? 'border-green-500/50 bg-green-500/10'
                        : 'border-border hover:border-primary/50 hover:bg-primary/5',
                      breedingSession && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    <img
                      src={craftureImages[crafture.speciesId]}
                      alt={species.name}
                      className="w-12 h-12 object-contain mx-auto"
                    />
                    <p className="text-xs truncate mt-1">{species.name}</p>
                    <div className={cn('w-3 h-3 rounded-full mx-auto mt-1', getTypeColor(species.type))} />
                  </button>
                );
              })}
            </div>
            {selectedCraftureForPlacement && (
              <p className="text-xs text-center text-primary mt-2 animate-pulse">
                Click a slot to place your Crafture
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recipes Modal */}
      {showRecipes && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Hybrid Recipes</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowRecipes(false)}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-[60vh]">
              <div className="grid gap-3">
                {hybridRecipes.map((recipe) => (
                  <div
                    key={recipe.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-14 h-14 object-contain rounded-lg bg-background"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{recipe.name}</h3>
                        <span
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full',
                            recipe.rarity === 'legendary' && 'bg-yellow-500/20 text-yellow-400',
                            recipe.rarity === 'rare' && 'bg-purple-500/20 text-purple-400',
                            recipe.rarity === 'uncommon' && 'bg-blue-500/20 text-blue-400',
                            recipe.rarity === 'common' && 'bg-gray-500/20 text-gray-400'
                          )}
                        >
                          {recipe.rarity}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">{recipe.description}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs">
                        <span className="flex items-center gap-1">
                          <div className={cn('w-3 h-3 rounded-full', getTypeColor(recipe.parentType1))} />
                          +
                          <div className={cn('w-3 h-3 rounded-full', getTypeColor(recipe.parentType2))} />
                        </span>
                        <span className="flex items-center gap-1 text-yellow-500">
                          <Coins className="h-3 w-3" />
                          {recipe.coinCost}
                        </span>
                        <span className="flex items-center gap-1 text-muted-foreground">
                          <Timer className="h-3 w-3" />
                          {Math.floor(recipe.breedingTime / 60)}:{(recipe.breedingTime % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
