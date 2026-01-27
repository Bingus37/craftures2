import { cn } from '@/lib/utils';
import { craftureImages, craftureSpecies, typeGradients } from '@/data/craftures';

interface AnimatedCraftureProps {
  speciesId: string;
  className?: string;
  isAnimating?: boolean;
  animationType?: 'idle' | 'attack' | 'hurt' | 'faint';
  showBackground?: boolean;
}

export function AnimatedCrafture({
  speciesId,
  className,
  isAnimating = true,
  animationType = 'idle',
  showBackground = true,
}: AnimatedCraftureProps) {
  const species = craftureSpecies.find(s => s.id === speciesId);
  const imageSrc = craftureImages[speciesId];

  if (!species) return null;

  // Background colors based on type
  const backgroundGradients: Record<string, string> = {
    forest: 'from-green-200 via-emerald-100 to-lime-200',
    ice: 'from-cyan-200 via-blue-100 to-sky-200',
    fire: 'from-orange-200 via-amber-100 to-yellow-200',
    water: 'from-blue-200 via-cyan-100 to-teal-200',
    shadow: 'from-purple-300 via-violet-200 to-indigo-200',
    flower: 'from-pink-200 via-rose-100 to-fuchsia-200',
    cube: 'from-amber-200 via-yellow-100 to-orange-200',
    thunder: 'from-yellow-200 via-amber-100 to-lime-200',
    rock: 'from-stone-300 via-gray-200 to-slate-200',
    ghost: 'from-indigo-200 via-purple-100 to-violet-200',
  };

  return (
    <div className={cn('relative', className)}>
      {/* Background circle */}
      {showBackground && (
        <div
          className={cn(
            'absolute inset-0 rounded-full bg-gradient-to-br opacity-60',
            backgroundGradients[species.type] || backgroundGradients.forest
          )}
        />
      )}
      
      {/* Animated legs container - Paper Mario style */}
      <div className="relative flex flex-col items-center">
        {/* Body (the actual image) */}
        <div
          className={cn(
            'relative z-10 transition-transform duration-200',
            // Body animations
            isAnimating && animationType === 'idle' && 'animate-crafture-body-idle',
            animationType === 'attack' && 'animate-crafture-attack',
            animationType === 'hurt' && 'animate-shake',
            animationType === 'faint' && 'opacity-30 grayscale'
          )}
        >
          <img
            src={imageSrc}
            alt={species.name}
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        {/* Paper Mario style legs */}
        {isAnimating && animationType !== 'faint' && (
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-4 z-0">
            {/* Left leg */}
            <div
              className={cn(
                'w-3 h-10 rounded-full origin-top',
                'bg-gradient-to-b from-transparent via-current to-current',
                animationType === 'idle' && 'animate-leg-left'
              )}
              style={{ 
                color: `hsl(var(--type-${species.type === 'cube' || species.type === 'thunder' || species.type === 'rock' || species.type === 'ghost' ? 'forest' : species.type}))`,
                transform: 'translateY(-20px)'
              }}
            />
            {/* Right leg */}
            <div
              className={cn(
                'w-3 h-10 rounded-full origin-top',
                'bg-gradient-to-b from-transparent via-current to-current',
                animationType === 'idle' && 'animate-leg-right'
              )}
              style={{ 
                color: `hsl(var(--type-${species.type === 'cube' || species.type === 'thunder' || species.type === 'rock' || species.type === 'ghost' ? 'forest' : species.type}))`,
                transform: 'translateY(-20px)'
              }}
            />
          </div>
        )}
      </div>

      {/* Glow effect */}
      {showBackground && (
        <div
          className={cn(
            'absolute inset-0 -z-10 rounded-full opacity-30 blur-xl bg-gradient-to-r',
            typeGradients[species.type]
          )}
        />
      )}
    </div>
  );
}
