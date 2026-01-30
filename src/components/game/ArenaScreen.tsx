import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OwnedCrafture } from '@/types/crafture';
import { craftureSpecies, craftureImages } from '@/data/craftures';
import { ArrowLeft, Swords, Trophy, Star, Zap } from 'lucide-react';
import { AnimatedCrafture } from './AnimatedCrafture';
import { cn } from '@/lib/utils';

interface ArenaTrainer {
  id: string;
  name: string;
  title: string;
  difficulty: 'rookie' | 'veteran' | 'champion' | 'legend';
  team: { speciesId: string; level: number }[];
  rewards: { coins: number; xp: number };
  icon: string;
}

const ARENA_TRAINERS: ArenaTrainer[] = [
  // Rookie League
  {
    id: 'rookie-1',
    name: 'Tommy',
    title: 'Bug Catcher',
    difficulty: 'rookie',
    team: [{ speciesId: 'fluffkin', level: 5 }],
    rewards: { coins: 50, xp: 30 },
    icon: '🐛',
  },
  {
    id: 'rookie-2',
    name: 'Sarah',
    title: 'Youngster',
    difficulty: 'rookie',
    team: [
      { speciesId: 'bloomsprout', level: 6 },
      { speciesId: 'pebblite', level: 5 },
    ],
    rewards: { coins: 80, xp: 50 },
    icon: '🌱',
  },
  {
    id: 'rookie-3',
    name: 'Marcus',
    title: 'Rookie Trainer',
    difficulty: 'rookie',
    team: [
      { speciesId: 'emberpuff', level: 8 },
      { speciesId: 'frostling', level: 7 },
    ],
    rewards: { coins: 120, xp: 80 },
    icon: '🔥',
  },
  // Veteran League
  {
    id: 'veteran-1',
    name: 'Elena',
    title: 'Ice Master',
    difficulty: 'veteran',
    team: [
      { speciesId: 'frostclaw', level: 18 },
      { speciesId: 'crystalpuff', level: 16 },
    ],
    rewards: { coins: 200, xp: 150 },
    icon: '❄️',
  },
  {
    id: 'veteran-2',
    name: 'Blaze',
    title: 'Fire Breather',
    difficulty: 'veteran',
    team: [
      { speciesId: 'embercore', level: 20 },
      { speciesId: 'lavapup', level: 18 },
    ],
    rewards: { coins: 250, xp: 180 },
    icon: '🔥',
  },
  {
    id: 'veteran-3',
    name: 'Marina',
    title: 'Ocean Sage',
    difficulty: 'veteran',
    team: [
      { speciesId: 'tidalwave', level: 22 },
      { speciesId: 'coralkit', level: 20 },
      { speciesId: 'aquakit', level: 18 },
    ],
    rewards: { coins: 300, xp: 220 },
    icon: '🌊',
  },
  // Champion League
  {
    id: 'champion-1',
    name: 'Victor',
    title: 'Shadow Knight',
    difficulty: 'champion',
    team: [
      { speciesId: 'shadowfiend', level: 32 },
      { speciesId: 'wraith', level: 30 },
      { speciesId: 'phantomking', level: 35 },
    ],
    rewards: { coins: 500, xp: 400 },
    icon: '🌑',
  },
  {
    id: 'champion-2',
    name: 'Gaia',
    title: 'Nature Guardian',
    difficulty: 'champion',
    team: [
      { speciesId: 'fluffemperor', level: 35 },
      { speciesId: 'bloomqueen', level: 33 },
      { speciesId: 'jungleking', level: 32 },
    ],
    rewards: { coins: 600, xp: 450 },
    icon: '🌿',
  },
  // Legend League
  {
    id: 'legend-1',
    name: 'Titan',
    title: 'Mechanical Overlord',
    difficulty: 'legend',
    team: [
      { speciesId: 'clockworktitan', level: 45 },
      { speciesId: 'steamguard', level: 42 },
      { speciesId: 'terabyte', level: 40 },
    ],
    rewards: { coins: 1000, xp: 800 },
    icon: '⚙️',
  },
  {
    id: 'legend-2',
    name: 'Primordial',
    title: 'Supreme Champion',
    difficulty: 'legend',
    team: [
      { speciesId: 'fluffgod', level: 50 },
      { speciesId: 'infernoking', level: 50 },
      { speciesId: 'frostprime', level: 50 },
    ],
    rewards: { coins: 2000, xp: 1500 },
    icon: '👑',
  },
];

