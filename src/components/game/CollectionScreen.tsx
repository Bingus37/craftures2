import { Button } from '@/components/ui/button';
import { OwnedCrafture } from '@/types/crafture';
import { craftureSpecies, craftureImages, typeGradients } from '@/data/craftures';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollectionScreenProps {
  ownedCraftures: OwnedCrafture[];
  onBack: () => void;
  onSelectCrafture: (craftureId: string) => void;
}

export function CollectionScreen({
  ownedCraftures,
  onBack,
  onSelectCrafture,
}: CollectionScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-secondary/20 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">
            My Collection
          </h1>
          <p className="text-sm text-muted-foreground">
            {ownedCraftures.length} Craftures
          </p>
        </div>
      </div>

      {/* Collection grid */}
      {ownedCraftures.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-32 h-32 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <span className="text-6xl">📦</span>
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            No Craftures Yet
          </h2>
          <p className="text-muted-foreground">
            Go explore to catch some Craftures!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {ownedCraftures.map((crafture) => {
            const species = craftureSpecies.find(
              (s) => s.id === crafture.speciesId
            );
            if (!species) return null;

            return (
              <div
                key={crafture.id}
                onClick={() => onSelectCrafture(crafture.id)}
                className="group cursor-pointer rounded-2xl bg-card border-2 border-border p-4 transition-all duration-300 hover:scale-105 hover:shadow-card"
              >
                {/* Pokeball container */}
                <div className="relative">
                  {/* Pokeball background */}
                  <div className="relative w-full aspect-square rounded-full overflow-hidden bg-gradient-to-b from-destructive/80 to-destructive via-destructive border-4 border-foreground/20">
                    {/* Pokeball white half */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-card" />
                    {/* Pokeball center line */}
                    <div className="absolute top-1/2 left-0 right-0 h-2 bg-foreground/20 -translate-y-1/2" />
                    {/* Pokeball center button */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border-4 border-foreground/20" />
                    
                    {/* Creature peeking out on hover */}
                    <img
                      src={craftureImages[species.id]}
                      alt={crafture.nickname}
                      className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 text-center">
                  <h3 className="font-display text-sm font-bold text-foreground truncate">
                    {crafture.nickname}
                  </h3>
                  <span
                    className={cn(
                      'inline-block mt-1 rounded-full px-2 py-0.5 text-xs font-semibold capitalize bg-gradient-to-r text-primary-foreground',
                      typeGradients[species.type]
                    )}
                  >
                    {species.type}
                  </span>

                  {/* Stats preview */}
                  <div className="mt-2 flex justify-center gap-2">
                    <div className="text-xs">
                      <span>❤️</span>
                      <span className="ml-1">{crafture.happiness}%</span>
                    </div>
                    <div className="text-xs">
                      <span>🍖</span>
                      <span className="ml-1">{crafture.hunger}%</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
