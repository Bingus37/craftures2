import { useState, useCallback } from 'react';
import { OwnedCrafture, getHungerMultiplier } from '@/types/crafture';
import { craftureSpecies, typeEffectiveness } from '@/data/craftures';
import { BattleMove, StatusEffect, STATUS_EFFECTS, getMovesForType } from '@/types/battle';
import { getCraftureMoves, getLearnedMoveIdsForLevel } from '@/lib/moveLearning';

interface BattleState {
  playerCrafture: OwnedCrafture;
  wildCrafture: OwnedCrafture;
  playerHp: number;
  wildHp: number;
  playerTurn: boolean;
  battleLog: string[];
  isOver: boolean;
  winner: 'player' | 'wild' | null;
  isAnimating: boolean;
  // Status effects
  playerStatus: StatusEffect;
  wildStatus: StatusEffect;
  playerStatusTurns: number;
  wildStatusTurns: number;
  // Available moves
  playerMoves: BattleMove[];
  wildMoves: BattleMove[];
}

export function useBattle(
  playerCrafture: OwnedCrafture | null,
  onBattleEnd: (won: boolean, expGained: number, hungerLost: number) => void,
  onPlayerFainted?: () => void
) {
  const [battleState, setBattleState] = useState<BattleState | null>(null);

  const getTypeMultiplier = useCallback((attackerType: string, defenderType: string) => {
    const effectiveness = typeEffectiveness[attackerType as keyof typeof typeEffectiveness];
    if (!effectiveness) return 1;
    
    if (effectiveness.strong.includes(defenderType as any)) return 1.5;
    if (effectiveness.weak.includes(defenderType as any)) return 0.5;
    return 1;
  }, []);

  const calculateDamage = useCallback((
    attacker: OwnedCrafture, 
    defender: OwnedCrafture, 
    move: BattleMove,
    isPlayer: boolean = false,
    attackerStatus: StatusEffect = null
  ) => {
    const attackerSpecies = craftureSpecies.find(s => s.id === attacker.speciesId);
    const defenderSpecies = craftureSpecies.find(s => s.id === defender.speciesId);
    if (!attackerSpecies || !defenderSpecies) return 10;

    const typeMultiplier = getTypeMultiplier(move.type, defenderSpecies.type);
    
    // Apply hunger weakness for player's crafture
    const hungerMult = isPlayer ? getHungerMultiplier(attacker.hunger) : 1;
    
    // Burn reduces attack
    const burnPenalty = attackerStatus === 'burn' ? 0.75 : 1;
    
    const effectiveAttack = attacker.attack * hungerMult * burnPenalty;
    
    // Move power affects damage
    const movePower = move.power / 50; // Normalize around 1.0
    
    const baseDamage = Math.floor(
      ((effectiveAttack * movePower * 2) / defender.defense) * 10 + 5
    );
    const randomFactor = 0.85 + Math.random() * 0.3;
    
    return Math.max(1, Math.floor(baseDamage * typeMultiplier * randomFactor));
  }, [getTypeMultiplier]);

  const startBattle = useCallback((wildSpeciesId: string, wildLevel: number) => {
    if (!playerCrafture) return;

    const wildSpecies = craftureSpecies.find(s => s.id === wildSpeciesId);
    const playerSpecies = craftureSpecies.find(s => s.id === playerCrafture.speciesId);
    if (!wildSpecies || !playerSpecies) return;

    const hpBase = 50 + wildSpecies.baseDefense;
    const wildCrafture: OwnedCrafture = {
      id: `wild-${Date.now()}`,
      speciesId: wildSpeciesId,
      nickname: `Wild ${wildSpecies.name}`,
      happiness: 50,
      hunger: 50,
      level: wildLevel,
      experience: 0,
      learnedMoveIds: getLearnedMoveIdsForLevel(wildSpecies.type, wildLevel),
      hp: Math.floor(hpBase + (wildLevel * 5)),
      maxHp: Math.floor(hpBase + (wildLevel * 5)),
      attack: Math.floor(wildSpecies.baseAttack + (wildLevel * 2)),
      defense: Math.floor(wildSpecies.baseDefense + (wildLevel * 1.5)),
      speed: Math.floor(wildSpecies.baseSpeed + wildLevel),
      caughtAt: new Date(),
      lastFed: new Date(),
      lastPetted: new Date(),
    };

    const playerGoesFirst = playerCrafture.speed >= wildCrafture.speed;
    
    // Moves are learned by level (not all moves at once)
    const playerMoves = getCraftureMoves(playerCrafture, playerSpecies.type);
    const wildMoves = getCraftureMoves(wildCrafture, wildSpecies.type);
    
    const hungerWarning = playerCrafture.hunger < 30 
      ? `Warning: ${playerCrafture.nickname} is hungry! Stats are weakened!` 
      : null;

    const logs = [
      `A wild ${wildSpecies.name} appeared!`, 
      playerGoesFirst ? 'You attack first!' : `${wildSpecies.name} is faster!`
    ];
    if (hungerWarning) logs.push(hungerWarning);

    setBattleState({
      playerCrafture,
      wildCrafture,
      playerHp: playerCrafture.hp,
      wildHp: wildCrafture.hp,
      playerTurn: playerGoesFirst,
      battleLog: logs,
      isOver: false,
      winner: null,
      isAnimating: false,
      playerStatus: null,
      wildStatus: null,
      playerStatusTurns: 0,
      wildStatusTurns: 0,
      playerMoves,
      wildMoves,
    });
  }, [playerCrafture]);

  const applyStatusDamage = useCallback((
    hp: number, 
    maxHp: number, 
    status: StatusEffect, 
    name: string
  ): { newHp: number; log: string | null } => {
    if (!status) return { newHp: hp, log: null };
    
    const effect = STATUS_EFFECTS[status];
    if (effect.damagePerTurn > 0) {
      const damage = Math.max(1, Math.floor(maxHp * effect.damagePerTurn));
      const newHp = Math.max(0, hp - damage);
      return { 
        newHp, 
        log: `${name} took ${damage} damage from ${effect.name}! ${effect.icon}` 
      };
    }
    return { newHp: hp, log: null };
  }, []);

  const checkStatusSkipTurn = useCallback((status: StatusEffect): boolean => {
    if (!status) return false;
    const effect = STATUS_EFFECTS[status];
    return Math.random() < effect.skipTurnChance;
  }, []);

  const playerAttack = useCallback((moveIndex: number = 0) => {
    if (!battleState || !battleState.playerTurn || battleState.isOver || battleState.isAnimating) return;

    const move = battleState.playerMoves[moveIndex];
    if (!move) return;

    // Check accuracy
    if (Math.random() * 100 > move.accuracy) {
      setBattleState(prev => prev ? {
        ...prev,
        battleLog: [...prev.battleLog, `${prev.playerCrafture.nickname} used ${move.name} but missed!`],
        playerTurn: false,
      } : null);
      return;
    }

    setBattleState(prev => prev ? { ...prev, isAnimating: true } : null);

    setTimeout(() => {
      setBattleState(prev => {
        if (!prev) return null;

        // Special moves (healing, etc)
        if (move.id === 'nature-heal') {
          const healAmount = 30;
          const newPlayerHp = Math.min(prev.playerCrafture.maxHp, prev.playerHp + healAmount);
          return {
            ...prev,
            playerHp: newPlayerHp,
            playerTurn: false,
            battleLog: [...prev.battleLog, `${prev.playerCrafture.nickname} healed ${healAmount} HP! 💚`],
            isAnimating: false,
          };
        }

        const damage = calculateDamage(prev.playerCrafture, prev.wildCrafture, move, true, prev.playerStatus);
        const newWildHp = Math.max(0, prev.wildHp - damage);
        const playerSpecies = craftureSpecies.find(s => s.id === prev.playerCrafture.speciesId);
        const wildSpecies = craftureSpecies.find(s => s.id === prev.wildCrafture.speciesId);
        
        const multiplier = getTypeMultiplier(move.type, wildSpecies?.type || 'forest');
        
        let effectivenessMsg = '';
        if (multiplier > 1) effectivenessMsg = " It's super effective!";
        if (multiplier < 1) effectivenessMsg = " It's not very effective...";
        
        // Check for status effect application
        let newWildStatus = prev.wildStatus;
        let newWildStatusTurns = prev.wildStatusTurns;
        let statusMsg = '';
        
        if (move.statusEffect && move.statusChance && !prev.wildStatus) {
          if (Math.random() < move.statusChance) {
            newWildStatus = move.statusEffect;
            newWildStatusTurns = STATUS_EFFECTS[move.statusEffect].duration;
            statusMsg = ` Wild ${wildSpecies?.name} is now ${STATUS_EFFECTS[move.statusEffect].name}ed! ${STATUS_EFFECTS[move.statusEffect].icon}`;
          }
        }

        const newLog = [...prev.battleLog, `${prev.playerCrafture.nickname} used ${move.name}! ${move.icon} Dealt ${damage} damage!${effectivenessMsg}${statusMsg}`];

        if (newWildHp <= 0) {
          const levelDiff = Math.max(1, prev.wildCrafture.level - prev.playerCrafture.level + 5);
          const expGained = Math.floor(prev.wildCrafture.level * 20 * (levelDiff / 5));
          return {
            ...prev,
            wildHp: 0,
            wildStatus: newWildStatus,
            wildStatusTurns: newWildStatusTurns,
            battleLog: [...newLog, `Wild ${wildSpecies?.name} fainted!`, `You won! Gained ${expGained} XP!`],
            isOver: true,
            winner: 'player',
            isAnimating: false,
          };
        }

        return {
          ...prev,
          wildHp: newWildHp,
          wildStatus: newWildStatus,
          wildStatusTurns: newWildStatusTurns,
          playerTurn: false,
          battleLog: newLog,
          isAnimating: false,
        };
      });
    }, 500);
  }, [battleState, calculateDamage, getTypeMultiplier]);

  const wildAttack = useCallback(() => {
    if (!battleState || battleState.playerTurn || battleState.isOver || battleState.isAnimating) return;

    // Check status effect skip
    if (battleState.wildStatus && checkStatusSkipTurn(battleState.wildStatus)) {
      const effect = STATUS_EFFECTS[battleState.wildStatus];
      setBattleState(prev => prev ? {
        ...prev,
        battleLog: [...prev.battleLog, `Wild ${craftureSpecies.find(s => s.id === prev.wildCrafture.speciesId)?.name} is ${effect.name}ed and can't move! ${effect.icon}`],
        playerTurn: true,
        wildStatusTurns: Math.max(0, prev.wildStatusTurns - 1),
        wildStatus: prev.wildStatusTurns <= 1 ? null : prev.wildStatus,
      } : null);
      return;
    }

    // Pick random move
    const move = battleState.wildMoves[Math.floor(Math.random() * battleState.wildMoves.length)];
    
    // Check accuracy
    if (Math.random() * 100 > move.accuracy) {
      setBattleState(prev => prev ? {
        ...prev,
        battleLog: [...prev.battleLog, `Wild ${craftureSpecies.find(s => s.id === prev.wildCrafture.speciesId)?.name} used ${move.name} but missed!`],
        playerTurn: true,
      } : null);
      return;
    }

    setBattleState(prev => prev ? { ...prev, isAnimating: true } : null);

    setTimeout(() => {
      setBattleState(prev => {
        if (!prev) return null;

        const damage = calculateDamage(prev.wildCrafture, prev.playerCrafture, move, false, prev.wildStatus);
        const newPlayerHp = Math.max(0, prev.playerHp - damage);
        const wildSpecies = craftureSpecies.find(s => s.id === prev.wildCrafture.speciesId);
        const playerSpecies = craftureSpecies.find(s => s.id === prev.playerCrafture.speciesId);
        
        const multiplier = getTypeMultiplier(move.type, playerSpecies?.type || 'forest');
        
        let effectivenessMsg = '';
        if (multiplier > 1) effectivenessMsg = " It's super effective!";
        if (multiplier < 1) effectivenessMsg = " It's not very effective...";

        // Check for status effect application
        let newPlayerStatus = prev.playerStatus;
        let newPlayerStatusTurns = prev.playerStatusTurns;
        let statusMsg = '';
        
        if (move.statusEffect && move.statusChance && !prev.playerStatus) {
          if (Math.random() < move.statusChance) {
            newPlayerStatus = move.statusEffect;
            newPlayerStatusTurns = STATUS_EFFECTS[move.statusEffect].duration;
            statusMsg = ` ${prev.playerCrafture.nickname} is now ${STATUS_EFFECTS[move.statusEffect].name}ed! ${STATUS_EFFECTS[move.statusEffect].icon}`;
          }
        }

        // Apply status damage to wild after its turn
        let wildHpAfterStatus = prev.wildHp;
        let statusDamageLog: string | null = null;
        if (prev.wildStatus) {
          const result = applyStatusDamage(prev.wildHp, prev.wildCrafture.maxHp, prev.wildStatus, `Wild ${wildSpecies?.name}`);
          wildHpAfterStatus = result.newHp;
          statusDamageLog = result.log;
        }

        const newLog = [...prev.battleLog, `Wild ${wildSpecies?.name} used ${move.name}! ${move.icon} Dealt ${damage} damage!${effectivenessMsg}${statusMsg}`];
        if (statusDamageLog) newLog.push(statusDamageLog);

        if (newPlayerHp <= 0) {
          return {
            ...prev,
            playerHp: 0,
            wildHp: wildHpAfterStatus,
            playerStatus: newPlayerStatus,
            playerStatusTurns: newPlayerStatusTurns,
            wildStatusTurns: Math.max(0, prev.wildStatusTurns - 1),
            wildStatus: prev.wildStatusTurns <= 1 ? null : prev.wildStatus,
            battleLog: [...newLog, `${prev.playerCrafture.nickname} fainted!`],
            isOver: true,
            winner: 'wild',
            isAnimating: false,
          };
        }

        return {
          ...prev,
          playerHp: newPlayerHp,
          wildHp: wildHpAfterStatus,
          playerStatus: newPlayerStatus,
          playerStatusTurns: newPlayerStatusTurns,
          wildStatusTurns: Math.max(0, prev.wildStatusTurns - 1),
          wildStatus: prev.wildStatusTurns <= 1 ? null : prev.wildStatus,
          playerTurn: true,
          battleLog: newLog,
          isAnimating: false,
        };
      });
    }, 500);
  }, [battleState, calculateDamage, getTypeMultiplier, checkStatusSkipTurn, applyStatusDamage]);

  const triggerWildTurn = useCallback(() => {
    if (battleState && !battleState.playerTurn && !battleState.isOver && !battleState.isAnimating) {
      setTimeout(wildAttack, 1000);
    }
  }, [battleState, wildAttack]);

  const endBattle = useCallback(() => {
    if (!battleState) return;
    
    const won = battleState.winner === 'player';
    const levelDiff = Math.max(1, battleState.wildCrafture.level - battleState.playerCrafture.level + 5);
    const expGained = won ? Math.floor(battleState.wildCrafture.level * 20 * (levelDiff / 5)) : 0;
    const hungerLost = Math.floor(15 + battleState.wildCrafture.level * 2);
    
    onBattleEnd(won, expGained, hungerLost);
    setBattleState(null);
  }, [battleState, onBattleEnd]);

  const flee = useCallback(() => {
    if (!battleState || battleState.isOver) return;
    
    const fleeChance = 0.5 + (battleState.playerCrafture.speed - battleState.wildCrafture.speed) / 100;
    const success = Math.random() < fleeChance;
    
    if (success) {
      setBattleState(prev => prev ? {
        ...prev,
        battleLog: [...prev.battleLog, 'Got away safely!'],
        isOver: true,
        winner: null,
      } : null);
    } else {
      setBattleState(prev => prev ? {
        ...prev,
        battleLog: [...prev.battleLog, "Couldn't escape!"],
        playerTurn: false,
      } : null);
    }
  }, [battleState]);

  // Switch crafture during battle (when current faints)
  const switchCrafture = useCallback((newCrafture: OwnedCrafture) => {
    if (!battleState) return;
    
    const newSpecies = craftureSpecies.find(s => s.id === newCrafture.speciesId);
    if (!newSpecies) return;
    
    const playerMoves = getCraftureMoves(newCrafture, newSpecies.type);
    
    setBattleState(prev => prev ? {
      ...prev,
      playerCrafture: newCrafture,
      playerHp: newCrafture.hp,
      playerMoves,
      playerStatus: null,
      playerStatusTurns: 0,
      playerTurn: true,
      isOver: false,
      winner: null,
      battleLog: [...prev.battleLog, `Go, ${newCrafture.nickname}!`],
    } : null);
  }, [battleState]);
  
  // Heal the current player crafture in battle (for items)
  const healInBattle = useCallback((healAmount: number) => {
    if (!battleState) return;
    
    setBattleState(prev => {
      if (!prev) return null;
      const newHp = Math.min(prev.playerCrafture.maxHp, prev.playerHp + healAmount);
      return {
        ...prev,
        playerHp: newHp,
        battleLog: [...prev.battleLog, `${prev.playerCrafture.nickname} restored ${healAmount} HP!`],
        playerTurn: false, // Using item ends turn
      };
    });
  }, [battleState]);

  return {
    battleState,
    startBattle,
    playerAttack,
    triggerWildTurn,
    flee,
    endBattle,
    switchCrafture,
    healInBattle,
  };
}