const DIFFICULTY_COLORS = {
  rookie: 'from-green-400 to-emerald-500',
  veteran: 'from-blue-400 to-indigo-500',
  champion: 'from-purple-400 to-violet-500',
  legend: 'from-amber-400 to-orange-500',
};

const DIFFICULTY_LABELS = {
  rookie: 'Rookie League',
  veteran: 'Veteran League',
  champion: 'Champion League',
  legend: 'Legend League',
};

interface ArenaScreenProps {
  onBack: () => void;
  onStartBattle: (trainer: ArenaTrainer) => void;
  ownedCraftures: OwnedCrafture[];
  defeatedTrainers: string[];
}

export function ArenaScreen({ onBack, onStartBattle, ownedCraftures, defeatedTrainers }: ArenaScreenProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'rookie' | 'veteran' | 'champion' | 'legend'>('rookie');

  const filteredTrainers = ARENA_TRAINERS.filter((t) => t.difficulty === selectedDifficulty);
  const highestLevel = Math.max(...ownedCraftures.map((c) => c.level), 1);

  const getDifficultyRecommendation = (difficulty: string) => {
    switch (difficulty) {
      case 'rookie':
        return 'Lv. 1-15';
      case 'veteran':
        return 'Lv. 15-30';
      case 'champion':
        return 'Lv. 30-45';
      case 'legend':
        return 'Lv. 45+';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-secondary/20 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-5 w-5 mr-1" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          <span className="font-bold text-foreground">
            {defeatedTrainers.length}/{ARENA_TRAINERS.length} Defeated
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="font-display text-3xl font-bold text-foreground flex items-center justify-center gap-2">
          <Swords className="h-8 w-8 text-primary" />
          Battle Arena
        </h1>
        <p className="text-muted-foreground mt-1">Challenge AI trainers and prove your strength!</p>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['rookie', 'veteran', 'champion', 'legend'] as const).map((diff) => (
          <Button
            key={diff}
            variant={selectedDifficulty === diff ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedDifficulty(diff)}
            className={cn(
              'flex-shrink-0',
              selectedDifficulty === diff && `bg-gradient-to-r ${DIFFICULTY_COLORS[diff]} text-white`
            )}
          >
            {diff === 'legend' && <Star className="h-4 w-4 mr-1" />}
            {DIFFICULTY_LABELS[diff]}
          </Button>
        ))}
      </div>

      {/* Recommended Level */}
      <div className="bg-card rounded-lg p-3 mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Recommended Level:</span>
        <span className="font-semibold text-foreground">{getDifficultyRecommendation(selectedDifficulty)}</span>
      </div>

      {/* Trainer List */}
      <div className="space-y-4">
        {filteredTrainers.map((trainer) => {
          const isDefeated = defeatedTrainers.includes(trainer.id);
          const leadSpecies = craftureSpecies.find((s) => s.id === trainer.team[0].speciesId);

          return (
            <div
              key={trainer.id}
              className={cn(
                'bg-card rounded-xl border-2 p-4 transition-all',
                isDefeated ? 'border-green-400 bg-green-50/50' : 'border-border hover:border-primary'
              )}
            >
              <div className="flex items-center gap-4">
                {/* Trainer Icon */}
                <div
                  className={cn(
                    'w-16 h-16 rounded-full flex items-center justify-center text-3xl bg-gradient-to-br',
                    DIFFICULTY_COLORS[trainer.difficulty]
                  )}
                >
                  {trainer.icon}
                </div>

                {/* Trainer Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-foreground">{trainer.name}</h3>
                    {isDefeated && <Trophy className="h-4 w-4 text-green-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{trainer.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {trainer.team.map((member, idx) => {
                      const species = craftureSpecies.find((s) => s.id === member.speciesId);
                      return (
                        <div key={idx} className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
                          <span>{species?.name || member.speciesId}</span>
                          <span className="text-muted-foreground">Lv.{member.level}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Battle Button */}
                <div className="flex flex-col items-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => onStartBattle(trainer)}
                    className={cn('bg-gradient-to-r', DIFFICULTY_COLORS[trainer.difficulty], 'text-white')}
                  >
                    <Zap className="h-4 w-4 mr-1" />
                    Battle
                  </Button>
                  <div className="text-xs text-muted-foreground text-right">
                    <div>💰 {trainer.rewards.coins}</div>
                    <div>⭐ {trainer.rewards.xp} XP</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type { ArenaTrainer };
