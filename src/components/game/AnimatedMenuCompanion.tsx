import { cn } from '@/lib/utils';
import { craftureImages, craftureSpecies, typeGradients } from '@/data/craftures';
import { OwnedCrafture } from '@/types/crafture';

interface AnimatedMenuCompanionProps {
  crafture: OwnedCrafture;
  className?: string;
}

export function AnimatedMenuCompanion({ crafture, className }: AnimatedMenuCompanionProps) {
  const species = craftureSpecies.find(s => s.id === crafture.speciesId);
  const imageSrc = craftureImages[crafture.speciesId];

  if (!species) return null;

  // Background colors based on type
  const backgroundGradients: Record<string, string> = {
    forest: 'from-green-200/50 via-emerald-100/50 to-lime-200/50',
    ice: 'from-cyan-200/50 via-blue-100/50 to-sky-200/50',
    fire: 'from-orange-200/50 via-amber-100/50 to-yellow-200/50',
    water: 'from-blue-200/50 via-cyan-100/50 to-teal-200/50',
    shadow: 'from-purple-300/50 via-violet-200/50 to-indigo-200/50',
    flower: 'from-pink-200/50 via-rose-100/50 to-fuchsia-200/50',
    cube: 'from-amber-200/50 via-yellow-100/50 to-orange-200/50',
    thunder: 'from-yellow-200/50 via-amber-100/50 to-lime-200/50',
    rock: 'from-stone-300/50 via-gray-200/50 to-slate-200/50',
    ghost: 'from-indigo-200/50 via-purple-100/50 to-violet-200/50',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Background glow */}
      <div
        className={cn(
          'absolute inset-0 rounded-full bg-gradient-to-br blur-xl opacity-60',
          backgroundGradients[species.type] || backgroundGradients.forest
        )}
      />
      
      {/* Main animated container */}
      <div className="relative flex flex-col items-center">
        {/* Body with bob animation */}
        <div className="relative z-10 animate-crafture-body-idle">
          <img
            src={imageSrc}
            alt={crafture.nickname}
            className="w-full h-full object-contain drop-shadow-2xl"
          />
        </div>

        {/* Paper Mario style animated legs */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-6 z-0">
          {/* Left leg */}
          <div
            className="w-4 h-12 rounded-full origin-top animate-leg-left"
            style={{ 
              background: `linear-gradient(to bottom, transparent 0%, hsl(var(--type-${
                species.type === 'cube' || species.type === 'thunder' || species.type === 'rock' || species.type === 'ghost' 
                  ? 'forest' : species.type
              })) 40%, hsl(var(--type-${
                species.type === 'cube' || species.type === 'thunder' || species.type === 'rock' || species.type === 'ghost' 
                  ? 'forest' : species.type
              })) 100%)`,
              transform: 'translateY(-25px)'
            }}
          />
          {/* Right leg */}
          <div
            className="w-4 h-12 rounded-full origin-top animate-leg-right"
            style={{ 
              background: `linear-gradient(to bottom, transparent 0%, hsl(var(--type-${
                species.type === 'cube' || species.type === 'thunder' || species.type === 'rock' || species.type === 'ghost' 
                  ? 'forest' : species.type
              })) 40%, hsl(var(--type-${
                species.type === 'cube' || species.type === 'thunder' || species.type === 'rock' || species.type === 'ghost' 
                  ? 'forest' : species.type
              })) 100%)`,
              transform: 'translateY(-25px)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
