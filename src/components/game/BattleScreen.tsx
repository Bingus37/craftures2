import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { OwnedCrafture, getHungerMultiplier } from '@/types/crafture';
import { craftureSpecies, typeGradients, craftureImages } from '@/data/craftures';
import { useBattle } from '@/hooks/useBattle';
import { STATUS_EFFECTS } from '@/types/battle';
import { InventoryItem, getItem } from '@/types/inventory';
import { Swords, Shield, Zap, ArrowLeft, AlertTriangle, RotateCcw, Backpack } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedCrafture } from './AnimatedCrafture';
import { BattleItemsMenu } from './BattleItemsMenu';

interface BattleScreenProps {
  playerCrafture: OwnedCrafture;
  wildSpeciesId: string;
  wildLevel: number;
  onEnd: (won: boolean, expGained: number, hungerLost: number) => void;
  onBack: () => void;
  allOwnedCraftures?: OwnedCrafture[];
  onCraftureSwitch?: (newCraftureId: string) => void;
  inventory?: InventoryItem[];
  onUseItem?: (itemId: string, craftureId: string) => void;
}

export function BattleScreen({
  playerCrafture,
  wildSpeciesId,
  wildLevel,
  onEnd,
  onBack,
  allOwnedCraftures = [],
  onCraftureSwitch,
  inventory = [],
  onUseItem,
}: BattleScreenProps) {
  const [showTeam, setShowTeam] = useState(false);
  const [showItems, setShowItems] = useState(false);
  
  const { battleState, startBattle, playerAttack, triggerWildTurn, flee, endBattle, switchCrafture, healInBattle } = useBattle(
    playerCrafture,
    onEnd,
    undefined
  );

  const logRef = useRef<HTMLDivElement>(null);

  // Start battle on mount
  useEffect(() => {
    startBattle(wildSpeciesId, wildLevel);
  }, [wildSpeciesId, wildLevel, startBattle]);

  // Trigger wild turn
  useEffect(() => {
    if (battleState && !battleState.playerTurn && !battleState.isOver && !battleState.isAnimating) {
      const timeout = setTimeout(triggerWildTurn, 1000);
      return () => clearTimeout(timeout);
    }
  }, [battleState, triggerWildTurn]);

  // Auto-scroll battle log
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [battleState?.battleLog]);

  // Handle player fainted - show team selector
  useEffect(() => {
    if (battleState?.playerHp === 0 && !battleState.isOver) {
      const availableTeam = allOwnedCraftures.filter(c => c.hp > 0 && c.id !== playerCrafture.id);
      if (availableTeam.length > 0) {
        setShowTeam(true);
      }
    }
  }, [battleState?.playerHp, battleState?.isOver, allOwnedCraftures, playerCrafture.id]);

  const handleSwitchCrafture = (crafture: OwnedCrafture) => {
    switchCrafture(crafture);
    if (onCraftureSwitch) {
      onCraftureSwitch(crafture.id);
    }
    setShowTeam(false);
  };

  if (!battleState) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-muted-foreground">Preparing battle...</p>
        </div>
      </div>
    );
  }

  const playerSpecies = craftureSpecies.find(s => s.id === battleState.playerCrafture.speciesId);
  const wildSpecies = craftureSpecies.find(s => s.id === battleState.wildCrafture.speciesId);

  if (!playerSpecies || !wildSpecies) return null;

  const playerHpPercent = (battleState.playerHp / battleState.playerCrafture.maxHp) * 100;
  const wildHpPercent = (battleState.wildHp / battleState.wildCrafture.maxHp) * 100;

  // Check if player has other alive craftures
  const hasOtherAliveCraftures = allOwnedCraftures.filter(c => c.hp > 0 && c.id !== battleState.playerCrafture.id).length > 0;

  // Team selection overlay
  if (showTeam) {
    const availableTeam = allOwnedCraftures.filter(c => c.hp > 0 && c.id !== playerCrafture.id);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-900/20 via-background to-muted p-4 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">
            {battleState.playerCrafture.nickname} fainted!
          </h2>
          <p className="text-muted-foreground mb-6">Choose another Crafture:</p>
          
          <div className="grid grid-cols-2 gap-4 max-w-md">
            {availableTeam.map(crafture => {
              const species = craftureSpecies.find(s => s.id === crafture.speciesId);
              if (!species) return null;
              
              return (
                <button
                  key={crafture.id}
                  onClick={() => handleSwitchCrafture(crafture)}
                  className="bg-card rounded-xl p-4 shadow-card hover:scale-105 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={craftureImages[species.id]} 
                      alt={species.name} 
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <h3 className="font-display font-bold">{crafture.nickname}</h3>
                      <span className={cn(
                        'inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-gradient-to-r text-primary-foreground',
                        typeGradients[species.type]
                      )}>
                        Lv.{crafture.level}
                      </span>
                      <div className="mt-1">
                        <Progress value={(crafture.hp / crafture.maxHp) * 100} className="h-2 w-20" />
                        <span className="text-xs text-muted-foreground">{crafture.hp}/{crafture.maxHp}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <Button variant="outline" className="mt-6" onClick={onBack}>
            Give Up
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900/20 via-background to-muted p-4 flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} disabled={!battleState.isOver}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-2xl font-bold text-foreground flex items-center gap-2">
          <Swords className="h-6 w-6 text-red-500" />
          Battle!
        </h1>
      </div>

      {/* Battle arena */}
      <div className="flex-1 flex flex-col">
        {/* Wild Crafture (top) */}
        <div className="flex items-start gap-4 mb-4">
          <div className="flex-1">
            <div className="bg-card rounded-xl p-3 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-display font-bold text-sm flex items-center gap-1">
                    {wildSpecies.name}
                    {battleState.wildStatus && (
                      <span className="text-xs">{STATUS_EFFECTS[battleState.wildStatus].icon}</span>
                    )}
                  </h3>
                  <span className={cn(
                    'inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize bg-gradient-to-r text-primary-foreground',
                    typeGradients[wildSpecies.type]
                  )}>
                    Lv. {battleState.wildCrafture.level}
                  </span>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {battleState.wildHp}/{battleState.wildCrafture.maxHp}
                </div>
              </div>
              <Progress 
                value={wildHpPercent} 
                className="h-3 mb-2"
              />
              {/* Wild Stats Display */}
              <div className="flex gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Swords className="h-3 w-3 text-red-400" />
                  {battleState.wildCrafture.attack}
                </span>
                <span className="flex items-center gap-0.5">
                  <Shield className="h-3 w-3 text-blue-400" />
                  {battleState.wildCrafture.defense}
                </span>
                <span className="flex items-center gap-0.5">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  {battleState.wildCrafture.speed}
                </span>
              </div>
            </div>
          </div>
          <AnimatedCrafture
            speciesId={wildSpecies.id}
            className="h-28 w-28"
            isAnimating={!battleState.isOver}
            animationType={
              battleState.wildHp <= 0 ? 'faint' : 
              battleState.isAnimating && !battleState.playerTurn ? 'attack' : 'idle'
            }
            showBackground={true}
          />
        </div>

        {/* VS indicator */}
        <div className="flex justify-center my-2">
          <div className="bg-destructive text-destructive-foreground font-display font-bold text-sm px-3 py-1 rounded-full shadow-lg">
            VS
          </div>
        </div>

        {/* Player Crafture (bottom) */}
        <div className="flex items-end gap-4 mt-4">
          <div className="relative">
            <AnimatedCrafture
              speciesId={playerSpecies.id}
              className="h-32 w-32"
              isAnimating={!battleState.isOver}
              animationType={
                battleState.playerHp <= 0 ? 'faint' :
                battleState.isAnimating && battleState.playerTurn ? 'attack' : 'idle'
              }
              showBackground={true}
            />
            {/* Status indicator */}
            {battleState.playerStatus && (
              <div className="absolute -top-2 right-0 text-2xl">
                {STATUS_EFFECTS[battleState.playerStatus].icon}
              </div>
            )}
            {/* Hunger warning on player */}
            {playerCrafture.hunger < 30 && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-xs font-semibold">
                <AlertTriangle className="h-3 w-3" />
                Hungry!
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="bg-card rounded-xl p-3 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-display font-bold text-sm flex items-center gap-1">
                    {battleState.playerCrafture.nickname}
                    {battleState.playerStatus && (
                      <span className="text-xs">{STATUS_EFFECTS[battleState.playerStatus].icon}</span>
                    )}
                  </h3>
                  <span className={cn(
                    'inline-block rounded-full px-2 py-0.5 text-xs font-semibold capitalize bg-gradient-to-r text-primary-foreground',
                    typeGradients[playerSpecies.type]
                  )}>
                    Lv. {battleState.playerCrafture.level}
                  </span>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  {battleState.playerHp}/{battleState.playerCrafture.maxHp}
                </div>
              </div>
              <Progress 
                value={playerHpPercent} 
                className="h-3 mb-2"
              />
              {/* Player Stats Display */}
              <div className="flex gap-2 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-0.5">
                  <Swords className="h-3 w-3 text-red-400" />
                  {battleState.playerCrafture.attack}
                </span>
                <span className="flex items-center gap-0.5">
                  <Shield className="h-3 w-3 text-blue-400" />
                  {battleState.playerCrafture.defense}
                </span>
                <span className="flex items-center gap-0.5">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  {battleState.playerCrafture.speed}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Battle log */}
      <div 
        ref={logRef}
        className="bg-card/80 backdrop-blur rounded-xl p-3 h-24 overflow-y-auto mb-4 shadow-card"
      >
        {battleState.battleLog.map((log, i) => (
          <p key={i} className="text-sm text-foreground animate-fade-in">
            {log}
          </p>
        ))}
      </div>

      {/* Action buttons - Moves */}
      {battleState.isOver ? (
        <Button
          variant="game"
          size="lg"
          className="w-full"
          onClick={endBattle}
        >
          Continue
        </Button>
      ) : (
        <div className="space-y-3">
          {/* Move buttons */}
          <div className="grid grid-cols-2 gap-2">
            {battleState.playerMoves.slice(0, 4).map((move, index) => (
              <Button
                key={move.id}
                variant="outline"
                size="sm"
                onClick={() => playerAttack(index)}
                disabled={!battleState.playerTurn || battleState.isAnimating}
                className={cn(
                  'flex-col h-auto py-2 text-left',
                  `bg-gradient-to-r ${typeGradients[move.type]} text-primary-foreground hover:opacity-90`
                )}
              >
                <div className="flex items-center gap-1 w-full">
                  <span>{move.icon}</span>
                  <span className="font-semibold text-xs">{move.name}</span>
                </div>
                <div className="flex items-center gap-2 w-full text-[10px] opacity-80">
                  <span>PWR: {move.power}</span>
                  <span>ACC: {move.accuracy}%</span>
                </div>
              </Button>
            ))}
          </div>
          
          {/* Other actions */}
          <div className="grid grid-cols-3 gap-2">
            {hasOtherAliveCraftures && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTeam(true)}
                disabled={!battleState.playerTurn || battleState.isAnimating}
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Switch
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowItems(true)}
              disabled={!battleState.playerTurn || battleState.isAnimating}
            >
              <Backpack className="h-4 w-4 mr-1" />
              Items
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={flee}
              disabled={!battleState.playerTurn || battleState.isAnimating}
            >
              <Zap className="h-4 w-4 mr-1" />
              Flee
            </Button>
          </div>

          {/* Items menu overlay */}
          {showItems && (
            <div className="absolute bottom-20 left-4 right-4 z-10">
              <BattleItemsMenu
                inventory={inventory}
                playerCrafture={battleState.playerCrafture}
                onUseItem={(itemId) => {
                  // Handle items locally in battle state
                  const item = getItem(itemId);
                  if (!item) return;
                  
                  // Remove item from inventory via parent
                  if (onUseItem) {
                    onUseItem(itemId, battleState.playerCrafture.id);
                  }
                  
                  // Heal in battle (updates battle state HP)
                  if (item.type === 'potion' && item.id !== 'berrySnack' && item.id !== 'gourmetMeal') {
                    healInBattle(item.healAmount || 20);
                  }
                  
                  setShowItems(false);
                }}
                onClose={() => setShowItems(false)}
                disabled={!battleState.playerTurn || battleState.isAnimating}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
