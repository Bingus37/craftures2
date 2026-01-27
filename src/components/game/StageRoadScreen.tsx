import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { craftureSpecies, craftureImages, typeGradients } from '@/data/craftures';
import { OwnedCrafture } from '@/types/crafture';
import { ArrowLeft, Swords, Star, Lock, Trophy, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Stage {
  id: number;
  name: string;
  description: string;
  enemySpeciesId: string;
  enemyLevel: number;
  rewards: {
    coins: number;
    xp: number;
  };
  requiredLevel: number;
  background: string;
}

export const STAGES: Stage[] = [
  // Early stages (1-5)
  { id: 1, name: 'Forest Path', description: 'A peaceful forest trail', enemySpeciesId: 'fluffkin', enemyLevel: 2, rewards: { coins: 50, xp: 30 }, requiredLevel: 1, background: 'from-green-200 to-emerald-300' },
  { id: 2, name: 'Rocky Road', description: 'A boulder-filled path', enemySpeciesId: 'boulderball', enemyLevel: 3, rewards: { coins: 60, xp: 40 }, requiredLevel: 2, background: 'from-stone-300 to-slate-400' },
  { id: 3, name: 'Frosty Glade', description: 'A chilly clearing', enemySpeciesId: 'frostling', enemyLevel: 4, rewards: { coins: 75, xp: 50 }, requiredLevel: 3, background: 'from-cyan-200 to-blue-300' },
  { id: 4, name: 'Ember Path', description: 'Warm embers glow here', enemySpeciesId: 'emberpuff', enemyLevel: 5, rewards: { coins: 85, xp: 60 }, requiredLevel: 4, background: 'from-orange-200 to-red-300' },
  { id: 5, name: 'Static Field', description: 'Hair-raising electricity', enemySpeciesId: 'sparkfuzz', enemyLevel: 6, rewards: { coins: 100, xp: 70 }, requiredLevel: 5, background: 'from-yellow-200 to-amber-300' },
  
  // Mid stages (6-10)
  { id: 6, name: 'Mystic Lake', description: 'Glowing waters', enemySpeciesId: 'bubblefur', enemyLevel: 8, rewards: { coins: 125, xp: 90 }, requiredLevel: 7, background: 'from-blue-200 to-cyan-300' },
  { id: 7, name: 'Shadow Woods', description: 'Dark and mysterious', enemySpeciesId: 'shadowmop', enemyLevel: 10, rewards: { coins: 150, xp: 110 }, requiredLevel: 9, background: 'from-purple-300 to-violet-400' },
  { id: 8, name: 'Haunted Ruins', description: 'Ancient ghostly remains', enemySpeciesId: 'spectrepuff', enemyLevel: 11, rewards: { coins: 175, xp: 130 }, requiredLevel: 10, background: 'from-indigo-200 to-purple-300' },
  { id: 9, name: 'Bloom Garden', description: 'Eternal flower paradise', enemySpeciesId: 'petalwisp', enemyLevel: 12, rewards: { coins: 200, xp: 150 }, requiredLevel: 11, background: 'from-pink-200 to-rose-300' },
  { id: 10, name: 'Digital Realm', description: 'A glitched dimension', enemySpeciesId: 'cubeling', enemyLevel: 13, rewards: { coins: 225, xp: 170 }, requiredLevel: 12, background: 'from-amber-200 to-yellow-300' },
  
  // Advanced stages (11-15) - evolved forms
  { id: 11, name: 'Forest Kingdom', description: 'Where the Fluffking rules', enemySpeciesId: 'fluffguard', enemyLevel: 15, rewards: { coins: 275, xp: 200 }, requiredLevel: 14, background: 'from-green-300 to-emerald-400' },
  { id: 12, name: 'Frost Cavern', description: 'Deep ice cave', enemySpeciesId: 'frostclaw', enemyLevel: 17, rewards: { coins: 325, xp: 230 }, requiredLevel: 16, background: 'from-blue-300 to-cyan-400' },
  { id: 13, name: 'Inferno Peak', description: 'Top of the volcano', enemySpeciesId: 'embercore', enemyLevel: 19, rewards: { coins: 375, xp: 260 }, requiredLevel: 18, background: 'from-red-300 to-orange-400' },
  { id: 14, name: 'Storm Summit', description: 'Thunder never stops', enemySpeciesId: 'voltpulse', enemyLevel: 21, rewards: { coins: 425, xp: 290 }, requiredLevel: 20, background: 'from-yellow-300 to-amber-400' },
  { id: 15, name: 'Mountain Core', description: 'Heart of the earth', enemySpeciesId: 'stoneshield', enemyLevel: 23, rewards: { coins: 475, xp: 320 }, requiredLevel: 22, background: 'from-stone-400 to-slate-500' },
  
  // Late stages (16-20) - legendary forms
  { id: 16, name: 'Abyssal Depths', description: 'The ocean floor', enemySpeciesId: 'tidalwave', enemyLevel: 25, rewards: { coins: 550, xp: 360 }, requiredLevel: 24, background: 'from-blue-400 to-indigo-500' },
  { id: 17, name: 'Spirit Realm', description: 'Between worlds', enemySpeciesId: 'wraith', enemyLevel: 27, rewards: { coins: 625, xp: 400 }, requiredLevel: 26, background: 'from-indigo-400 to-purple-500' },
  { id: 18, name: 'Void Sanctum', description: 'The edge of reality', enemySpeciesId: 'shadowfiend', enemyLevel: 29, rewards: { coins: 700, xp: 440 }, requiredLevel: 28, background: 'from-violet-400 to-purple-500' },
  { id: 19, name: 'Data Fortress', description: 'The digital heart', enemySpeciesId: 'datacube', enemyLevel: 32, rewards: { coins: 800, xp: 500 }, requiredLevel: 30, background: 'from-amber-300 to-yellow-400' },
  { id: 20, name: 'Eden\'s Gate', description: 'The ultimate challenge', enemySpeciesId: 'petalguard', enemyLevel: 35, rewards: { coins: 1000, xp: 600 }, requiredLevel: 33, background: 'from-rose-300 via-pink-300 to-fuchsia-300' },
  
  // Endgame stages (21-25) - Final evolutions
  { id: 21, name: 'Emperor\'s Throne', description: 'Face the forest emperor', enemySpeciesId: 'fluffemperor', enemyLevel: 38, rewards: { coins: 1200, xp: 700 }, requiredLevel: 36, background: 'from-emerald-400 to-green-500' },
  { id: 22, name: 'Frozen Abyss', description: 'The coldest place', enemySpeciesId: 'frostmonarch', enemyLevel: 40, rewards: { coins: 1400, xp: 800 }, requiredLevel: 38, background: 'from-blue-500 to-cyan-600' },
  { id: 23, name: 'Inferno\'s Heart', description: 'Core of all flames', enemySpeciesId: 'infernolord', enemyLevel: 42, rewards: { coins: 1600, xp: 900 }, requiredLevel: 40, background: 'from-red-500 to-orange-600' },
  { id: 24, name: 'Storm\'s Eye', description: 'The eternal tempest', enemySpeciesId: 'tempestking', enemyLevel: 45, rewards: { coins: 1800, xp: 1000 }, requiredLevel: 43, background: 'from-yellow-500 to-amber-600' },
  { id: 25, name: 'The Final Gate', description: 'Ultimate champion', enemySpeciesId: 'bloomqueen', enemyLevel: 50, rewards: { coins: 2500, xp: 1500 }, requiredLevel: 47, background: 'from-rose-400 via-pink-400 to-fuchsia-400' },
];

interface StageRoadScreenProps {
  onBack: () => void;
  onStartBattle: (stage: Stage) => void;
  completedStages: number[];
  ownedCraftures: OwnedCrafture[];
}

export function StageRoadScreen({ onBack, onStartBattle, completedStages, ownedCraftures }: StageRoadScreenProps) {
  const highestPlayerLevel = Math.max(...ownedCraftures.map(c => c.level), 1);
  const completedCount = completedStages.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-secondary/20 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="flex-1">
          <h1 className="font-display text-3xl font-bold text-foreground flex items-center gap-2">
            <Swords className="h-8 w-8 text-red-500" />
            Stage Road
          </h1>
          <p className="text-sm text-muted-foreground">
            {completedCount}/{STAGES.length} stages cleared
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6 bg-card rounded-xl p-4 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">Progress</span>
          <span className="text-sm text-muted-foreground">{Math.round((completedCount / STAGES.length) * 100)}%</span>
        </div>
        <Progress value={(completedCount / STAGES.length) * 100} className="h-3" />
        {completedCount === STAGES.length && (
          <div className="flex items-center gap-2 mt-2 text-amber-600">
            <Trophy className="h-4 w-4" />
            <span className="text-sm font-semibold">Champion!</span>
          </div>
        )}
      </div>

      {/* Stage road - vertical list */}
      <div className="space-y-4">
        {STAGES.map((stage, index) => {
          const isCompleted = completedStages.includes(stage.id);
          const isUnlocked = highestPlayerLevel >= stage.requiredLevel;
          const previousCompleted = index === 0 || completedStages.includes(STAGES[index - 1].id);
          const canPlay = isUnlocked && previousCompleted;
          
          const enemySpecies = craftureSpecies.find(s => s.id === stage.enemySpeciesId);
          
          return (
            <div key={stage.id} className="relative">
              {/* Connector line */}
              {index < STAGES.length - 1 && (
                <div className={cn(
                  'absolute left-8 top-full w-1 h-4 -translate-x-1/2',
                  isCompleted ? 'bg-primary' : 'bg-muted'
                )} />
              )}
              
              <div
                className={cn(
                  'bg-card rounded-xl p-4 shadow-card transition-all border-2',
                  isCompleted && 'border-primary',
                  canPlay && !isCompleted && 'border-amber-400 hover:scale-[1.02]',
                  !canPlay && 'opacity-60 border-transparent'
                )}
              >
                <div className="flex items-center gap-4">
                  {/* Stage number badge */}
                  <div className={cn(
                    'w-14 h-14 rounded-full flex items-center justify-center font-display text-lg font-bold shrink-0 bg-gradient-to-br',
                    isCompleted ? 'from-primary to-emerald-600 text-primary-foreground' : 
                    canPlay ? stage.background + ' text-foreground' : 
                    'from-muted to-slate-300 text-muted-foreground'
                  )}>
                    {isCompleted ? <Star className="h-6 w-6 fill-current" /> : 
                     canPlay ? stage.id : <Lock className="h-5 w-5" />}
                  </div>

                  {/* Stage info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg truncate">
                      {stage.name}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {stage.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {enemySpecies && (
                        <span className={cn(
                          'text-xs rounded-full px-2 py-0.5 bg-gradient-to-r text-primary-foreground',
                          typeGradients[enemySpecies.type]
                        )}>
                          Lv.{stage.enemyLevel} {enemySpecies.name}
                        </span>
                      )}
                      {!canPlay && (
                        <span className="text-xs text-muted-foreground">
                          Requires Lv.{stage.requiredLevel}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Enemy preview */}
                  <div className="w-16 h-16 shrink-0 relative">
                    {enemySpecies && (
                      <img
                        src={craftureImages[stage.enemySpeciesId]}
                        alt={enemySpecies.name}
                        className={cn(
                          'w-full h-full object-contain',
                          !canPlay && 'grayscale opacity-50'
                        )}
                      />
                    )}
                  </div>

                  {/* Action button */}
                  {canPlay && (
                    <Button
                      variant={isCompleted ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => onStartBattle(stage)}
                      className={cn(!isCompleted && 'bg-red-500 hover:bg-red-600')}
                    >
                      <Swords className="h-4 w-4 mr-1" />
                      {isCompleted ? 'Replay' : 'Battle'}
                    </Button>
                  )}
                </div>

                {/* Rewards */}
                {canPlay && (
                  <div className="mt-3 pt-3 border-t border-muted flex items-center gap-4 text-xs">
                    <span className="text-muted-foreground">Rewards:</span>
                    <span className="flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                      🪙 {stage.rewards.coins}
                    </span>
                    <span className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                      ✨ {stage.rewards.xp} XP
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
