import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { OwnedCrafture } from '@/types/crafture';
import { craftureSpecies, craftureImages } from '@/data/craftures';
import { ArrowLeft, Calendar, Gift, Swords, Trophy, Star, Clock } from 'lucide-react';

interface DailyChallengeScreenProps {
  onBack: () => void;
  onStartBattle: (challenge: DailyChallenge) => void;
  ownedCraftures: OwnedCrafture[];
  completedChallenges: string[];
}

export interface DailyChallenge {
  id: string;
  day: number;
  name: string;
  description: string;
  enemySpeciesId: string;
  enemyLevel: number;
  rewards: { coins: number; xp: number };
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

// Generate daily challenges based on the current date
function generateDailyChallenges(date: Date): DailyChallenge[] {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const seed = dayOfYear + date.getFullYear() * 1000;
  
  // Seeded random for consistent daily challenges
  const seededRandom = (n: number) => {
    const x = Math.sin(seed + n) * 10000;
    return x - Math.floor(x);
  };
  
  const allSpecies = craftureSpecies.filter(s => s.evolutionStage && s.evolutionStage >= 2);
  
  const challenges: DailyChallenge[] = [
    {
      id: `daily-${seed}-1`,
      day: 1,
      name: 'Morning Warmup',
      description: 'Start your day with a light challenge!',
      enemySpeciesId: allSpecies[Math.floor(seededRandom(1) * allSpecies.length)].id,
      enemyLevel: 10 + Math.floor(seededRandom(2) * 5),
      rewards: { coins: 100, xp: 50 },
      difficulty: 'easy',
    },
    {
      id: `daily-${seed}-2`,
      day: 2,
      name: 'Midday Battle',
      description: 'A worthy opponent awaits!',
      enemySpeciesId: allSpecies[Math.floor(seededRandom(3) * allSpecies.length)].id,
      enemyLevel: 20 + Math.floor(seededRandom(4) * 10),
      rewards: { coins: 250, xp: 100 },
      difficulty: 'medium',
    },
    {
      id: `daily-${seed}-3`,
      day: 3,
      name: 'Dusk Duel',
      description: 'Only the strong survive this fight.',
      enemySpeciesId: allSpecies[Math.floor(seededRandom(5) * allSpecies.length)].id,
      enemyLevel: 35 + Math.floor(seededRandom(6) * 10),
      rewards: { coins: 500, xp: 200 },
      difficulty: 'hard',
    },
    {
      id: `daily-${seed}-4`,
      day: 4,
      name: 'Ultimate Challenge',
      description: 'Face the most powerful foe of the day!',
      enemySpeciesId: craftureSpecies.filter(s => s.rarity === 'legendary')[Math.floor(seededRandom(7) * 10) % craftureSpecies.filter(s => s.rarity === 'legendary').length].id,
      enemyLevel: 45 + Math.floor(seededRandom(8) * 10),
      rewards: { coins: 1000, xp: 400 },
      difficulty: 'extreme',
    },
  ];
  
  return challenges;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 border-green-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  hard: 'bg-orange-100 text-orange-800 border-orange-300',
  extreme: 'bg-red-100 text-red-800 border-red-300',
};

const difficultyStars = {
  easy: 1,
  medium: 2,
  hard: 3,
  extreme: 4,
};

export function DailyChallengeScreen({ onBack, onStartBattle, ownedCraftures, completedChallenges }: DailyChallengeScreenProps) {
  const [challenges, setChallenges] = useState<DailyChallenge[]>([]);
  const [timeUntilReset, setTimeUntilReset] = useState('');
  
  useEffect(() => {
    setChallenges(generateDailyChallenges(new Date()));
    
    // Update countdown timer
    const updateTimer = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeUntilReset(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);
  
  const maxLevel = Math.max(...ownedCraftures.map(c => c.level), 1);
  const hasAliveCrafture = ownedCraftures.some(c => c.hp > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-violet-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Calendar className="h-6 w-6 text-yellow-400" />
            Daily Challenge
          </h1>
          <p className="text-purple-200 text-sm">New challenges every day!</p>
        </div>
        <div className="w-10" />
      </div>
      
      {/* Reset Timer */}
      <Card className="bg-white/10 backdrop-blur border-white/20 p-3 mb-6">
        <div className="flex items-center justify-center gap-2 text-white">
          <Clock className="h-5 w-5 text-yellow-400" />
          <span className="text-sm">Resets in:</span>
          <span className="font-mono font-bold text-yellow-400">{timeUntilReset}</span>
        </div>
      </Card>
      
      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.map((challenge) => {
          const species = craftureSpecies.find(s => s.id === challenge.enemySpeciesId);
          const isCompleted = completedChallenges.includes(challenge.id);
          const canAttempt = !isCompleted && hasAliveCrafture;
          
          return (
            <Card 
              key={challenge.id} 
              className={`p-4 transition-all ${
                isCompleted 
                  ? 'bg-green-900/30 border-green-500/50' 
                  : 'bg-white/10 backdrop-blur border-white/20 hover:bg-white/15'
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Enemy Preview */}
                <div className="relative w-20 h-20 rounded-xl bg-black/20 flex items-center justify-center overflow-hidden shrink-0">
                  {species && (
                    <img 
                      src={craftureImages[species.id]} 
                      alt={species.name}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  {isCompleted && (
                    <div className="absolute inset-0 bg-green-500/50 flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-yellow-400" />
                    </div>
                  )}
                </div>
                
                {/* Challenge Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-white truncate">{challenge.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${difficultyColors[challenge.difficulty]}`}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <p className="text-purple-200 text-sm mb-2">{challenge.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-white/80">
                      Lv.{challenge.enemyLevel} {species?.name}
                    </span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: difficultyStars[challenge.difficulty] }).map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  
                  {/* Rewards */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded text-yellow-400 text-xs">
                      <Gift className="h-3 w-3" />
                      {challenge.rewards.coins} coins
                    </div>
                    <div className="flex items-center gap-1 bg-blue-500/20 px-2 py-0.5 rounded text-blue-400 text-xs">
                      +{challenge.rewards.xp} XP
                    </div>
                  </div>
                </div>
                
                {/* Battle Button */}
                <Button
                  onClick={() => onStartBattle(challenge)}
                  disabled={!canAttempt}
                  className={`shrink-0 ${
                    isCompleted 
                      ? 'bg-green-600 hover:bg-green-600' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Trophy className="h-4 w-4 mr-1" />
                      Done
                    </>
                  ) : (
                    <>
                      <Swords className="h-4 w-4 mr-1" />
                      Battle
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Daily Bonus */}
      <Card className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
        <div className="flex items-center gap-3">
          <div className="bg-yellow-500 rounded-full p-2">
            <Trophy className="h-6 w-6 text-yellow-900" />
          </div>
          <div>
            <h3 className="font-bold text-white">Complete All Challenges</h3>
            <p className="text-yellow-200 text-sm">
              Finish all 4 daily challenges for a bonus 500 coins!
            </p>
          </div>
          {challenges.length > 0 && challenges.every(c => completedChallenges.includes(c.id)) && (
            <div className="ml-auto bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full font-bold text-sm">
              Claimed!
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
