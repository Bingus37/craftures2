import { CraftureSpecies } from '@/types/crafture';
import { typeGradients } from '@/data/craftures';
import { cn } from '@/lib/utils';
import { AnimatedCrafture } from './AnimatedCrafture';

interface CraftureCardProps {
  species: CraftureSpecies;
  onClick?: () => void;
  selected?: boolean;
  showDetails?: boolean;
  className?: string;
}

export function CraftureCard({
  species,
  onClick,
  selected = false,
  showDetails = true,
  className,
}: CraftureCardProps) {
  const rarityColors = {
    common: 'border-muted-foreground/30',
    uncommon: 'border-green-400',
    rare: 'border-blue-400',
    legendary: 'border-amber-400',
  };

  const rarityBg = {
    common: 'bg-muted/50',
    uncommon: 'bg-green-50',
    rare: 'bg-blue-50',
    legendary: 'bg-amber-50',
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        'relative group cursor-pointer rounded-2xl border-4 bg-card p-4 transition-all duration-300 hover:scale-105',
        rarityColors[species.rarity],
        selected && 'ring-4 ring-primary ring-offset-2 scale-105',
        className
      )}
    >
      {/* Type gradient header */}
      <div
        className={cn(
          'absolute top-0 left-0 right-0 h-2 rounded-t-xl bg-gradient-to-r',
          typeGradients[species.type]
        )}
      />

      {/* Creature image with animated legs */}
      <div className="relative mt-2 flex justify-center">
        <AnimatedCrafture
          speciesId={species.id}
          className="h-32 w-32"
          isAnimating={selected}
          animationType="idle"
          showBackground={true}
        />
      </div>

      {/* Info section */}
      <div className="mt-4 text-center">
        <h3 className="font-display text-xl font-bold text-foreground">
          {species.name}
        </h3>

        {/* Type badge */}
        <span
          className={cn(
            'mt-1 inline-block rounded-full px-3 py-1 text-xs font-semibold capitalize bg-gradient-to-r text-primary-foreground',
            typeGradients[species.type]
          )}
        >
          {species.type}
        </span>

        {/* Rarity badge */}
        <div className="mt-2">
          <span
            className={cn(
              'inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize',
              rarityBg[species.rarity],
              'text-foreground'
            )}
          >
            {species.rarity}
          </span>
        </div>

        {showDetails && (
          <p className="mt-3 text-xs text-muted-foreground line-clamp-2">
            {species.description}
          </p>
        )}
      </div>
    </div>
  );
}
