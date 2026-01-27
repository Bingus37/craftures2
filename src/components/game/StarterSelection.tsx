import { useState } from 'react';
import { CraftureCard } from './CraftureCard';
import { Button } from '@/components/ui/button';
import { craftureSpecies } from '@/data/craftures';
import { Sparkles } from 'lucide-react';

interface StarterSelectionProps {
  onSelect: (speciesId: string) => void;
}

// Only 3 specific unevolved base forms can be starters
const STARTER_IDS = ['fluffkin', 'emberpuff', 'frostling'];
const starterSpecies = craftureSpecies.filter(
  (s) => STARTER_IDS.includes(s.id)
);

export function StarterSelection({ onSelect }: StarterSelectionProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-secondary/20 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-accent animate-pulse" />
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Welcome, Trainer!
          </h1>
          <Sparkles className="h-8 w-8 text-accent animate-pulse" />
        </div>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Choose your first Crafture companion to begin your adventure!
        </p>
      </div>

      {/* Starter cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-8">
        {starterSpecies.map((species) => (
          <CraftureCard
            key={species.id}
            species={species}
            selected={selectedId === species.id}
            onClick={() => setSelectedId(species.id)}
          />
        ))}
      </div>

      {/* Confirm button */}
      <div className="text-center">
        <Button
          variant="game"
          size="xl"
          disabled={!selectedId}
          onClick={() => selectedId && onSelect(selectedId)}
          className="min-w-[200px]"
        >
          <Sparkles className="h-5 w-5" />
          Choose Partner
        </Button>
        {!selectedId && (
          <p className="mt-3 text-sm text-muted-foreground">
            Tap a Crafture above to select it
          </p>
        )}
      </div>
    </div>
  );
}
