import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { craftureSpecies, craftureImages, typeGradients } from '@/data/craftures';
import { ArrowLeft, Lock, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EncyclopediaScreenProps {
  onBack: () => void;
  discoveredSpeciesIds: string[];
}

export function EncyclopediaScreen({ onBack, discoveredSpeciesIds }: EncyclopediaScreenProps) {
  // Filter to show only base forms (not evolved ones) for cleaner display
  const baseSpecies = craftureSpecies.filter(s => !craftureSpecies.some(e => e.evolvesTo === s.id));
  const allSpecies = craftureSpecies;
  
  const discoveredCount = allSpecies.filter(s => discoveredSpeciesIds.includes(s.id)).length;
  const completionPercent = (discoveredCount / allSpecies.length) * 100;

  const rarityColors = {
    common: 'bg-slate-200 text-slate-700',
    uncommon: 'bg-emerald-200 text-emerald-700',
    rare: 'bg-blue-200 text-blue-700',
    legendary: 'bg-amber-200 text-amber-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-secondary/20 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-foreground">
            Encyclopedia
          </h1>
          <p className="text-sm text-muted-foreground">
            {discoveredCount}/{allSpecies.length} discovered
          </p>
        </div>
      </div>

      {/* Completion progress */}
      <div className="mb-6 bg-card rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Completion</span>
          <span className="text-sm text-muted-foreground">{Math.round(completionPercent)}%</span>
        </div>
        <Progress value={completionPercent} className="h-3" />
        {completionPercent === 100 && (
          <div className="flex items-center gap-2 mt-2 text-amber-600">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-semibold">Master Collector!</span>
          </div>
        )}
      </div>

      {/* Species grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {allSpecies.map((species, index) => {
          const isDiscovered = discoveredSpeciesIds.includes(species.id);
          
          return (
            <div
              key={species.id}
              className={cn(
                'bg-card rounded-xl p-4 shadow-card transition-all',
                isDiscovered ? 'hover:scale-105' : 'opacity-60'
              )}
            >
              {/* Number */}
              <div className="text-xs text-muted-foreground mb-2">
                #{String(index + 1).padStart(3, '0')}
              </div>

              {/* Image */}
              <div className="relative w-full aspect-square mb-3">
                {isDiscovered ? (
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full bg-gradient-to-br opacity-50',
                      typeGradients[species.type]
                    )}
                  />
                ) : null}
                <img
                  src={isDiscovered ? craftureImages[species.id] || craftureImages['fluffkin'] : craftureImages['fluffkin']}
                  alt={isDiscovered ? species.name : '???'}
                  className={cn(
                    'relative z-10 w-full h-full object-contain',
                    !isDiscovered && 'brightness-0'
                  )}
                />
                {!isDiscovered && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <Lock className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Name and type */}
              <h3 className="font-display font-bold text-sm text-center mb-1">
                {isDiscovered ? species.name : '???'}
              </h3>
              
              {isDiscovered && (
                <>
                  <div className="flex justify-center mb-2">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-semibold capitalize bg-gradient-to-r text-primary-foreground',
                        typeGradients[species.type]
                      )}
                    >
                      {species.type}
                    </span>
                  </div>
                  
                  <div className="flex justify-center">
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-xs font-semibold capitalize',
                        rarityColors[species.rarity]
                      )}
                    >
                      {species.rarity}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground mt-2 text-center line-clamp-2">
                    {species.description}
                  </p>

                  {/* Base Stats */}
                  <div className="grid grid-cols-3 gap-1 mt-3 text-xs">
                    <div className="text-center">
                      <div className="text-muted-foreground">ATK</div>
                      <div className="font-bold text-destructive">{species.baseAttack}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">DEF</div>
                      <div className="font-bold text-primary">{species.baseDefense}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-muted-foreground">SPD</div>
                      <div className="font-bold text-accent">{species.baseSpeed}</div>
                    </div>
                  </div>

                  {/* Evolution info */}
                  {species.evolvesTo && (
                    <div className="mt-2 text-center">
                      <span className="text-xs text-muted-foreground">
                        Evolves at Lv.{species.evolvesAt}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
