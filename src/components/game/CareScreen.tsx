import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { OwnedCrafture } from '@/types/crafture';
import { craftureSpecies, craftureImages, typeGradients } from '@/data/craftures';
import { getHungerMultiplier } from '@/types/crafture';
import { ArrowLeft, Heart, Utensils, Gamepad2, ChevronLeft, ChevronRight, Sparkles, AlertTriangle, Stethoscope } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCrafture } from './AnimatedCrafture';

interface CareScreenProps {
  ownedCraftures: OwnedCrafture[];
  selectedCraftureId: string | null;
  onBack: () => void;
  onFeed: (craftureId: string, amount?: number) => void;
  onPet: (craftureId: string) => void;
  onPlay: (craftureId: string) => void;
  onSelectCrafture: (craftureId: string) => void;
  onEvolve: (craftureId: string, targetEvolutionId?: string) => void;
  checkCanEvolve: (crafture: OwnedCrafture) => { canEvolve: boolean; paths?: { targetId: string; name: string; condition?: string }[] };
  onHeal: (craftureId: string) => void;
}

export function CareScreen({
  ownedCraftures,
  selectedCraftureId,
  onBack,
  onFeed,
  onPet,
  onPlay,
  onSelectCrafture,
  onEvolve,
  checkCanEvolve,
  onHeal,
}: CareScreenProps) {
  const [animation, setAnimation] = useState<'feed' | 'pet' | 'play' | 'evolve' | null>(null);

  const currentIndex = selectedCraftureId
    ? ownedCraftures.findIndex((c) => c.id === selectedCraftureId)
    : 0;
  const crafture = ownedCraftures[currentIndex];
  const species = crafture
    ? craftureSpecies.find((s) => s.id === crafture.speciesId)
    : null;

  const [evolutionChoice, setEvolutionChoice] = useState<{ targetId: string; name: string; condition?: string }[] | null>(null);

  const evolutionResult = crafture ? checkCanEvolve(crafture) : { canEvolve: false };
  const canEvolve = evolutionResult.canEvolve;
  const evolutionPaths = evolutionResult.paths;
  const hungerMultiplier = crafture ? getHungerMultiplier(crafture.hunger) : 1;
  const isHungry = crafture && crafture.hunger < 30;
  const isFainted = crafture && crafture.hp === 0;

  const handleNext = () => {
    if (currentIndex < ownedCraftures.length - 1) {
      onSelectCrafture(ownedCraftures[currentIndex + 1].id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectCrafture(ownedCraftures[currentIndex - 1].id);
    }
  };

  const triggerAnimation = (type: 'feed' | 'pet' | 'play', action: () => void) => {
    setAnimation(type);
    action();
    
    setTimeout(() => {
      setAnimation(null);
    }, 1200);
  };

  const handleEvolve = (targetId?: string) => {
    if (!crafture) return;
    setAnimation('evolve');
    setEvolutionChoice(null);
    setTimeout(() => {
      onEvolve(crafture.id, targetId);
      setAnimation(null);
    }, 1500);
  };

  const handleEvolutionClick = () => {
    if (!evolutionPaths || evolutionPaths.length === 0) return;
    
    if (evolutionPaths.length === 1) {
      handleEvolve(evolutionPaths[0].targetId);
    } else {
      setEvolutionChoice(evolutionPaths);
    }
  };

  const handleHeal = () => {
    if (!crafture) return;
    onHeal(crafture.id);
  };

  if (!crafture || !species) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-secondary/20 p-6">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="font-display text-3xl font-bold text-foreground">
            Care Center
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-32 h-32 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <span className="text-6xl">💕</span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            No Craftures to Care For
          </h2>
          <p className="text-muted-foreground">
            Catch some Craftures first!
          </p>
        </div>
      </div>
    );
  }

  const evolvedSpecies = species.evolvesTo 
    ? craftureSpecies.find(s => s.id === species.evolvesTo) 
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-secondary/20 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="font-display text-3xl font-bold text-foreground">
          Care Center
        </h1>
      </div>

      {/* Crafture display with navigation */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="shrink-0"
        >
          <ChevronLeft className="h-8 w-8" />
        </Button>

        <div className="relative flex-1 max-w-xs">
          {/* Hunger/Fainted Warning */}
          {(isHungry || isFainted) && (
            <div className={cn(
              'absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold z-20',
              isFainted ? 'bg-destructive text-destructive-foreground' : 'bg-amber-100 text-amber-800'
            )}>
              <AlertTriangle className="h-4 w-4" />
              {isFainted ? 'Fainted!' : 'Hungry! Stats weakened'}
            </div>
          )}

          {/* Creature with animated legs */}
          <div className="relative flex justify-center">
            <AnimatedCrafture
              speciesId={species.id}
              className={cn(
                'h-56 w-56',
                animation === 'feed' && 'animate-wiggle',
                animation === 'pet' && 'scale-110',
                animation === 'play' && 'animate-bounce-slow',
                animation === 'evolve' && 'scale-125 brightness-150'
              )}
              isAnimating={!isFainted && animation !== 'evolve'}
              animationType={isFainted ? 'faint' : 'idle'}
              showBackground={true}
            />

            {/* Reaction icons */}
            {animation === 'feed' && (
              <div className="absolute top-8 right-4 text-3xl animate-bounce z-10">
                🍖
              </div>
            )}
            {animation === 'pet' && (
              <div className="absolute top-8 right-4 text-3xl animate-heart z-10">
                💕
              </div>
            )}
            {animation === 'play' && (
              <div className="absolute top-8 right-4 text-3xl animate-bounce z-10">
                ⭐
              </div>
            )}
            {animation === 'evolve' && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Sparkles className="h-24 w-24 text-amber-400 animate-spin" />
              </div>
            )}
          </div>

          {/* Name plate */}
          <div className="mt-4 text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              {crafture.nickname}
            </h2>
            <span
              className={cn(
                'inline-block mt-1 rounded-full px-3 py-1 text-sm font-semibold capitalize bg-gradient-to-r text-primary-foreground',
                typeGradients[species.type]
              )}
            >
              {species.type} • Lv. {crafture.level}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          disabled={currentIndex === ownedCraftures.length - 1}
          className="shrink-0"
        >
          <ChevronRight className="h-8 w-8" />
        </Button>
      </div>

      {/* Evolution choice dialog */}
      {evolutionChoice && evolutionChoice.length > 1 && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="font-display text-xl font-bold mb-4 text-center">Choose Evolution</h3>
            <div className="space-y-3">
              {evolutionChoice.map(path => (
                <Button
                  key={path.targetId}
                  variant="outline"
                  size="lg"
                  className="w-full justify-between"
                  onClick={() => handleEvolve(path.targetId)}
                >
                  <span>{path.name}</span>
                  {path.condition && (
                    <span className="text-xs text-muted-foreground">({path.condition})</span>
                  )}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4"
              onClick={() => setEvolutionChoice(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Evolution button */}
      {canEvolve && evolutionPaths && evolutionPaths.length > 0 && (
        <div className="max-w-sm mx-auto mb-4">
          <Button
            variant="default"
            size="lg"
            className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold"
            onClick={handleEvolutionClick}
            disabled={animation === 'evolve'}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            {evolutionPaths.length === 1 
              ? `Evolve into ${evolutionPaths[0].name}!`
              : 'Evolution Ready!'}
          </Button>
        </div>
      )}

      {/* HP Bar for fainted check */}
      {isFainted && (
        <div className="max-w-sm mx-auto mb-4">
          <Button
            variant="default"
            size="lg"
            className="w-full bg-gradient-to-r from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 font-bold"
            onClick={handleHeal}
          >
            <Stethoscope className="h-5 w-5 mr-2" />
            Heal at Care Center
          </Button>
        </div>
      )}

      {/* Stats */}
      <div className="max-w-sm mx-auto space-y-4 mb-8">
        {/* HP */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold flex items-center gap-1">
              <Heart className="h-4 w-4 text-rose-500" />
              HP
            </span>
            <span>{crafture.hp}/{crafture.maxHp}</span>
          </div>
          <Progress
            value={(crafture.hp / crafture.maxHp) * 100}
            className="h-3 bg-muted"
            indicatorClassName={crafture.hp === 0 ? 'bg-destructive' : undefined}
          />
        </div>

        {/* Hunger with penalty indicator */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold flex items-center gap-1">
              <Utensils className="h-4 w-4 text-amber-500" />
              Hunger
              {isHungry && (
                <span className="text-xs text-destructive ml-1">
                  ({Math.round((1 - hungerMultiplier) * 100)}% stat penalty!)
                </span>
              )}
            </span>
            <span className={cn(isHungry && 'text-destructive font-bold')}>{crafture.hunger}%</span>
          </div>
          <Progress
            value={crafture.hunger}
            className="h-3 bg-muted"
            indicatorClassName={isHungry ? 'bg-gradient-to-r from-destructive to-amber-500' : undefined}
          />
        </div>

        {/* Happiness */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold flex items-center gap-1">
              <Heart className="h-4 w-4 text-pink-500" />
              Happiness
            </span>
            <span>{crafture.happiness}%</span>
          </div>
          <Progress
            value={crafture.happiness}
            className="h-3 bg-muted"
          />
        </div>

        {/* Experience */}
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="font-semibold flex items-center gap-1">
              <Gamepad2 className="h-4 w-4 text-blue-500" />
              Experience
            </span>
            <span>{crafture.experience} / {crafture.level * 100} XP</span>
          </div>
          <Progress
            value={(crafture.experience / (crafture.level * 100)) * 100}
            className="h-3 bg-muted"
          />
        </div>

        {/* Battle stats with hunger penalty shown */}
        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-muted">
          <div className="text-center">
            <div className="text-xs text-muted-foreground">ATK</div>
            <div className={cn('font-bold', isHungry ? 'text-muted-foreground' : 'text-destructive')}>
              {isHungry ? (
                <span>{Math.floor(crafture.attack * hungerMultiplier)} <span className="text-xs line-through">{crafture.attack}</span></span>
              ) : crafture.attack}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">DEF</div>
            <div className="font-bold text-primary">{crafture.defense}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground">SPD</div>
            <div className="font-bold text-accent">{crafture.speed}</div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="max-w-sm mx-auto grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="flex-col h-20 bg-amber-50 border-amber-200 hover:bg-amber-100"
          onClick={() => triggerAnimation('feed', () => onFeed(crafture.id))}
        >
          <Utensils className="h-6 w-6 text-amber-600 mb-1" />
          <span className="text-xs font-semibold">Feed</span>
        </Button>

        <Button
          variant="outline"
          className="flex-col h-20 bg-pink-50 border-pink-200 hover:bg-pink-100"
          onClick={() => triggerAnimation('pet', () => onPet(crafture.id))}
        >
          <Heart className="h-6 w-6 text-pink-500 mb-1" />
          <span className="text-xs font-semibold">Pet</span>
        </Button>
      </div>

      {/* Pagination dots */}
      {ownedCraftures.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {ownedCraftures.map((c, i) => (
            <button
              key={c.id}
              onClick={() => onSelectCrafture(c.id)}
              className={cn(
                'w-3 h-3 rounded-full transition-all',
                i === currentIndex
                  ? 'bg-primary scale-125'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
