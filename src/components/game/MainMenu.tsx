import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OwnedCrafture, GameScreen } from '@/types/crafture';
import { craftureSpecies } from '@/data/craftures';
import { Package, Heart, RotateCcw, Backpack, Coins, BookOpen, ShoppingBag, MapPin, Terminal, Swords, Calendar, Egg } from 'lucide-react';
import { AnimatedMenuCompanion } from './AnimatedMenuCompanion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface MainMenuProps {
  ownedCraftures: OwnedCrafture[];
  coins: number;
  onNavigate: (screen: GameScreen) => void;
  onResetGame: () => void;
  onUnlockAllSpecies?: () => void;
}

export function MainMenu({ ownedCraftures, coins, onNavigate, onResetGame, onUnlockAllSpecies }: MainMenuProps) {
  const [showCheatPanel, setShowCheatPanel] = useState(false);
  const [cheatCode, setCheatCode] = useState('');
  
  // Show first owned crafture as companion
  const companion = ownedCraftures[0];
  const companionSpecies = companion
    ? craftureSpecies.find((s) => s.id === companion.speciesId)
    : null;

  const handleCheatSubmit = () => {
    if (cheatCode.toLowerCase() === '123craftures') {
      onUnlockAllSpecies?.();
      toast.success('🎉 All species unlocked in Encyclopedia!');
      setCheatCode('');
      setShowCheatPanel(false);
    } else {
      toast.error('Invalid cheat code');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/30 to-secondary/20 p-6 flex flex-col">
      {/* Header with companion */}
      <div className="text-center mb-4">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2">
          Craftures
        </h1>
        <p className="text-muted-foreground">
          {ownedCraftures.length} Crafture{ownedCraftures.length !== 1 && 's'} collected
        </p>
        <div className="flex items-center justify-center gap-1 mt-2 bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-semibold mx-auto w-fit">
          <Coins className="h-4 w-4" />
          {coins}
        </div>
      </div>

      {/* Animated Companion */}
      {companion && companionSpecies && (
        <div className="flex flex-col items-center mb-6">
          <AnimatedMenuCompanion 
            crafture={companion} 
            className="w-40 h-40 md:w-48 md:h-48" 
          />
          <div className="bg-card rounded-xl px-6 py-3 shadow-card mt-2">
            <span className="font-display text-xl font-bold text-foreground">
              {companion.nickname}
            </span>
            <span className="ml-3 text-sm text-muted-foreground">
              Lv.{companion.level}
            </span>
          </div>
        </div>
      )}

      {/* Main content with cheat panel */}
      <div className="flex-1 flex gap-4">
        {/* Menu buttons */}
        <div className="flex-1 flex flex-col items-center justify-center gap-3 max-w-sm mx-auto w-full">
          <Button
            variant="encounter"
            size="xl"
            className="w-full"
            onClick={() => onNavigate('biomemap')}
          >
            <MapPin className="h-6 w-6" />
            Explore Map
          </Button>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="game"
              size="lg"
              className="w-full"
              onClick={() => onNavigate('collection')}
            >
              <Package className="h-5 w-5" />
              Collection
            </Button>

            <Button
              variant="care"
              size="lg"
              className="w-full"
              onClick={() => onNavigate('care')}
            >
              <Heart className="h-5 w-5" />
              Care
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => onNavigate('inventory')}
            >
              <Backpack className="h-5 w-5" />
              Inventory
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full bg-amber-50 border-amber-200 hover:bg-amber-100"
              onClick={() => onNavigate('shop')}
            >
              <ShoppingBag className="h-5 w-5 text-amber-600" />
              Shop
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => onNavigate('encyclopedia')}
            >
              <BookOpen className="h-5 w-5" />
              Encyclopedia
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full bg-red-50 border-red-200 hover:bg-red-100"
              onClick={() => onNavigate('arena')}
            >
              <Swords className="h-5 w-5 text-red-600" />
              Arena
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              size="lg"
              className="w-full bg-purple-50 border-purple-200 hover:bg-purple-100"
              onClick={() => onNavigate('dailychallenge')}
            >
              <Calendar className="h-5 w-5 text-purple-600" />
              Daily
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full bg-pink-50 border-pink-200 hover:bg-pink-100"
              onClick={() => onNavigate('breedingpen')}
            >
              <Egg className="h-5 w-5 text-pink-600" />
              Breed
            </Button>
          </div>
        </div>

        {/* Cheat Panel - Right Side */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground/50 hover:text-muted-foreground"
            onClick={() => setShowCheatPanel(!showCheatPanel)}
          >
            <Terminal className="h-4 w-4" />
          </Button>
          
          {showCheatPanel && (
            <div className="mt-2 bg-card border rounded-lg p-3 shadow-lg w-48">
              <p className="text-xs text-muted-foreground mb-2">Enter cheat code:</p>
              <Input
                type="text"
                value={cheatCode}
                onChange={(e) => setCheatCode(e.target.value)}
                placeholder="Code..."
                className="text-sm mb-2"
                onKeyDown={(e) => e.key === 'Enter' && handleCheatSubmit()}
              />
              <Button size="sm" className="w-full" onClick={handleCheatSubmit}>
                Submit
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Footer stats */}
      <div className="mt-6 flex justify-center gap-6">
        <div className="text-center">
          <div className="font-display text-2xl font-bold text-primary">
            {ownedCraftures.length}
          </div>
          <div className="text-xs text-muted-foreground">Owned</div>
        </div>
        <div className="text-center">
          <div className="font-display text-2xl font-bold text-accent">
            {craftureSpecies.length}
          </div>
          <div className="text-xs text-muted-foreground">Species</div>
        </div>
      </div>

      {/* Reset button */}
      <div className="mt-4 flex justify-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Game?</AlertDialogTitle>
              <AlertDialogDescription>
                This will delete all your Craftures and progress. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onResetGame} className="bg-destructive text-destructive-foreground">
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
