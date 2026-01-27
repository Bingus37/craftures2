import { useState, useCallback, useEffect } from 'react';
import { OwnedCrafture, GameScreen, GameSave } from '@/types/crafture';
import { craftureSpecies } from '@/data/craftures';
import { ensureLearnedMoveIds } from '@/lib/moveLearning';

const SAVE_KEY = 'crafture-game-save';

export function useGameState() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('starter');
  const [ownedCraftures, setOwnedCraftures] = useState<OwnedCrafture[]>([]);
  const [selectedCraftureId, setSelectedCraftureId] = useState<string | null>(null);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [completedBiomeNodes, setCompletedBiomeNodes] = useState<string[]>([]);
  const [discoveredSpecies, setDiscoveredSpecies] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load game on mount
  useEffect(() => {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      try {
        const saveData: GameSave = JSON.parse(saved);
        const craftures = saveData.ownedCraftures.map(c => ({
          ...c,
          caughtAt: new Date(c.caughtAt),
          lastFed: new Date(c.lastFed),
          lastPetted: new Date(c.lastPetted),
        }));
        setOwnedCraftures(craftures);
        setCompletedStages(saveData.completedStages || []);
        setCompletedBiomeNodes(saveData.completedBiomeNodes || []);
        setDiscoveredSpecies(saveData.discoveredSpecies || []);
        if (craftures.length > 0) {
          setCurrentScreen('menu');
          setSelectedCraftureId(craftures[0].id);
        }
      } catch (e) {
        console.error('Failed to load save:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Auto-save when game state changes
  useEffect(() => {
    if (isLoaded && ownedCraftures.length > 0) {
      const saveData: GameSave = {
        ownedCraftures,
        completedStages,
        completedBiomeNodes,
        discoveredSpecies,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    }
  }, [ownedCraftures, completedStages, completedBiomeNodes, discoveredSpecies, isLoaded]);

  const hasStarterPicked = ownedCraftures.length > 0;

  const createCraftureStats = (species: typeof craftureSpecies[0], level: number = 1) => {
    const hpBase = 50 + species.baseDefense;
    return {
      hp: Math.floor(hpBase + (level * 5)),
      maxHp: Math.floor(hpBase + (level * 5)),
      attack: Math.floor(species.baseAttack + (level * 2)),
      defense: Math.floor(species.baseDefense + (level * 1.5)),
      speed: Math.floor(species.baseSpeed + (level * 1)),
    };
  };

  const addCrafture = useCallback((speciesId: string, nickname?: string, level: number = 1) => {
    const species = craftureSpecies.find(s => s.id === speciesId);
    if (!species) return;

    const stats = createCraftureStats(species, level);
    const learnedMoveIds = ensureLearnedMoveIds(species.type, level, []);
    const newCrafture: OwnedCrafture = {
      id: `${speciesId}-${Date.now()}`,
      speciesId,
      nickname: nickname || species.name,
      happiness: species.baseHappiness,
      hunger: species.baseHunger,
      level,
      experience: 0,
      learnedMoveIds,
      ...stats,
      caughtAt: new Date(),
      lastFed: new Date(),
      lastPetted: new Date(),
    };

    setOwnedCraftures(prev => [...prev, newCrafture]);
    
    // Add to discovered species
    setDiscoveredSpecies(prev => {
      if (!prev.includes(speciesId)) {
        return [...prev, speciesId];
      }
      return prev;
    });
    
    return newCrafture;
  }, []);

  const discoverSpecies = useCallback((speciesId: string) => {
    setDiscoveredSpecies(prev => {
      if (!prev.includes(speciesId)) {
        return [...prev, speciesId];
      }
      return prev;
    });
  }, []);

  const completeStage = useCallback((stageId: number) => {
    setCompletedStages(prev => {
      if (!prev.includes(stageId)) {
        return [...prev, stageId];
      }
      return prev;
    });
  }, []);

  const completeBiomeNode = useCallback((nodeId: string) => {
    setCompletedBiomeNodes(prev => {
      if (!prev.includes(nodeId)) {
        return [...prev, nodeId];
      }
      return prev;
    });
  }, []);

  const feedCrafture = useCallback((craftureId: string, amount: number = 20) => {
    setOwnedCraftures(prev =>
      prev.map(c =>
        c.id === craftureId
          ? {
              ...c,
              hunger: Math.min(100, c.hunger + amount),
              happiness: Math.min(100, c.happiness + 5),
              lastFed: new Date(),
            }
          : c
      )
    );
  }, []);

  const drainHunger = useCallback((craftureId: string, amount: number) => {
    setOwnedCraftures(prev =>
      prev.map(c =>
        c.id === craftureId
          ? {
              ...c,
              hunger: Math.max(0, c.hunger - amount),
            }
          : c
      )
    );
  }, []);

  const petCrafture = useCallback((craftureId: string) => {
    setOwnedCraftures(prev =>
      prev.map(c =>
        c.id === craftureId
          ? {
              ...c,
              happiness: Math.min(100, c.happiness + 15),
              lastPetted: new Date(),
            }
          : c
      )
    );
  }, []);

  const playCrafture = useCallback((craftureId: string) => {
    setOwnedCraftures(prev =>
      prev.map(c =>
        c.id === craftureId
          ? {
              ...c,
              happiness: Math.min(100, c.happiness + 25),
              hunger: Math.max(0, c.hunger - 10),
              experience: c.experience + 10, // Small XP from play
            }
          : c
      )
    );
  }, []);

  const gainExperience = useCallback((craftureId: string, amount: number) => {
    setOwnedCraftures(prev =>
      prev.map(c => {
        if (c.id !== craftureId) return c;
        
        let newExp = c.experience + amount;
        let newLevel = c.level;
        let stats = { hp: c.hp, maxHp: c.maxHp, attack: c.attack, defense: c.defense, speed: c.speed };
        
        // Check for level ups (can level up multiple times at once)
        while (newExp >= newLevel * 100) {
          newExp -= newLevel * 100;
          newLevel++;
          
          const species = craftureSpecies.find(s => s.id === c.speciesId);
          if (species) {
            stats = createCraftureStats(species, newLevel);
          }
        }

        // Update learned moves based on level (combat leveling)
        const speciesNow = craftureSpecies.find(s => s.id === c.speciesId);
        const learnedMoveIds = speciesNow
          ? ensureLearnedMoveIds(speciesNow.type, newLevel, c.learnedMoveIds ?? [])
          : (c.learnedMoveIds ?? []);
        
        if (newLevel > c.level) {
          // Level up happened - full heal
          return {
            ...c,
            level: newLevel,
            experience: newExp,
            learnedMoveIds,
            ...stats,
            hp: stats.maxHp,
          };
        }
        
        return { ...c, experience: newExp, learnedMoveIds };
      })
    );
  }, []);

  const evolveCrafture = useCallback((craftureId: string, targetEvolutionId?: string) => {
    setOwnedCraftures(prev =>
      prev.map(c => {
        if (c.id !== craftureId) return c;
        
        const species = craftureSpecies.find(s => s.id === c.speciesId);
        if (!species) return c;
        
        // Handle branching evolution paths
        let evolvedSpeciesId: string | undefined;
        
        if (targetEvolutionId) {
          // Specific evolution target requested
          evolvedSpeciesId = targetEvolutionId;
        } else if (species.evolutionPaths && species.evolutionPaths.length > 0) {
          // Check branching evolution conditions
          for (const path of species.evolutionPaths) {
            if (c.level < path.levelRequired) continue;
            
            if (path.condition === 'high-hunger' && c.hunger >= 70) {
              evolvedSpeciesId = path.targetId;
              break;
            } else if (path.condition === 'low-hunger' && c.hunger < 30) {
              evolvedSpeciesId = path.targetId;
              break;
            } else if (!path.condition) {
              evolvedSpeciesId = path.targetId;
              break;
            }
          }
        } else if (species.evolvesTo && c.level >= (species.evolvesAt || 999)) {
          evolvedSpeciesId = species.evolvesTo;
        }
        
        if (!evolvedSpeciesId) return c;
        
        const evolvedSpecies = craftureSpecies.find(s => s.id === evolvedSpeciesId);
        if (!evolvedSpecies) return c;
        
        const stats = createCraftureStats(evolvedSpecies, c.level);
        const learnedMoveIds = ensureLearnedMoveIds(
          evolvedSpecies.type,
          c.level,
          c.learnedMoveIds ?? []
        );
        
        // Add evolved species to discovered
        setDiscoveredSpecies(prev => {
          if (!prev.includes(evolvedSpecies.id)) {
            return [...prev, evolvedSpecies.id];
          }
          return prev;
        });
        
        return {
          ...c,
          speciesId: evolvedSpecies.id,
          nickname: c.nickname === species.name ? evolvedSpecies.name : c.nickname,
          learnedMoveIds,
          ...stats,
          hp: stats.maxHp,
        };
      })
    );
  }, []);

  const checkCanEvolve = useCallback((crafture: OwnedCrafture): { canEvolve: boolean; paths?: { targetId: string; name: string; condition?: string }[] } => {
    const species = craftureSpecies.find(s => s.id === crafture.speciesId);
    if (!species) return { canEvolve: false };
    
    // Check branching evolution paths
    if (species.evolutionPaths && species.evolutionPaths.length > 0) {
      const availablePaths: { targetId: string; name: string; condition?: string }[] = [];
      
      for (const path of species.evolutionPaths) {
        if (crafture.level < path.levelRequired) continue;
        
        const targetSpecies = craftureSpecies.find(s => s.id === path.targetId);
        if (!targetSpecies) continue;
        
        // Check if condition is met
        if (path.condition === 'high-hunger' && crafture.hunger >= 70) {
          availablePaths.push({ targetId: path.targetId, name: targetSpecies.name, condition: 'Well Fed' });
        } else if (path.condition === 'low-hunger' && crafture.hunger < 30) {
          availablePaths.push({ targetId: path.targetId, name: targetSpecies.name, condition: 'Hungry' });
        } else if (!path.condition) {
          availablePaths.push({ targetId: path.targetId, name: targetSpecies.name });
        }
      }
      
      return { canEvolve: availablePaths.length > 0, paths: availablePaths };
    }
    
    // Standard evolution
    if (species.evolvesTo && crafture.level >= (species.evolvesAt || 999)) {
      const targetSpecies = craftureSpecies.find(s => s.id === species.evolvesTo);
      return { 
        canEvolve: true, 
        paths: targetSpecies ? [{ targetId: species.evolvesTo, name: targetSpecies.name }] : undefined 
      };
    }
    
    return { canEvolve: false };
  }, []);

  const healCrafture = useCallback((craftureId: string) => {
    setOwnedCraftures(prev =>
      prev.map(c =>
        c.id === craftureId
          ? { ...c, hp: c.maxHp }
          : c
      )
    );
  }, []);

  const updateCraftureHp = useCallback((craftureId: string, newHp: number) => {
    setOwnedCraftures(prev =>
      prev.map(c =>
        c.id === craftureId
          ? { ...c, hp: Math.max(0, Math.min(c.maxHp, newHp)) }
          : c
      )
    );
  }, []);

  const getSelectedCrafture = useCallback(() => {
    return ownedCraftures.find(c => c.id === selectedCraftureId) || null;
  }, [ownedCraftures, selectedCraftureId]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(SAVE_KEY);
    setOwnedCraftures([]);
    setSelectedCraftureId(null);
    setCompletedStages([]);
    setCompletedBiomeNodes([]);
    setDiscoveredSpecies([]);
    setCurrentScreen('starter');
  }, []);

  return {
    currentScreen,
    setCurrentScreen,
    ownedCraftures,
    selectedCraftureId,
    setSelectedCraftureId,
    completedStages,
    completedBiomeNodes,
    discoveredSpecies,
    hasStarterPicked,
    isLoaded,
    addCrafture,
    discoverSpecies,
    completeStage,
    completeBiomeNode,
    feedCrafture,
    drainHunger,
    petCrafture,
    playCrafture,
    gainExperience,
    evolveCrafture,
    checkCanEvolve,
    healCrafture,
    updateCraftureHp,
    getSelectedCrafture,
    resetGame,
  };
}
